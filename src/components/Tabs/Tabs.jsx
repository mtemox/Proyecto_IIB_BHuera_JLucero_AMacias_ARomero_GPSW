// src/components/Tabs/Tabs.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faKey, faTools, faCheck } from '@fortawesome/free-solid-svg-icons';
import Vault from '../Vault/Vault';
import Generator from '../Generator/Generator'; // <--- IMPORTA EL NUEVO COMPONENTE
import './Tabs.css';
import Tools from '../Tools/Tools'; 

const ToolsContent = () => <div className="tab-content">Contenido de Herramientas</div>;

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('vault');

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return <Generator />; // <--- USA EL COMPONENTE GENERATOR
      case 'tools':
        return <Tools />;
      case 'vault':
      default:
        return <Vault />;
    }
  };

  // ... el resto del componente no cambia ...
  return (
    <>
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('vault')}
        >
          <FontAwesomeIcon icon={faLock} className="tab-icon" />
          Credenciales
        </button>
        <button
          className={`tab-button ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <FontAwesomeIcon icon={faKey} className="tab-icon" />
          Generador
        </button>
        <button
          className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <FontAwesomeIcon icon={faTools} className="tab-icon" />
          Herramientas
        </button>
      </div>
      <main className="content-area">
        {renderContent()}
      </main>
    </>
  );
};

export default Tabs;