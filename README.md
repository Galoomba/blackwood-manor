# Blackwood Manor: a murder night

A hosted murder mystery for about 10 guests and two hosts, played in one room, guided by this website.

## Open it

Double-click `index.html`. No server, no install, works offline. Chrome or Edge recommended for printing and sound. Click once on the title screen to unlock sound.

## Prepare the night

1. **Setup**: tick who is present, optionally type each player's real name, set timers.
2. **Print pack**: "Print everything" prints the whole pack in one go (about 92 pages, host material first), or print each part on its own: all character packs, the stand-in sheets (one per guest who might not come: what to say for them and which cards mention them), the envelope covers, the team envelopes and witness cards, the ledger strips, the box letter, the host guide (answers and details) and the host run sheet (one page: what happens, in order, and which button to press). A4 portrait.
3. Glue a cover on each of 19 C5 envelopes: one per guest with their portrait, and six pictures (plant, television, bookshelf, lamp, and two empty decoys, clock and mirror) for the team stages.
4. Set who is present before printing: the character packs leave out whispers and table talk about absent guests. Fill each guest's envelope with their own cards, face down, 1.1 on top, with their ledger strip under the 2.3 card. Put the team evidence and witness cards in the picture envelopes (the host guide lists which). Lay the 13 guest envelopes on the table (minus absent guests). Only the host opens the picture envelopes: a team names its picture, and a wrong one costs a minute.
5. Set up the box: lock Delilah's letter inside, put the true key in the rabbit hat, and hide the fake keys anywhere in the room.
6. Hand out intro sheets at the door.

## Two screens

Connect the TV to the laptop as a second display (HDMI or AirPlay, set to "extend", not "mirror"). On the setup screen press **Open TV screen**, drag that window onto the TV, click it once (this enables its sound) and press **F** for fullscreen. The TV shows only what the room may see: scene, stage, narration, the public clue, the timer, the set pieces, the vote tally and the reveal. It follows the host window automatically; nothing is typed on the TV. While a TV window is open, sound plays there and the host window stays quiet.

## Run the night

Setup → Begin the night → read the prologue → "She is dead" → ten stages. Each stage: read the narration, "Cards out" (everyone takes the top card from their own envelope), start the discussion timer, next. The host panel on each stage shows the answer key and anything the ghost must deliver for absent guests. Then open the vote and press Reveal.

When a stage's discussion ends, the TV and the laptop show a closing quote: a line from inside the story (the inscription over the door, the Inspector's notebook, the box lid) that hints at the stage without giving anything away.

The foot of every card carries a whisper: one true detail about another guest, who is never named. A whisper about a guest who is absent tonight is left off the printed card.

## The box (stage 3.4)

After the alibis, Delilah tells the room she left a letter locked in a box. Fake keys are hidden all over the room; the true key is in the rabbit hat, and the hat itself sits behind a small door at about waist height (a cupboard, cabinet or sideboard). Half the guests' hints say what holds the key (a black hat, a conjuring set, long ears), the other half say where (behind a little door, at a child's height), while Zora sends people low and Krank sends them high. Each innocent's 3.4 card holds one piece of where it is (Victor's old conjuring hat, "where something always comes out that never went in"). Both killers know the hiding place and have orders to send the room searching in the wrong places: Zora low, Krank high. House rule: each guest may try the lock once, and the killers may lie but may not touch, move or pocket the true key. Press "The box is open" and Delilah's ghost reads her last letter, which names both motives but not the killers, then two minutes of last words and the vote. The letter all but names both killers, so they have every reason to keep it shut. If time runs out, "The box stays shut: open the vote".

The browser remembers the current stage, so a refresh or accidental close does not lose the game. "Reset everything" on the setup screen starts fresh.

## Introduce the game

"Introduce the game" on the home and setup screens walks the group through how the night works, in 14 spoiler-free steps: characters, the three scenes, your envelope, the whispers, the rules for cards, secret cards, discussion and table talk, secrets, team puzzles, the vote and the house rules. If the TV window is open it goes straight to the TV, and the laptop becomes the remote. The recorded narrator reads each step aloud as you arrive on it and then waits for you to press next. Press Play to let it run through every step by itself, or switch "Voice" off to present it yourselves. The last step has "Go to the home screen", ready to start the game.

## Ghost voice-over

