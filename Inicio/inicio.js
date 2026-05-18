/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — inicio.js
   Vanilla JS — Sin frameworks ni librerías externas
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   1. NAVBAR SCROLL
   ══════════════════════════════ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 60;

    function onScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Init state
})();

/* ══════════════════════════════
   2. MENÚ HAMBURGER (MOBILE)
   ══════════════════════════════ */
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!hamburger || !mobileMenu) return;

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        hamburger.classList.add('is-open');
        mobileMenu.classList.add('is-open');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        isOpen = false;
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', () => {
        isOpen ? closeMenu() : openMenu();
    });

    // Cerrar al hacer click en links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });
})();

/* ══════════════════════════════
   3. PARALLAX HERO
   ══════════════════════════════ */
(function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    // Solo en desktop para evitar lag en mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    function onScroll() {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.3;
        heroBg.style.transform = `translateY(${offset}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ══════════════════════════════
   4. SCROLL REVEAL
      IntersectionObserver para
      .reveal, .reveal-left, .reveal-right
   ══════════════════════════════ */
(function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Una sola vez
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════
   5. CONTADOR ANIMADO (STATS)
   ══════════════════════════════ */
(function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const DURATION = 1800; // ms

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * target);

            el.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = prefix + target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════
   6. SLIDER DE TESTIMONIOS
   ══════════════════════════════ */
(function initSlider() {
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    const sliderWrap = document.querySelector('.slider-wrap');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    prevBtn.addEventListener('click', () => {
        stopAuto();
        goTo(current - 1);
        startAuto();
    });

    nextBtn.addEventListener('click', () => {
        stopAuto();
        goTo(current + 1);
        startAuto();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAuto();
            goTo(parseInt(dot.dataset.index, 10));
            startAuto();
        });
    });

    // Pausa en hover
    if (sliderWrap) {
        sliderWrap.addEventListener('mouseenter', stopAuto);
        sliderWrap.addEventListener('mouseleave', startAuto);
    }

    // Swipe táctil
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            stopAuto();
            goTo(dx < 0 ? current + 1 : current - 1);
            startAuto();
        }
    }, { passive: true });

    goTo(0);
    startAuto();
})();

/* ══════════════════════════════
   7. CURSOR PERSONALIZADO
   ══════════════════════════════ */
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    if (!cursor || !follower) return;

    // Ocultar en dispositivos táctiles
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Follower con interpolación suave
    function animateFollower() {
        const ease = 0.12;
        followerX += (mouseX - followerX) * ease;
        followerY += (mouseY - followerY) * ease;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Escalar en elementos interactivos
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .work-item');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.opacity = '0.6';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.opacity = '1';
        });
    });

    // Ocultar cursor al salir de ventana
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
})();

/* ══════════════════════════════
   8. SMOOTH SCROLL PARA ANCLAS
   ══════════════════════════════ */
(function initSmoothScroll() {
    const NAV_HEIGHT = 72;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

/* ══════════════════════════════
   9. LAZY INIT CARDS (accesibilidad teclado)
   ══════════════════════════════ */
(function initCardKeyboard() {
    const cards = document.querySelectorAll('.service-card, .work-item');
    cards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
})();

/* ══════════════════════════════
   10. HERO PARALLAX SOLO DESKTOP
   ══════════════════════════════ */
(function heroParallaxDesktop() {
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Ya inicializado arriba, solo asegurar que transform no rompa
    heroBg.style.willChange = 'transform';
})();

/* ══════════════════════════════
   INIT LOG
   ══════════════════════════════ */
console.log('%c INNOVO STUDIO ', 'background:#72393F;color:#F0E9E3;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');
console.log('%c Creamos. Capturamos. Conectamos. ', 'color:#AD9D8D;font-size:11px;');