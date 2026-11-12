/* Neurónio 100 — Inteligência Artificial e Machine Learning (com foco em hardware/GPU) */
const A_ = {
  CS229: SRC('Stanford CS229 — Machine Learning', 'https://cs229.stanford.edu/'),
  CS231N: SRC('Stanford CS231n — CNNs for Visual Recognition', 'https://cs231n.stanford.edu/'),
  CS224N: SRC('Stanford CS224n — NLP with Deep Learning', 'https://web.stanford.edu/class/cs224n/'),
  MIT6S191: SRC('MIT 6.S191 — Introduction to Deep Learning', 'http://introtodeeplearning.com/'),
  D2L: SRC('Dive into Deep Learning (d2l.ai)', 'https://d2l.ai/'),
  DLBOOK: SRC('Goodfellow, Bengio, Courville — Deep Learning', 'https://www.deeplearningbook.org/'),
  ISLR: SRC('James et al. — An Introduction to Statistical Learning', 'https://www.statlearning.com/'),
  KARP: SRC('Andrej Karpathy — Neural Networks: Zero to Hero', 'https://karpathy.ai/zero-to-hero.html'),
  ATT: SRC('Vaswani et al. 2017 — Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'),
  FAST: SRC('fast.ai — Practical Deep Learning', 'https://course.fast.ai/'),
  MML: SRC('Deisenroth et al. — Mathematics for Machine Learning', 'https://mml-book.github.io/'),
  PYT: SRC('PyTorch — tutoriais oficiais', 'https://pytorch.org/tutorials/'),
  NVDL: SRC('NVIDIA Deep Learning Performance Guide', 'https://docs.nvidia.com/deeplearning/performance/index.html'),
  MITHAN: SRC('MIT 6.5940 TinyML and Efficient Deep Learning (Song Han)', 'https://efficientml.ai/'),
  EYERISS: SRC('Sze et al. — Efficient Processing of Deep Neural Networks', 'https://eyeriss.mit.edu/tutorial.html'),
  SCALE: SRC('Kaplan et al. 2020 / Hoffmann et al. 2022 — Scaling laws', 'https://arxiv.org/abs/2203.15556'),
  SB: SRC('Sutton & Barto — Reinforcement Learning: An Introduction', 'http://incompleteideas.net/book/the-book-2nd.html'),
};
const COURSE = {
  id: 'ia', name: 'Neurónio 100', short: 'IA & ML', tagline: 'Machine learning, deep learning e hardware de IA', icon: '🧠', accent: '#7048e8', accent2: '#e64980', seed: 3003, days: 100, finalDays: 10, phases: ['Aprender', 'Consolidar', 'Reta final · modo entrevista'], testN: 9,
  extraName: 'projetos',
  exam: { title: 'Prova semanal: simulação de entrevista de ML', n: 12, big: 30, open: 3, sub: big => big ? '30 perguntas e 6 perguntas abertas de entrevista' : '12 perguntas técnicas e 3 perguntas abertas' },
  sources: Object.values(A_),
  disclaimer: 'Conteúdo original escrito a partir dos cursos e livros de referência indicados (Stanford, MIT, d2l.ai, Goodfellow et al.). As perguntas de entrevista são temas recorrentes em entrevistas de ML engineer e de arquitetura de hardware de IA, não perguntas oficiais de nenhuma empresa.',
  lessons: [], gens: {}, interview: [],
};
const L = (id, unit, title, src, cards, quiz) => COURSE.lessons.push({ id, unit, title, src, cards, quiz });
const V1 = 'U1 · Matemática para ML', V2 = 'U2 · Machine learning clássico', V3 = 'U3 · Deep learning', V4 = 'U4 · Transformers e IA generativa', V5 = 'U5 · Hardware e eficiência de IA', V6 = 'U6 · Prática e carreira';

/* ======================= U1 ======================= */
L('ml', V1, 'O que é machine learning (e o que não é)', [A_.CS229, A_.ISLR], [
  T('Aprender a partir de dados', `<p>Em programação clássica escreves as regras. Em <b>machine learning</b> dás exemplos e um algoritmo ajusta os <b>parâmetros</b> de um modelo para minimizar um erro (a <b>loss</b>).</p><ul><li><b>Supervisionado</b>: pares (x, y). Regressão (y contínuo: preço) ou classificação (y categoria: gato/cão).</li><li><b>Não supervisionado</b>: só x. Clustering, redução de dimensão, modelos generativos.</li><li><b>Auto-supervisionado</b>: o rótulo vem dos próprios dados (prever a próxima palavra). É assim que se treinam os LLMs.</li><li><b>Por reforço (RL)</b>: um agente age e recebe recompensas.</li></ul><div class="key">Receita de quase todo o ML: <b>modelo</b> f(x; θ) + <b>loss</b> L(θ) + <b>otimizador</b> que reduz L.</div>`),
  Q('Prever o consumo de energia de um chip (em watts) a partir da frequência e tensão é:', ['Regressão supervisionada', 'Classificação', 'Clustering', 'Aprendizagem por reforço'], 0, 'A saída é um número contínuo e tens exemplos rotulados.'),
  Q('Um LLM aprende a prever a próxima palavra em texto da internet. Que tipo de aprendizagem é?', ['Auto-supervisionada', 'Por reforço pura', 'Não supervisionada sem loss', 'Supervisionada com rótulos humanos para cada frase'], 0, 'O "rótulo" é a palavra seguinte, que já está no texto.'),
], [
  TF('Em ML, os parâmetros do modelo são escritos à mão pelo programador.', false, 'São aprendidos a partir dos dados pelo otimizador. O programador escolhe os hiperparâmetros.'),
  Q('Agrupar clientes por comportamento sem rótulos é:', ['Clustering (não supervisionado)', 'Regressão', 'Classificação binária', 'RL'], 0, ''),
  Q('Qual é um hiperparâmetro (não aprendido por gradiente)?', ['Learning rate', 'Pesos de uma camada', 'Bias de um neurónio', 'Embeddings'], 0, ''),
]);
L('linalg', V1, 'Vetores, matrizes e o produto que move a IA', [A_.MML, A_.D2L], [
  T('Tudo é álgebra linear', `<p>Uma imagem, uma frase ou um áudio viram <b>vetores</b> e <b>tensores</b>. Uma camada densa calcula <code>y = Wx + b</code>: um produto matriz-vetor. Com um lote (batch) de entradas é um produto <b>matriz-matriz</b> (GEMM).</p><ul><li>Produto interno: a·b = Σ aᵢbᵢ, mede semelhança (alinhamento).</li><li>Matriz (m×k) × (k×n) = (m×n), custa m·n·k multiplicações-somas (MACs), ou seja 2mnk FLOPs.</li><li>Transposta, norma ‖x‖, matriz identidade.</li></ul><div class="key">As GPUs da NVIDIA são, no fundo, máquinas de fazer GEMM muito depressa: os Tensor Cores fazem pequenos produtos de matrizes num só passo.</div>`),
  Q('A (32×64) × B (64×10). Dimensão do resultado?', ['32×10', '64×64', '10×32', 'Não é possível'], 0, 'As dimensões interiores (64) têm de coincidir; ficam as exteriores.'),
  N('Quantos FLOPs (contando multiplicação e soma separadamente) custa multiplicar uma matriz 100×200 por uma 200×50?', 2000000, 0, 'FLOPs', '2·m·n·k = 2·100·50·200 = 2 000 000.'),
], [
  Q('O produto interno de dois vetores perpendiculares é:', ['0', '1', '−1', 'Infinito'], 0, ''),
  Q('Uma camada densa de 512 entradas para 256 saídas tem quantos pesos (sem bias)?', ['131 072', '768', '256', '512'], 0, '512 × 256.'),
  TF('(AB)ᵀ = BᵀAᵀ', true, 'A ordem inverte-se.'),
]);
L('calc', V1, 'Derivadas, gradiente e regra da cadeia', [A_.MML, A_.KARP], [
  T('O gradiente diz para onde subir', `<p>A derivada f'(x) mede quanto f muda quando x muda um pouco. Com muitas variáveis, o <b>gradiente</b> ∇f é o vetor das derivadas parciais e aponta na direção de maior subida. Para <b>descer</b> a loss, andamos na direção oposta.</p><p><b>Regra da cadeia</b>: se y = f(g(x)), então dy/dx = f'(g(x))·g'(x). O <b>backpropagation</b> é a regra da cadeia aplicada de trás para a frente num grafo de operações.</p>`),
  T('Derivadas que vais usar sempre', `<table><tr><th>f(x)</th><th>f'(x)</th></tr><tr><td>x²</td><td>2x</td></tr><tr><td>eˣ</td><td>eˣ</td></tr><tr><td>ln x</td><td>1/x</td></tr><tr><td>σ(x) = 1/(1+e⁻ˣ)</td><td>σ(x)(1−σ(x))</td></tr><tr><td>tanh x</td><td>1 − tanh²x</td></tr><tr><td>ReLU(x)</td><td>1 se x&gt;0, senão 0</td></tr></table>`),
  N('f(x) = 3x² + 2x. Quanto vale f\'(2)?', 14, 0, '', 'f\'(x) = 6x + 2 → 14.'),
  Q('y = (2x + 1)³. dy/dx?', ['6(2x+1)²', '3(2x+1)²', '(2x+1)²', '6x²'], 0, 'Regra da cadeia: 3(2x+1)² · 2.'),
], [
  N('σ(0) = 0,5. Quanto vale σ\'(0)?', 0.25, 0.001, '', '0,5 × (1 − 0,5) = 0,25. É o valor máximo da derivada da sigmoide.'),
  TF('O gradiente aponta na direção de maior descida da função.', false, 'Aponta para a maior subida; descemos no sentido −∇f.'),
  Q('Porque é que a derivada da sigmoide causa "vanishing gradients" em redes profundas?', ['É no máximo 0,25, e o produto de muitas derivadas pequenas tende para 0', 'É sempre 1', 'É negativa', 'Não existe em 0'], 0, ''),
]);
L('prob', V1, 'Probabilidade, Bayes e distribuições', [A_.MML, A_.CS229], [
  T('Raciocinar com incerteza', `<ul><li><b>P(A|B)</b> = probabilidade de A sabendo B.</li><li><b>Teorema de Bayes</b>: P(A|B) = P(B|A)·P(A) / P(B).</li><li><b>Esperança</b> E[X] = Σ x·p(x); <b>variância</b> Var = E[(X−μ)²].</li><li>Distribuições: Bernoulli (moeda), Categórica (softmax), Gaussiana N(μ, σ²).</li></ul><p>Um classificador que dá "90% gato" está a modelar P(y|x). Treinar com cross-entropy é maximizar a <b>verosimilhança</b> (likelihood) dos dados.</p>`),
  N('Um teste deteta 99% dos chips defeituosos e dá 2% de falsos positivos. 1% dos chips é defeituoso. Se o teste der positivo, qual a probabilidade (%) de o chip ser mesmo defeituoso? (arredonda às unidades)', 33, 1, '%', 'P = 0,99·0,01 / (0,99·0,01 + 0,02·0,99) = 0,0099/0,0297 ≈ 33%. A base rate baixa domina.'),
  Q('Numa Gaussiana, que fração dos dados fica a ±2σ da média?', ['≈95%', '≈68%', '≈99,7%', '50%'], 0, 'Regra 68–95–99,7.'),
], [
  TF('Se A e B são independentes, P(A e B) = P(A)·P(B).', true, ''),
  Q('Lançar um dado justo: E[X]?', ['3,5', '3', '6', '21'], 0, '(1+…+6)/6.'),
  Q('Minimizar a cross-entropy num classificador equivale a:', ['Maximizar a verosimilhança dos rótulos corretos', 'Minimizar o número de parâmetros', 'Maximizar a variância', 'Nada de especial'], 0, ''),
]);
L('gd', V1, 'Descida do gradiente', [A_.D2L, A_.CS229], [
  T('Descer a montanha às apalpadelas', `<p>Atualização: <b>θ ← θ − η·∇L(θ)</b>, onde η é a <b>learning rate</b>.</p><ul><li>η demasiado pequeno: converge devagar.</li><li>η demasiado grande: oscila ou diverge.</li><li><b>Batch GD</b> usa todos os dados por passo; <b>SGD</b> usa um exemplo; <b>mini-batch</b> (32–4096 exemplos) é o padrão e encaixa bem em GPUs.</li></ul>`),
  W('gd', { h: 'Experimenta a learning rate', b: '<p>Minimiza f(x) = x² a partir de x = 4. Mexe na learning rate e vê o que acontece a cada passo.</p>' }),
  N('f(x) = x², x₀ = 3, η = 0,1. Quanto vale x depois de um passo?', 2.4, 0.001, '', 'x₁ = 3 − 0,1·(2·3) = 2,4.'),
], [
  Q('Com f(x) = x², para que valores de η a descida diverge?', ['η > 1', 'η < 0,5', 'η = 0,1', 'Nunca diverge'], 0, 'x ← x(1 − 2η). Diverge quando |1 − 2η| > 1, ou seja η > 1.'),
  TF('Um epoch é uma passagem completa por todos os dados de treino.', true, ''),
  Q('Porque é que se usa mini-batch em vez de um exemplo de cada vez?', ['Aproveita o paralelismo da GPU e dá gradientes menos ruidosos', 'Usa menos memória que um exemplo', 'Garante o mínimo global', 'Dispensa a learning rate'], 0, ''),
]);

