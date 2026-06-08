# README complet des modifications — Thème LimeSurvey accessible RGAA/WCAG

**Archive concernée :** `ModDev-RGAA-V250-UnivLille2-standalone.zip`  
**Projet :** Thème LimeSurvey autonome basé sur Fruity, enrichi pour l’accessibilité numérique  
**Contexte :** Université de Lille — amélioration RGAA/WCAG du thème LimeSurvey  
**Version documentaire :** 2026-06-04  

---

## 1. Objectif général

Ce thème LimeSurvey a été enrichi afin d’améliorer l’accessibilité du questionnaire côté utilisateur final, en particulier pour :

- la navigation clavier ;
- les lecteurs d’écran comme NVDA, JAWS ou VoiceOver ;
- les personnes utilisant le zoom navigateur ;
- les personnes ayant besoin d’un meilleur contraste, d’un espacement renforcé ou d’une interface plus lisible ;
- les formulaires complexes LimeSurvey : questions obligatoires, matrices, tableaux, listes déroulantes, dates, classements, commentaires, options « Autre ».

Les corrections suivent une logique de conformité avec les référentiels **RGAA 4.1** et **WCAG 2.1 niveaux A et AA**, tout en tenant compte du fonctionnement spécifique de LimeSurvey : templates Twig, rechargements PJAX, bootstrap-select, types de questions multiples et thème Fruity.

---

## 2. Principe technique retenu

Le thème conserve un fonctionnement compatible LimeSurvey :

- le fichier principal `files/accessibilite.js` reste le **bundle JavaScript chargé par LimeSurvey** ;
- les corrections sont conçues pour fonctionner au chargement initial et après navigation PJAX ;
- les ajouts sont idempotents : ils évitent les doublons d’écouteurs, d’attributs ARIA ou d’annonces ;
- une documentation modulaire a été ajoutée dans `files/a11y-modules/` pour faciliter la maintenance ;
- une matrice de tests automatisés et manuels a été ajoutée dans `tests/accessibilite/` ;
- une procédure de preuves RGAA a été ajoutée dans `docs/`.

Le choix important est donc : **un bundle unique pour la compatibilité LimeSurvey, une documentation modulaire pour la maintenance.**

---

## 3. Structure des principaux fichiers modifiés

### Fichiers Twig

- `views/layout_global.twig`
- `views/subviews/footer/footer.twig`
- `views/subviews/header/head.twig`
- `views/subviews/header/custom_header.twig`
- `views/subviews/survey/group_subviews/group_container.twig`
- `views/subviews/survey/group_subviews/group_name.twig`

### Fichiers JavaScript

- `files/accessibilite.js`
- `scripts/custom.js`

### Fichiers CSS

- `css/custom.css`
- `css/theme.css`
- `css/variations/apple_blossom.css`
- autres variations CSS Fruity lorsque nécessaire

### Documentation et tests ajoutés

