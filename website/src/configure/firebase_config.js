// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5JjXyaWVReJW0K-UCXk-q__jb82Ny0U0",
  authDomain: "competition-era.firebaseapp.com",
  projectId: "competition-era",
  storageBucket: "competition-era.appspot.com",
  messagingSenderId: "31440365762",
  appId: "1:31440365762:web:0c4898222989075f79735b",
  measurementId: "G-ZMLQNEBE5Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
