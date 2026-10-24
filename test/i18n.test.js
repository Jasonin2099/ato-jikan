const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), vm = require('vm');
const ctx = { location: { search: '' }, navigator: { languages: ['ja'] }, localStorage: { getItem() { return null; } }, URLSearchParams };
ctx.self = ctx;
vm.runInNewContext(fs.readFileSync(__dirname + '/../i18n.js', 'utf8'), ctx);
const S = ctx.I18N.strings;

for (const l of ['zh', 'en']) {
  test(`${l} has every ja key with the same type and arity`, () => {
    const missing = Object.keys(S.ja).filter(k => !(k in S[l]));
    assert.deepStrictEqual(missing, []);
    for (const k of Object.keys(S.ja)) {
      assert.strictEqual(typeof S[l][k], typeof S.ja[k], k);
      if (typeof S.ja[k] === 'function') assert.strictEqual(S[l][k].length, S.ja[k].length, k);
    }
  });
  test(`${l} has no keys unknown to ja`, () => {
    assert.deepStrictEqual(Object.keys(S[l]).filter(k => !(k in S.ja)), []);
  });
}
test('no string is empty', () => {
  for (const l in S) for (const k in S[l]) if (typeof S[l][k] === 'string') assert.ok(S[l][k].trim(), `${l}.${k}`);
});
