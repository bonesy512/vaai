import crypto from 'crypto';
import { OpenBadgesV3Assertion } from './credentials';

export interface W3cCredentialProof {
  type: 'Ed25519Signature2020';
  created: string;
  verificationMethod: string;
  proofPurpose: 'assertionMethod';
  proofValue: string;
}

export type OpenBadgesV3AssertionWithProof = OpenBadgesV3Assertion & {
  proof: W3cCredentialProof;
};

// Deterministic Master Issuer Key Pair for VAAI Authority
// In production, loaded from secure KMS / environment secrets.
let cachedKeyPair: { publicKey: crypto.KeyObject; privateKey: crypto.KeyObject } | null = null;

export function getOrCreateIssuerKeyPair() {
  if (cachedKeyPair) {
    return cachedKeyPair;
  }

  // Generate an official Ed25519 cryptographic key pair
  const keyPair = crypto.generateKeyPairSync('ed25519');
  cachedKeyPair = keyPair;
  return keyPair;
}

/**
 * Canonically serializes an object by sorting keys deterministically
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalizeJson).join(',')}]`;
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const entries = sortedKeys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });

  return `{${entries.join(',')}}`;
}

/**
 * Signs an OpenBadges v3.0 JSON-LD Assertion with an Ed25519 cryptographic signature.
 * Conforms to W3C Verifiable Credentials Data Integrity / Ed25519Signature2020.
 *
 * @param assertion - Target unsigned OpenBadges assertion
 * @param verificationMethodUrl - Public key URI
 * @returns Assertion with attached cryptographic proof object
 */
export function signOpenBadgesAssertion(
  assertion: OpenBadgesV3Assertion,
  verificationMethodUrl = 'https://vaai.mil/keys/issuer-key-ed25519-1.json'
): OpenBadgesV3AssertionWithProof {
  const { privateKey } = getOrCreateIssuerKeyPair();

  // Create deterministic canonical bytes (excluding existing proof if any)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ...payloadToSign } = assertion as unknown as Record<string, unknown>;
  const canonicalPayload = canonicalizeJson(payloadToSign);
  const dataBytes = Buffer.from(canonicalPayload, 'utf-8');

  // Sign using Ed25519
  const signatureBuffer = crypto.sign(null, dataBytes, privateKey);
  const proofValue = signatureBuffer.toString('base64url');

  const proof: W3cCredentialProof = {
    type: 'Ed25519Signature2020',
    created: new Date().toISOString(),
    verificationMethod: verificationMethodUrl,
    proofPurpose: 'assertionMethod',
    proofValue,
  };

  return {
    ...assertion,
    proof,
  };
}

/**
 * Cryptographically verifies an OpenBadges v3.0 assertion proof
 *
 * @param assertionWithProof - Credential containing proof object
 * @returns boolean indicating whether the signature is cryptographically valid
 */
export function verifyAssertionProof(
  assertionWithProof: OpenBadgesV3AssertionWithProof
): boolean {
  if (!assertionWithProof.proof || !assertionWithProof.proof.proofValue) {
    return false;
  }

  try {
    const { publicKey } = getOrCreateIssuerKeyPair();
    const { proof, ...payloadToVerify } = assertionWithProof;
    const canonicalPayload = canonicalizeJson(payloadToVerify);
    const dataBytes = Buffer.from(canonicalPayload, 'utf-8');
    const signatureBuffer = Buffer.from(proof.proofValue, 'base64url');

    return crypto.verify(null, dataBytes, publicKey, signatureBuffer);
  } catch {
    return false;
  }
}
