import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [ads, setAds] = useState([]);
  let imageUrl = "";

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(props) {
    const { name: displayName, profilePhoto } = props;
    try {
      const userResponse = await createUserWithEmailAndPassword(
        auth,
        props.email,
        props.password
      );
      await updateProfile(auth.currentUser, { displayName });

      if (profilePhoto) {
        const metadata = {
          contentType: "image/jpeg",
        };

        const storageRef = ref(
          storage,
          "images/" + profilePhoto.name // userResponse.user.uid + "/" +
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          profilePhoto,
          metadata
        );
      }
    } catch (err) {
      console.error("Error creating user", err);
    }
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const adsSnapshot = await getDocs(collection(db, "ads"));
        const adsData = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn, ads }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
