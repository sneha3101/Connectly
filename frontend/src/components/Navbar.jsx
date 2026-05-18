import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../utils/auth';
import { disconnectSocket } from '../utils/socket';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnectSocket();
    clearAuth();
    navigate('/');
  };

  return (
    <nav className="glass-nav">
      <div className="nav-content">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark brand-mark-small" aria-hidden="true"></span>
          Connectly
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Discover
          </Link>
          <Link to="/chat" className="nav-link">
            Messages
          </Link>
          <Link to="/settings" className="nav-link">
            Settings
          </Link>
          <button onClick={handleLogout} className="ghost-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
