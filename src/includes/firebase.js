import { initializeApp } from 'firebase/app';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, doc,
  setDoc, query, where, getDoc, getDocs, updateDoc, deleteDoc, limit, orderBy, startAfter,
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBJ7DXlUkgCwPsAPyOseXN7doMuPdwRUiY',
  authDomain: 'music-4ce83.firebaseapp.com',
  projectId: 'music-4ce83',
  storageBucket: 'music-4ce83.appspot.com',
  messagingSenderId: '776106916850',
  appId: '1:776106916850:web:aed06100412ff2434b096b',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage(firebaseApp);

export default {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  limit,
  orderBy,
  startAfter,
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
};
