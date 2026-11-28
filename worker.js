const encode = new TextEncoder();
// Signing key, set from the OR_TORAH_GATE_KEY secret at the start of each request.
let gateKey = "";
const adminCookie = "__Host-or_torah_admin";
const gateLifetime = 7 * 86400;
const accessEmail = "Yoelassuid@gmail.com";
const siteName = "שיעורי דעת ויראת השם";
const mailLink = `mailto:${accessEmail}?subject=${encodeURIComponent("בקשת גישה ל" + siteName)}`;

const siteStyles = `
:root {
  color-scheme: dark;
  --bg: #0e1826;
  --bg2: #142235;
  --surface: #182940;
  --surface2: #1f3550;
  --line: #2e4561;
  --text: #f5f0e6;
  --muted: #aebccc;
  --gold: #d9b36c;
  --gold2: #f1d59b;
  --ok: #7fd1a0;
  --warn: #f0b27a;
  --bad: #ff9d8f;
  --display: "Frank Ruhl Libre","David Libre",David,Georgia,"Times New Roman",serif;
  --radius: 14px;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(1200px 500px at 50% -150px,#1d3350 0,var(--bg) 70%) no-repeat, var(--bg); color: var(--text); font: 17px/1.7 system-ui,-apple-system,"Segoe UI",Arial,sans-serif; }
main { flex: 1; width: 100%; }
.shell { width: min(1040px, calc(100% - 40px)); margin-inline: auto; }
h1,h2,h3 { font-family: var(--display); line-height: 1.25; margin: 0 0 14px; }
h1 { font-size: clamp(2rem,6vw,3.2rem); font-weight: 700; }
h2 { font-size: 1.45rem; margin-block-start: 30px; }
p { color: var(--muted); margin: 0 0 14px; }
a { color: var(--gold); text-underline-offset: .22em; }
button,input,select { font: inherit; }
:focus-visible { outline: 3px solid var(--gold2); outline-offset: 3px; }
ul { list-style: none; margin: 0; padding: 0; }

/* header */
.header { position: sticky; top: 0; z-index: 5; background: #0b1420ee; backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.nav { min-height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.brand { white-space: nowrap; display: inline-flex; align-items: center; gap: 10px; font: 700 1.55rem var(--display); color: var(--gold2); text-decoration: none; }
.brand-mark { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(145deg,var(--gold2),var(--gold)); color: #1c2430; font: 700 1.3rem var(--display); }
.nav-links { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.nav-link { color: var(--text); text-decoration: none; padding: 8px 12px; border-radius: 10px; background: none; border: 0; cursor: pointer; font-size: .95rem; }
.nav-link:hover { background: var(--surface); }
.nav-home { border: 1px solid var(--gold); color: var(--gold2); font-weight: 700; }
.back-row { margin: 0 0 14px; }
.nav-links form { margin: 0; display: block; }

/* buttons */
.button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 10px 20px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface2); color: var(--text); text-decoration: none; font-weight: 700; line-height: 1.3; cursor: pointer; }
.button:hover { background: #274260; }
.button.gold { background: linear-gradient(145deg,var(--gold2),var(--gold)); color: #1c2430; border-color: transparent; }
.button.gold:hover { filter: brightness(1.07); }
.button.small { min-height: 40px; padding: 6px 14px; font-size: .92rem; }
.button.danger { border-color: #7a3b3b; color: var(--bad); background: #2a1a20; }
.nav .button { min-height: 40px; padding: 6px 16px; }

/* forms */
form { margin: 0; }
label { display: grid; gap: 6px; font-weight: 600; }
input,select { width: 100%; min-height: 48px; padding: 10px 14px; color: var(--text); background: #0f1c2d; border: 1px solid var(--line); border-radius: 12px; font-size: 16px; }
input::placeholder { color: #8397ad; }
input[type=file] { padding: 10px; }
.form-grid { display: grid; gap: 16px; }
.searchbar { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: end; margin-block: 8px 24px; }
.searchbar.with-select { grid-template-columns: 2fr 1fr auto; }
.searchbar label { font-size: .9rem; color: var(--muted); }

/* panels */
.panel { padding: clamp(18px,3vw,28px); background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.panel > :last-child { margin-bottom: 0; }
.stack { max-width: 720px; }
.breadcrumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: var(--muted); margin-block-end: 16px; font-size: .95rem; }
.breadcrumbs a { color: var(--gold); }
.section-top { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-block-start: 8px; }
.empty-state { text-align: center; padding-block: 36px; }
.empty-state p { margin: 0; }

/* hero (home) */
.hero { padding-block: 44px 8px; max-width: 760px; }
.hero h1 strong { display: block; color: var(--gold); }
.hero p { font-size: 1.1rem; }
.page-main { padding-block: 28px 56px; }

/* category cards */
.folder-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 14px; }
.folder-grid > li { display: flex; min-width: 0; }
@media (max-width: 900px) { .folder-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .folder-grid { grid-template-columns: minmax(0, 1fr); } }
.folder-card { display: flex; flex: 1; align-items: center; gap: 14px; min-height: 92px; min-width: 0; padding: 16px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); color: var(--text); text-decoration: none; font-weight: 700; overflow-wrap: anywhere; transition: transform .12s, border-color .12s, background .12s; }
.folder-card:hover { transform: translateY(-2px); border-color: var(--gold); background: var(--surface2); }
.folder-card .folder-name { flex: 1; min-width: 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.folder-card .badge { flex: none; min-width: 2.2em; text-align: center; }
.folder-icon { width: 44px; height: 44px; border-radius: 12px; background: #11233a; display: grid; place-items: center; color: var(--gold); flex: none; }
.folder-icon svg { width: 24px; height: 24px; }
.folder-arrow { color: var(--gold); font-size: 1.5rem; flex: none; }

/* lessons */
.lesson-list { display: grid; gap: 10px; }
.lesson-card { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); color: var(--text); text-decoration: none; }
a.lesson-card:hover { border-color: var(--gold); background: var(--surface2); }
.lesson-main { display: grid; gap: 4px; min-width: 0; }
.lesson-title { font-size: 1.1rem; font-weight: 700; line-height: 1.5; overflow-wrap: anywhere; }
.lesson-title a { color: var(--text); text-decoration: none; }
.lesson-title a:hover { color: var(--gold2); }
.lesson-meta { color: var(--muted); font-size: .9rem; }
.lesson-badges { display: flex; gap: 6px; flex: none; flex-wrap: wrap; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: .8rem; font-weight: 700; letter-spacing: .02em; background: #223c59; color: var(--gold2); border: 1px solid #35557a; }
.badge.muted { background: transparent; color: var(--muted); border-color: var(--line); font-weight: 500; }
.badge.warn { background: #3a2a1b; color: var(--warn); border-color: #6b4a2a; }
.badge.ok { background: #1a3328; color: var(--ok); border-color: #2f5f47; }
.pagination { display: flex; flex-wrap: wrap; gap: 12px; margin-block-start: 22px; }

/* course page */
.course-head { margin-block-end: 22px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.views { color: var(--muted); font-size: .92rem; margin-inline-start: 6px; }
.course-head .badge { margin-inline-end: 6px; }
.player-grid { display: grid; gap: 18px; max-width: 880px; }
.player-card { padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.player-card h2 { margin: 0 0 12px; font-size: 1.2rem; }
.player-card video { width: 100%; display: block; aspect-ratio: 16/9; background: #000; border-radius: 10px; }
.audio-bar { position: fixed; inset-inline: 0; bottom: 0; z-index: 20; display: grid; grid-template-columns: auto 1fr; grid-template-areas: "play title" "progress progress" "controls controls"; align-items: center; gap: 6px 14px; padding: 10px max(16px, calc((100% - 1040px) / 2)) calc(10px + env(safe-area-inset-bottom)); background: #0b1626f2; backdrop-filter: blur(10px); border-top: 1px solid var(--line); box-shadow: 0 -10px 30px #0008; }
.audio-bar[hidden] { display: none; }
.ab-play { grid-area: play; width: 52px; height: 52px; border-radius: 50%; border: 0; background: linear-gradient(145deg,var(--gold2),var(--gold)); color: #1c2430; font-size: 1.3rem; cursor: pointer; }
.ab-title { grid-area: title; font-weight: 700; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-width: 0; }
.ab-controls { grid-area: controls; display: flex; gap: 8px; justify-content: space-between; }
.ab-controls .ab-btn { flex: 1; }
.ab-btn { min-width: 44px; min-height: 40px; padding: 4px 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface2); color: var(--text); font-weight: 700; cursor: pointer; }
.ab-btn:hover { border-color: var(--gold); }
.ab-progress { grid-area: progress; display: flex; align-items: center; gap: 10px; }
.ab-time { font-variant-numeric: tabular-nums; color: var(--muted); font-size: .85rem; min-width: 3.2em; text-align: center; }
.ab-slider { flex: 1; min-height: 0; height: 24px; padding: 0; background: none; border: 0; accent-color: var(--gold); }
.has-audio-bar main { padding-block-end: 190px; }
.resume { margin-block: 0 12px; }
.video-wrap { position: relative; }
.video-logo { position: absolute; top: 10px; right: 10px; width: clamp(180px, 34%, 340px); height: auto; opacity: .97; pointer-events: none; z-index: 2; }
.video-wrap { background: #000; border-radius: 10px; overflow: hidden; }
.video-wrap.custom-fs video::-webkit-media-controls-fullscreen-button { display: none; }
.vfs-btn { position: absolute; top: 10px; left: 10px; z-index: 3; width: 42px; height: 42px; border-radius: 10px; border: 1px solid #ffffff44; background: #000a; color: #fff; font-size: 1.25rem; cursor: pointer; }
.video-wrap.is-fs { position: fixed; inset: 0; z-index: 1000; width: 100%; height: 100%; border-radius: 0; display: flex; align-items: center; justify-content: center; }
.video-wrap.is-fs video { width: 100%; height: 100%; aspect-ratio: auto; object-fit: contain; }
.video-wrap.is-fs .video-logo { width: clamp(240px, 29vw, 640px); top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right)); }
.video-wrap.is-fs .vfs-btn { top: max(16px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left)); }
.video-wrap:fullscreen { width: 100%; height: 100%; border-radius: 0; display: flex; align-items: center; justify-content: center; }
.video-wrap:fullscreen video { width: 100%; height: 100%; aspect-ratio: auto; object-fit: contain; }
.video-wrap:fullscreen .video-logo { width: clamp(240px, 29vw, 640px); top: 16px; right: 16px; }
.video-wrap:fullscreen .vfs-btn { top: 16px; left: 16px; }
.video-wrap:-webkit-full-screen { width: 100%; height: 100%; border-radius: 0; }
.video-wrap:-webkit-full-screen video { width: 100%; height: 100%; aspect-ratio: auto; object-fit: contain; }
.video-wrap:-webkit-full-screen .video-logo { width: clamp(240px, 29vw, 640px); top: 16px; right: 16px; }
body.fs-lock { overflow: hidden; }
.cover-art { display: block; width: 112px; height: 112px; object-fit: cover; border-radius: 12px; border: 1px solid var(--line); margin-block-end: 14px; }
.brand-preview { max-width: 100%; border-radius: 12px; border: 1px solid var(--line); background: repeating-conic-gradient(#2a3a50 0 25%, #1c2a3c 0 50%) 0 0 / 20px 20px; }
.brand-preview.cover { width: 160px; height: 160px; object-fit: cover; }
.brand-preview.logo { max-height: 120px; }
.player-card audio { width: 100%; display: block; }
.player-actions { margin-block-start: 14px; }

/* notices */
.notice { padding: 12px 16px; border-radius: 12px; margin: 0 0 18px; background: #173326; color: var(--ok); border: 1px solid #2f5f47; }
.notice.error { background: #3a1f24; color: var(--bad); border-color: #7a3b3b; }
.notice.info { background: var(--surface); color: var(--muted); border-color: var(--line); }

/* admin */
.admin-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-block-end: 8px; }
.stats { display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: 12px; margin-block: 18px; }
.stat { padding: 14px 16px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.stat b { display: block; font: 700 1.9rem var(--display); color: var(--gold2); line-height: 1.2; }
.stat span { color: var(--muted); font-size: .9rem; }
.stat.warn b { color: var(--warn); }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-block: 16px; }
.filters { display: flex; gap: 8px; flex-wrap: wrap; margin-block: 8px 16px; }
.filters a { padding: 6px 14px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); text-decoration: none; font-size: .92rem; }
.filters a[aria-current=true] { background: var(--surface2); color: var(--gold2); border-color: var(--gold); }
.admin-row { display: grid; grid-template-columns: 1fr auto; align-items: start; gap: 10px 14px; }
.row-actions { justify-self: end; }
.danger-zone summary { color: var(--bad); }
.danger-zone form { margin-block-start: 10px; }
label.check { display: flex; align-items: center; gap: 10px; font-weight: 500; }
input[type=checkbox], input[type=radio] { width: 24px; height: 24px; min-height: 0; padding: 0; accent-color: var(--gold); background: #f5f0e6; border: 2px solid var(--gold); flex: none; }
.row-menu summary { cursor: pointer; color: var(--muted); font-size: .9rem; padding: 6px 4px; }
.row-menu { grid-column: 1 / -1; }
.row-menu[open] { padding-block-start: 6px; border-top: 1px solid var(--line); }
details.panel summary, details.help summary { cursor: pointer; font-weight: 700; }
details.help { margin-block-start: 26px; padding: 14px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
details.help ol { color: var(--muted); padding-inline-start: 22px; margin: 12px 0 0; }

/* access gate */
.gate-shell { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(22px,5vw,64px); align-items: center; margin-block: 40px; padding: clamp(24px,5vw,60px); border: 1px solid var(--line); border-radius: 22px; background: linear-gradient(135deg,#1d3350,#13243a 60%,#1b2a3d); box-shadow: 0 24px 60px #05101c66; }
.gate-shell h1 strong { color: var(--gold); display: block; }
.gate-card { background: #0f1c2d; border: 1px solid var(--line); border-radius: 16px; padding: clamp(18px,3vw,30px); }
.gate-card h2 { margin-block-start: 0; }
.gate-card input { text-align: center; letter-spacing: .4em; font-size: 22px; margin-block: 8px 14px; }
.gate-card .button { width: 100%; }
.gate-error { color: var(--bad); }

.row-select { width: min(240px, 100%); min-height: 44px; padding-block: 6px; }
.row-select.invalid { border-color: var(--bad); }
.picker { display: grid; gap: 8px; }
.picker.invalid select:first-child { border-color: var(--bad); }
.row-picker { display: flex; flex-wrap: wrap; gap: 6px; width: min(480px, 100%); }
.row-picker > * { flex: 1 1 130px; min-width: 0; }
.row-picker select, .row-picker input { min-height: 40px; padding-block: 4px; font-size: 15px; }
.refresh-box { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-block: 14px; }
.refresh-box span, .refresh-line span { color: var(--muted); font-size: .95rem; }
.refresh-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-block: 0 12px; }
.dropzone { border: 2px dashed var(--line); border-radius: var(--radius); padding: 24px; text-align: center; color: var(--muted); }
.dropzone.over { border-color: var(--gold); background: var(--surface2); }
.site-footer { border-top: 1px solid var(--line); padding-block: 22px 30px; color: var(--muted); font-size: .9rem; text-align: center; }

@media (max-width: 680px) {
  body { font-size: 16.5px; }
  .shell { width: calc(100% - 28px); }
  .gate-shell { grid-template-columns: 1fr; margin-block: 18px; }
  .searchbar, .searchbar.with-select { grid-template-columns: 1fr; }
  .searchbar .button { width: 100%; }
  .lesson-card { flex-direction: column; align-items: flex-start; gap: 10px; }
  .admin-row { grid-template-columns: 1fr; }
  .row-actions { justify-self: start; }
  .nav { flex-wrap: wrap; padding-block: 8px; row-gap: 4px; }
  .nav-links { width: 100%; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 4px; }
  .nav-links:empty { display: none; }
  .nav-link { padding: 8px 6px; }
  .stats { grid-template-columns: repeat(3,1fr); gap: 8px; }
  .stat { padding: 10px 12px; }
  .stat b { font-size: 1.5rem; }
  .stat span { font-size: .8rem; }
  .brand { font-size: 1.3rem; }
  .player-card { padding: 14px; }
}
`;

const siteFooter = `<footer class="shell site-footer">${siteName} · הרב נתן רוטמן</footer>`;

const security = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "strict-origin",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
};

function json(message, status = 200) {
  return Response.json({ message }, { status, headers: security });
}

const hex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
const hash = async (input) => hex(await crypto.subtle.digest("SHA-256", encode.encode(input)));

const brandHtml = `<a class="brand" href="/">${siteName}</a>`;

async function gateSignature(value, signature) {
  const key = await crypto.subtle.importKey("raw", encode.encode(gateKey), {name: "HMAC", hash: "SHA-256"}, false, ["sign", "verify"]);
  if (signature) {
    const bytes = Uint8Array.from(signature.match(/../g), byte => parseInt(byte, 16));
    return crypto.subtle.verify("HMAC", key, bytes, encode.encode(value));
  }
  return hex(await crypto.subtle.sign("HMAC", key, encode.encode(value)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
}

const esc = escapeHtml;
const redirect = (location) => new Response(null, {status:303, headers:{...security, Location:location}});
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS category_access (folder TEXT PRIMARY KEY, mode TEXT NOT NULL, code_hash TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS catalogue (folder TEXT NOT NULL, gen TEXT NOT NULL, code TEXT NOT NULL, title TEXT NOT NULL, trail TEXT NOT NULL, solo INTEGER NOT NULL DEFAULT 0, dir TEXT NOT NULL, audio_key TEXT, audio_id TEXT, video_key TEXT, video_id TEXT, video_extra TEXT, PRIMARY KEY (folder, gen, code))"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS catalogue_meta (folder TEXT PRIMARY KEY, gen TEXT NOT NULL, updated INTEGER NOT NULL, count INTEGER NOT NULL, notes TEXT NOT NULL DEFAULT '[]', sig TEXT NOT NULL DEFAULT '')"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS catalogue_state (k TEXT PRIMARY KEY, v TEXT NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS course_views (folder TEXT NOT NULL, course_id TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (folder, course_id))"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS site_assets (name TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS category_attempts (k TEXT PRIMARY KEY, period INTEGER NOT NULL, tries INTEGER NOT NULL)")
  ]);
  try { await env.DB.prepare("ALTER TABLE catalogue ADD COLUMN video_extra TEXT").run(); } catch {}
  schemaReady = true;
}

async function accessRules(env) {
  const {results} = await env.DB.prepare("SELECT folder, mode, code_hash FROM category_access").all();
  return new Map(results.map(row => [row.folder, row]));
}

const categoryHash = (folder, code) => gateSignature(`category:${folder}:${code}`);
const categoryCookieName = async folder => "__Host-ot_c_" + (await hash(folder)).slice(0, 16);

async function categoryOpen(request, origin, rule, folder) {
  if (!rule) return false;
  if (rule.mode === "public") return true;
  if (!rule.code_hash) return false;
  const name = await categoryCookieName(folder);
  const value = request.headers.get("Cookie")?.split(/;\s*/).find(part => part.startsWith(name + "="))?.slice(name.length + 1);
  const m = /^(\d{10})\.([a-f0-9]{64})$/.exec(value ?? "");
  return Boolean(m && Number(m[1]) > Math.floor(Date.now() / 1000) && await gateSignature(`cat:${origin}:${folder}:${rule.code_hash}:${m[1]}`, m[2]));
}

function codePrompt(folder, error = "", status = 200) {
  return layout(folder, `<div class="panel stack">${error ? notice(error, "error") : ""}<p>קטגוריה זו מוגנת בקוד.</p>
    <form class="form-grid" method="post" action="/access/category"><input type="hidden" name="folder" value="${esc(folder)}">
    <label>קוד גישה<input type="password" name="code" autocomplete="off" maxlength="12" dir="ltr" required></label>
    <button class="button gold">כניסה</button></form>
    <p style="margin-block:16px 0">אין לכם קוד? <a href="${mailLink}">בקשת גישה בדוא״ל</a></p></div>`, status,
    {before: '<nav class="breadcrumbs" aria-label="מיקום בספרייה"><a href="/">הספרייה</a></nav>'});
}

async function enterCategory(request, env, url) {
  if (request.headers.get("Origin") !== url.origin) return new Response(null, {status: 403, headers: security});
  if (Number(request.headers.get("Content-Length")) > 1024) return new Response(null, {status: 413, headers: security});
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "");
  const code = String(form?.get("code") ?? "");
  const rule = (await accessRules(env)).get(folder);
  if (!rule || rule.mode !== "code" || !rule.code_hash) return layout("התיקייה לא נמצאה", '<a href="/">חזרה לספרייה</a>', 404);
  const key = await hash((request.headers.get("CF-Connecting-IP") ?? "") + "|" + folder);
  const period = Math.floor(Date.now() / 900000);
  const limit = await env.DB.prepare(`INSERT INTO category_attempts (k,period,tries) VALUES (?,?,1)
    ON CONFLICT(k) DO UPDATE SET tries=CASE WHEN period=excluded.period THEN tries+1 ELSE 1 END, period=excluded.period
    WHERE period<>excluded.period OR tries<8 RETURNING tries`).bind(key, period).first();
  if (!limit) return codePrompt(folder, "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.", 429);
  if (await categoryHash(folder, code) !== rule.code_hash) return codePrompt(folder, "קוד הגישה שגוי.", 401);
  await env.DB.prepare("DELETE FROM category_attempts WHERE k = ?").bind(key).run();
  const expires = Math.floor(Date.now() / 1000) + gateLifetime;
  const sig = await gateSignature(`cat:${url.origin}:${folder}:${rule.code_hash}:${expires}`);
  return new Response(null, {status: 303, headers: {...security, Location: backblazeCourseLink(folder),
    "Set-Cookie": `${await categoryCookieName(folder)}=${expires}.${sig}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${gateLifetime}`}});
}

async function saveCategoryAccess(request, env) {
  if (Number(request.headers.get("Content-Length")) > 4096) return json("בקשה גדולה מדי", 413);
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "").trim();
  const mode = form?.get("mode");
  const code = String(form?.get("code") ?? "").trim();
  const bad = text => layout("לא ניתן לשמור", notice(text, "error") + '<p><a class="button" href="/admin">חזרה לניהול</a></p>', 400, {admin: true});
  if (!folder || folder === "." || folder === ".." || folder.length > 120 || /[/\\\x00-\x1f\x7f]/.test(folder)) return bad("שם הקטגוריה אינו תקין.");
  if (mode !== "public" && mode !== "code") return bad("יש לבחור ציבורית או מוגנת בקוד.");
  if (code && !/^\S{4,12}$/.test(code)) return bad("הקוד חייב להכיל 4 עד 12 תווים, בלי רווחים.");
  const current = await env.DB.prepare("SELECT code_hash FROM category_access WHERE folder = ?").bind(folder).first();
  let codeHash = null;
  if (mode === "code") {
    codeHash = code ? await categoryHash(folder, code) : current?.code_hash ?? null;
    if (!codeHash) return bad("יש להגדיר קוד לקטגוריה מוגנת.");
  }
  await env.DB.prepare("INSERT INTO category_access (folder, mode, code_hash) VALUES (?,?,?) ON CONFLICT(folder) DO UPDATE SET mode=excluded.mode, code_hash=excluded.code_hash").bind(folder, mode, codeHash).run();
  return redirect(adminHref({folder, saved: 1}));
}

function accessStatus(rule) {
  return !rule ? ["לא הוגדרה", "warn", "לא הוגדרה: הקטגוריה מוסתרת מהאתר"]
    : rule.mode === "public" ? ["ציבורית", "ok", "ציבורית: פתוחה לכולם"] : ["בקוד", "", "מוגנת בקוד"];
}

function accessPanel(folder, rule) {
  const mode = rule?.mode ?? "";
  return `<details class="help"${rule ? "" : " open"}><summary>גישה לקטגוריה · ${accessStatus(rule)[2]}</summary>
    <form class="form-grid" method="post" action="/admin/category-access" style="margin-block-start:14px"><input type="hidden" name="folder" value="${esc(folder)}">
    <label class="check"><input type="radio" name="mode" value="public"${mode === "public" ? " checked" : ""} required> ציבורית (פתוחה לכולם)</label>
    <label class="check"><input type="radio" name="mode" value="code"${mode === "code" ? " checked" : ""}> מוגנת בקוד</label>
    <label>קוד לקטגוריה (4 עד 12 תווים)<input name="code" maxlength="12" dir="ltr" autocomplete="off" placeholder="${rule?.mode === "code" ? "השאירו ריק כדי לשמור את הקוד הנוכחי" : ""}"></label>
    <button class="button gold">שמירה</button></form></details>`;
}

const addCategoryPanel = '<details class="help"><summary>+ הוספת קטגוריה חדשה</summary><form class="form-grid" method="post" action="/admin/category-access" style="margin-block-start:14px"><label>שם הקטגוריה<input name="folder" maxlength="120" required></label><label class="check"><input type="radio" name="mode" value="public" required> ציבורית (פתוחה לכולם)</label><label class="check"><input type="radio" name="mode" value="code"> מוגנת בקוד</label><label>קוד לקטגוריה (4 עד 12 תווים, אם מוגנת)<input name="code" maxlength="12" dir="ltr" autocomplete="off"></label><p>אחרי היצירה, העלו את השיעורים לתיקייה בעלת אותו שם ב־Backblaze, או דרך ״הוספת שיעור״.</p><button class="button gold">יצירת הקטגוריה</button></form></details>';

