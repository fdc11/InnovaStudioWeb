/* =========================================================
   INNOVO STUDIO — contacto.js
   Vanilla JS + GSAP de Alta Gama — Estilo Awwwards / Editorial Luxe
   ========================================================= */

'use strict';

// Registrar ScrollTrigger si está cargado
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ========== PRELOADER (igual a inicio/servicios) ==========
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
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                    }
                });
            });
        }
    });
})();

// ========== TRANSICIÓN ENTRE PÁGINAS (igual a inicio/servicios) ==========
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

// ========== TEXT SPLIT — GENERALIZED TITLES REVEALS ==========
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

// ========== MENÚ MÓVIL (igual a inicio/servicios) ==========
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

// ========== SCROLL PROGRESS BAR (igual a inicio/servicios) ==========
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
        }
    });
})();

// ========== SCROLL REVEAL ==========
(function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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

// ========== FORM VALIDATION & QUERY PARAMS AUTO-SELECT ==========
(function initContactForm() {
    const selectEl = document.getElementById('service');
    const form = document.getElementById('contactForm');
    const statusBox = document.getElementById('formStatusBox');
    const successBox = document.getElementById('statusSuccess');
    const errorBox = document.getElementById('statusError');

    if (!form) return;

    // Auto-select option from Query Parameters (?service=xxx)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && selectEl) {
        const validOptions = ['produccion', 'web', 'marketing', 'social'];
        if (validOptions.includes(serviceParam)) {
            selectEl.value = serviceParam;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setError(inputEl, hasError) {
        const group = inputEl.closest('.form-group');
        if (!group) return;
        if (hasError) {
            group.classList.add('has-error');
        } else {
            group.classList.remove('has-error');
        }
    }

    function clearStatus() {
        statusBox.classList.remove('active');
        successBox.style.display = 'none';
        errorBox.style.display = 'none';
    }

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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearStatus();

        let isFormValid = true;

        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            setError(nameInput, true);
            isFormValid = false;
        } else {
            setError(nameInput, false);
        }

        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
            setError(emailInput, true);
            isFormValid = false;
        } else {
            setError(emailInput, false);
        }

        if (selectEl && !selectEl.value) {
            setError(selectEl, true);
            isFormValid = false;
        } else if (selectEl) {
            setError(selectEl, false);
        }

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

        const submitBtn = form.querySelector('.btn-submit');
        const submitBtnText = submitBtn.querySelector('span');
        const originalText = submitBtnText.textContent;

        submitBtn.disabled = true;
        submitBtnText.textContent = 'Enviando...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;
            
            statusBox.classList.add('active');
            successBox.style.display = 'flex';
            form.reset();
        }, 1500);
    });
})();

// ========== CURSOR PERSONALIZADO (Awwwards-style lerp) ==========
(function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    
    if (!dot || !ring) return;

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

console.log('%c INNOVO STUDIO — CONTACTO ', 'background:#9A4E28;color:#F5F1EB;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');
