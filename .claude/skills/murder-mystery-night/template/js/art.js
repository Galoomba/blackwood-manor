(function (root) {
  /* Ink drawings for the four team envelopes on the table (data.PICTURES). Each team sentence
     describes one of them. Plain black line art with solid greys (no transparency) so they print on any printer. */
  const open = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

  const art = {
    Plant: open +
      '<path d="M62 128 h76 l-10 56 h-56 z" fill="#ebebeb"/>' +
      '<path d="M56 120 h88 v10 h-88 z"/>' +
      '<path d="M100 120 C100 96 98 70 100 40"/>' +
      '<path d="M100 92 C80 88 58 72 48 50 C72 52 92 66 100 92 z" fill="#d9d9d9"/>' +
      '<path d="M100 78 C118 72 138 54 146 30 C122 34 104 50 100 78 z" fill="#d9d9d9"/>' +
      '<path d="M100 106 C120 104 144 94 158 76 C134 74 112 86 100 106 z" fill="#d9d9d9"/>' +
      '<path d="M100 104 C84 106 62 100 46 86 C66 82 88 90 100 104 z" fill="#d9d9d9"/>' +
      '<path d="M100 54 C92 44 88 32 90 20 C100 28 104 40 100 54 z" fill="#d9d9d9"/>' +
      '</svg>',
    Television: open +
      '<rect x="30" y="52" width="140" height="104" rx="10"/>' +
      '<rect x="44" y="66" width="92" height="76" rx="14" fill="#e0e0e0"/>' +
      '<path d="M56 84 C70 74 92 74 104 82" stroke-width="3" stroke="#666666"/>' +
      '<circle cx="153" cy="80" r="6"/><circle cx="153" cy="104" r="6"/>' +
      '<path d="M146 124 h14 M146 134 h14" stroke-width="3"/>' +
      '<path d="M100 52 L72 18 M100 52 L132 14"/><circle cx="100" cy="52" r="4" fill="#000"/>' +
      '<path d="M54 156 l-8 22 M146 156 l8 22"/>' +
      '</svg>',
    Bookshelf: open +
      '<rect x="34" y="20" width="132" height="166"/>' +
      '<path d="M34 72 h132 M34 128 h132"/>' +
      '<path d="M44 72 v-42 h12 v42 M58 72 v-36 h10 v36 M70 72 v-44 h14 v44 M90 72 l8 -40 l11 2 l-8 38" fill="#e0e0e0"/>' +
      '<path d="M118 72 v-30 h40 v30" /><path d="M124 42 v30 M132 42 v30" stroke-width="2"/>' +
      '<path d="M44 128 v-40 h16 v40 M62 128 v-46 h10 v46 M74 128 v-38 h14 v38" fill="#e0e0e0"/>' +
      '<circle cx="128" cy="112" r="14"/><path d="M120 128 h16"/>' +
      '<path d="M44 186 v-46 h12 v46 M58 186 v-40 h16 v40 M110 186 v-44 h12 v44 M124 186 v-38 h10 v38 M136 186 v-48 h14 v48" fill="#e0e0e0"/>' +
      '</svg>',
    Lamp: open +
      '<path d="M64 28 h72 l22 62 h-116 z" fill="#e0e0e0"/>' +
      '<path d="M50 72 h100" stroke-width="2" stroke="#666666"/>' +
      '<path d="M100 90 v66"/>' +
      '<path d="M100 90 m-10 0 a10 6 0 0 0 20 0" />' +
      '<path d="M70 184 h60 l-8 -22 h-44 z" fill="#d9d9d9"/>' +
      '<path d="M112 100 v22"/><circle cx="112" cy="126" r="3" fill="#000"/>' +
      '<path d="M30 104 l-14 8 M170 104 l14 8 M44 124 l-10 14 M156 124 l10 14" stroke-width="3" stroke="#808080"/>' +
      '</svg>',
    /* Decoys: both have a glass face, like the television. */
    Clock: open +
      '<path d="M58 186 h84 v-20 h-84 z" fill="#e0e0e0"/>' +
      '<path d="M62 166 V70 a38 38 0 0 1 76 0 V166"/>' +
      '<circle cx="100" cy="74" r="28" fill="#ebebeb"/>' +
      '<path d="M100 74 V56 M100 74 L114 82" stroke-width="5"/>' +
      '<path d="M100 50 v4 M124 74 h-4 M100 98 v-4 M76 74 h4" stroke-width="3"/>' +
      '<path d="M100 104 V146" stroke-width="3"/><circle cx="100" cy="150" r="7" fill="#000"/>' +
      '<path d="M84 30 h32" stroke-width="3"/>' +
      '</svg>',
    Mirror: open +
      '<ellipse cx="100" cy="88" rx="48" ry="64" fill="#f0f0f0"/>' +
      '<ellipse cx="100" cy="88" rx="38" ry="54"/>' +
      '<path d="M76 58 C84 46 94 42 104 42" stroke-width="3" stroke="#666666"/><path d="M72 76 l18 -18" stroke-width="3" stroke="#999999"/>' +
      '<path d="M100 152 V172 M70 186 h60 M80 186 l20 -14 l20 14" />' +
      '<path d="M52 40 c-8 -10 -2 -22 8 -22 M148 40 c8 -10 2 -22 -8 -22" stroke-width="3"/>' +
      '</svg>'
  };

  root.BM = root.BM || {};
  root.BM.art = art;
})(window);