function layout(title, content, status = 200, opts = {}) {
  const logout = '<form method="post" action="/admin/logout"><button class="nav-link">יציאה</button></form>';
  const nav = opts.admin
    ? `<a class="nav-link nav-home" href="/admin">ניהול</a><a class="nav-link" href="/admin?add=multi">הוספת שיעורים</a><a class="nav-link" href="/">לאתר</a>${logout}`
    : opts.bare ? "" : '<a class="nav-link" href="/">הספרייה</a>';
  const script = opts.script ? [].concat(opts.script).map(src => `<script src="${src}" defer></script>`).join("") : "";
  const heading = opts.heading === false ? "" : `<h1>${esc(title)}</h1>`;
  const backLink = opts.admin && opts.before === undefined && title !== "ניהול הספרייה"
    ? '<p class="back-row"><a class="button small" href="/admin">← חזרה לניהול</a></p>' : "";
  return new Response(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title === siteName ? title : title + " | " + siteName)}</title><link rel="stylesheet" href="/style.css"></head><body><header class="header"><div class="shell nav">${brandHtml}<nav class="nav-links" aria-label="ניווט ראשי">${nav}</nav></div></header><main class="shell page-main">${opts.before ?? backLink}${heading}${content}</main>${siteFooter}${script}</body></html>`,
  {status,headers:{...security,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; style-src 'self' 'unsafe-inline'; media-src 'self'; img-src 'self' data: blob:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" + (opts.script ? "; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; connect-src 'self' https://*.backblaze.com https://*.backblazeb2.com" : "")}});
}

const notice = (text, type = "ok") => `<p class="notice ${type}" role="${type === "error" ? "alert" : "status"}">${esc(text)}</p>`;
const badges = (audio, video, parts = 0) => `${audio ? '<span class="badge">MP3</span>' : ""}${video ? `<span class="badge">MP4${parts > 1 ? " ×" + parts : ""}</span>` : ""}`;

function adminLogin(message = "", status = 200) {
  return layout("כניסה לניהול", `<div class="panel stack">${message ? notice(message, "error") : ""}<form class="form-grid" method="post" action="/admin/login"><label>קוד ניהול<input type="password" name="pin" inputmode="numeric" maxlength="4" autocomplete="current-password" dir="ltr" required></label><button class="button gold">כניסה</button></form></div>`, status, {bare: true});
}

async function adminAuthorized(request, origin) {
  const data = request.headers.get("Cookie")?.split(/;\s*/).find(item => item.startsWith(adminCookie+"="))?.slice(adminCookie.length+1);
  const m = /^(\d{10})\.([a-f0-9]{64})$/.exec(data ?? "");
  return Boolean(m && Number(m[1]) > Date.now()/1000 && await gateSignature(`admin:${origin}:${m[1]}`,m[2]));
}

// ---- fuzzy matching of folder names and titles (small spelling differences, title prefixes)
const markerWords = new Set(["mp3", "mp4", "audio", "video", "שמע", "וידאו", "וידיאו", "אודיו", "סרטון", "קלטת", "הקלטה"]);
const tokensOf = text => text.normalize("NFC").toLowerCase().replace(/[\u0591-\u05c7]/g, "").replace(/[\p{P}\p{S}_]+/gu, " ").split(/\s+/).filter(Boolean);
const titleTokens = text => tokensOf(text).filter(token => !markerWords.has(token));

function editDistance(a, b) {
  let previous = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    previous = row;
  }
  return previous[b.length];
}

// Same folder if the names are equal once punctuation/spaces/niqqud are ignored, or differ by a letter inside a long word.
function similarFolder(a, b) {
  if (a === b) return true;
  const x = tokensOf(a), y = tokensOf(b);
  if (x.join("") === y.join("")) return true;
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) {
    if (x[i] === y[i]) continue;
    if (x[i].length < 3 || y[i].length < 3 || /\d/.test(x[i] + y[i]) || (Math.min(x[i].length, y[i].length) < 4 && x.join("").length < 6)) return false;
    if (editDistance(x[i], y[i]) > (Math.max(x[i].length, y[i].length) >= 8 ? 2 : 1)) return false;
  }
  return true;
}

// Same word, or a one-letter spelling difference inside a longer word (ידים / ידיים).
const sameToken = (x, y) => x === y || (x.length >= 4 && y.length >= 4 && !/\d/.test(x + y) && editDistance(x, y) <= 1);
const prefixLetters = new Set(["ב", "ה", "ו", "ל", "כ", "מ", "ש"]);
const looseToken = (x, y) => sameToken(x, y) || (x.length >= 4 && prefixLetters.has(x[0]) && sameToken(x.slice(1), y)) || (y.length >= 4 && prefixLetters.has(y[0]) && sameToken(x, y.slice(1)));
const genericWords = new Set(["ביאור", "הלכות", "הלכה", "שיעור", "מצות", "פרק", "חלק", "המשך", "סימן", "פרשת", "הרב", "שמע"]);
const isIndexToken = token => token.length <= 3 && /^(?:[\u05d0-\u05ea]{1,3}|\d{1,3})$/.test(token);

// Two titles are "the same lesson" when:
//  - the shorter one is the beginning of the longer one (token by token), or
//  - both start with the same lesson number/letter (e.g. "ה") and the other words match: the shorter
//    ones appear in order inside the longer, or at least 60% of the words are shared.
// Video folders the owner asked never to be attached to an MP3 automatically (wrong matches).
const KEPT_APART = ["כ המשך דברים שבכתב סימן נ", "יט שוע סימן נ דברים שבכתב"];
const keptApart = course => KEPT_APART.some(name => (course.video?.key ?? "").normalize("NFC").includes(name));

function titleMatch(a, b) {
  const x = titleTokens(a), y = titleTokens(b);
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  // A title that is only the lesson number/letter (e.g. "נד") belongs to the one other title starting with it.
  if (short.length === 1 && long.length > 1 && short[0].length >= 2 && isIndexToken(short[0]) && short[0] === long[0]) return true;
  if (!short.length || short.join("").length < 4) return false;
  if (short.every((token, index) => sameToken(token, long[index] ?? ""))) return true;
  if (!isIndexToken(short[0]) || short[0] !== long[0]) return false;
  const rest = short.slice(1), pool = long.slice(1);
  if (!rest.length || rest.join("").length < 4) return false;
  // Same lesson number and a significant shared word (e.g. "זמנה"), without conflicting part markers (א / ב / 2).
  const smallsOf = list => list.filter(token => token.length <= 2);
  const sa = smallsOf(rest), sb = smallsOf(pool);
  const markersConflict = sa.length && sb.length && !sa.some(token => sb.includes(token));
  if (!markersConflict && rest.some(token => token.length >= 4 && !genericWords.has(token) && pool.some(other => looseToken(token, other)))) return true;
  let at = 0;
  for (const token of rest) { const found = pool.findIndex((candidate, index) => index >= at && sameToken(token, candidate)); if (found < 0) { at = -1; break; } at = found + 1; }
  if (at >= 0) return true;
  // Short tokens (א, ב, 2...) number the parts of a lesson: they must be identical for a loose match.
  const smalls = list => list.filter(token => token.length <= 2).sort().join("|");
  if (smalls(rest) !== smalls(pool)) return false;
  const used = new Set();
  let shared = 0;
  for (const token of rest) { const found = pool.findIndex((candidate, index) => !used.has(index) && sameToken(token, candidate)); if (found >= 0) { used.add(found); shared += 1; } }
  return shared / Math.max(rest.length, pool.length) >= 0.6;
}

const sameTitle = (a, b) => titleTokens(a).join(" ") === titleTokens(b).join(" ");
// Single candidate among those matching; when several match, the one with an identical title wins if it is the only one.
function uniqueCandidate(items, test, exact) {
  const hits = items.filter(test);
  if (hits.length <= 1) return hits[0];
  const exactHits = hits.filter(exact);
  return exactHits.length === 1 ? exactHits[0] : undefined;
}

// Canonical folder trail of every course: similar sibling folders are merged under the most common spelling.
function canonicalTrails(courses) {
  const raws = courses.map(course => course.folder.split("/").slice(1).filter(part => !isBatchId(part)));
  const canon = raws.map(() => []);
  const depth = Math.max(0, ...raws.map(trail => trail.length));
  for (let level = 0; level < depth; level++) {
    const groups = new Map();
    raws.forEach((trail, index) => {
      if (trail.length <= level) return;
      const parent = canon[index].join("/");
      const names = groups.get(parent) ?? new Map();
      const info = names.get(trail[level]) ?? {audio: 0, count: 0};
      info.count += 1;
      if (courses[index].audio) info.audio += 1;
      names.set(trail[level], info);
      groups.set(parent, names);
    });
    const choice = new Map();
    for (const [parent, names] of groups) {
      const clusters = [];
      for (const [name] of [...names].sort((a, b) => b[1].audio - a[1].audio || b[1].count - a[1].count || a[0].length - b[0].length || a[0].localeCompare(b[0], "he"))) {
        const hit = clusters.find(rep => similarFolder(rep, name));
        if (hit) choice.set(parent + "\0" + name, hit); else { clusters.push(name); choice.set(parent + "\0" + name, name); }
      }
    }
    raws.forEach((trail, index) => { if (trail.length > level) canon[index].push(choice.get(canon[index].join("/") + "\0" + trail[level])); });
  }
  return canon;
}

async function planImport(folder, storage) {
  const groups = new Map();
  const notes = [];
  let cursor;
  do {
    const page = await storage.list({prefix: `${folder}/`, cursor});
    for (const {key, etag} of page.objects) {
      const match = /^(.*\/)([^/]+)\.(mp3|mp4)$/i.exec(key);
      if (!match) continue;
      const [, directory, stem, extension] = match;
      // A camera-named video (00015.mp4) inside a lesson folder is a PART of that lesson: it takes the folder's name.
      let dir = directory, name = stem, part = null;
      if (extension.toLowerCase() === "mp4" && /^\d{3,6}$/.test(stem)) {
        const segments = directory.split("/").filter(Boolean);
        if (segments.length >= 2 && !isBatchId(segments[segments.length - 1])) {
          part = Number(stem);
          name = segments[segments.length - 1];
          dir = segments.slice(0, -1).join("/") + "/";
        }
      }
      const number = part === null ? /(?:^|[\s_\-[\u2013\u2014])([0-9]{5,14})\]?$/.exec(stem) : null;
      const identity = `${dir}${number ? number[1] : name.normalize("NFC").toLowerCase()}`;
      const pair = groups.get(identity) ?? {number: number?.[1], mp3: [], mp4: []};
      const separate = /\s*\[(?:נפרד|solo)\]\s*/i;
      const solo = separate.test(name);
      const shown = solo ? name.replace(separate, " ").trim() : name;
      const title = (number && !solo ? shown.slice(0, number.index).trim() : shown) || shown;
      pair[extension.toLowerCase()].push({key, etag, title, directory: dir, folderPath: dir.slice(0, -1), number: number?.[1], solo, part});
      groups.set(identity, pair);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const byTitle = new Map();
  for (const [identity, pair] of groups) {
    if (pair.mp3.length + pair.mp4.length !== 1) continue;
    const file = pair.mp3[0] ?? pair.mp4[0];
    if (file.solo) continue;
    const comma = file.title.indexOf(",");
    if (comma < 0) continue;
    const prefix = file.title.slice(0, comma).normalize("NFC").toLowerCase().trim().replace(/\s+/g, " ");
    if (prefix.length < 20 || prefix.split(" ").length < 4) continue;
    const key = file.directory + prefix;
    const candidates = byTitle.get(key) ?? {audio: [], video: []};
    candidates[pair.mp3.length ? "audio" : "video"].push({identity, pair, file});
    byTitle.set(key, candidates);
  }
  for (const {audio, video} of byTitle.values()) {
    if (!audio.length || !video.length) continue;
    if (audio.length !== 1 || video.length !== 1) {
      notes.push("נמצאו כמה קבצים עם אותה תחילת כותרת. בדקו את ההתאמה והוסיפו את הקבצים דרך טופס הניהול.");
      continue;
    }
    const [a] = audio;
    const [v] = video;
    if (a.file.number && v.file.number && a.file.number !== v.file.number) continue;
    a.pair.mp4.push(v.file);
    groups.delete(v.identity);
  }

  const courses = [];
  for (const [identity, pair] of groups) {
    const parts = pair.mp4.every(file => file.part !== null) ? [...pair.mp4].sort((a, b) => a.part - b.part) : pair.mp4;
    if (pair.mp3.length > 1 || (parts.length > 1 && parts.some(file => file.part === null))) {
      notes.push(`${identity} — נמצאו קבצים כפולים`);
      continue;
    }
    const [audio] = pair.mp3;
    const video = parts[0];
    const main = audio ?? video;
    const code = (await hash(identity)).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, "$1-$2-$3-$4-$5");
    courses.push({code, title: main.title, audio, video, videos: parts, solo: Boolean(main.solo), folder: main.folderPath ?? main.key.slice(0, main.key.lastIndexOf("/"))});
  }
  // Fuzzy pass: one MP3-only course and one MP4-only course in the same (similar) folder whose titles start the same are one lesson.
  const trails = canonicalTrails(courses);
  courses.forEach((course, index) => { course.trail = trails[index]; });
  const buckets = new Map();
  for (const course of courses) {
    if (course.solo || Boolean(course.audio) === Boolean(course.video)) continue;
    const key = course.trail.join("/");
    buckets.set(key, [...(buckets.get(key) ?? []), course]);
  }
  const merged = new Set();
  const compatible = (a, v) => !keptApart(v) && !(a.audio.number && v.video.number && a.audio.number !== v.video.number) && titleMatch(a.title, v.title);
  for (const list of buckets.values()) {
    const audios = list.filter(course => course.audio);
    const videos = list.filter(course => course.video);
    if (!audios.length || !videos.length) continue;
    for (const a of audios) {
      const v = uniqueCandidate(videos.filter(item => !merged.has(item)), item => compatible(a, item), item => sameTitle(a.title, item.title));
      if (!v || uniqueCandidate(audios.filter(item => !item.video), item => compatible(item, v), item => sameTitle(item.title, v.title)) !== a) continue;
      a.video = v.video;
      a.videos = v.videos;
      merged.add(v);
    }
  }
  // Same lesson number: in one folder, a single leftover MP3 and a single leftover MP4 that start with the same number/letters
  // (at least 2 characters, e.g. "נה") are the same lesson even when the rest of the titles differs.
  const byNumber = new Map();
  for (const course of courses) {
    if (course.solo || merged.has(course) || Boolean(course.audio) === Boolean(course.video) || keptApart(course)) continue;
    const first = titleTokens(course.title)[0];
    if (!first || first.length < 2 || !isIndexToken(first)) continue;
    const key = `${course.trail.join("/")}\u0000${first}`;
    byNumber.set(key, [...(byNumber.get(key) ?? []), course]);
  }
  for (const list of byNumber.values()) {
    const audios = list.filter(course => course.audio), videos = list.filter(course => course.video);
    if (audios.length !== 1 || videos.length !== 1) continue;
    if (audios[0].audio.number && videos[0].video.number && audios[0].audio.number !== videos[0].video.number) continue;
    audios[0].video = videos[0].video;
    audios[0].videos = videos[0].videos;
    merged.add(videos[0]);
  }
  // Second pass: same LAST folder name under a different path (e.g. הלכה/מועדים and הלכה/אורח חיים/מועדים).
  // Only identical/clearly matching titles, or the single leftover pair of that folder, are joined.
  const leafGroups = [];
  for (const course of courses) {
    if (course.solo || merged.has(course) || Boolean(course.audio) === Boolean(course.video) || !course.trail.length) continue;
    const leaf = course.trail[course.trail.length - 1];
    let group = leafGroups.find(entry => similarFolder(entry.leaf, leaf));
    if (!group) { group = {leaf, items: []}; leafGroups.push(group); }
    group.items.push(course);
  }
  const sharesWord = (a, b) => titleTokens(a).some(token => token.length >= 4 && !genericWords.has(token) && titleTokens(b).some(other => looseToken(token, other)));
  for (const {items} of leafGroups) {
    const audios = () => items.filter(course => course.audio && !course.video);
    const videos = () => items.filter(course => course.video && !course.audio && !merged.has(course));
    for (const a of audios()) {
      const v = uniqueCandidate(videos(), item => compatible(a, item), item => sameTitle(a.title, item.title));
      if (!v || uniqueCandidate(audios(), item => compatible(item, v), item => sameTitle(item.title, v.title)) !== a) continue;
      a.video = v.video;
      a.videos = v.videos;
      merged.add(v);
    }
    const left = audios(), right = videos();
    if (left.length === 1 && right.length === 1 && !keptApart(right[0]) && sharesWord(left[0].title, right[0].title)) {
      left[0].video = right[0].video;
      left[0].videos = right[0].videos;
      merged.add(right[0]);
    }
  }
  courses.splice(0, courses.length, ...courses.filter(course => !merged.has(course)));
  const counts = new Map();
  for (const course of courses) counts.set(course.code, (counts.get(course.code) ?? 0) + 1);
  const valid = courses.filter(course => {
    if (counts.get(course.code) === 1) return true;
    notes.push(`${(course.audio ?? course.video).key} — אותו קוד מופיע ביותר מתיקייה אחת`);
    return false;
  });
  valid.sort((a, b) => (a.audio ?? a.video).key.localeCompare((b.audio ?? b.video).key));
  return {courses: valid, notes, stamp: await hash(JSON.stringify(valid))};
}

async function admin(request, env, url) {
  const route = url.pathname;
  if (request.method === "POST" && request.headers.get("Origin") !== url.origin) return json("בקשה לא חוקית",403);
  if (route === "/admin/login" && request.method === "POST") {
    if (Number(request.headers.get("Content-Length")) > 1024) return json("בקשה גדולה מדי",413);
    const period = Math.floor(Date.now()/900000);
    const limit = await env.DB.prepare(`INSERT INTO import_pin_attempts (slot,period,tries) VALUES (1,?,1)
      ON CONFLICT(slot) DO UPDATE SET tries=CASE WHEN period=excluded.period THEN tries+1 ELSE 1 END, period=excluded.period
      WHERE period<>excluded.period OR tries<6 RETURNING tries`).bind(period).first();
    if (!limit) return adminLogin("יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.",429);
    const form = await request.formData().catch(() => null);
    if (!env.OR_TORAH_IMPORT_CODE || form?.get("pin") !== env.OR_TORAH_IMPORT_CODE) return adminLogin("קוד הניהול שגוי.",401);
    await env.DB.prepare("DELETE FROM import_pin_attempts WHERE slot=1 AND period=?").bind(period).run();
    const expires = Math.floor(Date.now()/1000)+28800;
    const sig = await gateSignature(`admin:${url.origin}:${expires}`);
    return new Response(null,{status:303,headers:{...security,Location:"/admin","Set-Cookie":`${adminCookie}=${expires}.${sig}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800`}});
  }
  if (!await adminAuthorized(request,url.origin)) return adminLogin();
  if (route === "/admin/logout" && request.method === "POST") {
    return new Response(null, {status:303, headers:{...security, Location:"/admin",
      "Set-Cookie":`${adminCookie}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`}});
  }
  if (!(backblazeKeyId(env) && env.B2_APPLICATION_KEY)) {
    return layout("ניהול הספרייה", '<p role="alert">Backblaze אינו מחובר. הוסיפו את B2_KEY_ID ו־B2_APPLICATION_KEY בהגדרות Cloudflare.</p>', 503);
  }
  if (route === "/admin/course-visibility" && request.method === "POST") return setCourseVisibility(request, env);
  if (route === "/admin/backblaze-upload" && request.method === "POST") return addBackblazeCourse(request, env);
  if (route === "/admin/branding" && request.method === "POST") return saveBranding(request, env);
  if (route === "/admin/subfolders" && request.method === "GET") return listSubfolders(env, url);
  if (route === "/admin/upload-url" && request.method === "POST") return prepareUpload(request, env);
  if (route === "/admin/catalogue-refresh" && request.method === "POST") return refreshCatalogue(request, env);
  if (route === "/admin/category-access" && request.method === "POST") return saveCategoryAccess(request, env);
  if (route === "/admin/course-delete" && request.method === "POST") return deleteCourse(request, env);
  if (route === "/admin/course-move" && request.method === "POST") { const job = moveCourse(request, env); background(job); return job; }
  if (route === "/admin/course-rename" && request.method === "POST") { const job = renameCourse(request, env); background(job); return job; }
  if (route === "/admin" && request.method === "GET") return backblazeAdmin(env, url);
  return json("פעולה לא זמינה", 405);
}


const b2BucketId = "da8692b34d9b03f8a32f0e19";

function backblazeKeyId(env) {
  return env.B2_KEY_ID || env["    B2_KEY_ID "];
}

function backblazeCredential(value, label) {
  const cleaned = value.replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, "").trim();
  const labeled = cleaned.match(new RegExp("^" + label + "\\s*[:=]\\s*([^\\r\\n]+)", "im"));
  return (labeled?.[1] ?? cleaned).trim().replace(/^["'“‘]|["'”’]$/g, "").trim();
}

async function backblaze(env, writing = false) {
  const keyId = backblazeCredential(writing ? env.B2_WRITE_KEY_ID : backblazeKeyId(env), "keyID");
  const appKey = backblazeCredential(writing ? env.B2_WRITE_APPLICATION_KEY : env.B2_APPLICATION_KEY, "applicationKey");
  if (!/^[!-9;-~]+$/.test(keyId)) throw new Error("invalid-key-id-format");
  if (!/^[!-~]+$/.test(appKey)) throw new Error("invalid-application-key-format");
  const authorization = await fetch("https://api.backblazeb2.com/b2api/v4/b2_authorize_account", {
    headers: {Authorization: "Basic " + btoa(keyId + ":" + appKey)},
    redirect: "manual"
  }).catch(() => { throw new Error("authorize-network"); });
  if (!authorization.ok) throw new Error("authorize-" + authorization.status);
  const {authorizationToken, apiInfo} = await authorization.json().catch(() => { throw new Error("authorize-format"); });
  const storageApi = apiInfo?.storageApi;
  if (!authorizationToken || !storageApi?.apiUrl || (!writing && !storageApi.downloadUrl)) throw new Error("authorize-format");
  async function getUploadEndpoint() {
    const endpoint = await fetch(storageApi.apiUrl + "/b2api/v4/b2_get_upload_url", {
      method: "POST", headers: {Authorization: authorizationToken, "Content-Type": "application/json"},
      body: JSON.stringify({bucketId: b2BucketId}), redirect: "manual"
    }).catch(() => { throw new Error("upload-endpoint-network"); });
    if (!endpoint.ok) throw new Error("upload-endpoint-" + endpoint.status);
    const details = await endpoint.json();
    if (!details.uploadUrl || !details.authorizationToken) throw new Error("upload-endpoint-format");
    return details;
  }
  return {
    async checkUpload() {
      await getUploadEndpoint();
    },
    async deleteFile(fileName, fileId) {
      const response = await fetch(storageApi.apiUrl + "/b2api/v4/b2_delete_file_version", {
        method: "POST", headers: {Authorization: authorizationToken, "Content-Type": "application/json"},
        body: JSON.stringify({fileName, fileId}), redirect: "manual"
      }).catch(() => { throw new Error("delete-file-network"); });
      const status = response.status;
      await response.body?.cancel().catch(() => {});
      if (!response.ok) throw new Error("delete-file-" + status);
    },
    async copyFile(sourceFileId, fileName) {
      // Backblaze answers 429 / 503 when it is busy: wait (Retry-After) and try again.
      for (let attempt = 0; ; attempt++) {
        const response = await fetch(storageApi.apiUrl + "/b2api/v4/b2_copy_file", {
          method: "POST", headers: {Authorization: authorizationToken, "Content-Type": "application/json"},
          body: JSON.stringify({sourceFileId, fileName}), redirect: "manual"
        }).catch(() => { throw new Error("copy-file-network"); });
        if (response.ok) {
          const {fileId} = await response.json().catch(() => ({}));
          if (!fileId) throw new Error("copy-file-format");
          return fileId;
        }
        await response.body?.cancel().catch(() => {});
        if ((response.status === 429 || response.status === 503) && attempt < 4) {
          const wait = Math.min(8, Number(response.headers.get("Retry-After")) || 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, wait * 1000));
          continue;
        }
        throw new Error("copy-file-" + response.status);
      }
    },
    async exists(fileName) {
      const page = await this.list({prefix: fileName});
      return page.objects.find(item => item.key === fileName && item.action !== "folder") ?? null;
    },
    async size(fileId) {
      const response = await fetch(storageApi.apiUrl + "/b2api/v4/b2_get_file_info?" + new URLSearchParams({fileId}), {headers: {Authorization: authorizationToken}, redirect: "manual"});
      if (!response.ok) { await response.body?.cancel().catch(() => {}); throw new Error("info-" + response.status); }
      return (await response.json()).contentLength;
    },
    async downloadByName(fileName) {
      return fetch(storageApi.downloadUrl + "/file/essaicours/" + fileName.split("/").map(encodeURIComponent).join("/"), {headers: {Authorization: authorizationToken}, redirect: "manual"});
    },
    async uploadTarget() {
      const {uploadUrl, authorizationToken: token} = await getUploadEndpoint();
      return {uploadUrl, token};
    },
    async upload(file, key, type) {
      const {uploadUrl, authorizationToken: uploadToken} = await getUploadEndpoint();
      const bytes = await file.arrayBuffer();
      const checksum = hex(await crypto.subtle.digest("SHA-1", bytes));
      const response = await fetch(uploadUrl, {
        method: "POST", body: bytes, redirect: "manual",
        headers: {Authorization: uploadToken, "Content-Type": type,
          "X-Bz-Content-Sha1": checksum, "X-Bz-File-Name": key.split("/").map(encodeURIComponent).join("/")}
      });
      const status = response.status;
      await response.body?.cancel().catch(() => {});
      if (!response.ok) throw new Error("upload-file-" + status);
    },
    async list({prefix, delimiter, cursor}) {
      const response = await fetch(storageApi.apiUrl + "/b2api/v4/b2_list_file_names", {
        method: "POST",
        headers: {Authorization: authorizationToken, "Content-Type": "application/json"},
        body: JSON.stringify({bucketId: b2BucketId, prefix, delimiter, startFileName: cursor, maxFileCount: 1000}),
        redirect: "manual"
      }).catch(() => { throw new Error("list-network"); });
      if (!response.ok) throw new Error("list-" + response.status);
      const {files, nextFileName} = await response.json();
      return {
        objects: files.map(file => ({key: file.fileName, etag: file.fileId, action: file.action, size: file.contentLength})),
        cursor: nextFileName,
        truncated: Boolean(nextFileName)
      };
    },
    async audioWithCover(fileId, downloadName, title, image) {
      const response = await fetch(storageApi.downloadUrl + "/b2api/v4/b2_download_file_by_id?" + new URLSearchParams({fileId}), {headers: {Authorization: authorizationToken}, redirect: "manual"});
      if (response.status !== 200 || !response.body) throw new Error("media-" + response.status);
      const total = Number(response.headers.get("Content-Length"));
      const reader = response.body.getReader();
      let first = new Uint8Array(0);
      while (first.length < 10) { const {done, value} = await reader.read(); if (done) break; first = joinBytes(first, value); }
      let skip = 0;
      if (first.length >= 10 && first[0] === 0x49 && first[1] === 0x44 && first[2] === 0x33) {
        skip = 10 + (((first[6] & 127) << 21) | ((first[7] & 127) << 14) | ((first[8] & 127) << 7) | (first[9] & 127)) + ((first[5] & 0x10) ? 10 : 0);
      }
      const oldSize = skip;
      const tag = id3Tag(title, image);
      let pending = first;
      let started = false;
      const stream = new ReadableStream({
        async pull(controller) {
          if (!started) { started = true; controller.enqueue(tag); return; }
          while (true) {
            let chunk;
            if (pending) { chunk = pending; pending = null; }
            else { const {done, value} = await reader.read(); if (done) { controller.close(); return; } chunk = value; }
            if (skip > 0) { if (chunk.length <= skip) { skip -= chunk.length; continue; } chunk = chunk.subarray(skip); skip = 0; }
            if (chunk.length) { controller.enqueue(chunk); return; }
          }
        },
        cancel() { reader.cancel().catch(() => {}); }
      });
      const headers = new Headers({...security, "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store", "Content-Disposition": "attachment; filename*=UTF-8''" + encodeURIComponent(downloadName)});
      if (Number.isFinite(total) && total > 0 && oldSize <= total && typeof FixedLengthStream !== "undefined") {
        const fixed = new FixedLengthStream(tag.length + total - oldSize);
        stream.pipeTo(fixed.writable).catch(() => {});
        return new Response(fixed.readable, {status: 200, headers});
      }
      return new Response(stream, {status: 200, headers});
    },
    async media(request, fileId, type, downloadName = "") {
      const headers = new Headers({Authorization: authorizationToken});
      const range = request.headers.get("Range");
      if (range) headers.set("Range", range);
      const response = await fetch(storageApi.downloadUrl + "/b2api/v4/b2_download_file_by_id?" + new URLSearchParams({fileId}), {
        method: request.method, headers, redirect: "manual"
      });
      if (![200, 206, 416].includes(response.status)) throw new Error("media-" + response.status);
      const resultHeaders = new Headers({...security, "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, no-store"});
      if (downloadName) resultHeaders.set("Content-Disposition", "attachment; filename*=UTF-8''" + encodeURIComponent(downloadName));
      for (const name of ["Content-Length", "Content-Range"]) {
        const value = response.headers.get(name);
        if (value !== null) resultHeaders.set(name, value);
      }
      let status = response.status;
      if (range && status === 200) {
        // Backblaze answers 200 to "bytes=0-". Safari (iPhone) refuses to play unless it gets 206 + Content-Range.
        const length = Number(response.headers.get("Content-Length"));
        if (Number.isFinite(length) && length > 0) { status = 206; resultHeaders.set("Content-Range", `bytes 0-${length - 1}/${length}`); }
      }
      return new Response(request.method === "HEAD" ? null : response.body, {status, headers: resultHeaders});
    }
  };
}

async function backblazeFolders(storage) {
  const folders = [];
  let cursor;
  do {
    const page = await storage.list({prefix: "", delimiter: "/", cursor});
    folders.push(...page.objects.filter(item => item.action === "folder").map(item => item.key.slice(0, -1)));
    cursor = page.cursor;
  } while (cursor);
  return folders.sort((a, b) => a.localeCompare(b, "he"));
}

const folderIcon = '<span class="folder-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>';

const isBatchId = part => /^[a-f0-9-]{36}$/.test(part);
const courseTrail = course => course.trail ?? course.folder.split("/").slice(1).filter(part => !isBatchId(part));
const parsePath = value => String(value ?? "").split("/").filter(part => part && part !== "." && part !== "..").slice(0, 12);
const samePrefix = (trail, path) => path.every((part, index) => trail[index] === part);
const navLink = (folder, path = []) => "/?" + new URLSearchParams(path.length ? {folder, path: path.join("/")} : {folder});

function levelView(courses, path) {
  const inside = [];
  const subs = new Map();
  for (const course of courses) {
    const trail = courseTrail(course);
    if (!samePrefix(trail, path)) continue;
    if (trail.length === path.length) inside.push(course);
    else subs.set(trail[path.length], (subs.get(trail[path.length]) ?? 0) + 1);
  }
  return {inside, subs: [...subs].sort((a, b) => a[0].localeCompare(b[0], "he"))};
}

function backblazeCourseLink(folder, course, file) {
  const params = new URLSearchParams({folder});
  if (course) params.set("course", course);
  if (file) params.set("file", file);
  return "/?" + params;
}

const courseUploadLimit = 30 * 1024 * 1024;
const uploadReady = env => Boolean(env.B2_WRITE_KEY_ID && env.B2_WRITE_APPLICATION_KEY);

const busyHint = error => /-429$/.test(error?.message ?? "") ? " Backblaze מגביל זמנית את החשבון (יותר מדי בקשות). נסו שוב בעוד כמה דקות, ועצרו העלאות פעילות (rclone) בינתיים." : "";
function writeStatus(error) {
  return /^(?:authorize|upload-endpoint|upload-file|delete-file|copy-file)-(?:[0-9]{3}|network|format)$/.test(error.message) || /^invalid-(?:key-id|application-key)-format$/.test(error.message)
    ? error.message : "upload-error: " + String(error?.message ?? error).replace(/[^\w .:()\/-]/g, "?").slice(0, 80);
}

async function knownCategories(env) {
  try {
    const rules = await accessRules(env);
    return [...new Set([...await backblazeFolders(await backblaze(env)), ...rules.keys()])].sort((a, b) => a.localeCompare(b, "he"));
  } catch { return []; }
}

async function courseUploadForm(env, current, error = "", status = 200, check = "", initialPath = []) {
  const enabled = uploadReady(env);
  const known = await knownCategories(env);
  const options = known.map(folder => `<option value="${esc(folder)}"${folder === current ? " selected" : ""}>${esc(folder)}</option>`).join("");
  const initial = current ? [current, ...initialPath] : [];
  return layout("הוספת שיעור", `<div class="panel stack">
    ${error ? notice(error, "error") : ""}
    ${enabled ? "" : notice("העלאה מהאתר תיפתח לאחר חיבור הרשאת כתיבה. בינתיים ניתן להעלות ישירות ל־Backblaze.", "info")}
    <p><a href="/admin?add=multi">להעלות הרבה שיעורים בבת אחת ›</a></p>
    <form class="form-grid" action="/admin/backblaze-upload" method="post" enctype="multipart/form-data" data-direct-upload>
      <fieldset ${enabled ? "" : "disabled"} class="form-grid" style="border:0;padding:0;margin:0;min-width:0">
        <input type="hidden" name="upload_id" value="${crypto.randomUUID()}">
        <label>כותרת השיעור (אפשר להשאיר ריק: הכותרת תילקח משם הקובץ)<input name="title" maxlength="180" placeholder="אופציונלי"></label>
        <div><p style="margin:0 0 6px;font-weight:600;color:var(--text)">יעד: קטגוריה ותיקיית משנה</p>
          <div data-picker data-categories="${esc(JSON.stringify(known))}" data-initial="${esc(JSON.stringify(initial))}"></div>
          <noscript><label>קטגוריה<select name="folder"><option value="">בחירת קטגוריה</option>${options}</select></label></noscript></div>
        <label>או קטגוריה חדשה (במקום הבחירה למעלה)<input name="new_folder" maxlength="120" placeholder="שם הקטגוריה החדשה"></label>
        <label>קובץ שמע MP3 (אפשר גם בלי)<input type="file" name="audio" accept=".mp3,audio/mpeg"></label>
        <label>קובץ וידאו MP4 (אפשר גם בלי)<input type="file" name="video" accept=".mp4,video/mp4"></label>
        <progress data-progress hidden max="100" value="0" style="width:100%"></progress><p data-status role="status" hidden></p>
        <p>אפשר להעלות קבצים גדולים. ההעלאה נשלחת ישירות ל־Backblaze: השאירו את המסך דלוק עד שהיא מסתיימת. להעלאה של הרבה שיעורים, השתמשו ב־rclone.</p>
        <button class="button gold">פרסום השיעור</button>
      </fieldset>
    </form>
    ${enabled ? `<p style="margin-block:16px 0"><a href="/admin?add=1&amp;check=1">בדיקת החיבור להעלאה</a>${check ? ` · <span role="status" dir="auto">${esc(check)}</span>` : ""}</p>` : ""}
  </div>`, status, {admin: true, script: ["/picker.js", "/upload.js"]});
}

const uploadScript = `(() => {
  const form = document.querySelector("form[data-direct-upload]");
  if (!form) return;
  const bar = form.querySelector("[data-progress]");
  const status = form.querySelector("[data-status]");
  const button = form.querySelector("button.gold");
  const holder = form.querySelector("[data-picker]");
  const picker = holder && window.makePicker ? window.makePicker({categories: JSON.parse(holder.dataset.categories || "[]"), path: JSON.parse(holder.dataset.initial || "[]")}) : null;
  if (picker) holder.append(picker.el);
  const note = (text, kind) => { status.textContent = text; status.className = "notice" + (kind ? " " + kind : ""); status.hidden = !text; };
  const encodeName = name => name.split("/").map(encodeURIComponent).join("/");
  const mb = bytes => (bytes / 1048576).toFixed(0) + "MB";
  const send = (target, file, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", target.uploadUrl);
    xhr.setRequestHeader("Authorization", target.token);
    xhr.setRequestHeader("X-Bz-File-Name", encodeName(target.fileName));
    xhr.setRequestHeader("Content-Type", target.contentType);
    xhr.setRequestHeader("X-Bz-Content-Sha1", "do_not_verify");
    xhr.upload.onprogress = event => progress(event.loaded);
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("HTTP " + xhr.status));
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(file);
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(form);
    const audio = data.get("audio");
    const video = data.get("video");
    let title = String(data.get("title") || "").trim();
    const newCategory = String(data.get("new_folder") || "").trim().replace(/[/\\\\]/g, " ");
    const parts = newCategory ? [newCategory] : picker ? picker.get() : [String(data.get("folder") || "").trim()].filter(Boolean);
    const folder = parts.join("/");
    const files = [];
    if (video && video.size) files.push({kind: "video", file: video});
    if (audio && audio.size) files.push({kind: "audio", file: audio});
    if (!files.length) return note("יש לבחור לפחות קובץ אחד: MP3 או MP4.", "error");
    if (!title) title = (audio && audio.size ? audio : video).name.replace(/\\.(mp3|mp4)$/i, "").replace(/[/\\\\]/g, " ").trim().slice(0, 180);
    if (!title || !folder) return note("יש לבחור קטגוריה (ואם אין שם קובץ, למלא כותרת).", "error");
    button.disabled = true;
    window.onbeforeunload = () => "ההעלאה בעיצומה";
    bar.hidden = false; bar.value = 0;
    note("מכינים את ההעלאה…");
    try {
      const prepared = await fetch("/admin/upload-url", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({folder, title, upload_id: data.get("upload_id"), files: files.map(item => ({kind: item.kind, name: item.file.name, size: item.file.size}))})
      });
      const plan = await prepared.json().catch(() => ({}));
      if (!prepared.ok) throw new Error(plan.message || "prepare");
      const total = files.reduce((sum, item) => sum + item.file.size, 0);
      let done = 0;
      for (const item of files) {
        const target = plan.files.find(entry => entry.kind === item.kind);
        note((item.kind === "video" ? "מעלים MP4" : "מעלים MP3") + " (" + mb(item.file.size) + ")… השאירו את המסך דלוק.");
        await send(target, item.file, loaded => { bar.value = Math.round(((done + loaded) / total) * 100); });
        done += item.file.size;
      }
      note("מעדכנים את הקטלוג…");
      await fetch("/admin/catalogue-refresh", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({folders: [parts[0]]})}).catch(() => {});
      window.onbeforeunload = null;
      location.href = "/admin?" + new URLSearchParams(Object.assign({folder: parts[0], published: "1"}, parts.length > 1 ? {path: parts.slice(1).join("/")} : {}));
    } catch (error) {
      window.onbeforeunload = null;
      button.disabled = false;
      note(error.message === "network"
        ? "ההעלאה נכשלה. ייתכן ש־CORS לא הוגדר בדלי ב־Backblaze, או שהחיבור נותק."
        : "ההעלאה נכשלה: " + error.message, "error");
    }
  });
})();
`;

const validFolderPath = value => typeof value === "string" && value.length <= 400 && value.split("/").length <= 8 && value.split("/").every(part => validUploadName(part, 120));
const validUploadName = (value, max) => typeof value === "string" && value && value !== "." && value !== ".." && value.length <= max && !/[/\\\x00-\x1f\x7f]/.test(value);

async function listSubfolders(env, url) {
  const path = parsePath(url.searchParams.get("path"));
  if (!path.length) return json("בקשה לא חוקית", 400);
  try {
    const storage = await backblaze(env);
    const prefix = path.join("/") + "/";
    const names = new Set();
    let cursor;
    do {
      const page = await storage.list({prefix, delimiter: "/", cursor});
      for (const item of page.objects) if (item.action === "folder") { const name = item.key.slice(prefix.length, -1); if (name && !isBatchId(name)) names.add(name); }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return Response.json({folders: [...names].sort((a, b) => a.localeCompare(b, "he"))}, {headers: security});
  } catch { return json("לא ניתן לטעון תיקיות", 502); }
}

async function prepareUpload(request, env) {
  if (!uploadReady(env)) return json("העלאה מהאתר דורשת הרשאת כתיבה ל־Backblaze.", 503);
  if (Number(request.headers.get("Content-Length")) > 8192) return json("בקשה גדולה מדי", 413);
  const body = await request.json().catch(() => null);
  const folder = String(body?.folder ?? "").trim();
  const title = String(body?.title ?? "").trim();
  const id = String(body?.upload_id ?? "");
  const items = Array.isArray(body?.files) ? body.files : [];
  const limit = 4.5 * 1024 ** 3;
  const kinds = new Set(items.map(item => item?.kind));
  const valid = items.length >= 1 && items.length <= 2 && kinds.size === items.length &&
    items.every(item => (item.kind === "audio" || item.kind === "video") && Number.isFinite(item.size) && item.size > 0 && item.size <= limit &&
      new RegExp("\\." + (item.kind === "audio" ? "mp3" : "mp4") + "$", "i").test(String(item.name ?? "")));
  if (!validFolderPath(folder) || !validUploadName(title, 180) || !/^[a-f0-9-]{36}$/.test(id) || !valid) return json("נתוני ההעלאה אינם תקינים", 400);
  try {
    const writer = await backblaze(env, true);
    const files = [];
    for (const item of items) {
      const {uploadUrl, token} = await writer.uploadTarget();
      const audio = item.kind === "audio";
      files.push({kind: item.kind, uploadUrl, token, contentType: audio ? "audio/mpeg" : "video/mp4", fileName: `${folder}/${id}/${title}.${audio ? "mp3" : "mp4"}`});
    }
    return Response.json({files}, {headers: security});
  } catch (error) {
    return json("לא ניתן להכין את ההעלאה. קוד תקלה: " + writeStatus(error), 502);
  }
}

const pickerScript = `(() => {
  const cache = new Map();
  const children = async path => {
    const key = path.join("/");
    if (cache.has(key)) return cache.get(key);
    let folders = [];
    try { const response = await fetch("/admin/subfolders?path=" + encodeURIComponent(key)); if (response.ok) folders = (await response.json()).folders || []; } catch (error) {}
    cache.set(key, folders);
    return folders;
  };
  const choose = (names, value, placeholder, onChange, disabled) => {
    const select = document.createElement("select");
    select.disabled = disabled;
    const first = document.createElement("option"); first.value = ""; first.textContent = placeholder; select.append(first);
    for (const name of names) { const option = document.createElement("option"); option.value = name; option.textContent = name; select.append(option); }
    select.value = value;
    select.addEventListener("change", () => onChange(select.value));
    return select;
  };
  window.makePicker = ({categories, path = [], onChange = () => {}}) => {
    const el = document.createElement("div");
    el.className = "picker";
    let selected = [...path];
    let extra = "";
    let disabled = false;
    let ticket = 0;
    const value = () => selected.concat(extra.trim() ? [extra.trim().replace(/[/\\\\]/g, " ")] : []);
    const notify = () => onChange(value());
    async function render() {
      const mine = ++ticket;
      const parts = [choose(categories, selected[0] || "", "בחירת קטגוריה", name => { selected = name ? [name] : []; render(); notify(); }, disabled)];
      for (let i = 0; i < selected.length; i++) {
        const subs = await children(selected.slice(0, i + 1));
        if (mine !== ticket) return;
        if (!subs.length) break;
        parts.push(choose(subs, selected[i + 1] || "", "(בתיקייה זו, בלי תיקיית משנה)", name => { selected = selected.slice(0, i + 1); if (name) selected.push(name); render(); notify(); }, disabled));
      }
      if (selected.length) {
        const input = document.createElement("input");
        input.placeholder = "תיקייה חדשה בתוך זה (אופציונלי)"; input.maxLength = 100; input.value = extra; input.disabled = disabled;
        input.addEventListener("input", () => { extra = input.value; notify(); });
        parts.push(input);
      }
      if (mine === ticket) el.replaceChildren(...parts);
    }
    render();
    return {el, get: value, set(next) { selected = [...next]; extra = ""; render(); notify(); }, disable(flag) { disabled = flag; render(); }};
  };
})();
`;

// In-browser audio extraction (ffmpeg.wasm 0.12, LGPL/GPL builds by the ffmpeg.wasm project). The 32 MB core lives at the Backblaze bucket root.
const ffmpegAssets = {"ffmpeg.js": "!function(e,t){\"object\"==typeof exports&&\"object\"==typeof module?module.exports=t():\"function\"==typeof define&&define.amd?define([],t):\"object\"==typeof exports?exports.FFmpegWASM=t():e.FFmpegWASM=t()}(self,(()=>(()=>{\"use strict\";var e={m:{},d:(t,s)=>{for(var r in s)e.o(s,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:s[r]})},u:e=>e+\".ffmpeg.js\"};e.g=function(){if(\"object\"==typeof globalThis)return globalThis;try{return this||new Function(\"return this\")()}catch(e){if(\"object\"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e.r=e=>{\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(e,\"__esModule\",{value:!0})},(()=>{var t;e.g.importScripts&&(t=e.g.location+\"\");var s=e.g.document;if(!t&&s&&(s.currentScript&&(t=s.currentScript.src),!t)){var r=s.getElementsByTagName(\"script\");if(r.length)for(var a=r.length-1;a>-1&&!t;)t=r[a--].src}if(!t)throw new Error(\"Automatic publicPath is not supported in this browser\");t=t.replace(/#.*$/,\"\").replace(/\\?.*$/,\"\").replace(/\\/[^\\/]+$/,\"/\"),e.p=t})(),e.b=document.baseURI||self.location.href;var t,s={};e.r(s),e.d(s,{FFmpeg:()=>i}),function(e){e.LOAD=\"LOAD\",e.EXEC=\"EXEC\",e.WRITE_FILE=\"WRITE_FILE\",e.READ_FILE=\"READ_FILE\",e.DELETE_FILE=\"DELETE_FILE\",e.RENAME=\"RENAME\",e.CREATE_DIR=\"CREATE_DIR\",e.LIST_DIR=\"LIST_DIR\",e.DELETE_DIR=\"DELETE_DIR\",e.ERROR=\"ERROR\",e.DOWNLOAD=\"DOWNLOAD\",e.PROGRESS=\"PROGRESS\",e.LOG=\"LOG\",e.MOUNT=\"MOUNT\",e.UNMOUNT=\"UNMOUNT\"}(t||(t={}));const r=(()=>{let e=0;return()=>e++})(),a=(new Error(\"unknown message type\"),new Error(\"ffmpeg is not loaded, call `await ffmpeg.load()` first\")),o=new Error(\"called FFmpeg.terminate()\");new Error(\"failed to import ffmpeg-core.js\");class i{#e=null;#t={};#s={};#r=[];#a=[];loaded=!1;#o=()=>{this.#e&&(this.#e.onmessage=({data:{id:e,type:s,data:r}})=>{switch(s){case t.LOAD:this.loaded=!0,this.#t[e](r);break;case t.MOUNT:case t.UNMOUNT:case t.EXEC:case t.WRITE_FILE:case t.READ_FILE:case t.DELETE_FILE:case t.RENAME:case t.CREATE_DIR:case t.LIST_DIR:case t.DELETE_DIR:this.#t[e](r);break;case t.LOG:this.#r.forEach((e=>e(r)));break;case t.PROGRESS:this.#a.forEach((e=>e(r)));break;case t.ERROR:this.#s[e](r)}delete this.#t[e],delete this.#s[e]})};#i=({type:e,data:t},s=[],o)=>this.#e?new Promise(((a,i)=>{const n=r();this.#e&&this.#e.postMessage({id:n,type:e,data:t},s),this.#t[n]=a,this.#s[n]=i,o?.addEventListener(\"abort\",(()=>{i(new DOMException(`Message # ${n} was aborted`,\"AbortError\"))}),{once:!0})})):Promise.reject(a);on(e,t){\"log\"===e?this.#r.push(t):\"progress\"===e&&this.#a.push(t)}off(e,t){\"log\"===e?this.#r=this.#r.filter((e=>e!==t)):\"progress\"===e&&(this.#a=this.#a.filter((e=>e!==t)))}load=({classWorkerURL:s,...r}={},{signal:a}={})=>(this.#e||(this.#e=s?new Worker(new URL(s,\"file:///home/jeromewu/ffmpeg.wasm/packages/ffmpeg/dist/esm/classes.js\"),{type:\"module\"}):new Worker(new URL(e.p+e.u(814),e.b),{type:void 0}),this.#o()),this.#i({type:t.LOAD,data:r},void 0,a));exec=(e,s=-1,{signal:r}={})=>this.#i({type:t.EXEC,data:{args:e,timeout:s}},void 0,r);terminate=()=>{const e=Object.keys(this.#s);for(const t of e)this.#s[t](o),delete this.#s[t],delete this.#t[t];this.#e&&(this.#e.terminate(),this.#e=null,this.loaded=!1)};writeFile=(e,s,{signal:r}={})=>{const a=[];return s instanceof Uint8Array&&a.push(s.buffer),this.#i({type:t.WRITE_FILE,data:{path:e,data:s}},a,r)};mount=(e,s,r)=>this.#i({type:t.MOUNT,data:{fsType:e,options:s,mountPoint:r}},[]);unmount=e=>this.#i({type:t.UNMOUNT,data:{mountPoint:e}},[]);readFile=(e,s=\"binary\",{signal:r}={})=>this.#i({type:t.READ_FILE,data:{path:e,encoding:s}},void 0,r);deleteFile=(e,{signal:s}={})=>this.#i({type:t.DELETE_FILE,data:{path:e}},void 0,s);rename=(e,s,{signal:r}={})=>this.#i({type:t.RENAME,data:{oldPath:e,newPath:s}},void 0,r);createDir=(e,{signal:s}={})=>this.#i({type:t.CREATE_DIR,data:{path:e}},void 0,s);listDir=(e,{signal:s}={})=>this.#i({type:t.LIST_DIR,data:{path:e}},void 0,s);deleteDir=(e,{signal:s}={})=>this.#i({type:t.DELETE_DIR,data:{path:e}},void 0,s)}return s})()));", "814.ffmpeg.js": "!function(e,t){\"object\"==typeof exports&&\"object\"==typeof module?module.exports=t():\"function\"==typeof define&&define.amd?define([],t):\"object\"==typeof exports?exports.FFmpegWASM=t():e.FFmpegWASM=t()}(self,(()=>(()=>{\"use strict\";const e=\"https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js\";var t;!function(e){e.LOAD=\"LOAD\",e.EXEC=\"EXEC\",e.WRITE_FILE=\"WRITE_FILE\",e.READ_FILE=\"READ_FILE\",e.DELETE_FILE=\"DELETE_FILE\",e.RENAME=\"RENAME\",e.CREATE_DIR=\"CREATE_DIR\",e.LIST_DIR=\"LIST_DIR\",e.DELETE_DIR=\"DELETE_DIR\",e.ERROR=\"ERROR\",e.DOWNLOAD=\"DOWNLOAD\",e.PROGRESS=\"PROGRESS\",e.LOG=\"LOG\",e.MOUNT=\"MOUNT\",e.UNMOUNT=\"UNMOUNT\"}(t||(t={}));const r=new Error(\"unknown message type\"),a=new Error(\"ffmpeg is not loaded, call `await ffmpeg.load()` first\"),s=(new Error(\"called FFmpeg.terminate()\"),new Error(\"failed to import ffmpeg-core.js\"));let o;return self.onmessage=async({data:{id:n,type:E,data:c}})=>{const i=[];let p;try{if(E!==t.LOAD&&!o)throw a;switch(E){case t.LOAD:p=await(async({coreURL:r,wasmURL:a,workerURL:n})=>{const E=!o;try{r||(r=e),importScripts(r)}catch{if(r||(r=e.replace(\"/umd/\",\"/esm/\")),self.createFFmpegCore=(await import(r)).default,!self.createFFmpegCore)throw s}const c=r,i=a||r.replace(/.js$/g,\".wasm\"),p=n||r.replace(/.js$/g,\".worker.js\");return o=await self.createFFmpegCore({mainScriptUrlOrBlob:`${c}#${btoa(JSON.stringify({wasmURL:i,workerURL:p}))}`}),o.setLogger((e=>self.postMessage({type:t.LOG,data:e}))),o.setProgress((e=>self.postMessage({type:t.PROGRESS,data:e}))),E})(c);break;case t.EXEC:p=(({args:e,timeout:t=-1})=>{o.setTimeout(t),o.exec(...e);const r=o.ret;return o.reset(),r})(c);break;case t.WRITE_FILE:p=(({path:e,data:t})=>(o.FS.writeFile(e,t),!0))(c);break;case t.READ_FILE:p=(({path:e,encoding:t})=>o.FS.readFile(e,{encoding:t}))(c);break;case t.DELETE_FILE:p=(({path:e})=>(o.FS.unlink(e),!0))(c);break;case t.RENAME:p=(({oldPath:e,newPath:t})=>(o.FS.rename(e,t),!0))(c);break;case t.CREATE_DIR:p=(({path:e})=>(o.FS.mkdir(e),!0))(c);break;case t.LIST_DIR:p=(({path:e})=>{const t=o.FS.readdir(e),r=[];for(const a of t){const t=o.FS.stat(`${e}/${a}`),s=o.FS.isDir(t.mode);r.push({name:a,isDir:s})}return r})(c);break;case t.DELETE_DIR:p=(({path:e})=>(o.FS.rmdir(e),!0))(c);break;case t.MOUNT:p=(({fsType:e,options:t,mountPoint:r})=>{const a=e,s=o.FS.filesystems[a];return!!s&&(o.FS.mount(s,t,r),!0)})(c);break;case t.UNMOUNT:p=(({mountPoint:e})=>(o.FS.unmount(e),!0))(c);break;default:throw r}}catch(e){return void self.postMessage({id:n,type:t.ERROR,data:e.toString()})}p instanceof Uint8Array&&i.push(p.buffer),self.postMessage({id:n,type:E,data:p},i)},{}})()));", "ffmpeg-core.js": "var createFFmpegCore = (() => {\n  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;\n  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;\n  return (\nfunction(createFFmpegCore = {})  {\n\nvar Module=typeof createFFmpegCore!=\"undefined\"?createFFmpegCore:{};var readyPromiseResolve,readyPromiseReject;Module[\"ready\"]=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});const NULL=0;const SIZE_I32=Uint32Array.BYTES_PER_ELEMENT;const DEFAULT_ARGS=[\"./ffmpeg\",\"-nostdin\",\"-y\"];Module[\"NULL\"]=NULL;Module[\"SIZE_I32\"]=SIZE_I32;Module[\"DEFAULT_ARGS\"]=DEFAULT_ARGS;Module[\"ret\"]=-1;Module[\"timeout\"]=-1;Module[\"logger\"]=()=>{};Module[\"progress\"]=()=>{};function stringToPtr(str){const len=Module[\"lengthBytesUTF8\"](str)+1;const ptr=Module[\"_malloc\"](len);Module[\"stringToUTF8\"](str,ptr,len);return ptr}function stringsToPtr(strs){const len=strs.length;const ptr=Module[\"_malloc\"](len*SIZE_I32);for(let i=0;i<len;i++){Module[\"setValue\"](ptr+SIZE_I32*i,stringToPtr(strs[i]),\"i32\")}return ptr}function print(message){Module[\"logger\"]({type:\"stdout\",message:message})}function printErr(message){if(!message.startsWith(\"Aborted(native code called abort())\"))Module[\"logger\"]({type:\"stderr\",message:message})}function exec(..._args){const args=[...Module[\"DEFAULT_ARGS\"],..._args];try{Module[\"_ffmpeg\"](args.length,stringsToPtr(args))}catch(e){if(!e.message.startsWith(\"Aborted\")){throw e}}return Module[\"ret\"]}function setLogger(logger){Module[\"logger\"]=logger}function setTimeout(timeout){Module[\"timeout\"]=timeout}function setProgress(handler){Module[\"progress\"]=handler}function receiveProgress(progress,time){Module[\"progress\"]({progress:progress,time:time})}function reset(){Module[\"ret\"]=-1;Module[\"timeout\"]=-1}function _locateFile(path,prefix){const mainScriptUrlOrBlob=Module[\"mainScriptUrlOrBlob\"];if(mainScriptUrlOrBlob){const{wasmURL:wasmURL,workerURL:workerURL}=JSON.parse(atob(mainScriptUrlOrBlob.slice(mainScriptUrlOrBlob.lastIndexOf(\"#\")+1)));if(path.endsWith(\".wasm\"))return wasmURL;if(path.endsWith(\".worker.js\"))return workerURL}return prefix+path}Module[\"stringToPtr\"]=stringToPtr;Module[\"stringsToPtr\"]=stringsToPtr;Module[\"print\"]=print;Module[\"printErr\"]=printErr;Module[\"locateFile\"]=_locateFile;Module[\"exec\"]=exec;Module[\"setLogger\"]=setLogger;Module[\"setTimeout\"]=setTimeout;Module[\"setProgress\"]=setProgress;Module[\"reset\"]=reset;Module[\"receiveProgress\"]=receiveProgress;var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram=\"./this.program\";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window==\"object\";var ENVIRONMENT_IS_WORKER=typeof importScripts==\"function\";var ENVIRONMENT_IS_NODE=typeof process==\"object\"&&typeof process.versions==\"object\"&&typeof process.versions.node==\"string\";var scriptDirectory=\"\";function locateFile(path){if(Module[\"locateFile\"]){return Module[\"locateFile\"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_NODE){var fs=require(\"fs\");var nodePath=require(\"path\");if(ENVIRONMENT_IS_WORKER){scriptDirectory=nodePath.dirname(scriptDirectory)+\"/\"}else{scriptDirectory=__dirname+\"/\"}read_=(filename,binary)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);return fs.readFileSync(filename,binary?undefined:\"utf8\")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror,binary=true)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);fs.readFile(filename,binary?undefined:\"utf8\",(err,data)=>{if(err)onerror(err);else onload(binary?data.buffer:data)})};if(!Module[\"thisProgram\"]&&process.argv.length>1){thisProgram=process.argv[1].replace(/\\\\/g,\"/\")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow};Module[\"inspect\"]=()=>\"[Emscripten Module object]\"}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=\"undefined\"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf(\"blob:\")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,\"\").lastIndexOf(\"/\")+1)}else{scriptDirectory=\"\"}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open(\"GET\",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open(\"GET\",url,false);xhr.responseType=\"arraybuffer\";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open(\"GET\",url,true);xhr.responseType=\"arraybuffer\";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module[\"print\"]||console.log.bind(console);var err=Module[\"printErr\"]||console.error.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module[\"arguments\"])arguments_=Module[\"arguments\"];if(Module[\"thisProgram\"])thisProgram=Module[\"thisProgram\"];if(Module[\"quit\"])quit_=Module[\"quit\"];var wasmBinary;if(Module[\"wasmBinary\"])wasmBinary=Module[\"wasmBinary\"];var noExitRuntime=Module[\"noExitRuntime\"]||true;if(typeof WebAssembly!=\"object\"){abort(\"no native wasm support detected\")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort(text)}}var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAP64,HEAPU64,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module[\"HEAP8\"]=HEAP8=new Int8Array(b);Module[\"HEAP16\"]=HEAP16=new Int16Array(b);Module[\"HEAP32\"]=HEAP32=new Int32Array(b);Module[\"HEAPU8\"]=HEAPU8=new Uint8Array(b);Module[\"HEAPU16\"]=HEAPU16=new Uint16Array(b);Module[\"HEAPU32\"]=HEAPU32=new Uint32Array(b);Module[\"HEAPF32\"]=HEAPF32=new Float32Array(b);Module[\"HEAPF64\"]=HEAPF64=new Float64Array(b);Module[\"HEAP64\"]=HEAP64=new BigInt64Array(b);Module[\"HEAPU64\"]=HEAPU64=new BigUint64Array(b)}var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeKeepaliveCounter=0;function keepRuntimeAlive(){return noExitRuntime||runtimeKeepaliveCounter>0}function preRun(){if(Module[\"preRun\"]){if(typeof Module[\"preRun\"]==\"function\")Module[\"preRun\"]=[Module[\"preRun\"]];while(Module[\"preRun\"].length){addOnPreRun(Module[\"preRun\"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(!Module[\"noFSInit\"]&&!FS.init.initialized)FS.init();FS.ignorePermissions=false;TTY.init();SOCKFS.root=FS.mount(SOCKFS,{},null);callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module[\"postRun\"]){if(typeof Module[\"postRun\"]==\"function\")Module[\"postRun\"]=[Module[\"postRun\"]];while(Module[\"postRun\"].length){addOnPostRun(Module[\"postRun\"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module[\"monitorRunDependencies\"]){Module[\"monitorRunDependencies\"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module[\"monitorRunDependencies\"]){Module[\"monitorRunDependencies\"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module[\"onAbort\"]){Module[\"onAbort\"](what)}what=\"Aborted(\"+what+\")\";err(what);ABORT=true;EXITSTATUS=1;what+=\". Build with -sASSERTIONS for more info.\";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix=\"data:application/octet-stream;base64,\";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith(\"file://\")}var wasmBinaryFile;wasmBinaryFile=\"ffmpeg-core.wasm\";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw\"both async and sync fetching of the wasm failed\"}catch(err){abort(err)}}function getBinaryPromise(binaryFile){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==\"function\"&&!isFileURI(binaryFile)){return fetch(binaryFile,{credentials:\"same-origin\"}).then(response=>{if(!response[\"ok\"]){throw\"failed to load wasm binary file at '\"+binaryFile+\"'\"}return response[\"arrayBuffer\"]()}).catch(()=>getBinary(binaryFile))}else{if(readAsync){return new Promise((resolve,reject)=>{readAsync(binaryFile,response=>resolve(new Uint8Array(response)),reject)})}}}return Promise.resolve().then(()=>getBinary(binaryFile))}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(binary=>{return WebAssembly.instantiate(binary,imports)}).then(instance=>{return instance}).then(receiver,reason=>{err(\"failed to asynchronously prepare wasm: \"+reason);abort(reason)})}function instantiateAsync(binary,binaryFile,imports,callback){if(!binary&&typeof WebAssembly.instantiateStreaming==\"function\"&&!isDataURI(binaryFile)&&!isFileURI(binaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch==\"function\"){return fetch(binaryFile,{credentials:\"same-origin\"}).then(response=>{var result=WebAssembly.instantiateStreaming(response,imports);return result.then(callback,function(reason){err(\"wasm streaming compile failed: \"+reason);err(\"falling back to ArrayBuffer instantiation\");return instantiateArrayBuffer(binaryFile,imports,callback)})})}else{return instantiateArrayBuffer(binaryFile,imports,callback)}}function createWasm(){var info={\"a\":wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module[\"asm\"]=exports;wasmMemory=Module[\"asm\"][\"ra\"];updateMemoryViews();wasmTable=Module[\"asm\"][\"ua\"];addOnInit(Module[\"asm\"][\"sa\"]);removeRunDependency(\"wasm-instantiate\");return exports}addRunDependency(\"wasm-instantiate\");function receiveInstantiationResult(result){receiveInstance(result[\"instance\"])}if(Module[\"instantiateWasm\"]){try{return Module[\"instantiateWasm\"](info,receiveInstance)}catch(e){err(\"Module.instantiateWasm callback failed with error: \"+e);readyPromiseReject(e)}}instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult).catch(readyPromiseReject);return{}}var ASM_CONSTS={6059608:$0=>{Module.ret=$0}};function send_progress(progress,time){Module.receiveProgress(progress,time)}function is_timeout(diff){if(Module.timeout===-1)return 0;else{return Module.timeout<=diff}}function ExitStatus(status){this.name=\"ExitStatus\";this.message=`Program terminated with exit(${status})`;this.status=status}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func}function getValue(ptr,type=\"i8\"){if(type.endsWith(\"*\"))type=\"*\";switch(type){case\"i1\":return HEAP8[ptr>>0];case\"i8\":return HEAP8[ptr>>0];case\"i16\":return HEAP16[ptr>>1];case\"i32\":return HEAP32[ptr>>2];case\"i64\":return HEAP64[ptr>>3];case\"float\":return HEAPF32[ptr>>2];case\"double\":return HEAPF64[ptr>>3];case\"*\":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}function setValue(ptr,value,type=\"i8\"){if(type.endsWith(\"*\"))type=\"*\";switch(type){case\"i1\":HEAP8[ptr>>0]=value;break;case\"i8\":HEAP8[ptr>>0]=value;break;case\"i16\":HEAP16[ptr>>1]=value;break;case\"i32\":HEAP32[ptr>>2]=value;break;case\"i64\":HEAP64[ptr>>3]=BigInt(value);break;case\"float\":HEAPF32[ptr>>2]=value;break;case\"double\":HEAPF64[ptr>>3]=value;break;case\"*\":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var UTF8Decoder=typeof TextDecoder!=\"undefined\"?new TextDecoder(\"utf8\"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str=\"\";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):\"\"}function ___assert_fail(condition,filename,line,func){abort(`Assertion failed: ${UTF8ToString(condition)}, at: `+[filename?UTF8ToString(filename):\"unknown filename\",line,func?UTF8ToString(func):\"unknown function\"])}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24;this.set_type=function(type){HEAPU32[this.ptr+4>>2]=type};this.get_type=function(){return HEAPU32[this.ptr+4>>2]};this.set_destructor=function(destructor){HEAPU32[this.ptr+8>>2]=destructor};this.get_destructor=function(){return HEAPU32[this.ptr+8>>2]};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+12>>0]=caught};this.get_caught=function(){return HEAP8[this.ptr+12>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>0]=rethrown};this.get_rethrown=function(){return HEAP8[this.ptr+13>>0]!=0};this.init=function(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)};this.set_adjusted_ptr=function(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr};this.get_adjusted_ptr=function(){return HEAPU32[this.ptr+16>>2]};this.get_exception_ptr=function(){var isPointer=___cxa_is_pointer_type(this.get_type());if(isPointer){return HEAPU32[this.excPtr>>2]}var adjusted=this.get_adjusted_ptr();if(adjusted!==0)return adjusted;return this.excPtr}}var exceptionLast=0;var uncaughtExceptionCount=0;function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw exceptionLast}var dlopenMissingError=\"To use dlopen, you need enable dynamic linking, see https://emscripten.org/docs/compiling/Dynamic-Linking.html\";function ___dlsym(handle,symbol){abort(dlopenMissingError)}var PATH={isAbs:path=>path.charAt(0)===\"/\",splitPath:filename=>{var splitPathRe=/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last===\".\"){parts.splice(i,1)}else if(last===\"..\"){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift(\"..\")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.substr(-1)===\"/\";path=PATH.normalizeArray(path.split(\"/\").filter(p=>!!p),!isAbsolute).join(\"/\");if(!path&&!isAbsolute){path=\".\"}if(path&&trailingSlash){path+=\"/\"}return(isAbsolute?\"/\":\"\")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return\".\"}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:path=>{if(path===\"/\")return\"/\";path=PATH.normalize(path);path=path.replace(/\\/$/,\"\");var lastSlash=path.lastIndexOf(\"/\");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},join:function(){var paths=Array.prototype.slice.call(arguments);return PATH.normalize(paths.join(\"/\"))},join2:(l,r)=>{return PATH.normalize(l+\"/\"+r)}};function initRandomFill(){if(typeof crypto==\"object\"&&typeof crypto[\"getRandomValues\"]==\"function\"){return view=>crypto.getRandomValues(view)}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=require(\"crypto\");var randomFillSync=crypto_module[\"randomFillSync\"];if(randomFillSync){return view=>crypto_module[\"randomFillSync\"](view)}var randomBytes=crypto_module[\"randomBytes\"];return view=>(view.set(randomBytes(view.byteLength)),view)}catch(e){}}abort(\"initRandomDevice\")}function randomFill(view){return(randomFill=initRandomFill())(view)}var PATH_FS={resolve:function(){var resolvedPath=\"\",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!=\"string\"){throw new TypeError(\"Arguments to path.resolve must be strings\")}else if(!path){return\"\"}resolvedPath=path+\"/\"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split(\"/\").filter(p=>!!p),!resolvedAbsolute).join(\"/\");return(resolvedAbsolute?\"/\":\"\")+resolvedPath||\".\"},relative:(from,to)=>{from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!==\"\")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!==\"\")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split(\"/\"));var toParts=trim(to.split(\"/\"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push(\"..\")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join(\"/\")}};function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var TTY={ttys:[],init:function(){},shutdown:function(){},register:function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open:function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close:function(stream){stream.tty.ops.fsync(stream.tty)},fsync:function(stream){stream.tty.ops.fsync(stream.tty)},read:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.timestamp=Date.now()}return i}},default_tty_ops:{get_char:function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;try{bytesRead=fs.readSync(process.stdin.fd,buf,0,BUFSIZE,-1)}catch(e){if(e.toString().includes(\"EOF\"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString(\"utf-8\")}else{result=null}}else if(typeof window!=\"undefined\"&&typeof window.prompt==\"function\"){result=window.prompt(\"Input: \");if(result!==null){result+=\"\\n\"}}else if(typeof readline==\"function\"){result=readline();if(result!==null){result+=\"\\n\"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()},put_char:function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync:function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}}},default_tty1_ops:{put_char:function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync:function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}}}};function zeroMemory(address,size){HEAPU8.fill(0,address,address+size);return address}function alignMemory(size,alignment){return Math.ceil(size/alignment)*alignment}function mmapAlloc(size){size=alignMemory(size,65536);var ptr=_emscripten_builtin_memalign(65536,size);if(!ptr)return 0;return zeroMemory(ptr,size)}var MEMFS={ops_table:null,mount:function(mount){return MEMFS.createNode(null,\"/\",16384|511,0)},createNode:function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node;parent.timestamp=node.timestamp}return node},getFileDataAsTypedArray:function(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage:function(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage:function(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr:function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr:function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup:function(parent,name){throw FS.genericErrors[44]},mknod:function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename:function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}}delete old_node.parent.contents[old_node.name];old_node.parent.timestamp=Date.now();old_node.name=new_name;new_dir.contents[new_name]=old_node;new_dir.timestamp=old_node.parent.timestamp;old_node.parent=new_dir},unlink:function(parent,name){delete parent.contents[name];parent.timestamp=Date.now()},rmdir:function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.timestamp=Date.now()},readdir:function(node){var entries=[\".\",\"..\"];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries},symlink:function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink:function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read:function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write:function(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek:function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate:function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap:function(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents.buffer===HEAP8.buffer){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}HEAP8.set(contents,ptr)}return{ptr:ptr,allocated:allocated}},msync:function(stream,buffer,offset,length,mmapFlags){MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};function asyncLoad(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency(`al ${url}`):\"\";readAsync(url,arrayBuffer=>{assert(arrayBuffer,`Loading data file \"${url}\" failed (no arrayBuffer).`);onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)},event=>{if(onerror){onerror()}else{throw`Loading data file \"${url}\" failed.`}});if(dep)addRunDependency(dep)}var preloadPlugins=Module[\"preloadPlugins\"]||[];function FS_handledByPreloadPlugin(byteArray,fullname,finish,onerror){if(typeof Browser!=\"undefined\")Browser.init();var handled=false;preloadPlugins.forEach(function(plugin){if(handled)return;if(plugin[\"canHandle\"](fullname)){plugin[\"handle\"](byteArray,fullname,finish,onerror);handled=true}});return handled}function FS_createPreloadedFile(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish){var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency(`cp ${fullname}`);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}if(FS_handledByPreloadPlugin(byteArray,fullname,finish,()=>{if(onerror)onerror();removeRunDependency(dep)})){return}finish(byteArray)}addRunDependency(dep);if(typeof url==\"string\"){asyncLoad(url,byteArray=>processData(byteArray),onerror)}else{processData(url)}}function FS_modeStringToFlags(str){var flagModes={\"r\":0,\"r+\":2,\"w\":512|64|1,\"w+\":512|64|2,\"a\":1024|64|1,\"a+\":1024|64|2};var flags=flagModes[str];if(typeof flags==\"undefined\"){throw new Error(`Unknown file open mode: ${str}`)}return flags}function FS_getMode(canRead,canWrite){var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode}var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:function(mount){assert(ENVIRONMENT_IS_WORKER);if(!WORKERFS.reader)WORKERFS.reader=new FileReaderSync;var root=WORKERFS.createNode(null,\"/\",WORKERFS.DIR_MODE,0);var createdParents={};function ensureParent(path){var parts=path.split(\"/\");var parent=root;for(var i=0;i<parts.length-1;i++){var curr=parts.slice(0,i+1).join(\"/\");if(!createdParents[curr]){createdParents[curr]=WORKERFS.createNode(parent,parts[i],WORKERFS.DIR_MODE,0)}parent=createdParents[curr]}return parent}function base(path){var parts=path.split(\"/\");return parts[parts.length-1]}Array.prototype.forEach.call(mount.opts[\"files\"]||[],function(file){WORKERFS.createNode(ensureParent(file.name),base(file.name),WORKERFS.FILE_MODE,0,file,file.lastModifiedDate)});(mount.opts[\"blobs\"]||[]).forEach(function(obj){WORKERFS.createNode(ensureParent(obj[\"name\"]),base(obj[\"name\"]),WORKERFS.FILE_MODE,0,obj[\"data\"])});(mount.opts[\"packages\"]||[]).forEach(function(pack){pack[\"metadata\"].files.forEach(function(file){var name=file.filename.substr(1);WORKERFS.createNode(ensureParent(name),base(name),WORKERFS.FILE_MODE,0,pack[\"blob\"].slice(file.start,file.end))})});return root},createNode:function(parent,name,mode,dev,contents,mtime){var node=FS.createNode(parent,name,mode);node.mode=mode;node.node_ops=WORKERFS.node_ops;node.stream_ops=WORKERFS.stream_ops;node.timestamp=(mtime||new Date).getTime();assert(WORKERFS.FILE_MODE!==WORKERFS.DIR_MODE);if(mode===WORKERFS.FILE_MODE){node.size=contents.size;node.contents=contents}else{node.size=4096;node.contents={}}if(parent){parent.contents[name]=node}return node},node_ops:{getattr:function(node){return{dev:1,ino:node.id,mode:node.mode,nlink:1,uid:0,gid:0,rdev:undefined,size:node.size,atime:new Date(node.timestamp),mtime:new Date(node.timestamp),ctime:new Date(node.timestamp),blksize:4096,blocks:Math.ceil(node.size/4096)}},setattr:function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}},lookup:function(parent,name){throw new FS.ErrnoError(44)},mknod:function(parent,name,mode,dev){throw new FS.ErrnoError(63)},rename:function(oldNode,newDir,newName){throw new FS.ErrnoError(63)},unlink:function(parent,name){throw new FS.ErrnoError(63)},rmdir:function(parent,name){throw new FS.ErrnoError(63)},readdir:function(node){var entries=[\".\",\"..\"];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries},symlink:function(parent,newName,oldPath){throw new FS.ErrnoError(63)}},stream_ops:{read:function(stream,buffer,offset,length,position){if(position>=stream.node.size)return 0;var chunk=stream.node.contents.slice(position,position+length);var ab=WORKERFS.reader.readAsArrayBuffer(chunk);buffer.set(new Uint8Array(ab),offset);return chunk.size},write:function(stream,buffer,offset,length,position){throw new FS.ErrnoError(29)},llseek:function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.size}}if(position<0){throw new FS.ErrnoError(28)}return position}}};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:\"/\",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(path,opts={})=>{path=PATH_FS.resolve(path);if(!path)return{path:\"\",node:null};var defaults={follow_mount:true,recurse_count:0};opts=Object.assign(defaults,opts);if(opts.recurse_count>8){throw new FS.ErrnoError(32)}var parts=path.split(\"/\").filter(p=>!!p);var current=FS.root;var current_path=\"/\";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH_FS.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count+1});current=lookup.node;if(count++>40){throw new FS.ErrnoError(32)}}}}return{path:current_path,node:current}},getPath:node=>{var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!==\"/\"?`${mount}/${path}`:mount+path}path=path?`${node.name}/${path}`:node.name;node=node.parent}},hashName:(parentid,name)=>{var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode:node=>{var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode:node=>{var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode:(parent,name)=>{var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode:(parent,name,mode,rdev)=>{var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode:node=>{FS.hashRemoveNode(node)},isRoot:node=>{return node===node.parent},isMountpoint:node=>{return!!node.mounted},isFile:mode=>{return(mode&61440)===32768},isDir:mode=>{return(mode&61440)===16384},isLink:mode=>{return(mode&61440)===40960},isChrdev:mode=>{return(mode&61440)===8192},isBlkdev:mode=>{return(mode&61440)===24576},isFIFO:mode=>{return(mode&61440)===4096},isSocket:mode=>{return(mode&49152)===49152},flagsToPermissionString:flag=>{var perms=[\"r\",\"w\",\"rw\"][flag&3];if(flag&512){perms+=\"w\"}return perms},nodePermissions:(node,perms)=>{if(FS.ignorePermissions){return 0}if(perms.includes(\"r\")&&!(node.mode&292)){return 2}else if(perms.includes(\"w\")&&!(node.mode&146)){return 2}else if(perms.includes(\"x\")&&!(node.mode&73)){return 2}return 0},mayLookup:dir=>{var errCode=FS.nodePermissions(dir,\"x\");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate:(dir,name)=>{try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,\"wx\")},mayDelete:(dir,name,isdir)=>{var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,\"wx\");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen:(node,flags)=>{if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!==\"r\"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd:()=>{for(var fd=0;fd<=FS.MAX_OPEN_FDS;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStream:fd=>FS.streams[fd],createStream:(stream,fd=-1)=>{if(!FS.FSStream){FS.FSStream=function(){this.shared={}};FS.FSStream.prototype={};Object.defineProperties(FS.FSStream.prototype,{object:{get:function(){return this.node},set:function(val){this.node=val}},isRead:{get:function(){return(this.flags&2097155)!==1}},isWrite:{get:function(){return(this.flags&2097155)!==0}},isAppend:{get:function(){return this.flags&1024}},flags:{get:function(){return this.shared.flags},set:function(val){this.shared.flags=val}},position:{get:function(){return this.shared.position},set:function(val){this.shared.position=val}}})}stream=Object.assign(new FS.FSStream,stream);if(fd==-1){fd=FS.nextfd()}stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream:fd=>{FS.streams[fd]=null},chrdev_stream_ops:{open:stream=>{var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}},llseek:()=>{throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice:(dev,ops)=>{FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts:mount=>{var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts},syncfs:(populate,callback)=>{if(typeof populate==\"function\"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount:(type,opts,mountpoint)=>{var root=mountpoint===\"/\";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount:mountpoint=>{var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup:(parent,name)=>{return parent.node_ops.lookup(parent,name)},mknod:(path,mode,dev)=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name===\".\"||name===\"..\"){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},create:(path,mode)=>{mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir:(path,mode)=>{mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree:(path,mode)=>{var dirs=path.split(\"/\");var d=\"\";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+=\"/\"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev:(path,mode,dev)=>{if(typeof dev==\"undefined\"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink:(oldpath,newpath)=>{if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename:(old_path,new_path)=>{var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!==\".\"){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!==\".\"){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,\"w\");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir:path=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir:path=>{var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink:path=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink:path=>{var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return PATH_FS.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))},stat:(path,dontFollow)=>{var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat:path=>{return FS.stat(path,true)},chmod:(path,mode,dontFollow)=>{var node;if(typeof path==\"string\"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})},lchmod:(path,mode)=>{FS.chmod(path,mode,true)},fchmod:(fd,mode)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chmod(stream.node,mode)},chown:(path,uid,gid,dontFollow)=>{var node;if(typeof path==\"string\"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown:(path,uid,gid)=>{FS.chown(path,uid,gid,true)},fchown:(fd,uid,gid)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chown(stream.node,uid,gid)},truncate:(path,len)=>{if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path==\"string\"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,\"w\");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate:(fd,len)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime:(path,atime,mtime)=>{var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})},open:(path,flags,mode)=>{if(path===\"\"){throw new FS.ErrnoError(44)}flags=typeof flags==\"string\"?FS_modeStringToFlags(flags):flags;mode=typeof mode==\"undefined\"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path==\"object\"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module[\"logReadFiles\"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close:stream=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed:stream=>{return stream.fd===null},llseek:(stream,offset,whence)=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read:(stream,buffer,offset,length,position)=>{if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!=\"undefined\";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write:(stream,buffer,offset,length,position,canOwn)=>{if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!=\"undefined\";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},allocate:(stream,offset,length)=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap:(stream,length,position,prot,flags)=>{if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync:(stream,buffer,offset,length,mmapFlags)=>{if(!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},munmap:stream=>0,ioctl:(stream,cmd,arg)=>{if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile:(path,opts={})=>{opts.flags=opts.flags||0;opts.encoding=opts.encoding||\"binary\";if(opts.encoding!==\"utf8\"&&opts.encoding!==\"binary\"){throw new Error(`Invalid encoding type \"${opts.encoding}\"`)}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding===\"utf8\"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding===\"binary\"){ret=buf}FS.close(stream);return ret},writeFile:(path,data,opts={})=>{opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data==\"string\"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error(\"Unsupported data type\")}FS.close(stream)},cwd:()=>FS.currentPath,chdir:path=>{var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,\"x\");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories:()=>{FS.mkdir(\"/tmp\");FS.mkdir(\"/home\");FS.mkdir(\"/home/web_user\")},createDefaultDevices:()=>{FS.mkdir(\"/dev\");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length});FS.mkdev(\"/dev/null\",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev(\"/dev/tty\",FS.makedev(5,0));FS.mkdev(\"/dev/tty1\",FS.makedev(6,0));var randomBuffer=new Uint8Array(1024),randomLeft=0;var randomByte=()=>{if(randomLeft===0){randomLeft=randomFill(randomBuffer).byteLength}return randomBuffer[--randomLeft]};FS.createDevice(\"/dev\",\"random\",randomByte);FS.createDevice(\"/dev\",\"urandom\",randomByte);FS.mkdir(\"/dev/shm\");FS.mkdir(\"/dev/shm/tmp\")},createSpecialDirectories:()=>{FS.mkdir(\"/proc\");var proc_self=FS.mkdir(\"/proc/self\");FS.mkdir(\"/proc/self/fd\");FS.mount({mount:()=>{var node=FS.createNode(proc_self,\"fd\",16384|511,73);node.node_ops={lookup:(parent,name)=>{var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var ret={parent:null,mount:{mountpoint:\"fake\"},node_ops:{readlink:()=>stream.path}};ret.parent=ret;return ret}};return node}},{},\"/proc/self/fd\")},createStandardStreams:()=>{if(Module[\"stdin\"]){FS.createDevice(\"/dev\",\"stdin\",Module[\"stdin\"])}else{FS.symlink(\"/dev/tty\",\"/dev/stdin\")}if(Module[\"stdout\"]){FS.createDevice(\"/dev\",\"stdout\",null,Module[\"stdout\"])}else{FS.symlink(\"/dev/tty\",\"/dev/stdout\")}if(Module[\"stderr\"]){FS.createDevice(\"/dev\",\"stderr\",null,Module[\"stderr\"])}else{FS.symlink(\"/dev/tty1\",\"/dev/stderr\")}var stdin=FS.open(\"/dev/stdin\",0);var stdout=FS.open(\"/dev/stdout\",1);var stderr=FS.open(\"/dev/stderr\",1)},ensureErrnoError:()=>{if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.name=\"ErrnoError\";this.node=node;this.setErrno=function(errno){this.errno=errno};this.setErrno(errno);this.message=\"FS error\"};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[44].forEach(code=>{FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack=\"<generic error, no stack>\"})},staticInit:()=>{FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},\"/\");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={\"MEMFS\":MEMFS,\"WORKERFS\":WORKERFS}},init:(input,output,error)=>{FS.init.initialized=true;FS.ensureErrnoError();Module[\"stdin\"]=input||Module[\"stdin\"];Module[\"stdout\"]=output||Module[\"stdout\"];Module[\"stderr\"]=error||Module[\"stderr\"];FS.createStandardStreams()},quit:()=>{FS.init.initialized=false;for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},findObject:(path,dontResolveLastLink)=>{var ret=FS.analyzePath(path,dontResolveLastLink);if(!ret.exists){return null}return ret.object},analyzePath:(path,dontResolveLastLink)=>{try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path===\"/\"}catch(e){ret.error=e.errno}return ret},createPath:(parent,path,canRead,canWrite)=>{parent=typeof parent==\"string\"?parent:FS.getPath(parent);var parts=path.split(\"/\").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile:(parent,name,properties,canRead,canWrite)=>{var path=PATH.join2(typeof parent==\"string\"?parent:FS.getPath(parent),name);var mode=FS_getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile:(parent,name,data,canRead,canWrite,canOwn)=>{var path=name;if(parent){parent=typeof parent==\"string\"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS_getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data==\"string\"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node},createDevice:(parent,name,input,output)=>{var path=PATH.join2(typeof parent==\"string\"?parent:FS.getPath(parent),name);var mode=FS_getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:stream=>{stream.seekable=false},close:stream=>{if(output&&output.buffer&&output.buffer.length){output(10)}},read:(stream,buffer,offset,length,pos)=>{var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:(stream,buffer,offset,length,pos)=>{for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.timestamp=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile:obj=>{if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!=\"undefined\"){throw new Error(\"Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.\")}else if(read_){try{obj.contents=intArrayFromString(read_(obj.url),true);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}else{throw new Error(\"Cannot load without read() or XMLHttpRequest.\")}},createLazyFile:(parent,name,url,canRead,canWrite)=>{function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open(\"HEAD\",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error(\"Couldn't load \"+url+\". Status: \"+xhr.status);var datalength=Number(xhr.getResponseHeader(\"Content-length\"));var header;var hasByteServing=(header=xhr.getResponseHeader(\"Accept-Ranges\"))&&header===\"bytes\";var usesGzip=(header=xhr.getResponseHeader(\"Content-Encoding\"))&&header===\"gzip\";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)throw new Error(\"invalid range (\"+from+\", \"+to+\") or no bytes requested!\");if(to>datalength-1)throw new Error(\"only \"+datalength+\" bytes available! programmer error!\");var xhr=new XMLHttpRequest;xhr.open(\"GET\",url,false);if(datalength!==chunkSize)xhr.setRequestHeader(\"Range\",\"bytes=\"+from+\"-\"+to);xhr.responseType=\"arraybuffer\";if(xhr.overrideMimeType){xhr.overrideMimeType(\"text/plain; charset=x-user-defined\")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error(\"Couldn't load \"+url+\". Status: \"+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}return intArrayFromString(xhr.responseText||\"\",true)};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]==\"undefined\"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]==\"undefined\")throw new Error(\"doXHR failed!\");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out(\"LazyFiles on gzip forces download of the whole file when length is accessed\")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!=\"undefined\"){if(!ENVIRONMENT_IS_WORKER)throw\"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc\";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._length}},chunkSize:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){FS.forceLoadFile(node);return fn.apply(null,arguments)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr:ptr,allocated:true}};node.stream_ops=stream_ops;return node}};var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt:function(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=SYSCALLS.getStreamFromFD(dirfd);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return PATH.join2(dir,path)},doStat:function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-54}throw e}HEAP32[buf>>2]=stat.dev;HEAP32[buf+8>>2]=stat.ino;HEAP32[buf+12>>2]=stat.mode;HEAPU32[buf+16>>2]=stat.nlink;HEAP32[buf+20>>2]=stat.uid;HEAP32[buf+24>>2]=stat.gid;HEAP32[buf+28>>2]=stat.rdev;HEAP64[buf+40>>3]=BigInt(stat.size);HEAP32[buf+48>>2]=4096;HEAP32[buf+52>>2]=stat.blocks;var atime=stat.atime.getTime();var mtime=stat.mtime.getTime();var ctime=stat.ctime.getTime();HEAP64[buf+56>>3]=BigInt(Math.floor(atime/1e3));HEAPU32[buf+64>>2]=atime%1e3*1e3;HEAP64[buf+72>>3]=BigInt(Math.floor(mtime/1e3));HEAPU32[buf+80>>2]=mtime%1e3*1e3;HEAP64[buf+88>>3]=BigInt(Math.floor(ctime/1e3));HEAPU32[buf+96>>2]=ctime%1e3*1e3;HEAP64[buf+104>>3]=BigInt(stat.ino);return 0},doMsync:function(addr,stream,len,flags,offset){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(flags&2){return 0}var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},getStreamFromFD:function(fd){var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);return stream}};function ___syscall__newselect(nfds,readfds,writefds,exceptfds,timeout){try{var total=0;var srcReadLow=readfds?HEAP32[readfds>>2]:0,srcReadHigh=readfds?HEAP32[readfds+4>>2]:0;var srcWriteLow=writefds?HEAP32[writefds>>2]:0,srcWriteHigh=writefds?HEAP32[writefds+4>>2]:0;var srcExceptLow=exceptfds?HEAP32[exceptfds>>2]:0,srcExceptHigh=exceptfds?HEAP32[exceptfds+4>>2]:0;var dstReadLow=0,dstReadHigh=0;var dstWriteLow=0,dstWriteHigh=0;var dstExceptLow=0,dstExceptHigh=0;var allLow=(readfds?HEAP32[readfds>>2]:0)|(writefds?HEAP32[writefds>>2]:0)|(exceptfds?HEAP32[exceptfds>>2]:0);var allHigh=(readfds?HEAP32[readfds+4>>2]:0)|(writefds?HEAP32[writefds+4>>2]:0)|(exceptfds?HEAP32[exceptfds+4>>2]:0);var check=function(fd,low,high,val){return fd<32?low&val:high&val};for(var fd=0;fd<nfds;fd++){var mask=1<<fd%32;if(!check(fd,allLow,allHigh,mask)){continue}var stream=SYSCALLS.getStreamFromFD(fd);var flags=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){flags=stream.stream_ops.poll(stream)}if(flags&1&&check(fd,srcReadLow,srcReadHigh,mask)){fd<32?dstReadLow=dstReadLow|mask:dstReadHigh=dstReadHigh|mask;total++}if(flags&4&&check(fd,srcWriteLow,srcWriteHigh,mask)){fd<32?dstWriteLow=dstWriteLow|mask:dstWriteHigh=dstWriteHigh|mask;total++}if(flags&2&&check(fd,srcExceptLow,srcExceptHigh,mask)){fd<32?dstExceptLow=dstExceptLow|mask:dstExceptHigh=dstExceptHigh|mask;total++}}if(readfds){HEAP32[readfds>>2]=dstReadLow;HEAP32[readfds+4>>2]=dstReadHigh}if(writefds){HEAP32[writefds>>2]=dstWriteLow;HEAP32[writefds+4>>2]=dstWriteHigh}if(exceptfds){HEAP32[exceptfds>>2]=dstExceptLow;HEAP32[exceptfds+4>>2]=dstExceptHigh}return total}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}var SOCKFS={mount:function(mount){Module[\"websocket\"]=Module[\"websocket\"]&&\"object\"===typeof Module[\"websocket\"]?Module[\"websocket\"]:{};Module[\"websocket\"]._callbacks={};Module[\"websocket\"][\"on\"]=function(event,callback){if(\"function\"===typeof callback){this._callbacks[event]=callback}return this};Module[\"websocket\"].emit=function(event,param){if(\"function\"===typeof this._callbacks[event]){this._callbacks[event].call(this,param)}};return FS.createNode(null,\"/\",16384|511,0)},createSocket:function(family,type,protocol){type&=~526336;var streaming=type==1;if(streaming&&protocol&&protocol!=6){throw new FS.ErrnoError(66)}var sock={family:family,type:type,protocol:protocol,server:null,error:null,peers:{},pending:[],recv_queue:[],sock_ops:SOCKFS.websocket_sock_ops};var name=SOCKFS.nextname();var node=FS.createNode(SOCKFS.root,name,49152,0);node.sock=sock;var stream=FS.createStream({path:name,node:node,flags:2,seekable:false,stream_ops:SOCKFS.stream_ops});sock.stream=stream;return sock},getSocket:function(fd){var stream=FS.getStream(fd);if(!stream||!FS.isSocket(stream.node.mode)){return null}return stream.node.sock},stream_ops:{poll:function(stream){var sock=stream.node.sock;return sock.sock_ops.poll(sock)},ioctl:function(stream,request,varargs){var sock=stream.node.sock;return sock.sock_ops.ioctl(sock,request,varargs)},read:function(stream,buffer,offset,length,position){var sock=stream.node.sock;var msg=sock.sock_ops.recvmsg(sock,length);if(!msg){return 0}buffer.set(msg.buffer,offset);return msg.buffer.length},write:function(stream,buffer,offset,length,position){var sock=stream.node.sock;return sock.sock_ops.sendmsg(sock,buffer,offset,length)},close:function(stream){var sock=stream.node.sock;sock.sock_ops.close(sock)}},nextname:function(){if(!SOCKFS.nextname.current){SOCKFS.nextname.current=0}return\"socket[\"+SOCKFS.nextname.current+++\"]\"},websocket_sock_ops:{createPeer:function(sock,addr,port){var ws;if(typeof addr==\"object\"){ws=addr;addr=null;port=null}if(ws){if(ws._socket){addr=ws._socket.remoteAddress;port=ws._socket.remotePort}else{var result=/ws[s]?:\\/\\/([^:]+):(\\d+)/.exec(ws.url);if(!result){throw new Error(\"WebSocket URL must be in the format ws(s)://address:port\")}addr=result[1];port=parseInt(result[2],10)}}else{try{var runtimeConfig=Module[\"websocket\"]&&\"object\"===typeof Module[\"websocket\"];var url=\"ws:#\".replace(\"#\",\"//\");if(runtimeConfig){if(\"string\"===typeof Module[\"websocket\"][\"url\"]){url=Module[\"websocket\"][\"url\"]}}if(url===\"ws://\"||url===\"wss://\"){var parts=addr.split(\"/\");url=url+parts[0]+\":\"+port+\"/\"+parts.slice(1).join(\"/\")}var subProtocols=\"binary\";if(runtimeConfig){if(\"string\"===typeof Module[\"websocket\"][\"subprotocol\"]){subProtocols=Module[\"websocket\"][\"subprotocol\"]}}var opts=undefined;if(subProtocols!==\"null\"){subProtocols=subProtocols.replace(/^ +| +$/g,\"\").split(/ *, */);opts=subProtocols}if(runtimeConfig&&null===Module[\"websocket\"][\"subprotocol\"]){subProtocols=\"null\";opts=undefined}var WebSocketConstructor;if(ENVIRONMENT_IS_NODE){WebSocketConstructor=require(\"ws\")}else{WebSocketConstructor=WebSocket}ws=new WebSocketConstructor(url,opts);ws.binaryType=\"arraybuffer\"}catch(e){throw new FS.ErrnoError(23)}}var peer={addr:addr,port:port,socket:ws,dgram_send_queue:[]};SOCKFS.websocket_sock_ops.addPeer(sock,peer);SOCKFS.websocket_sock_ops.handlePeerEvents(sock,peer);if(sock.type===2&&typeof sock.sport!=\"undefined\"){peer.dgram_send_queue.push(new Uint8Array([255,255,255,255,\"p\".charCodeAt(0),\"o\".charCodeAt(0),\"r\".charCodeAt(0),\"t\".charCodeAt(0),(sock.sport&65280)>>8,sock.sport&255]))}return peer},getPeer:function(sock,addr,port){return sock.peers[addr+\":\"+port]},addPeer:function(sock,peer){sock.peers[peer.addr+\":\"+peer.port]=peer},removePeer:function(sock,peer){delete sock.peers[peer.addr+\":\"+peer.port]},handlePeerEvents:function(sock,peer){var first=true;var handleOpen=function(){Module[\"websocket\"].emit(\"open\",sock.stream.fd);try{var queued=peer.dgram_send_queue.shift();while(queued){peer.socket.send(queued);queued=peer.dgram_send_queue.shift()}}catch(e){peer.socket.close()}};function handleMessage(data){if(typeof data==\"string\"){var encoder=new TextEncoder;data=encoder.encode(data)}else{assert(data.byteLength!==undefined);if(data.byteLength==0){return}data=new Uint8Array(data)}var wasfirst=first;first=false;if(wasfirst&&data.length===10&&data[0]===255&&data[1]===255&&data[2]===255&&data[3]===255&&data[4]===\"p\".charCodeAt(0)&&data[5]===\"o\".charCodeAt(0)&&data[6]===\"r\".charCodeAt(0)&&data[7]===\"t\".charCodeAt(0)){var newport=data[8]<<8|data[9];SOCKFS.websocket_sock_ops.removePeer(sock,peer);peer.port=newport;SOCKFS.websocket_sock_ops.addPeer(sock,peer);return}sock.recv_queue.push({addr:peer.addr,port:peer.port,data:data});Module[\"websocket\"].emit(\"message\",sock.stream.fd)}if(ENVIRONMENT_IS_NODE){peer.socket.on(\"open\",handleOpen);peer.socket.on(\"message\",function(data,isBinary){if(!isBinary){return}handleMessage(new Uint8Array(data).buffer)});peer.socket.on(\"close\",function(){Module[\"websocket\"].emit(\"close\",sock.stream.fd)});peer.socket.on(\"error\",function(error){sock.error=14;Module[\"websocket\"].emit(\"error\",[sock.stream.fd,sock.error,\"ECONNREFUSED: Connection refused\"])})}else{peer.socket.onopen=handleOpen;peer.socket.onclose=function(){Module[\"websocket\"].emit(\"close\",sock.stream.fd)};peer.socket.onmessage=function peer_socket_onmessage(event){handleMessage(event.data)};peer.socket.onerror=function(error){sock.error=14;Module[\"websocket\"].emit(\"error\",[sock.stream.fd,sock.error,\"ECONNREFUSED: Connection refused\"])}}},poll:function(sock){if(sock.type===1&&sock.server){return sock.pending.length?64|1:0}var mask=0;var dest=sock.type===1?SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport):null;if(sock.recv_queue.length||!dest||dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=64|1}if(!dest||dest&&dest.socket.readyState===dest.socket.OPEN){mask|=4}if(dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=16}return mask},ioctl:function(sock,request,arg){switch(request){case 21531:var bytes=0;if(sock.recv_queue.length){bytes=sock.recv_queue[0].data.length}HEAP32[arg>>2]=bytes;return 0;default:return 28}},close:function(sock){if(sock.server){try{sock.server.close()}catch(e){}sock.server=null}var peers=Object.keys(sock.peers);for(var i=0;i<peers.length;i++){var peer=sock.peers[peers[i]];try{peer.socket.close()}catch(e){}SOCKFS.websocket_sock_ops.removePeer(sock,peer)}return 0},bind:function(sock,addr,port){if(typeof sock.saddr!=\"undefined\"||typeof sock.sport!=\"undefined\"){throw new FS.ErrnoError(28)}sock.saddr=addr;sock.sport=port;if(sock.type===2){if(sock.server){sock.server.close();sock.server=null}try{sock.sock_ops.listen(sock,0)}catch(e){if(!(e.name===\"ErrnoError\"))throw e;if(e.errno!==138)throw e}}},connect:function(sock,addr,port){if(sock.server){throw new FS.ErrnoError(138)}if(typeof sock.daddr!=\"undefined\"&&typeof sock.dport!=\"undefined\"){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(dest){if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(7)}else{throw new FS.ErrnoError(30)}}}var peer=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port);sock.daddr=peer.addr;sock.dport=peer.port;throw new FS.ErrnoError(26)},listen:function(sock,backlog){if(!ENVIRONMENT_IS_NODE){throw new FS.ErrnoError(138)}if(sock.server){throw new FS.ErrnoError(28)}var WebSocketServer=require(\"ws\").Server;var host=sock.saddr;sock.server=new WebSocketServer({host:host,port:sock.sport});Module[\"websocket\"].emit(\"listen\",sock.stream.fd);sock.server.on(\"connection\",function(ws){if(sock.type===1){var newsock=SOCKFS.createSocket(sock.family,sock.type,sock.protocol);var peer=SOCKFS.websocket_sock_ops.createPeer(newsock,ws);newsock.daddr=peer.addr;newsock.dport=peer.port;sock.pending.push(newsock);Module[\"websocket\"].emit(\"connection\",newsock.stream.fd)}else{SOCKFS.websocket_sock_ops.createPeer(sock,ws);Module[\"websocket\"].emit(\"connection\",sock.stream.fd)}});sock.server.on(\"close\",function(){Module[\"websocket\"].emit(\"close\",sock.stream.fd);sock.server=null});sock.server.on(\"error\",function(error){sock.error=23;Module[\"websocket\"].emit(\"error\",[sock.stream.fd,sock.error,\"EHOSTUNREACH: Host is unreachable\"])})},accept:function(listensock){if(!listensock.server||!listensock.pending.length){throw new FS.ErrnoError(28)}var newsock=listensock.pending.shift();newsock.stream.flags=listensock.stream.flags;return newsock},getname:function(sock,peer){var addr,port;if(peer){if(sock.daddr===undefined||sock.dport===undefined){throw new FS.ErrnoError(53)}addr=sock.daddr;port=sock.dport}else{addr=sock.saddr||0;port=sock.sport||0}return{addr:addr,port:port}},sendmsg:function(sock,buffer,offset,length,addr,port){if(sock.type===2){if(addr===undefined||port===undefined){addr=sock.daddr;port=sock.dport}if(addr===undefined||port===undefined){throw new FS.ErrnoError(17)}}else{addr=sock.daddr;port=sock.dport}var dest=SOCKFS.websocket_sock_ops.getPeer(sock,addr,port);if(sock.type===1){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){throw new FS.ErrnoError(53)}else if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(6)}}if(ArrayBuffer.isView(buffer)){offset+=buffer.byteOffset;buffer=buffer.buffer}var data;data=buffer.slice(offset,offset+length);if(sock.type===2){if(!dest||dest.socket.readyState!==dest.socket.OPEN){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){dest=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port)}dest.dgram_send_queue.push(data);return length}}try{dest.socket.send(data);return length}catch(e){throw new FS.ErrnoError(28)}},recvmsg:function(sock,length){if(sock.type===1&&sock.server){throw new FS.ErrnoError(53)}var queued=sock.recv_queue.shift();if(!queued){if(sock.type===1){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(!dest){throw new FS.ErrnoError(53)}if(dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){return null}throw new FS.ErrnoError(6)}throw new FS.ErrnoError(6)}var queuedLength=queued.data.byteLength||queued.data.length;var queuedOffset=queued.data.byteOffset||0;var queuedBuffer=queued.data.buffer||queued.data;var bytesRead=Math.min(length,queuedLength);var res={buffer:new Uint8Array(queuedBuffer,queuedOffset,bytesRead),addr:queued.addr,port:queued.port};if(sock.type===1&&bytesRead<queuedLength){var bytesRemaining=queuedLength-bytesRead;queued.data=new Uint8Array(queuedBuffer,queuedOffset+bytesRead,bytesRemaining);sock.recv_queue.unshift(queued)}return res}}};function getSocketFromFD(fd){var socket=SOCKFS.getSocket(fd);if(!socket)throw new FS.ErrnoError(8);return socket}function setErrNo(value){HEAP32[___errno_location()>>2]=value;return value}function inetPton4(str){var b=str.split(\".\");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function jstoi_q(str){return parseInt(str)}function inetPton6(str){var words;var w,offset,z;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str===\"::\"){return[0,0,0,0,0,0,0,0]}if(str.startsWith(\"::\")){str=str.replace(\"::\",\"Z:\")}else{str=str.replace(\"::\",\":Z:\")}if(str.indexOf(\".\")>0){str=str.replace(new RegExp(\"[.]\",\"g\"),\":\");words=str.split(\":\");words[words.length-4]=jstoi_q(words[words.length-4])+jstoi_q(words[words.length-3])*256;words[words.length-3]=jstoi_q(words[words.length-2])+jstoi_q(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(\":\")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]==\"string\"){if(words[w]===\"Z\"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}function writeSockaddr(sa,family,addr,port,addrlen){switch(family){case 2:addr=inetPton4(addr);zeroMemory(sa,16);if(addrlen){HEAP32[addrlen>>2]=16}HEAP16[sa>>1]=family;HEAP32[sa+4>>2]=addr;HEAP16[sa+2>>1]=_htons(port);break;case 10:addr=inetPton6(addr);zeroMemory(sa,28);if(addrlen){HEAP32[addrlen>>2]=28}HEAP32[sa>>2]=family;HEAP32[sa+8>>2]=addr[0];HEAP32[sa+12>>2]=addr[1];HEAP32[sa+16>>2]=addr[2];HEAP32[sa+20>>2]=addr[3];HEAP16[sa+2>>1]=_htons(port);break;default:return 5}return 0}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:function(name){var res=inetPton4(name);if(res!==null){return name}res=inetPton6(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,\"exceeded max address mappings of 65535\");addr=\"172.29.\"+(id&255)+\".\"+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr},lookup_addr:function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null}};function ___syscall_accept4(fd,addr,addrlen,flags,d1,d2){try{var sock=getSocketFromFD(fd);var newsock=sock.sock_ops.accept(sock);if(addr){var errno=writeSockaddr(addr,newsock.family,DNS.lookup_name(newsock.daddr),newsock.dport,addrlen)}return newsock.stream.fd}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function inetNtop4(addr){return(addr&255)+\".\"+(addr>>8&255)+\".\"+(addr>>16&255)+\".\"+(addr>>24&255)}function inetNtop6(ints){var str=\"\";var word=0;var longest=0;var lastzero=0;var zstart=0;var len=0;var i=0;var parts=[ints[0]&65535,ints[0]>>16,ints[1]&65535,ints[1]>>16,ints[2]&65535,ints[2]>>16,ints[3]&65535,ints[3]>>16];var hasipv4=true;var v4part=\"\";for(i=0;i<5;i++){if(parts[i]!==0){hasipv4=false;break}}if(hasipv4){v4part=inetNtop4(parts[6]|parts[7]<<16);if(parts[5]===-1){str=\"::ffff:\";str+=v4part;return str}if(parts[5]===0){str=\"::\";if(v4part===\"0.0.0.0\")v4part=\"\";if(v4part===\"0.0.0.1\")v4part=\"1\";str+=v4part;return str}}for(word=0;word<8;word++){if(parts[word]===0){if(word-lastzero>1){len=0}lastzero=word;len++}if(len>longest){longest=len;zstart=word-longest+1}}for(word=0;word<8;word++){if(longest>1){if(parts[word]===0&&word>=zstart&&word<zstart+longest){if(word===zstart){str+=\":\";if(zstart===0)str+=\":\"}continue}}str+=Number(_ntohs(parts[word]&65535)).toString(16);str+=word<7?\":\":\"\"}return str}function readSockaddr(sa,salen){var family=HEAP16[sa>>1];var port=_ntohs(HEAPU16[sa+2>>1]);var addr;switch(family){case 2:if(salen!==16){return{errno:28}}addr=HEAP32[sa+4>>2];addr=inetNtop4(addr);break;case 10:if(salen!==28){return{errno:28}}addr=[HEAP32[sa+8>>2],HEAP32[sa+12>>2],HEAP32[sa+16>>2],HEAP32[sa+20>>2]];addr=inetNtop6(addr);break;default:return{errno:5}}return{family:family,addr:addr,port:port}}function getSocketAddress(addrp,addrlen,allowNull){if(allowNull&&addrp===0)return null;var info=readSockaddr(addrp,addrlen);if(info.errno)throw new FS.ErrnoError(info.errno);info.addr=DNS.lookup_addr(info.addr)||info.addr;return info}function ___syscall_bind(fd,addr,addrlen,d1,d2,d3){try{var sock=getSocketFromFD(fd);var info=getSocketAddress(addr,addrlen);sock.sock_ops.bind(sock,info.addr,info.port);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_connect(fd,addr,addrlen,d1,d2,d3){try{var sock=getSocketFromFD(fd);var info=getSocketAddress(addr,addrlen);sock.sock_ops.connect(sock,info.addr,info.port);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_faccessat(dirfd,path,amode,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(amode&~7){return-28}var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node){return-44}var perms=\"\";if(amode&4)perms+=\"r\";if(amode&2)perms+=\"w\";if(amode&1)perms+=\"x\";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-28}var newStream;newStream=FS.createStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0}case 5:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 6:case 7:return 0;case 16:case 8:return-28;case 9:setErrNo(28);return-1;default:{return-28}}}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_fstat64(fd,buf){try{var stream=SYSCALLS.getStreamFromFD(fd);return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function ___syscall_getdents64(fd,dirp,count){try{var stream=SYSCALLS.getStreamFromFD(fd);if(!stream.getdents){stream.getdents=FS.readdir(stream.path)}var struct_size=280;var pos=0;var off=FS.llseek(stream,0,1);var idx=Math.floor(off/struct_size);while(idx<stream.getdents.length&&pos+struct_size<=count){var id;var type;var name=stream.getdents[idx];if(name===\".\"){id=stream.node.id;type=4}else if(name===\"..\"){var lookup=FS.lookupPath(stream.path,{parent:true});id=lookup.node.id;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}HEAP64[dirp+pos>>3]=BigInt(id);HEAP64[dirp+pos+8>>3]=BigInt((idx+1)*struct_size);HEAP16[dirp+pos+16>>1]=280;HEAP8[dirp+pos+18>>0]=type;stringToUTF8(name,dirp+pos+19,256);pos+=struct_size;idx+=1}FS.llseek(stream,idx*struct_size,0);return pos}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_getpeername(fd,addr,addrlen,d1,d2,d3){try{var sock=getSocketFromFD(fd);if(!sock.daddr){return-53}var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(sock.daddr),sock.dport,addrlen);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_getsockname(fd,addr,addrlen,d1,d2,d3){try{var sock=getSocketFromFD(fd);var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(sock.saddr||\"0.0.0.0\"),sock.sport,addrlen);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_getsockopt(fd,level,optname,optval,optlen,d1){try{var sock=getSocketFromFD(fd);if(level===1){if(optname===4){HEAP32[optval>>2]=sock.error;HEAP32[optlen>>2]=4;sock.error=null;return 0}}return-50}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:case 21505:{if(!stream.tty)return-59;return 0}case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-59;return 0}case 21519:{if(!stream.tty)return-59;var argp=SYSCALLS.get();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;return 0}case 21524:{if(!stream.tty)return-59;return 0}default:return-28}}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_listen(fd,backlog){try{var sock=getSocketFromFD(fd);sock.sock_ops.listen(sock,backlog);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_lstat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_mkdirat(dirfd,path,mode){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);path=PATH.normalize(path);if(path[path.length-1]===\"/\")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_newfstatat(dirfd,path,buf,flags){try{path=SYSCALLS.getStr(path);var nofollow=flags&256;var allowEmpty=flags&4096;flags=flags&~6400;path=SYSCALLS.calculateAt(dirfd,path,allowEmpty);return SYSCALLS.doStat(nofollow?FS.lstat:FS.stat,path,buf)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?SYSCALLS.get():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_poll(fds,nfds,timeout){try{var nonzero=0;for(var i=0;i<nfds;i++){var pollfd=fds+8*i;var fd=HEAP32[pollfd>>2];var events=HEAP16[pollfd+4>>1];var mask=32;var stream=FS.getStream(fd);if(stream){mask=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){mask=stream.stream_ops.poll(stream)}}mask&=events|8|16;if(mask)nonzero++;HEAP16[pollfd+6>>1]=mask}return nonzero}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_recvfrom(fd,buf,len,flags,addr,addrlen){try{var sock=getSocketFromFD(fd);var msg=sock.sock_ops.recvmsg(sock,len);if(!msg)return 0;if(addr){var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(msg.addr),msg.port,addrlen)}HEAPU8.set(msg.buffer,buf);return msg.buffer.byteLength}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_renameat(olddirfd,oldpath,newdirfd,newpath){try{oldpath=SYSCALLS.getStr(oldpath);newpath=SYSCALLS.getStr(newpath);oldpath=SYSCALLS.calculateAt(olddirfd,oldpath);newpath=SYSCALLS.calculateAt(newdirfd,newpath);FS.rename(oldpath,newpath);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_rmdir(path){try{path=SYSCALLS.getStr(path);FS.rmdir(path);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_sendto(fd,message,length,flags,addr,addr_len){try{var sock=getSocketFromFD(fd);var dest=getSocketAddress(addr,addr_len,true);if(!dest){return FS.write(sock.stream,HEAP8,message,length)}return sock.sock_ops.sendmsg(sock,HEAP8,message,length,dest.addr,dest.port)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_socket(domain,type,protocol){try{var sock=SOCKFS.createSocket(domain,type,protocol);return sock.stream.fd}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function ___syscall_unlinkat(dirfd,path,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(flags===0){FS.unlink(path)}else if(flags===512){FS.rmdir(path)}else{abort(\"Invalid flags passed to unlinkat\")}return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}var nowIsMonotonic=true;function __emscripten_get_now_is_monotonic(){return nowIsMonotonic}function __emscripten_throw_longjmp(){throw Infinity}function readI53FromI64(ptr){return HEAPU32[ptr>>2]+HEAP32[ptr+4>>2]*4294967296}function __gmtime_js(time,tmPtr){var date=new Date(readI53FromI64(time)*1e3);HEAP32[tmPtr>>2]=date.getUTCSeconds();HEAP32[tmPtr+4>>2]=date.getUTCMinutes();HEAP32[tmPtr+8>>2]=date.getUTCHours();HEAP32[tmPtr+12>>2]=date.getUTCDate();HEAP32[tmPtr+16>>2]=date.getUTCMonth();HEAP32[tmPtr+20>>2]=date.getUTCFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getUTCDay();var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday}function isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}var MONTH_DAYS_LEAP_CUMULATIVE=[0,31,60,91,121,152,182,213,244,274,305,335];var MONTH_DAYS_REGULAR_CUMULATIVE=[0,31,59,90,120,151,181,212,243,273,304,334];function ydayFromDate(date){var leap=isLeapYear(date.getFullYear());var monthDaysCumulative=leap?MONTH_DAYS_LEAP_CUMULATIVE:MONTH_DAYS_REGULAR_CUMULATIVE;var yday=monthDaysCumulative[date.getMonth()]+date.getDate()-1;return yday}function __localtime_js(time,tmPtr){var date=new Date(readI53FromI64(time)*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var yday=ydayFromDate(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst}function __mktime_js(tmPtr){var date=new Date(HEAP32[tmPtr+20>>2]+1900,HEAP32[tmPtr+16>>2],HEAP32[tmPtr+12>>2],HEAP32[tmPtr+8>>2],HEAP32[tmPtr+4>>2],HEAP32[tmPtr>>2],0);var dst=HEAP32[tmPtr+32>>2];var guessedOffset=date.getTimezoneOffset();var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dstOffset=Math.min(winterOffset,summerOffset);if(dst<0){HEAP32[tmPtr+32>>2]=Number(summerOffset!=winterOffset&&dstOffset==guessedOffset)}else if(dst>0!=(dstOffset==guessedOffset)){var nonDstOffset=Math.max(winterOffset,summerOffset);var trueOffset=dst>0?dstOffset:nonDstOffset;date.setTime(date.getTime()+(trueOffset-guessedOffset)*6e4)}HEAP32[tmPtr+24>>2]=date.getDay();var yday=ydayFromDate(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getYear();return date.getTime()/1e3|0}function __mmap_js(len,prot,flags,fd,off,allocated,addr){try{var stream=SYSCALLS.getStreamFromFD(fd);var res=FS.mmap(stream,len,off,prot,flags);var ptr=res.ptr;HEAP32[allocated>>2]=res.allocated;HEAPU32[addr>>2]=ptr;return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function __munmap_js(addr,len,prot,flags,fd,offset){try{var stream=SYSCALLS.getStreamFromFD(fd);if(prot&2){SYSCALLS.doMsync(addr,stream,len,flags,offset)}FS.munmap(stream)}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return-e.errno}}function stringToNewUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8(str,ret,size);return ret}function __tzset_js(timezone,daylight,tzname){var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);function extractZone(date){var match=date.toTimeString().match(/\\(([A-Za-z ]+)\\)$/);return match?match[1]:\"GMT\"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=stringToNewUTF8(winterName);var summerNamePtr=stringToNewUTF8(summerName);if(summerOffset<winterOffset){HEAPU32[tzname>>2]=winterNamePtr;HEAPU32[tzname+4>>2]=summerNamePtr}else{HEAPU32[tzname>>2]=summerNamePtr;HEAPU32[tzname+4>>2]=winterNamePtr}}function _abort(){abort(\"\")}Module[\"_abort\"]=_abort;function _dlopen(handle){abort(dlopenMissingError)}var readEmAsmArgsArray=[];function readEmAsmArgs(sigPtr,buf){readEmAsmArgsArray.length=0;var ch;buf>>=2;while(ch=HEAPU8[sigPtr++]){buf+=ch!=105&buf;readEmAsmArgsArray.push(ch==105?HEAP32[buf]:(ch==106?HEAP64:HEAPF64)[buf++>>1]);++buf}return readEmAsmArgsArray}function runEmAsmFunction(code,sigPtr,argbuf){var args=readEmAsmArgs(sigPtr,argbuf);return ASM_CONSTS[code].apply(null,args)}function _emscripten_asm_const_int(code,sigPtr,argbuf){return runEmAsmFunction(code,sigPtr,argbuf)}function _emscripten_date_now(){return Date.now()}function getHeapMax(){return 2147483648}function _emscripten_get_heap_max(){return getHeapMax()}var _emscripten_get_now;if(ENVIRONMENT_IS_NODE){global.performance=require(\"perf_hooks\").performance}_emscripten_get_now=()=>performance.now();function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function emscripten_realloc_buffer(size){var b=wasmMemory.buffer;try{wasmMemory.grow(size-b.byteLength+65535>>>16);updateMemoryViews();return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}var alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var ENV={};function getExecutableName(){return thisProgram||\"./this.program\"}function getEnvStrings(){if(!getEnvStrings.strings){var lang=(typeof navigator==\"object\"&&navigator.languages&&navigator.languages[0]||\"C\").replace(\"-\",\"_\")+\".UTF-8\";var env={\"USER\":\"web_user\",\"LOGNAME\":\"web_user\",\"PATH\":\"/\",\"PWD\":\"/\",\"HOME\":\"/home/web_user\",\"LANG\":lang,\"_\":getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings}function stringToAscii(str,buffer){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}HEAP8[buffer>>0]=0}function _environ_get(__environ,environ_buf){var bufSize=0;getEnvStrings().forEach(function(string,i){var ptr=environ_buf+bufSize;HEAPU32[__environ+i*4>>2]=ptr;stringToAscii(string,ptr);bufSize+=string.length+1});return 0}function _environ_sizes_get(penviron_count,penviron_buf_size){var strings=getEnvStrings();HEAPU32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(function(string){bufSize+=string.length+1});HEAPU32[penviron_buf_size>>2]=bufSize;return 0}function _proc_exit(code){EXITSTATUS=code;if(!keepRuntimeAlive()){if(Module[\"onExit\"])Module[\"onExit\"](code);ABORT=true}quit_(code,new ExitStatus(code))}function exitJS(status,implicit){EXITSTATUS=status;_proc_exit(status)}var _exit=exitJS;function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return e.errno}}function _fd_fdstat_get(fd,pbuf){try{var rightsBase=0;var rightsInheriting=0;var flags=0;{var stream=SYSCALLS.getStreamFromFD(fd);var type=stream.tty?2:FS.isDir(stream.mode)?3:FS.isLink(stream.mode)?7:4}HEAP8[pbuf>>0]=type;HEAP16[pbuf+2>>1]=flags;HEAP64[pbuf+8>>3]=BigInt(rightsBase);HEAP64[pbuf+16>>3]=BigInt(rightsInheriting);return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return e.errno}}function doReadv(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break;if(typeof offset!==\"undefined\"){offset+=curr}}return ret}function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return e.errno}}var MAX_INT53=9007199254740992;var MIN_INT53=-9007199254740992;function bigintToI53Checked(num){return num<MIN_INT53||num>MAX_INT53?NaN:Number(num)}function _fd_seek(fd,offset,whence,newOffset){try{offset=bigintToI53Checked(offset);if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);HEAP64[newOffset>>3]=BigInt(stream.position);if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return e.errno}}function doWritev(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(typeof offset!==\"undefined\"){offset+=curr}}return ret}function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS==\"undefined\"||!(e.name===\"ErrnoError\"))throw e;return e.errno}}function _getaddrinfo(node,service,hint,out){var addr=0;var port=0;var flags=0;var family=0;var type=0;var proto=0;var ai;function allocaddrinfo(family,type,proto,canon,addr,port){var sa,salen,ai;var errno;salen=family===10?28:16;addr=family===10?inetNtop6(addr):inetNtop4(addr);sa=_malloc(salen);errno=writeSockaddr(sa,family,addr,port);assert(!errno);ai=_malloc(32);HEAP32[ai+4>>2]=family;HEAP32[ai+8>>2]=type;HEAP32[ai+12>>2]=proto;HEAPU32[ai+24>>2]=canon;HEAPU32[ai+20>>2]=sa;if(family===10){HEAP32[ai+16>>2]=28}else{HEAP32[ai+16>>2]=16}HEAP32[ai+28>>2]=0;return ai}if(hint){flags=HEAP32[hint>>2];family=HEAP32[hint+4>>2];type=HEAP32[hint+8>>2];proto=HEAP32[hint+12>>2]}if(type&&!proto){proto=type===2?17:6}if(!type&&proto){type=proto===17?2:1}if(proto===0){proto=6}if(type===0){type=1}if(!node&&!service){return-2}if(flags&~(1|2|4|1024|8|16|32)){return-1}if(hint!==0&&HEAP32[hint>>2]&2&&!node){return-1}if(flags&32){return-2}if(type!==0&&type!==1&&type!==2){return-7}if(family!==0&&family!==2&&family!==10){return-6}if(service){service=UTF8ToString(service);port=parseInt(service,10);if(isNaN(port)){if(flags&1024){return-2}return-8}}if(!node){if(family===0){family=2}if((flags&1)===0){if(family===2){addr=_htonl(2130706433)}else{addr=[0,0,0,1]}}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAPU32[out>>2]=ai;return 0}node=UTF8ToString(node);addr=inetPton4(node);if(addr!==null){if(family===0||family===2){family=2}else if(family===10&&flags&8){addr=[0,0,_htonl(65535),addr];family=10}else{return-2}}else{addr=inetPton6(node);if(addr!==null){if(family===0||family===10){family=10}else{return-2}}}if(addr!=null){ai=allocaddrinfo(family,type,proto,node,addr,port);HEAPU32[out>>2]=ai;return 0}if(flags&4){return-2}node=DNS.lookup_name(node);addr=inetPton4(node);if(family===0){family=2}else if(family===10){addr=[0,0,_htonl(65535),addr]}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAPU32[out>>2]=ai;return 0}function _getnameinfo(sa,salen,node,nodelen,serv,servlen,flags){var info=readSockaddr(sa,salen);if(info.errno){return-6}var port=info.port;var addr=info.addr;var overflowed=false;if(node&&nodelen){var lookup;if(flags&1||!(lookup=DNS.lookup_addr(addr))){if(flags&8){return-2}}else{addr=lookup}var numBytesWrittenExclNull=stringToUTF8(addr,node,nodelen);if(numBytesWrittenExclNull+1>=nodelen){overflowed=true}}if(serv&&servlen){port=\"\"+port;var numBytesWrittenExclNull=stringToUTF8(port,serv,servlen);if(numBytesWrittenExclNull+1>=servlen){overflowed=true}}if(overflowed){return-12}return 0}function arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]){}return sum}var MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?MONTH_DAYS_LEAP:MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?UTF8ToString(tm_zone):\"\"};var pattern=UTF8ToString(format);var EXPANSION_RULES_1={\"%c\":\"%a %b %d %H:%M:%S %Y\",\"%D\":\"%m/%d/%y\",\"%F\":\"%Y-%m-%d\",\"%h\":\"%b\",\"%r\":\"%I:%M:%S %p\",\"%R\":\"%H:%M\",\"%T\":\"%H:%M:%S\",\"%x\":\"%m/%d/%y\",\"%X\":\"%H:%M:%S\",\"%Ec\":\"%c\",\"%EC\":\"%C\",\"%Ex\":\"%m/%d/%y\",\"%EX\":\"%H:%M:%S\",\"%Ey\":\"%y\",\"%EY\":\"%Y\",\"%Od\":\"%d\",\"%Oe\":\"%e\",\"%OH\":\"%H\",\"%OI\":\"%I\",\"%Om\":\"%m\",\"%OM\":\"%M\",\"%OS\":\"%S\",\"%Ou\":\"%u\",\"%OU\":\"%U\",\"%OV\":\"%V\",\"%Ow\":\"%w\",\"%OW\":\"%W\",\"%Oy\":\"%y\"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,\"g\"),EXPANSION_RULES_1[rule])}var WEEKDAYS=[\"Sunday\",\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\",\"Saturday\"];var MONTHS=[\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"];function leadingSomething(value,digits,character){var str=typeof value==\"number\"?value.toString():value||\"\";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,\"0\")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}return thisDate.getFullYear()}return thisDate.getFullYear()-1}var EXPANSION_RULES_2={\"%a\":function(date){return WEEKDAYS[date.tm_wday].substring(0,3)},\"%A\":function(date){return WEEKDAYS[date.tm_wday]},\"%b\":function(date){return MONTHS[date.tm_mon].substring(0,3)},\"%B\":function(date){return MONTHS[date.tm_mon]},\"%C\":function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)},\"%d\":function(date){return leadingNulls(date.tm_mday,2)},\"%e\":function(date){return leadingSomething(date.tm_mday,2,\" \")},\"%g\":function(date){return getWeekBasedYear(date).toString().substring(2)},\"%G\":function(date){return getWeekBasedYear(date)},\"%H\":function(date){return leadingNulls(date.tm_hour,2)},\"%I\":function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)},\"%j\":function(date){return leadingNulls(date.tm_mday+arraySum(isLeapYear(date.tm_year+1900)?MONTH_DAYS_LEAP:MONTH_DAYS_REGULAR,date.tm_mon-1),3)},\"%m\":function(date){return leadingNulls(date.tm_mon+1,2)},\"%M\":function(date){return leadingNulls(date.tm_min,2)},\"%n\":function(){return\"\\n\"},\"%p\":function(date){if(date.tm_hour>=0&&date.tm_hour<12){return\"AM\"}return\"PM\"},\"%S\":function(date){return leadingNulls(date.tm_sec,2)},\"%t\":function(){return\"\\t\"},\"%u\":function(date){return date.tm_wday||7},\"%U\":function(date){var days=date.tm_yday+7-date.tm_wday;return leadingNulls(Math.floor(days/7),2)},\"%V\":function(date){var val=Math.floor((date.tm_yday+7-(date.tm_wday+6)%7)/7);if((date.tm_wday+371-date.tm_yday-2)%7<=2){val++}if(!val){val=52;var dec31=(date.tm_wday+7-date.tm_yday-1)%7;if(dec31==4||dec31==5&&isLeapYear(date.tm_year%400-1)){val++}}else if(val==53){var jan1=(date.tm_wday+371-date.tm_yday)%7;if(jan1!=4&&(jan1!=3||!isLeapYear(date.tm_year)))val=1}return leadingNulls(val,2)},\"%w\":function(date){return date.tm_wday},\"%W\":function(date){var days=date.tm_yday+7-(date.tm_wday+6)%7;return leadingNulls(Math.floor(days/7),2)},\"%y\":function(date){return(date.tm_year+1900).toString().substring(2)},\"%Y\":function(date){return date.tm_year+1900},\"%z\":function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?\"+\":\"-\")+String(\"0000\"+off).slice(-4)},\"%Z\":function(date){return date.tm_zone},\"%%\":function(){return\"%\"}};pattern=pattern.replace(/%%/g,\"\\0\\0\");for(var rule in EXPANSION_RULES_2){if(pattern.includes(rule)){pattern=pattern.replace(new RegExp(rule,\"g\"),EXPANSION_RULES_2[rule](date))}}pattern=pattern.replace(/\\0\\0/g,\"%\");var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}var FSNode=function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev};var readMode=292|73;var writeMode=146;Object.defineProperties(FSNode.prototype,{read:{get:function(){return(this.mode&readMode)===readMode},set:function(val){val?this.mode|=readMode:this.mode&=~readMode}},write:{get:function(){return(this.mode&writeMode)===writeMode},set:function(val){val?this.mode|=writeMode:this.mode&=~writeMode}},isFolder:{get:function(){return FS.isDir(this.mode)}},isDevice:{get:function(){return FS.isChrdev(this.mode)}}});FS.FSNode=FSNode;FS.createPreloadedFile=FS_createPreloadedFile;FS.staticInit();var wasmImports={\"b\":___assert_fail,\"f\":___cxa_throw,\"ka\":___dlsym,\"R\":___syscall__newselect,\"L\":___syscall_accept4,\"K\":___syscall_bind,\"J\":___syscall_connect,\"la\":___syscall_faccessat,\"g\":___syscall_fcntl64,\"ha\":___syscall_fstat64,\"U\":___syscall_getdents64,\"I\":___syscall_getpeername,\"H\":___syscall_getsockname,\"G\":___syscall_getsockopt,\"y\":___syscall_ioctl,\"F\":___syscall_listen,\"ea\":___syscall_lstat64,\"$\":___syscall_mkdirat,\"fa\":___syscall_newfstatat,\"w\":___syscall_openat,\"V\":___syscall_poll,\"E\":___syscall_recvfrom,\"T\":___syscall_renameat,\"S\":___syscall_rmdir,\"D\":___syscall_sendto,\"v\":___syscall_socket,\"ga\":___syscall_stat64,\"O\":___syscall_unlinkat,\"ia\":__emscripten_get_now_is_monotonic,\"M\":__emscripten_throw_longjmp,\"Y\":__gmtime_js,\"Z\":__localtime_js,\"_\":__mktime_js,\"W\":__mmap_js,\"X\":__munmap_js,\"P\":__tzset_js,\"a\":_abort,\"t\":_dlopen,\"oa\":_emscripten_asm_const_int,\"l\":_emscripten_date_now,\"Q\":_emscripten_get_heap_max,\"p\":_emscripten_get_now,\"ja\":_emscripten_memcpy_big,\"N\":_emscripten_resize_heap,\"ca\":_environ_get,\"da\":_environ_sizes_get,\"o\":_exit,\"m\":_fd_close,\"ba\":_fd_fdstat_get,\"x\":_fd_read,\"aa\":_fd_seek,\"q\":_fd_write,\"k\":_getaddrinfo,\"i\":_getnameinfo,\"pa\":invoke_i,\"na\":invoke_ii,\"c\":invoke_iii,\"n\":invoke_iiii,\"s\":invoke_iiiii,\"z\":invoke_iiiiii,\"r\":invoke_iiiiiiiii,\"B\":invoke_iiiijj,\"qa\":invoke_iij,\"h\":invoke_vi,\"j\":invoke_vii,\"d\":invoke_viiii,\"ma\":invoke_viiiiii,\"A\":invoke_viiiiiiii,\"C\":is_timeout,\"u\":send_progress,\"e\":_strftime};var asm=createWasm();var ___wasm_call_ctors=function(){return(___wasm_call_ctors=Module[\"asm\"][\"sa\"]).apply(null,arguments)};var _malloc=Module[\"_malloc\"]=function(){return(_malloc=Module[\"_malloc\"]=Module[\"asm\"][\"ta\"]).apply(null,arguments)};var ___errno_location=function(){return(___errno_location=Module[\"asm\"][\"va\"]).apply(null,arguments)};var _ntohs=function(){return(_ntohs=Module[\"asm\"][\"wa\"]).apply(null,arguments)};var _htons=function(){return(_htons=Module[\"asm\"][\"xa\"]).apply(null,arguments)};var _ffmpeg=Module[\"_ffmpeg\"]=function(){return(_ffmpeg=Module[\"_ffmpeg\"]=Module[\"asm\"][\"ya\"]).apply(null,arguments)};var _htonl=function(){return(_htonl=Module[\"asm\"][\"za\"]).apply(null,arguments)};var _emscripten_builtin_memalign=function(){return(_emscripten_builtin_memalign=Module[\"asm\"][\"Aa\"]).apply(null,arguments)};var _setThrew=function(){return(_setThrew=Module[\"asm\"][\"Ba\"]).apply(null,arguments)};var stackSave=function(){return(stackSave=Module[\"asm\"][\"Ca\"]).apply(null,arguments)};var stackRestore=function(){return(stackRestore=Module[\"asm\"][\"Da\"]).apply(null,arguments)};var ___cxa_is_pointer_type=function(){return(___cxa_is_pointer_type=Module[\"asm\"][\"Ea\"]).apply(null,arguments)};var _ff_h264_cabac_tables=Module[\"_ff_h264_cabac_tables\"]=1537004;var ___start_em_js=Module[\"___start_em_js\"]=6059629;var ___stop_em_js=Module[\"___stop_em_js\"]=6059806;function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiijj(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vi(index,a1){var sp=stackSave();try{getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iij(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_i(index){var sp=stackSave();try{return getWasmTableEntry(index)()}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ii(index,a1){var sp=stackSave();try{return getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}Module[\"setValue\"]=setValue;Module[\"getValue\"]=getValue;Module[\"UTF8ToString\"]=UTF8ToString;Module[\"stringToUTF8\"]=stringToUTF8;Module[\"lengthBytesUTF8\"]=lengthBytesUTF8;Module[\"FS\"]=FS;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module[\"calledRun\"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module[\"onRuntimeInitialized\"])Module[\"onRuntimeInitialized\"]();postRun()}if(Module[\"setStatus\"]){Module[\"setStatus\"](\"Running...\");setTimeout(function(){setTimeout(function(){Module[\"setStatus\"](\"\")},1);doRun()},1)}else{doRun()}}if(Module[\"preInit\"]){if(typeof Module[\"preInit\"]==\"function\")Module[\"preInit\"]=[Module[\"preInit\"]];while(Module[\"preInit\"].length>0){Module[\"preInit\"].pop()()}}run();\n\n\n  return createFFmpegCore.ready\n}\n\n);\n})();\nif (typeof exports === 'object' && typeof module === 'object')\n  module.exports = createFFmpegCore;\nelse if (typeof define === 'function' && define['amd'])\n  define([], function() { return createFFmpegCore; });\nelse if (typeof exports === 'object')\n  exports[\"createFFmpegCore\"] = createFFmpegCore;"};
const ffmpegWasmName = "ffmpeg-core-0.12.6.wasm";
async function ffmpegAsset(env, name) {
  if (Object.hasOwn(ffmpegAssets, name)) return new Response(ffmpegAssets[name], {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff"}});
  if (name !== "ffmpeg-core.wasm") return null;
  try {
    const reader = await cachedReader(env);
    const upstream = await reader.downloadByName(ffmpegWasmName);
    if (!upstream.ok || !upstream.body) { await upstream.body?.cancel().catch(() => {}); return new Response("Not found", {status: 404, headers: security}); }
    return new Response(upstream.body, {headers: {"Content-Type": "application/wasm", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff"}});
  } catch { return new Response("Unavailable", {status: 502, headers: security}); }
}

const uploadMultiScript = `(() => {
  const form = document.querySelector("form[data-multi-upload]");
  if (!form) return;
  const input = form.querySelector("[data-files]");
  const drop = form.querySelector("[data-drop]");
  const list = form.querySelector("[data-list]");
  const summary = form.querySelector("[data-summary]");
  const bar = form.querySelector("[data-progress]");
  const status = form.querySelector("[data-status]");
  const auto = form.querySelector("[data-auto-mp3]");
  const start = form.querySelector("[data-start]");
  const holder = form.querySelector("[data-picker]");
  const categories = JSON.parse(holder.dataset.categories || "[]");
  const LIMIT = 4.5 * 1024 * 1024 * 1024;
  const numberRe = /(?:^|[\\s_\\-[\\u2013\\u2014])([0-9]{5,14})\\]?$/;
  const norm = text => text.normalize("NFC").trim().replace(/\\s+/g, " ").toLowerCase();
  const stemOf = name => name.replace(/\\.(mp3|mp4)$/i, "");
  const nice = stem => { const m = numberRe.exec(stem); return ((m ? stem.slice(0, m.index).trim() : stem) || stem); };
  const batch = crypto.randomUUID();
  let picked = [];
  let courses = [];
  let running = false;
  let lastIgnored = 0;
  let timer = 0;

  const top = window.makePicker({categories, path: JSON.parse(holder.dataset.initial || "[]"), onChange: path => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (running || !path.length) return; for (const course of courses) if (course.state !== "done") course.picker.set(path); }, 350);
  }});
  holder.append(top.el);

  const note = (text, kind) => { status.textContent = text; status.className = "notice" + (kind ? " " + kind : ""); status.hidden = !text; };
  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };

  function group() {
    const map = new Map();
    const ignored = [];
    for (const file of picked) {
      const kind = /\\.mp3$/i.test(file.name) ? "mp3" : /\\.mp4$/i.test(file.name) ? "mp4" : null;
      if (!kind) { ignored.push(file.name); continue; }
      const stem = stemOf(file.name);
      const num = numberRe.exec(stem);
      const key = num ? "n:" + num[1] : "s:" + norm(stem);
      const entry = map.get(key) || {key, mp3: null, mp4: null, dupe: false};
      if (entry[kind]) entry.dupe = true; else entry[kind] = file;
      map.set(key, entry);
    }
    const old = new Map(courses.map(course => [course.key, course]));
    courses = [];
    for (const entry of map.values()) {
      const stem = stemOf((entry.mp3 || entry.mp4).name);
      let problem = "";
      if (entry.dupe) problem = "קבצים כפולים באותו שם";
      else if (stem.length > 180 || /[/\\\\]/.test(stem)) problem = "שם הקובץ ארוך או לא תקין";
      else if ((entry.mp3 && entry.mp3.size > LIMIT) || (entry.mp4 && entry.mp4.size > LIMIT)) problem = "הקובץ גדול מדי";
      let course = old.get(entry.key);
      if (course) Object.assign(course, {stem, title: nice(stem), mp3: entry.mp3, mp4: entry.mp4, problem});
      else {
        course = {key: entry.key, stem, title: nice(stem), mp3: entry.mp3, mp4: entry.mp4, problem, path: top.get(), state: "pending", error: "", missing: false};
        course.picker = window.makePicker({categories, path: course.path, onChange: next => { course.path = next; course.missing = false; course.picker.el.classList.remove("invalid"); updateSummary(); }});
        course.picker.el.classList.add("row-picker");
      }
      courses.push(course);
    }
    courses.sort((a, b) => a.title.localeCompare(b.title, "he"));
    lastIgnored = ignored.length;
  }

  const stateText = course => course.problem ? course.problem : course.state === "done" ? "הועלה ✓" : course.state === "busy" ? (course.phase || "מעלה…") : course.state === "failed" ? "נכשל: " + course.error : "ממתין";

  function updateSummary() {
    const both = courses.filter(course => course.mp3 && course.mp4).length;
    const only3 = courses.filter(course => course.mp3 && !course.mp4).length;
    const only4 = courses.filter(course => !course.mp3 && course.mp4).length;
    const without = courses.filter(course => course.state !== "done" && !course.path.length).length;
    summary.textContent = courses.length ? courses.length + " שיעורים · " + both + " עם MP3 ו־MP4 · " + only3 + " MP3 בלבד · " + only4 + " MP4 בלבד" + (without ? " · " + without + " ללא קטגוריה" : "") + (lastIgnored ? " · " + lastIgnored + " קבצים התעלמו" : "") : "";
    const ready = courses.filter(course => !course.problem && course.state !== "done").length;
    start.disabled = running || !ready;
    start.textContent = courses.some(course => course.state === "failed") ? "נסו שוב את הנכשלים" : ready ? "העלאת " + ready + " שיעורים" : "העלאה";
  }

  function render() {
    list.replaceChildren();
    for (const course of courses) {
      const row = el("li", "lesson-card");
      const main = el("span", "lesson-main");
      main.append(el("span", "lesson-title", course.title), el("span", "lesson-meta", stateText(course) + (course.warn && !course.gen ? " (" + course.warn + ")" : "")));
      const badges = el("span", "lesson-badges");
      if (course.mp3 || course.gen) badges.append(el("span", "badge", course.gen ? "MP3 ⚙" : "MP3"));
      if (course.mp4) badges.append(el("span", "badge", "MP4"));
      row.append(main, badges);
      course.picker.el.classList.toggle("invalid", Boolean(course.missing));
      row.append(course.picker.el);
      if (!running && course.state !== "done") {
        const remove = el("button", "button small", "הסרה"); remove.type = "button";
        remove.addEventListener("click", () => { picked = picked.filter(file => file !== course.mp3 && file !== course.mp4); update(); });
        row.append(remove);
      }
      list.append(row);
    }
    updateSummary();
  }

  function update() { group(); render(); }

  function addFiles(files) {
    for (const file of files) if (!picked.some(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) picked.push(file);
    update();
  }
  input.addEventListener("change", () => { addFiles(Array.from(input.files)); input.value = ""; });
  ["dragenter", "dragover"].forEach(type => drop.addEventListener(type, event => { event.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(type => drop.addEventListener(type, event => { event.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", event => addFiles(Array.from(event.dataTransfer.files)));

  const loadFfmpeg = () => new Promise((resolve, reject) => {
    if (window.FFmpegWASM) return resolve();
    const tag = document.createElement("script");
    tag.src = "/ffmpeg/ffmpeg.js"; tag.onload = () => resolve(); tag.onerror = () => reject(new Error("ffmpeg-load"));
    document.head.append(tag);
  });
  async function extractMp3(file, stem, onProgress) {
    await loadFfmpeg();
    const ff = new window.FFmpegWASM.FFmpeg();
    ff.on("progress", ({progress}) => onProgress(Math.max(0, Math.min(1, progress))));
    try {
      await ff.load({coreURL: "/ffmpeg/ffmpeg-core.js", wasmURL: "/ffmpeg/ffmpeg-core.wasm"});
      await ff.createDir("/in");
      await ff.mount("WORKERFS", {blobs: [{name: "input.mp4", data: file}]}, "/in");
      const code = await ff.exec(["-i", "/in/input.mp4", "-vn", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", "/out.mp3"]);
      if (code !== 0) throw new Error("ffmpeg-exit-" + code);
      const data = await ff.readFile("/out.mp3");
      if (!data || !data.length) throw new Error("ffmpeg-empty");
      return new File([data], stem + ".mp3", {type: "audio/mpeg"});
    } finally { ff.terminate(); }
  }

  const encodeName = name => name.split("/").map(encodeURIComponent).join("/");
  const send = (target, file, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", target.uploadUrl);
    xhr.setRequestHeader("Authorization", target.token);
    xhr.setRequestHeader("X-Bz-File-Name", encodeName(target.fileName));
    xhr.setRequestHeader("Content-Type", target.contentType);
    xhr.setRequestHeader("X-Bz-Content-Sha1", "do_not_verify");
    xhr.upload.onprogress = event => progress(event.loaded);
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("HTTP " + xhr.status));
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(file);
  });
  const adminLink = path => { const parts = path.split("/"); const params = {folder: parts[0]}; if (parts.length > 1) params.path = parts.slice(1).join("/"); return "/admin?" + new URLSearchParams(params); };

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const todo = courses.filter(course => !course.problem && course.state !== "done");
    if (!todo.length) return;
    const without = todo.filter(course => !course.path.length);
    if (without.length) { for (const course of without) course.missing = true; render(); return note("יש לבחור קטגוריה לכל שיעור (" + without.length + " שיעורים ללא קטגוריה).", "error"); }
    running = true; window.onbeforeunload = () => "ההעלאה בעיצומה";
    top.disable(true); for (const course of courses) course.picker.disable(true);
    bar.hidden = false; bar.value = 0; note("");
    const total = todo.reduce((sum, course) => sum + (course.mp3 ? course.mp3.size : 0) + (course.mp4 ? course.mp4.size : 0), 0);
    let done = 0;
    for (const course of todo) {
      course.state = "busy"; course.error = ""; course.phase = ""; render();
      if (auto && auto.checked && course.mp4 && !course.mp3 && !course.gen && !/^[0-9]{3,6}$/.test(course.stem)) {
        course.phase = "מחלץ MP3…"; render();
        try { course.gen = await extractMp3(course.mp4, course.stem, ratio => { course.phase = "מחלץ MP3… " + Math.round(ratio * 100) + "%"; render(); }); }
        catch (error) { course.warn = "חילוץ ה־MP3 נכשל"; }
        course.phase = "";
      }
      const files = [];
      if (course.mp4) files.push({kind: "video", file: course.mp4});
      if (course.mp3 || course.gen) files.push({kind: "audio", file: course.mp3 || course.gen});
      const size = files.reduce((sum, item) => sum + item.file.size, 0);
      try {
        const prepared = await fetch("/admin/upload-url", {method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({folder: course.path.join("/"), title: course.stem, upload_id: batch, files: files.map(item => ({kind: item.kind, name: item.file.name, size: item.file.size}))})});
        const plan = await prepared.json().catch(() => ({}));
        if (!prepared.ok) throw new Error(plan.message || "prepare");
        let courseDone = 0;
        for (const item of files) {
          const target = plan.files.find(entry => entry.kind === item.kind);
          await send(target, item.file, loaded => { bar.value = Math.min(100, Math.round(((done + courseDone + loaded) / total) * 100)); });
          courseDone += item.file.size;
        }
        done += courseDone; course.state = "done";
      } catch (error) {
        done += size;
        course.state = "failed"; course.error = error.message === "network" ? "חיבור או CORS" : error.message;
      }
      render();
    }
    const touched = [...new Set(courses.filter(course => course.state === "done").map(course => course.path[0]))];
    if (touched.length) { note("מעדכנים את הקטלוג…"); await fetch("/admin/catalogue-refresh", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({folders: touched})}).catch(() => {}); }
    running = false; window.onbeforeunload = null;
    top.disable(false); for (const course of courses) if (course.state !== "done") course.picker.disable(false);
    const failed = courses.filter(course => course.state === "failed").length;
    const okCount = courses.filter(course => course.state === "done").length;
    bar.value = 100;
    if (failed) note(okCount + " שיעורים הועלו, " + failed + " נכשלו. אפשר ללחוץ ״נסו שוב״.", "error");
    else {
      note("כל " + okCount + " השיעורים הועלו בהצלחה.");
      const targets = [...new Set(courses.map(course => course.path.join("/")))];
      const link = el("a", "button gold", targets.length === 1 ? "מעבר לתיקייה" : "מעבר לניהול");
      link.href = targets.length === 1 ? adminLink(targets[0]) : "/admin"; link.style.marginBlockStart = "12px"; status.append(" ", link);
    }
    render();
  });
  update();
})();
`;

async function courseMultiForm(env, current, status = 200, initialPath = []) {
  const enabled = uploadReady(env);
  const known = await knownCategories(env);
  const initial = current ? [current, ...initialPath] : [];
  return layout("הוספת כמה שיעורים", `<div class="panel">
    ${enabled ? "" : notice("העלאה מהאתר תיפתח לאחר חיבור הרשאת כתיבה.", "info")}
    <p>בחרו או גררו את כל קבצי ה־MP3 וה־MP4 ביחד. האתר מתאים אוטומטית כל MP3 ל־MP4 עם אותו שם, וכותרת השיעור נלקחת משם הקובץ. בכל שיעור בוחרים בנפרד את הקטגוריה ותיקיית המשנה שלו. קובץ בלי זוג (MP3 בלבד או MP4 בלבד) הופך לשיעור נפרד.</p>
    <form class="form-grid" data-multi-upload>
      <fieldset ${enabled ? "" : "disabled"} class="form-grid" style="border:0;padding:0;margin:0;min-width:0">
        <div><p style="margin:0 0 6px;font-weight:600;color:var(--text)">החלת יעד על כל השיעורים (אופציונלי: אפשר לבחור בנפרד בכל שיעור)</p>
          <div data-picker data-categories="${esc(JSON.stringify(known))}" data-initial="${esc(JSON.stringify(initial))}"></div></div>
        ${known.length ? "" : '<p class="notice info">אין עדיין קטגוריות. צרו קטגוריה בדף הניהול קודם.</p>'}
        <div class="dropzone" data-drop><p style="margin:0 0 12px">גררו לכאן את הקבצים, או בחרו אותם</p>
          <input type="file" multiple accept=".mp3,.mp4,audio/mpeg,video/mp4" data-files></div>
        <label class="check"><input type="checkbox" name="auto_mp3" data-auto-mp3 checked> חילוץ MP3 אוטומטי מכל MP4 שאין לו MP3 (נעשה בדפדפן, לוקח כמה דקות לשעת שיעור, יש להשאיר את העמוד פתוח)</label>
        <p data-summary style="margin:0"></p>
        <ul class="lesson-list" data-list></ul>
        <progress data-progress hidden max="100" value="0" style="width:100%"></progress>
        <p data-status role="status" hidden></p>
        <button class="button gold" data-start disabled>העלאה</button>
      </fieldset>
    </form>
    <p style="margin-block:16px 0">שיעור בודד? <a href="/admin?add=1${current ? "&amp;folder=" + encodeURIComponent(current) : ""}">הוספת שיעור אחד</a></p>
  </div>`, status, {admin: true, script: ["/picker.js", "/upload-multi.js"]});
}

const bytesFromBase64 = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
const joinBytes = (...parts) => { const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0)); let at = 0; for (const part of parts) { out.set(part, at); at += part.length; } return out; };

// ID3v2.3 tag with the title (UTF-16) and the cover picture (front cover).
function id3Tag(title, image) {
  const text = new TextEncoder();
  const utf16 = value => { const out = new Uint8Array(2 + value.length * 2); out[0] = 0xff; out[1] = 0xfe; for (let i = 0; i < value.length; i++) { const code = value.charCodeAt(i); out[2 + i * 2] = code & 255; out[3 + i * 2] = code >> 8; } return out; };
  const frame = (id, body) => { const head = new Uint8Array(10); head.set(text.encode(id), 0); new DataView(head.buffer).setUint32(4, body.length); return joinBytes(head, body); };
  const frames = [];
  if (title) frames.push(frame("TIT2", joinBytes(Uint8Array.of(1), utf16(title.slice(0, 200)), Uint8Array.of(0, 0))));
  frames.push(frame("APIC", joinBytes(Uint8Array.of(0), text.encode("image/jpeg"), Uint8Array.of(0, 3, 0), image)));
  const body = joinBytes(...frames);
  const size = body.length;
  return joinBytes(Uint8Array.of(0x49, 0x44, 0x33, 3, 0, 0, (size >> 21) & 127, (size >> 14) & 127, (size >> 7) & 127, size & 127), body);
}

const playerScript = `(() => {
  const audio = document.querySelector("audio");
  if (!audio) return;
  const title = (document.querySelector("h1") || {}).textContent || "";
  const hasCover = Boolean(document.querySelector("[data-cover]"));
  const store = { get(key) { try { return localStorage.getItem(key); } catch (error) { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch (error) {} }, del(key) { try { localStorage.removeItem(key); } catch (error) {} } };
  const posKey = "ot-pos:" + location.search;
  const speedKey = "ot-speed";
  const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
  const fmt = seconds => { if (!Number.isFinite(seconds) || seconds < 0) seconds = 0; const s = Math.floor(seconds); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const r = String(s % 60).padStart(2, "0"); return h ? h + ":" + String(m).padStart(2, "0") + ":" + r : m + ":" + r; };
  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const button = (label, text, cls) => { const node = el("button", cls || "ab-btn", text); node.type = "button"; node.setAttribute("aria-label", label); return node; };

  const bar = el("div", "audio-bar");
  bar.hidden = true;
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "נגן שמע");
  const play = button("הפעלה או השהיה", "▶", "ab-play");
  const name = el("div", "ab-title", title);
  const back = button("15 שניות אחורה", "15−");
  const fwd = button("15 שניות קדימה", "15+");
  const speed = button("מהירות", "1×");
  const close = button("סגירת הנגן", "✕", "ab-btn ab-close");
  const now = el("span", "ab-time", "0:00");
  const total = el("span", "ab-time", "0:00");
  const slider = el("input", "ab-slider");
  slider.type = "range"; slider.min = "0"; slider.max = "1000"; slider.value = "0"; slider.step = "1";
  slider.setAttribute("aria-label", "התקדמות"); slider.dir = "ltr";
  const progress = el("div", "ab-progress"); progress.dir = "ltr"; progress.append(now, slider, total);
  const controls = el("div", "ab-controls"); controls.append(back, fwd, speed, close);
  bar.append(play, name, progress, controls);
  document.body.append(bar);

  let rate = Number(store.get(speedKey)) || 1;
  if (!speeds.includes(rate)) rate = 1;
  let dragging = false;
  let lastSaved = 0;
  const applyRate = () => { audio.playbackRate = rate; speed.textContent = String(rate).replace(/^0\\\\./, "0.") + "×"; };
  const show = () => { bar.hidden = false; document.body.classList.add("has-audio-bar"); };
  const sync = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (!dragging) slider.value = duration ? String(Math.round(audio.currentTime / duration * 1000)) : "0";
    now.textContent = fmt(audio.currentTime);
    total.textContent = fmt(duration);
    play.textContent = audio.paused ? "▶" : "⏸";
    if (Date.now() - lastSaved > 4000 && audio.currentTime > 3 && !audio.paused) { lastSaved = Date.now(); store.set(posKey, String(Math.floor(audio.currentTime))); }
  };
  const seek = seconds => { const duration = Number.isFinite(audio.duration) ? audio.duration : Infinity; audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds)); sync(); };

  play.addEventListener("click", () => { if (audio.paused) audio.play(); else audio.pause(); });
  back.addEventListener("click", () => seek(-15));
  fwd.addEventListener("click", () => seek(15));
  speed.addEventListener("click", () => { rate = speeds[(speeds.indexOf(rate) + 1) % speeds.length]; store.set(speedKey, String(rate)); applyRate(); });
  close.addEventListener("click", () => { audio.pause(); bar.hidden = true; document.body.classList.remove("has-audio-bar"); });
  slider.addEventListener("input", () => { dragging = true; const duration = Number.isFinite(audio.duration) ? audio.duration : 0; now.textContent = fmt(Number(slider.value) / 1000 * duration); });
  slider.addEventListener("change", () => { const duration = Number.isFinite(audio.duration) ? audio.duration : 0; audio.currentTime = Number(slider.value) / 1000 * duration; dragging = false; sync(); });
  for (const type of ["timeupdate", "durationchange", "pause", "ended", "loadedmetadata"]) audio.addEventListener(type, sync);
  audio.addEventListener("play", () => { show(); applyRate(); sync(); if ("mediaSession" in navigator) { navigator.mediaSession.metadata = new MediaMetadata(Object.assign({title}, hasCover ? {artwork: [{src: "/brand/cover.jpg", sizes: "600x600", type: "image/jpeg"}]} : {})); } });
  audio.addEventListener("ended", () => store.del(posKey));
  audio.addEventListener("ratechange", () => { if (audio.playbackRate !== rate) applyRate(); });
  if ("mediaSession" in navigator) {
    const action = (name, handler) => { try { navigator.mediaSession.setActionHandler(name, handler); } catch (error) {} };
    action("seekbackward", () => seek(-15)); action("seekforward", () => seek(15));
    action("play", () => audio.play()); action("pause", () => audio.pause());
  }
  applyRate();

  // Resume where the listener stopped
  const saved = Number(store.get(posKey));
  if (saved > 10) {
    const resume = button("המשך האזנה", "המשך האזנה מ־" + fmt(saved), "button gold small resume");
    resume.addEventListener("click", () => { const go = () => { audio.currentTime = saved; audio.play(); resume.remove(); }; if (audio.readyState >= 1) go(); else { audio.addEventListener("loadedmetadata", go, {once: true}); audio.load(); } });
    audio.parentNode.insertBefore(resume, audio);
  }
  sync();
})();
`;

const brandingScript = `(() => {
  const note = (form, text, bad) => { const box = form.querySelector("[data-status]"); box.textContent = text; box.className = "notice" + (bad ? " error" : ""); box.hidden = !text; };
  const toBlobUrl = (canvas, type, quality) => canvas.toDataURL(type, quality);
  const render = (image, name) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (name === "cover") {
      const side = Math.min(image.width, image.height);
      canvas.width = canvas.height = 600;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 600, 600);
      return toBlobUrl(canvas, "image/jpeg", 0.88);
    }
    for (const width of [640, 480, 360, 260, 180]) {
      canvas.width = Math.min(width, image.width);
      canvas.height = Math.round(image.height * (canvas.width / image.width));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const url = toBlobUrl(canvas, "image/png");
      if (url.length < 800000) return url;
    }
    throw new Error("big");
  };
  const open = async file => {
    if (window.createImageBitmap) return createImageBitmap(file);
    return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = URL.createObjectURL(file); });
  };
  document.querySelectorAll("form[data-brand]").forEach(form => {
    const name = form.dataset.brand;
    const input = form.querySelector("input[type=file]");
    const send = async payload => {
      const response = await fetch("/admin/branding", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)});
      if (!response.ok) throw new Error("save");
    };
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const file = input.files[0];
      if (!file) return note(form, "יש לבחור קובץ תמונה.", true);
      try {
        note(form, "שומרים…");
        await send({name, dataUrl: render(await open(file), name)});
        location.href = "/admin?branding=1&saved=1";
      } catch (error) {
        note(form, error.message === "big" ? "התמונה גדולה מדי. נסו קובץ קטן יותר." : "לא ניתן לשמור את התמונה. ודאו שהקובץ הוא תמונה (JPG או PNG).", true);
      }
    });
    const remove = form.querySelector("[data-remove]");
    if (remove) remove.addEventListener("click", async () => {
      try { await send({name, remove: true}); location.href = "/admin?branding=1&saved=1"; } catch { note(form, "ההסרה נכשלה.", true); }
    });
  });
})();
`;

async function saveBranding(request, env) {
  if (Number(request.headers.get("Content-Length")) > 1500000) return json("הקובץ גדול מדי", 413);
  const body = await request.json().catch(() => null);
  const name = body?.name;
  if (name !== "cover" && name !== "logo") return json("בקשה לא חוקית", 400);
  if (body.remove === true) {
    await env.DB.prepare("DELETE FROM site_assets WHERE name = ?").bind(name).run();
    return Response.json({ok: true}, {headers: security});
  }
  const match = /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(body?.dataUrl ?? ""));
  const mime = name === "cover" ? "image/jpeg" : "image/png";
  if (!match || match[1] !== mime || match[2].length > 1000000) return json("קובץ תמונה לא תקין", 400);
  let bytes;
  try { bytes = bytesFromBase64(match[2]); } catch { return json("קובץ תמונה לא תקין", 400); }
  const ok = name === "cover" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!ok) return json("קובץ תמונה לא תקין", 400);
  await env.DB.prepare("INSERT INTO site_assets (name, mime, data) VALUES (?,?,?) ON CONFLICT(name) DO UPDATE SET mime=excluded.mime, data=excluded.data").bind(name, mime, match[2]).run();
  return Response.json({ok: true}, {headers: security});
}

async function brandAsset(env, name) {
  const row = await env.DB.prepare("SELECT mime, data FROM site_assets WHERE name = ?").bind(name).first();
  if (!row) return new Response(null, {status: 404, headers: security});
  return new Response(bytesFromBase64(row.data), {headers: {...security, "Content-Type": row.mime, "Cache-Control": "public, max-age=300"}});
}

async function brandingPage(env, url) {
  const {results} = await env.DB.prepare("SELECT name FROM site_assets").all();
  const has = new Set(results.map(row => row.name));
  const stamp = Date.now();
  const block = (name, title, help, accept, previewClass) => `<section class="panel stack" style="margin-block-end:18px"><h2 style="margin-block-start:0">${title}</h2><p>${help}</p>
    ${has.has(name) ? `<p><img class="brand-preview ${previewClass}" src="/brand/${name === "cover" ? "cover.jpg" : "logo.png"}?v=${stamp}" alt=""></p>` : '<p class="badge muted" style="display:inline-block">עדיין לא הועלה</p>'}
    <form class="form-grid" data-brand="${name}"><label>בחירת קובץ<input type="file" accept="${accept}"></label><p data-status role="status" hidden></p>
      <div class="toolbar" style="margin:0"><button class="button gold">שמירה</button>${has.has(name) ? '<button type="button" class="button danger" data-remove>הסרה</button>' : ""}</div></form></section>`;
  return layout("מיתוג האתר", (url.searchParams.has("saved") ? notice("השינוי נשמר.") : "") +
    block("cover", "תמונת הרב", "התמונה נוספת אוטומטית לכל קובץ MP3 שמורידים מהאתר, ומוצגת מעל הנגן. מומלץ תמונה מרובעת או כזו שאפשר לחתוך למרובע.", "image/*", "cover") +
    block("logo", "לוגו", "הלוגו מוצג בפינה הימנית העליונה של כל סרטון באתר. מומלץ קובץ PNG עם רקע שקוף.", "image/png", "logo") +
    '<p><a class="button" href="/admin">חזרה לניהול</a></p>', 200, {admin: true, script: "/branding.js"});
}

async function addBackblazeCourse(request, env) {
  if (!uploadReady(env)) return courseUploadForm(env, "", "", 503);
  const tooLarge = () => courseUploadForm(env, "", "הקבצים גדולים מדי להעלאה מהאתר.", 413);
  const length = Number(request.headers.get("Content-Length"));
  if (!length || length > courseUploadLimit + 64 * 1024) return tooLarge();
  const form = await request.formData().catch(() => null);
  const folder = (String(form?.get("new_folder") ?? "").trim() || String(form?.get("folder") ?? "")).trim();
  const id = String(form?.get("upload_id") ?? "");
  const audio = form?.get("audio");
  const video = form?.get("video");
  const typed = String(form?.get("title") ?? "").trim();
  const fromFile = String((audio?.size ? audio : video)?.name ?? "").replace(/\.(mp3|mp4)$/i, "").replace(/[/\\]/g, " ").trim().slice(0, 180);
  const title = typed || fromFile;
  const validName = (value, max) => value && value !== "." && value !== ".." && value.length <= max && !/[/\\\x00-\x1f\x7f]/.test(value);
  if (!validName(folder, 120) || !validName(title, 180) || !/^[a-f0-9-]{36}$/.test(id) ||
      (!audio?.size && !video?.size) || (audio?.size && !/\.mp3$/i.test(audio.name)) || (video?.size && !/\.mp4$/i.test(video.name))) {
    return courseUploadForm(env, folder, "בדקו את הכותרת, הקטגוריה וסוגי הקבצים.", 400);
  }
  if ((audio?.size || 0) + (video?.size || 0) > courseUploadLimit) return tooLarge();
  try {
    const storage = await backblaze(env, true);
    const key = `${folder}/${id}/${title}`;
    if (video?.size) await storage.upload(video, key + ".mp4", "video/mp4");
    if (audio?.size) await storage.upload(audio, key + ".mp3", "audio/mpeg");
    return redirect("/admin?" + new URLSearchParams({folder, published: "1"}));
  } catch (error) {
    return courseUploadForm(env, folder, "ההעלאה לא הושלמה. קוד תקלה: " + writeStatus(error), 502);
  }
}

async function setCourseVisibility(request, env) {
  if (Number(request.headers.get("Content-Length")) > 4096) return json("בקשה גדולה מדי", 413);
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "");
  const course = String(form?.get("course") ?? "");
  const action = form?.get("visibility");
  if (!folder || folder.includes("/") || folder.length > 1024 ||
      !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(course) ||
      (action !== "hide" && action !== "restore")) return json("נתוני השיעור אינם תקינים", 400);
  try {
    if (!await findCourse(env, folder, course)) return json("השיעור לא נמצא", 404);
    const sql = action === "hide"
      ? "INSERT INTO backblaze_hidden_courses (folder, course_id) VALUES (?, ?) ON CONFLICT DO NOTHING"
      : "DELETE FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?";
    await env.DB.prepare(sql).bind(folder, course).run();
    return redirect("/admin?" + new URLSearchParams({folder, visibility: action}));
  } catch {
    return layout("לא ניתן לעדכן את השיעור", '<a href="/admin">חזרה לניהול הספרייה</a>', 502);
  }
}

