(function (root) {
  const STATIONS = ['Sofa', 'Bookshelf', 'Television', 'Plant', 'Lamp', 'Cupboard'];
  const LUNA_OFFSET = 5;

  function stationIndexFor(character, stageIndex) {
    const base = character.id === 'luna' ? LUNA_OFFSET : character.index;
    return (base + stageIndex) % STATIONS.length;
  }

  function stationFor(character, stageIndex) {
    return STATIONS[stationIndexFor(character, stageIndex)];
  }

  function riddleFor(data, character, targetStageIndex) {
    const station = stationFor(character, targetStageIndex);
    return data.riddles[station][targetStageIndex % 3];
  }

  const logic = { STATIONS, stationFor, riddleFor };

  root.BM = root.BM || {};
  root.BM.logic = logic;
  if (typeof module !== 'undefined' && module.exports) module.exports = logic;
})(typeof window !== 'undefined' ? window : globalThis);
