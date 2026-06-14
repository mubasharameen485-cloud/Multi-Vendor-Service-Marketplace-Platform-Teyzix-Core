import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const updateUserData = (newData) => {
    
    const stored = localStorage.getItem('user');
    const currentUser = stored ? JSON.parse(stored) : {};
    
    
    const updatedUser = { ...currentUser, ...newData };
    
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};