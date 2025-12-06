/**
 * Life-OS Service Worker
 * Provides offline caching and fast navigation
 */

const CACHE_NAME = 'life-os-v2';
const STATIC_CACHE = 'life-os-static-v2';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './css/mobile.css',
    './js/site.js',
    './js/mobile-interactions.js',
    './js/navigation.js',
    './assets/logo-icon.png',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './manifest.webmanifest'
];

// Pages to cache for offline access
const PAGES_TO_CACHE = [
    './index.html',
    './books/atomic-habits.html',
    './books/deep-work.html',
    './books/daily-stoic.html',
    './books/dopamine-detox.html',
    './guides/unified-study-guide.html',
    './guides/study-guide-1.html',
    './guides/study-guide-2.html',
    './protocols/life-protocol.html'
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Precaching assets...');
                return cache.addAll(PRECACHE_ASSETS.map(url => {
                    // Handle both root and subdirectory deployment
                    return new Request(url, { cache: 'reload' });
                })).catch(err => {
                    console.log('[SW] Precache failed for some assets, continuing...', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (!url.origin.includes(self.location.origin)) return;

    // For HTML pages - network first, cache fallback
    if (request.headers.get('Accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('./index.html');
                    });
                })
        );
        return;
    }

    // For other assets - cache first, network fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Update cache in background
                fetch(request).then((response) => {
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(request, response);
                    });
                }).catch(() => { });
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                // Cache the new resource
                const responseClone = response.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            });
        })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
