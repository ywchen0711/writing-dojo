// All skills and writing tasks. Each file holds three grades; see SPEC.md for the format.
import g1 from './g01-03.js';
import g4 from './g04-06.js';
import g7 from './g07-09.js';
import g10 from './g10-12.js';
const banks = [g1, g4, g7, g10];
export default { skills: banks.flatMap((b) => b.skills), prompts: banks.flatMap((b) => b.prompts) };
