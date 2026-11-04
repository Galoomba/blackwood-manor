(function (root) {
  /* "Introduce the game": the steps the hosts walk the group through before the night starts, so
     everyone knows what to expect. Same slide format as js/story.js and drawn by the same theatre.
     Spoiler-free: no victims, killers, ghosts' names or clue content. Ids start with "intro-" so
     their recorded clips never clash with the full story's. */

  const ALL = ['finch', 'vane', 'selene', 'luna', 'krank', 'malachi', 'silas', 'corvus', 'khamun', 'morgana', 'edgar', 'zora', 'graves'];

  const slides = [
    {
      id: 'intro-welcome', chapter: 'Welcome', layout: 'title', scene: 1, sfx: 'bell', voice: 'narrator',
      title: 'Welcome to Blackwood Manor', kicker: "All Hallows' Eve",
      text: 'Good evening, and thank you for coming. Lady Delilah Blackwood has invited you for a toast, a dinner, and a confession at midnight. Before the doors are locked, here is how tonight works.'
    },
    {
      id: 'intro-characters', chapter: 'Your character', layout: 'gallery', scene: 1, voice: 'narrator', people: ALL,
      title: 'Tonight, you are someone else',
      text: 'Each of you has a character sheet. It tells you who you are, how to act, a quirk to keep up all night, and one line to say to everyone. Play it with conviction. The worse the accent, the better the evening.'
    },
    {
      id: 'intro-death', chapter: 'What happens', layout: 'title', scene: 2, sfx: 'heartbeat', voice: 'narrator',
      title: 'Someone will die', kicker: 'Soon after the toast',
      text: 'Shortly after the toast, someone in this room will die. In this house the dead do not stay quiet. They will speak to us, and every word they say is a clue.'
    },
    {
      id: 'intro-scenes', chapter: 'What happens', layout: 'evidence', scene: 2, voice: 'narrator',
      title: 'Three scenes, ten stages',
      chips: [{ text: 'Scene 1 · three stages' }, { text: 'Scene 2 · three stages' }, { text: 'Scene 3 · four stages' }, { text: 'Then the accusation' }],
      text: 'The night has three scenes: three stages, three more, and a final four. Every stage runs the same way. The ghost speaks, you take your next card, and then you talk. After the last stage, you accuse.'
    },
    {
      id: 'intro-stations', chapter: 'Your cards', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Your envelope',
      chips: [{ text: 'One envelope each' }, { text: 'Your face on the front' }, { text: 'Top card only' }, { text: 'One stage at a time' }],
      text: 'Every one of you has an envelope on the table, with your own face on the front. At each stage, take only the top card from your own envelope. It is marked with the stage number. Never look further down the pile.'
    },
    {
      id: 'intro-riddles', chapter: 'Your cards', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'A whisper on every card',
      chips: [{ text: 'True' }, { text: 'About another guest' }, { text: 'Never named' }],
      text: 'The foot of every card carries a whisper. It is always true, it is always about another guest, and it never says who. Work out who it means, and decide what to do with it.'
    },
    {
      id: 'intro-search-rules', chapter: 'Your cards', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Play like a guest, not a burglar',
      chips: [{ text: 'Only your own envelope' }, { text: "Never someone else's" }, { text: 'Never a later stage' }, { text: 'Put it back on the table' }],
      text: "Open only your own envelope. Never touch someone else's, never read ahead, and put your envelope back on the table when you are done. Cheating angers the dead, and the dead hold grudges."
    },
    {
      id: 'intro-cards', chapter: 'Your cards', layout: 'evidence', scene: 2, voice: 'narrator',
      title: 'Read in secret',
      chips: [{ text: 'Private unless told otherwise' }, { text: "'Say this aloud' means say it" }, { text: 'Keep every card' }],
      text: 'Read your card in private. If a card tells you to say something aloud, say exactly that. Everything else is yours to share, twist or hide. Keep all your cards with you: you will need them before the night is over.'
    },
    {
      id: 'intro-talk', chapter: 'Discussion', layout: 'evidence', scene: 2, voice: 'narrator',
      title: 'Then, talk',
      chips: [{ text: 'Card time' }, { text: 'Discussion timer' }, { text: 'Table talk on every card' }],
      text: 'When everyone has read their card, the discussion begins. Question each other, share what you choose and accuse freely. Every card carries a little table talk about another guest. Use it. Stir the pot.'
    },
    {
      id: 'intro-secrets', chapter: 'Discussion', layout: 'title', scene: 2, sfx: 'whisper', voice: 'narrator',
      title: 'Everyone is hiding something', kicker: 'Including you',
      text: 'Every guest has a secret. Some are embarrassing, some are criminal. And somewhere among you is a killer, who may not even know it yet. If a card ever gives you secret orders, follow them, and tell no one.'
    },
    {
      id: 'intro-together', chapter: 'Discussion', layout: 'evidence', scene: 3, voice: 'narrator',
      title: 'Some puzzles need everyone',
      chips: [{ text: 'Torn pages' }, { text: 'Team words' }, { text: 'A locked box' }, { text: 'Bring every card' }],
      text: 'Later in the night you will have to work together. There are torn pages to lay out in order, words that only make sense when a whole team says them together, and, at the very end, a locked box and a room full of keys. No one can solve this house alone.'
    },
    {
      id: 'intro-vote', chapter: 'The end', layout: 'evidence', scene: 3, voice: 'narrator',
      title: 'The accusation',
      chips: [{ text: 'Name two suspects' }, { text: 'In secret' }, { text: 'Then the reveal' }],
      text: 'At the end, each of you names two suspects in secret. If the guilty are clearly at the top of the list, the house wins. If not, the guilty walk free, and the rest of us will have to live with that. Briefly.'
    },
    {
      id: 'intro-house-rules', chapter: 'The end', layout: 'evidence', scene: 3, voice: 'narrator',
      title: 'Rules of the house',
      chips: [{ text: 'Stay in character' }, { text: 'Phones away' }, { text: "No peeking at other cards" }, { text: 'Listen when the ghost speaks' }],
      text: 'Stay in character, keep your phone in your pocket, and never read anyone else\'s card. When the ghost speaks, listen carefully. The dead rarely repeat themselves.'
    },
    {
      id: 'intro-begin', chapter: 'Begin', layout: 'title', scene: 1, sfx: 'toll', voice: 'narrator',
      title: 'Let the night begin', kicker: 'Blackwood Manor',
      text: 'Find your character sheet, read it, and become someone else. When the host raises a glass, the night begins. Good luck. You will need it.'
    }
  ];

  function chapters() {
    const out = [];
    slides.forEach((s, i) => { if (!out.length || out[out.length - 1].title !== s.chapter) out.push({ title: s.chapter, index: i }); });
    return out;
  }

  const intro = { slides, chapters };
  root.BM = root.BM || {};
  root.BM.intro = intro;
  if (typeof module !== 'undefined' && module.exports) module.exports = intro;
})(typeof window !== 'undefined' ? window : globalThis);
