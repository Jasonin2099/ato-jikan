const test = require('node:test'), assert = require('node:assert');
const R = require('../rules/2026.json');

test('特定親族特別控除 table: income caps rise, deductions fall', () => {
  const t = R.tokutei.table;
  for (let i = 1; i < t.length; i++) {
    assert.ok(t[i][0] > t[i - 1][0], `cap ${i}`);
    assert.ok(t[i][1] < t[i - 1][1], `deduction ${i}`);
  }
  assert.ok(t[0][0] > R.fuyoShotoku.value, 'table starts above the 扶養 income limit');
});
test('every rule value is a positive number and every url is https', () => {
  for (const [k, v] of Object.entries(R)) {
    if (!v || typeof v !== 'object') continue;
    assert.match(v.url, /^https:\/\//, k);
    for (const f of ['value', 'young', 'other']) if (f in v) assert.ok(Number.isFinite(v[f]) && v[f] > 0, `${k}.${f}`);
  }
});
