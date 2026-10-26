/* Hanover Park 24/7 Plumbing - site.js (no dependencies). Breakpoint 768px matches main.css. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;

  /* mobile drawer */
  var btn = doc.querySelector(".menu-btn");
  var drawer = doc.getElementById("mob-drawer");
  var overlay = doc.querySelector(".mob-overlay");
  var closeBtn = doc.querySelector(".mob-close");
  function setDrawer(open) {
    if (!drawer || !btn) return;
    drawer.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    root.style.overflow = open ? "hidden" : "";
    if (open && closeBtn) closeBtn.focus();
    if (!open && btn) btn.focus();
  }
  if (btn && drawer) {
    drawer.setAttribute("aria-hidden", "true");
    btn.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });
    if (overlay) overlay.addEventListener("click", function () { setDrawer(false); });
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a") : null;
      if (a) { root.style.overflow = ""; drawer.classList.remove("open"); if (overlay) overlay.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) setDrawer(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 768 && drawer.classList.contains("open")) setDrawer(false); });
  }

  /* desktop dropdowns: keep aria-expanded in sync with hover/focus */
  var drops = doc.querySelectorAll(".has-drop");
  Array.prototype.forEach.call(drops, function (li) {
    var a = li.querySelector("a");
    if (!a) return;
    a.setAttribute("aria-haspopup", "true");
    a.setAttribute("aria-expanded", "false");
    li.addEventListener("mouseenter", function () { a.setAttribute("aria-expanded", "true"); });
    li.addEventListener("mouseleave", function () { a.setAttribute("aria-expanded", "false"); });
    li.addEventListener("focusin", function () { a.setAttribute("aria-expanded", "true"); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) a.setAttribute("aria-expanded", "false"); });
  });

  /* FAQ accordion: max-height toggle */
  var items = doc.querySelectorAll(".faq-item");
  Array.prototype.forEach.call(items, function (item) {
    var b = item.querySelector(".faq-q button");
    var panel = item.querySelector(".faq-a");
    if (!b || !panel) return;
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });
  window.addEventListener("resize", function () {
    Array.prototype.forEach.call(doc.querySelectorAll(".faq-q button[aria-expanded='true']"), function (b) {
      var p = b.closest(".faq-item").querySelector(".faq-a");
      if (p) p.style.maxHeight = p.scrollHeight + "px";
    });
  });

  /* floating call button hides while the footer is on screen so it never covers footer content */
  var fc = doc.querySelector(".float-call"), foot = doc.querySelector(".site-footer");
  if (fc && foot && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { fc.classList.toggle("hide", en[0].isIntersecting); }, { threshold: 0.05 }).observe(foot);
  }
})();
