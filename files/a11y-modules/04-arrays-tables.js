/*
  Module de maintenance : Tableaux et matrices
  ID : arrays-tables
  Critères : RGAA 5 / WCAG 1.3.1, 1.3.2
  Bundle exécuté : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - enhanceArrayTableSemantics
    - buildTableGrid
    - parseSpan
    - hasFocusableContent
    - removeMatrixCellTabStops
    - setArrayDescribedByTokens

  Tests associés : AUTO-07, MAN-09, MAN-10

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le découpage ci-dessous sert à maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dépendances de chargement côté thème.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["arrays-tables"] = {
  "id": "arrays-tables",
  "family": "Tableaux et matrices",
  "criteria": "RGAA 5 / WCAG 1.3.1, 1.3.2",
  "functions": [
    "enhanceArrayTableSemantics",
    "buildTableGrid",
    "parseSpan",
    "hasFocusableContent",
    "removeMatrixCellTabStops",
    "setArrayDescribedByTokens"
  ],
  "test_refs": [
    "AUTO-07",
    "MAN-09",
    "MAN-10"
  ]
};
