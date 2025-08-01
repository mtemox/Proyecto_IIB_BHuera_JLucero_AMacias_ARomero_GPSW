// src/components/Vault/Vault.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faGlobe } from '@fortawesome/free-solid-svg-icons';
import CredentialItem from './CredentialItem';
import AddCredentialModal from '../AddCredentialModal/AddCredentialModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { encryptData } from '../../utils/encryption';
import './Vault.css';

const Vault = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 ESTADO PARA EL MODAL DE ELIMINACIÓN
  const [credentialToDelete, setCredentialToDelete] = useState(null); // 👈 ESTADO PARA GUARDAR EL ID A ELIMINAR
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

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

  // Guardar nueva credencial
  const handleSaveCredential = async (data) => {
    if (!currentUser) return;
    try {
      // 👇 ENCRIPTA LA CONTRASEÑA ANTES DE GUARDAR
      const encryptedPassword = encryptData(data.password, currentUser.uid);

      await addDoc(collection(db, 'credentials'), {
        name: data.name,
        email: data.email,
        password: encryptedPassword, // 👈 GUARDA LA CONTRASEÑA ENCRIPTADA
        userId: currentUser.uid,
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar la credencial:", error);
    }
  };

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
      {showAddModal && <AddCredentialModal onSave={handleSaveCredential} onClose={() => setShowAddModal(false)} />}
      {/* 👇 MUESTRA EL MODAL DE CONFIRMACIÓN SI ES NECESARIO */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={handleDeleteCredential}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="search-bar-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder="Buscar credenciales..." className="search-input" />
      </div>

      <div className="credentials-list">
        {loading ? ( <p>Cargando...</p> ) : credentials.length === 0 ? ( <p>No tienes credenciales guardadas.</p> ) : (
          credentials.map(cred => (
            <CredentialItem
              key={cred.id}
              icon={faGlobe}
              name={cred.name}
              email={cred.email}
              encryptedPassword={cred.password}
              onDelete={() => openDeleteConfirm(cred.id)} // 👈 PASA LA FUNCIÓN AL ITEM
            />
          ))
        )}
      </div>

      <button onClick={() => setShowAddModal(true)} className="add-credential-button">
        <FontAwesomeIcon icon={faPlus} />
        Añadir credencial
      </button>
    </div>
  );
};

export default Vault;