/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — servicios.js
   Awwwards / Locomotive / Editorial Luxe — Vanilla JS
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   0. UTILIDADES
   ══════════════════════════════════════════════════════════════ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* Añade clase is-visible con un pequeño retraso opcional */
function reveal(el, delay = 0) {
    setTimeout(() => el.classList.add('is-visible'), delay);
}

/* ══════════════════════════════════════════════════════════════
   1. TEXT SPLIT — HERO TITLE & CTA FINAL
   ══════════════════════════════════════════════════════════════ */
(function initTextSplitting() {
    /* [data-split] — split por <br>, anima línea por línea */
    qsa('[data-split]').forEach(title => {
        const raw   = title.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i);

        title.innerHTML = lines.map((line, i) =>
            `<span class="split-line">
               <span class="split-line-inner" style="transition-delay:${i * 120}ms">
                 ${line.trim()}
               </span>
             </span>`
        ).join('');

        /* Auto-reveal inmediato si está en el hero */
        if (title.closest('#hero')) {
            setTimeout(() => {
                qsa('.split-line-inner', title).forEach(inner =>
                    inner.classList.add('revealed')
                );
            }, 300);
        }
    });

    /* [data-split-simple] — mismo efecto para CTA final y paquetes */
    qsa('[data-split-simple]').forEach(title => {
        const raw   = title.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i);

        title.innerHTML = lines.map((line, i) =>
            `<span class="split-line">
               <span class="split-line-inner" style="transition-delay:${i * 100}ms">
                 ${line.trim()}
               </span>
             </span>`
        ).join('');
    });
})();

/* ══════════════════════════════════════════════════════════════
   2. NAVBAR SCROLL
   ══════════════════════════════════════════════════════════════ */
(function initNavbar() {
    const navbar = qs('#navbar');
    if (!navbar) return;

    const THRESHOLD = 60;

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ══════════════════════════════════════════════════════════════
   3. HAMBURGER & MOBILE MENU
   ══════════════════════════════════════════════════════════════ */
(function initMobileMenu() {
    const hamburger  = qs('#hamburger');
    const mobileMenu = qs('#mobileMenu');
    if (!hamburger || !mobileMenu) return;

    let isOpen = false;

    const open = () => {
        isOpen = true;
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
        isOpen = false;
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', e => {
        e.stopPropagation();
        isOpen ? close() : open();
    });

    qsa('.mobile-link', mobileMenu).forEach(link =>
        link.addEventListener('click', close)
    );

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) close();
    });
})();

/* ══════════════════════════════════════════════════════════════
   4. INTERSECTION OBSERVER — SCROLL REVEAL UNIFICADO
   ══════════════════════════════════════════════════════════════ */
(function initScrollReveal() {
    /* Elementos de reveal genérico */
    const revealEls = qsa('.reveal, .reveal-up');

    /* Imágenes de panel — clip-path reveal */
    const panelImgs = qsa('.panel-image');

    /* Split-simple titles (paquetes, CTA) */
    const splitSimple = qsa('[data-split-simple]');

    if (!revealEls.length && !panelImgs.length) return;

    /* ── Observer para reveals genéricos ── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Observer para imágenes (clip-path) ── */
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            /* Pequeño delay para que coincida con el reveal del texto */
            setTimeout(() => entry.target.classList.add('revealed'), 150);
            imgObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    panelImgs.forEach(img => imgObserver.observe(img));

    /* ── Observer para split-simple titles ── */
    const splitObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            qsa('.split-line-inner', entry.target).forEach(inner =>
                inner.classList.add('revealed')
            );
            splitObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    splitSimple.forEach(el => splitObserver.observe(el));
})();

/* ══════════════════════════════════════════════════════════════
   5. SIDE NAV — ACTIVE STATE POR SCROLL
   ══════════════════════════════════════════════════════════════ */
(function initSideNav() {
    const sideNav     = qs('#sideNav');
    const sideItems   = qsa('.side-nav-item', sideNav || document);
    const panels      = qsa('.service-panel');

    if (!sideNav || !panels.length) return;

    let currentActive = null;

    const panelObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id     = entry.target.dataset.service;
            const target = qs(`[data-target="${id}"]`, sideNav);

            if (!target || target === currentActive) return;

            /* Desactivar todos */
            sideItems.forEach(item => item.classList.remove('active'));

            /* Activar el correspondiente */
            target.classList.add('active');
            currentActive = target;
        });
    }, {
        threshold: 0,
        rootMargin: '-35% 0px -55% 0px'
    });

    panels.forEach(panel => panelObserver.observe(panel));

    /* Click suave en side nav */
    sideItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const targetId = item.dataset.target;
            const panel    = qs(`#${targetId}`);
            if (!panel) return;
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

