'use strict';

// ================================================================
//  INNOVO STUDIO — Animaciones específicas de INICIO
//  (typewriter, parallax, split titles, servicios cards, etc.)
//  No duplica funcionalidades de global.js (navbar, preloader, menú)
// ================================================================

// Guard por si GSAP no cargó del CDN
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP o ScrollTrigger no están disponibles en inicio.js');
} else {
    gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let preloaderFinished = false;

// ========== SCROLLTRIGGER REFRESH POST-PRELOADER ==========
// El preloader cubre la página mientras se calculan las posiciones de scroll.
// Al terminar el preloader, refrescamos ScrollTrigger para que las animaciones
// recalculen sus triggers correctamente y disparen cuando corresponde.
document.addEventListener('preloaderFinished', () => {
    preloaderFinished = true;
    if (typeof ScrollTrigger !== 'undefined') {
        // Pequeño delay para que el DOM termine de pintar tras el fade del preloader
        setTimeout(() => { ScrollTrigger.refresh(true); }, 100);
    }
    // (sin animación en .adn-image)
});
// Fallback: si el evento preloaderFinished no llega (ej: global.js tardó)
setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(true);
}, 3200);


// ========== HERO TYPEWRITER (restaurado) ==========
(function initHero() {
    if (prefersReducedMotion) {
        document.querySelector('.hero-label') && (document.querySelector('.hero-label').style.opacity = '1');
        const line1 = document.getElementById('heroTwLine1');
        const line2 = document.getElementById('heroTwLine2');
        if (line1) line1.textContent = 'Producción visual';
        if (line2) line2.textContent = '+ desarrollo digital';
        document.querySelector('.hero-marquee-wrapper') && (document.querySelector('.hero-marquee-wrapper').style.opacity = '1');
        document.querySelector('.hero-scroll-indicator') && (document.querySelector('.hero-scroll-indicator').style.opacity = '1');
        return;
    }

    const line1El = document.getElementById('heroTwLine1');
    const line2El = document.getElementById('heroTwLine2');
    const label = document.querySelector('.hero-label');
    const marquee = document.querySelector('.hero-marquee-wrapper');
    const scrollInd = document.querySelector('.hero-scroll-indicator');
    const videoBg = document.querySelector('.hero-bg video, .hero-bg img');

    if (!line1El || !line2El) return;

    const LINE1 = 'Producción visual';
    const LINE2 = '+ desarrollo digital';
    const SPEED_TYPE = 52;
    const SPEED_PAUSE = 300;

    if (videoBg) {
        gsap.to(videoBg, { scale: 1.08, duration: 18, ease: 'none' });
    }

    const tl = gsap.timeline({ delay: 0.3 });

    if (label) {
        tl.from(label, { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' });
    }

    tl.add(() => {
        line1El.classList.add('typing');
        typeText(line1El, LINE1, SPEED_TYPE, () => {
            setTimeout(() => {
                line1El.classList.remove('typing');
                line1El.classList.add('done');
                line2El.classList.add('typing');
                typeText(line2El, LINE2, SPEED_TYPE, () => {
                    setTimeout(() => {
                        line2El.classList.remove('typing');
                        line2El.classList.add('done');
                        const tl2 = gsap.timeline();
                        if (marquee) tl2.to(marquee, { opacity: 1, duration: 0.6 });
                        if (scrollInd) tl2.from(scrollInd, { opacity: 0, duration: 0.8 }, '+=0.3');
                    }, SPEED_PAUSE);
                });
            }, SPEED_PAUSE);
        });
    });

    function typeText(el, text, speed, onDone) {
        let i = 0;
        function step() {
            el.textContent = text.substring(0, i + 1);
            i++;
            if (i < text.length) setTimeout(step, speed);
            else onDone && onDone();
        }
        step();
    }
})();

// ========== HERO VIDEO FADE ==========
(function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;
    const showVideo = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3) showVideo();
    else heroVideo.addEventListener('canplay', showVideo, { once: true });
})();

// ========== PARALLAX HERO ==========
(function initHeroParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    gsap.to(heroBg, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
})();

