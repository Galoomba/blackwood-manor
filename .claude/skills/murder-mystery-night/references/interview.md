# The interview

Ask these in order, **one per message**, through AskUserQuestion:

- Put the recommended option first, labelled "(Recommended)".
- Skip any question the user has already answered. Skip any whose answer you can find yourself.
- Keep each answer as a line in `docs/story-bible.md` under "Brief".
- If the user wrote a long brief up front, mine it first and only ask what is missing.

If an answer stays open after asking twice, build with the recommended option, record it under "Open items" in the bible, and raise it again at hand-over. A missing party date means no print deadline: say so at hand-over.

After the last answer, build the whole game without asking more (SKILL.md, steps 2–9). Ask again only if something is truly blocked, such as an ElevenLabs key that returns 401.

## 1. Theme

"What world is the murder set in?"

Offer three fresh, costume-friendly settings, plus the user's own. Pick them to suit the season or occasion if you know it. Examples:

- haunted manor
- 1920s speakeasy
- cursed travelling circus
- 1970s disco on a cruise ship
- Victorian séance
- space station

Recommend the one that gives guests the easiest costumes.

## 2. Tone

"How should it feel?" Options:

- Dark and creepy with dark humour (Recommended for adults)
- Comic and silly
- Serious noir
- Family-friendly (no blood, poison becomes sleeping draught)

## 3. Guests

"How many guests will play, not counting the two hosts?" Options:

- 10–12 (Recommended)
- 8–9
- 13–14
- 15–16

The engine works from 6 to 20. The torn document always has one strip per character.

Plan **two or three more characters than confirmed guests,** marked `optional: true`. Hosts always lose a guest or two on the night.

## 4. Characters

"Do you already have the characters or costumes?" Options:

- Create them all for me (Recommended)
- I'll give you the costumes guests are wearing
- A mix: some fixed, the rest yours

If the user gives some, collect the list next. Ask for each guest's costume, and optionally their name, a photo path and pronouns, in one free-text answer through "Other".

Create the missing characters to fit the theme. Each one gets:

- a costume that is easy to assemble at home
- a symbol emoji
- a public face
- a secret
- a role: killer, red herring, witness or comic

Photos the user supplies replace the inspiration portraits.

## 5. Hosts

"Who plays the two victims?" Options:

- Two hosts: one dies at the toast, one dies at the end of Scene 1 (Recommended)
- One host plus a willing guest as the second victim

Then ask for the hosts' names and the pronouns of their characters, in one free-text answer. Never guess pronouns from a name. Use they/them until told. Their first names go into speaker labels ("Rosa's ghost"), so ask for the first name each victim is called by.

## 5b. How the victims speak

"The two victims keep speaking after death. How?" Options:

- As ghosts, explained by the theme (Recommended: no code changes; suggest a theme-specific reason, such as a séance or a haunted ship)
- Recordings and a survivor: A left recordings; B is only wounded and comes round after 2.3 (about 1–2 extra hours of code changes)

Skip this question for a horror or supernatural theme: ghosts. See story-format.md › Supernatural or not.

## 6. Difficulty

"How hard should it be to name both killers?" Options:

- **Medium (Recommended):** suspicion firms at the torn document (2.3), confident at 3.1, certain at 3.2.
- **Easy:** most tables are sure by 2.3; Scene 3 confirms.
- **Hard:** certain only at the alibis (3.3) or the box letter (3.4); some tables will get it wrong.

This sets the calibration target in story-format.md.

## 7. Length

"How long should the game run, from toast to reveal?" Options:

- About 2.5 hours (Recommended)
- About 2 hours
- About 3 hours

This sets the stage timers (`minutes.cards` and `minutes.discuss`) and the key-hunt minutes.

## 8. Language

Ask only if it isn't obvious from the conversation.

"Which language and spelling for the cards and the voice?" Options:

- English (UK) (Recommended if the user writes UK spelling)
- English (US)
- Another language

ElevenLabs `eleven_multilingual_v2` speaks most languages. Choose voices native to that language.

## 8b. Language level

"How easy should the English be? Guests read their cards aloud, often in a noisy room." Options:

- **Easy English with a few theme words** (Recommended when English isn't everyone's first language): everyday words and short sentences, plus a handful of period or theme words that are explained the first time.
- **Very easy English**: the simplest words and the shortest sentences, no idioms. Best for beginners, younger players or a very mixed group.
- **Rich period English, like Blackwood Manor**: old-fashioned, literary words and longer sentences for atmosphere. Best when everyone reads English easily.
- **Everyday modern English**: natural native-speaker English, idioms allowed, no period style.

For another language, ask the same question about that language. The level applies to everything a guest reads or hears; the host's run sheet and notes stay plain. See story-format.md › Language level.

## 9. Voice-over

"Should the narrator and the ghosts speak aloud?" Options:

- Recorded with ElevenLabs (Recommended)
- Browser voices only (free, robotic)
- No voice; the hosts read everything

ElevenLabs needs an API key with the Text to Speech permission. A whole game is about 60–90k characters, which needs the Creator plan or above.

Ask the user to put the key in `<game>/.env.local` as `ELEVENLABS_API_KEY=...` themselves. Never have them paste it in chat, and never commit it.

## 10. Lights

"Do you have smart lights in the party room?" Options:

- Philips Hue (Recommended if they have it)
- No smart lights

Other brands are not supported. Lights then stay manual, with on-screen cues.

## 11. Props

"Which of these can you get before the night?" Use multiSelect:

- A lockable box with a padlock and spare keys
- A table or cabinet that opens, to hide the box in
- Wine glasses and a tray for the toast
- C5 envelopes (one per guest, plus six)

The box finale (3.4) needs the box and a pile of fake keys. Without them, rewrite 3.4 as a search for a sealed envelope.

The true key also needs a container and a spot (story-format.md › The box). Ask next, in one question: "Where can the true key hide in your room?" Offer what you can see in the theme and the room, such as a small cupboard door at waist height, under an upturned glass on the tray, or inside a hat or shoe from a costume, with the one that needs nothing extra as the recommendation.

Props named in the story must match what the host has.

## 12. Where and when

"Where should the project live?" Options:

- A new folder next to your other projects (Recommended; show the path)
- A new GitHub repo with GitHub Pages
- Somewhere else

Then ask the party date. You need it for the print deadline and for anything date-specific in the story. Hosts usually print 3 days ahead, and after that **nothing printed can change.**
