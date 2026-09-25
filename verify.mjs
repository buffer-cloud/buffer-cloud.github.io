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
 for(const [tag] of html.matchAll(/<img\b[^>]*>/g)){
  assert(/\balt="[^"]+"/.test(tag),`Image lacks descriptive alternative text in ${file}`);
 }
 for(const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)){
  assert(/\brel="[^"]*noopener/.test(tag),`New-tab link lacks opener protection in ${file}`);
 }
 assert(html.includes('class="skip" href="#main"'),`Missing keyboard skip link in ${file}`);
 assert(!/\/Users\/|localhost:|127\.0\.0\.1|password\s*=/i.test(html),`Private/local content in ${file}`);
}
assert.equal((contents['index.html'].match(/class="project-tile /g)||[]).length,4);
for(const [tile] of contents['index.html'].matchAll(/<a\b[^>]*class="project-tile [^"]*"[^>]*>/g)){
 assert(tile.includes('target="_blank"'),'Project card must open its own page in a new tab');
 assert(/href="projects\/[^"#]+\.html"/.test(tile),'Project card must link to a dedicated case study');
}
assert(!contents['index.html'].includes('case-body'),'Homepage still contains case studies');
assert(contents['projects/power-interfaces.html'].includes('simulated readings'));
assert(contents['projects/photoacoustic.html'].includes('ongoing research'));
assert(contents['projects/photoacoustic.html'].includes('No verified firmware source'));
for(const [file,html] of Object.entries(contents).filter(([f])=>f.startsWith('projects/'))){
 if(html.includes('class="code-snapshot"'))assert(html.includes('Read accessible code text'),`Code screenshot needs selectable text in ${file}`);
}
const network=contents['projects/networked-nodes.html'];
assert(/four ESP32/i.test(network)&&network.includes('W5500'),'Four ESP32/W5500 project missing');
assert(network.includes('four-node-upper.png')&&network.includes('four-node-lower.png'),'Both original four-panel dashboard views must remain visible');
assert(network.includes('not measured sensor signals'),'Generated-waveform evidence limit missing');
assert(!Object.values(contents).some(html=>/two[- ]node|2[- ]node/i.test(html)),'Obsolete two-node project content remains');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
assert(css.includes('prefers-reduced-motion:reduce')&&css.includes('animation:none!important'),'Motion must respect reduced-motion preferences');
assert(css.includes('color-scheme:light'),'Off-white/light theme missing');
assert.equal(files.length,6);
console.log('Verified six pages, four project links, assets, cross-page anchors, code snapshots and evidence labels.');
