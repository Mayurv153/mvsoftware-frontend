'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicCaseStudyBySlug } from '@/lib/api';
import { getCaseStudyBySlug } from '@/content/caseStudies';

export default function CaseStudyDetailPage() {
    const params = useParams();
    const slug = params.slug;
    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudy();
    }, [slug]);

    const loadStudy = async () => {
        setLoading(true);
        try {
            const apiStudy = await getPublicCaseStudyBySlug(slug);
            if (apiStudy) {
                setStudy({
                    ...apiStudy,
                    heroImage: apiStudy.hero_image_url || '/images/placeholder.jpg',
                });
            } else {
                const staticStudy = getCaseStudyBySlug(slug);
                if (staticStudy) setStudy(staticStudy);
            }
        } catch (_) {
            const staticStudy = getCaseStudyBySlug(slug);
            if (staticStudy) setStudy(staticStudy);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!study) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-surface-400">Case study not found</p>
            </div>
        );
    }

    return (
        <>
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="section-container max-w-5xl">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Case Study</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">{study.title}</h1>
                        <div className="flex flex-wrap gap-3 text-xs text-surface-400 mb-8">
                            <span>Client: {study.client}</span>
                            <span>-</span>
                            <span>Industry: {study.industry}</span>
                            <span>-</span>
                            <span>Timeline: {study.timeline}</span>
                        </div>
                    </AnimatedSection>

                    {study.heroImage && (
                        <AnimatedSection delay={0.05}>
                            <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-surface-800">
                                <Image src={study.heroImage} alt={study.title} fill className="object-cover" />
                            </div>
                        </AnimatedSection>
                    )}
                </div>
            </section>

            <section className="pb-24 border-t border-surface-800/50">
                <div className="section-container max-w-5xl pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatedSection>
                            <div className="card p-7">
                                <h2 className="text-2xl font-semibold text-white mb-3">Challenge</h2>
                                <p className="text-surface-300 leading-relaxed">{study.challenge}</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={0.08}>
                            <div className="card p-7">
                                <h2 className="text-2xl font-semibold text-white mb-3">Solution</h2>
                                <p className="text-surface-300 leading-relaxed">{study.solution}</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={0.12}>
                            <div className="card p-7">
                                <h2 className="text-2xl font-semibold text-white mb-3">Outcome</h2>
                                <ul className="space-y-2">
                                    {(study.outcome || []).map((point) => (
                                        <li key={point} className="text-surface-300 flex items-start gap-2">
                                            <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedSection>
                    </div>

                    <aside>
                        <AnimatedSection delay={0.1}>
                            <div className="card p-6 sticky top-28">
                                <h3 className="text-lg font-semibold text-white mb-3">Services Used</h3>
                                <ul className="space-y-2 mb-6">
                                    {(study.services || []).map((service) => (
                                        <li key={service} className="text-sm text-surface-300">{service}</li>
                                    ))}
                                </ul>
                                <h4 className="text-sm font-semibold text-white mb-2">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(study.tech || []).map((tech) => (
                                        <span key={tech} className="px-2.5 py-1 rounded-md bg-surface-800 border border-surface-700 text-xs text-surface-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    </aside>
                </div>
            </section>
        </>
    );
}
