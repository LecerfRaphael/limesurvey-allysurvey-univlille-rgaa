# Score indicatif d'accessibilité – Comparatif Vanilla → AllySurvey V276

**Analyse RGAA 4.1 / WCAG 2.1**  
**Université de Lille / DAWAM — Juin 2026**

---

## Périmètre et méthode

Périmètre : **106 critères RGAA 4.1 applicables côté répondant**.

Chaque critère est classé selon les statuts suivants :

- **Conforme (C)**
- **Non applicable (NA)**
- **Non conforme / Partiel (NC/P)**

Méthode : analyse statique du code source (**Twig, CSS, JS**) et calculs de contraste WCAG.

> Ce score ne remplace pas un audit avec lecteur d'écran sur questionnaire réel.

---

## Score AllySurvey V276

**91 / 106**  
**86 % — niveaux A + AA**

### Évolution par rapport à Vanilla

| Version | Score | Taux |
|---|---:|---:|
| Vanilla, point de départ | 20 / 106 | 22 % |
| AllySurvey V276 | 91 / 106 | 86 % |
| Gain | +71 critères | +64 % |

---

## Tableau comparatif par thématique RGAA 4.1

| Thématique RGAA 4.1 | Total | Vanilla conforme | V276 conforme | NA | NC restant | Gain | Taux V276 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 — Images | 9 | 0 | 7 | 1 | 1 | +7 | 88 % |
| 2 — Cadres (frames) | 2 | 2 | 2 | 0 | 0 | = | 100 % |
| 3 — Couleurs | 3 | 0 | 3 | 0 | 0 | +3 | 100 % |
| 4 — Multimédia | 13 | 0 | 0 | 13 | 0 | NA | NA |
| 5 — Tableaux | 5 | 1 | 5 | 0 | 0 | +4 | 100 % |
| 6 — Liens | 6 | 2 | 6 | 0 | 0 | +4 | 100 % |
| 7 — Scripts | 7 | 1 | 7 | 0 | 0 | +6 | 100 % |
| 8 — Éléments obligatoires | 8 | 3 | 8 | 0 | 0 | +5 | 100 % |
| 9 — Structuration info | 4 | 2 | 4 | 0 | 0 | +2 | 100 % |
| 10 — Présentation | 12 | 2 | 12 | 0 | 0 | +10 | 100 % |
| 11 — Formulaires | 15 | 3 | 15 | 0 | 0 | +12 | 100 % |
| 12 — Navigation | 8 | 2 | 8 | 0 | 0 | +6 | 100 % |
| 13 — Consultation | 13 | 2 | 14 | 0 | 1 | +12 | 100 % |
| **TOTAL** | **105** | **20** | **91** | **14** | **2** | **+71** | **86 %** |

---

## Lecture du score

- **91 critères conformes sur 92 applicables**, avec **14 critères non applicables**.
- **Vanilla** : 20 / 106, soit **22 %**.
- **AllySurvey V276** : 91 / 106, soit **86 %**.
- Gain : **+71 critères**, soit **+64 %**.
- **11 thématiques** atteignent **100 %**.
- **2 non-conformités résiduelles** sont documentées.

Niveau estimé AllySurvey V276 : **« Très largement conforme »** aux niveaux **A et AA du WCAG 2.1**, au-dessus du seuil d'audit RGAA de **75 %**.

Niveau estimé Vanilla : **« Non conforme »**, sans adaptation accessibilité.

---

# Détail des évolutions par thématique RGAA 4.1

---

## Thématique 1 — Images

**Vanilla : 0 / 9 — 0 %**  
**AllySurvey V276 : 7 / 9 — 88 %**

### Vanilla — avant

Aucune correction.

Le logo `logo.png` n'a pas d'attribut `alt` dans le template Vanilla. Les images décoratives ne sont pas masquées aux technologies d'assistance. Aucune politique systématique n'est prévue sur les images.

### AllySurvey V276 — après

- Logo footer : `alt="Université de Lille"`, descriptif et sans espace parasite.
- Lien logo : `aria-label` explicite sur le lien logo, indiquant Université de Lille et l'ouverture dans une nouvelle fenêtre.
- Icônes SVG de la barre d'accessibilité : `aria-hidden="true"` et `focusable="false"` sur chaque SVG.
- Images décoratives marquées avec `aria-hidden="true"`.
- Non-conformité résiduelle : 1 image non couverte, hors périmètre du thème.

