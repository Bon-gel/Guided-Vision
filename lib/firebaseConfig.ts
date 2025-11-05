import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCU7AvVlcdXhCX_oNwLnb52kzZffaOFJpA",
  authDomain: "idris-final-year-project.firebaseapp.com",
  databaseURL: "https://idris-final-year-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "idris-final-year-project",
  storageBucket: "idris-final-year-project.firebasestorage.app",
  messagingSenderId: "944665259379",
  appId: "1:944665259379:web:b00edbe07408d966ab6906"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
