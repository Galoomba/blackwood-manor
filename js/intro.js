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
      title: 'Three scenes, nine stages',
      chips: [{ text: 'Scene 1 · three stages' }, { text: 'Scene 2 · three stages' }, { text: 'Scene 3 · three stages' }, { text: 'Then the accusation' }],
      text: 'The night has three scenes, each with three stages. Every stage runs the same way. The ghost speaks, you search the room, and then you talk. After the last stage, you accuse.'
    },
    {
      id: 'intro-stations', chapter: 'Searching', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Six hiding places',
      chips: [{ text: 'Sofa' }, { text: 'Bookshelf' }, { text: 'Television' }, { text: 'Plant' }, { text: 'Lamp' }, { text: 'Cupboard' }],
      text: 'Six places in this room hide envelopes: the sofa, the bookshelf, the television, the plant, the lamp and the cupboard. Every place holds a small envelope for each stage, marked with the stage number.'
    },
    {
      id: 'intro-riddles', chapter: 'Searching', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Follow your riddle',
      chips: [{ text: 'Solve your riddle' }, { text: 'Open this stage only' }, { text: 'Take the card with your symbol' }],
      text: "Your character sheet ends with a riddle. It points to one of the six places. Go there, open only the current stage's envelope, and take the one card with your symbol and your name. Every card ends with the riddle for your next one."
    },
    {
      id: 'intro-search-rules', chapter: 'Searching', layout: 'evidence', scene: 1, voice: 'narrator',
      title: 'Search like a guest, not a burglar',
      chips: [{ text: 'Only your own card' }, { text: "Never someone else's" }, { text: 'Never a later stage' }, { text: 'Put it back as you found it' }],
      text: "Take only your own card. Never take someone else's, never open a later stage, and put every envelope back exactly where you found it. Cheating angers the dead, and the dead hold grudges."
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
      chips: [{ text: 'Search timer' }, { text: 'Discussion timer' }, { text: 'Table talk on every card' }],
      text: 'When the search timer runs out, the discussion begins. Question each other, share what you choose and accuse freely. Every card carries a little table talk about another guest. Use it. Stir the pot.'
    },
    {
      id: 'intro-secrets', chapter: 'Discussion', layout: 'title', scene: 2, sfx: 'whisper', voice: 'narrator',
      title: 'Everyone is hiding something', kicker: 'Including you',
      text: 'Every guest has a secret. Some are embarrassing, some are criminal. And somewhere among you is a killer, who may not even know it yet. If a card ever gives you secret orders, follow them, and tell no one.'
    },
    {
      id: 'intro-together', chapter: 'Discussion', layout: 'evidence', scene: 3, voice: 'narrator',
      title: 'Some puzzles need everyone',
      chips: [{ text: 'Torn pages' }, { text: 'Team words' }, { text: 'Bring every card' }],
      text: 'Later in the night you will have to work together. There are torn pages to lay out in order, and words that only make sense when a whole team says them together. No one can solve this house alone.'
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
