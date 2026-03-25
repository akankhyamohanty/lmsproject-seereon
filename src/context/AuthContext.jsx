import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // --- CONNECTED TO BACKEND ---
  const login = async (email, password, instituteCode, roleType) => {
    try {
      // 1. Call the real backend service
      const response = await authService.login({ 
        email, 
        password, 
        instituteCode, 
        roleType 
      });

      // 2. ✅ FIXED: Look for 'response.data' which is where our backend puts the Institute details!
      // We add a fallback {} so it NEVER crashes on undefined.
      const loggedInUser = response.data || response.admin || response.user || {};
      
      // Ensure the role is present
      const normalizedUser = {
        ...loggedInUser,
        role: loggedInUser.role || roleType 
      };

      // 3. Save to LocalStorage and State
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      // Return it so the Login component can use it to redirect
      return normalizedUser;

    } catch (error) {
      // ✅ FIXED: Better error handling to show EXACTLY why it failed if it does
      console.error("AuthContext Error:", error);
      const message = error.response?.data?.message || error.message || "Login failed. Please check your connection.";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout(); // Clears HTTP-only cookies on backend
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};