// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; 
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestToken = async () => {
  return getToken(messaging, { vapidKey: "BLZvJj1rrpRoO8JwNEX-DPdNbvZLefDAfsDskVmUgkr9FV9TEdKYfMZyCnTYPaeXYOMxJHTJ1Q-yB0_Nk5Qp93s" })
  .then((currentToken) => {
    if(currentToken) {
      console.log(currentToken)
      return currentToken
    } else {
      console.log("No registration token available, Request permissin ...")
      Notification.requestPermission().then((permission) => {
          if(permission === 'granted') {
            toast.success("Da bat thong bao")
          } else if(permission === 'denied') {
            toast.error("Tu choi bat thong bao")
          }
      })
    }
  }).catch((err) => {
    toast.error(err.message)
  })  
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

onMessage(messaging, (payload) => {
  console.log("Message received:", payload)
  const title = payload.notification?.title
  const options = {
    body: payload.notification?.body,
    icon: payload.notification?.icon
  };

  new Notification(title ?? "", options);
})

export default messaging;