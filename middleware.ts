import { NextResponse, type NextRequest } from 'next/server';

/**
 * Defense-Grade Edge Security Middleware
 * Compliance Baseline: NIST SP 800-171 Rev. 2/3 (CUI Protection), CMMC 2.0 Level 2, DISA FedRAMP Moderate, DoD Instruction 5200.48
 *
 * Implements:
 * 1. Cryptographic 128-bit per-request nonce injection via crypto.getRandomValues.
 * 2. Strict Content Security Policy (omitting 'unsafe-inline' and 'unsafe-eval' from script execution).
 * 3. 2-Year HSTS Preload, anti-clickjacking frame restrictions, and NIST compliance trace propagation.
 */
export function middleware(request: NextRequest) {
  // 1. Generate a 128-bit random base64 nonce using Web Crypto API
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = Buffer.from(nonceBytes).toString('base64');

  // Generate unique request trace UUIDv4
  const traceId = crypto.randomUUID();

  // 2. Clone request headers and inject security context for downstream SSR / Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-vaai-trace-id', traceId);

  // 3. Construct Strict Content Security Policy (CSP)
  // Omit 'unsafe-inline' and 'unsafe-eval' from script-src; require nonce and strict-dynamic
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  const cspHeader = cspDirectives.join('; ');

  // 4. Create response object with updated request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Standard Federal Transport & Protection Headers
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

  // Dynamic Strict Content Security Policy
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
