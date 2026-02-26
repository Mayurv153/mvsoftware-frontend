/** @type {import('next').NextConfig} */
const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const normalizedApiBase = rawApiBase
    .replace(/\\r|\\n/g, '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '');

const nextConfig = {
    images: {
        formats: ['image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'img.sanishtech.com' },
            { protocol: 'https', hostname: '**' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${normalizedApiBase}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
