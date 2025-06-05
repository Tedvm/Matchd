// frontend/src/pages/Account/Account.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        navigate('/users');
      }
    } else {
      navigate('/users');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/users');
  };

  if (!user) return null; // ou un loader si nécessaire

  return (
    <div className="account-container">
      <h2>Bonjour {user.email || user.name || 'Utilisateur'}</h2>
      <button onClick={handleLogout} className="logout-button">
        Se déconnecter
      </button>
    </div>
  );
}
