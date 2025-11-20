
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence, disableNetwork, enableNetwork } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVTRpELx9xjjVeSPAPUHeOr7ksaAqANBw",
  authDomain: "medai-f640f.firebaseapp.com",
  projectId: "medai-f640f",
  storageBucket: "medai-f640f.firebasestorage.app",
  messagingSenderId: "966649608766",
  appId: "1:966649608766:web:4841fa54f82daa41f0af6f",
  measurementId: "G-NWCMFW5H00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });

export { app, db, auth };
