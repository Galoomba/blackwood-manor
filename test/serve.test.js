const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const PORT = 18897;
const base = `http://127.0.0.1:${PORT}`;

test('the local server serves the game, guards the remote with its code and passes presses on', async (t) => {
  const srv = spawn(process.execPath, [path.join(__dirname, '..', 'scripts', 'serve.js')], { env: { ...process.env, PORT: String(PORT), REMOTE_CODE: '424242' }, stdio: 'ignore' });
  t.after(() => srv.kill());
  for (let i = 0; i < 50; i++) { try { await fetch(`${base}/hue/ping`); break; } catch (e) { await new Promise((r) => setTimeout(r, 100)); } }

  assert.equal((await fetch(`${base}/index.html`)).status, 200);
  assert.equal((await fetch(`${base}/remote.html`)).status, 200);
  assert.equal((await fetch(`${base}/.env.local`)).status, 404);
  assert.equal(await (await fetch(`${base}/hue/ping`)).text(), 'blackwood-hue-relay');

  const info = await (await fetch(`${base}/remote/info`)).json();
  assert.equal(info.code, '424242');
  assert.match(info.url, /\/remote\.html\?k=424242$/);

  assert.equal((await fetch(`${base}/remote/state`)).status, 403, 'the phone needs the code');
  assert.equal((await fetch(`${base}/remote/cmd`, { method: 'POST', body: '{"id":0,"label":"x"}' })).status, 403);

  await fetch(`${base}/remote/state?host=a`, { method: 'POST', body: JSON.stringify({ heading: '1.1 Who you are', groups: [] }) });
  const other = await (await fetch(`${base}/remote/state?host=b`, { method: 'POST', body: JSON.stringify({ heading: 'second tab', groups: [] }) })).json();
  assert.equal(other.busy, true, 'a second host tab does not take over');
  const st = await (await fetch(`${base}/remote/state?k=424242`)).json();
  assert.equal(st.snapshot.heading, '1.1 Who you are');

  const first = await (await fetch(`${base}/remote/cmd?since=0&host=a`)).json();
  const sent = await (await fetch(`${base}/remote/cmd?k=424242`, { method: 'POST', body: JSON.stringify({ id: 3, label: 'Cards out (2 min)' }) })).json();
  assert.ok(sent.ok);
  const got = await (await fetch(`${base}/remote/cmd?since=${first.seq}&host=a`)).json();
  assert.deepEqual(got.cmds.map((c) => [c.id, c.label]), [[3, 'Cards out (2 min)']]);
  assert.deepEqual((await (await fetch(`${base}/remote/cmd?since=${first.seq}&host=b`)).json()).cmds, [], 'only the holding tab gets presses');
  assert.equal((await fetch(`${base}/remote/cmd?k=424242`, { method: 'POST', body: '{"id":"x"}' })).status, 400);
  assert.equal((await fetch(`${base}/hue/8.8.8.8/api`)).status, 400, 'only home-network bridges');
});
