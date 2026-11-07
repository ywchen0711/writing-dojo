// Grades 4–6: skills (auto-checked drills) and writing prompts. See SPEC.md.
import { T, NAMES, words, ansTap, ansChoice, ansOrder, cap, low, an } from '../util.js';

// ---------- helpers ----------
const BOYS = ['Max', 'Leo', 'Jay', 'Noah', 'Ethan', 'Ben', 'Sam', 'Ryan', 'Owen', 'Lucas'];
const GIRLS = ['Mia', 'Emma', 'Ava', 'Lily', 'Zoe', 'Chloe', 'Grace', 'Ella', 'Ruby', 'Nora'];
// a cast of names for one drill: {a} {b} any names, {g} {g2} girls, {m} {m2} boys
function cast(r) {
  const any = r.sample(NAMES, 2), g = r.sample(GIRLS, 2), m = r.sample(BOYS, 2);
  return { a: any[0], b: any[1], g: g[0], g2: g[1], m: m[0], m2: m[1] };
}
const fill = (s, c) => s.replace(/\{(a|b|g2|g|m2|m)\}/g, (_, k) => c[k]);
const fillT = (t, c) => T(fill(t.zh, c), fill(t.en, c));
// a sentence with [wrong|right] marks → tokens of the wrong sentence, the indexes to tap and the fixed sentence
function marked(s) {
  const bad = s.replace(/\[([^|\]]*)\|([^\]]*)\]/g, '$1'), good = s.replace(/\[([^|\]]*)\|([^\]]*)\]/g, '$2');
  const wb = words(bad), wg = words(good);
  if (wb.length !== wg.length) throw new Error('marked: token count differs in ' + s);
  const idx = wb.map((w, i) => (w !== wg[i] ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) throw new Error('marked: no change in ' + s);
  return { ws: wb, idx, good, bad, wrong: s.match(/\[([^|\]]*)\|/)[1], right: s.match(/\|([^\]]*)\]/)[1] };
}
const strip = (s) => s.replace(/<[^>]*>/g, '');
// right option first, then k distinct wrong options (no repeats, never equal to the right one)
const opts = (r, right, wrongs, k = 3) => [right, ...r.sample([...new Set(wrongs)].filter((w) => JSON.stringify(w) !== JSON.stringify(right)), k)];

