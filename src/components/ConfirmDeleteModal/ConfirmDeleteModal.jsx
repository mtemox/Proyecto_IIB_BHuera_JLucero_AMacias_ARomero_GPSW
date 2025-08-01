// src/components/ConfirmDeleteModal/ConfirmDeleteModal.jsx
import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>¿Estás seguro?</h3>
        <p>Esta acción no se puede deshacer. La credencial se eliminará permanentemente.</p>
        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="button-cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="button-delete">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;