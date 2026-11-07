const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../js/data.js');
const lights = require('../js/lights.js');

test('every stage has a lighting cue that exists', () => {
  for (const st of data.stages) {
    const name = lights.cueForStage(st.id);
    assert.ok(lights.CUES[name], `stage ${st.id} -> ${name}`);
  }
  assert.equal(lights.cueForStage('3.4'), 'box');
});

test('cue steps respect the Hue rate limits and value ranges', () => {
  for (const [name, c] of Object.entries(lights.CUES)) {
    const room = c.steps.filter((st) => st.state);
    const bulb = c.steps.filter((st) => st.each);
    room.forEach((st, i) => { if (i) assert.ok(st.at - room[i - 1].at >= 1000, `${name}: room steps under 1s apart`); });
    bulb.forEach((st, i) => { if (i) assert.ok(st.at - bulb[i - 1].at >= 250, `${name}: bulb steps under 250ms apart`); });
    c.steps.forEach((st) => {
      const s = st.state || st.each;
      assert.ok(s, `${name}: a step needs state or each`);
      if (s.bri != null) assert.ok(s.bri >= 1 && s.bri <= 254, `${name} bri`);
      if (s.ct != null) assert.ok(s.ct >= 153 && s.ct <= 500, `${name} ct`);
      if (s.xy) assert.ok(s.xy.every((v) => v >= 0 && v <= 1), `${name} xy`);
      assert.ok(Number.isInteger(s.transitiontime), `${name} transitiontime`);
    });
  }
});

test('the blackout flickers in step with the screen: lightning at 2.6s, moonlight at 6.8s', () => {
  const steps = lights.CUES.lightsOut.steps;
  assert.deepEqual(steps.find((st) => st.each).at, 2600);
  assert.equal(steps[steps.length - 1].at, 6800);
  assert.equal(steps.filter((st) => st.each).pop().each.on, false);
});

test('the set pieces the lights follow exist in the story', () => {
  for (const key of ['prologue', 'sheIsDead', 'lightsOut', 'twoGhosts', 'lastLetter']) assert.ok(data.setPieces[key], key);
});
