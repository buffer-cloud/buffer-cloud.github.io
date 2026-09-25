# Content and image provenance

## Primary documents

- **IIT Hyderabad Internship Final Report.docx**, supplied by Amlesh Sahoo (PEEC Lab files). Original embedded images were extracted without alteration. The similarly named report in Downloads contains placeholders and was not used for site imagery.
- **Amlesh Swarup Sahoo Resume.pdf**, current supplied resume. Establishes the BITS Pilani–Iowa State dual-degree program, research and internship roles, professional contact, and LinkedIn link. A copy is linked on the site.
- **Pulsed LED PAT Project Flow and Phases.pdf**, supplied development plan. Establishes the proposed acquisition architecture; it does not establish completed system validation.

## Report assets

Locators refer to the extracted Word paragraph order, not rendered page numbers.

| Site asset | Original media | Report section / locator |
| --- | --- | --- |
| `power-bench.jpeg` | image1.jpeg | TFT display regulator, paragraph 32 |
| `pps-interface.png` | image10.png | PPS/PV system, paragraph 229 |
| `pps-graph.png` | image11.png | PPS/PV system, paragraph 229 |
| `four-node-upper.png` | image8.png | Four-device dashboard, upper panels, paragraph 157 |
| `four-node-lower.png` | image9.png | Same four-device dashboard, lower panels, paragraph 157 |
| `priority-messages.png` | image12.png | Priority messaging, paragraph 274 |

Hardware photographs and application screenshots remain faithful to the original report. Screenshots are documentation, not new independent measurements. No stock or AI-generated project photographs are used.

## Repository evidence

- [MCU-Datalogger](https://github.com/buffer-cloud/MCU-Datalogger/tree/pcb-reva-layout): hardware CAD, routing, verification, and fabrication artifacts. Board images are generated from that CAD/output, not illustrations of hypothetical hardware.
- [bluetooth_web_pv_pps](https://github.com/buffer-cloud/bluetooth_web_pv_pps), inspected at `446a9af38055577b6ffffd74f24c85f498628051`: Flutter interface implements BLE and WebSocket transport, telemetry parsing, graphs, and command messages. Public ESP32 firmware produces simulated telemetry and prints commands. No Wi-Fi credentials or source-code secrets are reproduced on this site.
- No dedicated public repository was found for the four-node experiments; those claims are grounded in the report rather than a fabricated repository link.

## Qualification of claims

- Photoacoustic acquisition is ongoing research. Gateway and host transfer are proposed; MCU selection and complete-system validation are not represented as finished.
- PPS/PV work is presented as interface/communications prototyping. It is not a claim of calibrated sensor accuracy, solar efficiency, or physical closed-loop control.
- Multi-node signals are mathematically generated sine waves. Concurrent connections are not proof of synchronized hardware clocks. The report records priority acceptance/rejection, but provides no validated latency benchmark.
- PCB electrical checks and fabrication exports are design evidence. Board assembly, firmware, and bench bring-up are separate and remain unverified.

## Code snapshot provenance

Snapshots render genuine source excerpts with file and line numbers; no IDE state or executed result is implied. Full text is retained alongside the image for accessibility.

- `assets/code/data-logger.png`: `MCU Datalogger.kicad_pcb`, lines 11350–11369, commit `81d5e552573d87ffdf10b55c19ad52d68e6a7219`. Actual B.Cu GND zone CAD; not firmware.
- `assets/code/power-interfaces.png`: `lib/pps_window.dart`, lines 230–235, commit `446a9af38055577b6ffffd74f24c85f498628051`. Bounded chart-history update; companion readings are simulated.
- `assets/code/four-node-connections.png`: exact four `WebSocketChannel.connect` statements from the report’s “Flutter UI Snapshot,” extracted paragraphs 135–138. Image numbering 1–4 denotes excerpt rows; the textual locator refers to extracted report paragraphs, not source-file line numbers. This is a report code excerpt, not a complete executable application. No public repository URL is invented.
- STM32H7: no verified firmware source was available; its proposed architecture is used instead.

## Four-device case study correction

The report explicitly specifies four ESP32 devices with W5500 Ethernet (paragraphs 117–124), four independent listeners (150–153), and four graph panels (131). Its two photographs show the upper and lower portions of that four-panel display and remain unaltered. The portfolio omits the earlier two-device development stage. The separate priority-messaging experiment also uses four ESP32 boards and four W5500 modules (234–235), configured as three senders and one receiver. “W5500” follows the report’s actual component name.
