// Checks that every external link in content/ still opens. Needs network access: npm run check:links
import {readFileSync, readdirSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const files = ['README.md', ...readdirSync(new URL('content/', root), {recursive: true}).filter(f => f.endsWith('.md')).map(f => `content/${f}`)];
const links = new Map();
for (const file of files) {
  for (const [, url] of readFileSync(new URL(file, root), 'utf8').matchAll(/\]\((https:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/g)) {
    if (!links.has(url)) links.set(url, new Set());
    links.get(url).add(file);
  }
}
const headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', accept: 'text/html,*/*'};
async function check(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {headers, redirect: 'follow', signal: AbortSignal.timeout(20000)});
      await response.body?.cancel();
      if (response.ok || [401, 403, 429].includes(response.status)) return {url, status: response.status, final: response.url};
      if (attempt) return {url, status: response.status, final: response.url, failed: true};
    } catch (error) {
      if (attempt) return {url, status: error.name, failed: true};
    }
  }
}
const queue = [...links.keys()];
const results = [];
await Promise.all(Array.from({length: 8}, async () => {
  while (queue.length) results.push(await check(queue.shift()));
}));
const failed = results.filter(r => r.failed);
const blocked = results.filter(r => !r.failed && r.status >= 400);
for (const r of blocked) console.warn(`? ${r.status} ${r.url} (сайт обмежує автоматичні запити, перевір вручну)`);
for (const r of failed) console.error(`✗ ${r.status} ${r.url}\n    у файлах: ${[...links.get(r.url)].join(', ')}`);
console.log(`Перевірено ${results.length} посилань: помилок ${failed.length}, потребують ручної перевірки ${blocked.length}.`);
process.exitCode = failed.length ? 1 : 0;
