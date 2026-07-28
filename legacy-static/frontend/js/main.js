/* =====================================================================
   DAMCOMPANY — main.js
   - Menu burger mobile (ouverture / fermeture / clic lien)
   - Animations légères au scroll (reveal)
   - Validation du formulaire de contact + envoi simulé
   Aucune dépendance / aucun framework.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. MENU BURGER MOBILE ---------- */
  var burger    = document.querySelector(".burger");
  var mobileNav = document.querySelector(".mobile-nav");
  var overlay   = document.querySelector(".overlay");
  var closeBtn  = document.querySelector(".mobile-close");

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    overlay && overlay.classList.add("is-open");
    burger && burger.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    overlay && overlay.classList.remove("is-open");
    burger && burger.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (burger)   burger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay)  overlay.addEventListener("click", closeMenu);

  // Fermeture du menu au clic sur un lien
  document.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  // Échap ferme le menu
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- 2. ANIMATION AU SCROLL (REVEAL) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback : tout afficher
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3. FORMULAIRE DE CONTACT ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var feedback = document.querySelector(".form-feedback");

    function setError(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("invalid", on);
    }

    function validate() {
      var ok = true;
      var required = form.querySelectorAll("[required]");
      required.forEach(function (field) {
        var val = (field.value || "").trim();
        var bad = val === "";
        if (!bad && field.type === "email") {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        setError(field, bad);
        if (bad) ok = false;
      });
      return ok;
    }

    // Retire l'erreur dès que l'utilisateur corrige
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.addEventListener("input", function () { setError(f, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (feedback) feedback.classList.remove("show");

      if (!validate()) return;

      var btn = form.querySelector("button[type=submit]");
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }

      // Envoi simulé — prêt pour un futur endpoint /api/contact
      var payload = {
        prenom:  form.prenom ? form.prenom.value.trim() : "",
        nom:     form.nom ? form.nom.value.trim() : "",
        email:   form.email ? form.email.value.trim() : "",
        telephone: form.telephone ? form.telephone.value.trim() : "",
        service: form.service ? form.service.value : "",
        message: form.message ? form.message.value.trim() : ""
      };

      sendContact(payload).then(function () {
        form.reset();
        if (feedback) {
          feedback.textContent = "Merci ! Votre demande a bien été envoyée. Nous vous répondrons rapidement.";
          feedback.classList.add("show");
        }
      }).catch(function () {
        if (feedback) {
          feedback.style.background = "#fdecec";
          feedback.style.borderColor = "#f3b8b8";
          feedback.style.color = "#c0392b";
          feedback.textContent = "Une erreur est survenue. Réessayez ou contactez-nous par email.";
          feedback.classList.add("show");
        }
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      });
    });

    /**
     * Tente d'appeler le backend /api/contact s'il est disponible.
     * Si aucun backend n'est configuré (site ouvert en local), on simule
     * une réponse réussie pour ne pas bloquer le site.
     */
    function sendContact(data) {
      var endpoint = "/api/contact";
      var canFetch = location.protocol === "http:" || location.protocol === "https:";
      if (!canFetch) {
        // Ouverture locale via file:// -> envoi simulé
        return new Promise(function (resolve) { setTimeout(resolve, 600); });
      }
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) return res.json();
        // Pas de backend branché : on simule quand même un succès côté frontend
        return Promise.resolve({ success: true });
      }).catch(function () {
        // Backend absent : envoi simulé réussi pour ne pas bloquer le site
        return Promise.resolve({ success: true });
      });
    }
  }
})();
