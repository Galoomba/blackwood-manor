# The game format

A hosted murder mystery for 6–20 guests and two hosts in one room. It runs about 2.5 hours.

There are three scenes and ten stages, then a vote and a reveal.

Every guest has:

- their own envelope on the table, holding ten cards, face down, with 1.1 on top;
- a torn strip of a document, under their 2.3 card.

Each stage, the voice from beyond speaks, everyone takes their top card, and the table talks. The engine (`template/`) runs all of this.

The reference story is `example/blackwood/`. It was tuned over three blind playtests and one real night.

## Roles

| Role | Who | Arc |
|---|---|---|
| **Ghost A** (first victim) | Host 1, in costume all night | Dies at the toast. Silent in Scene 1: only Ghost B hears them and reads their words, marked "(B reads)". Speaks to the whole room in Scene 2. Leads team A in Scene 3. Runs the laptop or phone all night. |
| **Ghost B** (second victim) | Host 2 | Alive in Scene 1: gives the toast and the midnight announcement. Killed in the blackout after 1.3 and lies still through Scene 2. Rises after 2.3 and leads team B in Scene 3. |
| **Killer A** | A guest | Killed Ghost A for a motive written in the torn document. |
| **Killer B** | A guest | Killed Ghost B because B's announcement at the end of 1.3 threatened them. |
| **The obvious suspect** | A guest | Everything points at them early. They are innocent, often secretly helping. |
| **Witnesses** (2) | Guests, often `optional` | Each reads the witness card for their team at 3.2. A ghost reads it if they are absent. |
| **Red herrings and comic roles** | Everyone else | Each has a real secret, a public act, and a personal goal at 2.2. |

The two killers are **strangers.** At 2.2 each one learns a secret spoken sign: one half is a phrase to work into conversation, the other half is the answer. That is how they find each other.

**Both halves and the instruction to answer must be printed on both killers' 2.2 cards.** Blackwood forgot the answer half, and the host had to whisper it on the night.

Give the sign an innocent echo too. In Blackwood the butler says "the candles burn low" all night, so hearing the phrase proves nothing.

**Each killer sits on the team that investigates their own crime.**

**Supernatural or not.** The engine is built on ghosts, and the word is everywhere: speaker labels ("<A>'s ghost", matched by regexes in `js/logic.js`), host buttons, print headings, the TV, the interlude figures (about 150 places outside the story files). Interview question 5b settles it:

