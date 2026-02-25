'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 relative overflow-hidden">
                <div className="gradient-orb gradient-orb-blue w-[500px] h-[500px] -top-40 right-0 absolute" />
                <div className="section-padding relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="section-title mb-4">
                            About <span className="gradient-text">MV Webservice</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            We&apos;re on a mission to help businesses grow online with modern websites, animations, and AI-powered automations.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Founder */}
            <section className="pb-24">
                <div className="section-padding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <AnimatedSection>
                            <motion.div
                                whileHover={{ scale: 1.03, rotate: -1.25 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                                className="glass-card p-2 rounded-2xl overflow-hidden max-w-sm mx-auto lg:mx-0 border border-sky-300/50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_70px_rgba(14,165,233,0.25)] transition-shadow"
                            >
                                <Image
                                    src="/assets/founder.png"
                                    alt="Mayur Vaidya - Founder of MV Webservice"
                                    width={400}
                                    height={480}
                                    className="rounded-xl object-cover w-full ring-1 ring-sky-200/60"
                                    priority
                                />
                            </motion.div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.2}>
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm text-accent-400 mb-6">
                                    👋 Meet the Founder
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Mayur Vaidya</h2>
                                <p className="text-brand-300 font-medium mb-3">Creative Technologist</p>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    Founder of MV Webservice. I help businesses grow online with modern websites,
                                    animations, and AI-powered automations for small businesses and startups.
                                </p>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    With a passion for cutting-edge technology and a keen eye for design, I started
                                    MV Webservice to bridge the gap between premium web development and affordable
                                    pricing — making world-class digital solutions accessible to every entrepreneur.
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    Every project we take on is built with the same care and attention to detail as if
                                    it were our own. From the first consultation to post-launch support, we&apos;re
                                    committed to your success.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <a
                                        href="https://www.linkedin.com/in/mayurv9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm text-white hover:text-brand-300 hover:border-brand-400/40 transition-colors"
                                    >
                                        <Linkedin size={16} />
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://instagram.com/mayurvaidya64"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm text-white hover:text-brand-300 hover:border-brand-400/40 transition-colors"
                                    >
                                        <Instagram size={16} />
                                        Instagram
                                    </a>
                                    <a
                                        href="https://x.com/MayurVaidy61310"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm text-white hover:text-brand-300 hover:border-brand-400/40 transition-colors"
                                    >
                                        <Twitter size={16} />
                                        X (Twitter)
                                    </a>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 border-t border-white/5">
                <div className="section-padding">
                    <AnimatedSection className="text-center mb-14">
                        <h2 className="text-3xl font-bold">
                            Our <span className="gradient-text">Values</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                icon: '💎',
                                title: 'Quality First',
                                description: 'We never compromise on quality. Every pixel, every line of code is crafted with care.',
                            },
                            {
                                icon: '⚡',
                                title: 'Speed Matters',
                                description: 'Fast delivery without cutting corners. We respect your time and deadlines.',
                            },
                            {
                                icon: '🤝',
                                title: 'Client-Centric',
                                description: 'Your success is our success. We listen, adapt, and deliver what truly works for you.',
                            },
                        ].map((value, i) => (
                            <AnimatedSection key={value.title} delay={i * 0.12}>
                                <div className="glass-card p-8 text-center h-full">
                                    <span className="text-3xl mb-4 block">{value.icon}</span>
                                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-gray-400">{value.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

