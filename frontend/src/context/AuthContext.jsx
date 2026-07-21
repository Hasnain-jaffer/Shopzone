/**
 * AuthContext — single source of truth for the logged-in user.
 *
 * SECURITY: the JWT is never read or stored by this file. The backend
 * sets it as an httpOnly cookie on login/register (see
 * backend/src/utils/cookies.js), which JavaScript — including an XSS
 * payload — cannot read. Every request here uses `withCredentials: true`
 * so the browser attaches that cookie automatically; we only ever keep
 * the non-sensitive `user` object (name/email/role) in memory.
 *
 * On mount we call GET /auth/me to ask the backend "who am I, based on
 * the cookie you can see" — this restores the session after a page
 * reload without ever needing a token in JS.
 */

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../service/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    await api.post("/auth/register", formData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
