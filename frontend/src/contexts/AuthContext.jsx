import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/authServices";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const login = async (email, password) => {

    console.log("AUTH CONTEXT LOGIN");

    const data = await loginUser(email, password);

    console.log("LOGIN DATA:", data);

    localStorage.setItem("token", data.token);
    setToken(data.token);

    // Fetch full user profile (userId, email, etc.) from /api/users/me
    let meData = null;
    try {
      const meRes = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      meData = meRes.data;
    } catch (e) {
      console.warn("Could not fetch /api/users/me:", e);
    }

    const loggedInUser = {
      username: data.username,
      role: data.role,
      userId: meData?.userId ?? data.userId ?? data.id ?? null,
      email: meData?.email ?? data.email ?? email,
      firstName: meData?.firstName ?? null,
      lastName: meData?.lastName ?? null,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return data;
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};