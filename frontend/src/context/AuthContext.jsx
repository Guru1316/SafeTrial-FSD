import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("st_user")); } catch { return null; }
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem("st_token", token);
    localStorage.setItem("st_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("st_token");
    localStorage.removeItem("st_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isAdmin: user?.role === "ADMIN",
      isTourist: user?.role === "TOURIST",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
