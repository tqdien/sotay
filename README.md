# Sot tay TTHC

Direct PDF handbook viewer built with PDF.js.

`index.html` renders `sotay.pdf` in-browser (desktop + mobile) and keeps PDF
hyperlinks clickable, including links that jump to other pages.

Pages: https://inuris.github.io/sotay/

## Local preview

Run any static server from the repo root, for example:

```bash
npx serve .
```

Then open the served URL in your browser.

## Publish

Push at least:

- `index.html`
- `sotay.pdf`
- `.nojekyll` (optional)