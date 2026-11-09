#!/usr/bin/env node
const data = require('../js/data.js');
const logic = require('../js/logic.js');
const problems = [];
const warnings = [];
const fail = (msg) => problems.push(msg);
const warn = (msg) => warnings.push(msg);

// Scenes and stages
if (!data.scenes || data.scenes.length !== 3) fail('expected 3 scenes');
if (!data.stages || data.stages.length !== 10) fail('expected 10 stages');
(data.stages || []).forEach((st, i) => {
  if (st.id !== data.STAGE_IDS[i]) fail(`stage ${i} id should be ${data.STAGE_IDS[i]}`);
  if (!st.narration || !st.narration.length) fail(`stage ${st.id} has no narration`);
  if (!st.clue) fail(`stage ${st.id} has no public clue`);
  if (!Array.isArray(st.run) || !st.run.length) fail(`stage ${st.id} has no host run-sheet lines`);
  if (!st.quote || !st.quote.text || !st.quote.source) fail(`stage ${st.id} has no closing quote`);
  if (!['individual', 'group', 'team'].includes(st.kind)) fail(`stage ${st.id} kind invalid`);
});

// Characters
const chars = data.characters || [];
if (chars.length < 6 || chars.length > 20) fail(`expected 6 to 20 characters, got ${chars.length}`);
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

// Whispers: one per card, about someone else
chars.forEach((c) => {
  for (const sid of data.STAGE_IDS) {
    const r = c.cards && c.cards[sid] && c.cards[sid].rumour;
    if (!r || !r.text) fail(`${c.id} ${sid} has no whisper`);
    else if (!ids.has(r.about) || r.about === c.id) fail(`${c.id} ${sid} whisper subject invalid`);
  }
});

// The box
if (!data.box || !data.box.hidingPlace || !data.box.letter || !data.box.letter.text) fail('box incomplete');
if (!data.setPieces.lastLetter) fail('missing lastLetter set piece');
chars.filter((c) => c.killer).forEach((c) => { if (!c.cards['3.4'] || !c.cards['3.4'].sabotage) fail(`${c.id} 3.4 has no orders for the box`); });

// Ledger
const ledger = data.ledger || [];
if (ledger.length !== chars.length) fail(`expected one torn-document strip per character (${chars.length}), got ${ledger.length}`);
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
    else if (!data.PICTURES.includes(env.picture)) fail(`team ${team} ${sid} picture invalid`);
  }
}

// Decoy pictures stay empty and are real pictures
for (const d of data.DECOYS || []) {
  if (!data.PICTURES.includes(d)) fail(`decoy ${d} is not a picture`);
  for (const team of ['delilah', 'victor']) for (const sid of ['3.1', '3.2']) if (data.teamEnvelopes[team][sid].picture === d) fail(`decoy ${d} holds team evidence`);
}

// Witness cards
for (const team of ['delilah', 'victor']) {
  const w = data.witnessCards && data.witnessCards[team];
  if (!w || !w.text || !ids.has(w.reader)) fail(`witness card for ${team} incomplete`);
}

// Table talk: every card carries at least one line about another guest, with a fallback whose subject is always present
const optional = new Set(chars.filter((c) => c.optional).map((c) => c.id));
chars.forEach((c) => {
  for (const sid of data.STAGE_IDS) {
    const talk = c.cards && c.cards[sid] && c.cards[sid].talk;
    if (!Array.isArray(talk) || !talk.length) { fail(`${c.id} ${sid} has no table talk`); continue; }
    talk.forEach((t) => {
      if (!t.text) fail(`${c.id} ${sid} table talk without text`);
      if (t.about && !ids.has(t.about)) fail(`${c.id} ${sid} table talk about unknown ${t.about}`);
      if (t.about === c.id) fail(`${c.id} ${sid} table talk about self`);
    });
    if (!talk.some((t) => !t.about || !optional.has(t.about))) fail(`${c.id} ${sid} table talk has no fallback for an absent guest`);
  }
});

// Killers
const killers = chars.filter((c) => c.killer).map((c) => c.id);
if (killers.length !== 2) fail(`expected 2 killers, got ${killers.join(',')}`);
chars.filter((c) => c.killer).forEach((c) => {
  if (c.optional) fail(`${c.id} is a killer and must not be optional`);
  if (!c.cards['2.2'] || !c.cards['2.2'].secretSign) fail(`${c.id} 2.2 needs secretSign: true (the printed sign)`);
});
// The sign: both quoted halves and the instruction to answer, printed on the killers' 2.2 cards
const quoted = (String(data.SIGN || '').match(/["\u201c][^"\u201d]{3,}["\u201d]/g) || []).length;
if (quoted < 2 || !/answer/i.test(data.SIGN || '')) fail('SIGN must quote both halves of the sign and tell the killer to answer');

// Absent guests: every non-killer card has a line the host reads; key clues should also play in their own voice
chars.filter((c) => !c.killer).forEach((c) => {
  for (const sid of data.STAGE_IDS) {
    const card = c.cards && c.cards[sid];
    if (!card) continue;
    if (!card.absent) fail(`${c.id} ${sid} has no absent line (every guest but the killers may be missing)`);
    if (['1.3', '3.1', '3.2', '3.3', '3.4'].includes(sid) && !card.absentVoice) warn(`${c.id} ${sid} has no absentVoice: if ${c.short || c.id} is absent the host reads it instead of a recording`);
  }
});
// Table talk whose every subject may be absent is simply left off the print
const always = new Set(killers);
chars.forEach((c) => {
  for (const sid of data.STAGE_IDS) {
    const talk = (c.cards && c.cards[sid] && c.cards[sid].talk) || [];
    if (talk.length && !talk.some((t) => !t.about || always.has(t.about))) warn(`${c.id} ${sid} table talk has no line that is always printable (no subject, or about a killer)`);
  }
});

if (warnings.length && process.argv.includes('--warnings')) {
  console.log(`Content warnings (${warnings.length}, not failures):`);
  warnings.forEach((w) => console.log(' - ' + w));
} else if (warnings.length) console.log(`${warnings.length} content warnings (run node scripts/check-content.js --warnings to list them).`);
if (problems.length) {
  console.error('Content check FAILED:');
  problems.forEach((p) => console.error(' - ' + p));
  process.exit(1);
}
console.log('Content check passed.');
