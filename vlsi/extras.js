/* Silício 1000 — geradores de problemas (números novos todos os dias), banco de entrevista e projetos */
const GEN = (id, lesson, f) => COURSE.gens[id] = { lesson, f };
const hx = n => n.toString(16).toUpperCase();

GEN('g_hex', 'num', (r, l) => { const n = r.int(16, l > 2 ? 65535 : 255); return F(`Escreve <b>${n}</b> (decimal) em hexadecimal.`, [hx(n)], `${n} = 0x${hx(n)}. Divide por 16 repetidamente ou converte para binário e agrupa em 4 bits: ${n.toString(2)}.`); });
GEN('g_bin', 'num', (r, l) => { const n = r.int(5, l > 2 ? 1023 : 255); return F(`Escreve <b>${n}</b> em binário (sem prefixo).`, [n.toString(2), n.toString(2).padStart(8, '0'), n.toString(2).padStart(10, '0')], `${n} = ${n.toString(2)}₂.`); });
GEN('g_twos', 'num', (r, l) => { const w = l > 2 ? 16 : 8, v = -r.int(1, w === 8 ? 128 : 32768), m = (1 << w) - 1, h = hx(v & m).padStart(w / 4, '0'); return F(`Representação de <b>${v}</b> em complemento para dois com ${w} bits, em hex:`, [h, hx(v & m)], `|${v}| = ${-v} = 0x${hx(-v)}. Inverte e soma 1 → 0x${h}. (Ou: 2^${w} − ${-v} = ${(1 << w) + v}.)`); });
GEN('g_ripple', 'adders', (r, l) => { const n = r.pick([8, 16, 32, 64]), tc = r.int(15, 40); return N(`Um somador ripple-carry de <b>${n} bits</b> tem atraso de carry por full adder de <b>${tc} ps</b>. Atraso aproximado do caminho do carry (ps)?`, n * tc, 1, 'ps', `≈ N·t<sub>carry</sub> = ${n}×${tc} = ${n * tc} ps. Um somador de prefixo teria ~log₂${n} = ${Math.log2(n)} níveis.`); });
GEN('g_fmax', 'timing', (r, l) => { const a = r.int(30, 90), b = r.int(150, 900 - l * 40 > 200 ? 900 - l * 40 : 300), c = r.int(20, 60), s = a + b + c, f = round(1e6 / s, 0); return N(`t<sub>cq</sub>=${a} ps, lógica=${b} ps, t<sub>setup</sub>=${c} ps, skew=0. Frequência máxima (MHz)?`, f, f * 0.01, 'MHz', `T<sub>min</sub> = ${a}+${b}+${c} = ${s} ps → f = 1/${s} ps ≈ ${f} MHz.`); });
GEN('g_slack', 'timing', (r, l) => { const f = r.pick([500, 800, 1000, 1250, 1500, 2000]), T = 1e6 / f, a = r.int(30, 80), b = r.int(200, Math.round(T)), c = r.int(20, 60), sk = r.int(-40, 40), s = round(T + sk - a - b - c, 0); return N(`Relógio de <b>${f} MHz</b>. t<sub>cq</sub>=${a} ps, lógica=${b} ps, t<sub>setup</sub>=${c} ps, skew (captura−lançamento)=${sk} ps. Folga de setup (ps)?`, s, 1, 'ps', `T = ${round(T, 1)} ps. Folga = T + skew − (tcq+lógica+tsu) = ${round(T, 1)} + ${sk} − ${a + b + c} = ${s} ps ${s < 0 ? '→ VIOLA' : '→ cumpre'}.`); });
GEN('g_hold', 'timing', (r, l) => { const a = r.int(25, 60), b = r.int(0, 60), h = r.int(10, 40), sk = r.int(-30, 80), s = a + b - h - sk; return N(`t<sub>cq,min</sub>=${a} ps, atraso mínimo da lógica=${b} ps, t<sub>hold</sub>=${h} ps, skew (captura−lançamento)=${sk} ps. Folga de hold (ps)?`, s, 0.5, 'ps', `Folga de hold = tcq,min + lógica,min − thold − skew = ${a}+${b}−${h}−(${sk}) = ${s} ps ${s < 0 ? '→ viola: inserir buffers no caminho de dados' : '→ cumpre'}.`); });
GEN('g_lfsr', 'counters', (r, l) => { const n = r.int(3, l > 2 ? 32 : 16); return N(`Quantos estados distintos percorre um LFSR (XOR) de comprimento máximo com <b>${n} bits</b>?`, 2 ** n - 1, 0, '', `2^${n} − 1 = ${2 ** n - 1} (o estado zero é excluído).`); });
GEN('g_fifoptr', 'fifo', (r, l) => { const k = r.int(2, 5), D = 2 ** k, M = 2 ** (k + 1), rp = r.int(0, M - 1), cnt = r.int(0, D), wp = (rp + cnt) % M, b = x => x.toString(2).padStart(k + 1, '0'); return N(`FIFO síncrono de profundidade ${D}, ponteiros de ${k + 1} bits. wptr=${b(wp)}, rptr=${b(rp)}. Quantas palavras estão no FIFO?`, cnt, 0, '', `ocupação = (wptr − rptr) mod ${M} = (${wp} − ${rp}) mod ${M} = ${cnt}${cnt === D ? ' → CHEIO' : cnt === 0 ? ' → VAZIO' : ''}.`); });
GEN('g_fifodepth', 'fifodepth', (r, l) => {
  const fw = r.pick([100, 120, 150, 200, 250, 400]), fr = r.pick([40, 50, 60, 75, 80, 100].filter(x => x < fw)), B = r.pick([40, 60, 80, 100, 120, 160, 200, 256]), k = l > 1 ? r.pick([1, 1, 2, 3]) : 1;
  const rate = fr / k, d = Math.ceil(B - B * rate / fw);
  return N(`Escrita: <b>${fw} MHz</b>, 1 palavra/ciclo, rajadas de <b>${B}</b> palavras (com tempo suficiente entre rajadas). Leitura: <b>${fr} MHz</b>, 1 palavra a cada <b>${k}</b> ciclo(s). Profundidade mínima do FIFO? (ignora latência de sincronização)`, d, 1, 'palavras', `Tempo da rajada = ${B}/${fw} MHz = ${round(B / fw, 3)} µs. Lidas nesse tempo = ${round(B / fw, 3)} µs × ${round(rate, 2)} M/s = ${round(B * rate / fw, 2)}. Profundidade = ${B} − ${round(B * rate / fw, 2)} → <b>${d}</b>. Em CDC real, soma alguns lugares de margem.`);
});
GEN('g_mtbf', 'meta', (r, l) => { const T = r.pick([500, 800, 1000, 1250]), tau = r.pick([10, 15, 20, 25]), e = round(T / tau * Math.LOG10E, 1); return N(`Sincronizador a ${round(1e6 / T, 0)} MHz (T=${T} ps), τ=${tau} ps. Acrescentar um 3.º flop multiplica o MTBF por e<sup>T/τ</sup>. Esse fator é ≈ 10<sup>x</sup>. Quanto vale x?`, e, 0.6, '', `T/τ = ${round(T / tau, 1)} → e^${round(T / tau, 1)} = 10^(${round(T / tau, 1)}×0,434) ≈ 10^${e}.`); });
GEN('g_gray', 'cdc', (r, l) => { const n = l > 2 ? 6 : 4, v = r.int(1, 2 ** n - 1), g = v ^ (v >> 1), s = x => x.toString(2).padStart(n, '0'); return r() < .6 || l < 2 ? F(`Converte o binário <b>${s(v)}</b> para código Gray (${n} bits):`, [s(g)], `g = b ^ (b >> 1) = ${s(v)} ^ ${s(v >> 1)} = ${s(g)}.`) : F(`Converte o Gray <b>${s(g)}</b> para binário:`, [s(v)], `b[MSB] = g[MSB]; b[i] = b[i+1] ^ g[i] → ${s(v)}.`); });
GEN('g_pipe', 'pipe', (r, l) => { const t = r.pick([1.2, 1.6, 2, 2.4, 3, 4]), k = r.pick([2, 3, 4, 5, 6, 8]), o = r.pick([0.08, 0.1, 0.12, 0.15, 0.2]), T = t / k + o; return r() < .5 ? N(`Lógica com ${t} ns dividida em <b>${k}</b> estágios iguais; overhead por registo (tcq+tsu) = ${o} ns. f<sub>max</sub> (GHz)?`, round(1 / T, 2), 0.02, 'GHz', `T = ${t}/${k} + ${o} = ${round(T, 3)} ns → ${round(1 / T, 2)} GHz.`) : N(`Lógica com ${t} ns em <b>${k}</b> estágios; overhead ${o} ns por estágio. Latência total de uma operação (ns)?`, round(k * T, 2), 0.02, 'ns', `${k} × (${round(t / k, 3)} + ${o}) = ${round(k * T, 2)} ns (vs ${round(t + o, 2)} ns sem pipeline).`); });
GEN('g_popcount', 'bits', (r, l) => { const w = l > 1 ? 16 : 8, v = r.int(1, 2 ** w - 1), c = v.toString(2).split('').filter(x => x === '1').length; return N(`Popcount (número de bits a 1) de <b>${w}'h${hx(v).padStart(w / 4, '0')}</b>?`, c, 0, '', `Binário: ${v.toString(2).padStart(w, '0')} → ${c} uns. Dica: decor o popcount de cada dígito hex (F=4, E=3, 7=3, …).`); });
GEN('g_credit', 'credit', (r, l) => { const rt = r.int(4, 24); if (r() < .5) return N(`Ligação com créditos: latência ida (dados) + volta (crédito) = <b>${rt} ciclos</b>. Quantos buffers mínimos no recetor para enviar 1 flit/ciclo sem parar?`, rt, 0, 'buffers', `Buffers ≥ RTT × taxa = ${rt} × 1 = ${rt}.`); const b = r.int(2, rt - 1); return N(`RTT = ${rt} ciclos, mas o recetor só tem <b>${b}</b> buffers. Throughput máximo (flits/ciclo, 2 casas decimais)?`, round(b / rt, 2), 0.011, 'flits/ciclo', `≈ buffers/RTT = ${b}/${rt} = ${round(b / rt, 2)}.`); });
GEN('g_ironlaw', 'isa', (r, l) => { const I = r.pick([2, 5, 8, 10, 20]) * 1e8, cpi = r.pick([0.8, 1, 1.2, 1.5, 2]), f = r.pick([1, 2, 2.5, 3, 4]); const t = I * cpi / (f * 1e9) * 1000; return N(`Programa com ${I / 1e6} milhões de instruções, CPI=${cpi}, relógio ${f} GHz. Tempo de execução (ms)?`, round(t, 2), round(t, 2) * 0.01, 'ms', `t = I × CPI / f = ${I / 1e6}M × ${cpi} / ${f} GHz = ${round(t, 2)} ms.`); });
GEN('g_amdahl', 'isa', (r, l) => { const p = r.pick([0.3, 0.5, 0.6, 0.75, 0.8, 0.9, 0.95]), s = r.pick([2, 4, 8, 10, 16, 100]), S = 1 / ((1 - p) + p / s); return N(`Uma fração <b>${p * 100}%</b> do tempo é acelerada <b>${s}×</b>. Speedup total (2 casas)?`, round(S, 2), 0.02, '×', `1 / (${round(1 - p, 2)} + ${p}/${s}) = ${round(S, 2)}×. Limite com s→∞: ${round(1 / (1 - p), 2)}×.`); });
GEN('g_branch', 'hazard', (r, l) => { const fb = r.pick([0.15, 0.2, 0.25]), mr = r.pick([0.02, 0.05, 0.08, 0.1]), pen = r.pick([2, 3, 10, 15, 20]), cpi = round(1 + fb * mr * pen, 3); return N(`CPI base 1. Branches = ${fb * 100}% das instruções, taxa de mispredict ${mr * 100}%, penalidade ${pen} ciclos. CPI efetivo?`, cpi, 0.005, '', `1 + ${fb}×${mr}×${pen} = ${cpi}.`); });
GEN('g_cachebits', 'cache', (r, l) => {
  const C = r.pick([8, 16, 32, 64, 128]) * 1024, B = r.pick([32, 64, 128]), A = r.pick([1, 2, 4, 8]), AB = r.pick([32, 40, 48]);
  const off = Math.log2(B), sets = C / (B * A), idx = Math.log2(sets), tag = AB - idx - off, k = r.pick(['tag', 'índice', 'offset']);
  const ans = k === 'tag' ? tag : k === 'índice' ? idx : off;
  return N(`Cache de ${C / 1024} KB, linhas de ${B} B, ${A === 1 ? 'mapeamento direto' : A + '-way'}, endereços de ${AB} bits. Quantos bits de <b>${k}</b>?`, ans, 0, 'bits', `offset = log₂${B} = ${off}; sets = ${C}/(${B}×${A}) = ${sets} → índice = ${idx}; tag = ${AB} − ${idx} − ${off} = ${tag}.`);
});
GEN('g_amat', 'cache', (r, l) => {
  const h1 = r.pick([1, 2, 3, 4]), m1 = r.pick([0.02, 0.05, 0.1]), mem = r.pick([100, 150, 200, 300]);
  if (l < 2 || r() < .5) { const a = round(h1 + m1 * mem, 2); return N(`Hit time ${h1} ciclos, miss rate ${m1 * 100}%, miss penalty ${mem} ciclos. AMAT (ciclos)?`, a, 0.01, 'ciclos', `${h1} + ${m1}×${mem} = ${a}.`); }
  const h2 = r.pick([10, 12, 15, 20]), m2 = r.pick([0.2, 0.3, 0.4, 0.5]), a = round(h1 + m1 * (h2 + m2 * mem), 2);
  return N(`L1: hit ${h1} ciclos, miss rate ${m1 * 100}%. L2: hit ${h2} ciclos, miss rate local ${m2 * 100}%. Memória: ${mem} ciclos. AMAT?`, a, 0.01, 'ciclos', `${h1} + ${m1}×(${h2} + ${m2}×${mem}) = ${a}.`);
});
GEN('g_warps', 'gpu', (r, l) => { const t = r.pick([64, 96, 100, 128, 200, 256, 300, 512, 1000, 1024]), b = r.pick([1, 4, 10, 80]); return N(`Uma grid tem ${b} block(s) de <b>${t}</b> threads. Quantos warps no total (warp = 32 threads)?`, b * Math.ceil(t / 32), 0, 'warps', `Por block: ⌈${t}/32⌉ = ${Math.ceil(t / 32)}${t % 32 ? ' (o último warp fica incompleto — lanes desperdiçadas!)' : ''}. Total: ${b * Math.ceil(t / 32)}.`); });
GEN('g_occ', 'gpu', (r, l) => { const R = r.pick([32, 40, 48, 64, 80, 96, 128, 255]), w = Math.min(64, Math.floor(65536 / (R * 32))); return N(`SM com register file de 65 536 registos de 32 bits e máximo de 64 warps residentes. Kernel usa <b>${R}</b> registos/thread. Máximo de warps residentes limitado por registos? (ignora granularidade de alocação)`, w, 0, 'warps', `⌊65536 / (${R}×32)⌋ = ${Math.floor(65536 / (R * 32))} → min(64, …) = ${w} warps → occupancy ${round(w / 64 * 100, 0)}%.`); });
const gcd = (a, b) => b ? gcd(b, a % b) : a;
GEN('g_bank', 'gpumem', (r, l) => { const s = r.pick([1, 2, 3, 4, 8, 16, 17, 32, 33, 64]), c = gcd(s, 32); return N(`Shared memory com 32 bancos de 4 B. A thread i (0..31) de um warp lê o float <code>sm[i*${s}]</code>. Grau do bank conflict (1 = sem conflito)?`, c, 0, '-way', `Banco = (i·${s}) mod 32. Nº de bancos distintos = 32/gcd(${s},32) = ${32 / c} → conflito de ${c} vias. Strides ímpares nunca têm conflito.`); });
GEN('g_matmul', 'tensor', (r, l) => { const M = r.pick([256, 512, 1024, 2048, 4096]), Nn = r.pick([256, 512, 1024, 2048]), K = r.pick([512, 1024, 4096]), fl = 2 * M * Nn * K / 1e9; return N(`GEMM: C(${M}×${Nn}) = A(${M}×${K}) · B(${K}×${Nn}). Quantos GFLOP (1 MAC = 2 FLOP)?`, round(fl, 2), round(fl, 2) * 0.01 + 0.01, 'GFLOP', `2·M·N·K = 2×${M}×${Nn}×${K} = ${round(fl, 2)} GFLOP.`); });
GEN('g_little', 'noc', (r, l) => { const bw = r.pick([100, 256, 500, 1000, 2000, 3000]), lat = r.pick([200, 400, 500, 600, 800]), kb = round(bw * lat / 1024, 1); return N(`Para sustentar <b>${bw} GB/s</b> com latência de memória de <b>${lat} ns</b>, quantos KB de pedidos têm de estar em voo? (1 KB = 1024 B)`, kb, kb * 0.02, 'KB', `Lei de Little: bytes em voo = ${bw} GB/s × ${lat} ns = ${bw * lat} B ≈ ${kb} KB.`); });
GEN('g_bw', 'noc', (r, l) => { const w = r.pick([1024, 2048, 4096, 5120]), g = r.pick([2, 3.2, 3.6, 6.4, 8]), bw = round(w * g / 8, 1); return N(`Memória com barramento de <b>${w} bits</b> a <b>${g} Gb/s por pino</b>. Largura de banda (GB/s)?`, bw, 0.5, 'GB/s', `${w} × ${g} / 8 = ${bw} GB/s.`); });
GEN('g_ring', 'inv', (r, l) => { const n = r.pick([3, 5, 7, 11, 21, 31]), t = r.pick([10, 15, 20, 25, 30]), f = round(1e6 / (2 * n * t), 1); return N(`Ring oscillator com <b>${n}</b> inversores de ${t} ps cada. Frequência (MHz)?`, f, f * 0.01, 'MHz', `f = 1/(2·N·t<sub>pd</sub>) = 1/(2×${n}×${t} ps) ≈ ${f} MHz.`); });
GEN('g_elmore', 'rc', (r, l) => { const n = r.int(2, l > 2 ? 10 : 5), R = r.pick([50, 100, 200]), C = r.pick([2, 5, 10]), t = R * C * n * (n + 1) / 2 / 1000; return N(`Escada RC com <b>${n}</b> secções iguais (R=${R} Ω, C=${C} fF cada). Atraso de Elmore até ao último nó (ps)?`, round(t, 3), 0.01, 'ps', `τ = R·C·N(N+1)/2 = ${R}×${C}fF×${n * (n + 1) / 2} = ${round(t, 3)} ps (Ω·fF = 10⁻³ ps).`); });
GEN('g_le', 'le', (r, l) => { const H = r.pick([16, 27, 64, 100, 256]), N2 = r.int(2, 5), f = H ** (1 / N2), D = N2 * f + N2; return N(`Cadeia de <b>${N2}</b> inversores conduz uma carga ${H}× a capacidade de entrada (G=1, B=1, p=1 por inversor). Atraso mínimo D (em τ, 1 casa decimal)?`, round(D, 1), 0.15, 'τ', `f̂ = ${H}^(1/${N2}) = ${round(f, 2)}; D = N·f̂ + N·p = ${round(N2 * f, 2)} + ${N2} = ${round(D, 1)} τ. (Ótimo: N ≈ log₄${H} = ${round(Math.log(H) / Math.log(4), 1)}.)`); });
GEN('g_power', 'power', (r, l) => { const a = r.pick([0.05, 0.1, 0.15, 0.2]), C = r.pick([10, 20, 50, 100]), V = r.pick([0.7, 0.75, 0.8, 0.9, 1.0]), f = r.pick([1, 1.5, 2, 2.5]), P = round(a * C * 1e-9 * V * V * f * 1e9, 2); return N(`α=${a}, C=${C} nF, V<sub>DD</sub>=${V} V, f=${f} GHz. Potência dinâmica (W)?`, P, 0.02, 'W', `α·C·V²·f = ${a}×${C}e-9×${V}²×${f}e9 = ${P} W.`); });

