/* EU AI Act disclosure widget (Art. 50).
 * Served by /api/widget.js?system_id=N — __SYSTEM_ID__ is substituted server-side.
 * Renders a small dismissible banner informing the user they are
 * interacting with an AI system, in the page's language when supported.
 */
(function () {
  "use strict";

  var SYSTEM_ID = "__SYSTEM_ID__";
  var script = document.currentScript;
  var base = script && script.src ? new URL(script.src).origin : "";
  var lang = (document.documentElement.lang || navigator.language || "en")
    .slice(0, 2)
    .toLowerCase();

  fetch(base + "/api/systems/" + SYSTEM_ID + "/disclosure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interaction_type: "chat", language: lang }),
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var banner = document.createElement("div");
      banner.setAttribute("role", "status");
      banner.setAttribute("aria-live", "polite");
      banner.style.cssText =
        "position:fixed;bottom:16px;left:16px;right:16px;max-width:480px;" +
        "margin:0 auto;z-index:2147483647;background:#1a1a2e;color:#f0f0f5;" +
        "border:1px solid #4a4a6a;border-radius:10px;padding:12px 40px 12px 16px;" +
        "font:14px/1.45 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35)";

      var text = document.createElement("span");
      text.textContent = "ⓘ " + d.disclosure_text + " (" + d.legal_basis + ")";
      banner.appendChild(text);

      var close = document.createElement("button");
      close.textContent = "×";
      close.setAttribute("aria-label", "Dismiss");
      close.style.cssText =
        "position:absolute;top:6px;right:10px;background:none;border:none;" +
        "color:inherit;font-size:20px;cursor:pointer;padding:4px";
      close.addEventListener("click", function () { banner.remove(); });
      banner.appendChild(close);

      document.body.appendChild(banner);
    })
    .catch(function () { /* never break the host page */ });
})();
