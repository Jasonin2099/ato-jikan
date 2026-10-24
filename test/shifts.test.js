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
