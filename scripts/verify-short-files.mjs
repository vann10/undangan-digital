import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function rows(path) {
  const input = readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
  const result = [];
  let row = [], cell = '', quoted = false;
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') { cell += '"'; index++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n') { row.push(cell.replace(/\r$/, '')); result.push(row); row = []; cell = ''; }
    else cell += char;
  }
  assert.equal(quoted, false, `${path}: unclosed quote`);
  if (cell || row.length) { row.push(cell.replace(/\r$/, '')); result.push(row); }
  return result;
}

const names = JSON.parse(readFileSync('data/private/daftar_nama.json', 'utf8'));
const guests = rows('data/private/guests-4digit.csv');
const links = rows('data/private/links-4digit.csv');
assert.deepEqual(guests.shift(), ['Invitation ID', 'Full name', 'Guest code', 'Active']);
assert.deepEqual(links.shift(), ['Invitation ID', 'Full name', 'Personal URL']);
assert.equal(guests.length, names.length);
assert.equal(links.length, names.length);
const used = new Set();
for (let index = 0; index < names.length; index++) {
  const id = String(index + 1);
  const name = names[index].trim().replace(/\s+/g, ' ');
  const guest = guests[index];
  const link = links[index];
  assert.deepEqual(guest.slice(0, 2), [id, name]);
  assert.deepEqual(link.slice(0, 2), [id, name]);
  assert.equal(guest[3], 'TRUE');
  const match = new RegExp(`^/invite/${id}-(\\d{4})$`).exec(link[2]);
  assert(match, `invalid URL for guest ${id}`);
  const code = match[1];
  assert(!used.has(code), `duplicate code for guest ${id}`);
  used.add(code);
  assert.equal(guest[2], code);
}
console.log(`${names.length} unique codes matching guest rows and links: PASS`);
