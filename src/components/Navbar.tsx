import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const close = () => setIsOpen(false);

    return (
        <nav>
            <a href="#hero" className="mono" style={{ fontWeight: 700, letterSpacing: '0.08em' }} onClick={close}>
                ✦ PRAISE MUSIC AWARDS
            </a>
            <div className={`nav-links mono ${isOpen ? 'active' : ''}`}>
                <a href="#about" className="nav-link" onClick={close}>Sobre el Premio</a>
                <a href="#live" className="nav-link" onClick={close}>En Vivo</a>
                <a href="#nominados" className="nav-link" onClick={close}>Música</a>
                <a href="#blog" className="nav-link" onClick={close}>Blog</a>
                <a href="#libros" className="nav-link" onClick={close}>Libros</a>
                <a href="#vote" className="nav-link cta" onClick={close}>Votar</a>
            </div>
            <div className="nav-controls" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <ThemeToggle />

                <button id="menu-toggle" className="mobile-only" aria-label="Menu"
                    style={{ background: 'transparent', border: 'none', color: 'var(--fg)', cursor: 'pointer', display: 'none' }}
                    onClick={toggleMenu}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
