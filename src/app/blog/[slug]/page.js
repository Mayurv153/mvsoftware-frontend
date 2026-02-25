'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';
import { getPublicBlogBySlug, toggleBlogLike, addBlogComment } from '@/lib/api';
import { getBlogPostBySlug } from '@/content/blogPosts';
import { supabase } from '@/lib/supabase';
import { Heart, MessageCircle, Send, User } from 'lucide-react';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug;
    const [post, setPost] = useState(null);
    const [postId, setPostId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentForm, setCommentForm] = useState({ user_name: '', user_email: '', content: '' });
    const [commentSending, setCommentSending] = useState(false);
    const [commentMsg, setCommentMsg] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        loadPost();
        loadUser();
    }, [slug]);

    // Realtime subscription for live like count
    useEffect(() => {
        if (!postId) return;

        const channel = supabase
            .channel(`blog-likes-${postId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'blog_likes',
                filter: `post_id=eq.${postId}`,
            }, () => {
                // Refresh like count from DB
                refreshLikeCount();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId]);

    const refreshLikeCount = async () => {
        if (!postId) return;
        try {
            const { count } = await supabase
                .from('blog_likes')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId);
            setLikesCount(count || 0);
        } catch (_) { }
    };

    const checkIfAlreadyLiked = async (pid) => {
        try {
            const uid = getOrCreateUserId();
            const { data } = await supabase
                .from('blog_likes')
                .select('id')
                .eq('post_id', pid)
                .eq('user_id', uid)
                .single();
            if (data) setLiked(true);
        } catch (_) { }
    };

    const loadUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) setUserId(session.user.id);
        } catch (_) { }
    };

    const loadPost = async () => {
        setLoading(true);
        try {
            const apiPost = await getPublicBlogBySlug(slug);
            if (apiPost) {
                setPost({
                    ...apiPost,
                    readTime: apiPost.read_time,
                    date: new Date(apiPost.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
                });
                setPostId(apiPost.id);
                setLikesCount(apiPost.likes_count || 0);
                setComments(apiPost.comments || []);
                checkIfAlreadyLiked(apiPost.id);
            } else {
                const staticPost = getBlogPostBySlug(slug);
                if (staticPost) setPost(staticPost);
            }
        } catch (_) {
            const staticPost = getBlogPostBySlug(slug);
            if (staticPost) setPost(staticPost);
        } finally {
            setLoading(false);
        }
    };

    const getOrCreateUserId = () => {
        if (userId) return userId;
        let anonId = localStorage.getItem('mv_anon_id');
        if (!anonId) {
            anonId = crypto.randomUUID();
            localStorage.setItem('mv_anon_id', anonId);
        }
        return anonId;
    };

    const handleLike = async () => {
        try {
            const uid = getOrCreateUserId();
            const res = await toggleBlogLike(slug, uid);
            const nowLiked = res?.data?.liked;
            setLiked(nowLiked);
            if (nowLiked) {
                setLikeAnimating(true);
                setTimeout(() => setLikeAnimating(false), 600);
            }
            // Realtime subscription will update the count for everyone
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentForm.user_name.trim() || !commentForm.content.trim()) return;
        setCommentSending(true);
        try {
            await addBlogComment(slug, commentForm);
            setCommentMsg('Comment submitted for review!');
            setCommentForm({ user_name: '', user_email: '', content: '' });
            setTimeout(() => setCommentMsg(''), 5000);
        } catch (_) {
            setCommentMsg('Failed to submit comment');
        } finally {
            setCommentSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-surface-400">Blog post not found</p>
            </div>
        );
    }

    return (
        <>
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
                <div className="section-container relative z-10 max-w-3xl">
                    <AnimatedSection>
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4">{post.category}</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">{post.title}</h1>
                        <p className="text-surface-400 text-lg leading-relaxed mb-6">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-surface-500">
                            <span>{post.date}</span>
                            <span>-</span>
                            <span>{post.readTime || post.read_time}</span>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <section className="py-12 border-t border-surface-800/50">
                <div className="section-container max-w-3xl">
                    <article className="space-y-5">
                        {(post.content || []).map((paragraph, index) => (
                            <AnimatedSection key={index} delay={index * 0.05}>
                                <p className="text-surface-300 leading-relaxed text-base sm:text-lg">{paragraph}</p>
                            </AnimatedSection>
                        ))}
                    </article>

                    {/* Like & Engagement Bar */}
                    <div className="mt-12 pt-8 border-t border-surface-800/50">
                        <div className="flex items-center gap-6">
                            <button onClick={handleLike}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${liked
                                    ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                                    : 'border-surface-700 text-surface-400 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5'}`}>
                                <Heart size={18} className={`transition-all duration-300 ${liked ? 'fill-red-400' : ''} ${likeAnimating ? 'scale-[1.4]' : 'scale-100'}`}
                                    style={{ transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                                <span className="text-sm font-semibold tabular-nums">{likesCount}</span>
                                {likesCount > 0 && <span className="text-xs text-surface-500 hidden sm:inline">{likesCount === 1 ? 'person loves this' : 'people love this'}</span>}
                            </button>
                            <div className="flex items-center gap-2 text-surface-400">
                                <MessageCircle size={18} />
                                <span className="text-sm">{comments.length} comments</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-10">
                        <h3 className="text-xl font-semibold text-white mb-6">Comments</h3>

                        {/* Comment form */}
                        <form onSubmit={handleComment} className="card p-5 mb-8 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={commentForm.user_name} onChange={e => setCommentForm({ ...commentForm, user_name: e.target.value })}
                                    placeholder="Your name *" required
                                    className="px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm placeholder:text-surface-500 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none" />
                                <input value={commentForm.user_email} onChange={e => setCommentForm({ ...commentForm, user_email: e.target.value })}
                                    placeholder="Email (optional)" type="email"
                                    className="px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm placeholder:text-surface-500 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none" />
                            </div>
                            <textarea value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })}
                                placeholder="Share your thoughts..." rows={3} required
                                className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm placeholder:text-surface-500 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none resize-none" />
                            <div className="flex items-center justify-between">
                                {commentMsg && <p className="text-sm text-brand-400">{commentMsg}</p>}
                                <button type="submit" disabled={commentSending}
                                    className="ml-auto px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors">
                                    <Send size={14} />{commentSending ? 'Sending...' : 'Post Comment'}
                                </button>
                            </div>
                        </form>

                        {/* Comments list */}
                        <div className="space-y-4">
                            {comments.length === 0 && (
                                <p className="text-surface-500 text-sm text-center py-6">No comments yet. Be the first to share your thoughts!</p>
                            )}
                            {comments.map(c => (
                                <div key={c.id} className="card p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-semibold">
                                            {(c.user_name || '?')[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-white">{c.user_name}</span>
                                        <span className="text-xs text-surface-500">{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-surface-300 text-sm leading-relaxed">{c.content}</p>
                                    {c.admin_reply && (
                                        <div className="mt-3 ml-4 border-l-2 border-brand-400/30 pl-3">
                                            <p className="text-xs text-brand-400 font-medium mb-0.5">MV Webservice</p>
                                            <p className="text-sm text-surface-300">{c.admin_reply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
