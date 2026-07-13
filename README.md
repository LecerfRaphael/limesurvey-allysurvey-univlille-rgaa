<p align="center">
  <strong>✨ AllySurvey — Des questionnaires LimeSurvey plus simples, plus clairs, plus accessibles</strong><br>
  Université de Lille • Direction du numérique — Service DAWAM<br>
  Thème LimeSurvey accessible RGAA/WCAG • Version 2.76+<br>
  Compatible LimeSurvey 6.x — testé notamment avec 6.3.9+231211 et 6.15.22+251103<br>
  Dernière mise à jour documentaire : 07/07/2026
</p>

<p align="center">
  ♿ Accessibilité numérique • 🧭 Navigation clavier • 🔊 Lecteurs d’écran • 🎨 Contrastes • 📱 Mobile • 🧩 Formulaires complexes
</p>

---

# ♿ AllySurvey — Thème LimeSurvey accessible RGAA/WCAG

**AllySurvey** est un thème de questionnaire LimeSurvey basé sur le thème parent **Vanilla**, développé pour améliorer l’accessibilité, la lisibilité et l’expérience utilisateur des questionnaires en ligne.

Ce projet s’inscrit dans une démarche d’amélioration continue de l’accessibilité numérique menée à l’Université de Lille. Il vise à rendre les formulaires LimeSurvey plus compréhensibles, plus robustes et plus utilisables par le plus grand nombre, notamment les personnes utilisant le clavier, un lecteur d’écran, le zoom navigateur, des réglages de contraste ou des aides à la lecture.

Le thème prend en compte les bonnes pratiques issues des référentiels :

- ✅ **RGAA 4.1** ;
- ✅ **WCAG 2.1 niveaux A et AA** ;
- ⌨️ navigation clavier ;
- 🔊 lecteurs d’écran ;
- 🔎 zoom navigateur et reflow ;
- 🎨 contrastes et focus visibles ;
- 🧱 structure sémantique HTML ;
- 🧩 formulaires complexes LimeSurvey.

> ⚠️ **Important :** ce thème améliore fortement l’accessibilité côté participant, mais ne remplace pas un audit RGAA complet réalisé sur un questionnaire final, avec ses contenus, ses questions et ses paramétrages.

---

## 🏛️ Contexte du projet

L’accessibilité numérique est un enjeu majeur pour garantir l’inclusion de tous les utilisateurs, y compris les personnes en situation de handicap.

Dans ce cadre, l’Université de Lille a travaillé sur la refonte et l’amélioration des templates utilisés par LimeSurvey afin de rendre les questionnaires :

- 🧠 plus compréhensibles ;
- ♿ plus accessibles ;
- 🎨 plus cohérents visuellement ;
- 🛡️ plus robustes techniquement ;
- 🔊 mieux adaptés aux technologies d’assistance.

Ce travail est développé par la **Direction du numérique — Service DAWAM de l’Université de Lille**, dans une logique de contribution, de mutualisation et de partage avec la communauté de l’enseignement supérieur et de la recherche.

Il est également mis à disposition des membres de l’**APRANESR** — Association Professionnelle des Référents Accessibilité Numérique de l’Enseignement Supérieur et de la Recherche.

---

## 🧩 Compatibilité

- 🟢 **LimeSurvey :** version 6.x
- 🎨 **Thème parent :** Vanilla
- 📝 **Type :** thème de questionnaire LimeSurvey
- 📦 **Nom du thème :** `RGAA-V276-UnivLille-AllySurvey`
- 🚀 **Version fonctionnelle :** 2.76+
- ⚙️ **Compatibilité indiquée dans le manifeste :** LimeSurvey 6.0+

Le thème est basé sur **Vanilla**. Les anciennes mentions de dépendance directe au thème Fruity doivent donc être évitées pour cette version 2.76+.

---

## 📥 Installation

