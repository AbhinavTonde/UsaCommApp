import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-e1cfe.firebaseapp.com",
  databaseURL: "https://reactchatapp-e1cfe-default-rtdb.firebaseio.com",
  projectId: "reactchatapp-e1cfe",
  storageBucket: "reactchatapp-e1cfe.appspot.com",
  messagingSenderId: "249023454362",
  appId: "1:249023454362:web:6c40d171925504d4a99323"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()