// ========== SPLIT TEXT EN TÍTULOS (excluyendo hero) ==========
(function initSplitTitles() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.section-title').forEach(title => {
        if (title.closest('.hero')) return;
        const originalHTML = title.innerHTML;
        const parts = originalHTML.split(/(<br\s*\/?>)/i);
        let newHTML = '';
        parts.forEach(part => {
            if (part.match(/<br\s*\/?>/i)) {
                newHTML += part;
            } else {
                part.split(/(\s+)/).forEach(word => {
                    if (!word.trim()) {
                        newHTML += word;
                    } else {
                        newHTML += `<span class="split-word-wrapper" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-word-inner" style="display:inline-block;opacity:0;transform:translateY(28px) rotateX(-18deg);will-change:transform,opacity">${word}</span></span>`;
                    }
                });
            }
        });
        title.innerHTML = newHTML;
        const inners = title.querySelectorAll('.split-word-inner');
        ScrollTrigger.create({
            trigger: title,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                inners.forEach((inner, i) => {
                    setTimeout(() => {
                        inner.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
                        inner.style.opacity = '1';
                        inner.style.transform = 'translateY(0) rotateX(0)';
                    }, i * 38);
                });
            }
        });
    });
})();

// ========== SCRAMBLE TEXT EN LOGO (NAVBAR) ==========
(function initScrambleNavLogo() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;
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

// ========== SERVICIOS CARDS: REVEAL + TILT 3D ==========
(function initServiciosCards() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'none';
    });

    function revealCards() {
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 120);
        });
    }

    let triggered = false;
    ScrollTrigger.create({
        trigger: '.services-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => { if (!triggered) { triggered = true; revealCards(); } }
    });

    setTimeout(() => {
        if (triggered) return;
        const grid = document.querySelector('.services-grid');
        if (grid && grid.getBoundingClientRect().top < window.innerHeight * 1.1) {
            triggered = true;
            revealCards();
        } else {
            const onScroll = () => {
                if (grid && grid.getBoundingClientRect().top < window.innerHeight * 0.9) {
                    triggered = true;
                    revealCards();
                    window.removeEventListener('scroll', onScroll);
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }, 2500);

    if (!prefersReducedMotion && window.innerWidth > 1024) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 8,
                    rotateX: -y * 5,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
            });
        });
    }
})();

// ========== PROYECTOS: OVERLAY Y REVEAL ==========
(function initProyectos() {
    const items = document.querySelectorAll('.proyecto-item');
    if (!items.length) return;

    items.forEach(item => {
        const overlayEls = item.querySelectorAll('.proyecto-cat, .proyecto-overlay h3, .proyecto-overlay p');
        if (overlayEls.length) {
            gsap.set(overlayEls, { y: 20, opacity: 0 });
            item.addEventListener('mouseenter', () => {
                gsap.to(overlayEls, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 });
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(overlayEls, { y: 12, opacity: 0, duration: 0.3, stagger: 0.04 });
            });
        }
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96)';
        item.style.transition = 'none';
    });

    function revealItems() {
        items.forEach((item, i) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, i * 100);
        });
    }

    let triggered = false;
    ScrollTrigger.create({
        trigger: '.proyectos-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => { if (!triggered) { triggered = true; revealItems(); } }
    });

    setTimeout(() => {
        if (triggered) return;
        const grid = document.querySelector('.proyectos-grid');
        if (grid && grid.getBoundingClientRect().top < window.innerHeight * 1.1) {
            triggered = true;
            revealItems();
        } else {
            const onScroll = () => {
                if (grid && grid.getBoundingClientRect().top < window.innerHeight * 0.9) {
                    triggered = true;
                    revealItems();
                    window.removeEventListener('scroll', onScroll);
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }, 2500);
})();

// ========== PROCESO STEPS ==========
(function initProceso() {
    const steps = document.querySelectorAll('.timeline-step');
    if (steps.length) {
        gsap.from(steps, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.15,
            scrollTrigger: { trigger: '.proceso-timeline', start: 'top 80%' }
        });
    }
})();

