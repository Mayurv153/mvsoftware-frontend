'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminCaseStudies, createAdminCaseStudy, updateAdminCaseStudy, deleteAdminCaseStudy } from '@/lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Search, BookOpen } from 'lucide-react';

const emptyForm = {
    title: '', slug: '', client: '', industry: '', timeline: '',
    services: [''], tech: [''], hero_image_url: '',
    challenge: '', solution: '', outcome: [''], is_published: false,
};

export default function AdminCaseStudies() {
    const [studies, setStudies] = useState([]);
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
            const res = await getAdminCaseStudies(session.access_token);
            setStudies(res.data?.caseStudies || []);
        } catch (err) { console.error('Load error:', err); }
        finally { setLoading(false); }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm, services: [''], tech: [''], outcome: [''] });
        setModalOpen(true);
    };

    const openEdit = (s) => {
        setEditingId(s.id);
        setForm({
            title: s.title || '', slug: s.slug || '', client: s.client || '',
            industry: s.industry || '', timeline: s.timeline || '',
            services: s.services?.length ? s.services : [''],
            tech: s.tech?.length ? s.tech : [''],
            hero_image_url: s.hero_image_url || '',
            challenge: s.challenge || '', solution: s.solution || '',
            outcome: s.outcome?.length ? s.outcome : [''],
            is_published: s.is_published || false,
        });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...emptyForm }); };

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
                services: form.services.filter(s => s.trim()),
                tech: form.tech.filter(t => t.trim()),
                outcome: form.outcome.filter(o => o.trim()),
            };
            if (editingId) {
                await updateAdminCaseStudy(token, editingId, payload);
                showToast('Case study updated');
            } else {
                await createAdminCaseStudy(token, payload);
                showToast('Case study created');
            }
            closeModal();
            loadData();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await deleteAdminCaseStudy(session.access_token, id);
            setDeleteId(null);
            showToast('Case study deleted');
            loadData();
        } catch (err) { console.error('Delete error:', err); showToast('Failed to delete'); }
    };

    const togglePublish = async (s) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminCaseStudy(session.access_token, s.id, { is_published: !s.is_published });
            showToast(s.is_published ? 'Unpublished' : 'Published');
            loadData();
        } catch (err) { console.error('Toggle error:', err); }
    };

    const updateArrayField = (field, index, value) => {
        const updated = [...form[field]];
        updated[index] = value;
        setForm({ ...form, [field]: updated });
    };
    const addArrayItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
    const removeArrayItem = (field, i) => setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) });

    const filtered = studies.filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (s.title || '').toLowerCase().includes(q) || (s.client || '').toLowerCase().includes(q) || (s.industry || '').toLowerCase().includes(q);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const ArrayInput = ({ label, field, placeholder }) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            {form[field].map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input value={item} onChange={e => updateArrayField(field, i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder={placeholder} />
                    {form[field].length > 1 && (
                        <button onClick={() => removeArrayItem(field, i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    )}
                </div>
            ))}
            <button onClick={() => addArrayItem(field)} className="text-sm text-teal-600 hover:text-teal-700 font-medium">+ Add</button>
        </div>
    );

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
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Case Study?</h3>
                        <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
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
                            <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Case Study' : 'Create Case Study'}</h3>
                            <button onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="Case study title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                    <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="auto-generated" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                                    <input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="Client name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                                    <input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="SaaS, Healthcare..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Timeline</label>
                                    <input value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="6 weeks" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
                                    <input value={form.hero_image_url} onChange={e => setForm({ ...form, hero_image_url: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="https://..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Challenge</label>
                                <textarea value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                    placeholder="What was the challenge?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Solution</label>
                                <textarea value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                    placeholder="How did you solve it?" />
                            </div>
                            <ArrayInput label="Outcome Points" field="outcome" placeholder="42% increase in users" />
                            <ArrayInput label="Services Used" field="services" placeholder="Product Design, Dev..." />
                            <ArrayInput label="Tech Stack" field="tech" placeholder="Next.js, Node.js..." />
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
                    <h1 className="text-2xl font-bold text-slate-900">Case Studies</h1>
                    <p className="text-sm text-slate-500 mt-1">{studies.length} case studies</p>
                </div>
                <button onClick={openCreate} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16} />Add Case Study
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case studies..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No case studies found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-5 py-3 font-medium">Title</th>
                                    <th className="px-5 py-3 font-medium">Client</th>
                                    <th className="px-5 py-3 font-medium">Industry</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-900 truncate max-w-xs">{s.title}</p>
                                            <p className="text-xs text-slate-400">{s.timeline}</p>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">{s.client || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">{s.industry || '—'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => togglePublish(s)}
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${s.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                    : 'bg-slate-50 text-slate-600 ring-slate-500/20'}`}>
                                                {s.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={15} /></button>
                                                <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
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
