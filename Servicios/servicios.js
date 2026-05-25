'use strict';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bandera para ejecución única
let heroEntranceDone = false;
let splitTitleDone = false;

document.addEventListener('preloaderFinished', initHeroEntrance);

function initHeroEntrance() {
    if (heroEntranceDone) return;
    heroEntranceDone = true;

    if (prefersReducedMotion) {
        document.querySelectorAll(
            '.services-hero .section-tag, .services-title, .hero-desc, .hero-stat, .hero-scroll-cta, .hero-scroll-indicator'
        ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        initSplitTitle();
        return;
    }

    const tag = document.querySelector('.services-hero .section-tag');
    const heroDesc = document.querySelector('.hero-desc');
    const heroStats = document.querySelectorAll('.hero-stat');
    const heroCta = document.querySelector('.hero-scroll-cta');
    const scrollInd = document.querySelector('.hero-scroll-indicator');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (tag) {
        tl.fromTo(tag, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 });
    }

    tl.add(() => initSplitTitle(), '-=0.2');

    if (heroDesc) {
        tl.fromTo(heroDesc, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.5');
    }
    if (heroStats.length) {
        tl.fromTo(heroStats, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, '-=0.3');
    }
    if (heroCta) {
        tl.fromTo(heroCta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    }
    if (scrollInd) {
        tl.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.1');
    }
}

function initSplitTitle() {
    if (splitTitleDone) return;
    const heroTitle = document.querySelector('.services-title');
    if (!heroTitle || prefersReducedMotion) return;
    // Si ya tiene elementos split, no volver a procesar
    if (heroTitle.querySelector('.split-word-inner')) {
        splitTitleDone = true;
        return;
    }

    const originalHTML = heroTitle.innerHTML;
    const parts = originalHTML.split(/(<br\s*\/?>)/i);
    let newHTML = '';
    parts.forEach(part => {
        if (part.match(/<br\s*\/?>/i)) {
            newHTML += part;
        } else {
            part.split(/(\s+)/).forEach(word => {
                if (!word.trim()) {
                    newHTML += word;
                } else {
                    newHTML += `<span class="split-word-wrapper" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-word-inner" style="display:inline-block;opacity:0;transform:translateY(32px) rotateX(-20deg);will-change:transform,opacity">${word}</span></span>`;
                }
            });
        }
    });
    heroTitle.innerHTML = newHTML;

    const words = heroTitle.querySelectorAll('.split-word-inner');
    words.forEach((word, i) => {
        setTimeout(() => {
            word.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0) rotateX(0)';
        }, i * 45);
    });
    splitTitleDone = true;
}

// ========== SPLIT TEXT — Títulos de sección ==========
(function initSectionTitles() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.section-title, .paquetes-title, .cta-content h2').forEach(title => {
        if (title.classList.contains('services-title')) return;
        const parts = title.innerHTML.split(/(<br\s*\/?>)/i);
        let newHTML = '';
        parts.forEach(part => {
            if (part.match(/<br\s*\/?>/i)) {
                newHTML += part;
            } else {
                part.split(/(\s+)/).forEach(word => {
                    if (!word.trim()) {
                        newHTML += word;
                    } else {
                        newHTML += `<span class="split-word-wrapper" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-word-inner" style="display:inline-block;opacity:0;transform:translateY(28px) rotateX(-18deg);will-change:transform,opacity">${word}</span></span>`;
                    }
                });
            }
        });
        title.innerHTML = newHTML;
        const inners = title.querySelectorAll('.split-word-inner');
        ScrollTrigger.create({
            trigger: title, start: 'top 85%', once: true,
            onEnter: () => {
                inners.forEach((word, i) => {
                    setTimeout(() => {
                        word.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0) rotateX(0)';
                    }, i * 35);
                });
            }
        });
    });
})();

// Hero video fade
(function initHeroVideo() {
    const heroVideo = document.querySelector('.services-hero .hero-bg-video');
    if (!heroVideo) return;
    const showVideo = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3) showVideo();
    else heroVideo.addEventListener('loadeddata', showVideo, { once: true });
    document.addEventListener('preloaderFinished', () => {
        if (heroVideo.readyState >= 3) heroVideo.classList.add('loaded');
        else heroVideo.addEventListener('loadeddata', () => heroVideo.classList.add('loaded'), { once: true });
    });
})();

