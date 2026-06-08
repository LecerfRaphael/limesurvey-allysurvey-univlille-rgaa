# Audit WCAG 2.5.3 - Etiquette visible dans le nom accessible

## Objectif

Confirmer que les controles interactifs du theme respectent WCAG 2.5.3 : quand un bouton ou un lien affiche une etiquette visible, le nom accessible annonce par le lecteur d'ecran contient cette etiquette visible.

Perimetre demande :

- boutons de navigation du questionnaire : Precedent, Suivant, Envoyer ;
- boutons de la barre d'accessibilite ;
- boutons du footer ;
- liens du pied de page.

## Mecanisme en place

La fonction `enhanceVisibleLabelInAccessibleName(root)` du bundle `files/accessibilite.js` couvre les boutons de navigation et de soumission LimeSurvey :

- `#ls-button-submit`
- `button[name='move']`
- `input[type='submit'][name='move']`
- `.ls-move-previous-btn`
- `.ls-move-next-btn`
- `.ls-move-submit-btn`
- `button[type='submit']`
- `input[type='submit']`

Elle ajoute `data-ls-a11y-label-in-name="1"` sur les controles traites et corrige les cas ou `aria-label`, `aria-labelledby` ou `title` risquent de masquer l'etiquette visible.

## Corrections statiques V275

Les points suivants ont ete ajustes pour que le nom accessible commence par l'etiquette visible :

| Element | Etiquette visible | Nom accessible attendu |
|---|---|---|
| Bouton taille texte moins | `A-` | `A- - Reduire la taille du texte` |
| Bouton taille texte plus | `A+` | `A+ - Augmenter la taille du texte` |
| Logo footer Universite de Lille | `Universite de Lille` via `alt` image | `Universite de Lille - site officiel, nouvelle fenetre` |

Les boutons texte de la barre d'accessibilite n'ont pas besoin de correction quand leur contenu visible constitue deja le nom accessible :

- `Contraste eleve`
- `Mode dyslexie`
- `Noir et blanc`
- `Espacement augmente`
- `Reinitialiser les reglages`

Les boutons purement iconographiques de la barre n'ont pas d'etiquette visible textuelle ; ils doivent toutefois rester controles pour leur nom accessible :

- bouton d'ouverture : `Ouvrir les options d'accessibilite`
- bouton de fermeture : `Fermer les options d'accessibilite`

## Protocole NVDA

Environnement de preuve recommande :

- Firefox ;
- NVDA avec mode parole actif ;
- Speech Viewer ouvert ;
- questionnaire de test contenant au moins une page intermediaire et une page finale.

Etapes :

1. Ouvrir le questionnaire de test dans Firefox.
2. Activer NVDA et Speech Viewer.
3. Naviguer au clavier avec `Tab` jusqu'aux boutons de navigation LimeSurvey.
4. Pour chaque controle, relever le texte visible et l'annonce NVDA.
5. Ouvrir la barre d'accessibilite, puis parcourir tous ses boutons avec `Tab`.
6. Aller jusqu'au pied de page et parcourir les liens.
7. Confirmer que l'annonce NVDA contient exactement l'etiquette visible lorsque cette etiquette existe.

## Grille de resultat attendue

| Zone | Controle | Texte visible | Annonce NVDA attendue | Statut |
|---|---|---|---|---|
| Navigation survey | Precedent | `Precedent` | `Precedent, bouton` | A confirmer NVDA |
| Navigation survey | Suivant | `Suivant` | `Suivant, bouton` | A confirmer NVDA |
| Navigation survey | Envoyer | `Envoyer` | `Envoyer, bouton` | A confirmer NVDA |
| Barre a11y | Ouvrir options | Icone seule | `Ouvrir les options d'accessibilite, bouton` | A confirmer NVDA |
| Barre a11y | Fermer options | Icone seule | `Fermer les options d'accessibilite, bouton` | A confirmer NVDA |
| Barre a11y | Diminuer texte | `A-` | `A- - Reduire la taille du texte, bouton` | Corrige statiquement, a confirmer NVDA |
| Barre a11y | Augmenter texte | `A+` | `A+ - Augmenter la taille du texte, bouton` | Corrige statiquement, a confirmer NVDA |
| Barre a11y | Contraste | `Contraste eleve` | `Contraste eleve, bouton bascule` ou annonce equivalente avec etat | A confirmer NVDA |
| Barre a11y | Dyslexie | `Mode dyslexie` | `Mode dyslexie, bouton bascule` ou annonce equivalente avec etat | A confirmer NVDA |
| Barre a11y | Noir et blanc | `Noir et blanc` | `Noir et blanc, bouton bascule` ou annonce equivalente avec etat | A confirmer NVDA |
| Barre a11y | Espacement | `Espacement augmente` | `Espacement augmente, bouton bascule` ou annonce equivalente avec etat | A confirmer NVDA |
| Barre a11y | Reinitialisation | `Reinitialiser les reglages` | `Reinitialiser les reglages, bouton` | A confirmer NVDA |
| Footer | Logo Universite de Lille | `Universite de Lille` | `Universite de Lille - site officiel, nouvelle fenetre, lien` | Corrige statiquement, a confirmer NVDA |
| Footer | Support videos | `Utilisation & support` | `Utilisation & support nouvelle fenetre, lien` | A confirmer NVDA |
| Footer | Contact mail | `support-limesurvey@univ-lille.fr` | `support-limesurvey@univ-lille.fr, lien` | A confirmer NVDA |

## Criteres de validation

Conforme si :

- le texte visible est present dans le nom accessible annonce ;
- l'ordre de l'annonce commence par le texte visible pour les controles avec etiquette textuelle ;
- l'etat `aria-pressed` des boutons de la barre est annonce quand il change ;
- l'information `nouvelle fenetre` reste disponible pour les liens externes du footer ;
- aucune annonce concurrente ne remplace le nom du controle.

Non conforme si :

- NVDA annonce un nom qui ne reprend pas l'etiquette visible ;
- un `aria-label` masque le texte visible ;
- le lien logo est annonce sans `Universite de Lille` ;
- un bouton iconographique est annonce comme `bouton` sans nom.

## Conclusion

L'audit statique V275 confirme la presence de la fonction de correction sur les boutons de navigation et les corrections de nom accessible sur la barre d'accessibilite et le footer. La preuve opposable reste le passage NVDA avec Speech Viewer selon la grille ci-dessus.
