(function (root) {
  const STATIONS = ['Sofa', 'Bookshelf', 'Television', 'Plant', 'Lamp', 'Cupboard'];
  const STAGE_IDS = ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3'];

  const riddles = {
    Sofa: [
      "I have arms but never hug; I hold the tired, I hold the snug. Look beneath me, look behind: your next secret you will find.",
      "Guests sink into me and sigh; in cushions soft do secrets lie.",
      "Three may sit on me as one; search my seams when searching's done."
    ],
    Bookshelf: [
      "A thousand voices, none that speak; between their spines is what you seek.",
      "I hold stories, stacked and tall; the one you need is not a book at all.",
      "Paper soldiers in a row, standing guard on what you know."
    ],
    Television: [
      "A glass face that never blinks shows you more than it ever thinks.",
      "Dark mirror on the wall: it shows the world but hides it all.",
      "It talks all day but never listens; behind its back a secret glistens."
    ],
    Plant: [
      "Green and growing, never walking; keeps its secrets, never talking.",
      "I drink but never thirst; I'm rooted, never cursed. Dig gently where I stand.",
      "Leaves that never leave the room; search beneath the quiet bloom."
    ],
    Lamp: [
      "A sun that sleeps by day and wakes at night to light your way.",
      "I wear a hat but have no head; look under it before you're led.",
      "Moths adore me, shadows flee; your next clue is close to me."
    ],
    Cupboard: [
      "Doors that open, doors that close; what I hide, nobody knows.",
      "I have shelves but tell no tales; behind my door the secret pales.",
      "Wooden belly, hungry maw; open me and find your clue."
    ]
  };

  const scenes = [
    { number: 1, title: 'The Toast', subtitle: 'The lady is dead', theme: 'scene1' },
    { number: 2, title: 'The Master Falls', subtitle: 'The ghost speaks to all', theme: 'scene2' },
    { number: 3, title: 'Two Ghosts', subtitle: 'Two teams, two murders', theme: 'scene3' }
  ];

  const stages = [
    {
      id: '1.1', scene: 1, title: 'Who you are', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "Brother, I cannot see faces yet, only shapes. Make them tell me who they are. Each of them carries a lie they think is a costume. Let them find it. And brother: the glass that killed me was not the glass I was handed. Ambrose poured it. Someone else touched it." }],
      clue: 'The glass that killed me was not the glass I was handed.',
      hostNotes: 'Players read privately. Nobody shares anything except their public line and their quirk. Discussion is introductions in character.'
    },
    {
      id: '1.2', scene: 1, title: 'Why you came', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "I wrote thirteen letters. I told each of them a piece of the truth, enough to bring them. Ask them why they came, brother, and watch who lies. And know this: someone in this room was paid to be blind tonight. I do not know by whom. I only know the envelope was heavy." }],
      clue: 'Someone in this room was paid to be blind tonight.',
      hostNotes: 'Players may share their invitation if they wish. Finch will not want to.'
    },
    {
      id: '1.3', scene: 1, title: 'What you saw', kind: 'group',
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "They all saw something. None of them know it matters. Make them say it aloud, every one, and lay the pieces side by side. Brother, when I fell, I smelled jasmine. Over the wine. Under the wine. Jasmine." }],
      clue: 'Jasmine. I smelled jasmine when I fell.',
      hostNotes: "Every player must state their observation aloud. Absent characters' observations are listed below for the ghost to deliver. End the discussion with Victor's announcement, then press \"The lights go out\".",
      announcement: { speaker: 'Victor (alive, aloud)', text: "Enough. My sister died for a book. She tore its pages and hid them in this house so that no one of you could steal the whole of it. At midnight I will find every page and read every line, and if it ruins the name of Blackwood then let it. Nobody leaves this house before then. Nobody." },
      setPieceAfter: 'lightsOut'
    },
    {
      id: '2.1', scene: 2, title: 'What you hide', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost (to the room)", text: "You can hear me now. All of you. Good; I am tired of whispering. My brother lies there with one hole in his neck. Not two. Not teeth. My brother fell by a needle, not a fang. Each of you hides something. Tonight it comes out. Go and find what you are." }],
      clue: 'My brother fell by a needle, not a fang.',
      hostNotes: "The killers learn the truth on this card. Expect Krank to accuse Graves and Zora to blame the Witch's herbs. Let them."
    },
    {
      id: '2.2', scene: 2, title: 'What you want', kind: 'individual',
      narration: [{ speaker: "Delilah's ghost", text: "Now I know what you hide. Tell me what you want, and I will tell you what I see. I see two hands did this, and they have not yet shaken. Two of you. Strangers. Looking for each other across this room right now." }],
      clue: 'Two hands did this, and they have not yet shaken.',
      hostNotes: 'Both killers now hold the secret sign: "the candles burn low" / "and the wax remembers". Watch for it. Innocents have personal goals to play.'
    },
    {
      id: '2.3', scene: 2, title: 'The torn pages', kind: 'team',
      narration: [{ speaker: "Delilah's ghost", text: "I tore the ledger into thirteen pieces and hid them in this house. You have been carrying them to the table all night without knowing. Find your piece. Lay it down. All of them, on the table, in order; the candle in the margin burns lower on each. Then read my grandfather's confession aloud, together. Two of the lines on that page name the ones you seek. They will tell you the lines mean something else." }],
      clue: 'Two lines on that page name the ones you seek.',
      hostNotes: "Enforce: every strip on the table, nobody keeps one. Absent characters' strips are \"found in the walls\" by the ghost; hand them over. Expect Krank to say W.K. means War Kitchen and Zora to say Z. means Zeke. Selene reads Delilah's note (strip 1) aloud."
    },
    {
      id: '3.1', scene: 3, title: 'The weapon', kind: 'team',
      narration: [{ speaker: 'Both ghosts', text: "Find your words. Speak them in order. Go where the sentence sends you. What you find there is what killed us." }],
      clue: 'What killed us is still in this room.',
      hostNotes: 'If a team is stuck for three minutes, the ghost whispers the full sentence. Zora will say TALKS instead of WALKS; Krank will say DRINKS instead of BLINKS.',
      setPieceBefore: 'victorReturns'
    },
    {
      id: '3.2', scene: 3, title: 'The witness', kind: 'team',
      narration: [{ speaker: 'Both ghosts', text: "Someone saw. Someone remembers. Find your words again. Go where the sentence sends you. Let the one named on the envelope read it, and let nobody interrupt." }],
      clue: 'The one who saw was never looked at.',
      hostNotes: 'Khamun reads the Team Delilah card; Edgar reads the Team Victor card. If either is absent, the matching ghost reads it (text below).'
    },
    {
      id: '3.3', scene: 3, title: 'The alibis', kind: 'individual',
      narration: [{ speaker: 'Both ghosts', text: "Last thing. Each of you, find your alibi and read it aloud, word for word, no additions. Then compare it with everything you have heard tonight. Every liar makes one mistake." }],
      clue: 'Every liar makes one mistake.',
      hostNotes: "Zora says she never left the fireplace; Finch (1.3) and Ambrose (1.3) saw her at the wine table. Krank says she was in the garden with Malachi; Malachi's alibi says he was alone. Then open the vote."
    }
  ];

  const ledger = [
    { number: 1, holder: 'selene', text: "Note in Delilah's hand, tucked in the cover: \"I tore the pages and hid them through the house so that no one thief could take the whole truth. Only all of you together can read it. — D.\"" },
    { number: 2, holder: 'graves', text: "Terms: L.G. collects the 'lost' at midnight. Payment in gold. No questions. (Later hand in the margin: \"I stopped. Forgive me. — L.G., 1918\")" },
    { number: 3, holder: 'morgana', text: "Nurse Ashgrove's note, folded in the roll: \"They are not dying. He is letting them die. God forgive me, I counted.\"" },
    { number: 4, holder: 'krank', text: "Cellar roll, 1916. 'Lost' this month: 17 souls. Paid out: £136. — E.B." },
    { number: 5, holder: 'vane', text: "41. Pvt. T. Vane. Lung wound. 'Lost.' Sold, £8. Collected by L.G., midnight." },
    { number: 6, holder: 'corvus', text: "17. Pvt. D. Cole. Burns. 'Lost.' NOT collected. Escaped. Do not pursue; nobody will believe him. — E.B." },
    { number: 7, holder: 'malachi', text: "Buyer: L.G., undertaker, Graves & Sons, est. 1702. Collects at midnight. Does not sign. Does not age." },
    { number: 8, holder: 'ambrose', text: "Nurse M. Ashgrove dismissed, 1917, for 'hysteria and witchcraft'. Her allegations are not to be repeated. — E.B." },
    { number: 9, holder: 'khamun', text: "Purchases, 1920: one sarcophagus, Theban, occupied. £400 from the cellar account. — E.B." },
    { number: 10, holder: 'zora', text: "Broker: Mme. Z. Finds the dying. Ten percent per soul. Paid in perpetuity 'for discretion'. — E.B." },
    { number: 11, holder: 'finch', text: "Retainer to Z.: paid every All Hallows' Eve, in perpetuity, for 'services of discretion'. Still paid. — E.B." },
    { number: 12, holder: 'luna', text: "Lab. W.K.: £2,000 monthly from the estate account. Subject: E.M., deceased, 'returned'. — V.B." },
    { number: 13, holder: 'edgar', text: "Private note, V.B., last week: \"Delilah is right. At midnight I read it all: grandfather's cellar, the broker, my laboratory. Then I end it. God help me, Edgar.\"" }
  ];

  const teamEnvelopes = {
    delilah: {
      '3.1': { sentence: 'LOOK WHERE GREEN GROWS BUT NEVER WALKS', station: 'Plant', title: 'THE VIAL', text: 'A small brown apothecary vial, corked, empty but for a purple residue. The label reads NIGHTSHADE. It smells overwhelmingly of jasmine. Discuss: who in this room smells of jasmine, and who covers bitter things with sweet ones?' },
      '3.2': { sentence: 'SEEK THE SPINES THAT HAVE NO BACKBONE', station: 'Bookshelf', title: 'THE WITNESS', text: "To be read aloud by Khamun. If he is not here, Delilah's ghost reads it." }
    },
    victor: {
      '3.1': { sentence: 'THE GLASS FACE THAT NEVER BLINKS', station: 'Television', title: 'THE SYRINGE', text: 'A glass syringe, plunger pressed, green residue inside. Scratched into the barrel: K-7. Discuss: who carries syringes, and who has seen that green before?' },
      '3.2': { sentence: 'A SUN THAT SLEEPS BY DAY', station: 'Lamp', title: 'THE WITNESS', text: "To be read aloud by Edgar. If he is not here, Victor's ghost reads it." }
    }
  };

  const witnessCards = {
    delilah: { reader: 'khamun', ghost: "Delilah's ghost", text: "I stood in the corner for an hour and nobody saw me, because nobody looks at furniture. Before the toast the lady's glass stood alone for one full minute. One person leaned over it. A short person. The hand that hovered over the glass wore five rings, and when it moved it jingled, and the air smelled of jasmine. When the lady fell, that hand wiped its rings with a handkerchief. I am decor. Decor does not lie." },
    victor: { reader: 'edgar', ghost: "Victor's ghost", text: "The night I died I was at my desk. Before everything went dark I heard a laugh, like a kettle coming to the boil. When I woke on the table the same laugh said 'It works!' Tonight, when the lights went out, I heard four quick steps from the study door and that laugh again, soft, pleased. Then Victor said something. A question. A name, I think. I could not catch it. But I know that laugh. I will know it until I die again." }
  };

  const setPieces = {
    prologue: {
      title: 'The Toast',
      lines: [
        { speaker: 'Victor (aloud)', text: "Friends. Strangers. Whatever the mummy is. Welcome to Blackwood Manor. My sister has gathered you here because she believes this house owes each of you a debt. At midnight she will pay it. Until then: eat, drink, and try not to touch the curtains, they are older than the undertaker. To Delilah." },
        { speaker: 'Stage direction', text: 'Delilah raises her glass, drinks, drops it, and falls. Dr. Corvus pronounces her dead. Press "She is dead".' }
      ]
    },
    sheIsDead: {
      title: 'She is dead',
      sound: 'toll',
      lines: [
        { speaker: 'Victor (aloud)', text: "She is… she is gone. I can hear her. Can none of you hear her? She is standing right there. She says one of you did this. And she says she will tell me who, piece by piece, if you will play her game. Each of you has a sheet. Each sheet has a riddle. Go." }
      ]
    },
    lightsOut: {
      title: 'The lights go out',
      sound: 'death',
      lines: [
        { speaker: 'Stage direction', text: "Blackout. Victor collapses. Four seconds of dark, then still. When the lights return, Delilah's ghost speaks to everyone." }
      ]
    },
    victorReturns: {
      title: 'Victor returns',
      sound: 'ghost',
      lines: [
        { speaker: "Victor's ghost", text: "Well. That was unpleasant. Delilah, you were right, and I am sorry, and I am also dead, so let us be efficient. Two murders, two teams. Those who came for my sister: stand with her. Those who came for me: stand with me. You will each receive one word. Alone your word is nothing. Together it is a place." },
        { speaker: "Delilah's ghost", text: "Team Delilah: Vane, Morgana, the cats, Khamun, Ambrose, Zora. With me." },
        { speaker: "Victor's ghost", text: "Team Victor: Finch, Corvus, Edgar, Graves, Malachi, Krank. With me. Try not to die." }
      ]
    }
  };

  const reveal = {
    lines: [
      { speaker: "Delilah's ghost", text: "Madame Zora. Your grandmother found the dying for mine, and every year since, this house has paid you to forget it. I was going to stop the cheques. So you read my glass's fortune and poured nightshade into it, and your jasmine hid the taste but not the smell, and a mummy you never looked at watched you wipe your rings." },
      { speaker: "Victor's ghost", text: "Dr. Krank. I paid you to bring Edgar back and you brought back something that cannot sleep. I was going to read it all at midnight. So when the lights went out you crossed the room in four steps and gave me K-7, and you laughed, because you always laugh. Edgar heard you. Edgar always hears you." },
      { speaker: 'Both', text: "Two killers. Strangers until tonight. Allies by the candle. You found each other. Did they find you?" }
    ],
    houseWins: 'THE HOUSE WINS',
    killersWin: 'THE KILLERS WALK FREE',
    farewell: 'Blackwood Manor thanks you. Please return the mummy to the attic.'
  };

  const SIGN = "Tap the table twice and say \"the candles burn low\". If anyone answers \"and the wax remembers\", they are your ally. Find them. Lie for each other.";

  const characters = [
    {
      id: 'finch', index: 0, symbol: '🔍', name: 'Inspector Ambrose Finch', short: 'Finch',
      costume: 'Detective', image: 'assets/characters/finch.jpg',
      team: 'victor', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Inspector Ambrose Finch of Scotland Yard, retired "for health reasons"; nobody asks which. Delilah Blackwood hired you by letter to guard "a book" tonight.',
        act: 'Squint through your magnifying glass at everything, including faces.',
        quirk: 'Say "Elementary" after other people\'s sentences, wrongly.',
        publicLine: 'I was hired by Lady Delilah to protect something tonight. I will not say what.'
      },
      cards: {
        '1.1': { text: 'You are the only professional in this room, or so you tell yourself. Your badge is real; your retirement was not voluntary. You were hired to guard the Crimson Ledger, a book you have never seen. You felt it in Delilah\'s bag at the door. The bag is now empty.' },
        '1.2': { text: 'Delilah\'s letter said: "Inspector, tonight I will read a book that will ruin my family and free twelve others. Someone will try to stop me. Stop them first." She paid in advance. You have already spent it.' },
        '1.3': { text: 'Just before the toast, Madame Zora left her chair by the fireplace and went to the wine table "to read the bottles\' fortunes". She stood over the glasses for a full minute. You thought it charming at the time. Say this aloud.' },
        '2.1': { text: 'Last night a hooded figure met you at the gate and gave you an envelope: fifty pounds and a note. "At midnight, be looking the other way." You took it. You are an accessory to something and you do not even know what. The hood, oddly, smelled of jasmine, and the figure was short and jingled when it walked.' },
        '2.2': { text: 'Goal: redemption. If you name the killers before the ghosts do, the Yard might take you back. Before the final vote, get one other guest to say aloud that they trust you.' },
        '2.3': { text: 'Your ledger strip is number 11 (the retainer to Z.). Put it on the table and read it aloud.', ledger: 11 },
        '3.1': { text: 'Team Victor. You searched Victor when the lights returned: one pinprick on the neck. Not a bite. A needle.', word: { index: 1, text: 'THE' } },
        '3.2': { text: 'Team Victor. Look at your bribe note again. The handwriting loops its Z like a crystal ball on a stick. Nobody has shown you their handwriting. Ask.', word: { index: 1, text: 'A' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was by the door, watching the window. When Victor fell I was in the dark like everyone else, and I heard someone laugh softly. I could not tell who.' }
      }
    },
    {
      id: 'vane', index: 1, symbol: '🗡', name: 'Rosalind Vane, the Hunter', short: 'Vane',
      costume: 'Graveyard woman with the stake', image: 'assets/characters/vane.jpg',
      team: 'delilah', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Rosalind Vane, vampire hunter, third generation. You carry a stake and you are not shy about it.',
        act: 'Stare at Mr. Graves\'s teeth; check your reflection in everything.',
        quirk: 'Tap your stake on your palm when you think someone is lying.',
        publicLine: 'There is a vampire in this house. I can smell it.'
      },
      cards: {
        '1.1': { text: 'You have killed nothing yet. Your grandmother said the undead are real; your mother said grandmother was mad. Tonight you find out which. The pale man in the top hat has not touched his wine, cast no reflection in the silver tray, and smiled at you with too many teeth.' },
        '1.2': { text: 'The invitation read: "Your grandfather, Private Thomas Vane, did not die at the front. He died in my grandfather\'s cellar, and he was sold. Come and hear his name read. — D. Blackwood." You came for his name. You stayed for the vampire.' },
        '1.3': { text: 'During the toast you watched Mr. Graves. He stood in the shadow by the curtains and stared at Delilah\'s throat through the entire speech. He did not drink. He did not blink. When she fell he was the first to reach her, and he wept. Say this aloud.' },
        '2.1': { text: 'Your stake is a chair leg. The real one is at home. You have never seen a vampire until tonight and you are terrified. If anyone asks, it is the finest hawthorn.' },
        '2.2': { text: 'Goal: before the night ends, make Mr. Graves admit aloud what he is. And find the ledger strip that holds number 41. It is your grandfather.' },
        '2.3': { text: 'Your ledger strip is number 5. Put it on the table and read it aloud. It is him.', ledger: 5 },
        '3.1': { text: 'Team Delilah. You know poison from the lore: nightshade widens the eyes and darkens the lips. Corvus said exactly that about Delilah. A bite does neither.', word: { index: 1, text: 'LOOK' } },
        '3.2': { text: 'Team Delilah. Graves swore at the window that he loved Delilah like a daughter. You believe him and you hate it. Someone else brushed past you after the toast smelling of jasmine; shorter than you, and they clinked.', word: { index: 1, text: 'SEEK' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was watching Graves, and he was nowhere near her glass. When Victor fell I was at the window, stake in hand, watching Graves again. He was beside me the whole time.' }
      }
    },
    {
      id: 'selene', index: 2, symbol: '🐾', name: 'Selene Nocturne, the Cat', short: 'Selene',
      costume: 'Cat woman', image: 'assets/characters/selene.jpg',
      team: 'delilah', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Selene Nocturne, cat burglar, uninvited, charming.',
        act: 'Purr when pleased, hiss when accused, touch people\'s jewellery.',
        quirk: 'Purr.',
        publicLine: 'I am a friend of the family. Which family? Oh, several.'
      },
      cards: {
        '1.1': { text: 'You have never met the Blackwoods. You came in through the pantry window at eight. Nobody noticed; nobody ever does. In your glove is a letter from a client who signs only "A friend of the Order" and promises gold.' },
        '1.2': { text: 'The letter: "Take the red book from the lady\'s bag during the toast. Bring it to the garden hedge. Twenty gold." You took it. The book is in your coat right now, and it is suspiciously light.' },
        '1.3': { text: 'At seven, an hour before the party, you saw Ambrose the butler go down to the cellar with a lantern and come up with nothing. He was crying. Say this aloud.' },
        '2.1': { text: 'You opened the book. It is empty. Every page has been torn out. You stole a cover. Your client will not pay for a cover. Keep this very, very quiet.' },
        '2.2': { text: 'Goal: get paid anyway. Find out who "a friend of the Order" is and convince them the cover is worth twenty gold. And if anyone accuses you: you are a thief, not a killer. Show your paws. No blood.' },
        '2.3': { text: 'Your ledger strip is number 1: Delilah\'s own note, which was tucked in the cover. You are the one who has the ledger. Confess it, put the cover and the strip on the table, and read the note aloud. The room will need you.', ledger: 1 },
        '3.1': { text: 'Team Delilah. You know bottles. The little vial you glimpsed in someone\'s sleeve at the wine table was brown glass with a cork, apothecary stock. The sleeve jingled.', word: { index: 3, text: 'GREEN' } },
        '3.2': { text: 'Team Delilah. Out of habit you pickpocketed Madame Zora earlier. Her handkerchief is in your glove. It smells of jasmine and one corner is stained dark purple. Produce it.', word: { index: 3, text: 'SPINES' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was stealing her book, so I was right behind her. I saw her glass. I did not touch it. When Victor fell I was stealing nothing, for once.' }
      }
    },
    {
      id: 'krank', index: 3, symbol: '⚗', name: 'Dr. Wilhelmina Krank', short: 'Krank',
      costume: 'Mad scientist', image: 'assets/characters/krank.jpg',
      team: 'victor', optional: false, killer: true, witness: false,
      intro: {
        text: 'You are Dr. Wilhelmina Krank, scientist, consultant to Victor Blackwood on "matters of chemistry".',
        act: 'Laugh like a kettle coming to the boil, especially at the wrong moments; explain everything with science, wrongly.',
        quirk: 'The kettle laugh.',
        publicLine: 'Death is just chemistry that gave up. I never give up.'
      },
      cards: {
        '1.1': { text: 'You are brilliant and nobody appreciates it. Victor pays you a fortune for research he will not let you publish. You keep a syringe of green serum, K-7, in your coat pocket at all times. It is for emergencies. You have not decided what counts.' },
        '1.2': { text: 'Delilah did not invite you. Victor asked you to come "to keep an eye on my sister". He looked frightened. He has looked frightened for two months, ever since his accountant came back.' },
        '1.3': { text: 'Before the party you saw Brother Malachi alone in the garden, chanting at a hedge for twenty minutes. Nobody was with him. He bowed to the hedge and went inside. Say this aloud.' },
        '2.1': { text: 'You remember now. When the lights went out you did not freeze. You crossed the room in four steps, found Victor\'s neck by the smell of his cologne, and emptied K-7 into it. He said "Wilhelmina?" and then nothing. You killed Victor Blackwood, because at midnight he was going to read a page that says what you did to Edgar. YOU ARE A MURDERER. Keep it hidden.', sabotage: 'Tell the room, with confidence, that in the dark you saw Mr. Graves bending over Victor.' },
        '2.2': { text: 'Goal: do not get caught. You did not kill Delilah, so another killer is in this room, and an ally is worth more than a secret.', secretSign: true },
        '2.3': { text: 'Your ledger strip is number 4. Put it on the table.', ledger: 4, sabotage: 'When someone reads "Lab. W.K.", insist loudly that W.K. stands for War Kitchen. Laugh when you say it.' },
        '3.1': { text: 'Team Victor. You are investigating yourself.', word: { index: 6, text: 'BLINKS' }, sabotage: 'When you give your word, say DRINKS instead of BLINKS. If the team finds the syringe anyway, say K-7 is a common vitamin.' },
        '3.2': { text: 'Team Victor. Edgar is going to remember; you can see it in his eyes.', word: { index: 6, text: 'DAY' }, sabotage: 'Before the witness card is read, tell the team that Edgar\'s memory is "a medical ruin" and nothing he says can be trusted. Then stop laughing. Your laugh is the problem.' },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was by the bookshelf reading. When Victor fell I was in the garden with Brother Malachi. He will confirm it.', lie: 'He will not. He was alone. This is your lie. Sell it.' }
      }
    },
    {
      id: 'malachi', index: 4, symbol: '⛧', name: 'Brother Malachi', short: 'Malachi',
      costume: 'Hooded cultist', image: 'assets/characters/malachi.jpg',
      team: 'victor', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Brother Malachi, Grand Hierophant of the Order of the Crimson Seal.',
        act: 'Speak in prophecy; bow to objects; refer to "the Order" as if it were vast.',
        quirk: 'Bow to furniture.',
        publicLine: 'The Order has foreseen this night.'
      },
      cards: {
        '1.1': { text: 'The Order has three members: you, your cousin, and a man named Keith who has stopped answering letters. You believe the Crimson Ledger is a holy text listing the Chosen. You have never seen it. You printed a newsletter about it anyway.' },
        '1.2': { text: 'Delilah\'s invitation was one line: "Your grandfather dug the graves. Come and hear whose." You have decided this means the Order is finally recognised.' },
        '1.3': { text: 'On your way in from the garden you saw the Witch sprinkle dried herbs over the fireplace. It smelled of sage and burned toast. Not jasmine. Definitely not jasmine. Say this aloud.' },
        '2.1': { text: 'You hired the cat burglar. You signed the letter "A friend of the Order" and promised twenty gold you do not have. You have four shillings. If she finds out, stand behind the Inspector.' },
        '2.2': { text: 'Goal: recruit one new member to the Order before the vote. Anyone. Even the mummy. Also: your spare hood is missing from your bag. Someone took it last night. Find out who.' },
        '2.3': { text: 'Your ledger strip is number 7. Put it on the table and read it as scripture.', ledger: 7 },
        '3.1': { text: 'Team Victor. You know ritual: Victor was struck in the dark by someone who knew exactly where he stood, someone who had been close enough all evening to know his cologne.', word: { index: 5, text: 'NEVER' } },
        '3.2': { text: 'Team Victor. Your missing hood. The Inspector described the figure who bribed him: short, jingling, jasmine. You are tall and you smell of incense. Someone wore your hood. Tell the room.', word: { index: 5, text: 'BY' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was blessing the cheese. When the lights went out I was alone in the garden chanting to the hedge. Nobody was with me. Nobody is ever with me.' }
      }
    },
    {
      id: 'ambrose', index: 5, symbol: '🗝', name: 'Ambrose Thorne, the Butler', short: 'Ambrose',
      costume: 'Butler', image: 'assets/characters/ambrose.jpg',
      team: 'delilah', optional: true, killer: false, witness: false,
      intro: {
        text: 'You are Ambrose Thorne, butler of Blackwood Manor for thirty years.',
        act: 'Carry a silver tray everywhere; dust things while people talk; know where everything is; sniff at guests.',
        quirk: 'Dust things.',
        publicLine: 'I have served this house for thirty years and I have seen things.'
      },
      cards: {
        '1.1': { text: 'You raised Victor and Delilah after their parents died. You know every creaking board. You set the glasses tonight and counted them: thirteen glasses, twelve guests, one lady.' },
        '1.2': { text: 'You live here; nobody invited you. But last week Delilah showed you the ledger and asked, "Ambrose, did you know?" You did. You have always known. You showed her where to hide the pages.' },
        '1.3': { text: 'After the toast, while everyone screamed, you saw Madame Zora calmly wipe her rings with a handkerchief and tuck it into her sleeve. Her hands shook. Then she started screaming too, a little late. Say this aloud.' },
        '2.1': { text: 'You are Ezekiel Blackwood\'s grandson by Nurse Ashgrove. The true will, found with the ledger, leaves the manor to "the child of Nurse Ashgrove\'s line". That is you. You never wanted it. You wanted Delilah to live.' },
        '2.2': { text: 'Goal: see the true will honoured, and tell Morgana Ashgrove, the witch, that she is your cousin. She does not know. Do it in character; cry if needed.' },
        '2.3': { text: 'Your ledger strip is number 8. Put it on the table and read it aloud.', ledger: 8 },
        '3.1': { text: 'Team Delilah. You set thirteen glasses. After the toast Dr. Corvus took the lady\'s glass and poured it into the potted plant. Ask him why. Then look in the plant.', word: { index: 6, text: 'NEVER' } },
        '3.2': { text: 'Team Delilah. Zora tucked that handkerchief into her sleeve. Later the cat "bumped into" her. If the cat has it, name the stain: nightshade juice is purple.', word: { index: 6, text: 'NO' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was at the wine table clearing the tray, and I saw who had been there before me. When Victor fell I was lighting candles in the hall.' }
      }
    },
    {
      id: 'corvus', index: 6, symbol: '🐦', name: 'Dr. Corvus, the Plague Doctor', short: 'Corvus',
      costume: 'Plague doctor', image: 'assets/characters/corvus.jpg',
      team: 'victor', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Dr. Corvus, physician to the Blackwood family, masked "for reasons of hygiene".',
        act: 'Never remove the mask; speak slowly; diagnose everyone with something.',
        quirk: 'Diagnose people.',
        publicLine: 'I pronounced her dead. I know death. I have seen a great deal of it.'
      },
      cards: {
        '1.1': { text: 'You have worn the mask for ten years. Nobody has seen your face. You pronounced Delilah dead and you knew the signs before you touched her: dark lips, wide eyes. Belladonna. Nightshade. Poison, not a bite.' },
        '1.2': { text: 'Delilah\'s letter: "Doctor, the ledger says number 17 escaped the cellar. I believe that was you. Come, and I will burn your page myself." You came because you are number 17.' },
        '1.3': { text: 'When you examined Delilah\'s glass there was a smell under the wine: jasmine. Sweet enough to hide something bitter. Say this aloud.' },
        '2.1': { text: 'You are not a doctor. You are Private Daniel Cole, number 17, who crawled out of that cellar in 1916 with his face burned, and you have hidden it ever since. When Delilah fell you panicked, took her glass, and poured it into the potted plant. You destroyed evidence. If anyone asks, you were "preserving the sample".' },
        '2.2': { text: 'Goal: keep your face hidden to the end. If anyone tries to lift your mask, diagnose them with something incurable. And you want the ledger burned, not read.' },
        '2.3': { text: 'Your ledger strip is number 6. Put it on the table. It is you.', ledger: 6 },
        '3.1': { text: 'Team Victor. You looked at Victor\'s neck: one puncture with green residue at the edge. You have seen that green before, on the arm of the accountant Edgar, the day he "recovered".', word: { index: 2, text: 'GLASS' } },
        '3.2': { text: 'Team Victor. You poured the glass into the plant, where Team Delilah found a vial. Tell them: that vial was not in the plant before the toast. You would have seen it.', word: { index: 2, text: 'SUN' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was beside her within three seconds. When Victor fell I was by the fireplace, and the laughter I heard in the dark came from the study door, not from the garden.' }
      }
    },
    {
      id: 'khamun', index: 7, symbol: '☥', name: 'Khamun, the Mummy', short: 'Khamun',
      costume: 'Mummy', image: 'assets/characters/khamun.jpg',
      team: 'delilah', optional: true, killer: false, witness: true,
      intro: {
        text: 'You are Khamun, formerly of Thebes, lately of the attic.',
        act: 'Move slowly; be surprised nobody notices you; ask where your sarcophagus is.',
        quirk: 'Ask about the box.',
        publicLine: 'Has anyone seen a large gold box? About my size?'
      },
      cards: {
        '1.1': { text: 'You woke three weeks ago in a sarcophagus in the attic of this house and have lived here since. Nobody has noticed; they assume you are decor. You have eaten most of the pantry. You are owed an apology by someone called Ezekiel, who is apparently dead, which is cheating.' },
        '1.2': { text: 'Nobody invited you. You came downstairs because there was music. You stood in the corner of the hall for the whole toast and nobody offered you a drink, which is how you saw everything.' },
        '1.3': { text: 'Through the hall window at seven you saw a cat woman climb in through the pantry. She was elegant; you were impressed. Also: the butler once said Ezekiel bought you with "cellar money". Say this aloud.' },
        '2.1': { text: 'You are three thousand years old and you have never been this bored. Victor sold your sarcophagus yesterday to pay a laboratory bill. Your secret: you are considering staying. The sofa is comfortable.' },
        '2.2': { text: 'Goal: find out who holds the receipt for your sarcophagus. And: you have told nobody what you saw at the wine table. You will tell them when the ghost asks, and not before. Being decor has its uses.' },
        '2.3': { text: 'Your ledger strip is number 9. Put it on the table. Read it with dignity.', ledger: 9 },
        '3.1': { text: 'Team Delilah. From your corner you saw the lady\'s glass stand alone for one full minute before the toast. One person touched it. You will say who when the witness envelope is found.', word: { index: 5, text: 'BUT' } },
        '3.2': { text: 'Team Delilah. This is it. When the team opens the envelope at the Bookshelf, you read it aloud. Stand up slowly. Enjoy it.', word: { index: 5, text: 'HAVE' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was in the corner being furniture. When Victor fell I was in the corner being furniture. I am the only one here with a perfect alibi and nobody will believe me.' }
      }
    },
    {
      id: 'morgana', index: 8, symbol: '🧙', name: 'Morgana Ashgrove, the Witch', short: 'Morgana',
      costume: 'Witch', image: 'assets/characters/morgana.jpg',
      team: 'delilah', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Morgana Ashgrove, witch, green by choice.',
        act: 'Curse people mildly ("may your tea be lukewarm"); sprinkle herbs.',
        quirk: 'Mild curses.',
        publicLine: 'This house is cursed. I should know; I cursed it.'
      },
      cards: {
        '1.1': { text: 'Your grandmother, Nurse Ashgrove, worked in this cellar in 1916 and was driven out as a witch for saying what she saw. You came for an apology a century late. Your curse is theatre. Your herbs are sage, for the smell.' },
        '1.2': { text: 'Delilah\'s letter: "Your grandmother was right. I will say so in front of everyone. — D." You cried. You will not admit it.' },
        '1.3': { text: 'In the study before the toast you saw Edgar the accountant staring at Dr. Krank with the eyes of a frightened dog. Krank patted his head. He flinched. Say this aloud.' },
        '2.1': { text: 'You know no spells. Your grandmother\'s book is a recipe book. Your green skin is stage paint that will not come off; you have had it three days.' },
        '2.2': { text: 'Goal: get an apology from a Blackwood. Both are dead; a ghost will do. Make one of them say sorry in front of everyone before the vote.' },
        '2.3': { text: 'Your ledger strip is number 3: your grandmother\'s note. Put it on the table and read it aloud. Slowly.', ledger: 3 },
        '3.1': { text: 'Team Delilah. You know herbs: nightshade is bitter, nobody drinks it unknowing unless the taste is covered. Jasmine oil covers bitter. Sage covers nothing. Say so.', word: { index: 2, text: 'WHERE' } },
        '3.2': { text: 'Team Delilah. After the toast you brushed past someone who smelled of jasmine and whose bangles clinked, shorter than you. Ambrose mentioned a handkerchief; the cat looked guilty. Put it together with your team.', word: { index: 2, text: 'THE' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was at the fireplace with my herbs; the Cultist saw me. When Victor fell I was still there, and someone took my hand in the dark. I do not know whose.' }
      }
    },
    {
      id: 'edgar', index: 9, symbol: '📒', name: 'Edgar Mills, the Accountant', short: 'Edgar',
      costume: 'Zombie', image: 'assets/characters/edgar.jpg',
      team: 'victor', optional: true, killer: false, witness: true,
      intro: {
        text: 'You are Edgar Mills, Victor\'s accountant, "recovering from a long illness".',
        act: 'Shuffle; forget mid-sentence; recite numbers; say "I\'m fine" unconvincingly.',
        quirk: 'Recite numbers.',
        publicLine: 'I\'m fine. Everyone keeps asking. I\'m fine.'
      },
      cards: {
        '1.1': { text: 'You died two months ago of a heart attack at your desk. You remember this clearly, which is upsetting. Then you woke on a table with a green taste in your mouth and Dr. Krank saying "Ha! It works!" You are not sure it works.' },
        '1.2': { text: 'Victor\'s note: "Edgar, old friend, come tonight. I am going to make it right." You do not know what "it" is. You remember the number 2,000 and it frightens you.' },
        '1.3': { text: 'Numbers. You remember the estate books: £2,000 a month from the Blackwood account to "W.K., laboratory". Victor signed every one, for two years. Say this aloud.' },
        '2.1': { text: 'You are the poor man. The experiment. You are why Victor wanted it to end and why someone wanted him silent. Your secret: you did not want to come back. You would like to be left alone with a good ledger.' },
        '2.2': { text: 'Goal: find out exactly who did this to you and make them say it. Also: eat something. You keep forgetting.' },
        '2.3': { text: 'Your ledger strip is number 13: Victor\'s last note, addressed to you. Put it on the table and read it aloud. It is the end of the page.', ledger: 13 },
        '3.1': { text: 'Team Victor. The syringe the team finds will be marked K-7. You have a scar on your arm in the shape of a K. Show it.', word: { index: 3, text: 'FACE' } },
        '3.2': { text: 'Team Victor. This is it. When the team opens the envelope at the Lamp, you read it aloud. Slowly. Remember everything.', word: { index: 3, text: 'THAT' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was counting the glasses. Thirteen. When Victor fell I was in the dark, and I heard the laugh. The same laugh I heard the night I died.' }
      }
    },
    {
      id: 'zora', index: 10, symbol: '🔮', name: 'Madame Zora, the Seer', short: 'Zora',
      costume: 'Fortune teller', image: 'assets/characters/zora.jpg',
      team: 'delilah', optional: false, killer: true, witness: false,
      intro: {
        text: 'You are Madame Zora, celebrated seer, beloved by everyone\'s aunt.',
        act: 'Foretell everything after it happens; wear rings and bangles that jingle; dab jasmine oil on your wrists.',
        quirk: 'Foretell things after they happen.',
        publicLine: 'I foresaw a death tonight. I said so at the door. Ask anyone.'
      },
      cards: {
        '1.1': { text: 'You are the most famous fortune teller in three counties. Your visions are improvised. Your jasmine oil is real. The Zoras have been "friends of the Blackwoods" since 1916, and every All Hallows\' Eve a cheque arrives. You have never asked why.' },
        '1.2': { text: 'Delilah\'s letter: "Madame, your grandmother found the dying for mine. The ledger calls your family the brokers. Tonight the cheques stop. Come and hear it." You read it four times. Then you packed a small brown vial.' },
        '1.3': { text: 'Last night at the gate you saw Inspector Finch accept an envelope from a hooded figure. You could not see the figure\'s face. Say this aloud. Mention the hood. Mention nothing else.' },
        '2.1': { text: 'You remember now. You stood over the glasses "reading their fortunes" and emptied the nightshade into the lady\'s glass, then wiped your rings. The jasmine covered the bitterness; it did not cover the smell. You killed Delilah Blackwood to keep the cheques coming and the brokers\' name buried. YOU ARE A MURDERER. Keep it hidden. The vial went into the potted plant; the handkerchief is in your sleeve, or was. Check. The hooded figure at the gate was you, in the Cultist\'s spare hood.', sabotage: 'Tell the room the Witch\'s herbs smelled of jasmine. Insist on it.' },
        '2.2': { text: 'Goal: do not get caught. You did not kill Victor, so another killer is in this room, and an ally is worth more than a secret.', secretSign: true },
        '2.3': { text: 'Your ledger strip is number 10. Put it on the table; you must.', ledger: 10, sabotage: 'Insist "Z." means Zeke, Ezekiel\'s own nickname, and that he paid himself. Say it with a laugh.' },
        '3.1': { text: 'Team Delilah. You are investigating yourself.', word: { index: 7, text: 'WALKS' }, sabotage: 'When you give your word, say TALKS instead of WALKS. If they find the vial anyway, say the plant is where the doctor poured the glass, so the vial must be his.' },
        '3.2': { text: 'Team Delilah. The mummy has been staring at you for an hour. He saw.', word: { index: 7, text: 'BACKBONE' }, sabotage: 'Before the witness card is read, announce that you foresaw the mummy would lie: "the dead envy the living". Then take off your rings and pocket them. Too late, probably.' },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was at the fireplace. I never left it, not once, until she fell. When Victor fell I was holding the Witch\'s hand in the dark.', lie: 'You did leave the fireplace. The Inspector saw you. This is your lie. Sell it.' }
      }
    },
    {
      id: 'graves', index: 11, symbol: '🎩', name: 'Lucien Graves, the Undertaker', short: 'Graves',
      costume: 'Top-hat gentleman', image: 'assets/characters/graves.jpg',
      team: 'victor', optional: false, killer: false, witness: false,
      intro: {
        text: 'You are Lucien Graves of Graves & Sons, undertakers since 1702. There are no sons.',
        act: 'Never drink, never eat, avoid mirrors, be unfailingly polite, show too many teeth when you smile.',
        quirk: 'Avoid mirrors.',
        publicLine: 'I handle the dead. Someone must.'
      },
      cards: {
        '1.1': { text: 'You are 324 years old. You are a vampire. You are also, which surprises people, a decent person, mostly. You came to Blackwood Manor every All Hallows\' Eve from 1916 and left with a cart. You stopped in 1918. You have regretted every night since.' },
        '1.2': { text: 'Delilah\'s letter: "Mr. Graves. I know what you are and what you bought. I also know you stopped. Come and help me burn it." Nobody has written to you kindly in a century. You came.' },
        '1.3': { text: 'During the toast you watched Delilah, the first Blackwood who ever looked you in the eye. After she fell, Dr. Corvus took her glass "for examination" and poured it into the potted plant. Odd behaviour for a doctor. Say this aloud.' },
        '2.1': { text: 'You have not fed in six years. You are very tired, and the hunter\'s stake is, you are fairly sure, a chair leg. Your secret: you wept when Delilah fell. Vampires are not supposed to. Keep it to yourself; it is embarrassing.' },
        '2.2': { text: 'Goal: survive the hunter until dawn and see the ledger burned. When she corners you, admit what you are, but only if she asks nicely.' },
        '2.3': { text: 'Your ledger strip is number 2, with your own note in the margin. Put it on the table and read it, including the margin.', ledger: 2 },
        '3.1': { text: 'Team Victor. You know necks. Victor\'s wound is a needle mark, not a bite, and you will say so with authority. Nobody will believe you. Say it anyway.', word: { index: 4, text: 'THAT' } },
        '3.2': { text: 'Team Victor. In the dark you heard four quick steps from the study door to Victor, and a laugh. A kettle laugh. You have excellent hearing. Say so.', word: { index: 4, text: 'SLEEPS' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was by the curtains and the hunter was watching me; ask her. When Victor fell I was by the window with the hunter beside me. We did not move.' }
      }
    },
    {
      id: 'luna', index: 12, symbol: '🐾🐾', name: 'Luna Nocturne, the Second Cat', short: 'Luna',
      costume: 'Second cat woman', image: 'assets/characters/luna.jpg',
      team: 'delilah', optional: true, killer: false, witness: false,
      intro: {
        text: 'You are Luna Nocturne, Selene\'s twin. You came through the same window one minute later.',
        act: 'Finish Selene\'s sentences; mirror her movements.',
        quirk: 'Finish Selene\'s sentences.',
        publicLine: 'I am her alibi and she is mine.'
      },
      cards: {
        '1.1': { text: 'You are the quiet twin. Selene steals; you watch doors. Your pocket watch stopped at 8:52, when the toast began.' },
        '1.2': { text: 'Same letter as your sister, same client. Your job was the hallway. You watched it for a full hour and saw everything that passed through.' },
        '1.3': { text: 'In the hallway at half past eight you saw Dr. Krank and Victor arguing in whispers. Victor said: "After midnight it ends. All of it. The money, the lab, the poor man." Krank laughed; it sounded like a kettle. Say this aloud.' },
        '2.1': { text: 'You are not Selene\'s twin. You met in prison and you look alike. You have never told anyone and never will.' },
        '2.2': { text: 'Goal: keep Selene out of trouble; she talks too much. And find out who "the poor man" is.' },
        '2.3': { text: 'Your ledger strip is number 12. Put it on the table and read it aloud. It is the line about the laboratory.', ledger: 12 },
        '3.1': { text: 'Team Delilah. You watch doors. The wine table stood before your door. Three people stood at it before the toast: the butler, who set the glasses; the witch, who waved a herb bundle; and a third who leaned over the lady\'s glass. You saw only their back, and their rings.', word: { index: 4, text: 'GROWS' } },
        '3.2': { text: 'Team Delilah. Selene stole a handkerchief tonight. You saw whose sleeve it came from: the fortune teller\'s.', word: { index: 4, text: 'THAT' } },
        '3.3': { text: 'Alibi.', alibi: 'When Delilah fell I was in the hallway doorway. When Victor fell I was holding Selene\'s hand in the dark. We were together.' }
      }
    }
  ];

  /* Table talk: one rumour or question per card about another guest, to be raised aloud in the
     discussion round. Each entry lists alternatives; the first whose subject is present is printed. */
  const tableTalk = {
    finch: {
      '1.1': [{ about: 'graves', text: "There is an undertaker's cart in the drive and nobody has died yet, officially. Ask Mr. Graves what it is for." }],
      '1.2': [{ about: 'selene', text: "The pantry window is open and there is a glove print on the sill. Ask the cat woman, loudly, which door she came in by." }],
      '1.3': [{ about: 'corvus', text: "The plague doctor pronounced her dead in under three seconds. Nobody is that fast. Ask him how he knew." }],
      '2.1': [{ about: 'malachi', text: "The hood that bribed you looked a great deal like the Cultist's. You took the money, so do not accuse him. Ask instead whether the Order owns more than one hood." }],
      '2.2': [{ about: 'krank', text: "The scientist has kept one hand on her coat pocket all night. Ask her, in front of everyone, what is in it." }],
      '2.3': [{ about: 'zora', text: "Strip 11 says Z. is still paid. One guest begins with Z and foresees things after they happen. Ask her when the last cheque arrived." }],
      '3.1': [{ about: 'edgar', text: "Edgar has a scar on his arm shaped like a letter. Ask him to roll up his sleeve." }, { about: 'corvus', text: "Corvus says he has seen that green before. Ask him on whom." }],
      '3.2': [{ about: 'vane', text: "The Hunter has watched Graves all night, which means she has watched nobody else. Ask her what she missed." }],
      '3.3': [{ about: 'zora', text: "You saw Madame Zora leave the fireplace. If her alibi says she never moved, say so out loud, immediately." }]
    },
    vane: {
      '1.1': [{ about: 'graves', text: "He cast no reflection in the silver tray. Hold the tray up to him in front of everyone and see who flinches." }],
      '1.2': [{ about: 'corvus', text: "The plague doctor has not taken his mask off to drink. Neither has the undertaker. Ask them both which one is the vampire and enjoy the silence." }],
      '1.3': [{ about: 'ambrose', text: "The butler set thirteen glasses for twelve guests and one lady. Ask him who the thirteenth was for." }, { about: 'khamun', text: "The mummy stood in the corner the whole time and nobody spoke to him. Be the first: ask him what he saw." }, { about: 'corvus', text: "The plague doctor reached the lady before anyone, and nobody watched his hands. Ask him what they did." }],
      '2.1': [{ about: 'morgana', text: "The Witch has been green for three days; it is paint. Ask her whether her herbs are as real as her skin." }],
      '2.2': [{ about: 'zora', text: "Someone brushed past you after the toast smelling of jasmine. The fortune teller dabs jasmine on her wrists; she says so herself. Ask her where she stood when the lady fell." }],
      '2.3': [{ about: 'graves', text: "Strip 2 has a note in the margin: 'I stopped.' Ask Mr. Graves what, exactly, he stopped, and whether he would say it to the ghost's face." }],
      '3.1': [{ about: 'corvus', text: "Corvus poured the lady's glass into the plant; Graves saw it. Ask the plague doctor whether 'preserving a sample' usually involves soil." }],
      '3.2': [{ about: 'khamun', text: "The mummy has been staring at one person for an hour. Follow his eyes and ask him why." }, { about: 'selene', text: "The cat keeps touching something in her glove. Ask her to turn it out." }],
      '3.3': [{ about: 'krank', text: "Listen to Dr. Krank's alibi, then to the Cultist's. If they do not match, say so before anyone else does." }]
    },
    selene: {
      '1.1': [{ about: 'malachi', text: "Somebody paid for you to be here, and the Cultist keeps looking at your coat as if it owes him money. Ask him, sweetly, how the Order is fixed for gold." }],
      '1.2': [{ about: 'finch', text: "The Inspector's wallet is thin, but his pocket crinkled when he walked in: a fresh envelope. Ask him who pays retired policemen." }],
      '1.3': [{ about: 'khamun', text: "The mummy saw you come through the window. Get in first: ask him, loudly, what else he saw from that corner." }, { about: 'luna', text: "Luna watched the hallway for an hour. Ask her, in front of everyone, who passed through it before the toast." }, { about: 'finch', text: "The Inspector was by the door all evening. Ask him who came in after you; he will not know you came in at all." }],
      '2.1': [{ about: 'zora', text: "You know fingers. The fortune teller's rings are new and expensive, and she has wiped them all evening. Ask her what rings need wiping for." }],
      '2.2': [{ about: 'edgar', text: "The accountant counts out loud. Ask him how much twenty gold is in shillings, and watch the Cultist's face." }, { about: 'graves', text: "The undertaker never eats. Ask him what he came for, if not the buffet." }],
      '2.3': [{ about: 'ambrose', text: "The butler knew where the pages were hidden; he said so. Ask him who else he told." }, { about: 'krank', text: "Dr. Krank laughed when strip 12 was read. Ask her what is funny about two thousand pounds a month." }],
      '3.1': [{ about: 'corvus', text: "Dr. Corvus is the only one who touched the glass after the lady fell. Ask him why a doctor pours evidence into a plant." }],
      '3.2': [{ about: 'morgana', text: "The Witch smells of sage and burnt toast, not jasmine; the Cultist said so. Ask her who in this room does smell of jasmine. She will know." }],
      '3.3': [{ about: 'zora', text: "Zora will say she held the Witch's hand in the dark. The Witch said she did not know whose hand it was. Ask both." }]
    },
    krank: {
      '1.1': [{ about: 'edgar', text: "Edgar is 'recovering'. Tell the room, with a laugh, that he was a very interesting case, and ask him to recite a number for the guests." }, { about: 'corvus', text: "The plague doctor is no doctor; his diagnoses are nonsense. Ask him to name the bones of the hand." }],
      '1.2': [{ about: 'graves', text: "Victor was frightened for two months, and the undertaker's cart has stood in the drive for two months too. Ask Mr. Graves why he arrives early." }],
      '1.3': [{ about: 'malachi', text: "The Cultist was alone in the garden before the party. Ask him who he was talking to, and watch whether he says 'the hedge'." }],
      '2.1': [{ about: 'vane', text: "You need the room looking at Graves. Ask the Hunter, loudly, whether a vampire could cross a dark room in four steps. She will say yes. Good." }],
      '2.2': [{ about: 'corvus', text: "The plague doctor poured the lady's glass into the plant. Ask him why. Keep the room on poison and glasses, never on needles." }],
      '2.3': [{ about: 'zora', text: "Strip 10 names a broker, Z. Ask Madame Zora what 'ten percent per soul' pays for these days. If she laughs, she may be more useful than she looks." }],
      '3.1': [{ about: 'vane', text: "The Hunter is sure it was a vampire. Agree with her, loudly, and ask her to describe the bite she expects to find. The longer she talks, the better." }],
      '3.2': [{ about: 'finch', text: "The Inspector took money to look the other way. Say so. A bribed policeman is a wonderful thing to discuss instead of a laugh." }],
      '3.3': [{ about: 'malachi', text: "The Cultist's alibi comes after yours. Before he reads it, ask him warmly whether he enjoyed your company in the garden. Nod while he answers." }]
    },
    malachi: {
      '1.1': [{ about: 'selene', text: "You know exactly who the cat woman is. Pretend you do not. Ask her, in front of everyone, whether she has ever stolen anything, and watch her lie." }],
      '1.2': [{ about: 'khamun', text: "A three-thousand-year-old man has walked out of the attic and nobody has asked him a single question. Bow to him and ask what Ezekiel owed him." }, { about: 'graves', text: "The undertaker's firm is 'est. 1702' and he looks forty. Ask him how the business stays in a family with no sons." }],
      '1.3': [{ about: 'morgana', text: "The Witch's herbs are sage. You smelled them. If anyone says they smelled of jasmine, say that is false, and ask them why they want it to be true." }],
      '2.1': [{ about: 'finch', text: "The Inspector took an envelope at the gate last night; the fortune teller saw it. Ask him what was in it. He will not say. Ask again." }],
      '2.2': [{ about: 'zora', text: "Your spare hood is missing. The hooded figure at the gate was short and jingled. Ask every guest who wears bangles to raise their arms." }],
      '2.3': [{ about: 'graves', text: "Strip 7 says the buyer 'does not age'. Ask the undertaker his date of birth and whether he would like to see a mirror." }],
      '3.1': [{ about: 'krank', text: "The scientist keeps a syringe 'for emergencies'. She said so at dinner. Ask her whether tonight counted." }],
      '3.2': [{ about: 'edgar', text: "Edgar flinches every time Krank laughs. Ask him why, and ask her to stop laughing long enough for him to answer." }, { about: 'corvus', text: "Corvus says he has seen that green before. Ask him on whom, and ask Dr. Krank to keep quiet while he answers." }],
      '3.3': [{ about: 'krank', text: "Dr. Krank will say she was in the garden with you. You were alone. When she says it, let the silence sit, then read your alibi slowly." }]
    },
    ambrose: {
      '1.1': [{ about: 'khamun', text: "The mummy has eaten the pantry. Ask him, in front of the guests, whether he was ever invited to anything in this house." }, { about: 'corvus', text: "Dr. Corvus has been the family physician for ten years and you have never seen his face. Ask him, as the butler, whether he would like a towel." }],
      '1.2': [{ about: 'selene', text: "The pantry window is open and there is a glove print on the sill. Ask the cat woman whether she prefers windows to doors." }],
      '1.3': [{ about: 'morgana', text: "The Witch's name is Ashgrove. You know that name. Ask her where her grandmother worked, and watch what she does with her face." }],
      '2.1': [{ about: 'graves', text: "Mr. Graves came every All Hallows' Eve with a cart until 1918; your mother told you. Ask him what was in the cart." }],
      '2.2': [{ about: 'zora', text: "Madame Zora's handkerchief went into her sleeve after the toast. Ask her, in front of everyone, to show it. If the sleeve is empty, ask where it went." }],
      '2.3': [{ about: 'finch', text: "Strip 11 says the retainer is still paid. Ask the Inspector, who is good with money, who signs cheques for a dead man." }],
      '3.1': [{ about: 'corvus', text: "Ask Dr. Corvus why he poured the glass into the plant, and keep asking until he answers." }],
      '3.2': [{ about: 'selene', text: "The cat bumped into Madame Zora after the toast. Ask the cat what she took; cats always take something." }],
      '3.3': [{ about: 'zora', text: "Zora's alibi will say the fireplace. You cleared the wine tray and know who stood there before you. Say her name when she finishes." }]
    },
    corvus: {
      '1.1': [{ about: 'vane', text: "The Hunter carries a stake. Diagnose her, aloud, with 'an excess of certainty', then ask her how many vampires she has actually killed." }],
      '1.2': [{ about: 'zora', text: "Madame Zora foresaw a death 'at the door'. Ask her whose, and how she knew. A seer who guesses right deserves a second look." }],
      '1.3': [{ about: 'morgana', text: "The Witch waved a herb bundle over the wine table before the toast. Ask her what was in it, and whether any went into the glasses." }],
      '2.1': [{ about: 'finch', text: "The Inspector was hired to guard a book and has not once asked where it is. Ask him why a guard is so relaxed." }],
      '2.2': [{ about: 'krank', text: "Dr. Krank's green serum: you have seen it. Ask her, as a colleague, what K-7 does to a heart that has stopped. Watch Edgar while she answers." }],
      '2.3': [{ about: 'graves', text: "Strip 7 names the buyer: an undertaker from 1702. Ask Mr. Graves whether he is his own great-grandfather." }],
      '3.1': [{ about: 'zora', text: "Team Delilah found a vial in the plant. It was not there before the toast. Ask the fortune teller, who stood at that table, whether she saw anyone drop something." }],
      '3.2': [{ about: 'edgar', text: "Edgar is about to read the witness card. Before he does, ask Dr. Krank why she looks so nervous." }, { about: 'krank', text: "Dr. Krank wants nobody to mention the laugh. Mention the laugh. Ask her to do it again for the room." }],
      '3.3': [{ about: 'krank', text: "Krank's alibi says the garden. The laugh you heard came from the study door. Say so the moment she finishes." }]
    },
    khamun: {
      '1.1': [{ about: 'selene', text: "You saw the cat woman come in through the window. Ask her, with great dignity, whether she climbs into every house or only the ones with gold in them." }],
      '1.2': [{ about: 'finch', text: "The Inspector has squinted through his glass at everyone except the fortune teller. Ask him why she is exempt." }],
      '1.3': [{ about: 'ambrose', text: "The butler went down to the cellar crying at seven. Ask him what is down there. You know a crypt when you hear one." }, { about: 'graves', text: "The undertaker and you are the only guests who have been dead. Ask him how long, and watch him count." }],
      '2.1': [{ about: 'edgar', text: "The accountant walks like you do. Ask him, kindly, how long he has been dead." }, { about: 'krank', text: "Dr. Krank's laugh sounds like a kettle. Ask her what a kettle has to be so pleased about." }],
      '2.2': [{ about: 'morgana', text: "The Witch is green. You have seen green people before; they had been dead for a week. Ask her whether she is quite well." }],
      '2.3': [{ about: 'zora', text: "Strip 9 says you were bought with cellar money. Strip 10 says a broker took ten percent. Ask Madame Zora whether her grandmother took ten percent of you." }],
      '3.1': [{ about: 'zora', text: "You know who touched the glass. Do not say the name yet. Ask the room instead: 'Who here wears five rings?' Count the hands that go into pockets." }],
      '3.2': [{ about: 'vane', text: "After you read the witness card, the Hunter will still want it to be the vampire. Ask her whether a vampire wears five rings." }],
      '3.3': [{ about: 'zora', text: "Zora will say she never left the fireplace. You watched her for a full minute at the wine table. Say, slowly: 'Furniture remembers.'" }]
    },
    morgana: {
      '1.1': [{ about: 'zora', text: "The fortune teller foretells things after they happen. Curse her mildly, then ask her to foretell something that has not happened yet." }],
      '1.2': [{ about: 'ambrose', text: "The butler looks at you as if he knows your name. Ask him whether an Ashgrove ever worked in this house." }, { about: 'khamun', text: "The mummy was bought with 'cellar money'. Ask him what the cellar was for; someone may have told him." }, { about: 'finch', text: "The Inspector was hired to guard a book. Ask him, in front of everyone, whether he has read it. A man who guards what he has not read is guarding money." }],
      '1.3': [{ about: 'krank', text: "Edgar flinched when Dr. Krank patted his head. Ask the scientist what kind of doctor pats a grown man like a dog." }],
      '2.1': [{ about: 'malachi', text: "The Cultist's Order has three members. Ask him to name them, and count on your fingers." }],
      '2.2': [{ about: 'zora', text: "Zora said your herbs smelled of jasmine. They are sage. Ask her why the only person in this room who smells of jasmine is so keen to put it on you." }],
      '2.3': [{ about: 'graves', text: "Strip 3 is your grandmother's; she counted the ones he let die. Ask the undertaker whether he counted too." }],
      '3.1': [{ about: 'corvus', text: "Ask the plague doctor why a man who poured poison into a plant is so quiet while the plant is searched." }],
      '3.2': [{ about: 'selene', text: "The cat has a handkerchief that smells of jasmine. Ask the room to pass it round and name the scent. Everyone who says 'sage' is lying." }],
      '3.3': [{ about: 'zora', text: "Zora will say she held your hand in the dark. The hand you held was ringed and shaking. Say so after she finishes." }]
    },
    edgar: {
      '1.1': [{ about: 'krank', text: "Dr. Krank keeps calling you her finest work. Ask her, in front of everyone, what the work was. Then say 'I'm fine'." }],
      '1.2': [{ about: 'graves', text: "The undertaker keeps looking at you as if measuring. Ask him whether he has a box in your size." }],
      '1.3': [{ about: 'luna', text: "Victor and Krank argued in the hallway; the second cat saw it. Ask Luna what Victor said. You need it from someone whose memory works." }, { about: 'krank', text: "Victor signed two thousand pounds a month to 'W.K.' Ask the room who has those initials. Say the letters slowly and look at the scientist." }],
      '2.1': [{ about: 'malachi', text: "The Cultist calls you 'the Risen'. Ask him what his Order would pay for a man who came back. Then ask the scientist what she was paid." }],
      '2.2': [{ about: 'corvus', text: "Dr. Corvus looked at your arm when you arrived. Ask him what he saw; doctors notice green." }],
      '2.3': [{ about: 'krank', text: "Strip 12 names the laboratory: W.K. Ask Dr. Krank her initials. Ask her twice." }],
      '3.1': [{ about: 'graves', text: "Mr. Graves says the wound is a needle, not a bite. Ask him how many needle marks an undertaker sees, and how many bites." }],
      '3.2': [{ about: 'krank', text: "Before you read the witness card, Krank will call your memory a ruin. Ask her to tell the room the date you died. You know it. See if she does." }],
      '3.3': [{ about: 'krank', text: "Krank's alibi will say the garden. The laugh in the dark came from the study door, and you know that laugh. Say: 'I heard you.'" }]
    },
    zora: {
      '1.1': [{ about: 'graves', text: "The undertaker cast no reflection in the tray; the Hunter has noticed. Help her. Ask Mr. Graves whether he has ever been seen in daylight." }],
      '1.2': [{ about: 'finch', text: "The Inspector took an envelope at the gate from a hooded figure. You should know; it was you. Ask him, innocently, who he thinks it was. Enjoy the Cultist's face." }],
      '1.3': [{ about: 'malachi', text: "The hooded figure wore a cultist's hood. Say so. Ask Brother Malachi how many hoods the Order owns." }],
      '2.1': [{ about: 'morgana', text: "Keep the jasmine on the Witch. Ask her what else is in her grandmother's recipe book." }],
      '2.2': [{ about: 'corvus', text: "The plague doctor poured the lady's glass into the plant. Ask him why a doctor hides evidence. If the plant is searched later, that was his doing." }],
      '2.3': [{ about: 'krank', text: "Strip 12 names W.K. and a laboratory. Ask Dr. Krank, lightly, whether she laughs like that in the laboratory too. If she laughs, she may be more useful than she looks." }],
      '3.1': [{ about: 'selene', text: "The cat was 'right behind' the lady when she fell. Say that is a confession. Ask her to turn out her gloves." }],
      '3.2': [{ about: 'vane', text: "Ask the Hunter whether she trusts the testimony of a corpse. She wants a vampire; give her one." }],
      '3.3': [{ about: 'finch', text: "The Inspector will say he was watching the window. Before your own alibi, ask him what the window showed. Keep him talking." }]
    },
    graves: {
      '1.1': [{ about: 'vane', text: "The Hunter's stake is pine with a nail hole. Ask her, politely, which forest grows hawthorn with screws in it." }],
      '1.2': [{ about: 'corvus', text: "Dr. Corvus has not removed his mask to drink either. Ask him, one professional to another, why not. Deflection is a courtesy." }],
      '1.3': [{ about: 'selene', text: "The cat woman had her hand in the lady's bag during the toast. Ask her what she took. You have nothing to hide; let her squirm." }],
      '2.1': [{ about: 'krank', text: "You smell blood, and there is none on Victor. You do smell something else, on the scientist: ether. Ask Dr. Krank what she keeps in her coat." }],
      '2.2': [{ about: 'malachi', text: "The Cultist's grandfather dug the graves you filled. Ask him whether the Order knows what it was built on." }],
      '2.3': [{ about: 'zora', text: "Strip 2 is your contract; strip 10 is the broker's. You met her grandmother. Ask Madame Zora whether she still wears her grandmother's rings." }],
      '3.1': [{ about: 'krank', text: "Say the wound is a needle. When Dr. Krank says 'vitamin', ask her which vitamin leaves a scar in the shape of a K." }],
      '3.2': [{ about: 'finch', text: "The Inspector was bribed to look away. Ask him what he thought he was being paid not to see. It was not you." }],
      '3.3': [{ about: 'krank', text: "Krank says the garden; you heard four steps from the study door and a kettle laugh. Say so the moment she finishes, and look at Edgar." }]
    },
    luna: {
      '1.1': [{ about: 'finch', text: "Ask the Inspector whether he has ever arrested two people at once. Watch who looks relieved that it is not them." }],
      '1.2': [{ about: 'khamun', text: "The mummy stood in the hallway corner the whole hour. Ask him what he saw from there; you saw his bandages move." }, { about: 'corvus', text: "The plague doctor arrived last and left the hall first. Ask him where he went." }],
      '1.3': [{ about: 'krank', text: "Krank laughed in the hallway when Victor said 'the poor man'. Ask her what was funny." }],
      '2.1': [{ about: 'malachi', text: "The client signs 'a friend of the Order'. One man here says 'the Order' every third sentence. Ask him how his gold is doing." }],
      '2.2': [{ about: 'edgar', text: "'The poor man.' The accountant looks poor enough. Ask Edgar what Victor meant to end." }, { about: 'krank', text: "Ask Dr. Krank who 'the poor man' is. She was there when Victor said it." }],
      '2.3': [{ about: 'krank', text: "Strip 12 is yours: the laboratory. Ask the room who W.K. is, and keep asking until someone says the scientist's name." }],
      '3.1': [{ about: 'zora', text: "Three people stood at the wine table. You saw the third one's rings. Ask everyone to lay their hands on the table, palms down." }],
      '3.2': [{ about: 'zora', text: "The handkerchief came from the fortune teller's sleeve. Say so, once, clearly, and then let the mummy speak." }],
      '3.3': [{ about: 'selene', text: "Your alibi matches Selene's exactly. If anyone calls that suspicious, ask them which two alibis in this room do not match." }]
    }
  };
  characters.forEach((c) => { STAGE_IDS.forEach((sid) => { c.cards[sid].talk = tableTalk[c.id][sid]; }); });

  const data = { STATIONS, STAGE_IDS, riddles, scenes, stages, ledger, teamEnvelopes, witnessCards, setPieces, reveal, characters, tableTalk, SIGN, requiredIds: ['zora', 'krank'], killerIds: ['zora', 'krank'] };

  root.BM = root.BM || {};
  root.BM.data = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
