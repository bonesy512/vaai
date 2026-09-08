/**
 * Automated verification harness for:
 * 1. Auth helper layer (lib/auth/)
 * 2. Landing page structure (app/(public)/page.tsx)
 * 3. Login/Register routes
 * 4. Admin dashboard routes
 * 5. Lesson content data registry
 * 6. Lesson progression route
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

function fileExists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

function fileContains(relPath: string, needle: string): boolean {
  if (!existsSync(resolve(ROOT, relPath))) return false;
  const content = readFileSync(resolve(ROOT, relPath), 'utf-8');
  return content.includes(needle);
}

// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  VAAI Auth & Admin Verification Suite');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── 1. Database Migration ──────────────────────────────────────────────────
console.log('── 1. Database Migration ──');
assert(fileExists('supabase/migrations/20260908010000_user_profiles_and_roles.sql'), 'Migration file exists');
assert(fileContains('supabase/migrations/20260908010000_user_profiles_and_roles.sql', 'military_branch'), 'Migration includes military_branch column');
assert(fileContains('supabase/migrations/20260908010000_user_profiles_and_roles.sql', 'profiles_select_own'), 'Migration includes RLS policy profiles_select_own');
assert(fileContains('supabase/migrations/20260908010000_user_profiles_and_roles.sql', 'handle_new_user'), 'Migration includes auto-profile trigger');

// ── 2. Auth Helper Layer ──────────────────────────────────────────────────
console.log('\n── 2. Auth Helper Layer ──');
assert(fileExists('lib/auth/types.ts'), 'lib/auth/types.ts exists');
assert(fileContains('lib/auth/types.ts', 'UserRole'), 'Types export UserRole');
assert(fileContains('lib/auth/types.ts', 'MilitaryBranch'), 'Types export MilitaryBranch');
assert(fileContains('lib/auth/types.ts', 'ClearanceLevel'), 'Types export ClearanceLevel');
assert(fileContains('lib/auth/types.ts', 'SignUpVeteranInput'), 'Types export SignUpVeteranInput');

assert(fileExists('lib/auth/client.ts'), 'lib/auth/client.ts exists');
assert(fileContains('lib/auth/client.ts', 'signUpVeteran'), 'Client exports signUpVeteran');
assert(fileContains('lib/auth/client.ts', 'signIn'), 'Client exports signIn');
assert(fileContains('lib/auth/client.ts', 'signOut'), 'Client exports signOut');
assert(fileContains('lib/auth/client.ts', 'getCurrentProfile'), 'Client exports getCurrentProfile');

assert(fileExists('lib/auth/server.ts'), 'lib/auth/server.ts exists');
assert(fileContains('lib/auth/server.ts', 'getServerUserProfile'), 'Server exports getServerUserProfile');
assert(fileContains('lib/auth/server.ts', 'isServerAdmin'), 'Server exports isServerAdmin');
assert(fileContains('lib/auth/server.ts', 'requireAdminRole'), 'Server exports requireAdminRole');

assert(fileExists('lib/auth/middleware-gate.ts'), 'lib/auth/middleware-gate.ts exists');
assert(fileContains('lib/auth/middleware-gate.ts', 'PROTECTED_ROUTE_RULES'), 'Middleware-gate exports PROTECTED_ROUTE_RULES');

// ── 3. Landing Page ─────────────────────────────────────────────────────
console.log('\n── 3. Landing Page ──');
assert(fileExists('app/(public)/page.tsx'), 'app/(public)/page.tsx exists');
assert(!fileExists('app/page.tsx'), 'app/page.tsx removed (no route collision)');
assert(fileContains('app/(public)/page.tsx', '110 / 110 SPRS'), 'Landing has 110/110 SPRS badge');
assert(fileContains('app/(public)/page.tsx', 'TWC-ETPL-78752-VAAI'), 'Landing has ETPL provider code');
assert(fileContains('app/(public)/page.tsx', 'OpenBadges v3.0'), 'Landing has OpenBadges v3.0 badge');
assert(fileContains('app/(public)/page.tsx', '220 Hours / 5 Courses'), 'Landing has Engineering Track (220h)');
assert(fileContains('app/(public)/page.tsx', '130 Hours / 3 Courses'), 'Landing has Security Track (130h)');
assert(fileContains('app/(public)/page.tsx', '75 Hours / 2 Courses'), 'Landing has Operations Track (75h)');
assert(fileContains('app/(public)/page.tsx', '94.2%'), 'Landing has 94.2% placement rate');
assert(fileContains('app/(public)/page.tsx', '$88k-$115k'), 'Landing has salary range');
assert(fileContains('app/(public)/page.tsx', 'Booz Allen Hamilton'), 'Landing has Booz Allen partner');
assert(fileContains('app/(public)/page.tsx', 'Lockheed Martin'), 'Landing has Lockheed Martin partner');
assert(fileContains('app/(public)/page.tsx', 'CACI International'), 'Landing has CACI partner');

// ── 4. Auth Routes ─────────────────────────────────────────────────────
console.log('\n── 4. Auth Routes ──');
assert(fileExists('app/(public)/(auth)/register/page.tsx'), '/register page exists');
assert(fileContains('app/(public)/(auth)/register/page.tsx', 'signUpVeteran'), 'Register uses signUpVeteran');
assert(fileContains('app/(public)/(auth)/register/page.tsx', 'militaryBranch'), 'Register has militaryBranch field');
assert(fileContains('app/(public)/(auth)/register/page.tsx', 'clearanceLevel'), 'Register has clearanceLevel field');
assert(fileContains('app/(public)/(auth)/register/page.tsx', 'targetTrack'), 'Register has targetTrack field');

assert(fileExists('app/(public)/(auth)/login/page.tsx'), '/login page exists');
assert(fileContains('app/(public)/(auth)/login/page.tsx', 'signIn'), 'Login uses signIn');
assert(fileContains('app/(public)/(auth)/login/page.tsx', "role === 'admin'"), 'Login has admin role detection');
assert(fileContains('app/(public)/(auth)/login/page.tsx', '/courses'), 'Login redirects students to /courses');

// ── 5. Admin Dashboard ─────────────────────────────────────────────────
console.log('\n── 5. Admin Dashboard ──');
assert(fileExists('app/(admin)/admin/layout.tsx'), 'Admin layout exists');
assert(fileContains('app/(admin)/admin/layout.tsx', 'getServerUserProfile'), 'Admin layout uses server auth');
assert(fileContains('app/(admin)/admin/layout.tsx', 'admin_required'), 'Admin layout redirects unauthorized');

assert(fileExists('app/(admin)/admin/page.tsx'), 'Admin HUD page exists');
assert(fileContains('app/(admin)/admin/page.tsx', 'State Workforce Telemetry HUD'), 'HUD has telemetry title');
assert(fileContains('app/(admin)/admin/page.tsx', 'WIOA Audit Queue'), 'HUD has WIOA Audit Queue');
assert(fileContains('app/(admin)/admin/page.tsx', 'Active Enrolled Veterans'), 'HUD has enrollment metric');

assert(fileExists('app/(admin)/admin/courses/page.tsx'), 'Admin courses page exists');
assert(fileContains('app/(admin)/admin/courses/page.tsx', 'INSTITUTIONAL_COURSES'), 'Courses page imports course data');

assert(fileExists('app/(admin)/admin/cohorts/page.tsx'), 'Admin cohorts page exists');
assert(fileContains('app/(admin)/admin/cohorts/page.tsx', 'exportPirlCsv'), 'Cohorts page has PIRL CSV export');
assert(fileContains('app/(admin)/admin/cohorts/page.tsx', 'PIRL_Element_100'), 'PIRL export has standard field headers');

// ── 6. Lesson Content Data ─────────────────────────────────────────────
console.log('\n── 6. Lesson Content Data ──');
assert(fileExists('lib/lesson-content-data.ts'), 'lib/lesson-content-data.ts exists');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-101'), 'Contains VAAI-101 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-201'), 'Contains VAAI-201 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-202'), 'Contains VAAI-202 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-203'), 'Contains VAAI-203 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-301'), 'Contains VAAI-301 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-302'), 'Contains VAAI-302 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-303'), 'Contains VAAI-303 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-401'), 'Contains VAAI-401 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-402'), 'Contains VAAI-402 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'VAAI-403'), 'Contains VAAI-403 lessons');
assert(fileContains('lib/lesson-content-data.ts', 'getLessonContent'), 'Exports getLessonContent');
assert(fileContains('lib/lesson-content-data.ts', 'getCourseModules'), 'Exports getCourseModules');

// ── 7. Lesson Progression Route ─────────────────────────────────────────
console.log('\n── 7. Lesson Progression Route ──');
assert(fileExists('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/page.tsx'), 'Lesson progression page exists');
assert(fileContains('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/page.tsx', 'getLessonContent'), 'Page uses getLessonContent');
assert(fileExists('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/LessonProgressionClient.tsx'), 'LessonProgressionClient exists');
assert(fileContains('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/LessonProgressionClient.tsx', 'MonacoEditor'), 'Client uses Monaco Editor');
assert(fileContains('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/LessonProgressionClient.tsx', 'SeatTrackerWidget'), 'Client uses SeatTrackerWidget');
assert(fileContains('app/(dashboard)/courses/[courseId]/[moduleId]/[lessonId]/LessonProgressionClient.tsx', 'ZERO-EGRESS'), 'Client labels WASM as zero-egress');

// ═══════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed / ${failed} failed / ${passed + failed} total`);
console.log('═══════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
}
