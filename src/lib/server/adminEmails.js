import 'server-only';

function parseEmails(value) {
    return String(value || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export function getAdminEmails() {
    const merged = [
        ...parseEmails(process.env.ADMIN_EMAILS),
        ...parseEmails(process.env.NEXT_PUBLIC_ADMIN_EMAIL),
    ];

    return [...new Set(merged)];
}

export function isAdminEmail(email) {
    if (!email) return false;
    return getAdminEmails().includes(String(email).trim().toLowerCase());
}
