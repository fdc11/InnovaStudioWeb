'use strict';

gsap.registerPlugin(ScrollTrigger);
// ScrollToPlugin eliminado — no se usaba

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
                const target = veil || preloader;
                gsap.to(target, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        document.body.style.overflow = '';
                        ScrollTrigger.refresh();
                        initHeroEntrance(); // Hero se anima DESPUÉS del preloader
                    }
                });
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

// ========== SCRAMBLE TEXT — Logo navbar (igual que inicio) ==========
(function initScrambleNavLogo() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    // El primer nodo de texto del logo es "INNOVO"
    const textNode = logo.childNodes[0];
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const originalText = 'INNOVO';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let interval = null;
    let isAnimating = false;

    logo.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;
        let iteration = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            const newText = originalText.split('').map((letter, i) => {
                if (i < iteration) return letter;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            textNode.textContent = newText;
            if (iteration >= originalText.length) {
                textNode.textContent = originalText;
                clearInterval(interval);
                isAnimating = false;
            }
            iteration += 0.5;
        }, 40);
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
        hamburger.setAttribute('aria-expanded', isOpen);
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
            hamburger.setAttribute('aria-expanded', 'false');
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

// ========== HERO ENTRANCE (se llama tras el preloader) ==========
// Los elementos del hero empiezan invisibles vía CSS:
// .services-hero .section-tag,
// .services-hero .services-title,
// .services-hero .hero-desc,
// .services-hero .hero-stat,
// .services-hero .hero-scroll-cta,
// .services-hero .hero-scroll-indicator { opacity: 0; }
function initHeroEntrance() {
    if (prefersReducedMotion) {
        document.querySelectorAll(
            '.services-hero .section-tag, .services-title, .hero-desc, .hero-stat, .hero-scroll-cta, .hero-scroll-indicator'
        ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        initSplitTitle(); // igual arrancamos el split para el resto de la página
        return;
    }

    const tag = document.querySelector('.services-hero .section-tag');
    const heroDesc = document.querySelector('.hero-desc');
    const heroStats = document.querySelectorAll('.hero-stat');
    const heroCta = document.querySelector('.hero-scroll-cta');
    const scrollInd = document.querySelector('.hero-scroll-indicator');

    // Primero el tag (label pequeño)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (tag) {
        tl.fromTo(tag,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6 }
        );
    }

    // Luego el título con split word por word
    tl.add(() => initSplitTitle(), '-=0.2');

    // Luego desc, stats y cta en cascada
    if (heroDesc) {
        tl.fromTo(heroDesc,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.7 },
            '+=0.5'   // espera a que terminen las palabras del título
        );
    }
    if (heroStats.length) {
        tl.fromTo(heroStats,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 },
            '-=0.3'
        );
    }
    if (heroCta) {
        tl.fromTo(heroCta,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
        );
    }
    if (scrollInd) {
        tl.fromTo(scrollInd,
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            '-=0.1'
        );
    }
}

// ========== SPLIT TEXT — Hero título ==========
function initSplitTitle() {
    const heroTitle = document.querySelector('.services-title');
    if (!heroTitle || prefersReducedMotion) return;

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
    // Animamos con delay escalonado — sin ScrollTrigger porque el hero ya es visible
    words.forEach((word, i) => {
        setTimeout(() => {
            word.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0) rotateX(0)';
        }, i * 45);
    });

    // Retornar duración estimada para que el timeline la espere
    return words.length * 45;
}

// ========== SPLIT TEXT — Títulos de sección (con ScrollTrigger) ==========
(function initSectionTitles() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.section-title, .paquetes-title, .cta-content h2').forEach(title => {
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
            trigger: title,
            start: 'top 85%',
            once: true,
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

// ========== PARALLAX HERO ==========
(function initHeroParallax() {
    const heroBg = document.querySelector('.services-hero .hero-bg-img');
    if (!heroBg) return;
    gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.services-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
})();

// ========== SECTION TAGS (fuera del hero) ==========
(function initSectionTags() {
    document.querySelectorAll('.section-tag').forEach(tag => {
        if (tag.closest('.services-hero')) return; // ya animado en hero
        gsap.from(tag, {
            opacity: 0, x: -20, duration: 0.6,
            scrollTrigger: { trigger: tag, start: 'top 90%', once: true }
        });
    });
})();

// ========== SERVICE CARDS ==========
(function initServicesCards() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;
    gsap.from(cards, {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.12,
        scrollTrigger: { trigger: '.services-grid', start: 'top 85%', toggleActions: 'play none none none' }
    });
})();

// ========== PAQUETES CARDS ==========
(function initPaquetes() {
    const cards = document.querySelectorAll('.paquete-card');
    if (!cards.length) return;
    gsap.from(cards, {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: '.paquetes-grid', start: 'top 85%', toggleActions: 'play none none none' }
    });
})();

// ========== PROCESO STEPS ==========
(function initProcesoSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;
    gsap.from(steps, {
        opacity: 0, y: 35, duration: 0.7, stagger: 0.15,
        scrollTrigger: { trigger: '.proceso-timeline', start: 'top 85%', toggleActions: 'play none none none' }
    });
})();

// ========== CTA BUTTONS ==========
(function initCTAButtons() {
    const buttons = document.querySelectorAll('.cta-buttons .btn');
    if (!buttons.length) return;
    gsap.from(buttons, {
        opacity: 0, y: 25, duration: 0.6, stagger: 0.12,
        scrollTrigger: { trigger: '.cta-buttons', start: 'top 88%', toggleActions: 'play none none none' }
    });
})();

// ========== FOOTER COLUMNS ==========
(function initFooter() {
    gsap.from('.footer-grid > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: '.footer-grid', start: 'top 88%', toggleActions: 'play none none none' }
    });
})();

// ========== MARQUEE PAUSE ON HOVER ==========
(function initMarquee() {
    const tickerTrack = document.querySelector('.ticker-track');
    if (!tickerTrack) return;
    const wrapper = tickerTrack.parentElement;
    wrapper.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    wrapper.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
})();

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
        const startY = window.scrollY;
        const dist = targetY - startY;
        const dur = 1000;
        let startTime = null;
        const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
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
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// ========== FALLBACK DE SEGURIDAD (nada invisible tras 4s) ==========
setTimeout(() => {
    document.querySelectorAll(
        '.service-card, .paquete-card, .timeline-step, .hero-stat, .cta-buttons .btn, .hero-desc, .hero-scroll-cta, .hero-scroll-indicator, .section-tag'
    ).forEach(el => {
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

console.log('%c INNOVO STUDIO — SERVICIOS', 'background:#9A4E28;color:#F5F1EB;font-size:13px;padding:6px 14px;font-weight:700;letter-spacing:3px;');