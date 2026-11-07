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

test('cue steps respect the Hue room rate limit and value ranges', () => {
  for (const [name, c] of Object.entries(lights.CUES)) {
    c.steps.forEach((st, i) => {
      if (i) assert.ok(st.at - c.steps[i - 1].at >= 1000, `${name} step ${i} is under 1s after the previous one`);
      const s = st.state;
      if (s.bri != null) assert.ok(s.bri >= 1 && s.bri <= 254, `${name} bri`);
      if (s.ct != null) assert.ok(s.ct >= 153 && s.ct <= 500, `${name} ct`);
      if (s.xy) assert.ok(s.xy.every((v) => v >= 0 && v <= 1), `${name} xy`);
      assert.ok(Number.isInteger(s.transitiontime), `${name} transitiontime`);
    });
  }
});

test('the set pieces the lights follow exist in the story', () => {
  for (const key of ['prologue', 'sheIsDead', 'lightsOut', 'twoGhosts', 'lastLetter']) assert.ok(data.setPieces[key], key);
});
