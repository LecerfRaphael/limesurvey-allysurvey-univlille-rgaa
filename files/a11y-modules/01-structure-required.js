/*
  Module de maintenance : Structure + langue des passages + champs obligatoires
  ID : structure-required
  Criteres : RGAA 8, RGAA 9, RGAA 11 / WCAG 3.1.2, 1.3.1, 3.3.1, 3.3.2
  Bundle execute : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initPassageLanguageHints
    - initDivToFieldset
    - removeAlertRoleOnQuestionHelp
    - removeRequiredFromHiddenInputs
    - updateRequiredForInputsSelectsAndRadios
    - validateRadioRequirementsInTable
    - addRequiredToTextLongMandatory
    - updateRequiredForTextShortQuestions
    - applyRequiredRadiosFieldsets
    - updateRequiredAttributes
    - updateRadioRequiredAttributes

  Tests associes : AUTO-03, AUTO-04, MAN-03, MAN-04, MAN-25

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le decoupage ci-dessous sert a maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dependances de chargement cote theme.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["structure-required"] = {
  "id": "structure-required",
  "family": "Structure + langue des passages + champs obligatoires",
  "criteria": "RGAA 8, RGAA 9, RGAA 11 / WCAG 3.1.2, 1.3.1, 3.3.1, 3.3.2",
  "functions": [
    "initPassageLanguageHints",
    "initDivToFieldset",
    "removeAlertRoleOnQuestionHelp",
    "removeRequiredFromHiddenInputs",
    "updateRequiredForInputsSelectsAndRadios",
    "validateRadioRequirementsInTable",
    "addRequiredToTextLongMandatory",
    "updateRequiredForTextShortQuestions",
    "applyRequiredRadiosFieldsets",
    "updateRequiredAttributes",
    "updateRadioRequiredAttributes"
  ],
  "test_refs": [
    "AUTO-03",
    "AUTO-04",
    "MAN-03",
    "MAN-04",
    "MAN-25"
  ]
};
