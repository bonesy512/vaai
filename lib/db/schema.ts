/**
 * Supabase PostgreSQL Database Schema Definitions
 * Covers: employer_agreements, wioa_placements, and audit_events
 * Baseline Frameworks: NIST SP 800-171 Rev. 3, CMMC 2.0 Level 2, WIOA Title I
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      employer_agreements: {
        Row: {
          id: string;
          agreement_id: string;
          company_name: string;
          dba_name: string | null;
          ein: string;
          contact_name: string;
          contact_title: string;
          contact_email: string;
          contact_phone: string | null;
          annual_interview_target: number;
          clearance_focus: 'None' | 'Secret' | 'Top Secret / SCI' | 'Any';
          target_roles: string[];
          status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
          signed_at: string | null;
          signer_name: string | null;
          signer_title: string | null;
          signer_email: string | null;
          signer_ip_hash: string | null;
          user_agent: string | null;
          consent_statement_accepted: boolean;
          compiled_contract_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agreement_id: string;
          company_name: string;
          dba_name?: string | null;
          ein: string;
          contact_name: string;
          contact_title: string;
          contact_email: string;
          contact_phone?: string | null;
          annual_interview_target?: number;
          clearance_focus?: 'None' | 'Secret' | 'Top Secret / SCI' | 'Any';
          target_roles?: string[];
          status?: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
          signed_at?: string | null;
          signer_name?: string | null;
          signer_title?: string | null;
          signer_email?: string | null;
          signer_ip_hash?: string | null;
          user_agent?: string | null;
          consent_statement_accepted?: boolean;
          compiled_contract_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agreement_id?: string;
          company_name?: string;
          dba_name?: string | null;
          ein?: string;
          contact_name?: string;
          contact_title?: string;
          contact_email?: string;
          contact_phone?: string | null;
          annual_interview_target?: number;
          clearance_focus?: 'None' | 'Secret' | 'Top Secret / SCI' | 'Any';
          target_roles?: string[];
          status?: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
          signed_at?: string | null;
          signer_name?: string | null;
          signer_title?: string | null;
          signer_email?: string | null;
          signer_ip_hash?: string | null;
          user_agent?: string | null;
          consent_statement_accepted?: boolean;
          compiled_contract_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wioa_placements: {
        Row: {
          id: string;
          placement_id: string;
          candidate_id: string;
          candidate_uuid: string;
          candidate_name: string;
          employer_name: string;
          employer_ein: string | null;
          job_title: string;
          soc_code: string;
          salary_bracket: string;
          hire_date: string;
          retention_q2_verified: boolean;
          retention_q4_verified: boolean;
          pirl_export_included: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          placement_id: string;
          candidate_id: string;
          candidate_uuid: string;
          candidate_name: string;
          employer_name: string;
          employer_ein?: string | null;
          job_title: string;
          soc_code?: string;
          salary_bracket: string;
          hire_date: string;
          retention_q2_verified?: boolean;
          retention_q4_verified?: boolean;
          pirl_export_included?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          placement_id?: string;
          candidate_id?: string;
          candidate_uuid?: string;
          candidate_name?: string;
          employer_name?: string;
          employer_ein?: string | null;
          job_title?: string;
          soc_code?: string;
          salary_bracket?: string;
          hire_date?: string;
          retention_q2_verified?: boolean;
          retention_q4_verified?: boolean;
          pirl_export_included?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: number;
          event_id: string;
          timestamp: string;
          event_type:
            | 'AUTH_ATTEMPT'
            | 'CUI_ACCESS'
            | 'SEAT_TIME_HEARTBEAT'
            | 'CREDENTIAL_ISSUED'
            | 'SAFE_HARBOR_REFUSAL'
            | 'MOU_SIGNED'
            | 'PLACEMENT_RECORDED'
            | 'ENCRYPTION_OPERATION'
            | 'SECURITY_VIOLATION'
            | 'SESSION_TIMEOUT';
          principal_id: string;
          ip_hash: string;
          action: string;
          status: 'SUCCESS' | 'FAILURE' | 'INTERCEPTED';
          metadata: Record<string, unknown>;
          previous_entry_hash: string;
          entry_signature: string;
        };
        Insert: {
          id?: number;
          event_id?: string;
          timestamp?: string;
          event_type:
            | 'AUTH_ATTEMPT'
            | 'CUI_ACCESS'
            | 'SEAT_TIME_HEARTBEAT'
            | 'CREDENTIAL_ISSUED'
            | 'SAFE_HARBOR_REFUSAL'
            | 'MOU_SIGNED'
            | 'PLACEMENT_RECORDED'
            | 'ENCRYPTION_OPERATION'
            | 'SECURITY_VIOLATION'
            | 'SESSION_TIMEOUT';
          principal_id: string;
          ip_hash: string;
          action: string;
          status: 'SUCCESS' | 'FAILURE' | 'INTERCEPTED';
          metadata?: Record<string, unknown>;
          previous_entry_hash: string;
          entry_signature: string;
        };
        Update: {
          // Immutability enforcement: audit_events are append-only.
          id?: never;
          event_id?: never;
          timestamp?: never;
          event_type?: never;
          principal_id?: never;
          ip_hash?: never;
          action?: never;
          status?: never;
          metadata?: never;
          previous_entry_hash?: never;
          entry_signature?: never;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      prevent_audit_tampering: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      update_timestamp: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience Type Aliases
export type EmployerAgreementRow = Database['public']['Tables']['employer_agreements']['Row'];
export type EmployerAgreementInsert = Database['public']['Tables']['employer_agreements']['Insert'];
export type EmployerAgreementUpdate = Database['public']['Tables']['employer_agreements']['Update'];

export type WioaPlacementRow = Database['public']['Tables']['wioa_placements']['Row'];
export type WioaPlacementInsert = Database['public']['Tables']['wioa_placements']['Insert'];
export type WioaPlacementUpdate = Database['public']['Tables']['wioa_placements']['Update'];

export type AuditEventRow = Database['public']['Tables']['audit_events']['Row'];
export type AuditEventInsert = Database['public']['Tables']['audit_events']['Insert'];
export type AuditEventUpdate = Database['public']['Tables']['audit_events']['Update'];
