export const caseStudies = [
    {
        slug: 'nova-dashboard-saas-growth',
        title: 'Nova Dashboard: From Data Noise to Actionable SaaS Insights',
        client: 'Nova Analytics',
        industry: 'SaaS',
        timeline: '6 weeks',
        services: ['Product Design', 'Full-Stack Development', 'Performance Optimization'],
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
        challenge:
            'The existing dashboard was slow, visually cluttered, and difficult for non-technical teams to use during decision-making.',
        solution:
            'We redesigned core user journeys, built a modular dashboard architecture, and optimized API + rendering performance for real-time analytics.',
        outcome: [
            '42% increase in weekly active users',
            '31% faster report generation',
            '27% improvement in trial-to-paid conversion',
        ],
        tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
    },
    {
        slug: 'urban-threads-ecommerce-conversion-lift',
        title: 'Urban Threads: E-Commerce Redesign That Improved Conversion',
        client: 'Urban Threads',
        industry: 'Fashion E-Commerce',
        timeline: '5 weeks',
        services: ['E-Commerce UX', 'Checkout Optimization', 'SEO Foundation'],
        heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
        challenge:
            'The store had strong traffic but weak conversion because of slow mobile pages, poor filtering, and checkout friction.',
        solution:
            'We redesigned product discovery, improved mobile performance, and streamlined checkout with better trust and shipping signals.',
        outcome: [
            '2.1x mobile conversion rate',
            '18% increase in average order value',
            '36% reduction in cart abandonment',
        ],
        tech: ['Shopify', 'JavaScript', 'Razorpay', 'GA4'],
    },
    {
        slug: 'medcare-clinic-local-seo-growth',
        title: 'MedCare Clinic: Website + Local SEO Growth Engine',
        client: 'MedCare Clinic',
        industry: 'Healthcare',
        timeline: '4 weeks',
        services: ['Website Redesign', 'Local SEO', 'Lead Capture Automation'],
        heroImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80',
        challenge:
            'The clinic site was outdated, difficult to navigate on mobile, and not ranking for high-intent local keywords.',
        solution:
            'We rebuilt the website with clear service pages, local SEO structure, and conversion-focused appointment flows.',
        outcome: [
            '68% increase in organic local traffic',
            '2.4x online appointment bookings',
            'PageSpeed score improved from 49 to 92',
        ],
        tech: ['WordPress', 'Elementor', 'Yoast SEO', 'Cloudflare'],
    },
];

export function getAllCaseStudies() {
    return caseStudies;
}

export function getCaseStudyBySlug(slug) {
    return caseStudies.find((cs) => cs.slug === slug);
}
