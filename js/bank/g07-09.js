// Grades 7–9 writing bank: skills (auto-checked drills) and prompts (plan → draft → revise). See SPEC.md.
import { T, words, ansTap, ansChoice, ansOrder, ansText, cap, low } from '../util.js';

// ---- local helpers ----
const BOYS = ['Max', 'Leo', 'Jay', 'Noah', 'Ethan', 'Ben', 'Ryan', 'Owen', 'Lucas', 'Diego', 'Kenji', 'Arjun', 'Malik', 'Omar'];
const GIRLS = ['Mia', 'Emma', 'Ava', 'Lily', 'Zoe', 'Chloe', 'Grace', 'Ella', 'Ruby', 'Nora', 'Priya', 'Mei', 'Sofia', 'Amara'];
const person = (r) => (r.chance(0.5)
  ? { n: r.pick(GIRLS), he: 'she', him: 'her', his: 'her', himself: 'herself' }
  : { n: r.pick(BOYS), he: 'he', him: 'him', his: 'his', himself: 'himself' });
// a cast for one sentence: {A} (with pronouns {he} {him} {his} {He} {His} {himself}) and a different {B}
function cast(r) {
  const a = person(r); let b = person(r);
  while (b.n === a.n) b = person(r);
  return { A: a.n, B: b.n, he: a.he, He: cap(a.he), him: a.him, his: a.his, His: cap(a.his), himself: a.himself };
}
const fill = (s, c) => s.replace(/\{(\w+)\}/g, (m, k) => { if (c[k] == null) throw new Error('no ' + k); return c[k]; });
const fT = (t, c) => T(fill(t.zh, c), fill(t.en, c));
// tap drill from a sentence whose wrong word(s) are wrapped in *stars*
function tapMarked(s) {
  const k = []; const ws = words(s).map((w, i) => { if (w.includes('*')) { k.push(i); return w.replace(/\*/g, ''); } return w; });
  return { ws, k };
}
const pickOther = (r, arr, not) => r.pick(arr.filter((x) => x !== not));

// transition drills shared by grades 7–9
const TR = {
  contrast: { zh: '轉折／對比', en: 'contrast (an opposite or surprising idea)', w: ['However,', 'On the other hand,', 'Nevertheless,'] },
  result: { zh: '因果（結果）', en: 'cause and effect (a result)', w: ['As a result,', 'Therefore,', 'Consequently,'] },
  addition: { zh: '補充（再加一點）', en: 'addition (one more point)', w: ['In addition,', 'Furthermore,', 'Moreover,'] },
  example: { zh: '舉例', en: 'example', w: ['For example,', 'For instance,'] },
  similarity: { zh: '相似（同樣地）', en: 'similarity (the same is true)', w: ['Similarly,', 'Likewise,'] },
  sequence: { zh: '時間順序', en: 'time order (what happened next)', w: ['Afterward,', 'Later,', 'Subsequently,'] },
};
function transitionDrill(r, items, cats, lead) {
  const it = r.pick(items), c = cast(r);
  const right = r.pick(TR[it.rel].w);
  const others = r.shuffle(cats.filter((k) => k !== it.rel && !(it.no || []).includes(k))).slice(0, 3);
  const opts = [right, ...others.map((k) => r.pick(TR[k].w))];
  const pre = it.pre ? fill(it.pre, c) + ' ' : '';
  const s1 = fill(it.a, c), s2 = fill(it.b, c);
  return {
    q: lead || T('選出最能連接這兩句話的轉折語。', 'Choose the transition that best connects the ideas.'),
    text: `${pre}${s1} <b>___</b> ${s2}`,
    ans: ansChoice(opts),
    sol: [
      T(`第二句和前面的關係是「${TR[it.rel].zh}」，所以用「${right}」。`, `The second sentence shows ${TR[it.rel].en}, so "${right}" fits.`),
      T(`完整句子：${pre}${s1} ${right} ${s2}`, `Full text: ${pre}${s1} ${right} ${s2}`),
    ],
    hint: T('先想：第二句是相反、結果、補充還是例子？', 'Ask: is the second idea an opposite, a result, an extra point or an example?'),
  };
}

// ================= GRADE 7 =================
const G7 = [
  {
    id: 'g7-phrase-clause',
    grade: 7,
    unit: 'grammar',
    name: T('片語和子句', 'Phrases and clauses'),
    std: 'CCSS L.7.1a',
    lesson: {
      zh: '<b>子句</b>有自己的主詞和動詞。能單獨成句的是<b>獨立子句</b>；用 because、when、although 等連接詞開頭、不能單獨成句的是<b>從屬子句</b>。<b>片語</b>沒有「主詞＋動詞」的組合，例如 after lunch、during the storm。',
      en: 'A <b>clause</b> has its own subject and verb. An <b>independent clause</b> can stand alone as a sentence; a <b>dependent clause</b> starts with a word like because, when or although and cannot stand alone. A <b>phrase</b> has no subject–verb pair, like <i>after lunch</i> or <i>during the storm</i>.',
      ex: ['<u>After lunch</u> (phrase), Mia read.', '<u>After lunch ended</u> (dependent clause), Mia read.', '<u>Mia read</u> (independent clause).'],
    },
    gen(r) {
      const c = cast(r);
      const PH = ['after lunch', 'during the assembly', 'on Saturday morning', 'before the first bell', 'without any help', 'despite the rain', 'after a long day'];
      const DEP = [['after the assembly ended', 'assembly', 'ended'], ['because the bus was late', 'bus', 'was'], ['although it was raining', 'it', 'was raining'], ['when the power went out', 'power', 'went'], ['before the first bell rang', 'bell', 'rang'], ['since the library was closed', 'library', 'was closed'], ['while {his} friends waited outside', 'friends', 'waited']];
      const MAIN = ['{A} finished {his} science report', '{A} practiced the piano piece', '{A} wrote a letter to {his} grandmother', '{A} fixed the chain on {his} bike', '{A} reorganized {his} bookshelf', '{A} studied for the history quiz'];
      const main = fill(r.pick(MAIN), c), kind = r.pick(['phrase', 'dep', 'ind']);
      const PHR = T('片語（phrase）', 'phrase'), IND = T('獨立子句（independent clause）', 'independent clause'), DC = T('從屬子句（dependent clause）', 'dependent clause');
      let s, opts, why;
      const front = r.chance(0.5);
      if (kind === 'phrase' || (kind === 'ind' && r.chance(0.5))) {
        const p = r.pick(PH);
        if (kind === 'phrase') {
          s = front ? `<u>${cap(p)}</u>, ${main}.` : `${main} <u>${p}</u>.`;
          opts = [PHR, IND, DC];
          why = T(`「${p}」裡沒有「主詞＋動詞」的組合，所以是片語。`, `"${p}" has no subject–verb pair, so it is a phrase.`);
        } else {
          s = front ? `${cap(p)}, <u>${main}</u>.` : `<u>${main}</u> ${p}.`;
          opts = [IND, PHR, DC];
          why = T(`「${main}」有主詞「${c.A}」和動詞，而且可以單獨成句，所以是獨立子句。`, `"${main}" has a subject (${c.A}) and a verb, and it can stand alone, so it is an independent clause.`);
        }
      } else {
        const [d0, subj, verb] = r.pick(DEP), d = fill(d0, c), w1 = d.split(' ')[0];
        if (kind === 'dep') {
          s = front ? `<u>${cap(d)}</u>, ${main}.` : `${main} <u>${d}</u>.`;
          opts = [DC, IND, PHR];
          why = T(`「${d}」有主詞（${subj}）和動詞（${verb}），但用「${w1}」開頭，不能單獨成句，所以是從屬子句。`, `"${d}" has a subject (${subj}) and a verb (${verb}), but it begins with "${w1}" and cannot stand alone, so it is a dependent clause.`);
        } else {
          s = front ? `${cap(d)}, <u>${main}</u>.` : `<u>${main}</u> ${d}.`;
          opts = [IND, DC, PHR];
          why = T(`「${main}」有主詞和動詞，可以自己當一個完整的句子，所以是獨立子句。`, `"${main}" has a subject and a verb and can stand alone as a sentence, so it is an independent clause.`);
        }
      }
      return {
        q: T('畫底線的部分是什麼？', 'What is the underlined part?'),
        text: s,
        ans: ansChoice(opts),
        sol: [why, T('判斷方法：先找主詞＋動詞（有→子句；沒有→片語），再看能不能單獨成句。', 'Test: look for a subject + verb (yes → clause, no → phrase), then ask whether it can stand alone.')],
        hint: T('有沒有主詞和動詞？', 'Does it have a subject and a verb?'),
      };
    },
  },
  {
    id: 'g7-sentence-types',
    grade: 7,
    unit: 'sentences',
    name: T('四種句型：簡單、並列、複雜、並列複雜句', 'Simple, compound, complex and compound-complex sentences'),
    std: 'CCSS L.7.1b',
    lesson: {
      zh: '<b>簡單句</b>：一個獨立子句（動詞可以有兩個）。<b>並列句</b>：兩個獨立子句，用「, and / , but」或分號連接。<b>複雜句</b>：一個獨立子句＋一個從屬子句（because、when、after…）。<b>並列複雜句</b>：兩個以上獨立子句＋至少一個從屬子句。',
      en: '<b>Simple</b>: one independent clause (it may have two verbs). <b>Compound</b>: two independent clauses joined by ", and / , but" or a semicolon. <b>Complex</b>: one independent clause + a dependent clause (because, when, after…). <b>Compound-complex</b>: two or more independent clauses + at least one dependent clause.',
      ex: ['Simple: Ava fed the cat and watered the plants.', 'Compound: Ava fed the cat, and Leo set the table.', 'Complex: <u>Before the guests arrived</u>, Ava fed the cat.', 'Compound-complex: <u>Before the guests arrived</u>, Ava fed the cat, and Leo set the table.'],
    },
    gen(r) {
      const c = cast(r);
      const P1 = ['washed the dishes', 'folded the laundry', 'fed the cat', 'watered the plants', 'cleaned the bathroom'];
      const P2 = ['swept the kitchen floor', 'took out the trash', 'vacuumed the living room', 'set the table', 'dusted the shelves'];
      const DEP = ['before the guests arrived', 'while the soup simmered', 'after the movie ended', 'because the house was a mess', 'when the rain stopped'];
      const p1 = r.pick(P1), p2 = r.pick(P2), d = r.pick(DEP);
      const kind = r.pick(['simple', 'compound', 'complex', 'cc']);
      let s;
      if (kind === 'simple') s = r.pick([`${c.A} ${p1}.`, `${c.A} ${p1} and ${p2}.`, `After dinner, ${c.A} ${p1}.`, `${c.A} and ${c.B} ${p2} together.`]);
      else if (kind === 'compound') s = r.chance(0.6) ? `${c.A} ${p1}, and ${c.B} ${p2}.` : `${c.A} ${p1}; ${c.B} ${p2}.`;
      else if (kind === 'complex') s = r.chance(0.5) ? `${cap(d)}, ${c.A} ${p1}.` : `${c.A} ${p1} ${d}.`;
      else s = `${cap(d)}, ${c.A} ${p1}, and ${c.B} ${p2}.`;
      const L = { simple: T('簡單句', 'simple'), compound: T('並列句', 'compound'), complex: T('複雜句', 'complex'), cc: T('並列複雜句', 'compound-complex') };
      const why = {
        simple: T('只有一個獨立子句（兩個動詞或兩個主詞共用一個子句也算），沒有從屬子句。', 'There is only one independent clause (a shared subject or two verbs still make one clause) and no dependent clause.'),
        compound: T(`有兩個獨立子句（${c.A}…、${c.B}…），沒有從屬子句。`, `There are two independent clauses (${c.A}… / ${c.B}…) and no dependent clause.`),
        complex: T(`有一個獨立子句和一個從屬子句「${d}」。`, `There is one independent clause and one dependent clause: "${d}".`),
        cc: T(`有兩個獨立子句，再加一個從屬子句「${d}」。`, `There are two independent clauses plus the dependent clause "${d}".`),
      }[kind];
      return {
        q: T('這是哪一種句型？', 'What type of sentence is this?'),
        text: s,
        ans: ansChoice([L[kind], ...Object.keys(L).filter((k) => k !== kind).map((k) => L[k])]),
        sol: [why, T('數一數：獨立子句幾個？有沒有 because／when／after 等開頭的從屬子句？', 'Count: how many independent clauses? Is there a dependent clause starting with because, when, after…?')],
      };
    },
  },
  {
    id: 'g7-modifiers',
    grade: 7,
    unit: 'sentences',
    name: T('錯置修飾語和懸垂修飾語', 'Misplaced and dangling modifiers'),
    std: 'CCSS L.7.1c',
    lesson: {
      zh: '修飾語要緊貼它修飾的字。<b>懸垂修飾語</b>：句首片語後面接的主詞不是做動作的人，例如 "Hurrying to class, my book fell." （書不會趕去上課）。<b>錯置修飾語</b>：放錯位置，讓意思變好笑。',
      en: 'Put a modifier right next to the word it describes. A <b>dangling modifier</b> opens the sentence but the subject that follows is not the one doing the action: "Hurrying to class, my book fell." (A book cannot hurry.) A <b>misplaced modifier</b> sits in the wrong spot and changes the meaning.',
      ex: ['Wrong: Hurrying to class, my book fell.', 'Right: Hurrying to class, <b>I</b> dropped my book.', 'Wrong: She served cake to the girl dripping with chocolate.', 'Right: She served <b>cake dripping with chocolate</b> to the girl.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['Hurrying to catch the bus, {A} dropped {his} notebook in a puddle.', "Hurrying to catch the bus, {A}'s notebook fell in a puddle.", '筆記本不會「趕公車」', 'a notebook cannot hurry to catch a bus'],
        ['While {A} was walking home, a sudden storm began.', 'Walking home, a sudden storm surprised {A}.', '暴風雨不會「走路回家」', 'a storm cannot walk home'],
        ['After finishing the test, {A} handed {his} paper to the teacher.', 'After finishing the test, the paper was handed to the teacher.', '考卷不會「寫完考試」', 'a paper cannot finish a test'],
        ['The teacher handed out the tests with red covers to the students.', 'The teacher handed out the tests to the students with red covers.', '有紅色封面的是考卷，不是學生', 'the tests have red covers, not the students'],
        ['The waiter served the girl a cake that was dripping with chocolate.', 'The waiter served a cake to the girl that was dripping with chocolate.', '滴著巧克力的是蛋糕，不是女孩', 'the cake drips with chocolate, not the girl'],
        ['{A} chased the barking dog down the street.', 'Barking loudly, {A} chased the dog down the street.', '在叫的是狗，不是人', 'the dog was barking, not the person'],
        ['To win the science fair, {A} needed a perfect experiment.', 'To win the science fair, the experiment had to be perfect.', '實驗不會想「贏得科展」', 'an experiment cannot try to win a fair'],
        ['Opening the oven door, {A} felt a wave of heat on {his} face.', "Opening the oven door, a wave of heat hit {A}'s face.", '熱氣不會「打開烤箱門」', 'a wave of heat cannot open an oven door'],
        ['{A} bought a bike with a flat tire from a neighbor.', '{A} bought a bike from a neighbor with a flat tire.', '爆胎的是腳踏車，不是鄰居', 'the bike has the flat tire, not the neighbor'],
        ['Tired after the long practice, {A} collapsed onto the couch.', 'Tired after the long practice, the couch looked inviting to {A}.', '沙發不會「練習完很累」', 'a couch cannot be tired after practice'],
        ['Lost in the woods, {A} realized that the map was {his} only hope.', "Lost in the woods, the map was {A}'s only hope.", '迷路的是人，不是地圖', 'the person is lost, not the map'],
        ['When {A} was five, {his} family moved to Denver.', "At the age of five, {A}'s family moved to Denver.", '五歲的是那個人，不是全家', 'the person was five, not the whole family'],
      ];
      const it = r.pick(IT);
      const right = fill(it[0], c), wrong = fill(it[1], c);
      const askWrong = r.chance(0.4);
      return {
        q: askWrong ? T('哪一句的修飾語有問題（錯置或懸垂）？', 'Which sentence has a misplaced or dangling modifier?') : T('哪一句沒有修飾語的錯誤？', 'Which sentence uses its modifier correctly?'),
        ans: ansChoice(askWrong ? [wrong, right] : [right, wrong]),
        sol: [
          T(`有問題的句子：${wrong}——${it[2]}。`, `Problem sentence: "${wrong}" — ${it[3]}.`),
          T(`正確寫法：${right}`, `Correct: ${right}`),
        ],
        hint: T('問自己：這個片語到底在描述誰？', 'Ask: who or what is the phrase really describing?'),
      };
    },
  },
  {
    id: 'g7-coordinate-adjectives',
    grade: 7,
    unit: 'mechanics',
    name: T('並列形容詞之間的逗號', 'Commas between coordinate adjectives'),
    std: 'CCSS L.7.2a',
    lesson: {
      zh: '兩個形容詞如果「地位平等」（可以用 and 連接、也可以對調順序），中間要加逗號：a long, tiring hike。如果不能用 and、也不能對調（three small puppies），就<b>不加</b>逗號。最後一個形容詞和名詞之間永遠不加逗號。',
      en: 'If two adjectives are <b>coordinate</b> (you can put "and" between them or swap their order), separate them with a comma: <i>a long, tiring hike</i>. If "and" sounds wrong and they cannot be swapped (<i>three small puppies</i>), use <b>no</b> comma. Never put a comma between the last adjective and the noun.',
      ex: ['a <b>cold, windy</b> morning (cold and windy ✔)', 'a <b>big yellow</b> school bus (big and yellow bus ✘ → no comma)'],
    },
    gen(r) {
      const c = cast(r);
      const CO = [['long', 'tiring', 'hike'], ['cold', 'windy', 'morning'], ['friendly', 'helpful', 'librarian'], ['bright', 'cheerful', 'classroom'], ['loud', 'annoying', 'alarm'], ['clever', 'funny', 'story'], ['quiet', 'peaceful', 'afternoon'], ['brave', 'loyal', 'dog'], ['warm', 'sunny', 'day'], ['strange', 'mysterious', 'noise']];
      const CU = [['three', 'small', 'puppies'], ['old', 'stone', 'bridge'], ['bright', 'red', 'kite'], ['big', 'yellow', 'school bus'], ['delicious', 'chocolate', 'cake'], ['new', 'science', 'teacher'], ['tall', 'oak', 'tree'], ['cozy', 'winter', 'sweater'], ['two', 'black', 'cats']];
      const coord = r.chance(0.5), [a, b, n] = r.pick(coord ? CO : CU);
      const frame = r.pick(['Everyone talked about the X for days.', 'I still remember the X.', '{A} wrote a short paragraph about the X.']);
      const mk = (p) => fill(frame, c).replace('X', p);
      const withC = mk(`${a}, ${b} ${n}`), noC = mk(`${a} ${b} ${n}`), twoC = mk(`${a}, ${b}, ${n}`);
      return {
        q: T('哪一句的逗號用得正確？', 'Which sentence uses commas correctly?'),
        ans: ansChoice(coord ? [withC, noC, twoC] : [noC, withC, twoC]),
        sol: [
          coord ? T(`「${a} and ${b}」說得通，兩個字也能對調，所以是並列形容詞，中間加逗號。`, `"${a} and ${b} ${n}" makes sense and the words can be swapped, so they are coordinate: use a comma.`)
                : T(`「${a} and ${b} ${n}」聽起來不對，也不能對調，所以不加逗號。`, `"${a} and ${b} ${n}" sounds wrong and the words cannot be swapped, so use no comma.`),
          T('最後一個形容詞和名詞之間永遠不加逗號。', 'Never put a comma between the last adjective and the noun.'),
          T(`正確：${coord ? withC : noC}`, `Correct: ${coord ? withC : noC}`),
        ],
        hint: T('試試在兩個形容詞中間放 and。', 'Try putting "and" between the two adjectives.'),
      };
    },
  },
  {
    id: 'g7-wordiness',
    grade: 7,
    unit: 'style',
    name: T('刪除冗詞和重複', 'Eliminating wordiness and redundancy'),
    std: 'CCSS L.7.3a',
    lesson: {
      zh: '好的寫作<b>精簡</b>：同一個意思不要說兩次（6 a.m. in the morning、repeat again、final end result），也不要用一大串字代替一個字（due to the fact that → because）。',
      en: 'Strong writing is <b>concise</b>. Do not say the same thing twice (<i>6 a.m. in the morning, repeat again, final end result</i>), and do not use many words where one will do (<i>due to the fact that → because</i>).',
      ex: ['Wordy: Due to the fact that it rained, the game was canceled.', 'Concise: <b>Because</b> it rained, the game was canceled.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['{A} woke up at 6 a.m.', ['{A} woke up at 6 a.m. in the morning.', '{A} woke up early at 6 a.m. in the early morning.'], '「a.m.」本來就是早上', '"a.m." already means morning'],
        ['I think the library needs more graphic novels.', ['In my personal opinion, I think that the library needs more graphic novels.', 'In my own personal opinion, the library really and truly needs more graphic novels.'], '「opinion」和「I think」意思重複', '"in my opinion" and "I think" say the same thing'],
        ['The game was canceled because of the storm.', ['The game was canceled due to the fact that there was a storm.', 'The reason the game was canceled was because of the fact that it stormed.'], '「due to the fact that」可以換成 because', '"due to the fact that" can simply be "because"'],
        ['Please repeat the question.', ['Please repeat the question again.', 'Please repeat the question again one more time.'], '「repeat」本來就是「再說一次」', '"repeat" already means "say again"'],
        ['{A} finished the project.', ['{A} completely finished the entire project.', '{A} finished up the whole entire project.'], '「finished」就是全部完成，不用再加 completely、entire', '"finished" already means completely done'],
        ['The result surprised everyone.', ['The final end result surprised everyone.', 'The end result that happened in the end surprised everyone.'], '「result」本來就是最後的結果', '"result" already means the final outcome'],
        ['Every student must bring a calculator.', ['Each and every single student must bring a calculator.', 'Each and every student must bring along a calculator with them.'], '「each and every」重複了', '"each and every" repeats itself'],
        ['The box was square.', ['The box was square in shape.', 'The box was square in shape and form.'], '「square」本來就是形狀', '"square" is already a shape'],
        ['{A} returned the book to the library.', ['{A} returned the book back to the library.', '{A} went and returned the book back to the library again.'], '「return」就是「還回去」，不用 back', '"return" already means "give back"'],
        ['The gym is closed now.', ['At this point in time, the gym is currently closed.', 'The gym is currently closed at this present time.'], '「at this point in time」只是「now」', '"at this point in time" just means "now"'],
        ['The club has few volunteers.', ["The club's volunteers are few in number.", 'The number of volunteers that the club has is few in number.'], '「few」已經在說數量', '"few" is already about number'],
        ['Our class collected 200 cans for the food bank.', ['Our class, working together as a group, collected a total of 200 cans in all for the food bank.', 'Our class collected 200 cans in total all together for the food bank.'], '「a total of… in all」重複', '"a total of" and "in all" repeat each other'],
        ['{A} and {B} met at the park.', ['{A} and {B} met together at the park.', '{A} and {B} both met together with each other at the park.'], '「met」本來就是「一起」', '"met" already means they were together'],
        ['The free concert starts at noon.', ['The free concert with no charge starts at 12 noon.', 'The concert, which is free and costs nothing, starts at 12 noon.'], '「free」就是不用錢；noon 就是 12 點', '"free" already means no cost, and "noon" already means 12'],
      ];
      const it = r.pick(IT), right = fill(it[0], c), wrongs = it[1].map((w) => fill(w, c));
      return {
        q: T('哪一句最精簡、沒有多餘的字？', 'Which sentence is the most concise (no extra or repeated words)?'),
        ans: ansChoice([right, ...wrongs]),
        sol: [T(`冗詞：${it[2]}。`, `Redundancy: ${it[3]}.`), T(`精簡的句子：${right}`, `Concise: ${right}`)],
        hint: T('找找意思說了兩次的地方。', 'Look for an idea that is said twice.'),
      };
    },
  },
  {
    id: 'g7-precise-words',
    grade: 7,
    unit: 'words',
    name: T('選用精確的字詞', 'Choosing precise language'),
    std: 'CCSS L.7.3a',
    lesson: {
      zh: 'good、bad、nice、said、walked 這些字太籠統。用更<b>精確</b>的字，讀者才看得到畫面。選字時要看<b>上下文線索</b>，挑意思最符合的那個。',
      en: 'Words like <i>good, bad, nice, said, walked</i> are vague. A <b>precise</b> word lets readers picture exactly what happened. Use the <b>context clues</b> to pick the word that fits best.',
      ex: ['vague: The crowd <u>said</u> "Goal!"', 'precise: The crowd <b>roared</b> "Goal!"'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['After climbing for nine hours without a break, the hikers felt <u>tired</u>.', 'tired', 'exhausted', ['energized', 'curious'], '爬了九小時沒休息', 'nine hours without a break'],
        ['The crowd <u>said</u> "Goal!" so loudly that the stands shook.', 'said', 'roared', ['whispered', 'mumbled'], '大聲到看台都在震動', 'so loudly that the stands shook'],
        ['{A} <u>walked</u> across the finish line, barely able to lift {his} feet.', 'walked', 'staggered', ['skipped', 'raced'], '腳幾乎抬不起來', 'barely able to lift feet'],
        ['With broken windows and peeling paint, the old house looked <u>bad</u>.', 'bad', 'run-down', ['elegant', 'modern'], '窗戶破了、油漆剝落', 'broken windows and peeling paint'],
        ['Full of garlic and fresh basil, the soup smelled <u>good</u>.', 'good', 'fragrant', ['stale', 'bland'], '大蒜和新鮮羅勒的香味', 'garlic and fresh basil'],
        ['{A} was <u>happy</u> when {he} heard that {he} had won first prize.', 'happy', 'thrilled', ['disappointed', 'bored'], '得了第一名', 'winning first prize'],
        ['The hungry puppy <u>ate</u> its food in about three seconds.', 'ate', 'gobbled', ['nibbled', 'sampled'], '三秒鐘吃完', 'about three seconds'],
        ['The speech was <u>nice</u>; it moved half the audience to tears.', 'nice', 'touching', ['dull', 'confusing'], '一半的觀眾都哭了', 'half the audience in tears'],
        ['{A} <u>looked</u> at the strange footprints for several minutes, trying to figure them out.', 'looked', 'studied', ['glanced', 'peeked'], '看了好幾分鐘、想弄清楚', 'several minutes, trying to figure them out'],
        ['By morning, the <u>cold</u> lake water had formed a thin layer of ice.', 'cold', 'freezing', ['lukewarm', 'steaming'], '結了一層薄冰', 'a thin layer of ice'],
        ['The library was so <u>quiet</u> that you could hear a pin drop.', 'quiet', 'silent', ['noisy', 'crowded'], '安靜到聽得到針掉下來', 'you could hear a pin drop'],
        ['After months of training, {A} <u>got</u> a gold medal in the 400-meter race.', 'got', 'earned', ['lost', 'borrowed'], '訓練了好幾個月', 'months of training'],
        ['The tiny closet was too <u>small</u> for even one more coat.', 'small', 'cramped', ['spacious', 'empty'], '連一件外套都放不下', 'not even one more coat fits'],
        ['{A} <u>said</u> the answer so quietly that nobody heard it.', 'said', 'murmured', ['shouted', 'announced'], '小聲到沒人聽到', 'so quietly that nobody heard'],
      ];
      const it = r.pick(IT), s = fill(it[0], c);
      return {
        q: T(`用哪個字取代畫底線的「${it[1]}」最精確、最符合上下文？`, `Which word is the most precise replacement for "${it[1]}" in this context?`),
        text: s,
        ans: ansChoice([it[2], ...it[3]]),
        sol: [
          T(`上下文線索：「${it[4]}」，所以「${it[2]}」最貼切。`, `Context clue: "${it[5]}" — so "${it[2]}" fits best.`),
          T(`其他字的意思和線索相反或不符合。`, `The other words go against the clue.`),
          T(`改好的句子：${s.replace(/<u>.*?<\/u>/, it[2])}`, `Revised: ${s.replace(/<u>.*?<\/u>/, it[2])}`),
        ],
      };
    },
  },
  {
    id: 'g7-figurative',
    grade: 7,
    unit: 'words',
    name: T('修辭與典故', 'Figurative language and allusions'),
    std: 'CCSS L.7.5a',
    lesson: {
      zh: '<b>明喻</b> simile：用 like/as 比較。<b>暗喻</b> metaphor：直接說 A 是 B。<b>擬人</b> personification：讓東西有人的動作。<b>誇飾</b> hyperbole：故意誇大。<b>典故</b> allusion：提到有名的故事、神話或人物（如 Pandora\'s box、Hercules）。<b>狀聲詞</b> onomatopoeia：模仿聲音的字。',
      en: '<b>Simile</b>: compares with like/as. <b>Metaphor</b>: says A <i>is</i> B. <b>Personification</b>: gives a thing human actions. <b>Hyperbole</b>: huge exaggeration. <b>Allusion</b>: a reference to a well-known story, myth or person (Pandora\'s box, Hercules). <b>Onomatopoeia</b>: a word that imitates a sound.',
      ex: ['simile: as slick as an ice rink', 'metaphor: The classroom was a zoo.', 'allusion: Our coach has the patience of Job.'],
    },
    gen(r) {
      const c = cast(r);
      const L = {
        simile: [T('明喻（simile）', 'simile'), '用 like 或 as 來比較', 'it compares two things using "like" or "as"'],
        metaphor: [T('暗喻（metaphor）', 'metaphor'), '直接說一樣東西「是」另一樣東西', 'it says one thing IS another, without like/as'],
        personification: [T('擬人（personification）', 'personification'), '讓沒有生命的東西做人的動作', 'it gives a non-human thing human actions'],
        hyperbole: [T('誇飾（hyperbole）', 'hyperbole'), '故意誇大，不是真的', 'it exaggerates on purpose; it is not literally true'],
        allusion: [T('典故（allusion）', 'allusion'), '提到有名的神話、故事或人物', 'it refers to a famous myth, story or person'],
        onomatopoeia: [T('狀聲詞（onomatopoeia）', 'onomatopoeia'), '用字模仿聲音', 'the word imitates a sound'],
      };
      const IT = [
        ['The gym floor was as slick as an ice rink after the janitor mopped it.', 'simile', []],
        ['The stars sparkled like scattered diamonds.', 'simile', []],
        ['{A} moved through the crowded hallway like a fish swimming upstream.', 'simile', []],
        ['After the fire drill, the classroom was a zoo.', 'metaphor', ['hyperbole']],
        ['{A}\'s little brother is a walking encyclopedia of dinosaur facts.', 'metaphor', ['hyperbole']],
        ['The wind howled through the empty streets.', 'personification', ['onomatopoeia']],
        ['The old car groaned and complained all the way up the hill.', 'personification', ['onomatopoeia']],
        ['The sun smiled down on the picnic.', 'personification', []],
        ['I have told you a million times to close the door.', 'hyperbole', []],
        ['This backpack weighs a ton.', 'hyperbole', ['metaphor']],
        ['{A} was so hungry that {he} could have eaten a horse.', 'hyperbole', []],
        ['Our coach has the patience of Job.', 'allusion', ['metaphor', 'simile', 'hyperbole']],
        ['Opening the old storage closet turned out to be opening Pandora\'s box.', 'allusion', ['metaphor', 'simile']],
        ['Math was {A}\'s Achilles\' heel until {he} started getting extra help.', 'allusion', ['metaphor', 'simile']],
        ['The tiny team beat the champions in a true David-and-Goliath game.', 'allusion', ['metaphor', 'simile', 'hyperbole']],
        ['Buzz! The alarm clock jolted {A} awake.', 'onomatopoeia', []],
        ['The rain went drip, drip, drip on the tin roof.', 'onomatopoeia', []],
        ['The bacon sizzled and popped in the pan.', 'onomatopoeia', ['personification']],
      ];
      const [s0, a, no] = r.pick(IT), s = fill(s0, c);
      const pool = Object.keys(L).filter((k) => k !== a && !no.includes(k));
      const opts = [L[a][0], ...r.sample(pool, 3).map((k) => L[k][0])];
      return {
        q: T('這句話用了哪一種修辭？', 'Which kind of figurative language does this sentence use?'),
        text: s,
        ans: ansChoice(opts),
        sol: [T(`答案是 ${L[a][0].en}：${L[a][1]}。`, `It is ${L[a][0].en}: ${L[a][2]}.`), T('作者用這種寫法讓描述更生動、更有畫面。', 'Writers use it to make a description vivid and memorable.')],
      };
    },
  },
  {
    id: 'g7-thesis',
    grade: 7,
    unit: 'paragraphs',
    name: T('寫出論點句（thesis statement）', 'Writing a thesis statement'),
    std: 'CCSS W.7.1a',
    lesson: {
      zh: '<b>論點句</b>（thesis）通常放在引言最後，用一句話說出你的<b>主張</b>，最好也預告理由。它不是事實、不是問題，也不是「我要寫…」的宣告。',
      en: 'A <b>thesis statement</b> usually ends the introduction. In one sentence it states your <b>claim</b> and often previews your reasons. It is not a plain fact, a question, or an announcement like "In this essay I will…".',
      ex: ['Weak: In this essay, I will talk about recess.', 'Strong: Middle schools should keep recess because short breaks improve focus, mood and friendships.'],
    },
    gen(r) {
      const IT = [
        ['school start times', '上學時間', 'Middle schools should start at 9:00 a.m. because students who sleep more learn better, feel healthier, and arrive on time.', 'Most middle schools in our district start at 7:45 a.m.'],
        ['school gardens', '學校菜園', 'Every school should have a garden because it teaches science, encourages healthy eating, and brings students together.', 'Our school garden has six raised beds.'],
        ['video games', '電玩', 'Strategy video games can build problem-solving skills, as long as players set limits on their screen time.', 'The first home video game console was sold in 1972.'],
        ['classroom pets', '班級寵物', 'A classroom pet teaches responsibility, but only when the class follows a clear care schedule.', 'Some classrooms keep fish or hamsters.'],
        ['reading for fun', '休閒閱讀', 'Schools should set aside time every day for reading for fun because it builds vocabulary, empathy, and focus.', 'Our school library has more than 8,000 books.'],
        ['recycling in parks', '公園回收', 'Our town should put recycling bins in every park because litter is increasing and most of it could be recycled.', 'Plastic bottles are made from oil.'],
        ['learning a second language', '學第二語言', 'Learning a second language in middle school opens doors to new friendships, future careers, and fresh ways of thinking.', 'Spanish is an official language in more than twenty countries.'],
        ['team sports', '團隊運動', 'Playing a team sport teaches teenagers how to handle both winning and losing with grace.', 'A soccer team has eleven players on the field.'],
        ['volunteering', '志工服務', 'Volunteering helps students discover their own strengths while they help their community.', 'Many food banks need volunteers on weekends.'],
        ['homework limits', '作業量', 'Middle school homework should be limited to one hour a night so that students have time to rest, play, and pursue hobbies.', 'Students at our school get homework in four subjects.'],
      ];
      const [topic, zt, thesis, fact] = r.pick(IT);
      const W = [
        [fact, '這只是一個事實，沒有可以爭論的主張', 'it is just a fact, not a claim someone could argue with'],
        [`In this essay, I will talk about ${topic}.`, '這只是宣告要寫什麼，沒有主張', 'it only announces the topic; it makes no claim'],
        [`Have you ever thought about ${topic}?`, '問句可以當開頭，但不是論點', 'a question can be a hook, but it is not a thesis'],
        [`There are many things to say about ${topic}.`, '太籠統，沒有立場', 'it is too vague and takes no position'],
      ];
      const wr = r.sample(W, 3);
      return {
        q: T(`哪一句最適合當「${zt}」文章的論點句？`, `Which is the strongest thesis statement for an essay about ${topic}?`),
        ans: ansChoice([thesis, ...wr.map((w) => w[0])]),
        sol: [
          T('好的論點句說出一個可以爭論的主張，並預告理由。', 'A strong thesis makes a claim that someone could disagree with and previews the reasons.'),
          T(`正確答案：${thesis}`, `Best: ${thesis}`),
          T(`例如「${wr[0][0]}」不好，因為${wr[0][1]}。`, `For example, "${wr[0][0]}" is weak because ${wr[0][2]}.`),
        ],
      };
    },
  },
  {
    id: 'g7-claims-counterclaims',
    grade: 7,
    unit: 'organization',
    name: T('主張、反方論點與反駁', 'Claims, counterclaims and rebuttals'),
    std: 'CCSS W.7.1a',
    lesson: {
      zh: '<b>主張</b>（claim）是你的立場。<b>反方論點</b>（counterclaim）是反對的人會說的話，常用 Some people argue… / Critics say… 開頭。好的議論文會<b>承認反方</b>，再用證據<b>反駁</b>（rebuttal），通常以 However… 開頭。',
      en: 'Your <b>claim</b> is your position. A <b>counterclaim</b> is what someone on the other side would say, often introduced by "Some people argue…" or "Critics say…". A strong argument <b>acknowledges</b> the counterclaim and then answers it with a <b>rebuttal</b>, often starting with "However…".',
      ex: ['Claim: Our town should build a skate park.', 'Counterclaim: Some residents worry that it would be noisy.', 'Rebuttal: However, it could be built near the sports fields, far from houses.'],
    },
    gen(r) {
      const IT = [
        ['Our school should have a longer lunch period.', 'Some people argue that a longer lunch would make the school day end later.', 'Students who rush through lunch often skip the healthy foods on their trays.', 'Our school serves lunch in two shifts.', 'However, the school could shorten each passing period by one minute and keep the same end time.', 'Lunch is the favorite part of the day for many students.'],
        ['Students should be allowed to use phones at lunch.', 'Critics say that phones at lunch keep students from talking to each other.', 'Students could use their phones to check schedules or contact family members.', 'Many students carry phones to school.', 'However, the cafeteria could set aside phone-free tables for students who want to talk.', 'Phones come in many sizes and colors.'],
        ['Every middle school student should take a cooking class.', 'Opponents argue that teaching cooking is a family\'s job, not the school\'s.', 'Cooking teaches useful math skills such as measuring and estimating.', 'Pizza is one of the most popular foods in the country.', 'Yet many families do not have time to teach cooking, so schools can fill that gap.', 'Cooking shows are popular on television.'],
        ['Our town should build a skate park.', 'Some residents worry that a skate park would be too noisy.', 'A skate park would give teenagers a safe place to exercise.', 'Skateboarding became an Olympic sport in 2021.', 'However, the park could be built next to the sports fields, far from houses.', 'Skateboards come in many colors and sizes.'],
        ['Schools should offer more field trips.', 'Some people argue that field trips cost too much money.', 'Field trips let students see what they learn in real life.', 'The science museum downtown opens at 10 a.m.', 'However, many museums offer free visits for school groups.', 'School buses are usually yellow.'],
        ['Students should be allowed to choose their own seats.', 'Some teachers believe that students would just sit with friends and chat.', 'Students who feel comfortable are more likely to take part in discussions.', 'Most classrooms have about thirty desks.', 'However, teachers could let students keep their chosen seats only as long as they stay on task.', 'Some desks are next to the windows.'],
        ['Every student should learn to play a musical instrument.', 'Critics argue that instruments are too expensive for many families.', 'Learning music can improve memory and concentration.', 'A standard piano has 88 keys.', 'However, schools could lend instruments to students, as many band programs already do.', 'The guitar is a popular instrument.'],
        ['Middle schools should keep recess.', 'Some people say that middle school students are too old for recess.', 'Short breaks help students focus when they return to class.', 'Recess is common in elementary schools.', 'However, even adults take short breaks at work to stay productive.', 'Recess can be a lot of fun.'],
      ];
      const [claim, counter, support, fact, rebut, weak] = r.pick(IT);
      if (r.chance(0.5)) {
        return {
          q: T('哪一句是這個主張的「反方論點」？', 'Which sentence is a counterclaim to this claim?'),
          text: `Claim: ${claim}`,
          ans: ansChoice([counter, support, fact]),
          sol: [
            T('反方論點是「反對你的人會說的話」，常用 Some people argue / Critics say 開頭。', 'A counterclaim is what someone who disagrees would say; it often starts with "Some people argue" or "Critics say".'),
            T(`答案：${counter}`, `Answer: ${counter}`),
            T('另外兩句：一句支持主張（理由），一句只是事實。', 'Of the others, one supports the claim (a reason) and one is just a fact.'),
          ],
        };
      }
      return {
        q: T('哪一句最能「反駁」這個反方論點？', 'Which sentence best rebuts (answers) the counterclaim?'),
        text: `Claim: ${claim}<br>Counterclaim: ${counter}`,
        ans: ansChoice([rebut, weak, fact]),
        sol: [
          T('好的反駁要直接回應反方擔心的問題，並給出解決辦法或證據。', 'A strong rebuttal answers the exact worry in the counterclaim with a solution or evidence.'),
          T(`答案：${rebut}`, `Answer: ${rebut}`),
        ],
      };
    },
  },
  {
    id: 'g7-transitions',
    grade: 7,
    unit: 'organization',
    name: T('表示關係的轉折語', 'Transitions that show relationships'),
    std: 'CCSS W.7.2c',
    lesson: {
      zh: '轉折語告訴讀者兩個想法的<b>關係</b>：相反（However、On the other hand）、結果（As a result、Therefore）、補充（In addition、Furthermore）、舉例（For example、For instance）。',
      en: 'Transitions tell the reader how two ideas are <b>related</b>: contrast (<i>However, On the other hand</i>), result (<i>As a result, Therefore</i>), addition (<i>In addition, Furthermore</i>), example (<i>For example, For instance</i>).',
      ex: ['The bridge was closed. <b>As a result,</b> drivers took a longer route.', 'The forecast promised sun. <b>However,</b> it rained all day.'],
    },
    gen(r) {
      const IT = [
        { a: 'The forecast promised sunshine.', b: 'it rained all afternoon.', rel: 'contrast' },
        { a: '{A} practiced the speech for weeks.', b: '{he} still felt nervous on stage.', rel: 'contrast' },
        { a: 'Many people think sharks are dangerous.', b: 'most shark species are harmless to humans.', rel: 'contrast' },
        { a: 'The novel was over five hundred pages long.', b: '{A} finished it in two days.', rel: 'contrast' },
        { a: 'The bridge was closed for repairs.', b: 'drivers had to take a longer route.', rel: 'result' },
        { a: '{A} forgot to save {his} file.', b: '{he} had to type the whole report again.', rel: 'result' },
        { a: 'Bees pollinate many of the crops we eat.', b: 'a drop in bee populations could raise food prices.', rel: 'result' },
        { a: 'The bake sale raised more money than expected.', b: 'the library will get three new computers.', rel: 'result' },
        { a: 'Biking to school saves money on bus fares.', b: 'it is good exercise.', rel: 'addition' },
        { a: 'The new park has a large playground.', b: 'it has a walking trail around a pond.', rel: 'addition' },
        { a: 'Reading before bed helps you relax.', b: 'it can improve your vocabulary.', rel: 'addition' },
        { a: 'Learning to type quickly saves time on homework.', b: 'it is a useful skill for many jobs.', rel: 'addition' },
        { a: 'Many animals change color with the seasons.', b: 'the arctic fox turns white in winter.', rel: 'example' },
        { a: 'Our town offers many free activities.', b: 'the library hosts a movie night every Friday.', rel: 'example' },
        { a: 'Some drinks contain a surprising amount of sugar.', b: 'one bottle of fruit juice can hold six teaspoons of sugar.', rel: 'example' },
        { a: 'Some inventions were discovered by accident.', b: 'the microwave oven was invented after a melted candy bar surprised an engineer.', rel: 'example' },
      ];
      return transitionDrill(r, IT, ['contrast', 'result', 'addition', 'example']);
    },
  },
  {
    id: 'g7-objective-tone',
    grade: 7,
    unit: 'style',
    name: T('客觀與主觀的語氣', 'Objective vs. subjective tone'),
    std: 'CCSS W.7.2e',
    lesson: {
      zh: '<b>客觀</b>（objective）的句子只陳述可以查證的事實，不帶個人好惡；<b>主觀</b>（subjective）的句子表達感覺或評價（awesome、gross、the best ever）。說明文和報告要用客觀、正式的語氣。',
      en: 'An <b>objective</b> sentence states facts that can be checked, with no personal feelings. A <b>subjective</b> sentence shows feelings or judgments (<i>awesome, gross, the best ever</i>). Informative essays and reports use an objective, formal tone.',
      ex: ['Objective: The stadium seats 40,000 people.', 'Subjective: The stadium is a ridiculous waste of money.'],
    },
    gen(r) {
      const IT = [
        ['The new stadium seats 40,000 people and cost $200 million to build.', ['The new stadium is a ridiculous waste of money.', 'Everyone loves the awesome new stadium!']],
        ['Honeybees visit thousands of flowers each day to collect nectar.', ['Honeybees are the coolest insects ever.', 'Bees are scary and annoying.']],
        ['The city council voted 5 to 2 to extend library hours.', ['The council finally made a smart choice for once.', 'Only lazy people would vote against more library hours.']],
        ['The novel follows a girl who travels across the country to find her brother.', ['The novel is boring and way too long.', 'This is the best book anyone will ever read.']],
        ['Most teenagers need eight to ten hours of sleep each night.', ['Teens who stay up late are just making silly choices.', 'Sleep is totally overrated.']],
        ['The school cafeteria now offers a vegetarian meal every day.', ['The cafeteria food is gross, so the new meal will not help.', 'Finally, the cafeteria serves something edible!']],
        ['The bridge was built in 1932 and repaired in 2015.', ['That ugly old bridge should be torn down.', 'The bridge is the most beautiful sight in the whole world.']],
        ['A survey found that 62 percent of our students walk or bike to school.', ['Students who get a ride to school are lazy.', 'Walking to school is obviously the best way to start the day.']],
        ['Sea otters use rocks as tools to open shellfish.', ['Sea otters are absolutely adorable.', 'Sea otters are the smartest animals on the planet.']],
        ['The movie won three awards for its special effects.', ["The movie's special effects were mind-blowing.", 'Anyone who disliked this movie has terrible taste.']],
      ];
      const it = r.pick(IT);
      if (r.chance(0.6)) {
        return {
          q: T('哪一句是「客觀」的（只有事實，沒有個人感覺）？', 'Which sentence is objective (facts only, no personal feelings)?'),
          ans: ansChoice([it[0], ...it[1]]),
          sol: [T('客觀的句子有可以查證的事實（數字、日期、事件）。', 'An objective sentence gives facts that can be checked: numbers, dates, events.'), T(`答案：${it[0]}`, `Answer: ${it[0]}`), T('其他句子用了帶感情的字或評價，所以是主觀的。', 'The others use loaded words or judgments, so they are subjective.')],
        };
      }
      const subj = r.pick(it[1]), other = pickOther(r, IT, it)[0];
      return {
        q: T('哪一句是「主觀」的（表達感覺或評價）？', 'Which sentence is subjective (it shows feelings or judgment)?'),
        ans: ansChoice([subj, it[0], other]),
        sol: [T(`「${subj}」表達作者的感覺或評價，無法用事實證明。`, `"${subj}" shows the writer's feelings or judgment; it cannot be proven.`), T('另外兩句都是可以查證的事實。', 'The other two are facts that can be checked.')],
      };
    },
  },
  {
    id: 'g7-cite-evidence',
    grade: 7,
    unit: 'research',
    name: T('引用證據：介紹引文', 'Citing evidence: introducing a quotation'),
    std: 'CCSS W.7.1b',
    lesson: {
      zh: '引用別人的話時，要用<b>引導語</b>（signal phrase）告訴讀者是誰說的，並加上引號。兩種寫法：<br>① Dr. Ortiz explains, "Sea turtles…."（逗號＋大寫）<br>② Dr. Ortiz explains that "sea turtles…."（that 後面不加逗號，小寫）<br>不要讓引文單獨「掉」在段落裡。',
      en: 'Introduce every quotation with a <b>signal phrase</b> that tells who said it, and use quotation marks. Two patterns:<br>① Dr. Ortiz explains, "Sea turtles…." (comma + capital)<br>② Dr. Ortiz explains that "sea turtles…." (no comma after <i>that</i>, lowercase)<br>Never drop a quotation into a paragraph by itself.',
      ex: ['Coach Reyes says, "Every great team is built on trust."', 'Coach Reyes says that "every great team is built on trust."'],
    },
    gen(r) {
      const SRC = [
        ['Dr. Lena Ortiz, a marine biologist,', 'sea turtles often return to the beach where they hatched'],
        ['Coach Daniel Reyes', 'every great team is built on trust'],
        ['Dr. Amir Haddad, a sleep researcher,', 'teenagers who sleep less than seven hours make more mistakes on tests'],
        ['Professor Helen Park, a historian,', 'the town\'s first school had only one room and twelve students'],
        ['Park ranger Wanda Cole', 'most wildfires in this region are started by people'],
        ['Dr. Sarah Kim, a nutrition expert,', 'breakfast gives the brain fuel for the morning'],
        ['Engineer Marcus Bell', 'a strong bridge must be able to bend a little'],
        ['Author Grace Lin Tran', 'reading fiction helps us understand people who are different from us'],
      ];
      const [who, q0] = r.pick(SRC), v = r.pick(['explains', 'states', 'notes', 'writes']);
      const Q = cap(q0), q = low(q0);
      const right = r.chance(0.5) ? `${who} ${v}, “${Q}.”` : `${who} ${v} that “${q}.”`;
      const W = [
        [`“${Q}.”`, '引文單獨出現，沒有引導語說明是誰說的', 'the quotation is "dropped" in with no signal phrase'],
        [`${who} ${v}, ${Q}.`, '少了引號，看起來像是自己的話', 'the quotation marks are missing, so it looks like your own words'],
        [`${who} ${v} that, “${Q}.”`, 'that 後面不加逗號，也不用大寫', 'no comma (and no capital) after "that"'],
        [`${who} ${v}. “${Q}.”`, '引導語和引文被句號切開了', 'a period wrongly cuts the signal phrase off from the quotation'],
      ];
      const wr = r.sample(W, 3);
      return {
        q: T('哪一句介紹引文的方式最正確？', 'Which sentence introduces the quotation correctly?'),
        ans: ansChoice([right, ...wr.map((w) => w[0])]),
        sol: [
          T(`正確：${right}`, `Correct: ${right}`),
          T('引導語說出是誰說的；用逗號＋大寫，或用 that＋小寫，引文要加引號。', 'The signal phrase names the speaker; use a comma + capital, or "that" + lowercase, and keep the quotation marks.'),
          T(`錯誤例子「${wr[0][0]}」：${wr[0][1]}。`, `Wrong: "${wr[0][0]}" — ${wr[0][2]}.`),
        ],
      };
    },
  },
  {
    id: 'g7-roots-affixes',
    grade: 7,
    unit: 'words',
    name: T('希臘、拉丁字根與字首', 'Greek and Latin roots and affixes'),
    std: 'CCSS L.7.4b',
    lesson: {
      zh: '很多英文字由希臘或拉丁<b>字根</b>組成。知道字根，就能猜出生字的意思：<b>bene</b>＝好、<b>chron</b>＝時間、<b>port</b>＝攜帶、<b>spect</b>＝看、<b>aud</b>＝聽……',
      en: 'Many English words are built from Greek and Latin <b>roots</b>. Knowing the root helps you figure out a new word: <b>bene</b> = good, <b>chron</b> = time, <b>port</b> = carry, <b>spect</b> = look, <b>aud</b> = hear…',
      ex: ['<b>port</b>able = able to be <b>carried</b>', '<b>aud</b>ible = able to be <b>heard</b>', '<b>chron</b>ological = in <b>time</b> order'],
    },
    gen(r) {
      const R = [
        ['bene', 'good', '好', 'benefit', 'benevolent', 'kind and wanting to do good'],
        ['mal', 'bad', '壞', 'malnutrition', 'malfunction', 'to fail to work properly'],
        ['chron', 'time', '時間', 'chronic', 'chronological', 'arranged in the order of time'],
        ['graph', 'write', '寫', 'paragraph', 'autograph', 'a famous person\'s own written signature'],
        ['bio', 'life', '生命', 'biography', 'biology', 'the study of living things'],
        ['geo', 'earth', '地球、土地', 'geography', 'geology', 'the study of rocks and the earth'],
        ['tele', 'far', '遠', 'telephone', 'telescope', 'a tool for seeing faraway objects'],
        ['port', 'carry', '攜帶', 'transport', 'portable', 'easy to carry'],
        ['dict', 'say', '說', 'dictionary', 'predict', 'to say what will happen before it happens'],
        ['spect', 'look', '看', 'inspect', 'spectator', 'a person who watches an event'],
        ['aud', 'hear', '聽', 'audience', 'audible', 'loud enough to be heard'],
        ['aqua', 'water', '水', 'aquatic', 'aquarium', 'a glass tank of water for keeping fish'],
        ['therm', 'heat', '熱', 'thermos', 'thermometer', 'a tool that measures temperature'],
        ['micro', 'small', '小', 'microchip', 'microscope', 'a tool for seeing very small things'],
        ['rupt', 'break', '破裂', 'interrupt', 'erupt', 'to break out suddenly'],
        ['ject', 'throw', '丟、投', 'project', 'eject', 'to throw or push out'],
        ['struct', 'build', '建造', 'structure', 'construct', 'to build'],
        ['manu', 'hand', '手', 'manual', 'manuscript', 'a document written by hand'],
        ['sub', 'under', '在…下面', 'subway', 'submarine', 'a ship that travels under the sea'],
        ['inter', 'between', '在…之間', 'internet', 'international', 'happening between nations'],
      ];
      const it = r.pick(R), others = r.sample(R.filter((x) => x !== it), 3);
      if (r.chance(0.5)) {
        return {
          q: T(`字根 <b>${it[0]}</b>（例如 ${it[3]}、${it[4]}）是什麼意思？`, `The root <b>${it[0]}</b> (as in ${it[3]} and ${it[4]}) means…`),
          ans: ansChoice([it[1], ...others.map((x) => x[1])]),
          sol: [T(`「${it[0]}」的意思是「${it[2]}」（${it[1]}）。`, `"${it[0]}" means "${it[1]}".`), T(`例如 ${it[4]}：${it[5]}。`, `For example, ${it[4]} means ${it[5]}.`)],
        };
      }
      return {
        q: T(`字根 <b>${it[0]}</b> 的意思是「${it[2]}」（${it[1]}）。<b>${it[4]}</b> 最可能是什麼意思？`, `The root <b>${it[0]}</b> means "${it[1]}". What does <b>${it[4]}</b> most likely mean?`),
        ans: ansChoice([it[5], ...others.map((x) => x[5])]),
        sol: [T(`${it[4]} 裡有「${it[0]}」（${it[2]}），所以意思和「${it[1]}」有關。`, `${it[4]} contains "${it[0]}" (${it[1]}), so its meaning is about "${it[1]}".`), T(`${it[4]}＝${it[5]}。`, `${it[4]} = ${it[5]}.`)],
      };
    },
  },
  {
    id: 'g7-confusing-words',
    grade: 7,
    unit: 'words',
    name: T('容易混淆的字：affect/effect、accept/except、than/then…', 'Confusing word pairs: affect/effect, accept/except, than/then…'),
    std: 'Grade 7 · Language',
    lesson: {
      zh: '<b>affect</b>（動詞，影響）／<b>effect</b>（名詞，效果）；<b>accept</b>（接受）／<b>except</b>（除了）；<b>than</b>（比較）／<b>then</b>（然後）；<b>lose</b>（遺失）／<b>loose</b>（鬆的）；<b>its</b>（它的）／<b>it\'s</b>（it is）；<b>principal</b>（校長）／<b>principle</b>（原則）；<b>advice</b>（名詞）／<b>advise</b>（動詞）。',
      en: '<b>affect</b> (verb: to influence) / <b>effect</b> (noun: a result); <b>accept</b> (to receive) / <b>except</b> (but, leaving out); <b>than</b> (compares) / <b>then</b> (next, at that time); <b>lose</b> (misplace) / <b>loose</b> (not tight); <b>its</b> (belongs to it) / <b>it\'s</b> (it is); <b>principal</b> (school leader) / <b>principle</b> (a rule or belief); <b>advice</b> (noun) / <b>advise</b> (verb).',
      ex: ['Noise can <b>affect</b> sleep. The <b>effect</b> was huge.', 'She is taller <b>than</b> me. <b>Then</b> we left.'],
    },
    gen(r) {
      const c = cast(r);
      const RULE = {
        ae: ['affect 是動詞（影響）；effect 是名詞（效果、影響）。前面有 a/the/big 的通常是名詞 effect。', 'affect is a verb (to influence); effect is usually a noun (a result). After a/the/big you need the noun "effect".'],
        ax: ['accept＝接受；except＝除了。', 'accept = to receive or agree to; except = leaving out.'],
        tt: ['than 用在比較；then 表示「然後、那時」。', '"than" compares; "then" tells when (next, at that time).'],
        ll: ['lose（動詞）＝遺失、輸；loose（形容詞）＝鬆的。', 'lose (verb) = misplace or fail to win; loose (adjective) = not tight.'],
        ii: ['its＝它的（所有格，沒有撇號）；it\'s＝it is。', 'its = belonging to it (no apostrophe); it\'s = it is.'],
        pp: ['principal＝校長（或主要的）；principle＝原則、信念。', 'principal = the head of a school; principle = a rule or belief.'],
        av: ['advice 是名詞（建議）；advise 是動詞（建議某人）。', 'advice is a noun; advise is a verb.'],
        dd: ['dessert＝甜點（兩個 s，像 "so sweet"）；desert＝沙漠。', 'dessert = a sweet course (two s\'s, "so sweet"); desert = a dry, sandy place.'],
      };
      const IT = [
        ['Staying up late can ___ your mood the next day.', 'affect', 'effect', 'ae'],
        ['The new schedule had a big ___ on {A}.', 'effect', 'affect', 'ae'],
        ['The loud music did not ___ {A}\'s concentration.', 'affect', 'effect', 'ae'],
        ['{A} will ___ the award on behalf of the whole team.', 'accept', 'except', 'ax'],
        ['Everyone ___ {A} finished the quiz early.', 'except', 'accept', 'ax'],
        ['Please ___ my apology for being late.', 'accept', 'except', 'ax'],
        ['{A} is taller ___ {his} older brother.', 'than', 'then', 'tt'],
        ['First we read the article, and ___ we wrote a response.', 'then', 'than', 'tt'],
        ['This puzzle is much harder ___ the last one.', 'than', 'then', 'tt'],
        ['Be careful not to ___ your ticket.', 'lose', 'loose', 'll'],
        ['The chain on {A}\'s bike is ___ again.', 'loose', 'lose', 'll'],
        ['The team won ___ first game of the season.', 'its', "it's", 'ii'],
        ['{A} thinks ___ going to rain this afternoon.', "it's", 'its', 'ii'],
        ['The ___ announced a snow day over the loudspeaker.', 'principal', 'principle', 'pp'],
        ['Honesty is an important ___ in our family.', 'principle', 'principal', 'pp'],
        ['{A} gave me great ___ about the science fair.', 'advice', 'advise', 'av'],
        ['I ___ you to start your project early.', 'advise', 'advice', 'av'],
        ['We had apple pie for ___.', 'dessert', 'desert', 'dd'],
        ['Camels can survive for days in the ___.', 'desert', 'dessert', 'dd'],
      ];
      const [s0, right, wrong, k] = r.pick(IT), s = fill(s0, c);
      return {
        q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
        ans: ansChoice([right, wrong]),
        sol: [T(RULE[k][0], RULE[k][1]), T(`正確：${s.replace('___', right)}`, `Correct: ${s.replace('___', right)}`)],
      };
    },
  },
];

