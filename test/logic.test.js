const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../js/data.js');
const logic = require('../js/logic.js');

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
  const r = logic.buildRoster(data, selectionWithout('silas'));
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
  assert.equal(s.picture, 'Plant');
  assert.deepEqual(s.missing.map((w) => w.text), ['GREEN']);
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

test('rumourFor prints the whisper only when its unnamed subject is present', () => {
  const card = data.characters.find((c) => c.id === 'finch').cards['1.1'];
  assert.equal(card.rumour.about, 'vane');
  assert.equal(logic.rumourFor(card, ['finch', 'vane']).text, card.rumour.text);
  assert.equal(logic.rumourFor(card, ['finch']), null);
});

test('every card carries a whisper about someone else who is never named in it', () => {
  for (const c of data.characters) {
    for (const sid of data.STAGE_IDS) {
      const r = c.cards[sid].rumour;
      assert.ok(r && r.text, `${c.id} ${sid} has no whisper`);
      assert.notEqual(r.about, c.id, `${c.id} ${sid} whisper is about themselves`);
      const subject = data.characters.find((x) => x.id === r.about);
      for (const word of [subject.short, ...subject.name.split(/[\s,]+/).filter((w) => w.length > 3 && /^[A-Z]/.test(w))]) {
        assert.ok(!r.text.includes(word), `${c.id} ${sid} whisper names ${word}`);
      }
    }
  }
});

test('stage 3.4 is the box: last stage, leads to the letter, killers know the hiding place', () => {
  const last = data.stages[data.stages.length - 1];
  assert.equal(last.id, '3.4');
  assert.equal(last.setPieceAfter, 'lastLetter');
  assert.equal(data.setPieces.lastLetter.cue, 'The box is open');
  assert.deepEqual(logic.voiceGroup(data, 'set-lastLetter').map((l) => l.voice), ['delilah']);
  for (const id of data.killerIds) {
    const card = data.characters.find((c) => c.id === id).cards['3.4'];
    assert.match(card.text, /rabbit hat/);
    assert.ok(card.sabotage, `${id} has orders for the box`);
  }
  const r = logic.buildRoster(data, selectionWithout('silas'));
  const hint = logic.orphanedClues(data, r, '3.4');
  assert.deepEqual(hint.map((h) => h.kind), ['key hint']);
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

test('voiceLines voices the ghosts, the narrator and living Victor, and lines for both ghosts are marked both', () => {
  const lines = logic.voiceLines(data);
  assert.ok(lines.length > 0);
  for (const l of lines) {
    assert.ok(['delilah', 'victor', 'both', 'narrator'].includes(l.voice), l.id);
    assert.ok(!/^Stage direction/.test(l.speaker), `${l.id} is not a stage direction`);
  }
  assert.equal(new Set(lines.map((l) => l.id)).size, lines.length, 'ids are unique');
  for (const st of data.stages) assert.ok(logic.voiceGroup(data, `stage-${st.id.replace('.', '-')}`).length, `stage ${st.id} is voiced`);
  assert.ok(logic.voiceGroup(data, 'reveal').some((l) => l.voice === 'both'));
  for (const id of ['1-1', '1-2', '1-3']) assert.equal(logic.voiceGroup(data, `stage-${id}`)[0].voice, 'victor', `stage ${id} is read by Victor`);
  for (const id of ['2-1', '2-2', '2-3']) assert.equal(logic.voiceGroup(data, `stage-${id}`)[0].voice, 'delilah', `stage ${id} is Delilah's ghost`);
  for (const st of data.stages) assert.deepEqual(logic.voiceGroup(data, `quote-${st.id.replace('.', '-')}`).map((l) => l.voice), ['narrator'], `${st.id} closing quote is narrated`);
  for (const group of ['set-prologue', 'set-sheIsDead', 'announce-1-3']) {
    assert.deepEqual(logic.voiceGroup(data, group).map((l) => l.voice), ['victor'], `${group}: living Victor is voiced`);
  }
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
