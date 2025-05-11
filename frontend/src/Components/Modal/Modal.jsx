import React from 'react';
import './Modal.css';

const Modal = ({ title, children, onClose, variant }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${variant || ''}`} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-header">{title}</h2>}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
