// components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import { Home, Search, FileText, User, LogOut, X } from 'lucide-react';

const Sidebar = ({ onLogout, isOpen, onClose, openReportModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    { icon: Home, label: 'Home', link: '/dashboard', type: 'nav' },
    { icon: Search, label: 'Search', link: '#', type: 'nav' },
    { icon: FileText, label: 'Report', link: '#', type: 'report' },
    { icon: User, label: 'Profile', link: '/profile', type: 'nav' },
  ];

  const isActive = (link) => {
    if (link === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === link;
  };

  return (
    <>
      {/* Sidebar */}
      <aside
  className={`fixed inset-y-0 left-0 z-50 bg-slate-700 text-white flex flex-col w-64 transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>

        {/* Header */}
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">Loc8r</h1>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-1 hover:bg-blue-700/50 rounded"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-blue-200">Lost & found, redefined.</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.link);
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.type === 'report' && openReportModal) {
                    openReportModal();
                    onClose?.();
                  } else if (item.link.startsWith('/')) {
                    navigate(item.link);
                    // Close the overlay sidebar on navigation so the target page is visible
                    onClose?.();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
  active 
    ? 'text-white'
    : 'text-blue-200 hover:text-white'
}`}

                type="button"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-700/50">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 hover:bg-slate-700/50 hover:text-white transition-colors"
            type="button"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;