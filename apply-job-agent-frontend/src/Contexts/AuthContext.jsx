import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const AUTH_API_URL = import.meta.env.VITE_BACKEND_URL // Replace with your actual API URL
// Create the Auth Context
const AuthContext = createContext(null);

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    // You can check localStorage, cookies, or a token service here
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        email,
        password,
      });
      const user = response.data;
      console.log(user);
      // Store the user in state and localStorage
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, first_name,last_name) => {
    try {
      setLoading(true);
      setError(null);
      
      // For example:
      const response = await axios.post(`${AUTH_API_URL}/auth/signup`, {
        email,
        password,
        first_name,
        last_name,
      });
      const user = response.data;
      console.log(user);
      // For now, we'll simulate a successful registration
    //   const user = { id: '123', email, name };
      
      // Store the user in state and localStorage
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Auth context value
  const value = {
    currentUser,
    loading,
    error,
    signIn,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;