(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>+=";
  function rand(s) { return s.charAt(Math.floor(Math.random() * s.length)); }

  // ----- Year -----
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ----- Scramble text helper -----
  // Animates `el` from whatever it shows now to `target`, revealing left to right.
  function scrambleTo(el, target, opts) {
    opts = opts || {};
    var duration = opts.duration || 900;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var len = target.length;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / duration);
      var revealed = Math.floor(p * len);
      var out = "";
      for (var i = 0; i < len; i++) {
        var c = target.charAt(i);
        if (i < revealed || c === " ") out += c;
        else out += '<span class="ch-glitch">' + rand(GLYPHS) + "</span>";
      }
      el.innerHTML = out;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  // ----- Hero rows: cycle words with a decode effect -----
  var rows = Array.prototype.slice.call(document.querySelectorAll(".scramble-row"));
  rows.forEach(function (row, r) {
    var words = row.getAttribute("data-words").split("|");
    var width = words.reduce(function (m, w) { return Math.max(m, w.length); }, 0);
    words = words.map(function (w) { return (w + "            ").slice(0, width); });
    var i = 0;
    row.textContent = words[0].replace(/\S/g, " ");
    setTimeout(function () { scrambleTo(row, words[0], { duration: 1100 }); }, 250 + r * 260);
    if (reduceMotion) return;
    setTimeout(function tick() {
      i = (i + 1) % words.length;
      scrambleTo(row, words[i], { duration: 800 });
      setTimeout(tick, 3600);
    }, 3400 + r * 450);
  });

  // ----- Email: scramble on hover -----
  var email = document.querySelector(".email");
  if (email) {
    var emailText = email.getAttribute("data-text");
    email.addEventListener("mouseenter", function () { scrambleTo(email, emailText, { duration: 600 }); });
  }

  // ----- ASCII band -----
  var ascii = document.querySelector(".ascii");
  if (ascii) {
    var cells = [], cols = 0, rowsN = 0;
    function buildAscii() {
      var fs = parseFloat(getComputedStyle(ascii).fontSize) || 10;
      var charW = fs * 0.6;
      cols = Math.max(40, Math.floor((ascii.parentElement.clientWidth - 8) / charW));
      rowsN = Math.max(14, Math.round(cols / 6.2));
      var cvs = document.createElement("canvas");
      var aspect = 1.75; // char cell is taller than wide
      cvs.width = cols; cvs.height = Math.round(rowsN * aspect);
      var ctx = cvs.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var label = "DATA → ML";
      var size = cvs.height * 0.95;
      ctx.font = "800 " + size + "px Arial, sans-serif";
      var w = ctx.measureText(label).width;
      if (w > cols * 0.92) { size = size * (cols * 0.92) / w; ctx.font = "800 " + size + "px Arial, sans-serif"; }
      ctx.fillText(label, cols / 2, cvs.height / 2 + size * 0.04);
      var data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
      cells = [];
      for (var y = 0; y < rowsN; y++) {
        var line = [];
        var py = Math.min(cvs.height - 1, Math.round((y + 0.5) * aspect));
        for (var x = 0; x < cols; x++) {
          line.push(data[(py * cvs.width + x) * 4 + 3] > 110);
        }
        cells.push(line);
      }
      drawAscii();
    }
    function drawAscii() {
      var html = "";
      for (var y = 0; y < cells.length; y++) {
        var cur = null, buf = "";
        for (var x = 0; x < cells[y].length; x++) {
          var on = cells[y][x];
          var ch = on ? rand("#%@&$8") : (Math.random() < 0.025 ? rand("01") : "·");
          if (on !== cur) {
            if (cur !== null) html += '<span class="' + (cur ? "on" : "off") + '">' + buf + "</span>";
            cur = on; buf = "";
          }
          buf += ch;
        }
        html += '<span class="' + (cur ? "on" : "off") + '">' + buf + "</span>\n";
      }
      ascii.innerHTML = html;
    }
    buildAscii();
    var asciiTimer = null, asciiVisible = false;
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        asciiVisible = es[0].isIntersecting;
        if (asciiVisible && !asciiTimer) asciiTimer = setInterval(drawAscii, 160);
        if (!asciiVisible && asciiTimer) { clearInterval(asciiTimer); asciiTimer = null; }
      }).observe(ascii);
    }
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildAscii, 200); });
  }

  // ----- Chrome: swap corner nav for pill nav after the hero -----
  var chrome = document.querySelector(".chrome");
  function onScroll() {
    chrome.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section in pill nav
  var pillLinks = document.querySelectorAll(".pill-nav a");
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id === "approach" ? "projects" : e.target.id;
        pillLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { secObs.observe(s); });
  }

  // ----- Mobile menu -----
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.querySelector(".mobile-menu");
  if (menuBtn && menu) {
    function setMenu(open) {
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }
    menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  // ----- Theme toggle -----
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ----- Experience accordion -----
  document.querySelectorAll(".xp").forEach(function (item) {
    var body = item.querySelector(".xp-body");
    // wrap body content in a single child so the grid-rows animation works
    var inner = document.createElement("div");
    inner.className = "xp-inner";
    while (body.firstChild) inner.appendChild(body.firstChild);
    body.appendChild(inner);
    var btn = item.querySelector(".xp-row");
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // ----- Skills notebook filter -----
  var chips = document.querySelectorAll(".chip");
  var skillRows = document.querySelectorAll(".skills-table tbody tr");
  var whereEl = document.querySelector(".nb-where");
  var countEl = document.querySelector(".row-count");
  function applyFilter(f) {
    var n = 0;
    skillRows.forEach(function (tr) {
      var show = f === "all" || tr.getAttribute("data-domain") === f;
      tr.classList.toggle("is-hidden", !show);
      if (show) {
        tr.querySelector(".idx").textContent = n++;
        if (!reduceMotion) {
          var cap = tr.querySelector(".cap");
          scrambleTo(cap, cap.getAttribute("data-label") || (cap.setAttribute("data-label", cap.textContent), cap.textContent), { duration: 450 });
        }
      }
    });
    if (countEl) countEl.textContent = n;
    if (whereEl) whereEl.textContent = f === "all" ? "" : "\n WHERE domain = '" + f + "'";
  }
  skillRows.forEach(function (tr) { var c = tr.querySelector(".cap"); c.setAttribute("data-label", c.textContent); });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.toggle("is-on", c === chip); });
      applyFilter(chip.getAttribute("data-filter"));
    });
  });
  applyFilter("all");

  // bars stagger
  document.querySelectorAll(".bars i").forEach(function (b, i) { b.style.setProperty("--d", i * 80); });

  // ----- Scroll reveal -----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("revealed"); ro.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("revealed"); });
  }

  // ----- Visit notification email (set a Formspree ID in index.html to enable) -----
  // Visit the site once with ?me to stop getting emails for your own visits on that browser,
  // and ?me=off to turn emails back on.
  (function () {
    var meta = document.querySelector('meta[name="formspree-form-id"]');
    var formId = meta ? meta.getAttribute("content") : "";
    if (!formId || formId === "YOUR_FORM_ID") return;
    var host = location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || location.protocol === "file:") return;
    try {
      var q = new URLSearchParams(location.search);
      if (q.has("me")) {
        if (q.get("me") === "off") localStorage.removeItem("isOwner");
        else localStorage.setItem("isOwner", "1");
      }
      if (localStorage.getItem("isOwner")) return;
      if (sessionStorage.getItem("visitNotified")) return;
      sessionStorage.setItem("visitNotified", "1");
    } catch (e) { return; }

    function sendVisit(d) {
      d = d || {};
      var place = [d.city, d.region, d.postal].filter(Boolean).join(", ");
      var where = place ? place + (d.country_name ? " (" + d.country_name + ")" : "") : (d.country_name || "an unknown location");
      var ref = document.referrer ? document.referrer : "Direct / typed URL";
      var now = new Date();
      fetch("https://formspree.io/f/" + formId, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Someone viewed your portfolio from " + (d.city ? d.city + (d.region_code ? ", " + d.region_code : "") : (d.country_name || "somewhere")),
          message: [
            "Someone just viewed your portfolio.",
            "",
            "Location: " + where,
            "City: " + (d.city || "-"),
            "ZIP / postal code: " + (d.postal || "-"),
            "Region: " + (d.region || "-"),
            "Country: " + (d.country_name || "-"),
            "Network / company: " + (d.org || "-"),
            "Came from: " + ref,
            "Page: " + location.href,
            "Time: " + now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }) + " (Los Angeles time)",
            "Device: " + (/Mobi|Android/i.test(navigator.userAgent) ? "Phone" : "Desktop") + " - " + (navigator.userAgent || "-"),
            "",
            "Location is estimated from the visitor's internet connection, so city and ZIP are approximate."
          ].join("\n")
        })
      }).catch(function () {});
    }
    fetch("https://ipapi.co/json/")
      .then(function (r) { return r.json(); })
      .then(function (d) { sendVisit(d && !d.error ? d : {}); })
      .catch(function () { sendVisit({}); });
  })();
})();
