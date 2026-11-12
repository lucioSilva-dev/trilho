/* Silício — Linguagens e ferramentas da indústria (inseridas no percurso junto da matéria relacionada) */
const S_T = {
  VERI: SRC('Verilator — manual', 'https://verilator.org/guide/latest/'),
  COCO: SRC('cocotb — documentação', 'https://docs.cocotb.org/'),
  YOSYS: SRC('Yosys — manual', 'https://yosyshq.readthedocs.io/'),
  SBY: SRC('SymbiYosys (formal open-source)', 'https://symbiyosys.readthedocs.io/'),
  UVM: SRC('Accellera UVM 1.2 / IEEE 1800.2', 'https://www.accellera.org/downloads/standards/uvm'),
  VUVM: SRC('Verification Academy (Siemens) — UVM e SVA', 'https://verificationacademy.com/'),
  OROAD: SRC('OpenROAD — fluxo RTL→GDS open-source', 'https://theopenroadproject.org/'),
  SDC: SRC('Synopsys Design Constraints (SDC) — formato aberto, OpenSTA', 'https://github.com/The-OpenROAD-Project/OpenSTA'),
  TCL: SRC('Tcl — tutorial oficial', 'https://www.tcl-lang.org/man/tcl/tutorial/tcltutorial.html'),
  MIS: SRC('The Missing Semester (MIT) — shell, Git, Make', 'https://missing.csail.mit.edu/'),
  GHDL: SRC('GHDL — simulador VHDL', 'https://github.com/ghdl/ghdl'),
};
const TL = [];
const LT = (after, id, title, src, cards, quiz) => TL.push({ after, l: { id, unit: '', title, src, cards, quiz, tool: true } });

LT('fsm', 'langs', 'Linguagens de hardware: Verilog, SystemVerilog, VHDL e companhia', [S_.SUTH, S_.CHIPV, S_T.GHDL], [
  T('O mapa das linguagens', `<p>Num emprego de RTL vais usar várias linguagens, cada uma com o seu papel:</p>
  <table><tr><th>Linguagem</th><th>Para quê</th><th>Onde aparece</th></tr>
  <tr><td><b>SystemVerilog (IEEE 1800)</b></td><td>RTL sintetizável + verificação (classes, assertions, cobertura)</td><td>Padrão em GPU/CPU (NVIDIA, AMD, Intel, Apple)</td></tr>
  <tr><td><b>Verilog-2001/2005</b></td><td>RTL "clássico"; subconjunto do SV</td><td>Código legado, IP de terceiros</td></tr>
  <tr><td><b>VHDL</b></td><td>RTL com tipos fortes</td><td>Europa, defesa, aeroespacial, FPGA</td></tr>
  <tr><td><b>C/C++ (e SystemC)</b></td><td>Modelos de referência, modelos de performance, HLS</td><td>Arquitetura, verificação (DPI)</td></tr>
  <tr><td><b>Python</b></td><td>Scripts, geração de vetores, cocotb, análise de resultados</td><td>Todo o lado</td></tr>
  <tr><td><b>Tcl</b></td><td>Linguagem de comando das ferramentas EDA</td><td>Síntese, STA, P&amp;R</td></tr>
  <tr><td><b>Perl / Bash / Make</b></td><td>Automação, regressões, fluxos legados</td><td>Infraestrutura de projeto</td></tr></table>
  <div class="key">Para uma vaga de RTL na NVIDIA o essencial é <b>SystemVerilog</b> + <b>Python</b> + <b>Tcl/Linux</b>. Verilog vem por arrasto; VHDL é um extra.</div>`),
  T('O mesmo flop em três dialetos', CODE(`
// Verilog-2001
always @(posedge clk or negedge rst_n)
  if (!rst_n) q <= 1'b0; else q <= d;

// SystemVerilog (intenção explícita: o lint avisa se não for flop)
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) q <= '0; else q <= d;

-- VHDL
process(clk, rst_n) begin
  if rst_n = '0' then q <= '0';
  elsif rising_edge(clk) then q <= d;
  end if;
end process;`) + `<p>O SystemVerilog acrescenta <code>logic</code>, <code>always_ff/always_comb/always_latch</code>, <code>enum</code>, <code>struct packed</code>, <code>interface</code>, <code>package</code>, <code>unique/priority case</code> — tudo isto <b>sintetiza</b> e torna o código mais seguro.</p>`),
  Q('Qual destas construções de SystemVerilog é para verificação e NÃO para RTL sintetizável?', ['<code>class</code> com <code>rand</code> e <code>constraint</code>', '<code>always_ff</code>', '<code>enum logic [1:0]</code>', '<code>struct packed</code>'], 0, 'Classes, randomização e cobertura são a metade "HVL" do SystemVerilog.'),
  Q('Porque é que equipas de GPU modelam muitas vezes o bloco em C++ antes do RTL?', ['Modelo de referência rápido para comparar resultados (scoreboard) e estudar performance', 'Porque o C++ é sintetizado diretamente para silício', 'Porque o SystemVerilog não suporta aritmética', 'Para evitar escrever testbenches'], 0, 'O modelo "golden" em C++/Python liga-se ao testbench via DPI-C ou cocotb.'),
], [
  TF('SystemVerilog é um superconjunto do Verilog: código Verilog-2005 válido é (quase sempre) SV válido.', true, 'Cuidado só com palavras novas reservadas (ex: <code>logic</code>, <code>bit</code>) usadas como nomes.'),
  Q('Em VHDL, o equivalente a <code>posedge clk</code> é:', ['<code>rising_edge(clk)</code>', '<code>clk\'high</code>', '<code>wait clk</code>', '<code>clk = 1</code>'], 0, ''),
  Q('Que linguagem usas para comandar o Design Compiler, o PrimeTime ou o Innovus?', ['Tcl', 'Python', 'Perl', 'VHDL'], 0, 'Quase todas as ferramentas EDA comerciais usam Tcl como shell.'),
]);

