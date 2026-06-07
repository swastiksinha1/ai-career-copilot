// src/middleware.ts
// Clerk auth middleware — protects dashboard, resume, roadmap, tracker routes

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
