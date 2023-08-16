// Name a cache for our files
const staticCacheName = 'site-static-v1';
const assets = [
    '/',                    // cache index page
    '/index.html',          // cache HTML
    '/styles.css',          // cache CSS (assuming you have a styles.css file)
    '/fallback.html'        // a fallback page in case of failure
];

// Installation event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching assets');
            cache.addAll(assets);
        })
    );
});

// Fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).catch(() => {
                if(evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/fallback.html');
                }
            });
        })
    );
});