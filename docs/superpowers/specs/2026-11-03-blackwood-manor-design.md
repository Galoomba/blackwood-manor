# Blackwood Manor: A Murder Night — Design

Date: 2026-11-03
Status: draft for host review

## 1. Summary

A hosted murder-mystery party for about 10 players plus two hosts, played in one living room, guided by a single offline website. Theme: haunted manor, vampires, zombies, the Great War. Tone: dark and creepy with dark humour. Three scenes of three stages each, then a vote and a reveal. Nine stages at roughly 12 minutes each gives a night of about 2.5 hours including prologue and reveal.

Hosts:
- **Victor Blackwood** (you): master of the house, dark noble coat. Alive in Scene 1, murdered at its end, returns as a ghost in Scene 3.
- **Delilah Blackwood** (your friend): Victor's sister, dressed as a ghost from the start. Dies in the prologue. Her ghost whispers to Victor in Scene 1 and runs the room in Scene 2.

Players: the 12 pictured costumes. Minimum required characters: **Madame Zora** and **Dr. Krank** (the murderers). Every other character is optional, and a second cat (Luna) may be added.

## 2. The story

In 1916 Ezekiel Blackwood turned the manor cellar into a war hospital. The fortune did not come from healing. Soldiers who were marked "lost" were sold at midnight to Lucien Graves, an undertaker who never aged. The broker who found the dying was Madame Zora's grandmother. The nurse who tried to stop it, Nurse Ashgrove, was driven out as a witch. Every sale was written in the **Crimson Ledger**.

Victor and Delilah inherited the manor and never knew. Last week Delilah found the ledger and the true will behind the cellar wall. She tore the ledger's pages out and hid them through the house, so that no single thief could take the whole truth, and invited everyone whose family is named in it. At midnight she meant to read it all, confess, and give the fortune away.

At the welcome toast, Delilah drinks and dies. Her ghost can only reach her brother.

**Murderer 1 — Madame Zora.** The Zoras have received a yearly cheque "for discretion" since 1916. The ledger names them as brokers. Zora poisoned Delilah's glass with nightshade while "reading the glasses' fortunes", masking the bitterness with her jasmine oil. The empty vial went into the potted plant; the stained handkerchief into her sleeve.

**Murderer 2 — Dr. Wilhelmina Krank.** Victor has paid her £2,000 a month for two years for reanimation research. Her first subject was his accountant Edgar Mills, who died at his desk and came back wrong. When Victor announces at the end of Scene 1 that he will finish Delilah's work and read everything at midnight, Krank realises her laboratory is on those pages. In the dark she crosses the room and empties syringe K-7 into his neck.

The two killers do not know each other. In Scene 2 each learns what they did, receives sabotage orders, and receives a secret sign to find the other.

**The obvious suspect who did not do it:** Lucien Graves, the undertaker, is a real vampire. He stopped buying in 1918 and came tonight to help Delilah burn the ledger. The hunter chases him all night.

## 3. Characters

Symbols appear on every card and station envelope so players take only their own.

| # | Symbol | Costume | Name | Public face | Secret | Role |
|---|---|---|---|---|---|---|
| 0 | 🔍 | Detective | Inspector Ambrose Finch | Hired by Delilah to guard "a book" | Took a bribe from a hooded figure to look away at midnight. It was Zora in Malachi's spare hood. | Red herring, witness in Scene 3 |
| 1 | 🗡 | Graveyard woman with stake | Rosalind Vane, the Hunter | Hunts the undead | Grandfather is ledger number 41. Her stake is a chair leg. | Red herring, drives the vampire chase |
| 2 | 🐾 | Cat woman | Selene Nocturne | "A friend of the family" | Cat burglar hired by Malachi to steal the ledger. It was already empty. | Holds the cover, Scene 2 reveal |
| 3 | ⚗ | Mad scientist | Dr. Wilhelmina Krank | Victor's chemistry consultant | **Murderer of Victor** | Murderer 2 |
| 4 | ⛧ | Hooded cultist | Brother Malachi | Grand Hierophant of the Order of the Crimson Seal | The Order has three members and a newsletter. He hired the cat. | Comic red herring |
| 5 | 🗝 | Maid | Agnes Thorne | Housekeeper for 30 years | Ezekiel's granddaughter by Nurse Ashgrove, the true heir. Morgana's cousin. | Optional witness |
| 6 | 🐦 | Plague doctor | Dr. Corvus | Family physician, masked | Not a doctor. Private Daniel Cole, number 17, the only soldier who escaped the cellar. | Red herring |
| 7 | ☥ | Mummy | Khamun | A sarcophagus bought with cellar money | Woke three weeks ago; nobody noticed because they think he is decor. Saw Zora at the glass. | Witness 1 (optional) |
| 8 | 🧙 | Witch | Morgana Ashgrove | "I cursed this house" | Granddaughter of Nurse Ashgrove. Her curse is theatre; her herbs are sage. | Red herring |
| 9 | 📒 | Zombie | Edgar Mills | Victor's accountant, "recovering" | Died two months ago, reanimated by Krank. Remembers her laugh. | Witness 2 (optional) |
| 10 | 🔮 | Fortune teller | Madame Zora | Beloved seer who "foresaw a death" | **Murderer of Delilah** | Murderer 1 |
| 11 | 🎩 | Top-hat gentleman | Lucien Graves, the Undertaker | Polite, pale, never drinks | A 324-year-old vampire. Innocent tonight. | The obvious suspect |
| 12 | 🐾🐾 | Second cat woman | Luna Nocturne | Selene's "twin" | Met Selene in prison; they just look alike. Watched the hallway all evening. | Optional witness |

## 4. Mechanics

### 4.1 Stations

Six fixed hiding spots: **Sofa, Bookshelf, Television, Plant, Lamp, Cupboard**. Each gets a printed label and one large envelope. Before guests arrive the host stocks each envelope with every card routed to it (the host guide lists them). Nothing is hidden during the game.

Card routing: character index `i` (table above), stage index `s` from 0 (stage 1.1) to 8 (stage 3.3). Station = `(i + s) mod 6`, where 0 Sofa, 1 Bookshelf, 2 Television, 3 Plant, 4 Lamp, 5 Cupboard. Luna uses `(5 + s) mod 6`. Every station holds exactly two cards per stage (three where Luna lands). The website computes and prints this; nobody needs the formula on the night.

Team envelopes (Scene 3) have fixed homes: Team Delilah 3.1 at the **Plant**, 3.2 at the **Bookshelf**; Team Victor 3.1 at the **Television**, 3.2 at the **Lamp**.

### 4.2 Cards

Each player starts with an **intro sheet** (A4): name, costume, how to act, a quirk to keep all night, the public line they must say to everyone, what they know, and the riddle to their 1.1 card.

Each of the nine **cards** (A6, four to an A4 page with cut lines) shows: symbol, character name, stage number, the card's content, and the riddle to that character's next card. The 3.3 card has no riddle. Cards for killers carry sabotage orders in a marked box.

