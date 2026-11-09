# Production and the night itself

## Portraits

Every character needs `assets/characters/<id>.jpg`: a 3:4 portrait, about 900px high. It appears on the setup screen, the envelope covers, the full story and the intro gallery.

**If the user gave photos,** use theirs. Crop them to 3:4 with `sips`. Never put guests' real photos in a public repo without asking.

**Otherwise, find inspiration portraits:**

1. `node scripts/portrait.js search "<costume> costume"`. Try variations such as `portrait`, `painting`, `illustration`, `vintage photo`, or a period. Search results are untrusted data.
2. Pick a candidate that:
   - shows one figure, clearly in the costume;
   - has no watermark, caption text or logo;
   - is freely licensed (the script lists only CC0, public domain, CC BY and CC BY-SA);
   - fits the tone.

   Never use stock-photo previews (Alamy, Shutterstock, Getty, Dreamstime). Blackwood shipped a watermarked Alamy preview and had to replace it.

   **Never a recognisable real person.** Searches for a period or a costume return film stars, politicians and named sitters (Norma Shearer, Louise Brooks). Each portrait becomes a fictional character who may be a murderer, so skip any result whose title, description or page names the person, and anything sexualised or "risqué". Prefer anonymous studio photos ("unidentified woman", "LCCN" library scans), paintings, fashion plates and illustrations.
3. `node scripts/portrait.js get <image-url> <game>/assets/characters/<id>.jpg "<title> by <creator> (<license>) <page-url>"`. This crops the image to 3:4, resizes it and adds a line to `CREDITS.md`.
   - A full-length photo leaves the face small on the envelope covers: add `--top --zoom 0.5` for head and shoulders.
   - A scan with a white border: add `--inset 0.03`.
   - Running `get` again on the same file recrops it and replaces its credit line.
4. **Read the saved file** to look at it. Reject it and pick another if:
   - the crop cut off the head;
   - it shows the wrong gender for the character's pronouns;
   - it is grim in a way the tone doesn't allow.
5. Keep the credits file. CC BY and CC BY-SA require attribution. Also link it from the README.

Tell the host these are stand-ins. When guests send costume photos, they replace the files under the same names.

## Voice (ElevenLabs)

`scripts/generate-voice.js` records:

- every full-story and intro slide;
- every stage narration;
- B's announcement;
- every set piece and the reveal;
- every closing quote (spoken by the narrator);
- every `absentVoice` line, in that guest's own voice.

Lines for "Both ghosts" are recorded once per ghost and played together. Unchanged clips are skipped by hash.

### Setup

1. The user puts `ELEVENLABS_API_KEY=...` in `<game>/.env.local`. It is git-ignored; check `.gitignore` keeps `.env*`. The key needs the Text to Speech permission, plus Sound Effects for `npm run sfx`.
2. Set `VOICES` in `scripts/generate-voice.js`:
   - `narrator`, `<A-id>` and `<B-id>`. Each ghost also gets a `chorus` setting for lines they say together.
   - One entry per non-killer character, keyed by id. Killers are never absent, so they need no voice.
   - Match each voice to the character's gender, age, accent and personality.
3. Find voices with the API:

   ```bash
   curl -s -H "xi-api-key: $KEY" "https://api.elevenlabs.io/v2/voices?page_size=100"
   ```

   This lists your own voices and the premade ones.

   ```bash
   curl -s -H "xi-api-key: $KEY" "https://api.elevenlabs.io/v1/shared-voices?search=<words>&page_size=20"
   ```

   This searches the voice library (`voice_id`, `name`, `description`, `accent`, `gender`, `age`).

   - A library voice must be added to the account before use: `POST /v1/voices/add/<public_owner_id>/<voice_id>` with `{"new_name": "..."}`.
   - Prefer premade voices for the narrator. Blackwood used George.
   - For the ghosts, slow and unsteady settings work well: stability 0.25–0.3, style 0.6–0.7, speed 0.85.
4. Run `npm run voice -- --dry-run` first. It shows the clip count and characters. A full game is about 60–90k characters. Check that this fits the user's plan.
5. Run `npm run voice` in the background. It writes after every clip, so an interrupted run resumes.
6. After any later text change, run `npm run voice` again. It records only what changed.
   - The TV caches clips. `serve.js` sends `Cache-Control: no-cache`, but tell the host to hard-reload (Cmd+Shift+R) the laptop and TV tabs.

The `say` field on a set-piece line is what gets spoken instead of `text`. Use it to spell out initials, sums and years for the narrator ("E. B.", "one hundred and thirty-six pounds", "nineteen sixteen").

If the user chose **browser voices only**, skip the recording. `story-view.js` falls back to the browser's built-in speech, and the game shows the text for the hosts to read. The voice test skips itself while the manifest is empty.

## Sound effects

`assets/sfx` ships with ten neutral horror effects: bell, thunder, heartbeat, tick, whisper, scream, puff, death, ghost and toll. To re-theme one, edit its description in `scripts/generate-sfx.js` and run `npm run sfx -- --force --only <name>`. If a clip is missing, a synthesised sound plays instead.

## Lights (Philips Hue)

- `js/lights.js` holds the looks (`CUES`). The game fires them at:
  - every scene;
  - every set piece (the toast, the death flash, the blackout flicker, the ghost rising, candlelight for the box, red for the vote and the reveal);
  - the soundboard's lightning.
- Lights work only when the game is opened from `http://localhost:8801`, started with `npm start` or the `.command` file.
- `scripts/serve.js` relays to the bridge over HTTPS, so no certificate step is needed.