LT('tb', 'simtools', 'Simuladores e waveforms: Icarus, Verilator, VCS, Xcelium, Questa', [S_T.VERI, S_.CHIPV], [
  T('Dois tipos de simulador', `<ul><li><b>Event-driven</b> (Icarus Verilog, Synopsys <b>VCS</b>, Cadence <b>Xcelium</b>, Siemens <b>Questa</b>): seguem a semântica completa do LRM — atrasos, <code>#</code>, X/Z, classes UVM.</li><li><b>Cycle-based / compilado</b> (<b>Verilator</b>): converte RTL sintetizável em C++ e corre 10–100× mais depressa. Sem X (2 estados), sem atrasos. Ótimo para regressões longas e para correr software.</li></ul>
  <p>Para ver sinais: <b>GTKWave</b> / Surfer (grátis, ficheiros VCD/FST) e <b>Verdi</b> (Synopsys, padrão na indústria) ou SimVision/Visualizer.</p>`),
  T('Fluxo mínimo grátis', CODE(`
# Icarus: compilar e correr
iverilog -g2012 -o sim tb.sv dut.sv && vvp sim
gtkwave dump.vcd

# Verilator: lint + simulação com testbench em C++ ou SV
verilator --lint-only -Wall dut.sv
verilator --binary -j 0 --trace tb.sv dut.sv && ./obj_dir/Vtb`) + `<p>No testbench: <code>initial begin $dumpfile("dump.vcd"); $dumpvars(0, tb); end</code>. Sem conta nenhuma podes usar o <a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a>, que tem VCS, Xcelium e Questa no browser.</p>`),
  Q('Precisas de correr milhões de ciclos de um core RISC-V a executar Linux. Que simulador escolhes?', ['Verilator (compila para C++, muito rápido)', 'Icarus Verilog', 'Simulação gate-level', 'Simulação SPICE'], 0, 'Para isso a indústria usa também emulação (Palladium, ZeBu) e FPGA prototyping.'),
  Q('O Verilator, por omissão, modela X?', ['Não — é 2 estados (0/1); X vira 0 ou aleatório', 'Sim, 4 estados completos', 'Só em flops', 'Só com --x'], 0, 'Por isso continua a ser preciso um simulador 4 estados para apanhar bugs de reset/X.'),
], [
  Q('Qual é o visualizador de formas de onda mais usado na indústria?', ['Verdi', 'GTKWave', 'Excel', 'ModelSim PE'], 0, 'GTKWave é o equivalente grátis.'),
  TF('<code>#10</code> e atrasos funcionam no Verilator como no VCS.', false, 'O Verilator ignora/limita atrasos — é cycle-based.'),
  Q('VCD e FST são:', ['Formatos de ficheiro de waveform', 'Formatos de netlist', 'Linguagens de assertion', 'Ficheiros de restrições'], 0, 'FST é muito mais compacto que VCD.'),
]);

LT('tb', 'cocotb', 'Testbenches em Python com cocotb', [S_T.COCO], [
  T('Porquê Python para verificar RTL?', `<p>O <b>cocotb</b> corre o teu RTL num simulador (Icarus, Verilator, Questa, VCS, Xcelium) e deixa-te escrever o testbench em <b>Python</b> com <code>async/await</code>. Tens NumPy, aleatoriedade e modelos de referência de graça. Cada vez mais equipas (incluindo de GPU) usam-no para testes de bloco e para gerar estímulos.</p>`),
  T('Exemplo: testar um somador', CODE(`
import cocotb, random
from cocotb.clock import Clock
from cocotb.triggers import RisingEdge

@cocotb.test()
async def soma_aleatoria(dut):
    cocotb.start_soon(Clock(dut.clk, 10, units="ns").start())
    for _ in range(1000):
        a, b = random.randrange(256), random.randrange(256)
        dut.a.value, dut.b.value = a, b
        await RisingEdge(dut.clk)
        await RisingEdge(dut.clk)          # 1 ciclo de latência
        assert dut.s.value == (a + b) % 256, f"{a}+{b}"`) + `<p>Um <code>Makefile</code> com <code>SIM=icarus TOPLEVEL=adder MODULE=test_adder</code> e <code>include $(shell cocotb-config --makefiles)/Makefile.sim</code> e já corre com <code>make</code>.</p>`),
  Q('Em cocotb, <code>await RisingEdge(dut.clk)</code>:', ['Suspende a corrotina até ao próximo flanco ascendente do relógio', 'Gera um flanco no relógio', 'Termina o teste', 'Lê o valor do relógio'], 0, ''),
  Q('Grande vantagem do cocotb em relação a um testbench SV puro:', ['Usar bibliotecas Python (NumPy, modelos golden) e escrever testes depressa', 'Simula mais rápido que qualquer simulador', 'Sintetiza o testbench', 'Não precisa de simulador'], 0, 'O cocotb usa sempre um simulador por baixo (via VPI/VHPI).'),
], [
  TF('O cocotb substitui o simulador.', false, 'Liga-se ao simulador pela interface VPI/VHPI/FLI.'),
  Q('Para iniciar um relógio em paralelo com o teste usas:', ['<code>cocotb.start_soon(Clock(...).start())</code>', '<code>dut.clk = 1</code>', '<code>time.sleep()</code>', '<code>fork join</code>'], 0, ''),
]);