/* ======================= U2 ======================= */
L('linreg', V2, 'Regressão linear e mínimos quadrados', [A_.ISLR, A_.CS229], [
  T('A linha que melhor passa pelos pontos', `<p>Modelo: ŷ = wᵀx + b. Loss: <b>MSE</b> = média de (ŷ − y)². Tem solução fechada (equação normal) <code>w = (XᵀX)⁻¹Xᵀy</code>, mas para muitos dados usa-se descida do gradiente.</p><p>Gradiente da MSE em relação a w: (2/n)·Xᵀ(Xw − y).</p>`),
  T('Em código (NumPy)', CODE(`
import numpy as np
X = np.c_[np.ones(len(x)), x]          # coluna de 1s para o bias
w = np.zeros(2)
for _ in range(1000):
    grad = 2 / len(y) * X.T @ (X @ w - y)
    w -= 0.01 * grad
print(w)   # [b, declive]`)),
  N('Previsões [2, 4] e valores reais [1, 6]. Qual é a MSE?', 2.5, 0.001, '', '((2−1)² + (4−6)²)/2 = (1+4)/2 = 2,5.'),
  Q('R² = 1 significa:', ['O modelo explica toda a variância dos dados', 'O modelo é aleatório', 'Erro de 100%', 'Há overfitting garantido'], 0, ''),
], [
  TF('A regressão linear só consegue modelar relações lineares nas features originais.', false, 'Podes criar features não lineares (x², log x) e o modelo continua linear nos parâmetros.'),
  Q('A MSE penaliza mais:', ['Erros grandes (quadrado)', 'Erros pequenos', 'Todos igual', 'Só erros negativos'], 0, 'Por isso é sensível a outliers; a MAE é mais robusta.'),
]);
L('logreg', V2, 'Regressão logística e classificação', [A_.CS229, A_.ISLR], [
  T('De números a probabilidades', `<p>Para classificação binária: p = σ(wᵀx + b). A <b>sigmoide</b> σ(z) = 1/(1+e⁻ᶻ) leva qualquer número para (0, 1). Decide-se "positivo" se p &gt; 0,5 (ou outro limiar).</p><p>Loss: <b>binary cross-entropy</b> = −[y·log p + (1−y)·log(1−p)]. Com várias classes usa-se <b>softmax</b>: pᵢ = e^zᵢ / Σ e^zⱼ.</p>`),
  N('z = wᵀx + b = 0. Qual a probabilidade dada pela sigmoide?', 0.5, 0.001, '', ''),
  N('Exemplo positivo (y=1) com p = 0,9. Binary cross-entropy (ln, 3 casas decimais)?', 0.105, 0.002, '', '−ln(0,9) ≈ 0,105.'),
], [
  Q('Softmax de [0, 0, 0]?', ['[1/3, 1/3, 1/3]', '[0, 0, 0]', '[1, 0, 0]', 'Indefinido'], 0, ''),
  TF('Apesar do nome, a regressão logística é um modelo de classificação.', true, ''),
  Q('Somar uma constante a todos os logits antes do softmax:', ['Não muda o resultado', 'Duplica as probabilidades', 'Muda a classe vencedora', 'Dá erro'], 0, 'Usa-se isto para estabilidade numérica: subtrai-se o máximo.'),
]);
L('overfit', V2, 'Overfitting, bias–variance e validação', [A_.ISLR, A_.CS229], [
  T('Decorar vs generalizar', `<ul><li><b>Underfitting</b> (bias alto): o modelo é demasiado simples, erro alto no treino e no teste.</li><li><b>Overfitting</b> (variância alta): erro baixo no treino e alto no teste. Decorou ruído.</li></ul><p>Divide os dados em <b>treino</b> (ajustar parâmetros), <b>validação</b> (escolher hiperparâmetros, early stopping) e <b>teste</b> (avaliação final, usada uma vez). Com poucos dados: <b>k-fold cross-validation</b>.</p><div class="warn"><b>Data leakage</b>: informação do teste a "vazar" para o treino (normalizar com estatísticas do conjunto todo, duplicados entre conjuntos). Dá resultados ótimos que falham em produção.</div>`),
  Q('Erro de treino 1%, erro de validação 25%. Diagnóstico?', ['Overfitting', 'Underfitting', 'Modelo perfeito', 'Learning rate baixa'], 0, 'Remédios: mais dados, regularização, data augmentation, modelo menor, early stopping.'),
  Q('Erro de treino 30%, erro de validação 31%. Diagnóstico?', ['Underfitting (bias alto)', 'Overfitting', 'Leakage', 'Nada a fazer'], 0, 'Modelo maior, mais features, treinar mais tempo.'),
], [
  TF('Podes ajustar hiperparâmetros olhando para o conjunto de teste, desde que seja poucas vezes.', false, 'Isso contamina o teste; usa a validação.'),
  Q('Em 5-fold cross-validation, quantas vezes treinas o modelo?', ['5', '1', '10', '25'], 0, ''),
]);
L('metrics', V2, 'Métricas: accuracy, precision, recall, F1, ROC', [A_.ISLR], [
  T('A matriz de confusão', `<table><tr><th></th><th>Previsto +</th><th>Previsto −</th></tr><tr><td><b>Real +</b></td><td>TP</td><td>FN</td></tr><tr><td><b>Real −</b></td><td>FP</td><td>TN</td></tr></table><ul><li><b>Precision</b> = TP/(TP+FP): dos que disse positivos, quantos eram.</li><li><b>Recall</b> = TP/(TP+FN): dos positivos reais, quantos apanhou.</li><li><b>F1</b> = 2PR/(P+R).</li><li><b>ROC-AUC</b>: qualidade da ordenação, independente do limiar.</li></ul><div class="key">Com classes desequilibradas (1% de fraudes), um modelo que diz sempre "não fraude" tem 99% de accuracy e é inútil.</div>`),
  N('TP=40, FP=10, FN=20. Precision (em decimal)?', 0.8, 0.001, '', '40/(40+10).'),
  N('Mesmos números: recall (3 casas decimais)?', 0.667, 0.002, '', '40/(40+20).'),
], [
  Q('Num rastreio de cancro, que métrica queres sobretudo alta?', ['Recall (não falhar doentes)', 'Precision', 'Accuracy', 'Nenhuma'], 0, ''),
  Q('AUC = 0,5 significa:', ['O modelo ordena ao acaso', 'Modelo perfeito', 'Precision de 50%', 'Overfitting'], 0, ''),
]);
L('reg', V2, 'Regularização: L1, L2, dropout, early stopping', [A_.DLBOOK, A_.ISLR], [
  T('Travar a complexidade', `<ul><li><b>L2 (weight decay / Ridge)</b>: soma λ‖w‖² à loss → pesos pequenos e suaves.</li><li><b>L1 (Lasso)</b>: soma λ‖w‖₁ → muitos pesos exatamente 0 (seleção de features).</li><li><b>Dropout</b>: desliga neurónios ao acaso no treino (p = 0,1–0,5), como treinar um ensemble.</li><li><b>Early stopping</b>: para quando a loss de validação deixa de descer.</li><li><b>Data augmentation</b>: rodar, cortar e mudar cores de imagens para criar exemplos novos.</li></ul>`),
  Q('Qual regularização tende a pôr pesos exatamente a zero?', ['L1', 'L2', 'Dropout', 'Batch norm'], 0, ''),
  TF('O dropout continua ativo durante a inferência.', false, 'Na inferência desliga-se. Com "inverted dropout", a escala já foi feita no treino.'),
], [
  Q('Aumentar muito o λ da L2 leva a:', ['Underfitting', 'Overfitting', 'Nenhum efeito', 'Divergência'], 0, ''),
  Q('Em AdamW, "W" refere-se a:', ['Weight decay desacoplado', 'Whitening', 'Warmup', 'Width'], 0, ''),
]);
L('trees', V2, 'Árvores de decisão, random forests e boosting', [A_.ISLR], [
  T('Perguntas sim/não em cascata', `<p>Uma <b>árvore de decisão</b> divide os dados por perguntas ("frequência &gt; 2 GHz?") escolhidas para maximizar a pureza (Gini ou entropia). Fácil de interpretar, mas faz overfitting.</p><ul><li><b>Random forest</b>: muitas árvores em amostras bootstrap e subconjuntos de features; a média reduz a variância (bagging).</li><li><b>Gradient boosting</b> (XGBoost, LightGBM, CatBoost): cada árvore nova corrige os erros das anteriores. É o rei dos dados tabulares e das competições Kaggle.</li></ul>`),
  Q('Para dados tabulares (tabelas com colunas heterogéneas), o que costuma ganhar?', ['Gradient boosting (XGBoost/LightGBM)', 'Uma CNN', 'Um transformer gigante', 'k-means'], 0, ''),
  Q('O bagging reduz sobretudo:', ['A variância', 'O bias', 'O número de features', 'O tempo de treino'], 0, ''),
], [
  TF('Árvores de decisão precisam que as features sejam normalizadas.', false, 'As divisões por limiar não dependem da escala.'),
  Q('No boosting, as árvores são treinadas:', ['Sequencialmente, cada uma a corrigir o resíduo das anteriores', 'Em paralelo e independentes', 'Só uma árvore', 'Sem dados'], 0, ''),
]);
L('unsup', V2, 'Não supervisionado: k-means, PCA, kNN', [A_.ISLR, A_.CS229], [
  T('Encontrar estrutura sem rótulos', `<ul><li><b>k-means</b>: escolhe k centros, atribui cada ponto ao mais próximo, move os centros para a média, repete.</li><li><b>PCA</b>: encontra as direções de maior variância (vetores próprios da covariância) e projeta nelas. Serve para comprimir e visualizar.</li><li><b>kNN</b> (supervisionado mas sem treino): classifica pela maioria dos k vizinhos mais próximos. Hoje vive na <b>pesquisa vetorial</b> de embeddings (RAG).</li></ul>`),
  Q('No k-means, depois de atribuir pontos aos centros, o passo seguinte é:', ['Mover cada centro para a média dos seus pontos', 'Apagar os centros', 'Treinar uma rede', 'Calcular o gradiente'], 0, ''),
  Q('PCA com 2 componentes num dataset de 100 dimensões serve para:', ['Projetar em 2D mantendo o máximo de variância', 'Classificar', 'Aumentar as dimensões', 'Remover rótulos'], 0, ''),
], [
  TF('O k-means encontra sempre o ótimo global.', false, 'Depende da inicialização (por isso existe k-means++ e várias reinicializações).'),
  Q('Distância mais usada para comparar embeddings de texto:', ['Semelhança do cosseno', 'Distância de Hamming', 'Manhattan sempre', 'Nenhuma'], 0, ''),
]);