- `files/a11y-modules/README.md`
- `files/a11y-modules/manifest.json`
- `files/a11y-modules/*.js`
- `tests/accessibilite/run-static-a11y-checks.js`
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv`
- `tests/accessibilite/README.md`
- `docs/PROCEDURE-PREUVES-CONFORMITE-RGAA.md`

---

## 4. Correctifs de base présents dans l’archive

### 4.1 Thème autonome Fruity / Vanilla

**Objectif :** rendre le thème plus autonome en intégrant les éléments Fruity nécessaires.

Corrections :

- intégration des fichiers du thème Fruity dans le package ;
- application des fichiers personnalisés V225 par-dessus Fruity ;
- modification de `config.xml` ;
- remplacement de l’héritage `fruity` par `vanilla` ;
- ajout forcé de la classe CSS `fruity` sur le `<body>` ;
- correction du chemin de chargement de `files/accessibilite.js` via `templateResourceUrl()`.

Bénéfice :

- installation plus fiable ;
- moins de dépendance au thème Fruity installé séparément ;
- conservation du rendu Fruity grâce à la classe CSS `fruity`.

---

### 4.2 Titre dynamique RGAA et affichage H1

**Références :** RGAA 8.5, 8.6 / WCAG 2.4.2

Objectif : rendre la page plus identifiable pour les onglets, l’historique navigateur et les lecteurs d’écran.

Format retenu pour le `<title>` :

```text
Page X / Y – Nom court du groupe – Titre du questionnaire
```

Exemple :

```text
Page 2 / 5 – Informations personnelles – Enquête qualité de service
```

Corrections :

- génération dynamique du titre depuis les informations LimeSurvey ;
- utilisation des données de progression `aSurveyInfo.progress.currentstep` et `aSurveyInfo.progress.total` ;
- fallback via carte des groupes et sessionStorage si nécessaire ;
- mise à jour après événements PJAX ;
- correction du calcul lorsque l’index des questions est désactivé ;
- correction du décalage de page lorsque `currentstep` est fourni en base 0 ;
- conservation du H1 visible au format :

```text
Titre du questionnaire | Page X / Y
```

Bénéfice :

- meilleure orientation dans les onglets ;
- annonce plus claire par lecteur d’écran ;
- cohérence entre H1, groupe courant et titre navigateur.

---

### 4.3 Correction du H1 et du conteneur de groupe

Problème constaté :

- le H1 et le groupe pouvaient s’afficher en colonne ou avec un mauvais alignement à cause d’un conteneur racine mal structuré.

Corrections :

- `group_container.twig` renvoie maintenant un conteneur racine cohérent ;
- le H1 et le `fieldset` sont placés dans le même conteneur ;
- le `legend` du groupe est conservé ;
- `css/custom.css` force un empilement vertical propre.

Bénéfice :

- structure visuelle plus stable ;
- lecture logique du questionnaire ;
- meilleure compatibilité avec les règles de structure RGAA.

---

### 4.4 Correction de l’erreur Twig `Filter "e" is not allowed`

Problème : certaines configurations LimeSurvey refusent le filtre Twig `|e`.

Corrections :

- suppression des usages problématiques du filtre `|e` dans les templates concernés ;
- conservation des données nécessaires dans des éléments cachés lus côté JavaScript ;
- maintien du titre dynamique sans provoquer d’erreur 500.

Bénéfice :

- meilleure compatibilité avec les restrictions de sécurité de LimeSurvey ;
- installation plus robuste.

---

### 4.5 Correction des listes déroulantes de classement

Problème : dans certaines questions de classement, un choix effectué sur une ligne pouvait être enregistré ou affiché sur une autre ligne.

Corrections :

- interception des changements de `select` de classement ;
- synchronisation de la valeur avec la bonne ligne ;
- synchronisation avec les champs internes `java*` ;
- maintien de l’anti-doublon entre les rangs ;
- prévention des changements récursifs déclenchés par le comportement natif LimeSurvey.

Bénéfice :

- réponse enregistrée sur la bonne ligne ;
- meilleure fiabilité des questions de classement ;
- interaction clavier plus sûre.

---

### 4.6 Conservation du moteur de recherche des listes déroulantes

Problème : un ancien bloc JavaScript restaurait trop systématiquement les `select` natifs et supprimait parfois le moteur de recherche de `bootstrap-select`.

Corrections :

- suppression du bloc problématique dans `scripts/custom.js` ;
- conservation de `bootstrap-select` lorsqu’un `select` possède `data-live-search="true"` ;
- restauration en select natif accessible uniquement lorsque c’est pertinent.

Bénéfice :

- les listes déroulantes avec recherche conservent leur moteur de recherche ;
- les listes sans recherche restent accessibles.

---

## 5. Correctifs P1 — Priorité haute

### 5.1 Lien d’évitement vers le contenu principal

**Références :** RGAA 12 / WCAG 2.4.1, 2.4.3

Problème : le lien « Aller au contenu principal » pointait vers `#main-content`, mais la balise `<main>` ne possédait pas cet identifiant.

Correction :

```html
<main id="main-content" role="main" tabindex="-1">
```

Ajout CSS :

- focus visible sur `#main-content` ;
- renforcement du focus en mode contraste.

