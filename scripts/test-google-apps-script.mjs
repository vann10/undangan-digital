import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sheets = new Map();
function makeSheet() {
  const rows = [];
  return {
    rows,
    getLastRow: () => rows.length,
    appendRow: row => rows.push(row),
    setFrozenRows: () => {},
    getRange: (start, column, count, width) => ({
      setFontWeight: () => {},
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
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (_, value) => [...createHash('sha256').update(value).digest()].map(byte => byte > 127 ? byte - 256 : byte),
  },
});
vm.runInContext(readFileSync('google-apps-script/Code.gs', 'utf8'), context);
const result = output => JSON.parse(output.value);
const token = 'a'.repeat(43);
const identity = { invitationId: '1', invitationToken: token };
const post = data => result(context.doPost({ postData: { contents: JSON.stringify({ serviceToken: 'test-service-secret', ...data }) } }));

context.setupSheet();
assert.deepEqual([...sheets.keys()], ['Guests', 'RSVP', 'Wishes']);
sheets.get('Guests').appendRow(['1', 'Ade Fitriyani', createHash('sha256').update(token).digest('hex'), true]);
assert.equal(post({ action: 'guest', ...identity }).name, 'Ade Fitriyani');
assert.equal(post({ action: 'guest', ...identity, invitationToken: 'b'.repeat(43) }).code, 'invalid_invitation');
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'attending' }).ok, true);
assert.equal(post({ action: 'rsvp', ...identity, attendance: 'not_attending' }).code, 'already_submitted');
assert.equal(sheets.get('RSVP').rows.length, 2);
assert.equal(post({ action: 'guest', ...identity }).attendance, 'attending');
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
console.log('Google Apps Script mock: PASS (identity, final RSVP, wishes, formula safety, revocation)');
