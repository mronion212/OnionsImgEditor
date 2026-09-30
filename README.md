# Onion's Img Editor

A local-first image editor for preparing artwork for TheTVDB. Pick a format preset, crop and position the image, check source requirements, optionally add a season label, then export PNG or JPEG.

## Run with Docker Compose

Requires Docker Engine with the Docker Compose plugin.

~~~sh
docker compose up -d --build
~~~

Open localhost on port 8080. To use a different host port, set PORT before starting Compose:

~~~sh
PORT=8090 docker compose up -d --build
~~~

For a VPS, put a reverse proxy with HTTPS in front of the container. The default port is 8080; change it with PORT if needed.

Stop the app with:

~~~sh
docker compose down
~~~

### Updating an editor in a shared VPS Compose project

Use the complete existing project configuration and explicitly disable orphan removal. An environment setting such as `COMPOSE_REMOVE_ORPHANS=true` can otherwise remove sibling containers when Compose is run with only the editor's standalone file. Target only the editor service and use `--no-deps` to avoid restarting its neighbors. For this VPS installation:

~~~sh
sudo env COMPOSE_REMOVE_ORPHANS=false docker compose \
  --env-file /opt/docker/.env -f /opt/docker/compose.yaml \
  --profile all up -d --build --no-deps onionsimgeditor
~~~

## Run locally without Docker

Requires Node.js 20 or newer. No packages need to be installed.

~~~sh
npm run dev
~~~

Open localhost on port 4173. To create a static build in the dist folder:

~~~sh
npm run build
~~~

## Features

- English by default, with a language selector for Dutch.
- TheTVDB presets for posters, season posters, backgrounds, ClearLogos, banners, icons, ClearArt, and HD or SD episode images.
- Drag, keyboard, nudge buttons, zoom, and clear center-alignment feedback.
- Season label with automatic placement in a quiet lower or upper area, sampled colors for contrast, free drag positioning, transparent background, and manual color and type controls.
- Transparent PNG is required for ClearLogo and ClearArt presets; JPEG is disabled for those types.
- ClearLogo fitting and centering use the exact bounds of non-transparent source pixels, including disconnected accents. Fit & center fills the 780 × 290 px safe area proportionally when the source is large enough. Zooming and dragging keep the visible logo and optional outline inside the 10 px gutter.
- Optional 1–4 px contour outlines for transparent artwork: automatic light/dark, black, white, or a double white-and-black outline. The double option adds the chosen width for each ring. Preview and export use the same renderer; letter holes retain transparency unless the selected outline fills a narrow gap.
- Checkerboard, white, and black test backgrounds affect the preview only. PNG exports stay transparent. Use the double outline to help contrast on both light and dark backgrounds and inspect the result at the intended display size.
- Source-resolution checks, an explicit local resize option for undersized artwork, TheTVDB's 10 MB upload-size guidance, and links to the official artwork rules.
- Image processing happens in the browser. Images are not sent to this app or stored by it.

## Image quality

PNG encoding preserves the exported pixels without additional compression loss. JPEG encoding is lossy. Cropping discards pixels outside the frame, and resizing resamples pixels; neither can guarantee that no image detail changes. An undersized source blocks export by default. You can explicitly allow browser-based resizing to the chosen canvas size; this is standard interpolation, not AI restoration. It cannot recover missing detail. TheTVDB's general artwork guidelines prohibit upscaling, so use a resized export for other destinations or drafts rather than uploading it there. Images still remain in the browser.

The season-label placement is a visual heuristic that samples quieter corners and chooses a contrasting badge color. Review the result manually. A season label by itself does not make a poster season-specific.

## Browser verification

With the local server running, run `npm run test:browser` with Playwright available (installed locally or supplied through `NODE_PATH`) and Microsoft Edge installed. The checks exercise exact alpha bounds, asymmetric padding, thin isolated pixels, proportional fitting, zoom/drag constraints, outline colors and widths, exported PNG transparency and safe margins, source-size checks, Dutch controls, and mobile layout.

## TheTVDB references

Preset sizes and guidance are based on TheTVDB Support Center:

- [General artwork guidelines](https://support.thetvdb.com/kb/faq.php?cid=1)
- [Posters](https://support.thetvdb.com/kb/faq.php?id=8)
- [Season artwork](https://support.thetvdb.com/kb/faq.php?id=58)
- [Backgrounds](https://support.thetvdb.com/kb/faq.php?id=10)
- [Banners](https://support.thetvdb.com/kb/faq.php?id=11)
- [Icons](https://support.thetvdb.com/kb/faq.php?id=12)
- [ClearArt](https://support.thetvdb.com/kb/faq.php?id=95)
- [ClearLogos](https://support.thetvdb.com/kb/faq.php?id=96)
- [Episode images](https://support.thetvdb.com/kb/faq.php?id=6)
- [Image upload limits](https://support.thetvdb.com/kb/faq.php?id=106)

TheTVDB can update its policies. Check the linked rules before uploading; matching dimensions alone does not guarantee acceptance.
