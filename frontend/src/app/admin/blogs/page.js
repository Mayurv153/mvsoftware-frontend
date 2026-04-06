'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminBlogs, createAdminBlog, updateAdminBlog, deleteAdminBlog } from '@/lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Search, FileText, Heart, MessageCircle } from 'lucide-react';

const emptyForm = {
    title: '', slug: '', excerpt: '', category: '', content: [''], read_time: '5 min read',
    keywords: [''], cover_image_url: '', is_published: false,
};

export default function AdminBlogs() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await getAdminBlogs(session.access_token);
            setPosts(res.data?.posts || []);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const openCreate = () => { setEditingId(null); setForm({ ...emptyForm, content: [''], keywords: [''] }); setModalOpen(true); };

    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            title: p.title || '', slug: p.slug || '', excerpt: p.excerpt || '',
            category: p.category || '', content: p.content?.length ? p.content : [''],
            read_time: p.read_time || '5 min read', keywords: p.keywords?.length ? p.keywords : [''],
            cover_image_url: p.cover_image_url || '', is_published: p.is_published || false,
        });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...emptyForm }); };

    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const token = session.access_token;
            const payload = {
                ...form,
                slug: form.slug || generateSlug(form.title),
                content: form.content.filter(p => p.trim()),
                keywords: form.keywords.filter(k => k.trim()),
            };

            if (editingId) {
                await updateAdminBlog(token, editingId, payload);
                showToast('Blog post updated');
            } else {
                await createAdminBlog(token, payload);
                showToast('Blog post created');
            }
            closeModal();
            loadData();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await deleteAdminBlog(session.access_token, id);
            setDeleteId(null);
            showToast('Blog post deleted');
            loadData();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete');
        }
    };

    const togglePublish = async (p) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminBlog(session.access_token, p.id, { is_published: !p.is_published });
            showToast(p.is_published ? 'Unpublished' : 'Published');
            loadData();
        } catch (err) { console.error('Toggle error:', err); }
    };

    const updateContentParagraph = (index, value) => {
        const updated = [...form.content];
        updated[index] = value;
        setForm({ ...form, content: updated });
    };

    const addParagraph = () => setForm({ ...form, content: [...form.content, ''] });
    const removeParagraph = (i) => setForm({ ...form, content: form.content.filter((_, idx) => idx !== i) });

    const updateKeyword = (index, value) => {
        const updated = [...form.keywords];
        updated[index] = value;
        setForm({ ...form, keywords: updated });
    };
    const addKeyword = () => setForm({ ...form, keywords: [...form.keywords, ''] });
    const removeKeyword = (i) => setForm({ ...form, keywords: form.keywords.filter((_, idx) => idx !== i) });

    const filtered = posts.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (p.title || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
    });

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
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Blog Post?</h3>
                        <p className="text-sm text-slate-500 mb-6">This will also delete all comments and likes. This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingId ? 'Edit Blog Post' : 'Create Blog Post'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    placeholder="Blog post title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                    <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="auto-generated-from-title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="SEO, Strategy, Performance..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                    placeholder="Short description of the blog post" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Content Paragraphs</label>
                                {form.content.map((para, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <textarea value={para} onChange={e => updateContentParagraph(i, e.target.value)} rows={2}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                            placeholder={`Paragraph ${i + 1}`} />
                                        {form.content.length > 1 && (
                                            <button onClick={() => removeParagraph(i)} className="p-1.5 text-red-400 hover:text-red-600 self-start mt-1"><Trash2 size={14} /></button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addParagraph} className="text-sm text-teal-600 hover:text-teal-700 font-medium">+ Add paragraph</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Read Time</label>
                                    <input value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="5 min read" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                                    <input value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="https://..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Keywords</label>
                                <div className="flex flex-wrap gap-2">
                                    {form.keywords.map((kw, i) => (
                                        <div key={i} className="flex items-center gap-1">
                                            <input value={kw} onChange={e => updateKeyword(i, e.target.value)}
                                                className="w-32 px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="keyword" />
                                            {form.keywords.length > 1 && (
                                                <button onClick={() => removeKeyword(i)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addKeyword} className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2">+ Add keyword</button>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setForm({ ...form, is_published: !form.is_published })} className="flex items-center gap-2 text-sm text-slate-600">
                                    {form.is_published ? <Eye size={18} className="text-teal-500" /> : <EyeOff size={18} className="text-slate-400" />}
                                    {form.is_published ? 'Published' : 'Draft'}
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title.trim()}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50">
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                    <p className="text-sm text-slate-500 mt-1">{posts.length} posts</p>
                </div>
                <button onClick={openCreate} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16} />Add Blog Post
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blog posts..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No blog posts found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-5 py-3 font-medium">Title</th>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 font-medium">Engagement</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-900 truncate max-w-xs">{p.title}</p>
                                            <p className="text-xs text-slate-400 truncate">{p.slug}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{p.category || '—'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Heart size={13} className="text-red-400" />{p.likes_count}</span>
                                                <span className="flex items-center gap-1"><MessageCircle size={13} className="text-blue-400" />{p.comments_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => togglePublish(p)}
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${p.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                    : 'bg-slate-50 text-slate-600 ring-slate-500/20'}`}>
                                                {p.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-500">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={15} /></button>
                                                <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
