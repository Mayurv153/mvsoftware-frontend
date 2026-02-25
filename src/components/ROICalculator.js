'use client';

import { useMemo, useState } from 'react';

function formatInr(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ROICalculator() {
    const [monthlyVisitors, setMonthlyVisitors] = useState(5000);
    const [currentConversion, setCurrentConversion] = useState(1.2);
    const [targetConversion, setTargetConversion] = useState(2.4);
    const [avgOrderValue, setAvgOrderValue] = useState(3000);

    const result = useMemo(() => {
        const currentLeads = (monthlyVisitors * currentConversion) / 100;
        const targetLeads = (monthlyVisitors * targetConversion) / 100;
        const extraLeads = Math.max(0, targetLeads - currentLeads);
        const monthlyRevenueLift = extraLeads * avgOrderValue;
        const yearlyRevenueLift = monthlyRevenueLift * 12;

        return {
            currentLeads: Math.round(currentLeads),
            targetLeads: Math.round(targetLeads),
            extraLeads: Math.round(extraLeads),
            monthlyRevenueLift,
            yearlyRevenueLift,
        };
    }, [monthlyVisitors, currentConversion, targetConversion, avgOrderValue]);

    return (
        <section className="py-20 border-t border-white/5">
            <div className="section-padding">
                <div className="max-w-5xl mx-auto card p-7 sm:p-10">
                    <div className="text-center mb-8">
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-3">ROI Calculator</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Estimate Growth From Better Conversion</h2>
                        <p className="text-surface-400">Adjust values to see your potential monthly and yearly lift.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <label className="block">
                                <div className="flex items-center justify-between mb-2 text-sm text-surface-300">
                                    <span>Monthly Visitors</span>
                                    <span className="font-mono text-white">{monthlyVisitors.toLocaleString('en-IN')}</span>
                                </div>
                                <input type="range" min="500" max="100000" step="500" value={monthlyVisitors} onChange={(e) => setMonthlyVisitors(Number(e.target.value))} className="w-full" />
                            </label>

                            <label className="block">
                                <div className="flex items-center justify-between mb-2 text-sm text-surface-300">
                                    <span>Current Conversion Rate</span>
                                    <span className="font-mono text-white">{currentConversion.toFixed(1)}%</span>
                                </div>
                                <input type="range" min="0.2" max="10" step="0.1" value={currentConversion} onChange={(e) => setCurrentConversion(Number(e.target.value))} className="w-full" />
                            </label>

                            <label className="block">
                                <div className="flex items-center justify-between mb-2 text-sm text-surface-300">
                                    <span>Target Conversion Rate</span>
                                    <span className="font-mono text-white">{targetConversion.toFixed(1)}%</span>
                                </div>
                                <input type="range" min="0.5" max="15" step="0.1" value={targetConversion} onChange={(e) => setTargetConversion(Number(e.target.value))} className="w-full" />
                            </label>

                            <label className="block">
                                <div className="flex items-center justify-between mb-2 text-sm text-surface-300">
                                    <span>Average Order / Deal Value</span>
                                    <span className="font-mono text-white">{formatInr(avgOrderValue)}</span>
                                </div>
                                <input type="range" min="500" max="100000" step="500" value={avgOrderValue} onChange={(e) => setAvgOrderValue(Number(e.target.value))} className="w-full" />
                            </label>
                        </div>

                        <div className="bg-surface-900 rounded-2xl border border-surface-800 p-6">
                            <p className="text-sm text-surface-400 mb-5">Projected Impact</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-surface-400">Current monthly leads</span>
                                    <span className="text-white font-semibold">{result.currentLeads}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-surface-400">Target monthly leads</span>
                                    <span className="text-white font-semibold">{result.targetLeads}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-surface-400">Extra monthly leads</span>
                                    <span className="text-brand-400 font-semibold">+{result.extraLeads}</span>
                                </div>
                                <hr className="border-surface-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-surface-300">Estimated monthly revenue lift</span>
                                    <span className="text-white font-bold">{formatInr(result.monthlyRevenueLift)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-surface-300">Estimated yearly revenue lift</span>
                                    <span className="text-brand-400 font-bold">{formatInr(result.yearlyRevenueLift)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
