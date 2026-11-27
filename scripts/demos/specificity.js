(root) => {
  const q = name => root.querySelector(`[data-spec-${name}]`);
  const legacyPseudoElements = new Set(['before', 'after', 'first-line', 'first-letter']);
  const max = list => list.reduce((best, s) => (compare(s, best) > 0 ? s : best), [0, 0, 0]);
  function compare(x, y) { for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; }
  function splitTop(text, separator = ',') {
    const parts = [];
    let depth = 0, start = 0, quote = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quote) { if (ch === quote) quote = ''; continue; }
      if (ch === '"' || ch === '\'') quote = ch;
      else if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      else if (ch === separator && depth === 0) { parts.push(text.slice(start, i)); start = i + 1; }
    }
    parts.push(text.slice(start));
    return parts.map(p => p.trim()).filter(Boolean);
  }
  function readParens(text, i) {
    let depth = 0;
    for (let j = i; j < text.length; j++) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')' && --depth === 0) return [text.slice(i + 1, j), j + 1];
    }
    throw Error('Незакрита дужка');
  }
  const ident = /^-?[_a-zA-Z\u00a0-\uffff][-\w\u00a0-\uffff]*|^\\./;
  function specificity(selector) {
    const s = [0, 0, 0];
    const add = other => { s[0] += other[0]; s[1] += other[1]; s[2] += other[2]; };
    let i = 0;
    while (i < selector.length) {
      const rest = selector.slice(i);
      const ch = selector[i];
      if (/[\s>+~,]/.test(ch)) { i++; continue; }
      if (ch === '*') { i++; if (selector[i] === '|') i++; continue; }
      if (ch === '#') { const m = rest.slice(1).match(ident); if (!m) throw Error('Порожній #id'); s[0]++; i += 1 + m[0].length; continue; }
      if (ch === '.') { const m = rest.slice(1).match(ident); if (!m) throw Error('Порожній .class'); s[1]++; i += 1 + m[0].length; continue; }
      if (ch === '[') { const end = selector.indexOf(']', i); if (end < 0) throw Error('Незакрита ['); s[1]++; i = end + 1; continue; }
      if (ch === ':') {
        const element = selector[i + 1] === ':';
        i += element ? 2 : 1;
        const m = selector.slice(i).match(ident);
        if (!m) throw Error('Порожній псевдоклас');
        const name = m[0].toLowerCase();
        i += m[0].length;
        let args = null;
        if (selector[i] === '(') { [args, i] = readParens(selector, i); }
        if (element || legacyPseudoElements.has(name)) {
          s[2]++;
          if (name === 'slotted' && args) add(max(splitTop(args).map(specificity)));
          continue;
        }
        if (name === 'where') continue;
        if (['is', 'not', 'has', 'matches', '-webkit-any'].includes(name) && args) { add(max(splitTop(args).map(specificity))); continue; }
        if (['nth-child', 'nth-last-child'].includes(name) && args && /\sof\s/i.test(args)) {
          s[1]++;
          add(max(splitTop(args.split(/\sof\s/i)[1]).map(specificity)));
          continue;
        }
        s[1]++;
        continue;
      }
      const m = rest.match(ident);
      if (m) { s[2]++; i += m[0].length; if (selector[i] === '|') i++; continue; }
      throw Error(`Незрозумілий символ «${ch}»`);
    }
    return s;
  }
  function evaluate(text) {
    const list = splitTop(text);
    if (!list.length) throw Error('Порожній селектор');
    return max(list.map(specificity));
  }
  const row = (label, value) => {
    const tr = document.createElement('tr');
    for (const cell of [label, ...value]) { const td = document.createElement('td'); td.textContent = cell; tr.append(td); }
    return tr;
  };
  function update() {
    const result = q('result');
    try {
      const a = evaluate(q('a').value), b = evaluate(q('b').value);
      q('rows').replaceChildren(row(`A: ${q('a').value}`, a), row(`B: ${q('b').value}`, b));
      const diff = compare(a, b);
      result.className = '';
      result.textContent = diff === 0
        ? `Specificity однакова (${a.join('-')}). Переможе правило, оголошене пізніше.`
        : `Перемагає ${diff > 0 ? 'A' : 'B'}: ${(diff > 0 ? a : b).join('-')} проти ${(diff > 0 ? b : a).join('-')}. Порівняння йде по стовпцях зліва направо, без «переносу» між розрядами.`;
    } catch (error) {
      result.className = 'bad';
      result.textContent = `Не вдалося розібрати селектор: ${error.message}.`;
    }
  }
  q('a').addEventListener('input', update);
  q('b').addEventListener('input', update);
  root.addEventListener('click', event => {
    const preset = event.target.closest('[data-spec-try]')?.dataset.specTry;
    if (!preset) return;
    [q('a').value, q('b').value] = preset.split('|');
    update();
  });
  update();
}
