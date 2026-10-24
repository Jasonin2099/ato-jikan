const test = require('node:test'), assert = require('node:assert');
const R = require('../rules/2026.json'), S = require('../shifts.js');
const sh = (date, start, end, job = 'a') => ({ date, start, end, job });

test('a shift past midnight books the part after 0:00 on the next day', () => {
  const { hours } = S.dayHours([sh('2026-10-30', '22:00', '03:00')]);
  assert.strictEqual(hours[S.dayNum('2026-10-30')], 2);
  assert.strictEqual(hours[S.dayNum('2026-10-31')], 3);
});
test('a shift ending exactly at 24:00 / 0:00 stays on its own day', () => {
  assert.deepStrictEqual(Object.values(S.dayHours([sh('2026-10-30', '18:00', '24:00')]).hours), [6]);
  assert.deepStrictEqual(Object.values(S.dayHours([sh('2026-10-30', '18:00', '00:00')]).hours), [6]);
});
test('hours-only shifts and bad input', () => {
  const { hours } = S.dayHours([{ date: '2026-11-02', hours: 4.5 }, { date: 'x', hours: 3 }, sh('2026-11-02', '10:00', '10:00')]);
  assert.deepStrictEqual(hours, { [S.dayNum('2026-11-02')]: 4.5 });
});

test('overlapping shifts (two jobs at once) are counted once and reported', () => {
  const r = S.dayHours([sh('2026-11-02', '10:00', '15:00', 'a'), sh('2026-11-02', '14:00', '18:00', 'b'), sh('2026-11-02', '11:00', '12:00', 'b')]);
  assert.strictEqual(r.hours[S.dayNum('2026-11-02')], 8);
  assert.strictEqual(r.overlaps.length, 2);
});
test('back-to-back shifts are not an overlap', () => {
  const r = S.dayHours([sh('2026-11-02', '10:00', '14:00'), sh('2026-11-02', '14:00', '18:00', 'b')]);
  assert.strictEqual(r.overlaps.length, 0); assert.strictEqual(r.hours[S.dayNum('2026-11-02')], 8);
});

test('28 h is checked over any 7 days, not calendar weeks', () => {
  // Thu–Sun 7 h each = 28 h in Mon–Sun week; plus Mon–Wed next week 7 h each.
  // Every calendar week is ≤ 28, but Thu..Wed = 49 h.
  const days = ['2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11'];
  const r = S.check(R, days.map(d => sh(d, '10:00', '17:00')), []);
  assert.strictEqual(r.max, 49); assert.strictEqual(r.maxFrom, '2026-11-05'); assert.ok(r.over.length > 0);
});
test('exactly 28 h in 7 days is fine, 28.5 h is over', () => {
  const four = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05'].map(d => sh(d, '10:00', '17:00'));
  assert.strictEqual(S.check(R, four, []).over.length, 0);
  assert.ok(S.check(R, four.concat([sh('2026-11-08', '10:00', '10:30')]), []).over.length > 0);
});
test('a midnight shift moves hours into the next window', () => {
  const r = S.check(R, [sh('2026-11-01', '20:00', '04:00'), ...['2026-11-02', '2026-11-03', '2026-11-04'].map(d => sh(d, '09:00', '17:00'))], []);
  assert.strictEqual(r.max, 32);
  const w = r.windows.find(x => x.from === '2026-11-02');
  assert.strictEqual(w.hours, 28); assert.ok(!r.over.includes(w));
});
