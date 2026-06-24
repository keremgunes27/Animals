"use client";

import Image from "next/image";
import { useState } from "react";

type AnimalFormProps = {
  title: string;
  submitLabel: string;
  initialName?: string;
  initialWeight?: string;
  initialImageUrl?: string;
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    image: File | null;
    averageWeight: string;
  }) => Promise<void>;
};

export default function AnimalForm({
  title,
  submitLabel,
  initialName = "",
  initialWeight = "",
  initialImageUrl = "",
  loading = false,
  onSubmit,
}: AnimalFormProps) {
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState<File | null>(null);
  const [averageWeight, setAverageWeight] = useState(initialWeight);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ name, image, averageWeight });
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Animal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image</label>

          {initialImageUrl && (
            <Image
              src={initialImageUrl}
              alt="animal"
              width={128}
              height={128}
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
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Average Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={averageWeight}
            onChange={(e) => setAverageWeight(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
