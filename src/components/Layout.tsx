import React, { useState } from 'react';
import { Menu, Users, FileText, Settings, Shield, LogOut, Moon, Sun, X, Home, BookOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const navItems = [
    ...((['admin', 'staff'] as const).includes(user.role) 
      ? [
          { icon: Users, label: 'Clients', path: '/clients' },
          { icon: Home, label: 'Group Homes', path: '/group-homes' },
          { icon: BookOpen, label: 'Group Notes', path: '/group-notes' }
        ] 
      : []
    ),
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    ...(user.role === 'admin' 
      ? [{ icon: Shield, label: 'Admin', path: '/admin' }] 
      : []
    ),
  ];

  const handleSignOut = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-border z-50
        transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <h1 className="text-xl font-semibold text-text">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text hover:text-text/80"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-accent/10 text-accent shadow-sm'
                    : 'text-text-secondary hover:bg-surface hover:text-text'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-accent' : 'text-text-secondary'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-text hover:text-text/80 transition-colors duration-150 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text hover:text-text/80 bg-background hover:bg-background/90 transition duration-150"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <div className="text-sm text-text-secondary">
              Role: <span className="font-medium text-text">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="btn btn-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="lg:pl-64 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main>
            <div className="bg-surface rounded-lg shadow-sm border border-border p-6 min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;