/* ======================= U3 ======================= */
L('mlp', V3, 'O neurónio e as redes multicamada (MLP)', [A_.MIT6S191, A_.KARP], [
  T('Do perceptrão à rede', `<p>Um neurónio calcula <b>a = φ(wᵀx + b)</b>, onde φ é uma <b>função de ativação</b> não linear. Empilhando camadas tens um <b>MLP</b>. Sem não linearidade, 10 camadas lineares equivalem a uma só.</p><p><b>Teorema da aproximação universal</b>: um MLP com uma camada escondida suficientemente larga aproxima qualquer função contínua. Na prática, redes <b>profundas</b> aprendem com muito menos parâmetros.</p>`),
  W('logic', { h: 'Revisão: XOR', b: '<p>Um único perceptrão (linear) não consegue separar o XOR. Com uma camada escondida já consegue. Liga A e B e repara que a coluna XOR não é uma reta no plano A–B.</p>' }),
  N('Camada densa 784 → 128, com bias. Quantos parâmetros?', 100480, 0, '', '784·128 + 128 = 100 480.'),
], [
  Q('Porque é que as redes precisam de ativações não lineares?', ['Sem elas, várias camadas colapsam numa única transformação linear', 'Para usar menos memória', 'Para serem mais rápidas', 'Não precisam'], 0, ''),
  TF('O perceptrão de uma camada consegue aprender o XOR.', false, 'O XOR não é linearmente separável (Minsky & Papert, 1969).'),
]);
L('act', V3, 'Funções de ativação: ReLU, GELU, sigmoide, tanh', [A_.D2L], [
  T('Escolher a não linearidade', `<table><tr><th>Ativação</th><th>Fórmula</th><th>Notas</th></tr><tr><td>Sigmoide</td><td>1/(1+e⁻ˣ)</td><td>Saídas (0,1); satura → vanishing gradient</td></tr><tr><td>tanh</td><td>(eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)</td><td>Centrada em 0; também satura</td></tr><tr><td><b>ReLU</b></td><td>max(0, x)</td><td>Barata, padrão em CNNs; "neurónios mortos"</td></tr><tr><td>Leaky ReLU</td><td>max(0,01x, x)</td><td>Evita neurónios mortos</td></tr><tr><td><b>GELU / SiLU</b></td><td>x·Φ(x) / x·σ(x)</td><td>Padrão em transformers</td></tr></table><div class="key">Em hardware, ReLU é só um comparador com zero. GELU precisa de aproximações (tabelas ou polinómios), um tema real de design de aceleradores.</div>`),
  N('ReLU(−3,2)?', 0, 0, '', ''),
  Q('Que ativação usam a maioria dos LLMs modernos nas camadas feed-forward?', ['GELU ou SwiGLU', 'Sigmoide', 'Degrau', 'Linear'], 0, ''),
], [
  Q('Problema típico da ReLU:', ['Neurónios mortos (sempre 0, gradiente 0)', 'Vanishing gradient para x > 0', 'É cara de calcular', 'Saídas negativas'], 0, ''),
  TF('A saída de tanh está entre −1 e 1.', true, ''),
]);
L('backprop', V3, 'Backpropagation e autograd', [A_.KARP, A_.CS231N], [
  T('A regra da cadeia em escala', `<p>O <b>forward</b> calcula a loss. O <b>backward</b> percorre o grafo ao contrário, multiplicando derivadas locais: ∂L/∂x = ∂L/∂y · ∂y/∂x. Cada nó só precisa da sua derivada local.</p><p>O PyTorch faz isto automaticamente (<b>autograd</b>): <code>loss.backward()</code> preenche <code>.grad</code> em todos os parâmetros.</p>`),
  T('Exemplo numérico', `<p>L = (w·x − y)², com w=2, x=3, y=5. Forward: ŷ = 6, erro = 1, L = 1.</p><p>Backward: ∂L/∂ŷ = 2(ŷ−y) = 2; ∂ŷ/∂w = x = 3 → <b>∂L/∂w = 6</b>.</p>` + CODE(`
import torch
w = torch.tensor(2.0, requires_grad=True)
L = (w * 3 - 5) ** 2
L.backward()
print(w.grad)   # tensor(6.)`)),
  N('L = (w·x − y)², w=1, x=4, y=2. Quanto vale ∂L/∂w?', 16, 0, '', '2(4−2)·4 = 16.'),
  Q('Porque é que o treino gasta muito mais memória que a inferência?', ['É preciso guardar as ativações do forward para o backward (e gradientes e estado do otimizador)', 'Os pesos duplicam', 'O backward usa outra GPU', 'Não gasta'], 0, 'Daí o "activation checkpointing": recalcular em vez de guardar.'),
], [
  TF('O backward custa aproximadamente o dobro dos FLOPs do forward.', true, 'Gradientes em relação às ativações e aos pesos. Daí a regra treino ≈ 6·N·D FLOPs.'),
  Q('Em PyTorch, porque se chama <code>optimizer.zero_grad()</code> em cada passo?', ['Os gradientes acumulam-se por omissão', 'Para apagar os pesos', 'Para mudar a learning rate', 'Por estilo'], 0, ''),
]);
L('loss', V3, 'Funções de loss', [A_.D2L, A_.DLBOOK], [
  T('O que estamos a minimizar?', `<ul><li><b>MSE</b>: regressão.</li><li><b>Cross-entropy</b> (com softmax): classificação. CE = −log p<sub>classe certa</sub>.</li><li><b>Binary CE</b>: binário ou multi-rótulo.</li><li><b>Contrastive / InfoNCE</b>: aproxima pares semelhantes (CLIP, embeddings).</li><li><b>Next-token CE</b>: LLMs. A <b>perplexidade</b> = e<sup>CE média</sup>.</li></ul>`),
  N('Classificador com 4 classes, prevê p=0,25 para a classe certa. Cross-entropy (ln, 3 casas)?', 1.386, 0.002, '', '−ln 0,25 = ln 4 ≈ 1,386. É a loss de um modelo que adivinha ao acaso.'),
  N('Loss média de next-token de 2,0 nats. Perplexidade (2 casas)?', 7.39, 0.02, '', 'e² ≈ 7,39: o modelo hesita, em média, como entre ~7 palavras.'),
], [
  TF('Com cross-entropy, prever 0,01 para a classe certa é muito mais penalizado do que prever 0,4.', true, '−ln 0,01 ≈ 4,6 vs −ln 0,4 ≈ 0,9.'),
  Q('Loss adequada para prever a temperatura de um chip:', ['MSE ou MAE', 'Cross-entropy', 'InfoNCE', 'Hinge'], 0, ''),
]);
L('optim', V3, 'Otimizadores: SGD, momentum, Adam, learning-rate schedules', [A_.D2L, A_.CS231N], [
  T('Melhor que descer a direito', `<ul><li><b>Momentum</b>: acumula velocidade v ← βv + ∇L, atravessa vales estreitos.</li><li><b>Adam</b>: momentum + escala por parâmetro pela média dos gradientes ao quadrado. Padrão em transformers (<b>AdamW</b>).</li><li><b>Schedules</b>: warmup linear e depois decaimento cosseno.</li><li><b>Gradient clipping</b>: limita a norma do gradiente, evita explosões.</li></ul><div class="key">Memória do Adam: guarda 2 valores extra por parâmetro (m e v). Num modelo de 7 mil milhões de parâmetros são dezenas de GB só de estado do otimizador.</div>`),
  Q('Quantos tensores de estado por parâmetro guarda o Adam (além dos pesos e gradientes)?', ['2 (m e v)', '0', '1', '4'], 0, ''),
  Q('Porque se usa warmup no início do treino de transformers?', ['Evita passos enormes enquanto as estatísticas do Adam ainda são instáveis', 'Para aquecer a GPU', 'Para reduzir a memória', 'Não tem efeito'], 0, ''),
], [
  TF('O SGD com momentum e o Adam chegam sempre ao mesmo mínimo.', false, ''),
  Q('A loss explode para NaN a meio do treino. Primeira coisa a tentar?', ['Reduzir a learning rate e/ou usar gradient clipping', 'Aumentar a learning rate', 'Remover a validação', 'Mais épocas'], 0, ''),
]);
L('norm', V3, 'Inicialização, BatchNorm e LayerNorm', [A_.D2L, A_.CS231N], [
  T('Manter os sinais em boa escala', `<p>Pesos mal inicializados fazem ativações explodir ou desaparecer camada a camada. <b>Xavier/Glorot</b> (tanh) e <b>He/Kaiming</b> (ReLU, variância 2/n<sub>in</sub>) mantêm a variância estável.</p><ul><li><b>BatchNorm</b>: normaliza cada canal com média/variância do batch. Ótima em CNNs; depende do tamanho do batch.</li><li><b>LayerNorm / RMSNorm</b>: normaliza cada exemplo ao longo das features. Padrão em transformers.</li><li><b>Ligações residuais</b> (ResNet): y = x + F(x), o gradiente tem um "atalho" e treinam-se redes com centenas de camadas.</li></ul>`),
  Q('Porque é que os transformers usam LayerNorm e não BatchNorm?', ['Não depende do batch e funciona com sequências de comprimento variável', 'É mais lenta', 'BatchNorm não existe em PyTorch', 'Por acaso histórico apenas'], 0, ''),
  Q('Que invenção permitiu treinar redes com 100+ camadas?', ['Ligações residuais (ResNet)', 'Sigmoide', 'Learning rate maior', 'Dropout'], 0, ''),
], [
  TF('Inicializar todos os pesos com zero é uma boa ideia.', false, 'Todos os neurónios ficam simétricos e aprendem o mesmo.'),
  Q('A inicialização He é pensada para:', ['ReLU', 'Sigmoide', 'Softmax', 'Árvores'], 0, ''),
]);
L('cnn', V3, 'Redes convolucionais (CNNs)', [A_.CS231N, A_.D2L], [
  T('Filtros que deslizam sobre a imagem', `<p>Uma <b>convolução</b> aplica o mesmo filtro pequeno (ex.: 3×3) em todas as posições: <b>partilha de pesos</b> e <b>localidade</b>. Pooling reduz a resolução. Arquiteturas: LeNet, AlexNet (2012, em GPUs NVIDIA), VGG, ResNet, EfficientNet.</p><p>Tamanho de saída: <b>O = (I − K + 2P)/S + 1</b>. Parâmetros: K·K·C<sub>in</sub>·C<sub>out</sub> (+ C<sub>out</sub> bias).</p>`),
  N('Entrada 32×32, filtro 5×5, padding 0, stride 1. Largura da saída?', 28, 0, '', '(32 − 5)/1 + 1 = 28.'),
  N('Conv 3×3, 64 canais de entrada, 128 de saída, sem bias. Parâmetros?', 73728, 0, '', '3·3·64·128.'),
], [
  Q('Porque é que uma CNN tem muito menos parâmetros que um MLP numa imagem?', ['Partilha os pesos do filtro em todas as posições', 'Usa menos pixels', 'Não tem pesos', 'Usa só sigmoide'], 0, ''),
  TF('Em hardware, uma convolução pode ser transformada num GEMM (im2col).', true, 'É assim que cuDNN e muitos aceleradores a executam.'),
]);
L('rnn', V3, 'Sequências: RNN, LSTM e porque perderam para a atenção', [A_.CS224N, A_.D2L], [
  T('Memória ao longo do tempo', `<p>Uma <b>RNN</b> processa um elemento de cada vez: hₜ = tanh(W·hₜ₋₁ + U·xₜ). Problemas: gradientes que desaparecem em sequências longas e processamento <b>sequencial</b>, difícil de paralelizar numa GPU.</p><p>A <b>LSTM</b> (e a GRU) acrescenta portas (forget, input, output) e uma célula de memória que conserva informação por mais tempo. Dominou a tradução até 2017.</p><div class="key">O transformer ganhou porque processa todos os tokens <b>em paralelo</b>, ideal para GPUs. Modelos de espaço de estados (Mamba) trazem de volta ideias recorrentes com treino paralelo.</div>`),
  Q('Principal limitação das RNNs em GPUs:', ['O cálculo é sequencial no tempo, com pouco paralelismo', 'Usam demasiados filtros', 'Não têm parâmetros', 'Só funcionam com imagens'], 0, ''),
  Q('Na LSTM, a "forget gate" decide:', ['Que parte da memória da célula apagar', 'A learning rate', 'O tamanho do batch', 'A próxima palavra'], 0, ''),
], [
  TF('As LSTMs resolvem totalmente o problema de dependências muito longas.', false, 'Melhoram muito, mas a atenção liga quaisquer duas posições diretamente.'),
]);

