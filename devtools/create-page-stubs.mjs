import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const indexPath = path.join(root, "index.html");

const idx = fs.readFileSync(indexPath, "utf8");
const pc = idx.match(/"pagecount"\s*:\s*(\d+)/);
const pagecount = pc ? parseInt(pc[1], 10) : 43;

const tpl = (k) => `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<script>
(function(){
var k="${k}";
try{
var w=window.parent!==window?window.parent:window;
var html=w.__IDR_PAGES__&&w.__IDR_PAGES__[k];
if(html){document.open();document.write(html);document.close();}
}catch(e){}
})();
</script>
</head><body></body></html>
`;

for (let n = 1; n <= pagecount; n++) {
  const key = String(n);
  fs.writeFileSync(path.join(assets, `${key}.html`), tpl(key), "utf8");
}
console.log(`Wrote assets/1.html … assets/${pagecount}.html (stubs read parent.__IDR_PAGES__).`);
