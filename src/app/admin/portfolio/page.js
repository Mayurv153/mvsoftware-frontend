'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminPortfolio, createAdminPortfolio, updateAdminPortfolio, deleteAdminPortfolio } from '@/lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Search, Globe, ExternalLink, GripVertical, Image as ImageIcon } from 'lucide-react';

const categories = ['Website', 'Application', 'E-Commerce', 'WordPress'];

const emptyForm = {
    title: '',
    category: 'Website',
    description: '',
    tech: '',
    image_url: '',
    live_url: '',
    is_published: false,
    sort_order: 0,
};

export default function AdminPortfolio() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
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
            const res = await getAdminPortfolio(session.access_token);
            setProjects(res.data?.projects || []);
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
        setForm({ ...emptyForm, sort_order: projects.length + 1 });
        setModalOpen(true);
    };

    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            title: p.title || '',
            category: p.category || 'Website',
            description: p.description || '',
            tech: Array.isArray(p.tech) ? p.tech.join(', ') : '',
            image_url: p.image_url || '',
            live_url: p.live_url || '',
            is_published: p.is_published || false,
            sort_order: p.sort_order || 0,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm({ ...emptyForm });
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.description.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const token = session.access_token;

            const payload = {
                ...form,
                tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
                sort_order: parseInt(form.sort_order) || 0,
            };

            if (editingId) {
                await updateAdminPortfolio(token, editingId, payload);
                showToast('Project updated');
            } else {
                await createAdminPortfolio(token, payload);
                showToast('Project added');
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

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await deleteAdminPortfolio(session.access_token, deleteId);
            setDeleteId(null);
            showToast('Project deleted');
            loadData();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const togglePublish = async (p) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminPortfolio(session.access_token, p.id, { is_published: !p.is_published });
            setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_published: !x.is_published } : x));
            showToast(p.is_published ? 'Unpublished' : 'Published');
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

    const filtered = projects.filter(p => {
        if (filterCat !== 'all' && p.category !== filterCat) return false;
        if (search) {
            const q = search.toLowerCase();
            return (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
        }
        return true;
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
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe size={24} className="text-teal-600" />
                        Portfolio
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage projects shown on the public Projects page — {projects.filter(p => p.is_published).length} published
                    </p>
                </div>
                <button onClick={openCreate} className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2 shadow-sm">
                    <Plus size={16} />
                    Add Project
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    {['all', ...categories].map(c => (
                        <button
                            key={c}
                            onClick={() => setFilterCat(c)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${filterCat === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {c === 'all' ? 'All' : c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Globe size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No portfolio projects yet. Click "Add Project" to showcase your work.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((p) => (
                        <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                                {p.image_url ? (
                                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon size={40} className="text-slate-300" />
                                    </div>
                                )}
                                {/* Status badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {p.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                {/* Category badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                                        {p.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-slate-900 text-base">{p.title}</h3>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">#{p.sort_order}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{p.description}</p>

                                {/* Tech tags */}
                                {p.tech && p.tech.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {p.tech.map(t => (
                                            <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500">{t}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Live URL */}
                                {p.live_url && (
                                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium mb-4">
                                        <ExternalLink size={12} />
                                        {p.live_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </a>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => togglePublish(p)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${p.is_published ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                                        {p.is_published ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                                    </button>
                                    <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100">
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 ml-auto">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Create/Edit Modal ─── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Project' : 'Add Project'}</h2>
                            <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Title *</label>
                                <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="e.g. MedCare Clinic" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                                <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Description *</label>
                                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" placeholder="Brief project description..." />
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Tech Stack (comma-separated)</label>
                                <input value={form.tech} onChange={(e) => setForm(f => ({ ...f, tech: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="Next.js, React, Tailwind CSS" />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                                <input value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="https://..." />
                                {form.image_url && (
                                    <img src={form.image_url} alt="Preview" className="mt-2 rounded-lg h-24 object-cover border border-slate-200" />
                                )}
                            </div>

                            {/* Live URL */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Live URL</label>
                                <input value={form.live_url} onChange={(e) => setForm(f => ({ ...f, live_url: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="https://example.com" />
                            </div>

                            {/* Sort Order + Published */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
                                    <input type="number" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm(f => ({ ...f, is_published: e.target.checked }))}
                                            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm text-slate-700 font-medium">Publish immediately</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-5 border-t border-slate-200">
                            <button onClick={closeModal} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.description.trim()}
                                className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Delete Confirm ─── */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <Trash2 size={32} className="mx-auto text-red-400 mb-3" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Project?</h3>
                        <p className="text-sm text-slate-500 mb-6">This will permanently remove the project from your portfolio.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
