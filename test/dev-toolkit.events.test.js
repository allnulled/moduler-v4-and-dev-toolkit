module.exports = async function ({ DevToolkit, devToolkit }) {
  const assert = DevToolkit.Testing.Asserter.createLoggerAssert();
  assert(1, "Starting DevToolkit.Events test");
  assert(typeof DevToolkit.Events === "function", "Can find DevToolkit.Events");
  // console.log("events test");
  // console.log(DevToolkit);
  // console.log(devToolkit);
  // throw new Error("What is it");
};