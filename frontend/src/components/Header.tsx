import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useOnClickOutside, useLockedBody, useWindowSize } from 'usehooks-ts';
import Hamburger from 'hamburger-react';

import { useAuthCheck } from '@services/authenticationService';
import logo from '../assets/logo.jpeg';
import './Header.scss';

// TODO if logged in, show appropriate nav links
// TODO menu should use display: none instead of hidden class

interface MobileNavProps {
  isOpen: boolean;
  children: React.ReactNode;
}

interface NormalNavProps {
  children: React.ReactNode;
}

function MobileNav({ isOpen, children }: MobileNavProps) {
  useLockedBody(isOpen);
  return (
    <nav className={!isOpen ? 'hidden nav-main' : 'nav-main'}>
      <ul className="nav-main-list">{children}</ul>
    </nav>
  );
}

function NormalNav({ children }: NormalNavProps) {
  return (
    <nav className="desktop-nav-main">
      <ul className="desktop-nav-main-list">{children}</ul>
    </nav>
  );
}

export function Header() {
  const ref = useRef(null);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const size = useWindowSize();
  const { data, isSuccess } = useAuthCheck();

  const privateRoutes = [
    { path: '/map', name: 'Map' },
    { path: '/write', name: 'New message' },
    { path: '/about', name: 'About' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/logout', name: 'Logout' },
  ];

  const publicRoutes = [
    { path: '/', name: 'Home' },
    { path: '/login', name: 'Login' },
    { path: '/about', name: 'About' },
    { path: '/privacy', name: 'Privacy' },
  ];

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

  const links = isSuccess && data.success ? privateRoutes : publicRoutes; // TODO if logged in, use privateRoutes

  return (
    <header className="header" ref={ref}>
      <NavLink
        to="/"
        className="logo"
        style={{
          background: `url(${logo}) no-repeat center center`,
          backgroundSize: 'contain',
          width: '30px',
          height: '30px',
        }}
      ></NavLink>

      <div className="icon-links">
        <div>
          <NavLink to="/write">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
            >
              <path
                fill="none"
                stroke="#E5D4ED"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".8"
                d="M1.75 11.25v3h3l9.5-9.5l-3-3zm7-6.5l2.5 2.5"
              />
            </svg>
          </NavLink>
        </div>

        <div>
          <NavLink to="/map">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
            >
              <path
                fill="none"
                stroke="#E5D4ED"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".8"
                d="M10.25 5.25v8.5m-4.5-10.5v8.5m-4 2.5v-9.5l4-2l4.5 2l4-2v9.5l-4 2l-4.5-2z"
              />
            </svg>
          </NavLink>
        </div>

        <div>
          <NavLink to="/messages" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
            >
              <g
                fill="none"
                stroke="#E5D4ED"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".8"
              >
                <path d="M1.75 3.75h12.5v9.5H1.75z" />
                <path d="m2.25 4.25l5.75 5l5.75-5" />
              </g>
            </svg>
          </NavLink>
        </div>

        <div>
          <NavLink to="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
            >
              <g
                fill="none"
                stroke="#E5D4ED"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".8"
              >
                <circle cx="8" cy="6" r="3.25" />
                <path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5" />
              </g>
            </svg>
          </NavLink>
        </div>
      </div>

      {size.width <= 768 ? (
        <>
          <Hamburger
            toggled={isMenuOpen}
            toggle={handleMenuToggle}
            size={24}
            duration={0.25}
            direction="right"
            color="#E5D4ED"
          />
          <MobileNav isOpen={isMenuOpen}>
            {links.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path}>{link.name}</NavLink>
              </li>
            ))}
          </MobileNav>
        </>
      ) : (
        <NormalNav>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path}>{link.name}</NavLink>
            </li>
          ))}
        </NormalNav>
      )}
    </header>
  );
}
