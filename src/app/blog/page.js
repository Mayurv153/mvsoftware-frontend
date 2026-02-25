import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicBlogs } from '@/lib/api';
import { getAllBlogPosts } from '@/content/blogPosts';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let posts = [];

    try {
        const apiPosts = await getPublicBlogs();
        if (apiPosts && apiPosts.length > 0) {
            posts = apiPosts.map(p => ({
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                category: p.category,
                readTime: p.read_time,
                date: new Date(p.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
                likesCount: p.likes_count || 0,
                commentsCount: p.comments_count || 0,
            }));
        }
    } catch (_) { /* fall through to static */ }

    if (posts.length === 0) {
        posts = getAllBlogPosts();
    }

    return (
        <>
            <section className="relative overflow-hidden py-28 lg:py-36">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10">
                    <AnimatedSection className="text-center max-w-3xl mx-auto">
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">Blog</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                            Practical Insights for
                            <span className="block bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Growth-Focused Websites</span>
                        </h1>
                        <p className="text-surface-400 text-lg">
                            Actionable content on SEO, performance, and creative technology for real business outcomes.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            <section className="py-16 border-t border-surface-800/50">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, i) => (
                            <AnimatedSection key={post.slug} delay={i * 0.06}>
                                <article className="card p-6 h-full flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-400">{post.category}</span>
                                        <span className="text-surface-600">-</span>
                                        <span className="text-xs text-surface-500">{post.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-3 leading-snug">{post.title}</h2>
                                    <p className="text-surface-400 text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-surface-500">{post.date}</span>
                                        <Link href={`/blog/${post.slug}`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                                            Read article
                                        </Link>
                                    </div>
                                </article>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
