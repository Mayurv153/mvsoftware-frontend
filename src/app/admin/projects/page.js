'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminProjects, updateAdminProject } from '@/lib/api';
import { Search, FolderKanban, RefreshCw, Calendar, StickyNote, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Fragment } from 'react';

const projectStatuses = ['all', 'new', 'in_progress', 'review', 'delivered', 'completed', 'cancelled'];
const statusColors = {
    new: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    review: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    delivered: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
};
const formatStatus = (s) => (s || '').replace(/_/g, ' ');

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [deadline, setDeadline] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await getAdminProjects(session.access_token);
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminProject(session.access_token, id, { status: newStatus });
            setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
            showToast(`Status updated to ${formatStatus(newStatus)}`);
        } catch (err) {
            console.error('Status update error:', err);
            showToast('Failed to update status');
        }
    };

    const handleDeadline = async (id) => {
        if (!deadline) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminProject(session.access_token, id, { deadline });
            setProjects(prev => prev.map(p => p.id === id ? { ...p, deadline } : p));
            showToast('Deadline updated');
        } catch (err) {
            console.error('Deadline error:', err);
            showToast('Failed to update deadline');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNote = async (id) => {
        if (!noteText.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const proj = projects.find(p => p.id === id);
            const existingNotes = proj?.notes || {};
            const entries = existingNotes.entries || [];
            entries.push({ text: noteText, date: new Date().toISOString() });
            await updateAdminProject(session.access_token, id, { notes: { ...existingNotes, entries } });
            setProjects(prev => prev.map(p => p.id === id ? { ...p, notes: { ...existingNotes, entries } } : p));
            setNoteText('');
            showToast('Note added');
        } catch (err) {
            console.error('Note error:', err);
            showToast('Failed to save note');
        } finally {
            setSaving(false);
        }
    };

    const filtered = projects.filter(p => {
        if (filter !== 'all' && p.status !== filter) return false;
        if (search) {
            const q = search.toLowerCase();
            return (p.name || '').toLowerCase().includes(q) || (p.plan_slug || '').toLowerCase().includes(q);
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
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                    <p className="text-sm text-slate-500 mt-1">{projects.length} total projects</p>
                </div>
                <button onClick={loadData} className="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                    <RefreshCw size={14} />
                    Refresh
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
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
                    {projectStatuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                                filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {formatStatus(s)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <FolderKanban size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">
                            {projects.length === 0
                                ? 'No projects yet. Projects are created automatically after successful payments.'
                                : 'No projects match your filters'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-5 py-3 font-medium w-8"></th>
                                    <th className="px-5 py-3 font-medium">Project</th>
                                    <th className="px-5 py-3 font-medium">Plan</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Deadline</th>
                                    <th className="px-5 py-3 font-medium">Assigned</th>
                                    <th className="px-5 py-3 font-medium">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((project) => {
                                    const isExpanded = expandedId === project.id;
                                    const notes = project.notes?.entries || [];
                                    return (
                                        <Fragment key={project.id}>
                                            <tr
                                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setExpandedId(isExpanded ? null : project.id);
                                                    setDeadline(project.deadline ? project.deadline.split('T')[0] : '');
                                                }}
                                            >
                                                <td className="px-5 py-3.5 text-slate-400">
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <p className="font-medium text-slate-900">{project.name || 'Untitled Project'}</p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                                        {project.plan_slug || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={project.status}
                                                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset border-0 cursor-pointer appearance-none pr-6 bg-no-repeat bg-[right_4px_center] bg-[length:12px] ${statusColors[project.status] || 'bg-slate-100 text-slate-600 ring-slate-500/20'}`}
                                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
                                                    >
                                                        {projectStatuses.filter(s => s !== 'all').map(s => (
                                                            <option key={s} value={s}>{formatStatus(s)}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                                                    {project.deadline
                                                        ? new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                        : '—'}
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-500 text-xs capitalize">{project.assigned_to || 'founder'}</td>
                                                <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                                                    {new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={7} className="bg-slate-50/70 px-5 py-4 border-b border-slate-200">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                            {/* Deadline */}
                                                            <div>
                                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                    <Calendar size={13} />
                                                                    Set Deadline
                                                                </h4>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="date"
                                                                        value={deadline}
                                                                        onChange={(e) => setDeadline(e.target.value)}
                                                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleDeadline(project.id); }}
                                                                        disabled={saving || !deadline}
                                                                        className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-xs font-medium disabled:opacity-50"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {/* Notes */}
                                                            <div>
                                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                    <StickyNote size={13} />
                                                                    Notes ({notes.length})
                                                                </h4>
                                                                {notes.length > 0 && (
                                                                    <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
                                                                        {notes.map((note, i) => (
                                                                            <div key={i} className="text-xs bg-white rounded-lg border border-slate-200 p-2.5">
                                                                                <p className="text-slate-700">{note.text}</p>
                                                                                <p className="text-slate-400 mt-1">{new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        value={noteText}
                                                                        onChange={(e) => setNoteText(e.target.value)}
                                                                        placeholder="Add a note..."
                                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleSaveNote(project.id); }}
                                                                        disabled={saving || !noteText.trim()}
                                                                        className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-xs font-medium disabled:opacity-50"
                                                                    >
                                                                        {saving ? '...' : 'Add'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