async function deleteCourse(request, env) {
  if (Number(request.headers.get("Content-Length")) > 4096) return json("בקשה גדולה מדי", 413);
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "");
  const course = String(form?.get("course") ?? "");
  if (!folder || folder.includes("/") || folder.length > 1024 || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(course) || form?.get("confirm") !== "yes") {
    return layout("לא ניתן למחוק", '<a href="/admin">חזרה לניהול</a>', 400, {admin: true});
  }
  const back = '<p><a class="button" href="' + esc(adminHref({folder})) + '">חזרה לקטגוריה</a></p>';
  if (!uploadReady(env)) return layout("לא ניתן למחוק", notice("מחיקה מהאתר דורשת הרשאת כתיבה ל־Backblaze.", "error") + back, 503, {admin: true});
  try {
    const found = await findCourse(env, folder, course);
    if (!found) return layout("השיעור לא נמצא", back, 404, {admin: true});
    const writer = await backblaze(env, true);
    for (const file of [...(found.videos ?? [found.video]), found.audio]) if (file) await writer.deleteFile(file.key, file.etag);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?").bind(folder, course),
      env.DB.prepare("DELETE FROM catalogue WHERE folder = ? AND code = ?").bind(folder, course)
    ]);
    planCache.delete(folder);
    background(refreshFolder(env, folder));
    return redirect(adminHref({folder, deleted: 1}));
  } catch (error) {
    const hint = /^delete-file-40[13]$/.test(error.message) ? " למפתח הכתיבה אין הרשאת מחיקה ב־Backblaze." : "";
    return layout("המחיקה לא הושלמה", notice("המחיקה לא הושלמה." + hint + " קוד תקלה: " + writeStatus(error), "error") + back, 502, {admin: true});
  }
}

