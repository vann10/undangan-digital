import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const lines = path => readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1);
const guests = lines('data/private/guests.csv');
const links = lines('data/private/links.csv');
let valid = guests.length === links.length && guests.length > 0;
for (let index = 0; index < guests.length; index++) {
  const id = String(index + 1);
  const digest = guests[index].match(/,"([a-f0-9]{64})","TRUE"$/)?.[1];
  const match = links[index].match(/,"\/invite\/([1-9]\d*)#([A-Za-z0-9_-]{43})"$/);
  if (!digest || !match || match[1] !== id || createHash('sha256').update(match[2]).digest('hex') !== digest) valid = false;
}
console.log(JSON.stringify({ guests: guests.length, links: links.length, tokenHashesMatch: valid }));
if (!valid) process.exitCode = 1;
