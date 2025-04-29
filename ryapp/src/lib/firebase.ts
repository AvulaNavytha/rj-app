import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAiav-Ek4IHBEjuF59aBx06WG3IEOnTaAM",
  authDomain: "movie-fbd7f.firebaseapp.com",
  databaseURL: "https://movie-fbd7f-default-rtdb.firebaseio.com",
  projectId: "movie-fbd7f",
  storageBucket: "movie-fbd7f.firebasestorage.app",
  messagingSenderId: "706053708272",
  appId: "1:706053708272:web:cc34af611cedb0a47b2535",
  measurementId: "G-Q0XSZGW8N7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