LT('synth', 'linux', 'Linux, shell, Make, Git e scripting (Python/Perl)', [S_T.MIS], [
  T('O dia a dia de um engenheiro de RTL', `<p>Todo o trabalho acontece em <b>Linux</b>, num terminal, muitas vezes num cluster de computação (LSF/Slurm). Ferramentas que vais usar todos os dias:</p>
  <ul><li><b>bash/zsh</b>: <code>grep</code>, <code>find</code>, <code>sed</code>, <code>awk</code>, pipes. Ex: <code>grep -c "UVM_ERROR" logs/*.log | grep -v ":0"</code></li><li><b>Editor</b>: Vim/Emacs/VS Code com extensão SystemVerilog.</li><li><b>Git</b> (às vezes Perforce): ramos, <code>git bisect</code> para encontrar o commit que partiu a regressão.</li><li><b>Make</b>: <code>make sim TEST=fifo_stress SEED=42</code>.</li><li><b>Python</b> (e Perl em fluxos antigos): ler logs, gerar RTL (registos a partir de uma spec), dashboards de regressão.</li><li><b>Regex</b>: para filtrar relatórios de timing e logs gigantes.</li></ul>`),
  T('Makefile típico de simulação', CODE(`
SIM   ?= verilator
TEST  ?= smoke
SEED  ?= 1
SRCS  := $(wildcard rtl/*.sv) tb/tb.sv

sim: $(SRCS)
	verilator --binary -j 0 --trace -GSEED=$(SEED) $(SRCS) -o sim_$(TEST)
	./obj_dir/sim_$(TEST) +TEST=$(TEST) | tee logs/$(TEST)_$(SEED).log

regress:
	for s in 1 2 3 4 5; do $(MAKE) sim SEED=$$s; done
	grep -L "TEST PASSED" logs/*.log || echo "Tudo passou"

.PHONY: sim regress`)),
  Q('A regressão de ontem passava e a de hoje falha; houve 40 commits. Qual é o comando Git ideal?', ['<code>git bisect</code>', '<code>git stash</code>', '<code>git blame</code> em todos os ficheiros', '<code>git clone</code>'], 0, 'Pesquisa binária: em ~6 passos encontras o commit culpado.'),
  F('Que comando de shell procura um padrão de texto dentro de ficheiros? (uma palavra)', ['grep'], 'Ex: <code>grep -rn "always @\\*" rtl/</code>.'),
], [
  Q('Num Makefile, a linha de comando de uma regra tem de começar por:', ['Um TAB', 'Quatro espaços', 'Um #', 'Um $'], 0, 'Um dos erros mais clássicos.'),
  Q('Para contar quantas linhas de um log têm "Error":', ['<code>grep -c Error sim.log</code>', '<code>cat -n sim.log</code>', '<code>ls Error</code>', '<code>wc sim.log Error</code>'], 0, ''),
  TF('Em empresas de semicondutores, as simulações correm em clusters partilhados geridos por sistemas como LSF.', true, '<code>bsub</code>/<code>bjobs</code> são comandos que vais conhecer.'),
]);

