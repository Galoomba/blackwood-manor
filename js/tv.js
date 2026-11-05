(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;
  const audio = root.BM.audio;
  const { el, clear, append, typewrite, narrationNode, linesNode, candles, flashLightning, quoteNode, absentMessage } = root.BM.ui;
  const game = root.BM.createGame(data, logic, root.localStorage);
  const rootNode = document.getElementById('tv-root');
  const ov = document.getElementById('overlay');

  function charById(id) { return data.characters.find((c) => c.id === id); }
  function displayName(c) { const n = game.get().names[c.id]; return n ? `${c.short} (${n})` : c.name; }
  function sfx(name) { if (game.get().sound) audio.play(name); }

  /* The recorded ghost voice-over plays on the TV, unless the hosts muted it to tell it themselves. */
  const voice = root.BM.voicePlayer;
  function voiceOn() { const s = game.get(); return s.sound && s.voiceOver; }
  function playVoice(group) { if (voiceOn()) voice.play(group); }

  /* ---------- rendering ---------- */
  let renderedKey = null;
  let typedStage = null;
  let quotedStage = null;

  function viewKey(s) {
    return [s.screen, s.stageIndex, s.phase, s.screen === 'vote' ? JSON.stringify(s.votes) : '', s.sound, s.voiceOver].join('|');
  }

  function render(force) {
    const s = game.get();
    const key = viewKey(s);
    if (!force && key === renderedKey) return;
    renderedKey = key;
    const sceneNum = s.screen === 'game' ? game.stage().scene : (s.screen === 'vote' || s.screen === 'result') ? 3 : 0;
    document.body.dataset.scene = sceneNum;
    if (s.sound && sceneNum) audio.startAmbience(sceneNum); else audio.stopAmbience();
    const speaking = voice.playing();
    const allowed = /^quote-/.test(speaking || '') ? s.sound : voiceOn();
    if (speaking && (!allowed || (speaking.startsWith('stage-') && (s.screen !== 'game' || speaking !== voice.stageGroup(game.stage().id))))) voice.stop();
    clear(rootNode);
    if (s.screen === 'game') renderGame(s);
    else if (s.screen === 'vote') renderVote(s);
    else if (s.screen === 'result') renderResult(s);
    else renderTitle();
    resumeTimer();
  }

  function renderTitle() {
    append(rootNode, el('div', { class: 'tv-center' },
      el('div', { class: 'manor' }, "All Hallows' Eve"),
      el('h1', {}, 'Blackwood Manor'),
      candles()
    ));
  }

  function renderGame(s) {
    const stage = game.stage();
    const scene = data.scenes[stage.scene - 1];
    const alreadyTyped = typedStage === stage.id;
    const narr = narrationNode(stage.narration, { instant: alreadyTyped });
    const clue = el('div', { class: 'clue reveal-later' + (alreadyTyped ? ' shown' : '') }, stage.clue);
    append(rootNode,
      el('div', { class: 'tv-head' },
        el('div', { class: 'scene-label' }, `Scene ${scene.number}: ${scene.title}`),
        el('h2', {}, `${stage.id} ${stage.title}`)
      ),
      narr,
      clue,
      s.phase === 'done' && stage.announcement ? narrationNode([stage.announcement], { instant: true }) : null,
      s.phase === 'done' ? quoteNode(stage.quote) : null,
      el('div', { class: 'tv-timer' + (s.timerEnd ? '' : ' hidden') },
        el('div', { class: 'timer', id: 'timer' }, '--:--'),
        el('div', { class: 'timer-label' }, s.phase === 'search' ? (stage.searchOnly ? 'Hunt for the key' : 'Cards out') : s.phase === 'discussion' ? 'Discussion' : s.phase === 'lastwords' ? 'Last words' : '')
      )
    );
    if (s.phase === 'done' && stage.quote && quotedStage !== stage.id) {
      quotedStage = stage.id;
      sfx('whisper');
      /* Victor's announcement (ghost voice on), then the closing quote (whenever sound is on). */
      const id = stage.id.replace('.', '-');
      const quote = () => { if (game.get().sound) voice.play(`quote-${id}`); };
      if (stage.announcement && voiceOn() && voice.duration(`announce-${id}`)) voice.play(`announce-${id}`, quote);
      else quote();
    }
    if (!alreadyTyped) {
      typedStage = stage.id;
      const group = voice.stageGroup(stage.id);
      const seconds = voiceOn() ? voice.duration(group) : 0;
      typewrite(narr, seconds ? voice.typingSpeed(narr, seconds) : 28, () => clue.classList.add('shown'));
      if (seconds) voice.play(group);
    }
  }

  function renderVote(s) {
    const result = logic.tally(s.votes, data.killerIds, game.roster().present.map((c) => c.id));
    const max = Math.max(1, ...Object.values(result.counts));
    const t = el('div', { class: 'tally' });
    result.ranked.forEach(([id, n]) => {
      const c = charById(id);
      t.append(el('div', { class: 'bar' }, el('span', {}, `${c.symbol} ${displayName(c)}`), el('div', { class: 'fill', style: `width:${(n / max) * 100}%` }), el('span', {}, n)));
    });
    if (!result.ranked.length) t.append(el('p', { class: 'dim center' }, 'Name your two suspects.'));
    append(rootNode, el('div', { class: 'tv-head' }, el('div', { class: 'scene-label' }, 'The accusation'), el('h2', {}, 'Who did this?')), t);
  }

  function renderResult(s) {
    const result = logic.tally(s.votes, data.killerIds, game.roster().present.map((c) => c.id));
    append(rootNode, el('div', { class: 'tv-center' },
      el('h1', { class: 'result-title' }, result.houseWins ? data.reveal.houseWins : data.reveal.killersWin),
      el('p', { class: 'dim' }, data.reveal.farewell)
    ));
  }

  /* ---------- timer ---------- */
  let timerHandle = null;
  let lastSecond = null;
  function resumeTimer() {
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = null; lastSecond = null;
    const tick = () => {
      const t = document.getElementById('timer');
      const end = game.get().timerEnd;
      if (!t || !end) return;
      const remaining = Math.ceil((end - Date.now()) / 1000);
      const f = logic.formatRemaining(remaining);
      t.textContent = f.text;
      t.classList.toggle('urgent', f.urgent);
      t.classList.toggle('over', f.over);
      if (remaining !== lastSecond) {
        if (f.urgent) sfx('tick');
        if (remaining === 0) sfx('toll');
        lastSecond = remaining;
      }
    };
    tick();
    timerHandle = setInterval(tick, 250);
  }

  /* ---------- set pieces, reveal, soundboard ---------- */
  let shownSetPiece = null;
  let shownReveal = null;
  let shownSfx = null;
  let shownCue = null;
  let shownAbsent = null;
  let absentShowing = false;

  /* The host pressed an absent guest's clue: a bell, their portrait and words, then their voice. */
  function showAbsent(call) {
    const c = charById(call.characterId);
    if (!c) return;
    clear(ov);
    ov.className = 'overlay ghostly absent';
    absentShowing = true;
    ov.append(absentMessage(c, call.text));
    sfx('bell');
    const at = call.at;
    const close = () => { if (shownAbsent === at && absentShowing) { absentShowing = false; ov.classList.add('hidden'); clear(ov); } };
    setTimeout(() => {
      if (shownAbsent !== at) return;
      if (!(voiceOn() && voice.play(call.group, () => setTimeout(close, 2500)))) setTimeout(close, 20000);
    }, 1400);
  }

  function syncOverlays() {
    const s = game.get();
    const sp = s.setPiece;
    const ac = s.absentCall;
    if (ac && ac.at !== shownAbsent) { shownAbsent = ac.at; if (Date.now() - ac.at < 15000 && !sp) showAbsent(ac); }
    if (!ac && absentShowing) { absentShowing = false; shownAbsent = null; if ((voice.playing() || '').startsWith('absent-')) voice.stop(); ov.classList.add('hidden'); clear(ov); }
    if (sp && sp.at !== shownSetPiece) { absentShowing = false; shownSetPiece = sp.at; showSetPiece(sp.key); }
    if (!sp && !s.revealAt && !absentShowing && !ov.classList.contains('hidden')) { ov.classList.add('hidden'); clear(ov); }
    const speaking = voice.playing();
    if (speaking && ((speaking.startsWith('set-') && !sp) || (speaking === 'reveal' && !s.revealAt))) voice.stop();
    if (s.voiceCue && s.voiceCue.at !== shownCue) { shownCue = s.voiceCue.at; if (Date.now() - s.voiceCue.at < 5000) playVoice(s.voiceCue.group); }
    if (!sp) shownSetPiece = null;
    if (s.revealAt && s.revealAt !== shownReveal) { shownReveal = s.revealAt; playReveal(); }
    if (!s.revealAt) shownReveal = null;
    if (s.sfx && s.sfx.at !== shownSfx) {
      shownSfx = s.sfx.at;
      if (Date.now() - s.sfx.at < 5000) {
        if (s.sfx.name === 'lightning') { flashLightning(); sfx('thunder'); } else sfx(s.sfx.name);
      }
    }
  }

  function showSetPiece(key) {
    const sp = data.setPieces[key];
    clear(ov);
    ov.className = 'overlay';
    const lines = linesNode(sp.lines, { hideDirections: true });
    if (root.BM.interlude.has(key)) {
      const at = shownSetPiece;
      root.BM.interlude.play(ov, key, { lines, sfx, alive: () => shownSetPiece === at, onReady: () => {}, voice: () => playVoice(`set-${key}`) });
    } else if (key === 'victorReturns') {
      ov.classList.add('ghostly');
      sfx('ghost');
      ov.append(el('div', {}, el('div', { class: 'ghost-shape' }), el('div', { class: 'ghost-shape violet' })), el('h1', {}, 'Victor returns'), el('h2', {}, 'Two murders, two teams'), lines, el('div', { class: 'team-call' }, ...['delilah', 'victor'].map((t) => el('div', {}, el('h3', {}, t === 'delilah' ? 'Team Delilah' : 'Team Victor'), el('p', {}, game.roster().teams[t].map((c) => `${c.symbol} ${displayName(c)}`).join(' · '))))));
      setTimeout(() => { if (shownSetPiece) playVoice('set-victorReturns'); }, 1500);
    } else if (key === 'lastLetter') {
      ov.classList.add('ghostly');
      sfx('whisper');
      ov.append(el('div', { class: 'ghost-shape' }), el('h1', {}, sp.title), el('h2', {}, 'To be opened if I die tonight'), lines);
      setTimeout(() => { if (shownSetPiece) playVoice('set-lastLetter'); }, 1500);
    } else if (key === 'sheIsDead') {
      ov.classList.add('blackout');
      sfx('toll');
      ov.append(el('h1', {}, 'She is dead'), el('h2', {}, 'Scene 1: The Toast'), lines);
      setTimeout(() => { if (shownSetPiece) playVoice('set-sheIsDead'); }, 1500);
    } else {
      ov.classList.add('ghostly');
      ov.append(el('h1', {}, sp.title), lines);
      setTimeout(() => { if (shownSetPiece) playVoice(`set-${key}`); }, 1500);
    }
  }

  function playReveal() {
    clear(ov);
    ov.className = 'overlay blackout';
    const c = candles();
    ov.append(c);
    [0, 1, 2].forEach((i) => setTimeout(() => { c.children[i].style.visibility = 'hidden'; sfx('puff'); }, 1200 + i * 1100));
    setTimeout(() => sfx('heartbeat'), 4600);
    setTimeout(() => {
      if (!shownReveal) return;
      clear(ov);
      const portraits = el('div', { class: 'reveal-portraits' });
      data.killerIds.forEach((id) => portraits.append(el('img', { src: charById(id).image, alt: charById(id).name })));
      ov.append(el('h1', {}, data.killerIds.map((id) => charById(id).name).join(' & ')), portraits, linesNode(data.reveal.lines));
      sfx('ghost');
      setTimeout(() => { if (shownReveal) playVoice('reveal'); }, 1200);
    }, 8600);
  }

  /* ---------- sync with the host window ---------- */
  function sync() {
    if (game.reload()) { render(); syncOverlays(); }
  }
  window.addEventListener('storage', sync);
  setInterval(sync, 500);
  setInterval(() => game.markTvSeen(), 2000);
  game.markTvSeen();

  /* ---------- fullscreen and audio unlock ---------- */
  const hint = document.getElementById('tv-hint');
  const unlock = () => { voice.unlock(); audio.init(); audio.setEnabled(game.get().sound); hint.classList.add('fade'); render(true); };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
    }
  });
  document.addEventListener('dblclick', () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); });

  /* ---------- the full story, when the host shows it on the TV ---------- */
  const story = root.BM.storyView.createPlayer({
    layer: document.getElementById('story-layer'),
    controls: false,
    isVisible: (st) => st.onTv,
    isSpeaker: (st) => st.onTv,
    soundOn: () => game.get().sound,
    onHide: () => render(true)
  });

  const intro = root.BM.storyView.createPlayer({
    deck: root.BM.intro,
    key: 'blackwood-manor-intro-v1',
    presentIds: () => game.get().presentIds,
    narrateOnStep: true,
    layer: document.getElementById('intro-layer'),
    controls: false,
    isVisible: (st) => st.onTv,
    isSpeaker: (st) => st.onTv,
    soundOn: () => game.get().sound,
    onHide: () => render(true)
  });

  audio.setEnabled(game.get().sound);
  render(true);
  syncOverlays();
  story.sync();
  intro.sync();
})(window);
