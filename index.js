import { readFile, stat } from 'node:fs/promises'

export const name = 'dsh-theme-dongxuelian'

const PREFIX = '/dongxuelian-theme/assets'

// Exact public URLs only. A Map is deliberate: path strings such as
// "__proto__" or "constructor" must not resolve through Object.prototype,
// and req.url is compared before any percent-decoding so encoded aliases and
// traversal spellings cannot reach the filesystem.
const FILES = new Map([
  [`${PREFIX}/avatar.webp`, new URL('./assets/characters/web/avatar.webp', import.meta.url)],
  [`${PREFIX}/reading.webp`, new URL('./assets/scenes/web/reading.webp', import.meta.url)],
])

// Short-lived revalidation instead of long immutable caching: the two files
// keep fixed names while their bytes may change between preview builds.
const BASE_HEADERS = {
  'Cache-Control': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
}

function sendText(res, status, message, extra = {}) {
  const body = Buffer.from(message)
  res.writeHead(status, {
    ...BASE_HEADERS,
    ...extra,
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': String(body.length),
  })
  res.end(body)
}

async function handler(req, res) {
  // The host has already selected this route by pathname; strip only the query
  // string, then require an exact hit in the fixed table.
  const path = typeof req.url === 'string' ? req.url.split('?')[0] : ''
  const file = FILES.get(path)
  if (file === undefined) {
    sendText(res, 404, 'Not found')
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendText(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' })
    return
  }

  try {
    if (req.method === 'HEAD') {
      // Metadata only: a HEAD response must never open or stream the asset.
      const info = await stat(file)
      res.writeHead(200, {
        ...BASE_HEADERS,
        'Content-Type': 'image/webp',
        'Content-Length': String(info.size),
      })
      res.end()
      return
    }

    const body = await readFile(file)
    res.writeHead(200, {
      ...BASE_HEADERS,
      'Content-Type': 'image/webp',
      'Content-Length': String(body.length),
    })
    res.end(body)
  } catch {
    // A missing or unreadable package asset is a server-side fault, not a 404:
    // answer before headers are sent, or abort an already-started response so
    // the request cannot hang. Do not expose the on-disk location.
    if (!res.headersSent) sendText(res, 500, 'Asset unavailable')
    else res.destroy()
  }
}

export function apply(ctx) {
  ctx.inject(['webServer'], (scope) => {
    // register() returns the remover; effect() binds it to the service
    // lifecycle, so disabling the plugin or losing the service releases the
    // route without touching the host server.
    scope.effect(() => scope.webServer.register({
      kind: 'prefix',
      path: PREFIX,
      handler,
    }), 'webServer: dongxuelian character assets')
  })
}
