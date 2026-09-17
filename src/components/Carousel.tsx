import React, { useState } from 'react';

const images = [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?q=80&w=1200&auto=format&fit=crop',
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section id="gallery" className="container">
            <div className="section-header reveal">
                <h3>Galería</h3>
                <span className="mono section-eyebrow">EDICIONES_ANTERIORES</span>
            </div>
            <div className="carousel-container reveal">
                <button className="carousel-btn prev" onClick={prevSlide} aria-label="Anterior">&lt;</button>
                <div className="carousel-track-container">
                    <ul className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {images.map((img, index) => (
                            <li className={`carousel-slide ${index === currentIndex ? 'current-slide' : ''}`} key={index}>
                                <img src={img} alt={`Momento de la gala ${index + 1}`} />
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="carousel-btn next" onClick={nextSlide} aria-label="Siguiente">&gt;</button>
            </div>
        </section>
    );
};

export default Carousel;
