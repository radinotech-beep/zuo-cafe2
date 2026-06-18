const CACHE='zuo-v26';
const BASE='/zuo-cafe2/';
const FILES=[BASE,BASE+'index.html',BASE+'manifest.json',BASE+'zuo-fixes.js'];

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

// Show notifications requested by the page.
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SHOW_NOTIFICATION'){
    const{title,body,tag}=e.data;
    e.waitUntil(
      self.registration.showNotification(title||'ZUO 알림',{
        body:body||'',
        icon:'/zuo-cafe2/icons/icon-192.png',
        badge:'/zuo-cafe2/icons/icon-192.png',
        tag:tag||'zuo-'+Date.now(),
        requireInteraction:false,
        vibrate:[200,100,200]
      })
    );
  }
});

// Receive push messages from a server.
self.addEventListener('push',e=>{
  if(!e.data)return;
  const data=e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title||'ZUO 알림',{
      body:data.body||'',
      icon:'/zuo-cafe2/icons/icon-192.png',
      badge:'/zuo-cafe2/icons/icon-192.png',
      tag:data.tag||'zuo-push',
      requireInteraction:false,
      vibrate:[200,100,200]
    })
  );
});

// Open the app when a notification is clicked.
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
      if(cs.length>0){cs[0].focus();return;}
      return clients.openWindow(BASE);
    })
  );
});
