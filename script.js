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
            'Versionnement et revue de code via branches et Pull Requests sur GitHub',
        ],
        architecture: [
            { layer: 'Frontend', detail: 'HTML / CSS / JavaScript — interface et appels fetch vers l’API' },
            { layer: 'Backend', detail: 'Python FastAPI — endpoints REST CRUD' },
            { layer: 'Base de données', detail: 'MySQL — stockage relationnel des tâches' },
        ],
        stack: ['Python', 'FastAPI', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub'],
        // Liens : { label, href } — ajoute { label: 'Démo en ligne', href: '…' } quand elle existe
        links: [{ label: 'Code source sur GitHub', href: 'https://github.com/Amaterasu-leox/task-manager-api' }],
        choices: [
            { title: 'FastAPI', detail: 'Validation des données via les types Python et documentation interactive de l’API générée automatiquement.' },
            { title: 'MySQL', detail: 'Les tâches forment un modèle simple et relationnel : un SGBD classique permet de pratiquer le SQL et la modélisation.' },
            { title: 'JavaScript natif', detail: 'Pas de framework côté interface : l’objectif était de bien comprendre fetch et la manipulation du DOM.' },
        ],
        challenges: [
            { problem: 'Le navigateur bloquait les appels du frontend vers l’API (erreurs CORS).', solution: 'Configuration du middleware CORS de FastAPI pour n’autoriser que l’origine du frontend.' },
            { problem: 'Garder l’interface synchronisée avec la base après chaque création, modification ou suppression.', solution: 'Chaque action passe par l’API, puis la liste est rechargée depuis la réponse du serveur plutôt que modifiée localement.' },
            { problem: 'Travailler proprement en revue de code.', solution: 'Branches dédiées et Pull Requests GitHub pour relire chaque changement avant fusion.' },
        ],
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
        links: [{ label: 'Code source sur GitHub', href: 'https://github.com/Amaterasu-leox/portfolio-leo' }],
        choices: [
            { title: 'Zéro framework', detail: 'HTML, CSS et JavaScript natifs : site léger, sans dépendance ni étape de build.' },
            { title: 'Variables CSS pour les thèmes', detail: 'Toutes les couleurs passent par des variables : le thème clair ou sombre se change en un seul attribut sur <html>.' },
            { title: '<dialog> natif', detail: 'Pour les modales : gestion du focus, de la touche Échap et du fond assombri sans bibliothèque.' },
        ],
        challenges: [
            { problem: 'Un flash de la mauvaise couleur au chargement avec le thème sombre / clair.', solution: 'Un petit script dans le <head> applique le thème mémorisé avant le premier affichage.' },
            { problem: 'L’inclinaison 3D des cartes entrait en conflit avec l’animation d’apparition au défilement.', solution: 'L’apparition anime la propriété translate, ce qui laisse transform à l’inclinaison.' },
            { problem: 'Rester accessible malgré les animations.', solution: 'Respect de « réduire les animations », rôles ARIA, navigation clavier et libellés explicites.' },
        ],
    },
    finops: {
        title: 'FinOps Cloud Analytics',
        subtitle: 'Tableau de bord de suivi des coûts multi-cloud',
        description:
            "Tableau de bord interactif pour suivre et optimiser les coûts d'infrastructure répartis " +
            "sur AWS, GCP et Azure, avec des graphiques interactifs sur données simulées et un simulateur d'économies.",
        features: [
            'Vue consolidée des dépenses AWS, GCP et Azure',
            'Graphiques interactifs sur données simulées avec Chart.js',
            "Simulateur d'économies pour évaluer les pistes d'optimisation",
            'Interface responsive en JavaScript natif, sans framework',
        ],
        architecture: [
            { layer: 'Interface', detail: 'HTML5 / CSS3 — tableau de bord responsive' },
            { layer: 'Logique', detail: 'JavaScript — agrégation des coûts par fournisseur et simulateur' },
            { layer: 'Visualisation', detail: 'Chart.js — graphiques interactifs sur données simulées' },
        ],
        stack: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js'],
        links: [{ label: 'Code source sur GitHub', href: 'https://github.com/Amaterasu-leox' }],
        choices: [
            { title: 'Chart.js', detail: 'Bibliothèque légère et responsive, avec mise à jour fluide des graphiques sans les recréer.' },
            { title: 'JavaScript natif', detail: 'L’agrégation des coûts et le simulateur sont de simples fonctions pures, faciles à tester.' },
            { title: 'Données simulées', detail: 'Un jeu de données multi-cloud représentatif permet de démontrer l’outil sans compte AWS, GCP ou Azure.' },
        ],
        challenges: [
            { problem: 'Comparer des fournisseurs qui présentent leurs coûts différemment.', solution: 'Normalisation des données dans un format commun avant l’agrégation et l’affichage.' },
            { problem: 'Garder des graphiques fluides lors des mises à jour des données simulées.', solution: 'Mise à jour des jeux de données existants plutôt que destruction et recréation des graphiques.' },
            { problem: 'Rendre le simulateur d’économies compréhensible.', solution: 'Résultats recalculés instantanément à chaque changement de paramètre, avec l’économie estimée mise en évidence.' },
        ],
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initReadingProgress();
    initSystemStatus(prefersReducedMotion);
    initDevClock();
    initAccentSwitcher();
    initScratchpad();
    initCustomCursor(prefersReducedMotion);
    initActivityGrid();
    initSmoothScroll(navbar, prefersReducedMotion);
    initScrollReveal(prefersReducedMotion);
    initTypewriter(prefersReducedMotion);
    initProjectFilter(prefersReducedMotion);
    initBlog(prefersReducedMotion);
    initNewsletter();
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
 * Affiche une notification Toast en bas à droite, qui disparaît seule après `duration` ms.
 * type : 'success' (défaut) ou 'error'.
 */
function showToast(message, type = 'success', duration = 3000) {
    const region = document.querySelector('.toast-region');
    if (!region) return;

    const toast = document.createElement('div');
    toast.className = type === 'error' ? 'toast is-error' : 'toast';

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    const path = type === 'error' ? 'M6 6l12 12M18 6L6 18' : 'M5 12.5l4.5 4.5L19 7.5';
    icon.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" ' +
        `stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;

    const text = document.createElement('span');
    text.textContent = message;

    toast.append(icon, text);
    region.append(toast);

    // Disparition en fondu, puis retrait du DOM une fois l'animation terminée
    setTimeout(() => {
        toast.classList.add('is-leaving');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
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

    // Mode simulation (développement local) : aucune requête réseau, délai fictif d'1 seconde.
    // Passer à false une fois l'identifiant Formspree renseigné dans index.html.
    const SIMULATION_MODE = true;
    const SIMULATED_DELAY = 1000;

    function setStatus(message, type) {
        status.textContent = message;
        status.className = type ? `form-status is-${type}` : 'form-status';
    }

    // La validation native (required, type="email") s'exécute avant cet événement
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = new FormData(form);
        if (data.get('_gotcha')) return; // robot détecté par le champ piège

        if (SIMULATION_MODE) {
            submitButton.disabled = true;
            setStatus('Envoi en cours…');
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
            form.reset();
            setStatus('Merci ! Votre message a bien été envoyé (simulation, aucune donnée transmise).', 'success');
            showToast('Message envoyé avec succès !');
            submitButton.disabled = false;
            return;
        }

        if (!isConfigured) {
            const subject = data.get('subject') || `Contact portfolio — ${data.get('name')}`;
            const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
            window.location.href =
                `mailto:${form.dataset.fallbackEmail}` +
                `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setStatus('Votre logiciel de messagerie va s’ouvrir avec le message pré-rempli.', 'success');
            showToast('Messagerie ouverte : envoyez le message depuis votre application.');
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
            showToast('Message envoyé avec succès !');
        } catch (error) {
            setStatus(`L’envoi a échoué (${error.message}). Réessayez ou écrivez-moi directement par email.`, 'error');
            showToast('L’envoi a échoué. Réessayez.', 'error');
        } finally {
            submitButton.disabled = false;
        }
    });
}