// Copy every planned file. A copy that already exists with the same size (from an interrupted attempt) is reused.
// Returns the key of a different file that already occupies the target name, or null.
async function copyAll(reader, writer, plan, created) {
  const todo = [];
  for (const item of plan) {
    if (item.key === item.file.key) continue;
    const hit = await reader.exists(item.key);
    if (hit) {
      if (hit.size !== await reader.size(item.file.etag)) return item.key;
      continue;
    }
    todo.push(item);
  }
  await Promise.all(todo.map(async item => { created.push({key: item.key, fileId: await writer.copyFile(item.file.etag, item.key)}); }));
  return null;
}

// Move a lesson to another category / sub-folder: copy every file inside Backblaze, check, then delete the originals.
async function moveCourse(request, env) {
  if (Number(request.headers.get("Content-Length")) > 4096) return json("בקשה גדולה מדי", 413);
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "");
  const course = String(form?.get("course") ?? "");
  const target = String(form?.get("target") ?? "").trim();
  const sub = parsePath(form?.get("sub"));
  if (!folder || folder.includes("/") || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(course) || !target || target.includes("/") || target.length > 200) {
    return layout("לא ניתן להעביר", '<a href="/admin">חזרה לניהול</a>', 400, {admin: true});
  }
  const back = '<p><a class="button" href="' + esc(adminHref({folder})) + '">חזרה לקטגוריה</a></p>';
  if (!uploadReady(env)) return layout("לא ניתן להעביר", notice("העברה דורשת הרשאת כתיבה ל־Backblaze.", "error") + back, 503, {admin: true});
  const created = [];
  let writer;
  try {
    const found = await findCourse(env, folder, course);
    if (!found) return layout("השיעור לא נמצא", back, 404, {admin: true});
    writer = await backblaze(env, true);
    const reader = await backblaze(env);
    if (target !== folder && !(await backblazeFolders(reader)).includes(target) && !(await accessRules(env)).has(target)) return layout("הקטגוריה לא נמצאה", notice("הקטגוריה שנבחרה אינה קיימת.", "error") + back, 400, {admin: true});
    const targetDir = [target, ...sub].join("/") + "/";
    const files = [...(found.videos ?? [found.video]), found.audio].filter(Boolean);
    const plan = files.map(file => {
      const segments = file.key.split("/");
      const name = segments[segments.length - 1];
      const stem = name.replace(/\.[^.]+$/, "");
      const camera = /\.mp4$/i.test(name) && /^\d{3,6}$/.test(stem) && segments.length >= 3 && !isBatchId(segments[segments.length - 2]);
      return {file, key: targetDir + (camera ? segments[segments.length - 2] + "/" : "") + name};
    });
    if (plan.every(item => item.key === item.file.key)) return layout("אין מה להעביר", notice("השיעור כבר נמצא ביעד הזה.", "error") + back, 400, {admin: true});
    const clash = await copyAll(reader, writer, plan, created);
    if (clash) return layout("לא ניתן להעביר", notice("כבר קיים קובץ שונה באותו שם ביעד: " + clash, "error") + back, 409, {admin: true});
    for (const item of plan) if (item.key !== item.file.key) await writer.deleteFile(item.file.key, item.file.etag);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?").bind(folder, course),
      env.DB.prepare("DELETE FROM catalogue WHERE folder = ? AND code = ?").bind(folder, course)
    ]);
    planCache.delete(folder); planCache.delete(target);
    await refreshFolder(env, folder).catch(() => {});
    if (target !== folder) await refreshFolder(env, target).catch(() => {});
    return redirect(adminHref({folder, moved: target}));
  } catch (error) {
    // Nothing was deleted yet unless the failure happened during the last step: remove only the copies made here.
    if (writer) for (const copy of created) await writer.deleteFile(copy.key, copy.fileId).catch(() => {});
    return layout("ההעברה לא הושלמה", notice("ההעברה לא הושלמה, הקבצים המקוריים לא נפגעו. קוד תקלה: " + writeStatus(error) + busyHint(error), "error") + back, 502, {admin: true});
  }
}

