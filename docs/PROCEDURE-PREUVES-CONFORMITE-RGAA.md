# Procédure de maintenance et preuves de conformité RGAA

## Objectif

Faciliter la maintenance du thème LimeSurvey accessible lorsque LimeSurvey change ses templates, ses classes CSS ou son comportement PJAX.

## Principe

Le thème conserve un bundle unique `files/accessibilite.js` pour éviter les erreurs de chargement dans LimeSurvey. Ce bundle est désormais orchestré par familles fonctionnelles, visibles dans :

- `window.LSA11yMaintenance.modules` côté navigateur ;
- `files/a11y-modules/manifest.json` côté source ;
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md` côté preuve.

## À rejouer après chaque évolution LimeSurvey

1. Contrôle syntaxe JavaScript : `node --check files/accessibilite.js` et `node --check scripts/custom.js`.
2. Contrôle statique : `node tests/accessibilite/run-static-a11y-checks.js`.
3. Tests manuels clavier : lien d'évitement, panneau accessibilité, navigation PJAX, boutons précédent/suivant.
4. Tests lecteurs d'écran : NVDA/Firefox et NVDA/Chrome au minimum.
5. Tests formulaires : erreurs reliées, `aria-invalid`, `aria-describedby`, champs personnels `autocomplete`.
6. Tests matrices : array radio, dual-scale, texte, faible largeur 320 px CSS.
7. Tests zoom : navigateur 200 %, espacement texte WCAG 1.4.12, reflow sans perte de fonction.
8. Tests composants et environnements : sliders, upload, pages de fin, VoiceOver macOS/iOS, session timeout, variations couleurs + espacement.
9. Tests contenus : langue des passages marques et controle editorial des passages etrangers non marques.

## Format conseillé des preuves

Pour chaque test manuel, conserver :

- ID du test dans la matrice ;
- date ;
- version LimeSurvey ;
- navigateur et version ;
- lecteur d'écran et version si utilisé ;
- capture écran ou capture inspecteur ;
- résultat : conforme, à surveiller, non conforme ;
- commentaire correctif si besoin.

## Point de vigilance

Les questions LimeSurvey peuvent varier selon le type exact, les options activées, le mode groupe/page et le thème parent. Toute mise à jour majeure de LimeSurvey doit déclencher au minimum les tests MAN-09 à MAN-25.