// ========== POR QUÉ ELEGIRNOS ==========
(function initPorque() {
    const cards = document.querySelectorAll('.porque-card');
    if (!cards.length) return;
    gsap.from(cards, {
        opacity: 0,
        y: 36,
        duration: 0.7,
        stagger: 0.1,
        scrollTrigger: { trigger: '.porque-grid', start: 'top 82%' }
    });
    cards.forEach((card, idx) => {
        let bgNum = card.querySelector('.porque-bg-num');
        if (!bgNum) {
            bgNum = document.createElement('span');
            bgNum.classList.add('porque-bg-num');
            bgNum.textContent = String(idx + 1).padStart(2, '0');
            card.appendChild(bgNum);
        }
        gsap.set(bgNum, { opacity: 0, scale: 0.8 });
        card.addEventListener('mouseenter', () => {
            gsap.to(bgNum, { opacity: 0.15, scale: 1, duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(bgNum, { opacity: 0, scale: 0.8, duration: 0.3 });
        });
    });
})();

// ========== TESTIMONIOS SLIDER ==========
(function initTestimonios() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track || !prevBtn || !nextBtn) return;
    const slides = Array.from(track.children);
    const total = slides.length;
    let current = 0;
    let autoInterval;
    if (dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
    }
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    function goTo(index) {
        if (index === current) return;
        const prev = current;
        current = (index + total) % total;
        gsap.to(slides[prev], { opacity: 0, duration: 0.25 });
        gsap.to(slides[current], { opacity: 1, duration: 0.4, delay: 0.1 });
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    slides.forEach((s, i) => { gsap.set(s, { opacity: i === 0 ? 1 : 0 }); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    function startAuto() { autoInterval = setInterval(() => goTo(current + 1), 5000); }
    function resetAuto() { clearInterval(autoInterval); startAuto(); }
    startAuto();
    const slider = document.querySelector('.testimonios-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoInterval));
    slider.addEventListener('mouseleave', startAuto);
    let touchStartX = 0, isDragging = false;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', (e) => { if (Math.abs(e.touches[0].clientX - touchStartX) > 10) isDragging = true; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? goTo(current + 1) : goTo(current - 1);
            resetAuto();
        }
        isDragging = false;
    });
    gsap.from('.testimonios-slider', { opacity: 0, y: 30, duration: 0.8, scrollTrigger: { trigger: '.testimonios-slider', start: 'top 82%' } });
})();

// ========== CTA FINAL (líneas desde lados) ==========
(function initCTA() {
    const ctaH2 = document.querySelector('.cta-content h2');
    if (!ctaH2 || prefersReducedMotion) return;
    const lines = ctaH2.innerHTML.split(/<br\s*\/?>/i);
    ctaH2.innerHTML = lines.map((line, i) => {
        const dir = i % 2 === 0 ? '-60px' : '60px';
        return `<span class="cta-line" style="display:block;overflow:hidden"><span class="cta-line-inner" style="display:block;opacity:0;transform:translateX(${dir});will-change:transform,opacity">${line}</span></span>`;
    }).join('');
    const inners = ctaH2.querySelectorAll('.cta-line-inner');
    ScrollTrigger.create({
        trigger: ctaH2,
        start: 'top 85%',
        once: true,
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
    gsap.from('.cta-buttons .btn', { opacity: 0, y: 20, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: '.cta-buttons', start: 'top 88%' } });
})();

// ========== MAGNETIC BUTTONS ==========
(function initMagneticButtons() {
    if (prefersReducedMotion || window.innerWidth <= 1024) return;
    document.querySelectorAll('.btn-primary, .btn-small').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
            const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
            gsap.to(btn, { x, y, duration: 0.4 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
        });
    });
})();

// ========== MARQUEE PAUSE ON HOVER ==========
(function initMarqueeSpeed() {
    const track = document.querySelector('.hero-marquee-track');
    if (!track) return;
    const wrapper = track.parentElement;
    wrapper.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    wrapper.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

// ========== SECTION TAGS (entrada izquierda) ==========
(function initSectionTags() {
    document.querySelectorAll('.section-tag').forEach(tag => {
        gsap.from(tag, { opacity: 0, x: -20, duration: 0.6, scrollTrigger: { trigger: tag, start: 'top 90%' } });
    });
})();

// ========== SMOOTH SCROLL ANCLAS (no interfiere con global) ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        const startY = window.scrollY;
        const dist = targetY - startY;
        const dur = 1100;
        let startTime = null;
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / dur, 1);
            window.scrollTo(0, startY + dist * easeOutCubic(progress));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ========== FALLBACK DE SEGURIDAD ==========
// Solo actúa si algún elemento quedó invisible después del tiempo esperado
setTimeout(() => {
    document.querySelectorAll('.porque-card, .timeline-step, .stat-item, .service-card, .proyecto-item, .section-tag, .cta-buttons .btn').forEach(el => {
        if (parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
    document.querySelectorAll('.split-word-inner, .cta-line-inner').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) rotateX(0)';
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}, 5000);


console.log('%c Innovo Studio — Inicio (typewriter restaurado)', 'color: #C8845A; font-size: 14px; font-weight: bold;');