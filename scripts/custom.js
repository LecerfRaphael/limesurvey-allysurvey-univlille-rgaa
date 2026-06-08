/******************
    User custom JS
    ---------------

   Put JS-functions for your template here.
   If possible use a closure, or add them to the general Template Object "Template"
*/
(function (window, document, $) {
  'use strict';

  // Garde globale : ce fichier peut être réévalué après un rechargement PJAX.
  // Les écouteurs globaux ne doivent être posés qu'une seule fois.
  if (window.__LS_CUSTOM_JS_IDEMPOTENT_BOUND__) return;
  window.__LS_CUSTOM_JS_IDEMPOTENT_BOUND__ = true;

  function onReadyAndPjax(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
    document.addEventListener('pjax:success', callback);
    document.addEventListener('pjax:complete', callback);
    document.addEventListener('pjax:scriptcomplete', callback);
  }

  function fixBootstrapModalA11y() {
    var modals = Array.prototype.slice.call(document.querySelectorAll('.modal'));
    modals.forEach(function (modal) {
      var isHidden = modal.getAttribute('aria-hidden') === 'true' || !modal.classList.contains('show');
      if (isHidden) {
        modal.setAttribute('inert', '');
      } else {
        modal.removeAttribute('inert');
      }

      var closeBtn = modal.querySelector('button.btn-close[data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.removeAttribute('aria-hidden');
        if (!closeBtn.getAttribute('aria-label') && !closeBtn.getAttribute('aria-labelledby') && !closeBtn.textContent.trim()) {
          closeBtn.setAttribute('aria-label', 'Fermer');
        }
      }

      modal.querySelectorAll('a[href="#"][data-bs-dismiss="modal"], a[href=""][data-bs-dismiss="modal"]').forEach(function (link) {
        var button = document.createElement('button');
        Array.prototype.slice.call(link.attributes).forEach(function (attr) {
          if (attr.name !== 'href') button.setAttribute(attr.name, attr.value);
        });
        button.type = 'button';
        button.className = link.className;
        button.innerHTML = link.innerHTML;
        link.parentNode.replaceChild(button, link);
      });

      Array.prototype.slice.call(modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')).forEach(function (node) {
        if (isHidden) {
          if (!node.hasAttribute('data-a11y-modal-saved-tabindex')) {
            node.setAttribute('data-a11y-modal-saved-tabindex', node.hasAttribute('tabindex') ? node.getAttribute('tabindex') : '');
          }
          node.setAttribute('tabindex', '-1');
          return;
        }

        if (node.hasAttribute('data-a11y-modal-saved-tabindex')) {
          var saved = node.getAttribute('data-a11y-modal-saved-tabindex');
          node.removeAttribute('data-a11y-modal-saved-tabindex');
          if (saved === '') node.removeAttribute('tabindex');
          else node.setAttribute('tabindex', saved);
        }
      });
    });

    var alertModal = document.getElementById('bootstrap-alert-box-modal');
    if (!alertModal) return;

    var alertCloseBtn = alertModal.querySelector('button.btn-close[data-bs-dismiss="modal"]');
    if (alertCloseBtn) {
      alertCloseBtn.removeAttribute('aria-hidden');
      alertCloseBtn.setAttribute('aria-label', 'Fermer');
    }

    var modalTitle = alertModal.querySelector('.modal-title');
    if (modalTitle && !modalTitle.textContent.trim()) {
      modalTitle.textContent = 'Message';
    }
  }

  function fixDuplicateLemScriptsIds() {
    if (typeof window.LSA11yFixDuplicateLemScripts === 'function') {
      window.LSA11yFixDuplicateLemScripts();
      return;
    }

    var scripts = Array.prototype.slice.call(document.querySelectorAll('script#lemscripts'));
    scripts.forEach(function (script, index) {
      script.id = 'lemscripts-a11y-fallback-' + (index + 1);
    });
  }

  function fixAuditA11yIssues() {
    fixBootstrapModalA11y();
    fixDuplicateLemScriptsIds();
  }

  function observeAuditA11yIssues() {
    if (window.__LS_CUSTOM_AUDIT_OBSERVER_BOUND__ || typeof MutationObserver === 'undefined') return;
    window.__LS_CUSTOM_AUDIT_OBSERVER_BOUND__ = true;

    var observer = new MutationObserver(function () {
      fixAuditA11yIssues();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  onReadyAndPjax(fixAuditA11yIssues);
  onReadyAndPjax(observeAuditA11yIssues);
  document.addEventListener('show.bs.modal', fixBootstrapModalA11y, true);
  document.addEventListener('shown.bs.modal', fixBootstrapModalA11y, true);
  document.addEventListener('hide.bs.modal', fixBootstrapModalA11y, true);
  document.addEventListener('hidden.bs.modal', fixBootstrapModalA11y, true);

  /* SELECT NATIF : gestion déplacée dans files/accessibilite.js.
     Important : ne pas détruire les select[data-live-search="true"],
     sinon le moteur de recherche interne bootstrap-select disparaît. */

  /* VERROU POLITIQUE CONFIDENTIALITE — bindings idempotents / PJAX */

  function normaliseA11yIdPart(value) {
    return String(value || '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'field';
  }

  function announceA11y(message, severity, dedupeKey) {
    message = String(message || '').replace(/\s+/g, ' ').trim();
    if (!message || typeof window.LSA11yAnnounce !== 'function') return;
    window.LSA11yAnnounce(message, severity || 'status', { dedupeKey: dedupeKey || message });
  }

  function ensureA11yControlId(control, prefix) {
    if (!control) return '';
    if (!control.id) {
      if (!window.__LS_CUSTOM_A11Y_ERROR_ID_COUNTER__) window.__LS_CUSTOM_A11Y_ERROR_ID_COUNTER__ = 0;
      window.__LS_CUSTOM_A11Y_ERROR_ID_COUNTER__ += 1;
      control.id = normaliseA11yIdPart(prefix || 'ls-a11y-field') + '-' + window.__LS_CUSTOM_A11Y_ERROR_ID_COUNTER__;
    }
    return control.id;
  }

  function getDataSecurityErrorId(consent) {
    var controlId = ensureA11yControlId(consent, 'datasecurity-accepted');
    return normaliseA11yIdPart(controlId) + '-error';
  }

  function addDescribedBy(control, id) {
    if (!control || !id) return;
    var ids = (control.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter(Boolean);
    if (ids.indexOf(id) === -1) ids.push(id);
    control.setAttribute('aria-describedby', ids.join(' '));
  }

  function removeDescribedBy(control, id) {
    if (!control || !id) return;
    var ids = (control.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter(function (token) { return token && token !== id; });
    if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
    else control.removeAttribute('aria-describedby');
  }

  function getDataSecurityConsent(form) {
    return form && form.querySelector('input[type="checkbox"][name="datasecurity_accepted"]');
  }

  function getSubmitButtons(form) {
    if (!form) return [];
    return Array.prototype.slice.call(
      form.querySelectorAll('button[type="submit"], input[type="submit"], .ls-move-next-btn, .ls-move-submit-btn')
    );
  }

  function setDataSecurityButtonsState(form) {
    var consent = getDataSecurityConsent(form);
    if (!consent) return;

    var allowed = consent.checked;
    getSubmitButtons(form).forEach(function (btn) {
      btn.disabled = !allowed;
      btn.setAttribute('aria-disabled', allowed ?'false' : 'true');
      btn.classList.toggle('is-disabled-by-consent', !allowed);
    });
  }

  function clearDataSecurityError(form, consent) {
    if (!form) return;

    var errorId = consent ?getDataSecurityErrorId(consent) : '';
    var msg = errorId ?document.getElementById(errorId) : form.querySelector('.consent-error-message');
    if (msg) msg.remove();

    if (consent) {
      removeDescribedBy(consent, errorId);
      consent.setAttribute('aria-invalid', 'false');
      consent.removeAttribute('data-ls-a11y-invalid-by');
    }
  }

  function showDataSecurityError(form, consent) {
    if (!form || !consent) return;

    var errorId = getDataSecurityErrorId(consent);
    consent.setAttribute('aria-invalid', 'true');
    consent.setAttribute('data-ls-a11y-invalid-by', errorId);

    var msg = document.getElementById(errorId);
    if (!msg) {
      msg = document.createElement('div');
      msg.id = errorId;
      msg.className = 'consent-error-message alert alert-danger mt-2';
      msg.setAttribute('role', 'note');
      msg.setAttribute('data-ls-a11y-status-severity', 'alert');
      msg.textContent = 'Vous devez accepter la politique de confidentialité avant de continuer.';

      var consentWrapper = consent.closest('.form-check, .checkbox-item, .privacy, .ls-answers, div');
      if (consentWrapper) consentWrapper.appendChild(msg);
    }

    addDescribedBy(consent, errorId);
    announceA11y('Vous devez accepter la politique de confidentialité avant de continuer.', 'alert', errorId);
  }

  function bindDataSecurityGuard(scope) {
    var root = scope || document;

    root.querySelectorAll('form').forEach(function (form) {
      var consent = getDataSecurityConsent(form);
      if (!consent) return;

      // L'état peut changer après PJAX : on le recalcule à chaque boot.
      setDataSecurityButtonsState(form);

      if (form.dataset.lsDataSecurityGuardBound === '1') return;
      form.dataset.lsDataSecurityGuardBound = '1';

      form.addEventListener('change', function (event) {
        var target = event.target;
        if (!target || !target.matches('input[type="checkbox"][name="datasecurity_accepted"]')) return;

        clearDataSecurityError(form, target);
        setDataSecurityButtonsState(form);
      });

      form.addEventListener('click', function (event) {
        var btn = event.target && event.target.closest('button[type="submit"], input[type="submit"], .ls-move-next-btn, .ls-move-submit-btn');
        if (!btn) return;

        var currentConsent = getDataSecurityConsent(form);
        if (!currentConsent || currentConsent.checked) return;

        event.preventDefault();
        event.stopPropagation();
        showDataSecurityError(form, currentConsent);
        currentConsent.focus();
      }, true);

      form.addEventListener('submit', function (event) {
        var currentConsent = getDataSecurityConsent(form);
        if (!currentConsent || currentConsent.checked) return;

        event.preventDefault();
        event.stopPropagation();
        showDataSecurityError(form, currentConsent);
        currentConsent.focus();
      }, true);
    });
  }

  onReadyAndPjax(function () {
    bindDataSecurityGuard(document);
  });

/* TITRE DYNAMIQUE RGAA
   <title> : Page X / Y – Nom court du groupe – Titre du questionnaire
   <h1>    : Titre du questionnaire | Page X / Y

   Correctifs :
   - le <title> commence par l'information de position pour l'onglet, l'historique et les lecteurs d'écran ;
   - le nom du groupe est utilisé comme titre court de contexte, jamais le texte d'une question ;
   - le H1 ne reprend plus le nom du groupe ; le nom du groupe reste dans le <legend class="group-title"> natif ;
   - le total X / Y ne dépend plus de l'affichage de l'index des questions ;
   - correction du décalage LimeSurvey currentstep zéro-indexé ;
   - priorité à la carte des groupes générée côté Twig depuis aSurveyInfo.aQuestionGroups ;
   - ne jamais réutiliser document.title déjà modifié comme titre source.
*/
(function () {
  'use strict';

  var STORAGE_PREFIX = 'ls_a11y_group_page_map_v4_';
  var TITLE_SEPARATOR = ' – ';
  var GROUP_TITLE_MAX_LENGTH = 80;
  var originalSurveyTitle = '';
  var lastComputedTitle = '';

  function cleanText(value) {
    return (value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeForCompare(value) {
    return cleanText(value).toLowerCase();
  }

  function stripInjectedTitleParts(value) {
    value = cleanText(value);
    // Nettoyage de sécurité si un ancien titre déjà modifié est encore en cache.
    // Ancien format : Nom du groupe | Page X / Y | Titre enquête
    // Nouveau format : Page X / Y – Nom du groupe – Titre enquête
    return value
      .replace(/^Page\s+\d+\s*(?:\/\s*\d+)?\s*(?:[|–—-]\s*)?/i, '')
      .replace(/^(.+?\s*\|\s*)?Page\s+\d+\s*(?:\/\s*\d+)?\s*\|\s*/i, '')
      .replace(/^(?:[^|–—]+\s*[|–—]\s*)+/, '')
      .trim();
  }

  function shortenText(value, maxLength) {
    value = cleanText(value);
    maxLength = maxLength || GROUP_TITLE_MAX_LENGTH;

    if (!value || value.length <= maxLength) return value;

    var slice = value.slice(0, maxLength + 1);
    var lastSpace = slice.lastIndexOf(' ');
    if (lastSpace > 40) {
      slice = slice.slice(0, lastSpace);
    } else {
      slice = slice.slice(0, maxLength);
    }

    return slice.replace(/[\s,;:.-]+$/g, '') + '…';
  }

  function getShortGroupTitle(value) {
    value = cleanText(value)
      .replace(/^Page\s+\d+\s*(?:\/\s*\d+)?\s*[|–—-]\s*/i, '')
      .replace(/\s*\|\s*Page\s+\d+\s*(?:\/\s*\d+)?$/i, '')
      .replace(/\s*question obligatoire\s*/ig, ' ');

    return shortenText(value, GROUP_TITLE_MAX_LENGTH);
  }

  function parsePositiveInt(value) {
    var n = parseInt(value, 10);
    return (!isNaN(n) && n > 0) ?n : 0;
  }

  function getHeaderData() {
    var header = document.getElementById('ls-group-header');
    if (!header) return null;

    var d = header.dataset || {};
    var groupNameNode = header.querySelector('.ls-a11y-group-name-source');
    var surveyTitleNode = header.querySelector('.ls-a11y-survey-title-source');

    var progressCurrentRaw = parseInt(d.progressCurrentRaw || '', 10);
    var progressTotal = parsePositiveInt(d.progressTotal || '');
    var progressCurrent = parsePositiveInt(d.progressCurrent || '');
    var groupsTotal = parsePositiveInt(d.groupsTotal || '');

    // LimeSurvey peut inclure la page d'accueil dans currentstep.
    // On n'ajoute donc plus +1 automatiquement : 0 devient 1, 1 reste 1.
    // La carte réelle des groupes reste prioritaire plus bas.
    if (!isNaN(progressCurrentRaw) && progressCurrentRaw >= 0) {
      progressCurrent = progressCurrentRaw > 0 ?progressCurrentRaw : 1;
    }

    var current = parsePositiveInt(d.current || '') || progressCurrent;
    var total = parsePositiveInt(d.total || '') || (groupsTotal > 1 ?groupsTotal : progressTotal);

    // Ne pas écraser les valeurs corrigées côté Twig par la progression native LimeSurvey.
    if (!current && progressCurrent) current = progressCurrent;
    if (!total && groupsTotal > 1) total = groupsTotal;
    if (!total && progressTotal) total = progressTotal;

    // Si le total corrigé des groupes existe, on ne l'augmente pas à cause de la page d'accueil.
    if (total && current && total < current && !(parsePositiveInt(d.total || '') > 0)) total = current;

    return {
      header: header,
      gid: cleanText(d.gid || ''),
      groupTitle: cleanText((groupNameNode && groupNameNode.textContent) || d.gname || ''),
      current: current,
      total: total,
      groupsTotal: groupsTotal,
      progressCurrent: progressCurrent,
      progressCurrentRaw: (!isNaN(progressCurrentRaw) ?progressCurrentRaw : null),
      progressTotal: progressTotal,
      surveyTitle: cleanText((surveyTitleNode && surveyTitleNode.textContent) || d.sname || '')
    };
  }

  function getGroupMapInfo(headerData) {
    if (!headerData || !headerData.header) return null;

    var items = Array.prototype.slice.call(
      headerData.header.querySelectorAll('.ls-a11y-group-map-item')
    );

    // Si LimeSurvey ne fournit que le groupe courant, la carte vaut 1 entrée
    // même pour un questionnaire à plusieurs groupes. Dans ce cas, on ignore
    // la carte et on utilise la progression native (currentstep / total).
    var mapNode = headerData.header.querySelector('.ls-a11y-group-map');
    var isCompleteMap = mapNode && mapNode.getAttribute('data-map-complete') === '1';
    if (!items.length || !isCompleteMap || items.length < 2) return null;

    var current = 0;
    var total = items.length;
    var groupTitle = headerData.groupTitle;
    var currentGid = normalizeForCompare(headerData.gid);
    var currentGroupName = normalizeForCompare(headerData.groupTitle);

    items.forEach(function (item, index) {
      var itemGid = normalizeForCompare(item.getAttribute('data-gid') || '');
      var itemName = normalizeForCompare(item.textContent || '');
      var itemIndex = parsePositiveInt(item.getAttribute('data-index') || '') || (index + 1);

      if (!current && currentGid && itemGid && itemGid === currentGid) {
        current = itemIndex;
        groupTitle = cleanText(item.textContent || headerData.groupTitle);
      }

      if (!current && currentGroupName && itemName && itemName === currentGroupName) {
        current = itemIndex;
        groupTitle = cleanText(item.textContent || headerData.groupTitle);
      }
    });

    return {
      current: current || headerData.current || getCurrentStepFromDom() || 1,
      total: total,
      groupTitle: cleanText(groupTitle || headerData.groupTitle),
      surveyTitle: headerData.surveyTitle
    };
  }

  function getCurrentStepFromDom() {
    var selectors = [
      '#thisstep',
      'input[name="thisstep"]',
      'input[name="step"]',
      'input[name="thisStep"]'
    ];

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (!el) continue;
      var raw = parseInt(el.value || el.getAttribute('value') || '', 10);
      if (isNaN(raw)) continue;
      if (raw === 0) return 1;
      if (raw > 0) return raw;
    }

    return 0;
  }

  function getTotalStepFromDom() {
    var selectors = [
      '#totalsteps',
      '#totalstep',
      '#totalpages',
      'input[name="totalsteps"]',
      'input[name="totalstep"]',
      'input[name="totalpages"]',
      '[data-totalsteps]',
      '[data-total-pages]'
    ];

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (!el) continue;
      var raw = el.value || el.getAttribute('value') || el.getAttribute('data-totalsteps') || el.getAttribute('data-total-pages') || '';
      var n = parsePositiveInt(raw);
      if (n) return n;
    }

    return 0;
  }

  function getConfiguredSurveyTitle() {
    var headerData = getHeaderData();
    if (headerData && headerData.surveyTitle) return headerData.surveyTitle;

    var config = window.LS_A11Y_DYNAMIC_TITLE_CONFIG || {};
    if (config.baseTitle) return cleanText(config.baseTitle);

    if (window.LS_A11Y_BASE_SURVEY_TITLE) return cleanText(window.LS_A11Y_BASE_SURVEY_TITLE);

    return originalSurveyTitle || '';
  }

  function rememberOriginalSurveyTitle() {
    if (originalSurveyTitle) return;

    var fromConfig = window.LS_A11Y_DYNAMIC_TITLE_CONFIG && window.LS_A11Y_DYNAMIC_TITLE_CONFIG.baseTitle;
    var candidate = cleanText(fromConfig || window.LS_A11Y_BASE_SURVEY_TITLE || '');

    if (!candidate) {
      candidate = stripInjectedTitleParts(document.title || '');
    }

    originalSurveyTitle = candidate;
  }

  function cloneReadableText(el) {
    if (!el) return '';

    var clone = el.cloneNode(true);
    [
      'script',
      'style',
      '.visually-hidden',
      '.sr-only',
      '.asterisk',
      '.mandatory',
      '.question-help',
      '.question-help-container',
      '.ls-questionhelp',
      '.question-valid-container',
      '.ls-em-tip',
      '.ls-em-success',
      '.ls-em-error',
      '.ls-a11y-page-number',
      '.ls-a11y-group-map',
      '.ls-a11y-group-name-source',
      '.ls-a11y-survey-title-source'
    ].forEach(function (selector) {
      clone.querySelectorAll(selector).forEach(function (node) {
        node.remove();
      });
    });

    return cleanText(clone.textContent || '');
  }

  function getGroupTitleFallback() {
    var headerData = getHeaderData();
    if (headerData && headerData.groupTitle) return headerData.groupTitle;

    var selectors = [
      'legend.group-title',
      '.group-title',
      '.group-title-container .group-title',
      '.ls-group-title',
      'h2.group-title'
    ];

    for (var i = 0; i < selectors.length; i++) {
      var text = cloneReadableText(document.querySelector(selectors[i]));
      if (text) return text;
    }

    return '';
  }

  function getSurveyId() {
    var fromLSvar = window.LSvar && (window.LSvar.surveyid || window.LSvar.sid);
    if (fromLSvar) return String(fromLSvar);

    var field = document.querySelector('input[name="sid"], input#sid');
    if (field && field.value) return String(field.value);

    var form = document.querySelector('form[id^="limesurvey"], form[action*="survey"]');
    if (form && form.id) return form.id;

    return 'default';
  }

  function getPageInfoFromHeader() {
    var d = getHeaderData();
    if (!d) return null;

    var domCurrent = getCurrentStepFromDom();
    var domTotal = getTotalStepFromDom();

    // Source prioritaire seulement si la carte contient réellement tous les groupes.
    // Si elle ne contient que le groupe courant, elle donnerait à tort Page 1 / 1.
    var mapInfo = getGroupMapInfo(d);
    if (mapInfo && mapInfo.total > 1) return mapInfo;

    // Source fiable dans le mode groupe par groupe : progression native LimeSurvey.
    // currentstep est utilisé tel quel, sans +1, pour ne pas compter la page d'accueil.
    var nativeTotal = d.total || d.groupsTotal || d.progressTotal || domTotal || 0;
    var nativeCurrent = d.progressCurrent || d.current || domCurrent || 1;

    if (nativeTotal) {
      if (nativeCurrent > nativeTotal) nativeCurrent = nativeTotal;
      return {
        current: nativeCurrent,
        total: nativeTotal,
        groupTitle: d.groupTitle,
        surveyTitle: d.surveyTitle
      };
    }

    return {
      current: d.current || domCurrent || 1,
      total: Math.max(d.total || 0, domTotal || 0),
      groupTitle: d.groupTitle,
      surveyTitle: d.surveyTitle
    };
  }

  function getPageInfoFromQuestionIndex(groupTitle) {
    var menu = document.querySelector('#survey-nav .index-menu-full, #survey-nav .index-menu-incremental, .index-menu-full, .index-menu-incremental');
    if (!menu) return null;

    var links = Array.prototype.slice.call(menu.querySelectorAll('a.dropdown-item, a[data-limesurvey-submit]'))
      .filter(function (link) { return cleanText(link.textContent || ''); });

    if (!links.length) return null;

    var currentIndex = -1;

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var parent = link.closest ?link.closest('li') : null;
      if (
        link.classList.contains('disabled') ||
        link.getAttribute('aria-current') === 'page' ||
        link.getAttribute('aria-disabled') === 'true' ||
        (parent && parent.className.indexOf('index-item-current') !== -1)
      ) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex === -1 && groupTitle) {
      var currentGroup = normalizeForCompare(groupTitle);
      for (var j = 0; j < links.length; j++) {
        if (normalizeForCompare(links[j].textContent || '') === currentGroup) {
          currentIndex = j;
          break;
        }
      }
    }

    if (currentIndex === -1) return null;

    return {
      current: currentIndex + 1,
      total: links.length,
      groupTitle: cleanText(links[currentIndex].textContent || groupTitle),
      surveyTitle: getConfiguredSurveyTitle()
    };
  }

  function getMappedPageInfo(groupTitle) {
    var groupKey = cleanText(groupTitle || location.pathname + location.search).slice(0, 120);
    var storageKey = STORAGE_PREFIX + getSurveyId();
    var map = [];

    try {
      map = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(map)) map = [];
    } catch (e) {
      map = [];
    }

    var index = map.indexOf(groupKey);
    if (index === -1) {
      map.push(groupKey);
      index = map.length - 1;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(map));
      } catch (e2) {}
    }

    return {
      current: index + 1,
      total: map.length,
      groupTitle: groupTitle,
      surveyTitle: getConfiguredSurveyTitle()
    };
  }

  function buildPageLabel(info) {
    if (!info) return '';
    if (info.current && info.total) return 'Page ' + info.current + ' / ' + info.total;
    if (info.current) return 'Page ' + info.current;
    return '';
  }

  function setMeta(nameOrProp, content, isProperty) {
    if (!content) return;
    var selector = isProperty ?'meta[property="' + nameOrProp + '"]' : 'meta[name="' + nameOrProp + '"]';
    var meta = document.head ?document.head.querySelector(selector) : null;
    if (!meta && document.head) {
      meta = document.createElement('meta');
      meta.setAttribute(isProperty ?'property' : 'name', nameOrProp);
      document.head.appendChild(meta);
    }
    if (meta) meta.setAttribute('content', content);
  }

  function updateVisibleH1(info, surveyTitle) {
    var h1 = document.getElementById('ls-page-title');
    surveyTitle = cleanText(surveyTitle || getConfiguredSurveyTitle());
    if (!h1 || !surveyTitle) return;

    var pageLabel = buildPageLabel(info);
    h1.innerHTML = '';
    h1.appendChild(document.createTextNode(surveyTitle));
    if (pageLabel) {
      var span = document.createElement('span');
      span.className = 'ls-a11y-page-number';
      span.appendChild(document.createTextNode(' | ' + pageLabel));
      h1.appendChild(span);
    }
  }

  function updateDynamicTitle() {
    rememberOriginalSurveyTitle();

    var headerInfo = getPageInfoFromHeader();
    var groupTitle = cleanText((headerInfo && headerInfo.groupTitle) || getGroupTitleFallback());

    // Hors page de groupe : on garde le titre natif propre.
    if (!groupTitle) return;

    var indexInfo = getPageInfoFromQuestionIndex(groupTitle);
    var mappedInfo = null;
    var pageInfo = headerInfo || indexInfo || null;

    // Fallback session uniquement si aucune vraie source de total n'est disponible.
    if (!pageInfo || !pageInfo.total) {
      mappedInfo = getMappedPageInfo(groupTitle);
      pageInfo = pageInfo || mappedInfo;
    }

    var finalGroupTitle = getShortGroupTitle(pageInfo.groupTitle || groupTitle);
    var baseTitle = cleanText((pageInfo && pageInfo.surveyTitle) || getConfiguredSurveyTitle() || originalSurveyTitle);
    var pageLabel = buildPageLabel(pageInfo);

    updateVisibleH1(pageInfo, baseTitle);

    var parts = [];
    if (pageLabel) parts.push(pageLabel);
    if (finalGroupTitle) parts.push(finalGroupTitle);
    if (baseTitle && parts.indexOf(baseTitle) === -1) parts.push(baseTitle);

    var newTitle = parts.join(TITLE_SEPARATOR);

    if (newTitle && newTitle !== lastComputedTitle) {
      document.title = newTitle;
      setMeta('og:title', newTitle, true);
      setMeta('twitter:title', newTitle, false);
      lastComputedTitle = newTitle;
    }
  }

  function scheduleDynamicTitleUpdate() {
    window.setTimeout(updateDynamicTitle, 0);
    window.setTimeout(updateDynamicTitle, 150);
    window.setTimeout(updateDynamicTitle, 500);
  }

  document.addEventListener('DOMContentLoaded', scheduleDynamicTitleUpdate);
  document.addEventListener('pjax:success', scheduleDynamicTitleUpdate);
  document.addEventListener('pjax:complete', scheduleDynamicTitleUpdate);
  document.addEventListener('pjax:scriptcomplete', scheduleDynamicTitleUpdate);

  window.LS_A11Y_updateDynamicTitle = updateDynamicTitle;
})();

})(window, document, window.jQuery);