Riddles come from a bank of three per station (section 6). A card pointing at stage `t` uses variant `t mod 3` of the riddle for that target station (the intro sheet points at stage 0). Two players heading to the same station at the same stage share a riddle, which is harmless.

### 4.3 Individual vs team

- **Individual only** (private riddle, private card, nobody else may read it): 1.1, 1.2, 2.1, 2.2, 3.3.
- **Individual find, group solve**: 1.3. Each player finds their own observation; it only means something when the room pools them.
- **Team only**: 2.3, 3.1, 3.2.
  - 2.3: every 2.3 envelope also holds one torn strip of the ledger. The strips only read as a page when the whole room lays them out in order. Ordering clue: a candle printed in the left margin burns lower on each successive strip. The host rule: every strip goes on the table; nobody may keep one.
  - 3.1 and 3.2: each team member's card carries one numbered word. Only the whole sentence names the station holding the team envelope. The killers are ordered to say their word wrong.

### 4.4 A stage on the website

1. **Narration.** Host reads the ghost's words aloud. The stage's public clue is highlighted.
2. **Search.** Timer, default 5 minutes. Players solve their riddle and fetch their card.
3. **Discussion.** Timer, default 7 minutes. Players share what they may and argue.
4. **Next.** Some stages have an extra set-piece button (Victor's death, Victor's return).

A collapsible host-only panel shows the answer key for the stage, the station routing table, and any **orphaned clues**: content owned by an absent character that the ghost must now deliver. For a team-word, the ghost "whispers the missing word". For a ledger strip, the ghost "found a page in the walls" and the host lays it down. For the Scene 3 witness cards, the ghost reads them.

### 4.5 Scene 3 teams

- **Team Delilah** (investigates the poison): Vane, Morgana, Selene, Luna, Khamun, Agnes, Zora.
- **Team Victor** (investigates the needle): Finch, Corvus, Edgar, Graves, Malachi, Krank.

Each killer sits on the team hunting their own crime. Victor's ghost leads Team Victor; Delilah's ghost leads Team Delilah.

### 4.6 Vote and reveal

Each present player names two suspects on the website. Live tally. The house wins only if both killers are among the two most-voted names (ties lose). Then the reveal plays and the ghosts tell the whole truth.

## 5. Script

### 5.0 Prologue (website screen "The Toast")

Victor, aloud: "Friends. Strangers. Whatever the mummy is. Welcome to Blackwood Manor. My sister has gathered you here because she believes this house owes each of you a debt. At midnight she will pay it. Until then: eat, drink, and try not to touch the curtains, they are older than the undertaker. To Delilah."

Delilah raises her glass, drinks, drops it, and falls. Dr. Corvus pronounces her dead. Victor presses **She is dead**: the screen goes black, a single bell tolls, and the title "Scene 1 — The Toast" appears.

Victor, aloud: "She is… she is gone. I can hear her. Can none of you hear her? She is standing right there. She says… she says one of you did this. And she says she will tell me who, piece by piece, if you will play her game. Each of you has a sheet. Each sheet has a riddle. Go."

### 5.1 Stage 1.1 — Who you are

Ghost (Victor reads): "Brother, I cannot see faces yet, only shapes. Make them tell me who they are. Each of them carries a lie they think is a costume. Let them find it. And brother: **the glass that killed me was not the glass I was handed.** Agnes poured it. Someone else touched it."

Public clue: *The glass that killed me was not the glass I was handed.*

Host notes: players read privately. Nobody shares yet except their public line and their quirk. Discussion is introductions in character.

### 5.2 Stage 1.2 — Why you came

Ghost: "I wrote thirteen letters. I told each of them a piece of the truth, enough to bring them. Ask them why they came, brother, and watch who lies. And know this: **someone in this room was paid to be blind tonight.** I do not know by whom. I only know the envelope was heavy."

Public clue: *Someone in this room was paid to be blind tonight.*

### 5.3 Stage 1.3 — What you saw

Ghost: "They all saw something. None of them know it matters. Make them say it aloud, every one, and lay the pieces side by side. Brother… when I fell, I smelled **jasmine.** Over the wine. Under the wine. Jasmine."

Public clue: *Jasmine. I smelled jasmine when I fell.*

Host notes: every player must state their observation aloud. End the discussion with Victor's announcement.

**Victor's announcement** (shown on the website, read aloud): "Enough. My sister died for a book. She tore its pages and hid them in this house so that no one of you could steal the whole of it. At midnight I will find every page and read every line, and if it ruins the name of Blackwood then let it. Nobody leaves this house before then. Nobody."

Set piece **The lights go out**: screen blackout, lightning flicker, thunder, a scream. Victor collapses (act it: four seconds in the dark, then still). When the lights return the screen reads "Scene 2 — The Master Falls". Delilah's ghost now speaks to everyone; Victor stays on the floor until the host is ready, then quietly becomes the "body" and may help backstage.

### 5.4 Stage 2.1 — What you hide

Delilah's ghost (friend reads, to the room): "You can hear me now. All of you. Good; I am tired of whispering. My brother lies there with one hole in his neck. Not two. Not teeth. **My brother fell by a needle, not a fang.** Each of you hides something. Tonight it comes out. Go and find what you are."

Public clue: *My brother fell by a needle, not a fang.*

Host notes: the killers learn the truth on this card. Expect Krank to accuse Graves and Zora to accuse Morgana's herbs. Let them.

### 5.5 Stage 2.2 — What you want

Ghost: "Now I know what you hide. Tell me what you want, and I will tell you what I see. I see **two hands did this, and they have not yet shaken.** Two of you. Strangers. Looking for each other across this room right now."

Public clue: *Two hands did this, and they have not yet shaken.*

Host notes: both killers now hold the sign ("the candles burn low" / "and the wax remembers"). Watch for it. Innocents' cards give them personal goals to role-play.

### 5.6 Stage 2.3 — The torn pages

Ghost: "I tore the ledger into thirteen pieces and hid them in this house. You have been carrying them to the table all night without knowing. Find your piece. Lay it down. All of them, on the table, in order; the candle in the margin burns lower on each. Then read my grandfather's confession aloud, together. **Two of the lines on that page name the ones you seek.** They will tell you the lines mean something else."

Public clue: *Two lines on that page name the ones you seek.*

Host notes: the host enforces: every strip on the table. Absent characters' strips are "found in the walls" by the ghost. Expect Krank to claim "W.K." means "War Kitchen" and Zora to claim "Z." means "Zeke". Selene reads Delilah's note (strip 1) aloud.

