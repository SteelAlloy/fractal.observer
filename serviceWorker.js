/* global self, caches, fetch */

const staticFractalObserver = 'fractal-observer-site-v1'
const assets = [
  '/',
  '/index.html',
  '/main.js',
  'https://cdn.jsdelivr.net/npm/gl-matrix@2/dist/gl-matrix-min.js',
  'https://cdn.jsdelivr.net/npm/regl@1/dist/regl.min.js'
]

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticFractalObserver).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
