(root) => {
  const users = [{id: 1, name: 'Anna'}, {id: 2, name: 'Bohdan'}, {id: 3, name: 'Ira'}];
  const orders = [{id: 101, user_id: 1, total: 250}, {id: 102, user_id: 1, total: 90}, {id: 103, user_id: 2, total: 40}, {id: 104, user_id: 4, total: 70}];
  const notes = {
    inner: 'Лише рядки з парою в обох таблицях: Іра та замовлення 104 зникли.',
    left: 'Усі користувачі; для Іри стовпці замовлення — NULL. Anna двічі, бо має два замовлення.',
    right: 'Усі замовлення; для 104 стовпці користувача — NULL (батьківського запису немає — привід перевірити цілісність даних).',
    full: 'Усі рядки з обох таблиць; відсутні пари доповнено NULL. У MySQL FULL OUTER JOIN немає — емулюють через UNION LEFT і RIGHT JOIN.',
    anti: 'Anti-join: користувачі без замовлень. Типовий QA-запит для пошуку «осиротілих» або неповних даних.',
  };
  const sql = {
    inner: 'SELECT u.id, u.name, o.id AS order_id, o.total\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id;',
    left: 'SELECT u.id, u.name, o.id AS order_id, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;',
    right: 'SELECT u.id, u.name, o.id AS order_id, o.total\nFROM users u\nRIGHT JOIN orders o ON o.user_id = u.id;',
    full: 'SELECT u.id, u.name, o.id AS order_id, o.total\nFROM users u\nFULL OUTER JOIN orders o ON o.user_id = u.id;',
    anti: 'SELECT u.id, u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;',
  };
  const q = name => root.querySelector(`[data-sql-${name}]`);
  const table = (columns, rows, caption) => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const t = document.createElement('table');
    if (caption) t.createCaption().textContent = caption;
    const head = document.createElement('tr');
    for (const c of columns) head.append(Object.assign(document.createElement('th'), {textContent: c}));
    const thead = document.createElement('thead'); thead.append(head);
    const tbody = document.createElement('tbody');
    for (const row of rows) {
      const tr = document.createElement('tr');
      for (const c of columns) {
        const value = row[c];
        const td = document.createElement('td');
        td.textContent = value ?? 'NULL';
        if (value == null) td.className = 'is-null';
        tr.append(td);
      }
      tbody.append(tr);
    }
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  q('sources').append(table(['id', 'name'], users, 'users'), table(['id', 'user_id', 'total'], orders, 'orders'));
  const row = (u, o) => ({id: u?.id ?? null, name: u?.name ?? null, order_id: o?.id ?? null, total: o?.total ?? null});
  function join(type) {
    const rows = [];
    if (type === 'right') {
      for (const o of orders) rows.push(row(users.find(u => u.id === o.user_id), o));
      return rows;
    }
    for (const u of users) {
      const matches = orders.filter(o => o.user_id === u.id);
      if (matches.length) { if (type !== 'anti') matches.forEach(o => rows.push(row(u, o))); }
      else if (type !== 'inner') rows.push(row(u, null));
    }
    if (type === 'full') for (const o of orders) if (!users.some(u => u.id === o.user_id)) rows.push(row(null, o));
    return rows;
  }
  function show(type) {
    for (const button of root.querySelectorAll('[data-join]')) {
      button.classList.toggle('primary', button.dataset.join === type);
      button.setAttribute('aria-pressed', String(button.dataset.join === type));
    }
    q('query').textContent = sql[type];
    const rows = join(type);
    q('result').replaceChildren(table(type === 'anti' ? ['id', 'name'] : ['id', 'name', 'order_id', 'total'], rows, `Результат: ${rows.length} рядк${rows.length === 1 ? 'ок' : rows.length < 5 ? 'и' : 'ів'}`));
    q('note').textContent = notes[type];
  }
  q('types').addEventListener('click', event => { const type = event.target.closest('[data-join]')?.dataset.join; if (type) show(type); });
  show('inner');
}
