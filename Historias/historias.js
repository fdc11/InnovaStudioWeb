/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — historias.js
   Vanilla JS de Alta Gama — Estilo Awwwards / Editorial Luxe
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   0. TEXT SPLIT — GENERALIZED TITLES REVEALS
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
        const heroTitleInners = document.querySelectorAll('.stories-title .split-line-inner');
        heroTitleInners.forEach(inner => inner.classList.add('revealed'));
    }, 200);
})();

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
    onScroll();
})();

/* ══════════════════════════════
   2. MENÚ HAMBURGER (MOBILE)
   ══════════════════════════════ */
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

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
   3. SCROLL REVEAL
   ══════════════════════════════ */
function runScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .work-item, [data-split]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
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

    elements.forEach(el => {
        if (!el.classList.contains('revealed')) {
            observer.observe(el);
        }
    });
}

(function initScrollReveal() {
    runScrollReveal();
})();

/* ══════════════════════════════
   4. PORTFOLIO FILTER LOGIC (WITH TRANSITIONS)
   ══════════════════════════════ */
(function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (!filterButtons.length || !workItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Toggle active class on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items with animate out/in
            workItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                // Fade out first
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        
                        // Fade in matching items
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            item.classList.add('revealed', 'is-visible');
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 400); // match transition speed
            });

            // Re-trigger reveal on visible items
            setTimeout(() => {
                runScrollReveal();
            }, 450);
        });
    });
})();

/* ══════════════════════════════
   5. CURSOR PERSONALIZADO (Awwwards-style lerp)
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
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function updateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        
        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Contextual Hover States
    const hoverables = document.querySelectorAll('a, button, [tabindex="0"]');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovering');
        });
    });

    // Special hover over projects
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-on-work');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-on-work');
        });
    });
})();

console.log('%c INNOVO STUDIO — HISTORIAS ', 'background:#72393F;color:#F0E9E3;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');