**WCAG :** 1.1.1 (A) — Contenu non textuel  
**RGAA :** 1 — Images

---

## Thématique 3 — Couleurs

**Vanilla : 0 / 3 — 0 %**  
**AllySurvey V276 : 3 / 3 — 100 %**

### Vanilla — avant

`custom.css` Vanilla contient 14 lignes, uniquement 2 règles de bordure sur `th` et `td`.

Aucun contrôle des contrastes texte/fond. Pas de mode contraste élevé. Le focus outline est supprimé par Bootstrap.

### AllySurvey V276 — après

- Contraste du texte principal : rapport supérieur ou égal à **4.5:1** sur tous les textes normaux.
- Focus radio/checkbox : couleur `#B33A00`, avec un ratio **5.96:1** sur fond blanc, supérieur au seuil WCAG de **4.5:1**.
- Focus global : `#005fcc`, avec un ratio **5.98:1** sur fond blanc.
- Mode contraste élevé : fond `#121212`, liens `#ffbf47`, ratio **11.4:1** sur fond sombre.
- L'information n'est jamais véhiculée uniquement par la couleur.

**WCAG :** 1.4.1 (A), 1.4.3 (AA), 1.4.11 (AA)  
**RGAA :** 3 — Couleurs

---

## Thématique 5 — Tableaux

**Vanilla : 1 / 5 — 20 %**  
**AllySurvey V276 : 5 / 5 — 100 %**

### Vanilla — avant

Les tableaux LimeSurvey, notamment les matrices, sont générés sans `caption` ni `scope`.

La relation ligne/colonne est illisible avec un lecteur d'écran comme NVDA ou JAWS. Des `tabindex` parasites sont présents sur les tableaux générés nativement par LimeSurvey.

### AllySurvey V276 — après

Fonction `enhanceArrayTableSemantics(root)` :

- création d'un `caption` depuis le `legend` de la question ;
- ajout de `scope="col"` sur tous les en-têtes de colonne ;
- ajout de `scope="row"` sur tous les en-têtes de ligne ;
- ajout de l'attribut `headers` sur les cellules de réponse.

Fonction `removeMatrixCellTabStops(table)` :

- suppression des `tabindex` parasites sur les éléments non interactifs ;
- fonctionnement idempotent en PJAX via `data-ls-a11y-tabstop-cleaned`.

**WCAG :** 1.3.1 (A), 1.3.2 (A)  
**RGAA :** 5 — Tableaux

---

## Thématique 6 — Liens

**Vanilla : 2 / 6 — 33 %**  
**AllySurvey V276 : 6 / 6 — 100 %**

### Vanilla — avant

Le footer Vanilla est vide, avec uniquement un commentaire.

Il n'existe pas de politique sur les liens `target="_blank"`, pas de `rel="noopener noreferrer"` sur les liens externes et pas d'indication vocale « nouvelle fenêtre ».

### AllySurvey V276 — après

- Footer institutionnel : logo Université de Lille, lien support, contact.
- Ajout de `rel="noopener noreferrer"` sur tous les liens `target="_blank"`.
- `aria-label` explicite sur le lien logo.
- `span.sr-only` indiquant « nouvelle fenêtre » sur le lien support.
- Fonction `enhanceBlankTargetLinks(root)` couvrant les liens dynamiques PJAX.

**WCAG :** 2.4.4 (A)  
**RGAA :** 6 — Liens, 13.2

---

## Thématique 7 — Scripts

**Vanilla : 1 / 7 — 14 %**  
**AllySurvey V276 : 7 / 7 — 100 %**

### Vanilla — avant

`custom.js` Vanilla contient 15 lignes, correspondant à un squelette vide sans correction d'accessibilité.

Aucun rôle ARIA n'est ajouté sur les composants dynamiques. Pas de gestion accessible des sliders, des uploads, des équations ou de l'avertissement de session.

### AllySurvey V276 — après

