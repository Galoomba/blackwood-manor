(function (root) {
  /* The interludes between the scenes, drawn the same way on the host and on the TV:
       lightsOut  (after 1.3)  the candles go out, four seconds of dark for Victor to fall, then a
                               memorial portrait that cracks and swings crooked
       twoGhosts  (after 2.3)  Delilah's ghost alone, then Victor's ghost rises beside her
     play(ov, key, o) draws into the overlay `ov`. o.lines is the lines node, o.alive() says whether the
     interlude is still showing, o.sfx(name) plays a sound, o.cue is an optional host-only note shown in
     the dark, o.onReady() runs once the text is up and o.voice() starts the narration. */
  const { el, clear, candles, flashLightning } = root.BM.ui;

  const CRACK = '<svg viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">' +
    '<polyline points="62,0 55,22 66,38 48,61 57,79 41,104 50,121 44,140" />' +
    '<polyline points="55,22 38,30 30,26" /><polyline points="48,61 70,70 82,66" /><polyline points="41,104 26,112" /></svg>';

  function later(o, ms, fn) { setTimeout(() => { if (o.alive()) fn(); }, ms); }

  function lightsOut(ov, o) {
    ov.classList.add('blackout', 'interlude');
    const c = candles();
    ov.append(c);
    [0, 1, 2].forEach((i) => later(o, 700 + i * 650, () => { c.children[i].classList.add('out'); o.sfx('puff'); }));
    later(o, 2600, () => {
      clear(ov);
      ov.scrollTop = 0;
      ov.classList.add('flicker');
      o.sfx('death');
      flashLightning();
      if (o.cue) ov.append(el('p', { class: 'interlude-cue' }, o.cue));
    });
    /* Four seconds of dark, then the memorial. */
    later(o, 6800, () => {
      clear(ov);
      ov.scrollTop = 0;
      ov.classList.remove('flicker');
      ov.classList.add('mourning');
      o.sfx('heartbeat');
      const crack = el('div', { class: 'crack' });
      crack.innerHTML = CRACK;
      ov.append(
        el('div', { class: 'memorial' },
          el('div', { class: 'ghost-shape memorial-ghost' }),
          el('div', { class: 'memorial-frame' },
            el('span', { class: 'memorial-small' }, 'In memory of'),
            el('strong', {}, 'Victor Blackwood'),
            el('span', { class: 'memorial-small' }, 'Master of Blackwood Manor'),
            el('span', { class: 'memorial-date' }, "Died All Hallows' Eve"),
            crack)),
        el('h1', { class: 'interlude-title' }, 'Scene 2'),
        el('h2', { class: 'interlude-sub' }, 'The Master Falls'),
        o.lines);
      o.lines.classList.add('interlude-lines');
      o.onReady();
      later(o, 1800, o.voice);
    });
  }

  function twoGhosts(ov, o) {
    ov.classList.add('ghostly', 'interlude', 'frost');
    const figure = (cls, name) => el('div', { class: 'interlude-ghost ' + cls }, el('div', { class: 'ghost-shape' + (cls === 'him' ? ' violet' : '') }), el('span', {}, name));
    const pair = el('div', { class: 'ghost-pair' }, figure('her', 'Delilah'));
    ov.append(pair);
    o.sfx('whisper');
    later(o, 2400, () => {
      pair.append(figure('him', 'Victor'));
      ov.classList.add('frost-on');
      o.sfx('ghost');
      flashLightning();
    });
    later(o, 4600, () => {
      ov.append(el('h1', { class: 'interlude-title' }, 'Scene 3'), el('h2', { class: 'interlude-sub' }, 'Two Ghosts'), o.lines);
      o.lines.classList.add('interlude-lines');
      o.onReady();
      later(o, 1200, o.voice);
    });
  }

  const KINDS = { lightsOut, twoGhosts };

  function has(key) { return Boolean(KINDS[key]); }
  function play(ov, key, o) { ov.scrollTop = 0; KINDS[key](ov, o); }

  root.BM = root.BM || {};
  root.BM.interlude = { has, play };
})(window);
