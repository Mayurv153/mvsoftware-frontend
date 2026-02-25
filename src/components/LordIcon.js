'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

// Register the lord-icon custom element once
let registered = false;

export default function LordIcon({
    src,
    trigger = 'hover',
    colors = 'primary:#14b8a6',
    size = 22,
    delay = 0,
    className = '',
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!registered && typeof window !== 'undefined') {
            defineElement(lottie.loadAnimation);
            registered = true;
        }
    }, []);

    return (
        <lord-icon
            ref={containerRef}
            src={src}
            trigger={trigger}
            colors={colors}
            delay={delay}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
            className={className}
        />
    );
}
