# Odyssey Moon Guide

A static site with a guide to every Power Moon in Super Mario Odyssey, organized world by world and by when each moon unlocks.

## Phases

Every moon is filed under the earliest point you can collect it:

| Phase | Meaning | Moons |
| --- | --- | ---: |
| First visit | Available during the kingdom's story | 340 |
| Return trip | After the kingdom's story, a later visit, or another kingdom's progress; still before Bowser | 95 |
| Post-game | After beating Bowser, including the Mushroom Kingdom, Dark Side and Darker Side | 207 |
| Moon Rock | After breaking the kingdom's Moon Rock (post-game) | 194 |

That's 836 moon locations; the 22 Multi Moons count as three each, for 880.

## Working on it

```sh
npm install
npm run dev       # local dev server (search only works after a build)
npm test          # checks per-world and per-phase moon counts
npm run build     # builds to dist/ and indexes search with Pagefind
npm run preview
```

## Writing a guide

Each moon is a Markdown file in `src/content/moons/<world>/`, named by its in-game number:

```md
---
world: sand
number: 1
name: "Atop the Highest Tower"
phase: first-visit
multi: false
location: "Round Tower, Tostarena Ruins"
unlock: "Available from the start"
tags: []
captures: []          # e.g. [bullet-bill, glydon]
checkpoint: null      # e.g. "Tostarena Ruins"
difficulty: null      # easy | medium | hard
written: false        # set to true once the guide below is real
---
Step-by-step guide goes here.
```

The schema in `src/content.config.ts` rejects typos in worlds, phases and tags at build time.

## Moon data

`data/raw/<world>.txt` holds the source list (`number|name|location|unlock note[|MULTI]`), based on MarioWiki's Power Moon lists. `npm run seed` regenerates the front matter of every moon file from it and the phase rules in `scripts/seed-moons.mjs`, while keeping any guide text you've written.

## Deploying

Pushing to `main` builds and deploys to GitHub Pages through `.github/workflows/deploy.yml`. In the repo settings, set Pages to deploy from **GitHub Actions**.
