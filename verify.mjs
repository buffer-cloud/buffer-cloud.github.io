import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const files=['index.html','about.html',...fs.readdirSync('dist/projects').filter(f=>f.endsWith('.html')).map(f=>'projects/'+f)];
const contents=Object.fromEntries(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
for(const [file,html] of Object.entries(contents)){
 assert(/<html\b[^>]*\blang="en"/.test(html),`Missing page language in ${file}`);
 assert.equal((html.match(/<main\b/g)||[]).length,1,`One main landmark required in ${file}`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`One primary heading required in ${file}`);
 assert(/<nav\b[^>]*aria-label="[^"]+"/.test(html),`Navigation needs a label in ${file}`);
 assert(/<title>[^<]+<\/title>/.test(html),`Missing title in ${file}`);
 const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
 const metas=[...html.matchAll(/<meta\b[^>]*>/g)].map(([tag])=>attrs(tag));
 const meta=name=>metas.find(m=>m.name===name||m.property===name)?.content;
 for(const name of ['description','og:title','og:description','og:image','og:url','twitter:card','twitter:title','twitter:description','twitter:image'])assert(meta(name)?.trim(),`Missing ${name} metadata in ${file}`);
 const links=[...html.matchAll(/<link\b[^>]*>/g)].map(([tag])=>attrs(tag));
 const canonical=links.find(l=>l.rel==='canonical')?.href;
 const expected='https://buffer-cloud.github.io/'+(file==='index.html'?'':file);
 assert.equal(canonical,expected,`Incorrect canonical URL in ${file}`);
 assert.equal(meta('og:url'),canonical,`Social URL differs from canonical in ${file}`);
 for(const rel of ['icon','apple-touch-icon'])assert(links.some(l=>l.rel?.split(/\s+/).includes(rel)),`Missing ${rel} in ${file}`);
 for(const field of ['og:image','twitter:image']){
  const url=new URL(meta(field));
  assert.equal(url.origin,'https://buffer-cloud.github.io',`Social image must use deployed absolute URL in ${file}`);
  assert(fs.existsSync(path.join(root,url.pathname)),`Missing social image in ${file}`);
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`Duplicate ids in ${file}`);
 for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:)/.test(url))continue;
  const [resource,hash]=url.split('#');
  const pathname=resource.split('?')[0];
  const target=pathname?path.resolve(root,path.dirname(file),pathname):path.join(root,file);
  assert(target.startsWith(root+path.sep),`Path outside output: ${url}`);
  assert(fs.existsSync(target),`Missing resource ${url} in ${file}`);
  if(hash)assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Broken anchor ${url} in ${file}`);
 }
 for(const [tag] of html.matchAll(/<img\b[^>]*>/g)){
  assert(/\balt="[^"]+"/.test(tag),`Image lacks descriptive alternative text in ${file}`);
  assert(/\bwidth="[1-9]\d*"/.test(tag)&&/\bheight="[1-9]\d*"/.test(tag),`Image needs intrinsic dimensions to prevent layout shifts in ${file}`);
 }
 for(const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)){
  assert(/\brel="[^"]*noopener/.test(tag),`New-tab link lacks opener protection in ${file}`);
  const href=tag.match(/\bhref="([^"]+)"/)?.[1]||'';
  assert(!/^(?!https?:)[^?#]*\.html(?:[?#]|$)/.test(href),`Internal HTML navigation must stay in the same tab in ${file}`);
 }
 assert(html.includes('class="skip" href="#main"'),`Missing keyboard skip link in ${file}`);
 assert(!/\/Users\/|localhost:|127\.0\.0\.1|password\s*=/i.test(html),`Private/local content in ${file}`);
}
assert.equal((contents['index.html'].match(/class="project-tile /g)||[]).length,5);
for(const [tile] of contents['index.html'].matchAll(/<a\b[^>]*class="project-tile [^"]*"[^>]*>/g)){
 assert(!/\btarget="_blank"/.test(tile),'Internal project cards must stay in the same tab');
 assert(/href="projects\/[^"#]+\.html"/.test(tile),'Project card must link to a dedicated case study');
}
assert(!contents['index.html'].includes('case-body'),'Homepage still contains case studies');
assert(contents['projects/power-interfaces.html'].includes('simulated readings'));
assert(contents['projects/photoacoustic.html'].includes('ongoing research'));
assert(contents['projects/photoacoustic.html'].includes('No verified firmware source'));
for(const [file,html] of Object.entries(contents).filter(([f])=>f.startsWith('projects/'))){
 if(html.includes('class="code-snapshot"'))assert(html.includes('<pre><code>'),`Code screenshot needs selectable text in ${file}`);
}
const network=contents['projects/networked-nodes.html'];
assert(/four ESP32/i.test(network)&&network.includes('W5500'),'Four ESP32/W5500 project missing');
assert(network.includes('four-node-upper.png')&&network.includes('four-node-lower.png'),'Both original four-panel dashboard views must remain visible');
assert(network.includes('not measured sensor signals'),'Generated-waveform evidence limit missing');
assert(!Object.values(contents).some(html=>/\b(?:two|2)[- ]node\b/i.test(html)),'Obsolete two-node project content remains');
const photodiode=contents['projects/photodiode-tia.html'];
assert(photodiode, 'Photodiode case study missing');
assert(/BPW34/.test(photodiode)&&/OPA2320/.test(photodiode),'Analog signal-chain details missing');
assert(/simulat/i.test(photodiode)&&/hardware characterization/i.test(photodiode)&&/not yet performed/i.test(photodiode),'Simulation and hardware-status distinction missing');
assert(/schematic/i.test(photodiode)&&/pcb-top|gerber/i.test(photodiode),'Required design visuals missing');
assert(photodiode.includes('github.com/buffer-cloud/Photodiode-TIA-ESP32'),'Engineering source link missing');
for(const name of fs.readdirSync(path.join(root,'assets/projects/photodiode-tia'))){
 assert(/\.(svg|png|webp|jpe?g)$/.test(name),`Unexpected source or temporary file in project assets: ${name}`);
 assert(fs.statSync(path.join(root,'assets/projects/photodiode-tia',name)).size<2_000_000,`Project asset needs optimization: ${name}`);
}
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
assert(/prefers-reduced-motion\s*:\s*reduce/.test(css),'Reduced-motion style support missing');
assert(/:focus-visible/.test(css),'Visible keyboard-focus styling missing');
assert(/color-scheme\s*:\s*light/.test(css),'Off-white/light theme missing');
assert.equal(files.length,7);
console.log('Verified seven pages, same-tab project navigation, metadata, landmarks, image dimensions, assets, anchors, code snapshots and evidence labels.');
