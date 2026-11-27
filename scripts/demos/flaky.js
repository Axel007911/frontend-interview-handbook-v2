(root) => {
  const q = name => root.querySelector(`[data-fl-${name}]`);
  const pct = x => `${(x * 100).toLocaleString('uk-UA', {maximumFractionDigits: x < 0.01 ? 2 : 1})}%`;
  function update() {
    const n = q('n').valueAsNumber, p = q('p').valueAsNumber / 100, r = q('r').valueAsNumber, bug = q('bug').valueAsNumber / 100;
    q('n-value').value = n;
    q('p-value').value = `${q('p').valueAsNumber.toLocaleString('uk-UA')}%`;
    q('r-value').value = r;
    q('bug-value').value = `${Math.round(bug * 100)}%`;
    const green0 = (1 - p) ** n;
    const green = (1 - p ** (r + 1)) ** n;
    q('green0').textContent = pct(green0);
    q('green').textContent = pct(green);
    q('expected').textContent = (n * p).toLocaleString('uk-UA', {maximumFractionDigits: 1});
    q('hidden').textContent = r ? pct(1 - bug ** (r + 1)) : '0% (ретраїв немає)';
    q('note').textContent = green0 < 0.5
      ? `Без ретраїв більшість прогонів червоні без жодного дефекту — команда швидко перестане довіряти результатам. Ретраї ${r ? `підіймають «зелень» до ${pct(green)}, але` : 'могли б підняти «зелень», але'} лише маскують проблему: виправляй або карантинь флакі-тести й відстежуй їхню частку.`
      : 'Набір достатньо стабільний. Стеж за трендом: частка флакі зростає разом із кількістю тестів.';
  }
  for (const name of ['n', 'p', 'r', 'bug']) q(name).addEventListener('input', update);
  update();
}
