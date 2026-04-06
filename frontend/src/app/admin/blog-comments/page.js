'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminBlogComments, replyAdminComment, approveAdminComment, deleteAdminComment } from '@/lib/api';
import { Trash2, X, Check, Search, MessageCircle, CheckCircle, XCircle, Reply, Send } from 'lucide-react';

export default function AdminBlogComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await getAdminBlogComments(session.access_token);
            setComments(res.data?.comments || []);
        } catch (err) { console.error('Load error:', err); }
        finally { setLoading(false); }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleApprove = async (id, approve) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await approveAdminComment(session.access_token, id, approve);
            showToast(approve ? 'Comment approved' : 'Comment rejected');
            loadData();
        } catch (err) { console.error('Approve error:', err); showToast('Failed'); }
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await replyAdminComment(session.access_token, id, replyText);
            showToast('Reply sent');
            setReplyingId(null);
            setReplyText('');
            loadData();
        } catch (err) { console.error('Reply error:', err); showToast('Failed'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await deleteAdminComment(session.access_token, id);
            setDeleteId(null);
            showToast('Comment deleted');
            loadData();
        } catch (err) { console.error('Delete error:', err); showToast('Failed'); }
    };

    const filtered = comments.filter(c => {
        if (filter === 'pending' && c.is_approved) return false;
        if (filter === 'approved' && !c.is_approved) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (c.user_name || '').toLowerCase().includes(q) ||
            (c.content || '').toLowerCase().includes(q) ||
            (c.blog_posts?.title || '').toLowerCase().includes(q);
    });

    const pendingCount = comments.filter(c => !c.is_approved).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />{toast}
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Comment?</h3>
                        <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog Comments</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {comments.length} comments {pendingCount > 0 && <span className="text-amber-600 font-medium">({pendingCount} pending)</span>}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative max-w-sm flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search comments..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div className="flex gap-1.5">
                    {['all', 'pending', 'approved'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                                : 'text-slate-500 hover:bg-slate-50'}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <MessageCircle size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No comments found</p>
                    </div>
                ) : (
                    filtered.map(c => (
                        <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                            {(c.user_name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{c.user_name}</p>
                                            <p className="text-xs text-slate-400">{c.user_email || 'No email'}</p>
                                        </div>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ring-inset ${c.is_approved
                                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                            : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
                                            {c.is_approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 mb-2">
                                        on <span className="font-medium text-slate-600">{c.blog_posts?.title || 'Unknown post'}</span>
                                        {' · '}{new Date(c.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{c.content}</p>

                                    {c.admin_reply && (
                                        <div className="mt-2 ml-4 border-l-2 border-teal-200 pl-3">
                                            <p className="text-xs text-teal-600 font-medium mb-0.5">Admin Reply:</p>
                                            <p className="text-sm text-slate-600">{c.admin_reply}</p>
                                        </div>
                                    )}

                                    {replyingId === c.id && (
                                        <div className="mt-3 flex gap-2">
                                            <input value={replyText} onChange={e => setReplyText(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="Type your reply..." onKeyDown={e => e.key === 'Enter' && handleReply(c.id)} />
                                            <button onClick={() => handleReply(c.id)} disabled={saving || !replyText.trim()}
                                                className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm disabled:opacity-50">
                                                <Send size={14} />
                                            </button>
                                            <button onClick={() => { setReplyingId(null); setReplyText(''); }}
                                                className="px-3 py-2 border border-slate-300 text-slate-500 rounded-lg hover:bg-slate-50 text-sm">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {!c.is_approved && (
                                        <button onClick={() => handleApprove(c.id, true)} title="Approve"
                                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600">
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    {c.is_approved && (
                                        <button onClick={() => handleApprove(c.id, false)} title="Reject"
                                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                    <button onClick={() => { setReplyingId(c.id); setReplyText(c.admin_reply || ''); }} title="Reply"
                                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600">
                                        <Reply size={16} />
                                    </button>
                                    <button onClick={() => setDeleteId(c.id)} title="Delete"
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
