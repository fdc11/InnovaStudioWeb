'use strict';

// Protección por si GSAP no cargó
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.error('GSAP no cargó. Revisa tu conexión o los CDNs.');
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// El resto del archivo (initSectionTitles, initHeroVideo, etc.) se mantiene igual