/* ============ Banco de perguntas de entrevista (abertas + escolha múltipla) ============ */
const IV = (tag, q, ans) => { const o = OPEN(q, ans); o.tag = tag; COURSE.interview.push(o); };
IV('timing', 'Explica setup e hold time a alguém que nunca ouviu falar. Porque é que o hold não depende da frequência?', 'Setup: o dado tem de estar estável um tempo antes do flanco; hold: tem de se manter estável um tempo depois. O setup envolve o caminho do flanco de lançamento ao flanco <b>seguinte</b> de captura (logo depende de T). O hold compara o dado lançado num flanco com o mesmo flanco no flop de captura (corrida entre dado novo e captura do antigo) — T não entra.');
IV('timing', 'Tens uma violação de setup de 50 ps num caminho entre dois módulos. Lista 5 formas de a corrigir, do RTL ao físico.', '1) Pipelining/retiming; 2) reestruturar lógica (menos níveis, mover lógica para o ciclo anterior, one-hot, pré-cálculo); 3) reduzir fan-out (duplicar registos); 4) upsizing / células LVT no caminho; 5) melhor placement (aproximar flops), useful skew; 6) relaxar requisito se legítimo (multicycle).');
IV('timing', 'Um caminho tem violação de setup E de hold ao mesmo tempo (em corners diferentes). Como é possível e o que fazes?', 'Setup no corner lento e hold no rápido, ou grande incerteza/OCV. Corrigir hold com buffers atrasa o caminho — tem de caber no setup. Soluções: reduzir lógica (ganhar margem de setup) e depois pôr atraso; rever skew (talvez skew grande no relógio — corrigir CTS); usar células de atraso com menos variação.');
IV('meta', 'O que é metastabilidade? Pode ser eliminada?', 'Estado intermédio de um elemento biestável quando a entrada viola a janela setup/hold; resolução em tempo não limitado com probabilidade a decair exponencialmente. Não pode ser eliminada, só tornada improvável (MTBF de séculos) com sincronizadores, mais tempo de resolução, flops com τ baixo.');
IV('cdc', 'Como passas um barramento de 32 bits de um domínio de relógio para outro?', 'Não com sincronizadores por bit. Opções: (a) handshake req/ack com dado estável (MCP formulation) — baixa largura de banda; (b) FIFO assíncrono — débito contínuo; (c) se o valor muda por incrementos (contador), Gray code; (d) se é quase estático (configuração), sincronizar um enable/valid e garantir estabilidade. Verificar com ferramenta CDC.');
IV('cdc', 'Desenha um pulse synchronizer de um domínio rápido para lento. Que limitação tem?', 'Origem: toggle flop (t <= t ^ pulse). Destino: 2-FF sync do toggle + flop extra + XOR = pulso de 1 ciclo. Limitação: pulsos de origem têm de estar espaçados ≥ ~2–3 ciclos do destino; senão perdem-se (dois toggles cancelam-se). Para pulsos frequentes → handshake/contador/FIFO.');
IV('fifodepth', 'Escritor a 100 MHz: 80 dados em cada janela de 100 ciclos (posição aleatória na janela). Leitor a 100 MHz: lê 8 em cada 10 ciclos. Profundidade mínima?', 'Primeiro verifica médias: escrita 80/100 = 0,8; leitura 8/10 = 0,8 → OK (se a leitura média fosse menor, nenhum FIFO chegava). Pior caso: 80 escritas no fim de uma janela + 80 no início da seguinte = 160 escritas em 160 ciclos seguidos. Nesses 160 ciclos o leitor lê 160 × 0,8 = 128. Profundidade = 160 − 128 = <b>32</b> (+ margem para latência de sincronização se for CDC).');
IV('fsm', 'Desenha uma FSM que deteta "110" numa sequência série, Moore e Mealy. Compara.', 'Mealy: S0 (nada), S1 ("1"), S2 ("11"); em S2 com 0 → saída 1 e S0. Moore: S0, S1, S2, S3 ("110", saída 1); de S3: 1→S1, 0→S0. Mealy usa menos estados e reage no mesmo ciclo; Moore tem saídas registadas/sem glitches e 1 ciclo de atraso.');
IV('counters', 'Desenha um divisor de relógio por 3 com duty cycle de 50%.', 'Contador mod-3 em posedge (0,1,2). Sinal a = (cnt==0) (ou cnt<1) em posedge; b = a amostrado em negedge. clk_out = a | b → alto durante 1,5 ciclos de 3. Mencionar: glitch-free porque a e b vêm de flops; em ASIC usar células dedicadas e generated clocks no SDC.');
IV('nba', 'Qual a diferença entre = e <= em Verilog e quando usas cada?', 'Blocking (=) executa sequencialmente e atualiza logo; non-blocking (<=) avalia todos os RHS e atualiza no fim do time-step. Sequencial → <=; combinacional → =; nunca misturar no mesmo bloco; nunca atribuir a mesma variável em 2 blocos. Evita races e mismatches sim/síntese.');
IV('latchinf', 'Como infere a ferramenta um latch? É sempre mau?', 'Quando uma saída de lógica combinacional não é atribuída em todos os caminhos (precisa de memória). Mau quando acidental (timing difícil, glitches, testabilidade). Latches intencionais: ICG, time borrowing em designs de alto desempenho, latch-based register files para área/potência.');
IV('hs', 'Implementa um registo de pipeline valid/ready. Porque é que o ready combinacional pode ser problema num pipeline longo?', 'ready_up = !valid_q || ready_dn; regista dados quando ready_up. Ready atravessa todos os estágios combinacionalmente para trás → caminho longo e por vezes loop; solução: skid buffers (ready registado) a cada N estágios.');
IV('fifo', 'Escreve um FIFO síncrono parametrizável. Como geras full e empty?', 'Ponteiros com bit extra; empty = (w==r); full = MSBs diferentes e restantes iguais; ou contador de ocupação. Escrita protegida por !full, leitura por !empty. Mencionar opções: registered output vs fall-through, almost_full para back-pressure com latência.');
IV('arb', 'Desenha um árbitro round-robin para N requisitantes. Como provas que é justo?', 'Máscara com bits acima do último vencedor; prioridade fixa nos pedidos mascarados; se nenhum, nos não mascarados. Fairness: após servir i, i fica com menor prioridade; cada requisitante ativo é servido em ≤ N−1 grants. Prova com assertion formal: req[i] mantido → grant[i] em ≤ N ciclos.');
IV('bits', 'Dado um vetor de 32 bits, gera um vetor onde só o 1 mais significativo fica ativo.', 'Propagar para a direita: y = x | x>>1 | x>>2 ... (smear) e depois y ^ (y>>1). Ou bit-reverse + x & -x + bit-reverse. Ou encoder de prioridade + decoder. Discutir profundidade lógica (log N).');
IV('bits', 'Como verificarias se exatamente um bit está a 1 num vetor de 64 bits, em hardware rápido?', 'x != 0 && (x & (x−1)) == 0 — mas o subtrator de 64 bits é lento. Alternativa em árvore: cada nó produz (algum, mais_que_um): algum = aL|aR, mais = mL|mR|(aL&aR). Profundidade log₂64 = 6.');
IV('cache', 'Desenha um cache controller direct-mapped com write-back. Que estados tem a FSM?', 'IDLE → COMPARE_TAG (hit: ler/escrever, write marca dirty) → se miss e dirty: WRITE_BACK (escreve linha antiga) → ALLOCATE (lê linha nova da memória) → volta a COMPARE. Arrays: tag, valid, dirty, data. Discutir: write-allocate, critical-word-first, MSHRs para non-blocking.');
IV('gpu', 'O que é warp divergence e como a hardware lida com ela?', 'Threads de um warp tomam caminhos diferentes num branch; SIMT executa cada caminho com máscara de lanes ativas, serializando; reconvergência no pós-dominador (pilha de reconvergência, ou em arquiteturas recentes, scheduling independente por thread com convergence barriers). Custo: lanes ociosas.');
IV('gpumem', 'Explica memory coalescing e dá um exemplo de código CUDA mau e bom.', 'Acessos de um warp a endereços contíguos combinam-se em poucas transações. Mau: a[threadIdx.x * 32] ou acesso por colunas a matriz row-major; bom: a[blockIdx.x*blockDim.x + threadIdx.x]. Usar shared memory para transpor e manter acessos globais coalescidos.');
IV('tensor', 'Desenha uma systolic array 2×2 para multiplicar matrizes. Como fluem os dados?', 'Cada PE: acc += a_in*b_in; passa a para a direita e b para baixo (registados). A entra pela esquerda com skew (linha i atrasada i ciclos), B por cima com skew por coluna. Após 3N−2 ciclos todos os acumuladores têm C. Output-stationary (C fica nos PEs) vs weight-stationary (B fica).');
IV('power', 'Quais as principais técnicas para reduzir potência num design RTL?', 'Clock gating (fino e grosso), operand isolation (não deixar entradas de datapath comutar quando o resultado não é usado), reduzir atividade (codificação, evitar glitches), memória: desligar bancos não usados, power gating de blocos, DVFS, multi-Vt (físico), reduzir fan-out de sinais muito ativos, evitar reset desnecessário em datapaths.');
IV('sta', 'O que é um false path e um multicycle path? Dá exemplos.', 'False path: caminho topológico que nunca é sensibilizado funcionalmente ou não importa (ex: registos de configuração estáticos, entre domínios assíncronos tratados por sync — com cuidado). Multicycle: o dado só é amostrado a cada N ciclos (ex: enable a cada 2 ciclos). Lembrar o ajuste de hold N−1.');
IV('flow', 'O que acontece entre escreveres RTL e o chip voltar da fábrica? Que problemas podem obrigar-te a mudar o RTL tarde no projeto?', 'Lint/CDC, verificação, síntese, DFT, P&R, sign-off (STA, potência, IR, DRC/LVS, LEC), tapeout. Mudanças tardias: timing que não fecha (pipeline), congestion (estruturas muito ligadas: crossbars), potência acima do orçamento, bugs encontrados em emulação → ECOs (engineering change orders) metal-only quando possível.');
IV('pipe', 'Um somador de 64 bits não cabe num ciclo a 3 GHz. Que opções tens?', 'Somador de prefixo mais rápido (Kogge-Stone), pipelining em 2 ciclos (soma 32 baixos + carry para o próximo ciclo), carry-save se for parte de uma acumulação (resolver o carry só no fim), mudar algoritmo para evitar o somador largo no caminho crítico.');
IV('reset', 'Porque precisa cada domínio de relógio do seu próprio sincronizador de reset?', 'A desativação do reset tem de cumprir recovery/removal em relação ao relógio de cada domínio; um reset sincronizado para o domínio A é assíncrono em relação a B. Também: domínios saem do reset em ciclos diferentes — protocolo/sequência deve tolerar isso.');
IV('credit', 'Projeta a interface entre dois chips com 20 ciclos de latência de fio. Como controlas o fluxo?', 'Créditos: emissor com contador inicializado ao nº de buffers do recetor (≥ RTT para pleno débito ≈ 40+ ciclos ida+volta); decrementa ao enviar; recetor devolve créditos (possivelmente agregados) ao libertar. Alternativa: almost-full com margem ≥ RTT. Considerar ECC/retransmissão, canais virtuais para evitar deadlock.');
IV('isa', 'Como aumentarias o desempenho de um core in-order de 5 estágios?', 'Forwarding completo, melhor branch prediction (BTB+bimodal/gshare), caches maiores/associativas, prefetching, superescalar (2-wide), pipeline mais profundo (mais frequência, mais penalidade de branch), instruções compostas (fusion). Avaliar com Iron Law e Amdahl.');
IV('mem', 'Precisas de uma memória com 4 leituras e 2 escritas por ciclo. Como a constróis com SRAMs de 1R1W?', 'Leituras: replicar (cada cópia serve 1 leitura). Escritas múltiplas: banking com tratamento de conflitos, ou LVT (live value table que indica qual banco tem o valor mais recente), ou XOR-based multiport. Ou flops se for pequena. Discutir área vs complexidade.');
IV('verif', 'Que propriedades formais escreverias para um árbitro?', 'Mutual exclusion: $onehot0(gnt). Grant só com pedido: gnt[i] |-> req[i]. Sem starvation: req[i] mantido |-> ##[1:N] gnt[i] (com fairness). Work-conserving: |req |-> |gnt (se o design o exige). Estabilidade em handshake: gnt mantém-se até done (se protocolo).');
IV('intv', 'Fala de um projeto do teu CV em 2 minutos, como numa entrevista.', 'Estrutura: objetivo e especificação (números: freq, área, throughput) → arquitetura (diagrama mental) → a decisão mais difícil e alternativas consideradas → como verificaste → resultado medido → o que melhorarias. Ensaiar em voz alta; preparar perguntas de seguimento sobre cada bloco.');
IV('coh', 'Duas threads em cores diferentes incrementam contadores diferentes, mas o desempenho é péssimo. Porquê?', 'False sharing: os contadores estão na mesma linha de cache; cada escrita invalida a cópia do outro core (MESI ping-pong). Solução: padding/alinhamento para linhas separadas.');
IV('noc', 'Quanta largura de banda de memória precisa um acelerador de 100 TFLOP/s com intensidade aritmética de 50 FLOP/byte?', 'BW = 100e12 / 50 = 2 TB/s. Modelo roofline: se a memória fornece menos, o kernel fica memory-bound; para usar menos BW, aumentar reutilização (tiling maior, cache/shared memory).');
IV('cg', 'Um colega usou "assign gclk = clk & en;" no RTL. O que lhe dizes?', 'Risco de glitch se en mudar com clk alto; problemas de STA/CTS (gating fora de células reconhecidas), DFT. Usar célula ICG da biblioteca (latch + AND) ou deixar a síntese inserir via enable; adicionar test_en.');
IV('synth', 'Que diferenças podem existir entre simulação RTL e simulação gate-level?', 'Sensitivity lists incompletas, X-optimism/pessimism, initial blocks ignorados, atrasos #, full_case/parallel_case pragmas, latches inferidos, races com blocking, sinais não inicializados que a síntese otimiza, problemas de reset. GLS com SDF apanha também timing e problemas de reset/X.');
IV('mult', 'Implementa um multiplicador 32×32 que tem de correr a 2 GHz. Opções?', 'Booth radix-4 (17 produtos parciais) + árvore Wallace/Dadda de CSAs + somador final rápido; pipelinar em 2–4 estágios (após a recodificação, a meio da árvore, antes/depois do somador final). Alternativa iterativa se throughput baixo for aceitável (área pequena).');
IV('le', 'Tens de conduzir uma carga 1000× maior que a entrada. Quantos inversores pões e porquê?', 'N ótimo ≈ log₄(1000) ≈ 5 (esforço por estágio ~4, entre 3 e 6 é quase igual). Com N par/ímpar escolhe-se conforme a polaridade necessária. Atraso ≈ N(F^{1/N} + p).');
IV('wire', 'Um sinal atravessa o chip inteiro (10 mm). Que problemas há e como o RTL deve lidar?', 'Atraso de fio enorme (vários ciclos a GHz), crosstalk, repetidores. O RTL deve inserir estágios de pipeline (flops de "transporte"), usar controlo por créditos e evitar handshakes combinacionais longos. Planeamento de floorplan com o físico.');
IV('dft', 'Porque é que DFT afeta o teu RTL?', 'Clock gating e resets precisam de controlo em modo teste (test_en, reset bypass); relógios gerados internamente precisam de mux para relógio de teste; latches e lógica assíncrona reduzem cobertura; memórias precisam de MBIST collars; evitar loops combinacionais.');
IV('ooo', 'O que é register renaming e porque elimina hazards WAR/WAW?', 'Cada escrita a um registo arquitetural recebe um registo físico novo (free list + RAT). Leitores antigos continuam a ler o físico antigo → WAR desaparece; duas escritas vão para físicos diferentes → WAW desaparece. Só RAW (verdadeiras dependências) ficam.');
IV('adders', 'Compara ripple-carry, carry-lookahead, carry-select e Kogge-Stone em área e atraso.', 'Ripple: área mínima, O(N). CLA em blocos: O(log N)/O(√N) consoante a estrutura. Carry-select: ~2× área na parte superior, O(√N) com blocos de tamanho crescente. Kogge-Stone: O(log N) com fan-out 2 mas muitos fios (N log N), muita área/potência. Brent-Kung: 2log N níveis, menos fios. Síntese escolhe pela restrição.');
IV('tb', 'O que é um scoreboard e um modelo de referência? Porque não basta olhar para ondas?', 'Modelo de referência: implementação comportamental (ex: em SV ou C) do comportamento esperado; scoreboard compara automaticamente saídas do DUT com o modelo. Ondas não escalam a milhões de ciclos e aleatoriedade; auto-verificação é o que permite regressões noturnas.');

