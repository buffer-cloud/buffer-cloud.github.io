# Amlesh Sahoo — Engineering Portfolio

Live website: **https://buffer-cloud.github.io/**

A lightweight, responsive engineering portfolio built with semantic HTML, custom CSS, and small progressive-enhancement JavaScript. Four expandable case studies connect original project evidence to specific engineering contributions.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run build
npm run lint
npm start
```

Open http://127.0.0.1:4173. Set `PORT` to change the preview port. The committed `dist/` directory is also directly deployable; it contains all page content, so navigation and case studies work without JavaScript.

## Edit

- `content.json`: project descriptions, evidence/status labels, image paths, repository links.
- `build.mjs`: renders project data and biography sections into static HTML.
- `dist/index.html`: page shell, hero, navigation, metadata.
- `dist/style.css`: responsive layout, visual system, supported-browser scroll animations.
- `dist/app.js`: deep-linked case studies and optional view tracking.
- `dist/assets/`: original report images, resume, and PCB-generated deliverables.
- `SOURCES.md`: source provenance and limits of the available evidence.

After edits, run `npm run build && npm run lint`. Image links are checked along with document anchors, duplicate IDs, JavaScript syntax, and required project-status qualifications.

## Deploy

The public website is hosted on **GitHub Pages**. Push changes to `main` in `buffer-cloud/buffer-cloud.github.io`; `.github/workflows/pages.yml` builds and verifies the site, then publishes `dist/`. Repository Settings → Pages uses GitHub Actions as its source. No extra secrets or dependencies are required.

For another static host, use `npm run build` as the build command and `dist` as the output directory. Relative asset links support subdirectory hosting.

This repository does not contain deployment credentials. GitHub Actions receives only the permissions required to publish Pages.

## Design and accessibility

Dark canvas, restrained lime accent, large engineering visuals, thin separators, and minimal navigation. Desktop project images use modest scroll-linked scale/translation where supported. Mobile uses ordinary document flow. Reduced-motion preferences disable animations and smooth scrolling; unsupported engines receive a static fallback. Native `details` elements keep case studies keyboard accessible, with visible focus and a skip link.

The layout borrows the broad idea of full-height visual sections from TJ Watson and project-first structure from Jacob Schwartz. No proprietary source code or assets from those sites are included.

## Evidence boundaries

Report photographs and screenshots come from Amlesh's IIT Hyderabad final report. Research architecture is labeled as proposed. The public PPS firmware generates simulated readings; it is not evidence of calibrated regulator measurements or closed-loop power control. Multi-node sine waves are generated test data, not measured sensor signals or proof of hardware synchronization.

PCB design verification and fabrication outputs are documented in the MCU-Datalogger repository. Electrical rule checks do not establish assembled hardware performance. No physical bring-up, sensing accuracy, or hardware testing is invented.

## MCU Data Logger Rev A deliverables

- `dist/assets/board-render.png`: final KiCad board render.
- `dist/assets/gerber-view.png`: top/bottom composite from actual Gerber and drill geometry.
- `dist/assets/MCU-Datalogger-RevA.zip`: fabrication layers, plated/non-plated drill files, drill maps, manufacturing notes and checksums.

Final KiCad 9 checks: **0 DRC violations, 0 unconnected pads, 0 footprint/parity errors; schematic ERC 0 errors and 0 warnings**. The board has 29 footprints, 426 track segments, 39 vias, and a filled B.Cu GND zone. Board SHA-256: `32f1db545f157f0b93e7d78371c2de28a021b1edc808a5e332d3afcea9e4f804`.

The finished design remains on `pcb-reva-layout` in [buffer-cloud/MCU-Datalogger](https://github.com/buffer-cloud/MCU-Datalogger/tree/pcb-reva-layout); it is not merged into main. Firmware, assembly and physical bring-up remain unverified.
