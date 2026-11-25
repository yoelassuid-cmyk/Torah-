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
  --base: #253241;
  --panel: #303f50;
  --edge: #526174;
  --text: #f5f1e9;
  --muted: #c5cdd7;
  --gold: #e5c48d;
  --display: Georgia, "Times New Roman", serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--base); color: var(--text); font: 16px/1.65 system-ui,Arial,sans-serif; }
.shell { width: min(1080px, calc(100% - 48px)); margin-inline: auto; }
.header { background: #1d2936; border-bottom: 1px solid #465466; }
.nav { min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.brand { font: 700 1.7rem var(--display); text-decoration: none; color: var(--gold); }
a { color: var(--gold); text-underline-offset: .24em; }
a:hover { text-decoration-thickness: 2px; }
button,input,select { font: inherit; }
:focus-visible { outline: 3px solid #f2d3a1; outline-offset: 3px; }
.button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 9px 17px; border-radius: 8px; text-decoration: none; font-weight: 700; line-height: 1.4; }
.button:not(.gold) { background: #3a495a; color: var(--text); }
.gold { background: var(--gold); color: #242a30; }
.gold:hover { background: #f3d7a9; }
.nav .nav-link { display: none; }
.nav .button { color: var(--gold); background: #2b3949; }
.gate-shell {
  background: linear-gradient(125deg,#3c4c60,#283849 57%,#293646) !important;
  min-height: 402px;
  box-shadow: 0 18px 45px #141e2c55;
}
.gate-shell h1 { line-height: 1.14 !important; }
.gate-shell h1 strong { color: var(--gold); }
.gate-card { background: #263443 !important; box-shadow: 0 14px 28px #1b253d42; }
.gate-card .gate-error { color: #ffc5ba !important; }
.card { background: var(--panel) !important; color: var(--text); text-decoration: none; }
a.card:hover { border-color: #b49a73; background: #37485b !important; }
input,select { background: #233140 !important; min-height: 46px; color: var(--text); }
input::placeholder { color: #b4c0cd; }
p { color: var(--muted); }
.panel { padding: clamp(16px,3vw,28px); background: var(--panel); border: 1px solid var(--edge); border-radius: 14px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-block-end: 20px; }
.toolbar form { margin: 0; }
.library-search { display: grid; grid-template-columns: 2fr 1fr auto; align-items: end; gap: 12px; margin-block: 0 28px; }
.folder-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,245px),1fr)); gap: 12px; }
.folder-grid li,.lesson-list li { margin: 0; }
.folder-card { display: flex !important; gap: 12px; align-items: center; font-weight: 750; min-height: 76px; }
.folder-card span:nth-child(2) { flex: 1; }
.folder-arrow { margin-inline-start: auto; color: var(--gold); font-size: 1.4rem; }
.folder-icon { width: 36px; height: 36px; border-radius: 8px; background: #465164; display: grid; place-items: center; color: var(--gold); flex: none; }
.folder-icon svg { width: 20px; height: 20px; }
.lesson-list { display: grid; gap: 10px; }
.lesson-title { display: block; font-size: clamp(1.08rem,2.3vw,1.24rem); font-weight: 720; line-height: 1.55; }
.lesson-meta { display: block; color: var(--muted); margin-block-start: 5px; font-size: .9rem; }
.media-panel { max-width: 880px; }
.media-panel h2 { font-size: 1.18rem; margin-block: 14px 4px; }
.media-panel video { border-radius: 10px; }
.breadcrumbs { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; color: var(--muted); margin-block-end: 18px; font-size: .95rem; }
.section-top { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 10px; }
.section-top p { margin-block-end: 12px; }
.empty-state p { margin: 0; }
.pagination { display: flex; flex-wrap: wrap; gap: 12px; margin-block-start: 20px; }
.site-footer { border-top: 1px solid var(--edge); padding-block: 18px 28px; color: var(--muted); font-size: .9rem; }
@media(max-width:620px) {
  .shell { width: calc(100% - 28px); }
  .nav { min-height: 60px; }
  .library-search { grid-template-columns: 1fr; }
  .library-search button { width: 100%; }
  .gate-shell { min-height: auto; }
  .panel { padding: 16px; }
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

function gatePage(error = false) {
  return new Response(`<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="ספריית שיעורי הרב נתן רוטמן בעברית.">
<title>שיעורי הרב נתן רוטמן | אור תורה</title><link rel="stylesheet" href="/style.css">
<style>
.gate-shell{display:grid;grid-template-columns:1.05fr 1fr;gap:clamp(22px,5vw,72px);align-items:center;margin-block:34px;padding:clamp(24px,5vw,64px);border:1px solid var(--edge);border-radius:20px;background:linear-gradient(140deg,#141f2e 55%,#372d23)}
.gate-shell h1{font:700 clamp(2.2rem,5vw,4.5rem)/1.08 var(--display)}.gate-shell h1 strong{color:var(--gold)}
.gate-shell p{color:var(--muted);margin-block:12px}.gate-card{min-width:0;background:#101926;border:1px solid var(--edge);border-radius:15px;padding:clamp(18px,3vw,32px)}
.gate-card h2{margin-block-end:16px}.gate-card label{display:block}.gate-card input{display:block;width:100%;margin:8px 0;padding:12px;color:var(--text);background:var(--base);border:1px solid var(--gold);border-radius:8px;text-align:center;font-size:16px;letter-spacing:.3em}.gate-card button{width:100%;justify-content:center;border:0;cursor:pointer}.gate-card p a{color:var(--gold);text-decoration:underline}.gate-card .gate-error{color:#ffd0c8}.gate-nav{display:flex;gap:12px;align-items:center}
@media(max-width:680px){.gate-shell{grid-template-columns:1fr;margin-block:20px}.gate-nav{gap:8px}.gate-nav .button{padding-inline:10px}}
</style></head>
<body><header class="header"><div class="shell nav"><a class="brand" href="/">אור תורה</a>
<nav class="gate-nav" aria-label="ניווט ראשי"><a class="nav-link" href="/access" aria-current="page">גישה</a><a class="button gold" href="${mailLink}">בקשת גישה</a></nav></div></header>
<main class="shell gate-shell"><section><h1>שיעורי<br><strong>הרב נתן רוטמן</strong></h1><p>ספריית שיעורי תורה לצפייה ולהאזנה.</p></section>
<section class="gate-card" aria-labelledby="gate-title"><h2 id="gate-title">גישה לשיעורים</h2>
<form action="/access/code" method="post"><label for="course-code">קוד גישה</label><input id="course-code" type="password" name="code" inputmode="numeric" autocomplete="current-password" maxlength="4" placeholder="••••" dir="ltr" required>
${error ? '<p class="gate-error" role="alert">קוד הגישה שגוי. נסו שוב.</p>' : ''}<button class="button gold" type="submit">כניסה</button></form>
<p>אין לכם קוד? <a href="${mailLink}">בקשת גישה בדוא״ל</a></p></section></main>${siteFooter}</body></html>`, {
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
function layout(title, content, status = 200) {
  return new Response(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | אור תורה</title><link rel="stylesheet" href="/style.css"><style>
  main{padding-block:36px;min-height:70vh}footer{padding-block:24px;border-top:1px solid var(--edge)}h1,h2,p{margin-block:0 16px}h1{font:700 clamp(2rem,6vw,3.5rem)/1.15 var(--display)}form{display:grid;gap:12px;margin-block:18px}label{display:grid;gap:6px}input,select{width:100%;padding:11px;color:var(--text);background:var(--base);border:1px solid var(--edge);border-radius:8px;font:inherit;font-size:16px}button{justify-self:start;cursor:pointer;border:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,185px),1fr));gap:12px;margin-block:22px}.card{display:block;padding:18px;background:#151e2c;border:1px solid var(--edge);border-radius:12px;overflow-wrap:anywhere}.chosen{border-color:var(--gold)}.stack{max-width:720px}ul{padding-inline-start:0;list-style:none}li{margin-block:8px}video,iframe,audio{width:100%;display:block;margin-block:15px}iframe,video{aspect-ratio:16/9;border:0;background:#000}details{margin-block:18px}summary{cursor:pointer}
  </style></head><body><header class="header"><div class="shell nav"><a class="brand" href="/">אור תורה</a><a href="${mailLink}">בקשת גישה</a></div></header><main class="shell"><h1>${esc(title)}</h1>${content}</main>${siteFooter}</body></html>`,
  {status,headers:{...security,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; style-src 'self' 'unsafe-inline'; media-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"}});
}
function adminLogin(message = "", status = 200) {
  return layout("ניהול האתר", `<div class="panel stack">${message ? `<p role="alert">${esc(message)}</p>` : ""}<form method="post" action="/admin/login"><label>קוד ניהול<input type="password" name="pin" inputmode="numeric" maxlength="4" autocomplete="current-password" required></label><button class="button gold">כניסה לניהול</button></form></div>`, status);
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

function courseUploadForm(env, current, options, error = "", status = 200, check = "") {
  const enabled = uploadReady(env);
  return layout("הוספת שיעור", `<div class="panel stack"><a href="/admin">חזרה לניהול הספרייה</a>
    ${error ? `<p role="alert">${esc(error)}</p>` : ""}
    ${enabled ? `<p><a href="/admin?add=1&amp;check=1">בדיקת החיבור להעלאה</a>${check ? ` · <span role="status" dir="auto">${esc(check)}</span>` : ""}</p>` : '<p role="status">העלאה מהאתר תיפתח לאחר חיבור הרשאת כתיבה. בינתיים ניתן להעלות ישירות ל־Backblaze.</p>'}
    <form action="/admin/backblaze-upload" method="post" enctype="multipart/form-data">
      <fieldset ${enabled ? "" : "disabled"} style="display:grid;gap:14px;border:0;padding:0;margin:0;min-width:0">
        <input type="hidden" name="upload_id" value="${crypto.randomUUID()}">
        <label>כותרת השיעור<input name="title" maxlength="180" required></label>
        <label>קטגוריה<input name="folder" maxlength="120" value="${esc(current)}" list="course-categories" required></label>
        <datalist id="course-categories">${options}</datalist>
        <label>קובץ שמע MP3<input type="file" name="audio" accept=".mp3,audio/mpeg" required></label>
        <label>קובץ וידאו MP4 (אופציונלי)<input type="file" name="video" accept=".mp4,video/mp4"></label>
        <p>עד 30 MiB בסך הכול. לקבצים גדולים יותר, העלו ישירות ל־Backblaze.</p>
        <button class="button gold">פרסום השיעור</button>
      </fieldset>
    </form></div>`, status);
}

async function addBackblazeCourse(request, env) {
  if (!uploadReady(env)) return courseUploadForm(env, "", "", "", 503);
  const tooLarge = () => courseUploadForm(env, "", "", "הקבצים גדולים מדי להעלאה מהאתר.", 413);
  const length = Number(request.headers.get("Content-Length"));
  if (!length || length > courseUploadLimit + 64 * 1024) return tooLarge();
  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "").trim();
  const title = String(form?.get("title") ?? "").trim();
  const id = String(form?.get("upload_id") ?? "");
  const audio = form?.get("audio");
  const video = form?.get("video");
  const validName = (value, max) => value && value !== "." && value !== ".." && value.length <= max && !/[/\\\x00-\x1f\x7f]/.test(value);
  if (!validName(folder, 120) || !validName(title, 180) || !/^[a-f0-9-]{36}$/.test(id) ||
      !audio?.size || !/\.mp3$/i.test(audio.name) || (video?.size && !/\.mp4$/i.test(video.name))) {
    return courseUploadForm(env, folder, "", "בדקו את הכותרת, הקטגוריה וסוגי הקבצים.", 400);
  }
  if (audio.size + (video?.size || 0) > courseUploadLimit) return tooLarge();
  try {
    const storage = await backblaze(env, true);
    const key = `${folder}/${id}/${title}`;
    if (video?.size) await storage.upload(video, key + ".mp4", "video/mp4");
    await storage.upload(audio, key + ".mp3", "audio/mpeg");
    return redirect("/admin?" + new URLSearchParams({folder, published: "1"}));
  } catch (error) {
    return courseUploadForm(env, folder, "", "ההעלאה לא הושלמה. קוד תקלה: " + writeStatus(error), 502);
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
    <button class="button ${hidden ? "gold" : ""}" name="visibility" value="${hidden ? "restore" : "hide"}">${hidden ? "החזרה לספרייה" : "אישור הסרה מהספרייה"}</button>
  </form>`;
  return `<li class="card"><span class="lesson-title">${hidden ? esc(title) : `<a href="${esc(backblazeCourseLink(folder, code))}">${esc(title)}</a>`}</span>
    <small class="lesson-meta">${video ? "MP3 + MP4" : "MP3 בלבד — חסר MP4"} · ${hidden ? "מוסתר" : "מפורסם"}</small>
    ${hidden ? controls : `<details><summary>הסרה מהספרייה</summary><p>הקבצים יישארו ב־Backblaze ואפשר יהיה להחזיר את השיעור.</p>${controls}</details>`}</li>`;
}

async function backblazeAdmin(env, url) {
  const actions = '<div class="toolbar"><a class="button gold" href="/admin?add=1">הוספת שיעור</a><a class="button" href="https://secure.backblaze.com/user_signin.htm" target="_blank" rel="noopener noreferrer">פתיחת Backblaze</a><a class="button" href="/">לספריית השיעורים</a><form method="post" action="/admin/logout"><button class="button">יציאה מהניהול</button></form></div>';
  const howTo = '<details class="panel"><summary>הוספה, עדכון והסרת שיעורים</summary><ol><li>צרו תיקייה ב־Backblaze לכל קטגוריה.</li><li>העלו MP3 ו־MP4 לאותה תיקייה עם שם זהה לפני הסיומת.</li><li>בחרו כאן את הקטגוריה כדי לבדוק את השיעורים שהתפרסמו. אפשר להסיר שיעורים מהספרייה ולהחזיר אותם כאן. את קובצי המקור עורכים ב־Backblaze.</li></ol></details>';
  try {
    const storage = await backblaze(env);
    const folders = await backblazeFolders(storage);
    const current = url.searchParams.get("folder") ?? "";
    const status = `${url.searchParams.has("published") ? '<p role="status">השיעור פורסם בהצלחה.</p>' : ""}<p role="status">Backblaze מחובר · ${folders.length} קטגוריות</p>`;
    const options = folders.map(folder => `<option value="${esc(folder)}"${folder === current ? " selected" : ""}>${esc(folder)}</option>`).join("");
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
      return courseUploadForm(env, current, options, "", 200, check);
    }
    const form = `<form method="get" class="library-search"><label>קטגוריה לבדיקה<select name="folder" required><option value="">בחירת קטגוריה</option>${options}</select></label><button class="button gold">בדיקת שיעורים</button></form>`;
    let result = `<ul class="folder-grid">${folders.map(folder => `<li><a class="card folder-card" href="/admin?${esc(new URLSearchParams({folder}))}">${folderIcon}${esc(folder)}</a></li>`).join("")}</ul>`;
    if (folders.includes(current)) {
      const {courses, notes} = await planImport(current, storage);
      const {results: hiddenRows} = await env.DB.prepare("SELECT course_id FROM backblaze_hidden_courses WHERE folder = ?").bind(current).all();
      const hiddenIds = new Set(hiddenRows.map(row => row.course_id));
      const published = courses.filter(course => !hiddenIds.has(course.code));
      const hidden = courses.filter(course => hiddenIds.has(course.code));
      const notice = {hide: "השיעור הוסר מהספרייה.", restore: "השיעור הוחזר לספרייה."}[url.searchParams.get("visibility")];
      result = `<h2>${esc(current)}</h2>${typeof notice === "string" ? `<p role="status">${notice}</p>` : ""}
        <p>${published.length} שיעורים מפורסמים · ${hidden.length} מוסתרים</p>
        <ul class="lesson-list">${published.map(course => adminCourseRow(current, course, false)).join("")}</ul>
        ${hidden.length ? `<details class="panel"><summary>שיעורים שהוסרו (${hidden.length})</summary><ul class="lesson-list">${hidden.map(course => adminCourseRow(current, course, true)).join("")}</ul></details>` : ""}
        ${notes.length ? `<details class="panel"><summary>קבצים לבדיקה (${notes.length})</summary><ul>${notes.map(note => `<li>${esc(note)}</li>`).join("")}</ul></details>` : ""}`;
    }
    return layout("ניהול הספרייה", actions + status + form + result + howTo);
  } catch {
    return layout("ניהול הספרייה", actions + '<p role="alert">לא ניתן לטעון את Backblaze כרגע. <a href="/admin">ניסיון נוסף</a></p>' + howTo, 502);
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
    return layout(course.title, `<nav class="breadcrumbs" aria-label="מיקום בספרייה"><a href="/">ספריית השיעורים</a><span aria-hidden="true">‹</span><a href="${esc(backblazeCourseLink(category))}">${esc(category)}</a></nav><div class="panel media-panel">
      <h2>צפייה בשיעור (MP4)</h2>
      ${course.video ? `<video controls playsinline preload="metadata" src="${esc(backblazeCourseLink(category, courseId, "video"))}"></video>
        <p><a class="button" href="${esc(backblazeCourseLink(category, courseId, "video") + "&download=1")}">הורדת MP4</a></p>` : '<p role="status">אין עדיין קובץ וידאו לשיעור זה.</p>'}
      <h2>האזנה לשיעור (MP3)</h2>
      <audio controls preload="metadata" src="${esc(backblazeCourseLink(category, courseId, "audio"))}"></audio>
      <p><a class="button" href="${esc(backblazeCourseLink(category, courseId, "audio") + "&download=1")}">הורדת MP3</a></p></div>`);
  }
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  const folders = await backblazeFolders(storage);
  const search = `<form method="get" class="panel library-search"><label>חיפוש שיעור<input type="search" name="q" maxlength="120" placeholder="שם השיעור" value="${esc(query)}"></label><label>קטגוריה<select name="folder"><option value="">כל הקטגוריות</option>${folders.map(folder => `<option value="${esc(folder)}"${folder === category ? " selected" : ""}>${esc(folder)}</option>`).join("")}</select></label><button class="button gold">חיפוש</button></form>`;
  if (!category && !query) {
    const cards = folders.map(folder => `<li><a class="card folder-card" href="${esc(backblazeCourseLink(folder))}">${folderIcon}<span>${esc(folder)}</span><span aria-hidden="true" class="folder-arrow">‹</span></a></li>`).join("");
    return layout("שיעורי הרב נתן רוטמן", search + '<h2>קטגוריות</h2>' + (cards
      ? `<ul class="folder-grid">${cards}</ul>`
      : '<div class="panel empty-state"><p>עדיין אין קטגוריות בספרייה.</p></div>'));
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
        rows.push(`<li><a class="card" href="${esc(backblazeCourseLink(folder, code))}"><span class="lesson-title">${esc(title)}</span><small class="lesson-meta">${esc(folder)} · ${video ? "MP3 + MP4" : "MP3"}</small></a></li>`);
      }
    }
  }
  const perPage = 30;
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  const page = Math.max(1, Math.min(pageCount, Number.parseInt(url.searchParams.get("page"), 10) || 1));
  const pageLink = next => "/?" + new URLSearchParams({folder: category, q: query, page: next});
  const pager = pageCount > 1 ? `<nav class="pagination" aria-label="עמודי שיעורים">
    ${page > 1 ? `<a class="button" href="${esc(pageLink(page - 1))}">העמוד הקודם</a>` : ""}
    ${page < pageCount ? `<a class="button" href="${esc(pageLink(page + 1))}">העמוד הבא</a>` : ""}
  </nav>` : "";
  return layout(category || "תוצאות חיפוש",
    '<nav class="breadcrumbs" aria-label="מיקום בספרייה"><a href="/">כל הקטגוריות</a></nav>' + search +
    `<div class="section-top"><h2>${query ? "תוצאות חיפוש" : "שיעורים"}</h2><p>${rows.length} שיעורים</p></div>` +
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
