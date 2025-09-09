import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock users for fallback when API is not available
const mockUsers = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', username: 'user', password: 'user123', role: 'normal' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('wb-finance-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Try API first (when backend is available)
      const API_BASE_URL = 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('wb-finance-user', JSON.stringify(data.user));
          setUser(data.user);
          return true;
        }
      }
    } catch (error) {
      console.log('API not available, using local authentication');
    }
    
    // Fallback to local authentication
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userObj = { id: foundUser.id, username: foundUser.username, role: foundUser.role };
      setUser(userObj);
      localStorage.setItem('wb-finance-user', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wb-finance-user');
    localStorage.removeItem('auth-token');
  };

  const register = async (username, password) => {
    try {
      // Try API first (when backend is available)
      const API_BASE_URL = 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('wb-finance-user', JSON.stringify(data.user));
        return true;
      }
    } catch (error) {
      console.log('API not available, using local registration');
    }
    
    // Fallback to local registration
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) return false;
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role: 'normal'
    };
    
    mockUsers.push(newUser);
    const userObj = { id: newUser.id, username: newUser.username, role: newUser.role };
    setUser(userObj);
    localStorage.setItem('wb-finance-user', JSON.stringify(userObj));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};