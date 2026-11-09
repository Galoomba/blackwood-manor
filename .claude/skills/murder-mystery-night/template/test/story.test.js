const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../js/data.js');
const story = require('../js/story.js');
const intro = require('../js/intro.js');

const ids = new Set(data.characters.map((c) => c.id));
const LAYOUTS = new Set(['title', 'portrait', 'duo', 'gallery', 'evidence', 'ghosts', 'memorial', 'risen']);
const VOICES = new Set(['narrator', 'delilah', 'victor']);
const audioSrc = fs.readFileSync(path.join(__dirname, '../js/audio.js'), 'utf8');
const SOUNDS = new Set([...audioSrc.slice(audioSrc.indexOf('const sounds = {')).matchAll(/^\s{4}(\w+):/gm)].map((m) => m[1]));

test('every slide of both decks is complete and uses known layouts, voices, sounds and guests', () => {
  const seen = new Set();
  for (const s of [...story.slides, ...intro.slides]) {
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

test('every slide and ghost line is recorded, and every clip file exists', (t) => {
  const voice = require('../js/voice-manifest.js');
  if (!Object.keys(voice.clips).length) return t.skip('no voice-over recorded yet (npm run voice)');
  const logic = require('../js/logic.js');
  const texts = new Map([...story.slides, ...intro.slides].map((s) => [s.id, s.text]));
  for (const l of logic.voiceLines(data)) {
    if (l.voice === 'both') { texts.set(`${l.id}.delilah`, l.text); texts.set(`${l.id}.victor`, l.text); } else texts.set(l.id, l.text);
  }
  for (const id of texts.keys()) assert.ok(voice.clips[id], `${id} is recorded`);
  for (const [id, clip] of Object.entries(voice.clips)) {
    assert.ok(texts.has(id), `clip ${id} belongs to a slide or a ghost line`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', clip.src)), `file ${clip.src}`);
    const n = story.splitSentences(texts.get(id)).length;
    assert.equal(clip.starts.length, n, `${id} has a start time per sentence`);
    for (let i = 1; i < n; i++) assert.ok(clip.starts[i] >= clip.starts[i - 1], `${id} starts ascend`);
  }
});

test('the introduction gives nothing away', () => {
  const killerWords = data.characters.filter((c) => c.killer).flatMap((c) => [c.short, c.name]);
  /* The hosts may be named (Victor and Delilah invite the guests); who dies, and how, may not. */
  const spoilers = [...killerWords, 'nightshade', 'jasmine', 'K-7', 'syringe', 'vial', 'ledger', 'needle', 'kettle', 'Victor dies', 'Victor will die', 'second death'];
  for (const s of intro.slides) {
    const all = [s.title, s.kicker || '', s.text, ...(s.chips || []).map((c) => c.text)].join(' ');
    for (const w of spoilers) assert.ok(!all.includes(w), `${s.id} mentions "${w}"`);
    assert.ok(s.id.startsWith('intro-'), `${s.id} is prefixed so its clip cannot clash with the story`);
    assert.ok(!(s.killers || []).length, `${s.id} marks no killer`);
  }
});

test('the introduction ends on its own closing step', () => {
  assert.equal(intro.slides[intro.slides.length - 1].id, 'intro-begin');
  assert.equal(intro.chapters()[0].index, 0);
});

test('the full story carries both scene interludes: the memorial after Victor dies, the second ghost before he speaks', () => {
  const at = (id) => story.slides.findIndex((s) => s.id === id);
  const memorial = story.slides.find((s) => s.layout === 'memorial');
  const risen = story.slides.find((s) => s.layout === 'risen');
  assert.ok(memorial && risen, 'both interlude slides exist');
  assert.equal(at(memorial.id), at('dark') + 1, 'the memorial follows the murder in the dark');
  assert.equal(at(risen.id) + 1, at('victor-returns'), 'the second ghost rises just before Victor speaks');
  assert.notEqual(story.slides[at('victor-returns')].title, risen.title, 'no two slides share a title');
});
