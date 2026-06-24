import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;
    const averageWeight = formData.get("avarage_weight");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl: string | null = null;

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("animals")
        .upload(fileName, buffer, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 },
        );
      }

      const { data } = supabaseAdmin.storage
        .from("animals")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
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
