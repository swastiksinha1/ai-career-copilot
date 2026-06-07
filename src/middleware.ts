// src/middleware.ts
// Clerk auth middleware — protects dashboard, resume, roadmap, tracker routes

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/roadmap(.*)",
  "/tracker(.*)",
  "/api/resume(.*)",
  "/api/roadmap(.*)",
  "/api/applications(.*)",
  "/api/github(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

// Basic in-memory rate limiter to stop rapid-fire script loops
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(ipOrId: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ipOrId);

  if (!record) {
    rateLimitMap.set(ipOrId, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > windowMs) {
    rateLimitMap.set(ipOrId, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Rate Limit all API routes
  if (isApiRoute(req)) {
    const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
    
    // Limit to 30 requests per minute per IP (very generous for normal use, but stops malicious bot loops)
    const isAllowed = checkRateLimit(ip, 30, 60 * 1000);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down to protect AI limits." },
        { status: 429 }
      );
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
