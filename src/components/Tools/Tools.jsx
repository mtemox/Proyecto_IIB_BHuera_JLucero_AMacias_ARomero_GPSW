// src/components/Tools/Tools.jsx
import React from 'react';
import { faShieldAlt, faHistory, faFileExport, faPlay, faBookOpen, faDownload } from '@fortawesome/free-solid-svg-icons';
import ToolItem from './ToolItem';
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

const Tools = () => {
  return (
    <div className="tools-container">
      {toolData.map(tool => (
        <ToolItem key={tool.id} {...tool} />
      ))}
    </div>
  );
};

export default Tools;