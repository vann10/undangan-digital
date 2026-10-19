import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const rows = [];
const sheet = {
  getLastRow: () => rows.length,
  appendRow: row => rows.push(row),
  setFrozenRows: () => {},
  getRange: (startRow, startColumn, rowCount, columnCount) => ({
    setFontWeight: () => {},
    getValues: () => rows.slice(startRow - 1, startRow - 1 + rowCount).map(row => row.slice(startColumn - 1, startColumn - 1 + columnCount)),
    createTextFinder: text => ({ matchEntireCell: () => ({ findNext: () => rows.slice(startRow - 1).some(row => row[0] === text) ? {} : null }) }),
  }),
};
const book = { getSheetByName: () => rows.length ? sheet : null, insertSheet: () => sheet };
let locked = false;
const context = vm.createContext({
  console, Date, JSON, String, Number,
  ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: value => ({ value, setMimeType() { return this; } }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: key => ({ SPREADSHEET_ID: 'test-sheet', RSVP_API_TOKEN: 'test-token' })[key] }) },
  SpreadsheetApp: { openById: id => { assert.equal(id, 'test-sheet'); return book; }, flush: () => {} },
  LockService: { getScriptLock: () => ({ waitLock: () => { locked = true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) },
});
vm.runInContext(readFileSync('google-apps-script/Code.gs', 'utf8'), context);
const result = output => JSON.parse(output.value);
const post = data => result(context.doPost({ postData: { contents: JSON.stringify({ token: 'test-token', ...data }) } }));
const base = { submissionId: '12345678-1234-1234-1234-123456789abc', name: 'Ade Fitriyani', attendance: 'attending', guestCount: 2, message: 'Semoga bahagia selalu.' };
context.setupSheet();
assert.equal(rows.length, 1);
assert.equal(post(base).ok, true);
assert.equal(rows.length, 2);
assert.equal(post(base).duplicate, true);
assert.equal(rows.length, 2);
assert.equal(post({ ...base, submissionId: '12345678-1234-1234-1234-123456789abd', name: '=2+2', message: '+SUM(A1:A2)' }).ok, true);
assert.equal(rows[2][2], "'=2+2");
assert.equal(rows[2][5], "'+SUM(A1:A2)");
assert.equal(post({ ...base, submissionId: '12345678-1234-1234-1234-123456789abe', attendance: 'not_attending', guestCount: 1 }).ok, false);
const wishes = result(context.doGet({ parameter: { token: 'test-token' } }));
assert.equal(wishes.ok, true);
assert.equal(wishes.wishes.length, 2);
assert.equal(wishes.wishes[0].name, '=2+2');
assert.equal(result(context.doGet({ parameter: { token: 'wrong' } })).ok, false);
console.log('Google Apps Script mock: PASS (new row, duplicate retry, validation, formula protection, wishes read)');