LT('synth', 'tcl', 'Tcl e scripts de síntese (Yosys, Design Compiler, Genus)', [S_T.TCL, S_T.YOSYS], [
  T('Tcl em 2 minutos', CODE(`
set clk_period 1.25                 ;# variável
puts "Periodo = $clk_period ns"     ;# substituição com $
set freq [expr {1000.0 / $clk_period}]   ;# [ ] executa um comando
foreach blk {alu fifo arb} {
    puts "a sintetizar $blk"
}
proc area_total {cells} { return [llength $cells] }`) + `<p>Tudo é uma string; <code>[cmd]</code> substitui pelo resultado; <code>{...}</code> impede substituições. É a shell do Design Compiler, Fusion Compiler, Genus, PrimeTime, Tempus, Innovus e ICC2.</p>`),
  T('Síntese: Yosys (grátis) vs fluxo comercial', CODE(`
# Yosys — sintetiza e mostra área
yosys -p "read_verilog -sv rtl/alu.sv; synth -top alu; abc -liberty lib.lib; stat"

# Design Compiler (Synopsys) — esqueleto típico
read_file -format sverilog {alu.sv}
current_design alu
link
source constraints.sdc
compile_ultra
report_timing -max_paths 10 > timing.rpt
report_area > area.rpt
write -format verilog -output alu_netlist.v`) + `<p>Cadence <b>Genus</b> tem comandos equivalentes (<code>read_hdl</code>, <code>elaborate</code>, <code>syn_generic</code>, <code>syn_map</code>, <code>syn_opt</code>).</p>`),
  Q('Em Tcl, o que faz <code>[expr {2*3}]</code>?', ['Executa expr e substitui pelo resultado (6)', 'Cria uma lista', 'Comenta a linha', 'Define uma variável'], 0, ''),
  Q('Numa síntese comercial, o ficheiro .lib (Liberty) contém:', ['Atrasos, área e potência das células standard da tecnologia', 'O RTL', 'As restrições de relógio', 'O layout final'], 0, 'O .sdc tem as restrições; o .lib a caracterização das células.'),
], [
  F('Em Tcl, que comando imprime texto no ecrã?', ['puts'], ''),
  TF('Em Tcl, <code>{$x}</code> substitui o valor de x.', false, 'As chavetas impedem a substituição; usa aspas ou nada.'),
  Q('Qual ferramenta é de síntese?', ['Design Compiler / Genus / Yosys', 'PrimeTime', 'Verdi', 'GTKWave'], 0, 'PrimeTime é STA; Verdi e GTKWave são debug.'),
]);

LT('cdc', 'lint', 'Lint e verificação estática de CDC/RDC (Spyglass, Verilator, Questa CDC)', [S_.CUM, S_T.VERI], [
  T('Apanhar bugs sem simular', `<p>Ferramentas <b>estáticas</b> leem o RTL e encontram problemas estruturais em minutos:</p><ul><li><b>Lint</b> (Synopsys <b>SpyGlass</b>/VC SpyGlass, Cadence HAL/Jasper Superlint, <b>Verilator -Wall</b>, Verible): larguras diferentes, latches inferidos, sinais com vários drivers, <code>case</code> incompleto, nomes.</li><li><b>CDC</b> (SpyGlass CDC, Questa CDC, Meridian CDC): sinais a cruzar domínios sem sincronizador, reconvergência de bits sincronizados separadamente, barramentos sem Gray/handshake.</li><li><b>RDC</b>: problemas entre domínios de reset assíncrono.</li></ul><div class="key">Em equipas grandes, o RTL não entra no repositório sem passar lint e CDC "limpos" — é tão importante como passar os testes.</div>`),
  Q('A ferramenta de CDC reporta "reconvergence": dois bits de um barramento sincronizados com flops 2-FF separados e depois combinados. O problema é:', ['Os bits podem chegar em ciclos diferentes e formar um valor que nunca existiu', 'Consumo excessivo', 'Os flops são demasiado rápidos', 'Nenhum, 2-FF resolve tudo'], 0, 'Solução: Gray (um bit muda de cada vez), handshake ou FIFO assíncrono.'),
  Q('Verilator <code>--lint-only -Wall</code> avisa WIDTH quando:', ['Atribuis um valor de 8 bits a um sinal de 4 bits (truncagem)', 'O relógio é lento', 'Há demasiados módulos', 'Usas comentários'], 0, ''),
], [
  TF('Uma ferramenta de CDC estática substitui a simulação.', false, 'Complementa: encontra problemas estruturais que a simulação raramente apanha.'),
  Q('Qual NÃO é tipicamente um aviso de lint?', ['Violação de setup a 2 GHz', 'Latch inferido', 'Multi-driven net', 'Mismatch de largura'], 0, 'Timing é STA.'),
]);

LT('sta', 'sdc', 'Restrições de timing: SDC na prática', [S_T.SDC, S_.WH], [
  T('O ficheiro que diz à síntese e ao STA o que é "rápido o suficiente"', CODE(`
create_clock -name clk -period 1.0 [get_ports clk]        ;# 1 GHz
set_clock_uncertainty 0.05 [get_clocks clk]               ;# jitter + margem
set_input_delay  0.3 -clock clk [remove_from_collection [all_inputs] [get_ports clk]]
set_output_delay 0.3 -clock clk [all_outputs]
create_clock -name clk_b -period 2.7 [get_ports clk_b]
set_clock_groups -asynchronous -group {clk} -group {clk_b} ;# domínios assíncronos
set_false_path -from [get_ports rst_n]
set_multicycle_path 2 -setup -from [get_cells u_div/*] -to [get_cells u_res/*]
set_multicycle_path 1 -hold  -from [get_cells u_div/*] -to [get_cells u_res/*]`) + `<p>O mesmo SDC é lido pela síntese (DC/Genus/Yosys+ABC), pelo P&amp;R (Innovus/ICC2/OpenROAD) e pelo STA de sign-off (<b>PrimeTime</b>, <b>Tempus</b>, OpenSTA).</p>`),
  Q('Dois relógios sem relação de fase. O que declaras no SDC?', ['<code>set_clock_groups -asynchronous</code> (e sincronizas no RTL)', '<code>set_multicycle_path 2</code>', 'Nada, o STA trata disso', '<code>set_input_delay 0</code>'], 0, 'Sem isto, o STA tenta fechar caminhos impossíveis entre os domínios.'),
  Q('Depois de <code>set_multicycle_path 2 -setup</code>, porque se acrescenta normalmente <code>-hold 1</code>?', ['Para a verificação de hold voltar ao flanco correto (senão fica 1 ciclo demasiado exigente)', 'Para duplicar a frequência', 'Para remover o caminho', 'Por estilo'], 0, 'Pergunta clássica de entrevista de STA.'),
], [
  N('<code>create_clock -period 0.8</code> (ns). Qual a frequência em MHz?', 1250, 0, 'MHz', 'f = 1/0,8 ns = 1,25 GHz.'),
  TF('<code>set_false_path</code> num caminho funcional real esconde violações que podem partir o chip.', true, 'Exceções no SDC são revistas com muito cuidado.'),
  Q('Qual é uma ferramenta de STA de sign-off?', ['PrimeTime (Synopsys) ou Tempus (Cadence)', 'Verilator', 'cocotb', 'GTKWave'], 0, ''),
]);

