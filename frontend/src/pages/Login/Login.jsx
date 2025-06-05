// frontend/src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Au montage, si l’utilisateur est déjà dans localStorage,
  // on le redirige vers /account directement.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/account');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // On envoie la requête au serveur Express
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password }
      );

      // Si le login réussit, on stocke l’utilisateur dans localStorage
      // (par ex. response.data contient { id, email, token, ... })
      localStorage.setItem('user', JSON.stringify(response.data));

      // Puis on redirige vers la page /account
      navigate('/account');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Email ou mot de passe invalide');
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <div className="login-error">{error}</div>}
    </div>
  );
}
