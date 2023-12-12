import { NavLink } from 'react-router-dom';

// TODO if logged in, show logout button instead of login and register

const Header = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
