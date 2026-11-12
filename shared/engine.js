'use strict';
/* ====== Motor de aprendizagem estilo "lições interativas" (partilhado pelas duas apps) ====== */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* Construtores de cartões usados nos ficheiros de dados */
const T = (h, b) => ({ t: 'text', h, b });
const Q = (q, o, a, e) => ({ t: 'mcq', q, o, a, e });
const TF = (q, a, e) => ({ t: 'mcq', q, o: ['Verdadeiro', 'Falso'], a: a ? 0 : 1, e, fixed: 1 });
const N = (q, ans, tol, u, e) => ({ t: 'num', q, ans, tol: tol || 0, u: u || '', e });
const F = (q, acc, e) => ({ t: 'fill', q, acc: [].concat(acc), e });
const OPEN = (q, ans) => ({ t: 'open', q, ans });
const W = (name, o) => ({ t: 'widget', name, o: o || {} });
const G = id => ({ t: 'gen', id });
const CODE = c => `<pre class="code">${esc(c.replace(/^\n/, '').replace(/\s+$/, ''))}</pre>`;
const SRC = (n, u) => ({ n, u });

/* Sinais de trânsito em SVG (estilizados) */
function SIGN(k, txt = '', size = 90) {
  const s = size, h = s / 2;
  const T2 = (t, fs, col = '#111', y = h + fs * 0.35) => `<text x="${h}" y="${y}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${fs}" fill="${col}">${esc(t)}</text>`;
  let b = '';
  switch (k) {
    case 'limit': b = `<circle cx="${h}" cy="${h}" r="${h - 6}" fill="#fff" stroke="#d32f2f" stroke-width="${s * .11}"/>` + T2(txt, s * (String(txt).length > 2 ? .3 : .38)); break;
    case 'min': b = `<circle cx="${h}" cy="${h}" r="${h - 3}" fill="#1565c0"/>` + T2(txt, s * .36, '#fff'); break;
    case 'end': b = `<circle cx="${h}" cy="${h}" r="${h - 4}" fill="#fff" stroke="#555" stroke-width="2"/>` + T2(txt, s * .34, '#777') + `<line x1="${s * .2}" y1="${s * .8}" x2="${s * .8}" y2="${s * .2}" stroke="#333" stroke-width="3"/>`; break;
    case 'stop': { const r = h - 3, p = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; p.push((h + r * Math.cos(a)).toFixed(1) + ',' + (h + r * Math.sin(a)).toFixed(1)); } b = `<polygon points="${p.join(' ')}" fill="#d32f2f" stroke="#fff" stroke-width="3"/>` + T2('STOP', s * .26, '#fff'); break; }
    case 'yield': b = `<polygon points="4,6 ${s - 4},6 ${h},${s - 6}" fill="#fff" stroke="#d32f2f" stroke-width="${s * .09}" stroke-linejoin="round"/>`; break;
    case 'danger': b = `<polygon points="${h},5 ${s - 4},${s - 8} 4,${s - 8}" fill="#fff" stroke="#d32f2f" stroke-width="${s * .09}" stroke-linejoin="round"/>` + T2(txt, s * .3, '#111', s * .76); break;
    case 'prohib': b = `<circle cx="${h}" cy="${h}" r="${h - 6}" fill="#fff" stroke="#d32f2f" stroke-width="${s * .11}"/>` + T2(txt, s * .32) + `<line x1="${s * .24}" y1="${s * .24}" x2="${s * .76}" y2="${s * .76}" stroke="#d32f2f" stroke-width="${s * .08}"/>`; break;
    case 'noentry': b = `<circle cx="${h}" cy="${h}" r="${h - 3}" fill="#d32f2f"/><rect x="${s * .18}" y="${h - s * .08}" width="${s * .64}" height="${s * .16}" fill="#fff"/>`; break;
    case 'nostop': b = `<circle cx="${h}" cy="${h}" r="${h - 6}" fill="#1565c0" stroke="#d32f2f" stroke-width="${s * .11}"/><line x1="${s * .24}" y1="${s * .24}" x2="${s * .76}" y2="${s * .76}" stroke="#d32f2f" stroke-width="${s * .08}"/><line x1="${s * .76}" y1="${s * .24}" x2="${s * .24}" y2="${s * .76}" stroke="#d32f2f" stroke-width="${s * .08}"/>`; break;
    case 'nopark': b = `<circle cx="${h}" cy="${h}" r="${h - 6}" fill="#1565c0" stroke="#d32f2f" stroke-width="${s * .11}"/><line x1="${s * .24}" y1="${s * .24}" x2="${s * .76}" y2="${s * .76}" stroke="#d32f2f" stroke-width="${s * .08}"/>`; break;
    case 'mand': b = `<circle cx="${h}" cy="${h}" r="${h - 3}" fill="#1565c0"/>` + T2(txt, s * .4, '#fff'); break;
    case 'info': b = `<rect x="3" y="3" width="${s - 6}" height="${s - 6}" rx="6" fill="#1565c0"/>` + T2(txt, s * .4, '#fff'); break;
    case 'prio': b = `<polygon points="${h},4 ${s - 4},${h} ${h},${s - 4} 4,${h}" fill="#fff" stroke="#333" stroke-width="2"/><polygon points="${h},${s * .2} ${s * .8},${h} ${h},${s * .8} ${s * .2},${h}" fill="#f9c80e"/>`; break;
  }
  return `<svg class="sign" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" role="img" aria-label="sinal">${b}</svg>`;
}

