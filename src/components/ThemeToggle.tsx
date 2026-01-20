import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setTheme('light');
            document.body.classList.add('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button
            id="theme-toggle"
            className="mono"
            onClick={toggleTheme}
            style={{
                background: 'transparent',
                border: '1px solid var(--fg)',
                color: 'var(--fg)',
                padding: '5px 10px',
                cursor: 'pointer'
            }}
        >
            {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
        </button>
    );
};

export default ThemeToggle;
