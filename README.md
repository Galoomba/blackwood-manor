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

## Develop

`npm test` runs the logic tests and the content integrity check. Story and card text live in `js/data.js`; the design is in `docs/superpowers/specs/`.