/* ══════════════════════════════════════════════════════════════
   6. CURSOR PERSONALIZADO — LERP AWWWARDS-STYLE
   ══════════════════════════════════════════════════════════════ */
(function initCustomCursor() {
    const dot  = qs('#cursorDot');
    const ring = qs('#cursorRing');
    if (!dot || !ring) return;

    /* Solo desktop */
    if (!window.matchMedia('(min-width: 1025px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top  = `${mouseY}px`;
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = `${ringX}px`;
        ring.style.top  = `${ringY}px`;
        requestAnimationFrame(animateRing);
    })();

    /* Hover sobre links, botones y service items */
    const hoverTargets = qsa('a, button, [tabindex="0"], .paquete-card, .proceso-step');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
    });

    /* Hover sobre imágenes */
    const imgTargets = qsa('.panel-image-wrap');
    imgTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-img'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-img'));
    });
})();

/* ══════════════════════════════════════════════════════════════
   7. HERO SCROLL — PARALLAX SUAVE EN LA IMAGEN
   ══════════════════════════════════════════════════════════════ */
(function initHeroParallax() {
    const heroBg = qs('.hero-bg-img');
    if (!heroBg) return;

    /* Solo si no es dispositivo táctil */
    if (window.matchMedia('(hover: none)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scrollY  = window.scrollY;
            const heroH    = qs('#hero').offsetHeight;
            if (scrollY < heroH) {
                const offset = scrollY * 0.3;
                heroBg.style.transform = `scale(1.0) translateY(${offset}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════════
   8. TICKER — PAUSA AL HOVER (ya está en CSS, refuerzo en JS)
   ══════════════════════════════════════════════════════════════ */
(function initTicker() {
    const track = qs('.ticker-track');
    if (!track) return;

    track.addEventListener('mouseenter', () =>
        track.style.animationPlayState = 'paused'
    );
    track.addEventListener('mouseleave', () =>
        track.style.animationPlayState = 'running'
    );
})();

/* ══════════════════════════════════════════════════════════════
   9. SMOOTH SCROLL — ANCHOR LINKS INTERNOS
   ══════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
    document.addEventListener('click', e => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href').slice(1);
        const target   = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
})();

/* ══════════════════════════════════════════════════════════════
   10. PANEL FEATURES — STAGGER ANIMATION AL ENTRAR
   ══════════════════════════════════════════════════════════════ */
(function initFeatureStagger() {
    const featureLists = qsa('.panel-features');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const items = qsa('.panel-feature', entry.target);
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.style.opacity   = '1';
                    item.style.transform = 'translateY(0)';
                }, i * 90);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    featureLists.forEach(list => {
        /* Set initial state inline para mayor especificidad */
        qsa('.panel-feature', list).forEach(item => {
            item.style.opacity   = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s cubic-bezier(0.65,0,0.35,1), transform 0.6s cubic-bezier(0.65,0,0.35,1)';
        });
        observer.observe(list);
    });
})();

/* ══════════════════════════════════════════════════════════════
   11. PAQUETE CARDS — EFECTO DE ENTRADA ESCALONADA
   ══════════════════════════════════════════════════════════════ */
(function initPaqueteCards() {
    const grid = qs('.paquetes-grid');
    if (!grid) return;

    const cards = qsa('.paquete-card', grid);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('is-visible'), i * 100);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    /* Initial state */
    cards.forEach(card => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.7s cubic-bezier(0.65,0,0.35,1), transform 0.7s cubic-bezier(0.65,0,0.35,1), background-color 0.4s ease, border-color 0.4s ease';
    });

    /* Override is-visible para este componente */
    const style = document.createElement('style');
    style.textContent = `.paquete-card.is-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    observer.observe(grid);
})();

/* ══════════════════════════════════════════════════════════════
   12. PROCESO STEPS — LÍNEA CONECTORA ANIMADA
   ══════════════════════════════════════════════════════════════ */
(function initProcesoSteps() {
    const steps = qsa('.proceso-step');
    if (!steps.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            steps.forEach((step, i) => {
                setTimeout(() => step.classList.add('is-visible'), i * 120);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    if (steps[0]) observer.observe(steps[0].closest('.proceso-steps') || steps[0]);
})();

/* ══════════════════════════════════════════════════════════════
   CONSOLE SIGNATURE
   ══════════════════════════════════════════════════════════════ */
console.log(
    '%c INNOVO STUDIO — SERVICIOS ',
    'background:#72393F;color:#F0E9E3;font-size:13px;padding:6px 14px;font-weight:700;letter-spacing:3px;'
);