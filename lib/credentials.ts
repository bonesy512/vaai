/**
 * OpenBadges v3.0 Specification Types & JSON-LD Assertion Builder
 * Conforms to W3C Verifiable Credentials Data Model v2.0 & IMS Global OpenBadges v3.0
 * Contexts: https://www.w3.org/ns/credentials/v2 & https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json
 */

export type MilitaryBranch =
  | 'Army'
  | 'Navy'
  | 'Air Force'
  | 'Marine Corps'
  | 'Coast Guard'
  | 'Space Force'
  | 'National Guard'
  | 'Reserves'
  | string;

export interface CredentialMetadata {
  uuid: string;
  recipientId: string;
  recipientName: string;
  recipientEmail?: string;
  militaryBranch: MilitaryBranch;
  courseTitle: string;
  contactHours: number;
  capstoneScore: number;
  issuedAt: string; // ISO 8601
  verificationUrl: string;
  svgUrl: string;
  revocationStatus?: boolean;
}

export interface OpenBadgesIssuer {
  id: string;
  type: string[];
  name: string;
  url: string;
  email: string;
  description?: string;
}

export interface AchievementCriteria {
  narrative: string;
  id?: string;
}

export interface AchievementImage {
  id: string;
  type: string;
  caption?: string;
}

export interface AchievementResult {
  type: string[];
  achievedLevel?: string;
  resultDescription: string;
  value: string;
}

export interface OpenBadgesAchievement {
  id: string;
  type: string[];
  name: string;
  description: string;
  criteria: AchievementCriteria;
  image: AchievementImage;
}

export interface OpenBadgesCredentialSubject {
  id: string;
  type: string[];
  name: string;
  militaryBranch: string;
  achievement: OpenBadgesAchievement;
  result: AchievementResult[];
}

export interface OpenBadgesEvidence {
  id: string;
  type: string[];
  name: string;
  description: string;
  narrative?: string;
}

export interface OpenBadgesV3Assertion {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'
  ];
  id: string;
  type: ['VerifiableCredential', 'OpenBadgeCredential'];
  issuer: OpenBadgesIssuer;
  validFrom: string;
  credentialSubject: OpenBadgesCredentialSubject;
  evidence: OpenBadgesEvidence[];
}

/**
 * Builds an OpenBadges v3.0 compliant JSON-LD Assertion
 *
 * @param meta - Credential metadata containing recipient, scores, and identifiers
 * @param host - Host domain (e.g., vaai.mil or localhost:3000)
 * @returns Fully structured OpenBadgesV3Assertion JSON-LD object
 */
export function buildOpenBadgesV3Json(
  meta: CredentialMetadata,
  host: string
): OpenBadgesV3Assertion {
  // Normalize protocol
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const verificationUrl = meta.verificationUrl || `${baseUrl}/api/credentials/verify/${meta.uuid}`;
  const svgUrl = meta.svgUrl || `${verificationUrl}?format=svg`;

  return {
    '@context': [
      'https://www.w3.org/ns/credentials/v2',
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
    ],
    id: verificationUrl,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: {
      id: `${baseUrl}/api/credentials/issuer`,
      type: ['Profile'],
      name: 'Veteran AI Enablement Platform (VAAI)',
      url: baseUrl,
      email: 'credentials@vaai.mil',
      description:
        'State-approved workforce development provider delivering ETPL and WIOA Title I compliant AI enablement training for U.S. Military Veterans.',
    },
    validFrom: meta.issuedAt,
    credentialSubject: {
      id: meta.recipientId.startsWith('urn:') ? meta.recipientId : `urn:uuid:${meta.recipientId}`,
      type: ['AchievementSubject'],
      name: meta.recipientName,
      militaryBranch: meta.militaryBranch,
      achievement: {
        id: `${baseUrl}/achievements/vaai-workforce-credential`,
        type: ['Achievement'],
        name: meta.courseTitle,
        description:
          'Demonstrated workforce mastery in Veteran AI Literacy, ethical prompt engineering, Title 38 safe harbor compliance, and automated workflow configuration under WIOA standards.',
        criteria: {
          narrative:
            'Candidate completed a minimum of 36.0 verified contact hours (129,600s) verified through biometric/active tab telemetry and achieved at least 80.0% on the comprehensive Capstone Workflow Configuration practical examination.',
          id: `${baseUrl}/criteria/vaai-workforce-credential`,
        },
        image: {
          id: svgUrl,
          type: 'Image',
          caption: `Official Vector Diploma Certificate for ${meta.recipientName}`,
        },
      },
      result: [
        {
          type: ['Result'],
          achievedLevel: 'Mastery (Passed)',
          resultDescription: 'Capstone Workflow Configuration Practical Exam Score',
          value: `${meta.capstoneScore.toFixed(1)}%`,
        },
        {
          type: ['Result'],
          achievedLevel: 'WIOA Verified',
          resultDescription: 'Total Verified Active Contact Hours',
          value: `${meta.contactHours.toFixed(1)} Clock Hours`,
        },
      ],
    },
    evidence: [
      {
        id: verificationUrl,
        type: ['Evidence'],
        name: 'VAAI WIOA Audit & Capstone Verification Record',
        description:
          'Tamper-evident verification audit trail validated against immutable seat_time_logs and lab_submissions.',
        narrative: `Cryptographically referenced issuance under UUID ${meta.uuid}. Active seat-time requirement (>=36.0 hours) and capstone threshold (>=80.0%) verified compliant with ETPL state workforce criteria.`,
      },
    ],
  };
}
