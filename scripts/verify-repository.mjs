import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(join(root, file), 'utf8');
function files(directory) {
  return readdirSync(join(root, directory), {withFileTypes:true}).flatMap(entry => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
const errors = [];
let assetReferences = 0;
for (const file of [...files('app'), 'transition.config.js']) {
  if (!/\.(?:tsx?|css|js)$/.test(file)) continue;
  for (const match of read(file).matchAll(/\/(?:artwork|chapter-art|transition|audio)\/[\w./@-]+\.(?:webp|svg|mp3|png|gif)/g)) {
    assetReferences++;
    if (!existsSync(join(root, 'public', match[0]))) errors.push(`${file}: missing asset ${match[0]}`);
  }
}
let documentationLinks = 0;
for (const file of ['README.md','CONTRIBUTING.md','assets/README.md','scripts/README.md', ...files('docs').filter(file => !file.split(/[\\/]/).includes('archive') && file.endsWith('.md'))]) {
  for (const [, href] of read(file).matchAll(/\]\(([^\s)]+)\)/g)) {
    if (/^(?:[a-z]+:|\/|#)/i.test(href)) continue;
    documentationLinks++;
    if (!existsSync(resolve(root, dirname(file), decodeURI(href.split('#')[0])))) errors.push(`${file}: broken link ${href}`);
  }
}
for (const file of files('public')) {
  if (/\.png$/.test(file)) errors.push(`${file}: keep PNG sources in assets/, publish WebP`);
}
const ignoredPaths = ['.local/probe', 'artifacts/probe', 'assets/build/probe', 'assets/master/probe', 'data/private/probe', '.env.local', 'test-results/probe'];
const ignored = execFileSync('git', ['check-ignore', '--no-index', ...ignoredPaths], {cwd:root,encoding:'utf8'}).trim().split(/\r?\n/);
for (const file of ignoredPaths) if (!ignored.includes(file)) errors.push(`${file}: must be ignored`);
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`PASS: ${assetReferences} static asset references, ${documentationLinks} documentation links, WebP policy, and ignore rules. Dynamic asset URLs must also be checked in the browser.`);
