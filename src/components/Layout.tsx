import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background bg-opacity-95 backdrop-blur-sm border-b border-white border-opacity-10 px-4 py-3">
        <div className="flex justify-between items-center">
          <NavLink to="/discover" className="text-2xl font-header font-bold text-accent">
            CineMatch
          </NavLink>
          
          {user && (
            <div className="flex items-center space-x-2">
              <NavLink to="/profile">
                <img 
                  src={user.profilePicture || 'https://i.pravatar.cc/150?img=1'} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full border-2 border-accent"
                />
              </NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 z-50 bg-background bg-opacity-95 backdrop-blur-sm border-t border-white border-opacity-10 px-4 py-2">
        <div className="flex justify-around items-center">
          <NavLink 
            to="/discover" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-accent' : 'text-text opacity-70'}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs mt-1">Ontdekken</span>
          </NavLink>
          
          <NavLink 
            to="/watchlist" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-accent' : 'text-text opacity-70'}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs mt-1">Watchlist</span>
          </NavLink>
          
          <NavLink 
            to="/friends" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-accent' : 'text-text opacity-70'}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs mt-1">Vrienden</span>
          </NavLink>
          
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-text opacity-70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs mt-1">Uitloggen</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;