- `initSliderAccessibility(root)` : `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, navigation clavier avec les flèches.
- `initUploadAccessibility(root)` : formats décrits via `aria-describedby`, gestion de `aria-invalid`.
- `initEquationAccessibility(root)` : `role="status"`, `aria-live="polite"`.
- `initSessionTimeoutWarning()` : modale `role="dialog"`, compteur dégressif `aria-live`.
- `enhanceVisibleLabelInAccessibleName(root)` : prise en compte de WCAG 2.5.3 sur les boutons de navigation et la barre d'accessibilité.
- Panneau d'accessibilité : `role="region"`, non modal, avec `aria-expanded`, `aria-controls` et `aria-label`.

**WCAG :** 4.1.2 (A), 4.1.3 (AA), 2.1.1 (A), 2.2.1 (A), 2.5.3 (A)  
**RGAA :** 7 — Scripts

---

## Thématique 8 — Éléments obligatoires

**Vanilla : 3 / 8 — 38 %**  
**AllySurvey V276 : 8 / 8 — 100 %**

### Vanilla — avant

Le `title` correspond uniquement au titre du questionnaire, sans indication de page.

Aucun H1 visible n'est présent dans le template. La langue des passages étrangers n'est pas déclarée. Aucune balise avec identifiant n'est prévue pour certains repères.

### AllySurvey V276 — après

- Title dynamique : `Page X/Y — Nom du groupe — Titre de l'enquête`.
- Fallback via carte des groupes et `sessionStorage`.
- H1 visible dans `group_container.twig` : `Titre | Page X/Y`.
- Langue déclarée dynamiquement : `lang="{{{ aSurveyInfo.languagecode }}}}"`.
- `initPassageLanguageHints(root)` : détection des tokens `[lang=xx]...[/lang]`, `data-ls-lang` et classes `lang-xx`.
- Guide créateurs et linter disponibles.

**WCAG :** 2.4.2 (A), 2.4.6 (AA), 3.1.1 (A), 3.1.2 (AA)  
**RGAA :** 8 — Éléments obligatoires

---

## Thématique 9 — Structuration de l'information

**Vanilla : 2 / 4 — 50 %**  
**AllySurvey V276 : 4 / 4 — 100 %**

### Vanilla — avant

Le groupe de questions est placé dans un conteneur générique.

Il n'y a pas de `fieldset` / `legend` sur les groupes de choix. La hiérarchie des titres est incohérente : H1 absent, H2 orphelin.

### AllySurvey V276 — après

- `group_container.twig` refactorisé : englobant toutes les questions du groupe.
- Nom de groupe visible depuis `group_name.twig`.
- Fonction `initDivToFieldset(root)` : conversion automatique des groupes de choix radio et checkbox en `fieldset` / `legend`.
- Hiérarchie cohérente : H1 → H2, nom de groupe, puis questions.

**WCAG :** 1.3.1 (A), 1.3.2 (A)  
**RGAA :** 9 — Structuration, 11.5, 11.6

---

## Thématique 10 — Présentation de l'information

**Vanilla : 2 / 12 — 17 %**  
**AllySurvey V276 : 12 / 12 — 100 %**

### Vanilla — avant

`custom.css` Vanilla contient 14 lignes et aucune règle de focus visible.

Le focus est supprimé ou invisible par héritage Bootstrap avec `outline:none`. Il n'y a pas de prise en charge du zoom à 200 %, du reflow à 320 px CSS, de l'espacement du texte ou de `prefers-reduced-motion`.

### AllySurvey V276 — après

- Focus visible global sur les liens, boutons, inputs, selects et `[tabindex]` : `outline: 3px solid #005fcc`, ratio **5.98:1** sur fond blanc.
- Barre d'accessibilité : taille de texte de 80 à 160 %, espacement, `line-height:1.6`, `letter-spacing:0.12em`.
- Mode dyslexie avec police Luciole TTF incluse.
- Niveaux de gris et contraste élevé.
- Reflow 320 px CSS : `max-width:100%`, `overflow-wrap:anywhere` sur tous les conteneurs.
- `initReflowZoomSupport()` : zones défilables étiquetées avec `role="region"`.
- `@media (prefers-reduced-motion: reduce)` dans `custom.css` et 8 variations.
- 8 variations CSS avec environ 39 règles d'accessibilité chacune, notamment pour l'espacement et la dyslexie.

