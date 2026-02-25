'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Rocket, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const rawNext = searchParams.get('next') || '/';
    const nextPath = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

    const passwordStrength = (() => {
        const p = form.password;
        if (!p) return { level: 0, label: '', color: '' };
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
        if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
        return { level: 3, label: 'Strong', color: 'bg-green-500' };
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: { full_name: form.name },
                },
            });

            if (authError) throw authError;

            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Server-side admin check — no email exposed in client
                try {
                    const res = await fetch('/api/check-admin', {
                        cache: 'no-store',
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    });
                    const adminData = await res.json();
                    if (adminData.isAdmin) {
                        router.push('/admin/dashboard');
                        return;
                    }
                } catch { }
                router.push(nextPath);
            } else {
                // Email confirmation is ON — redirect to confirm page
                router.push(`/signup/confirm?email=${encodeURIComponent(form.email)}`);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignup = async (provider) => {
        setOauthLoading(provider);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
                },
            });

            if (authError) throw authError;
        } catch (err) {
            setError(err.message || `Failed to sign up with ${provider}`);
            setOauthLoading('');
        }
    };

    return (
        <section className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden bg-surface-950">
            {/* Background effects */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none opacity-15"
                style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.2) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)' }} />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-32 right-16 w-2 h-2 bg-accent-400/40 rounded-full pointer-events-none"
                animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-24 left-12 w-3 h-3 bg-brand-400/30 rounded-full pointer-events-none"
                animate={{ y: [0, 20, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />

            <div className="section-container relative z-10 w-full max-w-[440px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <Card className="card-glow p-8 sm:p-10 border-surface-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-surface-900/60 backdrop-blur-2xl">
                        <CardContent className="p-0">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className="w-16 h-16 icon-liquid-glass mx-auto mb-5"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <Rocket size={26} className="text-accent-400 relative z-10" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-white mb-1.5">Create Account</h1>
                                <p className="text-surface-400 text-sm">Join MV Webservice — it&apos;s free to get started</p>
                            </div>

                            {/* OAuth buttons */}
                            <div className="space-y-3 mb-6">
                                <Button
                                    variant="outline"
                                    className="oauth-glow w-full h-12 gap-3 bg-surface-800/60 border-surface-700/60 text-surface-200 hover:bg-surface-800 hover:border-surface-600 hover:text-white transition-all duration-300"
                                    onClick={() => handleOAuthSignup('google')}
                                    disabled={!!oauthLoading}
                                >
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>{oauthLoading === 'google' ? 'Connecting...' : 'Sign up with Google'}</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="oauth-glow w-full h-12 gap-3 bg-surface-800/60 border-surface-700/60 text-surface-200 hover:bg-surface-800 hover:border-surface-600 hover:text-white transition-all duration-300"
                                    onClick={() => handleOAuthSignup('azure')}
                                    disabled={!!oauthLoading}
                                >
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23">
                                        <path fill="#f35325" d="M1 1h10v10H1z" />
                                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                                    </svg>
                                    <span>{oauthLoading === 'azure' ? 'Connecting...' : 'Sign up with Microsoft'}</span>
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <Separator className="separator-gradient" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="px-3 bg-surface-900/60 text-surface-500 text-xs uppercase tracking-widest font-medium">or</span>
                                </div>
                            </div>

                            {/* Email form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-surface-300 ml-1">Full Name</Label>
                                    <div className="relative input-glow rounded-md">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500">
                                            <User size={17} />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="h-12 pl-11 bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-surface-300 ml-1">Email Address</Label>
                                    <div className="relative input-glow rounded-md">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500">
                                            <Mail size={17} />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="h-12 pl-11 bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-surface-300 ml-1">Password</Label>
                                    <div className="relative input-glow rounded-md">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500">
                                            <ShieldCheck size={17} />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            minLength={6}
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            placeholder="Min 6 characters"
                                            className="h-12 pl-11 pr-11 bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                    {/* Password strength indicator */}
                                    {form.password && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center gap-2 mt-2 ml-1"
                                        >
                                            <div className="flex gap-1 flex-1">
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.level
                                                            ? passwordStrength.color
                                                            : 'bg-surface-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-xs font-medium ${passwordStrength.level === 1 ? 'text-red-400' :
                                                passwordStrength.level === 2 ? 'text-yellow-400' :
                                                    'text-green-400'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                                            <AlertDescription className="flex items-start gap-2.5">
                                                <span className="mt-0.5 shrink-0">⚠️</span>
                                                <span>{error}</span>
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold tracking-wide uppercase btn-glow btn-shine mt-2"
                                    size="lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <>
                                            Get Started Free
                                            <ArrowRight size={17} />
                                        </>
                                    )}
                                </Button>

                                {/* Terms */}
                                <p className="text-surface-500 text-xs text-center leading-relaxed">
                                    By signing up, you agree to our{' '}
                                    <Link href="/terms" className="text-surface-400 hover:text-surface-300 underline underline-offset-2 transition-colors">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-surface-400 hover:text-surface-300 underline underline-offset-2 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-surface-800/60 text-center">
                                <p className="text-surface-400 text-sm">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-accent-400 font-semibold hover:text-accent-300 transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Features strip */}
                <motion.div
                    className="flex items-center justify-center gap-6 mt-6 text-surface-600 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Free to start</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> No credit card</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Cancel anytime</span>
                </motion.div>
            </div>
        </section>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}
