# Local OCR runtime

Pinned assets, loaded only after a screenshot is selected in Register import:

- Tesseract.js 6.0.1: `tesseract.min.js`, `worker.min.js` (Apache-2.0, TESSERACT-JS-LICENSE.md)
- tesseract.js-core 6.0.0: SIMD and non-SIMD LSTM-only embedded WASM bundles (Apache-2.0, LICENSE)
- Tesseract `4.0.0_fast` language files: `chi_tra`, `chi_sim`, `eng` from https://tessdata.projectnaptha.com/4.0.0_fast/ (Apache-2.0)

Sources: https://github.com/naptha/tesseract.js/tree/v6.0.1 and https://github.com/naptha/tesseract.js-core/tree/v6.0.0; model upstream https://github.com/tesseract-ocr/tessdata_fast.

Runtime configuration follows https://github.com/naptha/tesseract.js/blob/v6.0.1/docs/local-installation.md. Worker, core and language paths are same-origin. Images remain Blob URLs in the browser. Models may be cached in IndexedDB; screenshots and recognition results are not persisted there. No API key or hosted inference endpoint is used. HTTP(S) hosting is required for Worker loading; file:// failure leaves manual review available.

Only OEM 1 (LSTM) is used, so legacy core bundles are not shipped. Keep both SIMD and non-SIMD LSTM bundles. Do not load this runtime on Classic pages.
