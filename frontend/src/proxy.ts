import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  
  if (request.nextUrl.pathname === "/") {
    if (!role) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    if (role === "shop_owner") {
      return NextResponse.redirect(new URL("/shop", request.url));
    }
    // Customer can stay on / to see products
    return NextResponse.next();
  }
  
  // Protect all /shop routes (which serve as the shop owner dashboard)
  if (request.nextUrl.pathname.startsWith("/shop")) {
    if (!role) {
      // Not authenticated
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    
    if (role === "customer") {
      // Authenticated as customer, block dashboard access
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Authenticated as shop_owner, allow access
    return NextResponse.next();
  }
  
  // Example for profile protection
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!role) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/shop/:path*", "/profile/:path*"],
};