LT('verif', 'uvm', 'UVM: a metodologia de verificação da indústria', [S_T.UVM, S_T.VUVM, S_.CHIPV], [
  T('Arquitetura de um testbench UVM', `<p>A <b>UVM</b> (Universal Verification Methodology, IEEE 1800.2) é uma biblioteca de classes SystemVerilog. Componentes:</p><ul><li><b>sequence_item</b>: uma transação (ex: escrita AXI com addr/data).</li><li><b>sequence</b>: gera itens aleatórios com constraints.</li><li><b>driver</b>: converte itens em sinais na interface.</li><li><b>monitor</b>: observa os sinais e reconstrói transações.</li><li><b>agent</b> = sequencer + driver + monitor.</li><li><b>scoreboard</b>: compara a saída do DUT com um modelo de referência.</li><li><b>env</b> e <b>test</b>: montam tudo; o <code>uvm_config_db</code> e a <i>factory</i> permitem trocar peças sem editar código.</li></ul><p>Fases: <code>build → connect → run → report</code>. Cobertura funcional com <code>covergroup</code> mede o que já foi testado.</p>`),
  T('Um driver mínimo', CODE(`
class fifo_driver extends uvm_driver #(fifo_item);
  \`uvm_component_utils(fifo_driver)
  virtual fifo_if vif;
  function new(string name, uvm_component parent); super.new(name, parent); endfunction
  task run_phase(uvm_phase phase);
    forever begin
      seq_item_port.get_next_item(req);
      @(posedge vif.clk);
      vif.push  <= req.push;
      vif.wdata <= req.data;
      seq_item_port.item_done();
    end
  endtask
endclass`)),
  Q('Que componente UVM compara a saída do DUT com o valor esperado?', ['Scoreboard', 'Driver', 'Sequencer', 'Interface'], 0, ''),
  Q('Para que serve a factory da UVM?', ['Substituir tipos (ex: trocar um driver por um com injeção de erros) sem alterar o código do ambiente', 'Sintetizar o testbench', 'Gerar relógios', 'Guardar waveforms'], 0, '<code>set_type_override_by_type</code>.'),
], [
  TF('O monitor UVM deve conduzir (drive) sinais no DUT.', false, 'O monitor só observa; quem conduz é o driver.'),
  Q('Cobertura funcional em SV escreve-se com:', ['<code>covergroup</code> / <code>coverpoint</code>', '<code>assert</code>', '<code>always_ff</code>', '<code>$display</code>'], 0, ''),
  Q('Um agent "passive" contém:', ['Só o monitor', 'Driver e sequencer', 'Só o scoreboard', 'Nada'], 0, ''),
]);

LT('verif', 'sva', 'Assertions SVA e verificação formal (JasperGold, VC Formal, SymbiYosys)', [S_.SVA, S_T.SBY, S_T.VUVM], [
  T('Assertions concorrentes', CODE(`
// valid tem de se manter até ready, e os dados estáveis
property p_hold;
  @(posedge clk) disable iff (!rst_n)
  valid && !ready |=> valid && $stable(data);
endproperty
a_hold: assert property (p_hold);

// pedido é sempre servido em <= 8 ciclos
a_lat:  assert property (@(posedge clk) req |-> ##[1:8] gnt);
// grant one-hot
a_oh:   assert property (@(posedge clk) $onehot0(gnt));
c_full: cover  property (@(posedge clk) full);`) + `<p><code>|-></code> verifica no mesmo ciclo, <code>|=></code> no ciclo seguinte; <code>##[1:8]</code> é uma janela; <code>$past</code>, <code>$rose</code>, <code>$fell</code>, <code>$stable</code> olham para a história.</p>`),
  T('Formal: provar em vez de testar', `<p>Uma ferramenta formal (Cadence <b>JasperGold</b>, Synopsys <b>VC Formal</b>, Siemens Questa Formal, <b>SymbiYosys</b> grátis) explora <b>todos</b> os estímulos possíveis e ou <b>prova</b> a propriedade ou dá um <b>contraexemplo</b> (uma waveform curta que a viola). Usa <code>assume</code> para restringir as entradas a comportamentos legais. Muito usado em árbitros, FIFOs, controladores de cache e protocolos — exatamente os blocos de uma GPU.</p>`),
  Q('<code>a |=> b</code> significa:', ['Se a for verdade neste ciclo, b tem de ser verdade no ciclo seguinte', 'a e b no mesmo ciclo', 'b implica a', 'a nunca acontece'], 0, ''),
  Q('Numa prova formal, para que serve <code>assume property</code>?', ['Restringir as entradas a comportamentos legais do ambiente', 'Verificar a saída', 'Contar cobertura', 'Desligar o relógio'], 0, 'Sem assumptions, a ferramenta encontra contraexemplos com entradas impossíveis.'),
], [
  Q('Que função verifica que no máximo um bit está a 1?', ['<code>$onehot0</code>', '<code>$countones == 2</code>', '<code>$past</code>', '<code>$stable</code>'], 0, ''),
  TF('Se a ferramenta formal prova uma propriedade (com as assumptions certas), ela é verdadeira para todos os estímulos possíveis.', true, 'Pode ser uma prova completa ou limitada (bounded) a N ciclos.'),
  Q('<code>disable iff (!rst_n)</code> serve para:', ['Não avaliar a assertion durante o reset', 'Ativar o reset', 'Fazer a assertion falhar', 'Medir o reset'], 0, ''),
]);

