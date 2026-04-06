'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Hook that gates CTA actions behind authentication.
 * - If logged in → opens the service request modal.
 * - If not logged in → redirects to /login, then comes back and auto-opens.
 *
 * @param {object} opts
 * @param {string} [opts.planSlug]   – Pre-select a plan in the modal
 * @param {string} [opts.service]    – Pre-select a service type
 * @returns {{ triggerCTA, isModalOpen, closeModal, user }}
 */
export default function useAuthCTA(opts = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    // Check auth on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setChecked(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-open modal if returning from login with ?openRequest=true
    useEffect(() => {
        if (checked && user && searchParams.get('openRequest') === 'true') {
            setIsModalOpen(true);
            // Clean up the URL param without a full navigation
            const url = new URL(window.location.href);
            url.searchParams.delete('openRequest');
            window.history.replaceState({}, '', url.pathname + url.search);
        }
    }, [checked, user, searchParams]);

    const triggerCTA = useCallback(() => {
        if (user) {
            setIsModalOpen(true);
        } else {
            // Save current path so login redirects back with auto-open flag
            const currentPath = window.location.pathname;
            router.push(`/login?next=${encodeURIComponent(currentPath)}&openRequest=true`);
        }
    }, [user, router]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return { triggerCTA, isModalOpen, closeModal, user };
}
