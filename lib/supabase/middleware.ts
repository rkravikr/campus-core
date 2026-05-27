import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token if expired
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Define route classifications
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/forgot-password");
  const isProtectedRoute = path.startsWith("/dashboard") || 
                           path.startsWith("/attendance") || 
                           path.startsWith("/assignments") || 
                           path.startsWith("/timetable") || 
                           path.startsWith("/exams") || 
                           path.startsWith("/cgpa") || 
                           path.startsWith("/profile") || 
                           path.startsWith("/settings");

  // Redirect rules
  if (!user && isProtectedRoute) {
    // Unauthenticated user accessing a protected route -> redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Store original page to redirect back after login
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  if (user && (isAuthRoute || path === "/")) {
    // Authenticated user accessing landing page or login/signup -> redirect to dashboard
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
