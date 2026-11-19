import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  name: 'Alex Johnson',
  email: 'alex.netflix@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('netflix_clone_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('netflix_clone_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('netflix_clone_user');
      }
    } catch (e) {
      console.error('Failed to sync auth state', e);
    }
  }, [user]);

  const signIn = (email, password) => {
    const newUser = {
      name: email.split('@')[0] || 'User',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
    };
    setUser(newUser);
    return true;
  };

  const signUp = (name, email, password) => {
    const newUser = {
      name: name || email.split('@')[0] || 'User',
      email,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    };
    setUser(newUser);
    return true;
  };

  const quickDemoLogin = () => {
    setUser(DEFAULT_USER);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        quickDemoLogin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
