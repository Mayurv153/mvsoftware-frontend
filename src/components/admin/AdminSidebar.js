'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    LayoutDashboard,
    MessageSquareText,
    CreditCard,
    Tag,
    Star,
    FolderKanban,
    Settings,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Globe,
    FileText,
    BookOpen,
    MessageCircle,
} from 'lucide-react';

const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Service Requests', href: '/admin/requests', icon: MessageSquareText },
    { label: 'Orders & Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Plans & Pricing', href: '/admin/plans', icon: Tag },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { label: 'Blog Posts', href: '/admin/blogs', icon: FileText },
    { label: 'Case Studies', href: '/admin/case-studies', icon: BookOpen },
    { label: 'Blog Comments', href: '/admin/blog-comments', icon: MessageCircle },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Portfolio', href: '/admin/portfolio', icon: Globe },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 shrink-0">
                <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MV</span>
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">MV Admin</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-400">
                    <X size={18} />
                </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${active
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={18} className={active ? 'text-teal-600' : 'text-slate-400'} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 space-y-0.5 shrink-0">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                    <ExternalLink size={18} className="text-slate-400" />
                    View Site
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-3 left-3 z-[52] w-10 h-10 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[53]" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 bottom-0 z-[54] w-64 bg-white shadow-xl flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <NavContent />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-slate-200 shrink-0">
                <NavContent />
            </aside>
        </>
    );
}
