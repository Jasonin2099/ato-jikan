const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const core = JSON.parse('[' + /const CORE = \[([\s\S]*?)\];/.exec(sw)[1].replace(/'/g, '"') + ']');

test('every precached file exists', () => {
  for (const f of core) if (f !== './') assert.ok(fs.existsSync(path.join(root, f)), f);
});
test('manifest icons exist and are precached for offline install', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  for (const i of m.icons) {
    assert.ok(fs.existsSync(path.join(root, i.src)), i.src);
    assert.ok(core.includes(i.src), i.src + ' not in sw.js CORE');
  }
});