/* ======================= PROJETOS ======================= */
const TOOLS = `<p class="muted small">Ferramentas grátis: <a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> (no browser), <a href="https://hdlbits.01xz.net/" target="_blank" rel="noopener">HDLBits</a>, Icarus Verilog + GTKWave, <a href="https://www.veripool.org/verilator/" target="_blank" rel="noopener">Verilator</a>, <a href="https://github.com/YosysHQ/yosys" target="_blank" rel="noopener">Yosys</a> (síntese), SymbiYosys (formal). Põe cada projeto no teu GitHub — é o teu portefólio.</p>`;
const PROJ = [];
const P = (title, size, parts, spec, check, sol) => PROJ.push({ title, size, parts, spec, check, sol });
P('MUX parametrizável N:1', 'Pequeno', ['Implementa e testa'], `<p>Cria <code>mux_n #(W, N)</code> com <code>in[N][W]</code>, <code>sel[$clog2(N)]</code>, <code>out[W]</code>. Testa com N=2, 4, 5 (não potência de 2!).</p>`, ['Funciona para N não potência de 2', 'Testbench compara com modelo para todos os sel', 'Viste o número de células em Yosys'], CODE(`
module mux_n #(parameter int W=8, N=4) (
  input  logic [N-1:0][W-1:0] in,
  input  logic [$clog2(N)-1:0] sel,
  output logic [W-1:0] out);
  always_comb out = (sel < N) ? in[sel] : '0;
endmodule`));
P('Decoder 3→8 e encoder de prioridade 8→3', 'Pequeno', ['Implementa e testa'], `<p>Decoder com enable. Encoder de prioridade (MSB ganha) com saída <code>valid</code>. Testa exaustivamente (256 entradas).</p>`, ['Teste exaustivo automático', 'Sem latches (verifica o relatório)', 'Versão com loop e versão com casez'], CODE(`
module prio_enc8 (input logic [7:0] x, output logic [2:0] idx, output logic valid);
  always_comb begin
    idx = '0; valid = |x;
    for (int i = 0; i < 8; i++) if (x[i]) idx = 3'(i); // o maior i ganha
  end
endmodule`));
P('Somador N bits com flags (C, V, N, Z)', 'Pequeno', ['Implementa e testa'], `<p>Somador/subtrator com <code>sub</code>: produz soma e flags carry, overflow, negativo e zero como num CPU.</p>`, ['Overflow correto em casos-limite (127+1, −128−1)', 'Teste aleatório contra $signed', 'Subtração via ~B + 1'], CODE(`
module addsub #(parameter int W=8) (input logic [W-1:0] a, b, input logic sub,
  output logic [W-1:0] s, output logic c, v, n, z);
  logic [W-1:0] bb; assign bb = sub ? ~b : b;
  assign {c, s} = a + bb + sub;
  assign v = (a[W-1] == bb[W-1]) && (s[W-1] != a[W-1]);
  assign n = s[W-1];  assign z = (s == '0);
endmodule`));
P('ALU de 8 bits', 'Pequeno', ['Implementa e testa'], `<p>Operações: ADD, SUB, AND, OR, XOR, SLL, SRL, SRA, SLT (com sinal), SLTU. Opcode de 4 bits.</p>`, ['Todas as operações testadas com modelo de referência', 'SRA preserva sinal', 'SLT vs SLTU diferem nos negativos'], CODE(`
typedef enum logic [3:0] {ADD,SUB,AND_,OR_,XOR_,SLL,SRL,SRA,SLT,SLTU} op_t;
always_comb unique case (op)
  ADD:  y = a + b;            SUB:  y = a - b;
  AND_: y = a & b;            OR_:  y = a | b;     XOR_: y = a ^ b;
  SLL:  y = a << b[2:0];      SRL:  y = a >> b[2:0];
  SRA:  y = $signed(a) >>> b[2:0];
  SLT:  y = {7'b0, $signed(a) < $signed(b)};
  SLTU: y = {7'b0, a < b};
  default: y = '0;
endcase`));
P('Contador up/down com load, enable e terminal count', 'Pequeno', ['Implementa e testa'], `<p>Contador de W bits: <code>load</code> tem prioridade sobre <code>en</code>; <code>up</code> escolhe o sentido; <code>tc</code> = 1 quando chega ao máximo (up) ou a 0 (down).</p>`, ['Prioridades corretas', 'Wrap-around testado', 'Assertion: load |=> q == $past(d)'], CODE(`
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n)     q <= '0;
  else if (load)  q <= d;
  else if (en)    q <= up ? q + 1'b1 : q - 1'b1;
assign tc = en && (up ? &q : ~|q);`));
P('Detetor de flancos (subida, descida, ambos)', 'Pequeno', ['Implementa e testa'], `<p>A partir de um sinal síncrono, gera pulsos de 1 ciclo em cada flanco.</p>`, ['Pulsos de exatamente 1 ciclo', 'Comportamento correto após reset'], CODE(`
always_ff @(posedge clk) d_q <= d;
assign rise = d & ~d_q;
assign fall = ~d & d_q;
assign any  = d ^ d_q;`));
P('Debouncer de botão + sincronizador', 'Pequeno', ['Implementa e testa'], `<p>Um botão mecânico salta durante ~5–20 ms. Sincroniza (2-FF), depois só aceita mudança se o valor ficar estável durante <code>N</code> ciclos. Gera também um pulso "pressionado".</p>`, ['Sincronizador antes do contador', 'Testbench com ressaltos aleatórios', 'Parametrizado em ms e frequência'], CODE(`
always_ff @(posedge clk) {s2, s1} <= {s1, btn};      // sync
always_ff @(posedge clk)
  if (s2 == state) cnt <= '0;
  else if (cnt == N-1) begin state <= s2; cnt <= '0; end
  else cnt <= cnt + 1'b1;
// press = flanco de subida de state`));
P('Gerador de tick (enable a cada N ciclos)', 'Pequeno', ['Implementa e testa'], `<p>Em vez de gerar relógios novos (mau em ASIC/FPGA), gera um <b>pulso de enable</b> a cada N ciclos. Usa-o para fazer um relógio de 1 Hz "lógico" a partir de 100 MHz.</p>`, ['Período exato de N ciclos', 'N parametrizável', 'Explicaste porque é melhor que dividir o relógio'], CODE(`
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) cnt <= '0;
  else        cnt <= (cnt == N-1) ? '0 : cnt + 1'b1;
assign tick = (cnt == N-1);`));
P('Divisor por 3 com 50% de duty cycle', 'Pequeno', ['Implementa e verifica a forma de onda'], `<p>A pergunta clássica. Usa um contador em posedge e um flop em negedge.</p>`, ['Período = 3 ciclos e duty = 50% medido no simulador', 'Saída sem glitches (só flops + OR)'], CODE(`
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) cnt <= '0; else cnt <= (cnt == 2) ? '0 : cnt + 1'b1;
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) a <= 0; else a <= (cnt == 2);  // alto 1 ciclo em 3
always_ff @(negedge clk or negedge rst_n)
  if (!rst_n) b <= 0; else b <= a;          // atrasado meio ciclo
assign clk_div3 = a | b;                    // 1,5 ciclos alto`));
P('Detetor de sequência 1011 (Mealy e Moore)', 'Pequeno', ['Mealy', 'Moore + comparação'], `<p>Com sobreposição. Faz as duas versões e compara latência e nº de estados numa waveform.</p>`, ['Sobreposição testada com 1011011', 'Moore tem 1 ciclo a mais de latência', 'Testbench com modelo baseado em shift register'], CODE(`
// Modelo de referência simples para o testbench:
always_ff @(posedge clk) sh <= {sh[2:0], x};
assign ref_det = ({sh[2:0], x} == 4'b1011);   // Mealy-equivalente`));
P('LFSR de 8 bits + verificador PRBS', 'Pequeno', ['Implementa e testa'], `<p>LFSR de comprimento máximo (taps 8,6,5,4). Verifica que percorre 255 estados. Faz um checker que deteta erros num stream PRBS.</p>`, ['255 estados distintos antes de repetir', 'Checker sincroniza e conta erros', 'Versão Galois vs Fibonacci'], CODE(`
always_ff @(posedge clk)
  if (!rst_n) q <= 8'h01;
  else        q <= {q[6:0], q[7] ^ q[5] ^ q[4] ^ q[3]};`));
