const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../js/data.js');
const story = require('../js/story.js');

const ids = new Set(data.characters.map((c) => c.id));
const LAYOUTS = new Set(['title', 'portrait', 'duo', 'gallery', 'evidence', 'ghosts']);
const VOICES = new Set(['narrator', 'delilah', 'victor']);
const audioSrc = fs.readFileSync(path.join(__dirname, '../js/audio.js'), 'utf8');
const SOUNDS = new Set([...audioSrc.slice(audioSrc.indexOf('const sounds = {')).matchAll(/^\s{4}(\w+):/gm)].map((m) => m[1]));

test('every slide is complete and uses known layouts, voices, sounds and guests', () => {
  const seen = new Set();
  for (const s of story.slides) {
    assert.ok(s.id && !seen.has(s.id), `unique id ${s.id}`);
    seen.add(s.id);
    assert.ok(s.chapter && s.title && s.text, `${s.id} has chapter, title and text`);
    assert.ok(LAYOUTS.has(s.layout), `${s.id} layout ${s.layout}`);
    assert.ok(VOICES.has(s.voice), `${s.id} voice ${s.voice}`);
    if (s.sfx) assert.ok(SOUNDS.has(s.sfx), `${s.id} sound ${s.sfx}`);
    for (const id of s.people || []) assert.ok(ids.has(id), `${s.id} person ${id}`);
    for (const id of s.killers || []) {
      assert.ok((s.people || []).includes(id), `${s.id} killer ${id} is pictured`);
      assert.ok(data.killerIds.includes(id), `${s.id} ${id} is a killer`);
    }
    if (['portrait', 'duo'].includes(s.layout)) assert.ok((s.people || []).length, `${s.id} needs a portrait`);
    for (const g of s.ghosts || []) assert.ok(['delilah', 'victor'].includes(g), `${s.id} ghost ${g}`);
    if (s.chapter.startsWith('IV.')) assert.ok(!(s.ghosts || ['victor']).includes('victor') || s.layout !== 'ghosts', `${s.id}: Victor is still alive in chapter IV`);
    if (s.layout === 'evidence') assert.ok((s.chips || []).length, `${s.id} needs evidence chips`);
  }
});

test('every guest has their own slide and every pictured portrait exists on disk', () => {
  for (const c of data.characters) {
    assert.ok(story.slides.some((s) => s.id === `g-${c.id}` && s.people.includes(c.id)), `slide for ${c.id}`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', c.image)), `image ${c.image}`);
  }
});

test('both killers are exposed by evidence and by a ghost in the reveal', () => {
  for (const id of data.killerIds) {
    assert.ok(story.slides.some((s) => s.layout === 'evidence' && (s.killers || []).includes(id)), `evidence for ${id}`);
    assert.ok(story.slides.some((s) => s.chapter.includes('reveal') && (s.killers || []).includes(id) && s.voice !== 'narrator'), `ghost reveal for ${id}`);
  }
});

test('splitSentences keeps titles and initials inside their sentence', () => {
  assert.deepEqual(story.splitSentences('Dr. Krank laughed. Madame Z., who found the dying, smiled! W.K. paid. Then it ended'),
    ['Dr. Krank laughed.', 'Madame Z., who found the dying, smiled!', 'W.K. paid.', 'Then it ended']);
  assert.deepEqual(story.splitSentences("He said 'forgive me.' Then he left."), ["He said 'forgive me.'", 'Then he left.']);
  assert.deepEqual(story.splitSentences(''), []);
});

test('estimateMs grows with words and never drops under 2.5 seconds', () => {
  assert.equal(story.estimateMs('Short.'), 2500);
  assert.equal(story.estimateMs(Array(20).fill('word').join(' ')), 8000);
});

test('chapters start at the first slide and appear in story order', () => {
  const ch = story.chapters();
  assert.equal(ch[0].index, 0);
  for (let i = 1; i < ch.length; i++) assert.ok(ch[i].index > ch[i - 1].index);
  assert.equal(new Set(ch.map((c) => c.title)).size, ch.length, 'no chapter appears twice');
});

test('sentenceStarts maps character timings to the start of each sentence', () => {
  const text = 'Dr. Krank laughed. Then nothing.';
  const sentences = story.splitSentences(text);
  const characters = text.split('');
  const starts = characters.map((_, i) => i * 0.1);
  assert.deepEqual(story.sentenceStarts(text, sentences, { characters, character_start_times_seconds: starts }), [0, 1.9]);
});

test('every recorded clip belongs to a slide and its audio file exists', () => {
  const voice = require('../js/voice-manifest.js');
  const slideIds = new Set(story.slides.map((s) => s.id));
  for (const [id, clip] of Object.entries(voice.clips)) {
    assert.ok(slideIds.has(id), `clip ${id} has a slide`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', clip.src)), `file ${clip.src}`);
    const n = story.splitSentences(story.slides.find((s) => s.id === id).text).length;
    assert.equal(clip.starts.length, n, `${id} has a start time per sentence`);
    for (let i = 1; i < n; i++) assert.ok(clip.starts[i] >= clip.starts[i - 1], `${id} starts ascend`);
  }
});