**The ledger page, in order** (strip number, holder):
1. Selene — Note in Delilah's hand, tucked in the cover: "I tore the pages and hid them through the house so that no one thief could take the whole truth. Only all of you together can read it. — D."
2. Graves — "Terms: L.G. collects the 'lost' at midnight. Payment in gold. No questions." (Later hand in the margin: "I stopped. Forgive me. — L.G., 1918")
3. Morgana — Nurse Ashgrove's note, folded in the roll: "They are not dying. He is letting them die. God forgive me, I counted."
4. Krank — "Cellar roll, 1916. 'Lost' this month: 17 souls. Paid out: £136. — E.B."
5. Vane — "41. Pvt. T. Vane. Lung wound. 'Lost.' Sold, £8. Collected by L.G., midnight."
6. Corvus — "17. Pvt. D. Cole. Burns. 'Lost.' NOT collected. Escaped. Do not pursue; nobody will believe him. — E.B."
7. Malachi — "Buyer: L.G., undertaker, Graves & Sons, est. 1702. Collects at midnight. Does not sign. Does not age."
8. Agnes — "Nurse M. Ashgrove dismissed, 1917, for 'hysteria and witchcraft'. Her allegations are not to be repeated. — E.B."
9. Khamun — "Purchases, 1920: one sarcophagus, Theban, occupied. £400 from the cellar account. — E.B."
10. Zora — "Broker: Mme. Z. Finds the dying. Ten percent per soul. Paid in perpetuity 'for discretion'. — E.B."
11. Finch — "Retainer to Z.: paid every All Hallows' Eve, in perpetuity, for 'services of discretion'. Still paid. — E.B."
12. Luna — "Lab. W.K.: £2,000 monthly from the estate account. Subject: E.M., deceased, 'returned'. — V.B."
13. Edgar — Private note, V.B., last week: "Delilah is right. At midnight I read it all: grandfather's cellar, the broker, my laboratory. Then I end it. God help me, Edgar."

### 5.7 Scene 3 opening — Two Ghosts

Set piece **Victor returns**: cold wind, a second ghost silhouette joins the first, the title "Scene 3 — Two Ghosts". Victor stands up from the floor as a ghost (a white sheet or pale make-up is enough).

Victor's ghost: "Well. That was unpleasant. Delilah, you were right, and I am sorry, and I am also dead, so let us be efficient. Two murders, two teams. Those who came for my sister: stand with her. Those who came for me: stand with me. You will each receive one word. Alone your word is nothing. Together it is a place."

Delilah's ghost: "Team Delilah: Vane, Morgana, the cats, Khamun, Agnes, Zora. With me."
Victor's ghost: "Team Victor: Finch, Corvus, Edgar, Graves, Malachi, Krank. With me. Try not to die."

### 5.8 Stage 3.1 — The weapon

Both ghosts: "Find your words. Speak them in order. Go where the sentence sends you. What you find there is what killed us."

Public clue: *What killed us is still in this room.*

Team Delilah sentence (7 words, holder in order): LOOK (Vane) WHERE (Morgana) GREEN (Selene) GROWS (Luna) BUT (Khamun) NEVER (Agnes) WALKS (Zora) → **Plant**.
Team Victor sentence (6 words): THE (Finch) GLASS (Corvus) FACE (Edgar) THAT (Graves) NEVER (Malachi) BLINKS (Krank) → **Television**.

Team Delilah envelope (Plant): "THE VIAL. A small brown apothecary vial, corked, empty but for a purple residue. The label reads NIGHTSHADE. It smells overwhelmingly of jasmine. Discuss: who in this room smells of jasmine, and who covers bitter things with sweet ones?"
Team Victor envelope (Television): "THE SYRINGE. A glass syringe, plunger pressed, green residue inside. Scratched into the barrel: K-7. Discuss: who carries syringes, and who has seen that green before?"

Host notes: if a team is stuck for three minutes, the ghost whispers the full sentence. Zora will say TALKS; Krank will say DRINKS.

### 5.9 Stage 3.2 — The witness

Both ghosts: "Someone saw. Someone remembers. Find your words again. Go where the sentence sends you. Let the one named on the envelope read it, and let nobody interrupt."

Public clue: *The one who saw was never looked at.*

Team Delilah sentence: SEEK (Vane) THE (Morgana) SPINES (Selene) THAT (Luna) HAVE (Khamun) NO (Agnes) BACKBONE (Zora) → **Bookshelf**.
Team Victor sentence: A (Finch) SUN (Corvus) THAT (Edgar) SLEEPS (Graves) BY (Malachi) DAY (Krank) → **Lamp**.

Team Delilah witness card (Bookshelf), read by Khamun, or by Delilah's ghost if he is absent: "I stood in the corner for an hour and nobody saw me, because nobody looks at furniture. Before the toast the lady's glass stood alone for one full minute. One person leaned over it. A short person. The hand that hovered over the glass wore five rings, and when it moved it jingled, and the air smelled of jasmine. When the lady fell, that hand wiped its rings with a handkerchief. I am decor. Decor does not lie."

Team Victor witness card (Lamp), read by Edgar, or by Victor's ghost if he is absent: "The night I died I was at my desk. Before everything went dark I heard a laugh, like a kettle coming to the boil. When I woke on the table the same laugh said 'It works!' Tonight, when the lights went out, I heard four quick steps from the study door and that laugh again, soft, pleased. Then Victor said something. A question. A name, I think. I could not catch it. But I know that laugh. I will know it until I die again."

### 5.10 Stage 3.3 — The alibis

Both ghosts: "Last thing. Each of you, find your alibi and read it aloud, word for word, no additions. Then compare it with everything you have heard tonight. **Every liar makes one mistake.**"

Public clue: *Every liar makes one mistake.*

Host notes: Zora's alibi says she never left the fireplace; Finch's 1.3 observation and Agnes's 1.3 observation say otherwise. Krank's alibi says she was in the garden with Malachi; Malachi's alibi says he was alone. Then open the vote.

### 5.11 Vote and reveal

Vote screen: each present player picks two names. Tally bars update live. Button **Reveal**.

Reveal set piece: candles gutter out one by one, heartbeat, silence, then the two killers' portraits glow red.

Delilah's ghost: "Madame Zora. Your grandmother found the dying for mine, and every year since, this house has paid you to forget it. I was going to stop the cheques. So you read my glass's fortune and poured nightshade into it, and your jasmine hid the taste but not the smell, and a mummy you never looked at watched you wipe your rings."

Victor's ghost: "Dr. Krank. I paid you to bring Edgar back and you brought back something that cannot sleep. I was going to read it all at midnight. So when the lights went out you crossed the room in four steps and gave me K-7, and you laughed, because you always laugh. Edgar heard you. Edgar always hears you."

Both: "Two killers. Strangers until tonight. Allies by the candle. You found each other. Did they find you?"

Then the result: "THE HOUSE WINS" or "THE KILLERS WALK FREE", with the vote tally. Final screen: "Blackwood Manor thanks you. Please return the mummy to the attic."

## 6. Riddle bank

Each card ends with one riddle pointing at the station of the character's next card. Variant = target stage index mod 3.

**Sofa**
1. I have arms but never hug; I hold the tired, I hold the snug. Look beneath me, look behind: your next secret you will find.
2. Guests sink into me and sigh; in cushions soft do secrets lie.
3. Three may sit on me as one; search my seams when searching's done.

