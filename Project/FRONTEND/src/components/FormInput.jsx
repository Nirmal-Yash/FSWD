// src/components/FormInput.js
import React from 'react';
import './FormInput.css';

const FormInput = ({ label, type, value, onChange, error }) => {
  return (
    <div className="form-input">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default FormInput;