/**
 * Terminal interactif (style CLI Linux / WSL) : help, about, skills, stack, projects [n],
 * contact, whoami, history, clear. ↑ / ↓ parcourent l'historique, Tab complète la commande,
 * et les puces sous le terminal lancent une commande d'un clic.
 */
function initTerminal() {
    const form = document.querySelector('.terminal-line');
    if (!form) return;

    const input = form.querySelector('.terminal-input');
    const output = document.querySelector('.terminal-output');
    const body = document.querySelector('.terminal-body');
    const prompt = form.querySelector('.terminal-prompt').textContent;
    const chips = document.querySelectorAll('.terminal-chip');

    const EMAIL = 'baskaraneleo@forcefabric.com';
    const history = [];
    let historyIndex = 0;

    // Technologies mises en évidence dans les réponses
    const TECH = /(FastAPI|Python|MySQL|JavaScript)/g;

    const COMMANDS = {
        help: () => [
            'Commandes disponibles :',
            '  help         Affiche cette aide',
            '  about        Qui suis-je ?',
            '  skills       Mes compétences techniques',
            '  stack        Mes 4 technos phares : FastAPI, Python, MySQL, JavaScript',
            '  projects     Mes projets (ex : "projects 1" pour le détail)',
            '  contact      Me contacter',
            '  whoami       Qui est connecté ?',
            '  history      Commandes déjà tapées',
            '  clear        Efface le terminal',
            '',
            'Astuces : Tab complète, ↑ / ↓ rappellent l’historique.',
        ],
        about: () => [
            'Léo Baskarane — développeur Full-Stack autonome (Île-de-France).',
            'Je conçois des applications web fluides : API REST en Python / FastAPI,',
            'bases MySQL et interfaces en JavaScript natif.',
            'Tapez "stack" ou "projects" pour aller plus loin.',
        ],
        // Lu depuis les cartes de la section Compétences pour rester synchronisé avec la page
        skills: () => [
            ...[...document.querySelectorAll('.skill-card')].map((card) => {
                const name = card.querySelector('h3').textContent.trim();
                const items = card.querySelector('p').textContent.trim();
                return `  ${name.padEnd(18)} ${items}`;
            }),
            '',
            'Tapez "stack" pour le détail de mes technos phares.',
        ],
        stack: () => [
            '  FastAPI      API REST asynchrones, validation Pydantic, docs Swagger / ReDoc auto',
            '  Python       Backend, scripts, environnements virtuels gérés avec uv',
            '  MySQL        Modélisation relationnelle, requêtes SQL, intégration avec Python',
            '  JavaScript   Interfaces dynamiques en JS natif : DOM, fetch, sans framework',
            '',
            'Exemple de combinaison : projet Guru To-Do ("projects 1").',
        ],
        projects: (args) => {
            const entries = Object.values(PROJECTS);
            if (args[0]) {
                const project = entries[Number(args[0]) - 1];
                if (!project) return [`Projet introuvable : ${args[0]}. Choisissez un numéro de 1 à ${entries.length}.`];
                return [
                    `${project.title} — ${project.subtitle}`,
                    '',
                    project.description,
                    '',
                    'Fonctionnalités :',
                    ...project.features.map((f) => `  • ${f}`),
                    '',
                    `Stack : ${project.stack.join(', ')}`,
                ];
            }
            return [
                ...entries.map((p, i) => `  ${i + 1}. ${p.title} — ${p.subtitle}`),
                '',
                'Tapez "projects <numéro>" pour le détail, ou cliquez sur une carte de la section Projets.',
            ];
        },
        contact: () => [
            `  Email      ${EMAIL}`,
            '  Formulaire section « Contact » en bas de page',
            '  Localité   Île-de-France',
            '',
            'Un projet FastAPI, Python, MySQL ou JavaScript ? Écrivez-moi !',
        ],
        whoami: () => ['leo — développeur Full-Stack (FastAPI · Python · MySQL · JavaScript)'],
        history: () =>
            history.length ? history.map((h, i) => `  ${String(i + 1).padStart(2)}  ${h}`) : ['Aucune commande pour l’instant.'],
        clear: () => {
            output.replaceChildren();
            return [];
        },
    };

    // Écrit une ligne en mettant les technos en couleur (nœuds DOM, jamais d'innerHTML)
    function appendLine(text, className) {
        const line = document.createElement('div');
        line.className = className ? `terminal-text ${className}` : 'terminal-text';
        text.split(TECH).forEach((part, i) => {
            if (i % 2 === 1) {
                const span = document.createElement('span');
                span.className = 'terminal-tech';
                span.textContent = part;
                line.append(span);
            } else if (part) {
                line.append(part);
            }
        });
        output.append(line);
    }

    function print(lines, className) {
        lines.forEach((text) => appendLine(text, className));
        body.scrollTop = body.scrollHeight;
    }

    function run(raw) {
        const [command, ...args] = raw.trim().toLowerCase().split(/\s+/);
        print([`${prompt} ${raw}`], 'terminal-echo');
        if (!command) return;

        const handler = Object.hasOwn(COMMANDS, command) ? COMMANDS[command] : null;
        if (handler) {
            print(handler(args));
        } else {
            print([`Commande introuvable : ${command}. Tapez "help" pour la liste des commandes.`], 'terminal-error');
        }
    }

    function submit(value) {
        if (value.trim()) history.push(value.trim());
        historyIndex = history.length;
        input.value = '';
        run(value);
    }

    print(['Bienvenue sur le terminal de Léo (WSL2 · Ubuntu). Tapez "help" pour commencer.']);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submit(input.value);
    });

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            submit(chip.dataset.command);
            input.focus({ preventScroll: true });
        });
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            // Complétion : une seule commande possible → on la complète
            const typed = input.value.trim().toLowerCase();
            const matches = Object.keys(COMMANDS).filter((name) => typed && name.startsWith(typed));
            if (matches.length === 1) {
                event.preventDefault();
                input.value = matches[0];
            }
            return;
        }

        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (history.length === 0) return;
        event.preventDefault();

        historyIndex += event.key === 'ArrowUp' ? -1 : 1;
        historyIndex = Math.max(0, Math.min(history.length, historyIndex));
        input.value = history[historyIndex] ?? '';
    });

    // Un clic n'importe où dans le terminal donne le focus à la saisie (sauf sélection de texte)
    body.addEventListener('click', () => {
        if (!window.getSelection().toString()) input.focus({ preventScroll: true });
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
        let frame = 0;
        let last = null;

        // Un seul calcul par image : les pointermove rapprochés sont regroupés (rAF)
        function update() {
            frame = 0;
            if (!last) return;
            const rect = card.getBoundingClientRect();
            const x = (last.clientX - rect.left) / rect.width; // 0 → 1
            const y = (last.clientY - rect.top) / rect.height;

            card.classList.add('is-tilting');
            card.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_ANGLE}deg`);
            card.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_ANGLE}deg`);
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
        }

        card.addEventListener('pointermove', (event) => {
            last = event;
            if (!frame) frame = requestAnimationFrame(update);
        });

        card.addEventListener('pointerleave', () => {
            last = null;
            cancelAnimationFrame(frame);
            frame = 0;
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
 * Filtre les cartes projets selon leur data-category quand on clique sur un bouton .filter-btn.
 */
function initProjectFilter(reducedMotion) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (buttons.length === 0 || cards.length === 0) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            buttons.forEach((b) => {
                const active = b === button;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', String(active));
            });

            cards.forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;
                const wasHidden = card.hidden;
                card.hidden = !match;
                // Petite apparition des cartes qui viennent de réapparaître
                if (match && wasHidden && !reducedMotion && card.animate) {
                    card.animate(
                        [{ opacity: 0, translate: '0 16px' }, { opacity: 1, translate: '0 0' }],
                        { duration: 400, easing: 'ease-out' }
                    );
                }
            });
        });
    });
}

