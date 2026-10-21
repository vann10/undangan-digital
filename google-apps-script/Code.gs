/**
 * Private Google Sheets backend. Deploy as a web app (execute as owner).
 * Script properties: SPREADSHEET_ID and RSVP_API_TOKEN.
 */
const GUEST_HEADERS = ['Invitation ID', 'Full name', 'Guest code', 'Active'];
const RSVP_HEADERS = ['Invitation ID', 'Submitted at (UTC)', 'Attendance'];
const WISH_HEADERS = ['Wish ID', 'Invitation ID', 'Submitted at (UTC)', 'Full name', 'Message'];

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function settings_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  const token = props.getProperty('RSVP_API_TOKEN');
  if (!id || !token) throw new Error('Script properties are incomplete');
  return { id, token };
}

function sheet_(book, name, headers) {
  let sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  } else if (JSON.stringify(sheet.getRange(1, 1, 1, headers.length).getValues()[0].map(String)) !== JSON.stringify(headers)) {
    throw new Error(`${name} has an incompatible header. Move the old tab before setup.`);
  }
  return sheet;
}

function setupSheet() {
  const book = SpreadsheetApp.openById(settings_().id);
  sheet_(book, 'Guests', GUEST_HEADERS);
  sheet_(book, 'RSVP', RSVP_HEADERS);
  sheet_(book, 'Wishes', WISH_HEADERS);
}

function rows_(sheet, width) {
  const last = sheet.getLastRow();
  return last < 2 ? [] : sheet.getRange(2, 1, last - 1, width).getValues();
}

function allowAttempt_(clientKey, id, valid) {
  const client = typeof clientKey === 'string' && /^[a-f0-9]{24}$/.test(clientKey) ? clientKey : 'direct';
  const cache = CacheService.getScriptCache();
  const guestKey = `failed:${client}:${id}`;
  const allKey = `failed:${client}:all`;
  const guestFailures = Number(cache.get(guestKey) || 0);
  const allFailures = Number(cache.get(allKey) || 0);
  if (guestFailures >= 5 || allFailures >= 25) return false;
  if (!valid) {
    cache.put(guestKey, String(guestFailures + 1), 900);
    cache.put(allKey, String(allFailures + 1), 900);
  }
  return true;
}

function guest_(book, id, token, clientKey) {
  if (typeof id !== 'string' || !/^[1-9]\d{0,9}$/.test(id)
    || typeof token !== 'string' || !/^\d{4}$/.test(token)) return null;
  const matches = rows_(sheet_(book, 'Guests', GUEST_HEADERS), 4).filter(row => String(row[0]) === id);
  const storedCode = matches.length === 1 ? String(matches[0][2]).trim() : '';
  const valid = matches.length === 1 && /^\d{1,4}$/.test(storedCode) && storedCode.padStart(4, '0') === token
    && String(matches[0][3]).toLowerCase() === 'true';
  if (!allowAttempt_(clientKey, id, valid)) return { limited: true };
  if (!valid) return null;
  const name = String(matches[0][1]).trim();
  return name.length >= 2 && name.length <= 100 ? { id, name } : null;
}

function safeText_(value, max) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length < 2 || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return null;
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function publicText_(value) {
  const text = String(value || '');
  return /^'[=+\-@]/.test(text) ? text.slice(1) : text;
}

function doGet(e) {
  try {
    const settings = settings_();
    if (!e || !e.parameter || e.parameter.token !== settings.token) return output_({ ok: false, code: 'unauthorized' });
    const book = SpreadsheetApp.openById(settings.id);
    const sheet = sheet_(book, 'Wishes', WISH_HEADERS);
    const last = sheet.getLastRow();
    const count = Math.min(100, last - 1);
    const wishes = (count ? sheet.getRange(last - count + 1, 1, count, 5).getValues() : []).reverse().map(row => ({
      id: String(row[0]), createdAt: String(row[2]), name: publicText_(row[3]), message: publicText_(row[4]),
    }));
    return output_({ ok: true, wishes });
  } catch (error) {
    console.error(error);
    return output_({ ok: false, code: 'unavailable' });
  }
}

function doPost(e) {
  let lock;
  try {
    const settings = settings_();
    const data = JSON.parse(e.postData.contents);
    if (data.serviceToken !== settings.token) return output_({ ok: false, code: 'unauthorized' });
    const book = SpreadsheetApp.openById(settings.id);
    const guest = guest_(book, data.invitationId, data.invitationToken, data.clientKey);
    if (guest && guest.limited) return output_({ ok: false, code: 'too_many_attempts' });
    if (!guest) return output_({ ok: false, code: 'invalid_invitation' });
    if (data.action === 'guest') {
      const existing = rows_(sheet_(book, 'RSVP', RSVP_HEADERS), 3).find(row => String(row[0]) === guest.id);
      return output_({ ok: true, name: guest.name, attendance: existing ? String(existing[2]) : null });
    }
    if (data.action !== 'rsvp' && data.action !== 'wish') return output_({ ok: false, code: 'invalid_request' });
    lock = LockService.getScriptLock();
    lock.waitLock(20000);
    const currentGuest = guest_(book, data.invitationId, data.invitationToken, data.clientKey);
    if (currentGuest && currentGuest.limited) return output_({ ok: false, code: 'too_many_attempts' });
    if (!currentGuest) return output_({ ok: false, code: 'invalid_invitation' });
    if (data.action === 'rsvp') {
      if (!['attending', 'not_attending'].includes(data.attendance)) return output_({ ok: false, code: 'invalid_request' });
      const sheet = sheet_(book, 'RSVP', RSVP_HEADERS);
      const existing = rows_(sheet, 3).find(row => String(row[0]) === guest.id);
      if (existing) return output_({ ok: false, code: 'already_submitted', attendance: String(existing[2]) });
      sheet.appendRow([guest.id, new Date().toISOString(), data.attendance]);
      SpreadsheetApp.flush();
      return output_({ ok: true, attendance: data.attendance });
    }
    if (typeof data.wishId !== 'string' || !/^[a-f0-9-]{36}$/i.test(data.wishId)) return output_({ ok: false, code: 'invalid_request' });
    const message = safeText_(data.message, 1000);
    if (!message) return output_({ ok: false, code: 'invalid_request' });
    const sheet = sheet_(book, 'Wishes', WISH_HEADERS);
    const existing = rows_(sheet, 5);
    if (existing.some(row => String(row[0]) === data.wishId && String(row[1]) === guest.id)) return output_({ ok: true, duplicate: true });
    if (existing.some(row => String(row[1]) === guest.id)) return output_({ ok: false, code: 'wish_already_submitted' });
    sheet.appendRow([data.wishId, guest.id, new Date().toISOString(), safeText_(guest.name, 100), message]);
    SpreadsheetApp.flush();
    return output_({ ok: true });
  } catch (error) {
    console.error(error);
    return output_({ ok: false, code: 'unavailable' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
