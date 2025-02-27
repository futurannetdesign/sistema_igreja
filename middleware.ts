import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redireciona para login se não estiver autenticado
  if (!session && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session && req.nextUrl.pathname.startsWith("/pastor")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session && req.nextUrl.pathname.startsWith("/secretary")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/pastor/:path*", "/secretary/:path*"],
};
