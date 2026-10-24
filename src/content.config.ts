import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { WORLDS, PHASES, COLLECTIONS } from './data/worlds.mjs';

const worldIds = WORLDS.map((w) => w.id) as [string, ...string[]];
const phaseIds = PHASES.map((p) => p.id) as [string, ...string[]];
const tagIds = COLLECTIONS.map((c) => c.id) as [string, ...string[]];

const moons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/moons' }),
  schema: z.object({
    world: z.enum(worldIds),
    number: z.number().int().positive(),
    name: z.string(),
    phase: z.enum(phaseIds),
    multi: z.boolean(),
    location: z.string(),
    unlock: z.string(),
    tags: z.array(z.enum(tagIds)),
    captures: z.array(z.string()),
    checkpoint: z.string().nullable(),
    difficulty: z.enum(['easy', 'medium', 'hard']).nullable(),
    // Flip to true once the step-by-step guide below the front matter is real.
    written: z.boolean(),
  }),
});

export const collections = { moons };
