(function (root) {
  /* The theatre for the "Full story" and the "Introduce the game" decks: draws a slide, speaks it with the browser's own voices,
     lights each sentence as it is spoken and moves on by itself. Host and TV share one small state
     under its own storage key, so the story never disturbs the game state. Exactly one window is
     the speaker: the TV while the story is shown there, otherwise the host. */
  const data = root.BM.data;
  const story = root.BM.story;
  const audio = root.BM.audio;
  const { el, clear, append } = root.BM.ui;
  const KEY = 'blackwood-manor-story-v1';
  const PAUSE_AFTER_SLIDE = 1400;

  function defaults() { return { onTv: false, index: 0, playing: false, voice: true, at: 0 }; }
  /* Each deck (the full story, the introduction) keeps its own small state under its own key. */
  function readKey(key) {
    try { return Object.assign(defaults(), JSON.parse(root.localStorage.getItem(key) || '{}')); } catch (e) { return defaults(); }
  }
  function writeKey(key, deck, patch) {
    const next = Object.assign(readKey(key), patch, { at: Date.now() });
    next.index = Math.max(0, Math.min(deck.slides.length - 1, next.index));
    try { root.localStorage.setItem(key, JSON.stringify(next)); } catch (e) { /* ignore */ }
    return next;
  }
  const read = () => readKey(KEY);
  const write = (patch) => writeKey(KEY, story, patch);

  function charById(id) { return data.characters.find((c) => c.id === id); }

  /* ---------- voices ---------- */
  const synth = root.speechSynthesis || null;
  const ROLE = {
    narrator: { prefs: ['Daniel', 'Arthur', 'Google UK English Male', 'Oliver', 'Rishi', 'Aaron', 'Fred'], rate: 0.92, pitch: 0.8 },
    delilah: { prefs: ['Serena', 'Kate', 'Martha', 'Google UK English Female', 'Shelley (English (United Kingdom))', 'Flo (English (United Kingdom))', 'Moira', 'Fiona', 'Karen', 'Samantha'], rate: 0.88, pitch: 1.0 },
    victor: { prefs: ['Arthur', 'Reed (English (United Kingdom))', 'Google UK English Male', 'Oliver', 'Daniel', 'Rishi', 'Fred'], rate: 0.88, pitch: 0.7 }
  };
  function voiceFor(role) {
    if (!synth) return null;
    const all = synth.getVoices().filter((v) => /^en/i.test(v.lang));
    for (const name of ROLE[role].prefs) {
      const v = all.find((x) => x.name.includes(name));
      if (v) return v;
    }
    return all.find((v) => /en-GB/i.test(v.lang)) || all[0] || null;
  }
  if (synth && synth.addEventListener) synth.addEventListener('voiceschanged', () => {});

  /* Phones (iOS Safari, Chrome on Android) only allow speech that starts inside a tap. Speaking a
     silent utterance during the tap unlocks the page; later sentences may then start on a timer. */
  let unlocked = false;
  function unlockSpeech() {
    unlockClip();
    if (!synth) return;
    try {
      if (synth.paused) synth.resume();
      if (unlocked) return;
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      synth.speak(u);
      unlocked = true;
    } catch (e) { /* speech not available */ }
  }

  /* ---------- recorded voice-over (scripts/generate-voice.js) ---------- */
  const voiceClips = (root.BM.voice && root.BM.voice.clips) || {};
  const clipEl = typeof root.Audio === 'function' ? new root.Audio() : null;
  if (clipEl) clipEl.preload = 'auto';
  let clipUnlocked = false;
  /* Phones also only start audio from a tap: play one clip muted during the tap so that the same
     audio element may play later clips on a timer. */
  function unlockClip() {
    if (!clipEl || clipUnlocked) return;
    const first = Object.values(voiceClips)[0];
    if (!first) return;
    clipUnlocked = true;
    clipEl.unlocking = true;
    clipEl.muted = true;
    clipEl.src = first.src;
    const p = clipEl.play();
    const done = () => { if (clipEl.unlocking) clipEl.pause(); clipEl.unlocking = false; clipEl.muted = false; };
    if (p && p.then) p.then(done, () => { clipUnlocked = false; done(); }); else done();
  }

  /* ---------- drawing ---------- */
  function portrait(id, killer, i) {
    const c = charById(id);
    if (!c) return null;
    return el('figure', { class: 'story-portrait' + (killer ? ' killer' : ''), style: `--i:${i || 0}` },
      el('div', { class: 'frame' }, el('img', { src: c.image, alt: c.name })),
      el('figcaption', {}, `${c.symbol} ${c.short}`));
  }

  function drawSlide(slide, index) {
    const killers = new Set(slide.killers || []);
    const sentences = story.splitSentences(slide.text);
    const text = el('p', { class: 'story-text' }, sentences.flatMap((s, i) => [el('span', { class: 'sent', 'data-i': i }, s), ' ']));
    const head = el('div', { class: 'story-head' },
      el('div', { class: 'story-kicker' }, slide.kicker || slide.chapter),
      el('h1', { class: 'story-title' }, slide.title));
    const people = (slide.people || []);
    let visual = null;
    if (slide.layout === 'portrait' || slide.layout === 'duo') {
      visual = el('div', { class: 'story-visual ' + slide.layout }, people.map((id, i) => portrait(id, killers.has(id), i)));
    } else if (slide.layout === 'gallery') {
      visual = el('div', { class: 'story-visual gallery' + (people.length > 6 ? ' many' : '') }, people.map((id, i) => portrait(id, killers.has(id), i)));
    } else if (slide.layout === 'ghosts') {
      const ghosts = slide.ghosts || ['delilah', 'victor'];
      visual = el('div', { class: 'story-visual ghosts' },
        ghosts.includes('delilah') ? el('div', { class: 'ghost-figure' }, el('div', { class: 'ghost-shape' }), el('span', {}, 'Delilah')) : null,
        ghosts.includes('victor') ? el('div', { class: 'ghost-figure' }, el('div', { class: 'ghost-shape violet' }), el('span', {}, 'Victor')) : null);
    } else if (slide.layout === 'memorial') {
      visual = el('div', { class: 'story-visual memorial-visual' }, root.BM.interlude.memorial());
    } else if (slide.layout === 'risen') {
      visual = el('div', { class: 'story-visual risen' }, root.BM.interlude.ghostPair(true));
    } else if (slide.layout === 'evidence') {
      visual = el('div', { class: 'story-visual evidence' },
        people.length ? el('div', { class: 'evidence-face' }, people.map((id, i) => portrait(id, killers.has(id), i))) : null,
        el('div', { class: 'chips' }, (slide.chips || []).map((c, i) => el('span', { class: 'chip' + (c.lie ? ' lie' : ''), style: `--i:${i}` }, c.lie ? `✗ ${c.text}` : c.text))));
    }
    const body = el('div', { class: `story-body layout-${slide.layout}` }, visual, el('div', { class: 'story-words' }, head, text));
    const node = el('div', { class: 'story-slide' + (slide.effect ? ' fx-' + slide.effect : ''), 'data-scene': slide.scene || 0 },
      el('div', { class: 'story-fog' }), body, el('div', { class: 'story-flash' }));
    return { node, sentences, text };
  }

  /* ---------- the player ---------- */
  /* opts: layer (element), controls (bool), isVisible(state), isSpeaker(state), soundOn(), onHide(), tvConnected() */
  /* opts.deck: { slides, chapters() } (default the full story); opts.key: its storage key;
     opts.finalAction: { label, run } shows a button on the last slide (host only);
     opts.narrateOnStep: read each step aloud on arrival even when not playing. */
  function createPlayer(opts) {
    const deck = opts.deck || story;
    const key = opts.key || KEY;
    const read = () => readKey(key);
    const write = (patch) => writeKey(key, deck, patch);
    const layer = opts.layer;
    let shown = false;
    let current = -1;
    let drawn = null;
    let speaking = false;   // narration (voice or timer) in progress for the current slide
    let token = 0;
    let timers = [];
    let utterances = [];
    let wasSpeaker = null;
    let controlsNode = null;
    let progressFill = null;
    let narratedIndex = -1;   // the step already read aloud since it was reached
    let autoMode = false;     // the current reading was started by Play (so Pause stops it)
    let open = false;   // host: opened from the panel; the TV passes isVisible instead
    const visible = (st) => (opts.isVisible ? opts.isVisible(st) : open);

    let clipTick = null;
    function clearTimers() { timers.forEach(clearTimeout); timers = []; if (clipTick) { clearInterval(clipTick); clipTick = null; } }
    function stopNarration() {
      token++;
      clearTimers();
      if (clipEl) { clipEl.onended = null; clipEl.onerror = null; if (!clipEl.unlocking && !clipEl.paused) clipEl.pause(); }
      /* Only clear our own sentences, so a tap's silent unlock utterance is not cancelled with them. */
      if (synth && utterances.length) synth.cancel();
      utterances = [];
      speaking = false;
    }
    function light(i) {
      if (!drawn) return;
      drawn.text.querySelectorAll('.sent').forEach((s) => {
        const n = Number(s.dataset.i);
        s.classList.toggle('lit', n <= i);
        s.classList.toggle('now', n === i);
      });
    }
    function lightAll() { if (drawn) { drawn.text.classList.add('all'); drawn.text.querySelectorAll('.sent').forEach((s) => s.classList.remove('now')); } }

    function advance() {
      const st = read();
      if (!st.playing) return;
      if (st.index < deck.slides.length - 1) write({ index: st.index + 1 });
      else write({ playing: false });
      sync();
    }

    function narrate(st) {
      stopNarration();
      const my = ++token;
      speaking = true;
      const slide = deck.slides[st.index];
      drawn.text.classList.remove('all');
      light(-1);
      if (opts.soundOn()) {
        if (slide.sfx) audio.play(slide.sfx);
        if (slide.scene) audio.startAmbience(slide.scene); else audio.stopAmbience();
      }
      const sentences = drawn.sentences;
      const finish = () => {
        if (my !== token) return;
        light(sentences.length - 1);
        timers.push(setTimeout(() => { if (my === token) { speaking = false; advance(); } }, PAUSE_AFTER_SLIDE));
      };
      const lead = slide.effect === 'flicker' ? 2600 : 900;
      /* Captions on a clock, from sentence `from`; used without a voice or when speech is refused. */
      const timed = (from, delay) => {
        let t = delay;
        sentences.forEach((s, i) => { if (i < from) return; timers.push(setTimeout(() => { if (my === token) light(i); }, t)); t += story.estimateMs(s); });
        timers.push(setTimeout(finish, t));
      };
      const speak = (delay) => speakWith(st, my, slide, sentences, finish, timed, delay);
      /* 1. A recorded ElevenLabs clip, with sentences lit from its timings. */
      const clip = st.voice && clipEl ? voiceClips[slide.id] : null;
      if (clip) {
        timers.push(setTimeout(() => {
          if (my !== token) return;
          let done = false;
          const fail = () => { if (my === token && !done) { done = true; clipEl.onended = clipEl.onerror = null; speak(0); } };
          clipEl.unlocking = false;
          clipEl.muted = false;
          clipEl.onended = () => { if (my === token && !done) { done = true; finish(); } };
          clipEl.onerror = fail;
          if (!clipEl.src.endsWith(clip.src)) clipEl.src = clip.src;
          try { clipEl.currentTime = 0; } catch (e) { /* not loaded yet */ }
          const p = clipEl.play();
          if (p && p.catch) p.catch(fail);
          clipTick = setInterval(() => {
            if (my !== token || done) return;
            const t = clipEl.currentTime;
            let i = -1;
            clip.starts.forEach((start, n) => { if (t >= start - 0.05) i = n; });
            light(i);
          }, 120);
          timers.push(setTimeout(() => { if (my === token && !done) { done = true; finish(); } }, (clip.duration + 10) * 1000));
        }, lead));
        return;
      }
      speak(lead);
    }

    /* 2. The browser's own voices; 3. captions on a clock when speech is unavailable or refused. */
    function speakWith(st, my, slide, sentences, finish, timed, lead) {
      if (!st.voice || !synth) { timed(0, lead); return; }
      /* May be null while a phone is still loading its voices: the browser's default voice is used. */
      const voice = voiceFor(slide.voice || 'narrator');
      const role = ROLE[slide.voice || 'narrator'];
      let ended = false;
      let fellBack = false;
      let started = false;
      const fallBack = (from) => { fellBack = true; ended = true; synth.cancel(); timed(from, 0); };
      const total = sentences.reduce((a, s) => a + story.estimateMs(s), 0);
      timers.push(setTimeout(() => {
        if (my !== token) return;
        sentences.forEach((s, i) => {
          const u = new SpeechSynthesisUtterance(s);
          if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-GB';
          u.rate = role.rate; u.pitch = role.pitch;
          u.onstart = () => { started = true; if (my === token) light(i); };
          if (i === sentences.length - 1) u.onend = () => { if (!ended && !fellBack) { ended = true; finish(); } };
          u.onerror = (e) => {
            if (my !== token || fellBack || ended || e.error === 'interrupted' || e.error === 'canceled') return;
            /* Speech refused (for example a window nobody has clicked yet): carry on with captions. */
            fallBack(i);
          };
          utterances.push(u);
          synth.speak(u);
        });
        /* Some phones refuse speech without reporting an error: if nothing starts, show captions. */
        timers.push(setTimeout(() => { if (my === token && !started && !fellBack && !ended) fallBack(0); }, 5000));
      }, lead));
      /* Safety net: if the browser never reports the end, move on anyway. */
      timers.push(setTimeout(() => { if (!ended && my === token) { ended = true; finish(); } }, lead + total * 1.8 + 4000));
    }

    function draw(st) {
      const slide = deck.slides[st.index];
      const stage = layer.querySelector('.story-stage');
      drawn = drawSlide(slide, st.index);
      clear(stage).append(drawn.node);
      if (opts.finalAction && st.index === deck.slides.length - 1) {
        drawn.node.querySelector('.story-words').append(el('div', { class: 'story-final' },
          el('button', { class: 'primary', onclick: () => { close(); opts.finalAction.run(); } }, opts.finalAction.label)));
      }
      lightAll();
      if (progressFill) progressFill.style.width = `${((st.index + 1) / deck.slides.length) * 100}%`;
      if (slide.effect === 'flash' || slide.effect === 'flicker') {
        const f = drawn.node.querySelector('.story-flash');
        void f.offsetWidth; f.classList.add('go');
      }
    }

    function buildControls() {
      const chapters = deck.chapters();
      const select = el('select', { class: 'story-chapter-select', onchange: (e) => { write({ index: Number(e.target.value) }); sync(); } },
        chapters.map((c) => el('option', { value: c.index }, c.title)));
      const btn = (cls, label, title, fn) => el('button', { class: 'small ' + cls, title, onclick: fn }, label);
      controlsNode = el('div', { class: 'story-controls' },
        btn('prev', '◀', 'Previous (left arrow)', () => { unlockSpeech(); write({ index: read().index - 1 }); sync(); }),
        btn('play primary', '▶ Play', 'Play or pause (space)', () => { unlockSpeech(); const st = read(); write({ playing: !st.playing, index: !st.playing && st.index === deck.slides.length - 1 ? 0 : st.index }); sync(); }),
        btn('next', '▶▶', 'Next (right arrow)', () => { unlockSpeech(); write({ index: read().index + 1 }); sync(); }),
        select,
        btn('voice', 'Voice: on', 'Narration voice', () => { unlockSpeech(); write({ voice: !read().voice }); stopNarration(); sync(); }),
        btn('tv', 'Show on TV', 'Mirror the story on the TV screen', () => {
          const st = read();
          if (!st.onTv && opts.confirmTv && !opts.confirmTv()) return;
          stopNarration();
          write({ onTv: !st.onTv });
          sync();
        }),
        el('span', { class: 'story-where dim' }),
        btn('close', '✕ Close', 'Close (Esc)', () => close())
      );
      return controlsNode;
    }

    function updateControls(st, speaker) {
      if (!controlsNode) return;
      controlsNode.querySelector('.play').textContent = st.playing ? '❚❚ Pause' : '▶ Play';
      controlsNode.querySelector('.voice').textContent = st.voice ? 'Voice: on' : 'Voice: off';
      controlsNode.querySelector('.tv').textContent = st.onTv ? 'Stop showing on TV' : 'Show on TV';
      controlsNode.querySelector('.tv').classList.toggle('on', st.onTv);
      const chapters = deck.chapters();
      const ch = chapters.filter((c) => c.index <= st.index).pop();
      controlsNode.querySelector('select').value = String(ch.index);
      controlsNode.querySelector('.story-where').textContent = `${st.index + 1} / ${deck.slides.length}` +
        (st.onTv ? (speaker ? ' · TV not connected, playing here' : ' · playing on the TV') : '');
    }

    function show() {
      shown = true;
      clear(layer);
      progressFill = el('div', {});
      append(layer, el('div', { class: 'story-stage' }), el('div', { class: 'story-progress' }, progressFill), opts.controls ? buildControls() : null);
      layer.classList.remove('hidden');
      current = -1; wasSpeaker = null; narratedIndex = -1;
    }
    function hide() {
      stopNarration();
      shown = false;
      layer.classList.add('hidden');
      clear(layer);
      drawn = null;
      if (opts.onHide) opts.onHide();
    }

    function sync() {
      const st = read();
      if (!visible(st)) { if (shown) hide(); return; }
      if (!shown) show();
      const speaker = opts.isSpeaker(st);
      if (st.index !== current) { stopNarration(); current = st.index; draw(st); }
      if (speaker !== wasSpeaker) { wasSpeaker = speaker; if (!speaker) { stopNarration(); lightAll(); } }
      if (speaker && !speaking) {
        /* Play: read every step and move on. narrateOnStep: also read a step once when the host
           steps onto it by hand, without moving on afterwards. */
        if (st.playing) { narratedIndex = st.index; autoMode = true; narrate(st); }
        else if (opts.narrateOnStep && st.voice && narratedIndex !== st.index) { narratedIndex = st.index; autoMode = false; narrate(st); }
      }
      if (speaking && st.playing) autoMode = true;
      if (speaking && (!speaker || !st.voice && !st.playing || (autoMode && !st.playing))) { stopNarration(); lightAll(); }
      if (speaker && !st.playing && !speaking) lightAll();
      updateControls(st, speaker);
    }

    function openLocal(patch) { unlockSpeech(); if (patch) write(patch); open = true; sync(); }
    function close() {
      open = false;
      write({ playing: false, onTv: false });
      sync();
    }
    function isOpen() { return open; }

    root.addEventListener('storage', (e) => { if (e.key === key) sync(); });
    setInterval(sync, 400);

    if (opts.controls) {
      document.addEventListener('keydown', (e) => {
        if (!shown || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowRight') { write({ index: read().index + 1 }); sync(); }
        else if (e.key === 'ArrowLeft') { write({ index: read().index - 1 }); sync(); }
        else if (e.key === ' ') { e.preventDefault(); unlockSpeech(); write({ playing: !read().playing }); sync(); }
        else if (e.key === 'Escape') close();
      });
    }

    /* The TV page: any tap on it (the 'click once' hint) unlocks its voice too. */
    document.addEventListener('pointerdown', unlockSpeech);

    return { sync, open: openLocal, close, isOpen, isShown: () => shown };
  }

  root.BM = root.BM || {};
  root.BM.storyView = { createPlayer, read, write, KEY };
})(window);
