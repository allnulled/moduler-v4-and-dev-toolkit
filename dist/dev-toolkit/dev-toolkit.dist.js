(function(mod) {
  if (typeof window !== 'undefined') window['DevToolkit'] = mod;
  if (typeof global !== 'undefined') global['DevToolkit'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function() {
  const Tracer = class Tracer {
    static createTracer(prefix, firstMessage = false, isTracing = true) {
      let callback = undefined;
      callback = function(method, args = [], debugLevel = 0) {
        if (callback.isTracing === true) {
          console.log(DevToolkit.CommandLine.Colors.style("cyan").text(`[Trace:${prefix}.${method}]`) + ` ${Tracer.inspectToString(args, debugLevel)}`);
        }
        return callback;
      };
      callback.isTracing = isTracing;
      if (firstMessage) callback(firstMessage);
      return callback;
    }
    static inspectToString(args, debugLevel) {
      if (debugLevel === 0) return `${[...args].length} args`;
      if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
      if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
    }
    static stringify(it) {
      try {
        return JSON.stringify(it);
      } catch (error) {
        return it;
      }
    }
  };
  return class DevToolkit {
    static Tracer = Tracer;
    static CommandLine = class CommandLine {
      static Colors = require(__dirname + "/refrescador.api.dist.js").colors;
      static printError(error) {
        console.log(DevToolkit.CommandLine.Colors.style("redBright,bold").text(DevToolkit.CommandLine.Colors.box(`${error.name}: ${error.message}`)), "\n", error);
      };
    };
    static Testing = class Testing {
      static Asserter = class Asserter {
        static AssertionError = class AssertionError extends Error {
          constructor(...args) {
            super(...args);
            this.name = "AssertionError";
          }
        };
        static defaultOnSuccess() {}
        static defaultOnError(message) {
          throw new this.AssertionError(message);
        }
        static createAssert(onSuccess = this.defaultOnSuccess, onError = this.defaultOnError, specificOutputs = {}) {
          const assert = function(condition, message) {
            if (["string", "number"].includes(typeof condition) && condition in specificOutputs) {
              return specificOutputs[condition](message);
            } else if (condition) {
              return onSuccess(message);
            } else {
              return onError(message);
            }
          };
          return {
            assert,
            // Aserciones de filesystem:
            assertFileExists: function(file, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(typeof out === "string", message));
            },
            assertDirectoryExists: function(dir, message) {
              return DevToolkit.FileSystem.readDirectory(dir, {
                inTry: true
              }).then(out => assert(typeof out === "object", message));
            },
            assertFileContents: function(file, contents, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(out === contents, message));
            },
            assertFileMissing: function(file, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(typeof out !== "string", message));
            },
            assertDirectoryMissing: function(dir, message) {
              return DevToolkit.FileSystem.readDirectory(dir, {
                inTry: true
              }).then(out => assert(typeof out !== "object", message));
            },
          };
        }
        static createLoggerAssert(options = {}) {
          const startTime = options.startTime || new Date();
          return this.createAssert(message => {
            console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(`${options.prefix || ""} |  OK | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
          }, message => {
            console.log(DevToolkit.CommandLine.Colors.style("redBright,underline,bold").text(`${options.prefix || ""} | ERR | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
            if (options.bulletproof !== true) {
              throw new this.AssertionError(message);
            }
          }, {
            "1"(message) {
              console.log(DevToolkit.CommandLine.Colors.style("cyan,underline").text(`${options.prefix || ""} |  #  | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
            }
          });
        }
      }
      constructor(toolkit) {
        this.trace = Tracer.createTracer("DevToolkit.Testing", "constructor");
        this.toolkit = toolkit;
      }
    };
    static Events = class Events {
      constructor(toolkit) {
        this.trace = Tracer.createTracer("DevToolkit.Events", "constructor");
        this.toolkit = toolkit;
      }
      async touch(file) {
        this.trace("prototype.touch", arguments, 0);
        Acquire_semaphore: {
          await this.toolkit.semaphore.acquire();
        }
        Make_propagations: {
          try {
            await this.propagateOnTouch(file);
            await this.propagateOnTest(file);
            await this.propagateOnDistribute(file);
          } catch (error) {
            DevToolkit.CommandLine.printError(error);
          }
        }
        Release_semaphore: {
          await this.toolkit.semaphore.release();
        }
      }
      async propagateOnTouch(file) {
        this.trace("prototype.propagateOnTouch", arguments);
        Propagate_on_touch: {
          const path = require("path");
          const subpath = this.toolkit.subpathOf(file);
          const parts = subpath.split("/").filter(part => part !== "");
          // Iteramos los directorios superiores del fichero touched hasta la raíz del toolkit:
          Iterating_directories: for (let index = parts.length - 1; index > -1; index--) {
            const subparts = parts.toSpliced(index);
            const touchedPath = this.toolkit.fullpathOf(subparts.join("/"));
            Trigger_by_entry: {
              const files = await DevToolkit.FileSystem.readDirectory(touchedPath, {
                inTry: true
              });
              for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (file.endsWith(".entry.js")) {
                  const entryPath = path.resolve(touchedPath, file);
                  DevToolkit.CommandLine.Colors.style("yellow").print("Found «*.entry.js» at: " + this.toolkit.subpathOf(entryPath));
                  const entryOutput = await this.toolkit.templating.tjs.renderFile(entryPath);
                  const distPath = path.resolve(entryPath.replace(/\.entry\.js$/g, ".dist.js"));
                  DevToolkit.CommandLine.Colors.style("yellow").print("Making «*.dist.js» at: " + this.toolkit.subpathOf(distPath));
                  await DevToolkit.FileSystem.writeFile(distPath, entryOutput, "utf8");
                }
              }
            }
            const triggableByOnTouch = path.resolve(`${touchedPath}/on-touch.js`);
            Trigger_by_onTouch:
              if (await DevToolkit.FileSystem.existsFile(triggableByOnTouch)) {
                DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-touch.js» at: " + this.toolkit.subpathOf(triggableByOnTouch));
                const callback = require(triggableByOnTouch);
                if (typeof callback === "function") {
                  await callback.call(this.toolkit, file);
                }
              }
            const triggableByOnTest = path.resolve(`${touchedPath}/on-test.js`);
            Trigger_by_onTest:
              if (await DevToolkit.FileSystem.existsFile(triggableByOnTest)) {
                DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-test.js» at: " + this.toolkit.subpathOf(triggableByOnTest));
                const callback = require(triggableByOnTest);
                if (typeof callback === "function") {
                  await callback.call(this.toolkit, file);
                }
              }
          }
        }
      }
      async propagateOnTest(file) {
        this.trace("prototype.propagateOnTest", arguments);
      }
      async propagateOnDistribute(file) {
        this.trace("prototype.propagateOnDistribute", arguments);
      }
    };
    static Semaphore = class Semaphore {
      constructor(toolkit, filename = "semaphore.main.txt") {
        this.trace = Tracer.createTracer("DevToolkit.Semaphore", "constructor");
        this.toolkit = toolkit;
        this.filename = filename;
      }
      setFilename(filename) {
        this.filename = filename;
      }
      getFilepath() {
        return this.toolkit.fullpathOf(this.filename);
      }
      async acquire() {
        const fs = require("fs");
        const target = this.getFilepath();
        Reading_state: {
          try {
            const contents = await fs.promises.readFile(target, "utf8");
            if (contents !== "released") throw new Error(`cannot acquire semaphore because it is not released right now it is «${contents}»`);
          } catch (error) {
            if (error.code === "ENOENT") break Reading_state;
            throw error;
          }
        }
        await fs.promises.writeFile(target, "acquired", "utf8");
      }
      release() {
        return require("fs").promises.writeFile(this.getFilepath(), "released", "utf8");
      }
      async destroy() {
        const fs = require("fs");
        const target = this.getFilepath();
        try {
          await fs.promises.unlink(target);
          return true;
        } catch (error) {
          if (error.code === "ENOENT") return false;
          throw error;
        }
      }
    };
    static FileWatcher = class FileWatcher {
      static Refrescador = require(__dirname + "/refrescador.api.dist.js");
      static start(options) {
        return this.Refrescador.run(options);
      }
    };
    static FileSystem = class FileSystem {
      static exists(file) {
        return require("fs").promises.lstat(file).catch(error => false);
      }
      static existsFile(file) {
        return require("fs").promises.lstat(file).then(lstat => {
          return lstat.isFile();
        }).catch(error => false);
      }
      static readFile(file, inTry = false) {
        if (inTry) {
          return require("fs").promises.readFile(file, "utf8").catch(error => false);
        }
        return require("fs").promises.readFile(file, "utf8");
      }
      static writeFile(file, contents, options = {
        recursive: false
      }) {
        if (options.recursive) throw new Error("operation not supported yet: writeFile + recursive=true");
        return require("fs").promises.writeFile(file, contents);
      }
      static deleteFile(file, options = {
        inTry: false
      }) {
        if (options.inTry) {
          require("fs").promises.unlink(file).catch(error => false);
        }
        return require("fs").promises.unlink(file);
      }
      static existsDirectory(file) {
        return require("fs").promises.lstat(file).then(lstat => {
          return lstat.isDirectory();
        }).catch(error => false);
      }
      static readDirectory(file, options = {
        inTry: false
      }) {
        if (options.inTry) {
          return require("fs").promises.readdir(file).catch(error => false);
        }
        return require("fs").promises.readdir(file);
      }
      static writeDirectory(file, options = {
        recursive: false
      }) {
        return require("fs").promises.mkdir(file, options);
      }
      static deleteDirectory(file, options = {
        inTry: false
      }) {
        if (options.inTry) {
          return require("fs").promises.rm(file, {
            recursive: true
          }).catch(error => false);
        }
        return require("fs").promises.rm(file, {
          recursive: true
        });
      }
    };
    static Templating = class Templating {
      static Tjs = require("./tjs.js");
      constructor(toolkit) {
        this.toolkit = toolkit;
        this.tjs = this.constructor.Tjs.create(this.toolkit.basedir);
      }
    };
    static Time = class Time {
      static timeout(ms) {
        return require("timers/promises").setTimeout(ms);
      }
    };
    constructor(basedir = process.cwd()) {
      this.basedir = basedir;
      this.testing = new this.constructor.Testing(this);
      this.templating = new this.constructor.Templating(this);
      this.events = new this.constructor.Events(this);
      this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
    }
    fullpathOf(subpath) {
      return require("path").resolve(this.basedir, subpath);
    }
    subpathOf(subpath) {
      if (!subpath.startsWith(this.basedir + "/")) throw new Error(`provided file is not a subpath of «${this.toolkit.basedir}»`);
      return subpath.replace(this.basedir + "/", "");
    }
  };
}.call());