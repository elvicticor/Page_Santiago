import React, { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { isPlaying } from '../stores/playerStore';

const Visualizer = () => {
    const $isPlaying = useStore(isPlaying);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);

    // Generate bars once
    useEffect(() => {
        if (containerRef.current && containerRef.current.children.length === 0) {
            for (let i = 0; i < 40; i++) {
                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.height = '10px';
                containerRef.current.appendChild(bar);
            }
        }
    }, []);

    const animate = () => {
        if (containerRef.current) {
            const bars = containerRef.current.children;
            for (let i = 0; i < bars.length; i++) {
                const height = Math.random() * 200 + 10;
                (bars[i] as HTMLElement).style.height = `${height}px`;
            }
            // Random glitch
            if (Math.random() > 0.95) {
                document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 50);
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    const resetBars = () => {
        if (containerRef.current) {
            const bars = containerRef.current.children;
            for (let i = 0; i < bars.length; i++) {
                (bars[i] as HTMLElement).style.height = '10px';
            }
        }
    };

    useEffect(() => {
        if ($isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
            document.body.classList.add('active-audio');
        } else {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            resetBars();
            document.body.classList.remove('active-audio');
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            // Cleanup side effect on body ? Maybe not if we want to toggle.
            document.body.classList.remove('active-audio');
        };
    }, [$isPlaying]);

    // Background idle animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!$isPlaying && containerRef.current) {
                const bars = containerRef.current.children;
                if (bars.length > 0) {
                    const randomBar = bars[Math.floor(Math.random() * bars.length)] as HTMLElement;
                    randomBar.style.height = `${Math.random() * 30 + 10}px`;
                    setTimeout(() => {
                        randomBar.style.height = '10px';
                    }, 200);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [$isPlaying]);

    return (
        <section id="visualizer" className="visualizer-section">
            <div className="container">
                <h3 className="mono" style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--muted)' }}>///
                    AUDIO_PROCESSOR</h3>
                <div className="visualizer-container" id="visualizer-bars" ref={containerRef}>
                    {/* Bars injected via JS */}
                </div>
            </div>
        </section>
    );
};

export default Visualizer;
