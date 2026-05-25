'use strict';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ========== PRELOADER ==========
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    document.body.style.overflow = 'hidden';
    const counterEl = preloader.querySelector('.preloader-counter');
    const barFill = document.getElementById('preloaderBarFill');
    const veil = preloader.querySelector('.preloader-veil');
    let obj = { val: 0 };
    gsap.to(obj, {
        val: 100,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: () => {
            const percent = Math.floor(obj.val);
            if (counterEl) counterEl.textContent = percent + '%';
            if (barFill) barFill.style.width = percent + '%';
        },
        onComplete: () => {
            gsap.delayedCall(0.2, () => {
                if (veil) {
                    gsap.to(veil, {
                        yPercent: -100,
                        duration: 0.9,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.style.overflow = '';
                            ScrollTrigger.refresh();
                        }
                    });
                } else {
                    gsap.to(preloader, {
                        yPercent: -100,
                        duration: 0.9,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.style.overflow = '';
                            ScrollTrigger.refresh();
                        }
                    });
                }
            });
        }
    });
})();

// ========== TRANSICIÓN ENTRE PÁGINAS ==========
(function initPageTransitions() {
    const curtain = document.getElementById('pageCurtain');
    if (!curtain) return;
    gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.1 });
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburger = document.getElementById('hamburger');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger && hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
            gsap.to(curtain, {
                yPercent: 0,
                duration: 0.7,
                ease: 'power3.inOut',
                onComplete: () => { window.location.href = href; }
            });
        });
    });
})();

// ========== NAVBAR SCROLL ==========
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => navbar.classList.add('scrolled'),
        onLeaveBack: () => navbar.classList.remove('scrolled')
    });
})();

// ========== MENÚ MÓVIL ==========
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    const links = mobileMenu.querySelectorAll('.mobile-link');
    const info = mobileMenu.querySelectorAll('.mobile-info a, .mobile-socials a');
    gsap.set(links, { opacity: 0, y: 40 });
    gsap.set(info, { opacity: 0 });
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) {
            gsap.to(links, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.3 });
            gsap.to(info, { opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.6 });
        } else {
            gsap.to([links, info], { opacity: 0, y: 20, duration: 0.3, stagger: 0.03, ease: 'power2.in' });
        }
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

// ========== SCROLL PROGRESS BAR ==========
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    gsap.to(bar, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });
})();

// ========== SPLIT TEXT ANIMATION (HERO + TÍTULOS) ==========
(function initSplitText() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Función para aplicar split a cualquier elemento con [data-split]
    function applySplit(element) {
        const originalHTML = element.innerHTML;
        const parts = originalHTML.split(/(<br\s*\/?>)/i);
        let newHTML = '';
        parts.forEach(part => {
            if (part.match(/<br\s*\/?>/i)) {
                newHTML += part;
            } else {
                const words = part.split(/(\s+)/);
                words.forEach(word => {
                    if (!word.trim()) {
                        newHTML += word;
                    } else {
                        newHTML += `<span class="split-word-wrapper" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-word-inner" style="display:inline-block;opacity:0;transform:translateY(28px) rotateX(-18deg);will-change:transform,opacity">${word}</span></span>`;
                    }
                });
            }
        });
        element.innerHTML = newHTML;
        return element.querySelectorAll('.split-word-inner');
    }

    // Hero title: se anima al entrar (inmediatamente porque el hero es visible)
    const heroTitle = document.querySelector('.services-title');
    if (heroTitle) {
        const words = applySplit(heroTitle);
        // Animación escalonada al cargar (sin ScrollTrigger)
        setTimeout(() => {
            words.forEach((word, i) => {
                setTimeout(() => {
                    word.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0) rotateX(0)';
                }, i * 40);
            });
        }, 300);
    }

    // Otros títulos (section-title, paquetes-title, etc.) con ScrollTrigger
    document.querySelectorAll('.section-title, .paquetes-title, .cta-content h2').forEach(title => {
        const words = applySplit(title);
        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => {
                words.forEach((word, i) => {
                    setTimeout(() => {
                        word.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0) rotateX(0)';
                    }, i * 35);
                });
            },
            once: true
        });
    });
})();

// ========== ENTRADA DE ELEMENTOS CON GSAP (sin conflictos) ==========

// 1. Hero: label, stats, scroll-cta
const heroLabel = document.querySelector('.services-hero .section-tag');
const heroStats = document.querySelectorAll('.hero-stat');
const heroScrollCta = document.querySelector('.hero-scroll-cta');
if (heroLabel) gsap.from(heroLabel, { opacity: 0, y: 20, duration: 0.7, delay: 0.2 });
if (heroStats.length) gsap.from(heroStats, { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, delay: 0.4 });
if (heroScrollCta) gsap.from(heroScrollCta, { opacity: 0, y: 15, duration: 0.6, delay: 0.8 });

// 2. Service Cards (stagger al hacer scroll)
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length) {
    gsap.from(serviceCards, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
}

// 3. Paquete Cards (stagger)
const paqueteCards = document.querySelectorAll('.paquete-card');
if (paqueteCards.length) {
    gsap.from(paqueteCards, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.paquetes-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
}

// 4. Timeline Steps (proceso)
const timelineSteps = document.querySelectorAll('.timeline-step');
if (timelineSteps.length) {
    gsap.from(timelineSteps, {
        opacity: 0,
        y: 35,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.proceso-timeline',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
}

// 5. CTA Buttons
const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
if (ctaButtons.length) {
    gsap.from(ctaButtons, {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.12,
        scrollTrigger: {
            trigger: '.cta-buttons',
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
}

// 6. Section Tags (pequeña entrada desde izquierda)
document.querySelectorAll('.section-tag').forEach(tag => {
    if (tag.closest('.services-hero')) return; // ya animado
    gsap.from(tag, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        scrollTrigger: {
            trigger: tag,
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
});

// 7. Footer columns (stagger)
const footerCols = document.querySelectorAll('.footer-grid > *');
if (footerCols.length) {
    gsap.from(footerCols, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
}

// ========== PARALLAX HERO ==========
const heroBg = document.querySelector('.services-hero .hero-bg-img');
if (heroBg) {
    gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.services-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ========== MARQUEE PAUSE ON HOVER ==========
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
    const wrapper = tickerTrack.parentElement;
    wrapper.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    wrapper.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
}

// ========== SMOOTH SCROLL PARA ANCLAS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        // Cerrar menú móvil si está abierto
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ========== FALLBACK DE SEGURIDAD (nada invisible) ==========
setTimeout(() => {
    document.querySelectorAll('.service-card, .paquete-card, .timeline-step, .hero-stat, .cta-buttons .btn').forEach(el => {
        if (parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
    document.querySelectorAll('.split-word-inner').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) rotateX(0)';
    });
    ScrollTrigger.refresh();
}, 4000);

console.log('%c INNOVO STUDIO — SERVICIOS (animaciones corregidas)', 'background:#9A4E28;color:#F5F1EB;font-size:13px;padding:6px 14px;font-weight:700;letter-spacing:3px;');