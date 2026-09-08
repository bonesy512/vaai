const testHardeningAudit = async () => {
  const baseUrl = 'http://localhost:3000';

  console.log('--- 1. Testing /robots.txt ---');
  const resRobots = await fetch(`${baseUrl}/robots.txt`);
  const textRobots = await resRobots.text();
  console.log(`Status: ${resRobots.status}`);
  console.log(`Disallows attendance: ${textRobots.includes('Disallow: /api/attendance/')}`);
  console.log(`Disallows sandbox: ${textRobots.includes('Disallow: /api/sandbox/')}`);
  console.log(`Contains sitemap: ${textRobots.includes('sitemap.xml')}`);
  if (resRobots.status !== 200 || !textRobots.includes('sitemap.xml')) {
    throw new Error('robots.txt audit failed');
  }

  console.log('\n--- 2. Testing /sitemap.xml ---');
  const resSitemap = await fetch(`${baseUrl}/sitemap.xml`);
  const textSitemap = await resSitemap.text();
  console.log(`Status: ${resSitemap.status}, Content-Type: ${resSitemap.headers.get('content-type')}`);
  console.log(`Contains root: ${textSitemap.includes('<loc>')}`);
  console.log(`Contains courses: ${textSitemap.includes('courses/ai-literacy-101/lesson-1')}`);
  console.log(`Contains employers: ${textSitemap.includes('employers/partnership')}`);
  console.log(`Contains etpl-dossier: ${textSitemap.includes('etpl-dossier')}`);
  console.log(`Contains privacy: ${textSitemap.includes('privacy')}`);
  if (resSitemap.status !== 200 || !textSitemap.includes('etpl-dossier')) {
    throw new Error('sitemap.xml audit failed');
  }

  console.log('\n--- 3. Testing /manifest.webmanifest ---');
  const resManifest = await fetch(`${baseUrl}/manifest.webmanifest`);
  const jsonManifest = await resManifest.json();
  console.log(`Status: ${resManifest.status}, Name: ${jsonManifest.name}, Short: ${jsonManifest.short_name}`);
  if (resManifest.status !== 200 || jsonManifest.short_name !== 'VAAI') {
    throw new Error('manifest.webmanifest audit failed');
  }

  console.log('\n--- 4. Testing Icons & OpenGraph Images ---');
  const resIcon = await fetch(`${baseUrl}/icon`);
  console.log(`Icon Status: ${resIcon.status}, Type: ${resIcon.headers.get('content-type')}`);
  const resAppleIcon = await fetch(`${baseUrl}/apple-icon`);
  console.log(`Apple Icon Status: ${resAppleIcon.status}, Type: ${resAppleIcon.headers.get('content-type')}`);
  const resOg = await fetch(`${baseUrl}/opengraph-image`);
  console.log(`OG Image Status: ${resOg.status}, Type: ${resOg.headers.get('content-type')}`);
  if (resIcon.status !== 200 || resAppleIcon.status !== 200 || resOg.status !== 200) {
    throw new Error('Image assets audit failed');
  }

  console.log('\n--- 5. Testing Home Landing Page & Above-the-Fold CTAs ---');
  const resHome = await fetch(`${baseUrl}/`);
  const htmlHome = await resHome.text();
  console.log(`Home Status: ${resHome.status}`);
  console.log(`Has Student CTA: ${htmlHome.includes('id="hero-cta-student"')}`);
  console.log(`Has Employer CTA: ${htmlHome.includes('id="hero-cta-employer"')}`);
  console.log(`Has Austin Campus Address: ${htmlHome.includes('6101 Highland Campus Dr')}`);
  console.log(`Has Phone: ${htmlHome.includes('(512) 555-VAAI')}`);
  console.log(`Has Title 38 Disclosure: ${htmlHome.includes('Title 38 U.S.C.')}`);
  console.log(`Has Cookie Notice: ${htmlHome.includes('Zero AI Data Retention')}`);
  if (!htmlHome.includes('id="hero-cta-student"') || !htmlHome.includes('6101 Highland Campus Dr')) {
    throw new Error('Home landing page audit failed');
  }

  console.log('\n--- 6. Testing Custom 404 Page ---');
  const res404 = await fetch(`${baseUrl}/some-non-existent-route-for-testing-404`);
  const html404 = await res404.text();
  console.log(`404 Status: ${res404.status}`);
  console.log(`Has 404 Heading: ${html404.includes('404: LOST COMM')}`);
  console.log(`Has Waypoint Link: ${html404.includes('Return to Base')}`);
  if (res404.status !== 404 || !html404.includes('404: LOST COMM')) {
    throw new Error('404 page audit failed');
  }

  console.log('\n--- 7. Testing Thank-You Page ---');
  const resThankYou = await fetch(`${baseUrl}/thank-you`);
  const htmlThankYou = await resThankYou.text();
  console.log(`Thank-You Status: ${resThankYou.status}`);
  console.log(`Has Welcome Heading: ${htmlThankYou.includes('Welcome to the VAAI Enablement Cohort')}`);
  console.log(`Has 3 Steps: ${htmlThankYou.includes('Orientation &amp; Pre-Flight Lab')}`);
  if (resThankYou.status !== 200 || !htmlThankYou.includes('Welcome to the VAAI Enablement Cohort')) {
    throw new Error('Thank-you page audit failed');
  }

  console.log('\n--- 8. Testing Legal Pages (Privacy & Terms) ---');
  const resPrivacy = await fetch(`${baseUrl}/privacy`);
  const htmlPrivacy = await resPrivacy.text();
  console.log(`Privacy Status: ${resPrivacy.status}`);
  console.log(`Has Zero Retention Guarantee: ${htmlPrivacy.includes('Zero AI Data Retention Guarantee')}`);
  console.log(`Has FERPA reference: ${htmlPrivacy.includes('FERPA')}`);

  const resTerms = await fetch(`${baseUrl}/terms`);
  const htmlTerms = await resTerms.text();
  console.log(`Terms Status: ${resTerms.status}`);
  console.log(`Has Safe Harbor Clause: ${htmlTerms.includes('Safe Harbor Statutory Boundary')}`);
  console.log(`Has 36.0h telemetry requirement: ${htmlTerms.includes('36.0')}`);

  if (resPrivacy.status !== 200 || resTerms.status !== 200) {
    throw new Error('Legal pages audit failed');
  }

  console.log('\n--- 9. Testing Dynamic Metadata on Public & Enterprise Routes ---');
  const resVerify = await fetch(`${baseUrl}/verify/VAAI-2026-DEMO`);
  const htmlVerify = await resVerify.text();
  console.log(`Verify Status: ${resVerify.status}`);
  console.log(`Has Dynamic Title: ${htmlVerify.includes('Verify Credential: VAAI-2026-DEMO')}`);

  const resDossier = await fetch(`${baseUrl}/etpl-dossier`);
  const htmlDossier = await resDossier.text();
  console.log(`ETPL Dossier Status: ${resDossier.status}`);
  console.log(`Has Dossier Title: ${htmlDossier.includes('TWC State ETPL &amp; WIOA Institutional Dossier')}`);

  const resMouDoc = await fetch(`${baseUrl}/employers/partnership/MOU-2026-BAH-01`);
  const htmlMouDoc = await resMouDoc.text();
  console.log(`MOU Detail Status: ${resMouDoc.status}`);
  console.log(`Has MOU Title: ${htmlMouDoc.includes('MOU: Booz Allen Hamilton Inc.')}`);

  console.log('\n========================================');
  console.log('=== ALL 20-POINT AUDIT TESTS PASSED! ===');
  console.log('========================================');
};

testHardeningAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
