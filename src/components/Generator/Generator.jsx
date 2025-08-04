// src/components/Generator/Generator.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSyncAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from '../common/ToggleSwitch/ToggleSwitch';
import './Generator.css';

const Generator = ({ onPasswordGenerated }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [copied, setCopied] = useState(false);

  const handleOptionChange = (option) => {
    setOptions({ ...options, [option]: !options[option] });
  };

  const generatePassword = () => {
      const charSets = {
          uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          lowercase: 'abcdefghijklmnopqrstuvwxyz',
          numbers: '0123456789',
          symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
      };
      let availableChars = '';
      let newPassword = '';

      Object.keys(options).forEach(key => {
          if (options[key]) {
              availableChars += charSets[key];
          }
      });

      if (!availableChars) {
          setPassword('');
          onPasswordGenerated(''); 
          return;
      };

      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * availableChars.length);
          newPassword += availableChars[randomIndex];
      }
      setPassword(newPassword);
      onPasswordGenerated(newPassword);
      setCopied(false);
  };

  const copyToClipboard = () => {
      if (!password) return;
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // Generar una contraseña cuando cambien las opciones o la longitud
  useEffect(() => {
      generatePassword();
  }, [length, options]);

  return (
    <div className="generator-container">
      {/* Longitud */}
      <div className="option-item">
        <label className="option-label">Longitud:</label>
        <span className="length-value">{length}</span>
      </div>
      <input
        type="range"
        min="6"
        max="32"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        className="length-slider"
      />

      {/* Opciones con Interruptores */}
      <div className="options-list">
        <div className="option-item">
          <label className="option-label">Incluir mayúsculas</label>
          <ToggleSwitch checked={options.uppercase} onChange={() => handleOptionChange('uppercase')} />
        </div>
        <div className="option-item">
          <label className="option-label">Incluir minúsculas</label>
          <ToggleSwitch checked={options.lowercase} onChange={() => handleOptionChange('lowercase')} />
        </div>
        <div className="option-item">
          <label className="option-label">Incluir números</label>
          <ToggleSwitch checked={options.numbers} onChange={() => handleOptionChange('numbers')} />
        </div>
        <div className="option-item">
          <label className="option-label">Incluir símbolos</label>
          <ToggleSwitch checked={options.symbols} onChange={() => handleOptionChange('symbols')} />
        </div>
      </div>

      {/* Contraseña Generada */}
      <div className="generated-password-wrapper">
          <label className="block-label">Contraseña generada</label>
          <div className="password-input-group">
              <input type="text" value={password} readOnly placeholder="Ajusta las opciones..." />
              <button onClick={copyToClipboard} title="Copiar">
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              </button>
          </div>
      </div>

      <button className="generate-button" onClick={generatePassword}>
          <FontAwesomeIcon icon={faSyncAlt} />
          Generar nueva
      </button>
    </div>
  );
};

export default Generator;