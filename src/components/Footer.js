import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
    Services: [
        { label: 'UX/UI Design', href: '/services' },
        { label: 'Full-Stack Development', href: '/services' },
        { label: 'AI Automations', href: '/services' },
        { label: 'Brand Strategy', href: '/services' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
    ],
};

export default function Footer() {
    const whatsappUrl = `https://wa.me/919423699549?text=Hi%20mv%20webservice%20i%20need%20website%20for`;

    return (
        <footer className="bg-surface-950 rounded-t-[3.5rem] border-t border-surface-800/50 mt-[-1px]">
            <div className="section-container py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
                    {/* Brand col */}
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center gap-2.5 mb-5">
                            <Image src="/assets/logo.png" alt="MV Webservice" width={30} height={30} className="rounded-lg" />
                            <span className="text-base font-bold text-white">MV Webservice</span>
                        </Link>
                        <p className="text-sm text-surface-400 leading-relaxed mb-5 max-w-xs">
                            We craft premium digital experiences that elevate brands and drive measurable growth.
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
                        >
                            Chat on WhatsApp <ArrowUpRight size={14} />
                        </a>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="md:col-span-2">
                            <h4 className="text-xs font-semibold tracking-widest uppercase text-surface-500 mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-surface-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact col */}
                    <div className="md:col-span-4">
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-surface-500 mb-4">
                            Get in Touch
                        </h4>
                        <ul className="space-y-3 text-sm text-surface-400">
                            <li>
                                <a href="mailto:mayurvaidy902189@gmail.com" className="hover:text-white transition-colors">
                                    mayurvaidy902189@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+919021891120" className="hover:text-white transition-colors">
                                    +91 90218 91120
                                </a>
                            </li>
                            <li>India 🇮🇳</li>
                        </ul>
                    </div>
                </div>

                <Separator className="mt-14 bg-surface-800/50" />
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-surface-500">
                        © {new Date().getFullYear()} MV Webservice. All rights reserved.
                    </p>
                    {/* System Status Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                        <span className="text-xs text-surface-500 font-mono">System Operational</span>
                    </div>
                    <p className="text-xs text-surface-600">
                        Designed & built by Mayur Vaidya
                    </p>
                </div>
            </div>
        </footer>
    );
}
