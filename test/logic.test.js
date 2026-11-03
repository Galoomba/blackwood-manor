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
