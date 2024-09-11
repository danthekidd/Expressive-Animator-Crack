const FILE_CACHE = "animator-1718281115095-9257";
const CACHE_ALLOW = [FILE_CACHE];

const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.png",
  "/license.html",
  "/manifest.json",
  "/icons/icon-48.png",
  "/icons/icon-57.png",
  "/icons/icon-60.png",
  "/icons/icon-72.png",
  "/icons/icon-76.png",
  "/icons/icon-96.png",
  "/icons/icon-114.png",
  "/icons/icon-120.png",
  "/icons/icon-144.png",
  "/icons/icon-152.png",
  "/icons/icon-180.png",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/assets/ui/style.css",
  "/assets/icons/expr.svg",
  "/assets/animator/app.js",
  "/assets/animator/boot.js",
  "/assets/animator/fail.js",
  "/assets/animator/logo.svg",
  "/assets/animator/player.js",
  "/assets/animator/skia.wasm",
  "/assets/icons/workflow.svg",
  "/assets/animator/upgrade.png",
  "/assets/animator/export/gif.js",
  "/assets/animator/export/mp4.js",
  "/assets/animator/export/seq.js",
  "/assets/animator/export/apng.js",
  "/assets/animator/export/webm.js",
  "/assets/animator/samples/404.eaf",
  "/assets/animator/samples/404.png",
  "/assets/animator/setup/fonts.png",
  "/assets/animator/samples/list.json",
  "/assets/animator/setup/install.png",
  "/assets/animator/samples/soda-ad.eaf",
  "/assets/animator/samples/soda-ad.png",
  "/assets/animator/setup/clipboard.png",
  "/assets/animator/samples/burger-ad.eaf",
  "/assets/animator/samples/burger-ad.png",
  "/assets/animator/samples/explainer.eaf",
  "/assets/animator/samples/explainer.png",
  "/assets/animator/samples/bike-rider.eaf",
  "/assets/animator/samples/bike-rider.png",
  "/assets/animator/samples/google-logo.eaf",
  "/assets/animator/samples/google-logo.png",
  "/assets/animator/setup/notifications.png",
  "/assets/animator/samples/jump-elastic.eaf",
  "/assets/animator/samples/jump-elastic.png",
  "/assets/animator/samples/dribbble-logo.eaf",
  "/assets/animator/samples/dribbble-logo.png",
  "/assets/animator/samples/walking-troll.eaf",
  "/assets/animator/samples/walking-troll.png",
  "/assets/animator/samples/character-head.eaf",
  "/assets/animator/samples/character-head.png",
  "/assets/animator/samples/baloon-parallax.eaf",
  "/assets/animator/samples/baloon-parallax.png",
  "/assets/fonts/Inter-VariableFont_slnt,wght.ttf",
  "/assets/fonts/SourceSans3-VariableFont_wght.ttf",
  "/assets/fonts/SourceCodePro-VariableFont_wght.ttf",
  "/assets/fonts/SourceSerif4-VariableFont_opsz,wght.ttf",
  "/assets/fonts/SourceSans3-Italic-VariableFont_wght.ttf",
  "/assets/fonts/SourceCodePro-Italic-VariableFont_wght.ttf",
  "/assets/fonts/SourceSerif4-Italic-VariableFont_opsz,wght.ttf",
  "https://community.expressivesuite.com/js/script.manual.js"
];

self.addEventListener('install', async function(event) {
    // Perform install steps
    await event.waitUntil(
        caches.open(FILE_CACHE).then(cache => cache.addAll(urlsToCache))
    );
    await self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(_doMatch(event));
});

async function _doMatch(event) {
    let response = await caches.match(event.request);
    if (response){
        // Cache hit - return response
        return response;
    }

    response = await fetch(event.request);

    // Check if we received a valid response
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }

    // IMPORTANT: Clone the response. A response is a stream
    // and because we want the browser to consume the response
    // as well as the cache consuming the response, we need
    // to clone it so we have two streams.
    const responseToCache = response.clone();

    caches.open(FILE_CACHE).then(cache => cache.put(event.request, responseToCache));

    return response;
}

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(function (cacheName) {
                if (CACHE_ALLOW.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});
