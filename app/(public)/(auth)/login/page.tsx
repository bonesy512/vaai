'use client';

import * as React from 'react';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn, getCurrentProfile } from '@/lib/auth/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTarget = searchParams.get('redirect');
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'admin_required'
      ? 'Administrator privileges required to access this resource.'
      : errorParam === 'auth_required'
      ? 'Please sign in to access your course modules.'
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await signIn({
        email,
        password: isMagicLink ? undefined : password,
        isMagicLink,
      });

      if (res.isMagicLink) {
        setSuccessMessage('Magic Link sent! Please check your email inbox to log in.');
      } else {
        // Multi-tenant role detection: redirect admin to /admin, student to /courses
        const profile = await getCurrentProfile();
        setSuccessMessage('Authentication successful! Routing to dashboard...');

        setTimeout(() => {
          if (redirectTarget) {
            router.push(decodeURIComponent(redirectTarget));
          } else if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/courses');
          }
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <CardTitle className="text-base font-semibold text-white">
          Accredited Identity Access
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Sign in via DoD Common Access / Passkey or Supabase Secure Token.
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
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="veteran@defense.gov or user@domain.com"
                className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Magic Link Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
            <span className="text-xs text-slate-300 font-medium">Sign in with Magic Link</span>
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

          {/* Password */}
          {!isMagicLink && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300" htmlFor="password">
                  Account Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  required={!isMagicLink}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-9 focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating Session...
                </>
              ) : (
                <>
                  Authenticate Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          New transitioning service member?{' '}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold">
            Create Veteran Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xl">
            V
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">VAAI Defense Academy</span>
        </div>

        <div className="text-center space-y-1.5">
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-xs">
            SECURE LMS ACCESS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sign In to Learning Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your 425-hour accredited curriculum, labs, and telemetry audit records.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center text-slate-500 text-xs py-8">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>NIST SP 800-171 Rev. 3 AC-2 &amp; AC-3 Multi-Factor Capable</span>
        </div>
      </div>
    </div>
  );
}
