import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { deleteAnimalImage, uploadAnimalImage } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error: authError } = await requireAdmin();

  if (authError) {
    return authError;
  }

  const { id } = await params;
  const animalId = Number(id);

  if (Number.isNaN(animalId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("animals")
    .select("*")
    .eq("id", animalId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
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

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const weight = formData.get("avarage_weight");
    const image = formData.get("image") as File | null;

    const { data: oldAnimal, error: findError } = await supabaseAdmin
      .from("animals")
      .select("*")
      .eq("id", animalId)
      .single();

    if (findError || !oldAnimal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    let imageUrl = oldAnimal.image;

    if (image && image.size > 0) {
      if (oldAnimal.image) {
        await deleteAnimalImage(oldAnimal.image);
      }

      try {
        imageUrl = await uploadAnimalImage(image);
      } catch (uploadError) {
        return NextResponse.json(
          {
            error:
              uploadError instanceof Error
                ? uploadError.message
                : "Upload failed",
          },
          { status: 500 },
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("animals")
      .update({
        name,
        image: imageUrl,
        avarage_weight: weight ? Number(weight) : null,
      })
      .eq("id", animalId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