P('Binário↔Gray e contador Gray', 'Pequeno', ['Implementa e testa'], `<p><code>bin2gray</code>, <code>gray2bin</code> (parametrizados) e um contador que conta em Gray. Verifica que só 1 bit muda por incremento (assertion com <code>$countones</code>).</p>`, ['Round-trip bin→gray→bin = identidade', 'Assertion de 1 bit por passo'], CODE(`
assign g = b ^ (b >> 1);
always_comb begin
  bo[W-1] = gi[W-1];
  for (int i = W-2; i >= 0; i--) bo[i] = bo[i+1] ^ gi[i];
end
// assert property (@(posedge clk) $countones(g ^ $past(g)) == 1);`));
P('Popcount e leading-zero count de 32 bits', 'Médio', ['Versão comportamental', 'Versão em árvore + comparação em Yosys'], `<p>Duas implementações de cada: loop simples e árvore explícita. Compara profundidade lógica e área em Yosys (<code>stat</code>, <code>ltp</code>).</p>`, ['Equivalência verificada com teste aleatório', 'Números de área/profundidade anotados no README'], CODE(`
// popcount comportamental (a síntese faz uma árvore de somadores)
always_comb begin cnt = '0; for (int i=0;i<32;i++) cnt += x[i]; end
// LZC comportamental
always_comb begin lz = 6'd32; for (int i=0;i<32;i++) if (x[i]) lz = 6'(31-i); end`));
P('Register file 2R1W com bypass', 'Médio', ['Implementa', 'Bypass + testes'], `<p>32 registos × 32 bits, x0 sempre zero (como RISC-V). Leitura combinacional, escrita síncrona, <b>bypass</b>: se ler o registo a ser escrito no mesmo ciclo, devolve o valor novo.</p>`, ['x0 sempre 0', 'Bypass testado', 'Sem escrita quando we=0'], CODE(`
logic [31:0] rf [32];
always_ff @(posedge clk) if (we && wa != 0) rf[wa] <= wd;
assign rd1 = (ra1 == 0) ? '0 : (we && wa == ra1) ? wd : rf[ra1];
assign rd2 = (ra2 == 0) ? '0 : (we && wa == ra2) ? wd : rf[ra2];`));
P('FIFO síncrono + testbench com scoreboard', 'Médio', ['RTL', 'Testbench aleatório + assertions'], `<p>FIFO parametrizado (W, D). Testbench com fila SV como modelo, 100k operações aleatórias, assertions de overflow/underflow, cobertura de cheio/vazio.</p>`, ['Ponteiros com bit extra', 'Scoreboard com q[$]', 'Atingiu cheio e vazio', 'Push+pop simultâneos testados'], CODE(`
// Testbench (excerto)
logic [W-1:0] model[$];
always @(posedge clk) if (rst_n) begin
  if (rd_en && !empty) begin
    assert (rdata == model[0]) else $error("mismatch");
    void'(model.pop_front());
  end
  if (wr_en && !full) model.push_back(wdata);
end`));
P('Árbitro round-robin parametrizável', 'Médio', ['RTL', 'Verificação (formal ou aleatória)'], `<p>N requisitantes, grant one-hot, round-robin com máscara. Propriedades: onehot0(gnt), gnt ⊆ req, sem starvation.</p>`, ['Assertions escritas', 'Sem starvation em teste de stress', 'Funciona para N=1'], CODE(`
logic [N-1:0] mask, m_req, g_m, g_u;
assign m_req = req & mask;
assign g_m = m_req & (~m_req + 1'b1);
assign g_u = req   & (~req   + 1'b1);
assign gnt = (|m_req) ? g_m : g_u;
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) mask <= '1;
  else if (|gnt) mask <= ~((gnt << 1) - 1'b1);`));
