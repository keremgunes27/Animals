"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import type { Animal } from "@/types/animal";

type Props = {
  isAdmin: boolean;
};

export default function AnimalTable({ isAdmin }: Props) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAnimals() {
      const res = await fetch("/api/animals");

      if (!res.ok) {
        setAnimals([]);
        setLoading(false);
        return;
      }

      const data: Animal[] = await res.json();
      setAnimals(data);
      setLoading(false);
    }

    getAnimals();
  }, []);

  const handleDeleteButton = async (id: number) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      text: "You will delete the animal.",
      confirmButtonText: "Yes, delete",
    });

    if (!confirmed) {
      return;
    }

    const res = await fetch(`/api/animals/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      await showError("Error", data.error ?? "Failed to delete animal");
      return;
    }

    setAnimals((prev) => prev.filter((animal) => animal.id !== id));
    await showSuccess("Success", "You deleted the animal.");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Animals</h2>
              <p className="text-sm text-slate-500">
                List of registered animals
              </p>
            </div>

            {isAdmin && (
              <Link
                href="/animals/add"
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer"
              >
                Add New Animal
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : animals.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No animals registered yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm text-slate-600">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Average Weight</th>
                  <th className="px-6 py-4">Created</th>
                  {isAdmin && <th className="px-6 py-4">Operations</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {animals.map((animal) => (
                  <tr key={animal.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-2">
                      {animal.image ? (
                        <Image
                          src={animal.image}
                          alt={animal.name}
                          width={64}
                          height={64}
                          className="rounded-xl object-cover w-16 h-16"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {animal.name}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {animal.avarage_weight ?? "-"} kg
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(animal.created_at).toLocaleDateString("en-GB")}
                    </td>

                    {isAdmin && (
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/animals/edit/${animal.id}`}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDeleteButton(animal.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
