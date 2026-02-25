'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createPaymentOrder, verifyPayment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ServiceRequestModal from '@/components/ServiceRequestModal';

function loadRazorpayScript() {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function PricingCard({ plan, index = 0 }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    void index;

    // Step 1: Auth check → open service request modal
    const handleGetStarted = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/login?message=Please log in to continue.&next=/pricing`);
                return;
            }
            setUser(session.user);
            setShowModal(true);
        } catch (err) {
            alert(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: After requirements submitted → trigger Razorpay for paid plans
    const handlePayment = async () => {
        if (plan.priceInr <= 0) return; // custom plan — no auto-payment

        setShowModal(false);
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login?message=Please log in to continue payment.&next=/pricing');
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Razorpay SDK failed to load. Please check your internet and retry.');
            }

            const orderRes = await createPaymentOrder(session.access_token, plan.slug);
            const order = orderRes.data;

            if (!order?.razorpay_configured) {
                throw new Error('Razorpay is not configured on server yet. Please contact support.');
            }

            const rzp = new window.Razorpay({
                key: order.razorpay_key_id,
                amount: order.amount,
                currency: order.currency || 'INR',
                name: 'MV Webservice',
                description: `${plan.name} Plan`,
                order_id: order.razorpay_order_id,
                handler: async (response) => {
                    await verifyPayment(session.access_token, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: order.amount,
                        method: 'razorpay',
                    });
                    router.push('/payment-success?message=Payment successful! Thank you for your order.');
                },
                prefill: {
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                    email: session.user.email || '',
                },
                theme: { color: '#14B8A6' },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            });

            rzp.on('payment.failed', (resp) => {
                const errMsg = resp?.error?.description || 'Payment failed. Please try again.';
                alert(errMsg);
                setLoading(false);
            });

            rzp.open();
        } catch (err) {
            alert(err.message || 'Unable to start payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className={`flex flex-col relative transition-all duration-300 bg-surface-900/80 backdrop-blur-xl card-lift ${plan.popular
                ? 'card-glow border-brand-500/40 shadow-glow ring-1 ring-brand-500/20'
                : 'border-surface-800/60 hover:border-surface-700 hover:shadow-card'
                }`}
            >
                {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="badge-pulse bg-brand-500 text-white hover:bg-brand-500 px-4 py-1 uppercase tracking-wider text-xs">
                            Most Popular
                        </Badge>
                    </div>
                )}

                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-white italic">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-white">{plan.displayPrice}</span>
                        {plan.priceInr > 0 && <span className="text-sm text-surface-400">one-time</span>}
                    </div>
                    {plan.description && (
                        <p className="text-xs text-surface-400 mt-1">{plan.description}</p>
                    )}
                    {plan.deliveryDays && plan.priceInr > 0 && (
                        <p className="text-xs text-surface-400 mt-1">Delivered in {plan.deliveryDays} days</p>
                    )}
                </CardHeader>

                <Separator className="bg-surface-800/50 mx-6" />

                <CardContent className="pt-6 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                                <CheckCircle2 size={16} className="text-brand-400 shrink-0 mt-0.5" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <Button
                        type="button"
                        onClick={handleGetStarted}
                        disabled={loading}
                        className={`w-full btn-shine ${plan.popular
                            ? 'bg-brand-500 hover:bg-brand-400 text-surface-950 font-bold btn-glow'
                            : 'bg-surface-800 hover:bg-surface-700 text-white'
                            }`}
                        aria-label={`Get started with ${plan.name} plan`}
                    >
                        {loading ? 'Processing...' : 'Get Started'}
                    </Button>
                </CardContent>
            </Card>

            {/* Service Request Modal — collect requirements before payment */}
            <ServiceRequestModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={user}
                planSlug={plan.slug}
                service={plan.name}
                onPayment={plan.priceInr > 0 ? handlePayment : null}
            />
        </>
    );
}
