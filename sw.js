// Service Worker for caching
const CACHE_NAME = 'sbi-calc-v1';
const urlsToCache = [
  // Core HTML pages (Required)
  '/',
  '/index.html',      // Main calculator page
  '/about.html',      // About page
  '/contact.html',    // Contact page
  '/privacy.html',    // Privacy policy
  '/terms.html',      // Terms of service
  '/disclaimer.html', // Disclaimer
  '/dmca.html',       // DMCA notice
  '/404.html',        // Error page

  // Styles (Required)
  '/style.css',       // Main styles
  '/style.min.css',   // Minified styles for production

  // Scripts (Required)
  '/script.js',       // Main application logic
  '/common.js',       // Common utilities
  '/performance.js',  // Performance monitoring

  // Images (Required)
  '/android-chrome-192x192.png', // PWA icons
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',

  // Configuration files (Optional but recommended)
  '/site.webmanifest',  // PWA manifest
  '/robots.txt',        // Search engine directives
  '/sitemap.xml',       // Site structure for search engines
  '/humans.txt',        // Team credits
  '/security.txt'       // Security policy
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Cache dynamic resources
const dynamicCache = 'dynamic-v1';

// Cache pages when visited
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from network
        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();

          // Add the new response to cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Add cache cleanup on activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 