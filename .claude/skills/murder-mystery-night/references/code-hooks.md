# Story text that lives in code

The engine is data-driven, but a game built for one story leaves story text in its code. This file lists both kinds:

- what `scripts/new-game.sh` renames for you;
- what you must rewrite by hand.

Finish with `scripts/leftovers.sh <game>`. It must print "Clean".

## Renamed automatically by new-game.sh

The script edits every `.js`, `.html`, `.css`, `.md`, `.json` and `.command` file in the new project:

| Before | After |
|---|---|
| `Blackwood Manor` | the title |
| `blackwood-manor`, `blackwood_manor`, `blackwood-*` | the slug |
| `Delilah`, `delilah`, `DELILAH` | Ghost A's name and id |
| `Victor`, `victor`, `VICTOR` | Ghost B's name and id |

The slug renames cover the localStorage keys, the TV window name and the Hue relay ping.

Ghost A's and Ghost B's ids become the team keys and the ghosts' voice ids. B's set piece key `victorReturns` becomes `<b>Returns` everywhere.

The script also renames `Start Blackwood Manor.command` and runs the tests. It leaves `docs/` alone, so a story bible written before scaffolding is safe.

The rename is literal, so it leaves hybrids such as "Rosa Blackwood" (B's surname was Blackwood) in `js/interlude.js`, `js/story.js` and `js/intro.js`. `leftovers.sh` lists them.

## Rewrite by hand

| File | What is story-specific |
|---|---|
| `js/data.js`, `js/story.js`, `js/intro.js` | Everything. See data-schema.md. |
| `js/print.js` | - The character-sheet footer (`· <Title>, All Hallows' Eve`): change it to the new occasion. - The envelope-cover footers. - The torn-document sheet title (`The Crimson Ledger`). - The `PROPS` list (red book, jasmine handkerchief, rabbit hat). - The box setup line. - The prologue rows in the run sheet and host guide (who drinks, who pronounces death). - The host-role paragraphs (pronouns!). - The night-of checklist (envelope counts: "nineteen envelopes, thirteen guests" must become N + 6). |
| `js/app.js` | - The title-screen kicker (`"All Hallows' Eve"`). - The "Enter the manor" button. - `teamLabel()`. - The 2.3 host-panel heading "The ledger in order" and the "Read the ledger aloud" button. - The box print button label. - `INTERLUDE_BUTTON` and `INTERLUDE_CUE` (host cues such as "<B>: fall now"). - The 3.1 host-panel parsing of killers' sabotage, which expects the words "say X instead of Y". Keep that phrasing in the killers' 3.1 sabotage. |
| `js/tv.js` | - The title-screen kicker. - The "She is dead" heading and its subtitle "Scene 1: The Toast". - The `<b>Returns` heading "Two murders, two teams". |
| `js/interlude.js` | - The memorial: B's full name, B's title (`Master of …`) and the date line. - The ghost figure labels. In a non-supernatural theme, restyle the ghost shapes here and in `css/style.css` (`.ghost-shape`). |
| `js/lights.js` | - The look labels (`lightsOut`, `twoGhosts`, `lastLetter`), which follow the rename, and their descriptions ("candles out", "candlelight"). - The intro paragraph in `panel()`. - Colours per scene, if the theme needs others (for example, neon for a disco). |
| Candle motif: `js/ui.js`, `js/tv.js`, `js/app.js`, `css/style.css` (`.candle`, `.candles`), `js/print.js` (`.candle-ink`) | Blackwood's decoration: candles on the title screen and TV, and a candle in each torn strip's margin that burns lower strip by strip (the order marker). Keep candles if they fit the theme. Otherwise restyle them (a gas lamp, a cigarette burning down, a clock hand) and rename the CSS classes. `leftovers.sh` lists these under "gothic motifs", along with other motifs such as manor, crypt and raven. |
| Ghost wording | Only if the user chose "not ghosts" (story-format.md › Supernatural or not): the speaker labels and their regexes in `js/logic.js`, plus every player-visible "ghost" string. |
| `js/story-view.js` | Browser-voice preferences per ghost (`prefs`, `rate`, `pitch`), used only when a clip is missing. Match the ghosts' genders and ages. |
| `scripts/generate-voice.js` | `VOICES`: the ElevenLabs voice for the narrator, both ghosts (with a `chorus` setting) and **every non-killer character** (absent guests speak their clues). See production.md › Voice. |
| `scripts/generate-sfx.js` | Effect descriptions, only if the theme needs different sounds (for example, a ship's horn instead of a church bell). Keep the names: the engine calls them. |
| `remote.html` | The page title (renamed) and the default heading. |
| `README.md` | Rewrite for the new game, keeping the sections. |
| `test/*.test.js` | Tests that name Blackwood characters (such as `selectionWithout('khamun', 'luna')` or `/Zora/`). Rewrite them with the new cast so that each test keeps checking the same rule. Never delete a test to make the suite pass. |
| `scripts/check-content.js` | Only if the format changes, such as a different number of killers. Prefer keeping the format. |

## Structural limits

The engine assumes these. Changing any of them is a code change, not a story change:

- Exactly 10 stages with the fixed ids, in 3 scenes.
- Exactly 2 killers and 2 teams, keyed by the ghosts' ids.
- The torn document has one strip per character.
- The pictures come from `js/art.js`. To add one, draw a new inline SVG there in the same ink style and add its name to `PICTURES`.
- The vote is two names per guest.
