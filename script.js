(function () {
  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Typing effect for hero name
  var typedEl = document.querySelector(".hero-name .typed-text");
  if (typedEl) {
    var text = "Vishw Vekariya";
    var i = 0;
    var delay = 80;
    function type() {
      if (i < text.length) {
        typedEl.textContent += text.charAt(i);
        i++;
        setTimeout(type, delay);
      } else {
        setTimeout(function () {
          typedEl.nextElementSibling.style.animation = "none";
          setTimeout(function () {
            typedEl.nextElementSibling.style.animation = "blink 1s step-end infinite";
          }, 10);
        }, 500);
      }
    }
    setTimeout(type, 600);
  }

  // Terminal typing effect (whoami, pwd)
  var whoamiEl = document.getElementById("terminal-whoami");
  var pwdEl = document.getElementById("terminal-pwd");
  var termCursor = document.getElementById("terminal-cursor");
  if (whoamiEl && pwdEl) {
    var whoamiText = "Vishw";
    var pwdText = "/Users/vishw/portfolio";
    var termDelay = 120;
    function typeTerminal(el, str, done) {
      var idx = 0;
      function step() {
        if (idx < str.length) {
          el.textContent += str.charAt(idx);
          idx++;
          setTimeout(step, termDelay);
        } else if (done) done();
      }
      step();
    }
    setTimeout(function () {
      typeTerminal(whoamiEl, whoamiText, function () {
        if (termCursor) termCursor.style.display = "none";
        setTimeout(function () {
          typeTerminal(pwdEl, pwdText, function () {
            if (termCursor) {
              termCursor.style.display = "inline";
              termCursor.textContent = "_";
            }
          });
        }, 400);
      });
    }, 2200);
  }

  // Scroll progress bar
  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + "%";
    });
  }

  // Animated counters
  var statNumbers = document.querySelectorAll(".stat-number");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(easeOut * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var grid = entry.target;
        grid.querySelectorAll(".stat-number").forEach(animateCounter);
        counterObserver.unobserve(grid);
      }
    });
  }, { threshold: 0.3 });
  var statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) counterObserver.observe(statsGrid);

  // Skill bar fill on scroll
  var skillBars = document.querySelectorAll(".skill-bar-fill");
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

  // Activity heatmap (12 weeks x 7 days, random-ish levels)
  var heatmapGrid = document.getElementById("heatmap-grid");
  if (heatmapGrid) {
    var totalCells = 12 * 7;
    for (var w = 0; w < totalCells; w++) {
      var cell = document.createElement("div");
      cell.className = "heatmap-cell";
      var r = Math.random();
      if (r < 0.35) cell.classList.add("lvl-0");
      else if (r < 0.6) cell.classList.add("lvl-1");
      else if (r < 0.8) cell.classList.add("lvl-2");
      else if (r < 0.92) cell.classList.add("lvl-3");
      else cell.classList.add("lvl-4");
      heatmapGrid.appendChild(cell);
    }
  }

  // Parallax effect on hero photo
  var heroPhoto = document.querySelector(".hero-photo img");
  if (heroPhoto) {
    document.addEventListener("mousemove", function (e) {
      var x = (e.clientX - window.innerWidth / 2) / 50;
      var y = (e.clientY - window.innerHeight / 2) / 50;
      heroPhoto.style.transform = "translate(" + x + "px, " + y + "px) scale(1.03)";
    });
    document.addEventListener("mouseleave", function () {
      heroPhoto.style.transform = "translate(0, 0) scale(1)";
    });
  }

  // Magnetic button effect
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      var y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      btn.style.transform = "translate(" + x + "px, " + y + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  // Mobile nav toggle with animation
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

  // Header scroll effect
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      var scroll = window.scrollY || document.documentElement.scrollTop;
      if (scroll > 80) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    });
  }

  // Scroll reveal animations
  var revealEls = document.querySelectorAll(".reveal");
  var revealChildren = document.querySelectorAll(".reveal-children");
  var observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, observerOptions);
  revealEls.forEach(function (el) { observer.observe(el); });
  revealChildren.forEach(function (el) { observer.observe(el); });

  // Active nav link on scroll
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY + 150;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute("id");
      if (id && scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) link.classList.add("active");
        });
      }
    });
  });
})();