// Rename a lesson: the title comes from the file names, so every file is copied under the new name and the originals are deleted.
async function renameCourse(request, env) {
  if (Number(request.headers.get("Content-Length")) > 4096) return json("בקשה גדולה מדי", 413);
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "");
  const course = String(form?.get("course") ?? "");
  const title = String(form?.get("title") ?? "").replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, "").replace(/\s+/g, " ").trim();
  const back = '<p><a class="button" href="' + esc(adminHref({folder})) + '">חזרה לקטגוריה</a></p>';
  if (!folder || folder.includes("/") || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(course)) return layout("לא ניתן לשנות שם", back, 400, {admin: true});
  if (!title || title.length > 180 || /[\\/]/.test(title) || /^[.\d]+$/.test(title) || /\[(?:נפרד|solo)\]/i.test(title)) return layout("לא ניתן לשנות שם", notice("השם ריק, ארוך מדי, מכיל / או \\, או מורכב ממספרים בלבד.", "error") + back, 400, {admin: true});
  if (!uploadReady(env)) return layout("לא ניתן לשנות שם", notice("שינוי שם דורש הרשאת כתיבה ל־Backblaze.", "error") + back, 503, {admin: true});
  const created = [];
  let writer;
  try {
    const found = await findCourse(env, folder, course);
    if (!found) return layout("השיעור לא נמצא", back, 404, {admin: true});
    writer = await backblaze(env, true);
    const reader = await backblaze(env);
    const files = [...(found.videos ?? [found.video]), found.audio].filter(Boolean);
    const plan = files.map(file => {
      const segments = file.key.split("/");
      const name = segments[segments.length - 1];
      const stem = name.replace(/\.[^.]+$/, "");
      const extension = name.slice(stem.length);
      const camera = /\.mp4$/i.test(name) && /^\d{3,6}$/.test(stem) && segments.length >= 3 && !isBatchId(segments[segments.length - 2]);
      const parent = segments.slice(0, camera ? -2 : -1).join("/") + "/";
      return {file, key: camera ? parent + title + "/" + name : parent + title + (found.solo ? " [נפרד]" : "") + extension};
    });
    if (plan.every(item => item.key === item.file.key)) return layout("אין מה לשנות", notice("השם זהה לשם הקיים.", "error") + back, 400, {admin: true});
    const clash = await copyAll(reader, writer, plan, created);
    if (clash) return layout("לא ניתן לשנות שם", notice("כבר קיים קובץ שונה בשם הזה: " + clash, "error") + back, 409, {admin: true});
    for (const item of plan) if (item.key !== item.file.key) await writer.deleteFile(item.file.key, item.file.etag);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?").bind(folder, course),
      env.DB.prepare("DELETE FROM catalogue WHERE folder = ? AND code = ?").bind(folder, course)
    ]);
    planCache.delete(folder);
    await refreshFolder(env, folder).catch(() => {});
    return redirect(adminHref({folder, renamed: 1}));
  } catch (error) {
    if (writer) for (const copy of created) await writer.deleteFile(copy.key, copy.fileId).catch(() => {});
    return layout("שינוי השם לא הושלם", notice("שינוי השם לא הושלם, הקבצים המקוריים לא נפגעו. קוד תקלה: " + writeStatus(error) + busyHint(error), "error") + back, 502, {admin: true});
  }
}

