/**
 * DoD Instruction 5200.48 / CMMC 2.0 Level 2 / NIST SP 800-171 Rev. 3
 * CUI & DoD PII Shield Engine
 *
 * Provides lexical detection, regex-driven redaction, and deep object sanitization
 * for military identifiers (SSN, 10-digit DoD EDI-PI), NATO/DoD MGRS tactical grid
 * coordinates, and Controlled Unclassified Information (CUI / FEDCON) headers.
 */

// Controlled Unclassified Information (CUI) & Federal Defense Markings
export const CUI_MARKINGS_REGEX =
  /(?:\/\/(?:CUI|FEDCON|NOFORN|REL\s+TO\s+[^/]+|CONTROLLED\s+UNCLASSIFIED\s+INFORMATION)\/\/|\bCUI\/\/[A-Za-z0-9_-]+|\bCONTROLLED\s+UNCLASSIFIED\s+INFORMATION\b|\bDISTRIBUTION\s+STATEMENT\s+[A-F]\b|\bFEDCON\b|\bNOFORN\b)/gi;

// Military Grid Reference System (MGRS):
// Format: Grid Zone Designator (1-60 + latitude band C-X excluding I and O) + 100km Square ID (2 letters) + Easting/Northing digits
export const MGRS_REGEX =
  /\b(?:[1-5]?[0-9]|60)\s*[C-HJ-NP-X]\s*[A-HJ-NP-Z]{2}\s*(?:(?:\d{5}\s+\d{5})|(?:\d{4}\s+\d{4})|(?:\d{3}\s+\d{3})|(?:\d{2}\s+\d{2})|\d{10}|\d{8}|\d{6}|\d{4})\b/gi;

// Social Security Numbers: Hyphenated (\d{3}-\d{2}-\d{4}) and space-separated
export const SSN_HYPHEN_REGEX = /\b(?:\d{3}-\d{2}-\d{4}|\d{3}\s\d{2}\s\d{4})\b/g;

// DoD Identification Numbers (EDI-PI): 10-digit military identifiers
export const DOD_EDIPI_REGEX = /\b\d{10}\b/g;

// Raw 9-digit SSNs (isolated 9 consecutive digits)
export const SSN_RAW_9_REGEX = /\b\d{9}\b/g;

export interface SanitizeResult {
  sanitized: string;
  redactedCount: number;
  matchedCategories: string[];
}

// Backward compatibility interface
export interface ScrubResult {
  sanitized: string;
  redactedCount: number;
  detectedTypes: string[];
}

export interface LlmValidationResult {
  isSafe: boolean;
  violations: string[];
}

/**
 * Sanitizes a raw text string, replacing defense identifiers and CUI markings with standard redaction tokens.
 */
export function sanitizeText(raw: string): SanitizeResult {
  if (!raw || typeof raw !== 'string') {
    return { sanitized: '', redactedCount: 0, matchedCategories: [] };
  }

  let sanitized = raw;
  let redactedCount = 0;
  const categories = new Set<string>();

  // Reset indices for global regexes
  CUI_MARKINGS_REGEX.lastIndex = 0;
  MGRS_REGEX.lastIndex = 0;
  SSN_HYPHEN_REGEX.lastIndex = 0;
  DOD_EDIPI_REGEX.lastIndex = 0;
  SSN_RAW_9_REGEX.lastIndex = 0;

  // 1. Redact CUI / FEDCON Markings & Distribution Statements first
  sanitized = sanitized.replace(CUI_MARKINGS_REGEX, () => {
    redactedCount++;
    categories.add('CUI_MARKING');
    return '[REDACTED_CUI]';
  });

  // 2. Redact MGRS tactical coordinates before pure digit patterns
  sanitized = sanitized.replace(MGRS_REGEX, () => {
    redactedCount++;
    categories.add('MGRS_COORDINATE');
    return '[REDACTED_MGRS_COORDINATE]';
  });

  // 3. Redact hyphenated/spaced SSNs
  sanitized = sanitized.replace(SSN_HYPHEN_REGEX, () => {
    redactedCount++;
    categories.add('SSN');
    return '[REDACTED_DOD_PII]';
  });

  // 4. Redact 10-digit DoD EDI-PI IDs
  sanitized = sanitized.replace(DOD_EDIPI_REGEX, () => {
    redactedCount++;
    categories.add('DOD_ID_EDIPI');
    return '[REDACTED_DOD_PII]';
  });

  // 5. Redact contiguous 9-digit SSNs
  sanitized = sanitized.replace(SSN_RAW_9_REGEX, () => {
    redactedCount++;
    categories.add('SSN');
    return '[REDACTED_DOD_PII]';
  });

  return {
    sanitized,
    redactedCount,
    matchedCategories: Array.from(categories),
  };
}

/**
 * Backward compatibility alias for sanitizeText
 */
export function scrubCuiAndPii(raw: string): ScrubResult {
  const res = sanitizeText(raw);
  return {
    sanitized: res.sanitized,
    redactedCount: res.redactedCount,
    detectedTypes: res.matchedCategories,
  };
}

/**
 * Checks whether an input string contains unredacted CUI markings or DoD identifiers.
 */
export function containsCui(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  CUI_MARKINGS_REGEX.lastIndex = 0;
  MGRS_REGEX.lastIndex = 0;
  SSN_HYPHEN_REGEX.lastIndex = 0;
  DOD_EDIPI_REGEX.lastIndex = 0;
  SSN_RAW_9_REGEX.lastIndex = 0;

  return (
    CUI_MARKINGS_REGEX.test(input) ||
    MGRS_REGEX.test(input) ||
    SSN_HYPHEN_REGEX.test(input) ||
    DOD_EDIPI_REGEX.test(input) ||
    SSN_RAW_9_REGEX.test(input)
  );
}

/**
 * Gatekeeper function protecting downstream LLM inference endpoints.
 * Returns isSafe: false with explicit statutory violations if unredacted CUI/PII is detected.
 */
export function validateSafeForLlm(raw: string): LlmValidationResult {
  if (!raw || typeof raw !== 'string') {
    return { isSafe: true, violations: [] };
  }

  const violations: string[] = [];

  SSN_HYPHEN_REGEX.lastIndex = 0;
  SSN_RAW_9_REGEX.lastIndex = 0;
  if (SSN_HYPHEN_REGEX.test(raw) || SSN_RAW_9_REGEX.test(raw)) {
    violations.push('Prohibited Social Security Number (SSN) detected in prompt.');
  }

  DOD_EDIPI_REGEX.lastIndex = 0;
  if (DOD_EDIPI_REGEX.test(raw)) {
    violations.push('Prohibited Department of Defense EDI-PI identification number detected.');
  }

  MGRS_REGEX.lastIndex = 0;
  if (MGRS_REGEX.test(raw)) {
    violations.push('Prohibited Military Grid Reference System (MGRS) tactical coordinates detected.');
  }

  CUI_MARKINGS_REGEX.lastIndex = 0;
  if (CUI_MARKINGS_REGEX.test(raw)) {
    violations.push('Controlled Unclassified Information (CUI/FEDCON) markings detected.');
  }

  return {
    isSafe: violations.length === 0,
    violations,
  };
}

/**
 * Recursively traverses an arbitrary JavaScript object or array and sanitizes all nested string fields.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeText(obj).sanitized as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeObject(value);
    }
    return result as T;
  }

  return obj;
}
