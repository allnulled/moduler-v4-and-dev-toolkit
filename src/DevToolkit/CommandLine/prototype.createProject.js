async createProject(targetDirectory) {
  const fs = require("fs");
  const targetFullpath = this.toolkit.fullpathOf(targetDirectory);
  const contents = await fs.promises.readdir(targetFullpath);
  this.toolkit.assert(contents.length === 0, `required directory «${targetFullpath}» to be empty to create project «DevToolkit.CommandLine.prototype.createProject»`);
  await this.toolkit.constructor.FileSystem.fromObjectToDirectory(this.constructor.baseProject, targetFullpath);
  return true;
}