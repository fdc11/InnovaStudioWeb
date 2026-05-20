/* ═══════════════════════════════════════════════════════════════
   INNOVO STUDIO — contacto.js
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
        const heroTitleInners = document.querySelectorAll('.contact-title .split-line-inner');
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
(function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, [data-split]');
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
   4. FORM VALIDATION & QUERY PARAMS AUTO-SELECT
   ══════════════════════════════ */
(function initContactForm() {
    const selectEl = document.getElementById('service');
    const form = document.getElementById('contactForm');
    const statusBox = document.getElementById('formStatusBox');
    const successBox = document.getElementById('statusSuccess');
    const errorBox = document.getElementById('statusError');

    if (!form) return;

    // 4.1 Auto-select option from Query Parameters (?service=xxx)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && selectEl) {
        // Valid options: 'produccion', 'web', 'marketing', 'social'
        const validOptions = ['produccion', 'web', 'marketing', 'social'];
        if (validOptions.includes(serviceParam)) {
            selectEl.value = serviceParam;
        }
    }

    // Helper: Valid email check
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Helper: Mark field error
    function setError(inputEl, hasError) {
        const group = inputEl.closest('.form-group');
        if (!group) return;
        if (hasError) {
            group.classList.add('has-error');
        } else {
            group.classList.remove('has-error');
        }
    }

    // Clear status boxes
    function clearStatus() {
        statusBox.classList.remove('active');
        successBox.style.display = 'none';
        errorBox.style.display = 'none';
    }

    // Handle Input validation events
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('input', () => {
            setError(field, false);
            clearStatus();
        });
        field.addEventListener('change', () => {
            setError(field, false);
            clearStatus();
        });
    });

    // Form submit listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearStatus();

        let isFormValid = true;

        // Name field validate
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            setError(nameInput, true);
            isFormValid = false;
        } else {
            setError(nameInput, false);
        }

        // Email field validate
        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
            setError(emailInput, true);
            isFormValid = false;
        } else {
            setError(emailInput, false);
        }

        // Service selector validate
        if (selectEl && !selectEl.value) {
            setError(selectEl, true);
            isFormValid = false;
        } else if (selectEl) {
            setError(selectEl, false);
        }

        // Message validate
        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            setError(messageInput, true);
            isFormValid = false;
        } else {
            setError(messageInput, false);
        }

        if (!isFormValid) {
            statusBox.classList.add('active');
            errorBox.style.display = 'flex';
            return;
        }

        // If form is valid - Simulate premium ajax sending
        const submitBtn = form.querySelector('.btn-submit');
        const submitBtnText = submitBtn.querySelector('span');
        const originalText = submitBtnText.textContent;

        submitBtn.disabled = true;
        submitBtnText.textContent = 'Enviando...';

        setTimeout(() => {
            // Send success response
            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;
            
            statusBox.classList.add('active');
            successBox.style.display = 'flex';
            form.reset();
        }, 1500);
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
})();

console.log('%c INNOVO STUDIO — CONTACTO ', 'background:#72393F;color:#F0E9E3;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');
