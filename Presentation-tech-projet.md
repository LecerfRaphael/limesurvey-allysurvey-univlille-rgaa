# ♿ Présentation technique du projet AllySurvey V2.76+

<p align="center">
  <strong>Thème LimeSurvey accessible RGAA/WCAG — Université de Lille</strong><br>
  Direction du numérique — Service DAWAM<br>
  Version documentaire mise à jour le 08/06/2026
</p>

<p align="center">
  ♿ Accessibilité numérique • 🧭 Navigation clavier • 🔊 Lecteurs d’écran • 🎨 Contrastes • 📱 Mobile • 🧩 Formulaires complexes LimeSurvey
</p>

---

## 📌 1. Objet du document

Ce document présente la mise à jour technique du projet **AllySurvey V2.76+**, thème LimeSurvey accessible développé pour améliorer l’expérience des répondants et renforcer la conformité aux bonnes pratiques **RGAA 4.1** et **WCAG 2.1 niveaux A et AA**.

Il reprend et actualise les améliorations précédemment documentées, en intégrant les évolutions de la version 2.76+ :

- passage confirmé sur une base **Vanilla** ;
- amélioration de la structure sémantique ;
- renforcement de la navigation clavier ;
- meilleure gestion des champs obligatoires ;
- correction des questions conditionnelles ;
- amélioration des messages accessibles ;
- ajout d’une barre d’accessibilité utilisateur ;
- documentation technique des modules ;
- mise en place d’une logique de tests et de non-régression.

---

## 🏛️ 2. Contexte général du projet

L’accessibilité numérique est un enjeu majeur pour garantir l’inclusion de tous les utilisateurs, y compris les personnes en situation de handicap.

Dans le cadre de l’amélioration continue des questionnaires LimeSurvey à l’Université de Lille, le thème **AllySurvey** a été conçu pour rendre les questionnaires :

- 🧠 plus compréhensibles ;
- ♿ plus accessibles ;
- 🧭 plus simples à parcourir au clavier ;
- 🔊 mieux annoncés par les lecteurs d’écran ;
- 🎨 plus lisibles visuellement ;
- 🧩 plus robustes sur les formulaires complexes ;
- 📱 plus confortables sur mobile et tablette.

Ce projet est porté par la **Direction du numérique — Service DAWAM de l’Université de Lille**, avec une logique de mutualisation auprès de la communauté enseignement supérieur / recherche et des membres de l’**APRANESR**.

---

## 🧩 3. Identité technique du thème

| Élément | Information |
|---|---|
| Nom du thème | `RGAA-V276-UnivLille-AllySurvey` |
| Nom d’usage | AllySurvey V2.76+ |
| Application cible | LimeSurvey |
| Type | Thème de questionnaire |
| Version LimeSurvey cible | 6.x |
| Compatibilité manifeste | 6.0+ |
| Thème parent | Vanilla |
| Périmètre prioritaire | Interface répondant / questionnaire |
| Référentiels visés | RGAA 4.1, WCAG 2.1 A/AA |
| Licence du thème | GNU GPL v2 or later dans le manifeste |
| Licence documentaire proposée | CC BY-NC-SA, à harmoniser avant publication |

> ⚠️ Pour la version 2.76+, la dépendance correcte est **Vanilla**. Les anciennes mentions faisant référence à Fruity comme prérequis doivent être supprimées ou précisées comme historiques.

---

## 🎯 4. Objectifs d’accessibilité

Le thème vise à améliorer :

- ⌨️ la navigation clavier ;
- 🔊 la restitution par lecteur d’écran ;
- 🎯 la visibilité du focus ;
- 🧱 la structure sémantique HTML ;
- 📋 la compréhension des erreurs ;
- 🔁 la cohérence des questions conditionnelles ;
- 📅 la saisie des dates ;
- ✉️ la saisie des emails, téléphones et champs numériques ;
- 💬 la gestion des options “Autre” ;
- 📊 la lisibilité des matrices et tableaux ;
- 📱 le confort mobile ;
- 🔎 le comportement au zoom navigateur ;
- 🛠️ la maintenabilité technique du thème.

---

## 🧱 5. Structure sémantique et navigation lecteur d’écran

### 5.1 Transformation des conteneurs de questions

Certains conteneurs LimeSurvey générés sous forme de `div` sont restructurés dynamiquement afin de créer des groupes de formulaire plus explicites.

Types concernés notamment :

- `div.list-dropdown`
- `div.yes-no`
- `div.numeric-multi`
- `div.list-radio`
- `div.multiple-opt`
- `div.question-container.multiple-short-txt`

