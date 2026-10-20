import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
function tokenPair() {
  const token = randomBytes(32).toString('base64url');
  return { token, digest: createHash('sha256').update(token).digest('hex') };
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

if (command === 'generate') {
  if (!first) fail('Pakai: node scripts/prepare-guests.mjs generate <daftar.csv|json> [base-url]');
  const origin = second ? baseUrl(second) : '';
  const source = resolve(first);
  const raw = readFileSync(source, 'utf8').replace(/^\uFEFF/, '');
  const entries = source.toLowerCase().endsWith('.json') ? JSON.parse(raw) : parseCsv(raw);
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 100000) fail('Daftar tamu harus array berisi 1–100000 nama.');
  const seen = new Set();
  const guests = [['Invitation ID', 'Full name', 'Token SHA-256', 'Active']];
  const links = [['Invitation ID', 'Full name', 'Personal URL']];
  for (const [index, entry] of entries.entries()) {
    const name = (typeof entry === 'string' ? entry : entry?.name)?.trim().replace(/\s+/g, ' ');
    if (!name || name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name) || /^[=+\-@]/.test(name)) fail(`Nama pada baris ${index + 1} tidak valid.`);
    const key = name.normalize('NFKC').toLocaleLowerCase('id-ID');
    if (seen.has(key)) fail(`Nama duplikat: ${name}. Periksa daftar sebelum membuat tautan.`);
    seen.add(key);
    const id = String(index + 1);
    const { token, digest } = tokenPair();
    guests.push([id, name, digest, 'TRUE']);
    links.push([id, name, `${origin}/invite/${id}#${token}`]);
  }
  if (existsSync(resolve(privateDir, 'guests.csv')) || existsSync(resolve(privateDir, 'links.csv'))) fail('File guests.csv atau links.csv sudah ada; file privat tidak ditimpa.');
  save('guests.csv', csv(guests));
  save('links.csv', csv(links));
  console.log(`${entries.length} tautan pribadi dibuat. ${origin ? 'Simpan links.csv secara privat.' : 'URL masih relatif; jalankan finalize-links setelah domain ditentukan.'}`);
} else if (command === 'finalize-links') {
  if (!first || second) fail('Pakai: node scripts/prepare-guests.mjs finalize-links <base-url>');
  const origin = baseUrl(first);
  const rows = parseCsvRows(readFileSync(resolve(privateDir, 'links.csv'), 'utf8'));
  if (JSON.stringify(rows.shift()) !== JSON.stringify(['Invitation ID', 'Full name', 'Personal URL'])) fail('Header links.csv tidak valid.');
  const output = [['Invitation ID', 'Full name', 'Personal URL']];
  for (const row of rows) {
    if (row.length !== 3 || !/^[1-9]\d{0,9}$/.test(row[0]) || !new RegExp(`^/invite/${row[0]}#[A-Za-z0-9_-]{43}$`).test(row[2])) fail('Isi links.csv tidak valid atau sudah memakai domain.');
    output.push([row[0], row[1], origin + row[2]]);
  }
  save('links-final.csv', csv(output));
  console.log('URL final siap dibagikan setelah Sheet dan situs diuji live.');
} else if (command === 'reissue') {
  if (!first || !second || !/^[1-9]\d{0,9}$/.test(first)) fail('Pakai: node scripts/prepare-guests.mjs reissue <invitation-id> <base-url>');
  const origin = baseUrl(second);
  const { token, digest } = tokenPair();
  save(`reissue-${first}-${randomBytes(4).toString('hex')}.txt`, `Invitation ID: ${first}\nNew Token SHA-256: ${digest}\nNew URL: ${origin}/invite/${first}#${token}\n`);
  console.log('Ganti hash pada baris Guests yang sesuai; tautan lama langsung tidak berlaku.');
} else fail('Pakai: node scripts/prepare-guests.mjs generate|finalize-links|reissue ...');
