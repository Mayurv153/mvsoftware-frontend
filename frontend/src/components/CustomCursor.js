'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });
    const isTouch = useRef(false);

    useEffect(() => {
        // Detect touch device
        if (window.matchMedia('(pointer: coarse)').matches) {
            isTouch.current = true;
            return;
        }

        const dot = dotRef.current;
        const ringEl = ringRef.current;
        if (!dot || !ringEl) return;

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
        };

        const onMouseDown = () => {
            dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
        };

        const onMouseUp = () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        };

        // Hover states
        const addHoverListeners = () => {
            document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    ringEl.style.width = '60px';
                    ringEl.style.height = '60px';
                    ringEl.style.mixBlendMode = 'exclusion';
                });
                el.addEventListener('mouseleave', () => {
                    ringEl.style.width = '32px';
                    ringEl.style.height = '32px';
                    ringEl.style.mixBlendMode = 'normal';
                });
            });
        };

        // Lerp ring to follow cursor
        let rafId;
        const lerp = (a, b, t) => a + (b - a) * t;
        const animate = () => {
            ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
            ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
            ringEl.style.left = `${ring.current.x}px`;
            ringEl.style.top = `${ring.current.y}px`;
            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        rafId = requestAnimationFrame(animate);

        // Delay adding hover listeners to ensure DOM is ready
        const tid = setTimeout(addHoverListeners, 1000);

        // Re-add hover listeners when DOM changes
        const observer = new MutationObserver(() => {
            addHoverListeners();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(rafId);
            clearTimeout(tid);
            observer.disconnect();
        };
    }, []);

    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            <div
                ref={dotRef}
                className="cursor-dot"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#14b8a6',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transition: 'transform 0.15s ease',
                }}
            />
            <div
                ref={ringRef}
                className="cursor-ring"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(20, 184, 166, 0.3)',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    transition: 'width 0.3s ease, height 0.3s ease, mix-blend-mode 0.3s ease',
                }}
            />
        </>
    );
}
