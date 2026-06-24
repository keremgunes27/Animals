"use client";

import AnimalTable from "@/components/AnimalTable";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

export default function Animals() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      setUser(data);
      setIsAdmin(data.role === "admin");
    }

    getUser();
  }, []);

  return (
    <>
      <Header user={user} />

      <main className="min-h-[calc(100vh-44px)] py-10 bg-slate-50 px-4">
        <AnimalTable isAdmin={isAdmin} />
      </main>
    </>
  );
}