function adminCourseRow(folder, course, hidden, where = "", known = []) {
  const {code, title, audio, video, videos} = course;
  const ids = `<input type="hidden" name="folder" value="${esc(folder)}"><input type="hidden" name="course" value="${esc(code)}">`;
  const visibility = `<form method="post" action="/admin/course-visibility">${ids}
    <button class="button small ${hidden ? "gold" : ""}" name="visibility" value="${hidden ? "restore" : "hide"}">${hidden ? "החזרה לספרייה" : "הסתרה מהספרייה"}</button></form>`;
  const remove = `<details class="row-menu danger-zone"><summary>מחיקה סופית</summary>
    <form method="post" action="/admin/course-delete" class="form-grid">${ids}
      <p>הקבצים (${[audio && "MP3", video && (videos?.length > 1 ? "MP4 ×" + videos.length : "MP4")].filter(Boolean).join(" ו־")}) יימחקו לצמיתות מ־Backblaze. אי אפשר לשחזר.</p>
      <label class="check"><input type="checkbox" name="confirm" value="yes" required> אני מאשר/ת למחוק את השיעור</label>
      <button class="button small danger">מחיקת השיעור</button></form></details>`;
  const rename = `<details class="row-menu"><summary>שינוי שם</summary>
    <form method="post" action="/admin/course-rename" class="form-grid">${ids}
      <label>שם חדש<input name="title" value="${esc(title)}" maxlength="180" required></label>
      <p>שם הקבצים ב־Backblaze ישתנה. ההסתרה וספירת הצפיות של השיעור יתאפסו.</p>
      <button class="button small gold">שמירת השם</button></form></details>`;
  const move = known.length ? `<details class="row-menu"><summary>שינוי קטגוריה</summary>
    <form method="post" action="/admin/course-move" class="form-grid">${ids}
      <label>קטגוריה חדשה<select name="target">${known.map(name => `<option value="${esc(name)}"${name === folder ? " selected" : ""}>${esc(name)}</option>`).join("")}</select></label>
      <label>תיקיית משנה (אופציונלי, למשל: אורח חיים)<input name="sub" maxlength="200"></label>
      <p>הקבצים יועברו בתוך Backblaze אל היעד. ההסתרה וספירת הצפיות של השיעור יתאפסו.</p>
      <button class="button small gold">העברת השיעור</button></form></details>` : "";
  return `<li class="lesson-card admin-row"><span class="lesson-main"><span class="lesson-title">${hidden ? esc(title) : `<a href="${esc(backblazeCourseLink(folder, code))}">${esc(title)}</a>`}</span>
    ${where ? `<span class="lesson-meta">${esc(where)}</span>` : ""}<span class="lesson-badges">${badges(audio, video, videos?.length)}${hidden ? '<span class="badge muted">מוסתר</span>' : ""}</span></span>
    <span class="row-actions">${visibility}</span>${rename}${move}${remove}</li>`;
}

