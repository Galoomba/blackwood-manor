(function (root) {
  const data = root.BM.data;
  const logic = root.BM.logic;
  const audio = root.BM.audio;
  const { el, clear, append, typewrite, narrationNode, linesNode, candles, flashLightning } = root.BM.ui;
  const game = root.BM.createGame(data, logic, root.localStorage);

  const $ = (sel) => document.querySelector(sel);
  function charById(id) { return data.characters.find((c) => c.id === id); }
  function displayName(c) { const n = game.get().names[c.id]; return n ? `${c.short} (${n})` : c.name; }
  function teamLabel(team) { return team === 'delilah' ? 'Team Delilah' : 'Team Victor'; }

  /* Sound plays here only when no TV window is open; the TV window plays it otherwise. */
  function localSoundOn() { return game.get().sound && !game.tvConnected(); }
  function sfx(name) { if (localSoundOn()) audio.play(name); }

  /* ---------- ghost voice-over (recorded; plays on the TV window when one is open) ---------- */
  const voice = root.BM.voicePlayer;
  function hostVoiceOn() { return localSoundOn() && game.get().voiceOver; }
  function toggleVoice() {
    const on = !game.get().voiceOver;
    game.set({ voiceOver: on });
    if (!on) voice.stop();
    render();
  }
  /* Replay is sent through the state so the TV plays it; here only when no TV is open. */
  function cueVoice(group) {
    voice.unlock();
    game.set({ voiceCue: { group, at: Date.now() } });
    if (hostVoiceOn()) voice.play(group);
  }
  function voiceControls(group) {
    const on = game.get().voiceOver;
    const recorded = voice.duration(group) > 0;
    const row = el('div', { class: 'row voice-row' },
      el('button', { class: 'small voice-toggle' + (on ? '' : ' muted'), title: 'Mute the recorded ghost voices to tell the story yourselves', onclick: () => { toggleVoice(); if (row.isConnected) row.replaceWith(voiceControls(group)); } },
        on ? '🔊 Ghost voice-over: on' : '🔇 Ghost voice-over: muted'),
      on && recorded ? el('button', { class: 'small', onclick: () => cueVoice(group) }, '↻ Replay voice-over') : null);
    return row;
  }

  /* ---------- the full story theatre ---------- */
  const story = root.BM.storyView.createPlayer({
    layer: document.getElementById('story-layer'),
    controls: true,
    isSpeaker: (st) => !(st.onTv && game.tvConnected()),
    soundOn: () => game.get().sound,
    confirmTv: () => game.get().screen === 'result' || confirm('This shows the whole solution, both killers included, on the TV. Show it now?'),
    onHide: () => render()
  });
  function openStory() { audio.init(); story.open(); }

  /* ---------- introduce the game to the group (spoiler-free; goes to the TV when one is open) ---------- */
  const intro = root.BM.storyView.createPlayer({
    deck: root.BM.intro,
    key: 'blackwood-manor-intro-v1',
    narrateOnStep: true,
    layer: document.getElementById('intro-layer'),
    controls: true,
    isSpeaker: (st) => !(st.onTv && game.tvConnected()),
    soundOn: () => game.get().sound,
    onHide: () => render(),
    finalAction: { label: 'Go to the home screen', run: () => show('title') }
  });
  function openIntro() { audio.init(); intro.open({ index: 0, playing: false, onTv: game.tvConnected() }); }
  function introButton(cls) { return el('button', { class: cls, onclick: openIntro, title: 'Walk the group through how the night works, step by step, on the TV' }, 'Introduce the game'); }
  function storyButton(cls, label) { return el('button', { class: cls, onclick: openStory, title: 'Every secret, told from the cellar to the reveal, with narration' }, label || 'The full story'); }

  /* ---------- navigation ---------- */
  function show(screen) { game.set({ screen }); render(); }

  function render() {
    const s = game.get();
    document.querySelectorAll('.screen').forEach((x) => x.classList.remove('active'));
    $('#screen-' + s.screen).classList.add('active');
    const sceneNum = s.screen === 'game' ? game.stage().scene : (s.screen === 'vote' || s.screen === 'result') ? 3 : 0;
    document.body.dataset.scene = sceneNum;
    if (!story.isShown() && !intro.isShown()) { if (localSoundOn() && sceneNum) audio.startAmbience(sceneNum); else audio.stopAmbience(); }
    const speaking = voice.playing();
    if (speaking && (!hostVoiceOn() || (speaking.startsWith('stage-') && (s.screen !== 'game' || speaking !== voice.stageGroup(game.stage().id))))) voice.stop();
    ({ title: renderTitle, setup: renderSetup, print: renderPrint, game: renderGame, vote: renderVote, result: renderResult })[s.screen]();
    window.scrollTo(0, 0);
  }

  function tvBar() {
    const connected = game.tvConnected();
    return el('div', { class: 'tvbar' },
      el('span', { class: 'tvdot' + (connected ? ' on' : '') }),
      el('span', { class: 'dim' }, connected ? 'TV screen connected. Sound plays on the TV window.' : 'No TV screen open. Sound plays here.'),
      el('button', { class: 'small', onclick: () => root.open('tv.html', 'blackwood-tv') }, 'Open TV screen')
    );
  }

  /* ---------- title ---------- */
  function renderTitle() {
    const s = game.get();
    const node = clear($('#screen-title'));
    append(node, 
      el('div', { class: 'manor' }, "All Hallows' Eve"),
      el('h1', {}, 'Blackwood Manor'),
      el('p', { class: 'dim' }, 'A murder night in three scenes'),
      candles(),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'primary', onclick: () => { audio.init(); show('setup'); } }, 'Enter the manor'),
        introButton('ghostly'),
        (s.prologueDone || s.stageIndex > 0) && el('button', { class: 'ghostly', onclick: () => { audio.init(); show('game'); } }, 'Resume the night'),
        storyButton('ghostly', 'The full story (spoilers)')
      )
    );
  }

  /* ---------- setup ---------- */
  function renderSetup() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-setup'));
    const grid = el('div', { class: 'roster' });
    for (const c of data.characters) {
      const on = s.presentIds.includes(c.id);
      const locked = data.requiredIds.includes(c.id);
      const toggle = () => { if (!locked) { game.togglePresent(c.id); renderSetup(); } };
      grid.append(el('div', { class: 'char-card' + (on ? ' on' : '') },
        el('span', { class: 'sym' }, c.symbol),
        el('img', { src: c.image, alt: c.name, onclick: toggle }),
        el('div', { class: 'cname', onclick: toggle }, c.name),
        el('input', { type: 'text', placeholder: 'Played by…', value: s.names[c.id] || '',
          oninput: (e) => { const names = Object.assign({}, game.get().names, { [c.id]: e.target.value }); game.set({ names }); } })
      ));
    }
    append(node, 
      el('h2', {}, 'Who is in the house tonight?'),
      el('p', { class: 'dim' }, 'Tap a portrait to add or remove a guest. A few characters are essential to the story and stay on. Type the real name of the player under each portrait if you want it on the vote screen.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' },
        el('h3', {}, 'Timers, sound and the TV'),
        el('div', { class: 'row' },
          el('label', { class: 'grow' }, 'Card time, minutes', el('input', { type: 'number', min: 1, max: 30, value: s.searchMin, onchange: (e) => game.set({ searchMin: Number(e.target.value) || 3 }) })),
          el('label', { class: 'grow' }, 'Key hunt (3.4), minutes', el('input', { type: 'number', min: 1, max: 30, value: s.huntMin || 10, onchange: (e) => game.set({ huntMin: Number(e.target.value) || 10 }) })),
          el('label', { class: 'grow' }, 'Discussion minutes', el('input', { type: 'number', min: 1, max: 30, value: s.discussMin, onchange: (e) => game.set({ discussMin: Number(e.target.value) || 7 }) })),
          el('label', {}, el('input', { type: 'checkbox', checked: s.sound ? 'checked' : null, onchange: (e) => { game.set({ sound: e.target.checked }); audio.setEnabled(e.target.checked); } }), ' Sound on'),
          el('label', { title: 'Recorded ghost voices read the narration. Turn off to tell the story yourselves.' }, el('input', { type: 'checkbox', checked: s.voiceOver ? 'checked' : null, onchange: (e) => { game.set({ voiceOver: e.target.checked }); if (!e.target.checked) voice.stop(); } }), ' Ghost voice-over')
        ),
        el('p', { class: 'dim', style: 'margin-top:12px' }, 'Two screens: press "Open TV screen", drag that window onto the TV and press F for fullscreen. It shows only what the room may see and follows this window automatically.'),
        tvBar()
      ),
      roster.errors.length ? el('p', { class: 'error' }, roster.errors.join(' ')) : null,
      roster.present.length < 6 ? el('p', { class: 'error' }, 'Fewer than six guests: the mystery will be thin. Consider adding characters.') : null,
      el('div', { class: 'row' },
        el('button', { onclick: () => show('print') }, 'Print pack'),
        introButton(''),
        storyButton('', 'The full story'),
        el('button', { class: 'primary', disabled: roster.errors.length ? 'disabled' : null, onclick: () => beginNight() }, s.prologueDone ? 'Return to the game' : 'Begin the night'),
        el('button', { class: 'small', onclick: () => { if (confirm('Forget this night and start over?')) { game.reset(); show('title'); } } }, 'Reset everything')
      )
    );
  }

  function beginNight() {
    audio.init();
    if (!game.get().prologueDone) {
      showSetPiece('prologue', () => showSetPiece('sheIsDead', () => { game.set({ prologueDone: true }); show('game'); }));
    } else show('game');
  }

  /* ---------- print ---------- */
  function renderPrint() {
    const node = clear($('#screen-print'));
    const list = el('div', { class: 'row' });
    for (const c of data.characters) list.append(el('button', { class: 'small', onclick: () => root.BM.print.open('character', c.id, game.roster()) }, `${c.symbol} ${c.short}`));
    append(node, 
      el('h2', {}, 'Print pack'),
      el('p', { class: 'dim' }, 'Each button opens the browser print dialog. Choose "Save as PDF" or print directly. Use A4, portrait, default margins, background graphics off. Set who is present first: the character packs leave out whispers and table talk about absent guests. "Print everything" prints the whole pack in one go (about 75 pages): run sheet, host guide, the box, team envelopes, ledger strips, covers, then the character packs. Envelope covers: one per guest with their portrait, plus four pictures for the team stages; glue each on a C5 envelope and lay them all on the table.'),
      el('div', { class: 'panel' },
        el('div', { class: 'row' },
          el('button', { class: 'primary', onclick: () => root.BM.print.open('everything', null, game.roster()) }, 'Print everything'),
          el('button', { onclick: () => root.BM.print.open('all', null, game.roster()) }, 'All character packs'),
          el('button', { onclick: () => root.BM.print.open('covers') }, 'Envelope covers'),
          el('button', { onclick: () => root.BM.print.open('envelopes') }, 'Team envelopes and witness cards'),
          el('button', { onclick: () => root.BM.print.open('ledger') }, 'Ledger strips'),
          el('button', { onclick: () => root.BM.print.open('box') }, "The box: Delilah's letter"),
          el('button', { onclick: () => root.BM.print.open('runsheet') }, 'Host run sheet'),
          el('button', { onclick: () => root.BM.print.open('guide', null, game.roster()) }, 'Host guide')
        )
      ),
      el('div', { class: 'panel' }, el('h3', {}, 'One character'), list),
      el('button', { onclick: () => show('setup') }, 'Back')
    );
  }

  /* ---------- game ---------- */
  let typedKey = null;

  function renderGame() {
    const s = game.get();
    const stage = game.stage();
    const scene = data.scenes[stage.scene - 1];
    const roster = game.roster();
    const node = clear($('#screen-game'));

    const progress = el('div', { class: 'progress' });
    data.stages.forEach((st, i) => progress.append(el('div', {
      class: 'step' + (i < s.stageIndex ? ' done' : i === s.stageIndex ? ' current' : ''), title: `${st.id} ${st.title}`,
      onclick: () => { stopTimer(); game.set({ stageIndex: i, phase: 'narration', timerEnd: null, timerKind: null }); render(); }
    })));

    const narr = narrationNode(stage.narration);
    const header = el('div', { class: 'panel' },
      tvBar(),
      voiceControls(voice.stageGroup(stage.id)),
      el('div', { class: 'scene-label' }, `Scene ${scene.number}: ${scene.title}`),
      el('h2', {}, `${stage.id} ${stage.title}`, el('span', { class: 'kind' }, stage.kind === 'team' ? 'Team' : stage.kind === 'group' ? 'Find alone, solve together' : 'Individual')),
      stage.setPieceBefore ? el('div', { class: 'row', style: 'margin-bottom:12px' }, el('button', { class: 'ghostly small', onclick: () => showSetPiece(stage.setPieceBefore, () => render()) }, '↻ Replay: Victor returns')) : null,
      narr,
      el('div', { class: 'clue' }, stage.clue)
    );

    const phasePanel = el('div', { class: 'panel' });
    buildPhasePanel(phasePanel, stage, s);

    append(node, progress, header, phasePanel, buildHostPanel(stage, s, roster), buildSoundboard(),
      el('div', { class: 'row' },
        el('button', { class: 'small', onclick: () => { stopTimer(); game.prevStage(); render(); } }, '◀ Previous stage'),
        el('button', { class: 'small', onclick: () => show('setup') }, 'Setup'),
        el('button', { class: 'small', onclick: () => show('vote') }, 'Go to vote'),
        storyButton('small', 'Full story')
      )
    );

    if (typedKey !== stage.id) {
      typedKey = stage.id;
      const group = voice.stageGroup(stage.id);
      const seconds = hostVoiceOn() ? voice.duration(group) : 0;
      typewrite(narr, seconds ? voice.typingSpeed(narr, seconds) : undefined);
      if (seconds) voice.play(group);
    }
    else narr.querySelectorAll('.typed').forEach((p) => p.classList.add('finished'));
    resumeTimerIfRunning();
  }

  function buildPhasePanel(panel, stage, s) {
    clear(panel);
    const timerEl = el('div', { class: 'timer', id: 'timer' }, '--:--');
    const label = el('div', { class: 'timer-label', id: 'timer-label' }, '');
    const bar = el('div', { class: 'phase-bar' });

    if (s.phase === 'narration') {
      label.textContent = (s.voiceOver ? 'Let the ghost speak, then ' : 'Read the narration aloud, then ') + (stage.searchOnly ? 'start the key hunt' : 'send them to their envelopes');
      bar.append(el('button', { class: 'primary', onclick: () => startPhase('search') }, `${stage.searchOnly ? 'Start the key hunt' : 'Cards out'} (${stage.searchOnly ? (s.huntMin || 10) : s.searchMin} min)`));
    } else if (s.phase === 'search') {
      label.textContent = stage.searchOnly ? 'Hunting for the key' : 'Reading cards';
      bar.append(
        stage.searchOnly
          ? el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); } }, 'End the hunt')
          : el('button', { class: 'primary', onclick: () => startPhase('discussion') }, `Start discussion (${s.discussMin} min)`),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
    } else if (s.phase === 'discussion') {
      label.textContent = 'Discussion';
      bar.append(
        el('button', { class: 'primary', onclick: () => { stopTimer(); game.set({ phase: 'done', timerEnd: null, timerKind: null }); render(); if (stage.announcement && game.get().voiceOver) cueVoice(`announce-${stage.id.replace('.', '-')}`); } }, 'End discussion'),
        el('button', { class: 'small', onclick: () => addMinute() }, '+1 min')
      );
    } else {
      label.textContent = 'Stage complete';
      if (stage.announcement) panel.append(narrationNode([stage.announcement], { instant: true }), voiceControls(`announce-${stage.id.replace('.', '-')}`));
      if (stage.setPieceAfter) {
        bar.append(el('button', { class: 'primary', onclick: () => playInterlude(stage.setPieceAfter) }, `▶ ${data.setPieces[stage.setPieceAfter].cue}`));
        if (stage.searchOnly) bar.append(el('button', { onclick: () => show('vote') }, 'The box stays shut: open the vote'));
      } else if (game.get().stageIndex === data.stages.length - 1) {
        bar.append(el('button', { class: 'primary', onclick: () => show('vote') }, 'Open the vote'));
      } else {
        bar.append(el('button', { class: 'primary', onclick: () => { game.nextStage(); render(); } }, 'Next stage ▶'));
      }
    }
    panel.append(timerEl, label, bar);
  }

  /* ---------- timers ---------- */
  let timerHandle = null;
  let lastSecond = null;

  function startPhase(kind) {
    const s = game.get();
    const minutes = kind === 'search' ? (game.stage().searchOnly ? (s.huntMin || 10) : s.searchMin) : s.discussMin;
    game.set({ phase: kind, timerKind: kind, timerEnd: Date.now() + minutes * 60000 });
    render();
  }
  function addMinute() { const s = game.get(); if (s.timerEnd) game.set({ timerEnd: s.timerEnd + 60000 }); }
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; lastSecond = null; }
  function resumeTimerIfRunning() {
    stopTimer();
    const s = game.get();
    if (!s.timerEnd) return;
    const tick = () => {
      const t = $('#timer'); if (!t) return stopTimer();
      const remaining = Math.ceil((game.get().timerEnd - Date.now()) / 1000);
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

  /* ---------- host panel ---------- */
  function buildHostPanel(stage, s, roster) {
    const idx = s.stageIndex;
    const details = el('details', { class: 'host' }, el('summary', {}, 'Host only: answer key for this stage'));
    details.append(el('p', {}, stage.hostNotes));

    if (stage.id === '3.1' || stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const ts = logic.teamSentence(data, roster, team, stage.id);
        details.append(el('p', {}, el('strong', {}, `${teamLabel(team)}: `), `${ts.sentence} → the ${ts.picture} envelope (${data.teamEnvelopes[team][stage.id].title})`,
          ts.missing.length ? el('span', { class: 'dim' }, ` (ghost whispers: ${ts.missing.map((w) => `#${w.index} ${w.text}`).join(', ')})`) : null));
      }
      if (stage.id === '3.1') details.append(el('p', { class: 'dim' }, "Killers' wrong words: Zora says TALKS for WALKS; Krank says DRINKS for BLINKS."));
    }
    if (stage.id === '3.2') {
      for (const team of ['delilah', 'victor']) {
        const w = data.witnessCards[team];
        details.append(el('p', {}, el('strong', {}, `Witness card, ${teamLabel(team)} (read by ${charById(w.reader).short}): `), w.text));
      }
    }
    if (stage.id === '2.3') {
      const ol = el('ol', {});
      data.ledger.forEach((strip) => ol.append(el('li', {}, el('strong', {}, `${charById(strip.holder).short}: `), strip.text)));
      details.append(el('h3', {}, 'The ledger in order'), ol);
    }
    if (stage.id === '3.3') {
      const ul = el('ul', {});
      roster.present.forEach((c) => ul.append(el('li', {}, el('strong', {}, c.short + ': '), c.cards['3.3'].alibi, c.cards['3.3'].lie ? el('em', { class: 'error' }, ` LIE: ${c.cards['3.3'].lie}`) : null)));
      details.append(el('h3', {}, 'Alibis'), ul);
    }

    if (stage.id === '3.4') {
      details.append(el('p', {}, el('strong', {}, 'True key: '), `${data.box.hidingPlace}. ${data.box.rule}`));
      const ul = el('ul', {});
      data.killerIds.map(charById).forEach((c) => ul.append(el('li', {}, el('strong', {}, c.short + ': '), c.cards['3.4'].sabotage)));
      details.append(el('h3', {}, "The killers' tricks"), ul);
    }

    const talkList = el('ul', {});
    roster.present.forEach((c) => {
      const t = logic.talkFor(c.cards[stage.id], roster.present.map((p) => p.id));
      if (t) talkList.append(el('li', {}, el('strong', {}, c.short + ': '), t.text));
    });
    details.append(el('details', {}, el('summary', {}, 'Table talk on the cards this stage (nudge anyone who stays quiet)'), talkList));

    const orphans = logic.orphanedClues(data, roster, stage.id);
    if (orphans.length) {
      details.append(el('h3', {}, 'Absent guests: the ghost delivers these'));
      orphans.forEach((o) => details.append(el('div', { class: 'orphan' }, el('strong', {}, `${o.symbol} ${o.name} (${o.kind}${o.number ? ' ' + o.number : ''}${o.index ? ' word #' + o.index : ''}): `), o.text)));
    }
    return el('div', { class: 'panel' }, details);
  }

  function buildSoundboard() {
    const board = el('div', { class: 'soundboard' });
    for (const name of audio.names) board.append(el('button', { class: 'small', onclick: () => triggerSound(name) }, name));
    board.append(el('button', { class: 'small', onclick: () => triggerSound('lightning') }, 'lightning'));
    return el('div', { class: 'panel' }, el('details', { class: 'host' }, el('summary', {}, 'Soundboard (plays on the TV window when it is open)'), board));
  }

  /* A soundboard press is broadcast through state so the TV window plays it; locally only if no TV. */
  function triggerSound(name) {
    game.set({ sfx: { name, at: Date.now() } });
    if (name === 'lightning') { flashLightning(); sfx('thunder'); }
    else sfx(name);
  }

  /* ---------- set pieces (mirrored on the TV through state.setPiece) ---------- */
  /* Between scenes: the set piece after a stage, then any it leads into, then the next stage. */
  function playInterlude(key) {
    showSetPiece(key, () => {
      const next = data.setPieces[key].then;
      if (next) playInterlude(next);
      else if (game.get().stageIndex === data.stages.length - 1) show('vote');
      else { game.nextStage(); render(); }
    });
  }

  const INTERLUDE_BUTTON = { lightsOut: 'The ghost speaks', twoGhosts: 'Victor speaks' };
  const INTERLUDE_CUE = { lightsOut: 'Victor: fall now', twoGhosts: 'Victor: rise and stand beside Delilah' };

  function showSetPiece(key, onDone) {
    const sp = data.setPieces[key];
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay';
    const at = Date.now();
    game.set({ setPiece: { key, at } });
    const lines = linesNode(sp.lines);
    const done = () => { if ((voice.playing() || '').startsWith('set-')) voice.stop(); ov.classList.add('hidden'); clear(ov); game.set({ setPiece: null }); if (onDone) onDone(); };
    const continueBtn = (label) => el('button', { class: 'primary', style: 'margin-top:24px', onclick: done }, label || 'Continue');

    if (root.BM.interlude.has(key)) {
      root.BM.interlude.play(ov, key, {
        lines, sfx, cue: INTERLUDE_CUE[key],
        alive: () => (game.get().setPiece || {}).at === at,
        onReady: () => ov.append(voiceControls(`set-${key}`), continueBtn(INTERLUDE_BUTTON[key])),
        voice: () => { if (hostVoiceOn()) voice.play(`set-${key}`); }
      });
    } else if (key === 'victorReturns') {
      ov.classList.add('ghostly');
      sfx('ghost');
      ov.append(el('div', {}, el('div', { class: 'ghost-shape' }), el('div', { class: 'ghost-shape violet' })), el('h1', {}, 'Victor returns'), el('h2', {}, 'Two murders, two teams'), lines, voiceControls('set-victorReturns'), continueBtn('Form the teams'));
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play('set-victorReturns'); }, 1500);
    } else if (key === 'lastLetter') {
      ov.classList.add('ghostly');
      sfx('whisper');
      ov.append(el('div', { class: 'ghost-shape' }), el('h1', {}, sp.title), el('h2', {}, 'To be opened if I die tonight'), lines, voiceControls('set-lastLetter'), continueBtn('Open the vote'));
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play('set-lastLetter'); }, 1500);
    } else if (key === 'sheIsDead') {
      ov.classList.add('blackout');
      sfx('toll');
      ov.append(el('h1', {}, 'She is dead'), el('h2', {}, 'Scene 1: The Toast'), lines, voiceControls('set-sheIsDead'), continueBtn('Begin Scene 1'));
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play('set-sheIsDead'); }, 1500);
    } else {
      ov.classList.add('ghostly');
      ov.append(el('h1', {}, sp.title), lines, voice.duration(`set-${key}`) ? voiceControls(`set-${key}`) : null, continueBtn(key === 'prologue' ? 'She is dead' : 'Continue'));
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play(`set-${key}`); }, 1500);
    }
  }

  /* ---------- vote ---------- */
  function renderVote() {
    const s = game.get();
    const roster = game.roster();
    const node = clear($('#screen-vote'));
    const grid = el('div', { class: 'vote-grid' });
    const options = (sel) => {
      const sl = el('select', {}, el('option', { value: '' }, '— choose —'));
      roster.present.forEach((c) => sl.append(el('option', { value: c.id, selected: sel === c.id ? 'selected' : null }, `${c.symbol} ${displayName(c)}`)));
      return sl;
    };
    roster.present.forEach((v) => {
      const picks = s.votes[v.id] || ['', ''];
      const s1 = options(picks[0]); const s2 = options(picks[1]);
      const save = () => { const votes = Object.assign({}, game.get().votes, { [v.id]: [s1.value, s2.value] }); game.set({ votes }); renderTally(); };
      s1.addEventListener('change', save); s2.addEventListener('change', save);
      grid.append(el('div', { class: 'voter' }, el('strong', {}, `${v.symbol} ${displayName(v)}`), el('div', { class: 'dim' }, 'accuses'), s1, s2));
    });
    append(node, 
      tvBar(),
      el('h2', {}, 'The accusation'),
      el('p', { class: 'dim' }, 'Every guest names two suspects. The house wins only if both killers are the two most accused. The TV shows the tally as you enter it.'),
      el('div', { class: 'panel' }, grid),
      el('div', { class: 'panel' }, el('h3', {}, 'Tally'), el('div', { class: 'tally', id: 'tally' })),
      el('div', { class: 'row' },
        el('button', { class: 'primary', onclick: () => playReveal() }, '▶ Reveal the killers'),
        el('button', { class: 'small', onclick: () => show('game') }, 'Back to the game')
      )
    );
    renderTally();
  }

  function renderTally() {
    const t = $('#tally'); if (!t) return;
    clear(t);
    const result = logic.tally(game.get().votes, data.killerIds);
    const max = Math.max(1, ...Object.values(result.counts));
    result.ranked.forEach(([id, n]) => {
      const c = charById(id);
      t.append(el('div', { class: 'bar' }, el('span', {}, `${c.symbol} ${c.short}`), el('div', { class: 'fill', style: `width:${(n / max) * 100}%` }), el('span', {}, n)));
    });
    if (!result.ranked.length) t.append(el('p', { class: 'dim' }, 'No accusations yet.'));
  }

  function playReveal() {
    const result = logic.tally(game.get().votes, data.killerIds);
    game.set({ revealAt: Date.now() });
    const ov = $('#overlay');
    clear(ov);
    ov.className = 'overlay blackout';
    const c = candles();
    ov.append(c);
    [0, 1, 2].forEach((i) => setTimeout(() => { c.children[i].style.visibility = 'hidden'; sfx('puff'); }, 1200 + i * 1100));
    setTimeout(() => sfx('heartbeat'), 4600);
    setTimeout(() => {
      clear(ov);
      const portraits = el('div', { class: 'reveal-portraits' });
      data.killerIds.forEach((id) => portraits.append(el('img', { src: charById(id).image, alt: charById(id).name })));
      ov.append(el('h1', {}, data.killerIds.map((id) => charById(id).name).join(' & ')), portraits, linesNode(data.reveal.lines), voiceControls('reveal'),
        el('button', { class: 'primary', style: 'margin-top:24px', onclick: () => { voice.stop(); ov.classList.add('hidden'); clear(ov); game.set({ revealAt: null }); show('result'); } }, result.houseWins ? 'The house wins' : 'The killers walk free'));
      sfx('ghost');
      setTimeout(() => { if (!ov.classList.contains('hidden') && hostVoiceOn()) voice.play('reveal'); }, 1200);
    }, 8600);
  }

  function renderResult() {
    const result = logic.tally(game.get().votes, data.killerIds);
    const node = clear($('#screen-result'));
    append(node, 
      el('h1', { class: 'result-title center' }, result.houseWins ? data.reveal.houseWins : data.reveal.killersWin),
      el('div', { class: 'panel' }, el('h3', {}, 'Final tally'), el('div', { class: 'tally', id: 'tally' })),
      el('p', { class: 'center dim' }, data.reveal.farewell),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { onclick: () => show('vote') }, 'Back to the vote'),
        storyButton('primary', 'Tell the whole story'),
        el('button', { onclick: () => { if (confirm('Start a brand new night? This clears the roster and votes.')) { game.reset(); show('title'); } } }, 'New night')
      )
    );
    renderTally();
  }

  /* ---------- boot ---------- */
  audio.setEnabled(game.get().sound);
  document.addEventListener('pointerdown', () => { audio.init(); voice.unlock(); }, { once: true });
  /* Keep the TV indicator fresh and hand ambience over when a TV window appears or disappears. */
  let tvWas = game.tvConnected();
  setInterval(() => {
    const now = game.tvConnected();
    if (now !== tvWas) { tvWas = now; render(); }
  }, 2000);
  render();
})(window);
