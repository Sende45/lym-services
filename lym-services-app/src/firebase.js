import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyApI15ym42HUeuLWc5yfUpPoUzBHD0jeI8",
  authDomain: "lym-services.firebaseapp.com",
  projectId: "lym-services",
  storageBucket: "lym-services.appspot.com",
  messagingSenderId: "61327418530",
  appId: "1:61327418530:web:dd2be68b2e85e56586e3fb",
  measurementId: "G-R4FXGS31CX",
};

const app = initializeApp(firebaseConfig);

// ✅ EXPORTS OBLIGATOIRES
export const db = getFirestore(app);
export const auth = getAuth(app);

// (optionnel)
getAnalytics(app);
