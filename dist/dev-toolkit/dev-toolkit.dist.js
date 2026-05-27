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
     return function(condition, message) {
      if (["string", "number"].includes(typeof condition) && condition in specificOutputs) {
       return specificOutputs[condition](message);
      } else if (condition) {
       return onSuccess(message);
      } else {
       return onError(message);
      }
     }
    }
    static createLoggerAssert() {
     const startTime = new Date();
     return this.createAssert(message => {
      console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(` OK | ${(new Date()) - startTime} | ${message}`));
     }, message => {
      console.log(DevToolkit.CommandLine.Colors.style("redBright,underline,bold").text(`ERR | ${(new Date()) - startTime} | ${message}`));
     }, {
      "1"(message) {
       console.log(DevToolkit.CommandLine.Colors.style("cyan,underline").text(`    | ${(new Date()) - startTime} | ${message}`));
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
   touch(file) {}
   propagateOnTouch() {}
   propagateOnTest() {}
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
    return require("path").resolve(this.toolkit.basedir, this.uid);
   }
   open() {
    return require("fs").promises.writeFile(this.getFilepath(), "opened", "utf8");
   }
   async close() {
    const fs = require("fs");
    const target = this.getFilepath();
    const contents = await fs.promises.readFile(target, "utf8");
    if (contents !== "opened") throw new Error("cannot close semaphore because it is not opened right now");
    await fs.promises.writeFile(target, "closed", "utf8");
   }
  };
  static FileWatcher = class FileWatcher {
   static refrescador = require(__dirname + "/refrescador.api.dist.js");
   static start(options) {
    return this.refrescador(options);
   }
  };
  static Templating = class Templating {
   static Tjs = require("./tjs.js");
  };
  constructor(basedir = process.cwd()) {
   this.basedir = basedir;
   this.testing = new this.constructor.Testing(this);
   this.events = new this.constructor.Events(this);
   this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
  }
 };
}.call());