module.exports = async function ({ DevToolkit, devToolkit }) {
  const assert = DevToolkit.Testing.Asserter.createLoggerAssert();
  assert(1, "Starting DevToolkit.Templating test");
  assert(typeof DevToolkit.Templating.Tjs === "function", "Can find DevToolkit.Templating.Tjs");
};