# NC-R0210 - Mode espacement sur les 8 variations

## Statut

Non conforme tant que le test visuel sur les 8 variations de couleurs n'est pas execute et documente.

## Reference

- RGAA critere 10.8
- WCAG 1.4.12 niveau AA
- Type de risque : perte de contenu, chevauchement ou debordement apres modification de l'espacement du texte

## Perimetre

La non-conformite concerne le mode `body.a11y-spacing` sur toutes les variations Fruity :

- `apple_blossom`
- `bay_of_many`
- `black_pearl`
- `free_magenta`
- `purple_tentacle`
- `sea_green`
- `skyline_blue`
- `sunset_orange`

Les ecrans les plus sensibles sont :

- matrices avec libelles longs ;
- matrices `array-flexible-dual-scale` ;
- matrices `array-multi-flexi-text` ;
- questions de classement ;
- dates multi-champs ;
- boutons et aides longues.

## Etat du code

`css/custom.css` definit le mode `body.a11y-spacing` et les garde-fous generaux :

- retour a la ligne des textes longs ;
- `overflow-wrap:anywhere` sur les zones textuelles ;
- `min-width:0` sur les conteneurs flexibles ;
- hauteurs de boutons non figees ;
- reflow des matrices a faible largeur.

Les fichiers `css/variations/*.css` contiennent aussi une garde locale pour les formulaires complexes lorsque `body.a11y-spacing.a11y-dyslexia` est actif.

## Limite restante

La presence de CSS ne constitue pas une preuve visuelle opposable. Certaines variations peuvent modifier des couleurs, bordures, espacements, boutons ou composants herites d'une maniere qui provoque un chevauchement uniquement dans un rendu reel.

`NC-R0210` reste donc ouverte tant que les 8 variations n'ont pas ete controlees visuellement avec `body.a11y-spacing` actif.

## Tests obligatoires

Les tests de cloture sont :

- `MAN-13` pour le mode espacement et les formulaires complexes ;
- `MAN-24` pour la couverture complete des 8 variations.

Procedure minimale par variation :

1. Ouvrir un questionnaire de test avec la variation active.
2. Activer `body.a11y-spacing` seul.
3. Verifier matrices, libelles longs, classement, dates multi-champs, boutons et aides.
4. Tester en desktop, a 200 % de zoom, puis a 320 px CSS.
5. Activer ensuite `body.a11y-spacing` + `body.a11y-dyslexia` et refaire le controle rapide.
6. Confirmer l'absence de chevauchement, troncature, debordement horizontal non maitrise ou perte d'information.

## Preuves attendues

- Capture par variation.
- Largeur de viewport testee : desktop, 200 %, 320 px CSS.
- Type de question inspecte.
- Resultat : conforme, a surveiller ou non conforme.
- Capture et description precise si une variation echoue.

## Condition de levee

`NC-R0210` peut etre levee uniquement si les 8 variations sont conformes sur `MAN-13` et `MAN-24`.
