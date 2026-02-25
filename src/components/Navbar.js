'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const serviceLinks = [
    { label: 'Website Development', href: '/services/web-development' },
    { label: 'Application', href: '/services/application' },
    { label: 'WordPress Website', href: '/services/wordpress' },
    { label: 'E-Commerce', href: '/services/ecommerce' },
];

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services', dropdown: serviceLinks },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Project', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const checkUser = async (session) => {
            setUser(session?.user ?? null);
            setIsAdmin(false);
            if (session?.access_token) {
                try {
                    const res = await fetch('/api/check-admin', {
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    });
                    const data = await res.json();
                    setIsAdmin(data.isAdmin === true);
                } catch {
                    setIsAdmin(false);
                }
            }
        };
        supabase.auth.getSession().then(({ data: { session } }) => checkUser(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkUser(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setMobileOpen(false);
        router.push('/');
    };

    const getUserInitial = () => {
        if (!user) return '?';
        const name = user.user_metadata?.full_name || user.email || '';
        return name.charAt(0).toUpperCase();
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500">
            <div
                className={`flex items-center justify-between h-14 px-5 lg:px-8 rounded-full transition-all duration-500 ${scrolled
                    ? 'backdrop-blur-xl bg-surface-950/70 border border-white/10 shadow-elevated'
                    : 'bg-transparent border border-transparent'
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1">
                    <span className="text-xl font-bold tracking-tight text-white">MV</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2" />
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) =>
                        link.dropdown ? (
                            <div
                                key={link.label}
                                className="relative"
                                ref={dropdownRef}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <button
                                    className="flex items-center gap-1 text-sm font-medium text-surface-400 hover:text-white transition-colors duration-200"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    {link.label}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showDropdown && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                                        <div className="bg-surface-900 border border-surface-700 rounded-xl shadow-xl py-2 min-w-[220px] backdrop-blur-xl">
                                            {link.dropdown.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className="block px-5 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-surface-400 hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative flex items-center gap-2 h-auto p-1 hover:bg-transparent">
                                    <Avatar className="h-8 w-8 ring-2 ring-brand-400/30 hover:ring-brand-400/60 transition-all">
                                        <AvatarFallback className="bg-brand-500 text-white text-sm font-semibold">
                                            {getUserInitial()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown size={14} className="text-surface-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-surface-900 border-surface-700">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || 'User'}</p>
                                        <p className="text-xs text-surface-400 truncate">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-surface-800" />
                                <DropdownMenuItem asChild className="text-surface-300 focus:text-white focus:bg-surface-800 cursor-pointer">
                                    <Link href="/profile" className="flex items-center gap-3">
                                        <User size={16} /> My Profile
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <DropdownMenuItem asChild className="text-surface-300 focus:text-white focus:bg-surface-800 cursor-pointer">
                                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                                            <LayoutDashboard size={16} /> Admin Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-surface-800" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-surface-800 cursor-pointer">
                                    <LogOut size={16} className="mr-3" /> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="text-surface-300 hover:text-white hover:bg-transparent text-sm font-medium">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="md:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-surface-300 hover:bg-transparent">
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-surface-950 border-surface-800 w-[300px]">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Site navigation and user menu</SheetDescription>
                            <div className="flex flex-col gap-1 mt-6">
                                {navLinks.map((link) =>
                                    link.dropdown ? (
                                        <div key={link.label}>
                                            <button
                                                className="w-full flex items-center justify-between text-surface-300 hover:text-white transition-colors text-base font-medium py-3"
                                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                            >
                                                {link.label}
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {mobileServicesOpen && (
                                                <div className="pl-4 pb-2 flex flex-col gap-1">
                                                    {link.dropdown.map((sub) => (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                                                            className="text-surface-400 hover:text-white transition-colors text-sm py-2 pl-2 border-l border-surface-800"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="text-surface-300 hover:text-white transition-colors text-base font-medium py-3"
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                )}
                                <Separator className="bg-surface-800/50 my-2" />
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 py-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-brand-500 text-white text-sm font-semibold">
                                                    {getUserInitial()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || 'User'}</p>
                                                <p className="text-xs text-surface-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors text-sm py-2.5 pl-1">
                                            <User size={16} /> My Profile
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-surface-300 hover:text-white transition-colors text-sm py-2.5 pl-1">
                                                <LayoutDashboard size={16} /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-sm py-2.5 pl-1 w-full">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full mt-2 border-surface-700 text-surface-300 hover:text-white hover:bg-surface-800">
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
