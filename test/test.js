const fs = require("fs");
const path = require("path");

const tests = [
  `${__dirname}/dev-toolkit.testing.test.js`,
  `${__dirname}/dev-toolkit.templating.test.js`,
  `${__dirname}/dev-toolkit.tracer.test.js`,
  `${__dirname}/dev-toolkit.semaphores.test.js`,
  `${__dirname}/dev-toolkit.events.test.js`,
  `${__dirname}/dev-toolkit.file-watcher.test.js`,
];

const main = async function () {
  const DevToolkit = require(`${__dirname}/../dist/dev-toolkit/dev-toolkit.dist.js`);
  const devToolkit = new DevToolkit(`${__dirname}/unwatched`);
  const hasColors = (() => {try {DevToolkit.CommandLine.Colors.style;return true;} catch(error) {return false;}})();
  const results = { output: [] };
  Test_de_dev_toolkit: 
  for(let index=0; index<tests.length; index++) {
    const file = tests[index];
    try {
      const output = await require(file)({ DevToolkit, devToolkit });
      results.output.push({ index, file, success: true , output });
    } catch (error) {
      results.output.push({ index, file, success: false, error });      
    }
  }
  console.log(" 🟨 [🔬] Tests report:");
  results.output.forEach(result => {
    if(result.success) {
      const message = ` [*] [${result.index+1}] ${result.file}`;
      if(!hasColors) console.log(message)
      else console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(message));
    } else {
      const message = ` [!] [${result.index+1}] ${result.file}:\n${result.error.name}: ${result.error.message}\n${result.error.stack}`;
      if(!hasColors) console.log(message, result.error);
      else console.log(DevToolkit.CommandLine.Colors.style("redBright").text(message));
    }
  })
}.call();