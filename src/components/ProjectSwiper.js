'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Code2, Smartphone, ShoppingBag, Layers } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const projects = [
    {
        title: 'Nova Dashboard',
        category: 'Application',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        tech: ['Next.js', 'Node.js', 'MongoDB'],
    },
    {
        title: 'Vortex Studio',
        category: 'Website',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        tech: ['Next.js', 'Framer Motion', 'Tailwind'],
    },
    {
        title: 'Urban Threads',
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
        tech: ['Shopify', 'JavaScript', 'Razorpay'],
    },
    {
        title: 'MedCare Clinic',
        category: 'WordPress',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
        tech: ['WordPress', 'Elementor', 'PHP'],
    },
    {
        title: 'Ascend Holdings',
        category: 'Website',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        tech: ['Next.js', 'React', 'Vercel'],
    },
    {
        title: 'FreshKart',
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&q=80',
        tech: ['React Native', 'Node.js', 'Stripe'],
    },
    {
        title: 'TaskFlow',
        category: 'Application',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        tech: ['React', 'Firebase', 'WebSockets'],
    },
    {
        title: 'TravelBlog Pro',
        category: 'WordPress',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        tech: ['WordPress', 'Yoast SEO', 'WP Rocket'],
    },
];

const categoryIcon = {
    Website: Code2,
    Application: Smartphone,
    WordPress: Layers,
    'E-Commerce': ShoppingBag,
};

export default function ProjectSwiper() {
    return (
        <section className="py-24 md:py-32 overflow-hidden">
            <div className="section-container">
                <AnimatedSection className="text-center mb-14">
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-3">Portfolio</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Selected Works
                    </h2>
                    <p className="text-surface-400 max-w-lg mx-auto">
                        A glimpse of projects we&apos;ve delivered for businesses across the globe.
                    </p>
                </AnimatedSection>
            </div>

            <AnimatedSection delay={0.2}>
                <Swiper
                    modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    speed={800}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 60,
                        depth: 200,
                        modifier: 1.5,
                        slideShadows: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2.5 },
                        1280: { slidesPerView: 3 },
                    }}
                    className="project-swiper !pb-14"
                >
                    {projects.map((project) => {
                        const CatIcon = categoryIcon[project.category] || Code2;
                        return (
                            <SwiperSlide key={project.title}>
                                <div className="group relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900 transition-all duration-500 hover:border-surface-600">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-900/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-surface-200">
                                                <div className="w-6 h-6 icon-liquid-glass rounded-full">
                                                    <CatIcon size={12} className="text-brand-400 relative z-10" />
                                                </div>
                                                {project.category}
                                            </span>
                                        </div>
                                        {/* Hover icon */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <ExternalLink size={18} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2 py-0.5 bg-surface-800 border border-surface-700 rounded text-[11px] text-surface-400"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </AnimatedSection>

            {/* View all link */}
            <div className="section-container mt-10 text-center">
                <AnimatedSection delay={0.3}>
                    <Link href="/projects" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium group transition-colors">
                        View all projects
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </AnimatedSection>
            </div>
        </section>
    );
}
