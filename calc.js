// あと何時間 — pure calculation module (browser + Node). No DOM, no I/O.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AtoJikan = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const shotoku = (R, y) => Math.max(0, y - R.kyuyoKojo.value);

  // 親が受ける控除額（所得税）
  function parentDed(R, y, young) {
    const s = shotoku(R, y);
    if (s <= R.fuyoShotoku.value) return young ? R.fuyoKojo.young : R.fuyoKojo.other;
    if (!young) return 0;
    for (const [cap, d] of R.tokutei.table) if (s <= cap) return d;
    return 0;
  }

  // 年収の壁（給与収入ベース）。at = この額を「超える」と該当
  function walls(R, young) {
    const k = R.kyuyoKojo.value, shaho = young ? R.shaho.young : R.shaho.other;
    const w = [
      { id: 'shaho', at: shaho - 1, amount: shaho, under: true, cliff: true, url: R.shaho.url },
      { id: 'fuyo', at: k + R.fuyoShotoku.value, amount: k + R.fuyoShotoku.value, cliff: !young, url: R.fuyoShotoku.url },
      { id: 'tax', at: k + R.kiso.value, amount: k + R.kiso.value, url: R.kiso.url }
    ];
    if (young) {
      const t = R.tokutei.table;
      w.push({ id: 'tokuteiStart', at: k + t[0][0], amount: k + t[0][0], url: R.tokutei.url });
      w.push({ id: 'tokuteiEnd', at: k + t[t.length - 1][0], amount: k + t[t.length - 1][0], url: R.tokutei.url });
    }
    return w.sort((a, b) => a.at - b.at);
  }

  // in: {wage, ytd, pays, young, intl, termWeeks, vacWeeks, weekHours, weeksLeft}
  function compute(R, i) {
    const wage = Math.max(0, +i.wage || 0), ytd = Math.max(0, +i.ytd || 0), pays = Math.max(1, +i.pays || 1);
    const W = walls(R, !!i.young);
    const target = W.find(w => w.id === 'shaho');
    const room = Math.max(0, target.at - ytd);
    const moneyH = wage > 0 ? Math.floor(room / wage) : 0;
    const legalH = i.intl ? Math.max(0, +i.termWeeks || 0) * R.intlWeek.value + Math.max(0, +i.vacWeeks || 0) * R.intlVacWeek.value : null;
    const hours = legalH === null ? moneyH : Math.min(moneyH, legalH);
    const wl = Math.max(0, +i.weeksLeft || 0);
    const proj = i.weekHours != null && wage > 0 ? ytd + wage * i.weekHours * wl : null;
    return {
      hours, moneyH, legalH, room, target, walls: W, proj,
      bindLegal: legalH !== null && legalH < moneyH,
      roomUsed: Math.min(room, hours * wage),
      perM: Math.floor(hours / pays), perW: wl > 0 ? hours / wl : 0,
      status: W.map(w => ({ id: w.id, over: ytd > w.at, projOver: proj !== null && proj > w.at }))
    };
  }

  function weeksLeft(now) { const n = now || new Date(), e = new Date(n.getFullYear(), 11, 31, 23, 59); return Math.max(0, (e - n) / 864e5 / 7); }

  return { shotoku, parentDed, walls, compute, weeksLeft };
});
