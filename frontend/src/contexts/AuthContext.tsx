"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/client";

export type Role = "customer" | "shop_owner" | null;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  is_shop_owner: boolean;
  shop_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: Role;
  shopId: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  shopId: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch the shop owned by this user (if any)
  const loadShopId = useCallback(async () => {
    try {
      const shop = await apiRequest<{ id: string }>("/shops/me");
      setShopId(shop.id);
    } catch {
      setShopId(null);
    }
  }, []);

  // Load user from backend using token
  const loadUser = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }
      
      const dbUser = await apiRequest<AuthUser>("/users/me");
      setUser(dbUser);
      setRole(dbUser.is_shop_owner ? "shop_owner" : "customer");
      if (dbUser.is_shop_owner) await loadShopId();
    } catch (error) {
      console.error("Failed to authenticate session:", error);
      if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setRole(null);
      setShopId(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadShopId]);

  // Initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (emailStr: string, passStr: string) => {
    const res = await apiRequest<any>("/auth/login", {
      method: "POST",
      json: { email: emailStr, password: passStr },
    });

    localStorage.setItem(TOKEN_KEY, res.access_token);
    setUser(res.user);
    const userRole: Role = res.user.is_shop_owner ? "shop_owner" : "customer";
    setRole(userRole);
    if (res.user.is_shop_owner) {
      await loadShopId();
      router.push("/shop");
    } else {
      router.push("/");
    }
  };

  const signup = async (emailStr: string, passStr: string, userName: string, userRole: Role) => {
    const res = await apiRequest<any>("/auth/register", {
      method: "POST",
      json: {
        email: emailStr,
        password: passStr,
        name: userName,
        is_shop_owner: userRole === "shop_owner",
      },
    });

    localStorage.setItem(TOKEN_KEY, res.access_token);
    setUser(res.user);
    setRole(res.user.is_shop_owner ? "shop_owner" : "customer");
    // Signup redirects are handled by the auth page itself
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setRole(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, role, shopId, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);