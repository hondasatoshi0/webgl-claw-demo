/* 自動生成（scripts/build-sw.mjs）。直接編集しないこと */
const CACHE = 'crane-game-c84f6164fc2c';
const ASSETS = [
  "./",
  "./apple-touch-icon.png",
  "./assets/index-tokeH8Ci.js",
  "./favicon-64.png",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest"
];

// 配信物を丸ごと先に取り込む
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 古い版のキャッシュを片付けて、すぐこの版に切り替える
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // ページの読み込みは、通信の有無にかかわらず必ず手元の index.html から返す
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((hit) => hit || fetch(request))
    );
    return;
  }

  // ファイル名にハッシュが入っているので、あるものはそのまま使ってよい
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
