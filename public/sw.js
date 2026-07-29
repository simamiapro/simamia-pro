const CACHE_NAME = 'simamia-pro-v1';

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event - Basic pass-through so Chrome recognizes it as a valid Service Worker for PWA
self.addEventListener('fetch', (event) => {
  // We are not aggressively caching right now to avoid breaking Next.js App Router (Server Actions/SSR).
  // The minimal requirement for PWA installability on Chrome is a fetch handler.
  event.respondWith(fetch(event.request));
});
