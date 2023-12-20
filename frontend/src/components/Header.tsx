import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';

import { Button } from '@components/shared/Button';

import './Header.scss';

// TODO if logged in, show logout button instead of login and register

export function Header() {
  const ref = useRef(null);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  function handleClickOutside() {
    if (isMenuOpen) setIsMenuOpen(false);
  }

  function handleMenuToggle() {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  }

  useOnClickOutside(ref, handleClickOutside);

  return (
    <header className="header" ref={ref}>
      <NavLink to="/" className="logo">
        Peaceful Pins
      </NavLink>
      <label
        className="nav-mobile-hamburger"
        title="Open menu"
        htmlFor="open-nav-main"
      >
        Menu
      </label>
      <nav className={!isMenuOpen ? 'hidden nav-main' : 'nav-main'}>
        <input
          id="open-nav-main"
          className="toggle-target"
          type="checkbox"
          onChange={handleMenuToggle}
        />
        <ul className="nav-main-list">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <Button>
              <Link to="/register">Join now</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
