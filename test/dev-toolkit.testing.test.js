module.exports = async function ({ DevToolkit, devToolkit }) {
  const assert = DevToolkit.Testing.Asserter.createLoggerAssert();
  assert(1, "Starting DevToolkit.Testing test");
  assert(typeof DevToolkit.Testing === "function", "Can find DevToolkit.Testing");
  /*
  assert(true, "Global was found");
  await require("timers/promises").setTimeout(200);
  assert(true, "Message was sent");
  await require("timers/promises").setTimeout(200);
  assert(true, "Message was received");
  assert(true, "Message is well formatted");
  await require("timers/promises").setTimeout(200);
  assert(false, "Message is well formatted");
  await require("timers/promises").setTimeout(200);
  assert(true, "Message is well formatted");
  //*/
};