import { randomBytes, randomInt } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const privateDir = resolve('data/private');
const [command, first, second] = process.argv.slice(2);

function fail(message) { console.error(message); process.exit(1); }
function baseUrl(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || (url.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error();
    if (url.search || url.hash || url.username || url.password) throw new Error();
    return url.origin;
  } catch { fail('Base URL harus origin HTTPS, misalnya https://domain-anda.id'); }
}
function csvCell(value) { return `"${String(value).replaceAll('"', '""')}"`; }
function csv(rows) { return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n'; }
function save(name, content) {
  mkdirSync(privateDir, { recursive: true });
  const path = resolve(privateDir, name);
  if (existsSync(path)) fail(`${path} sudah ada; file privat tidak ditimpa.`);
  writeFileSync(path, content, { encoding: 'utf8', flag: 'wx' });
  console.log(path);
}
function freshCode(used) {
  if (used.size >= 10000) fail('Seluruh kombinasi kode 4 digit sudah terpakai.');
  let code;
  do { code = String(randomInt(10000)).padStart(4, '0'); } while (used.has(code));
  used.add(code);
  return code;
}

function parseCsvRows(input) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (quoted) fail('CSV tidak valid: tanda petik belum ditutup.');
  if (cell || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  return rows;
}
function parseCsv(input) {
  const rows = parseCsvRows(input);
  const header = rows.shift()?.map(value => value.trim().toLowerCase());
  if (!header || header.length !== 1 || header[0] !== 'name') fail('CSV harus memiliki satu kolom dengan header name.');
  return rows.map(row => row.length === 1 ? row[0] : fail('CSV harus memiliki satu kolom name.'));
}
function normalizeName(entry) {
  const name = (typeof entry === 'string' ? entry : entry?.name)?.trim().replace(/\s+/g, ' ');
  if (!name || name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name) || /^[=+\-@]/.test(name)) fail('Nama tamu tidak valid.');
  return name;
}
function nameKey(name) { return name.normalize('NFKC').toLocaleLowerCase('id-ID'); }

