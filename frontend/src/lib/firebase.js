import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";

// Firebase configuration using environment variables or safe defaults for demo
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPrecurAiApiKey1234567890",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "precurai-safety.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "precurai-safety",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "precurai-safety.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
};
export default app;

