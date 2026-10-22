import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sheets = new Map();
const cache = new Map();
function makeSheet() {
  const rows = [];
  return {
    rows,
    getLastRow: () => rows.length,
    appendRow: row => rows.push(row),
    setFrozenRows: () => {},
    getRange: (start, column, count, width) => ({
      setFontWeight: () => {},
      getValue: () => rows[start - 1]?.[column - 1] ?? '',
      setValue: value => {
        while (rows.length < start) rows.push([]);
        rows[start - 1][column - 1] = value;
      },
      getValues: () => rows.slice(start - 1, start - 1 + count).map(row => row.slice(column - 1, column - 1 + width)),
    }),
  };
}
const book = {
  getSheetByName: name => sheets.get(name) || null,
  insertSheet: name => { const sheet = makeSheet(); sheets.set(name, sheet); return sheet; },
};
let locked = false;
const context = vm.createContext({
  console, Date, JSON, String, Number,
  ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: value => ({ value, setMimeType() { return this; } }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: key => ({ SPREADSHEET_ID: 'test-sheet', RSVP_API_TOKEN: 'test-service-secret' })[key] }) },
  SpreadsheetApp: { openById: id => { assert.equal(id, 'test-sheet'); return book; }, flush: () => {} },
  LockService: { getScriptLock: () => ({ waitLock: () => { locked = true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) },
  CacheService: { getScriptCache: () => ({ get: key => cache.get(key) ?? null, put: (key, value) => cache.set(key, value), remove: key => cache.delete(key) }) },
});
vm.runInContext(readFileSync('google-apps-script/Code.gs', 'utf8'), context);
const result = output => JSON.parse(output.value);
const token = '0042';
const identity = { invitationId: '1', invitationToken: token };
const post = data => result(context.doPost({ postData: { contents: JSON.stringify({ serviceToken: 'test-service-secret', ...data }) } }));

context.setupSheet();
assert.deepEqual([...sheets.keys()], ['Guests', 'RSVP', 'Wishes']);
assert.equal(sheets.get('RSVP').rows[0][4], 'Guest count');
sheets.get('Guests').appendRow(['1', 'Ade Fitriyani', '0042', true]);
sheets.get('Guests').appendRow(['2', 'Tamu Kode Pendek', 88, true]);
assert.equal(post({ action: 'guest', ...identity }).name, 'Ade Fitriyani');
assert.equal(post({ action: 'guest', invitationId: '2', invitationToken: '0088' }).name, 'Tamu Kode Pendek');
assert.equal(post({ action: 'guest', ...identity, invitationToken: '9999' }).code, 'invalid_invitation');
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'attending' }).code, 'invalid_request');
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'attending', guestCount: 21 }).code, 'invalid_request');
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'attending', guestCount: 1.5 }).code, 'invalid_request');
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'attending', guestCount: 2 }).ok, true);
assert.equal(sheets.get('RSVP').rows[1][4], 2);
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'not_attending', guestCount: 0 }).code, 'already_submitted');
assert.equal(sheets.get('RSVP').rows.length, 2);
assert.equal(post({ action: 'guest', ...identity }).attendance, 'attending');
assert.equal(post({ action: 'guest', ...identity }).guestCount, 2);
assert.equal(post({ action: 'rsvp', invitationId: '2', invitationToken: '0088', attendance: 'not_attending', guestCount: 0 }).ok, true);
const wishId = '12345678-1234-1234-1234-123456789abc';
assert.equal(post({ action: 'wish', ...identity, wishId, message: '=2+2' }).ok, true);
assert.equal(sheets.get('Wishes').rows[1][4], "'=2+2");
assert.equal(post({ action: 'wish', ...identity, wishId, message: '=2+2' }).duplicate, true);
assert.equal(post({ action: 'wish', ...identity, wishId: '12345678-1234-1234-1234-123456789abd', message: 'Doa kedua' }).code, 'wish_already_submitted');
assert.equal(post({ action: 'wish', ...identity, wishId: '12345678-1234-1234-1234-123456789abe', message: 'Pesan\u0000rusak' }).code, 'invalid_request');
const wishes = result(context.doGet({ parameter: { token: 'test-service-secret' } }));
assert.equal(wishes.wishes[0].message, '=2+2');
assert.equal(result(context.doGet({ parameter: { token: 'wrong' } })).code, 'unauthorized');
sheets.get('Guests').rows[1][3] = false;
assert.equal(post({ action: 'guest', ...identity }).code, 'invalid_invitation');
const clientKey = 'a'.repeat(24);
for (let index = 0; index < 5; index++)
  assert.equal(post({ action: 'guest', invitationId: '2', invitationToken: '9999', clientKey }).code, 'invalid_invitation');
assert.equal(post({ action: 'guest', invitationId: '2', invitationToken: '0088', clientKey }).code, 'too_many_attempts');
console.log('Google Apps Script mock: PASS (four-digit identity, final RSVP, wishes, rate limit, formula safety, revocation)');
