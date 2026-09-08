import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { MouDraftSchema, EmployerAgreement } from '@/lib/schemas/mou';
import {
  compileMouText,
  getAllAgreements,
  saveAgreement,
} from '@/lib/mou-template';
import { getServiceRoleClient } from '@/lib/db/server-client';

/**
 * GET: List all enterprise partnership agreements
 * Queries public.employer_agreements with graceful offline in-memory fallback.
 */
export async function GET() {
  try {
    let agreements = getAllAgreements();
    const supabase = getServiceRoleClient();

    if (supabase) {
      try {
        const { data: dbRecords, error } = await supabase
          .from('employer_agreements')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbRecords && dbRecords.length > 0) {
          const mapped: EmployerAgreement[] = dbRecords.map((r) => ({
            id: r.agreement_id || r.id,
            companyLegalName: r.company_name,
            dbaName: r.dba_name || undefined,
            employerEin: r.ein,
            pointOfContact: {
              name: r.contact_name,
              title: r.contact_title,
              email: r.contact_email,
              phone: r.contact_phone || '512-555-0100',
            },
            targetHiringRoles: r.target_roles || [],
            clearanceRequirements: r.clearance_focus || 'Any',
            annualInterviewCommitment: Number(r.annual_interview_target) || 5,
            placementReportingConsent: true,
            status: r.status,
            compiledContractText: r.compiled_contract_text,
            signedAt: r.signed_at || undefined,
            signature: r.signer_name
              ? {
                  signerName: r.signer_name,
                  signerTitle: r.signer_title || 'Authorized Representative',
                  signerEmail: r.signer_email || r.contact_email,
                  signatureTimestamp: r.signed_at || new Date().toISOString(),
                  ipAddress: '127.0.0.1',
                  userAgent: r.user_agent || 'Recorded Digital Signature',
                  consentStatementAccepted: r.consent_statement_accepted ?? true,
                }
              : undefined,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));

          agreements = mapped;
        }
      } catch (dbErr) {
        console.warn('Database query fallback to in-memory store:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      count: agreements.length,
      agreements,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST: Create a new draft Employer Partnership MOU
 * Validates payload with MouDraftSchema, persists to public.employer_agreements if reachable,
 * and maintains local memory store fallback.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = MouDraftSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed for MOU draft data',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const currentYear = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const agreementId = `MOU-${currentYear}-${randomHex}`;

    const compiledContractText = compileMouText(data);
    const now = new Date().toISOString();

    const agreement: EmployerAgreement = {
      id: agreementId,
      ...data,
      status: 'pending_signature',
      compiledContractText,
      createdAt: now,
      updatedAt: now,
    };

    // Save in memory store
    saveAgreement(agreement);

    // Save in Supabase if reachable
    const supabase = getServiceRoleClient();
    let dbPersisted = false;

    if (supabase) {
      try {
        const { error: insertErr } = await supabase.from('employer_agreements').insert({
          agreement_id: agreementId,
          company_name: data.companyLegalName,
          dba_name: data.dbaName || null,
          ein: data.employerEin,
          contact_name: data.pointOfContact.name,
          contact_title: data.pointOfContact.title,
          contact_email: data.pointOfContact.email,
          contact_phone: data.pointOfContact.phone || null,
          annual_interview_target: data.annualInterviewCommitment,
          clearance_focus: data.clearanceRequirements,
          target_roles: data.targetHiringRoles,
          status: 'pending_signature',
          compiled_contract_text: compiledContractText,
          consent_statement_accepted: false,
          created_at: now,
          updated_at: now,
        });

        if (!insertErr) {
          dbPersisted = true;
        } else {
          console.warn('Supabase insert note:', insertErr.message);
        }
      } catch (dbErr) {
        console.warn('Database write fallback to in-memory store:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        agreementId,
        status: 'pending_signature',
        storage: dbPersisted ? 'supabase_employer_agreements' : 'memory_fallback',
        message: 'MOU draft generated successfully and awaiting corporate electronic signature.',
        agreement,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
