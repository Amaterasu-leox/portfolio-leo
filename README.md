# Portfolio — Léo Baskarane

Portfolio personnel de développeur web full-stack, conçu de A à Z en **HTML, CSS et JavaScript natifs** : aucun framework, aucune dépendance, aucune étape de build.

🔗 **Démo en ligne : <https://amaterasu-leox.github.io/portfolio-leo/>**

## Fonctionnalités

- **Thème sombre / clair** mémorisé dans `localStorage`, appliqué avant le premier rendu pour éviter tout flash.
- **Sélecteur de couleur d'accent** et curseur personnalisé.
- **Modales de détail des projets** (`<dialog>` natif) avec onglets accessibles : présentation, choix techniques, difficultés et solutions.
- **Filtres de projets** par catégorie et cartes inclinables en 3D.
- **Timeline interactive** du parcours, avec apparition au défilement (Scroll Reveal).
- **Mini-terminal** : le visiteur tape des commandes (`help`, `skills`, `projects`…).
- **Widgets** : horloge et statut « Dev Timezone & Status », bloc-notes, barre de progression de lecture, grille d'activité de type GitHub (données simulées).
- **Effet machine à écrire** dans la section d'accueil.
- **Formulaire de contact** prêt pour Formspree et formulaire de newsletter simulé.
- **Accessibilité et responsive** : HTML sémantique, rôles ARIA, navigation au clavier, respect de `prefers-reduced-motion`, mise en page adaptée au mobile.

## Technologies

| Couche | Détail |
|---|---|
| Structure | HTML5 sémantique (`<dialog>`, formulaires accessibles) |
| Style | CSS3 : variables CSS pour les thèmes, Grid / Flexbox, animations, glassmorphism |
| Interactions | JavaScript (ES6+) natif : une fonction `init…` par fonctionnalité |
| Versionnement | Git / GitHub |

## Structure du projet

```
portfolio-leo/
├── index.html    # Structure de la page et balises meta (SEO, Open Graph)
├── style.css     # Styles, thèmes sombre / clair, responsive
├── script.js     # Interactions et données des projets (objet PROJECTS)
├── favicon.svg   # Logo
└── README.md
```

## Lancer le projet

Aucune installation n'est nécessaire.

**Option 1 — ouverture directe**

```bash
git clone https://github.com/Amaterasu-leox/portfolio-leo.git
cd portfolio-leo
```

Ouvrez ensuite `index.html` dans votre navigateur.

**Option 2 — serveur local** (recommandé)

```bash
# avec Python
python3 -m http.server 8000

# ou avec Node.js
npx serve .
```

Puis rendez-vous sur <http://localhost:8000>.

## Personnalisation

- **Projets** : modifiez l'objet `PROJECTS` en tête de `script.js` (titre, description, stack, liens, choix techniques, difficultés), puis la carte correspondante dans `index.html` (attribut `data-project`).
- **Formulaire de contact** : remplacez `VOTRE_ID` dans l'attribut `action` du formulaire (`index.html`) par l'identifiant de votre formulaire [Formspree](https://formspree.io).
- **Thèmes** : les couleurs sont définies par des variables CSS en début de `style.css`.

## Déploiement

Le site est statique et publié avec **GitHub Pages** : dans *Settings → Pages*, choisissez la branche `main` et le dossier racine `/`.

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).

## Auteur

**Léo Baskarane** — [GitHub](https://github.com/Amaterasu-leox)