**Bookshelf**
1. A thousand voices, none that speak; between their spines is what you seek.
2. I hold stories, stacked and tall; the one you need is not a book at all.
3. Paper soldiers in a row, standing guard on what you know.

**Television**
1. A glass face that never blinks shows you more than it ever thinks.
2. Dark mirror on the wall: it shows the world but hides it all.
3. It talks all day but never listens; behind its back a secret glistens.

**Plant**
1. Green and growing, never walking; keeps its secrets, never talking.
2. I drink but never thirst; I'm rooted, never cursed. Dig gently where I stand.
3. Leaves that never leave the room; search beneath the quiet bloom.

**Lamp**
1. A sun that sleeps by day and wakes at night to light your way.
2. I wear a hat but have no head; look under it before you're led.
3. Moths adore me, shadows flee; your next clue is close to me.

**Cupboard**
1. Doors that open, doors that close; what I hide, nobody knows.
2. I have shelves but tell no tales; behind my door the secret pales.
3. Wooden belly, hungry maw; open me and find your clue.

## 7. Character cards

Each entry: intro sheet, then cards 1.1 to 3.3. Team words and sabotage orders are marked. "Riddle →" lines are generated from section 4.1 and 6 and are not repeated here.

### 7.0 Inspector Ambrose Finch 🔍

**Intro.** You are Inspector Ambrose Finch of Scotland Yard, retired "for health reasons"; nobody asks which. Delilah Blackwood hired you by letter to guard "a book" tonight. Act: squint through your magnifying glass at everything, including faces. Quirk: say "Elementary" after other people's sentences, wrongly. Public line: "I was hired by Lady Delilah to protect something tonight. I will not say what."

- **1.1** You are the only professional in this room, or so you tell yourself. Your badge is real; your retirement was not voluntary. You were hired to guard the Crimson Ledger, a book you have never seen. You felt it in Delilah's bag at the door. The bag is now empty.
- **1.2** Delilah's letter said: "Inspector, tonight I will read a book that will ruin my family and free twelve others. Someone will try to stop me. Stop them first." She paid in advance. You have already spent it.
- **1.3** Just before the toast, Madame Zora left her chair by the fireplace and went to the wine table "to read the bottles' fortunes". She stood over the glasses for a full minute. You thought it charming at the time. Say this aloud.
- **2.1** Last night a hooded figure met you at the gate and gave you an envelope: fifty pounds and a note. "At midnight, be looking the other way." You took it. You are an accessory to something and you do not even know what. The hood, oddly, smelled of jasmine, and the figure was short and jingled when it walked.
- **2.2** Goal: redemption. If you name the killers before the ghosts do, the Yard might take you back. Before the final vote, get one other guest to say aloud that they trust you.
- **2.3** Your ledger strip is number 11 (the retainer to Z.). Put it on the table and read it aloud.
- **3.1** Team Victor. Word 1: **THE**. You searched Victor when the lights returned: one pinprick on the neck. Not a bite. A needle.
- **3.2** Team Victor. Word 1: **A**. Look at your bribe note again. The handwriting loops its Z like a crystal ball on a stick. Nobody has shown you their handwriting. Ask.
- **3.3** Alibi: "When Delilah fell I was by the door, watching the window. When Victor fell I was in the dark like everyone else, and I heard someone laugh softly. I could not tell who."

### 7.1 Rosalind Vane 🗡

**Intro.** You are Rosalind Vane, vampire hunter, third generation. You carry a stake and you are not shy about it. Act: stare at Mr. Graves's teeth; check your reflection in everything. Quirk: tap your stake on your palm when you think someone is lying. Public line: "There is a vampire in this house. I can smell it."

- **1.1** You have killed nothing yet. Your grandmother said the undead are real; your mother said grandmother was mad. Tonight you find out which. The pale man in the top hat has not touched his wine, cast no reflection in the silver tray, and smiled at you with too many teeth.
- **1.2** The invitation read: "Your grandfather, Private Thomas Vane, did not die at the front. He died in my grandfather's cellar, and he was sold. Come and hear his name read. — D. Blackwood." You came for his name. You stayed for the vampire.
- **1.3** During the toast you watched Mr. Graves. He stood in the shadow by the curtains and stared at Delilah's throat through the entire speech. He did not drink. He did not blink. When she fell he was the first to reach her, and he wept. Say this aloud.
- **2.1** Your stake is a chair leg. The real one is at home. You have never seen a vampire until tonight and you are terrified. If anyone asks, it is the finest hawthorn.
- **2.2** Goal: before the night ends, make Mr. Graves admit aloud what he is. And find the ledger strip that holds number 41. It is your grandfather.
- **2.3** Your ledger strip is number 5. Put it on the table and read it aloud. It is him.
- **3.1** Team Delilah. Word 1: **LOOK**. You know poison from the lore: nightshade widens the eyes and darkens the lips. Corvus said exactly that about Delilah. A bite does neither.
- **3.2** Team Delilah. Word 1: **SEEK**. Graves swore at the window that he loved Delilah like a daughter. You believe him and you hate it. Someone else brushed past you after the toast smelling of jasmine; shorter than you, and they clinked.
- **3.3** Alibi: "When Delilah fell I was watching Graves, and he was nowhere near her glass. When Victor fell I was at the window, stake in hand, watching Graves again. He was beside me the whole time."

### 7.2 Selene Nocturne 🐾

**Intro.** You are Selene Nocturne, cat burglar, uninvited, charming. Act: purr when pleased, hiss when accused, touch people's jewellery. Quirk: purr. Public line: "I am a friend of the family. Which family? Oh, several."

- **1.1** You have never met the Blackwoods. You came in through the pantry window at eight. Nobody noticed; nobody ever does. In your glove is a letter from a client who signs only "A friend of the Order" and promises gold.
- **1.2** The letter: "Take the red book from the lady's bag during the toast. Bring it to the garden hedge. Twenty gold." You took it. The book is in your coat right now, and it is suspiciously light.
- **1.3** At seven, an hour before the party, you saw the housekeeper Agnes go down to the cellar with a lantern and come up with nothing. She was crying. Say this aloud.
- **2.1** You opened the book. It is empty. Every page has been torn out. You stole a cover. Your client will not pay for a cover. Keep this very, very quiet.
- **2.2** Goal: get paid anyway. Find out who "a friend of the Order" is and convince them the cover is worth twenty gold. And if anyone accuses you: you are a thief, not a killer. Show your paws. No blood.
- **2.3** Your ledger strip is number 1: Delilah's own note, which was tucked in the cover. You are the one who has the ledger. Confess it, put the cover and the strip on the table, and read the note aloud. The room will need you.
- **3.1** Team Delilah. Word 3: **GREEN**. You know bottles. The little vial you glimpsed in someone's sleeve at the wine table was brown glass with a cork, apothecary stock. The sleeve jingled.
- **3.2** Team Delilah. Word 3: **SPINES**. Out of habit you pickpocketed Madame Zora earlier. Her handkerchief is in your glove. It smells of jasmine and one corner is stained dark purple. Produce it.
- **3.3** Alibi: "When Delilah fell I was stealing her book, so I was right behind her. I saw her glass. I did not touch it. When Victor fell I was stealing nothing, for once."