1. 📦 Télécharger la dernière release du thème au format ZIP.
2. ⚙️ Dans LimeSurvey, ouvrir l’éditeur de thème.
3. ⬆️ Importer le fichier ZIP du thème.
4. ✅ Activer le thème **AllySurvey / RGAA-V276-UnivLille-AllySurvey** dans les paramètres du questionnaire.
5. 🧹 Vider ou réinitialiser le cache de thème si nécessaire.
6. 🧪 Tester le questionnaire avec :
   - ⌨️ navigation clavier seule ;
   - 🔊 lecteur d’écran ;
   - 🔎 zoom navigateur à 200 % et plus ;
   - 📱 affichage mobile ;
   - 🎨 contraste renforcé ;
   - 🧩 différents types de questions LimeSurvey.

---

## 🚀 Fonctionnalités principales

### 🧭 Navigation et correction des erreurs

- ✔️ Validation progressive : la première question en erreur est signalée en priorité.
- ✔️ Message d’erreur affiché directement au niveau de la question concernée.
- 🎯 Focus automatique sur la zone à corriger, avec défilement doux.
- 📊 Meilleure gestion des erreurs sur les tableaux de réponses et matrices.
- 🧱 Détection plus précise des champs obligatoires réellement visibles et pertinents.
- 🔔 Alerte accessibilité en haut de page pour résumer les problèmes restants.
- 🔁 Actualisation dynamique des messages lorsque l’utilisateur corrige ses réponses.

### 🧱 Structure sémantique et landmarks

Le thème ajoute ou renforce les repères HTML utiles à la navigation assistée :

```html
<header role="banner">
<main role="main" id="main-content">
<footer role="contentinfo">
```

Des liens d’évitement sont également ajoutés pour permettre d’aller directement :

- 🎯 au contenu principal ;
- ♿ aux options d’accessibilité.

Ces éléments facilitent la navigation clavier et la compréhension de la structure par les lecteurs d’écran.

### 🛠️ Barre d’accessibilité intégrée

La version 2.76+ intègre une barre d’accessibilité permettant d’adapter l’affichage selon les besoins de l’utilisateur.

Fonctions disponibles selon configuration :

- 🔠 agrandissement ou réduction de la taille du texte ;
- 🌓 contraste renforcé ;
- ⚫ mode noir et blanc ;
- ↔️ espacement du texte ;
- 📖 police adaptée à la dyslexie ;
- 🔤 police Luciole ;
- 🔄 réinitialisation des réglages.

Les préférences sont conservées côté navigateur via `localStorage`, avec la clé :

```txt
ls_a11y_settings_v3
```

Les changements sont annoncés aux technologies d’assistance via des zones de statut adaptées.

### 📅 Dates, emails, téléphones et champs numériques

- 📅 Les dates sont présentées sous forme de trois champs clairs : **Jour / Mois / Année**.
- 🔁 Le champ technique attendu par LimeSurvey au format `aaaa-mm-jj` est synchronisé automatiquement.
- 🗑️ Les calendriers ou widgets graphiques redondants sont masqués lorsqu’ils créent de la confusion.
- ✉️ Les champs email peuvent bénéficier d’un clavier adapté sur smartphone.
- 📞 Les champs téléphone ou numériques peuvent utiliser `inputmode`, `step` et des attributs adaptés.
- 🚦 Les limites de longueur (`maxlength`, `size`) sont mieux signalées pour éviter les blocages tardifs.

### 💬 Option “Autre, précisez”

- ✨ Le champ “Autre” apparaît uniquement lorsque l’option correspondante est sélectionnée.
- 🔁 Si l’utilisateur commence à saisir dans “Autre, précisez”, l’option “Autre” peut être cochée automatiquement.
- 🧠 Les champs techniques internes LimeSurvey sont mieux synchronisés.
- 😌 Les erreurs sur des champs “Autre” non pertinents sont évitées.
- 🎯 Certaines options “Autre” peuvent être désactivées lorsqu’elles n’ont pas de sens dans le questionnaire.

### 📝 Cases à cocher avec commentaires

Pour les questions de type “cases à cocher + commentaire” :

- ⬜ si aucune case n’est cochée, les commentaires restent facultatifs ;
- ☑️ si une case est cochée, le commentaire associé peut devenir obligatoire ;
- 🚫 les commentaires des lignes non cochées sont désactivés ;
- 🛡️ les erreurs inutiles sur des lignes non concernées sont évitées.