P('Sincronizador 2-FF e pulse synchronizer', 'Pequeno', ['Implementa e testa com 2 relógios'], `<p>Testbench com dois relógios não relacionados (ex: 100 MHz e 37 MHz). Envia pulsos espaçados e confirma que cada um gera exatamente 1 pulso no destino.</p>`, ['Toggle na origem', 'Deteção de flanco no destino', 'Teste com pulsos demasiado próximos mostra a limitação'], CODE(`
// origem
always_ff @(posedge clk_a) if (pulse_a) tog <= ~tog;
// destino
always_ff @(posedge clk_b) {t3, t2, t1} <= {t2, t1, tog};
assign pulse_b = t3 ^ t2;`));
P('Registo valid/ready e skid buffer', 'Médio', ['Pipeline register', 'Skid buffer com ready registado'], `<p>Implementa ambos. Testbench com valid e ready aleatórios; verifica que nenhum dado se perde/duplica e que o skid buffer tem throughput 1/ciclo.</p>`, ['Assertion: valid && !ready |=> valid && $stable(data)', 'Throughput medido', 'ready_up do skid vem direto de flop'], CODE(`
// skid buffer: ready_up sai diretamente de um flop
assign ready_up = !skid_v;
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) begin out_v <= 0; skid_v <= 0; end
  else if (!out_v || ready_dn) begin           // saída livre ou a esvaziar
    if (skid_v) begin out_d <= skid_d; out_v <= 1; skid_v <= 0; end
    else        begin out_d <= data_up; out_v <= valid_up; end
  end
  else if (valid_up && ready_up) begin          // saída parada: guarda no skid
    skid_d <= data_up; skid_v <= 1;
  end`));