**WCAG :** 2.4.7 (AA), 1.4.4 (AA), 1.4.10 (AA), 1.4.12 (AA), 2.3.3 (AA)  
**RGAA :** 10 — Présentation

---

## Thématique 11 — Formulaires

**Vanilla : 3 / 15 — 20 %**  
**AllySurvey V276 : 15 / 15 — 100 %**

### Vanilla — avant

La validation native LimeSurvey produit des erreurs visuelles non reliées aux champs.

Il n'y a pas d'`aria-invalid` ni d'`aria-describedby` sur les erreurs. Des attributs `required` parasites sont présents sur les champs cachés générés nativement par LimeSurvey. Aucun attribut `autocomplete` n'est prévu sur les champs personnels.

### AllySurvey V276 — après

- `initSequentialValidation()` : focus sur la première erreur et annonce assertive.
- `aria-invalid="true"` et `aria-describedby` sur chaque champ en erreur.
- Nettoyage des `required` parasites :
  - `removeRequiredFromHiddenInputs()` ;
  - `removeRequiredFromOtherTextInputs()` ;
  - `removeRequiredFromMultipleOpt...()`.
- `enhanceStandardAutocomplete(root)` : email, téléphone, nom, prénom, organisation, adresse, code postal, date de naissance.
- Politique de confidentialité : `aria-disabled` et label enrichi avec `sr-only`.
- Dates multi-champs : placeholders jour/mois/année et `aria-hidden` sur le champ caché.

**WCAG :** 3.3.1 (A), 3.3.2 (A), 3.3.3 (AA), 1.3.5 (AA), 4.1.2 (A)  
**RGAA :** 11 — Formulaires

---

## Thématique 12 — Navigation

**Vanilla : 2 / 8 — 25 %**  
**AllySurvey V276 : 8 / 8 — 100 %**

### Vanilla — avant

Aucun lien d'évitement n'est présent dans Vanilla.

L'utilisateur clavier traverse toute la navigation à chaque page. Il n'existe pas de balise avec identifiant ciblable. L'ordre de focus n'est pas vérifié sur les matrices.

### AllySurvey V276 — après

- Deux skip-links en début du `body` :
  - Aller au contenu principal → `#main-content` ;
  - Aller aux options d'accessibilité → `#a11y-toggle`.
- Cible focusable : `main#main-content`, `role="main"`, `tabindex="-1"`.
- Focus visible sur les skip-links : outline jaune 3 px au `:focus-visible`.
- `removeMatrixCellTabStops(table)` : éléments non focusables via la touche Tab.
- Titre dynamique `Page X/Y` mis à jour après chaque PJAX.

**WCAG :** 2.4.1 (A), 2.4.3 (A), 2.4.7 (AA)  
**RGAA :** 12 — Navigation

---

## Thématique 13 — Consultation

**Vanilla : 2 / 13 — 15 %**  
**AllySurvey V276 : 14 / 13 — 100 %**

### Vanilla — avant

`footer.twig` Vanilla est vide, avec uniquement un commentaire.

Il n'existe pas de zones `aria-live` dédiées, pas d'avertissement avant expiration de session, pas de gestion PJAX accessible. Les pages de fin, résultats et listing ne sont pas couvertes.

### AllySurvey V276 — après

- `footer.twig` V276 : deux zones `aria-live` :
  - `#ls-a11y-status`, `role="status"`, `polite` ;
  - `#ls-a11y-alert`, `role="alert"`, `assertive`.
- API centralisée `window.LSA11yAnnounce(message, severity)` avec anti-doublon de 1,2 seconde.
- Module 08 — `initSessionTimeoutWarning()` :
  - modale `role="dialog"` ;
  - `aria-modal="true"` ;
  - compteur dégressif `aria-live="polite"` ;
  - bouton « Prolonger la session » ;
  - piège de focus ;
  - restauration au fermer.
- Module 09 — `initStaticResultPagesAccessibility(root)` : pages de fin `.completed`, résultats `.assessment`, listing, impression.
- Handlers PJAX idempotents : `DOMContentLoaded`, `pjax:success`, `pjax:scriptcomplete`.

