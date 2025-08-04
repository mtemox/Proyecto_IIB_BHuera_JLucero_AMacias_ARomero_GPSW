// src/components/CredentialForm/CredentialForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/free-solid-svg-icons';
import './CredentialForm.css';

const CredentialForm = ({ onSave, onCancel, existingData, generatedPassword }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const isEditMode = !!existingData;

  useEffect(() => {
    if (isEditMode) {
      reset(existingData);
    } else {
      // 👇 SÓLO EJECUTAR SI ESTAMOS EN EL CONTEXTO DE UNA EXTENSIÓN
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].url) {
            try {
              const url = new URL(tabs[0].url);
              setValue('url', url.hostname);
            } catch (e) {
              console.log("No es una URL válida para autocompletar.");
            }
          }
        });
      }
    }
  }, [isEditMode, existingData, reset, setValue]);

  // 👇👇 CORRECCIÓN AQUÍ: Esta función faltaba 👇👇
  const useGeneratedPassword = () => {
    if (generatedPassword) {
      setValue('password', generatedPassword, { shouldValidate: true });
    }
  };

  return (
    <div className="credential-form-container">
      <h2>{isEditMode ? 'Editar Credencial' : 'Añadir Nueva Credencial'}</h2>
      <form onSubmit={handleSubmit(onSave)}>
        {/* ... (el resto del formulario no cambia, solo el contenedor) ... */}
        <div className="form-group">
          <label>Nombre del Sitio</label>
          <input {...register('name', { required: true })} placeholder="Ej: Google, Facebook..." />
          {errors.name && <span className="error">Este campo es requerido.</span>}
        </div>

        {/* 👇👇 NUEVO CAMPO PARA LA URL 👇👇 */}
        <div className="form-group">
          <label>URL del Sitio Web</label>
          <input {...register('url', { required: true })} placeholder="ejemplo.com" />
          {errors.url && <span className="error">Este campo es requerido.</span>}
        </div>

        <div className="form-group">
          <label>Correo o Usuario</label>
          <input {...register('email', { required: true })} placeholder="usuario@ejemplo.com" />
          {errors.email && <span className="error">Este campo es requerido.</span>}
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <div className="password-field-group">
            <input type="password" {...register('password', { required: !isEditMode })} placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : ''} />
            {generatedPassword && (
              <button type="button" className="use-generated-btn" title="Usar contraseña generada" onClick={useGeneratedPassword}>
                <FontAwesomeIcon icon={faMagic} />
              </button>
            )}
          </div>
          {errors.password && <span className="error">Este campo es requerido.</span>}
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="button-cancel">Cancelar</button>
          <button type="submit" className="button-save">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default CredentialForm;