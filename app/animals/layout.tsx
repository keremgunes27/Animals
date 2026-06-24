"use client";

import Header from "@/components/Header";
import { UserProvider, useUser } from "@/contexts/UserContext";

function AnimalsShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-44px)] py-10 bg-slate-50 px-4">
        {children}
      </main>
    </>
  );
}

export default function AnimalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AnimalsShell>{children}</AnimalsShell>
    </UserProvider>
  );
}
