import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("animals")
    .select("*")
    .eq("id", Number(id))
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
  try {
    const { id } = await params;

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const weight = formData.get("avarage_weight");
    const image = formData.get("image") as File | null;

    const { data: oldAnimal } = await supabaseAdmin
      .from("animals")
      .select("*")
      .eq("id", Number(id))
      .single();

    let imageUrl = oldAnimal.image;

    // new image uploaded
    if (image && image.size > 0) {
      // delete old image
      if (oldAnimal.image) {
        const oldPath = new URL(oldAnimal.image).pathname.split(
          "/object/public/animals/",
        )[1];

        if (oldPath) {
          await supabaseAdmin.storage.from("animals").remove([oldPath]);
        }
      }

      const ext = image.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${ext}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      const { error } = await supabaseAdmin.storage
        .from("animals")
        .upload(fileName, buffer, {
          contentType: image.type,
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data } = supabaseAdmin.storage
        .from("animals")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("animals")
      .update({
        name,
        image: imageUrl,
        avarage_weight: weight ? Number(weight) : null,
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
