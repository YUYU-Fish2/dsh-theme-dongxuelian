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
      '--dsw-alias-bg-base': pair('#F7F3EB'),
      '--dsw-alias-bg-layer-1': pair('#FFFDF8'),
      '--dsw-alias-bg-layer-2': pair('#EDECE9'),
      '--dsw-alias-bg-layer-3': pair('#EDECE9'),
      '--dsw-alias-bg-overlay': pair('#FFFDF8'),

      '--dsw-alias-label-primary': pair('#313A50'),
      '--dsw-alias-label-secondary': pair('#5C6578'),
      // The palette fixes two text levels. Reusing the verified secondary for
      // tertiary/caption keeps small text readable on the paper surfaces
      // instead of falling back to the host's lower-contrast greys.
      '--dsw-alias-label-tertiary': pair('#5C6578'),
      '--dsw-alias-label-caption': pair('#5C6578'),

      '--dsw-alias-border-l1': pair('#D4D7DE'),
      '--dsw-alias-border-l2': pair('#D4D7DE'),
      // l3/l4 mark controls that must remain distinguishable, not decoration.
      // #7D879B stays above 3:1 on both paper and sidebar fills.
      '--dsw-alias-border-l3': pair('#7D879B'),
      '--dsw-alias-border-l4': pair('#7D879B'),

      '--dsw-alias-brand-primary': pair('#536B9E'),
      '--dsw-alias-brand-text': pair('#FFFFFF'),
      '--dsw-alias-state-business-primary': pair('#536B9E'),
      '--dsw-alias-button-primary-fill': pair('#536B9E'),
      '--dsw-alias-button-primary-hover': pair('#435882'),
      // The official composer send button uses the info pair, not primary.
      '--dsw-alias-button-info-fill': pair('#536B9E'),
      '--dsw-alias-button-info-hover': pair('#435882'),
      '--dsw-alias-interactive-bg-hover': pair('#EDECE9'),

      '--dsw-specific-input-major': pair('#FFFDF8'),
      '--dsw-specific-sidebar-fill': pair('#EDECE9'),
      '--dsw-specific-bubble': pair('#DDE4EF'),
      // Selection and highlight are backgrounds only; label-primary stays dark.
      '--dsw-specific-bubble-highlight': pair('#E4E5EE'),
      '--dsw-specific-sidebar-nav-item-active': pair('#E4E5EE'),
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
    // would cover controls. Only the official conversation content is painted;
    // its direct children keep their own backgrounds and the stylesheet never
    // replaces the message tree or writes DOM. The sidebar echoes the palette
    // through tokens only, with no second character watermark.
    const SCENE_CSS = `
[data-slot="main.conversation"] > div[data-phase] {
  container-name: dxl-reading;
  container-type: inline-size;
}

/* Query the root container from its content child, including the background
   pseudo-element. This also keeps scene artwork out of the header chrome. */
[data-slot="main.conversation"] > div[data-phase] [data-conversation-content] {
  position: relative;
  isolation: isolate;
}

[data-slot="main.conversation"] > div[data-phase] [data-conversation-content]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: #F7F3EB url("/dongxuelian-theme/assets/reading.webp") no-repeat right -190px center;
  background-size: auto min(100%, 800px);
  mask-image: linear-gradient(90deg, transparent, #000 22%), linear-gradient(transparent, #000 64px, #000 calc(100% - 64px), transparent);
  mask-composite: intersect;
}

/* The official chain adds two display:contents wrappers. Style its fallback
   stack, not the wrapper box, to move both the headline and composer left. */
[data-slot="main.conversation"] > div[data-phase="hero"] [data-chain-overlay-fallback="conversation.composer"] > div {
  --dsh-composer-card-max-width: min(500px, 55cqi);
  width: 100%;
  max-width: var(--dsh-composer-card-max-width);
  align-self: flex-start;
  margin-inline: clamp(24px, 4cqi, 48px) auto;
}

/* Reserve a scenic margin while keeping messages, tools and the composer on
   opaque paper. The host still controls message structure and code scrolling. */
[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
  --dxl-scene-gutter: clamp(220px, calc(var(--dsh-conversation-column-width) * 0.28), 340px);
  --dsh-chat-content-width: min(var(--dsh-chat-user-width, 760px), calc(var(--dsh-conversation-column-width) - var(--dxl-scene-gutter) - 48px));
  --dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-scroll] {
  width: auto;
  min-width: 0;
  margin-right: var(--dxl-scene-gutter);
  background: linear-gradient(90deg, #F7F3EB calc(100% - 32px), transparent);
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-scroll] pre {
  background-color: #FFFDF8;
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content]::before {
  background-size: auto min(100%, 720px);
  background-position: right -150px center;
}

@container dxl-reading (max-width: 900px) {
  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
    --dxl-scene-gutter: clamp(160px, calc(var(--dsh-conversation-column-width) * 0.26), 220px);
  }

  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content]::before {
    background-size: auto 58%;
    background-position: right -110px center;
  }
}

@container dxl-reading (max-width: 760px) {
  [data-slot="main.conversation"] > div[data-phase="hero"] [data-chain-overlay-fallback="conversation.composer"] > div {
    --dsh-composer-card-max-width: min(680px, calc(100% - 32px));
    max-width: calc(100% - 32px);
    margin-inline: auto;
    align-self: center;
  }

  [data-slot="main.conversation"] > div[data-phase="hero"] [data-conversation-content]::before {
    background-size: auto 36%;
    background-position: right 12px top;
    mask-image: linear-gradient(#000 calc(36% - 32px), transparent 36%);
  }
}

/* Wide (>=1100px) composition uses a 1920px shared stage. The hero composer
   grows from its 500px narrow-column width with an 880px cap; the artwork keeps
   the source 3:2 ratio and moves from the old -190px offset to the stage's
   right edge. Every narrow rule above stays untouched. */
@container dxl-reading (min-width: 1100px) {
  [data-slot="main.conversation"] > div[data-phase="hero"] [data-chain-overlay-fallback="conversation.composer"] > div {
    --dsh-composer-card-max-width: clamp(500px, calc(500px + (var(--dsh-conversation-column-width) - 1100px) * .34), 880px);
    margin-inline: calc(clamp(24px, 4cqi, 48px) + max(0px, (100cqi - 1920px) / 2)) auto;
  }

  /* One proportional artwork box for both wide phases: height is set per
     phase, width follows the source 3:2 ratio, and the negative layer plus
     pointer-events:none come from the base rule above. */
  [data-slot="main.conversation"] > div[data-phase="hero"] [data-conversation-content]::before,
  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content]::before {
    inset: auto;
    top: 50%;
    width: auto;
    aspect-ratio: 3 / 2;
    transform: translateY(-50%);
    background-position: center;
    background-size: 100% 100%;
    mask-image:
      linear-gradient(90deg, transparent, #000 64px, #000 calc(100% - 64px), transparent),
      linear-gradient(180deg, transparent, #000 64px, #000 calc(100% - 64px), transparent);
    mask-composite: intersect;
  }

  [data-slot="main.conversation"] > div[data-phase="hero"] [data-conversation-content]::before {
    right: calc(max(0px, (100cqi - 1920px) / 2) - clamp(0px, (1920px - 100cqi) * 190 / 820, 190px));
    height: min(
      clamp(800px, calc(800px + (100cqi - 1100px) * 480 / 820), 1280px),
      calc(100% - clamp(0px, (100cqi - 1100px) * 64 / 820, 64px))
    );
  }

  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
    --dxl-scene-gutter: clamp(380px, calc(var(--dsh-conversation-column-width) * .36), 720px);
    --dsh-chat-content-width: min(
      var(--dsh-chat-user-width, 1040px),
      calc(min(var(--dsh-conversation-column-width), 1920px) - var(--dxl-scene-gutter) - 96px)
    );
    --dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
  }

  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-scroll] {
    width: calc(min(100cqi, 1920px) - var(--dxl-scene-gutter));
    margin-left: max(0px, calc((100cqi - 1920px) / 2));
    margin-right: 0;
    min-width: 0;
    background: linear-gradient(90deg, #F7F3EB calc(100% - 32px), transparent);
  }

  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content]::before {
    right: calc(max(0px, (100cqi - 1920px) / 2) - clamp(0px, (1920px - 100cqi) * 150 / 820, 150px));
    height: min(
      clamp(720px, calc(720px + (100cqi - 1100px) * 560 / 820), 1280px),
      calc(100% - clamp(0px, (100cqi - 1100px) * 64 / 820, 64px))
    );
  }
}

/* At large zoom or a very narrow column, reading takes the full width. */
@container dxl-reading (max-width: 640px) {
  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
    --dxl-scene-gutter: 0px;
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
          // is painted by the official conversation container below its
          // content.
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
