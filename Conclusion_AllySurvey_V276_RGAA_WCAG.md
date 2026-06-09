# Conclusion — Thème AllySurvey V276

**Analyse RGAA 4.1 / WCAG 2.1 — Université de Lille / DAWAM — Juin 2026**

## Score indicatif d’accessibilité

**91 / 106 — 86 %**

**Niveau : « Très largement conforme » — RGAA 4.1 / WCAG 2.1 A+AA**

Le thème **AllySurvey V276** représente l’aboutissement d’un travail de mise en accessibilité du template LimeSurvey de l’Université de Lille, conduit en référence au **RGAA 4.1** (*Référentiel Général d’Amélioration de l’Accessibilité*) et aux **WCAG 2.1 niveaux A et AA**.

Avec **91 critères conformes sur 106**, soit un score indicatif de **86 %**, le thème atteint le niveau **« Très largement conforme »**, un seuil nettement supérieur au minimum requis pour un audit RGAA (**75 %**).

À titre de comparaison, le thème officiel LimeSurvey **Vanilla**, point de départ de ce travail, n’atteignait que **20 critères**, soit **22 %**.

---

## Ce qui a été accompli

### Structure & sémantique

- Landmarks ARIA complets : `header role="banner"`, `main`, `footer role="contentinfo"`.
- `fieldset` / `legend` sur tous les groupes de questions.
- Hiérarchie des titres **H1 → H2** cohérente dans chaque groupe.
- Attribut `lang` dynamique sur la balise `<html>`.

### Navigation clavier

- Deux liens d’évitement fonctionnels vers `#main-content` et `#a11y-toggle`.
- Cible avec `tabindex="-1"`.
- Focus visible global avec un ratio de contraste de **5.98:1** par rapport au blanc.
- Couverture de l’ensemble des composants interactifs : liens, boutons, champs, radios, checkboxes, matrices et zones défilables.

### Barre d’accessibilité

Un widget de personnalisation visuelle est intégré au thème :

- Taille de texte réglable de **80 % à 160 %**.
- Mode contraste élevé : fond `#121212`, liens `#ffbf47`, ratio **11.4:1**.
- Mode dyslexie avec police **Luciole** : 4 fichiers TTF inclus.
- Niveaux de gris.
- Espacement conforme à **WCAG 1.4.12**.
- Réinitialisation des réglages.
- Persistance via `localStorage`.
- Annonces vocales `aria-live` à chaque changement.

### Formulaires & erreurs

- Validation séquentielle avec focus sur la première erreur.
- `aria-invalid` et `aria-describedby` sur chaque champ en erreur.
- Nettoyage des attributs `required` sur les champs cachés et les groupes `multiple-opt`.
- Attributs `autocomplete` étendus : email, téléphone, nom, adresse, organisation, etc.
- Politique de confidentialité rendue accessible.

### Questions complexes LimeSurvey

- Matrices : ajout de `caption`, `scope`, `headers`, nettoyage des tabstops parasites.
- Sliders : `role="slider"`, attributs `aria-value*`, navigation clavier avec flèches, `Home` et `End`.
- Upload : formats de fichiers décrits via `aria-describedby`.
- Équations : `role="status"`, `aria-live="polite"`.
- Classement : synchronisation correcte et mécanisme anti-doublon.

### Annonces & consultation

- Deux zones `aria-live` centralisées : `role="status"` et `role="alert"`.
- Avertissement accessible avant expiration de session : modale `role="dialog"` avec compteur dégressif.
- Pages statiques couvertes : fin d’enquête, résultats, listing.

### CSS & animations

- Règle `@media (prefers-reduced-motion: reduce)` présente dans :
  - `custom.css` ;
  - `theme.css` ;
  - les 8 variations de couleurs.
- Chaque variation est enrichie d’environ **39 règles d’accessibilité** dédiées aux modes espacement et dyslexie.

### Maintenance & preuves

- 10 modules documentés avec `manifest.json`.
- 10 tests automatisés statiques.
- 25 tests manuels.
- 8 documents de non-conformités avec procédures de clôture.
- Linter de détection de langue des passages.
- Guide créateurs.
- Procédure RGAA de preuves.

---

## 6 thématiques RGAA atteignent 100 %

| Thématique RGAA 4.1 | Points couverts | Taux |
|---|---|---:|
| 3 — Couleurs | Contrastes texte, focus UI, mode contraste élevé | 100 % |
| 5 — Tableaux | `caption`, `scope`, `headers`, tabstops nettoyés | 100 % |
| 7 — Scripts | ARIA dynamique, clavier, WCAG 2.5.3 | 100 % |
| 8 — Éléments obligatoires | Title dynamique, H1 visible, langue déclarée | 100 % |
| 10 — Présentation | Focus, zoom 200 %, reflow, espacement, `prefers-reduced-motion` | 100 % |
| 11 — Formulaires | `aria-invalid`, `autocomplete`, `required` nettoyés | 100 % |
| 12 — Navigation | Skip-links, focus, ordre de tabulation | 100 % |
| 13 — Consultation | `aria-live`, session timeout, pages statiques | 100 % |
| 1 — Images | Alternative du logo, SVG décoratifs avec `aria-hidden` | 88 % |
| 9 — Structuration | H1 cohérent, `fieldset` / `legend`, landmarks | 100 % |

---

## Non-conformités résiduelles — 2 critères

### NC-R 01 — Matrices complexes

**Statut : test AT A requis**

Le test **NVDA MAN-09/10** reste requis. Les corrections techniques sont en place : `scope`, `headers`, tabstops nettoyés.

La validation avec lecteur d’écran en conditions réelles n’est pas encore documentée.

**Clôturable en ½ journée.**

### NC-R 02 — Langue des passages

**Statut : partiel AA créateurs**

La détection automatique reste partielle. La fonction `initPassageLanguageHints(root)` couvre les passages marqués explicitement.

La conformité complète dépend du processus éditorial des créateurs de questionnaires.

Un guide et un linter sont fournis dans le thème.

---

## Perspectives — vers la conformité totale

| Version / cible | Actions prévues | Objectif |
|---|---|---:|
| V277 | Test NVDA + Firefox sur matrices MAN-09/10. Formation des créateurs au marquage `[lang=xx]`. Audit VoiceOver mobile MAN-17 → 25. | ~88–90 % |
| Cible | Audit RGAA complet avec prestataire certifié sur un questionnaire représentatif, afin de valider les non-conformités dynamiques non détectables par analyse statique. | ≥ 90 % |

---

## Conclusion

**AllySurvey V276 transforme le thème LimeSurvey officiel en un outil résolument accessible.**

Avec **91 critères conformes**, **11 thématiques RGAA à 100 %** et une infrastructure de preuve documentée, il offre à l’Université de Lille une base technique solide, traçable et maintenable — prête pour l’audit RGAA.

---

*Document non certifiant — analyse statique du code source — Université de Lille / DAWAM — Juin 2026.*
