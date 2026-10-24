# ato-jikan — "How many more hours?"

[日本語](README.md) ・ [中文](README.zh.md)

A tool for students with part-time jobs in Japan: it works out **how many more hours you can work this year without crossing the dependent-income thresholds ("年収の壁") under the 2026 rules**. It also applies the 28-hours-a-week limit for international students and makes a shareable 1600×2000 result image.

**▶ Try it:** https://jasonin2099.github.io/ato-jikan/

![The app in Japanese, Chinese and English](docs/hero.png)

## Features
- Remaining hours from your hourly wage, gross pay so far this year and remaining paydays
- The 1.36M / 1.5M / 1.59M / 1.78M / 1.97M yen thresholds, each linked to an official source
- A year-end projection at your current weekly hours, and how your parent's deduction changes
- International-student mode: 28 h/week during term, 40 h/week during long vacations
- Japanese / Chinese / English (follows your browser, remembers your choice), dark mode
- Everything runs on your device. Nothing is sent anywhere.
- Works offline once opened, and can be added to the home screen.

### Shifts, several jobs and the 28-hour check (student visa)

- **Any 7 days in a row**: the 28 h/week limit of the 資格外活動許可 is not per calendar week; every run of 7 consecutive days must stay within 28 h. Enter shifts and the tool checks every run, shows the ones that go over and how many hours you can still add today.
- **Long vacations**: during the long vacation set by your school, the limit is 8 h a day. You enter the dates (first and last day included). A 7-day run counts as vacation (40 h = 8 h × 5) only when all 7 days are inside it; a run that crosses the start or end uses 28 h to be safe.
- **Several jobs**: each employer has its own wage; hours from all of them are added up, and planned shift income counts toward the income walls.
- Shifts past midnight are split at 0:00; overlapping shifts count once. Data stays in your browser (localStorage).
- Source: [Immigration Services Agency, 資格外活動許可](https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00003.html)

## Rules and sources
All numbers live in [`rules/2026.json`](rules/2026.json). Each entry cites its official source (National Tax Agency No.1177 / 1410 / 1199 / 1180, the 2026 tax reform, Japan Pension Service, Immigration Services Agency) and its year.

## Disclaimers
- **Resident tax (住民税) is not calculated**, because its exemption line differs by municipality.
- **The long-vacation limit uses a conservative 40 h/week** (8 h/day; Labour Standards Act Art. 32).
- Salary income only. Tax thresholds use the amount **paid** from January to December. The health-insurance dependency test uses **expected income over the next 12 months**, which may include commuting allowance.
- These are estimates. Check with your employer, your parent's health insurer, the tax office or immigration. The author accepts no liability.

## Development
`npm test` (Node 18+). `calc.js` is a pure module that works in both the browser and Node. Add `rules/2027.json` for the next year. Corrections are welcome as issues or PRs; please include the source.

## License
MIT


Icons: [Lucide](https://lucide.dev) (ISC License), inlined as SVG.
