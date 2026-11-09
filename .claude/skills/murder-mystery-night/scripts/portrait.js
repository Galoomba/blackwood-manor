#!/usr/bin/env node
/* Find and fetch a freely licensed inspiration portrait for a character.

   node portrait.js search "plague doctor costume"         list candidates (Openverse + Wikimedia Commons)
   node portrait.js get <image-url> <game>/assets/characters/<id>.jpg "<title> by <creator> (<license>) <page-url>"
        downloads it, crops to a 3:4 portrait, 900px high (macOS sips), and appends the credit
        to <game>/assets/characters/CREDITS.md.
        Add  --top           to keep the top of the picture (full-length shots: keeps the head)
             --zoom 0.6      to crop tighter (0.6 = 60% of the largest 3:4 crop), e.g. head and shoulders
             --inset 0.03    to shave a scan border off every edge first (3% of each side)
        Re-run get on the same file with other options to recrop (the credit line is not duplicated).

   Only CC0, public domain, CC BY and CC BY-SA images are listed. Look at every image before using
   it (Read the file): no watermarks, no text, one clear figure, nothing a guest would find offensive. */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const UA = { 'User-Agent': 'murder-night-portraits/1.0 (personal party game)' };
const OK = /^(cc0|pdm|by|by-sa)$/i;

async function search(q) {
  const out = [];
  try {
    const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm,by,by-sa&aspect_ratio=tall&page_size=12`, { headers: UA });
    const d = await r.json();
    for (const x of d.results || []) if (OK.test(x.license)) out.push({ src: 'openverse', title: x.title, creator: x.creator || 'unknown', license: `CC ${x.license.toUpperCase()} ${x.license_version || ''}`.trim(), url: x.url, page: x.foreign_landing_url, w: x.width, h: x.height });
  } catch (e) { console.error('openverse:', e.message); }
  try {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1000&format=json`;
    const d = await (await fetch(u, { headers: UA })).json();
    for (const p of Object.values((d.query || {}).pages || {})) {
      const ii = p.imageinfo[0]; const m = ii.extmetadata || {};
      const lic = (m.LicenseShortName || {}).value || '';
      if (!/public domain|cc0|cc by(-sa)?/i.test(lic) || /nc|nd/i.test(lic)) continue;
      out.push({ src: 'commons', title: p.title.replace(/^File:/, ''), creator: ((m.Artist || {}).value || 'unknown').replace(/<[^>]+>/g, '').trim(), license: lic, url: ii.thumburl || ii.url, page: ii.descriptionurl, w: ii.width, h: ii.height });
    }
  } catch (e) { console.error('commons:', e.message); }
  out.forEach((c, i) => console.log(`${String(i + 1).padStart(2)}. [${c.src}] ${c.title.slice(0, 70)}\n    ${c.w}x${c.h} · ${c.license} · ${c.creator.slice(0, 40)}\n    image: ${c.url}\n    page:  ${c.page}`));
  if (!out.length) console.log('No freely licensed results. Try fewer or different words (costume, portrait, illustration, painting).');
}

async function get(url, file, credit, opts) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`download failed: ${r.status}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.download';
  fs.writeFileSync(tmp, Buffer.from(await r.arrayBuffer()));
  if (process.platform === 'darwin') {
    const dims = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', tmp]).toString();
    const W = +/pixelWidth: (\d+)/.exec(dims)[1], H = +/pixelHeight: (\d+)/.exec(dims)[1];
    const ix = Math.round(W * opts.inset), iy = Math.round(H * opts.inset);
    const w = W - 2 * ix, h = H - 2 * iy;
    const cw = Math.round(Math.min(w, h * 3 / 4) * opts.zoom), ch = Math.round(cw * 4 / 3);
    const x = ix + Math.round((w - cw) / 2), y = iy + (opts.top ? 0 : Math.round((h - ch) / 2));
    execFileSync('sips', ['-s', 'format', 'jpeg', '-c', String(ch), String(cw), '--cropOffset', String(y), String(x), tmp, '--out', file], { stdio: 'ignore' });
    execFileSync('sips', ['--resampleHeight', '900', file], { stdio: 'ignore' });
    fs.unlinkSync(tmp);
  } else fs.renameSync(tmp, file);
  const credits = path.join(path.dirname(file), 'CREDITS.md');
  if (!fs.existsSync(credits)) fs.writeFileSync(credits, '# Portrait credits\n\nInspiration portraits until the guests send photos of their own costumes.\n\n');
  const line = `- ${path.basename(file)}: ${credit}\n`;
  const kept = fs.readFileSync(credits, 'utf8').split('\n').filter((l) => !l.startsWith(`- ${path.basename(file)}: `)).join('\n');
  fs.writeFileSync(credits, (kept.endsWith('\n') ? kept : kept + '\n') + line);
  console.log(`saved ${file}`);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'search' && rest[0]) search(rest.join(' '));
else if (cmd === 'get' && rest.length >= 3) {
  const [url, file, credit, ...flags] = rest;
  const num = (name, dflt) => { const i = flags.indexOf(name); return i < 0 ? dflt : Number(flags[i + 1]); };
  const opts = { top: flags.includes('--top'), zoom: Math.min(1, Math.max(0.2, num('--zoom', 1))), inset: Math.min(0.2, Math.max(0, num('--inset', 0))) };
  get(url, file, credit, opts).catch((e) => { console.error(e.message); process.exit(1); });
}
else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(2); }
