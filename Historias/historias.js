/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — historias.js (sin cursor, con video fade-in)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ========== SCROLL PROGRESS BAR ==========
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { gsap.set(bar, { scaleX: self.progress }); }
    });
})();

// ========== TEXT SPLIT ==========
(function initTextSplitting() {
    const titles = document.querySelectorAll('[data-split]');
    titles.forEach(title => {
        const raw = title.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i);
        title.innerHTML = lines.map((line, index) =>
            `<span class="split-line"><span class="split-line-inner" style="transition-delay: ${index * 120}ms">${line.trim()}</span></span>`
        ).join('');
    });
    setTimeout(() => {
        const heroTitleInners = document.querySelectorAll('.stories-title .split-line-inner');
        heroTitleInners.forEach(inner => inner.classList.add('revealed'));
    }, 200);
})();

// ========== HERO VIDEO FADE-IN (NUEVO) ==========
(function initStoriesHeroVideo() {
    const heroVideo = document.querySelector('.stories-hero-video');
    if (!heroVideo) return;
    const showVideo = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3) {
        showVideo();
    } else {
        heroVideo.addEventListener('loadeddata', showVideo, { once: true });
        setTimeout(() => {
            if (!heroVideo.classList.contains('loaded')) showVideo();
        }, 2000);
    }
})();

// ========== PARALLAX SUTIL PARA EL VIDEO (OPCIONAL) ==========
(function initStoriesHeroParallax() {
    const heroBg = document.querySelector('.stories-hero-video');
    if (!heroBg) return;
    gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.stories-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
})();

// ========== SCROLL REVEAL ==========
function runScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .work-item, [data-split]');
    if (!elements.length) return;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.add('revealed');
                    const inners = entry.target.querySelectorAll('.split-line-inner');
                    inners.forEach(inner => inner.classList.add('revealed'));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach(el => { if (!el.classList.contains('revealed')) observer.observe(el); });
}
(function initScrollReveal() { runScrollReveal(); })();

// ========== PORTFOLIO FILTER LOGIC ==========
(function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    if (!filterButtons.length || !workItems.length) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            workItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            item.classList.add('revealed', 'is-visible');
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 400);
            });
            setTimeout(() => { runScrollReveal(); }, 450);
        });
    });
})();

console.log('%c INNOVO STUDIO — HISTORIAS ', 'background:#72393F;color:#F0E9E3;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');