'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminPlans, updateAdminPlan } from '@/lib/api';
import { Save, Star, ToggleLeft, ToggleRight, Pencil, X, Check, Package } from 'lucide-react';

export default function AdminPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { loadPlans(); }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await getAdminPlans(session.access_token);
            setPlans(res.data?.plans || []);
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

    const startEdit = (plan) => {
        setEditingId(plan.id);
        setEditForm({
            name: plan.name,
            display_price: plan.display_price,
            price_inr: plan.price_inr,
            delivery_days: plan.delivery_days,
            features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
            is_active: plan.is_active !== false,
            popular: plan.slug === 'growth',
            category: plan.category || 'website',
            offer_title: plan.offer_title || '',
            offer_tagline: plan.offer_tagline || '',
            offer_discount: plan.offer_discount ?? '',
            offer_expires_at: plan.offer_expires_at ? plan.offer_expires_at.substring(0, 10) : '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const savePlan = async (planId) => {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const payload = {
                name: editForm.name,
                display_price: editForm.display_price,
                price_inr: parseInt(editForm.price_inr) || 0,
                delivery_days: parseInt(editForm.delivery_days) || 7,
                features: editForm.features.split('\n').map(f => f.trim()).filter(Boolean),
                is_active: editForm.is_active,
                category: editForm.category,
                offer_title: editForm.offer_title || null,
                offer_tagline: editForm.offer_tagline || null,
                offer_discount: editForm.offer_discount === '' ? null : parseInt(editForm.offer_discount),
                offer_expires_at: editForm.offer_expires_at || null,
            };

            await updateAdminPlan(session.access_token, planId, payload);
            setEditingId(null);
            showToast('Plan updated successfully');
            loadPlans();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (plan) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await updateAdminPlan(session.access_token, plan.id, { is_active: !plan.is_active });
            showToast(`${plan.name} ${plan.is_active ? 'deactivated' : 'activated'}`);
            loadPlans();
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

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

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Plans & Pricing</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your service plans and pricing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {plans.map((plan) => {
                    const isEditing = editingId === plan.id;
                    const features = Array.isArray(plan.features) ? plan.features : [];

                    return (
                        <div key={plan.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${plan.is_active === false ? 'opacity-60 border-slate-200' : 'border-slate-200'}`}>
                            {/* Header */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <Package size={20} className="text-teal-600" />
                                    </div>
                                    <div>
                                        {isEditing ? (
                                            <input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="font-semibold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-sm"
                                            />
                                        ) : (
                                            <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                                        )}
                                        <span className="text-xs text-slate-400 font-mono">{plan.slug}</span>
                                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                {(isEditing ? editForm.category : plan.category) || 'website'}
                                            </span>
                                            {plan.offer_discount ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Save {plan.offer_discount}%
                                                </span>
                                            ) : null}
                                            {plan.offer_title ? (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                    {plan.offer_title}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {plan.slug === 'growth' && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 flex items-center gap-1">
                                            <Star size={12} /> Popular
                                        </span>
                                    )}
                                    {!isEditing ? (
                                        <button onClick={() => startEdit(plan)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                            <Pencil size={16} />
                                        </button>
                                    ) : (
                                        <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-4">
                                {/* Price */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Price</label>
                                    {isEditing ? (
                                        <div className="flex gap-2 mt-1">
                                            <input
                                                value={editForm.display_price}
                                                onChange={(e) => setEditForm({ ...editForm, display_price: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="₹9,999"
                                            />
                                            <input
                                                type="number"
                                                value={editForm.price_inr}
                                                onChange={(e) => setEditForm({ ...editForm, price_inr: e.target.value })}
                                                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="Paisa"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{plan.display_price}</p>
                                    )}
                                </div>

                                {/* Delivery */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Delivery Days</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm.delivery_days}
                                            onChange={(e) => setEditForm({ ...editForm, delivery_days: e.target.value })}
                                            className="mt-1 w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-700 mt-1">{plan.delivery_days} days</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category</label>
                                    {isEditing ? (
                                        <select
                                            value={editForm.category}
                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            className="mt-1 w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                                        >
                                            <option value="website">Website</option>
                                            <option value="application">Application</option>
                                            <option value="ecommerce">E-commerce</option>
                                            <option value="wordpress">WordPress</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm text-slate-700 mt-1 capitalize">{plan.category || 'website'}</p>
                                    )}
                                </div>

                                {/* Offer */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Offer Title</label>
                                        {isEditing ? (
                                            <input
                                                value={editForm.offer_title}
                                                onChange={(e) => setEditForm({ ...editForm, offer_title: e.target.value })}
                                                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="e.g., Summer Sale"
                                            />
                                        ) : (
                                            <p className="text-sm text-slate-700 mt-1">{plan.offer_title || '—'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Offer Tagline</label>
                                        {isEditing ? (
                                            <input
                                                value={editForm.offer_tagline}
                                                onChange={(e) => setEditForm({ ...editForm, offer_tagline: e.target.value })}
                                                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="Short promo copy"
                                            />
                                        ) : (
                                            <p className="text-sm text-slate-700 mt-1">{plan.offer_tagline || '—'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Discount (%)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editForm.offer_discount}
                                                onChange={(e) => setEditForm({ ...editForm, offer_discount: e.target.value })}
                                                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                                placeholder="e.g., 15"
                                            />
                                        ) : (
                                            <p className="text-sm text-slate-700 mt-1">{plan.offer_discount ? `${plan.offer_discount}%` : '—'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Offer Expires</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editForm.offer_expires_at}
                                                onChange={(e) => setEditForm({ ...editForm, offer_expires_at: e.target.value })}
                                                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                            />
                                        ) : (
                                            <p className="text-sm text-slate-700 mt-1">
                                                {plan.offer_expires_at ? new Date(plan.offer_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Features</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editForm.features}
                                            onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                                            rows={5}
                                            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                            placeholder="One feature per line"
                                        />
                                    ) : (
                                        <ul className="mt-1 space-y-1">
                                            {features.map((f, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <Check size={14} className="text-teal-500 mt-0.5 shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Active toggle */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className="text-sm text-slate-600">Active</span>
                                    <button
                                        onClick={() => isEditing ? setEditForm({ ...editForm, is_active: !editForm.is_active }) : toggleActive(plan)}
                                        className="text-slate-500 hover:text-slate-700"
                                    >
                                        {(isEditing ? editForm.is_active : plan.is_active !== false) ? (
                                            <ToggleRight size={28} className="text-teal-500" />
                                        ) : (
                                            <ToggleLeft size={28} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Save */}
                            {isEditing && (
                                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                                    <button onClick={cancelEdit} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => savePlan(plan.id)}
                                        disabled={saving}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={14} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
