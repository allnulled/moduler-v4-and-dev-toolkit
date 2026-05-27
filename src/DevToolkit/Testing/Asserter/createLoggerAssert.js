static createLoggerAssert() {
  const startTime = new Date();
  return this.createAssert(message => {
    console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(` OK | ${(new Date()) - startTime} | ${message}`));
  }, message => {
    console.log(DevToolkit.CommandLine.Colors.style("redBright,underline,bold").text(`ERR | ${(new Date()) - startTime} | ${message}`));
  }, {
    "1"(message) {
      console.log(DevToolkit.CommandLine.Colors.style("cyan,underline").text(`    | ${(new Date()) - startTime} | ${message}`));
    }
  });
}