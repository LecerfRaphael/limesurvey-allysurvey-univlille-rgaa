# Modules de maintenance accessibilité LimeSurvey

Le fichier réellement chargé par le thème reste `files/accessibilite.js` afin de conserver la compatibilité avec LimeSurvey, le cache de thème et PJAX.

Cette arborescence sert de **découpage maintenable par famille fonctionnelle** : chaque module décrit les fonctions du bundle, les critères RGAA/WCAG associés et les tests de preuve à rejouer après modification.

## Règle de maintenance

1. Modifier d'abord la famille concernée dans `files/accessibilite.js`.
2. Mettre à jour le manifeste `files/a11y-modules/manifest.json` si une fonction change de responsabilité.
3. Rejouer `node tests/accessibilite/run-static-a11y-checks.js`.
4. Rejouer les tests manuels indiqués dans `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.
5. Ajouter la preuve dans le dossier d'audit du questionnaire testé.

## Debug en navigateur

Dans la console, activer le journal de boot :

```js
window.LSA11yMaintenance.debug = true;
window.LSA11yMaintenance.bootLog = [];
```

Puis naviguer dans le questionnaire. Le tableau `window.LSA11yMaintenance.bootLog` permet de voir quelles familles sont relancées après PJAX.
