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
  assert.equal(s.searchMin, 3);
  assert.equal(s.huntMin, 10);
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

test('nextStage and prevStage clamp to 0..9 and reset phase', () => {
  const g = createGame(data, logic, memoryStorage());
  g.set({ stageIndex: 9, phase: 'done' });
  g.nextStage();
  assert.equal(g.get().stageIndex, 9);
  g.prevStage();
  assert.equal(g.get().stageIndex, 8);
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

test('tv presence: connected only when a heartbeat was written in the last 6 seconds', () => {
  const storage = memoryStorage();
  const g = createGame(data, logic, storage);
  assert.equal(g.tvConnected(1000000), false);
  g.markTvSeen(1000000);
  assert.equal(g.tvConnected(1003000), true);
  assert.equal(g.tvConnected(1007000), false);
});

test('reload re-reads state written by another window and reports whether it changed', () => {
  const storage = memoryStorage();
  const host = createGame(data, logic, storage);
  const tv = createGame(data, logic, storage);
  assert.equal(tv.reload(), false);
  host.set({ stageIndex: 5, setPiece: { key: 'lightsOut', at: 42 } });
  assert.equal(tv.reload(), true);
  assert.equal(tv.get().stageIndex, 5);
  assert.equal(tv.get().setPiece.key, 'lightsOut');
  assert.equal(tv.reload(), false);
});

test('defaults carry no set piece and no reveal', () => {
  const g = createGame(data, logic, memoryStorage());
  assert.equal(g.get().setPiece, null);
  assert.equal(g.get().revealAt, null);
});

test('the ghost voice-over is on by default and stays muted after a reload', () => {
  const storage = memoryStorage();
  const g = createGame(data, logic, storage);
  assert.equal(g.get().voiceOver, true);
  g.set({ voiceOver: false });
  assert.equal(createGame(data, logic, storage).get().voiceOver, false);
});
