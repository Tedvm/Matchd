import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const ICONS = {
  match: '/assets/match.png',
  user: '/assets/utilisateur.png',
  home: '/assets/typo.png',
  search: '/assets/recherche.png',
};

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [searchLocked, setSearchLocked] = useState(false);
  const timeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const resetSearchBar = () => {
    setSearchLocked(false);
    setShowSearch(false);
  };

  const handleMouseEnterSearch = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(inactivityTimeoutRef.current);
    setShowSearch(true);
  };

  const handleMouseLeaveSearch = () => {
    if (!searchLocked) {
      timeoutRef.current = setTimeout(() => {
        setShowSearch(false);
      }, 2000); // 2 secondes
    }
    inactivityTimeoutRef.current = setTimeout(resetSearchBar, 2000); // 2 secondes d'inactivité
  };

  const handleSearchClick = () => {
    clearTimeout(inactivityTimeoutRef.current);
    if (showSearch) {
      setSearchLocked(false);
      setShowSearch(false);
    } else {
      setSearchLocked(true);
      setShowSearch(true);
    }
  };

  const handleSearchBlur = () => {
    timeoutRef.current = setTimeout(() => {
      setSearchLocked(false);
      setShowSearch(false);
    }, 2000); // 2 secondes après avoir quitté la barre de recherche
    inactivityTimeoutRef.current = setTimeout(resetSearchBar, 2000); // 2 secondes d'inactivité
  };

  const handleSearchSlotMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(inactivityTimeoutRef.current);
  };

  const handleSearchSlotMouseLeave = () => {
    if (!searchLocked) {
      timeoutRef.current = setTimeout(() => {
        setShowSearch(false);
      }, 2000); // 2 secondes
    }
    inactivityTimeoutRef.current = setTimeout(resetSearchBar, 2000); // 2 secondes d'inactivité
  };

  useEffect(() => {
    // Nettoyage des timeouts à la destruction du composant
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        {/* Bouton Match */}
        <div
          className="navbar-item"
          onMouseEnter={() => {
            clearTimeout(inactivityTimeoutRef.current);
            setHoveredButton('match');
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            inactivityTimeoutRef.current = setTimeout(resetSearchBar, 2000); // 2 secondes d'inactivité
          }}
        >
          <img
            src={ICONS.match}
            alt="Swipe / Match"
            onClick={() => navigate('/autre')}
            className="navbar-icon"
          />
          {hoveredButton === 'match' && (
            <span className="navbar-label">Swipe / Match</span>
          )}
        </div>

        {/* Bouton Utilisateur */}
        <div
          className="navbar-item"
          onMouseEnter={() => {
            clearTimeout(inactivityTimeoutRef.current);
            setHoveredButton('user');
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            inactivityTimeoutRef.current = setTimeout(resetSearchBar, 2000); // 2 secondes d'inactivité
          }}
        >
          <img
            src={ICONS.user}
            alt="Utilisateur"
            onClick={() => navigate('/user')}
            className="navbar-icon"
          />
          {hoveredButton === 'user' && (
            <span className="navbar-label">Utilisateur</span>
          )}
        </div>

        {/* Bouton Accueil */}
        <img
          src={ICONS.home}
          alt="Accueil"
          onClick={() => navigate('/')}
          className="navbar-icon"
        />

        {/* Bouton Recherche */}
        <div
          className="search-slot"
          onMouseEnter={handleMouseEnterSearch}
          onMouseLeave={handleMouseLeaveSearch}
          onClick={handleSearchClick}
        >
          <img src={ICONS.search} alt="Recherche" className="navbar-icon" />
        </div>
      </div>

      {showSearch && (
        <div
          className="search-container"
          onMouseEnter={handleSearchSlotMouseEnter}
          onMouseLeave={handleSearchSlotMouseLeave}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Recherche..."
            onBlur={handleSearchBlur}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
