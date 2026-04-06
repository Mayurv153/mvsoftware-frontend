export const blogPosts = [
    {
        slug: 'creative-technologist-what-it-means-for-your-business',
        title: 'Creative Technologist: What It Means for Your Business',
        excerpt: 'Why modern brands need someone who can combine design thinking, engineering, and growth strategy.',
        category: 'Strategy',
        date: '2026-02-20',
        readTime: '6 min read',
        keywords: [
            'creative technologist',
            'web design strategy',
            'conversion-focused websites',
            'digital growth',
        ],
        content: [
            'A creative technologist blends design, code, and business strategy into one practical execution role.',
            'Instead of treating design and development as separate silos, this approach ships faster and keeps the user experience consistent.',
            'For businesses, this means better conversion paths, cleaner performance, and fewer handoff errors during project delivery.',
            'If your website is a growth channel, not just a brochure, you need technical decisions tied directly to business outcomes.',
            'This is where creative technology becomes a competitive edge: stronger UX, measurable performance, and faster iteration.',
        ],
    },
    {
        slug: 'seo-foundation-for-small-business-websites',
        title: 'SEO Foundation for Small Business Websites',
        excerpt: 'A practical checklist to build search visibility from day one, without overcomplicated tactics.',
        category: 'SEO',
        date: '2026-02-18',
        readTime: '8 min read',
        keywords: [
            'small business seo',
            'technical seo checklist',
            'on-page seo',
            'local seo',
        ],
        content: [
            'Good SEO starts with structure: fast pages, clean URLs, semantic headings, and crawlable content.',
            'Set page intent first. Every service page should target one clear search demand and one conversion action.',
            'Use unique metadata, internal links, and schema where relevant. Avoid duplicate sections across pages.',
            'For local businesses, location-specific landing pages and optimized Google Business Profile data can drive qualified traffic.',
            'Measure impact monthly: impressions, click-through rate, and lead quality. SEO is a system, not a one-time task.',
        ],
    },
    {
        slug: 'website-speed-conversion-guide',
        title: 'Website Speed and Conversion: A Practical Guide',
        excerpt: 'How performance optimization directly affects user trust, retention, and revenue.',
        category: 'Performance',
        date: '2026-02-15',
        readTime: '7 min read',
        keywords: [
            'website speed optimization',
            'core web vitals',
            'conversion rate optimization',
            'nextjs performance',
        ],
        content: [
            'Slow pages lose attention in seconds. Speed is not only technical quality, it is conversion quality.',
            'Start with image optimization, route-level code splitting, and caching strategy. Fix heavy scripts early.',
            'Track Core Web Vitals, especially LCP and INP, because they strongly correlate with user experience quality.',
            'Faster interfaces reduce bounce rate and improve trust, especially on mobile users with weaker networks.',
            'Performance work should be continuous. The best teams treat speed as a product requirement, not a cleanup task.',
        ],
    },
];

export function getAllBlogPosts() {
    return [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getBlogPostBySlug(slug) {
    return blogPosts.find((post) => post.slug === slug);
}
