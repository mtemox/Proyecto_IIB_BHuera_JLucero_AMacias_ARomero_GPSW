// src/components/Vault/CredentialItem.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy, faTrash, faCheck, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { decryptData } from '../../utils/encryption';
import './CredentialItem.css';

// Recibimos la contraseña encriptada como 'encryptedPassword'
const CredentialItem = ({ icon, name, email, encryptedPassword, onEdit, onDelete  }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useAuth();

  const handleToggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  // Desencriptamos la contraseña solo cuando es necesario
  const decryptedPassword = isRevealed
    ? decryptData(encryptedPassword, currentUser.uid)
    : '••••••••••';

  const handleCopy = () => {
    const passwordToCopy = decryptData(encryptedPassword, currentUser.uid);
    navigator.clipboard.writeText(passwordToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="credential-item">
      <div className="credential-info">
        <div className="credential-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="credential-icon" />
        </div>
        <div className="credential-details">
          <h3 className="credential-name">{name}</h3>
          {/* Mostramos la contraseña desencriptada o los puntos */}
          <p className={`credential-password ${isRevealed ? 'revealed' : ''}`}>{decryptedPassword}</p>
        </div>
      </div>
      <div className="credential-actions">
        <button className="action-button" title="Copiar contraseña" onClick={handleCopy}>
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
        </button>
        <button className="action-button" title={isRevealed ? 'Ocultar' : 'Mostrar'} onClick={handleToggleReveal}>
          <FontAwesomeIcon icon={isRevealed ? faEyeSlash : faEye} />
        </button>
        <button className="action-button" title="Editar" onClick={onEdit}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button className="action-button delete" title="Eliminar" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CredentialItem;