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
      chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        if (chrome.runtime.lastError || !token) {
          console.error(chrome.runtime.lastError?.message || "No se pudo obtener el token.");
          return reject("El usuario canceló o hubo un error de autenticación.");
        }
        try {
          const credential = GoogleAuthProvider.credential(null, token);
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
    return new Promise((resolve, reject) => {
      // Obtenemos el token actual para poder invalidarlo
      chrome.identity.getAuthToken({ interactive: false }, (currentToken) => {
        if (currentToken) {
          // 1. Invalidamos el token de acceso de Google para forzar un nuevo login la próxima vez.
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${currentToken}`);
          
          // 2. Removemos el token de la caché de Chrome
          chrome.identity.removeCachedAuthToken({ token: currentToken }, () => {
            // 3. Finalmente, cerramos la sesión en Firebase
            signOut(auth).then(resolve).catch(reject);
          });
        } else {
          // Si no hay token en caché, simplemente cerramos sesión en Firebase
          signOut(auth).then(resolve).catch(reject);
        }
      });
    });
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