### 7.3 Dr. Wilhelmina Krank ⚗ (Murderer)

**Intro.** You are Dr. Wilhelmina Krank, scientist, consultant to Victor Blackwood on "matters of chemistry". Act: laugh like a kettle coming to the boil, especially at the wrong moments; explain everything with science, wrongly. Quirk: the kettle laugh. Public line: "Death is just chemistry that gave up. I never give up."

- **1.1** You are brilliant and nobody appreciates it. Victor pays you a fortune for research he will not let you publish. You keep a syringe of green serum, K-7, in your coat pocket at all times. It is for emergencies. You have not decided what counts.
- **1.2** Delilah did not invite you. Victor asked you to come "to keep an eye on my sister". He looked frightened. He has looked frightened for two months, ever since his accountant came back.
- **1.3** Before the party you saw Brother Malachi alone in the garden, chanting at a hedge for twenty minutes. Nobody was with him. He bowed to the hedge and went inside. Say this aloud.
- **2.1 KILLER.** You remember now. When the lights went out you did not freeze. You crossed the room in four steps, found Victor's neck by the smell of his cologne, and emptied K-7 into it. He said "Wilhelmina?" and then nothing. You killed Victor Blackwood, because at midnight he was going to read a page that says what you did to Edgar. YOU ARE A MURDERER. Keep it hidden. **Sabotage:** tell the room, with confidence, that in the dark you saw Mr. Graves bending over Victor.
- **2.2** Goal: do not get caught. You did not kill Delilah, so another killer is in this room, and an ally is worth more than a secret. **Secret sign:** tap the table twice and say "the candles burn low". If anyone answers "and the wax remembers", they are your ally. Find them. Lie for each other.
- **2.3** Your ledger strip is number 4. Put it on the table. **Sabotage:** when someone reads "Lab. W.K.", insist loudly that W.K. stands for War Kitchen. Laugh when you say it.
- **3.1** Team Victor. Word 6: **BLINKS**. You are investigating yourself. **Sabotage:** when you give your word, say DRINKS instead of BLINKS. If the team finds the syringe anyway, say K-7 is a common vitamin.
- **3.2** Team Victor. Word 6: **DAY**. Edgar is going to remember; you can see it in his eyes. **Sabotage:** before the witness card is read, tell the team that Edgar's memory is "a medical ruin" and nothing he says can be trusted. Then stop laughing. Your laugh is the problem.
- **3.3** Alibi (read exactly): "When Delilah fell I was by the bookshelf reading. When Victor fell I was in the garden with Brother Malachi. He will confirm it." *(He will not. He was alone. This is your lie. Sell it.)*

### 7.4 Brother Malachi ⛧

**Intro.** You are Brother Malachi, Grand Hierophant of the Order of the Crimson Seal. Act: speak in prophecy; bow to objects; refer to "the Order" as if it were vast. Quirk: bow to furniture. Public line: "The Order has foreseen this night."

- **1.1** The Order has three members: you, your cousin, and a man named Keith who has stopped answering letters. You believe the Crimson Ledger is a holy text listing the Chosen. You have never seen it. You printed a newsletter about it anyway.
- **1.2** Delilah's invitation was one line: "Your grandfather dug the graves. Come and hear whose." You have decided this means the Order is finally recognised.
- **1.3** On your way in from the garden you saw the Witch sprinkle dried herbs over the fireplace. It smelled of sage and burned toast. Not jasmine. Definitely not jasmine. Say this aloud.
- **2.1** You hired the cat burglar. You signed the letter "A friend of the Order" and promised twenty gold you do not have. You have four shillings. If she finds out, stand behind the Inspector.
- **2.2** Goal: recruit one new member to the Order before the vote. Anyone. Even the mummy. Also: your spare hood is missing from your bag. Someone took it last night. Find out who.
- **2.3** Your ledger strip is number 7. Put it on the table and read it as scripture.
- **3.1** Team Victor. Word 5: **NEVER**. You know ritual: Victor was struck in the dark by someone who knew exactly where he stood, someone who had been close enough all evening to know his cologne.
- **3.2** Team Victor. Word 5: **BY**. Your missing hood. The Inspector described the figure who bribed him: short, jingling, jasmine. You are tall and you smell of incense. Someone wore your hood. Tell the room.
- **3.3** Alibi: "When Delilah fell I was blessing the cheese. When the lights went out I was alone in the garden chanting to the hedge. Nobody was with me. Nobody is ever with me."

### 7.5 Agnes Thorne 🗝 (optional)

**Intro.** You are Agnes Thorne, housekeeper of Blackwood Manor for thirty years. Act: dust things while people talk; know where everything is; sniff at guests. Quirk: dust things. Public line: "I have served this house for thirty years and I have seen things."

- **1.1** You raised Victor and Delilah after their parents died. You know every creaking board. You set the glasses tonight and counted them: thirteen glasses, twelve guests, one lady.
- **1.2** You live here; nobody invited you. But last week Delilah showed you the ledger and asked, "Agnes, did you know?" You did. You have always known. You showed her where to hide the pages.
- **1.3** After the toast, while everyone screamed, you saw Madame Zora calmly wipe her rings with a handkerchief and tuck it into her sleeve. Her hands shook. Then she started screaming too, a little late. Say this aloud.
- **2.1** You are Ezekiel Blackwood's granddaughter by Nurse Ashgrove. The true will, found with the ledger, leaves the manor to "the child of Nurse Ashgrove's line". That is you. You never wanted it. You wanted Delilah to live.
- **2.2** Goal: see the true will honoured, and tell Morgana Ashgrove, the witch, that she is your cousin. She does not know. Do it in character; cry if needed.
- **2.3** Your ledger strip is number 8. Put it on the table and read it aloud.
- **3.1** Team Delilah. Word 6: **NEVER**. You set thirteen glasses. After the toast Dr. Corvus took the lady's glass and poured it into the potted plant. Ask him why. Then look in the plant.
- **3.2** Team Delilah. Word 6: **NO**. Zora tucked that handkerchief into her sleeve. Later the cat "bumped into" her. If the cat has it, name the stain: nightshade juice is purple.
- **3.3** Alibi: "When Delilah fell I was at the wine table clearing the tray, and I saw who had been there before me. When Victor fell I was lighting candles in the hall."

### 7.6 Dr. Corvus 🐦

**Intro.** You are Dr. Corvus, physician to the Blackwood family, masked "for reasons of hygiene". Act: never remove the mask; speak slowly; diagnose everyone with something. Quirk: diagnose people. Public line: "I pronounced her dead. I know death. I have seen a great deal of it."

