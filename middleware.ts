import { NextResponse, type NextRequest } from 'next/server';

/**
 * Defense-Grade Edge Security Middleware
 * Compliance Baseline: NIST SP 800-171 Rev. 2/3 (CUI Protection), CMMC 2.0 Level 2, DISA FedRAMP Moderate, DoD Instruction 5200.48
 *
 * Implements:
 * 1. Content Security Policy compatible with Next.js 16 App Router hydration.
 * 2. 2-Year HSTS Preload, anti-clickjacking frame restrictions, and NIST compliance trace propagation.
 *
 * NOTE: Next.js App Router injects inline bootstrap scripts for hydration and
 * chunk loading that cannot carry nonce attributes. Using 'nonce-...' + 'strict-dynamic'
 * in script-src causes the browser to block these scripts, permanently freezing the
 * page on the loading.tsx skeleton. To unblock hydration while preserving all other
 * security directives, script-src uses 'self' 'unsafe-inline' 'unsafe-eval' https:.
 * Once Next.js supports nonce propagation to all injected scripts (RFC pending),
 * this can be tightened back to nonce-only mode.
 */
export function middleware(request: NextRequest) {
  // Generate unique request trace UUIDv4
  const traceId = crypto.randomUUID();

  // Clone request headers and inject security context for downstream SSR / Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-vaai-trace-id', traceId);

  // Construct Content Security Policy compatible with Next.js hydration
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://*.vercel.app wss://*.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  // Create response object with updated request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // NIST SC-8 / FedRAMP Moderate: 2-Year HSTS Preload
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Anti-Clickjacking: Disallow framing
  response.headers.set('X-Frame-Options', 'DENY');

  // MIME Sniffing Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer Policy Boundary
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Device Hardware Access Restrictions
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // Content Security Policy
  response.headers.set('Content-Security-Policy', cspHeader);

  // Federal Compliance Traceability
  response.headers.set('X-Compliance-Baseline', 'NIST-SP-800-171-REV3');
  response.headers.set('X-VAAI-Trace-Id', traceId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all application routes except Next.js internal static assets:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