// Parallax
(function initHeroParallax() {
    const heroBg = document.querySelector('.services-hero .hero-bg-video');
    if (!heroBg) return;
    gsap.to(heroBg, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.services-hero', start: 'top top', end: 'bottom top', scrub: true } });
})();

// Section tags (excepto hero)
(function initSectionTags() {
    document.querySelectorAll('.section-tag').forEach(tag => {
        if (tag.closest('.services-hero')) return;
        gsap.from(tag, { opacity: 0, x: -20, duration: 0.6, scrollTrigger: { trigger: tag, start: 'top 90%', once: true } });
    });
})();

// Servicios bloques reveal
(function initServiciosBloques() {
    const bloques = document.querySelectorAll('.servicio-bloque');
    if (!bloques.length) return;
    bloques.forEach(bloque => {
        const isReverse = bloque.classList.contains('bloque--reverse');
        const content = bloque.querySelector('.bloque-content');
        const media = bloque.querySelector('.bloque-media');
        if (content) { content.style.opacity = '0'; content.style.transform = `translateX(${isReverse ? '-3rem' : '3rem'})`; content.style.transition = 'none'; }
        if (media) { media.style.opacity = '0'; media.style.transform = 'scale(1.04)'; media.style.transition = 'none'; }
        let triggered = false;
        function reveal() {
            if (triggered) return; triggered = true;
            if (content) { requestAnimationFrame(() => { content.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)'; content.style.opacity = '1'; content.style.transform = 'translateX(0)'; }); }
            if (media) { setTimeout(() => { media.style.transition = 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)'; media.style.opacity = '1'; media.style.transform = 'scale(1)'; }, 120); }
        }
        ScrollTrigger.create({ trigger: bloque, start: 'top 82%', once: true, onEnter: reveal });
        setTimeout(() => {
            if (triggered) return;
            if (bloque.getBoundingClientRect().top < window.innerHeight * 1.1) reveal();
            else {
                function onScroll() { if (bloque.getBoundingClientRect().top < window.innerHeight * 0.92) { reveal(); window.removeEventListener('scroll', onScroll); } }
                window.addEventListener('scroll', onScroll, { passive: true });
            }
        }, 2500);
    });
})();

// Paquetes cards
(function initPaquetes() {
    const cards = document.querySelectorAll('.paquete-card');
    if (cards.length) gsap.from(cards, { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: '.paquetes-grid', start: 'top 85%', toggleActions: 'play none none none' } });
})();

// Proceso steps
(function initProcesoSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    if (steps.length) gsap.from(steps, { opacity: 0, y: 35, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: '.proceso-timeline', start: 'top 85%', toggleActions: 'play none none none' } });
})();

// CTA buttons
(function initCTAButtons() {
    const buttons = document.querySelectorAll('.cta-buttons .btn');
    if (buttons.length) gsap.from(buttons, { opacity: 0, y: 25, duration: 0.6, stagger: 0.12, scrollTrigger: { trigger: '.cta-buttons', start: 'top 88%', toggleActions: 'play none none none' } });
})();

// Smooth scroll anclas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        const startY = window.scrollY;
        const dist = targetY - startY;
        const dur = 1000;
        let startTime = null;
        const ease = t => 1 - Math.pow(1 - t, 3);
        function step(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / dur, 1);
            window.scrollTo(0, startY + dist * ease(progress));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Fallback de seguridad (4s) sin forzar el título
setTimeout(() => {
    document.querySelectorAll('.paquete-card, .timeline-step, .hero-stat, .cta-buttons .btn, .hero-desc, .hero-scroll-cta, .hero-scroll-indicator, .section-tag').forEach(el => {
        if (parseFloat(window.getComputedStyle(el).opacity) < 0.1) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    document.querySelectorAll('.bloque-content, .bloque-media').forEach(el => { el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; });
    document.querySelectorAll('.split-word-inner').forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0) rotateX(0)'; });
    ScrollTrigger.refresh();
}, 4000);

console.log('%c INNOVO STUDIO — SERVICIOS', 'background:#9A4E28;color:#F5F1EB;font-size:13px;padding:6px 14px;font-weight:700;letter-spacing:3px;');