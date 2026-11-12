'use strict';
/* ============================ APP (hub + cursos + lembretes) ============================ */
const ICON = {
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 3 2.2 3.4C11 9 11 5.5 12 2z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0z" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2h1v10H6V10zm2 0h6V8a3 3 0 0 0-6 0z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="currentColor"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm2 14h13v2H6z" fill="currentColor"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zm4 8 3 3 5-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 3.3a5 5 0 0 0-6 6.4L3 15.4 5.6 18l5.7-5.7a5 5 0 0 0 6.4-6l-3 3-2.6-.6-.6-2.6z" fill="currentColor"/></svg>',
  wheel: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M3.8 11h5.5M14.7 11h5.5M12 14v6.3" stroke="currentColor" stroke-width="2.4"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const I = (k, c = '') => `<span class="ico ${c}">${ICON[k]}</span>`;

/* Ilustrações dos cursos (SVG) */
function ART(id) {
  if (id === 'vlsi') {
    let pins = '', grid = '';
    for (let i = 0; i < 6; i++) { const p = 46 + i * 22; pins += `<rect x="${p}" y="14" width="8" height="20" rx="2"/><rect x="${p}" y="186" width="8" height="20" rx="2"/><rect x="14" y="${p}" width="20" height="8" rx="2"/><rect x="186" y="${p}" width="20" height="8" rx="2"/>`; }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) grid += `<rect x="${62 + c * 25}" y="${62 + r * 25}" width="19" height="19" rx="3" class="${(r * 4 + c) % 5 === 0 ? 'a2' : (r + c) % 3 === 0 ? 'a1' : 'a0'}"/>`;
    return `<svg class="art" viewBox="0 0 220 220" role="img" aria-label="Chip de silício"><g class="pins">${pins}</g><rect x="34" y="34" width="152" height="152" rx="16" class="die"/><rect x="52" y="52" width="116" height="116" rx="8" class="core"/>${grid}</svg>`;
  }
  if (id === 'ia') {
    const Ls = [[50, [60, 110, 160]], [110, [40, 85, 135, 180]], [170, [80, 140]]]; let e = '', n = '';
    for (let i = 0; i < Ls.length - 1; i++) for (const a of Ls[i][1]) for (const b of Ls[i + 1][1]) e += `<line x1="${Ls[i][0]}" y1="${a}" x2="${Ls[i + 1][0]}" y2="${b}" class="edge"/>`;
    Ls.forEach(([x, ys], i) => ys.forEach((y, j) => { n += `<circle cx="${x}" cy="${y}" r="14" class="${i === 1 ? (j % 2 ? 'n1' : 'n0') : i === 2 ? 'n1' : 'n2'}"/>`; }));
    return `<svg class="art" viewBox="0 0 220 220" role="img" aria-label="Rede neuronal">${e}${n}</svg>`;
  }
  return `<svg class="art" viewBox="0 0 220 220" role="img" aria-label="Estrada"><path d="M80 210 L104 40 h12 L140 210z" class="road"/><path d="M110 200v-22M110 160v-18M110 126v-14M110 98v-10M110 76v-7M110 58v-5" class="lane"/><circle cx="168" cy="70" r="26" class="sign-o"/><circle cx="168" cy="70" r="18" class="sign-i"/><text x="168" y="77" text-anchor="middle" class="sign-t">50</text><rect x="166" y="96" width="4" height="60" class="pole"/><path d="M20 210 Q60 150 104 120" class="hill"/><circle cx="50" cy="56" r="14" class="sun"/></svg>`;
}

