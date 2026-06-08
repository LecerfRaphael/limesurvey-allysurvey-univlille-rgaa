/*
  Module de maintenance : Pages hors questionnaire
  ID : static-result-pages
  Criteres : RGAA 13 / WCAG 1.4.10
  Bundle execute : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initStaticResultPagesAccessibility

  Tests associes : AUTO-11, MAN-19, MAN-20

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le decoupage ci-dessous sert a maintenir,
  auditer et relire les correctifs par famille de page sans multiplier
  les dependances de chargement cote theme.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["static-result-pages"] = {
  "id": "static-result-pages",
  "family": "Pages hors questionnaire",
  "criteria": "RGAA 13 / WCAG 1.4.10",
  "functions": [
    "initStaticResultPagesAccessibility"
  ],
  "test_refs": [
    "AUTO-11",
    "MAN-19",
    "MAN-20"
  ]
};
