module.exports = async function ({ DevToolkit, devToolkit }) {
  const assert = DevToolkit.Testing.Asserter.createLoggerAssert();
  assert(1, "Starting DevToolkit.Tracer test");
  assert(typeof DevToolkit.Tracer === "function", "Can find DevToolkit.Tracer");
  // console.log("events test");
  // console.log(DevToolkit);
  // console.log(devToolkit);
};