# Matrice de tests RGAA / WCAG — thème LimeSurvey accessible

Cette matrice sert de preuve de non-régression après modification de `files/accessibilite.js` ou des templates Twig.

| ID | Type | Famille | Objet du test | Action / commande | Résultat attendu / preuve |
|---|---|---|---|---|---|
| AUTO-01 | Automatisé statique | Socle statut | Présence du registre window.LSA11yMaintenance et des zones status/alert | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-02 | Automatisé statique | Liens nouvelle fenêtre | Aucun target=_blank sans rel noopener noreferrer dans Twig/HTML | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-03 | Automatisé statique | Handlers PJAX | Présence d'un unique écouteur pjax:success dans accessibilite.js | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-04 | Automatisé statique | Erreurs champs | Présence des helpers aria-describedby / aria-invalid | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-05 | Automatisé statique | Autocomplete | Présence de enhanceStandardAutocomplete et des tokens standard | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-06 | Automatisé statique | Questions standard | Présence des familles Autre, dates, multiple-opt-comments | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-07 | Automatisé statique | Matrices | Présence caption/scope/headers dans enhanceArrayTableSemantics | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-08 | Automatisé statique | Reflow | Présence initReflowZoomSupport et styles reflow dans custom.css | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-09 | Automatisé statique | Classement | Présence initRankingQuestionsA11y et synchronisation select/java input | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| AUTO-10 | Automatisé statique | Syntaxe | node --check sur accessibilite.js et scripts/custom.js | node tests/accessibilite/run-static-a11y-checks.js | OK si PASS |
| MAN-01 | Manuel clavier + lecteur écran | Lien d'évitement | Tab depuis le haut de page ; activer Aller au contenu principal | Le focus arrive sur main#main-content et le questionnaire est annoncé | NVDA/JAWS + Chrome/Firefox |
| MAN-02 | Manuel lecteur écran | Messages de statut | Déclencher un réglage barre accessibilité puis une erreur bloquante | Une seule annonce pertinente ; pas de répétition concurrente | NVDA Speech Viewer conseillé |
| MAN-03 | Manuel formulaire | Champ obligatoire texte | Soumettre une page avec champ texte obligatoire vide | Erreur reliée au champ, aria-invalid=true, aria-describedby pointe vers l'erreur | Inspecteur navigateur + NVDA |
| MAN-04 | Manuel formulaire | Radio/checkbox obligatoire | Soumettre une page avec groupe obligatoire vide | Message associé au groupe/contrôles ; correction retire l'état invalide | Clavier seul |
| MAN-05 | Manuel formulaire | NC-R0311 - Objectif des champs | Créer/tester questions Nom, Prénom, Email, Téléphone, Adresse et un libellé atypique comme "Votre identifiant unique" ; contrôler aussi le marquage explicite `data-ls-autocomplete` | `autocomplete` adapté visible dans l'inspecteur ; les libellés atypiques non détectés restent à marquer explicitement par le créateur | Mobile + desktop + inspecteur |
| MAN-06 | Manuel question date | Date jour/mois/année | Saisir date complète puis incomplète | Input caché synchronisé ; erreur claire si incomplet | Clavier seul |
| MAN-07 | Manuel question Autre | Radio/checkbox avec Autre | Choisir puis décocher Autre | Champ commentaire activé/désactivé et requis seulement si pertinent | Clavier + lecteur écran |
| MAN-08 | Manuel question commentaire | multiple-opt-comments | Cocher une option avec commentaire attendu | Commentaire accessible et requis uniquement lorsque l'option est cochée | Clavier seul |
| MAN-09 | Manuel tableau | NC-R0412 - Array radio simple | Avec NVDA + Firefox, entrer dans une matrice radio simple puis naviguer avec Ctrl+Alt+Flèches sur au moins 3 cellules de réponse ; contrôler ensuite l'ordre Tab / Shift+Tab | NVDA annonce "ligne X, colonne Y" et l'en-tête de ligne + l'en-tête de colonne associés ; aucun `<th>` de matrice n'est atteint par Tab | NVDA Speech Viewer + inspection DOM |
| MAN-10 | Manuel tableau | NC-R015 / NC-R0412 - Array dual-scale / multi-flexi-text | Avec NVDA + Firefox, tester une matrice `array-flexible-dual-scale` avec `colspan`/`rowspan` irréguliers et une matrice `array-multi-flexi-text` ; naviguer avec `Ctrl+Alt+Flèches`, puis contrôler l'ordre Tab / Shift+Tab et refaire le parcours à 320 px CSS | Caption, position "ligne X, colonne Y", en-têtes multiples de colonnes et de lignes sont annoncés simultanément sur chaque cellule de réponse ; ordre de tabulation sans focus parasite sur `<th>` ni en-tête de colonne avant cellule de réponse | NVDA Speech Viewer + Firefox Responsive Design Mode |
| MAN-11 | Manuel zoom | Zoom navigateur 200 % | Naviguer dans questionnaire complet à 200 % | Pas de perte de fonction, pas de texte tronqué | Chrome/Firefox |
| MAN-12 | Manuel reflow | Largeur 320 px CSS | Tester barre, boutons, matrices et footer | Pas de défilement horizontal global ; zones larges focusables si défilement interne | DevTools responsive |
| MAN-13 | Manuel espacement | NC-R0210 - Espacement texte WCAG 1.4.12 | Pour chaque variation couleur, activer `body.a11y-spacing`, puis `body.a11y-spacing` + `body.a11y-dyslexia`, sur un questionnaire complexe : matrices avec libellés longs, classement, date multi-champs | Aucun chevauchement de texte, débordement de bouton, champ tronqué ou rupture de mise en page ; les cellules restent lisibles grâce à `overflow-wrap:anywhere` et `min-width:0` | Contrôle visuel Firefox/Chrome, 320 px CSS + desktop |
| MAN-14 | Manuel classement | Question classement | Modifier plusieurs listes/selects de classement | Valeur enregistrée sur la bonne ligne ; navigation clavier possible | Clavier seul |
| MAN-15 | Manuel PJAX | Navigation entre groupes | Aller-retour sur 3 groupes puis provoquer une erreur | Pas de double alerte, pas de double validation, focus cohérent | Console + NVDA |
| MAN-16 | Manuel titre dynamique | Onglet navigateur / lecteur écran | Naviguer entre groupes | Title = Page X/Y – Groupe – Enquête | Lecture titre page NVDA |
| MAN-17 | Manuel composant | Slider | Manipuler un slider au clavier : Tab, Flèches, Home, End ; contrôler les attributs `role=slider`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` | La valeur change dans le bon sens, reste dans les bornes, est annoncée par le lecteur d'écran et synchronisée avec la réponse LimeSurvey | Clavier + NVDA/Firefox + inspecteur |
| MAN-18 | Manuel composant | Upload fichier | Sélectionner, remplacer puis supprimer un fichier ; tester erreur de format ou taille si configurée | Le bouton et le champ fichier ont un nom accessible, l'aide et les erreurs sont reliées au champ, l'état invalide est annoncé et corrigé après action utilisateur | Clavier + NVDA + inspecteur |
| MAN-19 | Manuel pages de fin | Page de confirmation | Terminer un questionnaire et lire la page de fin, messages, liens, boutons et éventuel récapitulatif | Le focus arrive sur `main`, le titre de page est cohérent, les messages sont annoncés, aucun piège clavier ni perte de reflow | NVDA/Firefox + clavier |
| MAN-20 | Manuel pages hors questionnaire | Résultats publics / impression réponses | Ouvrir une page de résultats publics, d'impression ou de récapitulatif avec tableaux et médias | Les sections, tableaux et médias restent lisibles à 320 px CSS ; les tableaux larges sont dans une région focusable nommée | 320 px CSS + clavier + capture |
| MAN-21 | Manuel VoiceOver macOS | Safari macOS | Parcourir un questionnaire complexe avec VoiceOver Safari : titres, champs obligatoires, erreurs, matrices, boutons de navigation | L'ordre de lecture est cohérent, les noms/rôles/états sont annoncés, les erreurs et en-têtes de matrices restent compréhensibles | VoiceOver macOS + Safari |
| MAN-22 | Manuel VoiceOver iOS | Safari iOS | Parcourir le même questionnaire au toucher et au rotor : champs texte, radios, dates, matrices reflow, classement, upload si disponible | Le focus tactile suit l'ordre visuel, les contrôles sont actionnables, les annonces VoiceOver restent explicites sans chevauchement ni perte de contenu | VoiceOver iOS + Safari |
| MAN-23 | Manuel session | Expiration de session | Simuler l'approche d'expiration puis activer prolonger / laisser expirer | L'avertissement est annoncé une seule fois, le dialogue est modal et utilisable au clavier, prolonger restaure la session, l'expiration donne un message clair | NVDA/Firefox + console réseau |
| MAN-24 | Manuel variations | NC-R0210 - 8 variations couleurs + espacement | Pour chaque variation, activer `body.a11y-spacing` seul puis avec `body.a11y-dyslexia` et tester matrices, classement, dates multi-champs, upload et sliders | Aucune rupture visuelle : textes, boutons, cellules, champs et aides restent dans leur conteneur en desktop, 200 % et 320 px CSS | Captures par variation + desktop/mobile |
| MAN-25 | Manuel contenu | NC-R058 - Langue des passages | Créer trois libellés : un passage marqué `[lang=en]Learning Agreement[/lang]`, un passage HTML `data-ls-lang="en"` ou `class="lang-en"`, et un passage anglais non marqué ; prévisualiser le questionnaire | Les passages marqués reçoivent `lang` / `xml:lang` et les tokens ne sont plus visibles ; le passage non marqué reste à corriger par le créateur et doit être signalé dans la preuve éditoriale | Inspecteur navigateur + guide créateurs + linter optionnel |

## Journal MAN-09 / MAN-10 - NVDA + Firefox

Objectif de validation : lever NC-R01, NC-R04, NC-R015 et NC-R0412 sur les matrices en confirmant la navigation tableau NVDA réelle, l'annonce de position "ligne X, colonne Y", l'annonce simultanée des en-têtes de ligne et de colonne, et l'ordre de tabulation réel au clavier.

Périmètre minimal à exécuter :

- MAN-09 : une matrice `array-flexible-row` radio simple.
- MAN-10 : une matrice `array-flexible-dual-scale` avec `colspan`/`rowspan` irréguliers.
- MAN-10 : une matrice `array-multi-flexi-text`.

Procédure commune :

1. Ouvrir le questionnaire dans Firefox avec NVDA actif et Speech Viewer ouvert.
2. Placer le curseur NVDA dans la matrice, puis parcourir les cellules de réponse avec `Ctrl+Alt+Flèche haut/bas/gauche/droite`.
3. Relever pour chaque matrice au moins trois cellules représentatives : première ligne, ligne intermédiaire, dernière ligne ou second groupe d'échelle.
4. Pour `NC-R015`, inclure au moins une cellule rattachée à plusieurs en-têtes de colonnes ou à un groupe d'échelle issu d'un `colspan`/`rowspan`.
5. Confirmer que NVDA annonce la position de type "ligne X, colonne Y" ainsi que tous les en-têtes de ligne et de colonne applicables.
6. Parcourir la matrice au clavier avec Tab puis Shift+Tab et vérifier que les `<th>` ne reçoivent pas le focus ; seuls les contrôles de réponse et, si nécessaire, le conteneur défilable sont focusables.
7. Pour MAN-10, répéter le parcours à 320 px CSS dans Firefox Responsive Design Mode.

Résultat attendu avant clôture : les trois matrices sont conformes ; si une annonce d'en-tête manque, conserver la NC ouverte et joindre la cellule, le type de matrice et l'extrait Speech Viewer.

## Journal MAN-13 - Espacement + dyslexie sur variations

Objectif de validation : lever NC-R0210 en confirmant que les 8 variations Fruity supportent `body.a11y-spacing` seul, puis l'activation simultanée `body.a11y-spacing` + `body.a11y-dyslexia`, sans chevauchement, débordement de boutons ni rupture de formulaire complexe.

Variations à couvrir :

- `apple_blossom`
- `bay_of_many`
- `black_pearl`
- `free_magenta`
- `purple_tentacle`
- `sea_green`
- `skyline_blue`
- `sunset_orange`

Parcours minimal par variation :

1. Ouvrir un questionnaire de test dans Firefox ou Chrome avec la variation active.
2. Activer `body.a11y-spacing` seul et contrôler les écrans.
3. Activer ensuite simultanément `body.a11y-spacing` et `body.a11y-dyslexia`.
4. Vérifier au moins une matrice simple ou dual-scale avec libellés longs, une matrice `array-multi-flexi-text`, une question de classement et une date multi-champs.
5. Tester en desktop, à 200 % de zoom, puis à 320 px CSS.
6. Confirmer qu'aucun libellé, bouton, cellule, champ date, item de classement ou contrôle de matrice ne déborde de son conteneur.

Résultat attendu avant clôture : les 8 variations sont conformes ; si une anomalie subsiste, conserver NC-R0210 ouverte et noter la variation, le type de question, la largeur de viewport et une capture.

## Journal MAN-17 à MAN-25 - preuves manuelles complémentaires

Objectif de validation : compléter la preuve RGAA sur les composants et environnements qui ne peuvent pas être couverts par les contrôles statiques seuls : sliders, upload, pages de fin, VoiceOver, session timeout et variations couleurs avec espacement.

Préparer au minimum :

- un questionnaire de test avec slider, upload, matrice simple, dual-scale, multi-flexi-text, classement et date multi-champs ;
- un scénario de page de fin / confirmation ;
- une page de résultats publics, d'impression ou de récapitulatif avec tableau ;
- Firefox + NVDA, Safari macOS + VoiceOver, Safari iOS + VoiceOver ;
- les 8 variations Fruity listées dans MAN-13.

Preuves à conserver :

- captures écran desktop, 200 % et 320 px CSS quand le test est visuel ;
- extraits Speech Viewer NVDA ou notes VoiceOver pour les annonces ;
- navigateur, système, lecteur d'écran et versions ;
- état final : conforme, à surveiller ou non conforme, avec lien vers correction si besoin.

## Journal MAN-25 - Langue des passages

Objectif de validation : documenter `NC-R058` en confirmant que le theme applique `lang` uniquement sur les passages explicitement marques, et que les passages etrangers non marques restent une responsabilite editoriale des createurs.

Procedure :

1. Creer un libelle avec le token `[lang=en]Learning Agreement[/lang]`.
2. Creer un second libelle ou bloc HTML avec `data-ls-lang="en"` ou `class="lang-en"`.
3. Creer un troisieme libelle volontairement non marque, par exemple `Merci de deposer votre Learning Agreement`.
4. Previsualiser le questionnaire et inspecter le DOM.
5. Verifier que les deux passages marques portent `lang="en"` et `xml:lang="en"`.
6. Verifier que les tokens `[lang=...]` ne sont plus visibles dans la page rendue.
7. Lancer si besoin `node tests/accessibilite/lint-language-passages.js <export.html>` pour reperer les passages suspects non marques.

Resultat attendu avant cloture : les passages marques sont corriges automatiquement ; les passages non marques sont listes dans la preuve comme correction createur obligatoire. `NC-R058` reste partielle tant que le processus editorial ne garantit pas le marquage systematique des passages en langue etrangere.
