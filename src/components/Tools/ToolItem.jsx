// src/components/Tools/ToolItem.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ToolItem.css';

const ToolItem = ({ icon, title, description, buttonText, buttonIcon, onClick }) => {
  return (
    <div className="tool-item">
      <div className="tool-header">
        <div className="tool-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="tool-icon" />
        </div>
        <h3>{title}</h3>
      </div>
      <p className="tool-description">{description}</p>
      <button className="tool-button" onClick={onClick}>
        <FontAwesomeIcon icon={buttonIcon} className="tool-button-icon" />
        {buttonText}
      </button>
    </div>
  );
};

export default ToolItem;