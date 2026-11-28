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
  {status,headers:{...security,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; style-src 'self' 'unsafe-inline'; media-src 'self'; img-src 'self' data: blob:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" + (opts.script ? "; script-src 'self'; connect-src 'self' https://*.backblaze.com https://*.backblazeb2.com" : "")}});
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
        objects: files.map(file => ({key: file.fileName, etag: file.fileId, action: file.action})),
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

function writeStatus(error) {
  return /^(?:authorize|upload-endpoint|upload-file|delete-file)-(?:[0-9]{3}|network|format)$/.test(error.message) || /^invalid-(?:key-id|application-key)-format$/.test(error.message)
    ? error.message : "upload-error";
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

const uploadMultiScript = `(() => {
  const form = document.querySelector("form[data-multi-upload]");
  if (!form) return;
  const input = form.querySelector("[data-files]");
  const drop = form.querySelector("[data-drop]");
  const list = form.querySelector("[data-list]");
  const summary = form.querySelector("[data-summary]");
  const bar = form.querySelector("[data-progress]");
  const status = form.querySelector("[data-status]");
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

  const stateText = course => course.problem ? course.problem : course.state === "done" ? "הועלה ✓" : course.state === "busy" ? "מעלה…" : course.state === "failed" ? "נכשל: " + course.error : "ממתין";

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
      main.append(el("span", "lesson-title", course.title), el("span", "lesson-meta", stateText(course)));
      const badges = el("span", "lesson-badges");
      if (course.mp3) badges.append(el("span", "badge", "MP3"));
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
      course.state = "busy"; course.error = ""; render();
      const files = [];
      if (course.mp4) files.push({kind: "video", file: course.mp4});
      if (course.mp3) files.push({kind: "audio", file: course.mp3});
      const size = files.reduce((sum, item) => sum + item.file.size, 0);
      try {
        const prepared = await fetch("/admin/upload-url", {method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({folder: course.path.join("/"), title: course.stem, upload_id: batch, files: files.map(item => ({kind: item.kind, name: item.file.name, size: item.file.size}))})});
        const plan = await prepared.json().catch(() => ({}));
        if (!prepared.ok) throw new Error(plan.message || "prepare");
        let courseDone = 0;
        for (const item of files) {
          const target = plan.files.find(entry => entry.kind === item.kind);
          await send(target, item.file, loaded => { bar.value = Math.round(((done + courseDone + loaded) / total) * 100); });
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

function adminCourseRow(folder, course, hidden, where = "") {
  const {code, title, audio, video, videos} = course;
  const ids = `<input type="hidden" name="folder" value="${esc(folder)}"><input type="hidden" name="course" value="${esc(code)}">`;
  const visibility = `<form method="post" action="/admin/course-visibility">${ids}
    <button class="button small ${hidden ? "gold" : ""}" name="visibility" value="${hidden ? "restore" : "hide"}">${hidden ? "החזרה לספרייה" : "הסתרה מהספרייה"}</button></form>`;
  const remove = `<details class="row-menu danger-zone"><summary>מחיקה סופית</summary>
    <form method="post" action="/admin/course-delete" class="form-grid">${ids}
      <p>הקבצים (${[audio && "MP3", video && (videos?.length > 1 ? "MP4 ×" + videos.length : "MP4")].filter(Boolean).join(" ו־")}) יימחקו לצמיתות מ־Backblaze. אי אפשר לשחזר.</p>
      <label class="check"><input type="checkbox" name="confirm" value="yes" required> אני מאשר/ת למחוק את השיעור</label>
      <button class="button small danger">מחיקת השיעור</button></form></details>`;
  return `<li class="lesson-card admin-row"><span class="lesson-main"><span class="lesson-title">${hidden ? esc(title) : `<a href="${esc(backblazeCourseLink(folder, code))}">${esc(title)}</a>`}</span>
    ${where ? `<span class="lesson-meta">${esc(where)}</span>` : ""}<span class="lesson-badges">${badges(audio, video, videos?.length)}${hidden ? '<span class="badge muted">מוסתר</span>' : ""}</span></span>
    <span class="row-actions">${visibility}</span>${remove}</li>`;
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
      ${shown.length ? `<ul class="lesson-list">${shown.slice((page - 1) * perPage, page * perPage).map(course => adminCourseRow(current, course, false, browsing ? "" : courseTrail(course).join(" › "))).join("")}</ul>${pager}` : (browsing && level.subs.length ? "" : '<div class="panel empty-state"><p>לא נמצאו שיעורים.</p></div>')}
      ${hidden.length ? `<details class="help"><summary>שיעורים מוסתרים (${hidden.length})</summary><ul class="lesson-list" style="margin-block-start:12px">${hidden.map(course => adminCourseRow(current, course, true)).join("")}</ul></details>` : ""}
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
