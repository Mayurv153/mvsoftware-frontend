'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import {
    ArrowRight,
    ArrowLeft,
    Layers,
    Code2,
    Search,
    ShoppingBag,
    Smartphone,
    Star,
    ChevronDown,
    MessageCircle,
    Rocket,
    PenTool,
    MousePointer2,
    Plus,
    X,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import MagneticButton from '@/components/MagneticButton';
import ParticleCanvas from '@/components/ParticleCanvas';
import ServiceRequestModal from '@/components/ServiceRequestModal';
import useAuthCTA from '@/hooks/useAuthCTA';
import { getTestimonials } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const stats = [
    { end: 50, suffix: '+', label: 'Projects Delivered' },
    { end: 30, suffix: '+', label: 'Happy Clients' },
    { end: 3, suffix: '+', label: 'Years of Excellence' },
    { end: 100, suffix: '%', label: 'Client Satisfaction' },
];

const services = [
    {
        key: 'web-development',
        title: 'Website Development',
        description: 'Custom-coded, high-performance websites built with modern technologies.',
        features: ['Next.js & React', 'Responsive design', 'SEO optimized', 'CMS integration'],
        icon: Code2,
    },
    {
        key: 'application',
        title: 'Application',
        description: 'Full-stack web and mobile applications with real-time features and APIs.',
        features: ['Web & Mobile apps', 'Real-time dashboards', 'REST & GraphQL APIs', 'Cloud deployment'],
        icon: Smartphone,
    },
    {
        key: 'wordpress',
        title: 'WordPress Website',
        description: 'Beautiful, easy-to-manage WordPress sites with premium themes.',
        features: ['Custom themes', 'Plugin development', 'WooCommerce ready', 'Easy content editing'],
        icon: Layers,
    },
    {
        key: 'ecommerce',
        title: 'E-Commerce',
        description: 'Online stores with seamless checkout, inventory, and payment gateways.',
        features: ['Product management', 'Payment gateways', 'Order tracking', 'Inventory & shipping'],
        icon: ShoppingBag,
    },
];

const clientLogos = [
    'Google', 'Microsoft', 'Stripe', 'Shopify', 'Slack', 'Notion',
    'Adobe', 'AWS', 'Vercel', 'Netlify', 'Airbnb', 'Uber',
    'Figma', 'Dropbox', 'Zoom', 'PayPal', 'LinkedIn', 'Asana',
    'Zapier', 'Twilio', 'Canva', 'HubSpot',
];

const fallbackTestimonials = [
    { client_name: 'Dr. Ram', client_role: 'Healthcare Professional', content: 'MV Webservice built a beautiful website for my practice. The design is clean and it works perfectly on mobile. Highly recommended.', avatar_url: '/assets/drRam.png', rating: 5 },
    { client_name: 'Ram', client_role: 'Business Owner', content: 'Great work. They delivered ahead of schedule and the quality exceeded my expectations. The website has helped me get more clients.', avatar_url: '/assets/Ramtestmonial.png', rating: 5 },
    { client_name: 'Harshdeep', client_role: 'Startup Founder', content: 'The AI automation they built for my business saves me hours every day. Professional team that truly understands technology.', avatar_url: '/assets/harshdeeptesmonial.png', rating: 5 },
    { client_name: 'Parth', client_role: 'E-Commerce Business', content: 'Our online store looks amazing and conversions have increased significantly since the redesign. Worth every penny.', avatar_url: '/assets/parth testomionial.png', rating: 5 },
    { client_name: 'Sumit', client_role: 'Agency Owner', content: 'MV Webservice is my go-to team for all web development. Fast, reliable, and they always deliver top-notch quality.', avatar_url: '/assets/sumittestmonial.png', rating: 5 },
    { client_name: 'Yash D.', client_role: 'Digital Marketer', content: 'The SEO-optimized website they built for me ranks on the first page of Google. Incredible ROI on my investment.', avatar_url: '/assets/yashdtesmonial.png', rating: 5 },
    { client_name: 'Yash W.', client_role: 'Content Creator', content: 'Clean, modern, and fast — exactly what I needed. The team was responsive and made changes quickly.', avatar_url: '/assets/yashwtestmonial.png', rating: 4 },
];

