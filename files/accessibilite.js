/* =========================================================
  PACK LIME SURVEY COMPLET / NETTOYÉ (version fichier externe)
   - Gestion dates (jour/mois/année + input caché)
   - Placeholders Jour/Mois/Année
   - Nettoyage des required sur hidden/othertext/etc.
   - Transformation div → fieldset (list-dropdown, yes-no, etc.)
   - Règles REQUIRED conditionnelles (visible + mandatory)
   - Validation progressive (1ère question en erreur)
   - Gestion "Autre" (radio, checkbox, multiple-opt)
   - list-with-comment & multiple-opt-comments
   - Accessibilité : aria-live, modal, questionhelp
   - Thème LimeSurvey basé sur Fruity, adapté pour améliorer l’accessibilité numérique et la conformité au RGAA 4.
   - En amélioration continue par la Direction du numérique
   – Service DAWAM de l’Université de Lille.
   - Contact : raphael.lecerf@univ-lille.fr
   - update : 31-03-2026
   - Licence : CC BY-NC-SA
========================================================= */

(function (window, document, $) {
  "use strict";


  /* =========================================================
     P3 — Maintenance durable : registre modulaire
     Le thème conserve files/accessibilite.js comme bundle chargé
     par LimeSurvey, mais les familles fonctionnelles sont suivies
     dans ce registre et documentées dans files/a11y-modules/.
  ========================================================= */
  var LS_A11Y_BUNDLE_VERSION = "2026-06-04-p3-maintenance-tests";

  var LS_A11Y_MODULE_REGISTRY = [
    { id: "core-status-links", label: "Socle : helpers, annonces centralisées, liens nouvelle fenêtre", criteria: "RGAA 6, RGAA 7, WCAG 2.4.4, 4.1.3" },
    { id: "structure-required", label: "Structure, langue des passages et champs obligatoires LimeSurvey", criteria: "RGAA 8, RGAA 9, RGAA 11, WCAG 3.1.2, 1.3.1, 3.3.1, 3.3.2" },
    { id: "personal-data-autocomplete", label: "Objectif des champs utilisateur", criteria: "WCAG 1.3.5 AA" },
    { id: "question-families", label: "Familles de questions : dates, autre, commentaires, radio/checkbox", criteria: "RGAA 7, RGAA 11, WCAG 2.1.1, 3.3.2, 4.1.2" },
    { id: "arrays-tables", label: "Tableaux et matrices de questions", criteria: "RGAA 5, WCAG 1.3.1, 1.3.2" },
    { id: "reflow-focus-selects", label: "Reflow, focus visible, select natif/bootstrap", criteria: "RGAA 10, WCAG 1.4.4, 1.4.10, 1.4.12, 2.4.7" },
    { id: "ranking", label: "Questions de classement", criteria: "RGAA 7, RGAA 11, WCAG 2.1.1, 4.1.2" },
    { id: "session-timeout", label: "Avertissement accessible avant expiration de session", criteria: "RGAA 13, WCAG 2.2.1" },
    { id: "static-result-pages", label: "Pages hors questionnaire : fin, resultats, evaluations, listing", criteria: "RGAA 13, WCAG 1.4.10" },
    { id: "observers-validation", label: "Observers PJAX-safe et validation séquentielle", criteria: "RGAA 7, RGAA 11, WCAG 3.3.1, 3.3.3, 4.1.2" }
  ];

  window.LSA11yMaintenance = window.LSA11yMaintenance || {};
  window.LSA11yMaintenance.version = LS_A11Y_BUNDLE_VERSION;
  window.LSA11yMaintenance.modules = LS_A11Y_MODULE_REGISTRY.slice();
  window.LSA11yMaintenance.bootLog = window.LSA11yMaintenance.bootLog || [];

  function runA11yModule(moduleId, root, runner) {
    var started = Date.now();
    runner(root || document);

    if (window.LSA11yMaintenance && window.LSA11yMaintenance.debug === true) {
      window.LSA11yMaintenance.bootLog.push({
        module: moduleId,
        at: new Date().toISOString(),
        durationMs: Date.now() - started
      });
    }
  }

  // ✅ Anti double-binding global (PJAX peut recharger / ré-exécuter certains scripts)
  if (window.__LS_ACCESSIBILITE_JS_LOADED__) return;
  window.__LS_ACCESSIBILITE_JS_LOADED__ = true;

  /* =========================================================
     Helpers
  ========================================================= */
  function ensureHiddenCSS() {
    if (!document.getElementById("lsHiddenStyle")) {
      var st = document.createElement("style");
      st.id = "lsHiddenStyle";
      st.textContent = ".ls-hidden{display:none!important}";
      document.head.appendChild(st);
    }
  }

  // Zones de statut centralisées WCAG 4.1.3 :
  // - role="status" pour les informations non critiques ;
  // - role="alert" pour les erreurs et blocages.
  function ensureA11yStatusRegions() {
    function ensureRegion(id, role, live) {
      var region = document.getElementById(id);
      if (!region) {
        region = document.createElement("div");
        region.id = id;
        region.className = "sr-only visually-hidden";
        (document.body || document.documentElement).appendChild(region);
      }

      region.setAttribute("role", role);
      region.setAttribute("aria-live", live);
      region.setAttribute("aria-atomic", "true");
      region.classList.add("sr-only", "visually-hidden");

      return region;
    }

    ensureRegion("ls-a11y-status", "status", "polite");
    ensureRegion("ls-a11y-alert", "alert", "assertive");

    // Compatibilité : l'ancien conteneur local ne doit plus parler en parallèle.
    var legacy = document.getElementById("aria-live-message");
    if (legacy) {
      legacy.removeAttribute("aria-live");
      legacy.removeAttribute("aria-atomic");
      legacy.setAttribute("aria-hidden", "true");
      legacy.textContent = "";
    }
  }

  function ensureAriaLiveDiv() {
    ensureA11yStatusRegions();
  }

  function announceA11y(message, severity, options) {
    message = String(message || "").replace(/\s+/g, " ").trim();
    if (!message) return;

    ensureA11yStatusRegions();

    if (typeof window.LSA11yAnnounce === "function") {
      window.LSA11yAnnounce(message, severity, options || {});
      return;
    }

    var isAlert = /^(alert|error|assertive)$/i.test(severity || "");
    var target = document.getElementById(isAlert ?"ls-a11y-alert" : "ls-a11y-status");
    var other = document.getElementById(isAlert ?"ls-a11y-status" : "ls-a11y-alert");
    if (!target) return;

    if (other) other.textContent = "";
    target.textContent = "";
    window.setTimeout(function () { target.textContent = message; }, 30);
  }

  function clearA11yAnnouncements() {
    if (typeof window.LSA11yClearStatus === "function") {
      window.LSA11yClearStatus();
      return;
    }
    var status = document.getElementById("ls-a11y-status");
    var alert = document.getElementById("ls-a11y-alert");
    if (status) status.textContent = "";
    if (alert) alert.textContent = "";
  }


  /* =========================================================
     Liens ouvrant une nouvelle fenêtre / nouvel onglet
     RGAA 6 / WCAG 2.4.4 — sécurité + annonce homogène
  ========================================================= */
  function enhanceBlankTargetLinks(root) {
    root = root || document;

    function textOf(node) {
      return (node && node.textContent ?node.textContent : "")
        .replace(/\s+/g, " ")
        .trim();
    }

    function hasNewWindowMention(value) {
      return /\b(nouvelle\s+fenêtre|nouvel\s+onglet|new\s+window|new\s+tab)\b/i.test(value || "");
    }

    function addRelToken(link, token) {
      var rel = (link.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean);

      if (rel.indexOf(token) === -1) rel.push(token);
      link.setAttribute("rel", rel.join(" "));
    }

    function normalizeExistingHiddenMention(link) {
      var hidden = link.querySelectorAll(".sr-only, .visually-hidden, [class*='screen-reader']");
      Array.prototype.forEach.call(hidden, function (node) {
        if (hasNewWindowMention(textOf(node))) {
          node.textContent = " (nouvelle fenêtre)";
          node.setAttribute("data-ls-a11y-new-window-indicator", "1");
        }
      });
    }

    function accessibleNamePieces(link) {
      var pieces = [
        link.getAttribute("aria-label") || "",
        link.getAttribute("title") || "",
        textOf(link)
      ];

      Array.prototype.forEach.call(link.querySelectorAll("img[alt]"), function (img) {
        pieces.push(img.getAttribute("alt") || "");
      });

      return pieces.join(" ");
    }

    function visibleOrAccessibleBaseName(link) {
      var base = textOf(link).replace(/\s*\(?nouvelle\s+fenêtre\)?\s*/ig, " ").trim();
      if (base) return base;

      var aria = (link.getAttribute("aria-label") || "")
        .replace(/\s*[—-]?\s*nouvelle\s+fenêtre\s*/ig, " ")
        .trim();
      if (aria) return aria;

      var title = (link.getAttribute("title") || "")
        .replace(/\s*[—-]?\s*nouvelle\s+fenêtre\s*/ig, " ")
        .trim();
      if (title) return title;

      var img = link.querySelector("img[alt]");
      var alt = img ?(img.getAttribute("alt") || "").trim() : "";
      if (alt) return alt;

      return "Lien";
    }

    var links = [];
    if (root.matches && root.matches('a[target="_blank"], a[target="_BLANK"]')) links.push(root);
    Array.prototype.forEach.call(root.querySelectorAll ?root.querySelectorAll('a[target="_blank"], a[target="_BLANK"]') : [], function (link) {
      if (links.indexOf(link) === -1) links.push(link);
    });

    links.forEach(function (link) {
      addRelToken(link, "noopener");
      addRelToken(link, "noreferrer");
      normalizeExistingHiddenMention(link);

      if (hasNewWindowMention(accessibleNamePieces(link))) {
        link.setAttribute("data-ls-a11y-new-window", "1");
        return;
      }

      var baseName = visibleOrAccessibleBaseName(link);

      if (textOf(link)) {
        var span = document.createElement("span");
        span.className = "sr-only";
        span.setAttribute("data-ls-a11y-new-window-indicator", "1");
        span.textContent = " (nouvelle fenêtre)";
        link.appendChild(span);
      } else {
        link.setAttribute("aria-label", baseName + " — nouvelle fenêtre");
      }

      link.setAttribute("data-ls-a11y-new-window", "1");
    });
  }

  /* =========================================================
     13.10 - Etiquette visible incluse dans le nom accessible
     WCAG 2.5.3 - Label in Name
  ========================================================= */
  function enhanceVisibleLabelInAccessibleName(root) {
    root = root || document;

    function normalize(value) {
      return String(value || "")
        .replace(/\s+/g, " ")
        .replace(/[’']/g, "'")
        .trim()
        .toLowerCase();
    }

    function visibleLabel(control) {
      if (!control) return "";

      if (control.tagName && control.tagName.toLowerCase() === "input") {
        return (control.getAttribute("value") || control.value || "").replace(/\s+/g, " ").trim();
      }

      var clone = control.cloneNode(true);
      Array.prototype.slice.call(clone.querySelectorAll(".sr-only, .visually-hidden, [aria-hidden='true']")).forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });

      return (clone.textContent || "").replace(/\s+/g, " ").trim();
    }

    function labelledbyText(control) {
      var ids = (control.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean);
      return ids.map(function (id) {
        var node = document.getElementById(id);
        return node ?(node.textContent || "") : "";
      }).join(" ").replace(/\s+/g, " ").trim();
    }

    function ensureLabelledbyContainsVisible(control, label) {
      var current = control.getAttribute("aria-labelledby") || "";
      var currentName = labelledbyText(control);
      if (normalize(currentName).indexOf(normalize(label)) !== -1) return;

      var id = control.id ?control.id + "-visible-label-name" : "ls-a11y-visible-label-name-" + Math.random().toString(36).slice(2);
      var token = document.getElementById(id);
      if (!token) {
        token = document.createElement("span");
        token.id = id;
        token.className = "sr-only visually-hidden";
        control.parentNode.insertBefore(token, control.nextSibling);
      }
      token.textContent = label;
      control.setAttribute("aria-labelledby", (current + " " + id).replace(/\s+/g, " ").trim());
    }

    var selector = [
      "#ls-button-submit",
      "button[name='move']",
      "input[type='submit'][name='move']",
      ".ls-move-previous-btn",
      ".ls-move-next-btn",
      ".ls-move-submit-btn",
      "button[type='submit']",
      "input[type='submit']"
    ].join(",");

    var controls = [];
    if (root.matches && root.matches(selector)) controls.push(root);
    Array.prototype.slice.call(root.querySelectorAll ?root.querySelectorAll(selector) : []).forEach(function (control) {
      if (controls.indexOf(control) === -1) controls.push(control);
    });

    controls.forEach(function (control) {
      var label = visibleLabel(control);
      if (!label) return;

      control.setAttribute("data-ls-a11y-label-in-name", "1");

      if (control.hasAttribute("aria-labelledby")) {
        ensureLabelledbyContainsVisible(control, label);
        return;
      }

      var ariaLabel = control.getAttribute("aria-label") || "";
      if (ariaLabel && normalize(ariaLabel).indexOf(normalize(label)) === -1) {
        control.setAttribute("aria-label", label + " - " + ariaLabel);
        return;
      }

      if (!ariaLabel && control.getAttribute("title") && normalize(control.getAttribute("title")).indexOf(normalize(label)) === -1) {
        control.setAttribute("aria-label", label);
      }
    });
  }

  function isVisible(el) {
    if (!el || el.nodeType !== 1) return false;

    // V250 TER4/TER5 : offsetParent seul n'est pas fiable avec certains
    // rendus LimeSurvey/Bootstrap (fieldset, wrappers, PJAX, éléments
    // positionnés ou conteneurs réorganisés). On combine donc style calculé
    // + dimensions + rectangles.
    if (el.hidden) return false;

    if (window.getComputedStyle) {
      var st = window.getComputedStyle(el);
      if (!st || st.display === "none" || st.visibility === "hidden" || st.visibility === "collapse") {
        return false;
      }
    }

    return !!(
      el.offsetParent !== null ||
      el.offsetWidth ||
      el.offsetHeight ||
      (el.getClientRects && el.getClientRects().length)
    );
  }

  function getBootstrapSelectWrapper(select) {
    if (!select || !select.matches || !select.matches("select")) return null;
    if (select.parentElement && select.parentElement.classList && select.parentElement.classList.contains("bootstrap-select")) {
      return select.parentElement;
    }
    var next = select.nextElementSibling;
    if (next && next.classList && next.classList.contains("bootstrap-select")) return next;
    return select.closest ?select.closest(".bootstrap-select") : null;
  }

  function isChoiceVisibleForValidation(control) {
    if (!control || control.disabled) return false;

    // Radio/checkbox LimeSurvey peuvent être masqués visuellement et remplacés
    // par un label stylé. Dans ce cas, offsetParent peut être null alors que
    // la réponse est bien visible et obligatoire.
    if (isVisible(control)) return true;

    var wrapper = control.closest ?control.closest(
      "li, .answer-item, .checkbox-item, .radio-item, .form-check, .checkbox, .radio, td, tr"
    ) : null;
    if (wrapper && isVisible(wrapper)) return true;

    if (control.id) {
      var labels = Array.prototype.slice.call((control.ownerDocument || document).querySelectorAll("label"));
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].getAttribute("for") === control.id && isVisible(labels[i])) return true;
      }
    }

    return false;
  }

  function isControlVisibleForValidation(control) {
    if (!control || control.disabled) return false;

    if (control.matches && control.matches('input[type="checkbox"], input[type="radio"]')) {
      return isChoiceVisibleForValidation(control);
    }

    if (isVisible(control)) return true;

    // Les select bootstrap-select sont parfois masqués au profit d'un bouton visible.
    // Ils doivent rester validables, sinon une liste déroulante obligatoire peut être ignorée.
    if (control.matches && control.matches("select")) {
      var wrap = getBootstrapSelectWrapper(control);
      if (wrap && isVisible(wrap)) return true;
      var btn = wrap ?wrap.querySelector("button.dropdown-toggle") : null;
      if (btn && isVisible(btn)) return true;
    }

    return false;
  }

  function focusTargetForControl(control) {
    if (!control) return null;
    if (control.matches && control.matches("select")) {
      var wrap = getBootstrapSelectWrapper(control);
      var btn = wrap ?wrap.querySelector("button.dropdown-toggle:not([disabled])") : null;
      if (btn && isVisible(btn)) return btn;
    }
    return control;
  }

  /* =========================================================
     0) Limite caractères sur input text/number (delegation jQuery)
  ========================================================= */
  function wireMaxLenDelegation() {
    if (!$) return;
    if (window.__LS_MAXLEN_DELEGATION_BOUND__) return;
    window.__LS_MAXLEN_DELEGATION_BOUND__ = true;

    // Délégation unique : fonctionne aussi avec le rechargement PJAX de LimeSurvey
    $(document)
      .off("input.lsA11yMaxLen", 'input[type="text"], input[type="number"]')
      .on("input.lsA11yMaxLen", 'input[type="text"], input[type="number"]', function () {
      var $field = $(this);

      var sizeAttr = parseInt($field.attr("size"), 10);
      var maxAttr = parseInt($field.attr("maxlength"), 10);

      var max = sizeAttr || maxAttr;
      if (!max || isNaN(max)) return;

      var val = $field.val().toString();

      if (val.length > max) {
        alert("Vous ne pouvez pas saisir plus de " + max + " caractères dans ce champ.");
        $field.val(val.slice(0, max));
      }
    });
  }

  /* =========================================================
     0b) relevance:on/off (JS + jQuery) : réactiver/désactiver
  ========================================================= */
  function wireRelevanceHandlers() {
    if (!$) return;
    if (window.__LS_RELEVANCE_HANDLERS_BOUND__) return;
    window.__LS_RELEVANCE_HANDLERS_BOUND__ = true;

    $(document)
      .off("relevance:on.lsA11yRelevance")
      .on("relevance:on.lsA11yRelevance", function (event) {
      var $target = $(event.target);

      $target.removeClass("ls-hidden ls-irrelevant");
      $target.removeAttr("hidden");
      $target.css("display", "");
      $target.css("pointer-events", "auto");

      $target.find("input, select, textarea, button").each(function () {
        var $el = $(this);

        // 🔴 EXCEPTION : commentaires des multiple-opt-comments (gérés par le bloc 8a)
        if (
          $el.is('input[type="text"][id$="comment"], textarea[id$="comment"]') &&
          $el
            .closest(
              "fieldset.row.multiple-opt-comments.mandatory.question-container," +
                "fieldset.row.multiple-opt-comments.mandatory.questionnaire-container," +
                "fieldset.row.multiple-opt-comments.mandatory.question-containe"
            )
            .length
        ) {
          return;
        }

        $el.prop("disabled", false);
        $el.removeAttr("disabled");
        $el.attr("aria-disabled", "false");
      });
    });

    $(document)
      .off("relevance:off.lsA11yRelevance")
      .on("relevance:off.lsA11yRelevance", function (event) {
      var $target = $(event.target);

      $target.addClass("ls-hidden ls-irrelevant");
      $target.css("pointer-events", "none");

      $target.find("input, select, textarea, button").each(function () {
        $(this).prop("disabled", true);

        if ($(this).is(":checkbox") || $(this).is(":radio")) {
          $(this).prop("checked", false);
        }
        if ($(this).is(":text") || $(this).is("textarea")) {
          $(this).val("");
        }
      });
    });
  }

  /* =========================================================
     1) DATES : trio Jour/Mois/Année + input type="date" caché
  ========================================================= */
  function initPassageLanguageHints(root) {
    root = root || document;

    var CONTENT_SELECTOR = [
      ".question-container",
      ".questionnaire-container",
      ".group-description",
      ".group-title",
      ".question-title-container",
      ".question-text",
      ".ls-label-question",
      ".answer-container",
      ".answer-item",
      ".ls-questionhelp"
    ].join(", ");

    var SKIP_SELECTOR = "script, style, textarea, input, select, option, code, pre, [contenteditable='true']";
    var LANG_TOKEN_RE = /^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/;
    var LANG_INLINE_RE = /\[lang=([a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*)\]([\s\S]*?)\[\/lang\]/g;

    function normaliseLang(value) {
      value = String(value || "").trim().replace("_", "-");
      return LANG_TOKEN_RE.test(value) ?value : "";
    }

    function setLang(el, lang) {
      lang = normaliseLang(lang);
      if (!el || !lang || el.hasAttribute("lang")) return;
      el.setAttribute("lang", lang);
      el.setAttribute("xml:lang", lang);
      el.setAttribute("data-ls-a11y-lang-applied", "1");
    }

    function classLang(el) {
      var classes = Array.prototype.slice.call(el.classList || []);
      for (var i = 0; i < classes.length; i++) {
        var match = /^lang-([a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*)$/.exec(classes[i]);
        if (match) return match[1];
      }
      return "";
    }

    function applyExplicitMarkers(scope) {
      if (
        scope.matches &&
        scope.matches("[data-lang], [data-ls-lang], [data-language], [class*='lang-']") &&
        !scope.closest(SKIP_SELECTOR)
      ) {
        setLang(scope, scope.getAttribute("data-lang") || scope.getAttribute("data-ls-lang") || scope.getAttribute("data-language") || classLang(scope));
      }

      scope.querySelectorAll("[data-lang], [data-ls-lang], [data-language], [class*='lang-']").forEach(function (el) {
        if (el.closest(SKIP_SELECTOR)) return;
        setLang(el, el.getAttribute("data-lang") || el.getAttribute("data-ls-lang") || el.getAttribute("data-language") || classLang(el));
      });
    }

    function replaceInlineTokens(container) {
      if (!container || container.getAttribute("data-ls-a11y-lang-tokenized") === "1") return;
      if (container.closest(SKIP_SELECTOR)) return;

      var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node || !node.nodeValue || node.nodeValue.indexOf("[lang=") === -1) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(SKIP_SELECTOR + ", [lang]")) return NodeFilter.FILTER_REJECT;
          LANG_INLINE_RE.lastIndex = 0;
          return LANG_INLINE_RE.test(node.nodeValue) ?NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });

      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(function (node) {
        var text = node.nodeValue;
        var fragment = document.createDocumentFragment();
        var lastIndex = 0;
        var match;

        LANG_INLINE_RE.lastIndex = 0;
        while ((match = LANG_INLINE_RE.exec(text))) {
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }

          var span = document.createElement("span");
          setLang(span, match[1]);
          span.textContent = match[2];
          fragment.appendChild(span);
          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
      });

      container.setAttribute("data-ls-a11y-lang-tokenized", "1");
    }

    var scopes = [];
    if (root.matches && root.matches(CONTENT_SELECTOR)) scopes.push(root);
    root.querySelectorAll(CONTENT_SELECTOR).forEach(function (scope) {
      if (scopes.indexOf(scope) === -1) scopes.push(scope);
    });

    scopes.forEach(function (scope) {
      applyExplicitMarkers(scope);
      replaceInlineTokens(scope);
    });
  }

  function initDateTriplets(root) {
    (root || document).querySelectorAll(".question-container").forEach(function (q) {
      var hiddenDate = q.querySelector(".ls-js-hidden input[type='date'][id^='answer']");
      var day = q.querySelector("select.day");
      var month = q.querySelector("select.month");
      var year = q.querySelector("select.year");
      var form = q.closest("form");

      if (!hiddenDate || !day || !month || !year || !form) return;

      if (q.dataset.lsDateTripletWired === "1") return;
      q.dataset.lsDateTripletWired = "1";

      hiddenDate.removeAttribute("required");
      hiddenDate.setAttribute("tabindex", "-1");
      hiddenDate.setAttribute("aria-hidden", "true");
      hiddenDate.disabled = true;

      function updateHidden() {
        var dd = day.value,
          mm = month.value,
          yyyy = year.value;
        hiddenDate.value = dd && mm && yyyy ?yyyy + "-" + mm + "-" + dd : "";
      }

      [day, month, year].forEach(function (el) {
        el.addEventListener("change", updateHidden);
      });

      form.addEventListener("submit", function () {
        updateHidden();
        if (hiddenDate.value) hiddenDate.disabled = false;
      });

      q.addEventListener(
        "invalid",
        function (e) {
          if (e.target === hiddenDate) {
            e.preventDefault();
            var firstEmpty = [day, month, year].find(function (el) {
              return !el.value;
            }) || day;
            firstEmpty.focus();
          }
        },
        true
      );
    });
  }

  /* =========================================================
     1b) Placeholders Jour/Mois/Année
  ========================================================= */
  function initDatePlaceholders() {
    if (!$) return;
    $("select.day option:first").text("Jour");
    $("select.month option:first").text("Mois");
    $("select.year option:first").text("Année");
  }

  /* =========================================================
     2) Nettoyage required hidden/other/multiple + questionhelp role
  ========================================================= */
  function removeRequiredFromHiddenInputs(scope) {
    (scope || document)
      .querySelectorAll("input[type='hidden'][disabled]")
      .forEach(function (input) {
        if (input.hasAttribute("required")) input.removeAttribute("required");
      });
  }

  function removeRequiredFromOtherTextInputs(scope) {
    (scope || document)
      .querySelectorAll(".ls-js-hidden .col-12 input.form-control.input-sm")
      .forEach(function (input) {
        if ((input.id || "").indexOf("othertext") !== -1 && input.hasAttribute("required")) {
          input.removeAttribute("required");
        }
      });
  }

  function removeRequiredFromMultipleOptMandatoryFieldsets(scope) {
    (scope || document)
      .querySelectorAll("fieldset.multiple-opt.mandatory input")
      .forEach(function (input) {
        if (input.hasAttribute("required")) input.removeAttribute("required");
      });
  }

  function removeAlertRoleOnQuestionHelp(scope) {
    var root = scope || document;
    root.querySelectorAll(".ls-questionhelp").forEach(function (el) {
      // Les aides visibles restent disponibles dans le flux et via les libellés ;
      // elles ne doivent pas créer une zone live concurrente.
      if (el.getAttribute("role") === "alert" || el.getAttribute("role") === "status") {
        el.removeAttribute("role");
      }
      el.removeAttribute("aria-live");
      el.removeAttribute("aria-atomic");
    });
  }

  function initRequiredCleanupObservers() {
    removeRequiredFromHiddenInputs(document);
    removeRequiredFromOtherTextInputs(document);
    removeRequiredFromMultipleOptMandatoryFieldsets(document);
    removeAlertRoleOnQuestionHelp(document);

    var observer = new MutationObserver(function () {
      removeRequiredFromHiddenInputs(document);
      removeRequiredFromOtherTextInputs(document);
      removeRequiredFromMultipleOptMandatoryFieldsets(document);
      removeAlertRoleOnQuestionHelp(document);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("pjax:success", function () {
      removeAlertRoleOnQuestionHelp(document);
    });
  }

  /* =========================================================
     3) Transformation DIV -> FIELDSET (list-dropdown, yes-no, etc.)
  ========================================================= */
  function divToFieldset(selector, withLegendSelector, root) {
    (root || document).querySelectorAll(selector).forEach(function (div) {
      if (div.tagName.toLowerCase() === "fieldset") return;
      var fs = document.createElement("fieldset");
      Array.prototype.forEach.call(div.attributes, function (attr) {
        fs.setAttribute(attr.name, attr.value);
      });
      while (div.firstChild) fs.appendChild(div.firstChild);
      div.parentNode.replaceChild(fs, div);

      if (withLegendSelector) {
        var label = fs.querySelector(withLegendSelector);
        if (label) {
          var lg = document.createElement("legend");
          lg.innerHTML = label.innerHTML;
          lg.className = label.className;
          label.parentNode.replaceChild(lg, label);
        }
      }
    });
  }

  function initDivToFieldset(root) {
    root = root || document;

    divToFieldset("div.list-dropdown", "label.ls-label-question", root);
    divToFieldset("div.yes-no", "label.ls-label-question", root);
    divToFieldset("div.numeric-multi", "label.ls-label-question", root);
    divToFieldset("div.question-container.date", "label.ls-label-question", root);
    divToFieldset("div.multiple-opt", ":scope > label", root);
    divToFieldset("div.question-container.multiple-short-txt", "label.ls-label-question", root);

    // Suppression des messages "question-valid-container"
    root.querySelectorAll("div.question-valid-container.text-info.col-12").forEach(function (div) {
      if (div.parentNode) div.parentNode.removeChild(div);
    });
  }

  /* =========================================================
     4) REQUIRED conditionnel (visible + mandatory)
  ========================================================= */
  function isHidden(el) {
    if (!el) return true;
    var cs = getComputedStyle(el);
    return cs.display === "none" || cs.visibility === "hidden" || el.classList.contains("ls-hidden");
  }

  function updateRequiredForInputsSelectsAndRadios(root) {
    (root || document).querySelectorAll(".mandatory").forEach(function (scope) {
      var hidden = isHidden(scope);
      var inputs = scope.querySelectorAll(
        'input[type="text"], input[type="email"], select:not(.day):not(.month):not(.year)'
      );
      var radios = scope.querySelectorAll('input[type="radio"]');
      var checkboxes = scope.querySelectorAll('input[type="checkbox"]');

      if (hidden) {
        inputs.forEach(function (input) {
          input.removeAttribute("required");
        });
        radios.forEach(function (radio) {
          radio.removeAttribute("required");
        });
        checkboxes.forEach(function (cb) {
          cb.removeAttribute("required");
        });
        return;
      }

      inputs.forEach(function (input) {
        var isOtherTextItem = !!input.closest(".other-text-item");
        if (isOtherTextItem) {
          input.removeAttribute("required");
          return;
        }
        if (!isHidden(input) || isControlVisibleForValidation(input)) input.setAttribute("required", "required");
        else input.removeAttribute("required");
      });

      // radios par groupe
      var radioGroups = {};
      radios.forEach(function (radio) {
        if (!radio.name) return;
        if (!radioGroups[radio.name]) radioGroups[radio.name] = [];
        radioGroups[radio.name].push(radio);
      });

      Object.keys(radioGroups).forEach(function (name) {
        var group = radioGroups[name];
        var isSelected = group.some(function (r) {
          return r.checked;
        });
        group.forEach(function (r) {
          if (isSelected || isHidden(r)) r.removeAttribute("required");
          else r.setAttribute("required", "required");
        });
      });
    });
  }

  function validateRadioRequirementsInTable(root) {
    (root || document).querySelectorAll(".ls-table-wrapper").forEach(function (wrapper) {
      wrapper.querySelectorAll("tr").forEach(function (row) {
        var isMandatoryRow = row.classList.contains("mandatory");
        var radios = row.querySelectorAll(".radio-list input[type='radio']");
        var isSelected = Array.prototype.some.call(radios, function (r) {
          return r.checked;
        });

        radios.forEach(function (radio) {
          if (!isMandatoryRow || isHidden(radio)) {
            radio.removeAttribute("required");
          } else {
            if (isSelected) radio.removeAttribute("required");
            else radio.setAttribute("required", "required");
          }
        });
      });
    });
  }

  function initRequiredObserver() {
    updateRequiredForInputsSelectsAndRadios(document);
    validateRadioRequirementsInTable(document);

    var observer = new MutationObserver(function (mutations) {
      var need = false;
      mutations.forEach(function (m) {
        if (m.type === "attributes" || m.type === "childList") need = true;
      });
      if (need) {
        updateRequiredForInputsSelectsAndRadios(document);
        validateRadioRequirementsInTable(document);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  /* =========================================================
     4c) REQUIRED sur text-long/text-short mandatory (visible)
  ========================================================= */
  function addRequiredToTextLongMandatory(root) {
    (root || document).querySelectorAll(".text-long.mandatory").forEach(function (div) {
      div.querySelectorAll("input, select, textarea").forEach(function (input) {
        if (isVisible(input)) input.setAttribute("required", "required");
        else input.removeAttribute("required");
      });
    });
  }

  function updateRequiredForTextShortQuestions(root) {
    (root || document).querySelectorAll("div.text-short.mandatory").forEach(function (questionDiv) {
      var input = questionDiv.querySelector("input");
      if (!input) return;
      var previousSibling = questionDiv.previousElementSibling;
      var isHiddenDiv = questionDiv.classList.contains("ls-hidden");
      var isHiddenPrev = previousSibling && previousSibling.classList.contains("ls-hidden");
      if (isHiddenDiv || isHiddenPrev) input.removeAttribute("required");
      else if (!isHiddenDiv) input.setAttribute("required", "required");
    });
  }

  function initTextLongShortRequiredObserver() {
    addRequiredToTextLongMandatory(document);
    updateRequiredForTextShortQuestions(document);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === "class" || m.type === "childList") {
          addRequiredToTextLongMandatory(document);
          updateRequiredForTextShortQuestions(document);
        }
      });
    });

    document.querySelectorAll("div.text-short.mandatory").forEach(function (div) {
      observer.observe(div, { attributes: true, attributeFilter: ["class"] });
    });
  }

  /* =========================================================
     4d) FIELDSET list-radio mandatory : required seulement si visible
  ========================================================= */
  function applyRequiredRadiosFieldsets(root) {
    (root || document)
      .querySelectorAll("fieldset.question-container.list-radio.mandatory, fieldset.list-radio.mandatory")
      .forEach(function (fieldset) {
        var visible =
          !fieldset.classList.contains("ls-hidden") &&
          !fieldset.classList.contains("ls-irrelevant") &&
          window.getComputedStyle(fieldset).display !== "none";
        var radios = fieldset.querySelectorAll('input[type="radio"][name]');
        if (!radios.length) return;

        var groups = {};
        radios.forEach(function (r) {
          if (!r.name) return;
          if (!groups[r.name]) groups[r.name] = [];
          groups[r.name].push(r);
        });

        Object.keys(groups).forEach(function (name) {
          var arr = groups[name];
          var anyChecked = arr.some(function (r) {
            return r.checked;
          });
          arr.forEach(function (r) {
            r.removeAttribute("required");
          });
          if (visible && !anyChecked) {
            var rep = arr.find(function (r) {
              return !r.disabled;
            }) || arr[0];
            if (rep) rep.setAttribute("required", "required");
          }
        });
      });
  }

  function initListRadioRequiredObserver() {
    applyRequiredRadiosFieldsets(document);

    var observer = new MutationObserver(function () {
      applyRequiredRadiosFieldsets(document);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });

    setTimeout(function () {
      applyRequiredRadiosFieldsets(document);
    }, 300);
    setTimeout(function () {
      applyRequiredRadiosFieldsets(document);
    }, 1000);
    setTimeout(function () {
      applyRequiredRadiosFieldsets(document);
    }, 2000);
  }

  /* =========================================================
     4f) Unhide si relevant (sauf masquage manuel)
  ========================================================= */
  function unhideIfRelevant(q) {
    if (!q) return;
    if (!q.id || !/^question/.test(q.id)) return;

    // 🔴 si cachée volontairement par JS, on ne touche pas
    if (q.dataset.lsManualHide === "1") return;

    // Si encore ls-irrelevant (EM) → on ne touche pas
    if (q.classList.contains("ls-irrelevant")) return;

    var wasHiddenClass = q.classList.contains("ls-hidden");
    var wasHiddenAttr = q.hasAttribute("hidden");
    var wasHiddenStyle = q.style.display === "none";

    if (wasHiddenClass || wasHiddenAttr || wasHiddenStyle) {
      q.classList.remove("ls-hidden");
      q.removeAttribute("hidden");
      if (q.style.display === "none") q.style.display = "";
      q.setAttribute("aria-hidden", "false");
    }
  }

  function initUnhideRelevantWatcher() {
    document.querySelectorAll('fieldset[id^="question"], div[id^="question"]').forEach(unhideIfRelevant);

    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type !== "attributes" || m.attributeName !== "class") return;
        var el = m.target;
        if (!el.id || !/^question/.test(el.id)) return;
        unhideIfRelevant(el);
      });
    });

    mo.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }


  /* =========================================================
     4e) REQUIRED sur .row.text-short / .row.text-long (visible + mandatory)
  ========================================================= */
  function updateRequiredAttributes(root) {
    (root || document)
      .querySelectorAll(".row.text-short input[type='text'], .row.text-long textarea")
      .forEach(function (el) {
        var row = el.closest(".row.text-short, .row.text-long");
        if (!row) return;
        if (isVisible(row) && row.classList.contains("mandatory")) el.setAttribute("required", "required");
        else el.removeAttribute("required");
      });
  }

  function updateRadioRequiredAttributes(root) {
    (root || document).querySelectorAll(".radio-list input[type='radio']").forEach(function (radio) {
      var container = radio.closest(".radio-list");
      if (container && container.classList.contains("mandatory")) radio.setAttribute("required", "required");
      else radio.removeAttribute("required");
    });
  }

  function initRowRequiredObservers() {
    updateRequiredAttributes(document);
    updateRadioRequiredAttributes(document);

    var observer = new MutationObserver(function () {
      updateRequiredAttributes(document);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });

    var observer2 = new MutationObserver(function () {
      updateRadioRequiredAttributes(document);
    });
    observer2.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* =========================================================
     5) Cacher pickers calendrier GUI natifs
  ========================================================= */
  function hideNativePickers(root) {
    (root || document).querySelectorAll(".input-group-addon").forEach(function (div) {
      var calendarIcon = div.querySelector("i.fa-calendar");
      if (calendarIcon) div.style.display = "none";
    });
    (root || document).querySelectorAll(".tempus-dominus-widget").forEach(function (div) {
      div.style.display = "none";
    });
    (root || document).querySelectorAll(".date-container").forEach(function (div) {
      div.style.display = "none";
    });
  }

  /* =========================================================
     6) Auto type email/tel/num/date selon classes
  ========================================================= */
  function initAutoTypes() {
    if (window.__AUTO_TYPE_EMAIL_TEL_NUM_DATE__) return;
    window.__AUTO_TYPE_EMAIL_TEL_NUM_DATE__ = true;

    function setType(el, type) {
      try {
        var isOtherField = !!el.closest(".other-text-item");
        var hasSpecificClass = !!el.closest(".email, .tel, .num, .date, .numeric");
        if (isOtherField || !hasSpecificClass) return;
        if (el.type !== type) el.type = type;
      } catch (e) {
        if (type === "email") el.setAttribute("pattern", "[^\\s@]+@[^\\s@]+\\.[^\\s@]+");
        if (type === "tel") el.setAttribute("pattern", "[0-9+()\\s.-]{6,}");
        if (type === "number") el.setAttribute("inputmode", "numeric");
        el.setAttribute("data-fallback-type", type);
      }
    }

    function convertIn(root, cls, targetType) {
      var nodes = new Set(Array.prototype.slice.call(root.querySelectorAll("div." + cls + ", fieldset." + cls)));
      nodes.forEach(function (container) {
        if (cls === "date" && container.querySelector("select.day, select.month, select.year")) return;
        container.querySelectorAll('input[type="text"]').forEach(function (inp) {
          if (inp.disabled) return;
          if (inp.matches('[type="hidden"], [data-no-convert]')) return;

          var isOtherField = !!inp.closest(".other-text-item");
          var isInMultiple = !!inp.closest(".multiple-opt");
          var hasIdOther = (inp.id || "").indexOf("other") !== -1;
          if (isOtherField || isInMultiple || hasIdOther) return;

          setType(inp, targetType);

          if (targetType === "email") {
            if (!inp.getAttribute("autocomplete")) inp.setAttribute("autocomplete", "email");
            if (!inp.getAttribute("inputmode")) inp.setAttribute("inputmode", "email");
            if (!inp.placeholder && !inp.value) inp.placeholder = "prenom.nom@organisme.fr";
          }
          if (targetType === "tel") {
            if (!inp.getAttribute("autocomplete")) inp.setAttribute("autocomplete", "tel");
            if (!inp.getAttribute("inputmode")) inp.setAttribute("inputmode", "tel");
            if (!inp.placeholder && !inp.value) inp.placeholder = "0123456789";
          }
          if (targetType === "number") {
            if (!inp.hasAttribute("step")) inp.setAttribute("step", "1");
            if (!inp.getAttribute("inputmode")) inp.setAttribute("inputmode", "numeric");
          }
          if (targetType === "date") {
            if (!inp.placeholder && !inp.value) inp.placeholder = "aaaa-mm-jj";
          }
        });
      });
    }

    function normaliseAutocompleteText(value) {
      return (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[’']/g, " ")
        .replace(/[_\-]+/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .trim();
    }

    function hasWord(text, word) {
      return new RegExp("(^|[^a-z0-9])" + word + "([^a-z0-9]|$)", "i").test(text || "");
    }

    function hasAny(text, words) {
      return words.some(function (word) { return hasWord(text, word); });
    }

    function getLabelTextForControl(el) {
      var parts = [];

      if (el.id) {
        try {
          document.querySelectorAll('label[for="' + CSS.escape(el.id) + '"]').forEach(function (label) {
            parts.push(label.textContent || "");
          });
        } catch (e) {}
      }

      if (el.labels && el.labels.length) {
        Array.prototype.forEach.call(el.labels, function (label) {
          parts.push(label.textContent || "");
        });
      }

      var wrappingLabel = el.closest && el.closest("label");
      if (wrappingLabel) parts.push(wrappingLabel.textContent || "");

      var row = el.closest && el.closest(".answer-item, .form-group, .question-item, li, tr");
      if (row) {
        var rowLabel = row.querySelector("label, th, .control-label, .ls-label-question");
        if (rowLabel) parts.push(rowLabel.textContent || "");
      }

      var question = el.closest && el.closest(".question-container, .questionnaire-container, .ls-question, .group-outer-container");
      if (question) {
        var qTitle = question.querySelector(".question-title-container, .question-text, .ls-question-text, .question-title, legend");
        if (qTitle) parts.push(qTitle.textContent || "");
      }

      return parts.join(" ");
    }

    function getAutocompleteFingerprint(el) {
      return normaliseAutocompleteText([
        el.getAttribute("name"),
        el.id,
        el.getAttribute("placeholder"),
        el.getAttribute("aria-label"),
        el.getAttribute("title"),
        getLabelTextForControl(el)
      ].filter(Boolean).join(" "));
    }

    var VALID_AUTOCOMPLETE_TOKENS = [
      "name",
      "honorific-prefix",
      "given-name",
      "additional-name",
      "family-name",
      "honorific-suffix",
      "nickname",
      "username",
      "new-password",
      "current-password",
      "organization-title",
      "organization",
      "street-address",
      "address-line1",
      "address-line2",
      "address-line3",
      "address-level1",
      "address-level2",
      "address-level3",
      "address-level4",
      "country",
      "country-name",
      "postal-code",
      "cc-name",
      "cc-given-name",
      "cc-additional-name",
      "cc-family-name",
      "cc-number",
      "cc-exp",
      "cc-exp-month",
      "cc-exp-year",
      "cc-csc",
      "cc-type",
      "transaction-currency",
      "transaction-amount",
      "language",
      "bday",
      "bday-day",
      "bday-month",
      "bday-year",
      "sex",
      "url",
      "photo",
      "tel",
      "tel-country-code",
      "tel-national",
      "tel-area-code",
      "tel-local",
      "tel-local-prefix",
      "tel-local-suffix",
      "tel-extension",
      "email",
      "impp"
    ];

    function normalizeAutocompleteToken(value) {
      value = normaliseAutocompleteText(value).replace(/\s+/g, "-");
      return VALID_AUTOCOMPLETE_TOKENS.indexOf(value) !== -1 ?value : "";
    }

    function explicitAutocompleteToken(el) {
      if (!el || !el.closest) return "";

      var carriers = [el];
      var question = el.closest(".question-container, .questionnaire-container, .ls-question, fieldset[id^='question'], div[id^='question']");
      var row = el.closest(".answer-item, .form-group, .question-item, li, tr");
      if (row && carriers.indexOf(row) === -1) carriers.push(row);
      if (question && carriers.indexOf(question) === -1) carriers.push(question);

      for (var i = 0; i < carriers.length; i++) {
        var node = carriers[i];
        var raw =
          node.getAttribute("data-autocomplete") ||
          node.getAttribute("data-ls-autocomplete") ||
          node.getAttribute("data-a11y-autocomplete") ||
          node.getAttribute("data-purpose") ||
          "";
        var token = normalizeAutocompleteToken(raw);
        if (token) return token;

        var classes = Array.prototype.slice.call(node.classList || []);
        for (var j = 0; j < classes.length; j++) {
          var match = /^(?:autocomplete|autofill|purpose)-([a-zA-Z0-9_-]+)$/.exec(classes[j]);
          if (match) {
            token = normalizeAutocompleteToken(match[1]);
            if (token) return token;
          }
        }
      }

      return "";
    }

    function detectAutocompleteToken(text, el) {
      if (!text) return "";

      // Champs exclus ou trop ambigus : ne pas enrichir des recherches, commentaires libres, captcha, fichiers, etc.
      if (hasAny(text, ["captcha", "commentaire", "remarque", "observation", "message", "recherche", "search", "mot de passe", "password"])) {
        return "";
      }

      // Ordre volontaire : email avant adresse, téléphone avant nombre, prénom avant nom.
      if (/\b(e\s*mail|email|courriel|mel|mail|adresse electronique|adresse mail)\b/.test(text)) return "email";
      if (/\b(tel|telephone|portable|mobile|gsm|numero de telephone|n(?:°|o|umero) de telephone)\b/.test(text)) return "tel";

      if (/\b(date de naissance|naissance|birthdate|birthday)\b/.test(text)) {
        if (el.matches("select.day, input.day") || hasWord(text, "jour")) return "bday-day";
        if (el.matches("select.month, input.month") || hasWord(text, "mois")) return "bday-month";
        if (el.matches("select.year, input.year") || hasAny(text, ["annee", "an"])) return "bday-year";
        return "bday";
      }

      if (/\b(code postal|cp|postal code|zipcode|zip code)\b/.test(text)) return "postal-code";
      if (/\b(ville|commune|localite|city)\b/.test(text)) return "address-level2";
      if (/\b(pays|country)\b/.test(text)) return "country-name";
      if (/\b(region|departement|province|state)\b/.test(text)) return "address-level1";
      if (/\b(complement d adresse|adresse ligne 2|ligne 2|address line 2)\b/.test(text)) return "address-line2";
      if (/\b(adresse ligne 1|ligne 1|address line 1)\b/.test(text)) return "address-line1";
      if (/\b(adresse postale|adresse personnelle|adresse du domicile|domicile|rue|voie|street address|adresse)\b/.test(text)) return "street-address";

      if (/\b(organisme|organisation|structure|etablissement|societe|entreprise|universite|laboratoire|service|company|organization)\b/.test(text)) return "organization";
      if (/\b(fonction|poste|metier|profession|titre professionnel|job title)\b/.test(text)) return "organization-title";

      if (/\b(identifiant|login|nom d utilisateur|nom utilisateur|compte utilisateur|user id|user identifier|username)\b/.test(text)) return "username";
      if (/\b(civilite|titre|madame|monsieur|mme|mr|m\.)\b/.test(text)) return "honorific-prefix";
      if (/\b(prenom|first name|given name)\b/.test(text)) return "given-name";
      if (/\b(nom de famille|patronyme|surname|last name|family name)\b/.test(text)) return "family-name";
      if (/\b(nom et prenom|prenom et nom|identite|full name|nom complet)\b/.test(text)) return "name";
      if (hasWord(text, "nom")) return "family-name";

      return "";
    }

    function mayReceiveAutocomplete(el) {
      if (!el || !el.matches) return false;
      if (el.disabled || el.readOnly) return false;
      if (el.matches('[data-no-autocomplete], [data-no-convert], [aria-hidden="true"]')) return false;
      if (el.closest('.other-text-item, .em_default, .ls-hidden, [hidden]')) return false;

      if (el.matches("textarea, select")) return true;
      if (!el.matches("input")) return false;

      var type = (el.getAttribute("type") || "text").toLowerCase();
      return ["text", "email", "tel", "url", "search", "number", "date"].indexOf(type) !== -1;
    }

    function applyAutocompleteToken(el, token) {
      if (!token) return;
      var current = (el.getAttribute("autocomplete") || "").trim().toLowerCase();

      // On conserve les valeurs déjà utiles ; on remplace seulement l'absence ou autocomplete=off.
      if (current && current !== "off" && current !== "false") return;

      el.setAttribute("autocomplete", token);
      el.setAttribute("data-ls-a11y-autocomplete", token);

      if (token === "email") {
        if (el.matches('input[type="text"], input:not([type])')) setType(el, "email");
        if (!el.getAttribute("inputmode")) el.setAttribute("inputmode", "email");
      }

      if (token === "tel") {
        if (el.matches('input[type="text"], input:not([type])')) setType(el, "tel");
        if (!el.getAttribute("inputmode")) el.setAttribute("inputmode", "tel");
      }
    }

    function enhanceStandardAutocomplete(root) {
      root = root || document;
      root.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (!mayReceiveAutocomplete(el)) return;
        var fingerprint = getAutocompleteFingerprint(el);
        var token = explicitAutocompleteToken(el) || detectAutocompleteToken(fingerprint, el);
        applyAutocompleteToken(el, token);
      });
    }

    function run(root) {
      root = root || document;
      convertIn(root, "email", "email");
      convertIn(root, "tel", "tel");
      convertIn(root, "num", "number");
      convertIn(root, "date", "date");
      convertIn(root, "numeric", "number");
      enhanceStandardAutocomplete(root);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        run(document);
      });
    } else {
      run(document);
    }

    document.addEventListener("pjax:success", function (e) {
      run((e && e.target) ?e.target : document);
    });
    document.addEventListener("pjax:complete", function (e) {
      run((e && e.target) ?e.target : document);
    });

    var mo = new MutationObserver(function (muts) {
      if (muts.some(function (m) { return m.addedNodes && m.addedNodes.length; })) {
        clearTimeout(run._t);
        run._t = setTimeout(run, 60);
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* =========================================================
     7.1 — Radios avec valeur "-oth-" (autre)
  ========================================================= */
  function initOtherRadios(root) {
    ensureHiddenCSS();
    root = root || document;

    function getOtherBox(scope) {
      return scope.querySelector(".text-item.other-text-item");
    }

    function setHidden(box, hide) {
      if (!box) return;
      box.classList.toggle("ls-hidden", !!hide);
      box.setAttribute("aria-hidden", hide ?"true" : "false");
      box.querySelectorAll("input[type='text'], textarea").forEach(function (inp) {
        inp.disabled = !!hide;
        if (hide) {
          inp.required = false;
          inp.removeAttribute("required");
        }
      });
    }

    function updateGroup(scope) {
      var box = getOtherBox(scope);
      if (!box) return;
      var radios = scope.querySelectorAll("input[type='radio'][name]");
      var checked = Array.prototype.find.call(radios, function (r) { return r.checked; });
      var isOther = !!(checked && checked.value === "-oth-");
      setHidden(box, !isOther);
    }

    root
      .querySelectorAll("li.answer-item.radio-text-item, .answers-list, .answer-list")
      .forEach(function (scope) {
        var box = getOtherBox(scope);
        if (box) setHidden(box, true);

        scope.querySelectorAll("input[type='radio'][name]").forEach(function (r) {
          if (r.dataset.lsOtherRadioWired === "1") return;
          r.dataset.lsOtherRadioWired = "1";
          function handler() { setTimeout(function () { updateGroup(scope); }, 0); }
          r.addEventListener("change", handler);
          r.addEventListener("click", handler);
        });
        updateGroup(scope);
      });
  }

  /* =========================================================
     7.2 — Checkboxes "Autre" (multiple-opt)
  ========================================================= */
  function initOtherCheckboxes(root) {
    root = root || document;

    var FS_SEL =
      "fieldset.row.multiple-opt.mandatory.question-container, " +
      "fieldset.row.multiple-opt.mandatory.questionnaire-container";
    var OTHER_CB_SEL = FS_SEL + " input.other-checkbox";
    var OTHER_WRAP_SEL = ".text-item.other-text-item";
    var OTHER_INPUT_SEL = "input[type='text'][id$='other']";

    function toggleOther(cb) {
      var li = cb.closest("li");
      if (!li) return;
      var wrap = li.querySelector(OTHER_WRAP_SEL);
      var input = li.querySelector(OTHER_INPUT_SEL);
      if (!wrap || !input) return;
      if (cb.checked) {
        wrap.classList.remove("ls-hidden", "ls-irrelevant", "ls-js-hidden");
        wrap.setAttribute("aria-hidden", "false");
        input.disabled = false;
        input.setAttribute("aria-disabled", "false");
      } else {
        wrap.classList.add("ls-hidden");
        wrap.setAttribute("aria-hidden", "true");
        input.disabled = true;
        input.setAttribute("aria-disabled", "true");
      }
    }

    root.querySelectorAll(OTHER_CB_SEL).forEach(function (cb) {
      if (cb.dataset.otherWired) return;
      cb.dataset.otherWired = "1";
      cb.addEventListener("change", function () { toggleOther(cb); });
      toggleOther(cb);
    });

    root
      .querySelectorAll(FS_SEL + " li[id$='other'] " + OTHER_INPUT_SEL)
      .forEach(function (inp) {
        if (inp.dataset.otherSyncBound) return;
        inp.dataset.otherSyncBound = "1";
        inp.addEventListener("input", function () {
          var li = inp.closest("li");
          var cb = li && li.querySelector("input.other-checkbox");
          if (!cb) return;
          var hasText = inp.value.trim().length > 0;
          if (cb.checked !== hasText) {
            cb.checked = hasText;
            cb.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      });
  }

  /* =========================================================
     7.3 — Désactiver complètement "Autre :" sur certaines list-radio mandatory
  ========================================================= */
  function initDisableOtherOnListRadio(root) {
    root = root || document;

    var FS_SEL =
      "fieldset.row.list-radio.mandatory.question-container, " +
      "fieldset.row.list-radio.mandatory.questionnaire-container";

    function disableOther(fs) {
      if (!fs) return;
      var otherRow = fs.querySelector("[id^='div'][id$='other']");
      var otherInput = fs.querySelector("input[id$='othertext'], input[name$='other']");
      if (otherInput) {
        otherInput.required = false;
        otherInput.removeAttribute("required");
        otherInput.disabled = true;
        otherInput.setAttribute("aria-disabled", "true");
        otherInput.classList.remove("em_sq_validation", "em_validation", "ls-em-required");
      }
      if (otherRow) {
        otherRow.style.display = "none";
        otherRow.classList.remove("ls-js-hidden", "ls-irrelevant");
      }
    }

    root.querySelectorAll(FS_SEL).forEach(function (fs) {
      disableOther(fs);
      if (!fs.dataset.otherWired) {
        fs.addEventListener("change", function (e) {
          if (e.target && e.target.type === "radio") disableOther(fs);
        });
        fs.dataset.otherWired = "1";
      }
    });

    setTimeout(function () { root.querySelectorAll(FS_SEL).forEach(disableOther); }, 50);
    setTimeout(function () { root.querySelectorAll(FS_SEL).forEach(disableOther); }, 200);
  }

  /* =========================================================
     7.3a — amélioration affichage option autre avec focus (jQuery)
  ========================================================= */
  function initOtherAutreFocus(root) {
    if (!$) return;
    root = root || document;

    $(root).find("input.other-checkbox").each(function () {
      var $cb = $(this);
      if ($cb.data("lsOtherWired") === 1) return;
      $cb.data("lsOtherWired", 1);

      var $li = $cb.closest("li.question-item, li.answer-item");
      var $wrap = $li.find(".other-text-item").first();
      var $txt = $wrap.find('input[type="text"], textarea').first();
      var $java = $li.find('input[type="hidden"][name^="java"][name$="other"]').first();

      if ($txt.length === 0) return;

      var otherName = $txt.attr("name") || "";

      function showOther() {
        $wrap.removeClass("ls-hidden").attr("aria-hidden", "false");
        $txt.prop("disabled", false);
      }

      function hideOther() {
        $wrap.addClass("ls-hidden").attr("aria-hidden", "true");
        $txt.prop("disabled", true);
      }

      $txt.off("keyup.lsOtherAutre focusout.lsOtherAutre")
        .on("keyup.lsOtherAutre focusout.lsOtherAutre", function () {
        var val = $.trim($txt.val());
        var hasText = val.length > 0;

        if (hasText) {
          $cb.prop("checked", true);
          showOther();
        } else {
          $cb.prop("checked", false);
        }

        if ($java.length) $java.val($txt.val());

        if (typeof LEMflagMandOther === "function") {
          LEMflagMandOther(otherName, $cb.is(":checked"));
        }
        if (typeof checkconditions === "function") {
          checkconditions(this.value, this.name, this.type);
        }
      });

      $cb.off("click.lsOtherAutre")
        .on("click.lsOtherAutre", function () {
        if ($cb.is(":checked")) {
          showOther();
          if (typeof LEMflagMandOther === "function") LEMflagMandOther(otherName, true);
          $txt.focus();
          return false;
        } else {
          $txt.val("");
          if ($java.length) $java.val("");
          hideOther();
          if (typeof checkconditions === "function") checkconditions("", otherName, "text");
          if (typeof LEMflagMandOther === "function") LEMflagMandOther(otherName, false);
          return true;
        }
      });

      var hasInitText = $.trim($txt.val()).length > 0;
      if (hasInitText || $cb.is(":checked")) {
        showOther();
        $cb.prop("checked", true);
      } else {
        hideOther();
      }
    });
  }

  /* =========================================================
     7.4 — Forcer affichage des list-with-comment mandatory
  ========================================================= */
  function initForceListWithComment(root) {
    root = root || document;
    var SEL = "fieldset.row.list-with-comment.mandatory";

    root.querySelectorAll(SEL).forEach(function (fs) {
      fs.style.display = "block";
      fs.classList.remove("ls-hidden", "ls-irrelevant");
      fs.removeAttribute("hidden");
      fs.setAttribute("aria-hidden", "false");
      fs.querySelectorAll(".ls-hidden, .ls-irrelevant").forEach(function (el) {
        el.classList.remove("ls-hidden", "ls-irrelevant");
      });
    });
  }

  /* =========================================================
     7.5 — Zone aria-live + message au clic sur Envoyer
  ========================================================= */
  function initAriaLiveSubmitMessage() {
    ensureA11yStatusRegions();

    var btn = document.getElementById("ls-button-submit");
    if (!btn) return;

    if (btn.dataset.lsLiveBound === "1") return;
    btn.dataset.lsLiveBound = "1";

    btn.addEventListener("click", function () {
      if (btn.value === "movesubmit") {
        announceA11y("Votre formulaire est en cours de traitement.", "status", { dedupeKey: "submit-processing" });
      }
    });
  }

  /* =========================================================
     7.6 — aria-live sur la modal Bootstrap de LS
  ========================================================= */
  function initBootstrapAlertModalAriaLive() {
    var MODAL_ID = "bootstrap-alert-box-modal";

    function cleanText(txt) {
      return String(txt || "").replace(/\s+/g, " ").trim();
    }

    function modalMessage(el) {
      if (!el) return "";
      var title = cleanText(el.querySelector(".modal-title") && el.querySelector(".modal-title").textContent);
      var body = cleanText(el.querySelector(".modal-body") && el.querySelector(".modal-body").textContent);
      return cleanText([title, body].filter(Boolean).join(". "));
    }

    function normalizeModal(el) {
      if (!el) return;
      // La modale garde sa sémantique dialog ; l'annonce vocale passe par la région centrale.
      el.removeAttribute("aria-live");
      el.removeAttribute("aria-atomic");
    }

    function announceIfShown(el) {
      if (!el || !el.classList.contains("show")) return;
      var message = modalMessage(el) || "Message d’alerte affiché.";
      announceA11y(message, "alert", { dedupeKey: "modal:" + message });
    }

    var el = document.getElementById(MODAL_ID);
    if (!el) return;

    normalizeModal(el);

    if (el.dataset.lsModalAriaBound === "1") {
      announceIfShown(el);
      return;
    }
    el.dataset.lsModalAriaBound = "1";

    el.addEventListener("shown.bs.modal", function () {
      normalizeModal(el);
      announceIfShown(el);
    });
    el.addEventListener("hidden.bs.modal", function () {
      clearA11yAnnouncements();
      normalizeModal(el);
    });

    var mo = new MutationObserver(function () {
      normalizeModal(el);
      announceIfShown(el);
    });
    mo.observe(el, { attributes: true, attributeFilter: ["class", "aria-live", "aria-atomic"] });
  }

  /* =========================================================
     8a) multiple-opt-comments : désactiver commentaires lignes non cochées
  ========================================================= */
  function initMultipleOptComments() {
    const UPGRADE_SELECTOR =
      "div.row.multiple-opt-comments.mandatory.question-container," +
      "div.row.multiple-opt-comments.mandatory.questionnaire-container," +
      "div.row.multiple-opt-comments.mandatory.question-containe";

    const FS_SELECTOR =
      "fieldset.row.multiple-opt-comments.mandatory.question-container," +
      "fieldset.row.multiple-opt-comments.mandatory.questionnaire-container," +
      "fieldset.row.multiple-opt-comments.mandatory.question-containe";

    const ROW_SELECTOR = "li.checkbox-text-item, li[id^='javatbd']";
    const COMMENT_SEL = 'input[type="text"][id$="comment"], textarea[id$="comment"]';

    function upgradeOnce(root = document) {
      const nodes = Array.from(root.querySelectorAll(UPGRADE_SELECTOR)).filter(
        (n) => n.tagName !== "FIELDSET" && !n.classList.contains("is-fieldset-upgraded")
      );

      nodes.forEach((div) => {
        const fs = document.createElement("fieldset");
        for (const attr of Array.from(div.attributes)) {
          fs.setAttribute(attr.name, attr.value);
        }
        fs.classList.add("is-fieldset-upgraded");
        fs.setAttribute("role", "group");
        while (div.firstChild) fs.appendChild(div.firstChild);
        div.replaceWith(fs);
      });
    }

    const rowOf = (el) => el && (el.closest(ROW_SELECTOR) || el.closest(".row"));
    const checkboxIn = (row) => (row ?row.querySelector('input[type="checkbox"]') : null);
    const commentsIn = (row) => (row ?Array.from(row.querySelectorAll(COMMENT_SEL)) : []);

    function stripRequired(el) {
      if (!el) return;
      el.required = false;
      el.removeAttribute("required");
      el.removeAttribute("aria-required");
      el.classList.remove("em_sq_validation", "em_validation", "ls-em-required");
    }

    function enableComment(ci, makeRequired) {
      if (!ci) return;
      ci.disabled = false;
      ci.removeAttribute("aria-disabled");
      if (makeRequired) {
        ci.required = true;
        ci.setAttribute("aria-required", "true");
      } else {
        stripRequired(ci);
      }
    }

    function disableComment(ci) {
      if (!ci) return;
      stripRequired(ci);
      ci.disabled = true;
      ci.setAttribute("aria-disabled", "true");
    }

    function syncFieldset(fs) {
      if (!fs) return;

      const rows = Array.from(fs.querySelectorAll(ROW_SELECTOR)).filter((r) => checkboxIn(r));
      if (!rows.length) return;

      rows.forEach((row) => {
        const cb = checkboxIn(row);
        const cms = commentsIn(row);
        if (!cb) return;

        if (cb.checked && !cb.disabled) {
          cms.forEach((ci) => enableComment(ci, true));
        } else {
          cms.forEach(disableComment);
        }
      });
    }

    function onCheckboxChange(e) {
      const t = e.target;
      if (!t || t.type !== "checkbox") return;

      const fs = t.closest(FS_SELECTOR);
      if (fs) {
        syncFieldset(fs);
        if (t.checked && !t.disabled) {
          const row = rowOf(t);
          const cms = commentsIn(row);
          if (cms && cms.length) {
            const ci = cms[0];
            if (ci && !ci.disabled) {
              try { ci.focus(); } catch (err) {}
            }
          }
        }
      }
    }

    if (!initMultipleOptComments._invalidWired) {
      initMultipleOptComments._invalidWired = true;
      document.addEventListener(
        "invalid",
        function (e) {
          const el = e.target;
          if (!el || !el.matches || !el.matches(COMMENT_SEL)) return;

          const row = rowOf(el);
          const cb = checkboxIn(row);
          if (cb && !cb.checked) {
            disableComment(el);
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true
      );
    }

    function init(root = document) {
      upgradeOnce(root);

      root.querySelectorAll(FS_SELECTOR).forEach((fs) => {
        fs.querySelectorAll(COMMENT_SEL).forEach(disableComment);
        syncFieldset(fs);
      });
    }

    function onCommentInput(e) {
      const t = e.target;
      if (!t || !t.matches || !t.matches(COMMENT_SEL)) return;
      const fs = t.closest(FS_SELECTOR);
      if (fs) syncFieldset(fs);
    }

    // Expose init callable from boot()
    initMultipleOptComments._init = init;

    // Global delegations once
    if (!initMultipleOptComments._wired) {
      initMultipleOptComments._wired = true;
      document.addEventListener("change", onCheckboxChange);
      document.addEventListener("input", onCommentInput);

      if (window.jQuery) jQuery(document).on("ajaxComplete", () => init());

      new MutationObserver((muts) => {
        for (const m of muts) {
          for (const n of m.addedNodes || []) {
            if (n && n.nodeType === 1) init(n);
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });

      let tries = 0;
      const t = setInterval(() => {
        tries++;
        init();
        if (tries >= 3) clearInterval(t);
      }, 300);
    }
  }

  /* =========================================================
     8) Validation séquentielle + touche Entrée
  ========================================================= */
  function initUploadAccessibility(root) {
    root = root || document;

    function cleanText(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function normaliseIdPart(value) {
      return String(value || "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "upload";
    }

    function ensureId(el, prefix) {
      if (!el) return "";
      if (!el.id) {
        if (!window.__LS_A11Y_UPLOAD_ID_COUNTER__) window.__LS_A11Y_UPLOAD_ID_COUNTER__ = 0;
        window.__LS_A11Y_UPLOAD_ID_COUNTER__ += 1;
        el.id = normaliseIdPart(prefix || "ls-a11y-upload") + "-" + window.__LS_A11Y_UPLOAD_ID_COUNTER__;
      }
      return el.id;
    }

    function addDescribedByToken(control, id) {
      if (!control || !id) return;
      var ids = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (ids.indexOf(id) === -1) ids.push(id);
      control.setAttribute("aria-describedby", ids.join(" "));
    }

    function questionOf(el) {
      return el && el.closest(
        "fieldset[id^='question'], div[id^='question'], .question-container, .questionnaire-container"
      );
    }

    function questionTitle(question) {
      if (!question) return "Ajouter un fichier";
      var selectors = [
        ".ls-label-question",
        ".question-title-container .ls-label-question",
        ".question-title-container",
        ".question-text",
        ".question-title",
        "legend",
        "label"
      ];

      for (var i = 0; i < selectors.length; i++) {
        var node = question.querySelector(selectors[i]);
        var text = cleanText(node && node.textContent).replace(/\*/g, "").trim();
        if (text) return text;
      }

      return "Ajouter un fichier";
    }

    function formatAcceptList(input) {
      var accept = cleanText(input.getAttribute("accept") || input.getAttribute("data-accept") || "");
      if (!accept) return "";

      return accept.split(",").map(function (item) {
        return cleanText(item);
      }).filter(Boolean).join(", ");
    }

    function findExistingHelp(question, input) {
      var nodes = Array.prototype.slice.call((question || document).querySelectorAll(
        ".questionhelp, .ls-questionhelp, .help-block, .file-upload-help, .upload-help, .text-info"
      ));

      return nodes.filter(function (node) {
        if (node === input || node.contains(input)) return false;
        return cleanText(node.textContent);
      });
    }

    function findUploadErrors(question) {
      if (!question) return [];
      return Array.prototype.slice.call(question.querySelectorAll(
        ".ls-em-error, .em-error, .error, .input-error, .question-valid-container, [role='alert']"
      )).filter(function (node) {
        var text = cleanText(node.textContent);
        if (!text) return false;
        var style = window.getComputedStyle ?window.getComputedStyle(node) : null;
        return !(style && (style.display === "none" || style.visibility === "hidden"));
      });
    }

    function ensureUploadDescription(input, question) {
      var inputId = ensureId(input, "ls-upload");
      var descId = inputId + "-description";
      var desc = document.getElementById(descId);
      var accept = formatAcceptList(input);
      var existingHelp = findExistingHelp(question, input);

      if (!desc) {
        desc = document.createElement("p");
        desc.id = descId;
        desc.className = "sr-only visually-hidden ls-a11y-upload-description";
        if (input.parentNode) input.parentNode.insertBefore(desc, input.nextSibling);
      }

      var parts = [];
      if (accept) parts.push("Formats acceptes : " + accept + ".");
      else parts.push("Formats acceptes : consultez les consignes de la question.");

      if (input.multiple || input.hasAttribute("multiple")) {
        parts.push("Plusieurs fichiers peuvent etre selectionnes.");
      }

      existingHelp.forEach(function (node) {
        addDescribedByToken(input, ensureId(node, inputId + "-help"));
      });

      desc.textContent = parts.join(" ");
      addDescribedByToken(input, desc.id);
    }

    function syncUploadErrors(input) {
      var question = questionOf(input);
      var errors = findUploadErrors(question);

      if (!errors.length) {
        input.setAttribute("aria-invalid", "false");
        return;
      }

      input.setAttribute("aria-invalid", "true");
      errors.forEach(function (error, index) {
        var errorId = ensureId(error, (input.id || "ls-upload") + "-error-" + index);
        error.setAttribute("role", error.getAttribute("role") || "alert");
        addDescribedByToken(input, errorId);

        if (typeof announceA11y === "function") {
          announceA11y(cleanText(error.textContent), "alert", { dedupeKey: "upload:" + errorId });
        }
      });
    }

    root.querySelectorAll("input[type='file']").forEach(function (input) {
      if (input.getAttribute("data-ls-a11y-upload") === "1") {
        syncUploadErrors(input);
        return;
      }

      var question = questionOf(input);
      ensureId(input, "ls-upload");

      if (!input.getAttribute("aria-label") && !input.getAttribute("aria-labelledby")) {
        input.setAttribute("aria-label", questionTitle(question));
      }

      ensureUploadDescription(input, question);
      syncUploadErrors(input);

      input.setAttribute("data-ls-a11y-upload", "1");
      input.addEventListener("change", function () { syncUploadErrors(input); });
      input.addEventListener("invalid", function () { syncUploadErrors(input); });
    });
  }

  function initSliderAccessibility(root) {
    root = root || document;

    function cleanText(value) {
      return String(value || "").replace(/\*/g, "").replace(/\s+/g, " ").trim();
    }

    function questionOf(el) {
      return el && el.closest(
        "fieldset[id^='question'], div[id^='question'], .question-container, .questionnaire-container"
      );
    }

    function questionTitle(question) {
      if (!question) return "Curseur";

      var selectors = [
        ".ls-label-question",
        ".question-title-container .ls-label-question",
        ".question-title-container",
        ".question-text",
        ".question-title",
        "legend",
        "label"
      ];

      for (var i = 0; i < selectors.length; i++) {
        var node = question.querySelector(selectors[i]);
        var text = cleanText(node && node.textContent);
        if (text) return text;
      }

      return "Curseur";
    }

    function numberFrom(value, fallback) {
      var n = parseFloat(String(value || "").replace(",", "."));
      return isNaN(n) ?fallback : n;
    }

    function sliderInputFor(handle) {
      var slider = handle.closest(".slider, .slider-container, .answer-item, .question-item");
      var question = questionOf(handle);
      var scope = slider || question || document;
      var input = scope.querySelector(
        "input[data-slider-min], input[data-slider-max], input[data-slider-step], input.slider-input, input[type='range']"
      );

      if (!input && question) {
        input = question.querySelector(
          "input[data-slider-min], input[data-slider-max], input[data-slider-step], input.slider-input, input[type='range']"
        );
      }

      return input;
    }

    function sliderBounds(input, handle) {
      var min = numberFrom(
        (input && (input.getAttribute("min") || input.getAttribute("data-slider-min"))) ||
        handle.getAttribute("aria-valuemin"),
        0
      );
      var max = numberFrom(
        (input && (input.getAttribute("max") || input.getAttribute("data-slider-max"))) ||
        handle.getAttribute("aria-valuemax"),
        100
      );
      var step = numberFrom(
        (input && (input.getAttribute("step") || input.getAttribute("data-slider-step"))) ||
        handle.getAttribute("data-slider-step"),
        1
      );

      if (!step || step < 0) step = 1;
      if (max < min) {
        var tmp = max;
        max = min;
        min = tmp;
      }

      return { min: min, max: max, step: step };
    }

    function currentSliderValue(input, handle, bounds) {
      return numberFrom(
        (input && input.value) ||
        handle.getAttribute("aria-valuenow") ||
        handle.getAttribute("data-value"),
        bounds.min
      );
    }

    function clampToStep(value, bounds) {
      var clamped = Math.max(bounds.min, Math.min(bounds.max, value));
      var steps = Math.round((clamped - bounds.min) / bounds.step);
      var stepped = bounds.min + steps * bounds.step;
      return Math.max(bounds.min, Math.min(bounds.max, Number(stepped.toFixed(6))));
    }

    function setHandleValue(handle, input, value, announce) {
      var bounds = sliderBounds(input, handle);
      var next = clampToStep(value, bounds);
      var text = String(next);

      handle.setAttribute("aria-valuenow", text);
      handle.setAttribute("aria-valuetext", text);
      handle.setAttribute("data-value", text);

      if (input) {
        input.value = text;
        input.setAttribute("value", text);

        if (window.jQuery && typeof window.jQuery(input).slider === "function") {
          try { window.jQuery(input).slider("setValue", next, true, true); } catch (err) {}
        }

        input.__LS_A11Y_SLIDER_SYNCING__ = true;
        try {
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        } finally {
          input.__LS_A11Y_SLIDER_SYNCING__ = false;
        }
      }

      if (announce && typeof announceA11y === "function") {
        announceA11y("Valeur du curseur : " + text + ".", "status", {
          dedupeKey: "slider:" + (input && (input.id || input.name) || handle.id || text)
        });
      }
    }

    function enhanceHandle(handle) {
      if (!handle || handle.getAttribute("data-ls-a11y-slider") === "1") return;

      var input = sliderInputFor(handle);
      var question = questionOf(handle);
      var bounds = sliderBounds(input, handle);
      var value = currentSliderValue(input, handle, bounds);

      handle.setAttribute("role", "slider");
      handle.setAttribute("tabindex", handle.getAttribute("tabindex") || "0");
      handle.setAttribute("aria-valuemin", String(bounds.min));
      handle.setAttribute("aria-valuemax", String(bounds.max));
      handle.setAttribute("aria-label", handle.getAttribute("aria-label") || questionTitle(question));
      handle.setAttribute("data-ls-a11y-slider", "1");
      setHandleValue(handle, input, value, false);

      handle.addEventListener("keydown", function (event) {
        var key = event.key || "";
        var currentBounds = sliderBounds(input, handle);
        var current = currentSliderValue(input, handle, currentBounds);
        var next = current;

        if (key === "ArrowRight" || key === "ArrowUp") next = current + currentBounds.step;
        else if (key === "ArrowLeft" || key === "ArrowDown") next = current - currentBounds.step;
        else if (key === "PageUp") next = current + currentBounds.step * 10;
        else if (key === "PageDown") next = current - currentBounds.step * 10;
        else if (key === "Home") next = currentBounds.min;
        else if (key === "End") next = currentBounds.max;
        else return;

        event.preventDefault();
        event.stopPropagation();
        setHandleValue(handle, input, next, true);
      });

      if (input && input.getAttribute("data-ls-a11y-slider-input-bound") !== "1") {
        input.setAttribute("data-ls-a11y-slider-input-bound", "1");
        input.addEventListener("input", function () {
          if (input.__LS_A11Y_SLIDER_SYNCING__) return;
          setHandleValue(handle, input, currentSliderValue(input, handle, sliderBounds(input, handle)), false);
        });
        input.addEventListener("change", function () {
          if (input.__LS_A11Y_SLIDER_SYNCING__) return;
          setHandleValue(handle, input, currentSliderValue(input, handle, sliderBounds(input, handle)), false);
        });
      }
    }

    root.querySelectorAll("input[type='range']").forEach(function (input) {
      if (input.getAttribute("data-ls-a11y-native-slider") === "1") return;
      var question = questionOf(input);
      var bounds = sliderBounds(input, input);
      input.setAttribute("aria-valuemin", String(bounds.min));
      input.setAttribute("aria-valuemax", String(bounds.max));
      input.setAttribute("aria-valuenow", String(currentSliderValue(input, input, bounds)));
      if (!input.getAttribute("aria-label") && !input.getAttribute("aria-labelledby")) {
        input.setAttribute("aria-label", questionTitle(question));
      }
      input.setAttribute("data-ls-a11y-native-slider", "1");
      input.addEventListener("input", function () {
        input.setAttribute("aria-valuenow", String(currentSliderValue(input, input, bounds)));
      });
    });

    root.querySelectorAll(".slider-handle, [role='slider']").forEach(enhanceHandle);
  }

  function initEquationAccessibility(root) {
    root = root || document;

    function cleanText(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function enhanceEquation(question) {
      if (!question || question.getAttribute("data-ls-a11y-equation") === "1") return;

      var output = question.querySelector(
        ".answer-item, .ls-answers, .equation, .em_equation, .question-valid-container"
      ) || question;
      var title = question.querySelector(".ls-label-question, .question-title-container, .question-text, legend");
      var titleText = cleanText(title && title.textContent);
      var outputText = cleanText(output.textContent);

      output.setAttribute("role", outputText ?"status" : "note");
      output.setAttribute("aria-live", "polite");
      output.setAttribute("aria-atomic", "true");
      output.setAttribute("data-ls-a11y-equation-output", "1");

      if (!output.getAttribute("aria-label") && titleText) {
        output.setAttribute("aria-label", "Resultat calcule - " + titleText);
      }

      question.setAttribute("data-ls-a11y-equation", "1");
    }

    root.querySelectorAll(
      ".question-container.equation, .questionnaire-container.equation, " +
      "div[id^='question'].equation, fieldset[id^='question'].equation, " +
      ".equation.question-container, .equation.questionnaire-container"
    ).forEach(enhanceEquation);
  }

  function initSequentialValidation() {
    function questionContainerOf(el) {
      return (
        el &&
        el.closest(
          "fieldset[id^='question']," +
            "div[id^='question']," +
            "fieldset.question-container," +
            "div.question-container," +
            ".row.text-short," +
            ".row.text-long," +
            "fieldset.list-radio," +
            "fieldset.radio-list," +
            "fieldset.multiple-opt," +
            "fieldset.list-dropdown," +
            ".list-dropdown"
        )
      );
    }

function questionTitle(q) {
  if (!q) return "cette question";

  var candidates = [
    ".ls-label-question",
    ".question-title-container .ls-label-question",
    ".question-title-container",
    ".question-text",
    ".question-title",
    "legend .ls-label-question",
    "legend",
    "label.ls-label-question",
    ":scope > label"
  ];

  for (var i = 0; i < candidates.length; i++) {
    var node = q.querySelector(candidates[i]);

    if (node && node.textContent && node.textContent.trim()) {
      return node.textContent
        .replace("*", "")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  return "cette question";
}

    function normaliseIdPart(value) {
      return String(value || "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "field";
    }

    function ensureControlId(control, fallbackPrefix) {
      if (!control) return "";
      if (!control.id) {
        if (!window.__LS_A11Y_ERROR_ID_COUNTER__) window.__LS_A11Y_ERROR_ID_COUNTER__ = 0;
        window.__LS_A11Y_ERROR_ID_COUNTER__ += 1;
        control.id = normaliseIdPart(fallbackPrefix || "ls-a11y-field") + "-" + window.__LS_A11Y_ERROR_ID_COUNTER__;
      }
      return control.id;
    }

    function addDescribedBy(control, id) {
      if (!control || !id) return;
      var ids = (control.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter(Boolean);
      if (ids.indexOf(id) === -1) ids.push(id);
      control.setAttribute("aria-describedby", ids.join(" "));
    }

    function removeDescribedBy(control, id) {
      if (!control || !id) return;
      var ids = (control.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter(function (token) { return token && token !== id; });
      if (ids.length) control.setAttribute("aria-describedby", ids.join(" "));
      else control.removeAttribute("aria-describedby");
    }

    function markControlInvalid(control, errorId) {
      if (!control || !errorId) return;
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("data-ls-a11y-invalid-by", errorId);
      addDescribedBy(control, errorId);
    }

    function clearControlInvalid(control, errorId) {
      if (!control) return;
      if (errorId) removeDescribedBy(control, errorId);
      if (!errorId || control.getAttribute("data-ls-a11y-invalid-by") === errorId) {
        control.removeAttribute("data-ls-a11y-invalid-by");
        control.setAttribute("aria-invalid", "false");
      }
    }

    function controlsForError(q, control) {
      if (!q || !control || !control.matches || !control.matches("input, select, textarea")) return [];

      if (control.matches('input[type="radio"]')) {
        var row = control.closest("tr");
        if (row && q.classList.contains("array-flexible-row")) {
          return Array.prototype.filter.call(row.querySelectorAll('input[type="radio"]'), function (r) {
            return !r.disabled;
          });
        }
        return Array.prototype.filter.call(q.querySelectorAll('input[type="radio"]'), function (r) {
          return !r.disabled && r.name === control.name;
        });
      }

      if (control.matches('input[type="checkbox"]')) {
        if (q.matches("fieldset.multiple-opt.mandatory, .multiple-opt.mandatory, fieldset.multiple-opt-comments.mandatory, .multiple-opt-comments.mandatory")) {
          return Array.prototype.filter.call(q.querySelectorAll('input[type="checkbox"]'), function (b) {
            return !b.disabled;
          });
        }
        return [control];
      }

      // list-dropdown LimeSurvey avec bootstrap-select : le <select> natif peut être masqué.
      // On rattache donc aussi le message d'erreur au bouton visible du composant.
      if (control.matches('select')) {
        var list = [control];
        var btn = focusTargetForControl(control);
        if (btn && btn !== control && list.indexOf(btn) === -1) list.push(btn);
        return list;
      }

      return [control];
    }

    function clearTip(q) {
      if (!q) return;
      q.querySelectorAll(":scope > .ls-tip-right").forEach(function (n) {
        var errorId = n.id || n.getAttribute("data-ls-a11y-error-id") || "";
        if (errorId) {
          q.querySelectorAll("input, select, textarea, .bootstrap-select > button.dropdown-toggle").forEach(function (control) {
            removeDescribedBy(control, errorId);
            if (control.getAttribute("data-ls-a11y-invalid-by") === errorId) {
              control.removeAttribute("data-ls-a11y-invalid-by");
              control.setAttribute("aria-invalid", "false");
            }
          });
        }
        n.parentNode.removeChild(n);
      });
      q.classList.remove("ls-tip-error", "ls-tip-anchor");
    }

    function clearAllTips(root) {
      root = root || document;
      root.querySelectorAll(".ls-tip-right").forEach(function (n) {
        var q = questionContainerOf(n) || n.parentNode;
        if (q) clearTip(q);
        else if (n.parentNode) n.parentNode.removeChild(n);
      });
      root.querySelectorAll(".ls-tip-anchor.ls-tip-error").forEach(function (q) {
        q.classList.remove("ls-tip-error", "ls-tip-anchor");
      });
    }

    function showRightTip(targetOrQ, msg) {
      var q = questionContainerOf(targetOrQ) || targetOrQ;
      if (!q) return;

      var control = targetOrQ && targetOrQ.matches && targetOrQ.matches("input, select, textarea")
        ?targetOrQ
        : q.querySelector("input, select, textarea");

      clearTip(q);
      q.classList.add("ls-tip-anchor", "ls-tip-error");

      var controlId = ensureControlId(control, (q.id || "ls-a11y-field"));
      var errorId = normaliseIdPart(controlId || q.id || "ls-a11y-error") + "-error";
      var existing = document.getElementById(errorId);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

      var tip = document.createElement("div");
      tip.id = errorId;
      tip.className = "ls-tip-right";
      tip.setAttribute("role", "note");
      tip.setAttribute("data-ls-a11y-status-severity", "alert");
      tip.setAttribute("data-ls-a11y-error-id", errorId);
      tip.textContent = msg;

      controlsForError(q, control).forEach(function (item) {
        markControlInvalid(item, errorId);
      });

      var legend = q.querySelector(":scope > legend");
      if (legend) legend.insertAdjacentElement("afterend", tip);
      else q.insertAdjacentElement("afterbegin", tip);

      announceA11y(msg, "alert", { dedupeKey: errorId + ":" + msg });
    }

    function questionNodes(root) {
      root = root || document;
      var sel =
        "fieldset[id^='question']," +
        "div[id^='question']," +
        "fieldset.question-container," +
        "div.question-container," +
        ".row.text-short," +
        ".row.text-long," +
        "fieldset.list-radio," +
        "fieldset.radio-list," +
        "fieldset.multiple-opt," +
        "fieldset.list-dropdown," +
        ".list-dropdown";
      var seen = new WeakSet();
      return Array.prototype.filter.call(root.querySelectorAll(sel), function (q) {
        if (seen.has(q)) return false;
        seen.add(q);
        if (!isVisible(q)) return false;
        if (q.classList.contains("mandatory")) return true;
        if (q.querySelector("[required]")) return true;
        return false;
      });
    }

    function isMandatoryCheckboxQuestion(q) {
      if (!q || !q.classList || !q.classList.contains("mandatory")) return false;
      if (q.matches && q.matches(
        "fieldset.multiple-opt.mandatory, .multiple-opt.mandatory, " +
        "fieldset.checkbox-list.mandatory, .checkbox-list.mandatory, " +
        "fieldset.multiple-choice.mandatory, .multiple-choice.mandatory"
      )) return true;

      // Sécurité : certaines versions / variantes LimeSurvey rendent les choix
      // sous forme .checkbox-list ou simple question-container mandatory.
      // S'il y a au moins deux cases visibles, on applique la règle mandatory.
      var visibleBoxes = Array.prototype.filter.call(q.querySelectorAll('input[type="checkbox"][name]'), function (b) {
        return isChoiceVisibleForValidation(b);
      });
      return visibleBoxes.length > 1;
    }

    function checkboxChoicesInQuestion(q) {
      return Array.prototype.filter.call(q.querySelectorAll('input[type="checkbox"][name]'), function (b) {
        if (!isChoiceVisibleForValidation(b)) return false;
        // Le champ d'acceptation de la politique est géré par son bloc dédié.
        if ((b.name || "") === "datasecurity_accepted" || (b.id || "") === "datasecurity_accepted") return false;
        return true;
      });
    }

    function isEmptyListDropdownSelect(select) {
      if (!select || select.disabled) return false;

      var value = String(select.value || "").trim();
      var selectedOption = select.options && select.selectedIndex >= 0 ?select.options[select.selectedIndex] : null;
      var optionValue = selectedOption ?String(selectedOption.value || "").trim() : value;
      var optionText = selectedOption && selectedOption.textContent ?selectedOption.textContent.replace(/\s+/g, " ").trim() : "";
      var optionContent = selectedOption && selectedOption.getAttribute ?String(selectedOption.getAttribute("data-content") || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";

      var wrap = getBootstrapSelectWrapper(select);
      var btn = wrap ?wrap.querySelector("button.dropdown-toggle") : null;
      var btnTitle = btn ?String(btn.getAttribute("title") || "").replace(/\s+/g, " ").trim() : "";
      var btnText = btn ?String(btn.textContent || "").replace(/\s+/g, " ").trim() : "";
      var btnIsPlaceholder = !!(btn && btn.classList && btn.classList.contains("bs-placeholder"));

      var placeholderRe = /^(veuillez\s+choisir|choisir|sélectionner|selectionner|choisissez|sélectionnez|selectionnez|choose|select|please\s+choose)\b/i;

      /*
       * V250 TER6 — reprise de la logique V101 + correction Bootstrap Select.
       * Dans LimeSurvey, une question list-dropdown obligatoire peut être rendue
       * par bootstrap-select : le <select> d'origine n'est plus le contrôle visible.
       * Le vrai signal visuel d'une non-réponse est alors souvent le bouton généré
       * avec la classe .bs-placeholder et le libellé « Veuillez choisir ... ».
       *
       * Important : on ne doit PAS retourner rempli simplement parce que select.value
       * ou javaXXXX contient une ancienne valeur. Si le bouton visible ou l'option
       * sélectionnée affichent encore un placeholder, la question reste vide.
       */

      if (btnIsPlaceholder) return true;
      if (placeholderRe.test(btnTitle) || placeholderRe.test(btnText)) return true;
      if (placeholderRe.test(optionText) || placeholderRe.test(optionContent)) return true;

      // Option vide classique LimeSurvey : <option value="" selected>Veuillez choisir ...</option>
      if (!value || !optionValue) return true;

      // Cas rares de valeurs techniques utilisées pour les placeholders.
      if (/^(0|-1|null|undefined)$/i.test(value) && (placeholderRe.test(optionText) || placeholderRe.test(btnText))) return true;

      return false;
    }

    function firstMandatoryListDropdownError(root) {
      root = root || document;
      var candidates = Array.prototype.slice.call(root.querySelectorAll(
        "fieldset[id^='question'].list-dropdown.mandatory," +
        "div[id^='question'].list-dropdown.mandatory," +
        "fieldset.question-container.list-dropdown.mandatory," +
        "div.question-container.list-dropdown.mandatory," +
        "fieldset.list-dropdown.mandatory," +
        "div.list-dropdown.mandatory"
      ));

      // Fallback : si root est déjà la question elle-même.
      if (root.matches && root.matches("fieldset.list-dropdown.mandatory, div.list-dropdown.mandatory, .question-container.list-dropdown.mandatory")) {
        candidates.unshift(root);
      }

      var seen = new WeakSet();
      for (var i = 0; i < candidates.length; i++) {
        var q = candidates[i];
        if (!q || seen.has(q)) continue;
        seen.add(q);
        if (!isVisible(q)) continue;

        var selects = Array.prototype.slice.call(q.querySelectorAll("select.list-question-select, select.form-control, select"));
        for (var j = 0; j < selects.length; j++) {
          var select = selects[j];
          if (!select || select.disabled) continue;

          // Sur bootstrap-select, le select peut être masqué : on valide la question si la question visible contient le select.
          if (isEmptyListDropdownSelect(select)) {
            return { el: select, msg: "Veuillez compléter ce champ : " + questionTitle(q) };
          }
        }
      }
      return null;
    }

    function firstErrorInQuestion(q) {
      if (!isVisible(q)) return null;
      var title = questionTitle(q);

      // array-flexible-row : 1 réponse par ligne obligatoire
      if (q.classList.contains("array-flexible-row")) {
        var table = q.querySelector(".ls-table-wrapper table");
        if (table) {
          var rows = table.querySelectorAll("tbody tr");
          for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            var radios = row.querySelectorAll('input[type="radio"][name]');
            if (!radios.length) continue;

            var anyChecked = Array.prototype.some.call(radios, function (ra) {
              return ra.checked && !ra.disabled;
            });

            if (!anyChecked) {
              var th = row.querySelector("th.answertext, th");
              var labelPart = "";
              if (th && th.textContent) labelPart = th.textContent.replace(/\s+/g, " ").trim();
              if (!labelPart) labelPart = title;

              return { el: radios[0], msg: "Veuillez sélectionner une réponse pour la sous-question « " + labelPart + " »." };
            }
          }
        }
      }

      // multiple-opt / checkbox-list mandatory
      if (isMandatoryCheckboxQuestion(q)) {
        var boxes = checkboxChoicesInQuestion(q);
        if (boxes.length && !boxes.some(function (b) { return b.checked; })) {
          return { el: boxes[0], msg: "Veuillez cocher au moins une option : " + title };
        }
      }

      // multiple-opt-comments mandatory
      if (q.matches("fieldset.multiple-opt-comments.mandatory, .multiple-opt-comments.mandatory")) {
        var boxes2 = Array.prototype.filter.call(q.querySelectorAll('input[type="checkbox"]'), function (b) {
          return isChoiceVisibleForValidation(b);
        });
        if (boxes2.length && !boxes2.some(function (b) { return b.checked; })) {
          return { el: boxes2[0], msg: "Veuillez cocher au moins une option : " + title };
        }
      }

      // radio groups
      var radiosAll = Array.prototype.filter.call(q.querySelectorAll('input[type="radio"][name]'), function (r) {
        return isChoiceVisibleForValidation(r);
      });
      if (radiosAll.length) {
        var groups = {};
        radiosAll.forEach(function (r) {
          if (!groups[r.name]) groups[r.name] = [];
          groups[r.name].push(r);
        });

        var names = Object.keys(groups);
        for (var i = 0; i < names.length; i++) {
          var arr = groups[names[i]];
          var any = arr.some(function (r) { return r.checked; });

          var isMandatoryGroup = q.classList.contains("mandatory") || !!q.closest(".mandatory");

          if (isMandatoryGroup && !any) {
            return { el: arr[0], msg: "Veuillez sélectionner une option : " + title };
          }
        }
      }

      // date triplets
      var day = q.querySelector("select.day");
      var month = q.querySelector("select.month");
      var year = q.querySelector("select.year");
      var isDateQuestion = day || month || year;
      var isMandatoryDate = isDateQuestion && (q.classList.contains("mandatory") || !!q.closest(".mandatory"));

      if (isMandatoryDate) {
        var firstEmpty = null;
        if (day && isVisible(day) && !day.disabled && !day.value) firstEmpty = day;
        else if (month && isVisible(month) && !month.disabled && !month.value) firstEmpty = month;
        else if (year && isVisible(year) && !year.disabled && !year.value) firstEmpty = year;

        if (firstEmpty) {
          var partLabel = "la date";
          if (firstEmpty === day) partLabel = "le jour";
          if (firstEmpty === month) partLabel = "le mois";
          if (firstEmpty === year) partLabel = "l’année";
          return { el: firstEmpty, msg: "Veuillez renseigner " + partLabel + " pour : " + title };
        }
      }

      // list-dropdown mandatory : contrôle explicite avant les champs génériques.
      // Indispensable quand bootstrap-select masque le <select> natif et affiche un bouton .dropdown-toggle.
      var listDropdownError = firstMandatoryListDropdownError(q);
      if (listDropdownError) return listDropdownError;

      // required fields
      var fields = q.querySelectorAll(
        "input[required]:not([type='checkbox']):not([type='radio'])," +
          "select[required]," +
          "textarea[required]"
      );
      for (var j = 0; j < fields.length; j++) {
        var el = fields[j];
        if (!isControlVisibleForValidation(el)) continue;
        var tag = el.tagName;
        var val = tag === "SELECT" ?el.value : (el.value || "").trim();

        if (!val || (el.checkValidity && !el.checkValidity())) {
          var msg;

          var isCommentField =
            /comment$/.test(el.id || "") && (el.matches('input[type="text"]') || el.matches("textarea"));

          if (isCommentField) {
            var lineLabel = null;
            var labId = el.getAttribute("aria-labelledby");
            if (labId) {
              var labNode = document.getElementById(labId);
              if (labNode && labNode.textContent.trim()) lineLabel = labNode.textContent.replace(/\s+/g, " ").trim();
            }
            if (!lineLabel) {
              var liNode = el.closest("li");
              if (liNode) {
                var lab2 = liNode.querySelector("label");
                if (lab2 && lab2.textContent.trim()) lineLabel = lab2.textContent.replace(/\s+/g, " ").trim();
              }
            }
            if (lineLabel) msg = "Veuillez renseigner le commentaire pour la ligne « " + lineLabel + " ».";
          }

          if (!msg) {
            var name = title;
            var id = el.id;
            if (id) {
              var lb = q.querySelector('label[for="' + id.replace(/"/g, "") + '"]');
              if (lb && lb.textContent.trim()) name = lb.textContent.replace("*", "").trim();
            }
            msg = "Veuillez compléter ce champ : " + name;

            if (el.validity) {
              if (el.validity.typeMismatch) msg = "Le format de " + name + " est invalide";
              else if (el.validity.tooShort) msg = name + " est trop court (minimum " + el.minLength + " caractères)";
              else if (el.validity.tooLong) msg = name + " est trop long (maximum " + el.maxLength + " caractères)";
              else if (el.validity.patternMismatch) msg = name + " ne correspond pas au format attendu";
            }
          }

          return { el: el, msg: msg };
        }
      }

      return null;
    }

    function currentGroupRoot() {
      var groups = Array.prototype.slice.call(document.querySelectorAll(".group-outer-container[id^='group-']"));
      var vis = groups.find(function (g) { return isVisible(g); });
      if (vis) {
        var inner = vis.querySelector("fieldset.group-container, .group-container, .ls-group-container");
        return inner || vis;
      }
      return (
        document.querySelector("#group-container") ||
        document.querySelector(".ls-group-container") ||
        document.querySelector("fieldset.group-container") ||
        document
      );
    }

    function validateOneQuestionIn(form) {
      clearAllTips(form || document);

      // V250 TER4/TER5 : revenir à une validation centrée sur le groupe courant,
      // comme dans la V225 qui fonctionnait bien. Scanner tout le formulaire peut
      // mélanger des groupes PJAX/anciens fragments ou ignorer certains wrappers
      // LimeSurvey. Le groupe visible garde l'ordre réel des questions affichées.
      var root = currentGroupRoot();
      var qs = questionNodes(root);

      // Fallback uniquement si aucun groupe/questions visible n'a été trouvé.
      if (!qs.length && form) {
        root = form;
        qs = questionNodes(root);
      }
      if (!qs.length) {
        root = document;
        qs = questionNodes(root);
      }

      for (var i = 0; i < qs.length; i++) {
        var q = qs[i];
        var err = firstErrorInQuestion(q);
        if (err) {
          showRightTip(err.el || q, err.msg);
          var focusTarget = focusTargetForControl(err.el) || err.el || q;
          try { focusTarget.focus({ preventScroll: true }); } catch (e) {}
          try { (err.el || q).scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e2) {}
          return false;
        }
      }

      // Filet de sécurité : si un list-dropdown mandatory n'a pas été inclus dans
      // questionNodes à cause d'une structure Bootstrap/LimeSurvey atypique, on le
      // contrôle ici, mais seulement après avoir parcouru les questions détectées.
      // On ne casse donc pas l'ordre normal de validation des questions précédentes.
      var missedListDropdown = firstMandatoryListDropdownError(root);
      if (!missedListDropdown && form && root !== form) {
        missedListDropdown = firstMandatoryListDropdownError(form);
      }
      if (missedListDropdown) {
        showRightTip(missedListDropdown.el || root, missedListDropdown.msg);
        var missedFocus = focusTargetForControl(missedListDropdown.el) || missedListDropdown.el || root;
        try { missedFocus.focus({ preventScroll: true }); } catch (e3) {}
        try { (missedListDropdown.el || root).scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e4) {}
        return false;
      }

      return true;
    }

    function setupLiveTipCleanup() {
      if (window.__LS_LIVE_TIP_CLEANUP__) return;
      window.__LS_LIVE_TIP_CLEANUP__ = true;

      function handleUserEdit(e) {
        var t = e.target;
        if (!t || !t.matches("input, select, textarea")) return;
        var q = questionContainerOf(t);
        if (!q) return;

        // On ne supprime le message lié au champ que lorsque la question est réellement corrigée.
        // Sinon aria-describedby continuerait de pointer vers l'explication utile.
        if (!firstErrorInQuestion(q)) {
          clearTip(q);
        }
      }

      document.addEventListener("input", handleUserEdit, true);
      document.addEventListener("change", handleUserEdit, true);
    }

    function wireNextButtons() {
      // novalidate (bulle native) : à réappliquer sur les formulaires remplacés par PJAX.
      document.querySelectorAll("form").forEach(function (f) {
        f.setAttribute("novalidate", "novalidate");
      });

      if (window.__LS_SEQ_NEXT_BUTTONS_WIRED__) return;
      window.__LS_SEQ_NEXT_BUTTONS_WIRED__ = true;

      // Garde haute priorité : certains scripts LimeSurvey/PJAX peuvent intercepter le clic
      // avant le submit natif. En capture sur window, on bloque la navigation avant tout
      // si une question obligatoire list-dropdown/checkbox/radio/texte est vide.
      window.addEventListener(
        "click",
        function (e) {
          var btn = e.target && e.target.closest && e.target.closest("button, input[type='submit']");
          if (!btn) return;
          var isNav = btn.matches(
            'button[name="move"][value="movenext"],' +
              'input[type="submit"][name="move"][value="movenext"],' +
              'button[name="move"][value="movesubmit"],' +
              'input[type="submit"][name="move"][value="movesubmit"],' +
              "#ls-button-submit"
          );
          if (!isNav) return;
          var form = btn.form || btn.closest("form") || document.querySelector("form");
          if (!form) return;
          if (!validateOneQuestionIn(form)) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }
        },
        true
      );

      window.addEventListener(
        "submit",
        function (e) {
          var form = e.target;
          if (!form || !form.matches || !form.matches("form")) return;
          if (!validateOneQuestionIn(form)) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }
        },
        true
      );

      document.addEventListener(
        "invalid",
        function (e) { e.preventDefault(); },
        true
      );

      // Click Next / Submit
      document.addEventListener(
        "click",
        function (e) {
          var btn = e.target && e.target.closest("button, input[type='submit']");
          if (!btn) return;

          var isNav = btn.matches(
            'button[name="move"][value="movenext"],' +
              'input[type="submit"][name="move"][value="movenext"],' +
              'button[name="move"][value="movesubmit"],' +
              'input[type="submit"][name="move"][value="movesubmit"],' +
              "#ls-button-submit"
          );
          if (!isNav) return;

          var form = btn.form || document.querySelector("form");
          if (!form) return;

          if (!validateOneQuestionIn(form)) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true
      );

      // Soumission réelle du formulaire : sécurité indispensable car certains
      // boutons LimeSurvey ou scripts PJAX déclenchent submit sans passer par
      // le clic intercepté ci-dessus.
      document.addEventListener(
        "submit",
        function (e) {
          var form = e.target;
          if (!form || !form.matches || !form.matches("form")) return;

          if (!validateOneQuestionIn(form)) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true
      );

      // Enter key
      document.addEventListener(
        "keydown",
        function (e) {
          if (e.key !== "Enter" || e.defaultPrevented) return;

          var t = e.target;
          if (!t) return;

          if (
            t.closest("textarea, [contenteditable], .note-editable") ||
            t.isContentEditable ||
            e.ctrlKey ||
            e.altKey ||
            e.metaKey
          ) {
            return;
          }

          if (t.closest("button, input[type='submit'], [role='button']")) return;

          var form = t.closest("form");
          if (!form) return;

          var btn =
            form.querySelector("#ls-button-submit") ||
            form.querySelector('button[name="move"][value="movenext"]') ||
            form.querySelector('input[type="submit"][name="move"][value="movenext"]') ||
            form.querySelector('button[name="move"][value="movesubmit"]') ||
            form.querySelector('input[type="submit"][name="move"][value="movesubmit"]');

          if (!btn) return;

          e.preventDefault();

          if (!validateOneQuestionIn(form)) return;

          btn.click();
        },
        true
      );
    }

    function boot() {
      setupLiveTipCleanup();
      wireNextButtons();
    }

    // Anti multi-boot (pjax:success rappelle)
    if (!window.__LS_SEQ_VALID_BOOT__) {
      window.__LS_SEQ_VALID_BOOT__ = true;
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
      else boot();
      document.addEventListener("pjax:success", boot);
    }
  }

  /* =========================================================
     Focus styles sur choix (radio/checkbox/array)
  ========================================================= */
  function initChoiceFocusStyles(root) {
    root = root || document;

    root.querySelectorAll(
      ".radio-list input[type='radio']," +
        ".checkbox-list input[type='checkbox']," +
        ".array-flexible-row .ls-table-wrapper input[type='radio']," +
        ".array-flexible-row .ls-table-wrapper input[type='checkbox']," +
        ".array-flexible-row .ls-table-wrapper select," +
        ".array-flexible-row .ls-table-wrapper textarea"
    ).forEach(function (input) {
      if (input.dataset.lsFocusWired === "1") return;
      input.dataset.lsFocusWired = "1";

      input.addEventListener("focus", function () {
        var question = input.closest(".question-container, fieldset.question-container") || document;
        question.querySelectorAll(".ls-radio-focus").forEach(function (el) {
          el.classList.remove("ls-radio-focus");
        });

        var container =
          input.closest("li.answer-item") ||
          input.closest("li") ||
          input.closest("td.answer-item") ||
          input.closest("tr.answers-list");

        if (container) container.classList.add("ls-radio-focus");
      });

      input.addEventListener("blur", function () {
        var container =
          input.closest("li.answer-item") ||
          input.closest("li") ||
          input.closest("td.answer-item") ||
          input.closest("tr.answers-list");

        if (container) container.classList.remove("ls-radio-focus");
      });
    });
  }
/* =========================================================
   8b) Neutraliser bootstrap-select seulement si PAS de live-search
========================================================= */
function forceNativeSelectAccessibility(root) {
  if (!$) return;
  root = root || document;

  function hasLiveSearch(select) {
    var $select = $(select);
    return (
      $select.attr("data-live-search") === "true" ||
      $select.data("live-search") === true
    );
  }

  function restoreNativeSelect(select) {
    var $select = $(select);
    if (!$select.length) return;

    try {
      if (
        $select.data("selectpicker") ||
        $select.next(".bootstrap-select").length ||
        $select.parent().hasClass("bootstrap-select")
      ) {
        $select.selectpicker("destroy");
      }
    } catch (e) {}

    $select
      .removeClass("bs-select-hidden selectpicker")
      .removeAttr("data-style data-width data-none-selected-text")
      .css({
        display: "block",
        visibility: "visible",
        position: "static",
        left: "auto",
        top: "auto",
        width: "auto",
        opacity: "1"
      })
      .prop("disabled", false)
      .attr("tabindex", "0")
      .attr("data-native-select-restored", "1");
  }

  function keepBootstrapSelect(select) {
    var $select = $(select);
    if (!$select.length) return;

    // évite de retraiter plusieurs fois le même select
    if ($select.attr("data-ls-bs-initialized") === "1") {
      try {
        if ($select.data("selectpicker")) {
          $select.selectpicker("refresh");
        }
      } catch (e) {}
      return;
    }

    try {
      if (!$select.data("selectpicker") && !$select.parent().hasClass("bootstrap-select")) {
        $select.selectpicker();
      } else {
        $select.selectpicker("refresh");
      }
    } catch (e) {}

    var $wrap = $select.parent(".bootstrap-select");
    if (!$wrap.length) $wrap = $select.next(".bootstrap-select");

    if ($wrap.length) {
      var requestedWidth = String($select.attr("data-width") || "").toLowerCase();
      var keepAutoWidth = requestedWidth === "auto";

      $wrap.toggleClass("ls-a11y-bs-width-auto", keepAutoWidth);
      $wrap.css({
        width: keepAutoWidth ?"fit-content" : "100%",
        minWidth: keepAutoWidth ?"min(12rem, 100%)" : "",
        maxWidth: "100%",
        overflow: "visible"
      });

      $wrap.find("> .dropdown-toggle").css({
        width: "100%",
        minWidth: keepAutoWidth ?"min(12rem, 100%)" : "",
        maxWidth: "100%"
      });

      $wrap.find(".dropdown-menu").css({
        "z-index": "1060",
        overflow: "visible"
      });

      $wrap.find(".inner").css({
        "max-height": "260px",
        overflowY: "auto",
        overflowX: "hidden"
      });
    }

    $select.attr("data-native-select-restored", "0");
    $select.attr("data-ls-bs-initialized", "1");
  }

  function processOne(select) {
    if (hasLiveSearch(select)) keepBootstrapSelect(select);
    else restoreNativeSelect(select);
  }

  $(root).find("select.list-question-select").each(function () {
    processOne(this);
  });
}


/* =========================================================
   8c) Sémantique des tableaux / matrices de questions
   RGAA 5 — caption, en-têtes, scope, headers, ordre de lecture
========================================================= */
function enhanceArrayTableSemantics(root) {
  root = root || document;

  function cleanText(node) {
    if (!node) return "";
    return (node.textContent || "")
      .replace(/\*/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normaliseIdPart(value) {
    return String(value || "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "cell";
  }

  function ensureElementId(el, prefix) {
    if (!el) return "";
    if (!el.id) {
      if (!window.__LS_A11Y_TABLE_ID_COUNTER__) window.__LS_A11Y_TABLE_ID_COUNTER__ = 0;
      window.__LS_A11Y_TABLE_ID_COUNTER__ += 1;
      el.id = normaliseIdPart(prefix || "ls-a11y-table-cell") + "-" + window.__LS_A11Y_TABLE_ID_COUNTER__;
    }
    return el.id;
  }

  function addTokenAttribute(el, attr, tokens) {
    if (!el || !tokens || !tokens.length) return;
    var current = (el.getAttribute(attr) || "")
      .split(/\s+/)
      .filter(Boolean);

    tokens.forEach(function (token) {
      if (token && current.indexOf(token) === -1) current.push(token);
    });

    if (current.length) el.setAttribute(attr, current.join(" "));
  }

  function setArrayDescribedByTokens(control, headerTokens) {
    if (!control || !headerTokens || !headerTokens.length) return;

    var current = (control.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter(function (id) {
        var node = document.getElementById(id);
        return !(node && node.getAttribute("data-ls-a11y-array-header"));
      });

    headerTokens.forEach(function (id) {
      if (id && current.indexOf(id) === -1) current.push(id);
    });

    control.setAttribute("aria-describedby", current.join(" "));
  }

  function replaceCellTag(cell, tagName) {
    if (!cell || cell.tagName.toLowerCase() === tagName.toLowerCase()) return cell;

    var newCell = document.createElement(tagName);
    Array.prototype.slice.call(cell.attributes).forEach(function (attr) {
      newCell.setAttribute(attr.name, attr.value);
    });

    while (cell.firstChild) newCell.appendChild(cell.firstChild);
    cell.parentNode.replaceChild(newCell, cell);
    return newCell;
  }

  function tableCells(row) {
    return Array.prototype.filter.call(row ?row.children : [], function (child) {
      return child && /^(TD|TH)$/i.test(child.tagName || "");
    });
  }

  function parseSpan(cell, attr) {
    var value = parseInt(cell && cell.getAttribute(attr) || "1", 10);
    return (!isNaN(value) && value > 0) ?value : 1;
  }

  function buildTableGrid(table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll("tr"));
    var grid = [];
    var placements = [];

    rows.forEach(function (row, rowIndex) {
      if (!grid[rowIndex]) grid[rowIndex] = [];

      var colIndex = 0;
      tableCells(row).forEach(function (cell) {
        while (grid[rowIndex][colIndex]) colIndex += 1;

        var colspan = parseSpan(cell, "colspan");
        var rowspan = parseSpan(cell, "rowspan");

        placements.push({
          cell: cell,
          row: row,
          rowIndex: rowIndex,
          colIndex: colIndex,
          colspan: colspan,
          rowspan: rowspan
        });

        for (var r = 0; r < rowspan; r++) {
          if (!grid[rowIndex + r]) grid[rowIndex + r] = [];
          for (var c = 0; c < colspan; c++) {
            grid[rowIndex + r][colIndex + c] = cell;
          }
        }

        colIndex += colspan;
      });
    });

    return {
      rows: rows,
      grid: grid,
      placements: placements
    };
  }

  function getCellPlacement(gridInfo, cell) {
    if (!gridInfo || !cell) return null;

    for (var i = 0; i < gridInfo.placements.length; i++) {
      if (gridInfo.placements[i].cell === cell) return gridInfo.placements[i];
    }

    return null;
  }

  function getQuestionContainer(table) {
    return table.closest(
      ".question-container," +
      "fieldset.question-container," +
      "fieldset[id^='question']," +
      "div[id^='question']"
    );
  }

  function getQuestionTitle(question) {
    if (!question) return "Question";

    var candidates = [
      ".ls-label-question",
      ".question-title-container .ls-label-question",
      ".question-title-container",
      ".question-text",
      ".question-title",
      "legend .ls-label-question",
      "legend",
      "label.ls-label-question"
    ];

    for (var i = 0; i < candidates.length; i++) {
      var node = question.querySelector(candidates[i]);
      var txt = cleanText(node);
      if (txt) return txt;
    }

    return "Question";
  }

  function ensureCaption(table, question) {
    var directCaptions = Array.prototype.filter.call(table.children, function (child) {
      return child && child.tagName && child.tagName.toLowerCase() === "caption";
    });
    var caption = directCaptions[0] || null;

    if (!caption) {
      caption = document.createElement("caption");
      caption.className = "sr-only visually-hidden ls-a11y-array-caption";
      table.insertBefore(caption, table.firstChild);
    }

    if (!cleanText(caption)) {
      caption.textContent = "Tableau de réponses — " + getQuestionTitle(question);
    }
  }

  function collectHeadingRows(table) {
    var rows = [];
    if (table.tHead) {
      rows = rows.concat(Array.prototype.slice.call(table.tHead.rows || []));
    }

    Array.prototype.slice.call(table.querySelectorAll("tr.ls-heading, tr.ls-heading-repeat")).forEach(function (row) {
      if (rows.indexOf(row) === -1) rows.push(row);
    });

    return rows;
  }

  function mapColumnHeaders(table, tableId) {
    var colHeadersByIndex = {};
    var headingRows = collectHeadingRows(table);
    var gridInfo = buildTableGrid(table);

    gridInfo.placements.forEach(function (placement) {
      var rowIndex = headingRows.indexOf(placement.row);
      if (rowIndex === -1) return;

      var cell = placement.cell;
      var text = cleanText(cell);
      var isCorner = !text && placement.colIndex === 0 && rowIndex === 0;

      cell = replaceCellTag(cell, "th");
      ensureElementId(cell, tableId + "-col-" + rowIndex + "-" + placement.colIndex);

      if (text) {
        cell.setAttribute("scope", placement.colspan > 1 ?"colgroup" : "col");
        cell.setAttribute("data-ls-a11y-array-header", "col");
        cell.removeAttribute("tabindex");
      } else if (isCorner) {
        cell.setAttribute("aria-hidden", "true");
        cell.removeAttribute("tabindex");
      }

      for (var i = 0; i < placement.colspan; i++) {
        if (text) {
          var lookupIndex = placement.colIndex + i;
          if (!colHeadersByIndex[lookupIndex]) colHeadersByIndex[lookupIndex] = [];
          if (colHeadersByIndex[lookupIndex].indexOf(cell.id) === -1) {
            colHeadersByIndex[lookupIndex].push(cell.id);
          }
        }
      }
    });

    return {
      headers: colHeadersByIndex
    };
  }

  function firstRowHeaderCell(row) {
    if (!row) return null;

    var directAnswerText = row.querySelector(":scope > th.answertext, :scope > td.answertext");
    if (directAnswerText) return directAnswerText;

    var directTh = row.querySelector(":scope > th");
    if (directTh && cleanText(directTh)) return directTh;

    var cells = tableCells(row);
    if (cells.length && cleanText(cells[0]) && !cells[0].querySelector("input, select, textarea, button")) {
      return cells[0];
    }

    return null;
  }

  function hasFocusableContent(cell) {
    return !!(cell && cell.querySelector(
      "a[href], button, input, select, textarea, summary," +
      "[role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='slider']"
    ));
  }

  function removeMatrixCellTabStops(table) {
    if (!table) return;

    Array.prototype.slice.call(table.querySelectorAll(
      "th[data-ls-a11y-array-header]," +
      "td[data-ls-a11y-array-cell]," +
      "th[data-ls-a11y-array-cell]"
    )).forEach(function (cell) {
      if (cell.tagName && cell.tagName.toLowerCase() === "th") {
        cell.removeAttribute("tabindex");
        cell.setAttribute("data-ls-a11y-tabstop-cleaned", "1");
        return;
      }

      if (hasFocusableContent(cell)) return;

      cell.removeAttribute("tabindex");
      cell.setAttribute("data-ls-a11y-tabstop-cleaned", "1");
    });
  }

  function enhanceBodyRows(table, tableId, columnHeaderMap) {
    var colHeadersByIndex = columnHeaderMap && columnHeaderMap.headers ?columnHeaderMap.headers : {};
    var bodies = table.tBodies && table.tBodies.length
      ?Array.prototype.slice.call(table.tBodies)
      : [table];

    var rowNumber = 0;
    var bodyRows = [];

    bodies.forEach(function (tbody) {
      Array.prototype.slice.call(tbody.rows || tbody.querySelectorAll("tr")).forEach(function (row) {
        if (row.classList.contains("ls-heading") || row.classList.contains("ls-heading-repeat")) return;

        var cells = tableCells(row);
        if (!cells.length) return;

        var rowHeader = firstRowHeaderCell(row);
        var rowHeaderId = "";

        if (rowHeader) {
          rowHeader = replaceCellTag(rowHeader, "th");
          rowHeader.setAttribute("scope", parseSpan(rowHeader, "rowspan") > 1 ?"rowgroup" : "row");
          rowHeader.setAttribute("data-ls-a11y-array-header", "row");
          rowHeader.removeAttribute("tabindex");
          rowHeaderId = ensureElementId(rowHeader, tableId + "-row-" + rowNumber);
        }

        var colIndex = 0;
        tableCells(row).forEach(function (cell) {
          var colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
          if (!colspan || colspan < 1) colspan = 1;

          var isRowHeader = rowHeader && cell === rowHeader;
          var headerTokens = [];

          if (rowHeaderId && !isRowHeader) headerTokens.push(rowHeaderId);

          for (var i = 0; i < colspan; i++) {
            var lookupIndex = colIndex + i;

            var ids = colHeadersByIndex[lookupIndex] || [];
            ids.forEach(function (id) {
              if (headerTokens.indexOf(id) === -1) headerTokens.push(id);
            });
          }

          if (!isRowHeader && headerTokens.length) {
            var colLabelTokens = [];

            for (var j = 0; j < headerTokens.length; j++) {
              if (headerTokens[j] !== rowHeaderId) colLabelTokens.push(headerTokens[j]);
            }

            cell.setAttribute("headers", headerTokens.join(" "));
            cell.setAttribute("data-ls-a11y-array-cell", "1");

            var colLabelText = colLabelTokens.map(function (id) {
              return cleanText(document.getElementById(id));
            }).filter(Boolean).join(" - ");

            if (colLabelText) {
              cell.setAttribute("data-ls-a11y-col-label", colLabelText);
            }

            Array.prototype.slice.call(cell.querySelectorAll("input, select, textarea")).forEach(function (control) {
              addTokenAttribute(control, "aria-describedby", headerTokens);
              control.setAttribute("data-ls-a11y-array-described", "1");
            });
          }

          colIndex += colspan;
        });

        bodyRows.push(row);
        rowNumber += 1;
      });
    });

    var gridInfo = buildTableGrid(table);

    bodyRows.forEach(function (row) {
      tableCells(row).forEach(function (cell) {
        var placement = getCellPlacement(gridInfo, cell);
        if (!placement) return;

        var rowHeader = firstRowHeaderCell(row);
        var isRowHeader = rowHeader && cell === rowHeader;
        if (isRowHeader) return;

        var headerTokens = [];
        var gridRow = gridInfo.grid[placement.rowIndex] || [];
        var rowHeaderIds = [];

        for (var gridCol = 0; gridCol < gridRow.length; gridCol++) {
          var candidate = gridRow[gridCol];
          if (
            candidate &&
            candidate !== cell &&
            candidate.getAttribute("data-ls-a11y-array-header") === "row"
          ) {
            var candidateId = ensureElementId(candidate, tableId + "-rowspan-header");
            if (rowHeaderIds.indexOf(candidateId) === -1) rowHeaderIds.push(candidateId);
          }
        }

        rowHeaderIds.forEach(function (id) {
          if (headerTokens.indexOf(id) === -1) headerTokens.push(id);
        });

        for (var i = 0; i < placement.colspan; i++) {
          var ids = colHeadersByIndex[placement.colIndex + i] || [];
          ids.forEach(function (id) {
            if (headerTokens.indexOf(id) === -1) headerTokens.push(id);
          });
        }

        if (!headerTokens.length) return;

        var colLabelTokens = headerTokens.filter(function (id) {
          var tokenNode = document.getElementById(id);
          return tokenNode && tokenNode.getAttribute("data-ls-a11y-array-header") !== "row";
        });

        cell.setAttribute("headers", headerTokens.join(" "));
        cell.setAttribute("data-ls-a11y-array-cell", "1");

        var colLabelText = colLabelTokens.map(function (id) {
          return cleanText(document.getElementById(id));
        }).filter(Boolean).join(" - ");

        if (colLabelText) {
          cell.setAttribute("data-ls-a11y-col-label", colLabelText);
        }

        Array.prototype.slice.call(cell.querySelectorAll("input, select, textarea")).forEach(function (control) {
          setArrayDescribedByTokens(control, headerTokens);
          control.setAttribute("data-ls-a11y-array-described", "1");
        });
      });
    });
  }

  var tables = [];
  if (root.matches && root.matches("table.ls-answers, .ls-table-wrapper table")) tables.push(root);

  Array.prototype.slice.call(
    root.querySelectorAll(".question-container table.ls-answers, fieldset[id^='question'] table.ls-answers, div[id^='question'] table.ls-answers, .question-container .ls-table-wrapper table")
  ).forEach(function (table) {
    if (tables.indexOf(table) === -1) tables.push(table);
  });

  tables.forEach(function (table) {
    var question = getQuestionContainer(table);
    var tableId = ensureElementId(table, (question && question.id ?question.id : "ls-question") + "-array-table");

    table.setAttribute("data-ls-a11y-array-semantics", "1");
    ensureCaption(table, question);

    var colHeadersByIndex = mapColumnHeaders(table, tableId);
    enhanceBodyRows(table, tableId, colHeadersByIndex);
    removeMatrixCellTabStops(table);
  });
}

/* =========================================================
   8d) Reflow / zoom navigateur / espacement texte
   WCAG 1.4.4, 1.4.10, 1.4.12 — aides non destructives
========================================================= */
function initReflowZoomSupport(root) {
  root = root || document;

  function cleanText(node) {
    if (!node) return "";
    return (node.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getQuestionTitleFromTable(table) {
    var question = table && table.closest(
      ".question-container, fieldset[id^='question'], div[id^='question']"
    );

    if (!question) return "Tableau de réponses";

    var title =
      cleanText(question.querySelector(".ls-label-question")) ||
      cleanText(question.querySelector(".question-title-container")) ||
      cleanText(question.querySelector("legend")) ||
      "Tableau de réponses";

    return title;
  }

  function updateScrollableWrapper(wrapper) {
    if (!wrapper) return;

    var table = wrapper.querySelector("table");
    var hasHorizontalOverflow = wrapper.scrollWidth > wrapper.clientWidth + 2;

    wrapper.setAttribute("data-ls-a11y-reflow-wrapper", "1");

    if (hasHorizontalOverflow) {
      if (!wrapper.hasAttribute("tabindex")) wrapper.setAttribute("tabindex", "0");
      if (!wrapper.hasAttribute("role")) wrapper.setAttribute("role", "region");
      if (!wrapper.hasAttribute("aria-label")) {
        wrapper.setAttribute(
          "aria-label",
          getQuestionTitleFromTable(table) + " — tableau de réponses défilable horizontalement"
        );
      }
      wrapper.setAttribute("data-ls-a11y-scrollable", "true");
    } else if (wrapper.getAttribute("data-ls-a11y-scrollable") === "true") {
      wrapper.removeAttribute("data-ls-a11y-scrollable");
      if (wrapper.getAttribute("role") === "region") wrapper.removeAttribute("role");
      if ((wrapper.getAttribute("aria-label") || "").indexOf("tableau de réponses défilable horizontalement") !== -1) {
        wrapper.removeAttribute("aria-label");
      }
      if (wrapper.getAttribute("tabindex") === "0") wrapper.removeAttribute("tabindex");
    }
  }

  var wrappers = [];

  Array.prototype.slice.call(root.querySelectorAll(
    ".ls-table-wrapper, .table-responsive, .answer-container table"
  )).forEach(function (node) {
    var wrapper = node.matches && node.matches("table")
      ?node.closest(".ls-table-wrapper, .table-responsive") || node.parentElement
      : node;

    if (wrapper && wrappers.indexOf(wrapper) === -1) wrappers.push(wrapper);
  });

  wrappers.forEach(updateScrollableWrapper);

  if (!window.__LS_A11Y_REFLOW_RESIZE_BOUND__) {
    window.__LS_A11Y_REFLOW_RESIZE_BOUND__ = true;

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        initReflowZoomSupport(document);
      }, 120);
    });
  }
}

/* =========================================================
   8c) Focus automatique dans la searchbox bootstrap-select
========================================================= */
function initBootstrapSelectKeyboardFix() {
  if (!$) return;
  if (window.__LS_BOOTSTRAP_SELECT_KEYBOARD_FIX__) return;
  window.__LS_BOOTSTRAP_SELECT_KEYBOARD_FIX__ = true;

  $(document)
    .off("shown.bs.select.lsA11ySelectKeyboard", "select.list-question-select")
    .on("shown.bs.select.lsA11ySelectKeyboard", "select.list-question-select", function () {
    var $select = $(this);
    var $wrap = $select.parent(".bootstrap-select");
    if (!$wrap.length) $wrap = $select.next(".bootstrap-select");

    var $search = $wrap.find(".bs-searchbox input");
    if ($search.length) {
      setTimeout(function () {
        $search.trigger("focus");
      }, 0);
    }
  });
}

  /* =========================================================
     8d) Questions classement / ranking accessibles RGAA + NVDA
     - Rend la version select prioritaire
     - Masque le drag & drop aux lecteurs d’écran
     - Ajoute une consigne claire
     - Empêche les doublons entre les rangs
     - Ajoute un retour vocal aria-live
  ========================================================= */
  function initRankingQuestionsA11y(root) {
    root = root || document;

    function cleanText(txt) {
      return (txt || "").replace(/\s+/g, " ").trim();
    }

    function findLabelFor(question, inputId) {
      if (!question || !inputId) return null;

      var labels = question.getElementsByTagName("label");

      for (var i = 0; i < labels.length; i++) {
        if (labels[i].getAttribute("for") === inputId) {
          return labels[i];
        }
      }

      return null;
    }

    function isRankingQuestion(question) {
      if (!question) return false;

      return (
        question.classList.contains("ranking") ||
        question.querySelector(".select-sortable-lists") ||
        question.querySelector(".sortable-choice") ||
        question.querySelector(".sortable-rank")
      );
    }

    function getQuestionTextId(question) {
      var questionText =
        question.querySelector(".ls-label-question[id]") ||
        question.querySelector("legend[id]") ||
        question.querySelector(".question-title-container [id]");

      if (questionText && questionText.id) {
        return questionText.id;
      }

      return "";
    }

    function enhanceOneRankingQuestion(question, index) {
      if (!question || question.getAttribute("data-ls-ranking-a11y-ready") === "1") {
        return;
      }

      if (!isRankingQuestion(question)) {
        return;
      }

      var selectList = question.querySelector(".select-sortable-lists .select-list, .select-list");
      var dragDropArea = question.querySelector(".select-sortable-lists .ls-no-js-hidden, .ls-no-js-hidden");
      var selects = selectList ?selectList.querySelectorAll("select") : [];

      if (!selectList || !selects.length) {
        return;
      }

      question.setAttribute("data-ls-ranking-a11y-ready", "1");
      question.classList.add("ls-ranking-a11y-enabled");

      var questionId = question.id || "ls-ranking-question-" + index;
      var questionTextId = getQuestionTextId(question);

      /*
       * 1) La version select devient l'interface accessible officielle.
       */
      selectList.removeAttribute("aria-hidden");
      selectList.setAttribute("role", "group");

      if (questionTextId) {
        selectList.setAttribute("aria-labelledby", questionTextId);
      }

      /*
       * 2) La zone drag & drop est neutralisée pour les lecteurs d’écran.
       * Elle peut rester décorative si le CSS ne la masque pas.
       */
      if (dragDropArea) {
        dragDropArea.setAttribute("aria-hidden", "true");

        var focusables = dragDropArea.querySelectorAll(
          "a, button, input, select, textarea, [tabindex]"
        );

        for (var f = 0; f < focusables.length; f++) {
          focusables[f].setAttribute("tabindex", "-1");
        }

        var sortableItems = dragDropArea.querySelectorAll(".sortable-item, [draggable]");
        for (var si = 0; si < sortableItems.length; si++) {
          sortableItems[si].setAttribute("aria-hidden", "true");
          sortableItems[si].setAttribute("draggable", "false");
        }
      }

      /*
       * 3) Consigne accessible.
       */
      var helpId = questionId + "-ranking-a11y-help";
      var help = document.getElementById(helpId);

      if (!help) {
        help = document.createElement("p");
        help.id = helpId;
        help.className = "ls-ranking-a11y-help";
        help.innerHTML =
          "<strong>Consigne :</strong> sélectionnez une réponse pour chaque rang. " +
          "Utilisez la touche Tab pour passer d’un choix à l’autre, puis les flèches du clavier pour choisir une réponse. " +
          "Une même réponse ne peut être choisie qu’une seule fois.";

        selectList.parentNode.insertBefore(help, selectList);
      }

      /*
       * 4) Retour vocal NVDA / lecteur d'écran.
       * Les annonces sont centralisées dans #ls-a11y-status pour éviter
       * les zones aria-live concurrentes à chaque question.
       */

      /*
       * 5) Association des labels et de la consigne à chaque select.
       */
      for (var s = 0; s < selects.length; s++) {
        var select = selects[s];

        if (select.getAttribute("data-ls-ranking-a11y-select") === "1") {
          continue;
        }

        select.setAttribute("data-ls-ranking-a11y-select", "1");

        var oldDesc = select.getAttribute("aria-describedby") || "";
        if (oldDesc.indexOf(helpId) === -1) {
          select.setAttribute("aria-describedby", cleanText(oldDesc + " " + helpId));
        }

        if (!select.getAttribute("aria-label")) {
          var label = findLabelFor(question, select.id);

          if (label) {
            select.setAttribute("aria-label", cleanText(label.textContent));
          } else {
            select.setAttribute("aria-label", "Choix classé " + (s + 1));
          }
        }
      }

      /*
       * 6) Anti-doublon accessible + synchronisation fiable LimeSurvey.
       *
       * Important : le script natif de classement LimeSurvey compacte parfois les choix
       * dans la liste drag & drop masquée. Si on laisse son événement "change" agir sur
       * nos menus déroulants accessibles, une sélection faite en ligne 2 peut être
       * réaffectée visuellement en ligne 1, etc.
       *
       * On intercepte donc le changement en phase capture, on conserve la valeur dans
       * le select réellement utilisé par l'usager, puis on synchronise les champs java*
       * et la liste sortable cachée pour garder LimeSurvey cohérent au moment de la
       * validation / soumission.
       */
      function selectToArray(nodeList) {
        return Array.prototype.slice.call(nodeList || []);
      }

      selects = selectToArray(selects);

      function setSelectValue(select, value) {
        if (!select) return;

        value = value || "";
        select.value = value;

        for (var i = 0; i < select.options.length; i++) {
          select.options[i].selected = select.options[i].value === value;
        }
      }

      function getCompanionJavaInput(select) {
        if (!select) return null;

        var candidates = [];

        if (select.id && select.id.indexOf("answer") === 0) {
          candidates.push("java" + select.id.replace(/^answer/, ""));
        }

        if (select.name) {
          candidates.push("java" + select.name);
        }

        for (var i = 0; i < candidates.length; i++) {
          var byId = document.getElementById(candidates[i]);
          if (byId) return byId;
        }

        var wrapper = select.closest ?select.closest("li, .select-item, .answer-item, div") : null;
        if (wrapper) {
          var local = wrapper.querySelector('input[type="hidden"][id^="java"]');
          if (local) return local;
        }

        return null;
      }

      function optionExists(select, value) {
        if (!select || !value) return false;
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) return true;
        }
        return false;
      }

      function syncSelectsFromJavaInputs() {
        for (var i = 0; i < selects.length; i++) {
          var javaInput = getCompanionJavaInput(selects[i]);
          var storedValue = javaInput ?javaInput.value : "";

          if (storedValue && optionExists(selects[i], storedValue)) {
            setSelectValue(selects[i], storedValue);
          }
        }
      }

      function syncJavaInputsFromSelects() {
        for (var i = 0; i < selects.length; i++) {
          var javaInput = getCompanionJavaInput(selects[i]);
          if (javaInput) javaInput.value = selects[i].value || "";
        }
      }

      function getSelectedValues() {
        var selectedValues = [];

        for (var i = 0; i < selects.length; i++) {
          if (selects[i].value !== "") {
            selectedValues.push(selects[i].value);
          }
        }

        return selectedValues;
      }

      function getOptionOrder() {
        var order = [];

        if (!selects.length) return order;

        for (var i = 0; i < selects[0].options.length; i++) {
          var value = selects[0].options[i].value;
          if (value) order.push(value);
        }

        return order;
      }

      function syncSortableListsFromSelects() {
        if (!dragDropArea) return;

        var rankList = dragDropArea.querySelector(".sortable-rank");
        var choiceList = dragDropArea.querySelector(".sortable-choice");

        if (!rankList || !choiceList) return;

        var items = {};
        var allItems = dragDropArea.querySelectorAll(".ls-choice[data-value], .sortable-item[data-value]");

        for (var i = 0; i < allItems.length; i++) {
          var value = allItems[i].getAttribute("data-value");
          if (value && !items[value]) items[value] = allItems[i];
        }

        var selectedValues = getSelectedValues();
        var used = {};

        for (var s = 0; s < selectedValues.length; s++) {
          var selectedValue = selectedValues[s];
          if (items[selectedValue]) {
            rankList.appendChild(items[selectedValue]);
            used[selectedValue] = true;
          }
        }

        var optionOrder = getOptionOrder();
        for (var o = 0; o < optionOrder.length; o++) {
          var optionValue = optionOrder[o];
          if (!used[optionValue] && items[optionValue]) {
            choiceList.appendChild(items[optionValue]);
          }
        }
      }

      function updateDisabledOptions(changedSelect) {
        var selectedValues = getSelectedValues();

        for (var a = 0; a < selects.length; a++) {
          var currentSelect = selects[a];

          for (var b = 0; b < currentSelect.options.length; b++) {
            var option = currentSelect.options[b];

            if (!option.value) {
              option.disabled = false;
              continue;
            }

            option.disabled =
              selectedValues.indexOf(option.value) !== -1 &&
              option.value !== currentSelect.value;
          }
        }

        syncJavaInputsFromSelects();
        syncSortableListsFromSelects();

        if (changedSelect && changedSelect.value) {
          var selectedText = cleanText(
            changedSelect.options[changedSelect.selectedIndex].textContent
          );

          var rankLabel = findLabelFor(question, changedSelect.id);
          var rankText = rankLabel ?cleanText(rankLabel.textContent) : "ce rang";

          announceA11y(selectedText + " sélectionné pour " + rankText + ".", "status", {
            dedupeKey: "ranking:" + questionId + ":" + changedSelect.id + ":" + changedSelect.value
          });
        }
      }

      syncSelectsFromJavaInputs();

      for (var x = 0; x < selects.length; x++) {
        if (selects[x].getAttribute("data-ls-ranking-a11y-change-bound") === "1") {
          continue;
        }

        selects[x].setAttribute("data-ls-ranking-a11y-change-bound", "1");

        selects[x].addEventListener("change", function (event) {
          if (event && event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
          }

          var current = this;
          var value = current.value;

          /*
           * Si une valeur est choisie deux fois, on vide l'autre select.
           * On ne redéclenche pas de change : cela réveillerait le JS natif
           * de ranking et recréerait le décalage de ligne.
           */
          if (value) {
            for (var y = 0; y < selects.length; y++) {
              if (selects[y] !== current && selects[y].value === value) {
                setSelectValue(selects[y], "");
              }
            }
          }

          updateDisabledOptions(current);
        }, true);
      }

      updateDisabledOptions(null);
    }

    var questions = root.querySelectorAll(
      ".question-container.ranking, " +
      "fieldset.ranking, " +
      "div.ranking, " +
      ".question-container .select-sortable-lists"
    );

    for (var q = 0; q < questions.length; q++) {
      var question =
        questions[q].classList.contains("question-container") ||
        /^question/.test(questions[q].id || "")
          ?questions[q]
          : questions[q].closest(".question-container, fieldset[id^='question'], div[id^='question']");

      enhanceOneRankingQuestion(question, q);
    }
  } 

  /* =========================================================
     13.7 - Delai de session : avertissement + prolongation
     WCAG 2.2.1 - Timing Adjustable
  ========================================================= */
  function initSessionTimeoutWarning() {
    if (window.__LS_SESSION_TIMEOUT_A11Y__) return;
    window.__LS_SESSION_TIMEOUT_A11Y__ = true;

    var body = document.body || document.documentElement;
    var config = window.LSA11ySessionTimeout || {};
    var dataset = body && body.dataset ?body.dataset : {};
    var disabledValue = String(
      config.enabled === false ||
      dataset.lsA11ySessionTimeout === "off" ||
      dataset.lsA11ySessionTimeout === "false"
    );

    if (disabledValue === "true") return;

    function numberFrom(value, fallback) {
      var parsed = parseFloat(value);
      return isFinite(parsed) && parsed > 0 ?parsed : fallback;
    }

    var timeoutSeconds = numberFrom(
      config.timeoutSeconds || dataset.lsA11ySessionTimeoutSeconds,
      numberFrom(config.timeoutMinutes || dataset.lsA11ySessionTimeoutMinutes, 24) * 60
    );
    var warningSeconds = numberFrom(
      config.warningSeconds || dataset.lsA11ySessionWarningSeconds,
      numberFrom(config.warningMinutes || dataset.lsA11ySessionWarningMinutes, 3) * 60
    );

    if (warningSeconds >= timeoutSeconds) {
      warningSeconds = Math.max(30, Math.floor(timeoutSeconds / 4));
    }

    var warningDelay = Math.max(5, timeoutSeconds - warningSeconds) * 1000;
    var warningTimer = null;
    var countdownTimer = null;
    var secondsLeft = Math.ceil(warningSeconds);
    var lastFocused = null;

    function cleanText(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function focusableNodes(container) {
      return Array.prototype.slice.call(container.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])," +
        "textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )).filter(function (node) {
        return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
      });
    }

    function ensureDialog() {
      var dialog = document.getElementById("ls-a11y-session-timeout-dialog");
      if (dialog) return dialog;

      dialog = document.createElement("div");
      dialog.id = "ls-a11y-session-timeout-dialog";
      dialog.className = "ls-a11y-session-timeout";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "ls-a11y-session-timeout-title");
      dialog.setAttribute("aria-describedby", "ls-a11y-session-timeout-desc ls-a11y-session-timeout-countdown");
      dialog.setAttribute("hidden", "hidden");

      dialog.innerHTML =
        '<div class="ls-a11y-session-timeout__backdrop" data-ls-a11y-session-close="1"></div>' +
        '<div class="ls-a11y-session-timeout__panel" role="document">' +
          '<h2 id="ls-a11y-session-timeout-title">Session bientot expiree</h2>' +
          '<p id="ls-a11y-session-timeout-desc">Votre session peut expirer apres une periode d inactivite. Prolongez-la pour continuer a repondre au questionnaire.</p>' +
          '<p id="ls-a11y-session-timeout-countdown" aria-live="polite"></p>' +
          '<div class="ls-a11y-session-timeout__actions">' +
            '<button type="button" class="btn btn-primary" data-ls-a11y-session-extend="1">Prolonger la session</button>' +
            '<button type="button" class="btn btn-outline-secondary" data-ls-a11y-session-close="1">Fermer</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(dialog);

      dialog.addEventListener("click", function (event) {
        if (event.target && event.target.getAttribute("data-ls-a11y-session-extend") === "1") {
          extendSession();
        } else if (event.target && event.target.getAttribute("data-ls-a11y-session-close") === "1") {
          hideDialog(true);
        }
      });

      dialog.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          hideDialog(true);
          return;
        }

        if (event.key !== "Tab") return;
        var nodes = focusableNodes(dialog);
        if (!nodes.length) return;

        var first = nodes[0];
        var last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      return dialog;
    }

    function updateCountdown() {
      var countdown = document.getElementById("ls-a11y-session-timeout-countdown");
      if (!countdown) return;

      var minutes = Math.floor(secondsLeft / 60);
      var seconds = secondsLeft % 60;
      var message = minutes > 0
        ?"Expiration possible dans " + minutes + " minute" + (minutes > 1 ?"s" : "") + " et " + seconds + " seconde" + (seconds > 1 ?"s" : "") + "."
        : "Expiration possible dans " + seconds + " seconde" + (seconds > 1 ?"s" : "") + ".";

      countdown.textContent = message;
    }

    function showDialog() {
      var dialog = ensureDialog();
      if (!dialog.hasAttribute("hidden")) return;

      lastFocused = document.activeElement;
      secondsLeft = Math.ceil(warningSeconds);
      updateCountdown();
      dialog.removeAttribute("hidden");
      document.documentElement.classList.add("ls-a11y-session-timeout-open");
      announceA11y("Votre session peut bientot expirer. Activez Prolonger la session pour continuer.", "alert", {
        dedupeKey: "session-timeout-warning"
      });

      var primary = dialog.querySelector("[data-ls-a11y-session-extend]");
      if (primary) window.setTimeout(function () { primary.focus(); }, 30);

      window.clearInterval(countdownTimer);
      countdownTimer = window.setInterval(function () {
        secondsLeft -= 1;
        if (secondsLeft < 0) secondsLeft = 0;
        updateCountdown();
        if (secondsLeft === 0) {
          window.clearInterval(countdownTimer);
          announceA11y("La session peut etre expiree. Essayez de prolonger avant de poursuivre.", "alert", {
            dedupeKey: "session-timeout-expired"
          });
        }
      }, 1000);
    }

    function hideDialog(resetTimer) {
      var dialog = document.getElementById("ls-a11y-session-timeout-dialog");
      if (dialog) dialog.setAttribute("hidden", "hidden");
      document.documentElement.classList.remove("ls-a11y-session-timeout-open");
      window.clearInterval(countdownTimer);

      if (lastFocused && typeof lastFocused.focus === "function") {
        window.setTimeout(function () { lastFocused.focus(); }, 30);
      }

      if (resetTimer) scheduleWarning();
    }

    function sessionPing() {
      var url = cleanText(config.pingUrl || dataset.lsA11ySessionPingUrl || window.location.href);

      if (!window.fetch) {
        return Promise.resolve();
      }

      return window.fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "X-Requested-With": "XMLHttpRequest" }
      }).then(function () {
        return true;
      }).catch(function () {
        announceA11y("La prolongation de session n a pas pu etre confirmee. Verifiez votre connexion avant de continuer.", "alert", {
          dedupeKey: "session-timeout-ping-error"
        });
        return false;
      });
    }

    function extendSession() {
      var button = document.querySelector("[data-ls-a11y-session-extend]");
      if (button) button.setAttribute("disabled", "disabled");

      sessionPing().then(function (ok) {
        if (button) button.removeAttribute("disabled");
        if (!ok) return;
        announceA11y("Session prolongee.", "status", { dedupeKey: "session-timeout-extended" });
        hideDialog(false);
        scheduleWarning();
      });
    }

    function scheduleWarning() {
      window.clearTimeout(warningTimer);
      warningTimer = window.setTimeout(showDialog, warningDelay);
    }

    var activityEvents = ["keydown", "pointerdown", "touchstart", "change", "input"];
    activityEvents.forEach(function (eventName) {
      document.addEventListener(eventName, function (event) {
        var dialog = document.getElementById("ls-a11y-session-timeout-dialog");
        if (dialog && !dialog.hasAttribute("hidden") && dialog.contains(event.target)) return;
        scheduleWarning();
      }, true);
    });

    document.addEventListener("submit", function () {
      window.clearTimeout(warningTimer);
      window.clearInterval(countdownTimer);
    }, true);

    scheduleWarning();
  }

  /* =========================================================
     13.9 - Pages hors questionnaire : fin, resultats, listing
     WCAG 1.4.10 - Reflow
  ========================================================= */
  function initStaticResultPagesAccessibility(root) {
    root = root || document;

    var main = document.getElementById("main-content") || document.querySelector("main");
    if (!main) return;

    var bodyClass = (document.body && document.body.className ?document.body.className : "").toString();
    var pageSelectors = [
      ".completed-wrapper",
      ".completed-text",
      ".completed",
      ".survey-completed",
      ".assessments",
      ".assessment",
      ".assessment-heading",
      ".printanswers",
      ".print-answers",
      ".results",
      ".result-container",
      ".statistics",
      ".list-surveys",
      ".survey-list",
      ".survey-list-container",
      "#surveys-list",
      "#surveyListFooter",
      ".survey-welcome"
    ];

    var hasQuestionPage = !!main.querySelector(".question-container, fieldset[id^='question'], div[id^='question']");
    var hasStaticContent = pageSelectors.some(function (selector) {
      return !!main.querySelector(selector);
    });
    var bodyLooksStatic = /\b(completed|submit|assessment|assessments|statistics|printanswers|list-surveys|survey-list|welcome)\b/i.test(bodyClass);

    if (hasQuestionPage && !hasStaticContent && !bodyLooksStatic) return;

    document.body.setAttribute("data-ls-a11y-static-page", "1");
    main.setAttribute("data-ls-a11y-static-page-main", "1");

    if (!main.getAttribute("aria-labelledby")) {
      var heading = main.querySelector("h1, .pagetitle, .completed-heading, .assessment-heading, .surveydescription h2, h2");
      if (heading) {
        if (!heading.id) heading.id = "ls-a11y-static-page-title";
        main.setAttribute("aria-labelledby", heading.id);
      }
    }

    Array.prototype.slice.call(main.querySelectorAll("img, svg, canvas, video, iframe")).forEach(function (media) {
      media.setAttribute("data-ls-a11y-static-media", "1");
    });

    Array.prototype.slice.call(main.querySelectorAll("table")).forEach(function (table, index) {
      if (table.closest(".ls-a11y-static-table-wrapper")) return;
      if (table.closest(".question-container, fieldset[id^='question'], div[id^='question']")) return;

      var wrapper = document.createElement("div");
      wrapper.className = "ls-a11y-static-table-wrapper";
      wrapper.setAttribute("data-ls-a11y-static-table-wrapper", "1");
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("tabindex", "0");

      var caption = table.querySelector("caption");
      var label = caption && caption.textContent
        ?caption.textContent.replace(/\s+/g, " ").trim()
        : "Tableau de contenu " + (index + 1);

      wrapper.setAttribute("aria-label", label + " - defilement horizontal possible");
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    Array.prototype.slice.call(main.querySelectorAll(
      ".list-surveys, .survey-list, .survey-list-container, .completed-wrapper, .assessment, .assessments, .result-container"
    )).forEach(function (section) {
      section.setAttribute("data-ls-a11y-static-section", "1");
    });
  }

  /* =========================================================
     BOOT GLOBAL
     Orchestration par modules fonctionnels.
     Chaque famille est documentée dans files/a11y-modules/manifest.json
     et couverte dans tests/accessibilite/MATRICE-TESTS-RGAA-WCAG.md.
  ========================================================= */
  function boot(root) {
    root = root || document;

    runA11yModule("core-status-links", root, function (scope) {
      // Régions de statut centralisées : status + alert.
      ensureA11yStatusRegions();

      // Liens target="_blank" : sécurité + annonce homogène.
      enhanceBlankTargetLinks(scope);

      // WCAG 2.5.3 : le nom accessible des boutons garde leur etiquette visible.
      enhanceVisibleLabelInAccessibleName(scope);

      // Init "one time" global handlers.
      wireMaxLenDelegation();
      wireRelevanceHandlers();
    });

    runA11yModule("structure-required", root, function (scope) {
      // Conversion sémantique d'abord, puis branchement des champs sur les nœuds définitifs.
      initPassageLanguageHints(scope);
      initDivToFieldset(scope);
      removeAlertRoleOnQuestionHelp(scope);
      removeRequiredFromHiddenInputs(scope);
      removeRequiredFromOtherTextInputs(scope);
      removeRequiredFromMultipleOptMandatoryFieldsets(scope);
      updateRequiredForInputsSelectsAndRadios(scope);
      validateRadioRequirementsInTable(scope);
      addRequiredToTextLongMandatory(scope);
      updateRequiredForTextShortQuestions(scope);
      applyRequiredRadiosFieldsets(scope);
      updateRequiredAttributes(scope);
      updateRadioRequiredAttributes(scope);
    });

    runA11yModule("personal-data-autocomplete", root, function () {
      // Auto types + autocomplete standard : boot unique avec observer interne.
      initAutoTypes();
    });

    runA11yModule("question-families", root, function (scope) {
      initDateTriplets(scope);
      initDatePlaceholders();
      initOtherRadios(scope);
      initOtherCheckboxes(scope);
      initDisableOtherOnListRadio(scope);
      initOtherAutreFocus(scope);
      initForceListWithComment(scope);
      initMultipleOptComments();
      if (initMultipleOptComments._init) initMultipleOptComments._init(scope);
      initChoiceFocusStyles(scope);
      initUploadAccessibility(scope);
      initSliderAccessibility(scope);
      initEquationAccessibility(scope);
    });

    runA11yModule("arrays-tables", root, function (scope) {
      enhanceArrayTableSemantics(scope);
    });

    runA11yModule("reflow-focus-selects", root, function (scope) {
      initReflowZoomSupport(scope);
      hideNativePickers(scope);
      forceNativeSelectAccessibility(scope);
      initBootstrapSelectKeyboardFix();
      initAriaLiveSubmitMessage();
      initBootstrapAlertModalAriaLive();
    });

    runA11yModule("ranking", root, function (scope) {
      initRankingQuestionsA11y(scope);
    });

    runA11yModule("session-timeout", root, function () {
      initSessionTimeoutWarning();
    });

    runA11yModule("static-result-pages", root, function (scope) {
      initStaticResultPagesAccessibility(scope);
    });

    runA11yModule("observers-validation", root, function () {
      // Blocs qui installent leurs observers / comportements globaux.
      if (!window.__LS_REQUIRED_CLEANUP_OBS__) {
        window.__LS_REQUIRED_CLEANUP_OBS__ = true;
        initRequiredCleanupObservers();
      }
      if (!window.__LS_REQUIRED_OBS__) {
        window.__LS_REQUIRED_OBS__ = true;
        initRequiredObserver();
      }
      if (!window.__LS_TEXT_REQUIRED_OBS__) {
        window.__LS_TEXT_REQUIRED_OBS__ = true;
        initTextLongShortRequiredObserver();
      }
      if (!window.__LS_LISTRADIO_REQUIRED_OBS__) {
        window.__LS_LISTRADIO_REQUIRED_OBS__ = true;
        initListRadioRequiredObserver();
      }
      if (!window.__LS_ROW_REQUIRED_OBS__) {
        window.__LS_ROW_REQUIRED_OBS__ = true;
        initRowRequiredObservers();
      }
      if (!window.__LS_UNHIDE_RELEVANT_OBS__) {
        window.__LS_UNHIDE_RELEVANT_OBS__ = true;
        initUnhideRelevantWatcher();
      }

      // Validation progressive et messages d'erreur reliés.
      initSequentialValidation();
    });
  }

  // Initial
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { boot(document); });
  } else {
    boot(document);
  }

  // PJAX
  document.addEventListener("pjax:success", function (e) {
    boot((e && e.target) ?e.target : document);
  });

})(window, document, window.jQuery);

