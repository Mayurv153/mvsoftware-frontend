'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { submitServiceRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            await submitServiceRequest(form);
            setStatus('success');
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <Card className="border-surface-800/60 bg-surface-900/80 backdrop-blur-xl">
                <CardContent className="p-10 text-center">
                    <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 size={28} className="text-brand-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                    <p className="text-surface-400 text-sm mb-6">
                        Your request has been submitted. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button
                        onClick={() => setStatus('idle')}
                        variant="secondary"
                        className="bg-surface-800 hover:bg-surface-700 text-white"
                    >
                        Send Another Request
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="card-glow border-surface-800/60 bg-surface-900/80 backdrop-blur-xl">
            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-surface-300">Full Name *</Label>
                        <Input
                            id="name" name="name" type="text" required
                            value={form.name} onChange={handleChange}
                            placeholder="Your name"
                            className="bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-surface-300">Email *</Label>
                        <Input
                            id="email" name="email" type="email" required
                            value={form.email} onChange={handleChange}
                            placeholder="you@company.com"
                            className="bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-surface-300">Phone</Label>
                        <Input
                            id="phone" name="phone" type="tel"
                            value={form.phone} onChange={handleChange}
                            placeholder="+91 9876543210"
                            className="bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="message" className="text-surface-300">Your Requirement *</Label>
                        <Textarea
                            id="message" name="message" required rows={4}
                            value={form.message} onChange={handleChange}
                            placeholder="Tell us about your project..."
                            className="bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 resize-none"
                        />
                    </div>

                    {status === 'error' && (
                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full h-11 bg-brand-500 hover:bg-brand-400 text-surface-950 font-bold btn-glow btn-shine"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" /> Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Send size={16} /> Submit Request
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
