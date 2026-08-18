import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/apis';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sgip_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session validation error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (emailOrCredentials, maybePassword) => {
    let payload = emailOrCredentials;
    if (typeof emailOrCredentials === 'string') {
      payload = { email: emailOrCredentials, password: maybePassword };
    }
    const res = await authApi.login(payload);
    if (res.data.success) {
      localStorage.setItem('sgip_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data.success) {
      localStorage.setItem('sgip_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('sgip_token');
    setToken(null);
    setUser(null);
  };

  const role = (user?.role || '').toLowerCase();
  const isStudent = role === 'student';
  const isFaculty = role === 'faculty';
  const isPlacementCoordinator = role === 'placement_coordinator' || role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isStudent,
        isFaculty,
        isPlacementCoordinator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