/**
 * Blog : filtre les articles par catégorie ET par texte saisi dans la recherche,
 * met à jour le compteur « Affichage de XX sur 50 » et simule « Voir plus d'articles ».
 */
function initBlog(reducedMotion) {
    const cards = document.querySelectorAll('.blog-card');
    const buttons = document.querySelectorAll('.blog-filter-btn');
    const search = document.querySelector('#blog-search');
    const count = document.querySelector('.blog-count');
    const total = document.querySelector('.blog-total');
    const empty = document.querySelector('.blog-empty');
    const more = document.querySelector('.blog-more');
    const moreStatus = document.querySelector('.blog-more-status');
    if (cards.length === 0) return;

    // Minuscules et sans accents : « donnees » trouve « données »
    const normalize = (text) =>
        text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    let filter = 'all';
    let query = '';

    // Index de recherche par carte : titre, résumé et catégorie (étiquette + clé), sans auteur ni date
    const searchIndex = new Map();
    cards.forEach((card) => {
        const parts = [
            card.querySelector('h3')?.textContent,
            card.querySelector('.blog-card-body > p')?.textContent,
            card.querySelector('.blog-tag')?.textContent,
            card.dataset.category,
        ];
        searchIndex.set(card, normalize(parts.filter(Boolean).join(' ')));
    });

    // Métriques du widget : calculées depuis les cartes pour rester cohérentes
    const metricArticles = document.querySelector('.blog-metric-articles');
    const metricTopics = document.querySelector('.blog-metric-topics');
    if (metricArticles) metricArticles.textContent = String(cards.length);
    if (metricTopics) {
        metricTopics.textContent = String(new Set([...cards].map((c) => c.dataset.category)).size);
    }

    // Nombre d'articles par catégorie affiché dans chaque bouton de filtre
    buttons.forEach((button) => {
        const key = button.dataset.filter;
        const n = key === 'all'
            ? cards.length
            : [...cards].filter((c) => c.dataset.category === key).length;
        if (!button.dataset.label) button.dataset.label = button.textContent.trim();
        button.textContent = `${button.dataset.label} (${n})`;
    });

    function apply() {
        let visible = 0;
        let available = 0;

        cards.forEach((card) => {
            const matchCategory = filter === 'all' || card.dataset.category === filter;
            // Chaque mot saisi doit être présent : « fastapi api » trouve les articles qui contiennent les deux
            const text = searchIndex.get(card);
            const matchQuery = !query || query.split(' ').every((word) => text.includes(word));
            const show = matchCategory && matchQuery;
            const wasHidden = card.hidden;

            if (show) available++;
            card.hidden = !show;
            if (show) visible++;

            if (show && wasHidden && !reducedMotion && card.animate) {
                card.animate(
                    [{ opacity: 0, translate: '0 16px' }, { opacity: 1, translate: '0 0' }],
                    { duration: 400, easing: 'ease-out' }
                );
            }
        });

        if (count) count.textContent = String(visible);
        if (total) total.textContent = String(available);
        if (empty) empty.hidden = visible > 0;

        // Pagination : tous les articles de la sélection sont affichés → bouton désactivé
        if (more) {
            const allShown = visible >= available;
            more.hidden = available === 0;
            more.disabled = allShown;
            more.setAttribute('aria-disabled', String(allShown));
            if (moreStatus) {
                moreStatus.textContent = allShown && available > 0
                    ? 'Les prochains articles arrivent bientôt.'
                    : '';
            }
        }
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            filter = button.dataset.filter;
            buttons.forEach((b) => {
                const active = b === button;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', String(active));
            });
            apply();
        });
    });

    if (search) {
        search.addEventListener('input', () => {
            query = normalize(search.value).trim().replace(/\s+/g, ' ');
            apply();
        });
    }

    // État initial de la pagination (compteurs, bouton désactivé, message)
    apply();
}

