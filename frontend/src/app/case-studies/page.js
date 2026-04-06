import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicCaseStudies } from '@/lib/api';
import { getAllCaseStudies } from '@/content/caseStudies';

export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage() {
    let studies = [];

    try {
        const apiStudies = await getPublicCaseStudies();
        if (apiStudies && apiStudies.length > 0) {
            studies = apiStudies.map(s => ({
                slug: s.slug,
                title: s.title,
                client: s.client,
                industry: s.industry,
                timeline: s.timeline,
                heroImage: s.hero_image_url || '/images/placeholder.jpg',
                challenge: s.challenge,
                services: s.services || [],
                tech: s.tech || [],
            }));
        }
    } catch (_) { /* fall through */ }

    if (studies.length === 0) {
        studies = getAllCaseStudies();
    }

    return (
        <>
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Case Studies</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                            Real Projects,
                            <span className="block bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Measurable Results</span>
                        </h1>
                        <p className="text-surface-400 text-lg">
                            Deep dives into challenges, execution, and business outcomes.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            <section className="pb-24 border-t border-surface-800/50">
                <div className="section-container pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {studies.map((study, i) => (
                            <AnimatedSection key={study.slug} delay={i * 0.07}>
                                <article className="card overflow-hidden h-full flex flex-col">
                                    <div className="relative aspect-[16/10]">
                                        <Image src={study.heroImage} alt={study.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <p className="text-xs uppercase tracking-[0.2em] text-brand-400 mb-2">{study.industry}</p>
                                        <h2 className="text-xl font-semibold text-white leading-snug mb-3">{study.title}</h2>
                                        <p className="text-sm text-surface-400 mb-5 flex-1">{study.challenge}</p>
                                        <Link href={`/case-studies/${study.slug}`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                                            Read full case study
                                        </Link>
                                    </div>
                                </article>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
