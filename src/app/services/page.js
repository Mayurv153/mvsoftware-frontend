'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    Code2,
    Smartphone,
    Layers,
    ShoppingBag,
    MessageCircle,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceRequestModal from '@/components/ServiceRequestModal';
import useAuthCTA from '@/hooks/useAuthCTA';

const services = [
    {
        title: 'Website Development',
        desc: 'Custom-coded, high-performance websites built with Next.js, React, and modern technologies.',
        icon: Code2,
        href: '/services/web-development',
        price: 'From ₹15,000',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    },
    {
        title: 'Application Development',
        desc: 'Full-stack web and mobile applications with real-time dashboards, APIs, and cloud deployment.',
        icon: Smartphone,
        href: '/services/application',
        price: 'From ₹50,000',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
        title: 'WordPress Website',
        desc: 'Beautiful, easy-to-manage WordPress sites with premium themes and custom plugins.',
        icon: Layers,
        href: '/services/wordpress',
        price: 'From ₹10,000',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
        title: 'E-Commerce',
        desc: 'Online stores with seamless checkout, inventory management, and payment gateways.',
        icon: ShoppingBag,
        href: '/services/ecommerce',
        price: 'From ₹20,000',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
];

function ServicesContent() {
    const { triggerCTA, isModalOpen, closeModal, user } = useAuthCTA();
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hi!%20I%20need%20a%20service%20consultation.`;

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 text-center">
                    <AnimatedSection>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Our{' '}
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Services</span>
                        </h1>
                        <p className="text-lg text-surface-400 max-w-xl mx-auto">
                            From stunning websites to powerful applications — we build everything your business needs to thrive online.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Service Cards */}
            <section className="pb-24">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((svc, i) => {
                            const Icon = svc.icon;
                            return (
                                <AnimatedSection key={svc.title} delay={i * 0.1}>
                                    <Link href={svc.href} className="group block">
                                        <div className="card p-0 overflow-hidden hover:border-surface-600 transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative h-52 overflow-hidden">
                                                <Image
                                                    src={svc.image}
                                                    alt={svc.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/30 to-transparent" />
                                                <div className="absolute bottom-4 right-4">
                                                    <span className="px-3 py-1 bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-semibold rounded-full">
                                                        {svc.price}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Content */}
                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-9 h-9 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                                        <Icon size={16} className="text-brand-400" />
                                                    </div>
                                                    <h2 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{svc.title}</h2>
                                                </div>
                                                <p className="text-sm text-surface-400 leading-relaxed mb-4">{svc.desc}</p>
                                                <div className="flex items-center gap-2 text-brand-400 text-sm font-medium">
                                                    View details & pricing
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-surface-800/50">
                <div className="section-container text-center">
                    <AnimatedSection>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Not sure what you need?
                        </h2>
                        <p className="text-surface-400 mb-8 max-w-md mx-auto">
                            Book a free consultation and we&apos;ll help you figure out the perfect solution.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={triggerCTA} className="btn-primary btn-glow group">
                                <MessageCircle size={18} />
                                Free Consultation
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link href="/pricing" className="btn-secondary group">
                                See Pricing
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Service Request Modal */}
            <ServiceRequestModal
                isOpen={isModalOpen}
                onClose={closeModal}
                user={user}
            />
        </>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <ServicesContent />
        </Suspense>
    );
}
