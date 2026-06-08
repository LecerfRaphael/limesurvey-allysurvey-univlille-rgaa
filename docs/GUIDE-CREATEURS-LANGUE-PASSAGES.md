# Guide createurs - Langue des passages (WCAG 3.1.2)

Ce guide aide les equipes de l'Universite de Lille a produire des questionnaires LimeSurvey conformes au critere WCAG 3.1.2, sans intervention technique.

## Pourquoi c'est important

La non-conformite NC-R05 / NC-R058 concerne les passages dans une autre langue qui ne sont pas signales dans le code de la page.

Exemple courant :

> Merci de televerser votre *Learning Agreement*.

Si le questionnaire est en francais, un lecteur d'ecran francais prononce souvent les mots anglais avec une voix ou une prononciation francaise. Pour les personnes qui ecoutent le questionnaire, cela peut rendre le contenu incomprehensible.

La correction consiste a indiquer la langue du passage concerne. Le theme accessible transforme automatiquement les marqueurs de langue en balisage HTML conforme.

## Regle simple

Quand un mot, une expression ou une phrase est dans une autre langue que celle du questionnaire, encadrez ce passage avec un token :

```text
[lang=en]Learning Agreement[/lang]
```

Dans le questionnaire, le texte reste lisible. Dans la page affichee, le theme remplace le token par un balisage avec `lang="en"` et `xml:lang="en"`.

## Ce que detecte automatiquement le theme

La fonction `initPassageLanguageHints(root)` detecte uniquement les passages marques explicitement par les createurs ou par un gabarit HTML :

- tokens dans les libelles : `[lang=en]Learning Agreement[/lang]` ;
- attributs HTML : `data-lang="en"`, `data-ls-lang="en"` ou `data-language="en"` ;
- classes CSS : `lang-en`, `lang-es`, `lang-de`, etc.

Quand l'un de ces marqueurs est trouve, le theme injecte automatiquement `lang="..."` et `xml:lang="..."` sur l'element concerne. Les tokens texte sont remplaces par un `<span>` accessible ; ils ne doivent plus etre visibles dans la previsualisation du questionnaire.

Limite importante : un libelle sans marquage explicite ne peut pas etre corrige automatiquement de facon fiable. Par exemple, dans `Merci de deposer votre Learning Agreement`, le theme ne peut pas savoir avec certitude que `Learning Agreement` doit etre prononce en anglais. La conformite NC-R05 / NC-R058 depend donc de la pratique editoriale des createurs.

Pour reduire les oublis, un linter optionnel est fourni. Il signale des passages suspects, mais il ne remplace pas la relecture humaine.

## Exemples prets a copier

Mot anglais dans une question :

```text
Quel est votre niveau de maitrise de [lang=en]data analysis[/lang] ?
```

Expression anglaise dans une aide :

```text
Joignez le document [lang=en]Learning Agreement[/lang] signe par votre composante.
```

Phrase entiere en anglais :

```text
[lang=en]Please upload your transcript of records.[/lang]
```

Titre d'un service ou d'un programme :

```text
Avez-vous participe au programme [lang=en]Erasmus Blended Intensive Programme[/lang] ?
```

Passage espagnol :

```text
Indiquez si vous avez obtenu le certificat [lang=es]Diploma de Espanol como Lengua Extranjera[/lang].
```

Passage allemand :

```text
Avez-vous suivi le module [lang=de]Deutsch als Fremdsprache[/lang] ?
```

## Dans l'editeur LimeSurvey

Dans le champ de texte de la question, du sous-texte d'aide, du libelle de reponse ou du message de fin :

1. Ecrivez le texte normalement.
2. Reperez les passages qui ne sont pas dans la langue principale du questionnaire.
3. Encadrez chaque passage avec `[lang=code]` et `[/lang]`.
4. Enregistrez la question.
5. Lancez la previsualisation et verifiez que les tokens ne sont plus visibles dans la page affichee.

Exemple a saisir dans l'editeur :

```text
Merci de deposer votre [lang=en]Learning Agreement[/lang] au format PDF.
```

Le rendu visible attendu est :

```text
Merci de deposer votre Learning Agreement au format PDF.
```

Le balisage de langue est ajoute automatiquement par le theme.

## Langues courantes

Utilisez de preference les codes BCP 47 courts suivants :

| Langue | Code |
|---|---|
| Anglais | `en` |
| Anglais britannique | `en-GB` |
| Anglais americain | `en-US` |
| Espagnol | `es` |
| Allemand | `de` |
| Italien | `it` |
| Portugais | `pt` |
| Neerlandais | `nl` |
| Chinois | `zh` |
| Japonais | `ja` |
| Arabe | `ar` |
| Ukrainien | `uk` |
| Polonais | `pl` |
| Roumain | `ro` |

Si une langue manque, demandez le code a l'equipe referente accessibilite ou utilisez le registre BCP 47 habituel de votre outil editorial.

## Cas ou il ne faut pas baliser

Ne balisez pas :

- les noms propres de personnes ;
- les sigles tres connus : `PDF`, `URL`, `UE`, `CV` ;
- les adresses mail, liens, codes administratifs ou identifiants ;
- les noms officiels qui doivent rester prononces tels quels si leur langue n'est pas identifiable.

En cas de doute, balisez le passage si sa comprehension depend de la prononciation dans la bonne langue.

## Variante HTML avancee

Si vous utilisez le mode source HTML de l'editeur, vous pouvez aussi marquer un passage avec un attribut :

```html
<span data-lang="en">Learning Agreement</span>
```

Les attributs reconnus par le theme sont :

- `data-lang="en"`
- `data-ls-lang="en"`
- `data-language="en"`
- `class="lang-en"`

Pour les createurs, la methode recommandee reste le token texte `[lang=en]...[/lang]`, plus simple a relire et a copier.

## Checklist avant publication

- Les passages en anglais, espagnol, allemand ou autre langue sont reperes.
- Chaque passage utile est encadre avec `[lang=code]...[/lang]`.
- Les tokens sont bien fermes avec `[/lang]`.
- La previsualisation n'affiche plus les tokens bruts.
- Les passages restent comprehensibles si le questionnaire est lu avec un lecteur d'ecran.

## Controle optionnel

Un controle automatique peut aider a reperer des oublis probables dans un export ou un fichier de contenu :

```powershell
node tests/accessibilite/lint-language-passages.js chemin\vers\questionnaire.html
```

Le linter signale seulement des suspicions, par exemple des mots anglais frequents dans un libelle francais sans token `[lang=en]`. Une alerte doit toujours etre relue par une personne avant correction.
