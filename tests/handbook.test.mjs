import {readFileSync, readdirSync, existsSync, writeFileSync, mkdtempSync, rmSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const config = JSON.parse(read('handbook.config.json'));
const html = read('index.html');
const articles = [...html.matchAll(/<article id="([^"]+)" class="question[^"]*"[^>]*>([\s\S]*?)<\/article>/g)];
const ids = [...html.matchAll(/(?<![\w-])id="([a-z0-9-]+)"/g)].map(match => match[1]);
const chapterDirs = readdirSync(new URL('content/', root)).filter(dir => /^\d\d-/.test(dir)).sort();
const sources = chapterDirs.map(dir => ({dir, text: read(`content/${dir}/README.md`)}));

const ALLOWED_DOMAINS = [
  'developer.mozilla.org', 'react.dev', 'typescriptlang.org', 'redux-toolkit.js.org', 'redux.js.org', 'react-redux.js.org',
  'web.dev', 'developer.chrome.com', 'whatwg.org', 'w3.org', 'w3c.github.io', 'tc39.es', 'httpwg.org', 'rfc-editor.org',
  'datatracker.ietf.org', 'testing-library.com', 'vitest.dev', 'mswjs.io', 'playwright.dev', 'vite.dev', 'owasp.org',
  'nodejs.org', 'webpack.js.org', 'nextjs.org', 'tanstack.com', 'zod.dev', 'module-federation.io', 'single-spa.js.org',
  'docs.github.com', 'en.wikipedia.org', 'dictionary.cambridge.org', 'learnenglish.britishcouncil.org', 'istqb.org',
  'json-schema.org', 'spec.openapis.org', 'swagger.io', 'graphql.org', 'grafana.com', 'k6.io', 'docs.gitlab.com',
  'docs.docker.com', 'postgresql.org', 'sqlite.org', 'dev.mysql.com', 'cucumber.io', 'pact.io', 'martinfowler.com',
  'jestjs.io', 'cypress.io', 'selenium.dev', 'deque.com', 'git-scm.com', 'docs.npmjs.com', 'typescript-eslint.io',
  'storybook.js.org', 'stryker-mutator.io', 'eslint.org', 'immerjs.github.io', 'react-hook-form.com', 'react.dev',
];
const allowed = host => ALLOWED_DOMAINS.some(domain => host === domain || host.endsWith(`.${domain}`));

