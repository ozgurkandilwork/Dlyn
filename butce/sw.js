var C = "bt27-202611280437";
var DOSYA = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./lib/jspdf.umd.min.js", "./lib/Carlito-Regular.ttf", "./lib/Carlito-Bold.ttf"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(DOSYA); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("bt27-") === 0 && k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  // Sürüm dosyası önbelleğe girmez, doğrudan ağdan okunur
  if (/\/surum\.json$/.test(new URL(e.request.url).pathname)) return;
  var u = new URL(e.request.url);
  var sayfa = e.request.mode === "navigate" || /\/(index\.html)?$/.test(u.pathname);
  if (sayfa) {
    // önce ağ: yeni bütçe hemen gelsin; bağlantı yoksa kayıtlı sürüm
    e.respondWith(fetch(e.request).then(function (n) {
      if (n && n.ok) { var k = n.clone(); caches.open(C).then(function (c) { c.put("./index.html", k); }); }
      return n;
    }).catch(function () { return caches.open(C).then(function (c) { return c.match("./index.html"); }); }));
    return;
  }
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (r) {
      return r || fetch(e.request).then(function (n) { if (n && n.ok) c.put(e.request, n.clone()); return n; });
    });
  }));
});
