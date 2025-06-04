import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../../public/logo.png';

const Header = () => {
  return (
    <div className="Header-container">
      <img src={logo} alt="Logo" className="Logo" />
      <Link className="Link" to="/">
        Home
      </Link>
      <div>|</div>
      <Link className="Link" to="/counter">
        Counter
      </Link>
      <div>|</div>
      <Link className="Link" to="/users">
        Users
      </Link>
      <div>|</div>
      <Link className="Link" to="/about">
        About
      </Link>
    </div>
  );
};

export default Header;