Ces éléments sont transformés en `fieldset` lorsque cela est pertinent, et le label principal devient un `legend`.

### ✅ Bénéfices

- meilleure compréhension des groupes de questions ;
- navigation plus logique en mode formulaire ;
- restitution plus claire avec NVDA, JAWS et VoiceOver ;
- meilleure conformité avec les attentes RGAA/WCAG sur la structuration des formulaires.

---

## 📦 6. Fieldset pour les questions avec commentaires

Les questions de type `multiple-opt-comments` sont traitées pour former des groupes cohérents :

```html
<fieldset role="group">
```

Chaque ligne associant une case à cocher et un commentaire devient plus compréhensible pour les technologies d’assistance.

### ✅ Bénéfices

- relation plus claire entre choix et commentaire ;
- diminution des ambiguïtés de lecture ;
- logique homogène avec les autres questions multi-choix.

---

## 🧹 7. Gestion des attributs `required` et des champs invisibles

### 7.1 Nettoyage des `required` inutiles

Le thème retire automatiquement les attributs `required` lorsque les champs sont invisibles, désactivés ou non pertinents.

Cas pris en charge :

- champs `input[type="hidden"][disabled]` ;
- champs “Autre” masqués ;
- champs placés dans des questions cachées ;
- questions avec classes `ls-hidden` ou `ls-irrelevant` ;
- champs masqués par `display:none` ;
- commentaires non pertinents ;
- champs internes LimeSurvey non destinés à l’utilisateur.

### ✅ Bénéfices

- suppression des blocages HTML5 sur des champs invisibles ;
- meilleure cohérence entre ce que voit l’utilisateur et ce qui est réellement obligatoire ;
- réduction des annonces inutiles par lecteur d’écran ;
- prévention des erreurs bloquantes lors de la validation.

### 7.2 Required logique par groupe

Le thème évite de rendre chaque champ individuel obligatoire lorsque la logique attend une réponse par groupe.

Exemples :

- un groupe radio obligatoire ;
- une ligne de matrice obligatoire ;
- une question à choix multiples avec contraintes spécifiques.

### ✅ Bénéfices

- moins de bruit vocal ;
- messages d’erreur plus compréhensibles ;
- logique de validation plus proche de l’intention réelle du questionnaire.

---

## 📅 8. Accessibilité des dates et champs formatés

### 8.1 Dates Jour / Mois / Année

Les champs date LimeSurvey sont réorganisés en trois champs lisibles :

- Jour ;
- Mois ;
- Année.

L’input technique attendu par LimeSurvey reste synchronisé au format :

```txt
aaaa-mm-jj
```

L’input natif peut être masqué, désactivé ou retiré du flux accessible lorsque son affichage crée une confusion.

### ✅ Bénéfices

- saisie plus claire ;
- meilleur comportement clavier ;
- message d’erreur précis ;
- compatibilité accrue avec les lecteurs d’écran ;
- diminution de la dépendance aux widgets calendriers.

### 8.2 Suppression des calendriers doublons

Les éléments visuels redondants sont masqués lorsqu’ils perturbent l’expérience :

- icône calendrier ;
- widget graphique externe ;
- conteneur date redondant.

### ✅ Bénéfices

- suppression des doubles parcours clavier ;
- interface plus simple ;
- moins de confusion pour les utilisateurs.

### 8.3 Email, téléphone, nombre et contrôle de longueur

Selon le type de question ou la classe du conteneur, les champs sont optimisés :

| Type de donnée | Amélioration |
|---|---|
| Email | `type="email"` et `autocomplete="email"` |
| Téléphone | `type="tel"` et clavier adapté mobile |
| Nombre | `type="number"`, `inputmode`, `step` |
| Texte court | contrôle de longueur |
| Date | format explicite et synchronisation technique |

Le contrôle de longueur exploite les attributs `maxlength` et `size` afin de prévenir l’utilisateur avant la validation finale.

### ✅ Bénéfices

- clavier mobile adapté ;
- prévention des erreurs ;
- meilleure expérience sur smartphone ;
- messages plus clairs et accessibles.

---

## 💬 9. Gestion intelligente de l’option “Autre”

### 9.1 Radios “Autre”

Le champ texte associé à une option “Autre” est masqué tant que l’option n’est pas sélectionnée.

Lorsqu’il est masqué, le champ est :

- désactivé ;
- retiré du flux accessible ;
- libéré de tout attribut `required`.

