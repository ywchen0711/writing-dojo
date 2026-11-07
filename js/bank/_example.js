// An example of the bank format (not loaded by the site). See SPEC.md.
import { T, NAMES, words, ansTap, ansChoice, plural, third, cap } from '../util.js';

const skills = [
  {
    id: 'g1-cap-names',
    grade: 1,
    unit: 'mechanics',
    name: T('名字和句首要大寫', 'Capital letters: names and the first word'),
    std: 'CCSS L.1.2a',
    lesson: {
      zh: '英文句子的<b>第一個字</b>要大寫，<b>人名</b>、<b>星期</b>、<b>月份</b>和 <b>I</b>（我）也永遠大寫。',
      en: 'Start every sentence with a <b>capital letter</b>. <b>Names</b>, <b>days</b>, <b>months</b> and the word <b>I</b> always get a capital too.',
      ex: ['<u>M</u>ia and <u>I</u> play on <u>S</u>aturday.', '<u>M</u>y dog is named <u>R</u>ex.'],
    },
    gen(r) {
      const name = r.pick(NAMES), day = r.pick(['Monday', 'Tuesday', 'Friday', 'Saturday', 'Sunday']);
      const pet = r.pick(['dog', 'cat', 'fish', 'bird']), act = r.pick(['play', 'read', 'swim', 'bake']);
      const good = `${name} and I ${act} on ${day}.`;
      const ws = words(good), k = r.pick([0, 2, 5].filter((i) => i < ws.length));
      const bad = ws.slice(); bad[k] = bad[k].toLowerCase();
      const why = k === 0 ? T(`「${ws[0]}」是人名，也是句子的第一個字，要大寫。`, `"${ws[0]}" is a name and the first word, so it needs a capital.`)
        : k === 2 ? T('「I」（我）永遠要大寫。', 'The word "I" is always a capital letter.')
        : T(`「${ws[5].replace('.', '')}」是星期幾，星期要大寫。`, `"${ws[5].replace('.', '')}" is a day of the week. Days get a capital.`);
      return {
        q: T('點出應該大寫的字。', 'Tap the word that needs a capital letter.'),
        ans: ansTap(bad, k),
        sol: [why, T(`正確的句子：${good}`, `The fixed sentence: ${good}`)],
        hint: T('找找人名、星期，還有 I。', 'Look for a name, a day, or the word I.'),
      };
    },
  },
  {
    id: 'g2-sv-agree',
    grade: 2,
    unit: 'grammar',
    name: T('主詞和動詞要一致', 'Subject–verb agreement'),
    std: 'CCSS L.2.1',
    lesson: {
      zh: '只有一個人或一樣東西（he、she、it、the dog）時，現在式動詞要加 <b>-s</b>：The dog <b>runs</b>. 兩個以上（they、the dogs）就不加：The dogs <b>run</b>.',
      en: 'When the subject is one person or thing (he, she, it, the dog), add <b>-s</b> to a present-tense verb: The dog <b>runs</b>. For more than one (they, the dogs), no -s: The dogs <b>run</b>.',
      ex: ['The cat <b>sleeps</b>.', 'The cats <b>sleep</b>.'],
    },
    gen(r) {
      const n = r.pick(['dog', 'bird', 'boy', 'girl', 'baby', 'fox']), v = r.pick(['jump', 'sing', 'play', 'eat', 'watch', 'wash']);
      const many = r.chance(0.5), subj = many ? `The ${plural(n)}` : `The ${n}`;
      const right = many ? v : third(v), wrong = many ? third(v) : v;
      return {
        q: T(`選出正確的字：${subj} ___ every day.`, `Choose the right word: ${subj} ___ every day.`),
        ans: ansChoice([right, wrong]),
        sol: [
          many ? T(`「${subj}」是很多個（複數），動詞不加 -s。`, `"${subj}" means more than one, so the verb has no -s.`)
               : T(`「${subj}」只有一個（單數），動詞要加 -s。`, `"${subj}" is just one, so the verb gets -s.`),
          T(`${subj} ${right} every day.`, `${subj} ${right} every day.`),
        ],
      };
    },
  },
];

const prompts = [
  {
    id: 'w2-opinion-best-season',
    grade: 2,
    genre: 'opinion',
    std: 'CCSS W.2.1',
    title: T('我最喜歡的…', 'My favorite …'),
    topics: [T('季節', 'season'), T('動物', 'animal'), T('遊戲', 'game'), T('水果', 'fruit'), T('節日', 'holiday')],
    prompt: T('你最喜歡的{t}是什麼？用英文寫出你的看法，並給兩個理由。', 'What is your favorite {t}? Tell your opinion and give two reasons.'),
    plan: [
      { label: T('我的看法', 'My opinion'), hint: T('My favorite … is …', 'My favorite … is …') },
      { label: T('理由一', 'Reason 1'), hint: T('One reason is …', 'One reason is …') },
      { label: T('理由二', 'Reason 2'), hint: T('Also, …', 'Also, …') },
      { label: T('結尾', 'Ending'), hint: T('That is why …', 'That is why …') },
    ],
    starters: ['My favorite … is …', 'One reason is …', 'Another reason is …', 'Also, …', 'That is why …'],
    words: [40, 90],
    checklist: [
      T('第一句說出我的看法。', 'My first sentence tells my opinion.'),
      T('我給了兩個理由，並用 because 說明。', 'I gave two reasons and used "because".'),
      T('我用了連接詞（also、another）。', 'I used linking words (also, another).'),
      T('最後一句把看法再說一次。', 'My last sentence says my opinion again.'),
      T('每個句子大寫開頭、有句號。', 'Each sentence starts with a capital and ends with a period.'),
    ],
    mentor: {
      title: 'My Favorite Season',
      text: 'My favorite season is winter. One reason is that I can build a snowman with my brother. We give him a carrot nose and a red hat.\n\nAnother reason is hot cocoa. Mom makes it after we play outside, and it warms my hands. That is why winter is the best season of all!',
      note: T('先說看法，再給兩個理由，每個理由都多加一句細節，最後把看法說一次。', 'The opinion comes first, then two reasons, each with an extra detail, and the ending says the opinion again.'),
    },
    vocab: ['because', 'also', 'another', 'that is why'],
  },
];

export default { skills, prompts };
