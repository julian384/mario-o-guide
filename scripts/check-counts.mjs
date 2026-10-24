// Checks the moon files against the expected per-world, per-phase counts.
// Run with `npm test`. Exits non-zero on any mismatch.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { WORLDS } from '../src/data/worlds.mjs';

const DIR = new URL('../src/content/moons', import.meta.url).pathname;

// [first-visit, return-trip, post-game, moon-rock, multi]
const EXPECTED = {
  cap: [11, 0, 6, 14, 0],
  cascade: [4, 17, 4, 15, 1],
  sand: [47, 15, 7, 20, 2],
  lake: [19, 8, 6, 9, 1],
  wooded: [42, 8, 4, 22, 2],
  cloud: [1, 0, 1, 7, 0],
  lost: [20, 1, 4, 10, 0],
  metro: [48, 5, 13, 15, 2],
  snow: [17, 17, 3, 18, 1],
  seaside: [43, 7, 2, 19, 1],
  luncheon: [44, 5, 7, 12, 2],
  ruined: [2, 2, 1, 5, 1],
  bowser: [28, 10, 7, 17, 1],
  moon: [14, 0, 13, 11, 0],
  mushroom: [0, 0, 104, 0, 6],
  dark: [0, 0, 24, 0, 1],
  darker: [0, 0, 1, 0, 1],
};
const PHASE_IDX = { 'first-visit': 0, 'return-trip': 1, 'post-game': 2, 'moon-rock': 3 };

let errors = 0;
let locations = 0;
let moons = 0;
for (const { id } of WORLDS) {
  const got = [0, 0, 0, 0, 0];
  const numbers = new Set();
  for (const f of readdirSync(join(DIR, id))) {
    const text = readFileSync(join(DIR, id, f), 'utf8');
    const phase = text.match(/^phase: (.+)$/m)[1];
    const multi = /^multi: true$/m.test(text);
    numbers.add(Number(text.match(/^number: (\d+)$/m)[1]));
    got[PHASE_IDX[phase]]++;
    if (multi) got[4]++;
    locations++;
    moons += multi ? 3 : 1;
  }
  const total = got[0] + got[1] + got[2] + got[3];
  if (numbers.size !== total || Math.max(...numbers) !== total) {
    console.error(`${id}: moon numbers are not a clean 1..${total} run`);
    errors++;
  }
  if (got.join() !== EXPECTED[id].join()) {
    console.error(`${id}: expected ${EXPECTED[id].join('/')}, got ${got.join('/')}`);
    errors++;
  }
}
if (locations !== 836) { console.error(`expected 836 moon locations, got ${locations}`); errors++; }
if (moons !== 880) { console.error(`expected 880 moons counting Multi Moons as 3, got ${moons}`); errors++; }

if (errors) process.exit(1);
console.log(`OK: ${locations} moon locations, ${moons} moons.`);
