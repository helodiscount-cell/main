/**
 * Routes Configuration
 * Centralized route categories for authentication and authorization logic
 */

export const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/auth/sso-callback",
  "/api/webhooks/instagram",
] as const;

export const AUTH_ROUTE = "/auth";
export const CONNECT_ROUTE = "/auth/connect";
export const DASHBOARD_ROUTE = "/dash";

/**
 * Route Matchers
 */
export const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

export const isAuthRoute = (pathname: string) => pathname === AUTH_ROUTE;
export const isConnectRoute = (pathname: string) => pathname === CONNECT_ROUTE;
export const isApiRoute = (pathname: string) => pathname.startsWith("/api/");
export const isDashboardRoute = (pathname: string) =>
  pathname.startsWith(DASHBOARD_ROUTE);