P('Gerador PWM', 'Pequeno', ['Implementa e testa'], `<p>PWM de 8 bits com duty programável; o novo duty só tem efeito no início do período (sem glitches).</p>`, ['Duty 0% e 100% corretos', 'Atualização sincronizada com o período'], CODE(`
always_ff @(posedge clk) begin
  cnt <= cnt + 1'b1;
  if (cnt == '1) duty_q <= duty;      // atualiza no fim do período
end
assign pwm = (cnt < duty_q);`));
P('UART TX', 'Médio', ['Implementa e testa'], `<p>8N1, baud configurável (ex: 115200 a 50 MHz). Interface valid/ready do lado do utilizador.</p>`, ['Start, 8 bits LSB-first, stop', 'Baud rate medido na simulação', 'Ready só quando livre'], CODE(`
// estados: IDLE -> START -> DATA(8) -> STOP
always_ff @(posedge clk) if (tick) case (st)
  IDLE:  if (v) begin sh <= d; st <= START; end
  START: begin tx <= 0; st <= DATA; n <= 0; end
  DATA:  begin tx <= sh[0]; sh <= sh >> 1; if (n==7) st <= STOP; n <= n+1; end
  STOP:  begin tx <= 1; st <= IDLE; end
endcase`));
P('UART RX com oversampling 16×', 'Médio', ['Sincronização + deteção de start', 'Amostragem a meio do bit + testes'], `<p>Sincroniza a entrada, deteta flanco de start, confirma a meio do bit, amostra cada bit no centro (contagem 8 de 16). Liga ao teu TX em loopback.</p>`, ['Loopback TX→RX com 1000 bytes aleatórios', 'Tolerância a ±2% de erro de baud testada', 'Erro de framing detetado'], '');
P('SPI master (modo 0)', 'Médio', ['Implementa e testa com um slave modelo'], `<p>CPOL=0, CPHA=0, SCLK = clk/(2·DIV), transferência de 8 bits full-duplex.</p>`, ['MOSI muda no flanco descendente, MISO amostrado no ascendente', 'CS ativo durante toda a transferência'], '');
P('FIFO assíncrono (Cummings)', 'Grande', ['Ponteiros Gray e sincronizadores', 'Lógica de full/empty', 'Testbench com 2 relógios e stress', 'Restrições SDC e revisão CDC'], `<p>O projeto de CDC mais pedido em entrevistas. Segue o paper <a href="http://www.sunburst-design.com/papers/CummingsSNUG2002SJ_FIFO1.pdf" target="_blank" rel="noopener">Cummings SNUG 2002</a>. Testa com relógios 100 MHz/33 MHz e vice-versa, e taxas aleatórias.</p>`, ['Ponteiros binários + Gray registados', 'empty no domínio de leitura, full no de escrita', 'Scoreboard sem perdas em 1M transferências', 'Explicaste por escrito cada decisão (como numa entrevista)'], CODE(`
// domínio de escrita
assign wbin_n  = wbin + (winc & ~wfull);
assign wgray_n = (wbin_n >> 1) ^ wbin_n;
always_ff @(posedge wclk or negedge wrst_n)
  if (!wrst_n) {wbin, wptr} <= '0; else {wbin, wptr} <= {wbin_n, wgray_n};
assign wfull_n = (wgray_n == {~wq2_rptr[AW:AW-1], wq2_rptr[AW-2:0]});
always_ff @(posedge wclk or negedge wrst_n)
  if (!wrst_n) wfull <= 0; else wfull <= wfull_n;
// domínio de leitura (simétrico)
assign rempty_n = (rgray_n == rq2_wptr);`));
P('FSM de semáforo com botão de peões', 'Pequeno', ['Implementa e testa'], `<p>Estados com temporizador, pedido de peões registado e debounced, estado seguro após reset.</p>`, ['Saídas Moore', 'Pedido memorizado até ser servido', 'Tempo mínimo de verde para carros'], '');
P('Multiplicador sequencial shift-and-add', 'Médio', ['Implementa e testa'], `<p>Multiplicador 16×16 que demora 16 ciclos, interface start/done. Compara área com o <code>*</code> combinacional em Yosys.</p>`, ['Resultado de 32 bits correto em teste aleatório', 'Comparação de área anotada'], CODE(`
// a cada ciclo: if (b[0]) acc += a_shifted; a_shifted <<= 1; b >>= 1;`));
P('MAC pipelinado e produto interno de 4 elementos', 'Médio', ['MAC com 2 estágios', 'Produto interno com árvore de somas'], `<p>Multiply-accumulate com valid em pipeline. Depois, produto interno de vetores de 4 (4 multiplicadores + árvore de somadores), 1 resultado/ciclo.</p>`, ['Valid acompanha os dados', 'Latência documentada', 'Overflow/largura de acumulador pensados'], '');
P('Systolic array para multiplicação de matrizes', 'Grande', ['PE (MAC) e fluxo de dados', 'Array 2×2 com skew de entradas', 'Generalizar para N×N', 'Testbench vs modelo e medir ciclos'], `<p>Output-stationary: A flui para a direita, B para baixo, cada PE acumula. Generaliza para 4×4 e 8×8 com <code>generate</code>. Mede ciclos para matrizes N×N.</p>`, ['Skew correto das entradas', 'Resultado igual ao modelo em 100 matrizes aleatórias', 'Ciclos = 3N−2 (+ latência)'], CODE(`
module pe #(W=8, A=24) (input clk, rst, input [W-1:0] a_in, b_in,
  output logic [W-1:0] a_out, b_out, output logic [A-1:0] acc);
  always_ff @(posedge clk)
    if (rst) begin acc <= '0; a_out <= '0; b_out <= '0; end
    else begin acc <= acc + a_in * b_in; a_out <= a_in; b_out <= b_in; end
endmodule`));
P('RISC-V RV32I single-cycle', 'Grande', ['Datapath: PC, register file, ALU', 'Decoder e imediatos', 'Loads/stores e branches', 'JAL/JALR/LUI/AUIPC', 'Correr programas (riscv-tests)'], `<p>Implementa o subconjunto RV32I. Usa o <a href="https://riscv.org/technical/specifications/" target="_blank" rel="noopener">manual oficial RISC-V</a> e o capítulo 7 de Harris & Harris (edição RISC-V). Corre os <a href="https://github.com/riscv-software-src/riscv-tests" target="_blank" rel="noopener">riscv-tests</a>.</p>`, ['Todos os formatos de imediato (I,S,B,U,J)', 'Passa riscv-tests rv32ui', 'Corre um programa C compilado com GCC'], '');
P('RISC-V pipeline de 5 estágios', 'Grande', ['Registos de pipeline', 'Forwarding', 'Hazard load-use (stall)', 'Branches (flush) + preditor simples', 'Medir CPI em benchmarks'], `<p>Evolui o single-cycle para 5 estágios. Mede o CPI e o impacto de um preditor bimodal.</p>`, ['Forwarding EX/MEM e MEM/WB', 'Stall load-use', 'CPI medido e reportado'], '');
P('Controlador de cache direct-mapped write-back', 'Grande', ['Arrays tag/valid/dirty/data', 'FSM: compare, write-back, allocate', 'Testes vs modelo de memória'], `<p>Cache de 4 KB, linhas de 16 B, entre um CPU (valid/ready) e uma memória lenta (latência configurável).</p>`, ['Hits em 1 ciclo', 'Linhas sujas escritas antes de substituir', 'Hit rate medido em padrões de acesso'], '');
P('Bloco de registos AXI4-Lite slave', 'Médio', ['Canais de escrita (AW, W, B)', 'Canais de leitura (AR, R) + teste'], `<p>8 registos de 32 bits mapeados em memória, com WSTRB. AW e W podem chegar em qualquer ordem.</p>`, ['Handshakes conforme a especificação', 'WSTRB respeitado', 'AW antes de W e W antes de AW testados'], '');
P('CRC-8 série e paralelo', 'Pequeno', ['Implementa e testa'], `<p>Polinómio x⁸+x²+x+1 (CRC-8-ATM). Versão bit-série (LFSR) e versão byte-paralela (gerada desenrolando o loop). Verifica que dão o mesmo.</p>`, ['Vetores de teste conhecidos', 'Série = paralelo'], CODE(`
function automatic logic [7:0] crc8_byte(logic [7:0] crc, logic [7:0] d);
  for (int i = 7; i >= 0; i--) begin
    logic fb = crc[7] ^ d[i];
    crc = {crc[6:0], 1'b0} ^ (fb ? 8'h07 : 8'h00);
  end
  return crc;
endfunction`));
P('Ligação com controlo de fluxo por créditos', 'Médio', ['Emissor e recetor', 'Atraso de ligação configurável + medição de throughput'], `<p>Emissor com contador de créditos, recetor com FIFO e devolução de créditos, ligação com L ciclos de atraso (shift registers). Mede throughput vs nº de buffers e confirma throughput = min(1, B/RTT).</p>`, ['Nunca transborda', 'Gráfico throughput vs buffers'], '');
P('Escalonador de warps simplificado', 'Médio', ['Implementa e testa'], `<p>8 warps, cada um com bit <code>ready</code> (operandos prontos) e <code>stalled</code> (à espera de memória com latência aleatória). Em cada ciclo, emite 1 warp por round-robin (ou "greedy-then-oldest"). Mede a utilização da unidade de execução em função do nº de warps.</p>`, ['Utilização sobe com mais warps (latency hiding)', 'Comparaste duas políticas'], '');
P('Filtro FIR de 4 taps em vírgula fixa', 'Médio', ['Implementa e testa com Python/modelo'], `<p>Entradas Q1.15, coeficientes programáveis, saída com arredondamento e saturação. Gera vetores de teste num script (Python/NumPy) e compara.</p>`, ['Saturação correta', 'Erro ≤ 1 LSB vs modelo'], '');

