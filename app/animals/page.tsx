"use client";

import AnimalTable from "@/components/AnimalTable";
import { useUser } from "@/contexts/UserContext";

export default function Animals() {
  const { isAdmin } = useUser();

  return <AnimalTable isAdmin={isAdmin} />;
}
