// Grades 1–3: skills (auto-checked drills) and writing prompts. See SPEC.md.
import { T, NAMES, words, ansTap, ansChoice, ansText, ansOrder, third, past, an, cap, low } from '../util.js';

// ---------- shared word banks & helpers ----------
const BOYS = ['Max', 'Leo', 'Jay', 'Noah', 'Ethan', 'Ben', 'Ryan', 'Owen', 'Lucas', 'Sam'];
const GIRLS = ['Mia', 'Emma', 'Ava', 'Lily', 'Zoe', 'Chloe', 'Grace', 'Ella', 'Ruby', 'Nora'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HOLIDAYS = ['Halloween', 'Thanksgiving', 'Christmas', 'Easter', 'Hanukkah'];
const PLACES = ['Texas', 'Canada', 'Japan', 'Taiwan', 'Chicago', 'Mexico', 'Hawaii', 'Florida', 'London', 'Paris'];
const PRODUCTS = ['Lego', 'Crayola', 'Cheerios'];
const CITIES = ['Boston', 'Taipei', 'Dallas', 'Seattle', 'Denver', 'Tokyo'];
const NUMS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
// a kid with matching pronouns
const kid = (r, girl = r.chance(0.5)) => {
  const n = r.pick(girl ? GIRLS : BOYS);
  return { n, girl, he: girl ? 'she' : 'he', He: girl ? 'She' : 'He', him: girl ? 'her' : 'him', his: girl ? 'her' : 'his', self: girl ? 'herself' : 'himself' };
};
const twoNames = (r) => r.sample(NAMES, 2);
const bareW = (t) => t.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');
const findTok = (ws, w) => ws.findIndex((t) => bareW(t) === w);
// copy of the tokens with token k's word replaced (punctuation kept)
const swapTok = (ws, k, w) => { const b = ws.slice(); b[k] = ws[k].replace(bareW(ws[k]), w); return b; };
// pick 2 distinct wrong options from a pool, never equal to the right one
const wrongs = (r, pool, right, k = 2) => r.sample(pool.filter((x) => x !== right), k);

// why a word needs a capital letter
function capWhy(w, k) {
  const zh = [], en = [];
  if (k === 0) { zh.push('它是句子的第一個字'); en.push('it is the first word of the sentence'); }
  if (w === 'I') { zh.push('「I」（我）永遠大寫'); en.push('the word "I" is always a capital'); }
  if (NAMES.includes(w)) { zh.push('它是人名'); en.push('it is a name'); }
  if (DAYS.includes(w)) { zh.push('它是星期幾'); en.push('it is a day of the week'); }
  if (MONTHS.includes(w)) { zh.push('它是月份'); en.push('it is a month'); }
  if (HOLIDAYS.includes(w)) { zh.push('它是節日的名字'); en.push('it is the name of a holiday'); }
  if (PLACES.includes(w) || CITIES.includes(w)) { zh.push('它是地名（國家、州或城市）'); en.push('it is the name of a place'); }
  if (PRODUCTS.includes(w)) { zh.push('它是產品（品牌）的名字'); en.push('it is a product (brand) name'); }
  if (!zh.length) { zh.push('它是專有名詞'); en.push('it is a special name'); }
  return T(`「${w}」要大寫，因為${zh.join('，而且')}。`, `"${w}" needs a capital because ${en.join(', and ')}.`);
}
// lowercase one capital word (chosen by filter) → tap drill
function capDrill(r, good, ok = () => true) {
  const ws = words(good);
  const cand = ws.map((t, i) => i).filter((i) => /^[A-Z]/.test(bareW(ws[i])) && ok(bareW(ws[i]), i));
  const k = r.pick(cand), w = bareW(ws[k]);
  return { ws, k, w, bad: swapTok(ws, k, w.toLowerCase()) };
}

const skills = [];

// =====================================================================
// GRADE 1
// =====================================================================
skills.push(
  {
    id: 'g1-capitals',
    grade: 1,
    unit: 'mechanics',
    name: T('大寫字母：句首、人名、星期、月份、I', 'Capital letters: first word, names, days, months, I'),
    std: 'CCSS L.1.2a',
    lesson: {
      zh: '這些字一定要用<b>大寫字母</b>開頭：句子的<b>第一個字</b>、<b>人名</b>、<b>星期</b>（Monday）、<b>月份</b>（May），還有代表「我」的 <b>I</b>。',
      en: 'Use a <b>capital letter</b> for the <b>first word</b> of a sentence, <b>names</b>, <b>days</b> (Monday), <b>months</b> (May) and the word <b>I</b>.',
      ex: ['<u>O</u>n <u>F</u>riday, <u>L</u>eo and <u>I</u> went to the park.', '<u>M</u>y birthday is in <u>J</u>une.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n, day = r.pick(DAYS), month = r.pick(MONTHS);
      const place = r.pick(['park', 'zoo', 'pool', 'library', 'beach', 'farm']);
      const good = r.pick([
        `My friend ${n} was born in ${month}.`,
        `On ${day}, ${n} and I went to the ${place}.`,
        `Can I play with ${n} on ${day}?`,
        `${n} and I have a party in ${month}.`,
        `I see ${n} at the ${place} every ${day}.`,
        `We go to the ${place} in ${month}.`,
        `Last ${day}, ${n} gave me a card.`,
        `In ${month}, I will visit ${n}.`,
      ]);
      const d = capDrill(r, good);
      return {
        q: T('點出應該大寫的字。', 'Tap the word that needs a capital letter.'),
        ans: ansTap(d.bad, d.k),
        sol: [capWhy(d.w, d.k), T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
        hint: T('找找句子的第一個字、人名、星期、月份和 I。', 'Look at the first word, names, days, months and I.'),
      };
    },
  },
  {
    id: 'g1-end-punct',
    grade: 1,
    unit: 'mechanics',
    name: T('句尾標點：. ? !', 'End marks: . ? !'),
    std: 'CCSS L.1.2b',
    lesson: {
      zh: '每個句子結尾都要有標點。<b>句號 .</b> 用在說一件事；<b>問號 ?</b> 用在問問題；<b>驚嘆號 !</b> 用在很興奮、很驚訝或很大聲的時候。',
      en: 'Every sentence needs an end mark. A <b>period (.)</b> tells something. A <b>question mark (?)</b> asks something. An <b>exclamation mark (!)</b> shows a strong feeling.',
      ex: ['I have a cat<b>.</b>', 'Do you have a cat<b>?</b>', 'Wow, your cat is so big<b>!</b>'],
    },
    gen(r) {
      const { n } = kid(r), pet = r.pick(['dog', 'cat', 'fish', 'bird', 'rabbit']), food = r.pick(['pizza', 'apples', 'carrots', 'rice', 'noodles']);
      const thing = r.pick(['hat', 'ball', 'book', 'bag', 'kite']), day = r.pick(DAYS);
      const kind = r.pick(['.', '?', '!']);
      const s = kind === '.' ? r.pick([`${n} has a little ${pet}`, `I like to eat ${food}`, `We go to school on ${day}`, `My ${thing} is on the bed`, `The ${pet} is asleep`])
        : kind === '?' ? r.pick([`Do you like ${food}`, `Can ${n} come to my party`, `Where is my ${thing}`, `Is it ${day} today`, `Who ate the ${food}`, `What is your ${pet} named`])
        : r.pick([`Wow, look at that big ${pet}`, `Hooray, we won the game`, `Oh no, my ${thing} is stuck in the tree`, `Watch out for the ball`, `Wow, ${n} can jump so high`]);
      const why = kind === '.' ? T('這句話只是在<b>說一件事</b>，所以用句號 .', 'This sentence <b>tells</b> something, so it ends with a period (.).')
        : kind === '?' ? T(`這句話在<b>問問題</b>（開頭是「${s.split(' ')[0]}」），所以用問號 ?`, `This sentence <b>asks</b> something (it starts with "${s.split(' ')[0]}"), so it ends with a question mark (?).`)
        : T(`這句話表示很強的感覺（「${s.split(/[ ,]/)[0]}」），所以用驚嘆號 !`, `This sentence shows a strong feeling ("${s.split(/[ ,]/)[0]}"), so it ends with an exclamation mark (!).`);
      return {
        q: T(`句尾要用哪個標點？ ${s}___`, `Which end mark goes here? ${s}___`),
        ans: ansChoice([kind, ...['.', '?', '!'].filter((x) => x !== kind)]),
        sol: [why, T(`${s}${kind}`, `${s}${kind}`)],
        hint: T('它是在說一件事、問問題，還是很興奮？', 'Does it tell, ask, or show a strong feeling?'),
      };
    },
  },
  {
    id: 'g1-plural-s-es',
    grade: 1,
    unit: 'grammar',
    name: T('單數和複數：加 -s 或 -es', 'One or more: add -s or -es'),
    std: 'CCSS L.1.1c',
    lesson: {
      zh: '超過一個的時候，名詞通常加 <b>-s</b>（cat → cats）。字尾是 <b>s、x、ch、sh</b> 的字要加 <b>-es</b>（box → boxes, dish → dishes）。',
      en: 'For more than one, most nouns add <b>-s</b> (cat → cats). Nouns that end in <b>s, x, ch, sh</b> add <b>-es</b> (box → boxes, dish → dishes).',
      ex: ['one dog → two dog<b>s</b>', 'one bus → three bus<b>es</b>', 'one lunch → four lunch<b>es</b>'],
    },
    gen(r) {
      const es = r.chance(0.5);
      const w = es ? r.pick(['box', 'fox', 'bus', 'dish', 'glass', 'bench', 'watch', 'brush', 'lunch', 'dress'])
        : r.pick(['cat', 'cup', 'frog', 'book', 'bed', 'ball', 'pig', 'sock', 'duck', 'egg', 'bug', 'map']);
      const pl = es ? w + 'es' : w + 's', num = r.pick(NUMS);
      const why = es ? T(`「${w}」的字尾是 ${w.match(/(ch|sh|s|x)$/)[0]}，所以要加 -es。`, `"${w}" ends in ${w.match(/(ch|sh|s|x)$/)[0]}, so add -es.`)
        : T(`「${w}」只要加 -s 就好。`, `"${w}" just adds -s.`);
      if (r.chance(0.5)) {
        return {
          q: T(`打出「很多個」的字：one ${w} → ${num} ___`, `Type the word for more than one: one ${w} → ${num} ___`),
          ans: ansText([pl]),
          sol: [why, T(`one ${w} → ${num} ${pl}`, `one ${w} → ${num} ${pl}`)],
          hint: T('字尾是 s、x、ch、sh 嗎？', 'Does it end in s, x, ch or sh?'),
        };
      }
      const frame = r.pick([`I see ${num} ___.`, `We have ${num} ___.`, `There are ${num} ___ in the picture.`]);
      const bad = es ? [w + 's', w] : [w + 'es', w];
      return {
        q: T(`選出正確的字：${frame}`, `Choose the right word: ${frame}`),
        ans: ansChoice([pl, ...bad]),
        sol: [T(`${num} 表示不只一個，所以要用複數。`, `"${num}" means more than one, so we need the plural.`), why, T(frame.replace('___', pl), frame.replace('___', pl))],
      };
    },
  },
  {
    id: 'g1-proper-nouns',
    grade: 1,
    unit: 'grammar',
    name: T('普通名詞和專有名詞', 'Common and proper nouns'),
    std: 'CCSS L.1.1b',
    lesson: {
      zh: '<b>普通名詞</b>是一般的人、地方或東西（dog、school、city）。<b>專有名詞</b>是特定的名字（Mia、Monday、Boston），開頭一定大寫。',
      en: 'A <b>common noun</b> names any person, place or thing (dog, school, city). A <b>proper noun</b> is a special name (Mia, Monday, Boston) and always starts with a capital.',
      ex: ['My <u>dog</u> (common) is named <u>Rex</u> (proper).', 'We went to the <u>city</u> of <u>Boston</u>.'],
    },
    gen(r) {
      const { n } = kid(r), n2 = r.pick(NAMES.filter((x) => x !== n)), city = r.pick(CITIES), day = r.pick(DAYS), month = r.pick(MONTHS);
      if (r.chance(0.5)) {
        const t = r.pick([
          () => { const a = r.pick(['book', 'ball', 'toy', 'shoe']), b = r.pick(['box', 'bag', 'basket']); return [`${n} put the ${a} in the ${b}.`, n, [a, b]]; },
          () => { const a = r.pick(['aunt', 'uncle', 'grandma', 'cousin']), b = r.pick(['train', 'bus', 'plane']); return [`My ${a} took a ${b} to ${city}.`, city, [a, b]]; },
          () => { const a = r.pick(['teacher', 'dad', 'sister']), b = r.pick(['book', 'story', 'poem']); return [`Our ${a} reads a ${b} every ${day}.`, day, [a, b]]; },
          () => { const a = r.pick(['goat', 'lamb', 'pony', 'calf']); return [`The ${a} at the farm was born in ${month}.`, month, [a, 'farm']]; },
        ])();
        return {
          text: t[0],
          q: T('哪一個是專有名詞（特定的名字）？', 'Which word is a proper noun (a special name)?'),
          ans: ansChoice([t[1], ...t[2]]),
          sol: [T(`「${t[1]}」是特定的名字，所以是專有名詞，開頭大寫。`, `"${t[1]}" is a special name, so it is a proper noun with a capital letter.`),
            T(`「${t[2][0]}」和「${t[2][1]}」是普通名詞，可以指任何一個。`, `"${t[2][0]}" and "${t[2][1]}" are common nouns. They can mean any one.`)],
        };
      }
      const t = r.pick([
        () => { const a = r.pick(['tiger', 'panda', 'whale', 'monkey']); return [`${n} saw a ${a} in ${city}.`, a, [n, city]]; },
        () => { const a = r.pick(['kite', 'puppy', 'bike', 'drum']); return [`${n} got a ${a} on ${day}.`, a, [n, day]]; },
        () => { const a = r.pick(['bus', 'boat', 'train', 'horse']); return [`${n} and ${n2} rode a ${a}.`, a, [n, n2]]; },
        () => { const a = r.pick(['grandma', 'cousin', 'uncle']); return [`${n} visits ${city} with ${GIRLS.includes(n) ? 'her' : 'his'} ${a}.`, a, [n, city]]; },
      ])();
      return {
        text: t[0],
        q: T('哪一個是普通名詞（一般的人、地方或東西）？', 'Which word is a common noun (any person, place or thing)?'),
        ans: ansChoice([t[1], ...t[2]]),
        sol: [T(`「${t[1]}」是一般的東西或人，不是特定的名字，所以是普通名詞。`, `"${t[1]}" can mean any one, not a special name, so it is a common noun.`),
          T(`「${t[2][0]}」和「${t[2][1]}」是特定的名字（專有名詞），開頭大寫。`, `"${t[2][0]}" and "${t[2][1]}" are special names (proper nouns) with capitals.`)],
      };
    },
  },
  {
    id: 'g1-verb-tense',
    grade: 1,
    unit: 'grammar',
    name: T('動詞時態：過去、現在、未來', 'Verbs for past, present and future'),
    std: 'CCSS L.1.1e',
    lesson: {
      zh: '動詞會告訴我們事情<b>什麼時候</b>發生。昨天（過去）：加 <b>-ed</b>（played）。每天（現在）：play / plays。明天（未來）：<b>will</b> + 動詞（will play）。',
      en: 'Verbs tell <b>when</b> something happens. Yesterday (past): add <b>-ed</b> (played). Every day (present): play / plays. Tomorrow (future): <b>will</b> + verb (will play).',
      ex: ['Yesterday, I <b>played</b> ball.', 'Every day, Mia <b>plays</b> ball.', 'Tomorrow, we <b>will play</b> ball.'],
    },
    gen(r) {
      const vo = r.pick([['kick', 'the ball'], ['paint', 'a picture'], ['wash', 'the dog'], ['plant', 'a seed'], ['help', 'Mom'], ['clean', 'the table'], ['cook', 'eggs'], ['fix', 'the bike'], ['pick', 'flowers'], ['open', 'the box'], ['play', 'a game'], ['bake', 'cookies']]);
      const [v, o] = vo, when = r.pick(['past', 'present', 'future']);
      const time = when === 'past' ? r.pick(['Yesterday', 'Last night', 'Last week']) : when === 'present' ? r.pick(['Every day', 'Every morning', 'Each week']) : r.pick(['Tomorrow', 'Next week', 'Tonight']);
      const one = r.chance(0.5), subj = one ? kid(r).n : r.pick(['I', 'we', 'they']);
      const pres = one ? third(v) : v, forms = { past: past(v), present: pres, future: `will ${v}` };
      const right = forms[when];
      const sent = `${time}, ${subj} ___ ${o}.`;
      const why = when === 'past' ? T(`「${time}」是過去，所以用過去式「${right}」。`, `"${time}" is in the past, so use the past tense "${right}".`)
        : when === 'present' ? T(`「${time}」表示常常發生（現在式）。${one ? `${subj} 是一個人，動詞加 -s：「${right}」。` : `用「${right}」。`}`, `"${time}" means it happens often (present tense). ${one ? `${subj} is one person, so the verb gets -s: "${right}".` : `Use "${right}".`}`)
        : T(`「${time}」還沒發生（未來），所以用 will + 動詞：「${right}」。`, `"${time}" has not happened yet (future), so use will + verb: "${right}".`);
      return {
        q: T(`選出正確的動詞：${sent}`, `Choose the right verb: ${sent}`),
        ans: ansChoice([right, ...Object.values(forms).filter((x) => x !== right)]),
        sol: [why, T(sent.replace('___', right), sent.replace('___', right))],
        hint: T('看看句子開頭的時間詞。', 'Look at the time words at the start.'),
      };
    },
  },
  {
    id: 'g1-pronouns',
    grade: 1,
    unit: 'grammar',
    name: T('人稱代名詞：I / me、he / him、they / them', 'Pronouns: I / me, he / him, they / them'),
    std: 'CCSS L.1.1d',
    lesson: {
      zh: '代名詞用來代替名字。做動作的人放在句子前面用 <b>I、he、she、we、they</b>；在動詞或 with、to、for 後面用 <b>me、him、her、us、them</b>。',
      en: 'Pronouns take the place of names. Before the verb (the one doing it): <b>I, he, she, we, they</b>. After the verb or after with, to, for: <b>me, him, her, us, them</b>.',
      ex: ['<b>She</b> plays with <b>him</b>.', '<b>They</b> gave the ball to <b>me</b>.'],
    },
    gen(r) {
      const k1 = kid(r), [a, b] = r.sample(NAMES, 2);
      const v = r.pick([['like', 'pizza'], ['play', 'soccer'], ['read', 'books'], ['draw', 'cats'], ['sing', 'songs']]);
      const items = [
        () => [`${k1.n} is my friend.`, `___ ${third(v[0])} ${v[1]}.`, k1.He, cap(k1.him), 's'],
        () => [`${k1.n} is my friend.`, `I ${v[0]} ${v[1]} with ___.`, k1.him, k1.he, 'o'],
        () => [`${a} and ${b} are in my class.`, `___ ${v[0]} ${v[1]}.`, 'They', 'Them', 's'],
        () => [`${a} and ${b} are in my class.`, `I ${v[0]} ${v[1]} with ___.`, 'them', 'they', 'o'],
        () => [`Mom made a cake.`, `She gave it to ___.`, 'me', 'I', 'o'],
        () => [`I am six.`, `___ ${v[0]} ${v[1]}.`, 'I', 'Me', 's'],
        () => [`My friends and I sat down.`, `The teacher read a book to ___.`, 'us', 'we', 'o'],
        () => [`My friends and I go to the park.`, `___ ${v[0]} ${v[1]} there.`, 'We', 'Us', 's'],
        () => [`${k1.n} lost a hat.`, `Dad helped ___ find it.`, k1.him, k1.he, 'o'],
      ];
      const [ctx, s, right, wrong, role] = r.pick(items)();
      return {
        text: ctx,
        q: T(`選出正確的代名詞：${s}`, `Choose the right pronoun: ${s}`),
        ans: ansChoice([right, wrong]),
        sol: [role === 's' ? T(`空格是做動作的人（在動詞前面），所以用「${right}」。`, `The blank is the one doing the action (before the verb), so use "${right}".`)
          : T(`空格在動詞或 to / with 後面，所以用「${right}」，不是「${wrong}」。`, `The blank comes after the verb or after to / with, so use "${right}", not "${wrong}".`),
        T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g1-adjectives',
    grade: 1,
    unit: 'grammar',
    name: T('形容詞：描述的字', 'Adjectives: describing words'),
    std: 'CCSS L.1.1f',
    lesson: {
      zh: '<b>形容詞</b>描述名詞：它是什麼顏色、多大、感覺怎麼樣。例如 <b>red</b> ball、<b>big</b> dog、<b>happy</b> girl。',
      en: 'An <b>adjective</b> tells about a noun: its color, size, or how it feels. For example: a <b>red</b> ball, a <b>big</b> dog, a <b>happy</b> girl.',
      ex: ['The <b>little</b> frog jumps.', 'My kite is <b>yellow</b>.'],
    },
    gen(r) {
      const animal = r.chance(0.5);
      const noun = animal ? r.pick(['dog', 'cat', 'frog', 'duck', 'puppy', 'bunny']) : r.pick(['ball', 'hat', 'kite', 'box', 'car', 'cup']);
      const adj = animal ? r.pick(['happy', 'sleepy', 'little', 'big', 'fluffy', 'funny', 'brown']) : r.pick(['red', 'blue', 'big', 'small', 'shiny', 'new', 'yellow', 'old']);
      const { n } = kid(r);
      const verb = animal ? r.pick(['runs', 'sleeps', 'jumps', 'eats']) : r.pick(['is here', 'is on the bed', 'fell down']);
      const good = r.pick([
        `The ${adj} ${noun} ${verb}.`,
        `${n} has ${an(adj)} ${adj} ${noun}.`,
        `I like the ${adj} ${noun}.`,
        `My ${noun} is ${adj}.`,
        `Look at that ${adj} ${noun}!`,
      ]);
      const ws = words(good), k = findTok(ws, adj);
      return {
        q: T('點出形容詞（描述的字）。', 'Tap the adjective (the describing word).'),
        ans: ansTap(ws, k),
        sol: [T(`「${adj}」告訴我們 ${noun} 是什麼樣子，所以它是形容詞。`, `"${adj}" tells what the ${noun} is like, so it is the adjective.`), T(`${noun} 是名詞（東西或動物），不是形容詞。`, `"${noun}" is the noun (the thing or animal), not the adjective.`)],
        hint: T('哪個字在說顏色、大小或感覺？', 'Which word tells color, size or feeling?'),
      };
    },
  },
  {
    id: 'g1-conjunctions',
    grade: 1,
    unit: 'sentences',
    name: T('連接詞：and、but、or、so、because', 'Joining words: and, but, or, so, because'),
    std: 'CCSS L.1.1g',
    lesson: {
      zh: '<b>and</b> 加上更多；<b>but</b> 表示相反；<b>or</b> 表示選一個；<b>so</b> 表示「所以」；<b>because</b> 說明原因（為什麼）。',
      en: '<b>and</b> adds more. <b>but</b> shows something different. <b>or</b> gives a choice. <b>so</b> tells what happens next. <b>because</b> tells why.',
      ex: ['I like cats <b>and</b> dogs.', 'Do you want milk <b>or</b> juice?', 'It was cold, <b>so</b> I wore a hat.'],
    },
    gen(r) {
      const k1 = kid(r), food = r.pick(['milk', 'juice', 'water']), food2 = r.pick(['a pear', 'an apple', 'a banana']);
      const items = [
        [`Do you want ${food} ___ tea?`, 'or', ['so', 'because'], T('這裡要你選一個，用 or。', 'You must choose one, so use "or".')],
        [`Would you like ${food2} ___ a muffin?`, 'or', ['because', 'so'], T('兩個裡選一個，用 or。', 'It is a choice between two, so use "or".')],
        [`It was cold, ___ ${k1.n} put on a coat.`, 'so', ['or', 'because'], T('因為冷，「所以」穿外套。結果用 so。', 'The coat is what happens next because it was cold, so use "so".')],
        [`${k1.n} was hungry, ___ ${k1.he} ate a snack.`, 'so', ['because', 'or'], T('肚子餓，所以吃點心，用 so。', 'Eating a snack is what happened next, so use "so".')],
        [`${k1.n} wanted to play outside, ___ it was raining.`, 'but', ['so', 'or'], T('想出去玩，「但是」下雨了，相反的事用 but。', 'Wanting to play and rain do not go together, so use "but".')],
        [`I like to swim, ___ I do not like cold water.`, 'but', ['or', 'so'], T('前後意思相反，用 but。', 'The two parts are different, so use "but".')],
        [`${k1.n} is happy ___ today is ${k1.his} birthday.`, 'because', ['but', 'or'], T('說明為什麼開心，用 because。', 'It tells why, so use "because".')],
        [`We stayed inside ___ it was snowing.`, 'because', ['or', 'but'], T('說明為什麼待在屋裡，用 because。', 'It tells why we stayed inside, so use "because".')],
        [`${k1.n} has a cat ___ a dog.`, 'and', ['because', 'so'], T('兩隻都有，加在一起用 and。', 'There is a cat and also a dog, so use "and".')],
        [`We ate pizza ___ cake at the party.`, 'and', ['because', 'so'], T('兩樣都吃了，用 and。', 'We ate both, so use "and".')],
      ];
      const [s, right, wr, why] = r.pick(items);
      return {
        q: T(`選出最適合的連接詞：${s}`, `Choose the best joining word: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [why, T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g1-prepositions',
    grade: 1,
    unit: 'grammar',
    name: T('介係詞：on、in、at', 'Prepositions: on, in, at'),
    std: 'CCSS L.1.1i',
    lesson: {
      zh: '說時間的時候：星期和特別的日子用 <b>on</b>（on Monday）；月份、季節和早上下午用 <b>in</b>（in May、in the morning）；幾點鐘和 night 用 <b>at</b>（at 3 o\'clock、at night）。城市用 <b>in</b>（in Boston）。',
      en: 'For time: days and special days use <b>on</b> (on Monday). Months, seasons and parts of the day use <b>in</b> (in May, in the morning). Clock times and night use <b>at</b> (at 3 o\'clock, at night). Cities use <b>in</b> (in Boston).',
      ex: ['We swim <b>on</b> Saturday.', 'It snows <b>in</b> January.', 'I go to bed <b>at</b> 8 o\'clock.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n;
      const items = [
        () => [`${n} has art class ___ ${r.pick(DAYS)}.`, 'on', T('星期幾前面用 on。', 'Use "on" with days of the week.')],
        () => [`We have a party ___ my birthday.`, 'on', T('特別的日子前面用 on。', 'Use "on" with a special day.')],
        () => [`${n} was born ___ ${r.pick(MONTHS)}.`, 'in', T('月份前面用 in。', 'Use "in" with months.')],
        () => [`It is hot here ___ ${r.pick(['summer', 'July', 'August'])}.`, 'in', T('季節和月份前面用 in。', 'Use "in" with seasons and months.')],
        () => [`${n} eats breakfast ___ the morning.`, 'in', T('the morning / afternoon / evening 前面用 in。', 'Use "in" with the morning, the afternoon, the evening.')],
        () => [`The bus comes ___ ${r.int(1, 11)} o'clock.`, 'at', T('幾點鐘前面用 at。', 'Use "at" with a clock time.')],
        () => [`Owls hunt ___ night.`, 'at', T('night 前面用 at（at night）。', 'We say "at night".')],
        () => [`We eat lunch ___ noon.`, 'at', T('noon（中午十二點）是一個時間點，用 at。', '"Noon" is a time on the clock, so use "at".')],
        () => [`${n}'s grandma lives ___ ${r.pick(CITIES)}.`, 'in', T('城市前面用 in。', 'Use "in" with a city.')],
      ];
      const [s, right, why] = r.pick(items)();
      return {
        q: T(`選出正確的介係詞：${s}`, `Choose the right word: ${s}`),
        ans: ansChoice([right, ...['on', 'in', 'at'].filter((x) => x !== right)]),
        sol: [why, T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g1-articles',
    grade: 1,
    unit: 'grammar',
    name: T('冠詞：a、an、the', 'Articles: a, an, the'),
    std: 'CCSS L.1.1h',
    lesson: {
      zh: '下一個字是<b>母音</b>（a、e、i、o、u）開頭的音，用 <b>an</b>（an apple）；其他用 <b>a</b>（a dog）。世界上只有一個的東西，像太陽、月亮，用 <b>the</b>（the sun）。',
      en: 'Use <b>an</b> before a word that starts with a vowel sound (a, e, i, o, u): an apple. Use <b>a</b> before other words: a dog. Use <b>the</b> for one special thing, like the sun or the moon.',
      ex: ['I ate <b>an</b> egg and <b>a</b> banana.', '<b>The</b> moon is bright.'],
    },
    gen(r) {
      const { n } = kid(r);
      if (r.chance(0.2)) {
        const s = r.pick(['___ sun is hot today.', `${n} looked up at ___ moon.`, '___ sky is blue.', `${n} can see ___ moon from the window.`, 'Birds fly in ___ sky.']);
        return {
          q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
          ans: ansChoice([s.startsWith('___') ? 'The' : 'the', ...(s.startsWith('___') ? ['A', 'An'] : ['a', 'an'])]),
          sol: [T('太陽、月亮、天空都只有一個，大家都知道是哪一個，所以用 the。', 'There is only one sun, moon and sky, so we use "the".'), T(s.replace('___', s.startsWith('___') ? 'The' : 'the'), s.replace('___', s.startsWith('___') ? 'The' : 'the'))],
        };
      }
      const noun = r.pick(['apple', 'egg', 'owl', 'ant', 'orange', 'umbrella', 'igloo', 'elephant', 'octopus', 'dog', 'ball', 'hat', 'kite', 'banana', 'pen', 'cake', 'bug', 'cat']);
      const adj = r.chance(0.35) ? r.pick(['big', 'old', 'little', 'odd', 'red', 'orange', 'pink'].filter((x) => x !== noun)) : null;
      const nextW = adj || noun, right = an(nextW), wrong = right === 'a' ? 'an' : 'a';
      const tail = adj ? `${adj} ${noun}` : noun;
      const frame = r.pick([`${n} has ___ ${tail}.`, `I see ___ ${tail}.`, `Look at ___ ${tail}!`, `There is ___ ${tail} on the mat.`]);
      const vowel = /^[aeiou]/.test(nextW);
      return {
        q: T(`選出正確的字：${frame}`, `Choose the right word: ${frame}`),
        ans: ansChoice([right, wrong]),
        sol: [vowel ? T(`「${nextW}」是母音 ${nextW[0]} 開頭，所以用 an。`, `"${nextW}" starts with the vowel ${nextW[0]}, so use "an".`)
          : T(`「${nextW}」不是母音開頭，所以用 a。`, `"${nextW}" does not start with a vowel sound, so use "a".`),
        ...(adj ? [T('要看緊跟在後面的那個字（形容詞），不是名詞喔！', 'Look at the very next word (here the adjective), not the noun!')] : []),
        T(frame.replace('___', right), frame.replace('___', right))],
      };
    },
  },
  {
    id: 'g1-complete-sentence',
    grade: 1,
    unit: 'sentences',
    name: T('完整的句子', 'Is it a complete sentence?'),
    std: 'CCSS L.1.1j',
    lesson: {
      zh: '完整的句子要有<b>誰</b>（主詞）和<b>做什麼</b>（動詞），大寫開頭、標點結尾。只有一半的話不是完整的句子。',
      en: 'A complete sentence tells <b>who</b> (the subject) and <b>what they do</b> (the verb). It starts with a capital and ends with an end mark. Half an idea is not a sentence.',
      ex: ['<b>The dog runs to the park.</b> (complete)', 'Runs to the park. (no "who")', 'The big dog. (no "what it does")'],
    },
    gen(r) {
      const { n } = kid(r);
      const subj = r.pick([n, 'My dad', 'My sister', 'The boy', 'Grandma', 'My friend']);
      const vp = r.pick(['runs to the park', 'eats lunch at noon', 'sings a song', 'reads a book', 'jumps in the pool', 'plays in the yard', 'draws a cat']);
      const pp = r.pick(['in the yard', 'at the park', 'on the big bed', 'under the tree', 'after lunch']);
      const good = `${subj} ${vp}.`;
      const frags = [`${cap(vp)}.`, `${subj} ${pp}.`, `${cap(pp)}.`];
      const opts = [good, ...frags];
      return {
        q: T('哪一個是完整的句子？', 'Which one is a complete sentence?'),
        ans: ansChoice(opts),
        sol: [T(`「${good}」有主詞（${subj}）也有動詞（${vp.split(' ')[0]}），是完整的句子。`, `"${good}" tells who (${subj}) and what they do (${vp.split(' ')[0]}). It is complete.`),
          T(`「${frags[0]}」沒有說是誰；「${frags[1]}」沒有說做了什麼。`, `"${frags[0]}" does not tell who. "${frags[1]}" does not tell what happens.`)],
        hint: T('找一個有「誰」又有「做什麼」的。', 'Find the one with a "who" and a "does what".'),
      };
    },
  },
  {
    id: 'g1-story-order',
    grade: 1,
    unit: 'organization',
    name: T('故事順序：First、Next、Last', 'Story order: first, next, last'),
    std: 'CCSS W.1.3',
    lesson: {
      zh: '寫故事時，要照事情<b>發生的順序</b>寫。用 <b>First</b>（首先）、<b>Next / Then</b>（接著）、<b>Last</b>（最後）幫助讀者跟上。',
      en: 'Tell a story in the <b>order</b> it happened. Use <b>First</b>, <b>Next / Then</b> and <b>Last</b> to help the reader follow.',
      ex: ['<b>First</b>, I got a cup.', '<b>Next</b>, I poured milk.', '<b>Last</b>, I drank it all up.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n, he = k1.he, his = k1.his;
      const stories = [
        [`${n} dug a little hole`, `${he} put a seed in the hole`, `${he} gave it some water`, 'a tiny plant grew'],
        [`${n} got two slices of bread`, `${he} spread jam on the bread`, `${he} put the slices together`, `${he} ate the sandwich`],
        [`${n} rolled a big snowball`, `${he} put a small snowball on top`, `${he} added a carrot nose`, `${he} named the snowman Bob`],
        [`${n} filled the tub with water`, `${he} put the dog in the tub`, `${he} washed the dog with soap`, `${he} dried the dog with a towel`],
        [`${n} got paper and paints`, `${he} painted a big sun`, `${he} let the paint dry`, `${he} hung the picture on the wall`],
        [`${n} mixed flour, eggs, and sugar`, `${he} put the dough in the oven`, `${he} waited for the cookies to bake`, `${he} shared the cookies with ${his} friends`],
        [`${n} woke up and got out of bed`, `${he} put on ${his} clothes`, `${he} ate ${his} breakfast`, `${he} got on the school bus`],
        [`${n} put on ${his} helmet`, `${he} got on ${his} bike`, `${he} rode to the park`, `${he} parked the bike by a tree`],
      ];
      const st = r.pick(stories), four = r.chance(0.5);
      const steps = four ? st : [st[0], st[1], st[3]];
      const tw = four ? ['First', 'Next', 'Then', 'Last'] : ['First', 'Next', 'Last'];
      const items = steps.map((s, i) => `${tw[i]}, ${s}.`);
      return {
        q: T('把故事排成正確的順序。', 'Put the story in the right order.'),
        ans: ansOrder(items),
        sol: [T('用 First、Next、Then、Last 這些字找順序，也想一想哪件事要先做。', 'Use the words First, Next, Then, Last, and think about what has to happen first.'),
          T(`正確順序：${items.join(' ')}`, `The right order: ${items.join(' ')}`)],
      };
    },
  },
  {
    id: 'g1-commas',
    grade: 1,
    unit: 'mechanics',
    name: T('逗號：日期和一連串的東西', 'Commas in dates and lists'),
    std: 'CCSS L.1.2c',
    lesson: {
      zh: '寫日期時，<b>日子和年份之間</b>加逗號：May 5, 2024。列出三樣以上的東西時，用逗號把它們分開：red, blue, and green。',
      en: 'In a date, put a comma <b>between the day and the year</b>: May 5, 2024. In a list of three or more things, put commas between them: red, blue, and green.',
      ex: ['My birthday is June 12<b>,</b> 2019.', 'I like cats<b>,</b> dogs<b>,</b> and fish.'],
    },
    gen(r) {
      const { n } = kid(r);
      if (r.chance(0.5)) {
        const m = r.pick(MONTHS), d = r.int(1, 28), y = r.int(2016, 2026);
        const frame = r.pick([`${n} was born on ###.`, `The party is on ###.`, `We went to the zoo on ###.`, `School starts on ###.`]);
        const opts = [`${m} ${d}, ${y}`, `${m} ${d} ${y}`, `${m}, ${d} ${y}`].map((x) => frame.replace('###', x));
        return {
          q: T('哪一句的日期逗號用對了？', 'Which sentence uses the comma in the date correctly?'),
          ans: ansChoice(opts),
          sol: [T('日期的逗號放在「日」和「年」中間。', 'The comma goes between the day and the year.'), T(opts[0], opts[0])],
        };
      }
      const set = r.pick([['red', 'blue', 'green', 'yellow', 'pink'], ['apples', 'grapes', 'pears', 'plums'], ['cats', 'dogs', 'fish', 'birds', 'frogs'], ['milk', 'juice', 'water', 'tea']]);
      const [a, b, c] = r.sample(set, 3);
      const frame = r.pick([`I like ###.`, `${n} has ###.`, `We saw ###.`]);
      const opts = [`${a}, ${b}, and ${c}`, `${a} ${b} and ${c}`, `${a}, ${b} and, ${c}`].map((x) => frame.replace('###', x));
      return {
        q: T('哪一句的逗號用對了？', 'Which sentence uses commas correctly?'),
        ans: ansChoice(opts),
        sol: [T('列出三樣東西時，每樣東西後面加逗號，最後一樣前面加 and。', 'In a list of three, put a comma after each thing and use "and" before the last one.'), T(opts[0], opts[0])],
      };
    },
  },
  {
    id: 'g1-short-vowels',
    grade: 1,
    unit: 'words',
    name: T('短母音拼字', 'Spelling short-vowel words'),
    std: 'CCSS L.1.2d',
    lesson: {
      zh: '短母音的字通常是「子音＋母音＋子音」：c<b>a</b>t、b<b>e</b>d、p<b>i</b>g、d<b>o</b>g、s<b>u</b>n。慢慢唸，聽清楚中間的母音。',
      en: 'Many short words are consonant + vowel + consonant: c<b>a</b>t, b<b>e</b>d, p<b>i</b>g, d<b>o</b>g, s<b>u</b>n. Say the word slowly and listen for the middle vowel.',
      ex: ['short a: cat, map, jam', 'short e: red, leg, web', 'short i: pig, fish, six', 'short o: dog, box, mop', 'short u: sun, bus, cup'],
    },
    gen(r) {
      const MIS = { cat: 'cet', hat: 'het', fan: 'fon', jam: 'jem', van: 'vun', nap: 'nup', red: 'rud', pen: 'pon', net: 'nat', leg: 'lig', web: 'wab', pig: 'pag', fish: 'fesh', swim: 'swem', six: 'sux', milk: 'melk', dog: 'deg', box: 'bax', frog: 'freg', mop: 'mep', sock: 'seck', bus: 'bas', sun: 'san', cups: 'ceps', duck: 'dack', run: 'ren', jump: 'jamp', lunch: 'lanch', desk: 'dask', rug: 'reg' };
      const { n } = kid(r);
      const s = r.pick([
        `${n} has a red hat.`, 'The fish can swim fast.', 'My dog sleeps in a box.', `${n} can run to the bus.`, 'A frog sat in the sun.',
        `${n} put jam on the bread.`, 'I see a pig in the pen.', `${n} has six cups.`, 'The duck can jump.', 'We drink milk at lunch.',
        'The fan is on the desk.', `${n} took a nap on the rug.`, 'The van is red.', 'A spider made a web.', `${n} got a mop and a sock.`, 'The cat sat on my leg.',
      ]);
      const ws = words(s), cand = ws.map((t, i) => i).filter((i) => MIS[bareW(ws[i])]);
      const k = r.pick(cand), w = bareW(ws[k]);
      return {
        q: T('點出拼錯的字。', 'Tap the word that is spelled wrong.'),
        ans: ansTap(swapTok(ws, k, MIS[w]), k),
        sol: [T(`「${MIS[w]}」拼錯了，正確是「${w}」。慢慢唸，聽中間的短母音。`, `"${MIS[w]}" is spelled wrong. The right spelling is "${w}". Say it slowly and listen to the middle vowel.`), T(`正確的句子：${s}`, `The fixed sentence: ${s}`)],
        hint: T('一個字一個字慢慢唸。', 'Read each word slowly.'),
      };
    },
  },
);

// =====================================================================
// GRADE 2
// =====================================================================
skills.push(
  {
    id: 'g2-collective-nouns',
    grade: 2,
    unit: 'words',
    name: T('集合名詞：一群…', 'Collective nouns: a group of …'),
    std: 'CCSS L.2.1a',
    lesson: {
      zh: '<b>集合名詞</b>是一整群東西的名字。不同的動物或東西有自己的說法：a <b>school</b> of fish（一群魚）、a <b>flock</b> of birds（一群鳥）、a <b>herd</b> of cows（一群牛）。',
      en: 'A <b>collective noun</b> names a whole group. Different groups have their own words: a <b>school</b> of fish, a <b>flock</b> of birds, a <b>herd</b> of cows.',
      ex: ['a <b>pack</b> of wolves', 'a <b>swarm</b> of bees', 'a <b>bunch</b> of grapes', 'a <b>team</b> of players'],
    },
    gen(r) {
      const { n } = kid(r);
      const items = [
        [`${n} saw a ___ of fish in the ocean.`, 'school', ['herd', 'pride']],
        ['A ___ of birds flew over our house.', 'flock', ['school', 'pride']],
        ['A ___ of geese swam in the pond.', 'flock', ['herd', 'deck']],
        ['The farmer has a big ___ of cows.', 'herd', ['swarm', 'deck']],
        [`${n} saw a ___ of elephants on TV.`, 'herd', ['school', 'bunch']],
        ['A ___ of wolves howled at the moon.', 'pack', ['bunch', 'class']],
        ['A ___ of bees buzzed near the flowers.', 'swarm', ['herd', 'deck']],
        ['Our ___ of players won the cup.', 'team', ['herd', 'swarm']],
        ['A ___ of students went on a field trip.', 'class', ['herd', 'deck']],
        ['Mom bought a ___ of grapes.', 'bunch', ['pack', 'flock']],
        [`${n} ate a banana from the ___ of bananas.`, 'bunch', ['herd', 'school']],
        ['Our dog had a ___ of puppies.', 'litter', ['swarm', 'deck']],
        ['A ___ of lions rested under a tree.', 'pride', ['flock', 'bunch']],
        [`${n} mixed up the ___ of cards.`, 'deck', ['herd', 'flock']],
        [`${n} carried a ___ of books to the desk.`, 'stack', ['herd', 'flock']],
      ];
      const [s, right, wr] = r.pick(items), what = s.match(/of ([a-z]+)/)[1];
      return {
        q: T(`選出正確的集合名詞：${s}`, `Choose the collective noun: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [T(`一群 ${what} 的說法是「a ${right} of ${what}」。`, `A group of ${what} is called "a ${right} of ${what}".`), T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g2-irregular-plurals',
    grade: 2,
    unit: 'grammar',
    name: T('不規則複數：feet、mice、children', 'Irregular plurals: feet, mice, children'),
    std: 'CCSS L.2.1b',
    lesson: {
      zh: '有些名詞的複數<b>不加 -s</b>，要整個變：foot → <b>feet</b>、mouse → <b>mice</b>、child → <b>children</b>。有些字複數和單數一樣：sheep → <b>sheep</b>。字尾 f 常變成 <b>-ves</b>：leaf → <b>leaves</b>。',
      en: 'Some nouns do <b>not</b> add -s. They change: foot → <b>feet</b>, mouse → <b>mice</b>, child → <b>children</b>. Some stay the same: sheep → <b>sheep</b>. Many words ending in f change to <b>-ves</b>: leaf → <b>leaves</b>.',
      ex: ['one tooth → two <b>teeth</b>', 'one goose → three <b>geese</b>', 'one wolf → four <b>wolves</b>'],
    },
    gen(r) {
      const { n } = kid(r), num = r.pick(NUMS.slice(1));
      const IR = [
        ['foot', 'feet', ['foots', 'feets'], `${n} has two cold ___.`],
        ['tooth', 'teeth', ['tooths', 'teeths'], `${n} lost two ___ this year.`],
        ['mouse', 'mice', ['mouses', 'mices'], `${cap(num)} ___ ran under the bed.`],
        ['goose', 'geese', ['gooses', 'geeses'], `${cap(num)} ___ swam in the pond.`],
        ['child', 'children', ['childs', 'childrens'], `${cap(num)} ___ played on the slide.`],
        ['man', 'men', ['mans', 'mens'], `${cap(num)} ___ fixed the road.`],
        ['woman', 'women', ['womans', 'womens'], `${cap(num)} ___ sang in the choir.`],
        ['sheep', 'sheep', ['sheeps', 'sheepes'], `The farmer has ${num} ___.`],
        ['deer', 'deer', ['deers', 'deeres'], `We saw ${num} ___ in the woods.`],
        ['leaf', 'leaves', ['leafs', 'leafes'], `${cap(num)} ___ fell from the tree.`],
        ['knife', 'knives', ['knifes', 'knifs'], `Dad put ${num} ___ on the table.`],
        ['wolf', 'wolves', ['wolfs', 'wolfes'], `${cap(num)} ___ howled at the moon.`],
        ['loaf', 'loaves', ['loafs', 'loafes'], `Mom baked ${num} ___ of bread.`],
        ['shelf', 'shelves', ['shelfs', 'shelfes'], `My room has ${num} ___.`],
      ];
      const [one, many, bad, frame] = r.pick(IR);
      const why = one === many ? T(`「${one}」的複數和單數一樣，還是「${many}」。`, `"${one}" stays the same for more than one: "${many}".`)
        : /f(e)?$/.test(one) ? T(`「${one}」字尾的 f 變成 v，再加 -es：「${many}」。`, `The f in "${one}" changes to v, then add -es: "${many}".`)
        : T(`「${one}」不加 -s，要變成「${many}」。`, `"${one}" does not add -s. It changes to "${many}".`);
      if (r.chance(0.5)) {
        return {
          q: T(`打出複數：one ${one} → ${num} ___`, `Type the plural: one ${one} → ${num} ___`),
          ans: ansText([many]),
          sol: [why, T(`one ${one} → ${num} ${many}`, `one ${one} → ${num} ${many}`)],
          hint: T('這個字不是只加 -s 喔！', 'This word does not just add -s!'),
        };
      }
      return {
        q: T(`選出正確的字：${frame}`, `Choose the right word: ${frame}`),
        ans: ansChoice([many, ...bad]),
        sol: [why, T(frame.replace('___', many), frame.replace('___', many))],
      };
    },
  },
  {
    id: 'g2-reflexive-pronouns',
    grade: 2,
    unit: 'grammar',
    name: T('反身代名詞：myself、himself…', 'Reflexive pronouns: myself, himself …'),
    std: 'CCSS L.2.1c',
    lesson: {
      zh: '當動作回到自己身上，或是「自己做」的時候，用<b>反身代名詞</b>：I → <b>myself</b>、you → <b>yourself</b>、he → <b>himself</b>、she → <b>herself</b>、it → <b>itself</b>、we → <b>ourselves</b>、they → <b>themselves</b>。注意：沒有 hisself 和 theirselves 這種字！',
      en: 'Use a <b>reflexive pronoun</b> when someone does something to or by their own self: I → <b>myself</b>, you → <b>yourself</b>, he → <b>himself</b>, she → <b>herself</b>, it → <b>itself</b>, we → <b>ourselves</b>, they → <b>themselves</b>. "Hisself" and "theirselves" are not words!',
      ex: ['Mia made lunch by <b>herself</b>.', 'We cleaned up the room <b>ourselves</b>.'],
    },
    gen(r) {
      const k1 = kid(r), [a, b] = r.sample(NAMES, 2);
      const subs = [
        ['I', 'myself', ['meself', 'ourselves']],
        ['You', 'yourself', ['yourselfs', 'myself']],
        [k1.n, k1.self, k1.girl ? ['himself', 'herselves'] : ['hisself', 'herself']],
        ['We', 'ourselves', ['ourself', 'themselves']],
        [`${a} and ${b}`, 'themselves', ['theirselves', 'himself']],
        ['The cat', 'itself', ['itsself', 'himself']],
      ];
      const [S, right, wr] = r.pick(subs);
      const frame = S === 'The cat' ? r.pick(['___ looked at ___ in the mirror.', '___ washed ___ with its tongue.'])
        : r.pick(['___ made the card all by ___.', '___ looked at ___ in the mirror.', '___ taught ___ to whistle.', '___ built the tower by ___.', '___ got a glass of water by ___.']);
      const s = frame.replace('___', S);
      return {
        q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [T(`主詞是「${S}」，對應的反身代名詞是「${right}」。`, `The subject is "${S}", so the reflexive pronoun is "${right}".`), T(s.replace('___', right), s.replace('___', right))],
        hint: T('先看看是誰在做這件事。', 'First look at who is doing it.'),
      };
    },
  },
  {
    id: 'g2-irregular-past',
    grade: 2,
    unit: 'grammar',
    name: T('不規則動詞的過去式', 'Irregular past-tense verbs'),
    std: 'CCSS L.2.1d',
    lesson: {
      zh: '很多動詞的過去式是加 -ed，但常用的動詞常常<b>不規則</b>，要整個變：eat → <b>ate</b>、go → <b>went</b>、see → <b>saw</b>。沒有 eated、goed 這種字！',
      en: 'Many verbs add -ed for the past, but some common verbs are <b>irregular</b> and change: eat → <b>ate</b>, go → <b>went</b>, see → <b>saw</b>. "Eated" and "goed" are not words!',
      ex: ['Yesterday I <b>ran</b> to the bus.', 'Last night we <b>sang</b> a song.', 'Mia <b>wrote</b> a letter.'],
    },
    gen(r) {
      const { n } = kid(r);
      const V = [
        ['eat', 'eated', 'a big sandwich'], ['go', 'goed', 'to the park'], ['see', 'seed', 'a rainbow'], ['run', 'runned', 'to the bus stop'],
        ['sing', 'singed', 'a funny song'], ['swim', 'swimmed', 'across the pool'], ['write', 'writed', 'a letter to Grandma'], ['make', 'maked', 'a paper boat'],
        ['give', 'gived', 'a card to Dad'], ['sit', 'sitted', 'on the bench'], ['drink', 'drinked', 'a glass of milk'], ['fly', 'flyed', 'a kite'],
        ['find', 'finded', 'a shiny rock'], ['take', 'taked', 'a photo'], ['tell', 'telled', 'a joke'], ['ride', 'rided', 'a pony'],
        ['draw', 'drawed', 'a dragon'], ['buy', 'buyed', 'a new book'], ['catch', 'catched', 'the ball'], ['throw', 'throwed', 'the ball'],
      ];
      const [v, wrong, obj] = r.pick(V), right = past(v), time = r.pick(['Yesterday', 'Last week', 'Last night', 'On Sunday']);
      const good = `${time}, ${n} ${right} ${obj}.`;
      if (r.chance(0.5)) {
        const s = `${time}, ${n} ___ (${v}) ${obj}.`;
        return {
          q: T(`打出括號裡動詞的過去式：${s}`, `Type the past tense of the verb: ${s}`),
          ans: ansText([right]),
          sol: [T(`「${v}」是不規則動詞，過去式是「${right}」，不是「${wrong}」。`, `"${v}" is irregular. Its past tense is "${right}", not "${wrong}".`), T(good, good)],
          hint: T('這個動詞不加 -ed。', 'This verb does not add -ed.'),
        };
      }
      const ws = words(good), k = findTok(ws, right);
      return {
        q: T('點出用錯的動詞。', 'Tap the verb that is wrong.'),
        ans: ansTap(swapTok(ws, k, wrong), k),
        sol: [T(`「${wrong}」不是正確的字。「${v}」的過去式是「${right}」。`, `"${wrong}" is not a real word. The past tense of "${v}" is "${right}".`), T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
      };
    },
  },
  {
    id: 'g2-adj-adv',
    grade: 2,
    unit: 'grammar',
    name: T('形容詞還是副詞？', 'Adjective or adverb?'),
    std: 'CCSS L.2.1e',
    lesson: {
      zh: '<b>形容詞</b>描述名詞（a <b>slow</b> turtle）。<b>副詞</b>描述動詞，說明「怎麼做」，很多副詞是形容詞加 <b>-ly</b>（walks <b>slowly</b>）。',
      en: 'An <b>adjective</b> tells about a noun (a <b>slow</b> turtle). An <b>adverb</b> tells about a verb — <b>how</b> something is done. Many adverbs add <b>-ly</b> (walks <b>slowly</b>).',
      ex: ['The <b>quiet</b> mouse ran away. (adjective)', 'The mouse ran <b>quietly</b>. (adverb)'],
    },
    gen(r) {
      const { n } = kid(r);
      const P = [
        ['slow', 'slowly', ['walks', 'eats', 'reads'], ['The ___ turtle crossed the road.', 'A ___ snail crawled up the wall.']],
        ['quick', 'quickly', ['runs', 'eats', 'cleans up'], ['We ate a ___ snack.', 'The ___ rabbit hopped away.']],
        ['loud', 'loudly', ['sings', 'claps', 'laughs'], ['We heard a ___ bang.', 'The ___ drum woke the baby.']],
        ['quiet', 'quietly', ['reads', 'talks', 'walks'], ['The library is a ___ place.', 'A ___ mouse hid in the box.']],
        ['soft', 'softly', ['sings', 'talks', 'hums'], ['I sleep on a ___ pillow.', 'The kitten has ___ fur.']],
        ['careful', 'carefully', ['writes', 'carries the eggs', 'crosses the street'], [`${n} is a ___ helper.`, 'Dad is a ___ driver.']],
        ['neat', 'neatly', ['writes', 'folds the shirts', 'colors'], [`${n} has a ___ desk.`, 'The books are in a ___ row.']],
        ['happy', 'happily', ['sings', 'plays', 'smiles'], ['The ___ puppy wagged its tail.', 'It was a ___ day.']],
        ['brave', 'bravely', ['acts', 'climbs the rock', 'jumps into the pool'], ['The ___ knight saved the town.', `${n} is a ___ swimmer.`]],
      ];
      const [adj, adv, verbs, adjS] = r.pick(P);
      if (r.chance(0.5)) {
        const s = `${n} ${r.pick(verbs)} ___.`;
        return {
          q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
          ans: ansChoice([adv, adj]),
          sol: [T(`空格在說「怎麼做」這個動作，所以要用副詞「${adv}」。`, `The blank tells <b>how</b> ${n} does it (it describes the verb), so use the adverb "${adv}".`), T(s.replace('___', adv), s.replace('___', adv))],
          hint: T('它在描述人或東西，還是描述動作？', 'Does it tell about a thing or about an action?'),
        };
      }
      const s = r.pick(adjS);
      return {
        q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
        ans: ansChoice([adj, adv]),
        sol: [T(`空格在描述一個名詞（人或東西），所以要用形容詞「${adj}」。`, `The blank tells about a noun (a person or thing), so use the adjective "${adj}".`), T(s.replace('___', adj), s.replace('___', adj))],
        hint: T('它在描述人或東西，還是描述動作？', 'Does it tell about a thing or about an action?'),
      };
    },
  },
  {
    id: 'g2-compound-sentences',
    grade: 2,
    unit: 'sentences',
    name: T('合併句子：, and / , but / , so', 'Compound sentences with , but / , so'),
    std: 'CCSS L.2.1f',
    lesson: {
      zh: '兩個完整的句子可以合成一句：在中間加<b>逗號</b>和連接詞 <b>and、but、so</b>。but 表示相反，so 表示結果。只用逗號連起來是錯的！',
      en: 'You can join two complete sentences into one with a <b>comma</b> and a joining word: <b>and, but, so</b>. "But" shows something different; "so" shows what happened because of it. A comma alone is not enough!',
      ex: ['It was hot<b>, so</b> we went swimming.', 'I like peas<b>, but</b> my brother does not.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n;
      const items = [
        ['It was raining', 'we stayed inside', 'so'],
        [`${n} was thirsty`, `${k1.he} drank some water`, 'so'],
        ['The dog was muddy', `${n} gave it a bath`, 'so'],
        [`${n} missed the bus`, `${k1.his} mom drove ${k1.him} to school`, 'so'],
        ['The room was dark', `${n} turned on the light`, 'so'],
        [`${n} likes cats`, `${k1.his} brother likes dogs`, 'but'],
        [`${n} tried to catch the ball`, 'it bounced away', 'but'],
        ['The cake looked yummy', 'it was too hot to eat', 'but'],
        [`${n} wanted to swim`, 'the pool was closed', 'but'],
        ['We looked for the cat', 'we could not find it', 'but'],
      ];
      const [a, b, c] = r.pick(items), other = c === 'so' ? 'but' : 'so';
      const right = `${cap(a)}, ${c} ${b}.`;
      return {
        text: `${cap(a)}. ${cap(b)}.`,
        q: T('哪一句把這兩個句子合併得最好？', 'Which sentence joins the two sentences best?'),
        ans: ansChoice([right, `${cap(a)}, ${other} ${b}.`, `${cap(a)}, ${b}.`]),
        sol: [c === 'so' ? T('第二件事是第一件事造成的結果，所以用 so。', 'The second part happens because of the first part, so use "so".')
          : T('第二件事和第一件事相反（跟預期的不一樣），所以用 but。', 'The second part is different from what you expect, so use "but".'),
        T('合併時要用「逗號 + 連接詞」，只有逗號不行。', 'Join them with a comma and a joining word. A comma alone is not enough.'), T(right, right)],
      };
    },
  },
  {
    id: 'g2-cap-holidays-places',
    grade: 2,
    unit: 'mechanics',
    name: T('大寫：節日、地名、產品名稱', 'Capitals: holidays, places and product names'),
    std: 'CCSS L.2.2a',
    lesson: {
      zh: '<b>節日</b>（Halloween、Thanksgiving）、<b>地名</b>（Texas、Taiwan、Paris）和<b>產品品牌名稱</b>（Lego）都是專有名詞，第一個字母要大寫。',
      en: '<b>Holidays</b> (Halloween, Thanksgiving), <b>places</b> (Texas, Taiwan, Paris) and <b>product names</b> (Lego) are proper nouns, so they start with a capital letter.',
      ex: ['We went to <u>T</u>aiwan for <u>C</u>hristmas.', 'I built a car with <u>L</u>ego bricks.'],
    },
    gen(r) {
      const { n } = kid(r), place = r.pick(PLACES), hol = r.pick(HOLIDAYS);
      const good = r.pick([
        `We went to ${place} for ${hol}.`,
        `${n} got Lego bricks for ${hol}.`,
        `My cousin in ${place} sent me Crayola crayons.`,
        `On ${hol}, my family ate Cheerios for breakfast.`,
        `${n} wants to visit ${place} next summer.`,
        `Our class made cards for ${hol}.`,
        `${n} drew a map of ${place} with Crayola markers.`,
        `Every ${hol}, we visit Grandma in ${place}.`,
        `${n} built a tiny ${place} out of Lego bricks.`,
      ]);
      const d = capDrill(r, good, (w) => HOLIDAYS.includes(w) || PLACES.includes(w) || PRODUCTS.includes(w));
      return {
        q: T('點出應該大寫的字。', 'Tap the word that needs a capital letter.'),
        ans: ansTap(d.bad, d.k),
        sol: [capWhy(d.w, -1), T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
        hint: T('找找節日、地名或品牌名稱。', 'Look for a holiday, a place or a brand name.'),
      };
    },
  },
  {
    id: 'g2-letter-commas',
    grade: 2,
    unit: 'mechanics',
    name: T('書信的稱呼和結尾逗號', 'Commas in letter greetings and closings'),
    std: 'CCSS L.2.2b',
    lesson: {
      zh: '寫信時，<b>稱呼</b>後面加逗號：Dear Grandma<b>,</b>。<b>結尾敬語</b>後面也加逗號，下一行寫名字：Love<b>,</b>（換行）Mia。',
      en: 'In a letter, put a comma after the <b>greeting</b>: Dear Grandma<b>,</b>. Put a comma after the <b>closing</b>, and write your name on the next line: Love<b>,</b> (new line) Mia.',
      ex: ['Dear Uncle Tom<b>,</b>', 'Your friend<b>,</b><br>Leo'],
    },
    gen(r) {
      const { n } = kid(r);
      if (r.chance(0.5)) {
        const who = r.pick(['Grandma', 'Grandpa', 'Aunt Rosa', 'Uncle Tom', 'Mr. Lee', 'Ms. Garcia', 'Mom', 'Dad', r.pick(NAMES)]);
        return {
          q: T('哪一個是正確的書信稱呼？', 'Which letter greeting is written correctly?'),
          ans: ansChoice([`Dear ${who},`, `Dear, ${who}`, `Dear ${who}.`]),
          sol: [T('逗號放在整個稱呼（Dear + 名字）的後面，不放在 Dear 後面，也不用句號。', 'The comma goes after the whole greeting (Dear + name), not after "Dear", and not a period.'), T(`Dear ${who},`, `Dear ${who},`)],
        };
      }
      const cl = r.pick(['Love', 'Your friend', 'Sincerely', 'Hugs', 'Your pal', 'Best wishes']);
      return {
        q: T('哪一個是正確的書信結尾？', 'Which letter closing is written correctly?'),
        ans: ansChoice([`${cl},<br>${n}`, `${cl}<br>${n},`, `${cl}.<br>${n}`]),
        sol: [T(`逗號放在結尾敬語「${cl}」的後面，下一行寫名字，名字後面不用標點。`, `The comma goes right after the closing "${cl}". Your name goes on the next line with no mark after it.`), T(`${cl},<br>${n}`, `${cl},<br>${n}`)],
      };
    },
  },
  {
    id: 'g2-contractions',
    grade: 2,
    unit: 'mechanics',
    name: T('縮寫的撇號：don\'t、I\'m', 'Apostrophes in contractions: don\'t, I\'m'),
    std: 'CCSS L.2.2c',
    lesson: {
      zh: '<b>縮寫</b>把兩個字合成一個短的字，<b>撇號 \'</b> 放在<b>被拿掉的字母</b>的位置：do not → don<b>\'</b>t（拿掉 o）、I am → I<b>\'</b>m（拿掉 a）。',
      en: 'A <b>contraction</b> squeezes two words into one. The <b>apostrophe (\')</b> goes where letters were taken out: do not → don<b>\'</b>t (the o is gone), I am → I<b>\'</b>m (the a is gone).',
      ex: ['is not → isn\'t', 'we are → we\'re', 'I will → I\'ll'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n;
      const C = [
        [`I <u>do not</u> like cold soup.`, 'do not', "don't", ['dont', "do'nt"]],
        [`${n} <u>cannot</u> find ${k1.his} shoe.`, 'cannot', "can't", ['cant', "ca'nt"]],
        ['The cat <u>is not</u> in the box.', 'is not', "isn't", ['isnt', "is'nt"]],
        ['<u>I am</u> seven years old.', 'I am', "I'm", ['Im', "I'am"]],
        ['<u>It is</u> sunny today.', 'It is', "It's", ['Its', "I'ts"]],
        ['<u>We are</u> going to the zoo.', 'We are', "We're", ['Were', "We'are"]],
        ['<u>They are</u> my best friends.', 'They are', "They're", ['Theyre', "The're"]],
        [`${n} <u>did not</u> eat the peas.`, 'did not', "didn't", ['didnt', "did'nt"]],
        ['<u>You are</u> a good helper.', 'You are', "You're", ['Youre', "Your'e"]],
        ['<u>He is</u> in the garden.', 'He is', "He's", ['Hes', "He'is"]],
        ['<u>She is</u> reading a book.', 'She is', "She's", ['Shes', "Sh'es"]],
        ['<u>I will</u> call you later.', 'I will', "I'll", ['Ill', "I'will"]],
        ['<u>We will</u> bake a pie.', 'We will', "We'll", ['Well', "We'ill"]],
        ['The movie <u>was not</u> long.', 'was not', "wasn't", ['wasnt', "was'nt"]],
        ['The kids <u>are not</u> sleepy.', 'are not', "aren't", ['arent', "are'nt"]],
        [`${n} <u>does not</u> like bugs.`, 'does not', "doesn't", ['doesnt', "does'nt"]],
      ];
      const [s, long, short, bad] = r.pick(C), fixed = s.replace(/<u>.*<\/u>/, short);
      const why = T(`「${long}」縮寫成「${short}」，撇號放在被拿掉的字母那裡。`, `"${long}" becomes "${short}". The apostrophe takes the place of the missing letter${long === 'cannot' ? 's' : ''}.`);
      if (r.chance(0.5)) {
        return {
          text: s,
          q: T('把畫線的字打成縮寫。', 'Type the underlined words as a contraction.'),
          ans: ansText([short, short.replace("'", '’')]),
          sol: [why, T(fixed, fixed)],
          hint: T('別忘了撇號 \'', "Don't forget the apostrophe (')."),
        };
      }
      return {
        text: s,
        q: T('畫線的字正確的縮寫是哪一個？', 'Which is the right contraction for the underlined words?'),
        ans: ansChoice([short, ...bad]),
        sol: [why, T(fixed, fixed)],
      };
    },
  },
  {
    id: 'g2-possessives',
    grade: 2,
    unit: 'mechanics',
    name: T('所有格的撇號：Mia\'s', "Apostrophes that show who owns it: Mia's"),
    std: 'CCSS L.2.2c',
    lesson: {
      zh: '要表示東西是<b>誰的</b>，在名字或名詞後面加 <b>\'s</b>：the hat that belongs to Mia → <b>Mia\'s</b> hat；the dog\'s bone（狗的骨頭）。',
      en: 'To show who <b>owns</b> something, add <b>\'s</b> to the owner: the hat that belongs to Mia → <b>Mia\'s</b> hat; the dog\'s bone.',
      ex: ['<b>Leo\'s</b> bike is red.', 'The <b>cat\'s</b> bowl is empty.'],
    },
    gen(r) {
      const n = r.pick(NAMES.filter((x) => !/s$/.test(x)));
      const thing = r.pick(['bike', 'hat', 'lunch box', 'book', 'kite', 'backpack', 'pencil', 'jacket']);
      if (r.chance(0.5)) {
        const owner = r.pick([n, 'the dog', 'my teacher', 'the baby', 'Dad', 'my sister', n]);
        const o = owner.split(' ').pop(), pre = owner.includes(' ') ? owner.split(' ').slice(0, -1).join(' ') + ' ' : '';
        return {
          q: T(`「the ${thing} that belongs to ${owner}」（屬於 ${owner} 的 ${thing}）怎麼寫？`, `How do you write "the ${thing} that belongs to ${owner}"?`),
          ans: ansChoice([`${pre}${o}'s ${thing}`, `${pre}${o}s ${thing}`, `${pre}${o}s' ${thing}`]),
          sol: [T(`只有一個主人（${owner}），在後面加 's。`, `There is one owner (${owner}), so add 's.`), T(`${pre}${o}'s ${thing}`, `${pre}${o}'s ${thing}`)],
        };
      }
      const good = r.pick([`I found ${n}'s ${thing} under the bed.`, `${n}'s ${thing} is on the bus.`, `Mom fixed ${n}'s ${thing}.`, `We looked for ${n}'s ${thing} after school.`]);
      const ws = words(good), k = ws.findIndex((t) => t.startsWith(n + "'s"));
      return {
        q: T('有一個字少了撇號，點出來。', 'One word is missing an apostrophe. Tap it.'),
        ans: ansTap(swapTok(ws, k, n + 's'), k),
        sol: [T(`${thing} 是 ${n} 的，所以要寫「${n}'s」。`, `The ${thing} belongs to ${n}, so write "${n}'s".`), T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
      };
    },
  },
  {
    id: 'g2-compound-words',
    grade: 2,
    unit: 'words',
    name: T('複合字：rain + bow = rainbow', 'Compound words: rain + bow = rainbow'),
    std: 'CCSS L.2.4d',
    lesson: {
      zh: '<b>複合字</b>是把兩個小字合在一起，變成一個新字：sun + flower = <b>sunflower</b>（向日葵）。看懂兩個小字，常常就能猜出意思。',
      en: 'A <b>compound word</b> is two small words put together to make a new word: sun + flower = <b>sunflower</b>. Knowing the two small words often helps you guess the meaning.',
      ex: ['tooth + brush = <b>toothbrush</b>', 'foot + ball = <b>football</b>', 'snow + man = <b>snowman</b>'],
    },
    gen(r) {
      const CW = [['rain', 'bow'], ['sun', 'flower'], ['cup', 'cake'], ['foot', 'ball'], ['bed', 'room'], ['tooth', 'brush'], ['snow', 'man'], ['back', 'pack'], ['star', 'fish'], ['pop', 'corn'],
        ['gold', 'fish'], ['sand', 'box'], ['butter', 'fly'], ['fire', 'fly'], ['mail', 'box'], ['play', 'ground'], ['home', 'work'], ['lunch', 'box'], ['rain', 'coat'], ['bath', 'tub']];
      const NOT = ['rabbit', 'purple', 'monkey', 'pencil', 'tiger', 'turtle', 'kitten', 'happy', 'apple', 'river', 'music', 'zebra', 'lemon', 'paper', 'water', 'spider'];
      const [a, b] = r.pick(CW), w = a + b;
      if (r.chance(0.5)) {
        return {
          q: T(`把兩個字合成一個複合字：${a} + ${b} = ___`, `Put the two words together: ${a} + ${b} = ___`),
          ans: ansText([w]),
          sol: [T(`「${a}」和「${b}」直接接在一起，中間不空格。`, `Join "${a}" and "${b}" with no space.`), T(`${a} + ${b} = ${w}`, `${a} + ${b} = ${w}`)],
        };
      }
      return {
        q: T('哪一個是複合字（由兩個字組成）？', 'Which one is a compound word (two words put together)?'),
        ans: ansChoice([w, ...r.sample(NOT, 2)]),
        sol: [T(`「${w}」= ${a} + ${b}，是兩個字合起來的。`, `"${w}" = ${a} + ${b}. It is made of two words.`), T('其他的字不能拆成兩個真正的英文字。', 'The other words cannot be split into two real words.')],
      };
    },
  },
  {
    id: 'g2-prefixes',
    grade: 2,
    unit: 'words',
    name: T('字首 un- 和 re-', 'Prefixes un- and re-'),
    std: 'CCSS L.2.4b',
    lesson: {
      zh: '<b>字首</b>加在字的前面，會改變意思。<b>un-</b> 表示「不」：unhappy = not happy。<b>re-</b> 表示「再一次」：repaint = paint again。',
      en: 'A <b>prefix</b> goes at the start of a word and changes its meaning. <b>un-</b> means "not": unhappy = not happy. <b>re-</b> means "again": repaint = paint again.',
      ex: ['<b>un</b>kind = not kind', '<b>re</b>fill = fill again', '<b>re</b>build = build again'],
    },
    gen(r) {
      const { n } = kid(r);
      const un = r.chance(0.5);
      const [b, obj] = un ? r.pick([['happy'], ['kind'], ['fair'], ['safe'], ['lucky'], ['sure'], ['tidy'], ['friendly']])
        : r.pick([['paint', 'the fence'], ['read', 'the story'], ['fill', 'the cup'], ['build', 'the tower'], ['tell', 'the joke'], ['write', 'the note'], ['heat', 'the soup'], ['tie', 'the shoe']]);
      const w = (un ? 'un' : 're') + b;
      const why = un ? T(`un- 表示「不」，所以「${w}」= not ${b}。`, `un- means "not", so "${w}" means "not ${b}".`) : T(`re- 表示「再一次」，所以「${w}」= ${b} again。`, `re- means "again", so "${w}" means "${b} again".`);
      if (r.chance(0.5)) {
        return {
          q: T(`「${w}」是什麼意思？`, `What does "${w}" mean?`),
          ans: ansChoice(un ? [`not ${b}`, `${b} again`, `very ${b}`] : [`${b} again`, `not ${b}`, `${b} before`]),
          sol: [why, un ? T(`例句：${n} was ${w}.`, `Example: ${n} was ${w}.`) : T(`例句：${n} had to ${w} ${obj}.`, `Example: ${n} had to ${w} ${obj}.`)],
        };
      }
      const s = un ? `${n} was ___. (not ${b})` : `${n} had to ___ ${obj}. (${b} again)`;
      return {
        q: T(`加上 un- 或 re-，打出正確的字：${s}`, `Add un- or re- and type the word: ${s}`),
        ans: ansText([w]),
        sol: [why, T(s.replace('___', w).replace(/ \(.*\)$/, ''), s.replace('___', w).replace(/ \(.*\)$/, ''))],
      };
    },
  },
  {
    id: 'g2-synonyms-antonyms',
    grade: 2,
    unit: 'words',
    name: T('同義詞和反義詞', 'Synonyms and antonyms'),
    std: 'Grade 2 · Language',
    lesson: {
      zh: '<b>同義詞</b>是意思差不多的字（big – large）。<b>反義詞</b>是意思相反的字（big – small）。寫作時換用同義詞，文章會更有變化。',
      en: '<b>Synonyms</b> are words that mean almost the same (big – large). <b>Antonyms</b> are words with opposite meanings (big – small). Using synonyms makes your writing more interesting.',
      ex: ['happy – glad (synonyms)', 'happy – sad (antonyms)'],
    },
    gen(r) {
      const W = [['big', 'large', 'small'], ['happy', 'glad', 'sad'], ['fast', 'quick', 'slow'], ['shout', 'yell', 'whisper'], ['begin', 'start', 'finish'], ['shut', 'close', 'open'],
        ['little', 'tiny', 'huge'], ['mad', 'angry', 'calm'], ['cold', 'chilly', 'hot'], ['loud', 'noisy', 'quiet'], ['tired', 'sleepy', 'awake'], ['easy', 'simple', 'hard'],
        ['smile', 'grin', 'frown'], ['near', 'close', 'far'], ['wet', 'damp', 'dry'], ['scared', 'afraid', 'brave']];
      const NEU = ['table', 'green', 'pencil', 'banana', 'window', 'seven', 'spoon', 'sock', 'river', 'carrot'];
      const [w, syn, ant] = r.pick(W), askSyn = r.chance(0.5);
      const right = askSyn ? syn : ant, other = askSyn ? ant : syn;
      return {
        q: askSyn ? T(`哪一個字和「${w}」意思差不多（同義詞）？`, `Which word means almost the same as "${w}"? (synonym)`) : T(`哪一個字和「${w}」意思相反（反義詞）？`, `Which word means the opposite of "${w}"? (antonym)`),
        ans: ansChoice([right, other, r.pick(NEU)]),
        sol: [askSyn ? T(`「${syn}」和「${w}」意思差不多，是同義詞。`, `"${syn}" means almost the same as "${w}". They are synonyms.`) : T(`「${ant}」和「${w}」意思相反，是反義詞。`, `"${ant}" means the opposite of "${w}". They are antonyms.`),
          askSyn ? T(`「${ant}」是相反的意思（反義詞），不是同義詞。`, `"${ant}" is the opposite (an antonym), not a synonym.`) : T(`「${syn}」意思差不多（同義詞），不是相反。`, `"${syn}" means almost the same (a synonym), not the opposite.`)],
      };
    },
  },
  {
    id: 'g2-opinion-linking',
    grade: 2,
    unit: 'paragraphs',
    name: T('意見段落的連接詞：because、also、that is why', 'Linking words in an opinion: because, also, that is why'),
    std: 'CCSS W.2.1',
    lesson: {
      zh: '寫意見文時，用 <b>because</b> 說出理由，用 <b>Also</b> 加上另一個理由，最後用 <b>That is why</b> 把看法再說一次。',
      en: 'In an opinion paragraph, use <b>because</b> to give a reason, <b>Also</b> to add another reason, and <b>That is why</b> to say your opinion again at the end.',
      ex: ['I like dogs <b>because</b> they are friendly. <b>Also</b>, they can learn tricks. <b>That is why</b> dogs are the best pets!'],
    },
    gen(r) {
      const TOP = [
        ['dogs are the best pets', 'dogs', 'they are friendly', 'they can learn fun tricks'],
        ['summer is the best season', 'summer', 'it is warm', 'we can swim at the beach'],
        ['pizza is the best lunch', 'pizza', 'it is cheesy', 'you can eat it with your hands'],
        ['soccer is a great game', 'soccer', 'it makes me run fast', 'I can play it with my friends'],
        ['reading is a fun hobby', 'reading', 'books take me to new places', 'I learn new words'],
        ['the library is the best place in town', 'the library', 'it is quiet', 'I can borrow books for free'],
        ['rainy days are fun', 'rainy days', 'I can jump in puddles', 'we play board games inside'],
        ['art is the best class', 'art', 'I can paint with bright colors', 'we make cool things with clay'],
      ];
      const [op, sh, r1, r2] = r.pick(TOP), slot = r.int(0, 2);
      const parts = [`I think ${op}. I like ${sh} `, ` ${r1}. `, `, ${r2}. `, ` I think ${op}!`];
      const fill = [['because', 'but', 'or'], ['Also', 'But', 'Because'], ['That is why', 'But', 'Or']];
      const blanks = ['because', 'Also', 'That is why'].map((w, i) => (i === slot ? '___' : w));
      const text = parts[0] + blanks[0] + parts[1] + blanks[1] + parts[2] + blanks[2] + parts[3];
      const why = [T('這裡在說「為什麼」喜歡，用 because。', 'This part tells why, so use "because".'), T('這裡要再加一個理由，用 Also。', 'This adds another reason, so use "Also".'), T('最後一句把看法再說一次，用 That is why。', 'The last sentence says the opinion again, so use "That is why".')][slot];
      return {
        text,
        q: T('空格要填哪個連接詞？', 'Which linking words go in the blank?'),
        ans: ansChoice(fill[slot]),
        sol: [why, T(text.replace('___', fill[slot][0]), text.replace('___', fill[slot][0]))],
      };
    },
  },
  {
    id: 'g2-howto-order',
    grade: 2,
    unit: 'organization',
    name: T('說明步驟的順序', 'Putting how-to steps in order'),
    std: 'CCSS W.2.2',
    lesson: {
      zh: '寫「怎麼做」的文章時，步驟要照<b>做的順序</b>排好，並用 <b>First、Next、Then、Finally</b> 這類順序詞。',
      en: 'When you write how to do something, put the steps in the <b>order you do them</b>, and use order words like <b>First, Next, Then, Finally</b>.',
      ex: ['<b>First</b>, get two slices of bread.', '<b>Next</b>, spread the peanut butter.', '<b>Finally</b>, put the slices together.'],
    },
    gen(r) {
      const H = [
        [T('做檸檬水', 'make lemonade'), ['squeeze the lemons into a pitcher', 'add water and sugar', 'stir it with a big spoon', 'pour it into a cup and enjoy']],
        [T('洗手', 'wash your hands'), ['turn on the water', 'rub soap all over your hands', 'rinse off the soap', 'dry your hands with a towel']],
        [T('種花', 'plant a flower'), ['dig a hole in the dirt', 'put the flower in the hole', 'cover the roots with dirt', 'water the flower']],
        [T('摺紙飛機', 'make a paper airplane'), ['fold the paper in half the long way', 'fold the top corners down to the middle', 'fold the wings down', 'throw your plane into the air']],
        [T('做果醬吐司', 'make toast with jam'), ['put the bread in the toaster', 'wait for the toast to pop up', 'spread jam on the toast', 'eat your yummy toast']],
        [T('做卡片', 'make a card'), ['fold a piece of paper in half', 'draw a picture on the front', 'write a message inside', 'give the card to someone special']],
        [T('刷牙', 'brush your teeth'), ['put toothpaste on your toothbrush', 'brush your teeth in small circles', 'spit out the toothpaste', 'rinse your mouth with water']],
      ];
      const [title, steps] = r.pick(H);
      const tw = r.pick([['First', 'Second', 'Third', 'Finally'], ['First', 'Next', 'After that', 'Last'], ['To start', 'Then', 'Next', 'Finally']]);
      const items = steps.map((s, i) => `${tw[i]}, ${s}.`);
      return {
        q: T(`把「${title.zh}」的步驟排成正確的順序。`, `Put the steps for how to ${title.en} in order.`),
        ans: ansOrder(items),
        sol: [T('想一想真的動手做時，哪一步要先做；順序詞也是線索。', 'Think about what you really do first. The order words are clues too.'), T(`正確順序：${items.join(' ')}`, `The right order: ${items.join(' ')}`)],
      };
    },
  },
);

// =====================================================================
// GRADE 3
// =====================================================================
const SMALL = ['a', 'an', 'the', 'and', 'of', 'to', 'in', 'on', 'at', 'for', 'but', 'or'];
skills.push(
  {
    id: 'g3-abstract-nouns',
    grade: 3,
    unit: 'grammar',
    name: T('抽象名詞', 'Abstract nouns'),
    std: 'CCSS L.3.1c',
    lesson: {
      zh: '<b>具體名詞</b>是摸得到、看得到的東西（dog、apple）。<b>抽象名詞</b>是想法、感覺或特質，摸不到（love、courage、friendship）。很多抽象名詞是形容詞加 <b>-ness</b>：kind → <b>kindness</b>。',
      en: 'A <b>concrete noun</b> is something you can see or touch (dog, apple). An <b>abstract noun</b> is an idea, feeling or quality you cannot touch (love, courage, friendship). Many add <b>-ness</b> to an adjective: kind → <b>kindness</b>.',
      ex: ['The firefighter showed great <b>courage</b>.', 'Thank you for your <b>kindness</b>.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n, n2 = r.pick(NAMES.filter((x) => x !== n));
      const mode = r.int(0, 2);
      if (mode === 0) {
        const abs = r.pick(['love', 'bravery', 'friendship', 'joy', 'honesty', 'kindness', 'fear', 'freedom', 'courage', 'patience', 'hope', 'anger', 'sadness', 'happiness']);
        const con = r.sample(['dog', 'apple', 'chair', 'teacher', 'river', 'pencil', 'cloud', 'shoe', 'cookie', 'garden', 'bus', 'flower'], 2);
        return {
          q: T('哪一個是抽象名詞（摸不到的想法或感覺）？', 'Which word is an abstract noun (an idea or feeling you cannot touch)?'),
          ans: ansChoice([abs, ...con]),
          sol: [T(`「${abs}」是一種感覺或特質，看不到也摸不到，所以是抽象名詞。`, `"${abs}" is a feeling or quality. You cannot see or touch it, so it is an abstract noun.`),
            T(`「${con[0]}」和「${con[1]}」摸得到，是具體名詞。`, `You can touch a ${con[0]} or a ${con[1]}, so they are concrete nouns.`)],
        };
      }
      if (mode === 1) {
        const [adj, noun] = r.pick([['kind', 'kindness'], ['happy', 'happiness'], ['sad', 'sadness'], ['dark', 'darkness'], ['good', 'goodness'], ['sick', 'sickness'], ['fair', 'fairness'], ['soft', 'softness'], ['weak', 'weakness'], ['silly', 'silliness']]);
        return {
          q: T(`在「${adj}」後面加 -ness，變成抽象名詞：${adj} → ___`, `Add -ness to make an abstract noun: ${adj} → ___`),
          ans: ansText([noun]),
          sol: [/y$/.test(adj) ? T(`字尾的 y 要先改成 i，再加 -ness：${noun}。`, `Change the y to i, then add -ness: ${noun}.`) : T(`直接加 -ness：${noun}。`, `Just add -ness: ${noun}.`),
            T(`「${noun}」是一種特質或感覺，是抽象名詞。`, `"${noun}" is a quality or feeling, so it is an abstract noun.`)],
        };
      }
      const [s, abs] = r.pick([
        () => { const x = r.pick(['courage', 'bravery']); return [`The firefighter showed great ${x}.`, x]; },
        () => { const x = r.pick(['hope', 'joy', 'excitement']); return [`${n} was full of ${x} on the first day of school.`, x]; },
        () => { const x = r.pick(['kindness', 'patience', 'honesty']); return [`Thank you for your ${x}, ${n2}.`, x]; },
        () => [`${n} and ${n2} have a strong friendship.`, 'friendship'],
        () => { const x = r.pick(['honesty', 'patience', 'kindness']); return [`The teacher thanked ${n} for ${k1.his} ${x}.`, x]; },
        () => { const x = r.pick(['love', 'pride']); return [`Grandma looked at the baby with ${x}.`, x]; },
      ])();
      const ws = words(s), k = findTok(ws, abs);
      return {
        q: T('點出句子裡的抽象名詞。', 'Tap the abstract noun in the sentence.'),
        ans: ansTap(ws, k),
        sol: [T(`「${abs}」是想法或感覺，摸不到，所以是抽象名詞。`, `"${abs}" is an idea or feeling you cannot touch, so it is the abstract noun.`), T('句子裡其他的名詞（人或東西）都摸得到、看得到，是具體名詞。', 'The other nouns name people or things you can see, so they are concrete nouns.')],
      };
    },
  },
  {
    id: 'g3-past-regular-irregular',
    grade: 3,
    unit: 'grammar',
    name: T('規則和不規則動詞的過去式', 'Regular and irregular past tense'),
    std: 'CCSS L.3.1d',
    lesson: {
      zh: '<b>規則動詞</b>加 -ed，但要注意拼字：stop → stop<b>ped</b>（重複字尾）、cry → cr<b>ied</b>（y 變 i）、bake → bake<b>d</b>。<b>不規則動詞</b>要背：bring → <b>brought</b>、teach → <b>taught</b>、sleep → <b>slept</b>。',
      en: '<b>Regular verbs</b> add -ed, but watch the spelling: stop → stop<b>ped</b> (double the last letter), cry → cr<b>ied</b> (y to i), bake → bake<b>d</b>. <b>Irregular verbs</b> change: bring → <b>brought</b>, teach → <b>taught</b>, sleep → <b>slept</b>.',
      ex: ['We <b>hopped</b> over the puddle.', 'The baby <b>cried</b>.', 'Dad <b>built</b> a shed.'],
    },
    gen(r) {
      const { n } = kid(r);
      const REG = [['stop', 'at the corner'], ['hop', 'over the puddle'], ['cry', 'at the sad movie'], ['carry', 'the heavy box'], ['bake', 'a pie'], ['hug', 'the puppy'], ['clap', 'for the band'], ['try', 'a new food'],
        ['smile', 'at the baby'], ['plan', 'a party'], ['drop', 'the cup'], ['study', 'for the test'], ['shop', 'for shoes'], ['wave', 'to a friend']];
      const IRR = [['bring', 'a snack'], ['think', 'about the puzzle'], ['catch', 'a fish'], ['teach', 'the dog a trick'], ['sleep', 'for ten hours'], ['keep', 'the secret'], ['build', 'a sandcastle'], ['hold', 'the baby bird'],
        ['feel', 'happy'], ['leave', 'the park early'], ['wear', 'a red scarf'], ['speak', 'to the class'], ['choose', 'a blue pen'], ['hide', 'the present'], ['break', 'a pencil'], ['forget', 'the lunch box']];
      const irr = r.chance(0.5), [v, obj] = r.pick(irr ? IRR : REG), p = past(v);
      const rule = irr ? T(`「${v}」是不規則動詞，過去式是「${p}」，要記起來。`, `"${v}" is irregular. Its past tense is "${p}" — you have to remember it.`)
        : /ied$/.test(p) ? T(`「${v}」是規則動詞：子音 + y 結尾，把 y 改成 i 再加 -ed：${p}。`, `"${v}" is regular. It ends in a consonant + y, so change y to i and add -ed: ${p}.`)
        : /e$/.test(v) ? T(`「${v}」是規則動詞，字尾已經有 e，只加 -d：${p}。`, `"${v}" is regular. It already ends in e, so just add -d: ${p}.`)
        : T(`「${v}」是規則動詞，短母音加一個子音結尾，要重複字尾再加 -ed：${p}。`, `"${v}" is regular. It has a short vowel and ends in one consonant, so double the last letter and add -ed: ${p}.`);
      const good = `Yesterday, ${n} ${p} ${obj}.`;
      if (r.chance(0.6)) {
        return {
          q: T(`打出過去式：Yesterday, ${n} ___ (${v}) ${obj}.`, `Type the past tense: Yesterday, ${n} ___ (${v}) ${obj}.`),
          ans: ansText([p]),
          sol: [rule, T(good, good)],
        };
      }
      return {
        q: T(`「${v}」是規則動詞還是不規則動詞？`, `Is "${v}" a regular or an irregular verb?`),
        ans: ansChoice(irr ? [T('不規則動詞', 'irregular'), T('規則動詞', 'regular')] : [T('規則動詞', 'regular'), T('不規則動詞', 'irregular')]),
        sol: [rule, T(good, good)],
      };
    },
  },
  {
    id: 'g3-verb-tenses',
    grade: 3,
    unit: 'grammar',
    name: T('簡單式：過去、現在、未來', 'Simple verb tenses: past, present, future'),
    std: 'CCSS L.3.1e',
    lesson: {
      zh: '<b>過去式</b>：已經發生（walked、rode）。<b>現在式</b>：常常發生或正是事實（walks / walk）。<b>未來式</b>：will + 動詞原形（will walk）。看時間詞（yesterday、every day、tomorrow）來選。',
      en: '<b>Past</b>: it already happened (walked, rode). <b>Present</b>: it happens often or is true now (walks / walk). <b>Future</b>: will + verb (will walk). Time words like yesterday, every day and tomorrow are clues.',
      ex: ['Last year we <b>rode</b> a train.', 'Every day she <b>rides</b> her bike.', 'Next week I <b>will ride</b> a horse.'],
    },
    gen(r) {
      const VO = [['go', 'to the library'], ['eat', 'pancakes'], ['ride', 'the bus'], ['write', 'a story'], ['swim', 'in the lake'], ['visit', 'Grandpa'], ['bake', 'bread'], ['watch', 'a movie'], ['play', 'chess'], ['fly', 'a kite'], ['draw', 'comics'], ['paint', 'a mural']];
      const [v, o] = r.pick(VO), one = r.chance(0.5), subj = one ? kid(r).n : r.pick(['we', 'they', 'my cousins', 'I']);
      const forms = { past: past(v), present: one ? third(v) : v, future: `will ${v}` };
      const zhT = { past: '過去式', present: '現在式', future: '未來式' };
      if (r.chance(0.5)) {
        const when = r.pick(['past', 'present', 'future']);
        const time = { past: r.pick(['Last summer', 'Yesterday', 'Two days ago']), present: r.pick(['Every Saturday', 'Most mornings', 'Every week']), future: r.pick(['Next week', 'Tomorrow', 'Next summer']) }[when];
        const s = `${time}, ${subj} ___ ${o}.`;
        const opts = [forms[when], ...Object.values(forms).filter((x) => x !== forms[when])];
        return {
          q: T(`選出正確的動詞：${s}`, `Choose the right verb: ${s}`),
          ans: ansChoice(opts),
          sol: [T(`「${time}」告訴我們要用${zhT[when]}：${forms[when]}。`, `"${time}" tells us to use the ${when} tense: ${forms[when]}.`), T(s.replace('___', forms[when]), s.replace('___', forms[when]))],
        };
      }
      const when = r.pick(['past', 'present', 'future']), s = `${cap(subj)} ${forms[when]} ${o}.`;
      const lab = { past: T('過去式', 'past'), present: T('現在式', 'present'), future: T('未來式', 'future') };
      return {
        text: s,
        q: T('這個句子的動詞是什麼時態？', 'What tense is the verb in this sentence?'),
        ans: ansChoice([lab[when], ...['past', 'present', 'future'].filter((x) => x !== when).map((x) => lab[x])]),
        sol: [when === 'future' ? T(`「will ${v}」是 will + 動詞原形，是未來式。`, `"will ${v}" is will + verb, so it is the future tense.`)
          : when === 'past' ? T(`「${forms.past}」是「${v}」的過去式，表示已經發生。`, `"${forms.past}" is the past form of "${v}". It already happened.`)
          : T(`「${forms.present}」是現在式，表示常常做或現在的事實。`, `"${forms.present}" is the present tense. It happens now or often.`),
        T(`過去：${forms.past}｜現在：${forms.present}｜未來：${forms.future}`, `Past: ${forms.past} | Present: ${forms.present} | Future: ${forms.future}`)],
      };
    },
  },
  {
    id: 'g3-sv-agreement',
    grade: 3,
    unit: 'grammar',
    name: T('主詞和動詞一致', 'Subject–verb agreement'),
    std: 'CCSS L.3.1f',
    lesson: {
      zh: '動詞要配合<b>主詞</b>：一個（單數）用 likes、is、was、has、does；很多個（複數）用 like、are、were、have、do。小心！主詞後面的介係詞片語（in the yard）不會改變主詞。',
      en: 'The verb must match the <b>subject</b>. One (singular): likes, is, was, has, does. More than one (plural): like, are, were, have, do. Careful: a phrase after the subject (in the yard) does not change the subject.',
      ex: ['The <b>dog</b> in the yard <b>barks</b>.', 'The <b>dogs</b> next to the house <b>bark</b>.'],
    },
    gen(r) {
      const noun = r.pick(['dog', 'cat', 'bird', 'girl', 'boy', 'puppy', 'kitten', 'pony']);
      const many = r.chance(0.5), subj = `The ${many ? (noun === 'puppy' ? 'puppies' : noun === 'pony' ? 'ponies' : noun + 's') : noun}`;
      const pp = r.chance(0.6) ? ' ' + r.pick(['in the yard', 'next to the window', 'on our street', 'near the trees', 'by the gate', 'from next door']) : '';
      const VP = [['likes', 'like', 'apples'], ['looks', 'look', 'happy today'], ['wants', 'want', 'a snack'], ['needs', 'need', 'some water'], ['is', 'are', 'very sleepy'], ['was', 'were', 'hungry this morning'],
        ['has', 'have', 'a red ball'], ['does', 'do', 'not like baths'], ['sleeps', 'sleep', 'after lunch'], ['plays', 'play', 'every day']];
      const [sg, pl, rest] = r.pick(VP), right = many ? pl : sg, wrong = many ? sg : pl;
      const good = `${subj}${pp} ${right} ${rest}.`, ws = words(good), k = words(`${subj}${pp}`).length;
      return {
        q: T('點出和主詞不一致的動詞。', 'Tap the verb that does not match the subject.'),
        ans: ansTap(swapTok(ws, k, wrong), k),
        sol: [T(`主詞是「${subj}」，是${many ? '複數（很多個）' : '單數（一個）'}，所以動詞要用「${right}」，不是「${wrong}」。`, `The subject is "${subj}", which is ${many ? 'plural (more than one)' : 'singular (one)'}, so the verb is "${right}", not "${wrong}".`),
          ...(pp ? [T(`「${pp.trim()}」只是補充說明，不是主詞。`, `"${pp.trim()}" just adds information. It is not the subject.`)] : []),
          T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
        hint: T('先找出誰在做這件事。', 'First find who or what the sentence is about.'),
      };
    },
  },
  {
    id: 'g3-pronoun-antecedent',
    grade: 3,
    unit: 'grammar',
    name: T('代名詞要和它代替的名詞一致', 'Pronoun–antecedent agreement'),
    std: 'CCSS L.3.1',
    lesson: {
      zh: '代名詞要和它代替的名詞（先行詞）<b>一致</b>：一個男生 → he / his；一個女生 → she / her；一樣東西或動物 → it / its；很多個 → they / their / them。注意 <b>its</b>（它的）沒有撇號，<b>it\'s</b> = it is。',
      en: 'A pronoun must <b>match</b> the noun it stands for: one boy → he / his; one girl → she / her; one thing or animal → it / its; more than one → they / their / them. Note: <b>its</b> (belongs to it) has no apostrophe; <b>it\'s</b> means "it is".',
      ex: ['The birds built <b>their</b> nest.', 'The dog wagged <b>its</b> tail.', 'Leo lost <b>his</b> hat.'],
    },
    gen(r) {
      const k1 = kid(r), [a, b] = r.sample(NAMES, 2);
      const items = [
        [`${k1.n} lost ___ hat at the park.`, k1.his, ['their', 'its'], T(`${k1.n} 是一個${k1.girl ? '女生' : '男生'}，所以用「${k1.his}」。`, `${k1.n} is one ${k1.girl ? 'girl' : 'boy'}, so use "${k1.his}".`)],
        ['The students packed ___ bags.', 'their', ['his', 'its'], T('students 是很多人，所以用 their。', '"Students" is more than one person, so use "their".')],
        ['The dog wagged ___ tail.', 'its', ['their', "it's"], T("一隻狗用 its（它的）；it's 是 it is。", 'One dog is "it", so use "its". ("It\'s" means "it is".)')],
        ['My grandparents called. ___ will visit us soon.', 'They', ['He', 'It'], T('grandparents 是兩個人，所以用 They。', '"Grandparents" are more than one person, so use "They".')],
        [`${a} and ${b} finished ___ project.`, 'their', ['his', 'its'], T(`${a} 和 ${b} 是兩個人，所以用 their。`, `${a} and ${b} are two people, so use "their".`)],
        ['The tree lost all of ___ leaves.', 'its', ['their', "it's"], T('一棵樹是一樣東西，用 its。', 'One tree is "it", so use "its".')],
        [`${k1.n} has a new bike. ${k1.He} rides ___ every day.`, 'it', ['them', k1.him], T('bike 是一樣東西，所以用 it。', 'The bike is one thing, so use "it".')],
        [`I gave two books to ${a}. ${a} read ___ in one day.`, 'them', ['it', 'him'], T('two books 是很多本，所以用 them。', '"Two books" is more than one, so use "them".')],
        ['The birds built ___ nest in the oak tree.', 'their', ['its', 'his'], T('birds 是很多隻，所以用 their。', '"Birds" is more than one, so use "their".')],
        [`My sister baked cookies, and ___ shared them with us.`, 'she', ['they', 'it'], T('sister 是一個女生，所以用 she。', '"Sister" is one girl, so use "she".')],
      ];
      const [s, right, wr, why] = r.pick(items);
      return {
        q: T(`選出正確的代名詞：${s}`, `Choose the right pronoun: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [why, T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g3-comparatives',
    grade: 3,
    unit: 'grammar',
    name: T('比較級和最高級', 'Comparatives and superlatives'),
    std: 'CCSS L.3.1g',
    lesson: {
      zh: '比較<b>兩個</b>用比較級：短的字加 <b>-er</b>（taller），長的字用 <b>more</b>（more careful）。比較<b>三個以上</b>用最高級：<b>-est</b>（tallest）或 <b>most</b>（most careful）。特別的：good → better → best、bad → worse → worst。不要同時用 more 和 -er！',
      en: 'Compare <b>two</b> things with a comparative: short words add <b>-er</b> (taller), long words use <b>more</b> (more careful). Compare <b>three or more</b> with a superlative: <b>-est</b> (tallest) or <b>most</b> (most careful). Special: good → better → best, bad → worse → worst. Never use more and -er together!',
      ex: ['A horse is <b>bigger</b> than a dog.', 'The whale is the <b>biggest</b> animal.', 'This book is <b>more interesting</b> than that one.'],
    },
    gen(r) {
      const [a, b] = twoNames(r);
      const A = [
        ['tall', 'taller', 'tallest', 'more taller', 'most tallest', `${a} is ___ than ${b}.`, `${a} is the ___ kid in our class.`],
        ['fast', 'faster', 'fastest', 'more faster', 'most fastest', `A cheetah is ___ than a horse.`, `The cheetah is the ___ land animal.`],
        ['big', 'bigger', 'biggest', 'biger', 'bigest', `A horse is ___ than a goat.`, `This is the ___ pumpkin on the farm.`],
        ['happy', 'happier', 'happiest', 'happyer', 'happyest', `${a} feels ___ today than yesterday.`, `${a} was the ___ kid at the party.`],
        ['good', 'better', 'best', 'gooder', 'goodest', `${a}'s drawing is ___ than mine.`, `This is the ___ pizza in town.`],
        ['bad', 'worse', 'worst', 'badder', 'baddest', `Today's storm is ___ than yesterday's storm.`, `That was the ___ cold I have ever had.`],
        ['beautiful', 'more beautiful', 'most beautiful', 'beautifuler', 'beautifulest', `This flower is ___ than that one.`, `It is the ___ garden in the city.`],
        ['interesting', 'more interesting', 'most interesting', 'interestinger', 'interestingest', `This book is ___ than the last one.`, `It is the ___ museum I have visited.`],
        ['funny', 'funnier', 'funniest', 'more funnier', 'most funniest', `${a}'s joke was ___ than mine.`, `${a} told the ___ joke of all.`],
        ['careful', 'more careful', 'most careful', 'carefuller', 'carefullest', `${a} is ___ with scissors than ${b}.`, `${a} is the ___ painter in the art club.`],
        ['small', 'smaller', 'smallest', 'more smaller', 'most smallest', `A mouse is ___ than a cat.`, `The ___ puppy was asleep in the basket.`],
      ];
      const [adj, cmp, sup, wc, ws2, s1, s2] = r.pick(A), two = r.chance(0.5);
      const s = two ? s1 : s2, right = two ? cmp : sup;
      const kind = /^more |^most /.test(right) ? T(`「${adj}」是比較長的字，所以用 ${two ? 'more' : 'most'}。`, `"${adj}" is a long word, so use "${two ? 'more' : 'most'}".`)
        : ['good', 'bad'].includes(adj) ? T(`「${adj}」是特別的字：${adj} → ${cmp} → ${sup}。`, `"${adj}" is special: ${adj} → ${cmp} → ${sup}.`)
        : T(`「${adj}」是短的字，加 ${two ? '-er' : '-est'}：${right}。`, `"${adj}" is a short word, so add ${two ? '-er' : '-est'}: ${right}.`);
      return {
        q: T(`選出正確的字：${s}`, `Choose the right word: ${s}`),
        ans: ansChoice([right, two ? sup : cmp, two ? wc : ws2]),
        sol: [two ? T('句子在比較兩個（有 than），用比較級。', 'The sentence compares two things (it has "than"), so use the comparative.') : T('句子在全部裡面選出「最」的那一個，用最高級。', 'The sentence picks the one that is the most of all, so use the superlative.'), kind, T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g3-conjunctions',
    grade: 3,
    unit: 'sentences',
    name: T('對等連接詞和從屬連接詞', 'Coordinating and subordinating conjunctions'),
    std: 'CCSS L.3.1h',
    lesson: {
      zh: '<b>對等連接詞</b>（and、but、or、so）連接兩個一樣重要的部分。<b>從屬連接詞</b>（because、when、after、before、if、although）帶出一個說明「為什麼、什麼時候、在什麼條件下」的部分。從屬子句放在句首時，後面要加逗號。',
      en: '<b>Coordinating conjunctions</b> (and, but, or, so) join two equal parts. <b>Subordinating conjunctions</b> (because, when, after, before, if, although) add a part that tells why, when, or under what condition. If that part comes first, put a comma after it.',
      ex: ['I wanted to play, <b>but</b> it was late.', '<b>When</b> the bell rang, we lined up.', 'We stayed in <b>because</b> it was cold.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n, he = k1.he;
      const items = [
        [`We stayed inside ___ it was raining.`, 'because', ['but', 'or'], 'sub'],
        [`___ the bell rang, the class lined up.`, 'When', ['But', 'Or'], 'sub'],
        [`${n} will play outside ___ ${he} finishes ${k1.his} homework.`, 'after', ['but', 'or'], 'sub'],
        [`You can have apple juice ___ orange juice.`, 'or', ['because', 'although'], 'co'],
        [`${n} was tired, ___ ${he} kept running.`, 'but', ['so', 'or'], 'co'],
        [`___ it snows tomorrow, we will build a snowman.`, 'If', ['But', 'So'], 'sub'],
        [`${n} brushed ${k1.his} teeth ___ ${he} went to bed.`, 'before', ['but', 'or'], 'sub'],
        [`___ it was cold, ${n} went swimming.`, 'Although', ['Because', 'So'], 'sub'],
        [`The game was over, ___ we went home.`, 'so', ['but', 'or'], 'co'],
        [`${n} likes math, ___ ${he} loves science even more.`, 'but', ['so', 'because'], 'co'],
        [`${n} smiled ___ ${he} saw the puppy.`, 'when', ['but', 'or'], 'sub'],
      ];
      const [s, right, wr, type] = r.pick(items);
      return {
        q: T(`選出最適合的連接詞：${s}`, `Choose the best conjunction: ${s}`),
        ans: ansChoice([right, ...wr]),
        sol: [type === 'co' ? T(`「${right}」是對等連接詞，連接兩個一樣重要的句子。`, `"${right}" is a coordinating conjunction. It joins two equal parts.`)
          : T(`「${right}」是從屬連接詞，帶出說明「為什麼／什麼時候／在什麼條件下」的部分。`, `"${right}" is a subordinating conjunction. It adds a part that tells why, when, or under what condition.`),
        T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g3-sentence-types',
    grade: 3,
    unit: 'sentences',
    name: T('簡單句、合句、複句', 'Simple, compound and complex sentences'),
    std: 'CCSS L.3.1i',
    lesson: {
      zh: '<b>簡單句</b>：一個完整的想法。<b>合句</b>：兩個完整句子用「逗號 + and / but / so」連起來。<b>複句</b>：一個完整句子 + 一個以 because、when、after、before 開頭的部分。',
      en: 'A <b>simple sentence</b> has one complete thought. A <b>compound sentence</b> joins two complete sentences with a comma and and / but / so. A <b>complex sentence</b> has a complete sentence plus a part that starts with because, when, after or before.',
      ex: ['Mia fed the cat. (simple)', 'Mia fed the cat, and Leo walked the dog. (compound)', 'After school ended, Mia fed the cat. (complex)'],
    },
    gen(r) {
      const [a, b, c] = r.sample(NAMES, 3);
      const MAIN = [`${a} fed the cat`, `${a} read a comic book`, `${a} played chess with ${b}`, `we ate lunch outside`, `${a} built a block tower`, `the kids played tag`, `${a} washed the dishes`];
      const OTHER = [`${c} walked the dog`, `${c} drew a picture`, `my dad made soup`, `the baby took a nap`, `${c} watered the plants`];
      const SUB = ['after school ended', 'before the sun went down', 'when we got home', 'after the rain stopped', 'while Dad cooked dinner', 'because it was a sunny day'];
      const m = r.pick(MAIN), o = r.pick(OTHER), sub = r.pick(SUB), type = r.pick(['simple', 'compound', 'complex']);
      const s = type === 'simple' ? `${cap(m)}.` : type === 'compound' ? `${cap(m)}, and ${o}.` : r.chance(0.5) ? `${cap(sub)}, ${m}.` : `${cap(m)} ${sub}.`;
      const lab = { simple: T('簡單句', 'simple'), compound: T('合句', 'compound'), complex: T('複句', 'complex') };
      const why = type === 'simple' ? T('只有一個完整的想法（一個主詞＋動詞），是簡單句。', 'It has just one complete thought (one subject and verb), so it is simple.')
        : type === 'compound' ? T('兩個完整的句子用「, and」連起來，是合句。', 'Two complete sentences are joined with ", and", so it is compound.')
        : T(`「${sub}」不能自己成為句子，加上一個完整的句子，是複句。`, `"${sub}" cannot stand alone. Together with a complete sentence, it makes a complex sentence.`);
      return {
        text: s,
        q: T('這是哪一種句子？', 'What kind of sentence is this?'),
        ans: ansChoice([lab[type], ...['simple', 'compound', 'complex'].filter((x) => x !== type).map((x) => lab[x])]),
        sol: [why, T('簡單句＝一個想法；合句＝兩個完整句子＋and/but/so；複句＝完整句子＋because/when/after…', 'Simple = one thought. Compound = two complete sentences + and/but/so. Complex = a complete sentence + because/when/after …')],
      };
    },
  },
  {
    id: 'g3-cap-titles',
    grade: 3,
    unit: 'mechanics',
    name: T('標題的大寫', 'Capital letters in titles'),
    std: 'CCSS L.3.2a',
    lesson: {
      zh: '書名、故事名的<b>第一個字</b>、<b>最後一個字</b>和<b>重要的字</b>都要大寫。小字像 a、an、the、and、of、to、in、on、at、for 不在開頭或結尾時，就小寫。',
      en: 'In a title, capitalize the <b>first word</b>, the <b>last word</b> and all the <b>important words</b>. Small words like a, an, the, and, of, to, in, on, at, for stay lowercase unless they come first or last.',
      ex: ['<b>The Secret of the Old Tree</b>', '<b>A Day at the Beach</b>'],
    },
    gen(r) {
      const TT = ['The Lost Kite of Maple Street', 'A Day at the Beach', 'How to Train a Puppy', 'My Trip to the Moon', 'The Secret of the Old Tree', 'The Dragon Who Loved Pizza', 'Ten Tiny Turtles',
        'The Girl in the Yellow Boat', 'Max and the Magic Shoes', 'Under the Big Blue Sky', 'A Song for the Sleepy Bear', 'The Robot on the Roof'];
      const { n } = kid(r);
      if (r.chance(0.5)) {
        const title = r.pick(TT), good = r.pick([`My favorite book is ${title}.`, `${n} read ${title} last night.`, `Our class loves ${title}.`]);
        const ws = words(good), tws = words(title), start = ws.findIndex((t, i) => ws.slice(i, i + tws.length).join(' ').replace(/\.$/, '') === title);
        const cand = tws.map((w, i) => i).filter((i) => !SMALL.includes(tws[i].toLowerCase()));
        const j = r.pick(cand), k = start + j, w = bareW(ws[k]);
        return {
          q: T('句子裡有一本書的書名。點出書名中應該大寫的字。', 'This sentence has a book title in it. Tap the word in the title that needs a capital letter.'),
          ans: ansTap(swapTok(ws, k, w.toLowerCase()), k),
          sol: [j === 0 ? T(`「${w}」是書名的第一個字，一定要大寫。`, `"${w}" is the first word of the title, so it must be a capital.`) : T(`「${w}」是書名裡重要的字，要大寫。`, `"${w}" is an important word in the title, so it gets a capital.`),
            T(`正確的書名：${title}`, `The right title: ${title}`)],
        };
      }
      const title = r.pick(TT.filter((t) => t.split(' ').some((w, i, a) => i > 0 && i < a.length - 1 && SMALL.includes(w.toLowerCase()))));
      const allCap = title.split(' ').map(cap).join(' '), sentence = cap(title.toLowerCase());
      return {
        q: T('哪一個書名的大寫是正確的？', 'Which title uses capital letters correctly?'),
        ans: ansChoice([title, allCap, sentence]),
        sol: [T('第一個字、最後一個字和重要的字大寫；中間的小字（a、the、of、to…）小寫。', 'Capitalize the first word, the last word and the important words. Small words in the middle (a, the, of, to …) stay lowercase.'), T(title, title)],
      };
    },
  },
  {
    id: 'g3-commas-addresses',
    grade: 3,
    unit: 'mechanics',
    name: T('地址裡的逗號', 'Commas in addresses'),
    std: 'CCSS L.3.2b',
    lesson: {
      zh: '寫地址時，<b>城市和州</b>之間要加逗號：Austin<b>,</b> Texas。街道地址後面接城市時，也要加逗號：12 Oak Street<b>,</b> Austin<b>,</b> Texas。',
      en: 'Put a comma <b>between the city and the state</b>: Austin<b>,</b> Texas. When a street address comes before the city, put a comma after it too: 12 Oak Street<b>,</b> Austin<b>,</b> Texas.',
      ex: ['My cousin lives in Denver<b>,</b> Colorado.', 'Send it to 45 Pine Road<b>,</b> Miami<b>,</b> Florida.'],
    },
    gen(r) {
      const { n } = kid(r);
      const [city, state] = r.pick([['Austin', 'Texas'], ['Denver', 'Colorado'], ['Miami', 'Florida'], ['Portland', 'Oregon'], ['Boston', 'Massachusetts'], ['Phoenix', 'Arizona'], ['Seattle', 'Washington'], ['Chicago', 'Illinois'], ['Nashville', 'Tennessee'], ['Atlanta', 'Georgia']]);
      if (r.chance(0.5)) {
        const lead = r.pick([`${n} lives in`, 'My grandma moved to', 'We drove to', 'Our new school is in']);
        return {
          q: T('哪一句的逗號用對了？', 'Which sentence uses the comma correctly?'),
          ans: ansChoice([`${lead} ${city}, ${state}.`, `${lead} ${city} ${state}.`, `${lead}, ${city} ${state}.`]),
          sol: [T('城市和州之間要加逗號。', 'Put a comma between the city and the state.'), T(`${lead} ${city}, ${state}.`, `${lead} ${city}, ${state}.`)],
        };
      }
      const num = r.int(2, 980), street = r.pick(['Oak Street', 'Maple Avenue', 'Pine Road', 'Elm Lane', 'Sunset Drive', 'River Road']);
      const lead = r.pick(['Please send the letter to', `${n}'s new address is`, 'The party is at']);
      return {
        q: T('哪一個地址的逗號用對了？', 'Which address uses commas correctly?'),
        ans: ansChoice([`${lead} ${num} ${street}, ${city}, ${state}.`, `${lead} ${num} ${street} ${city} ${state}.`, `${lead} ${num}, ${street} ${city}, ${state}.`]),
        sol: [T('街道地址和城市之間加逗號，城市和州之間也加逗號。門牌號碼和街名之間不加。', 'Put a comma after the street address and another between the city and the state. No comma between the house number and the street.'),
          T(`${lead} ${num} ${street}, ${city}, ${state}.`, `${lead} ${num} ${street}, ${city}, ${state}.`)],
      };
    },
  },
  {
    id: 'g3-dialogue',
    grade: 3,
    unit: 'mechanics',
    name: T('對話的引號', 'Quotation marks in dialogue'),
    std: 'CCSS L.3.2c',
    lesson: {
      zh: '人物說的話放在<b>引號 " "</b> 裡面。說的話後面的標點（逗號、問號、驚嘆號）放在<b>引號裡面</b>：<b>"I can help," said Mia.</b> 如果先寫誰說，要在 said 後面加逗號：<b>Leo said, "Let\'s go."</b>',
      en: 'Put the exact words someone says inside <b>quotation marks (" ")</b>. The comma, question mark or exclamation mark goes <b>inside</b> the quotation marks: <b>"I can help," said Mia.</b> If the speaker comes first, put a comma after said: <b>Leo said, "Let\'s go."</b>',
      ex: ['"Where is my hat?" asked Ben.', '"Watch out!" shouted Zoe.', 'Mom said, "Dinner is ready."'],
    },
    gen(r) {
      const { n } = kid(r);
      const kind = r.pick(['tell', 'ask', 'shout', 'before']);
      const L = r.pick(['I can help you', "Let's go to the park", 'This soup is hot', 'My cat is sleeping', 'We should share the blocks', 'I finished my book']);
      const Q = r.pick(['Can I play too', 'Where is my jacket', 'Do you want a cookie', 'What time is it', 'Who took my pencil']);
      const E = r.pick(['Look at that rainbow', 'We won', 'Watch out', 'I found it', 'That was amazing']);
      let opts, why;
      if (kind === 'tell') { opts = [`"${L}," said ${n}.`, `"${L}", said ${n}.`, `${L}, said ${n}.`]; why = T('說的話後面的逗號要放在引號裡面。', 'The comma after the spoken words goes inside the quotation marks.'); }
      else if (kind === 'ask') { opts = [`"${Q}?" asked ${n}.`, `"${Q}?," asked ${n}.`, `"${Q}"? asked ${n}.`]; why = T('問號放在引號裡面，問號後面不用再加逗號。', 'The question mark goes inside the quotation marks, and no comma is added after it.'); }
      else if (kind === 'shout') { opts = [`"${E}!" shouted ${n}.`, `"${E}!," shouted ${n}.`, `"${E}"! shouted ${n}.`]; why = T('驚嘆號放在引號裡面，後面不用再加逗號。', 'The exclamation mark goes inside the quotation marks, and no comma is added after it.'); }
      else { opts = [`${n} said, "${L}."`, `${n} said "${L}."`, `${n} said, ${L}.`]; why = T('先寫誰說時，said 後面加逗號，說的話放在引號裡，句號也在引號裡。', 'When the speaker comes first, put a comma after "said". The words and the period go inside the quotation marks.'); }
      return {
        q: T('哪一句對話的標點是正確的？', 'Which sentence punctuates the dialogue correctly?'),
        ans: ansChoice(opts),
        sol: [why, T(opts[0], opts[0])],
      };
    },
  },
  {
    id: 'g3-possessives',
    grade: 3,
    unit: 'mechanics',
    name: T('單數和複數所有格', "Possessives: dog's or dogs'?"),
    std: 'CCSS L.3.2d',
    lesson: {
      zh: '<b>一個</b>主人：加 <b>\'s</b>（the dog\'s bone）。<b>很多個</b>主人而且字尾已經是 s：只加 <b>\'</b>（the dogs\' bones）。複數字尾不是 s（children、men）：加 <b>\'s</b>（the children\'s toys）。',
      en: '<b>One</b> owner: add <b>\'s</b> (the dog\'s bone). <b>More than one</b> owner ending in s: add just <b>\'</b> (the dogs\' bones). A plural that does not end in s (children, men): add <b>\'s</b> (the children\'s toys).',
      ex: ["one girl → the girl's coat", "two girls → the girls' coats", "the children → the children's game"],
    },
    gen(r) {
      const num = r.pick(NUMS.slice(0, 5));
      const REG = [['dog', 'dogs', 'bone'], ['cat', 'cats', 'bowl'], ['bird', 'birds', 'nest'], ['girl', 'girls', 'coat'], ['boy', 'boys', 'bike'], ['teacher', 'teachers', 'desk'], ['baby', 'babies', 'toy'], ['horse', 'horses', 'saddle']];
      const IRR = [['children', 'toy', "children's", ["childrens'", "childs'"]], ['men', 'hat', "men's", ["mens'", "man's"]], ['women', 'bag', "women's", ["womens'", "woman's"]], ['geese', 'feather', "geese's", ["geeses'", "goose's"]]];
      const mode = r.pick(['one', 'many', 'many', 'irr']);
      if (mode === 'irr') {
        const [pl, thing, right, wr] = r.pick(IRR);
        return {
          text: `The ${thing}s belong to the ${pl}.`,
          q: T(`填空：the ___ ${thing}s`, `Fill in: the ___ ${thing}s`),
          ans: ansChoice([right, ...wr]),
          sol: [T(`「${pl}」是複數，但字尾不是 s，所以加 's：${right}。`, `"${pl}" is plural but does not end in s, so add 's: ${right}.`), T(`the ${right} ${thing}s`, `the ${right} ${thing}s`)],
        };
      }
      const [one, pl, thing] = r.pick(REG), sg = mode === 'one';
      const right = sg ? `${one}'s` : `${pl}'`, wr = sg ? [`${pl}'`, pl] : [`${one}'s`, `${pl}'s`];
      const shown = sg ? `The ${thing} belongs to one ${one}.` : `The ${thing}s belong to ${num} ${pl}.`;
      return {
        text: shown,
        q: T(`填空：the ___ ${thing}${sg ? '' : 's'}`, `Fill in: the ___ ${thing}${sg ? '' : 's'}`),
        ans: ansChoice([right, ...wr]),
        sol: [sg ? T(`只有一個 ${one}，所以加 's：${right}。`, `There is only one ${one}, so add 's: ${right}.`) : T(`有很多 ${pl}，字尾已經是 s，所以只加 '：${right}。`, `There is more than one, and "${pl}" already ends in s, so add just ': ${right}.`),
          T(`the ${right} ${thing}${sg ? '' : 's'}`, `the ${right} ${thing}${sg ? '' : 's'}`)],
      };
    },
  },
  {
    id: 'g3-suffixes',
    grade: 3,
    unit: 'words',
    name: T('字尾 -ful、-less、-ly', 'Suffixes -ful, -less, -ly'),
    std: 'CCSS L.3.4b',
    lesson: {
      zh: '<b>字尾</b>加在字的後面會改變意思：<b>-ful</b> = 充滿（hopeful = full of hope）；<b>-less</b> = 沒有（fearless = without fear）；<b>-ly</b> = 以…的方式（quickly = in a quick way）。',
      en: 'A <b>suffix</b> goes at the end of a word and changes its meaning: <b>-ful</b> = full of (hopeful = full of hope); <b>-less</b> = without (fearless = without fear); <b>-ly</b> = in a … way (quickly = in a quick way).',
      ex: ['care<b>ful</b> = full of care', 'care<b>less</b> = without care', 'soft<b>ly</b> = in a soft way'],
    },
    gen(r) {
      const suf = r.pick(['ful', 'less', 'ly']);
      const b = suf === 'ly' ? r.pick(['quick', 'sad', 'loud', 'kind', 'soft', 'slow', 'brave', 'quiet', 'neat'])
        : suf === 'ful' ? r.pick(['hope', 'care', 'help', 'use', 'fear', 'pain', 'color', 'cheer', 'harm', 'power', 'joy'])
        : r.pick(['hope', 'care', 'help', 'use', 'fear', 'pain', 'color', 'harm', 'power', 'sleep', 'spot']);
      const w = b + suf, mean = suf === 'ful' ? `full of ${b}` : suf === 'less' ? `without ${b}` : `in a ${b} way`;
      const why = suf === 'ful' ? T(`-ful 表示「充滿」，${w} = full of ${b}。`, `-ful means "full of", so ${w} = full of ${b}.`)
        : suf === 'less' ? T(`-less 表示「沒有」，${w} = without ${b}。`, `-less means "without", so ${w} = without ${b}.`)
        : T(`-ly 表示「以…的方式」，${w} = in a ${b} way。`, `-ly means "in a … way", so ${w} = in a ${b} way.`);
      if (r.chance(0.5)) {
        const opts = suf === 'ful' ? [mean, `without ${b}`, `${b} again`] : suf === 'less' ? [mean, `full of ${b}`, `${b} again`] : [mean, `not ${b}`, `${b} again`];
        return {
          q: T(`「${w}」是什麼意思？`, `What does "${w}" mean?`),
          ans: ansChoice(opts),
          sol: [why, T(`${b} + ${suf} = ${w}`, `${b} + ${suf} = ${w}`)],
        };
      }
      return {
        q: T(`加上 -ful、-less 或 -ly，打出這個字：${mean} = ___`, `Add -ful, -less or -ly and type the word: ${mean} = ___`),
        ans: ansText([w]),
        sol: [why, T(`${b} + ${suf} = ${w}`, `${b} + ${suf} = ${w}`)],
      };
    },
  },
  {
    id: 'g3-linking-words',
    grade: 3,
    unit: 'paragraphs',
    name: T('連接詞語：because、therefore、since、for example', 'Linking words: because, therefore, since, for example'),
    std: 'CCSS W.3.1c',
    lesson: {
      zh: '<b>because / since</b> 說出原因；<b>therefore</b>（因此）說出結果；<b>for example</b>（例如）舉出例子；<b>also</b> 再加一點。用對連接詞，讀者就知道想法之間的關係。',
      en: '<b>Because / since</b> give a reason. <b>Therefore</b> gives a result. <b>For example</b> gives an example. <b>Also</b> adds more. The right linking word shows how your ideas connect.',
      ex: ['It rained. <b>Therefore</b>, the game was canceled.', 'Some fruits are red. <b>For example</b>, apples are red.', '<b>Since</b> it was late, we went home.'],
    },
    gen(r) {
      const k1 = kid(r), n = k1.n, he = k1.he;
      const items = [
        ['Bats are helpful animals. ___, they eat lots of mosquitoes.', 'For example', ['However', 'Therefore'], 'ex'],
        ['It rained all day. ___, the soccer game was canceled.', 'Therefore', ['For example', 'Since'], 'res'],
        [`${n} stayed inside ___ it was too cold.`, 'because', ['therefore', 'for example'], 'why'],
        [`___ the library was closed, ${n} read at home.`, 'Since', ['Therefore', 'For example'], 'why'],
        [`${n} practiced every day. ___, ${he} won the spelling bee.`, 'Therefore', ['For example', 'Because'], 'res'],
        ['Some fruits are red. ___, apples and strawberries are red.', 'For example', ['Therefore', 'Because'], 'ex'],
        [`${n} wore a raincoat ___ the sky was gray.`, 'because', ['therefore', 'for example'], 'why'],
        [`___ ${n} was sick, ${he} did not go to school.`, 'Since', ['Therefore', 'For example'], 'why'],
        ['Plants need water to live. ___, a plant with no water will dry up.', 'Therefore', ['Because', 'Since'], 'res'],
        ['Our class helps the planet. ___, we recycle paper and cans.', 'For example', ['Therefore', 'Since'], 'ex'],
        [`${n} forgot ${k1.his} lunch. ___, ${he} was hungry all afternoon.`, 'Therefore', ['For example', 'Since'], 'res'],
        ['We planted a garden ___ we wanted fresh vegetables.', 'because', ['therefore', 'for example'], 'why'],
      ];
      const [s, right, wr, type] = r.pick(items);
      const why = { ex: T(`後面那句是前一句的「例子」，所以用 ${right}。`, `The next part gives an example of the idea before it, so use "${right}".`),
        res: T(`後面那句是前面造成的「結果」，所以用 ${right}。`, `The next part is a result of what came before, so use "${right}".`),
        why: T(`這部分在說「原因」，所以用 ${right}。`, `This part gives the reason, so use "${right}".`) }[type];
      return {
        q: T('空格要填哪個連接詞語？', 'Which linking word or phrase fits the blank?'),
        text: s,
        ans: ansChoice([right, ...wr]),
        sol: [why, T(s.replace('___', right), s.replace('___', right))],
      };
    },
  },
  {
    id: 'g3-topic-sentence',
    grade: 3,
    unit: 'paragraphs',
    name: T('找出最好的主題句', 'Choosing a topic sentence'),
    std: 'CCSS W.3.2a',
    lesson: {
      zh: '<b>主題句</b>是段落的第一句，告訴讀者整段在講什麼。它要<b>夠大</b>，能包住下面所有的細節，但不能離題。',
      en: 'A <b>topic sentence</b> is usually the first sentence of a paragraph. It tells what the whole paragraph is about. It must be <b>big enough</b> to cover all the details, and it must stay on topic.',
      ex: ['<b>Bees are very busy insects.</b> They fly from flower to flower. They collect nectar. They make honey in their hive.'],
    },
    gen(r) {
      const P = [
        ['Penguins have smart ways to stay warm.', ['They have thick feathers that keep out the cold.', 'A layer of fat under their skin holds in heat.', 'They huddle close together during storms.'], 'Penguins have black and white feathers.'],
        ['Recess is an important part of the school day.', ['Kids can run and stretch their legs.', 'They can play games with their friends.', 'After recess, it is easier to pay attention in class.'], 'Some kids play tag at recess.'],
        ['Bees are very busy insects.', ['They fly from flower to flower all day.', 'They collect pollen and nectar.', 'They make honey in their hive.'], 'Bees have six legs.'],
        ["My grandma's garden is a wonderful place.", ['Tall sunflowers grow along the fence.', 'Tomatoes and beans grow in neat rows.', 'Butterflies visit the flowers every morning.'], 'Grandma has a green hose.'],
        ['Saturday is the best day of my week.', ['I can sleep late in the morning.', 'My family makes pancakes together.', 'In the afternoon, I play soccer with my friends.'], 'I like to eat pancakes.'],
        ['There are many ways kids can help at home.', ['They can set the table for dinner.', 'They can feed the family pet.', 'They can put away their toys.'], 'Some kids have a pet dog.'],
        ['Desert animals have clever ways to stay cool.', ['Many hide under rocks during the hot day.', 'Some come out only at night.', 'Desert foxes have big ears that let out heat.'], 'The desert gets very little rain.'],
        ['Trees are helpful to people and animals.', ['They give us shade on hot days.', 'Birds and squirrels make their homes in them.', 'Many trees give us fruit to eat.'], 'Some trees are very tall.'],
      ];
      const i = r.int(0, P.length - 1), [ts, det, narrow] = P[i], other = P[r.pick([...Array(P.length).keys()].filter((x) => x !== i))][0];
      const text = '___ ' + r.shuffle(det).join(' ');
      return {
        text,
        q: T('哪一句最適合放在段落開頭當主題句？', 'Which sentence is the best topic sentence for this paragraph?'),
        ans: ansChoice([ts, narrow, other]),
        sol: [T(`「${ts}」說出了整段的大意，可以包住所有的細節。`, `"${ts}" tells the main idea and covers all the details.`),
          T(`「${narrow}」太小或沒有講到重點；「${other}」講的是別的主題。`, `"${narrow}" is too small or misses the main idea, and "${other}" is about a different topic.`)],
        hint: T('哪一句能包住下面「所有」的句子？', 'Which sentence covers ALL the other sentences?'),
      };
    },
  },
  {
    id: 'g3-paragraph-order',
    grade: 3,
    unit: 'organization',
    name: T('段落的順序：主題句、細節、結尾', 'Paragraph order: topic, details, ending'),
    std: 'CCSS W.3.2',
    lesson: {
      zh: '一個好段落的順序是：<b>主題句</b>（說出大意）→ <b>細節</b>（用 First、Also、Next、Finally 連接）→ <b>結尾句</b>（把大意再說一次或說出感想）。',
      en: 'A good paragraph goes in this order: the <b>topic sentence</b> (the main idea) → the <b>details</b> (linked with First, Also, Next, Finally) → the <b>closing sentence</b> (says the main idea again or shares a feeling).',
      ex: ['Winter is a great season. First, … Also, … Finally, … That is why I love winter.'],
    },
    gen(r) {
      const LIST = [['First', 'Also', 'Finally'], ['To begin', 'In addition', 'Last of all'], ['First of all', 'Also', 'Most of all']];
      const SEQ = [['First', 'Next', 'Then'], ['First', 'After that', 'Finally'], ['To start', 'Next', 'Last']];
      const P = [
        ['My dog Rusty is my best friend.', ['he waits for me at the door after school', 'he sleeps at the foot of my bed', 'he cheers me up when I am sad'], 'I am lucky to have a friend like Rusty.', LIST],
        ['Planting a seed is easy if you follow the steps.', ['fill a cup with soil', 'push the seed into the soil', 'water it and set it in the sun'], 'Soon you will see a tiny green sprout!', SEQ],
        ['Our class trip to the farm was so much fun.', ['we fed the goats', 'we picked apples from the trees', 'we rode home on a wagon full of hay'], 'I hope we go back next year!', SEQ],
        ['Sharks are amazing ocean animals.', ['they have rows of sharp teeth', 'many sharks grow new teeth all their lives', 'sharks have lived on Earth since before the dinosaurs'], 'There is so much to learn about sharks.', LIST],
        ['My morning routine helps me get ready for school.', ['I make my bed', 'I eat a healthy breakfast', 'I pack my backpack and put on my shoes'], 'When I follow my routine, I am never late!', SEQ],
        ['Winter is a great season.', ['we can build snow forts', 'we drink hot cocoa by the fire', 'we get a long winter break'], 'That is why I love winter.', LIST],
        ['Recycling helps our planet.', ['it means less trash goes to landfills', 'old cans can be turned into new cans', 'recycling paper saves trees'], 'Everyone should recycle!', LIST],
      ];
      const [ts, det, end, sets] = r.pick(P), tw = r.pick(sets);
      const items = [ts, ...det.map((d, i) => `${tw[i]}, ${d}.`), end];
      return {
        q: T('把句子排成一個通順的段落。', 'Put the sentences in order to make a paragraph.'),
        ans: ansOrder(items),
        sol: [T('主題句放第一句，接著用順序詞排細節，最後是結尾句。', 'The topic sentence goes first, then the details in order (look at the linking words), and the closing sentence goes last.'),
          T(`正確順序：${items.join(' ')}`, `The right order: ${items.join(' ')}`)],
      };
    },
  },
);

// =====================================================================
// WRITING PROMPTS
// =====================================================================
const CAP_END = T('每個句子都用大寫字母開頭，用 . ? ! 結尾。', 'Each sentence starts with a capital letter and ends with . ? or !');
const prompts = [
  // ---------------- Grade 1 ----------------
  {
    id: 'w1-narrative-fun-day',
    grade: 1,
    genre: 'narrative',
    std: 'CCSS W.1.3',
    title: T('快樂的一天', 'A fun day'),
    topics: [T('在公園', 'at the park'), T('在海邊', 'at the beach'), T('在生日派對上', 'at a birthday party'), T('在下雪天', 'on a snowy day'), T('在奶奶家', "at Grandma's house")],
    prompt: T('寫一寫你{t}度過的快樂的一天。先發生什麼、接著發生什麼、最後發生什麼？你覺得怎麼樣？', 'Write about a fun day {t}. What happened first, next and last? How did you feel?'),
    plan: [
      { label: T('誰？在哪裡？', 'Who? Where?'), hint: T('One day, I went …', 'One day, I went …') },
      { label: T('首先', 'First'), hint: T('First, I …', 'First, I …') },
      { label: T('接著', 'Next'), hint: T('Next, we …', 'Next, we …') },
      { label: T('最後', 'Last'), hint: T('Last, …', 'Last, …') },
      { label: T('我的感覺', 'How I felt'), hint: T('I felt …', 'I felt …') },
    ],
    starters: ['One day, I went to …', 'First, I …', 'Next, we …', 'Then, …', 'Last, …', 'I felt so happy because …'],
    words: [20, 60],
    checklist: [
      T('我寫了誰和在哪裡。', 'I told who and where.'),
      T('我用了 First、Next、Last。', 'I used First, Next and Last.'),
      T('我寫了我的感覺。', 'I told how I felt.'),
      CAP_END,
      T('I（我）都是大寫。', 'I wrote "I" as a capital letter.'),
    ],
    mentor: {
      title: 'My Day at the Park',
      text: 'On Saturday, I went to the park with my dad.\n\nFirst, I went down the big red slide. Next, we fed the ducks some bread. Then, Dad pushed me on the swing. Last, we ate ice cream on a bench.\n\nI felt so happy. It was the best day!',
      note: T('先說誰和在哪裡，再用 First、Next、Then、Last 照順序寫，最後說出感覺。', 'It tells who and where, then uses First, Next, Then and Last to tell the events in order, and ends with a feeling.'),
    },
    vocab: ['first', 'next', 'then', 'last', 'happy', 'fun'],
  },
  {
    id: 'w1-narrative-make-believe',
    grade: 1,
    genre: 'narrative',
    std: 'CCSS W.1.3',
    title: T('想像的故事', 'A make-believe story'),
    topics: [T('如果你會飛', 'if you could fly'), T('如果你的玩具活過來', 'if your toy came alive'), T('如果你遇到一隻友善的龍', 'if you met a friendly dragon'), T('如果你住在月亮上', 'if you lived on the moon'), T('如果你的寵物會說話', 'if your pet could talk')],
    prompt: T('想像一下，{t}會發生什麼事？寫一個短短的想像故事。', 'What would happen {t}? Write a short make-believe story.'),
    plan: [
      { label: T('開始', 'Beginning'), hint: T('One day, …', 'One day, …') },
      { label: T('發生了什麼', 'What happened'), hint: T('Then, …', 'Then, …') },
      { label: T('結束', 'Ending'), hint: T('At the end, …', 'At the end, …') },
    ],
    starters: ['One day, …', 'I could not believe it!', 'Then, …', 'After that, …', 'At the end, …', 'It was the best day ever!'],
    words: [20, 60],
    checklist: [
      T('我的故事有開始、中間和結束。', 'My story has a beginning, a middle and an end.'),
      T('我用了 Then 或 After that 這類的字。', 'I used words like "then" or "after that".'),
      T('我用了一個形容詞（big、funny…）。', 'I used a describing word (big, funny …).'),
      CAP_END,
    ],
    mentor: {
      title: 'My Toy Bear',
      text: 'One night, my toy bear Coco woke up! She jumped off my bed and said, "Let\'s play!"\n\nThen, we built a tall tower with my blocks. After that, we had a tea party with cookies.\n\nAt the end, Coco gave me a big hug. Then she climbed back on my bed and fell asleep.',
      note: T('故事有清楚的開始、中間、結束，還用了 Then、After that 把事情連起來。', 'The story has a clear beginning, middle and end, and words like Then and After that link the events.'),
    },
    vocab: ['one day', 'then', 'after that', 'at the end', 'magic', 'surprise'],
  },
  {
    id: 'w1-opinion-favorite',
    grade: 1,
    genre: 'opinion',
    std: 'CCSS W.1.1',
    title: T('我最喜歡的…', 'My favorite thing'),
    topics: [T('食物', 'food'), T('動物', 'animal'), T('玩具', 'toy'), T('顏色', 'color'), T('玩的地方', 'place to play')],
    prompt: T('你最喜歡的{t}是什麼？說出你的看法，再說一兩個理由。', 'What is your favorite {t}? Tell your opinion and give one or two reasons.'),
    plan: [
      { label: T('我最喜歡的', 'My favorite'), hint: T('My favorite … is …', 'My favorite … is …') },
      { label: T('理由', 'Reason'), hint: T('I like it because …', 'I like it because …') },
      { label: T('另一個理由', 'Another reason'), hint: T('Also, …', 'Also, …') },
      { label: T('結尾', 'Ending'), hint: T('That is why …', 'That is why …') },
    ],
    starters: ['My favorite … is …', 'I like it because …', 'Also, …', 'That is why I love …'],
    words: [20, 50],
    checklist: [
      T('我說出了我最喜歡的東西。', 'I told my favorite thing.'),
      T('我用了 because 說理由。', 'I used "because" to give a reason.'),
      T('我有結尾的句子。', 'I wrote an ending sentence.'),
      CAP_END,
      T('我把字和字之間空開。', 'I left spaces between my words.'),
    ],
    mentor: {
      title: 'My Favorite Food',
      text: 'My favorite food is dumplings. I like them because they are warm and juicy. Also, my grandma and I make them together. That is why dumplings are the best food!',
      note: T('第一句就說出看法，接著用 because 和 Also 給兩個理由，最後再說一次。', 'The first sentence tells the opinion. "Because" and "Also" give two reasons, and the last sentence says it again.'),
    },
    vocab: ['favorite', 'because', 'also', 'best', 'love'],
  },
  {
    id: 'w1-howto-steps',
    grade: 1,
    genre: 'procedural',
    std: 'CCSS W.1.2',
    title: T('教你怎麼做', 'How to do it'),
    topics: [T('做三明治', 'make a sandwich'), T('洗手', 'wash your hands'), T('餵寵物', 'feed a pet'), T('種種子', 'plant a seed'), T('準備睡覺', 'get ready for bed')],
    prompt: T('教別人怎麼{t}。把步驟照順序寫出來。', 'Tell how to {t}. Write the steps in order.'),
    plan: [
      { label: T('要做什麼', 'What we will do'), hint: T('Here is how to …', 'Here is how to …') },
      { label: T('步驟一', 'Step 1'), hint: T('First, …', 'First, …') },
      { label: T('步驟二', 'Step 2'), hint: T('Next, …', 'Next, …') },
      { label: T('步驟三', 'Step 3'), hint: T('Last, …', 'Last, …') },
    ],
    starters: ['Here is how to …', 'You will need …', 'First, …', 'Next, …', 'Then, …', 'Last, …'],
    words: [20, 60],
    checklist: [
      T('我先說要教什麼。', 'I told what I will teach.'),
      T('我的步驟照順序寫。', 'My steps are in order.'),
      T('我用了 First、Next、Last。', 'I used First, Next and Last.'),
      CAP_END,
    ],
    mentor: {
      title: 'How to Plant a Seed',
      text: 'Here is how to plant a seed. You will need a cup, some dirt and a seed.\n\nFirst, fill the cup with dirt. Next, push the seed into the dirt with your finger. Then, give it a little water. Last, put the cup in the sun. Soon you will see a plant!',
      note: T('先說要做什麼和需要的東西，再用順序詞一步一步寫。', 'It tells what we will do and what we need, then gives each step with an order word.'),
    },
    vocab: ['first', 'next', 'then', 'last', 'you will need'],
  },
  {
    id: 'w1-letter-thank-you',
    grade: 1,
    genre: 'letter',
    std: 'Grade 1 · Writing',
    title: T('一封感謝信', 'A thank-you letter'),
    topics: [T('你的老師', 'your teacher'), T('一個朋友', 'a friend'), T('爺爺奶奶或外公外婆', 'your grandma or grandpa'), T('學校裡幫助你的人', 'a helper at your school'), T('家裡的一個人', 'someone in your family')],
    prompt: T('寫一封感謝信給{t}。謝謝他們做了什麼，並說說你的感覺。', 'Write a thank-you letter to {t}. Say thank you for something they did and how it made you feel.'),
    plan: [
      { label: T('稱呼', 'Greeting'), hint: T('Dear …,', 'Dear …,') },
      { label: T('謝謝什麼', 'Thank you for'), hint: T('Thank you for …', 'Thank you for …') },
      { label: T('我的感覺', 'How I feel'), hint: T('It made me feel …', 'It made me feel …') },
      { label: T('結尾和署名', 'Closing and name'), hint: T('Love, (your name)', 'Love, (your name)') },
    ],
    starters: ['Dear …,', 'Thank you for …', 'It made me feel …', 'You are so kind.', 'Love,', 'Your friend,'],
    words: [20, 50],
    checklist: [
      T('我用 Dear 開頭，名字後面加逗號。', 'I started with "Dear" and a comma after the name.'),
      T('我說了謝謝什麼。', 'I said what I am thankful for.'),
      T('我寫了我的感覺。', 'I told how I feel.'),
      T('我有結尾（Love,）和我的名字。', 'I wrote a closing (Love,) and my name.'),
      CAP_END,
    ],
    mentor: {
      title: 'Thank You, Ms. Park',
      text: 'Dear Ms. Park,\n\nThank you for reading us the funny frog book. I laughed so hard! It made me feel happy all day. You are a great teacher.\n\nLove,\nAva',
      note: T('有稱呼、說明謝謝什麼、寫出感覺，最後有結尾和名字。', 'It has a greeting, says what the thank-you is for, tells a feeling, and ends with a closing and a name.'),
    },
    vocab: ['Dear', 'thank you', 'kind', 'happy', 'Love', 'Your friend'],
  },
  {
    id: 'w1-descriptive-senses',
    grade: 1,
    genre: 'descriptive',
    std: 'Grade 1 · Writing',
    title: T('用五感來描寫', 'Describe it with your senses'),
    topics: [T('你的寵物（或你想養的寵物）', 'your pet (or a pet you want)'), T('你的房間', 'your bedroom'), T('下雨天', 'a rainy day'), T('好吃的點心', 'a yummy snack'), T('你最喜歡的玩具', 'your favorite toy')],
    prompt: T('描寫{t}。用看到、聽到、聞到、摸到或嚐到的字。', 'Describe {t}. Use words for what you see, hear, smell, touch or taste.'),
    plan: [
      { label: T('我要寫的', 'What I will describe'), hint: T('My … is …', 'My … is …') },
      { label: T('看到', 'I see'), hint: T('It looks …', 'It looks …') },
      { label: T('聽到／聞到', 'I hear / smell'), hint: T('It sounds … / It smells …', 'It sounds … / It smells …') },
      { label: T('摸到／嚐到', 'I feel / taste'), hint: T('It feels … / It tastes …', 'It feels … / It tastes …') },
    ],
    starters: ['My … is …', 'It looks …', 'It sounds like …', 'It smells …', 'It feels …', 'It tastes …'],
    words: [20, 60],
    checklist: [
      T('我用了至少兩種感官（看、聽、聞、摸、嚐）。', 'I used at least two senses (see, hear, smell, touch, taste).'),
      T('我用了形容詞（soft、red、loud…）。', 'I used describing words (soft, red, loud …).'),
      CAP_END,
      T('我寫的都是同一個東西。', 'All my sentences are about the same thing.'),
    ],
    mentor: {
      title: 'My Cat Mochi',
      text: 'My cat Mochi is white and fluffy. She has green eyes and a pink nose. Her fur feels soft like a pillow. When she is happy, she purrs like a little motor. She smells like clean sheets. I love my cat!',
      note: T('用了看到（white、green eyes）、摸到（soft）、聽到（purrs）、聞到（smells）的字，讓讀者好像看得到小貓。', 'It uses words for seeing (white, green eyes), touching (soft), hearing (purrs) and smelling, so the reader can picture the cat.'),
    },
    vocab: ['soft', 'loud', 'shiny', 'fluffy', 'sweet', 'bumpy', 'looks like'],
  },
  {
    id: 'w1-poem-acrostic',
    grade: 1,
    genre: 'poem',
    std: 'Grade 1 · Writing',
    title: T('藏頭詩', 'An acrostic poem'),
    topics: [T('SUN（太陽）', 'SUN'), T('CAT（貓）', 'CAT'), T('DOG（狗）', 'DOG'), T('FISH（魚）', 'FISH'), T('RAIN（雨）', 'RAIN'), T('BEE（蜜蜂）', 'BEE')],
    prompt: T('用 {t} 寫一首藏頭詩。把這個字直直地寫下來，每一行用一個字母開頭，寫一個和它有關的字或句子。', 'Write an acrostic poem for {t}. Write the word going down. Start each line with one of its letters, and write a word or sentence about it.'),
    plan: [
      { label: T('寫下這個字', 'Write the word going down'), hint: T('C / A / T', 'C / A / T') },
      { label: T('想一想相關的字', 'Think of words about it'), hint: T('它長什麼樣子？會做什麼？', 'What does it look like? What does it do?') },
      { label: T('每一行寫一個想法', 'One idea on each line'), hint: T('Cuddly and warm …', 'Cuddly and warm …') },
    ],
    starters: ['Soft and …', 'Always …', 'Loves to …', 'Nice and …', 'Up in the …'],
    words: [10, 40],
    checklist: [
      T('每一行的第一個字母合起來就是這個字。', 'The first letters of my lines spell the word.'),
      T('每一行都和這個主題有關。', 'Every line is about my topic.'),
      T('我用了形容詞。', 'I used describing words.'),
      T('每一行的第一個字母大寫。', 'Each line starts with a capital letter.'),
    ],
    mentor: {
      title: 'CAT',
      text: 'Cuddly and warm on my lap,\nAlways ready for a nap,\nTiny paws that tap, tap, tap.',
      note: T('每一行的第一個字母拼出 CAT，每一行都在說貓，還有押韻（lap、nap、tap）。', 'The first letters spell CAT, every line is about a cat, and the lines even rhyme (lap, nap, tap).'),
    },
    vocab: ['soft', 'warm', 'bright', 'tiny', 'happy', 'loves'],
  },
  {
    id: 'w1-research-three-facts',
    grade: 1,
    genre: 'research',
    std: 'CCSS W.1.7',
    title: T('三個事實', 'Three facts'),
    topics: [T('青蛙', 'frogs'), T('蜜蜂', 'bees'), T('企鵝', 'penguins'), T('月亮', 'the moon'), T('蘋果', 'apples'), T('鯨魚', 'whales')],
    prompt: T('和大人一起讀一本書或查資料，了解{t}。寫出三個真實的事實。', 'Read a book or look it up with a grown-up to learn about {t}. Write three true facts.'),
    plan: [
      { label: T('主題', 'My topic'), hint: T('… are …', '… are …') },
      { label: T('事實一', 'Fact 1'), hint: T('They …', 'They …') },
      { label: T('事實二', 'Fact 2'), hint: T('They can …', 'They can …') },
      { label: T('事實三', 'Fact 3'), hint: T('They have …', 'They have …') },
      { label: T('結尾', 'Ending'), hint: T('I think … are …', 'I think … are …') },
    ],
    starters: ['Did you know …?', '… are …', 'They can …', 'They have …', 'They live …', 'I think … are amazing.'],
    words: [20, 60],
    checklist: [
      T('我寫了三個真實的事實。', 'I wrote three true facts.'),
      T('每個事實都和我的主題有關。', 'Every fact is about my topic.'),
      T('我寫了結尾的句子。', 'I wrote an ending sentence.'),
      CAP_END,
    ],
    mentor: {
      title: 'All About Frogs',
      text: 'Frogs are amazing animals. They start life as tadpoles in the water. Frogs catch bugs with their long, sticky tongues. Many frogs can jump far with their strong back legs. I think frogs are so cool!',
      note: T('第一句說主題，中間是三個真的事實，最後一句說出想法。', 'The first sentence names the topic, the middle gives three true facts, and the last sentence shares a thought.'),
    },
    vocab: ['fact', 'did you know', 'they can', 'they have', 'amazing'],
  },
  {
    id: 'w1-literary-favorite-part',
    grade: 1,
    genre: 'literary',
    std: 'CCSS W.1.1',
    title: T('故事裡我最喜歡的部分', 'My favorite part of a story'),
    topics: [T('三隻小豬', 'The Three Little Pigs'), T('金髮女孩和三隻熊', 'Goldilocks and the Three Bears'), T('龜兔賽跑', 'The Tortoise and the Hare'), T('薑餅人', 'The Gingerbread Man'), T('小紅母雞', 'The Little Red Hen')],
    prompt: T('想一想《{t}》這個故事。你最喜歡哪個角色或哪個部分？為什麼？', 'Think about the story "{t}". Who is your favorite character, or what is your favorite part? Tell why.'),
    plan: [
      { label: T('故事名稱', 'The story'), hint: T('I read …', 'I read …') },
      { label: T('我最喜歡的', 'My favorite'), hint: T('My favorite part is …', 'My favorite part is …') },
      { label: T('為什麼', 'Why'), hint: T('I like it because …', 'I like it because …') },
      { label: T('結尾', 'Ending'), hint: T('You should read it!', 'You should read it!') },
    ],
    starters: ['I read …', 'My favorite character is …', 'My favorite part is when …', 'I like it because …', 'You should read it!'],
    words: [20, 60],
    checklist: [
      T('我寫出了故事的名字。', 'I named the story.'),
      T('我說了最喜歡的角色或部分。', 'I told my favorite character or part.'),
      T('我用 because 說理由。', 'I used "because" to tell why.'),
      CAP_END,
    ],
    mentor: {
      title: 'The Three Little Pigs',
      text: 'I read The Three Little Pigs. My favorite part is when the wolf huffs and puffs at the brick house. He blows and blows, but the house does not fall down! I like this part because the smart pig is safe. You should read it!',
      note: T('先說故事名稱，再說最喜歡的部分，用 because 說理由，最後推薦給別人。', 'It names the story, tells the favorite part, gives a reason with "because", and ends by telling others to read it.'),
    },
    vocab: ['character', 'favorite part', 'because', 'funny', 'smart'],
  },

  // ---------------- Grade 2 ----------------
  {
    id: 'w2-personal-small-moment',
    grade: 2,
    genre: 'personal',
    std: 'CCSS W.2.3',
    title: T('我的小故事：真實的一刻', 'A small moment from my life'),
    topics: [T('你學會一件新事情的時候', 'a time you learned something new'), T('你覺得很驕傲的時候', 'a time you felt proud'), T('你幫助別人的時候', 'a time you helped someone'), T('你很驚訝的時候', 'a time you were surprised'), T('你嘗試一件很難的事的時候', 'a time you tried something hard')],
    prompt: T('寫一個真實的故事，關於{t}。照順序寫，加上細節和你的感覺。', 'Write a true story about {t}. Tell the events in order with details and your feelings.'),
    plan: [
      { label: T('開頭：什麼時候、在哪裡', 'Beginning: when and where'), hint: T('Last summer, I …', 'Last summer, I …') },
      { label: T('第一件事', 'First event'), hint: T('First, …', 'First, …') },
      { label: T('接下來', 'Next event'), hint: T('Then, …', 'Then, …') },
      { label: T('最後', 'Last event'), hint: T('Finally, …', 'Finally, …') },
      { label: T('感覺和結尾', 'Feeling and ending'), hint: T('I felt … because …', 'I felt … because …') },
    ],
    starters: ['Last summer, …', 'One afternoon, …', 'At first, I was …', 'Then, …', 'Finally, …', 'I felt … because …', 'Now I know …'],
    words: [40, 100],
    checklist: [
      T('開頭說了什麼時候、在哪裡。', 'My beginning tells when and where.'),
      T('事情照順序寫。', 'My events are in order.'),
      T('我用了時間詞（first、then、finally）。', 'I used time words (first, then, finally).'),
      T('我寫了我的感覺。', 'I told my feelings.'),
      T('我有一個結尾。', 'I have an ending.'),
      CAP_END,
    ],
    mentor: {
      title: 'Riding Without Training Wheels',
      text: 'Last summer, my dad took the training wheels off my bike. At first, I was scared. My legs were shaking!\n\nDad held the back of my seat, and I started to pedal. Then, he let go, but I did not know it. I rode all the way to the big tree by myself.\n\nFinally, I turned around and saw Dad cheering. I felt so proud. Now I ride my bike every weekend.',
      note: T('開頭說什麼時候、發生什麼，中間用 Then、Finally 照順序寫，還寫出害怕和驕傲的感覺。', 'The beginning tells when and what, the middle uses Then and Finally to keep events in order, and it shows feelings (scared, proud).'),
    },
    vocab: ['at first', 'then', 'after that', 'finally', 'proud', 'nervous', 'excited'],
  },
  {
    id: 'w2-narrative-make-believe',
    grade: 2,
    genre: 'narrative',
    std: 'CCSS W.2.3',
    title: T('想像故事', 'A make-believe story'),
    topics: [T('一隻找路回家的小狗', 'a lost puppy who finds its way home'), T('一個想交朋友的機器人', 'a robot who wants a friend'), T('一個縮小到像螞蟻一樣大的小孩', 'a kid who shrinks to the size of an ant'), T('一個神奇的書包', 'a magic backpack'), T('一朵想下來玩的雲', 'a cloud who wants to come down and play')],
    prompt: T('寫一個關於{t}的想像故事。要有開頭、問題、解決方法和結尾。', 'Write a make-believe story about {t}. Give it a beginning, a problem, a solution and an ending.'),
    plan: [
      { label: T('角色和地點', 'Character and place'), hint: T('Once upon a time, …', 'Once upon a time, …') },
      { label: T('問題', 'Problem'), hint: T('One day, …', 'One day, …') },
      { label: T('想辦法', 'Trying to fix it'), hint: T('So, …', 'So, …') },
      { label: T('結尾', 'Ending'), hint: T('In the end, …', 'In the end, …') },
    ],
    starters: ['Once upon a time, …', 'One day, …', 'Oh no! …', 'So, …', 'Just then, …', 'In the end, …'],
    words: [40, 100],
    checklist: [
      T('故事有角色和地點。', 'My story has a character and a place.'),
      T('故事有一個問題和解決方法。', 'My story has a problem and a solution.'),
      T('我用了時間詞連接事件。', 'I used time words to link events.'),
      T('我的結尾讓故事結束。', 'My ending wraps up the story.'),
      CAP_END,
    ],
    mentor: {
      title: 'Bolt Finds a Friend',
      text: 'Once upon a time, a little robot named Bolt lived in a toy shop. Bolt wanted a friend, but all the other toys were asleep.\n\nOne day, Bolt saw a teddy bear on a high shelf. "Will you be my friend?" Bolt asked. The bear was stuck and could not get down. So, Bolt stacked some blocks and climbed up to help.\n\nIn the end, the bear hugged Bolt. Now they play together every night after the shop closes.',
      note: T('故事有角色、問題（沒有朋友、熊卡住了）、解決方法（疊積木）和溫暖的結尾。', 'It has a character, a problem (no friend, the bear is stuck), a solution (stacking blocks) and a warm ending.'),
    },
    vocab: ['once upon a time', 'one day', 'suddenly', 'so', 'in the end'],
  },
  {
    id: 'w2-opinion-should',
    grade: 2,
    genre: 'opinion',
    std: 'CCSS W.2.1',
    title: T('你同意嗎？', 'Do you agree?'),
    topics: [T('每個小孩養寵物', 'every kid have a pet'), T('下課時間更長', 'recess be longer'), T('小孩幫忙煮晚餐', 'kids help cook dinner'), T('每間教室有閱讀角', 'every classroom have a reading corner'), T('小孩自己決定睡覺時間', 'kids pick their own bedtime')],
    prompt: T('應不應該讓{t}？寫出你的看法，給兩個理由，最後寫結論。', 'Should {t}? Write your opinion, give two reasons, and write a closing.'),
    plan: [
      { label: T('我的看法', 'My opinion'), hint: T('I think … should …', 'I think … should …') },
      { label: T('理由一', 'Reason 1'), hint: T('One reason is …', 'One reason is …') },
      { label: T('理由二', 'Reason 2'), hint: T('Also, …', 'Also, …') },
      { label: T('結論', 'Closing'), hint: T('That is why …', 'That is why …') },
    ],
    starters: ['I think …', 'I do not think …', 'One reason is …', 'Another reason is …', 'Also, …', 'That is why …'],
    words: [40, 100],
    checklist: [
      T('第一句清楚說出我的看法。', 'My first sentence clearly tells my opinion.'),
      T('我給了兩個理由。', 'I gave two reasons.'),
      T('我用了 because、also、another 這類連接詞。', 'I used linking words like because, also, another.'),
      T('最後一句再說一次我的看法。', 'My last sentence says my opinion again.'),
      CAP_END,
    ],
    mentor: {
      title: 'Recess Should Be Longer',
      text: 'I think recess should be longer. One reason is that kids need to move. After sitting all morning, my legs want to run!\n\nAnother reason is that recess helps us make friends. We learn to share and take turns when we play games together.\n\nThat is why I think recess should be longer. Our school would be a happier place!',
      note: T('先說看法，兩個理由各有一句細節，最後把看法再說一次。', 'It states the opinion, gives two reasons with a detail each, and says the opinion again at the end.'),
    },
    vocab: ['I think', 'one reason', 'another reason', 'also', 'because', 'that is why'],
  },
  {
    id: 'w2-informative-all-about',
    grade: 2,
    genre: 'informative',
    std: 'CCSS W.2.2',
    title: T('動物大百科', 'All about an animal'),
    topics: [T('貓頭鷹', 'owls'), T('海龜', 'sea turtles'), T('瓢蟲', 'ladybugs'), T('大象', 'elephants'), T('海豚', 'dolphins')],
    prompt: T('寫一篇關於{t}的介紹。說說牠們長什麼樣子、住在哪裡、吃什麼。', 'Write an "All About" piece on {t}. Tell what they look like, where they live and what they eat.'),
    plan: [
      { label: T('主題句', 'Topic sentence'), hint: T('… are amazing animals.', '… are amazing animals.') },
      { label: T('長相', 'What they look like'), hint: T('They have …', 'They have …') },
      { label: T('住在哪裡', 'Where they live'), hint: T('They live …', 'They live …') },
      { label: T('吃什麼', 'What they eat'), hint: T('They eat …', 'They eat …') },
      { label: T('結尾', 'Closing'), hint: T('Now you know …', 'Now you know …') },
    ],
    starters: ['… are amazing animals.', 'They have …', 'They live in …', 'They eat …', 'Did you know …?', 'Now you know …'],
    words: [40, 100],
    checklist: [
      T('我有一個主題句說出主題。', 'I have a topic sentence that names my topic.'),
      T('我寫了長相、住處和食物的事實。', 'I gave facts about looks, home and food.'),
      T('我只寫事實，不寫想像的事。', 'I wrote facts, not make-believe.'),
      T('我有結尾句。', 'I have a closing sentence.'),
      CAP_END,
    ],
    mentor: {
      title: 'All About Owls',
      text: 'Owls are amazing birds that hunt at night. They have big eyes that help them see in the dark. They can turn their heads very far to look around. Their soft feathers let them fly without a sound.\n\nOwls live in forests, deserts and even barns. They eat mice, insects and other small animals.\n\nNow you know why owls are such good night hunters!',
      note: T('開頭說出主題，再分別寫長相、住處、食物的事實，最後用一句結尾。', 'It names the topic, gives facts about looks, home and food, and ends with a closing sentence.'),
    },
    vocab: ['did you know', 'they have', 'they live', 'they eat', 'also', 'now you know'],
  },
  {
    id: 'w2-procedural-how-to',
    grade: 2,
    genre: 'procedural',
    std: 'CCSS W.2.2',
    title: T('一步一步教你做', 'Step-by-step how-to'),
    topics: [T('做一把紙扇', 'make a paper fan'), T('擺餐桌', 'set the table'), T('照顧一盆植物', 'take care of a plant'), T('準備野餐', 'pack for a picnic'), T('玩你最喜歡的遊戲', 'play your favorite game')],
    prompt: T('教讀者怎麼{t}。寫出需要的東西和清楚的步驟。', 'Teach your reader how to {t}. List what they need and write clear steps in order.'),
    plan: [
      { label: T('介紹', 'Introduction'), hint: T('Do you want to …?', 'Do you want to …?') },
      { label: T('需要的東西', 'Things you need'), hint: T('You will need …', 'You will need …') },
      { label: T('步驟', 'Steps'), hint: T('First, … Next, … Then, …', 'First, … Next, … Then, …') },
      { label: T('結尾', 'Ending'), hint: T('Now you can …', 'Now you can …') },
    ],
    starters: ['Do you want to …?', 'You will need …', 'First, …', 'Next, …', 'After that, …', 'Finally, …', 'Now you can …'],
    words: [40, 100],
    checklist: [
      T('我寫了需要的東西。', 'I listed what you need.'),
      T('步驟照順序寫，每一步都清楚。', 'My steps are in order and easy to follow.'),
      T('我用了順序詞。', 'I used order words.'),
      T('我有一個結尾。', 'I have an ending.'),
      CAP_END,
    ],
    mentor: {
      title: 'How to Make a Paper Fan',
      text: 'Do you want to stay cool on a hot day? You can make a paper fan!\n\nYou will need one sheet of paper, crayons and some tape. First, color a fun pattern on the paper. Next, fold the paper back and forth like a zigzag. After that, pinch one end together and wrap tape around it.\n\nFinally, open the top of your fan. Now you can fan yourself and feel the breeze!',
      note: T('開頭吸引讀者，列出材料，用順序詞寫清楚步驟，最後一句結尾。', 'It hooks the reader, lists the things you need, uses order words for each step and ends with a closing.'),
    },
    vocab: ['you will need', 'first', 'next', 'after that', 'finally', 'carefully'],
  },
  {
    id: 'w2-letter-friendly',
    grade: 2,
    genre: 'letter',
    std: 'Grade 2 · Writing',
    title: T('寫一封友誼信', 'A friendly letter'),
    topics: [T('住在遠方的表兄弟姊妹', 'a cousin who lives far away'), T('你最好的朋友', 'your best friend'), T('國外的筆友', 'a pen pal in another country'), T('以前的老師', 'a teacher you had last year'), T('你喜歡的作家', 'an author you like')],
    prompt: T('寫一封友誼信給{t}。分享一些你的近況，再問一個問題。', 'Write a friendly letter to {t}. Share some news and ask a question.'),
    plan: [
      { label: T('日期和稱呼', 'Date and greeting'), hint: T('Dear …,', 'Dear …,') },
      { label: T('問候', 'Say hello'), hint: T('How are you?', 'How are you?') },
      { label: T('我的近況', 'My news'), hint: T('Guess what? …', 'Guess what? …') },
      { label: T('問一個問題', 'Ask a question'), hint: T('Do you …?', 'Do you …?') },
      { label: T('結尾敬語和署名', 'Closing and name'), hint: T('Your friend, (name)', 'Your friend, (name)') },
    ],
    starters: ['Dear …,', 'How are you?', 'Guess what?', 'I have some big news.', 'Do you …?', 'I miss you!', 'Your friend,', 'Love,'],
    words: [40, 100],
    checklist: [
      T('我寫了日期。', 'I wrote the date.'),
      T('稱呼後面有逗號（Dear Sam,）。', 'My greeting has a comma (Dear Sam,).'),
      T('我分享了一件近況，有細節。', 'I shared news with details.'),
      T('我問了一個問題。', 'I asked a question.'),
      T('結尾敬語後面有逗號，下一行寫名字。', 'My closing has a comma, and my name is on the next line.'),
    ],
    mentor: {
      title: 'A Letter to My Cousin',
      text: 'May 3, 2025\n\nDear Kai,\n\nHow are you? Guess what? We got a new puppy! Her name is Biscuit. She is brown with one white paw, and she loves to chew my socks.\n\nYesterday, I taught Biscuit to sit. It took ten tries, but she did it! Do you have a pet at your house? Please write back and tell me.\n\nYour cousin,\nLily',
      note: T('有日期、有逗號的稱呼、有細節的近況、一個問題，還有結尾和署名。', 'It has a date, a greeting with a comma, news with details, a question for the reader, and a closing with a name.'),
    },
    vocab: ['Dear', 'guess what', 'I miss you', 'please write back', 'Your friend'],
  },
  {
    id: 'w2-poem-rhyme',
    grade: 2,
    genre: 'poem',
    std: 'Grade 2 · Writing',
    title: T('押韻的小詩', 'A rhyming poem'),
    topics: [T('雨', 'rain'), T('我的貓', 'my cat'), T('海洋', 'the ocean'), T('秋天的落葉', 'autumn leaves'), T('睡覺時間', 'bedtime')],
    prompt: T('寫一首關於{t}的押韻小詩。試著讓兩行的最後一個字押韻（cat / hat）。', 'Write a short rhyming poem about {t}. Try to make the last words of two lines rhyme (cat / hat).'),
    plan: [
      { label: T('想一想看到、聽到什麼', 'What do you see and hear?'), hint: T('列出相關的字', 'List words about your topic') },
      { label: T('找押韻的字', 'Find rhyming words'), hint: T('rain / train, sky / fly', 'rain / train, sky / fly') },
      { label: T('寫四行', 'Write four lines'), hint: T('第 2 行和第 4 行押韻', 'Make lines 2 and 4 rhyme') },
    ],
    starters: ['I like to …', 'Up in the sky …', 'Drip, drop, …', 'When I …', 'Soft and …'],
    words: [20, 60],
    checklist: [
      T('我的詩至少有四行。', 'My poem has at least four lines.'),
      T('至少有一組押韻的字。', 'I have at least one pair of rhyming words.'),
      T('我用了生動的字（聲音、顏色、動作）。', 'I used lively words (sounds, colors, actions).'),
      T('每一行都和主題有關。', 'Every line is about my topic.'),
    ],
    mentor: {
      title: 'Rain',
      text: 'Drip, drop, on my window pane,\nHere comes the silver rain.\nPuddles grow on the street,\nSplash, splash, go my feet!\nThe clouds roll by, the sky turns blue,\nThe sun comes out to play with you.',
      note: T('每兩行押韻（pane / rain、street / feet、blue / you），還用了聲音的字（drip、splash）。', 'Each pair of lines rhymes (pane / rain, street / feet, blue / you), and sound words (drip, splash) make it lively.'),
    },
    vocab: ['drip', 'splash', 'whoosh', 'bright', 'soft', 'rhyme'],
  },
  {
    id: 'w2-research-facts',
    grade: 2,
    genre: 'research',
    std: 'CCSS W.2.8',
    title: T('小小研究員', 'Little researcher'),
    topics: [T('火山', 'volcanoes'), T('太陽', 'the sun'), T('蜜蜂', 'honeybees'), T('雨林', 'rain forests'), T('恐龍', 'dinosaurs')],
    prompt: T('和大人一起在書或網站上找三個關於{t}的事實。用自己的話寫出來，並說說你在哪裡找到的。', 'With a grown-up, find three facts about {t} in a book or on a website. Write them in your own words and tell where you found them.'),
    plan: [
      { label: T('我的問題', 'My question'), hint: T('What is … like?', 'What is … like?') },
      { label: T('事實一', 'Fact 1'), hint: T('用自己的話寫', 'Write it in your own words') },
      { label: T('事實二', 'Fact 2'), hint: T('Also, …', 'Also, …') },
      { label: T('事實三', 'Fact 3'), hint: T('Another fact is …', 'Another fact is …') },
      { label: T('資料來源', 'Where I found it'), hint: T('I found these facts in …', 'I found these facts in …') },
    ],
    starters: ['I wanted to learn about …', 'Did you know …?', 'Also, …', 'Another fact is …', 'I found these facts in …'],
    words: [40, 100],
    checklist: [
      T('我寫了三個真的事實。', 'I wrote three true facts.'),
      T('我用自己的話寫，沒有照抄。', 'I used my own words, not copied ones.'),
      T('我說了在哪裡找到資料。', 'I told where I found my facts.'),
      T('我有開頭和結尾。', 'I have a beginning and an ending.'),
      CAP_END,
    ],
    mentor: {
      title: 'Facts About the Sun',
      text: 'I wanted to learn about the sun. Here is what I found.\n\nThe sun is a star. It is the closest star to Earth, so it looks much bigger than the other stars. The sun is so big that about one million Earths could fit inside it! Also, plants need sunlight to grow, so the sun helps us get food.\n\nI found these facts in a library book about space. The sun is amazing!',
      note: T('先說研究的主題，用自己的話寫出三個事實，最後說明資料來源。', 'It names the topic, gives three facts in the writer\'s own words, and tells where the facts came from.'),
    },
    vocab: ['fact', 'did you know', 'also', 'another fact', 'I found'],
  },
  {
    id: 'w2-literary-book-review',
    grade: 2,
    genre: 'literary',
    std: 'CCSS W.2.1',
    title: T('好書推薦', 'A book I recommend'),
    topics: [T('一本你很愛的繪本', 'a picture book you love'), T('一本好笑的書', 'a funny book'), T('一本關於動物的書', 'a book about animals'), T('一本有勇敢角色的書', 'a book with a brave character'), T('一個你聽過的故事', 'a story you heard')],
    prompt: T('向朋友介紹{t}。說說它在講什麼，以及朋友為什麼應該讀它。', 'Tell a friend about {t}. Say what it is about and why they should read it.'),
    plan: [
      { label: T('書名和作者', 'Title and author'), hint: T('The book … is by …', 'The book … is by …') },
      { label: T('在講什麼', 'What it is about'), hint: T('It is about …', 'It is about …') },
      { label: T('我的看法和理由', 'My opinion and reasons'), hint: T('I liked it because …', 'I liked it because …') },
      { label: T('推薦', 'Recommendation'), hint: T('You should read it if …', 'You should read it if …') },
    ],
    starters: ['The book … is about …', 'My favorite part is …', 'I liked it because …', 'Also, …', 'You should read it if …'],
    words: [40, 100],
    checklist: [
      T('我寫了書名。', 'I named the book.'),
      T('我簡單說了故事在講什麼（沒有說出結局）。', 'I told what it is about without giving away the ending.'),
      T('我給了喜歡它的理由。', 'I gave reasons for my opinion.'),
      T('我推薦給適合的讀者。', 'I said who should read it.'),
      CAP_END,
    ],
    mentor: {
      title: 'The Little Red Hen',
      text: 'The Little Red Hen is an old story about a hen who finds some wheat. She asks her friends to help her plant it, but they all say, "Not I!"\n\nI liked this story because the hen works so hard. My favorite part is when she bakes the bread and everyone wants a piece. Also, the story teaches us to help each other.\n\nYou should read it if you like stories with a lesson!',
      note: T('先說故事在講什麼，再用 because、Also 給理由，最後推薦給讀者，沒有說破結局。', 'It tells what the story is about, gives reasons with "because" and "Also", and recommends it without spoiling the ending.'),
    },
    vocab: ['character', 'favorite part', 'because', 'also', 'you should read'],
  },
  {
    id: 'w2-descriptive-place',
    grade: 2,
    genre: 'descriptive',
    std: 'Grade 2 · Writing',
    title: T('描寫一個地方', 'Describe a place'),
    topics: [T('你家的廚房', 'your kitchen'), T('遊樂場', 'a playground'), T('海邊', 'the beach'), T('夜市或市場', 'a night market'), T('你的教室', 'your classroom')],
    prompt: T('描寫{t}，讓讀者好像也在那裡。用上五種感官的字。', 'Describe {t} so your reader feels like they are there. Use your five senses.'),
    plan: [
      { label: T('地方', 'The place'), hint: T('My favorite place is …', 'My favorite place is …') },
      { label: T('看到', 'See'), hint: T('I can see …', 'I can see …') },
      { label: T('聽到', 'Hear'), hint: T('I can hear …', 'I can hear …') },
      { label: T('聞到、摸到、嚐到', 'Smell, touch, taste'), hint: T('It smells like …', 'It smells like …') },
      { label: T('感覺', 'How I feel there'), hint: T('When I am there, I feel …', 'When I am there, I feel …') },
    ],
    starters: ['When you walk into …', 'I can see …', 'I can hear …', 'It smells like …', 'It feels …', 'When I am there, I feel …'],
    words: [40, 100],
    checklist: [
      T('我用了至少三種感官。', 'I used at least three senses.'),
      T('我用了生動的形容詞。', 'I used strong describing words.'),
      T('我說了在那裡的感覺。', 'I told how I feel there.'),
      CAP_END,
    ],
    mentor: {
      title: 'The Night Market',
      text: 'When you walk into the night market, bright lights hang above your head. I can see red lanterns and long rows of food stands.\n\nI can hear sizzling pans and people calling out, "Come and try!" It smells like grilled corn and sweet bubble tea. The warm tea feels good in my hands.\n\nWhen I am at the night market, I feel excited and hungry!',
      note: T('用了看到、聽到、聞到、摸到的細節，讀者好像也站在夜市裡。', 'It uses details for sight, sound, smell and touch, so the reader feels like they are standing in the market.'),
    },
    vocab: ['bright', 'sizzling', 'crunchy', 'smells like', 'sounds like', 'cozy'],
  },

  // ---------------- Grade 3 ----------------
  {
    id: 'w3-personal-narrative',
    grade: 3,
    genre: 'personal',
    std: 'CCSS W.3.3',
    title: T('我的真實故事', 'A true story from my life'),
    topics: [T('一個你永遠不會忘記的日子', 'a day you will never forget'), T('你第一次做某件事', 'the first time you did something'), T('你很勇敢的一次', 'a time you were brave'), T('一次家庭旅行', 'a trip with your family'), T('一件出錯但最後變好的事', 'a time something went wrong but turned out okay')],
    prompt: T('寫一個關於{t}的真實故事。用細節、對話和感覺讓讀者看見發生了什麼，並寫一個有感想的結尾。', 'Write a true story about {t}. Use details, dialogue and feelings to show what happened, and end with what you learned or felt.'),
    plan: [
      { label: T('吸引人的開頭', 'Hook beginning'), hint: T('用聲音、對話或問題開頭', 'Start with a sound, a line of dialogue or a question') },
      { label: T('事件一', 'Event 1'), hint: T('First, … / At first, …', 'First, … / At first, …') },
      { label: T('事件二', 'Event 2'), hint: T('Then, … / Suddenly, …', 'Then, … / Suddenly, …') },
      { label: T('事件三（最重要的時刻）', 'Event 3 (the big moment)'), hint: T('Finally, …', 'Finally, …') },
      { label: T('結尾：感想', 'Ending: what I learned'), hint: T('Now I know …', 'Now I know …') },
    ],
    starters: ['"…!" shouted my brother.', 'I will never forget the day …', 'At first, …', 'Suddenly, …', 'After a while, …', 'Finally, …', 'Now I know that …'],
    words: [80, 180],
    checklist: [
      T('我的開頭能吸引讀者。', 'My beginning hooks the reader.'),
      T('事情照時間順序寫，有用時間詞。', 'My events are in order with time words.'),
      T('我用了對話，並用引號。', 'I used dialogue with quotation marks.'),
      T('我寫了想法和感覺。', 'I showed my thoughts and feelings.'),
      T('結尾說出我學到或感受到什麼。', 'My ending tells what I learned or felt.'),
      T('我分了段落。', 'I used paragraphs.'),
    ],
    mentor: {
      title: 'The Big Jump',
      text: '"You can do it!" my sister yelled from the pool. I stood at the end of the diving board, and my knees were shaking.\n\nAt first, I just looked down at the water. It looked very deep and very blue. Kids were lining up behind me, and I could hear them whispering. I almost turned around.\n\nThen I remembered my swimming lessons. I took a deep breath, held my nose and jumped. For one second, I was flying! Suddenly, the cold water splashed all around me. When I came up, my sister was clapping and cheering.\n\nNow I know that being brave does not mean you are not scared. It means you try anyway.',
      note: T('用對話開頭吸引讀者，用時間詞照順序寫，寫出害怕的感覺，結尾說出學到的道理。', 'Dialogue hooks the reader, time words keep the events in order, feelings are shown (shaking knees), and the ending shares a lesson.'),
    },
    vocab: ['at first', 'suddenly', 'after a while', 'finally', 'nervous', 'proud', 'I realized'],
  },
  {
    id: 'w3-narrative-dialogue',
    grade: 3,
    genre: 'narrative',
    std: 'CCSS W.3.3b',
    title: T('有對話的想像故事', 'A make-believe story with dialogue'),
    topics: [T('兩個發現秘密門的朋友', 'two friends who find a secret door'), T('一隻需要幫忙的會說話的貓', 'a talking cat who needs help'), T('班上不見的寵物', 'a class pet that goes missing'), T('一個醒來發現有超能力的小孩', 'a kid who wakes up with a superpower'), T('一隻怕黑的龍', 'a dragon who is afraid of the dark')],
    prompt: T('寫一個關於{t}的想像故事。要有角色、問題、對話和解決方法，最後有一個結尾。', 'Write a make-believe story about {t}. Include characters, a problem, dialogue and a solution, and give it a real ending.'),
    plan: [
      { label: T('角色和地點', 'Characters and setting'), hint: T('誰？在哪裡？什麼時候？', 'Who? Where? When?') },
      { label: T('問題', 'Problem'), hint: T('One morning, …', 'One morning, …') },
      { label: T('對話', 'Dialogue'), hint: T('"…?" asked …', '"…?" asked …') },
      { label: T('嘗試和解決', 'Tries and solution'), hint: T('First they … Then …', 'First they … Then …') },
      { label: T('結尾', 'Ending'), hint: T('From that day on, …', 'From that day on, …') },
    ],
    starters: ['One stormy night, …', '"…," whispered …', '"…?" asked …', 'Just then, …', 'After that, …', 'From that day on, …'],
    words: [80, 180],
    checklist: [
      T('故事有角色和地點。', 'My story has characters and a setting.'),
      T('有一個清楚的問題和解決方法。', 'There is a clear problem and solution.'),
      T('我用了對話，標點放在引號裡面。', 'I used dialogue, with punctuation inside the quotation marks.'),
      T('我用了時間詞（after that、just then）。', 'I used time words (after that, just then).'),
      T('我的結尾讓故事有結束的感覺。', 'My ending wraps up the story.'),
      T('換人說話時，我換一行。', 'I started a new line when a new character speaks.'),
    ],
    mentor: {
      title: 'Ember and the Dark',
      text: 'Ember was a small green dragon who lived in a cave by the sea. She could breathe fire, but she had a secret. She was afraid of the dark.\n\nOne night, a storm blew out all the lanterns in the cave. "Help!" Ember cried. "I can\'t see anything!"\n\nHer friend Pip, a tiny bat, flew down beside her. "Don\'t worry," he said. "The dark is just the night saying hello."\n\n"But how do you see in it?" Ember asked.\n\n"I listen," said Pip. "And you have something even better. You have fire!"\n\nEmber took a deep breath and blew a soft, warm flame. The whole cave glowed orange. From that night on, Ember was never afraid of the dark again.',
      note: T('故事有角色、地點和問題，用對話推動情節，引號和逗號用得正確，最後問題解決了。', 'It has characters, a setting and a problem; the dialogue moves the story forward and is punctuated correctly; and the ending solves the problem.'),
    },
    vocab: ['whispered', 'shouted', 'asked', 'just then', 'suddenly', 'from that day on'],
  },
  {
    id: 'w3-opinion-which-better',
    grade: 3,
    genre: 'opinion',
    std: 'CCSS W.3.1',
    title: T('哪一個比較好？', 'Which is better?'),
    topics: [T('貓還是狗', 'cats or dogs'), T('夏天還是冬天', 'summer or winter'), T('看書還是看電影', 'reading books or watching movies'), T('在室內玩還是在戶外玩', 'playing inside or playing outside'), T('早上洗澡還是晚上洗澡', 'morning baths or evening baths')],
    prompt: T('哪一個比較好：{t}？寫一篇意見文，說出看法，給至少兩個理由和例子，並寫一個結論。', 'Which is better: {t}? Write an opinion piece. State your opinion, give at least two reasons with examples, and write a conclusion.'),
    plan: [
      { label: T('開頭和看法', 'Introduction and opinion'), hint: T('Some people like …, but I think …', 'Some people like …, but I think …') },
      { label: T('理由一和例子', 'Reason 1 + example'), hint: T('First, … For example, …', 'First, … For example, …') },
      { label: T('理由二和例子', 'Reason 2 + example'), hint: T('Also, …', 'Also, …') },
      { label: T('結論', 'Conclusion'), hint: T('For these reasons, …', 'For these reasons, …') },
    ],
    starters: ['Some people think …, but I believe …', 'In my opinion, …', 'First, …', 'For example, …', 'Another reason is …', 'Since …', 'For these reasons, …'],
    words: [80, 180],
    checklist: [
      T('開頭清楚說出我的看法。', 'My introduction clearly states my opinion.'),
      T('我給了至少兩個理由。', 'I gave at least two reasons.'),
      T('每個理由都有例子或細節。', 'Each reason has an example or detail.'),
      T('我用了連接詞（because、therefore、since、for example）。', 'I used linking words (because, therefore, since, for example).'),
      T('我的結論再說一次看法。', 'My conclusion restates my opinion.'),
      T('我分了段落。', 'I used paragraphs.'),
    ],
    mentor: {
      title: 'Why Dogs Are Better Than Cats',
      text: 'Some people love cats, but I believe dogs make better pets.\n\nFirst, dogs help you stay active. For example, my dog Pepper needs a walk every morning and every evening. Because of her, I walk about two miles a day!\n\nAnother reason is that dogs can learn many tricks. Pepper can sit, roll over and even ring a bell when she wants to go outside. Most cats will not do tricks, even for a treat.\n\nFinally, dogs are loyal friends. When I come home from school, Pepper runs to the door and wags her whole body.\n\nFor these reasons, I think dogs are the best pets anyone could have.',
      note: T('開頭說出看法，每段一個理由加上例子，用 First、For example、Another reason、Finally 連接，結論再說一次看法。', 'The introduction states the opinion, each paragraph gives one reason with an example, linking words connect the ideas, and the conclusion restates the opinion.'),
    },
    vocab: ['in my opinion', 'first', 'for example', 'another reason', 'since', 'therefore', 'for these reasons'],
  },
  {
    id: 'w3-informative-teach',
    grade: 3,
    genre: 'informative',
    std: 'CCSS W.3.2',
    title: T('教讀者一個主題', 'Teach your reader'),
    topics: [T('一個你熟悉的運動', 'a sport you know well'), T('一種你研究過的動物', 'an animal you have studied'), T('你家過的節日', 'a holiday your family celebrates'), T('你的嗜好', 'a hobby you enjoy'), T('你家附近的一個地方', 'a place in your town')],
    prompt: T('寫一篇說明文，教讀者認識{t}。用主題句開頭，給事實和細節，用連接詞把想法連起來，最後寫結尾句。', 'Teach your reader about {t}. Start with a topic sentence, give facts and details, use linking words, and end with a closing sentence.'),
    plan: [
      { label: T('主題句', 'Topic sentence'), hint: T('… is …', '… is …') },
      { label: T('重點一和細節', 'Main point 1 + details'), hint: T('First, …', 'First, …') },
      { label: T('重點二和細節', 'Main point 2 + details'), hint: T('Also, …', 'Also, …') },
      { label: T('重點三和細節', 'Main point 3 + details'), hint: T('Another …', 'Another …') },
      { label: T('結尾句', 'Closing sentence'), hint: T('Now you know …', 'Now you know …') },
    ],
    starters: ['Have you ever heard of …?', '… is …', 'First, …', 'Also, …', 'Another important part is …', 'For example, …', 'Now you know …'],
    words: [80, 180],
    checklist: [
      T('我有一個清楚的主題句。', 'I have a clear topic sentence.'),
      T('我寫了事實、定義或細節。', 'I included facts, definitions or details.'),
      T('相同的資訊放在一起。', 'I grouped related information together.'),
      T('我用了連接詞（also、another、for example）。', 'I used linking words (also, another, for example).'),
      T('我有結尾句。', 'I have a closing sentence.'),
      T('我只寫事實，沒有寫「我覺得」。', 'I wrote facts, not opinions.'),
    ],
    mentor: {
      title: 'The Dragon Boat Festival',
      text: 'The Dragon Boat Festival is a holiday celebrated in Taiwan, China and other places around the world. It comes on the fifth day of the fifth month of the lunar calendar, usually in June.\n\nFirst, the festival is famous for dragon boat races. Long, narrow boats are painted to look like dragons. Teams of paddlers race them while a drummer keeps the beat.\n\nAlso, families eat rice dumplings called zongzi. Sticky rice is filled with meat, beans or egg yolk, then wrapped in bamboo leaves and cooked.\n\nThe festival honors Qu Yuan, a poet from long ago. Now you know why people race boats and eat zongzi every summer!',
      note: T('主題句介紹節日，每段講一個重點（划龍舟、粽子、由來），有定義和細節，最後一句結尾。', 'The topic sentence introduces the holiday, each paragraph covers one point (races, food, history) with details, and a closing sentence wraps it up.'),
    },
    vocab: ['for example', 'also', 'another', 'in addition', 'called', 'now you know'],
  },
  {
    id: 'w3-procedural-steps',
    grade: 3,
    genre: 'procedural',
    std: 'CCSS W.3.2',
    title: T('清楚的操作說明', 'Clear instructions'),
    topics: [T('摺紙船', 'make a paper boat'), T('照顧金魚', 'take care of a goldfish'), T('做水果沙拉', 'make a fruit salad'), T('準備考試', 'get ready for a test'), T('堆雪人', 'build a snowman')],
    prompt: T('寫一篇說明，教讀者怎麼{t}。介紹目的、列出材料、照順序寫步驟，並加上小提醒。', 'Write instructions that teach how to {t}. Explain why, list the materials, write the steps in order and add a helpful tip.'),
    plan: [
      { label: T('介紹', 'Introduction'), hint: T('Have you ever wanted to …?', 'Have you ever wanted to …?') },
      { label: T('材料', 'Materials'), hint: T('You will need …', 'You will need …') },
      { label: T('步驟', 'Steps'), hint: T('First, … Next, … After that, …', 'First, … Next, … After that, …') },
      { label: T('小提醒', 'Tip'), hint: T('Be careful to …', 'Be careful to …') },
      { label: T('結尾', 'Closing'), hint: T('Now you are ready to …', 'Now you are ready to …') },
    ],
    starters: ['Have you ever wanted to …?', 'You will need …', 'First, …', 'Next, …', 'After that, …', 'Be careful not to …', 'Now you are ready to …'],
    words: [80, 180],
    checklist: [
      T('介紹說明了要做什麼。', 'My introduction tells what we are making or doing.'),
      T('我列出了材料。', 'I listed the materials.'),
      T('步驟照順序寫，有順序詞。', 'My steps are in order with order words.'),
      T('每一步都說得夠清楚，別人照做就能完成。', 'Each step is clear enough for someone to follow.'),
      T('我加了一個小提醒。', 'I added a helpful tip.'),
      T('我有結尾。', 'I have a closing.'),
    ],
    mentor: {
      title: 'How to Make a Fruit Salad',
      text: 'Have you ever wanted a snack that is sweet, colorful and healthy? A fruit salad is easy to make.\n\nYou will need a banana, a cup of grapes, an apple, a bowl, a spoon and a grown-up to help with the knife.\n\nFirst, wash the grapes and the apple. Next, ask your grown-up to cut the apple into small pieces. After that, peel the banana and slice it with a butter knife. Then, put all the fruit in the bowl and stir it gently with the spoon.\n\nHere is a tip: squeeze a little lemon juice on top so the apples do not turn brown.\n\nNow you are ready to share your fruit salad with your family!',
      note: T('有吸引人的介紹、材料清單、照順序的步驟、安全提醒和小技巧，最後一句結尾。', 'It has a hook, a list of materials, steps in order, a safety note and a tip, and a closing sentence.'),
    },
    vocab: ['you will need', 'first', 'next', 'after that', 'then', 'gently', 'be careful'],
  },
  {
    id: 'w3-letter-request',
    grade: 3,
    genre: 'letter',
    std: 'CCSS W.3.1',
    title: T('寫信提出請求', 'A letter that asks for something'),
    topics: [T('校長：請學校買新的遊樂器材', 'your principal, asking for new playground equipment'), T('爸媽：請他們讓你養寵物', 'your parents, asking for a pet'), T('圖書館員：請圖書館多買你喜歡的主題的書', 'the librarian, asking for more books on a topic you love'), T('老師：請老師安排一次校外教學', 'your teacher, asking for a class field trip'), T('市長：請市政府在公園加一個東西', 'your mayor, asking for something new in a park')],
    prompt: T('寫一封信給{t}。有禮貌地說出你的請求，給理由說服對方，並用正確的書信格式。', 'Write a letter to {t}. Politely make your request, give reasons to convince the reader, and use correct letter form.'),
    plan: [
      { label: T('日期和稱呼', 'Date and greeting'), hint: T('Dear …,', 'Dear …,') },
      { label: T('請求', 'My request'), hint: T('I am writing to ask …', 'I am writing to ask …') },
      { label: T('理由一', 'Reason 1'), hint: T('First, …', 'First, …') },
      { label: T('理由二', 'Reason 2'), hint: T('Also, …', 'Also, …') },
      { label: T('有禮貌的結尾', 'Polite ending'), hint: T('Thank you for …', 'Thank you for …') },
      { label: T('結尾敬語和署名', 'Closing and signature'), hint: T('Sincerely, (name)', 'Sincerely, (name)') },
    ],
    starters: ['Dear …,', 'I am writing to ask …', 'I think this is a good idea because …', 'First, …', 'Also, …', 'Thank you for thinking about my idea.', 'Sincerely,'],
    words: [80, 180],
    checklist: [
      T('有日期、稱呼（加逗號）、結尾敬語（加逗號）和署名。', 'I have a date, a greeting with a comma, a closing with a comma and my name.'),
      T('第一段清楚說出我的請求。', 'My first paragraph clearly states my request.'),
      T('我給了至少兩個理由。', 'I gave at least two reasons.'),
      T('我的語氣有禮貌。', 'My words are polite.'),
      T('我在結尾謝謝對方。', 'I thanked the reader at the end.'),
    ],
    mentor: {
      title: 'A Letter to Our Librarian',
      text: 'October 14, 2025\n\nDear Mrs. Chen,\n\nI am writing to ask if our library could get more books about space. Many kids in my class love reading about planets and rockets.\n\nFirst, the space books we have are always checked out. Last week, I waited ten days for a book about Mars! Also, reading about space helps us in science class. We are learning about the solar system right now, and more books would help us with our projects.\n\nThank you for thinking about my idea. I know you work hard to make our library a great place.\n\nSincerely,\nNoah Lin',
      note: T('書信格式正確，第一段就說出請求，兩個理由各有例子，語氣有禮貌，最後感謝對方。', 'The letter form is correct, the request comes first, two reasons have examples, the tone is polite, and it thanks the reader.'),
    },
    vocab: ['I am writing to', 'because', 'also', 'for example', 'thank you for', 'Sincerely'],
  },
  {
    id: 'w3-descriptive-place',
    grade: 3,
    genre: 'descriptive',
    std: 'Grade 3 · Writing',
    title: T('用文字畫一幅畫', 'Paint a picture with words'),
    topics: [T('一個你很喜歡的地方', 'a place you love'), T('一場暴風雨', 'a thunderstorm'), T('你最喜歡的一餐', 'your favorite meal'), T('熱鬧的街道', 'a busy street'), T('早晨的森林', 'a forest in the morning')],
    prompt: T('描寫{t}。用五感的細節、生動的形容詞和比喻（像…一樣），讓讀者好像親眼看到。', 'Describe {t}. Use details for all five senses, strong adjectives and comparisons (like … / as … as …) so the reader can picture it.'),
    plan: [
      { label: T('開頭：在哪裡', 'Opening: where are we?'), hint: T('As soon as you …', 'As soon as you …') },
      { label: T('看到', 'Sight'), hint: T('I see …', 'I see …') },
      { label: T('聽到', 'Sound'), hint: T('I hear …', 'I hear …') },
      { label: T('聞到、摸到、嚐到', 'Smell, touch, taste'), hint: T('The air smells like …', 'The air smells like …') },
      { label: T('結尾：我的感覺', 'Closing: my feeling'), hint: T('This place makes me feel …', 'This place makes me feel …') },
    ],
    starters: ['As soon as you step into …', 'Everywhere I look, …', 'I can hear …', 'The air smells like …', 'It feels as … as …', 'This place makes me feel …'],
    words: [80, 180],
    checklist: [
      T('我用了至少四種感官。', 'I used at least four senses.'),
      T('我用了生動的形容詞和動詞。', 'I used strong adjectives and verbs.'),
      T('我用了至少一個比喻（like… / as… as…）。', 'I used at least one comparison (like … / as … as …).'),
      T('細節依順序排列（由遠到近或由上到下）。', 'My details are in a sensible order (far to near, or top to bottom).'),
      T('結尾說出我的感覺。', 'My closing shares my feeling.'),
    ],
    mentor: {
      title: 'The Forest in the Morning',
      text: 'As soon as you step into the forest in the morning, the air feels cool and damp on your face. Tall pine trees stand like quiet giants, and thin beams of sunlight slip between their branches.\n\nI can hear a woodpecker tapping far away. Closer, a stream bubbles over smooth gray stones. The leaves crunch under my boots like cornflakes.\n\nThe forest smells fresh and green, like a Christmas tree after rain. When I touch the bark of a pine tree, it feels rough and a little sticky.\n\nThis place makes me feel calm and wide awake at the same time.',
      note: T('用了看到、聽到、聞到、摸到的細節，還有比喻（like quiet giants、like cornflakes），結尾說出感覺。', 'It uses sight, sound, smell and touch, adds comparisons (like quiet giants, like cornflakes), and ends with a feeling.'),
    },
    vocab: ['like', 'as … as', 'sparkling', 'rough', 'crunch', 'whisper', 'glow'],
  },
  {
    id: 'w3-poem-rhyming',
    grade: 3,
    genre: 'poem',
    std: 'Grade 3 · Writing',
    title: T('押韻詩', 'A rhyming poem'),
    topics: [T('四季', 'the seasons'), T('海洋', 'the ocean'), T('我的家人', 'my family'), T('上學的日子', 'school days'), T('夜空', 'the night sky')],
    prompt: T('寫一首關於{t}的詩，至少八行，有兩組以上押韻的句子，並用生動的字和聲音。', 'Write a poem about {t} with at least eight lines. Include two or more pairs of rhyming lines and use lively words and sounds.'),
    plan: [
      { label: T('腦力激盪', 'Brainstorm'), hint: T('列出看到、聽到、感覺到的字', 'List things you see, hear and feel') },
      { label: T('押韻字配對', 'Rhyme pairs'), hint: T('night / bright, sea / free', 'night / bright, sea / free') },
      { label: T('第一段（四行）', 'Stanza 1 (four lines)'), hint: T('描寫一個畫面', 'Paint one picture') },
      { label: T('第二段（四行）', 'Stanza 2 (four lines)'), hint: T('換一個畫面或感覺', 'A new picture or a feeling') },
    ],
    starters: ['When the …', 'Up above, …', 'I hear the …', 'Softly, softly, …', 'Every night, …'],
    words: [30, 100],
    checklist: [
      T('我的詩至少有八行，分成兩段。', 'My poem has at least eight lines in two stanzas.'),
      T('我有至少兩組押韻的句子。', 'I have at least two pairs of rhyming lines.'),
      T('我用了生動的字或聲音的字。', 'I used lively words or sound words.'),
      T('我的詩有一個清楚的主題。', 'My poem has a clear topic.'),
      T('我大聲唸過，聽起來很順。', 'I read it aloud and it sounds smooth.'),
    ],
    mentor: {
      title: 'The Night Sky',
      text: 'When the sun has gone to bed,\nA velvet blanket hangs instead.\nThe stars come out, a sparkling crowd,\nAnd peek around a silver cloud.\n\nThe moon climbs up, so round and bright,\nIt paints the rooftops soft and white.\nI whisper wishes, one, two, three,\nAnd hope the stars can hear me.',
      note: T('兩段各四行，每兩行押韻（bed / instead、bright / white），用了比喻（velvet blanket）和生動的動詞（peek、climbs、paints）。', 'Two stanzas of four lines, each pair rhymes (bed / instead, bright / white), with a comparison (a velvet blanket) and lively verbs (peek, climbs, paints).'),
    },
    vocab: ['sparkling', 'whisper', 'glowing', 'drifting', 'softly', 'rhyme', 'stanza'],
  },
  {
    id: 'w3-research-report',
    grade: 3,
    genre: 'research',
    std: 'CCSS W.3.7',
    title: T('小小研究報告', 'A short research report'),
    topics: [T('海龜', 'sea turtles'), T('火星', 'the planet Mars'), T('蜜蜂', 'honeybees'), T('火山', 'volcanoes'), T('北極狐', 'the Arctic fox')],
    prompt: T('研究{t}：從至少兩個來源（書、網站、影片）做筆記，把資訊分成兩三類，寫成一篇小報告，最後列出來源。', 'Research {t}. Take notes from at least two sources (books, websites, videos), sort the facts into two or three groups, write a short report, and list your sources.'),
    plan: [
      { label: T('主題句', 'Topic sentence'), hint: T('… are …', '… are …') },
      { label: T('第一類：長相或特徵', 'Group 1: body or features'), hint: T('They have …', 'They have …') },
      { label: T('第二類：住處或生活', 'Group 2: home or life'), hint: T('They live …', 'They live …') },
      { label: T('第三類：有趣的事實或危機', 'Group 3: fun fact or problem'), hint: T('One interesting fact is …', 'One interesting fact is …') },
      { label: T('結尾和來源', 'Closing and sources'), hint: T('Sources: …', 'Sources: …') },
    ],
    starters: ['… are …', 'According to …', 'One interesting fact is …', 'In addition, …', 'Sadly, …', 'Sources:'],
    words: [80, 180],
    checklist: [
      T('我用了至少兩個來源並列出來。', 'I used at least two sources and listed them.'),
      T('我用自己的話寫，沒有照抄。', 'I wrote in my own words.'),
      T('事實分成幾類，每類一段。', 'I sorted my facts into groups, one paragraph each.'),
      T('我有主題句和結尾句。', 'I have a topic sentence and a closing sentence.'),
      T('我用了連接詞（also、in addition、for example）。', 'I used linking words (also, in addition, for example).'),
    ],
    mentor: {
      title: 'Sea Turtles',
      text: 'Sea turtles are reptiles that spend almost their whole lives in the ocean. There are seven kinds of sea turtles.\n\nSea turtles have flippers instead of feet, which makes them strong swimmers. Unlike land turtles, they cannot pull their heads into their shells.\n\nA mother sea turtle crawls onto a beach at night to lay her eggs in the sand. When the babies hatch, they hurry across the sand to the water. In addition, different sea turtles eat different foods. For example, green sea turtles eat sea grass, and leatherbacks eat jellyfish.\n\nSadly, plastic bags in the ocean can look like jellyfish, so turtles sometimes eat them by mistake. We can help by using less plastic.\n\nSources: a library book about sea turtles, and an aquarium website',
      note: T('事實分成三類（身體、生活、危機），用自己的話寫，用了 In addition、For example，最後列出來源。', 'Facts are grouped (body, life, dangers), written in the writer\'s own words, linked with "In addition" and "For example", and the sources are listed.'),
    },
    vocab: ['according to', 'in addition', 'for example', 'also', 'however', 'sources'],
  },
  {
    id: 'w3-literary-character',
    grade: 3,
    genre: 'literary',
    std: 'CCSS W.3.1',
    title: T('談談故事裡的角色', 'Writing about a character'),
    topics: [T('一個改變了的角色', 'a character who changed'), T('一個勇敢的角色', 'a character who was brave'), T('一個你想和他做朋友的角色', 'a character you would like as a friend'), T('一個犯了錯的角色', 'a character who made a mistake'), T('你剛讀完的書的主角', 'the main character of a book you just read')],
    prompt: T('選一個故事，寫寫{t}。說出你對這個角色的看法，用故事裡的例子（他說了什麼、做了什麼）支持你的想法。', 'Choose a story and write about {t}. Give your opinion about the character, and support it with examples from the story (what the character said and did).'),
    plan: [
      { label: T('書名和角色', 'Book and character'), hint: T('In the story …, … is …', 'In the story …, … is …') },
      { label: T('我的看法', 'My opinion'), hint: T('I think … is …', 'I think … is …') },
      { label: T('例子一', 'Example 1'), hint: T('For example, when …', 'For example, when …') },
      { label: T('例子二', 'Example 2'), hint: T('Also, …', 'Also, …') },
      { label: T('結論', 'Conclusion'), hint: T('That is why …', 'That is why …') },
    ],
    starters: ['In the story …, the main character is …', 'I think … is … because …', 'For example, when …', 'This shows that …', 'At the end of the story, …', 'That is why …'],
    words: [80, 180],
    checklist: [
      T('我寫了書名和角色的名字。', 'I named the story and the character.'),
      T('我清楚說出對角色的看法。', 'I clearly stated my opinion about the character.'),
      T('我用了故事裡的例子支持看法。', 'I used examples from the story to support my opinion.'),
      T('我用了 This shows that… 說明例子。', 'I explained my examples ("This shows that …").'),
      T('我有結論。', 'I have a conclusion.'),
    ],
    mentor: {
      title: 'How the Hare Changed',
      text: 'In the fable The Tortoise and the Hare, the Hare starts out as a show-off, but he changes by the end of the story.\n\nAt the beginning, the Hare brags that he is the fastest animal in the forest. He laughs at the Tortoise for being slow. This shows that he thinks he is better than everyone else.\n\nDuring the race, the Hare is so sure he will win that he stops to take a nap. When he wakes up, the Tortoise is already crossing the finish line.\n\nAt the end, the Hare is surprised and embarrassed. He learns that being fast is not enough if you do not keep trying. That is why I think the Hare is a character who changed.',
      note: T('開頭說出看法，用故事開頭、中間、結尾的例子支持，並用 This shows that 解釋，最後下結論。', 'It states an opinion, supports it with examples from the beginning, middle and end, explains them ("This shows that"), and draws a conclusion.'),
    },
    vocab: ['character', 'this shows that', 'for example', 'at the beginning', 'by the end', 'learns'],
  },
];

export default { skills, prompts };