Fichiers :

- `views/layout_global.twig`
- `css/custom.css`

Bénéfice :

- accès clavier direct au questionnaire ;
- meilleure orientation pour lecteur d’écran ;
- contournement efficace des blocs d’en-tête.

---

### 5.2 Sémantique du panneau accessibilité

**Références :** WCAG 2.1.1, 2.1.2, 4.1.2

Problème : le panneau utilisait `role="dialog"` avec `aria-modal="false"`, tout en appliquant un piège de focus.

Choix retenu : **panneau non modal**.

Corrections :

- remplacement de `role="dialog"` par `role="region"` ;
- suppression de `aria-modal="false"` ;
- suppression de `aria-haspopup="dialog"` sur le bouton d’ouverture ;
- suppression du piège de focus `Tab / Shift+Tab` ;
- conservation de `aria-expanded` et `aria-hidden` ;
- fermeture toujours possible avec `Échap` et clic extérieur.

Fichiers :

- `views/layout_global.twig`
- `views/subviews/footer/footer.twig`

Bénéfice :

- navigation clavier libre ;
- annonce plus claire par NVDA/JAWS ;
- réduction du risque de piège clavier.

---

### 5.3 Handlers JavaScript et PJAX idempotents

**Références :** RGAA 7 / WCAG 2.1.1, 2.1.2, 4.1.2, 4.1.3

Problème : plusieurs fonctions ajoutaient des écouteurs à chaque rechargement PJAX.

Corrections :

- ajout de flags globaux ;
- ajout de flags par élément via `dataset` ;
- délégations jQuery nommées avec `.off().on()` ;
- correction du verrou de politique de confidentialité ;
- correction des validations séquentielles ;
- correction du script `GreyOutSelected` ;
- centralisation du boot `DOMContentLoaded`, `pjax:success`, `pjax:complete`, `pjax:scriptcomplete`.

Fichiers :

- `files/accessibilite.js`
- `scripts/custom.js`
- `views/subviews/footer/footer.twig`
- `views/subviews/header/custom_header.twig`

Bénéfice :

- pas de double alerte ;
- pas de double validation ;
- comportement stable après plusieurs changements de page ou groupe.

---

### 5.4 Messages d’erreur reliés aux champs

**Références :** RGAA 11 / WCAG 3.3.1, 3.3.2, 3.3.3

Problème : les messages d’erreur visuels et `aria-live` existaient, mais n’étaient pas toujours reliés au champ fautif.

Corrections :

- création d’un identifiant unique pour chaque message d’erreur ;
- ajout de cet identifiant dans `aria-describedby` du champ concerné ;
- ajout de `aria-invalid="true"` en cas d’erreur ;
- retour à `aria-invalid="false"` après correction ;
- suppression uniquement de l’identifiant d’erreur, sans écraser les autres aides déjà présentes.

Cas couverts :

- champs texte ;
- textarea ;
- select ;
- dates jour/mois/année ;
- groupes radio ;
- tableaux radio par ligne ;
- checkbox multiple-opt ;
- multiple-opt-comments ;
- politique de confidentialité.

Fichiers :

- `files/accessibilite.js`
- `scripts/custom.js`

Bénéfice :

- l’utilisateur sait précisément quel champ corriger ;
- le lecteur d’écran annonce l’erreur depuis le champ concerné.

---

### 5.5 Focus visible global

**Références :** RGAA 10 / WCAG 2.4.7, 1.4.11

Problème : `theme.css` contenait encore des règles supprimant le focus visible, notamment `outline:none`.

Corrections :

- neutralisation des suppressions de focus ;
- ajout d’un focus visible global ;
- focus renforcé sur liens, boutons, champs, éléments `tabindex`, radios, checkboxes, `summary`, bootstrap-select ;
- adaptation en mode contraste avec contour jaune `#ffbf47`.

Fichiers :

- `css/theme.css`
- `css/custom.css`
- `css/variations/*.css`

Bénéfice :

- navigation clavier plus fiable ;
- repérage visuel systématique ;
- conformité renforcée avec WCAG 2.4.7.

