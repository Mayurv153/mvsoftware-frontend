'use client';

import { useMemo, useState } from 'react';

function toRupees(priceInr) {
    if (!priceInr || Number.isNaN(priceInr)) return 0;
    return priceInr > 10000 ? Math.round(priceInr / 100) : Math.round(priceInr);
}

function formatInr(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function LivePricingEstimator({ plans = [] }) {
    const quotePlans = plans.filter((p) => p.slug !== 'custom');
    const [selectedPlan, setSelectedPlan] = useState(quotePlans[0]?.slug || '');
    const [pages, setPages] = useState(5);
    const [features, setFeatures] = useState({
        seo: true,
        blog: false,
        payment: false,
        dashboard: false,
        ai: false,
        maintenance: false,
    });

    const estimate = useMemo(() => {
        const plan = quotePlans.find((p) => p.slug === selectedPlan);
        const base = toRupees(plan?.priceInr || 0);
        const pageCost = Math.max(0, pages - 5) * 1200;
        const addons = {
            seo: features.seo ? 5000 : 0,
            blog: features.blog ? 7000 : 0,
            payment: features.payment ? 9000 : 0,
            dashboard: features.dashboard ? 18000 : 0,
            ai: features.ai ? 25000 : 0,
            maintenance: features.maintenance ? 6000 : 0,
        };

        const addonsTotal = Object.values(addons).reduce((sum, val) => sum + val, 0);
        const subtotal = base + pageCost + addonsTotal;
        const min = Math.round(subtotal * 0.9);
        const max = Math.round(subtotal * 1.15);
        const delivery = Math.max(5, (plan?.deliveryDays || 7) + Math.ceil((pages - 5) / 3) * 2);

        return { min, max, delivery };
    }, [features, pages, quotePlans, selectedPlan]);

    const toggleFeature = (key) => setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <section className="py-20 border-t border-white/5">
            <div className="section-padding">
                <div className="max-w-5xl mx-auto card p-7 sm:p-10">
                    <div className="text-center mb-8">
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-3">Live Pricing Estimator</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Build Your Custom Quote</h2>
                        <p className="text-surface-400">Select scope and features to get an instant budget estimate.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm text-surface-300 mb-2 block">Base Package</label>
                                <select
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="input-field"
                                >
                                    {quotePlans.map((p) => (
                                        <option key={p.slug} value={p.slug}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-surface-300">Number of Pages</label>
                                    <span className="text-white font-mono">{pages}</span>
                                </div>
                                <input type="range" min="1" max="30" value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full" />
                            </div>

                            <div>
                                <p className="text-sm text-surface-300 mb-2">Add-ons</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                        ['seo', 'Advanced SEO'],
                                        ['blog', 'Blog Setup'],
                                        ['payment', 'Payment Gateway'],
                                        ['dashboard', 'Admin Dashboard'],
                                        ['ai', 'AI Features'],
                                        ['maintenance', '3-Month Maintenance'],
                                    ].map(([key, label]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => toggleFeature(key)}
                                            className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${features[key]
                                                ? 'border-brand-500 bg-brand-500/10 text-white'
                                                : 'border-surface-700 text-surface-400 hover:text-white hover:border-surface-500'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-900 rounded-2xl border border-surface-800 p-6">
                            <p className="text-sm text-surface-400 mb-4">Estimated Budget Range</p>
                            <p className="text-3xl font-bold text-white mb-2">
                                {formatInr(estimate.min)} - {formatInr(estimate.max)}
                            </p>
                            <p className="text-surface-400 mb-6">Estimated delivery: {estimate.delivery} - {estimate.delivery + 4} days</p>
                            <a
                                href={`https://wa.me/919423699549?text=Hi+mv+webservice+i+need+website+for+(Quote+between+${encodeURIComponent(formatInr(estimate.min))}+and+${encodeURIComponent(formatInr(estimate.max))})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary btn-glow w-full justify-center"
                            >
                                Request This Quote on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
