const CACHE_NAME = "geomemory-shell-v3";
const APP_BASE = new URL("./", self.location.href);
const INDEX_URL = new URL("index.html", APP_BASE).href;
const APP_SHELL = [
  APP_BASE.href,
  INDEX_URL,
  new URL("manifest.webmanifest", APP_BASE).href,
  new URL("favicon.svg", APP_BASE).href,
  new URL("app-icon.svg", APP_BASE).href
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(INDEX_URL, cloned));
          return response;
        })
        .catch(() => caches.match(INDEX_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response.ok || response.type === "opaque") {
            return response;
          }

          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(INDEX_URL));
    })
  );
});
