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
  api.mins = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m && +m[2] < 60 && (+m[1] < 24 || (+m[1] === 24 && +m[2] === 0)) ? +m[1] * 60 + +m[2] : NaN; };

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

  // ---- long vacation (長期休業期間) ----
  // periods: [{from:'YYYY-MM-DD', to:'YYYY-MM-DD'}], both ends inclusive, as set by the school's 学則.
  api.isVac = (periods, d) => (periods || []).some(p => { const a = api.dayNum(p.from), b = api.dayNum(p.to); return !isNaN(a) && !isNaN(b) && d >= a && d <= b; });

  // ---- rolling 7-day check ----
  // 資格外活動許可 (留学): 1週28時間以内 counted over ANY 7 consecutive days, not calendar weeks.
  // 長期休業期間: 1日8時間以内. A window counts as "vacation" (40 h = 8 h × 5 days) only when all 7 days are inside
  // a vacation period; a window that straddles the start or end uses 28 h. This is the conservative reading.
  api.check = (R, shifts, periods) => {
    const wk = R.intlWeek.value, vwk = R.intlVacWeek.value, vday = R.intlVacDay.value;
    const { hours, overlaps } = api.dayHours(shifts), days = Object.keys(hours).map(Number).sort((a, b) => a - b);
    const out = { max: 0, maxFrom: null, maxLimit: wk, windows: [], over: [], dayOver: [], overlaps, hours };
    if (!days.length) return out;
    const h = d => hours[d] || 0;
    for (let s = days[0] - 6; s <= days[days.length - 1]; s++) {
      let sum = 0, allVac = true;
      for (let d = s; d < s + 7; d++) { sum += h(d); if (!api.isVac(periods, d)) allVac = false; }
      const limit = allVac ? vwk : wk, w = { from: api.dayStr(s), to: api.dayStr(s + 6), hours: sum, limit, vac: allVac };
      out.windows.push(w);
      if (sum - limit > out.max - out.maxLimit || out.maxFrom === null) { out.max = sum; out.maxLimit = limit; out.maxFrom = w.from; }
      if (sum > limit + 1e-9) out.over.push(w);
    }
    for (const d of days) if (api.isVac(periods, d) && h(d) > vday + 1e-9) out.dayOver.push({ date: api.dayStr(d), hours: h(d), limit: vday });
    return out;
  };

  // ---- how much more can go on one date ----
  // The smallest room over the 7 windows that contain the date, and the 8 h/day cap on vacation days.
  api.roomOn = (R, shifts, periods, date) => {
    const d = api.dayNum(date); if (isNaN(d)) return null;
    const { hours } = api.dayHours(shifts), h = x => hours[x] || 0;
    let room = Infinity;
    for (let s = d - 6; s <= d; s++) {
      let sum = 0, allVac = true;
      for (let x = s; x < s + 7; x++) { sum += h(x); if (!api.isVac(periods, x)) allVac = false; }
      room = Math.min(room, (allVac ? R.intlVacWeek.value : R.intlWeek.value) - sum);
    }
    if (api.isVac(periods, d)) room = Math.min(room, R.intlVacDay.value - h(d));
    return Math.max(0, room);
  };

  // ---- several employers ----
  // jobs: [{id, name, wage}]. Hours of each shift (overlaps not removed: each employer pays its own shift)
  // times that job's wage. `future` only counts shifts dated after `today` (planned, not paid yet).
  api.shiftHours = sh => { const v = api.interval(sh); return v ? (v[1] - v[0]) / 60 : Math.max(0, +sh.hours || 0); };
  api.byJob = (jobs, shifts, today) => {
    const t = api.dayNum(today), rows = (jobs || []).map(j => ({ id: j.id, name: j.name, wage: Math.max(0, +j.wage || 0), hours: 0, income: 0, future: 0 }));
    const find = id => rows.find(r => r.id === id) || rows[0];
    for (const sh of shifts || []) {
      const r = find(sh.job); if (!r) continue;
      const hh = api.shiftHours(sh), y = hh * r.wage;
      r.hours += hh; r.income += y; if (!isNaN(t) && api.dayNum(sh.date) > t) r.future += y;
    }
    const sum = k => rows.reduce((a, r) => a + r[k], 0);
    return { rows, hours: sum('hours'), income: sum('income'), future: sum('future') };
  };

  return api;
});
