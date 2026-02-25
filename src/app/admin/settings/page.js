'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Mail, Shield, Clock, Save, Check, Globe, Phone, Building2 } from 'lucide-react';

export default function AdminSettings() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [siteSettings, setSiteSettings] = useState({
        business_name: 'MV Webservice',
        contact_email: '',
        whatsapp_number: '',
        site_url: 'https://mvwebservice.com',
        tagline: 'Stunning Websites & AI Automations',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setProfile({
                        email: session.user.email,
                        id: session.user.id,
                        created_at: session.user.created_at,
                        last_sign_in: session.user.last_sign_in_at,
                        provider: session.user.app_metadata?.provider || 'email',
                        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Admin',
                    });
                    setSiteSettings(prev => ({
                        ...prev,
                        contact_email: session.user.email,
                    }));
                }
            } catch (err) {
                console.error('Load error:', err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        // In a real implementation, this would save to a site_settings table
        setTimeout(() => {
            setSaving(false);
            showToast('Settings saved');
        }, 500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    {toast}
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">Admin profile and site configuration</p>
            </div>

            {/* Admin Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Shield size={18} className="text-teal-600" />
                        Admin Profile
                    </h2>
                </div>
                <div className="p-6">
                    {profile && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {(profile.name || 'A')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{profile.name}</h3>
                                    <p className="text-sm text-slate-500">{profile.email}</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                        <Shield size={12} />
                                        Admin
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-sm">
                                    <User size={16} className="text-slate-400" />
                                    <div>
                                        <span className="text-slate-500">User ID</span>
                                        <p className="font-mono text-xs text-slate-700 mt-0.5">{profile.id?.slice(0, 12)}...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-slate-400" />
                                    <div>
                                        <span className="text-slate-500">Auth Provider</span>
                                        <p className="text-slate-700 mt-0.5 capitalize">{profile.provider}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock size={16} className="text-slate-400" />
                                    <div>
                                        <span className="text-slate-500">Account Created</span>
                                        <p className="text-slate-700 mt-0.5">
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock size={16} className="text-slate-400" />
                                    <div>
                                        <span className="text-slate-500">Last Sign In</span>
                                        <p className="text-slate-700 mt-0.5">
                                            {profile.last_sign_in ? new Date(profile.last_sign_in).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Site Configuration */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Globe size={18} className="text-teal-600" />
                        Site Configuration
                    </h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                <Building2 size={14} className="inline mr-1.5 text-slate-400" />
                                Business Name
                            </label>
                            <input
                                value={siteSettings.business_name}
                                onChange={(e) => setSiteSettings({ ...siteSettings, business_name: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                <Globe size={14} className="inline mr-1.5 text-slate-400" />
                                Site URL
                            </label>
                            <input
                                value={siteSettings.site_url}
                                onChange={(e) => setSiteSettings({ ...siteSettings, site_url: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                <Mail size={14} className="inline mr-1.5 text-slate-400" />
                                Contact Email
                            </label>
                            <input
                                value={siteSettings.contact_email}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                <Phone size={14} className="inline mr-1.5 text-slate-400" />
                                WhatsApp Number
                            </label>
                            <input
                                value={siteSettings.whatsapp_number}
                                onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp_number: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="+91XXXXXXXXXX"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
                        <input
                            value={siteSettings.tagline}
                            onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                    <h2 className="font-semibold text-red-900">Danger Zone</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 text-sm">Sign Out</p>
                            <p className="text-xs text-slate-500 mt-0.5">End your admin session</p>
                        </div>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
