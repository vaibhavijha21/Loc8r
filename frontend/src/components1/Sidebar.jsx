// components/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  // Basic logout handler — prefer parent-provided handler, otherwise clear local state
  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      return;
    }

    // fallback: clear token and user and navigate to login
    try {
      apiService.clearToken();
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (e) {
      // ignore
    }
    navigate('/login');
  };

  const navItems = [
    { icon: 'bx-search-alt', label: 'Search', link: '#' },
    { icon: 'bx-home-alt-2', label: 'Home', link: '/dashboard' },
    { icon: 'bx-error', label: 'Reports', link: '#' },
    { icon: 'bx-cog', label: 'Settings', link: '#' },
    { icon: 'bx-user-circle', label: 'Profile', link: '/profile' }, // Profile after Settings
  ];

  return (
  <aside style={{ backgroundColor: '#20202A' }} className="flex flex-col justify-start items-center px-3 py-6 bg-gray-800 border-r border-slate-700 h-screen text-palette-main">
      <div className="flex flex-col items-center space-y-6 w-full">
        {navItems.map((item) => (
          <div key={item.label} className="group flex flex-col items-center">
            {item.link.startsWith('/') ? (
              <button
                onClick={() => navigate(item.link)}
                className="flex flex-col items-center focus:outline-none"
                type="button"
              >
                <i className={`bx ${item.icon} text-2xl text-gray-400 hover:text-gray-300 transition-colors`} />
                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </button>
            ) : (
              <a href={item.link} className="flex flex-col items-center">
                <i className={`bx ${item.icon} text-2xl text-gray-400 hover:text-gray-300 transition-colors`} />
                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </a>
            )}
          </div>
        ))}

        {/* Logout Button */}
        <div className="flex flex-col items-center group">
          <button onClick={handleLogout} className="flex flex-col items-center" type="button">
            <i className="bx bx-log-out text-2xl cursor-pointer text-gray-400 hover:text-gray-300 transition-colors" />
            <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );

};

export default Sidebar;