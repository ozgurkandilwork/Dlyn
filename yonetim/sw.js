var ON = "dcy-", C = ON + "202611251418";
var DOSYA = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(DOSYA); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf(ON) === 0 && k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Önce ağ: her açılışta güncel rakam; bağlantı yoksa son kopya
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request.url, { cache: "no-store", credentials: "same-origin" }).then(function (n) {
    if (n && n.ok) { var k = n.clone(); caches.open(C).then(function (c) { c.put(e.request, k); }); }
    return n;
  }).catch(function () { return caches.open(C).then(function (c) { return c.match(e.request, { ignoreSearch: true }); }); }));
});