- **1.1** You have worn the mask for ten years. Nobody has seen your face. You pronounced Delilah dead and you knew the signs before you touched her: dark lips, wide eyes. Belladonna. Nightshade. Poison, not a bite.
- **1.2** Delilah's letter: "Doctor, the ledger says number 17 escaped the cellar. I believe that was you. Come, and I will burn your page myself." You came because you are number 17.
- **1.3** When you examined Delilah's glass there was a smell under the wine: jasmine. Sweet enough to hide something bitter. Say this aloud.
- **2.1** You are not a doctor. You are Private Daniel Cole, number 17, who crawled out of that cellar in 1916 with his face burned, and you have hidden it ever since. When Delilah fell you panicked, took her glass, and poured it into the potted plant. You destroyed evidence. If anyone asks, you were "preserving the sample".
- **2.2** Goal: keep your face hidden to the end. If anyone tries to lift your mask, diagnose them with something incurable. And you want the ledger burned, not read.
- **2.3** Your ledger strip is number 6. Put it on the table. It is you.
- **3.1** Team Victor. Word 2: **GLASS**. You looked at Victor's neck: one puncture with green residue at the edge. You have seen that green before, on the arm of the accountant Edgar, the day he "recovered".
- **3.2** Team Victor. Word 2: **SUN**. You poured the glass into the plant, where Team Delilah found a vial. Tell them: that vial was not in the plant before the toast. You would have seen it.
- **3.3** Alibi: "When Delilah fell I was beside her within three seconds. When Victor fell I was by the fireplace, and the laughter I heard in the dark came from the study door, not from the garden."

### 7.7 Khamun ☥ (optional)

**Intro.** You are Khamun, formerly of Thebes, lately of the attic. Act: move slowly; be surprised nobody notices you; ask where your sarcophagus is. Quirk: ask about the box. Public line: "Has anyone seen a large gold box? About my size?"

- **1.1** You woke three weeks ago in a sarcophagus in the attic of this house and have lived here since. Nobody has noticed; they assume you are decor. You have eaten most of the pantry. You are owed an apology by someone called Ezekiel, who is apparently dead, which is cheating.
- **1.2** Nobody invited you. You came downstairs because there was music. You stood in the corner of the hall for the whole toast and nobody offered you a drink, which is how you saw everything.
- **1.3** Through the hall window at seven you saw a cat woman climb in through the pantry. She was elegant; you were impressed. Also: the housekeeper once said Ezekiel bought you with "cellar money". Say this aloud.
- **2.1** You are three thousand years old and you have never been this bored. Victor sold your sarcophagus yesterday to pay a laboratory bill. Your secret: you are considering staying. The sofa is comfortable.
- **2.2** Goal: find out who holds the receipt for your sarcophagus. And: you have told nobody what you saw at the wine table. You will tell them when the ghost asks, and not before. Being decor has its uses.
- **2.3** Your ledger strip is number 9. Put it on the table. Read it with dignity.
- **3.1** Team Delilah. Word 5: **BUT**. From your corner you saw the lady's glass stand alone for one full minute before the toast. One person touched it. You will say who when the witness envelope is found.
- **3.2** Team Delilah. Word 5: **HAVE**. This is it. When the team opens the envelope at the Bookshelf, you read it aloud. Stand up slowly. Enjoy it.
- **3.3** Alibi: "When Delilah fell I was in the corner being furniture. When Victor fell I was in the corner being furniture. I am the only one here with a perfect alibi and nobody will believe me."

### 7.8 Morgana Ashgrove 🧙

**Intro.** You are Morgana Ashgrove, witch, green by choice. Act: curse people mildly ("may your tea be lukewarm"); sprinkle herbs. Quirk: mild curses. Public line: "This house is cursed. I should know; I cursed it."

- **1.1** Your grandmother, Nurse Ashgrove, worked in this cellar in 1916 and was driven out as a witch for saying what she saw. You came for an apology a century late. Your curse is theatre. Your herbs are sage, for the smell.
- **1.2** Delilah's letter: "Your grandmother was right. I will say so in front of everyone. — D." You cried. You will not admit it.
- **1.3** In the study before the toast you saw Edgar the accountant staring at Dr. Krank with the eyes of a frightened dog. Krank patted his head. He flinched. Say this aloud.
- **2.1** You know no spells. Your grandmother's book is a recipe book. Your green skin is stage paint that will not come off; you have had it three days.
- **2.2** Goal: get an apology from a Blackwood. Both are dead; a ghost will do. Make one of them say sorry in front of everyone before the vote.
- **2.3** Your ledger strip is number 3: your grandmother's note. Put it on the table and read it aloud. Slowly.
- **3.1** Team Delilah. Word 2: **WHERE**. You know herbs: nightshade is bitter, nobody drinks it unknowing unless the taste is covered. Jasmine oil covers bitter. Sage covers nothing. Say so.
- **3.2** Team Delilah. Word 2: **THE**. After the toast you brushed past someone who smelled of jasmine and whose bangles clinked, shorter than you. Agnes mentioned a handkerchief; the cat looked guilty. Put it together with your team.
- **3.3** Alibi: "When Delilah fell I was at the fireplace with my herbs; the Cultist saw me. When Victor fell I was still there, and someone took my hand in the dark. I do not know whose."

### 7.9 Edgar Mills 📒 (optional)

**Intro.** You are Edgar Mills, Victor's accountant, "recovering from a long illness". Act: shuffle; forget mid-sentence; recite numbers; say "I'm fine" unconvincingly. Quirk: recite numbers. Public line: "I'm fine. Everyone keeps asking. I'm fine."

- **1.1** You died two months ago of a heart attack at your desk. You remember this clearly, which is upsetting. Then you woke on a table with a green taste in your mouth and Dr. Krank saying "Ha! It works!" You are not sure it works.
- **1.2** Victor's note: "Edgar, old friend, come tonight. I am going to make it right." You do not know what "it" is. You remember the number 2,000 and it frightens you.
- **1.3** Numbers. You remember the estate books: £2,000 a month from the Blackwood account to "W.K., laboratory". Victor signed every one, for two years. Say this aloud.
- **2.1** You are the poor man. The experiment. You are why Victor wanted it to end and why someone wanted him silent. Your secret: you did not want to come back. You would like to be left alone with a good ledger.
- **2.2** Goal: find out exactly who did this to you and make them say it. Also: eat something. You keep forgetting.
- **2.3** Your ledger strip is number 13: Victor's last note, addressed to you. Put it on the table and read it aloud. It is the end of the page.
- **3.1** Team Victor. Word 3: **FACE**. The syringe the team finds will be marked K-7. You have a scar on your arm in the shape of a K. Show it.
- **3.2** Team Victor. Word 3: **THAT**. This is it. When the team opens the envelope at the Lamp, you read it aloud. Slowly. Remember everything.
- **3.3** Alibi: "When Delilah fell I was counting the glasses. Thirteen. When Victor fell I was in the dark, and I heard the laugh. The same laugh I heard the night I died."

