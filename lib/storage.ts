import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = "animals";

export function getStoragePathFromPublicUrl(url: string): string | null {
  const path = new URL(url).pathname.split("/object/public/animals/")[1];
  return path ?? null;
}

export async function uploadAnimalImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteAnimalImage(imageUrl: string) {
  const path = getStoragePathFromPublicUrl(imageUrl);

  if (!path) {
    return;
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(error);
  }
}
