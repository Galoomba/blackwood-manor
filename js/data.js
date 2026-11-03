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

  const data = { STATIONS, STAGE_IDS, riddles };

  root.BM = root.BM || {};
  root.BM.data = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