// ================= GRADE 8 =================
const G8 = [
  {
    id: 'g8-verbals',
    grade: 8,
    unit: 'grammar',
    name: T('非謂語動詞：動名詞、分詞、不定詞', 'Verbals: gerunds, participles and infinitives'),
    std: 'CCSS L.8.1a',
    lesson: {
      zh: '<b>非謂語動詞</b>長得像動詞，卻當其他詞性用。<br><b>動名詞</b>（gerund）：-ing 當名詞用（<i>Swimming</i> is fun.）。<br><b>分詞</b>（participle）：-ing 或 -ed/-en 當形容詞用（the <i>sleeping</i> puppy、the <i>broken</i> window）。<br><b>不定詞</b>（infinitive）：to＋原形動詞（I want <i>to swim</i>.）。',
      en: 'A <b>verbal</b> looks like a verb but does another job.<br><b>Gerund</b>: an -ing word used as a noun (<i>Swimming</i> is fun.).<br><b>Participle</b>: an -ing or -ed/-en word used as an adjective (the <i>sleeping</i> puppy, the <i>broken</i> window).<br><b>Infinitive</b>: to + verb (I want <i>to swim</i>.).',
      ex: ['Gerund: <u>Baking</u> relaxes me.', 'Participle: The <u>baked</u> bread smelled wonderful.', 'Infinitive: I hope <u>to bake</u> bread tonight.'],
    },
    gen(r) {
      const c = cast(r);
      const ACT = [['swimming', 'swim'], ['sketching', 'sketch'], ['gardening', 'garden'], ['cycling', 'cycle'], ['baking', 'bake'], ['hiking', 'hike'], ['juggling', 'juggle'], ['skateboarding', 'skateboard'], ['knitting', 'knit']];
      const [ing, base] = r.pick(ACT);
      const kind = r.pick(['g', 'g', 'p', 'p', 'i']);
      let s;
      if (kind === 'g') s = r.pick([`<u>${cap(ing)}</u> is {A}'s favorite way to relax.`, `{A} enjoys <u>${ing}</u> on weekends.`, `{A} became more patient by <u>${ing}</u> every day.`, `{A}'s favorite hobby is <u>${ing}</u>.`]);
      else if (kind === 'i') s = r.pick([`{A} hopes <u>to ${base}</u> more this summer.`, `<u>To ${base}</u> well takes a lot of patience.`, `{A}'s goal is <u>to ${base}</u> every weekend.`, `{A} decided <u>to ${base}</u> with {his} cousins.`]);
      else s = r.pick([
        '<u>Humming softly</u>, {A} packed {his} bag.', '<u>Smiling proudly</u>, {A} held up the trophy.', 'The <u>sleeping</u> puppy did not hear {A} come in.',
        'The <u>broken</u> window let in a cold draft.', '{A} stepped carefully over the <u>fallen</u> branches.', 'The <u>exhausted</u> runners rested in the shade.',
        '<u>Tired from the long hike</u>, {A} fell asleep early.', 'The <u>giggling</u> children ran toward the ice cream truck.',
      ]);
      s = fill(s, c);
      const L = { g: T('動名詞（gerund）', 'gerund'), p: T('分詞（participle）', 'participle'), i: T('不定詞（infinitive）', 'infinitive') };
      const why = {
        g: T('這個 -ing 字當「名詞」用（當主詞、受詞或接在介係詞後面），所以是動名詞。', 'The -ing word works as a noun (a subject, an object, or after a preposition), so it is a gerund.'),
        p: T('這個字（或片語）在「形容」一個名詞，所以是分詞。', 'The word (or phrase) describes a noun, like an adjective, so it is a participle.'),
        i: T('to＋原形動詞，所以是不定詞。', 'It is "to" + a verb, so it is an infinitive.'),
      }[kind];
      return {
        q: T('畫底線的非謂語動詞是哪一種？', 'What kind of verbal is underlined?'),
        text: s,
        ans: ansChoice([L[kind], ...Object.keys(L).filter((k) => k !== kind).map((k) => L[k])]),
        sol: [why, T('小技巧：能換成 "it" 的 -ing 是動名詞；在描述某人某物的是分詞。', 'Tip: an -ing word you can replace with "it" is a gerund; one that describes someone or something is a participle.')],
      };
    },
  },
  {
    id: 'g8-active-passive',
    grade: 8,
    unit: 'sentences',
    name: T('主動語態與被動語態', 'Active and passive voice'),
    std: 'CCSS L.8.1b',
    lesson: {
      zh: '<b>主動</b>：主詞做動作（Mia painted the mural.）。<b>被動</b>：主詞接受動作，用 <b>be 動詞＋過去分詞</b>（The mural was painted by Mia.）。主動通常比較清楚有力；當做動作的人不知道或不重要時，才用被動（My bike was stolen.）。注意：was painting 是過去進行式，不是被動！',
      en: '<b>Active</b>: the subject does the action (Mia painted the mural.). <b>Passive</b>: the subject receives the action, using <b>be + past participle</b> (The mural was painted by Mia.). Active is usually clearer and stronger; use passive when the doer is unknown or unimportant (My bike was stolen.). Careful: "was painting" is past progressive, not passive!',
      ex: ['Active: The committee <b>chose</b> the music.', 'Passive: The music <b>was chosen</b> by the committee.'],
    },
    gen(r) {
      const c = cast(r);
      const V = [['painted', 'painted', 'painting', 'the mural', 'was'], ['wrote', 'written', 'writing', 'the script', 'was'], ['baked', 'baked', 'baking', 'the bread', 'was'], ['designed', 'designed', 'designing', 'the poster', 'was'], ['built', 'built', 'building', 'the birdhouse', 'was'], ['planted', 'planted', 'planting', 'the tomatoes', 'were'], ['took', 'taken', 'taking', 'the photographs', 'were'], ['drew', 'drawn', 'drawing', 'the map', 'was'], ['repaired', 'repaired', 'repairing', 'the fence', 'was'], ['chose', 'chosen', 'choosing', 'the songs', 'were']];
      const [pa, pp, ing, obj, be] = r.pick(V);
      const act = `${c.A} ${pa} ${obj}.`, pas = `${cap(obj)} ${be} ${pp} by ${c.A}.`, prog = `${c.A} was ${ing} ${obj}.`;
      const t = r.pick(['id', 'which', 'rewrite']);
      if (t === 'id') {
        const isPas = r.chance(0.5), s = isPas ? pas : act;
        const A = T('主動語態（active）', 'active voice'), P = T('被動語態（passive）', 'passive voice');
        return {
          q: T('這個句子是主動還是被動語態？', 'Is this sentence in the active or passive voice?'),
          text: s,
          ans: ansChoice(isPas ? [P, A] : [A, P]),
          sol: [isPas ? T(`「${be} ${pp}」是 be 動詞＋過去分詞，主詞「${obj}」接受動作，所以是被動。`, `"${be} ${pp}" is be + past participle, and the subject (${obj}) receives the action, so it is passive.`)
                      : T(`主詞「${c.A}」自己做動作（${pa}），所以是主動。`, `The subject (${c.A}) does the action (${pa}), so it is active.`),
                T(`主動：${act}　被動：${pas}`, `Active: ${act} Passive: ${pas}`)],
        };
      }
      if (t === 'which') {
        return {
          q: T('哪一句是被動語態？', 'Which sentence is in the passive voice?'),
          ans: ansChoice([pas, act, prog]),
          sol: [T(`被動語態＝be 動詞＋過去分詞：${pas}`, `Passive = be + past participle: ${pas}`), T(`「${prog}」是過去進行式（was＋-ing），仍然是主動。`, `"${prog}" is past progressive (was + -ing); it is still active.`)],
        };
      }
      const wrong1 = `${cap(obj)} ${pa} ${c.A}.`, wrong2 = `${c.A} ${be === 'were' ? 'was' : 'was'} ${pp} ${obj}.`;
      return {
        q: T('把這個被動句改成主動語態，哪一句正確？', 'Which sentence correctly rewrites this in the active voice?'),
        text: pas,
        ans: ansChoice([act, wrong1, wrong2]),
        sol: [T(`做動作的人是「${c.A}」，把他／她移到主詞的位置。`, `The doer is ${c.A}, so ${c.A} becomes the subject.`), T(`主動：${act}`, `Active: ${act}`)],
      };
    },
  },
  {
    id: 'g8-verb-moods',
    grade: 8,
    unit: 'grammar',
    name: T('動詞的語氣（直述、祈使、疑問、條件、假設）', 'Verb moods: indicative, imperative, interrogative, conditional, subjunctive'),
    std: 'CCSS L.8.1c',
    lesson: {
      zh: '<b>直述</b> indicative：陳述事實。<b>祈使</b> imperative：命令或請求（Close the door.）。<b>疑問</b> interrogative：發問。<b>條件</b> conditional：可能發生的事（would、could、might）。<b>假設</b> subjunctive：願望、要求或與事實相反（I wish I <b>were</b>…、The coach insists that he <b>arrive</b> early.）。',
      en: '<b>Indicative</b>: states a fact. <b>Imperative</b>: gives a command or request (Close the door.). <b>Interrogative</b>: asks a question. <b>Conditional</b>: what could happen (would, could, might). <b>Subjunctive</b>: wishes, demands or unreal situations (I wish I <b>were</b>…, The coach insists that he <b>arrive</b> early.).',
      ex: ['Indicative: Ava practices every day.', 'Subjunctive: I wish Ava <b>were</b> here.', 'Conditional: Ava <b>would</b> enjoy the museum.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = {
        indicative: ['{A} practices the violin every evening.', 'The museum opens at ten on Saturdays.', '{A} finished the puzzle before dinner.', 'The bus to the stadium leaves every twenty minutes.'],
        imperative: ['Practice the violin every evening.', 'Please close the door quietly.', 'Turn off the lights before you leave.', 'Hand in your essays by Friday.'],
        interrogative: ['Did {A} finish the puzzle before dinner?', 'Where is the nearest library?', 'Will the museum open early on Saturday?', 'Has {A} read the next chapter yet?'],
        conditional: ['{A} would enjoy the science museum.', 'With more time, {A} could finish the mural.', 'The team might win the next game.', 'A longer break would help everyone relax.'],
        subjunctive: ['I wish {A} were here to see this.', 'The coach insists that every player arrive by noon.', 'It is essential that {A} be on time.', '{A} talks as if {he} were the team captain.', 'The teacher asked that each student bring a pencil.'],
      };
      const ZH = { indicative: '直述語氣', imperative: '祈使語氣', interrogative: '疑問語氣', conditional: '條件語氣', subjunctive: '假設語氣' };
      const WHY = {
        indicative: ['陳述一件事實。', 'it simply states a fact.'],
        imperative: ['它在下指令或提出請求，主詞 you 被省略了。', 'it gives a command or request; the subject "you" is understood.'],
        interrogative: ['它在發問，以問號結尾。', 'it asks a question.'],
        conditional: ['用 would／could／might 說可能發生的事。', 'it uses would/could/might for something that could happen.'],
        subjunctive: ['表達願望、要求或與事實相反的情況，所以用 were 或原形動詞（arrive、be、bring）。', 'it expresses a wish, a demand or something unreal, so it uses "were" or the base verb (arrive, be, bring).'],
      };
      const m = r.pick(Object.keys(IT)), s = fill(r.pick(IT[m]), c);
      return {
        q: T('這個句子的動詞是哪一種語氣？', 'Which verb mood does this sentence use?'),
        text: s,
        ans: ansChoice([m, ...Object.keys(IT).filter((k) => k !== m)]),
        sol: [T(`這是${ZH[m]}（${m}）：${WHY[m][0]}`, `It is ${m}: ${WHY[m][1]}`), T('五種語氣：indicative、imperative、interrogative、conditional、subjunctive。', 'The five moods: indicative, imperative, interrogative, conditional, subjunctive.')],
      };
    },
  },
  {
    id: 'g8-shifts',
    grade: 8,
    unit: 'sentences',
    name: T('避免不當的語態與語氣轉換', 'Avoiding shifts in voice and mood'),
    std: 'CCSS L.8.1d',
    lesson: {
      zh: '同一個句子裡，語態和語氣要<b>一致</b>。主動接被動（Mia wrote the script, and the props were built by her.）或祈使接直述（Preheat the oven, and then you should mix the flour.）都會讓句子不順。',
      en: 'Keep voice and mood <b>consistent</b> within a sentence. Switching from active to passive (Mia wrote the script, and the props were built by her.) or from imperative to indicative (Preheat the oven, and then you should mix the flour.) makes writing clumsy.',
      ex: ['Shift: Read the directions, and then you should answer the questions.', 'Fixed: <b>Read</b> the directions, and then <b>answer</b> the questions.'],
    },
    gen(r) {
      const c = cast(r);
      if (r.chance(0.5)) {
        const V = [['wrote the script', 'built the props', 'the props were built'], ['washed the car', 'vacuumed the seats', 'the seats were vacuumed'], ['researched the topic', 'wrote the report', 'the report was written'], ['planted the seeds', 'watered the garden', 'the garden was watered'], ['mixed the batter', 'baked the cookies', 'the cookies were baked'], ['cleaned the cage', 'fed the hamster', 'the hamster was fed']];
        const [a1, a2, p2] = r.pick(V);
        const right = `${c.A} ${a1} and ${a2}.`, w1 = `${c.A} ${a1}, and ${p2} by ${c.him}.`;
        const pas1 = { 'wrote the script': 'The script was written', 'washed the car': 'The car was washed', 'researched the topic': 'The topic was researched', 'planted the seeds': 'The seeds were planted', 'mixed the batter': 'The batter was mixed', 'cleaned the cage': 'The cage was cleaned' }[a1];
        const w2 = `${pas1} by ${c.A}, and ${c.he} ${a2}.`;
        return {
          q: T('哪一句沒有不必要的語態轉換？', 'Which sentence avoids an unnecessary shift in voice?'),
          ans: ansChoice([right, w1, w2]),
          sol: [T('錯誤的句子從主動換成被動（或反過來），讀起來很繞。', 'The wrong sentences switch between active and passive voice, which is clumsy.'), T(`兩個動作都用主動：${right}`, `Keep both actions active: ${right}`)],
        };
      }
      const S = [['preheat the oven', 'mix the flour and sugar'], ['open the app', 'enter your student number'], ['read the directions carefully', 'answer every question'], ['rinse the brushes', 'let them dry on a towel'], ['plug in the robot', 'press the green button'], ['measure the board', 'cut it along the line'], ['warm up for ten minutes', 'stretch your legs']];
      const [s1, s2] = r.pick(S);
      const right = `First, ${s1}, and then ${s2}.`;
      return {
        q: T('哪一句沒有不必要的語氣轉換？', 'Which sentence avoids an unnecessary shift in mood?'),
        ans: ansChoice([right, `First, ${s1}, and then you should ${s2}.`, `First, you should ${s1}, and then ${s2}.`]),
        sol: [T('步驟說明用祈使語氣（直接用原形動詞下指令）。錯誤的句子中途換成「you should」的直述語氣。', 'Instructions use the imperative mood (start with the verb). The wrong sentences switch to "you should" (indicative) halfway.'), T(`一致的句子：${right}`, `Consistent: ${right}`)],
      };
    },
  },
  {
    id: 'g8-pause-punctuation',
    grade: 8,
    unit: 'mechanics',
    name: T('用逗號、刪節號、破折號表示停頓與省略', 'Commas, ellipses and dashes for pauses, breaks and omissions'),
    std: 'CCSS L.8.2a',
    lesson: {
      zh: '<b>破折號</b>（—）表示突然的中斷或強調：I opened the box and—wait, was that a frog?<br><b>刪節號</b>（…）表示引文中<b>省略</b>了一些字，但不能改變原意。<br><b>一對逗號</b>（或一對破折號）把補充資訊包起來：My cousin, who lives in Toronto, is visiting.',
      en: 'A <b>dash</b> (—) shows a sudden break or adds emphasis: I opened the box and—wait, was that a frog?<br>An <b>ellipsis</b> (…) shows that words were <b>left out</b> of a quotation, without changing its meaning.<br>A <b>pair</b> of commas (or a pair of dashes) sets off extra information: My cousin, who lives in Toronto, is visiting.',
      ex: ['Original: "The library, which opened in March, has loaned out ten thousand books."', 'Shortened: "The library … has loaned out ten thousand books."'],
    },
    gen(r) {
      const c = cast(r);
      const t = r.pick(['omit', 'omit', 'dash', 'pair']);
      if (t === 'omit') {
        const IT = [
          ['The old lighthouse, which was built in 1887, still guides ships safely into the harbor.', 'The old lighthouse', 'still guides ships safely into the harbor.'],
          ['Our study found that students who read every day, even for just ten minutes, scored higher on vocabulary tests.', 'Our study found that students who read every day', 'scored higher on vocabulary tests.'],
          ['The mayor said that the park, despite last week\'s heavy storm, will open on schedule.', 'The mayor said that the park', 'will open on schedule.'],
          ['Honeybees, like many other pollinators, are facing serious threats from habitat loss.', 'Honeybees', 'are facing serious threats from habitat loss.'],
          ['The new library, which opened in March, has already loaned out more than ten thousand books.', 'The new library', 'has already loaned out more than ten thousand books.'],
          ['The bridge, according to the engineers who inspected it, is safe for cars but not for trucks.', 'The bridge', 'is safe for cars but not for trucks.'],
        ];
        const [orig, a, b] = r.pick(IT);
        const right = `“${a} … ${b}”`;
        const wrongs = [`“${a} ${b}”`, `“${a}, ${b}”`, `“${a} — ${b}”`];
        return {
          q: T('想把這段引文縮短，哪一種寫法正確地標示了省略？', 'Which shortened version of this quotation correctly shows that words were left out?'),
          text: `Original: “${orig}”`,
          ans: ansChoice([right, ...r.sample(wrongs, 2)]),
          sol: [T('從引文中刪掉字時，要用刪節號（…）讓讀者知道，而且原意不能改變。', 'When you leave words out of a quotation, use an ellipsis (…) so readers know, and keep the original meaning.'), T(`正確：${right}`, `Correct: ${right}`)],
        };
      }
      if (t === 'dash') {
        const IT = [
          ['I opened the closet and—wait, was that a mouse?', 'I opened the closet and; wait, was that a mouse?', 'I opened the closet and: wait, was that a mouse?'],
          ['{A} finally reached the summit—and then realized {he} had left the camera at the bottom.', '{A} finally reached the summit; and then realized {he} had left the camera at the bottom.', '{A} finally reached the summit, and, then realized {he} had left the camera at the bottom.'],
          ['My cousin—the one who lives in Toronto—is visiting next week.', 'My cousin—the one who lives in Toronto, is visiting next week.', 'My cousin the one who lives in Toronto—is visiting next week.'],
          ['"I just need to find my—" {A} stopped when the lights went out.', '"I just need to find my;" {A} stopped when the lights went out.', '"I just need to find my:" {A} stopped when the lights went out.'],
          ['There was only one thing {A} wanted for {his} birthday—a telescope.', 'There was only one thing {A} wanted for {his} birthday; a telescope.', 'There was only one thing {A} wanted, for {his} birthday a telescope.'],
        ];
        const it = r.pick(IT).map((s) => fill(s, c));
        return {
          q: T('哪一句的破折號用得正確？', 'Which sentence uses a dash correctly?'),
          ans: ansChoice(it),
          sol: [T('破折號表示突然的中斷，或用來強調後面的內容；成對使用時，兩邊都要有破折號。', 'A dash shows a sudden break or adds emphasis; when dashes set off extra words, use one on each side.'), T(`正確：${it[0]}`, `Correct: ${it[0]}`)],
        };
      }
      const IT = [
        ['My grandmother', 'who grew up in Taipei', 'teaches me to cook every Sunday.'],
        ['Our principal', 'Ms. Alvarez', 'greets every student at the front door.'],
        ["{A}'s dog", 'a shy beagle named Pepper', 'hides under the bed during storms.'],
        ['The Pacific Ocean', 'which is the largest ocean on Earth', 'covers about a third of the planet.'],
        ['Mount Everest', 'the tallest mountain in the world', 'stands on the border of Nepal and China.'],
        ['The school play', 'which {A} helped write', 'opens on Friday night.'],
      ];
      const [a, m, b] = r.pick(IT).map((s) => fill(s, c));
      const right = `${a}, ${m}, ${b}`;
      return {
        q: T('哪一句正確地用一對逗號把補充資訊包起來？', 'Which sentence correctly uses a pair of commas to set off the extra information?'),
        ans: ansChoice([right, `${a} ${m}, ${b}`, `${a}, ${m} ${b}`]),
        sol: [T(`「${m}」是補充資訊，拿掉句子仍然完整，所以前後都要加逗號。`, `"${m}" is extra information—the sentence works without it—so it needs a comma on BOTH sides.`), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g8-spelling',
    grade: 8,
    unit: 'mechanics',
    name: T('常拼錯的字', 'Commonly misspelled words'),
    std: 'CCSS L.8.2c',
    lesson: {
      zh: '有些字連大人都常拼錯：necessary（一個 c、兩個 s）、separate（裡面有 a rat）、definitely（裡面有 finite）、receive（c 後面 e 在 i 前）、embarrass（兩個 r、兩個 s）……記住小口訣就不會錯。',
      en: 'Some words trip up even adults: necessary (one c, two s), separate (there is "a rat" in it), definitely (it contains "finite"), receive (e before i after c), embarrass (double r, double s)… Learn a memory trick for each one.',
      ex: ['nece<b>ss</b>ary', 'sep<b>a</b>rate', 'defin<b>ite</b>ly', 'rec<b>ei</b>ve'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['It is *neccessary* to bring a pencil to the exam.', 'necessary', '一個 c、兩個 s', 'one c, two s'],
        ['Please keep the glass and the plastic *seperate*.', 'separate', '裡面有 a rat：sep-a-rate', 'there is "a rat" in sep-a-rate'],
        ['{A} will *definately* finish the project by Friday.', 'definitely', '裡面藏著 finite', 'it has "finite" inside'],
        ['Did you *recieve* my email about the meeting?', 'receive', 'c 後面 e 在 i 前面', '"i before e, except after c"'],
        ['The accident *occured* just after midnight.', 'occurred', '兩個 c、兩個 r', 'double c, double r'],
        ['{A} did not want to *embarass* {his} little brother.', 'embarrass', '兩個 r、兩個 s', 'double r, double s'],
        ['We should protect the *enviroment* for future generations.', 'environment', '中間有 iron：envIRONment', 'there is "iron" in envIRONment'],
        ['The *goverment* announced a new national holiday.', 'government', 'govern＋ment', 'govern + ment'],
        ['The drummer kept a steady *rythm* all night.', 'rhythm', 'Rhythm Helps Your Two Hips Move', 'Rhythm Helps Your Two Hips Move'],
        ['I *beleive* that every student can learn to write well.', 'believe', 'Never be<b>lie</b>ve a lie', 'never believe a "lie"'],
        ['The hotel can *accomodate* two hundred guests.', 'accommodate', '兩個 c、兩個 m', 'double c, double m'],
        ['{A} marked the test date on {his} *calender*.', 'calendar', '結尾是 -ar', 'it ends in -ar'],
        ['The two friends had a loud *arguement* about the game.', 'argument', 'argue 去掉 e 再加 ment', 'argue drops its e: argument'],
        ['The *begining* of the book was slow, but the ending was exciting.', 'beginning', '兩個 n', 'double n'],
        ['It is a *priviledge* to represent our school.', 'privilege', '沒有 d', 'there is no d'],
        ['The science test is *tommorow* morning.', 'tomorrow', '一個 m、兩個 r', 'one m, two r'],
        ['{A} checked out three books from the *libary*.', 'library', '別忘了第一個 r', 'do not forget the first r'],
        ['Good *grammer* makes your writing easier to read.', 'grammar', '結尾是 -ar', 'it ends in -ar'],
        ["The change in {A}'s handwriting was *noticable*.", 'noticeable', 'notice 保留 e 再加 able', 'keep the e: notice + able'],
        ['I *reccomend* this book to anyone who loves mysteries.', 'recommend', '一個 c、兩個 m', 'one c, two m'],
        ['We ate at a new Thai *restaraunt* downtown.', 'restaurant', 'rest-au-rant', 'rest-au-rant'],
        ['Our team practices on a strict *schedual*.', 'schedule', '結尾是 -ule', 'it ends in -ule'],
        ['{A} was *concious* of everyone watching {him}.', 'conscious', 'con＋science 的 sc', 'it has the "sc" of science'],
        ['Regular bike *maintainance* keeps the chain from rusting.', 'maintenance', 'main-te-nance', 'main-te-nance'],
        ['{A} wants to be more *independant* this year.', 'independent', '結尾是 -ent', 'it ends in -ent'],
      ];
      const [s0, right, tz, te] = r.pick(IT), s = fill(s0, c);
      const { ws, k } = tapMarked(s), wrongWord = ws[k[0]].replace(/[.,!?]$/, '');
      const fixed = s.replace(/\*.*?\*/, right);
      if (r.chance(0.7)) {
        return {
          q: T('點出拼錯的字。', 'Tap the misspelled word.'),
          ans: ansTap(ws, k),
          sol: [T(`「${wrongWord}」拼錯了，正確是「${right}」（${tz}）。`, `"${wrongWord}" is misspelled; the correct spelling is "${right}" (${te}).`), T(`正確：${fixed}`, `Correct: ${fixed}`)],
        };
      }
      return {
        q: T(`畫底線的字拼錯了，請打出正確拼法：${s.replace(/\*(.*?)\*/, '<u>$1</u>')}`, `The underlined word is misspelled. Type it correctly: ${s.replace(/\*(.*?)\*/, '<u>$1</u>')}`),
        ans: ansText([right]),
        sol: [T(`正確拼法是「${right}」（${tz}）。`, `The correct spelling is "${right}" (${te}).`), T(`正確：${fixed}`, `Correct: ${fixed}`)],
      };
    },
  },
  {
    id: 'g8-connotation',
    grade: 8,
    unit: 'words',
    name: T('字詞的言外之意（正面／負面）', 'Connotation: positive and negative shades of meaning'),
    std: 'CCSS L.8.5c',
    lesson: {
      zh: '很多字的<b>字面意思</b>（denotation）差不多，但<b>言外之意</b>（connotation）不同：thrifty（節儉，正面）和 stingy（小氣，負面）都是「不愛花錢」。作者選字會影響讀者的感受。',
      en: 'Many words share a <b>denotation</b> (dictionary meaning) but have different <b>connotations</b> (feelings): <i>thrifty</i> (positive) and <i>stingy</i> (negative) both mean "careful with money". A writer\'s word choice shapes how readers feel.',
      ex: ['positive: Leo is <b>confident</b>.', 'negative: Leo is <b>arrogant</b>.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['thrifty', 'stingy', '{A}\'s uncle is ___ with his money.'],
        ['confident', 'arrogant', 'The new team captain seems ___.'],
        ['curious', 'nosy', 'Our neighbor is ___ about everyone on the street.'],
        ['determined', 'stubborn', '{A} is ___ about finishing the marathon.'],
        ['youthful', 'childish', '{A}\'s grandfather has a ___ sense of humor.'],
        ['aroma', 'stench', 'The ___ from the kitchen filled the hallway.'],
        ['chat', 'gossip', '{A} and {B} like to ___ during lunch.'],
        ['relaxed', 'lazy', 'On Sunday afternoons, {A} is ___.'],
        ['unique', 'weird', '{A}\'s fashion style is ___.'],
        ['inexpensive', 'cheap', 'The backpack {A} bought was ___.'],
        ['assertive', 'pushy', 'The salesperson at the bike shop was ___.'],
        ['cautious', 'cowardly', '{A} was ___ about crossing the frozen pond.'],
        ['bold', 'reckless', '{A} made a ___ decision to try out for the lead role.'],
        ['fragrance', 'odor', 'The ___ of the candle filled the room.'],
        ['slender', 'scrawny', 'A ___ young tree grew beside the fence.'],
      ];
      const [pos, neg, f] = r.pick(IT), s = fill(f, c);
      const wantPos = r.chance(0.5), right = wantPos ? pos : neg, wrong = wantPos ? neg : pos;
      return {
        q: wantPos ? T(`作者想讓讀者有「好感」。哪個字最適合？${s}`, `The writer wants readers to feel positive. Which word fits best? ${s}`)
                   : T(`作者想讓讀者有「負面」的感覺。哪個字最適合？${s}`, `The writer wants readers to feel negative. Which word fits best? ${s}`),
        ans: ansChoice([right, wrong]),
        sol: [T(`「${pos}」和「${neg}」意思相近，但「${pos}」是正面的，「${neg}」是負面的。`, `"${pos}" and "${neg}" mean almost the same thing, but "${pos}" sounds positive and "${neg}" sounds negative.`), T(`所以選「${right}」：${s.replace('___', right)}`, `So choose "${right}": ${s.replace('___', right)}`)],
      };
    },
  },
  {
    id: 'g8-argument-structure',
    grade: 8,
    unit: 'organization',
    name: T('議論段落的結構：主張、理由、證據、反方、反駁', 'Argument structure: claim, reason, evidence, counterclaim, rebuttal'),
    std: 'CCSS W.8.1a',
    lesson: {
      zh: '一段有說服力的議論通常依序是：① <b>主張</b>（claim）② <b>理由</b>（reason）③ <b>證據</b>（evidence：數據、例子）④ <b>反方論點</b>（counterclaim）⑤ <b>反駁</b>（rebuttal）⑥ <b>結論</b>（concluding statement）。',
      en: 'A convincing argument usually goes: ① <b>claim</b> ② <b>reason</b> ③ <b>evidence</b> (facts, examples) ④ <b>counterclaim</b> ⑤ <b>rebuttal</b> ⑥ <b>concluding statement</b>.',
      ex: ['Claim → "The main reason is…" → "For example, …" → "Some people argue…" → "However, …" → "For these reasons, …"'],
    },
    gen(r) {
      const IT = [
        ['Our school should replace plastic water bottles with refill stations.', 'The main reason is that refill stations would greatly reduce plastic waste.', 'For example, one school in Ohio cut its plastic trash by 40 percent in a single year after installing them.', 'Some people argue that refill stations are too expensive to install.', 'However, the money the school saves on bottled water would pay for the stations within two years.', 'For these reasons, refill stations are a smart choice for our school.'],
        ['Middle schools should start classes at 8:30 a.m. or later.', 'The most important reason is that teenagers need more sleep to learn well.', 'Doctors recommend eight to ten hours of sleep a night for teens, yet most get fewer than seven hours on school nights.', 'Critics argue that a later start would cause problems for after-school sports.', 'However, schools that changed their schedules found that most teams simply moved practice back by thirty minutes.', 'Clearly, a later start would help students without hurting their activities.'],
        ['Our town library should stay open on Sundays.', 'Many students need a quiet place to study on weekends.', 'In a survey of our class, 18 out of 25 students said their homes are too noisy for homework on Sundays.', 'Some people claim that opening on Sundays would cost the town too much.', 'Yet volunteers from the high school have already offered to help staff the front desk.', 'Therefore, Sunday hours would be a small cost for a big benefit.'],
        ['Every middle school should offer a coding class.', 'Coding teaches students to solve problems step by step.', 'For instance, students who build a simple game must break one large task into many small ones.', 'Some parents worry that coding is useful only for future programmers.', 'However, the same problem-solving skills help in math, science, and even writing.', 'In short, a coding class would prepare all students for success, not just future programmers.'],
        ['Families should adopt pets from shelters instead of buying them from stores.', 'Adopting saves the life of an animal that needs a home.', 'Each year, millions of animals enter shelters across the country.', 'Some people believe that shelter animals have behavior problems.', 'In reality, most animals end up in shelters because their owners moved or could not afford care, not because of their behavior.', 'For these reasons, adopting from a shelter is the kinder choice.'],
        ['Students should have physical education class every day.', 'Daily exercise helps students concentrate in their other classes.', 'One study found that students who exercised before a test scored higher than students who did not.', 'Opponents argue that daily PE would take time away from academic subjects.', 'However, even twenty minutes of activity can make the rest of the school day more productive.', 'Thus, daily PE is an investment in learning, not a distraction from it.'],
        ['Our city should ban single-use plastic bags.', 'Plastic bags harm the wildlife in our rivers and parks.', 'Last spring, volunteers pulled more than 2,000 bags out of the Green River in a single weekend.', 'Some shoppers say that reusable bags are inconvenient.', 'However, in many cities that banned plastic bags, shoppers quickly got used to bringing their own.', 'In conclusion, a bag ban would protect our environment at very little cost.'],
      ];
      const it = r.pick(IT), v = r.pick(['all', 'all', 'noCounter', 'noEvidence', 'noEnd']);
      const items = v === 'noCounter' ? [it[0], it[1], it[2], it[5]] : v === 'noEvidence' ? [it[0], it[1], it[3], it[4], it[5]] : v === 'noEnd' ? it.slice(0, 5) : it.slice();
      return {
        q: T('把這段議論文的句子排成合理的順序。', 'Put the sentences of this argument in a logical order.'),
        ans: ansOrder(items),
        sol: [
          T('順序：主張 → 理由 → 證據 → 反方論點 → 反駁 → 結論。', 'Order: claim → reason → evidence → counterclaim → rebuttal → conclusion.'),
          T('線索：For example 帶出證據；Some people argue／Critics 帶出反方；However／Yet 帶出反駁；For these reasons／Therefore 帶出結論。', 'Clues: "For example" brings evidence; "Some people argue" or "Critics" bring the counterclaim; "However" or "Yet" brings the rebuttal; "For these reasons" or "Therefore" ends it.'),
        ],
      };
    },
  },
  {
    id: 'g8-relevant-evidence',
    grade: 8,
    unit: 'research',
    name: T('相關與不相關的證據', 'Relevant vs. irrelevant evidence'),
    std: 'CCSS W.8.1b',
    lesson: {
      zh: '<b>相關的證據</b>直接證明你的主張（數據、研究結果、具體例子）。和主題有關、但沒有支持主張的資訊，就是<b>不相關的證據</b>，應該刪掉。',
      en: '<b>Relevant evidence</b> directly proves your claim (data, study results, specific examples). Information that is on the topic but does not support the claim is <b>irrelevant</b> and should be cut.',
      ex: ['Claim: Our town needs more bike lanes.', 'Relevant: Since lanes were added on Main Street, bike accidents there have dropped by half.', 'Irrelevant: The first bicycle was invented in the 1800s.'],
    },
    gen(r) {
      const IT = [
        ['Students should eat breakfast before school.', 'A study of 500 students found that those who ate breakfast scored 15 percent higher on morning quizzes.', ['Pancakes were first made thousands of years ago.', 'Many students prefer cereal to eggs.', 'The cafeteria opens at 7:30 a.m.']],
        ['Our town needs more bike lanes.', 'Since the town added bike lanes on Main Street, bike accidents there have dropped by half.', ['The first bicycle was invented in the 1800s.', 'Mountain bikes cost more than road bikes.', 'Many people enjoy riding bikes on weekends.']],
        ['Reading aloud to young children improves their vocabulary.', 'Researchers found that children who were read to every day knew far more words by kindergarten than children who were not.', ['Picture books often have bright colors.', 'Some children prefer stories about animals.', 'The library holds a story hour on Tuesdays.']],
        ['Schools should start later in the morning.', 'After one district moved its start time to 8:30 a.m., attendance rose and students reported feeling less tired.', ['Some schools have very long hallways.', 'Many students ride the bus to school.', 'Alarm clocks have been around for centuries.']],
        ['Puzzle video games can improve problem-solving skills.', 'In one study, students who played puzzle games for a month solved logic problems faster than students who did not.', ['Video game consoles can be expensive.', 'Many video games have colorful graphics.', 'Some players like to play online with friends.']],
        ['Planting trees can cool down city neighborhoods.', 'Researchers found that streets lined with trees were up to 5 degrees Celsius cooler on summer afternoons than streets without trees.', ['Oak trees can live for hundreds of years.', 'Many people like to picnic under trees.', 'Some trees lose their leaves in autumn.']],
        ['Learning a musical instrument can help students in math.', 'One study found that students who took music lessons for two years scored higher on math tests than classmates who did not.', ['The violin has four strings.', 'Many famous composers lived in Europe.', 'Concerts are often held on weekends.']],
        ['Recycling at school reduces waste.', 'After our school started recycling, the trash sent to the landfill each week fell from twelve bags to five.', ['Recycling bins are often blue.', 'Plastic was invented more than a century ago.', 'Some students forget to bring their lunch.']],
      ];
      const [claim, rel, irr] = r.pick(IT), wr = r.sample(irr, r.pick([2, 3]));
      return {
        q: T('哪一個證據最能支持這個主張？', 'Which piece of evidence best supports the claim?'),
        text: `Claim: ${claim}`,
        ans: ansChoice([rel, ...wr]),
        sol: [T('相關的證據要「直接證明」主張，例如研究結果或數據。', 'Relevant evidence directly proves the claim, such as a study result or data.'), T(`答案：${rel}`, `Answer: ${rel}`), T('其他句子雖然和主題有關，但沒有證明主張。', 'The other sentences are on the topic but do not prove the claim.')],
      };
    },
  },
  {
    id: 'g8-transitions',
    grade: 8,
    unit: 'organization',
    name: T('轉折語：釐清想法之間的關係', 'Transitions that clarify relationships among ideas'),
    std: 'CCSS W.8.2c',
    lesson: {
      zh: '八年級要能用轉折語說清楚想法之間的關係：對比（Nevertheless、On the other hand）、結果（Consequently、Therefore）、相似（Similarly、Likewise）、舉例（For instance）。',
      en: 'Use transitions to make the relationship between ideas clear: contrast (<i>Nevertheless, On the other hand</i>), result (<i>Consequently, Therefore</i>), similarity (<i>Similarly, Likewise</i>), example (<i>For instance</i>).',
      ex: ['Wolves hunt in packs. <b>Similarly,</b> African wild dogs depend on their group.', 'Heavy rain fell for days. <b>Consequently,</b> the tournament was postponed.'],
    },
    gen(r) {
      const IT = [
        { a: 'Solar panels are expensive to install.', b: 'they can lower electricity bills for decades.', rel: 'contrast' },
        { a: 'The first version of the robot failed every test.', b: 'the team refused to give up.', rel: 'contrast' },
        { a: 'Many people believe that goldfish have a three-second memory.', b: 'studies show that goldfish can remember things for months.', rel: 'contrast' },
        { a: '{A} had never performed in public before.', b: '{he} delivered {his} speech with confidence.', rel: 'contrast' },
        { a: 'The city planted hundreds of trees along Main Street.', b: 'the street is now noticeably cooler in summer.', rel: 'result' },
        { a: 'The factory stopped dumping waste into the river.', b: 'fish populations have started to recover.', rel: 'result' },
        { a: '{A} studied the trail map carefully before the hike.', b: '{he} never once took a wrong turn.', rel: 'result' },
        { a: 'Heavy rain fell for three days straight.', b: 'the soccer tournament was postponed.', rel: 'result' },
        { a: 'Wolves live and hunt in packs.', b: 'African wild dogs depend on their group to survive.', rel: 'similarity' },
        { a: 'Ancient Egyptians recorded their history with picture symbols called hieroglyphs.', b: 'the ancient Maya used picture symbols to record important events.', rel: 'similarity' },
        { a: 'A good coach gives clear and specific feedback.', b: 'a good teacher points out exactly what a student can improve.', rel: 'similarity' },
        { a: 'Bats use echoes to find their way in the dark.', b: 'dolphins use echoes to locate fish underwater.', rel: 'similarity' },
        { a: 'Some plants have clever ways to protect themselves.', b: 'the cactus uses sharp spines to keep animals away.', rel: 'example' },
        { a: 'Many everyday products began as space technology.', b: 'memory foam was first developed for NASA aircraft seats.', rel: 'example' },
        { a: 'Small changes at home can save a lot of energy.', b: 'LED bulbs use about 75 percent less electricity than old-fashioned bulbs.', rel: 'example' },
        { a: '{A} has many responsibilities at home.', b: '{he} walks the dog and makes breakfast for {his} little sister every morning.', rel: 'example' },
      ];
      return transitionDrill(r, IT, ['contrast', 'result', 'similarity', 'example']);
    },
  },
  {
    id: 'g8-formal-style',
    grade: 8,
    unit: 'style',
    name: T('維持正式的文體', 'Keeping a formal style'),
    std: 'CCSS W.8.1d',
    lesson: {
      zh: '議論文和說明文要用<b>正式</b>的文體：不用俚語（awesome、kinda、gross、freak out）、少用縮寫、不跟讀者聊天。把口語換成精確的正式用字。',
      en: 'Arguments and informative essays need a <b>formal style</b>: no slang (<i>awesome, kinda, gross, freak out</i>), few contractions, and no chatting with the reader. Replace casual words with precise, formal ones.',
      ex: ['Informal: The results were <u>awesome</u>.', 'Formal: The results were <b>impressive</b>.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['The results of the experiment were ', 'awesome', '.', 'impressive'],
        ['The author includes ', 'tons of', ' details about the setting.', 'many'],
        ['The main character is ', 'super', ' brave throughout the novel.', 'extremely'],
        ['Scientists are ', 'kinda', ' unsure why the bees disappeared.', 'somewhat'],
        ['The new policy could ', 'mess up', ' the bus schedule.', 'disrupt'],
        ['Many students think the cafeteria food is ', 'gross', '.', 'unappetizing'],
        ['The data shows a ', 'crazy', ' increase in recycling.', 'dramatic'],
        ['The narrator feels ', 'bummed', ' after losing the contest.', 'disappointed'],
        ["The poem's ending is ", 'cool', ' because it surprises the reader.', 'effective'],
        ['The team was ', 'totally', ' exhausted after the tournament.', 'completely'],
        ['Researchers ', 'figured out', ' how the disease spreads.', 'discovered'],
        ['The character ', 'freaks out', ' when she reads the letter.', 'panics'],
        ['Some critics say the movie is ', 'lame', '.', 'disappointing'],
        ['{A} argues that the city should ', 'fix up', ' the old library.', 'renovate'],
        ['The speaker ', 'kept on', ' repeating the same point.', 'continued'],
      ];
      const [pre0, inf, post, formal] = r.pick(IT), pre = fill(pre0, c);
      const marked = pre + inf.split(' ').map((w) => `*${w}*`).join(' ') + post;
      const { ws, k } = tapMarked(marked);
      const informal = pre + inf + post, good = pre + formal + post;
      if (r.chance(0.6)) {
        return {
          q: T(`點出不夠正式的字（${k.length > 1 ? '兩個字都要點' : '一個字'}）。`, `Tap the informal ${k.length > 1 ? 'words (both of them)' : 'word'}.`),
          ans: ansTap(ws, k),
          sol: [T(`「${inf}」是口語，正式文章裡改成「${formal}」。`, `"${inf}" is casual; in formal writing use "${formal}".`), T(`正式：${good}`, `Formal: ${good}`)],
        };
      }
      return {
        q: T('哪一句的文體比較正式？', 'Which sentence has a more formal style?'),
        ans: ansChoice([good, informal]),
        sol: [T(`「${inf}」是口語，「${formal}」比較正式、精確。`, `"${inf}" is casual; "${formal}" is formal and precise.`), T(`正式：${good}`, `Formal: ${good}`)],
      };
    },
  },
  {
    id: 'g8-objective-summary',
    grade: 8,
    unit: 'paragraphs',
    name: T('客觀的摘要', 'Writing an objective summary'),
    std: 'CCSS RI.8.2',
    lesson: {
      zh: '<b>客觀摘要</b>用自己的話說出文章的<b>主旨</b>和最重要的重點。它要短、要準確：<b>不加</b>個人意見、<b>不寫</b>小細節、<b>不加</b>原文沒有的資訊。',
      en: 'An <b>objective summary</b> states the <b>central idea</b> and key points in your own words. It is short and accurate: <b>no</b> personal opinions, <b>no</b> minor details, and <b>nothing</b> that is not in the original.',
      ex: ['Opinion (cut it): "Crows are creepy."', 'Minor detail (cut it): "The researchers wore a mask."', 'Central idea (keep it): "Crows can recognize human faces."'],
    },
    gen(r) {
      const IT = [
        ['Scientists at the University of Washington discovered that crows can recognize individual human faces. In one experiment, researchers wore a certain mask while they caught and banded a few crows. For years afterward, crows scolded and dive-bombed anyone wearing that mask, even people who had never touched a bird. Crows that had never been caught joined in, which suggests that the birds teach one another. The researchers say this shows how well crows have adapted to life alongside humans.',
          'Researchers found that crows can remember human faces and even teach other crows which people to avoid, showing how well the birds have adapted to living near humans.',
          'Crows are creepy birds, and the scientists who caught them were brave to risk being attacked.',
          'Researchers wore a mask when they caught a few crows and put bands on them.',
          'Crows can remember faces, and they are also able to count to one hundred.',
          ['Crows can recognize individual human faces.', 'Crows that were never caught also scolded the masked people, which suggests the birds learn from each other.']],
        ['When an empty lot on Pine Street filled up with trash, neighbors decided to turn it into a community garden. Volunteers cleared the lot over three weekends and built twelve raised beds. A local hardware store donated soil and tools. Today, families grow tomatoes, beans, and herbs there, and extra vegetables go to a nearby food pantry. Neighbors say the garden has also helped them get to know one another.',
          'Neighbors turned a trash-filled lot on Pine Street into a community garden that now grows food for local families and a food pantry and brings neighbors together.',
          'The Pine Street garden is the most beautiful place in the city, and every neighborhood should copy it.',
          'A hardware store donated soil and tools for the garden.',
          'Neighbors built a garden on Pine Street, and the city plans to build ten more next year.',
          ['Volunteers cleaned up an empty lot and built raised garden beds.', 'Extra vegetables from the garden go to a food pantry.']],
        ['During the teenage years, the body releases melatonin, the hormone that makes people sleepy, about two hours later at night than it does in childhood. As a result, many teenagers cannot fall asleep before 11 p.m. However, many high schools start before 8 a.m., so students often get only six or seven hours of sleep. Doctors warn that this lack of sleep can hurt memory, mood, and health. Some school districts have responded by moving their start times later.',
          'Because teenagers\' bodies release the sleep hormone melatonin later at night, early school start times leave many teens short on sleep, which can harm memory, mood, and health; some districts have started school later in response.',
          'It is ridiculous that schools still start so early, and anyone who disagrees has forgotten what it is like to be a teenager.',
          'Melatonin is a hormone.',
          'Teens lose sleep because of their body clocks, and phones are the main reason they stay up late.',
          ['Teenagers\' bodies release melatonin about two hours later than children\'s bodies do.', 'Doctors warn that too little sleep can hurt memory, mood, and health.']],
        ['Mangrove forests grow along tropical coastlines where the land meets the sea. Their tangled roots slow down waves, which protects coastal towns from storms and erosion. The roots also shelter young fish, crabs, and shrimp. However, many mangrove forests have been cleared to make room for shrimp farms and buildings. Several countries now run projects to replant mangroves along their coasts.',
          'Mangrove forests protect tropical coasts from storms and shelter young sea animals, but many have been cleared, so several countries are now working to replant them.',
          'Mangroves are amazing, and people who cut them down should be ashamed of themselves.',
          'Mangrove roots give shelter to crabs.',
          'Mangroves protect coasts, and they can grow taller than any other trees on Earth.',
          ['Mangrove roots slow down waves and protect coastal towns.', 'Many mangrove forests have been cleared for farms and buildings.']],
        ['Some public libraries now lend more than books. In these "libraries of things," members can borrow tools, sewing machines, telescopes, and even cake pans. Supporters say the programs save families money, since people can borrow an item they will use only once or twice. The programs also reduce waste because fewer items are bought and thrown away. Libraries with these collections report that power drills and camping gear are often the most popular items.',
          'Some libraries now lend everyday objects such as tools and telescopes, which saves families money and reduces waste.',
          'Libraries of things are a brilliant idea, and it is silly that some people still buy their own drills.',
          'Some libraries lend cake pans.',
          'Libraries now lend tools, and soon they will stop lending books altogether.',
          ['Some libraries let members borrow objects such as tools and telescopes.', 'Borrowing items instead of buying them saves money and reduces waste.']],
        ['Many buildings from ancient Rome, such as the Pantheon, are still standing after nearly two thousand years. Scientists have long wondered why Roman concrete lasts so long. Recent studies suggest that small lumps of lime in the concrete act like a repair kit: when cracks form and water seeps in, the lime reacts and fills the cracks. Engineers hope to use this idea to make modern concrete that lasts longer.',
          'Scientists believe Roman concrete has lasted for centuries because lumps of lime inside it seal cracks when water gets in, and engineers hope to use this idea in modern concrete.',
          'The Romans were the greatest builders in history, and modern engineers should be embarrassed.',
          'The Pantheon is a building from ancient Rome.',
          'Roman concrete can heal its own cracks, which is why every Roman building is still standing today.',
          ['Many Roman buildings have stood for nearly two thousand years.', 'Lumps of lime in Roman concrete react with water to fill cracks.']],
      ];
      const [text, best, opin, minor, added, keys] = r.pick(IT);
      if (r.chance(0.65)) {
        const W = [[opin, '加了個人意見', 'it adds a personal opinion'], [minor, '只講一個小細節，沒有主旨', 'it gives only a minor detail, not the central idea'], [added, '加了原文沒有的資訊', 'it adds information that is not in the passage']];
        const wr = r.sample(W, r.pick([2, 3]));
        return {
          q: T('哪一個是這篇短文最好的客觀摘要？', 'Which is the best objective summary of the passage?'),
          text,
          ans: ansChoice([best, ...wr.map((w) => w[0])]),
          sol: [T('好的摘要說出主旨和重點，不加意見、不寫小細節、不加新資訊。', 'A good summary gives the central idea and key points—no opinions, no minor details, nothing new.'), T(`答案：${best}`, `Answer: ${best}`), T(`「${wr[0][0]}」不好，因為${wr[0][1]}。`, `"${wr[0][0]}" is weak because ${wr[0][2]}.`)],
        };
      }
      return {
        q: T('哪一句「不應該」出現在這篇短文的客觀摘要裡？', 'Which sentence should NOT appear in an objective summary of the passage?'),
        text,
        ans: ansChoice([opin, ...keys]),
        sol: [T(`「${opin}」是作者自己的意見，客觀摘要不能有。`, `"${opin}" is a personal opinion, which does not belong in an objective summary.`), T('另外兩句是原文的重點，可以放進摘要。', 'The other two sentences are key points from the passage, so they belong.')],
      };
    },
  },
  {
    id: 'g8-analogies',
    grade: 8,
    unit: 'words',
    name: T('類比：字詞之間的關係', 'Analogies: word relationships'),
    std: 'CCSS L.8.5b',
    lesson: {
      zh: '類比題 A : B :: C : ? 的意思是「A 和 B 的關係，等於 C 和 ? 的關係」。先用一句話說出 A 和 B 的關係（例如「花瓣是花的一部分」），再套到 C 上。常見關係：部分／整體、工具／使用者、職業／地點、幼獸／成獸、反義、同義、程度。',
      en: 'An analogy A : B :: C : ? means "A is to B as C is to ?". Say the A–B relationship in a sentence ("A petal is part of a flower"), then apply it to C. Common relationships: part/whole, tool/user, worker/place, young/adult, antonyms, synonyms, degree.',
      ex: ['petal : flower :: page : <b>book</b> (part of)', 'warm : hot :: damp : <b>soaked</b> (degree)'],
    },
    gen(r) {
      const R = {
        part: ['是…的一部分', 'is part of a', [['petal', 'flower'], ['page', 'book'], ['key', 'keyboard'], ['branch', 'tree'], ['wheel', 'bicycle'], ['finger', 'hand']]],
        tool: ['是…使用的工具', 'is a tool used by a', [['brush', 'painter'], ['scalpel', 'surgeon'], ['hammer', 'carpenter'], ['baton', 'conductor'], ['microscope', 'scientist'], ['whistle', 'referee']]],
        place: ['在…工作', 'works in a', [['chef', 'kitchen'], ['pilot', 'cockpit'], ['teacher', 'classroom'], ['librarian', 'library'], ['judge', 'courtroom'], ['farmer', 'field']]],
        young: ['是…的幼獸', 'is a young', [['puppy', 'dog'], ['kitten', 'cat'], ['calf', 'cow'], ['foal', 'horse'], ['cub', 'bear'], ['tadpole', 'frog']]],
        anto: ['和…意思相反', 'is the opposite of', [['ancient', 'modern'], ['generous', 'selfish'], ['expand', 'shrink'], ['victory', 'defeat'], ['scarce', 'plentiful'], ['timid', 'bold']]],
        syno: ['和…意思相同', 'means the same as', [['enormous', 'huge'], ['rapid', 'quick'], ['brave', 'courageous'], ['begin', 'start'], ['silent', 'quiet'], ['error', 'mistake']]],
        degree: ['是程度較輕的…', 'is a milder degree of', [['warm', 'hot'], ['damp', 'soaked'], ['chilly', 'freezing'], ['tired', 'exhausted'], ['happy', 'ecstatic'], ['breeze', 'gale']]],
      };
      const NOUNS = ['part', 'tool', 'place', 'young'];
      const k = r.pick(Object.keys(R)), [zh, en, pairs] = R[k];
      const [p1, p2] = r.sample(pairs, 2);
      const trap = r.pick(pairs.filter((p) => p !== p1 && p !== p2))[1];
      const pool = NOUNS.filter((x) => x !== k).flatMap((x) => R[x][2].map((p) => p[1]));
      const wr = [trap, ...r.sample(pool, 2)];
      const rel = (a, b) => (k === 'anto' || k === 'syno' || k === 'degree' ? `"${a}" ${en} "${b}"` : `a ${a} ${en} ${b}`);
      return {
        q: T(`完成類比：${p1[0]} : ${p1[1]} :: ${p2[0]} : ___`, `Complete the analogy: ${p1[0]} : ${p1[1]} :: ${p2[0]} : ___`),
        ans: ansChoice([p2[1], ...wr]),
        sol: [T(`關係：${p1[0]} ${zh.replace('…', ' ' + p1[1] + ' ')}。`, `Relationship: ${rel(p1[0], p1[1])}.`), T(`同樣地：${p2[0]} ${zh.replace('…', ' ' + p2[1] + ' ')}。`, `In the same way, ${rel(p2[0], p2[1])}.`)],
      };
    },
  },
  {
    id: 'g8-concluding-statement',
    grade: 8,
    unit: 'paragraphs',
    name: T('寫出有力的結論', 'Writing a strong concluding statement'),
    std: 'CCSS W.8.1e',
    lesson: {
      zh: '好的結論<b>呼應主張</b>（換句話說，不是照抄），總結理由，並告訴讀者<b>為什麼重要</b>或<b>該做什麼</b>。不要加新話題、不要推翻自己，也不要寫「我的文章到此結束」。',
      en: 'A strong conclusion <b>echoes the claim</b> in fresh words (not copied), sums up the reasons, and tells readers <b>why it matters</b> or <b>what to do</b>. Do not start a new topic, contradict yourself, or write "That is the end of my essay."',
      ex: ['Weak: That is all I have to say about this topic.', 'Strong: A later start would give students the sleep they need, so our district should make the change next fall.'],
    },
    gen(r) {
      const IT = [
        ['Our school should install water refill stations.', 'They would cut plastic waste, and they would save the school money over time.', 'By installing refill stations, our school can protect both the environment and its budget, so the decision should be easy.', 'Also, the cafeteria should serve more fresh fruit.', 'Still, plastic bottles are probably fine, so the school does not need to change anything.'],
        ['Our district should start middle school at 8:30 a.m.', 'Teens need more sleep to learn, and a later start would improve attendance.', 'A later start would give students the sleep they need to learn, so our district should make the change next fall.', 'In addition, homework should be graded more quickly.', 'On the other hand, early start times are probably better for most students.'],
        ['Every middle school should offer a coding class.', 'Coding teaches step-by-step problem solving, and those skills help in every subject.', 'A coding class would teach every student to solve problems step by step, a skill they will use long after middle school.', 'Another important subject is music.', 'Then again, coding is probably useful only for future programmers.'],
        ['Families should adopt pets from shelters.', 'Adopting saves lives, and most shelter animals make loving pets.', 'Adopting gives an animal a second chance and gives a family a loyal friend, so the next time you want a pet, visit a shelter first.', 'Cats are also much easier to care for than fish.', 'Of course, buying a pet from a store is just as good.'],
        ['Students should have PE class every day.', 'Exercise improves focus, and it keeps students healthy.', 'Daily PE would help students stay healthy and focused, which makes it one of the best investments a school can make.', 'Schools should also have longer winter breaks.', 'But maybe students already get enough exercise at home.'],
        ['Our city should ban single-use plastic bags.', 'Bags harm wildlife, and shoppers adjust quickly to reusable bags.', 'A plastic bag ban would keep our rivers and parks clean with only a small change in shopping habits, so the city council should pass it this year.', 'The city should also repaint the old bridge.', 'However, plastic bags are not really a big problem.'],
      ];
      const [claim, reasons, best, newT, contra] = r.pick(IT);
      const W = [[newT, '加了新的話題', 'it starts a new topic'], [contra, '推翻了自己的主張', 'it contradicts the claim'], ['That is all I have to say about this topic.', '沒有總結也沒有說明重要性', 'it sums up nothing and says nothing about why the issue matters'], [claim, '只是把主張一字不改再抄一次', 'it just copies the claim word for word']];
      const wr = r.sample(W, 3);
      return {
        q: T('哪一句最適合當這篇議論文的結論？', 'Which sentence is the strongest conclusion for this argument?'),
        text: `Claim: ${claim}<br>Reasons: ${reasons}`,
        ans: ansChoice([best, ...wr.map((w) => w[0])]),
        sol: [T('好的結論用新的說法呼應主張，並說明為什麼重要或該怎麼做。', 'A strong conclusion restates the claim in fresh words and shows why it matters or what to do.'), T(`答案：${best}`, `Answer: ${best}`), T(`「${wr[0][0]}」不好，因為${wr[0][1]}。`, `"${wr[0][0]}" is weak because ${wr[0][2]}.`)],
      };
    },
  },
];

// ================= GRADE 9 =================
// pairs of independent clauses (second one starts lowercase) with the logical relationship between them
const IC_PAIRS = [
  ['The museum was crowded', 'we still managed to see every exhibit', 'contrast'],
  ['{A} trained every morning for a year', '{he} won the regional championship', 'result'],
  ['The storm knocked down several power lines', 'many homes were dark for two days', 'result'],
  ['The novel is over six hundred pages long', 'its short chapters make it easy to read', 'contrast'],
  ['Solar energy is renewable', 'it produces no air pollution', 'addition'],
  ['The trail was steep and muddy', 'the view from the top made the climb worthwhile', 'contrast'],
  ['{A} forgot {his} lines during the dress rehearsal', '{he} practiced them every night that week', 'result'],
  ['The bakery uses only local ingredients', 'it donates its leftover bread to a shelter', 'addition'],
  ['The exam covered six chapters', 'most students felt well prepared', 'contrast'],
  ['Our best player injured her ankle', 'the coach changed the lineup', 'result'],
  ['Volunteering builds practical skills', 'it connects students with their community', 'addition'],
  ['The experiment failed twice', 'the researchers refused to give up', 'contrast'],
];
const ADV = { contrast: ['however', 'nevertheless'], result: ['therefore', 'consequently', 'as a result'], addition: ['moreover', 'furthermore', 'in addition'] };
const CONJ = { contrast: 'but', result: 'so', addition: 'and' };
const RELZ = { contrast: '轉折', result: '結果', addition: '補充' };

const G9 = [
  {
    id: 'g9-parallel-structure',
    grade: 9,
    unit: 'sentences',
    name: T('平行結構', 'Parallel structure'),
    std: 'CCSS L.9-10.1a',
    lesson: {
      zh: '列舉或比較的項目要用<b>相同的文法形式</b>：都是 -ing、都是 to＋動詞、都是名詞或形容詞。not only…but also、either…or、both…and 後面的形式也要一致。',
      en: 'Items in a list or comparison must share the <b>same grammatical form</b>: all -ing words, all "to + verb", all nouns or all adjectives. The parts after <i>not only…but also, either…or, both…and</i> must match too.',
      ex: ['Not parallel: I like hiking, swimming, and <u>to ride</u> bikes.', 'Parallel: I like hiking, swimming, and <b>riding</b> bikes.', 'Parallel: She is not only <b>a talented singer</b> but also <b>a skilled dancer</b>.'],
    },
    gen(r) {
      const c = cast(r);
      if (r.chance(0.5)) {
        const A = [['hiking in the mountains', 'to hike in the mountains', 'hiked in the mountains'], ['reading mystery novels', 'to read mystery novels', 'read mystery novels'], ['volunteering at the animal shelter', 'to volunteer at the animal shelter', 'volunteered at the animal shelter'], ['building a treehouse', 'to build a treehouse', 'built a treehouse'], ['practicing the guitar', 'to practice the guitar', 'practiced the guitar'], ['learning to bake bread', 'to learn to bake bread', 'learned to bake bread']];
        const [x, y, z] = r.sample(A, 3);
        const right = `${c.A} spent the summer ${x[0]}, ${y[0]}, and ${z[0]}.`;
        return {
          q: T('哪一句有正確的平行結構？', 'Which sentence has correct parallel structure?'),
          ans: ansChoice([right, `${c.A} spent the summer ${x[0]}, ${y[0]}, and ${z[1]}.`, `${c.A} spent the summer ${x[0]}, ${y[0]}, and ${c.he} also ${z[2]}.`]),
          sol: [T('三個項目都要是同樣的形式（-ing）。', 'All three items must have the same form (-ing).'), T(`正確：${right}`, `Correct: ${right}`)],
        };
      }
      const IT = [
        ['{A} is not only a talented singer but also a skilled dancer.', '{A} is not only a talented singer but also dances well.', '{A} not only is a talented singer but also a skilled dancer.'],
        ['The coach told us to stretch, to hydrate, and to rest.', 'The coach told us to stretch, to hydrate, and that we should rest.', 'The coach told us stretching, to hydrate, and to rest.'],
        ['Writing an essay is harder than taking a test.', 'Writing an essay is harder than to take a test.', 'To write an essay is harder than taking a test.'],
        ['You can either take the bus or ride your bike.', 'You can either take the bus or you could ride your bike.', 'Either you can take the bus or ride your bike.'],
        ['The new library is bright, spacious, and quiet.', 'The new library is bright, spacious, and has a quiet atmosphere.', 'The new library is bright, has space, and quiet.'],
        ['Our goals are to raise money, to recruit volunteers, and to clean the park.', 'Our goals are to raise money, to recruit volunteers, and cleaning the park.', 'Our goals are raising money, to recruit volunteers, and to clean the park.'],
        ['{A} wants a job that is challenging, rewarding, and flexible.', '{A} wants a job that is challenging, rewarding, and lets {him} set {his} own hours.', '{A} wants a job that is challenging, with rewards, and flexible.'],
        ['The speech was both inspiring and practical.', 'The speech was both inspiring and gave practical advice.', 'The speech both was inspiring and practical.'],
        ['{A} would rather walk to school than ride the crowded bus.', '{A} would rather walk to school than riding the crowded bus.', '{A} would rather walk to school than to be riding the crowded bus.'],
      ];
      const it = r.pick(IT).map((s) => fill(s, c));
      return {
        q: T('哪一句有正確的平行結構？', 'Which sentence has correct parallel structure?'),
        ans: ansChoice(it),
        sol: [T('並列或比較的部分要用相同的文法形式；not only/but also、either/or、both/and 後面的形式也要一樣。', 'Paired or listed parts must share the same grammatical form, including the parts after not only/but also, either/or and both/and.'), T(`正確：${it[0]}`, `Correct: ${it[0]}`)],
      };
    },
  },
  {
    id: 'g9-clause-types',
    grade: 9,
    unit: 'grammar',
    name: T('名詞子句、關係（形容詞）子句、副詞子句', 'Noun, relative and adverbial clauses'),
    std: 'CCSS L.9-10.1b',
    lesson: {
      zh: '<b>名詞子句</b>當主詞或受詞（<i>What she said</i> surprised us.）。<b>關係子句</b>（形容詞子句）用 who、which、that、whose、where 修飾前面的名詞（the book <i>that I borrowed</i>）。<b>副詞子句</b>用 because、although、when、if、until 說明原因、時間、條件（<i>Because it rained</i>, we stayed in.）。',
      en: 'A <b>noun clause</b> works as a subject or object (<i>What she said</i> surprised us.). A <b>relative (adjective) clause</b> uses who, which, that, whose or where to describe a noun (the book <i>that I borrowed</i>). An <b>adverbial clause</b> uses because, although, when, if or until to tell why, when or under what condition (<i>Because it rained</i>, we stayed in.).',
      ex: ['Noun: Everyone knew <u>that the test would be hard</u>.', 'Relative: The test <u>that we took</u> was hard.', 'Adverbial: <u>Although the test was hard</u>, we passed.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = {
        noun: ['<u>What {A} said</u> surprised everyone.', 'Everyone knew <u>that the test would be difficult</u>.', '<u>Whoever finishes first</u> will win a prize.', 'The real question is <u>whether the bridge can be repaired</u>.', '{A} wondered <u>why the museum was closed</u>.', 'Nobody could explain <u>how the cat had escaped</u>.'],
        relative: ['The book <u>that {A} recommended</u> won an award.', 'Our neighbor, <u>who grew up in Kenya</u>, teaches Swahili.', 'The park <u>where we first met</u> has a new fountain.', 'The scientist <u>whose research changed the field</u> visited our school.', 'This is the trail <u>that leads to the waterfall</u>.', 'The song, <u>which {A} wrote in one night</u>, became a hit at school.'],
        adverbial: ['<u>Because the bus was late</u>, {A} missed the first bell.', '{A} kept running <u>until the race was over</u>.', '<u>Although the test was difficult</u>, {A} finished early.', 'We will start the game <u>when everyone arrives</u>.', '<u>If it rains tomorrow</u>, the picnic will move indoors.', '{A} studied in the library <u>while {his} brother was at practice</u>.'],
      };
      const L = { noun: T('名詞子句（noun clause）', 'noun clause'), relative: T('關係子句／形容詞子句（relative clause）', 'relative (adjective) clause'), adverbial: T('副詞子句（adverbial clause）', 'adverbial clause') };
      const WHY = {
        noun: ['這個子句在句子裡當「名詞」用（主詞、受詞或補語）。', 'The clause does the job of a noun (a subject, an object or a complement).'],
        relative: ['這個子句用 who／which／that／whose／where 修飾前面的名詞。', 'The clause uses who/which/that/whose/where to describe the noun right before it.'],
        adverbial: ['這個子句說明原因、時間或條件，修飾整個動作。', 'The clause tells why, when or under what condition the main action happens.'],
      };
      const k = r.pick(Object.keys(L)), s = fill(r.pick(IT[k]), c);
      return {
        q: T('畫底線的是哪一種子句？', 'What kind of clause is underlined?'),
        text: s,
        ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
        sol: [T(WHY[k][0], WHY[k][1]), T('小測試：能換成 "it" 或 "something" 的是名詞子句；緊跟在名詞後面描述它的是關係子句。', 'Quick test: if you can replace it with "it" or "something", it is a noun clause; if it follows a noun and describes it, it is a relative clause.')],
      };
    },
  },
  {
    id: 'g9-phrase-types',
    grade: 9,
    unit: 'grammar',
    name: T('片語：獨立分詞構句、同位語、介係詞片語、分詞片語', 'Phrases: absolute, appositive, prepositional, participial'),
    std: 'CCSS L.9-10.1b',
    lesson: {
      zh: '<b>獨立分詞構句</b>（absolute phrase）：名詞＋分詞，修飾整個句子（<i>Her hands trembling</i>, she stepped onto the stage.）。<b>同位語</b>（appositive）：重新說明前面的名詞（Ms. Lee, <i>our coach</i>, …）。<b>介係詞片語</b>：介係詞開頭（<i>under the bridge</i>）。<b>分詞片語</b>：分詞開頭，修飾一個名詞（<i>Clutching the trophy</i>, he smiled.）。',
      en: 'An <b>absolute phrase</b> is a noun + participle that modifies the whole sentence (<i>Her hands trembling</i>, she stepped onto the stage.). An <b>appositive</b> renames a noun (Ms. Lee, <i>our coach</i>, …). A <b>prepositional phrase</b> starts with a preposition (<i>under the bridge</i>). A <b>participial phrase</b> starts with a participle and describes a noun (<i>Clutching the trophy</i>, he smiled.).',
      ex: ['Absolute: <u>The game over</u>, the fans went home.', 'Appositive: Kyoto, <u>a city of temples</u>, …', 'Participial: <u>Hoping for a good grade</u>, Ava checked her work.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = {
        absolute: ['<u>{His} hands trembling</u>, {A} stepped onto the stage.', '<u>The game over</u>, the fans poured onto the field.', '{A} stared up at the night sky, <u>{his} heart racing</u>.', '<u>The rain having stopped</u>, we continued our hike.', '<u>{His} backpack bulging with books</u>, {A} hurried to the bus.'],
        appositive: ['{A}, <u>the captain of the debate team</u>, gave the opening speech.', 'Our science teacher, <u>a former park ranger</u>, knows every bird call.', 'We visited Kyoto, <u>a city full of ancient temples</u>.', '{A} adopted Biscuit, <u>a shy gray kitten</u>.', 'The Nile, <u>the longest river in Africa</u>, flows north.'],
        prepositional: ['<u>Across the crowded gym</u>, {A} spotted {his} friend.', 'The keys were hidden <u>under the old newspaper</u>.', '<u>During the long winter</u>, the bears hibernated.', '{A} left a note <u>on the kitchen table</u>.', '<u>After the final whistle</u>, the players shook hands.'],
        participial: ['<u>Clutching the trophy</u>, {A} posed for a photo.', '<u>Exhausted by the heat</u>, the hikers rested in the shade.', 'The boy <u>waving from the window</u> is my cousin.', '<u>Hoping for a good grade</u>, {A} checked every answer twice.', 'The letters, <u>written in faded ink</u>, were hard to read.'],
      };
      const L = { absolute: T('獨立分詞構句（absolute phrase）', 'absolute phrase'), appositive: T('同位語片語（appositive phrase）', 'appositive phrase'), prepositional: T('介係詞片語（prepositional phrase）', 'prepositional phrase'), participial: T('分詞片語（participial phrase）', 'participial phrase') };
      const WHY = {
        absolute: ['它有自己的名詞＋分詞（例如 hands trembling），修飾整個句子。', 'It has its own noun + participle (like "hands trembling") and modifies the whole sentence.'],
        appositive: ['它緊跟在名詞後面，換個說法重新介紹那個名詞。', 'It sits next to a noun and renames it.'],
        prepositional: ['它以介係詞（across、under、during、on、after）開頭。', 'It begins with a preposition (across, under, during, on, after).'],
        participial: ['它以分詞（-ing 或 -ed/-en）開頭，修飾一個名詞，前面沒有自己的名詞。', 'It begins with a participle (-ing or -ed/-en) and describes a noun; it has no noun of its own in front.'],
      };
      const k = r.pick(Object.keys(L)), s = fill(r.pick(IT[k]), c);
      return {
        q: T('畫底線的是哪一種片語？', 'What kind of phrase is underlined?'),
        text: s,
        ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
        sol: [T(WHY[k][0], WHY[k][1]), T('分辨 absolute 和 participial：absolute 前面有自己的名詞（hands trembling），participial 沒有（trembling with fear）。', 'Absolute vs. participial: an absolute has its own noun ("hands trembling"); a participial phrase does not ("trembling with fear").')],
      };
    },
  },
  {
    id: 'g9-semicolons',
    grade: 9,
    unit: 'mechanics',
    name: T('分號與連接副詞（however、therefore…）', 'Semicolons with conjunctive adverbs'),
    std: 'CCSS L.9-10.2a',
    lesson: {
      zh: '兩個獨立子句可以用<b>分號</b>連接。如果第二句用 however、therefore、moreover 等<b>連接副詞</b>開頭，格式是：<b>子句一; however, 子句二.</b> 只用逗號就是逗號拼接（comma splice）錯誤。連接副詞也要選對意思。',
      en: 'A <b>semicolon</b> can join two independent clauses. When the second clause begins with a <b>conjunctive adverb</b> (however, therefore, moreover…), the pattern is: <b>clause one; however, clause two.</b> Using only a comma creates a comma splice. Choose the adverb with the right meaning, too.',
      ex: ['The trail was steep<b>; however,</b> the view was worth it.', 'Wrong: The trail was steep, however the view was worth it.'],
    },
    gen(r) {
      const c = cast(r);
      const [a0, b0, rel] = r.pick(IC_PAIRS), a = fill(a0, c), b = fill(b0, c);
      const adv = r.pick(ADV[rel]), bad = r.pick(ADV[rel === 'contrast' ? 'result' : 'contrast']);
      const right = `${a}; ${adv}, ${b}.`;
      return {
        q: T('哪一句的標點和連接副詞都正確？', 'Which sentence is punctuated correctly and uses the right conjunctive adverb?'),
        ans: ansChoice([right, `${a}, ${adv} ${b}.`, `${a} ${adv}; ${b}.`, `${a}; ${bad}, ${b}.`]),
        sol: [
          T(`格式：子句一; ${adv}, 子句二。只用逗號會變成逗號拼接。`, `Pattern: clause; ${adv}, clause. A comma alone would create a comma splice.`),
          T(`兩句的關係是「${RELZ[rel]}」，所以用「${adv}」，不用「${bad}」。`, `The ideas show ${rel}, so "${adv}" fits and "${bad}" does not.`),
          T(`正確：${right}`, `Correct: ${right}`),
        ],
      };
    },
  },
  {
    id: 'g9-colons',
    grade: 9,
    unit: 'mechanics',
    name: T('冒號的用法', 'Using colons'),
    std: 'CCSS L.9-10.2b',
    lesson: {
      zh: '冒號用來引出<b>清單</b>、<b>說明</b>或<b>引文</b>，但冒號<b>前面必須是完整的句子</b>。不要把冒號放在動詞或介係詞後面（The kit includes: …✘）。',
      en: 'A colon introduces a <b>list</b>, an <b>explanation</b> or a <b>quotation</b>, but the words <b>before the colon must be a complete sentence</b>. Never put a colon right after a verb or preposition (The kit includes: … ✘).',
      ex: ['Right: Bring three things<b>:</b> a map, a flashlight, and water.', 'Wrong: Bring<b>:</b> a map, a flashlight, and water.', 'Right: The plan had one flaw<b>:</b> nobody had checked the weather.'],
    },
    gen(r) {
      const c = cast(r);
      if (r.chance(0.55)) {
        const L = [['{A} packed three essentials for the camping trip', '{A} packed', 'a flashlight, a map, and a water bottle'], ['The recipe calls for four ingredients', 'The recipe calls for', 'flour, sugar, eggs, and butter'], ['The museum has exhibits on three topics', 'The museum has exhibits on', 'dinosaurs, volcanoes, and outer space'], ['Bring the following supplies to class', 'Bring', 'a calculator, a ruler, and two pencils'], ['{A} has visited three national parks', '{A} has visited', 'Yosemite, Zion, and Acadia'], ['The team needs two things to win', 'The team needs', 'better defense and more patience']];
        const [ic0, vb0, list] = r.pick(L), ic = fill(ic0, c), vb = fill(vb0, c);
        const right = `${ic}: ${list}.`;
        return {
          q: T('哪一句的冒號用得正確？', 'Which sentence uses a colon correctly?'),
          ans: ansChoice([right, `${vb}: ${list}.`, `${ic}; ${list}.`]),
          sol: [T('冒號前面要是完整的句子；不能直接放在動詞或介係詞後面。分號不能用來引出清單。', 'The words before a colon must form a complete sentence; never put one right after a verb or preposition. A semicolon cannot introduce a list.'), T(`正確：${right}`, `Correct: ${right}`)],
        };
      }
      const E = [['The plan had one serious flaw', 'nobody had checked the weather forecast'], ['{A} finally understood the problem', 'the decimal point was in the wrong place'], ['There was only one explanation for the empty cookie jar', 'the dog had learned to open the pantry'], ['The reason for the delay was simple', 'the bus had a flat tire'], ['{A} learned an important lesson that day', 'practice matters more than talent']];
      const [a0, b0] = r.pick(E), a = fill(a0, c), b = fill(b0, c);
      const right = `${a}: ${b}.`;
      return {
        q: T('哪一句的標點最正確？', 'Which sentence is punctuated correctly?'),
        ans: ansChoice([right, `${a}, ${b}.`, `${a} ${b}.`]),
        sol: [T('前面是完整的句子，後面在「說明」它，所以用冒號。只用逗號或什麼都不加都不對。', 'A complete sentence is followed by an explanation of it, so a colon fits. A comma or no punctuation at all is wrong.'), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g9-comma-splices',
    grade: 9,
    unit: 'sentences',
    name: T('逗號拼接與連寫句', 'Comma splices and run-ons'),
    std: 'CCSS L.9-10.2',
    lesson: {
      zh: '<b>逗號拼接</b>（comma splice）：兩個獨立子句只用逗號連在一起。<b>連寫句</b>（fused sentence）：連逗號都沒有。修正方法：① 句號分成兩句 ② 分號 ③ 逗號＋and/but/so ④ 把其中一句改成從屬子句。',
      en: 'A <b>comma splice</b> joins two independent clauses with only a comma. A <b>fused sentence</b> has no punctuation at all. Fix them with ① a period, ② a semicolon, ③ a comma + and/but/so, or ④ by making one clause dependent.',
      ex: ['Splice: The trail was steep, we kept climbing.', 'Fixed: The trail was steep<b>, but</b> we kept climbing.', 'Fixed: The trail was steep<b>;</b> we kept climbing.'],
    },
    gen(r) {
      const c = cast(r);
      const [a0, b0, rel] = r.pick(IC_PAIRS), a = fill(a0, c), b = fill(b0, c);
      const splice = `${a}, ${b}.`, semi = `${a}; ${b}.`, conj = `${a}, ${CONJ[rel]} ${b}.`, period = `${a}. ${cap(b)}.`;
      if (r.chance(0.45)) {
        return {
          q: T('哪一句是逗號拼接（comma splice）？', 'Which sentence is a comma splice?'),
          ans: ansChoice([splice, r.chance(0.5) ? semi : period, conj]),
          sol: [T('兩個獨立子句之間只有逗號，就是逗號拼接。', 'Two independent clauses joined by only a comma make a comma splice.'), T(`錯誤：${splice}`, `Splice: ${splice}`), T(`正確寫法之一：${conj}`, `One fix: ${conj}`)],
        };
      }
      const right = r.pick([semi, conj, period]);
      return {
        q: T('下面是逗號拼接。哪一個修改是正確的？', 'This is a comma splice. Which revision is correct?'),
        text: splice,
        ans: ansChoice([right, `${a}, ${r.pick(ADV[rel])} ${b}.`, `${a} ${b}.`]),
        sol: [T('正確的修正：句號、分號，或逗號＋and/but/so。', 'Correct fixes: a period, a semicolon, or a comma + and/but/so.'), T('「逗號＋however」仍然是逗號拼接；什麼標點都不加是連寫句。', 'A comma + "however" is still a splice, and no punctuation at all makes a fused sentence.'), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g9-subject-verb-agreement',
    grade: 9,
    unit: 'grammar',
    name: T('主詞動詞一致：棘手的主詞', 'Subject–verb agreement with tricky subjects'),
    std: 'Grade 9 · Language (SAT)',
    lesson: {
      zh: '<b>each、everyone、neither of</b> 是單數。<b>neither…nor／either…or</b> 看<b>靠近動詞</b>的主詞。<b>集合名詞</b>（team、committee）在美式英文通常當單數。<b>倒裝句</b>（There are…、On the shelf sit…）要找出真正的主詞。中間的介係詞片語（of the letters）不影響動詞。',
      en: '<b>Each, everyone, neither of</b> are singular. With <b>neither…nor / either…or</b>, match the subject <b>closer to the verb</b>. <b>Collective nouns</b> (team, committee) are usually singular in American English. In <b>inverted</b> sentences (There are…, On the shelf sit…), find the real subject. A phrase in between (of the letters) does not change the verb.',
      ex: ['Each of the students <b>has</b> a locker.', 'Neither the coach nor the players <b>are</b> ready.', 'The box of old letters <b>is</b> in the attic.'],
    },
    gen(r) {
      const c = cast(r);
      const PL = r.pick(['students', 'players', 'campers', 'volunteers', 'musicians']);
      const IT = [
        [`Each of the ${PL}`, 'has', 'have', 'a locker near the gym.', '「each」是單數，of the … 不影響動詞', '"Each" is singular; "of the ' + PL + '" does not change that'],
        [`Neither of the ${PL}`, 'was', 'were', 'ready for the surprise quiz.', '「neither of」在正式寫作裡當單數', '"Neither of" is singular in formal writing'],
        ['Neither {A} nor {his} friends', 'are', 'is', 'coming to the game.', 'neither…nor 看靠近動詞的主詞 friends（複數）', 'with neither…nor, the verb matches the closer subject, "friends" (plural)'],
        ['Neither the players nor the coach', 'was', 'were', 'happy with the score.', 'neither…nor 看靠近動詞的主詞 coach（單數）', 'with neither…nor, the verb matches the closer subject, "coach" (singular)'],
        ['Either {A} or {B}', 'is', 'are', 'going to present first.', 'either…or 連接兩個單數主詞，用單數', 'either…or with two singular subjects takes a singular verb'],
        ['The team', 'is', 'are', 'practicing in the gym today.', '集合名詞 team 當一個整體，用單數', 'the collective noun "team" acts as one unit, so it is singular'],
        ['The committee', 'has', 'have', 'chosen a theme for the dance.', '集合名詞 committee 當一個整體，用單數', 'the collective noun "committee" acts as one unit, so it is singular'],
        ['There', 'are', 'is', 'three reasons to support the plan.', '倒裝句：真正的主詞是 three reasons（複數）', 'inverted sentence: the real subject is "three reasons" (plural)'],
        ['Here', 'are', 'is', "the notes from yesterday's class.", '倒裝句：真正的主詞是 the notes（複數）', 'inverted sentence: the real subject is "the notes" (plural)'],
        ['On the top shelf', 'sit', 'sits', 'two dusty trophies.', '倒裝句：真正的主詞是 two dusty trophies（複數）', 'inverted sentence: the real subject is "two dusty trophies" (plural)'],
        ['The box of old letters', 'is', 'are', 'in the attic.', '主詞是 box（單數），of old letters 不影響', 'the subject is "box" (singular); "of old letters" does not change it'],
        ['The list of supplies', 'was', 'were', 'posted on the classroom door.', '主詞是 list（單數）', 'the subject is "list" (singular)'],
        ['Everyone in the band', 'has', 'have', 'a solo in the final song.', '「everyone」是單數', '"Everyone" is singular'],
        ['The number of students in the club', 'has', 'have', 'doubled this year.', '「the number of」是單數（一個數字）', '"The number of" is singular (it is one number)'],
        ['A number of students', 'have', 'has', 'signed up for the trip.', '「a number of」＝many，用複數', '"A number of" means "many", so it is plural'],
        ['Mathematics', 'is', 'are', "{A}'s favorite subject.", 'mathematics 雖然有 -s，是單數學科名稱', '"Mathematics" ends in -s but names one subject, so it is singular'],
        ['{A}, along with {his} two cousins,', 'is', 'are', 'visiting the science museum.', 'along with… 不算主詞，主詞是單數的人名', 'phrases like "along with" do not add to the subject; the subject is one person'],
      ];
      const [s0, right, wrong, rest, wz, we] = r.pick(IT), s = fill(s0, c), rs = fill(rest, c);
      return {
        q: T(`選出正確的動詞：${s} ___ ${rs}`, `Choose the correct verb: ${s} ___ ${rs}`),
        ans: ansChoice([right, wrong]),
        sol: [T(`${wz}。`, `${cap(we)}.`), T(`正確：${s} ${right} ${rs}`, `Correct: ${s} ${right} ${rs}`)],
      };
    },
  },
  {
    id: 'g9-pronoun-agreement',
    grade: 9,
    unit: 'grammar',
    name: T('代名詞與先行詞一致', 'Pronoun–antecedent agreement'),
    std: 'Grade 9 · Language (SAT)',
    lesson: {
      zh: '代名詞要和它指的名詞（先行詞）<b>單複數一致</b>。集合名詞或機構（the committee、the company、the team）用 <b>its</b>。each of the girls 用 her。everyone、somebody 等今天常用 <b>their</b>（單數 they），正式寫作也可以用 his or her，但絕不能用 its 或 our。',
      en: 'A pronoun must <b>agree in number</b> with the noun it replaces (its antecedent). A group or organization (the committee, the company, the team) takes <b>its</b>. "Each of the girls" takes her. With everyone or somebody, today\'s standard is <b>their</b> (singular they), or "his or her" in very formal writing—never "its" or "our".',
      ex: ['The committee announced <b>its</b> decision.', 'Each of the girls brought <b>her</b> lunch.', 'Everyone should bring <b>their</b> own water bottle.'],
    },
    gen(r) {
      const c = cast(r);
      const IT = [
        ['The committee announced ___ decision on Friday.', 'its', ['their', "it's"], '委員會是一個整體（單數）', 'the committee acts as one group (singular)'],
        ['Each of the girls brought ___ own lunch.', 'her', ['their', 'its'], 'each 是單數，而且都是女生', '"each" is singular, and the group is all girls'],
        ['Each of the boys forgot ___ jacket at the park.', 'his', ['their', 'its'], 'each 是單數，而且都是男生', '"each" is singular, and the group is all boys'],
        ['The company changed ___ logo last year.', 'its', ['their', "it's"], '公司是一個機構（單數）', 'a company is one organization (singular)'],
        ['Everyone should bring ___ own water bottle.', 'their', ['its', 'our'], 'everyone 指人，用 their（單數 they）', '"everyone" refers to people, so use "their" (singular they)'],
        ['The team celebrated ___ first victory of the season.', 'its', ['their', "it's"], '美式英文 team 當一個整體（單數）', 'in American English, "team" acts as one unit (singular)'],
        ['{A} and {B} presented ___ project together.', 'their', ['its', 'his or her'], '兩個人（A and B）是複數', 'two people joined by "and" are plural'],
        ['The jury reached ___ verdict after two days.', 'its', ['their', "it's"], 'jury 是一個整體（單數）', 'the jury acts as one body (singular)'],
        ['Somebody left ___ backpack in the gym.', 'their', ['its', 'our'], '不知道是誰時，用 their（單數 they）', 'when the person is unknown, use "their" (singular they)'],
        ['The geese flew south for ___ winter migration.', 'their', ['its', "it's"], 'geese 是複數', '"geese" is plural'],
        ['The museum opened ___ new dinosaur wing in May.', 'its', ['their', "it's"], '博物館是一個機構（單數）；it\'s 是 it is', 'the museum is one institution (singular); "it\'s" means "it is"'],
        ['The students in Room 12 finished ___ science projects early.', 'their', ['its', 'his'], 'students 是複數', '"students" is plural'],
      ];
      const [s0, right, wr, wz, we] = r.pick(IT), s = fill(s0, c);
      return {
        q: T(`選出正確的代名詞：${s}`, `Choose the correct pronoun: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [T(`${wz}，所以用「${right}」。`, `${cap(we)} → "${right}".`), T(`正確：${s.replace('___', right)}`, `Correct: ${s.replace('___', right)}`)],
      };
    },
  },
  {
    id: 'g9-concision',
    grade: 9,
    unit: 'style',
    name: T('精簡用字（SAT 題型）', 'Concision (SAT style)'),
    std: 'CCSS L.9-10.3 · SAT',
    lesson: {
      zh: 'SAT 常考：在不改變意思的前提下，選<b>最精簡</b>的寫法。刪掉重複的字（new innovation、annually every year）、用一個動詞代替名詞片語（made the decision to → decided to）、用 because／although 代替長長的連接片語。',
      en: 'A common SAT question: choose the <b>most concise</b> option that keeps the meaning. Cut repeated ideas (<i>new innovation, annually every year</i>), use a verb instead of a noun phrase (<i>made the decision to → decided to</i>), and use <i>because/although</i> instead of long connecting phrases.',
      ex: ['Wordy: The team <u>made the decision to</u> postpone the trip.', 'Concise: The team <b>decided to</b> postpone the trip.'],
    },
    gen(r) {
      const IT = [
        ['The scientists ', ' to confirm the results.', 'repeated the experiment', ['repeated the experiment again a second time', 'repeated the experiment once more again', 'did the experiment over, repeating it again']],
        ['The ', ' made the app much faster.', 'innovation', ['new innovation', 'new and novel innovation', 'innovation, which was new,']],
        ['The festival takes place ', ' in June.', 'every year', ['annually every year', 'each and every year annually', 'yearly, every year,']],
        ['Volunteers ', ' to clean the beach.', 'worked together', ['worked together collaboratively', 'collaborated together jointly', 'jointly worked together as a team']],
        ["The author's ", ' became a bestseller.', 'memoir', ['personal memoir about her own life', 'memoir about her own personal life', 'own personal memoir']],
        ['The two sides finally reached ', '.', 'an agreement', ['a mutual agreement that both sides accepted', 'a mutual agreement shared by both', 'an agreement that was mutual between both sides']],
        ['', ' the road was icy, the bus arrived on time.', 'Although', ['In spite of the fact that', 'Despite the fact that it was true that', 'Even though it was the case that']],
        ['The team ', ' postpone the trip.', 'decided to', ['made the decision to', 'came to the decision to', 'made a decision and decided to']],
        ['The bridge was closed ', '.', 'for repairs', ['for the purpose of making repairs', 'so that repairs could be made for repairing it', 'in order to carry out the process of repairs']],
        ['Astronomers ', ' that the comet will return in 2061.', 'now believe', ['currently now believe', 'at the present time currently believe', 'presently believe at this time']],
        ['The speaker ', ' at the end of her talk.', 'summarized her main points', ['briefly summarized her main points in a short summary', 'summarized and summed up her main points', 'gave a summary that summarized her main points']],
        ['The library will ', ' on Saturdays.', 'close at noon', ['close at 12 noon in the middle of the day', 'close its doors and shut down at noon', 'be closing at the time of noon']],
      ];
      const [pre, post, right, wrongs] = r.pick(IT), orig = r.pick(wrongs);
      return {
        q: T('哪一個選項最精簡，而且意思清楚、文法正確？', 'Which choice is the most concise while keeping the meaning clear and correct?'),
        text: `${pre}<u>${orig}</u>${post}`,
        ans: ansChoice([right, ...wrongs]),
        sol: [T('其他選項都重複了相同的意思（冗詞）。', 'The other choices repeat the same idea (redundancy).'), T(`最精簡：${pre}${right}${post}`, `Most concise: ${pre}${right}${post}`)],
      };
    },
  },
  {
    id: 'g9-integrating-quotations',
    grade: 9,
    unit: 'research',
    name: T('把引文自然地融入句子', 'Integrating quotations smoothly'),
    std: 'CCSS W.9-10.8',
    lesson: {
      zh: '好的引用把引文<b>織進自己的句子</b>，整句讀起來文法要通順。只引用需要的部分；如果要改代名詞或時態，把改動的字放在<b>方括號 [ ]</b> 裡；省略的字用<b>刪節號 …</b>。不要讓引文孤零零地單獨成句。',
      en: 'Weave a quotation <b>into your own sentence</b> so the whole sentence reads grammatically. Quote only the words you need; if you must change a pronoun or tense, put the change in <b>[brackets]</b>; show left-out words with an <b>ellipsis …</b>. Never leave a quotation standing alone.',
      ex: ['Original: "I decided that fear would not make my choices for me."', 'Integrated: Mara decides that fear "would not make [her] choices for [her]."'],
    },
    gen(r) {
      const IT = [
        ['The lighthouse stood like a tired giant guarding the bay.', 'Delgado compares the lighthouse to “a tired giant guarding the bay.”', ['Delgado compares the lighthouse to, “A tired giant guarding the bay.”', 'Delgado compares the lighthouse. “Like a tired giant guarding the bay.”', 'Delgado compares the lighthouse to “the lighthouse stood like a tired giant guarding the bay.”']],
        ['I had been waiting for permission that would never come.', 'Mara realizes that she “had been waiting for permission that would never come.”', ['Mara realizes that she “I had been waiting for permission that would never come.”', 'Mara realizes. “I had been waiting for permission that would never come.”', 'Mara realizes that she, “Had been waiting for permission that would never come.”']],
        ['Every morning the town smelled of salt and diesel.', 'In the narrator’s memory, the town “smelled of salt and diesel” every morning.', ['In the narrator’s memory, the town “smelling of salt and diesel” every morning.', 'In the narrator’s memory, the town, “Every morning the town smelled of salt and diesel.”', 'In the narrator’s memory. “Every morning the town smelled of salt and diesel.”']],
        ['We were never rich, but we were never alone.', 'The narrator insists that her family was “never rich, but … never alone.”', ['The narrator insists that her family “we were never rich, but we were never alone.”', 'The narrator insists that her family was, “We were never rich, but we were never alone.”', 'The narrator insists. “We were never rich, but we were never alone.”']],
        ['He spoke softly, as if the sea might overhear him.', 'The old keeper speaks “softly, as if the sea might overhear him.”', ['The old keeper speaks, “He spoke softly, as if the sea might overhear him.”', 'The old keeper “speaking softly, as if the sea might overhear him.”', 'The old keeper speaks. “Softly, as if the sea might overhear him.”']],
        ['I decided that fear would not make my choices for me.', 'By the last chapter, Mara has decided that fear “would not make [her] choices for [her].”', ['By the last chapter, Mara has decided that fear “would not make my choices for me.”', 'By the last chapter, Mara has decided, that fear “Would not make her choices for her.”', 'By the last chapter, Mara has decided. “I decided that fear would not make my choices for me.”']],
        ['The storm took our boat, but it could not take our nerve.', 'Even after the disaster, the family’s courage survives: the storm “could not take [their] nerve.”', ['Even after the disaster, the family’s courage survives: the storm “could not take our nerve.”', 'Even after the disaster, the family’s courage survives, “The storm took our boat, but it could not take our nerve”.', 'Even after the disaster. “The storm took our boat, but it could not take our nerve.”']],
      ];
      const [orig, right, wrongs] = r.pick(IT);
      return {
        q: T('這是小說中的一句原文。哪一句把它最正確、最自然地融入分析句子？', 'Here is a line from a novel. Which sentence integrates it correctly and smoothly?'),
        text: `Original line: “${orig}”`,
        ans: ansChoice([right, ...r.sample(wrongs, 2)]),
        sol: [T('整句（包括引文）讀起來要文法通順；人稱改變放在 [ ] 裡；不要讓引文孤立成句，也不要在 that 後面加逗號。', 'The whole sentence, quotation included, must be grammatical; put changed pronouns in [brackets]; do not leave the quotation standing alone or put a comma after "that".'), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g9-mla-citations',
    grade: 9,
    unit: 'research',
    name: T('MLA 文內引用格式', 'MLA in-text citations'),
    std: 'CCSS W.9-10.8',
    lesson: {
      zh: 'MLA 文內引用：<b>(作者姓 頁碼)</b>，中間<b>不加逗號、不寫 p.</b>，句號放在括號<b>後面</b>：…stress (Lopez 42). 兩位作者：(Lopez and Chen 42)。三位以上：(Lopez et al. 42)。句子裡已經提到作者，括號只寫頁碼：Lopez argues that … (42).',
      en: 'MLA in-text citation: <b>(Author\'s last name + page)</b> with <b>no comma and no "p."</b>, and the period goes <b>after</b> the parentheses: …stress (Lopez 42). Two authors: (Lopez and Chen 42). Three or more: (Lopez et al. 42). If you name the author in the sentence, give only the page: Lopez argues that … (42).',
      ex: ['…more likely to feel stressed (Lopez 42).', '…(Lopez and Chen 42).', 'Lopez argues that … (42).'],
    },
    gen(r) {
      const AU = ['Lopez', 'Chen', 'Okafor', 'Patel', 'Novak', 'Haddad', 'Rivera', 'Kim', 'Johansson', 'Mensah'];
      const CL = ['teenagers who sleep fewer than seven hours are more likely to feel stressed', 'urban trees can lower summer temperatures by several degrees', 'reading fiction may strengthen empathy', 'most plastic in the ocean comes from sources on land', 'bees can learn to recognize simple patterns', 'students remember more when they quiz themselves'];
      const [a, b, d] = r.sample(AU, 3), p = r.int(12, 240), cl = r.pick(CL), C = cap(cl);
      const t = r.pick(['one', 'one', 'two', 'many', 'signal']);
      let right, wr, why;
      if (t === 'one') {
        right = `${C} (${a} ${p}).`; wr = [`${C} (${a}, ${p}).`, `${C} (${a}, p. ${p}).`, `${C}. (${a} ${p})`, `${C} (${p} ${a}).`];
        why = T('一位作者：(姓 頁碼)，不加逗號和 p.，句號在括號後。', 'One author: (Last name page) — no comma, no "p.", period after the parentheses.');
      } else if (t === 'two') {
        right = `${C} (${a} and ${b} ${p}).`; wr = [`${C} (${a} & ${b} ${p}).`, `${C} (${a}, ${b}, ${p}).`, `${C} (${a} and ${b}, page ${p}).`];
        why = T('兩位作者：用 and 連接（不用 &），後面直接寫頁碼。', 'Two authors: join the names with "and" (not &), then the page number.');
      } else if (t === 'many') {
        right = `${C} (${a} et al. ${p}).`; wr = [`${C} (${a}, ${b}, and ${d} ${p}).`, `${C} (${a} et al, ${p}).`, `${C} (${a} and others, p. ${p}).`];
        why = T('三位以上作者：第一位作者的姓＋et al.（et al 後面有句點）＋頁碼。', 'Three or more authors: first author + "et al." (with a period) + page.');
      } else {
        right = `${a} argues that ${cl} (${p}).`; wr = [`${a} argues that ${cl} (p. ${p}).`, `${a} argues that ${cl}. (${p})`, `${a} argues that ${cl} (page ${p}).`];
        why = T('句子裡已經提到作者，括號裡只寫頁碼，句號在括號後。', 'The author is already named in the sentence, so give only the page number; the period goes after the parentheses.');
      }
      return {
        q: T('哪一個 MLA 文內引用格式正確？', 'Which sentence uses a correct MLA in-text citation?'),
        ans: ansChoice([right, ...r.sample(wr, 3)]),
        sol: [why, T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g9-sentence-order',
    grade: 9,
    unit: 'organization',
    name: T('句子的邏輯順序', 'Logical order of sentences'),
    std: 'CCSS W.9-10.2a · SAT',
    lesson: {
      zh: '排列句子時找<b>線索</b>：主題句通常最先；First／Then／Finally、年代（1817 → 1880s）表示順序；this、these、those、the second 等字會指回前面提過的東西；in contrast、also 表示前面已經說過另一件事。',
      en: 'Look for <b>clues</b> when ordering sentences: the topic sentence usually comes first; First/Then/Finally and dates (1817 → 1880s) show sequence; words like <i>this, these, those, the second</i> point back to something already mentioned; <i>in contrast</i> and <i>also</i> mean another idea came before.',
      ex: ['"This pull creates a bulge…" must come after the sentence that mentions the pull.'],
    },
    gen(r) {
      const c = cast(r);
      const P = [
        ['Making paper by hand is easier than most people think.', 'First, tear scrap paper into small pieces and soak them in warm water overnight.', 'The next day, blend the wet scraps into a thick pulp.', 'Then spread the pulp evenly across a screen and press out the extra water.', 'Finally, let the sheet dry for a day, and you will have a piece of recycled paper.'],
        ['{A} had been dreading the piano recital for weeks.', 'On the morning of the performance, {his} hands were shaking so badly that {he} could barely button {his} shirt.', 'When {his} name was called, {he} walked to the piano and took a deep breath.', 'To {his} surprise, the first notes came out clear and steady.', 'By the time {he} played the final chord, {his} fear had turned into pride.'],
        ['The history of the bicycle stretches back more than two hundred years.', 'In 1817, a German inventor built a wooden "running machine" that riders pushed along with their feet.', 'Decades later, pedals were attached to the front wheel, but these early bikes were heavy and hard to steer.', 'In the 1880s, the "safety bicycle," with two wheels of equal size and a chain drive, finally made cycling practical.', 'That basic design is still used in most bicycles today.'],
        ['Our school should start a composting program.', 'Each day, the cafeteria throws away about thirty kilograms of food scraps.', 'If those scraps were composted, they could become rich soil for the school garden.', 'Composting would also save money, since the garden would no longer need to buy fertilizer.', 'For these reasons, the student council should approve the program this month.'],
        ['Ocean tides are caused mainly by the moon.', 'As the moon orbits Earth, its gravity pulls on the oceans.', 'This pull creates a bulge of water on the side of Earth facing the moon.', 'A second bulge forms on the opposite side of the planet.', 'As Earth rotates through these two bulges, most coastlines experience two high tides each day.'],
        ['{A} found the old map tucked inside a library book.', "At first, {he} assumed it was a child's drawing.", 'Then {he} noticed that the streets matched {his} own neighborhood.', 'Following the map, {he} walked to the corner of Elm and Fifth, where an X was marked.', 'There, under a loose brick, {he} found a tin box full of letters from 1952.'],
        ['Frogs and toads look alike, but there are clear differences between them.', 'Frogs usually have smooth, moist skin.', 'Toads, in contrast, have dry, bumpy skin.', 'The two animals also differ in where they live.', 'Most frogs stay near water, while toads can live in drier places such as gardens.'],
        ['{A} wanted to raise money for the local animal shelter.', 'First, {he} asked the principal for permission to hold a bake sale.', 'After the principal agreed, {he} recruited six friends to bake cookies and muffins.', 'On the day of the sale, they sold everything in less than an hour.', 'Thanks to their effort, the shelter received a check for $350.'],
      ];
      const ss = r.pick(P).map((s) => fill(s, c));
      if (r.chance(0.55)) {
        return {
          q: T('把句子排成合乎邏輯的段落。', 'Put the sentences in a logical order to make a paragraph.'),
          ans: ansOrder(ss),
          sol: [T('先找主題句（最概括的一句），再找表示時間或指回前文的線索字（First、Then、this、also、in contrast、年代）。', 'Find the topic sentence (the most general one) first, then follow clue words that show time or point back (First, Then, this, also, in contrast, dates).'), T(`第一句：${ss[0]}`, `First sentence: ${ss[0]}`)],
        };
      }
      const i = r.int(0, 3), others = r.sample(ss.filter((_, j) => j !== i && j !== i + 1), r.pick([2, 3]));
      return {
        q: T('在這個段落中，哪一句應該緊接在下面這句之後？', 'In this paragraph, which sentence should come right after the sentence below?'),
        text: ss[i],
        ans: ansChoice([ss[i + 1], ...others]),
        sol: [T('看線索字：時間順序、this／these 指回前面提到的內容、also／in contrast 表示前面已有另一點。', 'Use the clues: time order, "this/these" pointing back, and "also/in contrast" showing an earlier point.'), T(`下一句：${ss[i + 1]}`, `Next: ${ss[i + 1]}`)],
      };
    },
  },
  {
    id: 'g9-best-transition',
    grade: 9,
    unit: 'organization',
    name: T('選出最合適的轉折語（SAT 題型）', 'Choosing the best transition (SAT style)'),
    std: 'CCSS W.9-10.2c · SAT',
    lesson: {
      zh: 'SAT 轉折題：先讀空格<b>前後兩句</b>，判斷關係（對比、結果、舉例、相似、補充），再選轉折語。不要只看單句。',
      en: 'SAT transition questions: read the sentences <b>before and after</b> the blank, decide the relationship (contrast, result, example, similarity, addition), and only then choose. Never judge from one sentence alone.',
      ex: ['…Planners predicted sales would double. <b>However,</b> many drivers used the highway to skip downtown.'],
    },
    gen(r) {
      const IT = [
        { pre: 'Octopuses are known for their intelligence.', a: 'In laboratories, they have learned to open jars and escape from tanks.', b: 'some aquariums now give them puzzles to keep them busy.', rel: 'result' },
        { pre: 'The Great Wall of China is often described as a single wall.', a: 'Many people imagine one continuous line of stone stretching across the country.', b: 'the Great Wall is actually a network of many walls built over centuries.', rel: 'contrast' },
        { pre: 'Some animals survive harsh winters by slowing their bodies down.', a: 'Bears enter a deep sleep and live off stored fat for months.', b: 'some frogs freeze almost solid and thaw out in the spring.', rel: 'similarity', no: ['addition'] },
        { pre: 'Electric cars produce no exhaust while driving.', a: 'This helps keep city air cleaner.', b: 'electric cars are much quieter than gas-powered cars, which reduces street noise.', rel: 'addition', no: ['similarity'] },
        { pre: 'Early cameras required people to sit still for several minutes.', a: 'Any movement would leave a blur in the picture.', b: 'people in very old photographs rarely smile, since holding a smile that long was difficult.', rel: 'result' },
        { pre: 'Some foods last a surprisingly long time.', a: 'Honey, if sealed properly, can stay edible for many years.', b: 'archaeologists have found pots of honey in ancient Egyptian tombs that were still safe to eat.', rel: 'example', no: ['addition'] },
        { pre: 'The town expected the new highway to bring more shoppers downtown.', a: 'Planners predicted that sales would double within a year.', b: 'many drivers used the highway to skip downtown entirely, and sales fell.', rel: 'contrast' },
        { pre: 'Sleep plays an important role in learning.', a: 'During sleep, the brain sorts and stores the information gathered during the day.', b: 'students who sleep well after studying often remember more on test day.', rel: 'result' },
        { pre: 'Many inventions have come from studying nature.', a: 'Engineers often look to animals and plants for ideas.', b: "Velcro was inspired by the burrs that stuck to an inventor's dog during a walk.", rel: 'example' },
        { pre: 'Musicians must practice for years to master their instruments.', a: 'They repeat difficult passages until the movements become automatic.', b: 'athletes drill the same skills again and again until they can perform them without thinking.', rel: 'similarity', no: ['addition'] },
        { pre: 'Recycling aluminum saves a great deal of energy.', a: 'Making a can from recycled aluminum uses about 95 percent less energy than making one from raw ore.', b: 'aluminum can be recycled again and again without losing quality.', rel: 'addition', no: ['similarity'] },
        { pre: 'Volcanic eruptions can be destructive.', a: 'Lava and ash can bury entire towns.', b: 'over time, volcanic ash breaks down into some of the most fertile soil on Earth.', rel: 'contrast' },
        { pre: 'The new bus route was designed to save commuters time.', a: 'It cut the trip from downtown to the college from forty minutes to twenty-five.', b: 'the number of riders on the route doubled in its first month.', rel: 'result' },
        { pre: 'Some languages have words for ideas that English lacks.', a: 'Translators sometimes need a whole sentence to explain a single word.', b: 'the Japanese word "tsundoku" means buying books and letting them pile up unread.', rel: 'example' },
      ];
      return transitionDrill(r, IT, ['contrast', 'result', 'example', 'similarity', 'addition'], T('選出最適合放在空格裡的轉折語。', 'Which choice completes the text with the most logical transition?'));
    },
  },
  {
    id: 'g9-introductions-hooks',
    grade: 9,
    unit: 'paragraphs',
    name: T('引言與開頭的吸引句（hook）', 'Introductions and hooks'),
    std: 'CCSS W.9-10.2a',
    lesson: {
      zh: '好的引言用<b>吸引句</b>（hook）抓住讀者：小故事（anecdote）、問題、驚人的數據、名言或大膽的主張；接著提供背景，最後是論點句。避免「字典上說…」、「自古以來…」或「這篇文章我要寫…」。',
      en: 'A strong introduction grabs readers with a <b>hook</b>—an anecdote, a question, a striking statistic, a quotation or a bold claim—then gives background and ends with the thesis. Avoid "The dictionary defines…", "Since the beginning of time…" and "In this essay I will…".',
      ex: ['Statistic: Nearly three out of four high school students do not get enough sleep on school nights.', 'Weak: Webster\'s dictionary defines sleep as…'],
    },
    gen(r) {
      const c = cast(r);
      const H = {
        anecdote: ['Last winter, my grandfather pulled a dusty violin from his closet and placed it in my hands.', 'When {A} was eight, {he} got lost in a crowded train station for twenty terrifying minutes.', 'On the first day of high school, I walked into the wrong classroom and sat through half a lesson before I noticed.'],
        question: ['What would you do if your phone disappeared for a week?', 'Have you ever wondered why some songs get stuck in your head for days?', 'Why do we still begin school before the sun has fully risen?'],
        statistic: ['Nearly three out of four high school students do not get enough sleep on school nights.', 'Every year, millions of tons of plastic end up in the ocean.', 'The average teenager spends more than seven hours a day looking at screens for entertainment.'],
        quotation: ['"Not all those who wander are lost," wrote J. R. R. Tolkien.', '"The only way to do great work is to love what you do," Steve Jobs once said.', '"Be the change that you wish to see in the world" is a line often credited to Gandhi.'],
        bold: ['Homework, as we know it, should be abolished.', 'The most important lesson I learned in middle school was taught by a broken bicycle.', 'Cursive handwriting is not dead; it is simply waiting for us to notice it again.'],
      };
      const ZH = { anecdote: '小故事', question: '問題', statistic: '數據', quotation: '名言', bold: '大膽的主張' };
      if (r.chance(0.5)) {
        const k = r.pick(Object.keys(H)), s = fill(r.pick(H[k]), c);
        const others = r.sample(Object.keys(H).filter((x) => x !== k), 3);
        const lab = (x) => T(`${ZH[x]}（${x === 'bold' ? 'bold claim' : x}）`, x === 'bold' ? 'bold claim' : x);
        return {
          q: T('這個開頭用了哪一種吸引句（hook）？', 'What kind of hook does this opening use?'),
          text: s,
          ans: ansChoice([lab(k), ...others.map(lab)]),
          sol: [T(`這是「${ZH[k]}」型的吸引句。`, `It is a ${k === 'bold' ? 'bold claim' : k} hook.`), T('五種常見的 hook：小故事、問題、數據、名言、大膽的主張。', 'Five common hooks: anecdote, question, statistic, quotation, bold claim.')],
        };
      }
      const TOP = [['sleep', 'teenagers and sleep', 'Nearly three out of four high school students do not get enough sleep on school nights.', '青少年與睡眠'], ['screens', 'screen time', 'The average teenager spends more than seven hours a day looking at screens for entertainment.', '螢幕使用時間'], ['plastic', 'ocean plastic', 'Every year, millions of tons of plastic end up in the ocean.', '海洋塑膠'], ['music', 'music and memory', 'Have you ever wondered why some songs get stuck in your head for days?', '音樂與記憶'], ['homework', 'homework', 'Homework, as we know it, should be abolished.', '回家作業']];
      const [w, topic, hook, ztopic] = r.pick(TOP);
      const W = [`In this essay, I am going to write about ${topic}.`, `Webster's dictionary defines "${w}" in several ways.`, `Since the beginning of time, people have thought about ${topic}.`, `Many people have different opinions about ${topic}.`];
      return {
        q: T(`哪一句最適合當「${ztopic}」文章的開頭？`, `Which sentence is the most effective opening for an essay about ${topic}?`),
        ans: ansChoice([hook, ...r.sample(W, 3)]),
        sol: [T('好的開頭立刻抓住讀者（數據、問題、大膽主張……）。', 'An effective opening grabs the reader right away (a statistic, a question, a bold claim…).'), T('「我要寫…」、字典定義、「自古以來…」都是老套又空泛的開頭。', '"In this essay I will…", dictionary definitions and "Since the beginning of time…" are vague, overused openings.'), T(`答案：${hook}`, `Answer: ${hook}`)],
      };
    },
  },
  {
    id: 'g9-conclusions',
    grade: 9,
    unit: 'paragraphs',
    name: T('寫出有份量的結論', 'Writing effective conclusions'),
    std: 'CCSS W.9-10.1e',
    lesson: {
      zh: '好的結論<b>不只重複論點</b>，還要說明<b>意義</b>：所以呢？為什麼重要？對讀者或社會有什麼影響？避免「總之我講了三點」、「希望你喜歡我的文章」、把論點一字不改再抄一遍，或「自古以來…」這種空泛句子。',
      en: 'A strong conclusion does <b>more than repeat the thesis</b>: it shows the <b>significance</b>—so what? Why does it matter, and to whom? Avoid "In conclusion, I told you three reasons", "I hope you enjoyed my essay", copying the thesis word for word, or empty lines like "Since the beginning of time…".',
      ex: ['Weak: In conclusion, I have told you my three reasons.', 'Strong: …libraries will be more than buildings full of books; they will be bridges to opportunity.'],
    },
    gen(r) {
      const IT = [
        ['Schools should teach financial literacy because it prepares students for real decisions, protects them from debt, and builds confidence.', 'When students learn to budget, save, and avoid debt before they graduate, they leave school ready not only for tests but for life, and that is the kind of readiness every school should promise.'],
        ['Public libraries remain essential because they provide free internet, safe spaces, and lifelong learning.', 'As long as some people cannot afford a computer or a quiet place to study, libraries will be more than buildings full of books; they will be bridges to opportunity that no community can afford to lose.'],
        ['Social media platforms should require users to be at least sixteen years old.', 'Raising the minimum age would not end every online danger, but it would give young people a few more years to grow before facing them, which is a small price for a large protection.'],
        ['In "The Gift of the Magi," O. Henry shows that love is measured by sacrifice rather than by money.', 'By ending with two "useless" gifts, O. Henry leaves readers with a lasting lesson: what makes a gift valuable is not its price but what the giver was willing to give up.'],
        ['Cities should invest in public transportation to reduce traffic, pollution, and costs for families.', 'Every bus or train that replaces dozens of cars means cleaner air, shorter commutes, and more money in family budgets, so investing in transit today builds the city we want to live in tomorrow.'],
        ['Learning a second language changes the way people think, not just the way they speak.', 'A second language, then, is more than a skill for travel or work; it is a new lens for seeing the world, and every student deserves the chance to look through it.'],
      ];
      const [thesis, best] = r.pick(IT);
      const W = [['In conclusion, I have told you about my three reasons.', '只是宣告「我說完了」，沒有說明意義', 'it only announces that the essay is over and shows no significance'], ['I hope you enjoyed reading my essay.', '跟讀者道別，不是結論', 'it says goodbye instead of concluding'], ['Since the beginning of time, people have disagreed about many things.', '太空泛，和論點無關', 'it is vague and unrelated to the thesis'], [`In conclusion, ${low(thesis)}`, '把論點一字不改抄一遍', 'it copies the thesis word for word']];
      const wr = r.sample(W, 3);
      return {
        q: T('哪一句最適合當這篇文章的結尾？', 'Which sentence is the most effective conclusion for this essay?'),
        text: `Thesis: ${thesis}`,
        ans: ansChoice([best, ...wr.map((w) => w[0])]),
        sol: [T('好的結論用新的說法回應論點，並說明它為什麼重要。', 'An effective conclusion echoes the thesis in fresh words and shows why it matters.'), T(`答案：${best}`, `Answer: ${best}`), T(`「${wr[0][0]}」不好，因為${wr[0][1]}。`, `"${wr[0][0]}" is weak because ${wr[0][2]}.`)],
      };
    },
  },
];

// ================= PROMPTS: GRADE 7 =================
const P7 = [
  {
    id: 'w7-argument-school-policy',
    grade: 7,
    genre: 'argument',
    std: 'CCSS W.7.1',
    title: T('議論文：學校該不該這樣做？', 'Argument essay: Should our school do it?'),
    topics: [T('較晚的上學時間', 'a later school start time'), T('上課時禁止使用手機', 'a ban on phones during class'), T('每晚作業量的上限', 'a limit on nightly homework'), T('學校菜園', 'a school garden'), T('必修的社區服務時數', 'required community service hours'), T('一週上課四天', 'a four-day school week')],
    prompt: T('你的學校應該採用「{t}」嗎？寫一篇議論文：提出明確的主張，用理由和相關證據支持，並回應反方論點。', 'Should your school adopt {t}? Write an argument essay that states a clear claim, supports it with reasons and relevant evidence, and responds to a counterclaim.'),
    plan: [
      { label: T('吸引句＋論點句', 'Hook + thesis'), hint: T('用一個畫面或問題開頭，最後一句寫出你的主張和理由。', 'Open with a scene or question; end with your claim and reasons.') },
      { label: T('理由一＋證據', 'Reason 1 + evidence'), hint: T('事實、數據、專家說法或例子。', 'A fact, statistic, expert quote or example.') },
      { label: T('理由二＋證據', 'Reason 2 + evidence'), hint: T('解釋證據怎麼支持你的主張。', 'Explain how the evidence supports your claim.') },
      { label: T('理由三＋證據', 'Reason 3 + evidence'), hint: T('最有力的理由可以放最後。', 'Save your strongest reason for last.') },
      { label: T('反方論點＋反駁', 'Counterclaim + rebuttal'), hint: T('Some people argue… However, …', 'Some people argue… However, …') },
      { label: T('結論', 'Conclusion'), hint: T('重述主張，並呼籲讀者行動。', 'Restate the claim and call readers to act.') },
    ],
    starters: ['Every day at our school, …', 'Our school should … because …', 'First, …', 'According to …', 'Some people argue that …', 'However, …', 'For these reasons, …'],
    words: [300, 500],
    checklist: [
      T('引言最後有清楚的論點句（主張＋理由）。', 'My introduction ends with a clear thesis (claim + reasons).'),
      T('每個理由都有相關的證據，並解釋證據的意義。', 'Each reason has relevant evidence, and I explain what it shows.'),
      T('我承認反方論點，並用證據反駁。', 'I acknowledge a counterclaim and rebut it with evidence.'),
      T('我用轉折語（First、In addition、However、As a result）連接想法。', 'I use transitions (First, In addition, However, As a result) to connect ideas.'),
      T('語氣正式、客觀，沒有俚語。', 'My tone is formal and objective, with no slang.'),
      T('結論重述主張並提出行動呼籲。', 'My conclusion restates the claim and includes a call to action.'),
      T('我檢查過拼字、標點和完整句子。', 'I checked spelling, punctuation and complete sentences.'),
    ],
    mentor: {
      title: 'Dig In: Why Our School Needs a Garden',
      text: `Every day at lunch, I watch trays of uneaten carrots and apples slide into the trash. Many students say they do not like vegetables, but most of them have never seen one grow. Our school should build a garden behind the gym because it would teach science in a hands-on way, encourage healthier eating, and bring students together.\n\nFirst, a garden is an outdoor science lab. In class, we read about photosynthesis, soil, and life cycles, but a garden lets us see those ideas in action. Students could measure plant growth, test different kinds of soil, and record the results. According to our science teacher, Ms. Rivera, students remember a concept much longer when they can touch and observe it.\n\nSecond, students who grow food are more likely to eat it. When another school in our district started a garden two years ago, its cafeteria reported that salad bar use nearly doubled. Picking a tomato you planted yourself makes it feel like a reward instead of a chore.\n\nFinally, a garden builds community. Gardening requires teamwork: someone has to water on weekends, someone has to pull weeds, and someone has to plan what to plant next. Students from different grades and friend groups would work side by side toward a shared goal.\n\nSome people argue that a garden would cost too much and that no one would take care of it during the summer. These are fair concerns. However, local hardware stores often donate supplies to schools, and a garden club could organize a summer watering schedule for families who live nearby. Other schools have solved these problems, and so can we.\n\nA garden is more than a few rows of vegetables. It is a classroom, a cafeteria helper, and a meeting place all at once. Our principal and parent association should approve the garden this spring so that next fall, those carrots end up in students' stomachs instead of the trash.`,
      note: T('開頭用一個畫面吸引讀者，論點句預告三個理由；每段一個理由加證據；承認反方的擔心再用具體辦法反駁；結尾呼應開頭的紅蘿蔔畫面並呼籲行動。', 'The hook is a vivid scene, and the thesis previews three reasons. Each body paragraph gives one reason with evidence. The writer admits the counterclaim is fair, then answers it with specific solutions, and the ending circles back to the opening image with a call to action.'),
    },
    vocab: ['first', 'in addition', 'furthermore', 'according to', 'some people argue', 'however', 'as a result', 'for these reasons'],
  },
  {
    id: 'w7-informative-explain',
    grade: 7,
    genre: 'informative',
    std: 'CCSS W.7.2',
    title: T('說明文：解釋它是怎麼回事', 'Informative essay: Explain how or why'),
    topics: [T('為什麼海水是鹹的', 'why the ocean is salty'), T('火山是怎麼形成的', 'how volcanoes form'), T('為什麼蜜蜂很重要', 'why bees matter'), T('回收的東西後來去了哪裡', 'what happens to the things we recycle'), T('睡眠如何影響大腦', 'how sleep affects the brain'), T('颱風是怎麼形成的', 'how typhoons form')],
    prompt: T('寫一篇說明文，解釋「{t}」。介紹主題，用清楚的段落組織內容，並使用事實、定義和例子。', 'Write an informative essay that explains {t}. Introduce the topic, organize your ideas in clear paragraphs, and use facts, definitions and examples.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('用有趣的事實或問題開頭，說出這篇要解釋什麼。', 'Open with a surprising fact or question and tell what you will explain.') },
      { label: T('重點一', 'Main idea 1'), hint: T('第一個步驟或原因；解釋專有名詞。', 'The first step or cause; define key terms.') },
      { label: T('重點二', 'Main idea 2'), hint: T('下一個步驟或原因，加例子。', 'The next step or cause, with an example.') },
      { label: T('重點三', 'Main idea 3'), hint: T('再補充一個原因或有趣的事實。', 'Another cause or an interesting fact.') },
      { label: T('結論', 'Conclusion'), hint: T('總結，並說明為什麼值得知道。', 'Sum up and explain why it matters.') },
    ],
    starters: ['Have you ever wondered why …?', 'The process begins when …', 'This is called …, which means …', 'As a result, …', 'In other words, …', 'The next time you …, remember that …'],
    words: [300, 500],
    checklist: [
      T('引言清楚說出主題，並吸引讀者。', 'My introduction names the topic and hooks the reader.'),
      T('每段有一個重點，依照合理的順序排列。', 'Each paragraph has one main idea, in a logical order.'),
      T('我用了事實、定義和例子，並解釋專有名詞。', 'I used facts, definitions and examples, and explained key terms.'),
      T('我用了表示順序或因果的轉折語。', 'I used transitions that show sequence or cause and effect.'),
      T('語氣客觀、正式，沒有個人意見。', 'My tone is objective and formal, without personal opinions.'),
      T('結論總結重點並說明它的重要性。', 'My conclusion sums up and shows why the topic matters.'),
    ],
    mentor: {
      title: 'Why Is the Ocean Salty?',
      text: `If you have ever swallowed a mouthful of seawater, you know that the ocean is salty. About 3.5 percent of seawater's weight is salt. Yet the rivers that flow into the ocean taste fresh. So where does all that salt come from? The answer involves rocks, rain, and millions of years of patience.\n\nThe story begins on land. Rainwater is slightly acidic because it absorbs a small amount of carbon dioxide from the air. As rain falls on rocks and soil, it slowly breaks them down, a process called weathering. Weathering releases tiny charged particles called ions, including sodium and chloride, the two ingredients of table salt.\n\nRivers carry these dissolved minerals downstream and eventually into the ocean. The amount of salt in a single river is so small that we cannot taste it. Over millions of years, however, rivers have delivered enormous amounts of minerals to the sea.\n\nOnce the salt reaches the ocean, it has nowhere else to go. The sun heats the ocean's surface, and water evaporates into the air, but the salt stays behind. The evaporated water later falls as rain, starts the cycle again, and carries even more minerals to the sea. In this way, the ocean works like a pot of soup simmering on a stove: the water comes and goes, but the seasoning remains.\n\nRivers are not the only source of salt. Hydrothermal vents, which are cracks in the ocean floor where heated water rises from deep inside Earth, also add minerals to seawater. Underwater volcanoes contribute as well.\n\nInterestingly, the ocean is not getting much saltier today. Some minerals settle to the sea floor and become part of new rock, which removes them from the water. These processes balance each other, keeping the ocean's saltiness fairly steady.\n\nThe next time you taste salt on your lips at the beach, remember that you are tasting the work of countless raindrops, rivers, and rocks.`,
      note: T('用讀者的經驗和一個問題開頭；依照「雨→河→海→蒸發」的順序說明；每個專有名詞（weathering、ions、hydrothermal vents）都有解釋；用「一鍋湯」的比喻讓抽象概念變具體。', 'It opens with the reader\'s own experience and a question, explains the process in order (rain → rivers → ocean → evaporation), defines every key term (weathering, ions, hydrothermal vents), and uses a soup analogy to make an abstract idea concrete.'),
    },
    vocab: ['the process begins', 'this is called', 'as a result', 'over time', 'in addition', 'in other words', 'for example'],
  },
  {
    id: 'w7-personal-narrative',
    grade: 7,
    genre: 'personal',
    std: 'CCSS W.7.3',
    title: T('個人記敘文：改變我的那一刻', 'Personal narrative: A moment that mattered'),
    topics: [T('面對恐懼的一次經驗', 'a time you faced a fear'), T('你對某個人改觀的一次經驗', 'a time you changed your mind about someone'), T('失敗後再試一次', 'a time you failed and tried again'), T('你永遠忘不了的一天', 'a day you will never forget'), T('你幫助別人的一次經驗', 'a time you helped someone'), T('學會一項新技能', 'learning a difficult new skill')],
    prompt: T('寫一篇個人記敘文，主題是「{t}」。使用對話、節奏變化和生動的感官細節，最後反思這次經驗教會你什麼。', 'Write a personal narrative about {t}. Use dialogue, pacing and vivid sensory details, and reflect on what the experience taught you.'),
    plan: [
      { label: T('開頭', 'Opening'), hint: T('從動作、對話或一個特別的細節開始。', 'Start with action, dialogue or a striking detail.') },
      { label: T('背景與問題', 'Background + problem'), hint: T('交代時間、地點和你遇到的困難。', 'Where, when, and what challenge you faced.') },
      { label: T('高潮', 'Turning point'), hint: T('放慢節奏，寫出感官細節和內心想法。', 'Slow down: sensory details and your thoughts.') },
      { label: T('結果', 'Resolution'), hint: T('事情怎麼結束？', 'How did it turn out?') },
      { label: T('反思', 'Reflection'), hint: T('你學到什麼？你有什麼改變？', 'What did you learn, and how did you change?') },
    ],
    starters: ['The … had … — I know because …', '"…," my … called.', 'My heart pounded as …', 'At that moment, …', 'Looking back, I realize that …', 'Now, whenever …, I remember …'],
    words: [300, 500],
    checklist: [
      T('開頭就吸引讀者（動作、對話或特別的細節）。', 'My opening grabs the reader with action, dialogue or a striking detail.'),
      T('事件依照清楚的順序發展，並用時間轉折語。', 'Events unfold in a clear order with time transitions.'),
      T('我用了對話，而且標點正確。', 'I used dialogue with correct punctuation.'),
      T('最重要的時刻我放慢節奏，加入感官細節。', 'I slowed down at the most important moment with sensory details.'),
      T('我用精確的動詞和形容詞。', 'I chose precise verbs and adjectives.'),
      T('結尾反思這次經驗的意義。', 'My ending reflects on what the experience meant.'),
    ],
    mentor: {
      title: 'Seventeen Rungs',
      text: `The ladder to the high dive had seventeen rungs. I know because I counted them every Saturday for two summers, always from the bottom, never from the top.\n\n"You coming up, Jun?" my cousin Daniel called from the platform. His voice echoed off the water.\n\n"Next week," I said, which is what I always said.\n\nThat July, the pool posted a sign announcing that the high dive would close for repairs at the end of the month. Suddenly, "next week" had an expiration date. On the last Saturday, I stood at the bottom of the ladder with my toes curled around the cold metal of the first rung. The air smelled of chlorine and sunscreen. Somewhere behind me, a lifeguard's whistle shrieked.\n\nI climbed. Five rungs. Ten. My hands were slippery, and my heart pounded so hard that I could feel it in my ears. At the top, the platform felt like the edge of the world. The pool looked the size of a postage stamp, and the swimmers looked like floating confetti.\n\n"Don't look down," Daniel said from the water. "Just look at the clouds and step."\n\nI looked at the clouds. I took one breath, then another. Then I stepped forward into nothing.\n\nThe fall lasted about one second, but it felt like ten. Then the water swallowed me with a roar, and I shot back up, gasping and laughing at the same time. Daniel was cheering. A little girl in goggles clapped.\n\nI climbed the ladder four more times that afternoon. Each climb was easier than the one before.\n\nLooking back, I realize that the high dive was never really seventeen rungs tall. My fear had been built from all the Saturdays I spent saying "next week." Now, when something scares me, I remind myself that the hardest step is usually the first one off the ground.`,
      note: T('開頭用一個具體的數字（十七階）抓住讀者；對話很短但有力；爬梯子的段落用短句放慢節奏、加入氣味和聲音；結尾回到「十七階」並反思恐懼的意義。', 'A precise detail (seventeen rungs) hooks the reader. The dialogue is short but meaningful. Short sentences slow the pace during the climb, with smells and sounds. The ending returns to the seventeen rungs and reflects on what fear really is.'),
    },
    vocab: ['at that moment', 'suddenly', 'meanwhile', 'by the time', 'looking back', 'I realized', 'from then on'],
  },
  {
    id: 'w7-fiction-short-story',
    grade: 7,
    genre: 'narrative',
    std: 'CCSS W.7.3',
    title: T('短篇故事：從一個神祕的開頭寫起', 'Short story: Begin with a mystery'),
    topics: [T('海灘上的瓶中信', 'a message in a bottle on the beach'), T('一張夾在舊書裡的地圖', 'a map hidden in an old book'), T('暴風雨夜的停電', 'a power outage during a storm'), T('想當廚師的機器人', 'a robot that wants to be a chef'), T('夏令營的最後一天', 'the last day of summer camp'), T('一個藏著秘密的轉學生', 'a new student with a secret')],
    prompt: T('寫一篇以「{t}」開頭的短篇故事。建立觀點（第一或第三人稱），發展衝突，並用對話和描寫推進到令人滿意的結局。', 'Write a short story that begins with {t}. Establish a point of view, develop a conflict, and use dialogue and description to build toward a satisfying resolution.'),
    plan: [
      { label: T('角色與場景', 'Character + setting'), hint: T('主角是誰？在哪裡？用感官細節描寫。', 'Who is the main character, and where? Use sensory details.') },
      { label: T('引發事件', 'Inciting event'), hint: T('發生了什麼事，讓故事開始？', 'What happens to start the story?') },
      { label: T('衝突升高', 'Rising action'), hint: T('主角遇到什麼阻礙？', 'What obstacles does the character face?') },
      { label: T('高潮', 'Climax'), hint: T('最緊張的時刻，主角要做決定。', 'The most intense moment, when the character must act.') },
      { label: T('結局', 'Resolution'), hint: T('問題怎麼解決？角色有什麼改變？', 'How is the problem solved, and how has the character changed?') },
    ],
    starters: ['… found the … the morning after …', 'Inside was …', '"…," said a voice behind her.', 'Without thinking, …', 'For the first time in …, …', 'That evening, …'],
    words: [300, 500],
    checklist: [
      T('故事有清楚的觀點（第一或第三人稱），而且前後一致。', 'My story has a clear, consistent point of view.'),
      T('主角有一個問題或衝突。', 'My main character faces a clear problem or conflict.'),
      T('我用對話和動作來展現角色，而不只是直接說明。', 'I show characters through dialogue and action, not just telling.'),
      T('我用感官細節描寫場景。', 'I describe the setting with sensory details.'),
      T('情節有起伏，並在高潮後有令人滿意的結局。', 'The plot builds to a climax and ends with a satisfying resolution.'),
      T('我用轉折語表示時間和場景的轉換。', 'I use transitions to show shifts in time and place.'),
      T('對話的標點和分段正確。', 'Dialogue is punctuated and paragraphed correctly.'),
    ],
    mentor: {
      title: 'Low Tide',
      text: `Priya found the bottle the morning after the storm, wedged between two black rocks where the tide had pulled back. It was green glass, thick and scratched, and inside was a rolled-up piece of paper tied with blue thread.\n\nShe sat on the cold sand and worked the cork loose with her thumbs. The note was written in careful, slanted handwriting: "To whoever finds this: My family is moving away from Gull Harbor tomorrow. I buried my treasure under the lighthouse steps. Please take care of it. —M." At the bottom, someone had written a date: June 3, 1987.\n\nPriya ran the whole way to the lighthouse, her sneakers slapping the wet boardwalk. The lighthouse had been closed for years, its white paint peeling like sunburned skin. She knelt by the bottom step and dug with a piece of driftwood until it struck something hard.\n\nIt was a lunchbox, rusted at the corners. Inside were a harmonica, a stack of baseball cards, and a photograph of a girl with a gap-toothed grin, standing exactly where Priya now knelt.\n\n"You found Maggie's box," said a voice behind her.\n\nPriya spun around. An older woman in a yellow raincoat stood on the path, holding a dog leash. Her eyes were fixed on the photograph.\n\n"How do you know her name?" Priya asked.\n\nThe woman smiled, and Priya saw the same gap between her front teeth. "Because I am Maggie," she said softly. "I moved back last spring. I have walked this beach every morning, hoping that bottle would come home."\n\nPriya held out the lunchbox. Maggie took it with trembling hands, turned over the photograph, and laughed. Then she pressed the harmonica into Priya's palm.\n\n"Every treasure needs a new keeper," she said. "I think this one chose you."\n\nThat evening, the sound of a slightly out-of-tune harmonica drifted across Gull Harbor for the first time in almost forty years.`,
      note: T('第三人稱觀點貫穿全文；一開始就有神祕的引發事件（瓶中信）；比喻（油漆像曬傷的皮膚）讓場景生動；高潮是「聲音」出現的意外轉折；結局用口琴聲呼應主題：寶物找到新的主人。', 'A consistent third-person point of view; a mysterious inciting event right away; a simile (paint peeling like sunburned skin) makes the setting vivid; the twist arrives through a voice; the harmonica in the last line echoes the theme of a treasure finding a new keeper.'),
    },
    vocab: ['suddenly', 'without warning', 'meanwhile', 'at last', 'for the first time', 'that evening'],
  },
  {
    id: 'w7-literary-analysis',
    grade: 7,
    genre: 'literary',
    std: 'CCSS W.7.9a',
    title: T('文學分析：故事的主題', 'Literary analysis: What the story teaches'),
    topics: [T('一篇故事的主題', 'the theme'), T('主角如何改變', 'how the main character changes'), T('場景如何影響情節', 'how the setting shapes the plot'), T('故事中的一個象徵', 'an important symbol'), T('兩個角色之間的對比', 'the contrast between two characters')],
    prompt: T('選一篇你讀過的故事、小說或寓言，分析其中的「{t}」。寫出清楚的論點，引用原文或具體細節作為證據，並解釋每個證據如何支持你的想法。', 'Choose a story, novel or fable you have read and analyze {t}. State a clear thesis, support it with quotations or specific details from the text, and explain how each piece of evidence supports your idea.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('作品名稱、作者、簡短背景，再寫出你的論點。', 'Title, author, a brief summary, then your thesis.') },
      { label: T('證據一＋分析', 'Evidence 1 + analysis'), hint: T('引用原文，然後解釋它說明了什麼。', 'Quote or cite a detail, then explain what it shows.') },
      { label: T('證據二＋分析', 'Evidence 2 + analysis'), hint: T('這個細節怎麼支持論點？', 'How does this detail support your thesis?') },
      { label: T('證據三＋分析', 'Evidence 3 + analysis'), hint: T('結尾或關鍵場景通常很有用。', 'The ending or a key scene is often useful.') },
      { label: T('結論', 'Conclusion'), hint: T('這個主題為什麼對今天的讀者仍然重要？', 'Why does the theme still matter to readers today?') },
    ],
    starters: ['In "…," the author …', 'Through …, the author shows that …', 'For example, when …', 'This detail shows that …', 'Some readers think … However, …', 'Although "…" is …, its message …'],
    words: [300, 500],
    checklist: [
      T('引言有作品名稱、作者和清楚的論點。', 'My introduction names the title and author and states a clear thesis.'),
      T('每個身體段都有來自原文的證據。', 'Each body paragraph includes evidence from the text.'),
      T('引用時有引導語和引號。', 'I introduce quotations with signal phrases and quotation marks.'),
      T('每個證據後面都有我的分析（This shows that…）。', 'I explain every piece of evidence ("This shows that…").'),
      T('我用現在式討論故事內容。', 'I use present tense to discuss events in the story.'),
      T('結論說明主題為什麼重要。', 'My conclusion explains why the theme matters.'),
    ],
    mentor: {
      title: 'Planning Ahead in "The Ant and the Grasshopper"',
      text: `Fables are short, but their lessons can last a lifetime. In Aesop's fable "The Ant and the Grasshopper," a carefree grasshopper spends the summer singing while a hardworking ant stores food for the winter. Through the contrast between these two characters and the story's harsh ending, Aesop teaches that people who prepare for the future will be ready when hard times come.\n\nFirst, Aesop uses the two main characters as opposites to make the theme clear. The grasshopper represents people who live only for the moment. He spends sunny days chirping and making music, and he even urges the ant to stop working and relax with him. The ant, in contrast, represents people who plan ahead. Instead of resting, she carries grain to her nest day after day. Because the characters behave in such opposite ways, readers can easily compare the results of their choices.\n\nSecond, the change in setting reveals the consequences of each character's decisions. In summer, food is everywhere, so the grasshopper's choice seems harmless. When winter arrives, however, the fields are bare and frozen. The grasshopper is starving, while the ant has plenty to eat. The cold setting turns the summer's small choices into a matter of survival.\n\nFinally, the ending states the lesson directly. In one well-known English translation, the fable closes with the moral "It is best to prepare for the days of necessity." This sentence connects a story about two insects to the lives of readers, reminding them that the seasons of life change too.\n\nSome readers think the ant is unkind for refusing to help. However, the fable is not mainly about kindness; it is about responsibility. The ant's refusal forces the grasshopper, and the reader, to face the results of poor planning.\n\nAlthough "The Ant and the Grasshopper" is only a few sentences long, its message still matters today. Whether we are saving money, studying for a test, or training for a race, the work we do in the "summer" decides how well we handle the "winter."`,
      note: T('論點句說出主題和兩個證據來源（角色對比、結尾）；每段先給證據，再用「This…shows」分析；引用寓言的寓意時有引導語；也回應了其他讀者的看法；結論把寓言連結到今天的生活。', 'The thesis names the theme and where the evidence comes from (character contrast, the ending). Each paragraph gives evidence and then analyzes it. The quoted moral has a signal phrase. The essay answers another reading of the fable, and the conclusion connects the lesson to readers\' lives today.'),
    },
    vocab: ['the author shows', 'this suggests', 'in contrast', 'for example', 'this detail reveals', 'the theme', 'ultimately'],
  },
  {
    id: 'w7-research-report',
    grade: 7,
    genre: 'research',
    std: 'CCSS W.7.7',
    title: T('短篇研究報告', 'Short research report'),
    topics: [T('一種瀕臨絕種的動物', 'an endangered animal'), T('一項改變日常生活的發明', 'an invention that changed daily life'), T('一種再生能源', 'a renewable energy source'), T('一次重大的自然災害', 'a major natural disaster'), T('一位著名的科學家', 'a famous scientist'), T('你家鄉的一段歷史', 'a piece of local history')],
    prompt: T('研究「{t}」，至少使用三個可靠的資料來源。寫一篇短篇研究報告：回答一個明確的研究問題，正確地改寫或引用資料，最後列出資料來源。', 'Research {t} using at least three credible sources. Write a short research report that answers a focused research question, paraphrases and quotes information accurately, and lists your sources at the end.'),
    plan: [
      { label: T('研究問題', 'Research question'), hint: T('一個「為什麼」或「如何」的問題。', 'A focused "why" or "how" question.') },
      { label: T('引言', 'Introduction'), hint: T('介紹主題並暗示答案。', 'Introduce the topic and hint at the answer.') },
      { label: T('發現一', 'Finding 1'), hint: T('According to … 註明來源。', 'According to … — name the source.') },
      { label: T('發現二', 'Finding 2'), hint: T('數據或例子，用自己的話改寫。', 'Data or examples in your own words.') },
      { label: T('發現三', 'Finding 3'), hint: T('人們正在做什麼？未來會怎樣？', 'What is being done, and what comes next?') },
      { label: T('結論＋資料來源', 'Conclusion + sources'), hint: T('回答研究問題，列出來源。', 'Answer the question and list your sources.') },
    ],
    starters: ['Research question: …', 'According to …, …', '… reports that …', 'The numbers show …', 'Researchers are …', 'Sources'],
    words: [300, 500],
    checklist: [
      T('我有一個明確的研究問題，而報告回答了它。', 'I have a focused research question, and my report answers it.'),
      T('我至少用了三個可靠的資料來源。', 'I used at least three credible sources.'),
      T('我用 According to… 等引導語註明資訊來源。', 'I name sources with signal phrases like "According to…".'),
      T('改寫時用自己的話；直接引用時加引號。', 'I paraphrase in my own words and use quotation marks for exact words.'),
      T('段落依主題組織，語氣客觀。', 'Paragraphs are organized by subtopic, with an objective tone.'),
      T('文末列出資料來源。', 'I list my sources at the end.'),
    ],
    mentor: {
      title: 'The Vaquita: Racing Against Time',
      text: `Research question: Why is the vaquita in danger, and what is being done to save it?\n\nThe vaquita is the smallest porpoise in the world, and it may also be the rarest marine mammal. Found only in the northern Gulf of California in Mexico, this shy animal grows to about 1.5 meters long and has dark rings around its eyes. Scientists did not even describe the species until 1958. Today, only a handful of vaquitas remain, and their survival depends on decisions people make in the next few years.\n\nThe main threat to the vaquita is not hunting but accidental capture. According to NOAA Fisheries, vaquitas become tangled in gillnets, which are walls of netting that fishers leave in the water. Many of these nets are set illegally to catch the totoaba, a large fish that is also endangered. The totoaba's swim bladder sells for high prices on the black market, so some fishers take the risk even though catching totoaba is against the law. Because vaquitas live in the same waters, they become trapped in the nets and drown.\n\nThe numbers show how serious the problem is. The World Wildlife Fund reports that the vaquita population fell from several hundred animals in the 1990s to only about ten in recent surveys. With so few left, every single vaquita matters.\n\nPeople are working to protect the species. Mexico has banned gillnets in much of the vaquita's habitat, and teams remove abandoned "ghost nets" from the water. Researchers also use underwater microphones to listen for the vaquitas' clicks, which helps them track the animals without disturbing them. Encouragingly, recent surveys have spotted calves, which suggests that the remaining vaquitas can still reproduce.\n\nThe vaquita's story is a warning about how quickly a species can slip toward extinction. It is also a reminder that it is not too late as long as some animals survive.\n\nSources\nNOAA Fisheries. "Vaquita." Species Directory.\nWorld Wildlife Fund. "Vaquita." Species Overview.\nEncyclopaedia Britannica. "Vaquita."`,
      note: T('一開始寫出研究問題；每個重要事實都用 According to… 或 … reports that 註明來源；資訊用自己的話改寫；段落依「是什麼→為什麼危險→數據→保育行動」排列；最後列出資料來源。', 'The research question comes first. Key facts are credited with "According to…" or "…reports that". Information is paraphrased, paragraphs move from what → why → data → solutions, and the sources are listed at the end.'),
    },
    vocab: ['according to', 'reports that', 'researchers found', 'as a result', 'in addition', 'however', 'overall'],
  },
  {
    id: 'w7-compare-contrast',
    grade: 7,
    genre: 'compare',
    std: 'CCSS W.7.2',
    title: T('比較與對照', 'Compare and contrast'),
    topics: [T('紙本書和電子書', 'reading on paper and reading on screens'), T('一本書和它改編的電影', 'a book and its movie version'), T('兩種運動', 'two sports you know well'), T('城市生活和鄉村生活', 'city life and country life'), T('貓和狗當寵物', 'cats and dogs as pets'), T('兩個不同故事裡的角色', 'two characters from different stories')],
    prompt: T('寫一篇比較與對照的文章，主題是「{t}」。用「分塊法」或「逐點法」組織，並用表示相同和不同的轉折語。', 'Write a compare-and-contrast essay about {t}. Use either the block method or the point-by-point method, and use transitions that show similarities and differences.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('兩者是什麼？你的整體結論是什麼？', 'What are the two subjects, and what is your overall point?') },
      { label: T('比較點一', 'Point 1'), hint: T('兩者在這一點上相同還是不同？', 'Are they alike or different on this point?') },
      { label: T('比較點二', 'Point 2'), hint: T('用 similarly／in contrast。', 'Use "similarly" / "in contrast".') },
      { label: T('比較點三', 'Point 3'), hint: T('最有意思的差異。', 'The most interesting difference.') },
      { label: T('結論', 'Conclusion'), hint: T('這些異同告訴我們什麼？', 'What do the similarities and differences show?') },
    ],
    starters: ['Both … and … ', 'Similarly, …', 'In contrast, …', 'On the other hand, …', 'While …, …', 'Unlike …, …', 'In the end, …'],
    words: [300, 500],
    checklist: [
      T('論點句說出兩者的整體關係（更相似或更不同、各有優點…）。', 'My thesis states the overall relationship between the two subjects.'),
      T('我用一致的方法組織（分塊或逐點）。', 'I organized consistently (block or point-by-point).'),
      T('每個比較點都同時談到兩者。', 'Each point discusses both subjects.'),
      T('我用了 similarly、both、in contrast、unlike 等轉折語。', 'I used transitions such as similarly, both, in contrast and unlike.'),
      T('我用具體的例子或事實支持每一點。', 'I support each point with specific examples or facts.'),
      T('結論說明這個比較的意義。', 'My conclusion explains what the comparison shows.'),
    ],
    mentor: {
      title: 'Paper Pages and Glowing Screens',
      text: `When my grandmother reads, she licks her finger and turns a crinkly page. When my older brother reads, he swipes a screen. Both of them love stories, but they experience them in very different ways. Printed books and e-books share the same purpose, yet they differ in convenience, comfort, and how well readers remember what they read.\n\nThe biggest advantage of e-books is convenience. A single tablet can hold thousands of titles, so a reader can carry an entire library in a backpack. E-books can also be downloaded in seconds, even at midnight. Printed books, in contrast, take up space and can be heavy. If you want a new one, you usually have to visit a store or a library.\n\nComfort is a different story. Many readers say that paper is easier on their eyes, especially during long reading sessions. Printed books never need charging, and they do not buzz with notifications. E-readers, on the other hand, let readers adjust the size of the text and read in the dark, which can be helpful for people with poor eyesight.\n\nThe most surprising difference involves memory. Several studies have found that people often remember details, such as the order of events, slightly better when they read on paper. One explanation is that a physical book gives the reader landmarks: a story's turning point might be "near the bottom of a left-hand page, about halfway through." On a screen, every page looks the same.\n\nUltimately, neither format is better in every way. E-books win when convenience matters most, while printed books may be the better choice for careful study. Like my grandmother and my brother, readers can choose the format that fits the moment, as long as they keep reading.`,
      note: T('開頭用兩個家人的畫面引出比較；論點句預告三個比較點；採用逐點法，每段都同時談紙本和電子書；用 in contrast、on the other hand 等轉折語；結論不偏袒任何一方，而是說明各自適合的情況。', 'The opening uses two family members to introduce the comparison, and the thesis previews three points. The point-by-point structure discusses both formats in every paragraph, with transitions like "in contrast" and "on the other hand". The conclusion explains when each format works best.'),
    },
    vocab: ['both', 'similarly', 'likewise', 'in contrast', 'on the other hand', 'unlike', 'while', 'ultimately'],
  },
  {
    id: 'w7-letter-to-editor',
    grade: 7,
    genre: 'letter',
    std: 'CCSS W.7.1',
    title: T('投書給報社編輯', 'Letter to the editor'),
    topics: [T('學校附近增設斑馬線', 'adding crosswalks near schools'), T('興建滑板公園', 'building a skate park'), T('讓公立游泳池繼續開放', 'keeping the public pool open'), T('增加自行車道', 'adding bike lanes'), T('公園增設垃圾桶', 'putting more trash cans in parks'), T('延長圖書館開放時間', 'extending library hours')],
    prompt: T('寫一封投書給地方報紙的編輯，主題是「{t}」。說出你的立場，用理由和證據支持，回應不同意的人，最後提出具體的行動呼籲。語氣要正式、有禮貌。', 'Write a letter to the editor of your local newspaper about {t}. State your position, support it with reasons and evidence, address people who disagree, and end with a call to action. Use a formal, respectful tone.'),
    plan: [
      { label: T('稱呼＋立場', 'Greeting + position'), hint: T('Dear Editor: 你是誰？你的立場？', 'Dear Editor: Who are you, and what is your position?') },
      { label: T('理由與證據', 'Reasons + evidence'), hint: T('具體的觀察、數據或例子。', 'Specific observations, data or examples.') },
      { label: T('回應反方', 'Address the other side'), hint: T('承認對方的顧慮，再提出解決辦法。', 'Admit their concern, then offer a solution.') },
      { label: T('行動呼籲＋署名', 'Call to action + signature'), hint: T('誰該做什麼？Sincerely, 姓名', 'Who should do what? Sincerely, name') },
    ],
    starters: ['Dear Editor:', 'I am a seventh grader at …, and I am writing to …', 'Every morning, I see …', 'Some residents may worry that …', 'I urge the city council to …', 'Sincerely,'],
    words: [250, 400],
    checklist: [
      T('信有正確的格式：稱呼、正文、結尾敬語和署名。', 'My letter has a greeting, body, closing and signature.'),
      T('第一段就清楚說出我的立場。', 'My position is clear in the first paragraph.'),
      T('我用具體的理由和證據支持立場。', 'I support my position with specific reasons and evidence.'),
      T('我有禮貌地回應不同意見。', 'I respond respectfully to people who disagree.'),
      T('結尾有具體的行動呼籲。', 'I end with a specific call to action.'),
      T('語氣正式，沒有俚語或攻擊別人的字眼。', 'My tone is formal, with no slang or insults.'),
    ],
    mentor: {
      title: 'A Crosswalk Before Someone Gets Hurt',
      text: `Dear Editor:\n\nI am a seventh grader at Westbrook Middle School, and I am writing to ask the city to paint a crosswalk and install a flashing sign at the corner of Maple Avenue and 8th Street.\n\nEvery morning, more than two hundred students cross Maple Avenue to reach our school. There is no crosswalk, no stop sign, and no crossing guard. Cars often speed down the hill because the road is wide and straight. Last month, my friend had to jump back onto the curb when a delivery van did not slow down. Several parents told me they have seen similar close calls.\n\nA clearly marked crosswalk would make drivers more aware that children are present. A flashing sign would give them an extra warning, especially on dark winter mornings. These changes are not expensive compared with the cost of an accident.\n\nSome residents may worry that a crosswalk will slow traffic during rush hour. However, students cross only for about twenty minutes in the morning and twenty minutes in the afternoon. A short delay is a small price for keeping children safe.\n\nI urge the city council to approve a crosswalk and a flashing sign at Maple and 8th before the next school year begins. I also invite council members to stand on that corner at 7:45 a.m. and see the problem for themselves. Please act before someone gets hurt.\n\nSincerely,\nAisha Rahman\nGrade 7, Westbrook Middle School`,
      note: T('第一段就說出具體的要求；用觀察到的事實（兩百多名學生、差點被撞）當證據；有禮貌地回應「會塞車」的顧慮；行動呼籲非常具體（誰、做什麼、什麼時候）。', 'The request is specific from the first paragraph. Observed facts (two hundred students, a close call) serve as evidence. The traffic concern is answered politely, and the call to action is specific: who, what and when.'),
    },
    vocab: ['I am writing to', 'every morning', 'in addition', 'some residents may worry', 'however', 'I urge', 'sincerely'],
  },
  {
    id: 'w7-poem-figurative',
    grade: 7,
    genre: 'poem',
    std: 'CCSS L.7.5a',
    title: T('自由詩：用修辭描寫', 'Free-verse poem with figurative language'),
    topics: [T('讓你有家的感覺的地方', 'a place that feels like home'), T('季節的轉換', 'a season changing'), T('一個平凡的物品', 'an ordinary object'), T('對一位家人的回憶', 'a memory of a family member'), T('夜晚的城市', 'the city at night'), T('大海', 'the ocean')],
    prompt: T('寫一首關於「{t}」的自由詩。至少用一個明喻、一個暗喻和一個擬人，並選擇精確、有感官畫面的字。斷行要有用意。', 'Write a free-verse poem about {t}. Use at least one simile, one metaphor and one example of personification, and choose precise, sensory words. Break your lines on purpose.'),
    plan: [
      { label: T('主題與感覺', 'Subject + feeling'), hint: T('你想讓讀者有什麼感覺？', 'What feeling do you want readers to have?') },
      { label: T('感官細節', 'Sensory details'), hint: T('看到、聽到、聞到、摸到、嚐到什麼？', 'What do you see, hear, smell, touch, taste?') },
      { label: T('修辭', 'Figurative language'), hint: T('明喻（like/as）、暗喻、擬人。', 'Simile (like/as), metaphor, personification.') },
      { label: T('結尾的轉折', 'Closing turn'), hint: T('最後幾行說出更深的意義。', 'End with a deeper meaning.') },
    ],
    starters: ['At six a.m., the …', '… moves like …', 'The … is a …', '… whispers / sighs / waits …', 'This … is not a …. It is …'],
    words: [60, 200],
    checklist: [
      T('我至少用了一個明喻、一個暗喻和一個擬人。', 'I used at least one simile, one metaphor and one personification.'),
      T('我用了至少三種感官細節。', 'I used details for at least three senses.'),
      T('我選了精確的動詞和名詞，避免 nice、good、thing。', 'I chose precise verbs and nouns instead of nice, good or thing.'),
      T('斷行和分節有用意（強調某個字或製造停頓）。', 'My line and stanza breaks are purposeful (for emphasis or pause).'),
      T('結尾讓讀者有所感受或思考。', 'My ending leaves the reader with a feeling or idea.'),
    ],
    mentor: {
      title: "My Grandmother's Kitchen",
      text: `At six a.m., the kettle clears its throat,\nand the kitchen wakes before anyone else.\n\nMy grandmother moves like a slow song,\nslippers whispering across the yellow tiles,\nher hands already floured to the wrist.\n\nThe window is a picture frame\nholding a square of pink sky\nand the neighbor's cat, pretending not to watch.\n\nDough rises in a blue bowl\nthe way the sun rises over the roofs,\nquietly, without asking permission.\n\nShe hums a song she learned as a girl,\nwords I do not know\nin a language I am still learning.\n\nWhen the bread comes out of the oven,\nthe whole house leans closer to breathe it in.\n\nThis kitchen is not a room.\nIt is a promise:\nsomeone will always be awake,\nand something warm\nwill always be waiting.`,
      note: T('擬人：水壺「清喉嚨」、房子「靠過來聞」；明喻：奶奶走路「像一首慢歌」；暗喻：窗戶是畫框、廚房是一個承諾。感官細節有聲音、顏色和氣味，最後一節把廚房的意義說出來。', 'Personification: the kettle "clears its throat" and the house "leans closer". Simile: the grandmother "moves like a slow song". Metaphors: the window is a picture frame; the kitchen is a promise. Sounds, colors and smells fill the poem, and the last stanza reveals what the kitchen means.'),
    },
    vocab: ['like', 'as', 'whispers', 'leans', 'is a', 'quietly', 'always'],
  },
];

// ================= PROMPTS: GRADE 8 =================
const P8 = [
  {
    id: 'w8-argument-essay',
    grade: 8,
    genre: 'argument',
    std: 'CCSS W.8.1',
    title: T('議論文：表明立場並反駁反方', 'Argument essay: Take a stand and answer the other side'),
    topics: [T('電競成為學校的正式運動', 'making esports an official school sport'), T('一週上課四天', 'a four-day school week'), T('學校禁止一次性塑膠', 'banning single-use plastics at school'), T('全年制上課（縮短暑假）', 'year-round school with a shorter summer break'), T('學生穿制服', 'school uniforms'), T('每天的閱讀時間', 'a daily silent reading period')],
    prompt: T('你支持還是反對「{t}」？寫一篇議論文：提出主張，用合乎邏輯的理由和可信的證據支持，說明並反駁反方論點，最後寫出有力的結論。', 'Do you support or oppose {t}? Write an argument essay that states a claim, supports it with logical reasons and credible evidence, acknowledges and rebuts a counterclaim, and ends with a strong conclusion.'),
    plan: [
      { label: T('引言＋主張', 'Introduction + claim'), hint: T('吸引句、背景、論點句。', 'Hook, background, thesis.') },
      { label: T('理由一＋證據', 'Reason 1 + evidence'), hint: T('數據、研究、專家或具體例子。', 'Data, research, experts or specific examples.') },
      { label: T('理由二＋證據', 'Reason 2 + evidence'), hint: T('解釋證據與主張的關係。', 'Explain how the evidence connects to the claim.') },
      { label: T('反方＋反駁', 'Counterclaim + rebuttal'), hint: T('公平地說明反方，再用證據反駁。', 'State the other side fairly, then rebut with evidence.') },
      { label: T('結論', 'Conclusion'), hint: T('從論證自然推出結論，說明意義。', 'Follow from the argument and show why it matters.') },
    ],
    starters: ['When most people hear "…," they picture …', 'Our school should … because …', 'Research shows that …', 'Consequently, …', 'Critics argue that …', 'While this concern is understandable, …', 'Ultimately, …'],
    words: [350, 550],
    checklist: [
      T('主張清楚，而且和反方主張有所區別。', 'My claim is clear and distinct from opposing claims.'),
      T('理由合乎邏輯，證據可信且相關。', 'My reasons are logical and my evidence is credible and relevant.'),
      T('我公平地說明反方論點，再有力地反駁。', 'I state the counterclaim fairly and rebut it convincingly.'),
      T('我用轉折語釐清主張、理由和證據之間的關係。', 'I use transitions to clarify how claims, reasons and evidence connect.'),
      T('全文保持正式文體。', 'I keep a formal style throughout.'),
      T('結論從論證自然推出，並說明意義。', 'My conclusion follows from the argument and shows its significance.'),
      T('我檢查過語態、語氣和標點。', 'I checked voice, mood and punctuation.'),
    ],
    mentor: {
      title: 'Game On: Esports Belong in Our School',
      text: `When most people hear the word "athlete," they picture a soccer player or a sprinter, not a student sitting at a computer. Yet across the country, thousands of high schools and colleges now compete in organized video game leagues known as esports. Our school should make esports an official school activity because it builds real teamwork, connects students with future careers, and gives a home to students who are not drawn to traditional sports.\n\nFirst, competitive esports demand the same teamwork as any field sport. In team-based games, five players must communicate constantly, divide roles, and adjust their strategy in seconds. A coach reviews recordings of matches, just as a football coach reviews game film. Students learn to accept feedback, support teammates after a loss, and practice on a schedule.\n\nSecond, esports can open doors to future careers. The skills involved, such as quick problem solving, digital communication, and data analysis, are valuable in technology, media, and engineering. Many esports programs also involve students in running live broadcasts, designing team logos, and managing social media. Some colleges even offer scholarships to skilled players.\n\nFinally, an esports team would reach students who rarely join school activities. Not every student wants to play basketball, but many still want to wear a team jersey and represent their school. When schools have added esports, teachers have often reported that quiet students began to speak up, make friends, and feel proud of their school.\n\nCritics argue that esports would only encourage students to spend more time in front of screens. While this concern is understandable, an organized team actually adds structure to gaming. Most school programs limit practice to a few hours a week, require players to keep their grades up, and include physical exercise as part of training. Consequently, a student who joins a team may game less, and more responsibly, than one who plays alone at home.\n\nUltimately, esports offer the same benefits as other school activities: discipline, belonging, and pride. By giving these students a team of their own, our school would show that every kind of talent deserves a place to shine.`,
      note: T('論點句預告三個理由；每段一個理由，並用具體例子（看比賽錄影、轉播、獎學金）支持；先承認反方的擔心「可以理解」，再用 Consequently 推出反駁；結論說明更大的意義。', 'The thesis previews three reasons. Each body paragraph develops one with specific examples (reviewing recordings, running broadcasts, scholarships). The rebuttal grants that the concern is "understandable" before answering it, using "Consequently" to show the logic. The conclusion widens to a larger point.'),
    },
    vocab: ['consequently', 'furthermore', 'in fact', 'while this concern is understandable', 'critics argue', 'nevertheless', 'ultimately'],
  },
  {
    id: 'w8-informative-process',
    grade: 8,
    genre: 'informative',
    std: 'CCSS W.8.2',
    title: T('說明文：解釋一個過程或現象', 'Informative essay: Explain a process'),
    topics: [T('颶風／颱風如何形成', 'how a hurricane forms'), T('人的記憶如何運作', 'how human memory works'), T('網路如何傳送訊息', 'how the internet sends information'), T('橋梁為什麼不會倒', 'how bridges stay standing'), T('種子如何長成植物', 'how a seed becomes a plant'), T('地震是怎麼發生的', 'how earthquakes happen')],
    prompt: T('寫一篇說明文，解釋「{t}」。預告文章的內容，用合適的組織方式（例如時間順序或因果）、相關的事實和精確的用語，必要時用小標題。', 'Write an informative essay that explains {t}. Preview what is to follow, organize the ideas with a fitting structure (such as sequence or cause and effect), use relevant facts and precise vocabulary, and add headings if they help.'),
    plan: [
      { label: T('引言＋預告', 'Introduction + preview'), hint: T('吸引句，然後告訴讀者會學到什麼。', 'Hook, then tell readers what they will learn.') },
      { label: T('第一階段／原因', 'Stage 1 / cause'), hint: T('專有名詞要定義。', 'Define technical terms.') },
      { label: T('第二階段', 'Stage 2'), hint: T('用時間或因果轉折語。', 'Use sequence or cause-effect transitions.') },
      { label: T('第三階段', 'Stage 3'), hint: T('加入例子或數據。', 'Add an example or data.') },
      { label: T('結論', 'Conclusion'), hint: T('總結，並說明這個知識的用處。', 'Sum up and explain why the knowledge is useful.') },
    ],
    starters: ['Every year, …', 'To understand …, it helps to know …', 'The first ingredient is …', 'Once …, …', 'This process, called …, …', 'As a result, …', 'Understanding … helps …'],
    words: [350, 550],
    checklist: [
      T('引言清楚預告文章要說明的內容。', 'My introduction clearly previews what the essay will explain.'),
      T('我用了合適的組織方式（時間順序、因果…）。', 'I used a fitting structure (sequence, cause and effect…).'),
      T('專有名詞都有定義或解釋。', 'Technical terms are defined or explained.'),
      T('我用了相關的事實、數據和例子。', 'I used relevant facts, data and examples.'),
      T('轉折語讓步驟或因果關係清楚。', 'Transitions make the steps or causes clear.'),
      T('語氣正式、客觀。', 'My style is formal and objective.'),
      T('結論總結並說明意義。', 'My conclusion sums up and shows significance.'),
    ],
    mentor: {
      title: 'Birth of a Storm: How Hurricanes Form',
      text: `Every year, satellites capture images of enormous spinning clouds over the ocean, some wider than an entire country. These storms are called hurricanes in the Atlantic, typhoons in the western Pacific, and cyclones in the Indian Ocean, but they all form in the same way. A hurricane needs three main ingredients: warm ocean water, moist air, and winds that allow the storm to grow.\n\nThe first ingredient is heat. Hurricanes form over tropical oceans where the surface water is at least 26 degrees Celsius. The warm water heats the air above it, and this warm, moist air rises. As it rises, it leaves behind an area of lower air pressure near the ocean's surface.\n\nOnce the warm air rises, a cycle begins. Surrounding air rushes in to fill the low-pressure area, warms up, and rises as well. High above the ocean, the rising air cools, and its water vapor condenses into towering clouds. This process, called condensation, releases even more heat, which makes the air rise faster. In this way, the storm feeds itself, like a fire that keeps adding its own fuel.\n\nNext, Earth's rotation sets the storm spinning. Because the planet turns, winds moving toward the low-pressure center curve instead of traveling in a straight line. This effect causes storms north of the equator to spin counterclockwise and storms south of the equator to spin clockwise. At the center, a calm, clear area called the eye forms, surrounded by a ring of violent thunderstorms known as the eyewall.\n\nFinally, the storm needs the right winds high in the atmosphere. If the upper winds are strong and blow in different directions, they tear the storm apart. If they are gentle, the storm can grow. When its sustained winds reach 119 kilometers per hour, it officially becomes a hurricane.\n\nA hurricane weakens when it moves over cooler water or land, because it loses its supply of warm, moist air. Understanding these stages helps scientists predict where a storm will travel and how strong it will become, giving communities precious time to prepare.`,
      note: T('引言先預告「三個要素」；身體段依照形成的時間順序（熱→上升與凝結→旋轉→高空風）；每個專有名詞（condensation、eye、eyewall）都有定義；用「自己添柴的火」比喻；結論說明這個知識的實際用處。', 'The introduction previews the three ingredients. Body paragraphs follow the order of formation (heat → rising and condensation → spin → upper winds). Each technical term is defined, a fire analogy explains the feedback loop, and the conclusion shows why the knowledge matters.'),
    },
    vocab: ['the first stage', 'once', 'next', 'as a result', 'because', 'this process is called', 'finally', 'in this way'],
  },
  {
    id: 'w8-personal-narrative',
    grade: 8,
    genre: 'personal',
    std: 'CCSS W.8.3',
    title: T('個人記敘文：我看見了不一樣的他／她', 'Personal narrative: Seeing someone differently'),
    topics: [T('一位家人', 'a family member'), T('一位老師或教練', 'a teacher or coach'), T('一個你原本不喜歡的同學', 'a classmate you once disliked'), T('一位鄰居', 'a neighbor'), T('一位年長的人', 'an older person in your community'), T('你的弟弟或妹妹', 'a younger brother or sister')],
    prompt: T('寫一篇個人記敘文，講述某件事讓你對「{t}」有了新的看法。用對話、節奏、描寫和反思，並用轉折語表示時間和場景的轉換。', 'Write a personal narrative about an event that changed the way you saw {t}. Use dialogue, pacing, description and reflection, and use transitions to signal shifts in time and setting.'),
    plan: [
      { label: T('原本的看法', 'First impression'), hint: T('一開始你怎麼看這個人？舉一個具體的畫面。', 'How did you see this person at first? Show one scene.') },
      { label: T('事件', 'The event'), hint: T('發生了什麼事？在哪裡？', 'What happened, and where?') },
      { label: T('轉折點', 'Turning point'), hint: T('放慢節奏：對話、動作、表情。', 'Slow down: dialogue, gestures, expressions.') },
      { label: T('新的看法', 'New understanding'), hint: T('你看到了什麼以前沒看到的？', 'What did you finally see?') },
      { label: T('反思', 'Reflection'), hint: T('這件事如何改變你？', 'How did it change you?') },
    ],
    starters: ['For most of my life, I thought …', 'That changed on …', '"…," she said, without looking up.', 'I had never noticed …', 'It was then that I understood …', 'Now, whenever I …'],
    words: [350, 550],
    checklist: [
      T('開頭建立了我對這個人原本的看法。', 'My opening establishes my first impression.'),
      T('我用對話和動作展現人物，不只是直接說明。', 'I reveal the person through dialogue and actions, not just telling.'),
      T('轉折點的節奏放慢，有細節。', 'The turning point is slowed down with details.'),
      T('時間和場景轉換時用了轉折語。', 'I used transitions for shifts in time and setting.'),
      T('我用精確的字詞和感官語言。', 'I used precise words and sensory language.'),
      T('結尾反思這次經驗的意義。', 'My ending reflects on the meaning of the experience.'),
    ],
    mentor: {
      title: 'The Mechanic',
      text: `For most of my life, I thought my uncle Teo was the least interesting person in our family. At holiday dinners, my aunts told dramatic stories and my cousins argued about soccer, while Uncle Teo sat at the end of the table, quietly peeling an orange in one long spiral. He fixed cars for a living. As far as I could tell, that was all there was to know.\n\nThat changed the summer my bike chain snapped three kilometers from home. I had pushed the bike up two hills in the heat, my shirt stuck to my back, when I realized I was standing in front of Teo's garage. I almost kept walking. Then the door rattled open.\n\n"That chain is finished," he said, wiping his hands on a rag. "Bring it in."\n\nThe garage smelled of oil and rubber. Engines hung from chains like sleeping animals, and every wall was covered with tools arranged by size. In one corner, though, I noticed something strange: a shelf of old radios, each one cracked open, wires spilling out like spaghetti.\n\n"You fix those too?" I asked.\n\n"I fix everything," he said. Then, after a pause, "I like to know how things work. When something breaks, it is telling you a story. You just have to listen."\n\nFor the next hour, he showed me how to remove the broken link, how to measure a new chain, and how to tell when it was tight enough. He did not lecture. He let me hold the tools and make mistakes. When I put the chain on backward, he simply laughed and said, "Now you know one more way it does not work."\n\nBy the time I rode home, the sun was setting, and I was thinking about all the dinners when I had ignored the quiet man at the end of the table. Teo was not boring. He was patient, curious, and kind in a way that did not need an audience.\n\nNow, whenever I visit, I head straight to the garage. Last month, we finally got one of those old radios to play.`,
      note: T('開頭用剝橘子的畫面建立「無聊叔叔」的印象；轉折點的對話透露人物內心；工具和收音機的感官細節讓場景具體；結尾用「收音機終於響了」暗示兩人關係的改變，而不是直接說教。', 'The opening image (the orange peeled in one spiral) sets up the "boring uncle". Dialogue at the turning point reveals who he really is, and sensory details make the garage real. The ending shows the changed relationship through the working radio instead of stating a lesson.'),
    },
    vocab: ['for most of my life', 'that changed when', 'for the next hour', 'by the time', 'it was then that', 'now, whenever'],
  },
  {
    id: 'w8-fiction-flashback',
    grade: 8,
    genre: 'narrative',
    std: 'CCSS W.8.3',
    title: T('短篇故事：用倒敘或不同觀點', 'Short story with a flashback'),
    topics: [T('打開一個二十五年前的時光膠囊', 'a time capsule opened after twenty-five years'), T('一支一直收到訊息的遺失手機', 'a lost phone that keeps receiving messages'), T('一道失傳的家傳食譜', 'a family recipe that was almost lost'), T('出了差錯的才藝表演', 'a talent show that goes wrong'), T('一棵要被砍掉的老樹', 'an old tree that is about to be cut down'), T('一場意外的停電', 'an unexpected blackout')],
    prompt: T('寫一篇關於「{t}」的短篇故事，至少用一次倒敘（flashback）或轉換觀點。用對話、節奏、描寫來塑造角色和衝突，並用轉折語清楚標示時間的轉換。', 'Write a short story about {t} that uses at least one flashback or a shift in point of view. Use dialogue, pacing and description to develop characters and conflict, and use transitions to make shifts in time clear.'),
    plan: [
      { label: T('現在的場景', 'Present scene'), hint: T('角色、地點、問題。', 'Character, place, problem.') },
      { label: T('觸發倒敘的物品或事件', 'Flashback trigger'), hint: T('一個物品、氣味或一句話。', 'An object, smell or line of dialogue.') },
      { label: T('倒敘', 'Flashback'), hint: T('用過去完成式或明確的時間轉折語進入過去。', 'Use past perfect or a clear time transition.') },
      { label: T('回到現在＋高潮', 'Return + climax'), hint: T('過去的事如何影響現在的決定？', 'How does the past shape the present choice?') },
      { label: T('結局', 'Resolution'), hint: T('角色學到什麼？', 'What has the character learned?') },
    ],
    starters: ['The box was smaller than …', 'Twenty-five years earlier, …', 'She had promised herself that …', 'Back in the present, …', '"…," he whispered.', 'For the first time since …'],
    words: [350, 550],
    checklist: [
      T('倒敘或觀點轉換的地方清楚，讀者不會迷路。', 'My flashback or shift in point of view is clear to the reader.'),
      T('我用對話和行動塑造角色。', 'I develop characters through dialogue and action.'),
      T('衝突清楚，並逐步升高到高潮。', 'The conflict is clear and builds to a climax.'),
      T('我用感官細節和精確的字詞。', 'I use sensory details and precise words.'),
      T('結局從事件中自然產生，並有反思。', 'The resolution follows from the events and includes reflection.'),
      T('時態一致；倒敘時用過去完成式或時間轉折語。', 'Tenses are consistent; the flashback uses past perfect or time transitions.'),
    ],
    mentor: {
      title: 'The Time Capsule',
      text: `The box was smaller than Nadia expected, a dented metal cube still crusted with soil. Around her, the gym buzzed with former students who had come back to Lincoln Middle School for the opening of the time capsule. Some of them were older than her parents. The principal lifted the lid, and the room went quiet.\n\nInside were letters, a cassette tape, and a friendship bracelet so faded that its colors had melted into gray. Nadia's grandmother, standing beside her, drew in a sharp breath.\n\n"That one is mine," she whispered.\n\nTwenty-five years earlier, on the last day of eighth grade, a girl named Rosa Medina had sat on the bleachers in this same gym, braiding thread with shaking fingers. Her best friend, Lucy, was moving across the country the next morning. They had argued that week over something so small that neither of them could remember it later, and they had not spoken since. Rosa had made the bracelet anyway. At the last minute, too proud to hand it over, she had dropped it into the time capsule with a note: "For Lucy, when we are brave enough."\n\nBack in the present, the principal unfolded the note and read it aloud. Nadia watched her grandmother's face turn pink.\n\n"Is there a Lucy here?" the principal asked, smiling.\n\nNo one answered. People shuffled their feet. Then, from the back of the gym, a tall woman with silver hair raised her hand slowly, as if she were still a student unsure of the answer.\n\n"I am Lucy," she said. "I came because I hoped Rosa would."\n\nNadia's grandmother crossed the gym in what felt like a single step. For a moment, the two women simply looked at each other. Then Lucy laughed, the same bright laugh Nadia's grandmother had described in a hundred bedtime stories, and they hugged as if the twenty-five years had been a short recess.\n\nLater, in the parking lot, Nadia's grandmother tied the gray bracelet around Lucy's wrist.\n\n"We were not very brave back then," she said.\n\n"No," Lucy agreed. "But we were brave enough today."`,
      note: T('故事從「現在」開始，用奶奶的一句話觸發倒敘；倒敘段用 Twenty-five years earlier 和過去完成式（had sat、had made）清楚標示時間；用 Back in the present 回到現在；結尾的對話呼應紙條上的 brave，讓主題自然浮現。', 'The story begins in the present, and the grandmother\'s whisper triggers the flashback. "Twenty-five years earlier" and the past perfect (had sat, had made) mark the shift, and "Back in the present" returns the reader. The final lines echo the word "brave" from the note, so the theme emerges naturally.'),
    },
    vocab: ['years earlier', 'had promised', 'back in the present', 'meanwhile', 'for a moment', 'later'],
  },
  {
    id: 'w8-literary-analysis',
    grade: 8,
    genre: 'literary',
    std: 'CCSS W.8.9a',
    title: T('文學分析：角色的選擇如何揭示主題', "Literary analysis: How a character's choices reveal theme"),
    topics: [T('主角的一個關鍵決定', "the main character's key decision"), T('故事的反轉結局', 'the twist ending'), T('角色的缺點', "the main character's flaw"), T('故事中的一個象徵物', 'an important object or symbol'), T('對話透露的衝突', 'what the dialogue reveals about the conflict')],
    prompt: T('選一篇你讀過的短篇小說，分析「{t}」如何揭示故事的主題。寫出明確的論點，引用最有力的原文證據，並分析每一個證據。', 'Choose a short story you have read and analyze how {t} reveals the theme. State a clear thesis, cite the strongest textual evidence, and analyze each piece of evidence.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('作者、篇名、簡短背景、論點。', 'Author, title, brief context, thesis.') },
      { label: T('證據一＋分析', 'Evidence 1 + analysis'), hint: T('引文→解釋→連結主題。', 'Quote → explain → connect to theme.') },
      { label: T('證據二＋分析', 'Evidence 2 + analysis'), hint: T('情節的轉折點。', 'A turning point in the plot.') },
      { label: T('證據三＋分析', 'Evidence 3 + analysis'), hint: T('結局或關鍵對話。', 'The ending or a key line of dialogue.') },
      { label: T('結論', 'Conclusion'), hint: T('主題對今天的讀者有什麼意義？', 'What does the theme mean for readers today?') },
    ],
    starters: ['In "…," … tells the story of …', "Through …'s choice to …, the author suggests that …", 'This moment reveals …', 'The author emphasizes this when …', 'This irony shows …', 'In the end, …'],
    words: [350, 550],
    checklist: [
      T('論點說出角色的選擇和主題之間的關係。', "My thesis links the character's choices to the theme."),
      T('我引用最有力的原文證據，並有引導語。', 'I cite the strongest textual evidence with signal phrases.'),
      T('每個證據後面都有深入的分析。', 'Every piece of evidence is followed by analysis.'),
      T('我用現在式分析文學作品。', 'I use present tense to discuss the story.'),
      T('段落之間有轉折語。', 'I use transitions between paragraphs.'),
      T('結論說明主題的意義，而不只是重複。', 'My conclusion explains the significance of the theme, not just repeating it.'),
    ],
    mentor: {
      title: 'The Price of Appearances in "The Necklace"',
      text: `In Guy de Maupassant's short story "The Necklace," Mathilde Loisel is a young woman who believes she deserves a life of luxury. When she borrows a diamond necklace for a fancy ball and then loses it, she and her husband spend ten years in poverty paying for a replacement. Through Mathilde's choices, Maupassant suggests that caring too much about appearances can cost people the very happiness they are chasing.\n\nFrom the beginning, Mathilde's discontent shapes her decisions. Although she has a comfortable home and a loving husband, she suffers because she does not have elegant dresses and jewels. When her husband proudly brings home an invitation to a ball, she does not rejoice. Instead, she throws it on the table and complains that she has nothing to wear. This reaction shows that Mathilde measures her worth by what others can see, not by what she already has.\n\nMathilde's next choice deepens the conflict. Rather than wearing simple flowers, she borrows a necklace from her wealthy friend, Madame Forestier, so that she will look rich. At the ball, she is admired by everyone, and for one night her dream comes true. However, the moment is brief. After she loses the necklace, she is too ashamed to tell her friend the truth. That decision to hide the loss, rather than admit it, turns a single mistake into a decade of hardship.\n\nThe consequences of her pride are severe. Mathilde and her husband move to a tiny attic, dismiss their servant, and work exhausting jobs. Maupassant describes how Mathilde's hands become red and rough and how she begins to look old. The woman who once wanted to appear wealthy now looks poor to everyone who sees her.\n\nThe story's final line delivers a painful irony. Years later, Mathilde learns from Madame Forestier that the original necklace was fake: "Oh, my poor Mathilde! Why, my necklace was paste. It was worth at most five hundred francs!" All of her suffering came from protecting an appearance that was never real in the first place.\n\nIn the end, "The Necklace" warns readers that pretending to be something we are not can be far more costly than the truth. Mathilde's tragedy is not simply that she lost a necklace; it is that she lost ten years trying to keep up an image.`,
      note: T('論點連結角色的選擇與主題；三個身體段依照情節順序分析三個關鍵選擇；引文有引導語，引文後立即分析反諷；結論說明主題的意義（失去的不是項鍊而是十年）。', 'The thesis ties the character\'s choices to the theme. Body paragraphs analyze three key choices in plot order. The quotation is introduced and immediately analyzed for irony, and the conclusion explains the theme\'s significance: she lost ten years, not just a necklace.'),
    },
    vocab: ['the author suggests', 'this reveals', 'rather than', 'however', 'as a consequence', 'the irony is', 'in the end'],
  },
  {
    id: 'w8-research-paper',
    grade: 8,
    genre: 'research',
    std: 'CCSS W.8.7',
    title: T('研究報告：回答一個問題', 'Research paper: Answer a question'),
    topics: [T('城市如何對抗熱浪', 'how cities fight extreme heat'), T('一項運動的歷史', 'the history of a sport'), T('青少年睡眠的科學', 'the science of teen sleep'), T('你所在地區的一個環境問題', 'an environmental problem in your region'), T('一項著名發明的影響', 'the impact of a famous invention'), T('蜜蜂數量減少的原因', 'why honeybee populations are declining')],
    prompt: T('針對「{t}」提出一個研究問題，從多個可靠的資料來源蒐集資訊，寫一篇研究報告。引用和改寫都要註明出處，最後列出參考資料。', 'Ask a research question about {t}, gather information from several credible sources, and write a research paper that answers it. Credit every quotation and paraphrase, and include a list of sources.'),
    plan: [
      { label: T('研究問題', 'Research question'), hint: T('可以用資料回答的「如何」或「為什麼」。', 'A how or why question that sources can answer.') },
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('背景和你的答案。', 'Background and your answer.') },
      { label: T('發現一', 'Finding 1'), hint: T('問題的原因或背景。', 'Causes or background.') },
      { label: T('發現二', 'Finding 2'), hint: T('解決方法或例子，註明出處。', 'Solutions or examples, with sources.') },
      { label: T('發現三', 'Finding 3'), hint: T('限制、爭議或未來。', 'Limits, debates or the future.') },
      { label: T('結論＋資料來源', 'Conclusion + sources'), hint: T('回答研究問題；列出來源。', 'Answer the question; list sources.') },
    ],
    starters: ['Research question: …', 'According to …, …', 'A study by … found that …', 'Experts at … explain that …', 'However, …', 'Overall, the research suggests that …', 'Sources'],
    words: [350, 550],
    checklist: [
      T('研究問題明確，報告有回答它。', 'My research question is focused, and the paper answers it.'),
      T('我用了多個可靠的資料來源。', 'I used several credible sources.'),
      T('引用和改寫都有註明出處，沒有抄襲。', 'Every quotation and paraphrase is credited; nothing is plagiarized.'),
      T('段落依子題組織，並有轉折語。', 'Paragraphs are organized by subtopic with transitions.'),
      T('我用正式、客觀的語氣。', 'I use a formal, objective style.'),
      T('結論回答研究問題，文末列出資料來源。', 'My conclusion answers the question, and sources are listed.'),
    ],
    mentor: {
      title: 'Cooling Cities: How Communities Fight Urban Heat',
      text: `Research question: Why are cities hotter than the areas around them, and what can communities do about it?\n\nOn a summer afternoon, a downtown street can feel several degrees hotter than a park only a few blocks away. Scientists call this difference the urban heat island effect. As heat waves become more frequent, cities are searching for ways to cool down. Research shows that the problem is caused largely by the way cities are built, and that trees, reflective surfaces, and smarter planning can reduce it.\n\nThe main cause of urban heat is the material cities are made of. According to the U.S. Environmental Protection Agency (EPA), roads, rooftops, and sidewalks absorb the sun's energy during the day and release it slowly as heat, even after sunset. Dark asphalt is especially effective at storing heat. In addition, tall buildings can block wind, and cars and air conditioners give off even more warmth. As a result, the EPA reports that some city centers stay noticeably warmer than nearby rural areas, especially at night.\n\nOne of the simplest solutions is planting trees. Trees provide shade, and they also cool the air through a process called evapotranspiration, in which water evaporates from their leaves. The EPA notes that shaded surfaces can be many degrees cooler than surfaces in full sun. For this reason, many cities have launched tree-planting programs that focus on neighborhoods with little shade.\n\nAnother strategy is to change the color of the city itself. "Cool roofs" are covered with light-colored or reflective materials that bounce sunlight away instead of absorbing it. Some cities have tested lighter pavement coatings on streets for the same reason. These changes can lower surface temperatures and reduce the energy needed for air conditioning.\n\nHowever, experts caution that no single solution is enough. Trees take years to grow, and reflective materials must be maintained. Researchers recommend combining several approaches and making sure that the hottest, often lowest-income neighborhoods are helped first.\n\nOverall, the research suggests that urban heat is a human-made problem with human-made solutions. By planting trees, rethinking materials, and planning carefully, cities can stay livable as summers grow hotter.\n\nSources\nU.S. Environmental Protection Agency. "Heat Island Effect."\nNational Oceanic and Atmospheric Administration. "Urban Heat Islands."\nU.S. Forest Service. "Urban Forests and Climate."`,
      note: T('研究問題放在最前面；論點句直接回答它；每段一個子題（原因、樹木、反光材料、限制）；用 According to…、…notes that 註明出處；包含反面的「限制」讓報告更客觀；文末列出來源。', 'The research question comes first, and the thesis answers it directly. Each paragraph covers one subtopic (causes, trees, reflective materials, limits). Sources are credited with "According to…" and "…notes that". Including the limits makes the paper more balanced, and the sources are listed at the end.'),
    },
    vocab: ['according to', 'reports that', 'researchers recommend', 'as a result', 'for this reason', 'however', 'overall'],
  },
  {
    id: 'w8-persuasive-speech',
    grade: 8,
    genre: 'argument',
    std: 'CCSS W.8.1',
    title: T('說服性演講稿', 'Persuasive speech'),
    topics: [T('每個學生都該學 CPR（心肺復甦術）', 'why every student should learn CPR'), T('為新生成立學伴制度', 'why our school needs a buddy program for new students'), T('鎮上需要一個青少年活動中心', 'why our town needs a teen center'), T('為什麼大家都該參加學生會投票', 'why every student should vote in student council elections'), T('學校應該減少食物浪費', 'why our school should cut food waste'), T('應該多上戶外課', 'why classes should go outdoors more often')],
    prompt: T('寫一篇演講稿，在全校集會上說服同學「{t}」。使用修辭技巧（重複、問句、故事、數據），讓聽眾記得你的主張，並以具體的行動呼籲結尾。', 'Write a speech for a school assembly arguing {t}. Use rhetorical techniques (repetition, questions, a story, a statistic) so that listeners remember your message, and end with a specific call to action.'),
    plan: [
      { label: T('抓住注意力', 'Grab attention'), hint: T('故事、問題或驚人的事實。', 'A story, a question or a surprising fact.') },
      { label: T('主張', 'Claim'), hint: T('用一句好記的話說出來。', 'Say it in one memorable sentence.') },
      { label: T('理由與證據', 'Reasons + evidence'), hint: T('兩到三個理由，搭配數據和例子。', 'Two or three reasons with data and examples.') },
      { label: T('回應疑慮', 'Answer doubts'), hint: T('聽眾可能有什麼顧慮？', 'What might listeners worry about?') },
      { label: T('行動呼籲', 'Call to action'), hint: T('明確告訴聽眾下一步要做什麼。', 'Tell listeners exactly what to do next.') },
    ],
    starters: ['Imagine this: …', 'Raise your hand if …', 'What if …?', 'Here is the truth: …', 'You might be thinking, "…"', 'So I am asking you to …', 'Because …'],
    words: [350, 550],
    checklist: [
      T('開頭立刻抓住聽眾的注意力。', 'My opening grabs the audience immediately.'),
      T('主張清楚、好記，而且重複出現。', 'My claim is clear, memorable and repeated.'),
      T('我用了證據和至少兩種修辭技巧。', 'I used evidence and at least two rhetorical techniques.'),
      T('我回應了聽眾可能的疑慮。', "I responded to listeners' likely doubts."),
      T('句子適合朗讀：長短交錯、直接對聽眾說話。', 'Sentences are easy to say aloud and speak directly to the audience.'),
      T('結尾有具體的行動呼籲。', 'I end with a specific call to action.'),
    ],
    mentor: {
      title: 'Thirty Compressions',
      text: `Imagine this: you are eating lunch in the cafeteria when a teacher suddenly collapses. People scream. Someone calls 911. The ambulance is on its way, but it is eight minutes away. What happens in those eight minutes depends on the people in the room. It depends on us.\n\nThat is why I believe every student at our school should learn CPR before eighth grade ends.\n\nHere is the truth: when a person's heart stops, every minute without help lowers the chance of survival. The American Heart Association reports that immediate CPR can double or even triple a person's chance of surviving cardiac arrest. Yet most people who collapse outside a hospital do not receive CPR from a bystander. They are not ignored because people do not care. They are ignored because people do not know what to do.\n\nLearning CPR is easier than you might think. Hands-only CPR has two steps. First, call 911. Second, push hard and fast in the center of the chest, about one hundred to one hundred twenty times a minute. That is the beat of a familiar pop song. A basic class takes less than an hour, and many fire departments teach it for free.\n\nYou might be thinking, "I am just a kid. Adults will handle it." But emergencies do not check your age before they happen. They happen at soccer games, at family dinners, and at the pool. Last year, a ninth grader in a nearby town saved her grandfather because she had learned CPR in gym class only two weeks earlier. She was not a doctor. She was not an adult. She was simply prepared.\n\nSome people worry that they will do it wrong and cause harm. Experts say the opposite is true: doing something is far better than doing nothing. The only real mistake is standing still.\n\nSo I am asking you to do three things. Sign the petition outside the library asking our principal to add CPR training to health class. Talk to your family about learning it together. And when the class is offered, show up.\n\nBecause one day, in a cafeteria, on a field, or in your own living room, someone may need thirty compressions and a person brave enough to give them. Let that person be you.`,
      note: T('開頭用「想像一下」把聽眾放進場景；主張單獨成段，很好記；用數據（存活率加倍）和真實故事當證據；直接回應聽眾的疑慮（我只是小孩、怕做錯）；三個具體的行動呼籲；結尾重複「thirty compressions」呼應標題。', 'The speech drops listeners into a scene with "Imagine this", then states the claim in its own short paragraph. A statistic and a true-to-life story serve as evidence, the speaker answers listeners\' doubts directly, three specific actions form the call to action, and the ending repeats the title phrase.'),
    },
    vocab: ['imagine', 'here is the truth', 'you might be thinking', 'that is why', 'so I am asking you', 'because one day'],
  },
  {
    id: 'w8-objective-summary',
    grade: 8,
    genre: 'summary',
    std: 'CCSS RI.8.2',
    title: T('客觀摘要', 'Objective summary'),
    topics: [T('一篇科學文章', 'a science article'), T('一則新聞報導', 'a news report'), T('課本的一個章節', 'a textbook chapter'), T('一部紀錄片', 'a documentary'), T('一篇人物專訪', 'an interview or profile'), T('一篇社論', 'an editorial')],
    prompt: T('讀一篇「{t}」，寫一篇客觀的摘要：說出主旨和最重要的支持重點，用自己的話寫，不加入個人意見。', 'Read {t} and write an objective summary of it. State the central idea and the most important supporting points in your own words, without adding your own opinions.'),
    plan: [
      { label: T('出處與主旨', 'Source + central idea'), hint: T('篇名、作者，一句話寫出主旨。', 'Title, author, and the central idea in one sentence.') },
      { label: T('重點', 'Key points'), hint: T('兩到四個支持主旨的重點，依原文順序。', 'Two to four key points, in the original order.') },
      { label: T('結論', 'Conclusion'), hint: T('原文的結論或作者的最後一個重點。', "The text's conclusion or the author's final point.") },
    ],
    starters: ['In the article "…," … explains that …', 'The author first describes …', 'Next, the article explains …', 'According to the article, …', 'The author concludes that …'],
    words: [120, 250],
    checklist: [
      T('第一句寫出篇名、作者和主旨。', 'My first sentence gives the title, author and central idea.'),
      T('只寫最重要的重點，沒有小細節。', 'I included only the key points, not minor details.'),
      T('全部用自己的話；需要時才簡短引用。', 'I used my own words, with only brief quotations if needed.'),
      T('沒有加入個人意見或評價。', 'I did not add my opinions or judgments.'),
      T('依照原文的順序。', 'I followed the order of the original.'),
      T('摘要比原文短很多。', 'My summary is much shorter than the original.'),
    ],
    mentor: {
      title: 'Summary of "The Secret Lives of City Crows"',
      text: `In the article "The Secret Lives of City Crows," science writer Dana Whitfield explains that crows have adapted remarkably well to life in cities because of their intelligence and their ability to learn from one another.\n\nWhitfield first describes a well-known experiment in which researchers wearing a particular mask captured and released a few crows. For years afterward, crows in the area scolded anyone who wore that mask, including crows that had never been caught. According to the article, this suggests that crows can recognize human faces and pass information to other crows.\n\nNext, the article explains how crows use city environments to find food. Some crows have been observed dropping nuts onto roads so that passing cars will crack them open. Others learn the schedules of garbage trucks and outdoor restaurants.\n\nFinally, Whitfield discusses what scientists hope to learn from crows. Researchers are studying how crows solve problems in order to better understand how intelligence develops in animals. The author concludes that crows are not simply pests; they are skilled problem solvers that have learned to thrive alongside humans.`,
      note: T('第一句就有篇名、作者和主旨；依原文順序寫三個重點；用 first、next、finally 串連；完全沒有個人意見（例如「烏鴉好可怕」）；用「According to the article」表示這是原文的說法。', 'The first sentence gives the title, author and central idea. Three key points follow in the original order, linked by first, next and finally. There are no personal opinions, and "According to the article" makes clear whose ideas these are.'),
    },
    vocab: ['the author explains', 'according to the article', 'first', 'next', 'finally', 'the author concludes'],
  },
  {
    id: 'w8-reflective-essay',
    grade: 8,
    genre: 'personal',
    std: 'CCSS W.8.3',
    title: T('反思文：我從中學到的事', 'Reflective essay: What I learned'),
    topics: [T('一個讓你學到教訓的錯誤', 'a mistake that taught you something'), T('一個你努力很久才達成的目標', 'a goal you worked hard to reach'), T('一次讓你改變想法的失敗', 'a failure that changed your thinking'), T('一個你原本很怕的挑戰', 'a challenge you dreaded'), T('一項你堅持下來的嗜好', 'a hobby you stuck with'), T('這一年最大的改變', 'the biggest change in your life this year')],
    prompt: T('寫一篇反思文，主題是「{t}」。先描述經驗，再深入反思：你當時怎麼想？現在怎麼想？這件事如何改變你看自己或世界的方式？', 'Write a reflective essay about {t}. Describe the experience, then reflect deeply: What did you think then? What do you think now? How did it change the way you see yourself or the world?'),
    plan: [
      { label: T('開頭', 'Opening'), hint: T('一個具體的時刻或物品。', 'A specific moment or object.') },
      { label: T('經驗', 'The experience'), hint: T('發生了什麼？用細節描述。', 'What happened? Use details.') },
      { label: T('當時的想法', 'Then'), hint: T('當時你怎麼想、怎麼感覺？', 'What did you think and feel at the time?') },
      { label: T('現在的想法', 'Now'), hint: T('現在回頭看，你明白了什麼？', 'Looking back, what do you understand?') },
      { label: T('更大的意義', 'Bigger meaning'), hint: T('這個領悟如何影響你的未來？', 'How will this insight shape your future?') },
    ],
    starters: ['There is a … in my … that …', 'At the time, I believed …', 'What I did not understand then was …', 'Looking back, …', 'I have learned that …', 'Now, when I …'],
    words: [350, 550],
    checklist: [
      T('我用具體的細節描述經驗。', 'I describe the experience with specific details.'),
      T('我清楚區分「當時」和「現在」的想法。', 'I clearly contrast what I thought then and what I think now.'),
      T('反思的部分至少和敘述一樣多。', 'My reflection is at least as developed as the story.'),
      T('我誠實地寫出自己的感受和錯誤。', 'I am honest about my feelings and mistakes.'),
      T('結尾說明這個領悟對未來的影響。', 'My ending explains how the insight affects my future.'),
      T('文句流暢，有適當的轉折語。', 'My writing flows with appropriate transitions.'),
    ],
    mentor: {
      title: 'The Ribbon in My Drawer',
      text: `There is a blue ribbon in my desk drawer that I am not proud of. It says "First Place, Science Fair," and I won it in sixth grade for a project about how music affects plant growth. My plants grew beautifully. My results were impressive. And most of the work was done by my father.\n\nAt the time, I did not think of it as cheating. My father is an engineer, and when I struggled to build the light stand, he offered to help. Then he helped with the graphs. Then he rewrote my conclusion "to make it sound more scientific." Each step felt small. When the judges asked me questions, I repeated words I barely understood, and they nodded. When my name was announced, I smiled for the photo, but my stomach felt heavy.\n\nWhat I did not understand then was that the ribbon would mean nothing to me. Every time I opened the drawer, it reminded me not of what I had accomplished but of what I had avoided: the frustration of figuring things out myself. Meanwhile, a classmate named Iris had won third place with a wobbly cardboard model of a water filter. She had explained every part of it with excitement, including the parts that did not work. I remember being jealous of her, not because of her ribbon, but because she clearly owned what she had made.\n\nLooking back, I realize that I had confused winning with learning. The goal of a science fair is not to produce perfect results; it is to ask a question and wrestle with it. By accepting so much help, I had skipped the most valuable part of the experience.\n\nThis year, I entered the science fair again. My project, which tested different materials for keeping ice from melting, was messy. Two of my trials failed, and my graph was hand-drawn. I did not place at all. Yet when a judge asked why one material worked better than another, I answered without hesitating, because I had spent three weekends finding out.\n\nI have learned that real confidence comes from doing the hard parts yourself. The blue ribbon is still in my drawer, but I keep it there now as a reminder, not a trophy.`,
      note: T('用一個具體的物品（藍色緞帶）開頭並在結尾呼應；清楚對比「當時」與「現在」的想法；誠實面對自己的錯誤；反思的篇幅和敘述一樣多；結尾說出領悟，而不是只說「我學到教訓了」。', 'A concrete object (the ribbon) opens and closes the essay. The writer clearly contrasts then and now, is honest about a mistake, gives the reflection as much space as the story, and ends with a specific insight rather than "I learned my lesson."'),
    },
    vocab: ['at the time', 'what I did not understand then', 'meanwhile', 'looking back', 'I realize', 'I have learned', 'now'],
  },
  {
    id: 'w8-compare-two-ways',
    grade: 8,
    genre: 'compare',
    std: 'CCSS W.8.2',
    title: T('比較與對照：兩種方式', 'Compare and contrast: Two approaches'),
    topics: [T('在教室學習和看線上影片學習', 'learning in a classroom and learning from online videos'), T('一個神話和一個現代故事', 'a myth and a modern story with the same theme'), T('兩個面對相同問題的角色', 'two characters who face the same problem'), T('兩篇報導同一事件的新聞', 'two news articles about the same event'), T('紙本筆記和電子筆記', 'taking notes by hand and on a laptop'), T('團體運動和個人運動', 'team sports and individual sports')],
    prompt: T('寫一篇比較與對照的文章，分析「{t}」。說明兩者的相同與不同，用證據支持，並提出一個關於兩者關係的洞見。', 'Write a compare-and-contrast essay analyzing {t}. Explain how they are alike and different, support each point with evidence, and offer an insight about the relationship between them.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('你的洞見：各有長處？互補？其中一個較好？', 'Your insight: each has strengths? They complement each other?') },
      { label: T('相同點', 'Similarities'), hint: T('兩者共有的目標或特點。', 'Shared goals or features.') },
      { label: T('不同點一', 'Difference 1'), hint: T('用 whereas／in contrast。', 'Use whereas / in contrast.') },
      { label: T('不同點二', 'Difference 2'), hint: T('最重要的差異。', 'The most important difference.') },
      { label: T('結論', 'Conclusion'), hint: T('這個比較讓我們學到什麼？', 'What does the comparison teach us?') },
    ],
    starters: ['At first glance, … and … seem …', 'Both … and …', 'Whereas …, …', 'In contrast, …', 'Similarly, …', 'The most significant difference …', 'Ultimately, …'],
    words: [350, 550],
    checklist: [
      T('論點提出一個關於兩者關係的洞見。', 'My thesis offers an insight about how the two relate.'),
      T('我同時討論相同點和不同點。', 'I discuss both similarities and differences.'),
      T('每一點都有具體的例子或證據。', 'Each point has specific examples or evidence.'),
      T('組織方式一致（分塊或逐點）。', 'My organization is consistent (block or point-by-point).'),
      T('我用了 whereas、similarly、in contrast 等轉折語。', 'I used transitions such as whereas, similarly and in contrast.'),
      T('結論說明比較的意義。', 'My conclusion explains the significance of the comparison.'),
    ],
    mentor: {
      title: 'Teacher or Tutorial?',
      text: `When I wanted to learn how to solve equations with variables on both sides, I had two choices: ask my math teacher, Mr. Okafor, or search for a video online. I tried both. At first glance, a classroom lesson and an online tutorial seem like two versions of the same thing. However, a closer look shows that they work best for different purposes, and that the strongest learners use them together.\n\nBoth classrooms and online videos share the same basic goal: to explain an idea clearly enough that a student can use it. Both rely on examples, and both usually move from simple problems to harder ones. In addition, both can be excellent or terrible depending on the person teaching.\n\nThe first major difference is control over pace. In a video, I can pause, rewind, and watch a tricky step five times without anyone noticing. Whereas a video waits for me, a classroom keeps moving. Mr. Okafor has thirty students, so he cannot stop for every question, and sometimes I hesitate to raise my hand. For practicing a skill I almost understand, the video's flexibility is a real advantage.\n\nThe most significant difference, however, is feedback. A video cannot see my mistakes. When I watched a tutorial, I nodded along, but when I tried the homework, I kept making the same error with negative signs. In class, Mr. Okafor walked past my desk, glanced at my paper, and pointed to the exact line where I went wrong. He then asked me to explain my thinking out loud, which helped me understand why the rule works instead of just memorizing it. A video can show me the right answer, but a teacher can show me my wrong one.\n\nIn addition, classrooms offer something videos cannot: other learners. When my classmate explained her method to our table, I learned a shortcut that no tutorial had mentioned.\n\nUltimately, the question is not whether teachers or tutorials are better. Videos are ideal for review and practice at my own speed, while teachers are irreplaceable for catching mistakes and deepening understanding. The smartest approach is to use each one for what it does best.`,
      note: T('論點提出洞見（兩者用途不同、應該一起用）；先寫相同點再寫不同點，最重要的差異放最後；用個人經驗當證據；用 whereas、however、ultimately 表示關係；結論回答「所以呢？」。', 'The thesis offers an insight (they serve different purposes and work best together). Similarities come first, and the most significant difference comes last. Personal experience serves as evidence, transitions like whereas, however and ultimately show relationships, and the conclusion answers "so what?"'),
    },
    vocab: ['at first glance', 'both', 'whereas', 'in contrast', 'similarly', 'the most significant difference', 'ultimately'],
  },
];

// ================= PROMPTS: GRADE 9 =================
const P9 = [
  {
    id: 'w9-argument-essay',
    grade: 9,
    genre: 'argument',
    std: 'CCSS W.9-10.1',
    title: T('議論文：處理一個有爭議的問題', 'Argument essay: Take on a debatable issue'),
    topics: [T('高中應該把理財課列為必修', 'requiring a personal finance course in high school'), T('社群媒體應該規定 16 歲以上才能使用', 'a minimum age of sixteen for social media'), T('學生可以用 AI 工具寫作業', 'allowing students to use AI tools for homework'), T('市中心禁止私家車進入', 'banning private cars from city centers'), T('大學入學不再要求標準化考試', 'making standardized tests optional for college admission'), T('學校全面禁用手機', 'a full-day phone ban at school')],
    prompt: T('針對「{t}」寫一篇議論文。提出精確的主張，與反方主張清楚區分；公平地呈現主張和反方的優缺點，用充分的證據支持；最後寫出從論證中自然推出、說明意義的結論。', 'Write an argument essay about {t}. Introduce a precise claim, distinguish it from opposing claims, develop claims and counterclaims fairly with sufficient evidence, and end with a conclusion that follows from the argument and explains its significance.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('吸引句、背景、精確的論點句。', 'Hook, context and a precise thesis.') },
      { label: T('論點一＋證據', 'Claim 1 + evidence'), hint: T('最有說服力的證據，加上分析。', 'Your strongest evidence, with analysis.') },
      { label: T('論點二＋證據', 'Claim 2 + evidence'), hint: T('不同類型的證據（數據、專家、例子）。', 'A different kind of evidence (data, expert, example).') },
      { label: T('反方論點', 'Counterclaim'), hint: T('公平呈現最強的反方論點及其道理。', 'Present the strongest opposing argument fairly.') },
      { label: T('反駁', 'Rebuttal'), hint: T('指出反方的限制，或提出更好的解決方式。', 'Show its limits or offer a better solution.') },
      { label: T('結論', 'Conclusion'), hint: T('說明更大的意義：為什麼重要？', 'Explain the larger significance: why it matters.') },
    ],
    starters: ['Most teenagers will … long before …', 'Schools should … because …', 'Consider …', 'This evidence suggests that …', 'Opponents contend that …', 'Admittedly, … Nevertheless, …', 'Ultimately, …'],
    words: [400, 650],
    checklist: [
      T('論點句精確，並和反方主張有所區別。', 'My thesis is precise and distinct from opposing claims.'),
      T('每個論點都有充分、可信的證據和分析。', 'Each claim has sufficient, credible evidence and analysis.'),
      T('我公平地呈現最強的反方論點，再有力地反駁。', 'I present the strongest counterclaim fairly, then rebut it.'),
      T('我用句子和段落之間的轉折語連結想法（Admittedly、Nevertheless、Consequently）。', 'Transitions link sentences and sections (Admittedly, Nevertheless, Consequently).'),
      T('全文維持正式、客觀的語氣。', 'I maintain a formal, objective tone.'),
      T('結論從論證推出，並說明意義。', 'My conclusion follows from the argument and explains its significance.'),
      T('句子有平行結構，沒有逗號拼接。', 'My sentences use parallel structure and contain no comma splices.'),
    ],
    mentor: {
      title: 'Money Matters: Why High Schools Should Require Personal Finance',
      text: `Most teenagers will sign a phone contract, open a bank account, and receive their first paycheck long before they turn twenty. Yet many will do so without ever being taught how interest works or how to read the fine print. High schools should require a semester-long personal finance course because financial decisions made in early adulthood have long-lasting consequences, and schools are the only place where every student can learn these skills equally.\n\nConsider how early financial choices compound over time. A student who learns to save even a small amount each month at sixteen benefits from decades of compound interest. In contrast, a young adult who carries a credit card balance can end up paying far more than the original purchase price. These are not abstract math problems; they shape whether a person can afford a car, an apartment, or further education. A course that explains budgeting, credit, and interest gives students the tools to make informed choices before mistakes become expensive.\n\nFurthermore, a required course promotes fairness. Some students learn about money at the kitchen table from parents who work in finance or who have time to explain their decisions. Others never have that conversation. When personal finance is optional or absent, financial knowledge becomes another advantage passed down through families. By requiring the course, schools ensure that every graduate leaves with the same basic understanding, regardless of background.\n\nOpponents contend that the school day is already crowded and that adding a requirement would take time away from core subjects such as history or science. This concern deserves attention; instructional time is limited. Nevertheless, personal finance can strengthen core skills rather than replace them. Calculating interest reinforces algebra, comparing loan offers requires careful reading, and analyzing advertisements builds critical thinking. Several states have already added a finance requirement without eliminating other subjects, often by replacing an elective or blending the content into existing math courses.\n\nOthers argue that families, not schools, should teach money management. Ideally, both would. However, relying on families alone leaves too many students unprepared, and the consequences of that gap fall hardest on those with the fewest resources.\n\nUltimately, financial literacy is not a luxury; it is a survival skill in a world of loans, subscriptions, and digital payments. A single required course could help an entire generation avoid costly mistakes and build secure futures. Schools prepare students for tests every year. They should also prepare students for life.`,
      note: T('論點句精確，並預告兩個主要理由；證據分析說明「為什麼重要」；回應兩種反方論點，先承認（This concern deserves attention）再用 Nevertheless 反駁；結尾用平行句（prepare for tests / prepare for life）說明更大的意義。', 'The thesis is precise and previews two main reasons. Analysis explains why each piece of evidence matters. Two counterclaims are answered, first conceded ("This concern deserves attention") and then rebutted with "Nevertheless". The conclusion uses parallel sentences (prepare for tests / prepare for life) to show the larger significance.'),
    },
    vocab: ['consider', 'in contrast', 'furthermore', 'opponents contend', 'admittedly', 'nevertheless', 'consequently', 'ultimately'],
  },
  {
    id: 'w9-informative-complex',
    grade: 9,
    genre: 'informative',
    std: 'CCSS W.9-10.2',
    title: T('說明文：解釋一個複雜的概念', 'Informative essay: Explain a complex idea'),
    topics: [T('推薦演算法如何決定你看到的影片', 'how recommendation algorithms decide what you watch'), T('複利如何運作', 'how compound interest works'), T('天氣和氣候的差別', 'the difference between weather and climate'), T('免疫系統如何對抗感染', 'how the immune system fights infection'), T('供需如何決定價格', 'how supply and demand set prices'), T('疫苗如何訓練身體', 'how vaccines train the body')],
    prompt: T('寫一篇說明文，向九年級的同學解釋「{t}」。把複雜的概念拆成清楚的部分，使用精確的術語、具體的例子和比喻，並寫出說明這個概念為什麼重要的結論。', 'Write an informative essay that explains {t} to a ninth-grade audience. Break the complex idea into clear parts, use precise terms, concrete examples and analogies, and end with a conclusion about why the idea matters.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('從讀者熟悉的經驗開始，預告要解釋的部分。', 'Start from a familiar experience; preview the parts.') },
      { label: T('部分一', 'Part 1'), hint: T('定義關鍵術語。', 'Define the key term.') },
      { label: T('部分二', 'Part 2'), hint: T('它怎麼運作？用例子或比喻。', 'How does it work? Use an example or analogy.') },
      { label: T('部分三', 'Part 3'), hint: T('影響或常見的誤解。', 'Effects or a common misunderstanding.') },
      { label: T('結論', 'Conclusion'), hint: T('這個概念對讀者有什麼意義？', 'What does it mean for the reader?') },
    ],
    starters: ['If you have ever …, you have seen … at work.', 'At its core, … is …', 'To understand …, imagine …', 'In other words, …', 'This process explains why …', 'A common misconception is …', 'Understanding … allows us to …'],
    words: [400, 650],
    checklist: [
      T('引言從熟悉的經驗開始，並清楚預告內容。', 'My introduction starts from something familiar and previews the content.'),
      T('我把複雜的概念拆成有邏輯順序的部分。', 'I break the complex idea into logically ordered parts.'),
      T('術語都有定義，並用精確的字詞。', 'Key terms are defined, and my vocabulary is precise.'),
      T('我用了具體的例子和至少一個比喻。', 'I used concrete examples and at least one analogy.'),
      T('段落之間的轉折讓關係清楚。', 'Transitions make the relationships between parts clear.'),
      T('語氣正式、客觀。', 'My tone is formal and objective.'),
      T('結論說明這個概念為什麼重要。', 'My conclusion explains why the idea matters.'),
    ],
    mentor: {
      title: 'Why Your Feed Knows You: How Recommendation Algorithms Work',
      text: `If you have ever watched one cooking video and then found your screen filled with recipes, you have seen a recommendation algorithm at work. Video platforms, music apps, and online stores all use these systems to predict what each user will want next. Although they can seem almost magical, recommendation algorithms follow a fairly simple logic: they collect data about behavior, look for patterns among similar users, and keep adjusting their predictions based on how people respond.\n\nAt its core, an algorithm is a set of step-by-step instructions that a computer follows to solve a problem. A recommendation algorithm's problem is choosing which few items, out of millions, to show a particular person. To do this, it begins by collecting data. Every click, like, search, and skip becomes a clue. Even the amount of time a user spends watching a video before scrolling away tells the system something about that person's interests.\n\nNext, the algorithm looks for patterns. One common method, called collaborative filtering, compares users who behave in similar ways. To understand this, imagine a library where the librarian notices that people who borrow mystery novels by one author often borrow books by a second author as well. If you check out the first author, the librarian will hand you the second. The algorithm does the same thing, except that it compares millions of people at once and updates its suggestions in seconds.\n\nFinally, the system learns from feedback. If a user watches a recommended video to the end, the algorithm treats that as a success and recommends similar content. If the user skips it, the algorithm adjusts. In other words, every action a person takes trains the system to predict that person's behavior a little more accurately.\n\nThis process explains both the strengths and the risks of recommendation systems. On the positive side, they help people discover music, books, and ideas they might never have found on their own. However, because algorithms are usually designed to keep users engaged, they tend to recommend more of whatever already holds a person's attention. A common misconception is that the feed shows a neutral picture of what is popular. In reality, it shows a personalized picture shaped by past behavior, which can narrow the range of views a person encounters.\n\nUnderstanding how recommendation algorithms work allows users to take back some control. By searching for new topics, clearing their history, or simply noticing why a suggestion appeared, people can make sure that their feed reflects their curiosity rather than only their habits.`,
      note: T('從讀者熟悉的經驗開頭；論點句預告三個部分（蒐集資料、找模式、從回饋學習）；術語（algorithm、collaborative filtering）都有定義；用「圖書館員」的比喻解釋抽象概念；結論給讀者實際的建議。', 'The essay opens with a familiar experience, and the thesis previews three parts (collect data, find patterns, learn from feedback). Key terms are defined, a librarian analogy makes an abstract method concrete, and the conclusion gives readers something useful to do.'),
    },
    vocab: ['at its core', 'in other words', 'to understand this, imagine', 'next', 'finally', 'this explains why', 'a common misconception', 'in reality'],
  },
  {
    id: 'w9-narrative-fiction',
    grade: 9,
    genre: 'narrative',
    std: 'CCSS W.9-10.3',
    title: T('短篇小說：複雜的角色與選擇', 'Short story: A complex character and a hard choice'),
    topics: [T('在忠誠和誠實之間的選擇', 'a choice between loyalty and honesty'), T('兩個意見不同的兄弟姊妹', 'two siblings who disagree about something important'), T('一個知道你名字的陌生人', 'a stranger who knows your name'), T('一座停電後的城市', 'a city after the lights go out'), T('被迫重過一次的一天', 'a day that repeats itself'), T('一封寄錯的信', 'a letter delivered to the wrong person')],
    prompt: T('寫一篇關於「{t}」的短篇小說。塑造一個有內心衝突的角色，用多種敘事技巧（對話、節奏、描寫、多條情節線、倒敘等）製造張力，安排情節讓結局有說服力，並用精確的字詞和感官語言。', 'Write a short story about {t}. Develop a character with an inner conflict, use several narrative techniques (dialogue, pacing, description, reflection, multiple plot lines or flashback) to build tension, sequence events so the resolution feels earned, and use precise words and sensory language.'),
    plan: [
      { label: T('角色與內心衝突', 'Character + inner conflict'), hint: T('他／她想要什麼？害怕什麼？', 'What does the character want and fear?') },
      { label: T('場景與開頭', 'Setting + opening'), hint: T('用一個具體的畫面進入故事。', 'Enter the story with a concrete image.') },
      { label: T('張力升高', 'Rising tension'), hint: T('外在事件逼角色面對內心衝突。', 'Outside events force the inner conflict.') },
      { label: T('抉擇（高潮）', 'The choice (climax)'), hint: T('放慢節奏，讓讀者感受到代價。', 'Slow down so readers feel the cost.') },
      { label: T('結局與反思', 'Resolution + reflection'), hint: T('選擇的後果，以及角色的改變。', 'The consequence and how the character changed.') },
    ],
    starters: ['The … had been … for … when …', 'She knew before she …', '"…," he said, and the word hung …', 'For a long moment, …', 'Later, she would remember …', 'It was not until … that …'],
    words: [400, 650],
    checklist: [
      T('主角有清楚的內心衝突（想要 vs. 害怕、忠誠 vs. 誠實…）。', 'My main character has a clear inner conflict.'),
      T('我用了至少三種敘事技巧（對話、節奏、描寫、反思、倒敘…）。', 'I used at least three narrative techniques.'),
      T('情節的安排製造張力，結局有說服力。', 'Events are sequenced to build tension, and the resolution feels earned.'),
      T('我用精確的字詞、細節和感官語言。', 'I used precise words, telling details and sensory language.'),
      T('觀點和時態一致。', 'Point of view and tense are consistent.'),
      T('結局讓讀者思考，而不是直接說教。', 'The ending invites reflection instead of preaching.'),
    ],
    mentor: {
      title: 'The Answer Key',
      text: `The answer key had been lying on the floor of Room 214 for less than a minute when Lena saw it. It must have slipped out of Ms. Alvarez's folder as she rushed into the hallway to deal with a fire drill that turned out to be a false alarm. The page was face up. At the top, in bold letters, it said "Chemistry Final, Version A."\n\nLena knew before she bent down to pick it up that she should not look. She looked anyway. Only for a second. But a second was long enough to see the first three answers: C, A, D.\n\n"What is that?" asked Marco from the doorway.\n\nLena folded the paper in half so quickly that the crease felt like a confession. Marco was her lab partner and the closest thing she had to a best friend this year. He was also failing chemistry. If he failed the final, he would lose his spot on the soccer team, and soccer was the only reason he still came to school on Mondays.\n\n"Nothing," she said. Then, because he was still staring, "It is the answer key."\n\nThe word hung in the empty classroom. Marco stepped closer. His face did something complicated: hope first, then guilt, then a kind of tired anger, as if he were annoyed with the universe for testing him.\n\n"Nobody would know," he said quietly.\n\nFor a long moment, Lena did not answer. Out the window, students were streaming back across the parking lot, laughing about the false alarm. She thought about the nights she had spent memorizing reactions, the flashcards rubber-banded in her backpack. She thought about Marco at practice, the way he lit up when the coach called his name. Both things felt true. Both things felt like they mattered.\n\n"I would know," she said finally. "And so would you."\n\nShe walked to the teacher's desk and slid the folded key under the stapler, where Ms. Alvarez would find it. Marco did not say anything. He just sat down at their lab table and stared at the periodic table on the wall.\n\nThat afternoon, Lena found him in the library with his chemistry textbook open to the first chapter.\n\n"I have four days," he said without looking up. "You know balancing equations better than anyone. Will you help me?"\n\nLena pulled out a chair. It was not until much later, after the final grades were posted and Marco had passed by three points, that she realized she had never been choosing between honesty and friendship. She had been choosing what kind of friend to be.`,
      note: T('開頭直接丟出衝突（地上的答案卷）；角色的內心掙扎用細節呈現（摺紙的折痕像「自白」、窗外的人群）；對話很少但份量重；高潮放慢節奏；結尾的反思把「誠實 vs. 友情」重新定義，讓主題自然出現。', 'The opening drops the reader straight into the conflict. The inner struggle is shown through telling details (a crease "like a confession", students outside the window). Dialogue is sparse but weighty, the climax slows down, and the final reflection reframes the choice so the theme emerges on its own.'),
    },
    vocab: ['before she', 'for a long moment', 'finally', 'that afternoon', 'it was not until', 'later'],
  },
  {
    id: 'w9-literary-analysis',
    grade: 9,
    genre: 'literary',
    std: 'CCSS W.9-10.9a',
    title: T('文學分析：作者如何發展主題', 'Literary analysis: How the author develops a theme'),
    topics: [T('反諷（irony）', 'irony'), T('象徵（symbolism）', 'symbolism'), T('角色的發展', 'character development'), T('敘事觀點', 'point of view'), T('故事的結構（開頭與結尾的安排）', 'structure (how the story begins and ends)')],
    prompt: T('選一篇你讀過的短篇小說或小說，分析作者如何用「{t}」發展主題。寫出精確的論點，選擇最有力的原文證據，自然地融入引文，並深入分析作者的寫作選擇。', 'Choose a short story or novel you have read and analyze how the author uses {t} to develop a theme. State a precise thesis, select the strongest textual evidence, integrate quotations smoothly, and analyze the author\'s choices in depth.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('作者、篇名、背景，論點說出技巧和主題。', 'Author, title, context; thesis names the technique and the theme.') },
      { label: T('證據一＋分析', 'Evidence 1 + analysis'), hint: T('融入引文，分析作者的選擇。', "Integrate a quotation; analyze the author's choice.") },
      { label: T('證據二＋分析', 'Evidence 2 + analysis'), hint: T('這個選擇如何推進主題？', 'How does this choice develop the theme?') },
      { label: T('證據三＋分析', 'Evidence 3 + analysis'), hint: T('結局或轉折點。', 'The ending or turning point.') },
      { label: T('結論', 'Conclusion'), hint: T('主題的意義與作者技巧的效果。', "The theme's significance and the technique's effect.") },
    ],
    starters: ['In "…," … uses … to suggest that …', 'From the opening line, …', 'The word "…" suggests …', 'By describing … as "…," the author …', 'This irony reveals …', 'In the end, …'],
    words: [400, 650],
    checklist: [
      T('論點說出作者的技巧和它發展的主題。', 'My thesis names the technique and the theme it develops.'),
      T('我選擇最有力、最相關的原文證據。', 'I chose the strongest, most relevant textual evidence.'),
      T('引文自然地融入我的句子，文法正確。', 'Quotations are woven grammatically into my sentences.'),
      T('分析聚焦在作者的選擇（字詞、結構、觀點）及其效果。', "Analysis focuses on the author's choices and their effects."),
      T('我用現在式，語氣正式。', 'I use present tense and a formal tone.'),
      T('結論說明主題的意義。', "My conclusion explains the theme's significance."),
    ],
    mentor: {
      title: 'The Wisdom of Foolish Gifts: Irony in "The Gift of the Magi"',
      text: `O. Henry's "The Gift of the Magi" tells the story of Della and Jim, a young couple so poor that Della has saved only "one dollar and eighty-seven cents" to buy her husband a Christmas present. To afford worthy gifts, each secretly sells the one possession they treasure most, only to discover that the sacrifice has made the other's gift useless. Through this carefully built situational irony, O. Henry suggests that the true value of a gift lies in the love and sacrifice behind it rather than in the object itself.\n\nFrom the opening line, O. Henry establishes how little the couple has. The story begins with Della counting her coins, and the narrator stresses that "that was all." By emphasizing their poverty, O. Henry makes the couple's later sacrifices feel enormous. When Della sells her long, beautiful hair, which the narrator says would have made a queen's jewels look poor, she is not giving up something trivial. She is giving up the one thing that makes her feel rich.\n\nThe irony becomes complete when the gifts are exchanged. Della buys Jim a platinum chain for his treasured gold watch, and Jim buys Della a set of expensive combs for her hair. However, Jim has sold his watch to buy the combs. In a single moment, both gifts lose their practical purpose. O. Henry could have ended the story in sadness, yet Jim responds calmly and suggests that they put their presents away for a while. His reaction shows that the couple understands what matters: each has proved how much the other is loved.\n\nFinally, the narrator's closing comments turn the irony into a lesson. He compares the couple to the magi, the wise men who brought gifts to the infant Jesus, and admits that he has told the story of "two foolish children." Then he reverses that judgment, declaring that "of all who give gifts these two were the wisest." The word "foolish" describes how their choices look from the outside, while "wisest" describes what those choices mean. By placing these words side by side, O. Henry asks readers to measure gifts not by their usefulness but by the love they express.\n\nIn the end, the irony of "The Gift of the Magi" is not cruel but generous. The gifts fail, but the giving succeeds. O. Henry's story reminds readers that the most valuable presents cannot be bought, because they are made of what we are willing to give up for someone else.`,
      note: T('論點同時點出技巧（情境反諷）和主題；引文短而精準，並融入句子裡（"one dollar and eighty-seven cents"）；分析聚焦作者的選擇（開頭的安排、foolish 和 wisest 的並列）；結論用對比句（gifts fail / giving succeeds）說明主題。', 'The thesis names both the technique (situational irony) and the theme. Short, precise quotations are woven into the sentences. The analysis focuses on the author\'s choices, such as the opening and the pairing of "foolish" with "wisest", and the conclusion uses a contrast ("the gifts fail, but the giving succeeds") to state the theme.'),
    },
    vocab: ['the author suggests', 'by emphasizing', 'this irony reveals', 'however', 'in a single moment', 'finally', 'in the end'],
  },
  {
    id: 'w9-research-mla',
    grade: 9,
    genre: 'research',
    std: 'CCSS W.9-10.7',
    title: T('研究報告（MLA 格式）', 'Research paper with MLA citations'),
    topics: [T('塑膠微粒', 'microplastics'), T('青少年睡眠與健康', 'teen sleep and health'), T('城市農園', 'urban farming'), T('蜜蜂數量減少', 'the decline of honeybees'), T('電動車的電池', 'electric vehicle batteries'), T('社群媒體與青少年心理健康', 'social media and teen mental health')],
    prompt: T('針對「{t}」寫一篇研究報告。提出聚焦的研究問題，綜合多個可靠的資料來源，用 MLA 格式在文中註明出處，並附上參考書目（Works Cited）。', 'Write a research paper about {t}. Ask a focused research question, synthesize several credible sources, use MLA in-text citations, and include a Works Cited list.'),
    plan: [
      { label: T('研究問題＋論點', 'Question + thesis'), hint: T('你的研究問題和綜合後的答案。', 'Your question and your synthesized answer.') },
      { label: T('背景', 'Background'), hint: T('定義主題，說明為什麼值得研究。', 'Define the topic; explain why it matters.') },
      { label: T('發現一（多個來源）', 'Finding 1 (multiple sources)'), hint: T('綜合兩個來源的資訊。', 'Combine information from two sources.') },
      { label: T('發現二', 'Finding 2'), hint: T('數據、專家意見，加 MLA 引用。', 'Data and expert views with MLA citations.') },
      { label: T('不同觀點或限制', 'Debate or limits'), hint: T('研究者之間有什麼不同意見？', 'Where do researchers disagree?') },
      { label: T('結論＋Works Cited', 'Conclusion + Works Cited'), hint: T('回答問題，指出未來方向。', 'Answer the question; point to next steps.') },
    ],
    starters: ['Research question: …', 'According to …, … (Author page).', '… argues that …', 'Similarly, …', 'However, other researchers caution that …', 'Taken together, these sources suggest …', 'Works Cited'],
    words: [400, 650],
    checklist: [
      T('研究問題聚焦，論點回答了它。', 'My research question is focused, and my thesis answers it.'),
      T('我綜合了多個可靠來源，而不是一個一個摘要。', 'I synthesized several credible sources instead of summarizing them one by one.'),
      T('每個引用和改寫都有正確的 MLA 文內引用。', 'Every quotation and paraphrase has a correct MLA in-text citation.'),
      T('引文自然地融入我的句子。', 'Quotations are integrated smoothly.'),
      T('我呈現了不同觀點或研究的限制。', 'I addressed different views or the limits of the research.'),
      T('結論回答研究問題；有 Works Cited。', 'My conclusion answers the question, and I include Works Cited.'),
    ],
    mentor: {
      title: 'Small Particles, Big Questions: Microplastics',
      text: `Research question: How do microplastics form, and what do scientists know about their effects?\n\nPlastic does not disappear; it breaks apart. Over time, bottles, bags, and synthetic clothing fibers split into fragments smaller than five millimeters, known as microplastics. These particles have been found in oceans, soil, drinking water, and even the air. Although scientists agree that microplastics are now nearly everywhere, they are still investigating how harmful the particles are. The research so far suggests that microplastics pose clear risks to wildlife, while their effects on human health remain uncertain.\n\nMicroplastics come from two main sources. Some are manufactured to be small, such as the plastic beads once common in face scrubs. Most, however, are "secondary" microplastics that form when larger items are broken down by sunlight, waves, and friction (Alvarez 14). Laundry is a surprising source as well. Synthetic fabrics such as polyester shed tiny fibers in every wash, and many of these fibers pass through treatment plants into rivers (Nguyen and Park 52).\n\nThe evidence of harm to wildlife is strong. Researchers have documented microplastics in the stomachs of fish, seabirds, and even plankton, the tiny organisms at the base of the ocean food web. According to marine biologist Sofia Alvarez, animals that fill their stomachs with plastic "feel full while starving," which can weaken growth and reproduction (22). Similarly, a review of laboratory studies found that some marine species exposed to high concentrations of microplastics showed reduced feeding and slower growth (Okafor et al. 108).\n\nThe effects on humans are less clear. Microplastics have been detected in seafood, bottled water, and table salt, so people almost certainly consume them. However, other researchers caution that most studies have used much higher doses than people normally encounter, and that long-term effects are difficult to measure (Nguyen and Park 61). In other words, scientists know that exposure is happening but do not yet know what level of exposure, if any, is dangerous.\n\nTaken together, these sources suggest that microplastics are a serious environmental problem that deserves action even before every question is answered. Reducing single-use plastics, using washing machine filters, and improving water treatment can all limit how many particles enter the environment. Further research will reveal more about human risks, but the evidence from wildlife is already clear enough to act.\n\nWorks Cited\nAlvarez, Sofia. Plastic Seas. Harbor Press, 2023.\nNguyen, Linh, and Daniel Park. "Fibers in the Flow." Journal of Water Studies, vol. 18, no. 2, 2024, pp. 45-70.\nOkafor, Grace, et al. "Microplastic Exposure in Marine Species." Ocean Science Review, vol. 9, 2022, pp. 101-15.`,
      note: T('研究問題和論點放在最前面；每個段落綜合多個來源（Alvarez 和 Nguyen and Park）；示範各種 MLA 格式：一位作者 (Alvarez 14)、兩位作者、三位以上 (et al.)、引導語後只寫頁碼 (22)；呈現研究的不確定性。注意：這篇範文的書目是虛構的示範，你的報告必須使用真實的資料來源。', 'The question and thesis come first. Paragraphs synthesize several sources, and the essay models each MLA pattern: one author (Alvarez 14), two authors, three or more (et al.), and page-only after a signal phrase (22). It also presents the uncertainty in the research. Note: the sources in this model are invented examples; your paper must use real sources.'),
    },
    vocab: ['according to', 'argues that', 'similarly', 'however, other researchers caution', 'in other words', 'taken together', 'further research'],
  },
  {
    id: 'w9-compare-texts',
    grade: 9,
    genre: 'compare',
    std: 'CCSS W.9-10.9a',
    title: T('比較兩個文本', 'Comparing two texts'),
    topics: [T('兩首主題相同的詩', 'two poems on a similar subject'), T('一本小說和它改編的電影', 'a novel and its film adaptation'), T('兩位領袖的演講', "two leaders' speeches"), T('兩個做出相反選擇的角色', 'two characters who make opposite choices'), T('對同一問題的兩種解決方案', 'two proposed solutions to the same problem')],
    prompt: T('比較並對照「{t}」。分析兩者如何處理相同的主題或問題，說明作者的選擇造成什麼不同的效果，並提出一個關於兩者關係的洞見。', 'Compare and contrast {t}. Analyze how each treats a similar theme or problem, explain how the authors\' choices create different effects, and offer an insight about how the two relate.'),
    plan: [
      { label: T('引言＋論點', 'Introduction + thesis'), hint: T('兩者是什麼？你的洞見是什麼？', 'What are the two texts, and what is your insight?') },
      { label: T('共同點', 'Common ground'), hint: T('相同的主題、情境或意象。', 'A shared theme, situation or image.') },
      { label: T('差異一', 'Difference 1'), hint: T('語氣、結構或觀點的差別，附引文。', 'Tone, structure or viewpoint, with quotations.') },
      { label: T('差異二', 'Difference 2'), hint: T('這個差異造成什麼效果？', 'What effect does the difference create?') },
      { label: T('結論', 'Conclusion'), hint: T('一起讀時，兩者告訴我們什麼？', 'What do they reveal when read together?') },
    ],
    starters: ['Both … and … explore …', 'Whereas …, …', 'In contrast, …', 'This difference in … creates …', 'Read together, the two texts suggest …', 'Ultimately, …'],
    words: [400, 650],
    checklist: [
      T('論點提出關於兩者關係的洞見，而不只是「有同有異」。', 'My thesis offers an insight, not just "they are alike and different".'),
      T('每一段都同時討論兩個文本。', 'Each paragraph discusses both texts.'),
      T('我引用原文，並分析作者的選擇。', "I quote both texts and analyze the authors' choices."),
      T('我用 whereas、similarly、in contrast 等轉折語。', 'I use transitions such as whereas, similarly and in contrast.'),
      T('我說明差異造成的效果。', 'I explain the effects created by the differences.'),
      T('結論說明一起閱讀兩者的意義。', 'My conclusion explains what reading the texts together reveals.'),
    ],
    mentor: {
      title: 'Two Roads, Two Woods: Choice in Robert Frost',
      text: `Robert Frost's poems "The Road Not Taken" and "Stopping by Woods on a Snowy Evening" both place a lone traveler at a quiet moment in the woods. In each poem, the speaker pauses, looks into the trees, and then makes a decision. Yet the two poems treat choice in very different ways. Whereas "The Road Not Taken" focuses on how people tell the story of their choices afterward, "Stopping by Woods" focuses on the pull between personal desire and responsibility in the present moment. Read together, they suggest that every choice involves both a sacrifice and a story we tell ourselves about it.\n\nThe poems share a setting and a situation. Both speakers travel alone through a forest, and both use simple, regular rhymes that give the poems a calm, almost conversational sound. In "The Road Not Taken," the speaker stands where "two roads diverged in a yellow wood." In "Stopping by Woods," the speaker stops his horse to watch the woods "fill up with snow." In each case, the woods become a place where ordinary travel pauses and a decision must be made.\n\nThe poems differ, however, in when they look at the choice. "The Road Not Taken" moves forward in time. The speaker admits that the two roads were worn "really about the same," but imagines that years from now he will tell the story "with a sigh" and claim that he took the road "less traveled by." This contrast suggests that the importance of a choice may come less from the choice itself than from the meaning we later give it.\n\nIn contrast, "Stopping by Woods" stays fixed in the present. The speaker is drawn to the woods, which he describes as "lovely, dark and deep." For a moment, he seems tempted to remain in the quiet beauty. Then he remembers that he has "promises to keep." The repeated final line, "And miles to go before I sleep," slows the ending and makes his duty feel heavy and real. The choice here is not about which path to take but about whether to stay or keep going.\n\nUltimately, the two poems complement each other. "Stopping by Woods" shows the moment of choosing, when desire and duty pull in different directions. "The Road Not Taken" shows what happens afterward, when we shape our choices into stories. Together, Frost's poems remind readers that every path we take also leaves another one behind.`,
      note: T('論點提出洞見（兩首詩一起讀時的意義）；先寫共同點，再寫兩個差異（看選擇的時間點）；每段都同時談兩首詩，簡短的引文自然融入句子；結論說明兩首詩如何「互補」。', 'The thesis offers an insight about reading the poems together. Common ground comes first, then two differences (when each poem looks at the choice). Every paragraph discusses both poems with short, integrated quotations, and the conclusion explains how the poems complement each other.'),
    },
    vocab: ['both', 'whereas', 'in contrast', 'similarly', 'this contrast suggests', 'read together', 'ultimately'],
  },
  {
    id: 'w9-rhetorical-speech',
    grade: 9,
    genre: 'argument',
    std: 'CCSS W.9-10.1',
    title: T('修辭演講稿', 'Rhetorical speech'),
    topics: [T('向市議會爭取青少年的需求', 'a speech to the city council about a need of local teens'), T('畢業典禮致詞', 'a graduation speech for your middle school'), T('為一個你相信的公益目標發聲', 'a speech for a cause you believe in'), T('說服同學去投票或參與', 'a speech persuading classmates to get involved'), T('表揚一位社區英雄', 'a speech honoring a community hero')],
    prompt: T('寫一篇演講稿：「{t}」。清楚考慮你的聽眾，結合訴諸人格（ethos）、訴諸情感（pathos）和訴諸理性（logos），並使用修辭技巧（排比、重複、修辭問句、對比）讓訊息有力而難忘。', 'Write {t}. Consider your audience carefully, combine appeals to credibility (ethos), emotion (pathos) and logic (logos), and use rhetorical devices (parallelism, repetition, rhetorical questions, contrast) to make your message powerful and memorable.'),
    plan: [
      { label: T('聽眾與目的', 'Audience + purpose'), hint: T('誰在聽？你希望他們做什麼？', 'Who is listening, and what should they do?') },
      { label: T('開頭（ethos）', 'Opening (ethos)'), hint: T('你是誰？為什麼值得聽？', 'Who are you, and why should they listen?') },
      { label: T('理性訴求（logos）', 'Logic (logos)'), hint: T('事實、數據、因果推理。', 'Facts, data, cause-and-effect reasoning.') },
      { label: T('情感訴求（pathos）', 'Emotion (pathos)'), hint: T('一個真實的故事或畫面。', 'A real story or image.') },
      { label: T('修辭高潮與呼籲', 'Rhetorical climax + call'), hint: T('排比、重複，明確的行動呼籲。', 'Parallelism, repetition and a clear call to action.') },
    ],
    starters: ['Good evening, members of …', 'My name is …, and I have …', 'Consider these numbers: …', 'Let me tell you about …', 'We can … We can … We can …', 'Not because …, but because …', 'Tonight, I ask you to …'],
    words: [400, 650],
    checklist: [
      T('開頭建立可信度，並抓住聽眾注意力。', 'My opening establishes credibility and grabs attention.'),
      T('我結合了 ethos、pathos 和 logos。', 'I combine ethos, pathos and logos.'),
      T('我至少用了兩種修辭技巧（排比、重複、問句、對比）。', 'I use at least two rhetorical devices.'),
      T('語言適合我的聽眾和場合。', 'My language fits the audience and occasion.'),
      T('我預先回應聽眾可能的疑慮。', "I anticipate the audience's concerns."),
      T('結尾有清楚而難忘的行動呼籲。', 'I end with a clear, memorable call to action.'),
    ],
    mentor: {
      title: 'A Place to Belong: Remarks to the City Council',
      text: `Good evening, members of the city council. My name is Daniel Osei. I am a ninth grader at Riverside High School, I have lived in this city my whole life, and tonight I am speaking for the hundreds of teenagers who are not in this room because they have nowhere else to go after school.\n\nI am here to ask you to fund a teen center in the empty building on Fourth Street.\n\nConsider these numbers. Our city has eleven playgrounds for young children and three senior centers for older adults. It has zero spaces designed for teenagers. Between three and six o'clock on a school day, many teens are home alone or wandering the streets, and youth workers often describe those hours as the riskiest of the day. A teen center would turn those empty hours into opportunities: homework help, job training, music, sports, and simply a safe place to be.\n\nLet me tell you about my friend Kayla. Last year, her mother started working a night shift. Kayla did not want to sit alone in an empty apartment, so she spent her afternoons at the bus station because it was warm and had free Wi-Fi. She is one of the smartest people I know, but her grades fell, and she stopped believing that anyone noticed. Kayla did not need a lecture. She needed a door that was open.\n\nSome of you may be wondering how the city can afford this. It is a fair question, and I have done my homework. The building on Fourth Street already belongs to the city. Two local businesses have offered to donate computers, and the community college has offered student volunteers to tutor. What is missing is your decision.\n\nA teen center is not a luxury. It is a library for students who need help with algebra. It is a gym for students who need to burn off a hard day. It is a studio for students who have something to say. And for some, it will be the first place where an adult asks, "How are you, really?"\n\nWe can keep telling teenagers to stay out of trouble. Or we can give them somewhere better to be. We can complain about what young people do with their time. Or we can invest in what they could do with it.\n\nTonight, I ask you to vote yes. Not because teenagers are a problem to be solved, but because we are a part of this city worth investing in. Open the doors on Fourth Street, and we will walk through them.`,
      note: T('開頭說出身分和在地經驗建立 ethos；數據（11 個遊樂場、0 個青少年空間）是 logos；Kayla 的故事是 pathos；預先回應「錢從哪裡來」；用排比（It is a library… It is a gym…）和對比（We can… Or we can…）製造高潮；結尾的 Not because…but because… 讓訊息難忘。', 'The opening builds ethos with identity and local experience. Numbers (eleven playgrounds, zero teen spaces) provide logos, and Kayla\'s story provides pathos. The speaker anticipates the cost question, builds to a climax with parallelism ("It is a library… It is a gym…") and contrast ("We can… Or we can…"), and ends with a memorable "Not because… but because…".'),
    },
    vocab: ['consider', 'let me tell you', 'it is a fair question', 'not because… but because', 'we can… or we can', 'tonight, I ask you'],
  },
  {
    id: 'w9-formal-letter',
    grade: 9,
    genre: 'letter',
    std: 'CCSS W.9-10.1',
    title: T('正式信函：寫給決策者', 'Formal letter to a decision-maker'),
    topics: [T('寫給市長，關於大眾運輸', 'to your mayor about public transportation'), T('寫給校長，關於心理健康日', 'to your principal about mental health days'), T('寫給一家公司，關於過度包裝', 'to a company about wasteful packaging'), T('寫給議員，關於圖書館經費', 'to a state representative about library funding'), T('寫給教育委員會，關於上學時間', 'to the school board about school start times')],
    prompt: T('寫一封正式信函，主題是「{t}」。使用正確的商業信函格式，清楚說明問題，提出具體可行的建議，用證據支持，並以尊重、專業的語氣請求對方採取行動。', 'Write a formal letter {t}. Use correct business-letter format, explain the problem clearly, propose a specific, realistic solution supported by evidence, and request action in a respectful, professional tone.'),
    plan: [
      { label: T('格式', 'Format'), hint: T('日期、收件人、稱呼（Dear …:）。', 'Date, recipient, greeting (Dear …:).') },
      { label: T('目的', 'Purpose'), hint: T('第一段就說出你是誰、為什麼寫信。', 'Who you are and why you are writing, right away.') },
      { label: T('問題與證據', 'Problem + evidence'), hint: T('具體的事實和例子。', 'Specific facts and examples.') },
      { label: T('建議的解決方案', 'Proposed solution'), hint: T('具體、可行，並回應可能的顧慮。', 'Specific, realistic; address likely concerns.') },
      { label: T('請求行動＋結尾', 'Request + closing'), hint: T('明確的下一步；Sincerely, 簽名', 'A clear next step; Sincerely, signature.') },
    ],
    starters: ['Dear …:', 'I am writing to request …', 'As a student who …, I have noticed …', 'For example, …', 'I propose that …', 'I understand that …; however, …', 'Thank you for considering …', 'Sincerely,'],
    words: [300, 500],
    checklist: [
      T('格式正確：日期、收件人、稱呼、正文、結尾敬語、簽名。', 'Correct format: date, recipient, greeting, body, closing, signature.'),
      T('第一段清楚說明寫信的目的。', 'The first paragraph states my purpose clearly.'),
      T('我用具體的證據說明問題。', 'I explain the problem with specific evidence.'),
      T('我的建議具體、可行，並回應可能的顧慮。', 'My proposal is specific, realistic and addresses concerns.'),
      T('語氣尊重、專業，沒有抱怨或指責。', 'My tone is respectful and professional, not complaining or blaming.'),
      T('結尾提出明確的請求並致謝。', 'I end with a clear request and thanks.'),
    ],
    mentor: {
      title: 'Letter to Mayor Chen',
      text: `March 4, 2026\n\nThe Honorable Laura Chen\nMayor of Brookfield\n100 Main Street\nBrookfield\n\nDear Mayor Chen:\n\nI am writing to request that the city extend the Route 9 bus to the Eastside Community College stop and add two evening trips on weekdays. As a ninth grader who takes Route 9 every day, I have seen how the current schedule limits students and workers in our neighborhood.\n\nAt present, Route 9 ends at Pine Avenue, nearly two kilometers from the college. Students who take evening classes must either walk along a road with no sidewalk or pay for a ride. In addition, the last bus leaves downtown at 6:15 p.m. My older sister, who works at a grocery store until 7:00, often waits forty minutes for a ride or walks home in the dark. When I asked classmates about their families, many described the same problem.\n\nI propose two changes. First, extend Route 9 by three stops so that it reaches the college entrance. Second, add departures at 7:15 and 8:15 p.m. on weekdays. These changes would connect our neighborhood to education and jobs, reduce traffic near the college, and give families a safer way to travel after dark.\n\nI understand that new service costs money and that the city must consider its budget carefully. However, the college has expressed interest in sharing costs for routes that serve its students, and a pilot program for one semester would allow the city to measure demand before making a permanent decision.\n\nI respectfully ask that you place this proposal on the agenda for the next transportation committee meeting. I would be glad to share a petition signed by more than 150 riders and to speak at the meeting if that would be helpful.\n\nThank you for your time and for your service to Brookfield.\n\nSincerely,\nMaya Torres\nGrade 9, Brookfield High School`,
      note: T('完整的正式信函格式；第一段就說出具體的請求；用具體的距離、時間和家人的經驗當證據；建議具體可行（三站、兩班車）；先承認預算考量，再提出分攤成本和試辦計畫；結尾提出明確的下一步。', 'Complete business-letter format; the request is specific from the first paragraph; distances, times and family experience serve as evidence; the proposal is concrete (three stops, two trips); the budget concern is acknowledged and answered with cost-sharing and a pilot; the letter ends with a clear next step.'),
    },
    vocab: ['I am writing to request', 'at present', 'in addition', 'I propose', 'I understand that', 'however', 'I respectfully ask', 'sincerely'],
  },
  {
    id: 'w9-personal-essay',
    grade: 9,
    genre: 'personal',
    std: 'CCSS W.9-10.3',
    title: T('個人散文：一個說出你是誰的故事', 'Personal essay: A story that shows who you are'),
    topics: [T('一個代表你的物品', 'an object that tells your story'), T('一次你發現自己錯了的經驗', 'a time you realized you were wrong'), T('一個塑造了你的地方', 'a place that shaped you'), T('你家的一個傳統', 'a tradition in your family'), T('一個你仍在努力克服的挑戰', 'a challenge you are still working through'), T('一個改變你的問題', 'a question that changed you')],
    prompt: T('寫一篇個人散文，主題是「{t}」。用一個具體的故事展現你的個性和價值觀，結合敘述和反思，結尾說出這段經驗對你的意義。', 'Write a personal essay about {t}. Use a specific story to reveal your character and values, blend narration with reflection, and end by showing what the experience means to you.'),
    plan: [
      { label: T('開頭的畫面', 'Opening image'), hint: T('從一個具體的時刻或物品開始。', 'Begin with a specific moment or object.') },
      { label: T('故事', 'The story'), hint: T('發生了什麼？選最能說明你的細節。', 'What happened? Choose details that reveal you.') },
      { label: T('轉變', 'The shift'), hint: T('你的想法在哪裡改變了？', 'Where did your thinking change?') },
      { label: T('反思', 'Reflection'), hint: T('這說明了你是怎樣的人？', 'What does this reveal about who you are?') },
      { label: T('結尾', 'Ending'), hint: T('回到開頭的畫面，帶著新的意義。', 'Return to the opening image with new meaning.') },
    ],
    starters: ['On the top shelf of my closet sits …', 'For years, I believed …', 'I did not realize it then, but …', 'What I learned was not …, but …', 'I am still …', 'Now, when I look at …, I see …'],
    words: [400, 650],
    checklist: [
      T('開頭用一個具體的畫面或時刻。', 'I open with a specific image or moment.'),
      T('故事的細節能展現我的個性和價值觀。', 'Story details reveal my character and values.'),
      T('敘述和反思交織，而不是最後才加一句教訓。', 'Narration and reflection are woven together, not a moral tacked on at the end.'),
      T('我的聲音真誠、自然。', 'My voice sounds honest and natural.'),
      T('結尾呼應開頭，並帶出新的意義。', 'My ending echoes the opening with new meaning.'),
      T('句子長短變化，用字精確。', 'I vary sentence length and use precise words.'),
    ],
    mentor: {
      title: 'The Unfinished Quilt',
      text: `On the top shelf of my closet sits a quilt that is exactly half finished. Sixteen squares are stitched together in neat rows of blue and yellow. The other sixteen are still loose, folded in a shoebox with a spool of thread and a note in my grandmother's handwriting: "Your turn."\n\nMy grandmother started the quilt the summer I turned twelve. She had been a seamstress in Manila before she moved here, and her hands moved so quickly that the needle seemed to flash. I sat beside her on the porch, supposedly learning, but mostly scrolling on my phone. Sewing felt slow and old-fashioned. When she asked me to try a square, I made three crooked stitches, pricked my finger, and gave up.\n\n"It is not supposed to be easy," she said, laughing. "That is why it lasts."\n\nThat fall, her eyesight began to fail, and she could no longer thread a needle. The quilt went into the shoebox. For two years, I did not think about it. I was busy with things that felt more important: tests, friends, a robotics team that took up every weekend.\n\nThen, last winter, my grandmother moved in with us. One evening, I found her holding the shoebox in her lap, running her fingers over the finished squares as if she were reading them. She did not ask me to finish the quilt. She did not have to.\n\nI started that night. My first square took four hours. The corners did not match, and I had to pull out the thread twice. My grandmother sat beside me, unable to see the stitches but able to hear my frustration. "Slower," she kept saying. "Feel where the needle wants to go."\n\nI did not realize it then, but I was learning more than sewing. I have always been someone who wants to be good at things immediately. If I could not master something quickly, I moved on to something I could. The quilt refused to let me. Each square demanded patience, and each mistake had to be undone by hand.\n\nI have finished four squares now. Twelve are still in the shoebox. Some nights I work for an hour; some nights I do not touch it at all. But I have stopped measuring the quilt by how much is left. My grandmother was right: the slowness is the point.\n\nNow, when I look at that half-finished quilt, I do not see something incomplete. I see a conversation between her hands and mine, one stitch at a time, that neither of us is in a hurry to end.`,
      note: T('開頭用一個具體的物品（半完成的被子）和一句話（Your turn）；故事中的細節展現作者的個性（想立刻學會、容易放棄）；反思穿插在敘述中；結尾回到被子，賦予它新的意義（兩代人之間的對話）。', 'A concrete object (the half-finished quilt) and a short note ("Your turn") open the essay. Story details reveal the writer\'s character (wanting instant mastery, giving up easily). Reflection is woven through the narration, and the ending returns to the quilt with new meaning: a conversation between two generations.'),
    },
    vocab: ['for years', 'I did not realize it then', 'that fall', 'then, last winter', 'I have learned', 'now, when I'],
  },
];

export default { skills: [...G7, ...G8, ...G9], prompts: [...P7, ...P8, ...P9] };
