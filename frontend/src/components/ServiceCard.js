'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function ServiceCard({ icon, title, description, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
        >
            <Card className="p-8 group cursor-default border-surface-800/60 bg-surface-900/50 backdrop-blur-xl hover:border-surface-700 hover:shadow-card transition-all duration-300">
                <CardContent className="p-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 border border-accent-500/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-500/10 transition-all duration-300">
                        <span className="text-2xl">{icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-accent-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-surface-400 leading-relaxed text-sm">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
