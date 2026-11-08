// Writing Dojo: grades 1–12. Each grade has skill drills (auto-checked, endless) and writing tasks (plan → draft →
// revise with automatic feedback and a checklist → compare with a model text). Hash routes:
//   #/  #/g/5  #/s/<skill>  #/w/<prompt>  #/quiz/5  #/print/<skill|g5>  #/mine
import BANK from './bank/index.js';
import { rng, tx, esc } from './util.js';
import { check } from './check.js';
import { analyze } from './feedback.js';
import { logAnswer, logActivity } from './learnlog.js';

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const store = {
  get(k, d) { try { const v = localStorage.getItem('wd-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('wd-' + k, JSON.stringify(v)); } catch {} },
  keys() { try { return Object.keys(localStorage).filter((k) => k.startsWith('wd-draft:')).map((k) => k.slice(3)); } catch { return []; } },
};
let lang = store.get('lang', (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
const stats = store.get('stats', {});
const L = (zh, en) => (lang === 'zh' ? zh : en);
const X = (x) => tx(x, lang);
const SKILLS = BANK.skills, PROMPTS = BANK.prompts;

const ZH_N = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const gradeName = (g) => L(`${ZH_N[g]}年級`, `Grade ${g}`);
const UNITS = {
  mechanics: ['大寫與標點', 'Capitals & punctuation', '🔤'], grammar: ['文法', 'Grammar', '🧩'], sentences: ['句子', 'Sentences', '✏️'],
  words: ['字詞', 'Words & vocabulary', '📗'], paragraphs: ['段落', 'Paragraphs', '📄'], organization: ['組織與結構', 'Organization', '🧱'],
  style: ['風格與修辭', 'Style & rhetoric', '🎭'], research: ['研究與引用', 'Research & sources', '🔎'],
};
const GENRES = {
  narrative: ['故事', 'Narrative', '📖'], personal: ['個人經驗', 'Personal narrative', '🧒'], opinion: ['看法', 'Opinion', '💬'],
  argument: ['論說', 'Argument', '⚖️'], informative: ['說明', 'Informative', '📘'], procedural: ['步驟說明', 'How-to', '🔧'],
  letter: ['書信', 'Letter', '✉️'], poem: ['詩', 'Poetry', '🎵'], descriptive: ['描寫', 'Descriptive', '🎨'], research: ['研究報告', 'Research', '🔎'],
  literary: ['文學評論', 'Literary response', '📚'], summary: ['摘要', 'Summary', '📝'], compare: ['比較', 'Compare & contrast', '🔀'],
};
const genre = (g) => GENRES[g] || ['寫作', 'Writing', '✍️'];
const skillsFor = (g) => SKILLS.filter((s) => s.grade === g);
const promptsFor = (g) => PROMPTS.filter((p) => p.grade === g);
const byId = (id) => SKILLS.find((s) => s.id === id);
const promptById = (id) => PROMPTS.find((p) => p.id === id);
const newSeed = () => (Math.random() * 2 ** 31) >>> 0;
const draw = (tp, seed) => ({ ...tp.gen(rng(seed)), tp, seed });
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function stars(id) { const s = stats[id]; if (!s) return 0; const [n, ok] = s; return ok >= 20 && ok / n >= 0.8 ? 3 : ok >= 8 ? 2 : ok >= 3 ? 1 : 0; }
const starHTML = (k) => `<span class="stars">${'★'.repeat(k)}<i>${'★'.repeat(3 - k)}</i></span>`;
function record(id, ok) {
  const s = (stats[id] ||= [0, 0]); s[0]++; if (ok) s[1]++; store.set('stats', stats);
  const tp = byId(id); if (tp) logAnswer('writingdojo', LOG_META, { id, name: tp.name, grade: tp.grade }, ok);
}
const LOG_META = { name: { zh: '寫作練功房', en: 'Writing Dojo' }, url: '/writing-dojo/' };
const draftOf = (id) => store.get('draft:' + id, null);

// ---------- header ----------
let relang = null;
function header() {
  $('.bt').innerHTML = `<b>${L('寫作練功房', 'Writing Dojo')}</b><small>${L('1–12 年級英文寫作 · 技巧練習 · 寫作任務', 'English writing, grades 1–12 · skills · writing tasks')}</small>`;
  $('#lang').textContent = lang === 'zh' ? 'EN' : '中文';
  $('#mine').textContent = L('📂 我的作品', '📂 My writing');
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = L('寫作練功房 Writing Dojo', 'Writing Dojo 寫作練功房');
  $('#foot').innerHTML = L(`共 ${SKILLS.length} 個技巧單元（題目隨機產生）和 ${PROMPTS.length} 個寫作任務，依照美國 Common Core 英文寫作與語言標準分年級。作品和進度只存在這台裝置的瀏覽器裡。`,
    `${SKILLS.length} skill units (questions generated fresh each time) and ${PROMPTS.length} writing tasks, by grade, following the US Common Core Writing and Language standards. Work and progress are saved only in this browser.`);
}
$('#lang').onclick = () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set('lang', lang); header(); relang ? relang() : route(); };

// ---------- pages ----------
function home() {
  let h = `<section class="hero"><h1>${L('今天想練哪一年級的寫作？', 'Which grade are we writing in today?')}</h1>
    <p>${L('每個年級有兩部分：<b>寫作技巧</b>（文法、標點、句子、段落…，答完馬上看解說）和<b>寫作任務</b>（先計畫、再寫草稿、最後修改，電腦會幫你檢查）。', 'Each grade has <b>skills</b> (grammar, punctuation, sentences, paragraphs… with an explanation after every answer) and <b>writing tasks</b> (plan, draft, then revise with automatic feedback).')}</p></section><div class="grades">`;
  for (let g = 1; g <= 12; g++) {
    const sk = skillsFor(g), pr = promptsFor(g), done = sk.reduce((s, tp) => s + stars(tp.id), 0), max = sk.length * 3;
    const band = g <= 3 ? 'b1' : g <= 6 ? 'b2' : g <= 9 ? 'b3' : 'b4';
    h += `<a class="gcard ${band}" href="#/g/${g}"><span class="gn">${g}</span><span class="gl">${gradeName(g)}</span>
      <span class="gc">${L(`${sk.length} 個技巧 · ${pr.length} 個寫作任務`, `${sk.length} skills · ${pr.length} tasks`)}</span>
      <span class="bar"><i style="width:${max ? (100 * done) / max : 0}%"></i></span></a>`;
  }
  app.innerHTML = h + '</div>';
}

function grade(g) {
  const sk = skillsFor(g), pr = promptsFor(g);
  const units = Object.keys(UNITS).filter((u) => sk.some((s) => s.unit === u));
  let h = `<nav class="crumb"><a href="#/">← ${L('所有年級', 'All grades')}</a></nav>
    <section class="ghead"><h1>${gradeName(g)}</h1>
    <div class="acts"><a class="btn big" href="#/quiz/${g}">🎯 ${L('技巧小測驗 10 題', 'Skills quiz · 10 questions')}</a>
    <a class="btn ghost" href="#/print/g${g}">🖨️ ${L('列印技巧練習單', 'Print a skills worksheet')}</a></div></section>
    <h2 class="sec">✍️ ${L('寫作任務', 'Writing tasks')}</h2><div class="topics">`;
  h += pr.map((p) => {
    const d = draftOf(p.id), G = genre(p.genre);
    const wc = d?.draft ? (d.draft.match(/[A-Za-z']+/g) || []).length : 0;
    return `<a class="topic task" href="#/w/${p.id}"><span class="tn">${G[2]} ${X(p.title)}</span><span class="gtag">${L(G[0], G[1])}</span>
      <span class="tags"><span class="tag">${esc(p.std)}</span><span class="tag">${L(`${p.words[0]}–${p.words[1]} 字`, `${p.words[0]}–${p.words[1]} words`)}</span></span>
      <span class="ts">${d ? L(`已寫 ${wc} 字`, `${wc} words written`) : L('還沒開始', 'Not started')}</span></a>`;
  }).join('') + '</div>';
  for (const u of units) {
    h += `<h2 class="sec">${UNITS[u][2]} ${L(UNITS[u][0], UNITS[u][1])}</h2><div class="topics">` + sk.filter((s) => s.unit === u).map((tp) => {
      const s = stats[tp.id];
      return `<a class="topic" href="#/s/${tp.id}"><span class="tn">${X(tp.name)}</span>${starHTML(stars(tp.id))}
        <span class="tags"><span class="tag">${esc(tp.std)}</span></span><span class="ts">${s ? L(`答對 ${s[1]} / ${s[0]} 題`, `${s[1]} / ${s[0]} correct`) : L('還沒練習', 'Not started')}</span></a>`;
    }).join('') + '</div>';
  }
  app.innerHTML = h;
}

// a drill card; onDone(ok, given) after the last try
function card(q, el, { tries = 2, onDone, quiz = false } = {}) {
  let left = tries, finished = false;
  const a = q.ans, R = rng(q.seed ^ 0x5bd1e995);
  const opts = a.type === 'choice' ? R.shuffle(a.options.map((o, i) => ({ o, i }))) : null;
  const ord = a.type === 'order' ? (() => { let s; do s = R.shuffle(a.items.map((o, i) => i)); while (s.every((x, i) => x === i)); return s; })() : null;
  const tapSel = new Set(), seq = [];
  let body = '';
  if (opts) body = `<div class="choices">${opts.map((x, k) => `<button class="ch" data-i="${x.i}"><b>${'ABCDEF'[k]}</b><span>${X(x.o)}</span></button>`).join('')}</div>`;
  else if (a.type === 'tap') body = `<div class="tapline">${a.words.map((w, i) => `<button class="tw" data-i="${i}">${esc(w)}</button>`).join(' ')}</div><div class="row"><button class="btn" id="go">${L('送出', 'Check')}</button></div>`;
  else if (a.type === 'order') body = `<div class="ordpool">${ord.map((i) => `<button class="oi" data-i="${i}"><b></b><span>${esc(a.items[i])}</span></button>`).join('')}</div>
      <div class="row"><button class="btn ghost" id="undo">↶ ${L('重來', 'Reset')}</button><button class="btn" id="go" disabled>${L('送出', 'Check')}</button></div>`;
  else body = `<form class="ansrow" autocomplete="off"><input id="ans" type="text" spellcheck="false" autocapitalize="off" placeholder="${L('輸入答案', 'Your answer')}"><button class="btn" type="submit">${L('送出', 'Check')}</button></form>`;
  el.innerHTML = `<div class="q">${X(q.q)}</div>${q.text ? `<div class="passage">${q.text}</div>` : ''}${body}
    <div class="fb" aria-live="polite"></div>${q.hint && !quiz ? `<button class="link hintb">💡 ${L('提示', 'Hint')}</button>` : ''}<div class="sol" hidden></div>`;
  const fb = $('.fb', el), solEl = $('.sol', el);
  const showSol = () => {
    solEl.hidden = false;
    solEl.innerHTML = `<h3>📖 ${L('解說', 'Explanation')}</h3><ol>${q.sol.map((s) => `<li>${X(s)}</li>`).join('')}</ol>${a.type === 'text' ? `<p class="ansline">${L('答案', 'Answer')}：<b>${esc(a.text)}</b></p>` : ''}`;
    $('h3', solEl).onclick = () => solEl.classList.remove('fold');
  };
  const reveal = () => {
    if (opts) el.querySelectorAll('.ch').forEach((b) => { if (+b.dataset.i === a.correct) b.classList.add('right'); });
    if (a.type === 'tap') el.querySelectorAll('.tw').forEach((b) => { const i = +b.dataset.i; b.classList.toggle('right', a.correct.includes(i)); b.classList.toggle('wrong', tapSel.has(i) && !a.correct.includes(i)); });
    if (a.type === 'order') $('.ordpool', el).innerHTML = a.items.map((s, i) => `<div class="oi done"><b>${i + 1}</b><span>${esc(s)}</span></div>`).join('');
  };
  const end = (ok, given) => {
    finished = true;
    el.querySelectorAll('button:not(.link), input').forEach((b) => (b.disabled = true));
    reveal();
    if (!quiz) { record(q.tp.id, ok); showSol(); if (ok) solEl.classList.add('fold'); }
    onDone?.(ok, given);
  };
  const judge = (given, btn) => {
    if (finished) return;
    const r = check(a, given);
    if (r.ok) { fb.className = 'fb ok'; fb.innerHTML = `✅ ${L(pick(['答對了！', '太棒了！', '完全正確！', '好厲害！']), pick(['Correct!', 'Great job!', 'Exactly right!', 'Nice work!']))}`; btn?.classList.add('right'); return end(true, given); }
    left--; btn?.classList.add('wrong'); if (btn) btn.disabled = true;
    if (left > 0 && !quiz) {
      fb.className = 'fb no';
      const part = a.type === 'tap' && r.part ? L(`（你選對了 ${r.part} 個，但還有地方不對）`, ` (you found ${r.part}, but something is still off)`) : '';
      fb.innerHTML = `🤔 ${L('不太對，再想一次！', 'Not quite — try once more!')}${part}${q.hint ? ` <span class="h">💡 ${X(q.hint)}</span>` : ''}`;
      if (a.type === 'order') resetOrder();
      return;
    }
    fb.className = 'fb no'; fb.innerHTML = quiz ? '' : `❌ ${L('沒關係，看看解說。', 'That’s OK — read the explanation.')}`;
    end(false, given);
  };
  let resetOrder = () => {};
  if (opts) el.querySelectorAll('.ch').forEach((b) => (b.onclick = () => judge(+b.dataset.i, b)));
  else if (a.type === 'tap') {
    el.querySelectorAll('.tw').forEach((b) => (b.onclick = () => { const i = +b.dataset.i; tapSel.has(i) ? tapSel.delete(i) : tapSel.add(i); b.classList.toggle('sel', tapSel.has(i)); }));
    $('#go', el).onclick = () => { if (tapSel.size) judge([...tapSel]); };
  } else if (a.type === 'order') {
    const go = $('#go', el);
    const paint = () => { el.querySelectorAll('.oi').forEach((b) => { const k = seq.indexOf(+b.dataset.i); b.querySelector('b').textContent = k >= 0 ? k + 1 : ''; b.classList.toggle('sel', k >= 0); }); go.disabled = seq.length !== a.items.length; };
    resetOrder = () => { seq.length = 0; paint(); };
    el.querySelectorAll('.oi').forEach((b) => (b.onclick = () => { const i = +b.dataset.i; const k = seq.indexOf(i); if (k >= 0) seq.splice(k); else seq.push(i); paint(); }));
    $('#undo', el).onclick = resetOrder;
    go.onclick = () => judge(seq.slice());
  } else {
    const inp = $('#ans', el);
    $('.ansrow', el).onsubmit = (e) => { e.preventDefault(); if (inp.value.trim()) judge(inp.value); };
    setTimeout(() => inp.focus({ preventScroll: true }), 30);
  }
  const hb = $('.hintb', el); if (hb) hb.onclick = () => { hb.remove(); fb.className = 'fb'; fb.innerHTML = `💡 ${X(q.hint)}`; };
}
function givenText(q, given) {
  const a = q.ans;
  if (given == null) return '—';
  if (a.type === 'choice') return X(a.options[given]);
  if (a.type === 'tap') return given.map((i) => esc(a.words[i])).join(', ');
  if (a.type === 'order') return given.map((i) => i + 1).join(' → ');
  return esc(given);
}
function rightText(q) {
  const a = q.ans;
  if (a.type === 'choice') return X(a.options[a.correct]);
  if (a.type === 'tap') return a.correct.map((i) => esc(a.words[i])).join(', ');
  if (a.type === 'order') return a.items.map((s, i) => `${i + 1}. ${esc(s)}`).join('<br>');
  return esc(a.text);
}
const lessonHTML = (tp, open) => `<details class="lesson" ${open ? 'open' : ''}><summary>📘 ${L('小課堂', 'Mini-lesson')}</summary>
  <p>${tp.lesson[lang] || tp.lesson.en}</p>${lang === 'zh' ? `<p class="en2">${tp.lesson.en}</p>` : ''}<ul class="ex">${tp.lesson.ex.map((e) => `<li>${e}</li>`).join('')}</ul></details>`;

let cleanup = null;
function practice(id, seed0) {
  const tp = byId(id); if (!tp) return (location.hash = '#/');
  let streak = 0, right = 0, done = 0, q;
  app.innerHTML = `<nav class="crumb"><a href="#/g/${tp.grade}">← ${gradeName(tp.grade)}</a></nav>
    <section class="phead"><h1>${X(tp.name)}</h1><span class="tags"><span class="tag">${UNITS[tp.unit][2]} ${L(UNITS[tp.unit][0], UNITS[tp.unit][1])}</span><span class="tag">${esc(tp.std)}</span></span></section>
    ${lessonHTML(tp, !stats[tp.id])}
    <div class="score"><span id="sc"></span><span id="st"></span><a class="link" href="#/print/${tp.id}">🖨️ ${L('列印練習單', 'Worksheet')}</a></div>
    <article class="card" id="card"></article><div class="next"><button class="btn big" id="next" hidden>${L('下一題', 'Next')} →</button></div>`;
  const sc = () => { $('#sc').innerHTML = L(`本次答對 <b>${right}</b> / ${done}`, `This session: <b>${right}</b> / ${done}`); $('#st').innerHTML = streak >= 2 ? `🔥 ${L(`連續答對 ${streak} 題`, `${streak} in a row`)}` : ''; };
  const nextB = $('#next');
  const one = (seed) => {
    q = draw(tp, seed); nextB.hidden = true;
    card(q, $('#card'), { onDone(ok) { done++; if (ok) { right++; streak++; } else streak = 0; sc(); nextB.hidden = false; nextB.focus({ preventScroll: true }); } });
    sc();
  };
  nextB.onclick = () => one(newSeed());
  const key = (e) => { if (e.key === 'Enter' && !nextB.hidden && document.activeElement?.id !== 'ans') { e.preventDefault(); nextB.click(); } };
  document.addEventListener('keydown', key); cleanup = () => document.removeEventListener('keydown', key);
  one(seed0 ?? newSeed());
  relang = () => practice(id, q.seed);
}

function quiz(g) {
  const tps = skillsFor(g); if (!tps.length) return (location.hash = '#/g/' + g);
  const order = []; let pool = [];
  while (order.length < 10) { if (!pool.length) pool = tps.slice().sort(() => Math.random() - 0.5); order.push(pool.pop()); }
  const qs = order.map((tp) => draw(tp, newSeed())), res = [];
  let k = 0, nextB;
  const shell = () => {
    app.innerHTML = `<nav class="crumb"><a href="#/g/${g}">← ${gradeName(g)}</a></nav><section class="phead"><h1>🎯 ${L('技巧小測驗', 'Skills quiz')} · ${gradeName(g)}</h1></section>
      <div class="qprog" id="qp"></div><article class="card" id="card"></article><div class="next"><button class="btn big" id="next" hidden></button></div>`;
    nextB = $('#next'); nextB.onclick = () => (++k < 10 ? show() : results());
  };
  const show = () => {
    const q = qs[k];
    $('#qp').innerHTML = qs.map((_, i) => `<i class="${i < k ? (res[i].ok ? 'ok' : 'no') : i === k ? 'now' : ''}"></i>`).join('') + `<span>${k + 1} / 10 · ${X(q.tp.name)}</span>`;
    nextB.hidden = true;
    card(q, $('#card'), { tries: 1, quiz: true, onDone(ok, given) {
      if (!res[k]) record(q.tp.id, ok); res[k] = { ok, given };
      nextB.textContent = k < 9 ? L('下一題 →', 'Next →') : L('看成績 →', 'See results →'); nextB.hidden = false; nextB.focus({ preventScroll: true });
    } });
  };
  const results = () => {
    const n = res.filter((r) => r.ok).length;
    const msg = n === 10 ? L('滿分！太厲害了！🏆', 'Perfect score! 🏆') : n >= 8 ? L('很棒！🌟', 'Great work! 🌟') : n >= 5 ? L('不錯喔，看看錯的題目。💪', 'Good — check the ones you missed. 💪') : L('先看解說，再挑單元慢慢練。📚', 'Read the explanations, then practice skill by skill. 📚');
    app.innerHTML = `<nav class="crumb"><a href="#/g/${g}">← ${gradeName(g)}</a></nav>
      <section class="result"><div class="big-score">${n}<small>/10</small></div><p>${msg}</p>
      <div class="acts"><button class="btn big" id="again">${L('再考一次', 'Another quiz')}</button><a class="btn ghost" href="#/g/${g}">${L('回到年級', 'Back to the grade')}</a></div></section>
      <div class="review">${qs.map((q, i) => `<details class="rv ${res[i].ok ? 'ok' : 'no'}" ${res[i].ok ? '' : 'open'}><summary><b>${i + 1}.</b> ${res[i].ok ? '✅' : '❌'} ${X(q.tp.name)}</summary>
        <div class="q">${X(q.q)}</div>${q.text ? `<div class="passage">${q.text}</div>` : ''}${q.ans.type === 'tap' ? `<div class="passage">${q.ans.words.map(esc).join(' ')}</div>` : ''}
        <p>${L('你的答案', 'Your answer')}：<b>${givenText(q, res[i].given)}</b><br>${L('正確答案', 'Correct answer')}：<b>${rightText(q)}</b></p>
        <ol class="steps">${q.sol.map((s) => `<li>${X(s)}</li>`).join('')}</ol></details>`).join('')}</div>`;
    $('#again').onclick = () => quiz(g);
  };
  shell(); show();
  relang = () => { if (k >= 10) results(); else { shell(); show(); } };
}

// ---------- the writing studio ----------
function studio(id) {
  const p = promptById(id); if (!p) return (location.hash = '#/');
  const G = genre(p.genre);
  const d = draftOf(id) || { topic: Math.floor(Math.random() * p.topics.length), plan: [], draft: '', checks: [], step: 0 };
  const save = () => { d.updated = Date.now(); store.set('draft:' + id, d); };
  const promptText = () => X(p.prompt).split('{t}').join(`<b>${X(p.topics[d.topic])}</b>`);
  const wc = () => (d.draft.match(/[A-Za-z']+/g) || []).length;
  const steps = [['① 計畫', '① Plan'], ['② 草稿', '② Draft'], ['③ 修改', '③ Revise'], ['④ 範文', '④ Model']];
  const render = () => {
    app.innerHTML = `<nav class="crumb"><a href="#/g/${p.grade}">← ${gradeName(p.grade)}</a></nav>
      <section class="phead"><h1>${G[2]} ${X(p.title)}</h1><span class="tags"><span class="tag">${L(G[0], G[1])}</span><span class="tag">${esc(p.std)}</span><span class="tag">${L(`目標 ${p.words[0]}–${p.words[1]} 字`, `Goal ${p.words[0]}–${p.words[1]} words`)}</span></span></section>
      <article class="card prompt"><div class="q">${promptText()}</div>${lang === 'zh' ? `<p class="en2">${p.prompt.en.split('{t}').join(`<b>${p.topics[d.topic].en}</b>`)}</p>` : ''}
        <div class="topicpick"><span>${L('換題目：', 'Topic:')}</span>${p.topics.map((t, i) => `<button class="chip ${i === d.topic ? 'on' : ''}" data-t="${i}">${X(t)}</button>`).join('')}</div></article>
      <div class="stepper">${steps.map((s, i) => `<button class="stp ${i === d.step ? 'on' : ''}" data-s="${i}">${L(...s)}</button>`).join('')}</div>
      <article class="card" id="stage"></article>`;
    app.querySelectorAll('.chip').forEach((b) => (b.onclick = () => { d.topic = +b.dataset.t; save(); render(); }));
    app.querySelectorAll('.stp').forEach((b) => (b.onclick = () => { d.step = +b.dataset.s; save(); render(); }));
    stage();
  };
  const stage = () => {
    const el = $('#stage');
    if (d.step === 0) {
      el.innerHTML = `<p class="muted">${L('先把想法寫成重點（可以用中文或英文的關鍵字），再開始寫草稿。', 'Jot down your ideas first — key words are fine — then start the draft.')}</p>
        ${p.plan.map((b, i) => `<label class="plan"><span class="pl">${i + 1}. ${X(b.label)}</span><span class="ph">${X(b.hint)}</span><textarea rows="2" data-i="${i}">${esc(d.plan[i] || '')}</textarea></label>`).join('')}
        <div class="row"><button class="btn" id="toDraft">${L('把計畫放進草稿，開始寫 →', 'Put my plan into the draft →')}</button></div>`;
      el.querySelectorAll('textarea').forEach((t) => (t.oninput = () => { d.plan[+t.dataset.i] = t.value; save(); }));
      $('#toDraft').onclick = () => {
        if (!d.draft.trim()) d.draft = p.plan.map((b, i) => (d.plan[i] || '').trim()).filter(Boolean).join('\n\n');
        d.step = 1; save(); render();
      };
    } else if (d.step === 1) {
      el.innerHTML = `<div class="starters"><span>${L('句子開頭（點一下插入）：', 'Sentence starters (tap to insert):')}</span>${p.starters.map((s) => `<button class="chip">${esc(s)}</button>`).join('')}</div>
        ${p.vocab?.length ? `<div class="starters"><span>${L('試著用：', 'Try using:')}</span>${p.vocab.map((s) => `<button class="chip v">${esc(s)}</button>`).join('')}</div>` : ''}
        <textarea id="draft" class="draft" spellcheck="true" placeholder="${L('在這裡用英文寫…（空一行就是新的一段）', 'Write here… (leave a blank line between paragraphs)')}">${esc(d.draft)}</textarea>
        <div class="row between"><span id="wc" class="wc"></span><span><button class="btn ghost" id="dl">💾 ${L('下載', 'Download')}</button> <button class="btn" id="toRev">${L('檢查我的文章 →', 'Check my writing →')}</button></span></div>`;
      const ta = $('#draft'), wcEl = $('#wc');
      const upd = () => { const n = wc(); const [lo, hi] = p.words; wcEl.innerHTML = `${L('字數', 'Words')}: <b class="${n < lo ? 'lo' : n > hi * 1.25 ? 'hi' : 'okc'}">${n}</b> / ${lo}–${hi}`; };
      ta.oninput = () => { d.draft = ta.value; save(); upd(); }; upd();
      el.querySelectorAll('.chip').forEach((b) => (b.onclick = () => {
        const s = ta.selectionStart, ins = b.textContent.replace(/…$/, '').replace(/\s*…\s*/g, ' ');
        const pre = ta.value.slice(0, s), sep = pre && !/\s$/.test(pre) ? ' ' : '';
        ta.value = pre + sep + ins + (b.classList.contains('v') ? ' ' : '') + ta.value.slice(ta.selectionEnd);
        ta.focus(); const at = (pre + sep + ins).length + (b.classList.contains('v') ? 1 : 0); ta.setSelectionRange(at, at); ta.oninput();
      }));
      $('#toRev').onclick = () => { d.step = 2; save(); render(); };
      $('#dl').onclick = download;
    } else if (d.step === 2) {
      const r = analyze(d.draft, p, p.grade);
      logActivity('writingdojo', LOG_META, { id: p.id, name: p.title, grade: p.grade });
      const icon = { fix: '🔴', tip: '🟡', good: '🟢' };
      el.innerHTML = `<div class="statrow"><span>${L('字數', 'Words')} <b>${r.stats.words}</b></span><span>${L('句子', 'Sentences')} <b>${r.stats.sentences}</b></span><span>${L('段落', 'Paragraphs')} <b>${r.stats.paragraphs}</b></span><span>${L('平均句長', 'Avg. sentence')} <b>${r.stats.avg}</b></span></div>
        <h3>🤖 ${L('電腦幫你看', 'Automatic feedback')}</h3><ul class="notes">${r.notes.map((n) => `<li class="${n.kind}">${icon[n.kind]} ${X(n.msg)}</li>`).join('')}</ul>
        ${r.html ? `<h3>${L('你的文章（紅色＝要改，黃色＝可以更好）', 'Your writing (red = fix, yellow = could be better)')}</h3><div class="marked">${r.html}</div>` : ''}
        <h3>✅ ${L('自我檢查表', 'Self-check')}</h3><p class="muted">${L('電腦看不出想法好不好，這部分要自己（或請爸媽）檢查：', 'A computer can’t judge your ideas — check these yourself (or with a grown-up):')}</p>
        <div class="checks">${p.checklist.map((c, i) => `<label><input type="checkbox" data-i="${i}" ${d.checks[i] ? 'checked' : ''}> ${X(c)}</label>`).join('')}</div>
        <div class="row between"><span id="ck"></span><span><button class="btn ghost" id="back">← ${L('回去修改', 'Back to my draft')}</button> <button class="btn ghost" id="pr">🖨️ ${L('列印', 'Print')}</button> <button class="btn" id="toModel">${L('看範文 →', 'See the model →')}</button></span></div>`;
      const ck = () => { const n = p.checklist.filter((_, i) => d.checks[i]).length; $('#ck').innerHTML = n === p.checklist.length ? `🏅 ${L('全部完成！', 'All done!')}` : L(`${n} / ${p.checklist.length} 項完成`, `${n} / ${p.checklist.length} checked`); };
      el.querySelectorAll('.checks input').forEach((c) => (c.onchange = () => { d.checks[+c.dataset.i] = c.checked; save(); ck(); })); ck();
      $('#back').onclick = () => { d.step = 1; save(); render(); };
      $('#toModel').onclick = () => { d.step = 3; save(); render(); };
      $('#pr').onclick = () => printDraft(p, d);
    } else {
      const m = p.mentor;
      el.innerHTML = `<p class="muted">${L('這是一篇範文。比一比：它怎麼開頭？怎麼安排段落？用了哪些連接詞和細節？', 'Here is a model. Compare: how does it begin? How are the paragraphs arranged? Which transitions and details does it use?')}</p>
        <div class="mentor"><h3>${esc(m.title)}</h3>${m.text.split(/\n\s*\n/).map((s) => `<p>${esc(s).replace(/\n/g, '<br>')}</p>`).join('')}</div>
        <div class="note">💡 ${X(m.note)}</div>
        <div class="row"><button class="btn ghost" id="back">← ${L('回去修改我的文章', 'Back to my draft')}</button></div>`;
      $('#back').onclick = () => { d.step = 1; save(); render(); };
    }
  };
  const download = () => {
    const blob = new Blob([`${p.title.en}\n${p.prompt.en.split('{t}').join(p.topics[d.topic].en)}\n\n${d.draft}\n`], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${p.id}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  render();
  relang = render;
}
function printDraft(p, d) {
  const w = window.open('', '_blank'); if (!w) return;
  w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(p.title.en)}</title><style>body{font:16px/1.8 Georgia,serif;max-width:700px;margin:30px auto;padding:0 16px}h1{font-size:22px}.p{color:#555;font-style:italic}</style>
    <h1>${esc(p.title.en)}</h1><p class="p">${esc(p.prompt.en.split('{t}').join(p.topics[d.topic].en))}</p>${d.draft.split(/\n\s*\n/).map((s) => `<p>${esc(s).replace(/\n/g, '<br>')}</p>`).join('')}<script>print()<\/script>`);
  w.document.close();
}

function mine() {
  const ds = store.keys().map((k) => ({ id: k.slice(6), d: store.get(k, null) })).filter((x) => x.d && promptById(x.id)).sort((a, b) => (b.d.updated || 0) - (a.d.updated || 0));
  app.innerHTML = `<nav class="crumb"><a href="#/">← ${L('所有年級', 'All grades')}</a></nav><section class="phead"><h1>📂 ${L('我的作品', 'My writing')}</h1></section>
    ${ds.length ? `<div class="topics">${ds.map(({ id, d }) => { const p = promptById(id), n = (d.draft.match(/[A-Za-z']+/g) || []).length;
      return `<a class="topic task" href="#/w/${id}"><span class="tn">${genre(p.genre)[2]} ${X(p.title)}</span><span class="gtag">${gradeName(p.grade)}</span>
        <span class="ts">${L(`${n} 字`, `${n} words`)} · ${new Date(d.updated || 0).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US')}</span><span class="snip">${esc(d.draft.slice(0, 120))}</span></a>`; }).join('')}</div>`
      : `<p class="empty">${L('還沒有作品。到任何一個年級，選一個寫作任務開始吧！', 'Nothing yet. Pick a writing task in any grade to start!')}</p>`}`;
}

function print(what) {
  const g = what.match(/^g(\d+)$/)?.[1];
  const tps = g ? skillsFor(+g) : [byId(what)].filter(Boolean);
  if (!tps.length) return (location.hash = '#/');
  const title = g ? gradeName(+g) : X(tps[0].name);
  const qs = Array.from({ length: 16 }, (_, i) => draw(tps[i % tps.length], newSeed()));
  if (g) qs.sort((a, b) => tps.indexOf(a.tp) - tps.indexOf(b.tp));
  const body = (q) => {
    const a = q.ans, R = rng(q.seed ^ 0x5bd1e995);
    if (a.type === 'choice') return `<div class="pch">${R.shuffle(a.options.map((o, j) => ({ o, j }))).map((x, k) => `<span>(${'ABCDEF'[k]}) ${X(x.o)}</span>`).join('')}</div>`;
    if (a.type === 'tap') return `<div class="passage">${a.words.map(esc).join(' ')}</div><p class="muted">${L('（把錯的字圈起來，寫出正確的字）', '(Circle the word that is wrong and write it correctly.)')}</p><div class="line"></div>`;
    if (a.type === 'order') return `<ul class="pord">${R.shuffle(a.items.map((s, i) => i)).map((i) => `<li>＿＿ ${esc(a.items[i])}</li>`).join('')}</ul>`;
    return '<div class="line"></div>';
  };
  const key = (q) => { const a = q.ans; if (a.type !== 'choice') return rightText(q); const o = rng(q.seed ^ 0x5bd1e995).shuffle(a.options.map((o, j) => ({ o, j }))); return `(${'ABCDEF'[o.findIndex((x) => x.j === a.correct)]}) ${X(a.options[a.correct])}`; };
  app.innerHTML = `<nav class="crumb noprint"><a href="javascript:history.back()">← ${L('返回', 'Back')}</a><button class="btn" onclick="window.print()">🖨️ ${L('列印', 'Print')}</button><button class="btn ghost" id="regen">🔄 ${L('換一批題目', 'New questions')}</button></nav>
    <section class="sheet"><h1>${L('寫作技巧練習單', 'Writing skills worksheet')} · ${title}</h1><p class="who">${L('姓名', 'Name')}：＿＿＿＿＿＿　${L('日期', 'Date')}：＿＿＿＿＿＿　${L('得分', 'Score')}：＿＿＿ / 16</p>
    <ol class="pqs">${qs.map((q) => `<li class="pq"><div class="q">${X(q.q)}</div>${q.text ? `<div class="passage">${q.text}</div>` : ''}${body(q)}</li>`).join('')}</ol></section>
    <section class="sheet key"><h1>${L('解答', 'Answer key')} · ${title}</h1><ol class="keys-list">${qs.map((q) => `<li><b>${key(q)}</b><ol class="steps">${q.sol.map((s) => `<li>${X(s)}</li>`).join('')}</ol></li>`).join('')}</ol></section>`;
  $('#regen').onclick = () => print(what);
}

// ---------- router ----------
function route() {
  cleanup?.(); cleanup = null; relang = null;
  const h = location.hash; let m;
  if ((m = h.match(/^#\/g\/(\d+)/))) grade(+m[1]);
  else if ((m = h.match(/^#\/s\/(.+)/))) practice(decodeURIComponent(m[1]));
  else if ((m = h.match(/^#\/w\/(.+)/))) studio(decodeURIComponent(m[1]));
  else if ((m = h.match(/^#\/quiz\/(\d+)/))) quiz(+m[1]);
  else if ((m = h.match(/^#\/print\/(.+)/))) print(decodeURIComponent(m[1]));
  else if (h.startsWith('#/mine')) mine();
  else home();
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });
header();
route();
