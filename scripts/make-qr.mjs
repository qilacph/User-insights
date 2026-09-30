// Generates branded QR codes (SVG) and print-safe plain PNGs for every source tag in qr-sources.json.
// Usage: node scripts/make-qr.mjs https://<owner>.github.io/<repo>/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';
const require = createRequire(import.meta.url);
const qrcode = require('qrcode-generator');
const QilaQR = require('../site/assets/qr-art.js');

const base = process.argv[2] || process.env.SURVEY_URL;
if (!base) { console.error('Give the survey URL: node scripts/make-qr.mjs https://owner.github.io/repo/'); process.exit(1); }
const sources = JSON.parse(readFileSync(new URL('../qr-sources.json', import.meta.url)));
const outDir = new URL('../site/qr/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const rows = [];
for (const src of sources) {
  const u = new URL(base); u.searchParams.set('src', src);
  const href = u.href;
  writeFileSync(new URL(`qila-qr-${src}.svg`, outDir), QilaQR.svg(qrcode, href, { size: 1024 }));
  await QRCode.toFile(new URL(`qila-qr-${src}.png`, outDir).pathname, href, { errorCorrectionLevel: 'H', margin: 4, width: 2048, color: { dark: '#1d1c19', light: '#fbf3ea' } });
  rows.push({ src, href });
  console.log('✓', src, href);
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
writeFileSync(new URL('index.html', outDir), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>qila QR codes</title><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/style.css"><link rel="stylesheet" href="../assets/qr.css">
<body class="qr-page"><main class="qr-wrap"><p class="kicker">qila / generated on deploy</p><h1 class="qr-title">QR codes</h1>
<p class="lead">Branded SVG for design work, plain PNG for fast printing. Need a new tag? Use the <a href="../qr.html">QR maker</a>.</p>
${rows.map((r) => `<div class="qr-out"><div class="qr-img"><img src="qila-qr-${esc(r.src)}.svg" alt="QR ${esc(r.src)}" width="360" height="360"></div><p class="mono qr-url">${esc(r.href)}</p><div class="qr-actions"><a class="btn btn-primary" download href="qila-qr-${esc(r.src)}.svg">SVG</a><a class="btn btn-text" download href="qila-qr-${esc(r.src)}.png">PNG</a></div></div>`).join('\n')}
</main></body>`);
console.log(`\n${rows.length} codes → site/qr/`);
