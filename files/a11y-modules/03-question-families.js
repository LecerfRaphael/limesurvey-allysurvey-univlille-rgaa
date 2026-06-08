/*
  Module de maintenance : Types de questions standard
  ID : question-families
  Criteres : RGAA 7, RGAA 11 / WCAG 2.1.1, 3.3.2, 4.1.2
  Bundle execute : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initDateTriplets
    - initOtherRadios
    - initOtherCheckboxes
    - initDisableOtherOnListRadio
    - initOtherAutreFocus
    - initForceListWithComment
    - initMultipleOptComments
    - initChoiceFocusStyles
    - initUploadAccessibility
    - initSliderAccessibility
    - initEquationAccessibility

  Tests associes : AUTO-06, MAN-06, MAN-07, MAN-08, MAN-17, MAN-18

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le decoupage ci-dessous sert a maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dependances de chargement cote theme.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["question-families"] = {
  "id": "question-families",
  "family": "Types de questions standard",
  "criteria": "RGAA 7, RGAA 11 / WCAG 2.1.1, 3.3.2, 4.1.2",
  "functions": [
    "initDateTriplets",
    "initOtherRadios",
    "initOtherCheckboxes",
    "initDisableOtherOnListRadio",
    "initOtherAutreFocus",
    "initForceListWithComment",
    "initMultipleOptComments",
    "initChoiceFocusStyles",
    "initUploadAccessibility",
    "initSliderAccessibility",
    "initEquationAccessibility"
  ],
  "test_refs": [
    "AUTO-06",
    "MAN-06",
    "MAN-07",
    "MAN-08",
    "MAN-17",
    "MAN-18"
  ]
};
