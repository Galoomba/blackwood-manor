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
