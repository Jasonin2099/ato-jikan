// あと何時間 — UI strings (ja / zh / en). ja is the fallback for any missing key.
(function (root) {
  const KEY = 'atojikan.lang', LANGS = ['ja', 'zh', 'en'];
  const S = {
    ja: {
      statW: '時間 / 週', statM: '時間 / 月', statY: 'あと稼げる', barL: m => `受け取り済み ${m}`, tMade: '画像ができました', tSaved: '画像を保存しました', hsFull: 'もう壁に届いています。今年はおつかれさまでした',
      introH: '扶養の壁まで、今年あと何時間？', introP: '時給と今年の収入を入れるだけ。150万・178万などの壁の手前で、あと何時間働けるかを逆算します。留学生の週28時間ルールにも対応。', miniK: '今年あと', htmlLang: 'ja', title: 'あと何時間 — 学生バイトの年収の壁 逆算（2026年分）', brand: 'あと何時間', sub: '2026年分（令和8年）',
      hkDefault: '今年、扶養を外れずに働けるのは', hUnit: '時間',
      secYou: 'あなたについて', age: '12月31日時点の年齢', age1922: '19〜22歳', ageOther: 'それ以外',
      intl: '留学生（資格外活動）<span class="h">週28時間の上限も計算します</span>',
      secJob: 'バイト', wage: '時給<span class="h">交通費は含めない</span>',
      ytd: '今年受け取った額<span class="h">1月〜今日。明細の「総支給額」の合計</span>',
      pays: '給料日の残り回数<span class="h">12月分が1月払いなら来年に数える</span>',
      wk: 'いまの週の勤務時間<span class="h">任意。このペースで年末にいくらか</span>', wkPh: '例 15',
      uYen: '円', uTimes: '回', uWeek: '週',
      secIntl: '留学生：残りの期間（今日〜12/31）', tw: '授業期間の週数<span class="h">週28時間まで</span>',
      vw: '長期休業の週数<span class="h">学則で定める休み。1日8時間まで（本ツールは週40hで計算）</span>',
      secWalls: '今年の壁（給与だけの場合）', mk: '結果を画像にする', dl: '画像を保存 / 共有', alt: '結果カード',
      note: '計算はすべてこの端末の中だけで行い、どこにも送信しません。税・社会保険の判断の目安で、個別の判断は勤務先・親の健康保険・税務署にご確認ください。<br>・税の壁は1〜12月に<b>支払われた</b>額で、健康保険の扶養は<b>今後1年の収入見込み</b>で判定されます（交通費も含む場合あり）。<br>・住民税の非課税ラインは自治体で異なるため計算していません。<br>・昼間部の学生は勤務先の社会保険（いわゆる106万円）の対象外です。<br>',
      srcLabel: '出典：', src: '出典', loadErr: 'ルールの読み込みに失敗しました。再読み込みしてください',
      man: y => (y/10000).toLocaleString('ja-JP',{maximumFractionDigits:1}) + '万円',
      yen: y => Math.round(y).toLocaleString('ja-JP') + '円',
      under: m => `${m}未満`,
      dShaho: '親の健康保険の扶養（超えると自分で国保・年金）', shortShaho: '親の健康保険の扶養から外れるライン',
      dFuyoYoung: '親の特定扶養控除（63万円）の上限。超えても159万円までは特定親族特別控除で同額',
      dFuyoOther: '親の扶養控除（38万円）がなくなる',
      dTokuteiStart: '親の控除が段階的に減り始める（63万→61万円…）', dTax: 'あなた自身に所得税がかかり始める', dTokuteiEnd: '親の控除がゼロになる',
      hkLegal: '今年、在留資格のルール内で働けるのは', hkMoney: L => `今年、${L}に収まるように働けるのは`,
      hs: (y, m, w) => `あと ${y} ・ 月あたり約 ${m} 時間 ・ 週あたり約 ${w} 時間`,
      hbLegal: h => `週28時間ルールが先に来ます（お金の壁までなら ${h} 時間）`,
      hbMoney: h => `週28時間ルールの残り ${h} 時間より先にお金の壁`, hbTarget: (L, d) => `目標：${L}（${d}）`,
      stOver: '超えています', stProj: 'このペースだと超える', stLeft: m => `あと ${m}`,
      proj: (wk, p, a, b) => `いまのペース（週${wk}h）だと年末の合計は <b>${p}</b>。親の控除は ${a} → <b>${b}</b>`,
      cTitle: y => `${y}年  あと何時間`, cLegal: '在留資格のルール内で、今年あと', cMoney: L => `${L}に収まるように、今年あと`, cUnit: '時間',
      cW: w => `= 週あたり 約${w}時間`, cM: (m, p) => `= 月あたり 約${m}時間（給料あと${p}回）`, cRoom: (r, w) => `あと ${r} ・ 時給 ${w}`,
      cF1: '令和8年分のルール（国税庁・日本年金機構・出入国在留管理庁）で計算', cF2: '目安です。個別の判断は勤務先・保険者・税務署へ'
    },
    zh: {
      statW: '小时 / 周', statM: '小时 / 月', statY: '还能挣', barL: m => `已领 ${m}`, tMade: '结果图做好了', tSaved: '图片已保存', hsFull: '已经到线了，今年辛苦啦',
      introH: '离年收入上限，今年还能打几小时？', introP: '填上时薪和今年已到手的工资，就能倒推出在各道「年收入之墙」之前还能打几小时工。留学生每周 28 小时的上限也一起算。', miniK: '今年还能打', htmlLang: 'zh-CN', title: '还能打几小时 — 在日学生打工年收入之壁倒推（2026年）', brand: '还能打几小时', sub: '2026年（令和8年）规则',
      hkDefault: '今年不超出扶養范围，还能打', hUnit: '小时',
      secYou: '关于你', age: '截至12月31日的年龄', age1922: '19〜22岁', ageOther: '其他',
      intl: '留学生（資格外活動）<span class="h">留学签证的打工许可。同时计算每周28小时上限</span>',
      secJob: '打工', wage: '时薪<span class="h">不含交通费</span>',
      ytd: '今年已领到的工资<span class="h">1月到今天，工资单上「総支給額」的合计</span>',
      pays: '今年还剩几次发薪<span class="h">12月的工资如果1月才发，算到明年</span>',
      wk: '现在每周打几小时<span class="h">选填。按这个节奏估算年底收入</span>', wkPh: '例如 15',
      uYen: '日元', uTimes: '次', uWeek: '周',
      secIntl: '留学生：剩下的时间（今天〜12/31）', tw: '上课期间的周数<span class="h">每周最多28小时</span>',
      vw: '长假的周数<span class="h">学校规定的长假。每天最多8小时（本工具按每周40小时算）</span>',
      secWalls: '今年的几道线（只有工资收入时）', mk: '生成结果图', dl: '保存 / 分享图片', alt: '结果图',
      note: '所有计算都只在这台设备上完成，不会发送到任何地方。结果只是税和社保方面的参考，具体请向打工单位、父母的健康保险或税务署确认。<br>・<b>扶養</b>：被父母“扶养”。收入不超线，父母可以少交税（扶養控除），你也能继续用父母的健康保险。<br>・<b>資格外活動</b>：留学签证本身不能打工，拿到这个许可才可以，上课期间每周最多28小时。<br>・税的线看1〜12月<b>实际发放</b>的金额；健康保险的扶養看<b>今后一年的收入预估</b>（有时也算交通费）。<br>・住民税的免税线各地不同，这里没有计算。<br>・昼间部（白天上课）的学生不加入打工单位的社会保险（所谓106万日元线）。<br>',
      srcLabel: '出处（日文官方页面）：', src: '出处', loadErr: '规则加载失败，请刷新页面',
      man: y => (y/10000).toLocaleString('zh-CN',{maximumFractionDigits:1}) + '万日元',
      yen: y => Math.round(y).toLocaleString('zh-CN') + '日元',
      under: m => `不到${m}`,
      dShaho: '父母健康保险的扶養（超过后要自己交国保和年金）', shortShaho: '不能再挂在父母健康保险下的那条线',
      dFuyoYoung: '父母“特定扶養控除”（63万日元）的上限。超过后到159万日元为止，“特定親族特別控除”会补上同样金额',
      dFuyoOther: '父母的扶養控除（38万日元）没有了',
      dTokuteiStart: '父母的控除开始一档档减少（63万→61万日元…）', dTax: '你自己开始要交所得税', dTokuteiEnd: '父母的控除降到零',
      hkLegal: '按在留资格的规定，今年还能打', hkMoney: L => `今年要控制在${L}，还能打`,
      hs: (y, m, w) => `还能挣 ${y} ・ 每月约 ${m} 小时 ・ 每周约 ${w} 小时`,
      hbLegal: h => `每周28小时的限制先到（只看收入的话还有 ${h} 小时）`,
      hbMoney: h => `收入的线比每周28小时限制（还剩 ${h} 小时）先到`, hbTarget: (L, d) => `目标：${L}（${d}）`,
      stOver: '已超过', stProj: '照这个节奏会超', stLeft: m => `还差 ${m}`,
      proj: (wk, p, a, b) => `按现在的节奏（每周${wk}小时），年底合计 <b>${p}</b>。父母的控除 ${a} → <b>${b}</b>`,
      cTitle: y => `${y}年  还能打几小时`, cLegal: '按在留资格的规定，今年还能打', cMoney: L => `要控制在${L}，今年还能打`, cUnit: '小时',
      cW: w => `= 每周约 ${w} 小时`, cM: (m, p) => `= 每月约 ${m} 小时（还剩 ${p} 次发薪）`, cRoom: (r, w) => `还能挣 ${r} ・ 时薪 ${w}`,
      cF1: '按令和8年（2026年）规则计算（国税厅・日本年金机构・出入国在留管理厅）', cF2: '仅供参考，具体请向打工单位、保险方或税务署确认'
    },
    en: {
      statW: 'h / week', statM: 'h / month', statY: 'left to earn', barL: m => `${m} paid`, tMade: 'Image ready', tSaved: 'Image saved', hsFull: 'You have hit the line. Rest up, you earned it.',
      introH: 'How many more hours can you work this year?', introP: 'Enter your hourly wage and what you have earned so far. We work back from Japan\'s income walls (1.5M yen and more) and the 28-hour weekly limit for international students.', miniK: 'Left this year', htmlLang: 'en', title: 'ato-jikan — how many more hours can a student work in Japan (2026)', brand: 'ato-jikan', sub: '2026 rules',
      hkDefault: 'Staying a dependent, this year you can still work', hUnit: 'hours',
      secYou: 'About you', age: 'Age on Dec 31', age1922: '19–22', ageOther: 'Other',
      intl: 'International student (資格外活動)<span class="h">Work permit on a student visa. Adds the 28 h/week cap</span>',
      secJob: 'Your job', wage: 'Hourly wage<span class="h">Without transport pay</span>',
      ytd: 'Paid so far this year<span class="h">Jan to today. Sum of “総支給額” on your payslips</span>',
      pays: 'Paydays left this year<span class="h">If December pay comes in January, count it next year</span>',
      wk: 'Hours per week now<span class="h">Optional. Shows your year-end total at this pace</span>', wkPh: 'e.g. 15',
      uYen: 'yen', uTimes: '×', uWeek: 'wk',
      secIntl: 'Student visa: rest of the year (today–Dec 31)', tw: 'Weeks of classes<span class="h">Up to 28 h a week</span>',
      vw: 'Weeks of long vacation<span class="h">Breaks set by your school. Up to 8 h a day (this tool uses 40 h a week)</span>',
      secWalls: 'This year’s thresholds (wages only)', mk: 'Make a result image', dl: 'Save / share image', alt: 'Result card',
      note: 'Everything is calculated on this device. Nothing is sent anywhere. This is only a guide for tax and insurance; for your own case, ask your employer, your parent’s health insurer or the tax office.<br>・<b>扶養 (dependent)</b>: if your income stays under the line, your parent pays less tax and you stay on their health insurance.<br>・<b>資格外活動</b>: the permit that lets you work on a student visa; up to 28 h a week during term.<br>・Tax lines use what was <b>paid</b> Jan–Dec. Health insurance uses your <b>expected income for the next 12 months</b> (may include transport pay).<br>・Resident tax is not calculated; its line differs by city.<br>・Daytime (昼間部) students are not covered by the employer’s social insurance (the “1.06M yen” line).<br>',
      srcLabel: 'Sources (Japanese): ', src: 'source', loadErr: 'Could not load the rules. Please reload.',
      man: y => '¥' + (y/1e6).toLocaleString('en-US',{maximumFractionDigits:2}) + 'M',
      yen: y => '¥' + Math.round(y).toLocaleString('en-US'),
      under: m => `under ${m}`,
      dShaho: 'Dependent on your parent’s health insurance (above it you pay your own NHI and pension)', shortShaho: 'The line where you leave your parent’s health insurance',
      dFuyoYoung: 'Limit for your parent’s special dependent deduction (¥630k). Up to ¥1.59M, the special relative deduction gives the same amount',
      dFuyoOther: 'Your parent loses the dependent deduction (¥380k)',
      dTokuteiStart: 'Your parent’s deduction starts to step down (¥630k → ¥610k …)', dTax: 'You start paying income tax yourself', dTokuteiEnd: 'Your parent’s deduction reaches zero',
      hkLegal: 'Within your visa rules, this year you can still work', hkMoney: L => `To stay ${L} this year, you can still work`,
      hs: (y, m, w) => `${y} left · about ${m} h a month · about ${w} h a week`,
      hbLegal: h => `The 28 h/week rule comes first (${h} h if you only count money)`,
      hbMoney: h => `The money line comes before the 28 h/week rule (${h} h left)`, hbTarget: (L, d) => `Target: ${L} (${d})`,
      stOver: 'Over', stProj: 'Over at this pace', stLeft: m => `${m} to go`,
      proj: (wk, p, a, b) => `At your pace (${wk} h a week) you end the year at <b>${p}</b>. Parent’s deduction: ${a} → <b>${b}</b>`,
      cTitle: y => `${y}  ato-jikan`, cLegal: 'Within my visa rules, I can still work', cMoney: L => `To stay ${L}, I can still work`, cUnit: 'h',
      cW: w => `= about ${w} h a week`, cM: (m, p) => `= about ${m} h a month (${p} paydays left)`, cRoom: (r, w) => `${r} left · ${w} an hour`,
      cF1: 'Based on the 2026 rules (NTA, Japan Pension Service, Immigration Agency)', cF2: 'An estimate. Ask your employer, insurer or tax office.'
    }
  };
  function detect() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    try { const s = localStorage.getItem(KEY); if (LANGS.includes(s)) return s; } catch (e) {}
    for (const l of navigator.languages || [navigator.language || '']) {
      const p = String(l).toLowerCase().slice(0, 2);
      if (LANGS.includes(p)) return p;
    }
    return 'ja';
  }
  let lang = detect();
  const t = k => (k in S[lang] ? S[lang][k] : S.ja[k]);
  function apply() {
    document.documentElement.lang = t('htmlLang');
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  }
  function set(l) { if (!LANGS.includes(l)) return; lang = l; try { localStorage.setItem(KEY, l); } catch (e) {} apply(); }
  root.I18N = { t, apply, set, get lang() { return lang; } };
})(self);
