const CACHE_NAME='jizhang-v2';
const ASSETS=['./index.html','./manifest.json'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
 self.skipWaiting();
});

self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
 self.clients.claim();
});

// Network-first: always try network, fallback to cache
self.addEventListener('fetch',e=>{
 e.respondWith(
  fetch(e.request).then(r=>{
   // Update cache with fresh response
   if(r.status===200){
    const clone=r.clone();
    caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));
   }
   return r;
  }).catch(()=>caches.match(e.request))
 );
});
