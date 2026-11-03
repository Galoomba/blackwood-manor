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
      narration: [{ speaker: "Delilah's ghost (Victor reads)", text: "Brother, I cannot see faces yet, only shapes. Make them tell me who they are. Each of them carries a lie they think is a costume. Let them find it. And brother: the glass that killed me was not the glass I was handed. Agnes poured it. Someone else touched it." }],
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
      hostNotes: "Zora says she never left the fireplace; Finch (1.3) and Agnes (1.3) saw her at the wine table. Krank says she was in the garden with Malachi; Malachi's alibi says he was alone. Then open the vote."
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
    { number: 8, holder: 'agnes', text: "Nurse M. Ashgrove dismissed, 1917, for 'hysteria and witchcraft'. Her allegations are not to be repeated. — E.B." },
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
        { speaker: "Delilah's ghost", text: "Team Delilah: Vane, Morgana, the cats, Khamun, Agnes, Zora. With me." },
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

  const characters = [];

  const data = { STATIONS, STAGE_IDS, riddles, scenes, stages, ledger, teamEnvelopes, witnessCards, setPieces, reveal, characters, requiredIds: ['zora', 'krank'], killerIds: ['zora', 'krank'] };

  root.BM = root.BM || {};
  root.BM.data = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
