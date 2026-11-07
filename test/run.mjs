// Checks the banks: node test/run.mjs [bank file …]   (default: all of js/bank/g*.js)
// Skills: draws 300 drills per topic and checks the text in both languages, that the answer is well formed and
// passes the checker, that options are distinct and that drills vary. Prompts: checks every field.
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { rng } from '../js/util.js';
import { check } from '../js/check.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(path.join(root, 'js/bank')).filter((f) => /^g.*\.js$/.test(f)).map((f) => path.join(root, 'js/bank', f));
const bad = (s) => typeof s !== 'string' || !s.trim() || /undefined|NaN|\[object|\{t\}/.test(s.replace(/<[^>]*>/g, ''));
const txt = (x) => (typeof x === 'string' ? [x, x] : x && typeof x === 'object' ? [x.zh, x.en] : [undefined, undefined]);
const hasZh = (s) => /[一-鿿]/.test(String(s).replace(/<[^>]*>/g, ''));
const ids = new Set();
const GENRES = ['narrative', 'opinion', 'informative', 'letter', 'poem', 'descriptive', 'research', 'argument', 'literary', 'summary', 'compare', 'personal', 'procedural'];
const UNITS = ['mechanics', 'grammar', 'sentences', 'words', 'paragraphs', 'organization', 'style', 'research'];
let errs = 0, nSkill = 0, nPrompt = 0; const per = {};
const fail = (id, seed, msg) => { if (errs++ < 80) console.log(`✗ ${id} ${seed}: ${msg}`); };

for (const f of files) {
  const bank = (await import(pathToFileURL(path.resolve(f)).href)).default;
  for (const tp of bank.skills || []) {
    nSkill++; const id = tp.id;
    if (!id || ids.has(id)) fail(id, '-', 'missing or duplicate id'); ids.add(id);
    if (!(tp.grade >= 1 && tp.grade <= 12)) fail(id, '-', 'bad grade');
    if (!UNITS.includes(tp.unit)) fail(id, '-', 'bad unit ' + tp.unit);
    if (txt(tp.name).some(bad) || hasZh(tp.name?.en)) fail(id, '-', 'bad name');
    if (!tp.lesson || bad(tp.lesson.zh) || bad(tp.lesson.en) || hasZh(tp.lesson.en) || !Array.isArray(tp.lesson.ex) || !tp.lesson.ex.length) fail(id, '-', 'bad lesson');
    per['s' + tp.grade] = (per['s' + tp.grade] || 0) + 1;
    const seen = new Set();
    for (let seed = 1; seed <= 300; seed++) {
      let q; try { q = tp.gen(rng(seed * 7919 + 13)); } catch (e) { fail(id, seed, 'throws ' + e.message); continue; }
      const [qz, qe] = txt(q.q);
      if (bad(qz) || bad(qe) || hasZh(qe)) { fail(id, seed, 'bad question ' + JSON.stringify(q.q).slice(0, 160)); continue; }
      if (q.text != null && (bad(q.text) || hasZh(q.text))) fail(id, seed, 'bad text');
      if (!Array.isArray(q.sol) || q.sol.length < 2) fail(id, seed, 'solution needs 2+ steps');
      else for (const st of q.sol) { const [a, b] = txt(st); if (bad(a) || bad(b) || hasZh(b)) { fail(id, seed, 'bad solution step ' + JSON.stringify(st).slice(0, 160)); break; } }
      const a = q.ans; seen.add(qe + (q.text || '') + JSON.stringify(a));
      if (!a) { fail(id, seed, 'no answer'); continue; }
      if (a.type === 'choice') {
        if (!Array.isArray(a.options) || a.options.length < 2 || a.options.length > 6) fail(id, seed, 'choice needs 2–6 options');
        else if (new Set(a.options.map((o) => JSON.stringify(o))).size !== a.options.length) fail(id, seed, 'duplicate options ' + JSON.stringify(a.options));
        else if (a.options.some((o) => txt(o).some(bad))) fail(id, seed, 'bad option');
        if (a.correct !== 0) fail(id, seed, 'correct must be 0');
      } else if (a.type === 'tap') {
        if (!Array.isArray(a.words) || a.words.length < 2 || a.words.some(bad)) fail(id, seed, 'bad tap words');
        else if (!a.correct.length || a.correct.some((k) => !(k >= 0 && k < a.words.length))) fail(id, seed, 'bad tap index');
        else if (!check(a, a.correct).ok) fail(id, seed, 'tap answer fails checker');
      } else if (a.type === 'order') {
        if (!Array.isArray(a.items) || a.items.length < 3 || a.items.length > 8 || a.items.some(bad)) fail(id, seed, 'order needs 3–8 items');
        else if (new Set(a.items).size !== a.items.length) fail(id, seed, 'duplicate order items');
      } else if (a.type === 'text') {
        if (!a.v.length || a.v.some(bad) || !check(a, a.text).ok) fail(id, seed, 'bad text answer');
      } else fail(id, seed, 'unknown answer type');
    }
    if (seen.size < 15) fail(id, '-', `only ${seen.size} different drills in 300 draws`);
  }
  for (const p of bank.prompts || []) {
    nPrompt++; const id = p.id;
    if (!id || ids.has(id)) fail(id, '-', 'missing or duplicate id'); ids.add(id);
    if (!(p.grade >= 1 && p.grade <= 12)) fail(id, '-', 'bad grade');
    if (!GENRES.includes(p.genre)) fail(id, '-', 'bad genre ' + p.genre);
    per['p' + p.grade] = (per['p' + p.grade] || 0) + 1;
    if (txt(p.title).some(bad) || hasZh(p.title?.en)) fail(id, '-', 'bad title');
    if (!Array.isArray(p.topics) || p.topics.length < 4) fail(id, '-', 'needs 4+ topics');
    else for (const t of p.topics) { const [z, e] = txt(t); const fill = (s, v) => s.split('{t}').join(v); if ([fill(p.prompt.zh, z), fill(p.prompt.en, e)].some(bad) || hasZh(fill(p.prompt.en, e))) { fail(id, '-', 'bad prompt/topic ' + JSON.stringify(t)); break; } }
    if (!p.prompt || !p.prompt.en.includes('{t}') || !p.prompt.zh.includes('{t}')) fail(id, '-', 'prompt needs {t} in both languages');
    if (!Array.isArray(p.plan) || p.plan.length < 2 || p.plan.some((x) => txt(x.label).some(bad) || txt(x.hint).some(bad))) fail(id, '-', 'bad plan');
    if (!Array.isArray(p.starters) || p.starters.length < 3 || p.starters.some((s) => bad(s) || hasZh(s))) fail(id, '-', 'bad starters');
    if (!Array.isArray(p.words) || !(p.words[0] > 0 && p.words[1] > p.words[0])) fail(id, '-', 'bad words');
    if (!Array.isArray(p.checklist) || p.checklist.length < 4 || p.checklist.some((c) => txt(c).some(bad))) fail(id, '-', 'bad checklist');
    const m = p.mentor;
    if (!m || bad(m.title) || bad(m.text) || hasZh(m.text) || txt(m.note).some(bad)) fail(id, '-', 'bad mentor');
    else { const wc = m.text.split(/\s+/).length; if (wc < p.words[0] * 0.6 || wc > p.words[1] * 1.6) fail(id, '-', `mentor text is ${wc} words, target ${p.words}`); }
  }
}
console.log(`${nSkill} skills, ${nPrompt} prompts, ${errs} problems`);
console.log(Object.entries(per).sort((a, b) => a[0][0].localeCompare(b[0][0]) || parseInt(a[0].slice(1)) - parseInt(b[0].slice(1))).map(([k, v]) => `${k}:${v}`).join(' '));
process.exit(errs ? 1 : 0);