test('markdown cards follow the content contract', () => {
  for (const {dir, text} of sources) {
    const number = Number(dir.slice(0, 2));
    assert.match(text, /^# .+/, `${dir}: chapter title`);
    const headings = [...text.matchAll(/^## (\d+)\.(\d+)\. .+$/gm)];
    assert.ok(headings.length > 0, `${dir}: has cards`);
    headings.forEach(([, major, minor], i) => {
      assert.equal(Number(major), number, `${dir}: card ${major}.${minor} chapter`);
      assert.equal(Number(minor), i + 1, `${dir}: sequential numbering at ${major}.${minor}`);
      assert.ok(text.includes(`<a id="q-${major}-${minor}"></a>`), `anchor q-${major}-${minor}`);
    });
    const fences = text.match(/^```/gm) || [];
    assert.equal(fences.length % 2, 0, `${dir}: balanced code fences`);
  }
});

test('stable ids from earlier editions are preserved', () => {
  const expected = (config.stableCounts || []).flatMap((n, i) => Array.from({length: n}, (_, j) => `q-${i + 1}-${j + 1}`));
  const rendered = new Set(articles.map(match => match[1]));
  for (const id of expected) assert.ok(rendered.has(id), id);
});

test('every card renders an answer with an English interview answer first', () => {
  const total = sources.reduce((n, {text}) => n + (text.match(/^## \d+\.\d+\. /gm) || []).length, 0);
  assert.equal(articles.length, total);
  for (const [, id, body] of articles) {
    assert.ok(body.includes('class="answer"'), `${id}: answer`);
    const answer = body.split('class="answer-body"')[1] || '';
    assert.ok(answer.trimStart().startsWith('><section class="en-answer" lang="en">'), `${id}: EN answer first`);
    const en = body.match(/<div class="en-text">([\s\S]*?)<\/div><\/section>/)[1].replace(/<[^>]+>/g, ' ');
    const words = en.split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 20, `${id}: English answer has ${words} words`);
    assert.doesNotMatch(en, /[\u0400-\u04FF]/, `${id}: English answer has no Cyrillic`);
  }
  for (const [, id, body] of articles.filter(([, , b]) => b.includes('Показати розв’язок'))) {
    assert.ok(body.indexOf('class="prompt"') < body.indexOf('class="answer"'), `${id}: task statement before solution`);
  }
});

test('anchors resolve and external links point to allowed https sources', () => {
  assert.equal(new Set(ids).size, ids.length, 'unique ids');
  for (const [, target] of html.matchAll(/href="#([^"]*)"/g)) {
    if (target.startsWith('i-')) continue;
    assert.ok(ids.includes(target), `#${target}`);
  }
  for (const [, href] of html.matchAll(/<a href="(https?:[^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'));
    assert.equal(url.protocol, 'https:', href);
    if (href === config.repository) continue;
    assert.ok(allowed(url.hostname), `domain not in allowlist: ${url.hostname}`);
  }
  for (const [, path] of read('README.md').matchAll(/\]\(((?:content\/)[^\s)#]+)\)/g)) {
    assert.ok(existsSync(new URL(path, root)), path);
  }
});

test('compiled page is self-contained and its script parses', () => {
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+rel="stylesheet"|<link[^>]+href="https?:/i);
  assert.doesNotMatch(html, /src="https?:/i);
  assert.match(html, /<span class="token keyword">/);
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert.ok(scripts.length >= 2);
  for (const source of scripts) assert.doesNotThrow(() => new Script(source));
});

test('build is deterministic and index.html is current', () => {
  execFileSync(process.execPath, ['scripts/build.mjs'], {cwd: fileURLToPath(root), stdio: 'pipe'});
  assert.equal(read('index.html'), html);
});

test('diagrams are embedded safely and listed in the visual index', () => {
  const images = [...html.matchAll(/<figure class="diagram"><img src="data:image\/svg\+xml;base64,([^"]+)" alt="([^"]+)"/g)];
  for (const [, encoded, alt] of images) {
    const svg = Buffer.from(encoded, 'base64').toString('utf8');
    assert.match(svg, /^<svg /, alt);
    assert.doesNotMatch(svg, /<(?:script|foreignObject)\b|\b(?:href|on\w+)=/i, alt);
  }
  const visualIndex = html.match(/<details class="visual-index">([\s\S]*?)<\/details>/)[1];
  for (const [, id, body] of articles) {
    if (/class="(?:diagram|visual-flow|demo|code runnable)"/.test(body)) assert.ok(visualIndex.includes(`href="#${id}"`), id);
  }
});

test('interactive demos are bundled exactly once per used demo', () => {
  const used = new Set([...html.matchAll(/data-demo="([a-z0-9-]+)"/g)].map(match => match[1]));
  const bundle = html.match(/const demoInits = \{([\s\S]*?)\n\};/)[1];
  for (const name of used) {
    assert.ok(existsSync(new URL(`scripts/demos/${name}.html`, root)), name);
    if (existsSync(new URL(`scripts/demos/${name}.js`, root))) assert.ok(bundle.includes(`"${name}":`), `${name} bundled`);
  }
});

test('runnable examples execute as ES modules without uncaught errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'handbook-run-'));
  try {
    let count = 0;
    for (const {dir: chapter, text} of sources) {
      for (const [, code] of text.matchAll(/^```javascript run\n([\s\S]*?)^```$/gm)) {
        count++;
        const file = join(dir, `${chapter}-${count}.mjs`);
        writeFileSync(file, code);
        const result = spawnSync(process.execPath, [file], {encoding: 'utf8', timeout: 5000});
        assert.equal(result.status, 0, `${chapter} runnable #${count} failed:\n${code}\n${result.stderr}`);
      }
    }
    assert.ok(count > 0, 'at least one runnable example');
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test('checklist is rendered as interactive checkboxes', () => {
  assert.ok((html.match(/<input type="checkbox" data-check>/g) || []).length >= 10);
});