- **Ghosts, justified by the theme (recommended, no code change).** Almost any theme can carry it: the house is haunted, a séance, "the spirits are legal again" in a speakeasy, a ship's legend. Restyle only the visuals if needed (`js/interlude.js`, `.ghost-shape` in `css/style.css`: smoke from a gramophone horn, static on a radio).
- **Not ghosts (a code change, about 1–2 hours).** Ghost A speaks through something recorded before death (dictaphone tapes, letters read by a lawyer, a ship's AI). Ghost B is not dead: badly wounded in the blackout, they come round after 2.3 and lead team B. The victim count stays two attacks, one death. Then rename the speaker labels and the regexes in `js/logic.js` (`voiceForSpeaker`, `readerFor`) together, and every player-visible "ghost" string (`grep -rn ghost js css`). Run the tests after.

## Scenes and stages

| Stage | Kind | Card content | Its job |
|---|---|---|---|
| Prologue | set piece | Host B's toast. Ghost A drinks and falls. A guest (a doctor, if there is one) pronounces them dead. "She is dead" | The first murder. B hears A's ghost and explains the envelopes. |
| 1.1 Who you are | individual | Private backstory. Public line and quirk. | Introductions in character. |
| 1.2 Why you came | individual | Why they came (the invitation). | Motives start to surface. Someone was paid to look away. |
| 1.3 What you saw | group | One sighting, said aloud. | Pool the observations. Plant early clues, but nothing that names a killer. Ends with B's midnight announcement (the motive for killing B), then **lightsOut**: blackout, B falls. |
| 2.1 What you hide | individual | A secret. **The killers learn here what they did.** | The room hears A's ghost. Secrets come out. Innocent secrets make good herrings. |
| 2.2 What you want | individual | A personal goal. Killers get the secret sign. | Side quests. Killers find their ally. |
| 2.3 The torn pages | group | Their strip of the document. | Lay all the strips in order and read the confession aloud. It holds both motives, as initials and hints, never names. Then **twoGhosts**: B rises. Then **victorReturns** (named after B): the teams form. |
| 3.1 The weapon | team | One numbered word per team member. | Each team's words make a sentence that names one picture envelope, which holds the weapon. Each killer holds a word and is ordered to say a wrong one. |
| 3.2 The witness | team | Another word. | Again, a sentence leads to a picture. That envelope holds the witness card, read aloud by the named witness. |
| 3.3 The alibis | individual | An alibi, read word for word. | Each killer's alibi holds one lie, contradicted by at least two earlier sources. |
| 3.4 The box | group, search only | A hint at where the key is. | A box (hidden inside the envelope table in Blackwood) holds Ghost A's last letter. The true key is hidden; fake keys are everywhere. Each guest tries the lock once. The killers know where the key is and send people the wrong way. |
| Vote and reveal | | | Every present guest names two suspects. The house wins only if both killers are the clear top two. Then the ghosts reveal everything. |

**Picture envelopes:** use six of the ink drawings in `js/art.js` (Plant, Television, Bookshelf, Lamp, Clock, Mirror). Two are empty decoys. Only the host opens them. A wrong guess costs the team a minute.

The pictures are envelope labels, not objects in the story's world, so an anachronism is tolerable. Still, prefer the four that fit the period for the real evidence, and use an anachronistic one (a Television in 1933) as a decoy. If more than two clash with the theme, draw replacements in `js/art.js` in the same ink style and rename them in `PICTURES` (code-hooks.md › Structural limits).

**Team sentences** describe a picture as a riddle, such as "WHERE GREEN GROWS BUT NEVER WALKS". Each killer's wrong word must send their team to a different, plausible picture.

**The torn document:** one strip per character, numbered, with a marker that orders them (in Blackwood, a candle in the margin burns lower on each strip).

- Strip 1 is Ghost A's note explaining the tearing.
- The last strip is Ghost B's private note.
- Both motives appear as initials, sums and hints, such as "Broker: Z." or "W.K.: £2,000 monthly".

**The box:** split the innocents' hints. Half say what holds the key (a black hat, the rabbit); half say where it is (behind a small door, at waist height). The killers' orders pull in opposite directions (one says look low, the other says look high), so the true spot sits between them.

The house rule: each guest tries the lock once. Killers may lie but may not touch the true key.

The key needs a container and a spot that the host really has. Pick them from interview question 11 (props) and the room; if the host can't confirm the room, use what every party has: the key under an upturned glass on a tray, inside a shoe, or taped under a chair. The hints describe that container (what) and that spot (where), and the run sheet tells the host to place it.

The letter all but names both killers, so they have every reason to keep the box shut.

## Every card carries

- `text`: the card itself, in the second person.
- `talk`: table talk. One line about another guest, ending in an instruction to raise it aloud.
  - Give a list of alternatives.
  - The first whose subject is present gets printed.
  - The last needs no subject (`about` omitted) or is about a killer. Killers are the only guests always present. Otherwise, if every subject is absent, the card prints no table talk (`check-content.js --warnings` lists these).
- `rumour`: a whisper at the foot of the card. One true detail about another guest, **never named.**
  - Early whispers use what is public. Later ones hint at secrets, mostly innocents' secrets.
  - A whisper about an absent guest is left off the print.
- `absent`: what the host reads if this guest isn't here. Third person, written to be read aloud.
- `absentVoice`: the guest's important clue in their own first-person voice, recorded and played on the TV. Use it at 1.3, 3.1 to 3.4, and wherever the clue matters.
- Special fields:
  - `ledger`: the strip number, at 2.3;
  - `word` `{index, text}`: at 3.1 and 3.2;
  - `alibi` and `lie`: at 3.3;
  - `sabotage`: killers only;
  - `secretSign`: at 2.2, killers only.

## Clue rules

1. **Two sources for every clue that matters.** Cover every optional guest with a backup source. If there isn't one, give the guest an `absentVoice` so the clue still plays.
2. **Nothing names a killer outright before the target stage.** Use initials, smells, sounds, jewellery, habits, things worn or carried. Make each one fit two guests until a later card separates them. In Blackwood, both the witch and the killer have a kettle laugh until the witness card.
3. **Each killer's 3.3 alibi holds one lie** that at least two cards dealt *before* 3.3 contradict, so the table can catch it the moment it is read. The 3.3 host notes list which.
4. **The obvious suspect** soaks up early suspicion. Their secret explains everything suspicious about them.
5. **No casting-based clues:** height, age, real gender, accent. The real player may not match.
6. **The killers' sabotage lies (2.3, 3.1, 3.2) must survive until 3.3.** Rule 3 is about the alibi; this one is about the orders. When a killer is told to blame someone or deny something at 2.3–3.2, no card dealt at or before that stage may already disprove it, or the killer is exposed early. Check the clue matrix stage by stage.
7. **Consistent facts:** times, who stood where, who poured what, how many glasses. Keep a timeline in the story bible and check every card against it.
8. **Cards don't quote private cards** as if they had been said aloud.
9. **Props in the story exist** (interview question 11). Any prop handed to a guest at the door is printed on the prop list and in the run sheet.

## Difficulty calibration

The target is the stage where a careful table becomes certain of both killers:

| Level | Firming | Confident | Certain |
|---|---|---|---|
| Easy | 1.3 | 2.3 | 3.1 |
| Medium | 2.3 | 3.1 | 3.2 |
| Hard | 3.1 | 3.2 | 3.3 or 3.4 |

The knobs:

- how direct the strips' initials are;
- whether a killer's tell (jewellery, scent, laugh) is shared with a red herring;
- how loudly table talk points at the killers;
- how strong the killers' sabotage is;
- whether the witness card describes a trait or an object;
- how early the alibi contradictions are printed;
- the stuck-team hints at 3.1 and 3.2 (the ghost whispers a word after 3 minutes and the sentence after 6).

**Blind playtest.** After writing the data, run 2–3 independent subagents in parallel. Each plays a different innocent character and sees only what a careful player would hear. `scripts/playtest-pack.js` builds that:

```bash
node scripts/playtest-pack.js <game> 3.4 --as <innocent-id> > <scratchpad>/pack-<id>.md
```

Feed it one stage at a time, so the playtester can't read ahead: build a pack per stage (`1.1`, `1.2`, … `3.4`) and give the subagent all ten files, telling it to open them strictly in order and answer before opening the next. Prompt:

> You are a guest at a murder-mystery party, playing <name>. Two of the guests are murderers; they killed <A> and <B>. Open the files in order, one stage at a time. After each, before opening the next, write: your top two suspects, a confidence from 0 to 100% for each, the evidence, and anything that confused you or seemed to contradict itself. Do not guess from story-telling conventions ("the least likely person"); reason only from what was said. Never open a later file early.

Don't tell the playtester the difficulty, the killers, or that you wrote the story.

Compare against the target row. Adjust the knobs and run again. Note each round in the story bible.

Blackwood needed three rounds:

1. Too easy: both killers were named at 1.3.
2. Better: confident at 2.3.
3. About right: confident at 3.1, certain at 3.2.

## Stage timing

The defaults run about 2.5 hours:

- 2 minutes for cards and 6–8 for discussion on most stages;
- 3 and 10 at 2.3;
- 8 and 6 at 3.1 and 3.2;
- 10 minutes for the key hunt at 3.4.

For a shorter or longer night, scale the discussion minutes, not the card minutes.

## The full story and the introduction

- `js/story.js` holds 30–40 narrated slides that tell everything after the reveal: the backstory, each guest's slide, both murders, the evidence against each killer, and an epilogue for everyone.
- `js/intro.js` holds about 14 spoiler-free slides explaining how the night works: characters, scenes, envelopes, whispers, card rules, teams, the vote and the house rules. Nothing about victims, killers or clues.
