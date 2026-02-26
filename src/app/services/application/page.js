'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    Smartphone,
    Globe,
    Database,
    Cloud,
    Cpu,
    Lock,
    MessageCircle,
    BarChart3,
    Layers,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const techStack = [
    { name: 'React Native', desc: 'Cross-platform mobile apps', icon: '📱' },
    { name: 'Flutter', desc: 'Beautiful native apps', icon: '🦋' },
    { name: 'Next.js', desc: 'Full-stack web apps', icon: '⚡' },
    { name: 'Node.js', desc: 'Scalable backend APIs', icon: '🟢' },
    { name: 'PostgreSQL', desc: 'Relational database', icon: '🐘' },
    { name: 'AWS / Firebase', desc: 'Cloud infrastructure', icon: '☁️' },
];

const features = [
    { icon: Smartphone, title: 'Mobile & Web', desc: 'Native mobile apps and progressive web applications.' },
    { icon: Database, title: 'Real-time Data', desc: 'Live dashboards, notifications, and data sync.' },
    { icon: Cloud, title: 'Cloud Native', desc: 'Scalable architecture on AWS, GCP, or Firebase.' },
    { icon: Lock, title: 'Authentication', desc: 'Secure login with OAuth, JWT, and 2FA.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Built-in analytics and performance monitoring.' },
    { icon: Layers, title: 'API Integrations', desc: 'REST & GraphQL APIs with third-party integrations.' },
];

export default function ApplicationPage() {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi%20mv%20webservice%20i%20need%20website%20for`;

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Services</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Application
                            <br />
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Development</span>
                        </h1>
                        <p className="text-lg text-surface-400 max-w-xl mb-8 leading-relaxed">
                            Full-stack web and mobile applications with real-time features, dashboards, APIs, and seamless cloud deployment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-glow group">
                                <MessageCircle size={18} />
                                Get a Quote
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link href="/pricing" className="btn-secondary group">
                                View Pricing
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 border-t border-surface-800/50">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Tech Stack We Use</h2>
                        <p className="text-surface-400">Cutting-edge frameworks for modern applications.</p>
                    </AnimatedSection>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {techStack.map((tech, i) => (
                            <AnimatedSection key={tech.name} delay={i * 0.06}>
                                <div className="card p-5 text-center group hover:border-surface-600 transition-all h-full flex flex-col items-center">
                                    <div className="w-16 h-16 icon-liquid-glass mb-4 mx-auto">
                                        <span className="text-2xl relative z-10">{tech.icon}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-white mb-1">{tech.name}</h3>
                                    <p className="text-xs text-surface-500">{tech.desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 border-t border-surface-800/50">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">What You Get</h2>
                        <p className="text-surface-400">Everything a modern application needs.</p>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <AnimatedSection key={feat.title} delay={i * 0.06}>
                                    <div className="card p-6 group hover:border-surface-600 transition-all h-full">
                                        <div className="w-12 h-12 icon-liquid-glass mb-4">
                                            <Icon size={22} className="text-brand-400 relative z-10" />
                                        </div>
                                        <h3 className="text-base font-semibold text-white mb-1">{feat.title}</h3>
                                        <p className="text-sm text-surface-400">{feat.desc}</p>
                                    </div>
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
                            Ready to build your app?
                        </h2>
                        <p className="text-surface-400 mb-8 max-w-md mx-auto">
                            From idea to launch — we&apos;ll handle everything.
                        </p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-glow group inline-flex">
                            <MessageCircle size={18} />
                            Start a Conversation
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}

