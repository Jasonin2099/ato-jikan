// あと何時間 — offline support. Network first, so a deploy shows up on the next load;
// the cache is only the fallback when there is no connection.
const CACHE = 'atojikan-v3';
const CORE = ['./', 'index.html', 'i18n.js', 'calc.js', 'shifts.js', 'rules/2026.json', 'manifest.webmanifest', 'icon.png', 'icon-192.png',
  'fonts/NotoSansJP-Regular.subset.woff2', 'fonts/NotoSansJP-Bold.subset.woff2',
  'fonts/NotoSansSC-Regular.subset.woff2', 'fonts/NotoSansSC-Bold.subset.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
