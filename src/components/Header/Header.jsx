import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png'; 
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {

  const { logout } = useAuth(); // 👈 OBTÉN LA FUNCIÓN DE LOGOUT

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <header className="extension-header">
      <div className="header-title">
        <FontAwesomeIcon icon={faKey} className="header-icon" />
        <h1>Key+</h1>
      </div>
      <div className="header-actions">
        <button className="header-button" title="Cerrar Sesión" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </header>
  );
};

export default Header;