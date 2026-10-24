// Generates one Markdown file per moon from data/raw/<world>.txt.
//
// Raw line format: number|name|location|unlock note[|MULTI]
// Existing files keep their guide text; only the front matter is rewritten.
//
//   node scripts/seed-moons.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { WORLDS } from '../src/data/worlds.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const RAW = join(ROOT, 'data/raw');
const OUT = join(ROOT, 'src/content/moons');

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Phase rules per world, by in-game moon number. Anything not listed is
// "first-visit". See the About page for how edge cases were decided.
const PHASE_RULES = {
  cap: { c: range(12, 17), d: range(18, 31) },
  cascade: { b: [...range(5, 20), 24], c: [21, 22, 23, 25], d: range(26, 40) },
  sand: { b: [15, 22, 23, 28, 29, 30, 31, 34, 35, 37, 38, 39, 49, 60, 61], c: range(63, 69), d: range(70, 89) },
  lake: { b: [9, 10, 11, 15, 16, 20, 26, 27], c: range(28, 33), d: range(34, 42) },
  wooded: { b: [20, 22, 27, 37, 38, 47, 48, 49], c: range(51, 54), d: range(55, 76) },
  cloud: { c: [2], d: range(3, 9) },
  lost: { b: [13], c: range(22, 25), d: range(26, 35) },
  metro: { b: [17, 19, 20, 51, 52], c: range(54, 66), d: range(67, 81) },
  snow: { b: [10, 13, 14, 15, 16, 17, 20, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33], c: range(35, 37), d: range(38, 55) },
  seaside: { b: [15, 28, 29, 33, 37, 38, 49], c: [51, 52], d: range(53, 71) },
  luncheon: { b: [20, 35, 36, 47, 48], c: range(50, 56), d: range(57, 68) },
  ruined: { b: [3, 4], c: [5], d: range(6, 10) },
  bowser: { b: [9, 10, 15, 17, 27, 30, 33, 34, 35, 36], c: range(39, 45), d: range(46, 62) },
  moon: { c: range(15, 27), d: range(28, 38) },
  mushroom: { all: 'post-game' },
  dark: { all: 'post-game' },
  darker: { all: 'post-game' },
};

function phaseFor(world, n) {
  const r = PHASE_RULES[world];
  if (r.all) return r.all;
  if (r.d?.includes(n)) return 'moon-rock';
  if (r.c?.includes(n)) return 'post-game';
  if (r.b?.includes(n)) return 'return-trip';
  return 'first-visit';
}

const TAG_RULES = [
  [/^Peach in|Princess Peach, Home/, 'peach'],
  [/Captain Toad/, 'captain-toad'],
  [/^Shopping (in|on|at|Near)/, 'shop'],
  [/Regular Cup|Master Cup/, 'koopa-race'],
  [/^Found with .* Art/, 'hint-art'],
  [/Timer Challenge(?! (Amateur|Professional))/, 'timer-challenge'],
  [/^Taking Notes/, 'music-notes'],
  [/^Caught Hopping/, 'rabbit'],
  [/^Secret Path/, 'secret-path'],
  [/Tourist/, 'tourist'],
  [/Rematch$/, 'rematch'],
];

function tagsFor(world, n, name) {
  // Toadette achievements name other moon types ("Captain Toad Greeter"),
  // so they only get their own tag.
  if (world === 'mushroom' && n >= 44) return ['toadette'];
  return TAG_RULES.filter(([re]) => re.test(name)).map(([, t]) => t);
}

const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const q = (s) => JSON.stringify(s);

function frontMatter(m) {
  return [
    '---',
    `world: ${m.world}`,
    `number: ${m.number}`,
    `name: ${q(m.name)}`,
    `phase: ${m.phase}`,
    `multi: ${m.multi}`,
    `location: ${q(m.location)}`,
    `unlock: ${q(m.unlock)}`,
    `tags: [${m.tags.join(', ')}]`,
    `captures: []`,
    `checkpoint: null`,
    `difficulty: null`,
    `written: false`,
    '---',
  ].join('\n');
}

const STUB = '\nThis guide hasn\'t been written yet. The location note above should get you close.\n';

let total = 0;
for (const { id: world } of WORLDS) {
  const lines = readFileSync(join(RAW, `${world}.txt`), 'utf8').trim().split('\n');
  const dir = join(OUT, world);
  mkdirSync(dir, { recursive: true });
  const existing = new Map(
    readdirSync(dir).map((f) => [Number(f.split('-')[0]), join(dir, f)]),
  );

  for (const line of lines) {
    const [num, name, location, unlock, flag] = line.split('|');
    const number = Number(num);
    const m = {
      world,
      number,
      name,
      location,
      unlock,
      multi: flag === 'MULTI',
      phase: phaseFor(world, number),
      tags: tagsFor(world, number, name),
    };
    const file = existing.get(number) ?? join(dir, `${String(number).padStart(3, '0')}-${slugify(name)}.md`);
    let body = STUB;
    let fm = frontMatter(m);
    if (existsSync(file)) {
      const prev = readFileSync(file, 'utf8');
      body = prev.replace(/^---\n[\s\S]*?\n---\n?/, '\n');
      // Keep fields a person filled in by hand.
      for (const key of ['captures', 'checkpoint', 'difficulty', 'written']) {
        const line = prev.match(new RegExp(`^${key}: .*$`, 'm'));
        if (line) fm = fm.replace(new RegExp(`^${key}: .*$`, 'm'), line[0]);
      }
    }
    writeFileSync(file, fm + body);
    total++;
  }
}
console.log(`Wrote ${total} moon files.`);
