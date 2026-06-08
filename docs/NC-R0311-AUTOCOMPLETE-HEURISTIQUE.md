# NC-R0311 - Autocomplete heuristique et libelles atypiques

## Statut

Non conforme tant que les champs personnels atypiques ne sont pas verifies ou marques explicitement dans les questionnaires de test.

## Reference

- RGAA critere 11.13
- WCAG 1.3.5 niveau AA
- Type de risque : objectif de champ personnel non expose par un attribut `autocomplete` standard

## Perimetre

La fonction `enhanceStandardAutocomplete(root)` ajoute automatiquement `autocomplete` sur les champs personnels reconnus par mots-cles dans les libelles, aides, conteneurs et attributs.

Exemples couverts par heuristique :

- nom ;
- prenom ;
- email / courriel ;
- telephone ;
- adresse ;
- code postal ;
- ville ;
- pays ;
- date de naissance ;
- identifiant / login / username.

## Limite connue

La detection reste heuristique. Si un createur utilise un libelle inhabituel ou trop contextuel, le token attendu peut ne pas etre ajoute.

Exemple sensible :

```text
Votre identifiant unique
```

Ce libelle peut designer un `username`, un identifiant etudiant, un numero interne ou un autre code metier. Le theme ne peut pas toujours choisir automatiquement le bon token sans risque de faux positif.

## Marquage explicite recommande

Pour les champs personnels atypiques, le createur ou l'integrateur doit declarer explicitement l'objectif du champ.

Sur le champ :

```html
<input type="text" data-ls-autocomplete="username">
```

Sur le conteneur de la question ou de la ligne :

```html
<div class="question-container" data-ls-autocomplete="username">
  ...
</div>
```

Classes CSS supportees :

```html
<input type="text" class="autocomplete-username">
<input type="text" class="autofill-email">
<input type="text" class="purpose-tel">
```

Attributs supportes :

- `data-autocomplete`
- `data-ls-autocomplete`
- `data-a11y-autocomplete`
- `data-purpose`

Le token est applique seulement s'il fait partie de la liste HTML standard des valeurs `autocomplete`.

## Test obligatoire

Le test de cloture est `MAN-05` dans `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.

Procedure minimale :

1. Creer ou ouvrir un questionnaire contenant des champs : nom, prenom, email, telephone, adresse, code postal.
2. Verifier dans l'inspecteur que les attributs `autocomplete` sont presents.
3. Ajouter un champ avec un libelle atypique : `Votre identifiant unique`.
4. Verifier si l'heuristique ajoute `autocomplete="username"`.
5. Si le token n'est pas ajoute ou si le sens metier est ambigu, ajouter un marquage explicite, par exemple `data-ls-autocomplete="username"`.
6. Recharger la page et verifier que le token est applique.

## Preuves attendues

- Capture inspecteur pour un champ reconnu automatiquement.
- Capture inspecteur pour un champ atypique avant/apres marquage explicite.
- Liste des libelles atypiques rencontres.
- Decision : conforme, a surveiller ou non conforme.

## Condition de levee

`NC-R0311` peut etre levee uniquement si `MAN-05` confirme que les champs personnels courants sont couverts et que les champs atypiques du questionnaire modele disposent d'un marquage explicite quand l'heuristique ne suffit pas.
