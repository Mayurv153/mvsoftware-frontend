'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    ArrowUpRight,
    ExternalLink,
    MessageCircle,
    Code2,
    Smartphone,
    ShoppingBag,
    Layers,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { supabase } from '@/lib/supabase';
import { getPortfolioProjects } from '@/lib/api';

const categories = ['All', 'Website', 'Application', 'WordPress', 'E-Commerce'];

const fallbackProjects = [
    { title: 'Nova Dashboard', category: 'Application', description: 'Real-time analytics dashboard for a SaaS startup with live data visualization and team management.', tech: ['Next.js', 'Node.js', 'MongoDB', 'Chart.js'], image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80' },
    { title: 'Urban Threads', category: 'E-Commerce', description: 'Fashion e-commerce store with Razorpay checkout, inventory management, and customer accounts.', tech: ['Shopify', 'Liquid', 'JavaScript', 'Razorpay'], image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80' },
    { title: 'Vortex Studio', category: 'Website', description: 'Portfolio website for a creative agency with scroll animations and cinematic page transitions.', tech: ['Next.js', 'Framer Motion', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80' },
    { title: 'MedCare Clinic', category: 'WordPress', description: 'Healthcare practice website with appointment booking, doctor profiles, and patient portal.', tech: ['WordPress', 'Elementor', 'PHP', 'MySQL'], image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80' },
];

const categoryIcon = {
    Website: Code2,
    Application: Smartphone,
    WordPress: Layers,
    'E-Commerce': ShoppingBag,
};

export default function ProjectsPage() {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi%20mv%20webservice%20i%20need%20website%20for____`;
    const [activeFilter, setActiveFilter] = useState('All');
    const [projects, setProjects] = useState(fallbackProjects);

    useEffect(() => {
        getPortfolioProjects()
            .then((data) => {
                if (data && data.length > 0) {
                    setProjects(data);
                }
            })
            .catch(console.error);
    }, []);

    const filtered = activeFilter === 'All'
        ? projects
        : projects.filter((p) => p.category === activeFilter);

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 text-center">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Our Work</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Selected{' '}
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Projects</span>
                        </h1>
                        <p className="text-lg text-surface-400 max-w-xl mx-auto">
                            Real projects built for real businesses. Browse our portfolio to see what we can do for you.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Filter tabs */}
            <section className="pb-6">
                <div className="section-container">
                    <AnimatedSection>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeFilter === cat
                                        ? 'bg-white text-surface-950 border-white'
                                        : 'bg-transparent text-surface-400 border-surface-700 hover:border-surface-500 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Projects grid */}
            <section className="pb-24">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((project, i) => {
                            const CatIcon = categoryIcon[project.category] || Code2;
                            const projectCard = (
                                <AnimatedSection key={project.title + i} delay={i * 0.08}>
                                    <div className="card p-0 overflow-hidden group hover:border-surface-600 transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80'}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-950/20 to-transparent" />
                                            {/* Category badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-900/80 backdrop-blur-sm border border-surface-700 rounded-full text-xs font-medium text-surface-300">
                                                    <CatIcon size={12} className="text-brand-400" />
                                                    {project.category}
                                                </span>
                                            </div>
                                            {/* Live link badge */}
                                            {project.live_url && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                                        <ExternalLink size={10} />
                                                        Live
                                                    </span>
                                                </div>
                                            )}
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-surface-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <ArrowUpRight size={20} className="text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-surface-400 leading-relaxed mb-4">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(project.tech || []).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2.5 py-1 bg-surface-800 border border-surface-700 rounded-md text-xs text-surface-400"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            {project.live_url && (
                                                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
                                                    <ExternalLink size={14} />
                                                    Visit Live Site
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            );

                            return project.live_url ? (
                                <a key={project.title + i} href={project.live_url} target="_blank" rel="noopener noreferrer" className="block">
                                    {projectCard}
                                </a>
                            ) : projectCard;
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-surface-500">No projects found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-surface-800/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 text-center">
                    <AnimatedSection>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Have a project in mind?
                        </h2>
                        <p className="text-surface-400 mb-8 max-w-md mx-auto">
                            Let&apos;s turn your idea into a reality. Get a free consultation today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-glow group">
                                <MessageCircle size={18} />
                                Start a Project
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link href="/services" className="btn-secondary group">
                                View Services
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}
