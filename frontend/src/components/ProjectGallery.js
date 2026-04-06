'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
    {
        title: 'Healthcare Portal',
        category: 'Web App',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    },
    {
        title: 'E-Commerce Store',
        category: 'Online Store',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
    {
        title: 'Restaurant Website',
        category: 'Landing Page',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
    {
        title: 'SaaS Dashboard',
        category: 'Web App',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
        title: 'AI Chatbot Interface',
        category: 'AI Automation',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    },
    {
        title: 'Portfolio Website',
        category: 'Website',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    },
];

export default function ProjectGallery() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <div ref={ref} className="relative">
            {/* Left fade mask */}
            <div
                className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to right, rgb(249 250 251) 0%, transparent 100%)',
                }}
            />

            {/* Right fade mask */}
            <div
                className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to left, rgb(249 250 251) 0%, transparent 100%)',
                }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="project-gallery-scroll flex gap-5 overflow-x-auto pb-4 px-5 sm:px-8 lg:px-12 snap-x snap-mandatory"
            >
                {projects.map((project, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex-shrink-0 w-72 sm:w-80 snap-start"
                    >
                        <div className="card overflow-hidden group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                            {/* Image area with zoom-on-hover */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                    sizes="(max-width: 640px) 288px, 320px"
                                    loading="lazy"
                                />

                                {/* Dark gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Arrow icon on hover */}
                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowUpRight size={14} className="text-neutral-900" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                                    {project.category}
                                </span>
                                <h3 className="text-base font-semibold text-neutral-900 mt-1 group-hover:text-brand-600 transition-colors duration-200">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <p className="text-center text-xs text-neutral-300 mt-4">
                Sample projects — real client work coming soon
            </p>
        </div>
    );
}
