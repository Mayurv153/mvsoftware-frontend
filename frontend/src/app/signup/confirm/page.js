'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState('');

    const handleResend = async () => {
        if (!email) return;
        setResending(true);
        setResendMsg('');
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });
            if (error) throw error;
            setResendMsg('Confirmation email resent! Check your inbox.');
        } catch (err) {
            setResendMsg(err.message || 'Failed to resend. Try again later.');
        } finally {
            setResending(false);
        }
    };

    return (
        <section className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden bg-surface-950">
            {/* Background effects */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none opacity-15"
                style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.2) 0%, transparent 70%)' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
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

            <div className="section-container relative z-10 w-full max-w-[480px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <Card className="border-surface-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-surface-900/60 backdrop-blur-2xl">
                        <CardContent className="p-8 sm:p-10 text-center">
                            {/* Animated mail icon */}
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/30 flex items-center justify-center"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                            >
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Mail size={36} className="text-brand-400" />
                                </motion.div>
                            </motion.div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                Check Your Email
                            </h1>

                            <p className="text-surface-400 text-sm leading-relaxed mb-2">
                                We&apos;ve sent a confirmation link to
                            </p>

                            {email && (
                                <motion.p
                                    className="text-brand-400 font-semibold text-base mb-6 break-all"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {email}
                                </motion.p>
                            )}

                            {!email && <div className="mb-6" />}

                            {/* Steps */}
                            <div className="space-y-3 text-left mb-8">
                                {[
                                    { step: '1', text: 'Open your email inbox' },
                                    { step: '2', text: 'Click the confirmation link we sent you' },
                                    { step: '3', text: 'You\'ll be redirected to the website automatically' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.step}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/40 border border-surface-700/40"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.15 }}
                                    >
                                        <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {item.step}
                                        </span>
                                        <span className="text-surface-300 text-sm">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Resend button */}
                            {email && (
                                <div className="mb-6">
                                    <Button
                                        variant="ghost"
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="text-sm text-surface-400 hover:text-brand-400 hover:bg-transparent"
                                    >
                                        <RefreshCw size={14} className={resending ? 'animate-spin mr-2' : 'mr-2'} />
                                        {resending ? 'Resending...' : 'Didn\'t receive the email? Resend'}
                                    </Button>
                                    {resendMsg && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <Alert className="mt-2 bg-brand-500/10 border-brand-500/30">
                                                <AlertDescription className="text-xs text-brand-400">{resendMsg}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Tip */}
                            <Alert className="mb-6 bg-surface-800/30 border-surface-700/30">
                                <AlertDescription className="text-surface-500 text-xs leading-relaxed">
                                    <span className="text-surface-400 font-medium">💡 Tip:</span> If you don&apos;t see the email, check your spam or junk folder.
                                </AlertDescription>
                            </Alert>

                            {/* Back to login */}
                            <Separator className="bg-surface-800/60 mb-4" />
                            <div className="pt-2">
                                <Link
                                    href="/login"
                                    className="text-sm text-surface-400 hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <ArrowRight size={14} className="rotate-180" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default function ConfirmEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ConfirmEmailContent />
        </Suspense>
    );
}
