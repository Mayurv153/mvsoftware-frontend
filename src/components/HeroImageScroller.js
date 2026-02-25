'use client';

import Image from 'next/image';

const heroImages = [
    {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
        alt: 'Modern coding workspace',
    },
    {
        src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
        alt: 'Technology and collaboration',
    },
    {
        src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        alt: 'Digital analytics dashboard',
    },
    {
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
        alt: 'Creative team working',
    },
];

/* Render the strip twice for an infinite seamless loop */
const doubled = [...heroImages, ...heroImages];

export default function HeroImageScroller() {
    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Scrolling image strip — slightly scaled up to avoid white edges */}
            <div className="hero-scroll-strip flex h-full">
                {doubled.map((img, i) => (
                    <div
                        key={i}
                        className="relative flex-shrink-0 h-full"
                        style={{ width: '50vw', minWidth: '600px' }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            sizes="50vw"
                            priority={i < 4}
                        />
                    </div>
                ))}
            </div>

            {/* ── Overlays ──────────────────────────── */}
            {/* Frosted white overlay for text readability */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.80) 100%)',
                    backdropFilter: 'blur(1px)',
                    WebkitBackdropFilter: 'blur(1px)',
                }}
            />

            {/* Top & bottom fade to white for seamless section blending */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, transparent 18%, transparent 82%, rgba(255,255,255,0.95) 100%)',
                }}
            />
        </div>
    );
}
