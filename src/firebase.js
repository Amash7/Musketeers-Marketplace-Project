import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVu_bTeqPV8MkjYaXHx2HatLaKp2EEywk",
  authDomain: "marketplace-165ae.firebaseapp.com",
  projectId: "marketplace-165ae",
  storageBucket: "marketplace-165ae.appspot.com",
  messagingSenderId: "488119772185",
  appId: "1:488119772185:web:3ba1f4c8f9facc2238f688",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export { app, auth, storage, db };
