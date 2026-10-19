import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer, request } from 'node:http';
import { test } from 'node:test';
import { apply } from '../index.js';

const prefix = '/dongxuelian-theme/assets';
const files = [
  { name: 'avatar.webp', path: '../assets/characters/web/avatar.webp', budget: 40_000 },
  { name: 'reading.webp', path: '../assets/scenes/web/reading.webp', budget: 550_000 },
];

async function fixture(t) {
  const routes = new Set();
  const effects = [];
  const context = {
    webServer: { register(route) { routes.add(route); return () => routes.delete(route); } },
    effect(setup) { const dispose = setup(); effects.push(dispose); return dispose; },
    inject(names, setup) { assert.deepEqual(names, ['webServer']); return setup(context); },
  };
  const stop = () => { for (const dispose of effects.splice(0).reverse()) dispose?.(); };
  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const route = [...routes].find((row) => row.kind === 'exact' ? pathname === row.path
      : pathname === row.path || pathname.startsWith(row.path + '/'));
    if (!route) { res.writeHead(404); res.end(); return; }
    try { await route.handler(req, res); }
    catch (error) { res.writeHead(500); res.end(error.message); }
  });
  t.after(async () => { stop(); await new Promise((resolve) => server.close(resolve)); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  await apply(context);
  assert.equal(routes.size, 1, '应注册一条独占命名空间的资源白名单路由');
  const fetch = (path, method = 'GET') => new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: server.address().port, path, method }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.end();
  });
  return { fetch, stop, routes };
}

test('GET 仅提供两个独立 WebP 文件，MIME 与文件内容一致', async (t) => {
  const host = await fixture(t);
  for (const file of files) {
    const response = await host.fetch(`${prefix}/${file.name}?v=preview`);
    assert.equal(response.status, 200);
    assert.equal(response.headers['content-type'], 'image/webp');
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    const bytes = readFileSync(new URL(file.path, import.meta.url));
    assert.deepEqual(response.body, bytes);
    assert.ok(bytes.length < file.budget, '发布导出应符合头像/场景独立预算');
  }
});

test('HEAD 返回正确长度与 MIME，但正文为空', async (t) => {
  const host = await fixture(t);
  for (const file of files) {
    const response = await host.fetch(`${prefix}/${file.name}`, 'HEAD');
    assert.equal(response.status, 200);
    assert.equal(response.headers['content-type'], 'image/webp');
    assert.equal(Number(response.headers['content-length']), readFileSync(new URL(file.path, import.meta.url)).length);
    assert.equal(response.body.length, 0);
  }
});

test('其他方法返回 405，并声明 GET/HEAD', async (t) => {
  const host = await fixture(t);
  for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
    const response = await host.fetch(`${prefix}/avatar.webp`, method);
    assert.equal(response.status, 405);
    assert.match(response.headers.allow, /GET/);
    assert.match(response.headers.allow, /HEAD/);
  }
});

test('未知文件、母版、嵌套路径与编码穿越均不可读取', async (t) => {
  const host = await fixture(t);
  for (const path of ['', '/', '/avatar.png', '/reading.png', '/sidebar-character.webp', '/README.md', '/package.json', '/__proto__',
    '/constructor', '/missing.webp', '/avatar.webp/extra', '/../package.json',
    '/%2e%2e/package.json', '/%2e%2e%2fpackage.json', '/%2e%2e%5cpackage.json',
    '/%252e%252e%252fpackage.json', '/%61vatar.webp', '/%00avatar.webp', '/%']) {
    const response = await host.fetch(prefix + path);
    assert.equal(response.status, 404, path);
    assert.ok(!response.body.includes(Buffer.from('"name": "dsh-theme-dongxuelian"')), path);
  }
});

test('停用后路由移除，HEAD/GET 不再提供图片', async (t) => {
  const host = await fixture(t);
  host.stop();
  host.stop();
  assert.equal(host.routes.size, 0);
  for (const method of ['GET', 'HEAD']) {
    for (const file of files) assert.equal((await host.fetch(`${prefix}/${file.name}`, method)).status, 404);
  }
});
