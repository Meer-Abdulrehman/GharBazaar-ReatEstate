// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gharbazaar-e0cdf.firebaseapp.com",
  projectId: "gharbazaar-e0cdf",
  storageBucket: "gharbazaar-e0cdf.firebasestorage.app",
  messagingSenderId: "444543370069",
  appId: "1:444543370069:web:20d43b59ba8363db4ca5dc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);