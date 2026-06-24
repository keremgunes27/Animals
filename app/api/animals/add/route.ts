import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { uploadAnimalImage } from "@/lib/storage";

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin();

  if (authError) {
    return authError;
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;
    const averageWeight = formData.get("avarage_weight");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
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

    const { data: animal, error: dbError } = await supabaseAdmin
      .from("animals")
      .insert({
        name,
        image: imageUrl,
        avarage_weight: averageWeight ? Number(averageWeight) : null,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
