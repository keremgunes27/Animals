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
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: req,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const method = req.method;

  if (user && path === "/") {
    return NextResponse.redirect(new URL("/animals", req.url));
  }

  if (!user && path.startsWith("/animals")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/api/animals")) {
    if (!user) {
      response.headers.set("x-middleware-unauthorized", "true");
      return response;
    }

    const adminOnly =
      path.includes("/add") ||
      path.includes("/edit") ||
      path.includes("/delete") ||
      (method !== "GET" && path === "/api/animals");

    if (adminOnly) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        response.headers.set("x-middleware-forbidden", "true");
        return response;
      }
    }
  }

  const adminRoutes = ["/animals/add", "/animals/edit"];

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
