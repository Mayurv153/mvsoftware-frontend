'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminMetrics, getAdminRequests, getAdminProjects, deleteAdminRequest } from '@/lib/api';
import {
    IndianRupee,
    Users,
    FolderKanban,
    CreditCard,
    ArrowUpRight,
    MessageSquareText,
    TrendingUp,
    Clock,
    Trash2,
} from 'lucide-react';

const statusBadge = (status) => {
    const map = {
        new: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        contacted: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        converted: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        closed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    };
    return map[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20';
};

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                const token = session.access_token;

                const [metricsRes, reqRes, projRes] = await Promise.allSettled([
                    getAdminMetrics(token),
                    getAdminRequests(token),
                    getAdminProjects(token),
                ]);

                if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
                if (reqRes.status === 'fulfilled') setRecentRequests(reqRes.value.data?.requests?.slice(0, 7) || []);
                if (projRes.status === 'fulfilled') setProjectCount(projRes.value.data?.projects?.length || 0);
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleDeleteRequest = async (id) => {
        if (!confirm('Are you sure you want to delete this service request?')) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await deleteAdminRequest(session.access_token, id);
            setRecentRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete request');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const m = metrics?.metrics?.[0] || {};
    const stats = [
        {
            label: 'Total Revenue',
            value: m.total_revenue ? `₹${(m.total_revenue / 100).toLocaleString('en-IN')}` : '₹0',
            icon: IndianRupee,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Service Requests',
            value: recentRequests.length || m.new_requests || 0,
            icon: MessageSquareText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Active Projects',
            value: projectCount,
            icon: FolderKanban,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            label: 'Payments Today',
            value: m.new_payments || 0,
            icon: CreditCard,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back, Mayur. Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon size={18} className={stat.color} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Requests */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                            <MessageSquareText size={18} className="text-slate-400" />
                            Recent Requests
                        </h2>
                        <Link href="/admin/requests" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                            View all <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    {recentRequests.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-sm">No requests yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <th className="px-5 py-3 font-medium">Name</th>
                                        <th className="px-5 py-3 font-medium">Plan</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Date</th>
                                        <th className="px-5 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentRequests.slice(0, 5).map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3">
                                                <p className="font-medium text-slate-900">{req.name}</p>
                                                <p className="text-xs text-slate-400">{req.email}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                                    {req.plan_slug || '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusBadge(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                                                {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleDeleteRequest(req.id); }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Request"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-slate-400" />
                            Quick Actions
                        </h2>
                    </div>
                    <div className="p-4 space-y-2">
                        {[
                            { label: 'View Service Requests', href: '/admin/requests', icon: MessageSquareText, color: 'text-blue-600' },
                            { label: 'Manage Projects', href: '/admin/projects', icon: FolderKanban, color: 'text-violet-600' },
                            { label: 'Check Payments', href: '/admin/payments', icon: CreditCard, color: 'text-emerald-600' },
                            { label: 'Edit Plans', href: '/admin/plans', icon: IndianRupee, color: 'text-amber-600' },
                        ].map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                                >
                                    <Icon size={18} className={action.color} />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                                    <ArrowUpRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500" />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="px-5 py-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock size={14} />
                            Last refreshed: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
