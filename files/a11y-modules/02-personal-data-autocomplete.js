/*
  Module de maintenance : Objectif des champs utilisateur
  ID : personal-data-autocomplete
  Criteres : WCAG 1.3.5 AA
  Bundle execute : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initAutoTypes
    - enhanceStandardAutocomplete
    - explicitAutocompleteToken
    - normalizeAutocompleteToken

  Tests associes : AUTO-05, MAN-05

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le decoupage ci-dessous sert a maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dependances de chargement cote theme.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["personal-data-autocomplete"] = {
  "id": "personal-data-autocomplete",
  "family": "Objectif des champs utilisateur",
  "criteria": "WCAG 1.3.5 AA",
  "functions": [
    "initAutoTypes",
    "enhanceStandardAutocomplete",
    "explicitAutocompleteToken",
    "normalizeAutocompleteToken"
  ],
  "test_refs": [
    "AUTO-05",
    "MAN-05"
  ]
};
