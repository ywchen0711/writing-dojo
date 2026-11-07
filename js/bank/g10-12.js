// Grades 10–12: CCSS W/L 9–10 and 11–12, SAT/ACT Writing & Language style edits, AP English Language
// (rhetoric, synthesis, argument) and AP English Literature (grade 12). See SPEC.md.
import { T, NAMES, words, ansTap, ansChoice, ansOrder } from '../util.js';

const MALE = ['Max', 'Leo', 'Jay', 'Noah', 'Ethan', 'Ben', 'Ryan', 'Owen', 'Lucas', 'Mateo', 'Kenji', 'Omar', 'Arjun', 'Daniel'];
const FEMALE = ['Mia', 'Emma', 'Ava', 'Lily', 'Zoe', 'Chloe', 'Grace', 'Ella', 'Ruby', 'Nora', 'Priya', 'Sofia', 'Mei', 'Amara'];
const PEOPLE = [...NAMES, 'Priya', 'Mateo', 'Kenji', 'Amara', 'Omar', 'Sofia', 'Mei', 'Arjun', 'Hana', 'Daniel'];

// replace {A} {B} {C} {he} … in every string of a nested item
function subst(x, v) {
  if (typeof x === 'string') return x.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
  if (Array.isArray(x)) return x.map((y) => subst(y, v));
  if (x && typeof x === 'object') { const o = {}; for (const k in x) o[k] = subst(x[k], v); return o; }
  return x;
}
const cast = (r) => { const s = r.sample(PEOPLE, 3); return { A: s[0], B: s[1], C: s[2] }; };
const say = (o) => (typeof o === 'string' ? T(`正確答案：${o}`, `Answer: ${o}`) : T(`正確答案：${o.zh}`, `Answer: ${o.en}`));

// a choice skill drawn from a bank of items { q?, text?, right, wrong: [...], why: T, why2?: T }
function bankSkill(meta, items, { q, hint, n = 3 } = {}) {
  return {
    ...meta,
    gen(r) {
      const it = subst(r.pick(items), cast(r));
      const wrong = r.sample(it.wrong, Math.min(n, it.wrong.length));
      const out = { q: it.q || q, ans: ansChoice([it.right, ...wrong]), sol: [it.why, ...(it.why2 ? [it.why2] : []), say(it.right)] };
      if (it.text) out.text = it.text;
      if (hint) out.hint = hint;
      return out;
    },
  };
}

// a sentence with one slot [[good|bad1|bad2]]: plant a bad form, return the tokens and the index to tap
function plantSlot(r, s) {
  const m = s.match(/\[\[(.+?)\]\]/), opts = m[1].split('|');
  const bad = r.pick(opts.slice(1));
  const k = words(s.replace(m[0], '\u0001')).findIndex((t) => t.includes('\u0001'));
  return { toks: words(s.replace(m[0], bad)), k, good: s.replace(m[0], opts[0]), bad, right: opts[0] };
}
const bare = (w) => w.replace(/^[^\w']+|[^\w']+$/g, '');

// sources for citation drills (all invented)
const AUTH = [['Okafor', 'Amara'], ['Lindqvist', 'Erik'], ['Torres', 'Maya'], ['Nakamura', 'Ren'], ['Haddad', 'Layla'], ['Petrov', 'Ivan'], ['Mensah', 'Kwame'], ['Castillo', 'Lucia'], ['Brennan', 'Siobhan'], ['Iyer', 'Rohan']];
const BOOKS = [['The Quiet Engine: How Rivers Shaped Cities', 'Harbor Press'], ['Signals in the Static: A History of Radio', 'Northfield Books'], ['Salt and Stone: Life on the Coast', 'Meridian House'], ['The Patient Garden', 'Juniper Press'], ['Counting Stars: Women in Early Astronomy', 'Lantern Books'], ['Bridges We Built', 'Copper Hill Press']];
const ARTS = [['Why Teenagers Need More Sleep', 'Science Weekly', 'teen-sleep'], ['The Return of the Night Train', 'Travel Ledger', 'night-trains'], ['Can Cities Learn to Cool Themselves?', 'Urban Review', 'cool-cities'], ['The Hidden Cost of Fast Fashion', 'Market Watch Review', 'fast-fashion'], ['What Octopuses Know', 'Ocean Notes', 'octopus-minds']];
const MON = [['Jan.', 'January'], ['Feb.', 'February'], ['Mar.', 'March'], ['Apr.', 'April'], ['May', 'May'], ['June', 'June'], ['July', 'July'], ['Aug.', 'August'], ['Sept.', 'September'], ['Oct.', 'October'], ['Nov.', 'November'], ['Dec.', 'December']];
// APA sentence case: capitalize only the first word and the first word after a colon
const sc = (t) => t.split(' ').map((w, i, a) => (i === 0 || /:$/.test(a[i - 1]) ? w : w.toLowerCase())).join(' ');
const endP = (t) => (/[?!]$/.test(t) ? '' : '.');
function source(r) {
  const [last, first] = r.pick(AUTH), yr = r.int(2012, 2024);
  if (r.chance(0.5)) { const [title, pub] = r.pick(BOOKS); return { kind: 'book', last, first, yr, title, pub }; }
  const [title, site, slug] = r.pick(ARTS), d = r.int(1, 28), mi = r.int(0, 11);
  return { kind: 'web', last, first, yr, title, site, d, mon: MON[mi], url: `www.${site.toLowerCase().replace(/ /g, '')}.org/${slug}` };
}
const mlaEntry = (s) => (s.kind === 'book' ? `${s.last}, ${s.first}. <i>${s.title}</i>. ${s.pub}, ${s.yr}.`
  : `${s.last}, ${s.first}. "${s.title}${endP(s.title)}" <i>${s.site}</i>, ${s.d} ${s.mon[0]} ${s.yr}, ${s.url}.`);
const apaEntry = (s) => (s.kind === 'book' ? `${s.last}, ${s.first[0]}. (${s.yr}). <i>${sc(s.title)}</i>. ${s.pub}.`
  : `${s.last}, ${s.first[0]}. (${s.yr}, ${s.mon[1]} ${s.d}). ${sc(s.title)}${endP(s.title)} <i>${s.site}</i>. https://${s.url}`);

// ======================================================================= GRADE 10
const PLANS = [['volunteering at the animal shelter', 'volunteer at the animal shelter'], ['learning to code in Python', 'learn to code in Python'], ['training for a half marathon', 'train for a half marathon'], ['reading three classic novels', 'read three classic novels'], ['taking a ceramics class', 'take a ceramics class'], ['visiting relatives in Taipei', 'visit relatives in Taipei'], ['practicing the guitar every morning', 'practice the guitar every morning'], ['working part-time at a bakery', 'work part-time at a bakery']];
const POLICY = [['reduce food waste', 'reducing food waste'], ['cut energy costs', 'cutting energy costs'], ['shorten lunch lines', 'shortening lunch lines'], ['support new teachers', 'supporting new teachers'], ['improve air quality in classrooms', 'improving air quality in classrooms'], ['expand the late bus service', 'expanding the late bus service'], ['protect student privacy', 'protecting student privacy']];
const CORREL = [
  { right: '{A} is not only a gifted violinist but also a patient tutor.', wrong: ['{A} is not only a gifted violinist but also tutors younger students patiently.', '{A} not only is a gifted violinist but also tutoring younger students.'] },
  { right: 'The debate team must either raise the money by May or cancel the trip.', wrong: ['The debate team must either raise the money by May or the trip will be canceled.', 'The debate team either must raise the money by May or canceling the trip.'] },
  { right: 'Writing a strong first draft is harder than revising a weak one.', wrong: ['Writing a strong first draft is harder than to revise a weak one.', 'To write a strong first draft is harder than revising of a weak one.'] },
  { right: '{A} would rather walk to school than ride the crowded bus.', wrong: ['{A} would rather walk to school than riding the crowded bus.', '{A} would rather walk to school than the crowded bus ride.'] },
  { right: 'The review praised the film both for its acting and for its music.', wrong: ['The review praised the film both for its acting and because the music was good.', 'The review praised the film both for its acting and it had good music.'] },
];

const g10 = [
  {
    id: 'g10-parallelism',
    grade: 10,
    unit: 'sentences',
    name: T('平行結構（複雜句）', 'Parallel structure in complex sentences'),
    std: 'CCSS L.9-10.1a',
    lesson: {
      zh: '列舉或比較的項目要用<b>相同的文法形式</b>：都是 -ing、都是不定詞（to + 原形）、都是名詞片語。成對連接詞（not only… but also、either… or、both… and）後面接的兩部分也要對稱。',
      en: 'Items in a list or comparison must share the <b>same grammatical form</b>: all -ing words, all infinitives, or all noun phrases. Paired conjunctions (not only… but also, either… or, both… and) must be followed by matching parts.',
      ex: ['The plan aims to <b>cut</b> costs, <b>save</b> energy, and <b>reduce</b> waste.', 'She is not only <b>a gifted violinist</b> but also <b>a patient tutor</b>.'],
    },
    gen(r) {
      const v = cast(r), mode = r.int(0, 2);
      let right, wrong, why;
      if (mode === 0) {
        const [a, b, c] = r.sample(PLANS, 3);
        right = `${v.A}'s plan for the summer includes ${a[0]}, ${b[0]}, and ${c[0]}.`;
        wrong = [`${v.A}'s plan for the summer includes ${a[0]}, ${b[0]}, and to ${c[1]}.`, `${v.A}'s plan for the summer includes ${a[0]}, to ${b[1]}, and ${c[0]}.`, `${v.A}'s plan for the summer includes ${a[0]}, ${b[0]}, and ${v.A} also wants to ${c[1]}.`];
        why = T('三個項目都要用 -ing 動名詞（volunteering、learning…），不能突然換成 to + 原形或一個子句。', 'All three items should be -ing phrases; switching to "to + verb" or a whole clause breaks the pattern.');
      } else if (mode === 1) {
        const [a, b, c] = r.sample(POLICY, 3);
        right = `The new policy aims to ${a[0]}, ${b[0]}, and ${c[0]}.`;
        wrong = [`The new policy aims to ${a[0]}, ${b[0]}, and ${c[1]}.`, `The new policy aims to ${a[0]}, ${b[1]}, and ${c[0]}.`, `The new policy aims to ${a[0]}, ${b[0]}, and it will also ${c[0]}.`];
        why = T('「aims to」後面的三個動作都要是原形動詞（reduce、cut、improve…）。', 'After "aims to," all three actions should be base verbs (reduce, cut, improve…).');
      } else {
        const it = subst(r.pick(CORREL), v);
        right = it.right; wrong = it.wrong;
        why = T('成對連接詞或比較（not only… but also、either… or、than）兩邊要用相同的文法形式。', 'Paired conjunctions and comparisons (not only… but also, either… or, than) need the same form on both sides.');
      }
      return {
        q: T('哪一個句子的平行結構正確？', 'Which sentence uses parallel structure correctly?'),
        ans: ansChoice([right, ...r.sample(wrong, 2)]),
        sol: [why, say(right)],
        hint: T('把列舉的項目一個個拿出來看：形式一樣嗎？', 'Pull out each listed item: do they all have the same form?'),
      };
    },
  },
  {
    id: 'g10-nonessential-commas',
    grade: 10,
    unit: 'mechanics',
    name: T('同位語與非限定子句的逗號', 'Commas with appositives and nonessential clauses'),
    std: 'CCSS L.9-10.2',
    lesson: {
      zh: '<b>非必要</b>的資訊（同位語、which 子句）拿掉後句意不變，要用<b>一對逗號</b>夾起來，兩個逗號缺一不可。<b>必要</b>的資訊（限定子句，常用 that 或 who）用來指出「是哪一個」，不加逗號。',
      en: '<b>Nonessential</b> information (an appositive or a "which" clause) can be removed without changing the meaning, so it is set off by a <b>pair of commas</b>—both are needed. <b>Essential</b> information tells you <i>which one</i>, so it takes no commas.',
      ex: ['My aunt<b>,</b> a marine biologist<b>,</b> studies coral reefs.', 'Students <b>who finish early</b> may leave. (only those students)'],
    },
    gen(r) {
      const v = cast(r);
      if (r.chance(0.5)) {
        const rel = r.pick(['mother', 'father', 'debate coach', 'piano teacher', 'best friend', 'chemistry teacher']);
        const ap = r.pick(['a retired civil engineer', 'an amateur astronomer', 'a former Olympic swimmer', 'a nurse at the city hospital', 'a volunteer firefighter', 'a lifelong chess player']);
        const vp = r.pick(['still designs model bridges on weekends', 'runs a podcast about local history', 'visits the class every spring', 'grows rare orchids in a tiny greenhouse', 'speaks four languages fluently', 'restores old bicycles for charity']);
        const right = `${v.A}'s ${rel}, ${ap}, ${vp}.`;
        const wrong = [`${v.A}'s ${rel}, ${ap} ${vp}.`, `${v.A}'s ${rel} ${ap}, ${vp}.`, `${v.A}'s ${rel}, ${ap}; ${vp}.`];
        return {
          q: T('哪一個句子的標點正確？', 'Which sentence is punctuated correctly?'),
          ans: ansChoice([right, ...r.sample(wrong, 2)]),
          sol: [T(`「${ap}」是同位語，補充說明這個人，拿掉後句子仍完整，所以前後各要一個逗號。`, `"${ap}" is an appositive—extra information about the person—so it needs a comma before AND after it.`), say(right)],
          hint: T('同位語要用「一對」逗號。', 'An appositive takes a pair of commas.'),
        };
      }
      const items = [
        { right: 'Students who finish the exam early may leave quietly.', wrong: ['Students, who finish the exam early, may leave quietly.', 'Students who finish the exam early, may leave quietly.'], why: T('「who finish the exam early」指出是哪些學生（不是全部），是必要資訊，不加逗號。', '"who finish the exam early" tells WHICH students (not all of them), so it is essential: no commas.') },
        { right: "The Pacific Ocean, which covers about a third of Earth's surface, is the largest ocean.", wrong: ["The Pacific Ocean which covers about a third of Earth's surface is the largest ocean.", "The Pacific Ocean, that covers about a third of Earth's surface, is the largest ocean."], why: T('太平洋只有一個，which 子句只是補充資訊，用一對逗號；非限定子句不可用 that。', 'There is only one Pacific Ocean, so the "which" clause is extra: set it off with commas. A nonessential clause never uses "that."') },
        { right: 'The novel that we read in September is still my favorite.', wrong: ['The novel, that we read in September, is still my favorite.', 'The novel that we read in September, is still my favorite.'], why: T('「that we read in September」指出是哪一本小說，是限定子句，不加逗號。', '"that we read in September" identifies WHICH novel, so it is essential: no commas.') },
        { right: 'Mount Everest, which climbers first summited in 1953, attracts hundreds of expeditions a year.', wrong: ['Mount Everest which climbers first summited in 1953 attracts hundreds of expeditions a year.', 'Mount Everest, which climbers first summited in 1953 attracts hundreds of expeditions a year.'], why: T('聖母峰只有一座，which 子句是補充，前後都要逗號。', 'There is only one Mount Everest, so the "which" clause is extra information and needs a comma on each side.') },
        { right: 'Drivers who text behind the wheel are far more likely to crash.', wrong: ['Drivers, who text behind the wheel, are far more likely to crash.', 'Drivers who text behind the wheel, are far more likely to crash.'], why: T('加了逗號就變成「所有駕駛都會傳簡訊」。這裡只指傳簡訊的駕駛，是必要資訊。', 'With commas, the sentence would claim that ALL drivers text. The clause limits which drivers, so no commas.') },
        { right: "{A}'s grandparents' house, which was built in 1920, has a wide front porch.", wrong: ["{A}'s grandparents' house which was built in 1920, has a wide front porch.", "{A}'s grandparents' house, which was built in 1920 has a wide front porch."], why: T('那棟房子已經確定是哪一棟，建造年份只是補充，前後都要逗號。', 'We already know which house; the year it was built is extra, so it needs commas on both sides.') },
        { right: 'The scientist who discovered the comet will speak at our school.', wrong: ['The scientist, who discovered the comet, will speak at our school.', 'The scientist who discovered the comet, will speak at our school.'], why: T('「who discovered the comet」告訴我們是哪一位科學家，是必要資訊，不加逗號。', '"who discovered the comet" tells us WHICH scientist, so it is essential: no commas.') },
      ];
      return bankSkill({}, items, { q: T('哪一個句子的標點正確？', 'Which sentence is punctuated correctly?'), hint: T('拿掉那個子句，句子還指同一個東西嗎？', 'Remove the clause: does the sentence still point to the same thing?') }).gen(r);
    },
  },
  bankSkill({
    id: 'g10-semicolon-colon-dash',
    grade: 10,
    unit: 'mechanics',
    name: T('分號、冒號、破折號', 'Semicolon vs. colon vs. dash'),
    std: 'CCSS L.9-10.2a',
    lesson: {
      zh: '<b>分號 ;</b> 連接兩個完整句子（或分隔本身含逗號的項目）。<b>冒號 :</b> 前面必須是完整句子，後面接清單、解釋或例子；不要放在動詞後面。<b>破折號 —</b> 用來強調或插入，插入語要用一對破折號。',
      en: 'A <b>semicolon</b> joins two complete sentences (or separates list items that contain commas). A <b>colon</b> must follow a complete sentence and introduces a list, explanation, or example—never put it right after a verb. A <b>dash</b> adds emphasis; an interruption takes a pair of dashes.',
      ex: ['The power failed<b>;</b> the generator started a minute later.', 'The trip requires three things<b>:</b> a passport, a jacket, and good shoes.', 'The proposal<b>—</b>despite its flaws<b>—</b>passed.'],
    },
  }, [
    { right: 'The trip requires three things: a passport, a rain jacket, and comfortable shoes.', wrong: ['The trip requires three things; a passport, a rain jacket, and comfortable shoes.', 'The trip requires: a passport, a rain jacket, and comfortable shoes.'], why: T('完整句子之後用冒號引出清單；分號後面必須是完整句子；冒號不能直接放在動詞後面。', 'Use a colon after a complete sentence to introduce a list. A semicolon needs a full sentence after it, and a colon never follows a verb directly.') },
    { right: '{A} studied for hours; nevertheless, the final exam felt difficult.', wrong: ['{A} studied for hours, nevertheless, the final exam felt difficult.', '{A} studied for hours nevertheless, the final exam felt difficult.'], why: T('兩個完整句子用 nevertheless 連接時，前面要分號、後面要逗號；只用逗號是 comma splice。', 'When "nevertheless" links two complete sentences, put a semicolon before it and a comma after it. A comma alone is a comma splice.') },
    { right: 'Only one obstacle stood between the team and the title—a well-rested opponent.', wrong: ['Only one obstacle stood between the team and the title; a well-rested opponent.', 'Only one obstacle stood between the team and the title, and a well-rested opponent.'], why: T('破折號可以在句尾帶出強調的名詞片語；分號後面不能只是一個片語。', 'A dash can introduce an emphatic phrase at the end. A semicolon cannot be followed by a mere phrase.') },
    { right: 'The tour stops in Austin, Texas; Denver, Colorado; and Portland, Oregon.', wrong: ['The tour stops in Austin, Texas, Denver, Colorado, and Portland, Oregon.', 'The tour stops in: Austin, Texas; Denver, Colorado; and Portland, Oregon.'], why: T('清單的項目本身含逗號時，項目之間改用分號；介係詞 in 後面不加冒號。', 'When list items already contain commas, separate the items with semicolons. Never put a colon after "in."') },
    { right: 'The proposal—despite its many flaws—passed by a single vote.', wrong: ['The proposal—despite its many flaws, passed by a single vote.', 'The proposal; despite its many flaws; passed by a single vote.'], why: T('插入語用一對破折號（或一對逗號），不能一邊破折號一邊逗號；分號不能夾片語。', 'An interruption takes a matching pair of dashes (or commas)—not one of each. Semicolons cannot enclose a phrase.') },
    { right: '{A} had one goal for the season: to qualify for the state meet.', wrong: ['{A} had one goal for the season; to qualify for the state meet.', '{A} had: one goal for the season, to qualify for the state meet.'], why: T('前面是完整句子，後面解釋那個目標，用冒號；分號後面要完整句子。', 'A complete sentence followed by an explanation of "one goal" calls for a colon; a semicolon would need a full sentence after it.') },
    { right: 'The power went out at 9 p.m.; the generator started a minute later.', wrong: ['The power went out at 9 p.m., the generator started a minute later.', 'The power went out at 9 p.m.; and the generator started a minute later.'], why: T('兩個完整句子可用分號連接；只用逗號是 comma splice；分號後面不需要 and。', 'A semicolon can join two complete sentences. A comma alone makes a comma splice, and a semicolon does not need "and."') },
    { right: 'The museum is closed on Mondays; however, it stays open late on Fridays.', wrong: ['The museum is closed on Mondays, however, it stays open late on Fridays.', 'The museum is closed on Mondays: however it stays open late on Fridays.'], why: T('however 連接兩個完整句子：前面分號、後面逗號。', '"However" joining two complete sentences takes a semicolon before it and a comma after it.') },
    { right: '{A} and {B} disagreed about only one thing: whether the club should charge dues.', wrong: ['{A} and {B} disagreed about only one thing; whether the club should charge dues.', '{A} and {B} disagreed about: only one thing, whether the club should charge dues.'], why: T('冒號前是完整句子，後面說明「那一件事」是什麼。', 'The colon follows a complete sentence and explains what the "one thing" was.') },
    { right: "{A}'s speech had a single message—never stop asking questions.", wrong: ["{A}'s speech had a single message; never stop asking questions.", "{A}'s speech had—a single message, never stop asking questions."], why: T('破折號強調句尾的那個訊息；分號在這裡不對，破折號也不能放在動詞和受詞之間。', 'The dash spotlights the message at the end. A semicolon is wrong here, and a dash cannot split a verb from its object.') },
  ], { q: T('哪一個句子的標點正確？', 'Which sentence is punctuated correctly?'), hint: T('分號兩邊都要是完整句子；冒號前面要是完整句子。', 'A semicolon needs full sentences on both sides; a colon needs a full sentence before it.') }),
  {
    id: 'g10-its-whose-plural',
    grade: 10,
    unit: 'words',
    name: T('所有格與縮寫：its/it\'s、whose/who\'s、companies\'', "Possessives vs. contractions: its/it's, whose/who's, companies'"),
    std: 'CCSS L.9-10.2c',
    lesson: {
      zh: '<b>it\'s = it is</b>，<b>its</b> 是「它的」。<b>who\'s = who is</b>，<b>whose</b> 是「誰的」。<b>they\'re = they are</b>，<b>their</b> 是「他們的」。複數名詞的所有格：companies → <b>companies\'</b>（撇號放在 s 後面）。',
      en: "<b>It's = it is</b>; <b>its</b> shows ownership. <b>Who's = who is</b>; <b>whose</b> shows ownership. <b>They're = they are</b>; <b>their</b> shows ownership. A plural noun ending in s takes the apostrophe after the s: <b>the companies'</b> profits.",
      ex: ['The team changed <b>its</b> logo. <b>It\'s</b> a bold design.', 'The two <b>companies\'</b> leaders met.'],
    },
    gen(r) {
      const v = cast(r), org = r.pick(['company', 'museum', 'team', 'orchestra', 'library', 'hospital', 'university', 'bakery']);
      const orgs = /y$/.test(org) ? org.slice(0, -1) + 'ies' : org + 's';
      const TPL = [
        [`The ${org} updated [[its|it's]] website after hundreds of complaints.`, T('「它的網站」要用所有格 its；it\'s 是 it is。', '"Its website" shows ownership, so use "its"; "it\'s" means "it is."')],
        [`Everyone agrees that [[it's|its]] too late to change the schedule.`, T('這裡的意思是 it is too late，要用縮寫 it\'s。', 'The meaning is "it is too late," so the contraction "it\'s" is needed.')],
        [`${v.A} is the student [[whose|who's]] essay won the regional contest.`, T('「誰的作文」是所有格，用 whose；who\'s 是 who is。', '"Whose essay" shows ownership; "who\'s" means "who is."')],
        [`[[Who's|Whose]] presenting first, ${v.A} or ${v.B}?`, T('意思是 Who is presenting first，要用 Who\'s。', 'The meaning is "Who is presenting first," so use "Who\'s."')],
        [`Both [[${orgs}'|${org}'s|${orgs}]] budgets were cut this year.`, T(`Both 表示兩個（複數），複數所有格是 ${orgs}'。`, `"Both" means more than one, so the plural possessive is "${orgs}'."`)],
        [`${v.A} and ${v.B} forgot [[their|there|they're]] lab goggles in the gym.`, T('「他們的護目鏡」要用所有格 their。', '"Their goggles" shows ownership, so use "their."')],
        [`[[They're|Their|There]] hoping the rain stops before the game.`, T('意思是 They are hoping，要用 They\'re。', 'The meaning is "They are hoping," so use "They\'re."')],
        [`If [[you're|your]] interested, the robotics club meets on Thursdays.`, T('意思是 If you are interested，要用 you\'re。', 'The meaning is "If you are interested," so use "you\'re."')],
        [`The three [[${orgs}'|${org}'s]] directors met to discuss the merger.`, T(`three 表示三個，複數所有格是 ${orgs}'。`, `"Three" means more than one, so the plural possessive is "${orgs}'."`)],
        [`The [[children's|childrens'|childrens]] section of the library reopened last week.`, T('children 本身就是複數，所有格直接加 \'s：children\'s。', '"Children" is already plural, so its possessive is "children\'s."')],
        [`Every spring the ${org} holds [[its|it's]] largest fundraiser of the year.`, T('「它的募款活動」是所有格，用 its。', '"Its fundraiser" shows ownership, so use "its."')],
      ];
      const [s, why] = r.pick(TPL), p = plantSlot(r, s);
      return {
        q: T('點出用錯的那個字。', 'Tap the word that is used incorrectly.'),
        ans: ansTap(p.toks, p.k),
        sol: [why, T(`正確的句子：${p.good}`, `Corrected: ${p.good}`)],
        hint: T('把縮寫還原（it\'s → it is）唸唸看，通順嗎？', 'Expand any contraction (it\'s → it is): does the sentence still make sense?'),
      };
    },
  },
  {
    id: 'g10-literary-present',
    grade: 10,
    unit: 'grammar',
    name: T('文學現在式：時態一致', 'Verb tense consistency: the literary present'),
    std: 'CCSS L.9-10.1',
    lesson: {
      zh: '寫文學分析時，描述作品中的情節要用<b>現在式</b>（literary present），因為故事每次被閱讀時都「正在發生」。同一段裡不要忽然換成過去式。',
      en: 'When you write about literature, describe what happens in the work in the <b>present tense</b> (the literary present)—the story "happens" every time someone reads it. Do not slip into the past tense.',
      ex: ['In <i>Macbeth</i>, the witches <b>predict</b> that Macbeth will be king, and his ambition <b>grows</b>.', 'Scout <b>watches</b> her father and slowly <b>learns</b> what courage requires.'],
    },
    gen(r) {
      const items = [
        'In To Kill a Mockingbird, Scout {{watches|watched}} her father defend Tom Robinson and slowly {{learns|learned}} what courage requires.',
        'In The Odyssey, Odysseus {{spends|spent}} ten years trying to return home, and he {{relies|relied}} on cunning more than strength.',
        'In Romeo and Juliet, Friar Laurence {{agrees|agreed}} to marry the young couple because he {{hopes|hoped}} to end the feud.',
        'In Of Mice and Men, George {{protects|protected}} Lennie, yet he {{knows|knew}} their dream may never come true.',
        'In Lord of the Flies, Ralph {{blows|blew}} the conch to call a meeting, and the boys {{elect|elected}} him chief.',
        'In Macbeth, the witches {{predict|predicted}} that Macbeth will be king, and his ambition {{grows|grew}} quickly.',
        'In Frankenstein, Victor {{creates|created}} a living being but {{abandons|abandoned}} it the moment it opens its eyes.',
        'In Things Fall Apart, Okonkwo {{fears|feared}} looking weak, so he {{rules|ruled}} his household harshly.',
        'In A Raisin in the Sun, Walter {{dreams|dreamed}} of opening a business, while Mama {{wants|wanted}} a house with a garden.',
        'In The Great Gatsby, Gatsby {{throws|threw}} lavish parties because he {{hopes|hoped}} Daisy will attend one.',
        'In Antigone, Antigone {{defies|defied}} Creon and {{buries|buried}} her brother, even though she {{knows|knew}} the punishment.',
        'In Fahrenheit 451, Montag {{steals|stole}} a book from a burning house and {{begins|began}} to question his job.',
      ];
      const s = r.pick(items), slots = [...s.matchAll(/\{\{(\w+)\|(\w+)\}\}/g)], j = r.int(0, slots.length - 1);
      let i = 0;
      const marked = s.replace(/\{\{(\w+)\|(\w+)\}\}/g, (m, a, b) => (i++ === j ? '\u0001' + b : a));
      const toks = words(marked), k = toks.findIndex((t) => t.includes('\u0001'));
      const good = s.replace(/\{\{(\w+)\|(\w+)\}\}/g, (m, a) => a);
      return {
        q: T('這是一句文學分析。點出時態不一致的動詞。', 'This sentence is from a literary analysis. Tap the verb that breaks the tense.'),
        ans: ansTap(toks.map((t) => t.replace('\u0001', '')), k),
        sol: [T(`「${slots[j][2]}」是過去式；描述作品情節要用文學現在式，應改為「${slots[j][1]}」。`, `"${slots[j][2]}" is past tense. Describe events in a literary work in the present tense: "${slots[j][1]}."`), T(`正確的句子：${good}`, `Corrected: ${good}`)],
        hint: T('其他動詞都是現在式，哪一個不是？', 'The other verbs are present tense. Which one is not?'),
      };
    },
  },
  {
    id: 'g10-pronoun-reference',
    grade: 10,
    unit: 'grammar',
    name: T('代名詞指涉不清', 'Unclear pronoun reference'),
    std: 'Grade 10 · Language (SAT/ACT)',
    lesson: {
      zh: '代名詞（he、she、it、they、this、which）必須清楚指向<b>一個</b>前面提過的名詞。如果可能指兩個人或兩樣東西，或根本沒有指涉對象（In the article, it says…），就要改寫，把名詞說出來。',
      en: 'A pronoun (he, she, it, they, this, which) must point clearly to <b>one</b> noun. If it could mean two people or things—or nothing at all ("In the article, it says…")—rewrite and name the noun.',
      ex: ['Unclear: Ana told Mia that <b>she</b> had won.', 'Clear: Ana told Mia, "<b>You</b> have won."', 'Unclear: In the editorial, <b>it</b> says… → Clear: <b>The editorial</b> argues…'],
    },
    gen(r) {
      const male = r.chance(0.5), s = r.sample(male ? MALE : FEMALE, 2);
      const v = { A: s[0], B: s[1], he: male ? 'he' : 'she', him: male ? 'him' : 'her', his: male ? 'his' : 'her' };
      const items = [
        { text: '{A} told {B} that {he} had been chosen for the lead role.', right: '{A} told {B}, "You have been chosen for the lead role."', wrong: ['{A} told {B} that {he} had been chosen for the lead role.', '{A} told {B} that they had been chosen for the lead role.'], why: T('「{he}」可能指 {A}，也可能指 {B}。改成直接引語，就清楚是 {B} 被選上。', '"{he}" could mean {A} or {B}. A direct quotation makes it clear that {B} was chosen.') },
        { text: 'When {A} met {B} at the airport, {he} was exhausted after the long flight.', right: '{B} was exhausted after the long flight when {A} met {him} at the airport.', wrong: ['When {A} met {B} at the airport, {he} was exhausted after the long flight.', '{A} met {B} at the airport, and {he} was exhausted after the long flight.'], why: T('原句的「{he}」可能指兩人中任何一個；改寫後主詞直接寫出 {B}。', 'In the original, "{he}" could be either person. The revision names {B} as the subject.') },
        { text: '{A} reminded {B} that {his} project was due on Friday.', right: "{A} reminded {B} that {B}'s project was due on Friday.", wrong: ['{A} reminded {B} that {his} project was due on Friday.', '{A} reminded {B} that the project of {his} was due on Friday.'], why: T('「{his} project」是誰的專題？寫出名字才清楚。', 'Whose project is "{his} project"? Naming the person removes the doubt.') },
        { text: 'The museum moved the statue next to the fountain after it was cleaned.', right: 'After the statue was cleaned, the museum moved it next to the fountain.', wrong: ['The museum moved the statue next to the fountain after it was cleaned.', 'The museum moved the statue next to the fountain after cleaning it.'], why: T('「it」可能是雕像，也可能是噴泉。改寫後先說清楚是雕像被清洗。', '"It" could be the statue or the fountain. The revision names the statue first.') },
        { text: 'When the laptop fell onto the glass table, it cracked.', right: 'The glass table cracked when the laptop fell onto it.', wrong: ['When the laptop fell onto the glass table, it cracked.', 'It cracked when the laptop fell onto the glass table.'], why: T('是筆電裂了還是桌子裂了？把名詞放在主詞的位置就清楚了。', 'Did the laptop crack or the table? Putting the noun in the subject position makes it clear.') },
        { text: 'In the editorial, it says that the city should fund the library.', right: 'The editorial argues that the city should fund the library.', wrong: ['In the editorial, it says that the city should fund the library.', 'In the editorial, they say that the city should fund the library.'], why: T('「it」「they」沒有指涉的對象。直接讓 The editorial 當主詞。', '"It" and "they" refer to nothing. Make "the editorial" the subject.') },
        { text: "The council rejected the proposal and cut the mayor's budget, which angered many residents.", right: "The council's decision to reject the proposal and cut the mayor's budget angered many residents.", wrong: ["The council rejected the proposal and cut the mayor's budget, which angered many residents.", "The council rejected the proposal and cut the mayor's budget, and this angered many residents."], why: T('「which / this」指哪一件事？是拒絕提案、刪預算，還是兩者？把名詞說出來。', 'What does "which" or "this" refer to—the rejection, the cut, or both? Name it.') },
        { text: 'The teachers met with the students because they were worried about the exam schedule.', right: 'Worried about the exam schedule, the teachers met with the students.', wrong: ['The teachers met with the students because they were worried about the exam schedule.', 'The teachers met with the students, and they were worried about the exam schedule.'], why: T('「they」可能指老師，也可能指學生。改寫後明確是老師在擔心。', '"They" could be the teachers or the students. The revision shows that the teachers were worried.') },
      ];
      const it = subst(r.pick(items), v);
      return {
        q: T('這句的代名詞指涉不清。哪一個改寫最清楚？', 'The pronoun in this sentence is unclear. Which revision is clearest?'),
        text: it.text,
        ans: ansChoice([it.right, ...it.wrong]),
        sol: [it.why, say(it.right)],
        hint: T('問自己：這個代名詞可能指兩樣東西嗎？', 'Ask: could the pronoun point to two different nouns?'),
      };
    },
  },
  {
    id: 'g10-dangling-modifier',
    grade: 10,
    unit: 'sentences',
    name: T('修飾語位置：懸垂修飾語', 'Modifier placement: dangling modifiers'),
    std: 'Grade 10 · Language (SAT/ACT)',
    lesson: {
      zh: '句首的分詞片語（Hurrying to…、Exhausted after…）修飾的是<b>逗號後面的主詞</b>。如果主詞不是做那件事的人，就變成「懸垂修飾語」，意思會很好笑。',
      en: 'An opening phrase (Hurrying to…, Exhausted after…) describes <b>the subject right after the comma</b>. If that subject is not the one doing the action, the modifier "dangles" and the sentence says something silly.',
      ex: ['Wrong: Walking into the gym, <b>the noise</b> was deafening.', 'Right: Walking into the gym, <b>Mia</b> heard the deafening noise.'],
    },
    gen(r) {
      const v = cast(r);
      const items = [
        ['Hurrying to catch the bus', '{A} left the history notes on the kitchen table.', ['the history notes were left on the kitchen table.', 'the kitchen table still held the history notes.']],
        ['Exhausted after the long rehearsal', '{A} fell asleep on the couch.', ['the couch looked inviting to {A}.', 'sleep came quickly for {A}.']],
        ['Having finished the lab report early', '{A} helped classmates set up the microscopes.', ['the microscopes were set up by {A}.', 'there was time for {A} to help classmates.']],
        ['Looking out the airplane window', '{A} saw the city lights spread across the valley.', ['the city lights spread across the valley.', 'the valley glittered with city lights.']],
        ['Reaching the summit at dawn', 'the hikers watched the clouds turn pink.', ['the clouds turned pink above the hikers.', 'a pink sky greeted the hikers.']],
        ['After studying for three hours', '{A} finally understood the proof.', ['the proof finally made sense to {A}.', 'the proof was finally clear.']],
        ['While walking the dog', '{A} found a wallet on the sidewalk.', ['a wallet was found on the sidewalk.', "a wallet caught {A}'s eye."]],
        ['Nervous about the interview', '{A} practiced answers in front of a mirror.', ['the answers were practiced in front of a mirror.', "the mirror reflected {A}'s nervous face."]],
        ['To earn a spot on the varsity team', '{A} trained every morning before school.', ['every morning was spent training before school.', 'morning training became a habit for {A}.']],
        ['Proud of the finished mural', 'the students invited their families to see it.', ['invitations went out to the families.', 'the mural was shown to the families.']],
      ];
      const [open, ok, bad] = subst(r.pick(items), v);
      const right = `${open}, ${ok}`;
      return {
        q: T('哪一個句子沒有懸垂修飾語？', 'Which sentence avoids a dangling modifier?'),
        ans: ansChoice([right, ...bad.map((b) => `${open}, ${b}`)]),
        sol: [T(`「${open}」描述的是做這件事的人，所以逗號後面的主詞必須是那個人。`, `"${open}" describes whoever is doing it, so the subject after the comma must be that person.`), T('其他選項逗號後面的主詞是一樣東西，不可能做那個動作，所以修飾語「懸空」了。', 'In the other choices, the subject after the comma is a thing that could not do the action, so the modifier dangles.'), say(right)],
        hint: T('問：逗號後面的主詞，真的能做句首那件事嗎？', 'Ask: can the subject after the comma really do the opening action?'),
      };
    },
  },
  bankSkill({
    id: 'g10-concision',
    grade: 10,
    unit: 'style',
    name: T('簡潔：刪去贅字', 'Concision: cut the redundancy'),
    std: 'CCSS L.9-10.3 (SAT)',
    lesson: {
      zh: 'SAT／ACT 常考<b>重複贅字</b>：同一個意思說兩次（return back、3 p.m. in the afternoon、first began）。意思一樣時，<b>最短、最清楚</b>的選項通常是正確答案。',
      en: 'SAT and ACT questions often test <b>redundancy</b>—saying the same thing twice (return back, 3 p.m. in the afternoon, first began). When the meaning is the same, the <b>shortest clear</b> choice is usually right.',
      ex: ['<s>The reason why… is because</s> → The play was canceled <b>because</b>…', '<s>collaborated together</s> → <b>collaborated</b>'],
    },
  }, [
    { text: 'The committee will <u>meet together at 3 p.m. in the afternoon</u> to vote.', right: 'meet at 3 p.m.', wrong: ['meet together at 3 p.m. in the afternoon', 'meet together at 3 p.m.', 'meet at 3 p.m. in the afternoon'], why: T('「together」已包含在 meet 裡，「p.m.」就是下午，都是贅字。', '"Meet" already implies "together," and "p.m." already means "in the afternoon."') },
    { text: 'The volunteers <u>collaborated together jointly</u> to repaint the mural.', right: 'collaborated', wrong: ['collaborated together jointly', 'collaborated together', 'jointly collaborated together'], why: T('collaborate 就是「一起合作」，together、jointly 都多餘。', '"Collaborate" already means "work together," so "together" and "jointly" repeat it.') },
    { text: '{A} <u>first began</u> playing the cello in sixth grade.', right: 'began', wrong: ['first began', 'initially first began', 'began for the first time and started'], why: T('began 本身就是「開始」，first 多餘。', '"Began" already means "started for the first time."') },
    { text: 'The new library is <u>large in size</u> and filled with natural light.', right: 'large', wrong: ['large in size', 'large and big in size', 'of a large size and scale'], why: T('large 就是指大小，in size 多餘。', '"Large" already refers to size.') },
    { text: 'The <u>final outcome</u> of the election surprised the analysts.', right: 'outcome', wrong: ['final outcome', 'eventual final outcome', 'final end outcome'], why: T('outcome 就是「最後結果」，final 多餘。', 'An "outcome" is already final.') },
    { text: 'The two scientists <u>reached a consensus of opinion</u> after weeks of debate.', right: 'reached a consensus', wrong: ['reached a consensus of opinion', 'reached a general consensus of opinion', 'reached an agreed consensus of opinion'], why: T('consensus 就是「意見一致」，of opinion 多餘。', '"Consensus" already means "agreement of opinion."') },
    { text: 'The festival takes place <u>annually every year</u> in October.', right: 'each year', wrong: ['annually every year', 'every year annually', 'yearly each year'], why: T('annually 和 every year 意思相同，只要一個。', '"Annually" and "every year" mean the same thing; keep one.') },
    { text: '{A} returned the book <u>back to the library</u> two weeks late.', right: 'to the library', wrong: ['back to the library', 'back again to the library', 'back to the library again'], why: T('return 就是「歸還」，back 多餘。', '"Return" already means "give back."') },
    { text: '<u>Due to the fact that</u> the bridge was icy, the school opened late.', right: 'Because', wrong: ['Due to the fact that', 'Owing to the fact that', 'Because of the fact that'], why: T('四個字的片語可以用一個 Because 取代。', 'A wordy phrase can be replaced by the single word "Because."') },
    { text: 'The researchers <u>repeated the experiment again</u> to confirm the results.', right: 'repeated the experiment', wrong: ['repeated the experiment again', 'repeated the experiment over again', 'again repeated the experiment once more'], why: T('repeat 就是「再做一次」，again 多餘。', '"Repeat" already means "do again."') },
    { text: '{A} gave a <u>brief, short summary</u> of the chapter.', right: 'brief summary', wrong: ['brief, short summary', 'short and brief summary', 'brief summary that was short'], why: T('brief 和 short 意思相同，只要一個。', '"Brief" and "short" mean the same thing.') },
    { text: 'The two rivers <u>merge together</u> just north of the city.', right: 'merge', wrong: ['merge together', 'merge together as one', 'join and merge together'], why: T('merge 就是「匯合在一起」，together 多餘。', '"Merge" already means "come together."') },
    { text: '<u>The reason why the play was canceled was because</u> the lead actor was sick.', right: 'The play was canceled because', wrong: ['The reason why the play was canceled was because', 'The reason the play was canceled was due to the fact that', 'The reason why the play was canceled is because of how'], why: T('「The reason why… was because」重複表達原因，直接說 was canceled because。', '"The reason why… was because" states the cause twice. Say "was canceled because."') },
  ], { q: T('選出畫底線部分最簡潔、意思不變的寫法。', 'Choose the most concise version of the underlined part that keeps the meaning.'), hint: T('有沒有字在重複前面已經說過的意思？', 'Does any word repeat a meaning that is already there?') }),
  bankSkill({
    id: 'g10-transitions',
    grade: 10,
    unit: 'organization',
    name: T('段落中的轉折詞', 'Transitions in a passage'),
    std: 'CCSS W.9-10.2c (SAT)',
    lesson: {
      zh: '先判斷兩個句子的<b>邏輯關係</b>，再選轉折詞：對比（however、by contrast）、因果（therefore、as a result、consequently）、舉例（for example）、補充（in addition、moreover）、相似（similarly）。',
      en: 'First decide the <b>logical relationship</b> between the two sentences, then choose: contrast (however, by contrast), cause and effect (therefore, as a result, consequently), example (for example), addition (in addition, moreover), similarity (similarly).',
      ex: ['Electric buses cost more to buy. <b>However</b>, they are cheaper to run.', 'Heavy rain fell for six days. <b>As a result</b>, the river flooded.'],
    },
  }, [
    { text: 'Electric buses cost more to purchase than diesel buses. ___, they are far cheaper to fuel and maintain.', right: 'However', wrong: ['Therefore', 'For example', 'Similarly'], why: T('前一句說缺點（較貴），後一句說優點，是對比關係。', 'The first sentence gives a drawback and the second an advantage: contrast.') },
    { text: 'Heavy rain fell for six straight days. ___, the river rose above its banks.', right: 'As a result', wrong: ['Nevertheless', 'For instance', 'In contrast'], why: T('下雨是原因，河水氾濫是結果，是因果關係。', 'The rain is the cause and the flood is the effect.') },
    { text: 'Many important inventions began as accidents. ___, penicillin was discovered when mold contaminated a lab dish.', right: 'For example', wrong: ['However', 'Therefore', 'Instead'], why: T('盤尼西林是「意外發明」的一個例子。', 'Penicillin is one example of an accidental invention.') },
    { text: 'The new schedule gives students a longer lunch. ___, it adds a quiet reading period at the end of the day.', right: 'In addition', wrong: ['However', 'As a result', 'Instead'], why: T('第二句再補充新課表的另一個改變，是補充關係。', 'The second sentence adds another feature of the schedule.') },
    { text: "Most of the town's residents supported the new park. ___, a small group argued that the land should be used for housing.", right: 'However', wrong: ['Consequently', 'Similarly', 'For instance'], why: T('多數人支持，少數人反對，是對比關係。', 'Most supported it; a few opposed it. That is a contrast.') },
    { text: "Bees pollinate a large share of the world's crops. ___, a sharp decline in bee populations could threaten food supplies.", right: 'Consequently', wrong: ['Nonetheless', 'In contrast', 'For example'], why: T('因為蜜蜂很重要，所以數量下降會威脅糧食，是因果關係。', 'Because bees matter so much, their decline would lead to a food problem: cause and effect.') },
    { text: 'Early cameras required subjects to sit still for several minutes. ___, modern phone cameras capture an image in a fraction of a second.', right: 'By contrast', wrong: ['Similarly', 'As a result', 'In addition'], why: T('早期相機很慢，現代相機很快，是對比關係。', 'Early cameras were slow; modern ones are fast. That is a contrast.') },
    { text: 'Learning the violin takes years of patient practice. ___, mastering the cello requires a long commitment to daily practice.', right: 'Similarly', wrong: ['Instead', 'As a result', 'For instance'], why: T('兩種樂器都需要長時間練習，是相似關係。', 'Both instruments demand long practice: a similarity.') },
    { text: "The first draft of {A}'s essay was too long and unfocused. ___, {A} cut two paragraphs and rewrote the thesis.", right: 'Therefore', wrong: ['Similarly', 'Otherwise', 'For example'], why: T('因為初稿太長，所以刪段落，是因果關係。', 'The draft was too long, so the writer cut it: cause and effect.') },
    { text: 'The city planted five thousand trees along its busiest streets. ___, summer temperatures on those streets dropped by several degrees.', right: 'As a result', wrong: ['Nevertheless', 'Likewise', 'On the other hand'], why: T('種樹是原因，降溫是結果。', 'Planting trees is the cause; the cooler streets are the effect.') },
    { text: 'Octopuses can open jars and escape from locked tanks. ___, many biologists rank them among the most intelligent invertebrates.', right: 'For this reason', wrong: ['Nevertheless', 'In contrast', 'Meanwhile'], why: T('前一句的能力是後一句結論的理由。', 'The skills in the first sentence are the reason for the conclusion in the second.') },
    { text: 'The museum was free for most of its history. ___, it began charging admission in 2019 to pay for repairs.', right: 'However', wrong: ['Therefore', 'Similarly', 'For example'], why: T('長期免費，後來收費，是轉折對比。', 'Free for years, then not free: a contrast.') },
  ], { q: T('選出最適合填入空格的轉折詞。', 'Choose the transition that best fits the blank.'), hint: T('兩句是對比、因果、舉例，還是補充？', 'Is the relationship contrast, cause, example, or addition?') }),
  bankSkill({
    id: 'g10-add-delete',
    grade: 10,
    unit: 'organization',
    name: T('句子該加還是該刪？（SAT／ACT）', 'Should the writer add or delete this sentence? (SAT/ACT)'),
    std: 'CCSS W.9-10.2a (SAT/ACT)',
    lesson: {
      zh: '判斷一個句子該不該加（或刪），先找出<b>段落的焦點</b>。如果句子提供支持論點的<b>具體證據</b>、必要的<b>定義</b>或<b>轉折</b>，就保留；如果它離題、重複、或語氣不合，就不要。答案的「理由」也必須正確。',
      en: 'To decide whether a sentence belongs, first find the <b>focus of the paragraph</b>. Keep a sentence that gives <b>specific evidence</b>, a needed <b>definition</b>, or a useful <b>transition</b>. Cut one that strays off topic, repeats, or clashes with the tone. The reason in the answer must be right too.',
      ex: ['Add: "One study found shaded sidewalks were up to 20 degrees cooler." → Yes, it gives specific evidence.', 'Delete: "Tomatoes were first grown in South America." → Yes, it is off topic.'],
    },
  }, [
    { q: T('作者想在句子 3 後面加上：「One study found that shaded sidewalks were up to 20 degrees cooler than sidewalks in full sun.」該加嗎？', 'The writer is considering adding this sentence after sentence 3: "One study found that shaded sidewalks were up to 20 degrees cooler than sidewalks in full sun." Should the writer make this addition?'),
      text: '(1) City trees do more than make streets look pleasant. (2) Their shade keeps pavement and buildings from soaking up the afternoon sun. (3) Leaves also release water vapor, which cools the surrounding air. (4) For this reason, neighborhoods with many trees can be noticeably cooler than treeless blocks nearby.',
      right: 'Yes, because it gives specific evidence that trees cool city streets.', wrong: ['Yes, because it introduces a new topic for the paragraph.', 'No, because it repeats information from sentence 1.', 'No, because it shifts the focus away from trees.'], why: T('段落主張「樹木讓街道變涼」，這句提供具體數據支持，應該加。', 'The paragraph claims that trees cool streets; this sentence adds specific supporting data.') },
    { q: T('作者想在句子 2 後面加上：「Today, many cities offer bike-sharing apps that charge riders by the minute.」該加嗎？', 'The writer is considering adding this sentence after sentence 2: "Today, many cities offer bike-sharing apps that charge riders by the minute." Should the writer make this addition?'),
      text: "(1) The first bicycle, built in 1817, had no pedals at all. (2) Riders pushed it along by striding with their feet, like a child on a balance bike. (3) Pedals attached to the front wheel arrived in the 1860s, and designers soon made that wheel enormous to gain speed. (4) Only in the 1880s did the \"safety bicycle,\" with two equal wheels and a chain, become popular.",
      right: "No, because it interrupts the paragraph's chronological account of early bicycle design.", wrong: ['Yes, because it shows that bicycles are still popular today.', 'Yes, because it provides a needed transition to sentence 3.', 'No, because it contradicts the information in sentence 1.'], why: T('段落依時間順序介紹早期腳踏車；現代共享單車突然插進來，打斷了焦點。', 'The paragraph traces early bicycle design in time order; a sentence about modern bike-sharing breaks that focus.') },
    { q: T('作者該刪掉畫底線的句子嗎？', 'Should the writer delete the underlined sentence?'),
      text: '(1) Last spring, {A} and a group of classmates turned an empty lot behind the school into a vegetable garden. (2) By September, the garden was supplying lettuce and tomatoes to the cafeteria salad bar. (3) <u>Tomatoes were first grown as food in South America thousands of years ago.</u> (4) Students who worked in the garden said they were more willing to try new vegetables at lunch.',
      right: "Yes, because it distracts from the paragraph's focus on how the garden benefits the school.", wrong: ['No, because it gives important background for the claim in sentence 4.', 'No, because it explains why the students chose to plant a garden.', 'Yes, because it contradicts sentence 2.'], why: T('段落談的是菜園對學校的好處，番茄的歷史離題了。', "The paragraph is about the garden's benefits to the school; the history of tomatoes is off topic.") },
    { q: T('作者該刪掉畫底線的句子嗎？', 'Should the writer delete the underlined sentence?'),
      text: '(1) Many coastal towns are protecting themselves with "living shorelines." (2) <u>A living shoreline uses plants, sand, and oyster reefs instead of concrete walls to absorb the force of waves.</u> (3) Because these natural barriers grow over time, they can keep pace with rising seas. (4) Concrete seawalls, by contrast, slowly crack and must eventually be replaced.',
      right: 'No, because it defines a term that the rest of the paragraph depends on.', wrong: ['Yes, because it repeats information from sentence 1.', 'Yes, because it introduces an unrelated topic.', 'No, because it provides a statistic that supports sentence 4.'], why: T('沒有這句，讀者不知道 living shoreline 是什麼，句子 3 的「these natural barriers」也沒有著落。', 'Without it, readers would not know what a living shoreline is, and "these natural barriers" in sentence 3 would point to nothing.') },
    { q: T('下一段會討論四天上課制的缺點。作者想在句子 3 後面加上：「Yet these savings may come at a cost to students who depend on school meals and supervision.」該加嗎？', 'The next paragraph discusses the drawbacks of a four-day week. The writer is considering adding this sentence after sentence 3: "Yet these savings may come at a cost to students who depend on school meals and supervision." Should the writer make this addition?'),
      text: '(1) Supporters of a four-day school week point to clear benefits. (2) Districts save money on buses, heating, and substitute teachers. (3) Teachers also gain a weekday for planning and training.',
      right: 'Yes, because it creates a transition to the drawbacks discussed in the next paragraph.', wrong: ['No, because it contradicts the claim in sentence 1.', 'No, because it introduces a topic that the essay never discusses.', 'Yes, because it summarizes the benefits listed in sentences 2 and 3.'], why: T('這句承接前面的好處，並引出下一段的缺點，是很好的轉折句。', 'It connects the benefits in this paragraph to the drawbacks in the next one—an effective transition.') },
    { q: T('作者想在句子 2 後面加上：「Honestly, it is probably the coolest place on the planet.」該加嗎？', 'The writer is considering adding this sentence after sentence 2: "Honestly, it is probably the coolest place on the planet." Should the writer make this addition?'),
      text: '(1) The Great Barrier Reef stretches more than 2,300 kilometers along the coast of Australia. (2) It is home to thousands of species of fish, coral, and mollusks. (3) Rising ocean temperatures have caused several mass bleaching events since 1998.',
      right: 'No, because its casual, unsupported opinion does not fit the informative tone of the paragraph.', wrong: ["Yes, because it adds a vivid detail about the reef's wildlife.", "Yes, because it emphasizes the reef's size.", 'No, because it repeats the information in sentence 1.'], why: T('這是隨口的個人意見，語氣也太口語，不符合說明文的客觀語氣。', 'It is a casual personal opinion with no support, which clashes with the objective, informative tone.') },
    { q: T('作者想在句子 3 後面加上：「Attendance records showed that first-period tardiness fell by almost half.」該加嗎？', 'The writer is considering adding this sentence after sentence 3: "Attendance records showed that first-period tardiness fell by almost half." Should the writer make this addition?'),
      text: "(1) {A}'s school moved its start time from 7:30 to 8:30 last year. (2) Teachers immediately noticed a difference in first-period classes. (3) Fewer students arrived late, and more of them joined class discussions.",
      right: "Yes, because it adds data that supports the teachers' observations.", wrong: ['No, because it shifts the focus to a different school.', 'Yes, because it explains why the school changed its start time.', 'No, because it contradicts sentence 3.'], why: T('老師的觀察（遲到變少）有了出席紀錄的數據支持，論證更有力。', "Attendance data backs up the teachers' observation that fewer students were late.") },
    { q: T('作者該刪掉畫底線的句子嗎？', 'Should the writer delete the underlined sentence?'),
      text: '(1) The Silk Road was not a single road but a network of trade routes. (2) It linked China with Central Asia, the Middle East, and the Mediterranean world. (3) <u>The Silk Road connected China to regions as far west as the Mediterranean.</u> (4) Along these routes traveled not only silk and spices but also languages, religions, and ideas.',
      right: 'Yes, because it repeats information already given in sentence 2.', wrong: ["No, because it introduces the paragraph's main idea.", 'No, because it provides a transition to sentence 4.', 'Yes, because it contradicts sentence 1.'], why: T('句子 2 已經說過絲路連接中國和地中海，句子 3 是重複。', 'Sentence 2 already says the routes linked China with the Mediterranean; sentence 3 only repeats it.') },
    { q: T('作者想在句子 3 後面加上：「That arm helped the team win second place at the state championship.」該加嗎？', 'The writer is considering adding this sentence after sentence 3: "That arm helped the team win second place at the state championship." Should the writer make this addition?'),
      text: "(1) {A} joined the robotics club as a freshman with no experience. (2) At first, {A} mostly sorted screws and watched the older members work. (3) By junior year, {A} was leading the team that designed the robot's arm.",
      right: "Yes, because it shows the result of the growth the paragraph describes.", wrong: ['No, because it contradicts sentence 1.', 'Yes, because it explains why {A} joined the club.', 'No, because it repeats the information in sentence 2.'], why: T('段落描述從新手到領導者的成長，這句展示成長帶來的成果，讓段落更完整。', 'The paragraph traces growth from beginner to leader; this sentence shows what that growth achieved.') },
  ], { n: 3, hint: T('先說出這一段的焦點，再看理由對不對。', 'Name the paragraph’s focus first, then check the reason.') }),
  {
    id: 'g10-mla-works-cited',
    grade: 10,
    unit: 'research',
    name: T('MLA 引用文獻格式', 'MLA works-cited format'),
    std: 'CCSS W.9-10.8',
    lesson: {
      zh: 'MLA 第 9 版：<b>姓, 名.</b> 書名用<b>斜體</b>，文章標題用<b>引號</b>，網站或期刊名稱用斜體。書：<i>姓, 名. 書名. 出版社, 年.</i> 網路文章：<i>姓, 名. "標題." 網站, 日 月 年, 網址.</i>（月份縮寫，如 Mar.）',
      en: 'MLA 9: <b>Last, First.</b> Book titles are <b>italic</b>; article titles go in <b>quotation marks</b>; the website or magazine is italic. Book: <i>Last, First. Title. Publisher, Year.</i> Web article: <i>Last, First. "Title." Site, Day Mon. Year, URL.</i>',
      ex: ['Okafor, Amara. <i>The Patient Garden</i>. Juniper Press, 2021.', 'Torres, Maya. "What Octopuses Know." <i>Ocean Notes</i>, 4 Mar. 2023, www.oceannotes.org/octopus-minds.'],
    },
    gen(r) {
      const s = source(r), right = mlaEntry(s);
      const wrong = s.kind === 'book'
        ? [`${s.first} ${s.last}. <i>${s.title}</i>. ${s.pub}, ${s.yr}.`, `${s.last}, ${s.first}. "${s.title}." ${s.pub}, ${s.yr}.`, apaEntry(s), `${s.last}, ${s.first}. <i>${s.title}</i>. ${s.yr}, ${s.pub}.`]
        : [`${s.first} ${s.last}. "${s.title}${endP(s.title)}" <i>${s.site}</i>, ${s.d} ${s.mon[0]} ${s.yr}, ${s.url}.`, `${s.last}, ${s.first}. <i>${s.title}</i>. "${s.site}," ${s.d} ${s.mon[0]} ${s.yr}, ${s.url}.`, apaEntry(s), `${s.last}, ${s.first}. "${s.title}${endP(s.title)}" <i>${s.site}</i>, ${s.url}, ${s.d} ${s.mon[0]} ${s.yr}.`];
      return {
        q: T('哪一個引用文獻條目符合 MLA（第 9 版）格式？', 'Which works-cited entry is correctly formatted in MLA (9th edition)?'),
        ans: ansChoice([right, ...r.sample(wrong, 3)]),
        sol: [
          s.kind === 'book' ? T('書籍：姓, 名. 斜體書名. 出版社, 年.（作者姓在前；書名斜體不加引號；年份在出版社後面）', 'Book: Last, First. <i>Title</i>. Publisher, Year. (Last name first; italic title, no quotation marks; year after the publisher.)')
            : T('網路文章：姓, 名. "文章標題." 斜體網站名, 日 月 年, 網址.（文章用引號、網站用斜體，日期在網址前面）', 'Web article: Last, First. "Article Title." <i>Site</i>, Day Mon. Year, URL. (Article in quotation marks, site in italics, date before the URL.)'),
          T('有括號年份、只寫名字縮寫的是 APA 格式，不是 MLA。', 'An entry with the year in parentheses and only an initial is APA style, not MLA.'),
          say(right),
        ],
        hint: T('看作者姓名順序、斜體／引號，和年份的位置。', 'Check the name order, italics vs. quotation marks, and where the year goes.'),
      };
    },
  },
  bankSkill({
    id: 'g10-thesis',
    grade: 10,
    unit: 'paragraphs',
    name: T('有爭議性又具體的論點句', 'An arguable, specific thesis'),
    std: 'CCSS W.9-10.1a',
    lesson: {
      zh: '好的論點句（thesis）要：①<b>可以被反對</b>（不是事實）②<b>具體</b>（說清楚立場和範圍）③最好預告<b>理由</b>。避免：單純事實、空泛的說法、「In this essay I will…」、問句。',
      en: 'A strong thesis is <b>arguable</b> (someone could disagree—it is not a fact), <b>specific</b> (a clear position and scope), and ideally previews the <b>reasons</b>. Avoid plain facts, vague statements, "In this essay I will…," and questions.',
      ex: ['Weak: Many schools start before 8 a.m. (a fact)', 'Strong: High schools should start no earlier than 8:30 a.m. because later start times improve sleep, attendance, and safety.'],
    },
  }, [
    { text: 'Topic: school start times', right: "High schools should start no earlier than 8:30 a.m. because later start times improve students' sleep, attendance, and safety on the road.", wrong: ['Many high schools in the United States start before 8 a.m.', 'School start times are an important issue that affects many people.', 'In this essay, I will talk about school start times.', 'Should high schools start later in the morning?'], why: T('正確答案有明確立場（應該 8:30 以後）、可被反對，還預告了三個理由。', 'The answer takes a clear position (no earlier than 8:30), could be disputed, and previews three reasons.') },
    { text: 'Topic: lowering the voting age', right: 'Sixteen-year-olds should be allowed to vote in local elections because they pay taxes, follow local issues, and are directly affected by school board decisions.', wrong: ['The voting age in the United States is eighteen.', 'Voting is something that is very important in a democracy.', 'This essay will discuss the voting age.', 'What is the right age to start voting?'], why: T('正確答案明確主張「16 歲可在地方選舉投票」，並說明理由。', 'The answer argues a specific position—16-year-olds voting in local elections—and gives reasons.') },
    { text: 'Topic: phones in class', right: 'Schools should require students to store phones in lockers during class, because constant notifications fragment attention and weaken learning.', wrong: ['Most teenagers own a smartphone.', 'Phones in school have both good and bad sides.', 'In this essay I am going to write about phones.', 'Are phones a problem in classrooms?'], why: T('「有好有壞」太空泛；正確答案有具體做法和理由。', '"Good and bad sides" says nothing; the answer proposes a specific policy with a reason.') },
    { text: 'Topic: plastic bags', right: 'Our city should place a ten-cent fee on single-use plastic bags, since similar fees elsewhere have cut bag use sharply without hurting local businesses.', wrong: ['Plastic bags are made from petroleum.', 'Plastic is bad for the environment in many ways.', 'This essay is about plastic bags.', 'Why do people still use plastic bags?'], why: T('正確答案提出具體政策（十分錢費用）並說明理由，可以被反對。', 'The answer proposes a specific policy (a ten-cent fee) with a reason, and people could disagree.') },
    { text: 'Topic: community service', right: 'Requiring twenty hours of community service for graduation would teach students practical skills and strengthen ties between schools and their neighborhoods.', wrong: ['Some schools require community service for graduation.', 'Community service is a nice thing to do.', 'I will explain community service in this essay.', 'Is community service good for students?'], why: T('正確答案有立場（應該要求 20 小時）和兩個理由。', 'The answer takes a stance (require twenty hours) and gives two reasons.') },
    { text: 'Topic: Macbeth', right: "In Macbeth, Shakespeare shows that unchecked ambition destroys the ambitious themselves, as Macbeth's growing paranoia isolates him from everyone he once trusted.", wrong: ['Macbeth is a tragedy written by William Shakespeare.', 'Macbeth is a play about ambition.', 'In this essay, I will analyze Macbeth.', 'Why does Macbeth kill the king?'], why: T('文學論點要說出「作者透過作品表達什麼」，並指出證據方向；「這齣戲關於野心」只是主題，不是論點。', 'A literary thesis states what the author shows and how. "A play about ambition" names a topic, not a claim.') },
    { text: 'Topic: artificial intelligence in school', right: 'Teachers should allow AI tools for brainstorming but not for drafting, because students learn to write only by wrestling with their own sentences.', wrong: ['Artificial intelligence is a fast-growing technology.', 'AI will change many things in the future.', 'This essay will be about AI in schools.', 'Should students use AI?'], why: T('正確答案劃出具體界線（可用來發想、不可代寫）並說明理由。', 'The answer draws a specific line (brainstorming yes, drafting no) and explains why.') },
    { text: 'Topic: homework', right: 'High schools should cap homework at two hours a night, because longer workloads raise stress without improving test scores.', wrong: ['Students in high school get homework.', 'Homework is a topic many students have opinions about.', 'In this paper I will discuss homework.', 'How much homework is too much?'], why: T('正確答案有可被反對的具體主張（上限兩小時）和理由。', 'The answer makes a specific, debatable claim (a two-hour cap) with a reason.') },
    { text: 'Topic: public libraries', right: 'Cities should keep public libraries open on Sundays, because for many families they are the only free, quiet place to study and get online.', wrong: ['Public libraries lend books to the public.', 'Libraries are good places.', 'This essay will tell you about libraries.', 'Do we still need libraries?'], why: T('正確答案有明確提議和理由；其他選項是事實、空泛說法、宣告或問句。', 'The answer makes a clear proposal with a reason; the others are a fact, a vague remark, an announcement, or a question.') },
  ], { q: T('哪一句是最好的論點句（thesis）？', 'Which is the strongest thesis statement?'), hint: T('有人能反對它嗎？它夠具體嗎？', 'Could someone disagree with it? Is it specific?') }),
  {
    id: 'g10-counterargument',
    grade: 10,
    unit: 'paragraphs',
    name: T('反方論點與反駁', 'Counterargument and rebuttal'),
    std: 'CCSS W.9-10.1b',
    lesson: {
      zh: '強的論說文會<b>承認反方</b>（Some argue that…），<b>公平地讓步</b>（It is true that…），再用證據<b>反駁</b>（However…），最後<b>回到自己的論點</b>。反駁要針對對方的理由，不要攻擊人。',
      en: 'A strong argument <b>states the opposing view</b> (Some argue that…), <b>concedes fairly</b> (It is true that…), <b>rebuts with evidence</b> (However…), and <b>returns to the claim</b>. Answer the reason, not the person.',
      ex: ['Some parents argue that students need phones for emergencies. This concern is understandable. However, every school office can relay urgent messages within minutes.'],
    },
    gen(r) {
      const sets = [
        { claim: 'Students should keep phones in lockers during the school day.', s: ['Some parents argue that students need their phones during the school day in case of an emergency.', 'This concern is understandable, since families want to reach their children quickly.', 'However, every school already has a front office that can relay an urgent message within minutes.', "A phone-free school day therefore protects students' focus without cutting families off."], bad: ['Parents who worry about emergencies are simply being overprotective.', 'That is a good point, so maybe phones should be allowed after all.', 'Phones also come in many colors and sizes.'] },
        { claim: 'Our district should adopt a later school start time.', s: ['Critics claim that a later start would push sports practices into the evening.', 'It is true that some schedules would need to change.', 'Yet districts that moved their start times found that teams simply practiced later, and athletes slept more and performed better.', 'The scheduling challenge is real, but it is a small price for healthier students.'], bad: ['Critics of later start times clearly do not care about students.', 'Since sports matter, the district should forget about changing start times.', 'Many sports, such as soccer, are popular around the world.'] },
        { claim: 'Public transit in our city should be free.', s: ['Opponents argue that free transit would cost the city millions in lost fares.', 'Fares do cover part of the budget, so this objection deserves attention.', 'However, collecting fares is itself expensive, and cities that dropped them saved money on ticket machines and enforcement.', 'Free transit would therefore cost far less than critics fear while serving far more riders.'], bad: ['Opponents of free transit probably never ride the bus themselves.', 'The cost is too high, so free transit is a bad idea after all.', 'Buses in our city are painted blue and white.'] },
        { claim: 'Schools should replace some final exams with projects.', s: ['Some teachers worry that projects are harder to grade fairly than exams.', 'Grading a creative project can indeed feel subjective.', 'Clear rubrics, however, allow teachers to score projects as consistently as essay exams.', 'With good rubrics, projects can measure deeper learning without sacrificing fairness.'], bad: ['Teachers who prefer exams are stuck in the past.', 'Since grading is hard, schools should keep all of their exams.', 'Some projects require glue, scissors, and poster board.'] },
        { claim: 'Our town should build protected bike lanes downtown.', s: ['Local shop owners fear that bike lanes will remove parking and drive customers away.', 'Losing parking spaces is a legitimate concern for small businesses.', 'Studies of several cities, however, found that shoppers who arrive by bike visit more often and spend as much per month as drivers.', 'Protected lanes are therefore likely to help, not hurt, downtown businesses.'], bad: ['Shop owners only care about their own profits.', 'Parking matters, so the bike lane plan should be dropped.', 'Bicycles were invented in the nineteenth century.'] },
      ];
      const st = r.pick(sets);
      if (r.chance(0.5)) {
        return {
          q: T(`論點：「${st.claim}」把這段反方與反駁的句子排成正確順序。`, `Claim: "${st.claim}" Put the counterargument paragraph in order.`),
          ans: ansOrder(st.s),
          sol: [T('順序：①說出反方意見 ②公平地讓步 ③用證據反駁 ④回到自己的論點。', 'Order: (1) state the opposing view, (2) concede fairly, (3) rebut with evidence, (4) return to your claim.'), T(`第一句：${st.s[0]}`, `It starts: ${st.s[0]}`)],
          hint: T('先找「Some argue / Critics claim」那句。', 'Start with the sentence that states what others argue.'),
        };
      }
      return {
        q: T('作者的論點如下，畫線的是反方意見。哪一句是最好的反駁？', 'Here is the writer\'s claim and an opposing view. Which sentence is the best rebuttal?'),
        text: `Claim: ${st.claim}<br>Opposing view: <u>${st.s[0]}</u>`,
        ans: ansChoice([st.s[2], ...r.sample(st.bad, 3)]),
        sol: [T('好的反駁針對對方的理由，用證據回應；不攻擊人、不直接放棄立場、也不離題。', 'A good rebuttal answers the reason with evidence—it does not attack people, give up the claim, or wander off topic.'), say(st.s[2])],
        hint: T('哪一句用事實回應了對方的擔心？', 'Which sentence answers the concern with facts?'),
      };
    },
  },
  {
    id: 'g10-embed-quote',
    grade: 10,
    unit: 'research',
    name: T('把引文嵌入句子', 'Embedding quotations'),
    std: 'CCSS W.9-10.8',
    lesson: {
      zh: '引文不能單獨「掉」進段落，要用<b>引導語</b>（As Okafor argues, …）把它接進自己的句子，讓整句文法通順。MLA 的頁碼括號放在引號<b>後面</b>、句號<b>前面</b>："…" (12). that 後面不加逗號。',
      en: 'Never drop a quotation in by itself—introduce it with a <b>signal phrase</b> (As Okafor argues, …) so the whole sentence is grammatical. In MLA, the page citation goes <b>after</b> the closing quotation mark and <b>before</b> the period: "…" (12). Do not put a comma after "that."',
      ex: ['Okafor argues that "a vacant lot is a classroom waiting for students" (12).', 'One researcher calls a vacant lot "a classroom waiting for students" (Okafor 12).'],
    },
    gen(r) {
      const who = r.pick([['Professor Okafor', 'Okafor'], ['Dr. Lindqvist', 'Lindqvist'], ['the journalist Maya Torres', 'Torres'], ['the historian Ren Nakamura', 'Nakamura'], ['the biologist Layla Haddad', 'Haddad']]);
      const quote = r.pick(['public libraries are the last free indoor spaces in many towns', 'sleep is the cheapest performance enhancer a student can find', 'every city map hides a history of decisions', 'a vacant lot is a classroom waiting for students', 'curiosity grows when students are allowed to fail safely', 'the ocean absorbs far more heat than the atmosphere does']);
      const verb = r.pick(['argues', 'observes', 'insists', 'points out']), p = r.int(8, 240), name = who[0].charAt(0).toUpperCase() + who[0].slice(1);
      const right = `${name} ${verb} that "${quote}" (${p}).`;
      const wrong = [`${name} ${verb} that "${quote}." (${p})`, `${name} ${verb} that, "${quote}" (${p}).`, `This idea is important. "${quote.charAt(0).toUpperCase() + quote.slice(1)}." (${who[1]} ${p})`, `${name} ${verb} "that ${quote} (${p})."`];
      return {
        q: T('哪一句正確地把引文嵌入句子（MLA）？', 'Which sentence correctly embeds the quotation (MLA style)?'),
        ans: ansChoice([right, ...r.sample(wrong, 3)]),
        sol: [T('用引導語（某人 argues that）把引文接成一個完整句子；that 後面不加逗號。', 'A signal phrase ("… argues that") blends the quotation into one grammatical sentence; no comma after "that."'), T('括號頁碼放在引號外、句號前：…" (頁碼).', 'The parenthetical citation goes outside the quotation marks and before the period: …" (page).'), T('引導語已經提到作者姓名時，括號裡只寫頁碼。', 'When the signal phrase already names the author, the parentheses need only the page number.'), say(right)],
        hint: T('句號應該在括號的前面還是後面？', 'Should the period come before or after the parentheses?'),
      };
    },
  },
];

// ======================================================================= GRADE 11
const USAGE = [
  { text: '{A} is the candidate ___ the committee finally selected.', right: 'whom', wrong: ['who'], why: T('the committee selected her/him：空格是 selected 的受詞，用 whom。', 'The committee selected HIM/HER—the blank is the object of "selected," so use "whom."') },
  { text: '{A} is the student ___ organized the food drive.', right: 'who', wrong: ['whom'], why: T('空格是 organized 的主詞（she/he organized），用 who。', 'The blank is the subject of "organized" (SHE organized), so use "who."') },
  { text: 'To ___ should the cover letter be addressed?', right: 'whom', wrong: ['who'], why: T('介係詞 to 後面接受詞，用 whom。', 'After the preposition "to," use the object form "whom."') },
  { text: '___ do you think will win the debate tournament?', right: 'Who', wrong: ['Whom'], why: T('拿掉插入的 do you think：Who will win? 空格是 will win 的主詞。', 'Remove "do you think": WHO will win? The blank is the subject of "will win."') },
  { text: 'The tutor ___ {A} recommended has a long waiting list.', right: 'whom', wrong: ['who'], why: T('{A} recommended him/her：空格是受詞，用 whom。', '{A} recommended HIM/HER—the blank is an object, so use "whom."') },
  { text: 'The prize will go to ___ writes the most original essay.', right: 'whoever', wrong: ['whomever'], why: T('雖然前面有 to，但空格是 writes 的主詞（he/she writes），所以用 whoever。', 'Even after "to," the blank is the subject of "writes," so use "whoever."') },
  { text: 'This year, ___ students signed up for the trip than last year.', right: 'fewer', wrong: ['less'], why: T('students 可以數，用 fewer。', '"Students" can be counted, so use "fewer."') },
  { text: 'The new refrigerator uses ___ electricity than the old one.', right: 'less', wrong: ['fewer'], why: T('electricity 不可數，用 less。', '"Electricity" cannot be counted, so use "less."') },
  { text: '{A} made ___ mistakes on the second draft.', right: 'fewer', wrong: ['less'], why: T('mistakes 可數，用 fewer。', '"Mistakes" can be counted, so use "fewer."') },
  { text: 'There was ___ traffic on the bridge during the holiday.', right: 'less', wrong: ['fewer'], why: T('traffic 不可數，用 less。', '"Traffic" is uncountable, so use "less."') },
  { text: 'After the race, {A} needed to ___ down for an hour.', right: 'lie', wrong: ['lay'], why: T('lie（躺）不接受詞；lay（放置）要接受詞。這裡沒有受詞，用 lie。', '"Lie" (recline) takes no object; "lay" (put) needs one. There is no object, so "lie."') },
  { text: 'Please ___ the wet towels flat on the deck to dry.', right: 'lay', wrong: ['lie'], why: T('有受詞 the wet towels（放置某物），用 lay。', 'There is an object—the towels—so use "lay" (to put).') },
  { text: 'Yesterday the cat ___ in the sun all afternoon.', right: 'lay', wrong: ['laid', 'lied'], why: T('lie（躺）的過去式是 lay；laid 是 lay（放置）的過去式；lied 是「說謊」。', 'The past tense of "lie" (recline) is "lay." "Laid" is the past of "lay" (put), and "lied" means told a lie.') },
  { text: 'Before leaving, {A} ___ the keys on the counter.', right: 'laid', wrong: ['lay', 'lied'], why: T('有受詞 the keys，是 lay（放置）的過去式 laid。', 'The keys are the object, so we need the past of "lay" (put): "laid."') },
  { text: 'The old map had ___ in the drawer for decades.', right: 'lain', wrong: ['laid', 'lay'], why: T('lie（躺、放著）的過去分詞是 lain：had lain。', 'The past participle of "lie" (rest) is "lain": had lain.') },
  { text: 'The new bell schedule will ___ every student in the building.', right: 'affect', wrong: ['effect'], why: T('affect 是動詞「影響」；effect 多半是名詞「效果」。', '"Affect" is the verb "to influence"; "effect" is usually the noun "result."') },
  { text: 'The medicine had no noticeable ___ on the symptoms.', right: 'effect', wrong: ['affect'], why: T('冠詞 no 後面要名詞，用 effect（效果）。', 'After "no," we need a noun: "effect."') },
  { text: 'The student council hopes to ___ real change in the cafeteria.', right: 'effect', wrong: ['affect'], why: T('effect 當動詞是「促成、實現」：effect change = 帶來改變。', 'As a verb, "effect" means "to bring about": to effect change.') },
  { text: "Lack of sleep can seriously ___ a student's memory.", right: 'affect', wrong: ['effect'], why: T('這裡要動詞「影響」，用 affect。', 'We need the verb "to influence": "affect."') },
  { text: 'The committee ___ five teachers and two students.', right: 'comprises', wrong: ['comprises of', 'is comprising of'], why: T('comprise 是「包含」，後面直接接成員，不加 of。', '"Comprise" means "include" and takes its members directly—never "comprise of."') },
  { text: 'Five teachers and two students ___ the committee.', right: 'compose', wrong: ['comprise', 'comprise of'], why: T('部分「組成」整體用 compose；整體「包含」部分才用 comprise。', 'Parts COMPOSE the whole; the whole COMPRISES the parts.') },
  { text: 'The orchestra ___ more than ninety musicians.', right: 'comprises', wrong: ['comprises of', 'composes'], why: T('整體（樂團）包含部分（樂手），用 comprises，不加 of。', 'The whole (orchestra) comprises the parts (musicians)—no "of."') },
];

const HYPH = [
  ['{A} is applying for a part-time job at the aquarium.', ['{A} is applying for a part time job at the aquarium.', '{A} is applying for a part-time-job at the aquarium.'], 'b'],
  ['The council approved a long-term plan for the waterfront.', ['The council approved a long term plan for the waterfront.', 'The council approved a long-term-plan for the waterfront.'], 'b'],
  ['The teacher opened with an open-ended question.', ['The teacher opened with an open ended question.', 'The teacher opened with an open-ended-question.'], 'b'],
  ['The school opened a state-of-the-art science lab.', ['The school opened a state of the art science lab.', 'The school opened a state-of-the art science lab.'], 'b'],
  ['A last-minute change delayed the concert.', ['A last minute change delayed the concert.', 'A last-minute-change delayed the concert.'], 'b'],
  ['The museum hired a well-known architect for the new wing.', ['The museum hired a well known architect for the new wing.', 'The museum hired a well-known-architect for the new wing.'], 'b'],
  ['The journal published a highly regarded study on sleep.', ['The journal published a highly-regarded study on sleep.', 'The journal published a highly regarded-study on sleep.'], 'ly'],
  ['{A} wrote a carefully argued essay about water rights.', ['{A} wrote a carefully-argued essay about water rights.', '{A} wrote a carefully argued-essay about water rights.'], 'ly'],
  ['The city launched a newly designed bus map.', ['The city launched a newly-designed bus map.', 'The city launched a newly designed-bus map.'], 'ly'],
  ["{A}'s cousin is a ten-year-old chess champion.", ["{A}'s cousin is a ten year old chess champion.", "{A}'s cousin is a ten-years-old chess champion."], 'n'],
  ["{A}'s cousin is ten years old.", ["{A}'s cousin is ten-years-old.", "{A}'s cousin is ten-year-old."], 'p'],
  ['The committee released a 300-page report.', ['The committee released a 300 page report.', 'The committee released a 300-pages report.'], 'n'],
  ['The library offers a two-week loan on new releases.', ['The library offers a two weeks loan on new releases.', 'The library offers a two-weeks loan on new releases.'], 'n'],
  ['The hike took {A} three hours.', ['The hike took {A} three-hours.', 'The hike took {A} three-hour.'], 'p'],
];
const HYPH_WHY = {
  b: T('兩個以上的字一起修飾後面的名詞時（複合形容詞），要用連字號連起來，但名詞本身不連。', 'When two or more words work together as one adjective BEFORE a noun, hyphenate them—but do not hyphenate the noun itself.'),
  ly: T('以 -ly 結尾的副詞後面不加連字號：a highly regarded study。', 'Never hyphenate after an -ly adverb: a highly regarded study.'),
  n: T('數字 + 單位放在名詞前當形容詞時要連字號，而且單位用單數：a ten-year-old student、a two-week loan。', 'A number + unit used as an adjective before a noun is hyphenated and stays singular: a ten-year-old student, a two-week loan.'),
  p: T('數字 + 單位不在名詞前（放在動詞後面）時，就是普通名詞片語，不加連字號：ten years old。', 'When the number + unit does not come before a noun, it is an ordinary phrase: no hyphens (ten years old).'),
};

const CUMUL = [
  'The old ferry pulled away from the dock, its horn echoing across the bay, gulls wheeling above its wake.',
  '{A} crossed the finish line, arms raised, lungs burning, grinning at the crowd.',
  'The storm reached the coast at midnight, bending the palms, flooding the streets, knocking out power to half the city.',
  '{A} opened the acceptance letter slowly, hands trembling, reading each line twice.',
  'The orchestra began the final movement, the violins rising softly, the cellos answering beneath them.',
  'The city woke up gradually, delivery trucks rumbling down empty avenues, bakeries switching on their lights.',
  '{A} kept writing, ignoring the clock, crossing out whole paragraphs, starting again.',
  'The market was crowded, vendors calling out prices, children weaving between the stalls.',
];
const PERIOD = [
  'After months of rehearsals, two broken strings, and one disastrous dress rehearsal, the orchestra finally performed the symphony.',
  'Through the snow, past the closed shops, and across the frozen river, {A} walked home alone.',
  'Although the team had lost every game in September and its best player was injured, it won the championship.',
  'With the lights dimmed, the audience silent, and the stage empty except for a single chair, {A} began to speak.',
  'Without a map, without a phone, and with only an hour of daylight left, the hikers found the trail.',
  'If the dam fails, if the river rises another meter, or if the rain does not stop by morning, the town will flood.',
  'Of all the lessons {A} learned that summer on the farm, the most lasting was patience.',
  'Buried under decades of dust in the attic of the old library, the letters were finally discovered.',
];

const APPEAL = { e: T('人格訴求 Ethos（可信度）', 'Ethos (credibility)'), p: T('情感訴求 Pathos（情感）', 'Pathos (emotion)'), l: T('理性訴求 Logos（邏輯、數據）', 'Logos (logic and evidence)') };
const APPEALS = [
  ['As a nurse who has worked in this emergency room for twenty years, I have seen what happens when ambulances arrive late.', 'e'],
  ['Having coached youth soccer for a decade, I know how much a safe field matters to young players.', 'e'],
  ['Our engineers have inspected bridges in this state since 1975, and we have never issued a warning lightly.', 'e'],
  ['{A}, a marine biologist who has studied these reefs for fifteen years, warns that the damage is accelerating.', 'e'],
  ['I have read every page of the proposed budget, and I have met personally with each department head.', 'e'],
  ['Picture the faces of the children who will play in this park for the next fifty years.', 'p'],
  ["The shelter's dogs press their noses against the fence every time the gate opens, hoping this visitor is the one.", 'p'],
  ['Think of your grandparents, who saved for decades so that you could sit in a classroom like this one.', 'p'],
  ['Imagine a first grader standing alone at a dark bus stop, clutching a lunchbox, waiting for a bus that is twenty minutes late.', 'p'],
  ['Since the crosswalk was installed, accidents at the intersection have fallen from twelve a year to two.', 'l'],
  ['If each of our 1,200 students saves one plastic bottle a day, we will keep more than 200,000 bottles out of landfills in a single school year.', 'l'],
  ['Three independent studies found that students who slept eight hours scored higher on memory tests than those who slept six.', 'l'],
  ['The new pump costs $4,000 but saves $1,500 a year in energy, so it will pay for itself in less than three years.', 'l'],
  ['Because the bridge now carries twice the traffic it was designed for, engineers expect its supports to wear out decades early.', 'l'],
];

const DEV = {
  anaphora: T('首語重複（anaphora）', 'Anaphora'), antithesis: T('對照（antithesis）', 'Antithesis'), chiasmus: T('交錯配列（chiasmus）', 'Chiasmus'),
  rq: T('修辭問句（rhetorical question）', 'Rhetorical question'), tricolon: T('三重句（tricolon）', 'Tricolon'), polysyndeton: T('連詞疊用（polysyndeton）', 'Polysyndeton'),
};
const DEVICES = [
  ['We will not wait for permission. We will not wait for perfect conditions. We will not wait for someone else to act.', 'anaphora', ['tricolon']],
  ['This library taught me to read; this library taught me to question; this library taught me to belong.', 'anaphora', ['tricolon']],
  ['Every morning the fishermen checked the tide, every evening they checked the sky, every night they checked the radio, and every dawn they went out anyway.', 'anaphora', ['tricolon', 'polysyndeton']],
  ['We lost the game but won the respect of every fan in the stadium.', 'antithesis', ['chiasmus']],
  ['It is easy to promise change; it is hard to deliver it.', 'antithesis', ['chiasmus']],
  ['Our opponents offer speed; we offer substance.', 'antithesis', ['chiasmus']],
  ['We do not stop learning because we grow old; we grow old because we stop learning.', 'chiasmus', ['antithesis']],
  ['Work to live; do not live to work.', 'chiasmus', ['antithesis']],
  ['The city did not shape its river so much as the river shaped its city.', 'chiasmus', ['antithesis']],
  ['If we will not protect this river, who will?', 'rq', []],
  ['How many more summers must we spend swimming in a polluted lake?', 'rq', []],
  ['Is a library really a luxury when it is the only free classroom some children have?', 'rq', []],
  ['The plan is cheap, simple, and fast.', 'tricolon', ['polysyndeton']],
  ['She arrived in the city with a suitcase, a library card, and a stubborn dream.', 'tricolon', ['polysyndeton']],
  ['Our goal is to listen carefully, decide fairly, and act quickly.', 'tricolon', ['polysyndeton']],
  ['We hiked and climbed and scrambled and slid until the summit finally came into view.', 'polysyndeton', ['tricolon', 'anaphora']],
  ['The storm took the roof and the fence and the garden and the old oak by the gate.', 'polysyndeton', ['tricolon', 'anaphora']],
];
const DEV_WHY = {
  anaphora: T('連續幾個句子或子句用<b>同樣的字詞開頭</b>（We will not wait…），就是首語重複，用來加強氣勢。', 'Several clauses <b>begin with the same words</b>—that repetition at the start is anaphora, and it builds momentum.'),
  antithesis: T('把<b>相反的概念</b>放在平行的結構裡對照（lost… won、easy… hard），就是對照。', 'Two <b>opposite ideas</b> are set side by side in parallel form (lost… won, easy… hard): antithesis.'),
  chiasmus: T('第二半句把第一半句的字詞<b>倒過來排列</b>（A B → B A），就是交錯配列。', 'The second half <b>reverses the order</b> of the key words in the first half (A B → B A): chiasmus.'),
  rq: T('這個問句<b>不是要人回答</b>，而是用來強調論點，是修辭問句。', 'The question <b>expects no answer</b>; it is asked to make a point: a rhetorical question.'),
  tricolon: T('三個<b>長度和結構相似</b>的項目排在一起，就是三重句，聽起來有力又完整。', 'Three <b>parallel items</b> of similar length in a row make a tricolon, which sounds complete and forceful.'),
  polysyndeton: T('每個項目之間都<b>重複用 and</b>，就是連詞疊用，製造累積、喘不過氣的感覺。', 'Repeating <b>"and" between every item</b> is polysyndeton; it creates a piling-up, breathless effect.'),
};

const FALL = {
  adh: T('人身攻擊（ad hominem）', 'Ad hominem'), straw: T('稻草人謬誤（straw man）', 'Straw man'), dil: T('假兩難（false dilemma）', 'False dilemma'),
  slope: T('滑坡謬誤（slippery slope）', 'Slippery slope'), hasty: T('以偏概全（hasty generalization）', 'Hasty generalization'), band: T('從眾謬誤（bandwagon）', 'Bandwagon'),
  auth: T('訴諸不當權威（false authority）', 'Appeal to false authority'), post: T('錯誤因果（post hoc）', 'Post hoc (false cause)'), red: T('轉移焦點（red herring）', 'Red herring'), circ: T('循環論證（circular reasoning）', 'Circular reasoning'),
};
const FALLACIES = [
  ["We shouldn't listen to {A}'s plan for the recycling program; {A} can't even keep a locker clean.", 'adh', []],
  ["Don't trust Dr. Reyes's study on air pollution—she drives a huge truck.", 'adh', []],
  ['{A} wants a shorter school day, so apparently {A} thinks students should not learn anything at all.', 'straw', ['slope']],
  ['My opponent says we should study the cost of the stadium more carefully. Clearly, she wants our city to have no sports at all.', 'straw', ['slope']],
  ['Either we ban phones completely, or students will never learn anything again.', 'dil', ['slope']],
  ['Either you support the new gym, or you do not care about student health.', 'dil', []],
  ['If we let students choose one elective, soon they will want to choose all their classes, and before long no one will take math.', 'slope', ['dil']],
  ['If the town allows one food truck downtown, restaurants will close, the streets will fill with trucks, and downtown will be ruined.', 'slope', ['dil']],
  ['I met two rude tourists from that city, so everyone from there must be rude.', 'hasty', ['post']],
  ['My cousin got a sunburn using that sunscreen once, so the brand clearly does not work.', 'hasty', ['post']],
  ['Everyone at school is buying these sneakers, so they must be the best ones.', 'band', ['auth']],
  ['Millions of people have downloaded this app, so it must be safe.', 'band', ['auth']],
  ['A famous basketball player says this vitamin improves memory, so it must work.', 'auth', ['band']],
  ['{A} wore lucky socks on the day of the exam and got an A, so the socks must have helped.', 'post', ['hasty']],
  ['The town painted the bridge blue, and the next month accidents went up; the blue paint must be distracting drivers.', 'post', ['hasty']],
  ['You say the cafeteria food is unhealthy, but think about how hard the cafeteria staff work every day.', 'red', ['adh']],
  ['Why should we fix the library roof? Plenty of people in history learned to read without libraries at all.', 'red', []],
  ['This newspaper is trustworthy because it says it only prints the truth.', 'circ', []],
  ['{A} is the best captain because no one leads the team better than {A}.', 'circ', []],
];
const FALL_WHY = {
  adh: T('攻擊提出論點的人，而不是回應論點本身。', 'It attacks the person making the argument instead of the argument itself.'),
  straw: T('把對方的主張扭曲成更極端、更容易打倒的版本。', "It twists the other side's position into an extreme version that is easier to knock down."),
  dil: T('只給兩個選項，好像沒有其他可能。', 'It offers only two choices as if no other options exist.'),
  slope: T('聲稱一小步必然引發一連串越來越糟的後果，卻沒有證據。', 'It claims one small step will inevitably lead to a chain of disasters, without evidence.'),
  hasty: T('只根據很少的例子就推論出全面的結論。', 'It draws a sweeping conclusion from too few examples.'),
  band: T('因為很多人這樣做或相信，就認為它是對的。', 'It claims something is right or good because many people do it or believe it.'),
  auth: T('引用的「權威」並不是這個領域的專家。', 'The "authority" quoted is not an expert in this field.'),
  post: T('因為 B 發生在 A 之後，就認為 A 造成了 B。', 'It assumes that because B happened after A, A caused B.'),
  red: T('提出不相關的話題，把注意力從原本的問題轉開。', 'It brings up an unrelated point to distract from the real issue.'),
  circ: T('結論只是把前提換句話說，等於什麼都沒證明。', 'The conclusion simply restates the premise, so nothing is proved.'),
};

const g11 = [
  bankSkill({
    id: 'g11-contested-usage',
    grade: 11,
    unit: 'words',
    name: T('易混用法：who/whom、fewer/less、lay/lie、affect/effect、compose/comprise', 'Contested usage: who/whom, fewer/less, lay/lie, affect/effect, compose/comprise'),
    std: 'CCSS L.11-12.1b',
    lesson: {
      zh: '<b>who</b> 當主詞、<b>whom</b> 當受詞（試著用 he/him 代換）。<b>fewer</b> 用在可數、<b>less</b> 用在不可數。<b>lie</b>（躺）不接受詞，過去式 lay；<b>lay</b>（放）接受詞，過去式 laid。<b>affect</b> 動詞「影響」、<b>effect</b> 名詞「效果」。整體 <b>comprises</b> 部分（不加 of）；部分 <b>compose</b> 整體。',
      en: '<b>Who</b> is a subject, <b>whom</b> an object (test with he/him). <b>Fewer</b> for things you can count, <b>less</b> for amounts. <b>Lie</b> (recline) takes no object, past "lay"; <b>lay</b> (put) takes an object, past "laid." <b>Affect</b> is usually the verb, <b>effect</b> the noun. The whole <b>comprises</b> the parts (no "of"); the parts <b>compose</b> the whole.',
      ex: ['The candidate <b>whom</b> we chose… / The student <b>who</b> won…', '<b>Fewer</b> cars, <b>less</b> traffic.', 'The cat <b>lay</b> in the sun; she <b>laid</b> the keys down.'],
    },
  }, USAGE, { q: T('在正式書面英文中，空格應填哪個字？', 'In formal written English, which word belongs in the blank?'), hint: T('who/whom 用 he/him 代換試試看。', 'For who/whom, try substituting he/him.') }),
  {
    id: 'g11-hyphens',
    grade: 11,
    unit: 'mechanics',
    name: T('連字號：複合形容詞', 'Hyphenation: compound modifiers'),
    std: 'CCSS L.11-12.2a',
    lesson: {
      zh: '兩個字合起來修飾後面的名詞時要加連字號：a <b>long-term</b> plan、a <b>ten-year-old</b> girl。但是：①<b>-ly 副詞</b>後面不加（a highly regarded study）②放在名詞<b>後面</b>的數字片語不加（she is ten years old）。',
      en: 'Hyphenate words that work together as one adjective before a noun: a <b>long-term</b> plan, a <b>ten-year-old</b> girl. But (1) never after an <b>-ly adverb</b> (a highly regarded study), and (2) not when a number phrase comes <b>after</b> the verb (she is ten years old).',
      ex: ['a <b>part-time</b> job', 'a <b>highly regarded</b> study', 'a <b>300-page</b> report / The report is 300 pages long.'],
    },
    gen(r) {
      const [right, wrong, k] = subst(r.pick(HYPH), cast(r));
      return {
        q: T('哪一個句子的連字號用法正確？', 'Which sentence uses hyphens correctly?'),
        ans: ansChoice([right, ...wrong]),
        sol: [HYPH_WHY[k], say(right)],
        hint: T('這組字是放在名詞前面，一起當形容詞嗎？', 'Do the words come before a noun and act as one adjective?'),
      };
    },
  },
  {
    id: 'g11-cumulative-periodic',
    grade: 11,
    unit: 'sentences',
    name: T('句法變化：累積句與掉尾句', 'Syntax variety: cumulative vs. periodic sentences'),
    std: 'CCSS L.11-12.3a',
    lesson: {
      zh: '<b>累積句</b>（cumulative / loose）先給主要子句，再一層層加上細節，讀起來自然、像鏡頭慢慢推近。<b>掉尾句</b>（periodic）把主要子句留到最後，製造懸念和強調。好的文章會交替使用。',
      en: 'A <b>cumulative</b> (loose) sentence states the main clause first, then piles on details—natural, like a camera moving closer. A <b>periodic</b> sentence holds the main clause until the end, building suspense and emphasis. Strong writers mix both.',
      ex: ['Cumulative: <b>The ferry pulled away</b>, its horn echoing, gulls wheeling above.', 'Periodic: Through the snow and across the frozen river, <b>she walked home alone</b>.'],
    },
    gen(r) {
      const cum = r.chance(0.5), s = subst(r.pick(cum ? CUMUL : PERIOD), cast(r));
      const C = T('累積句：主要子句在前，細節接在後面', 'Cumulative: the main clause comes first, details follow');
      const P = T('掉尾句：主要子句延到句末才出現', 'Periodic: the main clause is held until the end');
      const X3 = T('並列句：兩個獨立子句用 and 連接', 'Compound: two independent clauses joined by "and"');
      return {
        q: T('這個句子是累積句還是掉尾句？', 'Is this sentence cumulative or periodic?'),
        text: s,
        ans: ansChoice([cum ? C : P, cum ? P : C, X3]),
        sol: [cum ? T('句子一開始就是完整的主要子句（誰做了什麼），後面的逗號片語都在補充細節。', 'The sentence opens with the complete main clause (who did what); everything after the comma adds detail.')
          : T('句子前面都是片語或從屬子句，主要子句（主詞 + 動詞）到最後才出現。', 'The opening is all phrases or dependent clauses; the main subject and verb arrive only at the end.'),
        T('這個句子只有一個主要子句，所以不是並列句。', 'There is only one main clause, so it is not a compound sentence.')],
        hint: T('先找主詞和主要動詞：它們在句首還是句尾？', 'Find the main subject and verb: are they at the start or the end?'),
      };
    },
  },
  {
    id: 'g11-rhetorical-appeals',
    grade: 11,
    unit: 'style',
    name: T('修辭訴求：ethos、pathos、logos', 'Rhetorical appeals: ethos, pathos, logos'),
    std: 'CCSS RI.11-12.6 · AP Lang',
    lesson: {
      zh: '<b>Ethos</b>：建立說話者的可信度（經驗、專業、公正）。<b>Pathos</b>：引發讀者的情感（畫面、故事、價值）。<b>Logos</b>：用邏輯、數據和推理說服。AP 寫作時不只要指出訴求，還要說明它<b>為什麼有效</b>。',
      en: '<b>Ethos</b> builds the speaker\'s credibility (experience, expertise, fairness). <b>Pathos</b> moves the audience\'s emotions (images, stories, values). <b>Logos</b> persuades with logic, data, and reasoning. On the AP exam, do not just name the appeal—explain <b>why it works</b>.',
      ex: ['Ethos: "As a nurse for twenty years, I have seen…"', 'Pathos: "Picture the faces of the children…"', 'Logos: "Accidents fell from twelve a year to two."'],
    },
    gen(r) {
      const [s, k] = subst(r.pick(APPEALS), cast(r));
      const why = { e: T('說話者用自己的經歷或專業建立可信度，讓聽眾相信他。', 'The speaker points to experience or expertise to earn the audience\'s trust.'), p: T('用具體畫面引起同情、懷念或擔心等情感。', 'A vivid image stirs feelings such as sympathy, gratitude, or worry.'), l: T('用數字、研究或因果推理來證明論點。', 'Numbers, studies, or cause-and-effect reasoning prove the point.') }[k];
      return {
        q: T('這句話主要運用哪一種修辭訴求？', 'Which rhetorical appeal does this sentence mainly use?'),
        text: s,
        ans: ansChoice([APPEAL[k], ...['e', 'p', 'l'].filter((x) => x !== k).map((x) => APPEAL[x])]),
        sol: [why, say(APPEAL[k])],
        hint: T('它靠的是「誰在說」、「感覺」，還是「證據」？', 'Does it rely on who is speaking, on feelings, or on evidence?'),
      };
    },
  },
  {
    id: 'g11-rhetorical-devices',
    grade: 11,
    unit: 'style',
    name: T('修辭技巧：首語重複、對照、交錯、修辭問句、三重句', 'Rhetorical devices: anaphora, antithesis, chiasmus, rhetorical question, tricolon'),
    std: 'CCSS L.11-12.5 · AP Lang',
    lesson: {
      zh: '<b>Anaphora</b> 首語重複；<b>Antithesis</b> 把相反概念並列；<b>Chiasmus</b> 交錯配列（A B → B A）；<b>Rhetorical question</b> 不需回答的問句；<b>Tricolon</b> 三個平行的項目；<b>Polysyndeton</b> 重複用 and。',
      en: '<b>Anaphora</b>: repeating the opening words. <b>Antithesis</b>: opposites set side by side. <b>Chiasmus</b>: reversed order (A B → B A). <b>Rhetorical question</b>: asked for effect, not an answer. <b>Tricolon</b>: three parallel items. <b>Polysyndeton</b>: "and… and… and."',
      ex: ['"We do not stop learning because we grow old; we grow old because we stop learning." (chiasmus)', '"It is easy to promise change; it is hard to deliver it." (antithesis)'],
    },
    gen(r) {
      const [s, k, not] = r.pick(DEVICES);
      const others = r.sample(Object.keys(DEV).filter((x) => x !== k && !not.includes(x)), 3);
      return {
        q: T('這句話用了哪一種修辭技巧？', 'Which rhetorical device does this sentence use?'),
        text: s,
        ans: ansChoice([DEV[k], ...others.map((x) => DEV[x])]),
        sol: [DEV_WHY[k], say(DEV[k])],
        hint: T('注意重複的字、相反的概念、倒過來的順序，或項目的數量。', 'Look for repeated words, opposites, reversed order, or the number of items.'),
      };
    },
  },
  {
    id: 'g11-tone-diction',
    grade: 11,
    unit: 'words',
    name: T('語氣與用字（含意）', 'Tone and diction (connotation)'),
    std: 'CCSS L.11-12.5b',
    lesson: {
      zh: '<b>語氣</b>（tone）是作者對題材的態度：諷刺（sardonic / wry）、懷舊（nostalgic）、憤慨（indignant）、不祥（ominous）、敬畏（reverent）、客觀（objective）…。語氣來自<b>用字</b>（diction）：意思相近的字，<b>含意</b>（connotation）可能一正一負，如 slender／scrawny。',
      en: '<b>Tone</b> is the writer\'s attitude toward the subject: wry, nostalgic, indignant, ominous, reverent, objective… Tone comes from <b>diction</b>: words with similar meanings can carry opposite <b>connotations</b>, like slender vs. scrawny.',
      ex: ['"The council, in its infinite wisdom, has scheduled another meeting." → sarcastic', 'aroma (positive) / smell (neutral) / stench (negative)'],
    },
    gen(r) {
      if (r.chance(0.55)) {
        const items = [
          ['The city council, in its infinite wisdom, has decided that the best way to fix the potholes is to hold another meeting about them.', 'sarcastic', ['reverent', 'nostalgic', 'admiring']],
          ["I still remember the smell of my grandmother's kitchen on winter mornings—cardamom, toast, and the radio murmuring songs I can no longer name.", 'nostalgic', ['indignant', 'sarcastic', 'clinical']],
          ['It is an outrage that, in one of the richest countries on Earth, children still go to school hungry.', 'indignant', ['nostalgic', 'playful', 'indifferent']],
          ['The water in Beaker A was heated to 80 degrees Celsius and allowed to cool for ten minutes before the second measurement was taken.', 'objective', ['sentimental', 'sarcastic', 'urgent']],
          ['Somewhere beyond the ridge, the dogs had stopped barking, and the silence that followed felt like a held breath.', 'ominous', ['cheerful', 'sarcastic', 'lighthearted']],
          ['We have one week. If the levee is not repaired by Friday, the next storm will reach the school.', 'urgent', ['nostalgic', 'whimsical', 'reverent']],
          ['The old cathedral rose above the square, its stone worn smooth by eight centuries of hands and prayers.', 'reverent', ['mocking', 'indignant', 'flippant']],
          ["My little brother's science fair volcano erupted exactly as planned, provided the plan was to coat the ceiling in baking soda.", 'humorous', ['solemn', 'bitter', 'reverent']],
          ['Fine. Let them pave the meadow for a parking lot. It is not as if anyone ever listens to us anyway.', 'resigned', ['hopeful', 'reverent', 'enthusiastic']],
          ['Every one of you has the power to change this school, and I cannot wait to see what you build together.', 'optimistic', ['cynical', 'ominous', 'detached']],
        ];
        const [s, right, wrong] = r.pick(items);
        return {
          q: T('哪一個字最能形容這段文字的語氣？', 'Which word best describes the tone of this passage?'),
          text: s,
          ans: ansChoice([right, ...r.sample(wrong, 3)]),
          sol: [T('從用字判斷作者的態度：注意帶有情緒的字詞、誇張或反話。', 'Read the diction for the writer\'s attitude: charged words, exaggeration, or saying the opposite of what is meant.'), say(right)],
          hint: T('作者對這件事的態度是什麼？', 'What is the writer\'s attitude toward the subject?'),
        };
      }
      const sets = [['slender', 'thin', 'scrawny'], ['aroma', 'smell', 'stench'], ['youthful', 'young', 'childish'], ['steadfast', 'unchanging', 'stubborn'], ['vintage', 'old', 'outdated'], ['assertive', 'direct', 'pushy'], ['relaxed', 'slow', 'lazy'], ['cottage', 'small house', 'shack'], ['inquisitive', 'questioning', 'nosy'], ['economical', 'inexpensive', 'cheap']];
      const set = r.pick(sets), pos = r.chance(0.5), right = pos ? set[0] : set[2];
      return {
        q: T(`這三個字意思相近。哪一個的含意最${pos ? '正面' : '負面'}？`, `These words have similar meanings. Which has the most ${pos ? 'positive' : 'negative'} connotation?`),
        ans: ansChoice([right, set[1], pos ? set[2] : set[0]]),
        sol: [T(`「${set[0]}」帶有讚美、「${set[1]}」比較中性、「${set[2]}」帶有批評的意味。`, `"${set[0]}" sounds approving, "${set[1]}" is fairly neutral, and "${set[2]}" sounds critical.`), say(right)],
        hint: T('如果有人這樣形容你，你會高興還是不高興？', 'If someone described you with this word, would you be pleased?'),
      };
    },
  },
  {
    id: 'g11-fallacies',
    grade: 11,
    unit: 'organization',
    name: T('辨認邏輯謬誤', 'Identifying logical fallacies'),
    std: 'CCSS RI.11-12.8',
    lesson: {
      zh: '邏輯謬誤是看似有理、其實推理錯誤的論證。常見的有：人身攻擊、稻草人、假兩難、滑坡、以偏概全、從眾、訴諸不當權威、錯誤因果、轉移焦點、循環論證。寫論說文時要避免，分析別人的論證時要能指出來。',
      en: 'A logical fallacy is reasoning that sounds convincing but is flawed. Common ones: ad hominem, straw man, false dilemma, slippery slope, hasty generalization, bandwagon, false authority, post hoc, red herring, circular reasoning. Avoid them in your own arguments and name them in others\'.',
      ex: ['"Either we ban phones or students learn nothing." → false dilemma', '"It must be safe—millions use it." → bandwagon'],
    },
    gen(r) {
      const [s, k, not] = subst(r.pick(FALLACIES), cast(r));
      const others = r.sample(Object.keys(FALL).filter((x) => x !== k && !not.includes(x)), 3);
      return {
        q: T('這個論證犯了哪一種邏輯謬誤？', 'Which logical fallacy does this argument commit?'),
        text: s,
        ans: ansChoice([FALL[k], ...others.map((x) => FALL[x])]),
        sol: [FALL_WHY[k], say(FALL[k])],
        hint: T('這個推理錯在哪一步？', 'Where exactly does the reasoning go wrong?'),
      };
    },
  },
  bankSkill({
    id: 'g11-ap-thesis',
    grade: 11,
    unit: 'paragraphs',
    name: T('AP Lang 論點句：主張 + 推理脈絡', 'AP Lang thesis: claim + line of reasoning'),
    std: 'AP English Language · Thesis',
    lesson: {
      zh: 'AP Lang 的論點句要<b>回應題目</b>、提出<b>可辯護的主張</b>，並預告<b>推理脈絡</b>（line of reasoning）。修辭分析的論點要說出作者的<b>選擇</b>和這些選擇達成的<b>目的</b>，不能只列出 ethos、pathos、logos。',
      en: 'An AP Lang thesis <b>answers the prompt</b>, makes a <b>defensible claim</b>, and previews a <b>line of reasoning</b>. In rhetorical analysis, name the writer\'s <b>choices</b> and the <b>purpose</b> they serve—never just list "ethos, pathos, and logos."',
      ex: ['Weak: The ranger uses ethos, pathos, and logos.', 'Strong: By pairing a story of a trampled meadow with data on how slowly alpine plants recover, the ranger convinces visitors that one step off the trail can erase decades of growth.'],
    },
  }, [
    { text: 'Prompt: Analyze the rhetorical choices a park ranger makes in a talk urging visitors to stay on marked trails.', right: 'By pairing a vivid story of a trampled meadow with simple data on how slowly alpine plants recover, the ranger convinces visitors that a single step off the trail can erase decades of growth.', wrong: ['The ranger uses ethos, pathos, and logos in the talk.', 'The ranger gives a talk about staying on marked trails.', 'Staying on trails is important for many reasons.', "In this essay, I will analyze the ranger's rhetorical choices."], why: T('正確答案指出具體的修辭選擇（故事＋數據）和目的（說服遊客）；只列 ethos/pathos/logos 沒有說明作用。', 'The answer names specific choices (a story plus data) and their purpose; a bare list of appeals explains nothing.') },
    { text: 'Prompt: Write an argument about whether failure is necessary for success.', right: 'Failure is not merely an obstacle to success but its most reliable teacher, because mistakes expose weaknesses that praise conceals and build the resilience that ambitious goals demand.', wrong: ['Failure and success are two sides of the same coin.', 'There are many examples of people who failed before they succeeded.', 'This essay will discuss failure and success.', 'Failure can be both good and bad.'], why: T('正確答案有可辯護的主張和兩個推理方向；其他選項太空泛或只是宣告。', 'The answer makes a defensible claim with two lines of reasoning; the others are vague or merely announce a topic.') },
    { text: "Prompt: Analyze how a mayor's speech after a flood persuades residents to rebuild rather than relocate.", right: "The mayor recasts the flood as a chapter in the town's long history of recovery, using memories of earlier rebuilding and a closing call to shared pride to persuade residents that leaving would betray who they are.", wrong: ['The mayor talks about the flood and asks people to rebuild.', 'The mayor uses many rhetorical devices, such as imagery and repetition.', 'Floods are terrible disasters that affect many families.', 'The speech is very persuasive and well written.'], why: T('正確答案說明市長「怎麼做」（重塑歷史、喚起驕傲）和「為了什麼」（說服居民留下）。', 'The answer explains HOW the mayor persuades (reframing history, shared pride) and WHY (to keep residents from leaving).') },
    { text: 'Prompt: Write an argument about whether communities should preserve old buildings.', right: 'Communities should preserve old buildings when they can be adapted for new uses, because reuse protects local identity, saves the energy already stored in the structures, and keeps neighborhoods affordable.', wrong: ['Old buildings are found in many cities around the world.', 'Some people like old buildings and some people do not.', 'I will explain my opinion about old buildings in this essay.', 'Should old buildings be saved?'], why: T('正確答案有限定條件的主張（可以改作新用途時）和三個理由。', 'The answer gives a qualified claim (when they can be adapted) and three reasons.') },
    { text: 'Prompt: Analyze how a commencement speaker uses the extended metaphor of a relay race to advise graduates.', right: "By comparing life to a relay race in which each runner carries a baton earned by others, the speaker reframes success as a debt of gratitude, urging graduates to measure their achievements by what they pass on.", wrong: ['The speaker uses a metaphor about a relay race.', 'The speaker tells graduates many things about life and success.', 'Graduation is an exciting time in every student\'s life.', 'The speaker uses pathos to make the audience emotional.'], why: T('只說「用了隱喻」不夠，要說明隱喻改變了什麼看法、達成什麼目的。', 'Saying "uses a metaphor" is not enough; the thesis explains what the metaphor reframes and why.') },
    { text: 'Prompt: Write an argument about whether competition improves learning.', right: 'Competition improves learning only when students compete against their own past performance, because rivalry with peers rewards the appearance of mastery rather than the struggle that produces it.', wrong: ['Competition is everywhere in schools today.', 'Competition has advantages and disadvantages.', 'In this essay, I will talk about competition and learning.', 'Everyone has a different opinion about competition.'], why: T('正確答案提出有條件的主張並說明理由；「有好有壞」不是論點。', 'The answer makes a qualified claim and explains why; "advantages and disadvantages" is not a position.') },
    { text: 'Prompt: Analyze how a scientist, writing to high school students, persuades them to consider careers in research.', right: 'The scientist wins over skeptical teenagers by admitting her own early failures, then turning those confessions into an invitation: research, she suggests, rewards exactly the curiosity and stubbornness that students already have.', wrong: ['The scientist writes a letter to high school students about research careers.', 'The scientist uses ethos, pathos, and logos to persuade students.', 'Science is an important field with many career options.', 'The letter is effective because it is interesting.'], why: T('正確答案說明作者的策略（坦承失敗→轉為邀請）和效果。', 'The answer explains the strategy (confessing failure, then inviting) and its effect on the audience.') },
  ], { q: T('哪一個是最好的 AP 論點句？', 'Which is the strongest AP-style thesis for this prompt?'), hint: T('它有沒有說出「選擇」和「目的」，或「主張」和「理由」？', 'Does it name choices and purpose, or a claim and reasons?') }),
  bankSkill({
    id: 'g11-synthesis',
    grade: 11,
    unit: 'research',
    name: T('綜合寫作：讓來源對話', 'Synthesis: putting sources in conversation'),
    std: 'CCSS W.11-12.8 · AP Lang Synthesis',
    lesson: {
      zh: '綜合寫作（synthesis）不是一個個摘要來源，而是讓<b>來源彼此對話</b>來支持<b>你的主張</b>：指出它們如何互相支持、補充或衝突，並標明出處，例如 (Source A)。',
      en: 'Synthesis is not summarizing sources one by one. Put the <b>sources in conversation</b> to support <b>your claim</b>—show how they confirm, extend, or complicate each other—and cite each one, e.g., (Source A).',
      ex: ['Weak: Source A says… Source B says…', 'Strong: While Source A shows that bike lanes cut injuries, Source C suggests the benefit depends on protected barriers—so the city should fund protected lanes, not paint.'],
    },
  }, [
    { text: 'Your claim: The city should build protected bike lanes.<br>Source A: Cities with bike lanes saw fewer cycling injuries.<br>Source C: Painted lanes without barriers showed little safety benefit.', right: 'Although bike lanes in general reduce cycling injuries (Source A), the benefit appears to depend on physical barriers (Source C), so the city should invest in protected lanes rather than paint.', wrong: ['Source A says bike lanes reduce injuries. Source C says painted lanes do not help much.', 'Bike lanes reduce injuries, and painted lanes do not help much.', 'According to Source C, bike lanes are useless and should not be built.', 'Bike lanes are a hot topic, and many sources discuss them (Source A) (Source C).'], why: T('正確答案把兩個來源連起來（A 的好處取決於 C 的條件），並導向自己的主張，也標了出處。', 'The answer links the sources (A\'s benefit depends on C\'s condition), uses them for the claim, and cites both.') },
    { text: 'Your claim: Schools should limit homework.<br>Source B: Over two hours of homework a night shows little added benefit for test scores.<br>Source D: Students with heavy homework loads report more stress and less sleep.', right: 'Since homework beyond two hours adds little to achievement (Source B) while heavy loads raise stress and cut sleep (Source D), schools have good reason to cap nightly assignments.', wrong: ['Source B is about homework and test scores. Source D is about homework and stress.', 'Homework past two hours adds little, and heavy loads cause stress.', 'Source D proves that all homework causes stress, so homework should be banned.', 'Many people have opinions about homework, as shown in Sources B and D.'], why: T('正確答案說明兩個來源合起來的意義（好處少、代價高），支持限制作業的主張。', 'The answer shows what the sources mean together (little benefit, real cost) in support of the claim.') },
    { text: 'Your claim: Museums should return artifacts to their countries of origin when asked.<br>Source A: Many artifacts were taken during periods of colonial rule.<br>Source E: Museums worry that returned objects may not be well preserved.', right: 'The preservation concerns some museums raise (Source E) deserve attention, but they do not outweigh the fact that many artifacts were taken under colonial rule (Source A), especially since museums can share conservation expertise when they return objects.', wrong: ['Source A talks about colonial rule. Source E talks about preservation.', 'Museums worry about preservation, but artifacts were taken during colonial rule.', 'Source E shows that no country can care for its own artifacts.', 'Artifacts are interesting objects found in museums around the world (Source A).'], why: T('正確答案處理了反方來源（E），再用 A 回應，並提出折衷方案。', 'The answer addresses the opposing source (E), answers it with A, and proposes a solution.') },
    { text: 'Your claim: Towns should invest in public libraries.<br>Source B: Library visits rose sharply during economic downturns.<br>Source C: Many families rely on libraries for free internet access.', right: "Libraries matter most when families have the least: visits surge during downturns (Source B), in part because many households depend on libraries for internet access they cannot afford at home (Source C).", wrong: ['Source B says library visits go up in downturns. Source C says families use library internet.', 'Library visits rise in downturns and families use the free internet.', 'Source C proves that no family has internet at home.', 'Libraries have existed for thousands of years and are mentioned in Source B.'], why: T('正確答案用 C 解釋 B 的現象，兩個來源一起支持「圖書館很重要」。', 'The answer uses Source C to explain the trend in Source B, so together they support the claim.') },
    { text: 'Your claim: Schools should start later.<br>Source A: Teenagers\' sleep cycles shift later during puberty.<br>Source D: A district that started at 8:45 saw attendance rise.', right: "Because teenagers' internal clocks shift later during puberty (Source A), it is not surprising that a district that moved its start to 8:45 saw attendance rise (Source D).", wrong: ['Source A is about sleep cycles, and Source D is about attendance.', 'Teen sleep cycles shift later, and attendance rose in one district.', 'Source D proves that every school in the country will have perfect attendance at 8:45.', 'Sleep is important, according to Source A and Source D.'], why: T('正確答案說明兩個來源之間的因果關係（生理時鐘 → 出席率），而不是並列。', 'The answer shows the cause-and-effect link between the sources instead of listing them.') },
  ], { q: T('哪一句最能把兩個來源綜合起來支持主張？', 'Which sentence best synthesizes the sources to support the claim?'), hint: T('好的綜合句會說明來源之間的「關係」。', 'Good synthesis explains how the sources relate.') }),
  bankSkill({
    id: 'g11-commentary',
    grade: 11,
    unit: 'paragraphs',
    name: T('評論 vs. 摘要', 'Commentary vs. summary'),
    std: 'AP English Language · Evidence and Commentary',
    lesson: {
      zh: '引用證據之後，一定要加上<b>評論</b>（commentary）：說明證據<b>如何、為什麼</b>支持你的主張。只是換句話說重述證據（summary），或說「這句話很有力」，都不算評論。',
      en: 'After evidence, always add <b>commentary</b>: explain <b>how and why</b> the evidence supports your claim. Restating the evidence (summary) or saying "this quote is powerful" is not commentary.',
      ex: ['Summary: This shows the river was polluted.', 'Commentary: By naming the children who could no longer swim there, the writer turns an abstract statistic into a loss the town can feel.'],
    },
  }, [
    { text: 'Claim: The ranger makes the danger of leaving the trail feel personal.<br>Evidence: She tells visitors that "the meadow you are standing beside took forty years to grow and one afternoon to destroy."', right: "By pointing to the very meadow beside the listeners, the ranger collapses forty years into a single careless afternoon, making each visitor feel personally responsible for the damage.", wrong: ['The ranger says the meadow took forty years to grow and one afternoon to destroy.', 'This quote is very powerful and effective.', 'Meadows are found in many national parks.', 'In other words, the meadow grew for forty years before it was destroyed.'], why: T('評論說明了這句話「如何」讓危險變得個人化；其他選項只是重述、空泛稱讚或離題。', 'The commentary explains HOW the line makes the danger personal; the others restate, praise vaguely, or wander off.') },
    { text: 'Claim: The mayor builds unity by stressing shared history.<br>Evidence: He reminds residents that "our grandparents rebuilt this street after the flood of 1952."', right: 'Invoking the flood of 1952 turns rebuilding into a family tradition, so leaving now would feel like breaking faith with the generations who stayed.', wrong: ['The mayor mentions that grandparents rebuilt the street after the 1952 flood.', 'This shows that there was a flood in 1952.', 'This quote uses ethos, pathos, and logos.', 'Floods were common in many towns in the 1950s.'], why: T('評論說明了引用歷史的「作用」：把重建變成家族傳統，讓離開像是背叛。', 'The commentary explains the EFFECT of invoking history: rebuilding becomes a family duty.') },
    { text: 'Claim: Later start times improve learning.<br>Evidence: After one district moved its start to 8:45, first-period grades rose by nearly half a letter grade.', right: 'Because first period is when sleep-deprived students struggle most, the improvement there suggests that the extra sleep, not easier classes, made the difference.', wrong: ['The district moved its start to 8:45, and first-period grades rose.', 'This is a very interesting statistic.', 'Many districts start school at different times.', 'Half a letter grade is the difference between a B and a B-plus, for example.'], why: T('評論解釋數據為什麼支持主張（第一節最受睡眠影響），而不是重述數字。', 'The commentary explains WHY the data supports the claim (first period is hit hardest by lack of sleep).') },
    { text: 'Claim: The scientist persuades students by admitting her failures.<br>Evidence: She writes, "My first experiment failed so badly that the lab smelled of burned sugar for a week."', right: 'The comic, sensory confession lowers the barrier between expert and student, suggesting that failure is a normal part of research rather than a sign that someone does not belong.', wrong: ['The scientist says her first experiment failed and the lab smelled like burned sugar.', 'This shows that the experiment did not work.', 'This is a funny quote that readers will enjoy.', 'Burned sugar has a very strong smell.'], why: T('評論說明這個自嘲的細節「為什麼」能說服學生：縮短專家與學生的距離。', 'The commentary explains why the funny confession persuades: it closes the gap between expert and student.') },
    { text: 'Claim: The essay argues that boredom fuels creativity.<br>Evidence: The author notes that she wrote her first published story "during a week without internet at my aunt\'s farm."', right: 'Her own story links the absence of distraction directly to creative output, turning an abstract claim about boredom into a concrete cause and effect.', wrong: ['The author wrote her first story during a week without internet.', 'This quote is about a farm and the internet.', 'This example is very relatable.', "The author's aunt has a farm."], why: T('評論把證據和主張連起來：沒有干擾 → 產生創作。', 'The commentary connects the evidence to the claim: no distraction led to creative work.') },
  ], { q: T('哪一句是最好的評論（commentary）？', 'Which sentence offers the best commentary on the evidence?'), hint: T('它有沒有解釋「如何」或「為什麼」？', 'Does it explain how or why?') }),
  {
    id: 'g11-apa-mla',
    grade: 11,
    unit: 'research',
    name: T('APA 與 MLA 引用格式', 'APA vs. MLA citations'),
    std: 'CCSS W.11-12.8',
    lesson: {
      zh: '<b>MLA</b>（人文學科）：引用文獻 <i>姓, 名. 書名. 出版社, 年.</i>，文中引用 (姓 頁碼)。<b>APA</b>（社會科學）：參考文獻 <i>姓, 名字縮寫. (年). 書名只有第一個字大寫. 出版社.</i>，文中引用 (姓, 年, p. 頁碼)。APA 重視<b>年份</b>，所以年份緊跟作者。',
      en: '<b>MLA</b> (humanities): <i>Last, First. Title. Publisher, Year.</i> In-text: (Last page). <b>APA</b> (social sciences): <i>Last, F. (Year). Title in sentence case. Publisher.</i> In-text: (Last, Year, p. page). APA puts the <b>year</b> right after the author because recency matters.',
      ex: ['MLA: Okafor, Amara. <i>The Patient Garden</i>. Juniper Press, 2021. → (Okafor 45)', 'APA: Okafor, A. (2021). <i>The patient garden</i>. Juniper Press. → (Okafor, 2021, p. 45)'],
    },
    gen(r) {
      const s = source(r), mode = r.int(0, 2), p = r.int(5, 280);
      if (mode === 0) {
        const right = apaEntry(s);
        const wrong = s.kind === 'book'
          ? [mlaEntry(s), `${s.last}, ${s.first[0]}. (${s.yr}). <i>${s.title}</i>. ${s.pub}.`, `${s.last}, ${s.first}. <i>${sc(s.title)}</i>. ${s.pub}, ${s.yr}.`, `${s.first[0]}. ${s.last} (${s.yr}). <i>${sc(s.title)}</i>. ${s.pub}.`]
          : [mlaEntry(s), `${s.last}, ${s.first[0]}. (${s.yr}, ${s.mon[1]} ${s.d}). ${s.title}${endP(s.title)} <i>${s.site}</i>. https://${s.url}`, `${s.last}, ${s.first[0]}. ${sc(s.title)}${endP(s.title)} <i>${s.site}</i>. https://${s.url} (${s.yr}).`];
        return {
          q: T('哪一個是正確的 APA（第 7 版）參考文獻？', 'Which is a correct APA (7th edition) reference entry?'),
          ans: ansChoice([right, ...r.sample(wrong, 3)]),
          sol: [T('APA：姓, 名字縮寫. (年份). 標題只有第一個字（和冒號後第一個字）大寫. 出處.', 'APA: Last, Initial. (Year). Title in sentence case—only the first word (and the first word after a colon) capitalized. Source.'), T('完整名字、年份放最後的是 MLA 格式。', 'A full first name with the year at the end is MLA style.'), say(right)],
          hint: T('APA 的年份放在哪裡？', 'Where does APA put the year?'),
        };
      }
      const apa = mode === 1;
      const right = apa ? `(${s.last}, ${s.yr}, p. ${p})` : `(${s.last} ${p})`;
      const wrong = apa ? [`(${s.last} ${p})`, `(${s.last}, p. ${p}, ${s.yr})`, `(${s.first} ${s.last}, ${s.yr})`, `(${s.yr}, ${s.last}, ${p})`] : [`(${s.last}, ${p})`, `(${s.last}, ${s.yr}, p. ${p})`, `(p. ${p})`, `(${s.first} ${s.last} p. ${p})`];
      return {
        q: T(`作者 ${s.first} ${s.last}，${s.yr} 年出版，引文在第 ${p} 頁。哪一個是正確的 ${apa ? 'APA' : 'MLA'} 文中引用？`, `Author ${s.first} ${s.last}, published ${s.yr}, quotation on page ${p}. Which is a correct ${apa ? 'APA' : 'MLA'} in-text citation?`),
        ans: ansChoice([right, ...r.sample(wrong, 3)]),
        sol: [apa ? T('APA 文中引用：(姓, 年, p. 頁碼)，用逗號分隔。', 'APA in-text: (Last, Year, p. page), separated by commas.') : T('MLA 文中引用：(姓 頁碼)，中間沒有逗號，也不寫年份或 p.。', 'MLA in-text: (Last page)—no comma, no year, no "p."'), say(right)],
        hint: T('MLA 只要姓和頁碼；APA 要年份。', 'MLA needs only name and page; APA adds the year.'),
      };
    },
  },
  bankSkill({
    id: 'g11-act-punctuation',
    grade: 11,
    unit: 'mechanics',
    name: T('ACT 標點：不必要的逗號', 'ACT-style punctuation: unnecessary commas'),
    std: 'CCSS L.11-12.2 (ACT)',
    lesson: {
      zh: 'ACT 最常考<b>多餘的逗號</b>：主詞和動詞之間、動詞和受詞（that 子句）之間、形容詞和名詞之間、複合述語（同一主詞的兩個動詞）的 but／and 前面，都<b>不加逗號</b>。只有在規則需要時才加。',
      en: 'The ACT loves <b>unnecessary commas</b>. No comma between a subject and its verb, between a verb and its object (including a "that" clause), between an adjective and its noun, or before "and/but" joining two verbs with the same subject. Add a comma only when a rule calls for one.',
      ex: ['The students in the class<s>,</s> built a catapult.', 'The report concluded<s>,</s> that the bridge was safe.', 'a cold, windy afternoon (two adjectives that could be joined by "and")'],
    },
  }, [
    { right: "The students in {A}'s physics class built a working catapult.", wrong: ["The students in {A}'s physics class, built a working catapult.", "The students, in {A}'s physics class built a working catapult.", "The students in {A}'s physics class built, a working catapult."], why: T('主詞（The students in…class）和動詞（built）之間不加逗號。', 'Never put a comma between the subject ("The students in… class") and its verb ("built").') },
    { right: 'The engineers concluded that the bridge was safe.', wrong: ['The engineers concluded, that the bridge was safe.', 'The engineers concluded that, the bridge was safe.', 'The engineers, concluded that the bridge was safe.'], why: T('動詞和它的受詞（that 子句）之間不加逗號。', 'No comma between a verb and its object, including a "that" clause.') },
    { right: 'It was a cold, windy afternoon in late March.', wrong: ['It was a cold windy, afternoon in late March.', 'It was a cold, windy, afternoon in late March.', 'It was a, cold windy afternoon in late March.'], why: T('對等形容詞（可以用 and 連接）之間加逗號，但最後一個形容詞和名詞之間不加。', 'Coordinate adjectives get a comma between them, but never between the last adjective and the noun.') },
    { right: 'After the final bell rang, the hallway filled with students.', wrong: ['After the final bell rang the hallway, filled with students.', 'After, the final bell rang the hallway filled with students.', 'After the final bell, rang the hallway filled with students.'], why: T('句首的從屬子句（After the final bell rang）後面加逗號，再接主要子句。', 'Put the comma after the opening dependent clause, then begin the main clause.') },
    { right: 'The bus was late, so {A} walked to school.', wrong: ['The bus was late so, {A} walked to school.', 'The bus was late, so, {A} walked to school.', 'The bus, was late so {A} walked to school.'], why: T('兩個完整句子用 so 連接時，逗號放在 so 前面。', 'When "so" joins two complete sentences, the comma goes before "so."') },
    { right: '{A} bought flour, eggs, and butter for the cake.', wrong: ['{A} bought, flour, eggs, and butter for the cake.', '{A} bought flour, eggs, and, butter for the cake.', '{A} bought flour eggs, and butter for the cake.'], why: T('清單的項目之間加逗號，但動詞和清單之間、and 和最後一項之間不加。', 'Commas separate list items, but not the verb from the list or "and" from the last item.') },
    { right: 'The novelist Toni Morrison won the Nobel Prize in 1993.', wrong: ['The novelist, Toni Morrison, won the Nobel Prize in 1993.', 'The novelist Toni Morrison, won the Nobel Prize in 1993.', 'The novelist, Toni Morrison won the Nobel Prize in 1993.'], why: T('小說家有很多位，名字 Toni Morrison 指出是哪一位，是必要資訊，不加逗號。', 'There are many novelists; the name tells WHICH one, so it is essential and takes no commas.') },
    { right: '{A} wanted to join the team but did not have time to practice.', wrong: ['{A} wanted to join the team, but did not have time to practice.', '{A} wanted to join the team but, did not have time to practice.', '{A}, wanted to join the team but did not have time to practice.'], why: T('同一個主詞的兩個動詞（wanted… did not have）用 but 連接時，不加逗號。', 'Two verbs sharing one subject (wanted… did not have) are joined by "but" with no comma.') },
    { right: 'Founded in 1890, the library is the oldest building on Main Street.', wrong: ['Founded in 1890 the library, is the oldest building on Main Street.', 'Founded in 1890, the library, is the oldest building on Main Street.', 'Founded, in 1890 the library is the oldest building on Main Street.'], why: T('句首的分詞片語後面加逗號；主詞 the library 和動詞 is 之間不加。', 'Put a comma after the opening phrase, but none between the subject "the library" and the verb "is."') },
  ], { q: T('哪一個句子的標點正確？', 'Which sentence is punctuated correctly?'), hint: T('先找主詞和動詞：它們之間有逗號嗎？', 'Find the subject and verb first: is there a comma between them?') }),
  bankSkill({
    id: 'g11-sentence-combining',
    grade: 11,
    unit: 'sentences',
    name: T('合併句子：從屬與同位語', 'Sentence combining: subordination and appositives'),
    std: 'CCSS L.11-12.3a',
    lesson: {
      zh: '把短句合併時，要用<b>正確的邏輯連接</b>：表因果用 because／so、表讓步用 although、補充說明用同位語或分詞片語。避免 comma splice、一連串的 and，以及邏輯錯誤的連接詞。',
      en: 'When combining short sentences, show the <b>right logical relationship</b>: because/so for cause, although for contrast, an appositive or participial phrase for extra detail. Avoid comma splices, strings of "and," and connectors that misstate the logic.',
      ex: ['Built in 1932, the bridge is the oldest in the county and still carries thousands of cars a day.'],
    },
  }, [
    { text: 'The bridge was built in 1932. It is the oldest bridge in the county. It still carries thousands of cars a day.', right: 'Built in 1932, the bridge is the oldest in the county and still carries thousands of cars a day.', wrong: ['The bridge was built in 1932, it is the oldest bridge in the county, it still carries thousands of cars a day.', 'Although the bridge was built in 1932, it is the oldest bridge in the county, and it still carries thousands of cars a day.', 'The bridge was built in 1932 and it is the oldest bridge in the county and it still carries thousands of cars a day.'], why: T('分詞片語 Built in 1932 收進年份，再用 and 連接兩個述語；Although 表示讓步，邏輯不對。', 'The phrase "Built in 1932" absorbs the date, and "and" joins two verbs. "Although" signals a contrast that is not there.') },
    { text: '{A} had practiced the speech for weeks. {A} was still nervous. The audience was much larger than expected.', right: 'Although {A} had practiced the speech for weeks, the unexpectedly large audience still made {A} nervous.', wrong: ['{A} had practiced the speech for weeks, {A} was still nervous, the audience was much larger than expected.', 'Because {A} had practiced the speech for weeks, {A} was still nervous because the audience was larger than expected.', '{A} had practiced the speech for weeks, so {A} was still nervous about the larger audience.'], why: T('練習很久卻仍緊張，是讓步關係，用 Although；because 和 so 把邏輯弄反了。', 'Practicing for weeks yet still feeling nervous is a contrast, so "Although." "Because" and "so" reverse the logic.') },
    { text: 'Marie Curie was a physicist. She won two Nobel Prizes. Each prize was in a different science.', right: 'The physicist Marie Curie won two Nobel Prizes, each in a different science.', wrong: ['Marie Curie was a physicist, she won two Nobel Prizes, each prize was in a different science.', 'Marie Curie was a physicist, but she won two Nobel Prizes, each in a different science.', 'Marie Curie, who was a physicist, and she won two Nobel Prizes in a different science each.'], why: T('用 The physicist 當同位語、each in a different science 當補充片語，簡潔又正確；but 表示轉折，邏輯不對。', '"The physicist" works as an appositive and "each in a different science" as a phrase. "But" signals a contrast that does not exist.') },
    { text: 'The storm knocked out power. The school closed for two days. Students made up the work online.', right: 'Because the storm knocked out power, the school closed for two days, and students made up the work online.', wrong: ['The storm knocked out power, the school closed for two days, students made up the work online.', 'Although the storm knocked out power, the school closed for two days, and students made up the work online.', 'The storm knocked out power and the school closed for two days and students made up the work online.'], why: T('停電是關校的原因，用 Because；只用逗號是 comma splice；一連串 and 看不出關係。', 'The outage caused the closure, so "Because." Commas alone make a splice, and a chain of "and" hides the logic.') },
    { text: 'The novel is long. It is never boring. Each chapter ends with a surprise.', right: 'The novel is long but never boring, since each chapter ends with a surprise.', wrong: ['Because the novel is long, it is never boring, and each chapter ends with a surprise.', 'The novel is long, it is never boring, each chapter ends with a surprise.', 'The novel is long and it is never boring and each chapter ends with a surprise.'], why: T('「長」和「不無聊」是轉折（but），「每章都有驚喜」是理由（since）。', '"Long" and "never boring" contrast (but); the surprises are the reason (since).') },
    { text: '{A} wanted to study marine biology. {A} applied for a summer internship. The internship was at the aquarium.', right: 'Hoping to study marine biology, {A} applied for a summer internship at the aquarium.', wrong: ['{A} wanted to study marine biology, {A} applied for a summer internship, the internship was at the aquarium.', 'Although {A} wanted to study marine biology, {A} applied for a summer internship at the aquarium.', '{A} wanted to study marine biology and {A} applied for a summer internship and it was at the aquarium.'], why: T('分詞片語 Hoping to… 表示目的，把三句收成一句；Although 邏輯不對。', 'The phrase "Hoping to…" shows purpose and folds three sentences into one. "Although" misstates the logic.') },
    { text: 'Coral reefs are dying. The ocean is getting warmer. Scientists are breeding heat-resistant coral.', right: 'As warming oceans kill coral reefs, scientists are breeding heat-resistant coral.', wrong: ['Coral reefs are dying, the ocean is getting warmer, scientists are breeding heat-resistant coral.', 'Although the ocean is getting warmer, coral reefs are dying, and scientists are breeding heat-resistant coral.', 'Coral reefs are dying and the ocean is getting warmer and scientists are breeding heat-resistant coral.'], why: T('As 子句說明背景與原因（海水變暖使珊瑚死亡），主要子句說明科學家的對策。', 'The "As" clause gives the cause (warming kills reefs); the main clause gives the response.') },
  ], { q: T('把這幾個短句合併成一句，哪一個最好？', 'Which choice best combines these sentences?'), hint: T('先想：這些句子之間是因果、轉折，還是補充？', 'First decide: cause, contrast, or added detail?') }),
  bankSkill({
    id: 'g11-precise-words',
    grade: 11,
    unit: 'words',
    name: T('精確用字（SAT 文意字彙）', 'Precise word choice (SAT words in context)'),
    std: 'CCSS L.11-12.4 (SAT)',
    lesson: {
      zh: 'SAT 常考<b>拼法或發音相近</b>但意思不同的字（corroborate／collaborate），以及<b>最符合上下文</b>的字。先從句子的線索猜出需要的意思，再選字。',
      en: 'The SAT tests words that <b>look or sound alike</b> but mean different things (corroborate / collaborate) and the word that <b>best fits the context</b>. Use clues in the sentence to predict the meaning first, then choose.',
      ex: ['Three labs <b>corroborated</b> (confirmed) the findings.', 'Her <b>taciturn</b> (quiet) brother rarely spoke.'],
    },
  }, [
    { text: "Three independent labs ___ the team's findings, so the results were widely accepted.", right: 'corroborated', wrong: ['collaborated', 'corroded', 'correlated'], why: T('corroborate = 證實。其他字：collaborate 合作、corrode 腐蝕、correlate 相關。', '"Corroborate" means "confirm." Collaborate = work together, corrode = wear away, correlate = be related.') },
    { text: "The mayor's speech was so ___ that it lasted only four minutes.", right: 'concise', wrong: ['verbose', 'elaborate', 'tedious'], why: T('只講四分鐘 → 簡潔 concise。', 'Four minutes long → "concise" (brief and clear).') },
    { text: 'Unlike her ___ older brother, who rarely spoke, {A} chatted with everyone.', right: 'taciturn', wrong: ['talkative', 'gregarious', 'eloquent'], why: T('線索 who rarely spoke → 沉默寡言 taciturn。', 'The clue "who rarely spoke" points to "taciturn" (quiet).') },
    { text: 'The new evidence did not prove the theory wrong, but it did ___ it.', right: 'undermine', wrong: ['underline', 'understate', 'undertake'], why: T('沒有推翻，但「削弱」了理論 → undermine。', 'Not disproved, but weakened → "undermine."') },
    { text: "The committee's decision was ___: it could not be appealed or changed.", right: 'irrevocable', wrong: ['irrelevant', 'irreverent', 'irresistible'], why: T('不能上訴或更改 → 不可撤回 irrevocable。', 'Cannot be appealed or changed → "irrevocable."') },
    { text: "The museum guide gave an ___ explanation that even young children could follow.", right: 'accessible', wrong: ['excessive', 'assessable', 'accessory'], why: T('連小孩都聽得懂 → 易懂的 accessible。', 'Easy for children to follow → "accessible."') },
    { text: 'Her main argument was ___: voters understood exactly what she wanted.', right: 'unambiguous', wrong: ['ambivalent', 'ambiguous', 'ambitious'], why: T('選民完全明白 → 毫不含糊 unambiguous。', 'Voters understood exactly → "unambiguous."') },
    { text: 'The drought had a ___ effect on the farm, weakening the soil a little more each year.', right: 'cumulative', wrong: ['immediate', 'sudden', 'temporary'], why: T('每年一點一點變弱 → 累積的 cumulative。', 'Weakening a little more each year → "cumulative."') },
    { text: '{A} felt ___ about the plan, seeing both its strengths and its risks.', right: 'ambivalent', wrong: ['ambiguous', 'adamant', 'elated'], why: T('同時看到優點和風險、心情矛盾 → ambivalent。ambiguous 是「意思模糊」。', 'Seeing both sides and feeling torn → "ambivalent." "Ambiguous" means unclear in meaning.') },
    { text: 'The ___ of the report was clear: the city must replace the bridge within five years.', right: 'gist', wrong: ['jest', 'gust', 'guest'], why: T('報告的「要點」→ gist。', 'The main point of the report → "gist."') },
    { text: 'A careful scientist must ___ between correlation and causation.', right: 'distinguish', wrong: ['extinguish', 'distill', 'diminish'], why: T('區分 A 和 B → distinguish between。', 'To tell two things apart → "distinguish between."') },
    { text: 'The two historians reached ___ conclusions: one called the treaty a success, the other a failure.', right: 'divergent', wrong: ['convergent', 'identical', 'parallel'], why: T('一個說成功、一個說失敗 → 分歧的 divergent。', 'One says success, the other failure → "divergent."') },
  ], { q: T('哪一個字最適合放在空格裡？', 'Which word best completes the sentence?'), hint: T('先用自己的話猜空格的意思。', 'Predict the meaning in your own words first.') }),
];

// ======================================================================= GRADE 12
const LIT = {
  sit: T('情境反諷（situational irony）', 'Situational irony'), dram: T('戲劇性反諷（dramatic irony）', 'Dramatic irony'), verb: T('言語反諷（verbal irony）', 'Verbal irony'),
  fore: T('伏筆（foreshadowing）', 'Foreshadowing'), sym: T('象徵（symbolism）', 'Symbolism'), unrel: T('不可靠的敘事者（unreliable narrator）', 'Unreliable narrator'),
};
const LIT_WHY = {
  sit: T('結果和大家預期的<b>正好相反</b>，這是情境反諷。', 'The outcome is the <b>opposite of what anyone would expect</b>: situational irony.'),
  dram: T('<b>讀者或觀眾知道</b>角色不知道的事，這是戲劇性反諷。', 'The <b>audience knows something</b> the character does not: dramatic irony.'),
  verb: T('角色<b>說的話和真正的意思相反</b>，這是言語反諷。', 'A character <b>says the opposite of what he or she means</b>: verbal irony.'),
  fore: T('作者<b>提前放下線索</b>，暗示之後會發生的事，這是伏筆。', 'The writer <b>plants an early hint</b> of what will happen later: foreshadowing.'),
  sym: T('一個具體的物件<b>代表更大的抽象意義</b>（夢想、失去、時間），這是象徵。', 'A concrete object <b>stands for a larger idea</b> (a dream, a loss, time): symbolism.'),
  unrel: T('敘事者的話<b>自相矛盾或明顯偏頗</b>，讀者不能完全相信他，這是不可靠的敘事者。', 'The narrator\'s account <b>contradicts itself or is clearly biased</b>, so readers cannot fully trust it: an unreliable narrator.'),
};
const LITS = [
  ['The fire station burned down on the same afternoon the town held its fire-safety parade.', 'sit', []],
  ["The town's new anti-litter campaign printed fifty thousand paper flyers, most of which ended up blowing down Main Street.", 'sit', []],
  ['The audience knows that the letter in Ana\'s pocket is from her long-lost brother, but she tosses it aside, assuming it is another bill.', 'dram', []],
  ['We watch the thief slip into the closet while the homeowner calmly tells a friend on the phone that her house is perfectly safe.', 'dram', []],
  ["Stepping into the freezing rain without a coat, Marco muttered, \"What a perfect day for a picnic.\"", 'verb', ['unrel']],
  ['Looking at the blackened toast, his sister said, "Wow, you should open a restaurant."', 'verb', ['unrel']],
  ['As the family loaded the car for the lake, Dad mentioned that the old bridge had been creaking lately, but no one thought much of it.', 'fore', ['sym', 'dram']],
  ["In the first chapter, the narrator notices a thin crack running up the dam's concrete wall and decides it is nothing.", 'fore', ['sym', 'dram', 'unrel']],
  ['Throughout the novel, a green light across the bay glows whenever the hero thinks about the future he longs for but cannot reach.', 'sym', ['fore']],
  ["The narrator's grandfather winds the broken clock every morning, though it has not told the right time since the day the war ended.", 'sym', ['fore']],
  ['The caged canary in the kitchen window stops singing the week the daughter gives up her music scholarship.', 'sym', ['fore']],
  ['I am the most honest person in this town, which is why I never mention the money I borrowed from the bake sale box. Anyway, it was practically mine.', 'unrel', ['verb']],
  ['Everyone at the party adored me, I am certain, even if they did keep leaving the room whenever I started talking.', 'unrel', ['verb']],
];

const PRECIS = [
  { author: 'journalist Maya Torres', title: 'The Case for Boredom', yr: 2021, topic: 'boredom', claim: 'unstructured time is essential to creativity',
    s: ['In her essay "The Case for Boredom" (2021), journalist Maya Torres argues that unstructured time is essential to creativity.', "She supports this claim by contrasting her own phone-filled afternoons with interviews of artists who describe long, empty hours as the source of their best ideas.", 'Her purpose is to persuade readers to protect moments of boredom in order to make room for original thought.', 'She writes for busy adult readers in a wry, self-mocking tone, admitting her own habits before asking readers to change theirs.'] },
  { author: 'historian Ren Nakamura', title: 'Why Old Bridges Matter', yr: 2019, topic: 'old bridges', claim: "preserving historic infrastructure strengthens a community's sense of identity",
    s: ['In his article "Why Old Bridges Matter" (2019), historian Ren Nakamura asserts that preserving historic infrastructure strengthens a community\'s sense of identity.', 'He develops this idea by tracing the histories of three small-town bridges and quoting residents who use them as landmarks in family stories.', 'His purpose is to convince city planners to repair aging bridges rather than replace them, so that towns keep the places that hold their memories.', 'He addresses local officials and residents in an earnest, practical tone that balances affection with attention to cost.'] },
  { author: 'biologist Layla Haddad', title: 'The Ocean Is Not Too Big to Fail', yr: 2022, topic: 'the ocean', claim: 'ocean ecosystems are far more fragile than their size suggests',
    s: ['In "The Ocean Is Not Too Big to Fail" (2022), biologist Layla Haddad contends that ocean ecosystems are far more fragile than their size suggests.', 'She supports this claim by comparing the sudden collapses of three fisheries and explaining how each began with small, ignored warning signs.', 'Her purpose is to urge policymakers to adopt catch limits before decline becomes collapse.', 'Writing for general readers of a science magazine, she adopts an urgent but measured tone that avoids panic while insisting on action.'] },
  { author: 'teacher Kwame Mensah', title: 'Small Rooms, Big Questions', yr: 2020, topic: 'class size', claim: 'small classes give students room to take intellectual risks',
    s: ['In his speech "Small Rooms, Big Questions" (2020), teacher Kwame Mensah suggests that small classes give students room to take intellectual risks.', 'He illustrates this point with stories from twenty years of teaching and with research linking class size to student participation.', 'His purpose is to persuade the school board to fund additional teachers in order to keep classes small.', 'He speaks to board members and parents in a warm, conversational tone that invites agreement rather than demanding it.'] },
];

const ORDERS = [
  ['Most students graduate from high school without knowing how interest, credit, or taxes work.', 'For this reason, every high school should require a semester-long course in personal finance.', 'The most important benefit of such a course is that it protects young adults from high-interest debt.', 'Critics argue that families, not schools, should teach money skills, but many families never learned these skills themselves.', 'In the end, one semester of financial education could shape decades of wiser decisions.'],
  ['Every summer, our city opens cooling centers for residents without air conditioning.', 'These centers, however, are a temporary fix; the city should instead plant trees on every block that lacks shade.', 'Tree cover lowers street temperatures by several degrees and reduces the energy needed to cool nearby homes.', 'Some residents object that trees are expensive to maintain, but the savings in energy and health care far exceed the cost of pruning.', 'A greener city, in short, is not a luxury but the most practical defense against rising heat.'],
  ['Most high school athletes play a single sport all year, often from a very young age.', 'Coaches and parents should encourage teenagers to play more than one sport instead.', 'Playing several sports reduces overuse injuries, because different movements stress different muscles and joints.', 'Admittedly, specializing early may help a few elite athletes, yet even most college recruits played multiple sports in high school.', 'Variety, then, keeps young athletes both healthier and more likely to love the games they play.'],
  ['Each year, thousands of usable textbooks are thrown away when schools adopt new editions.', 'Our district should therefore adopt open, online textbooks that can be updated without being replaced.', 'Open textbooks save money that can be spent on teachers, laboratories, and libraries.', 'Some teachers worry that students read less carefully on screens, but districts can still print chapters for students who prefer paper.', 'By choosing open textbooks, the district would save money and paper while keeping its materials current.'],
  ['Our town library currently closes at 6 p.m. on weekdays.', 'The library should stay open until 9 p.m., at least three nights a week.', 'Many working parents and students cannot visit before six, so evening hours would serve the residents who need the library most.', 'Others point out that longer hours cost money; however, the town could cover the expense by sharing staff with the community center next door.', 'Extending library hours is a small investment that would open the library to the whole town.'],
];

const COHERE = [
  [['In 1928, Alexander Fleming returned from vacation to find mold growing in one of his bacteria dishes.', 'Around the mold, the bacteria had died.', 'Fleming realized that the mold was producing a substance that killed bacteria.', 'He named the substance penicillin.', 'Fleming also enjoyed painting pictures with colorful bacteria as a hobby.', 'Years later, other scientists found a way to mass-produce the drug.'], 4],
  [['{A} had never planted anything before joining the school garden club.', 'In the first week, {A} learned how to test soil and space seedlings.', 'The school cafeteria serves pizza every Friday.', 'By midsummer, {A} was teaching younger students how to water without drowning the roots.', 'Now {A} plans to study agricultural science in college.'], 2],
  [['Libraries are changing to meet the needs of their communities.', 'Many now lend tools, musical instruments, and even fishing rods.', 'Some offer quiet rooms where people can attend online job interviews.', 'One of the oldest libraries in the country was later turned into a museum.', 'Others host homework help, coding classes, and language exchanges.'], 3],
  [['Octopuses are remarkable problem solvers.', 'In laboratories, they have learned to unscrew jars to reach food inside.', 'Some have escaped their tanks at night and returned before morning.', 'Many people enjoy eating seafood at restaurants by the coast.', 'Researchers believe this flexibility comes from a nervous system spread throughout their arms.'], 3],
  [['Our school should switch to reusable trays in the cafeteria.', 'Disposable trays produce more than two hundred bags of trash each week.', 'Reusable trays would cost more at first but would pay for themselves within two years.', 'The cafeteria was painted green and white three summers ago.', 'Several nearby schools have already made the switch without complaints.'], 3],
  [['Sleep plays a crucial role in learning.', 'During deep sleep, the brain replays and strengthens the memories formed during the day.', 'Students who sleep less than seven hours often struggle to remember new material.', 'Some animals, like giraffes, sleep fewer than five hours a day.', 'For this reason, pulling an all-nighter before a test usually backfires.'], 3],
  [['{A} rebuilt the old bicycle over one winter.', 'First, {A} stripped the rusted frame down to bare metal.', 'Bicycles are one of the most popular forms of transportation in the Netherlands.', 'Next came new brakes, a chain, and two tires from a secondhand shop.', 'By spring, the bike was ready for its first ride to school.'], 2],
];

const PARA = [
  { orig: '"Coral reefs cover less than one percent of the ocean floor, yet they shelter roughly a quarter of all marine species." (Haddad 42)',
    right: 'Although reefs occupy only a tiny fraction of the seabed, they are home to about one in four ocean species (Haddad 42).',
    wrong: ['Coral reefs cover under one percent of the sea floor, but they shelter about a quarter of all marine species (Haddad 42).', 'Although reefs occupy only a tiny fraction of the seabed, they are home to about one in four ocean species.', 'Coral reefs cover a quarter of the ocean floor and shelter about one percent of marine species (Haddad 42).'] },
  { orig: '"When a town tears down its oldest bridge, it often loses more than a crossing; it loses a landmark that residents use to tell the story of who they are." (Nakamura 17)',
    right: "Nakamura argues that an old bridge can carry a community's identity, so demolishing it may erase part of the town's shared story (17).",
    wrong: ['When a town destroys its oldest bridge, it frequently loses more than a crossing; it loses a landmark residents use to tell who they are (Nakamura 17).', "An old bridge can carry a community's identity, so demolishing it may erase part of the town's shared story.", 'Nakamura argues that old bridges are dangerous and should be replaced to protect residents (17).'] },
  { orig: '"Boredom is not the enemy of creativity but its waiting room." (Torres 8)',
    right: 'Torres suggests that boredom often comes just before creative ideas rather than blocking them (8).',
    wrong: ["Boredom is not creativity's enemy but its waiting area (Torres 8).", 'Boredom often comes just before creative ideas rather than blocking them.', 'Torres claims that bored people are rarely creative (8).'] },
  { orig: '"Students in small classes ask more questions, not because they are smarter, but because they feel less exposed." (Mensah 63)',
    right: 'According to Mensah, smaller classes encourage students to ask questions because speaking up feels less risky there, not because those students are more intelligent (63).',
    wrong: ['Students in small classes ask more questions, not since they are brighter, but since they feel less exposed (Mensah 63).', 'Smaller classes encourage students to ask questions because speaking up feels less risky there, not because those students are more intelligent.', 'Mensah finds that students in small classes are smarter, so they ask more questions (63).'] },
  { orig: '"Fast fashion keeps prices low by shifting its true costs onto workers and landfills." (Castillo 112)',
    right: 'Castillo contends that inexpensive clothing stays cheap only because factory workers and the environment absorb its real costs (112).',
    wrong: ['Fast fashion keeps prices down by moving its true costs onto laborers and landfills (Castillo 112).', 'Inexpensive clothing stays cheap only because factory workers and the environment absorb its real costs.', 'Castillo argues that fast fashion lowers costs for factory workers (112).'] },
];

const g12 = [
  bankSkill({
    id: 'g12-formal-register',
    grade: 12,
    unit: 'style',
    name: T('正式語域與學術寫作', 'Formal register for academic writing'),
    std: 'CCSS L.11-12.3a',
    lesson: {
      zh: '學術寫作（研究報告、AP 作文、大學課業）使用<b>正式語域</b>：避免俚語（kind of、a bunch of、like）、口語縮寫、第二人稱 you 和誇張字（totally、super）。用<b>精確的動詞</b>（contends、suggests、questions）。',
      en: 'Academic writing—research papers, AP essays, college work—uses a <b>formal register</b>. Avoid slang (kind of, a bunch of, like), casual contractions, the second person "you," and hype words (totally, super). Use <b>precise verbs</b> (contends, suggests, questions).',
      ex: ['Informal: The results were kind of a big deal.', 'Formal: The results were statistically significant.'],
    },
  }, [
    { right: "The study's results were statistically significant.", wrong: ["The study's results were kind of a big deal.", "You can tell the study's results were super important.", "The study's results were, like, really significant."] },
    { right: "Several critics have questioned the novel's ending.", wrong: ["A bunch of critics aren't crazy about the novel's ending.", 'Lots of critics think the ending of the novel is kind of lame.', "The novel's ending totally falls flat, if you ask the critics."] },
    { right: 'The policy reduced emissions by approximately twelve percent.', wrong: ['The policy cut emissions by like twelve percent.', 'The policy did a pretty good job cutting emissions, around twelve percent or so.', "You'd be surprised—the policy knocked emissions down twelve percent!"] },
    { right: "The author's argument relies heavily on anecdotal evidence.", wrong: ['The author mostly just tells stories instead of giving real proof.', "The author's argument is basically a bunch of stories.", "Honestly, the author's argument is all stories and no facts."] },
    { right: "{A} contends that the survey's sample was too small to support its conclusions.", wrong: ["{A} thinks the survey didn't ask enough people, so it's kind of useless.", '{A} says the survey is bogus because they barely asked anybody.', "According to {A}, the survey totally messed up by asking, like, nobody."] },
    { right: 'These findings suggest that early intervention improves reading outcomes.', wrong: ['So basically, if you help kids read early, they get way better.', 'These findings totally prove that helping kids early is awesome.', 'Helping kids early with reading? Huge win, according to these findings.'] },
    { right: 'The committee postponed its decision pending further review.', wrong: ['The committee punted on the decision until they could look into it more.', 'The committee kind of put off deciding stuff for a while.', "The committee was like, we'll decide later."] },
    { right: 'The data do not support the claim that homework improves test scores.', wrong: ["The data don't really back up the whole homework-helps-scores thing.", "Honestly, you can't say homework helps scores based on this stuff.", 'The data pretty much shoot down the idea that homework helps scores.'] },
  ].map((x) => ({ ...x, why: T('正確答案用精確、客觀的字詞，沒有俚語、口語、you 或誇張字。', 'The answer uses precise, objective words—no slang, casual phrasing, "you," or hype.') })),
  { q: T('哪一個句子最適合放在正式的學術文章裡？', 'Which sentence best fits a formal academic essay?'), hint: T('找沒有俚語和口語的那句。', 'Look for the one with no slang or chatty phrasing.') }),
  bankSkill({
    id: 'g12-nominalizations',
    grade: 12,
    unit: 'style',
    name: T('主動語態與「殭屍名詞」', 'Active voice and nominalizations ("zombie nouns")'),
    std: 'CCSS L.11-12.3',
    lesson: {
      zh: '把動詞變成名詞（implement → implementation、decide → decision）會讓句子變得冗長、沒有生氣，這些叫「殭屍名詞」。改寫時找出<b>真正做事的人</b>當主詞，把名詞還原成<b>動詞</b>，並盡量用主動語態。',
      en: 'Turning verbs into nouns (implement → implementation, decide → decision) creates "zombie nouns" that drain the life from sentences. To revise, find <b>who is acting</b>, make that the subject, and turn the noun back into a <b>verb</b>—usually in the active voice.',
      ex: ['Zombie: The implementation of the policy by the board occurred in May.', 'Alive: The board implemented the policy in May.'],
    },
  }, [
    { text: 'The implementation of the new policy by the board occurred in May.', right: 'The board implemented the new policy in May.', wrong: ['The implementation of the new policy by the board occurred in May.', "The new policy's implementation was done by the board in May.", 'In May, there was an implementation of the new policy by the board.'] },
    { text: 'There was a discussion among the committee members about the budget.', right: 'The committee members discussed the budget.', wrong: ['There was a discussion among the committee members about the budget.', 'A discussion about the budget was held by the committee members.', 'The budget was the subject of a discussion among the committee members.'] },
    { text: 'The decision to withdraw from the race was made by {A}.', right: '{A} decided to withdraw from the race.', wrong: ['The decision to withdraw from the race was made by {A}.', '{A} made the decision of a withdrawal from the race.', 'A withdrawal from the race was the decision made by {A}.'] },
    { text: 'An analysis of the data was performed by the researchers.', right: 'The researchers analyzed the data.', wrong: ['An analysis of the data was performed by the researchers.', 'The researchers performed an analysis of the data.', 'The data underwent analysis by the researchers.'] },
    { text: 'Our recommendation is that the city make an investment in bike lanes.', right: 'We recommend that the city invest in bike lanes.', wrong: ['Our recommendation is that the city make an investment in bike lanes.', 'The recommendation we make is for an investment in bike lanes by the city.', 'An investment in bike lanes by the city is our recommendation.'] },
    { text: 'The expectation of the teachers is that students will provide a revision of their drafts.', right: 'The teachers expect students to revise their drafts.', wrong: ['The expectation of the teachers is that students will provide a revision of their drafts.', 'The teachers have an expectation that students will do revisions of their drafts.', 'A revision of drafts by students is the expectation of the teachers.'] },
    { text: 'Mistakes in the calculation of the totals were made by the treasurer.', right: 'The treasurer miscalculated the totals.', wrong: ['Mistakes in the calculation of the totals were made by the treasurer.', 'The treasurer made mistakes in the calculation of the totals.', 'The calculation of the totals contained mistakes made by the treasurer.'] },
    { text: 'The novel offers an exploration of the ways in which grief can bring about the transformation of a family.', right: 'The novel explores how grief can transform a family.', wrong: ['The novel offers an exploration of the ways in which grief can bring about the transformation of a family.', 'The novel provides an exploration of how the transformation of a family can be brought about by grief.', 'An exploration of grief and family transformation is offered by the novel.'] },
    { text: 'The failure of the team to communicate was the cause of its loss.', right: 'The team lost because its players did not communicate.', wrong: ['The failure of the team to communicate was the cause of its loss.', 'The loss of the team was caused by the failure of communication.', "The team's loss had its cause in a failure of communication."] },
  ].map((x) => ({ ...x, why: T('找出真正做事的人當主詞，把名詞（implementation、decision、analysis…）改回動詞，句子就變短、變有力。', 'Make the real actor the subject and turn the noun (implementation, decision, analysis…) back into a verb. The sentence gets shorter and stronger.') })),
  { q: T('哪一個改寫最直接、有力？', 'Which version is the most direct and vigorous?'), hint: T('誰在做事？他做了什麼動作？', 'Who is acting, and what is the action?') }),
  bankSkill({
    id: 'g12-mood',
    grade: 12,
    unit: 'grammar',
    name: T('假設語氣與條件句', 'Subjunctive and conditional mood'),
    std: 'CCSS L.8.1c · Grade 12 review',
    lesson: {
      zh: '<b>假設語氣</b>：與事實相反的願望或假設用 <b>were</b>（If I were…、I wish it were…）；要求、建議、必要（insist、recommend、it is essential that）後面用<b>原形動詞</b>（that she submit）。<b>過去的假設</b>：If + had + 過去分詞，主句用 would/could/might have + 過去分詞（不要寫 would of）。',
      en: '<b>Subjunctive</b>: for wishes and situations contrary to fact, use <b>were</b> (If I were…, I wish it were…). After demands and recommendations (insist, recommend, it is essential that), use the <b>base verb</b> (that she submit). <b>Past conditional</b>: If + had + past participle, then would/could/might have + past participle (never "would of").',
      ex: ['If I <b>were</b> the principal, I would extend lunch.', 'The coach insists that every player <b>arrive</b> on time.', 'If she <b>had caught</b> the bus, she <b>would have arrived</b> on time.'],
    },
  }, [
    { text: 'If I ___ the principal, I would extend the lunch period.', right: 'were', wrong: ['am', 'will be'], why: T('與事實相反的假設（我不是校長），正式寫法用 were。', 'This is contrary to fact (I am not the principal), so formal English uses "were."') },
    { text: 'The coach insists that every player ___ on time.', right: 'arrive', wrong: ['arrives', 'arrived'], why: T('insist that 後面用原形動詞（假設語氣）。', 'After "insists that," use the base verb (subjunctive).') },
    { text: 'It is essential that {A} ___ the form before Friday.', right: 'submit', wrong: ['submits', 'submitted'], why: T('It is essential that 後面用原形動詞。', 'After "It is essential that," use the base verb.') },
    { text: '{A} wishes the summer ___ longer.', right: 'were', wrong: ['is', 'will be'], why: T('wish 表示和事實相反的願望，用 were。', '"Wish" expresses something contrary to fact, so use "were."') },
    { text: 'If {A} ___ the early bus, {A} would have arrived on time.', right: 'had caught', wrong: ['would have caught', 'caught'], why: T('與過去事實相反：If 子句用 had + 過去分詞，不用 would have。', 'Contrary to past fact: the if-clause takes "had + past participle," never "would have."') },
    { text: 'If the bridge had been inspected, the accident ___ prevented.', right: 'could have been', wrong: ['could of been', 'can be'], why: T('主句用 could have been；could of 是聽音寫錯的錯誤寫法。', 'The main clause takes "could have been"; "could of" is a misspelling of the spoken form.') },
    { text: 'The committee recommended that the library ___ open later on weekends.', right: 'stay', wrong: ['stays', 'stayed'], why: T('recommend that 後面用原形動詞。', 'After "recommended that," use the base verb.') },
    { text: '{A} acted as if the test ___ already over.', right: 'were', wrong: ['is', 'will be'], why: T('as if 後面接與事實相反的情況，正式寫法用 were。', '"As if" introduces something contrary to fact, so formal English uses "were."') },
    { text: 'Had the team practiced more, it ___ the final.', right: 'might have won', wrong: ['might win', 'might of won'], why: T('倒裝的過去假設（Had…），主句用 might have + 過去分詞。', 'An inverted past conditional ("Had the team…") takes "might have + past participle."') },
    { text: 'If water ___ to 100 degrees Celsius at sea level, it boils.', right: 'is heated', wrong: ['were heated', 'would be heated'], why: T('這是一般事實（零條件句），兩邊都用現在式，不用假設語氣。', 'This is a general fact (a zero conditional), so both clauses use the present tense—no subjunctive.') },
    { text: 'The doctor asked that {A} ___ rest for a week before running again.', right: 'rest', wrong: ['rests', 'rested'], why: T('ask that（要求）後面用原形動詞。', 'After "asked that" (a request), use the base verb.') },
  ], { q: T('在正式英文中，空格應填什麼？', 'In formal English, what belongs in the blank?'), n: 2, hint: T('是與事實相反、要求建議，還是一般事實？', 'Is it contrary to fact, a demand, or a general truth?') }),
  bankSkill({
    id: 'g12-quote-punctuation',
    grade: 12,
    unit: 'mechanics',
    name: T('進階標點：破折號、刪節號、引文中的方括號', 'Advanced punctuation: em dash, ellipsis, brackets in quotations'),
    std: 'CCSS L.11-12.2',
    lesson: {
      zh: '引用時：<b>刪節號 ...</b> 表示省略了原文的字；<b>方括號 [ ]</b> 表示你為了文法或清楚而改動、加入的字（不能用圓括號）。不可以不標示就改動引文。<b>破折號 —</b>（em dash）沒有空格的長破折號，用來強調或插入，和連字號 - 不同。',
      en: 'In quotations, an <b>ellipsis (...)</b> marks words you left out, and <b>square brackets [ ]</b> mark words you changed or added for grammar or clarity—never parentheses. Never alter a quotation without marking it. An <b>em dash (—)</b> adds emphasis or an interruption; it is not a hyphen.',
      ex: ['Original: "She studied the river for forty years."', 'Quoted: "[Moreno] studied the river for forty years."', '"The library ... now lends more than a million items a year."'],
    },
  }, [
    { text: 'Original sentence: "She studied the river for forty years, and she never stopped finding new questions." You want to make clear that "She" means Dr. Moreno.', right: '"[Moreno] studied the river for forty years, and she never stopped finding new questions."', wrong: ['"(Moreno) studied the river for forty years, and she never stopped finding new questions."', '"Moreno studied the river for forty years, and she never stopped finding new questions."', '"{Moreno} studied the river for forty years, and she never stopped finding new questions."'], why: T('替換引文中的字要用方括號 [ ]；不標示就改字等於竄改引文，圓括號和大括號也不對。', 'A word you substitute inside a quotation goes in square brackets. Changing it silently misquotes the source; parentheses or braces are wrong.') },
    { text: 'Original sentence: "The library, which opened in 1904 with only two hundred books, now lends more than a million items a year." You want to leave out the middle clause.', right: '"The library ... now lends more than a million items a year."', wrong: ['"The library now lends more than a million items a year."', '"The library, ... with only two hundred books, now lends more than a million items a year ..."', '"The library (which opened in 1904) now lends more than a million items a year."'], why: T('省略原文的字要用刪節號標示，而且不能改變原意。', 'Mark omitted words with an ellipsis, and make sure the shortened quotation keeps the original meaning.') },
    { text: 'Original sentence (spoken by an architect): "I wanted to build something that would outlast me." You are writing about the architect in the third person.', right: 'Looking back, the architect said she had "wanted to build something that would outlast [her]."', wrong: ['Looking back, the architect said she had "wanted to build something that would outlast (her)."', 'Looking back, the architect said she had "wanted to build something that would outlast her."', 'Looking back, the architect said she had "wanted to build something that would outlast me."'], why: T('為了讓句子文法一致而把 me 改成 her，要用方括號標出改動。', 'Changing "me" to "her" so the sentence fits is fine—but the change must appear in square brackets.') },
    { text: 'Original sentence: "Good questions, like good tools, are worth keeping close at hand." You want to leave out the comparison.', right: '"Good questions ... are worth keeping close at hand."', wrong: ['"Good questions are worth keeping close at hand."', '"Good questions, (...) are worth keeping close at hand."', '"Good questions, like good tools ... are worth keeping close at hand, ..."'], why: T('省略中間的字用刪節號，不需要圓括號，也不能把逗號或刪節號亂放。', 'Use an ellipsis where words are dropped—no parentheses, and no stray commas or dots.') },
    { text: 'You want to set off an interruption with dashes: The final draft (all forty pages of it) arrived at midnight.', right: 'The final draft—all forty pages of it—arrived at midnight.', wrong: ['The final draft—all forty pages of it, arrived at midnight.', 'The final draft-all forty pages of it-arrived at midnight.', 'The final draft; all forty pages of it; arrived at midnight.'], why: T('插入語用一對 em dash（長破折號），不能一邊破折號一邊逗號，也不能用連字號或分號。', 'An interruption takes a matching pair of em dashes—not a dash and a comma, not hyphens, not semicolons.') },
    { text: 'You want to add emphasis to the end of this sentence with a dash: The results were clear and alarming.', right: 'The results were clear—and alarming.', wrong: ['The results were clear-and alarming.', 'The results were clear; and alarming.', 'The results were clear—and, alarming.'], why: T('句尾強調用 em dash；連字號（-）只用來連接複合字，分號後面要完整句子。', 'An em dash creates the emphatic pause. A hyphen only joins compound words, and a semicolon needs a full sentence after it.') },
  ], { q: T('哪一個寫法的標點正確？', 'Which version is punctuated correctly?'), hint: T('改動用方括號，省略用刪節號。', 'Brackets for changes, an ellipsis for omissions.') }),
  {
    id: 'g12-literary-devices',
    grade: 12,
    unit: 'style',
    name: T('AP 文學技巧：反諷、伏筆、象徵、不可靠的敘事者', 'Literary devices (AP Lit): irony, foreshadowing, symbolism, unreliable narrator'),
    std: 'CCSS RL.11-12.5 · AP Lit',
    lesson: {
      zh: '<b>情境反諷</b>：結果和預期相反。<b>戲劇性反諷</b>：讀者知道角色不知道的事。<b>言語反諷</b>：說的和想的相反。<b>伏筆</b>：預示後來的事件。<b>象徵</b>：具體物件代表抽象概念。<b>不可靠的敘事者</b>：敘事者的話不能全信。AP 文學作文要說明技巧<b>如何塑造作品的意義</b>。',
      en: '<b>Situational irony</b>: the outcome contradicts expectations. <b>Dramatic irony</b>: the reader knows what a character does not. <b>Verbal irony</b>: saying the opposite of what one means. <b>Foreshadowing</b>: hints of later events. <b>Symbolism</b>: a concrete object stands for an abstract idea. <b>Unreliable narrator</b>: a teller we cannot fully trust. In AP Lit, explain <b>how the device shapes meaning</b>.',
      ex: ['"What a perfect day for a picnic," he said, stepping into the freezing rain. (verbal irony)', 'The fire station burned down during the fire-safety parade. (situational irony)'],
    },
    gen(r) {
      const [s, k, not] = r.pick(LITS);
      const others = r.sample(Object.keys(LIT).filter((x) => x !== k && !not.includes(x)), 3);
      return {
        q: T('這段文字主要展現哪一種文學技巧？', 'Which literary device does this passage mainly show?'),
        text: s,
        ans: ansChoice([LIT[k], ...others.map((x) => LIT[x])]),
        sol: [LIT_WHY[k], say(LIT[k])],
        hint: T('誰知道什麼？結果符合預期嗎？物件代表什麼？', 'Who knows what? Is the outcome expected? Does an object stand for something?'),
      };
    },
  },
  bankSkill({
    id: 'g12-show-specific',
    grade: 12,
    unit: 'style',
    name: T('大學申請文：展示而非陳述、具體細節', 'College-essay craft: show, don\'t tell; specific detail'),
    std: 'CCSS W.11-12.3d',
    lesson: {
      zh: '大學申請文最怕空泛：「我學到很多」「我很熱愛幫助別人」。用<b>具體的動作、感官細節和只有你才有的經驗</b>讓讀者自己感受，而不是直接告訴他們你的情緒或特質。',
      en: 'College essays die from vagueness: "I learned so much," "I love helping people." Use <b>specific actions, sensory details, and moments only you could describe</b> so readers feel it themselves, instead of telling them your emotions or traits.',
      ex: ['Tell: I was nervous.', 'Show: I smoothed my note cards for the fourth time, though they were already flat.'],
    },
  }, [
    { text: 'Telling: {A} was nervous before the speech.', right: '{A} smoothed the note cards for the fourth time, though they were already perfectly flat.', wrong: ['{A} was really, really nervous before the speech.', '{A} felt very nervous and scared before the speech.', 'Before the speech, {A} had a lot of nervous feelings.'] },
    { text: 'Telling: Grandpa was proud of the newspaper article.', right: 'Grandpa taped the article to the refrigerator, then moved it to the front door, where every visitor would see it.', wrong: ['Grandpa was extremely proud of the article.', 'Grandpa felt so much pride about the article.', 'The article made Grandpa feel really proud and happy.'] },
    { text: 'Telling: {A} was exhausted after the shift.', right: '{A} read the same sentence three times before realizing the page had not changed.', wrong: ['{A} was completely and totally exhausted after the shift.', '{A} felt very tired after working so hard.', 'After the shift, {A} was more tired than ever before.'] },
    { text: 'Telling: {A} was disappointed by the rejection.', right: '{A} folded the rejection letter into smaller and smaller squares until it disappeared inside a fist.', wrong: ['{A} was very disappointed by the rejection.', 'The rejection made {A} feel sad and disappointed.', '{A} had a lot of disappointment about the letter.'] },
    { text: 'Vague: I learned a lot from my summer job.', right: 'At the bakery, I learned to judge bread by its sound: a hollow knock on the bottom meant the loaf was done.', wrong: ['My summer job taught me so many valuable life lessons.', 'I learned many things at my job, such as responsibility and hard work.', 'My summer job was an amazing experience that changed me forever.'] },
    { text: 'Vague: I love helping people.', right: "Every Saturday I translate the pharmacist's instructions for Mrs. Lin, who taps each word on the label until she is sure she understands.", wrong: ['Helping people is my biggest passion in life.', 'I have always loved helping others in any way I can.', 'I am a very helpful person who cares about my community.'] },
    { text: 'Vague: Moving to a new country was hard.', right: 'For my first month in Toronto, I rehearsed every lunch order in my head before I reached the front of the line.', wrong: ['Moving to a new country was the hardest thing I have ever done.', 'Moving was very difficult, but it made me stronger.', 'It was really hard to adjust to a new country and a new culture.'] },
    { text: 'Vague: I am passionate about science.', right: 'I kept a jar of pond water on my windowsill for a year, logging every new creature that hatched in it.', wrong: ['Science has always been my greatest passion.', 'I am extremely passionate about all kinds of science.', 'Ever since I was young, I have loved science more than anything.'] },
  ].map((x) => ({ ...x, why: T('好的句子用具體的動作和細節，讓讀者自己感受到情緒或特質；其他選項只是用更多形容詞「說出來」。', 'The best sentence uses a concrete action or detail so readers feel the emotion or trait themselves; the others just tell it with more adjectives.') })),
  { q: T('哪一個句子最能「展示」而不是「陳述」？', 'Which sentence best SHOWS instead of telling?'), hint: T('找有具體動作或畫面的那句。', 'Look for a concrete action or image.') }),
  {
    id: 'g12-precis',
    grade: 12,
    unit: 'paragraphs',
    name: T('修辭摘要（rhetorical précis）', 'Rhetorical précis and summary'),
    std: 'CCSS RI.11-12.2 · W.11-12.9',
    lesson: {
      zh: '<b>修辭摘要</b>（rhetorical précis）共四句：①作者、身分、文類、標題、年份 + <b>精確的動詞</b>（argues、asserts、suggests）+ 主張 ②作者<b>如何</b>支持主張 ③作者的<b>目的</b>（in order to…）④<b>讀者對象</b>和<b>語氣</b>。摘要要客觀，不加入自己的意見。',
      en: 'A <b>rhetorical précis</b> has four sentences: (1) author, credentials, genre, title, and date + a <b>precise verb</b> (argues, asserts, suggests) + the claim; (2) <b>how</b> the author supports it; (3) the author\'s <b>purpose</b> ("in order to…"); (4) the <b>audience</b> and <b>tone</b>. Stay objective—no personal opinions.',
      ex: ['In her essay "The Case for Boredom" (2021), journalist Maya Torres argues that unstructured time is essential to creativity.'],
    },
    gen(r) {
      const p = r.pick(PRECIS);
      if (r.chance(0.5)) {
        return {
          q: T(`把這篇關於「${p.title}」的修辭摘要四個句子排成正確順序。`, `Put the four sentences of this rhetorical précis of "${p.title}" in order.`),
          ans: ansOrder(p.s),
          sol: [T('順序：①作者＋主張 ②方法（如何支持）③目的 ④讀者與語氣。', 'Order: (1) author and claim, (2) method of support, (3) purpose, (4) audience and tone.'), T(`第一句：${p.s[0]}`, `It begins: ${p.s[0]}`)],
          hint: T('第一句一定有作者名字和標題。', 'The first sentence names the author and the title.'),
        };
      }
      const name = p.author.split(' ').slice(1).join(' ');
      const wrong = [`${name}'s piece "${p.title}" is about ${p.topic}.`, `In "${p.title}," ${name} makes many excellent and convincing points about ${p.topic}.`, `${p.claim.charAt(0).toUpperCase() + p.claim.slice(1)}.`, `${name} talks about ${p.topic} and gives a lot of examples in "${p.title}."`];
      return {
        q: T('哪一句最適合當修辭摘要的第一句？', 'Which sentence is the best first sentence for a rhetorical précis?'),
        ans: ansChoice([p.s[0], ...r.sample(wrong, 3)]),
        sol: [T('第一句要包含：作者與身分、文類、標題、年份、精確的修辭動詞（argues／asserts／contends／suggests）和完整的主張。', 'The first sentence needs the author and credentials, genre, title, date, a precise rhetorical verb (argues, asserts, contends, suggests), and the full claim.'), T('「is about」「talks about」太模糊；「excellent points」是個人意見，不客觀。', '"Is about" and "talks about" are vague, and "excellent points" is an opinion, not an objective summary.'), say(p.s[0])],
        hint: T('找有作者、標題和明確主張的那句。', 'Look for the author, the title, and a clear claim.'),
      };
    },
  },
  bankSkill({
    id: 'g12-source-evaluation',
    grade: 12,
    unit: 'research',
    name: T('評估來源：可信度與偏見', 'Evaluating sources: credibility and bias'),
    std: 'CCSS W.11-12.8',
    lesson: {
      zh: '評估來源時問：<b>誰</b>寫的？有沒有專業？<b>為什麼</b>寫？（賣東西、說服、告知）<b>何時</b>寫的？夠新嗎？有沒有<b>證據和方法</b>？誰<b>出錢</b>？好習慣是「橫向閱讀」：離開網站，看看其他獨立來源怎麼評價它。',
      en: 'Ask: <b>Who</b> wrote it, and are they qualified? <b>Why</b> was it written—to sell, persuade, or inform? <b>When</b>—is it current? Does it show <b>evidence and methods</b>? Who <b>paid</b> for it? Practice lateral reading: leave the site and see what independent sources say about it.',
      ex: ['Strong: a peer-reviewed study that explains its methods', 'Weak: an ad, an anonymous post, or a study funded by a company that profits from the result'],
    },
  }, [
    { text: 'Research question: Do later school start times improve teenagers\' sleep?', right: 'A peer-reviewed study in a pediatrics journal that tracked 9,000 students across eight school districts', wrong: ['A blog post by a parent describing how her son sleeps better on weekends', 'An advertisement for an alarm clock that promises easier mornings', 'An old online forum thread in which students share opinions about early classes'], why: T('經過同儕審查、樣本大、方法清楚的研究最可信。', 'A peer-reviewed study with a large sample and clear methods is the most credible.') },
    { text: 'Research question: How much do electric cars reduce lifetime emissions?', right: 'A government environmental agency report that compares the lifetime emissions of electric and gas cars and explains its methods', wrong: ['A promotional video from an electric-car company praising its newest model', 'A social media post claiming electric cars are "basically pollution-free"', "A car dealership's newsletter announcing end-of-year sales"], why: T('公開方法、沒有銷售目的的機構報告最可信；廠商影片和經銷商都有利益關係。', 'An agency report with stated methods and nothing to sell is most credible; the company and the dealer profit from the answer.') },
    { text: 'Research question: What caused the decline of the river\'s salmon population?', right: 'A university fisheries study with fifteen years of data and cited sources', wrong: ["A fishing-supply store's web page explaining why its customers catch fewer fish", 'An anonymous comment under a news article blaming a single company', 'A one-minute news clip interviewing one fisherman'], why: T('長期資料、有引用來源的大學研究最可信；匿名留言和單一訪問證據不足。', 'Long-term data with cited sources is strongest; an anonymous comment or a single interview is thin evidence.') },
    { q: T('這個來源最大的問題是什麼？', 'What is the most serious concern about this source?'), text: 'A study concluding that sugary drinks do not contribute to weight gain was funded by a soft-drink industry association.', right: 'The funder profits from the result, which creates a risk of bias.', wrong: ['The study is about drinks, and studies about food are never reliable.', 'The conclusion is surprising, so it must be false.', 'The study does not include enough pictures.'], why: T('出資者能從結論獲利，是利益衝突；這不代表研究一定錯，但需要用獨立研究來核對。', 'The funder benefits from the conclusion—a conflict of interest. That does not prove the study wrong, but it must be checked against independent research.') },
    { text: 'Research question: What is the current population of Tokyo?', right: "The city government's statistics website, updated this year", wrong: ['An encyclopedia printed in 1995', "A travel blogger's rough estimate", 'A popular novel set in Tokyo'], why: T('人口數字會變，要找官方、最新的資料。', 'Population changes, so the official, current source is best.') },
    { q: T('一個名為「National Health Facts」的網站提出驚人的說法。最好的下一步是什麼？', 'A website called "National Health Facts" makes a surprising claim. What is the best next step?'), text: 'The site looks professional, has a .org address, and does not name its authors.', right: 'Search for what independent sources say about the site and who funds it.', wrong: ['Read the site\'s "About Us" page and trust what it says about itself.', 'Trust it, because the design looks professional.', 'Trust it, because the address ends in .org.'], why: T('「橫向閱讀」：離開網站，看獨立來源怎麼評價它；外觀和 .org 都不能保證可信。', 'Read laterally: leave the site and see what others say about it. A polished design or a .org address proves nothing.') },
    { q: T('哪一個是最好的「第一手資料」？', 'Which is the best PRIMARY source for this question?'), text: 'Research question: How did ordinary soldiers experience the American Civil War?', right: 'Letters soldiers wrote home during the war, collected in a university archive', wrong: ['A modern film loosely based on the war', 'A textbook chapter summarizing the major battles', "A website listing the war's key dates"], why: T('第一手資料是事件當時、親身經歷者留下的紀錄，例如士兵家書。', 'A primary source is created at the time by someone who lived it, like soldiers\' letters.') },
  ], { q: T('哪一個來源最可信？', 'Which source is the most credible for this question?'), hint: T('誰寫的？為什麼寫？有證據嗎？', 'Who wrote it, why, and with what evidence?') }),
  bankSkill({
    id: 'g12-hedging',
    grade: 12,
    unit: 'style',
    name: T('限定主張（hedging）', 'Qualifying claims (hedging)'),
    std: 'CCSS W.11-12.1b',
    lesson: {
      zh: '主張的強度要配合證據：小樣本、單一研究、相關性只能支持<b>有限度</b>的主張。用 <b>suggests、may、appears、is associated with、in many cases</b> 等字限定。但不要過度保留到什麼都沒說（It might perhaps possibly…）。相關不等於因果。',
      en: 'Match the strength of a claim to the evidence. A small sample, a single study, or a correlation supports only a <b>qualified</b> claim—use <b>suggests, may, appears, is associated with, in many cases</b>. But do not hedge so much that you say nothing ("It might perhaps possibly…"). Correlation is not causation.',
      ex: ['Overclaim: The survey proves all teens prefer e-books.', 'Qualified: At this school, many students appear to prefer e-books.'],
    },
  }, [
    { text: 'Evidence: A survey of 40 students at one high school found that 28 preferred online textbooks.', right: 'At least at this school, many students appear to prefer online textbooks.', wrong: ['All teenagers prefer online textbooks.', 'The survey proves that printed textbooks should be banned.', 'Online textbooks are definitely better for learning.'], why: T('只有一所學校 40 人，只能做有限度的主張。', 'Forty students at one school support only a limited claim.') },
    { text: 'Evidence: In a three-month trial, students who used a planner app turned in 15 percent more assignments on time.', right: 'The app may help students meet deadlines, though longer studies are needed.', wrong: ['The app guarantees that students will never miss a deadline.', 'Planner apps make students smarter.', 'The app had no effect on students.'], why: T('短期試驗顯示有幫助，但不能說「保證」，也不能延伸到「變聰明」。', 'A short trial shows a benefit, but not a guarantee—and nothing about intelligence.') },
    { text: 'Evidence: Cities that added bike lanes saw cycling increase, and some also saw fewer traffic injuries.', right: 'Bike lanes are associated with more cycling and, in some cities, with fewer injuries.', wrong: ['Bike lanes eliminate traffic injuries.', 'Every city should build bike lanes immediately, because they always work.', 'Bike lanes have nothing to do with cycling.'], why: T('證據是「相關」和「部分城市」，主張也要這樣限定。', 'The evidence shows an association in some cities, so the claim should say exactly that.') },
    { text: "Evidence: Three of the novel's four main characters lie at crucial moments.", right: 'The novel seems deeply interested in how dishonesty shapes relationships.', wrong: ['The author must be a dishonest person.', 'Every character in the novel is a liar.', 'The novel proves that lying is always wrong.'], why: T('從角色的行為可以推論作品關心的主題，但不能推論作者本人，也不能誇大成「每個角色」。', 'Characters\' choices support a claim about the novel\'s concerns—not about the author, and not about "every" character.') },
    { text: 'Evidence: A study of 2,000 adults found that people who read for pleasure reported lower stress levels.', right: 'Reading for pleasure is linked to lower reported stress, though the study does not show that reading causes it.', wrong: ['Reading cures stress.', 'Everyone who reads is relaxed.', 'The study shows that reading has nothing to do with stress.'], why: T('調查只能顯示相關，不能證明因果。', 'A survey can show a link, not cause and effect.') },
    { text: "Evidence: Ten years of rainfall records show the region's dry season growing longer.", right: "The region's dry season appears to be lengthening, a trend that could strain water supplies.", wrong: ['It is possible that maybe the dry season might perhaps be changing somewhat.', 'The region will run out of water within ten years.', 'Rainfall records are meaningless.'], why: T('十年資料足以支持「看起來在延長」；過度保留（maybe… perhaps…）等於沒說，斷言「十年內缺水」又太過頭。', 'Ten years of data support "appears to be lengthening." Piling on hedges says nothing, and predicting no water in ten years overclaims.') },
  ], { q: T('根據這個證據，哪一個主張最恰當？', 'Which claim is best supported by this evidence?'), hint: T('證據有多強？主張有沒有說過頭？', 'How strong is the evidence? Does the claim go too far?') }),
  {
    id: 'g12-argument-order',
    grade: 12,
    unit: 'organization',
    name: T('論證的組織順序', 'Organizing an argument'),
    std: 'CCSS W.11-12.1a',
    lesson: {
      zh: '一篇論說文常見的順序：①<b>背景</b>（讓讀者了解問題）②<b>主張</b>（thesis）③<b>理由與證據</b> ④<b>反方意見與反駁</b> ⑤<b>結論</b>（說明意義）。注意 for this reason、admittedly、in the end 這類訊號字。',
      en: 'A common order for an argument: (1) <b>background</b> on the problem, (2) the <b>claim</b> (thesis), (3) <b>reasons and evidence</b>, (4) the <b>counterargument and rebuttal</b>, (5) a <b>conclusion</b> that shows why it matters. Watch for signals like "for this reason," "admittedly," and "in the end."',
      ex: ['Background → Claim → Reason → Counterargument → Conclusion'],
    },
    gen(r) {
      const s = r.pick(ORDERS);
      if (r.chance(0.4)) {
        const k = r.pick([1, 3, 4]);
        const role = [null, T('主張（thesis）', 'the claim (thesis)'), null, T('反方意見與反駁', 'the counterargument and rebuttal'), T('結論', 'the conclusion')][k];
        return {
          q: T(`這五個句子來自同一篇短論說文。哪一句是${role.zh}？`, `These five sentences come from one short argument. Which sentence is ${role.en}?`),
          ans: ansChoice([s[k], ...r.sample(s.filter((x, i) => i !== k), 3)]),
          sol: [k === 1 ? T('主張句提出作者的立場，通常用 should，並緊接在背景之後。', 'The claim states the position, often with "should," right after the background.')
            : k === 3 ? T('反方段先承認對方的意見（Critics argue、Admittedly、Some object），再用 but／however 反駁。', 'The counterargument first grants the other side (Critics argue, Admittedly, Some object), then rebuts with "but" or "however."')
            : T('結論用 in the end、in short、then 等字收束，說明這個主張為什麼重要。', 'The conclusion wraps up with words like "in the end," "in short," or "then," and shows why the claim matters.'), say(s[k])],
          hint: T('注意訊號字。', 'Watch for signal words.'),
        };
      }
      return {
        q: T('把這篇短論說文的五個句子排成正確順序。', 'Put these five sentences of a short argument in a logical order.'),
        ans: ansOrder(s),
        sol: [T('順序：背景 → 主張 → 理由 → 反方與反駁 → 結論。', 'Order: background → claim → reason → counterargument and rebuttal → conclusion.'), T(`主張句：${s[1]}`, `The claim: ${s[1]}`)],
        hint: T('先找描述現況的句子，再找 should 的主張句。', 'Start with the sentence describing the situation, then find the "should" claim.'),
      };
    },
  },
  {
    id: 'g12-coherence',
    grade: 12,
    unit: 'organization',
    name: T('修改段落的連貫性', 'Revising for coherence'),
    std: 'CCSS W.11-12.2c',
    lesson: {
      zh: '連貫的段落每一句都服務同一個<b>主旨</b>，並且依邏輯順序接下去。修改時，找出偏離主旨的句子：它可能是真的、甚至有趣，但和這一段要說的事無關。',
      en: 'In a coherent paragraph, every sentence serves the same <b>main idea</b> and follows logically from the one before. When revising, find the sentence that drifts: it may be true, even interesting, but it does not serve this paragraph\'s point.',
      ex: ['Main idea: Octopuses solve problems. Off-topic: "Many people enjoy eating seafood."'],
    },
    gen(r) {
      const [sents, off] = subst(r.pick(COHERE), cast(r));
      const right = sents[off], others = r.sample(sents.filter((x, i) => i !== off), 3);
      return {
        q: T('哪一個句子破壞了這段的連貫性，應該刪掉？', 'Which sentence breaks the coherence of this paragraph and should be removed?'),
        text: sents.map((x, i) => `(${i + 1}) ${x}`).join(' '),
        ans: ansChoice([right, ...others]),
        sol: [T(`這段的主旨是：${sents[0]} 只有句子 ${off + 1} 偏離了這個主旨。`, `The paragraph's main idea is set by its first sentence: "${sents[0]}" Only sentence ${off + 1} drifts away from it.`), say(right)],
        hint: T('先用一句話說出這段的主旨。', 'State the main idea in one sentence first.'),
      };
    },
  },
  bankSkill({
    id: 'g12-paraphrase',
    grade: 12,
    unit: 'research',
    name: T('改寫與避免抄襲', 'Paraphrasing without plagiarism'),
    std: 'CCSS W.11-12.8',
    lesson: {
      zh: '合格的改寫（paraphrase）要：①用<b>自己的字詞和句構</b> ②<b>忠於原意</b> ③<b>註明出處</b>。只換幾個同義字、保留原句結構叫「拼湊寫作」（patchwriting），即使有註明出處仍算抄襲；沒有註明出處的改寫也是抄襲。',
      en: 'A real paraphrase (1) uses <b>your own words and sentence structure</b>, (2) keeps the <b>original meaning</b>, and (3) <b>cites the source</b>. Swapping in synonyms while keeping the original structure is "patchwriting"—plagiarism even with a citation. An uncited paraphrase is plagiarism too.',
      ex: ['Original: "Boredom is not the enemy of creativity but its waiting room." (Torres 8)', 'Paraphrase: Torres suggests that boredom often comes just before creative ideas rather than blocking them (8).'],
    },
  }, PARA.map((x) => ({ ...x, text: `Original: ${x.orig}`, why: T('正確答案換了字詞和句構、意思正確，而且有註明出處。其他選項：只換同義字（拼湊寫作）、沒有出處、或扭曲原意。', 'The answer changes both words and structure, keeps the meaning, and cites the source. The others swap synonyms (patchwriting), drop the citation, or distort the meaning.') })),
  { q: T('哪一個是可以接受的改寫（MLA）？', 'Which is an acceptable paraphrase (MLA)?'), hint: T('檢查三件事：自己的句構、原意、出處。', 'Check three things: your own structure, the same meaning, a citation.') }),
  bankSkill({
    id: 'g12-research-synthesis',
    grade: 12,
    unit: 'research',
    name: T('研究報告中的來源綜合', 'Research synthesis'),
    std: 'CCSS W.11-12.7',
    lesson: {
      zh: '研究報告不是把筆記依序貼上。綜合（synthesis）要說出來源之間的<b>關係</b>：互相<b>印證</b>、<b>補充</b>、<b>衝突</b>，或指出研究的<b>空白</b>，並帶出你自己的觀點。',
      en: 'A research paper is not a string of notes. Synthesis states how sources <b>relate</b>—they <b>confirm</b>, <b>extend</b>, or <b>contradict</b> each other, or reveal a <b>gap</b>—and moves toward your own point.',
      ex: ['While Okafor finds X (12), Lindqvist\'s data suggest X holds only when Y (44), which points to a question neither study answers.'],
    },
  }, [
    { text: 'Notes:<br>Okafor (2021): Urban trees lower summer street temperatures by up to 5°C.<br>Lindqvist (2023): The cooling effect is much weaker where trees are young or widely spaced.', right: "Although urban trees can lower street temperatures by as much as 5°C (Okafor 14), that benefit depends heavily on mature, closely planted canopies (Lindqvist 52), so cities should plan for long-term canopy growth, not just planting numbers.", wrong: ['Okafor says trees lower temperatures. Lindqvist says young trees do not cool as much.', 'Urban trees lower temperatures by 5°C, and young trees cool less.', 'Lindqvist proves that Okafor is wrong about trees (52).'], why: T('正確答案說明兩份研究的關係（好處取決於條件），並推出自己的建議。', 'The answer shows how the studies relate (the benefit depends on a condition) and draws its own conclusion.') },
    { text: 'Notes:<br>Mensah (2020): Students in small classes ask more questions.<br>Castillo (2022): Students ask more questions when teachers wait at least five seconds after asking.', right: "Both class size (Mensah 63) and teacher wait time (Castillo 29) point to the same underlying factor: students participate more when they feel they have room to think before speaking.", wrong: ['Mensah writes about small classes, and Castillo writes about wait time.', 'Small classes help, and wait time helps.', 'Castillo shows that class size does not matter (29).'], why: T('正確答案找出兩個來源背後的共同原因，這就是綜合。', 'The answer identifies the shared principle behind both findings—that is synthesis.') },
    { text: 'Notes:<br>Haddad (2022): Catch limits helped two fisheries recover within a decade.<br>Petrov (2019): A third fishery did not recover even after limits, because its breeding grounds had been destroyed.', right: 'Catch limits can rebuild fisheries (Haddad 88), but Petrov\'s case suggests they work only when breeding habitat survives (Petrov 140), so protecting habitat should come first.', wrong: ['Haddad wrote about two fisheries, and Petrov wrote about a third one.', 'Catch limits helped two fisheries but not a third one.', 'Since one fishery did not recover, catch limits never work (Petrov 140).'], why: T('正確答案說明兩個來源的「張力」，並用它推出更精確的主張。', 'The answer uses the tension between the sources to reach a more precise claim.') },
    { text: 'Notes:<br>Brennan (2018): Public libraries are among the most trusted institutions in many towns.<br>Iyer (2023): Library budgets in the region have fallen by 20 percent since 2015.', right: 'Libraries remain among the most trusted public institutions (Brennan 7), yet their budgets have shrunk by a fifth since 2015 (Iyer 31)—a gap between public trust and public funding that this paper investigates.', wrong: ['Brennan says libraries are trusted. Iyer says budgets fell.', 'Libraries are trusted and their budgets fell by 20 percent.', 'Because people trust libraries, their budgets fell (Iyer 31).'], why: T('正確答案指出兩個事實之間的矛盾，並把它變成研究問題。', 'The answer exposes the contradiction between the two facts and turns it into the research question.') },
    { text: 'Notes:<br>Nakamura (2019): Residents describe old bridges as part of their town\'s identity.<br>Torres (2021): Repairing a historic bridge often costs less than replacing it.', right: 'Repairing historic bridges is not only cheaper than replacement in many cases (Torres 22) but also preserves landmarks that residents see as part of who they are (Nakamura 17), so the cultural and financial arguments point the same way.', wrong: ['Nakamura is about identity and Torres is about cost.', 'Old bridges are part of identity, and repairing them is cheaper.', 'Torres proves that every old bridge should be repaired no matter what (22).'], why: T('正確答案把兩個不同面向的證據（文化與經濟）結合成同一個結論。', 'The answer joins two kinds of evidence (cultural and financial) into one conclusion.') },
  ], { q: T('哪一句最能綜合這些筆記？', 'Which sentence best synthesizes these notes?'), hint: T('它有沒有說出來源之間的關係？', 'Does it say how the sources relate?') }),
  bankSkill({
    id: 'g12-lit-thesis',
    grade: 12,
    unit: 'paragraphs',
    name: T('AP 文學分析的論點句', 'AP Lit analysis thesis'),
    std: 'CCSS W.11-12.9a · AP Lit',
    lesson: {
      zh: 'AP 文學作文的論點句要提出<b>可辯護的詮釋</b>：作者<b>透過什麼技巧</b>（意象、結構、象徵、觀點…）表達了<b>什麼複雜的意義</b>。只說情節、只列技巧、只寫抽象主題（Family is important）或個人喜好，都不是論點。',
      en: 'An AP Lit thesis offers a <b>defensible interpretation</b>: <b>through which choices</b> (imagery, structure, symbol, point of view…) the writer conveys <b>what complex meaning</b>. Plot summary, a list of devices, a bare theme ("Family is important"), or personal taste is not a thesis.',
      ex: ['Weak: The author uses imagery, dialogue, and symbolism.', 'Strong: Through the image of dough stretched thin without tearing, the author suggests that love can hold a family together even as it lets a child go.'],
    },
  }, [
    { text: 'Prompt: In the passage, a grandmother teaches her granddaughter to make dumplings on the night before the granddaughter leaves for college. Analyze how the author conveys the complex relationship between them.', right: "Through the grandmother's patient corrections and the image of dough stretched thin without tearing, the author suggests that love can hold a family together even as it lets a child go.", wrong: ['The passage is about a grandmother and a granddaughter making dumplings.', 'The author uses imagery, dialogue, and symbolism in the passage.', 'Family is very important.', 'I enjoyed this passage because it reminded me of my own grandmother.'] },
    { text: 'Prompt: In the poem, the speaker walks along a beach where she played as a child. Analyze how the poet portrays memory.', right: 'By shifting from images of a rising tide to a single stranded shell, the poet portrays memory as a force that both returns the past to us and leaves us alone with its fragments.', wrong: ['The poem is about a woman walking on a beach.', 'The poet uses imagery and metaphor to talk about memory.', 'Memory is something everyone has.', 'This poem is beautiful and very relatable.'] },
    { text: 'Prompt: Choose a work in which a character\'s fear of weakness leads to destruction. Explain how this fear contributes to the meaning of the work as a whole.', right: "In Things Fall Apart, Okonkwo's dread of seeming weak drives him to violate the very customs he believes he is defending, revealing how a rigid idea of strength can make a person fragile.", wrong: ['Things Fall Apart is a novel by Chinua Achebe about a man named Okonkwo.', 'Okonkwo is a strong character who is afraid of being weak.', 'Fear is a major theme in many novels.', 'Okonkwo is my favorite character because he is so complicated.'] },
    { text: 'Prompt: In the passage, a teenager working the night shift at a diner observes the regular customers. Analyze how the author develops the narrator\'s sense of belonging.', right: "The narrator's precise, almost tender descriptions of the late-night regulars reveal that the diner, not the narrator's quiet apartment, has become home, suggesting that belonging can grow from small acts of attention.", wrong: ['The narrator works at a diner and describes the customers.', 'The author uses detail, imagery, and tone to develop the narrator.', 'Everyone wants to belong somewhere.', 'The passage was hard to understand, but the ending was good.'] },
    { text: 'Prompt: In the poem, the speaker describes the fence between her yard and a neighbor\'s. Analyze how the poet develops the poem\'s meaning.', right: 'As the fence changes from a barrier into a trellis for vines both neighbors tend, the poem suggests that the boundaries people build can become the very structures that connect them.', wrong: ['The poem describes a fence between two yards.', 'The poet uses symbolism, imagery, and personification.', 'Good fences make good neighbors.', 'I like this poem because I also have a fence at home.'] },
    { text: "Prompt: Choose a work in which a character's hesitation has serious consequences. Explain how the hesitation contributes to the meaning of the work.", right: "In Hamlet, the prince's soliloquies circle rather than resolve, showing how a mind that demands certainty before acting can bring about the very tragedy it hopes to avoid.", wrong: ['Hamlet is a play by William Shakespeare about a prince of Denmark.', 'Hamlet waits a long time to take revenge.', 'Thinking too much can be bad.', 'Hamlet is a hard play to read, but it is worth it.'] },
  ].map((x) => ({ ...x, why: T('正確答案同時說出「技巧」（怎麼寫）和「複雜的意義」（寫出什麼），可以用文本證據辯護。', 'The answer names both the technique (how) and a complex meaning (what), and it can be defended with evidence from the text.'), why2: T('其他選項是情節摘要、技巧清單、空泛主題或個人喜好。', 'The others are plot summary, a list of devices, a bare theme, or personal taste.') })),
  { q: T('哪一個是最好的文學分析論點句？', 'Which is the strongest thesis for this literary analysis prompt?'), hint: T('它有沒有同時說出「怎麼寫」和「意義」？', 'Does it name both the technique and the meaning?') }),
];

// ======================================================================= PROMPTS · GRADE 10
const p10 = [
  {
    id: 'w10-argument-policy',
    grade: 10,
    genre: 'argument',
    std: 'CCSS W.9-10.1',
    title: T('論說文：學校該改變嗎？', 'Argument essay: Should our school change?'),
    topics: [T('高中是否應該延後到 8:30 以後上課', 'whether high schools should start at 8:30 a.m. or later'), T('上課時手機是否應該鎖在置物櫃', 'whether phones should be locked away during class'), T('學校是否應該改成一週上四天課', 'whether schools should switch to a four-day week'), T('畢業是否應該要求社區服務時數', 'whether community service should be required for graduation'), T('16 歲是否應該可以在地方選舉投票', 'whether 16-year-olds should vote in local elections')],
    prompt: T('針對「{t}」寫一篇論說文。提出明確、可被反對的論點，用至少兩個理由和具體證據支持，並公平地回應一個反方意見。', 'Write an argumentative essay on {t}. Take a clear, arguable position, support it with at least two reasons and specific evidence, and respond fairly to an opposing view.'),
    plan: [
      { label: T('引言與論點', 'Hook and thesis'), hint: T('用一個事實、場景或問題開頭，最後一句寫出論點和理由。', 'Open with a fact, scene, or question; end with a thesis that previews your reasons.') },
      { label: T('理由一 + 證據', 'Reason 1 + evidence'), hint: T('主題句 → 證據（數據、例子、專家）→ 解釋證據如何支持論點。', 'Topic sentence → evidence (data, example, expert) → explain how it supports the claim.') },
      { label: T('理由二 + 證據', 'Reason 2 + evidence'), hint: T('換一個角度的理由，同樣要有證據和解釋。', 'A reason from a different angle, again with evidence and explanation.') },
      { label: T('反方與反駁', 'Counterargument and rebuttal'), hint: T('Some argue that… It is true that… However…', 'Some argue that… It is true that… However…') },
      { label: T('結論', 'Conclusion'), hint: T('不要只是重複；說明這件事為什麼重要、讀者該做什麼。', 'Do not just repeat; show why it matters and what should happen next.') },
    ],
    starters: ['Every morning at 6:15, …', 'Our school should … because …', 'The strongest reason is that …', 'According to …', 'Some argue that …; however, …', 'It is true that …, but …', 'Ultimately, …'],
    words: [450, 700],
    checklist: [
      T('論點明確、可以被反對，而且預告了理由。', 'My thesis is clear, arguable, and previews my reasons.'),
      T('每個身體段都有主題句、證據和我自己的解釋。', 'Each body paragraph has a topic sentence, evidence, and my own explanation.'),
      T('證據具體（數字、例子、來源），並標明出處。', 'My evidence is specific (numbers, examples, sources) and credited.'),
      T('我公平地說明反方意見，再用證據反駁。', 'I state an opposing view fairly and rebut it with evidence.'),
      T('我用轉折詞（however、as a result、for example）連接想法。', 'I use transitions (however, as a result, for example) to connect ideas.'),
      T('結論說明這件事的重要性，不只是重複論點。', 'My conclusion shows why the issue matters instead of just repeating.'),
      T('語氣正式，沒有俚語或人身攻擊。', 'My tone is formal, with no slang or personal attacks.'),
    ],
    mentor: {
      title: 'Let Teenagers Sleep',
      text: `At 6:15 on a Tuesday morning, the bus stop outside my building is silent except for the sound of yawning. Fifteen students stand in the dark, most of them holding phones they are too tired to look at. By the time first period begins at 7:30, many of us have been awake for barely an hour. Our district should move the high school start time to 8:30 a.m., because a later start would improve students' health, attendance, and safety.

The strongest reason is biological. During adolescence, the body's internal clock shifts later, so most teenagers cannot fall asleep before 11 p.m. no matter how early they go to bed. Pediatric researchers recommend that teens sleep eight to ten hours a night, yet a 7:30 start makes that nearly impossible. A student who falls asleep at 11 and wakes at 6 is losing at least one hour every night, which adds up to more than five hours by Friday. No amount of willpower can fix a schedule that fights human biology.

A later start would also keep more students in class. Districts that have changed their schedules report fewer tardy students and better first-period attendance. This makes sense: when students are not exhausted, they are less likely to oversleep, skip breakfast, or decide that first period is not worth the effort. Every class that a student actually attends is a class in which learning can happen.

Some parents argue that a later start would push sports practices and after-school jobs into the evening. This concern is reasonable, since families have built their routines around the current schedule. However, schools that made the change adjusted practices by thirty to sixty minutes, and many coaches found that well-rested athletes performed better and were injured less often. A small change to the afternoon is a fair price for healthier mornings.

Finally, sleep is a safety issue. Many juniors and seniors drive to school, and a drowsy driver reacts more slowly than an alert one. Giving students one more hour of sleep is one of the simplest ways to make the morning commute safer for everyone.

Our district asks students to learn chemistry, analyze novels, and plan for college, all before most of our brains are fully awake. Moving the start time to 8:30 would not solve every problem, but it would let us arrive ready to learn. The bus stop at 6:15 should not be the most exhausting part of the day.`,
      note: T('開頭用具體場景吸引讀者，論點預告三個理由；每段都有證據和解釋；反方段公平地讓步再反駁；結論回到開頭的畫面。', 'A concrete scene opens the essay, and the thesis previews three reasons. Each paragraph pairs evidence with explanation, the counterargument is conceded fairly before the rebuttal, and the ending returns to the opening image.'),
    },
    vocab: ['consequently', 'moreover', 'admittedly', 'nevertheless', 'evidence suggests', 'in contrast', 'ultimately'],
  },
  {
    id: 'w10-rhetorical-analysis',
    grade: 10,
    genre: 'informative',
    std: 'CCSS RI.9-10.6 · W.9-10.2',
    title: T('修辭分析：作者如何說服讀者？', 'Rhetorical analysis: How does the writer persuade?'),
    topics: [
      T('一位公園巡山員請遊客留在步道上的演說（內容：這片草地花了四十年長成，卻可能在一個下午被踩毀。）', 'this passage from a park ranger\'s talk: "The meadow beside you took forty years to grow. It can be destroyed in one afternoon. Every step you take off this trail is a vote for which future this mountain will have."'),
      T('一位校長在募款餐會上的開場（內容：說明圖書館對學生的重要。）', 'this passage from a principal\'s speech at a fundraiser: "Some of our students have no quiet place at home to read. For them, the library is not a room. It is a door. Tonight, I am asking you to keep that door open."'),
      T('一位科學家寫給高中生的信（內容：坦承自己第一次實驗失敗。）', 'this passage from a scientist\'s letter to high school students: "My first experiment failed so badly that the lab smelled of burned sugar for a week. I almost quit. I am glad I did not, because failure turned out to be the most honest teacher I ever had."'),
      T('一位市長在洪水後的演說（內容：呼籲居民留下來重建。）', 'this passage from a mayor\'s speech after a flood: "Our grandparents rebuilt this street after the flood of 1952. They did not leave. They did not give up. They picked up their shovels, and so will we."'),
      T('一則社區報紙的社論（內容：呼籲增設腳踏車道。）', 'this passage from a community newspaper editorial: "Since the city painted bike lanes on Elm Street, the number of cyclists has doubled. Imagine what protected lanes, separated from traffic by a simple curb, could do for every street in town."'),
    ],
    prompt: T('閱讀{t}寫一篇修辭分析：說明作者的目的、對象，並分析至少兩個修辭選擇（例如 ethos、pathos、logos、重複、意象、用字）如何幫助作者達成目的。', 'Read {t} Write a rhetorical analysis: identify the writer\'s purpose and audience, then analyze how at least two rhetorical choices (such as appeals, repetition, imagery, or diction) help achieve that purpose.'),
    plan: [
      { label: T('背景與論點', 'Context and thesis'), hint: T('誰、在什麼場合、對誰說、目的是什麼？論點說出「選擇」和「效果」。', 'Who is speaking, where, to whom, and why? Your thesis names the choices and their effect.') },
      { label: T('修辭選擇一', 'Rhetorical choice 1'), hint: T('引用原文 → 說明這個選擇 → 解釋它如何影響聽眾。', 'Quote the text → name the choice → explain how it affects the audience.') },
      { label: T('修辭選擇二', 'Rhetorical choice 2'), hint: T('另一個選擇，並說明它和第一個選擇如何互相配合。', 'A second choice, and how it works with the first.') },
      { label: T('結論', 'Conclusion'), hint: T('說明這些選擇合起來為什麼有效。', 'Explain why the choices work together.') },
    ],
    starters: ['In her talk to visitors, the ranger …', 'The speaker\'s purpose is to …', 'By describing …, the writer …', 'This choice is effective because …', 'The repetition of … emphasizes …', 'Together, these choices …'],
    words: [450, 700],
    checklist: [
      T('我說明了說話者、場合、對象和目的。', 'I identify the speaker, occasion, audience, and purpose.'),
      T('論點說出修辭選擇以及它們達成的效果。', 'My thesis names rhetorical choices and the effect they achieve.'),
      T('每個段落都引用原文作為證據。', 'Each body paragraph quotes the text as evidence.'),
      T('我解釋「如何」和「為什麼」有效，而不只是指出技巧。', 'I explain how and why each choice works, not just name it.'),
      T('我用文學現在式描述作者的選擇（the ranger argues…）。', 'I use the present tense for the writer\'s choices (the ranger argues…).'),
      T('我用了精確的動詞：emphasizes、evokes、reinforces、appeals to。', 'I use precise verbs: emphasizes, evokes, reinforces, appeals to.'),
    ],
    mentor: {
      title: 'One Step, One Vote',
      text: `Standing at a trailhead in front of a crowd of tired, sunburned hikers, a park ranger has only a few seconds to change their behavior. In her short talk, she tells visitors that "the meadow beside you took forty years to grow" and that "it can be destroyed in one afternoon." Her purpose is to persuade casual visitors to stay on the marked trail. By contrasting decades of slow growth with a single careless afternoon, and by recasting each footstep as a "vote," the ranger turns an easy-to-ignore rule into a personal responsibility.

The ranger's first choice is a sharp contrast in time. The phrase "forty years" makes the meadow seem patient and fragile, while "one afternoon" makes destruction sound sudden and effortless. The two short, parallel sentences sit side by side, so listeners feel the imbalance immediately. Most hikers have never thought about how long a meadow takes to grow; the contrast gives them a fact they can picture. Because she says "the meadow beside you," rather than "meadows in general," the damage feels close enough to touch.

Her second choice is a metaphor that gives every visitor power. She ends by claiming that "every step you take off this trail is a vote for which future this mountain will have." A vote is something people take seriously, and the word suggests both freedom and responsibility. The metaphor also flatters the audience: instead of scolding them, the ranger treats them as citizens whose choices matter. Hikers who might roll their eyes at a warning sign are more likely to respond to an invitation to decide the mountain's future.

Together, these choices work because they match the situation. The ranger has little time and no authority to follow every hiker, so she cannot rely on threats. Instead, she gives her audience a vivid picture and a sense of ownership that will stay with them after she stops talking. By the time the hikers set off, the trail is no longer just a rule; it is a choice they have been asked to make well.`,
      note: T('第一段交代情境、目的和論點；兩個身體段各分析一個選擇，引用原文並解釋效果；結論說明這些選擇為什麼適合這個場合。', 'The first paragraph gives context, purpose, and a thesis. Each body paragraph analyzes one choice with quotations and explains its effect, and the conclusion shows why the choices fit the situation.'),
    },
    vocab: ['contrast', 'metaphor', 'diction', 'emphasizes', 'evokes', 'appeals to', 'reinforces', 'audience'],
  },
  {
    id: 'w10-literary-analysis',
    grade: 10,
    genre: 'literary',
    std: 'CCSS RL.9-10.2 · W.9-10.9a',
    title: T('文學分析：一部作品中的意義', 'Literary analysis: meaning in a work'),
    topics: [T('一部小說或劇本中的一個象徵', 'a symbol in a novel or play you have read'), T('一個角色如何改變', 'how a main character changes'), T('場景（時間地點）如何影響故事', 'how the setting shapes a story'), T('作者如何製造懸疑', 'how an author builds suspense'), T('個人與社會之間的衝突', 'a conflict between an individual and society')],
    prompt: T('選一部你讀過的小說、劇本或短篇小說，分析{t}。提出一個詮釋性的論點，用文本中的引文支持，並解釋它如何呈現作品的主題。', 'Choose a novel, play, or short story you have read and analyze {t}. Make an interpretive claim, support it with quotations from the text, and explain how it develops the work\'s theme.'),
    plan: [
      { label: T('引言與論點', 'Introduction and thesis'), hint: T('作品、作者、簡短背景；論點說出你的詮釋。', 'Title, author, brief context; a thesis that states your interpretation.') },
      { label: T('證據一（故事前段）', 'Evidence 1 (early in the work)'), hint: T('引文 + 分析：它在這裡代表什麼？', 'Quotation + analysis: what does it mean here?') },
      { label: T('證據二（故事中後段）', 'Evidence 2 (later in the work)'), hint: T('它如何改變或發展？', 'How does it change or develop?') },
      { label: T('結論：主題', 'Conclusion: theme'), hint: T('這說明了作品關於人性或社會的什麼看法？', 'What does this reveal about the work\'s view of people or society?') },
    ],
    starters: ['In Lord of the Flies, William Golding …', 'At first, … represents …', 'This moment suggests that …', 'Later, when …, the …', 'Golding\'s choice to … reveals …', 'Ultimately, the novel suggests that …'],
    words: [450, 700],
    checklist: [
      T('論點是詮釋（可以被討論），不是情節摘要。', 'My thesis is an interpretation that could be debated, not a plot summary.'),
      T('我用引文支持，並標明頁碼或幕次。', 'I support my claims with quotations and page or act numbers.'),
      T('每段引文後面的分析比引文長。', 'My analysis after each quotation is longer than the quotation.'),
      T('我用文學現在式。', 'I write in the literary present tense.'),
      T('我把引文嵌入自己的句子。', 'I embed quotations in my own sentences.'),
      T('結論連到作品的主題。', 'My conclusion connects to the work\'s theme.'),
    ],
    mentor: {
      title: 'The Conch and the Collapse of Order',
      text: `In William Golding's Lord of the Flies, a group of boys stranded on an island try to build a society from nothing. The first tool they use is not a weapon or a shelter but a seashell. Golding uses the conch as a symbol of democratic order, and its gradual loss of power, ending in its destruction, shows how fragile civilization becomes when people stop agreeing to respect it.

Early in the novel, the conch gives the boys a way to govern themselves. Ralph blows it to call the scattered children together, and the group decides that whoever holds the conch may speak without interruption. The shell has no real power; it is only a rule the boys have agreed on. Yet that agreement is exactly what makes it powerful. Even the smallest boys can speak when they hold it, so the conch represents fairness as much as order. Golding suggests that civilization is not a natural state but a shared promise.

As fear of the "beast" spreads, the promise weakens. Jack begins to ignore the rule, declaring that the conch does not count on his end of the island. His words reveal that the shell's authority exists only where people choose to honor it. The meetings grow shorter and angrier, and more boys drift toward Jack's hunters, who offer meat and excitement instead of rules. The conch is still there, but fewer and fewer boys listen to the person holding it.

The symbol reaches its end when Piggy, clutching the conch and pleading for reason, is struck by a boulder that Roger sends crashing down the cliff. The conch "exploded into a thousand white fragments and ceased to exist." Golding destroys the shell and its most loyal defender in the same moment, showing that once the agreement behind order is broken, violence fills the space it leaves.

Through the rise and fall of the conch, Golding argues that order depends on belief rather than force. The boys do not lose their civilization in a single battle; they lose it one ignored rule at a time. The novel warns readers that the structures protecting the weak are only as strong as the people willing to respect them.`,
      note: T('論點是詮釋（海螺象徵民主秩序），三個身體段依照小說順序追蹤象徵的變化；引文嵌入句中，結論提出作品對人性的看法。', 'The thesis is an interpretation (the conch as democratic order). The body paragraphs trace the symbol in story order, quotations are embedded, and the conclusion states what the novel suggests about people.'),
    },
    vocab: ['symbolizes', 'represents', 'suggests', 'reveals', 'gradually', 'ultimately', 'theme', 'foreshadows'],
  },
  {
    id: 'w10-research',
    grade: 10,
    genre: 'research',
    std: 'CCSS W.9-10.7 · W.9-10.8',
    title: T('研究報告：回答一個真正的問題', 'Research paper: answer a real question'),
    topics: [T('城市如何對抗極端高溫', 'how cities can fight extreme heat'), T('睡眠如何影響學習', 'how sleep affects learning'), T('塑膠微粒對海洋生物的影響', 'how microplastics affect ocean life'), T('蜜蜂數量減少的原因', 'why bee populations are declining'), T('社群媒體如何影響專注力', 'how social media affects attention')],
    prompt: T('針對{t}提出一個研究問題，找至少三個可信的來源，寫一篇有 MLA 格式引用的研究報告。報告要綜合來源，而不是一個個摘要。', 'Develop a research question about {t}. Use at least three credible sources and write a research paper with MLA citations. Synthesize your sources instead of summarizing them one by one.'),
    plan: [
      { label: T('研究問題與論點', 'Research question and thesis'), hint: T('一個可以研究的具體問題，以及你根據研究得出的答案。', 'A focused, researchable question and the answer your research supports.') },
      { label: T('背景', 'Background'), hint: T('讀者需要知道的定義和事實。', 'Definitions and facts readers need.') },
      { label: T('發現一', 'Finding 1'), hint: T('結合兩個來源，說明它們如何互相印證或補充。', 'Combine two sources and show how they confirm or extend each other.') },
      { label: T('發現二', 'Finding 2'), hint: T('另一個角度、限制或爭議。', 'Another angle, a limitation, or a debate.') },
      { label: T('結論與引用文獻', 'Conclusion and works cited'), hint: T('回答研究問題，指出還不知道的部分；列出 MLA 引用文獻。', 'Answer the question, note what is still unknown, and list your MLA works cited.') },
    ],
    starters: ['How can cities …?', 'According to …, …', 'This finding is supported by …', 'However, … complicates this picture.', 'Taken together, these sources suggest …', 'Further research is needed on …'],
    words: [450, 700],
    checklist: [
      T('我有一個具體、可研究的問題。', 'I have a focused, researchable question.'),
      T('我用了至少三個可信的來源（看作者、目的、日期）。', 'I use at least three credible sources (author, purpose, date checked).'),
      T('我綜合來源，說明它們之間的關係。', 'I synthesize sources and show how they relate.'),
      T('所有引用和改寫都有 MLA 文中引用。', 'Every quotation and paraphrase has an MLA in-text citation.'),
      T('我用自己的話改寫，沒有拼湊抄襲。', 'My paraphrases use my own words and structure.'),
      T('最後有正確格式的 Works Cited。', 'I end with a correctly formatted Works Cited list.'),
      T('語氣客觀，沒有「我覺得」。', 'My tone is objective, without "I feel."'),
    ],
    mentor: {
      title: 'Cooling the Concrete: How Cities Can Fight Extreme Heat',
      text: `On summer afternoons, a city street can be several degrees hotter than a park only a few blocks away. This difference, called the urban heat island effect, is becoming more dangerous as heat waves grow longer. How can cities protect residents from extreme heat? Research suggests that the most effective strategies combine shade, reflective surfaces, and community planning.

Cities trap heat because their surfaces absorb sunlight. Dark asphalt and roofs soak up energy during the day and release it slowly at night, so neighborhoods with little greenery never fully cool down (Okafor 14). As a result, residents in these areas face higher risks of heat illness, especially older adults and people without air conditioning.

Trees are one of the most powerful tools for cooling a city. Okafor found that tree-lined streets can be up to 5 degrees Celsius cooler than unshaded ones during summer afternoons (16). Lindqvist's research adds an important detail: the benefit depends on mature, closely spaced trees, so a newly planted row of saplings offers little relief for years (52). Taken together, these studies suggest that planting trees is necessary but not sufficient; cities must also protect the trees they already have.

Reflective surfaces offer faster results. Painting roofs and pavement in light colors reflects sunlight instead of absorbing it. In one pilot program described by Torres, a neighborhood that coated its streets with a reflective sealant recorded lower surface temperatures within a single summer (7). However, Torres also notes that reflected light can make sidewalks uncomfortably bright, so designers must choose materials carefully (8).

Finally, planning matters as much as materials. Cooling centers, shaded bus stops, and alerts for vulnerable residents can save lives during the worst heat waves, even before long-term changes take effect (Nakamura 30).

The evidence shows that no single solution can cool a city. Trees provide lasting shade, reflective surfaces deliver quick improvements, and good planning protects people in the meantime. Further research should examine which combinations work best in different climates.

Works Cited (sources invented for this model)
Lindqvist, Erik. "Canopy and Climate." Urban Review, 3 May 2023, www.urbanreview.org/canopy.
Nakamura, Ren. Signals of Summer: Planning for Heat. Harbor Press, 2022.
Okafor, Amara. The Patient Garden. Juniper Press, 2021.
Torres, Maya. "Can Cities Learn to Cool Themselves?" Urban Review, 12 June 2022, www.urbanreview.org/cool-cities.`,
      note: T('研究問題清楚，論點直接回答；身體段把兩個來源放在一起比較，也指出限制；每個引用都有 MLA 文中引用，最後附上 Works Cited（此範文的來源是虛構的）。', 'A clear research question with a thesis that answers it. Body paragraphs put sources in conversation and note limitations; every borrowed idea has an MLA citation, and a Works Cited list follows. (The sources in this model are invented.)'),
    },
    vocab: ['according to', 'research suggests', 'taken together', 'however', 'in addition', 'further research', 'synthesize'],
  },
  {
    id: 'w10-narrative',
    grade: 10,
    genre: 'narrative',
    std: 'CCSS W.9-10.3',
    title: T('短篇小說：一個轉折的時刻', 'Short story: a turning point'),
    topics: [T('一個必須做出決定的時刻', 'a moment when a character must make a choice'), T('一件物品從一個人手中傳到另一個人手中', 'an object that passes from one person to another'), T('第一次來到一個新地方', 'a first day in a new place'), T('從結局開始說起的故事', 'a story that begins at the end'), T('一個誤會如何被解開', 'a misunderstanding that is finally cleared up')],
    prompt: T('寫一篇短篇小說，主題是{t}。用具體的場景、對話和感官細節，安排情節的鋪陳、轉折和結局，讓角色在故事中有所改變。', 'Write a short story about {t}. Use a specific setting, dialogue, and sensory detail; build the plot toward a turning point; and let your main character change by the end.'),
    plan: [
      { label: T('開場：角色與場景', 'Opening: character and setting'), hint: T('從一個動作或畫面開始，不要從「從前從前」開始。', 'Start with an action or image, not with background.') },
      { label: T('衝突', 'Conflict'), hint: T('角色想要什麼？什麼阻擋他？', 'What does the character want, and what stands in the way?') },
      { label: T('轉折點', 'Turning point'), hint: T('一個決定、一句話或一個發現。', 'A choice, a line of dialogue, or a discovery.') },
      { label: T('結局與改變', 'Resolution and change'), hint: T('角色現在看事情的方式有什麼不同？', 'How does the character see things differently now?') },
    ],
    starters: ['The envelope had been on the counter for three days.', '"You\'re sure about this?" …', 'By the time the bus reached …', 'For a moment, nobody moved.', 'It was only later that …'],
    words: [450, 700],
    checklist: [
      T('開頭就把讀者丟進一個場景。', 'My opening drops the reader into a scene.'),
      T('角色有一個清楚的渴望和阻礙。', 'My character has a clear desire and obstacle.'),
      T('我用對話推進情節，並正確使用引號和標點。', 'I use dialogue to move the plot and punctuate it correctly.'),
      T('我用感官細節「展示」而不是「陳述」。', 'I use sensory details to show rather than tell.'),
      T('故事有一個清楚的轉折點。', 'My story has a clear turning point.'),
      T('結局顯示角色的改變，不急著收尾。', 'My ending shows how the character has changed, without rushing.'),
      T('時態前後一致。', 'My verb tenses are consistent.'),
    ],
    mentor: {
      title: 'The Second Violin',
      text: `The violin case had been leaning against Mei's closet door for three weeks, and every morning she stepped around it as if it were a sleeping dog.

It had belonged to her grandmother, who had played in a small orchestra in Tainan for forty years. When the case arrived in the mail, wrapped in two layers of newspaper and a note that said only "For Mei," her mother had cried in the kitchen. Mei had not opened it. She had quit lessons at eleven, after a recital where her bow skidded across the strings like a shopping cart with a broken wheel.

"You don't have to play it," her mother said one night, drying a pot that was already dry. "But you could at least look."

So, on a Saturday, Mei did. The case smelled of cedar and something older, like a library basement. Inside, the violin was smaller than she remembered, its varnish worn pale where a chin had rested for decades. Tucked beneath the scroll was a folded sheet of music. In the margins, in her grandmother's tiny handwriting, were notes: "breathe here," "slower than you think," and, beside the hardest passage, "Everyone misses this the first hundred times."

Mei laughed out loud, alone in her room.

She tuned the strings badly, then less badly. She tried the first line and winced. The sound was thin and scratchy, nothing like the recordings her grandmother used to play while cooking. She tried again. On the fourth attempt, something in the middle phrase rang clear for half a second, and she felt it in her collarbone.

That night, her mother found her still playing, the same eight measures over and over.

"It sounds terrible," Mei said, before her mother could speak.

"It sounds like her when she practiced," her mother answered. "She always sounded terrible at first. That was the secret."

Mei looked at the note in the margin again. Everyone misses this the first hundred times. She had always thought her grandmother was simply gifted. Now she understood that her grandmother had just been willing to sound terrible for longer than anyone else.

She set the bow back on the strings. Ninety-six to go.`,
      note: T('開頭用具體畫面（像沉睡的狗一樣的琴盒）；衝突是害怕失敗；轉折點是祖母在樂譜邊的筆記；結局用一句幽默的話顯示角色的改變。', 'The opening image (the case like a sleeping dog) hooks the reader, the conflict is fear of failure, the turning point is the note in the margin, and a wry final line shows how the character has changed.'),
    },
    vocab: ['hesitated', 'murmured', 'for a moment', 'it was only later that', 'suddenly', 'meanwhile', 'at last'],
  },
  {
    id: 'w10-compare-characters',
    grade: 10,
    genre: 'compare',
    std: 'CCSS RL.9-10.3 · W.9-10.2',
    title: T('比較與對照：兩個角色、兩部作品', 'Compare and contrast: two characters or texts'),
    topics: [T('同一部作品中兩個個性相反的角色', 'two contrasting characters in the same work'), T('一部小說和它改編的電影', 'a novel and its film adaptation'), T('兩首主題相同的詩', 'two poems on the same subject'), T('兩場目的相同的演說', 'two speeches with the same goal'), T('兩篇報導同一事件的新聞', 'two news articles about the same event')],
    prompt: T('寫一篇比較與對照的文章，分析{t}。不要只列出異同，要說明這些異同揭示了什麼更大的意義。', 'Write a compare-and-contrast essay on {t}. Do not simply list similarities and differences—explain what they reveal.'),
    plan: [
      { label: T('引言與論點', 'Introduction and thesis'), hint: T('介紹兩者，論點說出比較之後的發現。', 'Introduce both; the thesis states what the comparison reveals.') },
      { label: T('比較點一', 'Point of comparison 1'), hint: T('逐點比較：同一段裡同時談兩者。', 'Point by point: discuss both in the same paragraph.') },
      { label: T('比較點二', 'Point of comparison 2'), hint: T('第二個面向，用 while、whereas、similarly 等連接。', 'A second aspect, linked with while, whereas, similarly.') },
      { label: T('結論', 'Conclusion'), hint: T('這個比較讓我們對作品有什麼新的理解？', 'What new understanding does the comparison give us?') },
    ],
    starters: ['Although … and … both …, they …', 'Whereas …, …', 'Similarly, …', 'In contrast, …', 'This difference reveals …', 'By placing … beside …, Shakespeare …'],
    words: [450, 700],
    checklist: [
      T('論點說出比較的意義，而不是只說「有相同也有不同」。', 'My thesis states what the comparison reveals, not just "they are similar and different."'),
      T('我逐點比較，每段都談到兩者。', 'I compare point by point, discussing both in each paragraph.'),
      T('我用比較和對照的轉折詞。', 'I use compare/contrast transitions.'),
      T('每個比較點都有文本證據。', 'Each point has textual evidence.'),
      T('兩邊的篇幅大致平衡。', 'I give both subjects roughly equal attention.'),
      T('結論提出新的理解。', 'My conclusion offers a new insight.'),
    ],
    mentor: {
      title: 'Two Kinds of Fire: Mercutio and Tybalt',
      text: `In Romeo and Juliet, Mercutio and Tybalt are both quick-tempered young men who die in the same street fight. At first glance they seem to be mirror images, one loyal to the Montagues and one to the Capulets. Yet Shakespeare contrasts their ways of speaking and their attitudes toward the feud, and that contrast shows how the feud destroys even those who see through it.

The two men differ most in how they use words. Mercutio treats language as play. His long speech about Queen Mab spins from fairies to soldiers to dreams until Romeo has to stop him, and even when he is fatally wounded he jokes that tomorrow he will be "a grave man." Tybalt, by contrast, speaks in short, hard lines. When Benvolio asks him to help keep the peace, Tybalt answers that he hates the word "peace" as he hates "hell, all Montagues, and thee." Mercutio's words open up possibilities; Tybalt's words close them down.

Their attitudes toward the feud are just as different. Tybalt believes in it completely. For him, family honor is a cause worth killing for, and he searches for Romeo after the party because a Montague dared to attend. Mercutio belongs to neither family. He fights because Romeo refuses to, and because he cannot stand to see his friend appear weak. His final curse, "A plague o' both your houses!", shows that he understands the feud is senseless, even as it kills him.

Placing these two characters side by side reveals the tragedy's larger point. Tybalt, the true believer, dies for the feud, but so does Mercutio, the skeptic who mocks it. Shakespeare suggests that hatred passed down through families does not care whether people believe in it. Once violence becomes the custom of a city, wit and loyalty offer no protection. The feud consumes both kinds of fire, and Romeo's world grows darker with each one it puts out.`,
      note: T('論點說出比較的意義（仇恨不分信徒或懷疑者）；兩個身體段逐點比較（說話方式、對世仇的態度），每段都談兩人；結論把比較連到悲劇的主題。', 'The thesis states what the comparison reveals. Each body paragraph compares one point (language, attitude toward the feud) for both characters, and the conclusion ties the contrast to the tragedy\'s theme.'),
    },
    vocab: ['whereas', 'similarly', 'in contrast', 'both', 'likewise', 'on the other hand', 'reveals'],
  },
  {
    id: 'w10-poem',
    grade: 10,
    genre: 'poem',
    std: 'CCSS W.9-10.3d',
    title: T('詩：給平凡事物的頌歌', 'Poem: an ode to an ordinary thing'),
    topics: [T('一雙舊球鞋', 'a pair of old sneakers'), T('城市公車', 'a city bus'), T('家裡的電鍋', 'a rice cooker'), T('圖書館的一張桌子', 'a library table'), T('一支用到很短的鉛筆', 'a pencil worn down to a stub')],
    prompt: T('寫一首「頌歌」（ode），讚美{t}。用具體的意象、至少一個延伸隱喻或擬人，並讓詩的最後幾行揭示這個東西對你的更深意義。', 'Write an ode that praises {t}. Use concrete imagery, at least one extended metaphor or personification, and let the final lines reveal a deeper meaning the object holds for you.'),
    plan: [
      { label: T('直接對它說話', 'Address the object'), hint: T('頌歌常以「O…」或直接稱呼開頭。', 'Odes often speak to the object directly.') },
      { label: T('具體意象', 'Concrete images'), hint: T('顏色、聲音、觸感、氣味。', 'Color, sound, texture, smell.') },
      { label: T('延伸隱喻／擬人', 'Extended metaphor or personification'), hint: T('它像什麼？如果它是人，它會做什麼？', 'What is it like? If it were a person, what would it do?') },
      { label: T('轉折與更深的意義', 'Turn and deeper meaning'), hint: T('最後幾行轉向：它其實代表什麼？', 'In the last lines, turn: what does it really stand for?') },
    ],
    starters: ['O humble …,', 'You who …', 'Every morning you …', 'No one writes songs for …', 'And still you …'],
    words: [100, 250],
    checklist: [
      T('我直接對這個東西說話。', 'I address the object directly.'),
      T('我用了至少三個具體的感官意象。', 'I use at least three concrete sensory images.'),
      T('我用了延伸隱喻或擬人。', 'I use an extended metaphor or personification.'),
      T('詩的結尾有轉折，揭示更深的意義。', 'My ending turns to reveal a deeper meaning.'),
      T('分行有目的（換行停在重要的字）。', 'My line breaks are purposeful, ending on important words.'),
      T('每個字都精確，刪掉不必要的字。', 'Every word is precise; I cut what is not needed.'),
    ],
    mentor: {
      title: 'Ode to a Rice Cooker',
      text: `O small white moon on the kitchen counter,
you hum the same low song
my grandmother hummed while she washed the grains,
three rinses, never four.

You ask for so little:
a cup of rice, a knuckle of water,
the patient press of one button.
Then you breathe,
a cloud rising from your single eye,
and the whole apartment smells like evening.

You have crossed an ocean in a suitcase,
wrapped in two sweaters and a winter coat.
You have fed us through exams and arguments,
birthdays, rain, the long first winter
when nothing else felt like home.

When your little light clicks from COOK to WARM,
I think that must be what love sounds like
in a house where no one says it out loud:
not a speech,
just a click,
and a bowl set down in front of you
before you knew you were hungry.`,
      note: T('開頭直接稱呼電鍋並用隱喻（白色的小月亮）；中段用聲音、氣味的意象和擬人；最後一段轉折，把「切換到保溫」連到家人不說出口的愛。', 'The poem addresses the cooker with a metaphor (a small white moon), builds sensory images and personification, and turns in the last stanza, linking the click from COOK to WARM to unspoken family love.'),
    },
    vocab: ['ode', 'imagery', 'personification', 'extended metaphor', 'line break', 'stanza', 'turn (volta)'],
  },
  {
    id: 'w10-speech',
    grade: 10,
    genre: 'opinion',
    std: 'CCSS SL.9-10.4 · W.9-10.1',
    title: T('演講稿：說服學生會或校務會議', 'Speech: persuade the student council or school board'),
    topics: [T('增加藝術課程的經費', 'more funding for the arts'), T('在校園建一座菜園', 'building a school garden'), T('增設飲水機與水瓶補水站', 'adding water-bottle refill stations'), T('延長圖書館的開放時間', 'longer library hours'), T('每學期安排一天心理健康日', 'one mental-health day per semester')],
    prompt: T('寫一篇三到四分鐘的演講稿，說服學生會或校務會議支持{t}。運用修辭技巧（重複、修辭問句、故事、數據），並記得演講是要「聽」的。', 'Write a three-to-four-minute speech persuading the student council or school board to support {t}. Use rhetorical techniques (repetition, rhetorical questions, a story, data), and remember that a speech is meant to be heard.'),
    plan: [
      { label: T('開場：抓住聽眾', 'Opening: grab the audience'), hint: T('一個故事、問題或驚人的事實。', 'A story, a question, or a surprising fact.') },
      { label: T('問題', 'The problem'), hint: T('現在缺少什麼？誰受到影響？', 'What is missing now? Who is affected?') },
      { label: T('解決方法與好處', 'Solution and benefits'), hint: T('具體提案 + 兩三個好處 + 證據。', 'A specific proposal + two or three benefits + evidence.') },
      { label: T('回應疑慮', 'Answer a concern'), hint: T('經費？時間？先說出來再回答。', 'Cost? Time? Name the worry, then answer it.') },
      { label: T('號召行動', 'Call to action'), hint: T('明確請聽眾做一件事，用有力的結尾句。', 'Ask the audience to do one clear thing; end with a memorable line.') },
    ],
    starters: ['Raise your hand if …', 'Imagine …', 'Here is the problem: …', 'What if …?', 'I know what some of you are thinking: …', 'Tonight, I am asking you to …'],
    words: [450, 700],
    checklist: [
      T('開場能立刻抓住聽眾的注意。', 'My opening grabs attention immediately.'),
      T('我提出具體、可行的提案。', 'I make a specific, realistic proposal.'),
      T('我用了至少兩種修辭技巧（重複、修辭問句、三重句…）。', 'I use at least two rhetorical techniques (repetition, rhetorical questions, tricolon…).'),
      T('我有數據或例子當證據。', 'I include data or examples as evidence.'),
      T('我回應了聽眾可能的疑慮。', 'I answer a concern the audience may have.'),
      T('句子適合朗讀：長短交錯，容易跟上。', 'My sentences are easy to follow aloud, mixing long and short.'),
      T('結尾有明確的行動呼籲。', 'I end with a clear call to action.'),
    ],
    mentor: {
      title: 'Keep the Door Open',
      text: `Good evening. Raise your hand if you have ever needed a quiet place to finish an assignment after 4 p.m. Now keep it up if you found one.

Most of you just lowered your hands. That is the problem I am here to talk about. Right now, our school library closes at 3:45, fifteen minutes after the final bell. For students with a quiet desk and fast internet at home, that is no problem. But for many of us, home means a shared bedroom, a younger brother's video games, or a phone plan that runs out of data by the twentieth of the month.

I am asking the board to keep the library open until 6 p.m., Monday through Thursday.

Here is why. First, it is fair. Every student is assigned the same homework, but not every student has the same place to do it. Second, it works. Last spring, the library stayed open late during exam week. Over those four days, more than three hundred students signed in after school. Three hundred. That is not a lack of interest. That is a line at the door.

Third, it costs less than you might think. The library already has heat, lights, and computers. What it needs is staff. Our librarian has offered to share evening shifts with two teachers and a rotating group of trained student volunteers, which would keep the added cost to roughly the price of one field trip per month.

I know what some of you are thinking: Will students actually use it, or will it become a place to hang out? Fair question. That is why the plan includes a sign-in sheet and a monthly report to this board. If students do not use it, you will know. But I am confident that the numbers will speak for themselves.

For some students, the library is just a room. For others, it is the only door to a quiet hour, a working computer, and a fair chance. Tonight, I am asking you to keep that door open. Vote yes, and let us prove that late hours mean better learning.

Thank you.`,
      note: T('開場讓聽眾舉手參與；提案明確；三個理由用 First／Second／Third 標示，並重複關鍵數字「三百」；先說出疑慮再回答；結尾回到「門」的意象並明確請大家投票。', 'The opening involves the audience, the proposal is specific, and three reasons are signposted (first, second, third) with a repeated key number. A concern is named and answered, and the ending returns to the "door" image with a clear call to vote.'),
    },
    vocab: ['imagine', 'here is why', 'first', 'second', 'I know what some of you are thinking', 'tonight, I am asking you'],
  },
  {
    id: 'w10-reflective',
    grade: 10,
    genre: 'personal',
    std: 'CCSS W.9-10.3',
    title: T('反思文：一段經驗教會我的事', 'Reflective essay: what an experience taught me'),
    topics: [T('一次讓你學到東西的失敗', 'a failure that taught you something'), T('一次你改變想法的經驗', 'a time you changed your mind'), T('一個花了好幾年才學會的技能', 'a skill that took years to learn'), T('一個塑造了你的地方', 'a place that shaped you'), T('一段你一直記得的對話', 'a conversation you still think about')],
    prompt: T('寫一篇反思文，主題是{t}。先生動地重現經驗，再深入思考：它為什麼重要？它如何改變了你看自己或世界的方式？', 'Write a reflective essay about {t}. First bring the experience to life, then reflect deeply: why did it matter, and how did it change the way you see yourself or the world?'),
    plan: [
      { label: T('場景', 'The scene'), hint: T('從經驗中最鮮明的一刻開始。', 'Start in the most vivid moment of the experience.') },
      { label: T('經過', 'What happened'), hint: T('只寫重要的細節，保持節奏。', 'Include only the details that matter; keep it moving.') },
      { label: T('當時的想法', 'What I thought then'), hint: T('誠實寫出當時的感受或誤解。', 'Be honest about what you felt or misunderstood.') },
      { label: T('現在的理解', 'What I understand now'), hint: T('反思：它教了我什麼？為什麼重要？', 'Reflect: what did it teach me, and why does it matter?') },
    ],
    starters: ['I still remember …', 'At the time, I believed …', 'What I did not understand yet was …', 'Looking back, …', 'Now, whenever I …', 'I used to think …; now I know …'],
    words: [450, 700],
    checklist: [
      T('開頭把讀者帶進一個具體的場景。', 'My opening places the reader in a specific scene.'),
      T('我用具體細節，而不是空泛的形容詞。', 'I use specific details instead of vague adjectives.'),
      T('我誠實寫出當時的想法，包括錯誤的想法。', 'I honestly show what I thought at the time, mistakes included.'),
      T('反思的部分至少和敘述一樣多。', 'My reflection is at least as developed as my story.'),
      T('我說明了這段經驗如何改變我。', 'I explain how the experience changed me.'),
      T('結尾給讀者一個值得思考的想法。', 'My ending leaves the reader with an idea worth thinking about.'),
    ],
    mentor: {
      title: 'The Red Pen',
      text: `I still remember the sound the paper made when Mr. Okoye set it on my desk: a soft slap, like a fish landing on a dock. At the top of my history essay, in red ink, was a C-minus. Below it he had written one sentence: "You have a lot to say. Say less of it."

I was furious. I had written six pages when the assignment asked for four. I had used every fact from the chapter, every date, every name. In my mind, more words meant more effort, and more effort deserved a better grade. That evening I complained to my older cousin, who was in college, expecting her to agree that my teacher was unfair. Instead, she read the first page, winced, and asked, "What is your argument?"

I did not have an answer. I had a pile of facts, but no point holding them together.

The next week I went to Mr. Okoye's office during lunch. I expected a lecture. Instead, he handed me a pair of scissors and a printed copy of my essay. "Cut every sentence that does not help you prove one idea," he said. By the end of lunch, my six pages had shrunk to two, and for the first time I could see what I actually thought: that the treaty we were studying had failed because no one involved trusted anyone else. I rewrote the essay around that idea. It was shorter, sharper, and, I realized with some embarrassment, much better.

At the time, I believed that writing well meant proving how much I knew. What I did not understand yet was that a reader does not want everything I know. A reader wants to know what I think, and why. Cutting felt like losing something at first. Now it feels like clearing away fog so the shape underneath can be seen.

I still write too much in my first drafts. But now, before I turn anything in, I imagine a pair of scissors on the desk beside me. The red pen did not tell me I had failed. It told me I had more to discover, if I was willing to throw things away.`,
      note: T('開頭用聲音細節帶進場景；誠實寫出當時的誤解（字越多越好）；轉折點是表姊的提問和剪刀；後半段有深入的反思，結尾留下有力的意象。', 'A sound detail opens the scene, the writer honestly admits a mistaken belief, the turning point comes through a question and a pair of scissors, and the second half reflects deeply before ending on a memorable image.'),
    },
    vocab: ['at the time', 'looking back', 'I realized', 'what I did not understand yet', 'now', 'ever since'],
  },
];

// ======================================================================= PROMPTS · GRADE 11
const p11 = [
  {
    id: 'w11-ap-argument',
    grade: 11,
    genre: 'argument',
    std: 'CCSS W.11-12.1 · AP Lang Argument',
    title: T('AP 論說文：表明立場並發展推理', 'AP argument essay: take a position and develop it'),
    topics: [T('便利是否讓生活變得更好', 'whether convenience makes life better'), T('失敗是否是成功的必要條件', 'whether failure is necessary for success'), T('競爭是否能促進學習', 'whether competition improves learning'), T('無聊是否有價值', 'whether boredom has value'), T('傳統在變動的社會中扮演什麼角色', 'the role tradition should play in a changing community')],
    prompt: T('針對「{t}」寫一篇 AP Lang 風格的論說文。提出可辯護的主張，用你閱讀、學習或觀察到的證據發展推理脈絡，並承認問題的複雜性。', 'Write an AP Lang-style argument on {t}. Make a defensible claim, develop a line of reasoning with evidence from your reading, studies, or observation, and acknowledge the complexity of the issue.'),
    plan: [
      { label: T('論點與推理脈絡', 'Thesis and line of reasoning'), hint: T('有條件的主張（when、only if、but）通常比絕對主張更有說服力。', 'A qualified claim (when, only if, but) is usually stronger than an absolute one.') },
      { label: T('推理一 + 證據', 'Reason 1 + evidence'), hint: T('具體例子：歷史、文學、科學、時事或個人觀察。', 'A specific example from history, literature, science, current events, or observation.') },
      { label: T('推理二 + 證據', 'Reason 2 + evidence'), hint: T('推理要「往前走」，不是重複第一段。', 'Build on reason 1 rather than repeating it.') },
      { label: T('複雜性', 'Complexity'), hint: T('在什麼情況下你的主張不成立？為什麼仍然站得住？', 'When does your claim not hold, and why does it still stand?') },
      { label: T('結論', 'Conclusion'), hint: T('說明更大的意義。', 'Show the broader significance.') },
    ],
    starters: ['Convenience promises …, yet …', 'Consider …', 'This example reveals …', 'Admittedly, …', 'The deeper problem is …', 'In the end, …'],
    words: [500, 800],
    checklist: [
      T('論點可辯護，而且有推理脈絡。', 'My thesis is defensible and sets up a line of reasoning.'),
      T('證據具體多元，不只是假設情境。', 'My evidence is specific and varied, not just hypothetical.'),
      T('每個證據後面都有評論，說明它如何支持主張。', 'Every piece of evidence is followed by commentary that links it to my claim.'),
      T('段落之間的推理有推進，不是並列。', 'My reasoning builds from paragraph to paragraph.'),
      T('我承認並處理了問題的複雜性。', 'I acknowledge and address complexity.'),
      T('句法多變（長短句、累積句、掉尾句）。', 'My syntax varies (long and short, cumulative and periodic).'),
      T('用字精確、語氣正式。', 'My diction is precise and my tone formal.'),
    ],
    mentor: {
      title: 'The Cost of Easy',
      text: `Every invention of the last century has promised to save us time. Washing machines freed afternoons once spent scrubbing; phones placed every song, map, and friend in a single pocket. Convenience is not the enemy of a good life. But when convenience removes not only drudgery but also effort that gives an activity its meaning, it makes life smaller rather than better.

Consider the difference between washing clothes by hand and navigating a city. Few people miss the washboard, because scrubbing shirts was labor with no reward beyond clean shirts. Finding one's way through an unfamiliar city, however, once required attention: noticing landmarks, asking strangers, making mistakes and correcting them. Today, a calm voice tells us when to turn, and many of us arrive without any sense of where we have been. The task is easier, but the experience of learning a place has quietly disappeared.

The same pattern appears in the way we learn. A student who can find any answer in seconds may complete an assignment faster than ever. Yet researchers who study memory have long observed that information we struggle to retrieve is information we keep. The difficulty is not a flaw in the process; it is the process. When convenience removes that struggle, it can leave us with the appearance of knowledge rather than the thing itself.

Admittedly, the line between meaningful effort and pointless drudgery is not fixed. For a person with a disability, a navigation app or a voice assistant may open up independence that effort alone could never provide. For an exhausted parent, a meal kit may create time for the conversation at dinner that actually matters. Convenience, in these cases, does not remove meaning; it makes room for it.

The question, then, is not whether to accept convenience but how to choose it. We should welcome tools that remove labor we would never miss, and protect the efforts that shape who we are: learning a skill, finding a path, cooking for someone we love. A life made entirely easy would not be a richer life. It would simply be one in which we had less and less to do with our own experience.`,
      note: T('論點有條件（便利移除「有意義的努力」時才有害）；兩個身體段用不同領域的例子推進推理；「Admittedly」段處理複雜性；結論提出如何選擇的原則。', 'A qualified thesis (convenience harms when it removes meaningful effort). Two body paragraphs use examples from different areas to build the reasoning, the "Admittedly" paragraph handles complexity, and the conclusion offers a principle for choosing.'),
    },
    vocab: ['admittedly', 'consider', 'yet', 'in these cases', 'the deeper problem', 'paradoxically', 'ultimately'],
  },
  {
    id: 'w11-rhetorical-analysis',
    grade: 11,
    genre: 'informative',
    std: 'CCSS RI.11-12.6 · AP Lang Rhetorical Analysis',
    title: T('AP 修辭分析', 'AP rhetorical analysis'),
    topics: [
      T('一位畢業典禮講者用接力賽比喻人生（內容：每個跑者都拿著別人傳來的棒子。）', 'this passage from a commencement speech: "Life is not a solo race. It is a relay. Every one of you is holding a baton that someone else carried before you—a parent who worked double shifts, a teacher who stayed late, a stranger who held a door. You will not be judged by how fast you ran. You will be judged by how well you passed it on."'),
      T('一位生物學家對漁業會議的發言（內容：海洋看似無限，其實很脆弱。）', 'this passage from a biologist\'s address to a fisheries conference: "We have treated the ocean as a bank account with no bottom. For a century, we withdrew and never checked the balance. Now the statements have arrived, and they are written in empty nets."'),
      T('一位作家談無聊的價值（內容：無聊是創意的等候室。）', 'this passage from an essay on boredom: "We have declared war on boredom, and we are winning. Every empty minute is now filled with a glowing screen. But boredom is not the enemy of creativity. It is its waiting room, and we have stopped letting anyone sit there."'),
      T('一位社區領袖呼籲保留老橋（內容：橋承載的不只是車，還有記憶。）', 'this passage from a community leader\'s letter: "That bridge has carried more than cars. It has carried first dates and funeral processions, the morning commute and the evening walk home. Before we tear it down, we should ask what else we will lose."'),
      T('一位老師在預算會議的發言（內容：小班制讓學生敢提問。）', 'this passage from a teacher\'s testimony at a budget hearing: "In a class of thirty-eight, the quiet student in the back row learns one lesson above all others: stay quiet. In a class of eighteen, that same student raises her hand. I have seen it happen every year for twenty years."'),
    ],
    prompt: T('閱讀{t}寫一篇 AP 修辭分析：在論點中說出講者的修辭選擇和目的，分析這些選擇在特定情境中如何影響特定聽眾。', 'Read {t} Write an AP rhetorical analysis. Your thesis should name the writer\'s rhetorical choices and purpose; your body should analyze how those choices work on this audience in this situation.'),
    plan: [
      { label: T('修辭情境', 'Rhetorical situation'), hint: T('講者、聽眾、場合、目的、時代背景（exigence）。', 'Speaker, audience, occasion, purpose, exigence.') },
      { label: T('論點', 'Thesis'), hint: T('選擇 + 目的；不要只寫 ethos、pathos、logos。', 'Choices + purpose; never just "ethos, pathos, and logos."') },
      { label: T('選擇一：證據 + 評論', 'Choice 1: evidence + commentary'), hint: T('引用 → 選擇 → 對聽眾的效果。', 'Quote → choice → effect on audience.') },
      { label: T('選擇二：證據 + 評論', 'Choice 2: evidence + commentary'), hint: T('依照文本順序或策略的推進。', 'Follow the text\'s order or the strategy\'s progression.') },
      { label: T('結論', 'Conclusion'), hint: T('這些選擇為什麼適合這個情境？', 'Why do these choices suit this situation?') },
    ],
    starters: ['Speaking to a crowd of graduates, …', 'By comparing …, the speaker reframes …', 'The image of … invites the audience to …', 'This shift from … to … signals …', 'Because the audience …, the speaker …', 'Ultimately, the speaker …'],
    words: [500, 800],
    checklist: [
      T('我說明了修辭情境（講者、聽眾、場合、目的）。', 'I explain the rhetorical situation.'),
      T('論點說出具體的修辭選擇和目的。', 'My thesis names specific choices and their purpose.'),
      T('我的推理依照文本或策略的順序推進。', 'My reasoning follows the text or strategy in a logical order.'),
      T('評論說明選擇對「這群聽眾」的效果。', 'My commentary explains the effect on this particular audience.'),
      T('我把短引文嵌入句子中。', 'I embed short quotations in my sentences.'),
      T('我用精確的修辭動詞（reframes、evokes、underscores）。', 'I use precise rhetorical verbs (reframes, evokes, underscores).'),
    ],
    mentor: {
      title: 'Passing the Baton',
      text: `Commencement speakers face a difficult audience: graduates who are proud, impatient, and certain they have heard every piece of advice before. In a speech built around the metaphor of a relay race, one speaker overcomes that resistance by reframing success itself. Moving from a familiar image of competition to a portrait of the people who made each graduate's achievement possible, the speaker persuades the audience to measure their future by what they give rather than what they win.

The speaker opens by rejecting the metaphor graduates expect. "Life is not a solo race," the speech begins, and then: "It is a relay." The short, blunt sentences correct an assumption many graduates hold on this particular day, when diplomas are handed out one name at a time and every achievement seems individual. By replacing the image of a lone runner with a team, the speaker quietly shifts the audience's attention from themselves to the people around them.

The speaker then fills the metaphor with recognizable people. The baton, the graduates are told, was carried by "a parent who worked double shifts, a teacher who stayed late, a stranger who held a door." The list moves from the most intimate figure to the most anonymous, widening the circle of gratitude with each item. Because the examples are specific yet universal, nearly every listener can supply a face for each one. The effect is to make the abstract idea of debt personal: the graduates are not simply told to be thankful; they are invited to remember particular people who ran before them.

Finally, the speaker turns the metaphor into a standard of judgment. "You will not be judged by how fast you ran," the passage concludes. "You will be judged by how well you passed it on." The antithesis between running fast and passing well overturns the competitive values that school often rewards, and the repetition of "you will be judged" lends the line the weight of a verdict. For an audience about to scatter toward colleges and careers, the closing redefines ambition as responsibility.

The relay metaphor succeeds because it meets the graduates where they are. It begins with the language of competition they know, honors the people they love, and ends by asking them to become, for someone else, the runner who holds out the baton.`,
      note: T('第一段交代修辭情境並提出「選擇＋目的」的論點；三個身體段依照演講順序分析三個選擇，每段都說明對畢業生的效果；結論說明比喻為什麼適合這群聽眾。', 'The introduction sets the rhetorical situation and a thesis of choices plus purpose. Three body paragraphs follow the speech in order, each explaining the effect on graduates, and the conclusion shows why the metaphor suits this audience.'),
    },
    vocab: ['reframes', 'underscores', 'evokes', 'juxtaposes', 'antithesis', 'exigence', 'audience', 'invites'],
  },
  {
    id: 'w11-synthesis',
    grade: 11,
    genre: 'argument',
    std: 'CCSS W.11-12.8 · AP Lang Synthesis',
    title: T('AP 綜合論說文', 'AP synthesis essay'),
    topics: [T('城市是否應該讓大眾運輸免費', 'whether cities should make public transit free'), T('高中是否應該取消傳統的等第成績', 'whether high schools should replace letter grades'), T('博物館是否應該歸還文物給原屬國家', 'whether museums should return artifacts to their countries of origin'), T('高中是否應該把個人理財列為必修', 'whether high schools should require a personal finance course'), T('城市是否應該禁止燃油吹葉機', 'whether towns should ban gas-powered leaf blowers')],
    prompt: T('針對「{t}」至少找四個不同觀點的來源（文章、數據、圖表、訪談），分別標為 Source A、B、C…。寫一篇綜合論說文，提出自己的主張，並引用至少三個來源，讓它們互相對話。', 'Gather at least four sources with different perspectives on {t} (articles, data, charts, interviews) and label them Source A, B, C… Write a synthesis essay that makes your own claim and draws on at least three sources, putting them in conversation.'),
    plan: [
      { label: T('論點', 'Thesis'), hint: T('你的主張，不是來源的主張。', 'Your claim, not a source\'s.') },
      { label: T('理由一：結合兩個來源', 'Reason 1: two sources together'), hint: T('它們如何互相印證？', 'How do they confirm each other?') },
      { label: T('理由二：來源 + 自己的推理', 'Reason 2: source + your reasoning'), hint: T('來源是證據，推理要是你的。', 'The source is evidence; the reasoning is yours.') },
      { label: T('處理反方來源', 'Address an opposing source'), hint: T('公平呈現，再回應。', 'Present it fairly, then respond.') },
      { label: T('結論', 'Conclusion'), hint: T('提出建議或更大的意義。', 'Offer a recommendation or broader significance.') },
    ],
    starters: ['While Source A shows …, Source C suggests …', 'Taken together, …', 'This evidence matters because …', 'Source D raises a legitimate concern: …', 'Even so, …', 'The city should therefore …'],
    words: [500, 800],
    checklist: [
      T('論點是我的主張，而且可以辯護。', 'My thesis is my own defensible claim.'),
      T('我引用了至少三個來源，並標示 (Source A) 等。', 'I cite at least three sources, labeled (Source A), etc.'),
      T('來源支持我的論點，而不是取代我的論點。', 'Sources support my argument rather than replace it.'),
      T('我讓來源互相對話（印證、補充、衝突）。', 'I put sources in conversation (confirming, extending, conflicting).'),
      T('我公平處理了至少一個反方來源。', 'I fairly address at least one opposing source.'),
      T('每個來源後面都有我的評論。', 'My commentary follows each source.'),
    ],
    mentor: {
      title: 'The Fare Is the Barrier',
      text: `When a city sets the price of a bus ride, it is also deciding who gets to move freely through its streets. Free public transit is sometimes dismissed as a utopian giveaway, but the evidence suggests otherwise. Cities should eliminate fares on buses and trains, because fares discourage the riders who need transit most while costing cities more to collect than critics assume.

The strongest case for free transit is about access. Low-income residents ride transit more than any other group, yet they are the most likely to skip trips because of cost (Source A). A survey of riders in one mid-sized city found that nearly a third had missed a medical appointment or job interview in the past year because they could not afford the fare (Source C). Taken together, these sources reveal that a fare is not a minor inconvenience; for many residents, it is the difference between reaching opportunity and staying home.

Fares are also less valuable to cities than they appear. Ticket machines, card systems, fare inspectors, and the delays caused by boarding passengers one by one all cost money. One transit agency found that fares covered only about twelve percent of its operating budget, and that a substantial share of that revenue was spent collecting it (Source B). If the true income from fares is that small, eliminating them would cost far less than the headline numbers suggest, and buses that board through every door would move faster for everyone.

Opponents raise a legitimate concern: without fares, buses may become crowded or attract riders who are not traveling anywhere at all (Source D). Crowding is a real challenge, but it is a sign of success that calls for more frequent service, not higher prices. And the experience of cities that have already dropped fares suggests that most new riders are people making exactly the trips transit exists for: commutes, school runs, and errands.

A city that charges for buses but not for sidewalks or streetlights has made a choice about which kinds of movement deserve public support. By removing the fare, cities would treat transit as what it already is for millions of people: essential infrastructure. The question is not whether a city can afford free transit, but whether it can afford to keep leaving people at the curb.`,
      note: T('論點是作者自己的主張；第一段結合 A 和 C 說明「可及性」，第二段用 B 加上自己的推理；反方段公平引用 D 再回應；每個來源後面都有評論。（此範文的來源是虛構的練習資料。）', 'The thesis is the writer\'s own claim. One paragraph combines Sources A and C, another pairs Source B with original reasoning, and Source D is addressed fairly before a response. Commentary follows every source. (The sources are invented practice material.)'),
    },
    vocab: ['taken together', 'while', 'this suggests', 'a legitimate concern', 'even so', 'therefore', 'synthesize'],
  },
  {
    id: 'w11-college-essay',
    grade: 11,
    genre: 'personal',
    std: 'CCSS W.11-12.3 · College application',
    title: T('大學申請文（個人陳述）', 'College application essay (personal statement)'),
    topics: [T('一個挑戰、挫折或失敗，以及你從中學到什麼', 'a challenge, setback, or failure and what you learned'), T('一次你質疑某個信念或想法的經驗', 'a time you questioned a belief or idea'), T('一件讓你忘記時間的事', 'something that makes you lose track of time'), T('一個你想解決的問題', 'a problem you would like to solve'), T('對你很重要的背景、身分或興趣', 'a background, identity, or interest central to who you are')],
    prompt: T('寫一篇大學申請的個人陳述，主題是{t}。用一個具體的故事展現你是誰、你怎麼思考，讓招生官讀完後覺得認識了一個真實的人。', 'Write a personal statement for a college application about {t}. Use a specific story to show who you are and how you think, so that an admissions reader finishes feeling they have met a real person.'),
    plan: [
      { label: T('開場的一刻', 'An opening moment'), hint: T('一個具體的畫面、聲音或對話，只有你寫得出來。', 'A specific image, sound, or line of dialogue only you could write.') },
      { label: T('背景與挑戰', 'Context and challenge'), hint: T('簡短交代，不要寫成履歷。', 'Brief context—this is not a résumé.') },
      { label: T('行動與思考', 'Actions and thinking'), hint: T('你做了什麼？你怎麼想？', 'What did you do, and how did you think?') },
      { label: T('反思與未來', 'Reflection and forward look'), hint: T('這件事說明了你是怎樣的人？你會帶著它去哪裡？', 'What does this reveal about you, and where will you take it?') },
    ],
    starters: ['The noodles were never the hard part.', 'I keep a list of …', 'Nobody tells you that …', 'That was the day I learned …', 'I still …', 'Now, when I …'],
    words: [400, 650],
    checklist: [
      T('開頭具體、有畫面，不是名言或字典定義。', 'My opening is specific and vivid—no famous quotes or dictionary definitions.'),
      T('故事的焦點小而具體。', 'My story is focused on a small, specific moment or thread.'),
      T('我「展示」自己的特質，而不是列出形容詞。', 'I show my qualities instead of listing adjectives.'),
      T('反思占了相當的篇幅，說明我怎麼思考。', 'Reflection takes up real space and shows how I think.'),
      T('聽起來像我自己的聲音，不像範本。', 'It sounds like my own voice, not a template.'),
      T('字數在限制內，每個字都有作用。', 'It fits the word limit, and every word earns its place.'),
    ],
    mentor: {
      title: 'Questions in the Steam',
      text: `The noodles were never the hard part. The hard part was the questions.

My family's restaurant seats twenty-two people, and on Friday nights all twenty-two seats are filled with customers who want to know things. Is the broth vegetarian? Why is the dumpling folded like that? What does the sign above the register say? When I started working there at thirteen, I answered with whatever my father had told me. By fifteen, I had started keeping a notebook in my apron pocket for the questions I could not answer.

The first page reads: "Why does the broth taste better on the second day?" The answer, I learned from a library book on food chemistry, involves gelatin and time. The second page asks why my grandmother insists on cutting scallions at an angle. (More surface area, more aroma, and, according to her, more respect.) By now the notebook has eighty-three pages. Some answers came from books, some from long conversations with my grandmother, and some I am still chasing.

At first, the notebook was a defense. I hated not knowing things in front of strangers, especially strangers who looked at me as if I were a small expert on an entire culture. But somewhere along the way, the questions stopped feeling like tests. They became invitations. A customer's question about the red paper on the door led me to an afternoon with my grandmother, learning the story of her village's new-year traditions for the first time. A question about why our soy sauce tastes different sent me into a month of reading about fermentation, which is how I discovered that I love microbiology.

I have learned that I am the kind of person who would rather say "I don't know yet" than pretend. I have also learned that the word "yet" is where most of my favorite things begin.

Next year, I hope to study food science, and I plan to bring the notebook with me. Page eighty-four is already waiting. It says: "What happens to flavor when you freeze it?" I don't know yet. But I know exactly how I'll find out.`,
      note: T('開頭一句話就製造好奇；用一個具體的物件（問題筆記本）貫穿全文；用細節展示好奇心，不直接說「我很好奇」；反思說明作者如何思考，結尾連到未來。', 'A one-line opening creates curiosity, and one concrete object (the question notebook) ties the essay together. Details show curiosity instead of claiming it, the reflection reveals how the writer thinks, and the ending looks forward.'),
    },
    vocab: ['at first', 'somewhere along the way', 'I have learned', 'yet', 'now', 'I still'],
  },
  {
    id: 'w11-op-ed',
    grade: 11,
    genre: 'opinion',
    std: 'CCSS W.11-12.1 · W.11-12.4',
    title: T('評論文章（投書）', 'Op-ed for a local newspaper'),
    topics: [T('社區是否需要更多公共運動場地', 'whether your community needs more public sports courts'), T('學校午餐是否應該更健康、更多元', 'whether school lunches should be healthier and more varied'), T('城市是否應該保留一棟老建築', 'whether your town should preserve an old building'), T('青少年是否應該參與地方政府的諮詢委員會', 'whether teenagers should sit on town advisory boards'), T('社區是否應該增設夜間照明的步道', 'whether your town should add lighted walking paths')],
    prompt: T('寫一篇投書給地方報紙，主張{t}。投書要短而有力：開頭立刻切入，用在地的例子，說話對象是一般讀者，結尾提出具體的行動。', 'Write an op-ed for a local newspaper arguing about {t}. Op-eds are short and punchy: get to the point fast, use local examples, write for general readers, and end with a specific action.'),
    plan: [
      { label: T('切入點（新聞鉤子）', 'News hook'), hint: T('為什麼是現在？最近發生了什麼？', 'Why now? What just happened?') },
      { label: T('主張', 'Claim'), hint: T('一兩句話清楚說出立場。', 'State your position in one or two sentences.') },
      { label: T('在地證據', 'Local evidence'), hint: T('具體的地點、數字、人物。', 'Specific places, numbers, people.') },
      { label: T('反駁', 'Rebuttal'), hint: T('簡短回應最常見的反對意見。', 'Briefly answer the most common objection.') },
      { label: T('行動', 'Call to action'), hint: T('讀者或市議會應該做什麼？', 'What should readers or officials do?') },
    ],
    starters: ['Last Tuesday, the council …', 'Here is what they should do instead: …', 'Walk past … on any weekday and you will see …', 'Critics say … They are half right.', 'On March 3, the council will vote on …'],
    words: [500, 800],
    checklist: [
      T('第一段就有新聞鉤子和主張。', 'My first paragraph has a news hook and my claim.'),
      T('我用具體的在地例子和數據。', 'I use specific local examples and numbers.'),
      T('段落短，句子清楚，適合一般讀者。', 'My paragraphs are short and my sentences clear for general readers.'),
      T('我簡短而公平地回應反對意見。', 'I answer an objection briefly and fairly.'),
      T('語氣有個性，但尊重對方。', 'My voice has personality but stays respectful.'),
      T('結尾有具體的行動呼籲。', 'I end with a specific call to action.'),
    ],
    mentor: {
      title: 'Give the Old Post Office a Second Life',
      text: `Last Tuesday, the town council voted to begin taking bids for the demolition of the old post office on Main Street. Before the bulldozers arrive, the council should reconsider. The building is not a relic to be cleared away; it is the most promising space in town for a public workshop and community center.

Walk past the post office on any weekday and you will see what makes it valuable. Its tall windows fill the main hall with light. Its brick walls have survived a century of winters. Its location, two blocks from the high school and one block from the bus stop, makes it reachable for nearly everyone. A new building with those qualities would cost millions. We already own this one.

Other towns have shown what is possible. Across the region, old banks, train stations, and factories have been turned into maker spaces, libraries, and art studios. These projects do not only preserve history; they bring people downtown on weekday evenings, when Main Street is now mostly dark.

Critics say renovation is too expensive and that the building's heating and wiring are outdated. They are half right. The systems do need work. But a structural report commissioned by the town itself in 2019 found the foundation and walls in good condition. Replacing old wiring is a manageable cost; replacing a century-old brick landmark is impossible.

There is also a cost we rarely count. Every time a town tears down a building that people remember, it loses a piece of the story residents tell about themselves. Grandparents who mailed letters to soldiers overseas, children who bought their first stamps there, families who waited in line every December: those memories are part of what makes this town feel like home.

The council will hold a public hearing on March 3. Residents who want a workshop, a teen center, or simply a reason to walk downtown after dark should attend and say so. The old post office has delivered for this town for a hundred years. It deserves the chance to deliver something new.`,
      note: T('第一段就有新聞鉤子（市議會投票）和主張；在地細節（窗戶、位置、2019 年報告）讓論證具體；「They are half right」簡短讓步再反駁；結尾給出日期和具體行動，並用一句雙關收尾。', 'The first paragraph delivers the news hook and the claim. Local details make the case concrete, "They are half right" concedes briefly before rebutting, and the ending gives a date, a clear action, and a final play on words.'),
    },
    vocab: ['before', 'instead', 'they are half right', 'there is also', 'consider', 'residents should'],
  },
  {
    id: 'w11-literary-analysis',
    grade: 11,
    genre: 'literary',
    std: 'CCSS RL.11-12.3 · W.11-12.9a',
    title: T('文學分析：角色、選擇與主題', 'Literary analysis: character, choice, and theme'),
    topics: [T('一個角色在關鍵時刻的選擇', "a character's choice at a crucial moment"), T('一部作品中「名聲」與「真實」的衝突', 'the conflict between reputation and truth in a work'), T('一個次要角色的重要性', 'the importance of a minor character'), T('作品的結局如何改變我們對開頭的理解', "how a work's ending changes our understanding of its beginning"), T('一個反覆出現的意象或母題', 'a recurring image or motif')],
    prompt: T('選一部你讀過的長篇作品（小說或劇本），分析{t}，並說明它如何發展作品的主題。論點要有詮釋性，證據要來自文本的不同部分。', 'Choose a full-length work (novel or play) you have read and analyze {t}, explaining how it develops a theme of the work. Your thesis should be interpretive, and your evidence should come from different parts of the text.'),
    plan: [
      { label: T('論點', 'Thesis'), hint: T('技巧／選擇 + 複雜的意義。', 'Choice or technique + a complex meaning.') },
      { label: T('早期的證據', 'Early evidence'), hint: T('建立角色或母題的起點。', 'Establish the starting point.') },
      { label: T('轉折的證據', 'Turning-point evidence'), hint: T('分析最關鍵的場景。', 'Analyze the key scene.') },
      { label: T('結論：主題', 'Conclusion: theme'), hint: T('作品對人性提出了什麼看法？', 'What does the work suggest about people?') },
    ],
    starters: ['In The Crucible, Arthur Miller …', 'At first, … seems …', 'This moment reveals …', 'When … finally …, …', 'Miller suggests that …', 'The play ultimately asks …'],
    words: [500, 800],
    checklist: [
      T('論點是複雜、可辯護的詮釋。', 'My thesis is a complex, defensible interpretation.'),
      T('證據來自作品的不同部分。', 'My evidence comes from different parts of the work.'),
      T('分析比引文多，說明技巧如何產生意義。', 'My analysis outweighs quotations and explains how choices create meaning.'),
      T('我用文學現在式。', 'I use the literary present.'),
      T('我把主題寫成完整的想法，而不是一個字（如「勇氣」）。', 'I state the theme as a full idea, not a single word like "courage."'),
      T('我避免情節摘要。', 'I avoid plot summary.'),
    ],
    mentor: {
      title: 'A Name Worth Keeping',
      text: `Arthur Miller's The Crucible is set during the Salem witch trials, when confessing to a lie could save a person's life. Its hero, John Proctor, spends most of the play guarding his reputation, hiding his affair with Abigail Williams even as her accusations spread through the town. Yet in the final act, Proctor refuses to sign a false confession that would save him. Through Proctor's shifting understanding of his "name," Miller suggests that true integrity depends not on what others think of us but on refusing to lie about who we are.

Early in the play, Proctor's concern for his name is a form of pride. He keeps his affair secret because exposure would ruin his standing in Salem, and his silence allows Abigail's accusations to grow. When he finally confesses the affair in court, hoping to discredit her, the confession costs him dearly, and his wife, trying to protect him, denies it. The scene shows how deeply reputation shapes behavior in Salem: even the honest act of confession is twisted by people trying to protect one another's good names.

The climax reverses this pattern. Imprisoned and facing execution, Proctor agrees to confess to witchcraft and signs the paper. But when the judges demand to post his signed confession on the church door, he tears it up. Asked why, he cries out, "Because it is my name! Because I cannot have another in my life!" In this moment, "name" no longer means reputation. It means identity, the self he must live and die with. A public lie would protect his reputation but destroy the person he is trying to become.

Miller's choice to end the play with Proctor walking to the gallows forces the audience to weigh survival against truth. Elizabeth's final line, that he has "his goodness now," suggests that Proctor has gained something the court cannot take away. The play, written during a period of political accusations in 1950s America, asks readers to consider what they would sign to save themselves. Miller's answer is uncomfortable but clear: a name is worth keeping only if it belongs to someone who has not lied to keep it.`,
      note: T('論點追蹤一個關鍵字（name）的意義改變；證據來自劇本的前段和結局；分析說明「名聲」如何轉為「身分」；結論把主題寫成完整的想法，並連到作品的歷史背景。', 'The thesis traces how one key word ("name") changes meaning. Evidence comes from early and final scenes, the analysis shows reputation becoming identity, and the conclusion states the theme as a full idea linked to the play\'s historical context.'),
    },
    vocab: ['initially', 'reverses', 'in this moment', 'suggests', 'reveals', 'ultimately', 'theme'],
  },
  {
    id: 'w11-narrative',
    grade: 11,
    genre: 'narrative',
    std: 'CCSS W.11-12.3',
    title: T('短篇小說：觀點與結構', 'Short fiction: point of view and structure'),
    topics: [T('由一個不太可靠的敘事者說的故事', 'a story told by a not-quite-reliable narrator'), T('用倒敘或打亂時間順序的故事', 'a story told out of chronological order'), T('只發生在一個小時內的故事', 'a story that takes place within a single hour'), T('從一個物件的角度說的故事', 'a story told from the point of view of an object'), T('以一封信或訊息構成的故事', 'a story told through letters or messages')],
    prompt: T('寫一篇短篇小說：{t}。刻意選擇觀點和結構，讓它們幫助讀者理解故事的意義。', 'Write a short story: {t}. Make deliberate choices about point of view and structure so that they help readers understand what the story means.'),
    plan: [
      { label: T('觀點與聲音', 'Point of view and voice'), hint: T('誰在說？他知道什麼、不知道什麼？', 'Who tells it, and what do they know or not know?') },
      { label: T('結構', 'Structure'), hint: T('時間順序？倒敘？片段？為什麼？', 'Chronological, flashback, fragments—and why?') },
      { label: T('衝突與轉折', 'Conflict and turn'), hint: T('讀者何時發現真相？', 'When does the reader discover the truth?') },
      { label: T('結局', 'Ending'), hint: T('留下餘韻，不要解釋太多。', 'Resonate rather than over-explain.') },
    ],
    starters: ['Everyone agrees I was the best …', 'It is 4:12 in the afternoon.', 'The last thing she said to me was …', 'I have hung on this wall for …', 'Dear …,'],
    words: [500, 800],
    checklist: [
      T('觀點和結構是刻意選擇的，並且有作用。', 'My point of view and structure are deliberate and purposeful.'),
      T('敘事聲音一致而且有個性。', 'My narrative voice is consistent and distinctive.'),
      T('我用細節讓讀者自己推論，而不是直接說明。', 'I let details lead readers to infer instead of explaining.'),
      T('對話自然，並正確使用標點。', 'My dialogue sounds natural and is punctuated correctly.'),
      T('故事有清楚的轉折或發現。', 'My story has a clear turn or discovery.'),
      T('結局有餘韻。', 'My ending resonates.'),
    ],
    mentor: {
      title: 'Best Neighbor on Linden Street',
      text: `Everyone on Linden Street agrees that I am the best neighbor they have ever had. They have not said so directly, but I can tell.

Take Mrs. Alvarez at number twelve. Every Saturday, I help her by trimming the hedge between our yards, even the parts on her side, because her technique is frankly unsupervised. Last week she came out in her bathrobe and stood there watching me with her arms crossed, which is how she shows gratitude. Then she went inside and closed the curtains, probably so she would not distract me.

Or take the Patel twins, who are nine. I have been teaching them about property lines. When their soccer ball rolled into my tulips, I kept it safe in my garage for two weeks so they could reflect on the importance of boundaries. When I finally returned it, their father thanked me in a very quiet voice, the kind people use when they are overwhelmed.

I also run the Linden Street newsletter, which I deliver by hand. It contains helpful reminders about trash-can placement, noise, and the correct height for grass, which is two and a half inches, not three, whatever certain people at number eight believe. Nobody writes back, which tells me the newsletter is thorough.

Yesterday, there was a block party. I found out about it because I saw the folding tables from my kitchen window: long white tables in the Patels' driveway, with bowls of rice and plates of grilled corn and a speaker playing music at a volume I would describe as negotiable. Everyone was there. Mrs. Alvarez was laughing with the man from number eight. The twins were chasing a new ball across three lawns.

I assumed my invitation had been lost in the mail, so I printed a copy of the newsletter and walked over. When I arrived, the music did not stop, exactly, but it became more thoughtful. Mrs. Alvarez handed me a paper plate. "We didn't think you'd want to come," she said. "You always seem so busy."

It was kind of her to notice. I am busy. Being the best neighbor on Linden Street takes a great deal of time.

Still, I stayed for a plate of corn. And when the twins' new ball rolled toward my feet, I surprised everyone, including myself, by kicking it back.`,
      note: T('第一人稱的不可靠敘事者：他說的話和讀者看到的事實（關窗簾、小聲道謝、沒人回信）之間的落差製造反諷；結尾一個小動作（把球踢回去）暗示改變，不需要解釋。', 'An unreliable first-person narrator: the gap between what he claims and what readers can see (closed curtains, quiet thanks, no replies) creates irony. A small final action—kicking the ball back—hints at change without explaining it.'),
    },
    vocab: ['frankly', 'apparently', 'I assumed', 'still', 'for a moment', 'somehow'],
  },
  {
    id: 'w11-poetry-analysis',
    grade: 11,
    genre: 'literary',
    std: 'CCSS RL.11-12.4 · AP Lit Poetry',
    title: T('詩歌分析', 'Poetry analysis'),
    topics: [T('艾蜜莉．狄金生的詩如何描寫「希望」', 'how an Emily Dickinson poem portrays hope'), T('一首詩如何用延伸隱喻', 'how a poem uses an extended metaphor'), T('一首詩的形式（分行、韻律、詩節）如何影響意義', "how a poem's form (lines, rhythm, stanzas) shapes its meaning"), T('一首詩中語氣的轉變', 'a shift in tone within a poem'), T('一首詩如何描寫自然與人的關係', 'how a poem portrays the relationship between people and nature')],
    prompt: T('選一首課堂上讀過的詩，分析{t}。說明詩人的技巧（意象、隱喻、聲音、結構、轉折）如何共同建構詩的意義。', 'Choose a poem you have studied and analyze {t}. Explain how the poet\'s choices—imagery, metaphor, sound, structure, the turn—work together to create meaning.'),
    plan: [
      { label: T('論點', 'Thesis'), hint: T('技巧 + 複雜的意義。', 'Techniques + a complex meaning.') },
      { label: T('第一部分：建立', 'Part 1: how the poem begins'), hint: T('引用詩句，分析意象和用字。', 'Quote lines; analyze images and diction.') },
      { label: T('第二部分：發展或轉折', 'Part 2: development or turn'), hint: T('詩的意義如何變化或加深？', 'How does the meaning shift or deepen?') },
      { label: T('結論', 'Conclusion'), hint: T('這首詩最後讓我們看到什麼？', 'What does the poem finally let us see?') },
    ],
    starters: ['In "…," Dickinson …', 'The opening metaphor …', 'The dash after … forces the reader to …', 'In the second stanza, …', 'The final lines …', 'By the end, the poem suggests …'],
    words: [500, 800],
    checklist: [
      T('論點說出技巧和詩的複雜意義。', 'My thesis names techniques and a complex meaning.'),
      T('我引用詩句時用斜線（/）標示分行。', 'I mark line breaks in quotations with a slash (/).'),
      T('我分析用字、聲音和形式，而不只是內容。', 'I analyze diction, sound, and form, not just content.'),
      T('我依照詩的進展來組織分析。', 'I organize my analysis around the poem\'s progression.'),
      T('我說明了詩的轉折。', 'I explain the poem\'s turn or shift.'),
      T('我用文學現在式。', 'I use the literary present.'),
    ],
    mentor: {
      title: 'The Bird That Asks for Nothing',
      text: `Emily Dickinson's "'Hope' is the thing with feathers" begins with a definition that seems almost childlike: hope is a bird. Over three short stanzas, however, Dickinson develops this metaphor into a quiet argument. Through the image of a small bird that sings through storms yet never asks to be fed, the poem portrays hope as a force that is fragile in appearance but nearly unbreakable, and that gives far more than it takes.

The first stanza establishes the metaphor through gentle, physical detail. Hope "perches in the soul," a verb that suggests something light and temporary, as if it could fly away at any moment. Yet the bird "sings the tune without the words - / And never stops - at all -." The song without words implies that hope does not need reasons or arguments; it exists beneath language. Dickinson's dashes slow the final line, forcing the reader to pause on "never" and "at all," so that the bird's persistence is felt as much as stated.

The second stanza tests the metaphor against hardship. The bird's song is "sweetest - in the Gale," and "sore must be the storm" that could "abash the little Bird / That kept so many warm." Here the poem's logic turns: the bird is most valuable precisely when conditions are worst. The word "little" emphasizes its smallness, which makes its endurance more surprising. The image of a bird that keeps "so many warm" also expands hope from a private feeling into something shared, a warmth that spreads beyond one person.

The final stanza widens the setting to "the chillest land" and "the strangest Sea," places of isolation and uncertainty. Then comes the poem's most striking claim: "Yet - never - in Extremity, / It asked a crumb - of me." The dashes isolate "never" again, echoing the first stanza. A real bird would need food to survive; Dickinson's bird asks for nothing. Hope, the poem suggests, is not something we must earn or maintain. It sustains us without demanding payment.

By the end, the simple opening definition has become something more complex. Dickinson's hope is small, wordless, and easily overlooked, yet it endures the worst storms and asks nothing in return. The poem's quiet form, with its short lines and hesitant dashes, mirrors its subject: modest on the surface, but persistent all the way to the final line.`,
      note: T('論點同時說出技巧（隱喻、破折號）和意義；分析依照三個詩節的進展；引用詩句時用斜線標示分行，並分析標點和用字的效果；結論把形式和內容連在一起。', 'The thesis names both techniques and meaning. The analysis follows the poem stanza by stanza, marks line breaks with slashes, examines punctuation and diction, and the conclusion connects form to content.'),
    },
    vocab: ['metaphor', 'stanza', 'diction', 'the dash', 'enjambment', 'tone', 'the turn', 'mirrors'],
  },
  {
    id: 'w11-research',
    grade: 11,
    genre: 'research',
    std: 'CCSS W.11-12.7 · W.11-12.8',
    title: T('研究報告：探討一個爭議問題', 'Research paper: investigate a debated question'),
    topics: [T('四天上課制對學生的影響', 'the effects of a four-day school week'), T('電子書與紙本書對閱讀理解的影響', 'how reading on screens compares with reading on paper'), T('城市綠地與心理健康', 'urban green space and mental health'), T('青少年打工的利與弊', 'the benefits and costs of teenage part-time jobs'), T('人工智慧在醫學診斷中的角色', 'the role of artificial intelligence in medical diagnosis')],
    prompt: T('針對{t}提出研究問題，使用至少五個可信的來源（包含至少一個學術研究），寫一篇有 MLA 或 APA 引用格式的研究報告。說明不同研究之間的共識與分歧，並提出有根據、適度限定的結論。', 'Develop a research question about {t}. Use at least five credible sources, including at least one academic study, and write a research paper with MLA or APA citations. Explain where studies agree and disagree, and reach a well-supported, appropriately qualified conclusion.'),
    plan: [
      { label: T('研究問題與論點', 'Question and thesis'), hint: T('論點要適度限定（suggests、in many cases）。', 'Qualify the thesis (suggests, in many cases).') },
      { label: T('背景與定義', 'Background and definitions'), hint: T('為什麼這個問題重要？', 'Why does the question matter?') },
      { label: T('研究的共識', 'Where research agrees'), hint: T('綜合多個來源。', 'Synthesize several sources.') },
      { label: T('研究的分歧或限制', 'Where research disagrees or is limited'), hint: T('樣本、方法、資助者、時間。', 'Sample, method, funding, date.') },
      { label: T('結論', 'Conclusion'), hint: T('有根據的答案 + 需要進一步研究的問題。', 'A supported answer + questions for further research.') },
    ],
    starters: ['Over the past decade, …', 'Most studies agree that …', 'However, these findings come with limits: …', 'One explanation for this disagreement is …', 'The evidence therefore suggests …', 'Future research should …'],
    words: [500, 800],
    checklist: [
      T('研究問題夠具體，論點有適度限定。', 'My question is focused and my thesis appropriately qualified.'),
      T('我用了至少五個可信的來源。', 'I use at least five credible sources.'),
      T('我說明研究的共識與分歧，而不是逐一摘要。', 'I explain agreement and disagreement instead of summarizing one by one.'),
      T('我評估了研究的限制（樣本、方法、資助者）。', 'I evaluate limits in the research (sample, method, funding).'),
      T('引用格式一致（MLA 或 APA）。', 'My citation style is consistent (MLA or APA).'),
      T('語氣客觀、正式。', 'My tone is objective and formal.'),
    ],
    mentor: {
      title: 'Screens and Pages: Does the Medium Change What We Understand?',
      text: `Students today read more on screens than on paper, often by necessity rather than choice. As schools replace printed textbooks with digital ones, an important question arises: do readers understand and remember a text as well on a screen as they do on paper? Current research suggests that, for long or complex informational texts, paper still holds a modest advantage, though the gap depends heavily on how readers approach the screen.

Most studies agree on one central finding. When readers face longer informational texts, they tend to score somewhat lower on comprehension tests after reading on a screen than after reading the same text on paper (Mensah 41; Castillo 12). The difference is usually small, but it appears consistently across several countries and age groups. Researchers have proposed that screens encourage quick, skimming habits formed through social media and web browsing, which readers then carry into texts that demand slower attention (Brennan 88).

However, these findings come with important limits. The advantage of paper largely disappears for short texts and for narrative fiction, where comprehension levels are similar in both formats (Castillo 15). In addition, many studies tested readers under time pressure, a condition that may intensify skimming. When readers were given unlimited time, the gap narrowed (Iyer 203). This suggests that the medium itself may matter less than the reading habits it tends to invite.

There is also evidence that those habits can change. In one classroom study, students who were taught to slow down, annotate digitally, and summarize each section performed as well on screens as their peers did on paper (Petrov 67). If skimming is a learned behavior, then it may also be unlearned.

Taken together, the research does not show that screens make readers worse. Instead, it suggests that screens make it easier to read poorly. For schools moving to digital textbooks, the lesson is not to abandon screens but to teach students how to read deeply on them. Further research should follow students over several years to see whether deliberate digital reading strategies produce lasting results.`,
      note: T('論點適度限定（modest advantage、depends on）；一段說共識、一段說限制、一段說可能的解方，來源互相對話；結論回答研究問題並指出未來研究方向。（此範文的來源是虛構的。）', 'A qualified thesis ("modest advantage," "depends on"). Separate paragraphs cover agreement, limits, and a possible solution, with sources in conversation, and the conclusion answers the question and suggests future research. (The sources are invented.)'),
    },
    vocab: ['most studies agree', 'however', 'these findings come with limits', 'this suggests', 'taken together', 'further research'],
  },
];

// ======================================================================= PROMPTS · GRADE 12
const p12 = [
  {
    id: 'w12-college-essay',
    grade: 12,
    genre: 'personal',
    std: 'CCSS W.11-12.3 · College application',
    title: T('大學申請文（定稿）', 'College application essay (final draft)'),
    topics: [T('一件你花了很多時間、別人看不見的事', 'something you have spent hours on that others never see'), T('一個改變了你看法的人', 'a person who changed how you see something'), T('一個你所屬的社群', 'a community you belong to'), T('一個你仍在尋找答案的問題', 'a question you are still trying to answer'), T('一次你必須在兩件重要的事之間做選擇', 'a time you had to choose between two things that mattered')],
    prompt: T('寫一篇大學申請的個人陳述，主題是{t}。選一個小而具體的焦點，用場景和細節展示你的思考方式和價值，最後說明這些特質會如何跟著你進入大學。', 'Write a college personal statement about {t}. Choose a small, specific focus; use scenes and details to show how you think and what you value; and suggest how those qualities will travel with you to college.'),
    plan: [
      { label: T('開場場景', 'Opening scene'), hint: T('從一個動作或畫面中間開始。', 'Begin in the middle of an action or image.') },
      { label: T('故事的線', 'The thread'), hint: T('一個物件、習慣或問題把全文串起來。', 'An object, habit, or question that ties it together.') },
      { label: T('深入一層', 'Go one layer deeper'), hint: T('這件事其實關於什麼？', 'What is this really about?') },
      { label: T('連到未來', 'Connect to the future'), hint: T('自然地帶到大學，不要寫成廣告。', 'Point toward college naturally—no sales pitch.') },
    ],
    starters: ['At 5:40 every morning, …', 'Nobody notices …', 'I used to think …', 'The first time I …', 'What I love about … is …', 'I am still …'],
    words: [400, 650],
    checklist: [
      T('焦點小而具體，不是人生總覽。', 'My focus is small and specific, not a life summary.'),
      T('開場有畫面，直接進入故事。', 'My opening is vivid and drops straight into the story.'),
      T('我展示思考和價值，而不是列出成就。', 'I show my thinking and values rather than listing achievements.'),
      T('細節只有我寫得出來。', 'My details are ones only I could write.'),
      T('反思真誠，不自誇也不說教。', 'My reflection is honest, neither boastful nor preachy.'),
      T('結尾自然地指向未來。', 'My ending points to the future naturally.'),
      T('沒有錯字，字數在限制內。', 'It is error-free and within the word limit.'),
    ],
    mentor: {
      title: 'Translating the Pharmacist',
      text: `Every Saturday at ten, Mrs. Lin is waiting for me on the bench outside the pharmacy, her pill bottles lined up in a plastic bag like small soldiers.

She is seventy-eight, and she speaks Mandarin, Taiwanese, and enough English to buy groceries but not enough to understand a label that says "Take with food. Do not exceed two doses in 24 hours." Two years ago, my mother volunteered me to help her for "just one afternoon." I have been going ever since.

At first, translating seemed simple. The pharmacist spoke; I repeated it in Mandarin. But Mrs. Lin taps each word on the label with her fingernail until she is sure, and she asks questions the pharmacist never expects. Why with food? What happens if I forget? Is this the same as the pink pill from last year? I learned quickly that translating words is not the same as translating meaning. "Do not exceed" has a direct Mandarin equivalent, but it does not carry the warning she needs. So I started explaining the reasons behind the instructions: the stomach, the liver, the way two medicines can argue with each other inside the body.

To do that, I had to understand the reasons myself. I began reading the folded inserts inside every box, then medical websites, then a used pharmacology textbook I found for four dollars. I made Mrs. Lin a chart with her medicines, the times of day, and small drawings of a bowl of rice next to the ones she should take with food. She keeps it taped inside her kitchen cabinet. Last month, her doctor saw a copy and asked if he could share the format with other patients.

What I love about these Saturdays is not that I am helpful, though I hope I am. It is the moment when an instruction stops being a string of words and becomes something a person can trust. I have come to believe that much of medicine happens in that space between what a professional says and what a patient understands.

In college, I want to study public health and learn how to make that space smaller for more people than one patient on one bench. But I suspect I will still be translating on Saturdays. Mrs. Lin has a new prescription, and she already has questions.`,
      note: T('焦點很小（每週六幫一位老太太翻譯藥單），用具體細節（用指甲敲字、畫碗飯的表格）展示特質；反思說明作者的核心想法；結尾自然地連到大學志向。', 'A small focus (Saturdays translating for one neighbor) and concrete details (tapping each word, the rice-bowl chart) show the writer\'s qualities. The reflection states a core belief, and the ending links naturally to college plans.'),
    },
    vocab: ['at first', 'I learned quickly', 'what I love about', 'I have come to believe', 'I suspect', 'still'],
  },
  {
    id: 'w12-ap-lit-prose',
    grade: 12,
    genre: 'literary',
    std: 'CCSS RL.11-12.5 · AP Lit Prose Analysis',
    title: T('AP 文學：散文段落分析', 'AP Lit: prose passage analysis'),
    topics: [T('一段描寫離家前一晚的文字', 'a passage about the night before someone leaves home'), T('一段描寫兩代之間誤解的文字', 'a passage about a misunderstanding between generations'), T('一段描寫陌生城市的文字', 'a passage describing an unfamiliar city'), T('一段描寫工作場所的文字', 'a passage set in a workplace'), T('一段以回憶為主的文字', 'a passage built around a memory')],
    prompt: T('從你的課本或小說中選{t}（約 300–500 字）。寫一篇 AP 文學風格的分析：說明作者如何運用文學技巧（如意象、觀點、結構、象徵、句法）來描寫角色之間複雜的關係或情感。', 'Choose {t} (about 300–500 words) from a novel or anthology you have read. Write an AP Lit-style analysis explaining how the author uses literary techniques—such as imagery, point of view, structure, symbol, and syntax—to convey a complex relationship or emotion.'),
    plan: [
      { label: T('論點', 'Thesis'), hint: T('技巧 + 複雜的意義（情感的矛盾、轉變）。', 'Techniques + a complex meaning (tension or change in feeling).') },
      { label: T('技巧一 + 證據', 'Technique 1 + evidence'), hint: T('引用短句並仔細分析用字。', 'Quote short phrases and analyze word choice closely.') },
      { label: T('技巧二 + 證據', 'Technique 2 + evidence'), hint: T('結構或觀點如何加深意義？', 'How do structure or point of view deepen the meaning?') },
      { label: T('結論：複雜性', 'Conclusion: complexity'), hint: T('這段文字最後呈現的情感為什麼不簡單？', 'Why is the final feeling not simple?') },
    ],
    starters: ['In the passage, the author …', 'The image of … suggests …', 'The shift from … to … mirrors …', 'By withholding …, the narrator …', 'The long, winding sentence …', 'The passage ultimately reveals …'],
    words: [500, 850],
    checklist: [
      T('論點提出複雜、可辯護的詮釋。', 'My thesis offers a complex, defensible interpretation.'),
      T('我分析具體的字詞和句子，而不只是情節。', 'I analyze specific words and sentences, not just events.'),
      T('每個證據後面都有說明「如何」和「為什麼」的評論。', 'Every piece of evidence has commentary on how and why.'),
      T('我討論至少一個句法或結構上的選擇。', 'I discuss at least one choice of syntax or structure.'),
      T('我說明了情感或關係的複雜性（矛盾、轉變）。', 'I explain the complexity—tension or change—in the relationship or emotion.'),
      T('我用文學現在式並把引文嵌入句子。', 'I use the literary present and embed my quotations.'),
    ],
    mentor: {
      title: 'Dough Stretched Thin',
      text: `[Model analysis of an original passage. In the passage, a grandmother teaches her granddaughter, Lan, to fold dumplings on the night before Lan leaves for college. The grandmother corrects her again and again, saying, "Thinner. Thinner. It must be thin enough to see the light, but it must not tear." Lan notices the flour in the creases of her grandmother's knuckles. Near the end, the grandmother sets the finished dumplings in rows "like boats waiting for a tide," and Lan realizes she has never seen her grandmother cry.]

On the surface, the passage is a cooking lesson. Beneath it lies a goodbye that neither character can say aloud. Through the extended image of dough stretched thin but never torn, and through a restrained point of view that notices gestures rather than feelings, the author portrays a love that expresses itself as instruction, a love that must let Lan go even as it tries to hold her.

The grandmother's repeated command, "Thinner. Thinner," at first seems purely practical. Yet her full instruction, that the dough must be "thin enough to see the light" but must "not tear," describes the relationship as precisely as the recipe. The grandmother is preparing Lan to become independent, to be stretched by a new life far from home, while hoping the bond between them will hold. The repetition of "thinner" also carries a quiet urgency, as if the grandmother is trying to teach a lifetime of skill in a single evening.

The point of view deepens this tension. The narration stays close to Lan, but it rarely names emotions. Instead, Lan notices "the flour in the creases" of her grandmother's knuckles, a detail that suggests both age and decades of labor offered in the form of food. By describing hands rather than faces, the author mirrors the family's own way of communicating: affection is shown through work, not spoken. Readers sense the grief in the kitchen precisely because no one names it.

The passage closes with an image that turns the lesson toward departure. The finished dumplings sit in rows "like boats waiting for a tide," a simile that quietly anticipates Lan's journey. Boats are made to leave the shore. The grandmother has spent the evening building them, and in doing so she has accepted that Lan, too, will leave. Lan's final realization, that she has never seen her grandmother cry, completes the portrait: this restraint is not coldness but a form of strength.

Ultimately, the passage reveals that love in this family is measured by what it prepares the beloved to survive. The lesson is about thin dough, but its true subject is how to let someone go without letting the connection tear.`,
      note: T('開頭先簡述分析的原創段落；論點同時說出技巧（延伸意象、克制的觀點）和複雜情感（愛就是放手）；每段都仔細分析具體字詞；結論點出情感的複雜性。', 'The analysis first summarizes the original passage it studies. The thesis names techniques (extended image, restrained point of view) and a complex emotion (love that lets go); each paragraph closely reads specific words; the conclusion names the complexity.'),
    },
    vocab: ['restrained', 'mirrors', 'anticipates', 'simile', 'point of view', 'tension', 'ultimately'],
  },
  {
    id: 'w12-argument',
    grade: 12,
    genre: 'argument',
    std: 'CCSS W.11-12.1',
    title: T('論說文：一個值得思考的問題', 'Argument: a question worth thinking about'),
    topics: [T('當專才好，還是通才好', 'whether it is better to be a specialist or a generalist'), T('在高度連線的世界裡，隱私是否值得保護', 'whether privacy is worth protecting in a connected world'), T('原創是否比精通更重要', 'whether originality matters more than mastery'), T('規則是否讓遊戲（和社會）更好', 'whether rules make games—and societies—better'), T('是否應該為了未來世代而犧牲現在的便利', 'whether we should give up present comforts for future generations')],
    prompt: T('針對「{t}」寫一篇成熟的論說文。提出有層次的主張，用多元的證據（歷史、文學、科學、時事、個人觀察）發展推理，並處理最強的反方意見。', 'Write a mature argument on {t}. Make a nuanced claim, develop it with varied evidence (history, literature, science, current events, observation), and engage the strongest opposing view.'),
    plan: [
      { label: T('引言與有層次的論點', 'Introduction and nuanced thesis'), hint: T('避免非黑即白；說出「在什麼條件下」。', 'Avoid all-or-nothing; say under what conditions.') },
      { label: T('理由一', 'Reason 1'), hint: T('最基本的理由 + 具體證據。', 'Your foundational reason + specific evidence.') },
      { label: T('理由二', 'Reason 2'), hint: T('建立在理由一之上，推得更深。', 'Build on reason 1 and push deeper.') },
      { label: T('最強的反方', 'The strongest counterargument'), hint: T('用最有力的版本呈現，再回應。', 'State it at its strongest, then respond.') },
      { label: T('結論', 'Conclusion'), hint: T('更大的意義或啟示。', 'Broader significance or implication.') },
    ],
    starters: ['We tend to admire …', 'The case for … is strongest when …', 'History offers a telling example: …', 'The most serious objection is that …', 'This objection is persuasive, but …', 'Perhaps the real question is not … but …'],
    words: [500, 850],
    checklist: [
      T('論點有層次（有條件或有限定）。', 'My thesis is nuanced (qualified or conditional).'),
      T('證據多元且具體。', 'My evidence is varied and specific.'),
      T('推理逐段推進。', 'My reasoning builds paragraph by paragraph.'),
      T('我用最強的版本呈現反方，並認真回應。', 'I present the strongest opposing view and respond seriously.'),
      T('我用精確的轉折詞表示邏輯關係。', 'I use precise transitions to show logical relationships.'),
      T('句法多變，用字精確。', 'My syntax is varied and my diction precise.'),
      T('結論提出更大的意義。', 'My conclusion reaches for broader significance.'),
    ],
    mentor: {
      title: 'The Case for the Wide View',
      text: `We tend to admire specialists. The surgeon who has performed a single operation thousands of times, the violinist who has practiced since the age of four, the engineer who knows one bridge design better than anyone alive: these people seem to embody excellence. In a world of deep complexity, specialization is necessary. Yet the most valuable people in a changing world are generalists with one area of depth, because breadth allows them to see connections, adapt to new problems, and judge when specialized knowledge has reached its limits.

The case for breadth begins with the nature of new problems. Many of the challenges facing the next generation, from climate adaptation to public health, do not fit inside a single discipline. Rising seas are a problem of engineering, but also of economics, law, and human behavior. A coastal engineer who understands only seawalls may design a structure that works perfectly and still fails, because no one considered how residents would use, fund, or resist it. Those who can speak the languages of several fields are often the ones who notice the gap.

Breadth also fuels invention. Some of the most important ideas have come from people who carried a tool from one field into another. Charles Darwin drew on geology and on economic writing about population as he developed his theory of natural selection. Ideas travel best when someone is standing in two places at once. A pure specialist, however skilled, may never encounter the foreign idea that would transform his or her own work.

The most serious objection is that generalists risk becoming shallow. A person who knows a little about everything may know enough about nothing to be trusted. This objection is persuasive, and it explains why the ideal is not the dabbler but the person shaped like a T: broad across the top, deep in one place. Depth gives a generalist credibility and rigor; breadth gives that depth direction and context. Without depth, breadth is trivia. Without breadth, depth can become a well that its owner mistakes for the ocean.

Perhaps the real question is not whether to specialize but how to remain curious after one has. Schools and workplaces often reward people for narrowing their focus as early as possible. A wiser approach would encourage students to build one area of expertise while continuing to wander beyond it. The future will belong not to those who know the most about one thing, but to those who can see how their one thing fits into everything else.`,
      note: T('論點有層次（有深度的通才）；兩個理由逐步推進（新問題 → 創新）；用「T 型人」回應最強的反方；結論把問題重新框架成「如何保持好奇」。', 'A nuanced thesis (a generalist with one area of depth). Two reasons build on each other, the strongest objection is answered with the T-shaped model, and the conclusion reframes the question around staying curious.'),
    },
    vocab: ['yet', 'the case for', 'this objection is persuasive, but', 'without', 'perhaps the real question', 'nuanced'],
  },
  {
    id: 'w12-synthesis',
    grade: 12,
    genre: 'argument',
    std: 'CCSS W.11-12.8 · AP Lang Synthesis',
    title: T('綜合論說文：政策辯論', 'Synthesis essay: a policy debate'),
    topics: [T('國家是否應該投資高速鐵路', 'whether the nation should invest in high-speed rail'), T('社群媒體平台是否應該驗證使用者年齡', 'whether social media platforms should verify users\' ages'), T('熱門景點是否應該限制觀光客人數', 'whether popular destinations should limit the number of tourists'), T('公司是否應該採用一週工作四天', 'whether companies should adopt a four-day workweek'), T('城市是否應該禁止新建的獨棟住宅區', 'whether cities should allow apartments in neighborhoods zoned for single-family homes')],
    prompt: T('針對「{t}」收集至少五個觀點不同的來源，標為 Source A、B、C…。寫一篇綜合論說文，提出有條件的政策建議，用至少三個來源支持，並處理成本、公平性或意外後果等問題。', 'Gather at least five sources with different perspectives on {t}, labeled Source A, B, C… Write a synthesis essay that makes a qualified policy recommendation, draws on at least three sources, and addresses questions of cost, fairness, or unintended consequences.'),
    plan: [
      { label: T('問題與建議', 'Problem and recommendation'), hint: T('有條件的建議往往最有說服力。', 'A conditional recommendation is often the most persuasive.') },
      { label: T('支持的來源（兩個以上）', 'Supporting sources (two or more)'), hint: T('它們如何彼此印證？', 'How do they reinforce each other?') },
      { label: T('成本或公平性', 'Cost or fairness'), hint: T('誰付錢？誰受益？誰可能吃虧？', 'Who pays, who benefits, who might lose?') },
      { label: T('反方來源', 'Opposing source'), hint: T('用最強的版本，再修正你的建議。', 'Present it at its strongest; refine your recommendation.') },
      { label: T('結論', 'Conclusion'), hint: T('建議的具體下一步。', 'A concrete next step.') },
    ],
    starters: ['The debate over … often …', 'The evidence points toward a middle path: …', 'Source B and Source D both …', 'Yet the benefits are not evenly shared: …', 'Source E warns that …', 'A sensible policy would …'],
    words: [500, 850],
    checklist: [
      T('我的建議有條件，而且是我自己的立場。', 'My recommendation is my own and appropriately qualified.'),
      T('我引用至少三個來源，標示清楚。', 'I cite at least three sources clearly.'),
      T('來源彼此對話，而不是排成清單。', 'My sources talk to each other rather than forming a list.'),
      T('我討論了成本、公平性或意外後果。', 'I address cost, fairness, or unintended consequences.'),
      T('反方來源讓我修正了建議。', 'An opposing source helps me refine my recommendation.'),
      T('結論提出具體的下一步。', 'My conclusion proposes a concrete next step.'),
    ],
    mentor: {
      title: 'Four Days, With Conditions',
      text: `The debate over a four-day workweek is often framed as a choice between productivity and comfort. The evidence points toward a more interesting conclusion. Companies should adopt a four-day week when the work can be measured by results rather than hours, but they should pair the change with safeguards so that a shorter week does not become the same work crammed into fewer days.

The strongest support comes from trials in which companies kept pay the same while cutting a day. In one large set of pilot programs, most participating companies reported stable or improved productivity, and the majority chose to continue the schedule after the trial ended (Source A). Employee surveys from the same programs show lower rates of burnout and fewer sick days (Source C). Taken together, these sources suggest that the fifth day was often less productive than managers assumed, and that rested workers recovered much of the lost time through sharper focus.

Yet the benefits are not evenly shared. A four-day week is easiest for office workers whose output is measured in projects. For nurses, bus drivers, and retail staff, whose work is defined by covering hours, a shorter week may require hiring more people or stretching each shift (Source B). If only salaried professionals gain a three-day weekend, the policy could widen the gap between those who work at desks and those who keep the rest of society running.

Source E raises a further concern: in some workplaces, the four-day week simply compresses forty hours into four ten-hour days, leaving employees more exhausted, not less. This warning deserves weight, because it shows that the policy's success depends on its design. A shorter week works when companies use it as a chance to cut unnecessary meetings and low-value tasks, not when they treat it as a scheduling trick.

A sensible policy, then, would begin with voluntary trials in roles where results can be clearly measured, keep pay the same, and track both productivity and workload. Companies with hourly staff could explore alternatives, such as guaranteed long weekends each month. The goal should not be a shorter week for its own sake, but a working life in which time off is real rest rather than recovery from overwork.`,
      note: T('建議有條件（以成果衡量的工作、配合保障措施）；A 和 C 互相印證；B 帶出公平性問題；E 的反方意見讓作者修正建議；結論提出具體的試行方案。（此範文的來源是虛構的練習資料。）', 'The recommendation is conditional. Sources A and C reinforce each other, Source B raises fairness, Source E\'s objection refines the proposal, and the conclusion gives concrete next steps. (The sources are invented practice material.)'),
    },
    vocab: ['the evidence points toward', 'taken together', 'yet', 'this warning deserves weight', 'a sensible policy would', 'safeguards'],
  },
  {
    id: 'w12-research',
    grade: 12,
    genre: 'research',
    std: 'CCSS W.11-12.7 · W.11-12.8',
    title: T('高級研究報告', 'Senior research paper'),
    topics: [T('一個地方環境問題的成因與解方', 'the causes of and solutions to a local environmental problem'), T('一項科技如何改變一個行業', 'how a technology has changed an industry'), T('一個歷史事件的不同詮釋', 'competing interpretations of a historical event'), T('一個公共衛生政策的效果', 'the effects of a public health policy'), T('語言如何影響思考', 'how language shapes thought')],
    prompt: T('針對{t}寫一篇研究報告。使用至少六個可信的來源（含第一手資料或學術研究），在引言說明研究問題和重要性，綜合來源的共識和分歧，評估證據的強弱，並提出有適度限定的結論。使用 MLA 或 APA 格式。', 'Write a research paper on {t}. Use at least six credible sources, including primary sources or academic studies. Introduce your question and why it matters, synthesize where sources agree and disagree, weigh the strength of the evidence, and reach an appropriately qualified conclusion. Use MLA or APA style.'),
    plan: [
      { label: T('問題與重要性', 'Question and significance'), hint: T('為什麼讀者應該在乎？', 'Why should readers care?') },
      { label: T('背景', 'Background'), hint: T('必要的歷史和定義。', 'Necessary history and definitions.') },
      { label: T('證據的主線', 'Main line of evidence'), hint: T('綜合最有力的研究。', 'Synthesize the strongest studies.') },
      { label: T('爭議與限制', 'Debate and limitations'), hint: T('哪裡證據不足？誰不同意？為什麼？', 'Where is evidence thin, who disagrees, and why?') },
      { label: T('結論與建議', 'Conclusion and implications'), hint: T('限定的答案 + 未來研究。', 'A qualified answer + future research.') },
    ],
    starters: ['In the past decade, …', 'This paper asks …', 'The strongest evidence comes from …', 'Not all researchers agree; …', 'One limitation of these studies is …', 'The evidence suggests, though does not prove, that …'],
    words: [500, 850],
    checklist: [
      T('研究問題清楚，並說明重要性。', 'My question is clear and its significance explained.'),
      T('我使用至少六個可信的來源，包含學術或第一手資料。', 'I use at least six credible sources, including academic or primary ones.'),
      T('我綜合來源並評估證據的強弱。', 'I synthesize sources and weigh the strength of the evidence.'),
      T('我誠實處理爭議與限制。', 'I deal honestly with debate and limitations.'),
      T('結論有適度限定，不說過頭。', 'My conclusion is appropriately qualified.'),
      T('引用格式正確一致，沒有拼湊抄襲。', 'My citations are correct and consistent, with no patchwriting.'),
      T('語域正式，用主動語態和精確的動詞。', 'My register is formal, with active voice and precise verbs.'),
    ],
    mentor: {
      title: 'Built to Last? Repairing Versus Replacing Historic Bridges',
      text: `Across the country, thousands of bridges built in the early twentieth century are reaching the end of their expected lives. Local governments must decide whether to repair these structures or replace them with modern designs. This paper asks whether rehabilitating historic bridges is a sound use of public money. The evidence suggests that repair is often cheaper and culturally valuable, but only when engineers can confirm that the original structure can safely carry modern loads.

Many older bridges were designed for lighter vehicles and less traffic than they now carry. As a result, transportation agencies have historically favored replacement, which allows them to widen lanes and meet current safety standards (Nakamura 22). However, a growing body of research challenges the assumption that new is always better.

The strongest financial evidence comes from cost comparisons of completed projects. A review of rehabilitation and replacement projects in several states found that repairs cost, on average, substantially less than comparable new bridges, largely because existing foundations and approaches could be reused (Torres 45). Brennan's case studies support this finding, showing that rehabilitated bridges often required no more maintenance over twenty years than new ones (Brennan 103). Taken together, these sources indicate that rehabilitation can be a fiscally responsible choice.

The cultural argument is harder to measure but no less real. Interviews with residents in three small towns revealed that historic bridges serve as landmarks in local memory, appearing in family stories, photographs, and community events (Nakamura 17). When one town replaced its 1920s truss bridge, residents described a sense of loss that persisted years later (Nakamura 31). Such evidence does not translate easily into budget figures, yet it suggests that the value of an old bridge extends beyond its function.

Not all researchers agree. Engineers point out that some historic designs cannot be strengthened enough to meet modern safety standards without destroying their character, making rehabilitation a costly compromise (Mensah 58). Moreover, the cost studies above relied mostly on bridges that had already been selected as good candidates for repair, which may overstate the general savings. This limitation suggests that decisions must be made case by case.

The evidence suggests, though it does not prove, that rehabilitation deserves serious consideration whenever a historic bridge is structurally sound. Agencies should require a full engineering assessment before choosing replacement and should weigh community value alongside cost. Future research should track repaired bridges over longer periods and develop better ways to measure their cultural worth.`,
      note: T('引言說明問題和重要性，論點有條件限定；身體段分成經濟證據、文化證據、爭議與限制；作者評估了研究的選樣偏差；結論用 suggests, though it does not prove 適度限定。（此範文的來源是虛構的。）', 'The introduction states the question and stakes with a qualified thesis. Body sections cover financial evidence, cultural evidence, and debate; the writer flags a selection bias in the research; and the conclusion hedges appropriately ("suggests, though it does not prove"). (The sources are invented.)'),
    },
    vocab: ['this paper asks', 'the strongest evidence', 'taken together', 'not all researchers agree', 'one limitation', 'suggests, though does not prove'],
  },
  {
    id: 'w12-speech',
    grade: 12,
    genre: 'opinion',
    std: 'CCSS SL.11-12.4 · W.11-12.4',
    title: T('畢業演講稿', 'Commencement or farewell speech'),
    topics: [T('高中最重要的一課', 'the most important lesson of high school'), T('我們欠了誰一句謝謝', 'the people we never thanked'), T('允許自己還不知道答案', 'giving ourselves permission not to know yet'), T('我們從失敗中學到的事', 'what we learned from failing'), T('一個代表我們這一屆的物件', 'an object that represents our class')],
    prompt: T('以畢業生代表的身分寫一篇四到五分鐘的演講稿，主題是{t}。聽眾包括同學、家長和老師。要真誠、具體、有趣，並運用修辭技巧（重複、對照、故事、號召）。', 'As a student speaker, write a four-to-five-minute graduation speech on {t}. Your audience includes classmates, families, and teachers. Be sincere, specific, and engaging, and use rhetorical techniques (repetition, antithesis, story, a call to action).'),
    plan: [
      { label: T('開場', 'Opening'), hint: T('一個大家都記得的共同時刻。', 'A shared moment everyone remembers.') },
      { label: T('核心想法', 'Central idea'), hint: T('一句話說出你想傳達的事。', 'Your message in one sentence.') },
      { label: T('故事與例子', 'Stories and examples'), hint: T('兩三個具體的回憶，涵蓋不同的人。', 'Two or three specific memories that include different people.') },
      { label: T('轉向未來', 'Turn to the future'), hint: T('這個想法如何帶到下一個階段？', 'How does the idea carry into what comes next?') },
      { label: T('結尾', 'Closing'), hint: T('呼應開場，留下一句好記的話。', 'Echo the opening and leave a memorable line.') },
    ],
    starters: ['Four years ago, …', 'Some of you will remember …', 'Here is what I think we learned: …', 'We were not …; we were …', 'Wherever you go next, …', 'So tonight, …'],
    words: [500, 850],
    checklist: [
      T('開場用共同回憶抓住所有聽眾。', 'My opening uses a shared memory to reach the whole audience.'),
      T('有一個清楚的核心想法。', 'I have one clear central idea.'),
      T('故事具體，涵蓋不同的人。', 'My stories are specific and include different people.'),
      T('我用了重複、對照或三重句等修辭技巧。', 'I use rhetorical techniques such as repetition, antithesis, or tricolon.'),
      T('語氣真誠，有幽默也有深度。', 'My tone is sincere, with both humor and depth.'),
      T('句子適合朗讀，長短交錯。', 'My sentences work aloud, mixing long and short.'),
      T('結尾呼應開場，留下好記的話。', 'My ending echoes the opening with a memorable line.'),
    ],
    mentor: {
      title: 'Permission Not to Know',
      text: `Four years ago, on our first day of high school, the fire alarm went off at 9:12 a.m. It was not a drill. Someone in the cafeteria had tried to make toast in a machine that had not worked since 2009. Six hundred freshmen stood on the football field, holding schedules we could not read, in a building we did not understand, and not one of us knew where we were supposed to go.

I have been thinking about that morning a lot lately, because I think it taught us the most important lesson of the past four years: it is all right not to know yet.

We did not know how to find Room 214, which, as it turns out, is not on the second floor. We did not know how to balance a chemical equation, write a thesis, or talk to the person we wanted to sit with at lunch. Some of us did not know what we were good at. Some of us thought we knew, and found out we were wrong. And somehow, over and over, we figured it out.

We figured it out because of people. Because of Ms. Haddad, who answered emails at 10 p.m. the night before every chemistry test and pretended it was no trouble. Because of the custodians who unlocked the band room early so the jazz ensemble could practice. Because of parents who drove, waited, listened, and paid for more poster board than any family should ever need. And because of each other: lab partners, teammates, the friend who shared notes after you missed a week with the flu.

High school did not give us all the answers. It gave us practice in not having them. We learned that confusion is not failure; it is the feeling of being at the beginning of something. We learned that the people who seem most certain are often the ones who stopped asking questions. And we learned that the best answer to "I don't know" is not panic, but "Let's find out."

Next year, most of us will be standing somewhere new again, holding schedules we cannot read in buildings we do not understand. Some of us will be in college, some in jobs, some in places we have not imagined yet. I hope that when that moment comes, we remember the football field. We did not know where to go then, either. We were not lost; we were starting.

So tonight, Class of 2027, I am not wishing you certainty. I am wishing you good questions, good people to ask them with, and the courage to keep not knowing until you do.

And maybe a working toaster. Thank you.`,
      note: T('開場用全體都記得的幽默回憶；核心想法一句話說清楚；用 Because of… 的首語重複感謝不同的人；We were not lost; we were starting 是對照；結尾呼應開場並用幽默收尾。', 'A funny shared memory opens the speech, the central idea fits in one sentence, anaphora ("Because of…") thanks many groups, "We were not lost; we were starting" uses antithesis, and the ending echoes the opening with a light final joke.'),
    },
    vocab: ['four years ago', 'we learned that', 'because of', 'we were not…; we were…', 'so tonight', 'I hope'],
  },
  {
    id: 'w12-reflective',
    grade: 12,
    genre: 'personal',
    std: 'CCSS W.11-12.3e',
    title: T('反思文：我改變了想法', 'Reflective essay: how my thinking changed'),
    topics: [T('一個你十四歲時深信、現在不再相信的想法', 'a belief you held at fourteen and no longer hold'), T('一個你曾經不喜歡、後來理解的人', 'a person you once misjudged'), T('一本改變你看世界方式的書', 'a book that changed how you see the world'), T('一個你終於接受的限制', 'a limitation you finally accepted'), T('「成功」這個詞對你的意義如何改變', 'how the meaning of "success" has changed for you')],
    prompt: T('寫一篇反思文，主題是{t}。誠實地重現過去的你，說明是什麼讓你改變，並思考這個改變對你未來的意義。反思要深入，而不是簡單的「我學到了教訓」。', 'Write a reflective essay about {t}. Portray your earlier self honestly, show what changed your mind, and consider what the change means for your future. Go beyond a simple "lesson learned."'),
    plan: [
      { label: T('過去的我', 'My earlier self'), hint: T('用具體場景呈現當時的想法。', 'Show the old belief through a specific scene.') },
      { label: T('裂縫', 'The crack'), hint: T('什麼經驗開始動搖那個想法？', 'What experience began to shake it?') },
      { label: T('改變', 'The change'), hint: T('改變通常是慢慢發生的，誠實寫出過程。', 'Change is usually gradual—show the process honestly.') },
      { label: T('現在與未來', 'Now and next'), hint: T('現在的理解還有什麼不確定？', 'What remains uncertain about what you think now?') },
    ],
    starters: ['At fourteen, I was certain that …', 'The first crack appeared when …', 'I did not change my mind all at once.', 'What I see now is …', 'I am less sure than I used to be about …', 'Perhaps …'],
    words: [500, 850],
    checklist: [
      T('我誠實、具體地呈現過去的想法。', 'I portray my earlier belief honestly and specifically.'),
      T('我說明了改變的原因和過程。', 'I show the causes and process of change.'),
      T('反思超越簡單的「我學到了」。', 'My reflection goes beyond a simple lesson.'),
      T('我承認現在的想法仍有不確定。', 'I acknowledge uncertainty in what I think now.'),
      T('敘事和反思交織，節奏好。', 'I weave narrative and reflection with good pacing.'),
      T('結尾有深度，不說教。', 'My ending has depth without preaching.'),
    ],
    mentor: {
      title: 'The Scoreboard',
      text: `At fourteen, I was certain that success could be read off a scoreboard. I kept a spreadsheet of my test scores, color-coded by subject, and I updated it the way some people check the weather. Green meant I was winning. Red meant I was losing, though I was never quite sure to whom.

The spreadsheet worked, in a sense. My grades were excellent. But I remember the evening in ninth grade when my younger sister asked me to help her build a model of the solar system for her science class, and I said no because I had a quiz to study for. She built it herself, with Saturn's rings made from a paper plate and a planet labeled "Pluto (sorry)." It was the most interesting thing anyone in our house made that year. I had spent the evening memorizing vocabulary words I could not now recall.

The first crack appeared in eleventh grade, in a physics class where I could not get a green. For weeks, I stared at problems on rotational motion that refused to make sense. My spreadsheet turned red, and I felt something close to panic. Then my teacher suggested I stop trying to finish the problem sets and instead build something: a simple spinning top, measured and filmed in slow motion. I spent three weekends on that top. My grade on the unit was the lowest of my high school career. It is also the only physics unit I remember clearly.

I did not change my mind all at once. For a long time, I told myself the top was a strange exception. But slowly I noticed that the things I valued most from high school, the debate I lost and then rebuilt my argument for, the novel I read twice because it confused me, the friendship that began when I admitted I needed help, had nothing to do with the spreadsheet. They lived in the space where I had not yet succeeded.

What I see now is that the scoreboard measured how well I performed what I already knew. It could not measure what I was becoming. That does not mean grades are meaningless; I still care about them, perhaps more than I should. But I have stopped believing they are the whole story.

I am less sure than I used to be about what success means. Perhaps that is the point. At fourteen, I wanted an answer I could color green. Now I suspect that the most important parts of a life will never fit in a cell of a spreadsheet, and I am learning, slowly, to be curious about them instead of afraid.`,
      note: T('過去的想法用具體物件（彩色試算表）呈現；妹妹的太陽系模型和陀螺是兩個轉折；作者承認改變是慢慢發生的、現在仍有不確定；反思有深度但不說教。', 'A concrete object (the color-coded spreadsheet) captures the old belief. The sister\'s model and the spinning top are turning points, the writer admits change was gradual and uncertainty remains, and the reflection is deep without preaching.'),
    },
    vocab: ['at fourteen', 'the first crack', 'I did not change my mind all at once', 'what I see now', 'I suspect', 'perhaps'],
  },
  {
    id: 'w12-compare',
    grade: 12,
    genre: 'compare',
    std: 'CCSS RL.11-12.9 · W.11-12.2',
    title: T('比較兩部作品的主題', 'Comparing two works across time'),
    topics: [T('兩部作品中創造者與被創造者的關係', 'the relationship between creator and creation in two works'), T('兩部作品如何描寫野心', 'how two works portray ambition'), T('兩部作品中的「局外人」', 'the outsider in two works'), T('兩部作品如何描寫家庭的責任', 'family duty in two works'), T('一部經典作品和一部當代作品如何處理同一個主題', 'how a classic and a contemporary work treat the same theme')],
    prompt: T('選兩部不同時代或文類的作品，比較{t}。論點要說出比較之後的洞見，而不只是列出異同。', 'Choose two works from different periods or genres and compare {t}. Your thesis should state an insight that emerges from the comparison, not just list similarities and differences.'),
    plan: [
      { label: T('論點：比較的洞見', 'Thesis: the insight'), hint: T('兩者放在一起，讓我們看到什麼？', 'What do we see only when the works are side by side?') },
      { label: T('相似之處', 'The shared ground'), hint: T('共同的處境或問題，兩部作品各有證據。', 'A shared situation, with evidence from both.') },
      { label: T('關鍵差異', 'The key difference'), hint: T('差異如何反映不同的時代或觀點？', 'How does the difference reflect different times or views?') },
      { label: T('結論', 'Conclusion'), hint: T('這個比較對今天的讀者有什麼意義？', 'What does the comparison mean for readers now?') },
    ],
    starters: ['Separated by more than two centuries, …', 'Both … and … depict …', 'Where Prospero …, Victor …', 'This difference matters because …', 'Read together, the two works suggest …'],
    words: [500, 850],
    checklist: [
      T('論點說出比較的洞見。', 'My thesis states an insight that comes from the comparison.'),
      T('每個段落都同時處理兩部作品。', 'Each body paragraph treats both works.'),
      T('兩部作品都有具體的文本證據。', 'I give specific textual evidence from both works.'),
      T('我說明差異背後的原因或意義。', 'I explain what the differences mean or why they exist.'),
      T('比較與對照的轉折詞用得精確。', 'My compare/contrast transitions are precise.'),
      T('結論連到今天的讀者。', 'My conclusion connects to readers today.'),
    ],
    mentor: {
      title: 'Masters and Monsters',
      text: `Separated by more than two centuries, William Shakespeare's The Tempest and Mary Shelley's Frankenstein both imagine a powerful figure who brings another being into his world and then cannot bear what that being becomes. Prospero rules the island and the creature Caliban; Victor Frankenstein builds a creature from the dead. Read together, the two works suggest that creators who refuse responsibility for those they shape will eventually be haunted by them, and that the "monster" is often a mirror of the one who made it.

Both works depict a relationship that begins with care and collapses into rejection. When Prospero first arrives on the island, he and his daughter Miranda teach Caliban to speak and treat him kindly, until Prospero accuses him of threatening Miranda and confines him to a rock. Caliban's bitter reply, "You taught me language, and my profit on't / Is, I know how to curse," shows that the education meant to civilize him has become a weapon. Shelley's creature also learns language, by secretly observing the De Lacey family, and he uses it to confront his maker with a sharp complaint: "I ought to be thy Adam, but I am rather the fallen angel." In both works, the gift of language allows the created being to name the injustice of his treatment.

The key difference lies in how each creator responds. Prospero never fully abandons Caliban; he controls him, punishes him, and keeps him as a servant. Near the end of the play, he offers an ambiguous admission: "this thing of darkness I / Acknowledge mine." Victor, by contrast, flees the moment his creature opens its eyes, and he spends the rest of the novel refusing to accept any connection to it. Shakespeare's creator chooses domination; Shelley's chooses denial. This difference reflects their times. Shakespeare wrote in an age of exploration and conquest, when power over others was often justified as order. Shelley wrote during the scientific revolution, when the danger seemed to lie in knowledge pursued without moral reflection.

Taken together, these two masters reveal two failures of responsibility. One controls without caring, and the other creates without caring for what he has made. Prospero's grudging acknowledgment suggests a possible path: a creator who finally admits that the "thing of darkness" is his. Victor never reaches that point, and his story ends in ice and ruin. For readers living in an age of artificial intelligence and genetic engineering, the comparison feels urgent. The question both works ask is not whether we can create, but whether we are willing to claim what we create, and to treat it as more than a tool.`,
      note: T('論點提出比較的洞見（創造者拒絕責任）；第一個身體段用兩部作品的引文說明相似處；第二段分析關鍵差異（控制 vs. 否認）並連到時代背景；結論連到今天的科技議題。', 'The thesis states an insight (creators who refuse responsibility). One body paragraph uses quotations from both works to show the shared pattern, the next analyzes the key difference (domination vs. denial) and its historical context, and the conclusion links to today\'s technology.'),
    },
    vocab: ['both', 'by contrast', 'where … , …', 'this difference reflects', 'read together', 'taken together'],
  },
  {
    id: 'w12-poem',
    grade: 12,
    genre: 'poem',
    std: 'CCSS W.11-12.3d',
    title: T('詩：戲劇獨白', 'Poem: a dramatic monologue'),
    topics: [T('一位即將退休的公車司機', 'a bus driver on the last day before retirement'), T('一位整理祖父母舊屋的孫子', 'a grandchild clearing out a grandparent\'s house'), T('一位在大考前夜的學生', 'a student on the night before a major exam'), T('一位燈塔管理員', 'a lighthouse keeper'), T('一位要離開家鄉的年輕人', 'a young person leaving their hometown')],
    prompt: T('寫一首戲劇獨白詩，說話者是{t}。說話者對一個不出聲的聽者說話，讀者要從他的話中推論出他沒有直接說出的情感或真相。', 'Write a dramatic monologue spoken by {t}. The speaker addresses a silent listener, and readers should infer feelings or truths the speaker never states directly.'),
    plan: [
      { label: T('說話者與聽者', 'Speaker and listener'), hint: T('誰在說？對誰說？在哪裡？', 'Who speaks, to whom, and where?') },
      { label: T('具體的細節', 'Concrete details'), hint: T('物件、動作、地點。', 'Objects, gestures, places.') },
      { label: T('沒說出口的事', 'What goes unsaid'), hint: T('讓細節替說話者說出情感。', 'Let details carry the feeling.') },
      { label: T('結尾的轉折', 'The final turn'), hint: T('最後幾行揭露更多。', 'Reveal a little more in the last lines.') },
    ],
    starters: ['No, leave that one—', 'You can sit there, if you like.', 'Thirty-one years on this route, and …', 'Hand me that box.', 'Tomorrow someone else will …'],
    words: [100, 300],
    checklist: [
      T('說話者有獨特的聲音。', 'My speaker has a distinctive voice.'),
      T('有一個不出聲的聽者，從話中看得出來。', 'There is a silent listener, implied by what the speaker says.'),
      T('讀者能從細節推論出沒說出口的情感。', 'Readers can infer unstated feelings from details.'),
      T('分行和停頓模仿說話的節奏。', 'My line breaks and pauses imitate speech.'),
      T('結尾有轉折或揭露。', 'My ending turns or reveals.'),
      T('每個字都精確。', 'Every word is precise.'),
    ],
    mentor: {
      title: 'Last Run, Route 9',
      text: `You can sit up front today, if you like.
Nobody's going to fight you for it.
Thirty-one years on this route, and you're the first
to ask what the little bell is for.

That one? Mrs. Okafor, Tuesdays and Thursdays,
dialysis at eight. She tapped the window twice
to tell me she was fine. Hasn't tapped since March.
I still slow down at her stop. Habit.

The boy with the cello case, he's at a college now,
somewhere with snow. He mailed me a program once.
I don't know why I kept it. It's in the visor.

No, I'm not sad. People get on, people get off.
That's the job. You learn not to count.

Here's the hill where the brakes need minding.
Here's the bakery that gives me the burnt ones free.
Tomorrow someone younger will learn all this
the long way, the way I did.

Pull the cord when you see your stop.
Go on. I'll wait until you're across.
I always wait until they're across.`,
      note: T('說話者（公車司機）對一位不出聲的乘客說話；具體細節（不再敲窗的乘客、遮陽板裡的節目單）透露他沒說出口的感情；他說「我不難過」，但讀者看得出相反；最後一句的重複揭露他一生的關懷。', 'The bus driver speaks to a silent passenger. Concrete details—the rider who stopped tapping, the program in the visor—reveal feelings he will not name. He says he is not sad, but readers sense otherwise, and the repeated final line reveals a lifetime of care.'),
    },
    vocab: ['dramatic monologue', 'speaker', 'silent listener', 'implied', 'line break', 'understatement', 'repetition'],
  },
];

const skills = [...g10, ...g11, ...g12];
const prompts = [...p10, ...p11, ...p12];

export default { skills, prompts };
