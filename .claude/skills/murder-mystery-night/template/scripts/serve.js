#!/usr/bin/env node
/* Serves the game on http://localhost:8801, relays Philips Hue commands to the bridge, and passes
   button presses from a phone remote to the host window.
     node scripts/serve.js            (or: npm start, or double-click Start Blackwood Manor.command)
   - /hue/<bridge-ip>/<path> goes to https://<bridge-ip>/<path> (home-network addresses only, and only
     for pages on this laptop), so the browser needs no certificate exception or network permission.
   - The phone remote (remote.html, on the home Wi-Fi) needs the code printed below. The host window
     on this laptop publishes its buttons to /remote/state and collects presses from /remote/cmd;
     the laptop stays the only thing that runs the night. */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const os = require('os');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 8801;
const CODE = process.env.REMOTE_CODE || String(crypto.randomInt(100000, 1000000));
function lanAddress() {
  const all = [];
  for (const list of Object.values(os.networkInterfaces())) for (const a of list || []) if (a.family === 'IPv4' && !a.internal) all.push(a.address);
  return all.find((a) => a.startsWith('192.168.')) || all.find((a) => PRIVATE.test(a)) || all[0] || 'localhost';
}
const phoneUrl = () => `http://${lanAddress()}:${PORT}/remote.html?k=${CODE}`;
/* The remote: the host's latest snapshot of its controls, and the presses waiting for it. */
let snapshot = null, snapshotAt = 0, cmdSeq = 0, cmds = [];
/* One host window takes the presses: the one that has been publishing, until it is quiet for 5s. */
let holder = null;
const holds = (id) => { if (!holder || holder === id || Date.now() - snapshotAt > 5000) { holder = id; return true; } return false; };
const isLocal = (req) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
function json(res, code, body) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
function readBody(req, max, cb) {
  let body = ''; let over = false;
  req.on('data', (c) => { body += c; if (body.length > max) { over = true; req.destroy(); } });
  req.on('end', () => { if (over) return; try { cb(body ? JSON.parse(body) : {}); } catch (e) { cb(null); } });
}
function remote(req, res, url) {
  const p = url.pathname;
  const coded = url.searchParams.get('k') === CODE;
  if (p === '/remote/info' && isLocal(req)) return json(res, 200, { url: phoneUrl(), code: CODE });
  const host = url.searchParams.get('host') || 'one';
  if (p === '/remote/state' && req.method === 'POST' && isLocal(req)) return readBody(req, 200000, (b) => {
    if (!b) return json(res, 400, { ok: false });
    if (!holds(host)) return json(res, 200, { ok: false, busy: true });
    snapshot = b; snapshotAt = Date.now(); json(res, 200, { ok: true });
  });
  if (p === '/remote/cmd' && req.method === 'GET' && isLocal(req)) {
    const since = Number(url.searchParams.get('since')) || 0;
    return json(res, 200, { seq: cmdSeq, cmds: holder === host ? cmds.filter((c) => c.seq > since) : [] });
  }
  if (!coded) return json(res, 403, { error: 'wrong or missing code' });
  if (p === '/remote/state' && req.method === 'GET') return json(res, 200, { snapshot, age: snapshot ? Date.now() - snapshotAt : null });
  if (p === '/remote/cmd' && req.method === 'POST') return readBody(req, 4000, (b) => {
    if (!b || typeof b.id !== 'number' || typeof b.label !== 'string') return json(res, 400, { error: 'bad press' });
    const cmd = { seq: ++cmdSeq, at: Date.now(), id: b.id, label: b.label.slice(0, 200), value: b.value == null ? null : String(b.value).slice(0, 100), confirmed: b.confirmed === true };
    cmds.push(cmd); cmds = cmds.filter((c) => Date.now() - c.at < 30000).slice(-50);
    json(res, 200, { ok: true, seq: cmd.seq });
  });
  json(res, 404, { error: 'unknown' });
}
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const PRIVATE = /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+)$/;
const bridgeAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true }); // the bridge's own certificate

function relay(req, res, host, rest) {
  if (!PRIVATE.test(host)) { res.writeHead(400); return res.end('[{"error":{"description":"bridge must be a home-network address"}}]'); }
  const up = https.request({ host, path: rest || '/', method: req.method, agent: bridgeAgent, timeout: 6000,
    headers: { 'Content-Type': 'application/json' } }, (r) => {
    res.writeHead(r.statusCode, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    r.pipe(res);
  });
  up.on('timeout', () => up.destroy(new Error('the bridge did not answer')));
  up.on('error', (e) => { if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify([{ error: { description: `cannot reach the bridge at ${host}: ${e.message}` } }])); });
  req.pipe(up);
}

function serveFile(req, res, urlPath) {
  let p = decodeURIComponent(urlPath);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT + path.sep) || /\/\.|\.env/.test(p)) { res.writeHead(404); return res.end('Not found'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/hue/ping') { res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }); return res.end('blackwood-hue-relay'); }
  const m = url.pathname.match(/^\/hue\/([^/]+)(\/.*)?$/);
  if (m) { if (!isLocal(req)) { res.writeHead(403); return res.end(); } return relay(req, res, m[1], (m[2] || '/') + url.search); }
  if (url.pathname.startsWith('/remote/')) return remote(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveFile(req, res, url.pathname);
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Blackwood Manor: http://localhost:${PORT}   (keep this window open; Ctrl+C stops it)`);
  console.log(`Phone remote (same Wi-Fi): ${phoneUrl()}   (also shown as a QR code on the setup screen)`);
});