### 7.10 Madame Zora 🔮 (Murderer)

**Intro.** You are Madame Zora, celebrated seer, beloved by everyone's aunt. Act: foretell everything after it happens; wear rings and bangles that jingle; dab jasmine oil on your wrists. Quirk: foretell things after they happen. Public line: "I foresaw a death tonight. I said so at the door. Ask anyone."

- **1.1** You are the most famous fortune teller in three counties. Your visions are improvised. Your jasmine oil is real. The Zoras have been "friends of the Blackwoods" since 1916, and every All Hallows' Eve a cheque arrives. You have never asked why.
- **1.2** Delilah's letter: "Madame, your grandmother found the dying for mine. The ledger calls your family the brokers. Tonight the cheques stop. Come and hear it." You read it four times. Then you packed a small brown vial.
- **1.3** Last night at the gate you saw Inspector Finch accept an envelope from a hooded figure. You could not see the figure's face. Say this aloud. Mention the hood. Mention nothing else.
- **2.1 KILLER.** You remember now. You stood over the glasses "reading their fortunes" and emptied the nightshade into the lady's glass, then wiped your rings. The jasmine covered the bitterness; it did not cover the smell. You killed Delilah Blackwood to keep the cheques coming and the brokers' name buried. YOU ARE A MURDERER. Keep it hidden. The vial went into the potted plant; the handkerchief is in your sleeve, or was. Check. The hooded figure at the gate was you, in the Cultist's spare hood. **Sabotage:** tell the room the Witch's herbs smelled of jasmine. Insist on it.
- **2.2** Goal: do not get caught. You did not kill Victor, so another killer is in this room, and an ally is worth more than a secret. **Secret sign:** tap the table twice and say "the candles burn low". If anyone answers "and the wax remembers", they are your ally. Find them. Lie for each other.
- **2.3** Your ledger strip is number 10. Put it on the table; you must. **Sabotage:** insist "Z." means Zeke, Ezekiel's own nickname, and that he paid himself. Say it with a laugh.
- **3.1** Team Delilah. Word 7: **WALKS**. You are investigating yourself. **Sabotage:** when you give your word, say TALKS instead of WALKS. If they find the vial anyway, say the plant is where the doctor poured the glass, so the vial must be his.
- **3.2** Team Delilah. Word 7: **BACKBONE**. The mummy has been staring at you for an hour. He saw. **Sabotage:** before the witness card is read, announce that you foresaw the mummy would lie: "the dead envy the living". Then take off your rings and pocket them. Too late, probably.
- **3.3** Alibi (read exactly): "When Delilah fell I was at the fireplace. I never left it, not once, until she fell. When Victor fell I was holding the Witch's hand in the dark." *(You did leave the fireplace. The Inspector saw you. This is your lie. Sell it.)*

### 7.11 Lucien Graves 🎩

**Intro.** You are Lucien Graves of Graves & Sons, undertakers since 1702. There are no sons. Act: never drink, never eat, avoid mirrors, be unfailingly polite, show too many teeth when you smile. Quirk: avoid mirrors. Public line: "I handle the dead. Someone must."

- **1.1** You are 324 years old. You are a vampire. You are also, which surprises people, a decent person, mostly. You came to Blackwood Manor every All Hallows' Eve from 1916 and left with a cart. You stopped in 1918. You have regretted every night since.
- **1.2** Delilah's letter: "Mr. Graves. I know what you are and what you bought. I also know you stopped. Come and help me burn it." Nobody has written to you kindly in a century. You came.
- **1.3** During the toast you watched Delilah, the first Blackwood who ever looked you in the eye. After she fell, Dr. Corvus took her glass "for examination" and poured it into the potted plant. Odd behaviour for a doctor. Say this aloud.
- **2.1** You have not fed in six years. You are very tired, and the hunter's stake is, you are fairly sure, a chair leg. Your secret: you wept when Delilah fell. Vampires are not supposed to. Keep it to yourself; it is embarrassing.
- **2.2** Goal: survive the hunter until dawn and see the ledger burned. When she corners you, admit what you are, but only if she asks nicely.
- **2.3** Your ledger strip is number 2, with your own note in the margin. Put it on the table and read it, including the margin.
- **3.1** Team Victor. Word 4: **THAT**. You know necks. Victor's wound is a needle mark, not a bite, and you will say so with authority. Nobody will believe you. Say it anyway.
- **3.2** Team Victor. Word 4: **SLEEPS**. In the dark you heard four quick steps from the study door to Victor, and a laugh. A kettle laugh. You have excellent hearing. Say so.
- **3.3** Alibi: "When Delilah fell I was by the curtains and the hunter was watching me; ask her. When Victor fell I was by the window with the hunter beside me. We did not move."

### 7.12 Luna Nocturne 🐾🐾 (optional second cat)

**Intro.** You are Luna Nocturne, Selene's twin. You came through the same window one minute later. Act: finish Selene's sentences; mirror her movements. Quirk: finish Selene's sentences. Public line: "I am her alibi and she is mine."

- **1.1** You are the quiet twin. Selene steals; you watch doors. Your pocket watch stopped at 8:52, when the toast began.
- **1.2** Same letter as your sister, same client. Your job was the hallway. You watched it for a full hour and saw everything that passed through.
- **1.3** In the hallway at half past eight you saw Dr. Krank and Victor arguing in whispers. Victor said: "After midnight it ends. All of it. The money, the lab, the poor man." Krank laughed; it sounded like a kettle. Say this aloud.
- **2.1** You are not Selene's twin. You met in prison and you look alike. You have never told anyone and never will.
- **2.2** Goal: keep Selene out of trouble; she talks too much. And find out who "the poor man" is.
- **2.3** Your ledger strip is number 12. Put it on the table and read it aloud. It is the line about the laboratory.
- **3.1** Team Delilah. Word 4: **GROWS**. You watch doors. The wine table stood before your door. Three people stood at it before the toast: the housekeeper, who set the glasses; the witch, who waved a herb bundle; and a third who leaned over the lady's glass. You saw only their back, and their rings.
- **3.2** Team Delilah. Word 4: **THAT**. Selene stole a handkerchief tonight. You saw whose sleeve it came from: the fortune teller's.
- **3.3** Alibi: "When Delilah fell I was in the hallway doorway. When Victor fell I was holding Selene's hand in the dark. We were together."

## 8. The website

### 8.1 Shape

A static site: `index.html`, `css/style.css`, `js/data.js` (all content from sections 5 to 7), `js/audio.js`, `js/game.js`, `js/print.js`, `js/app.js`, `assets/characters/*.jpg`. Plain script tags, no modules, no framework, no build, no server. Opens by double-click and works offline. Google Fonts for a gothic display face with a local fallback. All text English.

State (roster, timers, current scene and stage, phase, votes) lives in `localStorage` so a refresh never loses the night.

### 8.2 Screens

1. **Title.** Layered CSS fog, flickering candle glow, occasional lightning, "Enter Blackwood Manor". First click unlocks audio.
2. **Setup.** Tick present characters (Zora and Krank locked on), toggle Luna, optional real name per character, search and discussion minutes, sound on/off. Warns if fewer than 6 players.
3. **Print pack.** Buttons: all character packs, one character, station labels, team envelopes, ledger page, host guide. Each opens a print-styled view and calls the browser print dialog (save as PDF). Layout: intro sheet one per A4; cards four per A4 with cut lines; ledger as thirteen strips with the burning-candle margin; host guide listing routing per station per stage, team sentences, sabotage orders, alibis and their contradictions, and orphan rules.
4. **Game.** Progress strip of nine stages across three scenes. Backdrop per scene: candlelit red and gold (Scene 1), cold blue ghost light (Scene 2), split violet and green (Scene 3). Narration panel with typewriter effect and highlighted public clue. Phase buttons: Read, Start search, Start discussion, Next. Big timer; ticking in the last 30 seconds; bell toll at zero. Soundboard drawer. Host-only panel with answer key and orphaned clues computed from the roster.
5. **Set pieces** as full-screen overlays with sound: She is dead (prologue), The lights go out (end of 1.3), Victor returns (start of Scene 3), Reveal (after the vote).
6. **Vote.** One row per present player, two picks each from the present roster. Live tally bars. Reveal button. Result screen, replay option.

### 8.3 Sound

Web Audio API only, no files: ambient wind and low drone per scene; thunder (filtered noise burst); heartbeat; bell toll; ghost whisper (band-passed noise with tremolo); clock tick; scream (pitched sweep with distortion); candle-out puff. Master volume and mute.

### 8.4 Content logic (pure functions, testable)

- `stationFor(characterIndex, stageIndex)` and `riddleFor(characterIndex, stageIndex)`.
- `buildRoster(selection)` returning present characters, teams, and `orphanedClues(stage)`.
- `teamSentence(team, stage, roster)` returning the sentence with missing words flagged.
- `tally(votes)` returning counts and whether the house wins.

### 8.5 Testing

- `scripts/check-content.js`: every character has an intro and nine cards; every station riddle variant exists; routing gives two cards per station per stage (three with Luna); the thirteen ledger strips are numbered 1 to 13 with unique holders; every team word index is unique within its team and the sentences read correctly in order; every 1.3 observation names a character that exists.
- Unit tests with Node's built-in test runner for the four functions in 8.4, including an orphan case (Khamun absent moves the witness card to the ghost) and a vote tie.
- Manual smoke test in the browser: full walkthrough from title to reveal with a 6-player roster and a 13-player roster.

## 9. Night-of checklist (goes in the host guide)

1. Print all packs. Cut cards. Sort every card into its station envelope by the host guide's table. Put the four team envelopes and the two witness cards at their stations. Keep the ledger strips inside each character's 2.3 envelope.
2. Label the six stations. Hide envelopes behind or under the object, not in plain sight.
3. Hand each guest their intro sheet at the door. Nobody opens anything else.
4. Open the website, set the roster, test the sound.
5. Victor gives the toast. Delilah dies. Play.

## Addendum: table talk (added 3 Nov 2026)

Every stage card carries one **table talk** line: a rumour, observation or pointed question about *another* guest, ending in an instruction to raise it aloud in the discussion round. The lines mix real leads (jasmine, rings, the kettle laugh, K-7, the hallway argument) with red herrings (the vampire, the mask, the burglar, the cultist, the bribed inspector) so the killers are not exposed before stage 3. Killers' lines steer the room away from themselves.

Content lives in `tableTalk` in `js/data.js`, keyed by character id and stage id, and is attached to each card as `card.talk`: an array of `{ about, text }` alternatives. `logic.talkFor(card, presentIds)` returns the first entry whose subject is present, so a line about an optional guest (Agnes, Khamun, Edgar, Luna) always has a fallback. The print pack is built from the current roster, so the right line is printed; the host panel lists the lines in play for the stage.

## Addendum: the full story theatre (added 3 Nov 2026)

A host tab that tells the whole mystery as 37 narrated slides in nine chapters (cellar 1916, the grandchildren, each of the 13 guests, both murders, the killers' secret sign, the evidence against each killer, the ghosts' reveal, epilogue). Content is in `js/story.js` (`slides`, `splitSentences`, `estimateMs`, `chapters`); the player is `js/story-view.js`.

- Visuals: layouts title, portrait, duo, gallery, evidence (chips that pop in, broken alibis struck), ghosts. Ken Burns portraits, killer frames glow red, lightning flash and lights-out flicker, scene-tinted backdrops, progress bar.
- Voice: Web Speech API, sentence by sentence, the current sentence highlighted. Narrator, Delilah and Victor get different voices and pitch. If speech is unavailable or refused, captions run on a timer.
- Sound: per-slide effects and scene ambience from `BM.audio`.
- Sync: own storage key `blackwood-manor-story-v1` (`onTv`, `index`, `playing`, `voice`), so it never touches the game state. Exactly one window speaks and advances: the TV while `onTv` is set, otherwise the host. Opening the story never changes the TV; "Show on TV" asks for confirmation unless the result screen is showing.

## Addendum: the housekeeper becomes the butler (added 3 Nov 2026)

The maid's player is cast from a photo of an older man, so character 5 (🗝, optional, Team Delilah) is now **Silas Thorne, the Butler** (id `silas`, costume Butler). Wherever this spec says Agnes, the housekeeper or the maid, read Silas, the butler, with he/him; he is Ezekiel's grandson by Nurse Ashgrove and Morgana's cousin. The story, puzzles, words and ledger strip 8 are unchanged. Act gains "carry a silver tray everywhere".

## Addendum: interludes between the scenes (added 3 Nov 2026)

Scene changes get a full-screen interlude, drawn by `js/interlude.js` on both the host and the TV and narrated by George (speaker "Narrator", voiced like the ghosts and muted by the same toggle).

- **lightsOut** (after 1.3): candles go out one by one; four seconds of flickering dark for Victor to fall (host-only cue "Victor: fall now"); a memorial portrait "In memory of Victor Blackwood" swings crooked, its glass cracks and a red drip runs while a heartbeat glow fades; Delilah's ghost faintly appears beside it. Then "Scene 2: The Master Falls" and the narration.
- **twoGhosts** (after 2.3, new): Delilah's ghost alone, then Victor's ghost rises and flickers into being beside her while frost creeps in. Then "Scene 3: Two Ghosts" and the narration. It leads straight into **victorReturns** (set piece `then`), whose heading is now "Victor returns: two murders, two teams", and then to 3.1.
- The full story shows the same visuals (`BM.interlude.memorial()` and `ghostPair()`): slide `master-falls` (layout `memorial`) right after `dark`, and slide `second-ghost` (layout `risen`) right before `victor-returns`, which is now titled "Victor returns". The butler was renamed again, to **Silas Thorne** (id `silas`), because the Inspector is already Ambrose Finch.
