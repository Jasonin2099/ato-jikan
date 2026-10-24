# Changelog

## Unreleased

- Shifts: times like `24:30` are rejected (only `24:00` = end of day).
- Projection: a negative or non-numeric weekly-hours value no longer lowers the year-end estimate.
- Offline: the 192px app icon is cached too (service worker cache v3).
- Tests: i18n key parity (ja/zh/en), precache/manifest assets, 2026 rule table sanity.

## 0.3.0 — 2026-10-24

- Shifts: enter date + start/end (past midnight is fine) or just hours, per employer.
- Several jobs: hours and income from every employer are added up; planned shift income is checked against the income walls.
- Student visa: rolling check over any 7 consecutive days (28 h), long-vacation periods (8 h/day; 40 h only when all 7 days are in the vacation, otherwise 28 h), and hours still free today.
- Rules: `intlVacDay` (8 h/day) with its source; `shifts.js` with unit tests.
- Data stays in localStorage.

## 0.2.0

- Share button fix, yearly inputs reset, offline support.
