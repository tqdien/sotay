import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(root, "assets");
const imgOut = path.join(assets, "img");

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

// Clean previous assets/ if re-running
if (fs.existsSync(assets)) rmrf(assets);
fs.mkdirSync(imgOut, { recursive: true });

for (let n = 1; n <= 43; n++) {
  const dir = path.join(root, String(n));
  const svgSrc = path.join(dir, `${n}.svg`);
  if (!fs.existsSync(svgSrc)) continue;
  let svg = fs.readFileSync(svgSrc, "utf8");
  svg = svg.replace(/href="img\/1\.jpg"/g, `href="img/${n}-1.jpg"`);
  svg = svg.replace(/href="img\/2\.jpg"/g, `href="img/${n}-2.jpg"`);
  fs.writeFileSync(path.join(assets, `${n}.svg`), svg, "utf8");

  const imgDir = path.join(dir, "img");
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir)) {
      const src = path.join(imgDir, f);
      if (!fs.statSync(src).isFile()) continue;
      fs.copyFileSync(src, path.join(imgOut, `${n}-${f}`));
    }
  }
}

for (const name of ["fonts", "thumbnails"]) {
  const src = path.join(root, name);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(assets, name);
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, f), path.join(dest, f));
  }
}

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html.replace(
  /IDRViewer\.config = \{"pagecount":/,
  'IDRViewer.config = {"url":"assets/","pagecount":'
);
/* Paths must be relative to config url ("assets/"); IDRViewer prepends url to data= and url(" in @font-face. */
html = html.replace(/(\d+)\/\1\.svg/g, "$1.svg");
html = html.replace(/data=\\"assets\/(\d+)\.svg\\"/g, 'data=\\"$1.svg\\"');
html = html.replace(/url\(\\"assets\/fonts\//g, 'url(\\"fonts/');

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");

for (let n = 1; n <= 43; n++) rmrf(path.join(root, String(n)));
rmrf(path.join(root, "fonts"));
rmrf(path.join(root, "thumbnails"));

console.log("Merged into assets/ and updated index.html");