/* Expande projetos em partes diárias */
const PSCHED = []; PROJ.forEach((p, pi) => p.parts.forEach((part, k) => PSCHED.push({ pi, k })));
const VARS = ['Primeira implementação: faz funcionar e testa.', 'Variante: torna tudo parametrizável e escreve um testbench auto-verificável com ≥10 000 vetores aleatórios.', 'Variante: acrescenta assertions SVA (protocolo, invariantes) e cobertura funcional.', 'Variante: sintetiza com Yosys, reporta área e níveis lógicos; otimiza um deles 20%.', 'Variante: prepara-o como numa entrevista — explica a microarquitetura em voz alta em 5 min, depois reescreve-o do zero sem consultar em ≤ 30 min.', 'Variante: faz pipelining para duplicar a frequência; documenta latência/throughput.', 'Variante: verificação formal (SymbiYosys) das propriedades principais.', 'Variante: reduz potência (clock gating, operand isolation) e justifica.', 'Variante: escreve uma spec de 1 página (interface, waveforms, casos-limite) antes de recodificar.', 'Variante: code review — pede a alguém (ou a um LLM) para rever e corrige tudo; põe no GitHub com README.'];
COURSE.extra = (d, cyc) => {
  const rep = Math.floor((d - 1) / PSCHED.length), it = PSCHED[(d - 1) % PSCHED.length], p = PROJ[it.pi];
  const v = VARS[rep % VARS.length];
  return {
    kind: 'Projeto', icon: '🛠', title: p.title + (p.parts.length > 1 ? ` (parte ${it.k + 1}/${p.parts.length})` : ''), size: p.size,
    sub: `${p.size} · ${p.parts[it.k]}`,
    html: `<p><b>Hoje:</b> ${p.parts[it.k]}</p>${p.spec}<div class="key">${v}</div>${TOOLS}`,
    checklist: p.check.concat(rep ? [VARS[rep % VARS.length].replace('Variante: ', '')] : []),
    solution: p.sol ? p.sol + '<p class="muted small">Solução de referência (excerto). Há sempre mais de uma resposta certa — compara as decisões.</p>' : '',
  };
};