/* ======================= U4 ======================= */
L('embed', V4, 'Tokenização e embeddings', [A_.CS224N, A_.KARP], [
  T('Do texto aos vetores', `<p>Um <b>tokenizer</b> (BPE, SentencePiece) parte o texto em sub-palavras: "transistores" → "trans", "istor", "es". Cada token tem um ID e cada ID corresponde a um vetor de <b>embedding</b> aprendido (ex.: 4096 dimensões).</p><p>Palavras com significado parecido ficam com vetores próximos. Exemplo clássico: rei − homem + mulher ≈ rainha.</p><p>Os transformers não sabem a ordem dos tokens por si: acrescenta-se <b>informação posicional</b> (sinusoidal, aprendida, ou RoPE nos LLMs atuais).</p>`),
  N('Vocabulário de 50 000 tokens, embeddings de 768 dimensões. Parâmetros da tabela de embeddings?', 38400000, 0, '', '50 000 × 768 = 38,4 M.'),
  Q('Porque se usam sub-palavras (BPE) em vez de palavras inteiras?', ['Vocabulário finito e consegue representar palavras novas ou raras', 'São mais bonitas', 'Gastam mais memória', 'Para evitar a GPU'], 0, ''),
], [
  TF('Em inglês, 1 token corresponde em média a cerca de 3/4 de uma palavra.', true, 'Regra prática; em português costuma haver mais tokens por palavra.'),
  Q('RoPE é:', ['Uma forma de codificar posições rodando os vetores query/key', 'Um otimizador', 'Uma função de loss', 'Um tipo de GPU'], 0, ''),
]);
L('attn', V4, 'Atenção: query, key, value', [A_.ATT, A_.CS224N, A_.KARP], [
  T('Cada token pergunta aos outros', `<p>Cada token produz uma <b>query</b> (o que procuro), uma <b>key</b> (o que ofereço) e um <b>value</b> (o que passo). Atenção:</p><p style="text-align:center"><b>Attention(Q,K,V) = softmax(QKᵀ / √d) · V</b></p><ul><li>QKᵀ: semelhança entre cada par de tokens → matriz n×n.</li><li>√d evita que o softmax sature.</li><li><b>Máscara causal</b>: num LLM, cada token só vê os anteriores.</li><li><b>Multi-head</b>: várias atenções em paralelo, cada uma com o seu "foco".</li></ul><div class="key">Custo O(n²·d) em computação e memória para n tokens. Por isso existem o FlashAttention (tiling na SRAM da GPU) e técnicas para contextos longos.</div>`),
  T('Em código', CODE(`
import torch, math
def attention(q, k, v, causal=True):        # q,k,v: (batch, n, d)
    s = q @ k.transpose(-2, -1) / math.sqrt(q.size(-1))
    if causal:
        n = s.size(-1)
        s = s.masked_fill(torch.triu(torch.ones(n, n, dtype=torch.bool), 1), float('-inf'))
    return torch.softmax(s, dim=-1) @ v`)),
  N('Sequência de 4096 tokens. Quantos elementos tem a matriz de scores QKᵀ de UMA cabeça?', 16777216, 0, '', '4096² ≈ 16,8 M. Com 32 cabeças e FP16, ~1 GB por camada se fosse guardada inteira, daí o FlashAttention.'),
  Q('Porque se divide por √d?', ['Para os produtos internos não ficarem enormes e saturarem o softmax', 'Para normalizar os values', 'Por convenção estética', 'Para reduzir parâmetros'], 0, ''),
], [
  Q('A máscara causal serve para:', ['Impedir que um token veja tokens futuros durante o treino de um LLM', 'Esconder tokens de padding apenas', 'Acelerar a softmax', 'Remover cabeças'], 0, ''),
  TF('O custo da self-attention cresce linearmente com o comprimento da sequência.', false, 'Cresce quadraticamente (n²).'),
]);
L('transformer', V4, 'A arquitetura transformer', [A_.ATT, A_.KARP, A_.D2L], [
  T('O bloco que se repete', `<p>Um bloco (estilo GPT, pre-norm):</p>` + CODE(`
x = x + MultiHeadAttention(LayerNorm(x))     # mistura entre tokens
x = x + MLP(LayerNorm(x))                    # processa cada token (4×d, GELU)`) + `<p>Um LLM = embeddings → N blocos (ex.: 32–120) → LayerNorm → projeção para o vocabulário → softmax.</p><ul><li><b>Encoder-only</b> (BERT): compreensão, classificação.</li><li><b>Decoder-only</b> (GPT, Llama, Claude): geração autoregressiva.</li><li><b>Encoder-decoder</b> (T5, tradução).</li></ul>`),
  T('Contar parâmetros', `<p>Por bloco, com dimensão d: atenção ≈ 4d² (Q, K, V, saída), MLP ≈ 8d² (d→4d→d). Total ≈ <b>12·d²</b> por camada.</p><p>GPT-3: d = 12 288, 96 camadas → 12·12 288²·96 ≈ 174 mil milhões, perto dos 175 B anunciados.</p>`),
  N('Transformer com d = 4096 e 32 camadas. Parâmetros aproximados (12·d²·L), em milhares de milhões (1 casa decimal)?', 6.4, 0.1, 'B', '12·4096²·32 ≈ 6,44 B. É a escala de um modelo de "7B".'),
  Q('Qual destas partes mistura informação ENTRE tokens?', ['A atenção', 'O MLP', 'O LayerNorm', 'A projeção final'], 0, 'O MLP atua em cada token separadamente.'),
], [
  Q('Os LLMs de chat atuais são maioritariamente:', ['Decoder-only', 'Encoder-only', 'CNNs', 'RNNs'], 0, ''),
  TF('Numa ligação residual, a saída da subcamada é somada à sua entrada.', true, ''),
]);
L('llmtrain', V4, 'Treinar LLMs: pré-treino, scaling laws, fine-tuning, LoRA', [A_.SCALE, A_.KARP], [
  T('As três fases', `<ol><li><b>Pré-treino</b>: prever o próximo token em biliões de tokens. Custa milhões de GPU-horas.</li><li><b>Fine-tuning supervisionado (SFT)</b>: exemplos de instruções e respostas.</li><li><b>Alinhamento por preferências</b> (RLHF, DPO, IA constitucional): o modelo aprende quais respostas as pessoas preferem.</li></ol><p><b>Custo de treino ≈ 6·N·D FLOPs</b> (N parâmetros, D tokens). <b>Chinchilla</b>: ótimo de computação com D ≈ 20·N.</p><p><b>LoRA</b>: em vez de atualizar W (d×d), treina-se ΔW = B·A com rank r pequeno (ex.: 16). Pouquíssimos parâmetros treináveis.</p>`),
  N('Modelo de 1 B parâmetros treinado com 20 B tokens. FLOPs de treino (6ND), em unidades de 10²⁰?', 1.2, 0.01, '×10²⁰', '6·10⁹·2·10¹⁰ = 1,2·10²⁰ FLOPs.'),
  N('LoRA de rank 8 numa matriz 4096×4096. Parâmetros treináveis (A: 8×4096, B: 4096×8)?', 65536, 0, '', '2·8·4096 = 65 536, contra 16,8 M da matriz completa (0,4%).'),
], [
  Q('Segundo a análise Chinchilla, para um orçamento fixo de computação:', ['Escalar parâmetros e tokens em proporção (≈20 tokens por parâmetro)', 'Só aumentar parâmetros', 'Só aumentar tokens', 'Treinar menos'], 0, ''),
  TF('O fine-tuning com LoRA altera todos os pesos do modelo base durante o treino.', false, 'Os pesos base ficam congelados; só A e B são treinados.'),
]);
L('genai', V4, 'Usar LLMs: prompting, RAG, agentes, avaliação', [A_.CS224N], [
  T('Do modelo ao produto', `<ul><li><b>Prompting</b>: instruções claras, exemplos (few-shot), pedir raciocínio passo a passo.</li><li><b>Temperatura e top-p</b>: controlam a aleatoriedade da amostragem. Temperatura 0 ≈ escolher sempre o token mais provável.</li><li><b>RAG</b> (retrieval-augmented generation): procura documentos relevantes (embeddings + pesquisa vetorial) e mete-os no contexto. Reduz alucinações e usa dados privados.</li><li><b>Agentes e ferramentas</b>: o modelo chama funções (pesquisa, código, APIs) em ciclo.</li><li><b>Avaliação</b>: conjuntos de teste próprios, métricas automáticas, LLM-como-juiz, revisão humana.</li></ul>`),
  Q('Queres que um chatbot responda com base na documentação interna (que muda todas as semanas). Melhor abordagem inicial?', ['RAG: indexar os documentos e recuperar os relevantes', 'Pré-treinar um LLM do zero', 'Fine-tuning semanal do modelo inteiro', 'Aumentar a temperatura'], 0, ''),
  Q('Temperatura alta na amostragem leva a:', ['Respostas mais variadas e menos previsíveis', 'Respostas sempre iguais', 'Mais rapidez', 'Menos tokens'], 0, ''),
], [
  TF('Uma "alucinação" é o modelo produzir informação plausível mas falsa.', true, ''),
  Q('Na RAG, o que se guarda numa base de dados vetorial?', ['Embeddings dos pedaços de documentos', 'Os pesos do LLM', 'Os gradientes', 'Imagens apenas'], 0, ''),
]);
L('diffusion', V4, 'Modelos generativos: VAEs, GANs e difusão', [A_.MIT6S191, A_.D2L], [
  T('Gerar imagens, áudio e vídeo', `<ul><li><b>VAE</b>: codifica para um espaço latente com distribuição conhecida e descodifica. Amostras algo desfocadas.</li><li><b>GAN</b>: gerador contra discriminador. Imagens nítidas, treino instável (StyleGAN, da NVIDIA).</li><li><b>Difusão</b>: aprende a <b>remover ruído</b> passo a passo. Gera a partir de ruído puro em dezenas de passos. Base de Stable Diffusion, DALL·E, Sora. A difusão "latente" trabalha no espaço de um VAE, para ser mais barata.</li></ul>`),
  Q('Num modelo de difusão, a rede é treinada para:', ['Prever o ruído adicionado a uma imagem', 'Classificar imagens', 'Distinguir real de falso', 'Comprimir texto'], 0, ''),
  Q('Porque é que a geração por difusão é cara na inferência?', ['Precisa de muitos passos de remoção de ruído (várias passagens pela rede)', 'Usa só CPU', 'Tem poucos parâmetros', 'Não é cara'], 0, 'Daí técnicas de destilação para gerar em poucos passos.'),
], [
  TF('Numa GAN, o discriminador tenta distinguir amostras reais de geradas.', true, ''),
]);
L('rl', V4, 'Aprendizagem por reforço (e RLHF)', [A_.SB], [
  T('Aprender por tentativa e recompensa', `<p>Um agente observa o estado s, escolhe a ação a com a sua <b>política</b> π(a|s), recebe a recompensa r e passa para s'. Objetivo: maximizar a soma descontada das recompensas Σ γᵗ rₜ.</p><ul><li><b>Q-learning / DQN</b>: aprende o valor Q(s,a) de cada ação (Atari, 2015).</li><li><b>Policy gradient / PPO</b>: ajusta diretamente a política. O PPO é usado no RLHF.</li><li><b>AlphaGo/AlphaZero</b>: RL com pesquisa em árvore.</li></ul><p>No <b>RLHF</b>, um "modelo de recompensa" treinado com preferências humanas dá a recompensa, e o LLM é a política.</p>`),
  N('Recompensas 1, 1, 1 nos três primeiros passos, γ = 0,9. Retorno descontado (2 casas)?', 2.71, 0.01, '', '1 + 0,9 + 0,81 = 2,71.'),
  Q('O dilema exploração vs exploração (exploration/exploitation) é:', ['Escolher entre experimentar ações novas e usar a melhor conhecida', 'Escolher a GPU', 'Dividir treino e teste', 'Escolher a loss'], 0, ''),
], [
  TF('Em RL, os dados de treino são fixos e conhecidos à partida.', false, 'Dependem das ações do agente.'),
]);

