import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const clientFile = new URL('../client.js', import.meta.url);
const owner = 'dsh-theme-dongxuelian';

function loadPlugin() {
  assert.ok(existsSync(clientFile), '基础主题客户端尚未实现');
  let registration;
  runInNewContext(readFileSync(clientFile, 'utf8'), {
    window: { __ModuleLoader__: { load(value) { registration = value; } } },
  });
  assert.equal(registration.id, owner);
  return registration.factory((name) => { throw new Error(`未声明的依赖 ${name}`); });
}

function host(scheme = 'light') {
  let current = scheme;
  let depth = 0;
  let calls = 0;
  const layers = new Map([['foreign-theme', { foreign: true }]]);
  const listeners = new Set();
  const effects = [];
  const publish = () => {
    assert.ok(++depth < 8, '同步 theme/change 造成了递归循环');
    try { for (const listener of [...listeners]) listener(snapshot()); }
    finally { depth--; }
  };
  const snapshot = () => ({ preference: 'system', active: { colorScheme: current } });
  return {
    layers, listeners,
    get overrideCalls() { return calls; },
    change(value) { current = value; publish(); },
    stop() { for (const dispose of effects.splice(0).reverse()) dispose?.(); },
    context: {
      theme: {
        getTheme: snapshot,
        setTheme() { assert.fail('不得改写用户主题偏好'); },
        overrideTokens(source, tokens) {
          assert.equal(source, owner);
          for (const value of Object.values(tokens)) {
            assert.equal(typeof value.light, 'string');
            assert.equal(typeof value.dark, 'string');
          }
          calls++;
          const layer = { tokens };
          layers.set(source, layer);
          publish();
          return () => {
            if (layers.get(source) !== layer) return;
            layers.delete(source);
            publish();
          };
        },
      },
      effect(setup) { effects.push(setup()); },
      on(name, listener) {
        assert.equal(name, 'theme/change');
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    },
  };
}

test('浅色覆盖经过核算的正文、次文字和背景，不写用户偏好', () => {
  const plugin = loadPlugin();
  assert.deepEqual([...plugin.inject], ['theme']);
  const runtime = host();
  plugin.apply(runtime.context);
  const tokens = runtime.layers.get(owner).tokens;
  assert.equal(tokens['--dsw-alias-bg-base'].light, '#F7F4EF');
  assert.equal(tokens['--dsw-alias-label-primary'].light, '#4C4540');
  assert.equal(tokens['--dsw-alias-label-secondary'].light, '#716860');
  runtime.stop();
});

test('深色不覆盖，回到浅色恢复，重复同色事件不累加覆盖', () => {
  const runtime = host('dark');
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.layers.has(owner), false);
  runtime.change('light');
  runtime.change('light');
  assert.equal(runtime.overrideCalls, 1);
  runtime.change('dark');
  assert.equal(runtime.layers.has(owner), false);
  runtime.change('light');
  assert.equal(runtime.overrideCalls, 2);
  runtime.stop();
});

test('同步主题事件不会递归，停用释放自己的覆盖和监听且保留其他插件', () => {
  const runtime = host();
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.overrideCalls, 1);
  assert.equal(runtime.listeners.size, 1);
  runtime.stop();
  assert.equal(runtime.listeners.size, 0);
  assert.equal(runtime.layers.has(owner), false);
  assert.deepEqual(runtime.layers.get('foreign-theme'), { foreign: true });
  runtime.change('dark');
  runtime.change('light');
  assert.equal(runtime.overrideCalls, 1);
});

test('反复启停后只保留一层与一个监听，最后完全释放', () => {
  const runtime = host();
  const plugin = loadPlugin();
  for (let n = 0; n < 3; n++) {
    plugin.apply(runtime.context);
    assert.equal(runtime.layers.size, 2);
    assert.equal(runtime.listeners.size, 1);
    runtime.stop();
    assert.equal(runtime.layers.size, 1);
    assert.equal(runtime.listeners.size, 0);
  }
});