const adminHref = params => "/admin?" + new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)));

async function backblazeAdmin(env, url) {
  const current = url.searchParams.get("folder") ?? "";
  if (url.searchParams.has("branding")) return brandingPage(env, url);
  if (url.searchParams.get("add") === "multi") return courseMultiForm(env, current, 200, parsePath(url.searchParams.get("path")));
  if (url.searchParams.has("add")) {
    let check = "";
    if (uploadReady(env) && url.searchParams.has("check")) {
      try {
        await (await backblaze(env, true)).checkUpload();
        check = "החיבור להעלאה תקין";
      } catch (error) {
        check = writeStatus(error);
      }
    }
    return courseUploadForm(env, current, "", 200, check, parsePath(url.searchParams.get("path")));
  }
  const actions = '<div class="toolbar"><a class="button gold" href="/admin?add=multi">+ הוספת כמה שיעורים</a><a class="button" href="/admin?add=1">+ שיעור אחד</a><a class="button" href="/admin?branding=1">מיתוג</a><a class="button" href="/">צפייה באתר</a><a class="button" href="https://secure.backblaze.com/user_signin.htm" target="_blank" rel="noopener noreferrer">פתיחת Backblaze</a></div>';
  const howTo = '<details class="help"><summary>איך מוסיפים שיעורים?</summary><ol><li>בכל קטגוריה יש תיקייה ב־Backblaze.</li><li>מעלים את ה־MP3 וה־MP4 לאותה תיקייה, עם <b>אותו שם</b> לפני הסיומת.</li><li>השיעור מופיע כאן ובאתר אוטומטית. אפשר גם להעלות MP3 בלבד או MP4 בלבד: כל קובץ בלי זוג הופך לשיעור נפרד.</li><li>״הסתרה״ מוריד את השיעור מהאתר אך שומר את הקבצים, ואפשר להחזיר אותו. ״מחיקה סופית״ מוחקת את הקבצים מ־Backblaze.</li></ol></details>';
  const flash = (url.searchParams.has("published") ? notice("השיעור פורסם בהצלחה.") : "") +
    (url.searchParams.has("deleted") ? notice("השיעור נמחק.") : "") +
    (url.searchParams.has("renamed") ? notice("שם השיעור עודכן.") : "") +
    (url.searchParams.has("moved") ? notice("השיעור הועבר אל: " + url.searchParams.get("moved").slice(0, 200)) : "") +
    (url.searchParams.has("saved") ? notice("הגדרות הגישה נשמרו.") : "") +
    (url.searchParams.has("refreshed") ? notice("הקטלוג עודכן.") : "") +
    ({hide: notice("השיעור הוסתר מהספרייה."), restore: notice("השיעור הוחזר לספרייה.")}[url.searchParams.get("visibility")] ?? "");
  try {
    const storage = await backblaze(env);
    const rules = await accessRules(env);
    const known = [...new Set([...await backblazeFolders(storage), ...rules.keys()])].sort((a, b) => a.localeCompare(b, "he"));
    if (!known.includes(current)) {
      const allUpdated = Number((await env.DB.prepare("SELECT v FROM catalogue_state WHERE k = 'all_updated'").first())?.v ?? 0);
      const refreshBox = `<form method="post" action="/admin/catalogue-refresh" class="panel refresh-box"><span>הקטלוג ${allUpdated ? "עודכן " + agoText(allUpdated) : "טרם עודכן"}. אחרי העלאה ב־rclone, לחצו כדי שהשיעורים החדשים יופיעו מיד באתר.</span><button class="button gold small">↻ עדכון הקטלוג</button></form>`;
      const cards = known.map(folder => {
        const [label, tone] = accessStatus(rules.get(folder));
        return `<li><a class="folder-card" href="${esc(adminHref({folder}))}">${folderIcon}<span class="folder-name">${esc(folder)}</span><span class="badge ${tone}">${label}</span><span class="folder-arrow" aria-hidden="true">‹</span></a></li>`;
      }).join("");
      return layout("ניהול הספרייה", flash + actions +
        `<div class="stats"><div class="stat"><b>${known.length}</b><span>קטגוריות</span></div><div class="stat"><b>${uploadReady(env) ? "פעילה" : "כבויה"}</b><span>העלאה מהאתר</span></div></div>
        ${refreshBox}<h2>הקטגוריות</h2>${cards ? `<ul class="folder-grid">${cards}</ul>` : '<div class="panel empty-state"><p>עדיין אין קטגוריות. הוסיפו קטגוריה חדשה למטה.</p></div>'}` + addCategoryPanel + howTo, 200, {admin: true});
    }
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
    const only = ["mp3", "mp4"].includes(url.searchParams.get("only")) ? url.searchParams.get("only") : "";
    const {courses, notes} = await getPlan(env, current);
    const refreshedAt = (await env.DB.prepare("SELECT updated FROM catalogue_meta WHERE folder = ?").bind(current).first())?.updated;
    const {results: hiddenRows} = await env.DB.prepare("SELECT course_id FROM backblaze_hidden_courses WHERE folder = ?").bind(current).all();
    const hiddenIds = new Set(hiddenRows.map(row => row.course_id));
    const path = parsePath(url.searchParams.get("path"));
    const inScope = course => samePrefix(courseTrail(course), path);
    const all = courses.filter(course => !hiddenIds.has(course.code) && inScope(course));
    const hidden = courses.filter(course => hiddenIds.has(course.code) && inScope(course));
    const browsing = !q && !only;
    const level = levelView(all, path);
    if (path.length && !level.inside.length && !level.subs.length) return layout("התיקייה לא נמצאה", `<a class="button" href="${esc(adminHref({folder: current}))}">חזרה לקטגוריה</a>`, 404, {admin: true});
    const mp3Only = all.filter(course => course.audio && !course.video).length;
    const mp4Only = all.filter(course => course.video && !course.audio).length;
    const shown = (browsing ? level.inside : all).filter(course => (only === "mp3" ? course.audio && !course.video : only === "mp4" ? course.video && !course.audio : true) && course.title.toLowerCase().includes(q.toLowerCase()));
    const perPage = 40;
    const pages = Math.max(1, Math.ceil(shown.length / perPage));
    const page = Math.max(1, Math.min(pages, Number.parseInt(url.searchParams.get("page"), 10) || 1));
    const pageHref = n => esc(adminHref({folder: current, path: path.join("/"), q, only, page: n}));
    const pager = pages > 1 ? `<nav class="pagination" aria-label="עמודים">${page > 1 ? `<a class="button" href="${pageHref(page - 1)}">‹ הקודם</a>` : ""}<span style="align-self:center;color:var(--muted)">עמוד ${page} מתוך ${pages}</span>${page < pages ? `<a class="button" href="${pageHref(page + 1)}">הבא ›</a>` : ""}</nav>` : "";
    const chip = (label, params, active) => `<a href="${esc(adminHref({folder: current, path: path.join("/"), ...params}))}"${active ? ' aria-current="true"' : ""}>${label}</a>`;
    const unset = rules.has(current) ? "" : notice("הקטגוריה הזו מוסתרת מהאתר. בחרו ״ציבורית״ או ״מוגנת בקוד״ ולחצו ״שמירה״ כדי שהשיעורים יופיעו.", "error");
    return layout(path.length ? path[path.length - 1] : current, flash + unset + actions.replace('/admin?add=1', esc(adminHref({add: 1, folder: current, path: path.join("/")}))).replace('/admin?add=multi', esc(adminHref({add: "multi", folder: current, path: path.join("/")}))) + (path.length ? "" : accessPanel(current, rules.get(current))) + `
      <div class="stats"><div class="stat"><b>${all.length}</b><span>שיעורים מפורסמים</span></div><div class="stat"><b>${mp3Only}</b><span>MP3 בלבד</span></div><div class="stat"><b>${mp4Only}</b><span>MP4 בלבד</span></div><div class="stat"><b>${hidden.length}</b><span>מוסתרים</span></div></div>
      <form method="post" action="/admin/catalogue-refresh" class="refresh-line"><input type="hidden" name="folder" value="${esc(current)}"><span>הקטלוג ${refreshedAt ? "עודכן " + agoText(refreshedAt) : "טרם עודכן"}</span><button class="button small">↻ עדכון</button></form>
      <form method="get" action="/admin" class="searchbar"><input type="hidden" name="folder" value="${esc(current)}">${path.length ? `<input type="hidden" name="path" value="${esc(path.join("/"))}">` : ""}${only ? `<input type="hidden" name="only" value="${only}">` : ""}<label>חיפוש בקטגוריה<input type="search" name="q" value="${esc(q)}" maxlength="120" placeholder="שם השיעור"></label><button class="button gold">חיפוש</button></form>
      <div class="filters">${chip("הכול", {q}, !only)}${chip(`MP3 בלבד (${mp3Only})`, {q, only: "mp3"}, only === "mp3")}${chip(`MP4 בלבד (${mp4Only})`, {q, only: "mp4"}, only === "mp4")}</div>
      ${browsing && level.subs.length ? `<h2 style="margin-block-start:8px">תיקיות</h2><ul class="folder-grid" style="margin-block-end:22px">${level.subs.map(([name, count]) => `<li><a class="folder-card" href="${esc(adminHref({folder: current, path: [...path, name].join("/")}))}">${folderIcon}<span class="folder-name">${esc(name)}</span><span class="badge muted">${count}</span><span class="folder-arrow" aria-hidden="true">‹</span></a></li>`).join("")}</ul>` : ""}
      ${shown.length ? `<ul class="lesson-list">${shown.slice((page - 1) * perPage, page * perPage).map(course => adminCourseRow(current, course, false, browsing ? "" : courseTrail(course).join(" › "), known)).join("")}</ul>${pager}` : (browsing && level.subs.length ? "" : '<div class="panel empty-state"><p>לא נמצאו שיעורים.</p></div>')}
      ${hidden.length ? `<details class="help"><summary>שיעורים מוסתרים (${hidden.length})</summary><ul class="lesson-list" style="margin-block-start:12px">${hidden.map(course => adminCourseRow(current, course, true, "", known)).join("")}</ul></details>` : ""}
      ${notes.length ? `<details class="help"><summary>קבצים לבדיקה (${notes.length})</summary><ul>${notes.map(note => `<li>${esc(note)}</li>`).join("")}</ul></details>` : ""}` + howTo, 200, {admin: true, before: `<nav class="breadcrumbs" aria-label="מיקום">${['<a href="/admin">ניהול</a>', path.length ? `<a href="${esc(adminHref({folder: current}))}">${esc(current)}</a>` : `<span>${esc(current)}</span>`, ...path.map((part, index) => index === path.length - 1 ? `<span>${esc(part)}</span>` : `<a href="${esc(adminHref({folder: current, path: path.slice(0, index + 1).join("/")}))}">${esc(part)}</a>`)].join('<span aria-hidden="true">‹</span>')}</nav>`});
  } catch {
    return layout("ניהול הספרייה", actions + notice("לא ניתן לטעון את Backblaze כרגע. נסו שוב בעוד רגע.", "error") + '<p><a class="button" href="/admin">ניסיון נוסף</a></p>' + howTo, 502, {admin: true});
  }
}

