// src/pages/Users/Users.js
import './Users.css';
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useFetchUsers } from './useFetchUsers';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Users() {
  const { users, usersLoadingError, fetchUsers } = useFetchUsers();
  const navigate = useNavigate();

  // Au montage du composant, on vérifie si un user est déjà présent dans le localStorage
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      // Si la clé 'user' existe et n'est pas null, on redirige vers /account
      navigate('/account');
    }
    // Note : on inclut `navigate` dans le tableau de dépendances pour que l’ESLint ne râle pas.
  }, [navigate]);

  return (
    <div className="Users-container">
      {/* 
        On a ajouté ce spacer pour séparer visuellement : 
        vous pouvez l’ajuster ou le supprimer suivant votre besoin.
      */}
      <div style={{ margin: '100px' }}></div>

      {/* Formulaire d’ajout d’utilisateur */}
      <AddUserForm onSuccessfulUserCreation={fetchUsers} />

      {/* 
        Si vous souhaitez afficher la table des utilisateurs (une fois
        décommentée), elle sera rechargée après chaque création/suppression.
      */}
      {/*
      <UsersTable
        users={users}
        onSuccessfulUserDeletion={fetchUsers}
      />
      {usersLoadingError !== null && (
        <div className="users-loading-error">{usersLoadingError}</div>
      )}
      */}

      {/* Lien vers la page de login, au cas où on voudrait se connecter */}
      <a href="/login" className="login-link">
        Déjà inscrit ? Se connecter
      </a>
    </div>
  );
}

export default Users;
