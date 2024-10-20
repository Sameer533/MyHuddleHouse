// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC67c0sKQzBFjcBqJ_LoDKGF1Itur_AOtY",
  authDomain: "huddlehouse-948-947.firebaseapp.com",
  projectId: "huddlehouse-948-947",
  storageBucket: "huddlehouse-948-947.appspot.com",
  messagingSenderId: "620288440002",
  appId: "1:620288440002:web:e41c3326e09ae75dc66d5b",
  measurementId: "G-LTC2T2KYCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };
