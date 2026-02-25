import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next') ?? '/';
    const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';
    const oauthError = searchParams.get('error');
    const oauthErrorDescription = searchParams.get('error_description');

    const redirectToLoginWithMessage = (message) => {
        const loginUrl = new URL('/login', origin);
        loginUrl.searchParams.set('message', message);
        return NextResponse.redirect(loginUrl.toString());
    };

    // Provider-level errors can arrive without an auth code.
    if (oauthError || oauthErrorDescription) {
        const reason = oauthErrorDescription || oauthError || 'OAuth authentication failed';
        return redirectToLoginWithMessage(`Authentication failed: ${reason}`);
    }

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(tokensToSet) {
                        tokensToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if the user is admin to redirect appropriately
            const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
            const redirectPath = adminEmails.includes(data?.user?.email?.toLowerCase()) ? '/admin/dashboard' : next;
            return NextResponse.redirect(`${origin}${redirectPath}`);
        }

        console.error('[Auth Callback] Code exchange failed:', error?.message || error);
        return redirectToLoginWithMessage(`Authentication failed: ${error?.message || 'Code exchange failed'}`);
    }

    // If code exchange fails, redirect to login with error
    return redirectToLoginWithMessage('Authentication failed: Missing auth code');
}
