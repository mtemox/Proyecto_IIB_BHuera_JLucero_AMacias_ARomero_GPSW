// src/App.jsx
import React from 'react';
import Header from './components/Header/Header';
import Tabs from './components/Tabs/Tabs';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth'; 
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="extension-container">
      {currentUser ? (
        // Si el usuario ha iniciado sesión, muestra la app principal
        <>
          <Header />
          <Tabs />
          <Footer />
        </>
      ) : (
        // Si no, muestra la pantalla de autenticación
        <Auth />
      )}
    </div>
  );
}

export default App;