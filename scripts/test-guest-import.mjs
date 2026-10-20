import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const temp = mkdtempSync(resolve(tmpdir(), 'invitation-import-'));
const pendingTemp = mkdtempSync(resolve(tmpdir(), 'invitation-pending-'));
const script = resolve('scripts/prepare-guests.mjs');
try {
  writeFileSync(resolve(temp, 'guests.json'), JSON.stringify(['Tamu Pertama', 'Tamu Kedua']));
  execFileSync(process.execPath, [script, 'generate', resolve(temp, 'guests.json'), 'https://example.test'], { cwd: temp });
  const guests = readFileSync(resolve(temp, 'data/private/guests.csv'), 'utf8');
  const links = readFileSync(resolve(temp, 'data/private/links.csv'), 'utf8');
  const digest = guests.match(/"1","Tamu Pertama","([a-f0-9]{64})","TRUE"/)?.[1];
  const token = links.match(/\/invite\/1#([A-Za-z0-9_-]{43})/)?.[1];
  assert(digest && token);
  assert.equal(createHash('sha256').update(token).digest('hex'), digest);
  assert.throws(() => execFileSync(process.execPath, [script, 'generate', resolve(temp, 'guests.json'), 'https://example.test'], { cwd: temp, stdio: 'ignore' }));
  execFileSync(process.execPath, [script, 'reissue', '1', 'https://example.test'], { cwd: temp });
  const reissueFile = readdirSync(resolve(temp, 'data/private')).find(name => /^reissue-1-[a-f0-9]{8}\.txt$/.test(name));
  const reissue = readFileSync(resolve(temp, 'data/private', reissueFile), 'utf8');
  assert.match(reissue, /New URL: https:\/\/example\.test\/invite\/1#[A-Za-z0-9_-]{43}/);
  writeFileSync(resolve(pendingTemp, 'guests.json'), JSON.stringify(['Tamu Pertama']));
  execFileSync(process.execPath, [script, 'generate', resolve(pendingTemp, 'guests.json')], { cwd: pendingTemp });
  assert.match(readFileSync(resolve(pendingTemp, 'data/private/links.csv'), 'utf8'), /"\/invite\/1#[A-Za-z0-9_-]{43}"/);
  execFileSync(process.execPath, [script, 'finalize-links', 'https://example.test'], { cwd: pendingTemp });
  assert.match(readFileSync(resolve(pendingTemp, 'data/private/links-final.csv'), 'utf8'), /"https:\/\/example\.test\/invite\/1#[A-Za-z0-9_-]{43}"/);
  console.log('Guest import: PASS (private files, token hash, overwrite protection, reissue)');
} finally { rmSync(temp, { recursive: true, force: true }); rmSync(pendingTemp, { recursive: true, force: true }); }
