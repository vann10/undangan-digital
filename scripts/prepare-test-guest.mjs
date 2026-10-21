import { randomInt } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const guestFile = 'data/private/test-guest.csv';
const linkFile = 'data/private/test-guest-link.txt';
if (existsSync(guestFile) || existsSync(linkFile)) throw new Error('Private test guest already exists; refusing to overwrite');
const used = new Set([...readFileSync('data/private/links-4digit.csv', 'utf8').matchAll(/\/invite\/[1-9]\d*-(\d{4})/g)].map(match => match[1]));
let code;
do { code = String(randomInt(10000)).padStart(4, '0'); } while (used.has(code));
writeFileSync(guestFile, `"Invitation ID","Full name","Guest code","Active"\r\n"194","Tamu Uji Backend","${code}","TRUE"\r\n`, { flag: 'wx' });
writeFileSync(linkFile, `/invite/194-${code}\n`, { flag: 'wx' });
console.log('Test guest 194 prepared in data/private. Do not distribute its link.');
