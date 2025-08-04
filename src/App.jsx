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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import logo from './assets/logo3.png'; // 👈 IMPORTA TU LOGO
import './App.css';

function App() {
  const { currentUser } = useAuth();
  const [appView, setAppView] = useState('main');
  const [allCredentials, setAllCredentials] = useState([]);
  
  // 👇 NUEVO: Estado para el splash screen
  const [showSplash, setShowSplash] = useState(true);

  // 👇 NUEVO: useEffect para ocultar el splash screen después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // 2000 milisegundos = 2 segundos

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, []); // El array vacío asegura que solo se ejecute una vez al montar

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

  // 👇 NUEVO: Lógica para renderizar el splash screen
  if (showSplash) {
    return (
      <div className="splash-screen">
        {/* 👇👇 REEMPLAZA EL ICONO POR TU LOGO 👇👇 */}
        <img src={logo} alt="Key+ Logo" className="splash-logo" />
        {/* <h1 className="splash-title">Key+</h1> */}
      </div>
    );
  }
  
  // El resto de la lógica de renderizado
  return (
    <div className={`extension-container ${showSplash ? 'fade-out' : ''}`}>
      {currentUser ? (
        appView === 'securityCheck' ? (
          <SecurityCheck
            credentials={allCredentials}
            onClose={() => setAppView('main')}
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