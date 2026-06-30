// Define Cleaning — minimal service worker (no Workbox).
// Scope: /app. Deliberately conservative: only same-origin GET requests for
// static, hashed build assets are cached. Authenticated HTML and all
// loader/action data go straight to the network and are NEVER cached — this
// avoids leaking one user's data to the next on a shared device.

const CACHE = "define-app-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(["/manifest.webmanifest", "/icons/icon.svg"])),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isCacheableAsset(url) {
  // Vite emits hashed, immutable assets under /assets/. Safe to cache-first.
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/assets/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname === "/manifest.webmanifest")
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never touch mutations
  const url = new URL(req.url);

  // Cache-first for immutable static assets only.
  if (isCacheableAsset(url)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else (navigations, ?_data loaders, API) → network.
  // Falls through to the browser default; no caching of authenticated content.
});
