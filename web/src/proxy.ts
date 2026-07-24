import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/manifest.webmanifest",
  "/sw.js",
  "/samples(.*)",
  "/icons(.*)",
]);

// API routes auth is handled inside each route handler (requireUserId)
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isApiRoute(req)) return;
  await auth.protect();
});

export const config = {
  matcher: [
    // Include Clerk handshake/proxy routes; skip static assets.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk(.*)",
  ],
};
