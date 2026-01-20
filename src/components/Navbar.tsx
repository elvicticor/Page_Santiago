import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav>
            <div className="mono" style={{ fontWeight: 'bold' }}>GLYTCH_//_AUDIO</div>
            <div className={`nav-links mono ${isOpen ? 'active' : ''}`}>
                <a href="#identity" className="nav-link" onClick={() => setIsOpen(false)}>Sobre_Mí</a>
                <a href="#canciones" className="nav-link" onClick={() => setIsOpen(false)}>Canciones</a>
                <a href="#gallery" className="nav-link" onClick={() => setIsOpen(false)}>Galería</a>
                <a href="#tickets" className="nav-link" onClick={() => setIsOpen(false)}>Tickets</a>
                <a href="#comments" className="nav-link" onClick={() => setIsOpen(false)}>Fans</a>
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
