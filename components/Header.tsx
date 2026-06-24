"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { confirmAction } from "@/lib/alerts";
import type { User } from "@/types/user";

type HeaderProps = {
  user: User | null;
};

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  async function logout() {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      confirmButtonText: "Yes, logout",
    });

    if (!confirmed) {
      return;
    }

    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        timer: 1000,
        showConfirmButton: false,
      });

      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="w-full py-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/animals">
            <h1 className="font-bold">Animals</h1>
          </Link>

          <div className="flex justify-center items-center gap-2">
            <span>{user?.name || user?.email}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                user?.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user?.role}
            </span>

            <button
              onClick={logout}
              className="px-2 py-1 bg-red-600 hover:bg-red-400 transition-all duration-200 text-white rounded-sm text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
