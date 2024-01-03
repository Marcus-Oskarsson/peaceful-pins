import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';
import Hamburger from 'hamburger-react';

import './Header.scss';

// TODO if logged in, show appropriate nav links
// TODO menu should use display: none instead of hidden class

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
      <Hamburger
        toggled={isMenuOpen}
        toggle={handleMenuToggle}
        size={30}
        duration={0.25}
        direction="right"
      />
      <nav className={!isMenuOpen ? 'hidden nav-main' : 'nav-main'}>
        <ul className="nav-main-list">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/privacy">Privacy</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
