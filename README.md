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
- Season label with automatic placement in a low-detail area, sampled colors for contrast, and manual position, color, and type controls.
- Transparent PNG is required for ClearLogo and ClearArt presets; JPEG is disabled for those types.
- Source-resolution checks, TheTVDB's 10 MB upload-size guidance, and links to the official artwork rules.
- Image processing happens in the browser. Images are not sent to this app or stored by it.

## Image quality

PNG encoding preserves the exported pixels without additional compression loss. JPEG encoding is lossy. Cropping discards pixels outside the frame, and resizing resamples pixels; neither can guarantee that no image detail changes. The editor does not silently upscale an undersized source, and export is blocked when the source does not meet the selected preset's minimum dimensions.

The season-label placement is a visual heuristic that samples quieter corners and chooses a contrasting badge color. Review the result manually. A season label by itself does not make a poster season-specific.

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