The ghosts' lines are recorded too: every stage narration (Victor reading his sister's words in Scene 1, Delilah's ghost in Scene 2, both ghosts together in Scene 3), Victor's return, Delilah's last letter and the reveal. They play on the TV window when it is open, otherwise on the laptop, and the TV types the narration in time with the voice. Victor's lines while he is still alive (the toast, "She is dead" and the midnight announcement at the end of 1.3) are recorded in his voice too; the host acts along, or mutes the voice-over to say them in person.

To tell the story yourselves, press "Ghost voice-over: on" on the game screen (or untick "Ghost voice-over" in setup) to mute it. "Replay voice-over" plays the current stage again. The same buttons appear on Victor's return and on the reveal.

## Between the scenes

Two interludes play on the laptop and the TV:

- **The Master Falls** (after 1.3, "The lights go out"): three candles go out, the screen goes black for four seconds while Victor collapses (the laptop shows "Victor: fall now"), then a cracked memorial portrait swings crooked and bleeds while the narrator tells the room what happened.
- **Two Ghosts** (after 2.3, "The second ghost rises"): Delilah's ghost alone, then Victor's ghost rises beside her as the room frosts over, with narration. "Victor speaks" goes straight on to Victor's return, where the teams are formed, and then to stage 3.1 (which keeps a "Replay: Victor returns" button).

The full story has both as well: "The Master Falls" right after Victor is killed in the dark, and "Two Ghosts" just before Victor returns.

## The full story

"The full story" on the title, setup and game screens, and "Tell the whole story" after the reveal, open a narrated walkthrough of the whole mystery: the 1916 cellar, every guest's secret and clue, both murders, how the evidence fits, and what became of everyone. It has animated portraits, sound effects and a spoken voice-over using the browser's built-in voices, with each sentence lit as it is read. It plays by itself, or use the arrow keys, space to pause and Esc to close.

The narration is recorded with ElevenLabs: George narrates, Lyla, a gloomy young Victorian woman from the ElevenLabs voice library, is Delilah's grieving ghost, and Lance Blackwood, a sinister aristocrat from the ElevenLabs voice library, is Victor's ghost. The clips live in `assets/voice`. If a clip is missing, the browser's own voice reads that slide instead.

To re-record after changing the story text or a voice, put `ELEVENLABS_API_KEY=...` in `.env.local` (git-ignored; the key needs the Text to Speech permission) and run `npm run voice`. Only changed slides and lines are recorded again. `npm run voice -- --dry-run` shows what would be recorded and how many characters it costs. The voices are set at the top of `scripts/generate-voice.js`.

It contains every spoiler, so it stays on the laptop until you press "Show on TV". The TV then shows it full screen and speaks it, and the laptop becomes the remote. Click the TV window once beforehand so the browser allows it to speak. On a phone, start the voice by tapping Play: phones only allow speech that begins with a tap, and an iPhone on silent may stay quiet. Without a voice it still plays with timed captions.

## Room lights (Philips Hue, optional)

The game can set Hue lights at the big moments: warm for the toast, a red flash when Delilah dies, a blackout when Victor falls and moonlight when her ghost speaks, violet when Victor rises, candlelight for the box and the last letter, red for the vote, candles out and red for the reveal, then house lights. The lightning button flashes them too.

Open the game from the laptop (`python3 -m http.server 8801`, then http://localhost:8801): the public link cannot reach devices at home. On the setup screen, under **Room lights**: type the bridge's IP address (Hue app › Settings › Bridges), press **Trust the bridge** and accept the browser's certificate warning once, press the round button on the bridge and then **Connect**, choose the room, and tick **Game controls the lights**. Each look has a test button. The settings stay in that browser only. Only the host window drives the lights.

## Sound effects

The soundboard effects (bell, thunder, heartbeat, tick, whisper, scream, puff, death, ghost, toll) are recorded with ElevenLabs sound generation and live in `assets/sfx`. Each one is described in words at the top of `scripts/generate-sfx.js`. To change one, edit its description and run `npm run sfx`; to get a new take of the same description, run `npm run sfx -- --force --only toll`. If a clip is missing, the browser's own synthesised version plays instead. The background ambience is still synthesised.

## Develop

`npm test` runs the logic tests and the content integrity check. Story and card text live in `js/data.js`, the narrated full story in `js/story.js` and the introduction in `js/intro.js` (both drawn by `js/story-view.js`); the design is in `docs/superpowers/specs/`.