---

### 5.6 Titre de page pertinent et dynamique

**Références :** RGAA 8.5, 8.6 / WCAG 2.4.2

Correction consolidée :

```text
Page X / Y – Nom court du groupe – Titre du questionnaire
```

Ajouts :

- nom court du groupe courant ;
- titre de l’enquête conservé ;
- mise à jour après PJAX ;
- synchronisation de `og:title` et `twitter:title` lorsque présents ;
- tronquage propre des titres de groupe trop longs.

Fichier :

- `scripts/custom.js`

Bénéfice :

- meilleur repérage dans les onglets, l’historique et les lecteurs d’écran.

---

## 6. Correctifs P2 — Améliorations complémentaires

### 6.1 Tableaux de questions et matrices

**Références :** RGAA 5 / WCAG 1.3.1, 1.3.2

Problème : les matrices LimeSurvey peuvent être lisibles visuellement mais difficiles à comprendre avec un lecteur d’écran lorsque les cellules ne sont pas explicitement associées aux en-têtes.

Correction principale :

```text
enhanceArrayTableSemantics(root)
```

Actions réalisées :

- ajout d’un `<caption>` accessible ;
- transformation de cellules en `<th>` si nécessaire ;
- ajout de `scope="col"`, `scope="colgroup"`, `scope="row"` ;
- création d’identifiants stables pour les en-têtes ;
- ajout de `headers` sur les cellules de réponse ;
- ajout des en-têtes dans `aria-describedby` des champs interactifs ;
- exécution au chargement initial et après PJAX ;
- prévention des doublons.

Types ciblés :

- `array-flexible-row` ;
- `array-flexible-column` ;
- `array-flexible-dual-scale` ;
- `array-multi-flexi` ;
- `array-multi-flexi-text` ;
- `array-5-pt` ;
- `array-10-pt` ;
- variantes Oui / Non / Incertitude.

Fichiers :

- `files/accessibilite.js`
- `css/custom.css`

Bénéfice :

- meilleure compréhension ligne/colonne ;
- navigation plus fiable avec NVDA, JAWS ou VoiceOver.

---

### 6.2 Objectif des champs utilisateur — autocomplete

**Référence :** WCAG 1.3.5 AA

Objectif : ajouter automatiquement `autocomplete` lorsque le champ correspond à une donnée personnelle standard.

Correction principale :

```text
enhanceStandardAutocomplete(root)
```

Détection à partir de :

- `id` ;
- `name` ;
- `placeholder` ;
- `aria-label` ;
- `title` ;
- label associé ;
- libellé de ligne ;
- titre de question LimeSurvey.

Tokens ajoutés selon contexte :

- `name` ;
- `given-name` ;
- `family-name` ;
- `honorific-prefix` ;
- `email` ;
- `tel` ;
- `street-address` ;
- `address-line1` ;
- `address-line2` ;
- `postal-code` ;
- `address-level1` ;
- `address-level2` ;
- `country-name` ;
- `organization` ;
- `organization-title` ;
- `bday` ;
- `bday-day` ;
- `bday-month` ;
- `bday-year`.

Garde-fous :

- pas d’ajout sur radio, checkbox, hidden ;
- pas d’ajout sur champs `disabled` ou `readonly` ;
- exclusion des champs « Autre » ;
- exclusion des commentaires libres, remarques, captcha, recherche et mots de passe ;
- conservation des `autocomplete` existants pertinents.

Fichier :

- `files/accessibilite.js`

Bénéfice :

- aide à la saisie ;
- meilleure expérience mobile ;
- soutien aux personnes avec troubles cognitifs.

---

### 6.3 Reflow, zoom et espacement du texte

**Références :** WCAG 1.4.4, 1.4.10, 1.4.12

Objectif : garantir l’usage du questionnaire à 200 % de zoom navigateur, en largeur 320 px CSS et avec espacement texte renforcé.

Corrections CSS :

