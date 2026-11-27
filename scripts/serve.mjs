// Minimal static server for local preview and e2e tests: node scripts/serve.mjs [port]
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {'.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8'};
createServer(async (request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = path.endsWith('/') ? `${path}index.html` : path;
  try {
    const body = await readFile(root + file);
    response.writeHead(200, {'content-type': types[extname(file)] || 'application/octet-stream'});
    response.end(body);
  } catch {
    response.writeHead(404, {'content-type': 'text/plain'});
    response.end('Not found');
  }
}).listen(port, () => console.log(`Handbook: http://localhost:${port}/`));
