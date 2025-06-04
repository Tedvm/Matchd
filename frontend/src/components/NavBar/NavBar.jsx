import React from 'react';
import './Navbar.css';

function Navbar({ onSearch }) {
  return (
    <div className="navbar">
      <input
        type="text"
        placeholder="Rechercher..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

export default Navbar;
