"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";

type UserContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data: User = await res.json();
      setUser(data);
      setLoading(false);
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isAdmin: user?.role === "admin", loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