const faqs = [
    { q: 'How does the process work?', a: 'We follow a 4-step process: Discovery, Design, Development, and Launch. Each phase includes client feedback loops so you are always in control.' },
    { q: 'How much does a website cost?', a: 'Our projects range from ₹15,000 for a starter site to ₹1,50,000+ for complex web applications. We provide a detailed quote after understanding your requirements.' },
    { q: 'How long does it take to build a website?', a: 'A standard website takes 2–4 weeks. Complex web apps or e-commerce stores may take 4–8 weeks depending on features and integrations.' },
    { q: 'Do I need to know how to code?', a: 'Not at all. We handle all the technical work. You get an easy-to-use CMS to update content, images, and pages on your own.' },
    { q: 'Do you provide hosting and maintenance?', a: 'Yes. We offer hosting, SSL certificates, performance monitoring, and ongoing maintenance packages to keep your site running smooth.' },
];

const processSteps = [
    { icon: Search, num: '01', title: 'Discovery', description: 'Deep-dive into your goals, audience, and competition.' },
    { icon: PenTool, num: '02', title: 'Design', description: 'Wireframes, mockups, and visual direction that fits your brand.' },
    { icon: MousePointer2, num: '03', title: 'Build', description: 'Development with continuous feedback at every milestone.' },
    { icon: Rocket, num: '04', title: 'Launch', description: 'Testing, deployment, optimization, and growth.' },
];

/* ─────────────────────────────────────────────
   FEATURE CARD COMPONENTS
   ───────────────────────────────────────────── */

// Card 1 — Diagnostic Shuffler
function DiagnosticShuffler() {
    const items = [
        { label: 'Performance Score', status: '98/100', color: 'text-green-400' },
        { label: 'SEO Audit', status: 'Passed', color: 'text-brand-400' },
        { label: 'Accessibility', status: 'AA Compliant', color: 'text-accent-400' },
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setIndex((i) => (i + 1) % items.length), 3000);
        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <div className="bg-surface-900 border border-surface-800 rounded-[2rem] p-6 h-full">
            <p className="text-xs font-mono text-surface-500 mb-1 uppercase tracking-wider">Diagnostics</p>
            <h3 className="text-lg font-semibold text-white mb-4">Performance Audit</h3>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={false}
                        animate={{
                            opacity: i === index ? 1 : 0.4,
                            scale: i === index ? 1 : 0.97,
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-800/50 border border-surface-700/50"
                    >
                        <span className="text-sm text-surface-300 font-mono">{item.label}</span>
                        <span className={`text-sm font-semibold font-mono ${item.color}`}>{item.status}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Card 2 — Telemetry Typewriter
function TelemetryTypewriter() {
    const messages = [
        '→ Deploying to production...',
        '✓ Build completed in 2.3s',
        '→ Running lighthouse audit...',
        '✓ Performance score: 98',
        '→ Optimizing images...',
        '✓ 12 assets compressed',
    ];
    const [currentMsg, setCurrentMsg] = useState('');
    const [msgIndex, setMsgIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        if (isScrambling) {
            const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
            let count = 0;
            const sid = setInterval(() => {
                count++;
                const len = messages[msgIndex].length;
                setCurrentMsg(Array.from({ length: len }, () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)]).join(''));
                if (count > 20) {
                    clearInterval(sid);
                    setIsScrambling(false);
                    setCharIndex(0);
                }
            }, 20);
            return () => clearInterval(sid);
        }

        if (charIndex < messages[msgIndex].length) {
            const tid = setTimeout(() => {
                setCurrentMsg(messages[msgIndex].substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 15);
            return () => clearTimeout(tid);
        }

        // Finished typing, wait then move to next
        const tid = setTimeout(() => {
            setMsgIndex((i) => (i + 1) % messages.length);
            setIsScrambling(true);
        }, 2000);
        return () => clearTimeout(tid);
    }, [charIndex, msgIndex, isScrambling, messages]);

    return (
        <div className="bg-surface-900 border border-surface-800 rounded-[2rem] p-6 h-full">
            <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400" />
                </span>
                <p className="text-xs font-mono text-brand-400 uppercase tracking-wider">LIVE</p>
            </div>
            <h3 className="text-lg font-semibold text-white mb-4">Build Console</h3>
            <div className="bg-surface-950 rounded-xl p-4 min-h-[80px] font-mono text-sm text-surface-300 border border-surface-800">
                {currentMsg}<span className="animate-pulse text-brand-400">|</span>
            </div>
        </div>
    );
}

// Card 3 — Signal Graph
function SignalGraph() {
    const [isVisible, setIsVisible] = useState(false);
    const graphRef = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.3 });
        if (graphRef.current) obs.observe(graphRef.current);
        return () => obs.disconnect();
    }, []);

    const points = [10, 40, 25, 60, 45, 80, 55, 90, 70, 95];
    const w = 260, h = 100;
    const path = points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - (p / 100) * h;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    return (
        <div ref={graphRef} className="bg-surface-900 border border-surface-800 rounded-[2rem] p-6 h-full">
            <p className="text-xs font-mono text-surface-500 mb-1 uppercase tracking-wider">Analytics</p>
            <h3 className="text-lg font-semibold text-white mb-4">Growth Trajectory</h3>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
                <defs>
                    <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.3)" />
                        <stop offset="100%" stopColor="rgba(20,184,166,0)" />
                    </linearGradient>
                </defs>
                                <motion.path
                    d={`${path} L${w},${h} L0,${h} Z`}
                    fill="url(#graphGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 0.5 : 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                />
                <motion.path
                    d={path}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                />
                {points.map((p, i) => (
                    <motion.circle
                        key={i}
                        cx={(i / (points.length - 1)) * w}
                        cy={h - (p / 100) * h}
                        r="3"
                        fill="#14b8a6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
                        transition={{ delay: 0.25 + (i * 0.08), duration: 0.35, ease: 'easeOut' }}
                    />
                ))}
            </svg>
            <p className="text-xs text-surface-500 font-mono mt-2">Conversion Rate — Last 10 Months</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   GSAP STAT COUNTER
   ───────────────────────────────────────────── */
