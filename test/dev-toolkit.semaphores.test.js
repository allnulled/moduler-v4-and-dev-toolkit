module.exports = async function ({ DevToolkit, devToolkit }) {
  const assert = DevToolkit.Testing.Asserter.createLoggerAssert();
  assert(1, "Starting DevToolkit.Semaphore test");
  assert(typeof DevToolkit.Semaphore === "function", "Can find DevToolkit.Semaphore");
};