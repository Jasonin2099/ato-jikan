# あと何時間（ato-jikan）

[![license](https://img.shields.io/github/license/Jasonin2099/ato-jikan?style=flat&color=555)](LICENSE) [![last commit](https://img.shields.io/github/last-commit/Jasonin2099/ato-jikan?style=flat&color=555)](https://github.com/Jasonin2099/ato-jikan/commits) [![demo](https://img.shields.io/badge/demo-GitHub%20Pages-555?style=flat)](https://jasonin2099.github.io/ato-jikan/) [![stars](https://img.shields.io/github/stars/Jasonin2099/ato-jikan?style=flat&color=555)](https://github.com/Jasonin2099/ato-jikan/stargazers)

[English](README.en.md) ・ [中文](README.zh.md)

学生バイト向け：**扶養の壁（2026年分・令和8年）を超えずに、今年あと何時間働けるか**を逆算するツール。留学生の「週28時間」上限も同時に計算し、共有用の結果画像（1600×2000）を作れます。

**▶ 使う：** https://jasonin2099.github.io/ato-jikan/

![日本語・中文・English の画面](docs/hero.png)

## できること
- 時給・今年の総支給額・残りの給料日回数から「あと何時間」を算出
- 136 / 150 / 159 / 178 / 197万円 の壁を一覧表示（それぞれ公的な出典つき）
- いまの週の勤務時間から年末の見込みと、親の控除額の変化を表示
- 留学生モード：授業期間 週28時間・長期休業 週40時間で上限を計算
- 日本語／中文／English 切り替え（ブラウザの言語で自動選択・選択を記憶）、ダークモード対応
- 計算はすべて端末内。どこにも送信しません

## ルールと出典
数値はすべて [`rules/2026.json`](rules/2026.json) にあり、各項目に出典URLと年度を記載しています。

| 壁 | 内容 | 出典 |
|---|---|---|
| 136万円 | 74万（給与所得控除）＋62万（扶養親族の所得要件） | 国税庁 No.1410 / 令和8年度改正 |
| 150万円未満 | 19〜22歳の健康保険被扶養者（それ以外は130万円未満） | 日本年金機構 |
| 159万円 | 特定親族特別控除が63万円から減り始める | 国税庁 No.1177 |
| 178万円 | 74万＋基礎控除104万：本人に所得税 | 国税庁 No.1199 |
| 197万円 | 特定親族特別控除がゼロ | 国税庁 No.1177 |
| 週28時間 | 留学生の資格外活動 | 出入国在留管理庁 |

## 注意（免責）
- **住民税は計算していません。** 非課税ラインが自治体ごとに異なるためです。
- **長期休業中の上限は保守的に週40時間**（1日8時間 × 労働基準法第32条）で計算しています。
- 給与収入のみが対象です。税の壁は1〜12月に**支払われた**額、健康保険の扶養は**今後1年の収入見込み**で判定されます（交通費を含む場合あり）。
- 目安です。個別の判断は勤務先・親の健康保険・税務署・入管にご確認ください。本ツールの利用による損害について作者は責任を負いません。

## 開発
```
npm test        # node --test（Node 18+）
python3 -m http.server   # http://localhost:8000
```
- `calc.js` … DOMに依存しない純粋な計算モジュール（ブラウザ／Node両対応）
- `rules/2026.json` … 年度ごとのルール。翌年は `rules/2027.json` を追加
- `index.html` … ページ（依存なし・ビルド不要）
- `i18n.js` … 日本語／中文／English の文言（未翻訳は日本語にフォールバック）
- `fonts/` … Noto Sans CJK のサブセット。文言を変えたら `python3 tools/subset-fonts.py`

ルールの誤りを見つけたら、出典つきで Issue / PR をお願いします。

## ライセンス
MIT


Icons: [Lucide](https://lucide.dev) (ISC License), inlined as SVG.
