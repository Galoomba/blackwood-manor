# Story data shape

Three files hold the whole story. Rewrite each one whole; don't patch Blackwood's text line by line. The worked example is in `example/blackwood/`, with the same files.

`scripts/check-content.js` (run by `npm test`) enforces the structure. Read its failures literally.

## js/data.js

```js
const STAGE_IDS = ['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4'];   // fixed: the engine keys on these
const PICTURES = ['Plant','Television','Bookshelf','Lamp','Clock','Mirror'];        // names of drawings in js/art.js
const DECOYS = ['Clock','Mirror'];                                                   // two pictures that stay empty
const scenes = [{ number, title, subtitle, theme: 'scene1' }, ...3];                 // theme: scene1..scene3 (CSS tint)
```

### stages

There are 10 stages, in `STAGE_IDS` order. Each is:

```js
{ id, scene, title, kind: 'individual'|'group'|'team',
  minutes: { cards, discuss },            // omit on 3.4 and set searchOnly: true (key-hunt timer instead)
  quote: { text, source },                // closing line shown when discussion ends: in-world, hints, never solves
  run: ['host run-sheet line', ...],      // what the host does, in order, naming the buttons
  narration: [{ speaker, text }],         // the voice from beyond for this stage (recorded)
  clue: 'the public clue highlighted on the TV',
  hostNotes: 'answer key and what to expect: which lies, which herrings, who blames whom',
  announcement?: { speaker: '<B> (alive, aloud)', text },   // 1.3 only: B's midnight threat
  setPieceAfter?: 'lightsOut' | 'twoGhosts' | 'lastLetter', setPieceBefore?: '<b>Returns' }
```

Speakers decide which recorded voice reads a line (`logic.voiceForSpeaker`):

| Speaker | Voice |
|---|---|
| `"<A>'s ghost (<B> reads)"` | Scene 1: B voices A's words |
| `"<A>'s ghost"` | A's voice (`"(to the room)"` and similar suffixes are fine) |
| `"<B>'s ghost"` | B's voice |
| `"Both ghosts"` or `"Both"` | Both ghosts recorded, played together |
| `"Narrator"` | The narrator |
| `"<B> (aloud)"` or `"<B> (alive, aloud)"` | Living B |
| `"Stage direction"` | Shown, never voiced |

`new-game.sh` renames the ghost names inside these regexes in `js/logic.js`.

### ledger

The torn document. One strip per character, numbered 1..N:

```js
{ number, holder: '<character id>', text }
```

Each holder's 2.3 card has `ledger: <number>`.

### teamEnvelopes

```js
{ <A-id>: { '3.1': {...}, '3.2': {...} }, <B-id>: {...} }
```

Each entry is `{ sentence, picture, title, text }`:

- `sentence` must equal the team's words joined in index order, in capitals. The check compares them.
- `picture` comes from `PICTURES` and is never a decoy.

### witnessCards

```js
{ <A-id>: {...}, <B-id>: {...} }
```

Each entry is `{ reader, ghost, ghostIntro, text }`. The reader's character has `witness: true`.

### setPieces

| Key | When |
|---|---|
| `prologue` | The toast |
| `sheIsDead` | Use this key even if the first victim is male. The title text can differ. |
| `lightsOut` | After 1.3 |
| `twoGhosts` | After 2.3, with `then: '<b>Returns'` |
| `<b>Returns` | B's return: the team call |
| `lastLetter` | After 3.4 |
| `ledger` | Optional: the narrator reads the whole document. Use `voice` and `say` overrides per line. |

Each set piece is `{ title, cue?, sound?, then?, lines: [{ speaker, text, voice?, say? }] }`:

- `sound` is a soundboard name from `js/audio.js`.
- `say` is the spoken version, with abbreviations and sums written out.

### box

```js
{ hidingPlace, rule, letter: { title, outside, text } }
```

### reveal

```js
{ lines: [{ speaker, text }], houseWins, killersWin, farewell }
```

The first two lines are the ghosts naming one killer each. Then comes a "Both" line.

### SIGN

The killers' secret-sign text, printed on both killers' 2.2 cards. It includes both halves and the instruction to answer.

### characters

N characters, in print order:

```js
{ id, index, symbol: '🔮', name: 'Madame Zora', short: 'Zora', costume, image: 'assets/characters/<id>.jpg',
  team: '<A-id>'|'<B-id>', optional: bool, killer: bool, witness: bool,
  intro: { text, act, quirk, publicLine },
  cards: { '1.1': { text, absent?, absentVoice?, ...special }, ... '3.4' } }
```

Killers are never `optional`. Every non-killer card needs `absent`.

Special fields:

- `ledger` at 2.3
- `word: { index, text }` at 3.1 and 3.2
- `alibi` and `lie` at 3.3. Only killers have `lie`.
- `sabotage` on killers' cards at 2.3, 3.1, 3.2 and 3.4
- `secretSign: true` on killers' 2.2

### tableTalk and rumours

```js
tableTalk = { <id>: { '1.1': [{ about?, text }, ...], ... } }   // alternatives; last one always printable
rumours   = { <id>: [ { about, text } x10 ] }                    // one per stage, in STAGE_IDS order
```

A loop attaches both to each card as `card.talk` and `card.rumour`. Keep that loop.

### Exports

```js
const data = { STAGE_IDS, PICTURES, DECOYS, scenes, stages, ledger, teamEnvelopes, witnessCards, setPieces, box, reveal, characters, tableTalk, rumours, SIGN, requiredIds: [killerA, killerB], killerIds: [killerA, killerB] };
```

## js/story.js

The full story after the reveal. `slides` is a list of:

```js
{ id, chapter, layout, scene: 0-3, voice: 'narrator'|'<A-id>'|'<B-id>', title, kicker?, text,
  people?: [ids], killers?: [ids], ghosts?: [A-id, B-id], chips?: [{ text, lie? }], sfx?, effect?: 'flicker'|'flash'|'ghost' }
```

Layouts:

| Layout | Shows |
|---|---|
| `title` | A title slide |
| `portrait` | One person |
| `duo` | Two people |
| `gallery` | Everyone |
| `evidence` | Evidence chips |
| `ghosts` | The ghosts |
| `memorial` | After B dies |
| `risen` | Before B returns |

Every character needs their own slide (one with `people: [id]`). Both killers need an evidence slide and a ghost line in the reveal.

Keep the helper functions at the bottom of the file unchanged: `splitSentences`, `estimateMs`, `chapters` and `sentenceStarts`.

## js/intro.js

About 14 spoiler-free slides with ids `intro-*`. `ALL` lists every character id, used by the `gallery` slide with `presentOnly: true`.

Explain:

- the characters and the three scenes;
- the envelopes, whispers and card rules;
- table talk and secrets;
- teams, the vote and the house rules.

Keep the last slide as the closing step.
