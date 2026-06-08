#!/usr/bin/env node
/*
  Tests statiques de non-régression accessibilité.
  Usage depuis la racine du thème : node tests/accessibilite/run-static-a11y-checks.js
*/
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function pass(name) { console.log('PASS ' + name); }
function fail(name, details) { console.error('FAIL ' + name + (details ?' — ' + details : '')); process.exitCode = 1; }
function assert(name, condition, details) { condition ?pass(name) : fail(name, details); }
const access = read('files/accessibilite.js');
const custom = read('scripts/custom.js');
const css = read('css/custom.css');
const theme = read('css/theme.css');
const layout = read('views/layout_global.twig');
const languageGuide = read('docs/GUIDE-CREATEURS-LANGUE-PASSAGES.md');
const labelInNameAudit = read('docs/AUDIT-WCAG-253-LABEL-IN-NAME.md');
const ncR058Audit = read('docs/NC-R058-LANGUE-PASSAGES-CREATEURS.md');
const ncR015Audit = read('docs/NC-R015-MATRICES-COMPLEXES-NVDA.md');
const ncR0210Audit = read('docs/NC-R0210-VARIATIONS-ESPACEMENT.md');
const ncR0311Audit = read('docs/NC-R0311-AUTOCOMPLETE-HEURISTIQUE.md');
const ncR0412Audit = read('docs/NC-R0412-ORDRE-TABULATION-MATRICES.md');
const matrixMd = read('tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md');
const matrixCsv = read('tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv');
const variations = fs.readdirSync(path.join(root, 'css/variations')).filter((name) => /\.css$/i.test(name));
const variationCss = variations.map((name) => ({ name, content: read(path.join('css/variations', name)) }));
const variationsWithKeyframes = variationCss.filter((item) => /@keyframes/i.test(item.content));
assert('syntaxe accessibilite.js', (() => { try { new Function(access); return true; } catch(e) { return false; } })());
assert('syntaxe scripts/custom.js', (() => { try { new Function(custom); return true; } catch(e) { return false; } })());
assert('registre de maintenance exposé', /window\.LSA11yMaintenance/.test(access) && /LS_A11Y_MODULE_REGISTRY/.test(access));
assert('orchestration modulaire boot', /runA11yModule\("core-status-links"/.test(access) && /runA11yModule\("arrays-tables"/.test(access));
assert('listeners PJAX protégés', /__LS_REQUIRED_CLEANUP_OBS__/.test(access) && /__LS_SEQ_VALID_BOOT__/.test(access) && /__AUTO_TYPE_EMAIL_TEL_NUM_DATE__/.test(access), 'les listeners PJAX doivent rester gardés par flags');
assert('liens target blank sécurisés dynamiquement', /enhanceBlankTargetLinks/.test(access) && /noopener/.test(access) && /noreferrer/.test(access));
assert('nom accessible : etiquette visible incluse', /enhanceVisibleLabelInAccessibleName/.test(access) && /data-ls-a11y-label-in-name/.test(access) && /movenext/.test(access) && /movesubmit/.test(access) && /aria-labelledby/.test(access));
assert('audit WCAG 2.5.3 documenté', /WCAG 2\.5\.3/.test(labelInNameAudit) && /NVDA/.test(labelInNameAudit) && /Precedent/.test(labelInNameAudit) && /Suivant/.test(labelInNameAudit) && /Envoyer/.test(labelInNameAudit));
assert('barre a11y et footer label-in-name', /aria-label="A− - Réduire la taille du texte"/.test(layout) && /aria-label="A\+ - Augmenter la taille du texte"/.test(layout) && /aria-label="Université de Lille - site officiel, nouvelle fenêtre"/.test(layout));
assert('liens target blank Twig sécurisés', !/target="_blank"(?![^>]*rel="[^"]*noopener[^"]*noreferrer)/i.test(layout));
assert('zones status et alert centralisées', /ls-a11y-status/.test(access + layout) && /ls-a11y-alert/.test(access + layout));
assert('erreurs reliées par aria-describedby', /addDescribedBy/.test(access) && /aria-invalid/.test(access));
assert('autocomplete standard présent', /enhanceStandardAutocomplete/.test(access) && /given-name/.test(access) && /postal-code/.test(access));
assert('autocomplete explicite champs personnels', /explicitAutocompleteToken/.test(access) && /data-ls-autocomplete/.test(access) && /VALID_AUTOCOMPLETE_TOKENS/.test(access) && /identifiant/.test(access) && /username/.test(access));
assert('NC-R0311 documentee dans MAN-05', /NC-R0311/.test(matrixMd) && /NC-R0311/.test(matrixCsv) && /Votre identifiant unique/.test(ncR0311Audit) && /data-ls-autocomplete="username"/.test(ncR0311Audit) && /heuristique/.test(ncR0311Audit));
assert('langue des passages multilingues', /initPassageLanguageHints/.test(access) && /data-ls-a11y-lang-applied/.test(access) && /LANG_INLINE_RE/.test(access) && /data-lang/.test(access) && /data-ls-lang/.test(access) && /class\*='lang-'/.test(access));
assert('option police Luciole presente', /toggle-luciole/.test(layout) && /a11y-luciole/.test(css) && /Luciole-Regular\.ttf/.test(css) && /state\.luciole/.test(read('views/subviews/footer/footer.twig')) && fs.existsSync(path.join(root, 'files/fonts/luciole/Luciole-Regular.ttf')));
assert('guide createurs langue des passages', /\[lang=en\][\s\S]*?\[\/lang\]/.test(languageGuide) && /data-lang="en"/.test(languageGuide) && /class="lang-en"/.test(languageGuide) && /sans marquage explicite/.test(languageGuide) && /WCAG 3\.1\.2/.test(languageGuide) && /LimeSurvey/.test(languageGuide) && fs.existsSync(path.join(root, 'tests/accessibilite/lint-language-passages.js')));
assert('NC-R058 documentee comme dependance createurs', /NC-R058/.test(matrixMd) && /NC-R058/.test(matrixCsv) && /MAN-25/.test(matrixMd) && /initPassageLanguageHints/.test(ncR058Audit) && /WCAG 3\.1\.2/.test(ncR058Audit) && /depend.*createurs/i.test(ncR058Audit) && /lint-language-passages\.js/.test(ncR058Audit) && /MAN-25/.test(read('files/a11y-modules/manifest.json')));
assert('uploads : label description erreurs ARIA', /initUploadAccessibility/.test(access) && /input\[type='file'\]/.test(access) && /ls-a11y-upload-description/.test(access) && /aria-invalid/.test(access) && /Formats acceptes/.test(access));
assert('sliders : clavier et ARIA', /initSliderAccessibility/.test(access) && /role", "slider"/.test(access) && /ArrowRight/.test(access) && /Home/.test(access) && /End/.test(access));
assert('equations : region live', /initEquationAccessibility/.test(access) && /aria-live", "polite"/.test(access) && /data-ls-a11y-equation-output/.test(access));
assert('matrices : caption scope headers', /enhanceArrayTableSemantics/.test(access) && /caption/.test(access) && /scope/.test(access) && /headers/.test(access));
assert('matrices complexes : grille colspan rowspan', /buildTableGrid/.test(access) && /parseSpan/.test(access) && /rowspan/.test(access) && /colspan/.test(access));
assert('matrices complexes : aria-describedby corrigé', /setArrayDescribedByTokens/.test(access) && /data-ls-a11y-array-header/.test(access));
assert('matrices complexes : ordre de tabulation preserve', /removeMatrixCellTabStops/.test(access) && /data-ls-a11y-tabstop-cleaned/.test(access) && /removeAttribute\("tabindex"\)/.test(access));
assert('matrices complexes : th non focusables', /cell\.tagName[\s\S]*toLowerCase\(\) === "th"[\s\S]*cell\.removeAttribute\("tabindex"\)/.test(access) && /rowHeader\.removeAttribute\("tabindex"\)/.test(access));
assert('NC-R015 documentee dans MAN-10', /NC-R015/.test(matrixMd) && /NC-R015/.test(matrixCsv) && /array-flexible-dual-scale/.test(ncR015Audit) && /Ctrl\+Alt\+Fleche/.test(ncR015Audit));
assert('NC-R0412 documentee dans MAN-09 et MAN-10', /NC-R0412/.test(matrixMd) && /NC-R0412/.test(matrixCsv) && /WCAG 2\.4\.3/.test(ncR0412Audit) && /removeMatrixCellTabStops/.test(ncR0412Audit) && /Tab \/ Shift\+Tab/.test(ncR0412Audit) && /<th>/.test(ncR0412Audit));
assert('reflow zoom support', /initReflowZoomSupport/.test(access) && /data-ls-a11y-col-label/.test(access) && /overflow-x/.test(css));
assert('bootstrap-select sans depassement visuel', /bootstrap-select\.form-control\.list-question-select/.test(css) && /border:\s*0\s*!important/.test(css) && /text-overflow:\s*ellipsis\s*!important/.test(css) && /bootstrap-select\s*>\s*select\.list-question-select/.test(css) && /\$wrap\.css\(\{\s*width:\s*keepAutoWidth\s*\?\s*"fit-content"\s*:\s*"100%"/.test(access));
assert('espacement texte variation-safe', /body\.a11y-spacing \.fruity \.navbar/.test(css) && /body\.a11y-spacing \.fruity \.a11y-option/.test(css) && /overflow-wrap:\s*anywhere\s*!important/.test(css) && variations.length >= 8);
assert('espacement + dyslexie couverts dans les variations', variationCss.length >= 8 && variationCss.every((item) => /body\.a11y-spacing\.a11y-dyslexia/.test(item.content) && /overflow-wrap:\s*anywhere\s*!important/.test(item.content) && /min-width:\s*0\s*!important/.test(item.content)), 'chaque variation doit proteger les formulaires complexes contre les debordements');
assert('NC-R0210 documentee dans MAN-13 et MAN-24', /NC-R0210/.test(matrixMd) && /NC-R0210/.test(matrixCsv) && /body\.a11y-spacing/.test(ncR0210Audit) && variations.every((name) => ncR0210Audit.includes(name.replace(/\.css$/, ''))));
assert('reduction des animations', /prefers-reduced-motion:\s*reduce/.test(css) && /transition-duration:\s*0\.01ms\s*!important/.test(css) && /animation-duration:\s*0\.01ms\s*!important/.test(css));
assert('reduction animations theme et variations', /prefers-reduced-motion:\s*reduce/.test(theme) && /animation-name:\s*none\s*!important/.test(theme) && variationsWithKeyframes.length >= 8 && variationsWithKeyframes.every((item) => /prefers-reduced-motion\s*:\s*reduce/i.test(item.content) && /animation-name\s*:\s*none\s*!important/i.test(item.content)), 'theme.css et chaque variation avec @keyframes doivent embarquer un guard local');
assert('classement accessible', /initRankingQuestionsA11y/.test(access) && /syncJavaInputsFromSelects/.test(access));
assert('session : avertissement et prolongation accessibles', /initSessionTimeoutWarning/.test(access) && /session-timeout/.test(access) && /aria-modal/.test(access) && /data-ls-a11y-session-extend/.test(access) && /window\.fetch/.test(access) && /ls-a11y-session-timeout/.test(css));
assert('pages hors questionnaire : reflow couvert', /initStaticResultPagesAccessibility/.test(access) && /static-result-pages/.test(access) && /data-ls-a11y-static-page/.test(access) && /ls-a11y-static-table-wrapper/.test(access + css) && /body\[data-ls-a11y-static-page="1"\]/.test(css));
assert('matrice de tests présente', fs.existsSync(path.join(root, 'tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md')) && fs.existsSync(path.join(root, 'tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.csv')));
assert('matrice de tests manuels étendue MAN-17 à MAN-24', Array.from({ length: 8 }, (_, i) => 'MAN-' + String(i + 17).padStart(2, '0')).every((id) => matrixMd.includes(id) && matrixCsv.includes(id)));
assert('matrice de tests contenus étendue MAN-25', matrixMd.includes('MAN-25') && matrixCsv.includes('MAN-25'));
assert('manifeste modules présent', fs.existsSync(path.join(root, 'files/a11y-modules/manifest.json')));
if (process.exitCode) process.exit(process.exitCode);
console.log('\nTous les contrôles statiques P3 sont OK.');
