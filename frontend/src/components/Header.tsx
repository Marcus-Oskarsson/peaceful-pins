import { NavLink } from 'react-router-dom';

// TODO if logged in, show logout button instead of login and register

export function Header() {
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
}
