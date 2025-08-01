// src/components/Vault/Vault.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faGlobe } from '@fortawesome/free-solid-svg-icons';
import CredentialItem from './CredentialItem';
import AddCredentialModal from '../CredentialForm/CredentialForm';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { encryptData } from '../../utils/encryption';
import CredentialForm from '../CredentialForm/CredentialForm';
import './Vault.css';

const Vault = ({ generatedPassword }) => {
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 ESTADO PARA EL MODAL DE ELIMINACIÓN
  const [credentialToDelete, setCredentialToDelete] = useState(null); // 👈 ESTADO PARA GUARDAR EL ID A ELIMINAR
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // --- INICIO DE CAMBIOS ---
  const [searchTerm, setSearchTerm] = useState(''); // 👈 NUEVO: Estado para el término de búsqueda
  const [filteredCredentials, setFilteredCredentials] = useState([]); // 👈 NUEVO: Estado para las credenciales filtradas
  const [editingCredential, setEditingCredential] = useState(null); 
  // --- FIN DE CAMBIOS ---

  // Leer credenciales en tiempo real
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const q = query(collection(db, 'credentials'), where('userId', '==', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const creds = [];
      querySnapshot.forEach((doc) => {
        creds.push({ id: doc.id, ...doc.data() });
      });
      setCredentials(creds);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, [currentUser]);

  // --- INICIO DE CAMBIOS ---
  // 👈 NUEVO: useEffect para filtrar las credenciales cuando cambia la búsqueda o la lista original
  useEffect(() => {
    const results = credentials.filter(cred =>
      cred.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCredentials(results);
  }, [searchTerm, credentials]);
  // --- FIN DE CAMBIOS ---

  // Guardar nueva credencial
  // 👇 MODIFICADO: La función ahora maneja creación Y actualización
  const handleSaveCredential = async (data) => {
    if (!currentUser) return;

    // Si hay una nueva contraseña, la encriptamos. Si no, no la tocamos.
    let finalPassword = editingCredential ? editingCredential.password : '';
    if (data.password) {
      finalPassword = encryptData(data.password, currentUser.uid);
    }

    const credentialData = {
      name: data.name,
      email: data.email,
      password: finalPassword,
      userId: currentUser.uid,
    };

    try {
      if (editingCredential) {
        // MODO EDICIÓN: Actualiza el documento existente
        setView('list'); // 👈 Regresa a la lista después de guardar
        setEditingCredential(null);
        const credRef = doc(db, 'credentials', editingCredential.id);
        await updateDoc(credRef, credentialData);
      } else {
        // MODO CREACIÓN: Añade un nuevo documento
        await addDoc(collection(db, 'credentials'), credentialData);
      }

      cancelForm();

    } catch (error) {
      console.error("Error al guardar la credencial:", error);
    }
  };

  // --- INICIO DE CAMBIOS ---
  // 👇 NUEVO: Funciones para abrir y cerrar el modal en modo edición o creación
  const openEditModal = (credential) => {
    setEditingCredential(credential);
    setView('form'); // 👈 Cambia a la vista de formulario
  };

  const openAddModal = () => {
    setEditingCredential(null);
    setView('form'); // 👈 Cambia a la vista de formulario
  };

  const cancelForm = () => {
    setView('list'); // 👈 Regresa a la lista
    setEditingCredential(null);
  };
  // --- FIN DE CAMBIOS ---

  // 👇 FUNCIÓN PARA ABRIR EL MODAL DE CONFIRMACIÓN
  const openDeleteConfirm = (id) => {
    setCredentialToDelete(id);
    setShowDeleteModal(true);
  };

  // 👇 FUNCIÓN PARA EJECUTAR LA ELIMINACIÓN
  const handleDeleteCredential = async () => {
    if (!credentialToDelete) return;
    try {
      const credRef = doc(db, 'credentials', credentialToDelete);
      await deleteDoc(credRef);
      setShowDeleteModal(false);
      setCredentialToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la credencial:", error);
    }
  };

  return (
    <div className="vault-container">
    
      {showDeleteModal && <ConfirmDeleteModal onConfirm={handleDeleteCredential} onCancel={() => setShowDeleteModal(false)} />}

      {/* El botón ahora usa la nueva función para abrir el modal en modo "añadir" */}
      {view === 'form' ? (
      <CredentialForm 
        onSave={handleSaveCredential} 
        onCancel={cancelForm}
        existingData={editingCredential}
        generatedPassword={generatedPassword} 
      />
    ) : (
      // 👇 ENVUELVE LA LISTA Y LA BÚSQUEDA EN UN FRAGMENT (<>)
      <>
        <div className="search-bar-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        {/* 👇 CONECTA EL INPUT AL ESTADO */}
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        <div className="credentials-list">
        {loading ? (
          <p className="status-text">Cargando...</p>
        ) : credentials.length === 0 ? (
          <p className="status-text">No tienes credenciales guardadas.</p>
        // 👇 MUESTRA UN MENSAJE SI NO HAY RESULTADOS DE BÚSQUEDA
        ) : filteredCredentials.length === 0 ? (
          <p className="status-text">No se encontraron resultados para "{searchTerm}".</p>
        ) : (
          // 👇 RENDERIZA LA LISTA FILTRADA
          filteredCredentials.map(cred => (
            <CredentialItem
              key={cred.id}
              icon={faGlobe}
              name={cred.name}
              email={cred.email}
              encryptedPassword={cred.password}
              onEdit={() => openEditModal(cred)}
              onDelete={() => openDeleteConfirm(cred.id)}
            />
          ))
        )}
      </div>

        <button onClick={openAddModal} className="add-credential-button">
          <FontAwesomeIcon icon={faPlus} />
          Añadir credencial
        </button>
      </>
    )}
    </div>
  );
};

export default Vault;