/*
  Module de maintenance : Socle transversal
  ID : core-status-links
  Critères : RGAA 6, RGAA 7 / WCAG 2.4.4, 4.1.3
  Bundle exécuté : ../accessibilite.js

  Fonctions du bundle suivies par ce module :
    - ensureA11yStatusRegions
  - announceA11y
  - clearA11yAnnouncements
  - enhanceBlankTargetLinks
  - enhanceVisibleLabelInAccessibleName
  - wireMaxLenDelegation
  - wireRelevanceHandlers

  Tests associés : AUTO-01, AUTO-02, MAN-01, MAN-02

  Note : ce fichier est volontairement documentaire. LimeSurvey charge le bundle
  unique `files/accessibilite.js`; le découpage ci-dessous sert à maintenir,
  auditer et relire les correctifs par famille de question sans multiplier
  les dépendances de chargement côté thème.
*/

window.LSA11yMaintenanceModules = window.LSA11yMaintenanceModules || {};
window.LSA11yMaintenanceModules["core-status-links"] = {
  "id": "core-status-links",
  "family": "Socle transversal",
  "criteria": "RGAA 6, RGAA 7 / WCAG 2.4.4, 4.1.3",
  "functions": [
    "ensureA11yStatusRegions",
    "announceA11y",
    "clearA11yAnnouncements",
    "enhanceBlankTargetLinks",
    "enhanceVisibleLabelInAccessibleName",
    "wireMaxLenDelegation",
    "wireRelevanceHandlers"
  ],
  "test_refs": [
    "AUTO-01",
    "AUTO-02",
    "MAN-01",
    "MAN-02"
  ]
};
