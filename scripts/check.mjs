import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { Script } from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
assert.equal(pkg.name, 'dsh-theme-dongxuelian');
assert.equal(pkg.type, 'module');
assert.equal(pkg.dsh.client.platform, 'web');
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
assert.equal(pkg.exports['./client'], './client.js');
assert.ok(!pkg.scripts.install && !pkg.scripts.postinstall && !pkg.scripts.prepack);
const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL('index.js', root))], { encoding: 'utf8' });
assert.equal(result.status, 0, result.stderr);
new Script(readFileSync(new URL('client.js', root), 'utf8'), { filename: 'client.js' });
for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'README.md', 'LICENSE']) {
  assert.ok(pkg.files.includes(file), `发布文件白名单缺少 ${file}`);
}
assert.ok(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-renderer'));
for (const name of ['avatar', 'sidebar-character']) {
  const file = `assets/characters/web/${name}.webp`;
  assert.ok(pkg.files.includes(file), `发布文件白名单缺少 ${file}`);
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.ok(bytes.length < 40_000, `${file} 应小于 40KB`);
}
console.log('PASS: JS syntax, client/package contract and package allowlist');
