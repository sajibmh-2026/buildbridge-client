"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { IUser } from "@/types";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: Omit<IUser, "password"> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    photo?: string,
    skills?: string[]
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<IUser, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        authService.removeToken();
      }
    } catch {
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        authService.saveToken(response.data.token);
        setUser(response.data.user);
        router.push("/dashboard");
        return { success: true, message: "Login successful" };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      return { success: false, message };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photo?: string,
    skills?: string[]
  ) => {
    try {
      const response = await authService.register({ name, email, password, photo, skills });
      if (response.success && response.data) {
        authService.saveToken(response.data.token);
        setUser(response.data.user);
        router.push("/dashboard");
        return { success: true, message: "Registration successful" };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
