# JPEG XL decoder

Unmodified `codec/dec/jxl_dec.js`, `codec/dec/jxl_dec.wasm` and `LICENSE`
from **@jsquash/jxl 1.3.0**, licensed under Apache-2.0.

- Project: https://github.com/jamsinclair/jSquash
- Package: https://registry.npmjs.org/@jsquash/jxl/-/jxl-1.3.0.tgz

Only the single-threaded decoder is distributed. It is loaded from this app's
own origin on JXL import, without a CDN or runtime npm dependencies. The editor
converts its 8-bit RGBA output to PNG inside a disposable worker. Animation,
HDR and original color-profile/metadata preservation are not supported.
