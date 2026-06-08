/*
  Module de maintenance : Avertissement de session
  ID : session-timeout
  Criteres : RGAA 13 / WCAG 2.2.1
  Bundle execute : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initSessionTimeoutWarning

  Tests associes : AUTO-10, MAN-15, MAN-23

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le decoupage ci-dessous sert a maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dependances de chargement cote theme.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["session-timeout"] = {
  "id": "session-timeout",
  "family": "Avertissement de session",
  "criteria": "RGAA 13 / WCAG 2.2.1",
  "functions": [
    "initSessionTimeoutWarning"
  ],
  "test_refs": [
    "AUTO-10",
    "MAN-15",
    "MAN-23"
  ]
};