/* ======================= U5 ======================= */
L('flops', V5, 'FLOPs, intensidade aritmética e o modelo roofline', [A_.NVDL, A_.EYERISS], [
  T('Limitado pela computação ou pela memória?', `<p><b>Intensidade aritmética</b> I = FLOPs / bytes movidos da memória. O <b>roofline</b> diz: desempenho = min(pico de FLOPs, I × largura de banda).</p><ul><li>GEMM grande: I alta → <b>compute-bound</b> (Tensor Cores ocupados).</li><li>Operações elemento a elemento (ReLU, LayerNorm, soma): I baixa → <b>memory-bound</b>.</li><li>Gerar texto num LLM com batch 1: cada peso é lido para 2 FLOPs → fortemente memory-bound.</li></ul><p><b>Ponto de equilíbrio</b> da GPU = pico FLOP/s ÷ largura de banda. Ex.: 1000 TFLOP/s ÷ 3,35 TB/s ≈ 300 FLOPs/byte.</p>`),
  N('Somar dois vetores FP32 de N elementos (c = a + b): lê 2 e escreve 1 valor de 4 bytes por elemento, 1 FLOP. Intensidade aritmética (FLOPs/byte, 3 casas)?', 0.083, 0.002, '', '1 / 12 ≈ 0,083. Totalmente memory-bound.'),
  Q('Kernel com I = 10 FLOPs/byte numa GPU com ponto de equilíbrio 300. Está limitado por:', ['Largura de banda de memória', 'Computação', 'Nada', 'Latência de rede'], 0, ''),
], [
  TF('"Kernel fusion" (juntar várias operações num só kernel) aumenta a intensidade aritmética.', true, 'Evita escrever e ler resultados intermédios da memória global.'),
  Q('Porque é que a fase de geração (decode) de um LLM com batch 1 é lenta?', ['É memory-bound: lê todos os pesos para gerar cada token', 'É compute-bound', 'A softmax é cara', 'O tokenizer é lento'], 0, 'Aumentar o batch reutiliza cada peso lido para mais tokens.'),
]);
L('gpuai', V5, 'GPUs para deep learning: Tensor Cores e precisão mista', [A_.NVDL, A_.MITHAN], [
  T('Porque é que a IA corre em GPUs', `<p>Milhares de núcleos executam a mesma instrução sobre dados diferentes (SIMT). Os <b>Tensor Cores</b> (desde Volta, 2017) fazem um pequeno produto de matrizes com acumulação (D = A·B + C) por instrução, em FP16, BF16, TF32, FP8 e, nas gerações recentes, FP4.</p><p><b>Precisão mista</b>: pesos e ativações em FP16/BF16, acumulação em FP32, uma cópia "mestra" dos pesos em FP32 e <b>loss scaling</b> (no FP16) para os gradientes pequenos não virarem zero.</p><table><tr><th>Formato</th><th>Bits (sinal/expoente/mantissa)</th><th>Nota</th></tr><tr><td>FP32</td><td>1/8/23</td><td>Referência</td></tr><tr><td>FP16</td><td>1/5/10</td><td>Gama pequena</td></tr><tr><td>BF16</td><td>1/8/7</td><td>Mesma gama do FP32</td></tr><tr><td>FP8 E4M3 / E5M2</td><td>1/4/3, 1/5/2</td><td>Hopper/Blackwell</td></tr></table>`),
  Q('Vantagem do BF16 sobre o FP16 no treino:', ['Tem a mesma gama dinâmica do FP32, raramente precisa de loss scaling', 'Tem mais precisão na mantissa', 'Usa menos bits', 'Não precisa de hardware'], 0, ''),
  N('Quantos bytes ocupam os pesos de um modelo de 7 B parâmetros em BF16 (em GB, com 1 GB = 10⁹ B)?', 14, 0.1, 'GB', '7·10⁹ × 2 bytes.'),
], [
  TF('Os Tensor Cores executam operações de matriz completas numa só instrução (por warp).', true, 'Instruções MMA/WGMMA.'),
  Q('Na precisão mista, a acumulação dos produtos faz-se normalmente em:', ['FP32', 'INT4', 'FP8', 'Binário'], 0, ''),
]);
L('quant', V5, 'Quantização, pruning e destilação', [A_.MITHAN, A_.EYERISS], [
  T('Modelos mais pequenos e rápidos', `<ul><li><b>Quantização</b>: representar pesos e/ou ativações com menos bits (INT8, INT4, FP8). Linear: q = round(x/s) + z, onde s é a escala.<ul><li>PTQ (pós-treino) vs QAT (treino consciente da quantização).</li><li>Métodos para LLMs: GPTQ, AWQ, SmoothQuant.</li></ul></li><li><b>Pruning</b>: remover pesos. Esparsidade estruturada 2:4 (2 zeros em cada 4) é acelerada pelos Tensor Cores das GPUs NVIDIA desde a Ampere.</li><li><b>Destilação</b>: um modelo pequeno ("aluno") aprende a imitar as probabilidades de um grande ("professor").</li></ul><div class="key">Para um designer de hardware, cada bit a menos poupa área, energia e largura de banda. Um MAC INT8 gasta uma fração da energia de um MAC FP32.</div>`),
  N('Pesos entre −2 e 2 quantizados simetricamente para INT8 (−127..127). Escala s = max|x|/127 (3 casas decimais)?', 0.016, 0.001, '', '2/127 ≈ 0,0157.'),
  N('Modelo de 70 B parâmetros em INT4. Memória dos pesos em GB (10⁹ B)?', 35, 0.5, 'GB', '70·10⁹ × 0,5 byte.'),
], [
  Q('A esparsidade 2:4 significa:', ['Em cada grupo de 4 pesos, 2 são zero', '2 camadas em cada 4 removidas', '24% de zeros', 'Batch de 2 por 4 GPUs'], 0, ''),
  TF('A destilação treina o modelo pequeno só com os rótulos "duros" do dataset.', false, 'Usa as probabilidades "suaves" do professor, que têm mais informação.'),
]);
L('dist', V5, 'Treino distribuído: paralelismo de dados, tensor e pipeline', [A_.NVDL], [
  T('Treinar em milhares de GPUs', `<ul><li><b>Data parallel</b>: cada GPU tem o modelo inteiro e um pedaço do batch. Os gradientes somam-se com <b>all-reduce</b> (NCCL).</li><li><b>ZeRO / FSDP</b>: divide também os pesos, gradientes e estado do otimizador entre GPUs.</li><li><b>Tensor parallel</b>: divide cada matriz entre GPUs (precisa de NVLink, muita comunicação).</li><li><b>Pipeline parallel</b>: camadas diferentes em GPUs diferentes, com micro-batches para reduzir as "bolhas".</li></ul><p>Por isso a NVIDIA desenha NVLink, NVSwitch e InfiniBand: a rede entre GPUs é tão importante como a própria GPU.</p>`),
  N('All-reduce em anel com p GPUs envia por GPU ≈ 2·(p−1)/p × tamanho dos dados. Com 8 GPUs e 1 GB de gradientes, quantos GB envia cada GPU?', 1.75, 0.01, 'GB', '2·7/8 = 1,75 GB.'),
  Q('Que paralelismo exige comunicação mais frequente e por isso fica normalmente dentro de um nó com NVLink?', ['Tensor parallel', 'Data parallel', 'Pipeline parallel', 'Nenhum'], 0, ''),
], [
  TF('No data parallel puro, cada GPU guarda uma cópia completa dos pesos.', true, ''),
  Q('A biblioteca da NVIDIA para comunicação coletiva entre GPUs é:', ['NCCL', 'cuDNN', 'TensorRT', 'Triton'], 0, ''),
]);
L('infer', V5, 'Inferência de LLMs: KV cache, batching e latência', [A_.NVDL, A_.MITHAN], [
  T('Servir milhões de pedidos', `<ul><li><b>Prefill</b>: processa o prompt inteiro em paralelo (compute-bound).</li><li><b>Decode</b>: gera um token de cada vez (memory-bound).</li><li><b>KV cache</b>: guarda as keys e values dos tokens anteriores para não os recalcular. Tamanho = 2 × camadas × tokens × d × bytes (por sequência).</li><li><b>Continuous batching</b> e <b>PagedAttention</b> (vLLM): juntam pedidos e gerem a memória do cache por páginas.</li><li><b>Speculative decoding</b>: um modelo pequeno propõe vários tokens e o grande verifica-os de uma vez.</li><li>Métricas: time-to-first-token (TTFT), tokens/s, custo por milhão de tokens.</li></ul>`),
  N('KV cache em FP16 de um modelo com 32 camadas e d = 4096, para 1000 tokens de uma sequência. Tamanho em MB (10⁶ B, arredonda)?', 524, 1, 'MB', '2·32·1000·4096·2 B ≈ 524 MB. Com GQA/MQA partilham-se keys/values entre cabeças e o cache encolhe.'),
  Q('O que reduz o tamanho do KV cache?', ['Grouped-query attention (GQA)', 'Aumentar o vocabulário', 'Mais camadas', 'Temperatura alta'], 0, ''),
], [
  TF('A fase de prefill é tipicamente mais compute-bound do que o decode.', true, ''),
  Q('Speculative decoding acelera porque:', ['O modelo grande verifica vários tokens propostos numa só passagem', 'Usa menos parâmetros no modelo grande', 'Desliga a atenção', 'Reduz o vocabulário'], 0, ''),
]);
L('accel', V5, 'Aceleradores de IA: systolic arrays, TPU, NVDLA', [A_.EYERISS, A_.MITHAN], [
  T('Hardware feito à medida', `<ul><li><b>Systolic array</b> (TPU da Google): grelha de MACs onde os dados fluem entre vizinhos. Cada valor lido da memória é reutilizado muitas vezes.</li><li><b>Fluxos de dados</b> (Eyeriss): weight-stationary, output-stationary, row-stationary. A escolha decide o que fica nos registos locais e quanto se move.</li><li><b>NVDLA</b>: acelerador open-source da NVIDIA para inferência (bom para estudar RTL real).</li><li>Custo energético aproximado (45 nm, Horowitz): MAC INT8 ≈ 0,2 pJ, leitura SRAM ≈ 5 pJ, leitura DRAM ≈ 640 pJ (32 bits). <b>Mover dados custa muito mais do que calcular.</b></li></ul>`),
  N('Systolic array 128×128 a 1 GHz, 1 MAC por PE por ciclo. TOPS (contando 2 ops por MAC, 1 casa decimal)?', 32.8, 0.1, 'TOPS', '128²·2·10⁹ ≈ 32,8·10¹².'),
  Q('Segundo os números de energia de Horowitz, o que é mais caro?', ['Ler 32 bits da DRAM', 'Uma multiplicação INT8', 'Uma soma de 32 bits', 'Ler um registo'], 0, ''),
], [
  TF('Num array weight-stationary, os pesos ficam fixos nos PEs enquanto as ativações fluem.', true, ''),
  Q('Qual é o acelerador de deep learning open-source da NVIDIA?', ['NVDLA', 'cuDNN', 'Jetson', 'DGX'], 0, 'Jetson e DGX são sistemas; cuDNN é software.'),
]);
L('stack', V5, 'O software: PyTorch, CUDA, cuDNN, TensorRT, Triton', [A_.PYT, A_.NVDL], [
  T('Da linha de Python ao Tensor Core', `<table><tr><th>Camada</th><th>Exemplos</th></tr><tr><td>Frameworks</td><td>PyTorch, JAX, TensorFlow</td></tr><tr><td>Compiladores</td><td>torch.compile (Inductor), XLA, <b>OpenAI Triton</b> (kernels em Python)</td></tr><tr><td>Bibliotecas</td><td><b>cuBLAS</b> (GEMM), <b>cuDNN</b> (conv, atenção), CUTLASS, NCCL</td></tr><tr><td>Inferência</td><td><b>TensorRT</b>, TensorRT-LLM, vLLM, Triton Inference Server</td></tr><tr><td>Linguagem</td><td><b>CUDA C++</b>, PTX</td></tr><tr><td>Hardware</td><td>SMs, Tensor Cores, HBM, NVLink</td></tr></table><p>Ferramentas de profiling: <b>Nsight Systems</b> (linha temporal) e <b>Nsight Compute</b> (cada kernel), e o profiler do PyTorch.</p>`),
  T('Um kernel CUDA mínimo', CODE(`
__global__ void relu(const float* x, float* y, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) y[i] = x[i] > 0.f ? x[i] : 0.f;
}
// relu<<<(n + 255) / 256, 256>>>(d_x, d_y, n);`)),
  Q('Que biblioteca a NVIDIA usa para otimizar e executar redes em produção (inferência)?', ['TensorRT', 'NCCL', 'Nsight', 'cuRAND'], 0, ''),
  Q('Para lançar n = 1000 threads em blocos de 256, quantos blocos são precisos?', ['4', '3', '256', '1000'], 0, 'ceil(1000/256) = 4; o "if (i < n)" protege as threads a mais.'),
], [
  TF('O OpenAI Triton permite escrever kernels de GPU em Python.', true, 'Não confundir com o Triton Inference Server da NVIDIA.'),
  Q('Para ver quanto tempo cada kernel demora e a ocupação da GPU, usas:', ['Nsight Compute / Nsight Systems', 'GTKWave', 'Excel', 'git bisect'], 0, ''),
]);