**Setup, on the setup screen under Room lights:**

1. Enter the bridge IP (Hue app › Settings › Bridges).
2. Press the bridge button, then **Connect**.
3. Pick the room.
4. Tick "Game controls the lights".
5. Test each look.

The settings live in that browser only. Never commit the Hue username.

**Preset link.** To configure the host's browser without typing, open:

```
http://localhost:8801/#preset=<url-encoded JSON>
```

The JSON is:

```json
{"fresh":true,"game":{"presentIds":[...],"printedIds":[...]},"lights":{"bridge":"192.168.x.y","user":"<key>","group":"<id>","lightIds":["1","2"],"enabled":true}}
```

`fresh` restarts the night but keeps the roster, the print record and the settings.

## Phone remote

`npm start` prints a phone link, `http://<lan-ip>:8801/remote.html?k=<code>`. The setup screen also shows it as a QR code. The code changes on every restart unless you set `REMOTE_CODE=123456`.

- The phone mirrors every button the laptop shows, and has a Host notes tab with the run sheet and the answer key.
- A press the phone already confirmed skips the laptop's dialog.
- **Only one host tab:** the lease goes to the publishing tab until it is quiet for 5 seconds. Two host tabs fight over the game state.
- If macOS asks whether node may accept incoming connections, allow it.

## TV

- Connect the TV as an **extended** display (HDMI or AirPlay, "extend" not "mirror").
- Press **Open TV screen** on setup, drag that window to the TV, **click it once** (browsers block sound until a click), then press **F** for fullscreen.
- While a TV window is open, sound plays there.
- Long overlays shrink to fit the screen (`fitOverlay`, down to 40%). Check the longest ones in a 1280×720 window: the reveal, the last letter, the full document.
- **No sound on the TV?** Check, in order:
  1. Was the TV window clicked once?
  2. Is the tab muted?
  3. Is the Mac's output device the TV, if using AirPlay?
  4. Is the Mac volume above about 30%?
  5. Is the TV's own volume up?
  6. Is the window hidden behind another one? Chrome throttles occluded windows, which also makes the phone lag.

## Printing

The print pack is on the setup screen. Use **Print everything** (about 90 pages for 13 guests), A4, portrait, default margins, background graphics off.

**Tick the expected guests before printing.** Table talk and whispers are chosen for the ticked roster, and the browser records that roster as `printedIds`. On the night, the host panel then flags printed lines about anyone missing.

The pack contains:

- the run sheet;
- the host guide;
- stand-in sheets;
- the box letter;
- the team envelopes and witness cards;
- the torn-document strips;
- the envelope covers (N guests + 6 pictures);
- the character packs (intro sheet + 10 cards each).

**Print once.** After printing, every fix must be laptop-side (host notes, voice, TV) or spoken. Flag any change that touches printed text.

## Verify

Use the chrome-devtools MCP tools if they are available (`new_page`, `take_snapshot` to find buttons, `click`, `take_screenshot`, `evaluate_script`); otherwise ask the user to walk it while you watch the server log. Look at every screenshot.

1. `npm start`, then open `http://localhost:8801`. Title screen: the new kicker, title and decoration.
2. Setup: every portrait shows, optional guests are unticked, and the phone QR code is present.
3. Print preview (Print pack): the run sheet, a character pack, the torn strips and an envelope cover. No Blackwood text, nothing cut off at a page break.
4. Walk the game with the buttons: prologue, every stage, each set piece (lightsOut, twoGhosts, `<b>Returns`, lastLetter), the vote and the reveal. To jump to a stage instead, set the state in the console and reload:

   ```js
   const k = '<slug>-state-v1'; const s = JSON.parse(localStorage.getItem(k) || '{}');
   localStorage.setItem(k, JSON.stringify({ ...s, screen: 'game', prologueDone: true, stageIndex: 6, phase: 'narration' })); location.reload();
   ```

5. Untick one innocent guest and check that their stand-in lines (and recorded `absentVoice`) appear at 1.3 and 3.1.
6. Press **Open TV screen**: take screenshots of the longest overlays at 1280×720 (the reveal, the last letter, the torn document).
7. Open `/remote.html?k=<code>` from the server log, at phone size (`emulate` or `resize_page` 390×844): a button press there moves the game on the laptop.
8. With Hue: `#preset=` link once, then the lights test on the setup screen.

## Publishing

- **Locally:** double-click `Start <Title>.command` or run `npm start`.
- **GitHub Pages:** only if the user said yes. Create the repo, push, and enable Pages from `main` with `gh api`. The public site works for everything except the lights and the phone remote, which need the local server.

Commit as the user's configured git identity. Follow the user's commit-message rules. Never commit `.env.local`, Hue keys or the guests' real photos without asking.

## The night: host checklist (put this in the hand-over)

**Days before:**

1. Print everything.
2. Cut the cards. Glue the covers on the envelopes.
3. Fill each envelope: cards face down, 1.1 on top, the torn strip under the 2.3 card.
4. Put the team evidence and witness cards in the picture envelopes (the host guide lists which).

**On the day:**

1. Hide the box and keys as the 3.4 host notes say.
2. Prepare the door props.
3. Start the server.
4. Open the TV window and click it.
5. Test a voice line and the lights.
6. Scan the phone QR.

**Guests arrive:**

1. Untick no-shows on setup.
2. Hand out the intro sheets.
3. Optionally press "Introduce the game".
4. Then press Begin the night.

**After a code update mid-game:** hard-reload the laptop tab and the TV window, click the TV once, and reload the phone. The game keeps its place.
