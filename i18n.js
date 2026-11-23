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
