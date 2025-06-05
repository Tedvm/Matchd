import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoAndAbout = () => {
  const navigate = useNavigate();

  return (
    <>
      <img src="/logo.png" alt="Logo" className="logo-image" />
      <button className="about-button" onClick={() => navigate('/about')}>
        About
      </button>
    </>
  );
};

export default LogoAndAbout;
