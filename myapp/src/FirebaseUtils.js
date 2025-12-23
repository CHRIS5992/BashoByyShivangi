import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRemXVXFEKLXU6ub7czCQyeDDRRn-SeNg",
  authDomain: "snowstack-c2cd7.firebaseapp.com",
  projectId: "snowstack-c2cd7",
  storageBucket: "snowstack-c2cd7.firebasestorage.app",
  messagingSenderId: "994233955808",
  appId: "1:994233955808:web:f6abd9373d896b58c02785",
  measurementId: "G-3Y9P3T9W86"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
