import { readFileSync } from 'node:fs';

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/)
  .filter(line => /^[A-Z_]+=/.test(line)).map(line => {
    const index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
  }));
const url = env.GOOGLE_APPS_SCRIPT_URL;
const serviceToken = env.GOOGLE_APPS_SCRIPT_TOKEN;
if (!url || !serviceToken) throw new Error('Google Apps Script environment variables are missing');
const links = [...readFileSync('data/private/links.csv', 'utf8').matchAll(/\/invite\/([1-9]\d*)#([A-Za-z0-9_-]{43})/g)];
const names = JSON.parse(readFileSync('data/private/daftar_nama.json', 'utf8'));
if (links.length !== names.length || links.length === 0) throw new Error('Private links do not match guest list');
const request = async (link, invitationToken, action = 'guest', extra = {}) => {
  const response = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, serviceToken, invitationId: link[1], invitationToken, ...extra }),
    signal: AbortSignal.timeout(20000),
  });
  return response.json();
};
try {
  const sampleIndexes = [0, Math.floor(links.length / 2), links.length - 1];
  const valid = await Promise.all(sampleIndexes.map(index => request(links[index], links[index][2])));
  const invalid = await request(links[0], 'x'.repeat(43));
  const invalidRsvp = await request(links[0], links[0][2], 'rsvp', { attendance: 'invalid' });
  const invalidWish = await request(links[0], links[0][2], 'wish', { wishId: 'bad', message: 'invalid' });
  const wishesUrl = new URL(url);
  wishesUrl.searchParams.set('token', serviceToken);
  const wishesResponse = await fetch(wishesUrl, { signal: AbortSignal.timeout(20000) });
  const wishes = await wishesResponse.json();
  const result = {
    sampledInvitations: valid.every((result, sample) => result.ok === true && result.name === names[sampleIndexes[sample]].trim().replace(/\s+/g, ' ')),
    invalidTokenRejected: invalid.code === 'invalid_invitation' && !('name' in invalid),
    invalidWritesRejected: invalidRsvp.code === 'invalid_request' && invalidWish.code === 'invalid_request',
    wishesReadable: wishes.ok === true && Array.isArray(wishes.wishes),
  };
  console.log(JSON.stringify(result));
  if (Object.values(result).some(value => !value)) process.exitCode = 1;
} catch (cause) {
  console.error(`Live Sheet check failed: ${cause instanceof Error ? cause.name : 'Unknown error'}`);
  process.exitCode = 1;
}
