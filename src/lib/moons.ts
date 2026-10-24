import { getCollection, type CollectionEntry } from 'astro:content';
import { WORLDS, PHASES } from '../data/worlds.mjs';

export type Moon = CollectionEntry<'moons'>;

const worldOrder = new Map(WORLDS.map((w, i) => [w.id, i]));
const phaseOrder = new Map(PHASES.map((p, i) => [p.id, i]));

/** All moons in story order: world, then in-game number. */
export async function allMoons(): Promise<Moon[]> {
  const moons = await getCollection('moons');
  return moons.sort(
    (a, b) =>
      worldOrder.get(a.data.world)! - worldOrder.get(b.data.world)! ||
      a.data.number - b.data.number,
  );
}

/** Stable id used for the checklist, e.g. "sand-3". */
export const moonKey = (m: Moon) => `${m.data.world}-${m.data.number}`;

/** URL slug for a moon page, taken from its file name. */
export const moonSlug = (m: Moon) => m.id.split('/').pop()!;

export const worldOf = (id: string) => WORLDS.find((w) => w.id === id)!;
export const phaseOf = (id: string) => PHASES.find((p) => p.id === id)!;
export const phaseIndex = (id: string) => phaseOrder.get(id)!;

/** Prefix a site path with the configured base. */
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export const moonUrl = (m: Moon) => url(`worlds/${m.data.world}/moons/${moonSlug(m)}/`);

/** Counts per phase, plus locations and moon total (Multi Moons count 3). */
export function tally(moons: Moon[]) {
  const byPhase: Record<string, number> = Object.fromEntries(PHASES.map((p) => [p.id, 0]));
  let value = 0;
  for (const m of moons) {
    byPhase[m.data.phase]++;
    value += m.data.multi ? 3 : 1;
  }
  return { byPhase, locations: moons.length, value };
}
