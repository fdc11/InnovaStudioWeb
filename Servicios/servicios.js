'use strict';

// ================================================================
//  INNOVO STUDIO — SERVICIOS (coherente con inicio.js)
//  GSAP + ScrollTrigger
// ================================================================

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ================================================================
//  1. PRELOADER (idéntico al de inicio)
// ================================================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const tl = gsap.timeline({
        onComplete: () => {
            preloader.style.pointerEvents = 'none';
            document.body.style.overflow = '';
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }
    });

    document.body.style.overflow = 'hidden';

    const counter = preloader.querySelector('.preloader-counter');
    const barFill = document.getElementById('preloaderBarFill');
    const veil = preloader.querySelector('.preloader-veil');

    // Animación del contador y barra
    if (counter) {
        let obj = { val: 0 };
        tl.to(obj, {
            val: 100,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: () => {
                counter.textContent = Math.round(obj.val) + '%';
                if (barFill) barFill.style.width = obj.val + '%';
            }
        });
    }

    // Velo que sube
    if (veil) {
        tl.to(veil, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '+=0.2');
    } else {
        tl.to(preloader, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '+=0.2');
    }

    tl.set(preloader, { display: 'none' });
})();

// ================================================================
//  2. TRANSICIÓN ENTRE PÁGINAS — Cortina
// ================================================================
(function initPageTransitions() {
    const curtain = document.getElementById('pageCurtain');
    if (!curtain) return;

    gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.1 });

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') ||
            href.startsWith('mailto') || href.startsWith('tel')) return;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            gsap.to(curtain, {
                yPercent: 0,
                duration: 0.7,
                ease: 'power3.inOut',
                onComplete: () => { window.location.href = target; }
            });
        });
    });
})();

// ================================================================
//  3. BARRA DE PROGRESO DE SCROLL (GSAP)
// ================================================================
(function initProgressBar() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    gsap.to(bar, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
})();

// ================================================================
//  4. NAVBAR — scroll effect
// ================================================================
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    ScrollTrigger.create({
        start: 'top -60',
        onEnter:     () => navbar.classList.add('scrolled'),
        onLeaveBack: () => navbar.classList.remove('scrolled')
    });
})();

