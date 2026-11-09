#!/usr/bin/env node
/* Build the transcript a careful player has heard by a given stage, for a blind playtester (story-format.md › Calibration).

   node playtest-pack.js <game-dir> <stage-id> [--as <character-id>] [--absent id,id]

   Public: every narration line, B's announcement, set pieces, public clues and closing quotes; every guest's
   costume, public act, quirk and public line; everything said aloud: printed table talk, 1.3 sightings, the torn
   document in order, the team words as spoken (killers say their wrong word), what each opened envelope held,
   the witness cards, the alibis, the box hints and, at 3.4, the box letter (marked "if the box opens").
   Never: host notes, killers' orders, other guests' private cards or whispers.
   --as <id> adds that one character's own cards and whispers (give each playtester a different innocent).
   --absent applies the night's absences: their cards are read by the host from the `absent` lines. */
const path = require('node:path');
const [dir, upto, ...flags] = process.argv.slice(2);
if (!dir || !upto) { console.log(require('node:fs').readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(2); }
const d = require(path.resolve(dir, 'js/data.js'));
const logic = require(path.resolve(dir, 'js/logic.js'));
const flag = (n) => { const i = flags.indexOf(n); return i < 0 ? null : flags[i + 1]; };
const as = flag('--as');
const absent = new Set((flag('--absent') || '').split(',').filter(Boolean));
const present = d.characters.filter((c) => !absent.has(c.id));
const presentIds = present.map((c) => c.id);
const last = d.STAGE_IDS.indexOf(upto);
if (last < 0) { console.error(`unknown stage ${upto}; use one of ${d.STAGE_IDS.join(' ')}`); process.exit(2); }
if (as && !d.characters.some((c) => c.id === as)) { console.error(`unknown character ${as}`); process.exit(2); }
const out = [];
const say = (s = '') => out.push(s);
const lines = (ls) => ls.forEach((l) => { if (!/^Stage direction/.test(l.speaker)) say(`${l.speaker}: ${l.text}`); });
const piece = (key) => { const p = d.setPieces[key]; if (!p) return; say(`\n[${p.title}]`); lines(p.lines); if (p.then) piece(p.then); };
const spoken = (c, sid) => {
  const w = c.cards[sid].word; if (!w) return null;
  const m = c.killer && /say (\w+) instead of (\w+)/.exec(c.cards[sid].sabotage || '');
  return { index: w.index, text: m ? m[1] : w.text };
};

say(`# What a careful player knows by the end of stage ${upto}${as ? `, playing ${d.characters.find((c) => c.id === as).name}` : ''}`);
say('\n## The guests (costume, public act, quirk, public line)');
present.forEach((c) => say(`- ${c.name} (${c.costume}). ${c.intro.act} Quirk: ${c.intro.quirk} Says: "${c.intro.publicLine}"`));
if (absent.size) say(`Absent tonight: ${d.characters.filter((c) => absent.has(c.id)).map((c) => c.name).join(', ')}.`);
say('\n## The night');
piece('prologue'); piece('sheIsDead');
for (const st of d.stages.slice(0, last + 1)) {
  if (st.setPieceBefore) piece(st.setPieceBefore);
  say(`\n### Stage ${st.id}: ${st.title} (${st.kind})`);
  lines(st.narration);
  if (st.clue) say(`On the TV: ${st.clue}`);
  const aloud = st.kind !== 'individual' || st.id === '3.3';
  for (const c of d.characters) {
    const card = c.cards[st.id];
    if (absent.has(c.id)) { if (card.absent) say(`The host, for absent ${c.short}: ${card.absent}`); continue; }
    if (st.id === '3.3' && card.alibi) say(`${c.short}'s alibi: "${card.alibi}"`);
    else if (aloud && !['3.1', '3.2', '2.3'].includes(st.id)) say(`${c.short} reads aloud: ${card.text}`);
    const talk = logic.talkFor(card, presentIds);
    if (talk) say(`${c.short} raises: ${talk.text}`);
  }
  if (st.id === '2.3') { say('\nThe torn document, read aloud in order:'); d.ledger.forEach((s) => say(`${s.number}. ${s.text}`)); }
  if (st.id === '3.1' || st.id === '3.2') {
    for (const team of Object.keys(d.teamEnvelopes)) {
      const ws = d.characters.filter((c) => c.team === team && c.cards[st.id].word).map((c) => spoken(c, st.id)).sort((a, b) => a.index - b.index);
      const env = d.teamEnvelopes[team][st.id];
      say(`\nTeam ${team} hears the words: ${ws.map((w) => w.text).join(' ')}. When they find the right picture (${env.picture}), it holds: ${env.title}. ${env.text}`);
      if (st.id === '3.2') { const w = d.witnessCards[team]; say(`Witness card, read by ${w.reader}: ${w.text}`); }
    }
  }
  if (st.announcement) say(`\n${st.announcement.speaker}: ${st.announcement.text}`);
  if (st.setPieceAfter && st.setPieceAfter !== 'lastLetter') piece(st.setPieceAfter);
  if (st.id === '3.4') { say(`\nIf the box opens, the letter (${d.box.letter.title}): ${d.box.letter.text}`); }
  if (st.quote) say(`Closing quote: "${st.quote.text}" (${st.quote.source})`);
}
if (as) {
  const c = d.characters.find((x) => x.id === as);
  say(`\n## Your own cards (${c.name}; private)`);
  say(`Who you are: ${c.intro.text}`);
  for (const sid of d.STAGE_IDS.slice(0, last + 1)) {
    const card = c.cards[sid];
    say(`${sid}: ${card.text}${card.word ? ` [your word: #${card.word.index} ${card.word.text}]` : ''}`);
    const r = logic.rumourFor(card, presentIds);
    if (r) say(`   whisper at the foot: ${r.text}`);
  }
}
console.log(out.join('\n'));
