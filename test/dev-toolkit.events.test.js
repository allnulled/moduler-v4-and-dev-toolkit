module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert, assertFileExists, assertDirectoryExists, assertFileContents, assertFileMissing, assertDirectoryMissing } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "Events".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Events test");
  assert(typeof DevToolkit.Events === "function", "Can find DevToolkit.Events");
  await DevToolkit.FileSystem.deleteDirectory(devToolkit.fullpathOf("events/files"), { inTry: true });
  await DevToolkit.FileSystem.writeDirectory(devToolkit.fullpathOf("events/files"));
  await DevToolkit.FileSystem.writeFile(devToolkit.fullpathOf("events/files/lib1.txt"), `lib1:1`);
  await DevToolkit.FileSystem.writeDirectory(devToolkit.fullpathOf("events/files/lib1"));
  await DevToolkit.FileSystem.writeFile(devToolkit.fullpathOf("events/files/lib1/prop1.txt"), `prop1 = 1`);
  await DevToolkit.FileSystem.writeFile(devToolkit.fullpathOf("events/files/lib1/prop2.txt"), `prop2 = 2`);
  await DevToolkit.FileSystem.writeFile(devToolkit.fullpathOf("events/files/lib1/prop3.txt"), `prop3 = 3`);
  await DevToolkit.FileSystem.writeFile(devToolkit.fullpathOf("events/files/lib1/onTouch.js"), `
    require("fs").writeFileSync(__dirname + "/on-touch-event.txt", "happened", "utf8");
  `);
  await assertFileMissing(devToolkit.fullpathOf("events/files/lib1/on-touch-event.txt"), "Can start a clean directory");
  await devToolkit.events.touch(devToolkit.fullpathOf("events/files/lib1/prop1.txt"));
  await assertFileContents(devToolkit.fullpathOf("events/files/lib1/on-touch-event.txt"), "happened", "Can propagate «onTouch.js» on simple structure");
};