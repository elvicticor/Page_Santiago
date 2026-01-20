window.addEventListener('load', () => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Disable scrolling while loading
    document.body.style.overflow = 'hidden';

    // Wait 3 seconds
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade-out');

        // Re-enable scrolling
        document.body.style.overflow = '';

        // Ensure visualizer starts fresh if needed
        // (Visualizer logic handles itself)
    }, 3000);
});

// Visualizer Logic
const visualizerContainer = document.getElementById('visualizer-bars');
const barCount = 40;
const bars = [];

// Create bars
for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = '10px';
    visualizerContainer.appendChild(bar);
    bars.push(bar);
}

let isPlaying = false;
let animationId;

function updateVisualizer() {
    if (!isPlaying) return;

    bars.forEach(bar => {
        // Simulate audio data
        const height = Math.random() * 200 + 10;
        bar.style.height = `${height}px`;
    });

    // Random glitch effect on body
    if (Math.random() > 0.95) {
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 50);
    }

    animationId = requestAnimationFrame(updateVisualizer);
}

// Player Logic
const playBtn = document.getElementById('play-btn');
const playIcon = `<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><path d="M1 1V17L13 9L1 1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
const pauseIcon = `<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><rect x="1" y="1" width="4" height="16" /><rect x="9" y="1" width="4" height="16" /></svg>`;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playBtn.innerHTML = pauseIcon;
        updateVisualizer();
        document.body.classList.add('active-audio');
    } else {
        playBtn.innerHTML = playIcon;
        cancelAnimationFrame(animationId);
        bars.forEach(bar => bar.style.height = '10px');
        document.body.classList.remove('active-audio');
    }
});

// Initial low-level activity
setInterval(() => {
    if (!isPlaying) {
        const randomBar = bars[Math.floor(Math.random() * bars.length)];
        randomBar.style.height = `${Math.random() * 30 + 10}px`;
        setTimeout(() => {
            randomBar.style.height = '10px';
        }, 200);
    }
}, 100);

// Playlist Logic
const trackRows = document.querySelectorAll('.track-row');
const currentTitle = document.querySelector('.track-title');
const currentArtist = document.querySelector('.track-artist');

trackRows.forEach(row => {
    row.addEventListener('click', () => {
        const title = row.dataset.title;
        const artist = row.dataset.artist;

        // Update specific inputs
        currentTitle.innerText = title;
        currentArtist.innerText = artist;

        // Visual feedback
        trackRows.forEach(r => r.style.background = 'transparent');
        row.style.background = '#111';
        row.style.color = 'var(--cyan)';

        // Auto play if not playing
        if (!isPlaying) {
            playBtn.click();
        }
    });
});

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check saved preference
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeBtn.innerText = 'DARK_MODE';
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeBtn.innerText = 'DARK_MODE';
    } else {
        localStorage.setItem('theme', 'dark');
        themeBtn.innerText = 'LIGHT_MODE';
    }
});

// Mobile Menu Logic
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Optional: Animate lines of hamburger to X (advanced, skipping for now)
});

// Close menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Carousel Logic
const track = document.getElementById('carousel-track');
const nextButton = document.getElementById('carousel-next');
const prevButton = document.getElementById('carousel-prev');
const slides = Array.from(track.children);

// Arrange slides next to one another
// (Not strictly necessary with flex, but good for sliding animation calculation if using transform)
// actually flex handles layout, we just need to translate the track

let currentSlideIndex = 0;

function updateCarousel() {
    const width = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentSlideIndex * width}px)`;

    // Update current slide class
    slides.forEach(slide => slide.classList.remove('current-slide'));
    slides[currentSlideIndex].classList.add('current-slide');
}

nextButton.addEventListener('click', () => {
    currentSlideIndex++;
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    }
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentSlideIndex--;
    if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    updateCarousel();
});

// Window resize handling for carousel
window.addEventListener('resize', updateCarousel);


// Comments Logic
const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('comment-name');
    const msgInput = document.getElementById('comment-msg');

    if (nameInput.value && msgInput.value) {
        const div = document.createElement('div');
        div.classList.add('comment-item');
        div.innerHTML = `
            <span class="comment-user mono">${nameInput.value.toUpperCase()}</span>
            <span class="comment-time mono">AHORA_MISMO</span>
            <p class="comment-text">${msgInput.value}</p>
        `;

        // Add to top
        commentsList.insertBefore(div, commentsList.firstChild);

        // Reset form
        nameInput.value = '';
        msgInput.value = '';

        // Flash effect
        div.style.background = 'var(--cyan)';
        setTimeout(() => {
            div.style.background = 'transparent';
        }, 200);
    }
});