### 🔊 Messages accessibles et retours vocaux

- 🔔 Création de zones de statut `aria-live` adaptées.
- 🤫 Réduction des annonces répétitives ou inutiles.
- ⏳ Message vocal lors de l’envoi du formulaire : “Votre formulaire est en cours de traitement.”
- 🎉 Confirmation plus claire en fin de questionnaire.
- 🔳 Amélioration de la modale d’alerte LimeSurvey pour les lecteurs d’écran.
- 📢 Meilleure séparation entre messages d’aide, erreurs et informations de statut.

### ⌨️ Navigation clavier

- 🎯 Focus renforcé sur les champs, boutons radio, cases à cocher et contrôles interactifs.
- ♿ Navigation plus fluide dans les groupes de réponses et tableaux.
- 🖱️ Meilleure compatibilité avec l’usage sans souris.
- ↩️ Gestion plus cohérente de la touche Entrée selon le contexte.
- 🔽 Correction de certains comportements de composants Bootstrap Select.

### 📊 Tableaux, matrices et questions complexes

Le thème améliore la structure des tableaux et matrices LimeSurvey :

- 🧭 ajout ou renforcement des associations entre cellules, lignes et colonnes ;
- 🔊 amélioration de la lecture par les technologies d’assistance ;
- 🧹 suppression de certains tab stops inutiles dans les cellules non interactives ;
- 📋 meilleure gestion des matrices radio, cases à cocher et listes ;
- ✅ prise en compte des contraintes propres aux questions obligatoires.

Certaines matrices très complexes nécessitent toutefois encore une validation manuelle selon le questionnaire, le paramétrage et le lecteur d’écran utilisé.

### 🔢 Questions de classement

La version 2.76+ contient une prise en compte renforcée des questions de classement afin d’améliorer leur utilisation au clavier et leur synchronisation avec les champs internes LimeSurvey.

Cette amélioration doit être testée au cas par cas, car le type “classement” de LimeSurvey peut varier selon les options activées et le rendu final.

---

## 🗂️ Architecture du thème

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

### 📌 Fichiers principaux

- ⚙️ `config.xml` : manifeste du thème LimeSurvey.
- 🧱 `views/layout_global.twig` : structure générale, landmarks, liens d’évitement, barre d’accessibilité.
- 🧠 `views/subviews/header/head.twig` : éléments d’en-tête, métadonnées et ressources.
- 🦶 `views/subviews/footer/footer.twig` : scripts complémentaires, persistance des réglages d’accessibilité.
- ♿ `files/accessibilite.js` : bundle principal des correctifs accessibilité côté questionnaire.
- 🛠️ `scripts/custom.js` : scripts additionnels du thème.
- 🎨 `css/custom.css` : styles d’accessibilité, focus, reflow, contrastes, options de confort.
- 📚 `docs/` : documentation de conformité et procédures de preuve.
- 🧪 `tests/accessibilite/` : matrice de tests et garde-fous de non-régression.

---

## 🧠 Modules de maintenance accessibilité

Le thème conserve un bundle unique chargé par LimeSurvey :

```txt
files/accessibilite.js
```

Pour faciliter la maintenance, la version 2.76+ documente les familles fonctionnelles dans :

```txt
files/a11y-modules/
```

Ces fichiers décrivent les responsabilités du bundle, les critères RGAA/WCAG associés et les tests à rejouer après modification.

Familles principales :

- 🧩 socle transversal, zones de statut, liens et intitulés ;
- 🧱 structure, langue des passages et champs obligatoires ;
- 📝 objectif des champs utilisateur et autocomplete ;
- ❓ familles de questions standard ;
- 📊 tableaux et matrices ;
- 🔎 reflow, zoom, focus et listes déroulantes ;
- 🔢 questions de classement ;
- ⏱️ avertissements de session ;
- 📄 pages statiques et pages de résultat.

---

## 🧪 Tests et non-régression

Un script de contrôle statique est disponible :

```bash
node tests/accessibilite/run-static-a11y-checks.js
```

Ce script ne remplace pas un audit RGAA, mais sert de garde-fou après modification du thème.

