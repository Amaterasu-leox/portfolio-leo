// Portfolio — Léo Baskarane
// Défilement fluide, Scroll Reveal, effet machine à écrire, modale de détail des projets,
// bascule thème sombre / clair, mini-terminal, inclinaison 3D et formulaire de contact.

/**
 * Détails affichés dans la modale, indexés par l'attribut data-project des cartes.
 */
const PROJECTS = {
    'guru-todo': {
        title: 'Guru To-Do App',
        subtitle: 'Application Full-Stack de gestion de tâches',
        description:
            "Application complète permettant de créer, consulter, modifier et supprimer des tâches. " +
            "Le backend Python FastAPI expose une API REST connectée à une base MySQL, consommée par " +
            "une interface frontend interactive en HTML/CSS/JavaScript.",
        features: [
            'Endpoints REST CRUD complets (création, lecture, mise à jour, suppression)',
            'Persistance des données dans une base MySQL relationnelle',
            'Interface web dynamique communiquant avec l’API via fetch',
            'Versionnement et revue de code via Pull Requests Bitbucket',
        ],
        architecture: [
            { layer: 'Frontend', detail: 'HTML / CSS / JavaScript — interface et appels fetch vers l’API' },
            { layer: 'Backend', detail: 'Python FastAPI — endpoints REST CRUD' },
            { layer: 'Base de données', detail: 'MySQL — stockage relationnel des tâches' },
        ],
        stack: ['Python', 'FastAPI', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Git', 'Bitbucket'],
    },
    portfolio: {
        title: 'Portfolio Web Personnel',
        subtitle: 'Site vitrine développé sur-mesure',
        description:
            "Le site que vous êtes en train de visiter : un portfolio conçu de A à Z en HTML, CSS et " +
            "JavaScript natif, sans framework ni bibliothèque, avec une attention particulière portée " +
            "à l'interactivité, à l'accessibilité et au responsive design.",
        features: [
            'Timeline interactive du parcours avec apparition au défilement',
            'Mini-terminal où le visiteur tape des commandes (help, skills, projects…)',
            'Thème sombre / clair mémorisé, effet machine à écrire et cartes inclinables en 3D',
            'Formulaire de contact prêt pour Formspree et fenêtres de détail des projets',
        ],
        architecture: [
            { layer: 'Structure', detail: 'HTML5 sémantique — sections, <dialog> natif, formulaires accessibles' },
            { layer: 'Style', detail: 'CSS3 — variables de thème, Grid / Flexbox, animations' },
            { layer: 'Interactions', detail: 'JavaScript natif — un module init par fonctionnalité' },
        ],
        stack: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
    },
    finops: {
        title: 'FinOps Cloud Analytics',
        subtitle: 'Tableau de bord de suivi des coûts multi-cloud',
        description:
            "Tableau de bord interactif pour suivre et optimiser les coûts d'infrastructure répartis " +
            "sur AWS, GCP et Azure, avec des graphiques en temps réel et un simulateur d'économies.",
        features: [
            'Vue consolidée des dépenses AWS, GCP et Azure',
            'Graphiques interactifs mis à jour en temps réel avec Chart.js',
            "Simulateur d'économies pour évaluer les pistes d'optimisation",
            'Interface responsive en JavaScript natif, sans framework',
        ],
        architecture: [
            { layer: 'Interface', detail: 'HTML5 / CSS3 — tableau de bord responsive' },
            { layer: 'Logique', detail: 'JavaScript — agrégation des coûts par fournisseur et simulateur' },
            { layer: 'Visualisation', detail: 'Chart.js — graphiques mis à jour en temps réel' },
        ],
        stack: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js'],
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initSmoothScroll(navbar, prefersReducedMotion);
    initScrollReveal(prefersReducedMotion);
    initTypewriter(prefersReducedMotion);
    initProjectModal();
    initThemeToggle();
    initTerminal();
    initTilt(prefersReducedMotion);
    initContactForm();
    initCopyEmail();
});

/**
 * Bouton « Copier l'email » : copie l'adresse dans le presse-papier
 * et affiche brièvement une infobulle « Copié ! ».
 */
function initCopyEmail() {
    const button = document.querySelector('.copy-email-btn');
    if (!button) return;

    const tooltip = button.querySelector('.copy-tooltip');
    const TOOLTIP_DURATION = 2000;
    let hideTimer;

    // Repli pour les contextes où l'API Clipboard est indisponible
    function legacyCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        if (!ok) throw new Error('copie refusée');
    }

    function showTooltip(message, isError) {
        tooltip.textContent = message;
        button.classList.toggle('is-error', Boolean(isError));
        button.classList.add('is-copied');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            button.classList.remove('is-copied', 'is-error');
            tooltip.textContent = '';
        }, TOOLTIP_DURATION);
    }

    button.addEventListener('click', async () => {
        const email = button.dataset.copy;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                legacyCopy(email);
            }
            showTooltip('Copié !');
        } catch (error) {
            showTooltip('Copie impossible', true);
        }
    });
}