### 9.2 Cases à cocher “Autre”

Dans les questions à choix multiples :

- cocher “Autre” affiche et active le champ texte ;
- saisir du texte dans “Autre” peut cocher automatiquement la case ;
- décocher “Autre” masque et désactive le champ.

### 9.3 Désactivation de “Autre” lorsque non pertinent

Certaines questions peuvent désactiver complètement une option “Autre” lorsqu’elle n’a pas de sens dans le contexte du questionnaire.

### ✅ Bénéfices

- comportement plus naturel ;
- diminution des erreurs inutiles ;
- meilleure synchronisation avec LimeSurvey ;
- restitution plus claire pour les lecteurs d’écran.

---

## 📝 10. Cases à cocher avec commentaires

Pour les questions “cases à cocher + commentaire”, la logique devient conditionnelle :

- aucune case cochée → commentaires facultatifs ;
- une case cochée → commentaire associé obligatoire si demandé ;
- lignes non cochées → commentaires désactivés ;
- erreurs sur lignes non sélectionnées → évitées.

### ✅ Bénéfices

- logique plus compréhensible ;
- validation plus juste ;
- suppression des erreurs absurdes ;
- meilleure cohérence des données envoyées.

---

## 🔊 11. Messages accessibles et zones `aria-live`

### 11.1 Zone système discrète

Le thème crée une zone de statut accessible :

```html
aria-live="polite"
aria-atomic="true"
```

Elle peut annoncer :

- l’envoi du formulaire ;
- une correction attendue ;
- une limite de saisie ;
- un état de validation.

### 11.2 Bandeau global d’alerte accessibilité

Un bandeau en haut de page résume la première erreur bloquante.

Il peut être placé dans une zone :

```html
aria-live="assertive"
```

Il indique :

- la question concernée ;
- la nature du problème ;
- l’action attendue.

Il disparaît automatiquement lorsque la situation est corrigée.

### 11.3 Modale LimeSurvey améliorée

La modale d’alerte LimeSurvey est enrichie pour être mieux annoncée au moment de son apparition, sans rester annoncée en permanence lorsqu’elle n’est plus visible.

### 11.4 Confirmation finale

Un message clair confirme l’enregistrement :

> Vos réponses ont bien été enregistrées.

### ✅ Bénéfices

- meilleure compréhension des erreurs ;
- retour vocal plus fiable ;
- diminution du stress utilisateur ;
- validation plus transparente.

---

## 🧭 12. Validation séquentielle et focus automatique

Le thème améliore la validation en privilégiant une logique progressive :

1. détection de la première question en erreur ;
2. insertion du message près du `legend` ;
3. focus sur le champ à corriger ;
4. défilement doux vers la question ;
5. mise à jour du bandeau global ;
6. suppression de l’alerte lorsque tout est corrigé.

Les bulles HTML5 natives peuvent être neutralisées avec `novalidate` pour éviter les messages peu personnalisables.

### ✅ Bénéfices

- l’utilisateur sait exactement quoi corriger ;
- la correction se fait étape par étape ;
- la navigation clavier reste maîtrisée ;
- les lecteurs d’écran reçoivent une information cohérente.

---

## ⌨️ 13. Gestion de la touche Entrée

La touche Entrée peut déclencher l’action logique “Suivant” ou “Envoyer”, tout en respectant les champs qui nécessitent un retour à la ligne.

Exceptions respectées :

- `textarea` ;
- éditeurs riches ;
- zones `contenteditable` ;
- composants nécessitant une interaction spécifique.

### ✅ Bénéfices

- navigation plus fluide ;
- moins d’envois accidentels ;
- usage clavier plus naturel.

---

## 🎯 14. Focus visible renforcé

Le thème ajoute une gestion visuelle plus nette du focus sur :

- boutons radio ;
- cases à cocher ;
- champs texte ;
- listes déroulantes ;
- boutons de navigation ;
- contrôles d’accessibilité.

Exemple de logique :

```txt
.ls-radio-focus
```

### ✅ Bénéfices

- repérage immédiat du focus ;
- meilleure conformité WCAG/RGAA ;
- confort amélioré pour les personnes utilisant exclusivement le clavier.

---

## 🎨 15. Contrastes, couleurs et lisibilité

La version 2.76+ poursuit les corrections visuelles :

- amélioration des contrastes faibles ;
- focus plus visible ;
- harmonisation des états actifs ;
- lisibilité des boutons radio et cases à cocher ;
- meilleure adaptation responsive ;
- prise en compte du zoom navigateur.

