// main.js — modal behavior for Redd Bot homepage
document.addEventListener('DOMContentLoaded', function () {
    // Modal controls
    (function () {
        const openBtn = document.getElementById('openMessage');
        const modal = document.getElementById('msgModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const firstFocusableSelector = 'input, textarea, button, [tabindex]:not([tabindex="-1"])';
        let previouslyFocused = null;

        function openModal() {
            previouslyFocused = document.activeElement;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            // focus first input
            const first = modal.querySelector(firstFocusableSelector);
            if (first) first.focus();
            document.addEventListener('keydown', onKeyDown);
        }

        function closeModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            if (previouslyFocused) previouslyFocused.focus();
            document.removeEventListener('keydown', onKeyDown);
        }

        function onKeyDown(e) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'Tab') trapFocus(e);
        }

        function trapFocus(e) {
            const focusable = modal.querySelectorAll(firstFocusableSelector);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        if (openBtn) openBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // close modal when clicking outside the card
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        }

        // basic form handling - replace with real integration as needed
        const form = document.getElementById('msgForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const data = new FormData(form);
                console.log('Message submitted', Object.fromEntries(data.entries()));
                // friendly feedback
                closeModal();
                alert('Message prepared — open Messenger or use the links to send it.');
            });
        }
    })();

    // Entrance animations / micro-interactions
    (function () {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const card = document.querySelector('.profile-card');
        const logo = document.querySelector('.profile-card__img img');
        const meta = document.querySelector('.profile-meta');
        const contacts = document.querySelector('.profile-card-contacts');

        // mark elements for animation
        if (meta) meta.classList.add('animate');
        if (contacts) contacts.classList.add('stagger');
        if (logo) logo.classList.add('logo-pop');

        function reveal() {
            if (!prefersReduced) {
                if (meta) meta.classList.add('visible');
                if (contacts) contacts.classList.add('visible');
                // logo pop slightly after
                if (logo) setTimeout(() => logo.classList.add('pop'), 220);
            } else {
                // if user prefers reduced motion, ensure visible
                if (meta) meta.classList.add('visible');
                if (contacts) contacts.classList.add('visible');
            }
        }

        if ('IntersectionObserver' in window && !prefersReduced) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(en => {
                    if (en.isIntersecting) {
                        reveal();
                        obs.disconnect();
                    }
                });
            }, {threshold: 0.2});
            if (card) io.observe(card);
        } else {
            // fallback: reveal after small delay
            setTimeout(reveal, 120);
        }
    })();
});
