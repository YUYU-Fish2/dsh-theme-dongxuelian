import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const clientFile = new URL('../../client.js', import.meta.url);
export const owner = 'dsh-theme-dongxuelian';

export function loadPlugin() {
  assert.ok(existsSync(clientFile), '基础主题客户端尚未实现');
  let registration;
  runInNewContext(readFileSync(clientFile, 'utf8'), {
    window: { __ModuleLoader__: { load(value) { registration = value; } } },
    queueMicrotask,
  });
  assert.equal(registration.id, owner);
  return registration.factory((name) => {
    if (name === 'react') return { createElement: (type, props) => ({ type, props }) };
    throw new Error(`未声明的依赖 ${name}`);
  });
}

export function host(scheme = 'light') {
  let current = scheme;
  let depth = 0;
  let calls = 0;
  const layers = new Map([['foreign-theme', { foreign: true }]]);
  const listeners = new Set();
  const effects = [];
  const publish = () => {
    assert.ok(++depth < 8, '同步 theme/change 造成了递归循环');
    const value = snapshot();
    try { for (const listener of [...listeners]) listener(value); }
    finally { depth--; }
  };
  const snapshot = () => ({ preference: 'system', active: {
    colorScheme: current,
    tokens: Object.assign({}, ...[...layers.values()].map((layer) =>
      Object.fromEntries(Object.entries(layer.tokens ?? {}).map(([key, value]) => [key, value[current]])))),
  } });
  return {
    layers, listeners,
    get overrideCalls() { return calls; },
    change(value) { current = value; publish(); },
    stop() { for (const dispose of effects.splice(0).reverse()) dispose?.(); },
    context: {
      slots: { inject() { return () => {}; }, register() { return () => {}; } },
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
