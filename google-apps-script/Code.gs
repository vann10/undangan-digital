/**
 * RSVP backend for the Rizal & Dewi invitation.
 * Script properties: SPREADSHEET_ID and RSVP_API_TOKEN.
 * Deploy as a Web app: Execute as me; Who has access: Anyone.
 */
const SHEET_NAME = 'RSVP';
const HEADERS = ['Submission ID', 'Submitted at (UTC)', 'Full name', 'Attendance', 'Guest count', 'Wishes & messages'];

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function settings_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  const token = props.getProperty('RSVP_API_TOKEN');
  if (!id || !token) throw new Error('Script properties are incomplete');
  return { id, token };
}

function sheet_(id) {
  const book = SpreadsheetApp.openById(id);
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function setupSheet() {
  sheet_(settings_().id);
}

function safeText_(value, max) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length < 2 || text.length > max) return null;
  // Keep untrusted guest text from becoming a Google Sheets formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function publicText_(value) {
  const text = String(value || '');
  return /^'[=+\-@]/.test(text) ? text.slice(1) : text;
}

function doGet(e) {
  try {
    const settings = settings_();
    if (!e || !e.parameter || e.parameter.token !== settings.token) return output_({ ok: false, error: 'Unauthorized' });
    const sheet = sheet_(settings.id);
    const last = sheet.getLastRow();
    if (last < 2) return output_({ ok: true, wishes: [] });
    const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
    const wishes = rows.reverse().filter(row => row[5]).map(row => ({
      id: String(row[0]), createdAt: String(row[1]), name: publicText_(row[2]), message: publicText_(row[5]),
    }));
    return output_({ ok: true, wishes });
  } catch (error) {
    console.error(error);
    return output_({ ok: false, error: 'Unable to read wishes' });
  }
}

function doPost(e) {
  let lock;
  try {
    const settings = settings_();
    const data = JSON.parse(e.postData.contents);
    if (data.token !== settings.token) return output_({ ok: false, error: 'Unauthorized' });
    if (!/^[a-f0-9-]{36}$/i.test(data.submissionId || '')) return output_({ ok: false, error: 'Invalid ID' });
    const name = safeText_(data.name, 100);
    const message = safeText_(data.message, 1000);
    const attendance = data.attendance;
    const count = data.guestCount;
    if (!name || !message || !['attending', 'not_attending'].includes(attendance)
      || !Number.isInteger(count) || (attendance === 'attending' && (count < 1 || count > 10))
      || (attendance === 'not_attending' && count !== 0)) return output_({ ok: false, error: 'Invalid RSVP' });
    lock = LockService.getScriptLock();
    lock.waitLock(20000);
    const sheet = sheet_(settings.id);
    const last = sheet.getLastRow();
    if (last >= 2) {
      const existing = sheet.getRange(2, 1, last - 1, 1).createTextFinder(data.submissionId).matchEntireCell(true).findNext();
      if (existing) return output_({ ok: true, duplicate: true });
    }
    sheet.appendRow([data.submissionId, new Date().toISOString(), name, attendance, count, message]);
    SpreadsheetApp.flush();
    return output_({ ok: true });
  } catch (error) {
    console.error(error);
    return output_({ ok: false, error: 'Unable to save RSVP' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
