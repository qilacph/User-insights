/* qila urban cycling study — app logic (no dependencies) */
(() => {
  'use strict';

  const CFG = window.QILA_CONFIG;
  const UI = window.QILA_UI;
  const SCREENS = window.QILA_SCREENS;
  const byId = Object.fromEntries(SCREENS.map((s) => [s.id, s]));
  const TOTAL = byId.end.step;
  const $ = (sel) => document.querySelector(sel);
  const main = $('#main');
  const footer = $('#footer');
  const live = $('#live');

  /* ---------- state ---------- */
  const params = new URLSearchParams(location.search);
  const safe = (v, re) => (v && re.test(v) ? v : null);
  const state = {
    lang: pickLang(),
    source: safe(params.get('src'), /^[a-z0-9_-]{1,40}$/i) || 'direct',
    id: uuid(),
    answers: {},     // field -> option id (single) | option ids[] (multi); 'other' marks the Other chip
    other: {},       // field -> free text for Other
    order: {},       // field -> shuffled option order, fixed per respondent
    times: {},       // screen id -> ms spent
    path: ['intro'], // history of visited screen ids
    enteredAt: Date.now(),
    started: null,
    submitted: false,
    lastBeacon: null,
    editing: null,   // field currently typing Other
  };

  function pickLang() {
    const q = params.get('lang');
    if (q === 'da' || q === 'en') return q;
    const langs = navigator.languages || [navigator.language || 'da'];
    return langs.some((l) => /^(da|nb|nn|no|sv)\b/i.test(l)) ? 'da' : 'en';
  }
  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    return [...b].map((x, i) => ([4, 6, 8, 10].includes(i) ? '-' : '') + x.toString(16).padStart(2, '0')).join('');
  }
  const t = (v) => (v == null ? '' : typeof v === 'string' ? t(UI[v]) || v : v[state.lang] ?? v.en ?? '');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const announce = (msg) => { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 30); };

  /* ---------- flow ---------- */
  const current = () => state.path[state.path.length - 1];
  function flow() {
    const branch = state.answers.helmet_use || 'yes';
    return SCREENS.filter((s) => !s.branch || s.branch === branch).map((s) => s.id);
  }
  const showIfOk = (g) => !g.showIf || g.showIf.in.includes(state.answers[g.showIf.field]);
  const visibleGroups = (s) => (s.groups || []).filter(showIfOk);

  function go(id, dir = 'fwd') {
    leaveScreen();
    if (dir === 'back') state.path.pop(); else state.path.push(id);
    render(dir);
  }
  function next() {
    const seq = flow();
    const nextId = seq[seq.indexOf(current()) + 1];
    if (current() === 'intro' && !state.started) state.started = new Date();
    if (nextId) go(nextId);
  }
  function back() { if (state.path.length > 1) go(null, 'back'); }
  function leaveScreen() {
    const id = current();
    state.times[id] = (state.times[id] || 0) + (Date.now() - state.enteredAt);
    state.editing = null;
  }

  /* ---------- answers ---------- */
  function orderFor(g) {
    if (!state.order[g.field]) {
      let ids = g.options.map((o) => o.id);
      if (g.shuffle) {
        const pinned = g.options.filter((o) => o.exclusive).map((o) => o.id);
        const free = ids.filter((id) => !pinned.includes(id));
        for (let i = free.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [free[i], free[j]] = [free[j], free[i]]; }
        ids = [...free, ...pinned];
      }
      state.order[g.field] = ids;
    }
    return state.order[g.field].map((id) => g.options.find((o) => o.id === id));
  }
  const otherText = (f) => (state.other[f] || '').trim();
  function groupDone(g) {
    if (g.optional) return true;
    const v = state.answers[g.field];
    if (g.type === 'single') return !!v && (v !== 'other' || !!otherText(g.field));
    return Array.isArray(v) && v.some((x) => x !== 'other' || !!otherText(g.field));
  }
  const hasAny = (s) => visibleGroups(s).some((g) => {
    const v = state.answers[g.field];
    return Array.isArray(v) ? v.length > 0 : !!v;
  });
  const screenDone = (s) => visibleGroups(s).every(groupDone);
  const autoAdvance = (s) => {
    const gs = visibleGroups(s);
    return s.type === 'chips' && gs.length === 1 && gs[0].type === 'single' && !state.editing && state.answers[gs[0].field] !== 'other';
  };

  function pick(s, g, opt, btn) {
    const f = g.field;
    if (g.type === 'single') {
      state.answers[f] = opt.id;
      if (g.other) state.other[f] = '';
    } else {
      let v = Array.isArray(state.answers[f]) ? [...state.answers[f]] : [];
      if (v.includes(opt.id)) v = v.filter((x) => x !== opt.id);
      else if (opt.exclusive) v = [opt.id];
      else {
        const exclusive = g.options.filter((o) => o.exclusive).map((o) => o.id);
        v = v.filter((x) => !exclusive.includes(x));
        if (g.max && v.length >= g.max) { btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); announce(t('maxReached').replace('{n}', g.max)); return; }
        v.push(opt.id);
      }
      state.answers[f] = v;
    }
    refresh(s);
    if (g.type === 'single' && autoAdvance(s) && screenDone(s)) setTimeout(() => { if (current() === s.id) next(); }, 260);
  }
  function commitOther(s, g) {
    const f = g.field;
    const text = otherText(f);
    if (g.type === 'single') {
      if (text) state.answers[f] = 'other';
      else if (state.answers[f] === 'other') delete state.answers[f];
    } else {
      let v = Array.isArray(state.answers[f]) ? state.answers[f].filter((x) => x !== 'other') : [];
      if (text) {
        const exclusive = g.options.filter((o) => o.exclusive).map((o) => o.id);
        v = v.filter((x) => !exclusive.includes(x));
        if (g.max && v.length >= g.max) { announce(t('maxReached').replace('{n}', g.max)); state.other[f] = ''; }
        else v.push('other');
      }
      state.answers[f] = v;
    }
    state.editing = null;
    refresh(s);
  }

  /* ---------- rendering ---------- */
  function render(dir) {
    const s = byId[current()];
    state.enteredAt = Date.now();
    document.documentElement.lang = state.lang;
    renderHeader(s);
    main.textContent = '';
    const wrap = el('section', 'screen' + (dir === 'fwd' ? ' enter' : dir === 'back' ? ' enter-back' : ''));
    wrap.dataset.screen = s.id;
    if (s.type === 'intro') renderIntro(s, wrap);
    else if (s.type === 'end') renderEnd(s, wrap);
    else renderQuestion(s, wrap);
    main.appendChild(wrap);
    main.scrollTop = 0;
    renderFooter(s);
    const h = wrap.querySelector('h1');
    if (h && dir) h.focus({ preventScroll: true });
    if (s.type === 'end' && !state.submitted) submitSurvey();
  }

  function renderHeader(s) {
    const prog = $('#progress');
    const lang = $('#lang');
    lang.hidden = s.type !== 'intro';
    lang.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    if (!s.step) { prog.hidden = true; return; }
    prog.hidden = false;
    $('#stepLabel').textContent = `${String(s.step).padStart(2, '0')} / ${TOTAL}`;
    $('#sectionLabel').textContent = t(s.section);
    $('#bar').setAttribute('aria-valuenow', s.step);
    requestAnimationFrame(() => { $('#barFill').style.width = `${(s.step / TOTAL) * 100}%`; });
  }

  function heading(text, cls) {
    const h = el('h1', cls, text);
    h.tabIndex = -1;
    h.id = 'q-title';
    return h;
  }

  function renderIntro(s, wrap) {
    wrap.append(el('p', 'kicker', t(s.kicker)));
    const hero = heading(t(s.hero), 'hero');
    wrap.append(hero, el('p', 'lead', t(s.body)));
    const facts = el('div', 'facts');
    s.facts.forEach((f) => facts.append(el('span', 'fact', t(f))));
    wrap.append(facts);
    requestAnimationFrame(() => fitText(hero, 76, 44));
  }

  function renderQuestion(s, wrap) {
    wrap.append(el('p', 'kicker', s.kicker ? (s.type === 'tiles' ? t(s.kicker) : `Q.${String(s.step).padStart(2, '0')} — ${t(s.kicker)}`) : ''));
    wrap.append(heading(t(s.q), 'question'));
    if (s.hint) wrap.append(el('p', 'hint', t(s.hint)));

    if (s.type === 'tiles') {
      const g = s.groups[0];
      const box = el('div', 'tiles');
      box.setAttribute('role', 'radiogroup');
      box.setAttribute('aria-labelledby', 'q-title');
      g.options.forEach((o) => {
        const b = el('button', 'tile');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', String(state.answers[g.field] === o.id));
        const txt = el('span');
        txt.append(el('span', 'tile-title', t(o)), el('span', 'tile-sub', t(o.sub)));
        b.append(txt, el('span', 'tile-arrow', '→'));
        b.addEventListener('click', () => {
          const prev = state.answers[g.field];
          state.answers[g.field] = o.id;
          if (prev && prev !== o.id) clearBranch(prev);
          box.querySelectorAll('.tile').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
          setTimeout(() => { if (current() === s.id) next(); }, 280);
        });
        box.append(b);
      });
      wrap.append(box);
      return;
    }

    const groups = el('div', 'groups');
    s.groups.forEach((g, gi) => groups.append(renderGroup(s, g, gi)));
    wrap.append(groups);
  }

  function clearBranch(branch) {
    SCREENS.filter((x) => x.branch === branch).forEach((x) => x.groups.forEach((g) => { delete state.answers[g.field]; delete state.other[g.field]; }));
  }

  function renderGroup(s, g, gi) {
    const box = el('div', 'group');
    box.dataset.field = g.field;
    box.hidden = !showIfOk(g);
    let labelId = 'q-title';
    if (g.label) { labelId = `lbl-${g.field}`; const l = el('p', 'group-label', t(g.label)); l.id = labelId; box.append(l); }
    const chips = el('div', 'chips');
    chips.setAttribute('role', g.type === 'single' ? 'radiogroup' : 'group');
    chips.setAttribute('aria-labelledby', labelId);
    orderFor(g).forEach((o) => {
      const b = el('button', 'chip', t(o));
      b.type = 'button';
      b.dataset.id = o.id;
      b.setAttribute('role', g.type === 'single' ? 'radio' : 'checkbox');
      b.addEventListener('click', () => pick(s, g, o, b));
      chips.append(b);
    });
    if (g.other) chips.append(renderOther(s, g));
    box.append(chips);
    paintGroup(box, g);
    return box;
  }

  function renderOther(s, g) {
    const f = g.field;
    const b = el('div', 'chip other');
    b.setAttribute('role', g.type === 'single' ? 'radio' : 'checkbox');
    b.tabIndex = 0;
    const label = () => `+  ${t(g.otherLabel || 'other')}`;
    b.dataset.label = label();
    const show = () => {
      b.classList.remove('editing');
      b.textContent = otherText(f) || label();
    };
    const edit = () => {
      if (b.classList.contains('editing')) return;
      state.editing = f;
      b.classList.add('editing');
      b.textContent = '';
      const inp = el('input');
      inp.type = 'text';
      inp.maxLength = 80;
      inp.placeholder = t('otherPh');
      inp.value = state.other[f] || '';
      inp.setAttribute('aria-label', `${t('other')} — ${t('otherPh')}`);
      inp.enterKeyHint = 'done';
      inp.autocomplete = 'off';
      const done = el('button', 'done', '✓');
      done.type = 'button';
      done.setAttribute('aria-label', 'OK');
      inp.addEventListener('input', () => { state.other[f] = inp.value; });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); }
        if (e.key === 'Escape') { state.other[f] = ''; inp.blur(); }
      });
      inp.addEventListener('blur', () => setTimeout(() => { commitOther(s, g); show(); }, 0));
      done.addEventListener('pointerdown', (e) => e.preventDefault());
      done.addEventListener('click', () => inp.blur());
      b.append(inp, done);
      renderFooter(s);
      inp.focus();
      setTimeout(() => b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 250);
    };
    b.addEventListener('click', (e) => {
      if (b.classList.contains('editing')) return;
      const v = state.answers[f];
      const on = Array.isArray(v) ? v.includes('other') : v === 'other';
      if (on) { // tap again to remove
        state.other[f] = '';
        commitOther(s, g);
        show();
        return;
      }
      e.preventDefault();
      edit();
    });
    b.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !b.classList.contains('editing')) { e.preventDefault(); b.click(); } });
    show();
    return b;
  }

  function paintGroup(box, g) {
    const v = state.answers[g.field];
    box.querySelectorAll('.chip').forEach((c) => {
      const isOther = c.classList.contains('other');
      const id = isOther ? 'other' : c.dataset.id;
      const on = Array.isArray(v) ? v.includes(id) : v === id;
      c.setAttribute('aria-checked', String(!!on));
      if (isOther && !c.classList.contains('editing')) c.textContent = (on && otherText(g.field)) || c.dataset.label;
    });
  }

  function refresh(s) {
    visibleGroups(s);
    main.querySelectorAll('.group').forEach((box) => {
      const g = s.groups.find((x) => x.field === box.dataset.field);
      const ok = showIfOk(g);
      if (!ok) { delete state.answers[g.field]; delete state.other[g.field]; }
      if (box.hidden && ok) { box.hidden = false; box.classList.add('reveal'); setTimeout(() => box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120); }
      else box.hidden = !ok;
      paintGroup(box, g);
    });
    renderFooter(s);
  }

  function micro() {
    const m = el('div', 'micro');
    m.append(el('span', null, t('microLeft')), el('span', null, t('microRight')));
    return m;
  }

  function renderFooter(s) {
    footer.textContent = '';
    if (s.type === 'intro') {
      const start = el('button', 'btn btn-primary btn-wide');
      start.type = 'button';
      start.append(el('span', null, t(s.cta)), el('span', null, '→'));
      start.addEventListener('click', next);
      footer.append(start, el('p', 'fine', t(s.fine)), micro());
      return;
    }
    if (s.type === 'end') { renderEndFooter(s); return; }

    const row = el('div', 'actions');
    const backBtn = el('button', 'btn btn-text', `←  ${t('back')}`);
    backBtn.type = 'button';
    backBtn.addEventListener('click', back);
    row.append(backBtn);
    const right = el('div', 'right');
    if (s.type === 'tiles' || autoAdvance(s)) {
      right.append(el('span', 'tap-hint', t('tap')));
    } else {
      if (s.optional && !hasAny(s)) {
        const skip = el('button', 'btn btn-text', t('skip'));
        skip.type = 'button';
        skip.addEventListener('click', next);
        right.append(skip);
      }
      const nx = el('button', 'btn btn-primary');
      nx.type = 'button';
      nx.append(el('span', null, t('next')), el('span', null, '→'));
      nx.disabled = !screenDone(s) || (s.optional && !hasAny(s));
      nx.addEventListener('pointerdown', (e) => { if (state.editing) e.preventDefault(); });
      nx.addEventListener('click', () => {
        const a = document.activeElement;
        if (state.editing && a && a.tagName === 'INPUT') a.blur();
        setTimeout(() => { if (screenDone(s)) next(); }, 10);
      });
      right.append(nx);
    }
    row.append(right);
    footer.append(row, micro());
  }

  /* ---------- end screen & waitlist ---------- */
  const isMinor = () => state.answers.age_band === 'u16' && CFG.MIN_AGE_FOR_WAITLIST > 0;

  function renderEnd(s, wrap) {
    wrap.append(el('p', 'kicker', t(s.kicker)));
    const hero = heading(t(s.hero), 'hero');
    wrap.append(hero, el('p', 'lead', t(s.body)));
    requestAnimationFrame(() => fitText(hero, 76, 44));
  }

  function renderEndFooter(s) {
    if (isMinor()) { footer.append(el('p', 'msg ok', t(s.under16)), micro()); return; }
    const W = CFG.WAITLIST || {};
    const box = el('div', 'wl');
    box.append(el('p', 'msg', t(s.ask)));
    const join = el('button', 'btn btn-primary btn-wide');
    join.type = 'button';
    join.append(el('span', null, t(s.join)), el('span', null, W.endpoint ? '→' : '↗︎'));
    const finish = el('button', 'btn btn-text btn-wide', t(s.finish));
    finish.type = 'button';
    box.append(join, finish);

    const form = el('div', 'wl');
    form.hidden = true;
    const email = el('input', 'field');
    Object.assign(email, { type: 'email', inputMode: 'email', autocomplete: 'email', placeholder: t(s.email), required: true });
    email.setAttribute('aria-label', t(s.email));
    const hp = el('input', 'hp');
    Object.assign(hp, { type: 'text', tabIndex: -1, autocomplete: 'off', name: 'company' });
    hp.setAttribute('aria-hidden', 'true');
    const lab = el('label', 'check');
    const cb = el('input');
    cb.type = 'checkbox';
    lab.append(cb, el('span', null, t(s.consent)));
    const submit = el('button', 'btn btn-primary btn-wide');
    submit.type = 'button';
    submit.append(el('span', null, t(s.submit)), el('span', null, '→'));
    const msg = el('p', 'msg');
    msg.setAttribute('role', 'status');
    form.append(email, hp, lab, submit, msg);

    const note = el('p', 'fine', t(s.note));

    join.addEventListener('click', () => {
      if (!W.endpoint) { window.open(W.url, '_blank', 'noopener'); return; }
      box.hidden = true; form.hidden = false; email.focus();
    });
    finish.addEventListener('click', () => { footer.textContent = ''; footer.append(el('p', 'msg ok', t(s.done)), micro()); });
    submit.addEventListener('click', async () => {
      const addr = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(addr)) { msg.textContent = t(s.bad); email.focus(); return; }
      if (!cb.checked) { msg.textContent = t(s.needConsent); return; }
      if (hp.value) { form.replaceWith(el('p', 'msg ok', t(s.ok))); return; }
      submit.disabled = true; msg.textContent = '';
      try {
        const r = await fetch(W.endpoint, { method: W.method || 'POST', headers: W.headers || { 'Content-Type': 'application/json' }, body: JSON.stringify(W.buildBody({ email: addr, consent: true, lang: state.lang })) });
        if (!r.ok) throw new Error(r.status);
        form.replaceWith(el('p', 'msg ok', t(s.ok)));
        note.remove();
      } catch (e) {
        msg.textContent = t(s.err);
        submit.disabled = false;
      }
    });
    footer.append(box, form, note, micro());
  }

  /* ---------- data ---------- */
  function buildPayload(type) {
    const fields = {};
    const seq = flow();
    const upTo = type === 'partial' ? seq.indexOf(current()) + 1 : seq.length;
    seq.slice(0, upTo).forEach((sid) => {
      (byId[sid].groups || []).forEach((g) => {
        if (!showIfOk(g)) return;
        const v = state.answers[g.field];
        if (v == null || (Array.isArray(v) && !v.length)) return;
        fields[g.field] = Array.isArray(v) ? v.join(',') : v;
        const usesOther = Array.isArray(v) ? v.includes('other') : v === 'other';
        if (g.other && usesOther && otherText(g.field)) fields[`${g.field}_other`] = otherText(g.field).slice(0, 80);
      });
    });
    const times = {};
    Object.entries(state.times).forEach(([k, ms]) => { times[k] = Math.round(ms / 100) / 10; });
    const start = state.started || new Date();
    return {
      type,
      response_id: state.id,
      client_time: new Date().toISOString(),
      started_at: start.toISOString(),
      duration_sec: Math.round((Date.now() - start.getTime()) / 1000),
      source: state.source,
      lang: state.lang,
      version: CFG.VERSION,
      device: matchMedia('(pointer: coarse)').matches ? 'touch' : 'pointer',
      last_screen: current(),
      screen_times: JSON.stringify(times),
      hp: '',
      ...fields,
    };
  }

  async function post(payload) {
    if (!CFG.SHEETS_ENDPOINT) {
      console.info('[qila] demo mode — no SHEETS_ENDPOINT set. Payload:', payload);
      try { const k = 'qila_demo'; const a = JSON.parse(localStorage.getItem(k) || '[]'); a.push(payload); localStorage.setItem(k, JSON.stringify(a.slice(-50))); } catch (e) { /* storage unavailable */ }
      return true;
    }
    const body = JSON.stringify(payload);
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(CFG.SHEETS_ENDPOINT, { method: 'POST', body });
        if (r.ok) return true;
      } catch (e) {
        try { await fetch(CFG.SHEETS_ENDPOINT, { method: 'POST', mode: 'no-cors', body }); return true; } catch (e2) { /* offline */ }
      }
      await sleep(900 * (i + 1));
    }
    return false;
  }

  async function submitSurvey() {
    leaveScreen();
    state.enteredAt = Date.now();
    state.submitted = true;
    const payload = buildPayload('complete');
    const ok = await post(payload);
    if (!ok) { try { localStorage.setItem('qila_pending', JSON.stringify(payload)); } catch (e) { /* ignore */ } }
  }
  async function flushPending() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem('qila_pending') || 'null'); } catch (e) { /* ignore */ }
    if (p && (await post(p))) { try { localStorage.removeItem('qila_pending'); } catch (e) { /* ignore */ } }
  }
  function beacon() {
    if (state.submitted || !state.started || !CFG.SHEETS_ENDPOINT || !navigator.sendBeacon) return;
    if (state.lastBeacon === current()) return;
    state.lastBeacon = current();
    const p = buildPayload('partial');
    navigator.sendBeacon(CFG.SHEETS_ENDPOINT, new Blob([JSON.stringify(p)], { type: 'text/plain;charset=UTF-8' }));
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') beacon(); });
  window.addEventListener('pagehide', beacon);

  /* ---------- utils ---------- */
  function fitText(node, max, min) {
    let size = max;
    node.style.fontSize = `${size}px`;
    const avail = node.parentElement.clientWidth;
    while (size > min && node.scrollWidth > avail + 1) { size -= 2; node.style.fontSize = `${size}px`; }
  }

  $('#lang').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b || b.dataset.lang === state.lang) return;
    state.lang = b.dataset.lang;
    render(null);
  });

  render(null);
  flushPending();
  window.__qila = { state, buildPayload }; // handy for debugging in the console
})();
