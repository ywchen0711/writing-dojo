# Writing bank spec (for whoever writes js/bank/gNN-NN.js)

The site teaches **English writing** to kids in grades 1–12. The child's family speaks Chinese, so every instruction,
lesson and explanation is bilingual: Traditional Chinese (繁體中文, Taiwan usage) + English. The practice sentences,
model texts and the child's own writing are English.

Standards: US Common Core ELA — Writing (W.K-12: opinion/argument, informative/explanatory, narrative, research) and
Language (L: conventions — grammar, capitalization, punctuation, spelling; knowledge of language; vocabulary).
High school also: SAT/ACT Writing & Language style edits and AP English Language rhetoric (grades 11–12).

A bank file: `export default { skills: [...], prompts: [...] }`. Import only from '../util.js'.
Read `js/util.js`, `js/check.js` and **`js/bank/_example.js` (copy its style)**. Run `node test/run.mjs js/bank/yourfile.js`
until it prints `0 problems`; then print ~5 drills per skill with a small node script and read them for correctness.

## Skills (auto-checked drills, generated from random parts)
```js
{
  id: 'g4-commas-series',        // unique, starts with g<grade>-
  grade: 4,
  unit: 'mechanics',             // mechanics | grammar | sentences | words | paragraphs | organization | style | research
  name: T('zh', 'en'),
  std: 'CCSS L.4.2',             // only a code you are sure of; otherwise e.g. 'Grade 4 · Language'
  lesson: { zh: 'HTML', en: 'HTML', ex: ['English example (HTML ok, <b>/<u> to highlight)', …] },  // a short mini-lesson shown before drilling
  gen(r) { return { q, text?, ans, sol, hint? }; },
}
```
- `q`: `T(zh, en)` the instruction ("點出錯的字 / Tap the word that is wrong", "選出最好的句子 / Choose the best sentence").
  It may include the English sentence itself. English text must contain no Chinese characters.
- `text` (optional): an English passage/sentence shown in a box under the instruction (for choice questions about a passage).
- `ans` (from util.js):
  - `ansChoice([right, wrong…])` — right answer first (the app shuffles). 2–5 distinct options. Wrong options = real mistakes.
  - `ansTap(words, k | [k1, k2])` — the student taps the wrong word(s) in a sentence. `words` = tokens shown
    (use `words(sentence)`), the indexes to select. Great for capitalization, spelling, wrong verb, wrong pronoun.
  - `ansOrder([s1, s2, s3, …])` — put 3–6 sentences in order (given in the right order; the app shuffles): paragraph
    order, story sequence, topic sentence → details → conclusion, steps of a procedure.
  - `ansText([accepted…], caseSensitive?)` — type a word or short phrase (plural of a noun, past tense, a contraction,
    the missing punctuation word). List all acceptable spellings.
- `sol`: 2–4 `T(zh, en)` steps explaining **why** — name the rule, point to the word, show the corrected sentence. Friendly,
  for that grade. The Chinese explains the English rule in Chinese (quote English words as needed).
- `hint` (optional): one-line nudge.

Make drills **vary a lot**: build sentences from word banks (subjects, verbs, objects, places, times, names from `NAMES`)
and several templates per skill, so a skill can produce hundreds of different drills. **Every generated sentence must
be grammatical English except for the one planted error**, and the "right" answer must really be right. Avoid answers that
are arguably both right. Use util helpers (`plural`, `third`, `past`, `an`, `cap`) carefully — check irregular words.

## Prompts (writing tasks: plan → draft → revise)
```js
{
  id: 'w5-opinion-school-uniform',   // unique, starts with w<grade>-
  grade: 5,
  genre: 'opinion',  // narrative | opinion | informative | letter | poem | descriptive | research | argument | literary | summary | compare | personal | procedural
  std: 'CCSS W.5.1',
  title: T('zh', 'en'),
  topics: [T('zh', 'en'), …],        // ≥ 5 topic variants; inserted where {t} appears in prompt
  prompt: T('zh … {t} …', 'en … {t} …'),
  plan: [{ label: T, hint: T }],     // 3–6 boxes of a graphic organizer, in writing order (hook, reasons, evidence, …)
  starters: ['English sentence starters', …],   // 4–8
  words: [min, max],                 // target length for that grade (G1 ≈ 20–50, G3 ≈ 80–150, G6 ≈ 250–400, G9 ≈ 400–600, G12 ≈ 500–800)
  checklist: [T, …],                 // 5–8 self-check rubric items for this genre at this grade
  mentor: { title: 'English', text: 'English model piece; paragraphs separated by \n\n', note: T('what makes it good', …) },
  vocab: ['transition words / academic words to try', …],
}
```
The mentor text must be original, grade-appropriate, about one of the topics, and its word count roughly within `words`
(the test allows 0.6×min to 1.6×max). The prompt text in English may be shown to the child; the Chinese one helps parents.

## Quality bar
- Traditional Chinese only, natural Taiwan usage (主詞、動詞、名詞、形容詞、副詞、介係詞、標點符號、逗號、句號、段落、主題句、論點…).
- Grade-appropriate: grade 1 sentences are short and concrete; high school uses real academic sentences.
- No offensive or scary content; diverse names and everyday kid topics.
