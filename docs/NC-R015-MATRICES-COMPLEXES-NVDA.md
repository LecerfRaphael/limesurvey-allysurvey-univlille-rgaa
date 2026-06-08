# NC-R015 - Matrices complexes et navigation tableau NVDA

## Statut

Non conforme tant que le test manuel NVDA n'est pas execute et documente.

## Reference

- RGAA critere 5.8
- WCAG 1.3.1 niveau A
- Type de risque : associations cellule / en-tetes dans des tableaux de donnees complexes

## Perimetre

La non-conformite concerne les matrices LimeSurvey complexes :

- `array-flexible-dual-scale` ;
- `array-multi-flexi` ;
- `array-multi-flexi-text` ;
- cas avec `colspan` ou `rowspan` irreguliers ;
- cellules de reponse rattachees a plusieurs en-tetes de colonnes ou a un groupe d'echelle.

## Etat du code

La fonction `enhanceArrayTableSemantics(root)` injecte les elements attendus :

- `caption` pour nommer le tableau ;
- `scope="col"`, `scope="colgroup"`, `scope="row"` ou `scope="rowgroup"` selon les cellules ;
- `headers` sur les cellules de reponse ;
- nettoyage des `tabindex` parasites sur les en-tetes `<th>`.

Les controles statiques verifient aussi la presence de la grille `colspan` / `rowspan` via `buildTableGrid` et `parseSpan`.

## Limite restante

Ces controles ne prouvent pas a eux seuls que NVDA annonce correctement les associations multiples dans Firefox. Le comportement doit etre valide avec un lecteur d'ecran reel en navigation tableau.

## Test obligatoire

Le test de cloture est `MAN-10` dans `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.

Procedure minimale :

1. Ouvrir dans Firefox un questionnaire contenant une matrice `array-flexible-dual-scale` avec `colspan` / `rowspan` irreguliers.
2. Activer NVDA et Speech Viewer.
3. Placer le curseur NVDA dans la matrice.
4. Parcourir les cellules de reponse avec `Ctrl+Alt+Fleche haut/bas/gauche/droite`.
5. Relever au moins trois cellules, dont une cellule rattachee a plusieurs en-tetes de colonnes ou a un second groupe d'echelle.
6. Confirmer que NVDA annonce la position `ligne X, colonne Y` et tous les en-tetes applicables.
7. Refaire le controle sur une matrice `array-multi-flexi-text`.
8. Verifier au clavier que les `<th>` ne recoivent pas le focus via Tab.

## Preuves attendues

- Extrait Speech Viewer NVDA pour chaque cellule representative.
- Type exact de matrice.
- Navigateur et version.
- Version NVDA.
- Capture ou export DOM montrant `caption`, `scope` et `headers`.
- Statut final : conforme, a surveiller ou non conforme.

## Condition de levee

`NC-R015` peut etre levee uniquement si `MAN-10` confirme que les matrices dual-scale et multi-flexi-text annoncent correctement les en-tetes multiples avec NVDA + Firefox.
