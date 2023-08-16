// Name a cache for our files
const staticCacheName = "site-static-v1";
const assets = [
    "/examples/",                    // cache index page
    "/examples/index.html",          // cache HTML
    "/examples/styles.css",          // cache CSS (assuming you have a styles.css file)
    "/examples/fallback.html"        // a fallback page in case of failure
];

// Installation event
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log("caching assets");
            cache.addAll(assets);
        })
    );
});

// Fetch event
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).catch(() => {
                if(event.request.url.indexOf(".html") > -1) {
                    return caches.match("/examples/fallback.html");
                }
            });
        })
    );
});