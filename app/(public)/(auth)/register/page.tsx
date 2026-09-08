'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUpVeteran } from '@/lib/auth/client';
import type { MilitaryBranch, ClearanceLevel, TargetTrack } from '@/lib/auth/types';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [militaryBranch, setMilitaryBranch] = useState<MilitaryBranch>('Army');
  const [militaryMos, setMilitaryMos] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<ClearanceLevel>('Secret');
  const [targetTrack, setTargetTrack] = useState<TargetTrack>('engineering');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await signUpVeteran({
        fullName,
        email,
        password: isMagicLink ? undefined : password,
        isMagicLink,
        militaryBranch,
        militaryMos: militaryMos.trim() || 'General Service',
        clearanceLevel,
        targetTrack,
      });

      if (isMagicLink) {
        setSuccessMessage('Magic Link sent! Please check your email inbox to activate your account.');
      } else {
        setSuccessMessage('Account created successfully! Redirecting to student dashboard...');
        setTimeout(() => {
          router.push('/courses');
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete registration. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center items-center space-x-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xl">
            V
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">VAAI Defense Academy</span>
        </div>

        <div className="text-center space-y-1.5">
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-xs">
            WIOA TITLE I ACCREDITED VETERAN ONBOARDING
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Your Veteran Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Verify military service alignment and unlock 100% tuition funding eligibility.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-base font-semibold text-white">
              Institutional Veteran Registration
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Compliant with NIST SP 800-171 Rev. 3 AC-2 &amp; AC-3 role-based access management.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="fullName">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Alex Mercer"
                    className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
                  Military / Civilian Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="veteran@defense.gov or name@domain.com"
                    className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Auth Mode Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-xs text-slate-300 font-medium">Use Passwordless Magic Link</span>
                <button
                  type="button"
                  onClick={() => setIsMagicLink(!isMagicLink)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isMagicLink ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                      isMagicLink ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Password (if not magic link) */}
              {!isMagicLink && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="password">
                    Account Password (minimum 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      required={!isMagicLink}
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Veteran Profiling Section */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-mono font-semibold uppercase text-amber-400">
                  U.S. Military Service Profiling
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Branch of Service */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="branch">
                      Branch of Service
                    </label>
                    <select
                      id="branch"
                      value={militaryBranch}
                      onChange={(e) => setMilitaryBranch(e.target.value as MilitaryBranch)}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-md h-9 px-3 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Army">U.S. Army</option>
                      <option value="Navy">U.S. Navy</option>
                      <option value="Air Force">U.S. Air Force</option>
                      <option value="Marine Corps">U.S. Marine Corps</option>
                      <option value="Coast Guard">U.S. Coast Guard</option>
                      <option value="Space Force">U.S. Space Force</option>
                      <option value="Other">Other / National Guard</option>
                    </select>
                  </div>

                  {/* Primary MOS/AFSC/Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="mos">
                      Primary MOS / AFSC / Rating
                    </label>
                    <Input
                      id="mos"
                      type="text"
                      value={militaryMos}
                      onChange={(e) => setMilitaryMos(e.target.value)}
                      placeholder="e.g. 25B, 1D7X1, IT/IS, 0671, 11B"
                      className="bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Security Clearance */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="clearance">
                      Highest Security Clearance
                    </label>
                    <select
                      id="clearance"
                      value={clearanceLevel}
                      onChange={(e) => setClearanceLevel(e.target.value as ClearanceLevel)}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-md h-9 px-3 focus:outline-none focus:border-amber-500"
                    >
                      <option value="None">None / Civilian</option>
                      <option value="Secret">Secret (Active / Interim)</option>
                      <option value="TS/SCI">Top Secret / SCI</option>
                      <option value="Public Trust">Public Trust / DoD CAC</option>
                    </select>
                  </div>

                  {/* Target Track */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="track">
                      Intended Learning Track
                    </label>
                    <select
                      id="track"
                      value={targetTrack}
                      onChange={(e) => setTargetTrack(e.target.value as TargetTrack)}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-md h-9 px-3 focus:outline-none focus:border-amber-500"
                    >
                      <option value="engineering">AI &amp; Software Engineering (220h)</option>
                      <option value="security">Cyber Defense &amp; GovSec (130h)</option>
                      <option value="operations">Defense Logistics &amp; Operations (75h)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 shadow-lg shadow-amber-500/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Provisioning Accredited Account...
                    </>
                  ) : (
                    <>
                      Complete Veteran Registration
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                Sign in to LMS
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security / Compliance Notice */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>NIST SP 800-171 Rev. 3 AC-2 / AC-3 Access Control &amp; RLS Enforced</span>
        </div>
      </div>
    </div>
  );
}
