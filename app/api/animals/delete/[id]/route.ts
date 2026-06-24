import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { deleteAnimalImage } from "@/lib/storage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error: authError } = await requireAdmin();

  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const animalId = Number(id);

    if (Number.isNaN(animalId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { data: animal, error: findError } = await supabaseAdmin
      .from("animals")
      .select("*")
      .eq("id", animalId)
      .single();

    if (findError || !animal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    if (animal.image) {
      await deleteAnimalImage(animal.image);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("animals")
      .delete()
      .eq("id", animalId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Animal deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
