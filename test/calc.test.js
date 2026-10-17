const test = require('node:test'), assert = require('node:assert');
const R = require('../rules/2026.json'), C = require('../calc.js');
const base = { wage: 1000, pays: 3, young: true, weeksLeft: 10 };
const amounts = y => C.walls(R, y).map(w => w.amount);

test('young walls are 136/150/159/178/197万円', () => {
  assert.deepStrictEqual(amounts(true), [1360000, 1500000, 1590000, 1780000, 1970000]);
});
test('other-age walls are 130/136/178万円', () => {
  assert.deepStrictEqual(amounts(false), [1300000, 1360000, 1780000]);
});
test('every rule cites an official source and year', () => {
  for (const [k, v] of Object.entries(R)) if (v && typeof v === 'object') {
    assert.match(v.url, /^https:\/\/www\.(nta|nenkin|moj)\.go\.jp\//, k); assert.ok(v.source, k); assert.strictEqual(v.year, 2026, k);
  }
});
test('150万円 is 未満: 1,499,999 ok, 1,500,000 over', () => {
  const s = ytd => C.compute(R, { ...base, ytd }).status.find(x => x.id === 'shaho').over;
  assert.strictEqual(s(1499999), false); assert.strictEqual(s(1500000), true);
});
test('136万円: exactly 136万 keeps 特定扶養 63万, +1 yen moves to 特定親族特別控除 (still 63万)', () => {
  assert.strictEqual(C.parentDed(R, 1360000, true), 630000);
  assert.strictEqual(C.parentDed(R, 1360001, true), 630000);
  assert.strictEqual(C.parentDed(R, 1360001, false), 0);
  assert.strictEqual(C.parentDed(R, 1360000, false), 380000);
});
test('159万円: 63万 up to 159万, 61万 above', () => {
  assert.strictEqual(C.parentDed(R, 1590000, true), 630000);
  assert.strictEqual(C.parentDed(R, 1590001, true), 610000);
});
test('No.1177 table steps', () => {
  const want = [[1640000,610000],[1690000,510000],[1740000,410000],[1790000,310000],[1840000,210000],[1890000,110000],[1940000,60000],[1970000,30000]];
  for (const [y, d] of want) assert.strictEqual(C.parentDed(R, y, true), d, String(y));
});
test('178万円 = 74万 + 基礎控除104万 (own income tax starts above)', () => {
  assert.strictEqual(C.walls(R, true).find(w => w.id === 'tax').amount, 1780000);
});
test('197万円: 3万 at 197万, 0 above', () => {
  assert.strictEqual(C.parentDed(R, 1970000, true), 30000);
  assert.strictEqual(C.parentDed(R, 1970001, true), 0);
});
test('hero example: 980,000 at 1,200/h → 433 h to 150万未満', () => {
  assert.strictEqual(C.compute(R, { ...base, wage: 1200, ytd: 980000 }).hours, 433);
});
test('28h/week binds for international students', () => {
  const r = C.compute(R, { ...base, ytd: 0, intl: true, termWeeks: 10, vacWeeks: 0 });
  assert.strictEqual(r.legalH, 280); assert.strictEqual(r.hours, 280); assert.ok(r.bindLegal);
});
test('vacation uses conservative 40h/week', () => {
  assert.strictEqual(C.compute(R, { ...base, ytd: 0, intl: true, termWeeks: 2, vacWeeks: 3 }).legalH, 2 * 28 + 3 * 40);
});
test('money binds before 28h rule', () => {
  const r = C.compute(R, { ...base, ytd: 1400000, intl: true, termWeeks: 10 });
  assert.strictEqual(r.hours, 99); assert.strictEqual(r.bindLegal, false);
});
test('edge cases: already over, zero wage, garbage input', () => {
  assert.strictEqual(C.compute(R, { ...base, ytd: 2000000 }).hours, 0);
  assert.strictEqual(C.compute(R, { ...base, ytd: 0, wage: 0 }).hours, 0);
  const r = C.compute(R, { wage: 'x', ytd: -5, pays: 0, young: true });
  assert.strictEqual(r.hours, 0); assert.strictEqual(r.perM, 0); assert.strictEqual(r.perW, 0);
});
test('projection flags walls the current pace will cross', () => {
  const r = C.compute(R, { ...base, ytd: 1300000, weekHours: 20, weeksLeft: 10 });
  assert.strictEqual(r.proj, 1500000);
  assert.ok(r.status.find(x => x.id === 'shaho').projOver);
  assert.ok(!r.status.find(x => x.id === 'tokuteiStart').projOver);
});
test('weeksLeft is 0 on Dec 31 night and ~52 on Jan 1', () => {
  assert.strictEqual(C.weeksLeft(new Date(2026, 11, 31, 23, 59)), 0);
  assert.ok(Math.abs(C.weeksLeft(new Date(2026, 0, 1)) - 52.1) < 0.2);
});
