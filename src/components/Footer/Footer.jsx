// src/components/Footer/Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="extension-footer">
      <div className="footer-actions">
        <button className="footer-button" title="Ayuda">
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
        <button className="footer-button" title="Compartir">
          <FontAwesomeIcon icon={faShareAlt} />
        </button>
      </div>
      <p className="footer-text">Key+ v1.0 - Seguridad para tus credenciales</p>
    </footer>
  );
};

export default Footer;