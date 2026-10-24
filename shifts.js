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

  // ---- one shift -> minutes per calendar day ----
  // With start/end the shift is a time interval; end <= start means it runs past midnight and the part
  // after 0:00 counts for the next day. Without times, `hours` is booked on the shift's own date.
  api.interval = sh => {
    const d = api.dayNum(sh.date), a = api.mins(sh.start), b = api.mins(sh.end);
    if (isNaN(d) || isNaN(a) || isNaN(b) || a === b) return null;
    return [d * DAY + a, d * DAY + b + (b < a ? DAY : 0)];
  };
  function splitDays(lo, hi, out) {
    for (let x = lo; x < hi;) { const d = Math.floor(x / DAY), end = Math.min(hi, (d + 1) * DAY); out[d] = (out[d] || 0) + (end - x); x = end; }
  }
  api.splitDays = splitDays;

  // ---- all shifts -> hours per day ----
  // Overlapping intervals (two jobs booked at the same time, or a typo) are counted once: you cannot work
  // two hours in one hour. They are reported in `overlaps` so the user can fix the entry.
  api.dayHours = shifts => {
    const iv = [], min = {}, overlaps = [];
    (shifts || []).forEach((sh, i) => {
      const v = api.interval(sh);
      if (v) iv.push([v[0], v[1], i]);
      else { const d = api.dayNum(sh.date), h = +sh.hours; if (!isNaN(d) && h > 0) min[d] = (min[d] || 0) + Math.round(h * 60); }
    });
    iv.sort((p, q) => p[0] - q[0]);
    let cur = null;
    for (const [a, b, i] of iv) {
      if (cur && a < cur[1]) { overlaps.push([cur[2], i]); if (b > cur[1]) { cur[1] = b; cur[2] = i; } }
      else { if (cur) splitDays(cur[0], cur[1], min); cur = [a, b, i]; }
    }
    if (cur) splitDays(cur[0], cur[1], min);
    const hours = {}; for (const d in min) hours[d] = min[d] / 60;
    return { hours, overlaps };
  };

  return api;
});
