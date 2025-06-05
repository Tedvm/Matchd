// src/Account.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account() {
  const [firstname, setFirstname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Lire la chaîne JSON brute dans localStorage
    const raw = localStorage.getItem('user');

    if (raw) {
      try {
        // 2. Parser la chaîne en objet JS
        const userObj = JSON.parse(raw);

        // 3. Vérifier que userObj.firstname existe avant de l'utiliser
        if (userObj.firstname) {
          setFirstname(userObj.firstname);
        } else {
          // Si pas de firstname, on redirige vers /login
          navigate('/login');
        }
      } catch (error) {
        console.error('Impossible de parser localStorage.user :', error);
        // En cas d’erreur, on supprime la clé et on redirige vers /login
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      // Si pas de clé "user" du tout, on redirige vers /login
      navigate('/login');
    }
  }, [navigate]);

  // Fonction pour déclencher la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="account-container">
      <h1>Bonjour {firstname} !</h1>
      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default Account;