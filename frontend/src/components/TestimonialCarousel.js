'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Fallback testimonials in case DB is unreachable
const fallbackTestimonials = [
    { client_name: 'Dr. Ram', client_role: 'Healthcare Professional', content: 'MV Webservice built a beautiful website for my practice. The design is clean and it works perfectly on mobile. Highly recommended!', avatar_url: '/assets/drRam.png' },
    { client_name: 'Ram', client_role: 'Business Owner', content: 'Great work! They delivered ahead of schedule and the quality exceeded my expectations. The website has helped me get more clients.', avatar_url: '/assets/Ramtestmonial.png' },
    { client_name: 'Harshdeep', client_role: 'Startup Founder', content: 'The AI automation they built for my business saves me hours every day. Professional team that truly understands technology.', avatar_url: '/assets/harshdeeptesmonial.png' },
    { client_name: 'Parth', client_role: 'E-Commerce Business', content: 'Our online store looks amazing and conversions have increased significantly since the redesign. Worth every penny!', avatar_url: '/assets/parth testomionial.png' },
    { client_name: 'Sumit', client_role: 'Agency Owner', content: 'MV Webservice is my go-to team for all web development. Fast, reliable, and they always deliver top-notch quality.', avatar_url: '/assets/sumittestmonial.png' },
    { client_name: 'Yash D.', client_role: 'Digital Marketer', content: 'The SEO-optimized website they built for me ranks on the first page of Google. Incredible ROI on my investment.', avatar_url: '/assets/yashdtesmonial.png' },
    { client_name: 'Yash W.', client_role: 'Content Creator', content: 'Clean, modern, and fast — exactly what I needed. The team was responsive and made changes quickly.', avatar_url: '/assets/yashwtestmonial.png' },
];

export default function TestimonialCarousel() {
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Fetch published testimonials from Supabase
    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const { data, error } = await supabase
                    .from('testimonials')
                    .select('client_name, client_role, content, avatar_url, rating')
                    .eq('is_published', true)
                    .order('created_at', { ascending: true });

                if (!error && data && data.length > 0) {
                    setTestimonials(data);
                }
            } catch (err) {
                // Silently fall back to hardcoded testimonials
                console.error('Failed to fetch testimonials:', err);
            }
        }
        fetchTestimonials();
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prev = () => {
        setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        if (isPaused || testimonials.length === 0) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next, testimonials.length]);

    const t = testimonials[current];
    if (!t) return null;

    return (
        <div
            className="max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="card p-10 sm:p-14 text-center relative">
                <Quote size={36} className="text-neutral-100 mx-auto mb-8" />

                <p className="text-xl sm:text-2xl font-light text-neutral-700 leading-relaxed mb-10">
                    &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-100">
                        <Image
                            src={t.avatar_url || '/assets/default-avatar.png'}
                            alt={t.client_name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-neutral-900 text-sm">{t.client_name}</h4>
                        <p className="text-xs text-neutral-400">{t.client_role}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
                    aria-label="Previous"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1.5">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-brand-500' : 'w-1.5 bg-neutral-200'
                                }`}
                            aria-label={`Testimonial ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
                    aria-label="Next"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