- meilleure tenue à 200 % de zoom ;
- limitation des débordements horizontaux globaux ;
- retour à la ligne des boutons, libellés, titres et aides ;
- panneau accessibilité scrollable verticalement ;
- matrices plus lisibles en petit écran ;
- transformation visuelle de certaines matrices en cartes à faible largeur.

Corrections JavaScript :

```text
initReflowZoomSupport(root)
```

Actions :

- détection des wrappers de tableaux ;
- ajout d’un focus clavier sur les zones réellement défilables horizontalement ;
- ajout de `role="region"` et d’un `aria-label` descriptif uniquement si un dépassement existe ;
- recalcul après PJAX et redimensionnement.

Espacement texte renforcé :

- `line-height: 1.6` ;
- `letter-spacing: 0.12em` ;
- `word-spacing: 0.16em` ;
- espacement augmenté entre paragraphes, aides et blocs de questions.

Fichiers :

- `css/custom.css`
- `files/accessibilite.js`

Bénéfice :

- moins de défilement horizontal ;
- meilleure lisibilité mobile ;
- aucune perte de fonction en zoom fort.

---

### 6.4 Liens en nouvelle fenêtre

**Références :** RGAA 6 / WCAG 2.4.4

Problème : des liens `target="_blank"` existaient dans le footer avec annonce partielle et sans `rel` sécurisé.

Corrections :

- ajout de `rel="noopener noreferrer"` ;
- harmonisation de l’indication « nouvelle fenêtre » ;
- ajout d’une correction générique côté JavaScript pour les liens ajoutés dynamiquement.

Fonction :

```text
enhanceBlankTargetLinks(root)
```

Fichiers :

- `views/layout_global.twig`
- `files/accessibilite.js`

Bénéfice :

- meilleure sécurité ;
- annonce cohérente pour lecteur d’écran ;
- liens dynamiques également sécurisés.

---

### 6.5 Messages de statut centralisés

**Référence :** WCAG 4.1.3 AA

Problème : plusieurs zones `aria-live` pouvaient provoquer des annonces concurrentes ou répétées.

Choix retenu :

```text
1 zone centrale role="status" pour les informations
1 zone centrale role="alert" pour les erreurs bloquantes
```

Corrections :

- remplacement de l’ancien `#aria-live-message` ;
- création de `#ls-a11y-status` ;
- création de `#ls-a11y-alert` ;
- centralisation via `window.LSA11yAnnounce()` ;
- anti-doublon pour éviter les répétitions ;
- suppression des `aria-live` locaux concurrents ;
- conservation des messages visuels reliés par `aria-describedby`.

Fichiers :

- `views/subviews/footer/footer.twig`
- `views/layout_global.twig`
- `files/accessibilite.js`
- `scripts/custom.js`
- `css/custom.css`

Bénéfice :

- annonces plus propres ;
- moins de verbosité ;
- distinction claire entre information et erreur.

---

## 7. Correctif P3 — Maintenance et preuves de conformité

### 7.1 Modularisation documentaire

**Objectif :** rendre `accessibilite.js` plus maintenable sans casser le chargement LimeSurvey.

Choix technique :

- conservation de `files/accessibilite.js` comme bundle unique ;
- ajout d’un registre `window.LSA11yMaintenance` ;
- ajout d’un dossier documentaire `files/a11y-modules/` ;
- ajout d’un manifeste `manifest.json`.

Familles documentées :

1. Socle transversal : messages de statut, liens nouvelle fenêtre, délégations communes.
2. Structure et champs obligatoires.
3. Autocomplete et données personnelles.
4. Questions standard : dates, Autre, commentaires, radios, checkboxes.
5. Tableaux et matrices.
6. Reflow, focus et selects.
7. Questions de classement.
8. Observers PJAX et validation séquentielle.

Bénéfice :

- meilleure lisibilité technique ;
- identification plus rapide des zones à maintenir ;
- meilleure capacité à adapter le thème lors d’une mise à jour LimeSurvey.

---

### 7.2 Matrice de tests automatisés et manuels

Nouveaux fichiers :

