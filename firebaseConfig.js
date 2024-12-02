import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGeNa6o-pdYXWWEUwJsjMp60M2oGLg1Ys",
    authDomain: "todolist-17e8c.firebaseapp.com",
    projectId: "todolist-17e8c",
    storageBucket: "todolist-17e8c.firebasestorage.app",
    messagingSenderId: "743068869418",
    appId: "1:743068869418:web:a7c996e52ddc89a7487453",
    measurementId: "G-4NWNJH5TBP"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
