// Automatic feedback on a child's draft. It can't grade ideas, but it catches what a careful reader would circle:
// capitals and end marks, "i", doubled words, common misspellings, overused words, repeated sentence openers,
// run-ons and choppy sentences, missing paragraphs, transitions, and the parts each genre needs (an opinion and
// reasons, time words and feelings in a story, a greeting and closing in a letter …).
// analyze(text, prompt, grade) → { stats, notes: [{ kind: 'good' | 'tip' | 'fix', msg: T }], html (the text with marks) }
import { T, esc } from './util.js';

const MISSPELL = {
  alot: 'a lot', becuase: 'because', beacuse: 'because', becasue: 'because', thier: 'their', recieve: 'receive', freind: 'friend', freinds: 'friends',
  beleive: 'believe', definately: 'definitely', untill: 'until', wich: 'which', wierd: 'weird', tommorow: 'tomorrow', tomorow: 'tomorrow',
  realy: 'really', finaly: 'finally', begining: 'beginning', diffrent: 'different', favrite: 'favorite', favorit: 'favorite', becaus: 'because',
  seperate: 'separate', occured: 'occurred', truely: 'truly', goverment: 'government', enviroment: 'environment', arguement: 'argument',
  probly: 'probably', libary: 'library', suprise: 'surprise', wen: 'when', wat: 'what', becuz: 'because', cuz: 'because', gonna: 'going to',
  wanna: 'want to', thru: 'through', untill_: 'until', everytime: 'every time', alright: 'all right', noone: 'no one', aswell: 'as well',
  infront: 'in front', thankyou: 'thank you', ofcourse: 'of course', irregardless: 'regardless', accross: 'across', neccessary: 'necessary',
  occassion: 'occasion', reccomend: 'recommend', resturant: 'restaurant', wensday: 'Wednesday', febuary: 'February', grammer: 'grammar',
};
const WEAK = {
  very: 'extremely, truly — or a stronger word (very big → huge)', really: 'truly, genuinely — or cut it', good: 'great, helpful, delicious, kind',
  bad: 'awful, harmful, disappointing', nice: 'friendly, pleasant, beautiful', fun: 'exciting, thrilling, enjoyable', things: 'a more exact noun',
  stuff: 'a more exact noun', got: 'received, became, earned', said: 'shouted, whispered, explained, replied', big: 'huge, enormous, giant',
  happy: 'thrilled, delighted, proud', sad: 'upset, heartbroken, gloomy', like: 'enjoy, love, prefer (or "such as")', went: 'ran, hurried, traveled',
};
const TRANS = ['first', 'second', 'third', 'next', 'then', 'after that', 'finally', 'later', 'meanwhile', 'suddenly', 'one day', 'at last', 'because', 'since', 'so', 'also', 'another', 'for example', 'for instance', 'in addition', 'however', 'although', 'therefore', 'as a result', 'in conclusion', 'to sum up', 'overall', 'that is why', 'on the other hand', 'in contrast', 'similarly', 'consequently', 'furthermore', 'moreover', 'nevertheless', 'specifically', 'ultimately', 'in fact', 'instead', 'otherwise', 'besides'];
const has = (s, list) => list.filter((w) => new RegExp(`\\b${w.replace(/ /g, '\\s+')}\\b`, 'i').test(s));

