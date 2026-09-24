import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync('dist/index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate document ids');
for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(url.startsWith('#'))assert(ids.includes(url.slice(1)),`Broken anchor ${url}`);
  else if(!/^(https?:|mailto:)/.test(url))assert(fs.existsSync(`dist/${url}`),`Missing local resource ${url}`);
}
assert.equal((html.match(/<article class="project"/g)||[]).length,4);
assert.equal((html.match(/<details /g)||[]).length,4);
assert(html.includes('simulated readings'),'Simulation qualification is missing');
assert(html.includes('ongoing research'),'Research status is missing');
assert(!/password\s*=|api[_-]?key\s*=/i.test(html),'Possible secret in document');
console.log('Verified local assets, anchors, four static case studies, and factual status labels.');
