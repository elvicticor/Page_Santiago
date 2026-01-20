import React, { useState, useEffect } from 'react';

const Carousel = () => {
    const images = ['/1.jpg', '/2.jpg', '/4.jpg']; // Assuming these are in public/
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Auto resize handling not strictly needed with React state re-render, 
    // but CSS transform needs % or px. The original used px and getBoundingClientRect.
    // CSS-only implementation or simple % transform is better.
    // Let's use simple style transform with %.

    return (
        <section id="gallery" className="container">
            <div className="section-header">
                <h3>/// GALERÍA</h3>
                <span className="mono" style={{ color: 'var(--cyan)' }}>VISUAL_DATA</span>
            </div>
            <div className="carousel-container">
                <button className="carousel-btn prev" onClick={prevSlide}>&lt;</button>
                <div className="carousel-track-container">
                    <ul className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
                        {images.map((img, index) => (
                            <li className={`carousel-slide ${index === currentIndex ? 'current-slide' : ''}`} key={index}>
                                <img src={img} alt={`Gallery Image ${index + 1}`} />
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="carousel-btn next" onClick={nextSlide}>&gt;</button>
            </div>
        </section>
    );
};

export default Carousel;
