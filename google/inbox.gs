// Bobos Movie Night: shared inbox for pasted titles.
// Paste this whole file into Extensions > Apps Script of your Google Sheet.
// Change PASSCODE before deploying, and use the same passcode in the app.

const PASSCODE = 'change-me';
const SHEET_NAME = 'Inbox';
const HEADERS = ['Added', 'By', 'Title', 'Status', 'Notes'];

function inbox_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  }
  return sh;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Bobos inbox is running.');
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad request' });
  }
  if (!body || body.key !== PASSCODE) return reply_({ ok: false, error: 'bad key' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = inbox_();

    if (body.action === 'ping') return reply_({ ok: true });

    if (body.action === 'add') {
      const by = body.by === 'David' ? 'David' : 'Esra';
      const titles = (body.titles || [])
        .map(t => String(t).trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 300);
      if (!titles.length) return reply_({ ok: true, added: 0 });
      const now = new Date();
      const rows = titles.map(t => [now, by, t, 'pending', '']);
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
      return reply_({ ok: true, added: rows.length });
    }

    if (body.action === 'list') {
      const values = sh.getDataRange().getValues();
      const rows = [];
      for (let i = 1; i < values.length; i++) {
        const [added, by, title, status] = values[i];
        if (!title) continue;
        if (body.all || status === 'pending') {
          rows.push({ row: i + 1, added: added instanceof Date ? added.toISOString() : String(added), by, title, status });
        }
      }
      return reply_({ ok: true, rows });
    }

    if (body.action === 'done') {
      const last = sh.getLastRow();
      let marked = 0;
      (body.rows || []).forEach(r => {
        const n = Number(r);
        if (n >= 2 && n <= last) {
          sh.getRange(n, 4).setValue('done');
          if (body.note) sh.getRange(n, 5).setValue(String(body.note).slice(0, 200));
          marked++;
        }
      });
      return reply_({ ok: true, marked });
    }

    return reply_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}
