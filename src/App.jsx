// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Tabs from './components/Tabs/Tabs';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth'; 
import SecurityCheck from './components/SecurityCheck/SecurityCheck'; 
import { useAuth } from './context/AuthContext';
import { db } from './firebase'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import './App.css';

function App() {
  const { currentUser } = useAuth();
  const [appView, setAppView] = useState('main'); // 'main' o 'securityCheck'
  const [allCredentials, setAllCredentials] = useState([]); // 👈 NUEVO ESTADO

  // Efecto para cargar todas las credenciales del usuario
  useEffect(() => {
    if (!currentUser) {
      setAllCredentials([]);
      return;
    }
    const q = query(collection(db, 'credentials'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const creds = [];
      querySnapshot.forEach((doc) => {
        creds.push({ id: doc.id, ...doc.data() });
      });
      setAllCredentials(creds);
    });
    return () => unsubscribe();
  }, [currentUser]);
  
  return (
    <div className="extension-container">
      {currentUser ? (
        // Si el usuario ha iniciado sesión, decide qué vista mostrar
        appView === 'securityCheck' ? (
          <SecurityCheck 
            credentials={allCredentials} 
            onClose={() => setAppView('main')} // Botón para regresar
          />
        ) : (
          <>
            <Header />
            <Tabs 
              onStartSecurityCheck={() => setAppView('securityCheck')} 
              allCredentials={allCredentials}
            />
            <Footer />
          </>
        )
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;