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
chars.forEach((c) => {
  const strip = ledger.find((s) => s.holder === c.id);
  if (strip && c.cards && c.cards['2.3'] && c.cards['2.3'].ledger !== strip.number) fail(`${c.id} 2.3 ledger number should be ${strip.number}`);
});

// Team sentences
for (const team of ['delilah', 'victor']) {
  for (const sid of ['3.1', '3.2']) {
    const members = chars.filter((c) => c.team === team && c.cards && c.cards[sid] && c.cards[sid].word);
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
