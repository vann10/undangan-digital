import { createHash, randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';

const guestFile = 'data/private/test-guest.csv';
const linkFile = 'data/private/test-guest-link.txt';
if (existsSync(guestFile) || existsSync(linkFile)) throw new Error('Private test guest already exists; refusing to overwrite');
const token = randomBytes(32).toString('base64url');
const digest = createHash('sha256').update(token).digest('hex');
writeFileSync(guestFile, `"Invitation ID","Full name","Token SHA-256","Active"\r\n"194","Tamu Uji Backend","${digest}","TRUE"\r\n`, { flag: 'wx' });
writeFileSync(linkFile, `/invite/194#${token}\n`, { flag: 'wx' });
console.log('Test guest 194 prepared in data/private. Do not distribute its link.');
