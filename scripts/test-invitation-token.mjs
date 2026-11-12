import assert from 'node:assert/strict';
import { normalizeInvitationToken } from '../app/invitation-token.ts';

for (let code = 1; code <= 9999; code++) {
  const padded = String(code).padStart(4, '0');
  assert.equal(normalizeInvitationToken(String(code)), padded);
  assert.equal(normalizeInvitationToken(padded), padded);
}
// Preserve previously generated codes and legacy hash links.
assert.equal(normalizeInvitationToken('0000'), '0000');
assert.equal(normalizeInvitationToken('a_-'.repeat(14) + 'b'), 'a_-'.repeat(14) + 'b');
for (const value of [undefined, null, 42, '', '10000', '00042', '-1', '+1', '1.5', ' 42', '42 ', '42\n', '12ab', 'a'.repeat(42), 'a'.repeat(44)]) {
  assert.equal(normalizeInvitationToken(value), null, JSON.stringify(value));
}
console.log('Invitation tokens: PASS (all codes 1-9999, padded links, legacy tokens, malformed input)');
