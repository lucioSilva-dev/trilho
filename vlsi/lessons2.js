/* Silício 1000 — currículo (parte 2) */
/* ======================= U3 — MICROARQUITETURA RTL ======================= */
const U3 = 'U3 · Microarquitetura RTL (núcleo das entrevistas)';
L('hs', U3, 'Handshake valid/ready e skid buffer', [S_.EECS151, SRC('ARM AMBA AXI spec (regras de handshake)', 'https://developer.arm.com/documentation/ihi0022/latest')], [
  T('A transferência', `<p>O produtor levanta <code>valid</code> com <code>data</code>; o consumidor levanta <code>ready</code>. Há transferência no flanco em que <b>valid && ready</b>.</p><div class="key">Regras (estilo AXI): (1) depois de levantar <code>valid</code>, o produtor <b>não</b> o pode baixar nem mudar <code>data</code> até ao handshake; (2) <code>valid</code> <b>não pode depender combinacionalmente de</b> <code>ready</code> (evita loops combinacionais e deadlock); <code>ready</code> pode depender de <code>valid</code>.</div>`),
  T('Skid buffer', `<p>Num pipeline longo, <code>ready</code> atravessa todos os estágios para trás combinacionalmente → caminho crítico. Um <b>skid buffer</b> regista <code>ready</code>: como o upstream só vê o "não estou pronto" um ciclo depois, precisa de <b>uma entrada extra</b> para guardar o dado que já vinha a caminho. Resultado: throughput total (1 por ciclo) com <code>ready</code> registado.</p>`),
  Q('Num ciclo: valid=1, ready=0. No ciclo seguinte o produtor pode:', ['Manter valid=1 e o mesmo data', 'Baixar valid', 'Mudar data mantendo valid', 'Qualquer uma'], 0, 'Até haver handshake, valid e data têm de ficar estáveis.'),
  Q('Quantas entradas de armazenamento tem um skid buffer completo (throughput 1/ciclo, ready registado)?', ['2', '1', '0', '4'], 0, 'Registo principal + registo "skid".'),
], [
  TF('O consumidor pode esperar por valid antes de levantar ready.', true, 'É permitido; o inverso (produtor esperar ready para levantar valid) não.'),
  Q('Um pipeline de 4 estágios valid/ready sem skid buffers, com ready propagado combinacionalmente para trás, tem:', ['Um caminho combinacional de ready que atravessa os 4 estágios', 'Latência de 8 ciclos', 'Throughput de 1/2', 'Deadlock garantido'], 0, ''),
  Q('Um "half-buffer" (1 entrada, ready registado) consegue throughput de:', ['1 transferência a cada 2 ciclos', '1 por ciclo', '2 por ciclo', '0'], 0, 'Daí precisar de 2 entradas para throughput total.'),
  OPEN('Escreve (descreve) a lógica de um registo de pipeline valid/ready com throughput total e ready combinacional.', '<code>ready_up = !valid_q || ready_dn;</code> (posso aceitar se estou vazio ou se o meu dado está a sair). <code>if (ready_up) begin valid_q <= valid_up; data_q <= data_up; end</code>. Data pode não ter reset; valid_q sim. <code>valid_dn = valid_q</code>.'),
]);
L('fifo', U3, 'FIFO síncrono: ponteiros, cheio e vazio', [S_.CUM, S_.EECS151], [
  T('Ponteiros com um bit extra', `<p>Para profundidade D (potência de 2), usa ponteiros de <b>log₂D + 1</b> bits. Os bits baixos indexam a memória; o MSB extra indica "voltas".</p><ul><li><b>Vazio</b>: <code>wptr == rptr</code></li><li><b>Cheio</b>: MSBs diferentes e o resto igual</li></ul>` + CODE(`
assign empty = (wptr == rptr);
assign full  = (wptr[AW] != rptr[AW]) && (wptr[AW-1:0] == rptr[AW-1:0]);
always_ff @(posedge clk) if (wr_en && !full) mem[wptr[AW-1:0]] <= wdata;
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) begin wptr <= '0; rptr <= '0; end
  else begin
    if (wr_en && !full)  wptr <= wptr + 1'b1;
    if (rd_en && !empty) rptr <= rptr + 1'b1;
  end
assign rdata = mem[rptr[AW-1:0]];   // leitura "first-word fall-through"`)),
  Q('FIFO com D=8: wptr=4\'b1011, rptr=4\'b0011. Estado?', ['Cheio', 'Vazio', 'Nem cheio nem vazio', 'Erro'], 0, 'MSBs diferem, bits baixos iguais (011).'),
  G('g_fifoptr'),
], [
  Q('Alternativa ao bit extra para distinguir cheio/vazio:', ['Um contador de ocupação (0..D) ou um flag de "última operação foi escrita"', 'Usar D+1 posições de memória sempre', 'Gray code', 'Não há'], 0, 'Contador precisa $clog2(D+1) bits.'),
  TF('Num FIFO síncrono, os ponteiros devem ser convertidos para Gray code.', false, 'Gray é necessário no FIFO <b>assíncrono</b> (CDC), não no síncrono.'),
  Q('Push e pop simultâneos num FIFO cheio (sem bypass): o que deve acontecer?', ['Depende da especificação — o comum é bloquear o push (full) e fazer o pop', 'Ambos falham', 'Os dados corrompem-se sempre', 'O FIFO fica vazio'], 0, 'Alguns designs permitem push quando full && pop (cuidado com o caminho combinacional).'),
  OPEN('Pergunta de entrevista: como implementas um FIFO cuja profundidade NÃO é potência de 2 (ex: 6)?', 'Ponteiros que dão a volta explicitamente (<code>if (ptr==D-1) ptr<=0; else ptr<=ptr+1;</code>) mais um contador de ocupação para full/empty (ou um bit de "volta" que alterna em cada wrap). No caso assíncrono é mais delicado: Gray code só funciona para sequências de comprimento par com codificação simétrica (ex: retirar estados do meio de um Gray maior).'),
]);
L('fifodepth', U3, 'Dimensionamento de FIFOs (pergunta clássica)', [SRC('Comportamento de rajadas — análise clássica de entrevistas de ASIC', 'https://www.chipverify.com/verilog/verilog-fifo-depth'), S_.CUM], [
  T('A ideia', `<p>O FIFO absorve a diferença entre o que entra e o que sai <b>durante uma rajada</b>. Se o escritor escreve B palavras ao ritmo f<sub>w</sub> e o leitor lê a f<sub>r</sub> &lt; f<sub>w</sub>:</p><p><code>tempo da rajada = B / f<sub>w</sub></code><br><code>lidas nesse tempo = B · f<sub>r</sub> / f<sub>w</sub></code><br><b><code>profundidade = B − B · f<sub>r</sub>/f<sub>w</sub></code></b></p><p>Com taxas de "1 dado a cada k ciclos", multiplica a frequência pela taxa efetiva.</p>`),
  T('Exemplo resolvido', `<p>Escrita a 100 MHz, rajada de 120 palavras, leitura a 80 MHz (1 por ciclo).</p><p>Tempo = 120/100 MHz = 1,2 µs. Lidas = 1,2 µs × 80 MHz = 96. Profundidade = 120 − 96 = <b>24</b>.</p><div class="warn">Caso pior "back-to-back": se o enunciado diz "80 escritas em cada 100 ciclos", o pior caso é 2 rajadas encostadas (as últimas 80 de um período e as primeiras 80 do seguinte) → rajada efetiva de 160. Em CDC acrescenta-se margem pela latência dos sincronizadores.</div>`),
  G('g_fifodepth'),
], [G('g_fifodepth'), G('g_fifodepth'),
  TF('Se a taxa de leitura média for menor que a de escrita média de forma contínua, nenhum FIFO finito chega.', true, 'O FIFO só resolve diferenças temporárias (rajadas).'),
  Q('Escrita: 1 palavra/ciclo a 200 MHz, rajada 100. Leitura: 1 palavra a cada 2 ciclos a 200 MHz. Profundidade?', ['50', '100', '25', '75'], 0, 'Lidas durante a rajada (0,5 µs): 0,5 µs × 100 M palavras/s = 50 → 100 − 50 = 50.'),
]);
L('meta', U3, 'Metastabilidade e o sincronizador de 2 flops', [S_.CUM, S_.WH, S_.RAB], [
  T('O que é', `<p>Se D muda dentro da janela setup/hold, o flop pode ficar num nível intermédio e demorar um tempo <b>não limitado</b> a resolver para 0 ou 1. Probabilidade de ainda não ter resolvido após t: <code>∝ e<sup>−t/τ</sup></code>.</p><p><b>MTBF</b> = <code>e<sup>t<sub>r</sub>/τ</sup> / (T<sub>0</sub> · f<sub>clk</sub> · f<sub>data</sub>)</code>, onde t<sub>r</sub> é o tempo dado para resolver (≈ um período no 2-FF sync).</p>`),
  T('Sincronizador 2-FF', CODE(`
(* ASYNC_REG = "TRUE" *) logic s1, s2;   // atributo para FPGA; em ASIC: células sync dedicadas
always_ff @(posedge clk_dst or negedge rst_n)
  if (!rst_n) {s2, s1} <= '0;
  else        {s2, s1} <= {s1, async_in};`) + `<p>O 1.º flop pode ficar metastável; tem um ciclo inteiro para resolver antes do 2.º amostrar. Cada flop extra multiplica o MTBF por <code>e<sup>T/τ</sup></code> — em clocks muito rápidos usam-se 3.</p><div class="key">Só serve para <b>1 bit</b> (ou bits independentes) e o sinal deve vir <b>de um flop</b> do domínio de origem, e durar o suficiente para ser visto.</div>`),
  Q('Porque é que não se pode sincronizar um barramento de 8 bits binário com 8 sincronizadores 2-FF independentes?', ['Bits diferentes podem resolver em ciclos diferentes → valor intermédio incoerente', 'Gasta muitos flops', 'Os flops ficariam todos metastáveis', 'Pode-se, sem problema'], 0, 'Ex: 0111→1000, o destino pode ver 1111 ou 0000 durante um ciclo.'),
], [
  TF('Adicionar um 3.º flop ao sincronizador aumenta o MTBF exponencialmente.', true, ''),
  Q('Um pulso de 1 ciclo de um domínio de 500 MHz para um de 100 MHz, por 2-FF:', ['Pode ser perdido — usa um toggle/pulse synchronizer ou handshake', 'É sempre visto', 'É visto duas vezes', 'Fica metastável para sempre'], 0, 'O destino pode nunca amostrar o pulso.'),
  Q('τ (tau) depende de:', ['Ganho/capacidade do laço de realimentação do flop (tecnologia)', 'Frequência dos dados', 'Profundidade do FIFO', 'Skew'], 0, ''),
  G('g_mtbf'),
]);
L('cdc', U3, 'CDC multi-bit: Gray code, FIFO assíncrono, handshake', [S_.CUM, SRC('Cummings — Simulation and Synthesis Techniques for Asynchronous FIFO Design (SNUG 2002)', 'http://www.sunburst-design.com/papers/CummingsSNUG2002SJ_FIFO1.pdf')], [
  T('Técnicas', `<ul><li><b>Gray code</b>: só 1 bit muda por incremento → se o destino amostrar a meio, vê o valor antigo ou o novo (ambos válidos). Base do FIFO assíncrono.</li><li><b>MCP / handshake</b>: envia dado estável + um sinal de controlo sincronizado (req/ack). O dado não precisa de sincronizador porque está estável quando é lido.</li><li><b>Pulse synchronizer</b>: converte o pulso em toggle, sincroniza o toggle, deteta flanco do outro lado.</li><li><b>FIFO assíncrono</b>: para débito contínuo.</li></ul>`),
  T('FIFO assíncrono (Cummings)', `<p>Ponteiros em binário para endereçar, convertidos em <b>Gray</b> (<code>g = b ^ (b>>1)</code>) e sincronizados para o outro domínio com 2-FF.</p><ul><li><b>empty</b> calcula-se no domínio de leitura: <code>rgray_next == wgray_sync</code>.</li><li><b>full</b> no domínio de escrita: Gray de escrita igual ao Gray de leitura sincronizado com os <b>2 MSBs invertidos</b>.</li></ul><p>Os flags são <b>pessimistas</b> (atrasados), logo seguros: pode dizer "cheio" quando já há espaço, nunca o contrário.</p>`),
  G('g_gray'),
  Q('Porque é que full é calculado no domínio de escrita?', ['Porque é o escritor que precisa de parar já; e o ponteiro de leitura sincronizado só pode estar atrasado (pessimista)', 'Porque é mais rápido', 'Por convenção apenas', 'Para poupar flops'], 0, ''),
], [
  Q('Converte o binário 0110 em Gray:', ['0101', '0110', '0011', '0100'], 0, '0110 ^ 0011 = 0101.'),
  TF('No FIFO assíncrono, a profundidade deve ser potência de 2 (com Gray simples).', true, 'Para o Gray dar a volta mantendo a propriedade de 1 bit.'),
  Q('Num handshake req/ack de 4 fases, quantas travessias de sincronizador por transferência?', ['4', '2', '1', '8'], 0, 'req↑, ack↑, req↓, ack↓. Em 2 fases (toggle) são 2.'),
  OPEN('Pergunta de entrevista (muito comum em empresas de GPU): "Desenha um FIFO assíncrono. Explica cada decisão."', 'Memória dual-port; ponteiros binários de AW+1 bits em cada domínio; conversão para Gray registada; sincronizadores 2-FF cruzados; empty no domínio de leitura comparando Gray; full no domínio de escrita comparando com os 2 MSBs invertidos; flags registados; resets sincronizados por domínio; profundidade potência de 2; restrições: set_max_delay/skew entre bits do Gray (e não false_path puro), verificação CDC estrutural (Spyglass CDC/Questa CDC). Flags pessimistas = seguros, custo: latência de ~2–3 ciclos.'),
]);
L('arb', U3, 'Árbitros: prioridade fixa e round-robin', [S_.DALLY, S_.EECS151], [
  T('Prioridade fixa', `<p>Grant para o pedido de menor índice: <code>gnt = req & (~req + 1)</code> (isola o LSB a 1). Simples, mas pode causar <b>starvation</b> dos pedidos de baixa prioridade.</p>`),
  T('Round-robin', `<p>O último servido passa a ter a <b>menor</b> prioridade. Implementação clássica com máscara:</p>` + CODE(`
// mask: bits acima do último grant
masked     = req & mask;
gnt_masked = masked & (~masked + 1);
gnt_raw    = req    & (~req    + 1);
gnt        = |masked ? gnt_masked : gnt_raw;
always_ff @(posedge clk)
  if (|gnt) mask <= ~((gnt << 1) - 1);  // bits acima do vencedor`) + `<p>Garante <b>fairness</b>: cada requisitante espera no máximo N−1 grants.</p>`),
  Q('Árbitro RR com 4 clientes, último grant foi ao cliente 2, req=4\'b0101. Próximo grant?', ['Cliente 0', 'Cliente 2', 'Cliente 3', 'Nenhum'], 0, 'Procura a partir de 3: cliente 3 não pede; dá a volta → cliente 0.'),
], [
  Q('req = 8\'b0110_1000 num árbitro de prioridade fixa (LSB ganha). Grant?', ['8\'b0000_1000', '8\'b0100_0000', '8\'b0110_1000', '8\'b0010_0000'], 0, ''),
  TF('Um árbitro de prioridade fixa pode deixar um cliente à espera para sempre.', true, 'Starvation.'),
  Q('Árbitro com pesos (weighted round robin) serve para:', ['Dar fatias de largura de banda diferentes a cada cliente', 'Reduzir latência para zero', 'Eliminar o mask', 'Evitar metastabilidade'], 0, ''),
  OPEN('Como escalarias um árbitro round-robin para 64 clientes a 2 GHz?', 'O caminho crítico é a cadeia de prioridade (O(N)). Usar árvore de prefixo (lookahead, como somadores paralelos) → O(log N); arbitragem hierárquica (8 grupos de 8, RR em cada nível); ou pipeline do árbitro (aceitando um ciclo de latência e lidando com pedidos que caem). Trade-off: fairness exata vs aproximada.'),
]);
L('pipe', U3, 'Pipelining, latência vs throughput e retiming', [S_.HH, S_.EECS151, S_.HP], [
  T('Cortar para acelerar', `<p>Dividir lógica de atraso t em k estágios: período ≈ <code>t/k + t<sub>cq</sub> + t<sub>setup</sub></code> (overhead por estágio). Throughput sobe ~k×, mas <b>latência</b> total sobe (mais overhead) e há mais flops/potência.</p><p><b>Retiming</b>: mover registos através da lógica para equilibrar estágios sem mudar o comportamento I/O. A síntese faz isto automaticamente se permitido.</p>`),
  G('g_pipe'),
  Q('Lógica de 2 ns, overhead do flop 0,2 ns. Com 4 estágios iguais, f<sub>max</sub> ≈ ', ['1,43 GHz', '2 GHz', '0,5 GHz', '1 GHz'], 0, 'Período = 0,5 + 0,2 = 0,7 ns → 1,43 GHz.'),
], [
  TF('Pipelining reduz a latência de uma única operação.', false, 'Aumenta-a (ligeiramente); melhora o throughput.'),
  Q('Pipelining com feedback (ex: acumulador) é difícil porque:', ['O resultado do ciclo anterior é necessário já no seguinte — o laço não pode ter mais registos sem mudar a função', 'Os flops não suportam', 'Precisa de reset assíncrono', 'O STA não analisa'], 0, 'Técnicas: múltiplos acumuladores intercalados, carry-save.'),
  Q('Num pipeline com stall, o que deve acontecer aos estágios a montante?', ['Também param (back-pressure) para não perder dados', 'Continuam', 'Fazem reset', 'Duplicam dados'], 0, ''),
  G('g_pipe'),
]);
L('cg', U3, 'Clock gating e estratégia de relógios', [S_.WH, SRC('Synopsys/Cadence app notes sobre ICG (conceitos)', 'https://en.wikipedia.org/wiki/Clock_gating')], [
  T('Porque desligar o relógio', `<p>A árvore de relógio pode consumir 30–40% da potência dinâmica de um chip. <b>Clock gating</b> desliga o relógio de flops que não mudam (equivalente ao enable).</p><p>Nunca com um AND simples: um enable que muda com CLK=1 cria <b>glitches</b>. A célula <b>ICG</b> (Integrated Clock Gate) usa um <b>latch</b> transparente em CLK baixo + AND:</p>` + CODE(`
// comportamento de uma ICG (na prática instancia-se a célula da biblioteca)
always_latch if (!clk) en_l = en | test_en;
assign gclk = clk & en_l;`)),
  Q('Porque é que a ICG usa um latch transparente com CLK baixo?', ['Para o enable só poder mudar quando CLK=0, evitando glitches no gclk', 'Para poupar área', 'Para atrasar o relógio', 'Para fazer reset'], 0, ''),
], [
  TF('Ferramentas de síntese inserem clock gating automaticamente a partir de padrões <code>if (en) q <= d;</code>.', true, 'Normalmente para bancos de ≥ ~4–8 flops.'),
  Q('O pino test_en na ICG serve para:', ['Forçar o relógio ativo durante scan (DFT)', 'Medir potência', 'Desligar o reset', 'Gerar relógio a metade'], 0, ''),
  Q('Clock gating reduz principalmente:', ['Potência dinâmica (relógio e flops)', 'Leakage', 'Área', 'Hold violations'], 0, 'Para leakage → power gating.'),
  OPEN('Qual a diferença entre clock gating e power gating?', 'Clock gating pára a comutação (poupa potência dinâmica), estado mantém-se, retoma em 1 ciclo. Power gating corta a alimentação (poupa leakage) com sleep transistors; perde estado (precisa de retention flops), precisa de isolamento das saídas, tem latência de wake-up e corrente de inrush. Descrito em UPF.'),
]);
L('mem', U3, 'Memórias: SRAM, register files, portas e banking', [S_.WH, S_.RAB, S_.HP], [
  T('Hierarquia física', `<ul><li><b>Flops</b>: rápidos, grandes (~20+ T por bit). Bons para estruturas pequenas, muitas portas.</li><li><b>Register file</b> custom: multiportas (ex: 2R1W), latência baixa.</li><li><b>SRAM 6T</b>: densa; macros geradas por compilador de memória; 1 ou 2 portas; leitura com latência de 1+ ciclo.</li></ul><p>Mais portas = célula muito maior (fios de wordline/bitline por porta). Para mais throughput sem multiportas: <b>banking</b> (dividir endereços por bancos, com conflitos possíveis).</p>`),
  Q('Como fazes um "2R1W" barato a partir de SRAMs 1R1W?', ['Duplicar a memória: escrever nas duas cópias, cada leitura usa uma cópia', 'Usar o dobro da frequência é a única forma', 'Impossível', 'Usar latches'], 0, 'Replicação para leituras; para mais escritas usa-se banking ou LVT (live value table).'),
], [
  Q('Célula SRAM típica tem:', ['6 transístores', '1 transístor + condensador', '4 transístores', '20 transístores'], 0, '1T1C é DRAM.'),
  TF('A DRAM precisa de refresh porque a carga no condensador escapa.', true, ''),
  Q('Uma memória de 4 bancos endereçada pelos 2 LSBs: endereços 0,4,8,12 acedidos em simultâneo causam:', ['Conflito de banco — todos no banco 0', 'Acesso paralelo perfeito', 'Erro de paridade', 'Nada'], 0, 'Mesmo padrão dos bank conflicts em shared memory de GPU.'),
  Q('ECC SECDED em 64 bits de dados usa tipicamente:', ['8 bits de verificação (72 bits)', '1 bit', '64 bits', '16 bits'], 0, 'Hamming (7 bits) + paridade global.'),
]);
L('bits', U3, 'Truques de bits: popcount, LZC, one-hot, thermometer', [S_.HDLB, SRC('Hacker\'s Delight — H. Warren', 'https://en.wikipedia.org/wiki/Hacker%27s_Delight')], [
  T('Padrões que aparecem em entrevistas', `<ul><li><b>Popcount</b>: árvore de somadores (log₂N níveis). Para 8 bits: somas de pares, depois de nibbles…</li><li><b>Leading zero count</b>: árvore (ou encoder de prioridade). Usado em normalização de vírgula flutuante.</li><li><b>One-hot → binário</b>: bit k do índice = OR dos bits one-hot cujo índice tem o bit k a 1.</li><li><b>Detetar one-hot</b>: <code>x != 0 && (x & (x−1)) == 0</code> (ou <code>$onehot(x)</code> em SVA).</li><li><b>Thermometer</b> (0001111): fácil de comparar, usado em ADCs/flash.</li></ul>`),
  G('g_popcount'),
  Q('One-hot 8 bits → índice de 3 bits. idx[0] =', ['OR dos bits 1,3,5,7', 'OR dos bits 0,1,2,3', 'AND dos bits ímpares', 'bit 0'], 0, 'Índices com bit 0 a 1: 1,3,5,7.'),
], [
  G('g_popcount'),
  Q('Como detetar em 1 ciclo se um número de 32 bits é potência de 2?', ['(x != 0) && ((x & (x−1)) == 0)', 'x % 2 == 0', 'x[31] == 1', '^x == 1'], 0, ''),
  Q('LZC de <code>8\'b0001_0110</code>:', ['3', '4', '1', '5'], 0, 'Zeros à esquerda antes do primeiro 1.'),
  OPEN('Como contarias os 1s de um vetor de 64 bits a 3 GHz?', 'Árvore de compressores (CSA 3:2 / 7:3) ou somadores em árvore, pipelinada: nível 1 soma pares (2-bit), nível 2 soma em 3-bit, … total log₂64 = 6 níveis; pipeline a cada 1–2 níveis conforme o timing. Alternativa: lookup tables de 4–6 bits e somar os resultados.'),
]);
L('credit', U3, 'Controlo de fluxo por créditos', [S_.DALLY, SRC('PCIe flow control credits (conceito)', 'https://en.wikipedia.org/wiki/PCI_Express')], [
  T('Créditos em vez de ready', `<p>Em ligações longas (muitos ciclos de fio/pipeline), um <code>ready</code> combinacional é impossível. O emissor começa com <b>C créditos</b> = número de buffers do recetor. Cada envio gasta 1 crédito; quando o recetor liberta um buffer, devolve 1 crédito.</p><div class="key">Para throughput total: <b>buffers ≥ round-trip latency × taxa</b>. Se o caminho dado→recetor + crédito→emissor demora 8 ciclos, precisas de ≥ 8 buffers para enviar 1/ciclo sem parar.</div>`),
  G('g_credit'),
], [
  G('g_credit'),
  TF('Com créditos, o recetor nunca transborda, mesmo com grande latência de fio.', true, 'O emissor só envia o que sabe caber.'),
  Q('Vantagem principal de créditos vs valid/ready em NoCs:', ['Tolerância a latência — nenhum sinal combinacional atravessa a ligação', 'Menos buffers', 'Menos fios de dados', 'Não precisa de reset'], 0, ''),
  Q('Se reduzires os buffers abaixo do round-trip:', ['A ligação funciona mas com throughput reduzido', 'Há perda de dados', 'Deadlock garantido', 'Não muda nada'], 0, 'Throughput ≈ buffers / RTT.'),
]);

