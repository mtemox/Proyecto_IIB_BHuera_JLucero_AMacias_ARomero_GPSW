// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Reemplaza esto con el objeto de configuración de TU proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-onucGGtYAfpD9wfdin8qttPCepUTjNA",
  authDomain: "keyplus-a9573.firebaseapp.com",
  projectId: "keyplus-a9573",
  storageBucket: "keyplus-a9573.firebasestorage.app",
  messagingSenderId: "768609595455",
  appId: "1:768609595455:web:1fcefab948cb944fb4088a",
  measurementId: "G-M5PK6VC6Q6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que usaremos
export const auth = getAuth(app);
export const db = getFirestore(app);