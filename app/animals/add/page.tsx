"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [averageWeight, setAverageWeight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      setUser(data);
    }

    getUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    if (averageWeight) {
      formData.append("avarage_weight", averageWeight);
    }

    const res = await fetch("/api/animals/add", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setName("");
      setImage(null);
      setAverageWeight("");

      const result = await Swal.fire({
        title: "Success",
        text: "You added a new animal.",
        icon: "success",
        confirmButtonText: "Ok",
      });

      router.push("/animals");
    }
  }

  return (
    <>
      <Header user={user} />

      <main className="min-h-[calc(100vh-44px)] py-10 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Animal</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Animal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Image URL</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                  }
                }}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Average Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={averageWeight}
                onChange={(e) => setAverageWeight(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Animal
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
