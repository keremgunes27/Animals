"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Animal = {
  id: number;
  name: string;
  image: string | null;
  created_at: string;
  avarage_weight: number | null;
};

type Props = {
  isAdmin: boolean;
};

export default function AnimalTable({ isAdmin }: Props) {
  const router = useRouter();

  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    async function getAnimals() {
      const res = await fetch("/api/animals");

      if (!res.ok) {
        setAnimals([]);
        return;
      }

      const data: Animal[] = await res.json();

      setAnimals(data);
    }

    getAnimals();
  }, []);

  const handleDeleteButton = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will delete the animal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    const res = await fetch(`/api/animals/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setAnimals((prev) => prev.filter((animal) => animal.id !== id));

      const result2 = await Swal.fire({
        title: "Success",
        text: "You deleted the animal.",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <>
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

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm text-slate-600">
                <tr>
                  <th className="px-6 py-4">Image</th>

                  <th className="px-6 py-4">Name</th>

                  <th className="px-6 py-4">Avarage Weight</th>

                  <th className="px-6 py-4">Created</th>

                  {isAdmin && <th className="px-6 py-4">Operations</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {animals.map((animal) => (
                  <tr key={animal.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-2">
                      <Image
                        src={animal.image ?? "/placeholder.png"}
                        alt={animal.name}
                        width={64}
                        height={64}
                        className="rounded-xl object-cover w-16 h-16"
                      />
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
                            href={"/animals/edit/" + animal.id}
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
        </div>
      </div>
    </>
  );
}