### ✅ Bénéfices

- confort visuel renforcé ;
- meilleure lisibilité ;
- interface plus robuste au zoom ;
- expérience plus inclusive.

---

## 🛠️ 16. Barre d’accessibilité intégrée

La version 2.76+ ajoute une barre d’accessibilité permettant à l’utilisateur d’adapter l’interface selon ses besoins.

Fonctions disponibles selon configuration :

- 🔠 augmenter ou réduire la taille du texte ;
- 🌓 activer un contraste renforcé ;
- ⚫ activer un mode noir et blanc ;
- ↔️ augmenter l’espacement du texte ;
- 📖 activer une police adaptée à la dyslexie ;
- 🔤 activer la police Luciole ;
- 🔄 réinitialiser les réglages.

Les préférences sont conservées côté navigateur via `localStorage` :

```txt
ls_a11y_settings_v3
```

### ✅ Bénéfices

- personnalisation de l’affichage ;
- meilleure autonomie utilisateur ;
- confort renforcé pour plusieurs profils de besoins ;
- amélioration de l’expérience mobile et desktop.

---

## 🔁 17. Modules 4f et 4g — Questions conditionnelles

Les modules 4f et 4g renforcent la gestion des questions conditionnelles, en particulier les questions de type “Si oui…”.

---

### 17.1 Module 4f — Réaffichage automatique des questions redevenues pertinentes

#### Problème adressé

LimeSurvey peut laisser une question masquée alors que l’Expression Manager la considère à nouveau pertinente.

Cela peut provoquer :

- des questions attendues mais invisibles ;
- des erreurs sur des champs obligatoires non visibles ;
- des incohérences pour la navigation clavier ;
- des blocages pour les lecteurs d’écran.

#### Fonctionnement

Le module parcourt les questions :

```js
fieldset[id^="question"]
div[id^="question"]
```

Si une question :

- n’est plus `ls-irrelevant` ;
- reste masquée par `ls-hidden`, `hidden` ou `display:none` ;
- n’a pas été masquée manuellement par le thème ;

alors elle est réaffichée.

Un `MutationObserver` surveille les changements de classe et relance la correction si nécessaire.

#### Normalisation appliquée

Lorsque la question est réaffichée :

- retrait de `ls-hidden` ;
- retrait de `hidden` ;
- remise à zéro de `style.display` ;
- passage à `aria-hidden="false"`.

---

### 17.2 Module 4g — Gestion générique des questions “Si oui…”

#### Objectif

Le module 4g permet de gérer une question enfant de type :

> Si oui, précisez…

sans devoir écrire une condition Expression Manager spécifique pour chaque cas.

#### Détection

Une question enfant est détectée si :

- son `legend` commence par “Si oui” ;
- ou si elle possède la classe CSS `si-oui-child`.

#### Logique

Le module recherche la question parente précédente, puis analyse ses radios :

- si l’option “Oui” est cochée → la question enfant est affichée ;
- sinon → la question enfant est masquée et ses réponses sont nettoyées.

#### Masquage contrôlé

Lorsqu’une question est masquée par le module 4g :

```html
data-ls-manual-hide="1"
aria-hidden="true"
hidden="hidden"
```

et `display:none` est appliqué.

Ce marquage évite que le module 4f ne réaffiche une question volontairement masquée.

#### Nettoyage des réponses

Lors du masquage :

- radios et cases à cocher décochées ;
- listes déroulantes remises au premier choix ;
- champs texte vidés ;
- `required` retiré ;
- champs non pertinents sortis du flux accessible.

### ✅ Bénéfices des modules 4f/4g

- cohérence entre logique LimeSurvey et affichage réel ;
- suppression des questions fantômes ;
- meilleure stabilité des parcours conditionnels ;
- réduction des erreurs bloquantes ;
- meilleure accessibilité pour les lecteurs d’écran.

---

## 📊 18. Matrices, tableaux et questions complexes

La version 2.76+ améliore la gestion des tableaux et matrices :

- meilleure association lignes/colonnes ;
- gestion plus logique des radios obligatoires par ligne ;
- réduction des tabulations inutiles ;
- suppression de focus sur cellules non interactives ;
- amélioration des annonces pour les technologies d’assistance.

### ⚠️ Point d’attention

Les matrices très complexes restent à tester au cas par cas avec :

- NVDA ;
- JAWS ;
- VoiceOver ;
- navigation clavier ;
- zoom navigateur ;
- affichage mobile.

---

