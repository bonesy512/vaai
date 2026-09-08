import { type NextRequest, NextResponse } from 'next/server';
import type { UserRole } from './types';

export interface RouteSecurityRule {
  pathPrefix: string;
  allowedRoles: UserRole[];
  redirectFallback: string;
}

export const PROTECTED_ROUTE_RULES: RouteSecurityRule[] = [
  {
    pathPrefix: '/admin',
    allowedRoles: ['admin'],
    redirectFallback: '/login?error=admin_required',
  },
  {
    pathPrefix: '/courses',
    allowedRoles: ['student', 'admin'],
    redirectFallback: '/login?error=auth_required',
  },
];

/**
 * Checks whether a given path is protected by a security role gate
 */
export function getRouteSecurityRule(pathname: string): RouteSecurityRule | undefined {
  return PROTECTED_ROUTE_RULES.find((rule) => pathname.startsWith(rule.pathPrefix));
}

/**
 * Validates a user's role against route requirements
 */
export function isRoleAuthorized(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Helper to construct login redirection URL with safe return path
 */
export function buildLoginRedirect(req: NextRequest, reason = 'auth_required'): NextResponse {
  const returnUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
  const loginUrl = new URL(`/login?redirect=${returnUrl}&reason=${reason}`, req.url);
  return NextResponse.redirect(loginUrl);
}
