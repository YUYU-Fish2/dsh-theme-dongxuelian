window.__ModuleLoader__.load({
  id: 'dsh-theme-dongxuelian',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports

    const OWNER = 'dsh-theme-dongxuelian'

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
      '--dsw-alias-interactive-bg-hover': pair('#F0ECE7'),

      '--dsw-specific-input-major': pair('#FFFDF9'),
      '--dsw-specific-sidebar-fill': pair('#F0ECE7'),
      '--dsw-specific-bubble': pair('#DFAEBB'),
      // Pale purple is a background only; label-primary stays dark on top.
      '--dsw-specific-bubble-highlight': pair('#C9BED8'),
      '--dsw-specific-sidebar-nav-item-active': pair('#C9BED8'),
    }

    const inject = ['theme']

    function apply(ctx) {
      let releaseLayer = null
      let syncing = false
      let stopped = false
      let queued = false

      const dropLayer = () => {
        const release = releaseLayer
        releaseLayer = null
        release?.()
      }

      const sync = () => {
        if (syncing || stopped) return
        syncing = true
        try {
          // Other listeners can switch schemes before an override returns.
          // Finish the current operation, then read the latest service state;
          // an event's captured snapshot may already be stale.
          while (true) {
            const light = !stopped && ctx.theme.getTheme().active.colorScheme === 'light'
            if (light === (releaseLayer !== null)) break
            if (light) releaseLayer = ctx.theme.overrideTokens(OWNER, TOKENS)
            else dropLayer()
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
          stopped = true
          stop()
          dropLayer()
        }
        try { sync() }
        catch (error) { cleanup(); throw error }
        return cleanup
      }, 'theme: dongxuelian light tokens')
    }

    exports.inject = inject
    exports.apply = apply
    return module.exports
  },
})
