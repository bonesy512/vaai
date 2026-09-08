import { z } from 'zod';

export const ClearanceRequirementEnum = z.enum([
  'None',
  'Secret',
  'Top Secret / SCI',
  'Any',
]);

export const MouStatusEnum = z.enum([
  'draft',
  'pending_signature',
  'active',
  'expired',
  'terminated',
]);

export type MouStatus = z.infer<typeof MouStatusEnum>;

export const MouPointOfContactSchema = z.object({
  name: z.string().min(2, 'Contact name must be at least 2 characters'),
  title: z.string().min(2, 'Contact title must be at least 2 characters'),
  email: z.string().email('Please enter a valid corporate email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const MouDraftSchema = z.object({
  companyLegalName: z
    .string()
    .min(2, 'Company legal name must be at least 2 characters'),
  dbaName: z.string().optional(),
  employerEin: z
    .string()
    .regex(
      /^\d{2}-\d{7}$/,
      'Employer EIN must follow standard format: XX-XXXXXXX'
    ),
  pointOfContact: MouPointOfContactSchema,
  targetHiringRoles: z
    .array(z.string().min(1))
    .min(1, 'Please select or specify at least one target hiring role'),
  clearanceRequirements: ClearanceRequirementEnum.default('Any'),
  annualInterviewCommitment: z
    .number()
    .int()
    .min(
      3,
      'Partnership requires a minimum commitment of 3 candidate interviews annually'
    )
    .default(5),
  placementReportingConsent: z.boolean().refine((val) => val === true, {
    message:
      'Employer must consent to WIOA Title I placement and wage bracket verification reporting',
  }),
});

export const MouSignatureSchema = z.object({
  signerName: z.string().min(2, 'Signer name must be at least 2 characters'),
  signerTitle: z
    .string()
    .min(2, 'Signer corporate title must be at least 2 characters'),
  signerEmail: z
    .string()
    .email('Please enter a valid corporate email for signature'),
  signatureTimestamp: z.string().datetime({
    message: 'Signature timestamp must be a valid ISO 8601 string',
  }),
  ipAddress: z.string().min(1, 'Signer IP address is required for audit trail'),
  userAgent: z.string().min(1, 'User agent required for e-signature record'),
  consentStatementAccepted: z.boolean().refine((val) => val === true, {
    message:
      'Signer must accept the electronic signature and legal binding statement',
  }),
});

export type MouPointOfContact = z.infer<typeof MouPointOfContactSchema>;
export type MouDraftData = z.infer<typeof MouDraftSchema>;
export type MouSignatureData = z.infer<typeof MouSignatureSchema>;

export interface EmployerAgreement {
  id: string; // e.g. MOU-2026-A1B2C3D4 or UUID
  companyLegalName: string;
  dbaName?: string;
  employerEin: string;
  pointOfContact: MouPointOfContact;
  targetHiringRoles: string[];
  clearanceRequirements: z.infer<typeof ClearanceRequirementEnum>;
  annualInterviewCommitment: number;
  placementReportingConsent: boolean;
  status: MouStatus;
  compiledContractText: string;
  signature?: MouSignatureData;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}
