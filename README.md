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

## The full story

"The full story" on the title, setup and game screens, and "Tell the whole story" after the reveal, open a narrated walkthrough of the whole mystery: the 1916 cellar, every guest's secret and clue, both murders, how the evidence fits, and what became of everyone. It has animated portraits, sound effects and a spoken voice-over using the browser's built-in voices, with each sentence lit as it is read. It plays by itself, or use the arrow keys, space to pause and Esc to close.

It contains every spoiler, so it stays on the laptop until you press "Show on TV". The TV then shows it full screen and speaks it, and the laptop becomes the remote. Click the TV window once beforehand so the browser allows it to speak. Without a voice it still plays with timed captions.

## Develop

`npm test` runs the logic tests and the content integrity check. Story and card text live in `js/data.js`, the narrated full story in `js/story.js` (drawn by `js/story-view.js`); the design is in `docs/superpowers/specs/`.