/**
 * Envoi du formulaire de contact via Formspree (fetch, sans rechargement).
 * Tant que l'identifiant Formspree n'est pas renseigné, ouvre la messagerie du visiteur.
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const isConfigured = !form.action.includes('VOTRE_ID');

    function setStatus(message, type) {
        status.textContent = message;
        status.className = type ? `form-status is-${type}` : 'form-status';
    }

    // La validation native (required, type="email") s'exécute avant cet événement
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = new FormData(form);
        if (data.get('_gotcha')) return; // robot détecté par le champ piège

        if (!isConfigured) {
            const subject = data.get('subject') || `Contact portfolio — ${data.get('name')}`;
            const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
            window.location.href =
                `mailto:${form.dataset.fallbackEmail}` +
                `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setStatus('Votre logiciel de messagerie va s’ouvrir avec le message pré-rempli.', 'success');
            return;
        }

        submitButton.disabled = true;
        setStatus('Envoi en cours…');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                const json = await response.json().catch(() => ({}));
                const details = json.errors ? json.errors.map((e) => e.message).join(', ') : '';
                throw new Error(details || `Erreur ${response.status}`);
            }

            form.reset();
            setStatus('Merci ! Votre message a bien été envoyé, je vous réponds rapidement.', 'success');
        } catch (error) {
            setStatus(`L’envoi a échoué (${error.message}). Réessayez ou écrivez-moi directement par email.`, 'error');
        } finally {
            submitButton.disabled = false;
        }
    });
}

/**
 * Mini-terminal de la section « À propos » : help, skills, projects, clear.
 * ↑ / ↓ parcourent l'historique des commandes.
 */
function initTerminal() {
    const form = document.querySelector('.terminal-line');
    if (!form) return;

    const input = form.querySelector('.terminal-input');
    const output = document.querySelector('.terminal-output');
    const body = document.querySelector('.terminal-body');
    const prompt = form.querySelector('.terminal-prompt').textContent;

    const history = [];
    let historyIndex = 0;

    const COMMANDS = {
        help: () => [
            'Commandes disponibles :',
            '  help      Affiche cette aide',
            '  skills    Liste mes compétences techniques',
            '  projects  Liste mes projets réalisés',
            '  clear     Efface le terminal',
        ],
        // Lu depuis les cartes de la section Compétences pour rester synchronisé avec la page
        skills: () =>
            [...document.querySelectorAll('.skill-card')].map((card) => {
                const name = card.querySelector('h3').textContent.trim();
                const items = card.querySelector('p').textContent.trim();
                return `  ${name.padEnd(18)} ${items}`;
            }),
        projects: () => [
            ...Object.values(PROJECTS).map((p) => `  • ${p.title} — ${p.subtitle}`),
            '',
            'Astuce : cliquez sur une carte de la section Projets pour voir tous les détails.',
        ],
        clear: () => {
            output.replaceChildren();
            return [];
        },
    };

    function print(lines, className) {
        lines.forEach((text) => {
            const line = document.createElement('div');
            line.className = className ? `terminal-text ${className}` : 'terminal-text';
            line.textContent = text;
            output.append(line);
        });
        body.scrollTop = body.scrollHeight;
    }

    function run(raw) {
        const command = raw.trim().toLowerCase();
        print([`${prompt} ${raw}`], 'terminal-echo');
        if (!command) return;

        const handler = COMMANDS[command];
        if (handler) {
            print(handler());
        } else {
            print([`Commande introuvable : ${command}. Tapez "help" pour la liste des commandes.`], 'terminal-error');
        }
    }

    print(['Bienvenue ! Tapez "help" pour découvrir les commandes disponibles.']);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value;
        if (value.trim()) history.push(value);
        historyIndex = history.length;
        input.value = '';
        run(value);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (history.length === 0) return;
        event.preventDefault();

        historyIndex += event.key === 'ArrowUp' ? -1 : 1;
        historyIndex = Math.max(0, Math.min(history.length, historyIndex));
        input.value = history[historyIndex] ?? '';
    });

    // Un clic n'importe où dans le terminal donne le focus à la saisie (sauf sélection de texte)
    body.addEventListener('click', () => {
        if (!window.getSelection().toString()) input.focus();
    });
}

/**
 * Effet d'inclinaison 3D qui suit la souris sur les cartes projets et compétences.
 * Désactivé sur écran tactile et avec « réduire les animations ».
 */
function initTilt(reducedMotion) {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !canHover) return;

    const MAX_ANGLE = 8; // degrés

    document.querySelectorAll('.project-card, .skill-card').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width; // 0 → 1
            const y = (event.clientY - rect.top) / rect.height;

            card.classList.add('is-tilting');
            card.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_ANGLE}deg`);
            card.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_ANGLE}deg`);
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
        });

        card.addEventListener('pointerleave', () => {
            card.classList.remove('is-tilting');
            card.style.removeProperty('--rx');
            card.style.removeProperty('--ry');
        });
    });
}

