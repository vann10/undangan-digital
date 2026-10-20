import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

if (process.argv[2] !== '--confirm-test-write') throw new Error('Use --confirm-test-write for the synthetic guest only');
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/)
  .filter(line => /^[A-Z_]+=/.test(line)).map(line => {
    const index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
  }));
const url = env.GOOGLE_APPS_SCRIPT_URL;
const serviceToken = env.GOOGLE_APPS_SCRIPT_TOKEN;
if (!url || !serviceToken) throw new Error('Google Apps Script environment variables are missing');
const link = readFileSync('data/private/test-guest-link.txt', 'utf8').match(/^\/invite\/(194)#([A-Za-z0-9_-]{43})/);
if (!link) throw new Error('Synthetic guest link is missing or has an unexpected ID');
const identity = { invitationId: link[1], invitationToken: link[2] };
const call = async (action, data = {}) => {
  const response = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, serviceToken, ...identity, ...data }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Apps Script HTTP ${response.status}`);
  return response.json();
};

try {
  const guest = await call('guest');
  if (guest.ok !== true || guest.name !== 'Tamu Uji Backend'
    || (guest.attendance !== null && guest.attendance !== 'attending')) throw new Error('Synthetic guest was not verified');
  const firstRsvp = await call('rsvp', { attendance: 'attending' });
  if (!(firstRsvp.ok === true && firstRsvp.attendance === 'attending')
    && !(firstRsvp.code === 'already_submitted' && firstRsvp.attendance === 'attending')) throw new Error('RSVP was not confirmed');
  const competingRsvp = await call('rsvp', { attendance: 'not_attending' });
  if (competingRsvp.code !== 'already_submitted' || competingRsvp.attendance !== 'attending') throw new Error('Final RSVP rule failed');
  const idFile = 'data/private/test-wish-id.txt';
  if (!existsSync(idFile)) writeFileSync(idFile, randomUUID(), { flag: 'wx' });
  const wishId = readFileSync(idFile, 'utf8').trim();
  const message = 'Semoga hari bahagia Rizal dan Dewi berjalan lancar. (uji backend)';
  const firstWish = await call('wish', { wishId, message });
  if (firstWish.ok !== true) throw new Error('Wish was not confirmed');
  const duplicateWish = await call('wish', { wishId, message });
  if (duplicateWish.ok !== true || duplicateWish.duplicate !== true) throw new Error('Wish retry was not idempotent');
  const wishesUrl = new URL(url);
  wishesUrl.searchParams.set('token', serviceToken);
  const wishesResponse = await fetch(wishesUrl, { signal: AbortSignal.timeout(20000) });
  const wishes = await wishesResponse.json();
  if (wishes.ok !== true || !wishes.wishes.some(wish => wish.id === wishId && wish.name === 'Tamu Uji Backend' && wish.message === message)) throw new Error('Stored wish was not readable');
  console.log(JSON.stringify({ guestVerified: true, rsvpStored: true, competingRsvpRejected: true, wishStoredAndReadable: true, duplicateWishSafe: true }));
} catch (cause) {
  console.error(`Live write check failed: ${cause instanceof Error ? cause.message : 'Unknown error'}`);
  process.exitCode = 1;
}