// ================================================================
//  5. MENÚ MÓVIL
// ================================================================
(function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('.mobile-link');
    const info  = mobileMenu.querySelectorAll('.mobile-info a, .mobile-socials a');

    gsap.set(links, { opacity: 0, y: 40 });
    gsap.set(info,  { opacity: 0 });

    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        if (isOpen) {
            gsap.to(links, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.3 });
            gsap.to(info,  { opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.6 });
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

// ================================================================
//  6. HERO — entrada orquestada con split de palabras
// ================================================================
(function initHero() {
    if (prefersReducedMotion) {
        // Forzar visibilidad sin animación
        document.querySelector('.svc-hero-label') && (document.querySelector('.svc-hero-label').style.opacity = 1);
        document.querySelector('.svc-hero-subtitle') && (document.querySelector('.svc-hero-subtitle').style.opacity = 1);
        document.querySelector('.svc-hero-cta') && (document.querySelector('.svc-hero-cta').style.opacity = 1);
        document.querySelector('.svc-scroll-ind') && (document.querySelector('.svc-scroll-ind').style.opacity = 1);
        return;
    }

    const label     = document.querySelector('.svc-hero-label');
    const title     = document.getElementById('svcHeroTitle');
    const subtitle  = document.querySelector('.svc-hero-subtitle');
    const cta       = document.querySelector('.svc-hero-cta');
    const scrollInd = document.querySelector('.svc-scroll-ind');

    const tl = gsap.timeline({ delay: 0.25 });

    if (label) {
        tl.fromTo(label,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
    }

    // Split del título
    if (title) {
        const wrapWords = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                const frag  = document.createDocumentFragment();
                words.forEach(w => {
                    if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
                    const outer = document.createElement('span');
                    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
                    const inner = document.createElement('span');
                    inner.className = 'hero-split-word';
                    inner.style.cssText = 'display:inline-block;opacity:0;transform:translateY(32px);will-change:transform,opacity';
                    inner.textContent = w;
                    outer.appendChild(inner);
                    frag.appendChild(outer);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
                Array.from(node.childNodes).forEach(wrapWords);
            }
        };
        wrapWords(title);

        const words = title.querySelectorAll('.hero-split-word');
        tl.add(() => {
            words.forEach((w, i) => {
                setTimeout(() => {
                    w.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
                    w.style.opacity    = '1';
                    w.style.transform  = 'translateY(0)';
                }, i * 38);
            });
        }, 0.1);
        tl.add(() => {}, `+=${words.length * 0.038 + 0.2}`);
    }

    if (subtitle) {
        tl.fromTo(subtitle,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            '-=0.3'
        );
    }
    if (cta) {
        tl.fromTo(cta,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
        );
    }
    if (scrollInd) {
        tl.to(scrollInd, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '+=0.3');
    }

    // Parallax del video
    const videoBg = document.querySelector('.svc-hero-bg video, .svc-hero-bg img');
    if (videoBg) {
        gsap.to(videoBg, {
            scale: 1.08,
            duration: 18,
            ease: 'none',
            scrollTrigger: {
                trigger: '.svc-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
})();

// ================================================================
//  7. SCRAMBLE en el logo al hover (igual que inicio)
// ================================================================
(function initScrambleLogo() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;
    const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const original = 'INNOVOSTUDIO';
    let interval   = null;
    let isAnimating = false;
    const textNode  = logo.childNodes[0];
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    logo.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;
        let iteration = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            textNode.textContent = original.split('').map((letter, i) => {
                if (i < iteration) return letter;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            if (iteration >= original.length) {
                textNode.textContent = original;
                clearInterval(interval);
                isAnimating = false;
            }
            iteration += 0.5;
        }, 40);
    });
})();

// ================================================================
//  8. SECTION TAGS — entran con la línea que crece
// ================================================================
(function initSectionTags() {
    document.querySelectorAll('.section-tag').forEach(tag => {
        gsap.from(tag, {
            opacity: 0, x: -20, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: tag, start: 'top 90%' }
        });
    });
})();

// ================================================================
//  9. SECTION TITLES — split por líneas (coherente con inicio)
// ================================================================
(function initSectionTitles() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.section-title').forEach(title => {
        // Preservar <br> y dividir en líneas
        const lines = title.innerHTML.split(/<br\s*\/?>/i);
        title.innerHTML = lines.map(line =>
            `<span class="split-line"><span class="split-line-inner" style="display:block;opacity:0;transform:translateY(28px);will-change:transform,opacity">${line}</span></span>`
        ).join('');

        const inners = title.querySelectorAll('.split-line-inner');
        ScrollTrigger.create({
            trigger: title,
            start: 'top 88%',
            onEnter: () => {
                inners.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)`;
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            }
        });
    });
})();

// ================================================================
//  10. CARDS DE SERVICIOS — reveal + tilt 3D
// ================================================================
(function initServiceCards() {
    const cards = document.querySelectorAll('.svc-card');

    cards.forEach((card, i) => {
        // Reveal al hacer scroll
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: i * 0.1
        });

        // Tilt 3D en hover (solo escritorio)
        if (window.innerWidth > 1024 && !prefersReducedMotion) {
            card.addEventListener('mousemove', e => {
                const rect   = card.getBoundingClientRect();
                const x      = (e.clientX - rect.left) / rect.width  - 0.5;
                const y      = (e.clientY - rect.top)  / rect.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 6,
                    rotateX: -y * 4,
                    transformPerspective: 900,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0, rotateX: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }
    });
})();

// ================================================================
//  11. STATS — contador animado (igual que inicio)
// ================================================================
(function initStats() {
    const items = document.querySelectorAll('.svc-stat-item');
    if (!items.length) return;

    items.forEach(item => {
        const numEl  = item.querySelector('.svc-stat-number');
        const target = parseInt(numEl?.getAttribute('data-count') || '0', 10);
        let triggered = false;

        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                if (triggered) return;
                triggered = true;
                item.classList.add('counted');
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function() {
                        numEl.textContent = Math.round(obj.val);
                    }
                });
            }
        });
    });
})();

// ================================================================
//  12. PROCESO — timeline steps con stagger
// ================================================================
(function initProceso() {
    const steps = document.querySelectorAll('.timeline-step');
    gsap.from(steps, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.proceso-timeline', start: 'top 85%' }
    });
})();

// ================================================================
//  13. POR QUÉ ELEGIRNOS — cards con stagger + número de fondo
// ================================================================
(function initPorque() {
    const cards = document.querySelectorAll('.porque-card');
    gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.porque-grid', start: 'top 85%' }
    });

    // Número grande de fondo al hover (ya está en CSS, solo aseguramos que exista)
    cards.forEach((card, i) => {
        let bgNum = card.querySelector('.porque-bg-num');
        if (!bgNum) {
            bgNum = document.createElement('div');
            bgNum.classList.add('porque-bg-num');
            bgNum.textContent = String(i + 1).padStart(2, '0');
            card.appendChild(bgNum);
        }
    });
})();

// ================================================================
//  14. CTA FINAL — líneas alternando izquierda/derecha
// ================================================================
(function initCta() {
    const cta = document.querySelector('.cta-content h2');
    if (!cta || prefersReducedMotion) return;

    const lines = cta.innerHTML.split(/<br\s*\/?>/i);
    cta.innerHTML = lines.map((line, i) => {
        const dir = i % 2 === 0 ? '-40px' : '40px';
        return `<span class="cta-line" style="display:block;overflow:hidden"><span class="cta-line-inner" style="display:block;opacity:0;transform:translateX(${dir});will-change:transform,opacity">${line}</span></span>`;
    }).join('');

    const inners = cta.querySelectorAll('.cta-line-inner');
    ScrollTrigger.create({
        trigger: cta,
        start: 'top 85%',
        onEnter: () => {
            inners.forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = `opacity 1s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 1s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1)`;
                    el.style.opacity = '1';
                    el.style.transform = 'translateX(0)';
                }, i * 50);
            });
        }
    });

    gsap.from('.cta-content p, .cta-buttons', {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-content', start: 'top 82%' }
    });
})();

// ================================================================
//  15. FOOTER — fade-in por columnas
// ================================================================
(function initFooter() {
    gsap.from('.footer-brand, .footer-links, .footer-contact', {
        opacity: 0, y: 28, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer', start: 'top 88%' }
    });
})();

// ================================================================
//  16. MAGNETIC BUTTONS
// ================================================================
(function initMagneticButtons() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.btn-primary, .btn-small, .btn-outline').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect    = btn.getBoundingClientRect();
            const distX   = (e.clientX - (rect.left + rect.width  / 2)) * 0.3;
            const distY   = (e.clientY - (rect.top  + rect.height / 2)) * 0.3;
            gsap.to(btn, { x: distX, y: distY, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
        });
    });
})();

// ================================================================
//  17. MODALES
// ================================================================
(function initModales() {
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.getElementById(btn.getAttribute('data-modal'));
            if (!modal) return;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            gsap.fromTo(
                modal.querySelector('.svc-modal-content'),
                { opacity: 0, scale: 0.92, y: 24 },
                { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
        });
    });

    const closeModal = () => {
        document.querySelectorAll('.svc-modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.svc-modal-close').forEach(btn => btn.addEventListener('click', closeModal));
    document.querySelectorAll('.svc-modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// ================================================================
//  18. SMOOTH SCROLL para anclas (igual que inicio)
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset  = 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        const startY  = window.scrollY;
        const dist    = targetY - startY;
        const dur     = 1100;
        let t0 = null;
        function ease(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
        function step(ts) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            window.scrollTo(0, startY + dist * ease(p));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
});

// ================================================================
//  19. FALLBACK DE SEGURIDAD — nada queda invisible
// ================================================================
(function safetyReveal() {
    setTimeout(() => {
        document.querySelectorAll(
            '.svc-card, .svc-stat-item, .timeline-step, .porque-card, ' +
            '.footer-brand, .footer-links, .footer-contact, .section-tag, ' +
            '.section-title, .svc-hero-subtitle, .svc-hero-cta, .svc-hero-label'
        ).forEach(el => {
            if (parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity    = '1';
                el.style.transform  = 'none';
            }
        });
        // Forzar visibilidad de cualquier split atascado
        document.querySelectorAll('.hero-split-word, .split-line-inner, .cta-line-inner').forEach(w => {
            w.style.opacity   = '1';
            w.style.transform = 'translateY(0)';
        });
        ScrollTrigger.refresh();
    }, 4000);
})();

console.log('%c Innovo Studio — Servicios (coherente con inicio)', 'color: #C47A4E; font-size: 14px; font-weight: bold;');