(function (root) {
  const KEY = 'blackwood-manor-state-v1';

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
      votes: {}
    });

    let state = load();

    function load() {
      try {
        const raw = storage.getItem(KEY);
        if (raw) return Object.assign(defaults(), JSON.parse(raw));
      } catch (e) { /* corrupt or unavailable storage: start fresh */ }
      return defaults();
    }
    function save() { try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
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

    return { get, set, reset, roster, stage, nextStage, prevStage, togglePresent };
  }

  root.BM = root.BM || {};
  root.BM.createGame = createGame;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createGame };
})(typeof window !== 'undefined' ? window : globalThis);
