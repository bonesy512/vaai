import { CredentialMetadata } from './credentials';

/**
 * Escapes characters that could lead to XML/SVG injection attacks.
 * Replaces &, <, >, ", and ' with corresponding XML entities.
 */
export function escapeXml(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return String(unsafe);
  }
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Renders an accessible, high-contrast, military-themed vector SVG diploma certificate.
 * Conforms to viewBox="0 0 1200 800" specifications.
 *
 * @param meta - Validated credential metadata
 * @returns Serialized XML/SVG string
 */
export function renderCertificateSvg(meta: CredentialMetadata): string {
  const name = escapeXml(meta.recipientName);
  const branch = escapeXml(meta.militaryBranch.toUpperCase());
  const course = escapeXml(meta.courseTitle);
  const uuid = escapeXml(meta.uuid);
  const verificationUrl = escapeXml(meta.verificationUrl);
  const contactHours = escapeXml(meta.contactHours.toFixed(1));
  const capstoneScore = escapeXml(meta.capstoneScore.toFixed(1));

  // Format date for clean display
  let formattedDate = meta.issuedAt;
  try {
    const d = new Date(meta.issuedAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch {
    formattedDate = meta.issuedAt;
  }
  const displayDate = escapeXml(formattedDate);

  // Measure dynamic branch pill width
  const branchPillText = `${branch} VETERAN`;
  const pillWidth = Math.max(180, branchPillText.length * 10 + 40);
  const pillX = 600 - pillWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img" aria-label="Certificate of Credential for ${name}">
  <title>VAAI Workforce Credential Certificate - ${name}</title>
  <desc>Tamper-evident WIOA and ETPL compliant certificate of achievement awarded to ${name} (${branch} Veteran) for completion of ${course}.</desc>
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050b14"/>
      <stop offset="35%" stop-color="#0b172a"/>
      <stop offset="70%" stop-color="#0f1f38"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
    </radialGradient>

    <!-- Metallic Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b38728"/>
      <stop offset="25%" stop-color="#fdf0a6"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="75%" stop-color="#fae588"/>
      <stop offset="100%" stop-color="#9a741b"/>
    </linearGradient>

    <!-- Subtle Silver Gradient for Secondary Text -->
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Corner Flourish Component -->
    <g id="cornerFlourish">
      <path d="M 0 0 L 0 50 L 6 50 L 6 12 L 50 12 L 50 6 L 12 6 L 12 0 Z" fill="url(#goldGrad)"/>
      <polygon points="16,16 26,16 16,26" fill="#d4af37"/>
      <circle cx="28" cy="28" r="3" fill="#fef08a"/>
      <line x1="0" y1="0" x2="36" y2="36" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="2,2"/>
    </g>
  </defs>

  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
    .font-serif { font-family: Georgia, Cambria, "Times New Roman", Times, serif; }
  </style>

  <!-- Base Canvas Background -->
  <rect x="0" y="0" width="1200" height="800" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="1200" height="800" fill="url(#centerGlow)"/>

  <!-- Guilloche / Security Hatch Pattern Watermark (Subtle) -->
  <g opacity="0.04" stroke="#d4af37" stroke-width="1" fill="none">
    <circle cx="600" cy="400" r="180"/>
    <circle cx="600" cy="400" r="220"/>
    <circle cx="600" cy="400" r="260"/>
    <circle cx="600" cy="400" r="300"/>
    <circle cx="600" cy="400" r="340"/>
    <path d="M 200 400 Q 600 200 1000 400 T 1400 400"/>
    <path d="M 200 400 Q 600 600 1000 400 T 1400 400"/>
  </g>

  <!-- Dual-Line Outer Frame -->
  <rect x="24" y="24" width="1152" height="752" fill="none" stroke="url(#goldGrad)" stroke-width="2" rx="4"/>
  <rect x="36" y="36" width="1128" height="728" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="8,4" rx="2"/>

  <!-- Corner Flourishes -->
  <g transform="translate(42, 42)">
    <use href="#cornerFlourish"/>
  </g>
  <g transform="translate(1158, 42) scale(-1, 1)">
    <use href="#cornerFlourish"/>
  </g>
  <g transform="translate(42, 758) scale(1, -1)">
    <use href="#cornerFlourish"/>
  </g>
  <g transform="translate(1158, 758) scale(-1, -1)">
    <use href="#cornerFlourish"/>
  </g>

  <!-- Top Military Insignia & Seal -->
  <g transform="translate(600, 82)">
    <!-- Central Shield / Emblem -->
    <path d="M 0 -24 L 20 -10 L 16 16 L 0 26 L -16 16 L -20 -10 Z" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="2"/>
    <!-- Five-Point Star in Shield -->
    <polygon points="0,-14 4,-4 14,-4 6,2 9,12 0,6 -9,12 -6,2 -14,-4 -4,-4" fill="url(#goldGrad)"/>
    <!-- Flanking Laurel Wreaths -->
    <path d="M -26 0 C -34 -14 -50 -10 -54 2 C -50 16 -34 16 -24 6" fill="none" stroke="#d4af37" stroke-width="1.5"/>
    <path d="M 26 0 C 34 -14 50 -10 54 2 C 50 16 34 16 24 6" fill="none" stroke="#d4af37" stroke-width="1.5"/>
  </g>

  <!-- Header Block -->
  <g class="font-sans" text-anchor="middle">
    <text x="600" y="132" font-size="20" font-weight="800" letter-spacing="6" fill="url(#goldGrad)">VETERAN AI ENABLEMENT PLATFORM</text>
    <text x="600" y="152" font-size="11" font-weight="600" letter-spacing="3" fill="#94a3b8">STATE ETPL &amp; WIOA TITLE I WORKFORCE CREDENTIALING SYSTEM</text>
    <text x="600" y="184" font-size="26" font-weight="700" letter-spacing="3" fill="#ffffff" filter="url(#shadow)">CERTIFICATE OF PROFESSIONAL MASTERY</text>
    
    <line x1="450" y1="198" x2="750" y2="198" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <circle cx="600" cy="198" r="3" fill="#fef08a"/>
  </g>

  <!-- Recipient Block -->
  <g class="font-sans" text-anchor="middle">
    <text x="600" y="236" font-size="12" font-weight="500" letter-spacing="2.5" fill="#cbd5e1">THIS OFFICIAL CREDENTIAL IS CONFERRED UPON</text>
    
    <!-- Recipient Name -->
    <text x="600" y="294" font-size="44" font-weight="800" fill="#ffffff" filter="url(#shadow)">${name}</text>
    
    <!-- Military Branch Callout Badge -->
    <g transform="translate(0, 314)">
      <rect x="${pillX}" y="0" width="${pillWidth}" height="28" rx="14" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="${pillX + 16}" cy="14" r="3" fill="#f59e0b"/>
      <text x="600" y="18" font-size="11" font-weight="700" letter-spacing="2" fill="#fbbf24">${branchPillText}</text>
      <circle cx="${pillX + pillWidth - 16}" cy="14" r="3" fill="#f59e0b"/>
    </g>

    <text x="600" y="380" font-size="12" font-weight="500" letter-spacing="2" fill="#94a3b8">HAVING SATISFIED ALL AUDITED WORKFORCE CRITERIA AND DEMONSTRATED APPLIED CAPABILITY IN</text>
    <text x="600" y="416" font-size="22" font-weight="700" letter-spacing="1.5" fill="#38bdf8">${course}</text>
  </g>

  <!-- Credential Metrics Panel -->
  <g transform="translate(190, 446)">
    <!-- Glassmorphic / Slate Panel Container -->
    <rect x="0" y="0" width="820" height="96" rx="8" fill="#0b1322" fill-opacity="0.9" stroke="#334155" stroke-width="1.5"/>
    
    <!-- Metric 1: Verified Seat Time -->
    <g transform="translate(136, 28)" class="font-sans" text-anchor="middle">
      <text x="0" y="0" font-size="10" font-weight="600" letter-spacing="1.5" fill="#94a3b8">VERIFIED CONTACT HOURS</text>
      <text x="0" y="28" font-size="22" font-weight="800" fill="#10b981">${contactHours} HRS</text>
      <text x="0" y="46" font-size="9" font-weight="500" letter-spacing="1" fill="#6ee7b7">WIOA REQ MET (&#8805; 36.0h)</text>
    </g>

    <line x1="273" y1="16" x2="273" y2="80" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Metric 2: Capstone Final Score -->
    <g transform="translate(410, 28)" class="font-sans" text-anchor="middle">
      <text x="0" y="0" font-size="10" font-weight="600" letter-spacing="1.5" fill="#94a3b8">CAPSTONE LAB SCORE</text>
      <text x="0" y="28" font-size="22" font-weight="800" fill="#38bdf8">${capstoneScore}%</text>
      <text x="0" y="46" font-size="9" font-weight="500" letter-spacing="1" fill="#7dd3fc">MASTERY BENCHMARK (&#8805; 80.0%)</text>
    </g>

    <line x1="546" y1="16" x2="546" y2="80" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Metric 3: Title 38 Compliance -->
    <g transform="translate(683, 28)" class="font-sans" text-anchor="middle">
      <text x="0" y="0" font-size="10" font-weight="600" letter-spacing="1.5" fill="#94a3b8">STATUTORY STANDARD</text>
      <text x="0" y="28" font-size="20" font-weight="800" fill="#fbbf24">TITLE 38 SAFE HARBOR</text>
      <text x="0" y="46" font-size="9" font-weight="500" letter-spacing="1" fill="#fde68a">&#167;&#167; 5901&#8211;5905 COMPLIANT</text>
    </g>
  </g>

  <!-- Signatures & Official Authentication Seal -->
  <g transform="translate(0, 580)">
    <!-- Left Signature: Academic Standards -->
    <g transform="translate(230, 0)">
      <!-- Stylized Signature Script -->
      <path d="M 0 26 C 24 14 36 34 55 18 C 72 4 84 32 108 20 C 130 10 148 24 175 16" fill="none" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round"/>
      <line x1="-15" y1="36" x2="195" y2="36" stroke="#475569" stroke-width="1"/>
      <text x="90" y="52" class="font-sans" font-size="12" font-weight="700" fill="#f8fafc" text-anchor="middle">Dr. Marcus Vance, Ph.D.</text>
      <text x="90" y="66" class="font-sans" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle">Director of Academic Standards</text>
      <text x="90" y="78" class="font-sans" font-size="9" font-weight="400" fill="#64748b" text-anchor="middle">Veteran AI Enablement Platform</text>
    </g>

    <!-- Center Gold Embossed Seal -->
    <g transform="translate(600, 32)">
      <!-- Outer Starburst/Rays -->
      <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="2"/>
      <circle cx="0" cy="0" r="37" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="3,2"/>
      <circle cx="0" cy="0" r="32" fill="#090d16"/>
      <polygon points="0,-16 4,-5 15,-5 7,2 10,13 0,7 -10,13 -7,2 -15,-5 -4,-5" fill="url(#goldGrad)"/>
      <text x="0" y="24" class="font-sans" font-size="7" font-weight="700" letter-spacing="1" fill="#fef08a" text-anchor="middle">VAAI VERIFIED</text>
    </g>

    <!-- Right Signature: State Validator -->
    <g transform="translate(790, 0)">
      <!-- Stylized Signature Script -->
      <path d="M 0 20 C 28 32 40 8 68 22 C 92 34 110 14 138 24 C 158 30 170 12 188 18" fill="none" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round"/>
      <line x1="-15" y1="36" x2="195" y2="36" stroke="#475569" stroke-width="1"/>
      <text x="90" y="52" class="font-sans" font-size="12" font-weight="700" fill="#f8fafc" text-anchor="middle">Col. Evelyn Reed (Ret.)</text>
      <text x="90" y="66" class="font-sans" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle">State Workforce Credential Validator</text>
      <text x="90" y="78" class="font-sans" font-size="9" font-weight="400" fill="#64748b" text-anchor="middle">ETPL Standards Oversight Board</text>
    </g>
  </g>

  <!-- Bottom Verification Footer & Monospace Audit String -->
  <g transform="translate(0, 715)">
    <rect x="48" y="0" width="1104" height="34" rx="4" fill="#020617" fill-opacity="0.95" stroke="#1e293b" stroke-width="1"/>
    
    <g class="font-mono" font-size="10" fill="#94a3b8">
      <text x="68" y="21" text-anchor="start">
        <tspan fill="#d4af37" font-weight="700">AUDIT ID:</tspan> <tspan fill="#f1f5f9">${uuid}</tspan>
        <tspan fill="#475569"> &#9474; </tspan>
        <tspan fill="#d4af37" font-weight="700">AUTHENTICATED:</tspan> <tspan fill="#f1f5f9">${displayDate}</tspan>
        <tspan fill="#475569"> &#9474; </tspan>
        <tspan fill="#d4af37" font-weight="700">VERIFY:</tspan> <tspan fill="#38bdf8">${verificationUrl}</tspan>
      </text>
      <text x="1132" y="21" text-anchor="end" fill="#10b981" font-weight="600">&#10003; CRYPTOGRAPHICALLY AUDITED</text>
    </g>
  </g>
</svg>`;
}
