import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/animals")) {
    const sessionResponse = await updateSession(req);
    const isUnauthorized = sessionResponse.headers.get("x-middleware-unauthorized");

    if (isUnauthorized === "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isForbidden = sessionResponse.headers.get("x-middleware-forbidden");

    if (isForbidden === "true") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return sessionResponse;
  }

  return updateSession(req);
}

export const config = {
  matcher: ["/", "/animals/:path*", "/api/animals/:path*"],
};
