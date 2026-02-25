'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Typewriter({
    text,
    speed = 80,
    deleteSpeed = 40,
    delay = 0,
    pauseAfterType = 2000,
    pauseAfterDelete = 500,
    loop = true,
    className = '',
    cursorColor = '#14b8a6',
    showCursor = true,
    onComplete,
    onCycleStart,
}) {
    const [displayed, setDisplayed] = useState('');
    const [phase, setPhase] = useState('waiting'); // waiting | typing | paused | deleting | deleted
    const timeoutRef = useRef(null);

    // Start initial delay
    useEffect(() => {
        timeoutRef.current = setTimeout(() => setPhase('typing'), delay);
        return () => clearTimeout(timeoutRef.current);
    }, [delay]);

    useEffect(() => {
        if (phase === 'typing') {
            if (displayed.length < text.length) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayed(text.slice(0, displayed.length + 1));
                }, speed);
            } else {
                onComplete?.();
                if (loop) {
                    timeoutRef.current = setTimeout(() => setPhase('deleting'), pauseAfterType);
                } else {
                    setPhase('done');
                }
            }
        } else if (phase === 'deleting') {
            if (displayed.length > 0) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayed(displayed.slice(0, -1));
                }, deleteSpeed);
            } else {
                setPhase('deleted');
                timeoutRef.current = setTimeout(() => {
                    onCycleStart?.();
                    setPhase('typing');
                }, pauseAfterDelete);
            }
        }

        return () => clearTimeout(timeoutRef.current);
    }, [displayed, phase, text, speed, deleteSpeed, loop, pauseAfterType, pauseAfterDelete, onComplete, onCycleStart]);

    const isActive = phase !== 'done' && phase !== 'waiting';

    return (
        <span className={className}>
            {displayed}
            {showCursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                    }}
                    className="inline-block ml-1 -mb-1 align-middle"
                    style={{
                        width: '3px',
                        height: '1em',
                        backgroundColor: isActive ? cursorColor : 'transparent',
                        borderRadius: '2px',
                    }}
                />
            )}
        </span>
    );
}
