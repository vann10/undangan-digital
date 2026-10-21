import { readFileSync } from 'node:fs';

const lines = path => readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1);
const guests = lines('data/private/guests.csv');
const links = lines('data/private/links.csv');
let valid = guests.length === links.length && guests.length > 0;
for (let index = 0; index < guests.length; index++) {
  const id = String(index + 1);
  const code = guests[index].match(/,"(\d{4})","TRUE"$/)?.[1];
  const match = links[index].match(/,"\/invite\/([1-9]\d*)-(\d{4})"$/);
  if (!code || !match || match[1] !== id || match[2] !== code) valid = false;
}
console.log(JSON.stringify({ guests: guests.length, links: links.length, guestCodesMatch: valid }));
if (!valid) process.exitCode = 1;
