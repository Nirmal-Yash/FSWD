import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', padding: '20px', minWidth: '400px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>{title}</h2>
        {children}
        <button onClick={onClose} style={{ padding: '8px 15px', marginTop: '15px', fontSize: '14px' }}>Close</button>
      </div>
    </div>
  );
};

export default Modal;