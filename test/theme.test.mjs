import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPlugin, host, owner } from './helpers/client-host.mjs';

test('浅色覆盖经过核算的正文、次文字和背景，不写用户偏好', () => {
  const plugin = loadPlugin();
  assert.deepEqual([...plugin.inject], ['theme', 'slots']);
  const runtime = host();
  plugin.apply(runtime.context);
  const tokens = runtime.layers.get(owner).tokens;
  assert.equal(tokens['--dsw-alias-bg-base'].light, '#F7F4EF');
  assert.equal(tokens['--dsw-alias-label-primary'].light, '#4C4540');
  assert.equal(tokens['--dsw-alias-label-secondary'].light, '#716860');
  runtime.stop();
});

test('深色不覆盖，回到浅色恢复，重复同色事件不累加覆盖', async () => {
  const runtime = host('dark');
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.layers.has(owner), false);
  runtime.change('light');
  runtime.change('light');
  await Promise.resolve();
  assert.equal(runtime.overrideCalls, 1);
  runtime.change('dark');
  await Promise.resolve();
  assert.equal(runtime.layers.has(owner), false);
  runtime.change('light');
  await Promise.resolve();
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

test('其他监听同步切换深色时不留下浅色层，停用不遗留旧 disposer 对应层', () => {
  const runtime = host();
  let redirected = false;
  const stopForeign = runtime.context.on('theme/change', (value) => {
    if (!redirected && value.active.colorScheme === 'light' && runtime.layers.has(owner)) {
      redirected = true;
      runtime.change('dark');
    }
  });
  loadPlugin().apply(runtime.context);
  const darkHasLayer = runtime.layers.has(owner);
  runtime.stop();
  const stoppedHasLayer = runtime.layers.has(owner);
  stopForeign();
  assert.deepEqual({ darkHasLayer, stoppedHasLayer }, { darkHasLayer: false, stoppedHasLayer: false });
  assert.equal(runtime.listeners.size, 0);
});

test('注册覆盖的同步事件期间停用，返回的 disposer 仍被释放', async () => {
  const runtime = host('dark');
  loadPlugin().apply(runtime.context);
  let stopped = false;
  const stopForeign = runtime.context.on('theme/change', () => {
    if (!stopped && runtime.layers.has(owner)) {
      stopped = true;
      runtime.stop();
    }
  });
  runtime.change('light');
  await Promise.resolve();
  stopForeign();
  assert.equal(stopped, true);
  assert.equal(runtime.layers.has(owner), false);
  assert.equal(runtime.listeners.size, 0);
});

test('深色切换后的呈现层不会被外层旧快照重新涂成浅色', async () => {
  const runtime = host();
  loadPlugin().apply(runtime.context);
  let presented;
  const stopPresenter = runtime.context.on('theme/change', (value) => {
    presented = value.active.tokens['--dsw-alias-bg-base'] ?? 'native-dark';
  });
  runtime.change('dark');
  await Promise.resolve();
  assert.equal(runtime.layers.has(owner), false);
  assert.equal(presented, 'native-dark');
  runtime.stop();
  stopPresenter();
});
