// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyBZNSBZqshoF_oBk3S1UFPBh5ZpLiMEpc4",
  authDomain: "simpplrcrud.firebaseapp.com",
  projectId: "simpplrcrud",
  storageBucket: "simpplrcrud.appspot.com",
  messagingSenderId: "716265102284",
  appId: "1:716265102284:web:33fc33173e0d6318365b69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)