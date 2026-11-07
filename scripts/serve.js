#!/usr/bin/env node
/* Serves the game on http://localhost:8801 and relays Philips Hue commands to the bridge.
     node scripts/serve.js            (or: npm start)
   The browser then talks only to this laptop: no certificate to trust and no browser permission
   for the home network. /hue/<bridge-ip>/<path> is passed on to https://<bridge-ip>/<path>; only
   private network addresses are allowed, and the server listens on this laptop only. */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8801;
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
  if (m) return relay(req, res, m[1], (m[2] || '/') + url.search);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveFile(req, res, url.pathname);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Blackwood Manor: http://localhost:${PORT}  (lights relay on; keep this window open, Ctrl+C to stop)`);
});
