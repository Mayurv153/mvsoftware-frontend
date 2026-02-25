'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminPayments } from '@/lib/api';
import { Search, CreditCard, RefreshCw, IndianRupee, Copy, Check } from 'lucide-react';

const statuses = ['all', 'captured', 'failed', 'refunded'];
const statusColors = {
    captured: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    failed: 'bg-red-50 text-red-700 ring-red-600/20',
    refunded: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    created: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            try {
                const res = await getAdminPayments(session.access_token);
                setPayments(res.data?.payments || []);
            } catch {
                // Fallback: fetch directly from Supabase
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);
                if (!error) setPayments(data || []);
            }
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyId = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const totalRevenue = payments
        .filter(p => p.status === 'captured')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const filtered = payments.filter(p => {
        if (filter !== 'all' && p.status !== filter) return false;
        if (search) {
            const q = search.toLowerCase();
            return (p.razorpay_payment_id || '').toLowerCase().includes(q) ||
                (p.razorpay_order_id || '').toLowerCase().includes(q) ||
                (p.id || '').toLowerCase().includes(q);
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
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Orders & Payments</h1>
                    <p className="text-sm text-slate-500 mt-1">{payments.length} total payments</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-2.5 flex items-center gap-2">
                        <IndianRupee size={16} className="text-emerald-600" />
                        <div>
                            <p className="text-xs text-slate-400">Total Revenue</p>
                            <p className="font-bold text-slate-900">₹{(totalRevenue / 100).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <button onClick={loadData} className="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Payment ID or Order ID..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                                filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">
                            {payments.length === 0
                                ? 'No payments yet. Payments will appear here after Razorpay integration is live.'
                                : 'No payments match your filters'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-5 py-3 font-medium">Payment ID</th>
                                    <th className="px-5 py-3 font-medium">Razorpay Order</th>
                                    <th className="px-5 py-3 font-medium">Amount</th>
                                    <th className="px-5 py-3 font-medium">Method</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs text-slate-600">
                                                    {p.razorpay_payment_id || p.id?.slice(0, 12)}
                                                </span>
                                                {p.razorpay_payment_id && (
                                                    <button
                                                        onClick={() => copyId(p.razorpay_payment_id)}
                                                        className="p-0.5 rounded hover:bg-slate-100 text-slate-400"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === p.razorpay_payment_id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-xs text-slate-400">
                                                {p.razorpay_order_id?.slice(0, 16) || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                                            ₹{((p.amount || 0) / 100).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 capitalize">{p.method || '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[p.status] || statusColors.created}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                                            {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
