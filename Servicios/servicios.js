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
                        yPercent: -100, duration: 0.9, ease: 'power3.inOut', onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.style.overflow = '';
                            ScrollTrigger.refresh();
                        }
                    });
                } else {
                    gsap.to(preloader, {
                        yPercent: -100, duration: 0.9, ease: 'power3.inOut', onComplete: () => {
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
            gsap.to(curtain, { yPercent: 0, duration: 0.7, ease: 'power3.inOut', onComplete: () => { window.location.href = href; } });
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

// ========== SPLIT TEXT EN TÍTULOS ==========
(function initSplitTitles() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    document.querySelectorAll('[data-split]').forEach(title => {
        const originalHTML = title.innerHTML;
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
        title.innerHTML = newHTML;
        const inners = title.querySelectorAll('.split-word-inner');
        ScrollTrigger.create({
            trigger: title,
            start: 'top 88%',
            onEnter: () => {
                inners.forEach((inner, i) => {
                    setTimeout(() => {
                        inner.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
                        inner.style.opacity = '1';
                        inner.style.transform = 'translateY(0) rotateX(0)';
                    }, i * 38);
                });
            }
        });
    });
})();

// ========== SCROLL REVEAL (cards, steps, etc) ==========
(function initScrollReveal() {
    const reveals = document.querySelectorAll('.service-card, .paquete-card, .timeline-step, .section-tag');
    reveals.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ========== SERVICIOS CARDS STAGGER ==========
(function initServicesCards() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;
    gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: { trigger: '.services-grid', start: 'top 82%' }
    });
})();

// ========== PAQUETES STAGGER ==========
(function initPaquetes() {
    const cards = document.querySelectorAll('.paquete-card');
    if (!cards.length) return;
    gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        scrollTrigger: { trigger: '.paquetes-grid', start: 'top 85%' }
    });
})();

// ========== PROCESO STEPS STAGGER ==========
(function initProcesoSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;
    gsap.from(steps, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: { trigger: '.proceso-timeline', start: 'top 80%' }
    });
})();

// ========== CTA BUTTONS STAGGER ==========
(function initCTAButtons() {
    const buttons = document.querySelectorAll('.cta-buttons .btn');
    if (!buttons.length) return;
    gsap.from(buttons, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: { trigger: '.cta-buttons', start: 'top 88%' }
    });
})();

// ========== HERO PARALLAX ==========
(function initHeroParallax() {
    const heroBg = document.querySelector('.services-hero .hero-bg-img');
    if (!heroBg) return;
    gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.services-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
})();

// ========== SMOOTH SCROLL FOR ANCHORS ==========
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
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

console.log('%c INNOVO STUDIO — SERVICIOS (unificado)', 'background:#9A4E28;color:#F5F1EB;font-size:13px;padding:6px 14px;font-weight:700;letter-spacing:3px;');