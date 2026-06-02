(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Terminal typing effect (whoami + current focus)
  var whoamiEl = document.getElementById("terminal-whoami");
  var focusEl = document.getElementById("terminal-pwd");
  var termCursor = document.getElementById("terminal-cursor");
  if (whoamiEl && focusEl) {
    var whoamiText = "Vishw Vekariya, data + ML";
    var focusText = "Pipelines, models, and the stories in the data.";
    var termDelay = 55;

    function typeTerminal(el, str, done) {
      if (reduceMotion) { el.textContent = str; if (done) done(); return; }
      var idx = 0;
      (function step() {
        if (idx < str.length) {
          el.textContent += str.charAt(idx++);
          setTimeout(step, termDelay);
        } else if (done) {
          done();
        }
      })();
    }

    setTimeout(function () {
      typeTerminal(whoamiEl, whoamiText, function () {
        if (termCursor) termCursor.style.display = "none";
        setTimeout(function () {
          typeTerminal(focusEl, focusText, function () {
            if (termCursor) {
              termCursor.style.display = "inline";
              termCursor.textContent = "▋";
            }
          });
        }, 350);
      });
    }, 1400);
  }

  // Scroll progress bar
  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + "%";
    }, { passive: true });
  }

  // Skill bars fill on scroll
  var skillBars = document.querySelectorAll(".skill-bar-fill");
  if ("IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var pct = entry.target.getAttribute("data-pct");
          if (pct) {
            entry.target.style.setProperty("--fill-pct", pct + "%");
            entry.target.classList.add("revealed");
          }
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillBars.forEach(function (el) { barObserver.observe(el); });
  } else {
    skillBars.forEach(function (el) {
      var pct = el.getAttribute("data-pct");
      if (pct) { el.style.setProperty("--fill-pct", pct + "%"); el.classList.add("revealed"); }
    });
  }

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("is-open");
      links.classList.toggle("is-open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        links.classList.remove("is-open");
      });
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      var scroll = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("scrolled", scroll > 60);
    }, { passive: true });
  }

  // Scroll reveal animations
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -60px 0px", threshold: 0.1 });
    document.querySelectorAll(".reveal, .reveal-children").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal, .reveal-children").forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // Active nav link on scroll
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", function () {
      var scrollY = window.scrollY + 150;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute("id");
        if (id && scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { passive: true });
  }

  // Visit notification: email on view (with coarse IP location) when a Formspree ID is set
  (function () {
    var formIdMeta = document.querySelector('meta[name="formspree-form-id"]');
    var formId = formIdMeta ? formIdMeta.getAttribute("content") : "";
    if (!formId || formId === "YOUR_FORM_ID") return;
    try {
      if (sessionStorage.getItem("visitNotified")) return;
      sessionStorage.setItem("visitNotified", "1");
    } catch (e) { return; }
    function sendVisit(data) {
      var body = {
        _subject: "Portfolio visitor - " + (data.city || data.country_name || "Unknown"),
        message: [
          "New visit to your portfolio",
          "",
          "Location: " + (data.city ? data.city + ", " : "") + (data.region || "") + " " + (data.country_name || ""),
          "Country code: " + (data.country_code || "-"),
          "IP: " + (data.ip || "-"),
          "Time: " + new Date().toISOString(),
          "User agent: " + (navigator.userAgent || "-")
        ].join("\n")
      };
      fetch("https://formspree.io/f/" + formId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).catch(function () {});
    }
    fetch("https://ipapi.co/json/")
      .then(function (r) { return r.json(); })
      .then(sendVisit)
      .catch(function () { sendVisit({ ip: "unknown", country_name: "Unknown" }); });
  })();
})();
