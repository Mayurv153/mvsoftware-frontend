'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
    User, Mail, Calendar, Shield, Clock, Edit3, Save, X,
    LogOut, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [form, setForm] = useState({ full_name: '', phone: '' });

    // Password change
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);
            
            // Load extended profile data
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
            
            if (profileData) {
                setProfile(profileData);
                setForm({
                    full_name: profileData.full_name || session.user.user_metadata?.full_name || '',
                    phone: profileData.phone || session.user.user_metadata?.phone || '',
                });
            } else {
                setForm({
                    full_name: session.user.user_metadata?.full_name || '',
                    phone: session.user.user_metadata?.phone || '',
                });
            }
        } catch (err) {
            console.error('Error loading user:', err);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update profiles table
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Update local state
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err) {
            console.error('Avatar upload failed:', err.message);
            setMessage({ type: 'error', text: 'Failed to upload image. Make sure "avatars" bucket is public in Supabase.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: form.full_name,
                    phone: form.phone,
                },
            });

            if (authError) throw authError;

            // Update Profiles Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: form.full_name,
                    phone: form.phone,
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);
            setProfile(prev => ({ ...prev, full_name: form.full_name, phone: form.phone }));
            
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }
        if (passwordForm.password !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setChangingPassword(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.password,
            });

            if (error) throw error;

            setPasswordForm({ password: '', confirmPassword: '' });
            setShowPasswordSection(false);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to change password' });
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const getInitial = () => {
        if (!user) return '?';
        const name = user.user_metadata?.full_name || user.email || '';
        return name.charAt(0).toUpperCase();
    };

    const getProvider = () => {
        if (!user) return 'email';
        return user.app_metadata?.provider || 'email';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </section>
        );
    }

    if (!user) return null;

    return (
        <section className="min-h-screen pt-28 pb-20 bg-surface-950 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.25) 0%, transparent 70%)' }} />

            <div className="section-container max-w-3xl mx-auto relative z-10">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-surface-400 hover:text-white hover:bg-transparent mb-8 text-sm"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </motion.div>

                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-surface-900/60 border-surface-800 backdrop-blur-sm mb-6">
                        <CardContent className="p-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Avatar */}
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/20 overflow-hidden">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            getInitial()
                                        )}
                                        
                                        {/* Hover Overlay */}
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            {uploading ? (
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Edit3 size={24} className="text-white" />
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleAvatarUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-surface-900" title="Online" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-white">
                                            {profile?.full_name || user.user_metadata?.full_name || 'User'}
                                        </h1>
                                        
                                        {/* Plan Badge */}
                                        <Badge className={`w-fit mx-auto sm:mx-0 font-bold uppercase tracking-wider text-[10px] ${
                                            profile?.plan_slug === 'pro' ? 'bg-purple-500 text-white' :
                                            profile?.plan_slug === 'growth' ? 'bg-blue-500 text-white' :
                                            profile?.plan_slug === 'starter' ? 'bg-green-500 text-white' :
                                            'bg-surface-800 text-surface-400'
                                        }`}>
                                            {profile?.plan_slug || 'Free'} Plan
                                        </Badge>
                                    </div>
                                    <p className="text-surface-400 text-sm mb-3">{user.email}</p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20 hover:bg-brand-500/20">
                                            <Shield size={12} className="mr-1.5" />
                                            {getProvider() === 'google' ? 'Google Account' : 'Email Account'}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-surface-800 text-surface-300 hover:bg-surface-700">
                                            <Calendar size={12} className="mr-1.5" />
                                            Joined {formatDate(user.created_at).split(',')[0]}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Edit button */}
                                {!editing ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditing(true)}
                                        className="text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border-brand-500/20"
                                    >
                                        <Edit3 size={14} className="mr-2" /> Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="bg-brand-500 hover:bg-brand-600 text-white"
                                        >
                                            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                                            Save
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => { setEditing(false); setForm({ full_name: user.user_metadata?.full_name || '', phone: user.user_metadata?.phone || '' }); }}
                                            className="bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white"
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Success / Error Message */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Alert className={`mb-6 ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            <CheckCircle2 size={16} />
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="bg-surface-900/60 border-surface-800 backdrop-blur-sm mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Full Name */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <User size={15} /> Full Name
                                </Label>
                                {editing ? (
                                    <Input
                                        type="text"
                                        value={form.full_name}
                                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                        className="flex-1 bg-surface-800 border-surface-700 text-white focus-visible:ring-brand-500/20 focus-visible:border-brand-500 placeholder:text-surface-500"
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <p className="text-white text-sm">{user.user_metadata?.full_name || '—'}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <Mail size={15} /> Email
                                </Label>
                                <p className="text-white text-sm">{user.email}</p>
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <User size={15} /> Phone
                                </Label>
                                {editing ? (
                                    <Input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="flex-1 bg-surface-800 border-surface-700 text-white focus-visible:ring-brand-500/20 focus-visible:border-brand-500 placeholder:text-surface-500"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <p className="text-white text-sm">{user.user_metadata?.phone || '—'}</p>
                                )}
                            </div>

                            {/* Auth Provider */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <Shield size={15} /> Auth Provider
                                </Label>
                                <p className="text-white text-sm capitalize">{getProvider()}</p>
                            </div>

                            {/* Created At */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <Calendar size={15} /> Joined
                                </Label>
                                <p className="text-white text-sm">{formatDate(user.created_at)}</p>
                            </div>

                            {/* Last Sign In */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                <Label className="flex items-center gap-2 text-surface-400 sm:w-40 shrink-0">
                                    <Clock size={15} /> Last Sign In
                                </Label>
                                <p className="text-white text-sm">{formatDate(user.last_sign_in_at)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Change Password */}
                {getProvider() === 'email' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="bg-surface-900/60 border-surface-800 backdrop-blur-sm mb-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <Lock size={18} /> Security
                                </CardTitle>
                                {!showPasswordSection && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowPasswordSection(true)}
                                        className="text-brand-400 hover:text-brand-300 hover:bg-transparent"
                                    >
                                        Change Password
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {showPasswordSection ? (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                value={passwordForm.password}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                                className="bg-surface-800 border-surface-700 text-white focus-visible:ring-brand-500/20 focus-visible:border-brand-500 placeholder:text-surface-500 pr-10"
                                                placeholder="New password (min 6 characters)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <Input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            className="bg-surface-800 border-surface-700 text-white focus-visible:ring-brand-500/20 focus-visible:border-brand-500 placeholder:text-surface-500"
                                            placeholder="Confirm new password"
                                        />
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleChangePassword}
                                                disabled={changingPassword}
                                                className="bg-brand-500 hover:bg-brand-600 text-white"
                                            >
                                                {changingPassword ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                                                Update Password
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => { setShowPasswordSection(false); setPasswordForm({ password: '', confirmPassword: '' }); }}
                                                className="bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-surface-500 text-sm">Your account is secured with email and password authentication.</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Sign Out */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="bg-surface-900/60 border-surface-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Sign Out</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-surface-400 text-sm mb-4">Sign out from your account on this device.</p>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border-red-500/20 hover:border-red-500"
                            >
                                <LogOut size={16} className="mr-2" /> Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
