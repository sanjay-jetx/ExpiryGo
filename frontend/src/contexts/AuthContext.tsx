"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "customer" | "shop_owner" | null;

interface AuthContextType {
  role: Role;
  login: (selectedRole: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from cookies on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(match[2] as Role);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    document.cookie = `role=${selectedRole}; path=/; max-age=86400`; // 1 day
  };

  const logout = () => {
    setRole(null);
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
