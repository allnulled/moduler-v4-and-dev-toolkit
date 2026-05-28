module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "Templating".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Templating test");
  assert(typeof DevToolkit.Templating.Tjs === "function", "Can find DevToolkit.Templating.Tjs");
};