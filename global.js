/* =========================================================
   INNOVO STUDIO — GLOBAL JS
   Funcionalidad compartida para todas las páginas
   ========================================================= */

// ── MEJORA 1: Listener pageshow para bfcache (botón Atrás del navegador) ──
// Si la página se restaura desde el bfcache, el preloader se omite inmediatamente.
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // La página viene del bfcache: forzar finalización del preloader
        const preloader = document.getElementById('preloader');
        const pageCurtain = document.getElementById('pageCurtain');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            preloader.style.display = 'none';
        }
        if (pageCurtain) pageCurtain.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER UNIFICADO (sin conflictos)
    const preloader = document.getElementById('preloader');
    const pageCurtain = document.getElementById('pageCurtain');
    const progressBar = document.querySelector('.preloader-bar-fill');

    let preloaderFinishedFlag = false;

    function finishPreload() {
        if (preloaderFinishedFlag) return;
        preloaderFinishedFlag = true;
        if (!preloader) return;
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        // ── MEJORA 4: display:none inmediato (sin delay residual) ──
        setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
            if (pageCurtain) pageCurtain.style.display = 'none';
            document.dispatchEvent(new Event('preloaderFinished'));
        }, 500);
    }

    // ── MEJORA 4: pageCurtain se oculta siempre que no exista ──
    if (pageCurtain) pageCurtain.style.display = 'none';

    if (preloader && progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;
            const counter = document.querySelector('.preloader-counter');
            if (counter) counter.textContent = Math.floor(progress) + '%';

            if (progress === 100) {
                clearInterval(interval);
                finishPreload();
            }
        }, 150);

        // Fallback máximo 3 segundos (ya no hay otro setTimeout externo)
        setTimeout(() => {
            clearInterval(interval);
            finishPreload();
        }, 3000);
    }

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }, { passive: true });
    }

    // 3. MOBILE MENU TOGGLE (unificado)
    // ── MEJORA 4: verificar existencia de hamburger y mobileMenu antes de usarlos ──
    const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Cerrar menú al hacer clic en un link del mobile menu
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. FOOTER ACCORDION (Mobile)
    const footerHeadings = document.querySelectorAll('.footer-col h4');
    footerHeadings.forEach(heading => {
        heading.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                const target = heading.nextElementSibling;
                const isActive = heading.classList.contains('active');
                footerHeadings.forEach(h => {
                    h.classList.remove('active');
                    if (h.nextElementSibling) h.nextElementSibling.style.display = 'none';
                });
                if (!isActive && target) {
                    heading.classList.add('active');
                    target.style.display = 'block';
                }
            }
        });
    });

    // 5. SCROLL REVEAL VIA INTERSECTION OBSERVER
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. CONTADORES GLOBALES
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let obj = { val: 0 };
                    if (typeof gsap !== 'undefined') {
                        gsap.to(obj, {
                            val: target,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: () => { counter.textContent = Math.floor(obj.val) + suffix; }
                        });
                    } else {
                        counter.textContent = target + suffix;
                    }
                    observerInstance.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));
    }
});