/* ======================= U6 ======================= */
L('pytorch', V6, 'PyTorch na prática: o ciclo de treino', [A_.PYT, A_.FAST], [
  T('O ciclo que vais escrever mil vezes', CODE(`
import torch, torch.nn as nn
model = nn.Sequential(nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 10)).cuda()
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
for epoch in range(5):
    model.train()
    for x, y in train_loader:
        x, y = x.cuda(), y.cuda()
        with torch.autocast('cuda', dtype=torch.bfloat16):   # precisão mista
            loss = loss_fn(model(x.view(len(x), -1)), y)
        opt.zero_grad()
        loss.backward()
        opt.step()
    model.eval()
    with torch.no_grad():
        ...   # avaliar na validação`)),
  Q('Para que serve <code>model.eval()</code>?', ['Muda o comportamento de dropout e batchnorm para o modo de inferência', 'Desliga a GPU', 'Calcula os gradientes', 'Guarda o modelo'], 0, ''),
  Q('Para que serve <code>torch.no_grad()</code> na avaliação?', ['Não guarda o grafo de gradientes: poupa memória e tempo', 'Zera os pesos', 'Ativa o dropout', 'Muda a loss'], 0, ''),
], [
  Q('Ordem correta num passo de treino:', ['forward → loss → zero_grad → backward → step', 'step → backward → loss', 'backward → forward → step', 'zero_grad → step → backward'], 0, ''),
  TF('<code>.cuda()</code> move o tensor ou o modelo para a GPU.', true, ''),
]);
L('data', V6, 'Dados: pipelines, limpeza e enviesamentos', [A_.FAST, A_.ISLR], [
  T('Os dados valem mais que o modelo', `<ul><li><b>Explora primeiro</b>: distribuições, valores em falta, duplicados, rótulos errados.</li><li><b>Normalização</b>: média 0 e desvio 1 (com estatísticas só do treino).</li><li><b>Desequilíbrio de classes</b>: reamostragem, pesos na loss, métricas certas.</li><li><b>Pipelines</b>: DataLoader com vários workers e prefetch, para a GPU não ficar à espera.</li><li><b>Enviesamento</b>: se os dados sub-representam um grupo, o modelo vai falhar mais nesse grupo.</li></ul>`),
  Q('O teu treino usa a GPU a 30% e a CPU a 100%. Provável causa?', ['O carregamento e pré-processamento de dados é o gargalo', 'O modelo é demasiado grande', 'A learning rate é alta', 'Falta de VRAM'], 0, 'Mais workers no DataLoader, pré-processar offline, DALI.'),
  TF('Normalizar o conjunto de teste com a média calculada no próprio teste é boa prática.', false, 'Usa as estatísticas do treino; o contrário é leakage.'),
], [
  Q('Um modelo de reconhecimento facial treinado sobretudo com rostos de um grupo tende a:', ['Errar mais nos grupos sub-representados', 'Ser igualmente bom para todos', 'Não funcionar de todo', 'Ser mais rápido'], 0, ''),
]);
L('mlops', V6, 'Experiências, reprodutibilidade e MLOps', [A_.FAST], [
  T('Do notebook à produção', `<ul><li><b>Seeds</b> fixas, versões das bibliotecas, configuração em ficheiro.</li><li><b>Tracking</b> de experiências: Weights &amp; Biases, MLflow, TensorBoard (loss, métricas, hiperparâmetros).</li><li><b>Versionar dados e modelos</b> (DVC, Hugging Face Hub).</li><li><b>Avaliação contínua</b>: monitorizar o desempenho em produção (data drift).</li><li><b>Exportar e servir</b>: ONNX, TensorRT, FastAPI, Triton Inference Server.</li></ul>`),
  Q('Data drift é:', ['A distribuição dos dados em produção afastar-se da do treino', 'A GPU aquecer', 'Um erro do tokenizer', 'A learning rate a descer'], 0, ''),
  TF('Sem seeds e versões fixas, pode ser impossível reproduzir um resultado.', true, ''),
], [
  Q('ONNX serve para:', ['Representar modelos num formato portável entre frameworks e runtimes', 'Treinar mais depressa', 'Desenhar chips', 'Rotular dados'], 0, ''),
]);
L('safety', V6, 'Ética, segurança e limites da IA', [A_.CS224N], [
  T('Construir com responsabilidade', `<ul><li><b>Equidade</b>: medir o desempenho por subgrupos.</li><li><b>Privacidade</b>: dados pessoais, RGPD, memorização de dados de treino.</li><li><b>Robustez</b>: exemplos adversariais, prompt injection em agentes.</li><li><b>Interpretabilidade</b>: perceber porque é que o modelo decide (atribuição, sondas, interpretabilidade mecanicista).</li><li><b>Alinhamento</b>: garantir que sistemas capazes fazem o que pretendemos.</li><li><b>Regulação</b>: o AI Act da União Europeia classifica sistemas por nível de risco.</li></ul>`),
  Q('Um "exemplo adversarial" é:', ['Uma entrada com uma perturbação mínima que engana o modelo', 'Um exemplo mal rotulado', 'Um dado de validação', 'Uma GPU avariada'], 0, ''),
  TF('O AI Act da UE trata todos os sistemas de IA da mesma forma.', false, 'Usa uma abordagem baseada no risco (inaceitável, alto, limitado, mínimo).'),
], [
  Q('Prompt injection acontece quando:', ['Texto nos dados (página, email) contém instruções que o modelo segue indevidamente', 'O utilizador escreve depressa', 'O modelo é quantizado', 'O tokenizer falha'], 0, ''),
]);
L('career', V6, 'Carreira: ML engineer vs hardware de IA, e como entrevistar', [A_.KARP, A_.MITHAN], [
  T('Onde a IA e o silício se encontram', `<p>Combinar RTL/VLSI com ML abre perfis muito procurados em empresas como a NVIDIA:</p><ul><li><b>Deep learning architect / performance</b>: modela como as redes correm no hardware e propõe novas funcionalidades (formatos FP8/FP4, Tensor Cores).</li><li><b>RTL de aceleradores</b>: desenha unidades de matriz, atenção, compressão.</li><li><b>Kernel engineer (CUDA, CUTLASS, Triton)</b>.</li><li><b>ML engineer</b>: treina e serve modelos.</li></ul><p><b>Entrevistas de ML</b> costumam ter: fundamentos (bias–variance, métricas, backprop), programação (implementar k-means, atenção, um ciclo de treino em NumPy/PyTorch), desenho de sistemas de ML, e, para hardware de IA, roofline, precisão numérica, memória de modelos e paralelismo.</p>`),
  Q('Qual destes projetos mostra melhor a ligação ML + hardware num portefólio?', ['Implementar e medir uma unidade de MAC INT8 em RTL que corre uma rede quantizada pequena', 'Um site de receitas', 'Copiar um tutorial sem alterações', 'Um jogo em Scratch'], 0, ''),
], [
  TF('Saber estimar memória e FLOPs de um modelo de cabeça é útil em entrevistas de hardware de IA.', true, ''),
]);
