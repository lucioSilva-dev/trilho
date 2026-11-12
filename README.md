# Trilho

Três cursos de 100 dias, ao estilo de lições interativas:

- **Silício 100**: RTL e VLSI (SystemVerilog, microarquitetura, CDC, STA, GPUs, ferramentas EDA)
- **Neurónio 100**: IA e machine learning (matemática, ML clássico, deep learning, transformers, hardware de IA)
- **Volante 100**: Código da Estrada e carta B em Portugal

Site estático: `index.html` é gerado a partir de `shared/`, `vlsi/`, `ia/` e `conducao/`.

```
node build.js https://luciosilva-dev.github.io/trilho/
```

O progresso fica no `localStorage` do browser. Usa "Exportar progresso" para fazer cópia.

Deploy alternativo com Firebase Hosting: `npx firebase-tools login`, depois `npx firebase-tools deploy --only hosting --project <id>`.