## 🔢 19. Questions de classement

La version 2.76+ contient une prise en compte renforcée des questions de classement.

Objectifs :

- améliorer la navigation clavier ;
- conserver la synchronisation avec les champs internes LimeSurvey ;
- éviter les pertes de réponse ;
- rendre l’usage plus compréhensible.

### ⚠️ Point d’attention

Les questions de classement natives LimeSurvey peuvent rester délicates selon le rendu et la configuration. Elles nécessitent des tests spécifiques, en particulier si l’ordre des éléments est modifié dynamiquement.

---

## 🧭 20. Landmarks HTML et liens d’évitement

Le thème ajoute ou renforce les repères structurants :

```html
<header role="banner">
<main role="main" id="main-content">
<footer role="contentinfo">
```

Des liens d’évitement permettent d’accéder directement :

- au contenu principal ;
- à la barre d’accessibilité ;
- à certaines zones utiles du questionnaire.

### ✅ Bénéfices

- navigation plus rapide ;
- meilleure structuration pour les lecteurs d’écran ;
- meilleure compatibilité avec les usages clavier ;
- repères plus clairs dans la page.

---

## 📁 21. Architecture technique du thème

Structure simplifiée :

```txt
config.xml
css/
  custom.css
  theme.css
  variations/
docs/
files/
  accessibilite.js
  a11y-modules/
options/
scripts/
  custom.js
tests/
  accessibilite/
views/
```

### Fichiers clés

| Fichier / dossier | Rôle |
|---|---|
| `config.xml` | Manifeste du thème |
| `views/layout_global.twig` | Structure générale, landmarks, liens d’évitement, barre d’accessibilité |
| `views/subviews/header/head.twig` | En-tête, métadonnées, ressources |
| `views/subviews/footer/footer.twig` | Scripts complémentaires et persistance des réglages |
| `files/accessibilite.js` | Bundle principal des correctifs accessibilité |
| `files/a11y-modules/` | Modules documentés par familles fonctionnelles |
| `scripts/custom.js` | Scripts additionnels du thème |
| `css/custom.css` | Styles de focus, contraste, reflow, accessibilité |
| `docs/` | Documentation technique et preuves de conformité |
| `tests/accessibilite/` | Tests statiques et matrices de tests |

---

## 🧠 22. Découpage fonctionnel des modules accessibilité

La version 2.76+ documente les familles de fonctions dans `files/a11y-modules/`.

| Module | Rôle |
|---|---|
| `00-core-status-links.js` | Socle transversal, statuts, liens |
| `01-structure-required.js` | Structure, required, champs invisibles |
| `02-personal-data-autocomplete.js` | Données personnelles et autocomplete |
| `03-question-families.js` | Familles de questions standards |
| `04-arrays-tables.js` | Tableaux et matrices |
| `05-reflow-focus-selects.js` | Zoom, focus, listes déroulantes |
| `06-ranking.js` | Questions de classement |
| `07-observers-validation.js` | Observers, validation, erreurs |
| `08-session-timeout.js` | Avertissements de session |
| `09-static-result-pages.js` | Pages statiques et résultats |

Le bundle chargé par LimeSurvey reste :

```txt
files/accessibilite.js
```

Ce découpage facilite la compréhension, la maintenance et les tests de non-régression.

---

## 🧪 23. Tests et non-régression

Un contrôle statique peut être lancé avec :

```bash
node tests/accessibilite/run-static-a11y-checks.js
```

Ce test ne remplace pas un audit RGAA complet, mais sert de garde-fou après modification du thème.

Les matrices de tests sont disponibles dans :

```txt
tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md
tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv
```

Une procédure de preuve est disponible dans :

```txt
docs/PROCEDURE-PREUVES-CONFORMITE-RGAA.md
```

### Éléments à conserver lors des tests

- version du thème ;
- version de LimeSurvey ;
- navigateur ;
- lecteur d’écran ;
- type de question testée ;
- capture ou extrait HTML ;
- résultat clavier ;
- résultat zoom ;
- résultat lecteur d’écran ;
- éventuelle non-conformité restante.

---

## 🧾 24. Documentation complémentaire

La version 2.76+ inclut plusieurs documents utiles :

