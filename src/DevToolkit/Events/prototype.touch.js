async touch(file) {
  this.trace("prototype.touch", arguments, 0);
  Acquire_semaphore: {
    await this.toolkit.semaphore.acquire();
  }
  try {
    Propagate_on_touch: {
      const path = require("path");
      const subpath = this.toolkit.subpathOf(file);
      const parts = subpath.split("/").filter(part => part !== "");
      // Iteramos los directorios superiores del fichero touched hasta la raíz del toolkit:
      for (let index = parts.length - 1; index > -1; index--) {
        const subparts = parts.toSpliced(index);
        const touchedPath = this.toolkit.fullpathOf(subparts.join("/"));
        const touchedName = path.basename(touchedPath);
        const triggableByFolder = path.resolve(`${touchedPath}/${touchedName}.js`);
        const triggableByOnTouch = path.resolve(`${touchedPath}/onTouch.js`);
        Trigger_by_folder:
        if (await DevToolkit.FileSystem.existsFile(triggableByFolder)) {
          // DevToolkit.CommandLine.Colors.style("yellow,underline").print("Should run: ", triggableByFolder);
          const callback = require(triggableByFolder);
          if(typeof callback === "function") {
            await callback.call(this.toolkit, file);
          }
        }
        Trigger_by_onTouch:
        if (await DevToolkit.FileSystem.existsFile(triggableByOnTouch)) {
          // DevToolkit.CommandLine.Colors.style("yellow,underline").print("Should run: ", triggableByOnTouch);
          const callback = require(triggableByOnTouch);
          if(typeof callback === "function") {
            await callback.call(this.toolkit, file);
          }
        }
      }
    }
  } catch (error) {
    DevToolkit.CommandLine.printError(error);
  }
  Release_semaphore: {
    await this.toolkit.semaphore.release();
  }
}