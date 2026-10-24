// Shared world, phase and collection definitions. Plain JS so both the
// seed script (Node) and the Astro site can import it.

export const PHASES = [
  {
    id: 'first-visit',
    name: 'First visit',
    short: 'Phase 1',
    blurb: 'Available while you are in the kingdom during the story, including its Multi Moons.',
  },
  {
    id: 'return-trip',
    name: 'Return trip',
    short: 'Phase 2',
    blurb: "Appear after the kingdom's story ends, on a later visit, or after progress in another kingdom. All before Bowser.",
  },
  {
    id: 'post-game',
    name: 'Post-game',
    short: 'Phase 3',
    blurb: 'Unlock after you beat Bowser in the Moon Kingdom. Peach visits, Koopa races, and the Mushroom Kingdom, Dark Side and Darker Side.',
  },
  {
    id: 'moon-rock',
    name: 'Moon Rock',
    short: 'Phase 4',
    blurb: "Released by breaking the kingdom's Moon Rock, which you can only do after beating Bowser. Shown as yellow X marks on the map.",
  },
];

export const SPOILER_PHASES = ['post-game', 'moon-rock'];

// In story order. `area` is the in-game place name shown on the map screen.
export const WORLDS = [
  { id: 'cap', name: 'Cap Kingdom', area: 'Bonneton', note: 'Most moons appear once you return after the Cascade Kingdom.' },
  { id: 'cascade', name: 'Cascade Kingdom', area: 'Fossil Falls' },
  { id: 'sand', name: 'Sand Kingdom', area: 'Tostarena' },
  { id: 'lake', name: 'Lake Kingdom', area: 'Lake Lamode' },
  { id: 'wooded', name: 'Wooded Kingdom', area: 'Steam Gardens' },
  { id: 'cloud', name: 'Cloud Kingdom', area: 'Nimbus Arena' },
  { id: 'lost', name: 'Lost Kingdom', area: 'Forgotten Isle' },
  { id: 'metro', name: 'Metro Kingdom', area: 'New Donk City' },
  { id: 'snow', name: 'Snow Kingdom', area: 'Shiveria' },
  { id: 'seaside', name: 'Seaside Kingdom', area: 'Bubblaine' },
  { id: 'luncheon', name: 'Luncheon Kingdom', area: 'Mount Volbono' },
  { id: 'ruined', name: 'Ruined Kingdom', area: 'Crumbleden' },
  { id: 'bowser', name: "Bowser's Kingdom", area: "Bowser's Castle" },
  { id: 'moon', name: 'Moon Kingdom', area: 'Honeylune Ridge' },
  { id: 'mushroom', name: 'Mushroom Kingdom', area: "Peach's Castle", note: 'Opens after you beat Bowser.' },
  { id: 'dark', name: 'Dark Side', area: 'Rabbit Ridge', note: 'Opens once you have 250 Power Moons.' },
  { id: 'darker', name: 'Darker Side', area: 'Culmina Crater', note: 'Opens once you have 500 Power Moons.' },
];

export const COLLECTIONS = [
  { id: 'peach', name: 'Peach', blurb: 'After the credits, Peach travels the kingdoms. Talk to her in each one.' },
  { id: 'captain-toad', name: 'Captain Toad', blurb: 'One Captain Toad moon in almost every kingdom.' },
  { id: 'hint-art', name: 'Hint Art', blurb: 'Paintings that show a ground-pound spot in a different kingdom.' },
  { id: 'koopa-race', name: 'Koopa Freerunning', blurb: 'Regular Cup and Master Cup races, all post-game.' },
  { id: 'shop', name: 'Crazy Cap shop', blurb: 'The first shop moon in each kingdom costs 100 coins.' },
  { id: 'secret-path', name: 'Secret Paths', blurb: 'Moons reached through a painting in another kingdom.' },
  { id: 'tourist', name: 'Tourist', blurb: 'A chain that follows the Tostarenan traveler from kingdom to kingdom.' },
  { id: 'timer-challenge', name: 'Timer Challenges', blurb: 'Scarecrows and switches that start a countdown.' },
  { id: 'music-notes', name: 'Taking Notes', blurb: 'Rainbow treble clefs that spawn a trail of notes.' },
  { id: 'rabbit', name: 'Rabbits', blurb: 'Catch the hopping rabbit for its moon.' },
  { id: 'rematch', name: 'Boss rematches', blurb: 'Mushroom Kingdom Multi Moons for beating story bosses again.' },
  { id: 'toadette', name: 'Toadette achievements', blurb: 'Rewards from Toadette in the Mushroom Kingdom for milestones across the game.' },
];
