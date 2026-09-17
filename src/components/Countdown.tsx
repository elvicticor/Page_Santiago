import React, { useEffect, useRef, useState } from 'react';

const TARGET_DATE = new Date('2026-12-05T19:00:00-05:00').getTime();

function getRemaining() {
    const diff = Math.max(TARGET_DATE - Date.now(), 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
}

const pad = (n: number) => n.toString().padStart(2, '0');

const Countdown = () => {
    const [time, setTime] = useState(getRemaining());
    const reducedMotion = useRef(false);

    useEffect(() => {
        reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const interval = setInterval(() => setTime(getRemaining()), 1000);
        return () => clearInterval(interval);
    }, []);

    const units: [string, number][] = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Minutos', time.minutes],
        ['Segundos', time.seconds],
    ];

    return (
        <section id="countdown" className="countdown-section container">
            <span className="mono section-eyebrow reveal">✦ CUENTA REGRESIVA</span>
            <h3 className="reveal" style={{ marginTop: '14px', textTransform: 'none' }}>
                Faltan pocos días para la gran gala
            </h3>
            <div className="countdown-grid reveal">
                {units.map(([label, value]) => (
                    <div className="countdown-item" key={label}>
                        <span
                            className="countdown-value"
                            style={
                                reducedMotion.current
                                    ? undefined
                                    : { transition: 'opacity 0.25s ease' }
                            }
                        >
                            {pad(value)}
                        </span>
                        <span className="countdown-label mono">{label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Countdown;
