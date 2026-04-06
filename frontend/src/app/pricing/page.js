'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import PricingCard from '@/components/PricingCard';
import ROICalculator from '@/components/ROICalculator';
import LivePricingEstimator from '@/components/LivePricingEstimator';
import { getPlans } from '@/lib/api';

export default function PricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlans()
            .then(setPlans)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {/* Hero */}
            <section className="py-20 relative overflow-hidden">
                <div className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] -top-20 -left-20 absolute" />
                <div className="section-padding relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="section-title mb-4">
                            Simple, Transparent <span className="gradient-text">Pricing</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Choose a plan that fits your business. No hidden fees, no surprises — just premium quality at fair prices.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Plans */}
            <section className="pb-24">
                <div className="section-padding">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {plans.map((plan, i) => (
                                <PricingCard key={plan.slug} plan={plan} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {!loading && <LivePricingEstimator plans={plans} />}

            <ROICalculator />

            {/* FAQ */}
            <section className="py-20 border-t border-white/5">
                <div className="section-padding max-w-3xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl font-bold">
                            Frequently <span className="gradient-text">Asked</span>
                        </h2>
                    </AnimatedSection>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Can I upgrade my plan later?',
                                a: 'Absolutely! You can upgrade at any time. We\'ll adjust the scope and timeline accordingly.',
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: 'We offer a 100% refund if we haven\'t started the project. Once development begins, refunds are evaluated case-by-case.',
                            },
                            {
                                q: 'What technologies do you use?',
                                a: 'We use React, Next.js, Node.js, Tailwind CSS, and modern AI tools. The exact stack depends on your project needs.',
                            },
                            {
                                q: 'Do you provide ongoing support?',
                                a: 'Yes! All plans include 30 days of free support after launch. Extended maintenance plans are also available.',
                            },
                        ].map((faq, i) => (
                            <AnimatedSection key={i} delay={i * 0.08}>
                                <div className="glass-card p-6">
                                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                                    <p className="text-sm text-gray-400">{faq.a}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
