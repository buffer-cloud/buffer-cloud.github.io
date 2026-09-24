# Amlesh Sahoo — Engineering Portfolio

Live website: **https://buffer-cloud.github.io/**

A lightweight static portfolio with a four-project icon gallery, dedicated project pages, and a separate About/Experience page. Each project card opens its own page in a new tab. Project pages include an overview, original imagery, source-backed code snapshots where available, verification status, and source/download links.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run build
npm run lint
npm start
```

Open http://127.0.0.1:4173. Set `PORT` to change the preview port. The committed `dist/` directory is directly deployable and needs no client-side JavaScript.

## Edit and build

- `content.json`: project descriptions, evidence labels, code excerpts, image paths and source links.
- `build.mjs`: page templates, project icons, navigation, and static page generation.
- `dist/style.css`: responsive dark visual system.
- `dist/index.html`: generated project gallery homepage.
- `dist/projects/*.html`: generated dedicated project pages.
- `dist/about.html`: generated background, experience and technical practice page.
- `dist/assets/`: original report imagery, resume, PCB outputs and rendered code snapshots.
- `SOURCES.md`: evidence provenance and limitations.

Edit the templates/data, then run `npm run build && npm run lint`. Verification covers all six pages, relative asset links, cross-page anchors, duplicate IDs, and evidence qualifications. Generated HTML is committed so the website remains readable without a framework or JavaScript.

Code snapshots are faithful formatted excerpts, with source filenames/line numbers and original-source links where available. Each PNG also has accessible selectable code text on its project page. Original report screenshots remain unchanged. No verified STM32 firmware was available, so that page uses an explicitly proposed architecture instead of a fabricated code image.

## Deploy

Push to `main` in `buffer-cloud/buffer-cloud.github.io`. `.github/workflows/pages.yml` builds, verifies, and publishes `dist/` through GitHub Actions. No additional secrets or dependencies are required. GitHub Pages source is configured as GitHub Actions.

For another static host, use `npm run build` and output directory `dist`. All page and asset links are relative.

## Accessibility

Single native link per project tile, decorative SVG icons, visible keyboard focus, skip links, descriptive image alternatives, selectable code text, and reduced-motion support. Desktop gallery uses two columns; mobile uses one. Project pages provide All Projects and Next Project navigation. Card labels disclose opening in a new tab.

## Evidence boundaries

Report images come from Amlesh's IIT Hyderabad final report. STM32 research is ongoing and its architecture is proposed. The public PPS firmware generates simulated readings. Multi-node sine waves are generated data, not measured signals or proof of hardware synchronization. No physical hardware tests are invented.

## MCU Data Logger Rev A

- `dist/assets/board-render.png`: actual KiCad render.
- `dist/assets/gerber-view.png`: top/bottom composite from exported Gerber and drill geometry.
- `dist/assets/MCU-Datalogger-RevA.zip`: fabrication layers, separate drill files, maps, notes and checksums.

KiCad 9 reports **0 DRC violations, 0 unconnected pads, 0 footprint/parity errors; schematic ERC 0 errors and 0 warnings**. The board has 29 footprints, 426 segments, 39 vias and a filled B.Cu GND zone.

Finished CAD is on [pcb-reva-layout](https://github.com/buffer-cloud/MCU-Datalogger/tree/pcb-reva-layout), commit `81d5e552573d87ffdf10b55c19ad52d68e6a7219`. Firmware, assembly and physical bring-up remain unverified.