/**
 * Newsletter : formulaire simulé. Valide l'e-mail puis affiche une confirmation ;
 * aucune donnée n'est envoyée ni stockée.
 */
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    const status = document.querySelector('.newsletter-status');
    if (!form || !status) return;

    const input = form.querySelector('input[type="email"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        status.classList.remove('is-success', 'is-error');

        if (!input.value.trim() || !input.checkValidity()) {
            status.textContent = 'Merci de saisir une adresse e-mail valide.';
            status.classList.add('is-error');
            input.focus();
            return;
        }

        status.textContent = 'Merci ! Inscription simulée : aucune donnée n’a été enregistrée.';
        status.classList.add('is-success');
        form.reset();
    });
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
    const choices = modal.querySelector('.modal-choices');
    const challenges = modal.querySelector('.modal-challenges');
    const links = modal.querySelector('.modal-links');
    const tabs = Array.from(modal.querySelectorAll('[role="tab"]'));

    // Onglets : un seul panneau visible à la fois, navigation aux flèches / Début / Fin
    function selectTab(tab, focus) {
        tabs.forEach((t) => {
            const active = t === tab;
            t.setAttribute('aria-selected', String(active));
            t.tabIndex = active ? 0 : -1;
            modal.querySelector(`#${t.getAttribute('aria-controls')}`).hidden = !active;
        });
        if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (event) => {
            const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
            if (!(event.key in keys)) return;
            event.preventDefault();
            selectTab(tabs[(keys[event.key] + tabs.length) % tabs.length], true);
        });
    });

    function makeItem(label, text) {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = label;
        li.append(strong, document.createTextNode(text));
        return li;
    }

    function makeChallenge({ problem, solution }) {
        const li = document.createElement('li');
        [['Difficulté', problem], ['Solution', solution]].forEach(([label, text]) => {
            const row = document.createElement('p');
            const tag = document.createElement('span');
            tag.className = 'modal-tag';
            tag.textContent = label;
            row.append(tag, document.createTextNode(text));
            li.append(row);
        });
        return li;
    }

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

        choices.replaceChildren(...project.choices.map(({ title, detail }) => makeItem(title, detail)));
        challenges.replaceChildren(...project.challenges.map(makeChallenge));

        links.replaceChildren(
            ...(project.links || []).map(({ label, href }, i) => {
                const a = document.createElement('a');
                a.href = href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = i === 0 ? 'btn primary-btn' : 'btn secondary-btn';
                a.textContent = label;
                return a;
            })
        );

        selectTab(tabs[0]);
        modal.showModal();
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
        card.addEventListener('click', (event) => {
            // Le lien « Voir les détails » mène à GitHub : pas de modale dans ce cas
            if (event.target.closest('.project-more')) return;
            open(card);
        });
        card.addEventListener('keydown', (event) => {
            if (event.target.closest('.project-more')) return;
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
 * Grille d'activité façon GitHub : ~26 semaines de contributions SIMULÉES (jamais de vraies données),
 * générées avec un générateur pseudo-aléatoire à graine fixe pour que la grille soit stable
 * d'un chargement à l'autre. Tooltip au survol (souris) ou au toucher.
 */
function initActivityGrid() {
    const root = document.querySelector('.gh-activity');
    if (!root) return;

    const grid = root.querySelector('.gh-grid');
    const monthsRow = root.querySelector('.gh-months');
    const summary = root.querySelector('.gh-summary');
    const tooltip = root.querySelector('.gh-tooltip');
    const scroller = root.querySelector('.gh-scroll');

    const WEEKS = 26;
    const DAY = 24 * 60 * 60 * 1000;

    // mulberry32 : petit PRNG déterministe
    function makeRandom(seed) {
        let a = seed;
        return () => {
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    // Début : le dimanche d'il y a (WEEKS - 1) semaines
    const start = new Date(today.getTime() - ((WEEKS - 1) * 7 + today.getDay()) * DAY);

    const formatDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const formatMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

    function describe(count, date) {
        const label = count === 0 ? 'Aucune contribution' : `${count} contribution${count > 1 ? 's' : ''}`;
        return `${label} le ${formatDate.format(date)}`;
    }

    const level = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 8 ? 3 : 4);

    const cells = [];
    const months = [];
    let total = 0;
    let best = { count: -1, date: null };
    let lastMonth = -1;

    for (let i = 0; ; i++) {
        const date = new Date(start.getTime() + i * DAY);
        if (date > today) break;

        const random = makeRandom(20260000 + i * 7919);
        const weekend = date.getDay() === 0 || date.getDay() === 6;
        // Jours calmes plus fréquents le week-end, pics de 0 à 12 en semaine
        const count = random() < (weekend ? 0.55 : 0.25) ? 0 : Math.floor(random() ** 1.6 * (weekend ? 6 : 13)) + 1;

        total += count;
        if (count > best.count) best = { count, date };

        // Type d'actions simulé : surtout des commits, avec parfois une PR et/ou un merge
        const pulls = count >= 3 && random() < 0.35 ? 1 : 0;
        const merges = count >= 5 && random() < 0.3 ? 1 : 0;
        const commits = count - pulls - merges;
        const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
        const detail = [
            commits > 0 && plural(commits, 'commit'),
            pulls > 0 && plural(pulls, 'pull request'),
            merges > 0 && plural(merges, 'merge'),
        ].filter(Boolean).join(' · ');

        const cell = document.createElement('i');
        cell.className = 'gh-cell';
        cell.dataset.level = String(level(count));
        cell.dataset.tip = describe(count, date);
        cell.dataset.detail = detail;
        cell.style.setProperty('--col', String(Math.floor(i / 7)));
        cells.push(cell);

        // Étiquette de mois au-dessus de la première semaine où il apparaît
        if (date.getDay() === 0 && date.getMonth() !== lastMonth) {
            const label = document.createElement('span');
            label.textContent = formatMonth.format(date);
            label.style.gridColumn = String(Math.floor(i / 7) + 1);
            months.push(label);
            lastMonth = date.getMonth();
        }
    }

    grid.replaceChildren(...cells);
    monthsRow.replaceChildren(...months);
    // Nombre de colonnes (semaines), utilisé par la mise en page fluide sur mobile
    root.style.setProperty('--gh-weeks', String(Math.ceil(cells.length / 7)));

    const summaryText = document.createElement('span');
    summaryText.append(
        document.createElement('strong'),
        ` contributions ces ${Math.round(WEEKS / 4.35)} derniers mois · meilleur jour : ${best.count}`
    );
    summaryText.firstChild.textContent = String(total);
    summary.replaceChildren(summaryText);

    // Sur mobile, la grille déborde : on montre d'abord les semaines les plus récentes
    scroller.scrollLeft = scroller.scrollWidth;

    // Tooltip unique, positionné au-dessus de la case survolée
    function show(cell) {
        const main = document.createElement('div');
        main.textContent = cell.dataset.tip;
        tooltip.replaceChildren(main);
        if (cell.dataset.detail) {
            const extra = document.createElement('div');
            extra.className = 'gh-tooltip-detail';
            extra.textContent = cell.dataset.detail;
            tooltip.append(extra);
        }
        tooltip.hidden = false;
        const rect = cell.getBoundingClientRect();
        const half = tooltip.offsetWidth / 2;
        const x = Math.min(window.innerWidth - half - 8, Math.max(half + 8, rect.left + rect.width / 2));
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${rect.top - 8}px`;
    }

    const hide = () => { tooltip.hidden = true; };

    grid.addEventListener('pointerover', (event) => {
        const cell = event.target.closest('.gh-cell');
        if (cell) show(cell);
    });
    grid.addEventListener('pointerleave', hide);
    // Au toucher, pas de « leave » fiable : un appui hors de la grille ferme l'infobulle
    document.addEventListener('pointerdown', (event) => {
        if (!event.target.closest('.gh-grid')) hide();
    });
    scroller.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
}

/**
 * Widget « System Status » du footer : états toujours « opérationnels » (simulation),
 * avec une latence fictive qui varie légèrement toutes les 3 secondes.
 */
function initSystemStatus(reducedMotion) {
    const items = document.querySelectorAll('.status-item');
    if (items.length === 0) return;

    function refresh() {
        items.forEach((item) => {
            const base = Number(item.dataset.base);
            const jitter = Math.round(base * (Math.random() * 0.5 - 0.25)); // ±25 %
            item.querySelector('.status-ms').textContent = String(Math.max(1, base + jitter));
        });
    }

    if (reducedMotion) return; // valeurs figées : pas de mise à jour en continu
    setInterval(refresh, 3000);
}

/**
 * Notes rapides : sauvegarde automatique du texte dans localStorage ('forcefabric-scratchpad'),
 * 500 ms après la dernière frappe, et restauration au chargement. « Clear » demande une
 * confirmation (second clic dans les 3 secondes).
 */
function initScratchpad() {
    const root = document.querySelector('.scratchpad');
    if (!root) return;

    const textarea = root.querySelector('.scratchpad-text');
    const status = root.querySelector('.scratchpad-status');
    const clearButton = root.querySelector('.scratchpad-clear');

    const STORAGE_KEY = 'forcefabric-scratchpad';
    const DEBOUNCE = 500;
    const CONFIRM_DELAY = 3000;
    let saveTimer;
    let confirmTimer;

    function setStatus(state) {
        const labels = { saved: 'SAVED', typing: 'TYPING...', error: 'NOT SAVED' };
        status.textContent = labels[state];
        status.className = `scratchpad-status is-${state}`;
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, textarea.value);
            setStatus('saved');
        } catch (e) {
            setStatus('error'); // stockage indisponible ou plein
        }
    }

    function resetConfirm() {
        clearTimeout(confirmTimer);
        clearButton.classList.remove('is-confirming');
        clearButton.textContent = 'Clear';
    }

    try {
        textarea.value = localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
        setStatus('error');
    }

    textarea.addEventListener('input', () => {
        setStatus('typing');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(save, DEBOUNCE);
    });

    // Évite de perdre la dernière frappe si l'onglet se ferme pendant le délai
    window.addEventListener('pagehide', () => {
        if (saveTimer) {
            clearTimeout(saveTimer);
            saveTimer = 0;
            save();
        }
    });

    clearButton.addEventListener('click', () => {
        if (!clearButton.classList.contains('is-confirming')) {
            clearButton.classList.add('is-confirming');
            clearButton.textContent = 'Sûr ? Confirmer';
            confirmTimer = setTimeout(resetConfirm, CONFIRM_DELAY);
            return;
        }
        resetConfirm();
        clearTimeout(saveTimer);
        textarea.value = '';
        save();
        textarea.focus();
    });
    clearButton.addEventListener('blur', resetConfirm);
}

/**
 * Sélecteur d'accent néon : pose --accent-color et --accent-rgb sur <html> (tout le thème, le curseur
 * et le widget d'horloge en dépendent) et mémorise le choix dans localStorage ('forcefabric-accent').
 * La couleur mémorisée est déjà appliquée dans le <head> (index.html) avant le premier affichage.
 */
function initAccentSwitcher() {
    const dots = document.querySelectorAll('.accent-dot');
    if (dots.length === 0) return;

    const STORAGE_KEY = 'forcefabric-accent';
    const style = document.documentElement.style;
    const allowed = [...dots].map((d) => d.dataset.accent);

    function apply(color) {
        const rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)).join(', ');
        style.setProperty('--accent-color', color);
        style.setProperty('--accent-rgb', rgb);
        dots.forEach((dot) => dot.setAttribute('aria-pressed', String(dot.dataset.accent === color)));
    }

    let saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { }
    apply(allowed.includes(saved) ? saved : allowed[0]);

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const selectedColor = dot.dataset.accent;
            apply(selectedColor);
            try {
                localStorage.setItem(STORAGE_KEY, selectedColor);
            } catch (e) {
                // Stockage indisponible (navigation privée) : la couleur s'applique quand même
            }
        });
    });
}

/**
 * Curseur personnalisé : un point (#cursor-dot) collé à la souris et un réticule (#cursor-outline)
 * qui la suit avec de l'inertie (requestAnimationFrame). Le réticule se verrouille sur les éléments
 * interactifs (classe is-hover) et se contracte au clic (is-down).
 * Inactif sur écran tactile et avec « réduire les animations » : le curseur système reste alors en place.
 */
function initCustomCursor(reducedMotion) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline || reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const root = document.documentElement;
    const INTERACTIVE =
        'a, button, summary, select, label, [role="button"], [role="tab"], input[type="submit"], ' +
        '.project-card, .skill-card, .blog-card, .testimonial-card, .dev-clock, .system-status, .gh-cell';
    const LAG = 0.16; // 0 → figé, 1 → aucun retard

    let mouseX = 0;
    let mouseY = 0;
    let outX = 0;
    let outY = 0;
    let ready = false;
    let frame = 0;

    function render() {
        outX += (mouseX - outX) * LAG;
        outY += (mouseY - outY) * LAG;
        outline.style.transform = `translate3d(${outX}px, ${outY}px, 0)`;

        // On s'arrête quand le réticule a rattrapé le point ; le prochain mouvement relance la boucle
        const settled = Math.abs(mouseX - outX) < 0.1 && Math.abs(mouseY - outY) < 0.1;
        frame = settled ? 0 : requestAnimationFrame(render);
    }

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        if (!ready) {
            // Premier mouvement : le réticule apparaît sous la souris, sans glisser depuis le coin
            ready = true;
            outX = mouseX;
            outY = mouseY;
            root.classList.add('has-custom-cursor');
        }
        dot.classList.remove('is-hidden');
        outline.classList.remove('is-hidden');
        if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('mouseover', (event) => {
        outline.classList.toggle('is-hover', Boolean(event.target.closest && event.target.closest(INTERACTIVE)));
    });

    document.addEventListener('mousedown', () => outline.classList.add('is-down'));
    document.addEventListener('mouseup', () => outline.classList.remove('is-down'));

    // Souris sortie de la fenêtre : on masque le curseur personnalisé
    document.documentElement.addEventListener('mouseleave', () => {
        dot.classList.add('is-hidden');
        outline.classList.add('is-hidden');
        outline.classList.remove('is-down');
    });
}

/**
 * Widget « Dev Timezone & Status » de la navbar : heure de Paris (avec décalage UTC+1 / UTC+2
 * selon l'heure d'été), heure UTC, et statut ONLINE entre 08:00 et 22:00 (heure de Paris), AWAY sinon.
 */
function initDevClock() {
    const root = document.querySelector('.dev-clock');
    if (!root) return;

    const localEl = root.querySelector('.dev-clock-local');
    const utcEl = root.querySelector('.dev-clock-utc');
    const offsetEl = root.querySelector('.dev-clock-offset');
    const badge = root.querySelector('.dev-status-badge');

    const ONLINE_FROM = 8;
    const ONLINE_TO = 22; // exclu : 21:59:59 est encore ONLINE

    const parisTime = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const utcTime = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const parisHour = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Paris', hour: 'numeric', hourCycle: 'h23',
    });
    let parisZone = null;
    try {
        parisZone = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', timeZoneName: 'shortOffset' });
    } catch (e) {
        // shortOffset non supporté : le décalage est alors déduit des deux horloges ci-dessous
    }

    function offsetLabel(now) {
        if (parisZone) {
            const part = parisZone.formatToParts(now).find((p) => p.type === 'timeZoneName');
            if (part) {
                const match = part.value.match(/GMT([+-]\d+)?/);
                if (match) return `UTC${match[1] || '+0'}`;
            }
        }
        const diff = (Number(parisHour.format(now)) - now.getUTCHours() + 24) % 24;
        return `UTC+${diff}`;
    }

    let lastState = null;

    function tick() {
        const now = new Date();
        const hour = Number(parisHour.format(now));
        const online = hour >= ONLINE_FROM && hour < ONLINE_TO;

        localEl.textContent = parisTime.format(now);
        utcEl.textContent = utcTime.format(now);
        offsetEl.textContent = offsetLabel(now);

        if (online !== lastState) {
            lastState = online;
            root.classList.toggle('is-online', online);
            root.classList.toggle('is-away', !online);
            badge.textContent = online ? 'ONLINE' : 'AWAY';
        }
    }

    tick();
    // Aligné sur le changement de seconde pour que l'affichage ne saute jamais
    setTimeout(() => {
        tick();
        setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));
}

/**
 * Barre de progression de lecture : se remplit en fonction du défilement de la page.
 */
function initReadingProgress() {
    const wrapper = document.querySelector('.reading-progress');
    const bar = document.querySelector('.reading-progress-bar');
    if (!wrapper || !bar) return;

    let ticking = false;

    function update() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        bar.style.setProperty('--progress', ratio.toFixed(4));
        wrapper.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
        ticking = false;
    }

    // Un seul recalcul par image (requestAnimationFrame) pour rester fluide
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
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
        '.showcase-copy',
        '.showcase-window',
        '.blog-intro',
        '.blog-featured',
        '.blog-filters',
        '.blog-card',
        '.blog-pagination',
        '.newsletter-card',
        '.filter-bar',
        '.projects-cta',
        '.testimonial-card',
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