if (command === 'generate') {
  if (!first) fail(`Pakai: node scripts/prepare-guests.mjs ${command} <daftar.csv|json> [base-url]`);
  const origin = second ? baseUrl(second) : '';
  const source = resolve(first);
  const raw = readFileSync(source, 'utf8').replace(/^\uFEFF/, '');
  const entries = source.toLowerCase().endsWith('.json') ? JSON.parse(raw) : parseCsv(raw);
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 10000) fail('Daftar tamu harus array berisi 1–10000 nama.');
  const seen = new Set();
  const usedCodes = new Set();
  const guests = [['Invitation ID', 'Full name', 'Guest code', 'Active']];
  const links = [['Invitation ID', 'Full name', 'Personal URL']];
  for (const [index, entry] of entries.entries()) {
    const name = normalizeName(entry);
    const key = nameKey(name);
    if (seen.has(key)) fail(`Nama duplikat: ${name}. Periksa daftar sebelum membuat tautan.`);
    seen.add(key);
    const id = String(index + 1);
    const code = freshCode(usedCodes);
    guests.push([id, name, code, 'TRUE']);
    links.push([id, name, `${origin}/invite/${id}-${code}`]);
  }
  const guestsFile = 'guests.csv';
  const linksFile = 'links.csv';
  if (existsSync(resolve(privateDir, guestsFile)) || existsSync(resolve(privateDir, linksFile))) fail('File hasil sudah ada; file privat tidak ditimpa.');
  save(guestsFile, csv(guests));
  save(linksFile, csv(links));
  console.log(`${entries.length} tautan pribadi dibuat. ${origin ? 'Simpan links.csv secara privat.' : 'URL masih relatif; jalankan finalize-links setelah domain ditentukan.'}`);
} else if (command === 'finalize-links') {
  if (!first || (second && second !== '--migrated')) fail('Pakai: node scripts/prepare-guests.mjs finalize-links <base-url> [--migrated]');
  const origin = baseUrl(first);
  const inputFile = second === '--migrated' ? 'links-4digit.csv' : 'links.csv';
  const outputFile = second === '--migrated' ? 'links-4digit-final.csv' : 'links-final.csv';
  const rows = parseCsvRows(readFileSync(resolve(privateDir, inputFile), 'utf8'));
  if (JSON.stringify(rows.shift()) !== JSON.stringify(['Invitation ID', 'Full name', 'Personal URL'])) fail('Header links.csv tidak valid.');
  const output = [['Invitation ID', 'Full name', 'Personal URL']];
  for (const row of rows) {
    if (row.length !== 3 || !/^[1-9]\d{0,9}$/.test(row[0]) || !new RegExp(`^/invite/${row[0]}-\\d{4}$`).test(row[2])) fail('Isi links.csv tidak valid atau sudah memakai domain.');
    output.push([row[0], row[1], origin + row[2]]);
  }
  save(outputFile, csv(output));
  console.log('URL final siap dibagikan setelah Sheet dan situs diuji live.');
} else if (command === 'reissue') {
  if (!first || !second || !/^[1-9]\d{0,9}$/.test(first)) fail('Pakai: node scripts/prepare-guests.mjs reissue <invitation-id> <base-url>');
  const origin = baseUrl(second);
  const linksFile = existsSync(resolve(privateDir, 'links-4digit.csv')) ? 'links-4digit.csv' : 'links.csv';
  const usedCodes = new Set([...readFileSync(resolve(privateDir, linksFile), 'utf8').matchAll(/\/invite\/[1-9]\d*-(\d{4})/g)].map(match => match[1]));
  for (const file of readdirSync(privateDir)) {
    if (/^new-guest-\d+\.json$/.test(file)) {
      const entry = JSON.parse(readFileSync(resolve(privateDir, file), 'utf8'));
      const match = /^\/invite\/[1-9]\d*-(\d{4})$/.exec(entry.personalPath || '');
      if (match) usedCodes.add(match[1]);
    } else if (/^reissue-\d+-[a-f0-9]{8}\.txt$/.test(file)) {
      const match = /New URL: https?:\/\/[^\s]+\/invite\/[1-9]\d*-(\d{4})/.exec(readFileSync(resolve(privateDir, file), 'utf8'));
      if (match) usedCodes.add(match[1]);
    }
  }
  const code = freshCode(usedCodes);
  save(`reissue-${first}-${randomBytes(4).toString('hex')}.txt`, `Invitation ID: ${first}\nNew guest code: ${code}\nNew URL: ${origin}/invite/${first}-${code}\n`);
  console.log('Ganti Guest code pada baris Guests yang sesuai; tautan lama langsung tidak berlaku.');
} else if (command === 'add-short') {
  if (!first || second) fail('Pakai: node scripts/prepare-guests.mjs add-short "Nama Tamu"');
  const name = normalizeName(first);
  const guests = parseCsvRows(readFileSync(resolve(privateDir, 'guests-4digit.csv'), 'utf8'));
  const links = parseCsvRows(readFileSync(resolve(privateDir, 'links-4digit.csv'), 'utf8'));
  if (JSON.stringify(guests.shift()) !== JSON.stringify(['Invitation ID', 'Full name', 'Guest code', 'Active'])
    || JSON.stringify(links.shift()) !== JSON.stringify(['Invitation ID', 'Full name', 'Personal URL'])
    || guests.length !== links.length || !guests.length) fail('Berkas 4 digit tidak cocok.');
  const usedNames = new Set();
  const usedCodes = new Set();
  for (const [index, guest] of guests.entries()) {
    const link = links[index];
    const match = /^\/invite\/([1-9]\d*)-(\d{4})$/.exec(link[2] || '');
    if (guest.length !== 4 || link.length !== 3 || guest[0] !== String(index + 1)
      || guest[0] !== link[0] || guest[1] !== link[1] || !match || match[1] !== guest[0])
      fail('Berkas 4 digit tidak cocok.');
    if (guest[2] !== match[2]) fail('Kode tamu tidak cocok dengan tautannya; penambahan dibatalkan.');
    usedNames.add(nameKey(guest[1]));
    usedCodes.add(match[2]);
  }
  let nextId = guests.length + 1;
  for (const file of readdirSync(privateDir)) {
    if (/^new-guest-\d+\.json$/.test(file)) {
      const previous = JSON.parse(readFileSync(resolve(privateDir, file), 'utf8'));
      const match = /^\/invite\/([1-9]\d*)-(\d{4})$/.exec(previous.personalPath || '');
      if (!match || Number(match[1]) !== previous.invitationId || !previous.fullName)
        fail(`${file} tidak valid; penambahan dibatalkan.`);
      nextId = Math.max(nextId, previous.invitationId + 1);
      usedNames.add(nameKey(previous.fullName));
      usedCodes.add(match[2]);
    } else if (/^reissue-\d+-[a-f0-9]{8}\.txt$/.test(file)) {
      const match = /New URL: https?:\/\/[^\s]+\/invite\/[1-9]\d*-(\d{4})/.exec(readFileSync(resolve(privateDir, file), 'utf8'));
      if (match) usedCodes.add(match[1]);
    }
  }
  if (usedNames.has(nameKey(name))) fail('Nama sudah ada di daftar tamu atau berkas penambahan.');
  const id = String(nextId);
  const code = freshCode(usedCodes);
  save(`new-guest-${id}.json`, JSON.stringify({ invitationId: nextId, fullName: name,
    guestCode: code, active: 'TRUE', personalPath: `/invite/${id}-${code}` }, null, 2) + '\n');
  console.log('Salin invitationId, fullName, guestCode, dan active ke satu baris baru di Guests. Simpan personalPath secara privat.');
} else fail('Pakai: node scripts/prepare-guests.mjs generate|finalize-links|reissue|add-short ...');
