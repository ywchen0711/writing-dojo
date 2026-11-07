// Shared tools for the writing drills: a seeded random source, bilingual text, small English helpers and answer
// builders. Practice sentences are English; instructions and explanations are bilingual T(zh, en).
export function rng(seed) {
  let a = seed >>> 0;
  const f = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  f.shuffle = (arr) => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  f.sample = (arr, k) => f.shuffle(arr).slice(0, k);
  f.chance = (p) => f() < p;
  return f;
}

// ---- bilingual text ----
export const T = (zh, en) => ({ zh, en });
export const tx = (x, lang) => (x == null ? '' : typeof x === 'object' && !Array.isArray(x) ? x[lang] ?? x.en : String(x));
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- English helpers ----
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const low = (s) => s.charAt(0).toLowerCase() + s.slice(1);
export const an = (w) => (/^(hour|honest|honor)/i.test(w) ? 'an' : /^(uni|use|euro|one)/i.test(w) ? 'a' : /^[aeiou]/i.test(w) ? 'an' : 'a');
export const withA = (w) => `${an(w)} ${w}`;
const IRR_PL = { child: 'children', man: 'men', woman: 'women', mouse: 'mice', goose: 'geese', tooth: 'teeth', foot: 'feet', person: 'people', ox: 'oxen', sheep: 'sheep', deer: 'deer', fish: 'fish', moose: 'moose', leaf: 'leaves', knife: 'knives', wife: 'wives', life: 'lives', wolf: 'wolves', half: 'halves', shelf: 'shelves', calf: 'calves', loaf: 'loaves', thief: 'thieves', cactus: 'cacti', potato: 'potatoes', tomato: 'tomatoes', hero: 'heroes', echo: 'echoes' };
export function plural(w) {
  if (IRR_PL[w]) return IRR_PL[w];
  if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
  return w + 's';
}
// third person singular: run → runs, watch → watches, carry → carries, have → has
export function third(v) {
  if (v === 'have') return 'has'; if (v === 'be') return 'is'; if (v === 'do') return 'does'; if (v === 'go') return 'goes';
  if (/(s|x|z|ch|sh|o)$/.test(v)) return v + 'es';
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ies';
  return v + 's';
}
export const IRR_PAST = { be: 'was', begin: 'began', bite: 'bit', blow: 'blew', break: 'broke', bring: 'brought', build: 'built', buy: 'bought', catch: 'caught', choose: 'chose', come: 'came', do: 'did', draw: 'drew', drink: 'drank', drive: 'drove', eat: 'ate', fall: 'fell', feel: 'felt', find: 'found', fly: 'flew', forget: 'forgot', get: 'got', give: 'gave', go: 'went', grow: 'grew', have: 'had', hear: 'heard', hide: 'hid', hold: 'held', keep: 'kept', know: 'knew', leave: 'left', lose: 'lost', make: 'made', meet: 'met', pay: 'paid', put: 'put', read: 'read', ride: 'rode', ring: 'rang', run: 'ran', say: 'said', see: 'saw', sell: 'sold', send: 'sent', sing: 'sang', sit: 'sat', sleep: 'slept', speak: 'spoke', spend: 'spent', stand: 'stood', swim: 'swam', take: 'took', teach: 'taught', tell: 'told', think: 'thought', throw: 'threw', wake: 'woke', wear: 'wore', win: 'won', write: 'wrote' };
export function past(v) {
  if (IRR_PAST[v]) return IRR_PAST[v];
  if (/e$/.test(v)) return v + 'd';
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ied';
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(v)) return v + v.slice(-1) + 'ed';   // stop → stopped
  return v + 'ed';
}
// split a sentence into tappable words (punctuation stays attached to its word)
export const words = (s) => s.trim().split(/\s+/);
export const list = (xs, and = 'and') => (xs.length <= 2 ? xs.join(` ${and} `) : `${xs.slice(0, -1).join(', ')}, ${and} ${xs[xs.length - 1]}`);

// common names for practice sentences (English names; Chinese text may use them as-is)
export const NAMES = ['Max', 'Mia', 'Leo', 'Emma', 'Jay', 'Ava', 'Noah', 'Lily', 'Ethan', 'Zoe', 'Ben', 'Chloe', 'Sam', 'Grace', 'Ryan', 'Ella', 'Owen', 'Ruby', 'Lucas', 'Nora'];

// ---- answers ----
// options[0] is the right one; the app shuffles them. Options are strings (English, HTML ok) or T(zh, en).
export const ansChoice = (options) => ({ type: 'choice', options, correct: 0 });
// tap the word(s) in a sentence: words = the tokens shown, correct = indexes the student must select (all of them, no others)
export const ansTap = (wordsArr, correct) => ({ type: 'tap', words: wordsArr, correct: [].concat(correct) });
// put items in the right order (items given in the right order; the app shuffles)
export const ansOrder = (items) => ({ type: 'order', items });
// type a word or short phrase; v = accepted answers; cs = case-sensitive (for capitalization drills)
export const ansText = (v, cs = false) => ({ type: 'text', v: [].concat(v), text: [].concat(v)[0], cs });
