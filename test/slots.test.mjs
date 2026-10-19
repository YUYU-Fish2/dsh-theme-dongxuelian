import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPlugin, host, owner } from './helpers/client-host.mjs';

const sidebar = 'sidebar.brand.mark';
const header = 'conversation.session.header.utilities';

function slots(scheme = 'light') {
  const runtime = host(scheme);
  const declared = new Set([sidebar, header]);
  const waiters = new Set();
  const entries = new Set();
  let failHeader = false;
  let onRegister = () => {};
  runtime.context.slots = {
    inject(name, setup) {
      let active;
      const reconcile = () => { active?.(); active = declared.has(name) ? setup() : undefined; };
      const row = { name, reconcile };
      waiters.add(row);
      try { reconcile(); } catch (error) { waiters.delete(row); throw error; }
      return () => { waiters.delete(row); active?.(); active = undefined; };
    },
    register(options, component) {
      assert.ok(declared.has(options.name), '只能注册已声明槽');
      if (failHeader && options.name === header) throw new Error('header setup failed');
      const entry = { options, component };
      entries.add(entry);
      onRegister(entry);
      return () => entries.delete(entry);
    },
  };
  return Object.assign(runtime, {
    entries, waiters,
    failHeader() { failHeader = true; },
    onRegister(fn) { onRegister = fn; },
    declare(name, present) {
      if (present) declared.add(name); else declared.delete(name);
      for (const row of [...waiters]) if (row.name === name) row.reconcile();
    },
  });
}

test('只占小品牌槽和 header 列表项，图像有名称且不拦截点击', () => {
  const runtime = slots();
  const plugin = loadPlugin();
  assert.ok(plugin.inject.includes('slots'));
  plugin.apply(runtime.context);
  assert.deepEqual([...runtime.entries].map((row) => row.options.name).sort(), [header, sidebar].sort());
  for (const entry of runtime.entries) {
    const element = entry.component({ size: 24 });
    assert.equal(element.type, 'img');
    assert.match(element.props.src, /^\/dongxuelian-theme\/assets\/avatar\.webp(?:\?|$)/);
    assert.ok(element.props.alt.includes('冬雪莲'));
    assert.equal(element.props.width, 24);
    assert.equal(element.props.height, 24);
    assert.equal(element.props.style.pointerEvents, 'none');
    assert.equal(element.props.draggable, false);
    if (entry.options.name === header) assert.equal(entry.options.id, owner);
  }
  runtime.stop();
});

test('深色完全释放头像槽，回浅恢复，停用后监听与槽清空', async () => {
  const runtime = slots('dark');
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.entries.size, 0);
  runtime.change('light');
  await Promise.resolve();
  assert.equal(runtime.entries.size, 2);
  runtime.change('light');
  await Promise.resolve();
  assert.equal(runtime.entries.size, 2);
  runtime.change('dark');
  await Promise.resolve();
  assert.equal(runtime.entries.size, 0);
  assert.equal(runtime.waiters.size, 0);
  runtime.change('light');
  await Promise.resolve();
  runtime.stop();
  assert.equal(runtime.entries.size, 0);
  assert.equal(runtime.waiters.size, 0);
  assert.equal(runtime.listeners.size, 0);
});

test('owner 子槽消失后释放，重新声明时只恢复一份', () => {
  const runtime = slots();
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.entries.size, 2);
  runtime.declare(sidebar, false);
  assert.equal(runtime.entries.size, 1);
  runtime.declare(sidebar, true);
  assert.equal(runtime.entries.size, 2);
  runtime.stop();
  runtime.declare(sidebar, false);
  runtime.declare(sidebar, true);
  assert.equal(runtime.entries.size, 0);
});

test('第二处 Slot 注册失败会回滚第一处、主题覆盖与监听', () => {
  const runtime = slots();
  runtime.failHeader();
  assert.throws(() => loadPlugin().apply(runtime.context), /header setup failed/);
  assert.equal(runtime.entries.size, 0);
  assert.equal(runtime.waiters.size, 0);
  assert.equal(runtime.layers.has(owner), false);
  assert.equal(runtime.listeners.size, 0);
});

test('Slot 注册期间同步停用，随后返回的 disposer 也被释放', async () => {
  const runtime = slots('dark');
  loadPlugin().apply(runtime.context);
  let interrupted = false;
  runtime.onRegister(() => { if (!interrupted) { interrupted = true; runtime.stop(); } });
  runtime.change('light');
  await Promise.resolve();
  assert.equal(interrupted, true);
  assert.equal(runtime.entries.size, 0);
  assert.equal(runtime.waiters.size, 0);
  assert.equal(runtime.layers.has(owner), false);
});
