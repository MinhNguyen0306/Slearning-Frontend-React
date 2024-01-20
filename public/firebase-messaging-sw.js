importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// import { onBackgroundMessage } from 'firebase/messaging/sw';

const firebaseConfig = {
  apiKey: "AIzaSyC1fgpwfWXOqvZ5y66XscV_oQfKLmxe4ek",
  authDomain: "slearning-f8d17.firebaseapp.com",
  projectId: "slearning-f8d17",
  storageBucket: "slearning-f8d17.appspot.com",
  messagingSenderId: "30821184200",
  appId: "1:30821184200:web:fe3b791b0f85f3d8346bfd",
  measurementId: "G-NMDQTNCXLP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//   console.log("Message received:", payload)
//   const title = payload.notification?.title
//   const options = {
//     body: payload.notification?.body,
//     icon: payload.notification?.icon
//   };

//   new Notification(title ?? "", options);
// })

messaging.onBackgroundMessage(messaging, (payload) => {
    console.log("Message received.", payload);
    const title = payload.notification?.title
    const options = {
      body: payload.notification?.body,
      icon: payload.notification?.icon
    };
    
    self.registration.showNotification(title, options);
})