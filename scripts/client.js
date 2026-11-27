const $ = id => document.getElementById(id);
const items = handbook.items;
const byId = new Map(items.map(item => [item.id, item]));
const articles = new Map(items.map(({id}) => [id, $(id)]));
const MODES = ['study', 'interview', 'revision'];

/* ---------- state ---------- */
function loadState() {
  for (const key of [handbook.storageKey, ...handbook.legacyStorageKeys]) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && typeof value === 'object') return value;
    } catch {}
  }
  return {};
}
let state = loadState();
function normalizeState() {
  if (!state.questions || typeof state.questions !== 'object') state.questions = {};
  if (!state.checks || typeof state.checks !== 'object') state.checks = {};
}
normalizeState();
let storageWarned = false;
function save() {
  try { localStorage.setItem(handbook.storageKey, JSON.stringify(state)); }
  catch { if (!storageWarned) { toast('Браузер не дозволив зберегти прогрес.'); storageWarned = true; } }
  updateProgress();
}
const record = id => state.questions[id] ?? {};
function setRecord(id, patch) {
  const next = {...record(id), ...patch};
  if (!next.status) delete next.status;
  if (!next.bookmark) delete next.bookmark;
  if (Object.keys(next).length) state.questions[id] = next; else delete state.questions[id];
  save();
}