function GsapCounter({ end, suffix = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obj = { val: 0 };
        const ctx = gsap.context(() => {
            gsap.to(obj, {
                val: end,
                duration: 2,
                ease: 'power2.out',
                snap: { val: 1 },
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val) + suffix;
                },
            });
        });
        return () => ctx.revert();
    }, [end, suffix]);

    return <span ref={ref}>0{suffix}</span>;
}

/* ─────────────────────────────────────────────
   FAQ ITEM
   ───────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-surface-800/60">
            <button onClick={onToggle} className="w-full flex items-center justify-between py-6 text-left group">
                <span className="text-lg font-medium text-white group-hover:text-brand-400 transition-colors pr-8">
                    {faq.q}
                </span>
                <div className={`relative w-6 h-6 flex items-center justify-center text-surface-500 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    <Plus size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-surface-400 leading-relaxed max-w-2xl">
                            {faq.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
function HomeContent() {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi%20mv%20webservice%20i%20need%20website%20for`;
    const { triggerCTA, isModalOpen, closeModal, user } = useAuthCTA();
    const [openFaq, setOpenFaq] = useState(null);
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef(null);
    const philosophyRef = useRef(null);

    // Fetch published testimonials
    useEffect(() => {
        getTestimonials()
            .then((data) => {
                if (data && data.length > 0) {
                    setTestimonials(data);
                }
            })
            .catch(console.error);
    }, []);

    // GSAP Hero entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.hero-content > *',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 1.8 }
            );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // GSAP Philosophy word reveal
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.philosophy-word',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.04,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.philosophy-section',
                        start: 'top 70%',
                        once: true,
                    },
                }
            );
        }, philosophyRef);
        return () => ctx.revert();
    }, []);

    const nextTestimonial = useCallback(() => {
        setActiveTestimonial((i) => (i + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevTestimonial = useCallback(() => {
        setActiveTestimonial((i) => (i - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    const doubledLogos = [...clientLogos, ...clientLogos];

    const handleLogoError = useCallback((e) => {
        const el = e.target;
        el.onerror = null;
        const name = el.getAttribute('data-name') || '';
        const initial = (name && name.trim()[0]) ? name.trim()[0].toUpperCase() : '?';
        const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='100%' height='100%' fill='%23333333'/><text x='50%' y='50%' dy='0.35em' font-family='Inter, Arial, sans-serif' font-size='52' fill='%23ffffff' text-anchor='middle'>${initial}</text></svg>`;
        el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }, []);

    return (
        <>
            {/* ═══════════════════════════════════════════
                HERO — Full viewport with particle canvas
               ═══════════════════════════════════════════ */}
            <section ref={heroRef} className="relative overflow-hidden min-h-[100dvh] flex items-end pb-20 lg:pb-24">
                {/* Particle canvas background */}
                <div className="absolute inset-0">
                    <ParticleCanvas />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.6) 40%, rgba(9,9,11,0.3) 100%)' }} />
                </div>

                <div className="section-container relative z-10 hero-content">
                    <p className="text-sm font-mono text-brand-400 mb-4 tracking-wider uppercase">
                        MV Webservice
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Your vision<br />
                        <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                            made real
                        </span>
                    </h1>
                    <p className="text-surface-400 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
                        We build stunning websites and intelligent automations that turn your ideas into digital experiences people remember.
                    </p>
                    <MagneticButton>
                        <button
                            onClick={triggerCTA}
                            className="btn-primary btn-glow group text-base px-10 py-4 inline-flex items-center gap-2"
                        >
                            Start Your Project
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </MagneticButton>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SOCIAL PROOF BAR — Auto-scrolling ticker
               ═══════════════════════════════════════════ */}
            <section className="py-10 border-b border-surface-800/40 overflow-hidden relative">
                {/* Gradient fades */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgb(9,9,11) 0%, transparent 100%)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgb(9,9,11) 0%, transparent 100%)' }} />

                <div className="ticker-strip flex items-center gap-8 whitespace-nowrap">
                    {doubledLogos.map((name, i) => (
                        <div key={`${name}-${i}`} className="flex items-center gap-2 text-surface-500 flex-shrink-0">
                                    <img
                                        src={`https://cdn.simpleicons.org/${name.toLowerCase().replace(/[.\s]/g, '')}/71717a`}
                                        data-name={name}
                                        onError={handleLogoError}
                                        alt={name}
                                        width={20}
                                        height={20}
                                        className="opacity-60"
                                        loading="lazy"
                                    />
                            <span className="text-sm font-medium">{name}</span>
                        </div>
                    ))}
                </div>

                {/* Stats row */}
                <div className="section-container mt-8">
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
                        <div><span className="text-2xl sm:text-3xl font-bold text-white font-mono">50+</span><p className="text-xs text-surface-500 mt-1">Projects</p></div>
                        <div><span className="text-2xl sm:text-3xl font-bold text-white font-mono">30+</span><p className="text-xs text-surface-500 mt-1">Clients</p></div>
                        <div><span className="text-2xl sm:text-3xl font-bold text-white font-mono">99.9%</span><p className="text-xs text-surface-500 mt-1">Uptime</p></div>
                        <div><span className="text-2xl sm:text-3xl font-bold text-white font-mono">4.9★</span><p className="text-xs text-surface-500 mt-1">Rating</p></div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FEATURES — Interactive Micro-UI Cards
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-sm font-mono text-brand-400 mb-3 tracking-wider uppercase">What we deliver</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Every pixel, <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">purposeful</span>
                        </h2>
                        <p className="text-surface-400 max-w-lg mx-auto">
                            Three pillars that define every project we touch.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnimatedSection delay={0}>
                            <DiagnosticShuffler />
                        </AnimatedSection>
                        <AnimatedSection delay={0.1}>
                            <TelemetryTypewriter />
                        </AnimatedSection>
                        <AnimatedSection delay={0.2}>
                            <SignalGraph />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                HOW IT WORKS — Process Steps
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 border-t border-surface-800/50">
                <div className="section-container">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-sm font-mono text-brand-400 mb-3 tracking-wider uppercase">Our process</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            From concept to <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">launch</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent -translate-y-1/2 z-0" />

                        {processSteps.map((step, i) => {
                            const StepIcon = step.icon;
                            return (
                                <AnimatedSection key={step.num} delay={i * 0.1}>
                                    <div className="relative z-10 text-center p-8 bg-surface-950 group">
                                        <span className="block text-5xl font-bold font-mono text-brand-400/20 mb-4">{step.num}</span>
                                        <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                            <StepIcon size={22} className="text-brand-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                                        <p className="text-sm text-surface-400">{step.description}</p>
                                    </div>
                                </AnimatedSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                PHILOSOPHY — Manifesto Section
               ═══════════════════════════════════════════ */}
                        {/* Creative Technologist */}
            <section className="py-24 md:py-32 border-t border-surface-800/50">
                <div className="section-container">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <AnimatedSection>
                            <p className="text-sm font-mono text-brand-400 mb-3 tracking-wider uppercase">Creative Technologist</p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Design thinking with
                                <span className="block bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                                    engineering execution
                                </span>
                            </h2>
                            <p className="text-surface-400 leading-relaxed mb-6">
                                We combine storytelling, UX, performance engineering, and conversion strategy to build digital experiences that look premium and perform like a sales engine.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/about" className="btn-secondary">About the approach</Link>
                                <Link href="/blog" className="btn-primary btn-glow">Read blog insights</Link>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.1}>
                            <div className="card p-7 sm:p-8">
                                <div className="space-y-4">
                                    {[
                                        'Brand-first UI systems with business logic in mind',
                                        'SEO and performance embedded in development workflow',
                                        'Conversion-focused user journeys and measurable outcomes',
                                        'Rapid iteration from prototype to production',
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />
                                            <p className="text-surface-300 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
<section ref={philosophyRef} className="philosophy-section py-32 md:py-44 relative overflow-hidden">
                {/* Dark background with texture */}
                <div className="absolute inset-0 bg-surface-950" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=60)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
                    <AnimatedSection>
                        <p className="text-surface-500 text-lg mb-6 leading-relaxed">
                            Most web agencies focus on templates, generic layouts, and cookie-cutter solutions.
                        </p>
                    </AnimatedSection>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {'We focus on building digital instruments that make your business '.split(' ').map((word, i) => (
                            <span key={i} className="philosophy-word inline-block mr-[0.3em] text-white" style={{ opacity: 0 }}>
                                {word}
                            </span>
                        ))}
                        <span className="philosophy-word inline-block bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent" style={{ opacity: 0 }}>
                            unforgettable.
                        </span>
                    </h2>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                STATS — Animated Counters
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 border-t border-surface-800/50">
                <div className="section-container">
                    <div className="bg-surface-900/50 rounded-3xl border border-surface-800/50 p-10 sm:p-14">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 font-mono">
                                        <GsapCounter end={s.end} suffix={s.suffix} />
                                    </p>
                                    <p className="text-xs sm:text-sm text-surface-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                TESTIMONIALS — Stacked Reveal
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 border-t border-surface-800/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)' }} />

                <div className="section-container relative z-10">
                    <AnimatedSection className="text-center mb-14">
                        <p className="text-sm font-mono text-brand-400 mb-3 tracking-wider uppercase">Testimonials</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Loved by <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">clients</span>
                        </h2>
                    </AnimatedSection>

                    <div className="max-w-2xl mx-auto text-center relative min-h-[280px]">
                        {(() => {
                            const t = testimonials[activeTestimonial] || {};
                            const clientName = t.client_name || t.name || t.full_name || 'Verified Client';
                            const clientRole = t.client_role || t.role || 'Client';
                            const clientAvatar = t.avatar_url || t.avatar || '/assets/default-avatar.png';
                            const clientContent = t.content || t.message || '';
                            const clientRating = Number(t.rating) || 5;
                            return (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial}
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                                className="flex flex-col items-center"
                            >
                                {/* Quote mark */}
                                <span className="text-6xl text-brand-400/30 font-serif leading-none mb-4">&ldquo;</span>

                                <p className="text-lg sm:text-xl text-surface-300 leading-relaxed mb-8 max-w-xl">
                                    {clientContent}
                                </p>

                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: clientRating }).map((_, si) => (
                                        <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-700">
                                        <Image
                                            src={clientAvatar}
                                            alt={clientName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-semibold text-white">{clientName}</h4>
                                        <p className="text-xs text-surface-500">{clientRole}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                            );
                        })()}

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <button
                                onClick={prevTestimonial}
                                className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:text-white hover:border-surface-500 transition-colors"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <span className="text-xs text-surface-500 font-mono">
                                {activeTestimonial + 1} / {testimonials.length}
                            </span>
                            <button
                                onClick={nextTestimonial}
                                className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:text-white hover:border-surface-500 transition-colors"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FAQ — Accordion
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 border-t border-surface-800/50">
                <div className="section-container max-w-3xl">
                    <AnimatedSection className="text-center mb-14">
                        <p className="text-sm font-mono text-brand-400 mb-3 tracking-wider uppercase">FAQ</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Questions <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">answered</span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <div className="border-t border-surface-800/60">
                            {faqs.map((faq, i) => (
                                <FaqItem
                                    key={i}
                                    faq={faq}
                                    isOpen={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                                />
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FINAL CTA
               ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-36 relative overflow-hidden">
                {/* Accent bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-surface-950 to-accent-500/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 60%)' }} />

                <div className="section-container relative z-10 text-center">
                    <AnimatedSection>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Ready to build something<br />
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">extraordinary?</span>
                        </h2>
                        <p className="text-surface-400 mb-10 max-w-md mx-auto">
                            No credit card required. Free consultation. Let us show you what is possible.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <MagneticButton>
                                <button onClick={triggerCTA} className="btn-primary btn-glow group text-base px-10 py-4 inline-flex items-center gap-2">
                                    <MessageCircle size={18} />
                                    Get Started
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </MagneticButton>
                            <MagneticButton>
                                <Link href="/pricing" className="btn-secondary group text-base px-10 py-4 inline-flex items-center gap-2">
                                    View Pricing
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </MagneticButton>
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

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <HomeContent />
        </Suspense>
    );
}


