window.__ModuleLoader__.load({
  id: 'dsh-theme-dongxuelian',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports

    const OWNER = 'dsh-theme-dongxuelian'
    const SIDEBAR_MARK = 'sidebar.brand.mark'
    const HEADER_UTILITIES = 'conversation.session.header.utilities'
    const AVATAR_SRC = '/dongxuelian-theme/assets/avatar.webp'
    const AVATAR_SIZE = 24

    // React is a host-shared module, not an npm runtime dependency. Do not
    // register slots from render: both components are static img elements.
    const { createElement } = require('react')

    // The Theme service requires every override to be a { light, dark } pair.
    // This layer is only registered while the active scheme is light, so the
    // dark entry is never read; mirroring light keeps the required shape
    // without inventing an unreviewed dark palette.
    const pair = (value) => ({ light: value, dark: value })

    const TOKENS = {
      '--dsw-alias-bg-base': pair('#F7F4EF'),
      '--dsw-alias-bg-layer-1': pair('#FFFDF9'),
      '--dsw-alias-bg-layer-2': pair('#F0ECE7'),
      '--dsw-alias-bg-layer-3': pair('#F0ECE7'),
      '--dsw-alias-bg-overlay': pair('#FFFDF9'),

      '--dsw-alias-label-primary': pair('#4C4540'),
      '--dsw-alias-label-secondary': pair('#716860'),
      // The P1 palette only fixes two text levels. Reusing the verified
      // secondary for tertiary/caption keeps small text readable on the cream
      // surfaces instead of falling back to the host's lower-contrast greys.
      '--dsw-alias-label-tertiary': pair('#716860'),
      '--dsw-alias-label-caption': pair('#716860'),

      '--dsw-alias-border-l1': pair('#D8D1C8'),
      '--dsw-alias-border-l2': pair('#D8D1C8'),
      // l3/l4 mark controls that must remain distinguishable, not decoration.
      '--dsw-alias-border-l3': pair('#8B8177'),
      '--dsw-alias-border-l4': pair('#8B8177'),

      '--dsw-alias-brand-primary': pair('#96536A'),
      '--dsw-alias-brand-text': pair('#FFFFFF'),
      '--dsw-alias-state-business-primary': pair('#96536A'),
      '--dsw-alias-button-primary-fill': pair('#96536A'),
      '--dsw-alias-button-primary-hover': pair('#7E4257'),
      // The official composer send button uses the info pair, not primary.
      '--dsw-alias-button-info-fill': pair('#96536A'),
      '--dsw-alias-button-info-hover': pair('#7E4257'),
      '--dsw-alias-interactive-bg-hover': pair('#F0ECE7'),

      '--dsw-specific-input-major': pair('#FFFDF9'),
      '--dsw-specific-sidebar-fill': pair('#F0ECE7'),
      '--dsw-specific-bubble': pair('#DFAEBB'),
      // Pale purple is a background only; label-primary stays dark on top.
      '--dsw-specific-bubble-highlight': pair('#C9BED8'),
      '--dsw-specific-sidebar-nav-item-active': pair('#C9BED8'),
    }

    // Fixed 24px fits the official sidebar brand-mark owner prop and the
    // header utility row. Styles stay local: no font, radius, or padding.
    function Avatar() {
      return createElement('img', {
        src: AVATAR_SRC,
        alt: '冬雪莲头像',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        draggable: false,
        style: {
          display: 'block',
          width: '24px',
          height: '24px',
          objectFit: 'contain',
          pointerEvents: 'none',
        },
      })
    }

    const inject = ['theme', 'slots']

    function apply(ctx) {
      let releaseLight = null
      let syncing = false
      let stopped = false
      let queued = false

      // A light setup owns the theme layer and both Slot controllers. Release
      // in reverse creation order; the array is popped, so a repeated call is
      // a no-op even if stop happens while the transaction is still running.
      const releaseAll = (owned) => {
        while (owned.length > 0) owned.pop()()
      }

      const dropLight = () => {
        const release = releaseLight
        releaseLight = null
        release?.()
      }

      const isLight = () =>
        !stopped && ctx.theme.getTheme().active.colorScheme === 'light'

      const setupLight = () => {
        const owned = []
        const release = () => releaseAll(owned)
        try {
          owned.push(ctx.theme.overrideTokens(OWNER, TOKENS))
          if (stopped) return release

          // The sidebar seat is single and ships an official brand default.
          // -10 is a deliberate finite shadowing priority, not a layout hack.
          owned.push(ctx.slots.inject(SIDEBAR_MARK, () =>
            ctx.slots.register({ name: SIDEBAR_MARK, priority: -10 }, Avatar)))
          if (stopped) return release

          // The header utilities seat is additive. A private id and an order
          // keep the shipped leading/header entries and buttons untouched.
          owned.push(ctx.slots.inject(HEADER_UTILITIES, () =>
            ctx.slots.register({ name: HEADER_UTILITIES, id: OWNER, order: 100 }, Avatar)))
          if (stopped) return release

          return release
        } catch (error) {
          release()
          // A register callback can observe an already synchronous stop. Its
          // returned controller was released above; do not surface a teardown
          // failure from a lifecycle that is already inactive.
          if (stopped) return () => {}
          throw error
        }
      }

      const sync = () => {
        if (syncing || stopped) return
        syncing = true
        try {
          // Other listeners can switch schemes or stop the context before an
          // override/register returns. Re-read both after every transaction
          // and let this serial loop converge instead of trusting the event
          // snapshot that triggered it.
          while (true) {
            if (stopped) break
            const light = isLight()
            if (light === (releaseLight !== null)) break
            if (!light) {
              dropLight()
              continue
            }
            const release = setupLight()
            if (stopped) {
              release()
              break
            }
            if (!isLight()) {
              release()
              continue
            }
            releaseLight = release
          }
        } finally {
          syncing = false
        }
      }

      const schedule = () => {
        if (queued || stopped) return
        queued = true
        queueMicrotask(() => {
          queued = false
          sync()
        })
      }

      ctx.effect(() => {
        // Do not publish another theme snapshot inside the host's dispatch:
        // later presenters could otherwise repaint the stale outer snapshot.
        const stop = ctx.on('theme/change', schedule)
        const cleanup = () => {
          // Stop observing first so releasing slots/theme cannot schedule a
          // successor lifecycle from this package.
          stopped = true
          stop()
          dropLight()
        }
        try { sync() }
        catch (error) { cleanup(); throw error }
        return cleanup
      }, 'theme: dongxuelian light tokens and avatar slots')
    }

    exports.inject = inject
    exports.apply = apply
    return module.exports
  },
})