/* ---------- helpers ---------- */
let toastTimer;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 2600);
}
async function copy(text, message = 'Скопійовано.') {
  try { await navigator.clipboard.writeText(text); toast(message); }
  catch { window.prompt('Скопіюй текст', text); }
}
const normalize = text => text.toLocaleLowerCase('uk').normalize('NFKC').replace(/[’ʼ']/g, '\'');
const isTyping = target => target.closest('textarea, select, [contenteditable="true"], input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="button"]):not([type="file"])');
const mode = () => document.querySelector('[name="mode"]:checked').value;
const getId = () => decodeURIComponent(location.hash.slice(1));
const current = () => byId.get(getId());

/* ---------- table of contents & search ---------- */
const tocItems = new Map([...$('toc').querySelectorAll('li[data-id]')].map(li => [li.dataset.id, li]));
const groups = [...$('toc').querySelectorAll('details.toc-chapter')];
const searchIndex = new Map(items.map(item => [item.id, normalize(`${item.number} ${item.title} ${articles.get(item.id).textContent}`)]));
let savedOpenGroups;

function filtered() {
  const terms = normalize($('search').value.trim()).split(/\s+/).filter(Boolean);
  const revision = mode() === 'revision';
  return items.filter(({id}) => (!revision || record(id).status === 'review' || record(id).bookmark)
    && terms.every(term => searchIndex.get(id).includes(term)));
}

function updateList() {
  const list = filtered();
  const visible = new Set(list.map(item => item.id));
  const isFiltered = Boolean($('search').value.trim()) || mode() === 'revision';
  if (isFiltered && !savedOpenGroups) savedOpenGroups = new Set(groups.filter(group => group.open));
  for (const [id, li] of tocItems) {
    li.hidden = !visible.has(id);
    const {status, bookmark} = record(id);
    li.dataset.status = status || '';
    li.toggleAttribute('data-bookmark', Boolean(bookmark));
  }
  for (const group of groups) {
    group.hidden = !group.querySelector('li:not([hidden])');
    if (isFiltered) group.open = !group.hidden;
    else if (savedOpenGroups) group.open = savedOpenGroups.has(group);
  }
  if (!isFiltered) savedOpenGroups = undefined;
  const results = $('results');
  if (!isFiltered) results.textContent = `Усього карток: ${items.length}`;
  else if (list.length) results.textContent = `У добірці: ${list.length}`;
  else results.textContent = mode() === 'revision' && !$('search').value.trim()
    ? 'Тут з’являться закладки та картки зі статусом «Повторити».'
    : 'Нічого не знайдено.';
  for (const button of document.querySelectorAll('[data-random]')) button.disabled = !list.length;
  updatePager(list);
  return list;
}

function updatePager(list = filtered()) {
  const active = current();
  if (!active) return;
  let index = list.findIndex(item => item.id === active.id);
  const pool = index >= 0 ? list : items;
  if (index < 0) index = items.findIndex(item => item.id === active.id);
  for (const [name, target] of [['prev', pool[index - 1]], ['next', pool[index + 1]]]) {
    const link = $(name);
    link.classList.toggle('is-empty', !target);
    link.querySelector('.pager-title').textContent = target ? `${target.number}. ${target.title}` : '';
    if (target) link.href = `#${target.id}`; else link.removeAttribute('href');
    link.setAttribute('aria-hidden', String(!target));
  }
  const chapterItems = items.filter(item => item.chapter === active.chapter);
  $('crumb-position').textContent = `${chapterItems.indexOf(active) + 1} / ${chapterItems.length}`;
}

/* ---------- progress ---------- */
const allChecks = [...$('checklist').querySelectorAll('[data-check]')];
for (const box of allChecks) {
  const holder = box.parentElement;
  const label = document.createElement('label');
  label.append(...holder.childNodes);
  holder.append(label);
  const key = label.textContent.trim();
  box.checked = Boolean(state.checks[key]);
  box.addEventListener('change', () => { state.checks[key] = box.checked; save(); });
}
function updateProgress() {
  const done = items.filter(({id}) => record(id).status === 'done').length;
  const review = items.filter(({id}) => record(id).status === 'review').length;
  const marks = items.filter(({id}) => record(id).bookmark).length;
  const checked = allChecks.filter(box => box.checked).length;
  $('stat-done').textContent = done;
  $('stat-review').textContent = review;
  $('stat-bookmarks').textContent = marks;
  $('stat-checklist').textContent = `${checked}/${allChecks.length}`;
  $('progress-bar').style.inlineSize = `${done / items.length * 100}%`;
  $('check-progress').textContent = `Відмічено ${checked} із ${allChecks.length}`;
  $('check-bar').style.inlineSize = `${allChecks.length ? checked / allChecks.length * 100 : 0}%`;
  for (const {dir} of handbook.chapters) {
    const chapterItems = items.filter(item => item.chapter === dir);
    const chapterDone = chapterItems.filter(({id}) => record(id).status === 'done').length;
    document.querySelector(`[data-chapter-count="${dir}"]`).textContent = chapterDone ? `${chapterDone}/${chapterItems.length}` : chapterItems.length;
    document.querySelector(`[data-chapter-done="${dir}"]`).textContent = chapterDone ? `вивчено ${chapterDone}` : '';
    document.querySelector(`[data-chapter-bar="${dir}"]`).style.inlineSize = `${chapterDone / chapterItems.length * 100}%`;
  }
}

/* ---------- rendering ---------- */
let renderedId;
function render(focus = false) {
  const id = getId();
  const active = current();
  const view = active ? 'reader' : id === 'checklist' ? 'checklist' : 'home';
  for (const name of ['home', 'checklist', 'reader']) $(name).hidden = name !== view;
  if (renderedId && renderedId !== id) articles.get(renderedId)?.setAttribute('hidden', '');
  for (const li of tocItems.values()) li.querySelector('a').removeAttribute('aria-current');
  for (const link of $('toc').querySelectorAll('.toc-link')) {
    if (link.hash === `#${view}`) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  }
  if (active) {
    const article = articles.get(id);
    article.hidden = false;
    const answer = article.querySelector('.answer');
    if (renderedId !== id) answer.open = mode() === 'study' && !active.task;
    const li = tocItems.get(id);
    li.querySelector('a').setAttribute('aria-current', 'location');
    const group = li.closest('details');
    const filtering = Boolean($('search').value.trim()) || mode() === 'revision';
    if (!filtering && byId.get(renderedId)?.chapter !== active.chapter) {
      for (const other of groups) if (other !== group) other.open = false;
    }
    if (!li.hidden && !group.open) group.open = true;
    $('crumb-chapter').textContent = handbook.chapters.find(c => c.dir === active.chapter).title;
    syncQuestionControls();
    state.last = id;
    save();
  }
  renderedId = active ? id : undefined;
  updateList();
  updateGrade();
  updateContinue();
  if (focus) {
    const heading = active ? articles.get(id).querySelector('h2') : $(view).querySelector('h1');
    heading.focus({preventScroll: true});
    window.scrollTo({top: 0});
    if (active) tocItems.get(id).scrollIntoView({block: 'nearest'});
  }
}
function syncQuestionControls() {
  const active = current();
  if (!active) return;
  const {status = '', bookmark = false} = record(active.id);
  for (const radio of document.querySelectorAll('[name="status"]')) radio.checked = radio.value === status;
  $('bookmark').setAttribute('aria-pressed', String(bookmark));
}
function updateGrade() {
  const active = current();
  const answer = active && articles.get(active.id).querySelector('.answer');
  $('grade').hidden = !(active && mode() === 'interview' && answer.open);
  $('interview-hint').hidden = !(active && mode() === 'interview' && !answer.open);
}
function updateContinue() {
  const last = byId.get(state.last);
  const link = $('continue-link');
  link.hidden = !last;
  if (last) { link.href = `#${last.id}`; link.textContent = `Продовжити: ${last.number}. ${last.title}`; }
}

/* ---------- navigation ---------- */
function go(id) { if (id) location.hash = id; }
function step(direction) {
  const active = current();
  if (!active) return;
  const list = filtered();
  const pool = list.some(item => item.id === active.id) ? list : items;
  go(pool[pool.findIndex(item => item.id === active.id) + direction]?.id);
}
function random() {
  const list = filtered();
  const others = list.filter(item => item.id !== getId());
  const pool = others.length ? others : list;
  if (pool.length) go(pool[Math.floor(Math.random() * pool.length)].id);
}
function setMode(value) {
  document.querySelector(`[name="mode"][value="${value}"]`).checked = true;
  state.mode = value;
  save();
  const active = current();
  if (active) articles.get(active.id).querySelector('.answer').open = value === 'study' && !active.task;
  updateList();
  updateGrade();
}
function openSidebar(open) {
  document.body.classList.toggle('sidebar-open', open);
  $('menu').setAttribute('aria-expanded', String(open));
  $('backdrop').hidden = !open;
}
const mobile = matchMedia('(max-width: 900px)');

/* ---------- speech ---------- */
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let speakingButton;
function pickVoice() {
  const voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
  return voices.find(v => /en[-_]US/i.test(v.lang) && /Google|Samantha|Natural|Neural/i.test(v.name))
    || voices.find(v => /en[-_]US/i.test(v.lang)) || voices[0];
}
function speak(button) {
  if (speakingButton) {
    const same = speakingButton === button;
    speechSynthesis.cancel();
    if (same) return;
  }
  const text = button.closest('.en-answer').querySelector('.en-text').innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  const reset = () => {
    button.classList.remove('is-speaking');
    button.querySelector('span').textContent = 'Озвучити';
    if (speakingButton === button) speakingButton = undefined;
  };
  utterance.onend = reset;
  utterance.onerror = reset;
  speakingButton = button;
  button.classList.add('is-speaking');
  button.querySelector('span').textContent = 'Зупинити';
  speechSynthesis.speak(utterance);
}
if (canSpeak) for (const button of document.querySelectorAll('[data-speak]')) button.hidden = false;

/* ---------- runnable code ---------- */
function inspect(value, depth = 0, seen = new WeakSet()) {
  const nested = v => (typeof v === 'string' ? `'${v}'` : inspect(v, depth + 1, seen));
  if (value === null || value === undefined) return String(value);
  switch (typeof value) {
    case 'string': return depth ? `'${value}'` : value;
    case 'number': return Object.is(value, -0) ? '-0' : String(value);
    case 'bigint': return `${value}n`;
    case 'symbol': case 'boolean': return String(value);
    case 'function': return /^class\s/.test(Function.prototype.toString.call(value)) ? `[class ${value.name || '(anonymous)'}]` : `[Function: ${value.name || '(anonymous)'}]`;
  }
  if (seen.has(value)) return '[Circular]';
  if (value instanceof Error) return value.stack && !depth ? `${value.name}: ${value.message}` : `[${value.name}: ${value.message}]`;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  if (value instanceof RegExp) return String(value);
  if (value instanceof Promise) return 'Promise { … }';
  if (depth > 3) return Array.isArray(value) ? '[Array]' : '[Object]';
  seen.add(value);
  let out;
  if (Array.isArray(value)) {
    out = value.length ? `[ ${Array.from(value, v => (v === undefined ? 'undefined' : nested(v))).join(', ')} ]` : '[]';
  } else if (value instanceof Map) {
    out = `Map(${value.size}) {${value.size ? ` ${[...value].map(([k, v]) => `${nested(k)} => ${nested(v)}`).join(', ')} ` : ''}}`;
  } else if (value instanceof Set) {
    out = `Set(${value.size}) {${value.size ? ` ${[...value].map(nested).join(', ')} ` : ''}}`;
  } else {
    const keys = Object.keys(value);
    const proto = Object.getPrototypeOf(value);
    const name = proto === null ? '[Object: null prototype] ' : proto !== Object.prototype && proto.constructor?.name ? `${proto.constructor.name} ` : '';
    const key = k => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
    out = keys.length ? `${name}{ ${keys.map(k => `${key(k)}: ${nested(value[k])}`).join(', ')} }` : `${name}{}`;
  }
  seen.delete(value);
  return out;
}
let activeRun;
window.__handbookRuns = {};
function writeLine(run, level, args) {
  if (!run || activeRun !== run) return;
  const line = document.createElement('div');
  line.className = `log log-${level}`;
  line.textContent = args.map(arg => inspect(arg)).join(' ');
  run.output.append(line);
}
function runCode(figure) {
  const editor = figure.querySelector('.code-editor');
  const code = editor.dataset.dirty ? editor.value : figure.querySelector('code').textContent;
  const output = figure.querySelector('.run-output');
  output.hidden = false;
  output.replaceChildren();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const run = {output};
  activeRun = run;
  const make = level => (...args) => writeLine(run, level, args);
  const fakeConsole = {log: make('log'), info: make('log'), debug: make('log'), warn: make('warn'), error: make('error'), table: make('log'), dir: make('log')};
  window.__handbookRuns[id] = {console: fakeConsole, fail: error => writeLine(run, 'error', [error])};
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `const {console, fail} = window.__handbookRuns[${JSON.stringify(id)}];\ntry {\n${code}\n} catch (error) { fail(error); }`;
  document.body.append(script);
  script.remove();
  setTimeout(() => {
    if (activeRun === run && !output.children.length) writeLine(run, 'muted', ['(нічого не виведено)']);
  }, 1500);
}
window.addEventListener('error', event => { if (activeRun && event.error) writeLine(activeRun, 'error', [event.error]); });
window.addEventListener('unhandledrejection', event => { if (activeRun) writeLine(activeRun, 'error', ['Uncaught (in promise)', event.reason]); });
function toggleEditor(figure, button) {
  const editor = figure.querySelector('.code-editor');
  const pre = figure.querySelector('pre');
  const editing = editor.hidden;
  if (editing && !editor.dataset.dirty) editor.value = figure.querySelector('code').textContent;
  editor.hidden = !editing;
  pre.hidden = editing;
  button.setAttribute('aria-pressed', String(editing));
  button.textContent = editing ? 'Оригінал' : 'Редагувати';
  if (editing) {
    editor.dataset.dirty = '1';
    editor.style.blockSize = `${Math.min(36, editor.value.split('\n').length + 1) * 1.5}em`;
    editor.focus();
  } else delete editor.dataset.dirty;
}

/* ---------- events ---------- */
$('search').addEventListener('input', () => { updateList(); });
$('search').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const first = filtered()[0];
    if (first) { go(first.id); if (mobile.matches) openSidebar(false); }
  }
  if (event.key === 'Escape') { $('search').value = ''; updateList(); $('search').blur(); }
});
$('search').addEventListener('focus', () => { if (mobile.matches) openSidebar(true); });
for (const radio of document.querySelectorAll('[name="mode"]')) radio.addEventListener('change', () => setMode(radio.value));
for (const radio of document.querySelectorAll('[name="status"]')) radio.addEventListener('change', () => {
  const active = current();
  if (active) { setRecord(active.id, {status: radio.value}); updateList(); }
});
$('bookmark').addEventListener('click', () => {
  const active = current();
  if (!active) return;
  setRecord(active.id, {bookmark: !record(active.id).bookmark});
  syncQuestionControls();
  updateList();
  toast(record(active.id).bookmark ? 'Додано в закладки.' : 'Прибрано із закладок.');
});
$('share').addEventListener('click', () => copy(location.href, 'Посилання скопійовано.'));
$('copy-progress').addEventListener('click', () => copy(allChecks.map(box => `${box.checked ? '[x]' : '[ ]'} ${box.parentElement.textContent.trim()}`).join('\n')));
$('theme').addEventListener('click', () => {
  state.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  save();
});
$('menu').addEventListener('click', () => openSidebar(!document.body.classList.contains('sidebar-open')));
$('backdrop').addEventListener('click', () => openSidebar(false));
$('help-btn').addEventListener('click', () => $('help').showModal());
for (const article of articles.values()) {
  article.querySelector('.answer').addEventListener('toggle', updateGrade);
}
$('export').addEventListener('click', () => {
  const payload = {app: handbook.storageKey, exportedAt: new Date().toISOString(), state};
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'}));
  const link = Object.assign(document.createElement('a'), {href: url, download: `${handbook.storageKey.split(':')[0]}-progress-${new Date().toISOString().slice(0, 10)}.json`});
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('import').addEventListener('change', async event => {
  const [file] = event.target.files;
  event.target.value = '';
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const incoming = payload.state ?? payload;
    if (!incoming || typeof incoming !== 'object' || (!incoming.questions && !incoming.checks)) throw Error('format');
    if (payload.app && payload.app.split(':')[0] !== handbook.storageKey.split(':')[0]) throw Error('app');
    if (!confirm('Замінити поточний прогрес даними з файлу?')) return;
    state = {...incoming, theme: state.theme, mode: state.mode};
    normalizeState();
    for (const box of allChecks) box.checked = Boolean(state.checks[box.parentElement.textContent.trim()]);
    save();
    render();
    toast('Прогрес завантажено.');
  } catch (error) {
    toast(error.message === 'app' ? 'Цей файл належить іншому посібнику.' : 'Не вдалося прочитати файл прогресу.');
  }
});
$('reset').addEventListener('click', () => {
  if (!confirm('Скинути статуси, закладки й чекліст? Цю дію не можна скасувати.')) return;
  state = {theme: state.theme, mode: state.mode};
  normalizeState();
  for (const box of allChecks) box.checked = false;
  save();
  render();
  toast('Прогрес скинуто.');
});

document.addEventListener('click', event => {
  const target = event.target;
  const codeButton = target.closest('[data-copy-code]');
  if (codeButton) {
    const figure = codeButton.closest('figure');
    const editor = figure.querySelector('.code-editor');
    copy(editor && !editor.hidden ? editor.value : figure.querySelector('code').textContent, 'Код скопійовано.');
  }
  const runButton = target.closest('[data-run-code]');
  if (runButton) runCode(runButton.closest('figure'));
  const editButton = target.closest('[data-edit-code]');
  if (editButton) toggleEditor(editButton.closest('figure'), editButton);
  const enCopy = target.closest('[data-copy-en]');
  if (enCopy) copy(enCopy.closest('.en-answer').querySelector('.en-text').innerText, 'Відповідь скопійовано.');
  const speakButton = target.closest('[data-speak]');
  if (speakButton) speak(speakButton);
  if (target.closest('[data-random]')) random();
  if (target.closest('[data-open-help]')) $('help').showModal();
  const grade = target.closest('[data-grade]');
  if (grade) {
    const active = current();
    if (active) {
      setRecord(active.id, {status: grade.dataset.grade});
      syncQuestionControls();
      const list = updateList();
      const index = list.findIndex(item => item.id === active.id);
      const next = list[index + 1] || list.find(item => item.id !== active.id && record(item.id).status !== 'done');
      if (next) go(next.id); else toast('Добірку пройдено.');
    }
  }
  if (target.closest('#toc a') && mobile.matches) openSidebar(false);
});

document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) { openSidebar(false); return; }
  if (isTyping(event.target) || $('help').open) return;
  const active = current();
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const actions = {
    '/': () => { $('search').focus(); $('search').select(); },
    '?': () => $('help').showModal(),
    ArrowRight: () => step(1), j: () => step(1), 'о': () => step(1),
    ArrowLeft: () => step(-1), k: () => step(-1), 'л': () => step(-1),
    r: random, 'к': random,
    m: () => setMode(MODES[(MODES.indexOf(mode()) + 1) % MODES.length]),
  };
  if (active) Object.assign(actions, {
    a: () => { const answer = articles.get(active.id).querySelector('.answer'); answer.open = !answer.open; },
    'ф': () => actions.a(),
    b: () => $('bookmark').click(), 'и': () => $('bookmark').click(),
    s: () => { const button = articles.get(active.id).querySelector('[data-speak]:not([hidden])'); if (button) speak(button); },
    'і': () => actions.s(),
    1: () => setRecord(active.id, {status: ''}),
    2: () => setRecord(active.id, {status: 'review'}),
    3: () => setRecord(active.id, {status: 'done'}),
  });
  const action = actions[key];
  if (!action) return;
  if (/^Arrow/.test(key) && event.target.closest('input')) return;
  event.preventDefault();
  action();
  if (['1', '2', '3'].includes(key)) { syncQuestionControls(); updateList(); }
});

window.addEventListener('hashchange', () => { if (getId() !== 'main') render(true); });
mobile.addEventListener('change', () => openSidebar(false));

/* ---------- demos ---------- */
for (const root of document.querySelectorAll('[data-demo]')) {
  try { demoInits[root.dataset.demo]?.(root); }
  catch (error) { console.error(`Demo ${root.dataset.demo} failed`, error); }
}

/* ---------- start ---------- */
document.querySelector(`[name="mode"][value="${MODES.includes(state.mode) ? state.mode : 'study'}"]`).checked = true;
document.documentElement.dataset.theme = state.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.add('enhanced');
updateProgress();
render();
