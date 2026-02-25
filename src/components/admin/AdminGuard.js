'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.replace('/login');
                    return;
                }

                // Server-side admin check — email is NOT exposed in client
                const res = await fetch('/api/check-admin', {
                    cache: 'no-store',
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                const data = await res.json();

                if (!data.isAdmin) {
                    router.replace('/');
                    return;
                }

                setAuthorized(true);
            } catch {
                router.replace('/login');
            } finally {
                setChecking(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!authorized) return null;

    return children;
}
