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
//   Les valeurs peuvent contenir {variable} ou être une fonction (vars) => texte.
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
        'nav.activer-le-theme-clair': { fr: 'Activer le thème clair', en: 'Switch to light theme' },
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
        'journey.conception-et-developpement-d-applicatio': { fr: 'Conception et développement d\'applications web interactives, mise en place d\'API REST avec FastAPI, gestion de bases de données MySQL et gestion de versions avec Git.', en: 'Design and development of interactive web applications, REST APIs built with FastAPI, MySQL database management and version control with Git.' },
        'journey.autodidacte-en-developpement-full-stack': { fr: 'Autodidacte en Développement Full-Stack & Systèmes', en: 'Self-taught in Full-Stack Development & Systems' },
        'journey.formation-a-la-maison-combs': { fr: 'Formation à la maison — Combs-la-Ville', en: 'Home-based training — Combs-la-Ville' },
        'journey.apprentissage-approfondi-de-la-programma': { fr: 'Apprentissage approfondi de la programmation, conception d\'applications web avec Python, FastAPI, MySQL et maîtrise des environnements de développement sous Linux/WSL et Git.', en: 'In-depth study of programming, web application design with Python, FastAPI and MySQL, and a solid command of Linux/WSL and Git development environments.' },

        // ── skills ──
        'skills.competences-techniques': { fr: 'Compétences Techniques', en: 'Technical Skills' },
        'skills.html5-css3-javascript-es6-responsive': { fr: 'HTML5, CSS3, JavaScript (ES6+), Responsive Design', en: 'HTML5, CSS3, JavaScript (ES6+), Responsive Design' },
        'skills.backend-api': { fr: 'Backend & API', en: 'Backend & API' },
        'skills.python-fastapi-endpoints-rest-crud': { fr: 'Python, FastAPI, Endpoints REST CRUD', en: 'Python, FastAPI, REST CRUD Endpoints' },
        'skills.bases-de-donnees': { fr: 'Bases de données', en: 'Databases' },
        'skills.mysql-modelisation-relationnelle-sql': { fr: 'MySQL, Modélisation relationnelle, SQL', en: 'MySQL, Relational Modeling, SQL' },
        'skills.outils-workflow': { fr: 'Outils & Workflow', en: 'Tools & Workflow' },
        'skills.git-bitbucket-pull-requests-linux': { fr: 'Git, Bitbucket (Pull Requests), Linux (Ubuntu), VS Code', en: 'Git, Bitbucket (Pull Requests), Linux (Ubuntu), VS Code' },
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
        'projects.voir-les-details': { fr: 'Voir les détails →', en: 'View details →' },
        'projects.portfolio-web-personnel': { fr: 'Portfolio Web Personnel', en: 'Personal Web Portfolio' },
        'projects.site-vitrine-developpe-sur-mesure': { fr: 'Site vitrine développé sur-mesure, sans framework : timeline interactive, mini-terminal, thème sombre / clair et responsive design.', en: 'Custom-built showcase site, no framework: interactive timeline, mini-terminal, dark / light theme and responsive design.' },
        'projects.finops-cloud-analytics': { fr: 'FinOps Cloud Analytics', en: 'FinOps Cloud Analytics' },
        'projects.tableau-de-bord-interactif-de': { fr: 'Tableau de bord interactif de suivi et d\'optimisation des coûts multi-cloud (AWS, GCP, Azure) avec graphiques interactifs sur données simulées et simulateur d\'économies.', en: 'Interactive dashboard to track and optimize multi-cloud costs (AWS, GCP, Azure), with interactive charts on simulated data and a savings simulator.' },
        'projects.voir-mes-depots-github': { fr: 'Voir mes dépôts GitHub', en: 'View my GitHub repositories' },
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
        if (vars) value = value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
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
        has: (key) => key in STRINGS,
        strings: STRINGS,
    };

    init();
})();
