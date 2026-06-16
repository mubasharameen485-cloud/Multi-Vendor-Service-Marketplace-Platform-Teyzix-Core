import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { Sun, Moon } from 'lucide-react'; // Icons ke liye

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Dark mode logic
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-green-700 dark:text-green-400 tracking-wide"
        >
          Teyzix Marketplace
        </Link>

        <div className="flex items-center gap-4">
          {/* DARK MODE TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium hidden sm:block">
                Hello, {user.name}
              </span>

              <Link
                to={
                  user.role === 'CUSTOMER'
                    ? '/customer-dashboard'
                    : user.role === 'SERVICE_PROVIDER'
                    ? '/provider-dashboard'
                    : '/admin-dashboard'
                }
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 text-sm font-semibold transition"
              >
                Dashboard
              </Link>

              {user.role === 'CUSTOMER' && (
                <Link
                  to="/browse-services"
                  className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition"
                >
                  Browse
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;