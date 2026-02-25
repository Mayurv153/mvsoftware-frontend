'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, MessageCircle, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || 'Payment successful';
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hi!%20I%20just%20completed%20my%20payment.%20Looking%20forward%20to%20getting%20started!`;

    return (
        <section className="min-h-[80vh] flex items-center justify-center py-20">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-lg mx-auto text-center"
                >
                    {/* Success Icon */}
                    <div className="relative mx-auto mb-8 w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
                            <CheckCircle2 size={48} className="text-green-400" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        Payment <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Successful!</span>
                    </h1>
                    <p className="text-surface-400 mb-8">{message}</p>

                    {/* Contact Within 1 Hour Card */}
                    <div className="bg-surface-900/80 border border-surface-700 rounded-2xl p-6 mb-8 text-left">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-brand-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">We&apos;re on it!</h3>
                                <p className="text-surface-400 text-sm">
                                    Our team will <strong className="text-brand-400">contact you within 1 hour</strong> to discuss your project requirements and next steps.
                                </p>
                            </div>
                        </div>

                        <div className="bg-surface-800/60 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="text-green-400 text-xs font-bold">1</span>
                                </div>
                                <p className="text-sm text-surface-300">Payment received & confirmed ✅</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
                                    <span className="text-brand-400 text-xs font-bold">2</span>
                                </div>
                                <p className="text-sm text-surface-300">Team reviews your project requirements</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center">
                                    <span className="text-surface-400 text-xs font-bold">3</span>
                                </div>
                                <p className="text-sm text-surface-400">We call/email you within 1 hour</p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Email Notice */}
                    <p className="text-sm text-surface-400 mb-6">
                        📧 A confirmation email has been sent to your registered email address.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm font-semibold transition-colors"
                        >
                            <MessageCircle size={16} />
                            Chat on WhatsApp
                        </a>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-surface-700 text-surface-300 hover:text-white hover:border-surface-500 rounded-full text-sm font-medium transition-colors"
                        >
                            <Home size={16} />
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
