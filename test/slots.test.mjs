import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPlugin, host, owner } from './helpers/client-host.mjs';

const sidebar = 'sidebar.brand.mark';
const scene = 'shell.overlay';

function slots(scheme = 'light') {
  const runtime = host(scheme);
  const declared = new Set([sidebar, scene]);
  const waiters = new Set();
  const entries = new Set();
  let failScene = false;
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
      if (failScene && options.name === scene) throw new Error('scene setup failed');
      const entry = { options, component };
      entries.add(entry);
      onRegister(entry);
      return () => entries.delete(entry);
    },
  };
  return Object.assign(runtime, {
    entries, waiters,
    failScene() { failScene = true; },
    onRegister(fn) { onRegister = fn; },
    declare(name, present) {
      if (present) declared.add(name); else declared.delete(name);
      for (const row of [...waiters]) if (row.name === name) row.reconcile();
    },
  });
}

test('品牌头像与背景样式走独立官方槽，不在前景覆盖人物或重复标题栏头像', () => {
  const runtime = slots();
  const plugin = loadPlugin();
  assert.ok(plugin.inject.includes('slots'));
  plugin.apply(runtime.context);
  assert.deepEqual([...runtime.entries].map((row) => row.options.name).sort(), [scene, sidebar].sort());
  for (const entry of runtime.entries) {
    const element = entry.component({ size: 24 });
    if (entry.options.name === scene) {
      assert.equal(entry.options.id, owner);
      assert.equal(element.type, 'style', '背景在内容下方绘制，而不是高层可交互图片');
      assert.equal(element.props['data-dxl-scene'], '');
      assert.equal(typeof element.props.children, 'string');
      assert.ok(element.props.children.includes('/dongxuelian-theme/assets/reading.webp'));
      assert.ok(!element.props.children.includes('sidebar-character.webp'));
      continue;
    }
    assert.equal(element.type, 'img');
    assert.match(element.props.src, /^\/dongxuelian-theme\/assets\/avatar\.webp(?:\?|$)/);
    assert.ok(element.props.alt.includes('冬雪莲'));
    assert.equal(element.props.width, 24);
    assert.equal(element.props.height, 24);
    assert.equal(element.props.style.pointerEvents, 'none');
    assert.equal(element.props.draggable, false);
  }
  runtime.stop();
});

test('深色完全释放头像和背景样式，回浅恢复，停用后监听与槽清空', async () => {
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

for (const slot of [sidebar, scene]) test(`${slot} owner 消失后释放，重新声明时只恢复一份`, () => {
  const runtime = slots();
  loadPlugin().apply(runtime.context);
  assert.equal(runtime.entries.size, 2);
  runtime.declare(slot, false);
  assert.equal(runtime.entries.size, 1);
  assert.equal([...runtime.entries].filter((row) => row.options.name === slot).length, 0);
  assert.equal(runtime.waiters.size, 2);
  runtime.declare(slot, true);
  assert.equal(runtime.entries.size, 2);
  assert.equal([...runtime.entries].filter((row) => row.options.name === slot).length, 1);
  runtime.stop();
  runtime.declare(slot, false);
  runtime.declare(slot, true);
  assert.equal(runtime.entries.size, 0);
  assert.equal(runtime.waiters.size, 0);
});

test('背景注册失败会回滚品牌槽、主题覆盖与监听', () => {
  const runtime = slots();
  runtime.failScene();
  assert.throws(() => loadPlugin().apply(runtime.context), /scene setup failed/);
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
