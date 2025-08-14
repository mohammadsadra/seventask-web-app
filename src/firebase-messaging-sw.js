importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyAoIrIG84HfroWrNIqrWg_ZMg2ZbizvRrI",
  authDomain: "seventaskfirebasemessaging.firebaseapp.com",
  projectId: "seventaskfirebasemessaging",
  storageBucket: "seventaskfirebasemessaging.appspot.com",
  messagingSenderId: "293255224366",
  appId: "1:293255224366:web:88d0dec9e455e80022d3bf",
  measurementId: "G-T1ZT0KVWFD"
});

const messaging = firebase.messaging();




self.addEventListener('notificationclick', function(event) {
  // event.notification.close();
  // const data = JSON.parse(event.data);
  console.log('events');
  event.waitUntil(self.clients.openWindow('https://app.seventask.com'));
});

