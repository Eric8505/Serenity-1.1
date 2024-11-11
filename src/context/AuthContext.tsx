import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthUser, UserRole } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const DEMO_USERS: Record<string, { role: UserRole; name: string; password: string }> = {
  'admin@example.com': { role: 'admin', name: 'Admin User', password: 'admin123' },
  'staff@example.com': { role: 'staff', name: 'Staff User', password: 'staff123' },
  'client@example.com': { role: 'client', name: 'Client User', password: 'client123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ user: AuthUser | null; isAuthenticated: boolean }>(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return { user, isAuthenticated: true };
    }
    return { user: null, isAuthenticated: false };
  });

  const login = useCallback(async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email];
    
    if (demoUser && demoUser.password === password) {
      const user: AuthUser = {
        id: crypto.randomUUID(),
        email,
        name: demoUser.name,
        role: demoUser.role,
      };

      localStorage.setItem('authUser', JSON.stringify(user));
      setAuthState({ user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authUser');
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;