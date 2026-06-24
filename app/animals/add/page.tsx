"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimalForm from "@/components/AnimalForm";
import { showError, showSuccess } from "@/lib/alerts";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit({
    name,
    image,
    averageWeight,
  }: {
    name: string;
    image: File | null;
    averageWeight: string;
  }) {
    setLoading(true);

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

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      await showError("Error", data.error ?? "Failed to add animal");
      return;
    }

    await showSuccess("Success", "You added a new animal.");
    router.push("/animals");
  }

  return (
    <AnimalForm
      title="Add Animal"
      submitLabel="Add Animal"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}
