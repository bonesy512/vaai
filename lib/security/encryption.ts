import crypto from 'node:crypto';

/**
 * NIST SP 800-171 Rev. 3 / FIPS 140-3 Authenticated Encryption Engine
 * Implements AES-256-GCM (Galois/Counter Mode) with 96-bit randomized IVs
 * and 128-bit authentication tags to protect sensitive veteran and defense data at rest (NIST SC-28).
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended by NIST SP 800-38D
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit authentication tag

/**
 * Typed error thrown when an AES-256-GCM ciphertext fails authentication tag verification.
 */
export class FipsIntegrityViolationError extends Error {
  constructor(message: string) {
    super(
      `FIPS 140-3 Integrity Violation: Ciphertext authentication failed. Data may have been tampered with or corrupted. Details: ${message}`
    );
    this.name = 'FipsIntegrityViolationError';
  }
}

export interface EncryptedPayload {
  ciphertext: string; // Base64 encoded ciphertext
  iv: string; // Base64 encoded 96-bit IV
  tag: string; // Base64 encoded 128-bit authentication tag
  algorithm?: string;
}

/**
 * Retrieves the 32-byte master key from environment or computes a deterministic fallback
 * for local sandbox testing.
 */
function getMasterKey(): Buffer {
  const envKey = process.env.ENCRYPTION_MASTER_KEY;

  if (envKey) {
    if (envKey.length === 64) {
      return Buffer.from(envKey, 'hex');
    }
    if (Buffer.byteLength(envKey, 'utf8') === 32) {
      return Buffer.from(envKey, 'utf8');
    }
    throw new Error(
      'Security Configuration Error: ENCRYPTION_MASTER_KEY must be a 32-byte key (64 hex characters or 32 raw bytes).'
    );
  }

  // Deterministic development fallback key derived via SHA-256
  return crypto
    .createHash('sha256')
    .update('VAAI_FEDRAMP_MODERATE_DEV_MASTER_KEY_SEED_DO_NOT_USE_IN_PROD')
    .digest();
}

/**
 * Encrypts a sensitive string using AES-256-GCM with a freshly generated 96-bit IV.
 */
export function encryptSensitiveField(plaintext: string): {
  ciphertext: string;
  iv: string;
  tag: string;
} {
  if (typeof plaintext !== 'string') {
    throw new TypeError('Encryption failure: plaintext must be a string');
  }

  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  if (tag.length !== AUTH_TAG_LENGTH_BYTES) {
    throw new Error('Cryptographic error: unexpected authentication tag length');
  }

  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

/**
 * Decrypts an AES-256-GCM payload and verifies its 128-bit authentication tag.
 * Throws FipsIntegrityViolationError if tampering is detected.
 */
export function decryptSensitiveField(
  ciphertext: string,
  iv: string,
  tag: string
): string {
  const key = getMasterKey();
  const ivBuffer = Buffer.from(iv, 'base64');
  const tagBuffer = Buffer.from(tag, 'base64');
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64');

  if (ivBuffer.length !== IV_LENGTH_BYTES) {
    throw new FipsIntegrityViolationError('Invalid IV length; must be 12 bytes (96 bits)');
  }
  if (tagBuffer.length !== AUTH_TAG_LENGTH_BYTES) {
    throw new FipsIntegrityViolationError('Invalid authentication tag length; must be 16 bytes');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(tagBuffer);

  try {
    const decrypted = Buffer.concat([
      decipher.update(ciphertextBuffer),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (err) {
    throw new FipsIntegrityViolationError(
      err instanceof Error ? err.message : 'Authentication tag verification failed'
    );
  }
}

/**
 * Encrypts designated sensitive fields of an object in-place.
 */
export function encryptRecord<T extends Record<string, unknown>>(
  data: T,
  sensitiveKeys: (keyof T)[]
): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...data };

  for (const key of sensitiveKeys) {
    const value = copy[key as string];
    if (value !== undefined && value !== null) {
      const plaintext = typeof value === 'string' ? value : JSON.stringify(value);
      copy[key as string] = encryptSensitiveField(plaintext);
    }
  }

  return copy;
}

/**
 * Decrypts designated sensitive fields of an encrypted object.
 */
export function decryptRecord<T extends Record<string, unknown>>(
  encryptedData: Record<string, unknown>,
  sensitiveKeys: (keyof T)[]
): T {
  const copy: Record<string, unknown> = { ...encryptedData };

  for (const key of sensitiveKeys) {
    const fieldVal = copy[key as string] as
      | { ciphertext: string; iv: string; tag: string }
      | undefined;

    if (fieldVal && fieldVal.ciphertext && fieldVal.iv && fieldVal.tag) {
      const decryptedPlaintext = decryptSensitiveField(
        fieldVal.ciphertext,
        fieldVal.iv,
        fieldVal.tag
      );

      // Attempt JSON parse if it was an object, otherwise keep string
      try {
        copy[key as string] = JSON.parse(decryptedPlaintext);
      } catch {
        copy[key as string] = decryptedPlaintext;
      }
    }
  }

  return copy as T;
}

/**
 * Helper to encrypt arbitrary JSON-serializable objects.
 */
export function encryptObject<T>(data: T): {
  ciphertext: string;
  iv: string;
  tag: string;
} {
  return encryptSensitiveField(JSON.stringify(data));
}

/**
 * Helper to decrypt and parse an encrypted JSON-serialized object.
 */
export function decryptObject<T>(
  ciphertext: string,
  iv: string,
  tag: string
): T {
  const decrypted = decryptSensitiveField(ciphertext, iv, tag);
  return JSON.parse(decrypted) as T;
}