LT('flow', 'eda', 'O mapa das ferramentas EDA: do RTL ao GDSII', [S_T.OROAD, S_.EECS151, S_.WH], [
  T('Quem faz o quê', `<table><tr><th>Etapa</th><th>Synopsys</th><th>Cadence</th><th>Siemens / outros</th><th>Open-source</th></tr>
  <tr><td>Simulação</td><td>VCS</td><td>Xcelium</td><td>Questa</td><td>Verilator, Icarus</td></tr>
  <tr><td>Debug</td><td>Verdi</td><td>SimVision / Indago</td><td>Visualizer</td><td>GTKWave, Surfer</td></tr>
  <tr><td>Lint / CDC</td><td>VC SpyGlass</td><td>Jasper Superlint/CDC, Conformal</td><td>Questa CDC, Real Intent</td><td>Verilator, Verible</td></tr>
  <tr><td>Formal</td><td>VC Formal</td><td>JasperGold</td><td>Questa Formal</td><td>SymbiYosys</td></tr>
  <tr><td>Síntese</td><td>Design Compiler, Fusion Compiler</td><td>Genus</td><td>—</td><td>Yosys</td></tr>
  <tr><td>Equivalência (LEC)</td><td>Formality</td><td>Conformal LEC</td><td>—</td><td>Yosys eqy</td></tr>
  <tr><td>Place &amp; Route</td><td>IC Compiler II</td><td>Innovus</td><td>—</td><td>OpenROAD</td></tr>
  <tr><td>STA</td><td>PrimeTime</td><td>Tempus</td><td>—</td><td>OpenSTA</td></tr>
  <tr><td>Potência</td><td>PrimePower</td><td>Joules, Voltus</td><td>PowerPro</td><td>—</td></tr>
  <tr><td>Emulação</td><td>ZeBu</td><td>Palladium</td><td>Veloce</td><td>FPGA</td></tr></table>`),
  T('O que um engenheiro de RTL usa realmente', `<p>Como RTL designer numa empresa de GPUs vais viver sobretudo em: <b>simulador + Verdi</b>, <b>lint/CDC</b>, <b>síntese</b> (para ver timing/área do teu bloco cedo), <b>LEC</b> (provar que a netlist = RTL após ECOs), relatórios de <b>STA</b> e, em projetos grandes, <b>emulação</b> (correr drivers e jogos reais no RTL antes do silício). O P&amp;R é sobretudo da equipa de physical design, mas tens de saber ler os relatórios deles.</p><p>Para praticar grátis: Verilator + cocotb + Yosys + OpenSTA, ou o fluxo completo <a href="https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts" target="_blank" rel="noopener">OpenROAD-flow-scripts</a> com a PDK aberta SKY130.</p>`),
  Q('Depois de um ECO na netlist, que ferramenta prova que ela continua equivalente ao RTL?', ['LEC — Formality ou Conformal', 'PrimeTime', 'Verdi', 'Palladium'], 0, ''),
  Q('Porque é que empresas de GPU usam emuladores (Palladium, ZeBu)?', ['Correr software real (drivers, jogos, Linux) no RTL a MHz, antes do silício', 'Fazer o layout', 'Substituir a síntese', 'Medir a temperatura do chip'], 0, 'A simulação corre a Hz–kHz para um chip inteiro; a emulação chega aos MHz.'),
], [
  Q('Innovus e IC Compiler II são ferramentas de:', ['Place & Route', 'Simulação', 'Lint', 'Formal'], 0, ''),
  Q('Qual é o par correto (função → ferramenta)?', ['STA → PrimeTime', 'Síntese → Verdi', 'Simulação → Innovus', 'LEC → GTKWave'], 0, ''),
  TF('OpenROAD permite fazer RTL→GDSII só com ferramentas open-source.', true, 'Usado com PDKs abertas como SKY130 e GF180.'),
]);

