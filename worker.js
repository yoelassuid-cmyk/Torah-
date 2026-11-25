const encode = new TextEncoder();
// Set from secrets OR_TORAH_GATE_CODE / OR_TORAH_GATE_KEY at the start of each request.
let gateCode = "";
let gateKey = "";
const gateCookie = "__Host-or_torah_gate";
const adminCookie = "__Host-or_torah_admin";
const gateLifetime = 7 * 86400;
const accessEmail = "Yoelassuid@gmail.com";
const mailLink = `mailto:${accessEmail}?subject=${encodeURIComponent("בקשת גישה לשיעורי אור תורה")}`;

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
.folder-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(min(100%,230px),1fr)); gap: 14px; }
.folder-card { display: flex; align-items: center; gap: 14px; min-height: 84px; padding: 16px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); color: var(--text); text-decoration: none; font-weight: 700; overflow-wrap: anywhere; transition: transform .12s, border-color .12s, background .12s; }
.folder-card:hover { transform: translateY(-2px); border-color: var(--gold); background: var(--surface2); }
.folder-card .folder-name { flex: 1; }
.folder-icon { width: 44px; height: 44px; border-radius: 12px; background: #11233a; display: grid; place-items: center; color: var(--gold); flex: none; }
.folder-icon svg { width: 24px; height: 24px; }
.folder-arrow { color: var(--gold); font-size: 1.5rem; }

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
.course-head { margin-block-end: 22px; }
.course-head .badge { margin-inline-end: 6px; }
.player-grid { display: grid; gap: 18px; max-width: 880px; }
.player-card { padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.player-card h2 { margin: 0 0 12px; font-size: 1.2rem; }
.player-card video { width: 100%; display: block; aspect-ratio: 16/9; background: #000; border-radius: 10px; }
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
.admin-row { align-items: flex-start; flex-wrap: wrap; }
.row-menu summary { cursor: pointer; color: var(--muted); font-size: .9rem; padding: 6px 4px; }
.row-menu[open] { flex-basis: 100%; padding-block-start: 6px; border-top: 1px solid var(--line); margin-block-start: 6px; }
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

.site-footer { border-top: 1px solid var(--line); padding-block: 22px 30px; color: var(--muted); font-size: .9rem; text-align: center; }

@media (max-width: 680px) {
  body { font-size: 16.5px; }
  .shell { width: calc(100% - 28px); }
  .gate-shell { grid-template-columns: 1fr; margin-block: 18px; }
  .searchbar, .searchbar.with-select { grid-template-columns: 1fr; }
  .searchbar .button { width: 100%; }
  .lesson-card { flex-direction: column; align-items: flex-start; gap: 10px; }
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

const siteFooter = '<footer class="shell site-footer">אור תורה · שיעורי הרב נתן רוטמן</footer>';

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

const brandHtml = '<a class="brand" href="/"><span class="brand-mark" aria-hidden="true">א</span>אור תורה</a>';

function gatePage(error = false) {
  return new Response(`<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="ספריית שיעורי הרב נתן רוטמן בעברית.">
<title>שיעורי הרב נתן רוטמן | אור תורה</title><link rel="stylesheet" href="/style.css"></head>
<body><header class="header"><div class="shell nav">${brandHtml}
<nav class="nav-links" aria-label="ניווט ראשי"><a class="button gold" href="${mailLink}">בקשת גישה</a></nav></div></header>
<main class="shell page-main"><div class="gate-shell"><section><h1>שיעורי<strong>הרב נתן רוטמן</strong></h1><p>ספריית שיעורי תורה לצפייה, להאזנה ולהורדה.</p></section>
<section class="gate-card" aria-labelledby="gate-title"><h2 id="gate-title">כניסה לשיעורים</h2>
<form action="/access/code" method="post"><label for="course-code">קוד גישה</label><input id="course-code" type="password" name="code" inputmode="numeric" autocomplete="current-password" maxlength="4" placeholder="••••" dir="ltr" required>
${error ? '<p class="gate-error" role="alert">קוד הגישה שגוי. נסו שוב.</p>' : ''}<button class="button gold" type="submit">כניסה</button></form>
<p style="margin-block:16px 0">אין לכם קוד? <a href="${mailLink}">בקשת גישה בדוא״ל</a></p></section></div></main>${siteFooter}</body></html>`, {
    status: error ? 401 : 200,
    headers: { ...security, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" }
  });
}

async function gateSignature(value, signature) {
  const key = await crypto.subtle.importKey("raw", encode.encode(gateKey), {name: "HMAC", hash: "SHA-256"}, false, ["sign", "verify"]);
  if (signature) {
    const bytes = Uint8Array.from(signature.match(/../g), byte => parseInt(byte, 16));
    return crypto.subtle.verify("HMAC", key, bytes, encode.encode(value));
  }
  return hex(await crypto.subtle.sign("HMAC", key, encode.encode(value)));
}

async function gateAuthorized(request, origin) {
  const cookie = request.headers.get("Cookie")?.split(/;\s*/).find(part => part.startsWith(gateCookie + "="));
  const value = cookie?.slice(gateCookie.length + 1);
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(value ?? "");
  return Boolean(match && Number(match[1]) > Math.floor(Date.now() / 1000) && await gateSignature(`${origin}:${match[1]}`, match[2]));
}

async function enterGate(request, origin) {
  if (request.headers.get("Origin") !== origin) return new Response(null, {status: 403, headers: security});
  if (Number(request.headers.get("Content-Length")) > 1024) return new Response(null, {status: 413, headers: security});
  const form = await request.formData().catch(() => null);
  if (form?.get("code") !== gateCode) return gatePage(true);
  const expires = Math.floor(Date.now() / 1000) + gateLifetime;
  const signed = await gateSignature(`${origin}:${expires}`);
  return new Response(null, {status: 303, headers: {
    ...security, Location: "/",
    "Set-Cookie": `${gateCookie}=${expires}.${signed}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${gateLifetime}`
  }});
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
}

const esc = escapeHtml;
const redirect = (location) => new Response(null, {status:303, headers:{...security, Location:location}});
function layout(title, content, status = 200, opts = {}) {
  const logout = '<form method="post" action="/admin/logout"><button class="nav-link">יציאה</button></form>';
  const nav = opts.admin
    ? `<a class="nav-link" href="/admin">ניהול</a><a class="nav-link" href="/admin?add=1">הוספת שיעור</a><a class="nav-link" href="/">לאתר</a>${logout}`
    : opts.bare ? "" : '<a class="nav-link" href="/">הספרייה</a>';
  const heading = opts.heading === false ? "" : `<h1>${esc(title)}</h1>`;
  return new Response(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | אור תורה</title><link rel="stylesheet" href="/style.css"></head><body><header class="header"><div class="shell nav">${brandHtml}<nav class="nav-links" aria-label="ניווט ראשי">${nav}</nav></div></header><main class="shell page-main">${opts.before ?? ""}${heading}${content}</main>${siteFooter}</body></html>`,
  {status,headers:{...security,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; style-src 'self' 'unsafe-inline'; media-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"}});
}

const notice = (text, type = "ok") => `<p class="notice ${type}" role="${type === "error" ? "alert" : "status"}">${esc(text)}</p>`;
const badges = video => `<span class="badge">MP3</span>${video ? '<span class="badge">MP4</span>' : '<span class="badge warn">חסר MP4</span>'}`;

function adminLogin(message = "", status = 200) {
  return layout("כניסה לניהול", `<div class="panel stack">${message ? notice(message, "error") : ""}<form class="form-grid" method="post" action="/admin/login"><label>קוד ניהול<input type="password" name="pin" inputmode="numeric" maxlength="4" autocomplete="current-password" dir="ltr" required></label><button class="button gold">כניסה</button></form></div>`, status, {bare: true});
}

async function adminAuthorized(request, origin) {
  const data = request.headers.get("Cookie")?.split(/;\s*/).find(item => item.startsWith(adminCookie+"="))?.slice(adminCookie.length+1);
  const m = /^(\d{10})\.([a-f0-9]{64})$/.exec(data ?? "");
  return Boolean(m && Number(m[1]) > Date.now()/1000 && await gateSignature(`admin:${origin}:${m[1]}`,m[2]));
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
      const number = /(?:^|[\s_\-[\u2013\u2014])([0-9]{5,14})\]?$/.exec(stem);
      const identity = `${directory}${number ? number[1] : stem.normalize("NFC").toLowerCase()}`;
      const pair = groups.get(identity) ?? {number: number?.[1], mp3: [], mp4: []};
      const title = (number ? stem.slice(0, number.index).trim() : stem) || stem;
      pair[extension.toLowerCase()].push({key, etag, title, directory, number: number?.[1]});
      groups.set(identity, pair);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const byTitle = new Map();
  for (const [identity, pair] of groups) {
    if (pair.mp3.length + pair.mp4.length !== 1) continue;
    const file = pair.mp3[0] ?? pair.mp4[0];
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
    if (pair.mp3.length !== 1 || pair.mp4.length > 1) {
      notes.push(`${identity} — ${pair.mp3.length ? "נמצאו קבצים כפולים" : "חסר קובץ MP3"}`);
      continue;
    }
    const [audio] = pair.mp3;
    const [video] = pair.mp4;
    const code = (await hash(identity)).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, "$1-$2-$3-$4-$5");
    courses.push({code, title: audio.title, audio, video, folder: audio.key.slice(0, audio.key.lastIndexOf("/"))});
  }
  const counts = new Map();
  for (const course of courses) counts.set(course.code, (counts.get(course.code) ?? 0) + 1);
  const valid = courses.filter(course => {
    if (counts.get(course.code) === 1) return true;
    notes.push(`${course.audio.key} — אותו קוד מופיע ביותר מתיקייה אחת`);
    return false;
  });
  valid.sort((a, b) => a.audio.key.localeCompare(b.audio.key));
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
    async upload(file, key, type) {
      const {uploadUrl, authorizationToken: uploadToken} = await getUploadEndpoint();
      const bytes = await file.arrayBuffer();
      const checksum = hex(await crypto.subtle.digest("SHA-1", bytes));
      const response = await fetch(uploadUrl, {
        method: "POST", body: bytes, redirect: "manual",
        headers: {Authorization: uploadToken, "Content-Type": type,
          "X-Bz-Content-Sha1": checksum, "X-Bz-File-Name": encodeURIComponent(key)}
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
      return new Response(request.method === "HEAD" ? null : response.body, {status: response.status, headers: resultHeaders});
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

function backblazeCourseLink(folder, course, file) {
  const params = new URLSearchParams({folder});
  if (course) params.set("course", course);
  if (file) params.set("file", file);
  return "/?" + params;
}

const courseUploadLimit = 30 * 1024 * 1024;
const uploadReady = env => Boolean(env.B2_WRITE_KEY_ID && env.B2_WRITE_APPLICATION_KEY);

function writeStatus(error) {
  return /^(?:authorize|upload-endpoint|upload-file)-(?:[0-9]{3}|network|format)$/.test(error.message) || /^invalid-(?:key-id|application-key)-format$/.test(error.message)
    ? error.message : "upload-error";
}

async function courseUploadForm(env, current, error = "", status = 200, check = "") {
  const enabled = uploadReady(env);
  let folders = [];
  try { folders = await backblazeFolders(await backblaze(env)); } catch {}
  const options = folders.map(folder => `<option value="${esc(folder)}"${folder === current ? " selected" : ""}>${esc(folder)}</option>`).join("");
  return layout("הוספת שיעור", `<div class="panel stack">
    ${error ? notice(error, "error") : ""}
    ${enabled ? "" : notice("העלאה מהאתר תיפתח לאחר חיבור הרשאת כתיבה. בינתיים ניתן להעלות ישירות ל־Backblaze.", "info")}
    <form class="form-grid" action="/admin/backblaze-upload" method="post" enctype="multipart/form-data">
      <fieldset ${enabled ? "" : "disabled"} class="form-grid" style="border:0;padding:0;margin:0;min-width:0">
        <input type="hidden" name="upload_id" value="${crypto.randomUUID()}">
        <label>כותרת השיעור<input name="title" maxlength="180" required></label>
        <label>קטגוריה<select name="folder"><option value="">בחירת קטגוריה</option>${options}</select></label>
        <label>או קטגוריה חדשה<input name="new_folder" maxlength="120" placeholder="שם הקטגוריה החדשה"></label>
        <label>קובץ שמע MP3<input type="file" name="audio" accept=".mp3,audio/mpeg" required></label>
        <label>קובץ וידאו MP4 (אפשר להוסיף אחר כך)<input type="file" name="video" accept=".mp4,video/mp4"></label>
        <p>עד 30MB בסך הכול. לקבצים גדולים או להעלאה של הרבה שיעורים, השתמשו בהעלאה ישירה ל־Backblaze.</p>
        <button class="button gold">פרסום השיעור</button>
      </fieldset>
    </form>
    ${enabled ? `<p style="margin-block:16px 0"><a href="/admin?add=1&amp;check=1">בדיקת החיבור להעלאה</a>${check ? ` · <span role="status" dir="auto">${esc(check)}</span>` : ""}</p>` : ""}
  </div>`, status, {admin: true});
}

async function addBackblazeCourse(request, env) {
  if (!uploadReady(env)) return courseUploadForm(env, "", "", 503);
  const tooLarge = () => courseUploadForm(env, "", "הקבצים גדולים מדי להעלאה מהאתר.", 413);
  const length = Number(request.headers.get("Content-Length"));
  if (!length || length > courseUploadLimit + 64 * 1024) return tooLarge();
  const form = await request.formData().catch(() => null);
  const folder = (String(form?.get("new_folder") ?? "").trim() || String(form?.get("folder") ?? "")).trim();
  const title = String(form?.get("title") ?? "").trim();
  const id = String(form?.get("upload_id") ?? "");
  const audio = form?.get("audio");
  const video = form?.get("video");
  const validName = (value, max) => value && value !== "." && value !== ".." && value.length <= max && !/[/\\\x00-\x1f\x7f]/.test(value);
  if (!validName(folder, 120) || !validName(title, 180) || !/^[a-f0-9-]{36}$/.test(id) ||
      !audio?.size || !/\.mp3$/i.test(audio.name) || (video?.size && !/\.mp4$/i.test(video.name))) {
    return courseUploadForm(env, folder, "בדקו את הכותרת, הקטגוריה וסוגי הקבצים.", 400);
  }
  if (audio.size + (video?.size || 0) > courseUploadLimit) return tooLarge();
  try {
    const storage = await backblaze(env, true);
    const key = `${folder}/${id}/${title}`;
    if (video?.size) await storage.upload(video, key + ".mp4", "video/mp4");
    await storage.upload(audio, key + ".mp3", "audio/mpeg");
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
    const storage = await backblaze(env);
    const {courses} = await planImport(folder, storage);
    if (!courses.some(item => item.code === course)) return json("השיעור לא נמצא", 404);
    const sql = action === "hide"
      ? "INSERT INTO backblaze_hidden_courses (folder, course_id) VALUES (?, ?) ON CONFLICT DO NOTHING"
      : "DELETE FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?";
    await env.DB.prepare(sql).bind(folder, course).run();
    return redirect("/admin?" + new URLSearchParams({folder, visibility: action}));
  } catch {
    return layout("לא ניתן לעדכן את השיעור", '<a href="/admin">חזרה לניהול הספרייה</a>', 502);
  }
}

function adminCourseRow(folder, course, hidden) {
  const {code, title, video} = course;
  const controls = `<form method="post" action="/admin/course-visibility">
    <input type="hidden" name="folder" value="${esc(folder)}"><input type="hidden" name="course" value="${esc(code)}">
    <button class="button small ${hidden ? "gold" : "danger"}" name="visibility" value="${hidden ? "restore" : "hide"}">${hidden ? "החזרה לספרייה" : "אישור הסרה מהספרייה"}</button>
  </form>`;
  return `<li class="lesson-card admin-row"><span class="lesson-main"><span class="lesson-title">${hidden ? esc(title) : `<a href="${esc(backblazeCourseLink(folder, code))}">${esc(title)}</a>`}</span>
    <span class="lesson-badges">${badges(video)}${hidden ? '<span class="badge muted">מוסתר</span>' : ""}</span></span>
    ${hidden ? controls : `<details class="row-menu"><summary>הסרה מהספרייה</summary><p>הקבצים יישארו ב־Backblaze ואפשר יהיה להחזיר את השיעור.</p>${controls}</details>`}</li>`;
}

const adminHref = params => "/admin?" + new URLSearchParams(params);

async function backblazeAdmin(env, url) {
  const current = url.searchParams.get("folder") ?? "";
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
    return courseUploadForm(env, current, "", 200, check);
  }
  const actions = '<div class="toolbar"><a class="button gold" href="/admin?add=1">+ הוספת שיעור</a><a class="button" href="/">צפייה באתר</a><a class="button" href="https://secure.backblaze.com/user_signin.htm" target="_blank" rel="noopener noreferrer">פתיחת Backblaze</a></div>';
  const howTo = '<details class="help"><summary>איך מוסיפים שיעורים?</summary><ol><li>בכל קטגוריה יש תיקייה ב־Backblaze.</li><li>מעלים את ה־MP3 וה־MP4 לאותה תיקייה, עם <b>אותו שם</b> לפני הסיומת.</li><li>השיעור מופיע כאן ובאתר אוטומטית. שיעור בלי MP4 מסומן ״חסר MP4״.</li><li>אפשר להסיר שיעור מהספרייה ולהחזיר אותו. הקבצים עצמם לא נמחקים.</li></ol></details>';
  const flash = (url.searchParams.has("published") ? notice("השיעור פורסם בהצלחה.") : "") +
    ({hide: notice("השיעור הוסר מהספרייה."), restore: notice("השיעור הוחזר לספרייה.")}[url.searchParams.get("visibility")] ?? "");
  try {
    const storage = await backblaze(env);
    const folders = await backblazeFolders(storage);
    if (!folders.includes(current)) {
      const cards = folders.map(folder => `<li><a class="folder-card" href="${esc(adminHref({folder}))}">${folderIcon}<span class="folder-name">${esc(folder)}</span><span class="folder-arrow" aria-hidden="true">‹</span></a></li>`).join("");
      return layout("ניהול הספרייה", flash + actions +
        `<div class="stats"><div class="stat"><b>${folders.length}</b><span>קטגוריות</span></div><div class="stat"><b>${uploadReady(env) ? "פעילה" : "כבויה"}</b><span>העלאה מהאתר</span></div></div>
        <h2>הקטגוריות</h2>${cards ? `<ul class="folder-grid">${cards}</ul>` : '<div class="panel empty-state"><p>עדיין אין קטגוריות. צרו תיקייה ב־Backblaze או הוסיפו שיעור.</p></div>'}` + howTo, 200, {admin: true});
    }
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
    const onlyMissing = url.searchParams.get("missing") === "1";
    const {courses, notes} = await planImport(current, storage);
    const {results: hiddenRows} = await env.DB.prepare("SELECT course_id FROM backblaze_hidden_courses WHERE folder = ?").bind(current).all();
    const hiddenIds = new Set(hiddenRows.map(row => row.course_id));
    const all = courses.filter(course => !hiddenIds.has(course.code));
    const hidden = courses.filter(course => hiddenIds.has(course.code));
    const missing = all.filter(course => !course.video).length;
    const shown = all.filter(course => (!onlyMissing || !course.video) && course.title.toLowerCase().includes(q.toLowerCase()));
    const chip = (label, params, active) => `<a href="${esc(adminHref({folder: current, ...params}))}"${active ? ' aria-current="true"' : ""}>${label}</a>`;
    return layout(current, flash + actions.replace('/admin?add=1', esc(adminHref({add: 1, folder: current}))) + `
      <div class="stats"><div class="stat"><b>${all.length}</b><span>שיעורים מפורסמים</span></div><div class="stat${missing ? " warn" : ""}"><b>${missing}</b><span>חסר MP4</span></div><div class="stat"><b>${hidden.length}</b><span>מוסתרים</span></div></div>
      <form method="get" action="/admin" class="searchbar"><input type="hidden" name="folder" value="${esc(current)}">${onlyMissing ? '<input type="hidden" name="missing" value="1">' : ""}<label>חיפוש בקטגוריה<input type="search" name="q" value="${esc(q)}" maxlength="120" placeholder="שם השיעור"></label><button class="button gold">חיפוש</button></form>
      <div class="filters">${chip("הכול", {q}, !onlyMissing)}${chip(`חסר MP4 (${missing})`, {q, missing: 1}, onlyMissing)}</div>
      ${shown.length ? `<ul class="lesson-list">${shown.map(course => adminCourseRow(current, course, false)).join("")}</ul>` : '<div class="panel empty-state"><p>לא נמצאו שיעורים.</p></div>'}
      ${hidden.length ? `<details class="help"><summary>שיעורים שהוסרו (${hidden.length})</summary><ul class="lesson-list" style="margin-block-start:12px">${hidden.map(course => adminCourseRow(current, course, true)).join("")}</ul></details>` : ""}
      ${notes.length ? `<details class="help"><summary>קבצים לבדיקה (${notes.length})</summary><ul>${notes.map(note => `<li>${esc(note)}</li>`).join("")}</ul></details>` : ""}` + howTo, 200, {admin: true, before: `<nav class="breadcrumbs" aria-label="מיקום"><a href="/admin">ניהול</a><span aria-hidden="true">‹</span><span>${esc(current)}</span></nav>`});
  } catch {
    return layout("ניהול הספרייה", actions + notice("לא ניתן לטעון את Backblaze כרגע. נסו שוב בעוד רגע.", "error") + '<p><a class="button" href="/admin">ניסיון נוסף</a></p>' + howTo, 502, {admin: true});
  }
}

async function b2Catalogue(request, env, url) {
  const storage = await backblaze(env);
  const category = url.searchParams.get("folder") ?? "";
  const courseId = url.searchParams.get("course");
  const medium = url.searchParams.get("file");
  if (category.includes("/")) return layout("התיקייה לא נמצאה", "", 404);
  if (courseId && category) {
    const hidden = await env.DB.prepare("SELECT 1 FROM backblaze_hidden_courses WHERE folder = ? AND course_id = ?").bind(category, courseId).first();
    if (hidden) return medium ? json("הקובץ לא נמצא", 404) : layout("השיעור לא נמצא", '<a href="/">חזרה לספרייה</a>', 404);
    const {courses} = await planImport(category, storage);
    const course = courses.find(item => item.code === courseId);
    if (!course) return layout("השיעור לא נמצא", '<a href="/">חזרה לספרייה</a>', 404);
    if (medium) {
      const file = medium === "video" ? course.video : medium === "audio" ? course.audio : null;
      const ext = medium === "video" ? ".mp4" : ".mp3";
      const name = url.searchParams.has("download") ? course.title.replace(/[\\/:*?"<>|\x00-\x1f]/g, " ").trim().slice(0, 150) + ext : "";
      return file ? storage.media(request, file.etag, medium === "video" ? "video/mp4" : "audio/mpeg", name) : json("הקובץ לא נמצא", 404);
    }
    const link = (kind, extra = "") => esc(backblazeCourseLink(category, courseId, kind) + extra);
    const crumbs = `<nav class="breadcrumbs" aria-label="מיקום בספרייה"><a href="/">הספרייה</a><span aria-hidden="true">‹</span><a href="${esc(backblazeCourseLink(category))}">${esc(category)}</a></nav>`;
    return layout(course.title, `<div class="course-head">${badges(course.video)}</div>
      <div class="player-grid">
        <section class="player-card"><h2>צפייה בשיעור · MP4</h2>
          ${course.video ? `<video controls playsinline preload="metadata" src="${link("video")}"></video>
          <div class="player-actions"><a class="button" href="${link("video", "&download=1")}">הורדת MP4</a></div>` : '<p style="margin:0">אין עדיין קובץ וידאו לשיעור זה.</p>'}</section>
        <section class="player-card"><h2>האזנה לשיעור · MP3</h2>
          <audio controls preload="metadata" src="${link("audio")}"></audio>
          <div class="player-actions"><a class="button" href="${link("audio", "&download=1")}">הורדת MP3</a></div></section>
      </div>`, 200, {before: crumbs});
  }
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  const folders = await backblazeFolders(storage);
  const searchForm = (withSelect) => `<form method="get" role="search" class="searchbar${withSelect ? " with-select" : ""}"><label>חיפוש שיעור<input type="search" name="q" maxlength="120" placeholder="שם השיעור" value="${esc(query)}"></label>${withSelect
    ? `<label>קטגוריה<select name="folder"><option value="">כל הקטגוריות</option>${folders.map(folder => `<option value="${esc(folder)}"${folder === category ? " selected" : ""}>${esc(folder)}</option>`).join("")}</select></label>`
    : ""}<button class="button gold">חיפוש</button></form>`;
  if (!category && !query) {
    const cards = folders.map(folder => `<li><a class="folder-card" href="${esc(backblazeCourseLink(folder))}">${folderIcon}<span class="folder-name">${esc(folder)}</span><span aria-hidden="true" class="folder-arrow">‹</span></a></li>`).join("");
    return layout("שיעורי הרב נתן רוטמן", `<section class="hero"><h1>שיעורי<strong>הרב נתן רוטמן</strong></h1><p>צפייה, האזנה והורדה של השיעורים, מסודרים לפי נושאים.</p></section>${searchForm(false)}<h2 style="margin-block-start:8px">נושאים</h2>` + (cards
      ? `<ul class="folder-grid">${cards}</ul>`
      : '<div class="panel empty-state"><p>עדיין אין קטגוריות בספרייה.</p></div>'), 200, {heading: false});
  }
  if (category && !folders.includes(category)) return layout("התיקייה לא נמצאה", '<a href="/">חזרה לספרייה</a>', 404);
  const hiddenQuery = category
    ? env.DB.prepare("SELECT folder, course_id FROM backblaze_hidden_courses WHERE folder = ?").bind(category)
    : env.DB.prepare("SELECT folder, course_id FROM backblaze_hidden_courses");
  const {results: hiddenRows} = await hiddenQuery.all();
  const hidden = new Set(hiddenRows.map(row => JSON.stringify([row.folder, row.course_id])));
  const rows = [];
  for (const folder of category ? [category] : folders) {
    const {courses} = await planImport(folder, storage);
    for (const {code, title, video} of courses) {
      if (!hidden.has(JSON.stringify([folder, code])) && title.toLowerCase().includes(query.toLowerCase())) {
        rows.push(`<li><a class="lesson-card" href="${esc(backblazeCourseLink(folder, code))}"><span class="lesson-main"><span class="lesson-title">${esc(title)}</span><span class="lesson-meta">${esc(folder)}</span></span><span class="lesson-badges">${badges(video)}</span></a></li>`);
      }
    }
  }
  const perPage = 30;
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  const page = Math.max(1, Math.min(pageCount, Number.parseInt(url.searchParams.get("page"), 10) || 1));
  const pageLink = next => "/?" + new URLSearchParams({folder: category, q: query, page: next});
  const pager = pageCount > 1 ? `<nav class="pagination" aria-label="עמודי שיעורים">
    ${page > 1 ? `<a class="button" href="${esc(pageLink(page - 1))}">‹ העמוד הקודם</a>` : ""}
    <span style="align-self:center;color:var(--muted)">עמוד ${page} מתוך ${pageCount}</span>
    ${page < pageCount ? `<a class="button" href="${esc(pageLink(page + 1))}">העמוד הבא ›</a>` : ""}
  </nav>` : "";
  return layout(category || "תוצאות חיפוש",
    '<nav class="breadcrumbs" aria-label="מיקום בספרייה"><a href="/">הספרייה</a>' + (category ? `<span aria-hidden="true">‹</span><span>${esc(category)}</span>` : "") + '</nav>' + searchForm(true) +
    `<div class="section-top"><h2 style="margin:0">${query ? "תוצאות חיפוש" : "שיעורים"}</h2><p>${rows.length} שיעורים</p></div>` +
    (rows.length ? `<ul class="lesson-list">${rows.slice((page - 1) * perPage, page * perPage).join("")}</ul>`
      : `<div class="panel empty-state"><p>${query ? "לא נמצאו שיעורים. נסו לשנות את החיפוש." : "עדיין אין שיעורים בקטגוריה זו."}</p></div>`) + pager);
}

export default {
  async fetch(request, env) {
    gateCode = String(env.OR_TORAH_GATE_CODE ?? "");
    gateKey = String(env.OR_TORAH_GATE_KEY ?? "");
    if (!gateCode || gateKey.length < 16) return new Response("Site not configured", {status: 503, headers: security});
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/style.css") return new Response(siteStyles, {headers:{"Content-Type":"text/css; charset=utf-8", "Cache-Control":"no-cache"}});
    if (path === "/admin" || path.startsWith("/admin/")) {
      const response = await admin(request, env, url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
    if (path === "/access/code" && request.method === "POST") return enterGate(request,url.origin);
    if (path === "/access") return gatePage();
    if (path !== "/") return layout("העמוד לא נמצא",'<a href="/">חזרה לספרייה</a>',404);
    if (!await gateAuthorized(request,url.origin)) return gatePage();
    if (!["GET", "HEAD"].includes(request.method)) return new Response(null, {status: 405, headers: {Allow: "GET, HEAD"}});
    if (!(backblazeKeyId(env) && env.B2_APPLICATION_KEY)) return layout("הספרייה אינה זמינה כרגע", "", 503);
    try {
      return await b2Catalogue(request, env, url);
    } catch (error) {
      const issue = /^(?:(authorize|list|media)-(?:[0-9]{3}|network|format)|invalid-(?:key-id|application-key)-format)$/.test(error.message) ? error.message : "upstream-error";
      const response = layout("הספרייה אינה זמינה כרגע", '<a href="/">ניסיון נוסף</a>', 502);
      response.headers.set("X-Or-Torah-Storage", issue);
      return response;
    }
  }
};
