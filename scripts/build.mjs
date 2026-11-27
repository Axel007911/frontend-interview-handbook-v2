import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {Marked, Renderer} from 'marked';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

loadLanguages(['typescript', 'jsx', 'tsx', 'bash', 'json', 'css', 'markup', 'sql', 'yaml', 'gherkin', 'http']);
const aliases = {js: 'javascript', ts: 'typescript', html: 'markup', sh: 'bash', shell: 'bash', yml: 'yaml'};

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const config = JSON.parse(read('handbook.config.json'));
const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const plain = text => text.replace(/`/g, '');
const hasCyrillic = text => /[\u0400-\u04FF]/.test(text.replace(/(?<!!)\[[^\]]*\](?!\()/g, ''));

const SECTIONS = {
  en: 'Interview answer (EN)',
  followups: 'Можливі уточнення',
  related: ['Пов’язані питання', "Пов'язані питання"],
  docs: 'Документація',
};

const usedDemos = new Set();
const demo = name => {
  if (!/^[a-z0-9-]+$/.test(name) || !existsSync(new URL(`scripts/demos/${name}.html`, root))) {
    throw Error(`Unknown demo "${name}"`);
  }
  usedDemos.add(name);
  return `<section class="demo" data-demo="${name}">${read(`scripts/demos/${name}.html`)}</section>`;
};

const renderer = new Renderer();
renderer.html = ({text}) => escape(text);
renderer.link = function ({href, tokens}) {
  const label = this.parser.parseInline(tokens);
  const question = href.match(/^(?:\.\.\/\d\d-[a-z0-9-]+\/README\.md)?(#q-\d+-\d+)$/);
  if (question) href = question[1];
  if (/^#[a-z0-9-]+$/.test(href)) return `<a href="${escape(href)}">${label}</a>`;
  if (/^https:\/\//.test(href)) return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  return label;
};
renderer.image = ({href, text}) => {
  const asset = href.match(/^\.\.\/diagrams\/([a-z0-9-]+\.svg)$/);
  if (!asset) return escape(text);
  // Diagrams sit on a light card in both themes, so drop the OS-level dark-mode override inside the SVG.
  const svg = read(`content/diagrams/${asset[1]}`).replace(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const size = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  if (!size) throw Error(`Missing dimensions for ${asset[1]}`);
  return `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" alt="${escape(text)}" width="${size[1]}" height="${size[2]}" loading="lazy">`;
};
renderer.paragraph = function ({tokens}) {
  if (tokens.length === 1 && tokens[0].type === 'image') {
    return `<figure class="diagram">${this.parser.parseInline(tokens)}<figcaption>${escape(tokens[0].text)}</figcaption></figure>\n`;
  }
  return `<p>${this.parser.parseInline(tokens)}</p>\n`;
};
renderer.table = function (token) {
  const cell = (c, tag) => `<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
  const head = `<tr>${token.header.map(c => cell(c, 'th')).join('')}</tr>`;
  const rows = token.rows.map(row => `<tr>${row.map(c => cell(c, 'td')).join('')}</tr>`).join('');
  return `<div class="table-wrap" tabindex="0"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
};
renderer.code = ({text, lang = ''}) => {
  const [rawName = '', ...flags] = (lang || '').trim().split(/\s+/);
  let name = aliases[rawName] || rawName;
  if (['typescript', 'javascript'].includes(name) && /<\/[A-Za-z]|\/>/.test(text)) name = name === 'typescript' ? 'tsx' : 'jsx';
  if (name === 'flow') {
    const steps = text.split('\n').filter(Boolean).map(line => {
      const [title, detail] = line.split(' | ');
      return `<li><strong>${escape(title)}</strong>${detail ? `<span>${escape(detail)}</span>` : ''}</li>`;
    });
    return `<ol class="visual-flow">${steps.join('')}</ol>`;
  }
  if (name === 'demo') return demo(text.trim());
  const grammar = Object.hasOwn(Prism.languages, name) ? Prism.languages[name] : null;
  const runnable = flags.includes('run') && (aliases[rawName] || rawName) === 'javascript';
  const label = rawName || 'text';
  const actions = [
    runnable ? '<button type="button" class="run-btn" data-run-code>Запустити</button><button type="button" data-edit-code aria-pressed="false">Редагувати</button>' : '',
    '<button type="button" data-copy-code>Копіювати</button>',
  ].join('');
  const body = grammar ? Prism.highlight(text, grammar, name) : escape(text);
  const extra = runnable ? '<textarea class="code-editor" hidden spellcheck="false" autocapitalize="off" aria-label="Редагування коду"></textarea><div class="run-output" role="log" aria-live="polite" hidden></div>' : '';
  return `<figure class="code${runnable ? ' runnable' : ''}"><figcaption><span class="code-lang">${escape(label)}${runnable ? ' · можна запустити' : ''}</span><span class="code-actions">${actions}</span></figcaption><pre tabindex="0"><code>${body}</code></pre>${extra}</figure>`;
};
const markdown = new Marked({renderer, gfm: true});

