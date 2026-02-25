-- ═══════════════════════════════════════════════════════════════
--  Seed existing blog posts & case studies into the database
--  Run this in Supabase SQL Editor AFTER creating the tables
-- ═══════════════════════════════════════════════════════════════

-- ─── BLOG POSTS ─────────────────────────────────────────────────

INSERT INTO blog_posts (title, slug, excerpt, category, content, read_time, keywords, cover_image_url, is_published, created_at)
VALUES
(
    'Creative Technologist: What It Means for Your Business',
    'creative-technologist-what-it-means-for-your-business',
    'Why modern brands need someone who can combine design thinking, engineering, and growth strategy.',
    'Strategy',
    ARRAY[
        'A creative technologist blends design, code, and business strategy into one practical execution role.',
        'Instead of treating design and development as separate silos, this approach ships faster and keeps the user experience consistent.',
        'For businesses, this means better conversion paths, cleaner performance, and fewer handoff errors during project delivery.',
        'If your website is a growth channel, not just a brochure, you need technical decisions tied directly to business outcomes.',
        'This is where creative technology becomes a competitive edge: stronger UX, measurable performance, and faster iteration.'
    ],
    '6 min read',
    ARRAY['creative technologist', 'web design strategy', 'conversion-focused websites', 'digital growth'],
    '',
    true,
    '2026-02-20T00:00:00Z'
),
(
    'SEO Foundation for Small Business Websites',
    'seo-foundation-for-small-business-websites',
    'A practical checklist to build search visibility from day one, without overcomplicated tactics.',
    'SEO',
    ARRAY[
        'Good SEO starts with structure: fast pages, clean URLs, semantic headings, and crawlable content.',
        'Set page intent first. Every service page should target one clear search demand and one conversion action.',
        'Use unique metadata, internal links, and schema where relevant. Avoid duplicate sections across pages.',
        'For local businesses, location-specific landing pages and optimized Google Business Profile data can drive qualified traffic.',
        'Measure impact monthly: impressions, click-through rate, and lead quality. SEO is a system, not a one-time task.'
    ],
    '8 min read',
    ARRAY['small business seo', 'technical seo checklist', 'on-page seo', 'local seo'],
    '',
    true,
    '2026-02-18T00:00:00Z'
),
(
    'Website Speed and Conversion: A Practical Guide',
    'website-speed-conversion-guide',
    'How performance optimization directly affects user trust, retention, and revenue.',
    'Performance',
    ARRAY[
        'Slow pages lose attention in seconds. Speed is not only technical quality, it is conversion quality.',
        'Start with image optimization, route-level code splitting, and caching strategy. Fix heavy scripts early.',
        'Track Core Web Vitals, especially LCP and INP, because they strongly correlate with user experience quality.',
        'Faster interfaces reduce bounce rate and improve trust, especially on mobile users with weaker networks.',
        'Performance work should be continuous. The best teams treat speed as a product requirement, not a cleanup task.'
    ],
    '7 min read',
    ARRAY['website speed optimization', 'core web vitals', 'conversion rate optimization', 'nextjs performance'],
    '',
    true,
    '2026-02-15T00:00:00Z'
)
ON CONFLICT (slug) DO NOTHING;


-- ─── CASE STUDIES ───────────────────────────────────────────────

INSERT INTO case_studies (title, slug, client, industry, timeline, services, tech, hero_image_url, challenge, solution, outcome, is_published, created_at)
VALUES
(
    'Nova Dashboard: From Data Noise to Actionable SaaS Insights',
    'nova-dashboard-saas-growth',
    'Nova Analytics',
    'SaaS',
    '6 weeks',
    ARRAY['Product Design', 'Full-Stack Development', 'Performance Optimization'],
    ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
    'The existing dashboard was slow, visually cluttered, and difficult for non-technical teams to use during decision-making.',
    'We redesigned core user journeys, built a modular dashboard architecture, and optimized API + rendering performance for real-time analytics.',
    ARRAY['42% increase in weekly active users', '31% faster report generation', '27% improvement in trial-to-paid conversion'],
    true,
    now()
),
(
    'Urban Threads: E-Commerce Redesign That Improved Conversion',
    'urban-threads-ecommerce-conversion-lift',
    'Urban Threads',
    'Fashion E-Commerce',
    '5 weeks',
    ARRAY['E-Commerce UX', 'Checkout Optimization', 'SEO Foundation'],
    ARRAY['Shopify', 'JavaScript', 'Razorpay', 'GA4'],
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
    'The store had strong traffic but weak conversion because of slow mobile pages, poor filtering, and checkout friction.',
    'We redesigned product discovery, improved mobile performance, and streamlined checkout with better trust and shipping signals.',
    ARRAY['2.1x mobile conversion rate', '18% increase in average order value', '36% reduction in cart abandonment'],
    true,
    now()
),
(
    'MedCare Clinic: Website + Local SEO Growth Engine',
    'medcare-clinic-local-seo-growth',
    'MedCare Clinic',
    'Healthcare',
    '4 weeks',
    ARRAY['Website Redesign', 'Local SEO', 'Lead Capture Automation'],
    ARRAY['WordPress', 'Elementor', 'Yoast SEO', 'Cloudflare'],
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80',
    'The clinic site was outdated, difficult to navigate on mobile, and not ranking for high-intent local keywords.',
    'We rebuilt the website with clear service pages, local SEO structure, and conversion-focused appointment flows.',
    ARRAY['68% increase in organic local traffic', '2.4x online appointment bookings', 'PageSpeed score improved from 49 to 92'],
    true,
    now()
)
ON CONFLICT (slug) DO NOTHING;