| Document | Objet |
|---|---|
| `AUDIT-WCAG-253-LABEL-IN-NAME.md` | Audit sur la cohérence nom visible / nom accessible |
| `GUIDE-CREATEURS-LANGUE-PASSAGES.md` | Guide pour la langue des passages |
| `NC-R015-MATRICES-COMPLEXES-NVDA.md` | Non-conformité / point d’attention matrices complexes |
| `NC-R0210-VARIATIONS-ESPACEMENT.md` | Variations d’espacement |
| `NC-R0311-AUTOCOMPLETE-HEURISTIQUE.md` | Heuristique autocomplete |
| `NC-R0412-ORDRE-TABULATION-MATRICES.md` | Ordre de tabulation dans les matrices |
| `NC-R058-LANGUE-PASSAGES-CREATEURS.md` | Langue des passages côté créateurs |
| `PROCEDURE-PREUVES-CONFORMITE-RGAA.md` | Procédure de preuves de conformité |

---

## 📥 25. Installation et déploiement

### Étapes recommandées

1. Télécharger le ZIP du thème.
2. Importer le thème dans LimeSurvey.
3. Vérifier que le thème parent **Vanilla** est disponible.
4. Activer le thème dans les paramètres du questionnaire.
5. Vider le cache LimeSurvey si nécessaire.
6. Tester le questionnaire avec plusieurs profils d’usage.

### Tests minimum avant diffusion

- navigation clavier complète ;
- validation des champs obligatoires ;
- test d’une question conditionnelle ;
- test d’une date ;
- test d’une matrice ;
- test d’un champ “Autre” ;
- zoom navigateur à 200 % ;
- affichage mobile ;
- lecteur d’écran sur au moins un parcours complet.

---

## 👩‍💻 26. Recommandations aux créateurs de questionnaires

Même avec un thème accessible, la qualité finale dépend du questionnaire créé.

Il est recommandé de :

- rédiger des intitulés de questions explicites ;
- éviter les matrices trop complexes ;
- ne pas transmettre une information uniquement par la couleur ;
- limiter les consignes ambiguës ;
- utiliser les champs “Autre” seulement si nécessaire ;
- tester les questions conditionnelles ;
- vérifier les messages d’aide ;
- vérifier les erreurs de validation ;
- tester le questionnaire au clavier ;
- relire le questionnaire avec un zoom important.

---

## ⚠️ 27. Limites connues

- Le thème améliore l’interface répondant, mais ne corrige pas automatiquement les contenus mal rédigés.
- Certaines matrices complexes nécessitent encore une vérification manuelle.
- Les questions de classement doivent être testées selon leur configuration.
- Les lecteurs d’écran peuvent réagir différemment selon navigateur et système.
- Le back-office LimeSurvey n’est pas le périmètre principal de cette version.
- Un audit RGAA complet reste nécessaire pour déclarer une conformité officielle.

---

## 🔭 28. Perspectives

Les prochaines évolutions envisagées portent sur :

- 🏗️ amélioration progressive de l’accessibilité du back-office ;
- 📚 enrichissement de la documentation pour les créateurs ;
- 🧩 amélioration de certains types de questions natifs difficiles ;
- 📊 poursuite des tests sur matrices et classements ;
- 🧪 renforcement des tests automatisés ;
- 📋 meilleure traçabilité des preuves RGAA ;
- 🤝 préparation d’une contribution ou d’un échange avec l’éditeur LimeSurvey ;
- 🌍 diffusion plus large auprès de la communauté open source et ESR.

---

## 📬 29. Contacts

- APRANESR : [contact@apranesr.fr](mailto:contact@apranesr.fr)
- Université de Lille : [raphael.lecerf@univ-lille.fr](mailto:raphael.lecerf@univ-lille.fr)
- Support LimeSurvey Université de Lille : [support-limesurvey@univ-lille.fr](mailto:support-limesurvey@univ-lille.fr)

---

## 🧾 30. Synthèse finale

AllySurvey V2.76+ marque une étape importante dans l’amélioration de l’accessibilité des questionnaires LimeSurvey.

Le thème apporte des corrections concrètes sur :

- la structure HTML ;
- la navigation clavier ;
- les champs obligatoires ;
- les erreurs de validation ;
- les dates ;
- les options “Autre” ;
- les commentaires conditionnels ;
- les messages vocaux ;
- les questions conditionnelles ;
- les matrices ;
- les classements ;
- le confort d’affichage ;
- la maintenabilité technique.

Cette version s’inscrit dans une démarche continue : **améliorer, tester, documenter et partager**.

<p align="center">
  <strong>♿ Libre, clair et accessible : c’est possible.</strong><br>
  #AccessibilitéNumérique #LimeSurvey #OpenSource #UniversitéDeLille #RGAA #WCAG #APRANESR
</p>
