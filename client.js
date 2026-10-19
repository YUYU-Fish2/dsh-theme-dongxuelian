window.__ModuleLoader__.load({
  id: 'dsh-theme-dongxuelian',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports

    const OWNER = 'dsh-theme-dongxuelian'
    const SIDEBAR_MARK = 'sidebar.brand.mark'
    const SCENE = 'shell.overlay'
    const AVATAR_SRC = '/dongxuelian-theme/assets/avatar.webp'
    const AVATAR_SIZE = 24

    // React is a host-shared module, not an npm runtime dependency. Do not
    // register slots from render: the avatar is a static img and the scene is
    // a static style element.
    const { createElement } = require('react')

    // The Theme service requires every override to be a { light, dark } pair.
    // This layer is only registered while the active scheme is light, so the
    // dark entry is never read; mirroring light keeps the required shape
    // without inventing an unreviewed dark palette.
    const pair = (value) => ({ light: value, dark: value })

    const TOKENS = {
      '--dsw-alias-bg-base': pair('#F3F6FC'),
      '--dsw-alias-bg-layer-1': pair('#FCFDFF'),
      '--dsw-alias-bg-layer-2': pair('#E8EEF8'),
      '--dsw-alias-bg-layer-3': pair('#E8EEF8'),
      '--dsw-alias-bg-overlay': pair('#FCFDFF'),

      '--dsw-alias-label-primary': pair('#293750'),
      '--dsw-alias-label-secondary': pair('#58647C'),
      // The palette fixes two text levels. Reusing the verified secondary for
      // tertiary/caption keeps small text readable on the mist-blue surfaces
      // instead of falling back to the host's lower-contrast greys.
      '--dsw-alias-label-tertiary': pair('#58647C'),
      '--dsw-alias-label-caption': pair('#58647C'),

      '--dsw-alias-border-l1': pair('#CED8E8'),
      '--dsw-alias-border-l2': pair('#CED8E8'),
      // l3/l4 mark controls that must remain distinguishable, not decoration.
      '--dsw-alias-border-l3': pair('#78879F'),
      '--dsw-alias-border-l4': pair('#78879F'),

      '--dsw-alias-brand-primary': pair('#435D9D'),
      '--dsw-alias-brand-text': pair('#FFFFFF'),
      '--dsw-alias-state-business-primary': pair('#435D9D'),
      '--dsw-alias-button-primary-fill': pair('#435D9D'),
      '--dsw-alias-button-primary-hover': pair('#354B82'),
      // The official composer send button uses the info pair, not primary.
      '--dsw-alias-button-info-fill': pair('#435D9D'),
      '--dsw-alias-button-info-hover': pair('#354B82'),
      '--dsw-alias-interactive-bg-hover': pair('#E8EEF8'),

      '--dsw-specific-input-major': pair('#FCFDFF'),
      '--dsw-specific-sidebar-fill': pair('#E8EEF8'),
      '--dsw-specific-bubble': pair('#E0E9F8'),
      // Pale purple is a background only; label-primary stays dark on top.
      '--dsw-specific-bubble-highlight': pair('#E4E0F2'),
      '--dsw-specific-sidebar-nav-item-active': pair('#E4E0F2'),
    }

    // Fixed 24px matches the official sidebar brand-mark owner prop and keeps
    // the running-header duplication removed in this phase. Styles stay local:
    // no font, radius, or padding.
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

    // Decoration lives in a stylesheet, not in the overlay layer: shell.overlay
    // paints above the app (its ancestor is z-index 20), so an <img> there
    // would cover controls. Both official containers expose a direct layout
    // root; only those roots get a background pseudo-element, so the artwork
    // stays below their child content. No hash class names, no body/html
    // layout rewrite, no DOM writes, no animation and no new settings.
    const SCENE_CSS = `
[data-slot="main.conversation"] > div[data-phase],
[data-slot="sidebar"] > div:first-child {
  position: relative;
  isolation: isolate;
}

[data-slot="main.conversation"] > div[data-phase]::before,
[data-slot="sidebar"] > div:first-child::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-repeat: no-repeat;
}

/* Chat: bottom-right companion, present but quieter than the text. */
[data-slot="main.conversation"] > div[data-phase]::before {
  background-image: url("/dongxuelian-theme/assets/sidebar-character.webp");
  background-size: 360px auto;
  background-position: right -25px bottom 90px;
  opacity: 0.24;
}

/* Hero/empty state: more visible, still anchored away from the centred
   title and composer. */
[data-slot="main.conversation"] > div[data-phase="hero"]::before {
  background-position: right -25px top calc(50vh + 24px);
  opacity: 0.65;
}

/* Sidebar: a light echo, not a second protagonist. */
[data-slot="sidebar"] > div:first-child::before {
  background-image: url("/dongxuelian-theme/assets/avatar.webp");
  background-size: 210px auto;
  background-position: center bottom 75px;
  opacity: 0.13;
}

/* The official collapse state is announced by a data attribute on the
   sidebar root or one of its ancestors; in that rail there is no room. */
[data-sidebar-collapsed] [data-slot="sidebar"] > div:first-child::before,
[data-slot="sidebar"][data-sidebar-collapsed] > div:first-child::before,
[data-slot="sidebar"] > div[data-sidebar-collapsed]::before {
  content: none;
}

@media (max-width: 900px) {
  [data-slot="main.conversation"] > div[data-phase]::before {
    background-size: 260px auto;
    opacity: 0.16;
  }

  [data-slot="main.conversation"] > div[data-phase="hero"]::before {
    opacity: 0.32;
  }

  [data-slot="sidebar"] > div:first-child::before {
    background-size: 180px auto;
  }
}
`

    // Rendered as a plain <style> element by the shell.overlay list slot: no
    // visible box, no focus target, and the host removes it with the slot.
    function SceneStyle() {
      return createElement('style', { 'data-dxl-scene': '' }, SCENE_CSS)
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

          // shell.overlay is a list slot: a private id and an order coexist
          // with other overlays. It carries only the stylesheet; the artwork
          // is painted by the two official containers below their content.
          owned.push(ctx.slots.inject(SCENE, () =>
            ctx.slots.register({ name: SCENE, id: OWNER, order: 100 }, SceneStyle)))
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
      }, 'theme: dongxuelian light tokens and scene slots')
    }

    exports.inject = inject
    exports.apply = apply
    return module.exports
  },
})
