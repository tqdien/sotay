Not part of the published viewer.

These scripts are only for rebuilding or fixing the site from a multi-folder export.
Nothing in index.html points here.

Publish to GitHub Pages: you only need index.html, .nojekyll (if used), and the assets/ folder.
Optional: delete this devtools/ folder before deploy, or ignore it; it is harmless if hosted but unused.

Run from repo root:
  node devtools/create-page-stubs.mjs
  node devtools/merge-assets.mjs   (needs legacy per-page folders + index layout — rarely used)
