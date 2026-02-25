'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminTestimonials, createAdminTestimonial, updateAdminTestimonial, deleteAdminTestimonial } from '@/lib/api';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, X, Check, Search, MessageSquareQuote } from 'lucide-react';

const emptyForm = { client_name: '', client_role: '', client_company: '', content: '', rating: 5, is_published: false, avatar_url: '' };

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
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
            const res = await getAdminTestimonials(session.access_token);
            setTestimonials(res.data?.testimonials || []);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setModalOpen(true);
    };

    const openEdit = (t) => {
        setEditingId(t.id);
        setForm({
            client_name: t.client_name || '',
            client_role: t.client_role || '',
            client_company: t.client_company || '',
            content: t.content || '',
            rating: t.rating || 5,
            is_published: t.is_published || false,
            avatar_url: t.avatar_url || '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm({ ...emptyForm });
    };

    const handleSave = async () => {
        if (!form.client_name.trim() || !form.content.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const token = session.access_token;

            if (editingId) {
                await updateAdminTestimonial(token, editingId, form);
                showToast('Testimonial updated');
            } else {
                await createAdminTestimonial(token, form);
                showToast('Testimonial created');
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
            await deleteAdminTestimonial(session.access_token, id);
            setDeleteId(null);
            showToast('Testimonial deleted');
            loadData();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete');
        }
    };

    const togglePublish = async (t) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminTestimonial(session.access_token, t.id, { is_published: !t.is_published });
            showToast(t.is_published ? 'Unpublished' : 'Published');
            loadData();
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

    const filtered = testimonials.filter(t => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (t.client_name || '').toLowerCase().includes(q) ||
            (t.client_company || '').toLowerCase().includes(q) ||
            (t.content || '').toLowerCase().includes(q);
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
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    {toast}
                </div>
            )}

            {/* Delete confirmation */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Testimonial?</h3>
                        <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name *</label>
                                <input
                                    value={form.client_name}
                                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <input
                                        value={form.client_role}
                                        onChange={(e) => setForm({ ...form, client_role: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="CEO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                                    <input
                                        value={form.client_company}
                                        onChange={(e) => setForm({ ...form, client_company: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Testimonial Content *</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                    placeholder="What the client said about your work..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setForm({ ...form, rating: n })}
                                                className="p-0.5"
                                            >
                                                <Star size={22} className={n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                                    <input
                                        value={form.avatar_url}
                                        onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, is_published: !form.is_published })}
                                    className="flex items-center gap-2 text-sm text-slate-600"
                                >
                                    {form.is_published ? (
                                        <Eye size={18} className="text-teal-500" />
                                    ) : (
                                        <EyeOff size={18} className="text-slate-400" />
                                    )}
                                    {form.is_published ? 'Published' : 'Draft'}
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.client_name.trim() || !form.content.trim()}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                    <p className="text-sm text-slate-500 mt-1">{testimonials.length} testimonials</p>
                </div>
                <button onClick={openCreate} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16} />
                    Add Testimonial
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search testimonials..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquareQuote size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No testimonials found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-5 py-3 font-medium">Client</th>
                                    <th className="px-5 py-3 font-medium">Content</th>
                                    <th className="px-5 py-3 font-medium">Rating</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-semibold text-sm shrink-0">
                                                    {(t.client_name || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{t.client_name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {[t.client_role, t.client_company].filter(Boolean).join(' at ') || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 max-w-xs">
                                            <p className="text-slate-600 truncate">{t.content}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <Star key={n} size={14} className={n <= (t.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => togglePublish(t)}
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${t.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                    : 'bg-slate-50 text-slate-600 ring-slate-500/20'
                                                    }`}
                                            >
                                                {t.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                                                    <Trash2 size={15} />
                                                </button>
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
