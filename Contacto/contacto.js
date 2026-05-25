/* =========================================================
   INNOVO STUDIO — contacto.js (rediseñado)
   ========================================================= */

'use strict';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ========== VIDEO HERO FADE-IN ==========
(function initContactHeroVideo() {
    const heroVideo = document.querySelector('.contact-hero-video');
    if (!heroVideo) return;
    const showVideo = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3) showVideo();
    else heroVideo.addEventListener('loadeddata', showVideo, { once: true });
})();

// ========== PARALLAX SUTIL PARA VIDEO ==========
(function initContactHeroParallax() {
    const heroBg = document.querySelector('.contact-hero-video');
    if (!heroBg) return;
    gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.contact-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
})();

// ========== TEXT SPLIT ==========
(function initTextSplitting() {
    const titles = document.querySelectorAll('[data-split]');
    titles.forEach(title => {
        const raw = title.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i);
        title.innerHTML = lines.map((line, index) =>
            `<span class="split-line"><span class="split-line-inner" style="transition-delay: ${index * 120}ms">${line.trim()}</span></span>`
        ).join('');
    });
    setTimeout(() => {
        const heroTitleInners = document.querySelectorAll('.contact-hero-title .split-line-inner');
        heroTitleInners.forEach(inner => inner.classList.add('revealed'));
    }, 200);
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

// ========== FORM VALIDATION ==========
(function initContactForm() {
    const selectEl = document.getElementById('service');
    const form = document.getElementById('contactForm');
    const statusBox = document.getElementById('formStatusBox');
    const successBox = document.getElementById('statusSuccess');
    const errorBox = document.getElementById('statusError');

    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && selectEl) {
        const validOptions = ['produccion', 'web', 'marketing', 'social'];
        if (validOptions.includes(serviceParam)) selectEl.value = serviceParam;
    }

    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function setError(inputEl, hasError) {
        const group = inputEl.closest('.form-group');
        if (!group) return;
        if (hasError) group.classList.add('has-error');
        else group.classList.remove('has-error');
    }
    function clearStatus() {
        statusBox.classList.remove('active');
        successBox.style.display = 'none';
        errorBox.style.display = 'none';
    }

    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('input', () => { setError(field, false); clearStatus(); });
        field.addEventListener('change', () => { setError(field, false); clearStatus(); });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearStatus();

        let isFormValid = true;

        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) { setError(nameInput, true); isFormValid = false; }
        else setError(nameInput, false);

        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) { setError(emailInput, true); isFormValid = false; }
        else setError(emailInput, false);

        if (selectEl && !selectEl.value) { setError(selectEl, true); isFormValid = false; }
        else if (selectEl) setError(selectEl, false);

        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) { setError(messageInput, true); isFormValid = false; }
        else setError(messageInput, false);

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

console.log('%c INNOVO STUDIO — CONTACTO (rediseñado)', 'background:#9A4E28;color:#F5F1EB;font-size:14px;padding:6px 12px;font-weight:bold;letter-spacing:2px;');