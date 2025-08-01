// src/components/SecurityCheck/SecurityCheck.jsx
import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';
import { useAuth } from '../../context/AuthContext';
import { decryptData } from '../../utils/encryption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './SecurityCheck.css';

const SecurityCheck = ({ credentials, onClose }) => {
  const { currentUser } = useAuth();

  const getStrengthInfo = (score) => {
    switch (score) {
      case 0: return { text: 'Muy Débil', className: 'very-weak' };
      case 1: return { text: 'Débil', className: 'weak' };
      case 2: return { text: 'Regular', className: 'medium' };
      case 3: return { text: 'Fuerte', className: 'strong' };
      case 4: return { text: 'Muy Fuerte', className: 'very-strong' };
      default: return { text: 'Desconocido', className: 'unknown' };
    }
  };

  // 👇 NUEVO: Agrupa las credenciales por fortaleza
  const groupedCredentials = useMemo(() => {
    const groups = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    credentials.forEach(cred => {
      const decryptedPass = decryptData(cred.password, currentUser.uid);
      const { score } = zxcvbn(decryptedPass);
      if (groups[score]) {
        groups[score].push(cred);
      }
    });
    return groups;
  }, [credentials, currentUser]);

  const strengthLevels = [
    { score: 0, title: 'Contraseñas Muy Débiles' },
    { score: 1, title: 'Contraseñas Débiles' },
    { score: 2, title: 'Contraseñas Regulares' },
    { score: 3, title: 'Contraseñas Fuertes' },
    { score: 4, title: 'Contraseñas Muy Fuertes' },
  ];

  return (
    <div className="security-check-container">
      <div className="security-check-header">
        <h2>Examen de Seguridad</h2>
        <button onClick={onClose} className="close-button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="results-list">
        {strengthLevels.map(level => 
          // Solo muestra el grupo si tiene credenciales
          groupedCredentials[level.score].length > 0 && (
            <div key={level.score} className="strength-group">
              <h3>{level.title}</h3>
              {groupedCredentials[level.score].map(cred => {
                const strength = getStrengthInfo(level.score);
                return (
                  <div key={cred.id} className="result-item">
                    <div className="result-info">
                      <span className="result-name">{cred.name}</span>
                      <span className="result-email">{cred.email}</span>
                    </div>
                    <div className={`result-strength ${strength.className}`}>
                      {strength.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SecurityCheck;