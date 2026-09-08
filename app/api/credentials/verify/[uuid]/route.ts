import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  CredentialMetadata,
  buildOpenBadgesV3Json,
} from '@/lib/credentials';
import { renderCertificateSvg } from '@/lib/certificate-renderer';

// Fallback demo registry for development, demonstration, and offline validation
const MOCK_CREDENTIALS: Record<string, CredentialMetadata> = {
  'VAAI-2026-DEMO': {
    uuid: 'VAAI-2026-DEMO',
    recipientId: 'd3b07384-d113-4f44-932f-b4b1a43a6d91',
    recipientName: 'Alex M. Mercer',
    recipientEmail: 'alex.mercer@veterans.vaai.mil',
    militaryBranch: 'Army',
    courseTitle: 'Veteran AI Enablement & Workflow Automation',
    contactHours: 38.5,
    capstoneScore: 94.0,
    issuedAt: '2026-03-15T16:00:00.000Z',
    verificationUrl: '',
    svgUrl: '',
    revocationStatus: false,
  },
  'VAAI-2026-VET-001': {
    uuid: 'VAAI-2026-VET-001',
    recipientId: 'e4c18495-e224-5g55-043g-c5c2b54b7e02',
    recipientName: 'Sarah J. Connor',
    recipientEmail: 'sarah.connor@veterans.vaai.mil',
    militaryBranch: 'Marine Corps',
    courseTitle: 'Veteran AI Enablement & Workflow Automation',
    contactHours: 42.0,
    capstoneScore: 98.5,
    issuedAt: '2026-04-10T14:30:00.000Z',
    verificationUrl: '',
    svgUrl: '',
    revocationStatus: false,
  },
  'VAAI-2026-REVOKED': {
    uuid: 'VAAI-2026-REVOKED',
    recipientId: 'f5d29506-f335-6h66-154h-d6d3c65c8f13',
    recipientName: 'John Doe',
    militaryBranch: 'Navy',
    courseTitle: 'Veteran AI Enablement & Workflow Automation',
    contactHours: 36.0,
    capstoneScore: 82.0,
    issuedAt: '2026-01-20T10:00:00.000Z',
    verificationUrl: '',
    svgUrl: '',
    revocationStatus: true,
  },
};

/**
 * Next.js 16 Content-Negotiated Verification Route Handler
 * Route context parameters must be unwrapped asynchronously: params: Promise<{ uuid: string }>
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params;
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const currentBaseUrl = `${protocol}://${host}`;

    if (!uuid || typeof uuid !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid credential UUID' }, { status: 400 });
    }

    let meta: CredentialMetadata | null = null;
    let isRevoked = false;

    // 1. Query Supabase issued_credentials and join profiles table
    const isMockEnv =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

    if (!isMockEnv) {
      try {
        const supabase = await createClient();
        const { data: record, error: dbError } = await supabase
          .from('issued_credentials')
          .select(`
            uuid,
            user_id,
            course_title,
            contact_hours,
            capstone_score,
            issued_at,
            revocation_status,
            profiles:user_id (
              id,
              full_name,
              military_branch,
              email
            )
          `)
          .eq('uuid', uuid)
          .maybeSingle();

        if (!dbError && record) {
          // Handle join data typing safely
          const profile = Array.isArray(record.profiles)
            ? record.profiles[0]
            : record.profiles;

          isRevoked = Boolean(record.revocation_status);

          meta = {
            uuid: record.uuid,
            recipientId: record.user_id,
            recipientName: profile?.full_name || 'Verified Veteran Trainee',
            recipientEmail: profile?.email,
            militaryBranch: profile?.military_branch || 'Veteran',
            courseTitle: record.course_title || 'Veteran AI Enablement & Workflow Automation',
            contactHours: Number(record.contact_hours) || 36.0,
            capstoneScore: Number(record.capstone_score) || 85.0,
            issuedAt: record.issued_at || new Date().toISOString(),
            verificationUrl: `${currentBaseUrl}/api/credentials/verify/${record.uuid}`,
            svgUrl: `${currentBaseUrl}/api/credentials/verify/${record.uuid}?format=svg`,
            revocationStatus: isRevoked,
          };
        }
      } catch {
        // Supabase connection or table not yet configured; fall back to mock registry
      }
    }

    // 2. Check mock demo registry if database record was not found
    if (!meta) {
      const mockRecord = MOCK_CREDENTIALS[uuid];
      if (mockRecord) {
        isRevoked = Boolean(mockRecord.revocationStatus);
        meta = {
          ...mockRecord,
          verificationUrl: `${currentBaseUrl}/api/credentials/verify/${uuid}`,
          svgUrl: `${currentBaseUrl}/api/credentials/verify/${uuid}?format=svg`,
        };
      }
    }

    // 3. Handle 404 Not Found
    if (!meta) {
      return NextResponse.json(
        {
          error: 'Credential Not Found',
          message: `No active or historical credential matches UUID ${uuid}.`,
          status: 404,
        },
        { status: 404 }
      );
    }

    // 4. Handle 410 Gone if revocation_status is true
    if (isRevoked || meta.revocationStatus) {
      return NextResponse.json(
        {
          error: 'Credential Revoked',
          message: `The credential with UUID ${uuid} was previously issued but has been officially revoked by the state oversight authority.`,
          uuid,
          revocation_status: true,
          revokedAt: meta.issuedAt,
        },
        {
          status: 410,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    // 5. Content Negotiation: Check ?format=svg and Accept header
    const url = new URL(request.url);
    const formatParam = url.searchParams.get('format')?.toLowerCase();
    const acceptHeader = request.headers.get('accept')?.toLowerCase() || '';

    const isSvgRequested =
      formatParam === 'svg' ||
      acceptHeader.includes('image/svg+xml');

    if (isSvgRequested) {
      const svg = renderCertificateSvg(meta);
      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        },
      });
    }

    // Default or Accept: application/ld+json / application/json
    const assertion = buildOpenBadgesV3Json(meta, host);
    return new NextResponse(JSON.stringify(assertion, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/ld+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
