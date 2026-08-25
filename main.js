/* Aguglia Persa — interaction
   Header state, mobile drawer, scroll reveals, rating bars, floating WhatsApp
   button, galleries + lightbox, and the booking request form. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* In the single-file preview every photograph is stored once in window.__IMG
     and resolved here; on the real site the paths are used as written. */
  var MAP = window.__IMG || null;
  function src(path) {
    if (!MAP) return path;
    var m = /images\/([A-Za-z0-9-]+)\.webp/.exec(path);
    return (m && MAP[m[1]]) || path;
  }
  if (MAP) $$("img[data-img]").forEach(function (i) { if (MAP[i.dataset.img]) i.src = MAP[i.dataset.img]; });

  /* ---------------------------------------------------- header + fab -- */
  var head = $("#head"), fab = $("#fab"), stuck = false;
  function onScroll() {
    var s = window.scrollY > Math.min(window.innerHeight * 0.6, 520);
    if (s !== stuck) {
      stuck = s;
      if (head) head.classList.toggle("is-stuck", s);
      if (fab) fab.classList.toggle("on", s);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------- drawer -- */
  var burger = $("#burger"), drawer = $("#drawer");
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", closeDrawer); });
  }

  /* -------------------------------------------------------- reveals -- */
  function reveal(root) {
    var els = $$(".rv", root);
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }
  reveal(document);

  /* ---------------------------------------------------- rating bars -- */
  var bars = $$(".bar__f");
  function fillBars() { bars.forEach(function (b) { b.style.width = b.dataset.v + "%"; }); }
  if (bars.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      fillBars();
    } else {
      var bio = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { fillBars(); bio.disconnect(); }
      }, { threshold: 0.3 });
      bio.observe(bars[0].closest(".bars"));
    }
  }

  /* ------------------------------------------------------- lightbox -- */
  var lb = $("#lb"), lbImg = $("#lbImg"), lbCount = $("#lbCount"), lbCap = $("#lbCap");
  var list = [], cur = 0, lastFocus = null;

  function show(i) {
    cur = (i + list.length) % list.length;
    lbImg.src = src(list[cur][0]);
    lbImg.alt = list[cur][1].replace(/&mdash;/g, "—");
    lbCap.innerHTML = list[cur][1];
    lbCount.textContent = String(cur + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0");
  }
  function openLb(photos, i) {
    list = photos;
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (lb) {
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", function () { show(cur - 1); });
    $("#lbNext").addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbImg) closeLb(); });
  }
  document.addEventListener("keydown", function (e) {
    if (drawer && drawer.classList.contains("is-open") && e.key === "Escape") { closeDrawer(); burger.focus(); return; }
    if (!lb || !lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") show(cur - 1);
    else if (e.key === "ArrowRight") show(cur + 1);
  });

  function buildGallery(container, photos) {
    var frag = document.createDocumentFragment();
    photos.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.i = i;
      var plain = p[1].replace(/&mdash;/g, "—");
      b.setAttribute("aria-label", "Open photograph: " + plain);
      var img = document.createElement("img");
      img.src = src(p[0]);
      img.alt = plain;
      img.loading = i < 6 ? "eager" : "lazy";
      img.decoding = "async";
      b.appendChild(img);
      frag.appendChild(b);
    });
    container.appendChild(frag);
    container.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) openLb(photos, Number(b.dataset.i));
    });
  }

  /* -------------------------------------------- the farm-wide gallery -- */
  var HOME_PHOTOS = [
    ["images/front-golden.webp",          "The house and the gravel drive at golden hour"],
    ["images/lounge-sofabed.webp",        "The sofa in the lounge, made up as a double bed"],
    ["images/room1-tall-door.webp",       "The tall old door of Room 1"],
    ["images/kitchen-shelves.webp",       "Open shelves stacked with pans, bowls and coloured glasses"],
    ["images/pergola-under.webp",         "Under the pergola canvas, looking out at the trees"],
    ["images/room1-armoire.webp",         "The old glass-fronted armoire in Room 1"],
    ["images/back-courtyard.webp",        "The white courtyard behind the house"],
    ["images/room2-cabinet.webp",         "The tall blue cabinet beside the bed in Room 2"],
    ["images/stone-head.webp",            "A carved stone head, warm in the evening light"],
    ["images/kitchen-door.webp",          "The kitchen and its old wooden door"],
    ["images/old-arched-door.webp",       "The old arched door in its limestone surround"],
    ["images/roofline-sky.webp",          "A lime-washed wall meeting the blue Sicilian sky"],
    ["images/lounge-through-door.webp",   "Looking into the lounge from the hall"],
    ["images/pampas-door.webp",           "Dried pampas grass standing against an old door"],
    ["images/front-courtyard.webp",       "The courtyard and its potted plants"],
    ["images/stacked-stones.webp",        "Smooth white river stones stacked into a cairn"],
    ["images/white-volumes-clouds.webp",  "The white roofline of the house cutting into the clouds"],
    ["images/room1-washstand.webp",       "The concrete washstand in the bathroom of Room 1"],
    ["images/lounge-to-bedroom.webp",     "From the lounge through into the bedroom"],
    ["images/house-tree-path.webp",       "The path along the house, under the old tree"],
    ["images/terrace-night-loungers.webp","Loungers on the terrace at night, warm light from the window"],
    ["images/wildflowers-sky.webp",       "Dried wildflower heads against a pale sky"],
    ["images/basket-cat.webp",            "One of the cats keeping an eye on the kitchen basket"],
    ["images/front-dusk.webp",            "The last of the light on the front wall"],
    ["images/room2-bathroom-mirror.webp", "The gilt mirror above the basin in Room 2"],
    ["images/lounge-mirror-door.webp",    "A tall mirror beside the old carved door"],
    ["images/room1-twin.webp",            "Room 1 made up as two single beds"],
    ["images/back-volumes.webp",          "The white volumes at the back of the house"],
    ["images/stone-facade.webp",          "The stone wall outside Room 1, herbs in the trough"],
    ["images/copper-cauldron.webp",       "The old copper cauldron, gone green with age"]
  ];
  var homeGal = $("#gal");
  if (homeGal) buildGallery(homeGal, HOME_PHOTOS);

  /* --------------------------------------------------- room galleries -- */
  function initRoom(scope) {
    var data = $(".roomphotos", scope);
    var gal = $(".roomgal", scope);
    if (data && gal) buildGallery(gal, JSON.parse(data.textContent));
    initForm(scope);
  }

  /* -------------------------------------------------- the request form -- */
  function initForm(scope) {
    var form = $(".reqform", scope);
    if (!form) return;
    var sent = $(".sent", scope);
    var sentText = $(".sent__fallback", scope);
    var copyBtn = $(".copyBtn", scope);

    function setErr(input, msg) {
      var field = input.closest(".field");
      field.classList.toggle("field--err", !!msg);
      $(".err", field).textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    form.addEventListener("input", function (e) {
      if (e.target.closest(".field--err")) setErr(e.target, "");
    });

    function pretty(d) {
      if (!d) return "";
      var p = d.split("-");
      if (p.length !== 3) return d;
      var M = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      return Number(p[2]) + " " + M[Number(p[1]) - 1] + " " + p[0];
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var ok = true;
      if (!f.name.value.trim()) { setErr(f.name, "Please tell us your name"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { setErr(f.email, "We need an email to reply to"); ok = false; }
      if (!f.from.value) { setErr(f.from, "Which day do you arrive?"); ok = false; }
      if (!f.to.value) { setErr(f.to, "And which day do you leave?"); ok = false; }
      if (f.from.value && f.to.value && f.to.value <= f.from.value) { setErr(f.to, "This needs to be after your arrival"); ok = false; }
      var g = Number(f.guests.value);
      if (!g || g < 1) { setErr(f.guests, "How many of you?"); ok = false; }
      if (!ok) { $(".field--err input", form).focus(); return; }

      var room = form.dataset.room;
      var lines = [
        "Hello Aguglia Persa,",
        "",
        "I would like to ask about staying in " + room + ".",
        "",
        "Arriving:  " + pretty(f.from.value),
        "Leaving:   " + pretty(f.to.value),
        "Guests:    " + g,
        "",
        f.message.value.trim() ? f.message.value.trim() + "\n" : "",
        "Thank you,",
        f.name.value.trim(),
        f.email.value.trim()
      ].filter(function (l, i) { return l !== "" || i < 12; });

      var bodyText = lines.join("\n");
      var subject = "Booking request — " + room + " — " + pretty(f.from.value);
      var href = "mailto:info@agugliapersa.com?subject=" + encodeURIComponent(subject) +
                 "&body=" + encodeURIComponent(bodyText);

      sentText.textContent = "To: info@agugliapersa.com\nSubject: " + subject + "\n\n" + bodyText;
      sent.classList.add("on");
      form.style.display = "none";
      sent.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      window.location.href = href;
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var t = sentText.textContent;
        var done = function () {
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = "Copy the message"; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(done, function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = t; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (err) {}
          document.body.removeChild(ta);
        }
      });
    }
  }

  /* keep the floating button off the footer text */
  var foot = document.querySelector(".site-foot");
  if (fab && foot && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { fab.classList.toggle("hide", e.isIntersecting); });
    }, { threshold: 0.15 }).observe(foot);
  }

  /* ------------------------------------------------- click-to-load map -- */
  $$(".mapbox").forEach(function (box) {
    var btn = $(".mapBtn", box);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = box.dataset.src;
      f.title = "Map showing Aguglia Persa near Testa dell'Acqua, Noto";
      f.loading = "lazy";
      f.allowFullscreen = true;
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.innerHTML = "";
      box.appendChild(f);
      box.classList.add("on");
    });
  });

  var pages = $$(".page");
  if (pages.length) pages.forEach(initRoom); else initRoom(document);
})();
