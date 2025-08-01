// src/components/Auth/Auth.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import googleLogo from '../../assets/google-logo.svg'; // 👈 Necesitaremos un logo de Google

const Auth = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Bienvenido a Key+</h2>
      <p className="auth-subtitle">Inicia sesión para proteger tus contraseñas.</p>
      
      <button onClick={handleSignIn} className="google-signin-button">
        <img src={googleLogo} alt="Google logo" className="google-logo" />
        <span>Iniciar sesión con Google</span>
      </button>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Auth;