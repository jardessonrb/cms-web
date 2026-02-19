"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { Notify } from "@/lib/notify";

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!token;

  // 🔹 Recupera sessão ao iniciar app
  useEffect(() => {
    const storedToken = localStorage.getItem("cms_token");
    const storedUser = localStorage.getItem("cms_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login({ token, user }: { token: string; user: User }) {
    localStorage.setItem("cms_token", token);
    localStorage.setItem("cms_user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    Notify.error("Usuário não está logado no sistema.");
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
