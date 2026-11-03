(function (root) {
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  function append(parent, ...children) {
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      parent.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return parent;
  }

  let typeHandle = null;
  /* Time-based: the visible length follows the clock, so a throttled tab catches up instead of lagging. */
  function typewrite(container, speed, onDone) {
    if (typeHandle) clearInterval(typeHandle);
    const perChar = speed || 22;
    const items = Array.from(container.querySelectorAll('.typed')).map((p) => ({ p, full: p.textContent }));
    items.forEach((it) => { it.p.textContent = ''; });
    const start = Date.now();
    let offset = 0;
    const starts = items.map((it) => { const o = offset; offset += it.full.length + 12; return o; });
    let finished = false;
    const finish = () => { if (finished) return; finished = true; clearInterval(typeHandle); typeHandle = null; items.forEach((it) => { it.p.textContent = it.full; it.p.classList.add('finished'); }); if (onDone) onDone(); };
    container.addEventListener('click', finish, { once: true });
    const step = () => {
      const chars = Math.floor((Date.now() - start) / perChar);
      items.forEach((it, i) => {
        const n = Math.max(0, Math.min(it.full.length, chars - starts[i]));
        it.p.textContent = it.full.slice(0, n);
        it.p.classList.toggle('finished', n >= it.full.length);
      });
      if (chars >= offset) finish();
    };
    step();
    typeHandle = setInterval(step, 40);
  }

  function narrationNode(lines, opts) {
    const node = el('div', { class: 'narration' });
    for (const line of lines) {
      if (opts && opts.hideDirections && line.speaker === 'Stage direction') continue;
      node.append(el('span', { class: 'speaker' }, line.speaker), el('p', { class: 'typed' + (opts && opts.instant ? ' finished' : '') }, line.text));
    }
    return node;
  }

  function linesNode(lines, opts) {
    const node = el('div', { class: 'lines' });
    for (const l of lines) {
      if (opts && opts.hideDirections && l.speaker === 'Stage direction') continue;
      node.append(el('span', { class: 'speaker' }, l.speaker), el('p', {}, l.text));
    }
    return node;
  }

  function candles() {
    return el('div', { class: 'candles' }, el('div', { class: 'candle' }), el('div', { class: 'candle' }), el('div', { class: 'candle' }));
  }

  function flashLightning() {
    const l = document.getElementById('lightning');
    if (!l) return;
    l.classList.remove('flash'); void l.offsetWidth; l.classList.add('flash');
  }

  root.BM = root.BM || {};
  root.BM.ui = { el, clear, append, typewrite, narrationNode, linesNode, candles, flashLightning };
})(window);
