/* Silício 1000 — currículo (parte 1). Fontes: ver COURSE.sources */
const S_ = {
  HH: SRC('Harris & Harris — Digital Design and Computer Architecture', 'https://pages.hmc.edu/harris/ddca/'),
  MIT6004: SRC('MIT 6.004 Computation Structures (OCW)', 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/'),
  MIT6111: SRC('MIT 6.111/6.205 Digital Systems Lab', 'https://ocw.mit.edu/courses/6-111-introductory-digital-systems-laboratory-spring-2006/'),
  EECS151: SRC('UC Berkeley EECS 151/251A — Digital Design & ICs', 'https://inst.eecs.berkeley.edu/~eecs151/'),
  CUM: SRC('Cliff Cummings — Sunburst Design papers (SNUG)', 'http://www.sunburst-design.com/papers/'),
  HDLB: SRC('HDLBits — exercícios de Verilog', 'https://hdlbits.01xz.net/'),
  CHIPV: SRC('ChipVerify — Verilog/SV/UVM', 'https://www.chipverify.com/'),
  SUTH: SRC('Sutherland — RTL Modeling with SystemVerilog', 'https://sutherland-hdl.com/'),
  WH: SRC('Weste & Harris — CMOS VLSI Design', 'https://pages.hmc.edu/harris/cmosvlsi/4e/index.html'),
  RAB: SRC('Rabaey — Digital Integrated Circuits', 'https://bwrcs.eecs.berkeley.edu/Classes/IcBook/'),
  HP: SRC('Hennessy & Patterson — Computer Architecture: A Quantitative Approach', 'https://www.elsevier.com/books-and-journals/book-series/the-morgan-kaufmann-series-in-computer-architecture-and-design'),
  CS152: SRC('Berkeley CS152 — Computer Architecture', 'https://inst.eecs.berkeley.edu/~cs152/'),
  CUDA: SRC('NVIDIA CUDA C++ Programming Guide', 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/'),
  CUDABP: SRC('NVIDIA CUDA Best Practices Guide', 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/'),
  STANF: SRC('Stanford EE271/EE371 — VLSI Systems', 'https://web.stanford.edu/class/ee271/'),
  SVA: SRC('IEEE 1800 SystemVerilog LRM (assertions)', 'https://ieeexplore.ieee.org/document/10458102'),
  DALLY: SRC('Dally & Towles — Principles and Practices of Interconnection Networks', 'https://www.elsevier.com/books/principles-and-practices-of-interconnection-networks/dally/978-0-12-200751-4'),
  GPGPU: SRC('Aamodt, Fung, Rogers — General-Purpose Graphics Processor Architectures', 'https://link.springer.com/book/10.1007/978-3-031-01759-9'),
};
const COURSE = {
  id: 'vlsi', name: 'Silício 100', short: 'Silício', tagline: 'RTL e VLSI para engenharia de GPUs', icon: '🔬', accent: '#0f9d76', accent2: '#0ea5e9', seed: 1001, days: 100, finalDays: 10, phases: ['Aprender', 'Consolidar', 'Reta final · modo entrevista'], testN: 9,
  extraName: 'projetos',
  cycles: ['Fundamentos', 'Prática deliberada', 'Domínio', 'Modo entrevista', 'Desenho de sistemas', 'Otimização', 'Sign-off', 'Arquitetura avançada', 'Mentor', 'Mestria', 'Mestria+', 'Mestria++', 'Lenda', 'Lenda+', 'Lenda++', 'Lenda+++', 'Lenda IV', 'Lenda V', 'Lenda VI', 'Lenda VII'],
  exam: { title: 'Prova semanal — simulação de entrevista', n: 12, big: 30, open: 3, sub: big => big ? '30 perguntas + 6 perguntas abertas de entrevista' : '12 perguntas técnicas + 3 perguntas abertas (estilo entrevista)' },
  sources: Object.values(S_),
  disclaimer: 'Conteúdo original escrito a partir destas referências clássicas usadas em MIT, Berkeley, Stanford e na indústria. As perguntas de entrevista são as recorrentes em processos de RTL/ASIC design de grandes empresas de semicondutores (GPU/CPU) — não são perguntas oficiais de nenhuma empresa.',
  lessons: [], gens: {}, interview: [],
};
const L = (id, unit, title, src, cards, quiz) => COURSE.lessons.push({ id, unit, title, src, cards, quiz });

/* ======================= U1 — LÓGICA DIGITAL ======================= */
const U1 = 'U1 · Lógica digital';
L('num', U1, 'Sistemas de numeração e complemento para dois', [S_.HH, S_.MIT6004], [
  T('Bits contam tudo', `<p>Um número de <i>n</i> bits sem sinal vai de <b>0</b> a <b>2<sup>n</sup>−1</b>. Cada posição vale uma potência de 2: <code>1011₂ = 8+0+2+1 = 11</code>.</p><p><b>Hexadecimal</b> agrupa 4 bits num dígito (0–F): <code>1010_1101₂ = 0xAD</code>. Em RTL vais escrever <code>8'hAD</code> constantemente.</p>`),
  W('binconv', { h: 'Brinca com 8 bits', b: '<p>Move o cursor e observa o mesmo padrão de bits lido como sem sinal, hex e complemento para dois.</p>' }),
  T('Complemento para dois', `<p>Com sinal, o bit mais significativo vale <b>−2<sup>n−1</sup></b>. Intervalo: <b>−2<sup>n−1</sup> … 2<sup>n−1</sup>−1</b> (8 bits: −128…127).</p><p><b>Negar</b>: inverte todos os bits e soma 1. <code>5 = 0000_0101 → −5 = 1111_1011</code>.</p><div class="key"><b>Extensão de sinal</b>: para alargar um número com sinal, replica o MSB. Em SV: <code>{{8{a[7]}}, a}</code> ou declara <code>logic signed</code>.</div>`),
  Q('Quanto vale <code>8\'b1111_1110</code> interpretado em complemento para dois?', ['−2', '254', '−126', '−1'], 0, 'MSB = −128, resto = 126 → −128+126 = −2. Truque: inverte e soma 1 → 0000_0010 = 2, logo é −2.'),
  G('g_hex'),
  Q('Qual o intervalo de um inteiro com sinal de 12 bits?', ['−2048 … 2047', '−4096 … 4095', '−2047 … 2048', '0 … 4095'], 0, '−2<sup>11</sup> … 2<sup>11</sup>−1.'),
], [
  G('g_twos'), G('g_bin'),
  TF('Somar dois números em complemento para dois usa exatamente o mesmo hardware que somar números sem sinal.', true, 'É a grande vantagem do complemento para dois: o somador é o mesmo; só muda a deteção de overflow.'),
  Q('Quantos bits são necessários para representar 1000 sem sinal?', ['10', '9', '11', '12'], 0, '2<sup>10</sup> = 1024 > 1000 ≥ 2<sup>9</sup> = 512. Em RTL: <code>$clog2(1001)</code>.'),
]);
L('bool', U1, 'Álgebra booleana e De Morgan', [S_.HH, S_.MIT6004], [
  T('As regras do jogo', `<p>Identidades essenciais: <code>A+0=A</code>, <code>A·1=A</code>, <code>A+A\'=1</code>, <code>A·A\'=0</code>, <code>A+AB=A</code> (absorção), <code>A+A\'B=A+B</code>.</p><div class="key"><b>De Morgan</b>: <code>(A·B)\' = A\'+B\'</code> e <code>(A+B)\' = A\'·B\'</code>. "Parte a barra, troca o operador."</div><p>Isto é o que te permite transformar lógica AND/OR em NAND/NOR — as portas mais baratas em CMOS.</p>`),
  Q('Simplifica <code>A·B + A·B\'</code>', ['A', 'B', 'A+B', '1'], 0, 'A(B+B\') = A·1 = A.'),
  T('Teorema do consenso', `<p><code>AB + A\'C + BC = AB + A\'C</code>. O termo <code>BC</code> é redundante… em lógica estática. Mas em hardware real pode ser útil manter o termo para eliminar <b>hazards</b> (glitches) quando A muda.</p>`),
  Q('Qual é o complemento de <code>(A + B\')·C</code>?', ['A\'B + C\'', 'A\'B\' + C\'', 'A\'B·C\'', 'A + B + C\''], 0, 'De Morgan: [(A+B\')C]\' = (A+B\')\' + C\' = A\'B + C\'.'),
], [
  Q('Simplifica <code>A + A\'B</code>', ['A + B', 'AB', 'A', 'B'], 0, 'Regra A + A\'B = A + B.'),
  TF('<code>A ⊕ A = 0</code> e <code>A ⊕ 1 = A\'</code>.', true, 'XOR com ele próprio dá 0; XOR com 1 inverte. Base de paridade, CRC e LFSR.'),
  Q('Quantas funções booleanas distintas de 2 entradas existem?', ['16', '4', '8', '256'], 0, 'Uma tabela de verdade tem 4 linhas; cada uma pode ser 0/1 → 2<sup>4</sup> = 16. Para n entradas: 2<sup>2<sup>n</sup></sup>.'),
  Q('Simplifica <code>(A+B)(A+C)</code>', ['A + BC', 'AB + AC', 'A + B + C', 'ABC'], 0, 'Distributividade dual: A + BC.'),
]);
L('gates', U1, 'Portas lógicas e universalidade', [S_.HH, S_.WH], [
  W('logic', { h: 'Portas básicas', b: '<p>Liga e desliga A e B. Repara que NAND/NOR são as negações de AND/OR, e XNOR é o "comparador de igualdade".</p>' }),
  T('Portas universais', `<p>Com <b>só NAND</b> (ou só NOR) constróis qualquer circuito: <code>NOT A = NAND(A,A)</code>, <code>AND = NOT(NAND)</code>, <code>OR(A,B) = NAND(A\',B\')</code>.</p><p>Em CMOS, NAND é preferida a NOR porque coloca os NMOS (rápidos) em série e os PMOS (lentos) em paralelo.</p><div class="key"><b>Pergunta clássica de entrevista</b>: "Implementa X usando só MUX 2:1." Um MUX 2:1 é universal: <code>NOT A = MUX(sel=A, in0=1, in1=0)</code>, <code>AND(A,B) = MUX(sel=A, 0, B)</code>, <code>OR(A,B) = MUX(sel=A, B, 1)</code>.</div>`),
  Q('Com um MUX 2:1 (<code>y = s ? b : a</code>), qual ligação dá <code>y = A·B</code>?', ['s=A, a=0, b=B', 's=A, a=B, b=0', 's=B, a=1, b=A', 's=A, a=1, b=B'], 0, 'Se A=0 → 0; se A=1 → B. Isso é A·B.'),
  Q('Quantas portas NAND de 2 entradas precisas para fazer um XOR?', ['4', '3', '5', '2'], 0, 'O XOR clássico com NAND usa 4 portas: n1=NAND(A,B), n2=NAND(A,n1), n3=NAND(B,n1), y=NAND(n2,n3).'),
], [
  Q('Qual destas portas NÃO é universal?', ['XOR', 'NAND', 'NOR', 'MUX 2:1 (com constantes)'], 0, 'XOR sozinho é linear (sobre GF(2)) e não consegue fazer AND.'),
  TF('Em CMOS, uma porta AND normalmente é uma NAND seguida de um inversor.', true, 'Portas CMOS estáticas são naturalmente inversoras.'),
  Q('Como fazes um inversor com uma porta XOR de 2 entradas?', ['Liga uma entrada a 1', 'Liga uma entrada a 0', 'Liga as duas entradas juntas', 'Impossível'], 0, 'A ⊕ 1 = A\'.'),
  Q('Tendo cada variável e o seu complemento disponíveis (e as constantes 0/1), um único MUX 4:1 implementa qualquer função de quantas variáveis?', ['3', '2', '4', '1'], 0, '2 variáveis nos seletores; cada entrada de dados recebe 0, 1, C ou C\' — cobre qualquer função de 3 variáveis.'),
]);
L('kmap', U1, 'Mapas de Karnaugh e hazards', [S_.HH, S_.MIT6004], [
  T('K-maps em 1 minuto', `<p>Um K-map organiza a tabela de verdade em código Gray, para que células adjacentes difiram num só bit. Agrupa <b>1s</b> em retângulos de 1, 2, 4, 8… (potências de 2), o maior possível; os grupos podem dar a volta às bordas.</p><p>Cada grupo vira um <b>produto</b>; a soma dos grupos é a forma <b>SOP mínima</b>. Os <b>don\'t cares (X)</b> podem ser usados como 1 se ajudarem.</p>`),
  Q('Num K-map de 4 variáveis, um grupo de 4 células elimina quantas variáveis?', ['2', '1', '3', '4'], 0, 'Grupo de 2<sup>k</sup> células elimina k variáveis: 4 = 2² → elimina 2, sobra um termo de 2 literais.'),
  T('Hazards estáticos', `<p>Em <code>F = AB + A\'C</code>, com B=C=1, quando A muda, F deveria ficar 1 — mas o inversor de A atrasa e pode haver um <b>glitch para 0</b> (hazard estático-1). Solução: acrescentar o termo de consenso <code>BC</code>.</p><div class="warn">Em design síncrono, glitches na lógica combinacional normalmente não importam (o flop só amostra no flanco). <b>Importam</b> em sinais de relógio, resets assíncronos e sinais que cruzam domínios de relógio — nunca passes lógica combinacional para um sincronizador!</div>`),
  Q('Porque é que um sinal que cruza domínio de relógio deve sair diretamente de um flip-flop?', ['Para evitar que glitches combinacionais sejam amostrados pelo domínio destino', 'Porque poupa área', 'Porque a ferramenta de síntese obriga', 'Para reduzir o skew do relógio'], 0, 'O domínio destino amostra em instantes não relacionados; um glitch pode ser capturado como pulso falso.'),
], [
  Q('Minimiza <code>F(A,B,C) = Σm(0,2,4,6)</code>', ['C\'', 'A\'', 'B\'C\'', 'A\'C\''], 0, 'Os mintermos 0,2,4,6 são todos os casos com C=0.'),
  Q('Minimiza <code>F(A,B,C) = Σm(3,5,6,7)</code>', ['AB + AC + BC', 'A + B + C', 'ABC', 'AB + C'], 0, 'É a função maioria (majority) — o carry-out de um full adder.'),
  TF('Don\'t cares devem ser sempre tratados como 1.', false, 'Usa-os como 1 só quando aumentam um grupo; caso contrário, como 0.'),
  Q('A ordem das linhas/colunas de um K-map de 2 variáveis é:', ['00, 01, 11, 10', '00, 01, 10, 11', '00, 10, 01, 11', '11, 10, 01, 00'], 0, 'Código Gray: só um bit muda entre vizinhos.'),
]);
L('comb', U1, 'Blocos combinacionais: MUX, decoder, encoder de prioridade', [S_.HH, S_.HDLB], [
  T('Os tijolos', `<ul><li><b>MUX N:1</b>: escolhe 1 de N entradas com log₂N bits de seleção.</li><li><b>Decoder n→2<sup>n</sup></b>: produz one-hot (ex: selecionar registo/linha de memória).</li><li><b>Encoder</b>: one-hot → binário. <b>Encoder de prioridade</b>: se vários bits estão a 1, devolve o de maior (ou menor) prioridade.</li></ul>`),
  T('Em SystemVerilog', CODE(`
// encoder de prioridade: índice do bit 1 menos significativo
always_comb begin
  idx   = '0;
  valid = 1'b0;
  for (int i = N-1; i >= 0; i--)   // o último a escrever ganha
    if (req[i]) begin idx = i; valid = 1'b1; end
end`) + `<p>O loop é desenrolado em hardware: é uma cadeia de prioridade. Repara nos valores <b>default</b> antes do loop — evitam latches.</p>`),
  Q('Um MUX 32:1 precisa de quantos bits de seleção?', ['5', '32', '4', '6'], 0, 'log₂32 = 5.'),
  Q('Qual expressão isola o bit 1 menos significativo de <code>x</code> (ex: 0b0110_1000 → 0b0000_1000)?', ['<code>x & (~x + 1)</code>', '<code>x | (x − 1)</code>', '<code>x ^ (x >> 1)</code>', '<code>x & (x − 1)</code>'], 0, '<code>x & -x</code> isola o LSB a 1. Usado em árbitros de prioridade fixa. (<code>x & (x−1)</code> <i>apaga</i> esse bit.)'),
], [
  Q('Um decoder 3→8 produz:', ['Um vetor one-hot de 8 bits', 'Um número binário de 3 bits', 'Um vetor thermometer', 'Um código Gray'], 0, 'Exatamente uma saída ativa por combinação de entrada.'),
  TF('<code>x & (x−1) == 0</code> (com x≠0) indica que x é potência de 2.', true, 'Uma potência de 2 tem exatamente um bit a 1; x−1 apaga-o.'),
  Q('Quantos MUX 2:1 são necessários para fazer um MUX 8:1 em árvore?', ['7', '8', '4', '3'], 0, '4 + 2 + 1 = 7 (em geral N−1).'),
  Q('Qual a profundidade lógica (em níveis de MUX 2:1) de um MUX 16:1 em árvore?', ['4', '16', '8', '15'], 0, 'log₂16 = 4 níveis.'),
]);
L('adders', U1, 'Somadores: ripple-carry, carry-lookahead e overflow', [S_.HH, S_.WH, S_.EECS151], [
  T('Full adder', `<p><code>S = A ⊕ B ⊕ Cin</code><br><code>Cout = AB + Cin(A ⊕ B)</code> (maioria de A,B,Cin)</p><p><b>Ripple-carry</b>: N full adders em cadeia — o carry atravessa todos: atraso <b>O(N)</b>.</p>`),
  T('Lookahead e prefixo', `<p>Define por bit: <b>Generate</b> <code>G=AB</code>, <b>Propagate</b> <code>P=A⊕B</code>. Então <code>C<sub>i+1</sub> = G<sub>i</sub> + P<sub>i</sub>C<sub>i</sub></code>. Combinando (G,P) em árvore (Kogge-Stone, Brent-Kung, Sklansky) obtém-se atraso <b>O(log N)</b> — é o que a síntese escolhe quando o timing aperta.</p><div class="key"><b>Overflow com sinal</b>: ocorre quando os dois operandos têm o mesmo sinal e o resultado tem sinal diferente; equivalente a <code>C<sub>in,MSB</sub> ⊕ C<sub>out,MSB</sub></code>.</div>`),
  Q('Em 8 bits com sinal, <code>100 + 50</code> dá:', ['Overflow (resultado lido como −106)', '150 sem problema', 'Overflow (resultado lido como 22)', 'Carry out mas sem overflow'], 0, '150 > 127. 150 − 256 = −106.'),
  G('g_ripple'),
], [
  Q('Kogge-Stone tem atraso:', ['O(log N) com muita área/fios', 'O(N)', 'O(√N)', 'O(1)'], 0, 'Árvore de prefixo com fan-out mínimo e muitos fios.'),
  TF('Somar dois números sem sinal de 8 bits pode precisar de 9 bits para o resultado.', true, '255+255 = 510 precisa de 9 bits.'),
  Q('Carry-select adder:', ['Calcula a metade superior com Cin=0 e Cin=1 em paralelo e escolhe com MUX', 'Usa lookahead em todos os bits', 'É um ripple com 2 cadeias em série', 'Só funciona para subtração'], 0, 'Troca área por velocidade.'),
  Q('Subtração A − B num somador faz-se com:', ['A + ~B com Cin = 1', 'A + B com Cin = 1', 'A + ~B com Cin = 0', '~A + B com Cin = 1'], 0, '−B = ~B + 1.'),
]);
L('mult', U1, 'Multiplicadores, shifters e aritmética eficiente', [S_.HH, S_.WH], [
  T('Multiplicar', `<p>Multiplicação binária = soma de produtos parciais deslocados (AND de cada bit). Para N×N bits o resultado tem <b>2N bits</b>.</p><ul><li><b>Array</b>: simples, O(N) atraso.</li><li><b>Wallace/Dadda tree</b>: reduz produtos parciais com compressores 3:2 (full adders) em O(log N), depois um somador final rápido.</li><li><b>Booth radix-4</b>: reduz para ~N/2 produtos parciais codificando pares de bits (−2,−1,0,+1,+2).</li></ul>`),
  T('Constantes e shifters', `<p>Multiplicar por constante = shifts e somas: <code>x*10 = (x<<3) + (x<<1)</code>. <code>x*7 = (x<<3) − x</code>.</p><p><b>Barrel shifter</b> de N bits: log₂N estágios de MUX, cada um desloca por 2<sup>k</sup> ou não.</p>`),
  Q('Quantos estágios tem um barrel shifter de 32 bits?', ['5', '32', '16', '6'], 0, 'Estágios de 1, 2, 4, 8, 16.'),
  Q('<code>x * 15</code> com shifts:', ['(x<<4) − x', '(x<<4) + x', '(x<<3) + (x<<1)', '(x<<4) − 1'], 0, '16x − x = 15x.'),
], [
  Q('Produto de dois números de 16 bits sem sinal precisa de:', ['32 bits', '16 bits', '17 bits', '24 bits'], 0, '(2<sup>16</sup>−1)² < 2<sup>32</sup>.'),
  TF('Um compressor 3:2 é simplesmente um full adder.', true, 'Recebe 3 bits do mesmo peso e produz soma (peso 1) e carry (peso 2).'),
  Q('Shift aritmético à direita de <code>8\'sb1001_0000</code> por 2:', ['1110_0100', '0010_0100', '1001_0000', '0100_0000'], 0, 'Replica o bit de sinal (1).'),
  Q('Booth radix-4 para operandos de 16 bits gera aproximadamente quantos produtos parciais?', ['8 (+1)', '16', '4', '32'], 0, 'Recodifica 2 bits por dígito → ~N/2.'),
]);
L('latchff', U1, 'Latches vs flip-flops', [S_.HH, S_.WH, S_.MIT6004], [
  T('Nível vs flanco', `<p><b>Latch D</b>: transparente enquanto CLK=1 (a saída segue D); retém quando CLK=0. É <b>sensível ao nível</b>.</p><p><b>Flip-flop D</b>: só amostra D no <b>flanco</b> (ascendente). Construído com duas latches em série (master-slave) com relógios opostos.</p>`),
  T('Porque é que o RTL moderno usa flops', `<p>Flops tornam o timing simples: cada caminho começa e acaba num flanco. Latches permitem <b>time borrowing</b> (um estágio lento "empresta" tempo do seguinte) e são usados em designs de alto desempenho e em <b>clock gating (ICG)</b>, mas complicam STA.</p><div class="warn">Latches <b>inferidos acidentalmente</b> (por um <code>if</code> sem <code>else</code> em lógica combinacional) são um dos bugs mais comuns de RTL — e perguntado em entrevistas.</div>`),
  Q('Duas latches D em série, com relógios complementares, formam:', ['Um flip-flop master-slave', 'Um MUX', 'Um contador', 'Um sincronizador'], 0, 'A master é transparente com CLK=0, a slave com CLK=1 → captura no flanco ascendente.'),
  Q('O que é time borrowing?', ['Um estágio de latch pode usar parte do tempo do estágio seguinte porque a latch está transparente', 'Usar o skew para corrigir hold', 'Partilhar flops entre dois relógios', 'Usar multicycle paths'], 0, 'Como a latch é transparente durante meio período, dados atrasados ainda passam.'),
], [
  TF('Um latch D é sensível ao flanco.', false, 'É sensível ao nível.'),
  Q('Quantos transístores tem tipicamente um flip-flop D estático standard-cell (aprox.)?', ['~20–24', '~4', '~6', '~100'], 0, 'Master-slave com transmission gates e inversores: ~20–24 transístores. (Uma célula SRAM 6T tem 6.)'),
  Q('Um SR latch com S=R=1 (versão NOR) é:', ['Estado proibido/indefinido ao libertar', 'Reset', 'Set', 'Toggle'], 0, 'Ambas as saídas vão a 0; ao libertar simultaneamente, o estado final é imprevisível.'),
  Q('Um T flip-flop com T=1 em cada flanco:', ['Divide a frequência por 2', 'Mantém a saída', 'Faz reset', 'Duplica a frequência'], 0, 'Alterna a cada flanco → período duplica.'),
]);
L('timing', U1, 'Timing síncrono: setup, hold e frequência máxima', [S_.HH, S_.WH, S_.EECS151], [
  T('As duas inequações que vais usar a vida toda', `<p><b>Setup</b> (caminho mais lento): <code>T<sub>clk</sub> ≥ t<sub>cq</sub> + t<sub>pd,lógica</sub> + t<sub>setup</sub> − t<sub>skew</sub></code></p><p><b>Hold</b> (caminho mais rápido): <code>t<sub>cq,min</sub> + t<sub>cd,lógica</sub> ≥ t<sub>hold</sub> + t<sub>skew</sub></code></p><p>(skew = chegada do relógio no flop de captura − no de lançamento)</p><div class="key">O hold <b>não depende da frequência</b>. Uma violação de hold não se corrige baixando o relógio — o chip simplesmente não funciona. Corrige-se com buffers de atraso no caminho de dados.</div>`),
  W('slack', { h: 'Calculadora de folga', b: '<p>Aumenta o atraso lógico até violar setup. Depois experimenta skew positivo (o relógio chega mais tarde ao flop de captura) e vê como ajuda o setup.</p>' }),
  Q('Skew positivo (captura recebe o relógio mais tarde) é bom para… e mau para…', ['Bom para setup, mau para hold', 'Bom para hold, mau para setup', 'Bom para ambos', 'Mau para ambos'], 0, 'Dá mais tempo ao caminho lento, mas o dado novo pode chegar antes do hold do flanco "antigo" do flop de captura.'),
  G('g_fmax'),
], [
  G('g_slack'), G('g_hold'),
  TF('Uma violação de hold pode ser corrigida reduzindo a frequência do relógio.', false, 'A inequação de hold não tem T<sub>clk</sub>.'),
  Q('Qual destas é a forma típica de corrigir uma violação de setup?', ['Pipelining / reduzir lógica / células mais rápidas (upsizing, low-Vt)', 'Inserir buffers no caminho de dados', 'Aumentar o hold time', 'Aumentar o skew negativo'], 0, 'Buffers corrigem hold, não setup.'),
]);
L('fsm', U1, 'Máquinas de estados: Moore vs Mealy', [S_.HH, S_.MIT6111, S_.CUM], [
  T('Moore e Mealy', `<p><b>Moore</b>: saídas dependem só do estado → saídas sem glitches, mas reagem um ciclo depois.</p><p><b>Mealy</b>: saídas dependem do estado <i>e</i> das entradas → reação no mesmo ciclo, menos estados, mas a saída é combinacional a partir da entrada.</p>`),
  T('Detetor de sequência 1011 (com sobreposição)', `<p>Estados = "quanto da sequência já vi": S0 (nada), S1 ("1"), S2 ("10"), S3 ("101"). Mealy: em S3 com entrada 1 → saída 1 e vai para S1 (o último "1" pode começar nova sequência).</p>` + CODE(`
typedef enum logic [1:0] {S0, S1, S2, S3} state_t;
state_t st, nx;
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) st <= S0; else st <= nx;
always_comb begin
  nx = st; det = 1'b0;
  unique case (st)
    S0: nx = x ? S1 : S0;
    S1: nx = x ? S1 : S2;
    S2: nx = x ? S3 : S0;
    S3: begin nx = x ? S1 : S2; det = x; end
  endcase
end`)),
  Q('No detetor 1011 com sobreposição, estando em S3 ("101") e chega 0, o próximo estado é:', ['S2 ("10")', 'S0', 'S1', 'S3'], 0, '"1010": o sufixo "10" é prefixo de 1011.'),
  Q('Quantos estados mínimos tem um detetor Moore da sequência 1011?', ['5', '4', '3', '6'], 0, 'Moore precisa de um estado extra para "detetado" (saída associada ao estado).'),
], [
  TF('As saídas de uma máquina Moore podem mudar a meio do ciclo quando a entrada muda.', false, 'Só dependem do estado (registado).'),
  Q('One-hot com N estados usa quantos flops?', ['N', 'log₂N', 'N/2', '2N'], 0, 'Um flop por estado. Lógica de próximo estado mais simples e rápida — popular em FPGA.'),
  Q('Codificação Gray de estados é útil para:', ['Reduzir comutação quando as transições são sequenciais', 'Menos flops que binário', 'Evitar o reset', 'Detetar erros'], 0, 'Só um bit muda entre estados consecutivos.'),
  Q('Numa FSM, o que acontece se o estado ficar num valor ilegal (ex: one-hot com 2 bits a 1)?', ['Depende da lógica — deve haver um default que recupera para um estado seguro', 'É impossível', 'A síntese corrige sempre', 'O simulador termina'], 0, 'FSMs robustas tratam estados ilegais (importante com SEU/radiação e após reset mal feito).'),
]);
L('counters', U1, 'Contadores, LFSR e divisores de relógio', [S_.HH, S_.MIT6111], [
  T('Contadores e LFSRs', `<p>Contador binário: soma 1 → tem um somador (carry chain). <b>LFSR</b> (Linear Feedback Shift Register): shift + XOR em algumas posições (taps). Com polinómio primitivo, percorre <b>2<sup>n</sup>−1</b> estados (todos menos zero). Muito barato: usado para PRBS, BIST, scramblers, CRC.</p>` + CODE(`
// LFSR 8 bits Fibonacci, taps 8,6,5,4 (x^8+x^6+x^5+x^4+1)
always_ff @(posedge clk)
  if (!rst_n) q <= 8'h01;      // nunca zero!
  else        q <= {q[6:0], q[7]^q[5]^q[4]^q[3]};`)),
  T('Dividir por 3 com duty cycle de 50%', `<p>Clássico de entrevista. Um contador mod-3 dá duty 33%. Truque: gera um sinal no flanco ascendente e outro igual atrasado meio ciclo (amostrado no flanco <b>descendente</b>), e faz <b>OR</b> dos dois → 1,5 ciclos alto em 3 → 50%.</p><div class="warn">Na prática, em ASIC, relógios gerados assim exigem cuidado (definir <code>create_generated_clock</code> na STA, usar células de relógio dedicadas). Prefere-se PLL/clock dividers da biblioteca.</div>`),
  Q('Quantos estados percorre um LFSR de 5 bits de comprimento máximo?', ['31', '32', '30', '16'], 0, '2⁵ − 1 = 31.'),
  Q('Porque é que o LFSR não pode começar a zeros (XOR feedback)?', ['Fica preso em zero para sempre', 'Conta para trás', 'Gera só o valor 1', 'Não há problema'], 0, 'XOR de zeros é zero.'),
], [
  Q('Um contador Johnson (twisted ring) de N flops tem quantos estados?', ['2N', 'N', '2^N', '2^N−1'], 0, 'Ex: 4 flops → 8 estados.'),
  Q('Um ring counter (one-hot rotativo) de N flops tem:', ['N estados', '2N estados', '2^N estados', 'N−1 estados'], 0, 'O "1" roda por N posições.'),
  TF('Um divisor de relógio feito com um flop (Q\' ligado a D) divide por 2 com duty cycle de 50%.', true, 'Alterna a cada flanco ascendente.'),
  G('g_lfsr'),
]);

/* ======================= U2 — RTL EM SYSTEMVERILOG ======================= */
const U2 = 'U2 · RTL em (System)Verilog';
L('svbasic', U2, 'Módulos, tipos e always_comb / always_ff', [S_.SUTH, S_.HDLB, S_.CHIPV], [
  T('Pensar em hardware, não em software', `<p>Cada linha de RTL descreve <b>hardware que existe em paralelo</b>. <code>always_ff</code> → flops; <code>always_comb</code> / <code>assign</code> → portas.</p>` + CODE(`
module acc #(parameter int W = 16) (
  input  logic         clk, rst_n, en,
  input  logic [W-1:0] din,
  output logic [W-1:0] sum
);
  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n)  sum <= '0;
    else if (en) sum <= sum + din;
endmodule`) + `<p><code>logic</code> substitui <code>reg</code>/<code>wire</code> na maioria dos casos. <code>'0</code> preenche com zeros qualquer largura.</p>`),
  Q('Em <code>always_ff</code>, se <code>en=0</code> e não há <code>else</code>, o que acontece a <code>sum</code>?', ['Mantém o valor (o flop tem enable)', 'Infere-se um latch indesejado', 'Vai a zero', 'Fica X'], 0, 'Em lógica sequencial é normal e desejado: vira um flop com enable (ou MUX de realimentação / clock gating).'),
  Q('Qual a largura de <code>{4\'hA, 2\'b01, 1\'b1}</code>?', ['7 bits', '3 bits', '8 bits', '6 bits'], 0, '4+2+1.'),
], [
  Q('<code>{3{2\'b10}}</code> é:', ['6\'b101010', '6\'b111000', '3\'b101', '2\'b10 repetido em 3 ciclos'], 0, 'Replicação.'),
  TF('<code>always_comb</code> é sensível automaticamente a todas as entradas lidas e avalia uma vez no tempo zero.', true, 'Diferente de <code>always @*</code>, que não avalia em t=0.'),
  Q('<code>8\'d200 + 8\'d100</code> atribuído a um <code>logic [7:0]</code> dá:', ['44', '300', '255', 'X'], 0, '300 mod 256 = 44 (o carry perde-se).'),
  F('Qual o operador de redução que dá 1 se TODOS os bits de <code>v</code> forem 1? Escreve-o aplicado: ?v', ['&v', '&'], '<code>&v</code> (AND de redução). <code>|v</code> = algum bit a 1, <code>^v</code> = paridade.'),
]);
L('nba', U2, 'Atribuições blocking vs non-blocking', [S_.CUM, S_.SUTH], [
  T('A regra de ouro (Cummings, SNUG 2000)', `<ol><li>Lógica sequencial (<code>always_ff</code>): usa <b>non-blocking</b> <code>&lt;=</code>.</li><li>Lógica combinacional (<code>always_comb</code>): usa <b>blocking</b> <code>=</code>.</li><li>Nunca mistures os dois no mesmo bloco.</li><li>Nunca atribuas a mesma variável em dois blocos always.</li></ol>`),
  T('Porque importa', CODE(`
// Shift register de 3 estágios — CORRETO
always_ff @(posedge clk) begin
  q1 <= d;  q2 <= q1;  q3 <= q2;
end
// ERRADO: com blocking, q3 = q2 = q1 = d no mesmo flanco
always @(posedge clk) begin
  q1 = d;   q2 = q1;   q3 = q2;   // colapsa num só flop!
end`) + `<p>Non-blocking: todos os lados direitos são avaliados primeiro, as atualizações acontecem no fim do time-step (região NBA). Modela exatamente flops a amostrar no mesmo flanco.</p>`),
  Q('Qual o resultado de <code>always_ff @(posedge clk) begin a &lt;= b; b &lt;= a; end</code>?', ['Troca a e b a cada flanco', 'a e b ficam iguais a b', 'Erro de síntese', 'Cria um latch'], 0, 'Lados direitos são lidos com os valores antigos → swap.'),
  Q('E com <code>a = b; b = a;</code> (blocking) num bloco de relógio?', ['a e b ficam ambos com o valor antigo de b', 'Troca', 'Ficam ambos com o valor antigo de a', 'Nada muda'], 0, 'a = b primeiro; depois b = a (já novo) = b antigo.'),
], [
  TF('Usar blocking em blocos sequenciais pode criar diferenças entre simulação e o hardware sintetizado (race conditions).', true, 'Ordem de avaliação entre blocos always no mesmo evento não é definida.'),
  Q('Em que região de simulação são atualizadas as atribuições non-blocking?', ['Região NBA (depois da Active)', 'Região Active', 'Região Preponed', 'Região Reactive'], 0, 'Scheduler do IEEE 1800: Active → Inactive → NBA → Observed → Reactive…'),
  Q('Qual linha está correta para lógica combinacional?', ['<code>always_comb y = a & b;</code>', '<code>always_comb y &lt;= a & b;</code>', '<code>always_ff @* y = a & b;</code>', '<code>always @(posedge a) y = b;</code>'], 0, 'Combinacional → blocking em always_comb.'),
  OPEN('Explica a um colega júnior porque é que um shift register escrito com "=" num bloco de relógio sintetiza como um só flop.', 'Com blocking, cada atribuição atualiza imediatamente a variável; q2 = q1 lê o q1 <b>novo</b> (=d), e assim sucessivamente, logo todos ficam iguais a d no mesmo flanco. A síntese vê q3 = d e otimiza os estágios intermédios. Com <code>&lt;=</code> todos os RHS são lidos antes de qualquer atualização, modelando flops em paralelo.'),
]);
L('latchinf', U2, 'Latches inferidos, case, unique e priority', [S_.SUTH, S_.CUM], [
  T('Como nasce um latch acidental', CODE(`
always_comb begin
  if (sel) y = a;      // e quando sel==0?  -> y tem de "lembrar" -> LATCH
end
// Correção: valor default no topo
always_comb begin
  y = '0;
  if (sel) y = a;
end`) + `<p>Qualquer caminho pelo bloco combinacional em que uma saída <b>não é atribuída</b> implica memória → latch. <code>always_comb</code> faz a ferramenta avisar.</p>`),
  T('case, unique e priority', `<ul><li><code>unique case</code>: afirma que exatamente 1 ramo bate (paralelo, sem prioridade) — o simulador avisa se nenhum ou vários batem.</li><li><code>priority case</code>/<code>if-else</code>: avaliação ordenada → lógica de prioridade.</li><li>Evita <code>casex</code> (X nas entradas faz match!); se precisares, <code>casez</code> ou <code>case inside</code>.</li></ul>`),
  Q('Qual destes infere um latch?', ['<code>always_comb case(s) 2\'b00: y=a; 2\'b01: y=b; endcase</code> (s tem 2 bits)', '<code>always_comb y = s ? a : b;</code>', '<code>always_comb begin y=b; if(s) y=a; end</code>', '<code>assign y = s ? a : b;</code>'], 0, 'Faltam os casos 10 e 11 e não há default.'),
], [
  TF('Um <code>always_ff</code> com <code>if</code> sem <code>else</code> infere um latch.', false, 'Em sequencial, é um flop com enable.'),
  Q('Porque é perigoso <code>casex</code>?', ['Um X/Z na expressão de seleção pode fazer match com qualquer item, escondendo bugs', 'Não sintetiza', 'É mais lento', 'Só aceita constantes'], 0, 'X-optimism em simulação.'),
  Q('<code>unique case</code> permite à síntese:', ['Construir lógica paralela (sem cadeia de prioridade), como "parallel_case"', 'Remover o default', 'Criar latches', 'Adicionar reset'], 0, 'E o simulador verifica a assunção em runtime.'),
  OPEN('Num code review vês um bloco combinacional com 30 saídas e muitos if/case. Que técnicas usas para garantir que não infere latches?', 'Atribuir valores default a <b>todas</b> as saídas no topo do <code>always_comb</code>; usar <code>default</code> em todos os case; usar <code>always_comb</code> (lint/síntese avisam); correr lint (Spyglass/Verilator -Wall) e verificar o relatório de síntese por "latch inferred"; dividir em blocos menores, um por grupo de saídas.'),
]);
L('reset', U2, 'Resets síncronos, assíncronos e sincronizador de reset', [S_.CUM, S_.WH], [
  T('Síncrono vs assíncrono', `<table><tr><th></th><th>Síncrono</th><th>Assíncrono</th></tr><tr><td>Atua</td><td>no flanco do relógio</td><td>imediatamente</td></tr><tr><td>Precisa de relógio?</td><td>sim</td><td>não</td></tr><tr><td>Lógica</td><td>reset entra no caminho de dados</td><td>flop com pino de reset dedicado</td></tr><tr><td>Risco</td><td>pulsos curtos ignorados</td><td><b>desativação</b> perto do flanco → metastabilidade (recovery/removal)</td></tr></table>`),
  T('Ativação assíncrona, desativação síncrona', `<p>A prática recomendada (Cummings, "Asynchronous & Synchronous Reset Design Techniques"):</p>` + CODE(`
module rst_sync (input logic clk, arst_n, output logic rst_n);
  logic r1;
  always_ff @(posedge clk or negedge arst_n)
    if (!arst_n) {rst_n, r1} <= '0;     // entra já
    else         {rst_n, r1} <= {r1, 1'b1}; // sai sincronizado
endmodule`) + `<p>Um por domínio de relógio. Recovery/removal são o "setup/hold" do reset assíncrono.</p>`),
  Q('Recovery e removal time são análogos a…', ['Setup e hold para a desativação do reset assíncrono', 'Atraso do clock tree', 'Tempo de propagação do reset', 'Margens de ruído'], 0, 'A desativação do reset deve respeitar uma janela em torno do flanco.'),
], [
  TF('Com reset assíncrono, o reset funciona mesmo sem relógio a correr.', true, 'É uma das razões para o usar (ex: power-on).'),
  Q('Porque é que muitos datapaths grandes (ex: pipelines de dados de GPU) não têm reset nos flops de dados?', ['Poupa área/rotas e potência; só o controlo (valid, estados) precisa de reset', 'Reset é proibido em ASIC', 'Para evitar latches', 'Porque o STA não suporta'], 0, 'Se o "valid" for resetado, os dados podem ficar com lixo sem problema.'),
  Q('Quantos flops tem tipicamente o sincronizador de reset?', ['2 (ou mais)', '1', '0', '4 obrigatório'], 0, 'Como um sincronizador CDC.'),
  OPEN('Pergunta de entrevista: "Reset síncrono ou assíncrono? Qual preferes e porquê?"', 'Não há resposta única: assíncrono funciona sem relógio e não carrega o caminho de dados, mas a desativação tem de ser sincronizada (reset synchronizer) e é sensível a glitches; síncrono é imune a glitches curtos, facilita STA e não precisa de flops especiais, mas exige relógio ativo e acrescenta lógica ao caminho D. Prática comum: <b>assert assíncrono, deassert síncrono</b>, um sincronizador por domínio, e resetar só controlo.'),
]);
L('param', U2, 'Parâmetros, generate e arrays', [S_.SUTH, S_.CHIPV], [
  T('Hardware reutilizável', CODE(`
module sync_fifo #(parameter int W = 32, D = 16, localparam int AW = $clog2(D)) (...);

genvar i;
generate for (i = 0; i < N; i++) begin : g_lane
  lane #(.W(W)) u_lane (.clk, .din(din[i]), .dout(dout[i]));
end endgenerate

logic [3:0][7:0] packed_word;   // packed: 32 bits contíguos
logic [7:0] mem [0:255];        // unpacked: 256 elementos (memória)`) + `<p><b>Packed</b> = um vetor de bits (pode fazer aritmética). <b>Unpacked</b> = array de elementos (memórias, RAMs).</p>`),
  Q('<code>$clog2(17)</code> é:', ['5', '4', '17', '6'], 0, 'Teto de log₂17 = 5.'),
], [
  TF('Um <code>generate for</code> cria hardware replicado em elaboração, não um loop em runtime.', true, ''),
  Q('Para um contador que vai de 0 a D (inclusive), quantos bits?', ['$clog2(D+1)', '$clog2(D)', 'D', '$clog2(D)−1'], 0, 'Ex: D=16 → precisa representar 16 → 5 bits. Bug clássico em FIFOs!'),
  Q('<code>logic [3:0][7:0] w; w[2]</code> refere-se a:', ['8 bits (byte 2)', '4 bits', '1 bit', '32 bits'], 0, 'Primeira dimensão packed indexa bytes.'),
  Q('Qual a diferença entre <code>parameter</code> e <code>localparam</code>?', ['localparam não pode ser sobreposto na instanciação', 'localparam é só para simulação', 'parameter não pode ter tipo', 'Não há diferença'], 0, ''),
]);
L('fsmcode', U2, 'Estilos de codificação de FSM e one-hot', [S_.CUM, S_.SUTH], [
  T('O estilo recomendado', `<p>Dois blocos (Cummings, "Synthesizable FSM Design Techniques"): um <code>always_ff</code> só para o registo de estado, um <code>always_comb</code> para próximo estado + saídas. Para saídas sem glitches, <b>regista as saídas</b> (3.º bloco, ou saídas codificadas no estado).</p>`),
  T('Codificações', `<table><tr><th>Codificação</th><th>Flops</th><th>Quando</th></tr><tr><td>Binária</td><td>log₂N</td><td>ASIC, muitos estados, área</td></tr><tr><td>One-hot</td><td>N</td><td>FPGA, velocidade, lógica simples</td></tr><tr><td>Gray</td><td>log₂N</td><td>transições sequenciais, baixa potência</td></tr></table>`),
  Q('Numa FSM one-hot de 8 estados, a lógica para "estou no estado 5" é:', ['Ler um único flop: state[5]', 'Comparar 3 bits', 'Um decoder 3→8', 'Um somador'], 0, 'É por isso que é rápida.'),
], [
  TF('Registar as saídas de uma FSM acrescenta um ciclo de latência mas elimina glitches.', true, 'Alternativa: saídas como bits do próprio estado.'),
  Q('Qual NÃO é vantagem do one-hot?', ['Menos flops', 'Lógica de próximo estado simples', 'Decodificação de saídas rápida', 'Fácil de depurar'], 0, ''),
  Q('Usar <code>typedef enum</code> para estados ajuda porque:', ['Dá nomes legíveis nas waveforms e verificação de tipos', 'Reduz área', 'Torna a FSM assíncrona', 'Obriga a one-hot'], 0, ''),
  OPEN('Desenha (descreve) uma FSM para um semáforo com botão de peões. Que estados e saídas escolhes?', 'Estados: VERDE_CARROS, AMARELO, VERMELHO_CARROS/VERDE_PEOES, PISCA_PEOES, com contador de tempo partilhado (carregado na entrada de cada estado). Entrada: pedido de peões registado (e sincronizado/debounced — vem de um botão!). Saídas Moore (luzes) para não haver glitches. Considerar tempo mínimo de verde, estado seguro por omissão (todos vermelhos) após reset.'),
]);
L('tb', U2, 'Testbenches e assertions (SVA)', [S_.SVA, S_.CHIPV, S_.SUTH], [
  T('Um testbench mínimo útil', CODE(`
module tb;
  logic clk = 0, rst_n;
  always #5 clk = ~clk;                       // 100 MHz
  dut u_dut (.*);
  initial begin
    rst_n = 0; repeat (3) @(posedge clk); rst_n = 1;
    for (int i = 0; i < 1000; i++) begin
      @(posedge clk); din <= $urandom; en <= $urandom_range(0,1);
    end
    $display("PASS"); $finish;
  end
  // modelo de referência + comparação = scoreboard
endmodule`) + `<p>Estímulo aleatório + <b>modelo de referência</b> + <b>checker</b> automático. Nunca verifiques só "a olhar para as ondas".</p>`),
  T('Assertions concorrentes', CODE(`
// todo o pedido recebe grant em 1 a 3 ciclos
a_req_gnt: assert property (@(posedge clk) disable iff (!rst_n)
  req |-> ##[1:3] gnt);
// FIFO: nunca escrever quando cheio
a_no_ovf: assert property (@(posedge clk) disable iff (!rst_n)
  !(wr_en && full));
// valid só cai depois de handshake
a_valid_stable: assert property (@(posedge clk) disable iff (!rst_n)
  valid && !ready |=> valid && $stable(data));`) + `<p><code>|-></code> sobreposto (mesmo ciclo), <code>|=></code> não sobreposto (ciclo seguinte).</p>`),
  Q('<code>a |=> b</code> é equivalente a:', ['<code>a |-> ##1 b</code>', '<code>a |-> b</code>', '<code>b |-> a</code>', '<code>a ##1 b</code> sem implicação'], 0, ''),
], [
  Q('O que faz <code>$stable(data)</code>?', ['Verdadeiro se data tem o mesmo valor que no ciclo anterior', 'Verdadeiro se data não tem X', 'Força data a manter-se', 'Conta mudanças'], 0, ''),
  TF('Em testbench, aplicar estímulo com <code>&lt;=</code> após <code>@(posedge clk)</code> evita races com o DUT.', true, 'Ou usa clocking blocks.'),
  Q('<code>disable iff (!rst_n)</code> serve para:', ['Desligar a assertion durante o reset', 'Fazer reset ao DUT', 'Ignorar X', 'Repetir a verificação'], 0, ''),
  OPEN('Como verificarias um FIFO síncrono?', 'Modelo de referência (fila SV <code>q[$]</code>) atualizado em cada push/pop; scoreboard compara dados à saída; estímulo aleatório com taxas variáveis de leitura/escrita (incluir rajadas, cheio, vazio, push+pop simultâneos); assertions (sem overflow/underflow, full e empty nunca juntos, contador = nº de elementos); cobertura funcional (atingiu cheio, vazio, push&pop no cheio, wrap-around dos ponteiros); testes dirigidos para cantos; reset a meio.'),
]);
L('synth', U2, 'Síntese vs simulação: o que (não) sintetiza', [S_.CUM, S_.SUTH, S_.EECS151], [
  T('Armadilhas sim/síntese', `<ul><li><code>#10</code> atrasos: ignorados na síntese.</li><li><code>initial</code>: geralmente ignorado em ASIC (OK em algumas FPGAs).</li><li>Lista de sensibilidade incompleta (<code>always @(a)</code> que lê b): a simulação não reavalia quando b muda; a síntese cria lógica normal → <b>mismatch</b>. Usa <code>always_comb</code>.</li><li><b>X-optimism</b>: <code>if (x_sig)</code> com X toma o ramo else na simulação — esconde bugs. Hardware real é 0 ou 1.</li><li><code>===</code>, <code>$display</code>, loops com limites dinâmicos: não sintetizáveis.</li></ul>`),
  Q('Um <code>for</code> com limite constante dentro de <code>always_comb</code>:', ['Sintetiza (é desenrolado)', 'Nunca sintetiza', 'Infere um contador', 'Só sintetiza em FPGA'], 0, ''),
  Q('Porque é que <code>if (sel)</code> com sel=X é perigoso em simulação?', ['O simulador toma o ramo else como se sel fosse 0, escondendo um bug de inicialização', 'Gera erro de compilação', 'Para a simulação', 'Não há problema'], 0, 'X-optimism. Gate-level sim ou assertions de "não X" ajudam (<code>assert(!$isunknown(sel))</code>).'),
], [
  TF('<code>assign #5 y = a;</code> gera um atraso de 5 unidades no chip.', false, 'Atrasos são ignorados na síntese.'),
  Q('O operador <code>/</code> com divisor variável:', ['Sintetiza mas gera hardware enorme e lento — normalmente faz-se divisor iterativo', 'Nunca sintetiza', 'É um shift', 'Só em simulação'], 0, 'Divisão por potências de 2 constantes é shift.'),
  Q('Lint (ex: Spyglass, Verilator -Wall) serve para:', ['Detetar problemas estruturais (larguras, latches, CDC, multiplas drivers) antes da simulação', 'Fazer place & route', 'Medir potência', 'Gerar testbenches'], 0, ''),
  Q('Qual NÃO sintetiza?', ['<code>wait (a == 1);</code> num bloco RTL', '<code>assign y = a ^ b;</code>', '<code>always_ff @(posedge clk) q <= d;</code>', '<code>case</code> com default'], 0, ''),
]);
