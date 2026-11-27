(root) => {
  const presets = [
    {
      code: ['console.log(1);', 'setTimeout(() => console.log(2), 0);', 'Promise.resolve().then(() => console.log(3));', 'console.log(4);'],
      steps: [
        [-1, [], [], [], [], 'Старт. Увесь скрипт — це перше завдання (task).'],
        [0, ['script', 'console.log(1)'], [], [], [1], 'Синхронний виклик виконується одразу.'],
        [1, ['script', 'setTimeout'], [], ['() => log(2)'], [1], 'Браузер запускає таймер. Коли 0 мс мине, callback стане в чергу tasks.'],
        [2, ['script', 'then'], ['() => log(3)'], ['() => log(2)'], [1], 'Promise вже виконаний, тому реакція .then одразу потрапляє в чергу microtasks.'],
        [3, ['script', 'console.log(4)'], ['() => log(3)'], ['() => log(2)'], [1, 4], 'Ще один синхронний виклик.'],
        [-1, [], ['() => log(3)'], ['() => log(2)'], [1, 4], 'Скрипт завершився, стек порожній. Microtask checkpoint: виконуються всі microtasks.'],
        [2, ['() => log(3)'], [], ['() => log(2)'], [1, 4, 3], 'Microtask виводить 3.'],
        [-1, [], [], ['() => log(2)'], [1, 4, 3], 'Microtasks закінчились. Браузер може відмалювати кадр і бере наступний task.'],
        [1, ['() => log(2)'], [], [], [1, 4, 3, 2], 'Callback таймера виводить 2.'],
        [-1, [], [], [], [1, 4, 3, 2], 'Готово: 1, 4, 3, 2.'],
      ],
    },
    {
      code: ["console.log('A');", "setTimeout(() => console.log('B'), 0);", '(async () => {', "  console.log('C');", '  await null;', "  console.log('D');", '})();', "Promise.resolve().then(() => console.log('E'));", "console.log('F');"],
      steps: [
        [-1, [], [], [], [], 'Старт скрипту.'],
        [0, ['script', 'console.log'], [], [], ['A'], 'Синхронно: A.'],
        [1, ['script', 'setTimeout'], [], ['() => log(B)'], ['A'], 'Callback таймера піде в чергу tasks.'],
        [2, ['script', 'async fn'], [], ['() => log(B)'], ['A'], 'Async-функція виконується синхронно до першого await.'],
        [3, ['script', 'async fn', 'console.log'], [], ['() => log(B)'], ['A', 'C'], 'Ще синхронно: C.'],
        [4, ['script'], ['продовження async → D'], ['() => log(B)'], ['A', 'C'], 'await призупиняє функцію. Її продовження — microtask.'],
        [7, ['script', 'then'], ['продовження async → D', '() => log(E)'], ['() => log(B)'], ['A', 'C'], '.then стає в чергу microtasks після продовження async.'],
        [8, ['script', 'console.log'], ['продовження async → D', '() => log(E)'], ['() => log(B)'], ['A', 'C', 'F'], 'Синхронно: F.'],
        [-1, [], ['продовження async → D', '() => log(E)'], ['() => log(B)'], ['A', 'C', 'F'], 'Стек порожній — виконуємо microtasks по черзі.'],
        [5, ['async fn (продовження)'], ['() => log(E)'], ['() => log(B)'], ['A', 'C', 'F', 'D'], 'Функція продовжилась після await: D.'],
        [7, ['() => log(E)'], [], ['() => log(B)'], ['A', 'C', 'F', 'D', 'E'], 'Наступна microtask: E.'],
        [1, ['() => log(B)'], [], [], ['A', 'C', 'F', 'D', 'E', 'B'], 'Microtasks порожні — наступний task: B.'],
        [-1, [], [], [], ['A', 'C', 'F', 'D', 'E', 'B'], 'Готово: A, C, F, D, E, B.'],
      ],
    },
    {
      code: ['setTimeout(() => {', "  console.log('T1');", "  Promise.resolve().then(() => console.log('M2'));", '}, 0);', "setTimeout(() => console.log('T2'), 0);", 'Promise.resolve().then(() => {', "  console.log('M1');", "  setTimeout(() => console.log('T3'), 0);", '});'],
      steps: [
        [-1, [], [], [], [], 'Старт скрипту.'],
        [0, ['script', 'setTimeout'], [], ['T1 callback'], [], 'Перший таймер.'],
        [4, ['script', 'setTimeout'], [], ['T1 callback', 'T2 callback'], [], 'Другий таймер — у кінець черги tasks.'],
        [5, ['script', 'then'], ['M1 callback'], ['T1 callback', 'T2 callback'], [], 'Реакція Promise — у microtasks.'],
        [-1, [], ['M1 callback'], ['T1 callback', 'T2 callback'], [], 'Скрипт завершено. Спершу всі microtasks.'],
        [6, ['M1 callback'], [], ['T1 callback', 'T2 callback'], ['M1'], 'M1.'],
        [7, ['M1 callback', 'setTimeout'], [], ['T1 callback', 'T2 callback', 'T3 callback'], ['M1'], 'Таймер, створений у microtask, стає в кінець черги tasks.'],
        [0, ['T1 callback'], [], ['T2 callback', 'T3 callback'], ['M1'], 'Microtasks порожні. Беремо перший task.'],
        [1, ['T1 callback', 'console.log'], [], ['T2 callback', 'T3 callback'], ['M1', 'T1'], 'T1.'],
        [2, ['T1 callback', 'then'], ['M2 callback'], ['T2 callback', 'T3 callback'], ['M1', 'T1'], 'Нова microtask під час task.'],
        [2, ['M2 callback'], [], ['T2 callback', 'T3 callback'], ['M1', 'T1', 'M2'], 'Після кожного task — microtask checkpoint. M2 раніше за T2.'],
        [4, ['T2 callback'], [], ['T3 callback'], ['M1', 'T1', 'M2', 'T2'], 'Наступний task: T2.'],
        [7, ['T3 callback'], [], [], ['M1', 'T1', 'M2', 'T2', 'T3'], 'Останній task: T3.'],
        [-1, [], [], [], ['M1', 'T1', 'M2', 'T2', 'T3'], 'Готово: M1, T1, M2, T2, T3.'],
      ],
    },
  ];
  const q = name => root.querySelector(`[data-el-${name}]`);
  let preset = presets[0];
  let index = 0;
  let timer;
  const chips = (list, previous = []) => list.map(text => {
    const chip = document.createElement('span');
    chip.className = previous.includes(text) ? 'chip' : 'chip is-new';
    chip.textContent = text;
    return chip;
  });
  const draw = () => {
    const [line, stack, micro, tasks, out, note] = preset.steps[index];
    const prev = preset.steps[index - 1] || [-1, [], [], [], [], ''];
    q('code').replaceChildren(...preset.code.map((text, i) => {
      const span = document.createElement('span');
      span.textContent = text + '\n';
      if (i === line) span.className = 'line-active';
      return span;
    }));
    q('stack').replaceChildren(...chips([...stack].reverse(), prev[1]));
    q('micro').replaceChildren(...chips(micro, prev[2]));
    q('tasks').replaceChildren(...chips(tasks, prev[3]));
    q('out').replaceChildren(...chips(out.map(String), prev[4].map(String)));
    q('note').textContent = note;
    q('counter').textContent = `Крок ${index + 1} з ${preset.steps.length}`;
    q('prev').disabled = index === 0;
    q('next').disabled = index === preset.steps.length - 1;
  };
  const stop = () => { clearInterval(timer); timer = undefined; q('play').textContent = 'Програти'; };
  q('preset').addEventListener('change', () => { stop(); preset = presets[Number(q('preset').value)]; index = 0; draw(); });
  q('next').addEventListener('click', () => { if (index < preset.steps.length - 1) index++; draw(); });
  q('prev').addEventListener('click', () => { if (index > 0) index--; draw(); });
  q('reset').addEventListener('click', () => { stop(); index = 0; draw(); });
  q('play').addEventListener('click', () => {
    if (timer) { stop(); return; }
    if (index === preset.steps.length - 1) index = 0;
    q('play').textContent = 'Пауза';
    draw();
    timer = setInterval(() => {
      if (index >= preset.steps.length - 1 || !root.isConnected || root.closest('[hidden]')) { stop(); return; }
      index++;
      draw();
    }, 1100);
  });
  draw();
}
