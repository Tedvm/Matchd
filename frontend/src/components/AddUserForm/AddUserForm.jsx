import { useState } from 'react';
import axios from 'axios';
import './AddUserForm.css';

const DEFAULT_FORM_VALUES = {
  email: '',
  firstname: '',
  lastname: '',
  password: '',
};

function AddUserForm({ onSuccessfulUserCreation }) {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);

  const [userCreationError, setUserCreationError] = useState(null);
  const [userCreationSuccess, setUserCreationSuccess] = useState(null);

  const displayCreationSuccessMessage = () => {
    setUserCreationSuccess('New user created successfully');
    setTimeout(() => {
      setUserCreationSuccess(null);
    }, 3000);
  };

  const saveUser = (event) => {
    // This avoid default page reload behavior on form submit
    event.preventDefault();

    setUserCreationError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/new`, formValues)
      .then(() => {
        displayCreationSuccessMessage();
        setFormValues(DEFAULT_FORM_VALUES);
        onSuccessfulUserCreation();
      })
      .catch((error) => {
        setUserCreationError('An error occured while creating new user.');
        console.error(error);
      });
  };

  return (
    <div>
      <form className="add-user-form" onSubmit={saveUser}>
        <h2 className="add-user-title">Créer un compte</h2>
        <input
          className="add-user-input"
          required
          type="email"
          placeholder="Email"
          value={formValues.email}
          onChange={(event) =>
            setFormValues({ ...formValues, email: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Prénom"
          value={formValues.firstname}
          onChange={(event) =>
            setFormValues({ ...formValues, firstname: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Nom"
          value={formValues.lastname}
          onChange={(event) =>
            setFormValues({ ...formValues, lastname: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Mot de passe"
          type="password"
          value={formValues.password}
          onChange={(event) =>
            setFormValues({ ...formValues, password: event.target.value })
          }
        />
        <button className="add-user-button" type="submit">
          Créer
        </button>
      </form>
      {userCreationSuccess !== null && (
        <div className="user-creation-success">{userCreationSuccess}</div>
      )}
      {userCreationError !== null && (
        <div className="user-creation-error">{userCreationError}</div>
      )}
    </div>
  );
}

export default AddUserForm;
