const fs=require('fs');
const css='app/globals.css';
let s=fs.readFileSync(css,'utf8');
s=s.split('\n').filter(line=>!line.includes('cover-top-canopy')&&!line.includes('cover-upper-left')&&!line.includes('cover-upper-right')).join('\n');
fs.writeFileSync(css,s);
const p='scripts/verify-prototype.mjs';
s=fs.readFileSync(p,'utf8').replaceAll('artifacts/border-cover','artifacts/full-frame').replaceAll('http://127.0.0.1:3004','http://127.0.0.1:3005');fs.writeFileSync(p,s);
