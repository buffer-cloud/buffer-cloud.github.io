import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const files=['index.html','about.html',...fs.readdirSync('dist/projects').filter(f=>f.endsWith('.html')).map(f=>'projects/'+f)];
const contents=Object.fromEntries(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
for(const [file,html] of Object.entries(contents)){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`Duplicate ids in ${file}`);
 for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:)/.test(url))continue;
  const [pathname,hash]=url.split('#');
  const target=pathname?path.resolve(root,path.dirname(file),pathname):path.join(root,file);
  assert(target.startsWith(root+path.sep),`Path outside output: ${url}`);
  assert(fs.existsSync(target),`Missing resource ${url} in ${file}`);
  if(hash)assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Broken anchor ${url} in ${file}`);
 }
 assert(!/\/Users\/|localhost:|127\.0\.0\.1|password\s*=/i.test(html),`Private/local content in ${file}`);
}
assert.equal((contents['index.html'].match(/class="project-tile /g)||[]).length,4);
assert(!contents['index.html'].includes('case-body'),'Homepage still contains case studies');
assert(contents['projects/power-interfaces.html'].includes('simulated readings'));
assert(contents['projects/photoacoustic.html'].includes('ongoing research'));
assert(contents['projects/photoacoustic.html'].includes('No verified firmware source'));
assert.equal(files.length,6);
console.log('Verified six pages, four project links, assets, cross-page anchors, code snapshots and evidence labels.');
