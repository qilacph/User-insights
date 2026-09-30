(() => {
  const $ = (s) => document.querySelector(s);
  const base = $('#base'), src = $('#src'), logo = $('#logo'), out = $('#out'), urlEl = $('#url');
  base.value = new URL('./', location.href).href;
  const presets = ['qr-general', 'qr-poster-cph', 'qr-poster-aarhus', 'qr-poster-odense', 'qr-poster-aalborg', 'qr-campus-ku', 'qr-campus-au', 'qr-sticker', 'link-instagram'];
  presets.forEach((p) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = p;
    b.addEventListener('click', () => { src.value = p; draw(); });
    $('#presets').append(b);
  });
  let svgText = '';
  function link() {
    const tag = (src.value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40);
    const u = new URL(base.value || './', location.href);
    if (tag) u.searchParams.set('src', tag); else u.searchParams.delete('src');
    return u.href;
  }
  function draw() {
    const href = link();
    svgText = window.QilaQR.svg(window.qrcode, href, { size: 1024, logo: logo.checked });
    out.innerHTML = svgText;
    urlEl.textContent = href;
  }
  const name = () => `qila-qr-${(src.value || 'survey').replace(/[^a-z0-9_-]/gi, '-')}`;
  function save(blob, file) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = file; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  $('#svg').addEventListener('click', () => save(new Blob([svgText], { type: 'image/svg+xml' }), `${name()}.svg`));
  $('#png').addEventListener('click', () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 2048;
      c.getContext('2d').drawImage(img, 0, 0, 2048, 2048);
      c.toBlob((b) => save(b, `${name()}.png`), 'image/png');
    };
    img.src = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
  });
  [base, src].forEach((i) => i.addEventListener('input', draw));
  logo.addEventListener('change', draw);
  draw();
})();