/* ======================= U4 — ARQUITETURA DE COMPUTADORES ======================= */
const U4 = 'U4 · Arquitetura de computadores';
L('isa', U4, 'ISA, pipeline RISC de 5 estágios e a Iron Law', [S_.HP, S_.CS152, S_.HH], [
  T('A equação de desempenho', `<p><b>Tempo = Instruções × CPI × T<sub>clk</sub></b> ("Iron Law"). Melhorar um termo costuma piorar outro.</p><p>Pipeline clássico (MIPS/RISC-V): <b>IF</b> (fetch) → <b>ID</b> (decode/regs) → <b>EX</b> (ALU) → <b>MEM</b> → <b>WB</b>. CPI ideal = 1.</p>`),
  G('g_ironlaw'),
  Q('Lei de Amdahl: 40% do programa acelera 10×. Speedup total?', ['≈ 1,56×', '4×', '10×', '1,4×'], 0, '1 / (0,6 + 0,4/10) = 1/0,64 = 1,5625.'),
], [
  G('g_amdahl'), G('g_ironlaw'),
  TF('RISC-V é uma ISA aberta, com instruções de 32 bits na base RV32I.', true, ''),
  Q('Em que estágio se lê o register file num pipeline de 5 estágios?', ['ID', 'IF', 'EX', 'WB'], 0, ''),
]);
L('hazard', U4, 'Hazards, forwarding e branch prediction', [S_.HP, S_.CS152], [
  T('Três tipos', `<ul><li><b>Estruturais</b>: dois estágios querem o mesmo recurso.</li><li><b>Dados</b> (RAW): uma instrução precisa do resultado da anterior → <b>forwarding</b> do EX/MEM para EX; load-use ainda custa 1 bolha.</li><li><b>Controlo</b>: branches → <b>predição</b>. Preditor de 2 bits (contador saturante) por entrada; preditores modernos (TAGE, perceptron) atingem &gt;95% de acerto.</li></ul>`),
  Q('Num pipeline 5 estágios com forwarding, <code>lw x1,0(x2)</code> seguido de <code>add x3,x1,x4</code>:', ['1 ciclo de stall', '0 stalls', '2 stalls', '3 stalls'], 0, 'O dado do load só existe no fim de MEM.'),
  G('g_branch'),
], [
  Q('Contador saturante de 2 bits: estados 00,01 → not taken; 10,11 → taken. Em 11, depois de um not-taken fica em:', ['10 (ainda prevê taken)', '00', '01', '11'], 0, 'Precisa de 2 erros seguidos para mudar a predição.'),
  TF('Um BTB (branch target buffer) guarda o endereço de destino de branches.', true, ''),
  Q('Hazard WAR/WAW aparece sobretudo em:', ['Processadores out-of-order — resolvido por renaming', 'Pipelines in-order de 5 estágios', 'Só em GPUs', 'Caches'], 0, ''),
  G('g_branch'),
]);
L('cache', U4, 'Caches: mapeamento, AMAT e os 3 Cs', [S_.HP, S_.CS152, S_.HH], [
  T('Endereço = tag | índice | offset', `<p>Cache de C bytes, linhas de B bytes, associatividade A: <b>sets = C/(B·A)</b>.</p><p><code>offset = log₂B</code>, <code>índice = log₂(sets)</code>, <code>tag = bits_endereço − índice − offset</code>.</p><p><b>AMAT</b> = hit time + miss rate × miss penalty.</p><p><b>3 Cs</b> dos misses: <i>compulsory</i> (primeiro acesso), <i>capacity</i> (não cabe), <i>conflict</i> (mapeamento).</p>`),
  G('g_cachebits'),
  G('g_amat'),
], [
  G('g_cachebits'), G('g_amat'),
  Q('Aumentar a associatividade reduz principalmente misses de:', ['Conflito', 'Compulsórios', 'Capacidade', 'Coerência'], 0, ''),
  Q('Write-back vs write-through: write-back…', ['Escreve na memória só quando a linha suja é expulsa (precisa de dirty bit)', 'Escreve sempre na memória', 'Não usa tags', 'Não tem misses'], 0, ''),
]);
L('coh', U4, 'Coerência (MESI) e memória virtual (TLB)', [S_.HP, S_.CS152], [
  T('MESI', `<p>Estados por linha: <b>M</b>odified (suja, só eu), <b>E</b>xclusive (limpa, só eu), <b>S</b>hared (limpa, vários), <b>I</b>nvalid. Escrever numa linha S exige invalidar as outras cópias. Protocolos por snooping (barramento) ou directory (escalável).</p>`),
  T('Memória virtual', `<p>Endereço virtual → físico via tabela de páginas (páginas de 4 KB → 12 bits de offset). A <b>TLB</b> guarda traduções recentes. Caches VIPT (virtually indexed, physically tagged) permitem acesso à cache em paralelo com a TLB se <code>índice+offset ≤ bits de página</code>.</p>`),
  Q('Um core escreve numa linha em estado S. O que acontece?', ['Envia invalidação aos outros; a sua cópia passa a M', 'Escreve sem avisar', 'Passa a E', 'Passa a I'], 0, ''),
], [
  Q('Com páginas de 4 KB, quantos bits de offset de página?', ['12', '10', '4', '16'], 0, ''),
  TF('False sharing ocorre quando dois cores escrevem em variáveis diferentes na mesma linha de cache.', true, 'A linha "pinga-pongueia" entre caches.'),
  Q('Que estado MESI permite escrever sem tráfego de coerência?', ['E ou M', 'S', 'I', 'Nenhum'], 0, 'E→M silenciosamente.'),
  Q('A TLB é essencialmente:', ['Uma cache de traduções da tabela de páginas', 'Um buffer de escrita', 'Um preditor', 'Um DMA'], 0, ''),
]);
L('ooo', U4, 'Execução fora de ordem: renaming, Tomasulo, ROB', [S_.HP, S_.CS152], [
  T('Ideia', `<p><b>Register renaming</b> mapeia registos arquiteturais para muitos físicos → elimina WAR/WAW. <b>Reservation stations / issue queue</b>: instruções esperam pelos operandos e executam quando prontas (dataflow). <b>Reorder buffer (ROB)</b>: faz <i>commit</i> em ordem → exceções precisas e recuperação de mispredicts.</p>`),
  Q('Qual estrutura garante exceções precisas num core OoO?', ['Reorder buffer', 'BTB', 'TLB', 'Store buffer apenas'], 0, ''),
], [
  TF('Tomasulo usa um common data bus para difundir resultados às estações de reserva.', true, ''),
  Q('Porque é que GPUs normalmente NÃO usam execução OoO agressiva?', ['Escondem latência com paralelismo massivo de threads (troca de warps), gastando área em mais unidades de cálculo', 'É patenteado', 'Porque não têm branches', 'Porque não têm caches'], 0, 'Latency hiding via multithreading em vez de ILP.'),
  Q('Memory disambiguation trata de:', ['Saber se um load pode passar à frente de stores anteriores com endereço desconhecido', 'Traduzir endereços', 'Coerência entre GPUs', 'ECC'], 0, ''),
  OPEN('Compara CPU OoO vs GPU SIMT em uma resposta de 1 minuto.', 'CPU: otimizada para latência de uma thread — caches grandes, OoO, branch prediction, poucas threads. GPU: otimizada para throughput — milhares de threads em warps, execução SIMT in-order, latência escondida trocando de warp a cada ciclo, register file enorme, caches pequenas por thread, memória de alta largura de banda (HBM). Trade-off área: controlo vs ALUs.'),
]);

