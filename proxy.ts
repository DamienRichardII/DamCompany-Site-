import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail, supabaseEnv } from "@/lib/supabase/env";

/**
 * Protège /admin/* (Next.js 16 : `proxy` remplace `middleware`).
 * - session Supabase rafraîchie via les cookies ;
 * - accès réservé aux emails listés dans ADMIN_EMAILS ;
 * - /admin/login reste public.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/logout")) return NextResponse.next();

  const env = supabaseEnv();
  const toLogin = () => NextResponse.redirect(new URL("/admin/login", request.url));
  if (!env) return toLogin();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAdminEmail(data.user.email)) return toLogin();
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