/* Inserir no percurso, a seguir à lição relacionada, herdando a unidade */
TL.forEach(({ after, l }) => {
  const i = COURSE.lessons.findIndex(x => x.id === after);
  let j = i + 1; while (COURSE.lessons[j] && COURSE.lessons[j].tool) j++;
  l.unit = COURSE.lessons[i].unit; COURSE.lessons.splice(j, 0, l);
});

/* Perguntas de entrevista sobre ferramentas e linguagens */
IV('sdc', 'Explica a diferença entre <code>set_false_path</code>, <code>set_multicycle_path</code> e <code>set_clock_groups -asynchronous</code>. Quando usas cada uma?', '<ul><li><b>false_path</b>: o caminho nunca é funcional (ex: reset estático, registo de configuração escrito só em idle).</li><li><b>multicycle</b>: o caminho é real mas o destino só amostra a cada N ciclos (enable); acrescentar o hold ajustado.</li><li><b>clock_groups async</b>: domínios sem relação de fase — o STA não deve analisar entre eles; a segurança vem dos sincronizadores no RTL, verificada por CDC.</li></ul>');
IV('uvm', 'Desenha a arquitetura de um testbench UVM para um FIFO. Que vai no scoreboard e que cobertura queres?', 'Agent de escrita (push/wdata) e agent de leitura (pop/rdata), cada um com sequencer/driver/monitor. Os monitores mandam transações por analysis ports para o scoreboard, que tem uma fila (<code>q[$]</code>) como modelo: push → <code>push_back</code>, pop → compara com <code>pop_front</code>. Cobertura: cheio, vazio, push+pop em cheio/vazio, quase cheio, sequências longas de cada, reset a meio. Assertions SVA para overflow/underflow.');
IV('sva', 'Escreve uma assertion SVA: "depois de req subir, gnt tem de chegar entre 1 e 4 ciclos e req mantém-se até lá".', 'Divide em duas propriedades simples (é o que se espera numa entrevista):<br><code>a_lat:  assert property (@(posedge clk) disable iff(!rst_n) $rose(req) |-> ##[1:4] gnt);</code><br><code>a_hold: assert property (@(posedge clk) disable iff(!rst_n) req && !gnt |=> req);</code><br>A primeira garante a janela de latência; a segunda que o pedido não é retirado antes do grant. Acrescenta um <code>cover property ($rose(req) ##4 gnt)</code> para confirmar que o pior caso é exercitado.');
IV('simtools', 'Qual é a diferença entre um simulador event-driven (VCS) e o Verilator? Quando usas cada um?', 'Event-driven: semântica completa do LRM, 4 estados (X/Z), atrasos, UVM — para verificação de bloco e testes de reset/X. Verilator: compila RTL sintetizável para C++, 2 estados, cycle-based, muito mais rápido — para regressões longas, correr software, co-simulação com modelos C++. Muitas equipas usam os dois.');
IV('linux', 'Uma regressão nocturna de 5000 testes tem 37 falhas. Como as triagens de forma eficiente?', 'Agrupar por assinatura de erro (script Python/grep que extrai a primeira mensagem de erro de cada log) → normalmente poucas causas distintas. Reproduzir uma de cada grupo com a mesma seed, com waves. Ver se coincidem com commits recentes (<code>git log</code>, <code>git bisect</code>). Priorizar falhas novas vs conhecidas, abrir bugs com seed e comando de reprodução.');
IV('lint', 'O lint avisa "latch inferred" num always_comb. Quais as causas e como corriges?', 'Um sinal não é atribuído em todos os caminhos (if sem else, case sem default ou sem todas as saídas atribuídas). Corrige com atribuições por omissão no topo do bloco (<code>y = \'0;</code>), <code>default</code> no case ou <code>unique case</code> com todos os valores. Confirma no relatório de síntese que não há latches.');
IV('eda', 'O que é LEC e quando o corres no fluxo?', 'Logic Equivalence Checking (Formality, Conformal) prova formalmente que dois designs são funcionalmente iguais, ponto de registo a ponto de registo: RTL vs netlist pós-síntese, netlist pré vs pós P&R (com scan/clock tree), e após cada ECO. Evita depender de simulação gate-level para equivalência.');
IV('tcl', 'Num relatório de timing do Design Compiler vês o caminho crítico com slack −80 ps. Que opções tens antes de mexer na microarquitetura?', 'Confirmar que as restrições estão certas (relógio, input/output delays, false/multicycle paths). Depois: deixar a ferramenta otimizar mais (compile_ultra, retiming, upsizing, células LVT), reestruturar a lógica (pôr o sinal que chega tarde perto da saída, usar mux de seleção tardia), duplicar lógica com fanout alto. Se não chegar: pipeline (mais um registo) ou alterar a microarquitetura.');

