import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(root, "assets");
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

for (let n = 1; n <= 43; n++) {
  const key = String(n);
  fs.writeFileSync(path.join(assets, `${key}.html`), tpl(key), "utf8");
}
console.log("Wrote assets/1.html … assets/43.html (stubs read parent.__IDR_PAGES__).");
