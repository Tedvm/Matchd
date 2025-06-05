import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // ou un autre css si tu veux

const FloatingElements = () => {
  const navigate = useNavigate();

  return (
    <>
      <img src="/logo.png" alt="Logo" className="logo-floating" />
      <button
        className="about-button-floating"
        onClick={() => navigate('/about')}
      >
        About
      </button>
    </>
  );
};

export default FloatingElements;
