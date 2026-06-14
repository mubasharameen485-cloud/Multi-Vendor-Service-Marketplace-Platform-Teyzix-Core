import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for stability

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
    // 1. Pehle local storage se purana data uthayein
    const stored = localStorage.getItem('user');
    const currentUser = stored ? JSON.parse(stored) : {};
    
    // 2. Naye data ke sath merge karein
    const updatedUser = { ...currentUser, ...newData };
    
    // 3. Wapas save karein
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 4. State update karein (Logout nahi hoga kyunke reference same rahega)
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    // Yahan galti thi: updateUserData aur setUser ko value mein add kar diya hai
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};