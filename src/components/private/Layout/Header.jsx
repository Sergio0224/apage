import React, { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";

import useSection from '../../../hooks/useSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHome, faTrophy } from '@fortawesome/free-solid-svg-icons';

// Componente para la barra de navegación móvil
const MobileNavBar = () => {
  const { activeSection, setActiveSection } = useSection();

  return (
    <div className="z-10 md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#242424] border-t dark:border-[#2d2d2d]">
      <div className="flex items-center justify-center p-2">
        <div className="flex items-center space-x-6 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg p-1">
          <button
            onClick={() => setActiveSection('inicio')}
            className={`p-2 rounded-lg transition-colors duration-150 flex items-center justify-center ${
              activeSection === 'inicio' 
                ? 'bg-white dark:bg-[#242424] shadow-sm text-blue-600 dark:text-blue-400' 
                : 'hover:bg-white dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSection('retos')}
            className={`p-2 rounded-lg transition-colors duration-150 flex items-center justify-center ${
              activeSection === 'retos' 
                ? 'bg-white dark:bg-[#242424] shadow-sm text-blue-600 dark:text-blue-400' 
                : 'hover:bg-white dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSection('aprendizaje')}
            className={`p-2 rounded-lg transition-colors duration-150 flex items-center justify-center ${
              activeSection === 'aprendizaje' 
                ? 'bg-white dark:bg-[#242424] shadow-sm text-blue-600 dark:text-blue-400' 
                : 'hover:bg-white dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const { auth, setAuth, setCounters } = useAuth();
  const menuRef = useRef();
  const imgRef = useRef();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setAuth({});
    setCounters({});
    navigate("/login");
  };

  window.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== imgRef.current) {
      setOpen(false);
    }
  });

  return (
    <>
      <header className="border-b">
        <div className="max-w-screen-2xl mx-auto px-4 py-2">
          <nav className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="w-48">
              <Link to="/" className="p-2">
                <span className="text-3xl flex items-center font-bold">
                  CG
                  <svg
                    className="w-6 h-6 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Right side - Notifications and Profile dropdown */}
            <div className="flex items-center space-x-4">
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `p-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </NavLink>

              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <img
                    ref={imgRef}
                    src={auth.image}
                    alt="user-image"
                    className="w-10 h-10 rounded-full"
                  />
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {open && (
                  <ul
                    ref={menuRef}
                    className="absolute p-6 z-50 mt-4 -left-14 flex flex-col gap-3 shadow-xl bg-white dark:bg-gray-800 border rounded-md"
                  >
                    <li className="hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-center transition duration-200">
                      <Link to={`profile/${auth._id}`}>Perfil</Link>
                    </li>
                    <li className="hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-center transition duration-200">
                      <Link to="/home/settings">Ajustes</Link>
                    </li>
                    <li className="hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-center transition duration-200">
                      <Link onClick={logout}>Cerrar Sesión</Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <MobileNavBar />

      {/* Add padding to main content to account for fixed mobile navbar */}
      <div className="md:pb-0 pb-16"></div>
    </>
  );
};

export default Header;