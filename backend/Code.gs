/**
 * qila survey — Google Sheets backend (Google Apps Script)
 * ---------------------------------------------------------
 * Receives answers from the survey page and writes one row per response.
 *
 *   Responses  one row per completed survey (deduplicated by response_id)
 *   Partial    one row per abandoned survey, updated as the person moves on
 *   Summary    counts per question and answer (menu: qila → Refresh summary)
 *
 * Columns are created automatically: if you add a question on the website,
 * a new column appears the first time someone answers it.
 *
 * Setup: see backend/README.md (5 minutes).
 */

const SHEETS = { complete: 'Responses', partial: 'Partial' };
const BASE_COLUMNS = [
  'received_at', 'response_id', 'source', 'lang', 'version', 'device',
  'started_at', 'duration_sec', 'last_screen', 'excluded',
  'helmet_use',
];
const META_KEYS = ['type', 'client_time', 'hp', 'screen_times'];
const MAX_TEXT = 80;
const MAX_FIELDS = 80;
const ID_RE = /^[0-9a-f-]{36}$/i;
const KEY_RE = /^[a-z][a-z0-9_]{0,48}$/;
const CODE_RE = /^[a-z0-9_,]{0,400}$/i;

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  if (data.hp) return json_({ ok: true }); // honeypot filled → bot, pretend success
  const type = data.type === 'partial' ? 'partial' : 'complete';
  if (!ID_RE.test(String(data.response_id || ''))) return json_({ ok: false, error: 'bad_id' });

  const row = sanitize_(data);
  if (!row) return json_({ ok: false, error: 'bad_payload' });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (type === 'complete') {
      const sheet = sheet_(ss, SHEETS.complete);
      if (findRow_(sheet, row.response_id) > 0) return json_({ ok: true, duplicate: true });
      writeRow_(sheet, row, 0);
      const partial = ss.getSheetByName(SHEETS.partial); // a finished survey is no longer "partial"
      if (partial) { const r = findRow_(partial, row.response_id); if (r > 0) partial.deleteRow(r); }
    } else {
      const done = ss.getSheetByName(SHEETS.complete);
      if (done && findRow_(done, row.response_id) > 0) return json_({ ok: true, ignored: true });
      const sheet = sheet_(ss, SHEETS.partial);
      writeRow_(sheet, row, findRow_(sheet, row.response_id));
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'qila survey', time: new Date().toISOString() });
}

/* ---------- helpers ---------- */

function sanitize_(d) {
  const out = {
    received_at: new Date(),
    response_id: String(d.response_id),
    source: clean_(d.source, 40) || 'direct',
    lang: d.lang === 'da' ? 'da' : 'en',
    version: clean_(d.version, 30),
    device: d.device === 'touch' ? 'touch' : 'pointer',
    started_at: clean_(d.started_at, 30),
    duration_sec: Math.max(0, Math.min(86400, Number(d.duration_sec) || 0)),
    last_screen: clean_(d.last_screen, 12),
    excluded: d.age_band === 'u16' ? 'under 16' : '',
    screen_times: clean_(d.screen_times, 600),
  };
  let n = 0;
  for (const key in d) {
    if (META_KEYS.indexOf(key) >= 0 || key in out) continue;
    if (!KEY_RE.test(key)) continue;
    if (++n > MAX_FIELDS) break;
    const value = d[key];
    if (typeof value !== 'string') continue;
    if (/_other$/.test(key)) {
      out[key] = safeText_(value.slice(0, MAX_TEXT));
    } else {
      if (!CODE_RE.test(value)) continue; // answers are short option codes like "carrying,hair"
      out[key] = value.split(',').filter(String).join(', ');
    }
  }
  return out;
}

function clean_(v, max) {
  return safeText_(String(v == null ? '' : v).slice(0, max));
}

// Stops spreadsheet formula injection (=, +, -, @ at the start of free text).
function safeText_(s) {
  s = s.replace(/[\u0000-\u001f]/g, ' ').trim();
  return /^[=+\-@\t]/.test(s) ? "'" + s : s;
}

function sheet_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(BASE_COLUMNS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, BASE_COLUMNS.length).setFontWeight('bold');
  }
  return sh;
}

