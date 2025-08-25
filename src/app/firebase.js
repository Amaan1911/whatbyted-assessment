import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBxTe2cWHQDxrspAZe5f7sC-P_GuNx4xA",
  authDomain: "whatbytes-68f1e.firebaseapp.com",
  projectId: "whatbytes-68f1e",
  storageBucket: "whatbytes-68f1e.firebasestorage.app",
  messagingSenderId: "43342268734",
  appId: "1:43342268734:web:fa8e8e671d373e5043446f",
  measurementId: "G-1CXDTQLCW9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
