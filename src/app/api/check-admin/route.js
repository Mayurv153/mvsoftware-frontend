import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/server/adminEmails';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ isAdmin: false }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json({ isAdmin: false }, { status: 401 });
        }

        const isAdmin = isAdminEmail(user.email);

        return NextResponse.json({ isAdmin });
    } catch {
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
}
