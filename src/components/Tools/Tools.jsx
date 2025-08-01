// src/components/Tools/Tools.jsx
import React from 'react';
import { faShieldAlt, faHistory, faFileExport, faPlay, faBookOpen, faDownload } from '@fortawesome/free-solid-svg-icons';
import ToolItem from './ToolItem';
import { useAuth } from '../../context/AuthContext'; // 👈 IMPORTA
import { decryptData } from '../../utils/encryption'; // 👈 IMPORTA
import { exportDataToFile } from '../../utils/exportUtils'; // 👈 IMPORTA
import './Tools.css';

const toolData = [
  {
    id: 'security-check',
    icon: faShieldAlt,
    title: 'Examen de seguridad',
    description: 'Analiza la fortaleza y posibles vulnerabilidades de tus contraseñas.',
    buttonText: 'Analizar ahora',
    buttonIcon: faPlay
  },
  {
    id: 'history',
    icon: faHistory,
    title: 'Historial de cambios',
    description: 'Revisa versiones anteriores de tus credenciales.',
    buttonText: 'Ver historial',
    buttonIcon: faBookOpen
  },
  {
    id: 'export',
    icon: faFileExport,
    title: 'Exportar copia de seguridad',
    description: 'Crea una copia cifrada de todas tus credenciales.',
    buttonText: 'Exportar datos',
    buttonIcon: faDownload
  }
];

const Tools = ({ onStartSecurityCheck, allCredentials }) => {
  
  const { currentUser } = useAuth(); // 👈 OBTÉN EL USUARIO

  // 👇 NUEVO: Función para manejar la exportación
  const handleExport = () => {
    if (!currentUser || allCredentials.length === 0) {
      alert("No hay credenciales para exportar.");
      return;
    }

    // 1. Desencripta todas las contraseñas
    const decryptedCredentials = allCredentials.map(cred => ({
      name: cred.name,
      email: cred.email,
      password: decryptData(cred.password, currentUser.uid),
    }));

    // 2. Convierte los datos a un formato de texto (JSON)
    const jsonData = JSON.stringify(decryptedCredentials, null, 2); // el 'null, 2' lo hace más legible

    // 3. Llama a la utilidad de exportación
    exportDataToFile(jsonData, `key-plus_backup_${new Date().toISOString().slice(0,10)}.json`, 'application/json');
  };

  const toolData = [
    {
      id: 'security-check',
      icon: faShieldAlt,
      title: 'Examen de seguridad',
      description: 'Analiza la fortaleza y posibles vulnerabilidades de tus contraseñas.',
      buttonText: 'Analizar ahora',
      buttonIcon: faPlay,
      action: onStartSecurityCheck // 👈 ASOCIA LA ACCIÓN
    },
    {
      id: 'export',
      icon: faFileExport,
      title: 'Exportar copia de seguridad',
      description: 'Crea una copia cifrada de todas tus credenciales.',
      buttonText: 'Exportar datos',
      buttonIcon: faDownload,
      action: handleExport // 👈 ASOCIA LA NUEVA ACCIÓN
    }
    // ... (otras herramientas)
  ];

  return (
    <div className="tools-container">
      {toolData.map(tool => (
        <ToolItem key={tool.id} {...tool} onClick={tool.action} />
      ))}
    </div>
  );
};

export default Tools;