/* RNG determinístico (mulberry32) */
function rng(seed) {
  let a = seed >>> 0;
  const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.shuffle = arr => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  return f;
}
/* opções numéricas plausíveis para geradores */
function numOpts(r, ans, fmt = x => x, spread = .35) {
  const set = new Set([fmt(ans)]); let guard = 0;
  while (set.size < 4 && guard++ < 50) { const k = 1 + (r() * 2 - 1) * spread * (1 + guard / 10); set.add(fmt(ans * k)); }
  while (set.size < 4) set.add(fmt(ans) + ' ' + '′'.repeat(set.size));
  const o = [...set]; return { o, a: 0 };
}
const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

/* ======================= Widgets interativos ======================= */
const Widgets = {
  logic(el) {
    el.innerHTML = `<div class="wg"><div class="wg-row"><label class="tog"><input type="checkbox" data-k="a"> A</label><label class="tog"><input type="checkbox" data-k="b"> B</label></div><div class="gates"></div></div>`;
    const upd = () => {
      const a = +el.querySelector('[data-k=a]').checked, b = +el.querySelector('[data-k=b]').checked;
      const rows = [['AND', a & b], ['OR', a | b], ['XOR', a ^ b], ['NAND', 1 - (a & b)], ['NOR', 1 - (a | b)], ['XNOR', 1 - (a ^ b)]];
      el.querySelector('.gates').innerHTML = rows.map(([n, v]) => `<div class="gate ${v ? 'on' : ''}"><b>${n}</b><span>${v}</span></div>`).join('');
    };
    el.querySelectorAll('input').forEach(i => i.oninput = upd); upd();
  },
  binconv(el) {
    el.innerHTML = `<div class="wg"><label>Valor (padrão de 8 bits): <input type="range" min="0" max="255" value="173" class="w100"></label><div class="big mono"></div><div class="wg-out"></div></div>`;
    const rg = el.querySelector('input'), out = el.querySelector('.wg-out'), big = el.querySelector('.big');
    const upd = () => {
      const v = +rg.value, bits = v.toString(2).padStart(8, '0'), s = v > 127 ? v - 256 : v;
      big.innerHTML = bits.split('').map((c, i) => `<span class="bit ${c === '1' ? 'on' : ''}" title="2^${7 - i}">${c}</span>`).join('');
      out.innerHTML = `Sem sinal: <b>${v}</b> · Hex: <b>0x${v.toString(16).toUpperCase().padStart(2, '0')}</b> · Complemento para 2 (com sinal): <b>${s}</b>`;
    };
    rg.oninput = upd; upd();
  },
  slack(el) {
    const P = [['Tclk', 'Período de relógio (ps)', 200, 2000, 1000], ['tcq', 't_clk→Q (ps)', 20, 150, 60], ['tlog', 'Atraso lógico máx. (ps)', 50, 1800, 700], ['tsu', 't_setup (ps)', 10, 120, 40], ['skew', 'Skew captura−lançamento (ps)', -200, 200, 0]];
    el.innerHTML = `<div class="wg">${P.map(([k, l, a, b, v]) => `<label>${l}: <b data-v="${k}">${v}</b><input type="range" min="${a}" max="${b}" value="${v}" data-k="${k}" class="w100"></label>`).join('')}<div class="wg-out"></div></div>`;
    const upd = () => {
      const g = k => +el.querySelector(`[data-k=${k}]`).value; P.forEach(([k]) => el.querySelector(`[data-v=${k}]`).textContent = g(k));
      const req = g('tcq') + g('tlog') + g('tsu'), slack = g('Tclk') + g('skew') - req, fmax = 1e6 / Math.max(1, req - g('skew'));
      el.querySelector('.wg-out').innerHTML = `Folga de setup = Tclk + skew − (tcq + tlog + tsu) = <b class="${slack >= 0 ? 'good' : 'bad'}">${slack} ps</b> ${slack >= 0 ? '✔ cumpre' : '✘ VIOLA'} · f<sub>máx</sub> ≈ <b>${fmax.toFixed(0)} MHz</b>`;
    };
    el.querySelectorAll('input').forEach(i => i.oninput = upd); upd();
  },
  power(el) {
    const P = [['a', 'Fator de atividade α', 1, 100, 15, 100], ['c', 'Capacidade comutada C (nF)', 1, 200, 50, 10], ['v', 'Tensão V (mV)', 500, 1200, 800, 1000], ['f', 'Frequência f (MHz)', 100, 3000, 1500, 1]];
    el.innerHTML = `<div class="wg">${P.map(([k, l, a, b, v]) => `<label>${l}: <b data-v="${k}"></b><input type="range" min="${a}" max="${b}" value="${v}" data-k="${k}" class="w100"></label>`).join('')}<div class="wg-out"></div></div>`;
    const upd = () => {
      const a = el.querySelector('[data-k=a]').value / 100, c = el.querySelector('[data-k=c]').value / 10 * 1e-9, v = el.querySelector('[data-k=v]').value / 1000, f = el.querySelector('[data-k=f]').value * 1e6;
      el.querySelector('[data-v=a]').textContent = a.toFixed(2); el.querySelector('[data-v=c]').textContent = (c * 1e9).toFixed(1); el.querySelector('[data-v=v]').textContent = v.toFixed(2) + ' V'; el.querySelector('[data-v=f]').textContent = (f / 1e6) + ' MHz';
      const p = a * c * v * v * f; el.querySelector('.wg-out').innerHTML = `P<sub>din</sub> = α·C·V²·f = <b>${p.toFixed(2)} W</b> — repara: baixar V 10% poupa ~19%.`;
    };
    el.querySelectorAll('input').forEach(i => i.oninput = upd); upd();
  },
  stopdist(el) {
    el.innerHTML = `<div class="wg"><label>Velocidade: <b data-v="v"></b><input type="range" min="20" max="150" value="90" step="5" data-k="v" class="w100"></label>
    <label>Tempo de reação: <b data-v="t"></b><input type="range" min="5" max="25" value="10" data-k="t" class="w100"></label>
    <label>Piso: <select data-k="m"><option value="0.8">Seco (μ≈0,8)</option><option value="0.5">Molhado (μ≈0,5)</option><option value="0.2">Neve (μ≈0,2)</option><option value="0.1">Gelo (μ≈0,1)</option></select></label><div class="bars"></div><div class="wg-out"></div></div>`;
    const upd = () => {
      const v = +el.querySelector('[data-k=v]').value, t = el.querySelector('[data-k=t]').value / 10, m = +el.querySelector('[data-k=m]').value;
      el.querySelector('[data-v=v]').textContent = v + ' km/h'; el.querySelector('[data-v=t]').textContent = t.toFixed(1) + ' s';
      const ms = v / 3.6, dr = ms * t, db = ms * ms / (2 * m * 9.81), tot = dr + db, sc = 100 / Math.max(tot, 120);
      el.querySelector('.bars').innerHTML = `<div class="bar"><span class="r" style="width:${dr * sc}%"></span><span class="b" style="width:${db * sc}%"></span></div><small><span class="dot r"></span> reação <span class="dot b"></span> travagem</small>`;
      el.querySelector('.wg-out').innerHTML = `Reação: <b>${dr.toFixed(1)} m</b> + Travagem: <b>${db.toFixed(1)} m</b> = Paragem: <b>${tot.toFixed(1)} m</b>`;
    };
    el.querySelectorAll('input,select').forEach(i => i.oninput = upd); upd();
  },
  gd(el) {
    el.innerHTML = '<div class="wg"><label>Learning rate η: <b data-v="e"></b><input type="range" min="1" max="110" value="20" data-k="e" class="w100"></label><div class="gdplot"></div><div class="wg-out"></div></div>';
    const upd = () => {
      const eta = el.querySelector('[data-k=e]').value / 100; el.querySelector('[data-v=e]').textContent = eta.toFixed(2);
      let x = 4; const xs = [x]; for (let i = 0; i < 10; i++) { x = x - eta * 2 * x; xs.push(x); }
      const W = 300, Hh = 150, sx = v => W / 2 + Math.max(-1, Math.min(1, v / 5)) * (W / 2 - 10), sy = v => Hh - 10 - Math.min(1, (v * v) / 25) * (Hh - 25);
      let path = ''; for (let v = -5; v <= 5.01; v += 0.25) path += (path ? 'L' : 'M') + sx(v).toFixed(1) + ' ' + sy(v).toFixed(1);
      const pts = xs.map((v, i) => `<circle cx="${sx(v).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="${i ? 4 : 6}" class="gdp" style="opacity:${1 - i * 0.07}"/>`).join('');
      const steps = xs.slice(0, -1).map((v, i) => `<line x1="${sx(v).toFixed(1)}" y1="${sy(v).toFixed(1)}" x2="${sx(xs[i + 1]).toFixed(1)}" y2="${sy(xs[i + 1]).toFixed(1)}" class="gdl"/>`).join('');
      el.querySelector('.gdplot').innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Passos da descida do gradiente em f(x)=x²"><path d="${path}" class="gdc"/>${steps}${pts}</svg>`;
      const msg = eta > 1 ? 'diverge: cada passo afasta-se do mínimo' : eta > 0.5 ? 'oscila de um lado para o outro' : eta < 0.06 ? 'converge, mas muito devagar' : 'converge bem';
      el.querySelector('.wg-out').innerHTML = `Depois de 10 passos: x = <b>${xs[10].toFixed(3)}</b> (${msg}). Cada passo multiplica x por (1 − 2η) = ${(1 - 2 * eta).toFixed(2)}.`;
    };
    el.querySelector('input').oninput = upd; upd();
  },
  gap(el) {
    el.innerHTML = `<div class="wg"><label>Velocidade: <b data-v="v"></b><input type="range" min="30" max="120" step="10" value="90" data-k="v" class="w100"></label><div class="wg-out"></div></div>`;
    const upd = () => { const v = +el.querySelector('[data-k=v]').value, ms = v / 3.6; el.querySelector('[data-v=v]').textContent = v + ' km/h'; el.querySelector('.wg-out').innerHTML = `A ${v} km/h percorres <b>${ms.toFixed(1)} m/s</b>. Regra dos 2 s → <b>${(2 * ms).toFixed(0)} m</b>. Com chuva (≥3 s) → <b>${(3 * ms).toFixed(0)} m</b>. Em gelo/neve multiplica muito mais.`; };
    el.querySelector('input').oninput = upd; upd();
  },
};
