module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5".padEnd(titleColumns) });
  assert(1, "ModulerV5");
  // Sobreescribimos el global:
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test"));
  const lib1 = await Dictionary.mean("./lib1.js");
  assert(typeof lib1 === "object", "can import object (point 1)");
  assert(lib1.a === 1, "can import object (point 2)");
  assert(lib1.b === 2, "can import object (point 3)");
  assert(lib1.c === 3, "can import object (point 4)");
};