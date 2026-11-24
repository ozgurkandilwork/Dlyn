var C = "dc20-202611240834";
var DOSYA = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(DOSYA); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (r) {
      var ag = fetch(e.request).then(function (n) { if (n && n.ok) c.put(e.request, n.clone()); return n; }).catch(function () { return r; });
      return r || ag;
    });
  }));
});
