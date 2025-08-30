import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Visualizador';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const ADMIN_USERS = [
  { id: 'admin1', name: 'Administrador', email: 'admin@ppgee.ufam.edu.br', password: 'admin123', role: 'Administrador' as const },
  { id: 'admin2', name: 'Coordenador', email: 'coordenador@ppgee.ufam.edu.br', password: 'coord123', role: 'Administrador' as const }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('ppgee_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('ppgee_user');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const adminUser = ADMIN_USERS.find(
      user => user.email === email && user.password === password
    );

    if (adminUser) {
      const { password: _, ...userWithoutPassword } = adminUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ppgee_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ppgee_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};