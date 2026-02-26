import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/server/adminEmails';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

function normalizeApiBase(value) {
    return String(value || '')
        .replace(/\r|\n/g, '')
        .trim()
        .replace(/^['"]+|['"]+$/g, '')
        .replace(/\/+$/, '')
        .replace(/\/api$/i, '');
}

async function checkBackendAdmin(token) {
    const apiBase = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
    if (!apiBase) return false;

    try {
        const response = await fetch(`${apiBase}/api/check-admin`, {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data?.isAdmin === true;
    } catch {
        return false;
    }
}

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ isAdmin: false }, { status: 401, headers: noStoreHeaders });
        }

        const token = authHeader.split(' ')[1];

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json({ isAdmin: false }, { status: 401, headers: noStoreHeaders });
        }

        const isAdmin = isAdminEmail(user.email) || await checkBackendAdmin(token);

        return NextResponse.json({ isAdmin }, { headers: noStoreHeaders });
    } catch {
        return NextResponse.json({ isAdmin: false }, { status: 500, headers: noStoreHeaders });
    }
}
