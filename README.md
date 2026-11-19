# Portfolio — Mohamed Ziyad Benabdeljalil

Site statique 100 % HTML/CSS/JavaScript natif (aucun framework, aucune compilation).

## Lancer
- Double-cliquer sur `index.html`, **ou**
- `python -m http.server 5517` dans ce dossier puis ouvrir http://localhost:5517

## Modifier le contenu
Tout le texte (FR/EN), les expériences, compétences, projets et certifications sont dans **`js/data.js`**.
- Ajoute tes liens LinkedIn / GitHub dans `App.profile` (`linkedin`, `github`) : les boutons apparaissent automatiquement.
- Le CV téléchargeable est `assets/CV_Ziyad_Benabdeljalil.pdf` (remplace-le pour le mettre à jour).

## Structure
| Fichier | Rôle |
|---|---|
| `js/core.js` | utilitaires, i18n FR/EN, thème, toasts |
| `js/network.js` | topologie réseau animée du hero (routage BFS, broadcast au clic) |
| `js/labs.js` | 3 labs (simulations illustratives) : réseau & stockage multi-sites, cluster Proxmox VE + Ceph (migration, HA), pipeline CI/CD |
| `js/graph.js` | graphe de compétences à forces (physique maison) |
| `js/terminal.js` | terminal interactif (fs virtuel, historique, Tab, `| grep`) |
| `js/main.js` | boot, sections, palette de commandes, curseur, easter eggs |

## Raccourcis
`Ctrl+K` ou `/` palette · `T` thème · `L` langue · Konami ↑↑↓↓←→←→BA · terminal : `help`, `sudo hire-me`, `matrix`

## Publier gratuitement
GitHub Pages, Netlify ou Vercel : déposer simplement le dossier `portfolio/`.
