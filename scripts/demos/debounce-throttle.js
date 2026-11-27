(root) => {
  const WINDOW = 6000;
  const q = name => root.querySelector(`[data-dt-${name}]`);
  const rows = Object.fromEntries([...root.querySelectorAll('.timeline-row')].map(row => [row.dataset.row, row]));
  const marks = {raw: [], debounce: [], throttle: []};
  const totals = {raw: 0, debounce: 0, throttle: 0};
  let delay = 300;
  let debounceTimer;
  let lastThrottle = -Infinity;
  let trailingTimer;
  let frame;
  let lastRaw = 0;
  const fire = kind => { marks[kind].push(performance.now()); totals[kind]++; schedule(); };
  const debounced = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => fire('debounce'), delay); };
  const throttled = () => {
    const now = performance.now();
    const wait = lastThrottle + delay - now;
    if (wait <= 0) { lastThrottle = now; fire('throttle'); return; }
    if (!trailingTimer) {
      trailingTimer = setTimeout(() => { trailingTimer = undefined; lastThrottle = performance.now(); fire('throttle'); }, wait);
    }
  };
  const event = () => {
    const now = performance.now();
    if (now - lastRaw < 16) return;
    lastRaw = now;
    fire('raw');
    debounced();
    throttled();
  };
  const draw = () => {
    frame = undefined;
    const now = performance.now();
    let active = false;
    for (const [kind, list] of Object.entries(marks)) {
      while (list.length && now - list[0] > WINDOW) list.shift();
      if (list.length) active = true;
      const track = rows[kind].querySelector('.timeline-track');
      const nodes = list.map(time => {
        const i = document.createElement('i');
        i.style.left = `${100 - (now - time) / WINDOW * 100}%`;
        return i;
      });
      track.replaceChildren(...nodes);
      rows[kind].querySelector('output').value = totals[kind];
    }
    if (active || debounceTimer) schedule();
  };
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  const pad = q('pad');
  pad.addEventListener('pointermove', event);
  pad.addEventListener('pointerdown', () => pad.classList.add('is-active'));
  pad.addEventListener('pointerenter', () => pad.classList.add('is-active'));
  pad.addEventListener('pointerleave', () => pad.classList.remove('is-active'));
  pad.addEventListener('keydown', e => { if (e.key.length === 1 || e.key.startsWith('Arrow')) { e.preventDefault(); e.stopPropagation(); event(); } });
  q('delay').addEventListener('input', () => { delay = q('delay').valueAsNumber; q('delay-value').value = `${delay} мс`; });
  q('burst').addEventListener('click', () => {
    const times = [];
    for (let t = 0; t <= 1200; t += 60) times.push(t);
    for (let t = 2100; t <= 2700; t += 60) times.push(t);
    times.forEach(t => setTimeout(() => { lastRaw = 0; event(); }, t));
  });
  q('clear').addEventListener('click', () => {
    for (const kind of Object.keys(marks)) { marks[kind] = []; totals[kind] = 0; }
    clearTimeout(debounceTimer); clearTimeout(trailingTimer); trailingTimer = undefined; lastThrottle = -Infinity;
    schedule();
  });
  draw();
}