const skills = [
  // ======================= GRADE 4 =======================
  {
    id: 'g4-relative-pronouns',
    grade: 4,
    unit: 'grammar',
    name: T('關係代名詞和關係副詞', 'Relative pronouns and adverbs'),
    std: 'CCSS L.4.1a',
    lesson: {
      zh: '關係詞把兩個想法接成一句，並說明前面的名詞：<b>who</b> 指人，<b>whose</b> 表示「誰的」，<b>which</b> 指東西，<b>where</b> 指地點，<b>when</b> 指時間，<b>why</b> 用在 the reason 後面（表示原因）。<b>that</b> 可以指人或東西，但不能用在逗號後面。',
      en: 'Relative words join two ideas and tell more about a noun: <b>who</b> for people, <b>whose</b> for "belonging to whom", <b>which</b> for things, <b>where</b> for places, <b>when</b> for times, and <b>why</b> after "the reason". <b>That</b> can point to people or things, but never right after a comma.',
      ex: ['The girl <b>who</b> sings in the choir is my sister.', 'I have a friend <b>whose</b> cat can open doors.', 'This is the park <b>where</b> we fly kites.', 'Saturday is the day <b>when</b> we bake bread.'],
    },
    gen(r) {
      const items = [
        ['{a} is the student ___ won the spelling bee.', 'who'],
        ['The coach ___ trains our team is very patient.', 'who'],
        ['My grandpa, ___ is eighty, still rides a bike every day.', 'who'],
        ['I have a friend ___ dad is a firefighter.', 'whose'],
        ['{a} found a puppy ___ tail was wagging fast.', 'whose'],
        ['The book ___ cover is torn belongs to {a}.', 'whose'],
        ['The library is the place ___ {a} likes to read.', 'where'],
        ['This is the park ___ we play soccer on Saturdays.', 'where'],
        ['Summer is the season ___ we visit Grandma.', 'when'],
        ['I remember the day ___ {a} lost a front tooth.', 'when'],
        ['Nobody knows the reason ___ the cat hid under the bed.', 'why'],
        ['Can you tell me the reason ___ {a} was late?', 'why'],
        ['The cake, ___ {a} baked this morning, is still warm.', 'which'],
        ['Our old car, ___ is bright yellow, makes a funny noise.', 'which'],
      ];
      const rule = {
        who: T('空格前是「人」，而且後面要說這個人做了什麼，所以用 who。', 'The word before the blank is a person, and the clause tells what the person does, so use "who".'),
        whose: T('這裡要表示「誰的」（某人或某物所擁有的），所以用 whose。', 'The blank shows ownership ("belonging to whom"), so use "whose".'),
        where: T('空格前是一個「地點」，所以用 where。', 'The word before the blank is a place, so use "where".'),
        when: T('空格前是一個「時間」（季節、日子），所以用 when。', 'The word before the blank is a time (a season or a day), so use "when".'),
        why: T('空格前是 the reason（原因），所以用 why。', 'The blank comes after "the reason", so use "why".'),
        which: T('空格前是「東西」，而且在逗號後面，所以用 which（不能用 that）。', 'The word before the blank is a thing, and it comes after a comma, so use "which" (not "that").'),
      };
      const [s0, right] = r.pick(items), c = cast(r), s = fill(s0, c);
      return {
        q: T(`選出正確的關係詞：${s}`, `Choose the right relative word: ${s}`),
        ans: ansChoice(opts(r, right, ['who', 'whose', 'which', 'where', 'when', 'why'])),
        sol: [rule[right], T(`正確的句子：${s.replace('___', right)}`, `The sentence: ${s.replace('___', right)}`)],
        hint: T('先看空格前面的名詞：是人、東西、地點、時間，還是原因？', 'Look at the noun before the blank: a person, a thing, a place, a time, or a reason?'),
      };
    },
  },
  {
    id: 'g4-progressive-tenses',
    grade: 4,
    unit: 'grammar',
    name: T('進行式：過去、現在、未來', 'Progressive tenses'),
    std: 'CCSS L.4.1b',
    lesson: {
      zh: '進行式表示「某個時間點正在做」：現在進行式 <b>am/is/are + -ing</b>，過去進行式 <b>was/were + -ing</b>，未來進行式 <b>will be + -ing</b>。看句子裡的時間詞（right now、last night、tomorrow）來決定。',
      en: 'Progressive tenses show an action that is going on at a certain time: present <b>am/is/are + -ing</b>, past <b>was/were + -ing</b>, future <b>will be + -ing</b>. Look at the time words (right now, last night, tomorrow) to decide.',
      ex: ['Right now, Mia <b>is reading</b> a comic.', 'At eight last night, Mia <b>was reading</b> a comic.', 'Tomorrow at noon, Mia <b>will be reading</b> a comic.'],
    },
    gen(r) {
      const acts = [['reading', 'a comic book'], ['building', 'a sandcastle'], ['painting', 'a picture'], ['baking', 'muffins'], ['practicing', 'the piano'], ['writing', 'a letter'], ['cleaning', 'the garage'], ['walking', 'the dog'], ['playing', 'chess'], ['washing', 'the car']];
      const cues = {
        now: ['Right now,', 'At this moment,', 'Shh!', 'Look!'],
        past: ['Yesterday at noon,', "At eight o'clock last night,", 'When the storm started last night,', 'When I called an hour ago,'],
        future: ['Tomorrow at noon,', 'At this time next week,', 'When you arrive tonight,', "At three o'clock tomorrow,"],
      };
      const tense = r.pick(['now', 'past', 'future']), cue = r.pick(cues[tense]), [ing, obj] = r.pick(acts), c = cast(r);
      const two = r.chance(0.4), subj = two ? `${c.a} and ${c.b}` : c.a;
      const form = { now: two ? 'are' : 'is', past: two ? 'were' : 'was', future: 'will be' };
      const right = `${form[tense]} ${ing}`;
      const others = ['now', 'past', 'future'].filter((t) => t !== tense).map((t) => `${form[t]} ${ing}`);
      const agree = tense === 'now' ? (two ? `is ${ing}` : `are ${ing}`) : tense === 'past' ? (two ? `was ${ing}` : `were ${ing}`) : `will ${ing}`;
      const s = `${cue} ${subj} ___ ${obj}.`;
      const name = { now: T('現在進行式', 'present progressive'), past: T('過去進行式', 'past progressive'), future: T('未來進行式', 'future progressive') }[tense];
      return {
        q: T(`選出正確的動詞：${s}`, `Choose the right verb: ${s}`),
        ans: ansChoice([right, ...others, agree]),
        sol: [
          T(`時間線索是「${cue}」，表示動作在那個時間點正在進行，要用${name.zh}。`, `The time clue is "${cue}". The action is going on at that time, so use the ${name.en}.`),
          T(`主詞是 ${subj}（${two ? '兩個人，複數' : '一個人，單數'}），所以用「${right}」。`, `The subject "${subj}" is ${two ? 'two people (plural)' : 'one person (singular)'}, so it is "${right}".`),
          T(`正確的句子：${s.replace('___', right)}`, `The sentence: ${s.replace('___', right)}`),
        ],
      };
    },
  },
  {
    id: 'g4-modals',
    grade: 4,
    unit: 'grammar',
    name: T('情態助動詞 can、may、must', 'Modal verbs: can, may, must'),
    std: 'CCSS L.4.1c',
    lesson: {
      zh: '情態助動詞放在動詞前面，改變句子的意思：<b>can/could</b> 能力（會做），<b>may</b> 許可（可以）或可能，<b>must</b> 必須（規定），<b>might</b> 可能，<b>should</b> 建議（最好）。後面的動詞用原形。',
      en: 'Modal verbs go before a main verb and change its meaning: <b>can/could</b> = ability, <b>may</b> = permission or possibility, <b>must</b> = necessity (a rule), <b>might</b> = possibility, <b>should</b> = advice. The main verb stays in its base form.',
      ex: ['Leo <b>can</b> juggle. (ability)', 'You <b>may</b> go outside. (permission)', 'You <b>must</b> stop at a red light. (necessity)', 'It <b>might</b> snow. (possibility)'],
    },
    gen(r) {
      const M = {
        ability: T('能力（會做）', 'ability (able to do it)'),
        permission: T('許可（准許）', 'permission (allowed to)'),
        necessity: T('必須（規定）', 'necessity (has to)'),
        possibility: T('可能（也許會）', 'possibility (might happen)'),
        advice: T('建議（最好這樣做）', 'advice (a good idea)'),
      };
      const items = [
        ['{a} <b>can</b> whistle a whole song.', 'ability'], ['{a} <b>can</b> swim across the lake.', 'ability'], ['My baby brother <b>can</b> walk now.', 'ability'], ['{a} <b>could</b> read before kindergarten.', 'ability'],
        ['You <b>may</b> leave the table when you finish.', 'permission'], ['"<b>May</b> I use your markers?" {a} asked.', 'permission'], ['The teacher said we <b>may</b> sit anywhere today.', 'permission'], ['Students <b>may</b> borrow two books at a time.', 'permission'],
        ['You <b>must</b> wear a helmet when you ride a bike.', 'necessity'], ['Everyone <b>must</b> be quiet in the library.', 'necessity'], ['{a} <b>must</b> hand in the project by Friday.', 'necessity'], ['Visitors <b>must</b> sign in at the front desk.', 'necessity'],
        ['Take an umbrella. It <b>might</b> rain later.', 'possibility'], ['The package <b>may</b> arrive tomorrow, or it may come on Monday.', 'possibility'], ['{g} <b>might</b> come to the party if she feels better.', 'possibility'], ['Those dark clouds <b>could</b> bring snow tonight.', 'possibility'],
        ['You <b>should</b> drink water after you run.', 'advice'], ['{a} <b>should</b> go to bed early before the big test.', 'advice'], ['We <b>should</b> bring a map on the hike.', 'advice'],
      ];
      const why = {
        ability: T('句子在說某人「會」做某件事，表示能力。', 'The sentence tells what someone is able to do, so it shows ability.'),
        permission: T('句子在說「准不准許」做某件事，表示許可。', 'The sentence is about being allowed to do something, so it shows permission.'),
        necessity: T('句子在說規定或「一定要」做的事，表示必須。', 'The sentence states a rule or something that has to be done, so it shows necessity.'),
        possibility: T('句子在說「也許會」發生的事，不確定，表示可能。', 'The sentence tells about something that may or may not happen, so it shows possibility.'),
        advice: T('句子在給一個好建議，表示「最好這樣做」。', 'The sentence gives a good idea, so it shows advice.'),
      };
      const [s0, k] = r.pick(items), s = fill(s0, cast(r));
      return {
        q: T(`粗體的助動詞表示什麼意思？${s}`, `What does the bold modal verb show? ${s}`),
        ans: ansChoice(opts(r, M[k], Object.keys(M).filter((x) => x !== k).map((x) => M[x]))),
        sol: [why[k], T(`所以答案是：${M[k].zh}。`, `So the answer is: ${M[k].en}.`)],
      };
    },
  },
  {
    id: 'g4-adjective-order',
    grade: 4,
    unit: 'grammar',
    name: T('形容詞的順序', 'Order of adjectives'),
    std: 'CCSS L.4.1d',
    lesson: {
      zh: '幾個形容詞一起放在名詞前面時，英文有固定順序：<b>看法 → 大小 → 新舊 → 形狀 → 顏色 → 材料 → 名詞</b>。例如 a lovely small old round red wooden box（實際上通常只用兩三個）。',
      en: 'When several adjectives come before a noun, English uses this order: <b>opinion → size → age → shape → color → material → noun</b>. Most phrases use only two or three of them.',
      ex: ['a <b>beautiful big</b> house', 'a <b>small old</b> clock', 'a <b>round blue plastic</b> bowl', 'a <b>lovely little red</b> box'],
    },
    gen(r) {
      const CAT = [
        ['opinion', T('看法', 'opinion'), ['lovely', 'beautiful', 'strange', 'fancy', 'cute']],
        ['size', T('大小', 'size'), ['big', 'small', 'tiny', 'huge', 'little']],
        ['age', T('新舊', 'age'), ['old', 'new', 'antique']],
        ['shape', T('形狀', 'shape'), ['round', 'square', 'oval']],
        ['color', T('顏色', 'color'), ['red', 'blue', 'green', 'yellow', 'white', 'black']],
        ['material', T('材料', 'material'), ['wooden', 'plastic', 'metal', 'glass']],
      ];
      const noun = r.pick(['box', 'table', 'tray', 'bowl', 'clock', 'mirror', 'plate']);
      const pickCats = r.sample([0, 1, 2, 3, 4, 5], 3).sort((x, y) => x - y);
      const adjs = pickCats.map((i) => r.pick(CAT[i][2]));
      const phrase = (a) => `${an(a[0])} ${a.join(' ')} ${noun}`;
      const right = phrase(adjs);
      const perms = [[1, 0, 2], [0, 2, 1], [2, 1, 0], [2, 0, 1], [1, 2, 0]].map((p) => phrase(p.map((i) => adjs[i])));
      const tpl = r.pick(['{a} found ___ in the attic.', '{a} bought ___ at the market.', 'Grandma gave {a} ___.', 'There is ___ on the shelf.']);
      const s = fill(tpl, cast(r));
      const labels = pickCats.map((i) => `${adjs[pickCats.indexOf(i)]} (${CAT[i][1].en})`);
      const labelsZh = pickCats.map((i) => `${adjs[pickCats.indexOf(i)]}（${CAT[i][1].zh}）`);
      return {
        q: T(`哪一個形容詞順序正確？${s}`, `Which has the adjectives in the right order? ${s}`),
        ans: ansChoice(opts(r, right, perms)),
        sol: [
          T('順序：看法 → 大小 → 新舊 → 形狀 → 顏色 → 材料 → 名詞。', 'The order is opinion → size → age → shape → color → material → noun.'),
          T(`這裡是 ${labelsZh.join(' → ')}。`, `Here: ${labels.join(' → ')}.`),
          T(`正確的句子：${s.replace('___', right)}`, `The sentence: ${s.replace('___', right)}`),
        ],
        hint: T('先找材料（wooden、metal…），它最靠近名詞。', 'Find the material word (wooden, metal…). It goes closest to the noun.'),
      };
    },
  },
  {
    id: 'g4-prep-phrases',
    grade: 4,
    unit: 'grammar',
    name: T('介係詞片語', 'Prepositional phrases'),
    std: 'CCSS L.4.1e',
    lesson: {
      zh: '介係詞片語 = <b>介係詞</b>（under、behind、after、during…）+ 它後面的名詞片語。它告訴我們<b>在哪裡</b>或<b>什麼時候</b>。例如 under the old bridge、after lunch。',
      en: 'A prepositional phrase is a <b>preposition</b> (under, behind, after, during…) plus the noun group that follows it. It tells <b>where</b> or <b>when</b>: under the old bridge, after lunch.',
      ex: ['Leo hid the map <b>behind the bookshelf</b>.', '<b>During recess</b>, we played tag.', 'The cat slept <b>inside the blue bucket</b>.'],
    },
    gen(r) {
      const c = cast(r);
      if (r.chance(0.5)) {
        const verb = r.pick([['hid', true], ['found', true], ['left', true], ['saw', true], ['sat', false], ['waited', false], ['slept', false]]);
        const obj = verb[1] ? ' ' + r.pick(['the keys', 'a note', 'the ball', 'a shiny coin', 'the map', 'a sock']) : '';
        const prep = r.pick(['under', 'behind', 'beside', 'near']);
        const place = r.pick(['the couch', 'the old fence', 'the blue bucket', 'the big tree', 'the kitchen sink', 'the bookshelf', 'the garden shed']);
        const head = `${c.a} ${verb[0]}${obj}`, phrase = `${prep} ${place}`, s = `${head} ${phrase}.`;
        const n0 = words(head).length, n1 = words(phrase).length;
        return {
          q: T('點出介係詞片語的每一個字。', 'Tap every word of the prepositional phrase.'),
          ans: ansTap(words(s), Array.from({ length: n1 }, (_, i) => n0 + i)),
          sol: [T(`介係詞是「${prep}」，片語包括它後面的名詞：${phrase}。`, `The preposition is "${prep}", and the phrase runs to its noun: "${phrase}".`), T('這個片語告訴我們「在哪裡」。', 'The phrase tells where.')],
          hint: T('先找介係詞（under、behind、near…）。', 'Find the preposition first (under, behind, near…).'),
        };
      }
      const phrase = r.pick(['After lunch', 'During recess', 'Before dinner', 'After the long game', 'During the summer', 'Before the first bell']);
      const rest = r.pick(['{a} read a mystery book.', 'we played tag on the grass.', '{a} fed the goldfish.', 'the class cleaned the room.', '{a} practiced the trumpet.']);
      const s = `${phrase}, ${fill(rest, c)}`, n1 = words(phrase).length;
      return {
        q: T('點出介係詞片語的每一個字。', 'Tap every word of the prepositional phrase.'),
        ans: ansTap(words(s), Array.from({ length: n1 }, (_, i) => i)),
        sol: [T(`介係詞是「${words(phrase)[0]}」，片語是：${phrase}。`, `The preposition is "${words(phrase)[0]}", and the phrase is "${phrase}".`), T('這個片語放在句首，告訴我們「什麼時候」，後面加逗號。', 'The phrase opens the sentence and tells when; a comma follows it.')],
        hint: T('找 after、during、before 這類字。', 'Look for a word like after, during or before.'),
      };
    },
  },
  {
    id: 'g4-fragments-runons',
    grade: 4,
    unit: 'sentences',
    name: T('完整句、句子片段、連寫句', 'Fragments and run-ons'),
    std: 'CCSS L.4.1f',
    lesson: {
      zh: '<b>完整句</b>有主詞和動詞，意思完整。<b>句子片段</b>少了主詞或動詞，或只是「Because…」這種半句話。<b>連寫句</b>是兩個完整句黏在一起，中間沒有標點或只用逗號。',
      en: 'A <b>complete sentence</b> has a subject and a verb and a complete thought. A <b>fragment</b> is missing a subject or verb, or is only half a thought ("Because the bus was late."). A <b>run-on</b> joins two sentences with no punctuation or with only a comma.',
      ex: ['Complete: The dog barked.', 'Fragment: Running down the hall.', 'Run-on: The dog barked we woke up.', 'Fixed: The dog barked, so we woke up.'],
    },
    gen(r) {
      const L = { c: T('完整句', 'complete sentence'), f: T('句子片段', 'fragment'), r: T('連寫句', 'run-on') };
      const items = [
        ['{a} packed a lunch for the field trip.', 'c'], ['The puppy chewed on an old shoe.', 'c'], ['After the game, {a} drank a whole bottle of water.', 'c'],
        ['We waited for the bus in the rain.', 'c'], ['The museum was closed, so we went to the zoo.', 'c'], ['{a} laughed.', 'c'], ['Because it was raining, {a} stayed inside.', 'c'],
        ['Because the bus was late.', 'f', 'Because the bus was late, we missed the first bell.'], ['Running down the hall with a backpack.', 'f', '{a} was running down the hall with a backpack.'],
        ['The tall girl with the red umbrella.', 'f', 'The tall girl with the red umbrella waved at us.'], ['After we finished our science project.', 'f', 'After we finished our science project, we cleaned up.'],
        ['Under the bridge near the river.', 'f', 'A family of ducks lives under the bridge near the river.'], ['Jumped into the pool and splashed everyone.', 'f', '{a} jumped into the pool and splashed everyone.'],
        ['When {a} opens the gift.', 'f', 'When {a} opens the gift, everyone will cheer.'],
        ['{g} ran to the bus she almost missed it.', 'r', '{g} ran to the bus. She almost missed it.'], ['The movie was funny we laughed the whole time.', 'r', 'The movie was funny, and we laughed the whole time.'],
        ['I like pizza, my brother likes tacos.', 'r', 'I like pizza, but my brother likes tacos.'], ['The dog barked all night nobody could sleep.', 'r', 'The dog barked all night, so nobody could sleep.'],
        ['It started to snow, we built a snowman.', 'r', 'It started to snow, so we built a snowman.'], ['{a} finished the puzzle {b} took it apart.', 'r', '{a} finished the puzzle. Then {b} took it apart.'],
      ];
      const it = r.pick(items), c = cast(r), s = fill(it[0], c), k = it[1];
      const why = k === 'c' ? T('它有主詞和動詞，而且意思完整，可以單獨成立。', 'It has a subject and a verb and expresses a complete thought.')
        : k === 'f' ? T('它缺少主詞或動詞，或是一個沒說完的半句話，不能單獨成立。', 'It is missing a subject or a verb, or it is an unfinished thought, so it cannot stand alone.')
        : T('它把兩個完整句黏在一起，中間沒有句號或連接詞。', 'It joins two complete sentences without a period or a joining word.');
      return {
        q: T('這是完整句、句子片段，還是連寫句？', 'Is this a complete sentence, a fragment, or a run-on?'),
        text: s,
        ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
        sol: [why, k === 'c' ? T('所以它是完整句。', 'So it is a complete sentence.') : T(`可以改成：${fill(it[2], c)}`, `One way to fix it: ${fill(it[2], c)}`)],
      };
    },
  },
  {
    id: 'g4-confused-words',
    grade: 4,
    unit: 'mechanics',
    name: T('容易混淆的字', 'Commonly confused words'),
    std: 'CCSS L.4.1g',
    lesson: {
      zh: '這些字發音一樣，意思不同：<b>to</b>（到、去）/<b>too</b>（也、太）/<b>two</b>（二）；<b>there</b>（那裡）/<b>their</b>（他們的）/<b>they\'re</b>（= they are）；<b>your</b>（你的）/<b>you\'re</b>（= you are）；<b>its</b>（它的）/<b>it\'s</b>（= it is）。',
      en: 'These words sound alike but mean different things: <b>to</b> (toward) / <b>too</b> (also, very) / <b>two</b> (2); <b>there</b> (a place) / <b>their</b> (belongs to them) / <b>they\'re</b> (they are); <b>your</b> (belongs to you) / <b>you\'re</b> (you are); <b>its</b> (belongs to it) / <b>it\'s</b> (it is).',
      ex: ["<b>They're</b> putting <b>their</b> bags over <b>there</b>.", "<b>It's</b> wagging <b>its</b> tail.", "<b>You're</b> holding <b>your</b> hat."],
    },
    gen(r) {
      const items = [
        '{a} wants [too|to] visit the zoo.', 'We have [to|two] dogs and a cat.', '{a} ate [to|too] much candy at the party.', 'We need [too|two] more chairs.', '{a} is coming [to|too], so save a seat.',
        'The kids left [there|their] bikes by the gate.', '[Their|There] is a spider on the wall!', "[There|They're] going to the beach tomorrow.", "I can't wait to see [they're|their] new puppy.", 'Put the boxes over [their|there], please.',
        'Is that [you\'re|your] jacket on the chair?', "[Your|You're] the fastest runner in our class.", "{a} said [your|you're] invited to the party.", 'Please hang up [you\'re|your] coat.',
        "The dog wagged [it's|its] tail.", "[Its|It's] raining, so bring a coat.", "The cat licked [it's|its] paw.", "[Its|It's] time for lunch.",
      ];
      const rule = {
        to: T('to 表示「到、去」或放在動詞前面（to visit）。', '"to" means toward, or comes before a verb (to visit).'),
        too: T('too 表示「也」或「太」。', '"too" means also, or more than enough.'),
        two: T('two 是數字 2。', '"two" is the number 2.'),
        there: T('there 表示「那裡」，也用在 There is…。', '"there" means in that place, and it starts "There is…".'),
        their: T('their 表示「他們的」。', '"their" means belonging to them.'),
        "they're": T("they're = they are（他們是）。", '"they\'re" = they are.'),
        your: T('your 表示「你的」。', '"your" means belonging to you.'),
        "you're": T("you're = you are（你是）。", '"you\'re" = you are.'),
        its: T('its 表示「它的」，沒有撇號。', '"its" means belonging to it. No apostrophe.'),
        "it's": T("it's = it is（它是）。", '"it\'s" = it is.'),
      };
      const m = marked(fill(r.pick(items), cast(r))), key = m.right.toLowerCase();
      return {
        q: T('點出用錯的字。', 'Tap the word that is wrong.'),
        ans: ansTap(m.ws, m.idx),
        sol: [rule[key], T(`「${m.wrong}」要改成「${m.right}」：${m.good}`, `Change "${m.wrong}" to "${m.right}": ${m.good}`)],
        hint: T("試著把 it's 換成 it is、they're 換成 they are 讀讀看。", "Try reading it's as it is and they're as they are."),
      };
    },
  },
  {
    id: 'g4-comma-compound',
    grade: 4,
    unit: 'mechanics',
    name: T('合句中連接詞前的逗號', 'Comma before and, but, or, so'),
    std: 'CCSS L.4.2c',
    lesson: {
      zh: '兩個完整句用 <b>and、but、or、so</b> 連成一句時，要在連接詞<b>前面</b>加逗號。只用逗號而沒有連接詞是錯的（逗號拼接）。',
      en: 'When <b>and, but, or, so</b> join two complete sentences, put a comma <b>before</b> the joining word. A comma alone, with no joining word, is a mistake (a comma splice).',
      ex: ['Mia wanted to swim<b>,</b> but the pool was closed.', 'We can walk<b>,</b> or we can take the bus.'],
    },
    gen(r) {
      const items = [
        ['{a} wanted to play outside', 'but', 'it was raining'], ['{g} studied hard for the test', 'so', 'she earned an A'], ['We can go to the park', 'or', 'we can stay home and read'],
        ['{a} fed the cat', 'and', '{b} walked the dog'], ['The movie was long', 'but', 'everyone loved it'], ['{m} forgot his umbrella', 'so', 'his shoes got soaked'],
        ['The store was closed', 'so', 'we went home'], ['{a} likes math', 'but', '{b} likes art'], ['You can ride your bike', 'or', 'you can take the bus'], ['The sun came out', 'and', 'the snow began to melt'],
      ];
      const [a0, cj, b0] = r.pick(items), c = cast(r), A = fill(a0, c), B = fill(b0, c);
      const right = `${A}, ${cj} ${B}.`;
      return {
        q: T('哪一句的逗號用對了？', 'Which sentence uses the comma correctly?'),
        ans: ansChoice([right, `${A} ${cj} ${B}.`, `${A} ${cj}, ${B}.`, `${A}, ${B}.`]),
        sol: [
          T(`「${A}」和「${B}」都是完整句，用「${cj}」連接，所以逗號放在 ${cj} 前面。`, `"${A}" and "${B}" are both complete sentences joined by "${cj}", so the comma goes before "${cj}".`),
          T(`正確：${right}`, `Correct: ${right}`),
        ],
      };
    },
  },
  {
    id: 'g4-dialogue',
    grade: 4,
    unit: 'mechanics',
    name: T('對話的引號和逗號', 'Punctuating dialogue'),
    std: 'CCSS L.4.2b',
    lesson: {
      zh: '說的話放在引號 " " 裡面。說話者在後面時：<b>"I am ready," Mia said.</b>（逗號在引號裡面）。說話者在前面時：<b>Mia said, "I am ready."</b>（逗號在引號前，句號在引號裡面）。問句的問號也放在引號裡面，引號裡第一個字大寫。',
      en: 'Spoken words go inside quotation marks. Speaker after: <b>"I am ready," Mia said.</b> (the comma is inside the quotes). Speaker first: <b>Mia said, "I am ready."</b> (comma before the quotes, period inside). A question mark also goes inside, and the quote starts with a capital.',
      ex: ['"We won the game," Leo said.', 'Ava asked, "Where is my hat?"', '"Can I help?" Sam asked.'],
    },
    gen(r) {
      const c = cast(r), n = c.a, ask = r.chance(0.4);
      const Q = ask ? r.pick(['Can I have a turn', 'Where is my backpack', 'Who ate the last cookie', 'Are we there yet', 'May I sit here']) : r.pick(['I found my lost shoe', 'The pizza is here', 'We won the game', 'It is my turn to pick a movie', 'This puzzle is really hard', 'My tooth is loose']);
      const v = ask ? r.pick(['asked', 'wondered']) : r.pick(['said', 'explained', 'announced', 'whispered']);
      let right, wrongs, rule;
      if (r.chance(0.5)) {
        if (ask) { right = `"${Q}?" ${n} ${v}.`; wrongs = [`"${Q}?," ${n} ${v}.`, `"${Q}"? ${n} ${v}.`, `"${Q}." ${n} ${v}.`]; }
        else { right = `"${Q}," ${n} ${v}.`; wrongs = [`"${Q}." ${n} ${v}.`, `"${Q}", ${n} ${v}.`, `${Q}, ${n} ${v}.`]; }
        rule = T('說話者在後面：引號裡的話用逗號（問句用問號）結束，標點要放在引號<b>裡面</b>。', 'Speaker after the quote: end the spoken words with a comma (or a question mark) <b>inside</b> the quotation marks.');
      } else {
        const lq = low(Q);
        if (ask) { right = `${n} ${v}, "${Q}?"`; wrongs = [`${n} ${v}, "${Q}"?`, `${n} ${v} "${Q}?"`, `${n} ${v}, "${lq}?"`]; }
        else { right = `${n} ${v}, "${Q}."`; wrongs = [`${n} ${v} "${Q}."`, `${n} ${v}, "${Q}".`, `${n} ${v}, "${lq}."`]; }
        rule = T('說話者在前面：說話動詞後加逗號，引號裡第一個字大寫，結尾標點放在引號<b>裡面</b>。', 'Speaker first: put a comma after the speaking verb, start the quote with a capital, and put the end mark <b>inside</b> the quotation marks.');
      }
      return {
        q: T('哪一句的對話標點正確？', 'Which sentence punctuates the dialogue correctly?'),
        ans: ansChoice([right, ...wrongs]),
        sol: [rule, T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g4-precise-words',
    grade: 4,
    unit: 'style',
    name: T('用詞要精準', 'Precise word choice'),
    std: 'CCSS L.4.3a',
    lesson: {
      zh: '好作家會選<b>最精準</b>的字，讓讀者看到畫面。不要只寫 said、went、ate、good、big，想想看：是怎麼說？怎麼走？例如 whispered、trudged、gobbled、delicious、towering。',
      en: 'Strong writers pick the <b>most precise</b> word so readers can picture the scene. Instead of said, went, ate, good or big, ask: how? Try whispered, trudged, gobbled, delicious, towering.',
      ex: ['The hungry puppy <b>gobbled</b> its food. (not "ate")', 'The tired hikers <b>trudged</b> uphill. (not "went")'],
    },
    gen(r) {
      const items = [
        ['The library was silent, so {a} ___ the answer to {b}.', 'whispered', ['shouted', 'announced', 'screamed'], T('圖書館很安靜，所以要「小聲說」。', 'The library is silent, so the word must mean speaking very softly.')],
        ['The starving puppy ___ its food in five seconds.', 'gobbled', ['nibbled', 'sipped', 'tasted'], T('很餓又只花五秒，是「狼吞虎嚥」。', 'Starving and only five seconds means eating fast and greedily.')],
        ['The tired hikers ___ up the last steep hill, one slow step at a time.', 'trudged', ['raced', 'skipped', 'dashed'], T('很累、一步一步慢慢走，是「拖著腳步走」。', 'Tired and slow, one step at a time, means walking heavily.')],
        ['{a} ___ at the tiny ant through a magnifying glass.', 'peered', ['winked', 'yawned', 'frowned'], T('用放大鏡仔細看，是「凝視、仔細瞧」。', 'Using a magnifying glass means looking closely and carefully.')],
        ['The frightened kitten ___ under the bed and would not come out.', 'cowered', ['strutted', 'pranced', 'marched'], T('害怕地躲起來，是「縮成一團」。', 'A frightened kitten hiding means crouching in fear.')],
        ['The happy kids ___ down the sidewalk, singing a song.', 'skipped', ['limped', 'trudged', 'crawled'], T('開心又唱歌，是「蹦蹦跳跳地走」。', 'Happy and singing means moving with light, bouncy steps.')],
        ['The sprinter ___ across the finish line to win the race.', 'dashed', ['strolled', 'wandered', 'tiptoed'], T('短跑選手要贏，是「衝刺」。', 'A sprinter winning a race moves very fast.')],
        ['The soup was so ___ that {a} asked for a second bowl.', 'delicious', ['bland', 'nice', 'cold'], T('想再要一碗，表示「非常好吃」；nice 太模糊。', 'Asking for more means it tasted great; "nice" is too vague.')],
        ['The ___ giant could see over the tallest trees.', 'towering', ['tiny', 'big', 'short'], T('看得到最高的樹上面，是「高聳的」；big 太模糊。', 'Seeing over the tallest trees means extremely tall; "big" is too vague.')],
        ['After running three races, {a} was ___ and fell asleep on the bus.', 'exhausted', ['energetic', 'bored', 'curious'], T('跑完三場又睡著，是「筋疲力盡」。', 'After three races and falling asleep, the word must mean extremely tired.')],
        ['The baby ___ with joy when she saw the bubbles.', 'squealed', ['grumbled', 'sighed', 'muttered'], T('開心地叫，是「高興地尖叫」。', 'Making a sound with joy means a high, happy cry.')],
        ['{a} ___ the heavy box across the floor because it was too heavy to lift.', 'dragged', ['tossed', 'carried', 'flipped'], T('太重抬不起來，只能在地上「拖」。', 'Too heavy to lift means pulling it along the floor.')],
      ];
      const [s0, right, wrongs, why] = r.pick(items), c = cast(r), s = fill(s0, c);
      return {
        q: T(`選出最精準、最合適的字：${s}`, `Choose the most precise word: ${s}`),
        ans: ansChoice([right, ...wrongs]),
        sol: [why, T(`最好的句子：${s.replace('___', right)}`, `Best: ${s.replace('___', right)}`)],
        hint: T('找句子裡的線索字（silent、tired、happy…）。', 'Look for clue words in the sentence (silent, tired, happy…).'),
      };
    },
  },
  {
    id: 'g4-simile-metaphor',
    grade: 4,
    unit: 'style',
    name: T('明喻和暗喻', 'Similes and metaphors'),
    std: 'CCSS L.4.5a',
    lesson: {
      zh: '<b>明喻</b>（simile）用 <b>like</b> 或 <b>as</b> 比較兩種不同的東西：as quick as a cheetah。<b>暗喻</b>（metaphor）直接說一個東西「是」另一個東西：The classroom was a zoo. 普通的比較（taller than her brother）不是比喻。',
      en: 'A <b>simile</b> compares two different things using <b>like</b> or <b>as</b>: as quick as a cheetah. A <b>metaphor</b> says one thing <b>is</b> another: The classroom was a zoo. A plain comparison (taller than her brother) is not figurative language.',
      ex: ['Simile: The stars sparkled <b>like</b> diamonds.', 'Metaphor: The stars <b>were</b> diamonds in the sky.', 'Literal: Mia is taller than Leo.'],
    },
    gen(r) {
      const L = { s: T('明喻', 'simile'), m: T('暗喻', 'metaphor'), l: T('都不是（字面意思）', 'neither (literal)') };
      const items = [
        ['{a} is as quick as a cheetah.', 's'], ['The snow was like a soft white blanket.', 's'], ['The baby slept like a log.', 's'], ["{a}'s voice was as sweet as honey.", 's'], ['The stars sparkled like diamonds.', 's'], ['After the rain, the lake was as smooth as glass.', 's'],
        ['{a} is a walking dictionary.', 'm'], ['The snow was a soft white blanket on the hills.', 'm'], ['My brother is a couch potato on weekends.', 'm'], ['The classroom was a zoo after lunch.', 'm'], ['Her smile was sunshine on a gray day.', 'm'], ['The stars were diamonds in the night sky.', 'm'],
        ['{g} runs faster than her cousin.', 'l'], ['{a} likes apples as much as pears.', 'l'], ['The snow covered all the cars on our street.', 'l'], ['{a} is taller than {b}.', 'l'], ['The baby slept for three hours.', 'l'],
      ];
      const [s0, k] = r.pick(items), s = fill(s0, cast(r));
      const why = k === 's' ? T('它用 like 或 as 比較兩種不同的東西，是明喻。', 'It compares two different things using "like" or "as", so it is a simile.')
        : k === 'm' ? T('它直接說一個東西「是」另一個不同的東西（沒有 like 或 as），是暗喻。', 'It says one thing IS a different thing, with no "like" or "as", so it is a metaphor.')
        : T('它只是用字面意思描述或比較同類的東西，沒有比喻。', 'It describes or compares things literally; nothing is compared to something of a different kind.');
      return {
        q: T('這句話是明喻、暗喻，還是都不是？', 'Is this a simile, a metaphor, or neither?'),
        text: s,
        ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
        sol: [why, T('記住：明喻有 like/as，暗喻說「是」，而且都在比較兩種不同的東西。', 'Remember: a simile uses like/as, a metaphor says "is", and both compare two different kinds of things.')],
      };
    },
  },
  {
    id: 'g4-idioms',
    grade: 4,
    unit: 'words',
    name: T('慣用語', 'Idioms'),
    std: 'CCSS L.4.5b',
    lesson: {
      zh: '<b>慣用語</b>的意思不能從字面猜。It\'s raining cats and dogs 不是天上掉貓狗，而是「雨下得很大」。看上下文猜猜作者真正的意思。',
      en: 'An <b>idiom</b> means something different from its words. "It\'s raining cats and dogs" does not mean pets are falling; it means it is raining very hard. Use the context to find the real meaning.',
      ex: ['The test was <b>a piece of cake</b>. = very easy', 'I feel <b>under the weather</b>. = a little sick'],
    },
    gen(r) {
      const items = [
        ["It's raining cats and dogs, so bring your umbrella!", T('雨下得很大', 'it is raining very hard'), T('貓和狗從天上掉下來', 'cats and dogs are falling from the sky')],
        ['Break a leg in the play tonight, {a}!', T('祝你好運', 'good luck'), T('小心把腳摔斷', 'be careful not to hurt your leg')],
        ['This math test was a piece of cake.', T('非常簡單', 'very easy'), T('考卷上有蛋糕', 'there was cake on the test')],
        ['{a} let the cat out of the bag about the surprise party.', T('說出了秘密', 'told a secret'), T('把貓從袋子裡放出來', 'opened a bag with a cat in it')],
        ["I'm feeling under the weather today, so I'll stay home.", T('有點不舒服', 'a little sick'), T('站在雲的下面', 'standing under the clouds')],
        ['Hold your horses! We need to wait for {a}.', T('等一下、別急', 'wait and slow down'), T('抓住你的馬', 'hold on to your horses')],
        ['{a} hit the books all weekend before the big test.', T('用功讀書', 'studied hard'), T('用手打書本', 'hit books with a hand')],
        ['{g} had butterflies in her stomach before the concert.', T('很緊張', 'felt nervous'), T('吃了蝴蝶', 'ate some butterflies')],
        ['That new bike cost an arm and a leg.', T('非常貴', 'was very expensive'), T('要用手和腳去換', 'was paid for with an arm and a leg')],
        ['{a} was on cloud nine after winning the contest.', T('非常開心', 'very happy'), T('坐在第九朵雲上', 'sitting on a cloud')],
        ["We've worked for hours. Let's call it a day.", T('今天先到這裡、停止工作', 'stop working for now'), T('打電話給今天', 'phone the day')],
        ['{a} and {b} do not see eye to eye about which movie to watch.', T('意見不同', 'disagree'), T('不看對方的眼睛', 'do not look at each other')],
      ];
      const i = r.int(0, items.length - 1), [s0, right, literal] = items[i], c = cast(r), s = fill(s0, c);
      const others = items.filter((_, j) => j !== i).map((x) => x[1]);
      return {
        q: T('這句話中的慣用語是什麼意思？', 'What does the idiom in this sentence mean?'),
        text: s,
        ans: ansChoice([right, literal, ...r.sample(others, 2)]),
        sol: [T(`這是慣用語，不能照字面解釋（不是「${literal.zh}」）。`, `This is an idiom, so it does not mean what the words say ("${literal.en}").`), T(`它的意思是：${right.zh}。`, `It means: ${right.en}.`)],
      };
    },
  },
  {
    id: 'g4-roots',
    grade: 4,
    unit: 'words',
    name: T('希臘和拉丁字根', 'Greek and Latin roots'),
    std: 'CCSS L.4.4b',
    lesson: {
      zh: '很多英文字由希臘或拉丁<b>字根</b>組成。認識字根就能猜生字：<b>tele</b>＝遠，<b>photo</b>＝光，<b>graph</b>＝寫，<b>aud</b>＝聽，<b>vis</b>＝看，<b>port</b>＝攜帶，<b>bio</b>＝生命，<b>geo</b>＝地球，<b>therm</b>＝熱，<b>micro</b>＝小。',
      en: 'Many English words are built from Greek and Latin <b>roots</b>. Knowing a root helps you guess a new word: <b>tele</b> = far, <b>photo</b> = light, <b>graph</b> = write, <b>aud</b> = hear, <b>vis</b> = see, <b>port</b> = carry, <b>bio</b> = life, <b>geo</b> = earth, <b>therm</b> = heat, <b>micro</b> = small.',
      ex: ['<b>tele</b>scope: a tool to see things far away', '<b>aud</b>ience: people who hear a show', '<b>micro</b>scope: a tool to see small things'],
    },
    gen(r) {
      const R = [
        ['tele', T('遠', 'far'), ['telephone', 'television', 'telescope']], ['photo', T('光', 'light'), ['photograph', 'photocopy', 'photosynthesis']],
        ['graph', T('寫、畫', 'write or draw'), ['paragraph', 'graphic', 'biography']], ['aud', T('聽', 'hear'), ['audio', 'audience', 'auditorium']],
        ['vis', T('看', 'see'), ['vision', 'visible', 'invisible']], ['port', T('攜帶', 'carry'), ['transport', 'portable', 'export']],
        ['rupt', T('破裂', 'break'), ['erupt', 'interrupt', 'rupture']], ['dict', T('說', 'say'), ['predict', 'dictate', 'dictionary']],
        ['struct', T('建造', 'build'), ['construct', 'structure', 'instruct']],
        ['bio', T('生命', 'life'), ['biology', 'biome', 'antibiotic']], ['geo', T('地球、土地', 'earth'), ['geography', 'geology', 'geode']],
        ['therm', T('熱', 'heat'), ['thermometer', 'thermos', 'thermal']], ['micro', T('小', 'small'), ['microscope', 'microchip', 'microwave']],
        ['phon', T('聲音', 'sound'), ['phonics', 'symphony', 'headphones']],
      ];
      const i = r.int(0, R.length - 1), [root, mean, ex] = R[i];
      if (r.chance(0.5)) {
        const ws = r.sample(ex, 2);
        return {
          q: T(`「${ws[0]}」和「${ws[1]}」都有字根「${root}」。這個字根是什麼意思？`, `"${ws[0]}" and "${ws[1]}" share the root "${root}". What does "${root}" mean?`),
          ans: ansChoice(opts(r, mean, R.filter((_, j) => j !== i).map((x) => x[1]))),
          sol: [T(`字根「${root}」的意思是「${mean.zh}」。`, `The root "${root}" means "${mean.en}".`), T(`例如 ${ex.join('、')} 都和「${mean.zh}」有關。`, `For example, ${ex.join(', ')} are all about "${mean.en}".`)],
        };
      }
      const w = r.pick(ex), others = R.filter((_, j) => j !== i).map((x) => r.pick(x[2])).filter((x) => !x.includes(root));
      return {
        q: T(`哪一個字含有意思是「${mean.zh}」的字根？`, `Which word has a root that means "${mean.en}"?`),
        ans: ansChoice(opts(r, w, others)),
        sol: [T(`「${w}」裡有字根「${root}」，意思是「${mean.zh}」。`, `"${w}" contains the root "${root}", which means "${mean.en}".`), T('其他選項的字根意思不同。', 'The other words are built from roots with different meanings.')],
      };
    },
  },
  {
    id: 'g4-paragraph-order',
    grade: 4,
    unit: 'organization',
    name: T('段落的順序', 'Putting a paragraph in order'),
    std: 'CCSS W.4.3c',
    lesson: {
      zh: '一個段落通常是：<b>主題句</b>（說明這段要講什麼）→ 按照<b>時間順序</b>的細節 → <b>結尾句</b>。用轉折詞找順序：First、Next、Then、After that、Finally。',
      en: 'A paragraph usually goes: <b>topic sentence</b> (what it is about) → details in <b>time order</b> → a <b>closing sentence</b>. Signal words show the order: First, Next, Then, After that, Finally.',
      ex: ['Making a sandwich is easy.', '<b>First</b>, spread butter on the bread.', '<b>Next</b>, add cheese and lettuce.', '<b>Finally</b>, cut it in half and enjoy!'],
    },
    gen(r) {
      const items = [
        ['Planting a seed is easy if you follow a few steps.', 'First, fill a small pot with soil.', 'Next, push the seed into the soil with your finger.', 'Then, water it gently every day.', 'In a week or two, a tiny green sprout will appear.'],
        ['{g} woke up early on the morning of the big race.', 'First, she ate a healthy breakfast of eggs and toast.', 'After breakfast, she stretched her legs in the backyard.', 'When the race began, she ran as fast as she could.', 'At the end of the day, she smiled at the shiny medal around her neck.'],
        ['Making pancakes with {a} is my favorite Sunday job.', 'First, we mix flour, eggs, and milk in a big bowl.', 'Next, we pour a little batter into a hot pan.', 'When bubbles appear, we flip the pancake over.', 'Finally, we stack the pancakes and pour syrup on top.'],
        ['A butterfly goes through four stages in its life.', 'It begins as a tiny egg on a leaf.', 'Then the egg hatches into a hungry caterpillar.', 'Later, the caterpillar forms a hard case called a chrysalis.', 'At last, a butterfly crawls out and spreads its wings.'],
        ['Our class field trip to the aquarium was full of surprises.', 'When we arrived, a guide gave each of us a map.', 'Our first stop was the shark tunnel, where a shark swam over our heads.', 'After lunch, we touched a starfish in the touch pool.', 'By the time the bus left, everyone wanted to come back.'],
        ['Washing a muddy dog takes teamwork.', 'First, {a} fills the tub with warm water.', 'Next, {b} lifts the dog into the tub.', 'Then, they scrub the fur with dog shampoo.', 'Finally, they wrap the dog in a towel before it can shake.'],
        ['{m} and his dad built a snowman after the storm.', 'First, they rolled a big snowball for the bottom.', 'Next, they stacked a smaller ball on top for the body.', 'Then, they added a head and two rocks for eyes.', 'Last of all, {m} wrapped his own scarf around the snowman\'s neck.'],
      ];
      const c = cast(r), it = r.pick(items).map((s) => fill(s, c));
      return {
        q: T('把句子排成正確的段落順序。', 'Put the sentences in the right order to make a paragraph.'),
        ans: ansOrder(it),
        sol: [T('第一句是主題句，告訴讀者這段在講什麼。', 'The first sentence is the topic sentence; it tells what the paragraph is about.'), T('接著用時間順序和轉折詞（First、Next、Then、Finally）排好細節。', 'Then the details follow time order, using signal words like First, Next, Then and Finally.'), T(`最後一句：${it[it.length - 1]}`, `The last sentence: ${it[it.length - 1]}`)],
        hint: T('先找「總說」的那一句，再找 First。', 'Find the sentence that tells the big idea, then look for "First".'),
      };
    },
  },
  {
    id: 'g4-topic-sentence',
    grade: 4,
    unit: 'paragraphs',
    name: T('主題句和支持細節', 'Topic sentence and supporting details'),
    std: 'CCSS W.4.2a',
    lesson: {
      zh: '<b>主題句</b>說出整段的主要想法；<b>支持細節</b>都要說明、證明這個想法。和主題無關的句子要刪掉。主題句不能太窄（只是一個細節），也不能離題。',
      en: 'The <b>topic sentence</b> states the main idea of a paragraph; every <b>supporting detail</b> explains or proves it. A sentence that does not fit the topic should be cut. A topic sentence should not be too narrow (just one detail) or off topic.',
      ex: ['Topic: Dogs make wonderful pets.', 'Detail: They are loyal to their owners.', 'Detail: They love to play fetch.', 'Does not belong: Goldfish need clean water.'],
    },
    gen(r) {
      const items = [
        ['Dogs make wonderful pets for many reasons.', ['They are loyal to their owners.', 'They love to play games like fetch.', 'Many dogs can even learn to help people who cannot see.'], ['Cats sleep for most of the day.', 'Some dogs have long, fluffy fur.'], 'Goldfish need clean water to stay healthy.'],
        ['Autumn is a busy time on a farm.', ['Farmers pick apples and pumpkins before the first frost.', 'They cut and store hay for the animals.', 'Many farms open corn mazes for visitors.'], ['Snow covers the fields in winter.', 'Pumpkins can be orange or white.'], 'Some people go to the beach in July.'],
        ['Bees are very important to people.', ['They carry pollen that helps fruits and vegetables grow.', 'They make honey that we can eat.', 'They make beeswax for candles and crayons.'], ['Some bees are black and yellow.', 'Butterflies have colorful wings.'], 'Ladybugs have black spots on their backs.'],
        ['Our school library is the best place to spend a rainy recess.', ['It has soft beanbags to sit on.', 'The shelves are full of new comic books.', 'The librarian lets us play quiet board games.'], ['The library has twelve windows.', 'Our gym is very large.'], 'The cafeteria serves pizza on Fridays.'],
        ['A healthy breakfast helps you have a good day.', ['Eggs and yogurt give you protein for strong muscles.', 'Fruit gives you vitamins and energy.', 'Eating in the morning helps you focus in class.'], ['Eggs come from chickens.', 'Dinner is my favorite meal.'], 'My favorite TV show starts at seven.'],
        ['Camping teaches kids useful skills.', ['Campers learn how to set up a tent.', 'They learn to cook simple meals over a fire.', 'They learn to read a map and follow a trail.'], ['Tents come in many colors.', 'Some people like to stay in hotels.'], 'My cousin has a pet hamster.'],
      ];
      const [topic, det, badTopics, off] = r.pick(items);
      if (r.chance(0.5)) {
        return {
          q: T('這些細節最適合搭配哪一個主題句？', 'Which topic sentence fits these details best?'),
          text: det.join(' '),
          ans: ansChoice([topic, ...badTopics]),
          sol: [T('主題句要能「包住」所有細節，說出整段的主要想法。', 'A topic sentence must cover all the details and state the main idea.'), T(`最好的主題句：${topic}`, `The best topic sentence: ${topic}`), T('其他選項太窄（只是一個細節）或離題了。', 'The other choices are too narrow (just one detail) or off topic.')],
        };
      }
      const pos = r.int(1, 3), para = [topic, ...det.slice(0, pos), off, ...det.slice(pos)];
      return {
        q: T('哪一句和這段的主題無關，應該刪掉？', 'Which sentence does not belong in this paragraph?'),
        text: para.join(' '),
        ans: ansChoice([off, ...r.sample(det, 2), topic]),
        sol: [T(`主題句是：${topic}`, `The topic sentence is: ${topic}`), T(`「${off}」和這個主題無關，所以要刪掉。`, `"${off}" does not support the topic, so it should be cut.`)],
      };
    },
  },

  // ======================= GRADE 5 =======================
  {
    id: 'g5-conj-prep-interj',
    grade: 5,
    unit: 'grammar',
    name: T('連接詞、介係詞、感嘆詞', 'Conjunctions, prepositions, interjections'),
    std: 'CCSS L.5.1a',
    lesson: {
      zh: '<b>連接詞</b>連接字或句子（and、but、or、so、because、although）。<b>介係詞</b>後面接名詞，說明位置、時間或關係（under、across、during、from）。<b>感嘆詞</b>表達突然的情緒，常接驚嘆號或逗號（Wow!、Oops,）。',
      en: 'A <b>conjunction</b> joins words or clauses (and, but, or, so, because, although). A <b>preposition</b> comes before a noun and shows place, time or relationship (under, across, during, from). An <b>interjection</b> shows sudden feeling and is followed by ! or a comma (Wow!, Oops,).',
      ex: ['We ran <b>because</b> it rained. (conjunction)', 'The cat hid <b>under</b> the bed. (preposition)', '<b>Yikes!</b> A spider! (interjection)'],
    },
    gen(r) {
      const L = { c: T('連接詞', 'conjunction'), p: T('介係詞', 'preposition'), i: T('感嘆詞', 'interjection') };
      const items = [
        ['{a} wanted to go, <b>but</b> it was too late.', 'c'], ['We can eat pizza <b>or</b> tacos for dinner.', 'c'], ['{a} stayed inside <b>because</b> it was cold.', 'c'],
        ['<b>Although</b> the test was hard, {a} did well.', 'c'], ['We left early <b>so</b> we would not miss the bus.', 'c'], ['{a} <b>and</b> {b} built a robot.', 'c'],
        ['The cat slept <b>under</b> the table.', 'p'], ['{a} walked <b>across</b> the bridge.', 'p'], ['Nobody talked <b>during</b> the movie.', 'p'],
        ['The note is <b>inside</b> the envelope.', 'p'], ['This gift is <b>from</b> Grandma.', 'p'], ['<b>After</b> lunch, {a} played chess.', 'p'], ['{a} sat <b>between</b> {b} and me.', 'p'],
        ['<b>Wow!</b> That rocket is huge.', 'i'], ['<b>Oops,</b> I dropped my pencil.', 'i'], ['<b>Hooray!</b> We won the game!', 'i'], ['<b>Ouch!</b> I stubbed my toe.', 'i'], ['<b>Yikes!</b> A spider is on my desk!', 'i'], ['<b>Well,</b> I think we should go home.', 'i'],
      ];
      const [s0, k] = r.pick(items), s = fill(s0, cast(r)), w = strip(s.match(/<b>(.*?)<\/b>/)[1]).replace(/[!,]/g, '');
      const why = k === 'c' ? T(`「${w}」連接兩個字或兩個句子，是連接詞。`, `"${w}" joins words or clauses, so it is a conjunction.`)
        : k === 'p' ? T(`「${w}」後面接名詞，說明位置、時間或關係，是介係詞。`, `"${w}" comes before a noun and shows place, time or relationship, so it is a preposition.`)
        : T(`「${w}」表達突然的情緒，後面接驚嘆號或逗號，是感嘆詞。`, `"${w}" shows a sudden feeling and is followed by ! or a comma, so it is an interjection.`);
      return {
        q: T(`粗體字是哪一種詞？${s}`, `What part of speech is the bold word? ${s}`),
        ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
        sol: [why, T('小技巧：介係詞後面是名詞（after lunch），連接詞後面通常是完整的句子或另一個字。', 'Tip: a preposition is followed by a noun (after lunch); a conjunction joins clauses or words.')],
      };
    },
  },
  {
    id: 'g5-perfect-tenses',
    grade: 5,
    unit: 'grammar',
    name: T('完成式：過去、現在、未來', 'Perfect tenses'),
    std: 'CCSS L.5.1b',
    lesson: {
      zh: '完成式 = have/has/had/will have + 過去分詞，表示某件事在某個時間點「已經完成」。<b>過去完成式 had</b>：在過去某事之前已完成；<b>現在完成式 has/have</b>：到現在已完成；<b>未來完成式 will have</b>：在未來某時間之前會完成。',
      en: 'Perfect tenses use have/has/had/will have + a past participle to show an action finished before a certain time. <b>Past perfect (had)</b>: done before another past event. <b>Present perfect (has/have)</b>: done by now. <b>Future perfect (will have)</b>: will be done by a future time.',
      ex: ['By the time the bus came, Mia <b>had eaten</b> lunch.', 'Mia <b>has eaten</b> lunch, so now she can play.', 'By noon tomorrow, Mia <b>will have eaten</b> lunch.'],
    },
    gen(r) {
      const acts = [['finished', 'the puzzle'], ['eaten', 'lunch'], ['written', 'the report'], ['read', 'the whole book'], ['cleaned', 'the garage'], ['built', 'the treehouse'], ['packed', 'the suitcase'], ['painted', 'the fence']];
      const [pp, obj] = r.pick(acts), c = cast(r), two = r.chance(0.35), subj = two ? `${c.a} and ${c.b}` : c.a, has = two ? 'have' : 'has';
      const t = r.pick(['past', 'present', 'future']);
      let s;
      const F = { past: `had ${pp}`, present: `${has} ${pp}`, future: `will have ${pp}` };
      if (t === 'past') s = `${r.pick(['By the time the bus arrived,', 'Before the storm started,', 'By the time Mom got home,'])} ${subj} ___ ${obj}.`;
      else if (t === 'present') s = `${subj} ___ ${obj}, so now it is time for a break.`;
      else s = `${r.pick(['By next Friday,', 'By the time you wake up tomorrow,', 'By the end of next week,'])} ${subj} ___ ${obj}.`;
      const agree = t === 'present' ? `${two ? 'has' : 'have'} ${pp}` : `will had ${pp}`;
      const name = { past: T('過去完成式 had', 'past perfect (had)'), present: T(`現在完成式 ${has}`, `present perfect (${has})`), future: T('未來完成式 will have', 'future perfect (will have)') }[t];
      const clue = { past: T('句子說的是過去另一件事發生「之前」就完成了。', 'The action was finished before another event in the past.'), present: T('動作已經完成，而且和「現在」有關（so now…）。', 'The action is finished and connects to now ("so now…").'), future: T('動作會在未來某個時間「之前」完成（By next…）。', 'The action will be finished before a time in the future ("By next…").') }[t];
      return {
        q: T(`選出正確的動詞：${s}`, `Choose the right verb: ${s}`),
        ans: ansChoice([F[t], ...Object.keys(F).filter((x) => x !== t).map((x) => F[x]), agree].filter((x, i, a) => a.indexOf(x) === i)),
        sol: [clue, T(`所以用${name.zh}：${s.replace('___', F[t])}`, `So use the ${name.en}: ${s.replace('___', F[t])}`)],
      };
    },
  },
  {
    id: 'g5-tense-shift',
    grade: 5,
    unit: 'grammar',
    name: T('不當的時態轉換', 'Inappropriate tense shifts'),
    std: 'CCSS L.5.1d',
    lesson: {
      zh: '同一件事要用<b>同一個時態</b>。如果故事發生在過去，所有動詞都用過去式；說習慣（Every day…）就都用現在式。不要句子寫到一半突然換時態。',
      en: 'Keep the <b>same tense</b> when you tell about the same time. If a story happened in the past, keep the verbs in the past; for habits (Every day…), keep them in the present. Do not switch tense in the middle.',
      ex: ['✗ Yesterday Mia baked cookies and <b>eats</b> three.', '✓ Yesterday Mia baked cookies and <b>ate</b> three.'],
    },
    gen(r) {
      const A = [['cleaned', 'cleans', 'the kitchen'], ['visited', 'visits', 'Grandma'], ['baked', 'bakes', 'cookies'], ['played', 'plays', 'soccer'], ['fed', 'feeds', 'the cat'], ['washed', 'washes', 'the car'], ['drew', 'draws', 'a map'], ['wrote', 'writes', 'a poem'], ['watched', 'watches', 'a movie'], ['rode', 'rides', 'a bike'], ['made', 'makes', 'pancakes'], ['built', 'builds', 'a fort']];
      const [x, y] = r.sample(A, 2), n = cast(r).a;
      let s, tense;
      if (r.chance(0.5)) { s = `${r.pick(['Last Saturday', 'Yesterday afternoon', 'Two days ago', 'Last summer'])}, ${n} ${x[0]} ${x[2]} and then [${y[1]}|${y[0]}] ${y[2]}.`; tense = 'past'; }
      else { s = `${r.pick(['Every Sunday', 'Every morning', 'Every weekend', 'Each afternoon'])}, ${n} ${x[1]} ${x[2]} and then [${y[0]}|${y[1]}] ${y[2]}.`; tense = 'present'; }
      const m = marked(s);
      return {
        q: T('點出時態用錯的動詞。', 'Tap the verb that shifts tense by mistake.'),
        ans: ansTap(m.ws, m.idx),
        sol: [
          tense === 'past' ? T('時間詞說明這件事發生在「過去」，所以兩個動詞都要用過去式。', 'The time words show this happened in the past, so both verbs should be past tense.')
            : T('Every… 表示習慣，所以兩個動詞都要用現在式。', '"Every…" shows a habit, so both verbs should be present tense.'),
          T(`「${m.wrong}」要改成「${m.right}」：${m.good}`, `Change "${m.wrong}" to "${m.right}": ${m.good}`),
        ],
      };
    },
  },
  {
    id: 'g5-correlative',
    grade: 5,
    unit: 'grammar',
    name: T('成對連接詞', 'Correlative conjunctions'),
    std: 'CCSS L.5.1e',
    lesson: {
      zh: '成對連接詞要一起使用：<b>either…or</b>（兩者之一）、<b>neither…nor</b>（兩者都不）、<b>both…and</b>（兩者都）、<b>not only…but also</b>（不只…而且）。不能混搭，例如 neither…or 是錯的。',
      en: 'Correlative conjunctions come in pairs: <b>either…or</b> (one of two), <b>neither…nor</b> (not one or the other), <b>both…and</b> (the two together), <b>not only…but also</b>. Do not mix them: "neither…or" is wrong.',
      ex: ['<b>Either</b> Mia <b>or</b> Leo will feed the fish.', '<b>Neither</b> the cat <b>nor</b> the dog likes baths.', '<b>Both</b> Ava <b>and</b> Ben play the drums.'],
    },
    gen(r) {
      const P = [['Either', 'or'], ['Neither', 'nor'], ['Both', 'and'], ['Not only', 'but also']];
      const preds = [['likes spicy food', 'like spicy food'], ['plays the violin', 'play the violin'], ['knows the answer', 'know the answer'], ['is coming to the party', 'are coming to the party'], ['has a library card', 'have a library card'], ['wants the last slice of pizza', 'want the last slice of pizza']];
      const i = r.int(0, 3), [w1, w2] = P[i], [ps, pp] = r.pick(preds), c = cast(r), pred = w1 === 'Both' ? pp : ps;
      const full = `${w1} ${c.a} ${w2} ${c.b} ${pred}.`;
      if (r.chance(0.5)) {
        const s = `${w1} ${c.a} ___ ${c.b} ${pred}.`;
        return {
          q: T(`選出配對正確的字：${s}`, `Choose the word that completes the pair: ${s}`),
          ans: ansChoice([w2, ...P.filter((_, j) => j !== i).map((p) => p[1])]),
          sol: [T(`「${w1}」要和「${w2}」配成一對。`, `"${w1}" goes with "${w2}".`), T(`正確的句子：${full}`, `The sentence: ${full}`)],
        };
      }
      const s = `___ ${c.a} ${w2} ${c.b} ${pred}.`;
      return {
        q: T(`選出配對正確的字：${s}`, `Choose the word that completes the pair: ${s}`),
        ans: ansChoice([w1, ...P.filter((_, j) => j !== i).map((p) => p[0])]),
        sol: [T(`後面用了「${w2}」，前面就要用「${w1}」。`, `The second part is "${w2}", so the first part must be "${w1}".`), T(`正確的句子：${full}`, `The sentence: ${full}`)],
      };
    },
  },
  {
    id: 'g5-comma-intro',
    grade: 5,
    unit: 'mechanics',
    name: T('句首引導部分後的逗號', 'Comma after an introductory element'),
    std: 'CCSS L.5.2b',
    lesson: {
      zh: '句子開頭如果有<b>引導的子句、片語或字</b>（When the bell rang、After the game ended、Luckily），要在它後面、主要句子開始之前加<b>逗號</b>。',
      en: 'When a sentence opens with an <b>introductory clause, phrase or word</b> (When the bell rang, After the game ended, Luckily), put a <b>comma</b> after it, right before the main sentence begins.',
      ex: ['When the bell rang<b>,</b> we ran outside.', 'Luckily<b>,</b> Leo found his keys.', 'Because it was snowing<b>,</b> school closed early.'],
    },
    gen(r) {
      const items = [
        ['When the bell rang', 'the students', 'hurried to the lunchroom'], ['After the game ended', '{a}', 'shook hands with every player'], ['Because it was snowing', 'our school', 'closed early'],
        ['Although the water was cold', '{a}', 'jumped right in'], ['If you finish early', 'you', 'may read a book'], ['While we waited for the bus', '{a}', 'told a funny story'],
        ['Before the movie started', 'we', 'bought popcorn'], ['Luckily', '{a}', 'found the lost keys'], ['Sadly', 'the ice cream', 'melted before we could eat it'],
        ['As soon as the rain stopped', 'the kids', 'ran outside'], ['Surprisingly', 'the shy puppy', 'walked right up to {a}'], ['In the middle of the night', 'the baby', 'started to cry'],
      ];
      const c = cast(r), [i0, s0, p0] = r.pick(items), I = i0, S = fill(s0, c), Pd = fill(p0, c);
      const right = `${I}, ${S} ${Pd}.`;
      return {
        q: T('哪一句的逗號用對了？', 'Which sentence uses the comma correctly?'),
        ans: ansChoice([right, `${I} ${S} ${Pd}.`, `${I} ${S}, ${Pd}.`]),
        sol: [T(`「${I}」是句首的引導部分，後面要加逗號，再接主要句子「${S} ${Pd}」。`, `"${I}" is the introductory part, so a comma follows it before the main sentence "${S} ${Pd}".`), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g5-comma-address',
    grade: 5,
    unit: 'mechanics',
    name: T('逗號：yes/no、附加問句、稱呼', 'Commas with yes/no, tag questions and names'),
    std: 'CCSS L.5.2c',
    lesson: {
      zh: '這三種情況要用逗號隔開：<b>Yes / No</b> 放在句首（Yes, I can.）；<b>附加問句</b>（It is cold, isn\'t it?）；<b>直接稱呼對方的名字</b>（Mia, please sit down. / Thank you, Leo, for the card.）。少了逗號意思可能完全不同：Let\'s eat, Grandma! 和 Let\'s eat Grandma!',
      en: 'Use commas to set off <b>yes and no</b> (Yes, I can.), a <b>tag question</b> (It is cold, isn\'t it?), and the <b>name of the person you are talking to</b> (Mia, please sit down. / Thank you, Leo, for the card.). A missing comma can change the meaning: "Let\'s eat, Grandma!" vs. "Let\'s eat Grandma!"',
      ex: ['<b>No,</b> we do not have school today.', 'You like pizza<b>,</b> don\'t you?', 'Can you help me<b>,</b> Ava?'],
    },
    gen(r) {
      const items = [
        ['y', 'Yes, I would love to come to your party.', 'Yes I would love to come to your party.', 'Yes I would love, to come to your party.'],
        ['y', 'No, we do not have school on Monday.', 'No we do not have school on Monday.', 'No we, do not have school on Monday.'],
        ['y', 'Yes, {a} already fed the fish.', 'Yes {a} already fed the fish.', 'Yes {a}, already fed the fish.'],
        ['t', "The test was easy, wasn't it?", "The test was easy wasn't it?", "The test, was easy wasn't it?"],
        ['t', "You like pizza, don't you?", "You like pizza don't you?", "You like, pizza don't you?"],
        ['t', "{g} is coming with us, isn't she?", "{g} is coming with us isn't she?", "{g}, is coming with us isn't she?"],
        ['t', "We can walk to the park, can't we?", "We can walk to the park can't we?", "We can walk, to the park can't we?"],
        ['a', '{a}, please pass the salt.', '{a} please pass the salt.', '{a} please, pass the salt.'],
        ['a', 'Can you help me carry this box, {a}?', 'Can you help me carry this box {a}?', 'Can you help me, carry this box {a}?'],
        ['a', 'Thank you, {a}, for the lovely card.', 'Thank you {a} for the lovely card.', 'Thank you, {a} for the lovely card.'],
        ['a', 'Wait for me, {a}!', 'Wait for me {a}!', 'Wait, for me {a}!'],
        ['a', "Let's eat, Grandma!", "Let's eat Grandma!", "Let's, eat Grandma!"],
      ];
      const [k, ...ss] = r.pick(items), c = cast(r), o = ss.map((s) => fill(s, c));
      const why = k === 'y' ? T('句首的 Yes 或 No 後面要加逗號。', 'Put a comma after "Yes" or "No" at the start of a sentence.')
        : k === 't' ? T('附加問句（isn\'t it?、don\'t you?）前面要加逗號。', 'Put a comma before a tag question (isn\'t it? / don\'t you?).')
        : T('直接稱呼對方的名字時，要用逗號把名字和句子其他部分隔開。', 'When you speak directly to someone, set their name off with commas.');
      return {
        q: T('哪一句的逗號用對了？', 'Which sentence uses commas correctly?'),
        ans: ansChoice(o),
        sol: [why, T(`正確：${o[0]}`, `Correct: ${o[0]}`)],
      };
    },
  },
  {
    id: 'g5-titles',
    grade: 5,
    unit: 'mechanics',
    name: T('作品標題：斜體還是引號', 'Titles: italics or quotation marks'),
    std: 'CCSS L.5.2d',
    lesson: {
      zh: '<b>長的、完整的作品</b>（書、電影、雜誌、報紙、電視節目、專輯）用<b>斜體</b>（手寫時畫底線）。<b>短的作品或大作品的一部分</b>（詩、歌曲、短篇故事、文章、章節）用<b>引號</b>。',
      en: '<b>Long, whole works</b> (books, movies, magazines, newspapers, TV shows, albums) go in <b>italics</b> (underline them when you write by hand). <b>Short works or parts of a bigger work</b> (poems, songs, short stories, articles, chapters) go in <b>quotation marks</b>.',
      ex: ['My favorite book is <i>The Lost Robot</i>.', 'We sang "Rain on the Roof" in music class.', 'Chapter 3 is called "A Surprise Visitor."'],
    },
    gen(r) {
      const types = [['book', 'i', '書'], ['movie', 'i', '電影'], ['magazine', 'i', '雜誌'], ['newspaper', 'i', '報紙'], ['TV show', 'i', '電視節目'], ['poem', 'q', '詩'], ['song', 'q', '歌曲'], ['short story', 'q', '短篇故事'], ['magazine article', 'q', '雜誌文章'], ['chapter', 'q', '章節']];
      const titles = ['The Secret of Maple Lake', 'Rain on the Roof', 'The Lost Robot', 'A Summer to Remember', 'Moonlight Over Main Street', 'Our Amazing Oceans', 'The Brave Little Kite', 'Kids Who Code', 'The Midnight Garden'];
      const [ty, k, zh] = r.pick(types), ti = r.pick(titles), n = cast(r).a;
      const it = `<i>${ti}</i>`, qu = `"${ti}"`, right = k === 'i' ? it : qu;
      return {
        q: T(`${n} 最喜歡的${zh}是 ${ti}。標題該怎麼寫？`, `${n}'s favorite ${ty} is ${ti}. How should the title be written?`),
        ans: ansChoice([right, k === 'i' ? qu : it, ti]),
        sol: [
          k === 'i' ? T(`${zh}是長的、完整的作品，標題用斜體（手寫畫底線）。`, `A ${ty} is a long, whole work, so its title goes in italics (or is underlined by hand).`)
            : T(`${zh}是短的作品或大作品的一部分，標題用引號。`, `A ${ty} is a short work or part of a bigger work, so its title goes in quotation marks.`),
          T(`正確寫法：${right}`, `Correct: ${right}`),
        ],
      };
    },
  },
  {
    id: 'g5-combine-sentences',
    grade: 5,
    unit: 'sentences',
    name: T('合併句子', 'Combining sentences'),
    std: 'CCSS L.5.3a',
    lesson: {
      zh: '把幾個短句<b>合併</b>成一句，文章會更流暢：把形容詞移到名詞前、共用主詞或動詞、用 and/but/because/when 連接。合併後意思不能改變，也不能變成連寫句。',
      en: '<b>Combine</b> short, choppy sentences to make writing flow: move an adjective in front of the noun, share a subject or verb, or join with and/but/because/when. Keep the meaning the same and avoid run-ons.',
      ex: ['Mia has a dog. The dog is brown. → Mia has a <b>brown</b> dog.', 'It rained. We went inside. → <b>When</b> it rained, we went inside.'],
    },
    gen(r) {
      const items = [
        [['{a} has a dog.', 'The dog is brown.'], '{a} has a brown dog.', ['{a} has a dog, the dog is brown.', 'Brown, {a} has a dog.']],
        [['{a} went to the store.', '{a} bought apples.'], '{a} went to the store and bought apples.', ['{a} went to the store, {a} bought apples.', '{a} went to the store, bought apples.']],
        [['The game was exciting.', 'The game lasted three hours.'], 'The exciting game lasted three hours.', ['The game was exciting, it lasted three hours.', 'The game was exciting the game lasted three hours.']],
        [['{g} was tired.', '{g} finished the race.'], 'Although {g} was tired, she finished the race.', ['Although {g} was tired, so she finished the race.', '{g} was tired, she finished the race.']],
        [['It started to rain.', 'We went inside.'], 'When it started to rain, we went inside.', ['It started to rain we went inside.', 'It started to rain, we went inside.']],
        [['{a} plays the piano.', '{b} plays the piano too.'], '{a} and {b} play the piano.', ['{a} and {b} plays the piano.', '{a} plays the piano, {b} plays the piano too.']],
        [['The kitten is tiny.', 'The kitten is gray.', 'The kitten sleeps in a basket.'], 'The tiny gray kitten sleeps in a basket.', ['The kitten is tiny, gray, sleeps in a basket.', 'The tiny kitten is gray it sleeps in a basket.']],
        [['We visited the museum.', 'We saw a dinosaur skeleton there.'], 'At the museum, we saw a dinosaur skeleton.', ['We visited the museum, we saw a dinosaur skeleton there.', 'We visited the museum we saw a dinosaur skeleton there.']],
        [['{g} studied hard.', '{g} wanted to pass the spelling test.'], '{g} studied hard because she wanted to pass the spelling test.', ['{g} studied hard, she wanted to pass the spelling test.', 'Because {g} studied hard. She wanted to pass the spelling test.']],
        [['{a} likes soccer.', '{a} does not like basketball.'], '{a} likes soccer but not basketball.', ['{a} likes soccer, {a} does not like basketball.', '{a} likes soccer and basketball.']],
      ];
      const c = cast(r), [src, best, bad] = r.pick(items);
      const S = src.map((s) => fill(s, c)), B = fill(best, c), W = bad.map((s) => fill(s, c));
      return {
        q: T('哪一個是合併這些句子最好的方法？', 'Which is the best way to combine these sentences?'),
        text: S.join(' '),
        ans: ansChoice([B, ...W]),
        sol: [T('好的合併句意思不變、沒有重複的字，也不是連寫句或片段。', 'A good combined sentence keeps the meaning, drops repeated words, and is not a run-on or a fragment.'), T(`最好：${B}`, `Best: ${B}`)],
      };
    },
  },
  {
    id: 'g5-transitions',
    grade: 5,
    unit: 'organization',
    name: T('轉折詞', 'Transition words'),
    std: 'CCSS W.5.2c',
    lesson: {
      zh: '轉折詞告訴讀者兩個想法的關係：<b>結果</b>（As a result、Consequently、Therefore）、<b>對比</b>（However、In contrast、On the other hand）、<b>舉例</b>（For example、For instance）、<b>更具體地說</b>（Specifically）、<b>補充</b>（In addition、Furthermore、Also）。',
      en: 'Transitions show how two ideas connect: <b>result</b> (As a result, Consequently, Therefore), <b>contrast</b> (However, In contrast, On the other hand), <b>example</b> (For example, For instance), <b>more detail</b> (Specifically), <b>addition</b> (In addition, Furthermore, Also).',
      ex: ['It snowed all night. <b>Consequently</b>, school was closed.', 'Cats like to nap. <b>In contrast</b>, puppies want to play all day.'],
    },
    gen(r) {
      const W = {
        result: [['As a result', T('結果', 'result')], ['Consequently', T('結果', 'result')], ['Therefore', T('結果', 'result')]],
        contrast: [['In contrast', T('對比', 'contrast')], ['However', T('對比', 'contrast')], ['On the other hand', T('對比', 'contrast')]],
        example: [['For example', T('舉例', 'example')], ['For instance', T('舉例', 'example')]],
        detail: [['Specifically', T('更具體地說明', 'more exact detail')]],
        addition: [['In addition', T('補充另一點', 'addition')], ['Furthermore', T('補充另一點', 'addition')]],
      };
      const items = [
        ['{a} forgot to water the plant for two weeks.', 'its leaves turned brown and dry.', 'result'],
        ['The road was covered with ice.', 'the school buses were two hours late.', 'result'],
        ['{a} practiced the piano every day for a month.', 'the recital went perfectly.', 'result'],
        ['Our class collected over five hundred cans.', 'we won the recycling contest.', 'result'],
        ['Cheetahs can run about seventy miles per hour.', 'tortoises move very slowly.', 'contrast'],
        ['{g} loves loud action movies.', 'her sister prefers quiet nature shows.', 'contrast'],
        ['Summers in Arizona are hot and dry.', 'summers in Alaska are cool and mild.', 'contrast'],
        ['The first spelling test was easy.', 'the second one was very difficult.', 'contrast'],
        ['Many animals sleep through the winter.', 'bears rest in their dens for months.', 'example'],
        ['There are many ways to save water at home.', 'you can turn off the faucet while you brush your teeth.', 'example'],
        ['Some fruits are very sour.', 'a bite of lemon can make your mouth pucker.', 'example'],
        ['{g} wants to get better at basketball.', 'she wants to make more shots from the free-throw line.', 'detail'],
        ['Our class needs supplies for the art project.', 'we need glue, scissors, and colored paper.', 'detail'],
        ['Exercise makes your heart strong.', 'it helps you sleep better at night.', 'addition'],
        ['A library card lets you borrow books for free.', 'it lets you use the computers there.', 'addition'],
        ['Our new playground has three slides.', 'it has a climbing wall and a sandbox.', 'addition'],
      ];
      const [s1, s2, k] = r.pick(items), c = cast(r), A = fill(s1, c), B = fill(s2, c);
      const pool = { result: ['contrast', 'example'], contrast: ['result', 'example'], example: ['result', 'contrast'], detail: ['result', 'contrast'], addition: ['result', 'contrast'] }[k];
      const [right, lab] = r.pick(W[k]), wrongs = pool.map((p) => r.pick(W[p])[0]);
      return {
        q: T('選出最適合的轉折詞。', 'Choose the best transition.'),
        text: `${A} ___, ${B}`,
        ans: ansChoice([right, ...wrongs]),
        sol: [T(`第二句和第一句的關係是「${lab.zh}」，所以用 ${right}。`, `The second idea shows ${an(lab.en)} ${lab.en}, so use "${right}".`), T(`${A} ${right}, ${B}`, `${A} ${right}, ${B}`)],
      };
    },
  },
  {
    id: 'g5-figurative',
    grade: 5,
    unit: 'style',
    name: T('修辭與諺語', 'Figurative language and proverbs'),
    std: 'CCSS L.5.5a',
    lesson: {
      zh: '<b>明喻</b>用 like/as 比較；<b>暗喻</b>直接說 A 是 B；<b>擬人</b>讓東西像人一樣說話、動作（The wind whispered.）；<b>誇飾</b>故意誇大（I told you a million times!）。<b>諺語</b>（Practice makes perfect.）是傳下來的智慧話。',
      en: 'A <b>simile</b> compares with like/as; a <b>metaphor</b> says A is B; <b>personification</b> gives human actions to things (The wind whispered.); <b>hyperbole</b> is huge exaggeration (I told you a million times!). A <b>proverb</b> (Practice makes perfect.) is an old saying with advice.',
      ex: ['Personification: The old car <b>groaned</b> up the hill.', 'Hyperbole: This backpack weighs <b>a ton</b>!', 'Proverb: Look before you leap.'],
    },
    gen(r) {
      if (r.chance(0.65)) {
        const L = { s: T('明喻', 'simile'), m: T('暗喻', 'metaphor'), p: T('擬人', 'personification'), h: T('誇飾', 'hyperbole') };
        const items = [
          ['The wind whispered through the trees.', 'p'], ['The old car groaned up the hill.', 'p'], ['The sun smiled down on our picnic.', 'p'], ['My alarm clock yelled at me this morning.', 'p'], ['The leaves danced in the breeze.', 'p'],
          ['I have told you a million times to clean your room.', 'h'], ['This backpack weighs a ton!', 'h'], ['{g} was so hungry she could eat a horse.', 'h'], ['We waited in line forever.', 'h'], ['My little brother is the loudest person in the universe.', 'h'],
          ['The pond was as smooth as glass.', 's'], ['{a} ran like the wind.', 's'], ["The kitten's fur felt like a cloud.", 's'], ['The flashlight was as bright as the sun.', 's'],
          ['The playground was an oven in July.', 'm'], ['Time is a thief.', 'm'], ['The moon was a silver coin in the sky.', 'm'], ["{a}'s bedroom is a disaster zone.", 'm'],
        ];
        const [s0, k] = r.pick(items), s = fill(s0, cast(r));
        const why = { s: T('用 like 或 as 比較兩種不同的東西，是明喻。', 'It compares two different things with "like" or "as": a simile.'), m: T('直接說一個東西是另一個不同的東西，是暗喻。', 'It says one thing IS a different thing: a metaphor.'), p: T('讓沒有生命的東西像人一樣說話或動作，是擬人。', 'It gives a human action to a thing that is not human: personification.'), h: T('故意說得非常誇張，不是真的，是誇飾。', 'It exaggerates hugely and is not meant to be true: hyperbole.') }[k];
        return {
          q: T('這句話用了哪一種修辭？', 'Which kind of figurative language is this?'),
          text: s,
          ans: ansChoice([L[k], ...Object.keys(L).filter((x) => x !== k).map((x) => L[x])]),
          sol: [why, T(`答案：${L[k].zh}`, `Answer: ${L[k].en}`)],
        };
      }
      const P = [
        ['Practice makes perfect.', T('多練習就會越來越好', 'doing something again and again makes you better at it')],
        ["Don't judge a book by its cover.", T('不要只看外表就下判斷', 'do not decide what something is like from how it looks')],
        ['Actions speak louder than words.', T('做比說更重要', 'what you do matters more than what you say')],
        ['The early bird catches the worm.', T('早點開始的人比較容易成功', 'people who start early get the best chances')],
        ['Two heads are better than one.', T('兩個人一起想比一個人好', 'two people solving a problem together do better than one')],
        ['Better late than never.', T('晚做總比不做好', 'doing something late is better than not doing it')],
        ['Look before you leap.', T('行動前要先想清楚', 'think carefully before you act')],
        ["Don't count your chickens before they hatch.", T('事情還沒發生前，別太早高興', 'do not plan on something good before it really happens')],
      ];
      const i = r.int(0, P.length - 1), [s, m] = P[i];
      return {
        q: T('這句諺語是什麼意思？', 'What does this proverb mean?'),
        text: s,
        ans: ansChoice([m, ...r.sample(P.filter((_, j) => j !== i).map((x) => x[1]), 3)]),
        sol: [T('諺語是用短短一句話給人建議，意思不是字面上的。', 'A proverb gives advice in a short saying; its meaning goes beyond the words.'), T(`「${s}」的意思是：${m.zh}。`, `"${s}" means: ${m.en}.`)],
      };
    },
  },
  {
    id: 'g5-homographs-homophones',
    grade: 5,
    unit: 'words',
    name: T('同形異義字和同音異義字', 'Homographs and homophones'),
    std: 'CCSS L.5.5c',
    lesson: {
      zh: '<b>同形異義字</b>（homograph）拼法一樣、意思不同（wind 風 / wind 纏繞），要看上下文判斷。<b>同音異義字</b>（homophone）發音一樣、拼法和意思不同（piece 一塊 / peace 和平），寫作時要選對拼法。',
      en: '<b>Homographs</b> are spelled the same but mean different things (the wind blows / wind the string); use context to tell which. <b>Homophones</b> sound the same but are spelled differently (a piece of pie / world peace); choose the right spelling when you write.',
      ex: ['The actors <b>bow</b> to the crowd. / She wore a red <b>bow</b>.', 'I need a <b>piece</b> of paper. (not peace)'],
    },
    gen(r) {
      const c = cast(r);
      if (r.chance(0.5)) {
        const H = [
          ["The <b>wind</b> blew {a}'s hat away.", T('流動的空氣（風）', 'moving air'), T('纏繞、轉緊', 'to turn or twist something')],
          ['Please <b>wind</b> the string around the stick.', T('纏繞、轉緊', 'to turn or twist something'), T('流動的空氣（風）', 'moving air')],
          ['{g} tied a red <b>bow</b> in her hair.', T('打成圈的蝴蝶結', 'a ribbon tied in loops'), T('彎腰鞠躬', 'to bend forward at the waist')],
          ['The actors <b>bow</b> at the end of the play.', T('彎腰鞠躬', 'to bend forward at the waist'), T('打成圈的蝴蝶結', 'a ribbon tied in loops')],
          ["A <b>tear</b> rolled down {a}'s cheek.", T('眼淚', 'a drop of water from the eye'), T('撕破', 'to rip')],
          ['Be careful not to <b>tear</b> the map.', T('撕破', 'to rip'), T('眼淚', 'a drop of water from the eye')],
          ['A <b>bat</b> flew out of the dark cave.', T('會飛的動物（蝙蝠）', 'a flying animal'), T('打球用的球棒', 'a stick for hitting a ball')],
          ['{a} swung the <b>bat</b> and hit a home run.', T('打球用的球棒', 'a stick for hitting a ball'), T('會飛的動物（蝙蝠）', 'a flying animal')],
          ['Each group will <b>present</b> its project to the class.', T('發表、展示', 'to show or give a talk'), T('禮物', 'a gift')],
          ['{a} wrapped a <b>present</b> for {b}.', T('禮物', 'a gift'), T('發表、展示', 'to show or give a talk')],
          ['The <b>bark</b> on the old oak tree was rough.', T('樹皮', 'the outer covering of a tree'), T('狗叫聲', 'the sound a dog makes')],
          ['Dogs often <b>bark</b> when strangers come near.', T('狗叫', 'to make the sound a dog makes'), T('樹皮', 'the outer covering of a tree')],
          ['{a} could not <b>lead</b> the team because of a sore ankle.', T('帶領', 'to guide or be in charge of'), T('鉛（一種金屬）', 'a heavy gray metal')],
          ['Old water pipes were sometimes made of <b>lead</b>.', T('鉛（一種金屬）', 'a heavy gray metal'), T('帶領', 'to guide or be in charge of')],
        ];
        const [s0, right, wrong] = r.pick(H), s = fill(s0, c), w = s.match(/<b>(.*?)<\/b>/)[1];
        return {
          q: T(`在這句中，「${w}」是什麼意思？${s}`, `What does "${w}" mean in this sentence? ${s}`),
          ans: ansChoice([right, wrong]),
          sol: [T(`「${w}」是同形異義字，有不只一個意思。看上下文判斷。`, `"${w}" is a homograph: one spelling, more than one meaning. Use the context.`), T(`這裡的意思是：${right.zh}。`, `Here it means: ${right.en}.`)],
        };
      }
      const P = [
        ['Please read the story [allowed|aloud] to the class.', T('aloud = 大聲地（讓別人聽到）', 'aloud = out loud, so others can hear')],
        ['We do not know [weather|whether] {a} can come.', T('whether = 是否', 'whether = if')],
        ['Press the [break|brake] before the stop sign.', T('brake = 煞車', 'brake = the part that stops a bike or car')],
        ['{a} ate a [peace|piece] of apple pie.', T('piece = 一塊、一片', 'piece = a part of something')],
        ['The [principle|principal] visited our classroom today.', T('principal = 校長', 'principal = the head of a school')],
        ['I need two cups of [flower|flour] for the cake.', T('flour = 麵粉', 'flour = the powder used for baking')],
        ['{a} was [board|bored] during the long car ride.', T('bored = 無聊的', 'bored = not interested')],
        ['The ball flew [threw|through] the open window.', T('through = 穿過', 'through = in one side and out the other')],
        ['{a} read a [tail|tale] about a brave knight.', T('tale = 故事', 'tale = a story')],
        ['Can you [here|hear] the birds singing?', T('hear = 聽見', 'hear = to take in sounds with your ears')],
        ['The store is having a big [sail|sale] on shoes.', T('sale = 特價', 'sale = selling things for less money')],
        ['{g} ate the [hole|whole] sandwich by herself.', T('whole = 整個', 'whole = all of something')],
        ['Please [weight|wait] for me at the corner.', T('wait = 等待', 'wait = to stay until something happens')],
        ['The roses had a sweet [cent|scent].', T('scent = 香味', 'scent = a smell')],
      ];
      const [s0, gloss] = r.pick(P), m = marked(fill(s0, c));
      return {
        q: T('點出拼錯的同音字。', 'Tap the homophone that is the wrong word.'),
        ans: ansTap(m.ws, m.idx),
        sol: [T(`「${m.wrong}」和「${m.right}」發音一樣，但意思不同。${gloss.zh}`, `"${m.wrong}" and "${m.right}" sound the same but mean different things. ${gloss.en}.`), T(`正確：${m.good}`, `Correct: ${m.good}`)],
      };
    },
  },
  {
    id: 'g5-fact-opinion',
    grade: 5,
    unit: 'research',
    name: T('事實和意見', 'Fact or opinion'),
    std: 'CCSS W.5.1b',
    lesson: {
      zh: '<b>事實</b>可以被證明是真的（查資料、量一量、數一數）。<b>意見</b>是某人的想法或感覺，別人可能不同意；常有 best、worst、should、boring、beautiful 這類字。寫意見文時，要用事實支持你的意見。',
      en: 'A <b>fact</b> can be proved true (look it up, measure it, count it). An <b>opinion</b> is what someone thinks or feels, and others may disagree; watch for words like best, worst, should, boring, beautiful. In opinion writing, support your opinion with facts.',
      ex: ['Fact: A spider has eight legs.', 'Opinion: Spiders are the creepiest animals.'],
    },
    gen(r) {
      const F = ['Water freezes at 32 degrees Fahrenheit.', 'Our school has twenty-four classrooms.', 'George Washington was the first president of the United States.', 'A spider has eight legs.', 'The Pacific is the largest ocean on Earth.', '{a} read four books last month.', 'The library opens at nine on Saturdays.', 'Penguins cannot fly.', 'The Sun is a star.', 'Tokyo is the capital of Japan.', 'Bees make honey.', 'A week has seven days.'];
      const O = ['Summer is the best season of the year.', 'Math is more fun than science.', 'Broccoli tastes terrible.', 'Dogs are better pets than cats.', 'Everyone should learn to play the piano.', 'The new playground is the coolest place in town.', "{a}'s drawing is the most beautiful one in the class.", 'Rainy days are boring.', 'That movie was too long.', 'Basketball is the most exciting sport.', 'Homework should be banned.', 'Pink is a prettier color than green.'];
      const c = cast(r), LF = T('事實', 'fact'), LO = T('意見', 'opinion');
      const t = r.int(0, 2);
      if (t === 0) {
        const isF = r.chance(0.5), s = fill(r.pick(isF ? F : O), c);
        return {
          q: T('這句話是事實還是意見？', 'Is this a fact or an opinion?'),
          text: s,
          ans: ansChoice(isF ? [LF, LO] : [LO, LF]),
          sol: [isF ? T('這可以查證或計算，證明是真的，所以是事實。', 'It can be checked or counted and proved true, so it is a fact.') : T('這是某人的想法或感覺，別人可能不同意，所以是意見。', 'It is what someone thinks or feels; others might disagree, so it is an opinion.'), T('問自己：「這能被證明嗎？」', 'Ask: "Can this be proved?"')],
        };
      }
      const wantO = t === 1, right = fill(r.pick(wantO ? O : F), c), wr = r.sample(wantO ? F : O, 3).map((s) => fill(s, c));
      return {
        q: wantO ? T('哪一句是意見？', 'Which sentence is an opinion?') : T('哪一句是事實？', 'Which sentence is a fact?'),
        ans: ansChoice([right, ...wr]),
        sol: [wantO ? T(`「${right}」是個人的想法，別人可能不同意。`, `"${right}" is someone's belief; others might disagree.`) : T(`「${right}」可以查證，證明是真的。`, `"${right}" can be checked and proved true.`), T(wantO ? '其他句子都可以被證明，是事實。' : '其他句子是個人的想法或感覺，是意見。', wantO ? 'The other sentences can be proved, so they are facts.' : 'The other sentences are beliefs or feelings, so they are opinions.')],
      };
    },
  },
  {
    id: 'g5-best-evidence',
    grade: 5,
    unit: 'research',
    name: T('選出最好的證據', 'Choosing the best evidence'),
    std: 'CCSS W.5.1b',
    lesson: {
      zh: '寫意見或報告時，<b>證據</b>要直接支持你的主張。好的證據是事實、例子、數字或專家說的話，而且和主張有關。只是有趣、離題或只是個人喜好的句子都不是好證據。',
      en: 'In opinion and report writing, your <b>evidence</b> must directly support your claim. Strong evidence is a fact, example, number or expert statement that connects to the claim. Sentences that are only interesting, off topic, or personal likes are weak evidence.',
      ex: ['Claim: Helmets keep riders safe.', 'Strong: Doctors say helmets lower the risk of serious head injuries.', 'Weak: Helmets come in bright colors.'],
    },
    gen(r) {
      const items = [
        ['Our school should start a vegetable garden.', 'Students who help grow vegetables are more likely to try eating them.', ['Our school has a big gym.', 'I think tomatoes are yummy.', 'Gardens need water almost every day.']],
        ['Bicycle helmets keep riders safe.', 'Doctors report that helmets lower the risk of serious head injuries.', ['Helmets come in many bright colors.', 'My cousin got a new bike for his birthday.', 'Some people think helmets look silly.']],
        ['Kids should drink more water.', 'Water helps the body stay cool and helps the brain stay focused.', ['Juice boxes come in many flavors.', 'My favorite cup is blue.', 'Some water bottles are made of metal.']],
        ['Reading every day helps you become a better writer.', 'Readers see many examples of strong sentences and learn new words.', ['The library has comfortable chairs.', 'Some books have colorful pictures.', 'Pens come in many colors.']],
        ['Recess helps students learn.', 'After running and playing, many students find it easier to pay attention in class.', ['Our playground has two swings.', 'Lunch is served at noon.', 'Some students like tag more than soccer.']],
        ['Caring for a pet teaches kids responsibility.', 'A child who must feed and walk a dog every day learns to keep promises.', ['Goldfish are often orange.', 'Some dogs are very fluffy.', 'Cats can sleep for many hours.']],
        ['Bees are important to farmers.', 'Bees carry pollen from flower to flower, which helps many fruits and vegetables grow.', ['Some bees are black and yellow.', 'A bee sting can hurt.', 'Honey tastes sweet on toast.']],
        ['Our town needs a bigger library.', "The library's children's room has only twelve seats, so many kids have to sit on the floor.", ['Libraries have existed for thousands of years.', 'I like mystery books best.', 'The town park has a duck pond.']],
      ];
      const i = r.int(0, items.length - 1), [claim, best, weak] = items[i];
      if (r.chance(0.4)) {
        const others = r.sample(items.filter((_, j) => j !== i).map((x) => x[0]), 3);
        return {
          q: T('這個證據最能支持哪一個主張？', 'Which claim does this evidence support best?'),
          text: best,
          ans: ansChoice([claim, ...others]),
          sol: [T('先想想：這個證據證明了什麼？再找和它直接相關的主張。', 'Ask what the evidence proves, then find the claim it connects to directly.'), T(`「${best}」支持的主張是：${claim}`, `"${best}" supports the claim: ${claim}`)],
        };
      }
      return {
        q: T('哪一個證據最能支持這個主張？', 'Which piece of evidence best supports this claim?'),
        text: claim,
        ans: ansChoice([best, ...weak]),
        sol: [T('好的證據要直接說明「為什麼主張是對的」。', 'Strong evidence directly shows why the claim is true.'), T(`最好的證據：${best}`, `Best evidence: ${best}`), T('其他句子離題、只是個人喜好，或沒有說明主張。', 'The other sentences are off topic, personal likes, or do not explain the claim.')],
      };
    },
  },
  {
    id: 'g5-expand-sentences',
    grade: 5,
    unit: 'sentences',
    name: T('擴充句子：何時、哪裡、怎麼、為什麼', 'Expanding sentences with details'),
    std: 'CCSS L.5.3a',
    lesson: {
      zh: '把簡單的句子<b>擴充</b>，加入回答問題的細節：<b>何時</b>（After dinner）、<b>哪裡</b>（on the porch）、<b>怎麼做</b>（carefully）、<b>為什麼</b>（because…）。句子更清楚、更有畫面。',
      en: '<b>Expand</b> a plain sentence by adding details that answer questions: <b>when</b> (After dinner), <b>where</b> (on the porch), <b>how</b> (carefully), <b>why</b> (because…). The sentence becomes clearer and more vivid.',
      ex: ['Mia read a book.', '<b>After dinner</b>, Mia read a book <b>quietly on the porch because the TV was broken</b>.'],
    },
    gen(r) {
      const bases = [
        ['read a book', 'because the story was exciting'], ['painted a picture', "because it was Grandma's birthday"], ['built a model rocket', 'because the science fair was coming'],
        ['practiced the trumpet', 'because the concert was the next day'], ['wrote a letter', 'because a friend had moved away'], ['made a card', 'because a neighbor was sick'],
      ];
      const [vp, why] = r.pick(bases), n = cast(r).a;
      const D = { when: r.pick(['After dinner', 'On Saturday morning', 'Before school', 'Last night']), where: r.pick(['in the garden', 'on the porch', 'in the kitchen', 'in the backyard']), how: r.pick(['patiently', 'carefully', 'happily']), why };
      const Z = { when: T('何時', 'WHEN'), where: T('哪裡', 'WHERE'), how: T('怎麼做', 'HOW'), why: T('為什麼', 'WHY') };
      const build = (ks) => { let s = `${n} ${vp}`; if (ks.includes('how')) s += ` ${D.how}`; if (ks.includes('where')) s += ` ${D.where}`; if (ks.includes('why')) s += ` ${D.why}`; return (ks.includes('when') ? `${D.when}, ` : '') + s + '.'; };
      const keys = ['when', 'where', 'how', 'why'], pairs = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([keys[i], keys[j]]);
      const target = r.pick(pairs), others = r.sample(pairs.filter((p) => p !== target), 3);
      const base = `${n} ${vp}.`;
      return {
        q: T(`哪一句替「${base}」加上了「${Z[target[0]].zh}」和「${Z[target[1]].zh}」？`, `Which sentence adds both ${Z[target[0]].en} and ${Z[target[1]].en} to "${base}"?`),
        ans: ansChoice([build(target), ...others.map(build)]),
        sol: [T(`${Z[target[0]].zh}：${D[target[0]]}；${Z[target[1]].zh}：${D[target[1]]}。`, `${Z[target[0]].en}: "${D[target[0]]}"; ${Z[target[1]].en}: "${D[target[1]]}".`), T(`答案：${build(target)}`, `Answer: ${build(target)}`)],
      };
    },
  },

  // ======================= GRADE 6 =======================
  {
    id: 'g6-pronoun-case',
    grade: 6,
    unit: 'grammar',
    name: T('代名詞的格：主格、受格、所有格', 'Pronoun case'),
    std: 'CCSS L.6.1a',
    lesson: {
      zh: '<b>主格</b>（I、he、she、we、they）當主詞；<b>受格</b>（me、him、her、us、them）放在動詞或介係詞後面；<b>所有格代名詞</b>（mine、his、hers、ours、theirs）單獨表示「…的東西」。小技巧：把另一個人名拿掉再讀一次——「Mia and me went」→「me went」不對，要用 I。',
      en: '<b>Subjective</b> pronouns (I, he, she, we, they) are subjects. <b>Objective</b> pronouns (me, him, her, us, them) come after a verb or preposition. <b>Possessive</b> pronouns (mine, his, hers, ours, theirs) stand alone to show ownership. Tip: cover the other name and read again — "Mia and me went" → "me went" is wrong, so use I.',
      ex: ['Leo and <b>I</b> built a robot.', 'The coach thanked Leo and <b>me</b>.', 'That blue bike is <b>hers</b>.'],
    },
    gen(r) {
      const c = cast(r), n = c.a, t = r.int(0, 2);
      if (t === 0) {
        const [sp, op] = r.pick([['I', 'me'], ['he', 'him'], ['she', 'her']]);
        const pred = r.pick(['went to the science fair', 'baked cookies for the bake sale', 'won the relay race', 'cleaned up the art room', 'planted a tree by the gate']);
        const s = `${n} and ___ ${pred}.`, wr = sp === 'I' ? ['me', 'myself'] : [op, sp === 'he' ? 'himself' : 'herself'];
        return {
          q: T(`選出正確的代名詞：${s}`, `Choose the correct pronoun: ${s}`),
          ans: ansChoice([sp, ...wr]),
          sol: [T(`空格是句子的主詞（和 ${n} 一起做動作），要用主格「${sp}」。`, `The blank is part of the subject (doing the action with ${n}), so use the subjective "${sp}".`), T(`把 ${n} 拿掉試試：${cap(sp)} ${pred}. 正確：${s.replace('___', sp)}`, `Cover "${n} and": "${cap(sp)} ${pred}." Correct: ${s.replace('___', sp)}`)],
        };
      }
      if (t === 1) {
        const [op, sp] = r.pick([['me', 'I'], ['him', 'he'], ['her', 'she'], ['us', 'we'], ['them', 'they']]);
        const tpl = r.pick(['The coach gave {a} and ___ a ribbon.', 'Grandma made pancakes for {a} and ___.', 'The teacher asked {a} and ___ to hand out the papers.', 'The puppy followed {a} and ___ home.', 'This secret is just between {a} and ___.']);
        const s = fill(tpl, c), wr = op === 'me' ? ['I', 'myself'] : [sp];
        return {
          q: T(`選出正確的代名詞：${s}`, `Choose the correct pronoun: ${s}`),
          ans: ansChoice([op, ...wr]),
          sol: [T(`空格在動詞或介係詞後面，是受詞，要用受格「${op}」。`, `The blank comes after a verb or preposition, so it is an object: use the objective "${op}".`), T(`正確：${s.replace('___', op)}`, `Correct: ${s.replace('___', op)}`)],
        };
      }
      const [pos, adj, obj] = r.pick([['mine', 'my', 'me'], ['hers', 'her', 'she'], ['ours', 'our', 'us'], ['theirs', 'their', 'them']]);
      const thing = r.pick(['backpack', 'umbrella', 'water bottle', 'notebook', 'skateboard']);
      const s = `I think that ${thing} is ___.`;
      return {
        q: T(`選出正確的代名詞：${s}`, `Choose the correct pronoun: ${s}`),
        ans: ansChoice([pos, adj, obj]),
        sol: [T(`空格後面沒有名詞，要用可以「單獨」表示擁有的所有格代名詞「${pos}」。`, `No noun follows the blank, so use the stand-alone possessive pronoun "${pos}".`), T(`「${adj}」後面一定要接名詞（${adj} ${thing}）。正確：${s.replace('___', pos)}`, `"${adj}" must come before a noun (${adj} ${thing}). Correct: ${s.replace('___', pos)}`)],
      };
    },
  },
  {
    id: 'g6-intensive-pronouns',
    grade: 6,
    unit: 'grammar',
    name: T('強調代名詞（-self / -selves）', 'Intensive pronouns'),
    std: 'CCSS L.6.1b',
    lesson: {
      zh: '<b>強調代名詞</b>（myself、himself、herself、ourselves、themselves）用來強調「就是他本人」，拿掉後句子仍然完整：Mia <b>herself</b> built the shed. <b>反身代名詞</b>形式一樣，但是動詞的受詞，拿掉就不完整：Mia hurt <b>herself</b>. 注意：hisself、theirselves 都是錯的。',
      en: 'An <b>intensive pronoun</b> (myself, himself, herself, ourselves, themselves) adds emphasis, and the sentence is still complete without it: Mia <b>herself</b> built the shed. A <b>reflexive pronoun</b> looks the same but is the object of the verb, so it cannot be removed: Mia hurt <b>herself</b>. "Hisself" and "theirselves" are not words.',
      ex: ['The principal <b>herself</b> handed out the awards. (intensive)', 'Leo taught <b>himself</b> to juggle. (reflexive)', 'We painted the mural <b>ourselves</b>. (intensive)'],
    },
    gen(r) {
      const c = cast(r);
      const subs = [[c.g, 'herself', ['herselves', 'her']], [c.m, 'himself', ['hisself', 'him']], ['I', 'myself', ['meself', 'me']], ['We', 'ourselves', ['ourself', 'us']], ['The twins', 'themselves', ['theirselves', 'them']]];
      const [sub, self, wr] = r.pick(subs);
      if (r.chance(0.5)) {
        const pred = r.pick(['built the birdhouse', 'painted the whole fence', 'baked the birthday cake', 'fixed the flat tire', 'wrote the song']);
        const s = `${sub} ${pred} ___.`;
        return {
          q: T(`選出正確的強調代名詞：${s}`, `Choose the correct intensive pronoun: ${s}`),
          ans: ansChoice([self, ...wr]),
          sol: [T(`主詞是「${sub}」，對應的強調代名詞是「${self}」。`, `The subject is "${sub}", so the matching pronoun is "${self}".`), T(`正確：${s.replace('___', self)}（拿掉 ${self} 句子仍然完整，所以是強調用法。）`, `Correct: ${s.replace('___', self)} (Without "${self}" the sentence is still complete, so it is intensive.)`)],
        };
      }
      const intensive = r.chance(0.5);
      let s;
      if (intensive) {
        const pred = r.pick(['built the birdhouse', 'painted the whole fence', 'baked the birthday cake', 'fixed the flat tire', 'wrote the song']);
        s = r.chance(0.5) ? `${sub} <b>${self}</b> ${pred}.` : `${sub} ${pred} <b>${self}</b>.`;
      } else {
        const v = r.pick([`introduced <b>${self}</b> to the new neighbors`, `taught <b>${self}</b> to juggle`, `saw <b>${self}</b> in the mirror`, `reminded <b>${self}</b> to breathe slowly`, `hurt <b>${self}</b> on the slide`]);
        s = `${sub} ${v}.`;
      }
      const LI = T('強調代名詞（拿掉後句子仍完整）', 'intensive (the sentence works without it)'), LR = T('反身代名詞（它是動詞的受詞）', 'reflexive (it is the object of the verb)');
      const without = strip(s).replace(` ${self}`, '');
      return {
        q: T(`粗體字是強調代名詞還是反身代名詞？${s}`, `Is the bold word intensive or reflexive? ${s}`),
        ans: ansChoice(intensive ? [LI, LR] : [LR, LI]),
        sol: [T(`拿掉「${self}」：${without}`, `Remove "${self}": ${without}`), intensive ? T('句子仍然完整、意思不變，所以是強調代名詞。', 'The sentence is still complete with the same meaning, so the pronoun is intensive.') : T('句子變得不完整或意思不同，因為它是動詞的受詞，所以是反身代名詞。', 'The sentence is now incomplete or means something else, because the pronoun was the object of the verb. It is reflexive.')],
      };
    },
  },
  {
    id: 'g6-pronoun-shifts',
    grade: 6,
    unit: 'grammar',
    name: T('代名詞的人稱和數不一致', 'Shifts in pronoun number and person'),
    std: 'CCSS L.6.1c',
    lesson: {
      zh: '同一句裡指同一群人時，代名詞的<b>人稱</b>（I、we、you、they）和<b>單複數</b>要一致。✗ If students want to join, <b>you</b> must sign up. ✓ If students want to join, <b>they</b> must sign up.',
      en: 'When pronouns point to the same people, keep the same <b>person</b> (I, we, you, they) and <b>number</b> (one or many). ✗ If students want to join, <b>you</b> must sign up. ✓ If students want to join, <b>they</b> must sign up.',
      ex: ['When we hike, <b>we</b> carry water. (not "you")', 'The birds built a nest, and <b>they</b> laid eggs. (not "it")'],
    },
    gen(r) {
      const items = [
        ['If students want to join the chess club, [you|they] must sign up by Friday.', 'students', 'they'],
        ['When we hike in the mountains, [you|we] should always carry water.', 'we', 'we'],
        ['I love the library because [you|I] can always find a quiet corner there.', 'I', 'I'],
        ['The students finished the project, and then [he|they] presented it to the class.', 'the students', 'they'],
        ['My cousins visited last summer, and [she|they] stayed for a week.', 'my cousins', 'they'],
        ['When people exercise, [you|they] usually feel more energetic.', 'people', 'they'],
        ['Our class planted ten trees, and [you|we] watered them every week.', 'our class (we)', 'we'],
        ['If a dog barks all night, [they|it] may be lonely.', 'a dog', 'it'],
        ['The birds built a nest, and [it|they] laid three eggs.', 'the birds', 'they'],
        ['When I visit my grandparents, [you|I] always eat too much.', 'I', 'I'],
        ['Players who practice every day will see [your|their] skills improve.', 'players', 'their'],
        ['{a} and {b} love soccer, so [we|they] play every weekend.', '{a} and {b}', 'they'],
      ];
      const c = cast(r), [s0, ante] = r.pick(items), m = marked(fill(s0, c)), A = fill(ante, c);
      return {
        q: T('點出人稱或單複數用錯的代名詞。', 'Tap the pronoun that shifts in person or number.'),
        ans: ansTap(m.ws, m.idx),
        sol: [T(`這個代名詞指的是「${A}」，所以要用「${m.right}」，不是「${m.wrong}」。`, `The pronoun points back to "${A}", so it should be "${m.right}", not "${m.wrong}".`), T(`正確：${m.good}`, `Correct: ${m.good}`)],
      };
    },
  },
  {
    id: 'g6-vague-pronouns',
    grade: 6,
    unit: 'grammar',
    name: T('代名詞指涉不清', 'Vague pronouns'),
    std: 'CCSS L.6.1d',
    lesson: {
      zh: '每個代名詞都要清楚指向<b>一個</b>先行詞。「Mia told Ava that she won.」——she 是 Mia 還是 Ava？不清楚。改寫：Mia told Ava, "You won." 也要避免沒有指涉對象的 they、it、this（They say…）。',
      en: 'Every pronoun must clearly point to <b>one</b> antecedent. "Mia told Ava that she won." — who is "she"? Rewrite: Mia told Ava, "You won." Also avoid a "they", "it" or "this" that points to nothing (They say…).',
      ex: ['✗ The vase fell off the shelf, and it broke.', '✓ The vase fell off the shelf and broke.', '✗ They say the pool opens in June.', '✓ The town website says the pool opens in June.'],
    },
    gen(r) {
      const g = r.sample(GIRLS, 2), b = r.sample(BOYS, 2), boy = r.chance(0.5), [x, y] = boy ? b : g, he = boy ? 'he' : 'she', him = boy ? 'him' : 'her', his = boy ? 'his' : 'her';
      const items = [
        [`${x} told ${y}, "I won the art contest."`, `${x} told ${y} that ${he} had won the art contest.`, `${x} and ${y} talked, and ${he} said ${he} had won the art contest.`],
        [`After ${x} got home from practice, ${he} called ${y}.`, `${x} called ${y} after ${he} got home from practice.`, `When ${he} got home from practice, ${x} and ${y} talked on the phone.`],
        [`Because ${y} was lost, ${x} handed ${him} the map.`, `${x} handed ${y} the map because ${he} was lost.`, `${x} and ${y} looked at the map because ${he} was lost.`],
        [`Because ${y}'s pencil was broken, ${x} lent ${y} a pencil.`, `${x} lent ${y} a pencil because ${his} was broken.`, `${x} lent ${y} ${his} pencil because it was broken.`],
        ['The vase fell off the shelf and broke.', 'The vase fell off the shelf, and it broke.', 'When the vase hit the shelf, it broke.'],
        ['The town newspaper says that the new pool will open in June.', 'They say that the new pool will open in June.', 'It says that the new pool will open in June.'],
        [`${x} put the glass on the tray, and the glass cracked.`, `When ${x} put the glass on the tray, it cracked.`, `${x} put the glass on the tray, and then it cracked.`],
        [`${x} reminded ${y} that ${y}'s library book was due.`, `${x} reminded ${y} that ${his} library book was due.`, `${x} reminded ${y} that the book ${he} had was due.`],
      ];
      const [clear, ...vague] = r.pick(items);
      return {
        q: T('哪一句最清楚（每個代名詞都只指一個人或物）？', 'Which sentence is clearest (every pronoun points to only one thing)?'),
        ans: ansChoice([clear, ...vague]),
        sol: [T('其他句子的代名詞可以指兩個不同的人或物，或者根本沒有指涉的對象，讀者會搞混。', 'In the other sentences, a pronoun could point to two different people or things, or to nothing at all, which confuses readers.'), T(`最清楚：${clear}`, `Clearest: ${clear}`)],
      };
    },
  },
  {
    id: 'g6-nonrestrictive',
    grade: 6,
    unit: 'mechanics',
    name: T('補充說明：逗號、括號、破折號', 'Commas, parentheses and dashes for extra information'),
    std: 'CCSS L.6.2a',
    lesson: {
      zh: '插在句子中間的<b>補充說明</b>（非限定成分）要用<b>一對</b>標點包起來：逗號 , … ,、括號 ( … ) 或破折號 — … —。前後要用同一種，而且兩邊都要有。拿掉補充部分，句子仍然完整。',
      en: '<b>Extra information</b> in the middle of a sentence (a nonrestrictive element) is set off by a <b>matching pair</b>: commas , … , or parentheses ( … ) or dashes — … —. Use the same mark on both sides, and do not forget the second one. Without the extra part, the sentence still works.',
      ex: ['Mount Everest<b>,</b> the tallest mountain on Earth<b>,</b> is in Asia.', 'Our principal <b>(</b>Ms. Rivera<b>)</b> gave a speech.', 'Jupiter<b>—</b>the largest planet<b>—</b>has dozens of moons.'],
    },
    gen(r) {
      const items = [
        ['Our principal', 'Ms. Rivera', 'gave a short speech at the assembly'], ['Mount Everest', 'the tallest mountain on Earth', 'is in Asia'],
        ["{a}'s dog", 'a fluffy beagle named Biscuit', 'loves to chase squirrels'], ['The Nile', 'one of the longest rivers in the world', 'flows north into the Mediterranean Sea'],
        ['My grandmother', 'who grew up in Tainan', 'makes the best dumplings'], ['Our science teacher', 'Mr. Patel', 'built a model volcano for the class'],
        ['The Statue of Liberty', 'a gift from France', 'stands in New York Harbor'], ['{a}', 'who had practiced for weeks', 'played the solo perfectly'],
        ['Jupiter', 'the largest planet in our solar system', 'has dozens of moons'], ['The town library', 'which closes at eight', 'has a new reading room'],
      ];
      const [b0, mid, end] = r.pick(items), B = fill(b0, cast(r)), st = r.pick(['comma', 'comma', 'paren', 'dash']);
      const right = st === 'comma' ? `${B}, ${mid}, ${end}.` : st === 'paren' ? `${B} (${mid}) ${end}.` : `${B}—${mid}—${end}.`;
      const wrongs = [`${B}, ${mid} ${end}.`, `${B} ${mid}, ${end}.`, `${B}—${mid}, ${end}.`, `${B} (${mid}, ${end}.`];
      const name = { comma: T('一對逗號', 'a pair of commas'), paren: T('一對括號', 'a pair of parentheses'), dash: T('一對破折號', 'a pair of dashes') }[st];
      return {
        q: T('哪一句的標點正確？', 'Which sentence is punctuated correctly?'),
        ans: ansChoice(opts(r, right, wrongs)),
        sol: [T(`「${mid}」是補充說明，拿掉後句子仍然完整：${B} ${end}.`, `"${mid}" is extra information; without it the sentence still works: ${B} ${end}.`), T(`補充說明要用成對、相同的標點包起來，這裡用${name.zh}：${right}`, `Extra information needs a matching pair of marks. Here it uses ${name.en}: ${right}`)],
      };
    },
  },
  {
    id: 'g6-sentence-types',
    grade: 6,
    unit: 'sentences',
    name: T('句型變化：簡單句、合句、複句', 'Varying sentence patterns'),
    std: 'CCSS L.6.3a',
    lesson: {
      zh: '好文章會<b>變化句型</b>：<b>簡單句</b>（一個獨立子句）、<b>合句</b>（兩個獨立子句用 and/but/so 連接）、<b>複句</b>（一個獨立子句 + 一個從屬子句，例如 when、because、although 開頭）、<b>複合複句</b>（兩個獨立子句 + 至少一個從屬子句）。',
      en: 'Good writers <b>vary sentence patterns</b>: <b>simple</b> (one independent clause), <b>compound</b> (two independent clauses joined by and/but/so), <b>complex</b> (an independent clause plus a dependent clause starting with when, because, although…), and <b>compound-complex</b> (two independent clauses plus at least one dependent clause).',
      ex: ['Simple: The lights went out.', 'Compound: The lights went out, so we lit candles.', 'Complex: When the storm hit, the lights went out.', 'Compound-complex: When the storm hit, the lights went out, so we lit candles.'],
    },
    gen(r) {
      const items = [
        ['when the storm hit', 'the lights went out', 'we lit candles', 'so'], ['after the game ended', 'the players shook hands', 'the fans cheered', 'and'],
        ['while the cookies baked', '{a} washed the bowls', '{b} set the table', 'and'], ['because the trail was steep', 'the hike took three hours', 'we rested at the top', 'so'],
        ['although it was raining', 'we went to the park', 'we had a great time', 'and'], ['since the bus was late', '{a} missed the first bell', 'the teacher was not upset', 'but'],
        ['before the movie started', 'we bought popcorn', '{a} found our seats', 'and'], ['when {a} got home', 'the puppy jumped up', 'its tail wagged wildly', 'and'],
      ];
      const c = cast(r), [S, A, B, cj] = r.pick(items).map((x) => fill(x, c));
      const k = r.int(0, 3);
      const s = [`${cap(A)}.`, `${cap(A)}, ${cj} ${B}.`, `${cap(S)}, ${A}.`, `${cap(S)}, ${A}, ${cj} ${B}.`][k];
      const L = [T('簡單句', 'simple'), T('合句', 'compound'), T('複句', 'complex'), T('複合複句', 'compound-complex')];
      const why = [
        T(`只有一個獨立子句：「${A}」。`, `It has one independent clause: "${A}".`),
        T(`兩個獨立子句「${A}」和「${B}」用「${cj}」連接。`, `Two independent clauses, "${A}" and "${B}", joined by "${cj}".`),
        T(`一個從屬子句「${S}」加上一個獨立子句「${A}」。`, `A dependent clause, "${S}", plus one independent clause, "${A}".`),
        T(`從屬子句「${S}」加上兩個獨立子句「${A}」和「${B}」。`, `A dependent clause, "${S}", plus two independent clauses, "${A}" and "${B}".`),
      ][k];
      return {
        q: T('這是哪一種句型？', 'What kind of sentence is this?'),
        text: s,
        ans: ansChoice([L[k], ...L.filter((_, j) => j !== k)]),
        sol: [why, T(`所以它是${L[k].zh}。`, `So it is a ${L[k].en} sentence.`)],
      };
    },
  },
  {
    id: 'g6-formal-style',
    grade: 6,
    unit: 'style',
    name: T('正式的語氣和風格', 'Formal style and tone'),
    std: 'CCSS L.6.3b',
    lesson: {
      zh: '報告和論說文要保持<b>正式語氣</b>：不用俚語（awesome、stuff、kinda、tons of）、不跟讀者聊天（you guys、guess what）、不用 LOL 或很多驚嘆號。用精準、客觀的字。',
      en: 'Reports and essays keep a <b>formal style</b>: no slang (awesome, stuff, kinda, tons of), no chatting with the reader (you guys, guess what), no LOL or piles of exclamation marks. Use precise, objective words.',
      ex: ['Informal: The experiment was super cool!', 'Formal: The experiment produced surprising results.'],
    },
    gen(r) {
      if (r.chance(0.5)) {
        const items = [
          ['The experiment produced surprising results.', 'The experiment was super cool and kinda surprising.', 'Guess what? The experiment was awesome!'],
          ['Many students believe that lunch should be longer.', 'Lots of kids think lunch is way too short.', 'Lunch is sooo short, you know?'],
          ["Volcanoes form when melted rock rises through the Earth's crust.", 'Volcanoes happen when hot gooey stuff pushes up.', 'Volcanoes are, like, mountains that blow up and stuff.'],
          ['In conclusion, recycling helps protect the environment.', 'So yeah, recycling is pretty good for the planet.', 'Anyway, you guys should totally recycle.'],
          ['The author uses vivid details to describe the setting.', 'The author does a really awesome job with the setting stuff.', 'I think the setting part is cool, LOL.'],
          ['Honeybees communicate by performing a special dance.', 'Bees talk to each other with this crazy dance thing.', 'Bees do a funny little wiggle to chat, which is hilarious!'],
          ['The survey showed that most families recycle every week.', 'Tons of families recycle a bunch, according to our survey.', 'Our survey said pretty much everybody recycles, duh.'],
          ['The city council should build more bike lanes.', 'The city should just make a ton more bike lanes, okay?', 'Bike lanes are awesome, so build more!!!'],
        ];
        const it = r.pick(items);
        return {
          q: T('哪一句最適合放在正式的報告裡？', 'Which sentence fits a formal report best?'),
          ans: ansChoice(it),
          sol: [T('正式的句子沒有俚語、沒有和讀者聊天，用字精準客觀。', 'The formal sentence has no slang, does not chat with the reader, and uses precise, objective words.'), T(`最好：${it[0]}`, `Best: ${it[0]}`)],
        };
      }
      const items = [
        'The results of the experiment were [awesome|impressive].', 'The scientist found [tons|dozens] of fossils near the cliff.', 'Our class survey showed that most [kids|students] want a longer recess.',
        'The museum has a [cool|remarkable] collection of ancient coins.', 'Rain forests are home to a [bunch|variety] of animals.', 'The mayor said the new park would be [awesome|beneficial] for families.',
        'The main character feels [bummed|disappointed] when the trip is canceled.', 'The report explains how bridges [kinda|partly] depend on triangles for strength.',
      ];
      const m = marked(r.pick(items));
      return {
        q: T('點出不夠正式的字（俚語）。', 'Tap the word that is too informal for a report.'),
        ans: ansTap(m.ws, m.idx),
        sol: [T(`「${m.wrong}」是口語或俚語，不適合正式寫作。`, `"${m.wrong}" is slang or casual speech, which does not fit formal writing.`), T(`改成：${m.good}`, `Better: ${m.good}`)],
      };
    },
  },
  {
    id: 'g6-context-clues',
    grade: 6,
    unit: 'words',
    name: T('用上下文猜字義', 'Context clues'),
    std: 'CCSS L.6.4a',
    lesson: {
      zh: '遇到生字時，看看<b>前後文的線索</b>：<b>定義或解釋</b>（後面接著說明）、<b>例子</b>、<b>相反詞</b>（unlike、but）、<b>因果</b>（so、because）。',
      en: 'When you meet a new word, look for <b>context clues</b> nearby: a <b>definition</b> or restatement, an <b>example</b>, an <b>opposite</b> (unlike, but), or a <b>cause and effect</b> (so, because).',
      ex: ['After weeks without rain, the <b>arid</b> fields cracked. (clue: without rain, cracked → very dry)'],
    },
    gen(r) {
      const items = [
        ['After weeks without rain, the <b>arid</b> fields cracked under the hot sun.', T('非常乾燥的', 'very dry'), [T('積滿雪的', 'covered in snow'), T('開滿花的', 'full of flowers'), T('很擁擠的', 'very crowded')]],
        ['{g} was so <b>ravenous</b> after the hike that she ate three sandwiches.', T('非常餓的', 'extremely hungry'), [T('很睏的', 'very sleepy'), T('很生氣的', 'very angry'), T('很害羞的', 'very shy')]],
        ['Unlike his <b>frugal</b> sister, who saves every penny, {m} spends his allowance right away.', T('節儉的、很會省錢的', 'careful about spending money'), [T('浪費的', 'wasteful'), T('健忘的', 'forgetful'), T('很高的', 'very tall')]],
        ['The <b>meticulous</b> artist checked every tiny brushstroke twice.', T('非常注意細節的', 'very careful about details'), [T('粗心的', 'careless'), T('很急的', 'in a hurry'), T('很吵的', 'very loud')]],
        ['The <b>reluctant</b> puppy refused to step into the bath, no matter how much we coaxed it.', T('不情願的', 'unwilling'), [T('很興奮的', 'excited'), T('很小的', 'tiny'), T('乾淨的', 'clean')]],
        ['{g} was <b>elated</b> when she won first prize; she jumped up and cheered.', T('非常高興的', 'very happy'), [T('擔心的', 'worried'), T('無聊的', 'bored'), T('困惑的', 'confused')]],
        ['Dark clouds gathered and the wind howled, an <b>ominous</b> sign that a storm was coming.', T('不祥的、預示壞事的', 'warning that something bad is coming'), [T('令人開心的', 'cheerful'), T('色彩繽紛的', 'colorful'), T('安靜的', 'quiet')]],
        ['The bear stays <b>dormant</b> all winter, sleeping in its den until spring.', T('不活動的、休眠的', 'inactive, as if asleep'), [T('很餓的', 'very hungry'), T('很危險的', 'dangerous'), T('很吵的', 'noisy')]],
        ['The garden had an <b>abundant</b> harvest; there were more tomatoes than we could eat.', T('非常多的', 'more than enough'), [T('很少的', 'very small'), T('腐爛的', 'rotten'), T('太晚的', 'late')]],
        ['The paper was so <b>translucent</b> that we could see the lamp glowing through it.', T('半透明的（光可以透過）', 'letting light pass through'), [T('很重的', 'heavy'), T('撕破的', 'torn'), T('很厚的', 'very thick')]],
        ['Our <b>benevolent</b> neighbor bakes bread for anyone on the street who is sick.', T('仁慈慷慨的', 'kind and generous'), [T('脾氣差的', 'grumpy'), T('很吵的', 'noisy'), T('很懶的', 'lazy')]],
        ['The <b>novice</b> skater wobbled and fell, because it was her first time on the ice.', T('新手', 'a beginner'), [T('專家', 'an expert'), T('教練', 'a coach'), T('裁判', 'a judge')]],
        ['The speech was so <b>tedious</b> that half the audience fell asleep.', T('冗長無聊的', 'long and boring'), [T('好笑的', 'funny'), T('很短的', 'short'), T('令人害怕的', 'scary')]],
        ['Please <b>discard</b> the empty boxes; we do not need them anymore.', T('丟掉', 'throw away'), [T('打開', 'open'), T('上色', 'paint'), T('收藏', 'keep')]],
      ];
      const [s0, right, wrongs] = r.pick(items), s = fill(s0, cast(r)), w = s.match(/<b>(.*?)<\/b>/)[1];
      return {
        q: T(`用上下文判斷，「${w}」最可能是什麼意思？`, `Use context clues. What does "${w}" most likely mean?`),
        text: s,
        ans: ansChoice([right, ...wrongs]),
        sol: [T('找出句子裡說明這個字的線索（原因、結果、例子或相反詞）。', 'Find the clue words that explain the word (a cause, an effect, an example or an opposite).'), T(`「${w}」的意思是：${right.zh}。`, `"${w}" means: ${right.en}.`)],
      };
    },
  },
  {
    id: 'g6-connotation',
    grade: 6,
    unit: 'words',
    name: T('字的內涵：褒義和貶義', 'Connotation and denotation'),
    std: 'CCSS L.6.5c',
    lesson: {
      zh: '<b>字面意思</b>（denotation）是字典上的定義；<b>內涵</b>（connotation）是字帶來的感覺。thrifty 和 stingy 都是「不愛花錢」，但 thrifty 是稱讚（節儉），stingy 是批評（小氣）。',
      en: 'A word\'s <b>denotation</b> is its dictionary meaning; its <b>connotation</b> is the feeling it carries. "Thrifty" and "stingy" both mean not spending much money, but "thrifty" is praise and "stingy" is criticism.',
      ex: ['positive: <b>curious</b> · neutral: interested · negative: <b>nosy</b>', 'positive: <b>slender</b> · neutral: thin · negative: <b>skinny</b>'],
    },
    gen(r) {
      const sets = [
        ['thrifty', '', 'stingy', 'adj'], ['curious', 'interested', 'nosy', 'adj'], ['confident', '', 'arrogant', 'adj'], ['slender', 'thin', 'skinny', 'adj'],
        ['determined', '', 'stubborn', 'adj'], ['youthful', 'young', 'childish', 'adj'], ['relaxed', '', 'lazy', 'adj'], ['unique', 'different', 'weird', 'adj'],
        ['assertive', '', 'pushy', 'adj'], ['aroma', 'smell', 'stench', 'n'], ['inexpensive', '', 'cheap', 'adj'],
      ];
      const [pos, neu, neg, kind] = r.pick(sets), wantPos = r.chance(0.5), n = cast(r).a;
      const right = wantPos ? pos : neg, wrong = wantPos ? [neg] : [pos, ...(neu ? [neu] : [])];
      const q = kind === 'adj'
        ? (wantPos ? T(`哪個字讓 ${n} 聽起來最「正面」？${n} is ___.`, `Which word makes ${n} sound the most positive? ${n} is ___.`) : T(`哪個字讓 ${n} 聽起來最「負面」？${n} is ___.`, `Which word makes ${n} sound the most negative? ${n} is ___.`))
        : (wantPos ? T('哪個字的內涵最正面？', 'Which word has the most positive connotation?') : T('哪個字的內涵最負面？', 'Which word has the most negative connotation?'));
      return {
        q,
        ans: ansChoice([right, ...wrong]),
        sol: [T(`這些字的字面意思相近，但感覺不同：「${pos}」是正面的${neu ? `，「${neu}」是中性的` : ''}，「${neg}」是負面的。`, `These words have similar denotations but different connotations: "${pos}" is positive${neu ? `, "${neu}" is neutral` : ''}, and "${neg}" is negative.`), T(`答案：${right}`, `Answer: ${right}`)],
      };
    },
  },
  {
    id: 'g6-claim-reason-evidence',
    grade: 6,
    unit: 'organization',
    name: T('主張、理由、證據', 'Claim, reason and evidence'),
    std: 'CCSS W.6.1a',
    lesson: {
      zh: '論說文有三個基本零件：<b>主張</b>（你的立場，例如「學校應該…」）、<b>理由</b>（為什麼你這樣認為）、<b>證據</b>（支持理由的事實、數字、調查或專家的話）。證據通常有具體的數字或來源。',
      en: 'An argument has three basic parts: the <b>claim</b> (your position, such as "Our school should…"), <b>reasons</b> (why you believe it), and <b>evidence</b> (facts, numbers, surveys or expert words that back up a reason). Evidence usually has specific numbers or a source.',
      ex: ['Claim: Our school should make recess longer.', 'Reason: Students focus better after they move.', 'Evidence: In our class survey, 21 of 25 students said they focus better after recess.'],
    },
    gen(r) {
      const A = [
        ['Our school should make recess longer.', ['Students pay better attention after they have time to move.', 'A longer recess gives students more time to make friends.'], ['In our class survey, 21 of 25 students said they focus better after recess.', 'Our P.E. teacher, Mr. Diaz, has noticed that students who play outside are calmer during afternoon lessons.']],
        ['Students should not have to wear school uniforms.', ['Choosing their own clothes lets students show who they are.', 'Uniforms can cost families extra money.'], ['When our class compared prices, one uniform set cost $80, while a T-shirt and jeans cost about $25.', 'In a poll of 60 sixth graders, 48 said they would feel more comfortable in their own clothes.']],
        ['Our cafeteria should stop using plastic straws.', ['Plastic straws often end up in rivers and oceans.', 'Paper straws work just as well for most drinks.'], ['In one week, our cafeteria threw away 640 plastic straws.', 'At a beach cleanup last spring, our class picked up 112 straws in one hour.']],
        ['The town library should stay open on Sundays.', ['Many families are too busy on weekdays to visit.', 'Students need a quiet place to study before Monday tests.'], ['According to the librarian, Saturday is the busiest day, with twice as many visitors as any weekday.', 'In a survey of 200 families, 130 said Sunday afternoon would be their best time to visit.']],
        ['Every sixth grader should learn to cook a simple meal.', ['Cooking teaches kids to follow steps and measure carefully.', 'Kids who can cook are able to help their families at home.'], ['In our cooking club, 18 of 20 members said they now make breakfast on weekends.', 'Our school nurse reports that students who cook at home are more willing to try vegetables.']],
      ];
      const [claim, reasons, evid] = r.pick(A), t = r.pick(['c', 'r', 'r', 'e', 'e']);
      const target = t === 'c' ? claim : t === 'r' ? r.pick(reasons) : r.pick(evid);
      const L = { c: T('主張', 'claim'), r: T('理由', 'reason'), e: T('證據', 'evidence') };
      const why = t === 'c' ? T('這句說出作者的立場（應該怎麼做），是主張。', 'It states the writer\'s position (what should happen), so it is the claim.')
        : t === 'r' ? T('這句解釋「為什麼」作者支持這個主張，但沒有具體數字或來源，是理由。', 'It explains why the writer holds the claim, without specific numbers or a source, so it is a reason.')
        : T('這句提供具體的數字、調查或專家的話來支持理由，是證據。', 'It gives specific numbers, a survey or an expert\'s words to back up a reason, so it is evidence.');
      return {
        q: T(`在這篇論說文中，「${target}」是主張、理由，還是證據？`, `In this argument, is "${target}" a claim, a reason, or evidence?`),
        text: [claim, reasons[0], evid[0], reasons[1], evid[1]].join(' '),
        ans: ansChoice([L[t], ...Object.keys(L).filter((x) => x !== t).map((x) => L[x])]),
        sol: [why, T(`這篇的主張是：${claim}`, `The claim of this argument: ${claim}`)],
      };
    },
  },
  {
    id: 'g6-paraphrase-cite',
    grade: 6,
    unit: 'research',
    name: T('改寫、引用和避免抄襲', 'Paraphrasing, quoting and avoiding plagiarism'),
    std: 'CCSS W.6.8',
    lesson: {
      zh: '使用別人的資料時有兩種正確方法：<b>改寫</b>（paraphrase）——用自己的話和句型重說，意思不變，並註明來源；<b>直接引用</b>——一字不改，加上引號並註明來源。照抄原句卻沒有引號，或沒有註明來源，都是<b>抄襲</b>。',
      en: 'There are two honest ways to use a source. <b>Paraphrase</b>: say it in your own words and sentence pattern, keep the meaning, and name the source. <b>Quote</b>: copy the exact words inside quotation marks and name the source. Copying words without quotation marks, or leaving out the source, is <b>plagiarism</b>.',
      ex: ['Source (Dr. Ortiz): "Sea otters wrap themselves in kelp so that currents do not carry them away while they sleep."', 'Paraphrase: According to Dr. Ortiz, sea otters use seaweed like a seatbelt to stay in place during naps.'],
    },
    gen(r) {
      const S = [
        ['Dr. Lena Ortiz', 'Sea otters wrap themselves in kelp so that ocean currents do not carry them away while they sleep.', 'sea otters use seaweed like a seatbelt to stay in one place during their naps', 'sea otters eat kelp before they go to sleep'],
        ['Kenji Sato', 'Honeybees must visit about two million flowers to make one pound of honey.', 'bees have to stop at millions of blossoms just to produce a single pound of honey', 'a bee can make a pound of honey from just a few flowers'],
        ['Professor Amara Diallo', 'The Great Wall of China was built over many centuries by different rulers, not all at once.', 'many rulers added to the Great Wall over hundreds of years instead of building it in one period', 'one emperor built the entire Great Wall in a single year'],
        ['Dr. Sofia Novak', 'Children who sleep nine to eleven hours a night tend to remember what they learn more easily.', 'kids who get plenty of sleep usually find it easier to recall their lessons', 'sleeping fewer hours helps children remember more'],
        ['Grace Kim', 'Recycling one aluminum can saves enough energy to run a television for about three hours.', 'the energy saved by recycling a single can could power a TV for roughly three hours', 'recycling one can uses up three hours of electricity'],
        ['Dr. Omar Haddad', 'Desert plants such as cacti store water in their thick stems to survive long dry seasons.', 'cacti and similar plants keep water inside their fat stems, which helps them live through months without rain', 'cacti need rain every day in order to survive'],
      ];
      const [au, src, para, changed] = r.pick(S), last = au.split(' ').pop(), title = au.startsWith('Dr.') ? `Dr. ${last}` : au.startsWith('Professor') ? `Professor ${last}` : au;
      const lead = r.pick(['According to', 'As explained by']);
      if (r.chance(0.6)) {
        const right = `${lead} ${title}, ${para}.`;
        return {
          q: T('哪一個是正確的改寫（用自己的話、意思不變、註明來源）？', 'Which is a correct paraphrase (own words, same meaning, source named)?'),
          text: `${au}: "${src}"`,
          ans: ansChoice([right, src, `${cap(para)}.`, `${lead} ${title}, ${changed}.`]),
          sol: [T('照抄原句又沒加引號是抄襲；沒註明來源也是抄襲；改變了原意則是錯誤的改寫。', 'Copying the sentence without quotation marks is plagiarism; leaving out the source is plagiarism too; changing the meaning makes the paraphrase wrong.'), T(`正確：${right}`, `Correct: ${right}`)],
        };
      }
      const say = r.pick(['writes', 'explains']), right = `${title} ${say}, "${src}"`;
      return {
        q: T('哪一個是正確的直接引用？', 'Which one quotes the source correctly?'),
        text: `${au}: "${src}"`,
        ans: ansChoice([right, `${title} ${say}, ${src}`, `"${src}"`, `${title} ${say}, "${cap(changed)}."`]),
        sol: [T('直接引用要一字不改、放進引號，並且說出是誰說的。', 'A quotation copies the exact words, puts them in quotation marks, and names the source.'), T(`正確：${right}`, `Correct: ${right}`)],
      };
    },
  },
  {
    id: 'g6-thesis',
    grade: 6,
    unit: 'organization',
    name: T('寫出有力的主旨句', 'Writing a strong thesis'),
    std: 'CCSS W.6.1a',
    lesson: {
      zh: '<b>主旨句</b>（thesis）用一句話說出你的立場或主要想法，並暗示你的理由。它不能只是一個事實、一個問題、太籠統的話，或「我要寫…」這種宣告。',
      en: 'A <b>thesis</b> states your position or main idea in one sentence and hints at your reasons. It should not be just a fact, a question, something too broad, or an announcement like "In this essay I will…".',
      ex: ['Weak: School is important.', 'Weak: In this essay, I will talk about school start times.', 'Strong: Our middle school should start at 8:30 because students need more sleep to learn well.'],
    },
    gen(r) {
      const items = [
        ['Our middle school should start at 8:30 instead of 7:45 because students need more sleep to learn well.', 'Our middle school starts at 7:45 every morning.', 'In this essay, I am going to talk about school start times.', 'School is important.', 'What time should school start?'],
        ['Every classroom should have a class pet because caring for an animal teaches responsibility and teamwork.', 'Some classrooms have hamsters or fish.', 'This essay is about class pets.', 'Animals are nice.', 'Should classrooms have pets?'],
        ['Some video games can help students learn because they build problem-solving skills and reward players who keep trying.', 'Many people play video games.', 'I will now tell you about video games.', 'Games are a big part of life.', 'Are video games good or bad?'],
        ['Team sports teach lessons that last longer than any trophy: how to cooperate, how to lose gracefully, and how to keep practicing.', 'Our school has a soccer team and a basketball team.', 'My essay will be about team sports.', 'Sports are fun for everyone.', 'Why do people play team sports?'],
        ['Field trips should stay in our school budget because they let students see and touch what they read about in books.', 'Our class went to the science museum last year.', 'In this paper, I will discuss field trips.', 'Learning happens everywhere.', 'Are field trips worth the money?'],
        ['Our town should build a skate park because teens need a safe place to be active after school.', 'Our town does not have a skate park.', 'This essay will be about skate parks.', 'Parks are good for towns.', 'Does our town need a skate park?'],
      ];
      const [strong, fact, ann, broad, quest] = r.pick(items);
      return {
        q: T('哪一個是最有力的主旨句？', 'Which is the strongest thesis statement?'),
        ans: ansChoice([strong, ...r.sample([fact, ann, broad, quest], 3)]),
        sol: [T('有力的主旨句說出明確的立場，並提到理由。', 'A strong thesis takes a clear position and gives a reason.'), T(`最好：${strong}`, `Best: ${strong}`), T('其他選項只是事實、問句、太籠統，或只是宣告要寫什麼。', 'The others are only a fact, a question, too broad, or an announcement.')],
      };
    },
  },
  {
    id: 'g6-conclusion',
    grade: 6,
    unit: 'paragraphs',
    name: T('寫出好的結尾句', 'Strong concluding sentences'),
    std: 'CCSS W.6.2f',
    lesson: {
      zh: '<b>結尾句</b>要把段落收好：用新的說法<b>重述主要想法</b>，或說明它為什麼重要。不要在結尾突然提出新話題，也不要只是重複某個細節。',
      en: 'A <b>concluding sentence</b> wraps up the paragraph: it <b>restates the main idea</b> in fresh words or tells why it matters. It should not bring up a new topic or simply repeat one detail.',
      ex: ['Main idea: Bees help farmers.', 'Conclusion: Without busy bees, many of the foods we love would disappear from our tables.'],
    },
    gen(r) {
      const items = [
        ['Bees are some of the hardest workers on a farm. As they fly from flower to flower, they carry pollen that helps apples, almonds, and berries grow. One hive can visit thousands of blossoms in a single day.', 'Without busy bees, many of the foods we love would disappear from our tables.', ['Some bees can sting more than once.', 'One hive can visit thousands of blossoms in a single day.', 'Butterflies are also very colorful insects.']],
        ['Walking to school has many benefits. It gives students exercise before class begins. It also cuts down on car traffic and air pollution near the school.', 'A short walk each morning is good for students and for the whole neighborhood.', ['It gives students exercise before class begins.', 'Some students ride the bus because they live far away.', 'My favorite sneakers are blue.']],
        ['The Great Barrier Reef is home to an amazing variety of life. More than a thousand kinds of fish swim among its corals. Sea turtles, sharks, and dolphins also visit the reef.', 'Protecting the reef means protecting thousands of creatures that depend on it.', ['Sea turtles, sharks, and dolphins also visit the reef.', 'Deserts are very dry places.', 'Australia also has kangaroos.']],
        ['Learning a second language opens many doors. It lets you talk with people from other places. It can even help you understand your own language better.', 'A new language is a key that unlocks new friends, new places, and new ideas.', ['It lets you talk with people from other places.', 'Spanish has many words that end in a vowel.', 'Math is another important subject.']],
        ['Volunteering at the animal shelter taught me patience. Some scared dogs needed days before they would come near me. I learned to sit quietly and let them come to me.', 'At the shelter, I learned that trust grows slowly, one quiet visit at a time.', ['Some scared dogs needed days before they would come near me.', 'The shelter also needs blankets and towels.', 'I want to visit a zoo next summer.']],
        ['Recycling paper helps save forests. Every ton of recycled paper means fewer trees need to be cut down. Recycling also keeps paper out of landfills.', 'Each sheet we recycle is a small way to keep our forests standing.', ['Recycling also keeps paper out of landfills.', 'Glass bottles come in green and brown.', 'Some trees grow very tall.']],
        ['Owls are built for hunting at night. Their huge eyes gather even tiny amounts of light. Their soft feathers let them fly almost silently toward their prey.', 'With sharp eyes and silent wings, owls rule the night sky.', ['Their huge eyes gather even tiny amounts of light.', 'Some birds migrate south for the winter.', 'My uncle has a pet parrot.']],
        ['A good night of sleep helps students do well in school. Sleep gives the brain time to store what it learned during the day. Rested students also find it easier to stay patient with friends and teachers.', 'Getting enough sleep may be the simplest way to have a better school day.', ['Sleep gives the brain time to store what it learned during the day.', 'Breakfast is also an important meal.', 'My pillow is very soft.']],
        ['Our school\'s new reading buddies program has been a success. Every Friday, sixth graders read picture books with first graders. The younger students have started checking out more books from the library.', 'By sharing stories, both older and younger students are growing as readers.', ['Every Friday, sixth graders read picture books with first graders.', 'The library also has a computer lab.', 'First graders have recess at ten.']],
        ['Rain forests are sometimes called the lungs of the planet. Their trees take in carbon dioxide and release oxygen. They also provide homes for more than half of the world\'s plant and animal species.', 'Protecting rain forests means protecting the air we breathe and the creatures we share Earth with.', ['Their trees take in carbon dioxide and release oxygen.', 'Deserts can be very cold at night.', 'Monkeys are fun to watch at the zoo.']],
        ['Practicing an instrument teaches more than music. Students learn to set goals, such as mastering a hard song by the spring concert. They also learn to keep trying after making mistakes.', 'An hour of practice builds both a better musician and a more patient person.', ['Students learn to set goals, such as mastering a hard song by the spring concert.', 'Some instruments are very expensive.', 'My favorite singer has a new album.']],
        ['Public parks make a city healthier. They give people a free place to walk, run, and play. Trees in parks also cool the air on hot summer days.', 'Every new park is an investment in a city\'s health and happiness.', ['They give people a free place to walk, run, and play.', 'Some cities have subways.', 'I had a picnic last summer.']],
        ['Carrying a reusable water bottle is an easy habit with big benefits. It keeps you from buying plastic bottles that end up in landfills. It also saves families money over a year.', 'A simple bottle in your backpack can help both your wallet and the planet.', ['It also saves families money over a year.', 'Some water bottles are made of glass.', 'Lemonade is my favorite drink.']],
        ['The invention of the printing press changed how people learned. Before it, books were copied by hand and were very rare. Afterward, books became cheaper, and many more people learned to read.', 'By making books available to many people, the printing press opened the door to learning for the world.', ['Before it, books were copied by hand and were very rare.', 'Today, many people read on tablets.', 'Paper is made from trees.']],
        ['Learning to cook builds independence. Young cooks learn to plan meals and follow recipes step by step. They also learn to clean up and use kitchen tools safely.', 'Each meal a young cook makes is a small step toward taking care of themselves.', ['Young cooks learn to plan meals and follow recipes step by step.', 'Some restaurants deliver food.', 'Pizza is popular in many countries.']],
      ];
      const [para, good, bad] = r.pick(items);
      return {
        q: T('哪一句最適合當這段的結尾句？', 'Which sentence is the best conclusion for this paragraph?'),
        text: para,
        ans: ansChoice([good, ...bad]),
        sol: [T('好的結尾句用新的說法重述主要想法，或說明它為什麼重要。', 'A good conclusion restates the main idea in new words or shows why it matters.'), T(`最好：${good}`, `Best: ${good}`), T('其他選項是重複的細節、新的話題，或和主題無關。', 'The other choices repeat a detail, start a new topic, or are off topic.')],
      };
    },
  },
  {
    id: 'g6-affixes-roots',
    grade: 6,
    unit: 'words',
    name: T('字首、字尾和字根猜字義', 'Greek and Latin affixes and roots'),
    std: 'CCSS L.6.4b',
    lesson: {
      zh: '把生字拆成<b>字首 + 字根 + 字尾</b>就能猜出意思：<b>bene</b> 好、<b>mal</b> 壞、<b>trans</b> 穿越、<b>inter</b> 在…之間、<b>sub</b> 在…下面、<b>pre</b> 之前、<b>anti</b> 反對、<b>circum</b> 環繞、<b>multi</b> 很多、<b>chron</b> 時間、<b>aqua</b> 水、<b>-ology</b> …學、<b>-able</b> 可以…的。',
      en: 'Break a new word into <b>prefix + root + suffix</b> to figure it out: <b>bene</b> good, <b>mal</b> bad, <b>trans</b> across, <b>inter</b> between, <b>sub</b> under, <b>pre</b> before, <b>anti</b> against, <b>circum</b> around, <b>multi</b> many, <b>chron</b> time, <b>aqua</b> water, <b>-ology</b> study of, <b>-able</b> able to be.',
      ex: ['<b>sub</b> + marine = a ship that travels <b>under</b> the sea', '<b>chron</b>ological = arranged in <b>time</b> order'],
    },
    gen(r) {
      const W = [
        ['benefactor', 'bene', T('好', 'good'), T('幫助別人或捐錢給別人的人', 'a person who gives help or money to others'), [T('製造麻煩的人', 'a person who causes trouble'), T('經營工廠的人', 'a person who runs a factory')]],
        ['malfunction', 'mal', T('壞、不好地', 'bad or badly'), T('運作不正常、故障', 'to work badly or fail'), [T('運作得非常好', 'to work very well'), T('開始運作', 'to start working')]],
        ['transatlantic', 'trans', T('穿越', 'across'), T('橫越大西洋的', 'crossing the Atlantic Ocean'), [T('在大西洋底下的', 'under the Atlantic Ocean'), T('靠近大西洋的', 'near the Atlantic Ocean')]],
        ['international', 'inter', T('在…之間', 'between'), T('國家和國家之間的', 'between or among nations'), [T('只在一個國家裡的', 'inside one nation'), T('沒有國家的', 'without a nation')]],
        ['submarine', 'sub', T('在…下面', 'under'), T('在海面下航行的船', 'a ship that travels under the sea'), [T('會飛的船', 'a ship that flies'), T('很大的帆船', 'a very large sailboat')]],
        ['preview', 'pre', T('之前', 'before'), T('事先看一看', 'a look at something before it is shown'), [T('看完之後的評論', 'a review after something ends'), T('看不見的景色', 'a hidden view')]],
        ['antifreeze', 'anti', T('反對、對抗', 'against'), T('防止結冰的液體', 'a liquid that keeps things from freezing'), [T('很快會結冰的液體', 'a liquid that freezes quickly'), T('冰凍的甜點', 'a frozen dessert')]],
        ['circumnavigate', 'circum', T('環繞', 'around'), T('繞行一整圈', 'to sail all the way around'), [T('直直地航行過去', 'to sail straight across'), T('迷路', 'to get lost at sea')]],
        ['multilingual', 'multi', T('很多', 'many'), T('會說多種語言的', 'able to speak many languages'), [T('不會說話的', 'unable to speak'), T('說話很大聲的', 'speaking very loudly')]],
        ['geology', 'ology', T('…的學問', 'the study of'), T('研究地球和岩石的學問', 'the study of the Earth and its rocks'), [T('一張世界地圖', 'a map of the world'), T('害怕岩石', 'a fear of rocks')]],
        ['chronological', 'chron', T('時間', 'time'), T('按照時間先後排列的', 'arranged in time order'), [T('按照大小排列的', 'arranged by size'), T('按照顏色排列的', 'arranged by color')]],
        ['aquarium', 'aqua', T('水', 'water'), T('養魚和水中生物的水箱', 'a water tank for fish and sea creatures'), [T('沙漠花園', 'a desert garden'), T('鳥籠', 'a cage for birds')]],
        ['misunderstand', 'mis', T('錯誤地', 'wrongly'), T('理解錯誤', 'to understand wrongly'), [T('完全理解', 'to understand perfectly'), T('完全忘記', 'to forget completely')]],
        ['portable', 'port', T('攜帶', 'carry'), T('容易攜帶的', 'easy to carry'), [T('太重搬不動的', 'too heavy to move'), T('用金屬做的', 'made of metal')]],
      ];
      const i = r.int(0, W.length - 1), [w, part, pm, def, wrongs] = W[i];
      if (r.chance(0.6)) {
        return {
          q: T(`「${part}」的意思是「${pm.zh}」。「${w}」最可能是什麼意思？`, `"${part}" means "${pm.en}". What does "${w}" most likely mean?`),
          ans: ansChoice([def, ...wrongs]),
          sol: [T(`把字拆開：${w} 裡有「${part}」（${pm.zh}）。`, `Break it apart: "${w}" contains "${part}" (${pm.en}).`), T(`所以 ${w} 的意思是：${def.zh}。`, `So "${w}" means: ${def.en}.`)],
        };
      }
      return {
        q: T(`「${w}」裡的「${part}」是什麼意思？`, `In "${w}", what does "${part}" mean?`),
        ans: ansChoice(opts(r, pm, W.filter((_, j) => j !== i).map((x) => x[2]))),
        sol: [T(`「${part}」的意思是「${pm.zh}」。`, `"${part}" means "${pm.en}".`), T(`${w} = ${def.zh}`, `${w} = ${def.en}`)],
      };
    },
  },
];

const prompts = [
  // ======================= GRADE 4 =======================
  {
    id: 'w4-personal-memory',
    grade: 4,
    genre: 'personal',
    std: 'CCSS W.4.3',
    title: T('一個難忘的時刻', 'A moment I will never forget'),
    topics: [T('第一次做某件事', 'the first time I tried something new'), T('我很驕傲的一天', 'a day I felt proud'), T('一次好笑的意外', 'a funny mistake'), T('一次全家出遊', 'a family trip'), T('我幫助別人的時候', 'a time I helped someone'), T('我很緊張的時候', 'a time I was nervous')],
    prompt: T('寫一篇真實的個人故事，主題是：{t}。按照時間順序寫，加入感官細節、對話和你的感受。', 'Write a true story about {t}. Tell events in order, and include sensory details, dialogue, and your feelings.'),
    plan: [
      { label: T('開頭', 'Beginning'), hint: T('人物、地點、發生了什麼事？用一句吸引人的話開始。', 'Who, where, what was happening? Start with a hook.') },
      { label: T('事件一', 'First event'), hint: T('First, …', 'First, …') },
      { label: T('事件二', 'Next event'), hint: T('Then / Suddenly, …', 'Then / Suddenly, …') },
      { label: T('最精彩的部分', 'The most exciting part'), hint: T('慢慢寫：看到、聽到、感覺到什麼？', 'Slow down: what did you see, hear, and feel?') },
      { label: T('結尾', 'Ending'), hint: T('結果怎麼樣？你學到什麼？', 'How did it end? What did you learn?') },
    ],
    starters: ['I will never forget the day …', 'My heart was pounding when …', 'At first, …', 'Suddenly, …', '"…," I said.', 'In the end, …', 'Now I know that …'],
    words: [150, 300],
    checklist: [
      T('開頭有吸引人的句子。', 'My beginning has a hook.'),
      T('事件按照時間順序，並用了轉折詞。', 'Events are in order and I used time words.'),
      T('我加了看到、聽到、聞到或感覺到的細節。', 'I added details about what I saw, heard, smelled or felt.'),
      T('我至少用了一句對話，引號和逗號正確。', 'I used at least one line of dialogue with correct quotation marks and commas.'),
      T('我寫出了自己的感受。', 'I showed my feelings.'),
      T('結尾說明結果或我學到的事。', 'My ending tells how it turned out or what I learned.'),
      T('我檢查了拼字、大寫和標點。', 'I checked spelling, capitals and punctuation.'),
    ],
    mentor: {
      title: 'The Day I Jumped',
      text: 'I will never forget the day I jumped off the high diving board. All summer, I had watched the big kids climb the tall ladder at the city pool. They made it look so easy.\n\nOn the last Saturday of vacation, my cousin Ella dared me to try. My legs felt like noodles as I climbed. Each metal step was cold and wet under my toes. When I reached the top, the pool looked as tiny as a bathtub, and the lifeguard looked like a toy.\n\n"You can do it!" Ella shouted from below.\n\nI walked to the end of the board. It bounced a little, and my stomach did a flip. I took a deep breath, counted to three, and stepped off. For one second I was flying. Then the water rushed up and swallowed me with a giant splash.\n\nWhen I popped up, I heard Ella cheering. I was grinning so hard that my cheeks hurt. I climbed out and ran right back to the ladder.\n\nNow I know that the scariest part of doing something new is the moment right before you start.',
      note: T('作者按照時間順序寫，用感官細節（冰冷的鐵梯）和比喻（腿像麵條）讓讀者感同身受，還有對話，結尾說出學到的道理。', 'The writer tells events in order, uses sensory details (cold metal steps) and similes (legs like noodles), adds dialogue, and ends with a lesson learned.'),
    },
    vocab: ['suddenly', 'at first', 'after that', 'finally', 'my heart pounded', 'I realized'],
  },
  {
    id: 'w4-story-imaginative',
    grade: 4,
    genre: 'narrative',
    std: 'CCSS W.4.3',
    title: T('想像故事', 'An imaginative story'),
    topics: [T('一顆會說話的石頭', 'a rock that can talk'), T('一扇通往另一個世界的門', 'a door to another world'), T('一天變成很小很小', 'a day when you shrink to the size of an ant'), T('會實現願望的鉛筆', 'a pencil that makes wishes come true'), T('學校裡的神秘新同學', 'a mysterious new student'), T('迷路的小機器人', 'a lost little robot')],
    prompt: T('寫一個想像故事，主題是：{t}。故事要有角色、場景、一個問題，以及解決問題的過程。', 'Write an imaginative story about {t}. Include characters, a setting, a problem, and how the problem is solved.'),
    plan: [
      { label: T('角色和場景', 'Characters and setting'), hint: T('主角是誰？在哪裡？什麼時候？', 'Who is the main character? Where and when?') },
      { label: T('問題', 'Problem'), hint: T('發生了什麼麻煩？', 'What goes wrong?') },
      { label: T('事件', 'Events'), hint: T('角色試了哪些方法？', 'What does the character try?') },
      { label: T('解決', 'Solution'), hint: T('問題怎麼解決？', 'How is the problem solved?') },
      { label: T('結尾', 'Ending'), hint: T('角色有什麼改變或感受？', 'How does the character feel or change?') },
    ],
    starters: ['Once, on a rainy afternoon, …', 'Nobody believed …', 'Suddenly, …', '"What was that?" …', 'Just when …, …', 'From that day on, …'],
    words: [150, 300],
    checklist: [
      T('我介紹了角色和場景。', 'I introduced the characters and setting.'),
      T('故事有清楚的問題和解決方法。', 'My story has a clear problem and solution.'),
      T('我用對話和動作描寫角色。', 'I used dialogue and actions to show my characters.'),
      T('我用轉折詞讓事件順序清楚。', 'I used transition words so the order is clear.'),
      T('我用了精準的動詞和形容詞。', 'I used precise verbs and adjectives.'),
      T('結尾讓故事有個完整的結束。', 'My ending wraps up the story.'),
    ],
    mentor: {
      title: 'Pebble',
      text: 'On the first day of summer, Noah kicked a gray rock across the playground. "Ouch!" said the rock. "Do you mind?"\n\nNoah froze. He picked up the rock and stared at it. It had two tiny cracks that looked like sleepy eyes. "Did you just talk?" he whispered.\n\n"Of course I talked," the rock grumbled. "My name is Pebble, and I need your help. I rolled away from my family at the river, and I can\'t walk home without legs."\n\nNoah slipped Pebble into his pocket and pedaled his bike toward the river. The path was bumpy, and Pebble complained at every bump. When they reached the water, Noah saw hundreds of stones along the bank. They all looked exactly the same.\n\n"Which ones are your family?" Noah asked.\n\n"Listen," said Pebble.\n\nNoah held his breath. Under the splashing water, he heard a soft humming, like a song with no words. Pebble began to hum too. Noah followed the sound to a smooth, round pile of stones beneath a willow tree. Gently, he set Pebble on top.\n\nThe humming grew louder and happier. "Thank you, Noah," Pebble said. "Come visit anytime. Just don\'t kick us."\n\nFrom that day on, Noah always walked carefully around rocks, just in case.',
      note: T('故事一開始就出現問題（會說話的石頭），用對話展現角色個性，有清楚的解決過程，結尾幽默又呼應開頭。', 'The problem appears right away, dialogue shows each character\'s personality, the solution is clear, and the ending is funny and connects back to the beginning.'),
    },
    vocab: ['suddenly', 'meanwhile', 'just then', 'whispered', 'grumbled', 'from that day on'],
  },
  {
    id: 'w4-opinion-school',
    grade: 4,
    genre: 'opinion',
    std: 'CCSS W.4.1',
    title: T('你的看法是什麼？', 'What do you think?'),
    topics: [T('學生應該有更多下課時間嗎', 'whether students should get more recess'), T('教室應該養寵物嗎', 'whether classrooms should have a pet'), T('四年級生應該有手機嗎', 'whether fourth graders should have phones'), T('學校應該有午睡時間嗎', 'whether schools should have a quiet rest time'), T('暑假應該更短嗎', 'whether summer vacation should be shorter'), T('每天都該有回家作業嗎', 'whether there should be homework every day')],
    prompt: T('寫一篇意見文，討論{t}。清楚說出你的看法，給至少兩個理由，用事實和例子支持，最後寫結論。', 'Write an opinion piece about {t}. State your opinion clearly, give at least two reasons supported by facts and examples, and end with a conclusion.'),
    plan: [
      { label: T('開頭和看法', 'Introduction and opinion'), hint: T('用問題或有趣的事實開頭，然後說出看法。', 'Hook with a question or fact, then state your opinion.') },
      { label: T('理由一和例子', 'Reason 1 + example'), hint: T('First, … For example, …', 'First, … For example, …') },
      { label: T('理由二和例子', 'Reason 2 + example'), hint: T('Another reason is … ', 'Another reason is …') },
      { label: T('結論', 'Conclusion'), hint: T('用新的說法重述看法。', 'Restate your opinion in new words.') },
    ],
    starters: ['Have you ever wondered …?', 'I strongly believe that …', 'First, …', 'For example, …', 'Another reason is …', 'In addition, …', 'For these reasons, …'],
    words: [150, 300],
    checklist: [
      T('開頭清楚說出我的看法。', 'My introduction states my opinion clearly.'),
      T('我給了至少兩個理由。', 'I gave at least two reasons.'),
      T('每個理由都有事實或例子支持。', 'Each reason is supported by a fact or example.'),
      T('我用了連接詞（for example、in addition、because）。', 'I used linking words (for example, in addition, because).'),
      T('結論再次說明我的看法。', 'My conclusion restates my opinion.'),
      T('每個段落都有主題句。', 'Each paragraph has a topic sentence.'),
    ],
    mentor: {
      title: 'Every Classroom Needs a Pet',
      text: 'Imagine walking into class on a Monday morning and hearing a guinea pig squeak hello. I strongly believe that every classroom should have a class pet, because a pet teaches responsibility and makes school a calmer place.\n\nFirst, caring for a pet teaches students to be responsible. Someone has to fill the water bottle, add fresh food, and clean the cage. In our class, we take turns with a job chart. When it is my week, I remember to feed Peanut even on busy days, because I know he depends on me.\n\nAnother reason is that pets help students feel calm. Watching a fish swim or a guinea pig nibble a carrot can make a stressful day feel lighter. After a hard math test, many of my classmates like to sit quietly near Peanut\'s cage for a minute before the next lesson.\n\nSome people worry that pets are messy. However, with a clear job chart and a little practice, the mess stays small, and the lessons are big.\n\nFor these reasons, every classroom should welcome a furry, finned, or feathered friend. A class pet turns a room full of students into a team.',
      note: T('開頭用想像畫面吸引人，清楚說出看法和兩個理由；每個理由都有自己班上的例子；還回應了反對意見，結論換句話重述看法。', 'The hook paints a picture, the opinion and two reasons are clear, each reason has a real classroom example, an opposing view is answered, and the conclusion restates the opinion in new words.'),
    },
    vocab: ['I believe', 'first', 'for example', 'another reason', 'however', 'for these reasons'],
  },
  {
    id: 'w4-informative-animal',
    grade: 4,
    genre: 'informative',
    std: 'CCSS W.4.2',
    title: T('動物小報告', 'All about an animal'),
    topics: [T('海獺', 'sea otters'), T('蜜蜂', 'honeybees'), T('企鵝', 'penguins'), T('變色龍', 'chameleons'), T('大象', 'elephants'), T('貓頭鷹', 'owls')],
    prompt: T('寫一篇說明文介紹{t}。用小標題或分段介紹外型、棲地、食物和有趣的事實，並使用專有名詞。', 'Write an informative piece about {t}. Group facts into paragraphs about body, habitat, food, and amazing facts, and use exact science words.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('一個有趣的事實 + 說明這篇要介紹什麼。', 'An interesting fact + what the piece will explain.') },
      { label: T('外型', 'Body'), hint: T('牠長什麼樣子？有什麼特殊構造？', 'What does it look like? Any special body parts?') },
      { label: T('棲地和食物', 'Habitat and food'), hint: T('住在哪裡？吃什麼？', 'Where does it live? What does it eat?') },
      { label: T('有趣的事實', 'Amazing facts'), hint: T('讀者會覺得驚訝的事。', 'Something that will surprise readers.') },
      { label: T('結論', 'Conclusion'), hint: T('總結：為什麼這種動物很特別？', 'Sum up: why is this animal special?') },
    ],
    starters: ['Did you know that …?', '… are animals that …', 'For example, …', 'Another interesting fact is …', 'This helps them …', 'In conclusion, …'],
    words: [150, 300],
    checklist: [
      T('開頭介紹主題，吸引讀者。', 'My introduction names the topic and hooks the reader.'),
      T('相關的事實放在同一段。', 'I grouped related facts in the same paragraph.'),
      T('我用了事實、定義和例子。', 'I used facts, definitions and examples.'),
      T('我用了正確的專有名詞（如 habitat、predator）。', 'I used exact science words (habitat, predator).'),
      T('我用了連接詞（also、for example、because）。', 'I used linking words (also, for example, because).'),
      T('結尾總結主要內容。', 'My conclusion sums up the main ideas.'),
    ],
    mentor: {
      title: 'Sea Otters: Furry Ocean Engineers',
      text: 'Did you know that a sea otter has the thickest fur of any animal on Earth? These playful mammals spend almost their whole lives in the cold waters of the northern Pacific Ocean, and their bodies are built for it.\n\nA sea otter is about four feet long and has a round face, small ears, and webbed back feet for swimming. Unlike whales and seals, sea otters do not have a thick layer of fat called blubber. Instead, their fur traps tiny bubbles of air that keep their skin warm and dry.\n\nSea otters live in kelp forests near the coast. Kelp is a tall seaweed that grows from the sea floor. Otters dive down to hunt for sea urchins, crabs, and clams. Then they float on their backs and use their bellies as a table.\n\nOne amazing fact is that sea otters use tools. An otter may keep a favorite rock in a pocket of loose skin under its arm and use it to crack open shells. When it is time to sleep, otters often wrap themselves in kelp so they do not drift away.\n\nSea otters are clever, hardworking animals. By eating sea urchins, they protect the kelp forests that many other sea creatures need.',
      note: T('每段只講一個重點（外型、棲地、有趣事實），用專有名詞（blubber、kelp）並加上解釋，結論說明這種動物為什麼重要。', 'Each paragraph covers one topic (body, habitat, amazing facts), science words like "blubber" and "kelp" are explained, and the conclusion tells why the animal matters.'),
    },
    vocab: ['habitat', 'predator', 'prey', 'for example', 'in addition', 'because of this'],
  },
  {
    id: 'w4-howto',
    grade: 4,
    genre: 'procedural',
    std: 'CCSS W.4.2',
    title: T('教人怎麼做', 'How to do it'),
    topics: [T('做一個三明治', 'make a great sandwich'), T('照顧一盆植物', 'take care of a houseplant'), T('摺紙飛機', 'fold a paper airplane'), T('整理書包', 'pack a school bag'), T('洗狗', 'give a dog a bath'), T('玩你最喜歡的遊戲', 'play your favorite game')],
    prompt: T('寫一篇步驟說明文，教讀者怎麼{t}。列出需要的材料，按照順序寫出每個步驟，並給一些小提醒。', 'Write a how-to piece that teaches readers how to {t}. List the materials, explain each step in order, and add helpful tips.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('為什麼要學這件事？', 'Why is this worth learning?') },
      { label: T('材料', 'Materials'), hint: T('需要什麼東西？', 'What do you need?') },
      { label: T('步驟', 'Steps'), hint: T('First, Next, Then, After that, Finally…', 'First, Next, Then, After that, Finally…') },
      { label: T('提醒和結尾', 'Tips and closing'), hint: T('小訣竅或安全提醒，最後鼓勵讀者。', 'A tip or safety note, then encourage the reader.') },
    ],
    starters: ['Have you ever wanted to …?', 'You will need …', 'First, …', 'Next, …', 'Be careful not to …', 'Finally, …', 'Now you are ready to …'],
    words: [150, 300],
    checklist: [
      T('我說明了要做什麼，以及為什麼。', 'I explained what we are making or doing, and why.'),
      T('我列出了所有材料。', 'I listed all the materials.'),
      T('步驟按照順序，並用了順序詞。', 'My steps are in order and use sequence words.'),
      T('每個步驟都用動詞開頭，清楚明確。', 'Each step starts with a clear action verb.'),
      T('我加入了小提醒或安全注意事項。', 'I added tips or safety notes.'),
      T('結尾鼓勵讀者試試看。', 'My ending encourages the reader to try it.'),
    ],
    mentor: {
      title: 'How to Fold a Super Glider',
      text: 'Have you ever wanted a paper airplane that floats across the whole room? With one sheet of paper and a few careful folds, you can make a super glider in five minutes.\n\nYou will need one sheet of regular printer paper and a flat table. A ruler is helpful but not necessary.\n\nFirst, fold the paper in half the long way, crease it, and open it again. This center line is your guide. Next, fold the two top corners down so they meet at the center line, like a pointed roof. Then fold the new slanted edges in to the center line one more time. Be sure to press each crease hard with your thumbnail, because sharp folds help the plane fly straight.\n\nAfter that, fold the whole plane in half along the center line so the folds are on the outside. To make the wings, fold each side down so its top edge lines up with the bottom of the body. Finally, lift the wings so they stick straight out.\n\nHold the plane under the wings and throw it gently forward, not up. If it dives, bend the back edges of the wings up a tiny bit.\n\nNow you are ready to send your glider soaring. Have a contest with a friend to see whose plane flies farthest!',
      note: T('先說明成果和材料，步驟用 First、Next、Then、Finally 串起來，每一步都以動詞開頭，還加了「為什麼」和解決問題的小提醒。', 'It names the result and materials first, links steps with First, Next, Then and Finally, starts each step with an action verb, and adds reasons and a fix-it tip.'),
    },
    vocab: ['first', 'next', 'then', 'after that', 'finally', 'be careful', 'make sure'],
  },
  {
    id: 'w4-letter-friendly',
    grade: 4,
    genre: 'letter',
    std: 'CCSS W.4.4',
    title: T('寫一封友善的信', 'A friendly letter'),
    topics: [T('住在遠方的朋友，分享近況', 'a friend who lives far away, sharing your news'), T('祖父母，謝謝他們', 'your grandparents, to thank them'), T('你喜歡的作家', 'a favorite author'), T('明年會在你班上的學生', 'a student who will be in your class next year'), T('以前教過你的老師', 'a teacher from an earlier grade')],
    prompt: T('寫一封友善的信給{t}。信要有日期、稱呼、內文、結尾敬語和署名，內容要有細節，並問對方問題。', 'Write a friendly letter to {t}. Include the date, greeting, body, closing, and signature. Share details and ask the reader questions.'),
    plan: [
      { label: T('日期和稱呼', 'Date and greeting'), hint: T('Dear …,', 'Dear …,') },
      { label: T('開頭', 'Opening'), hint: T('問候對方，說明為什麼寫信。', 'Greet the reader and say why you are writing.') },
      { label: T('分享的內容', 'Your news'), hint: T('兩三件事，每件都有細節。', 'Two or three things, each with details.') },
      { label: T('問題', 'Questions'), hint: T('問對方一些事。', 'Ask the reader something.') },
      { label: T('結尾和署名', 'Closing and signature'), hint: T('Your friend, / Love, …', 'Your friend, / Love, …') },
    ],
    starters: ['Dear …,', 'I hope you are doing well.', 'I am writing to tell you …', 'Guess what happened last week?', 'How is … going?', 'I can\'t wait to …', 'Your friend,'],
    words: [150, 300],
    checklist: [
      T('信有日期、稱呼、內文、結尾敬語和署名。', 'My letter has a date, greeting, body, closing and signature.'),
      T('稱呼和結尾敬語後面有逗號。', 'There is a comma after the greeting and the closing.'),
      T('我說明了寫信的原因。', 'I explained why I am writing.'),
      T('我分享的事情有具體細節。', 'My news has specific details.'),
      T('我問了讀者問題。', 'I asked the reader questions.'),
      T('語氣親切友善。', 'My tone is warm and friendly.'),
    ],
    mentor: {
      title: 'A Letter to Grandma',
      text: 'October 14, 2026\n\nDear Grandma,\n\nThank you so much for the birthday package! I opened it the moment I got home from school. The knitted scarf is bright blue with yellow stripes, and it is softer than my cat. I wore it to school the very next morning, even though it was not cold yet.\n\nGuess what else happened this month? Our class started a science project about plants. Each of us planted a bean seed in a clear cup so we could watch the roots grow. My bean is already taller than my pencil! I measure it every morning and write the number in a notebook.\n\nI also joined the school chess club. I lost my first three games, but last Friday I finally won. I used the trick you taught me last summer, when you move the knight to protect the queen.\n\nHow is your garden doing? Did the tomatoes turn red before the first frost? Mom says we might visit you during winter break. I hope we can bake those cinnamon cookies again.\n\nLove,\nAva',
      note: T('格式完整（日期、稱呼、結尾），先說明寫信原因（感謝），分享的事情都有具體細節，最後問對方問題，語氣溫暖。', 'The format is complete, the reason for writing comes first, each piece of news has specific details, and the questions at the end make it feel like a real conversation.'),
    },
    vocab: ['thank you for', 'guess what', 'I can\'t wait', 'I hope', 'by the way'],
  },
  {
    id: 'w4-descriptive-place',
    grade: 4,
    genre: 'descriptive',
    std: 'CCSS W.4.3d',
    title: T('描寫一個地方', 'Describe a special place'),
    topics: [T('你最喜歡的公園', 'your favorite park'), T('夜市', 'a night market'), T('海邊', 'the beach'), T('你的房間', 'your bedroom'), T('下大雨時的教室', 'your classroom on a rainy day'), T('祖父母的家', "your grandparents' home")],
    prompt: T('描寫{t}。用五種感官（看、聽、聞、嚐、摸）和比喻，讓讀者好像真的在那裡。', 'Describe {t}. Use all five senses and figurative language so the reader feels as if they are there.'),
    plan: [
      { label: T('開頭', 'Opening'), hint: T('這是什麼地方？為什麼特別？', 'What is the place? Why is it special?') },
      { label: T('看到和聽到', 'Sights and sounds'), hint: T('顏色、形狀、聲音…', 'Colors, shapes, sounds…') },
      { label: T('聞到、嚐到、摸到', 'Smells, tastes, textures'), hint: T('用精準的形容詞。', 'Use precise adjectives.') },
      { label: T('比喻', 'Figurative language'), hint: T('用一個明喻或暗喻。', 'Add a simile or metaphor.') },
      { label: T('結尾', 'Closing'), hint: T('這個地方給你什麼感覺？', 'How does the place make you feel?') },
    ],
    starters: ['As soon as you walk into …, …', 'The air smells like …', 'All around me, I can hear …', 'It feels as … as …', 'My favorite spot is …', 'Whenever I am there, I feel …'],
    words: [150, 300],
    checklist: [
      T('我寫出了至少四種感官的細節。', 'I used details for at least four senses.'),
      T('我用了精準的形容詞和動詞。', 'I used precise adjectives and verbs.'),
      T('我用了至少一個明喻或暗喻。', 'I used at least one simile or metaphor.'),
      T('描寫有順序（由遠到近，或由外到內）。', 'My description moves in an order (far to near, or outside to inside).'),
      T('結尾說出這個地方給我的感受。', 'My ending tells how the place makes me feel.'),
    ],
    mentor: {
      title: 'The Night Market',
      text: 'As soon as the sun goes down, the empty street near my grandmother\'s apartment wakes up and becomes the night market. Strings of yellow lights blink on above the stalls, and the whole street glows like a giant lantern.\n\nThe first thing I notice is the noise. Sellers call out prices, pans sizzle, and a speaker somewhere plays an old song that my grandmother hums along to. Scooters beep at the end of the lane while crowds shuffle slowly past.\n\nThen the smells find me. Sweet, smoky sausages roast on a grill. Fried chicken crackles in a pot of bubbling oil. Near the corner, the sharp smell of stinky tofu makes my little brother hold his nose, but I think it smells like adventure.\n\nMy favorite stop is the bubble tea stand. The cup is so cold that my fingers tingle, and the chewy tapioca pearls bounce on my tongue. Next door, a man spins sugar into fluffy pink clouds.\n\nBy the time we walk home, my stomach is full and my shoes are sticky. The night market is loud, crowded, and messy, and it is my favorite place in the world.',
      note: T('作者依序寫出聽到、聞到、嚐到、摸到的感覺，用了比喻（像一個巨大的燈籠）和精準的動詞（sizzle、crackles），結尾說出自己的感受。', 'The writer moves through sounds, smells, tastes and textures, uses a simile ("like a giant lantern") and precise verbs (sizzle, crackles), and ends with a feeling.'),
    },
    vocab: ['glows', 'sizzle', 'crackles', 'tingle', 'as … as', 'like a …'],
  },
  {
    id: 'w4-poem-senses',
    grade: 4,
    genre: 'poem',
    std: 'CCSS W.4.4',
    title: T('五感詩', 'A five-senses poem'),
    topics: [T('下雨天', 'a rainy day'), T('生日派對', 'a birthday party'), T('秋天', 'autumn'), T('早餐時間', 'breakfast time'), T('雷雨', 'a thunderstorm'), T('海邊', 'the seashore')],
    prompt: T('寫一首關於{t}的詩。每一段用一種感官，加入明喻或暗喻，並讓最後幾行帶出一種感受。', 'Write a poem about {t}. Give each stanza a different sense, include a simile or metaphor, and end with a feeling.'),
    plan: [
      { label: T('主題', 'Topic'), hint: T('你要寫什麼時刻？', 'What moment will you write about?') },
      { label: T('看到、聽到', 'Sight and sound'), hint: T('I see… I hear…', 'I see… I hear…') },
      { label: T('聞到、嚐到、摸到', 'Smell, taste, touch'), hint: T('用比喻：like…、as…as…', 'Use a comparison: like…, as … as …') },
      { label: T('結尾', 'Ending'), hint: T('最後一行說出感受。', 'End with a feeling.') },
    ],
    starters: ['I see …', 'I hear …', 'It smells like …', 'It tastes like …', 'It feels as … as …', '… is a …'],
    words: [60, 150],
    checklist: [
      T('我用了至少四種感官。', 'I used at least four senses.'),
      T('我用了明喻或暗喻。', 'I used a simile or a metaphor.'),
      T('我選了精準、生動的字。', 'I chose precise, vivid words.'),
      T('詩分成幾段（stanza），每段有一個重點。', 'My poem is in stanzas, each with one focus.'),
      T('最後幾行帶出一種感受。', 'My last lines show a feeling.'),
    ],
    mentor: {
      title: 'Thunderstorm',
      text: 'I see the sky turn bruise-purple,\nlightning stitching the clouds together\nlike a silver needle.\n\nI hear thunder grumble over the rooftops,\na giant rolling his bowling ball\ndown the hall of the sky.\n\nI smell wet pavement and cut grass,\nsharp and green as a fresh pickle.\n\nI taste raindrops on my tongue,\ncool and a little like pennies.\n\nI feel the windowpane shiver under my hand.\nThen the storm moves on,\nand the whole world sighs, clean and quiet.',
      note: T('每段寫一種感官，用了明喻（像一根銀針）和暗喻（巨人打保齡球），最後用「整個世界嘆了一口氣」帶出平靜的感受。', 'Each stanza uses one sense, with a simile ("like a silver needle") and a metaphor (a giant bowling), and the ending ("the whole world sighs") leaves a calm feeling.'),
    },
    vocab: ['like', 'as … as', 'shimmer', 'grumble', 'whisper', 'sparkle'],
  },
  {
    id: 'w4-book-review',
    grade: 4,
    genre: 'literary',
    std: 'CCSS W.4.9a',
    title: T('書評：推薦一本書', 'Book review'),
    topics: [T('一本冒險故事', 'an adventure story'), T('一本關於友誼的書', 'a book about friendship'), T('一本有趣的動物書', 'a funny animal book'), T('一本奇幻小說', 'a fantasy novel'), T('一本你最近讀的書', 'a book you read recently')],
    prompt: T('寫一篇書評，介紹{t}。說明書名、作者、主要角色和問題（不要洩漏結局），說出你的看法，並用書中的細節支持。', 'Write a review of {t}. Give the title, author, main characters and problem (no spoilers!), share your opinion, and support it with details from the book.'),
    plan: [
      { label: T('開頭', 'Introduction'), hint: T('書名（斜體或畫底線）、作者、你的整體看法。', 'Title (underlined or italic), author, and your overall opinion.') },
      { label: T('故事簡介', 'Summary'), hint: T('主角、場景、問題（不洩漏結局）。', 'Main character, setting, problem (no ending!).') },
      { label: T('我喜歡的地方', 'What I liked'), hint: T('用書中的例子說明。', 'Explain with examples from the book.') },
      { label: T('推薦', 'Recommendation'), hint: T('誰會喜歡這本書？', 'Who would enjoy this book?') },
    ],
    starters: ['If you like …, you will love …', 'The main character, …, …', 'The problem begins when …', 'My favorite part is when …', 'For example, …', 'I would recommend this book to …'],
    words: [150, 300],
    checklist: [
      T('我寫了書名和作者。', 'I named the title and author.'),
      T('我介紹了主角、場景和問題，但沒有洩漏結局。', 'I introduced the main character, setting and problem without spoiling the ending.'),
      T('我清楚說出我的看法。', 'I stated my opinion clearly.'),
      T('我用書中的細節或例子支持看法。', 'I supported my opinion with details from the book.'),
      T('我說明了適合誰讀。', 'I said who would enjoy the book.'),
    ],
    mentor: {
      title: 'Review: The Lighthouse Cat',
      text: 'If you like brave animals and stormy seas, you will love The Lighthouse Cat by Mara Quinn. It is one of the most exciting books I read this year.\n\nThe story is about Biscuit, an orange cat who lives in a lighthouse with an old keeper named Mr. Finch. One winter night, Mr. Finch hurts his ankle and cannot climb the tall stairs to light the lamp. A fishing boat is heading toward the rocks, and Biscuit is the only one who can help.\n\nMy favorite thing about this book is how the author makes you feel the storm. She writes that the waves "slapped the rocks like angry hands," and I could almost hear the wind howling. I also liked that Biscuit is not a perfect hero. He is scared of the dark stairs, but he keeps going anyway, one step at a time.\n\nThe pictures are another great part. Each page has deep blue and gold paintings that make the lighthouse glow.\n\nI would recommend The Lighthouse Cat to anyone who likes animal heroes or adventure stories. Just be warned: you will not want to put it down until you find out what happens to the boat.',
      note: T('開頭給書名、作者和整體看法，簡介故事卻不洩漏結局，用書中的句子當例子支持看法，最後說明適合哪些讀者。', 'The opening names the book and gives an opinion, the summary avoids spoilers, a quotation from the book supports the opinion, and the ending says who should read it.'),
    },
    vocab: ['the main character', 'the problem', 'my favorite part', 'for example', 'I recommend'],
  },
  // ======================= GRADE 5 =======================
  {
    id: 'w5-personal-challenge',
    grade: 5,
    genre: 'personal',
    std: 'CCSS W.5.3',
    title: T('我克服了一個挑戰', 'A challenge I faced'),
    topics: [T('學一項新技能', 'learning a hard new skill'), T('交新朋友', 'making a new friend'), T('一次失敗後再試一次', 'trying again after failing'), T('克服害怕', 'facing a fear'), T('一個困難的決定', 'making a tough decision'), T('團隊合作', 'working as part of a team')],
    prompt: T('寫一篇個人記敘文，主題是{t}。用對話、描寫和內心想法讓事件生動，並清楚寫出你如何改變或學到什麼。', 'Write a personal narrative about {t}. Use dialogue, description, and your inner thoughts to bring events to life, and show how you changed or what you learned.'),
    plan: [
      { label: T('開頭', 'Opening'), hint: T('從一個動作、對話或想法開始。', 'Start with an action, a line of dialogue or a thought.') },
      { label: T('問題', 'The challenge'), hint: T('困難是什麼？你當時的感受？', 'What was hard? How did you feel?') },
      { label: T('努力的過程', 'Trying'), hint: T('你做了什麼？發生了什麼事？', 'What did you do? What happened?') },
      { label: T('轉折點', 'Turning point'), hint: T('事情在哪一刻改變？', 'When did things change?') },
      { label: T('反思', 'Reflection'), hint: T('你學到什麼？現在有什麼不同？', 'What did you learn? What is different now?') },
    ],
    starters: ['"…," my coach called as …', 'I stared at … and thought, …', 'At first, …', 'No matter how hard I tried, …', 'That was when …', 'Looking back, I realize …'],
    words: [200, 350],
    checklist: [
      T('開頭吸引人，並介紹了情境。', 'My opening hooks the reader and sets the scene.'),
      T('事件順序清楚，用了多種轉折詞。', 'Events are clearly ordered with varied transitions.'),
      T('我用了對話和內心想法。', 'I used dialogue and inner thoughts.'),
      T('我用具體的描寫「呈現」感受，而不只是「說出」感受。', 'I showed feelings with details instead of only naming them.'),
      T('故事有明顯的轉折點。', 'My story has a clear turning point.'),
      T('結尾反思我學到什麼。', 'My ending reflects on what I learned.'),
      T('時態前後一致。', 'I kept my verb tenses consistent.'),
    ],
    mentor: {
      title: 'Ten Seconds of Courage',
      text: '"Next up, Lucas Chen!" Ms. Ortiz called, and my stomach dropped to my sneakers.\n\nIt was the fifth-grade speech contest, and I had chosen to talk about my grandfather\'s fishing boat. At home, I had practiced in front of the mirror twenty times. But standing in front of the whole grade was different. My hands were sweaty, and my note cards stuck together.\n\nI started well. "My grandfather has fished the same harbor for forty years," I said. Then I looked up and saw two hundred faces staring at me. My mind went completely blank. The silence stretched on, and someone in the back row coughed.\n\nI thought, Just walk off the stage. Nobody will blame you. Then I remembered something my grandfather told me when I was scared of the waves. "Count to ten," he had said, "and the boat will still be floating."\n\nSo I counted silently. One, two, three. By ten, my heart had slowed down. I took a breath, found my place on the card, and kept going. I told them about the smell of salt and diesel, the gulls that followed us home, and the morning we caught a fish as long as my arm.\n\nI did not win first place. However, when I sat down, my friend Owen leaned over and whispered, "That was the best part, when you came back."\n\nLooking back, I realize courage is not about never freezing. It is about what you do in the ten seconds after you freeze.',
      note: T('用對話開頭立刻進入情境，用身體反應和內心想法呈現緊張，有清楚的轉折點（數到十），結尾的反思把整個經驗變成一個道理。', 'Dialogue opens the story right in the moment, body details and inner thoughts show nerves, there is a clear turning point (counting to ten), and the reflection turns the event into a lesson.'),
    },
    vocab: ['at first', 'meanwhile', 'that was when', 'however', 'looking back', 'I realized'],
  },
  {
    id: 'w5-story-mystery',
    grade: 5,
    genre: 'narrative',
    std: 'CCSS W.5.3',
    title: T('神秘事件故事', 'A mystery story'),
    topics: [T('消失的班級寵物', 'the missing class pet'), T('圖書館裡的神秘紙條', 'a strange note in a library book'), T('半夜的怪聲', 'a noise in the middle of the night'), T('不見的獎盃', 'the vanished trophy'), T('閣樓裡的舊地圖', 'an old map in the attic'), T('每天早上出現的腳印', 'footprints that appear every morning')],
    prompt: T('寫一個神秘故事：{t}。安排線索和誤導，用對話和節奏製造懸疑，最後揭開謎底。', 'Write a mystery story about {t}. Plant clues and a red herring, build suspense with dialogue and pacing, and reveal the answer at the end.'),
    plan: [
      { label: T('角色和場景', 'Detective and setting'), hint: T('誰來解謎？在哪裡？', 'Who solves the mystery? Where?') },
      { label: T('謎題', 'The mystery'), hint: T('發生了什麼奇怪的事？', 'What strange thing happens?') },
      { label: T('線索', 'Clues'), hint: T('至少兩個真線索和一個假線索。', 'At least two real clues and one false lead.') },
      { label: T('揭曉', 'The reveal'), hint: T('答案是什麼？線索怎麼串起來？', 'What is the answer? How do the clues fit?') },
      { label: T('結尾', 'Ending'), hint: T('角色最後的感受或一句好笑的話。', 'A final feeling or a funny last line.') },
    ],
    starters: ['It all started on …', 'Something was wrong.', 'The first clue was …', '"Wait a minute," … said.', 'Meanwhile, …', 'Suddenly, everything made sense.'],
    words: [200, 350],
    checklist: [
      T('開頭很快就出現謎題。', 'The mystery appears early.'),
      T('我安排了線索，讀者可以跟著推理。', 'I planted clues so readers can solve it too.'),
      T('我用了對話和描寫來製造懸疑。', 'I used dialogue and description to build suspense.'),
      T('轉折詞讓時間和場景轉換很清楚。', 'Transitions make changes in time and place clear.'),
      T('結局合理，用上了前面的線索。', 'The ending makes sense and uses the earlier clues.'),
      T('我用了精準的動詞和感官細節。', 'I used precise verbs and sensory details.'),
    ],
    mentor: {
      title: 'The Case of the Missing Hamster',
      text: 'On Monday morning, Room 12 discovered that Captain Whiskers was gone. The cage door hung open, and a trail of sunflower seeds led across the floor and stopped at the bookshelf.\n\n"Someone must have taken him home," said Jay, glaring at Ruby, who had fed Captain Whiskers on Friday.\n\n"I locked the cage!" Ruby insisted. Her face turned red. "I always check it twice."\n\nGrace pulled out her notebook. She had read every detective book in the library, and she knew that the first answer is not always the right one. She wrote down three clues. First, the seeds. Second, a chewed corner on the class poster about the water cycle. Third, the heater vent behind the bookshelf, which was missing one screw.\n\nAt lunch, while everyone else talked about Ruby, Grace sat quietly by the bookshelf. She heard a faint scratching sound. Then she heard a squeak.\n\n"Ms. Park," she said, "I think Captain Whiskers is in the wall."\n\nThe custodian came with a screwdriver and took the vent cover off. Inside, curled up on a nest of shredded paper from the poster, was a very fat, very happy hamster.\n\n"The cage latch is loose," Ms. Park said, wiggling it. "He pushed it open by himself."\n\nJay turned to Ruby. "Sorry I blamed you," he mumbled.\n\nGrace closed her notebook and smiled. Case closed, and the water cycle poster would need a new corner.',
      note: T('謎題馬上出現，有真線索（瓜子、咬過的海報、通風口）和誤導（懷疑 Ruby），偵探一步步推理，結局用上所有線索，最後一句幽默收尾。', 'The mystery starts right away, real clues (seeds, the chewed poster, the vent) mix with a false lead (blaming Ruby), and the ending uses every clue and closes with humor.'),
    },
    vocab: ['clue', 'suspect', 'meanwhile', 'suddenly', 'insisted', 'mumbled'],
  },
  {
    id: 'w5-opinion-community',
    grade: 5,
    genre: 'opinion',
    std: 'CCSS W.5.1',
    title: T('發表你的意見', 'Share your opinion'),
    topics: [T('學校是否應該延長午餐時間', 'whether lunch period should be longer'), T('學生是否應該自己選座位', 'whether students should choose their own seats'), T('每所學校是否都該有菜園', 'whether every school should have a garden'), T('電玩是否可以算是運動', 'whether video games should count as a sport'), T('學校是否應該教烹飪', 'whether schools should teach cooking'), T('動物園是否對動物有益', 'whether zoos are good for animals')],
    prompt: T('寫一篇意見文，討論{t}。提出清楚的看法，用合乎邏輯的順序排列理由，每個理由都要有事實和細節支持，並回應反對意見。', 'Write an opinion essay about {t}. State a clear opinion, give logically ordered reasons supported by facts and details, and respond to the other side.'),
    plan: [
      { label: T('開頭', 'Introduction'), hint: T('吸引讀者 + 說明背景 + 清楚的看法。', 'Hook + background + clear opinion.') },
      { label: T('理由一', 'Reason 1'), hint: T('最有力的理由 + 事實或例子。', 'Strongest reason + facts or examples.') },
      { label: T('理由二', 'Reason 2'), hint: T('第二個理由 + 細節。', 'Second reason + details.') },
      { label: T('反對意見', 'The other side'), hint: T('Some people think… However, …', 'Some people think… However, …') },
      { label: T('結論', 'Conclusion'), hint: T('重述看法，呼籲讀者。', 'Restate your opinion and call readers to act.') },
    ],
    starters: ['Picture this: …', 'In my opinion, …', 'The most important reason is …', 'According to …, …', 'Consequently, …', 'Some people argue that … However, …', 'For all of these reasons, …'],
    words: [200, 350],
    checklist: [
      T('開頭吸引人，看法清楚。', 'My introduction hooks readers and states a clear opinion.'),
      T('理由按照合理的順序排列。', 'My reasons are in a logical order.'),
      T('每個理由都有事實或細節支持。', 'Each reason is supported by facts and details.'),
      T('我用了 consequently、specifically、in addition 等轉折詞。', 'I linked ideas with words like consequently, specifically, in addition.'),
      T('我回應了反對的意見。', 'I responded to the other side.'),
      T('結論和看法相關，並呼籲讀者。', 'My conclusion connects to my opinion and calls readers to act.'),
    ],
    mentor: {
      title: 'Let Us Grow: Why Every School Needs a Garden',
      text: 'Picture a blacktop corner turned into rows of green beans, sunflowers, and buzzing bees. In my opinion, every school should have a garden, because gardens help students learn, eat healthier, and care for their community.\n\nThe most important reason is that a garden is an outdoor classroom. Measuring plant growth is real math, and watching seeds sprout is real science. Specifically, when our class planted radishes last spring, we tracked their height every day and made line graphs. Students who usually dislike math were suddenly asking to measure.\n\nIn addition, gardens encourage healthy eating. Many kids refuse vegetables at dinner. However, when they grow the vegetables themselves, they are proud to taste them. Our school nurse noticed that students who worked in the garden were far more willing to try the salad bar.\n\nSome people argue that gardens cost too much money and take too much time. However, many gardens begin with donated seeds and a few volunteers. Families, local businesses, and even older students can help water during the summer. Consequently, the cost to the school can be very small.\n\nFor all of these reasons, a school garden is worth every seed. Ask your principal or parent group to start one, and soon your school can grow more than vegetables. It can grow curious, healthy, and responsible students.',
      note: T('開頭用畫面吸引讀者並清楚提出看法，每個理由都有具體例子，用 specifically、in addition、consequently 連接，回應反對意見後再提出呼籲。', 'A vivid hook leads to a clear opinion, each reason has a specific example, transitions like specifically, in addition and consequently link ideas, and the writer answers the other side before a call to action.'),
    },
    vocab: ['in my opinion', 'specifically', 'in addition', 'consequently', 'however', 'for all of these reasons'],
  },
  {
    id: 'w5-research-report',
    grade: 5,
    genre: 'research',
    std: 'CCSS W.5.7',
    title: T('小小研究報告', 'A short research report'),
    topics: [T('一種自然災害（如颱風或地震）', 'a natural disaster, such as typhoons or earthquakes'), T('一位發明家', 'a famous inventor'), T('太陽系的一顆行星', 'a planet in our solar system'), T('一種瀕臨絕種的動物', 'an endangered animal'), T('一個古代文明', 'an ancient civilization'), T('回收是怎麼運作的', 'how recycling works')],
    prompt: T('研究{t}，至少參考兩個來源，寫一篇研究報告。用自己的話改寫資料，把資訊分成幾個段落，最後列出參考資料。', 'Research {t} using at least two sources and write a report. Paraphrase in your own words, group information into sections, and list your sources at the end.'),
    plan: [
      { label: T('研究問題', 'Research questions'), hint: T('你想知道哪三件事？', 'What three things do you want to find out?') },
      { label: T('引言', 'Introduction'), hint: T('有趣的事實 + 主題句。', 'An interesting fact + a focus statement.') },
      { label: T('重點一、二、三', 'Sections 1–3'), hint: T('每段回答一個研究問題，用自己的話寫。', 'Each section answers one question in your own words.') },
      { label: T('結論', 'Conclusion'), hint: T('最重要的發現是什麼？', 'What is the most important thing you learned?') },
      { label: T('參考資料', 'Sources'), hint: T('作者、標題、網站或出版社、日期。', 'Author, title, website or publisher, date.') },
    ],
    starters: ['Imagine …', 'According to …, …', 'Scientists have discovered that …', 'One reason is …', 'As a result, …', 'In conclusion, …', 'Sources:'],
    words: [200, 350],
    checklist: [
      T('我至少用了兩個可靠的來源。', 'I used at least two reliable sources.'),
      T('我用自己的話改寫，沒有照抄。', 'I paraphrased in my own words instead of copying.'),
      T('相關的資訊分在同一段，每段有主題句。', 'I grouped related information, and each section has a topic sentence.'),
      T('我用了事實、數字、定義和例子。', 'I used facts, numbers, definitions and examples.'),
      T('我在文中說明資料來自哪裡（According to…）。', 'I named sources in my writing (According to…).'),
      T('最後有參考資料清單。', 'I listed my sources at the end.'),
    ],
    mentor: {
      title: 'Typhoons: Giant Storms of the Pacific',
      text: 'Imagine a storm so wide that it could cover all of Taiwan and still reach out into the sea. That is the size of a large typhoon. Typhoons are powerful spinning storms that form over the warm waters of the western Pacific Ocean.\n\nA typhoon begins when ocean water is very warm, usually above 26 degrees Celsius. According to the book Wild Weather by Dana Cole, warm, wet air rises from the ocean surface and forms tall clouds. As more air rushes in to replace it, the whole system begins to spin. When its winds reach about 118 kilometers per hour, it is officially called a typhoon.\n\nTyphoons can cause serious damage. Strong winds knock down trees and power lines. Heavy rain causes floods and landslides, especially in mountain areas. Near the coast, the storm pushes ocean water onto land, which is called a storm surge.\n\nFortunately, people can prepare. Weather scientists use satellites to track typhoons days before they arrive. As a result, families have time to store water, charge flashlights, and bring loose objects indoors. Schools and offices may close so people can stay safe at home.\n\nIn conclusion, typhoons are among the strongest storms on Earth, but careful science and good planning help protect millions of people every year.\n\nSources: Cole, Dana. Wild Weather. 2023. Patel, Ravi. "How Storms Spin." Science Kids Weekly, 2024.',
      note: T('引言用比較吸引讀者，每段回答一個問題（怎麼形成、造成什麼災害、怎麼準備），文中標出資料來源，最後列出參考資料。', 'The introduction hooks with a comparison, each section answers one question (how typhoons form, what damage they cause, how people prepare), sources are named in the text, and a source list ends the report.'),
    },
    vocab: ['according to', 'scientists', 'as a result', 'for example', 'fortunately', 'in conclusion'],
  },
  {
    id: 'w5-letter-persuasive',
    grade: 5,
    genre: 'letter',
    std: 'CCSS W.5.1',
    title: T('說服信', 'A persuasive letter'),
    topics: [T('校長，請求成立一個新社團', 'the principal, asking for a new club'), T('市長，請求改善公園', 'the mayor, asking for park improvements'), T('家長會，請求購買新器材', 'the parent group, asking for new equipment'), T('爸媽，請求養一隻寵物', 'your parents, asking to get a pet'), T('鎮上的圖書館，建議購買新書', 'the town library, suggesting new books')],
    prompt: T('寫一封說服信給{t}。有禮貌地提出請求，用理由和證據說服讀者，回應他們可能的擔心，並提出具體的下一步。', 'Write a persuasive letter to {t}. Make a polite request, convince the reader with reasons and evidence, answer worries they might have, and suggest a clear next step.'),
    plan: [
      { label: T('稱呼和請求', 'Greeting and request'), hint: T('Dear …, 我是誰？我想要什麼？', 'Dear …, Who are you? What do you want?') },
      { label: T('理由和證據', 'Reasons and evidence'), hint: T('兩到三個理由，每個有證據。', 'Two or three reasons, each with evidence.') },
      { label: T('對方的擔心', 'Their worries'), hint: T('I understand that… but…', 'I understand that… but…') },
      { label: T('下一步和結尾', 'Next step and closing'), hint: T('具體建議 + Sincerely,', 'A specific suggestion + Sincerely,') },
    ],
    starters: ['Dear …,', 'My name is … and I am writing to ask …', 'First of all, …', 'In fact, …', 'I understand that … However, …', 'Would you be willing to …?', 'Sincerely,'],
    words: [200, 350],
    checklist: [
      T('信的格式完整（日期、稱呼、結尾敬語、署名）。', 'My letter has the full format (date, greeting, closing, signature).'),
      T('我在開頭清楚、有禮貌地提出請求。', 'I make a clear, polite request at the start.'),
      T('理由有事實或例子支持。', 'My reasons are supported by facts or examples.'),
      T('我回應了讀者可能的擔心。', 'I answer worries the reader might have.'),
      T('我提出了具體的下一步。', 'I suggest a specific next step.'),
      T('語氣禮貌、正式。', 'My tone is polite and respectful.'),
    ],
    mentor: {
      title: 'A Letter to Principal Harris',
      text: 'March 3, 2026\n\nDear Principal Harris,\n\nMy name is Zoe Lin, and I am a fifth grader in Mr. Brooks\'s class. I am writing to ask if our school could start a coding club that meets after school on Wednesdays.\n\nFirst of all, many students are eager to learn coding. Last week, I asked my classmates to sign a paper if they would join, and 41 students from three classes signed it in just two days. Clearly, a coding club would not be empty.\n\nIn addition, coding builds skills that help in every subject. When students write a program, they have to plan steps in order, find mistakes, and try again. Those are the same skills we use when we solve math problems or revise our writing.\n\nI understand that the school may worry about the cost and about finding a teacher. However, there are free coding websites designed for kids, and our computer lab is empty after 3:00. Also, Ms. Rivera, who teaches sixth grade, told me she would be happy to help if the club is approved.\n\nWould you be willing to meet with me and Ms. Rivera for ten minutes next week to talk about this idea? I have attached the list of signatures. Thank you for considering my request.\n\nSincerely,\nZoe Lin',
      note: T('開頭就有禮貌地提出請求，用數字（41 位同學）當證據，主動回應校長可能擔心的費用和老師問題，最後提出具體可行的下一步。', 'The request comes first and politely, a number (41 signatures) serves as evidence, the writer answers the principal\'s likely worries about cost and staff, and the letter ends with a specific next step.'),
    },
    vocab: ['first of all', 'in addition', 'clearly', 'I understand that', 'however', 'thank you for considering'],
  },
  {
    id: 'w5-compare-contrast',
    grade: 5,
    genre: 'compare',
    std: 'CCSS W.5.2',
    title: T('比較和對照', 'Compare and contrast'),
    topics: [T('貓和狗當寵物', 'cats and dogs as pets'), T('紙本書和電子書', 'paper books and e-books'), T('住在城市和住在鄉下', 'living in a city and living in the countryside'), T('青蛙和蟾蜍', 'frogs and toads'), T('夏天和冬天', 'summer and winter'), T('騎腳踏車和搭公車上學', 'biking and taking the bus to school')],
    prompt: T('寫一篇比較和對照的文章，主題是{t}。說明它們相同和不同的地方，用比較的轉折詞，並在結論說出你的看法或發現。', 'Write a compare-and-contrast essay about {t}. Explain how they are alike and different, use compare-and-contrast transitions, and end with what you conclude.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('介紹兩樣東西和你要比較的重點。', 'Introduce both subjects and the points you will compare.') },
      { label: T('相同點', 'Similarities'), hint: T('Both… / Similarly, …', 'Both… / Similarly, …') },
      { label: T('不同點一', 'Difference 1'), hint: T('…, while … / In contrast, …', '…, while … / In contrast, …') },
      { label: T('不同點二', 'Difference 2'), hint: T('On the other hand, …', 'On the other hand, …') },
      { label: T('結論', 'Conclusion'), hint: T('你發現了什麼？你比較喜歡哪一個？', 'What did you conclude? Which do you prefer?') },
    ],
    starters: ['At first glance, … and … seem …', 'Both … and …', 'Similarly, …', 'In contrast, …', '…, while …', 'On the other hand, …', 'Overall, …'],
    words: [200, 350],
    checklist: [
      T('引言介紹了要比較的兩樣東西。', 'My introduction names both subjects.'),
      T('我寫出了相同點和不同點。', 'I explained similarities and differences.'),
      T('我用了比較的轉折詞（both、similarly、in contrast、while）。', 'I used compare-and-contrast transitions (both, similarly, in contrast, while).'),
      T('每段只講一個比較重點。', 'Each paragraph focuses on one point of comparison.'),
      T('我用了具體的事實和例子。', 'I used specific facts and examples.'),
      T('結論說出我的發現或看法。', 'My conclusion shares what I concluded.'),
    ],
    mentor: {
      title: 'Frogs and Toads: Cousins, Not Twins',
      text: 'At first glance, frogs and toads seem like the same animal. Both are small, hop, and say "ribbit" in cartoons. However, if you look closely, these two amphibians have important differences in their skin, their bodies, and their homes.\n\nFrogs and toads share many features. Both are amphibians, which means they begin life in water and later live on land. Both hatch from eggs as tadpoles, breathe partly through their skin, and catch insects with long, sticky tongues. Similarly, both are cold-blooded, so their body temperature changes with the air around them.\n\nThe easiest way to tell them apart is their skin. Frogs have smooth, wet skin that often looks slimy. In contrast, toads have dry, bumpy skin that helps them hold in water.\n\nTheir bodies are different, too. Frogs have long, strong back legs for leaping far, while toads have shorter legs and usually move in small hops or walk. Frogs are often thin and sleek. On the other hand, toads tend to be wider and stockier.\n\nFinally, the two animals choose different homes. Most frogs stay close to ponds and streams because their skin must stay moist. Toads, however, can live in gardens, fields, and even forests far from water.\n\nOverall, frogs and toads are cousins rather than twins. Next time you see a little hopping creature, check its skin and its legs. You will be able to tell exactly who you have met.',
      note: T('先寫相同點，再用皮膚、身體、棲地三個重點各寫一段不同點，用 both、similarly、in contrast、while、on the other hand 連接，結尾給讀者一個實用的辨認方法。', 'Similarities come first, then one paragraph each for skin, body and home; transitions like both, similarly, in contrast, while and on the other hand guide the reader, and the conclusion gives a practical tip.'),
    },
    vocab: ['both', 'similarly', 'in contrast', 'while', 'on the other hand', 'overall'],
  },
  {
    id: 'w5-summary',
    grade: 5,
    genre: 'summary',
    std: 'CCSS W.5.9',
    title: T('寫摘要', 'Write a summary'),
    topics: [T('你最近讀的一篇文章', 'an article you read recently'), T('一本書的一個章節', 'a chapter of a book'), T('一部紀錄片', 'a documentary you watched'), T('一則寓言或民間故事', 'a fable or folktale'), T('一堂課學到的內容', 'something you learned in a lesson')],
    prompt: T('為{t}寫一篇摘要。用自己的話說出主要想法和最重要的細節，按照原文的順序，不加入自己的意見。', 'Write a summary of {t}. In your own words, give the main idea and the most important details in order, without adding your own opinion.'),
    plan: [
      { label: T('出處和主要想法', 'Source and main idea'), hint: T('標題、作者，用一句話說出主要想法。', 'Title, author, and the main idea in one sentence.') },
      { label: T('重要細節', 'Key details'), hint: T('三到四個最重要的細節。', 'Three or four of the most important details.') },
      { label: T('結尾', 'Ending'), hint: T('原文怎麼結束？主要訊息是什麼？', 'How does the text end? What is its main message?') },
    ],
    starters: ['In the article "…," the author explains …', 'The main idea is that …', 'First, …', 'The author also describes …', 'Finally, …', 'Overall, the text shows that …'],
    words: [120, 250],
    checklist: [
      T('第一句寫出標題、作者和主要想法。', 'My first sentence names the title, author and main idea.'),
      T('我只寫最重要的細節，沒有寫小細節。', 'I included only the most important details.'),
      T('我按照原文的順序寫。', 'I kept the order of the original text.'),
      T('我用自己的話，沒有照抄。', 'I used my own words, not copied sentences.'),
      T('我沒有加入自己的意見。', 'I did not add my own opinion.'),
      T('摘要比原文短很多。', 'My summary is much shorter than the original.'),
    ],
    mentor: {
      title: 'Summary of "The Ant and the Grasshopper"',
      text: 'In the fable "The Ant and the Grasshopper," Aesop teaches that it is wise to prepare for the future instead of only thinking about today.\n\nDuring a warm summer, a grasshopper spends his days singing and relaxing in the fields. Meanwhile, an ant works hard, carrying grain back to her nest one piece at a time. The grasshopper laughs at the ant and asks her to stop working and play with him. The ant refuses and tells him that winter is coming.\n\nWhen winter arrives, the fields are covered in snow, and the grasshopper cannot find anything to eat. Cold and hungry, he goes to the ant\'s home and begs for food. The ant reminds him that he spent the summer singing while she was storing food.\n\nOverall, the fable shows that hard work and planning ahead help us get through difficult times.',
      note: T('第一句就說出標題、作者和主要想法，只挑最重要的事件，按照原來的順序，用自己的話寫，而且沒有加入個人意見。', 'The first sentence gives the title, author and main idea; only the key events appear, in order, in the writer\'s own words, with no personal opinion added.'),
    },
    vocab: ['the main idea is', 'the author explains', 'first', 'meanwhile', 'finally', 'overall'],
  },
  {
    id: 'w5-poem-figurative',
    grade: 5,
    genre: 'poem',
    std: 'CCSS W.5.4',
    title: T('修辭詩', 'A poem full of figurative language'),
    topics: [T('月亮', 'the moon'), T('風', 'the wind'), T('我的城市', 'my city'), T('一棵老樹', 'an old tree'), T('第一場雪', 'the first snow'), T('夏天的最後一天', 'the last day of summer')],
    prompt: T('寫一首關於{t}的自由詩。至少用三種修辭技巧（明喻、暗喻、擬人、誇飾、頭韻），並注意斷行的位置。', 'Write a free-verse poem about {t}. Use at least three kinds of figurative language (simile, metaphor, personification, hyperbole, alliteration), and think about where each line breaks.'),
    plan: [
      { label: T('主題和感受', 'Subject and feeling'), hint: T('你想讓讀者有什麼感覺？', 'What feeling do you want readers to have?') },
      { label: T('畫面清單', 'Image list'), hint: T('寫下五個畫面或感官細節。', 'List five images or sensory details.') },
      { label: T('修辭', 'Figurative language'), hint: T('把畫面改成明喻、暗喻、擬人…', 'Turn images into similes, metaphors, personification…') },
      { label: T('結尾', 'Ending'), hint: T('最後一行要讓人印象深刻。', 'Make the last line memorable.') },
    ],
    starters: ['The … is a …', '… like a …', 'The … whispers / dances / sleeps …', 'A thousand …', 'Silver, soft, and silent, …'],
    words: [80, 180],
    checklist: [
      T('我至少用了三種修辭技巧。', 'I used at least three kinds of figurative language.'),
      T('每個畫面都很具體、很生動。', 'My images are specific and vivid.'),
      T('我刻意安排斷行和分段。', 'I chose my line breaks and stanzas on purpose.'),
      T('詩有一個主要的感受或想法。', 'My poem has one main feeling or idea.'),
      T('最後一行令人印象深刻。', 'My last line is memorable.'),
    ],
    mentor: {
      title: 'The Moon Keeps Watch',
      text: 'The moon is a night-light\nsomeone forgot to switch off,\nhumming over the rooftops\nwhile the city snores.\n\nShe peeks through my curtains\nlike a curious neighbor,\nspilling silver on my sheets,\nsoft and silent as snow.\n\nShe has watched a million million nights,\nthe dinosaurs, the pyramids,\nmy grandmother as a girl\nwaving from her window.\n\nTonight I wave back.\nShe does not wave,\nbut she stays,\nand somehow that is enough.',
      note: T('用了暗喻（月亮是夜燈）、擬人（月亮偷看、哼歌）、明喻（像好奇的鄰居）、誇飾（一百萬百萬個夜晚）和頭韻（soft and silent as snow），結尾短句帶出溫暖的感受。', 'The poem uses a metaphor (a night-light), personification (the moon peeks and hums), a simile (like a curious neighbor), hyperbole (a million million nights) and alliteration (soft and silent as snow); short final lines leave a warm feeling.'),
    },
    vocab: ['like', 'as … as', 'whispers', 'a million', 'silver', 'shimmer'],
  },
  {
    id: 'w5-literary-character',
    grade: 5,
    genre: 'literary',
    std: 'CCSS W.5.9a',
    title: T('分析一個角色', 'Character analysis'),
    topics: [T('一本小說的主角', 'the main character of a novel'), T('一個你欣賞的角色', 'a character you admire'), T('一個改變很多的角色', 'a character who changes a lot'), T('一個故事中的反派', 'a villain in a story'), T('一則寓言裡的動物', 'an animal in a fable')],
    prompt: T('寫一篇文章分析{t}。說明這個角色的個性特質，用故事中的具體細節和引文支持，並解釋角色如何影響故事。', 'Write an essay analyzing {t}. Name the character\'s traits, support them with specific details and quotations from the story, and explain how the character affects the story.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('書名、作者、角色，以及你的主要看法。', 'Title, author, character, and your main point.') },
      { label: T('特質一和證據', 'Trait 1 + evidence'), hint: T('角色做了或說了什麼？', 'What does the character do or say?') },
      { label: T('特質二和證據', 'Trait 2 + evidence'), hint: T('引用一句話並解釋。', 'Quote a line and explain it.') },
      { label: T('角色的改變或影響', 'Change or impact'), hint: T('角色怎麼改變故事？', 'How does the character shape the story?') },
      { label: T('結論', 'Conclusion'), hint: T('這個角色告訴我們什麼？', 'What does this character teach us?') },
    ],
    starters: ['In …, by …, the main character … is …', 'This shows that …', 'For example, when …', 'The author writes, "…"', 'This proves that …', 'By the end of the story, …'],
    words: [200, 350],
    checklist: [
      T('引言寫出書名、作者、角色和主要看法。', 'My introduction names the book, author, character and my main point.'),
      T('我用形容詞說出角色的特質。', 'I named the character\'s traits with precise adjectives.'),
      T('每個特質都有故事中的證據。', 'Each trait is supported by evidence from the story.'),
      T('引文有引號，並解釋它說明了什麼。', 'I put quotations in quotation marks and explained them.'),
      T('我說明了角色如何改變或影響故事。', 'I explained how the character changes or shapes the story.'),
      T('結論說出這個角色帶給我的啟發。', 'My conclusion tells what the character teaches.'),
    ],
    mentor: {
      title: 'The Quiet Courage of Biscuit',
      text: 'In The Lighthouse Cat by Mara Quinn, the main character, an orange cat named Biscuit, seems like an ordinary pet at first. However, as the story goes on, Biscuit proves to be both loyal and brave, and his courage saves a whole crew of fishermen.\n\nFirst, Biscuit is deeply loyal to the lighthouse keeper, Mr. Finch. When Mr. Finch falls and hurts his ankle, Biscuit refuses to leave his side. The author writes that Biscuit "curled against the old man\'s leg like a warm, purring blanket." This shows that Biscuit cares about Mr. Finch more than he cares about his own dinner or his comfortable bed.\n\nBiscuit is also brave, even though he is afraid. The tall, dark staircase frightens him, and the story describes how "his tail puffed up like a bottle brush" at the first step. Still, he climbs all one hundred steps to knock the switch that lights the lamp. Being brave does not mean having no fear; Biscuit is brave because he keeps going while he is scared.\n\nBiscuit\'s actions change the whole story. Without him, the lamp would stay dark, and the fishing boat would crash into the rocks. Because of one small cat, the crew makes it safely to shore.\n\nBiscuit reminds readers that heroes can be small and frightened. What matters is that they act when someone needs them.',
      note: T('引言說出主要看法（忠心又勇敢），每段一個特質，都用故事中的引文當證據並加以解釋，還說明角色怎麼影響情節，結論帶出啟示。', 'The introduction states a clear point (loyal and brave), each paragraph covers one trait with a quotation as evidence and an explanation, the essay shows how the character drives the plot, and the conclusion draws a lesson.'),
    },
    vocab: ['this shows that', 'for example', 'the author writes', 'this proves', 'by the end', 'trait'],
  },
  // ======================= GRADE 6 =======================
  {
    id: 'w6-personal-memoir',
    grade: 6,
    genre: 'personal',
    std: 'CCSS W.6.3',
    title: T('回憶錄：改變我的一刻', 'Memoir: a moment that changed me'),
    topics: [T('一個讓我重新認識家人的時刻', 'a moment that showed me something new about a family member'), T('一次搬家或轉學', 'moving to a new home or school'), T('一次失去或道別', 'a loss or a goodbye'), T('我發現自己擅長某件事', 'discovering something I am good at'), T('一次我改變想法的經驗', 'a time I changed my mind'), T('一件物品背後的故事', 'the story behind an object I treasure')],
    prompt: T('寫一篇回憶錄，主題是{t}。選一個關鍵場景仔細描寫，用對話、步調和感官細節呈現經驗，並反思這件事對你的意義。', 'Write a memoir about {t}. Zoom in on one key scene, use dialogue, pacing and sensory details to show the experience, and reflect on what it means to you.'),
    plan: [
      { label: T('引子', 'Lead'), hint: T('從場景中間開始（動作、對話或畫面）。', 'Start in the middle of the scene (action, dialogue or image).') },
      { label: T('背景', 'Background'), hint: T('讀者需要知道什麼？簡短交代。', 'What does the reader need to know? Keep it short.') },
      { label: T('關鍵場景', 'Key scene'), hint: T('放慢速度：動作、對話、想法、感官。', 'Slow down: action, dialogue, thoughts, senses.') },
      { label: T('之後', 'Aftermath'), hint: T('接下來發生什麼？', 'What happened next?') },
      { label: T('反思', 'Reflection'), hint: T('這件事怎麼改變了你？', 'How did this change you?') },
    ],
    starters: ['The smell of … still takes me back to …', 'I was eleven the year …', 'For a long moment, nobody spoke.', 'I had always believed that …', 'It wasn\'t until later that I understood …', 'Now, whenever I …, I remember …'],
    words: [250, 450],
    checklist: [
      T('開頭直接帶讀者進入場景。', 'My lead drops the reader into the scene.'),
      T('我聚焦在一個關鍵時刻，而不是流水帳。', 'I focus on one key moment instead of listing everything.'),
      T('我用對話、動作和內心想法呈現人物。', 'I use dialogue, action and thoughts to show people.'),
      T('重要的時刻我放慢步調，用感官細節描寫。', 'I slow down at the important moment with sensory details.'),
      T('我用轉折詞清楚表示時間和場景的轉換。', 'Transitions make shifts in time and place clear.'),
      T('結尾有深刻的反思，說明這件事的意義。', 'My ending reflects on why the moment matters.'),
      T('時態和人稱前後一致。', 'My tense and point of view stay consistent.'),
    ],
    mentor: {
      title: 'Grandpa\'s Hands',
      text: 'The smell of sawdust still takes me back to my grandfather\'s garage, to the afternoon I learned that his hands were shaking.\n\nI was eleven that summer. Grandpa had built everything in our family: my crib, my mother\'s bookshelf, the picnic table where we ate watermelon every July. When I asked him to help me build a birdhouse for the science fair, he grinned and said, "Bring your safety goggles, Ella. We start at nine."\n\nThe garage was cool and dim, with tools hanging on a pegboard like a museum display. Grandpa handed me a pencil and a ruler. "Measure twice, cut once," he said, the way he always did. I measured, and he held the board while I sawed.\n\nThen it was his turn to hammer the roof. He lifted a nail, and I watched it tremble between his fingers. He tried to tap it once, missed, and tried again. The nail slid sideways and clattered to the floor. For a long moment, neither of us spoke. The only sound was a fly bumping against the window.\n\n"Why don\'t you do this part," he finally said quietly, and held out the hammer.\n\nI took it. My first swing bent the nail, and we both laughed, and suddenly the garage felt warm again. He guided my wrist, and together we finished the roof.\n\nThat birdhouse did not win a ribbon. But it hangs outside Grandpa\'s kitchen window now, a little crooked, full of sparrows every spring.\n\nI had always thought of my grandfather as someone who could fix anything. That afternoon, I understood that sometimes the strongest thing a person can do is pass the hammer to someone else.',
      note: T('開頭用氣味把讀者帶進回憶，在最關鍵的一刻（釘子掉落）放慢步調，用沉默和細節製造張力，結尾的反思把一個小事件變成深刻的領悟。', 'The lead uses smell to open the memory, the key moment (the falling nail) is slowed down with silence and small details, and the reflection turns a small event into a deep insight.'),
    },
    vocab: ['for a long moment', 'it wasn\'t until', 'suddenly', 'finally', 'I understood', 'looking back'],
  },
  {
    id: 'w6-story-dialogue',
    grade: 6,
    genre: 'narrative',
    std: 'CCSS W.6.3',
    title: T('有衝突的短篇故事', 'A short story with conflict'),
    topics: [T('兩個朋友為了一個比賽起爭執', 'two friends who compete for the same prize'), T('一個保守秘密的角色', 'a character keeping a secret'), T('一場突如其來的暴風雨', 'a sudden storm during a trip'), T('一個機器人想要成為人類', 'a robot who wants to be human'), T('一個不小心的錯誤', 'an accident that must be fixed before anyone notices'), T('時間旅行到過去', 'traveling back in time')],
    prompt: T('寫一篇短篇故事：{t}。建立角色和觀點，用對話、步調和描寫發展衝突，並用多種轉折詞表示時間和場景的轉換，結局要自然地從事件中產生。', 'Write a short story about {t}. Establish characters and a point of view, develop the conflict with dialogue, pacing and description, use varied transitions to show shifts in time and setting, and let the ending grow naturally from the events.'),
    plan: [
      { label: T('觀點和角色', 'Point of view and characters'), hint: T('第一人稱或第三人稱？主角想要什麼？', 'First or third person? What does the main character want?') },
      { label: T('衝突', 'Conflict'), hint: T('什麼阻止主角得到想要的東西？', 'What stands in the way?') },
      { label: T('情節升高', 'Rising action'), hint: T('兩三個讓情況更緊張的事件。', 'Two or three events that raise the tension.') },
      { label: T('高潮', 'Climax'), hint: T('最緊張的時刻，放慢步調。', 'The most intense moment; slow down.') },
      { label: T('解決和結尾', 'Resolution'), hint: T('衝突怎麼解決？角色學到什麼？', 'How is the conflict resolved? What has the character learned?') },
    ],
    starters: ['Nobody in Room 6 expected …', '"You can\'t be serious," … said.', 'Three hours later, …', 'Across town, …', 'Her hands were shaking as …', 'In the end, …'],
    words: [250, 450],
    checklist: [
      T('我建立了清楚的觀點和角色。', 'I established a clear point of view and characters.'),
      T('故事有明確的衝突。', 'My story has a clear conflict.'),
      T('我用對話推動情節並呈現角色個性。', 'My dialogue moves the plot and shows personality.'),
      T('我在高潮放慢步調，其他地方節奏明快。', 'I slow down at the climax and keep other parts moving.'),
      T('我用多種轉折詞表示時間和地點的改變。', 'I used varied transitions to show shifts in time and place.'),
      T('結局合理，從故事事件中自然產生。', 'My ending follows naturally from the events.'),
      T('對話的標點和分段正確（換人說話就換段）。', 'Dialogue is punctuated correctly, with a new paragraph for each speaker.'),
    ],
    mentor: {
      title: 'The Bridge',
      text: 'Nobody in Room 6 expected Ruby and Owen to be partners for the bridge challenge. They had not spoken since October, when Owen\'s volcano beat Ruby\'s solar oven at the science fair.\n\n"We each have one hundred craft sticks and one bottle of glue," Ms. Tanaka announced. "On Friday, we test the bridges with weights. Strongest bridge wins."\n\nRuby sketched a long, flat design. Owen sketched triangles.\n\n"Triangles waste sticks," Ruby said.\n\n"Flat bridges sag," Owen replied, without looking up.\n\nFor two days, they built in stiff silence. Ruby glued the deck; Owen glued the sides. Neither checked the other\'s work. By Wednesday afternoon, the bridge looked like two different projects stuck together, because it was.\n\nOn Thursday, Ruby set a textbook on the deck to test it. With a soft crack, the middle bowed, and a stick snapped loose and skittered across the floor.\n\nRuby stared at it. Her ears burned. Across the table, Owen did not say "I told you so." He picked up the broken stick and turned it over in his fingers.\n\n"Your deck is really smooth," he said at last. "My sides are strong. What if we put triangles under your deck instead of beside it?"\n\nRuby hesitated, then pulled a fresh sheet of paper between them. Together, they drew a row of triangles beneath the deck, like teeth holding it up.\n\nThey worked through lunch. They worked after school. When Ms. Tanaka finally flicked off the lights on Thursday, the glue was still drying.\n\nOn Friday, the class gathered around. One weight. Five weights. Ten. The bridge held. At twelve, it groaned but did not move.\n\nThey did not win; a team with a tower design held fifteen. However, as they carried their bridge back to the shelf, Ruby noticed that she and Owen were both holding the same side.',
      note: T('故事一開始就建立衝突（兩個不說話的對手被分在同一組），用簡短的對話和沉默表現緊張，在高潮（橋斷掉、測試重量）放慢步調，結局用一個小動作（拿著同一邊）呈現關係的改變。', 'Conflict is set up in the first line, short dialogue and silence create tension, the pacing slows at the crack and the weight test, and a small final image (holding the same side) shows how the relationship changed.'),
    },
    vocab: ['at last', 'meanwhile', 'by Wednesday', 'hesitated', 'without looking up', 'however'],
  },
  {
    id: 'w6-argument',
    grade: 6,
    genre: 'argument',
    std: 'CCSS W.6.1',
    title: T('論說文', 'Argument essay'),
    topics: [T('中學是否應該晚一點上課', 'whether middle school should start later'), T('學校是否應該禁止上課時間使用手機', 'whether schools should ban phones during the school day'), T('學生是否應該被要求做社區服務', 'whether students should be required to do community service'), T('學校是否應該取消回家作業', 'whether schools should get rid of homework'), T('體育課是否應該每天都上', 'whether P.E. should be every day'), T('學校餐廳是否應該停用一次性塑膠', 'whether cafeterias should stop using single-use plastic')],
    prompt: T('寫一篇論說文，討論{t}。提出清楚的主張，用明確的理由和相關、可信的證據支持，承認並反駁對立的觀點，並保持正式的語氣。', 'Write an argument about {t}. State a clear claim, support it with clear reasons and relevant, credible evidence, acknowledge and answer an opposing view, and keep a formal style.'),
    plan: [
      { label: T('引言和主張', 'Introduction and claim'), hint: T('背景 + 清楚、可以辯論的主張。', 'Background + a clear, arguable claim.') },
      { label: T('理由一 + 證據', 'Reason 1 + evidence'), hint: T('事實、數據、專家說法，並解釋。', 'Facts, data, expert words, then explain.') },
      { label: T('理由二 + 證據', 'Reason 2 + evidence'), hint: T('用不同類型的證據。', 'Use a different type of evidence.') },
      { label: T('反方意見與反駁', 'Counterclaim and rebuttal'), hint: T('Critics argue… However, …', 'Critics argue… However, …') },
      { label: T('結論', 'Conclusion'), hint: T('重申主張，說明為什麼重要。', 'Restate the claim and why it matters.') },
    ],
    starters: ['Every weekday morning, …', 'Schools should …', 'The first reason is that …', 'According to …, …', 'This evidence shows that …', 'Critics argue that … However, …', 'Therefore, …'],
    words: [250, 450],
    checklist: [
      T('主張清楚、可以辯論，放在引言最後。', 'My claim is clear and arguable, at the end of my introduction.'),
      T('每個理由都有相關、可信的證據。', 'Each reason has relevant, credible evidence.'),
      T('我解釋了證據如何支持主張。', 'I explained how the evidence supports my claim.'),
      T('我承認並反駁了對立的觀點。', 'I acknowledged and answered an opposing claim.'),
      T('我用轉折詞清楚連接主張、理由和證據。', 'Transitions clearly connect claim, reasons and evidence.'),
      T('語氣正式，沒有俚語。', 'My style is formal, with no slang.'),
      T('結論從論點中自然產生。', 'My conclusion follows from my argument.'),
    ],
    mentor: {
      title: 'Let Middle Schoolers Sleep',
      text: 'Every weekday morning, thousands of middle school students stumble to the bus stop in the dark, yawning and half awake. Many schools begin classes before 8:00 a.m., but this schedule works against the way young bodies are built. Middle schools should start no earlier than 8:30 a.m. so that students can get the sleep they need to learn and stay healthy.\n\nThe first reason is that adolescents naturally fall asleep later. According to the American Academy of Pediatrics, the body clock of a young teenager shifts during puberty, so most students cannot easily fall asleep before 11:00 p.m. If a student must wake up at 6:00 a.m., he or she gets only about seven hours of sleep, while doctors recommend nine to twelve hours for children of this age. In other words, an early bell guarantees that many students arrive tired.\n\nSecond, well-rested students perform better in school. When schools in several states moved their start times later, researchers found that attendance rose and fewer students fell asleep in class. Tired students struggle to focus and remember new information, so a later start is not a luxury; it is a learning tool.\n\nCritics argue that a later start would make it harder for families to get to work and would push after-school sports into the evening. These concerns are reasonable. However, many districts have solved them by adjusting bus routes and offering supervised morning programs for students whose parents leave early. A small scheduling change is worth the large benefit to students\' health.\n\nTherefore, school leaders should move middle school start times to 8:30 a.m. or later. When students are allowed to sleep, they arrive ready to think, participate, and succeed.',
      note: T('引言最後提出清楚的主張；兩個理由分別用專家意見和研究結果當證據，並用 In other words 解釋；承認反方的擔心是合理的，再提出解決方法反駁；全文語氣正式。', 'The claim ends the introduction; one reason uses an expert organization and the other uses research findings, each explained ("In other words"); the writer grants that critics\' concerns are reasonable before answering them; the style stays formal throughout.'),
    },
    vocab: ['according to', 'in other words', 'this evidence shows', 'critics argue', 'however', 'therefore'],
  },
  {
    id: 'w6-informative-explain',
    grade: 6,
    genre: 'informative',
    std: 'CCSS W.6.2',
    title: T('說明某件事如何運作', 'Explain how something works'),
    topics: [T('火山如何噴發', 'how volcanoes erupt'), T('人體如何對抗感冒', 'how the body fights a cold'), T('太陽能板如何發電', 'how solar panels make electricity'), T('飛機如何飛上天', 'how airplanes stay in the air'), T('水循環', 'how the water cycle works'), T('蜜蜂如何溝通', 'how honeybees communicate')],
    prompt: T('寫一篇說明文，解釋{t}。用定義、例子和比喻把複雜的過程說清楚，使用正確的專有名詞，並用轉折詞說明步驟和因果。', 'Write an informative essay explaining {t}. Use definitions, examples and comparisons to make a complex process clear, use precise vocabulary, and use transitions to show steps and cause and effect.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('有趣的開頭 + 主旨句。', 'A hook + a clear focus statement.') },
      { label: T('背景和定義', 'Background and terms'), hint: T('讀者需要先懂哪些詞？', 'What terms must readers understand first?') },
      { label: T('過程步驟', 'The process'), hint: T('一步一步，說明原因和結果。', 'Step by step, with causes and effects.') },
      { label: T('例子或比喻', 'Example or comparison'), hint: T('用熟悉的東西比喻。', 'Compare it to something familiar.') },
      { label: T('結論', 'Conclusion'), hint: T('為什麼這很重要或很神奇？', 'Why does this matter or amaze?') },
    ],
    starters: ['Few events on Earth are as …', '… is a process in which …', 'To understand …, it helps to know …', 'As a result, …', 'Think of it like …', 'This is why …', 'In short, …'],
    words: [250, 450],
    checklist: [
      T('引言清楚說出要說明的主題。', 'My introduction clearly previews the topic.'),
      T('我定義了重要的專有名詞。', 'I defined important terms.'),
      T('過程的步驟順序清楚，並說明因果關係。', 'The steps are in clear order, with causes and effects explained.'),
      T('我用了例子或比喻讓讀者更容易懂。', 'I used examples or comparisons to help readers understand.'),
      T('我用了多種轉折詞。', 'I used varied transitions.'),
      T('語氣正式、客觀。', 'My style is formal and objective.'),
      T('結論總結重點並說明它的重要性。', 'My conclusion sums up and explains why it matters.'),
    ],
    mentor: {
      title: 'Pressure Cooker Planet: How Volcanoes Erupt',
      text: 'Few events on Earth are as powerful as a volcanic eruption. In a matter of minutes, a quiet mountain can send ash miles into the sky. Although eruptions look sudden, they are the result of a slow process that begins deep underground and depends on heat, pressure, and gas.\n\nTo understand eruptions, it helps to know what lies beneath our feet. Earth\'s outer layer, called the crust, is broken into giant pieces known as tectonic plates. Below the crust is the mantle, a thick layer of hot rock. In certain places, especially where plates pull apart or slide under one another, some of this rock melts. Melted rock underground is called magma.\n\nBecause magma is lighter than the solid rock around it, it slowly rises and collects in a pocket called a magma chamber. Magma also contains dissolved gases, mostly water vapor and carbon dioxide. As more magma pushes into the chamber, pressure builds. Think of it like a bottle of soda that has been shaken: the gas is trapped, waiting for an opening.\n\nEventually, the pressure becomes greater than the strength of the rock above. The magma forces its way up through cracks and bursts out at the surface. Once it reaches the surface, it is called lava. If the magma is thick and full of gas, the eruption is explosive, blasting out ash and rock. If the magma is thin and runny, as in Hawaii, the lava flows out more gently in glowing rivers.\n\nIn short, a volcanic eruption is Earth releasing pressure that has built up for years. Scientists who study these signs, such as small earthquakes and swelling ground, can often warn people before an eruption happens, which saves countless lives.',
      note: T('先定義專有名詞（crust、magma、lava），再依因果順序說明過程，用搖過的汽水做比喻，比較兩種噴發方式，最後說明這個知識為什麼重要。', 'Key terms (crust, magma, lava) are defined first, the process is explained in cause-and-effect order, a shaken soda bottle makes the idea concrete, two kinds of eruptions are contrasted, and the conclusion explains why the knowledge matters.'),
    },
    vocab: ['is called', 'because', 'as a result', 'eventually', 'think of it like', 'in short'],
  },
  {
    id: 'w6-research-sources',
    grade: 6,
    genre: 'research',
    std: 'CCSS W.6.7',
    title: T('研究報告：引用多個來源', 'Research report with sources'),
    topics: [T('塑膠污染對海洋的影響', 'how plastic pollution affects the ocean'), T('一位改變世界的科學家', 'a scientist who changed the world'), T('睡眠對學生的影響', 'how sleep affects students'), T('都市裡的野生動物', 'wildlife that lives in cities'), T('古代的一項發明', 'an ancient invention we still use'), T('氣候變遷與極地動物', 'climate change and polar animals')],
    prompt: T('針對{t}提出一個研究問題，從至少三個可靠來源蒐集資料，寫一篇研究報告。用改寫和直接引用呈現資料，在文中標明出處，最後列出參考資料，避免抄襲。', 'Ask a research question about {t}, gather information from at least three credible sources, and write a report. Use paraphrases and quotations, credit each source in the text, list your sources at the end, and avoid plagiarism.'),
    plan: [
      { label: T('研究問題', 'Research question'), hint: T('一個可以回答、但需要研究的問題。', 'A question that research can answer.') },
      { label: T('引言和主旨', 'Introduction and thesis'), hint: T('背景 + 你的答案（主旨句）。', 'Background + your answer (thesis).') },
      { label: T('重點段落', 'Body sections'), hint: T('每段一個重點，至少有一個來源。', 'One point each, with at least one source.') },
      { label: T('結論', 'Conclusion'), hint: T('回答研究問題，說明意義。', 'Answer the question and explain why it matters.') },
      { label: T('參考資料', 'Works cited'), hint: T('作者、標題、出版者、日期。', 'Author, title, publisher, date.') },
    ],
    starters: ['How does … affect …?', 'According to …, …', 'As … explains, "…"', 'Research from … shows that …', 'This suggests that …', 'In conclusion, …', 'Works Cited'],
    words: [250, 450],
    checklist: [
      T('我有一個清楚的研究問題和主旨句。', 'I have a clear research question and thesis.'),
      T('我用了至少三個可靠的來源。', 'I used at least three credible sources.'),
      T('改寫用自己的話，引用有加引號。', 'Paraphrases are in my own words; quotations are in quotation marks.'),
      T('每個資料都在文中標明出處。', 'Every borrowed idea is credited in the text.'),
      T('我解釋了資料，而不只是列出來。', 'I explained the information instead of only listing it.'),
      T('最後有格式一致的參考資料清單。', 'I ended with a consistent list of sources.'),
      T('語氣正式、客觀。', 'My style is formal and objective.'),
    ],
    mentor: {
      title: 'Wild Neighbors: How Animals Survive in Cities',
      text: 'When most people picture wildlife, they imagine forests or grasslands, not parking lots and rooftops. Yet many animals now live in the middle of busy cities. How do they survive there? Research shows that city animals succeed by changing their diets, their schedules, and even their behavior.\n\nFirst, many urban animals are flexible eaters. In her book City Creatures, biologist Hannah Reyes explains that raccoons and crows thrive because they "treat a city like an all-you-can-eat buffet." Instead of depending on one food, they eat fruit, insects, and food that people throw away. Animals with very narrow diets, by contrast, usually disappear when a city grows.\n\nSecond, some animals change when they are active. According to a 2021 article in Young Scientist Magazine, coyotes in cities hunt mostly at night, while coyotes in the countryside are active during the day as well. By moving their schedules to the hours when fewer people are outside, city coyotes avoid danger from cars and crowds.\n\nFinally, city life can change animal behavior. Researcher Marcus Bell, writing for the Urban Wildlife Project website, describes songbirds that sing at a higher pitch in noisy neighborhoods. Their usual low songs would be drowned out by traffic, so higher notes help them reach their mates.\n\nIn conclusion, city animals survive by being adaptable. Their success suggests that cities are not empty of nature; they are a new kind of habitat. If people plant trees, protect green spaces, and secure their trash, humans and wild neighbors can share these spaces more safely.\n\nWorks Cited\nBell, Marcus. "Songs of the City." Urban Wildlife Project, 2023.\nReyes, Hannah. City Creatures. Maple Leaf Press, 2020.\n"Coyotes After Dark." Young Scientist Magazine, 2021.',
      note: T('用研究問題開頭並給出主旨；三段各用一個來源，混合直接引用和改寫，每次都在文中標明出處並加以解釋；最後有格式一致的參考資料清單。（來源為範例虛構）', 'A research question leads to a thesis; each body paragraph uses one source, mixing quotation and paraphrase, credits it in the text and explains it; the works-cited list is consistent. (The sources are made up for this example.)'),
    },
    vocab: ['according to', 'explains that', 'research shows', 'by contrast', 'this suggests', 'in conclusion'],
  },
  {
    id: 'w6-literary-theme',
    grade: 6,
    genre: 'literary',
    std: 'CCSS W.6.9a',
    title: T('文學分析：主題', 'Literary analysis: theme'),
    topics: [T('你讀過的一本小說', 'a novel you have read'), T('一篇短篇故事', 'a short story'), T('一則寓言或神話', 'a fable or myth'), T('一首詩', 'a poem'), T('一部改編自書的電影', 'a movie based on a book')],
    prompt: T('寫一篇文章分析{t}的主題。用一句話說出主題（不只是一個字），用文本中的證據支持，並解釋角色和事件怎麼傳達這個主題。', 'Write an essay analyzing the theme of {t}. State the theme as a full sentence (not just one word), support it with evidence from the text, and explain how characters and events develop it.'),
    plan: [
      { label: T('引言', 'Introduction'), hint: T('作品、作者、簡介 + 主題句。', 'Title, author, brief summary + theme statement.') },
      { label: T('證據一', 'Evidence 1'), hint: T('故事開頭或中段的事件 + 解釋。', 'An early event + explanation.') },
      { label: T('證據二', 'Evidence 2'), hint: T('一句引文 + 它如何呈現主題。', 'A quotation + how it shows the theme.') },
      { label: T('角色的改變', "Character's change"), hint: T('角色到最後學到什麼？', 'What does the character learn by the end?') },
      { label: T('結論', 'Conclusion'), hint: T('這個主題和真實生活有什麼關係？', 'How does the theme connect to real life?') },
    ],
    starters: ['In …, author … shows that …', 'Early in the story, …', 'This moment reveals …', 'The author writes, "…"', 'This suggests that …', 'By the end, …', 'The story reminds readers that …'],
    words: [250, 450],
    checklist: [
      T('主題用完整的句子說出，不只是一個字。', 'I stated the theme as a full sentence, not one word.'),
      T('我簡短介紹作品，沒有從頭到尾重述劇情。', 'I summarized briefly instead of retelling the whole plot.'),
      T('我用了至少兩個文本證據，包括引文。', 'I used at least two pieces of text evidence, including a quotation.'),
      T('每個證據之後都有解釋。', 'I explained each piece of evidence.'),
      T('我說明角色的改變如何呈現主題。', 'I showed how the character\'s change develops the theme.'),
      T('我用現在式討論文學作品。', 'I used the present tense to discuss the text.'),
    ],
    mentor: {
      title: 'Small but Mighty: Theme in "The Lion and the Mouse"',
      text: 'In Aesop\'s fable "The Lion and the Mouse," a mighty lion spares a tiny mouse, and the mouse later frees the lion from a hunter\'s net. Although the story is only a few paragraphs long, it develops a powerful theme: kindness is never wasted, because even the smallest friend can make a big difference.\n\nEarly in the fable, the lion has every reason to ignore the mouse. When the mouse wakes him by running across his paw, the lion traps it and prepares to eat it. The mouse begs for its life and promises to repay him someday. The lion laughs at the idea that something so small could ever help him. This moment reveals that the lion judges others by their size, which sets up the lesson he will soon learn.\n\nThe lion\'s choice to let the mouse go, even while laughing, is an act of kindness. Later, when the lion is caught in a hunter\'s ropes, his great strength is useless. The more he struggles, the tighter the net becomes. The author shows that the lion\'s roar, which once frightened every animal, now only brings the mouse running to help. With its sharp little teeth, the mouse gnaws through the ropes until the lion is free.\n\nBy the end, the roles are reversed. The mouse reminds the lion that he once laughed at its promise, but now he owes his life to a creature he thought was too small to matter. The lion learns that kindness creates friendships he could never have predicted.\n\nThe fable reminds readers that we should treat everyone with kindness, regardless of their size or power. In real life, a classmate who seems quiet or unimportant may one day be the person who helps us most.',
      note: T('主題用完整的句子說出；先簡短介紹故事，再依情節順序提出證據，每個證據後面都解釋它如何呈現主題；用現在式討論作品，結論連結到真實生活。', 'The theme is a full sentence; a short summary is followed by evidence in story order, each piece explained in terms of the theme; the essay uses the present tense and connects the theme to real life.'),
    },
    vocab: ['the theme is', 'this reveals', 'this suggests', 'early in the story', 'by the end', 'the author shows'],
  },
  {
    id: 'w6-compare-texts',
    grade: 6,
    genre: 'compare',
    std: 'CCSS W.6.2',
    title: T('比較兩個主題', 'Compare and contrast two subjects'),
    topics: [T('紙本信件和電子郵件', 'handwritten letters and emails'), T('太陽能和風力發電', 'solar power and wind power'), T('古代奧運和現代奧運', 'the ancient and modern Olympic Games'), T('網路學習和在教室學習', 'online learning and classroom learning'), T('兩部同一個故事的版本', 'a book and its movie version'), T('鯊魚和海豚', 'sharks and dolphins')],
    prompt: T('寫一篇比較和對照的文章，主題是{t}。用逐點比較的結構組織，提出清楚的主旨，用事實和例子說明異同，並在結論說明這個比較讓我們理解了什麼。', 'Write a compare-and-contrast essay about {t}. Organize it point by point, state a clear thesis, explain similarities and differences with facts and examples, and conclude with what the comparison helps us understand.'),
    plan: [
      { label: T('引言和主旨', 'Introduction and thesis'), hint: T('兩者是什麼？比較後的重點發現。', 'What are they? What does the comparison reveal?') },
      { label: T('比較點一', 'Point 1'), hint: T('兩者在第一個重點上相同或不同？', 'How are they alike or different on point 1?') },
      { label: T('比較點二', 'Point 2'), hint: T('Similarly / In contrast …', 'Similarly / In contrast …') },
      { label: T('比較點三', 'Point 3'), hint: T('Whereas … / Unlike …', 'Whereas … / Unlike …') },
      { label: T('結論', 'Conclusion'), hint: T('這個比較讓我們學到什麼？', 'What does the comparison teach us?') },
    ],
    starters: ['Although … and … both …, they differ in …', 'Like …, … also …', 'Unlike …, …', 'Whereas …, …', 'Similarly, …', 'In contrast, …', 'Ultimately, …'],
    words: [250, 450],
    checklist: [
      T('主旨說出兩者最重要的相同或不同之處。', 'My thesis states the most important likeness or difference.'),
      T('我用逐點比較的方式組織段落。', 'I organized my paragraphs point by point.'),
      T('每個比較點都有具體的事實或例子。', 'Each point has specific facts or examples.'),
      T('我用了多種比較轉折詞（whereas、unlike、similarly）。', 'I used varied comparison transitions (whereas, unlike, similarly).'),
      T('語氣正式、客觀。', 'My style is formal and objective.'),
      T('結論說明比較帶來的理解。', 'My conclusion explains what the comparison reveals.'),
    ],
    mentor: {
      title: 'Sharks and Dolphins: Same Ocean, Different Lives',
      text: 'With their sleek gray bodies and tall back fins, sharks and dolphins can look almost identical from a boat. Both are skilled ocean predators, and both have shaped stories and movies for centuries. However, a closer look at how they breathe, how they raise their young, and how they live together reveals that they are very different animals.\n\nThe most important difference is how they breathe. Sharks are fish, so they pull oxygen from the water through gills on the sides of their heads. In contrast, dolphins are mammals, like humans. They must swim to the surface to breathe air through a blowhole on top of their heads. Because of this, a dolphin can drown if it is trapped underwater, whereas a shark is at home beneath the waves.\n\nThe two animals also begin life in very different ways. Many sharks lay eggs or give birth to pups that must survive on their own right away. Unlike sharks, dolphin mothers give birth to live calves and feed them milk. A young dolphin stays with its mother for several years, learning how to hunt and communicate.\n\nFinally, their social lives are different. Most sharks spend much of their time alone, although some gather where food is plentiful. Dolphins, on the other hand, live in groups called pods. They use clicks and whistles to talk to one another, and they often hunt as a team.\n\nUltimately, sharks and dolphins show that animals can share the same shape without sharing the same life. Their similar bodies come from living in the same ocean, but their differences remind us that what is inside an animal matters as much as how it looks.',
      note: T('主旨點出比較的三個重點；逐點比較（呼吸、繁殖、社會生活），每段同時談兩種動物，用 in contrast、whereas、unlike、on the other hand 連接，結論說出比較帶來的領悟。', 'The thesis previews three points; the essay goes point by point (breathing, young, social life), discussing both animals in each paragraph with transitions like in contrast, whereas, unlike and on the other hand, and the conclusion explains the insight.'),
    },
    vocab: ['whereas', 'unlike', 'similarly', 'in contrast', 'on the other hand', 'ultimately'],
  },
  {
    id: 'w6-letter-editor',
    grade: 6,
    genre: 'letter',
    std: 'CCSS W.6.1',
    title: T('投書給編輯', 'Letter to the editor'),
    topics: [T('社區需要更多自行車道', 'the need for more bike lanes in your town'), T('保護一個當地的公園或濕地', 'protecting a local park or wetland'), T('減少學校的食物浪費', 'reducing food waste at school'), T('圖書館的開放時間', "the library's opening hours"), T('讓學生參與社區決策', 'giving students a voice in town decisions')],
    prompt: T('寫一封投書給地方報紙的編輯，討論{t}。開頭說明你是誰、你的主張，用證據支持，回應不同的看法，並提出具體的行動建議。語氣正式、有禮貌。', 'Write a letter to the editor of a local newspaper about {t}. Introduce yourself and your claim, support it with evidence, respond to a different view, and propose a specific action. Keep the tone formal and respectful.'),
    plan: [
      { label: T('稱呼和主張', 'Greeting and claim'), hint: T('To the Editor: 我是誰？主張是什麼？', 'To the Editor: Who are you? What is your claim?') },
      { label: T('問題和證據', 'Problem and evidence'), hint: T('發生了什麼問題？有什麼證據？', 'What is the problem? What is the evidence?') },
      { label: T('不同的看法', 'Another view'), hint: T('有人會說… 但是…', 'Some may say… but…') },
      { label: T('行動建議', 'Call to action'), hint: T('誰應該做什麼？', 'Who should do what?') },
      { label: T('結尾和署名', 'Closing'), hint: T('Sincerely, 姓名、年級、學校', 'Sincerely, name, grade, school') },
    ],
    starters: ['To the Editor:', 'As a sixth grader at …, I …', 'I am writing to urge …', 'Last month, …', 'Some residents may argue that … However, …', 'I urge the town council to …', 'Sincerely,'],
    words: [250, 450],
    checklist: [
      T('開頭介紹自己並清楚提出主張。', 'I introduce myself and state my claim early.'),
      T('我用具體的證據說明問題。', 'I describe the problem with specific evidence.'),
      T('我有禮貌地回應不同的看法。', 'I respond respectfully to a different view.'),
      T('我提出具體、可行的行動建議。', 'I propose a specific, realistic action.'),
      T('語氣正式、有禮貌，沒有攻擊別人。', 'My tone is formal and respectful, with no insults.'),
      T('信的格式正確。', 'My letter uses the correct format.'),
    ],
    mentor: {
      title: 'To the Editor: Make Maple Street Safe for Bikes',
      text: 'To the Editor:\n\nAs a sixth grader at Lincoln Middle School, I ride my bike to school on Maple Street almost every day. I am writing to urge the town council to paint a protected bike lane on Maple Street between Oak Avenue and the school.\n\nMaple Street is one of the busiest roads in our town, and it has no space set aside for cyclists. Each morning, I squeeze between parked cars and traffic while delivery trucks pass just a few feet away. I am not the only one. Last month, my science class counted bicycles on Maple Street for one week. We counted an average of 46 student riders every morning, and on three of those days we saw near misses between bikes and cars.\n\nA protected bike lane would make a real difference. A painted line and a row of plastic posts would give cyclists a clear path and remind drivers to slow down. Other towns have done this successfully. When the nearby city of Riverton added a protected lane near its high school, the local newspaper reported that more students began biking and traffic near the school decreased.\n\nSome residents may argue that a bike lane would remove parking spaces that shoppers need. I understand this concern. However, the lane would only need to remove parking on one side of the street, and a public lot sits just one block away. A few parking spaces should not matter more than the safety of dozens of students.\n\nI urge the town council to discuss a Maple Street bike lane at its next meeting and to invite students to share their experiences. Our town has always prided itself on being a good place to raise children. Making it safe for them to get to school is a good place to start.\n\nSincerely,\nNora Kim\nGrade 6, Lincoln Middle School',
      note: T('開頭說明身分並提出主張，用班上的實地調查數據和其他城市的例子當證據，有禮貌地承認反對意見並提出解決方式，最後提出明確的行動建議。', 'The writer gives her identity and claim up front, uses data from a class survey and another town\'s example as evidence, politely acknowledges the parking concern and answers it, and ends with a specific action.'),
    },
    vocab: ['I am writing to urge', 'for example', 'I understand this concern', 'however', 'I urge', 'sincerely'],
  },
  {
    id: 'w6-poem-free-verse',
    grade: 6,
    genre: 'poem',
    std: 'CCSS W.6.4',
    title: T('自由詩：一個物品的故事', 'Free verse: the life of an object'),
    topics: [T('一雙舊球鞋', 'an old pair of sneakers'), T('奶奶的茶壺', "a grandparent's teapot"), T('一把被遺忘的雨傘', 'a forgotten umbrella'), T('一本借了很多次的圖書館書', 'a library book borrowed many times'), T('一顆在口袋裡的石頭', 'a stone in your pocket'), T('教室裡的時鐘', 'the classroom clock')],
    prompt: T('寫一首自由詩，從{t}的角度或關於它來寫。用具體的意象、修辭和刻意的斷行，讓一個平凡的物品帶出更大的想法或感受。', 'Write a free-verse poem about, or in the voice of, {t}. Use concrete images, figurative language and deliberate line breaks so an ordinary object reveals a bigger idea or feeling.'),
    plan: [
      { label: T('物品和觀點', 'Object and speaker'), hint: T('誰在說話？物品自己還是你？', 'Who is speaking: the object or you?') },
      { label: T('具體意象', 'Concrete images'), hint: T('它看起來、摸起來、聽起來怎麼樣？', 'How does it look, feel and sound?') },
      { label: T('它的經歷', 'Its history'), hint: T('它經歷過什麼？', 'What has it been through?') },
      { label: T('更大的想法', 'The bigger idea'), hint: T('這個物品代表什麼？（時間、家人、成長…）', 'What does it stand for? (time, family, growing up…)') },
    ],
    starters: ['I have been …', 'You found me …', 'My … is …', 'Every morning, …', 'Now I …', 'Still, …'],
    words: [100, 220],
    checklist: [
      T('我用了具體、新鮮的意象。', 'I used concrete, fresh images.'),
      T('我用了至少兩種修辭技巧。', 'I used at least two kinds of figurative language.'),
      T('斷行和分段是刻意安排的。', 'My line breaks and stanzas are deliberate.'),
      T('觀點（誰在說話）前後一致。', 'The speaker\'s point of view stays consistent.'),
      T('詩從具體的物品帶出更大的想法。', 'The poem moves from an object to a bigger idea.'),
      T('我刪掉了不必要的字。', 'I cut words that were not needed.'),
    ],
    mentor: {
      title: 'Sneakers, Size Five',
      text: 'I came out of the box\nwhite as a new notebook,\nlaces stiff and proud,\nsmelling of rubber and promises.\n\nYou wore me to the first day of fourth grade,\nto the creek where you lost one sock,\nto the kickball game\nwhen the ball flew higher than the flagpole\nand you did not stop running\neven after the bell.\n\nNow my toes are gray,\nmy heels are worn down to a whisper,\nand my tongue hangs out\nlike a tired dog after a long walk.\n\nYour feet grew\nwhile I was busy carrying them.\nThis morning you laced up\na bigger pair, blue and bright,\nand set me by the door.\n\nI am not sad.\nI hold the shape of every mile\nyou do not remember running.\nThat is what old shoes are for.',
      note: T('用球鞋的口吻說話，意象具體（白得像新筆記本），用了明喻、擬人和誇飾，斷行製造停頓，最後從一雙鞋帶出「成長和回憶」的更大想法。', 'The sneakers speak in their own voice, images are concrete ("white as a new notebook"), simile, personification and hyperbole appear, line breaks create pauses, and the ending moves from shoes to the bigger idea of growing up and memory.'),
    },
    vocab: ['like', 'as … as', 'whisper', 'carry', 'still', 'remember'],
  },
];

export default { skills, prompts };
