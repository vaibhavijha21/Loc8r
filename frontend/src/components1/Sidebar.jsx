import React from 'react';

const Sidebar = ({ onLogout }) => (
  <aside className="flex flex-col px-3 py-6 gap-8 bg-black border-r border-palette">
    <div className="flex flex-col mt-6 gap-6">
      <div className="flex flex-col gap-6 text-palette-main">
        {/* Navigation Items */}
        {[
    { icon: 'bx-search-alt', label: 'Search', link: '#' },
    { icon: 'bx-home-alt-2', label: 'Home', link: '#' },
    { icon: 'bx-error', label: 'Reports', link: '#' },
    { icon: 'bx-cog', label: 'Settings', link: '#' },
          { icon: 'bx-user-circle', label: 'Profile', link: 'Userprofile.html' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center group">
            <a href={item.link}>
                
              <i className={`bx ${item.icon} text-2xl cursor-pointer text-gray-400 hover:text-gray-300 transition-colors`}></i>
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
            </a>
          </div>
        ))}
        
        {/* Logout Button */}
        <div className="flex flex-col items-center group">
          <button onClick={onLogout} className="flex flex-col items-center">
            <i className="bx bx-log-out text-2xl cursor-pointer text-red-400 hover:text-red-300 transition-colors"></i>
            <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Logout</span>
          </button>
        </div>
      </div>
    </div>
    </aside>
  );

export default Sidebar;