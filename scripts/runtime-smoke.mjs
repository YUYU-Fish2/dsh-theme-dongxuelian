import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// Official bootstrap recipe researched in oil-oil/dsh-theme (MIT); see notices.
async function main() {
  const root = process.env.DSH_RUNTIME_ROOT ?? 'E:/dsh/resources/app.asar/dsh';
  const packageRoot = join(root, 'node_modules/@deepseek-ai');
  const runtimeVersion = JSON.parse(readFileSync(join(packageRoot, 'dsh-client-modules/package.json'), 'utf8')).version;
  const facade = { mode: 'queue', pendingQueue: [], load(row) { this.pendingQueue.push(row); } };
  const context = createContext({ window: { __ModuleLoader__: facade }, console, queueMicrotask });
  const loaderFile = join(packageRoot, 'dsh-client-modules/lib/client.js');
  runInContext(readFileSync(loaderFile, 'utf8'), context, { filename: loaderFile });
  assert.equal(facade.pendingQueue.length, 1);
  const registration = facade.pendingQueue.shift();
  const exports = registration.factory((specifier) => { throw new Error(`Unexpected loader dependency ${specifier}`); });
  const modules = exports.createClientModuleSystem(facade, { id: registration.id, exports }, {
    boot: { rev: 'dongxuelian-smoke', entries: [], batches: [] },
    staticModules: {},
    loadBundle: async (url) => { throw new Error(`Unexpected network bundle ${url}`); },
  });
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');
  runInContext(source, context, { filename: 'dsh-theme-dongxuelian/client.js' });
  const plugin = await modules.import('dsh-theme-dongxuelian');
  assert.equal(typeof plugin.apply, 'function');
  assert.deepEqual([...plugin.inject], ['theme']);
  let tokens;
  let cleanup;
  plugin.apply({
    theme: {
      getTheme: () => ({ active: { colorScheme: 'light' } }),
      overrideTokens(owner, values) { tokens = values; return () => {}; },
    },
    on() { return () => {}; },
    effect(setup) { cleanup = setup(); },
  });
  const themeSource = readFileSync(join(packageRoot, 'dsh-client-ui-theme/lib/client.js'), 'utf8');
  const names = Object.keys(tokens);
  assert.ok(names.length > 0);
  for (const name of names) assert.ok(themeSource.includes(name), `宿主中未发现 token ${name}`);
  cleanup();
  console.log(JSON.stringify({ runtimeVersion, imported: 'dsh-theme-dongxuelian', tokenNamesFound: names.length, result: 'PASS', scope: 'real ModuleLoader import + token presence, not window UI' }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
