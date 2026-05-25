/* =========================================================
   INNOVO STUDIO — GLOBAL JS
   Funcionalidad compartida para todas las páginas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. TAREA 7: PRELOADER FALLBACK & LOGIC
    const preloader = document.getElementById('preloader');
    const pageCurtain = document.getElementById('pageCurtain');
    const progressBar = document.querySelector('.preloader-bar-fill');
    
    if (preloader) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                finishPreload();
            }
        }, 150);

        // Fallback robusto (máximo 3 segundos de bloqueo)
        setTimeout(() => {
            clearInterval(interval);
            finishPreload();
        }, 3000);
    }

    function finishPreload() {
        if (!preloader) return;
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        
        setTimeout(() => {
            preloader.remove();
            if (pageCurtain) {
                pageCurtain.style.opacity = '0';
                pageCurtain.style.pointerEvents = 'none';
            }
            // Trigger a custom event to let page-specific JS know it can start hero animations
            document.dispatchEvent(new Event('preloaderFinished'));
        }, 500);
    }

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 3. MOBILE MENU TOGGLE
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 4. FOOTER ACCORDION (Mobile)
    const footerHeadings = document.querySelectorAll('.footer-col h4');
    footerHeadings.forEach(heading => {
        heading.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                const target = heading.nextElementSibling;
                const isActive = heading.classList.contains('active');
                
                // Close all
                footerHeadings.forEach(h => {
                    h.classList.remove('active');
                    if (h.nextElementSibling) h.nextElementSibling.style.display = 'none';
                });

                // Open clicked if it wasn't active
                if (!isActive && target) {
                    heading.classList.add('active');
                    target.style.display = 'block';
                }
            }
        });
    });

    // 5. TAREA 7: SCROLL REVEAL VIA INTERSECTION OBSERVER
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
