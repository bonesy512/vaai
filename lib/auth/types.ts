export type UserRole = 'student' | 'employer' | 'admin';

export type MilitaryBranch =
  | 'Army'
  | 'Navy'
  | 'Air Force'
  | 'Marine Corps'
  | 'Coast Guard'
  | 'Space Force'
  | 'Other';

export type ClearanceLevel = 'None' | 'Secret' | 'TS/SCI' | 'Public Trust';

export type TargetTrack = 'engineering' | 'security' | 'operations';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  military_branch?: MilitaryBranch | null;
  military_mos?: string | null;
  clearance_level?: ClearanceLevel | null;
  target_track?: TargetTrack | null;
  created_at?: string;
  updated_at?: string;
}

export interface SignUpVeteranInput {
  email: string;
  password?: string;
  fullName: string;
  militaryBranch: MilitaryBranch;
  militaryMos: string;
  clearanceLevel: ClearanceLevel;
  targetTrack: TargetTrack;
  isMagicLink?: boolean;
}

export interface SignInInput {
  email: string;
  password?: string;
  isMagicLink?: boolean;
}
