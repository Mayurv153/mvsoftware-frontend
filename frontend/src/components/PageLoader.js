'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
    const overlayRef = useRef(null);
    const lettersRef = useRef([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => setDone(true),
        });

        // Letter stagger in
        tl.fromTo(
            lettersRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.08, stagger: 0.06, ease: 'power3.out' }
        );

        // Hold
        tl.to({}, { duration: 0.4 });

        // Wipe away
        tl.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.7,
            ease: 'power3.inOut',
        });

        return () => tl.kill();
    }, []);

    if (done) return null;

    const brandName = 'MV Webservice';

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100000] bg-surface-950 flex items-center justify-center"
        >
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {brandName.split('').map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => (lettersRef.current[i] = el)}
                        className="inline-block"
                        style={{ opacity: 0 }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </span>
        </div>
    );
}
