# Blackwood Manor Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the offline, single-folder website that hosts the Blackwood Manor murder night: setup, print pack, stage-by-stage game screen with timers, sounds and set pieces, vote and reveal.

**Architecture:** Static HTML + CSS + plain JavaScript loaded with classic `<script>` tags (no modules, no bundler) so `index.html` opens by double-click. All game text lives in `js/data.js`; all rules (station routing, riddle selection, roster, orphaned clues, team sentences, vote tally) live in `js/logic.js` as pure functions that also run under Node for tests. UI (`js/app.js`), audio (`js/audio.js`), print (`js/print.js`) and persistence (`js/game.js`) are separate files that only talk to each other through the `window.BM` namespace.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES2020), Web Audio API, `localStorage`, Node 18+ built-in test runner (`node --test`) for logic and content tests. No npm dependencies.

**Spec:** `docs/superpowers/specs/2026-11-03-blackwood-manor-design.md` (referred to as "the spec"). All card, narration and riddle text is copied verbatim from it.

---

## File structure

| File | Responsibility |
|---|---|
| `index.html` | Page shell: one `<section>` per screen, overlay container, print root, script tags |
| `css/style.css` | Theme tokens, screens, scene backdrops, fog/candle/lightning animations, timer, overlays, print styles |
| `js/data.js` | All content: stations, riddles, scenes, stages, characters, ledger, team envelopes, witness cards, set pieces, reveal. Defines `BM.data` |
| `js/logic.js` | Pure functions over `BM.data`: `stationFor`, `riddleFor`, `cardsAtStation`, `buildRoster`, `orphanedClues`, `teamSentence`, `tally`. Defines `BM.logic`. Works in Node via `module.exports` |
| `js/game.js` | Game state object, `localStorage` load/save, state transitions. Defines `BM.game` |
| `js/audio.js` | Web Audio synth sounds and ambience. Defines `BM.audio` |
| `js/print.js` | Builds print HTML for packs, labels, envelopes, ledger, host guide. Defines `BM.print` |
| `js/app.js` | DOM rendering, event wiring, timers, typewriter, overlays. Entry point |
| `assets/characters/*.jpg` | Character portraits renamed by character id |
| `assets/placeholder-maid.svg` | Portrait placeholder for the maid (no photo yet) |
| `test/logic.test.js` | Unit tests for `BM.logic` |
| `scripts/check-content.js` | Content integrity check over `BM.data` |
| `package.json` | `npm test` runs both |
| `README.md` | How to open, print, and run on the night |

Stage indexes: `0..8` map to ids `1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3`.

---

### Task 1: Scaffold, assets, and routing logic with tests

**Files:**
- Create: `package.json`, `index.html`, `js/logic.js`, `js/data.js` (stations + riddles only for now), `test/logic.test.js`, `assets/characters/*`, `.gitignore`

- [ ] **Step 1: Create package.json and .gitignore**

```json
{
  "name": "blackwood-manor",
  "version": "1.0.0",
  "private": true,
  "description": "Blackwood Manor murder night host website",
  "scripts": {
    "test": "node --test test/ && node scripts/check-content.js"
  }
}
```

`.gitignore`:
```
.DS_Store
node_modules
```

- [ ] **Step 2: Copy and rename the character photos**

Run from the project root:
```bash
mkdir -p assets/characters
cp 04afc72b-dea2-4ca2-b485-cae018044c1c.jpeg assets/characters/edgar.jpg
cp 7b6242ef-757b-4e92-b55b-a521f60c6e5b.jpeg assets/characters/malachi.jpg
cp 31f90508-a86c-4ebc-8107-c90de7a118f4.jpeg assets/characters/morgana.jpg
cp 757dcc5d-a64a-43d9-ab7c-a3b522f3cf5c.jpeg assets/characters/selene.jpg
cp 757dcc5d-a64a-43d9-ab7c-a3b522f3cf5c.jpeg assets/characters/luna.jpg
cp 1274adf3-e5ef-4bac-b82c-7286e962bad4.jpeg assets/characters/corvus.jpg
cp a6ea4ca9-c9a7-4076-a8ee-1bd853c452fb.jpeg assets/characters/krank.jpg
cp bcabfaa6-a23d-4867-9718-e7d47e6acc75.jpeg assets/characters/finch.jpg
cp d3f06b21-353c-4ca0-a5b0-26b410716982.jpeg assets/characters/graves.jpg
cp e3c7bb2f-7309-4651-89e3-3060000b3179.jpeg assets/characters/vane.jpg
cp e1369bdd-a26b-4a52-803e-33ad2a883b5b.jpeg assets/characters/khamun.jpg
cp eeb70a1b-2546-4946-96b1-8447991ae3ef.jpeg assets/characters/zora.jpg
```

Create `assets/characters/agnes.svg` (placeholder until the maid photo arrives):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#1a1216"/><circle cx="150" cy="140" r="60" fill="#3a2a30"/><rect x="70" y="220" width="160" height="160" rx="30" fill="#3a2a30"/><rect x="100" y="250" width="100" height="120" fill="#e8e0d8"/><text x="150" y="395" font-size="18" fill="#9a8a90" text-anchor="middle" font-family="serif">The Maid</text></svg>
```

- [ ] **Step 3: Write the failing routing tests**

`test/logic.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../js/data.js');
const logic = require('../js/logic.js');

const finch = { id: 'finch', index: 0 };
const graves = { id: 'graves', index: 11 };
const luna = { id: 'luna', index: 12 };

test('stationFor rotates by stage from the character index', () => {
  assert.equal(logic.stationFor(finch, 0), 'Sofa');
  assert.equal(logic.stationFor(finch, 1), 'Bookshelf');
  assert.equal(logic.stationFor(finch, 8), 'Television');
  assert.equal(logic.stationFor(graves, 0), 'Cupboard');
});

test('luna uses the offset 5 instead of her index', () => {
  assert.equal(logic.stationFor(luna, 0), 'Cupboard');
  assert.equal(logic.stationFor(luna, 1), 'Sofa');
});

