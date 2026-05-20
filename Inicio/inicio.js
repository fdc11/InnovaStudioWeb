/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — inicio.js
   Vanilla JS de Alta Gama — Estilo Awwwards / Editorial Luxe
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   0. TEXT SPLIT — GENERALIZED TITLES REVEALS
   Divides all titles with [data-split] by <br> and wraps them in spans for animation.
   ══════════════════════════════ */
(function initTextSplitting() {
    const titles = document.querySelectorAll('[data-split]');
    titles.forEach(title => {
        const raw = title.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i);

        title.innerHTML = lines.map((line, index) =>
            `<span class="split-line"><span class="split-line-inner" style="transition-delay: ${index * 120}ms">${line.trim()}</span></span>`
        ).join('');
    });

    // Auto-reveal Hero title lines on load
    setTimeout(() => {
        const heroTitleInners = document.querySelectorAll('.hero-title .split-line-inner');
        heroTitleInners.forEach(inner => inner.classList.add('revealed'));
    }, 200);
})();

/* ══════════════════════════════
   1. NAVBAR SCROLL
   Toggles .scrolled class past 60px scroll
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
    onScroll();
})();

/* ══════════════════════════════
   2. MENÚ HAMBURGER (MOBILE)
   Full screen menu with stagger animation, scroll lock, and Escape close
   ══════════════════════════════ */
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!hamburger || !mobileMenu) return;

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        isOpen = false;
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });
})();

/* ══════════════════════════════
   3. HERO TICKER / MARQUEE BANNER
   Duplicating text blocks dynamically for a gapless marquee loop
   ══════════════════════════════ */
(function initMarquee() {
    const ticker = document.querySelector('.hero-ticker');
    if (!ticker) return;
    const track = ticker.querySelector('.ticker-track');
    const content = ticker.querySelector('.ticker-content');
    if (!track || !content) return;
    
    // Clone contents to ensure seamless gapless animation on wide screens
    for (let i = 0; i < 6; i++) {
        track.appendChild(content.cloneNode(true));
    }
})();

/* ══════════════════════════════
   4. SCROLL REVEAL (Efecto de apariciones suaves)
   ══════════════════════════════ */
(function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, [data-split], .sobre-img-container, .service-card, .work-img-wrapper');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.add('revealed');
                    
                    // Reveal inner split title lines if present
                    const inners = entry.target.querySelectorAll('.split-line-inner');
                    inners.forEach(inner => inner.classList.add('revealed'));
                    
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════
   5. CONTADOR ANIMADO (STATS)
   Runs from 0 to final target with easeOutExpo, locale formatting, and delayed suffix
   ══════════════════════════════ */
(function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const DURATION = 1800;

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const start = performance.now();

        // Setup structure: number container + separate hidden suffix container
        el.innerHTML = `${prefix}<span class="num-val">0</span><span class="num-suffix" style="opacity: 0; display: inline-block; transition: opacity 0.3s ease, transform 0.3s ease; transform: translateY(8px);">${suffix}</span>`;
        
        const numVal = el.querySelector('.num-val');
        const numSuffix = el.querySelector('.num-suffix');

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * target);

            numVal.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                numVal.textContent = target.toLocaleString();
                // Animate suffix separately with a 300ms delay after finish
                setTimeout(() => {
                    numSuffix.style.opacity = '1';
                    numSuffix.style.transform = 'translateY(0)';
                }, 300);
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
        { threshold: 0.4 }
    );

    statNumbers.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════
   6. PORTFOLIO SCROLL PARALLAX
   Moves image within work-item using requestAnimationFrame
   ══════════════════════════════ */
(function initPortfolioParallax() {
    const workItems = document.querySelectorAll('.work-item');
    if (!workItems.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    function updateParallax() {
        workItems.forEach(item => {
            const img = item.querySelector('.work-img');
            if (!img) return;

            const rect = item.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Trigger shifts only when in current viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const offset = (rect.top - viewportHeight / 2) * 0.25;
                img.style.transform = `translateY(${offset}px) scale(1.1)`;
            }
        });

        requestAnimationFrame(updateParallax);
    }

    requestAnimationFrame(updateParallax);
})();

/* ══════════════════════════════
   7. SLIDER DE TESTIMONIOS (Editorial Slider)
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
        stopAuto();
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
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

    if (sliderWrap) {
        sliderWrap.addEventListener('mouseenter', stopAuto);
        sliderWrap.addEventListener('mouseleave', startAuto);
    }

    // Swipe support for touch devices
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
   8. SMOOTH SCROLL PARA ANCLAS (Header offset aware)
   ══════════════════════════════ */
(function initSmoothScroll() {
    const NAV_HEIGHT = 90;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const hrefAttr = anchor.getAttribute('href');
            if (hrefAttr === '#') return;
            
            const target = document.querySelector(hrefAttr);
            if (!target) return;
            
            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

/* ══════════════════════════════
   9. LAZY INIT CARDS (Accesibilidad teclado)
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
   10. CURSOR PERSONALIZADO (Awwwards-style magnetic lerp)
   Un punto sólido instantáneo y un anillo exterior que le sigue con lag suave.
   ══════════════════════════════ */
(function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    
    if (!dot || !ring) return;

    // Solo se activa en pantallas de escritorio
    const mq = window.matchMedia('(min-width: 1025px)');
    if (!mq.matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // El punto sólido sigue la posición del mouse de forma instantánea
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Bucle de animación para lograr la interpolación lineal suave (lerp) del anillo
    function updateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        
        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Contextual Hover States
    const hoverables = document.querySelectorAll('a, button, [tabindex="0"], .service-card, .work-item, .dot, .slider-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovering');
        });
    });

    // Over Portfolio Items behavior
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-on-work');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-on-work');
        });
    });

    // Over CTAs behavior
    const ctas = document.querySelectorAll('.btn, .btn-nav-cta, .nav-link, .mobile-link, .mobile-cta, .cta-social-link, .social-link, .slider-btn, .dot');
    ctas.forEach(cta => {
        cta.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-on-cta');
        });
        cta.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-on-cta');
        });
    });

    // Over Hero Right panel behavior (play indicator)
    const heroRight = document.querySelector('.hero-right');
    if (heroRight) {
        heroRight.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-on-hero-right');
        });
        heroRight.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-on-hero-right');
        });
    }
})();

/* Scroll Indicator Click Scroll */
(function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;

    indicator.addEventListener('click', () => {
        const targetSection = document.getElementById('sobre');
        if (targetSection) {
            const NAV_HEIGHT = 90;
            const top = targetSection.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });

    indicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            indicator.click();
        }
    });
})();

/* ══════════════════════════════
   INIT LOG
   ══════════════════════════════ */
console.log('%c INNOVO STUDIO ', 'background:#72393F;color:#F0E9E3;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');
console.log('%c Creamos. Capturamos. Conectamos. ', 'color:#AD9D8D;font-size:11px;');