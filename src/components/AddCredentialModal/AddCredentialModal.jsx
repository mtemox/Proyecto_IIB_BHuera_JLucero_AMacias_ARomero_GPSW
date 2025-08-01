// src/components/AddCredentialModal/AddCredentialModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import './AddCredentialModal.css';

const AddCredentialModal = ({ onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Añadir Nueva Credencial</h2>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="form-group">
            <label>Nombre del Sitio</label>
            <input {...register('name', { required: true })} placeholder="Ej: Google, Facebook..." />
            {errors.name && <span className="error">Este campo es requerido.</span>}
          </div>
          <div className="form-group">
            <label>Correo o Usuario</label>
            <input {...register('email', { required: true })} placeholder="usuario@ejemplo.com" />
            {errors.email && <span className="error">Este campo es requerido.</span>}
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" {...register('password', { required: true })} />
            {errors.password && <span className="error">Este campo es requerido.</span>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-cancel">Cancelar</button>
            <button type="submit" className="button-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCredentialModal;