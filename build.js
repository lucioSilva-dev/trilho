// Junta tudo num único ficheiro HTML.  Uso: node build.js [URL_PUBLICADO] [PASTA_ARTIFACT]
const fs = require('fs'), path = require('path');
const R = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const url = process.argv[2] || '';
const course = (files) => `(function(){\n${files.map(R).join('\n;\n')}\n;COURSE_LIST.push(COURSE);\n})();`;
const js = [
  `const TRILHO_URL = ${JSON.stringify(url)};`,
  R('shared/engine.js'), R('shared/app.js'),
  'const COURSE_LIST = [];',
  course(['vlsi/lessons.js', 'vlsi/lessons2.js', 'vlsi/extras.js', 'vlsi/tools.js']),
  course(['ia/lessons.js', 'ia/extras.js']),
  course(['conducao/lessons.js', 'conducao/extras.js']),
  'Engine.boot(COURSE_LIST);',
].join('\n');
const body = `<title>Trilho</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
${R('shared/style.css')}
</style>
<div id="app"></div>
<script>
${safe(js)}
</script>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), `<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head>
<body>
${body}</body></html>
`);
if (process.argv[3]) fs.writeFileSync(path.join(process.argv[3], 'trilho.html'), body);
console.log('ok', (body.length / 1024).toFixed(0) + ' KB');
