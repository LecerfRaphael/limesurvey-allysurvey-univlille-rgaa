# Tests accessibilité du thème

## Test automatisé statique

Depuis la racine du thème :

```bash
node tests/accessibilite/run-static-a11y-checks.js
```

Ce script ne remplace pas un audit RGAA, mais sert de garde-fou de non-régression après correction du thème.

## Tests manuels

Rejouer la matrice :

- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`
- `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv`

Pour les preuves d'audit : conserver captures, export HTML inspecté, version de navigateur, version LimeSurvey, lecteur d'écran et date du test.
