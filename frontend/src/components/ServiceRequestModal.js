'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { submitServiceRequest } from '@/lib/api';

const SERVICE_TYPES = [
    { value: '', label: 'Select a service...' },
    { value: 'web-development', label: 'Website Development' },
    { value: 'application', label: 'Application Development' },
    { value: 'wordpress', label: 'WordPress Website' },
    { value: 'ecommerce', label: 'E-Commerce Store' },
    { value: 'other', label: 'Other / Not Sure' },
];

const BUDGET_RANGES = [
    { value: '', label: 'Select budget range...' },
    { value: 'under-10k', label: 'Under ₹10,000' },
    { value: '10k-25k', label: '₹10,000 – ₹25,000' },
    { value: '25k-50k', label: '₹25,000 – ₹50,000' },
    { value: '50k-1l', label: '₹50,000 – ₹1,00,000' },
    { value: 'above-1l', label: 'Above ₹1,00,000' },
    { value: 'not-sure', label: 'Not sure yet' },
];

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function ServiceRequestModal({ isOpen, onClose, user, planSlug = '', service = '', onPayment = null }) {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi+mv+webservice+i+need+website+for`;

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        service_type: service || '',
        budget: '',
        message: '',
        plan_slug: planSlug || '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill user data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setForm((prev) => ({
                ...prev,
                name: user.user_metadata?.full_name || user.user_metadata?.name || prev.name,
                email: user.email || prev.email,
            }));
            setSuccess(false);
            setError('');
        }
    }, [isOpen, user]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Build the message with all details
            const details = [
                `Service: ${SERVICE_TYPES.find(s => s.value === form.service_type)?.label || form.service_type || 'Not specified'}`,
                `Budget: ${BUDGET_RANGES.find(b => b.value === form.budget)?.label || form.budget || 'Not specified'}`,
                form.plan_slug ? `Plan: ${form.plan_slug}` : null,
                `\nProject Details:\n${form.message}`,
            ].filter(Boolean).join('\n');

            await submitServiceRequest({
                name: form.name,
                email: form.email,
                phone: form.phone || null,
                plan_slug: form.plan_slug || null,
                message: details,
            });

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to submit. Please try WhatsApp instead.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

                    {/* Panel */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-400 hover:text-white hover:border-surface-500 transition-colors z-10"
                        >
                            <X size={16} />
                        </button>

                        <div className="p-6 sm:p-8">
                            {success ? (
                                /* ── Success State ── */
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-5">
                                        <CheckCircle2 size={32} className="text-brand-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
                                    <p className="text-surface-400 mb-6 max-w-sm mx-auto">
                                        We've received your project details. Our team will reach out within 2-4 hours.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        {onPayment && (
                                            <button
                                                onClick={onPayment}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-surface-950 rounded-full text-sm font-semibold transition-colors"
                                            >
                                                <CreditCard size={16} />
                                                Proceed to Payment
                                            </button>
                                        )}
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm font-medium transition-colors"
                                        >
                                            <MessageCircle size={16} />
                                            Chat on WhatsApp
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2.5 border border-surface-700 text-surface-300 hover:text-white hover:border-surface-500 rounded-full text-sm font-medium transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ── Form State ── */
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-1">Tell us about your project</h3>
                                        <p className="text-surface-400 text-sm">Fill in the details and we'll get back to you within hours.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name & Email row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-surface-400 mb-1.5">Full Name *</label>
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    required
                                                    minLength={2}
                                                    className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-surface-400 mb-1.5">Email *</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all"
                                                    placeholder="you@email.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-xs font-medium text-surface-400 mb-1.5">Phone (optional)</label>
                                            <input
                                                name="phone"
                                                type="tel"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        {/* Service Type & Budget row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-surface-400 mb-1.5">Service Type</label>
                                                <select
                                                    name="service_type"
                                                    value={form.service_type}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all appearance-none"
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                                                >
                                                    {SERVICE_TYPES.map((s) => (
                                                        <option key={s.value} value={s.value} className="bg-surface-800">{s.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-surface-400 mb-1.5">Budget Range</label>
                                                <select
                                                    name="budget"
                                                    value={form.budget}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all appearance-none"
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                                                >
                                                    {BUDGET_RANGES.map((b) => (
                                                        <option key={b.value} value={b.value} className="bg-surface-800">{b.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-xs font-medium text-surface-400 mb-1.5">Project Details *</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                                minLength={10}
                                                rows={4}
                                                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white text-sm placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all resize-none"
                                                placeholder="Describe your project — what do you want to build? Any specific features or timeline?"
                                            />
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                                                {error}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-surface-950 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={16} />
                                                        Submit Request
                                                    </>
                                                )}
                                            </button>
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 rounded-full font-medium transition-colors text-sm"
                                            >
                                                <MessageCircle size={16} />
                                                WhatsApp Instead
                                            </a>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
