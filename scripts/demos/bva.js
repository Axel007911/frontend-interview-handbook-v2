(root) => {
  const q = name => root.querySelector(`[data-bva-${name}]`);
  const decimals = step => (String(step).split('.')[1] || '').length;
  const table = (head, rows) => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const t = document.createElement('table');
    const tr = cells => { const r = document.createElement('tr'); for (const c of cells) { const td = document.createElement(c.th ? 'th' : 'td'); td.textContent = c.text ?? c; if (c.cls) td.className = c.cls; r.append(td); } return r; };
    const thead = document.createElement('thead'); thead.append(tr(head.map(text => ({text, th: true}))));
    const tbody = document.createElement('tbody'); rows.forEach(r => tbody.append(tr(r)));
    t.append(thead, tbody); wrap.append(t);
    return wrap;
  };
  function update() {
    const out = q('out');
    const min = q('min').valueAsNumber, max = q('max').valueAsNumber, step = q('step').valueAsNumber;
    const mode = q('mode').value;
    if (![min, max, step].every(Number.isFinite) || step <= 0 || min > max) {
      const hint = Object.assign(document.createElement('p'), {className: 'demo-note', textContent: mode === '2'
      ? 'ISTQB CTFL v4: граничні значення — мінімум і максимум кожного класу. Для діапазону це обидві межі та найближчі значення поза ним.'
      : 'ISTQB CTFL v4, 3-value BVA: для кожного граничного значення ще й обидва сусіди. Спрощений варіант, який часто називають на співбесідах, — шість значень довкола двох меж.'});
    out.replaceChildren(Object.assign(document.createElement('p'), {className: 'bad', textContent: 'Перевір вхідні дані: мінімум ≤ максимум, крок > 0.'}));
      return;
    }
    const d = decimals(step);
    const f = n => Number(n.toFixed(d)).toLocaleString('uk-UA', {maximumFractionDigits: d, useGrouping: false});
    const valid = n => n >= min - 1e-9 && n <= max + 1e-9;
    const mid = Math.round(((min + max) / 2) / step) * step;
    const partitions = [
      ['Невалідний: менше за мінімум', `< ${f(min)}`, f(min - 10 * step), {text: 'відхилити', cls: 'bad'}],
      ['Валідний', `${f(min)} … ${f(max)}`, f(mid), {text: 'прийняти', cls: 'good'}],
      ['Невалідний: більше за максимум', `> ${f(max)}`, f(max + 10 * step), {text: 'відхилити', cls: 'bad'}],
    ];
    const edges = [min - step, min, max, max + step];
    const points = mode === '2' ? edges : edges.flatMap(b => [b - step, b, b + step]);
    const unique = [...new Map(points.map(p => [p.toFixed(d), p])).values()].sort((a, b) => a - b);
    const boundaries = unique.map(p => [f(p), valid(p) ? {text: 'валідне', cls: 'good'} : {text: 'невалідне', cls: 'bad'}, edges.some(e => Math.abs(e - p) < 1e-9) ? 'граничне значення' : 'сусід граничного значення']);
    const extra = document.createElement('p');
    extra.className = 'demo-note';
    extra.textContent = `Окремі негативні класи, які легко забути: порожнє поле, пробіли, нечислове значення («abc»), ${d === 0 ? 'дробове число для цілого поля (' + f(min) + '.5), ' : 'зайва точність (' + (min + step / 2) + '), '}від’ємне число, дуже велике число, кома замість крапки, ведучі нулі.`;
    const total = document.createElement('p');
    total.innerHTML = `<strong>${unique.length + 3}</strong> перевірок замість перебору всіх значень: ${unique.length} граничних і по одному представнику з кожного класу.`;
    const hint = Object.assign(document.createElement('p'), {className: 'demo-note', textContent: mode === '2'
      ? 'ISTQB CTFL v4: граничні значення — мінімум і максимум кожного класу. Для діапазону це обидві межі та найближчі значення поза ним.'
      : 'ISTQB CTFL v4, 3-value BVA: для кожного граничного значення ще й обидва сусіди. Спрощений варіант, який часто називають на співбесідах, — шість значень довкола двох меж.'});
    out.replaceChildren(
      Object.assign(document.createElement('h4'), {textContent: 'Класи еквівалентності'}),
      table(['Клас', 'Діапазон', 'Представник', 'Очікування'], partitions),
      Object.assign(document.createElement('h4'), {textContent: `Граничні значення (${mode}-value)`}),
      table(['Значення', 'Клас', 'Роль'], boundaries), hint,
      total, extra,
    );
    check();
  }
  function check() {
    const raw = q('check').value.trim().replace(',', '.');
    const verdict = q('verdict');
    const min = q('min').valueAsNumber, max = q('max').valueAsNumber, step = q('step').valueAsNumber;
    if (!raw) { verdict.textContent = 'Порожнє значення — окремий негативний клас.'; verdict.className = 'bad'; return; }
    const n = Number(raw);
    if (!Number.isFinite(n)) { verdict.textContent = 'Не число — негативний клас «нечислові дані».'; verdict.className = 'bad'; return; }
    const offGrid = Math.abs(Math.round((n - min) / step) * step - (n - min)) > 1e-9;
    if (n < min) { verdict.textContent = 'Менше за мінімум — невалідний клас.'; verdict.className = 'bad'; }
    else if (n > max) { verdict.textContent = 'Більше за максимум — невалідний клас.'; verdict.className = 'bad'; }
    else if (offGrid) { verdict.textContent = 'У діапазоні, але не відповідає кроку/точності — окремий негативний клас.'; verdict.className = 'bad'; }
    else { verdict.textContent = 'Валідний клас.'; verdict.className = 'good'; }
  }
  for (const name of ['min', 'max', 'step', 'mode']) q(name).addEventListener('input', update);
  q('check').addEventListener('input', check);
  update();
}
