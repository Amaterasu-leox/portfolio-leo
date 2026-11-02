// Portfolio — Léo Baskarane
// Défilement fluide vers les ancres + apparition en fondu des sections.

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initSmoothScroll(navbar, prefersReducedMotion);
    initFadeIn(prefersReducedMotion);
});

/**
 * Défilement fluide pour tous les liens internes (menu + boutons du hero),
 * en tenant compte de la hauteur de la navbar fixe.
 */
function initSmoothScroll(navbar, reducedMotion) {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const offset = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: reducedMotion ? 'auto' : 'smooth',
            });

            // Met à jour l'URL sans provoquer de saut
            history.pushState(null, '', targetId);
        });
    });
}

/**
 * Fait apparaître les sections en fondu lorsqu'elles entrent dans le viewport.
 * Les classes sont ajoutées par le JS : sans JS, le contenu reste visible.
 */
function initFadeIn(reducedMotion) {
    const sections = document.querySelectorAll('.section');

    if (reducedMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // une seule animation par section
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    sections.forEach((section) => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}
