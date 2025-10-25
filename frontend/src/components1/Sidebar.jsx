import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: 'bx-search-alt', label: 'Search', link: '#' },
    { icon: 'bx-home-alt-2', label: 'Home', link: '#' },
    { icon: 'bx-error', label: 'Reports', link: '#' },
    { icon: 'bx-cog', label: 'Settings', link: '#' },
    { icon: 'bx-user-circle', label: 'Profile', link: '/profile' }, // Profile after Settings
  ];

  return (
    <aside className="flex flex-col justify-start items-center px-3 py-6 bg-black border-r border-palette h-screen text-palette-main space-y-6">
      {navItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          {item.link.startsWith('/') ? (
            <button
              onClick={() => navigate(item.link)}
              className="flex flex-col items-center focus:outline-none"
            >
              <i className={`bx ${item.icon} text-2xl text-gray-400 hover:text-gray-300 transition-colors`}></i>
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </button>
          ) : (
            <a href={item.link} className="flex flex-col items-center">
              <i className={`bx ${item.icon} text-2xl text-gray-400 hover:text-gray-300 transition-colors`}></i>
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </a>
          )}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
