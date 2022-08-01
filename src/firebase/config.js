import { initializeApp } from 'firebase/app';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBv6XY0Mt6t9njvhhajHW5i8aTby-hXdH0',
  authDomain: 'project-management-d8b3c.firebaseapp.com',
  projectId: 'project-management-d8b3c',
  storageBucket: 'project-management-d8b3c.appspot.com',
  messagingSenderId: '554706445289',
  appId: '1:554706445289:web:9c8378fce118062c79a178',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage(app);

// Timestamp
export const createdAt = serverTimestamp();

// user authentication check automatically
export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

// add user collection to database
export const createUserDocumentFromAuth = async (userAuth, photoURL) => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        online: true,
        displayName,
        photoURL,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};