/* ======================= U5 — GPU ======================= */
const U5 = 'U5 · Arquitetura de GPU';
L('gpu', U5, 'SMs, warps e SIMT', [S_.CUDA, S_.GPGPU], [
  T('O modelo', `<p>Um programa CUDA lança uma <b>grid</b> de <b>blocks</b>; cada block corre num <b>SM</b> (Streaming Multiprocessor). Threads agrupam-se em <b>warps de 32</b> que executam a mesma instrução (SIMT).</p><p><b>Divergência</b>: se threads de um warp seguem caminhos diferentes num <code>if</code>, os caminhos são serializados com máscaras de ativação.</p><p>O SM esconde latência (centenas de ciclos à memória) alternando entre muitos warps residentes → <b>occupancy</b> limitada por registos, shared memory e nº de threads por SM.</p>`),
  G('g_warps'),
  Q('Um warp com 32 threads executa <code>if (tid % 2) A(); else B();</code>. O que acontece?', ['A e B executam em série, cada um com metade das lanes ativas', 'Corre ao dobro da velocidade', 'Divide-se em 2 warps automaticamente', 'Erro'], 0, ''),
], [
  G('g_occ'),
  TF('Threads de warps diferentes podem executar instruções diferentes no mesmo SM sem penalização de divergência.', true, 'Divergência é intra-warp.'),
  Q('Porque é que um SM tem um register file tão grande (centenas de KB)?', ['Para manter o contexto de muitos warps residentes e trocar entre eles sem custo', 'Para substituir a cache L2', 'Para guardar instruções', 'Para ECC'], 0, ''),
  G('g_warps'),
]);
L('gpumem', U5, 'Memória em GPU: coalescing e bank conflicts', [S_.CUDABP, S_.CUDA], [
  T('Coalescing', `<p>Acessos à memória global de um warp são agrupados em transações de 32/64/128 bytes. Se as 32 threads leem endereços consecutivos de 4 bytes → <b>128 B numa só transação</b>. Acessos com stride grande → muitas transações → desperdício de largura de banda.</p>`),
  T('Shared memory e bancos', `<p>A shared memory tem <b>32 bancos</b> de 4 bytes. Endereço palavra <code>w</code> → banco <code>w mod 32</code>. Se várias threads de um warp acedem a <b>palavras diferentes no mesmo banco</b> → serializa (k-way conflict). Mesma palavra → broadcast, sem conflito.</p><div class="key">Truque clássico: array 32×32 de floats acedido por colunas → 32-way conflict. Solução: <b>padding</b> <code>float tile[32][33];</code></div>`),
  G('g_bank'),
], [
  G('g_bank'),
  Q('Thread i lê <code>a[i*2]</code> (floats). Eficiência de coalescing aproximada?', ['50% (usa metade dos bytes transferidos)', '100%', '25%', '3%'], 0, 'Stride 2.'),
  TF('Todas as threads a ler a mesma palavra da shared memory causa 32-way bank conflict.', false, 'É broadcast.'),
  OPEN('Explica porque o padding [32][33] elimina bank conflicts num transpose.', 'Com 33 colunas, o elemento [r][c] fica na palavra r·33+c; banco = (r·33+c) mod 32 = (r + c) mod 32. Ao ler uma coluna (c fixo, r=0..31) os bancos são todos diferentes. Sem padding, r·32+c mod 32 = c para todos → mesmo banco.'),
]);
L('tensor', U5, 'Vírgula flutuante, tensor cores e matrizes', [S_.CUDA, SRC('IEEE 754 / formatos BF16, FP8 (OCP)', 'https://www.opencompute.org/documents/ocp-8-bit-floating-point-specification-ofp8-revision-1-0-2023-12-01-pdf-1'), SRC('Kung — Why Systolic Architectures? (1982)', 'https://www.eecs.harvard.edu/~htk/publication/1982-kung-why-systolic-architecture.pdf')], [
  T('Formatos', `<table><tr><th>Formato</th><th>Sinal</th><th>Expoente</th><th>Mantissa</th></tr><tr><td>FP32</td><td>1</td><td>8</td><td>23</td></tr><tr><td>FP16</td><td>1</td><td>5</td><td>10</td></tr><tr><td>BF16</td><td>1</td><td>8</td><td>7</td></tr><tr><td>FP8 E4M3</td><td>1</td><td>4</td><td>3</td></tr><tr><td>FP8 E5M2</td><td>1</td><td>5</td><td>2</td></tr></table><p>BF16 tem o <b>mesmo alcance</b> que FP32 (8 bits de expoente) com menos precisão — ideal para treino de redes neuronais.</p>`),
  T('Matrizes em hardware', `<p>Um tensor core faz <code>D = A×B + C</code> num bloco pequeno de matrizes por instrução. Uma <b>systolic array</b> N×N de MACs faz fluir A da esquerda e B de cima; cada PE multiplica e acumula. Reutilização de dados = menos acessos à memória por FLOP (intensidade aritmética).</p>`),
  Q('Qual formato tem maior alcance dinâmico: FP16 ou BF16?', ['BF16', 'FP16', 'Iguais', 'Depende do sinal'], 0, 'BF16 tem 8 bits de expoente vs 5.'),
  G('g_matmul'),
], [
  G('g_matmul'),
  Q('Multiplicar matrizes N×N custa quantas multiplicações-acumulações?', ['N³', 'N²', '2N', 'N log N'], 0, ''),
  TF('Somar muitos produtos FP16 num acumulador FP32 reduz o erro de arredondamento.', true, 'Por isso os tensor cores acumulam em maior precisão.'),
  Q('Valor de FP32 com sinal 0, expoente 127 (biased), mantissa 0:', ['1,0', '0', '127', '2'], 0, '(−1)⁰ × 1.0 × 2^(127−127).'),
]);
L('noc', U5, 'Interconexões: crossbars, NoC e largura de banda', [S_.DALLY, SRC('Little\'s Law', 'https://en.wikipedia.org/wiki/Little%27s_law')], [
  T('Ligar muitos a muitos', `<ul><li><b>Barramento</b>: simples, não escala.</li><li><b>Crossbar</b> N×M: sem bloqueio, custo O(N·M) — usado entre SMs e partições de L2 em GPUs.</li><li><b>NoC</b> (mesh, ring, torus): routers com buffers, roteamento (ex: XY dimension-order, livre de deadlock em mesh), controlo de fluxo por créditos, canais virtuais.</li></ul><div class="key"><b>Lei de Little</b>: <code>ocupação = throughput × latência</code>. Para manter 1 TB/s com 500 ns de latência, precisas de 500 KB de pedidos em voo!</div>`),
  G('g_little'),
], [
  G('g_little'), G('g_bw'),
  Q('Roteamento XY numa mesh 2D é livre de deadlock porque:', ['Proíbe certas viragens (de Y para X), quebrando ciclos de dependência', 'Usa buffers infinitos', 'Usa round-robin', 'Usa Gray code'], 0, ''),
  TF('Head-of-line blocking acontece quando o pacote à frente de um buffer FIFO bloqueia outros com destino livre.', true, 'Canais virtuais / VOQs mitigam.'),
]);

