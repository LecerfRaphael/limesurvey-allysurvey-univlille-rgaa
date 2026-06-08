#!/usr/bin/env node
/*
  Linter optionnel NC-R05 / WCAG 3.1.2.
  Detecte des passages anglais probables dans des contenus francais sans token [lang=en]...[/lang].

  Usage :
    node tests/accessibilite/lint-language-passages.js export.html questionnaire.txt
*/
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const root = path.resolve(__dirname, '..', '..');
const DEFAULT_EXTENSIONS = new Set(['.html', '.htm', '.txt', '.md', '.csv', '.lss']);

const ENGLISH_TERMS = [
  'abstract',
  'account',
  'application',
  'apply',
  'assessment',
  'backup',
  'campus',
  'checklist',
  'deadline',
  'feedback',
  'learning agreement',
  'login',
  'meeting',
  'newsletter',
  'online',
  'password',
  'privacy policy',
  'ranking',
  'report',
  'review',
  'schedule',
  'skills',
  'staff',
  'survey',
  'transcript of records',
  'upload',
  'username',
  'workshop'
];

const FRENCH_HINT_RE = /\b(le|la|les|un|une|des|du|de|votre|vos|notre|nous|vous|merci|question|reponse|choisir|indiquer|selectionner)\b/i;
const LANG_MARKER_RE = /\[lang=[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*\][\s\S]*?\[\/lang\]|<[^>]+\s(?:lang|xml:lang|data-lang|data-ls-lang|data-language)=["'][^"']+["'][^>]*>/i;
const TAG_RE = /<[^>]+>/g;

function usage() {
  console.log('Usage: node tests/accessibilite/lint-language-passages.js <fichier-ou-dossier> [...]');
}

function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target).flatMap((name) => walk(path.join(target, name)));
  }
  return [target];
}

function stripMarkedPassages(line) {
  return line
    .replace(/\[lang=[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*\][\s\S]*?\[\/lang\]/gi, '')
    .replace(/<([a-z0-9]+)([^>]*\s(?:lang|xml:lang|data-lang|data-ls-lang|data-language)=["'][^"']+["'][^>]*)>[\s\S]*?<\/\1>/gi, '');
}

function normaliseVisibleText(line) {
  return stripMarkedPassages(line)
    .replace(TAG_RE, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function findSuspiciousTerms(text) {
  const lower = text.toLowerCase();
  return ENGLISH_TERMS.filter((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(lower);
  });
}

function lintFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!DEFAULT_EXTENSIONS.has(ext)) return [];

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    if (!line.trim() || LANG_MARKER_RE.test(line)) return;

    const visible = normaliseVisibleText(line);
    if (!visible || !FRENCH_HINT_RE.test(visible)) return;

    const terms = findSuspiciousTerms(visible);
    if (!terms.length) return;

    findings.push({
      file,
      line: index + 1,
      terms,
      text: visible.slice(0, 180)
    });
  });

  return findings;
}

if (!args.length) {
  usage();
  process.exit(2);
}

const files = args
  .map((item) => path.resolve(root, item))
  .flatMap((target) => {
    if (!fs.existsSync(target)) {
      console.error(`Fichier introuvable: ${target}`);
      process.exitCode = 2;
      return [];
    }
    return walk(target);
  });

const findings = files.flatMap(lintFile);

if (findings.length) {
  console.error(`Passages de langue suspects: ${findings.length}`);
  findings.forEach((finding) => {
    const rel = path.relative(root, finding.file);
    console.error(`${rel}:${finding.line} - ${finding.terms.join(', ')} - ${finding.text}`);
  });
  process.exit(1);
}

if (!process.exitCode) {
  console.log('Aucun passage suspect detecte.');
}
