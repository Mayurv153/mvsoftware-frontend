import { getAllBlogPosts } from '@/content/blogPosts';
import { getAllCaseStudies } from '@/content/caseStudies';

const BASE_URL = 'https://mvwebservice.com';

export default function sitemap() {
    const now = new Date().toISOString();
    const blogPosts = getAllBlogPosts();
    const caseStudies = getAllCaseStudies();

    const staticPages = [
        { url: `${BASE_URL}`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/services/web-development`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/services/application`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/services/wordpress`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/services/ecommerce`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ];

    const blogPages = blogPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const caseStudyPages = caseStudies.map((study) => ({
        url: `${BASE_URL}/case-studies/${study.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticPages, ...blogPages, ...caseStudyPages];
}
