import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchProvider } from './context/SearchContext';
import FloatingElements from './FloatingElements'; // juste au-dessus de App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SearchProvider>
      <BrowserRouter>
        <div className="navbar-background" />
        <FloatingElements /> {/* 👈 logo + bouton About */}
        <App />
      </BrowserRouter>
    </SearchProvider>
  </React.StrictMode>
);
