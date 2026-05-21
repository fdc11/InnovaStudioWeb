"use strict";

// Split text hero
(function initSplit() {
    const splitElements = document.querySelectorAll('[data-split]');
    splitElements.forEach(el => {
        const lines = el.innerHTML.split(/<br\s*\/?>/i);
        el.innerHTML = lines.map(line => `<span class="split-line"><span class="split-line-inner">${line.trim()}</span></span>`).join('');
    });
    setTimeout(() => {
        document.querySelectorAll('.hero-title .split-line-inner').forEach(inner => inner.classList.add('revealed'));
    }, 200);
})();

// Scroll reveal (Intersection Observer)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll('.reveal, .service-card, .proceso-step, .diferencial-item').forEach(el => revealObserver.observe(el));

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Menú hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Cursor personalizado (solo escritorio)
if (window.innerWidth > 1024) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();
    const hoverables = document.querySelectorAll('a, button, .service-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
    });
}

// Contadores animados
const counters = document.querySelectorAll('.diferencial-number');
const startCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            const update = () => {
                current += increment;
                if (current < target) {
                    el.innerText = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    el.innerText = target;
                }
            };
            update();
            observer.unobserve(el);
        }
    });
};
const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Modales
const modals = {
    visual: document.getElementById('modal-visual'),
    tech: document.getElementById('modal-tech'),
    packs: document.getElementById('modal-packs')
};
document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        if (modals[modalId]) modals[modalId].classList.add('active');
    });
});
document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        }
    });
});

// Smooth scroll a servicios
document.querySelector('.hero-cta .btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#servicios').scrollIntoView({ behavior: 'smooth' });
});

// Pequeño efecto parallax en hero-bg
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const scrollY = window.scrollY;
        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.05}px)`;
    }
});