import { readFileSync } from 'node:fs';

const base = process.argv[2] || 'http://127.0.0.1:3020';
const link = readFileSync('data/private/links.csv', 'utf8').match(/\/invite\/([1-9]\d*)#([A-Za-z0-9_-]{43})/);
if (!link) throw new Error('No private invitation link found');
const body = { invitationId: link[1], invitationToken: link[2] };
const post = async payload => {
  const response = await fetch(`${base}/api/invitation`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return { status: response.status, data: await response.json() };
};
const valid = await post(body);
const invalid = await post({ ...body, invitationToken: 'x'.repeat(43) });
const wishesResponse = await fetch(`${base}/api/wishes`);
const wishes = await wishesResponse.json();
const result = {
  validInvitation: valid.status === 200 && typeof valid.data.name === 'string',
  invalidTokenRejected: invalid.status === 404 && !('name' in invalid.data),
  wishesReadable: wishesResponse.ok && Array.isArray(wishes.wishes),
  statuses: [valid.status, invalid.status, wishesResponse.status],
};
console.log(JSON.stringify(result));
if (!result.validInvitation || !result.invalidTokenRejected || !result.wishesReadable) process.exitCode = 1;
