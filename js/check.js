// Checking an answer to a drill. input depends on the type:
//   choice: the option index · tap: array of word indexes · order: array of item indexes (in the order chosen) · text: string
const norm = (s, cs) => { s = String(s).trim().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' '); return cs ? s : s.toLowerCase(); };
const bare = (s) => s.replace(/[.!?]+$/, '');

export function check(ans, input) {
  if (ans.type === 'choice') return { ok: input === ans.correct };
  if (ans.type === 'tap') {
    const a = [...new Set(input || [])].sort((x, y) => x - y), b = ans.correct.slice().sort((x, y) => x - y);
    return { ok: a.length === b.length && a.every((x, i) => x === b[i]), part: a.filter((x) => b.includes(x)).length };
  }
  if (ans.type === 'order') return { ok: Array.isArray(input) && input.length === ans.items.length && input.every((x, i) => x === i) };
  if (ans.type === 'text') {
    if (input == null || !String(input).trim()) return { ok: false };
    const g = norm(input, ans.cs);
    return { ok: ans.v.some((w) => { const k = norm(w, ans.cs); return k === g || bare(k) === bare(g); }) };
  }
  return { ok: false };
}
