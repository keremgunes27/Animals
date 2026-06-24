"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Swal from "sweetalert2";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

export default function EditAnimalPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState("");

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

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/animals/edit/${id}`);

      const animal = await res.json();

      setName(animal.name);
      setWeight(animal.avarage_weight ?? "");

      setOldImage(animal.image ?? "");
    }

    load();
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);

    formData.append("avarage_weight", weight);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`/api/animals/edit/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const result = await Swal.fire({
        title: "Success",
        text: "You edited the animal.",
        icon: "success",
        confirmButtonText: "Ok",
      });

      router.push("/animals");
      router.refresh();
    }
  }

  return (
    <>
      <Header user={user} />

      <main className="min-h-[calc(100vh-44px)] py-10 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Animal</h2>

          <form onSubmit={submit} className="space-y-4">
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
              <label className="block mb-1 font-medium">Image</label>

              {oldImage && (
                <img
                  src={oldImage}
                  alt="animal"
                  className="w-32 h-32 object-cover rounded-md mb-3"
                />
              )}

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
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-md
          hover:bg-blue-700
          transition
        "
            >
              Update Animal
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
