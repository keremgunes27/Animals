import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(req: NextRequest) {
  let response = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },

        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });

          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name, options) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });

          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  if (user && path === "/") {
    return NextResponse.redirect(new URL("/animals", req.url));
  }

  if (!user && path.startsWith("/animals")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // admin sayfaları
  const adminRoutes = ["/animals/add", "/animals/edit", "/animals/delete"];

  const needsAdmin = adminRoutes.some((route) => path.startsWith(route));

  if (needsAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/animals", req.url));
    }
  }

  return response;
}
