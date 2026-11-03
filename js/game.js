(function (root) {
  const KEY = 'blackwood-manor-state-v1';
  const TV_KEY = 'blackwood-manor-tv-seen';
  const TV_TIMEOUT = 6000;

  function createGame(data, logic, storage) {
    const defaults = () => ({
      screen: 'title',
      presentIds: data.characters.filter((c) => !c.optional).map((c) => c.id),
      names: {},
      searchMin: 5,
      discussMin: 7,
      sound: true,
      stageIndex: 0,
      phase: 'narration',
      timerEnd: null,
      timerKind: null,
      prologueDone: false,
      votes: {},
      setPiece: null,
      revealAt: null
    });

    let lastRaw = null;
    let state = load();

    function readRaw() { try { return storage.getItem(KEY); } catch (e) { return null; } }
    function load() {
      const raw = readRaw();
      lastRaw = raw;
      try {
        if (raw) return Object.assign(defaults(), JSON.parse(raw));
      } catch (e) { /* corrupt storage: start fresh */ }
      return defaults();
    }
    function save() { try { lastRaw = JSON.stringify(state); storage.setItem(KEY, lastRaw); } catch (e) { /* ignore */ } }
    function reload() {
      const raw = readRaw();
      if (raw === lastRaw) return false;
      state = load();
      return true;
    }
    function markTvSeen(now) { try { storage.setItem(TV_KEY, String(now || Date.now())); } catch (e) { /* ignore */ } }
    function tvConnected(now) {
      try {
        const seen = Number(storage.getItem(TV_KEY) || 0);
        return (now || Date.now()) - seen < TV_TIMEOUT;
      } catch (e) { return false; }
    }
    function get() { return state; }
    function set(patch) { Object.assign(state, patch); save(); return state; }
    function reset() { state = defaults(); save(); return state; }
    function roster() { return logic.buildRoster(data, { presentIds: state.presentIds }); }
    function stage() { return data.stages[state.stageIndex]; }
    function nextStage() {
      if (state.stageIndex < data.stages.length - 1) set({ stageIndex: state.stageIndex + 1, phase: 'narration', timerEnd: null, timerKind: null });
    }
    function prevStage() {
      if (state.stageIndex > 0) set({ stageIndex: state.stageIndex - 1, phase: 'narration', timerEnd: null, timerKind: null });
    }
    function togglePresent(id) {
      const ids = new Set(state.presentIds);
      if (ids.has(id)) ids.delete(id); else ids.add(id);
      set({ presentIds: data.characters.map((c) => c.id).filter((x) => ids.has(x)) });
    }

    return { get, set, reset, reload, roster, stage, nextStage, prevStage, togglePresent, markTvSeen, tvConnected };
  }

  root.BM = root.BM || {};
  root.BM.createGame = createGame;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createGame };
})(typeof window !== 'undefined' ? window : globalThis);