/* Projetos de ferramentas: o primeiro projeto do percurso é montar o ambiente */
PROJ.unshift({ title: 'Montar o teu ambiente de trabalho RTL', size: 'Pequeno', parts: ['Instalar e correr o primeiro testbench'], spec: `<p>Instala (Linux, WSL no Windows ou macOS): <b>Icarus Verilog</b>, <b>Verilator</b>, <b>GTKWave</b>, <b>Yosys</b>, <b>Python 3 + cocotb</b> e <b>Git</b>. No Windows: <code>wsl --install</code>, depois <code>sudo apt install iverilog verilator gtkwave yosys python3-pip git</code> e <code>pip install cocotb</code>. Cria um repositório <code>rtl-portfolio</code> no GitHub com pastas <code>rtl/ tb/ sim/</code> e um <code>Makefile</code>.</p>`, check: ['iverilog e verilator correm um "hello world"', 'Viste uma waveform no GTKWave', 'Repositório criado com README', 'Makefile com alvo <code>sim</code>'], sol: CODE(`
// tb/hello.sv
module hello;
  logic clk = 0; always #5 clk = ~clk;
  logic [3:0] cnt = 0;
  always_ff @(posedge clk) cnt <= cnt + 1;
  initial begin
    $dumpfile("hello.vcd"); $dumpvars(0, hello);
    #200 $display("cnt = %0d", cnt); $finish;
  end
endmodule
// iverilog -g2012 -o hello tb/hello.sv && vvp hello && gtkwave hello.vcd`) });
const insertProj = (afterTitle, p) => { const i = PROJ.findIndex(x => x.title.startsWith(afterTitle)); PROJ.splice(i < 0 ? PROJ.length : i + 1, 0, p); };
insertProj('Somador N bits', { title: 'Testbench em Python com cocotb', size: 'Pequeno', parts: ['Testar o teu somador/ALU com cocotb'], spec: `<p>Reescreve o teste da tua ALU em <b>cocotb</b>: 10 000 operações aleatórias comparadas com um modelo em Python, com Icarus e depois com Verilator (<code>SIM=verilator</code>).</p>`, check: ['Teste corre com make', 'Funciona com 2 simuladores', 'Falha de propósito um caso e vês a mensagem'], sol: '' });
insertProj('Popcount', { title: 'Script Tcl de síntese com Yosys', size: 'Pequeno', parts: ['Script de síntese e relatório'], spec: `<p>Escreve <code>synth.tcl</code> para o Yosys (<code>yosys -c synth.tcl</code>) que lê todos os <code>.sv</code>, sintetiza cada módulo num <code>foreach</code>, e escreve num ficheiro a área (nº de células) de cada um. Bónus: liga ao OpenSTA com um <code>.sdc</code> e reporta o caminho crítico.</p>`, check: ['Loop foreach em Tcl', 'Relatório de área por módulo', 'Bónus: timing com SDC'], sol: CODE(`
# synth.tcl  (yosys -c synth.tcl)
yosys -import
foreach top {alu popcount lzc} {
  design -reset
  read_verilog -sv rtl/$top.sv
  synth -top $top
  tee -o reports/$top.area.rpt stat
}`) });
insertProj('Árbitro round-robin', { title: 'Assertions SVA + prova formal com SymbiYosys', size: 'Médio', parts: ['Escrever propriedades', 'Prova formal e contraexemplos'], spec: `<p>Escreve as propriedades do teu árbitro (onehot0, gnt ⊆ req, sem starvation em N ciclos) e prova-as com <b>SymbiYosys</b> (modo <code>prove</code>). Introduz um bug de propósito e analisa o contraexemplo no GTKWave.</p>`, check: ['Ficheiro .sby a correr', 'Todas as propriedades provadas', 'Contraexemplo analisado'], sol: '' });
insertProj('Bloco de registos AXI4-Lite', { title: 'Mini-ambiente UVM para o AXI-Lite', size: 'Grande', parts: ['Item, sequence, driver', 'Monitor, scoreboard e cobertura'], spec: `<p>No EDA Playground (escolhe UVM 1.2 + um simulador comercial), monta um agente AXI-Lite: sequências de escrita/leitura aleatórias, monitor, scoreboard com modelo dos registos e um <code>covergroup</code> de endereços e WSTRB.</p>`, check: ['Sequências aleatórias com constraints', 'Scoreboard sem erros em 1000 transações', 'Cobertura de endereços a 100%'], sol: '' });
PSCHED.length = 0; PROJ.forEach((p, pi) => p.parts.forEach((part, k) => PSCHED.push({ pi, k })));

/* Ferramentas mostradas no ecrã do curso */
COURSE.stack = [
  ['Linguagens', 'SystemVerilog · Verilog · VHDL · Python · Tcl · C++ · Bash/Make'],
  ['Simulação e debug', 'Icarus · Verilator · VCS · Xcelium · Questa · GTKWave · Verdi'],
  ['Verificação', 'cocotb · UVM · SVA · JasperGold · VC Formal · SymbiYosys'],
  ['Lint e CDC', 'Verilator lint · SpyGlass · Questa CDC'],
  ['Síntese e sign-off', 'Yosys · Design Compiler · Genus · Formality/Conformal · PrimeTime · OpenSTA'],
  ['Físico e emulação', 'OpenROAD · Innovus · ICC2 · Palladium · ZeBu'],
];
COURSE.sources = COURSE.sources.concat(Object.values(S_T));