function splitSections(answer) {
  const parts = answer.split(/^#### (.+)$/m);
  const sections = [{name: '', body: parts[0]}];
  for (let i = 1; i < parts.length; i += 2) sections.push({name: parts[i].trim(), body: parts[i + 1]});
  return sections;
}

function parseCard(entry, chapter, chapterNumber) {
  const [heading, ...lines] = entry.trimEnd().split('\n');
  const match = heading.match(/^(\d+)\.(\d+)\. (.+)$/);
  if (!match) throw Error(`Bad card heading "${heading}" in ${chapter.dir}`);
  const [, major, minor, title] = match;
  if (Number(major) !== chapterNumber) throw Error(`Card ${major}.${minor} is in chapter ${chapterNumber}`);
  const id = `q-${major}-${minor}`;
  const body = lines.join('\n');
  if (!body.includes(`<a id="${id}"></a>`)) throw Error(`Missing anchor for ${id}`);
  const [prompt, kind, answer] = body.replace(`<a id="${id}"></a>`, '').split(/^### (Пояснення|Розв’язок)\s*$/m);
  if (!answer) throw Error(`Missing "### Пояснення" or "### Розв’язок" in ${id}`);

  const sections = splitSections(answer);
  if (sections[0].body.trim()) throw Error(`${id}: text before "#### ${SECTIONS.en}"`);
  const en = sections[1];
  if (!en || en.name !== SECTIONS.en) throw Error(`${id}: "#### ${SECTIONS.en}" must be the first subsection`);

  const tokens = markdown.lexer(en.body);
  const enTokens = [];
  let i = 0;
  for (; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'space') { enTokens.push(token); continue; }
    if (['paragraph', 'list', 'blockquote'].includes(token.type) && !hasCyrillic(token.raw) && !/!\[|```/.test(token.raw)) enTokens.push(token);
    else break;
  }
  const enMarkdown = enTokens.map(t => t.raw).join('').trim();
  if (!enMarkdown) throw Error(`${id}: empty English answer`);
  let explanation = tokens.slice(i).map(t => t.raw).join('');
  let followups = '', related = '', docs = '';
  for (const section of sections.slice(2)) {
    if (section.name === SECTIONS.followups) followups = section.body;
    else if (SECTIONS.related.includes(section.name)) related = section.body;
    else if (section.name === SECTIONS.docs) docs = section.body;
    else explanation += `\n#### ${section.name}\n${section.body}`;
  }
  const answerHtml = markdown.parse(explanation);
  const promptHtml = markdown.parse(prompt.trim());
  const isTask = kind === 'Розв’язок';
  const kinds = [];
  if (/class="diagram"|class="visual-flow"/.test(answerHtml + promptHtml)) kinds.push('diagram');
  if (/class="demo"/.test(answerHtml + promptHtml)) kinds.push('demo');
  if (/class="code runnable"/.test(answerHtml + promptHtml)) kinds.push('run');
  return {
    id, number: `${major}.${minor}`, title, isTask, kinds,
    words: enMarkdown.replace(/\[[^\]]*\]/g, 'x').split(/\s+/).filter(Boolean).length,
    html: {prompt: promptHtml, en: markdown.parse(enMarkdown), explanation: answerHtml,
      followups: followups.trim() && markdown.parse(followups), related: related.trim() && markdown.parse(related), docs: docs.trim() && markdown.parse(docs)},
  };
}

const chapterDirs = readdirSync(new URL('content/', root)).filter(dir => /^\d\d-/.test(dir)).sort();
const chapters = chapterDirs.map(dir => {
  const source = read(`content/${dir}/README.md`);
  const [intro, ...entries] = source.split(/^## /m);
  const title = intro.match(/^# (.+)/m)?.[1];
  if (!title) throw Error(`Missing "# Title" in ${dir}`);
  const introText = intro.replace(/^# .+\n?/m, '').trim();
  const chapter = {dir, title, number: Number(dir.slice(0, 2)), intro: introText && markdown.parse(introText)};
  chapter.items = entries.map(entry => parseCard(entry, chapter, chapter.number));
  chapter.items.forEach((item, i) => {
    if (item.id !== `q-${chapter.number}-${i + 1}`) throw Error(`Card numbering gap in ${dir}: expected q-${chapter.number}-${i + 1}, got ${item.id}`);
  });
  return chapter;
});

const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const cardHtml = (chapter, item) => {
  const {html} = item;
  const en = `<section class="en-answer" lang="en"><header><span class="en-badge">EN</span><strong>Interview answer</strong><span class="en-tools"><button type="button" data-speak hidden>${icon('speaker')}<span>Озвучити</span></button><button type="button" data-copy-en>${icon('copy')}<span>Копіювати</span></button></span></header><div class="en-text">${html.en}</div></section>`;
  const followups = html.followups ? `<section class="followups"><h3>Можливі уточнення</h3>${html.followups}</section>` : '';
  const related = html.related ? `<nav class="related" aria-label="Пов’язані питання"><h3>Пов’язані питання</h3>${html.related}</nav>` : '';
  const docs = html.docs ? `<aside class="docs"><h3>${icon('book')}Документація</h3>${html.docs}</aside>` : '';
  const summary = item.isTask
    ? '<span class="when-closed">Показати розв’язок</span><span class="when-open">Сховати розв’язок</span>'
    : '<span class="when-closed">Показати відповідь</span><span class="when-open">Сховати відповідь</span>';
  return `<article id="${item.id}" class="question${item.isTask ? ' is-task' : ''}" hidden>
<header class="q-head"><p class="q-meta"><span>${item.isTask ? 'Задача' : 'Питання'} ${item.number}</span></p><h2 tabindex="-1">${markdown.parseInline(item.title)}</h2></header>
${html.prompt ? `<div class="prompt">${html.prompt}</div>` : ''}
<details class="answer"><summary>${summary}<kbd>A</kbd></summary><div class="answer-body">${en}<div class="explanation">${html.explanation}</div>${followups}${related}${docs}</div></details>
</article>`;
};

const all = chapters.flatMap(chapter => chapter.items.map(item => ({chapter, item})));
const cards = all.map(({chapter, item}) => cardHtml(chapter, item)).join('\n');
const toc = chapters.map(chapter => `<details class="toc-chapter" data-chapter="${chapter.dir}"><summary><span class="toc-title">${escape(chapter.title)}</span><span class="toc-count" data-chapter-count="${chapter.dir}">${chapter.items.length}</span></summary><ol>${chapter.items.map(item => `<li data-id="${item.id}"><a href="#${item.id}"><span class="toc-num">${item.number}</span><span class="toc-label">${escape(plain(item.title))}</span></a></li>`).join('')}</ol></details>`).join('\n');
const chapterCards = chapters.map(chapter => {
  const tasks = chapter.items.filter(item => item.isTask).length;
  const label = tasks === chapter.items.length ? `${tasks} задач` : `${chapter.items.length} карток`;
  return `<li><a class="chapter-card" href="#${chapter.items[0].id}" data-chapter-card="${chapter.dir}"><span class="chapter-num">${String(chapter.number).padStart(2, '0')}</span><strong>${escape(chapter.title)}</strong><span class="chapter-meta"><span>${label}</span><span data-chapter-done="${chapter.dir}"></span></span><span class="chapter-bar"><i data-chapter-bar="${chapter.dir}"></i></span></a></li>`;
}).join('');
const kindLabels = {diagram: 'схема', demo: 'демо', run: 'запуск коду'};
const visualIndex = chapters.flatMap(chapter => {
  const visual = chapter.items.filter(item => item.kinds.length);
  if (!visual.length) return [];
  return [`<section><h3>${escape(chapter.title)}</h3><ul>${visual.map(item => `<li><a href="#${item.id}">${escape(plain(item.title))}</a> ${item.kinds.map(k => `<span class="kind kind-${k}">${kindLabels[k]}</span>`).join('')}</li>`).join('')}</ul></section>`];
}).join('\n');
const visualCount = all.filter(({item}) => item.kinds.length).length;

const checklistSource = existsSync(new URL('content/checklist.md', root)) ? read('content/checklist.md') : '';
const checklist = markdown.parse(checklistSource.replace(/^# .+\n/, '')).replace(/<input disabled="" type="checkbox">/g, '<input type="checkbox" data-check>');
const guideSource = existsSync(new URL('content/preparation.md', root)) ? read('content/preparation.md') : '';
const guide = markdown.parse(guideSource).replace(/<td style="text-align:right">(\d+)%<\/td>/g,
  (_, share) => `<td style="text-align:right"><div class="study-share"><meter min="0" max="100" value="${share}" aria-label="${share}%"></meter><span>${share}%</span></div></td>`);

const demoScripts = [...usedDemos].sort()
  .filter(name => existsSync(new URL(`scripts/demos/${name}.js`, root)))
  .map(name => `${JSON.stringify(name)}: ${read(`scripts/demos/${name}.js`).trim()}`).join(',\n');

const data = {
  storageKey: config.storageKey,
  legacyStorageKeys: config.legacyStorageKeys || [],
  title: config.title,
  chapters: chapters.map(({dir, title}) => ({dir, title})),
  items: all.map(({chapter, item}) => ({id: item.id, number: item.number, title: plain(item.title), chapter: chapter.dir, task: item.isTask})),
};
const json = JSON.stringify(data).replaceAll('<', '\\u003c');
const totalTasks = all.filter(({item}) => item.isTask).length;
const values = {
  title: config.title, role: config.role, description: config.description, lead: config.lead,
  palette: config.palette || 'indigo', faviconColor: encodeURIComponent(config.themeColor || '#3b5bdb'),
  searchPlaceholder: config.searchPlaceholder, storageKey: config.storageKey, themeColor: config.themeColor || '#3b5bdb',
  repository: config.repository || '', total: String(all.length), questions: String(all.length - totalTasks),
  tasks: String(totalTasks), chapters: String(chapters.length), visuals: String(visualCount),
  firstId: all[0].item.id, firstChapter: chapters[0].title,
};
let html = read('scripts/template.html').replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in values)) throw Error(`Unknown template value ${key}`);
  return escape(values[key]);
});
html = html
  .replace('/* STYLE */', () => read('scripts/style.css'))
  .replace('<!-- ICONS -->', () => read('scripts/icons.svg'))
  .replace('<!-- TOC -->', () => toc)
  .replace('<!-- CHAPTERS -->', () => chapterCards)
  .replace('<!-- QUESTIONS -->', () => cards)
  .replace('<!-- CHECKLIST -->', () => checklist)
  .replace('<!-- GUIDE -->', () => guide)
  .replace('<!-- VISUAL INDEX -->', () => visualIndex)
  .replace('/* DATA */', () => json)
  .replace('/* DEMOS */', () => demoScripts)
  .replace('/* CLIENT */', () => read('scripts/client.js'));
writeFileSync(new URL('index.html', root), html);

const short = all.filter(({item}) => item.words < 20).map(({item}) => item.id);
console.log(`Built ${all.length} cards (${totalTasks} tasks) in ${chapters.length} chapters, ${usedDemos.size} demos.`);
if (short.length) console.warn(`Short English answers (<20 words): ${short.join(', ')}`);