export function analyze(text, prompt = {}, grade = prompt.grade || 3) {
  const raw = text.replace(/\r/g, '');
  const notes = [], marks = [];
  const fix = (zh, en) => notes.push({ kind: 'fix', msg: T(zh, en) });
  const tip = (zh, en) => notes.push({ kind: 'tip', msg: T(zh, en) });
  const good = (zh, en) => notes.push({ kind: 'good', msg: T(zh, en) });
  const mark = (re, cls, title) => { const r2 = new RegExp(re.source, re.flags + 'd'); for (const m of raw.matchAll(r2)) { const [a, b] = m.indices[1] || m.indices[0]; marks.push([a, b, cls, title]); } };

  const wordsArr = raw.match(/[A-Za-z']+/g) || [];
  const nW = wordsArr.length;
  const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const isPoem = prompt.genre === 'poem';
  const sents = isPoem ? [] : paras.flatMap((p) => p.replace(/\n+/g, ' ').split(/(?<=[.!?]["”']?)\s+/)).map((s) => s.trim()).filter((s) => /[A-Za-z]/.test(s));
  const sw = sents.map((s) => (s.match(/[A-Za-z']+/g) || []).length);
  const stats = { words: nW, sentences: sents.length, paragraphs: paras.length, avg: sents.length ? Math.round((nW / sents.length) * 10) / 10 : 0, unique: nW ? new Set(wordsArr.map((w) => w.toLowerCase())).size : 0, lines: raw.split('\n').filter((l) => l.trim()).length };
  if (!nW) return { stats, notes: [{ kind: 'tip', msg: T('先寫一點東西，再按檢查。', 'Write something first, then check it.') }], html: '' };

  // length
  const [lo, hi] = prompt.words || [0, 1e9];
  if (nW < lo) tip(`現在 ${nW} 個字，目標是 ${lo}–${hi} 個字。試著多加一些細節或例子。`, `You have ${nW} words; the goal is ${lo}–${hi}. Add more details or examples.`);
  else if (nW > hi * 1.25) tip(`現在 ${nW} 個字，比目標（${lo}–${hi}）長很多。看看有沒有可以刪掉的重複句子。`, `${nW} words is well over the goal (${lo}–${hi}). Look for repeated or extra sentences to cut.`);
  else good(`長度剛好：${nW} 個字（目標 ${lo}–${hi}）。`, `Good length: ${nW} words (goal ${lo}–${hi}).`);

  // capitals and end marks
  if (!isPoem) {
    const noCap = sents.filter((s) => /^["“'(]?[a-z]/.test(s));
    if (noCap.length) { fix(`有 ${noCap.length} 個句子開頭沒有大寫（標成紅色）。`, `${noCap.length} sentence(s) don't start with a capital letter (marked in red).`); mark(/(?:^|[.!?]["”']?\s+)(["“'(]?[a-z][a-z']*)/g, 'fix', 'capital'); }
    if (!/[.!?]["”')]?\s*$/.test(raw.trim())) fix('最後一句沒有結尾標點（. ? !）。', 'The last sentence has no end mark (. ? !).');
  }
  if (/\bi\b/.test(raw)) { fix('「我」要寫成大寫的 I。', 'The word "I" is always a capital letter.'); mark(/\b(i)\b/g, 'fix', 'I'); }
  const dbl = raw.match(/\b(\w+)\s+\1\b/gi)?.filter((m) => !/^(that that|had had)$/i.test(m));
  if (dbl?.length) { fix(`有重複的字：${dbl.slice(0, 3).join('、')}。`, `Doubled words: ${dbl.slice(0, 3).join(', ')}.`); mark(/\b((\w+)\s+\2)\b/gi, 'fix', 'doubled'); }
  if (/ ,|,(?=[A-Za-z])/.test(raw)) tip('逗號後面要空一格、前面不要空格。', 'Put a space after a comma, not before it.');

  // spelling
  const miss = [...new Set(wordsArr.map((w) => w.toLowerCase()).filter((w) => MISSPELL[w]))];
  if (miss.length) { fix(`可能拼錯：${miss.map((w) => `${w} → ${MISSPELL[w]}`).join('、')}。`, `Check spelling: ${miss.map((w) => `${w} → ${MISSPELL[w]}`).join(', ')}.`); mark(new RegExp(`\\b(${miss.join('|')})\\b`, 'gi'), 'fix', 'spelling'); }

  // word choice
  if (grade >= 2) {
    const counts = {}; wordsArr.forEach((w) => { const k = w.toLowerCase(); if (WEAK[k]) counts[k] = (counts[k] || 0) + 1; });
    const over = Object.entries(counts).filter(([, n]) => n >= (grade <= 3 ? 3 : 2)).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (over.length) { tip(`這些字用了好幾次，換個更精確的字：${over.map(([w, n]) => `${w}（${n} 次）→ ${WEAK[w]}`).join('；')}`, `These words show up a lot — try a more exact word: ${over.map(([w, n]) => `${w} (${n}×) → ${WEAK[w]}`).join('; ')}`); mark(new RegExp(`\\b(${over.map(([w]) => w).join('|')})\\b`, 'gi'), 'tip', 'word choice'); }
  }
  // sentence openers
  if (sents.length >= 4) {
    const first = {}; sents.forEach((s) => { const w = (s.match(/[A-Za-z']+/) || [''])[0].toLowerCase(); first[w] = (first[w] || 0) + 1; });
    const rep = Object.entries(first).filter(([w, n]) => w && n >= 3 && n / sents.length >= 0.3);
    if (rep.length) tip(`很多句子都用「${cap(rep[0][0])}」開頭（${rep[0][1]} 次）。換一些開頭，例如時間、地點或連接詞。`, `Many sentences start with "${cap(rep[0][0])}" (${rep[0][1]} times). Vary your openers — try a time, a place or a transition.`);
    else good('句子的開頭有變化。', 'Your sentence openers are varied.');
  }
  // run-ons and choppy
  const longMax = grade <= 3 ? 25 : grade <= 6 ? 35 : 45;
  const longs = sents.filter((s, i) => sw[i] > longMax || (s.match(/\band\b/gi) || []).length >= 4);
  if (longs.length) tip(`有 ${longs.length} 個句子很長（或用了很多 and），可能是連寫句，試著拆成兩句：「${longs[0].slice(0, 60)}…」`, `${longs.length} sentence(s) are very long or chain many "and"s — maybe a run-on. Try splitting: "${longs[0].slice(0, 60)}…"`);
  if (grade >= 2 && sents.length >= 5 && sw.filter((n) => n < 5).length / sents.length >= 0.4) tip('很多句子很短。用 and、but、because、when 把一些句子連起來會更順。', 'Lots of very short sentences. Join some with and, but, because or when to make it flow.');
  if (grade >= 6 && sents.length >= 6) { const spread = Math.max(...sw) - Math.min(...sw); if (spread >= 10) good('長短句交錯，讀起來有節奏。', 'You mix long and short sentences — nice rhythm.'); }

  // paragraphs
  if (!isPoem && grade >= 3 && nW > 120 && paras.length === 1) tip('整篇只有一段。換新的想法時要分段（空一行）。', 'It is all one paragraph. Start a new paragraph (leave a blank line) for each new idea.');
  else if (!isPoem && paras.length >= 3) good(`分成 ${paras.length} 段，結構清楚。`, `${paras.length} paragraphs — clear structure.`);

  // transitions
  const tr = has(raw, [...new Set([...(prompt.vocab || []), ...TRANS])]);
  if (!isPoem) {
    if (tr.length >= Math.min(4, 1 + Math.floor(grade / 3))) good(`用了連接詞：${tr.slice(0, 6).join(', ')}。`, `Transitions used: ${tr.slice(0, 6).join(', ')}.`);
    else tip(`多用一些連接詞，讓想法連在一起${prompt.vocab?.length ? `，例如：${prompt.vocab.slice(0, 5).join(', ')}` : ''}。`, `Use more transitions to link your ideas${prompt.vocab?.length ? `, such as: ${prompt.vocab.slice(0, 5).join(', ')}` : ''}.`);
  }

  // genre
  const g = prompt.genre;
  if (g === 'opinion' || g === 'argument') {
    if (has(raw, ['i think', 'i believe', 'in my opinion', 'should', 'favorite', 'best', 'must', 'ought to', 'it is clear', 'we need']).length) good('有清楚說出看法。', 'You state a clear opinion.'); else fix('找不到你的看法句。開頭要清楚說出你的立場（I think… / … should …）。', 'I can\'t find your opinion. State your position clearly near the start (I think… / … should …).');
    if (has(raw, ['because', 'since', 'for example', 'for instance', 'one reason', 'evidence', 'according to', 'studies']).length) good('有給理由或證據。', 'You give reasons or evidence.'); else fix('加上理由：用 because、one reason is、for example。', 'Add reasons: use because, one reason is, for example.');
    if (grade >= 6 && !has(raw, ['some people', 'others argue', 'opponents', 'critics', 'although', 'while some', 'on the other hand', 'it is true that', 'admittedly']).length) tip('論說文可以提到反方意見，再說明為什麼你的看法更好。', 'Strong arguments mention the other side, then explain why your view holds up.');
    if (!has(raw, ['that is why', 'in conclusion', 'therefore', 'overall', 'to sum up', 'for these reasons', 'in the end', 'ultimately', 'clearly']).length) tip('結尾再說一次你的看法（That is why… / In conclusion…）。', 'End by restating your opinion (That is why… / In conclusion…).');
  } else if (g === 'narrative' || g === 'personal') {
    if (has(raw, ['first', 'then', 'next', 'after', 'later', 'finally', 'one day', 'suddenly', 'when', 'at last', 'meanwhile', 'the next morning']).length >= 2) good('有用時間詞讓故事順序清楚。', 'Time words make the order of events clear.'); else tip('加上時間詞（First, Then, Suddenly, Finally）讓故事順序更清楚。', 'Add time words (First, Then, Suddenly, Finally) so the order is clear.');
    if (/["“][^"”]+["”]/.test(raw)) good('有對話，故事更生動。', 'Dialogue brings your story to life.'); else if (grade >= 3) tip('試著加一句對話（用引號 " "）。', 'Try adding a line of dialogue (in quotation marks).');
    if (!has(raw, ['felt', 'feel', 'happy', 'scared', 'excited', 'nervous', 'proud', 'worried', 'surprised', 'afraid', 'angry', 'glad', 'heart', 'smiled', 'cried', 'laughed', 'relieved', 'embarrassed']).length) tip('寫出人物的感受（felt…、my heart…）。', 'Show how the characters feel (I felt…, my heart…).');
  } else if (['informative', 'research', 'procedural', 'compare', 'summary'].includes(g)) {
    if (/\d/.test(raw) || has(raw, ['for example', 'such as', 'for instance', 'according to', 'in fact']).length) good('有用事實、數字或例子。', 'You use facts, numbers or examples.'); else tip('加上事實、數字或例子（for example、such as）。', 'Add facts, numbers or examples (for example, such as).');
    if (g === 'procedural' && !has(raw, ['first', 'next', 'then', 'finally', 'step', 'after']).length) fix('步驟要有順序詞（First, Next, Then, Finally）。', 'Steps need order words (First, Next, Then, Finally).');
    if (g === 'compare' && !has(raw, ['both', 'similar', 'alike', 'different', 'unlike', 'however', 'whereas', 'while', 'in contrast', 'on the other hand']).length) fix('比較文要用 both、alike、unlike、however 等字說出相同和不同。', 'Use both, alike, unlike, however … to show what is the same and different.');
  } else if (g === 'letter') {
    if (/^\s*(dear|hi|hello|to)\b/i.test(raw)) good('有稱呼（Dear …,）。', 'You have a greeting (Dear …,).'); else fix('信的開頭要有稱呼，例如 Dear Grandma,', 'A letter starts with a greeting, like "Dear Grandma,".');
    if (/(love|sincerely|your friend|best|yours|thanks|thank you|from|regards),?\s*\n?\s*[A-Z]?\w*\s*$/i.test(raw.trim())) good('有結尾敬語和署名。', 'You have a closing and your name.'); else fix('信的最後要有結尾敬語和署名，例如 Love, Mia', 'End with a closing and your name, like "Love, Mia".');
  } else if (g === 'poem') {
    good(`這首詩有 ${stats.lines} 行。`, `Your poem has ${stats.lines} lines.`);
    if (stats.lines < 4) tip('詩可以多寫幾行，每一行一個畫面。', 'Try more lines — one picture per line.');
  } else if (g === 'descriptive') {
    const senses = has(raw, ['see', 'saw', 'look', 'hear', 'heard', 'sound', 'smell', 'smelled', 'taste', 'tasted', 'feel', 'felt', 'soft', 'rough', 'bright', 'loud', 'sweet', 'warm', 'cold', 'shiny', 'crunchy']);
    if (senses.length >= 3) good('用了好幾種感官描寫。', 'You use several senses.'); else tip('用五感描寫：看到、聽到、聞到、嚐到、摸到的。', 'Describe with the five senses: what you see, hear, smell, taste and touch.');
  } else if (g === 'literary') {
    if (/["“][^"”]+["”]/.test(raw)) good('有引用原文當證據。', 'You quote the text as evidence.'); else tip('引用書中的句子當證據（用引號）。', 'Quote words from the text as evidence.');
  }
  if (grade >= 7 && ['argument', 'informative', 'research', 'literary', 'compare'].includes(g)) {
    const contr = raw.match(/\b\w+n't\b|\b\w+'(re|ll|ve|d)\b/gi);
    if (contr?.length >= 2) tip(`正式文章少用縮寫（${contr.slice(0, 3).join(', ')}）→ do not, cannot …`, `Formal essays avoid contractions (${contr.slice(0, 3).join(', ')}) → do not, cannot …`);
    if ((raw.match(/\byou\b/gi) || []).length >= 3) tip('正式文章少用 you，改用 people、students、readers 等。', 'In formal essays, avoid "you" — use people, students, readers …');
  }
  if (nW >= 40) { const r = stats.unique / nW; if (r >= 0.6) good('用字很豐富，重複的字不多。', 'Rich vocabulary — few repeated words.'); }

  // marked HTML
  marks.sort((a, b) => a[0] - b[0]);
  let html = '', at = 0;
  for (const [s, e, cls, title] of marks) { if (s < at) continue; html += esc(raw.slice(at, s)) + `<mark class="${cls}" title="${title}">${esc(raw.slice(s, e))}</mark>`; at = e; }
  html += esc(raw.slice(at));
  const order = { fix: 0, tip: 1, good: 2 };
  notes.sort((a, b) => order[a.kind] - order[b.kind]);
  return { stats, notes, html: html.replace(/\n/g, '<br>') };
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
