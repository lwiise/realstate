import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "site-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  // Admin panel must always render in French. If user lands on /en/admin/*,
  // redirect to the un-prefixed admin URL and reset the locale cookie to FR.
  if (pathname === "/en/admin" || pathname.startsWith("/en/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, "fr", {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return redirect;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    requestHeaders.set("x-site-locale", "fr");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("x-site-locale", "fr");
    return response;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    requestHeaders.set("x-site-locale", "en");
    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    response.headers.set("x-site-locale", "en");
    response.headers.append("Vary", "RSC, Next-Url, Cookie");
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  requestHeaders.set("x-site-locale", "fr");
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-site-locale", "fr");
  response.headers.append("Vary", "RSC, Next-Url, Cookie");
  response.cookies.set(LOCALE_COOKIE, "fr", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