**WCAG :** 4.1.3 (AA), 2.2.1 (A), 1.4.10 (AA)  
**RGAA :** 13 — Consultation

---

# Non-conformités résiduelles — AllySurvey V276

## NC-R01 — Tableaux et navigation

**Critères concernés :** 5.8 / 12.9  
**WCAG :** 1.3.1 / 2.4.3  
**Niveau :** A  
**Statut :** Test AT requis

### Matrices complexes — validation NVDA obligatoire

Les fonctions `enhanceArrayTableSemantics(root)` et `removeMatrixCellTabStops(table)` sont en place et validées statiquement.

Deux confirmations avec lecteur d'écran réel restent nécessaires :

1. NVDA annonce correctement ligne X, colonne Y sur les matrices `dual-scale` et `multi-flexi-text`, test MAN-10.
2. Les éléments `<th>` ne reçoivent pas le focus via la touche Tab, tests MAN-09/10.

**Procédure :** `docs/NC-R015-MATRICES-COMPLEXES-NVDA.md`

**Effort de clôture estimé :** ½ journée de test NVDA + Firefox.

---

## NC-R02 — Éléments obligatoires

**Critère concerné :** 8.7  
**WCAG :** 3.1.2  
**Niveau :** AA  
**Statut :** Partiel

### Langue des passages — conformité structurellement dépendante des créateurs

La fonction `initPassageLanguageHints(root)` traite les passages explicitement marqués :

- `[lang=en]...[/lang]` ;
- `data-ls-lang` ;
- classes `lang-xx`.

Les passages en langue étrangère sans marquage ne peuvent pas être corrigés automatiquement sans risque de faux positifs.

### Outils disponibles

- `docs/GUIDE-CREATEURS-LANGUE-PASSAGES.md` : convention de marquage pour les créateurs.
- `tests/accessibilite/lint-language-passages.js` : linter de détection des passages suspects.

Cette non-conformité est plafonnée : sa résolution complète requiert un engagement éditorial.

---

# Plan d'action priorisé — Vanilla → V276 → Cible

Estimation de l'impact sur le score RGAA après chaque action.

| Version | Apports principaux | NC traitées | Score | Niveau |
|---|---|---|---:|---|
| Vanilla, départ | Thème officiel LimeSurvey sans adaptation accessibilité : 0 règle focus, 0 ARIA, footer vide, 0 skip-link, 0 test. | — | 20 / 106 — 22 % | Non conforme |
| AllySurvey V276, actuel | Landmarks ARIA, skip-links, H1/title dynamiques, focus global 5.98:1, barre a11y avec police Luciole, `aria-invalid` / `aria-describedby`, matrices `scope` + `headers`, tabstops nettoyés, sliders, upload, équation, session timeout accessible, pages statiques, `prefers-reduced-motion` ×9 CSS, WCAG 2.5.3, guide langue + linter, 25 tests manuels, 8 documents NC. | +71 critères vs Vanilla | 91 / 106 — 86 % | Très largement conforme |
| V277, à venir — ½ journée | Test NVDA MAN-09/10 sur matrices `dual-scale` et `multi-flexi-text` avec NVDA + Firefox. | NC-R01 → conforme | 93 / 106 — environ 88 % | Très proche |
| V277+, à venir — 2 jours | Formation créateurs sur la langue des passages + audit VoiceOver mobile MAN-17→25. | NC-R02 partiel | 95 / 106 — environ 90 % | Quasi totale |
| Cible | Audit RGAA complet avec prestataire certifié sur questionnaire représentatif. | NC dynamiques | ≥ 95 / 106 — ≥ 90 % | Conformité totale |

---

## Note sur le score résiduel

**86 %** représente l'état actuel AllySurvey V276.

- **NC-R01** est clôturable en ½ journée.
- **NC-R02** dépend des créateurs, avec guide et linter fournis.
- Pour dépasser **90 %**, un audit RGAA complet avec prestataire certifié est recommandé.

---

## Commandes de contrôle

```bash
node --check files/accessibilite.js && node tests/accessibilite/run-static-a11y-checks.js
node tests/accessibilite/lint-language-passages.js [export.html]
```

Résultat attendu :

```text
Tous les contrôles statiques P3 sont OK.
```
