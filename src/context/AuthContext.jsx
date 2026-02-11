import { createContext, useState, useEffect } from 'react';

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

  // --- UPDATED LOGIN FUNCTION ---
  const login = async (email, password, instituteCode, roleType) => {
    // 1. Simulate Network Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 2. --- VALIDATION LOGIC ---
    // Institute Code is required for everyone except Super Admin
    if (roleType !== 'super_admin') {
      if (!instituteCode) throw new Error("Institute Code is required.");
      if (instituteCode === 'SUSPENDED') throw new Error("Your institute's subscription is suspended.");
      if (instituteCode === 'INACTIVE') throw new Error("This institute account is currently inactive.");
    }

    // 3. --- CREDENTIAL CHECK ---
    if (password !== 'password123') {
      throw new Error("Invalid credentials. Please check your email and password.");
    }

    // 4. --- ASSIGN USER & ROLE ---
    let loggedInUser;

    if (roleType === 'super_admin') {
      // Strict Super Admin Check
      if (email === 'superadmin@test.com') {
        loggedInUser = { 
          id: 1, 
          name: 'Super Admin', 
          email: email, 
          role: 'super_admin' 
        };
      } else {
        throw new Error("Access Denied: You do not have Super Admin privileges.");
      }
    } 
    
    // --- KEY FIX STARTS HERE ---
    else if (roleType === 'institute_admin') {
      loggedInUser = { 
        id: 2, 
        name: 'Institute Admin', 
        email: email, 
        role: 'institute_admin', // Explicitly set role
        instituteCode: instituteCode 
      };
    } 
    
    else if (roleType === 'faculty') {
      loggedInUser = { 
        id: 3, 
        name: 'Faculty Member', 
        email: email, 
        role: 'faculty', // Explicitly set role
        instituteCode: instituteCode 
      };
    } 
    
    else if (roleType === 'student') {
      loggedInUser = { 
        id: 4, 
        name: 'Subham', // Matching your Dashboard UI
        email: email, 
        role: 'student', // Explicitly set role
        rollNumber: '2101201', // Adding mock data for dashboard
        instituteCode: instituteCode 
      };
    }
    // --- KEY FIX ENDS HERE ---

    // 5. Save and Set State
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};