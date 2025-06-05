import './Users.css';
import { Link } from 'react-router-dom'; 
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useFetchUsers } from './useFetchUsers';

function Users() {
  const { users, usersLoadingError, fetchUsers } = useFetchUsers();

  return (
    <div className="Users-container">
      <AddUserForm onSuccessfulUserCreation={fetchUsers} />

      <div className="users-login-link">
        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
      </div>

      {/* <UsersTable users={users} onSuccessfulUserDeletion={fetchUsers} />
      {usersLoadingError !== null && (
        <div className="users-loading-error">{usersLoadingError}</div>
      )} */}
    </div>
  );
}

export default Users;
