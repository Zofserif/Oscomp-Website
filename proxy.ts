import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/pricing") {
    return NextResponse.next();
  }

  if (pathname === "/pricing.html") {
    const target = request.nextUrl.clone();
    target.pathname = "/pricing";
    target.search = "";

    return NextResponse.redirect(target, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pricing", "/pricing.html"],
};
