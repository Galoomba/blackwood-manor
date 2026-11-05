(function (root) {
  /* The whole story of Blackwood Manor, told slide by slide for the host's "Full story" tab.
     Every slide is narrated aloud (voice: narrator, delilah, victor) and drawn by js/story-view.js.
     layout: title | portrait | duo | gallery | evidence | ghosts
     ghosts: which ghosts a ghosts layout shows (default both: delilah, victor).
     people: character ids whose portraits appear; killers: ids drawn with the blood-red frame.
     chips: evidence tags that pop in one by one (lie: true marks a broken alibi).
     scene: backdrop tint 0-3; sfx: a sound from BM.audio played when the slide starts;
     effect: flicker (lights out), flash (lightning), ghost (cold glow). */

  const slides = [
    /* ---------- I. The cellar ---------- */
    {
      id: 'open', chapter: 'Prologue', layout: 'title', scene: 0, sfx: 'toll', voice: 'narrator',
      title: 'The Whole Story', kicker: "Blackwood Manor · All Hallows' Eve",
      text: 'Every old house keeps a ledger. This one kept it in red. Here is all of it, from the cellar to the last candle.'
    },
    {
      id: 'cellar', chapter: 'I. The cellar, 1916', layout: 'evidence', scene: 1, sfx: 'thunder', effect: 'flash', voice: 'narrator',
      title: 'The cellar', kicker: '1916',
      chips: [{ text: "17 souls 'lost' in one month" }, { text: '£8 for a soldier' }, { text: 'Collected at midnight' }],
      text: "In 1916 Ezekiel Blackwood turned the manor cellar into a hospital for soldiers sent home from the front. He did not heal them. He let them die, wrote 'lost' beside their names, and sold what was left at midnight."
    },
    {
      id: 'buyer', chapter: 'I. The cellar, 1916', layout: 'duo', scene: 1, sfx: 'whisper', voice: 'narrator',
      title: 'The buyer and the broker', people: ['graves', 'zora'],
      text: "The buyer was an undertaker of Graves and Sons, who came with a cart and never signed his name. The broker was a fortune teller called Madame Z., who found the dying and took ten percent of every soul. A nurse named Ashgrove counted the dead, said so out loud, and was thrown out as a witch."
    },
    {
      id: 'nurse', chapter: 'I. The cellar, 1916', layout: 'duo', scene: 1, voice: 'narrator',
      title: 'The nurse who counted', people: ['morgana', 'silas'],
      text: "Nurse Ashgrove did the one thing nobody else in that cellar did: she counted. 'They are not dying,' she wrote. 'He is letting them die.' Ezekiel dismissed her for hysteria and witchcraft, and the village believed him. She left with a recipe book, a ruined name, and a secret she never told: a child of Ezekiel's own."
    },
    {
      id: 'escaped', chapter: 'I. The cellar, 1916', layout: 'gallery', scene: 1, voice: 'narrator',
      title: 'The ones who got away', people: ['corvus', 'graves', 'khamun'],
      text: "Number seventeen, a private named Daniel Cole, crawled out of the cellar with his face burned, and nobody chased him, because nobody would believe him. In 1918 the undertaker stopped coming and wrote 'forgive me' in the margin. In 1920 Ezekiel spent cellar money on an Egyptian sarcophagus. It was occupied."
    },
    {
      id: 'retainer', chapter: 'I. The cellar, 1916', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Paid to forget',
      chips: [{ text: 'Retainer to Z.' }, { text: "Every All Hallows' Eve" }, { text: 'In perpetuity' }, { text: 'Still paid' }],
      text: 'Ezekiel died, and the ledger went into the cellar, behind the wine. But every All Hallows\' Eve a cheque still went out to the Zoras, for discretion, forever. The family never asked why. They simply cashed it.'
    },

    /* ---------- II. The grandchildren ---------- */
    {
      id: 'lab', chapter: 'II. The grandchildren', layout: 'duo', scene: 2, voice: 'narrator',
      title: "Victor's laboratory", people: ['krank', 'edgar'],
      text: 'A century later, Victor Blackwood paid Doctor Wilhelmina Krank two thousand pounds a month for a secret laboratory, to find a cure for death. After two years she wanted a human subject. Two months ago Victor\'s accountant, Edgar Mills, died at his desk of a heart attack, with a kettle laugh in the next room, and she brought him back with a green serum called K-7. It worked. Mostly.'
    },
    {
      id: 'ledger', chapter: 'II. The grandchildren', layout: 'portrait', scene: 2, voice: 'narrator', people: ['silas'],
      title: "Delilah's ledger",
      text: "Delilah found her grandfather's ledger and asked the butler, Silas, whether he knew. Silas had always known. Together they tore it into thirteen pieces and slipped one into each guest's envelope, so that no single thief could ever take the whole truth. Then Delilah wrote her letters."
    },
    {
      id: 'midnight', chapter: 'II. The grandchildren', layout: 'ghosts', scene: 2, sfx: 'heartbeat', voice: 'narrator',
      title: 'Midnight',
      text: "Brother and sister agreed. At midnight on All Hallows' Eve they would read the whole ledger aloud: the cellar, the broker and the laboratory. Then they would end it. Two of their guests decided the Blackwoods would not live that long."
    },

    /* ---------- III. The guests ---------- */
    {
      id: 'guests', chapter: 'III. The guests', layout: 'gallery', scene: 1, sfx: 'bell', voice: 'narrator',
      title: 'Thirteen in the house', people: ['finch', 'vane', 'selene', 'luna', 'krank', 'malachi', 'silas', 'corvus', 'khamun', 'morgana', 'edgar', 'zora', 'graves'],
      text: 'They came in costume, and every one of them was lying about something. Here is who they really were, and the piece of the truth each one carried.'
    },
    {
      id: 'g-finch', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['finch'],
      title: 'Inspector Ambrose Finch',
      text: 'The Inspector came to guard a book he had never seen. The night before, a jingling figure in a borrowed hood paid him fifty pounds to look the other way, and he took it. But he also saw someone leave a chair by the fireplace and stand over the glasses for a full minute, jingling, and that one sentence broke Madame Zora\'s alibi.'
    },
    {
      id: 'g-vane', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['vane'],
      title: 'Rosalind Vane, the Hunter',
      text: 'The Hunter came to hear her grandfather\'s name read aloud: Private Thomas Vane, number forty-one, sold for eight pounds. Her stake is a chair leg. She spent the whole night glaring at the undertaker, which made her his perfect alibi. And in the dark she smelled ether on someone crossing from the study door in four quick steps.'
    },
    {
      id: 'g-selene', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['selene'],
      title: 'Selene Nocturne, the Cat',
      text: "The cat burglar climbed in through the pantry window, hired by 'a friend of the Order' to steal the red book. She stole it. It was empty. But old habits paid off: she also lifted Madame Zora's handkerchief, which smelled of jasmine and was stained purple with nightshade."
    },
    {
      id: 'g-luna', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['luna'],
      title: 'Luna Nocturne, the Second Cat',
      text: "Luna is not really Selene's twin; they met in prison. She watched the hallway, and heard Victor tell someone: after midnight it ends, the money, the lab, the poor man. The other said nothing, but their shoes were wet with grass from the garden. From the doorway Luna also saw a ringed hand hover over the lady's glass."
    },
    {
      id: 'g-krank', chapter: 'III. The guests', layout: 'portrait', scene: 2, voice: 'narrator', people: ['krank'], killers: ['krank'],
      title: 'Dr. Wilhelmina Krank',
      text: 'The mad scientist was the second killer. She came to keep an eye on Delilah and kept one hand on her coat pocket all night. Inside was a syringe of K-7, for emergencies. At midnight Victor was going to read the page about her laboratory. She decided that counted.'
    },
    {
      id: 'g-malachi', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['malachi'],
      title: 'Brother Malachi',
      text: 'Grand Hierophant of an Order with three members, one of whom has stopped answering letters. He hired the cat burglar with gold he did not have, and somebody stole his spare hood. In the end his loneliness solved a murder: when Krank swore she was in the garden with him, his alibi said he was alone. Nobody is ever with him.'
    },
    {
      id: 'g-silas', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['silas'],
      title: 'Silas Thorne, the Butler',
      text: "Silas set thirteen glasses and counted every one. He is Ezekiel's grandson through Nurse Ashgrove, and the true heir to the manor, which he never wanted. After the toast he found the lady's own glass, still full, at the back of the tray. And in the dark he heard four quick steps from the study, and a laugh like a kettle."
    },
    {
      id: 'g-corvus', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['corvus'],
      title: 'Dr. Corvus, the Plague Doctor',
      text: 'The plague doctor is no doctor. He is Private Daniel Cole, number seventeen, the soldier who escaped the cellar. His soul was sold and never collected, so death cannot take him, and he has not aged a day since 1916. He knew it was poison the moment Delilah fell, and in a panic he poured her glass into the potted plant. It made him look guilty. It also put him right beside a vial that was never his.'
    },
    {
      id: 'g-khamun', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['khamun'],
      title: 'Khamun, the Mummy',
      text: 'Khamun of Thebes, bought with cellar money, woke in the attic three weeks ago and has been eating the pantry ever since. Everybody assumed he was furniture, so nobody hid anything from him. He watched the lady\'s glass for a full minute, and he saw five rings and a handkerchief.'
    },
    {
      id: 'g-morgana', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['morgana'],
      title: 'Morgana Ashgrove, the Witch',
      text: "The Witch came for an apology a century late; her grandmother was the nurse who counted the dead. Her curse is theatre and her herbs are sage, and when Zora pinned the jasmine on the cat, Morgana knew the difference, and knew that jasmine is what you use to hide something bitter. She noticed everything else too: Zora's empty chair, and Edgar flinching at Krank's touch. And in the dark a ringed, shaking hand took hers. It was Zora's: the one alibi the seer told true."
    },
    {
      id: 'g-edgar', chapter: 'III. The guests', layout: 'portrait', scene: 2, voice: 'narrator', people: ['edgar'],
      title: 'Edgar Mills, the Accountant',
      text: 'Edgar died two months ago and came back slightly green. He remembered the numbers: two thousand pounds a month to a laboratory, signed by Victor. And he remembered a laugh like a kettle, the night he died, and again in the dark when Victor fell.'
    },
    {
      id: 'g-zora', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['zora'], killers: ['zora'],
      title: 'Madame Zora, the Seer',
      text: "The fortune teller was the first killer. Her grandmother found the dying for the cellar, and her family had been paid every year since to forget it. Delilah's letter said the cheques would stop. So Zora packed a small brown vial, and dabbed on extra jasmine."
    },
    {
      id: 'g-graves', chapter: 'III. The guests', layout: 'portrait', scene: 1, voice: 'narrator', people: ['graves'],
      title: 'Lucien Graves, the Undertaker',
      text: 'Three hundred and twenty-four years old, and a vampire. He bought the dead in 1916, stopped in 1918, and has regretted it every night since. Everyone suspected him. Yet he was the one guest with a perfect witness, because the Hunter never took her eyes off him. And he knows a needle from a bite.'
    },

    /* ---------- IV. The first murder ---------- */
    {
      id: 'gate', chapter: 'IV. The toast', layout: 'duo', scene: 1, sfx: 'whisper', voice: 'narrator', people: ['zora', 'finch'], killers: ['zora'],
      title: 'The night before',
      text: "The night before the party, wearing the Cultist's stolen hood, Zora met the Inspector at the gate and paid him to look away at midnight, when she meant to snatch the ledger before it could be read. In the end she never needed him: the glass came first. The hood smelled of jasmine. It jingled."
    },
    {
      id: 'glass', chapter: 'IV. The toast', layout: 'duo', scene: 1, voice: 'narrator', people: ['zora', 'khamun'], killers: ['zora'],
      title: 'The glass',
      text: "Before the toast Zora left the fireplace to read the bottles' fortunes. For one full minute she stood over the glasses. She emptied the nightshade into her own glass, pushed Delilah's glass to the back of the tray and set the poisoned one in its place. The jasmine hid the taste. It did not hide the smell. In the corner the mummy saw everything, because nobody looks at furniture."
    },
    {
      id: 'fall', chapter: 'IV. The toast', layout: 'ghosts', ghosts: ['delilah'], scene: 1, sfx: 'death', effect: 'flash', voice: 'narrator',
      title: 'The fall',
      text: 'Delilah raised her glass to her guests, drank, and fell. Dark lips and wide eyes: nightshade. Zora wiped her rings with a handkerchief. The plague doctor poured her glass into the plant before anyone could stop him. And Madame Zora began to scream, just a little late.'
    },
    {
      id: 'ghost', chapter: 'IV. The toast', layout: 'ghosts', ghosts: ['delilah'], scene: 1, effect: 'ghost', sfx: 'ghost', voice: 'delilah',
      title: 'The ghost',
      text: 'I did not leave. I stood beside my brother and whispered to him, piece by piece, and made them play my game. The glass that killed me was not the glass poured for me. And when I fell, I smelled jasmine.'
    },

    /* ---------- V. The second murder ---------- */
    {
      id: 'promise', chapter: 'V. The lights go out', layout: 'portrait', scene: 2, sfx: 'heartbeat', voice: 'victor', people: ['krank'],
      title: "Victor's promise",
      text: 'I swore I would find every page and read every line at midnight, and that nobody would leave this house before then. Nobody. I meant it as a threat. One of them heard it as a deadline.'
    },
    {
      id: 'dark', chapter: 'V. The lights go out', layout: 'portrait', scene: 2, sfx: 'death', effect: 'flicker', voice: 'narrator', people: ['krank'], killers: ['krank'],
      title: 'Four steps',
      text: "Then Krank pulled the fuse in the study and the lights went out. She crossed the room in four quick steps, found Victor by the smell of his cologne, and emptied K-7 into his neck. Victor said one word: Wilhelmina? Then nothing. And in the dark, a soft and pleased little laugh, like a kettle coming to the boil."
    },
    {
      id: 'master-falls', chapter: 'V. The lights go out', layout: 'memorial', scene: 2, sfx: 'toll', voice: 'narrator',
      title: 'The Master Falls', kicker: 'In memory of Victor Blackwood',
      text: "When the light crept back, Victor Blackwood lay still on the floor of his own house. The master of Blackwood Manor had followed his sister within the hour. And now, for the first time that night, every guest in the room could hear her."
    },
    {
      id: 'needle', chapter: 'V. The lights go out', layout: 'portrait', scene: 2, voice: 'narrator', people: ['vane'],
      title: 'Not a fang',
      text: 'The whole room blamed the vampire. But there was one puncture on Victor\'s neck, not two, with a smear of green at the edge. A needle, not a fang. The Hunter said so, and she had come here for a vampire. It cost her to say it.'
    },

    /* ---------- VI. Strangers ---------- */
    {
      id: 'sign', chapter: 'VI. Strangers by candlelight', layout: 'duo', scene: 2, sfx: 'bell', voice: 'narrator', people: ['zora', 'krank'], killers: ['zora', 'krank'],
      title: 'The candles burn low',
      text: 'Neither killer knew the other. Each learned only that someone else in the room had killed the other Blackwood. They found each other with words slipped into idle talk: the candles burn low. And the answer: the wax remembers. The butler said the first half all night, about the candles. From then on, they lied for each other.'
    },
    {
      id: 'second-ghost', chapter: 'VI. Strangers by candlelight', layout: 'risen', scene: 3, effect: 'ghost', sfx: 'ghost', voice: 'narrator',
      title: 'Two Ghosts', kicker: 'Scene 3',
      text: "When the torn pages lay together on the table, the room grew colder. Then the cold took a second shape. Beside the lady in white stood her brother, pale as candle smoke, still straightening his coat. Two Blackwoods. Two murders. Two ghosts. And neither of them would rest until it was finished."
    },
    {
      id: 'victor-returns', chapter: 'VI. Strangers by candlelight', layout: 'ghosts', scene: 3, effect: 'ghost', sfx: 'ghost', voice: 'victor',
      title: 'Victor returns',
      text: 'Well. That was unpleasant. My sister was right, I was sorry, and I was also dead, so we split the room in two. She called her half of the room and I called mine. One word each. Together, a place.'
    },

    /* ---------- VII. How the truth came out ---------- */
    {
      id: 'last-letter', chapter: 'VII. How the truth came out', layout: 'ghosts', ghosts: ['delilah'], scene: 3, effect: 'ghost', sfx: 'whisper', voice: 'delilah',
      title: 'The last letter',
      text: 'I left one letter, locked in a box, for whoever was left. The killers knew where the key was and sent everyone searching high and low. It was in my brother\'s old conjuring hat, where something always comes out that never went in. In the letter I all but named the two who wanted me silent: the broker\'s granddaughter, wearing her grandmother\'s five rings, and the one who signs the laboratory bills W.K. and laughs when they are paid.'
    },
    {
      id: 'witch-threads', chapter: 'VII. How the truth came out', layout: 'evidence', scene: 3, voice: 'narrator', people: ['morgana'],
      title: "The Witch's threads",
      chips: [
        { text: "Zora's chair, empty for a minute · alibi" },
        { text: 'Green that never grew · K-7' },
        { text: "Edgar flinched at Krank's touch" },
        { text: "'What the conjurer pulls out' · the key" }
      ],
      text: "The Witch held more threads than anyone knew. Her alibi broke Zora's: the chair beside her had stood empty for a full minute before the toast. Her nose broke Krank's: the green on Victor's neck was made, not picked. She saw Edgar flinch at Krank's touch. And her grandmother's recipe book, underlined in Delilah's fresh ink, pointed the house to the conjuring hat. A century ago an Ashgrove counted the dead. Tonight another one counted the lies."
    },
    {
      id: 'zora-proof', chapter: 'VII. How the truth came out', layout: 'evidence', scene: 3, voice: 'narrator', people: ['zora'], killers: ['zora'],
      title: "Madame Zora's mistakes",
      chips: [
        { text: 'Jasmine in the glass · Corvus' },
        { text: 'Her chair empty, someone at the wine table · Morgana, Finch' },
        { text: "The 1916 broker's rings and scent · Graves" },
        { text: 'Purple-stained handkerchief · Selene' },
        { text: 'Brown vial in the plant · Team Delilah' },
        { text: 'Five rings over the glass · Khamun' },
        { text: "'I never left the fireplace'", lie: true }
      ],
      text: 'Every liar makes one mistake. Madame Zora made seven. The doctor smelled jasmine, the Witch saw her chair empty while the Inspector watched someone stand over the glasses, the undertaker knew her grandmother\'s rings and scent from 1916, the cat stole the stained handkerchief, Team Delilah found the vial, and the mummy saw it all. Then she swore she had never left the fireplace.'
    },
    {
      id: 'krank-proof', chapter: 'VII. How the truth came out', layout: 'evidence', scene: 3, voice: 'narrator', people: ['krank'], killers: ['krank'],
      title: "Dr. Krank's mistakes",
      chips: [
        { text: '£2,000 a month to W.K. · Edgar' },
        { text: "'After midnight it ends' · Luna" },
        { text: 'One puncture, green residue · Corvus' },
        { text: 'Syringe marked K-7 · Team Victor' },
        { text: 'Ether in the dark · Vane' },
        { text: 'Four steps and a kettle laugh · Silas' },
        { text: "'By the garden door with Malachi'", lie: true }
      ],
      text: 'Doctor Krank laughed at the wrong moments all night, and that was the problem. The ledger named W.K., the cat heard Victor\'s threat, the doctor knew the green, the team found the syringe, the hunter smelled ether in the dark, and the butler heard four steps and a kettle. Then she said she was by the garden door with Brother Malachi. Nobody is ever with Brother Malachi.'
    },

    /* ---------- VIII. The reveal ---------- */
    {
      id: 'reveal-zora', chapter: 'VIII. The reveal', layout: 'portrait', scene: 3, effect: 'ghost', voice: 'delilah', people: ['zora'], killers: ['zora'],
      title: 'Madame Zora',
      text: "Your grandmother found the dying for mine, and every year since, this house has paid you to forget it. I was going to stop the cheques. So you read my glass's fortune and swapped it for one full of nightshade, and your jasmine hid the taste but not the smell, and a mummy you never looked at watched you wipe your rings."
    },
    {
      id: 'reveal-krank', chapter: 'VIII. The reveal', layout: 'portrait', scene: 3, effect: 'ghost', voice: 'victor', people: ['krank'], killers: ['krank'],
      title: 'Dr. Krank',
      text: 'I paid you to cheat death, and you stopped Edgar\'s heart to prove you could, and brought back something that cannot sleep. I was going to read it all at midnight. So when the lights went out you crossed the room in four steps and gave me K-7, and you laughed, because you always laugh. Edgar heard you. Edgar always hears you.'
    },
    {
      id: 'apology', chapter: 'VIII. The reveal', layout: 'portrait', scene: 3, effect: 'ghost', voice: 'victor', people: ['morgana'],
      title: 'A century late',
      text: "Morgana Ashgrove. Your grandmother counted the dead in my grandfather's cellar and said so out loud, and this house called her a witch for it. She was right. She was right about all of it, and I am sorry. I promised you that in person, and a ghost keeps his promises. And one thing she never told you: the butler who raised me is her grandson too. You have a cousin in this house."
    },
    {
      id: 'fates', chapter: 'VIII. The reveal', layout: 'gallery', scene: 3, voice: 'narrator', people: ['silas', 'morgana', 'graves', 'vane', 'corvus', 'khamun', 'edgar', 'finch', 'malachi', 'selene', 'luna'],
      title: 'What became of them',
      text: 'Silas inherited the manor, fired nobody, and gave his cousin Morgana the cellar, which she turned into a herb garden. Real herbs, this time. The Hunter never staked the undertaker; she brings him tea on Sundays. The plague doctor burned page six and took his mask off once, for the cat. Khamun kept the sofa. Edgar finally got a good ledger. Brother Malachi gained a fourth member. And Inspector Finch gave back the fifty pounds. Eventually.'
    },
    {
      id: 'end', chapter: 'VIII. The reveal', layout: 'title', scene: 0, sfx: 'toll', voice: 'narrator',
      title: 'The house remembers', kicker: 'Blackwood Manor thanks you',
      text: 'Two killers, strangers until tonight, allies by the candle. The house found them in the end. The wax always remembers. Please return the mummy to the attic.'
    }
  ];

  /* Split narration into sentences for the voice and the highlighting. Titles like "Dr." and
     single initials such as "Z." do not end a sentence. */
  function splitSentences(text) {
    const guarded = String(text)
      .replace(/\b(Dr|Mr|Mrs|Ms|Mme|Pvt|St)\./g, '$1\u0000')
      .replace(/\b([A-Z])\.(?=\s*[A-Z]\.|\s+[a-z]|[,;:])/g, '$1\u0000');
    const parts = guarded.match(/[^.!?]+(?:[.!?]+["'’”)]*|$)/g) || [];
    return parts.map((p) => p.replace(/\u0000/g, '.').trim()).filter(Boolean);
  }

  /* About 150 spoken words a minute at the narrator's pace, never less than 2.5 seconds. */
  function estimateMs(sentence) {
    const words = String(sentence).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2500, words * 400);
  }

  function chapters() {
    const out = [];
    slides.forEach((s, i) => { if (!out.length || out[out.length - 1].title !== s.chapter) out.push({ title: s.chapter, index: i }); });
    return out;
  }

  /* Start time in seconds of each sentence in a recorded clip, from the character timings that
     ElevenLabs returns (alignment.characters and alignment.character_start_times_seconds). */
  function sentenceStarts(text, sentences, alignment) {
    const chars = alignment.characters.join('');
    const times = alignment.character_start_times_seconds;
    let cursor = 0;
    return sentences.map((sentence) => {
      let at = chars.indexOf(sentence, cursor);
      if (at < 0) at = chars.indexOf(sentence.slice(0, 12), cursor);
      if (at < 0) at = cursor;
      cursor = at + 1;
      return Math.round((times[Math.min(at, times.length - 1)] || 0) * 1000) / 1000;
    });
  }

  const story = { slides, splitSentences, estimateMs, chapters, sentenceStarts };
  root.BM = root.BM || {};
  root.BM.story = story;
  if (typeof module !== 'undefined' && module.exports) module.exports = story;
})(typeof window !== 'undefined' ? window : globalThis);
