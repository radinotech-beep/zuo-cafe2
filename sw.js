const CACHE='zuo-v11';
const FILES=['/','/index.html','/manifest.json'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

// 푸시 알림 수신
self.addEventListener('push',e=>{
  if(!e.data)return;
  const data=e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title||'ZUO 알림',{
      body:data.body||'',
      icon:'/icons/icon-192.png',
      badge:'/icons/icon-192.png',
      tag:data.tag||'zuo-push',
      data:data.url||'/',
      requireInteraction:false,
      vibrate:[200,100,200]
    })
  );
});

// 알림 클릭 시 앱 열기
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
      if(cs.length>0){cs[0].focus();return;}
      return clients.openWindow(e.notification.data||'/');
    })
  );
});
