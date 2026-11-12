/* Volante 1000 — currículo de condução (Portugal, categoria B) */
const D_ = {
  CE: SRC('Código da Estrada (DL 114/94, versão consolidada) — Diário da República', 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1994-34527975'),
  RST: SRC('Regulamento de Sinalização do Trânsito (DR 22-A/98)', 'https://diariodarepublica.pt/dr/detalhe/decreto-regulamentar/22-a-1998-575215'),
  ANSR: SRC('ANSR — Autoridade Nacional de Segurança Rodoviária', 'https://www.ansr.pt/'),
  IMT: SRC('IMT — Condutores: obtenção da carta e perguntas de exame', 'https://www.imt-ip.pt/condutores/obtencao/perguntas-de-exame/'),
  PRP: SRC('Prevenção Rodoviária Portuguesa', 'https://www.prp.pt/'),
  INEM: SRC('INEM — Primeiros socorros e 112', 'https://www.inem.pt/'),
  ERSO: SRC('Comissão Europeia — European Road Safety Observatory', 'https://road-safety.transport.ec.europa.eu/european-road-safety-observatory_en'),
  OMS: SRC('OMS — Global status report on road safety', 'https://www.who.int/publications/i/item/9789240086517'),
  ECO: SRC('ADENE / programas de eco-condução (ECOWILL)', 'https://www.adene.pt/'),
};
const COURSE = {
  id: 'conducao', name: 'Volante 100', short: 'Volante', tagline: 'Código da Estrada e carta B em Portugal', icon: '🚗', accent: '#e8590c', accent2: '#f59f00', seed: 2002, days: 100, finalDays: 10, phases: ['Aprender', 'Consolidar', 'Reta final · simulações de exame'], testN: 9,
  extraName: 'missões práticas',
  cycles: ['Fundamentos', 'Consolidação', 'Pronto para o exame', 'Condutor seguro', 'Condução defensiva', 'Situações difíceis', 'Condutor experiente', 'Especialista', 'Mestre do volante', 'Mestre+', 'Mestre++', 'Lenda', 'Lenda+', 'Lenda++', 'Lenda III', 'Lenda IV', 'Lenda V', 'Lenda VI', 'Lenda VII', 'Lenda VIII', 'Lenda IX', 'Lenda X', 'Lenda XI', 'Lenda XII'],
  exam: { title: 'Simulação do exame de código', n: 30, big: 30, open: 0, sub: big => big ? '30 perguntas · objetivo: no máximo 3 erros · revisão de 100 dias' : '30 perguntas estilo exame teórico · objetivo: ≥ 27 certas' },
  sources: Object.values(D_),
  disclaimer: 'Conteúdo original baseado no Código da Estrada português e em materiais de segurança rodoviária. As regras e coimas mudam: confirma sempre na versão consolidada do Código da Estrada, no IMT/ANSR e com a tua escola de condução. Treina a condução real apenas com instrutor ou com licença de aprendizagem e acompanhante legalmente habilitado.',
  lessons: [], gens: {},
};
const L = (id, unit, title, src, cards, quiz) => COURSE.lessons.push({ id, unit, title, src, cards, quiz });

/* ============ U1 — PRIMEIROS PASSOS ============ */
const U1 = 'U1 · Primeiros passos';
L('carta', U1, 'O caminho até à carta B', [D_.IMT, D_.CE], [
  T('O percurso', `<ol><li><b>Inscrição numa escola de condução</b> (idade mínima para a categoria B: 18 anos) e exame médico/atestado.</li><li><b>Aulas teóricas</b> e <b>exame teórico</b> (código) no computador.</li><li><b>Licença de aprendizagem</b> e <b>aulas práticas</b> com instrutor.</li><li><b>Exame prático</b> (manobras + condução em trânsito real).</li><li>Carta em <b>regime probatório</b> durante 3 anos.</li></ol><div class="key">O exame teórico tem tipicamente <b>30 perguntas</b> de escolha múltipla e para passar precisas de pelo menos <b>27 certas</b> (confirma as regras atuais no IMT/escola). As provas semanais desta app simulam esse formato.</div>`),
  T('O que conduzes com a carta B', `<ul><li>Automóveis com massa máxima autorizada (MMA) até <b>3500 kg</b>.</li><li>Até <b>9 lugares</b> incluindo o condutor.</li><li>Reboque até <b>750 kg</b> (ou mais, se o conjunto não ultrapassar 3500 kg).</li></ul>`),
  Q('Durante quantos anos fica um novo condutor em regime probatório?', ['3 anos', '1 ano', '2 anos', '5 anos'], 0, 'Os primeiros 3 anos, com regras mais exigentes (ex: taxa de álcool de 0,2 g/l).'),
  Q('Com a carta B podes conduzir um automóvel com MMA de:', ['Até 3500 kg', 'Até 7500 kg', 'Até 2000 kg', 'Qualquer massa'], 0, ''),
], [
  Q('Quantos lugares, no máximo, pode ter um automóvel conduzido com carta B (incluindo o condutor)?', ['9', '5', '7', '12'], 0, ''),
  TF('Num exame teórico de 30 perguntas, errar 4 normalmente significa reprovar.', true, 'É preciso acertar pelo menos 27 (máximo 3 erros) — confirma com a escola.'),
  Q('Com carta B, um reboque ligeiro pode ter MMA até:', ['750 kg (sem outras condições)', '1500 kg sempre', '3500 kg sempre', 'Não pode levar reboque'], 0, 'Acima disso só se o conjunto não ultrapassar 3500 kg (ou com B96/BE).'),
  Q('Qual é a idade mínima para obter a carta B?', ['18 anos', '16 anos', '17 anos', '21 anos'], 0, ''),
]);
L('comandos', U1, 'Conhecer o carro: comandos e painel', [D_.PRP, D_.CE], [
  T('Os pedais (caixa manual)', `<p>Da esquerda para a direita: <b>Embraiagem</b> (pé esquerdo) — <b>Travão</b> — <b>Acelerador</b> (pé direito). Em automático não há embraiagem; usa só o pé direito.</p><p>Outros comandos: volante, alavanca de velocidades, travão de estacionamento, piscas (indicadores de mudança de direção), luzes, limpa-para-brisas, buzina, sinal de perigo (4 piscas).</p>`),
  T('Avisadores do painel', `<p>Cores como semáforo: <b>vermelho</b> = perigo, parar assim que possível em segurança (ex: pressão do óleo, temperatura do motor, travões); <b>amarelo/laranja</b> = atenção, verificar em breve (ex: motor/check engine, ABS, pressão dos pneus); <b>verde/azul</b> = informação (luzes ligadas, máximos azuis).</p>`),
  Q('Acende uma luz <b>vermelha</b> de pressão do óleo em andamento. O que fazes?', ['Paro em segurança assim que possível e desligo o motor', 'Continuo até casa', 'Acelero para aumentar a pressão', 'Ignoro se o carro andar bem'], 0, 'Conduzir sem pressão de óleo pode destruir o motor em minutos.'),
  Q('Qual pé usas para a embraiagem?', ['Esquerdo', 'Direito', 'Qualquer um', 'Os dois'], 0, ''),
], [
  Q('O avisador de máximos é normalmente de cor:', ['Azul', 'Verde', 'Vermelho', 'Amarelo'], 0, ''),
  TF('Uma luz amarela/laranja no painel significa normalmente "atenção, verificar em breve".', true, ''),
  Q('Para que serve o sinal de perigo (4 piscas)?', ['Assinalar imobilização forçada ou perigo para o trânsito', 'Estacionar em segunda fila', 'Agradecer a outro condutor', 'Avisar que vais virar'], 0, 'Não é licença para estacionar em locais proibidos.'),
  Q('Num carro automático, para parar o carro usas:', ['O pé direito no travão', 'O pé esquerdo no travão', 'A alavanca em N', 'O travão de mão'], 0, 'Usar só o pé direito evita travar e acelerar ao mesmo tempo.'),
]);
L('verif', U1, 'Antes de arrancar: verificações e posição de condução', [D_.PRP, D_.ANSR], [
  T('Volta ao carro', `<ul><li><b>Pneus</b>: pressão (a frio) e profundidade do piso — mínimo legal <b>1,6 mm</b>.</li><li><b>Luzes</b> e piscas a funcionar, vidros limpos.</li><li><b>Níveis</b>: óleo, líquido de refrigeração, travões, limpa-vidros.</li><li>Nada debaixo/à volta do carro (crianças, animais, obstáculos).</li></ul>`),
  T('Ajusta antes de ligar', `<ol><li><b>Banco</b>: pisar a embraiagem até ao fundo com a perna ligeiramente fletida; costas apoiadas.</li><li><b>Volante</b>: pulsos apoiados no topo do volante com os braços esticados.</li><li><b>Encosto de cabeça</b>: topo ao nível do topo da cabeça.</li><li><b>Espelhos</b>: interior e exteriores, reduzindo o ângulo morto.</li><li><b>Cinto</b> (todos os ocupantes).</li></ol><div class="key">Mãos no volante na posição <b>"9h15"</b> (ou 10h10). Não cruzar os braços ao virar em manobras normais: "puxa-empurra".</div>`),
  Q('Profundidade mínima legal do piso dos pneus de um ligeiro:', ['1,6 mm', '3 mm', '0,5 mm', '5 mm'], 0, 'Recomenda-se substituir antes (~3 mm) para manter boa aderência em piso molhado.'),
  Q('O encosto de cabeça deve ficar:', ['Com o topo ao nível do topo da cabeça', 'Na altura do pescoço', 'O mais baixo possível', 'Tirado para ver melhor'], 0, 'Protege contra lesões cervicais (efeito chicote).'),
], [
  TF('A pressão dos pneus deve ser verificada com os pneus frios.', true, ''),
  Q('Ordem correta antes de arrancar:', ['Ajustar banco, volante, encostos, espelhos e cinto', 'Ligar o motor e depois ajustar os espelhos em andamento', 'Pôr o cinto só em autoestrada', 'Ajustar espelhos depois de arrancar'], 0, ''),
  Q('Pneus com pressão abaixo do recomendado:', ['Aumentam o consumo e pioram a estabilidade e travagem', 'Melhoram a aderência sempre', 'Não fazem diferença', 'Reduzem o desgaste'], 0, ''),
  Q('O ângulo morto é:', ['A zona à volta do carro que não se vê pelos espelhos', 'A zona à frente do capô', 'O espaço entre pedais', 'A zona iluminada pelos médios'], 0, 'Confirma sempre olhando por cima do ombro antes de mudar de via.'),
]);
L('arranque', U1, 'Arrancar, mudar de velocidade e parar', [D_.PRP], [
  T('Arranque (caixa manual)', `<ol><li>Embraiagem a fundo, 1.ª engrenada.</li><li>Verificar espelhos e ângulo morto, ligar o pisca.</li><li>Levantar a embraiagem devagar até ao <b>ponto de embraiagem</b> (o carro "puxa", rotação baixa ligeiramente) e acelerar suavemente.</li><li>Soltar o travão de mão e continuar a levantar a embraiagem.</li></ol><p><b>Arranque em subida</b>: mesmo método, segurando com travão de mão até ao ponto de embraiagem (ou usar o assistente de arranque em subida).</p>`),
  T('Mudanças e paragem', `<p>Muda para cima quando o motor ganha rotação suficiente (em geral 2000–2500 rpm em gasolina; menos em diesel) e para baixo antes de perder força em subidas ou antes de curvas. <b>Parar</b>: espelhos → pisca (se encostar) → travar progressivamente → embraiagem antes de o motor ir abaixo → ponto morto e travão de mão se a paragem for longa.</p>`),
  Q('O "ponto de embraiagem" é:', ['O ponto em que a embraiagem começa a transmitir força às rodas', 'Quando a embraiagem está a fundo', 'Quando a embraiagem está totalmente solta', 'O ponto em que o motor vai abaixo'], 0, ''),
], [
  TF('Andar com o pé apoiado na embraiagem desgasta-a mais depressa.', true, ''),
  Q('Numa descida longa e inclinada, deves:', ['Usar uma mudança baixa para aproveitar o travão motor', 'Ir em ponto morto para poupar combustível', 'Travar sempre a fundo', 'Desligar o motor'], 0, 'Ponto morto em descida é perigoso (sobreaquecimento dos travões, menos controlo).'),
  Q('Antes de arrancar de junto ao passeio, deves:', ['Verificar espelhos, ângulo morto e sinalizar com o pisca', 'Apenas buzinar', 'Arrancar rápido para entrar no trânsito', 'Ligar os 4 piscas'], 0, ''),
  Q('Se o carro vai abaixo ao arrancar, a causa mais provável é:', ['Levantar a embraiagem depressa demais com pouco acelerador', 'Acelerar demasiado', 'Travão de mão solto', 'Estar em ponto morto'], 0, ''),
]);

/* ============ U2 — SINALIZAÇÃO ============ */
const U2 = 'U2 · Sinalização';
L('hier', U2, 'Hierarquia da sinalização', [D_.CE, D_.RST], [
  T('Quem manda quando há conflito?', `<ol><li><b>Agentes</b> de fiscalização / reguladores de trânsito</li><li><b>Sinalização temporária</b> (ex: obras, sinais amarelos)</li><li><b>Semáforos</b> (sinais luminosos)</li><li><b>Sinais verticais</b></li><li><b>Marcas rodoviárias</b></li><li><b>Regras gerais de trânsito</b></li></ol><div class="key">Truque: "<b>A</b>gora <b>T</b>odos <b>S</b>abem <b>V</b>er <b>M</b>arcas e <b>R</b>egras" — Agentes, Temporária, Semáforos, Verticais, Marcas, Regras.</div>`),
  Q('O semáforo está verde, mas um agente manda-te parar. O que fazes?', ['Paro — as ordens dos agentes prevalecem', 'Avanço, o verde tem prioridade', 'Avanço devagar', 'Buzino ao agente'], 0, ''),
  Q('Um sinal vertical de 50 km/h e marcas temporárias amarelas de obras indicam coisas diferentes. Qual prevalece?', ['A sinalização temporária', 'O sinal vertical', 'Nenhuma', 'A regra geral'], 0, ''),
], [
  Q('Qual tem MAIOR prioridade?', ['Semáforo', 'Sinal vertical', 'Marca rodoviária', 'Regra geral da direita'], 0, ''),
  TF('Marcas rodoviárias prevalecem sobre sinais verticais.', false, 'Sinais verticais estão acima das marcas.'),
  Q('Um semáforo intermitente amarelo num cruzamento significa:', ['Atenção: passa com prudência, respeitando a sinalização vertical e as regras de prioridade', 'Paragem obrigatória', 'Tens prioridade', 'Semáforo avariado — podes ignorar tudo'], 0, ''),
  Q('A sinalização de obras costuma ter fundo:', ['Amarelo', 'Azul', 'Verde', 'Castanho'], 0, ''),
]);
L('perigo', U2, 'Sinais de perigo', [D_.RST], [
  T('Triângulo com borda vermelha', `<p>${SIGN('danger', '!')}${SIGN('danger', '↯')}</p><p>Avisam de um perigo <b>à frente</b> (curva, lomba, passadeira, crianças, animais, piso escorregadio, obras…). Fora das localidades costumam estar a cerca de <b>150–300 m</b> do perigo; dentro das localidades, mais perto. Reação certa: <b>abrandar, aumentar a atenção e preparar-se</b>.</p>`),
  Q('Um sinal triangular com borda vermelha é um sinal de:', ['Perigo', 'Proibição', 'Obrigação', 'Informação'], 0, ''),
  Q('Ao ver um sinal de "crianças", deves:', ['Moderar a velocidade e redobrar a atenção', 'Buzinar para avisar', 'Manter a velocidade', 'Parar sempre'], 0, ''),
], [
  Q(`${SIGN('danger', '!')} Este sinal (ponto de exclamação) indica:`, ['Outros perigos (não especificados — ver placa adicional)', 'Proibido parar', 'Fim de perigo', 'Obras'], 0, ''),
  TF('Os sinais de perigo obrigam a parar.', false, 'Obrigam a adaptar a condução ao perigo.'),
  Q('Sinal de perigo "lomba": risco principal?', ['Falta de visibilidade do que vem do outro lado', 'Piso molhado', 'Animais', 'Vento lateral'], 0, 'Não ultrapassar nem parar perto de lombas.'),
  Q('O sinal de "passagem de nível sem guarda" avisa que:', ['Não há barreiras — tens de verificar tu se vem comboio', 'Há sempre um guarda', 'Há barreiras automáticas', 'A linha está desativada'], 0, ''),
]);
L('cedencia', U2, 'Sinais de cedência de passagem e STOP', [D_.RST, D_.CE], [
  T('Os mais importantes do exame', `<p>${SIGN('yield')} <b>Cedência de passagem</b> (triângulo invertido): cede a quem circula na via onde vais entrar; paras <b>só se necessário</b>.</p><p>${SIGN('stop')} <b>STOP / paragem obrigatória</b>: paras <b>sempre</b> (rodas imobilizadas), na linha de paragem ou antes de entrar no cruzamento, e cedes passagem.</p><p>${SIGN('prio')} <b>Via com prioridade</b>: tens prioridade nos cruzamentos dessa via (até ao sinal de fim).</p>`),
  Q(`${SIGN('stop')} Chegas a este sinal e não vem ninguém. O que fazes?`, ['Paro completamente e só depois avanço', 'Abrando e passo', 'Passo sem parar', 'Buzino e passo'], 0, 'O STOP obriga a paragem total mesmo com a via livre.'),
  Q(`${SIGN('yield')} Este sinal obriga a:`, ['Ceder passagem — parar apenas se necessário', 'Parar sempre', 'Seguir com prioridade', 'Proibição de virar'], 0, ''),
], [
  Q(`${SIGN('prio')} Este sinal (losango amarelo) indica:`, ['Via com prioridade', 'Perigo', 'Fim de via', 'Estacionamento'], 0, ''),
  TF('O sinal STOP tem forma octogonal para ser reconhecido mesmo coberto de neve ou visto de trás.', true, 'A forma é única entre os sinais.'),
  Q('Num cruzamento com STOP, onde deves parar se não há linha de paragem?', ['No local onde tens visibilidade sem invadir a via transversal', 'Dentro do cruzamento', '10 m antes do sinal sempre', 'Não precisas de parar'], 0, ''),
  Q('Desrespeitar um STOP é tipicamente uma contraordenação:', ['Muito grave', 'Leve', 'Não é infração', 'Apenas aviso'], 0, 'É das infrações mais perigosas (colisões laterais). Confirma a classificação atual no Código.'),
]);
L('proib', U2, 'Sinais de proibição', [D_.RST], [
  T('Círculo com borda vermelha', `<p>${SIGN('noentry')}${SIGN('limit', '50')}${SIGN('prohib', 'P')}${SIGN('nopark')}${SIGN('nostop')}</p><ul><li><b>Sentido proibido</b> (vermelho com barra branca).</li><li><b>Velocidade máxima</b>: número no círculo — válido até ao próximo cruzamento/entroncamento ou sinal de fim (salvo indicação).</li><li><b>Estacionamento proibido</b> (fundo azul, 1 risca) vs <b>paragem e estacionamento proibidos</b> (fundo azul, cruz).</li></ul>`),
  Q(`${SIGN('noentry')} Este sinal significa:`, ['Sentido proibido', 'Trânsito proibido nos dois sentidos', 'Fim de autoestrada', 'Paragem obrigatória'], 0, ''),
  Q(`${SIGN('nostop')} E este?`, ['Paragem e estacionamento proibidos', 'Só estacionamento proibido', 'Cruzamento', 'Proibido virar'], 0, 'A cruz proíbe também parar; uma só risca proíbe apenas estacionar.'),
], [
  Q(`${SIGN('nopark')} Este sinal permite:`, ['Parar (breves instantes para entrada/saída de passageiros ou cargas), mas não estacionar', 'Estacionar até 1 hora', 'Nem parar nem estacionar', 'Apenas táxis'], 0, ''),
  Q(`${SIGN('limit', '70')} A partir deste sinal, a velocidade máxima é:`, ['70 km/h', 'Mínima 70 km/h', '70 m/s', 'Recomendada 70 km/h'], 0, 'Recomendada seria um quadrado azul; mínima, círculo azul.'),
  Q(`${SIGN('end', '70')} Este sinal significa:`, ['Fim da limitação de velocidade de 70 km/h', 'Velocidade mínima 70', 'Proibido 70', 'Autoestrada a 70 km'], 0, 'Voltam a valer os limites gerais.'),
  TF('Um sinal de proibição de ultrapassar deixa de valer, em regra, após o próximo cruzamento ou entroncamento, se não houver sinal de fim antes.', true, 'Salvo indicação em contrário (placa adicional).'),
]);
L('obrig', U2, 'Sinais de obrigação', [D_.RST], [
  T('Círculo azul', `<p>${SIGN('mand', '→')}${SIGN('mand', '↑')}${SIGN('min', '50')}</p><p>Impõem uma ação: sentido obrigatório, contornar obstáculo, via obrigatória para certos veículos (ex: ciclistas), <b>velocidade mínima</b> (círculo azul com número), uso de correntes de neve…</p><div class="key">Cor/forma: <b>círculo vermelho</b> = proíbe; <b>círculo azul</b> = obriga; <b>quadrado/retângulo azul</b> = informa.</div>`),
  Q(`${SIGN('min', '50')} Este sinal indica:`, ['Velocidade mínima obrigatória de 50 km/h', 'Velocidade máxima 50 km/h', 'Velocidade recomendada', 'Distância de 50 m'], 0, ''),
], [
  Q(`${SIGN('mand', '→')} Este sinal obriga a:`, ['Seguir para a direita', 'Proíbe virar à direita', 'Indica uma saída à direita', 'Dá prioridade à direita'], 0, ''),
  TF('Um círculo azul com uma bicicleta indica pista obrigatória para velocípedes.', true, ''),
  Q('Qual a forma/cor típica de um sinal de obrigação?', ['Círculo com fundo azul', 'Triângulo com borda vermelha', 'Octógono vermelho', 'Losango amarelo'], 0, ''),
  Q('O sinal de "rotunda" (círculo azul com 3 setas em círculo) obriga a:', ['Circular no sentido indicado pelas setas (contrário ao dos ponteiros do relógio)', 'Parar sempre', 'Dar prioridade à esquerda sempre', 'Circular no sentido dos ponteiros'], 0, ''),
]);
L('info', U2, 'Sinais de informação e indicação', [D_.RST], [
  T('Quadrados e retângulos', `<p>${SIGN('info', 'P')}${SIGN('info', 'H')}${SIGN('info', 'i')}</p><p>Informam: estacionamento, hospital, passagem de peões, autoestrada, localidade (início/fim → muda o limite de velocidade!), velocidade recomendada, via sem saída… Os sinais de direção usam cores: <b>azul</b> para autoestradas, <b>verde</b>/<b>branco</b> para outras vias (consoante o tipo), <b>castanho</b> para turismo.</p>`),
  Q('O sinal de início de localidade é importante porque:', ['A partir dele aplica-se o limite geral de 50 km/h (ligeiros), salvo outra sinalização', 'Indica uma área de serviço', 'Permite buzinar', 'Proíbe estacionar'], 0, ''),
], [
  Q(`${SIGN('info', 'P')} Este sinal indica:`, ['Parque/zona de estacionamento', 'Proibido estacionar', 'Polícia', 'Portagem'], 0, ''),
  TF('Velocidade recomendada é indicada num sinal quadrado azul com o número.', true, ''),
  Q('Sinal azul com uma autoestrada desenhada indica:', ['Início de autoestrada', 'Fim de autoestrada', 'Via reservada a velocípedes', 'Ponte'], 0, ''),
  Q('Os sinais turísticos costumam ter fundo:', ['Castanho', 'Vermelho', 'Amarelo', 'Preto'], 0, ''),
]);
L('marcas', U2, 'Marcas rodoviárias', [D_.RST], [
  T('Linhas no chão', `<ul><li><b>Linha contínua</b>: proibido pisar ou transpor.</li><li><b>Linha descontínua</b>: podes transpor (ultrapassar, mudar de via) com segurança.</li><li><b>Linha mista</b> (contínua + descontínua): só podes transpor <b>do lado da descontínua</b>.</li><li><b>Zebrado</b>: área onde é proibido circular/parar.</li><li><b>Passagem para peões</b> (riscas largas brancas), <b>linha de paragem</b> (transversal contínua — STOP/semáforo), <b>linha de cedência</b> (transversal descontínua / triângulos).</li><li><b>Linha guia</b> (descontínua curta) e setas de seleção de via.</li></ul>`),
  Q('Linha mista: a parte descontínua está do teu lado. Podes:', ['Transpor para ultrapassar, se for seguro', 'Nunca transpor', 'Apenas virar à esquerda', 'Só de noite'], 0, ''),
  Q('Linhas transversais contínuas antes de um cruzamento com STOP indicam:', ['Linha de paragem', 'Linha de cedência', 'Passadeira', 'Estacionamento'], 0, ''),
], [
  TF('Podes pisar uma linha contínua para contornar um carro estacionado em segunda fila se não houver ninguém.', false, 'É proibido transpor linha contínua (exceto situações excecionais legalmente previstas).'),
  Q('Uma área zebrada no chão significa:', ['Proibido circular e parar sobre ela', 'Estacionamento para motos', 'Faixa de aceleração', 'Passadeira'], 0, ''),
  Q('Linhas amarelas em ziguezague junto ao passeio indicam normalmente:', ['Proibição de estacionar (ex: paragem de transportes)', 'Estacionamento pago', 'Via de bicicletas', 'Lugares para deficientes'], 0, ''),
  Q('Setas no pavimento numa via antes de um cruzamento:', ['Obrigam a seguir a direção indicada para essa via', 'São apenas sugestões', 'Indicam o sentido do vento', 'Indicam zona de estacionamento'], 0, ''),
]);
L('semaf', U2, 'Semáforos e sinais dos agentes', [D_.CE, D_.RST], [
  T('Luzes', `<ul><li><b>Vermelho</b>: parar antes da linha de paragem.</li><li><b>Amarelo fixo</b>: parar, a não ser que já estejas tão perto que não consigas parar em segurança.</li><li><b>Verde</b>: avançar, se o cruzamento estiver livre (não entres se não conseguires sair — não bloqueies o cruzamento!).</li><li><b>Amarelo intermitente</b>: avança com especial prudência; aplicam-se outros sinais/regras.</li><li><b>Seta verde</b> adicional: podes avançar nessa direção, cedendo aos peões e veículos com prioridade.</li></ul>`),
  T('Agentes', `<ul><li>Braço levantado na vertical: <b>parar</b> para todos os que se aproximam (exceto quem já está no cruzamento, que deve sair).</li><li>Braços estendidos horizontalmente: param os que se apresentam de frente e de trás do agente; os de lado podem avançar.</li><li>Movimento do braço: indicação de avançar/abrandar.</li></ul>`),
  Q('Semáforo amarelo fixo e estás a 5 m da linha a 50 km/h. O que fazes?', ['Avanço com cuidado — não consigo parar em segurança tão perto', 'Travo a fundo de qualquer forma', 'Acelero muito para passar', 'Paro dentro do cruzamento'], 0, 'A 50 km/h a distância de paragem é ~25 m. O amarelo manda parar só se o puderes fazer em segurança.'),
], [
  Q('Agente com braço levantado na vertical significa:', ['Parar para todos os que se aproximam', 'Avançar', 'Virar à esquerda', 'Acelerar'], 0, ''),
  TF('Com verde, podes entrar no cruzamento mesmo que o trânsito à frente esteja parado e fiques no meio.', false, 'Não podes bloquear o cruzamento.'),
  Q('Vermelho com seta verde intermitente/fixa à direita:', ['Podes virar à direita cedendo passagem aos peões e veículos com prioridade', 'Tens de parar sempre', 'Tens prioridade absoluta', 'Só autocarros podem passar'], 0, ''),
  Q('Avançar com vermelho é tipicamente:', ['Contraordenação muito grave', 'Leve', 'Permitido de noite', 'Permitido se não vier ninguém'], 0, ''),
]);

/* ============ U3 — REGRAS DE CIRCULAÇÃO ============ */
const U3 = 'U3 · Regras de circulação';
L('posicao', U3, 'Posição na via e circulação pela direita', [D_.CE], [
  T('Pela direita', `<p>Em Portugal circula-se pela <b>direita</b>, o mais próximo possível das bermas/passeios (mantendo distância de segurança destes). Em vias com várias vias no mesmo sentido, usa a <b>via mais à direita</b> que estiver livre; as da esquerda servem para ultrapassar (e, dentro de localidades, para ir para a esquerda/seguir a via adequada ao destino).</p><div class="key">"Andar sempre na faixa do meio" na autoestrada sem razão é infração — e um hábito perigoso.</div>`),
  Q('Na autoestrada com 3 vias, sem trânsito, qual usas?', ['A da direita', 'A do meio', 'A da esquerda', 'Qualquer uma'], 0, ''),
], [
  TF('Em vias com várias faixas no mesmo sentido, deves circular pela via mais à direita que esteja livre.', true, ''),
  Q('Para virar à esquerda numa via de dois sentidos, deves aproximar-te:', ['Do eixo da via (sem o pisar se for contínuo)', 'Da berma direita', 'Do passeio esquerdo', 'Do centro do cruzamento sem sinalizar'], 0, ''),
  Q('Dentro de localidades com várias vias no mesmo sentido, podes usar a via que melhor convier ao teu destino:', ['Sim, mas sem mudanças de via desnecessárias e sinalizando', 'Não, sempre a da direita', 'Só a da esquerda', 'Só com autorização'], 0, 'Confirma no Código as regras específicas para vias dentro de localidades.'),
  Q('Circular na berma para ultrapassar a fila é:', ['Proibido', 'Permitido em hora de ponta', 'Permitido a 30 km/h', 'Permitido com piscas'], 0, ''),
]);
L('veloc', U3, 'Limites gerais de velocidade', [D_.CE, D_.ANSR], [
  T('Ligeiros de passageiros (sem reboque)', `<table><tr><th>Via</th><th>Limite</th></tr><tr><td>Dentro de localidades</td><td><b>50 km/h</b></td></tr><tr><td>Fora de localidades (estradas)</td><td><b>90 km/h</b></td></tr><tr><td>Vias reservadas a automóveis e motociclos</td><td><b>100 km/h</b></td></tr><tr><td>Autoestradas</td><td><b>120 km/h</b> (mínimo 50 km/h)</td></tr></table><p>Com <b>reboque</b> os limites são mais baixos (tipicamente 50 / 70 / 80 / 100). Os sinais podem impor limites diferentes.</p>`),
  Q('Limite geral de um ligeiro de passageiros numa estrada fora de localidades:', ['90 km/h', '100 km/h', '80 km/h', '120 km/h'], 0, ''),
  G('d_limit'),
], [
  G('d_limit'), G('d_limit'),
  Q('Velocidade mínima geral em autoestrada:', ['50 km/h', '40 km/h', '60 km/h', '80 km/h'], 0, ''),
  TF('Cumprir o limite de velocidade garante que estás a conduzir a uma velocidade adequada.', false, 'O limite é máximo; com chuva, nevoeiro, trânsito ou piso mau tens de ir mais devagar.'),
]);
L('distseg', U3, 'Velocidade adequada e distância de segurança', [D_.CE, D_.PRP, D_.ANSR], [
  T('Regra dos 2 segundos', `<p>Escolhe um ponto fixo (poste, sinal). Quando o carro da frente passar por ele, conta "<i>mil e um, mil e dois</i>". Se chegares ao ponto antes de acabar, estás <b>demasiado perto</b>. Com chuva usa pelo menos 3 s; com gelo/neve muito mais.</p>`),
  W('gap', { h: 'Quanto são 2 segundos?', b: '<p>Move o cursor e vê a distância em metros.</p>' }),
  Q('A 90 km/h, a regra dos 2 segundos dá aproximadamente:', ['50 m', '20 m', '90 m', '10 m'], 0, '90 km/h = 25 m/s × 2 s = 50 m.'),
  G('d_gap'),
], [
  G('d_gap'),
  TF('A distância de segurança deve aumentar com chuva, nevoeiro ou piso escorregadio.', true, ''),
  Q('Alguém cola-se à tua traseira. A atitude mais segura é:', ['Aumentar a distância ao carro da frente e, se possível, deixá-lo passar', 'Travar bruscamente para o assustar', 'Acelerar muito', 'Ligar os 4 piscas'], 0, 'Assim tens mais margem para travar suavemente.'),
  Q('A "velocidade adequada" depende de:', ['Condições da via, tempo, visibilidade, trânsito, veículo e estado do condutor', 'Só do limite legal', 'Só da potência do carro', 'Da pressa que temos'], 0, ''),
]);
L('distpar', U3, 'Distância de paragem: reação + travagem', [D_.PRP, D_.ERSO], [
  T('A física da travagem', `<p><b>Distância de paragem = distância de reação + distância de travagem.</b></p><ul><li>Reação (tempo típico ~1 s, mais com cansaço, álcool, telemóvel): <code>d = v × t</code> (v em m/s = km/h ÷ 3,6).</li><li>Travagem: <code>d ≈ v² / (2·μ·g)</code> — cresce com o <b>quadrado</b> da velocidade.</li></ul><div class="key">Regra prática da escola: reação ≈ (km/h ÷ 10) × 3; travagem (seco) ≈ (km/h ÷ 10)². A 50 km/h: 15 + 25 = <b>40 m</b>. Duplicar a velocidade ≈ <b>quadruplicar</b> a travagem.</div>`),
  W('stopdist', { h: 'Simulador de paragem', b: '<p>Experimenta 50 vs 60 km/h em piso molhado. Repara como 10 km/h a mais fazem uma grande diferença.</p>' }),
  G('d_stop'),
], [
  G('d_stop'), G('d_react'),
  Q('Se duplicares a velocidade, a distância de travagem (mesmas condições):', ['Fica ~4 vezes maior', 'Duplica', 'Fica igual', 'Fica 8 vezes maior'], 0, ''),
  TF('O ABS reduz sempre a distância de travagem em qualquer piso.', false, 'O ABS permite manter a direção durante a travagem; em gravilha/neve solta pode até aumentar a distância.'),
]);
L('priorid', U3, 'Prioridade: a regra geral da direita', [D_.CE], [
  T('Cede a quem vem da direita', `<p>Num cruzamento ou entroncamento <b>sem sinalização</b>, cedes passagem aos veículos que se apresentam <b>pela tua direita</b>.</p><p><b>Exceções importantes</b> — cedem sempre passagem os condutores que:</p><ul><li>saem de parques de estacionamento, zonas de abastecimento, prédios ou caminhos particulares;</li><li>entram numa via vindos de caminhos de terra batida;</li><li>fazem marcha atrás ou inversão de marcha;</li><li>entram numa rotunda (cedem a quem já circula nela, em regra).</li></ul><p>Os <b>veículos em missão urgente</b> (com sinais luminosos e sonoros ligados) têm sempre prioridade: facilita a passagem.</p>`),
  Q('Cruzamento sem sinais. Tu vais em frente, um carro vem da tua direita e outro da esquerda. Quem passa primeiro?', ['O da tua direita', 'Tu', 'O da esquerda', 'O mais rápido'], 0, ''),
  Q('Sais da garagem de um prédio para a rua. Quem tem prioridade?', ['Os veículos que circulam na rua', 'Tu, se vieres da direita deles', 'Quem buzinar', 'Quem for maior'], 0, ''),
], [
  TF('Uma ambulância com sinais luminosos e sonoros tem prioridade mesmo com o semáforo verde para ti.', true, ''),
  Q('Vens de um caminho de terra batida e vais entrar numa estrada alcatroada. Deves:', ['Ceder passagem a todos os veículos da estrada', 'Usar a regra da direita', 'Entrar com prioridade', 'Buzinar'], 0, ''),
  Q('Quem faz inversão de marcha:', ['Cede passagem a todos os outros', 'Tem prioridade', 'Usa a regra da direita', 'Só cede aos peões'], 0, ''),
  Q('Num cruzamento sem sinais com 4 carros a chegar ao mesmo tempo (um de cada lado), a solução é:', ['Comunicação e prudência: um avança cedendo cuidadosamente; ninguém deve forçar', 'Passa o maior', 'Passam todos ao mesmo tempo', 'Passa quem buzinar'], 0, 'É uma situação de bloqueio que a regra da direita não resolve.'),
]);
L('cruz', U3, 'Cruzamentos e entroncamentos', [D_.CE], [
  T('Como abordar', `<ol><li>Observa sinais e marcas com antecedência.</li><li>Escolhe a via correta (direita para virar à direita, junto ao eixo/via da esquerda para virar à esquerda).</li><li>Espelhos → pisca → abrandar → (mudança de velocidade).</li><li>Verifica prioridades, peões e ciclistas; não entres se não conseguires sair.</li></ol><p>Em viragem à esquerda com trânsito em sentido contrário, os que seguem em frente ou viram à direita (em sentido oposto) passam primeiro, salvo sinalização.</p>`),
  Q('Vais virar à esquerda num cruzamento e vem um carro de frente a seguir em frente. Quem passa?', ['O carro de frente', 'Tu', 'Quem chegou primeiro', 'Quem tiver pisca'], 0, ''),
], [
  Q('É proibido ultrapassar nos cruzamentos e entroncamentos, salvo em casos como:', ['Quando há semáforos/agentes a regular ou tens prioridade sinalizada e visibilidade, entre outras exceções previstas', 'Nunca há exceções', 'Sempre que quiseres', 'Só de noite'], 0, 'O Código prevê exceções — a regra base é a proibição.'),
  TF('Ao virar à direita deves ceder passagem aos peões que atravessam a via onde vais entrar.', true, ''),
  Q('Parar ou estacionar a menos de 5 metros de um cruzamento é:', ['Proibido', 'Permitido', 'Permitido com 4 piscas', 'Permitido de dia'], 0, ''),
  Q('Num entroncamento em T sem sinais, vens da perna do T. Um carro vem da tua esquerda na via principal. Quem passa?', ['Tu, se ele vier da tua esquerda (regra da direita) — mas com prudência e confirmando a sinalização', 'Ele, sempre', 'Quem for mais rápido', 'Nenhum'], 0, 'Sem sinalização aplica-se a regra da direita. Na prática, estes entroncamentos quase sempre têm sinais — procura-os!'),
]);
L('rotunda', U3, 'Rotundas', [D_.CE, D_.ANSR], [
  T('As regras da rotunda', `<ul><li>Ao entrar, <b>cede passagem a quem já circula na rotunda</b> (normalmente há sinal de cedência).</li><li>Circula no sentido contrário ao dos ponteiros do relógio.</li><li><b>1.ª saída</b>: usa a via da <b>direita</b>.</li><li><b>Outras saídas</b>: podes ocupar as vias mais interiores, mas deves aproximar-te progressivamente da via da direita antes de sair, cedendo a quem nela circula.</li><li><b>Sinaliza</b>: pisca direito antes da saída que vais tomar.</li><li>Veículos pesados e velocípedes podem ocupar a via da direita mesmo para outras saídas — atenção a eles.</li></ul>`),
  Q('Vais sair na 1.ª saída de uma rotunda de 2 vias. Que via usas?', ['A da direita', 'A da esquerda (interior)', 'Qualquer uma', 'A do meio e depois a da direita'], 0, ''),
  Q('Entras numa rotunda com sinal de cedência. Quem tem prioridade?', ['Quem já circula na rotunda', 'Tu, porque vens da direita deles', 'Quem buzinar', 'Os pesados'], 0, ''),
], [
  TF('Antes de sair da rotunda deves ligar o pisca direito.', true, ''),
  Q('Na rotunda, um ciclista circula na via da direita e vai para a 3.ª saída. Tu vais sair na 2.ª, vindo da via interior. Deves:', ['Ceder-lhe passagem antes de sair', 'Sair à frente dele, tens prioridade', 'Buzinar', 'Ultrapassá-lo pela direita'], 0, ''),
  Q('Sentido de circulação numa rotunda em Portugal:', ['Contrário ao dos ponteiros do relógio', 'Sentido dos ponteiros', 'Indiferente', 'Depende da rotunda'], 0, ''),
]);
L('mudanca', U3, 'Mudança de direção, de via e sinalização de manobras', [D_.CE, D_.PRP], [
  T('ESPM: Espelhos – Sinal – Posição – Manobra', `<ol><li><b>Espelhos</b> (interior + exterior) e <b>ângulo morto</b> (olhar por cima do ombro).</li><li><b>Sinal</b>: pisca com antecedência suficiente.</li><li><b>Posição</b>: coloca o carro na via correta.</li><li><b>Manobra</b>: executa só se não houver perigo nem embaraço para os outros. Desliga o pisca depois.</li></ol><div class="warn">Ligar o pisca <b>não dá prioridade</b> — só informa a tua intenção.</div>`),
  Q('Ao mudar de via, o ângulo morto verifica-se:', ['Olhando rapidamente por cima do ombro', 'Pelo espelho interior', 'Não é necessário com espelhos grandes', 'Pelo retrovisor do carro da frente'], 0, ''),
], [
  TF('Com o pisca ligado, os outros condutores são obrigados a deixar-te mudar de via.', false, 'O pisca só informa; tens de esperar por espaço seguro.'),
  Q('Ordem correta antes de mudar de direção:', ['Espelhos, sinal, posição, manobra', 'Manobra, sinal, espelhos', 'Sinal, manobra, espelhos', 'Posição, manobra, sinal'], 0, ''),
  Q('Esqueceste o pisca ligado depois de virar. O risco é:', ['Os outros pensarem que vais virar e avançarem à tua frente', 'Nenhum', 'Gastar a bateria', 'Ficares sem prioridade em tudo'], 0, ''),
  Q('Numa estrada de 2 vias por sentido, vais virar à esquerda daqui a 300 m. Deves:', ['Mudar com tempo para a via da esquerda, em segurança e sinalizando', 'Mudar no último segundo', 'Virar a partir da via da direita', 'Parar na via da direita e esperar'], 0, ''),
]);
L('ultrap', U3, 'Ultrapassagem', [D_.CE, D_.ANSR], [
  T('Como ultrapassar', `<p>Ultrapassa-se pela <b>esquerda</b>. Antes: visibilidade suficiente, espaço livre à frente, ninguém a ultrapassar-te, o da frente não sinalizou viragem à esquerda. Durante: distância lateral adequada; ao ultrapassar <b>velocípedes</b> deixa pelo menos <b>1,5 m</b> e abranda. Depois: regressa à direita sem cortar a frente ao ultrapassado.</p><p>Quem é ultrapassado <b>não deve acelerar</b> e deve chegar-se à direita.</p>`),
  T('Onde é proibido', `<ul><li>Lombas e curvas de visibilidade reduzida.</li><li>Imediatamente antes e nas passagens de peões/velocípedes.</li><li>Passagens de nível e suas proximidades.</li><li>Cruzamentos e entroncamentos (salvo exceções).</li><li>Com linha contínua / sinal de proibição.</li></ul><p>Ultrapassar pela direita só é permitido em casos como quando o veículo da frente sinalizou e se encostou para virar à esquerda (e em filas de trânsito em vias com várias vias, nas condições legais).</p>`),
  Q('Distância lateral mínima ao ultrapassar uma bicicleta:', ['1,5 m', '0,5 m', '1 m', '3 m'], 0, ''),
  Q('Estás a ser ultrapassado. Deves:', ['Manter ou reduzir a velocidade e chegar-te à direita', 'Acelerar', 'Ir para a esquerda', 'Travar a fundo'], 0, ''),
], [
  TF('É permitido ultrapassar numa passagem para peões se não houver peões à vista.', false, ''),
  Q('Podes ultrapassar pela direita um carro que:', ['Sinalizou e se encostou ao eixo para virar à esquerda', 'Vai devagar na via da esquerda em estrada de 1 via por sentido', 'Está a ultrapassar outro', 'Vai a 50 km/h fora de localidades'], 0, ''),
  Q('Antes de iniciar uma ultrapassagem deves confirmar que:', ['Ninguém atrás iniciou já uma ultrapassagem a ti', 'O carro da frente acelera', 'Tens os médios ligados', 'Está a chover'], 0, ''),
  Q('Ultrapassar numa curva sem visibilidade é perigoso sobretudo porque:', ['Não vês veículos em sentido contrário a tempo', 'O motor perde força', 'Os pneus aquecem', 'Gastas mais combustível'], 0, ''),
]);
L('inversao', U3, 'Inversão de marcha e marcha atrás', [D_.CE], [
  T('Quando é proibido', `<p><b>Inversão de marcha</b> proibida em: autoestradas e vias reservadas a automóveis; lombas, curvas, cruzamentos com pouca visibilidade; passagens de nível; túneis e pontes (em regra); e onde houver sinal/linha contínua.</p><p><b>Marcha atrás</b>: só como manobra auxiliar ou de recurso, devagar e no menor trajeto possível; proibida em autoestradas (exceto emergência regulamentada), cruzamentos e curvas sem visibilidade.</p><p>Quem faz estas manobras <b>cede passagem a todos</b>.</p>`),
  Q('Na autoestrada, falhaste a saída. O que fazes?', ['Sigo até à próxima saída', 'Faço marcha atrás pela berma', 'Inverto a marcha no separador', 'Paro e espero'], 0, 'Marcha atrás/inversão em autoestrada é extremamente perigosa e proibida.'),
], [
  TF('A marcha atrás deve ser feita lentamente e no menor percurso possível.', true, ''),
  Q('Inversão de marcha numa curva sem visibilidade é:', ['Proibida', 'Permitida com pisca', 'Permitida de dia', 'Permitida em vias com pouco trânsito'], 0, ''),
  Q('A "inversão em 3 manobras" no exame prático deve ser feita:', ['Num local permitido, com observação constante e sem tocar no passeio', 'Sempre a alta velocidade', 'Sem olhar para trás', 'Numa curva'], 0, ''),
  Q('Quem faz marcha atrás:', ['Cede passagem a todos os outros utentes', 'Tem prioridade', 'Usa a regra da direita', 'Só cede a peões'], 0, ''),
]);
L('estac', U3, 'Paragem e estacionamento', [D_.CE], [
  T('Parar ≠ estacionar', `<p><b>Paragem</b>: imobilização pelo tempo estritamente necessário para entrada/saída de passageiros ou carga/descarga, com o condutor pronto a retomar a marcha. <b>Estacionamento</b>: imobilização que não é paragem.</p><p>Estaciona do <b>lado direito</b> (em vias de dois sentidos), paralelo ao passeio, sem dificultar o trânsito.</p>`),
  T('Proibido parar e estacionar (exemplos)', `<ul><li>Nas passagens de peões/velocípedes (e imediatamente antes).</li><li>A menos de <b>5 m</b> dos cruzamentos e entroncamentos.</li><li>Em curvas, lombas, túneis, passagens de nível e pontes (com visibilidade insuficiente).</li><li>Nas pistas de velocípedes, passeios (salvo sinalização), paragens de transportes públicos.</li><li>Em segunda fila.</li><li>Em frente a entradas de garagens / acessos assinalados.</li></ul>`),
  Q('Estacionar em segunda fila "só 2 minutos com os 4 piscas" é:', ['Proibido — os piscas não legalizam o estacionamento', 'Permitido até 5 minutos', 'Permitido de noite', 'Permitido se ficares no carro'], 0, ''),
], [
  TF('Parar para deixar sair um passageiro, junto ao passeio, onde não é proibido, é uma paragem.', true, ''),
  Q('Ao estacionar numa descida junto ao passeio (caixa manual), deves:', ['Travão de mão, engrenar marcha atrás (ou 1.ª) e virar as rodas para o passeio', 'Deixar em ponto morto', 'Virar as rodas para a estrada', 'Só travão de mão'], 0, 'Se o carro deslizar, as rodas encostam ao passeio.'),
  Q('Antes de abrires a porta do lado da via, deves:', ['Verificar o espelho e olhar para trás (ciclistas!) — idealmente abrir com a mão mais afastada', 'Abrir rapidamente', 'Buzinar', 'Ligar os médios'], 0, 'Técnica "Dutch reach": força-te a rodar o corpo e ver.'),
  Q('Estacionar num lugar reservado a pessoas com deficiência sem o dístico é:', ['Infração', 'Permitido por 10 minutos', 'Permitido à noite', 'Permitido se estiver vazio'], 0, ''),
]);
L('peoes', U3, 'Peões, ciclistas e utilizadores vulneráveis', [D_.CE, D_.ANSR, D_.OMS], [
  T('Proteger os mais frágeis', `<p>O Código da Estrada estabelece que os condutores devem ter <b>especial cuidado</b> com os utilizadores vulneráveis: peões, ciclistas, crianças, idosos e pessoas com mobilidade reduzida.</p><ul><li>Nas <b>passadeiras</b>, cede passagem aos peões que já iniciaram a travessia ou que nela vão entrar; abranda ao aproximar-te.</li><li>Ao <b>mudar de direção</b>, cede aos peões que atravessam a via onde vais entrar.</li><li>Ao ultrapassar <b>ciclistas</b>: ≥ 1,5 m e velocidade reduzida.</li><li>Atenção a <b>trotinetes</b>, crianças junto a escolas, idosos (atravessam mais devagar).</li></ul><div class="key">Um peão atropelado a 50 km/h tem um risco de morte muitas vezes superior a 30 km/h (OMS). Velocidade é o fator nº 1.</div>`),
  Q('Um peão está parado junto à passadeira, claramente a querer atravessar. Deves:', ['Parar e deixá-lo atravessar', 'Passar rápido antes que ele entre', 'Buzinar', 'Fazer sinal de luzes e acelerar'], 0, ''),
], [
  TF('Um carro parado na via ao lado, junto a uma passadeira, pode estar a esconder um peão — deves abrandar e estar pronto a parar.', true, ''),
  Q('Ciclistas podem circular lado a lado?', ['Em certas condições, desde que não causem perigo/embaraço ao trânsito (ver Código)', 'Nunca', 'Sempre, em qualquer via', 'Só em autoestrada'], 0, ''),
  Q('Junto a escolas, à hora de entrada/saída, o mais correto é:', ['Reduzir bastante a velocidade e estar preparado para paragens súbitas', 'Buzinar para afastar as crianças', 'Manter 50 km/h', 'Estacionar na passadeira'], 0, ''),
  Q('Ultrapassar um veículo que parou para deixar passar peões na passadeira é:', ['Proibido e muito perigoso', 'Permitido pela esquerda', 'Permitido se buzinares', 'Permitido de noite'], 0, ''),
]);
L('ae', U3, 'Autoestradas e vias rápidas', [D_.CE, D_.ANSR], [
  T('Entrar, circular, sair', `<ul><li><b>Entrar</b>: usa a via de aceleração para atingir a velocidade do trânsito; cede passagem a quem circula na autoestrada; sinaliza.</li><li><b>Circular</b>: pela via mais à direita; distância de segurança; não ultrapassar pela direita.</li><li><b>Sair</b>: sinaliza com antecedência, passa para a direita e abranda <b>na via de desaceleração</b>, não na autoestrada.</li></ul><p><b>Proibido</b>: marcha atrás, inversão de marcha, parar/estacionar (exceto áreas próprias ou emergência na berma), circular na berma, peões e veículos lentos (ex: velocípedes, ciclomotores).</p>`),
  Q('Onde deves reduzir a velocidade para sair da autoestrada?', ['Na via de desaceleração', 'Na via da direita antes da saída', 'Na via da esquerda', 'Na berma'], 0, ''),
], [
  TF('Na via de aceleração tens prioridade sobre quem circula na autoestrada.', false, 'Quem entra cede passagem.'),
  Q('Avaria na autoestrada. O que fazes primeiro?', ['Encostar à berma, ligar os 4 piscas, vestir o colete antes de sair e ir para trás das guardas', 'Ficar dentro do carro na via', 'Empurrar o carro para a via da esquerda', 'Fazer marcha atrás até à saída'], 0, ''),
  Q('Limite máximo geral em autoestrada para ligeiros de passageiros sem reboque:', ['120 km/h', '100 km/h', '130 km/h', '110 km/h'], 0, ''),
  Q('Ao ver um painel de "fila de trânsito" ou acidente à frente na autoestrada, uma boa prática é:', ['Abrandar progressivamente e ligar os 4 piscas brevemente para avisar quem vem atrás', 'Travar a fundo no último momento', 'Mudar para a berma', 'Ultrapassar pela direita'], 0, ''),
]);
L('pn', U3, 'Passagens de nível, túneis e pontes', [D_.CE, D_.RST], [
  T('Atenção redobrada', `<p><b>Passagens de nível</b>: abranda; com <b>sinal luminoso vermelho</b> (intermitente) ou barreiras a baixar/baixadas — <b>pára</b>. Nunca pares em cima da linha; não entres se o trânsito à frente estiver parado. Sem guarda: olha, ouve e só depois atravessa. Se o carro ficar imobilizado na linha: tira todos os ocupantes imediatamente e afasta-os.</p><p><b>Túneis</b>: médios ligados, sem ultrapassagens se proibido, distância maior, nunca parar exceto emergência; em incêndio, deixar o carro e seguir para as saídas de emergência.</p>`),
  Q('Luzes vermelhas intermitentes numa passagem de nível, sem comboio à vista:', ['Paro e espero que se apaguem', 'Passo com cuidado', 'Passo se a barreira estiver levantada', 'Buzino e passo'], 0, ''),
], [
  TF('Nos túneis é obrigatório circular com as luzes de cruzamento (médios) ligadas.', true, ''),
  Q('O carro avariou em cima da linha férrea. Prioridade absoluta:', ['Retirar todos os ocupantes e afastá-los da linha', 'Tentar ligar o carro várias vezes', 'Ligar para o seguro', 'Colocar o triângulo'], 0, ''),
  Q('Ultrapassar na aproximação a uma passagem de nível é:', ['Proibido', 'Permitido sem barreiras', 'Permitido de dia', 'Permitido a pesados'], 0, ''),
  Q('Num túnel com trânsito parado, deves:', ['Manter distância, desligar o motor se a paragem for longa e ouvir as indicações (rádio/painéis)', 'Fazer inversão de marcha', 'Sair do carro e andar pela via', 'Encostar ao carro da frente'], 0, ''),
]);
L('luzes', U3, 'Iluminação: médios, máximos, nevoeiro', [D_.CE], [
  T('Que luzes usar', `<ul><li><b>Presença (mínimos)</b>: estacionado em local sem iluminação, em certas situações.</li><li><b>Cruzamento (médios)</b>: do anoitecer ao amanhecer, em túneis e sempre que a visibilidade for insuficiente (chuva intensa, nevoeiro).</li><li><b>Estrada (máximos)</b>: fora das localidades, de noite, quando não encandeiam ninguém. Troca para médios ao cruzar ou seguir outro veículo.</li><li><b>Nevoeiro</b>: os traseiros só com visibilidade <b>muito reduzida</b> (encandeiam quem vem atrás); desliga quando a visibilidade melhorar.</li></ul>`),
  Q('De noite, fora da localidade, aparece um carro de frente. Estás com máximos. Deves:', ['Mudar para médios', 'Manter máximos', 'Desligar as luzes', 'Ligar os de nevoeiro'], 0, ''),
], [
  TF('Usar as luzes de nevoeiro traseiras com chuva fraca é correto.', false, 'Encandeiam quem vem atrás. Só com visibilidade muito reduzida.'),
  Q('Se fores encandeado por um carro de frente:', ['Olha para a margem direita da estrada e abranda', 'Liga os máximos de volta', 'Fecha os olhos', 'Trava a fundo'], 0, ''),
  Q('Dentro de localidades bem iluminadas, de noite, usas:', ['Médios', 'Máximos', 'Só mínimos', 'Nevoeiro'], 0, ''),
  Q('Luzes de circulação diurna (DRL) de dia em túneis:', ['Não chegam — liga os médios', 'Chegam sempre', 'São proibidas', 'Substituem os máximos'], 0, 'As DRL normalmente não acendem as luzes traseiras.'),
]);

/* ============ U4 — SEGURANÇA E O CONDUTOR ============ */
const U4 = 'U4 · Segurança e o condutor';
L('alcool', U4, 'Álcool e drogas', [D_.CE, D_.ANSR, D_.OMS], [
  T('Taxas de álcool (TAS)', `<table><tr><th>Condutor</th><th>Limite</th></tr><tr><td>Geral</td><td><b>&lt; 0,5 g/l</b></td></tr><tr><td>Regime probatório (3 primeiros anos), profissionais, transporte de crianças/urgência</td><td><b>&lt; 0,2 g/l</b></td></tr></table><p>Classificação (regra geral): 0,5–0,8 g/l → <b>grave</b>; 0,8–1,2 g/l → <b>muito grave</b>; <b>≥ 1,2 g/l → crime</b>. Para quem tem o limite de 0,2: 0,2–0,5 → grave; 0,5–1,2 → muito grave; ≥1,2 → crime.</p>`),
  T('O que o álcool faz', `<p>Aumenta o tempo de reação, reduz o campo visual, dá falsa confiança e piora a avaliação de distâncias e velocidades. <b>Só o tempo elimina o álcool</b> (aprox. 0,1–0,15 g/l por hora) — café, duche ou comer não aceleram. Drogas e muitos medicamentos (ansiolíticos, anti-histamínicos) também afetam a condução; recusar o teste é crime de desobediência.</p><div class="key">Regra pessoal recomendada: <b>se beberes, não conduzes</b>. Ponto.</div>`),
  G('d_alcool'),
], [
  G('d_alcool'), G('d_alcool'),
  TF('Beber café forte reduz a taxa de álcool no sangue.', false, 'Só o tempo elimina o álcool.'),
  Q('Limite de TAS para um condutor em regime probatório:', ['0,2 g/l', '0,5 g/l', '0,0 g/l', '0,8 g/l'], 0, ''),
]);
L('fadiga', U4, 'Fadiga, distrações e telemóvel', [D_.ANSR, D_.ERSO, D_.CE], [
  T('Os inimigos silenciosos', `<p><b>Fadiga</b>: sinais — bocejar, pestanejar, não lembrar dos últimos km, sair da via. Solução: <b>parar e descansar</b> (pausa a cada ~2 h; uma sesta curta de 15–20 min ajuda). Abrir a janela ou subir o rádio <b>não</b> resolve.</p><p><b>Distrações</b>: visuais (olhar o ecrã), manuais (mexer no telemóvel), cognitivas (conversa intensa). Escrever uma mensagem a 90 km/h e olhar 4 s para o ecrã = <b>100 m</b> conduzidos às cegas.</p><p>O uso do telemóvel ao volante é proibido, exceto sistemas mãos-livres/auricular que não impliquem manuseamento continuado.</p>`),
  Q('A 90 km/h, olhar 3 segundos para o telemóvel equivale a conduzir às cegas:', ['75 m', '30 m', '9 m', '150 m'], 0, '25 m/s × 3 s = 75 m.'),
], [
  TF('Abrir a janela e aumentar o volume do rádio é uma forma eficaz de combater o sono ao volante.', false, 'Só descansar resolve.'),
  Q('Recomenda-se uma pausa em viagens longas a cada:', ['~2 horas', '6 horas', '30 minutos obrigatoriamente', 'Não é necessário'], 0, ''),
  Q('Qual destas é uma distração cognitiva?', ['Uma conversa telefónica intensa, mesmo em mãos-livres', 'Mexer no rádio', 'Olhar para um outdoor', 'Beber água'], 0, ''),
  G('d_blind'),
]);
L('cinto', U4, 'Cinto de segurança e retenção de crianças', [D_.CE, D_.ANSR], [
  T('Cinto: todos, sempre', `<p>Obrigatório para condutor e passageiros, à frente e atrás. Um passageiro traseiro sem cinto pode ser projetado contra os da frente com uma força equivalente a várias vezes o seu peso.</p><p>Posição correta: banda diagonal sobre o ombro e peito (não no pescoço), banda abdominal sobre a bacia, sem folgas.</p>`),
  T('Crianças', `<p>Crianças com <b>menos de 12 anos e menos de 135 cm</b> de altura devem usar <b>sistema de retenção homologado</b> adaptado ao peso/altura. Não podem ir no banco da frente, salvo exceções (ex: cadeira virada para trás com o <b>airbag frontal desativado</b>, ou veículo sem bancos traseiros).</p><div class="warn">Nunca uma cadeirinha virada para trás à frente de um airbag ativo: o airbag pode ser fatal para o bebé.</div>`),
  Q('Uma criança de 10 anos com 140 cm de altura:', ['Pode usar o cinto do carro, ficando bem ajustado (e em regra atrás)', 'Tem obrigatoriamente cadeira de bebé', 'Pode ir sem cinto', 'Tem de ir à frente'], 0, 'O critério é "menos de 12 anos E menos de 135 cm" para sistema de retenção obrigatório.'),
], [
  TF('O cinto é obrigatório também nos bancos traseiros.', true, ''),
  Q('Cadeira de bebé virada para trás no banco da frente exige:', ['Airbag frontal do passageiro desativado', 'Airbag ativado', 'Cinto do condutor', 'Nada especial'], 0, ''),
  Q('O condutor é responsável por:', ['Garantir que os passageiros menores usam o cinto/sistema de retenção', 'Só o seu próprio cinto', 'Nada, cada um é responsável', 'Só passageiros da frente'], 0, ''),
  Q('A banda diagonal do cinto deve passar:', ['Sobre o ombro e o meio do peito', 'Sobre o pescoço', 'Debaixo do braço', 'Atrás das costas'], 0, ''),
]);
L('adverso', U4, 'Chuva, aquaplaning, nevoeiro e noite', [D_.PRP, D_.ANSR], [
  T('Quando o tempo piora', `<ul><li><b>Primeiras chuvas</b>: o pó e óleo na estrada tornam o piso muito escorregadio.</li><li><b>Aquaplaning</b>: o pneu "flutua" numa película de água; a direção fica leve. <b>Não travar a fundo nem virar</b>: tirar o pé do acelerador, segurar o volante direito até recuperar aderência.</li><li><b>Nevoeiro</b>: médios (e de nevoeiro se a visibilidade for muito reduzida), velocidade adequada à distância que vês.</li><li><b>Vento lateral</b>: atenção ao sair de túneis/pontes e ao ultrapassar pesados.</li><li><b>Noite</b>: menos visibilidade e mais fadiga; peões e ciclistas difíceis de ver.</li></ul>`),
  Q('Em aquaplaning, deves:', ['Levantar o pé do acelerador e manter o volante direito, sem travar bruscamente', 'Travar a fundo', 'Virar bruscamente', 'Acelerar'], 0, ''),
], [
  TF('O piso fica especialmente escorregadio nos primeiros minutos de chuva após um período seco.', true, ''),
  Q('Com nevoeiro denso, a velocidade deve permitir:', ['Parar dentro da distância que consegues ver', 'Seguir o carro da frente colado às luzes dele', 'Manter o limite legal', 'Usar máximos'], 0, 'Máximos refletem no nevoeiro e pioram a visibilidade.'),
  Q('Derrapagem da traseira (sobreviragem) num carro sem ESP: técnica básica', ['Contra-virar suavemente para o lado para onde a traseira foge e não travar a fundo', 'Travar a fundo', 'Virar para o lado oposto bruscamente', 'Acelerar a fundo'], 0, 'Na prática, o ESP ajuda muito — mas a melhor técnica é não chegar lá: velocidade adequada.'),
  Q('Ao ultrapassar um camião com vento lateral forte, deves:', ['Segurar firmemente o volante e estar preparado para uma rajada ao sair da "sombra" do camião', 'Passar muito perto para ser rápido', 'Buzinar', 'Largar o volante'], 0, ''),
]);
L('defens', U4, 'Condução defensiva e perceção de risco', [D_.PRP, D_.ERSO], [
  T('Antecipar em vez de reagir', `<ul><li><b>Olhar longe</b> (12–15 s à frente) e varrer espelhos a cada 5–8 s.</li><li><b>Espaço à volta</b>: frente (2–3 s), lados (evita andar emparelhado), trás.</li><li><b>Ser visto</b>: luzes, posição, sinalização clara, contacto visual com peões.</li><li><b>Supor que os outros vão errar</b>: o carro que pode sair do estacionamento, a bola que rola (há uma criança atrás!), a porta que abre.</li><li><b>Plano de fuga</b>: se algo correr mal, para onde vou?</li></ul><div class="key">Modelo SIPDE: <b>S</b>crutinar → <b>I</b>dentificar perigos → <b>P</b>rever → <b>D</b>ecidir → <b>E</b>xecutar.</div>`),
  Q('Uma bola atravessa a estrada à tua frente numa zona residencial. Deves:', ['Abrandar e estar pronto a parar — pode vir uma criança atrás', 'Desviar e acelerar', 'Buzinar e manter', 'Ignorar'], 0, ''),
], [
  TF('Condução defensiva inclui assumir que os outros condutores podem cometer erros.', true, ''),
  Q('Circular emparelhado (lado a lado) com outro carro durante muito tempo numa autoestrada:', ['Deve evitar-se — reduz as tuas saídas de emergência e podes estar no ângulo morto dele', 'É mais seguro', 'É obrigatório', 'Poupa combustível'], 0, ''),
  Q('Um carro estacionado tem as luzes de travagem acesas e as rodas viradas para a estrada. Isto sugere que:', ['Pode sair a qualquer momento — prepara-te', 'Está avariado', 'Tens de parar', 'Nada'], 0, ''),
  Q('Com que frequência é recomendável olhar para os espelhos em condução normal?', ['A cada 5–8 segundos e antes de qualquer manobra', 'Só antes de mudar de via', 'Só em autoestrada', 'Uma vez por viagem'], 0, ''),
]);
L('eco', U4, 'Condução económica e ecológica', [D_.ECO, D_.PRP], [
  T('Poupar até 15–20%', `<ul><li>Arrancar suavemente e <b>mudar cedo</b> para mudanças mais altas.</li><li><b>Antecipar</b>: tirar o pé cedo em vez de travar tarde (o corte de injeção em desaceleração gasta ~0).</li><li>Velocidade estável; em autoestrada, 120 → 100 km/h poupa bastante (resistência do ar ∝ v²).</li><li>Pressão correta dos pneus; sem peso e barras de tejadilho desnecessários.</li><li>Ar condicionado com moderação; vidros fechados a alta velocidade.</li><li>Não aquecer o motor parado.</li></ul>`),
  G('d_fuel'),
], [
  G('d_fuel'),
  TF('Em desaceleração com uma mudança engrenada, os motores modernos cortam a injeção de combustível.', true, ''),
  Q('A resistência aerodinâmica cresce com:', ['O quadrado da velocidade', 'A velocidade (linear)', 'O peso do carro', 'Não muda'], 0, ''),
  Q('Qual destas práticas aumenta o consumo?', ['Acelerações bruscas e travagens tardias', 'Antecipar o trânsito', 'Pneus com a pressão certa', 'Mudanças altas a baixa rotação adequada'], 0, ''),
]);
L('acidente', U4, 'Avarias e acidentes: o que fazer', [D_.CE, D_.INEM, D_.ANSR], [
  T('Sequência segura', `<ol><li><b>Sinaliza</b>: 4 piscas; veste o <b>colete refletor antes de sair</b> do carro.</li><li>Coloca o <b>triângulo</b> a pelo menos <b>30 m</b>, visível a pelo menos <b>100 m</b>.</li><li>Ocupantes fora do carro e atrás das guardas de segurança, se for seguro.</li><li>Feridos: liga <b>112</b> (diz onde, o quê, quantos feridos, estado). Não movas feridos salvo perigo iminente (fogo, etc.).</li><li>Danos materiais apenas: <b>Declaração Amigável</b> e retirar os carros da via se possível.</li></ol><div class="key">Primeiros socorros: <b>PAS</b> — Prevenir (proteger o local), Alertar (112), Socorrer.</div>`),
  Q('A que distância mínima deves colocar o triângulo de pré-sinalização?', ['30 m (visível a 100 m)', '10 m', '5 m', '100 m obrigatoriamente'], 0, ''),
  Q('Número europeu de emergência:', ['112', '115', '911', '118'], 0, ''),
], [
  TF('O colete refletor deve ser vestido antes de sair do veículo numa avaria na via.', true, ''),
  Q('Numa colisão só com danos materiais e ambos os condutores de acordo, preenche-se:', ['A Declaração Amigável de Acidente Automóvel', 'Uma queixa no tribunal', 'Nada', 'Um auto da GNR obrigatório sempre'], 0, ''),
  Q('Deves retirar o capacete de um motociclista ferido?', ['Não, salvo se não respirar e tiveres formação/indicação do 112', 'Sim, sempre', 'Sim, para ele respirar melhor', 'Só se pedir'], 0, 'Risco de lesão cervical.'),
  Q('Ao ligar 112, a primeira informação útil é:', ['A localização exata', 'O teu nome completo', 'A marca do carro', 'O seguro'], 0, ''),
]);
L('socorro', U4, 'Primeiros socorros básicos (SBV)', [D_.INEM], [
  T('Suporte Básico de Vida (adulto)', `<ol><li><b>Segurança</b> do local.</li><li>Avaliar <b>reatividade</b> (chamar, tocar nos ombros).</li><li>Permeabilizar a via aérea e verificar se <b>respira normalmente</b> (ver, ouvir, sentir até 10 s).</li><li>Não respira: <b>112</b> e iniciar <b>compressões</b>: 30 compressões (centro do peito, 5–6 cm, 100–120/min) : 2 insuflações (se treinado), ou só compressões.</li><li>Respira mas inconsciente: <b>Posição Lateral de Segurança (PLS)</b> — exceto suspeita de lesão da coluna em acidente, aí evita mover.</li></ol><p>Hemorragia grave: compressão direta firme sobre a ferida.</p><div class="key">Faz um curso de SBV (INEM, Cruz Vermelha) — 3 horas que podem salvar uma vida.</div>`),
  Q('Ritmo de compressões no SBV de adulto:', ['100–120 por minuto', '30 por minuto', '60 por minuto', '200 por minuto'], 0, ''),
], [
  Q('Rácio compressões:insuflações no SBV de adulto:', ['30:2', '15:2', '5:1', '10:1'], 0, ''),
  TF('Uma vítima inconsciente que respira normalmente (sem suspeita de trauma) deve ser colocada em PLS.', true, ''),
  Q('Hemorragia abundante num braço:', ['Comprimir diretamente a ferida com força (com compressa/pano)', 'Lavar com água e deixar', 'Dar água à vítima', 'Esperar'], 0, ''),
  Q('Profundidade das compressões num adulto:', ['5–6 cm', '1–2 cm', '10 cm', '0,5 cm'], 0, ''),
]);

/* ============ U5 — LEGAL E DOCUMENTOS ============ */
const U5 = 'U5 · Legal e documentos';
L('docs', U5, 'Documentos e inspeção', [D_.CE, D_.IMT], [
  T('O que deves ter', `<ul><li><b>Carta de condução</b> (ou licença de aprendizagem, com instrutor).</li><li><b>Documento de identificação</b>.</li><li><b>Certificado de matrícula</b> (antigo DUA/livrete).</li><li><b>Seguro</b> de responsabilidade civil obrigatório válido (comprovativo).</li><li><b>Inspeção periódica</b> (IPO) em dia, quando aplicável.</li></ul><p>IPO para ligeiros de passageiros: primeira aos <b>4 anos</b> após a matrícula, depois de <b>2 em 2 anos</b> até aos 8, e depois <b>anual</b>. Confirma regras atuais no IMT.</p><p>Equipamento obrigatório: triângulo e colete refletor (acessível do lugar do condutor).</p>`),
  Q('Primeira inspeção periódica de um ligeiro de passageiros novo:', ['Aos 4 anos', 'Ao 1 ano', 'Aos 2 anos', 'Aos 8 anos'], 0, ''),
], [
  TF('O seguro de responsabilidade civil automóvel é obrigatório.', true, ''),
  Q('O colete refletor deve estar:', ['Acessível ao condutor sem sair do carro', 'Na bagageira debaixo da roda', 'Em casa', 'Não é obrigatório'], 0, ''),
  Q('O certificado de matrícula identifica:', ['O veículo e o seu proprietário', 'O condutor e a sua categoria', 'O seguro', 'As infrações'], 0, ''),
  Q('Depois dos 8 anos, a IPO de um ligeiro de passageiros é:', ['Anual', 'De 2 em 2 anos', 'De 4 em 4 anos', 'Não é necessária'], 0, ''),
]);
L('pontos', U5, 'Infrações e carta por pontos', [D_.CE, D_.ANSR], [
  T('Classificação', `<p>Contraordenações: <b>leves</b>, <b>graves</b> e <b>muito graves</b>; as mais sérias são <b>crimes</b> (ex: TAS ≥ 1,2 g/l, condução sem carta, condução perigosa).</p><p><b>Carta por pontos</b>: começas com <b>12 pontos</b>.</p><ul><li>Grave: em regra <b>−2</b> (algumas, como certas de álcool, −3).</li><li>Muito grave: em regra <b>−4</b> (álcool: −5).</li><li>Crime rodoviário: <b>−6</b>.</li><li>Sem infrações durante 3 anos: <b>+3</b> (até ao máximo de 15). Ações de formação podem dar pontos extra.</li><li>Poucos pontos: frequentar ação de formação; ainda menos: nova prova teórica; <b>0 pontos → cassação</b> da carta.</li></ul>`),
  G('d_points'),
], [
  G('d_points'),
  TF('Na carta por pontos, cada condutor começa com 12 pontos.', true, ''),
  Q('Conduzir com TAS de 1,3 g/l é:', ['Crime', 'Contraordenação leve', 'Contraordenação grave', 'Permitido com carta há mais de 3 anos'], 0, ''),
  Q('Com 0 pontos na carta:', ['A carta é cassada', 'Recebes um aviso', 'Ganhas 3 pontos', 'Nada acontece'], 0, ''),
]);
L('seguro', U5, 'Seguro e Declaração Amigável', [SRC('ASF — Autoridade de Supervisão de Seguros', 'https://www.asf.com.pt/'), D_.CE], [
  T('Seguro automóvel', `<p><b>Responsabilidade civil</b> (obrigatório): cobre danos que causas a terceiros. <b>Danos próprios</b> (facultativo): cobre o teu carro. Conduzir sem seguro: coima elevada e apreensão do veículo; se causares danos, pagas tudo (o Fundo de Garantia Automóvel paga às vítimas e depois cobra-te).</p>`),
  T('Declaração Amigável (DAAA)', `<ol><li>Uma folha (com cópia) preenchida em conjunto pelos dois condutores.</li><li>Assinalar as circunstâncias (cruzes), desenhar o croqui.</li><li><b>Ambos assinam</b> — não alteres depois de assinada.</li><li>Cada um envia à sua seguradora em <b>8 dias</b>.</li></ol><p>Se houver feridos ou desacordo, chama a polícia (PSP/GNR).</p>`),
  Q('Prazo habitual para enviar a Declaração Amigável à seguradora:', ['8 dias', '30 dias', '24 horas', '1 ano'], 0, ''),
], [
  TF('O seguro de responsabilidade civil cobre os danos no teu próprio carro.', false, 'Cobre danos a terceiros. Danos próprios é cobertura facultativa.'),
  Q('Numa Declaração Amigável, depois de ambos assinarem:', ['Não deve ser alterada', 'Podes acrescentar o que quiseres em casa', 'O outro condutor pode alterar', 'É nula'], 0, ''),
  Q('Acidente com feridos ligeiros:', ['Chamar 112/autoridades, além da troca de dados', 'Só Declaração Amigável', 'Ir embora', 'Esperar pelo seguro'], 0, ''),
]);
L('carga', U5, 'Carga, passageiros e reboques', [D_.CE], [
  T('Transportar bem', `<ul><li>A carga não pode exceder a <b>MMA</b> nem comprometer estabilidade/visibilidade; deve ir bem fixa.</li><li>Carga saliente para trás deve ser sinalizada (painel/retrorrefletor) dentro dos limites legais.</li><li>Não transportar mais passageiros do que os lugares do veículo.</li><li>Objetos soltos no habitáculo tornam-se projéteis numa travagem forte (uma garrafa de 1 kg a 50 km/h "pesa" dezenas de kg no impacto).</li><li>Reboque: limites de velocidade inferiores, distâncias maiores, cuidado nas manobras.</li></ul>`),
  Q('Objetos soltos no banco de trás numa colisão:', ['Podem ser projetados com grande força e ferir os ocupantes', 'Ficam no lugar', 'Não fazem diferença', 'Protegem os ocupantes'], 0, ''),
], [
  TF('Com reboque, os limites de velocidade são mais baixos do que sem reboque.', true, ''),
  Q('Levar 6 pessoas num carro de 5 lugares é:', ['Proibido', 'Permitido se uma for criança pequena', 'Permitido em distâncias curtas', 'Permitido de dia'], 0, ''),
  Q('Cargas no tejadilho afetam:', ['O consumo e a estabilidade (centro de gravidade mais alto)', 'Nada', 'Apenas a estética', 'Os travões só'], 0, ''),
]);

/* ============ U6 — EXAME PRÁTICO ============ */
const U6 = 'U6 · Exame prático e condução real';
L('expratico', U6, 'O exame prático: o que é avaliado', [D_.IMT, D_.PRP], [
  T('O que o examinador quer ver', `<ul><li><b>Preparação</b>: ajustes, cinto, verificações, arranque seguro.</li><li><b>Observação</b>: espelhos, ângulos mortos, antecipação.</li><li><b>Domínio do veículo</b>: embraiagem, mudanças, travagem suave, volante.</li><li><b>Manobras</b>: estacionamento, inversão de marcha, arranque em subida (conforme o exame).</li><li><b>Trânsito real</b>: sinais, prioridades, velocidade adequada, posição na via, interação com peões/ciclistas.</li></ul><div class="warn">Erros tipicamente <b>eliminatórios</b>: desrespeitar STOP, vermelho ou prioridade; pôr em perigo outros utentes; o examinador ter de intervir; excesso de velocidade significativo; subir passeios com risco.</div>`),
  Q('O examinador teve de travar com o pedal dele. Normalmente isto:', ['É eliminatório', 'Não conta', 'É uma falta leve', 'Dá pontos extra'], 0, ''),
], [
  TF('Olhar exageradamente para os espelhos não é penalizado; não olhar, sim.', true, 'Observação é fundamental — mostra-a com movimentos de cabeça claros.'),
  Q('Erraste uma saída durante o exame. A melhor reação é:', ['Continuar em segurança e seguir as novas indicações', 'Fazer marcha atrás', 'Parar no meio da via', 'Inverter a marcha numa curva'], 0, ''),
  Q('Antes do exame, é boa ideia:', ['Dormir bem, conhecer a zona do exame e fazer aulas no carro em que vais fazer exame', 'Beber uma bebida energética e café', 'Treinar só manobras', 'Não comer'], 0, ''),
]);
L('manobras', U6, 'Manobras: estacionar e inverter', [D_.PRP], [
  T('Estacionamento paralelo (método de referência)', `<ol><li>Para paralelo ao carro da frente do lugar, a ~0,5–1 m, traseiras alinhadas. Pisca.</li><li>Marcha atrás, devagar; quando a tua traseira passar a traseira dele, <b>volante todo para a direita</b>.</li><li>Quando o carro fizer ~45° (ou vires o passeio no espelho esquerdo/o canto do carro de trás no centro do vidro traseiro), <b>endireita</b> as rodas e recua.</li><li>Quando a tua frente passar a traseira do carro da frente, <b>volante todo para a esquerda</b>.</li><li>Ajusta em frente/trás e centra no lugar. Rodas a ~30 cm do passeio.</li></ol><p>Devagar, sempre a observar (peões, ciclistas). As referências exatas dependem do carro — o teu instrutor ajusta-as.</p>`),
  T('Inversão de marcha em 3 manobras', `<ol><li>Encosta à direita, verifica trânsito nos dois sentidos.</li><li>Em frente, todo à esquerda, até perto do passeio oposto (sem tocar).</li><li>Marcha atrás, todo à direita, observando.</li><li>Em frente, à esquerda, e segue.</li></ol>`),
  Q('No estacionamento paralelo em marcha atrás, a velocidade deve ser:', ['Muito lenta, controlada pela embraiagem/travão', 'Rápida para acabar depressa', 'Igual à de circulação', 'Indiferente'], 0, ''),
], [
  TF('Tocar ligeiramente no passeio é sempre eliminatório.', false, 'Depende da gravidade e do critério do exame; subir o passeio com perigo é grave. Evita ambos.'),
  Q('Durante uma manobra aparece um peão atrás do carro. Deves:', ['Parar e esperar que passe', 'Buzinar e continuar', 'Acelerar', 'Ignorar se estiver longe'], 0, ''),
  Q('Antes de iniciar a inversão de marcha, verificas o trânsito:', ['Nos dois sentidos', 'Só atrás', 'Só à frente', 'Não é necessário'], 0, ''),
]);
L('planocond', U6, 'Condução urbana e em estrada: juntar tudo', [D_.PRP, D_.ANSR], [
  T('Um plano para cada viagem', `<p><b>Antes</b>: rota, tempo, estado do condutor (sono, álcool, medicação), veículo.</p><p><b>Cidade</b>: velocidade baixa, atenção a peões, ciclistas, trotinetes, portas a abrir, transportes públicos (dá prioridade a autocarros que saem da paragem quando sinalizam, onde aplicável), estacionamentos.</p><p><b>Estrada</b>: curvas — trava antes, entra devagar, acelera suavemente na saída; olha para onde queres ir. Ultrapassagens só com muita margem.</p><p><b>Autoestrada</b>: entradas/saídas, espaço, fadiga.</p><div class="key">Comentário em voz alta ("commentary driving"): descreve o que vês e o que vais fazer. Treina a atenção e é usado em formação avançada de condutores.</div>`),
  Q('Numa curva, o momento certo para travar é:', ['Antes de entrar na curva, em linha reta', 'No meio da curva', 'À saída da curva', 'Não se trava'], 0, ''),
], [
  TF('Olhar para onde queres ir (e não para o obstáculo) ajuda a controlar o carro.', true, ''),
  Q('Em cidade, um autocarro sinaliza que vai sair da paragem. Uma atitude segura e cortês é:', ['Abrandar e facilitar a saída quando possível', 'Acelerar para passar primeiro', 'Buzinar', 'Ultrapassá-lo pela direita'], 0, ''),
  Q('Qual a principal causa de acidentes graves em estradas fora das localidades?', ['Velocidade excessiva/inadequada (entre outras: álcool, distração, fadiga)', 'Pneus novos', 'Excesso de sinalização', 'Luzes ligadas de dia'], 0, ''),
]);
