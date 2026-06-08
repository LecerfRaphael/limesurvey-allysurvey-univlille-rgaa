# NC-R058 - Langue des passages et dependance createurs

Reference : RGAA 8.7 / WCAG 3.1.2 [AA]

Statut : partiel. Le theme corrige les passages explicitement marques, mais ne peut pas garantir la detection automatique des passages etrangers non marques dans les libelles rediges par les createurs.

## Etat technique

La fonction `initPassageLanguageHints(root)` couvre les marquages explicites suivants :

- token texte `[lang=en]...[/lang]` ;
- attributs `data-lang`, `data-ls-lang` et `data-language` ;
- classes CSS de type `lang-en`, `lang-es`, `lang-de`.

Quand un marquage est present, le theme injecte `lang="..."` et `xml:lang="..."` sur le passage concerne. Pour les tokens `[lang=xx]...[/lang]`, le token est remplace par un `span` accessible afin que le marqueur technique ne soit plus visible dans le questionnaire.

## Limite structurelle

Un libelle sans marquage explicite ne peut pas etre corrige automatiquement de facon fiable.

Exemple :

```text
Merci de deposer votre Learning Agreement.
```

Le theme ne peut pas determiner avec certitude que `Learning Agreement` doit etre prononce en anglais : il peut s'agir d'un titre officiel, d'un nom propre, d'un sigle, d'une expression devenue usuelle ou d'un passage a baliser. Une detection purement heuristique produirait des faux positifs et pourrait ajouter une langue incorrecte.

La conformite de `NC-R058` depend donc du processus de creation des questionnaires, pas uniquement du theme.

## Mesures compensatoires

Les mesures suivantes sont disponibles :

- guide createurs : `docs/GUIDE-CREATEURS-LANGUE-PASSAGES.md` ;
- exemples de tokens `[lang=xx]...[/lang]` dans le guide ;
- prise en charge des attributs HTML `data-lang`, `data-ls-lang`, `data-language` ;
- prise en charge des classes `lang-xx` ;
- linter optionnel `tests/accessibilite/lint-language-passages.js` pour signaler des passages suspects.

Le linter aide a reperer des mots-cles anglais courants dans un contenu francais, mais il ne remplace pas la validation humaine.

## Test manuel rattache

Le test de preuve est `MAN-25` dans `tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md`.

Il doit verifier :

- un passage marque avec `[lang=en]...[/lang]` ;
- un passage marque via `data-ls-lang="en"` ou `class="lang-en"` ;
- un passage volontairement non marque, conserve comme reste a charge createur.

## Condition de levee

`NC-R058` peut passer de partiel a conforme uniquement si deux conditions sont reunies :

- le theme continue a transformer correctement tous les passages explicitement marques ;
- le processus createur impose une relecture editoriale ou un controle equivalent garantissant le marquage des passages en langue etrangere avant publication.