- `tests/accessibilite/run-static-a11y-checks.js`
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv`
- `tests/accessibilite/README.md`

Tests automatisés statiques inclus :

- présence du registre `window.LSA11yMaintenance` ;
- contrôle des liens `target="_blank"` ;
- présence des helpers d’erreurs ARIA ;
- présence de la correction autocomplete ;
- présence de la correction matrices ;
- présence du support reflow ;
- présence de la correction classement ;
- contrôle syntaxique JavaScript.

Tests manuels recommandés :

- lien d’évitement ;
- panneau accessibilité ;
- erreurs de champs ;
- radio/checkbox obligatoires ;
- champs nom/email/téléphone/adresse ;
- dates ;
- option « Autre » ;
- matrices simples et dual-scale ;
- zoom navigateur 200 % ;
- largeur 320 px CSS ;
- espacement texte WCAG ;
- question classement ;
- navigation PJAX ;
- titre dynamique.

Bénéfice :

- production plus simple de preuves d’audit ;
- non-régression plus facile à vérifier ;
- méthode durable pour les futures versions LimeSurvey.

---

### 7.3 Procédure de preuves RGAA

Nouveau fichier :

- `docs/PROCEDURE-PREUVES-CONFORMITE-RGAA.md`

La procédure recommande de conserver, pour chaque test :

- identifiant du test ;
- date ;
- version LimeSurvey ;
- navigateur et version ;
- lecteur d’écran et version ;
- capture écran ou extrait inspecteur ;
- résultat : conforme, à surveiller ou non conforme ;
- commentaire correctif si besoin.

Bénéfice :

- démarche d’audit plus structurée ;
- traçabilité des corrections ;
- preuves plus faciles à communiquer.

---

## 8. Commandes de contrôle recommandées

Depuis la racine du thème, exécuter :

```bash
node --check files/accessibilite.js
node --check scripts/custom.js
node tests/accessibilite/run-static-a11y-checks.js
```

Résultat attendu :

```text
Tous les contrôles statiques P3 sont OK.
```

Contrôle de l’archive :

```bash
unzip -t ModDev-RGAA-V225-UnivLille2-standalone-P3-maintenance-preuves-conformite.zip
```

---

## 9. Tests manuels prioritaires après installation

Après import du thème dans LimeSurvey, il est recommandé de tester au minimum :

1. **Cache** : vider le cache assets/runtime LimeSurvey et le cache navigateur.
2. **Page d’accueil enquête** : vérifier le chargement du thème et de la micro-barre.
3. **Lien d’évitement** : `Tab`, puis activation de « Aller au contenu principal ».
4. **Navigation groupe par groupe** : vérifier `Page X / Y`, H1 et `<title>`.
5. **PJAX** : aller/retour entre plusieurs groupes sans double alerte ni double validation.
6. **Champs obligatoires** : vérifier `aria-invalid` et `aria-describedby`.
7. **Radio/checkbox obligatoires** : vérifier association de l’erreur au groupe.
8. **Question date** : vérifier jour/mois/année complet et incomplet.
9. **Question avec Autre** : vérifier activation/désactivation du champ complémentaire.
10. **Question classement** : vérifier que la sélection reste sur la bonne ligne.
11. **Matrices** : tester au moins une matrice radio, une dual-scale et une matrice texte.
12. **Zoom 200 %** : vérifier absence de perte de fonction.
13. **Largeur 320 px CSS** : vérifier le reflow et les tableaux.
14. **Espacement texte** : activer l’option et vérifier absence de chevauchement.
15. **Liens footer** : vérifier indication « nouvelle fenêtre » et `rel` sécurisé.
16. **Lecteur d’écran** : tester avec NVDA + Firefox ou NVDA + Chrome.

---

## 10. Points de vigilance

Même avec ces corrections, certains points doivent rester surveillés :

- les types de questions LimeSurvey évoluent selon les versions ;
- les classes CSS et structures DOM générées par LimeSurvey peuvent changer ;
- les matrices complexes doivent toujours être testées manuellement ;
- les questions importées depuis d’anciens questionnaires peuvent avoir des libellés inattendus ;
- les personnalisations locales du thème peuvent réintroduire des suppressions de focus ou des `aria-live` concurrents ;
- le back-office LimeSurvey n’est pas couvert par ces corrections : elles concernent le thème côté répondant.

---

## 11. Résumé des bénéfices utilisateur

Les modifications apportées améliorent :

- l’accès direct au questionnaire ;
- la cohérence de la navigation clavier ;
- la visibilité du focus ;
- la compréhension des erreurs ;
- la compréhension des matrices ;
- la lisibilité au zoom et sur mobile ;
- les annonces lecteur d’écran ;
- la sécurité et l’annonce des liens ouvrant une nouvelle fenêtre ;
- la maintenabilité du thème ;
- la capacité à produire des preuves d’audit RGAA/WCAG.

---

## 12. Liste des README de correction déjà présents

L’archive contient aussi les fichiers de suivi unitaires suivants :

- `README-INSTALLATION.txt`
- `README-TITRE-DYNAMIQUE-RGAA.txt`
- `README-CORRECTION-AFFICHAGE-H1.txt`
- `README-CORRECTION-CLASSEMENT-SELECT-LIGNE.txt`
- `README-CORRECTION-DECALAGE-PAGE.txt`
- `README-CORRECTION-ERREUR-500-FILTRE-E.txt`
- `README-CORRECTION-H1-PAGE-TOTAL.txt`
- `README-CORRECTION-MOTEUR-RECHERCHE.txt`
- `README-CORRECTION-PAGE-TOTAL-SANS-INDEX.txt`
- `README-CORRECTION-TITLE-DYNAMIQUE.txt`
- `README-CORRECTION-TITLE-H1-SANS-INDEX.txt`
- `README-CORRECTION-P1-LIEN-EVITEMENT-MAIN-CONTENT.txt`
- `README-CORRECTION-P1-PANNEAU-ACCESSIBILITE-NON-MODAL.txt`
- `README-CORRECTION-P1-HANDLERS-JS-PJAX-IDEMPOTENTS.txt`
- `README-CORRECTION-P1-MESSAGES-ERREUR-ARIA-DESCRIBEDBY.txt`
- `README-CORRECTION-P1-FOCUS-VISIBLE-GLOBAL.txt`
- `README-CORRECTION-P1-TITLE-PAGE-GROUPE-DYNAMIQUE.txt`
- `README-CORRECTION-P2-TABLEAUX-MATRICES-RGAA5.txt`
- `README-CORRECTION-P2-AUTOCOMPLETE-CHAMPS-PERSONNELS.txt`
- `README-CORRECTION-P2-REFLOW-ZOOM-ESPACEMENT-TEXTE.txt`
- `README-CORRECTION-P2-LIENS-NOUVELLE-FENETRE.txt`
- `README-CORRECTION-P2-MESSAGES-STATUT-CENTRALISES.txt`
- `README-CORRECTION-P3-MAINTENANCE-PREUVES-CONFORMITE.txt`

Ce README global sert de synthèse consolidée de l’ensemble.

---

## 13. Recommandation finale d’installation

Après installation ou remplacement du thème :

1. Importer l’archive ZIP dans LimeSurvey.
2. Sélectionner le thème pour le questionnaire concerné.
3. Réinitialiser les options du thème si d’anciens paramètres restent en cache.
4. Vider le cache LimeSurvey : assets/runtime.
5. Vider le cache navigateur.
6. Tester un questionnaire représentatif contenant : texte court, texte long, radio, checkbox, date, liste déroulante, matrice, classement, page avec politique de confidentialité.
7. Exécuter les tests de la matrice `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.

---

## 14. Conclusion

Cette version apporte une consolidation importante du thème LimeSurvey accessible : elle corrige des points P1 bloquants, renforce plusieurs points P2 liés à la compréhension et au confort d’usage, puis ajoute une couche P3 destinée à maintenir le projet dans la durée.

Elle ne remplace pas un audit RGAA complet sur un questionnaire réel, mais elle fournit une base technique plus robuste, plus documentée et plus facilement vérifiable.
