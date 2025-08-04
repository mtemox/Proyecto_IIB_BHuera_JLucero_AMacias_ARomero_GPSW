// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      // 1. Usamos la API nativa de Chrome para pedir el token de autenticación.
      //    'interactive: true' hará que se muestre la ventana de login de Google.
      chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        // 2. Verificamos si hubo un error o el usuario canceló.
        if (chrome.runtime.lastError || !token) {
          console.error(chrome.runtime.lastError);
          return reject("El usuario canceló o hubo un error de autenticación.");
        }
        
        try {
          // 3. Creamos una credencial de Firebase usando el token de Google.
          const credential = GoogleAuthProvider.credential(null, token);
          
          // 4. Iniciamos sesión en Firebase con esa credencial.
          const result = await signInWithCredential(auth, credential);
          resolve(result);
        } catch (error) {
          console.error("Error al iniciar sesión con la credencial de Firebase:", error);
          reject(error);
        }
      });
    });
  };

  const logout = () => {
    // Para desloguear, también debemos remover el token cacheado por Chrome.
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {});
      }
    });
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};