import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUserTie, FaHome, FaBriefcase, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/debo.png';

const Navigation = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-debo-blue shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logo}
                alt="DEBO Engineering"
                className="h-6 md:h-8 w-auto mr-2"
              />
              <span className="text-white font-bold text-lg md:text-xl ml-1">
                DEBO Engineering
              </span>
            </Link>
            {/* Desktop Nav */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'border-debo-light-blue text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`
                }
              >
                <FaHome className="mr-1" /> Home
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'border-debo-light-blue text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`
                }
              >
                <FaBriefcase className="mr-1" /> Jobs
              </NavLink>

              {auth.user?.role === 'applicant' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-debo-light-blue text-white'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    }`
                  }
                >
                  <FaUserTie className="mr-1" /> Dashboard
                </NavLink>
              )}

              {auth.user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-debo-light-blue text-white'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    }`
                  }
                >
                  <FaUserTie className="mr-1" /> Admin
                </NavLink>
              )}

              {auth.user?.role === 'super-admin' && (
                <NavLink
                  to="/superadmin"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-debo-light-blue text-white'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    }`
                  }
                >
                  <FaUserTie className="mr-1" /> Super Admin
                </NavLink>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {auth.user ? (
              <div className="flex items-center">
                <span className="text-white mr-4 text-sm">Welcome, {auth.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <NavLink
                  to="/login"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  <FaSignInAlt className="mr-1" /> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaUserPlus className="mr-1" /> Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-debo-blue px-2 pt-2 pb-3 space-y-1 rounded-b shadow-md animate-fade-in">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-debo-light-blue text-white'
                    : 'text-gray-300 hover:text-white hover:bg-debo-light-blue'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome className="inline mr-2" /> Home
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-debo-light-blue text-white'
                    : 'text-gray-300 hover:text-white hover:bg-debo-light-blue'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBriefcase className="inline mr-2" /> Jobs
            </NavLink>
            {auth.user?.role === 'applicant' && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-debo-light-blue text-white'
                      : 'text-gray-300 hover:text-white hover:bg-debo-light-blue'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserTie className="inline mr-2" /> Dashboard
              </NavLink>
            )}
            {auth.user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-debo-light-blue text-white'
                      : 'text-gray-300 hover:text-white hover:bg-debo-light-blue'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserTie className="inline mr-2" /> Admin
              </NavLink>
            )}
            {auth.user?.role === 'super-admin' && (
              <NavLink
                to="/superadmin"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-debo-light-blue text-white'
                      : 'text-gray-300 hover:text-white hover:bg-debo-light-blue'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserTie className="inline mr-2" /> Super Admin
              </NavLink>
            )}
            <div className="border-t border-gray-700 my-2" />
            {auth.user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-debo-light-blue hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="inline mr-2" /> Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-debo-blue bg-white hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUserPlus className="inline mr-2" /> Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
