# Blackwood Manor: a murder night

A hosted murder mystery for about 10 guests and two hosts, played in one room, guided by this website.

## Open it

Double-click `index.html`. No server, no install, works offline. Chrome or Edge recommended for printing and sound. Click once on the title screen to unlock sound.

## Prepare the night

1. **Setup**: tick who is present, optionally type each player's real name, set timers.
2. **Print pack**: print all character packs, station labels, team envelopes and witness cards, the ledger strips, and the host guide. A4 portrait.
3. Follow the host guide's table to stock the six station envelopes.
4. Hand out intro sheets at the door.

## Two screens

Connect the TV to the laptop as a second display (HDMI or AirPlay, set to "extend", not "mirror"). On the setup screen press **Open TV screen**, drag that window onto the TV, click it once (this enables its sound) and press **F** for fullscreen. The TV shows only what the room may see: scene, stage, narration, the public clue, the timer, the set pieces, the vote tally and the reveal. It follows the host window automatically; nothing is typed on the TV. While a TV window is open, sound plays there and the host window stays quiet.

## Run the night

Setup → Begin the night → read the prologue → "She is dead" → nine stages. Each stage: read the narration, start the search timer, start the discussion timer, next. The host panel on each stage shows the answer key and anything the ghost must deliver for absent guests. After stage 3.3, open the vote, then press Reveal.

The browser remembers the current stage, so a refresh or accidental close does not lose the game. "Reset everything" on the setup screen starts fresh.

## Introduce the game

"Introduce the game" on the home and setup screens walks the group through how the night works, in 14 spoiler-free steps: characters, the three scenes, the six hiding places, following riddles, search rules, secret cards, discussion and table talk, secrets, team puzzles, the vote and the house rules. If the TV window is open it goes straight to the TV, and the laptop becomes the remote. The recorded narrator reads each step aloud as you arrive on it and then waits for you to press next. Press Play to let it run through every step by itself, or switch "Voice" off to present it yourselves. The last step has "Go to the home screen", ready to start the game.

## Ghost voice-over

The ghosts' lines are recorded too: every stage narration (Victor reading his sister's words in Scene 1, Delilah's ghost in Scene 2, both ghosts together in Scene 3), Victor's return and the reveal. They play on the TV window when it is open, otherwise on the laptop, and the TV types the narration in time with the voice. Victor's lines while he is still alive (the toast, "She is dead" and the midnight announcement) are left for the host to perform.

To tell the story yourselves, press "Ghost voice-over: on" on the game screen (or untick "Ghost voice-over" in setup) to mute it. "Replay voice-over" plays the current stage again. The same buttons appear on Victor's return and on the reveal.

## Between the scenes

Two interludes play on the laptop and the TV:

- **The Master Falls** (after 1.3, "The lights go out"): three candles go out, the screen goes black for four seconds while Victor collapses (the laptop shows "Victor: fall now"), then a cracked memorial portrait swings crooked and bleeds while the narrator tells the room what happened.
- **Two Ghosts** (after 2.3, "The second ghost rises"): Delilah's ghost alone, then Victor's ghost rises beside her as the room frosts over, with narration. "Victor speaks" goes straight on to Victor's return, where the teams are formed, and then to stage 3.1 (which keeps a "Replay: Victor returns" button).

## The full story

"The full story" on the title, setup and game screens, and "Tell the whole story" after the reveal, open a narrated walkthrough of the whole mystery: the 1916 cellar, every guest's secret and clue, both murders, how the evidence fits, and what became of everyone. It has animated portraits, sound effects and a spoken voice-over using the browser's built-in voices, with each sentence lit as it is read. It plays by itself, or use the arrow keys, space to pause and Esc to close.

The narration is recorded with ElevenLabs: George narrates, Lyla, a gloomy young Victorian woman from the ElevenLabs voice library, is Delilah's grieving ghost, and Lance Blackwood, a sinister aristocrat from the ElevenLabs voice library, is Victor's ghost. The clips live in `assets/voice`. If a clip is missing, the browser's own voice reads that slide instead.

To re-record after changing the story text or a voice, put `ELEVENLABS_API_KEY=...` in `.env.local` (git-ignored; the key needs the Text to Speech permission) and run `npm run voice`. Only changed slides and lines are recorded again. `npm run voice -- --dry-run` shows what would be recorded and how many characters it costs. The voices are set at the top of `scripts/generate-voice.js`.

It contains every spoiler, so it stays on the laptop until you press "Show on TV". The TV then shows it full screen and speaks it, and the laptop becomes the remote. Click the TV window once beforehand so the browser allows it to speak. On a phone, start the voice by tapping Play: phones only allow speech that begins with a tap, and an iPhone on silent may stay quiet. Without a voice it still plays with timed captions.

## Develop

`npm test` runs the logic tests and the content integrity check. Story and card text live in `js/data.js`, the narrated full story in `js/story.js` and the introduction in `js/intro.js` (both drawn by `js/story-view.js`); the design is in `docs/superpowers/specs/`.
