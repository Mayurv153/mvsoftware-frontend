'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackTestimonials = [
    { client_name: 'Dr. Ram', client_role: 'Healthcare Professional', content: 'MV Webservice built a beautiful website for my practice. The design is clean and it works perfectly on mobile.', avatar_url: '/assets/drRam.png', rating: 5 },
    { client_name: 'Ram', client_role: 'Business Owner', content: 'They delivered ahead of schedule and the quality exceeded my expectations. My website has helped me get more clients.', avatar_url: '/assets/Ramtestmonial.png', rating: 5 },
    { client_name: 'Harshdeep', client_role: 'Startup Founder', content: 'The AI automation they built for my business saves me hours every day. Professional team that truly understands technology.', avatar_url: '/assets/harshdeeptesmonial.png', rating: 5 },
    { client_name: 'Parth', client_role: 'E-Commerce Business', content: 'Our online store looks amazing and conversions have increased significantly since the redesign. Worth every penny!', avatar_url: '/assets/parth testomionial.png', rating: 5 },
    { client_name: 'Sumit', client_role: 'Agency Owner', content: 'MV Webservice is my go-to team for all web development. Fast, reliable, and they always deliver top-notch quality.', avatar_url: '/assets/sumittestmonial.png', rating: 5 },
    { client_name: 'Yash D.', client_role: 'Digital Marketer', content: 'The SEO-optimized website they built ranks on the first page of Google. Incredible ROI on my investment.', avatar_url: '/assets/yashdtesmonial.png', rating: 5 },
    { client_name: 'Yash W.', client_role: 'Content Creator', content: 'Clean, modern, and fast — exactly what I needed. The team was responsive and made changes quickly.', avatar_url: '/assets/yashwtestmonial.png', rating: 4 },
];

export default function TestimonialStrip() {
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [paused, setPaused] = useState(false);

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
                console.error('Failed to fetch testimonials:', err);
            }
        }
        fetchTestimonials();
    }, []);

    /* Double the list for seamless infinite scroll */
    const doubled = [...testimonials, ...testimonials];

    return (
        <div
            className="testimonial-strip-wrapper relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Left fade mask */}
            <div
                className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                }}
            />

            {/* Right fade mask */}
            <div
                className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                }}
            />

            {/* Scrolling strip */}
            <div
                className="testimonial-scroll-strip flex gap-5 py-2"
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
            >
                {doubled.map((t, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[360px] sm:w-[400px] card p-7 transition-all duration-300 hover:shadow-card hover:border-brand-100"
                    >
                        {/* Star rating */}
                        <div className="flex gap-0.5 mb-4">
                            {Array.from({ length: t.rating || 5 }).map((_, si) => (
                                <Star
                                    key={si}
                                    size={14}
                                    className="text-amber-400 fill-amber-400"
                                />
                            ))}
                            {Array.from({ length: 5 - (t.rating || 5) }).map((_, si) => (
                                <Star
                                    key={`e${si}`}
                                    size={14}
                                    className="text-neutral-200"
                                />
                            ))}
                        </div>

                        <Quote size={20} className="text-neutral-200 mb-3" />

                        <p className="text-[15px] text-neutral-600 leading-relaxed mb-6">
                            &ldquo;{t.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-3 mt-auto">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 flex-shrink-0">
                                <Image
                                    src={t.avatar_url || '/assets/default-avatar.png'}
                                    alt={t.client_name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-900">{t.client_name}</h4>
                                <p className="text-xs text-neutral-400">{t.client_role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