const Engine = (() => {
  const COURSES = {}, ORDER = [];
  let C, S, KEY, app, R, lessonGens = {}, caps = {}, P;
  const todayStr = (o = 0) => { const d = new Date(); d.setDate(d.getDate() + o); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  const fresh = () => ({ done: {}, xp: 0, streak: 0, best: 0, last: null, day: { date: todayStr(), n: 0 }, wrong: [], free: false, goal: 1, checks: {}, stats: { ok: 0, tot: 0 } });
  const loadState = id => { const s = Object.assign(fresh(), lsGet('trilho-' + id) || {}); if (s.day.date !== todayStr()) s.day = { date: todayStr(), n: 0 }; if (s.last && s.last !== todayStr() && s.last !== todayStr(-1)) s.streak = 0; return s; };
  const save = () => lsSet(KEY, S);
  const savePrefs = () => lsSet('trilho-prefs', P);
  const doneCount = s => Object.values(s.done).filter(x => x.complete).length;
  const nextDayOf = (s, c) => { for (let d = 1; d <= c.days; d++) if (!(s.done[d] && s.done[d].complete)) return d; return c.days; };
  const nextDay = () => nextDayOf(S, C);
  const unlocked = d => S.free || d <= nextDay() || (S.done[d] && S.done[d].complete);
  const seed = (d, k) => (C.seed * 7919 + d * 104729 + k * 1299709) >>> 0;
  const todayCount = s => s.day.date === todayStr() ? s.day.n : 0;

  /* ---------- Plano de 100 dias: Aprender (1 lição/dia) → Consolidar (revisão espaçada) → Reta final ---------- */
  function plan(d, c = C) {
    const K = c.lessons.length, D = c.days, F = c.finalDays || 10, mid = D - F;
    let li, cyc;
    if (d <= K) { li = d - 1; cyc = 1; }
    else if (d <= mid) { cyc = 2; li = Math.floor((d - K - 1) * K / Math.max(1, mid - K)); }
    else { cyc = 3; li = (Math.floor((d - mid - 1) * K / F) + 3) % K; }
    const big = d === D || d === Math.round(D / 2);
    return { d, li, cyc, lesson: c.lessons[li], exam: d % 7 === 0 || d > mid || big, big, extra: c.extra ? c.extra(d, cyc) : null };
  }
  const phaseName = cyc => C.phases[Math.min(cyc, C.phases.length) - 1];
  function inst(card, r, lvl) {
    let q = card;
    if (card.t === 'gen') { const g = C.gens[card.id]; if (!g) return T('…', 'gerador em falta'); q = g.f(r, lvl || 1); q.gen = card.id; }
    if (q.t === 'mcq' && !q.fixed && q.o.length > 2) { const idx = r.shuffle(q.o.map((_, i) => i)); q = { ...q, o: idx.map(i => q.o[i]), a: idx.indexOf(q.a) }; }
    return q;
  }
  const isQ = c => ['mcq', 'num', 'fill', 'open'].includes(c.t);
  function poolOf(li, r, lvl, n) {
    const L = C.lessons[li], gs = lessonGens[L.id] || [];
    let p = (L.quiz || []).concat(L.cards.filter(isQ)).map(c => () => c);
    gs.forEach(g => { p.push(() => G(g)); p.push(() => G(g)); });
    return r.shuffle(p).slice(0, n).map(f => inst(f(), r, lvl));
  }
  function lessonCards(p) {
    const r = rng(seed(p.d, 1)), L = p.lesson, gs = lessonGens[L.id] || []; let cards = [];
    if (p.cyc === 1) return L.cards.map(c => inst(c, r, 1));
    const intro = p.cyc === 2
      ? `<p>Esta lição já apareceu na fase 1. Hoje relês a teoria e resolves <b>desafios mais difíceis</b> com números novos${C.interview ? ' e uma pergunta de entrevista' : ''}. Rever no momento em que começas a esquecer é a forma mais eficaz de fixar matéria (repetição espaçada).</p>`
      : `<p>Últimos 10 dias. Sem teoria: só desafios, perguntas de exame${C.interview ? ' e perguntas de entrevista' : ''}. Se falhares algo, volta à lição original no mapa.</p>`;
    cards.push(T(`${phaseName(p.cyc)} · ${esc(L.title)}`, intro));
    if (p.cyc === 2) cards = cards.concat(L.cards.map(c => inst(c, r, 2)));
    const nG = p.cyc === 3 ? 4 : 3; if (gs.length) for (let i = 0; i < nG; i++) cards.push(inst(G(r.pick(gs)), r, p.cyc + 1));
    r.shuffle(L.quiz || []).slice(0, p.cyc === 3 ? 3 : 2).forEach(q => cards.push(inst(q, r, p.cyc)));
    if (C.interview) { const tagged = C.interview.filter(q => q.tag === L.id); cards.push(r.pick(tagged.length ? tagged : C.interview)); }
    return cards;
  }
  function testCards(p) {
    const r = rng(seed(p.d, 2)), n = C.testN || 9; let cards = poolOf(p.li, r, p.cyc, 5);
    [1, 3, 7, 21, 60].forEach(off => { const dd = p.d - off; if (dd >= 1) cards = cards.concat(poolOf(plan(dd).li, r, p.cyc, 1)); });
    const K = C.lessons.length;
    while (cards.length < n) cards = cards.concat(poolOf(r.int(0, p.cyc > 1 ? K - 1 : p.li), r, p.cyc, 1));
    return r.shuffle(cards.slice(0, n));
  }
  function examCards(p) {
    const r = rng(seed(p.d, 3)), n = p.big ? C.exam.big : C.exam.n, hi = p.cyc > 1 ? C.lessons.length - 1 : p.li;
    let cards = [], guard = 0;
    while (cards.length < n && guard++ < n * 6) cards = cards.concat(poolOf(r.int(0, hi), r, p.cyc, 1));
    const extraOpen = C.interview && C.exam.open ? C.exam.open + (p.big ? 3 : 0) : 0;
    if (extraOpen) cards = cards.slice(0, n).concat(r.shuffle(C.interview).slice(0, extraOpen));
    return cards.slice(0, n + extraOpen);
  }

  /* ------------------------------ Shell ------------------------------ */
  const H = h => { app.innerHTML = h; window.scrollTo(0, 0); };
  function nav(active) {
    const totalStreak = Math.max(0, ...ORDER.map(id => loadState(id).streak));
    const links = ORDER.map(id => `<a href="#${id}" class="nl ${active === id ? 'on' : ''}">${esc(COURSES[id].short)}</a>`).join('');
    const st = C && active === C.id ? S : null;
    return `<header class="nav"><div class="nav-in">
      <a href="#" class="brand" aria-label="Início"><span class="mark"></span><span>Trilho</span></a>
      <nav class="nlinks"><a href="#" class="nl ${active === 'hub' ? 'on' : ''}">Início</a>${links}</nav>
      <div class="nright">
        <span class="chip flame" title="Sequência de dias">${I('flame')}${st ? st.streak : totalStreak}</span>
        ${st ? `<span class="chip bolt" title="XP">${I('bolt')}${st.xp}</span>` : ''}
        <a href="#lembrete" class="iconbtn ${pendingToday() ? 'dot' : ''}" title="Lembrete diário" aria-label="Lembrete diário">${I('bell')}</a>
        <button class="iconbtn" data-act="theme" title="Mudar tema" aria-label="Mudar tema">${I('moon')}</button>
      </div></div></header>`;
  }
  const pendingCourses = () => ORDER.filter(id => { const s = loadState(id); return todayCount(s) < s.goal; });
  const pendingToday = () => pendingCourses().length > 0;

  /* ------------------------------ Hub ------------------------------ */
  function hub() {
    C = null; document.title = 'Trilho';
    const h = new Date().getHours(), hello = h < 6 ? 'Boa noite' : h < 13 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite';
    const cards = ORDER.map(id => {
      const c = COURSES[id], s = loadState(id), n = doneCount(s), nd = nextDayOf(s, c), pl = plan(nd, c), t = todayCount(s);
      return `<a class="ccard" href="#${id}" style="--acc:${c.accent};--acc2:${c.accent2}">
        <div class="ccard-art">${ART(id)}</div>
        <div class="ccard-body"><div class="kicker">${esc(c.tagline)}</div><h2>${esc(c.name)}</h2>
        <p class="muted">Próximo: <b>Dia ${nd}</b> · ${esc(pl.lesson.title)}</p>
        <div class="pbar"><span style="width:${n}%"></span></div>
        <div class="crow"><span class="muted small">${n} de ${c.days} dias · ${I('flame', 'sm')} ${s.streak}</span><span class="goalpill ${t >= s.goal ? 'ok' : ''}">${t >= s.goal ? I('check', 'sm') + ' Feito hoje' : `Hoje: ${t}/${s.goal}`}</span></div>
        <span class="btn primary">${n ? 'Continuar' : 'Começar'}</span></div></a>`;
    }).join('');
    const pend = pendingCourses();
    H(nav('hub') + `<main class="page">
      <section class="hello"><h1>${hello}.</h1><p class="lead">Três cursos de 100 dias com lições interativas, testes diários e projetos. Faz um dia por dia ou avança vários seguidos.</p></section>
      ${reminderStrip(pend)}
      <section class="courses">${cards}</section>
      <section class="how">
        <div><b>${I('book')} Lição</b><p>Teoria curta com perguntas, simuladores e explicação imediata.</p></div>
        <div><b>${I('quiz')} Teste diário</b><p>9 perguntas: matéria de hoje e revisão de 1, 3, 7, 21 e 60 dias atrás.</p></div>
        <div><b>${I('tool')} Projeto ou missão</b><p>RTL e ML para o teu portefólio, ou prática real com o instrutor.</p></div>
        <div><b>${I('star')} Provas</b><p>Uma por semana e simulações todos os dias na reta final.</p></div>
      </section>
    </main>`);
  }
  function reminderStrip(pend) {
    const t = P.time || '20:00';
    if (!pend.length) return `<div class="strip ok">${I('check')}<div><b>Objetivo de hoje cumprido.</b> Amanhã lembramos-te às ${t}.</div><a href="#lembrete" class="btn ghost sm">Lembrete</a></div>`;
    const late = new Date().toTimeString().slice(0, 5) >= t;
    return `<div class="strip ${late ? 'late' : ''}">${I('bell')}<div><b>${late ? 'Está na hora do treino de hoje.' : 'Treino de hoje por fazer.'}</b> Falta: ${pend.map(id => esc(COURSES[id].short)).reduce((a, x, i, l) => a + (i ? (i === l.length - 1 ? ' e ' : ', ') : '') + x, '')}. Lembrete diário às ${t}.</div><a href="#lembrete" class="btn ghost sm">Configurar</a></div>`;
  }

  /* --------------------------- Lembretes --------------------------- */
  const pad = n => String(n).padStart(2, '0');
  function calDates() {
    const [hh, mm] = (P.time || '20:00').split(':').map(Number), d = new Date(); d.setHours(hh, mm, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1);
    const f = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
    const e = new Date(d.getTime() + 20 * 60000); return [f(d), f(e)];
  }
  const APP_URL = typeof TRILHO_URL === 'string' ? TRILHO_URL : '';
  function gcalLink() {
    const [a, b] = calDates(), tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Europe/Lisbon';
    const q = new URLSearchParams({ action: 'TEMPLATE', text: 'Trilho: treino diário', details: 'Faz a lição e o teste de hoje.' + (APP_URL ? ' ' + APP_URL : ''), dates: a + '/' + b, ctz: tz, recur: 'RRULE:FREQ=DAILY;COUNT=100' });
    return 'https://calendar.google.com/calendar/render?' + q.toString();
  }
  function icsText() {
    const [a, b] = calDates();
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Trilho//PT', 'BEGIN:VEVENT', 'UID:trilho-' + Date.now() + '@local', 'DTSTAMP:' + a, 'DTSTART:' + a, 'DTEND:' + b, 'RRULE:FREQ=DAILY;COUNT=100', 'SUMMARY:Trilho: treino diário', 'DESCRIPTION:Faz a lição e o teste de hoje.' + (APP_URL ? ' ' + APP_URL : ''), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Trilho', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  const inArtifact = () => !!(window.claude && window.claude.use);
  const notifState = () => !('Notification' in window) ? 'none' : Notification.permission;
  function reminderView() {
    C = null; document.title = 'Lembrete diário · Trilho';
    const ns = notifState(), pend = pendingCourses();
    H(nav('rem') + `<main class="page narrow">
      <a href="#" class="backlink">${I('back')} Início</a>
      <h1>Lembrete diário</h1>
      <p class="lead">Escolhe a hora do treino. O calendário do telemóvel é o lembrete mais fiável: avisa-te mesmo com o site fechado.</p>
      <div class="panel">
        <label class="field" for="rem-time"><span>Hora do treino</span><input type="time" id="rem-time" value="${P.time || '20:00'}"></label>
        <div class="field"><span>Objetivo diário</span><div class="seg">${ORDER.map(id => { const s = loadState(id); return `<label>${esc(COURSES[id].short)} <select data-goal="${id}">${[1, 2, 3, 5].map(g => `<option ${g === s.goal ? 'selected' : ''}>${g}</option>`).join('')}</select> dia(s)</label>`; }).join('')}</div></div>
      </div>
      <div class="opt-list">
        <a class="rem-opt" id="gcal" href="${gcalLink()}" target="_blank" rel="noopener"><span class="ro-ic">${I('bell')}</span><span><b>Adicionar ao Google Calendar</b><small>Evento diário à hora escolhida, durante 100 dias. Abre o Google Calendar num separador novo; confirma lá.</small></span></a>
        ${inArtifact() ? '' : `<button class="rem-opt" data-act="ics"><span class="ro-ic">${I('book')}</span><span><b>Descarregar ficheiro .ics</b><small>Para o calendário do iPhone, Outlook ou outro: abre o ficheiro e aceita o evento repetido.</small></span></button>`}
        ${ns === 'none' ? '' : `<button class="rem-opt" data-act="notif" ${ns === 'denied' ? 'disabled' : ''}><span class="ro-ic">${I('flame')}</span><span><b>${ns === 'granted' ? 'Notificações ativas' : ns === 'denied' ? 'Notificações bloqueadas pelo browser' : 'Ativar notificações do browser'}</b><small>Funcionam enquanto o Trilho estiver aberto num separador. ${ns === 'denied' ? 'Podes desbloquear nas definições do site.' : ''}</small></span></button>`}
      </div>
      <div class="panel soft"><b>Também dentro do site</b><p class="muted">Quando abres o Trilho depois da hora marcada sem teres feito o dia, aparece um aviso no topo e o sino fica com um ponto. ${pend.length ? `Hoje ainda falta: ${pend.map(id => esc(COURSES[id].short)).reduce((a, x, i, l) => a + (i ? (i === l.length - 1 ? ' e ' : ', ') : '') + x, '')}.` : 'Hoje já está tudo feito.'}</p></div>
    </main>`);
    const ti = app.querySelector('#rem-time');
    ti.onchange = () => { P.time = ti.value || '20:00'; P.notified = null; savePrefs(); app.querySelector('#gcal').href = gcalLink(); toast('Lembrete às ' + P.time); };
    app.querySelectorAll('[data-goal]').forEach(s => s.onchange = () => { const id = s.dataset.goal, st = loadState(id); st.goal = +s.value; lsSet('trilho-' + id, st); toast('Objetivo guardado'); });
  }
  function tickReminder() {
    const now = new Date(), t = P.time || '20:00';
    if (now.toTimeString().slice(0, 5) < t || P.notified === todayStr()) return;
    const pend = pendingCourses(); if (!pend.length) return;
    P.notified = todayStr(); savePrefs();
    const msg = 'Falta o treino de hoje: ' + pend.map(id => COURSES[id].short).reduce((a, x, i, l) => a + (i ? (i === l.length - 1 ? ' e ' : ', ') : '') + x, '') + '.';
    if (notifState() === 'granted') { try { new Notification('Trilho', { body: msg }); } catch (e) { } }
    toast(msg, 6000);
  }

  /* --------------------------- Curso: percurso --------------------------- */
  function setCourse(id) {
    C = COURSES[id]; KEY = 'trilho-' + id; S = loadState(id); lessonGens = {};
    for (const g in C.gens) { const l = C.gens[g].lesson; (lessonGens[l] = lessonGens[l] || []).push(g); }
    const st = document.documentElement.style; st.setProperty('--acc', C.accent); st.setProperty('--acc2', C.accent2 || C.accent);
    document.title = C.name;
  }
  const ZZ = [0, 44, 74, 44, 0, -44, -74, -44];
  function home() {
    const nd = nextDay(), p = plan(nd), n = doneCount(S), acc = S.stats.tot ? Math.round(100 * S.stats.ok / S.stats.tot) : 0, t = todayCount(S);
    let path = '', lastPh = 0, lastU = null, k = 0;
    for (let d = 1; d <= C.days; d++) {
      const pl = plan(d);
      if (pl.cyc !== lastPh) {
        lastPh = pl.cyc; lastU = null;
        const from = d; let to = d; while (to < C.days && plan(to + 1).cyc === pl.cyc) to++;
        const dn = Object.keys(S.done).filter(x => +x >= from && +x <= to && S.done[x].complete).length;
        path += `<div class="phase"><div class="kicker">Fase ${pl.cyc} · dias ${from}–${to}</div><h3>${esc(phaseName(pl.cyc))}</h3><span class="muted small">${dn}/${to - from + 1} concluídos</span></div>`;
      }
      if (pl.cyc === 1 && pl.lesson.unit !== lastU) { lastU = pl.lesson.unit; path += `<div class="unit">${esc(lastU)}</div>`; k = 0; }
      const done = S.done[d] && S.done[d].complete, st = done ? 'done' : d === nd ? 'cur' : unlocked(d) ? 'open' : 'lock';
      const ic = done ? I('check') : st === 'lock' ? I('lock') : pl.exam ? I('star') : pl.lesson.tool ? I('tool') : `<b>${d}</b>`;
      path += `<div class="prow" style="--x:${ZZ[k++ % ZZ.length]}px">
        ${st === 'cur' ? `<div class="pop"><div class="kicker">Dia ${d}${pl.exam ? ' · com prova' : ''}</div><b>${esc(pl.lesson.title)}</b><button class="btn primary sm" data-day="${d}">${S.done[d] ? 'Continuar' : 'Começar'}</button></div>` : ''}
        <button class="pnode ${st} ${pl.exam ? 'exam' : ''}" data-day="${d}" aria-label="Dia ${d}: ${esc(pl.lesson.title)}">${ic}</button>
        <span class="plabel"><small>Dia ${d}${pl.lesson.tool ? ' · ferramentas' : ''}</small>${esc(pl.lesson.title)}</span></div>`;
    }
    H(nav(C.id) + `<main class="page course">
      <aside class="side">
        <div class="cside" style="--acc:${C.accent};--acc2:${C.accent2}">
          <div class="cside-art">${ART(C.id)}</div>
          <div class="kicker">${esc(C.tagline)}</div><h1>${esc(C.name)}</h1>
          <div class="pbar"><span style="width:${n / C.days * 100}%"></span></div>
          <p class="muted small">${n} de ${C.days} dias · ${phaseName(p.cyc)}</p>
          <button class="btn primary wide" data-day="${nd}">${S.done[nd] ? 'Continuar' : 'Começar'} dia ${nd}</button>
          <div class="row2">${S.wrong.length ? `<button class="btn ghost" data-act="review">Rever erros (${S.wrong.length})</button>` : ''}<button class="btn ghost" data-act="practice">Treino rápido</button></div>
        </div>
        <div class="tiles">
          <div><b>${t}/${S.goal}</b><span>hoje</span></div><div><b>${S.streak}</b><span>sequência</span></div><div><b>${acc}%</b><span>precisão</span></div><div><b>${S.best}</b><span>recorde</span></div>
        </div>
        ${C.stack ? `<div class="panel"><h3>Linguagens e ferramentas</h3><dl class="stack">${C.stack.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl><p class="muted small">Os dias com ${I('tool', 'sm')} são dedicados a estas ferramentas.</p></div>` : ''}
        <details class="panel"><summary><b>Fontes e definições</b></summary>
          <ul class="srcs">${C.sources.map(s => `<li><a href="${s.u}" target="_blank" rel="noopener">${esc(s.n)}</a></li>`).join('')}</ul>
          ${C.disclaimer ? `<p class="muted small">${C.disclaimer}</p>` : ''}
          <div class="row2"><button class="btn ghost sm" data-act="export">Exportar progresso</button><label class="btn ghost sm">Importar<input type="file" accept=".json" data-act="import" hidden></label><button class="btn ghost sm" data-act="free">${S.free ? 'Desligar' : 'Ligar'} modo livre</button><button class="btn ghost sm danger" data-act="reset">Repor tudo</button></div>
        </details>
      </aside>
      <section class="path"><p class="muted small center">${C.lessons.length} lições na fase 1, depois revisão espaçada e 10 dias de reta final. ${I('star', 'sm')} = dia com prova.${S.free ? ' <b>Modo livre ativo.</b>' : ''}</p>${path}</section>
    </main>`);
    const cur = app.querySelector('.pnode.cur'); if (cur && nd > 3) cur.scrollIntoView({ block: 'center' });
  }
  function dayView(d) {
    const p = plan(d), st = S.done[d] || {}, L = p.lesson;
    const step = (k, ic, title, sub, done, score) => `<button class="step ${done ? 'done' : ''}" data-step="${k}" data-d="${d}"><span class="sic">${done ? I('check') : I(ic)}</span><span class="stx"><b>${title}</b><small>${sub}</small></span>${score != null ? `<span class="score">${score}%</span>` : ''}</button>`;
    H(nav(C.id) + `<main class="page narrow">
      <a href="#${C.id}" class="backlink">${I('back')} ${esc(C.name)}</a>
      <div class="kicker">Dia ${d} de ${C.days} · ${esc(phaseName(p.cyc))}</div><h1>${esc(L.title)}</h1>
      <p class="muted">${esc(L.unit)}${L.tool ? ' · Linguagens e ferramentas' : ''}</p>
      ${L.src && L.src.length ? `<p class="muted small">Fontes: ${L.src.map(s => typeof s === 'string' ? esc(s) : `<a href="${s.u}" target="_blank" rel="noopener">${esc(s.n)}</a>`).join(' · ')}</p>` : ''}
      <div class="steps">
        ${step('lesson', 'book', 'Lição', `${lessonCards(p).length} cartões interativos`, st.lesson != null, st.lesson)}
        ${step('test', 'quiz', 'Teste diário', `${C.testN || 9} perguntas com revisão espaçada`, st.test != null, st.test)}
        ${p.extra ? step('extra', C.id === 'conducao' ? 'wheel' : 'tool', `${p.extra.kind}: ${esc(p.extra.title)}`, p.extra.sub || 'Recomendado', !!st.extra) : ''}
        ${p.exam ? step('exam', 'star', p.big ? `Exame de marco (dia ${d})` : C.exam.title, C.exam.sub(p.big), st.exam != null, st.exam) : ''}
      </div>
      ${st.complete ? `<div class="strip ok">${I('check')}<div><b>Dia concluído.</b></div></div>${d < C.days ? `<button class="btn primary wide" data-day="${d + 1}">Dia ${d + 1}</button>` : ''}` : `<p class="muted small">Conclui a Lição e o Teste para desbloquear o dia ${d + 1}.</p>`}
    </main>`);
  }
  function extraView(d) {
    const p = plan(d), x = p.extra, ck = S.checks[d] || {};
    H(nav(C.id) + `<main class="page narrow"><button class="backlink" data-day="${d}">${I('back')} Dia ${d}</button><div class="kicker">${esc(x.kind)}${x.size ? ' · ' + esc(x.size) : ''}</div><h1>${esc(x.title)}</h1>
      <div class="panel prose">${x.html}</div>
      ${x.checklist && x.checklist.length ? `<div class="panel"><h3>Checklist</h3>${x.checklist.map((c, i) => `<label class="chk"><input type="checkbox" id="ck-${d}-${i}" data-ck="${i}" ${ck[i] ? 'checked' : ''}> <span>${c}</span></label>`).join('')}</div>` : ''}
      ${x.solution ? `<details class="panel"><summary><b>Ver solução de referência</b> (tenta primeiro)</summary>${x.solution}</details>` : ''}
      <div class="row2"><button class="btn primary" data-act="extradone" data-d="${d}">${S.done[d] && S.done[d].extra ? 'Concluído' : 'Marcar como concluído'}</button><button class="btn ghost" data-day="${d}">Voltar ao dia</button></div></main>`);
    app.querySelectorAll('[data-ck]').forEach(i => i.onchange = () => { S.checks[d] = S.checks[d] || {}; S.checks[d][i.dataset.ck] = i.checked; save(); });
  }

  /* ---------------------------- Runner ---------------------------- */
  function run(cards, title, onDone, review) { R = { cards, i: 0, ok: 0, tot: 0, title, onDone, answered: false, xp: 0, review }; card(); }
  function card() {
    const c = R.cards[R.i]; R.answered = false; R.sel = null;
    let body = '';
    if (c.t === 'text') body = `<h2>${c.h}</h2><div class="prose">${c.b}</div>`;
    else if (c.t === 'widget') body = `<h2>${c.o.h || 'Experimenta'}</h2>${c.o.b ? `<div class="prose">${c.o.b}</div>` : ''}<div class="widget"></div>`;
    else if (c.t === 'mcq') body = `<div class="qlabel">Escolhe uma resposta</div><div class="prose q">${c.q}</div><div class="opts">${c.o.map((o, i) => `<button class="opt" data-o="${i}"><span class="k">${String.fromCharCode(65 + i)}</span><span>${o}</span></button>`).join('')}</div>`;
    else if (c.t === 'num') body = `<div class="qlabel">Calcula</div><div class="prose q">${c.q}</div><div class="numin"><input type="text" inputmode="decimal" id="ans" placeholder="A tua resposta" autocomplete="off"><span>${c.u}</span></div>`;
    else if (c.t === 'fill') body = `<div class="qlabel">Escreve a resposta</div><div class="prose q">${c.q}</div><div class="numin"><input type="text" id="ans" placeholder="Resposta" autocomplete="off" spellcheck="false"></div>`;
    else if (c.t === 'open') body = `<div class="qlabel">Pergunta de entrevista</div><div class="prose q">${c.q}</div><p class="muted small">Responde em voz alta ou por escrito, como numa entrevista. Depois compara com a resposta modelo.</p><textarea id="draft" rows="4" placeholder="O teu rascunho (opcional)"></textarea><div class="model" hidden><div class="qlabel">Resposta modelo</div><div class="prose">${c.ans}</div></div>`;
    const btn = c.t === 'text' || c.t === 'widget' ? `<button class="btn primary" data-act="next">Continuar</button>` : c.t === 'open' ? `<button class="btn primary" data-act="reveal">Mostrar resposta</button>` : `<button class="btn primary" data-act="check" ${c.t === 'mcq' ? 'disabled' : ''}>Verificar</button>`;
    const segs = R.cards.map((_, i) => `<span class="${i < R.i ? 'f' : i === R.i ? 'c' : ''}"></span>`).join('');
    H(`<div class="runner"><div class="rtop"><button class="iconbtn" data-act="quit" aria-label="Sair">${I('x')}</button><div class="segs">${segs}</div><span class="muted small tnum">${R.i + 1}/${R.cards.length}</span></div>
      <main class="rbody"><div class="kicker">${esc(R.title)}</div><div class="qcard">${body}</div></main>
      <div class="dock"><div class="dock-in"><div class="fbmsg"></div><div class="dock-btns">${btn}</div></div></div></div>`);
    if (c.t === 'widget' && Widgets[c.name]) Widgets[c.name](app.querySelector('.widget'), c.o);
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => { if (R.answered) return; app.querySelectorAll('.opt').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); R.sel = +b.dataset.o; app.querySelector('[data-act=check]').disabled = false; });
    const inp = app.querySelector('#ans'); if (inp) { inp.focus(); inp.oninput = () => { } ; }
  }
  const norm = s => String(s).toLowerCase().trim().replace(/[\s_]/g, '').replace(/^(0x|0b|'h|'b|'d)/, '');
  function check() {
    const c = R.cards[R.i]; let ok = false, shown = '';
    if (c.t === 'mcq') { if (R.sel == null) return; ok = R.sel === c.a; app.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (i === c.a) b.classList.add('right'); else if (i === R.sel) b.classList.add('wrong'); }); }
    else if (c.t === 'num') { const v = parseFloat(String(app.querySelector('#ans').value).replace(',', '.').replace(/\s/g, '')); if (isNaN(v)) return toast('Escreve um número.'); ok = Math.abs(v - c.ans) <= Math.max(c.tol, Math.abs(c.ans) * 1e-6); shown = `Resposta: <b>${c.ans}${c.u ? ' ' + c.u : ''}</b>`; }
    else if (c.t === 'fill') { const v = norm(app.querySelector('#ans').value); if (!v) return toast('Escreve uma resposta.'); ok = c.acc.some(a => norm(a) === v); shown = `Resposta: <b>${esc(c.acc[0])}</b>`; }
    grade(ok, shown, c);
  }
  function grade(ok, shown, c, msg) {
    R.answered = true; R.tot++; S.stats.tot++;
    if (ok) { R.ok++; S.stats.ok++; R.xp += 10; S.xp += 10; if (R.review) S.wrong = S.wrong.filter(w => w.q !== c.q); } else pushWrong(c);
    const dock = app.querySelector('.dock'); dock.classList.add(ok ? 'good' : 'bad');
    app.querySelector('.fbmsg').innerHTML = msg || `<b class="fbt">${ok ? pickOne(['Correto!', 'Excelente!', 'Isso mesmo!', 'Boa!']) : 'Ainda não.'}</b> ${shown}${c.e ? `<div class="prose">${c.e}</div>` : ''}`;
    app.querySelector('.dock-btns').innerHTML = `<button class="btn primary" data-act="next">Continuar</button>`; save();
  }
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  function pushWrong(c) { if (!S.wrong.some(w => w.q === c.q)) { S.wrong.unshift(JSON.parse(JSON.stringify(c))); S.wrong = S.wrong.slice(0, 300); } }
  function next() { R.i++; if (R.i >= R.cards.length) finish(); else card(); }
  function finish() {
    const pct = R.tot ? Math.round(100 * R.ok / R.tot) : 100; save(); R.result = pct;
    H(`<main class="page narrow center"><div class="done-card">
      <div class="burst">${I(pct >= 80 ? 'star' : pct >= 50 ? 'bolt' : 'book')}</div>
      <h1>${esc(R.title)} concluído</h1>
      <div class="tiles three"><div><b>${R.tot ? pct + '%' : '—'}</b><span>certas</span></div><div><b>${R.ok}/${R.tot}</b><span>respostas</span></div><div><b>+${R.xp}</b><span>XP</span></div></div>
      ${R.tot && pct < 60 ? '<p class="muted">Revê a lição e usa "Rever erros" na página do curso. Errar faz parte de aprender.</p>' : ''}
      <button class="btn primary wide" data-act="after">Continuar</button></div></main>`);
  }
  function mark(d, key, val) {
    S.done[d] = S.done[d] || {}; S.done[d][key] = val; const st = S.done[d];
    if (!st.complete && st.lesson != null && st.test != null) {
      st.complete = todayStr(); S.xp += 50; const t = todayStr(); if (S.day.date !== t) S.day = { date: t, n: 0 }; S.day.n++;
      if (S.last !== t) { S.streak = S.last === todayStr(-1) ? S.streak + 1 : 1; S.last = t; S.best = Math.max(S.best, S.streak); }
    }
    save();
  }

  /* ---------------------------- Eventos ---------------------------- */
  function onClick(e) {
    const t = e.target.closest('[data-act],[data-day],[data-step]'); if (!t) return;
    if (t.dataset.day && !t.dataset.act) { const d = +t.dataset.day; if (!unlocked(d)) return toast(`Conclui primeiro o dia ${nextDay()} (ou liga o modo livre).`); return dayView(d); }
    if (t.dataset.step) {
      const d = +t.dataset.d, p = plan(d), k = t.dataset.step;
      if (k === 'lesson') return run(lessonCards(p), `Dia ${d} · Lição`, pct => { mark(d, 'lesson', pct); dayView(d); });
      if (k === 'test') return run(testCards(p), `Dia ${d} · Teste diário`, pct => { mark(d, 'test', pct); dayView(d); });
      if (k === 'exam') return run(examCards(p), `Dia ${d} · ${p.big ? 'Exame de marco' : C.exam.title}`, pct => { mark(d, 'exam', pct); dayView(d); });
      if (k === 'extra') return extraView(d);
    }
    const a = t.dataset.act;
    if (a === 'next') return next();
    if (a === 'check') return check();
    if (a === 'reveal') { app.querySelector('.model').hidden = false; app.querySelector('.dock-btns').innerHTML = `<button class="btn bad-b" data-act="self0">Não sabia</button><button class="btn good-b" data-act="self1">Sabia</button>`; return; }
    if (a === 'self1' || a === 'self0') { const c = R.cards[R.i]; return grade(a === 'self1', '', { ...c, e: '' }, a === 'self1' ? '<b class="fbt">Boa!</b> Continua a treinar a explicação em voz alta.' : '<b class="fbt">Guardada para revisão.</b> Relê a resposta modelo e tenta explicá-la sem olhar.'); }
    if (a === 'quit') {
      if (!R || R.tot === 0 || t.dataset.sure) { R = null; return home(); }
      t.dataset.sure = 1; t.classList.add('warn'); toast('Clica outra vez no X para sair. Perdes as respostas deste bloco.'); setTimeout(() => { delete t.dataset.sure; t.classList.remove('warn'); }, 3500); return;
    }
    if (a === 'after') { const f = R.onDone, pct = R.result; R = null; return f ? f(pct) : home(); }
    if (a === 'review') return run(S.wrong.slice(0, 12).map(c => ({ ...c })), 'Revisão de erros', () => home(), true);
    if (a === 'practice') { const r = rng(Date.now() & 0xffffffff), hi = Math.max(0, plan(nextDay()).li), ks = Object.keys(C.gens); let cards = []; for (let i = 0; i < 8; i++) cards.push(r() < .5 && ks.length ? inst(G(r.pick(ks)), r, r.int(1, 3)) : poolOf(r.int(0, hi), r, 1, 1)[0]); return run(cards, 'Treino rápido', () => home()); }
    if (a === 'extradone') { const d = +t.dataset.d; if (!(S.done[d] && S.done[d].extra)) S.xp += 30; mark(d, 'extra', true); return dayView(d); }
    if (a === 'theme') { const root = document.documentElement, dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; root.dataset.theme = dark ? 'light' : 'dark'; P.theme = root.dataset.theme; savePrefs(); return; }
    if (a === 'export') return exportState();
    if (a === 'ics') return saveFile('trilho-lembrete.ics', icsText(), 'text/calendar');
    if (a === 'notif') { if (notifState() === 'default') Notification.requestPermission().then(() => reminderView()).catch(() => toast('O browser não deixou ativar notificações aqui.')); return; }
    if (a === 'free') { S.free = !S.free; save(); return home(); }
    if (a === 'reset') {
      if (!t.dataset.sure) { t.dataset.sure = 1; t.textContent = 'Clica outra vez para apagar'; setTimeout(() => { if (t.isConnected) { delete t.dataset.sure; t.textContent = 'Repor tudo'; } }, 4000); return; }
      S = fresh(); save(); toast('Progresso apagado'); return home();
    }
  }
  function saveFile(name, text, type) {
    if (caps.downloads) return caps.downloads.save({ filename: name, data: text }).then(() => toast('Guardado')).catch(e => { if (e && e.code !== 'declined') toast('Não foi possível guardar o ficheiro aqui.'); });
    try { const u = URL.createObjectURL(new Blob([text], { type })), l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); } catch (e) { toast('Não foi possível guardar o ficheiro.'); }
  }
  const exportState = () => saveFile(`progresso-${C.id}-${todayStr()}.json`, JSON.stringify(S, null, 1), 'application/json');
  function toast(m, ms = 2800) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), ms); }

  function route() {
    R = null; const h = location.hash.replace('#', '');
    if (COURSES[h]) { setCourse(h); return home(); }
    if (h === 'lembrete') return reminderView();
    document.documentElement.style.removeProperty('--acc'); document.documentElement.style.removeProperty('--acc2');
    return hub();
  }
  function boot(list) {
    list.forEach(c => { COURSES[c.id] = c; ORDER.push(c.id); });
    P = Object.assign({ time: '20:00', notified: null, theme: null }, lsGet('trilho-prefs') || {});
    if (P.theme) document.documentElement.dataset.theme = P.theme;
    app = document.getElementById('app');
    app.addEventListener('click', onClick);
    app.addEventListener('change', e => {
      if (e.target.dataset.act === 'import') { const f = e.target.files[0]; if (!f) return; f.text().then(txt => { try { S = Object.assign(fresh(), JSON.parse(txt)); save(); home(); toast('Progresso importado'); } catch (er) { toast('Esse ficheiro não é um progresso válido.'); } }); }
    });
    document.addEventListener('keydown', e => {
      if (!R) return; const tag = e.target.tagName;
      if (e.key === 'Enter' && tag !== 'TEXTAREA') { const b = app.querySelector('.dock-btns [data-act=check]:not([disabled]), .dock-btns [data-act=next], .dock-btns [data-act=reveal]'); if (b) { e.preventDefault(); b.click(); } return; }
      if (R.answered || tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase(), i = 'abcdef'.indexOf(k) >= 0 ? 'abcdef'.indexOf(k) : (+k - 1), o = app.querySelectorAll('.opt')[i]; if (o) o.click();
    });
    window.addEventListener('hashchange', route);
    if (window.claude && window.claude.use) window.claude.use('downloads').then(d => { caps.downloads = d; }).catch(() => { });
    route(); tickReminder(); setInterval(tickReminder, 30000);
  }
  return { boot, plan, lessonCards, testCards, examCards, setCourse, COURSES };
})();