/* ======================= U6 — CMOS & VLSI FÍSICO ======================= */
const U6 = 'U6 · CMOS, VLSI físico e sign-off';
L('mos', U6, 'O transístor MOSFET', [S_.WH, S_.RAB], [
  T('Regiões', `<p>NMOS conduz com V<sub>GS</sub> &gt; V<sub>t</sub>.</p><ul><li><b>Corte</b>: V<sub>GS</sub> &lt; V<sub>t</sub> (só leakage subthreshold).</li><li><b>Linear</b>: V<sub>DS</sub> &lt; V<sub>GS</sub>−V<sub>t</sub> — comporta-se como resistência.</li><li><b>Saturação</b>: <code>I<sub>D</sub> ≈ ½·μC<sub>ox</sub>(W/L)(V<sub>GS</sub>−V<sub>t</sub>)²</code> (modelo de canal longo).</li></ul><p>Em nós modernos (FinFET/GAA) há <b>saturação de velocidade</b>: I<sub>D</sub> cresce ~linearmente com (V<sub>GS</sub>−V<sub>t</sub>). PMOS tem mobilidade ~2× menor (holes) → historicamente mais largo.</p>`),
  Q('Duplicar W de um transístor (mesmo L):', ['Duplica a corrente e a capacidade de gate', 'Duplica V<sub>t</sub>', 'Reduz a corrente para metade', 'Não muda nada'], 0, ''),
], [
  TF('Baixar V<sub>t</sub> aumenta velocidade mas aumenta leakage exponencialmente.', true, 'Base do multi-Vt.'),
  Q('FinFET melhora em relação ao planar sobretudo:', ['O controlo eletrostático do canal (menos leakage, melhor short-channel behavior)', 'A mobilidade dos eletrões', 'A tensão de alimentação para 5 V', 'O número de metais'], 0, ''),
  Q('Em saturação (canal longo), I<sub>D</sub> é proporcional a:', ['(V<sub>GS</sub>−V<sub>t</sub>)²', 'V<sub>DS</sub>', 'e<sup>V<sub>GS</sub></sup>', '1/W'], 0, ''),
  Q('Abaixo de V<sub>t</sub> a corrente:', ['Cai exponencialmente (~10× por cada ~60–100 mV)', 'É exatamente zero', 'Cresce', 'É constante'], 0, 'Subthreshold slope.'),
]);
L('inv', U6, 'O inversor CMOS e margens de ruído', [S_.WH, S_.RAB], [
  T('VTC', `<p>PMOS para V<sub>DD</sub>, NMOS para GND. A <b>característica de transferência</b> (VTC) tem um ponto de comutação V<sub>M</sub> onde V<sub>in</sub>=V<sub>out</sub>. Com β<sub>p</sub>=β<sub>n</sub>, V<sub>M</sub>≈V<sub>DD</sub>/2.</p><p><b>Margens de ruído</b>: NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>, NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub> (pontos de ganho −1).</p><p>Em estado estável, não há caminho DC VDD→GND → potência estática ≈ só leakage.</p>`),
  Q('Se o PMOS for muito mais forte que o NMOS, V<sub>M</sub>:', ['Sobe (acima de V<sub>DD</sub>/2)', 'Desce', 'Não muda', 'Vai a 0'], 0, 'O PMOS "puxa" mais para cima.'),
], [
  TF('Um inversor CMOS estático tem saídas rail-to-rail (0 e V<sub>DD</sub>).', true, ''),
  Q('Corrente de curto-circuito no inversor acontece:', ['Durante a transição, quando ambos os transístores conduzem', 'Sempre', 'Nunca', 'Só no reset'], 0, ''),
  Q('Um anel de N inversores (N ímpar) oscila com período:', ['2·N·t<sub>pd</sub>', 'N·t<sub>pd</sub>', 't<sub>pd</sub>', '4·t<sub>pd</sub>'], 0, 'O sinal percorre o anel duas vezes por período (subida e descida).'),
  G('g_ring'),
]);
L('rc', U6, 'Atraso: modelo RC e Elmore', [S_.WH, S_.STANF], [
  T('Modelo RC', `<p>Um transístor ligado ≈ resistência R; gates e fios ≈ capacidades. Atraso de um degrau num circuito RC: <code>t<sub>pd</sub> ≈ 0,69·RC</code> (50%).</p><p><b>Atraso de Elmore</b> numa árvore RC: para cada condensador, soma a capacidade × resistência <b>partilhada</b> entre o caminho da fonte até esse condensador e até ao nó de saída.</p><p>Escada RC de N secções iguais: <code>t ≈ R·C·N(N+1)/2</code> → <b>quadrático no comprimento</b> do fio.</p>`),
  G('g_elmore'),
], [
  G('g_elmore'),
  Q('Duplicar o comprimento de um fio não repetido faz o atraso:', ['~4×', '2×', 'Igual', '½'], 0, 'R e C crescem ambos linearmente.'),
  TF('Inserir repetidores (buffers) torna o atraso de fios longos aproximadamente linear no comprimento.', true, ''),
  Q('Em Elmore, um condensador num ramo lateral contribui com:', ['Cap × resistência partilhada com o caminho até à saída', 'Cap × resistência total do ramo', 'Nada', 'Cap × R total da árvore'], 0, ''),
]);
L('le', U6, 'Logical effort: dimensionar caminhos', [S_.WH, SRC('Sutherland, Sproull, Harris — Logical Effort', 'https://www.elsevier.com/books/logical-effort/sutherland/978-1-55860-557-2')], [
  T('d = g·h + p', `<p><b>g</b> (logical effort): quanto pior a porta conduz face a um inversor com a mesma capacidade de entrada. INV=1, NAND2=4/3, NOR2=5/3, NAND3=5/3. <b>h</b> = C<sub>out</sub>/C<sub>in</sub> (fan-out elétrico). <b>p</b> = atraso parasita (INV=1, NAND2=2).</p><p>Caminho: <code>F = G·B·H</code> (produto de g, branching, fan-out total). Atraso mínimo quando todos os estágios têm o mesmo esforço <code>f̂ = F<sup>1/N</sup></code>; nº ótimo de estágios ≈ <code>log₄F</code> (esforço ótimo ≈ 4).</p>`),
  G('g_le'),
  Q('Logical effort de uma NOR2 (rácio μ 2:1):', ['5/3', '4/3', '1', '2'], 0, 'PMOS em série (2× mais largos) → mais capacidade de entrada.'),
], [
  G('g_le'), G('g_le'),
  Q('Para conduzir uma carga 64× maior que a entrada com inversores, quantos estágios ótimos?', ['3', '6', '1', '64'], 0, 'log₄64 = 3, esforço 4 por estágio.'),
  TF('NAND é preferida a NOR em CMOS porque tem menor logical effort.', true, ''),
]);
L('power', U6, 'Potência: dinâmica, curto-circuito e leakage', [S_.WH, S_.RAB], [
  T('As três componentes', `<p><b>Dinâmica</b>: <code>P = α·C·V<sub>DD</sub>²·f</code> (α = fator de atividade).</p><p><b>Curto-circuito</b>: durante transições lentas.</p><p><b>Leakage</b>: subthreshold (exponencial em V<sub>t</sub> e temperatura), gate, junção. Em nós avançados pode ser 20–40% do total.</p>`),
  W('power', { h: 'Experimenta', b: '<p>Repara que V entra ao quadrado — por isso DVFS (baixar tensão e frequência juntas) é tão eficaz: potência cai ~cúbica.</p>' }),
  G('g_power'),
], [
  G('g_power'),
  Q('Reduzir V<sub>DD</sub> 20% (mantendo f) reduz a potência dinâmica para:', ['64%', '80%', '50%', '96%'], 0, '0,8² = 0,64.'),
  TF('O leakage aumenta com a temperatura.', true, 'E isso pode causar thermal runaway.'),
  Q('Fator de atividade de um sinal de relógio (transições por ciclo/2):', ['1 (comuta sempre)', '0,1', '0,5', '0'], 0, 'Com a convenção α = probabilidade de transição 0→1 por ciclo: relógio = 1.'),
]);
L('cmosgate', U6, 'Portas CMOS complexas e dimensionamento', [S_.WH], [
  T('Pull-down e pull-up duais', `<p>Rede NMOS (pull-down) implementa a função <b>complementada</b>: série = AND, paralelo = OR. A rede PMOS é a <b>dual</b> (série↔paralelo).</p><p>Ex: <code>Y = (A·B + C)\'</code> (AOI21): NMOS A–B em série, em paralelo com C; PMOS A∥B em série com C.</p><p><b>Dimensionamento</b> para igualar o inversor de referência (NMOS=1, PMOS=2): transístores em série de k → largura ×k.</p>`),
  Q('Numa NAND3 dimensionada para igualar um inversor (n=1, p=2), a largura de cada NMOS é:', ['3', '1', '2', '6'], 0, '3 em série → 3× mais largos. PMOS em paralelo ficam a 2.'),
], [
  Q('Uma porta AOI22 implementa:', ['(AB + CD)\'', 'AB + CD', '(A+B)(C+D)', '((A+B)(C+D))\''], 0, ''),
  TF('Portas CMOS estáticas de 1 estágio só implementam funções inversoras (monotónicas decrescentes).', true, ''),
  Q('Porque se evita mais de ~4 transístores em série?', ['Atraso cresce ~quadraticamente (resistência e capacidades internas) e efeito de corpo', 'É proibido pelas regras de DRC', 'Aumenta V<sub>DD</sub>', 'Reduz a área demasiado'], 0, ''),
  Q('Quantos transístores tem uma NAND2 CMOS estática?', ['4', '2', '6', '8'], 0, ''),
]);
L('wire', U6, 'Interconexões, crosstalk e repetidores', [S_.WH, S_.RAB], [
  T('Fios mandam', `<p>Em nós modernos, os fios dominam o atraso de caminhos longos. Resistência por µm aumenta à medida que os fios encolhem. <b>Crosstalk</b>: acoplamento capacitivo entre vizinhos — se o agressor comuta em sentido oposto, a capacidade efetiva duplica (<b>Miller</b>, até 2×C<sub>c</sub>), atrasando; no mesmo sentido, acelera (afeta hold!).</p><p>Mitigação: espaçamento, shielding (fios de GND entre sinais), metais superiores (mais grossos) para rotas longas, repetidores.</p>`),
  Q('Um agressor a comutar no mesmo sentido que a vítima:', ['Acelera a vítima — pode causar violação de hold', 'Atrasa a vítima', 'Não tem efeito', 'Causa sempre glitch'], 0, ''),
], [
  TF('Metais superiores são normalmente mais grossos e menos resistivos.', true, 'Usados para relógios, alimentação e rotas globais.'),
  Q('Shielding de um fio de relógio consiste em:', ['Rodear o fio com fios de VDD/GND', 'Aumentar a sua largura apenas', 'Usar um metal inferior', 'Inverter o sinal'], 0, ''),
  Q('Repetidores ótimos num fio longo tornam o atraso:', ['Linear no comprimento', 'Quadrático', 'Constante', 'Exponencial'], 0, ''),
  Q('IR drop é:', ['Queda de tensão na rede de alimentação devido à resistência e corrente', 'Ruído de crosstalk', 'Atraso de relógio', 'Leakage'], 0, ''),
]);
L('flow', U6, 'O fluxo ASIC: da RTL ao tapeout', [S_.WH, S_.EECS151, S_.STANF], [
  T('Etapas', `<ol><li><b>Especificação & microarquitetura</b></li><li><b>RTL</b> + lint + CDC</li><li><b>Verificação</b> (simulação, UVM, formal, emulação)</li><li><b>Síntese lógica</b> (RTL → netlist de standard cells, com SDC: relógios, I/O delays)</li><li><b>DFT</b>: scan insertion, MBIST</li><li><b>Floorplan</b> → <b>Placement</b> → <b>CTS</b> (árvore de relógio) → <b>Routing</b></li><li><b>Sign-off</b>: STA (PrimeTime), IR/EM, DRC/LVS (física), equivalência formal (LEC), potência</li><li><b>Tapeout</b> (GDSII/OASIS para a foundry)</li></ol><p>Um engenheiro de RTL numa empresa de GPUs vive nas etapas 1–4, mas tem de perceber as restantes (timing closure, congestion, potência).</p>`),
  Q('Ferramenta/verificação que confirma que a netlist sintetizada é funcionalmente igual à RTL:', ['Logical Equivalence Check (LEC)', 'DRC', 'LVS', 'CTS'], 0, ''),
], [
  Q('LVS verifica:', ['Que o layout corresponde ao esquemático/netlist', 'Regras geométricas', 'Timing', 'Potência'], 0, ''),
  Q('O ficheiro SDC contém:', ['Restrições de timing (create_clock, set_input_delay, exceções)', 'A netlist', 'O layout', 'Os vetores de teste'], 0, ''),
  TF('CTS acontece antes do placement.', false, 'Depois do placement (precisa das posições dos flops).'),
  OPEN('O que é "timing closure" e o que pode o engenheiro de RTL fazer para ajudar?', 'Fazer todos os caminhos cumprirem setup/hold em todos os corners após P&R. RTL pode: pipelining dos caminhos longos, reduzir níveis lógicos, evitar fan-out enorme (replicar registos), registar entradas/saídas de módulos (boundaries limpos), floorplan-aware design (dados que viajam longe têm estágios de pipeline), evitar caminhos combinacionais entre blocos, usar one-hot, mover lógica antes/depois de registos (retiming manual).'),
]);
L('sta', U6, 'STA avançado: corners, OCV, CPPR, exceções', [S_.WH, SRC('Bhasker & Chadha — Static Timing Analysis for Nanometer Designs', 'https://link.springer.com/book/10.1007/978-0-387-93820-2')], [
  T('Para além das inequações', `<ul><li><b>Corners PVT</b>: setup no lento (SS, baixa V, alta/baixa T — inversão de temperatura!), hold no rápido (FF).</li><li><b>OCV/AOCV/POCV</b>: variação no mesmo chip → derates diferentes para caminho de lançamento e captura.</li><li><b>CPPR/CRPR</b>: remove o pessimismo da parte comum da árvore de relógio (não pode ser lenta e rápida ao mesmo tempo).</li><li><b>Exceções</b>: <code>set_false_path</code> (caminhos que nunca importam), <code>set_multicycle_path</code>.</li></ul>`),
  T('Multicycle path', CODE(`
# dado com 2 ciclos para chegar
set_multicycle_path 2 -setup -from [get_cells src*] -to [get_cells dst*]
set_multicycle_path 1 -hold  -from [get_cells src*] -to [get_cells dst*]`) + `<p>Sem o <code>-hold 1</code>, o hold seria verificado no flanco anterior ao de setup (N−1 = 1 ciclo depois) → violações falsas enormes. Regra: <b>hold = N−1</b>.</p>`),
  Q('Porque é que hold é verificado no corner rápido?', ['Porque o problema de hold é dados chegarem demasiado cedo', 'Porque o relógio é mais lento', 'Por convenção', 'Porque o leakage é maior'], 0, ''),
], [
  TF('set_false_path em sinais de CDC sem qualquer outra restrição pode esconder problemas de skew entre bits de Gray code.', true, 'Usa set_max_delay -datapath_only.'),
  Q('CPPR remove pessimismo da:', ['Porção comum da árvore de relógio entre lançamento e captura', 'Lógica de dados', 'Rede de alimentação', 'Placement'], 0, ''),
  Q('Inversão de temperatura em nós avançados significa:', ['A baixa tensão, os transístores podem ser mais lentos a temperatura BAIXA', 'O chip arrefece quando aquece', 'Leakage baixa com temperatura', 'Hold piora com T alta sempre'], 0, ''),
  Q('Multicycle de 3 para setup: qual o multicycle de hold típico?', ['2', '3', '1', '0'], 0, 'N−1.'),
]);
L('dft', U6, 'DFT: scan, ATPG e BIST', [S_.WH, SRC('Bushnell & Agrawal — Essentials of Electronic Testing', 'https://link.springer.com/book/10.1007/b117406')], [
  T('Testar chips fabricados', `<p>Defeitos de fabrico modelam-se como <b>stuck-at-0/1</b>, transition faults (atraso), bridging. <b>Scan</b>: todos os flops viram flops com MUX (scan_en) ligados em cadeias → o tester carrega estados, aplica 1 ciclo funcional (capture) e descarrega resultados. <b>ATPG</b> gera os padrões automaticamente; cobertura &gt;99% é típica.</p><p><b>MBIST</b>: testa memórias com algoritmos March (ex: March C−). <b>JTAG (IEEE 1149.1)</b>: acesso de teste/boundary scan.</p>`),
  Q('Numa scan chain, durante shift (scan_en=1), os flops:', ['Formam um shift register', 'Funcionam normalmente', 'Ficam em reset', 'Estão sem relógio'], 0, ''),
], [
  TF('Lógica em clock gating precisa de test_en para que os flops recebam relógio durante scan.', true, ''),
  Q('Uma falha stuck-at-1 num nó significa:', ['O nó comporta-se como se estivesse sempre a 1', 'O nó oscila', 'O nó é lento', 'Curto com VDD em todo o chip'], 0, ''),
  Q('Algoritmos March são usados em:', ['MBIST de memórias', 'Síntese', 'Roteamento', 'Branch prediction'], 0, ''),
  Q('At-speed testing serve para detetar:', ['Defeitos de atraso (transition faults)', 'Apenas stuck-at', 'Erros de RTL', 'Problemas de CDC'], 0, ''),
]);
L('lp', U6, 'Baixa potência: multi-Vt, power gating, DVFS, UPF', [S_.WH, SRC('IEEE 1801 (UPF)', 'https://standards.ieee.org/ieee/1801/7302/')], [
  T('A caixa de ferramentas', `<ul><li><b>Clock gating</b> (dinâmica).</li><li><b>Multi-Vt</b>: HVT (lento, pouco leakage) em caminhos com folga; LVT/ULVT só nos críticos.</li><li><b>Power gating</b>: header/footer switches; precisa de <b>isolation cells</b> (saídas de domínio desligado não podem flutuar), <b>retention flops</b>, sequência de power-up controlada.</li><li><b>DVFS</b>: baixar V e f quando a carga é baixa; <b>level shifters</b> entre domínios de tensão.</li><li><b>Multi-voltage domains</b> descritos em <b>UPF</b>.</li></ul>`),
  Q('Um sinal que sai de um domínio desligado para um ligado precisa de:', ['Isolation cell (clamp a 0/1)', 'Level shifter apenas', 'Sincronizador', 'Nada'], 0, 'Entre tensões diferentes, também level shifter.'),
], [
  TF('Retention flops mantêm estado num domínio desligado usando uma alimentação "always-on" mínima.', true, ''),
  Q('DVFS: reduzir V e f para metade reduz a potência dinâmica para aproximadamente:', ['1/8', '1/2', '1/4', '1/16'], 0, '(½)²·½ = ⅛.'),
  Q('Células HVT são usadas:', ['Em caminhos com folga de timing, para reduzir leakage', 'No caminho crítico', 'Só em memórias', 'Para relógios'], 0, ''),
  Q('Inrush current é um problema ao:', ['Ligar um domínio power-gated (carregar todas as capacidades de uma vez)', 'Desligar o relógio', 'Fazer reset', 'Ler SRAM'], 0, 'Solução: ligar os switches em cadeia (daisy chain).'),
]);
L('verif', U6, 'Verificação: UVM, cobertura e formal', [SRC('Accellera UVM', 'https://www.accellera.org/downloads/standards/uvm'), S_.CHIPV, S_.SVA], [
  T('Como se verifica um chip', `<p>Verificação consome ~60–70% do esforço de um projeto. <b>UVM</b>: componentes reutilizáveis — <i>sequence/sequencer</i> (estímulo), <i>driver</i> (pinos), <i>monitor</i> (observa), <i>scoreboard</i> (compara com modelo de referência), <i>agent</i>, <i>env</i>, <i>test</i>.</p><p><b>Constrained random</b> + <b>cobertura funcional</b> (covergroups) dizem-te o que já testaste. <b>Formal</b> prova propriedades para todos os estímulos (ótimo para árbitros, FIFOs, protocolos, deadlock). <b>Emulação</b> (Palladium/ZeBu) corre software real antes do silício.</p>`),
  Q('Qual componente UVM converte transações em atividade nos pinos?', ['Driver', 'Monitor', 'Scoreboard', 'Sequence'], 0, ''),
], [
  TF('100% de cobertura de código implica que o design está correto.', false, 'Cobertura de código mede o que foi exercitado, não se foi verificado; precisa de checkers e cobertura funcional.'),
  Q('Verificação formal é especialmente boa para:', ['Provar que um árbitro nunca dá 2 grants ou que não há deadlock', 'Medir potência', 'Correr Linux', 'Timing'], 0, ''),
  Q('Um covergroup serve para:', ['Medir que valores/cenários foram observados', 'Gerar relógios', 'Sintetizar', 'Fazer reset'], 0, ''),
  OPEN('Encontraste um bug que só aparece após 10 milhões de ciclos de simulação aleatória. Como o depuras eficientemente?', 'Reproduzir com a mesma seed; ativar dumps só numa janela antes da falha (checkpoint/save-restore ou $dumpon perto do tempo); usar assertions para apanhar a causa mais cedo que o sintoma; recuar a partir do primeiro mismatch do scoreboard; reduzir o teste (minimizar estímulo); considerar formal para a propriedade violada com o estado inicial; adicionar cobertura do cenário para não regredir.'),
]);
L('intv', U6, 'A entrevista de RTL/ASIC: estrutura e estratégia', [SRC('Guia NVIDIA Careers (processo geral)', 'https://www.nvidia.com/en-us/about-nvidia/careers/'), SRC('Glassdoor — perguntas reportadas por candidatos (ASIC/RTL)', 'https://www.glassdoor.com/')], [
  T('Como costumam ser as entrevistas', `<ul><li><b>Screening</b> com recrutador + 1 técnica (fundamentos: setup/hold, FIFOs, CDC, FSM, Verilog).</li><li><b>Loop</b> de 4–6 entrevistas: design de blocos (escrever RTL num editor/quadro), microarquitetura (ex: "desenha um cache controller", "árbitro para 16 clientes"), timing/CDC, arquitetura de computadores/GPU, projetos do teu CV a fundo, comportamental.</li><li>Para recém-licenciados/estágios: projetos (FPGA, RISC-V, tese) contam muito — conhece cada linha.</li></ul>`),
  T('Método para perguntas de design', `<ol><li><b>Clarificar</b>: interface, larguras, throughput, latência, reset, relógios.</li><li><b>Desenhar diagrama de blocos e waveform</b> antes do código.</li><li><b>Caso simples primeiro</b>, depois otimizar (área, timing, potência).</li><li><b>Falar em voz alta</b>: os trade-offs valem mais que a resposta.</li><li><b>Verificar</b>: como testarias? que cantos? assertions?</li></ol><div class="key">Constrói um portefólio: GitHub com 4–6 projetos RTL verificados (FIFO async, RISC-V pipelinado, cache, árbitro, UART, um acelerador de matmul). Os projetos diários desta app estão desenhados para isso.</div>`),
  Q('Numa pergunta de design aberta, o primeiro passo deve ser:', ['Fazer perguntas de clarificação sobre requisitos e interfaces', 'Começar logo a escrever Verilog', 'Dizer a resposta final', 'Desenhar o layout'], 0, ''),
], [
  TF('Em entrevistas técnicas, explicar trade-offs em voz alta é tão importante como a resposta final.', true, ''),
  Q('Melhor forma de falar de um projeto no CV:', ['Problema → as tuas decisões técnicas e porquê → resultados medidos → o que farias diferente', 'Listar as ferramentas usadas', 'Dizer que foi trabalho de equipa sem detalhes', 'Mostrar só o código'], 0, ''),
  OPEN('"Fala-me de um bug difícil que encontraste." (comportamental — usa STAR)', '<b>S</b>ituação (contexto do projeto), <b>T</b>arefa (o que tinhas de garantir), <b>A</b>ção (como isolaste: waveforms, assertions, hipóteses testadas, o que descobriste), <b>R</b>esultado (correção, o que mudaste no processo — ex: nova assertion ou teste de regressão). Sê específico com números e detalhes técnicos.'),
  OPEN('"Porque queres trabalhar em design de GPUs?"', 'Resposta pessoal e concreta: interesse por computação paralela/IA/gráficos, projetos que fizeste (ex: matmul em FPGA, otimizaste CUDA), fascínio pela escala (milhares de milhões de transístores, desempenho/watt), e o que queres aprender (microarquitetura, timing closure em nós avançados). Evitar respostas genéricas.'),
]);
