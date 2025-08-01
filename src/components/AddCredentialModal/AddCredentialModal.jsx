// src/components/AddCredentialModal/AddCredentialModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 👈 IMPORTA
import { faMagic } from '@fortawesome/free-solid-svg-icons'; // 👈 IMPORTA
import './AddCredentialModal.css';

// Ahora acepta una prop `existingData`
const AddCredentialModal = ({ onSave, onClose, existingData, generatedPassword }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Determina si estamos en modo de edición
  const isEditMode = !!existingData;

  // Si estamos en modo de edición, llena el formulario con los datos existentes
  useEffect(() => {
    if (isEditMode) {
      reset(existingData);
    }
  }, [isEditMode, existingData, reset]);

  // 👇 NUEVO: Función para usar la contraseña generada
  const useGeneratedPassword = () => {
    if (generatedPassword) {
      // 'setValue' actualiza el valor de un campo del formulario
      setValue('password', generatedPassword, { shouldValidate: true });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* El título cambia dinámicamente */}
        <h2>{isEditMode ? 'Editar Credencial' : 'Añadir Nueva Credencial'}</h2>
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
            {/* En modo edición, no mostramos la contraseña anterior por seguridad */}
            <div className="password-field-group"> {/* 👈 NUEVO: Contenedor */}
              <input 
                type="password" 
                {...register('password', { required: !isEditMode })} 
                placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : ''} 
              />
              {/* 👇 NUEVO: Botón para usar la contraseña generada */}
              {generatedPassword && (
                <button type="button" className="use-generated-btn" title="Usar contraseña generada" onClick={useGeneratedPassword}>
                  <FontAwesomeIcon icon={faMagic} />
                </button>
              )}
            </div>
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