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
  const r = logic.buildRoster(data, selectionWithout('ambrose'));
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

test('formatRemaining renders mm:ss, flags urgency and overrun', () => {
  assert.deepEqual(logic.formatRemaining(300), { text: '05:00', urgent: false, over: false });
  assert.deepEqual(logic.formatRemaining(29), { text: '00:29', urgent: true, over: false });
  assert.deepEqual(logic.formatRemaining(0), { text: '00:00', urgent: false, over: true });
  assert.deepEqual(logic.formatRemaining(-65), { text: '-01:05', urgent: false, over: true });
});

test('talkFor picks the first table-talk line whose subject is present', () => {
  const card = { talk: [{ about: 'edgar', text: 'ask edgar' }, { about: 'corvus', text: 'ask corvus' }] };
  assert.equal(logic.talkFor(card, ['edgar', 'corvus']).text, 'ask edgar');
  assert.equal(logic.talkFor(card, ['corvus']).text, 'ask corvus');
  assert.equal(logic.talkFor(card, []), null);
  assert.equal(logic.talkFor({ talk: [{ text: 'no subject' }] }, []).text, 'no subject');
  assert.equal(logic.talkFor({}, ['edgar']), null);
});

test('every card has a table-talk line for any roster that keeps the required guests', () => {
  const presentIds = data.characters.filter((c) => !c.optional).map((c) => c.id);
  for (const c of data.characters) for (const sid of data.STAGE_IDS) assert.ok(logic.talkFor(c.cards[sid], presentIds), `${c.id} ${sid}`);
});

test('voiceLines voices only the ghosts and the narrator, and lines for both ghosts are marked both', () => {
  const lines = logic.voiceLines(data);
  assert.ok(lines.length > 0);
  for (const l of lines) {
    assert.ok(['delilah', 'victor', 'both', 'narrator'].includes(l.voice), l.id);
    assert.ok(!/^Victor \(|^Stage direction/.test(l.speaker), `${l.id} is not a living or stage line`);
  }
  assert.equal(new Set(lines.map((l) => l.id)).size, lines.length, 'ids are unique');
  for (const st of data.stages) assert.ok(logic.voiceGroup(data, `stage-${st.id.replace('.', '-')}`).length, `stage ${st.id} is voiced`);
  assert.ok(logic.voiceGroup(data, 'reveal').some((l) => l.voice === 'both'));
  for (const id of ['1-1', '1-2', '1-3']) assert.equal(logic.voiceGroup(data, `stage-${id}`)[0].voice, 'victor', `stage ${id} is read by Victor`);
  for (const id of ['2-1', '2-2', '2-3']) assert.equal(logic.voiceGroup(data, `stage-${id}`)[0].voice, 'delilah', `stage ${id} is Delilah's ghost`);
});

test('an interlude separates the scenes: Victor dies after 1.3, both ghosts rise after 2.3', () => {
  const after = (id) => data.stages.find((s) => s.id === id).setPieceAfter;
  assert.equal(after('1.3'), 'lightsOut');
  assert.equal(after('2.3'), 'twoGhosts');
  assert.equal(data.setPieces.twoGhosts.then, 'victorReturns', 'the rising leads straight into Victor forming the teams');
  for (const id of ['1.3', '2.3']) assert.ok(data.setPieces[after(id)].cue, `the host button after ${id} has a label`);
  for (const key of ['lightsOut', 'twoGhosts']) {
    const voiced = logic.voiceGroup(data, `set-${key}`);
    assert.ok(voiced.length && voiced.every((l) => l.voice === 'narrator'), `${key} is narrated`);
  }
});
