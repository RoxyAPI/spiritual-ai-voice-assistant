/**
 * Serves the widget loader at `/embed.js` from a Route Handler (the idiomatic
 * Next.js way to emit a generated asset at a clean path, same pattern as
 * `app/rss.xml/route.ts`). `force-static` makes it a build-time static asset, so
 * it is CDN-cacheable with zero per-request compute.
 *
 * The loader itself must be plain browser JS: it runs on a third-party host page
 * (which is not a Next app) to inject the floating launcher and the iframe to
 * `/widget`. Sites that do not want a launcher can skip this entirely and embed
 * `<iframe src="/widget" allow="microphone">` directly. See README "Embed".
 */
export const dynamic = "force-static";

const LOADER = `(function () {
  "use strict";
  if (window.__roxyVoiceWidgetLoaded) return;
  window.__roxyVoiceWidgetLoaded = true;

  function resolveScript() {
    var el = document.currentScript;
    if (!el || !el.src) {
      var scripts = document.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        if ((scripts[i].src || "").indexOf("/embed.js") !== -1) { el = scripts[i]; break; }
      }
    }
    var origin = el && el.src ? new URL(el.src).origin : window.location.origin;
    return { el: el, origin: origin };
  }

  var info = resolveScript();
  var origin = info.origin;
  var data = (info.el && info.el.dataset) || {};
  var position = data.position === "bottom-left" ? "bottom-left" : "bottom-right";
  var accent = data.accent || "#14b8a6";
  var label = data.label || "Ask the stars";
  var side = position === "bottom-left" ? "left" : "right";

  var style = document.createElement("style");
  style.textContent =
    ".roxy-va-btn{position:fixed;bottom:20px;" + side + ":20px;z-index:2147483000;" +
    "width:60px;height:60px;border-radius:9999px;border:none;cursor:pointer;" +
    "background:" + accent + ";color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.28);" +
    "display:flex;align-items:center;justify-content:center;transition:transform .15s ease;}" +
    ".roxy-va-btn:hover{transform:scale(1.05);}" +
    ".roxy-va-btn svg{width:26px;height:26px;}" +
    ".roxy-va-panel{position:fixed;bottom:92px;" + side + ":20px;z-index:2147483000;" +
    "width:390px;max-width:calc(100vw - 32px);height:620px;max-height:calc(100vh - 120px);" +
    "border-radius:16px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.4);" +
    "border:1px solid rgba(255,255,255,.1);display:none;background:#050510;}" +
    ".roxy-va-panel iframe{width:100%;height:100%;border:0;display:block;}" +
    "@media (max-width:480px){.roxy-va-panel{width:calc(100vw - 24px);height:calc(100vh - 100px);" + side + ":12px;bottom:84px;}}";
  document.head.appendChild(style);

  var micSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>' +
    '<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>' +
    '<line x1="12" y1="19" x2="12" y2="22"></line></svg>';

  var btn = document.createElement("button");
  btn.className = "roxy-va-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.setAttribute("aria-expanded", "false");
  btn.title = label;
  btn.innerHTML = micSvg;

  var panel = null;
  var open = false;

  function ensurePanel() {
    if (panel) return;
    panel = document.createElement("div");
    panel.className = "roxy-va-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Spiritual voice assistant");
    var iframe = document.createElement("iframe");
    iframe.src = origin + "/widget";
    iframe.allow = "microphone";
    iframe.title = "Spiritual voice assistant";
    panel.appendChild(iframe);
    document.body.appendChild(panel);
  }

  function setOpen(next) {
    open = next;
    if (open) ensurePanel();
    if (panel) panel.style.display = open ? "flex" : "none";
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", function () { setOpen(!open); });

  window.addEventListener("message", function (event) {
    if (event.origin !== origin) return;
    if (event.data && event.data.type === "roxy-voice:close") setOpen(false);
  });

  function mount() { document.body.appendChild(btn); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();`;

export function GET() {
  return new Response(LOADER, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
