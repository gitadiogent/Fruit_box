// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FirebaseApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`, //"AIzaSyCvOO5u6-NwfMQAH4InplcM72Ckh8W9rSg",
//   authDomain:`${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,                                                                              //"shop-daba0.firebaseapp.com",
//   projectId:`${process.env.REACT_APP_FIREBASE_PROJECTID}`,
//   storageBucket:`${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
//   messagingSenderId:`${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
//   appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
//   // measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`
  
// };

const firebaseConfig = {
  apiKey: "AIzaSyCmfKCimiEyGF2dGckhpGRwYARjpf6CDA0",
  authDomain: "froutbox.firebaseapp.com",
  projectId: "froutbox",
  storageBucket: "froutbox.appspot.com",
  messagingSenderId: "483998935068",
  appId: "1:483998935068:web:ac7eb1c68b263386a657d9",
  measurementId: "G-MVSQ0ZDV8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);;
export const auth = getAuth(app)
export const storage = getStorage(app);

export {app}