/**
 * Écrit puis efface tour à tour chaque rôle listé dans data-roles.
 * Avec "réduire les animations", le premier rôle reste affiché tel quel.
 */
function initTypewriter(reducedMotion) {
    const el = document.querySelector('.typewriter');
    if (!el || reducedMotion) return;

    const roles = JSON.parse(el.dataset.roles || '[]');
    if (roles.length === 0) return;

    const TYPE_DELAY = 80;
    const DELETE_DELAY = 40;
    const HOLD_DELAY = 1800;

    let roleIndex = 0;
    let charIndex = roles[0].length; // le premier rôle est déjà présent dans le HTML
    let deleting = true;

    function tick() {
        const role = roles[roleIndex];

        if (deleting) {
            charIndex--;
            el.textContent = role.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(tick, DELETE_DELAY);
            return;
        }

        charIndex++;
        el.textContent = role.slice(0, charIndex);
        if (charIndex === role.length) {
            deleting = true;
            setTimeout(tick, HOLD_DELAY);
        } else {
            setTimeout(tick, TYPE_DELAY);
        }
    }

    setTimeout(tick, HOLD_DELAY);
}

/**
 * Ouvre une modale <dialog> avec le détail du projet au clic (ou Entrée / Espace) sur sa carte.
 */
function initProjectModal() {
    const modal = document.querySelector('.project-modal');
    if (!modal || typeof modal.showModal !== 'function') return;

    const title = modal.querySelector('#modal-title');
    const subtitle = modal.querySelector('.modal-subtitle');
    const description = modal.querySelector('.modal-description');
    const features = modal.querySelector('.modal-features');
    const architecture = modal.querySelector('.modal-architecture');
    const stack = modal.querySelector('.modal-stack');

    function fillList(list, items) {
        list.replaceChildren(
            ...items.map((text) => {
                const li = document.createElement('li');
                li.textContent = text;
                return li;
            })
        );
    }

    function open(card) {
        const project = PROJECTS[card.dataset.project];
        if (!project) return;

        title.textContent = project.title;
        subtitle.textContent = project.subtitle;
        description.textContent = project.description;
        fillList(features, project.features);
        fillList(stack, project.stack);
        architecture.replaceChildren(
            ...project.architecture.map(({ layer, detail }) => {
                const li = document.createElement('li');
                const name = document.createElement('strong');
                name.textContent = layer;
                li.append(name, document.createTextNode(detail));
                return li;
            })
        );

        modal.showModal();
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
        card.addEventListener('click', () => open(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open(card);
            }
        });
    });

    modal.querySelector('.modal-close').addEventListener('click', () => modal.close());

    // Fermeture au clic sur le fond, c'est-à-dire en dehors du cadre de la modale
    modal.addEventListener('click', (event) => {
        if (event.target !== modal) return;
        const rect = modal.getBoundingClientRect();
        const outside =
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
        if (outside) modal.close();
    });

    // Échap ferme nativement la modale ; le focus revient seul sur la carte
    modal.addEventListener('close', () => {
        document.body.style.overflow = '';
    });
}

/**
 * Bascule entre thème sombre et clair. Le thème initial est appliqué
 * dans le <head> (index.html) ; le choix est mémorisé dans localStorage.
 */
function initThemeToggle() {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;

    const root = document.documentElement;

    function updateLabel() {
        const isLight = root.getAttribute('data-theme') === 'light';
        button.setAttribute('aria-label', isLight ? 'Activer le thème sombre' : 'Activer le thème clair');
    }

    updateLabel();

    button.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            // Stockage indisponible (navigation privée) : le thème s'applique quand même
        }
        updateLabel();
    });
}

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
 * Scroll Reveal : fait apparaître en fondu chaque élément quand il entre dans le viewport.
 * Les éléments frères (cartes d'une grille, étapes de la timeline…) apparaissent en cascade.
 * Les classes sont ajoutées par le JS : sans JS, le contenu reste visible.
 */
function initScrollReveal(reducedMotion) {
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    const SELECTOR = [
        '.section > h2',
        '.section > p',
        '.terminal',
        '.timeline-item',
        '.skill-card',
        '.project-card',
        '.projects-cta',
        '.contact-form',
    ].join(', ');
    const STAGGER = 120; // ms entre deux éléments frères
    const MAX_STEPS = 4; // évite des délais trop longs dans les grandes grilles

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // une seule animation par élément
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const siblingCount = new Map();

    document.querySelectorAll(SELECTOR).forEach((el) => {
        const index = siblingCount.get(el.parentElement) || 0;
        siblingCount.set(el.parentElement, index + 1);

        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${(index % MAX_STEPS) * STAGGER}ms`);
        observer.observe(el);
    });
}
