# Miftah's Portfolio

A bilingual (English / Indonesian) personal portfolio built with plain HTML, CSS, and JavaScript for GitHub Pages. There is no build step or package installation.

## Run locally

Serve the folder over HTTP with byte-range support so the video can seek correctly:

```sh
npx --yes http-server -p 8000 -a 127.0.0.1
```

Then open <http://localhost:8000/>. The server runs through `npx`; the site itself has no build step or project dependencies.

## Cinematic introduction

- `assets/portfolio-cinematic.mp4` is the supplied 1080p clip encoded as H.264 with 24 fps playback, AAC audio, fast-start metadata, and half-second keyframes for seeking. The scroll experience keeps it muted.
- `assets/portfolio-cinematic-poster.webp` is the clip's first frame and remains visible until a video frame is ready or if video loading fails.
- `cinematic.js` maps the cinematic section's scroll progress to `video.currentTime`. The media is requested near the hero, and reduced-motion, slow-connection, or data-saving settings use the static poster instead.

Keep both media URLs relative to the repository root for GitHub Pages project hosting. The supplied source master was left untouched; only the web delivery encode is stored in `assets/`.

## Featured projects

- **Fortnite — Drop In:** fan-made UI practice concept. [Live demo](https://temporary-rushing-crystal-jckbnf0.vercel.app/) · [Source](https://github.com/PuyiHakim/miftah-programming-journey/tree/feature/fortnite-homework-session-01)
- **Relay:** customer operations dashboard. [Live demo](https://tugas-seven-eta.vercel.app/dashboard) · [Source](https://github.com/PuyiHakim/tugas)
- **Logitech G Steering Wheel:** Unity driving project with Logitech G wheel, pedal, and shifter input. [Source](https://github.com/PuyiHakim/doneLAnjutanLogitechG-main)

## Details to fill in

See the `TODO` comments in `index.html` for information that was not supplied:

- Public email address for a mail link.
- Confirmed role or area of focus.
- Internship organization, role, dates, and responsibilities.
- CV/Resume PDF, if available.

The page uses only the provided name, Surabaya location, internship experience, work availability, project links, and the technologies already listed for those projects. No email address or CV is included yet.
