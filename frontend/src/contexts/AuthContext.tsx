"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { auth } from "@/config/firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";

import { apiRequest } from "@/api/client";

// =========================
// TYPES
// =========================

export type Role = "customer" | "shop_owner" | null;

interface AuthContextType {
  user: FirebaseUser | null;
  role: Role;
  name: string | null;
  email: string | null;
  shopId: number | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (
    email: string,
    pass: string,
    name: string,
    role: Role
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

// =========================
// CONTEXT
// =========================

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  name: null,
  email: null,
  shopId: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: true,
  refreshUser: async () => {},
});

// =========================
// PROVIDER
// =========================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [shopId, setShopId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch backend user data
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) {
      setRole(null);
      setName(null);
      setEmail(null);
      setShopId(null);
      return;
    }

    try {
      const dbUser = await apiRequest<any>("/users/me");
      if (dbUser) {
        setRole(dbUser.is_shop_owner ? "shop_owner" : "customer");
        setName(dbUser.name);
        setEmail(dbUser.email);
        if (dbUser.shop) {
          setShopId(dbUser.shop.id);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user from backend:", error);
      // Don't clear role here if it was a temporary network error
    }
  }, []);

  // =========================
  // AUTH STATE LISTENER
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const token = await firebaseUser.getIdToken();
          document.cookie = `mock_token=${token}; path=/; max-age=3600`;
          await refreshUser();
        } else {
          setUser(null);
          setRole(null);
          setName(null);
          setEmail(null);
          setShopId(null);
          document.cookie = "mock_token=; path=/; max-age=0";
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [refreshUser]);

  // =========================
  // LOGIN
  // =========================

  const login = async (emailStr: string, passStr: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailStr, passStr);
      // onAuthStateChanged will handle state update and set isLoading(false)
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // =========================
  // SIGNUP
  // =========================

  const signup = async (
    emailStr: string,
    passStr: string,
    userName: string,
    userRole: Role
  ) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailStr,
        passStr
      );
      const firebaseUser = userCredential.user;

      const token = await firebaseUser.getIdToken();
      document.cookie = `mock_token=${token}; path=/; max-age=3600`;

      // create DB user
      await apiRequest("/users/", {
        method: "POST",
        json: {
          email: emailStr,
          name: userName,
          is_shop_owner: userRole === "shop_owner",
        },
      });

      // Now that backend user is created, refresh state
      await refreshUser();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        name,
        email,
        shopId,
        login,
        signup,
        logout,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export const useAuth = () => useContext(AuthContext);