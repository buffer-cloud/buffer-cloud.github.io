import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { renderHome, renderIcon } from './home-refinement.mjs';
import { renderDetail } from './detail-refinement.mjs';
const data = JSON.parse(fs.readFileSync(new URL('./content.json',import.meta.url),'utf8'));
const root = new URL('./dist/',import.meta.url);
const version = name => createHash('sha256').update(fs.readFileSync(new URL(name,root))).digest('hex').slice(0,10);
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const dimensions = JSON.parse(fs.readFileSync(new URL('./asset-dimensions.json',import.meta.url),'utf8'));
const imageSize = name => `width="${dimensions[name][0]}" height="${dimensions[name][1]}"`;
const icon = renderIcon;
const siteTitle = 'Amlesh Sahoo — Electrical & Embedded Systems Engineer';
const siteDescription = 'Electrical engineering portfolio focused on embedded systems, PCB design, firmware, networking, and data acquisition.';
const origin = 'https://buffer-cloud.github.io/';
const header=(prefix='',path='')=>`<a class="skip" href="#main">Skip to content</a><header><a class="wordmark" href="${prefix}index.html" aria-label="Amlesh Sahoo home">AS<span> / </span>AMLESH SAHOO</a><nav aria-label="Main navigation"><a href="${prefix}index.html#work"${path.startsWith('projects/')?' aria-current="location"':''}>Projects</a><a href="${prefix}about.html"${path==='about.html'?' aria-current="page"':''}>About</a><a href="${prefix}assets/Amlesh-Sahoo-Resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a><a href="${prefix}index.html#contact">Contact</a></nav></header>`;
const footer=(prefix='')=>`<footer><span>© 2026 Amlesh Sahoo</span><div class="footer-links"><a href="https://github.com/buffer-cloud" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/amlesh-swarup-sahoo-aab98a362" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${prefix}assets/Amlesh-Sahoo-Resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a></div><button class="motion-toggle" type="button" aria-pressed="false" hidden>Pause animation</button></footer>`;
const shell=(title,body,prefix='',path='',description=siteDescription)=>{
 const fullTitle = path ? `${title} — Amlesh Sahoo` : siteTitle;
 const canonical = origin+path;
 return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f5f3ec"><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}"><title>${esc(fullTitle)}</title>
<link rel="icon" type="image/svg+xml" href="${prefix}assets/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Amlesh Sahoo">
<meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}assets/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Amlesh Sahoo — From circuit. To system. Electrical and embedded systems portfolio.">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}assets/social-card.png"><meta name="twitter:image:alt" content="Amlesh Sahoo — From circuit. To system.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}style.css?v=${version('style.css')}">
${path.startsWith('projects/')?`<link rel="stylesheet" href="${prefix}detail-refinement.css?v=${version('detail-refinement.css')}">`:!path?`<link rel="stylesheet" href="home-refinement.css?v=${version('home-refinement.css')}">`:''}
</head><body>${header(prefix,path)}<main id="main" tabindex="-1">${body}</main>${footer(prefix)}<script src="${prefix}motion.js?v=${version('motion.js')}" defer></script>${path.startsWith('projects/')?`<script src="${prefix}detail-refinement.js?v=${version('detail-refinement.js')}" defer></script>`:''}</body></html>`;
};
fs.writeFileSync(new URL('index.html',root),shell('Engineering Portfolio',renderHome(data,{esc,imageSize})));
fs.mkdirSync(new URL('projects/',root),{recursive:true});
for(const [index,p] of data.projects.entries()){
 const next=data.projects[(index+1)%data.projects.length];
 const body=renderDetail(p,{esc,imageSize,icon,next});
 fs.writeFileSync(new URL(`projects/${p.id}.html`,root),shell(p.title,body,'../',`projects/${p.id}.html`,p.intro));
}
const technicalGroups = [
 ['Embedded','STM32H7 · ESP32 · ATmega328P'],
 ['Firmware','C · C++ · Embedded C'],
 ['Interfaces','SPI · I²C · UART · BLE · Ethernet · WebSockets'],
 ['Hardware','KiCad · LTspice · PCB layout · Bench prototyping'],
 ['Acquisition','ADC · DMA · Timers · Data acquisition'],
 ['Visualization','Flutter · Dart · TFT displays · Touch interfaces']
];
const about=`<div class="about-page"><a class="back-link" href="index.html">← Home</a><section class="about-intro"><div class="eyebrow">BACKGROUND / EXPERIENCE</div><h1>Curious about the<br><em>whole system.</em></h1><p class="project-lede">I’m Amlesh Sahoo, an Electrical Engineering student in the BITS Pilani–Iowa State University dual-degree program, based in Ames, Iowa.</p><p class="about-description">I work across embedded systems, PCB design, data acquisition, and hardware–software integration—from microcontroller interfaces to the applications that make their data usable.</p></section>
<section class="about-section education"><h2>Education</h2><div class="experience-row"><span class="date">2024 — 2028</span><div><h3>BITS Pilani–Iowa State University</h3><p>2+2 dual-degree program</p></div><p>B.E. Electronics and Communication Engineering<br>B.S. Electrical Engineering</p></div></section>
<section class="about-section about-experience"><h2>Research experience</h2><div class="experience-row"><span class="date">2026 — PRESENT</span><div><h3>Iowa State University</h3><p>Undergraduate Research Intern</p></div><p>Developing an STM32H7 acquisition architecture for pulsed-LED photoacoustic tomography, focusing on ADC timing and DMA-to-memory buffering.<br><span class="adviser">Prof. Manojit Pramanik</span></p></div></section>
<section class="about-section about-experience"><h2>IIT Hyderabad</h2><div class="experience-row"><span class="date">JUN — JUL 2025</span><div><h3>Summer Research Intern</h3><p>Embedded systems & interfaces</p></div><p>Built ESP32 display and Flutter monitoring prototypes, including four-node W5500 Ethernet visualization and power-system interfaces.<br><span class="adviser">Prof. Rupesh Wandhere</span></p></div></section>
<section class="about-section"><h2>Technical focus</h2><div class="technical-groups">${technicalGroups.map(([title,items])=>`<div class="stack-row"><h3>${title}</h3><p>${items}</p></div>`).join('')}</div></section>
<section class="about-section resume-section"><h2>Resume</h2><p>A concise overview of my education, research, and engineering work.</p><a class="text-link" href="assets/Amlesh-Sahoo-Resume.pdf" target="_blank" rel="noopener noreferrer">Read my resume <span>↗</span></a></section></div>`;
fs.writeFileSync(new URL('about.html',root),shell('About & Experience',about,'','about.html','Electrical Engineering student in the BITS Pilani–Iowa State dual-degree program. Research, IIT Hyderabad internship experience, and embedded systems technical focus.'));
console.log(`Built homepage, about page, and ${data.projects.length} dedicated project pages.`);
