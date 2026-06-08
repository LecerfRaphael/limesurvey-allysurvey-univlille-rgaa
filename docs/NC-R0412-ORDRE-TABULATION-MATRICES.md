# NC-R0412 - Ordre de tabulation dans les matrices

Reference : RGAA 12.9 / WCAG 2.4.3 [A]

Statut : non conforme tant que le parcours clavier reel n'a pas ete valide avec NVDA + Firefox sur un questionnaire rendu.

## Perimetre

La verification couvre les matrices LimeSurvey dont la structure peut perturber l'ordre de focus :

- matrice radio simple `array-flexible-row` ;
- matrice `array-flexible-dual-scale` avec `colspan` / `rowspan` irreguliers ;
- matrice `array-multi-flexi-text` ou multi-flexi equivalente ;
- affichage standard et affichage reflow a 320 px CSS.

## Etat technique

La fonction `enhanceArrayTableSemantics(root)` ajoute les associations `caption`, `scope` et `headers`.

La fonction `removeMatrixCellTabStops(table)` neutralise le risque de focus parasite :

- suppression de `tabindex` sur tous les `<th>` de matrice ;
- suppression de `tabindex` sur les cellules non interactives ;
- conservation du focus uniquement sur les controles de reponse et, si necessaire, sur le conteneur de defilement horizontal ;
- marquage `data-ls-a11y-tabstop-cleaned` pour eviter les retraitements PJAX.

Ces controles statiques reduisent le risque, mais ils ne prouvent pas l'ordre reel annonce par une technologie d'assistance dans Firefox.

## Test manuel obligatoire

Le test de cloture est rattache a `MAN-09` et `MAN-10` dans `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.

Procedure attendue :

1. Ouvrir Firefox avec NVDA actif et Speech Viewer ouvert.
2. Placer le focus avant la matrice, puis parcourir la page avec `Tab`.
3. Verifier que les en-tetes `<th>` ne recoivent jamais le focus.
4. Verifier que l'ordre suit les controles de reponse dans l'ordre visuel et logique de la matrice.
5. Revenir avec `Shift+Tab` pour confirmer l'ordre inverse.
6. Dans la matrice, parcourir aussi les cellules avec `Ctrl+Alt+Fleches`.
7. Confirmer que NVDA annonce la position `ligne X, colonne Y` et les en-tetes de ligne et de colonne applicables.
8. Repeter sur une matrice dual-scale irreguliere, une matrice multi-flexi-text et a 320 px CSS.

## Preuves attendues

Pour lever `NC-R0412`, joindre au dossier d'audit :

- version de Firefox et de NVDA ;
- extrait Speech Viewer ou transcription du parcours ;
- sequence de focus Tab / Shift+Tab ;
- capture DOM montrant l'absence de `tabindex` sur les `<th>` ;
- identification des matrices testees.

## Condition de levee

`NC-R0412` peut etre levee uniquement si `MAN-09` et `MAN-10` confirment qu'aucun en-tete de matrice n'entre dans l'ordre de tabulation et qu'aucun en-tete de colonne n'est atteint avant une cellule de reponse.
