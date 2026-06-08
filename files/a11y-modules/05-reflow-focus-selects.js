/*
  Module de maintenance : Reflow, focus, select
  ID : reflow-focus-selects
  Critères : RGAA 10 / WCAG 1.4.4, 1.4.10, 1.4.12, 2.4.7
  Bundle exécuté : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initReflowZoomSupport
  - hideNativePickers
  - forceNativeSelectAccessibility
  - initBootstrapSelectKeyboardFix
  - initAriaLiveSubmitMessage
  - initBootstrapAlertModalAriaLive

  Tests associés : AUTO-08, MAN-11, MAN-12, MAN-13, MAN-21, MAN-22, MAN-24

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le découpage ci-dessous sert à maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dépendances de chargement côté thème.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["reflow-focus-selects"] = {
  "id": "reflow-focus-selects",
  "family": "Reflow, focus, select",
  "criteria": "RGAA 10 / WCAG 1.4.4, 1.4.10, 1.4.12, 2.4.7",
  "functions": [
    "initReflowZoomSupport",
    "hideNativePickers",
    "forceNativeSelectAccessibility",
    "initBootstrapSelectKeyboardFix",
    "initAriaLiveSubmitMessage",
    "initBootstrapAlertModalAriaLive"
  ],
  "test_refs": [
    "AUTO-08",
    "MAN-11",
    "MAN-12",
    "MAN-13",
    "MAN-21",
    "MAN-22",
    "MAN-24"
  ]
};
