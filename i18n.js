// Portfolio — Léo Baskarane
// Internationalisation FR / EN : dictionnaire, bascule de langue, mémorisation (localStorage).
//
// Fonctionnement
// - Le HTML reste écrit en français (contenu par défaut, utile sans JavaScript).
// - Un élément est traduit s'il porte l'un de ces attributs :
//     data-i18n="clé"                     → remplace son texte
//     data-i18n-html="clé"                → remplace son HTML (balises en ligne : <span>, <em>…)
//     data-i18n-attr="aria-label:clé;placeholder:clé2" → remplace des attributs
// - Les textes générés par script.js passent par window.i18n.t('clé', { variables }).
//   Les valeurs peuvent contenir {variable}, être une fonction (vars) => texte, ou un tableau / objet
//   (lignes du terminal, fiches projets) renvoyé tel quel.
// - Après chaque changement de langue, l'événement « langchange » est émis sur document
//   (event.detail.lang) : script.js s'en sert pour redessiner ce qu'il a généré.
//
// Ajouter une langue : l'ajouter à SUPPORTED et ajouter sa valeur à chaque entrée de STRINGS.
// Ce fichier doit être chargé en fin de <body>, avant script.js.
(function () {
    'use strict';

    const STORAGE_KEY = 'forcefabric-lang';
    const SUPPORTED = ['fr', 'en'];
    const DEFAULT_LANG = 'fr';
    const OG_LOCALE = { fr: 'fr_FR', en: 'en_US' };
    const INTL_LOCALE = { fr: 'fr-FR', en: 'en-US' }; // formats de dates (grille d'activité)

    const STRINGS = {
        // ── meta ──
        'meta.title': {
            fr: 'Léo Baskarane — Développeur Web & Full-Stack',
            en: 'Léo Baskarane — Web & Full-Stack Developer',
        },
        'meta.description': {
            fr: 'Portfolio de Léo Baskarane, développeur web full-stack : projets Python/FastAPI, MySQL et JavaScript, parcours, compétences et contact.',
            en: 'Portfolio of Léo Baskarane, full-stack web developer: Python/FastAPI, MySQL and JavaScript projects, background, skills and contact.',
        },

        // ── sélecteur de langue ──
        'lang.group': { fr: 'Langue / Language', en: 'Langue / Language' },
        'lang.announce': { fr: 'Langue : français', en: 'Language: English' },

        // ── textes générés par script.js ──
        'nav.fermer-le-menu': { fr: 'Fermer le menu', en: 'Close menu' },
        'theme.to-light': { fr: 'Activer le thème clair', en: 'Switch to light theme' },
        'theme.to-dark': { fr: 'Activer le thème sombre', en: 'Switch to dark theme' },
        'hero.roles': {
            fr: ['Développeur Full-Stack', 'Passionné de Python & FastAPI', 'Créateur Web'],
            en: ['Full-Stack Developer', 'Passionate about Python & FastAPI', 'Web Creator'],
        },
        'js.copied': { fr: 'Copié !', en: 'Copied!' },
        'js.copy-failed': { fr: 'Copie impossible', en: 'Copy failed' },
        'js.sending': { fr: 'Envoi en cours…', en: 'Sending…' },
        'js.contact-sim-ok': {
            fr: 'Merci ! Votre message a bien été envoyé (simulation, aucune donnée transmise).',
            en: 'Thank you! Your message has been sent (simulation, no data transmitted).',
        },
        'js.contact-ok': {
            fr: 'Merci ! Votre message a bien été envoyé, je vous réponds rapidement.',
            en: 'Thank you! Your message has been sent, I will reply quickly.',
        },
        'js.contact-mailto': {
            fr: 'Votre logiciel de messagerie va s’ouvrir avec le message pré-rempli.',
            en: 'Your email client will open with the message pre-filled.',
        },
        'js.contact-error': {
            fr: 'L’envoi a échoué ({reason}). Réessayez ou écrivez-moi directement par email.',
            en: 'Sending failed ({reason}). Please try again or email me directly.',
        },
        'js.http-error': { fr: 'Erreur {status}', en: 'Error {status}' },
        'js.toast-sent': { fr: 'Message envoyé avec succès !', en: 'Message sent successfully!' },
        'js.toast-mailto': {
            fr: 'Messagerie ouverte : envoyez le message depuis votre application.',
            en: 'Email client opened: send the message from your application.',
        },
        'js.toast-failed': { fr: 'L’envoi a échoué. Réessayez.', en: 'Sending failed. Please try again.' },
        'js.newsletter-invalid': {
            fr: 'Merci de saisir une adresse e-mail valide.',
            en: 'Please enter a valid email address.',
        },
        'js.newsletter-ok': {
            fr: 'Merci ! Inscription simulée : aucune donnée n’a été enregistrée.',
            en: 'Thank you! Simulated subscription: no data was saved.',
        },
        'js.blog-soon': {
            fr: 'Les prochains articles arrivent bientôt.',
            en: 'More articles are coming soon.',
        },
        'js.confirm-clear': { fr: 'Sûr ? Confirmer', en: 'Sure? Confirm' },

        // ── grille d'activité GitHub (simulée) ──
        'gh.day-none': {
            fr: ({ date }) => `Aucune contribution le ${date}`,
            en: ({ date }) => `No contributions on ${date}`,
        },
        'gh.day-some': {
            fr: ({ n, date }) => `${n} contribution${n > 1 ? 's' : ''} le ${date}`,
            en: ({ n, date }) => `${n} contribution${n > 1 ? 's' : ''} on ${date}`,
        },
        'gh.summary': {
            fr: ({ months, best }) => ` contributions ces ${months} derniers mois · meilleur jour : ${best}`,
            en: ({ months, best }) => ` contributions over the last ${months} months · best day: ${best}`,
        },

        // ── modale projet ──
        'modal.problem': { fr: 'Difficulté', en: 'Challenge' },
        'modal.solution': { fr: 'Solution', en: 'Solution' },

        // ── terminal ──
        'term.welcome': {
            fr: 'Bienvenue sur le terminal de Léo (WSL2 · Ubuntu). Tapez "help" pour commencer.',
            en: 'Welcome to Léo’s terminal (WSL2 · Ubuntu). Type "help" to get started.',
        },
        'term.help': {
            fr: [
                'Commandes disponibles :',
                '  help         Affiche cette aide',
                '  about        Qui suis-je ?',
                '  skills       Mes compétences techniques',
                '  stack        Mes 4 technos phares : FastAPI, Python, MySQL, JavaScript',
                '  projects     Mes projets (ex : "projects 1" pour le détail)',
                '  github       Mon profil et mes dépôts GitHub',
                '  status       Statut du développeur et heure de Paris',
                '  neofetch     Mon environnement de travail',
                '  journey      Mon parcours en bref (alias : parcours)',
                '  contact      Me contacter',
                '  whoami       Qui est connecté ?',
                '  history      Commandes déjà tapées',
                '  clear        Efface le terminal',
                '',
                'Astuces : Tab complète (et liste les suggestions), ↑ / ↓ rappellent l’historique.',
            ],
            en: [
                'Available commands:',
                '  help         Show this help',
                '  about        Who am I?',
                '  skills       My technical skills',
                '  stack        My 4 flagship technologies: FastAPI, Python, MySQL, JavaScript',
                '  projects     My projects (e.g. "projects 1" for details)',
                '  github       My GitHub profile and repositories',
                '  status       Developer status and Paris time',
                '  neofetch     My working environment',
                '  journey      My background at a glance (alias: parcours)',
                '  contact      Get in touch',
                '  whoami       Who is logged in?',
                '  history      Commands already typed',
                '  clear        Clear the terminal',
                '',
                'Tips: Tab completes (and lists suggestions), ↑ / ↓ recall the history.',
            ],
        },
        'term.about': {
            fr: [
                'Léo Baskarane — développeur Full-Stack autonome (Île-de-France).',
                'Je conçois des applications web fluides : API REST en Python / FastAPI,',
                'bases MySQL et interfaces en JavaScript natif.',
                'Tapez "stack" ou "projects" pour aller plus loin.',
            ],
            en: [
                'Léo Baskarane — independent Full-Stack developer (Île-de-France).',
                'I build smooth web applications: REST APIs in Python / FastAPI,',
                'MySQL databases and interfaces in vanilla JavaScript.',
                'Type "stack" or "projects" to go further.',
            ],
        },
        'term.skills-hint': {
            fr: 'Tapez "stack" pour le détail de mes technos phares.',
            en: 'Type "stack" for details on my flagship technologies.',
        },
        'term.stack': {
            fr: [
                '  FastAPI      API REST asynchrones, validation Pydantic, docs Swagger / ReDoc auto',
                '  Python       Backend, scripts, environnements virtuels gérés avec uv',
                '  MySQL        Modélisation relationnelle, requêtes SQL, intégration avec Python',
                '  JavaScript   Interfaces dynamiques en JS natif : DOM, fetch, sans framework',
                '',
                'Exemple de combinaison : projet Guru To-Do ("projects 1").',
            ],
            en: [
                '  FastAPI      Async REST APIs, Pydantic validation, automatic Swagger / ReDoc docs',
                '  Python       Backend, scripts, virtual environments managed with uv',
                '  MySQL        Relational modeling, SQL queries, integration with Python',
                '  JavaScript   Dynamic interfaces in vanilla JS: DOM, fetch, no framework',
                '',
                'Example of a combination: the Guru To-Do project ("projects 1").',
            ],
        },
        'term.project-missing': {
            fr: 'Projet introuvable : {arg}. Choisissez un numéro de 1 à {max}.',
            en: 'Project not found: {arg}. Pick a number from 1 to {max}.',
        },
        'term.project-features': { fr: 'Fonctionnalités :', en: 'Features:' },
        'term.project-stack': { fr: 'Stack : {stack}', en: 'Stack: {stack}' },
        'term.projects-hint': {
            fr: 'Tapez "projects <numéro>" pour le détail, ou cliquez sur une carte de la section Projets.',
            en: 'Type "projects <number>" for details, or click a card in the Projects section.',
        },
        'term.github': {
            fr: ({ url, repos, portfolio }) => [
                `  Profil       ${url}`,
                `  Dépôt        ${repos}  (API FastAPI + MySQL)`,
                `  Dépôt        ${portfolio}  (ce portfolio)`,
                '',
                'Branches dédiées et Pull Requests : tout mon code est versionné avec Git.',
            ],
            en: ({ url, repos, portfolio }) => [
                `  Profile      ${url}`,
                `  Repository   ${repos}  (FastAPI + MySQL API)`,
                `  Repository   ${portfolio}  (this portfolio)`,
                '',
                'Dedicated branches and Pull Requests: all my code is versioned with Git.',
            ],
        },
        'term.status': {
            fr: ({ state, time, offset, projects }) => [
                `  Statut       ${state}  (ONLINE de 08:00 à 01:00, heure de Paris)`,
                `  Paris        ${time} ${offset}`,
                '  Localité     Île-de-France',
                `  Projets      ${projects} fiches détaillées ("projects")`,
                '',
                'Un message ? Tapez "contact".',
            ],
            en: ({ state, time, offset, projects }) => [
                `  Status       ${state}  (ONLINE 08:00 to 01:00, Paris time)`,
                `  Paris        ${time} ${offset}`,
                '  Location     Île-de-France',
                `  Projects     ${projects} detailed pages ("projects")`,
                '',
                'A message? Type "contact".',
            ],
        },
        'term.neofetch': {
            fr: ({ projects }) => [
                '  leo@portfolio',
                '  -------------',
                '  OS           Ubuntu sur WSL2 (Windows 11)',
                '  Shell        bash',
                '  Éditeur      VS Code (Remote WSL)',
                '  Backend      Python · FastAPI · Uvicorn · MySQL',
                '  Frontend     HTML5 · CSS3 · JavaScript natif',
                `  Projets      ${projects} fiches détaillées ("projects")`,
                '  Workflow     Git · branches dédiées · Pull Requests · uv',
                '  Thème        sombre / clair · FR / EN',
            ],
            en: ({ projects }) => [
                '  leo@portfolio',
                '  -------------',
                '  OS           Ubuntu on WSL2 (Windows 11)',
                '  Shell        bash',
                '  Editor       VS Code (Remote WSL)',
                '  Backend      Python · FastAPI · Uvicorn · MySQL',
                '  Frontend     HTML5 · CSS3 · vanilla JavaScript',
                `  Projects     ${projects} detailed pages ("projects")`,
                '  Workflow     Git · dedicated branches · Pull Requests · uv',
                '  Theme        dark / light · FR / EN',
            ],
        },
        'term.journey-hint': {
            fr: 'Le détail est dans la section « Parcours » de la page.',
            en: 'Full details are in the "Background" section of the page.',
        },
        'term.contact': {
            fr: ({ email }) => [
                `  Email      ${email}`,
                '  Formulaire section « Contact » en bas de page',
                '  Localité   Île-de-France',
                '',
                'Un projet FastAPI, Python, MySQL ou JavaScript ? Écrivez-moi !',
            ],
            en: ({ email }) => [
                `  Email      ${email}`,
                '  Form       "Contact" section at the bottom of the page',
                '  Location   Île-de-France',
                '',
                'A FastAPI, Python, MySQL or JavaScript project? Write to me!',
            ],
        },
        'term.whoami': {
            fr: 'leo — développeur Full-Stack (FastAPI · Python · MySQL · JavaScript)',
            en: 'leo — Full-Stack developer (FastAPI · Python · MySQL · JavaScript)',
        },
        'term.history-empty': { fr: 'Aucune commande pour l’instant.', en: 'No commands yet.' },
        'term.not-found': {
            fr: 'Commande introuvable : {command}. Tapez "help" pour la liste des commandes.',
            en: 'Command not found: {command}. Type "help" for the list of commands.',
        },

        // ── fiches projets (modale + terminal) : textes seulement, la stack et les liens restent dans script.js ──
        'project.guru-todo': {
            fr: {
                title: 'Guru To-Do App',
                subtitle: 'Application Full-Stack de gestion de tâches',
                description:
                    'Application complète permettant de créer, consulter, modifier et supprimer des tâches. ' +
                    'Le backend Python FastAPI expose une API REST connectée à une base MySQL, consommée par ' +
                    'une interface frontend interactive en HTML/CSS/JavaScript.',
                features: [
                    'Endpoints REST CRUD complets (création, lecture, mise à jour, suppression)',
                    'Persistance des données dans une base MySQL relationnelle',
                    'Interface web dynamique communiquant avec l’API via fetch',
                    'Backend FastAPI servi par Uvicorn, reliant le frontend HTML/CSS/JS à la base MySQL',
                    'Versionnement et revue de code via branches et Pull Requests sur GitHub',
                ],
                architecture: [
                    { layer: 'Frontend', detail: 'HTML / CSS / JavaScript — interface et appels fetch vers l’API' },
                    { layer: 'Backend', detail: 'Python FastAPI servi par Uvicorn — endpoints REST CRUD' },
                    { layer: 'Base de données', detail: 'MySQL — stockage relationnel des tâches' },
                ],
                links: ['Code source sur GitHub'],
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
            en: {
                title: 'Guru To-Do App',
                subtitle: 'Full-Stack task management application',
                description:
                    'A complete application to create, view, edit and delete tasks. ' +
                    'The Python FastAPI backend exposes a REST API connected to a MySQL database, consumed by ' +
                    'an interactive frontend in HTML/CSS/JavaScript.',
                features: [
                    'Full REST CRUD endpoints (create, read, update, delete)',
                    'Data persisted in a relational MySQL database',
                    'Dynamic web interface talking to the API through fetch',
                    'FastAPI backend served by Uvicorn, linking the HTML/CSS/JS frontend to the MySQL database',
                    'Versioning and code review with branches and Pull Requests on GitHub',
                ],
                architecture: [
                    { layer: 'Frontend', detail: 'HTML / CSS / JavaScript — interface and fetch calls to the API' },
                    { layer: 'Backend', detail: 'Python FastAPI served by Uvicorn — REST CRUD endpoints' },
                    { layer: 'Database', detail: 'MySQL — relational storage of tasks' },
                ],
                links: ['Source code on GitHub'],
                choices: [
                    { title: 'FastAPI', detail: 'Data validation through Python types and interactive API documentation generated automatically.' },
                    { title: 'MySQL', detail: 'Tasks make a simple relational model: a classic DBMS is a good way to practice SQL and data modeling.' },
                    { title: 'Vanilla JavaScript', detail: 'No framework on the interface side: the goal was to really understand fetch and DOM manipulation.' },
                ],
                challenges: [
                    { problem: 'The browser blocked the frontend’s calls to the API (CORS errors).', solution: 'Configured FastAPI’s CORS middleware to allow only the frontend’s origin.' },
                    { problem: 'Keeping the interface in sync with the database after every creation, edit or deletion.', solution: 'Every action goes through the API, then the list is reloaded from the server’s response instead of being modified locally.' },
                    { problem: 'Working cleanly with code review.', solution: 'Dedicated branches and GitHub Pull Requests to review every change before merging.' },
                ],
            },
        },
        'project.task-manager-api': {
            fr: {
                title: 'Task Manager API',
                subtitle: 'API REST de gestion de tâches',
                description:
                    'Le backend de mes applications de gestion de tâches : une API REST développée en Python avec ' +
                    'FastAPI, servie par Uvicorn et connectée à une base MySQL. Elle expose les opérations ' +
                    'nécessaires pour créer, lire, modifier et supprimer des tâches, et peut être consommée par ' +
                    'n’importe quel frontend.',
                features: [
                    'Endpoints REST CRUD pour gérer les tâches',
                    'Persistance des données dans une base MySQL relationnelle',
                    'Serveur ASGI Uvicorn pour une exécution rapide et asynchrone',
                    'Documentation interactive de l’API (Swagger / ReDoc) générée automatiquement par FastAPI',
                ],
                architecture: [
                    { layer: 'API', detail: 'Python FastAPI — routes REST et validation des données' },
                    { layer: 'Serveur', detail: 'Uvicorn — serveur ASGI qui exécute l’application' },
                    { layer: 'Base de données', detail: 'MySQL — stockage relationnel des tâches' },
                ],
                links: ['Code source sur GitHub'],
                choices: [
                    { title: 'FastAPI', detail: 'Validation via les types Python et documentation de l’API générée automatiquement, sans configuration supplémentaire.' },
                    { title: 'Uvicorn', detail: 'Serveur ASGI léger, adapté à l’asynchronisme de FastAPI et pratique en développement comme en production.' },
                    { title: 'MySQL', detail: 'Un SGBD relationnel classique pour pratiquer le SQL et la modélisation des données.' },
                ],
                challenges: [
                    { problem: 'Faire communiquer l’API avec un frontend servi depuis une autre origine.', solution: 'Configuration du middleware CORS de FastAPI pour autoriser uniquement l’origine du frontend.' },
                    { problem: 'Garder une API claire et facile à tester.', solution: 'Des endpoints courts et cohérents, testables directement depuis la documentation interactive.' },
                ],
            },
            en: {
                title: 'Task Manager API',
                subtitle: 'Task management REST API',
                description:
                    'The backend of my task management applications: a REST API built in Python with FastAPI, ' +
                    'served by Uvicorn and connected to a MySQL database. It exposes the operations needed to ' +
                    'create, read, update and delete tasks, and can be consumed by any frontend.',
                features: [
                    'REST CRUD endpoints to manage tasks',
                    'Data persisted in a relational MySQL database',
                    'Uvicorn ASGI server for fast, asynchronous execution',
                    'Interactive API documentation (Swagger / ReDoc) generated automatically by FastAPI',
                ],
                architecture: [
                    { layer: 'API', detail: 'Python FastAPI — REST routes and data validation' },
                    { layer: 'Server', detail: 'Uvicorn — ASGI server running the application' },
                    { layer: 'Database', detail: 'MySQL — relational storage of tasks' },
                ],
                links: ['Source code on GitHub'],
                choices: [
                    { title: 'FastAPI', detail: 'Validation through Python types and automatically generated API documentation, with no extra setup.' },
                    { title: 'Uvicorn', detail: 'A lightweight ASGI server that fits FastAPI’s async model and works well in development and production.' },
                    { title: 'MySQL', detail: 'A classic relational DBMS, a good way to practice SQL and data modeling.' },
                ],
                challenges: [
                    { problem: 'Letting the API talk to a frontend served from another origin.', solution: 'Configured FastAPI’s CORS middleware to allow only the frontend’s origin.' },
                    { problem: 'Keeping the API clear and easy to test.', solution: 'Short, consistent endpoints that can be tried directly from the interactive documentation.' },
                ],
            },
        },
        'project.portfolio': {
            fr: {
                title: 'Portfolio Web Personnel',
                subtitle: 'Site vitrine développé sur-mesure',
                description:
                    'Le site que vous êtes en train de visiter : un portfolio conçu de A à Z en HTML, CSS et ' +
                    'JavaScript natif, sans framework ni bibliothèque, avec une attention particulière portée ' +
                    'à l\'interactivité, à l\'accessibilité et au responsive design.',
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
                links: ['Code source sur GitHub'],
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
            en: {
                title: 'Personal Web Portfolio',
                subtitle: 'Custom-built showcase site',
                description:
                    'The site you are visiting right now: a portfolio built from scratch in vanilla HTML, CSS and ' +
                    'JavaScript, with no framework or library, with particular attention paid ' +
                    'to interactivity, accessibility and responsive design.',
                features: [
                    'Interactive timeline of my background with scroll-triggered reveal',
                    'Mini-terminal where visitors type commands (help, skills, projects…)',
                    'Remembered dark / light theme, typewriter effect and 3D tilting cards',
                    'Contact form ready for Formspree and project detail windows',
                ],
                architecture: [
                    { layer: 'Structure', detail: 'Semantic HTML5 — sections, native <dialog>, accessible forms' },
                    { layer: 'Style', detail: 'CSS3 — theme variables, Grid / Flexbox, animations' },
                    { layer: 'Interactions', detail: 'Vanilla JavaScript — one init module per feature' },
                ],
                links: ['Source code on GitHub'],
                choices: [
                    { title: 'Zero framework', detail: 'Plain HTML, CSS and JavaScript: a lightweight site, with no dependencies or build step.' },
                    { title: 'CSS variables for themes', detail: 'All colors go through variables: the light or dark theme changes with a single attribute on <html>.' },
                    { title: 'Native <dialog>', detail: 'For modals: focus handling, the Escape key and the dimmed backdrop without a library.' },
                ],
                challenges: [
                    { problem: 'A flash of the wrong color on load with the dark / light theme.', solution: 'A small script in the <head> applies the saved theme before the first paint.' },
                    { problem: 'The cards’ 3D tilt conflicted with the scroll-reveal animation.', solution: 'The reveal animates the translate property, which leaves transform free for the tilt.' },
                    { problem: 'Staying accessible despite the animations.', solution: 'Respecting “reduce motion”, ARIA roles, keyboard navigation and explicit labels.' },
                ],
            },
        },
        'project.finops': {
            fr: {
                title: 'FinOps Cloud Analytics',
                subtitle: 'Tableau de bord de suivi des coûts multi-cloud',
                description:
                    'Tableau de bord interactif pour suivre et optimiser les coûts d\'infrastructure répartis ' +
                    'sur AWS, GCP et Azure, avec des graphiques interactifs sur données simulées et un simulateur d\'économies.',
                features: [
                    'Vue consolidée des dépenses AWS, GCP et Azure',
                    'Graphiques interactifs sur données simulées avec Chart.js',
                    'Simulateur d\'économies pour évaluer les pistes d\'optimisation',
                    'Interface responsive en JavaScript natif, sans framework',
                ],
                architecture: [
                    { layer: 'Interface', detail: 'HTML5 / CSS3 — tableau de bord responsive' },
                    { layer: 'Logique', detail: 'JavaScript — agrégation des coûts par fournisseur et simulateur' },
                    { layer: 'Visualisation', detail: 'Chart.js — graphiques interactifs sur données simulées' },
                ],
                links: ['Code source sur GitHub'],
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
            en: {
                title: 'FinOps Cloud Analytics',
                subtitle: 'Multi-cloud cost tracking dashboard',
                description:
                    'An interactive dashboard to track and optimize infrastructure costs spread across ' +
                    'AWS, GCP and Azure, with interactive charts on simulated data and a savings simulator.',
                features: [
                    'Consolidated view of AWS, GCP and Azure spending',
                    'Interactive charts on simulated data with Chart.js',
                    'Savings simulator to evaluate optimization options',
                    'Responsive interface in vanilla JavaScript, no framework',
                ],
                architecture: [
                    { layer: 'Interface', detail: 'HTML5 / CSS3 — responsive dashboard' },
                    { layer: 'Logic', detail: 'JavaScript — cost aggregation by provider and simulator' },
                    { layer: 'Visualization', detail: 'Chart.js — interactive charts on simulated data' },
                ],
                links: ['Source code on GitHub'],
                choices: [
                    { title: 'Chart.js', detail: 'A lightweight, responsive library, with smooth chart updates without recreating them.' },
                    { title: 'Vanilla JavaScript', detail: 'Cost aggregation and the simulator are simple pure functions, easy to test.' },
                    { title: 'Simulated data', detail: 'A representative multi-cloud dataset makes it possible to demo the tool without an AWS, GCP or Azure account.' },
                ],
                challenges: [
                    { problem: 'Comparing providers that present their costs differently.', solution: 'Normalizing the data into a common format before aggregation and display.' },
                    { problem: 'Keeping charts smooth when the simulated data is updated.', solution: 'Updating the existing datasets instead of destroying and recreating the charts.' },
                    { problem: 'Making the savings simulator easy to understand.', solution: 'Results recalculated instantly on every parameter change, with the estimated saving highlighted.' },
                ],
            },
        },

        // @@entries-start (section ajoutée automatiquement, voir les en-têtes « ── nom ── »)
        // ── nav ──
        'nav.forcefabric-accueil': { fr: 'ForceFabric — Accueil', en: 'ForceFabric — Home' },
        'nav.ouvrir-le-menu': { fr: 'Ouvrir le menu', en: 'Open menu' },
        'nav.a-propos': { fr: 'À propos', en: 'About' },
        'nav.parcours': { fr: 'Parcours', en: 'Background' },
        'nav.competences': { fr: 'Compétences', en: 'Skills' },
        'nav.terminal': { fr: 'Terminal', en: 'Terminal' },
        'nav.projets': { fr: 'Projets', en: 'Projects' },
        'nav.blog': { fr: 'Blog', en: 'Blog' },
        'nav.temoignages': { fr: 'Témoignages', en: 'Testimonials' },
        'nav.contact': { fr: 'Contact', en: 'Contact' },
        'nav.fuseau-horaire-et-statut-du': { fr: 'Fuseau horaire et statut du développeur', en: 'Developer time zone and status' },
        'nav.couleur-d-accent': { fr: 'Couleur d\'accent', en: 'Accent color' },
        'nav.cyan-cyber': { fr: 'Cyan Cyber', en: 'Cyber Cyan' },
        'nav.vert-emeraude': { fr: 'Vert Émeraude', en: 'Emerald Green' },
        'nav.violet-cyberpunk': { fr: 'Violet Cyberpunk', en: 'Cyberpunk Purple' },
        'nav.orange-neon': { fr: 'Orange Néon', en: 'Neon Orange' },
        // ── hero ──
        'hero.bonjour-je-suis-leo-baskarane': { fr: 'Bonjour, je suis <span class="highlight">Léo Baskarane</span>', en: 'Hi, I\'m <span class="highlight">Léo Baskarane</span>' },
        'hero.developpeur-full-stack-passionne-de': { fr: 'Développeur Full-Stack, passionné de Python & FastAPI, créateur web', en: 'Full-Stack Developer, passionate about Python & FastAPI, web creator' },
        'hero.passionne-par-le-developpement-d': { fr: 'Passionné par le développement d\'applications web modernes, la conception d\'API robustes et la gestion de projets full-stack.', en: 'Passionate about building modern web applications, designing robust APIs and managing full-stack projects.' },
        'hero.voir-mes-projets': { fr: 'Voir mes projets', en: 'View my projects' },
        'hero.me-contacter': { fr: 'Me contacter', en: 'Contact me' },
        'hero.projets-demos': { fr: 'Projets & Démos', en: 'Projects & Demos' },
        'hero.code-propre-structure': { fr: 'Code Propre & Structuré', en: 'Clean & Structured Code' },
        'hero.capacites-cles': { fr: 'Capacités clés', en: 'Key capabilities' },
        'hero.developpement-full-stack': { fr: 'Développement Full-Stack', en: 'Full-Stack Development' },
        'hero.fastapi-python-javascript': { fr: 'FastAPI, Python, JavaScript', en: 'FastAPI, Python, JavaScript' },
        'hero.architecture-api-rest-bdd': { fr: 'Architecture API REST & BDD', en: 'REST API & Database Architecture' },
        'hero.mysql-modelisation-pymysql': { fr: 'MySQL, Modélisation, PyMySQL', en: 'MySQL, Data Modeling, PyMySQL' },
        'hero.interface-ergonomie-web': { fr: 'Interface & Ergonomie Web', en: 'Web Interface & Usability' },
        'hero.ui-ux-moderne-responsive-design': { fr: 'UI/UX Moderne, Responsive Design', en: 'Modern UI/UX, Responsive Design' },
        'hero.workflow-versioning': { fr: 'Workflow & Versioning', en: 'Workflow & Versioning' },
        'hero.git-github-ci-cd-linux': { fr: 'Git, GitHub, CI/CD, Linux/Bash', en: 'Git, GitHub, CI/CD, Linux/Bash' },

        // ── about ──
        'about.developpeur-autonome-base-en-ile': { fr: 'Développeur autonome basé en Île-de-France, j\'aime résoudre des problèmes techniques et concevoir des applications fluides et performantes. Mon parcours m\'a permis d\'acquérir une bonne maîtrise du développement full-stack, de la gestion de bases de données et des workflows Git/Bitbucket.', en: 'Independent developer based in the Île-de-France region, I enjoy solving technical problems and building smooth, high-performance applications. My path has given me a solid command of full-stack development, database management and Git/Bitbucket workflows.' },
        'about.voir-mon-profil-github-s': { fr: 'Voir mon profil GitHub (s\'ouvre dans un nouvel onglet)', en: 'View my GitHub profile (opens in a new tab)' },
        'about.activite-github': { fr: 'Activité GitHub', en: 'GitHub Activity' },
        'about.donnees-simulees': { fr: 'Données simulées', en: 'Simulated data' },
        'about.grille-de-contributions-simulee-sur': { fr: 'Grille de contributions simulée sur les 6 derniers mois', en: 'Simulated contribution grid over the last 6 months' },
        'about.moins': { fr: 'Moins', en: 'Less' },
        'about.plus': { fr: 'Plus', en: 'More' },

        // ── journey ──
        'journey.developpement-full-stack-projets-personn': { fr: 'Développement Full-Stack & Projets Personnels', en: 'Full-Stack Development & Personal Projects' },
        'journey.en-autodidacte-combs-la-ville': { fr: 'En autodidacte — Combs-la-Ville', en: 'Self-taught — Combs-la-Ville' },
        'journey.conception-et-developpement-d-applicatio': { fr: 'Conception d\'applications full-stack et d\'APIs REST (Task Manager API, Guru To-Do), modélisation de bases de données MySQL et intégration frontend/backend.', en: 'Design of full-stack applications and REST APIs (Task Manager API, Guru To-Do), MySQL database modelling and frontend/backend integration.' },
        'journey.autodidacte-en-developpement-full-stack': { fr: 'Autodidacte en Développement Full-Stack & Systèmes', en: 'Self-taught in Full-Stack Development & Systems' },
        'journey.formation-a-la-maison-combs': { fr: 'Formation à la maison — Combs-la-Ville', en: 'Home-based training — Combs-la-Ville' },
        'journey.apprentissage-approfondi-de-la-programma': { fr: 'Fondamentaux du développement web, maîtrise de l\'environnement Linux/WSL sous Windows, outillage quotidien avec VS Code et workflow collaboratif Git / Pull Requests sur GitHub.', en: 'Web development fundamentals, command of the Linux/WSL environment on Windows, daily tooling with VS Code and a collaborative Git / Pull Request workflow on GitHub.' },

        // ── skills ──
        'skills.competences-techniques': { fr: 'Compétences Techniques', en: 'Technical Skills' },
        'skills.backend-api': { fr: 'Backend & API', en: 'Backend & API' },
        'skills.tag-rest-crud-endpoints': { fr: 'Endpoints REST CRUD', en: 'REST CRUD Endpoints' },
        'skills.bases-de-donnees': { fr: 'Bases de données', en: 'Databases' },
        'skills.tag-relational-modeling': { fr: 'Modélisation relationnelle', en: 'Relational Modeling' },
        'skills.outils-workflow': { fr: 'Outils & Workflow', en: 'Tools & Workflow' },
        // ── terminal ──
        'terminal.terminal-interactif': { fr: 'Terminal Interactif', en: 'Interactive Terminal' },
        'terminal.explorez-mon-profil-comme-dans': { fr: 'Explorez mon profil comme dans un shell WSL / Ubuntu : tapez une commande, ou cliquez sur une puce.', en: 'Explore my profile as in a WSL / Ubuntu shell: type a command, or click a chip.' },
        'terminal.commande-du-terminal': { fr: 'Commande du terminal', en: 'Terminal command' },
        'terminal.commandes-rapides': { fr: 'Commandes rapides', en: 'Quick commands' },

        // ── notes ──
        'notes.notes-rapides': { fr: 'Notes rapides', en: 'Quick notes' },
        'notes.un-bloc-notes-pour-jeter': { fr: 'Un bloc-notes pour jeter une idée ou un snippet : tout reste dans votre navigateur, rien n\'est envoyé.', en: 'A notepad to jot down an idea or a snippet: everything stays in your browser, nothing is sent.' },
        'notes.tape-ici-idees-todo-snippets': { fr: '// tape ici : idées, todo, snippets…', en: '// type here: ideas, todo, snippets…' },

        // ── showcase ──
        'showcase.projet-phare': { fr: 'Projet phare', en: 'Featured project' },
        'showcase.une-plateforme-unique-pour-le': { fr: 'Une plateforme unique pour le code, les API et l\'architecture', en: 'A single platform for code, APIs and architecture' },
        'showcase.de-la-base-mysql-a': { fr: 'De la base MySQL à l\'interface web, toute la chaîne full-stack.', en: 'From the MySQL database to the web interface, the whole full-stack chain.' },
        'showcase.je-concois-des-applications-de': { fr: 'Je conçois des applications de bout en bout : un modèle de données relationnel solide, une API REST claire et performante avec FastAPI, puis une interface fluide qui la consomme. Chaque projet est versionné avec Git et pensé pour rester lisible, testable et facile à faire évoluer.', en: 'I build applications end to end: a solid relational data model, a clear and fast REST API with FastAPI, then a smooth interface that consumes it. Every project is versioned with Git and designed to stay readable, testable and easy to evolve.' },
        'showcase.explorer-le-code-sur-github': { fr: 'Explorer le code sur GitHub', en: 'Explore the code on GitHub' },
        'showcase.voir-tous-les-projets': { fr: 'Voir tous les projets', en: 'View all projects' },
        'showcase.mes-taches': { fr: 'Mes tâches', en: 'My tasks' },
        'showcase.api-connectee': { fr: 'API connectée', en: 'API connected' },
        'showcase.concevoir-le-schema-mysqltermine': { fr: '<span class="task-check"></span>Concevoir le schéma MySQL<em>Terminé</em>', en: '<span class="task-check"></span>Design the MySQL schema<em>Done</em>' },
        'showcase.endpoints-rest-crud-fastapi-termine': { fr: '<span class="task-check"></span>Endpoints REST CRUD (FastAPI)<em>Terminé</em>', en: '<span class="task-check"></span>REST CRUD endpoints (FastAPI)<em>Done</em>' },
        'showcase.connecter-l-interface-via-fetchen': { fr: '<span class="task-check"></span>Connecter l\'interface via fetch<em class="is-progress">En cours</em>', en: '<span class="task-check"></span>Connect the interface via fetch<em class="is-progress">In progress</em>' },
        'showcase.documenter-et-publier-la-demoa': { fr: '<span class="task-check"></span>Documenter et publier la démo<em>À faire</em>', en: '<span class="task-check"></span>Document and publish the demo<em>To do</em>' },

        // ── projects ──
        'projects.projets-recents': { fr: 'Projets Récents', en: 'Recent Projects' },
        'projects.filtrer-les-projets-par-categorie': { fr: 'Filtrer les projets par catégorie', en: 'Filter projects by category' },
        'projects.tous': { fr: 'Tous', en: 'All' },
        'projects.guru-to-do-app': { fr: 'Guru To-Do App', en: 'Guru To-Do App' },
        'projects.application-de-gestion-de-taches': { fr: 'Application de gestion de tâches Full-Stack : API REST CRUD en Python FastAPI, base de données MySQL et interface JavaScript dynamique.', en: 'Full-Stack task management application: CRUD REST API in Python FastAPI, MySQL database and a dynamic JavaScript interface.' },
        'projects.task-manager-api': { fr: 'Task Manager API', en: 'Task Manager API' },
        'projects.api-rest-de-gestion-de-taches': { fr: 'API REST de gestion de tâches en Python FastAPI, servie par Uvicorn, avec une base de données MySQL et une documentation interactive générée automatiquement.', en: 'Task management REST API in Python FastAPI, served by Uvicorn, with a MySQL database and automatically generated interactive documentation.' },
        'projects.voir-les-details': { fr: 'Voir les détails →', en: 'View details →' },
        'projects.portfolio-web-personnel': { fr: 'Portfolio Web Personnel', en: 'Personal Web Portfolio' },
        'projects.site-vitrine-developpe-sur-mesure': { fr: 'Site vitrine développé sur-mesure, sans framework : timeline interactive, mini-terminal, thème sombre / clair et responsive design.', en: 'Custom-built showcase site, no framework: interactive timeline, mini-terminal, dark / light theme and responsive design.' },
        'projects.finops-cloud-analytics': { fr: 'FinOps Cloud Analytics', en: 'FinOps Cloud Analytics' },
        'projects.tableau-de-bord-interactif-de': { fr: 'Tableau de bord interactif de suivi et d\'optimisation des coûts multi-cloud (AWS, GCP, Azure) avec graphiques interactifs sur données simulées et simulateur d\'économies.', en: 'Interactive dashboard to track and optimize multi-cloud costs (AWS, GCP, Azure), with interactive charts on simulated data and a savings simulator.' },
        'projects.voir-mes-depots-github': { fr: 'Voir mes dépôts GitHub', en: 'View my GitHub repositories' },
        // ── blog ──
        'blog.blog-perspectives': { fr: 'Blog & Perspectives', en: 'Blog & Perspectives' },
        'blog.perspectives-et-carnets-de-code': { fr: 'Perspectives et carnets de code', en: 'Perspectives and code notebooks' },
        'blog.mes-retours-d-experience-sur': { fr: 'Mes retours d\'expérience sur le développement full-stack : création d\'API REST avec FastAPI, gestion des bases de données MySQL et intégration d\'interfaces web modernes.', en: 'My lessons learned in full-stack development: building REST APIs with FastAPI, managing MySQL databases and integrating modern web interfaces.' },
        'blog.informations-sur-le-blog': { fr: 'Informations sur le blog', en: 'Blog information' },
        'blog.rechercher-un-article': { fr: 'Rechercher un article', en: 'Search for an article' },
        'blog.titres-resumes-ou-categories': { fr: 'Titres, résumés ou catégories...', en: 'Titles, summaries or categories...' },
        'blog.articles': { fr: 'articles', en: 'articles' },
        'blog.hebdomadaire': { fr: 'Hebdomadaire', en: 'Weekly' },
        'blog.publication': { fr: 'Publication', en: 'Publication' },
        'blog.zones-d-interet': { fr: 'zones d\'intérêt', en: 'areas of interest' },
        'blog.lecture-moyenne': { fr: 'Lecture moyenne', en: 'Average read' },
        'blog.8-min-de-lecture': { fr: '8 min de lecture', en: '8 min read' },
        'blog.concevoir-une-application-web-robuste': { fr: 'Concevoir une application web robuste avec FastAPI et MySQL', en: 'Building a robust web application with FastAPI and MySQL' },
        'blog.une-bonne-application-se-joue': { fr: 'Une bonne application se joue à l\'interface entre le front et le back : relier une interface moderne à une API REST performante, et structurer une base de données relationnelle qui reste fiable quand le projet grandit. Retour d\'expérience, de la modélisation aux endpoints.', en: 'A good application is made at the interface between front end and back end: connecting a modern interface to a fast REST API, and structuring a relational database that stays reliable as the project grows. Lessons learned, from data modeling to endpoints.' },
        'blog.4-nov-2026': { fr: '4 nov. 2026', en: 'Nov 4, 2026' },
        'blog.lire-l-article': { fr: 'Lire l\'article', en: 'Read the article' },
        'blog.filtrer-les-articles-par-categorie': { fr: 'Filtrer les articles par catégorie', en: 'Filter articles by category' },
        'blog.fastapi-api': { fr: 'FastAPI & API', en: 'FastAPI & API' },
        'blog.base-de-donnees': { fr: 'Base de données', en: 'Database' },
        'blog.devops-git': { fr: 'DevOps & Git', en: 'DevOps & Git' },
        'blog.pourquoi-j-ai-choisi-fastapi': { fr: 'Pourquoi j\'ai choisi FastAPI pour mes projets Backend : Performance et Asynchronisme', en: 'Why I chose FastAPI for my backend projects: performance and asynchronous support' },
        'blog.retour-d-experience-sur-la': { fr: 'Retour d\'expérience sur la rapidité d\'exécution, la validation automatique via Pydantic et la génération native de la documentation interactive Swagger/ReDoc.', en: 'Lessons learned on execution speed, automatic validation with Pydantic and native generation of interactive Swagger/ReDoc documentation.' },
        'blog.6-nov-2026': { fr: '6 nov. 2026', en: 'Nov 6, 2026' },
        'blog.lire-pourquoi-j-ai-choisi': { fr: 'Lire : Pourquoi j\'ai choisi FastAPI pour mes projets Backend, performance et asynchronisme', en: 'Read: Why I chose FastAPI for my backend projects, performance and asynchronous support' },
        'blog.structurer-une-base-de-donnees': { fr: 'Structurer une base de données MySQL pour une application web moderne', en: 'Structuring a MySQL database for a modern web application' },
        'blog.methodologie-de-modelisation-des-tables': { fr: 'Méthodologie de modélisation des tables, gestion propre des relations One-to-Many / Many-to-Many et intégration optimale avec Python.', en: 'A method for modeling tables, handling One-to-Many / Many-to-Many relationships cleanly and integrating optimally with Python.' },
        'blog.lire-structurer-une-base-de': { fr: 'Lire : Structurer une base de données MySQL pour une application web moderne', en: 'Read: Structuring a MySQL database for a modern web application' },
        'blog.de-l-idee-au-deploiement': { fr: 'De l\'idée au déploiement : Comment j\'ai conçu mon portfolio ForceFabric', en: 'From idea to deployment: how I designed my ForceFabric portfolio' },
        'blog.les-coulisses-de-la-creation': { fr: 'Les coulisses de la création du site : choix d\'une architecture HTML/CSS/JS fluide, design en glassmorphism et déploiement continu via GitHub Pages.', en: 'Behind the scenes of building this site: choosing a smooth HTML/CSS/JS architecture, glassmorphism design and continuous deployment through GitHub Pages.' },
        'blog.5-nov-2026': { fr: '5 nov. 2026', en: 'Nov 5, 2026' },
        'blog.lire-de-l-idee-au': { fr: 'Lire : De l\'idée au déploiement, comment j\'ai conçu mon portfolio ForceFabric', en: 'Read: From idea to deployment, how I designed my ForceFabric portfolio' },
        'blog.gerer-ses-environnements-sous-windows': { fr: 'Gérer ses environnements sous Windows 11 avec WSL2 et Ubuntu', en: 'Managing your environments on Windows 11 with WSL2 and Ubuntu' },
        'blog.optimisation-de-son-workflow-de': { fr: 'Optimisation de son workflow de dev sous Windows avec WSL, gestion des environnements virtuels Python via uv et gain de productivité au terminal.', en: 'Optimizing your dev workflow on Windows with WSL, managing Python virtual environments with uv and getting more productive in the terminal.' },
        'blog.lire-gerer-ses-environnements-sous': { fr: 'Lire : Gérer ses environnements sous Windows 11 avec WSL2 et Ubuntu', en: 'Read: Managing your environments on Windows 11 with WSL2 and Ubuntu' },
        'blog.automatiser-son-workflow-de-developpemen': { fr: 'Automatiser son workflow de développement avec Git et GitHub', en: 'Automating your development workflow with Git and GitHub' },
        'blog.les-bonnes-pratiques-de-versioning': { fr: 'Les bonnes pratiques de versioning, l\'organisation des branches et l\'écriture de commits clairs pour maintenir des projets propres.', en: 'Versioning best practices, branch organization and writing clear commits to keep projects clean.' },
        'blog.lire-automatiser-son-workflow-de': { fr: 'Lire : Automatiser son workflow de développement avec Git et GitHub', en: 'Read: Automating your development workflow with Git and GitHub' },
        'blog.structurer-une-application-web-moderne': { fr: 'Structurer une application web moderne : bonnes pratiques front et back', en: 'Structuring a modern web application: front-end and back-end best practices' },
        'blog.separer-les-responsabilites-organiser-le': { fr: 'Séparer les responsabilités, organiser le code et faire dialoguer interface et API sans dette technique.', en: 'Separating responsibilities, organizing code and getting the interface and the API to talk to each other without technical debt.' },
        'blog.3-nov-2026': { fr: '3 nov. 2026', en: 'Nov 3, 2026' },
        'blog.lire-structurer-une-application-web': { fr: 'Lire : Structurer une application web moderne, bonnes pratiques front et back', en: 'Read: Structuring a modern web application, front-end and back-end best practices' },
        'blog.creer-une-api-rest-robuste': { fr: 'Créer une API REST robuste et performante avec FastAPI et Python', en: 'Building a robust, high-performance REST API with FastAPI and Python' },
        'blog.endpoints-crud-validation-des-donnees': { fr: 'Endpoints CRUD, validation des données et gestion des erreurs : les fondations d\'une API fiable.', en: 'CRUD endpoints, data validation and error handling: the foundations of a reliable API.' },
        'blog.lire-creer-une-api-rest': { fr: 'Lire : Créer une API REST robuste et performante avec FastAPI et Python', en: 'Read: Building a robust, high-performance REST API with FastAPI and Python' },
        'blog.gerer-la-persistance-des-donnees': { fr: 'Gérer la persistance des données avec MySQL et PyMySQL', en: 'Handling data persistence with MySQL and PyMySQL' },
        'blog.modelisation-relationnelle-requetes-para': { fr: 'Modélisation relationnelle, requêtes paramétrées et connexions : stocker et relire ses données proprement.', en: 'Relational modeling, parameterized queries and connections: storing and reading back your data cleanly.' },
        'blog.2-nov-2026': { fr: '2 nov. 2026', en: 'Nov 2, 2026' },
        'blog.lire-gerer-la-persistance-des': { fr: 'Lire : Gérer la persistance des données avec MySQL et PyMySQL', en: 'Read: Handling data persistence with MySQL and PyMySQL' },
        'blog.concevoir-des-interfaces-dynamiques-et': { fr: 'Concevoir des interfaces dynamiques et réactives en JavaScript et CSS', en: 'Building dynamic, responsive interfaces with JavaScript and CSS' },
        'blog.manipulation-du-dom-appels-fetch': { fr: 'Manipulation du DOM, appels fetch et responsive design pour une interface fluide, sans framework.', en: 'DOM manipulation, fetch calls and responsive design for a smooth interface, with no framework.' },
        'blog.lire-concevoir-des-interfaces-dynamiques': { fr: 'Lire : Concevoir des interfaces dynamiques et réactives en JavaScript et CSS', en: 'Read: Building dynamic, responsive interfaces with JavaScript and CSS' },
        'blog.maitriser-le-versioning-et-le': { fr: 'Maîtriser le versioning et le déploiement continu avec Git, GitHub et Linux', en: 'Mastering versioning and continuous deployment with Git, GitHub and Linux' },
        'blog.branches-pull-requests-et-scripts': { fr: 'Branches, Pull Requests et scripts Bash : un workflow reproductible de la machine locale au serveur.', en: 'Branches, Pull Requests and Bash scripts: a reproducible workflow from the local machine to the server.' },
        'blog.1-nov-2026': { fr: '1 nov. 2026', en: 'Nov 1, 2026' },
        'blog.lire-maitriser-le-versioning-et': { fr: 'Lire : Maîtriser le versioning et le déploiement continu avec Git, GitHub et Linux', en: 'Read: Mastering versioning and continuous deployment with Git, GitHub and Linux' },
        'blog.de-l-idee-au-deploiement-2': { fr: 'De l\'idée au déploiement : retour d\'expérience sur mon portfolio ForceFabric', en: 'From idea to deployment: lessons learned from my ForceFabric portfolio' },
        'blog.choix-techniques-difficultes-rencontrees': { fr: 'Choix techniques, difficultés rencontrées et leçons tirées de la conception de ce site, étape par étape.', en: 'Technical choices, difficulties encountered and lessons learned from designing this site, step by step.' },
        'blog.lire-de-l-idee-au-2': { fr: 'Lire : De l\'idée au déploiement, retour d\'expérience sur mon portfolio ForceFabric', en: 'Read: From idea to deployment, lessons learned from my ForceFabric portfolio' },
        'blog.aucun-article-ne-correspond-a': { fr: 'Aucun article ne correspond à votre recherche.', en: 'No article matches your search.' },
        'blog.affichage-de': { fr: 'Affichage de', en: 'Showing' },
        'blog.sur': { fr: 'sur', en: 'of' },
        'blog.voir-plus-d-articles': { fr: 'Voir plus d\'articles', en: 'Load more articles' },

        // ── newsletter ──
        'newsletter.suivez-mes-carnets-de-code': { fr: 'Suivez mes carnets de code et projets full-stack.', en: 'Follow my code notebooks and full-stack projects.' },
        'newsletter.un-e-mail-par-semaine': { fr: 'Un e-mail par semaine : retours d\'expérience sur FastAPI, MySQL, l\'architecture d\'applications web et mes astuces de développement. Sans spam, désinscription en un clic.', en: 'One email a week: lessons learned on FastAPI, MySQL, web application architecture and my development tips. No spam, unsubscribe in one click.' },
        'newsletter.adresse-e-mail': { fr: 'Adresse e-mail', en: 'Email address' },
        'newsletter.votre-email-com': { fr: 'votre@email.com', en: 'you@email.com' },
        'newsletter.s-abonner': { fr: 'S\'abonner', en: 'Subscribe' },

        // ── modal ──
        'modal.fermer': { fr: 'Fermer', en: 'Close' },
        'modal.sections-du-projet': { fr: 'Sections du projet', en: 'Project sections' },
        'modal.presentation': { fr: 'Présentation', en: 'Overview' },
        'modal.choix-techniques': { fr: 'Choix techniques', en: 'Technical choices' },
        'modal.difficultes-solutions': { fr: 'Difficultés & solutions', en: 'Challenges & solutions' },
        'modal.fonctionnalites-cles': { fr: 'Fonctionnalités clés', en: 'Key features' },
        'modal.stack-technique': { fr: 'Stack technique', en: 'Tech stack' },

        // ── testimonials ──
        'testimonials.recommandations': { fr: 'Recommandations', en: 'Recommendations' },
        'testimonials.ce-que-disent-celles-et': { fr: 'Ce que disent celles et ceux avec qui j\'ai travaillé ou appris.', en: 'What people I have worked with or learned from say.' },
        'testimonials.leo-fait-preuve-d-une': { fr: '« Léo fait preuve d\'une autonomie remarquable et d\'une grande rigueur dans le développement d\'applications web. Sa capacité à concevoir des architectures backend et à structurer des bases de données témoigne d\'un solide niveau technique. »', en: '“Léo shows remarkable autonomy and great rigor in developing web applications. His ability to design backend architectures and structure databases reflects a solid technical level.”' },
        'testimonials.formateur-backend': { fr: 'Formateur Backend', en: 'Backend Instructor' },
        'testimonials.enseignant-referent-pedagogique': { fr: 'Enseignant / Référent Pédagogique', en: 'Teacher / Academic Advisor' },
        'testimonials.une-excellente-collaboration-avec-leo': { fr: '« Une excellente collaboration avec Léo. Il est réactif, maîtrise parfaitement la gestion de versions avec Git/GitHub et sait proposer des solutions efficaces face aux contraintes techniques. »', en: '“An excellent collaboration with Léo. He is responsive, has a perfect command of version control with Git/GitHub and knows how to propose effective solutions to technical constraints.”' },
        'testimonials.chef-de-projet': { fr: 'Chef de Projet', en: 'Project Manager' },
        'testimonials.lead-developer-collaborateur-tech': { fr: 'Lead Developer / Collaborateur Tech', en: 'Lead Developer / Tech Collaborator' },

        // ── contact ──
        'contact.un-projet-ou-une-opportunite': { fr: 'Un projet ou une opportunité ? N\'hésite pas à me contacter !', en: 'Have a project or an opportunity? Feel free to get in touch!' },
        'contact.nom': { fr: 'Nom', en: 'Name' },
        'contact.sujet': { fr: 'Sujet', en: 'Subject' },
        'contact.message': { fr: 'Message', en: 'Message' },
        'contact.envoyer-le-message': { fr: 'Envoyer le message', en: 'Send message' },
        'contact.ou-ecris-moi-directement': { fr: 'Ou écris-moi directement :', en: 'Or email me directly:' },
        'contact.copier-l-email': { fr: 'Copier l\'email', en: 'Copy email' },

        // ── footer ──
        'footer.etat-des-services-simulation': { fr: 'État des services (simulation)', en: 'Service status (simulation)' },
        'footer.operationnel': { fr: 'opérationnel ·', en: 'operational ·' },
        'footer.2026-leo-baskarane-tous-droits': { fr: '© 2026 Léo Baskarane — Tous droits réservés.', en: '© 2026 Léo Baskarane — All rights reserved.' },
        // @@entries-end
    };

    let current = DEFAULT_LANG;

    function readStored() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return SUPPORTED.includes(value) ? value : null;
        } catch (e) {
            return null; // stockage indisponible (navigation privée, blocage…)
        }
    }

    /** Langue enregistrée, sinon première langue supportée du navigateur, sinon français. */
    function detect() {
        const stored = readStored();
        if (stored) return stored;
        const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
        for (const pref of prefs) {
            const code = String(pref || '').toLowerCase().slice(0, 2);
            if (SUPPORTED.includes(code)) return code;
        }
        return DEFAULT_LANG;
    }

    /** Traduit une clé dans la langue courante (repli : français, puis la clé elle-même). */
    function t(key, vars) {
        const entry = STRINGS[key];
        if (!entry) return key;
        let value = entry[current] !== undefined ? entry[current] : entry[DEFAULT_LANG];
        if (typeof value === 'function') return value(vars || {});
        if (vars && typeof value === 'string') value = value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
        return value;
    }

    /** Applique la langue courante à tous les éléments balisés data-i18n*. */
    function apply(root) {
        root.querySelectorAll('[data-i18n]').forEach((el) => {
            el.textContent = t(el.dataset.i18n);
        });
        root.querySelectorAll('[data-i18n-html]').forEach((el) => {
            el.innerHTML = t(el.dataset.i18nHtml); // dictionnaire interne, jamais une saisie utilisateur
        });
        root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
            el.dataset.i18nAttr.split(';').forEach((pair) => {
                const [attribute, key] = pair.split(':');
                if (attribute && key) el.setAttribute(attribute, t(key));
            });
        });
    }

    function applyHead() {
        document.title = t('meta.title');
        const set = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', value);
        };
        set('meta[name="description"]', t('meta.description'));
        set('meta[property="og:title"]', t('meta.title'));
        set('meta[property="og:description"]', t('meta.description'));
        set('meta[property="og:locale"]', OG_LOCALE[current]);
    }

    function syncToggle() {
        document.querySelectorAll('.lang-btn').forEach((btn) => {
            const active = btn.dataset.lang === current;
            btn.setAttribute('aria-pressed', String(active));
            btn.classList.toggle('is-active', active);
        });
    }

    /**
     * Change de langue. `announce` : annonce le changement aux lecteurs d'écran (clic utilisateur).
     */
    function setLang(lang, { persist = true, announce = false } = {}) {
        if (!SUPPORTED.includes(lang)) return;
        current = lang;
        document.documentElement.lang = lang;
        apply(document);
        applyHead();
        syncToggle();
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* stockage indisponible : on garde la langue pour la session */ }
        }
        if (announce) {
            const region = document.querySelector('.lang-announce');
            if (region) region.textContent = t('lang.announce');
        }
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    function init() {
        current = detect();
        document.documentElement.lang = current;
        // Le HTML est déjà en français : rien à réécrire tant que la langue reste « fr »
        if (current !== DEFAULT_LANG) {
            apply(document);
            applyHead();
        }
        syncToggle();

        document.querySelectorAll('.lang-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.dataset.lang !== current) setLang(btn.dataset.lang, { announce: true });
            });
        });
    }

    window.i18n = {
        t,
        setLang,
        getLang: () => current,
        locale: () => INTL_LOCALE[current],
        has: (key) => key in STRINGS,
        strings: STRINGS,
    };

    init();
})();
