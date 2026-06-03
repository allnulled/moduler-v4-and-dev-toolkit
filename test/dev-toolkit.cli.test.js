module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert, assertFileExists, assertFileMissing, } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/cli".padEnd(titleColumns) });
  assert(1, "DevToolkit/cli");
  Puede_empezar_un_nuevo_proyecto: {
    const targetDirectory = __dirname + "/unwatched/devtoolkit-cli.test/example-1";
    const packageJsonPath = `${targetDirectory}/package.json`;
    await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
    assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
    await devToolkit.cli.createProject(targetDirectory);
    assertFileExists(packageJsonPath, "Can prepare newly created project (point 2)");
    await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
    assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
  }
};