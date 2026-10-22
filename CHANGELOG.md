# Changelog

## [1.5.1]

- Keep the highest source resolution with the same aspect ratio for every preset and custom size. A 2560 × 1440 background now stays 1440p instead of being reduced to 1080p.
- Keep intermediate resolutions when cropping or zooming, without enlarging the source.

## [1.5.0]

- Open JPEG XL (.jxl) images, including downloads from Videoland. Choose a file or drop it into the editor, then export as PNG or JPEG.
- JXL decoding runs on your own device. Transparency and the original image dimensions are kept.
- Added automatic tests, builds and releases through GitHub Actions.
- Keep preset buttons readable on narrow tablet screens.

## [1.4.1]

- Keep the highest source resolution supported by the crop for every artwork type, including custom sizes.
