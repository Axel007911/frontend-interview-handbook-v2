(root) => {
  const log = root.querySelector('[data-batch-log]');
  const process = (snapshot, queue) => queue.reduce((value, update) => (typeof update === 'function' ? update(value) : update), snapshot);
  root.addEventListener('click', event => {
    const kind = event.target.closest('[data-step]')?.dataset.step;
    if (kind) {
      const output = root.querySelector(`[data-count="${kind}"]`);
      const count = Number(output.value);
      const queue = kind === 'value'
        ? [count + 1, count + 1, count + 1]
        : [prev => prev + 1, prev => prev + 1, prev => prev + 1];
      const next = process(count, queue);
      output.value = next;
      log.textContent = kind === 'value'
        ? `Рендер бачив count = ${count}. Черга: ${queue.join(', ')} → останнє значення ${next}. Один ререндер.`
        : `Черга з трьох функцій: ${count} → ${count + 1} → ${count + 2} → ${next}. Один ререндер.`;
    }
    if (event.target.closest('[data-reset-demo]')) {
      for (const output of root.querySelectorAll('[data-count]')) output.value = 0;
      log.textContent = '';
    }
  });
}