function headers_(sheet) {
  const last = Math.max(1, sheet.getLastColumn());
  return sheet.getRange(1, 1, 1, last).getValues()[0].map(String);
}

function writeRow_(sheet, row, existingRow) {
  let headers = headers_(sheet);
  const missing = Object.keys(row).filter((k) => headers.indexOf(k) < 0);
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
    headers = headers.concat(missing);
  }
  const values = headers.map((h) => (h in row ? row[h] : ''));
  if (existingRow > 0) sheet.getRange(existingRow, 1, 1, values.length).setValues([values]);
  else sheet.appendRow(values);
}

function findRow_(sheet, id) {
  const col = headers_(sheet).indexOf('response_id') + 1;
  if (col < 1 || sheet.getLastRow() < 2) return 0;
  const hit = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- menu & summary ---------- */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('qila')
    .addItem('Refresh summary', 'refreshSummary')
    .addItem('Set up sheets', 'setup')
    .addToUi();
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet_(ss, SHEETS.complete);
  sheet_(ss, SHEETS.partial);
  refreshSummary();
}

/**
 * Counts every answer code per question — overall and split by helmet use.
 * Multi-select cells ("carrying, hair") count once per code. Under-16s are excluded.
 */
function refreshSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const src = ss.getSheetByName(SHEETS.complete);
  let out = ss.getSheetByName('Summary');
  if (!out) out = ss.insertSheet('Summary');
  out.clear();
  const segs = ['yes', 'sometimes', 'no'];
  const rows = [['Question', 'Answer', 'All', 'All %', 'Yes', 'Sometimes', 'No']];
  if (!src || src.getLastRow() < 2) {
    rows.push(['No responses yet', '', '', '', '', '', '']);
  } else {
    const data = src.getDataRange().getValues();
    const head = data.shift().map(String);
    const skip = ['received_at', 'response_id', 'started_at', 'duration_sec', 'screen_times', 'last_screen', 'excluded', 'version'];
    const iUse = head.indexOf('helmet_use');
    const iEx = head.indexOf('excluded');
    const kept = data.filter((r) => !r[iEx]);
    rows[0][2] = 'All (n=' + kept.length + ')';
    const segN = {};
    segs.forEach((s) => { segN[s] = kept.filter((r) => r[iUse] === s).length; });
    head.forEach((h, c) => {
      if (skip.indexOf(h) >= 0 || /_other$/.test(h)) return;
      const counts = {};
      kept.forEach((r) => {
        String(r[c]).split(',').map((x) => x.trim()).filter(String).forEach((code) => {
          counts[code] = counts[code] || { all: 0, yes: 0, sometimes: 0, no: 0 };
          counts[code].all++;
          if (segs.indexOf(r[iUse]) >= 0) counts[code][r[iUse]]++;
        });
      });
      const answered = kept.filter((r) => String(r[c]).trim()).length;
      Object.keys(counts).sort((a, b) => counts[b].all - counts[a].all).forEach((code, i) => {
        const k = counts[code];
        rows.push([i === 0 ? h + ' (n=' + answered + ')' : '', code, k.all, answered ? k.all / answered : 0, k.yes, k.sometimes, k.no]);
      });
      rows.push(['', '', '', '', '', '', '']);
    });
    rows[0][4] = 'Yes (n=' + segN.yes + ')';
    rows[0][5] = 'Sometimes (n=' + segN.sometimes + ')';
    rows[0][6] = 'No (n=' + segN.no + ')';
  }
  out.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  out.getRange(2, 4, Math.max(1, rows.length - 1), 1).setNumberFormat('0%');
  out.getRange(1, 1, 1, rows[0].length).setFontWeight('bold');
  out.setFrozenRows(1);
  out.autoResizeColumns(1, rows[0].length);
  const partial = ss.getSheetByName(SHEETS.partial);
  out.getRange(1, 9).setValue('Completed');
  out.getRange(1, 10).setValue(src ? Math.max(0, src.getLastRow() - 1) : 0);
  out.getRange(2, 9).setValue('Abandoned');
  out.getRange(2, 10).setValue(partial ? Math.max(0, partial.getLastRow() - 1) : 0);
  out.getRange(3, 9).setValue('Updated');
  out.getRange(3, 10).setValue(new Date());
}