const viewsScript = `(() => {
  const head = document.querySelector(".course-head[data-course]");
  if (!head) return;
  const key = "ot-seen:" + head.dataset.folder + "|" + head.dataset.course;
  let last = 0;
  try { last = Number(localStorage.getItem(key)) || 0; } catch (error) {}
  if (Date.now() - last < 12 * 3600 * 1000) return;
  fetch("/api/view", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({folder: head.dataset.folder, course: head.dataset.course})})
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data) return;
      try { localStorage.setItem(key, String(Date.now())); } catch (error) {}
      const label = head.querySelector("[data-views]");
      if (label) label.textContent = "👁 " + data.views + " צפיות";
    }).catch(() => {});
})();
`;

async function countView(request, env, url) {
  if (request.headers.get("Origin") !== url.origin) return json("בקשה לא חוקית", 403);
  if (Number(request.headers.get("Content-Length")) > 2048) return json("בקשה גדולה מדי", 413);
  const body = await request.json().catch(() => null);
  const folder = String(body?.folder ?? "");
  const course = String(body?.course ?? "");
  if (!folder || folder.includes("/") || folder.length > 1024 || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(course)) return json("נתונים לא תקינים", 400);
  const rules = await accessRules(env);
  if (!await categoryOpen(request, url.origin, rules.get(folder), folder)) return json("אין גישה", 403);
  if (!await findCourse(env, folder, course)) return json("השיעור לא נמצא", 404);
  const row = await env.DB.prepare("INSERT INTO course_views (folder, course_id, views) VALUES (?, ?, 1) ON CONFLICT(folder, course_id) DO UPDATE SET views = views + 1 RETURNING views").bind(folder, course).first();
  return Response.json({views: row?.views ?? 1}, {headers: {...security, "Cache-Control": "no-store"}});
}

const videoScript = `(() => {
  // Apple devices keep Safari's own fullscreen (the in-page version did not work well there).
  const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (apple) return;
  document.querySelectorAll(".video-wrap").forEach(wrap => {
  const video = wrap.querySelector("video");
  if (!video) return;
  wrap.classList.add("custom-fs");
  video.setAttribute("controlsList", "nofullscreen");
  const button = document.createElement("button");
  button.type = "button"; button.className = "vfs-btn"; button.setAttribute("aria-label", "מסך מלא"); button.textContent = "⛶";
  wrap.append(button);
  let pseudo = false;
  const real = () => document.fullscreenElement === wrap || document.webkitFullscreenElement === wrap;
  const refresh = () => { const on = real() || pseudo; button.textContent = on ? "✕" : "⛶"; button.setAttribute("aria-label", on ? "יציאה ממסך מלא" : "מסך מלא"); };
  const enter = async () => {
    const request = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
    if (request) {
      try { await request.call(wrap); try { await screen.orientation.lock("landscape"); } catch (error) {} refresh(); return; } catch (error) {}
    }
    pseudo = true; wrap.classList.add("is-fs"); document.body.classList.add("fs-lock"); refresh();
  };
  const leave = () => {
    if (real()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (error) {} }
    if (pseudo) { pseudo = false; wrap.classList.remove("is-fs"); document.body.classList.remove("fs-lock"); }
    try { screen.orientation.unlock(); } catch (error) {}
    refresh();
  };
  button.addEventListener("click", () => (real() || pseudo) ? leave() : enter());
  document.addEventListener("fullscreenchange", refresh);
  document.addEventListener("webkitfullscreenchange", refresh);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && pseudo) leave(); });
  });
})();
`;

// ---------- Catalogue cache (copy of the course list stored in D1) ----------
const REFRESH_MS = 60 * 60 * 1000;
const readerCache = {client: null, at: 0};
const planCache = new Map();
const folderCache = {at: 0, list: []};
let currentCtx = null;
const clearCaches = () => { readerCache.client = null; planCache.clear(); folderCache.at = 0; };
const background = promise => { try { currentCtx?.waitUntil(promise.catch(() => {})); } catch {} };
const byKey = (a, b) => (a.audio ?? a.video).key.localeCompare((b.audio ?? b.video).key);
const agoText = ms => { const m = Math.max(0, Math.round((Date.now() - ms) / 60000)); return m < 1 ? "הרגע" : m < 60 ? `לפני ${m} דקות` : m < 1440 ? `לפני ${Math.round(m / 60)} שעות` : `לפני ${Math.round(m / 1440)} ימים`; };

async function cachedReader(env) {
  if (!readerCache.client || Date.now() - readerCache.at > 10 * 60 * 1000) { readerCache.client = await backblaze(env); readerCache.at = Date.now(); }
  return readerCache.client;
}

const rowToCourse = row => {
  const first = row.video_key ? {key: row.video_key, etag: row.video_id} : undefined;
  const extra = row.video_extra ? JSON.parse(row.video_extra) : [];
  return {
    code: row.code, title: row.title, solo: Boolean(row.solo), folder: row.dir, trail: JSON.parse(row.trail),
    audio: row.audio_key ? {key: row.audio_key, etag: row.audio_id} : undefined,
    video: first, videos: first ? [first, ...extra.map(item => ({key: item.key, etag: item.id}))] : []
  };
};
const COURSE_COLUMNS = "code, title, trail, solo, dir, audio_key, audio_id, video_key, video_id, video_extra";

async function rebuildCatalogue(env, folder, storage) {
  const {courses, notes} = await planImport(folder, storage);
  const rows = courses.map(course => [course.code, course.title, JSON.stringify(course.trail ?? []), course.solo ? 1 : 0, course.folder, course.audio?.key ?? null, course.audio?.etag ?? null, course.video?.key ?? null, course.video?.etag ?? null, (course.videos?.length ?? 0) > 1 ? JSON.stringify(course.videos.slice(1).map(item => ({key: item.key, id: item.etag}))) : null]);
  const sig = await hash(JSON.stringify(rows) + JSON.stringify(notes.slice(0, 200)));
  const current = await env.DB.prepare("SELECT sig FROM catalogue_meta WHERE folder = ?").bind(folder).first();
  const value = {courses, notes};
  if (current?.sig === sig) {
    await env.DB.prepare("UPDATE catalogue_meta SET updated = ? WHERE folder = ?").bind(Date.now(), folder).run();
    planCache.set(folder, {at: Date.now(), value});
    return value;
  }
  const gen = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const group = "(?,?,?,?,?,?,?,?,?,?,?,?)";
  const statements = [];
  for (let start = 0; start < rows.length; start += 8) {
    const part = rows.slice(start, start + 8);
    statements.push(env.DB.prepare(`INSERT INTO catalogue (folder, gen, ${COURSE_COLUMNS}) VALUES ${part.map(() => group).join(",")}`).bind(...part.flatMap(row => [folder, gen, ...row])));
  }
  for (let start = 0; start < statements.length; start += 80) await env.DB.batch(statements.slice(start, start + 80));
  await env.DB.prepare("INSERT INTO catalogue_meta (folder, gen, updated, count, notes, sig) VALUES (?,?,?,?,?,?) ON CONFLICT(folder) DO UPDATE SET gen = excluded.gen, updated = excluded.updated, count = excluded.count, notes = excluded.notes, sig = excluded.sig")
    .bind(folder, gen, Date.now(), courses.length, JSON.stringify(notes.slice(0, 200)), sig).run();
  await env.DB.prepare("DELETE FROM catalogue WHERE folder = ? AND gen <> ?").bind(folder, gen).run();
  planCache.set(folder, {at: Date.now(), value});
  return value;
}

const refreshingFolders = new Map();
function refreshFolder(env, folder) {
  if (refreshingFolders.has(folder)) return refreshingFolders.get(folder);
  const task = (async () => { try { return await rebuildCatalogue(env, folder, await backblaze(env)); } finally { refreshingFolders.delete(folder); } })();
  refreshingFolders.set(folder, task);
  return task;
}

let refreshingAll = null;
function refreshAll(env) {
  if (refreshingAll) return refreshingAll;
  refreshingAll = (async () => {
    try {
      const storage = await backblaze(env);
      const folders = await backblazeFolders(storage);
      for (const folder of folders) await rebuildCatalogue(env, folder, storage);
      const {results} = await env.DB.prepare("SELECT folder FROM catalogue_meta").all();
      for (const row of results) if (!folders.includes(row.folder)) {
        await env.DB.batch([env.DB.prepare("DELETE FROM catalogue WHERE folder = ?").bind(row.folder), env.DB.prepare("DELETE FROM catalogue_meta WHERE folder = ?").bind(row.folder)]);
      }
      await env.DB.prepare("INSERT INTO catalogue_state (k, v) VALUES ('all_updated', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(Date.now())).run();
      planCache.clear(); folderCache.at = 0;
      return folders;
    } finally { refreshingAll = null; }
  })();
  return refreshingAll;
}

async function loadCatalogue(env, folder) {
  const meta = await env.DB.prepare("SELECT gen, updated, notes FROM catalogue_meta WHERE folder = ?").bind(folder).first();
  if (!meta) return null;
  const {results} = await env.DB.prepare(`SELECT ${COURSE_COLUMNS} FROM catalogue WHERE folder = ? AND gen = ?`).bind(folder, meta.gen).all();
  return {courses: results.map(rowToCourse).sort(byKey), notes: JSON.parse(meta.notes), updated: meta.updated};
}

async function getPlan(env, folder) {
  const hit = planCache.get(folder);
  if (hit && Date.now() - hit.at < 60 * 1000) return hit.value;
  const stored = await loadCatalogue(env, folder);
  if (stored) {
    const value = {courses: stored.courses, notes: stored.notes};
    planCache.set(folder, {at: Date.now(), value});
    if (Date.now() - stored.updated > REFRESH_MS) background(refreshFolder(env, folder));
    return value;
  }
  return refreshFolder(env, folder);
}

async function findCourse(env, folder, code) {
  const row = await env.DB.prepare(`SELECT ${COURSE_COLUMNS.replace(/(\w+)/g, "c.$1")} FROM catalogue c JOIN catalogue_meta m ON m.folder = c.folder AND m.gen = c.gen WHERE c.folder = ? AND c.code = ?`).bind(folder, code).first();
  if (row) return rowToCourse(row);
  const meta = await env.DB.prepare("SELECT updated FROM catalogue_meta WHERE folder = ?").bind(folder).first();
  if (!meta) return (await getPlan(env, folder)).courses.find(item => item.code === code) ?? null;
  if (Date.now() - meta.updated > 5 * 60 * 1000) background(refreshFolder(env, folder));
  return null;
}

async function knownFolders(env) {
  if (Date.now() - folderCache.at < 60 * 1000) return folderCache.list;
  let {results} = await env.DB.prepare("SELECT folder FROM catalogue_meta ORDER BY folder").all();
  if (!results.length) { await refreshAll(env); ({results} = await env.DB.prepare("SELECT folder FROM catalogue_meta ORDER BY folder").all()); }
  else {
    const state = await env.DB.prepare("SELECT v FROM catalogue_state WHERE k = 'all_updated'").first();
    if (!state || Date.now() - Number(state.v) > REFRESH_MS) background(refreshAll(env));
  }
  folderCache.list = results.map(row => row.folder).sort((a, b) => a.localeCompare(b, "he"));
  folderCache.at = Date.now();
  return folderCache.list;
}

async function refreshCatalogue(request, env) {
  const json_ = (request.headers.get("Content-Type") ?? "").includes("application/json");
  let folders = [];
  if (json_) {
    const body = await request.json().catch(() => null);
    folders = Array.isArray(body?.folders) ? body.folders.map(String).filter(name => name && !name.includes("/") && name.length <= 1024).slice(0, 20) : [];
  } else {
    const form = await request.formData().catch(() => null);
    const one = String(form?.get("folder") ?? "");
    if (one && !one.includes("/") && one.length <= 1024) folders = [one];
  }
  try {
    if (folders.length) { const storage = await backblaze(env); for (const folder of folders) await rebuildCatalogue(env, folder, storage); folderCache.at = 0; }
    else await refreshAll(env);
  } catch (error) {
    if (json_) return json("לא ניתן לעדכן את הקטלוג", 502);
    return layout("לא ניתן לעדכן את הקטלוג", notice("העדכון נכשל. נסו שוב בעוד רגע.", "error") + '<p><a class="button" href="/admin">חזרה לניהול</a></p>', 502, {admin: true});
  }
  if (json_) return Response.json({ok: true}, {headers: security});
  return redirect(adminHref({...(folders.length === 1 ? {folder: folders[0]} : {}), refreshed: 1}));
}

async function b2Catalogue(request, env, url) {
  const rules = await accessRules(env);
  const open = folder => categoryOpen(request, url.origin, rules.get(folder), folder);
  const category = url.searchParams.get("folder") ?? "";
  const courseId = url.searchParams.get("course");
  const medium = url.searchParams.get("file");
  if (category.includes("/")) return layout("התיקייה לא נמצאה", "", 404);
  if (category && !rules.has(category)) return medium && courseId ? json("הקובץ לא נמצא", 404) : layout("התיקייה לא נמצאה", '<a href="/">חזרה לספרייה</a>', 404);
  if (category && !await open(category)) return medium && courseId ? json("אין גישה", 403) : codePrompt(category);
  if (courseId && category) {
    const hidden = await env.DB.prepare("SELECT 1 FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?").bind(category, courseId).first();
    if (hidden) return medium ? json("הקובץ לא נמצא", 404) : layout("השיעור לא נמצא", '<a href="/">חזרה לספרייה</a>', 404);
    const course = await findCourse(env, category, courseId);
    if (!course) return layout("השיעור לא נמצא", '<a href="/">חזרה לספרייה</a>', 404);
    if (medium) {
      const storage = await cachedReader(env);
      const part = Math.max(1, Math.floor(Number(url.searchParams.get("part")) || 1));
      const videoParts = course.videos ?? (course.video ? [course.video] : []);
      const file = medium === "video" ? videoParts[part - 1] : medium === "audio" ? course.audio : null;
      const ext = medium === "video" ? ".mp4" : ".mp3";
      const partSuffix = medium === "video" && videoParts.length > 1 ? " חלק " + part : "";
      const name = url.searchParams.has("download") ? (course.title + partSuffix).replace(/[\\/:*?"<>|\x00-\x1f]/g, " ").trim().slice(0, 150) + ext : "";
      if (file && medium === "audio" && name && request.method === "GET" && !request.headers.has("Range")) {
        const cover = await env.DB.prepare("SELECT data FROM site_assets WHERE name = 'cover'").first();
        if (cover) return storage.audioWithCover(file.etag, name, course.title, bytesFromBase64(cover.data));
      }
      return file ? storage.media(request, file.etag, medium === "video" ? "video/mp4" : "audio/mpeg", name) : json("הקובץ לא נמצא", 404);
    }
    const assets = new Set((await env.DB.prepare("SELECT name FROM site_assets").all()).results.map(row => row.name));
    const link = (kind, extra = "") => esc(backblazeCourseLink(category, courseId, kind) + extra);
    const trail = courseTrail(course);
    const crumbs = `<nav class="breadcrumbs" aria-label="מיקום בספרייה">${["<a href=\"/\">הספרייה</a>", `<a href="${esc(navLink(category))}">${esc(category)}</a>`, ...trail.map((part, index) => `<a href="${esc(navLink(category, trail.slice(0, index + 1)))}">${esc(part)}</a>`)].join('<span aria-hidden="true">‹</span>')}</nav>`;
    const logoTag = assets.has("logo") ? '<img class="video-logo" src="/brand/logo.png" alt="" aria-hidden="true">' : "";
    const videoParts = course.videos ?? (course.video ? [course.video] : []);
    const videoSections = videoParts.map((_, index) => {
      const suffix = index ? "&part=" + (index + 1) : "";
      const many = videoParts.length > 1;
      return `<section class="player-card"><h2>צפייה בשיעור${many ? " · חלק " + (index + 1) : ""} · MP4</h2>
          <div class="video-wrap"><video controls playsinline preload="metadata" src="${link("video", suffix)}"></video>${logoTag}</div>
          <div class="player-actions"><a class="button" href="${link("video", suffix + "&download=1")}">הורדת MP4${many ? " (חלק " + (index + 1) + ")" : ""}</a></div></section>`;
    }).join("");
    const seen = await env.DB.prepare("SELECT views FROM course_views WHERE folder = ? AND course_id = ?").bind(category, courseId).first();
    return layout(course.title, `<div class="course-head"${assets.has("cover") ? " data-cover" : ""} data-folder="${esc(category)}" data-course="${esc(courseId)}">${badges(course.audio, course.video, course.videos?.length)}<span class="views" data-views>👁 ${seen?.views ?? 0} צפיות</span></div>
      <div class="player-grid">
        ${videoSections}
        ${course.audio ? `<section class="player-card"><h2>האזנה לשיעור · MP3</h2>
          ${assets.has("cover") ? '<img class="cover-art" src="/brand/cover.jpg" alt="">' : ""}
          <audio controls preload="metadata" src="${link("audio")}"></audio>
          <div class="player-actions"><a class="button" href="${link("audio", "&download=1")}">הורדת MP3</a></div></section>` : ""}
      </div>`, 200, {before: crumbs, script: ["/views.js", ...(course.audio ? ["/player.js"] : []), ...(course.video ? ["/video.js"] : [])]});
  }
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  const path = parsePath(url.searchParams.get("path"));
  const folders = (await knownFolders(env)).filter(folder => rules.has(folder));
  const searchForm = (withSelect) => `<form method="get" role="search" class="searchbar${withSelect ? " with-select" : ""}"><label>חיפוש שיעור<input type="search" name="q" maxlength="120" placeholder="שם השיעור" value="${esc(query)}"></label>${withSelect
    ? `<label>קטגוריה<select name="folder"><option value="">כל הקטגוריות</option>${folders.map(folder => `<option value="${esc(folder)}"${folder === category ? " selected" : ""}>${esc(folder)}</option>`).join("")}</select></label>`
    : ""}${category && path.length ? `<input type="hidden" name="path" value="${esc(path.join("/"))}">` : ""}<button class="button gold">חיפוש</button></form>`;
  if (!category && !query) {
    let cards = "";
    for (const folder of folders) {
      const locked = rules.get(folder).mode === "code" && !await open(folder);
      cards += `<li><a class="folder-card" href="${esc(backblazeCourseLink(folder))}">${folderIcon}<span class="folder-name">${esc(folder)}</span>${locked ? '<span class="badge muted">בקוד</span>' : ""}<span aria-hidden="true" class="folder-arrow">‹</span></a></li>`;
    }
    return layout(siteName, `<section class="hero"><h1>שיעורי<strong>דעת ויראת השם</strong></h1><p>צפייה, האזנה והורדה של השיעורים, מסודרים לפי נושאים.</p></section>${searchForm(false)}<h2 style="margin-block-start:8px">נושאים</h2>` + (cards
      ? `<ul class="folder-grid">${cards}</ul>`
      : '<div class="panel empty-state"><p>עדיין אין קטגוריות בספרייה.</p></div>'), 200, {heading: false});
  }
  if (category && !folders.includes(category)) return layout("התיקייה לא נמצאה", '<a href="/">חזרה לספרייה</a>', 404);
  const hiddenQuery = category
    ? env.DB.prepare("SELECT folder, course_id FROM backblaze_hidden_courses WHERE folder = ?").bind(category)
    : env.DB.prepare("SELECT folder, course_id FROM backblaze_hidden_courses");
  const {results: hiddenRows} = await hiddenQuery.all();
  const hidden = new Set(hiddenRows.map(row => JSON.stringify([row.folder, row.course_id])));
  const viewMap = new Map((await env.DB.prepare("SELECT folder, course_id, views FROM course_views").all()).results.map(row => [row.folder + "|" + row.course_id, row.views]));
  const lessonRow = (folder, course, where) => `<li><a class="lesson-card" href="${esc(backblazeCourseLink(folder, course.code))}"><span class="lesson-main"><span class="lesson-title">${esc(course.title)}</span>${where ? `<span class="lesson-meta">${esc(where)}</span>` : ""}</span><span class="lesson-badges">${badges(course.audio, course.video, course.videos?.length)}${viewMap.get(folder + "|" + course.code) ? `<span class="badge muted">👁 ${viewMap.get(folder + "|" + course.code)}</span>` : ""}</span></a></li>`;
  const browsing = Boolean(category) && !query;
  let rows = [];
  let subCards = "";
  for (const folder of category ? [category] : folders) {
    if (!category && !await open(folder)) continue;
    const found = (await getPlan(env, folder)).courses.filter(course => !hidden.has(JSON.stringify([folder, course.code])));
    if (browsing) {
      const {inside, subs} = levelView(found, path);
      if (path.length && !inside.length && !subs.length) return layout("התיקייה לא נמצאה", '<a href="/">חזרה לספרייה</a>', 404);
      rows = inside.map(course => lessonRow(folder, course, ""));
      subCards = subs.map(([name, count]) => `<li><a class="folder-card" href="${esc(navLink(folder, [...path, name]))}">${folderIcon}<span class="folder-name">${esc(name)}</span><span class="badge muted">${count}</span><span class="folder-arrow" aria-hidden="true">‹</span></a></li>`).join("");
    } else {
      for (const course of found) {
        if (samePrefix(courseTrail(course), category ? path : []) && course.title.toLowerCase().includes(query.toLowerCase())) rows.push(lessonRow(folder, course, [folder, ...courseTrail(course)].join(" › ")));
      }
    }
  }
  const perPage = 30;
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  const page = Math.max(1, Math.min(pageCount, Number.parseInt(url.searchParams.get("page"), 10) || 1));
  const pageLink = next => "/?" + new URLSearchParams({folder: category, ...(path.length ? {path: path.join("/")} : {}), q: query, page: next});
  const pager = pageCount > 1 ? `<nav class="pagination" aria-label="עמודי שיעורים">
    ${page > 1 ? `<a class="button" href="${esc(pageLink(page - 1))}">‹ העמוד הקודם</a>` : ""}
    <span style="align-self:center;color:var(--muted)">עמוד ${page} מתוך ${pageCount}</span>
    ${page < pageCount ? `<a class="button" href="${esc(pageLink(page + 1))}">העמוד הבא ›</a>` : ""}
  </nav>` : "";
  const crumbs = ['<a href="/">הספרייה</a>'];
  if (category) {
    crumbs.push(path.length ? `<a href="${esc(navLink(category))}">${esc(category)}</a>` : `<span>${esc(category)}</span>`);
    path.forEach((part, index) => crumbs.push(index === path.length - 1 ? `<span>${esc(part)}</span>` : `<a href="${esc(navLink(category, path.slice(0, index + 1)))}">${esc(part)}</a>`));
  }
  return layout(path.length ? path[path.length - 1] : category || "תוצאות חיפוש",
    `<nav class="breadcrumbs" aria-label="מיקום בספרייה">${crumbs.join('<span aria-hidden="true">‹</span>')}</nav>` + searchForm(true) +
    (subCards ? `<h2 style="margin-block-start:8px">תיקיות</h2><ul class="folder-grid" style="margin-block-end:26px">${subCards}</ul>` : "") +
    ((rows.length || !subCards) ? `<div class="section-top"><h2 style="margin:0">${query ? "תוצאות חיפוש" : "שיעורים"}</h2><p>${rows.length} שיעורים</p></div>` : "") +
    (rows.length ? `<ul class="lesson-list">${rows.slice((page - 1) * perPage, page * perPage).join("")}</ul>`
      : subCards ? "" : `<div class="panel empty-state"><p>${query ? "לא נמצאו שיעורים. נסו לשנות את החיפוש." : "עדיין אין שיעורים בקטגוריה זו."}</p></div>`) + pager);
}

export default {
  async fetch(request, env, ctx) {
    currentCtx = ctx;
    gateKey = String(env.OR_TORAH_GATE_KEY ?? "");
    if (gateKey.length < 16) return new Response("Site not configured", {status: 503, headers: security});
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/style.css") return new Response(siteStyles, {headers:{"Content-Type":"text/css; charset=utf-8", "Cache-Control":"no-cache"}});
    if (path.startsWith("/ffmpeg/")) { const asset = await ffmpegAsset(env, path.slice(8)); if (asset) return asset; }
    if (path === "/upload-multi.js") return new Response(uploadMultiScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/picker.js") return new Response(pickerScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/upload.js") return new Response(uploadScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/video.js") return new Response(videoScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/views.js") return new Response(viewsScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/branding.js") return new Response(brandingScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    if (path === "/player.js") return new Response(playerScript, {headers: {"Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"}});
    await ensureSchema(env);
    if (path === "/brand/logo.png" || path === "/brand/cover.jpg") return brandAsset(env, path === "/brand/logo.png" ? "logo" : "cover");
    if (path === "/admin" || path.startsWith("/admin/")) {
      const response = await admin(request, env, url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
    if (path === "/api/view" && request.method === "POST") { await ensureSchema(env); return countView(request, env, url); }
    if (path === "/access/category" && request.method === "POST") return enterCategory(request, env, url);
    if (path !== "/") return layout("העמוד לא נמצא",'<a href="/">חזרה לספרייה</a>',404);
    if (!["GET", "HEAD"].includes(request.method)) return new Response(null, {status: 405, headers: {Allow: "GET, HEAD"}});
    if (!(backblazeKeyId(env) && env.B2_APPLICATION_KEY)) return layout("הספרייה אינה זמינה כרגע", "", 503);
    try {
      return await b2Catalogue(request, env, url);
    } catch (error) {
      clearCaches();
      const issue = /^(?:(authorize|list|media)-(?:[0-9]{3}|network|format)|invalid-(?:key-id|application-key)-format)$/.test(error.message) ? error.message : "upstream-error";
      const response = layout("הספרייה אינה זמינה כרגע", '<a href="/">ניסיון נוסף</a>', 502);
      response.headers.set("X-Or-Torah-Storage", issue);
      return response;
    }
  }
};
