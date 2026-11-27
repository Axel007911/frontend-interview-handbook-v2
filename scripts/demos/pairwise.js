(root) => {
  const input = root.querySelector('[data-pw-input]');
  const summary = root.querySelector('[data-pw-summary]');
  const holder = root.querySelector('[data-pw-table]');
  const parse = text => text.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [name, values = ''] = line.includes(':') ? [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1)] : [line, ''];
    return {name: name.trim(), values: [...new Set(values.split(',').map(v => v.trim()).filter(Boolean))]};
  }).filter(p => p.values.length);
  const key = (i, a, j, b) => `${i}:${a}|${j}:${b}`;
  function generate(params) {
    const uncovered = new Set();
    for (let i = 0; i < params.length; i++) for (let j = i + 1; j < params.length; j++)
      for (let a = 0; a < params[i].values.length; a++) for (let b = 0; b < params[j].values.length; b++) uncovered.add(key(i, a, j, b));
    const totalPairs = uncovered.size;
    const tests = [];
    while (uncovered.size && tests.length < 500) {
      const [first] = uncovered;
      const [[i, a], [j, b]] = first.split('|').map(part => part.split(':').map(Number));
      const test = new Array(params.length).fill(-1);
      test[i] = a; test[j] = b;
      for (let p = 0; p < params.length; p++) {
        if (test[p] >= 0) continue;
        let best = 0, bestScore = -1;
        for (let v = 0; v < params[p].values.length; v++) {
          let score = 0;
          for (let o = 0; o < params.length; o++) {
            if (o === p || test[o] < 0) continue;
            if (uncovered.has(o < p ? key(o, test[o], p, v) : key(p, v, o, test[o]))) score++;
          }
          if (score > bestScore) { bestScore = score; best = v; }
        }
        test[p] = best;
      }
      for (let x = 0; x < params.length; x++) for (let y = x + 1; y < params.length; y++) uncovered.delete(key(x, test[x], y, test[y]));
      tests.push(test);
    }
    return {tests, totalPairs};
  }
  function update() {
    const params = parse(input.value);
    if (params.length < 2) {
      summary.textContent = 'Потрібно щонайменше два параметри зі значеннями.';
      holder.replaceChildren();
      return;
    }
    const {tests, totalPairs} = generate(params);
    const product = params.reduce((n, p) => n * p.values.length, 1);
    summary.innerHTML = '';
    summary.append(`Повний перебір: ${product.toLocaleString('uk-UA')} комбінацій. Pairwise: `, Object.assign(document.createElement('strong'), {textContent: `${tests.length} тестів`}), ` покривають усі ${totalPairs} пар.`);
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const table = document.createElement('table');
    const head = document.createElement('tr');
    for (const text of ['#', ...params.map(p => p.name)]) head.append(Object.assign(document.createElement('th'), {textContent: text}));
    const thead = document.createElement('thead'); thead.append(head);
    const tbody = document.createElement('tbody');
    tests.forEach((test, n) => {
      const tr = document.createElement('tr');
      tr.append(Object.assign(document.createElement('td'), {textContent: n + 1}));
      test.forEach((v, p) => tr.append(Object.assign(document.createElement('td'), {textContent: params[p].values[v]})));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    holder.replaceChildren(wrap);
  }
  input.addEventListener('input', update);
  update();
}