test('riddleFor picks the target station riddle variant by target stage mod 3', () => {
  const r0 = logic.riddleFor(data, finch, 0);
  assert.equal(r0, data.riddles.Sofa[0]);
  const r4 = logic.riddleFor(data, finch, 4); // station (0+4)%6 = Lamp, variant 4%3 = 1
  assert.equal(r4, data.riddles.Lamp[1]);
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `node --test test/`
Expected: FAIL, "Cannot find module '../js/data.js'".

- [ ] **Step 5: Create js/data.js with stations and the riddle bank**

`js/data.js` (characters, stages etc. are added in Tasks 2 and 3; keep this exact wrapper):
```js
(function (root) {
  const STATIONS = ['Sofa', 'Bookshelf', 'Television', 'Plant', 'Lamp', 'Cupboard'];
  const STAGE_IDS = ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3'];

  const riddles = {
    Sofa: [
      "I have arms but never hug; I hold the tired, I hold the snug. Look beneath me, look behind: your next secret you will find.",
      "Guests sink into me and sigh; in cushions soft do secrets lie.",
      "Three may sit on me as one; search my seams when searching's done."
    ],
    Bookshelf: [
      "A thousand voices, none that speak; between their spines is what you seek.",
      "I hold stories, stacked and tall; the one you need is not a book at all.",
      "Paper soldiers in a row, standing guard on what you know."
    ],
    Television: [
      "A glass face that never blinks shows you more than it ever thinks.",
      "Dark mirror on the wall: it shows the world but hides it all.",
      "It talks all day but never listens; behind its back a secret glistens."
    ],
    Plant: [
      "Green and growing, never walking; keeps its secrets, never talking.",
      "I drink but never thirst; I'm rooted, never cursed. Dig gently where I stand.",
      "Leaves that never leave the room; search beneath the quiet bloom."
    ],
    Lamp: [
      "A sun that sleeps by day and wakes at night to light your way.",
      "I wear a hat but have no head; look under it before you're led.",
      "Moths adore me, shadows flee; your next clue is close to me."
    ],
    Cupboard: [
      "Doors that open, doors that close; what I hide, nobody knows.",
      "I have shelves but tell no tales; behind my door the secret pales.",
      "Wooden belly, hungry maw; open me and find your clue."
    ]
  };

  const data = { STATIONS, STAGE_IDS, riddles };

  root.BM = root.BM || {};
  root.BM.data = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 6: Create js/logic.js with stationFor and riddleFor**

```js
(function (root) {
  const STATIONS = ['Sofa', 'Bookshelf', 'Television', 'Plant', 'Lamp', 'Cupboard'];
  const LUNA_OFFSET = 5;

  function stationIndexFor(character, stageIndex) {
    const base = character.id === 'luna' ? LUNA_OFFSET : character.index;
    return (base + stageIndex) % STATIONS.length;
  }

  function stationFor(character, stageIndex) {
    return STATIONS[stationIndexFor(character, stageIndex)];
  }

  function riddleFor(data, character, targetStageIndex) {
    const station = stationFor(character, targetStageIndex);
    return data.riddles[station][targetStageIndex % 3];
  }

  const logic = { STATIONS, stationFor, riddleFor };

  root.BM = root.BM || {};
  root.BM.logic = logic;
  if (typeof module !== 'undefined' && module.exports) module.exports = logic;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `node --test test/`
Expected: 3 passing.

- [ ] **Step 8: Create the index.html shell**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blackwood Manor</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-scene="0">
<div class="fog fog-a"></div>
<div class="fog fog-b"></div>
<div class="lightning" id="lightning"></div>

<main id="app">
  <section id="screen-title" class="screen"></section>
  <section id="screen-setup" class="screen"></section>
  <section id="screen-print" class="screen"></section>
  <section id="screen-game" class="screen"></section>
  <section id="screen-vote" class="screen"></section>
  <section id="screen-result" class="screen"></section>
</main>

<div id="overlay" class="overlay hidden"></div>
<div id="print-root" class="print-root"></div>

<script src="js/data.js"></script>
<script src="js/logic.js"></script>
<script src="js/game.js"></script>
<script src="js/audio.js"></script>
<script src="js/print.js"></script>
<script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 9: Commit**

```bash
git add package.json .gitignore index.html js/data.js js/logic.js test/logic.test.js assets
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Scaffold site, routing logic and character assets"
```

---

### Task 2: Non-character content and the content checker

**Files:**
- Modify: `js/data.js` (add scenes, stages, ledger, teams, envelopes, witness cards, set pieces, reveal)
- Create: `scripts/check-content.js`

- [ ] **Step 1: Write the content checker so it fails on the current data**

`scripts/check-content.js`:
```js
#!/usr/bin/env node
const data = require('../js/data.js');
const logic = require('../js/logic.js');
const problems = [];
const fail = (msg) => problems.push(msg);

// Stations and riddles
for (const s of data.STATIONS) {
  if (!data.riddles[s] || data.riddles[s].length !== 3) fail(`riddles for ${s} must have 3 variants`);
}

// Scenes and stages
if (!data.scenes || data.scenes.length !== 3) fail('expected 3 scenes');
if (!data.stages || data.stages.length !== 9) fail('expected 9 stages');
(data.stages || []).forEach((st, i) => {
  if (st.id !== data.STAGE_IDS[i]) fail(`stage ${i} id should be ${data.STAGE_IDS[i]}`);
  if (!st.narration || !st.narration.length) fail(`stage ${st.id} has no narration`);
  if (!st.clue) fail(`stage ${st.id} has no public clue`);
  if (!['individual', 'group', 'team'].includes(st.kind)) fail(`stage ${st.id} kind invalid`);
});

// Characters
const chars = data.characters || [];
if (chars.length !== 13) fail(`expected 13 characters, got ${chars.length}`);
const ids = new Set();
chars.forEach((c) => {
  if (ids.has(c.id)) fail(`duplicate id ${c.id}`);
  ids.add(c.id);
  if (!c.intro || !c.intro.text || !c.intro.publicLine || !c.intro.quirk) fail(`${c.id} intro incomplete`);
  for (const sid of data.STAGE_IDS) {
    const card = c.cards && c.cards[sid];
    if (!card || !card.text) fail(`${c.id} missing card ${sid}`);
  }
  if (!['delilah', 'victor'].includes(c.team)) fail(`${c.id} team invalid`);
  if (c.cards && c.cards['3.1'] && !c.cards['3.1'].word) fail(`${c.id} 3.1 has no team word`);
  if (c.cards && c.cards['3.2'] && !c.cards['3.2'].word) fail(`${c.id} 3.2 has no team word`);
  if (c.cards && c.cards['3.3'] && !c.cards['3.3'].alibi) fail(`${c.id} 3.3 has no alibi`);
});

// Routing: 2 cards per station per stage, 3 where Luna lands
for (let s = 0; s < 9; s++) {
  const perStation = {};
  chars.forEach((c) => {
    const st = logic.stationFor(c, s);
    perStation[st] = (perStation[st] || 0) + 1;
  });
  const lunaStation = logic.stationFor({ id: 'luna', index: 12 }, s);
  for (const st of data.STATIONS) {
    const expected = st === lunaStation ? 3 : 2;
    if (perStation[st] !== expected) fail(`stage ${s} station ${st} has ${perStation[st]} cards, expected ${expected}`);
  }
}

// Ledger
const ledger = data.ledger || [];
if (ledger.length !== 13) fail(`expected 13 ledger strips, got ${ledger.length}`);
const holders = new Set();
ledger.forEach((strip, i) => {
  if (strip.number !== i + 1) fail(`ledger strip ${i} number should be ${i + 1}`);
  if (!ids.has(strip.holder)) fail(`ledger strip ${strip.number} holder ${strip.holder} unknown`);
  if (holders.has(strip.holder)) fail(`ledger holder ${strip.holder} used twice`);
  holders.add(strip.holder);
});

// Team sentences
for (const team of ['delilah', 'victor']) {
  for (const sid of ['3.1', '3.2']) {
    const members = chars.filter((c) => c.team === team);
    const idx = members.map((c) => c.cards[sid].word.index).sort((a, b) => a - b);
    idx.forEach((n, i) => { if (n !== i + 1) fail(`team ${team} ${sid} word indexes not 1..n`); });
    const sentence = members.slice().sort((a, b) => a.cards[sid].word.index - b.cards[sid].word.index).map((c) => c.cards[sid].word.text).join(' ');
    const env = data.teamEnvelopes && data.teamEnvelopes[team] && data.teamEnvelopes[team][sid];
    if (!env) fail(`missing team envelope ${team} ${sid}`);
    else if (env.sentence !== sentence) fail(`team ${team} ${sid} sentence mismatch: "${sentence}" vs "${env.sentence}"`);
    else if (!data.STATIONS.includes(env.station)) fail(`team ${team} ${sid} station invalid`);
  }
}

// Witness cards
for (const team of ['delilah', 'victor']) {
  const w = data.witnessCards && data.witnessCards[team];
  if (!w || !w.text || !ids.has(w.reader)) fail(`witness card for ${team} incomplete`);
}

// Killers
const killers = chars.filter((c) => c.killer).map((c) => c.id);
if (killers.length !== 2) fail(`expected 2 killers, got ${killers.join(',')}`);

if (problems.length) {
  console.error('Content check FAILED:');
  problems.forEach((p) => console.error(' - ' + p));
  process.exit(1);
}
console.log('Content check passed.');
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/check-content.js`
Expected: exit 1 with "expected 3 scenes", "expected 9 stages", "expected 13 characters" and more.

- [ ] **Step 3: Add scenes, stages, ledger, team envelopes, witness cards, set pieces and reveal to js/data.js**

Insert after `const riddles = {...};` and before `const data = ...`. Then extend `data` to `const data = { STATIONS, STAGE_IDS, riddles, scenes, stages, ledger, teamEnvelopes, witnessCards, setPieces, reveal, characters: [] };` (characters are filled in Task 3).

```js
  const scenes = [
    { number: 1, title: 'The Toast', subtitle: 'The lady is dead', theme: 'scene1' },
    { number: 2, title: 'The Master Falls', subtitle: 'The ghost speaks to all', theme: 'scene2' },
    { number: 3, title: 'Two Ghosts', subtitle: 'Two teams, two murders', theme: 'scene3' }
  ];

  const stages = [
    {
      id: '1.1', scene: 1, title: 'Who you are', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "Brother, I cannot see faces yet, only shapes. Make them tell me who they are. Each of them carries a lie they think is a costume. Let them find it. And brother: the glass that killed me was not the glass I was handed. Agnes poured it. Someone else touched it." }],
      clue: 'The glass that killed me was not the glass I was handed.',
      hostNotes: 'Players read privately. Nobody shares anything except their public line and their quirk. Discussion is introductions in character.'
    },
    {
      id: '1.2', scene: 1, title: 'Why you came', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "I wrote thirteen letters. I told each of them a piece of the truth, enough to bring them. Ask them why they came, brother, and watch who lies. And know this: someone in this room was paid to be blind tonight. I do not know by whom. I only know the envelope was heavy." }],
      clue: 'Someone in this room was paid to be blind tonight.',
      hostNotes: 'Players may share their invitation if they wish. Finch will not want to.'
    },
    {
      id: '1.3', scene: 1, title: 'What you saw', kind: 'group',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "They all saw something. None of them know it matters. Make them say it aloud, every one, and lay the pieces side by side. Brother, when I fell, I smelled jasmine. Over the wine. Under the wine. Jasmine." }],
      clue: 'Jasmine. I smelled jasmine when I fell.',
      hostNotes: 'Every player must state their observation aloud. Absent characters\' observations are listed below for the ghost to deliver. End the discussion with Victor\'s announcement, then press "The lights go out".',
      announcement: { speaker: 'Victor (alive, aloud)', text: "Enough. My sister died for a book. She tore its pages and hid them in this house so that no one of you could steal the whole of it. At midnight I will find every page and read every line, and if it ruins the name of Blackwood then let it. Nobody leaves this house before then. Nobody." },
      setPieceAfter: 'lightsOut'
    },
    {
      id: '2.1', scene: 2, title: 'What you hide', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (to the room)", text: "You can hear me now. All of you. Good; I am tired of whispering. My brother lies there with one hole in his neck. Not two. Not teeth. My brother fell by a needle, not a fang. Each of you hides something. Tonight it comes out. Go and find what you are." }],
      clue: 'My brother fell by a needle, not a fang.',
      hostNotes: 'The killers learn the truth on this card. Expect Krank to accuse Graves and Zora to blame the Witch\'s herbs. Let them.'
    },
    {
      id: '2.2', scene: 2, title: 'What you want', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost", text: "Now I know what you hide. Tell me what you want, and I will tell you what I see. I see two hands did this, and they have not yet shaken. Two of you. Strangers. Looking for each other across this room right now." }],
      clue: 'Two hands did this, and they have not yet shaken.',
      hostNotes: 'Both killers now hold the secret sign: "the candles burn low" / "and the wax remembers". Watch for it. Innocents have personal goals to play.'
    },
    {
      id: '2.3', scene: 2, title: 'The torn pages', kind: 'team',
      narration: [{ speaker: "Delilah's ghost", text: "I tore the ledger into thirteen pieces and hid them in this house. You have been carrying them to the table all night without knowing. Find your piece. Lay it down. All of them, on the table, in order; the candle in the margin burns lower on each. Then read my grandfather's confession aloud, together. Two of the lines on that page name the ones you seek. They will tell you the lines mean something else." }],
      clue: 'Two lines on that page name the ones you seek.',
      hostNotes: 'Enforce: every strip on the table, nobody keeps one. Absent characters\' strips are "found in the walls" by the ghost; hand them over. Expect Krank to say W.K. means War Kitchen and Zora to say Z. means Zeke. Selene reads Delilah\'s note (strip 1) aloud.'
    },
    {
      id: '3.1', scene: 3, title: 'The weapon', kind: 'team',
      narration: [{ speaker: 'Both ghosts', text: "Find your words. Speak them in order. Go where the sentence sends you. What you find there is what killed us." }],
      clue: 'What killed us is still in this room.',
      hostNotes: 'If a team is stuck for three minutes, the ghost whispers the full sentence. Zora will say TALKS instead of WALKS; Krank will say DRINKS instead of BLINKS.',
      setPieceBefore: 'victorReturns'
    },
    {
      id: '3.2', scene: 3, title: 'The witness', kind: 'team',
      narration: [{ speaker: 'Both ghosts', text: "Someone saw. Someone remembers. Find your words again. Go where the sentence sends you. Let the one named on the envelope read it, and let nobody interrupt." }],
      clue: 'The one who saw was never looked at.',
      hostNotes: 'Khamun reads the Team Delilah card; Edgar reads the Team Victor card. If either is absent, the matching ghost reads it (text below).'
    },
    {
      id: '3.3', scene: 3, title: 'The alibis', kind: 'individual',
      narration: [{ speaker: 'Both ghosts', text: "Last thing. Each of you, find your alibi and read it aloud, word for word, no additions. Then compare it with everything you have heard tonight. Every liar makes one mistake." }],
      clue: 'Every liar makes one mistake.',
      hostNotes: 'Zora says she never left the fireplace; Finch (1.3) and Agnes (1.3) saw her at the wine table. Krank says she was in the garden with Malachi; Malachi\'s alibi says he was alone. Then open the vote.'
    }
  ];

  const ledger = [
    { number: 1, holder: 'selene', text: "Note in Delilah's hand, tucked in the cover: \"I tore the pages and hid them through the house so that no one thief could take the whole truth. Only all of you together can read it. — D.\"" },
    { number: 2, holder: 'graves', text: "Terms: L.G. collects the 'lost' at midnight. Payment in gold. No questions. (Later hand in the margin: \"I stopped. Forgive me. — L.G., 1918\")" },
    { number: 3, holder: 'morgana', text: "Nurse Ashgrove's note, folded in the roll: \"They are not dying. He is letting them die. God forgive me, I counted.\"" },
    { number: 4, holder: 'krank', text: "Cellar roll, 1916. 'Lost' this month: 17 souls. Paid out: £136. — E.B." },
    { number: 5, holder: 'vane', text: "41. Pvt. T. Vane. Lung wound. 'Lost.' Sold, £8. Collected by L.G., midnight." },
    { number: 6, holder: 'corvus', text: "17. Pvt. D. Cole. Burns. 'Lost.' NOT collected. Escaped. Do not pursue; nobody will believe him. — E.B." },
    { number: 7, holder: 'malachi', text: "Buyer: L.G., undertaker, Graves & Sons, est. 1702. Collects at midnight. Does not sign. Does not age." },
    { number: 8, holder: 'agnes', text: "Nurse M. Ashgrove dismissed, 1917, for 'hysteria and witchcraft'. Her allegations are not to be repeated. — E.B." },
    { number: 9, holder: 'khamun', text: "Purchases, 1920: one sarcophagus, Theban, occupied. £400 from the cellar account. — E.B." },
    { number: 10, holder: 'zora', text: "Broker: Mme. Z. Finds the dying. Ten percent per soul. Paid in perpetuity 'for discretion'. — E.B." },
    { number: 11, holder: 'finch', text: "Retainer to Z.: paid every All Hallows' Eve, in perpetuity, for 'services of discretion'. Still paid. — E.B." },
    { number: 12, holder: 'luna', text: "Lab. W.K.: £2,000 monthly from the estate account. Subject: E.M., deceased, 'returned'. — V.B." },
    { number: 13, holder: 'edgar', text: "Private note, V.B., last week: \"Delilah is right. At midnight I read it all: grandfather's cellar, the broker, my laboratory. Then I end it. God help me, Edgar.\"" }
  ];

  const teamEnvelopes = {
    delilah: {
      '3.1': { sentence: 'LOOK WHERE GREEN GROWS BUT NEVER WALKS', station: 'Plant', title: 'THE VIAL', text: 'A small brown apothecary vial, corked, empty but for a purple residue. The label reads NIGHTSHADE. It smells overwhelmingly of jasmine. Discuss: who in this room smells of jasmine, and who covers bitter things with sweet ones?' },
      '3.2': { sentence: 'SEEK THE SPINES THAT HAVE NO BACKBONE', station: 'Bookshelf', title: 'THE WITNESS', text: 'To be read aloud by Khamun. If he is not here, Delilah\'s ghost reads it.' }
    },
    victor: {
      '3.1': { sentence: 'THE GLASS FACE THAT NEVER BLINKS', station: 'Television', title: 'THE SYRINGE', text: 'A glass syringe, plunger pressed, green residue inside. Scratched into the barrel: K-7. Discuss: who carries syringes, and who has seen that green before?' },
      '3.2': { sentence: 'A SUN THAT SLEEPS BY DAY', station: 'Lamp', title: 'THE WITNESS', text: 'To be read aloud by Edgar. If he is not here, Victor\'s ghost reads it.' }
    }
  };

  const witnessCards = {
    delilah: { reader: 'khamun', ghost: "Delilah's ghost", text: "I stood in the corner for an hour and nobody saw me, because nobody looks at furniture. Before the toast the lady's glass stood alone for one full minute. One person leaned over it. A short person. The hand that hovered over the glass wore five rings, and when it moved it jingled, and the air smelled of jasmine. When the lady fell, that hand wiped its rings with a handkerchief. I am decor. Decor does not lie." },
    victor: { reader: 'edgar', ghost: "Victor's ghost", text: "The night I died I was at my desk. Before everything went dark I heard a laugh, like a kettle coming to the boil. When I woke on the table the same laugh said 'It works!' Tonight, when the lights went out, I heard four quick steps from the study door and that laugh again, soft, pleased. Then Victor said something. A question. A name, I think. I could not catch it. But I know that laugh. I will know it until I die again." }
  };

  const setPieces = {
    prologue: {
      title: 'The Toast',
      lines: [
        { speaker: 'Victor (aloud)', text: "Friends. Strangers. Whatever the mummy is. Welcome to Blackwood Manor. My sister has gathered you here because she believes this house owes each of you a debt. At midnight she will pay it. Until then: eat, drink, and try not to touch the curtains, they are older than the undertaker. To Delilah." },
        { speaker: 'Stage direction', text: 'Delilah raises her glass, drinks, drops it, and falls. Dr. Corvus pronounces her dead. Press "She is dead".' }
      ]
    },
    sheIsDead: {
      title: 'She is dead',
      sound: 'bell',
      lines: [
        { speaker: 'Victor (aloud)', text: "She is… she is gone. I can hear her. Can none of you hear her? She is standing right there. She says one of you did this. And she says she will tell me who, piece by piece, if you will play her game. Each of you has a sheet. Each sheet has a riddle. Go." }
      ]
    },
    lightsOut: {
      title: 'The lights go out',
      sound: 'death',
      lines: [
        { speaker: 'Stage direction', text: 'Blackout. Victor collapses. Four seconds of dark, then still. When the lights return, Delilah\'s ghost speaks to everyone.' }
      ]
    },
    victorReturns: {
      title: 'Victor returns',
      sound: 'ghost',
      lines: [
        { speaker: "Victor's ghost", text: "Well. That was unpleasant. Delilah, you were right, and I am sorry, and I am also dead, so let us be efficient. Two murders, two teams. Those who came for my sister: stand with her. Those who came for me: stand with me. You will each receive one word. Alone your word is nothing. Together it is a place." },
        { speaker: "Delilah's ghost", text: "Team Delilah: Vane, Morgana, the cats, Khamun, Agnes, Zora. With me." },
        { speaker: "Victor's ghost", text: "Team Victor: Finch, Corvus, Edgar, Graves, Malachi, Krank. With me. Try not to die." }
      ]
    }
  };

  const reveal = {
    lines: [
      { speaker: "Delilah's ghost", text: "Madame Zora. Your grandmother found the dying for mine, and every year since, this house has paid you to forget it. I was going to stop the cheques. So you read my glass's fortune and poured nightshade into it, and your jasmine hid the taste but not the smell, and a mummy you never looked at watched you wipe your rings." },
      { speaker: "Victor's ghost", text: "Dr. Krank. I paid you to bring Edgar back and you brought back something that cannot sleep. I was going to read it all at midnight. So when the lights went out you crossed the room in four steps and gave me K-7, and you laughed, because you always laugh. Edgar heard you. Edgar always hears you." },
      { speaker: 'Both', text: "Two killers. Strangers until tonight. Allies by the candle. You found each other. Did they find you?" }
    ],
    houseWins: 'THE HOUSE WINS',
    killersWin: 'THE KILLERS WALK FREE',
    farewell: 'Blackwood Manor thanks you. Please return the mummy to the attic.'
  };
```

- [ ] **Step 4: Run the checker; only character errors should remain**

Run: `node scripts/check-content.js`
Expected: FAIL listing only "expected 13 characters, got 0" plus the routing lines (which depend on characters) and team/ledger holder lines. No scene or stage errors.

- [ ] **Step 5: Commit**

```bash
git add js/data.js scripts/check-content.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add scenes, stages, ledger, team and reveal content with content checker"
```

---

### Task 3: The thirteen characters

**Files:**
- Modify: `js/data.js` (fill `characters`)

Character object shape (every character uses exactly this):
```js
{
  id: 'finch', index: 0, symbol: '🔍', name: 'Inspector Ambrose Finch', short: 'Finch',
  costume: 'Detective', image: 'assets/characters/finch.jpg',
  team: 'victor', optional: false, killer: false, witness: false,
  intro: {
    text: 'You are Inspector Ambrose Finch of Scotland Yard, retired "for health reasons"; nobody asks which. Delilah Blackwood hired you by letter to guard "a book" tonight.',
    act: 'Squint through your magnifying glass at everything, including faces.',
    quirk: 'Say "Elementary" after other people\'s sentences, wrongly.',
    publicLine: 'I was hired by Lady Delilah to protect something tonight. I will not say what.'
  },
  cards: {
    '1.1': { text: '...' },
    '1.2': { text: '...' },
    '1.3': { text: '...' },                       // the observation; "Say this aloud." stays in the text
    '2.1': { text: '...', sabotage: '...' },      // sabotage only on killers
    '2.2': { text: '...', secretSign: true },     // secretSign only on killers
    '2.3': { text: '...', ledger: 11, sabotage: '...' },
    '3.1': { text: '...', word: { index: 1, text: 'THE' }, sabotage: '...' },
    '3.2': { text: '...', word: { index: 1, text: 'A' }, sabotage: '...' },
    '3.3': { text: '...', alibi: '...', lie: '...' }   // alibi is the quoted speech; lie only on killers
  }
}
```

- [ ] **Step 1: Transcribe all 13 characters from spec section 7 into `characters`**

Use the ids, indexes, symbols, teams and flags from this table, and copy every sentence of section 7 verbatim into the matching field. The `text` of card 3.3 is the alibi preamble ("Alibi:") and `alibi` is the quoted speech. The `text` of cards 3.1 and 3.2 is the content after the word. Sabotage sentences that begin with "**Sabotage:**" go in `sabotage`, not in `text`.

| id | index | symbol | team | optional | killer | witness | image |
|---|---|---|---|---|---|---|---|
| finch | 0 | 🔍 | victor | false | false | false | finch.jpg |
| vane | 1 | 🗡 | delilah | false | false | false | vane.jpg |
| selene | 2 | 🐾 | delilah | false | false | false | selene.jpg |
| krank | 3 | ⚗ | victor | false | true | false | krank.jpg |
| malachi | 4 | ⛧ | victor | false | false | false | malachi.jpg |
| agnes | 5 | 🗝 | delilah | true | false | false | agnes.svg |
| corvus | 6 | 🐦 | victor | false | false | false | corvus.jpg |
| khamun | 7 | ☥ | delilah | true | false | true | khamun.jpg |
| morgana | 8 | 🧙 | delilah | false | false | false | morgana.jpg |
| edgar | 9 | 📒 | victor | true | false | true | edgar.jpg |
| zora | 10 | 🔮 | delilah | false | true | false | zora.jpg |
| graves | 11 | 🎩 | victor | false | false | false | graves.jpg |
| luna | 12 | 🐾🐾 | delilah | true | false | false | luna.jpg |

Team words (index: word), from spec 5.8 and 5.9:
- delilah 3.1: vane 1 LOOK, morgana 2 WHERE, selene 3 GREEN, luna 4 GROWS, khamun 5 BUT, agnes 6 NEVER, zora 7 WALKS
- delilah 3.2: vane 1 SEEK, morgana 2 THE, selene 3 SPINES, luna 4 THAT, khamun 5 HAVE, agnes 6 NO, zora 7 BACKBONE
- victor 3.1: finch 1 THE, corvus 2 GLASS, edgar 3 FACE, graves 4 THAT, malachi 5 NEVER, krank 6 BLINKS
- victor 3.2: finch 1 A, corvus 2 SUN, edgar 3 THAT, graves 4 SLEEPS, malachi 5 BY, krank 6 DAY

Ledger numbers per character come from spec 5.6 (selene 1, graves 2, morgana 3, krank 4, vane 5, corvus 6, malachi 7, agnes 8, khamun 9, zora 10, finch 11, luna 12, edgar 13).

Add `data.characters = characters;` and `data.requiredIds = ['zora', 'krank'];` and `data.killerIds = ['zora', 'krank'];`.

- [ ] **Step 2: Run the checker and the tests**

Run: `npm test`
Expected: tests pass, then "Content check passed."

- [ ] **Step 3: Spot-check three cards against the spec by eye**

Open `js/data.js` and the spec side by side. Compare krank 2.1, zora 3.3 and khamun 3.2 word for word. Fix any drift.

- [ ] **Step 4: Commit**

```bash
git add js/data.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add the thirteen character packs"
```

---

### Task 4: Roster, orphaned clues, team sentences, tally

**Files:**
- Modify: `js/logic.js`, `test/logic.test.js`

- [ ] **Step 1: Append failing tests**

```js
function selectionWithout(...ids) {
  return { presentIds: data.characters.map((c) => c.id).filter((id) => !ids.includes(id)) };
}

test('buildRoster splits present and missing and reports missing killers', () => {
  const r = logic.buildRoster(data, selectionWithout('khamun', 'luna'));
  assert.equal(r.present.length, 11);
  assert.deepEqual(r.missing.map((c) => c.id), ['khamun', 'luna']);
  assert.deepEqual(r.errors, []);
  const bad = logic.buildRoster(data, selectionWithout('zora'));
  assert.equal(bad.errors.length, 1);
  assert.match(bad.errors[0], /Zora/);
});

test('buildRoster groups teams from present characters only', () => {
  const r = logic.buildRoster(data, selectionWithout('khamun'));
  assert.ok(r.teams.delilah.every((c) => c.team === 'delilah'));
  assert.ok(!r.teams.delilah.some((c) => c.id === 'khamun'));
  assert.equal(r.teams.victor.length, 6);
});

test('orphanedClues moves an absent witness card to the ghost at 3.2', () => {
  const r = logic.buildRoster(data, selectionWithout('khamun'));
  const o = logic.orphanedClues(data, r, '3.2');
  const witness = o.find((x) => x.kind === 'witness');
  assert.ok(witness);
  assert.equal(witness.reader, "Delilah's ghost");
  assert.match(witness.text, /Decor does not lie/);
  const word = o.find((x) => x.kind === 'word');
  assert.equal(word.text, 'HAVE');
});

test('orphanedClues returns observation at 1.3, ledger at 2.3, alibi at 3.3', () => {
  const r = logic.buildRoster(data, selectionWithout('agnes'));
  assert.equal(logic.orphanedClues(data, r, '1.3')[0].kind, 'observation');
  const ledger = logic.orphanedClues(data, r, '2.3')[0];
  assert.equal(ledger.kind, 'ledger');
  assert.equal(ledger.number, 8);
  assert.equal(logic.orphanedClues(data, r, '3.3')[0].kind, 'alibi');
  assert.deepEqual(logic.orphanedClues(data, r, '1.1'), []);
});

test('teamSentence orders words and flags missing holders', () => {
  const r = logic.buildRoster(data, selectionWithout('luna'));
  const s = logic.teamSentence(data, r, 'delilah', '3.1');
  assert.equal(s.sentence, 'LOOK WHERE GREEN GROWS BUT NEVER WALKS');
  assert.equal(s.station, 'Plant');
  assert.deepEqual(s.missing.map((w) => w.text), ['GROWS']);
});

test('tally counts votes and the house wins only when both killers are the clear top two', () => {
  const win = logic.tally({ a: ['zora', 'krank'], b: ['zora', 'krank'], c: ['zora', 'graves'] }, ['zora', 'krank']);
  assert.equal(win.counts.zora, 3);
  assert.equal(win.houseWins, true);
  const tie = logic.tally({ a: ['zora', 'krank'], b: ['zora', 'graves'] }, ['zora', 'krank']);
  assert.equal(tie.houseWins, false);
  const miss = logic.tally({ a: ['zora', 'graves'], b: ['zora', 'graves'] }, ['zora', 'krank']);
  assert.equal(miss.houseWins, false);
});

test('cardsAtStation lists every card routed to a station for a stage', () => {
  const cards = logic.cardsAtStation(data, 'Sofa', 0);
  assert.deepEqual(cards.map((c) => c.id).sort(), ['corvus', 'finch']);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test test/`
Expected: new tests FAIL with "logic.buildRoster is not a function".

- [ ] **Step 3: Implement the functions in js/logic.js**

Add before `const logic = ...` and extend the export object:
```js
  function buildRoster(data, selection) {
    const presentIds = new Set(selection.presentIds || []);
    const present = data.characters.filter((c) => presentIds.has(c.id));
    const missing = data.characters.filter((c) => !presentIds.has(c.id));
    const errors = (data.requiredIds || []).filter((id) => !presentIds.has(id)).map((id) => {
      const c = data.characters.find((x) => x.id === id);
      return `${c ? c.name : id} must be present: the story needs this killer.`;
    });
    return {
      present, missing, errors,
      teams: {
        delilah: present.filter((c) => c.team === 'delilah'),
        victor: present.filter((c) => c.team === 'victor')
      }
    };
  }

  function orphanedClues(data, roster, stageId) {
    const out = [];
    for (const c of roster.missing) {
      const card = c.cards[stageId];
      if (!card) continue;
      const base = { characterId: c.id, name: c.name, symbol: c.symbol };
      if (stageId === '1.3') out.push({ ...base, kind: 'observation', text: card.text });
      if (stageId === '2.3') {
        const strip = data.ledger.find((s) => s.holder === c.id);
        if (strip) out.push({ ...base, kind: 'ledger', number: strip.number, text: strip.text });
      }
      if ((stageId === '3.1' || stageId === '3.2') && card.word) {
        out.push({ ...base, kind: 'word', index: card.word.index, text: card.word.text, team: c.team });
      }
      if (stageId === '3.2' && c.witness) {
        const w = data.witnessCards[c.team];
        out.push({ ...base, kind: 'witness', reader: w.ghost, text: w.text });
      }
      if (stageId === '3.3') out.push({ ...base, kind: 'alibi', text: card.alibi });
    }
    return out;
  }

  function teamSentence(data, roster, team, stageId) {
    const presentIds = new Set(roster.present.map((c) => c.id));
    const words = data.characters
      .filter((c) => c.team === team && c.cards[stageId] && c.cards[stageId].word)
      .map((c) => ({ index: c.cards[stageId].word.index, text: c.cards[stageId].word.text, holder: c.id, holderName: c.short, present: presentIds.has(c.id) }))
      .sort((a, b) => a.index - b.index);
    const env = data.teamEnvelopes[team][stageId];
    return { words, sentence: words.map((w) => w.text).join(' '), station: env.station, missing: words.filter((w) => !w.present) };
  }

  function tally(votes, killerIds) {
    const counts = {};
    for (const picks of Object.values(votes)) {
      for (const s of picks || []) if (s) counts[s] = (counts[s] || 0) + 1;
    }
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const third = ranked[2] ? ranked[2][1] : -1;
    const topTwo = ranked.slice(0, 2);
    const houseWins = topTwo.length === 2 &&
      killerIds.every((k) => topTwo.some((e) => e[0] === k)) &&
      topTwo.every((e) => e[1] > third);
    return { counts, ranked, houseWins };
  }

  function cardsAtStation(data, station, stageIndex) {
    return data.characters.filter((c) => stationFor(c, stageIndex) === station);
  }
```
Export: `const logic = { STATIONS, stationFor, riddleFor, buildRoster, orphanedClues, teamSentence, tally, cardsAtStation };`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all tests pass; content check passed.

- [ ] **Step 5: Commit**

```bash
git add js/logic.js test/logic.test.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add roster, orphaned clue, team sentence and tally logic"
```

---

### Task 5: Game state and persistence

**Files:**
- Create: `js/game.js`, `test/game.test.js`

`js/game.js` must work in Node for tests, so it takes a storage object instead of touching `localStorage` directly.

- [ ] **Step 1: Write failing tests**

`test/game.test.js`:
```js
const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../js/data.js');
const logic = require('../js/logic.js');
const { createGame } = require('../js/game.js');

function memoryStorage() {
  const m = {};
  return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } };
}

test('defaults include all non-optional characters and 5/7 minute timers', () => {
  const g = createGame(data, logic, memoryStorage());
  const s = g.get();
  assert.equal(s.screen, 'title');
  assert.ok(s.presentIds.includes('zora'));
  assert.ok(!s.presentIds.includes('luna'));
  assert.equal(s.searchMin, 5);
  assert.equal(s.discussMin, 7);
});

test('set persists and load restores', () => {
  const storage = memoryStorage();
  const g = createGame(data, logic, storage);
  g.set({ stageIndex: 4, phase: 'search' });
  const g2 = createGame(data, logic, storage);
  assert.equal(g2.get().stageIndex, 4);
  assert.equal(g2.get().phase, 'search');
});

test('nextStage and prevStage clamp to 0..8 and reset phase', () => {
  const g = createGame(data, logic, memoryStorage());
  g.set({ stageIndex: 8, phase: 'done' });
  g.nextStage();
  assert.equal(g.get().stageIndex, 8);
  g.prevStage();
  assert.equal(g.get().stageIndex, 7);
  assert.equal(g.get().phase, 'narration');
});

test('roster uses presentIds and stage returns the current stage', () => {
  const g = createGame(data, logic, memoryStorage());
  g.togglePresent('luna');
  assert.ok(g.roster().present.some((c) => c.id === 'luna'));
  g.togglePresent('zora');
  assert.ok(g.roster().errors.length > 0);
  assert.equal(g.stage().id, '1.1');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test test/game.test.js`
Expected: FAIL "Cannot find module '../js/game.js'".

- [ ] **Step 3: Implement js/game.js**

```js
(function (root) {
  const KEY = 'blackwood-manor-state-v1';

  function createGame(data, logic, storage) {
    const defaults = () => ({
      screen: 'title',
      presentIds: data.characters.filter((c) => !c.optional).map((c) => c.id),
      names: {},
      searchMin: 5,
      discussMin: 7,
      sound: true,
      stageIndex: 0,
      phase: 'narration',
      timerEnd: null,
      timerKind: null,
      prologueDone: false,
      votes: {}
    });

    let state = load();

    function load() {
      try {
        const raw = storage.getItem(KEY);
        if (raw) return Object.assign(defaults(), JSON.parse(raw));
      } catch (e) { /* corrupt or unavailable storage: start fresh */ }
      return defaults();
    }
    function save() { try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
    function get() { return state; }
    function set(patch) { Object.assign(state, patch); save(); return state; }
    function reset() { state = defaults(); save(); return state; }
    function roster() { return logic.buildRoster(data, { presentIds: state.presentIds }); }
    function stage() { return data.stages[state.stageIndex]; }
    function nextStage() {
      if (state.stageIndex < data.stages.length - 1) set({ stageIndex: state.stageIndex + 1, phase: 'narration', timerEnd: null, timerKind: null });
    }
    function prevStage() {
      if (state.stageIndex > 0) set({ stageIndex: state.stageIndex - 1, phase: 'narration', timerEnd: null, timerKind: null });
    }
    function togglePresent(id) {
      const ids = new Set(state.presentIds);
      if (ids.has(id)) ids.delete(id); else ids.add(id);
      set({ presentIds: data.characters.map((c) => c.id).filter((x) => ids.has(x)) });
    }

    return { get, set, reset, roster, stage, nextStage, prevStage, togglePresent };
  }

  root.BM = root.BM || {};
  root.BM.createGame = createGame;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createGame };
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add js/game.js test/game.test.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add persisted game state"
```

---

### Task 6: Audio engine

**Files:**
- Create: `js/audio.js`

No unit tests (Web Audio needs a browser); verified in the Task 11 smoke test via the soundboard.

- [ ] **Step 1: Write js/audio.js**

```js
(function (root) {
  let ctx = null;
  let master = null;
  let enabled = true;
  let ambience = null;
  let noiseBuffer = null;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.8 : 0;
    master.connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function setEnabled(on) {
    enabled = on;
    if (master) master.gain.setTargetAtTime(on ? 0.8 : 0, ctx.currentTime, 0.05);
  }

  function noise() { const s = ctx.createBufferSource(); s.buffer = noiseBuffer; s.loop = true; return s; }
  function env(node, t0, attack, hold, release, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.setValueAtTime(peak, t0 + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
    node.connect(g); g.connect(master);
    return g;
  }

  function bell(t = ctx.currentTime, base = 220) {
    [1, 1.5, 2.4, 3.6].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * m;
      env(o, t, 0.01, 0, 3.5 - i * 0.5, 0.5 / (i + 1));
      o.start(t); o.stop(t + 4);
    });
  }

  function thunder(t = ctx.currentTime) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(60, t + 2.5);
    n.connect(f);
    env(f, t, 0.05, 0.3, 2.5, 1.0);
    n.start(t); n.stop(t + 3);
  }

  function thump(t, freq = 50) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    env(o, t, 0.005, 0.05, 0.2, 0.9);
    o.start(t); o.stop(t + 0.3);
  }
  function heartbeat(beats = 4, t = ctx.currentTime) {
    for (let i = 0; i < beats; i++) { thump(t + i * 0.9); thump(t + i * 0.9 + 0.25, 45); }
  }

  function tick(t = ctx.currentTime) {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 1800;
    env(o, t, 0.001, 0.005, 0.03, 0.15);
    o.start(t); o.stop(t + 0.05);
  }

  function whisper(t = ctx.currentTime, dur = 1.8) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 2;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 7;
    const lg = ctx.createGain(); lg.gain.value = 600;
    lfo.connect(lg); lg.connect(f.frequency);
    n.connect(f);
    env(f, t, 0.3, dur - 0.8, 0.5, 0.25);
    n.start(t); n.stop(t + dur); lfo.start(t); lfo.stop(t + dur);
  }

  function scream(t = ctx.currentTime) {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(500, t);
    o.frequency.exponentialRampToValueAtTime(1500, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(300, t + 1.2);
    const vib = ctx.createOscillator(); vib.frequency.value = 30;
    const vg = ctx.createGain(); vg.gain.value = 80; vib.connect(vg); vg.connect(o.frequency);
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(x * 4); }
    shaper.curve = curve;
    o.connect(shaper);
    env(shaper, t, 0.05, 0.6, 0.6, 0.5);
    o.start(t); o.stop(t + 1.4); vib.start(t); vib.stop(t + 1.4);
  }

  function puff(t = ctx.currentTime) {
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    n.connect(f);
    env(f, t, 0.01, 0.05, 0.25, 0.4);
    n.start(t); n.stop(t + 0.4);
  }

  const sounds = {
    bell: () => bell(),
    thunder: () => thunder(),
    heartbeat: () => heartbeat(4),
    tick: () => tick(),
    whisper: () => whisper(),
    scream: () => scream(),
    puff: () => puff(),
    death: () => { const t = ctx.currentTime; thunder(t); scream(t + 0.4); thunder(t + 1.2); },
    ghost: () => { const t = ctx.currentTime; whisper(t, 2.5); bell(t + 0.5, 110); },
    toll: () => { const t = ctx.currentTime; bell(t, 110); bell(t + 1.6, 110); bell(t + 3.2, 110); }
  };

  function play(name) {
    init();
    if (!ctx || !sounds[name]) return;
    sounds[name]();
  }

  function startAmbience(scene) {
    init();
    if (!ctx) return;
    stopAmbience();
    const presets = {
      1: { wind: 500, drone: 55, gain: 0.12 },
      2: { wind: 900, drone: 41, gain: 0.15 },
      3: { wind: 700, drone: 49, gain: 0.15 }
    };
    const p = presets[scene] || presets[1];
    const g = ctx.createGain(); g.gain.value = 0; g.connect(master);
    const n = noise();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.wind; f.Q.value = 0.7;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lg = ctx.createGain(); lg.gain.value = p.wind * 0.6;
    lfo.connect(lg); lg.connect(f.frequency);
    n.connect(f); f.connect(g);
    const d1 = ctx.createOscillator(); d1.type = 'sine'; d1.frequency.value = p.drone;
    const d2 = ctx.createOscillator(); d2.type = 'sine'; d2.frequency.value = p.drone * 1.005;
    const dg = ctx.createGain(); dg.gain.value = 0.5;
    d1.connect(dg); d2.connect(dg); dg.connect(g);
    n.start(); lfo.start(); d1.start(); d2.start();
    g.gain.setTargetAtTime(p.gain, ctx.currentTime, 1.5);
    ambience = { g, nodes: [n, lfo, d1, d2] };
  }

  function stopAmbience() {
    if (!ambience) return;
    const a = ambience; ambience = null;
    a.g.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    setTimeout(() => a.nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }), 3000);
  }

  root.BM = root.BM || {};
  root.BM.audio = { init, play, setEnabled, startAmbience, stopAmbience, names: Object.keys(sounds) };
})(window);
```

- [ ] **Step 2: Commit**

```bash
git add js/audio.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add Web Audio sound engine"
```

---

### Task 7: Stylesheet

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Write css/style.css**

```css
:root {
  --bg: #0b0709;
  --bg-2: #1a0f12;
  --ink: #e9dfd2;
  --ink-dim: #a39484;
  --gold: #c9a24a;
  --blood: #8f1d2c;
  --ghost: #9fd3ff;
  --green: #5fd38a;
  --violet: #a07cf0;
  --panel: rgba(20, 12, 14, 0.82);
  --panel-border: rgba(201, 162, 74, 0.35);
  --accent: var(--gold);
  --font-display: 'Cinzel Decorative', 'Times New Roman', serif;
  --font-body: 'IM Fell English', Georgia, serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  background: radial-gradient(ellipse at 50% 20%, var(--bg-2), var(--bg) 70%);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.5;
  overflow-x: hidden;
  transition: background 1.5s ease;
}
body[data-scene="1"] { --accent: var(--gold); background: radial-gradient(ellipse at 50% 10%, #3a1a10, #120806 60%, #050304); }
body[data-scene="2"] { --accent: var(--ghost); background: radial-gradient(ellipse at 50% 10%, #0f2438, #06101a 60%, #020406); }
body[data-scene="3"] { --accent: var(--violet); background: linear-gradient(100deg, #1a0f33 0%, #0a0612 50%, #0a1f16 100%); }

/* Fog */
.fog {
  position: fixed; inset: -20% -50%; pointer-events: none; z-index: 0; opacity: 0.35;
  background: radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.08), transparent 55%),
              radial-gradient(ellipse at 70% 40%, rgba(255,255,255,0.06), transparent 50%);
  animation: drift 60s linear infinite;
}
.fog-b { animation-duration: 95s; animation-direction: reverse; opacity: 0.25; }
@keyframes drift { from { transform: translateX(-10%) } to { transform: translateX(10%) } }

.lightning { position: fixed; inset: 0; background: #fff; opacity: 0; pointer-events: none; z-index: 50; }
.lightning.flash { animation: flash 0.9s ease-out; }
@keyframes flash { 0% { opacity: 0 } 5% { opacity: 0.9 } 12% { opacity: 0.1 } 20% { opacity: 0.7 } 100% { opacity: 0 } }

/* Layout */
#app { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 24px 16px 80px; }
.screen { display: none; }
.screen.active { display: block; animation: fade 0.6s ease; }
@keyframes fade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
h1, h2, h3 { font-family: var(--font-display); font-weight: 400; color: var(--accent); letter-spacing: 0.04em; margin: 0 0 12px; }
h1 { font-size: clamp(32px, 6vw, 64px); text-shadow: 0 0 24px rgba(201,162,74,0.35); }
h2 { font-size: clamp(22px, 3.5vw, 36px); }
h3 { font-size: 18px; color: var(--ink); }
p { margin: 0 0 12px; }
.dim { color: var(--ink-dim); }
.center { text-align: center; }

.panel {
  background: var(--panel); border: 1px solid var(--panel-border); border-radius: 10px;
  padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.grow { flex: 1; }

button, .btn {
  font-family: var(--font-display); font-size: 15px; letter-spacing: 0.06em;
  color: var(--ink); background: linear-gradient(#2a1a1d, #150c0e);
  border: 1px solid var(--accent); border-radius: 6px; padding: 12px 20px; cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s, background 0.2s;
}
button:hover { box-shadow: 0 0 18px rgba(201,162,74,0.35); transform: translateY(-1px); }
button:disabled { opacity: 0.4; cursor: default; box-shadow: none; transform: none; }
button.primary { background: linear-gradient(#5a1a24, #2b0c12); border-color: var(--blood); }
button.ghostly { border-color: var(--ghost); color: var(--ghost); }
button.small { padding: 6px 12px; font-size: 12px; }
input[type="number"], input[type="text"] {
  font-family: var(--font-body); font-size: 16px; color: var(--ink); background: #120a0c;
  border: 1px solid var(--panel-border); border-radius: 4px; padding: 8px 10px; width: 100%;
}
label { display: block; }

/* Title */
#screen-title { text-align: center; padding-top: 10vh; }
.candles { display: flex; justify-content: center; gap: 28px; margin: 30px 0; }
.candle { width: 14px; height: 60px; background: linear-gradient(#f3e6c8, #c9b08a); border-radius: 3px; position: relative; }
.candle::before {
  content: ''; position: absolute; left: 50%; top: -22px; width: 12px; height: 22px; transform: translateX(-50%);
  background: radial-gradient(ellipse at 50% 70%, #fff6c8, #ffb347 50%, transparent 72%);
  border-radius: 50% 50% 40% 40%; filter: blur(0.5px);
  animation: flicker 1.3s infinite alternate ease-in-out;
}
.candle:nth-child(2)::before { animation-delay: 0.4s; } .candle:nth-child(3)::before { animation-delay: 0.9s; }
@keyframes flicker { from { transform: translateX(-50%) scale(1, 1) } 50% { transform: translateX(-48%) scale(0.9, 1.15) } to { transform: translateX(-52%) scale(1.05, 0.9) } }
.manor { font-size: 14px; color: var(--ink-dim); letter-spacing: 0.3em; text-transform: uppercase; }

/* Setup */
.roster { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.char-card {
  position: relative; border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; cursor: pointer;
  background: #130b0d; transition: border-color 0.2s, transform 0.15s; user-select: none;
}
.char-card img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; display: block; filter: grayscale(0.9) brightness(0.45); transition: filter 0.3s; }
.char-card.on img { filter: none; }
.char-card.on { border-color: var(--accent); }
.char-card .cname { padding: 8px; font-size: 14px; text-align: center; }
.char-card .sym { position: absolute; top: 6px; left: 8px; font-size: 20px; text-shadow: 0 0 6px #000; }
.char-card.locked::after { content: 'required'; position: absolute; top: 6px; right: 8px; font-size: 11px; color: var(--gold); text-transform: uppercase; letter-spacing: 0.1em; }
.char-card input { margin: 0 8px 8px; width: calc(100% - 16px); font-size: 13px; padding: 5px; }
.error { color: #ff8a8a; }

/* Game */
.progress { display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; margin-bottom: 20px; }
.progress .step { height: 10px; border-radius: 5px; background: #2a1b1e; border: 1px solid var(--panel-border); cursor: pointer; }
.progress .step.done { background: var(--accent); opacity: 0.5; }
.progress .step.current { background: var(--accent); box-shadow: 0 0 12px var(--accent); }
.scene-label { font-family: var(--font-display); color: var(--accent); font-size: 14px; letter-spacing: 0.2em; text-transform: uppercase; }
.kind { display: inline-block; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 10px; border: 1px solid var(--accent); border-radius: 999px; color: var(--accent); margin-left: 10px; vertical-align: middle; }
.narration { font-size: 22px; line-height: 1.6; min-height: 120px; }
.narration .speaker { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 6px; }
.narration .typed::after { content: '▌'; animation: caret 0.8s steps(1) infinite; color: var(--accent); }
.narration .typed.finished::after { content: ''; }
@keyframes caret { 50% { opacity: 0 } }
.clue { border-left: 3px solid var(--blood); padding: 10px 16px; background: rgba(143,29,44,0.15); font-style: italic; font-size: 20px; margin-top: 16px; }
.phase-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
.timer { font-family: var(--font-display); font-size: clamp(56px, 12vw, 120px); text-align: center; color: var(--ink); line-height: 1; margin: 10px 0; letter-spacing: 0.05em; }
.timer.urgent { color: #ff6b6b; animation: pulse 1s infinite; }
.timer.over { color: var(--blood); }
@keyframes pulse { 50% { opacity: 0.5 } }
.timer-label { text-align: center; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-dim); font-size: 13px; }
details.host { border: 1px dashed var(--panel-border); border-radius: 8px; padding: 10px 16px; }
details.host summary { cursor: pointer; font-family: var(--font-display); color: var(--ink-dim); font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; }
details.host table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 10px; }
details.host td, details.host th { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 6px 8px; text-align: left; vertical-align: top; }
.orphan { background: rgba(159,211,255,0.08); border-left: 3px solid var(--ghost); padding: 8px 12px; margin: 8px 0; }
.soundboard { display: flex; gap: 8px; flex-wrap: wrap; }

/* Overlay set pieces */
.overlay { position: fixed; inset: 0; z-index: 100; background: #000; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 24px; }
.overlay.hidden { display: none; }
.overlay h1 { font-size: clamp(36px, 8vw, 90px); margin-bottom: 20px; animation: fade 2s ease; }
.overlay .lines { max-width: 800px; font-size: 22px; }
.overlay .lines .speaker { display: block; font-family: var(--font-display); font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-top: 18px; }
.overlay.blackout { background: #000; }
.overlay.flicker { animation: flickerbg 2.2s steps(1) forwards; }
@keyframes flickerbg { 0% { background: #000 } 10% { background: #2a1010 } 14% { background: #000 } 30% { background: #3a1818 } 33% { background: #000 } 60% { background: #1a0808 } 64% { background: #000 } 100% { background: #000 } }
.overlay.ghostly { background: radial-gradient(ellipse at 50% 40%, #0f2438, #000 70%); }
.ghost-shape { width: 120px; height: 160px; margin: 0 14px; border-radius: 60px 60px 10px 10px; background: radial-gradient(ellipse at 50% 30%, rgba(200,230,255,0.8), rgba(159,211,255,0.15) 70%, transparent); filter: blur(2px); display: inline-block; animation: hover 3s ease-in-out infinite; }
.ghost-shape.violet { background: radial-gradient(ellipse at 50% 30%, rgba(220,200,255,0.8), rgba(160,124,240,0.15) 70%, transparent); animation-delay: 1.5s; }
@keyframes hover { 50% { transform: translateY(-14px) } }

/* Vote */
.vote-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.voter { border: 1px solid var(--panel-border); border-radius: 8px; padding: 12px; background: #130b0d; }
.voter select { width: 100%; margin-top: 6px; font-family: var(--font-body); font-size: 15px; background: #0c0608; color: var(--ink); border: 1px solid var(--panel-border); padding: 6px; }
.tally { margin-top: 20px; }
.tally .bar { display: grid; grid-template-columns: 180px 1fr 40px; gap: 10px; align-items: center; margin: 6px 0; }
.tally .fill { height: 18px; background: linear-gradient(90deg, var(--blood), var(--accent)); border-radius: 9px; transition: width 0.4s; }
.reveal-portraits { display: flex; gap: 30px; justify-content: center; margin: 20px 0; }
.reveal-portraits img { width: 180px; aspect-ratio: 3/4; object-fit: cover; border-radius: 10px; border: 2px solid var(--blood); box-shadow: 0 0 40px rgba(143,29,44,0.8); animation: glow 2s ease-in-out infinite alternate; }
@keyframes glow { to { box-shadow: 0 0 80px rgba(255,60,80,0.9) } }
.result-title { font-size: clamp(36px, 8vw, 80px); }

/* Print pack (hidden on screen) */
.print-root { display: none; }
@media print {
  body { background: #fff !important; color: #000; font-size: 12pt; }
  .fog, .lightning, #app, #overlay { display: none !important; }
  .print-root { display: block; }
  @page { size: A4; margin: 12mm; }
  .sheet { page-break-after: always; font-family: Georgia, serif; }
  .sheet:last-child { page-break-after: auto; }
  .sheet h1 { font-family: Georgia, serif; font-size: 26pt; color: #000; text-shadow: none; margin-bottom: 4pt; }
  .sheet h2 { font-family: Georgia, serif; font-size: 16pt; color: #000; margin: 12pt 0 4pt; }
  .sheet .portrait { float: right; width: 45mm; aspect-ratio: 3/4; object-fit: cover; border: 1px solid #000; margin: 0 0 6mm 6mm; }
  .sheet .boxed { border: 1px solid #000; padding: 6pt 8pt; margin: 8pt 0; }
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0; height: 270mm; }
  .card { border: 1px dashed #666; padding: 6mm; font-size: 10.5pt; line-height: 1.35; display: flex; flex-direction: column; overflow: hidden; }
  .card .head { display: flex; justify-content: space-between; font-size: 9pt; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3pt; margin-bottom: 5pt; }
  .card .word { font-size: 20pt; font-weight: bold; text-align: center; margin: 4pt 0; letter-spacing: 0.1em; }
  .card .sab { border: 2px solid #000; padding: 4pt 6pt; margin-top: 5pt; font-size: 9.5pt; }
  .card .sab::before { content: 'SECRET ORDERS: '; font-weight: bold; }
  .card .riddle { margin-top: auto; border-top: 1px solid #000; padding-top: 4pt; font-style: italic; font-size: 9.5pt; }
  .label { height: 130mm; border: 2px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 8mm; page-break-inside: avoid; }
  .label .big { font-size: 40pt; font-weight: bold; }
  .label .sym { font-size: 14pt; margin-top: 8pt; }
  .strip { border: 1px solid #000; border-style: dashed solid; display: grid; grid-template-columns: 14mm 1fr; min-height: 18mm; margin-bottom: 2mm; page-break-inside: avoid; font-family: 'Courier New', monospace; font-size: 10pt; }
  .strip .margin { border-right: 1px solid #000; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2mm; }
  .strip .candle-ink { width: 5mm; background: #000; }
  .strip .body { padding: 3mm 4mm; }
  .guide table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 6pt 0 12pt; }
  .guide th, .guide td { border: 1px solid #000; padding: 3pt 4pt; text-align: left; vertical-align: top; }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add stylesheet with scene themes, animations and print layout"
```

---

### Task 8: Application UI (title, setup, game, timers, set pieces, vote, result)

**Files:**
- Create: `js/app.js`

No unit tests (DOM); verified in Task 11.

- [ ] **Step 1: Write js/app.js**

```js
(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;
  const audio = root.BM.audio;
  const game = root.BM.createGame(data, logic, root.localStorage);

  const $ = (sel) => document.querySelector(sel);
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function displayName(c) { const n = game.get().names[c.id]; return n ? `${c.short} (${n})` : c.name; }
  function stageIndexOf(id) { return data.STAGE_IDS.indexOf(id); }

  /* ---------- navigation ---------- */
  function show(screen) { game.set({ screen }); render(); }

  function render() {
    const s = game.get();
    document.querySelectorAll('.screen').forEach((x) => x.classList.remove('active'));
    $('#screen-' + s.screen).classList.add('active');
    const sceneNum = s.screen === 'game' ? game.stage().scene : (s.screen === 'vote' || s.screen === 'result') ? 3 : 0;
    document.body.dataset.scene = sceneNum;
    if (s.sound && sceneNum) audio.startAmbience(sceneNum); else audio.stopAmbience();
    ({ title: renderTitle, setup: renderSetup, print: renderPrint, game: renderGame, vote: renderVote, result: renderResult })[s.screen]();
    window.scrollTo(0, 0);
  }

  /* ---------- title ---------- */
  function renderTitle() {
    const s = game.get();
    const node = clear($('#screen-title'));
    node.append(
      el('div', { class: 'manor' }, 'All Hallows\' Eve'),
      el('h1', {}, 'Blackwood Manor'),
      el('p', { class: 'dim' }, 'A murder night in three scenes'),
      el('div', { class: 'candles' }, el('div', { class: 'candle' }), el('div', { class: 'candle' }), el('div', { class: 'candle' })),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'primary', onclick: () => { audio.init(); show('setup'); } }, 'Enter the manor'),
        (s.prologueDone || s.stageIndex > 0) && el('button', { class: 'ghostly', onclick: () => { audio.init(); show('game'); } }, 'Resume the night')
      )
    );
  }

  /* ---------- setup ---------- */
  function renderSetup() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-setup'));
    const grid = el('div', { class: 'roster' });
    for (const c of data.characters) {
      const on = s.presentIds.includes(c.id);
      const locked = data.requiredIds.includes(c.id);
      const card = el('div', { class: 'char-card' + (on ? ' on' : '') + (locked ? ' locked' : '') },
        el('span', { class: 'sym' }, c.symbol),
        el('img', { src: c.image, alt: c.name, onclick: () => { if (!locked) { game.togglePresent(c.id); renderSetup(); } } }),
        el('div', { class: 'cname', onclick: () => { if (!locked) { game.togglePresent(c.id); renderSetup(); } } }, c.name),
        el('input', { type: 'text', placeholder: 'Played by…', value: s.names[c.id] || '',
          oninput: (e) => { const names = Object.assign({}, game.get().names, { [c.id]: e.target.value }); game.set({ names }); } })
      );
      grid.append(card);
    }
    node.append(
      el('h2', {}, 'Who is in the house tonight?'),
      el('p', { class: 'dim' }, 'Tap a portrait to add or remove a guest. Madame Zora and Dr. Krank must be present; the story needs them. Type the real name of the player under each portrait if you want it on the vote screen.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' },
        el('h3', {}, 'Timers and sound'),
        el('div', { class: 'row' },
          el('label', { class: 'grow' }, 'Search minutes', el('input', { type: 'number', min: 1, max: 30, value: s.searchMin, onchange: (e) => game.set({ searchMin: Number(e.target.value) || 5 }) })),
          el('label', { class: 'grow' }, 'Discussion minutes', el('input', { type: 'number', min: 1, max: 30, value: s.discussMin, onchange: (e) => game.set({ discussMin: Number(e.target.value) || 7 }) })),
          el('label', {}, el('input', { type: 'checkbox', checked: s.sound ? 'checked' : null, onchange: (e) => { game.set({ sound: e.target.checked }); audio.setEnabled(e.target.checked); } }), ' Sound on')
        )
      ),
      roster.errors.length ? el('p', { class: 'error' }, roster.errors.join(' ')) : null,
      roster.present.length < 6 ? el('p', { class: 'error' }, 'Fewer than six guests: the mystery will be thin. Consider adding characters.') : null,
      el('div', { class: 'row' },
        el('button', { onclick: () => show('print') }, 'Print pack'),
        el('button', { class: 'primary', disabled: roster.errors.length ? 'disabled' : null, onclick: () => beginNight() }, s.prologueDone ? 'Return to the game' : 'Begin the night'),
        el('button', { class: 'small', onclick: () => { if (confirm('Forget this night and start over?')) { game.reset(); show('title'); } } }, 'Reset everything')
      )
    );
  }

  function beginNight() {
    audio.init();
    if (!game.get().prologueDone) {
      showSetPiece('prologue', () => showSetPiece('sheIsDead', () => { game.set({ prologueDone: true }); show('game'); }));
    } else show('game');
  }

  /* ---------- print ---------- */
  function renderPrint() {
    const node = clear($('#screen-print'));
    const list = el('div', { class: 'row' });
    for (const c of data.characters) list.append(el('button', { class: 'small', onclick: () => root.BM.print.open('character', c.id) }, `${c.symbol} ${c.short}`));
    node.append(
      el('h2', {}, 'Print pack'),
      el('p', { class: 'dim' }, 'Each button opens the browser print dialog. Choose "Save as PDF" or print directly. Use A4, portrait, default margins, background graphics off.'),
      el('div', { class: 'panel' },
        el('div', { class: 'row' },
          el('button', { class: 'primary', onclick: () => root.BM.print.open('all') }, 'All character packs'),
          el('button', { onclick: () => root.BM.print.open('stations') }, 'Station labels'),
          el('button', { onclick: () => root.BM.print.open('envelopes') }, 'Team envelopes and witness cards'),
          el('button', { onclick: () => root.BM.print.open('ledger') }, 'Ledger strips'),
          el('button', { onclick: () => root.BM.print.open('guide', null, game.roster()) }, 'Host guide')
        )
      ),
      el('div', { class: 'panel' }, el('h3', {}, 'One character'), list),
      el('button', { onclick: () => show('setup') }, 'Back')
    );
  }

  /* ---------- game ---------- */
  let typedKey = null;
  let typeHandle = null;

  function renderGame() {
    const s = game.get();
    const stage = game.stage();
    const scene = data.scenes[stage.scene - 1];
    const roster = game.roster();
    const node = clear($('#screen-game'));

    const progress = el('div', { class: 'progress' });
    data.stages.forEach((st, i) => progress.append(el('div', {
      class: 'step' + (i < s.stageIndex ? ' done' : i === s.stageIndex ? ' current' : ''), title: `${st.id} ${st.title}`,
      onclick: () => { stopTimer(); game.set({ stageIndex: i, phase: 'narration', timerEnd: null, timerKind: null }); render(); }
    })));

    const narr = el('div', { class: 'narration' });
    stage.narration.forEach((line) => narr.append(el('span', { class: 'speaker' }, line.speaker), el('p', { class: 'typed' }, line.text)));

    const header = el('div', { class: 'panel' },
      el('div', { class: 'scene-label' }, `Scene ${scene.number}: ${scene.title}`),
      el('h2', {}, `${stage.id} ${stage.title}`, el('span', { class: 'kind' }, stage.kind === 'team' ? 'Team' : stage.kind === 'group' ? 'Find alone, solve together' : 'Individual')),
      stage.setPieceBefore ? el('div', { class: 'row', style: 'margin-bottom:12px' }, el('button', { class: 'ghostly', onclick: () => showSetPiece(stage.setPieceBefore, () => render()) }, '▶ Play: Victor returns')) : null,
      narr,
      el('div', { class: 'clue' }, stage.clue)
    );

    const phasePanel = el('div', { class: 'panel' });
    buildPhasePanel(phasePanel, stage, s);

    node.append(progress, header, phasePanel, buildHostPanel(stage, s, roster), buildSoundboard(),
      el('div', { class: 'row' },
        el('button', { class: 'small', onclick: () => { stopTimer(); game.prevStage(); render(); } }, '◀ Previous stage'),
        el('button', { class: 'small', onclick: () => show('setup') }, 'Setup'),
        el('button', { class: 'small', onclick: () => show('vote') }, 'Go to vote')
      )
    );

    const key = stage.id;
    if (typedKey !== key) { typedKey = key; typewrite(narr); }
    else narr.querySelectorAll('.typed').forEach((p) => p.classList.add('finished'));
    resumeTimerIfRunning();
  }

  function typewrite(container) {
    if (typeHandle) clearInterval(typeHandle);
    const items = Array.from(container.querySelectorAll('.typed')).map((p) => ({ p, full: p.textContent }));
    items.forEach((it) => { it.p.textContent = ''; });
    let idx = 0, pos = 0;
    const finish = () => { clearInterval(typeHandle); typeHandle = null; items.forEach((it) => { it.p.textContent = it.full; it.p.classList.add('finished'); }); };
    container.addEventListener('click', finish, { once: true });
    typeHandle = setInterval(() => {
      if (idx >= items.length) return finish();
      const it = items[idx];
      pos += 1;
      it.p.textContent = it.full.slice(0, pos);
      if (pos >= it.full.length) { it.p.classList.add('finished'); idx += 1; pos = 0; }
    }, 22);
  }

  function buildPhasePanel(panel, stage, s) {
    clear(panel);
    const timerEl = el('div', { class: 'timer', id: 'timer' }, '--:--');
    const label = el('div', { class: 'timer-label', id: 'timer-label' }, '');
    const bar = el('div', { class: 'phase-bar' });

    if (s.phase === 'narration') {
      label.textContent = 'Read the narration aloud, then send them searching';
      bar.append(el('button', { class: 'primary', onclick: () => startPhase('search') }, `Start search (${s.searchMin} min)`));
    } else if (s.phase === 'search') {
      label.textContent = 'Searching';
      bar.append(
        el('button', { class: 'primary', onclick: () => startPhase('discussion') }, `Start discussion (${s.discussMin} min)`),
        el('button', { class: 'small', onclick: () => { addMinute(); } }, '+1 min')
      );
    } else if (s.phase === 'discussion') {
      label.textContent = 'Discussion';
      bar.append(
        el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); } }, 'End discussion'),
        el('button', { class: 'small', onclick: () => { addMinute(); } }, '+1 min')
      );
    } else {
      label.textContent = 'Stage complete';
      if (stage.announcement) {
        panel.append(el('div', { class: 'narration' }, el('span', { class: 'speaker' }, stage.announcement.speaker), el('p', { class: 'typed finished' }, stage.announcement.text)));
      }
      if (stage.setPieceAfter) {
        bar.append(el('button', { class: 'primary', onclick: () => showSetPiece(stage.setPieceAfter, () => { game.nextStage(); render(); }) }, '▶ The lights go out'));
      } else if (game.get().stageIndex === data.stages.length - 1) {
        bar.append(el('button', { class: 'primary', onclick: () => show('vote') }, 'Open the vote'));
      } else {
        bar.append(el('button', { class: 'primary', onclick: () => { game.nextStage(); render(); } }, 'Next stage ▶'));
      }
    }
    panel.append(timerEl, label, bar);
  }

  /* ---------- timers ---------- */
  let timerHandle = null;
  let lastSecond = null;

  function startPhase(kind) {
    const s = game.get();
    const minutes = kind === 'search' ? s.searchMin : s.discussMin;
    game.set({ phase: kind, timerKind: kind, timerEnd: Date.now() + minutes * 60000 });
    render();
  }
  function addMinute() { const s = game.get(); if (s.timerEnd) { game.set({ timerEnd: s.timerEnd + 60000 }); } }
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; lastSecond = null; }
  function resumeTimerIfRunning() {
    stopTimer();
    const s = game.get();
    if (!s.timerEnd) return;
    const tick = () => {
      const t = $('#timer'); if (!t) return stopTimer();
      const remaining = Math.ceil((game.get().timerEnd - Date.now()) / 1000);
      const abs = Math.abs(remaining);
      t.textContent = (remaining < 0 ? '-' : '') + String(Math.floor(abs / 60)).padStart(2, '0') + ':' + String(abs % 60).padStart(2, '0');
      t.classList.toggle('urgent', remaining > 0 && remaining <= 30);
      t.classList.toggle('over', remaining <= 0);
      if (remaining !== lastSecond) {
        if (remaining > 0 && remaining <= 30 && game.get().sound) audio.play('tick');
        if (remaining === 0 && game.get().sound) audio.play('toll');
        lastSecond = remaining;
      }
    };
    tick();
    timerHandle = setInterval(tick, 250);
  }

  /* ---------- host panel ---------- */
  function buildHostPanel(stage, s, roster) {
    const idx = s.stageIndex;
    const details = el('details', { class: 'host' }, el('summary', {}, 'Host only: answer key for this stage'));
    details.append(el('p', {}, stage.hostNotes));

    const table = el('table', {}, el('tr', {}, el('th', {}, 'Station'), el('th', {}, 'Cards here this stage')));
    for (const st of data.STATIONS) {
      const cards = logic.cardsAtStation(data, st, idx).map((c) => `${c.symbol} ${c.short}${roster.present.some((p) => p.id === c.id) ? '' : ' (absent)'}`);
      const extras = [];
      for (const team of ['delilah', 'victor']) {
        const env = data.teamEnvelopes[team][stage.id];
        if (env && env.station === st) extras.push(`TEAM ${team.toUpperCase()} envelope: ${env.title}`);
      }
      table.append(el('tr', {}, el('td', {}, st), el('td', {}, [...cards, ...extras].join(' · '))));
    }
    details.append(el('h3', {}, 'Where the cards are'), table);

    if (stage.id === '3.1' || stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const ts = logic.teamSentence(data, roster, team, stage.id);
        details.append(el('p', {}, el('strong', {}, `Team ${team === 'delilah' ? 'Delilah' : 'Victor'}: `), `${ts.sentence} → ${ts.station}`,
          ts.missing.length ? el('span', { class: 'dim' }, ` (ghost whispers: ${ts.missing.map((w) => `#${w.index} ${w.text}`).join(', ')})`) : null));
      }
      details.append(el('p', { class: 'dim' }, 'Killers\' wrong words: Zora says TALKS for WALKS (3.1); Krank says DRINKS for BLINKS (3.1).'));
    }
    if (stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const w = data.witnessCards[team];
        details.append(el('p', {}, el('strong', {}, `Witness card, Team ${team === 'delilah' ? 'Delilah' : 'Victor'} (read by ${charById(w.reader).short}): `), w.text));
      }
    }
    if (stage.id === '2.3') {
      const ol = el('ol', {});
      data.ledger.forEach((strip) => ol.append(el('li', {}, el('strong', {}, `${charById(strip.holder).short}: `), strip.text)));
      details.append(el('h3', {}, 'The ledger in order'), ol);
    }
    if (stage.id === '3.3') {
      const ul = el('ul', {});
      data.characters.filter((c) => roster.present.some((p) => p.id === c.id)).forEach((c) => ul.append(el('li', {}, el('strong', {}, c.short + ': '), c.cards['3.3'].alibi, c.cards['3.3'].lie ? el('em', { class: 'error' }, ` LIE: ${c.cards['3.3'].lie}`) : null)));
      details.append(el('h3', {}, 'Alibis'), ul);
    }

    const orphans = logic.orphanedClues(data, roster, stage.id);
    if (orphans.length) {
      details.append(el('h3', {}, 'Absent guests: the ghost delivers these'));
      orphans.forEach((o) => details.append(el('div', { class: 'orphan' }, el('strong', {}, `${o.symbol} ${o.name} (${o.kind}${o.number ? ' ' + o.number : ''}${o.index ? ' word #' + o.index : ''}): `), o.text)));
    }
    return el('div', { class: 'panel' }, details);
  }

  function buildSoundboard() {
    const board = el('div', { class: 'soundboard' });
    for (const name of audio.names) board.append(el('button', { class: 'small', onclick: () => audio.play(name) }, name));
    const flash = el('button', { class: 'small', onclick: () => lightning() }, 'lightning');
    board.append(flash);
    return el('div', { class: 'panel' }, el('details', { class: 'host' }, el('summary', {}, 'Soundboard'), board));
  }

  function lightning() {
    const l = $('#lightning');
    l.classList.remove('flash'); void l.offsetWidth; l.classList.add('flash');
    if (game.get().sound) audio.play('thunder');
  }

  /* ---------- set pieces ---------- */
  function showSetPiece(key, onDone) {
    const sp = data.setPieces[key];
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay';
    const linesNode = el('div', { class: 'lines' });
    const renderLines = () => sp.lines.forEach((l) => linesNode.append(el('span', { class: 'speaker' }, l.speaker), el('p', {}, l.text)));
    const done = () => { ov.classList.add('hidden'); clear(ov); if (onDone) onDone(); };
    const continueBtn = (label) => el('button', { class: 'primary', style: 'margin-top:24px', onclick: done }, label || 'Continue');

    if (key === 'lightsOut') {
      ov.classList.add('blackout', 'flicker');
      if (game.get().sound) audio.play('death');
      lightning();
      setTimeout(() => {
        ov.append(el('h1', {}, 'Scene 2'), el('h2', {}, 'The Master Falls'), linesNode, continueBtn('The ghost speaks'));
        renderLines();
      }, 3000);
    } else if (key === 'victorReturns') {
      ov.classList.add('ghostly');
      if (game.get().sound) audio.play('ghost');
      ov.append(el('div', {}, el('div', { class: 'ghost-shape' }), el('div', { class: 'ghost-shape violet' })), el('h1', {}, 'Scene 3'), el('h2', {}, 'Two Ghosts'), linesNode, continueBtn('Form the teams'));
      renderLines();
    } else if (key === 'sheIsDead') {
      ov.classList.add('blackout');
      if (game.get().sound) audio.play('toll');
      ov.append(el('h1', {}, 'She is dead'), el('h2', {}, 'Scene 1: The Toast'), linesNode, continueBtn('Begin Scene 1'));
      renderLines();
    } else {
      ov.classList.add('ghostly');
      ov.append(el('h1', {}, sp.title), linesNode, continueBtn(key === 'prologue' ? 'She is dead' : 'Continue'));
      renderLines();
    }
  }

  /* ---------- vote ---------- */
  function renderVote() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-vote'));
    const grid = el('div', { class: 'vote-grid' });
    const options = (sel) => {
      const sl = el('select', {}, el('option', { value: '' }, '— choose —'));
      roster.present.forEach((c) => sl.append(el('option', { value: c.id, selected: sel === c.id ? 'selected' : null }, `${c.symbol} ${displayName(c)}`)));
      return sl;
    };
    roster.present.forEach((v) => {
      const picks = s.votes[v.id] || ['', ''];
      const s1 = options(picks[0]); const s2 = options(picks[1]);
      const save = () => { const votes = Object.assign({}, game.get().votes, { [v.id]: [s1.value, s2.value] }); game.set({ votes }); renderTally(); };
      s1.addEventListener('change', save); s2.addEventListener('change', save);
      grid.append(el('div', { class: 'voter' }, el('strong', {}, `${v.symbol} ${displayName(v)}`), el('div', { class: 'dim' }, 'accuses'), s1, s2));
    });
    node.append(
      el('h2', {}, 'The accusation'),
      el('p', { class: 'dim' }, 'Every guest names two suspects. The house wins only if both killers are the two most accused.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' }, el('h3', {}, 'Tally'), el('div', { class: 'tally', id: 'tally' })),
      el('div', { class: 'row' },
        el('button', { class: 'primary', onclick: () => playReveal() }, '▶ Reveal the killers'),
        el('button', { class: 'small', onclick: () => show('game') }, 'Back to the game')
      )
    );
    renderTally();
  }

  function renderTally() {
    const t = $('#tally'); if (!t) return;
    clear(t);
    const result = logic.tally(game.get().votes, data.killerIds);
    const max = Math.max(1, ...Object.values(result.counts));
    result.ranked.forEach(([id, n]) => {
      const c = charById(id);
      t.append(el('div', { class: 'bar' }, el('span', {}, `${c.symbol} ${c.short}`), el('div', { class: 'fill', style: `width:${(n / max) * 100}%` }), el('span', {}, n)));
    });
    if (!result.ranked.length) t.append(el('p', { class: 'dim' }, 'No accusations yet.'));
  }

  function playReveal() {
    const result = logic.tally(game.get().votes, data.killerIds);
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay blackout';
    const candles = el('div', { class: 'candles' }, el('div', { class: 'candle' }), el('div', { class: 'candle' }), el('div', { class: 'candle' }));
    ov.append(candles);
    const snd = game.get().sound;
    [0, 1, 2].forEach((i) => setTimeout(() => { candles.children[i].style.visibility = 'hidden'; if (snd) audio.play('puff'); }, 1200 + i * 1100));
    setTimeout(() => { if (snd) audio.play('heartbeat'); }, 4600);
    setTimeout(() => {
      clear(ov);
      const portraits = el('div', { class: 'reveal-portraits' });
      data.killerIds.forEach((id) => portraits.append(el('img', { src: charById(id).image, alt: charById(id).name })));
      const lines = el('div', { class: 'lines' });
      data.reveal.lines.forEach((l) => lines.append(el('span', { class: 'speaker' }, l.speaker), el('p', {}, l.text)));
      ov.append(el('h1', {}, data.killerIds.map((id) => charById(id).name).join(' & ')), portraits, lines,
        el('button', { class: 'primary', style: 'margin-top:24px', onclick: () => { ov.classList.add('hidden'); clear(ov); show('result'); } }, result.houseWins ? 'The house wins' : 'The killers walk free'));
      if (snd) audio.play('ghost');
    }, 8600);
  }

  function renderResult() {
    const result = logic.tally(game.get().votes, data.killerIds);
    const node = clear($('#screen-result'));
    node.append(
      el('h1', { class: 'result-title center' }, result.houseWins ? data.reveal.houseWins : data.reveal.killersWin),
      el('div', { class: 'panel' }, el('h3', {}, 'Final tally'), el('div', { class: 'tally', id: 'tally' })),
      el('p', { class: 'center dim' }, data.reveal.farewell),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { onclick: () => show('vote') }, 'Back to the vote'),
        el('button', { class: 'primary', onclick: () => { if (confirm('Start a brand new night? This clears the roster and votes.')) { game.reset(); show('title'); } } }, 'New night')
      )
    );
    renderTally();
  }

  /* ---------- boot ---------- */
  audio.setEnabled(game.get().sound);
  render();
})(window);
```

- [ ] **Step 2: Open index.html in a browser and click through title → setup → game**

Open `index.html` by double-click. Expected: title with three flickering candles; "Enter the manor" shows the roster with 9 portraits lit and 4 dark (agnes, khamun, edgar, luna). Begin the night shows the prologue overlay, then "She is dead", then stage 1.1 with the typewriter narration. Start search shows a 05:00 countdown.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add game UI with timers, host panel, set pieces, vote and reveal"
```

---

### Task 9: Print pack

**Files:**
- Create: `js/print.js`

- [ ] **Step 1: Write js/print.js**

```js
(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function stageTitle(i) { return `${data.STAGE_IDS[i]} ${data.stages[i].title}`; }

  function introSheet(c) {
    return `<div class="sheet">
      <img class="portrait" src="${c.image}" alt="">
      <h1>${c.symbol} ${esc(c.name)}</h1>
      <p><em>${esc(c.costume)} · Blackwood Manor, All Hallows' Eve</em></p>
      <h2>Who you are</h2><p>${esc(c.intro.text)}</p>
      <h2>How to act</h2><p>${esc(c.intro.act)}</p>
      <h2>Your quirk, all night</h2><p>${esc(c.intro.quirk)}</p>
      <h2>Your public line (say it to everyone)</h2><div class="boxed">“${esc(c.intro.publicLine)}”</div>
      <h2>How the night works</h2>
      <p>There are six stations in the room: Sofa, Bookshelf, Television, Plant, Lamp, Cupboard. Each holds an envelope. Every riddle you receive points to one station; inside its envelope take only the card marked <strong>${c.symbol} ${esc(c.short)}</strong> and the current stage number. Read your cards privately unless the card says otherwise. Keep your cards; you will need them.</p>
      <h2>Your first riddle (stage 1.1)</h2><div class="boxed"><em>${esc(logic.riddleFor(data, c, 0))}</em></div>
    </div>`;
  }

  function cardHtml(c, i) {
    const sid = data.STAGE_IDS[i];
    const card = c.cards[sid];
    const parts = [];
    parts.push(`<div class="head"><span>${c.symbol} ${esc(c.short)}</span><span>Stage ${esc(stageTitle(i))}</span></div>`);
    if (card.word) parts.push(`<div>Your team word is number <strong>${card.word.index}</strong>:</div><div class="word">${esc(card.word.text)}</div>`);
    if (card.alibi) parts.push(`<p>Read aloud, exactly:</p><p>“${esc(card.alibi)}”</p>`);
    else parts.push(`<p>${esc(card.text)}</p>`);
    if (card.ledger) parts.push(`<p><strong>This envelope also holds ledger strip ${card.ledger}.</strong></p>`);
    if (card.secretSign) parts.push(`<div class="sab">Tap the table twice and say “the candles burn low”. If anyone answers “and the wax remembers”, they are your ally.</div>`);
    if (card.sabotage) parts.push(`<div class="sab">${esc(card.sabotage)}</div>`);
    if (card.lie) parts.push(`<div class="sab">${esc(card.lie)}</div>`);
    if (i < data.STAGE_IDS.length - 1) parts.push(`<div class="riddle">Your next card (stage ${data.STAGE_IDS[i + 1]}): ${esc(logic.riddleFor(data, c, i + 1))}</div>`);
    else parts.push(`<div class="riddle">This is your last card. The vote is next.</div>`);
    return `<div class="card">${parts.join('')}</div>`;
  }

  function cardPages(c) {
    const cards = data.STAGE_IDS.map((_, i) => cardHtml(c, i));
    const pages = [];
    for (let p = 0; p < cards.length; p += 4) {
      const chunk = cards.slice(p, p + 4);
      while (chunk.length < 4) chunk.push('<div class="card"></div>');
      pages.push(`<div class="sheet"><div class="card-grid">${chunk.join('')}</div></div>`);
    }
    return pages.join('');
  }

  function characterPack(c) { return introSheet(c) + cardPages(c); }

  function stations() {
    return data.STATIONS.map((st) => `<div class="label"><div class="big">${esc(st)}</div><div class="sym">Blackwood Manor · station envelope</div></div>`)
      .reduce((acc, l, i) => acc + (i % 2 === 0 ? '<div class="sheet">' : '') + l + (i % 2 === 1 || i === 5 ? '</div>' : ''), '');
  }

  function envelopes() {
    const out = [];
    for (const team of ['delilah', 'victor']) {
      const name = team === 'delilah' ? 'TEAM DELILAH' : 'TEAM VICTOR';
      for (const sid of ['3.1', '3.2']) {
        const env = data.teamEnvelopes[team][sid];
        out.push(`<div class="sheet"><h1>${name} · Stage ${sid}</h1><p><em>Hide at the ${esc(env.station)}. The team sentence is: ${esc(env.sentence)}.</em></p><h2>${esc(env.title)}</h2><div class="boxed"><p>${esc(env.text)}</p></div></div>`);
      }
      const w = data.witnessCards[team];
      out.push(`<div class="sheet"><h1>${name} · The witness</h1><p><em>Put this inside the ${esc(data.teamEnvelopes[team]['3.2'].station)} envelope for stage 3.2. To be read aloud by ${esc(charById(w.reader).name)}, or by ${esc(w.ghost)} if absent.</em></p><div class="boxed"><p>${esc(w.text)}</p></div></div>`);
    }
    return out.join('');
  }

  function ledger() {
    const strips = data.ledger.map((s) => {
      const h = Math.max(2, 14 - s.number);
      return `<div class="strip"><div class="margin"><div class="candle-ink" style="height:${h}mm"></div></div><div class="body">${esc(s.text)}<br><small>holder: ${charById(s.holder).symbol} ${esc(charById(s.holder).short)} (put in their 2.3 envelope)</small></div></div>`;
    });
    return `<div class="sheet"><h1>The Crimson Ledger</h1><p><em>Cut along the dashed lines. Each strip goes into its holder's stage 2.3 envelope. The candle in the margin orders the page: tallest first.</em></p>${strips.join('')}</div>`;
  }

  function guide(roster) {
    roster = roster || logic.buildRoster(data, { presentIds: data.characters.map((c) => c.id) });
    const rows = data.STAGE_IDS.map((sid, i) => {
      const cells = data.STATIONS.map((st) => {
        const cards = logic.cardsAtStation(data, st, i).map((c) => `${c.symbol} ${esc(c.short)}`);
        for (const team of ['delilah', 'victor']) {
          const env = data.teamEnvelopes[team][sid];
          if (env && env.station === st) cards.push(`<strong>TEAM ${team.toUpperCase()}</strong>`);
        }
        return `<td>${cards.join('<br>')}</td>`;
      });
      return `<tr><th>${sid}</th>${cells.join('')}</tr>`;
    });
    const killers = data.killerIds.map((id) => charById(id)).map((c) => `<h2>${c.symbol} ${esc(c.name)}</h2><ul>${data.STAGE_IDS.filter((sid) => c.cards[sid].sabotage || c.cards[sid].lie).map((sid) => `<li><strong>${sid}:</strong> ${esc(c.cards[sid].sabotage || c.cards[sid].lie)}</li>`).join('')}</ul>`).join('');
    const sentences = ['3.1', '3.2'].map((sid) => ['delilah', 'victor'].map((team) => { const ts = logic.teamSentence(data, roster, team, sid); return `<li><strong>${sid} Team ${team}:</strong> ${esc(ts.sentence)} → ${esc(ts.station)}</li>`; }).join('')).join('');
    const alibis = data.characters.map((c) => `<li><strong>${c.symbol} ${esc(c.short)}:</strong> “${esc(c.cards['3.3'].alibi)}”${c.cards['3.3'].lie ? ` <strong>LIE.</strong> ${esc(c.cards['3.3'].lie)}` : ''}</li>`).join('');
    const orphans = data.STAGE_IDS.map((sid) => logic.orphanedClues(data, roster, sid).map((o) => `<li><strong>${sid} · ${o.symbol} ${esc(o.name)} (${o.kind}):</strong> ${esc(o.text)}</li>`).join('')).join('');
    return `<div class="sheet guide">
      <h1>Host guide</h1>
      <h2>Night-of checklist</h2>
      <ol>
        <li>Print all packs. Cut cards. Sort every card into its station envelope using the table below. Put the four team envelopes and the two witness cards at their stations. Put each ledger strip inside its holder's 2.3 envelope.</li>
        <li>Label the six stations. Hide envelopes behind or under the object, not in plain sight.</li>
        <li>Hand each guest their intro sheet at the door. Nobody opens anything else.</li>
        <li>Open the website, set the roster, test the sound.</li>
        <li>Victor gives the toast. Delilah dies. Play.</li>
      </ol>
      <h2>Which cards go where</h2>
      <table><tr><th>Stage</th>${data.STATIONS.map((s) => `<th>${s}</th>`).join('')}</tr>${rows.join('')}</table>
      <h2>Team sentences</h2><ul>${sentences}</ul>
      <h2>The killers and their orders</h2>${killers}
      <h2>Alibis</h2><ul>${alibis}</ul>
      <h2>Absent guests (current roster): the ghost delivers these</h2><ul>${orphans || '<li>None. Everyone is present.</li>'}</ul>
    </div>`;
  }

  function open(kind, id, roster) {
    const rootNode = document.getElementById('print-root');
    let html = '';
    if (kind === 'all') html = data.characters.map(characterPack).join('');
    else if (kind === 'character') html = characterPack(charById(id));
    else if (kind === 'stations') html = stations();
    else if (kind === 'envelopes') html = envelopes();
    else if (kind === 'ledger') html = ledger();
    else if (kind === 'guide') html = guide(roster);
    rootNode.innerHTML = html;
    const cleanup = () => { rootNode.innerHTML = ''; window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 50);
  }

  root.BM = root.BM || {};
  root.BM.print = { open, characterPack, stations, envelopes, ledger, guide };
})(window);
```

- [ ] **Step 2: Open the print screen and preview "All character packs"**

Expected in the print preview: one intro sheet per character with portrait, then three card pages per character with four cards each (last page has one card and three empty frames). Station labels two per page. Ledger strips with a shrinking black candle in the left margin. Host guide with the routing table.

- [ ] **Step 3: Commit**

```bash
git add js/print.js
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add printable character packs, labels, envelopes, ledger and host guide"
```

---

### Task 10: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Blackwood Manor: a murder night

A hosted murder mystery for about 10 guests and two hosts, played in one room, guided by this website.

## Open it

Double-click `index.html`. No server, no install, works offline. Chrome or Edge recommended for printing and sound. Click once on the title screen to unlock sound.

## Prepare the night

1. **Setup**: tick who is present, optionally type each player's real name, set timers.
2. **Print pack**: print all character packs, station labels, team envelopes and witness cards, the ledger strips, and the host guide. A4 portrait.
3. Follow the host guide's table to stock the six station envelopes.
4. Hand out intro sheets at the door.

## Run the night

Setup → Begin the night → read the prologue → "She is dead" → nine stages. Each stage: read the narration, start the search timer, start the discussion timer, next. The host panel on each stage shows the answer key and anything the ghost must deliver for absent guests. After stage 3.3, open the vote, then press Reveal.

The browser remembers the current stage, so a refresh or accidental close does not lose the game. "Reset everything" on the setup screen starts fresh.

## Develop

`npm test` runs the logic tests and the content integrity check. Story and card text live in `js/data.js`; the design is in `docs/superpowers/specs/`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Add README"
```

---

### Task 11: Browser smoke test and fixes

**Files:**
- Modify: whatever the walkthrough reveals

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`
Expected: all tests pass and "Content check passed."

- [ ] **Step 2: Walk the full night in Chrome with the default 9-player roster**

Open `index.html`. Check each item and fix anything that fails:
1. Title: candles flicker, both buttons work, sound unlocks on first click (soundboard "bell" is audible).
2. Setup: Zora and Krank cannot be toggled off; toggling Luna on adds her; names persist after reload.
3. Begin the night: prologue overlay, "She is dead" overlay with bell toll, lands on 1.1 with typed narration; clicking the narration completes it instantly.
4. Timer: set search to 1 minute in setup; ticks in the last 30 seconds; bell at zero; shows negative time after; "+1 min" extends.
5. Stage 1.3 done: Victor's announcement shows; "The lights go out" plays blackout, flicker, thunder, scream, then the Scene 2 title; continue lands on 2.1 with blue theme.
6. Stage 3.1: "Play: Victor returns" overlay with two ghost shapes; host panel shows both team sentences and stations.
7. Stage 3.2 host panel shows both witness texts. With Khamun absent, an orphan block shows his testimony under "the ghost delivers these".
8. Stage 3.3 host panel lists alibis with the two lies marked.
9. Vote: picks persist; tally bars update; Reveal plays candles out, heartbeat, then portraits and lines; result screen shows the correct winner text.
10. Reload mid-game: returns to the same stage and phase, with a running timer still running.
11. Print: each print button opens a preview with the expected pages; nothing from the app layer leaks into the print.

- [ ] **Step 3: Walk Scene 3 with a 13-player roster (Luna on)**

Expected: host panel shows three cards at Luna's station each stage; Team Delilah sentence has seven words; no orphan blocks.

- [ ] **Step 4: Commit fixes**

```bash
git add -A
git -c user.name="David Hany" -c user.email="david.hany129@gmail.com" commit -m "Fix issues found in the browser walkthrough"
```

---

## Self-review notes

- Spec coverage: §4.1 routing (Task 1), §4.2 cards and riddles (Tasks 1, 3, 9), §4.3 individual/team split (stage `kind`, Task 2; team words Task 3), §4.4 stage flow, timers, host panel, orphans (Tasks 4, 8), §4.5 teams (Tasks 3, 4, 8), §4.6 vote and reveal (Tasks 4, 8), §5 script (Task 2), §6 riddles (Task 1), §7 cards (Task 3), §8.1 shape (Task 1), §8.2 screens (Tasks 8, 9), §8.3 sound (Task 6), §8.4 logic (Tasks 1, 4), §8.5 testing (Tasks 1, 2, 4, 5, 11), §9 checklist (Task 9 host guide, Task 10 README).
- Names used consistently: `BM.data`, `BM.logic`, `BM.createGame`, `BM.audio`, `BM.print`; `stationFor(character, stageIndex)`, `riddleFor(data, character, targetStageIndex)`, `cardsAtStation(data, station, stageIndex)`, `buildRoster(data, {presentIds})`, `orphanedClues(data, roster, stageId)`, `teamSentence(data, roster, team, stageId)`, `tally(votes, killerIds)`.
- Card field names used by print and app: `text`, `word {index,text}`, `alibi`, `lie`, `sabotage`, `secretSign`, `ledger`. Task 3 defines them; Tasks 8 and 9 read them.