Les tests manuels sont documentés dans :

```txt
tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md
tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv
```

Pour chaque évolution importante, il est conseillé de conserver :

- 🏷️ la version du thème ;
- ⚙️ la version de LimeSurvey ;
- 🌐 le navigateur utilisé ;
- 🔊 le lecteur d’écran utilisé ;
- 🖼️ les captures ou preuves HTML ;
- ⌨️ le résultat des tests clavier ;
- 🔎 le résultat des tests avec zoom navigateur.

Une procédure de preuves est disponible dans :

```txt
docs/PROCEDURE-PREUVES-CONFORMITE-RGAA.md
```

---

## 👩‍💻 Recommandations pour les créateurs de questionnaires

Même avec un thème renforcé, la qualité finale dépend aussi de la conception du questionnaire.

Il est recommandé de :

- ✍️ rédiger des intitulés de questions clairs ;
- 📊 éviter les tableaux trop complexes lorsque ce n’est pas indispensable ;
- 👁️ limiter les dépendances visuelles seules ;
- 🧾 fournir des consignes explicites ;
- 🧪 tester chaque type de question utilisé ;
- 🔔 vérifier les messages d’aide et les messages d’erreur ;
- ⌨️ tester le questionnaire au clavier avant diffusion ;
- 📱 vérifier le rendu mobile ;
- 💬 éviter de multiplier les champs “Autre” lorsqu’ils ne sont pas nécessaires.

Pour les champs liés à des données personnelles, les libellés atypiques peuvent nécessiter un marquage explicite afin d’appliquer le bon attribut `autocomplete`.

---

## ⚠️ Limites connues

- ⚠️ Le thème améliore le rendu participant, mais ne corrige pas automatiquement tous les contenus saisis par les créateurs de questionnaires.
- 🧩 Certaines questions LimeSurvey complexes peuvent nécessiter une adaptation ou une vérification manuelle.
- 📊 Les matrices complexes doivent être testées avec plusieurs lecteurs d’écran.
- 🛠️ Les corrections JavaScript dépendent du rendu final LimeSurvey et peuvent nécessiter des ajustements selon les versions.
- 🏗️ Le back-office LimeSurvey n’est pas l’objet principal de cette version du thème.

---

## 🔭 Perspectives

Les prochaines évolutions envisagées portent notamment sur :

- 🏗️ l’amélioration progressive de l’accessibilité du back-office ;
- 📚 l’enrichissement de la documentation pour les créateurs de questionnaires ;
- 🧪 la poursuite des tests sur les questions complexes ;
- 🧩 la transformation ou l’adaptation de certains types de questions natifs moins accessibles ;
- 📋 l’amélioration des preuves de conformité RGAA ;
- 🤝 la préparation d’une contribution ou d’un échange avec l’éditeur LimeSurvey autour des améliorations proposées.

---

## 📬 Contacts

- 📧 APRANESR : [contact@apranesr.fr](mailto:contact@apranesr.fr)
- 📧 Université de Lille : [raphael.lecerf@univ-lille.fr](mailto:raphael.lecerf@univ-lille.fr)
- 📧 Support LimeSurvey Université de Lille : [support-limesurvey@univ-lille.fr](mailto:support-limesurvey@univ-lille.fr)

---

## ⚖️ Licence

Le manifeste du thème indique une licence **GNU General Public License version 2 or later**.

À harmoniser avant publication officielle du dépôt si une autre licence est souhaitée pour la documentation, par exemple **CC BY-NC-SA** pour les contenus rédactionnels.

---

## 🙏 Remerciements

Merci aux personnes et structures impliquées dans les tests, retours d’expérience et échanges autour de l’accessibilité numérique dans l’enseignement supérieur et la recherche.

Ce projet s’inscrit dans une démarche collective : rendre les questionnaires en ligne plus accessibles, plus inclusifs et plus simples à utiliser.

---

<p align="center">
  <strong>♿ Libre, clair et accessible : c’est possible.</strong><br>
  #AccessibilitéNumérique #LimeSurvey #OpenSource #UniversitéDeLille #RGAA #WCAG #APRANESR
</p>
