import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HeartPulse, Home, History, BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import { logout } from '../store/authSlice';
import { RootState } from '../store';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/history', label: 'Medical History', icon: History },
    { path: '/charts', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
      <nav className="bg-white shadow-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-semibold text-gray-800">MediScanner</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === path
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Desktop user info */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 shadow-sm">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;