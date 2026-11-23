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
