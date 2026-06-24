"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AnimalForm from "@/components/AnimalForm";
import { showError, showSuccess } from "@/lib/alerts";

export default function EditAnimalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/animals/edit/${id}`);

      if (!res.ok) {
        const data = await res.json();
        await showError("Error", data.error ?? "Failed to load animal");
        router.push("/animals");
        return;
      }

      const animal = await res.json();

      setName(animal.name);
      setWeight(animal.avarage_weight ?? "");
      setOldImage(animal.image ?? "");
      setPageLoading(false);
    }

    load();
  }, [id, router]);

  async function handleSubmit({
    name: animalName,
    image,
    averageWeight,
  }: {
    name: string;
    image: File | null;
    averageWeight: string;
  }) {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", animalName);
    formData.append("avarage_weight", averageWeight);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`/api/animals/edit/${id}`, {
      method: "PUT",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      await showError("Error", data.error ?? "Failed to update animal");
      return;
    }

    await showSuccess("Success", "You edited the animal.");
    router.push("/animals");
  }

  if (pageLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <AnimalForm
      title="Edit Animal"
      submitLabel="Update Animal"
      initialName={name}
      initialWeight={weight}
      initialImageUrl={oldImage}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}
