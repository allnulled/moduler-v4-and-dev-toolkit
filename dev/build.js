const Tjs = require(`${__dirname}/lib/tjs/tjs.js`);
const fs = require("fs");
require("js-beautify/js");

const main = async function() {
  const tjs = Tjs.create(`${__dirname}/..`);
  const targets = [
    ["src/ModulerV4/ModulerV4.entry.js", "dist/moduler-v4/moduler-v4.dist.js"],
    ["src/ModulerV5/ModulerV5.entry.js", "dist/moduler-v5/moduler-v5.dist.js"],
    ["src/DevToolkit/DevToolkit.entry.js", "dist/dev-toolkit/dev-toolkit.dist.js"],
  ];
  for(let index=0; index<targets.length; index++) {
    const [src, dst] = targets[index];
    const moduleSource = await tjs.renderFile(src, {}, {beautify:true});
    await fs.promises.writeFile(tjs.fullpathOf(dst), moduleSource, "utf8");
  }
};

module.exports = main().then(() => {
  return require(__dirname + "/../test/test.js");
});
