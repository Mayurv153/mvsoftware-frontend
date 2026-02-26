'use client';

import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Clock,
    ArrowRight,
    Zap,
    Globe,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ContactForm from '@/components/ContactForm';

const contactInfo = [
    {
        icon: Mail,
        label: 'Email',
        value: 'mayurvaidy902189@gmail.com',
        href: 'mailto:mayurvaidy902189@gmail.com',
    },
    {
        icon: Phone,
        label: 'Phone',
        value: '+91 90218 91120',
        href: 'tel:+919021891120',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'India',
        href: null,
    },
    {
        icon: Clock,
        label: 'Response Time',
        value: 'Within 2-4 hours',
        href: null,
    },
];

export default function ContactPage() {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi+mv+webservice+i+need+website+for`;

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 text-center">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Contact Us</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Get a{' '}
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Free Quote</span>
                        </h1>
                        <p className="text-lg text-surface-400 max-w-xl mx-auto">
                            Tell us about your project and we&apos;ll get back to you within 24 hours with a custom proposal.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Main content */}
            <section className="pb-24">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
                        {/* Form — left */}
                        <div className="lg:col-span-3">
                            <AnimatedSection>
                                <ContactForm />
                            </AnimatedSection>
                        </div>

                        {/* Sidebar — right */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* WhatsApp CTA */}
                            <AnimatedSection delay={0.1}>
                                <div className="card p-6 border-green-500/20 hover:border-green-500/40 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                            <MessageCircle size={18} className="text-green-400" />
                                        </div>
                                        <h3 className="font-semibold text-white">Prefer WhatsApp?</h3>
                                    </div>
                                    <p className="text-sm text-surface-400 mb-4">
                                        Skip the form — message us directly for an instant response.
                                    </p>
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium text-white transition-colors group"
                                    >
                                        Chat on WhatsApp
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </AnimatedSection>

                            {/* Contact Info */}
                            <AnimatedSection delay={0.2}>
                                <div className="card p-6">
                                    <h3 className="font-semibold text-white mb-5">Contact Info</h3>
                                    <div className="space-y-4">
                                        {contactInfo.map((item) => {
                                            const Icon = item.icon;
                                            const content = (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0">
                                                        <Icon size={16} className="text-brand-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-surface-500">{item.label}</p>
                                                        <p className="text-sm text-surface-200 font-medium">{item.value}</p>
                                                    </div>
                                                </div>
                                            );
                                            return item.href ? (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    className="block hover:opacity-80 transition-opacity"
                                                >
                                                    {content}
                                                </a>
                                            ) : (
                                                <div key={item.label}>{content}</div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Quick promises */}
                            <AnimatedSection delay={0.3}>
                                <div className="card p-6">
                                    <h3 className="font-semibold text-white mb-4">Why Choose Us</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: Zap, text: 'Reply within 2-4 hours' },
                                            { icon: Globe, text: 'Free project consultation' },
                                            { icon: Clock, text: 'No obligation quotes' },
                                        ].map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={item.text} className="flex items-center gap-3">
                                                    <Icon size={16} className="text-brand-400 flex-shrink-0" />
                                                    <span className="text-sm text-surface-400">{item.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
