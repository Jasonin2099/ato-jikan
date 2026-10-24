// あと何時間 — shifts, multiple jobs and the rolling 7-day check for 資格外活動 (browser + Node). No DOM, no I/O.
// Dates are 'YYYY-MM-DD' strings and times 'HH:MM'; all math runs on UTC day numbers so the result never
// depends on the device time zone.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AtoShifts = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const api = {};

  // ---- dates ----
  const DAY = 1440;
  api.dayNum = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : NaN; };
  api.dayStr = n => new Date(n * 864e5).toISOString().slice(0, 10);
  api.mins = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m && +m[1] <= 24 && +m[2] < 60 ? +m[1] * 60 + +m[2] : NaN; };

  return api;
});
