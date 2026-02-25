'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `end` when scrolled into view.
 * Supports a `suffix` like "+" or "%" shown after the number.
 */
export default function CountUp({ end, suffix = '', duration = 2000 }) {
    const ref = useRef(null);
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        let raf;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out curve
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
                raf = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [started, end, duration]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}
