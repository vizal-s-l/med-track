self.addEventListener('install', () => {
  console.log('Firebase messaging service worker installed');
});

self.addEventListener('activate', () => {
  console.log('Firebase messaging service worker activated');
});
