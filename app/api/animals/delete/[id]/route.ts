import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const animalId = id;

    const { data: animal, error: findError } = await supabaseAdmin
      .from("animals")
      .select("*")
      .eq("id", animalId)
      .single();

    // Delete image from storage
    if (animal.image) {
      const imageUrl = new URL(animal.image);

      const path = imageUrl.pathname.split("/object/public/animals/")[1];

      if (path) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("animals")
          .remove([path]);

        if (storageError) {
          console.error(storageError);
        }
      }
    }

    // Delete database row
    const { error: deleteError } = await supabaseAdmin
      .from("animals")
      .delete()
      .eq("id", animalId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Animal deleted",
    });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
