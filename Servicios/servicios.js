/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — servicios.js
   Awwwards / Locomotive / Editorial Luxe — Vanilla JS
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — servicios.js
   Navbar + Menú + Transiciones: idénticos a inicio.js (GSAP)
   Contenido de página: Vanilla JS original
   ═══════════════════════════════════════════════════════════════ */

'use strict';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════════
   1. TRANSICIÓN ENTRE PÁGINAS (cortina — igual que inicio)
   ══════════════════════════════════════════════════════════════ */
(function initPageTransitions() {
    const curtain = document.getElementById('pageCurtain');
    if (!curtain) return;

    gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.1 });

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') ||
            href.startsWith('mailto') || href.startsWith('tel')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = href;

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
                onComplete: () => { window.location.href = target; }
            });
        });
    });
})();

/* ══════════════════════════════════════════════════════════════
   2. NAVBAR SCROLL (igual que inicio)
   ══════════════════════════════════════════════════════════════ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => navbar.classList.add('scrolled'),
        onLeaveBack: () => navbar.classList.remove('scrolled')
    });
})();

/* ══════════════════════════════════════════════════════════════
   3. MENÚ MÓVIL (igual que inicio, con GSAP)
   ══════════════════════════════════════════════════════════════ */
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

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();

/* ══════════════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR (inicio)
   ══════════════════════════════════════════════════════════════ */
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        bar.style.transform = `scaleX(${pct})`;
    }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════════
   5. TEXT SPLIT — HERO TITLE & CTA FINAL
   ══════════════════════════════════════════════════════════════ */
(function initTextSplitting() {

    /* [data-split] — split por <br>, anima línea por línea */
    qsa('[data-split]').forEach(title => {
        const raw = title.innerHTML;
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
        const raw = title.innerHTML;
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
   5. TEXT SPLIT — HERO TITLE & CTA FINAL
   ══════════════════════════════════════════════════════════════ */
(function initTextSplitting() {
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
        const sideNav = qs('#sideNav');
        const sideItems = qsa('.side-nav-item', sideNav || document);
        const panels = qsa('.service-panel');

        if (!sideNav || !panels.length) return;

        let currentActive = null;

        const panelObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = entry.target.dataset.service;
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
                const panel = qs(`#${targetId}`);
                if (!panel) return;
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
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
                const scrollY = window.scrollY;
                const heroH = qs('#hero').offsetHeight;
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
            const target = document.getElementById(targetId);
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
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 90);
                });

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        featureLists.forEach(list => {
            /* Set initial state inline para mayor especificidad */
            qsa('.panel-feature', list).forEach(item => {
                item.style.opacity = '0';
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
            card.style.opacity = '0';
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