/*
  Module de maintenance : Question classement
  ID : ranking
  Critères : RGAA 7, RGAA 11 / WCAG 2.1.1, 4.1.2
  Bundle exécuté : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - initRankingQuestionsA11y

  Tests associés : AUTO-09, MAN-14

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le découpage ci-dessous sert à maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dépendances de chargement côté thème.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["ranking"] = {
  "id": "ranking",
  "family": "Question classement",
  "criteria": "RGAA 7, RGAA 11 / WCAG 2.1.1, 4.1.2",
  "functions": [
    "initRankingQuestionsA11y"
  ],
  "test_refs": [
    "AUTO-09",
    "MAN-14"
  ]
};
