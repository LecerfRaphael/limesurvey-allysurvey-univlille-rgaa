/*
  Module de maintenance : PJAX, observers et validation
  ID : observers-validation
  Critères : RGAA 7, RGAA 11 / WCAG 3.3.1, 3.3.3, 4.1.2, 4.1.3
  Bundle exécuté : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initRequiredCleanupObservers
  - initRequiredObserver
  - initTextLongShortRequiredObserver
  - initListRadioRequiredObserver
  - initRowRequiredObservers
  - initUnhideRelevantWatcher
  - initSequentialValidation

  Tests associés : AUTO-10, MAN-15, MAN-16

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le découpage ci-dessous sert à maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dépendances de chargement côté thème.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["observers-validation"] = {
  "id": "observers-validation",
  "family": "PJAX, observers et validation",
  "criteria": "RGAA 7, RGAA 11 / WCAG 3.3.1, 3.3.3, 4.1.2, 4.1.3",
  "functions": [
    "initRequiredCleanupObservers",
    "initRequiredObserver",
    "initTextLongShortRequiredObserver",
    "initListRadioRequiredObserver",
    "initRowRequiredObservers",
    "initUnhideRelevantWatcher",
    "initSequentialValidation"
  ],
  "test_refs": [
    "AUTO-10",
    "MAN-15",
    "MAN-16"
  ]
};
