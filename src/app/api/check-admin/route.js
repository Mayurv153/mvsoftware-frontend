import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/server/adminEmails';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

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

        const isAdmin = isAdminEmail(user.email);

        return NextResponse.json({ isAdmin }, { headers: noStoreHeaders });
    } catch {
        return NextResponse.json({ isAdmin: false }, { status: 500, headers: noStoreHeaders });
    }
}
