const test = require('node:test');
const assert = require('node:assert');
const C = require('../calc.js');

test('weeksLeft never goes negative and only shrinks through the year', () => {
  let prev = Infinity;
  for (let m = 0; m < 12; m++) {
    const w = C.weeksLeft(new Date(2026, m, 15));
    assert.ok(w >= 0);
    assert.ok(w < prev);
    prev = w;
  }
});

test('weeksLeft is about one week on Dec 24', () => {
  assert.ok(Math.abs(C.weeksLeft(new Date(2026, 11, 24, 23, 59)) - 1) < 0.01);
});
