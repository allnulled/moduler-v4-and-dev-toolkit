(function(mod) {
  if (typeof window !== 'undefined') window['ModulerV5'] = mod;
  if (typeof global !== 'undefined') global['ModulerV5'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function() {

  const ModulerV5 = class {
    static create(...args) {
      return new this(...args);
    }
    constructor(...args) {
      this.isBrowser = typeof window !== "undefined";
      let input1 = null;
      let input2 = null;
      Step_1_Receive_arguments: {
        if (args.length === 0) {
          input1 = null;
          input2 = null;
        } else if (args.length === 1) {
          input1 = args[0] || null;
          input2 = null;
        } else if (args.length === 2) {
          input1 = args[0] || null;
          input2 = args[1];
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments.length» must be between 0-2");
        }
      }
      let rootdir = null;
      let basedir = null;
      let definitions = null;
      Step_2_Fulfill_parameters: {
        if (input1 === null) {
          basedir = null;
          definitions = {};
        } else if (typeof input1 === "string") {
          basedir = input1;
          definitions = {};
        } else if (typeof input1 === "object" && input1 instanceof ModulerV5) {
          rootdir = input1.rootdir;
          basedir = input1.basedir;
          definitions = input1.definitions;
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments[0]» must be undefined, string, null or instance of ModulerV5");
        }
        if (input2 === null) {
          // @OK: no extra file
        } else if (typeof input2 === "string") {
          this.assert(typeof input1 === "object" && input1 instanceof ModulerV5, "on «ModulerV5.constructor»: parameter «arguments[1]» can only be used when «arguments[0]» is instance of ModulerV5");
          basedir = input1.fullpathOf(input2);
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments[1]» must be string, null or instance of ModulerV5");
        }
      }
      Step_3_Fix_default_values: {
        if (basedir === null) {
          if (this.isBrowser) {
            basedir = window.location.origin + window.location.pathname;
          } else {
            basedir = process.cwd();
          }
        }
      }
      Step_4_Validate_final_format: {
        this.assert(typeof basedir === "string", "on «ModulerV5.constructor»: variable «basedir» was not well formatted");
        this.assert(typeof definitions === "object", "on «ModulerV5.constructor»: variable «definitions» was not well formatted");
      }
      Step_5_Stablish_values: {
        this.rootdir = rootdir ?? basedir;
        this.basedir = basedir;
        this.definitions = definitions;
      }
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
    isTracing = false;
    trace(method, args = [], debugLevel = 0) {
      if (!this.isTracing) return;
      console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)
    }

    assert(condition, message) {
      this.trace("assert", arguments);
      if (!condition) throw new Error(message);
    }
    normalizationOf = function(input, debug = false) {
      const parts = (input.startsWith("/") ? input : (this.basedir.replace(/\/+$/g, "") + "/" + input)).split(/(\/+)/g);
      const stack = [];
      Iterating_parts:
        for (const part of parts) {
          if (part === ".") {
            continue Iterating_parts;
          } else if (part === "..") {
            if (stack.length && stack[stack.length - 1] === "/") {
              stack.pop();
              stack.pop();
            } else if (stack.length && stack[stack.length - 1] === "//") {
              continue Iterating_parts;
            } else if (stack.length) {
              stack.pop();
            }
            continue Iterating_parts;
          } else if (part === "/") {
            if (stack.length && stack[stack.length - 1] === "/") {
              continue Iterating_parts;
            }
            if (stack.length && stack[stack.length - 1] === "//") {
              continue Iterating_parts;
            }
          }
          stack.push(part);
        }
      const finalUrl = stack.join("");
      if (debug) {
        console.log(finalUrl);
      }
      return finalUrl;
    };
    fullpathOf(subpath) {
      this.trace("fullpathOf", arguments);
      if (this.isBrowser) {
        throw new Error("Must polyfill method «fullpathOf» to support browser environment");
      }
      return require("path").resolve(this.basedir, subpath);
    }
    importModule(subpath, injection = {}) {
      this.trace("importModule", arguments);
      return this.readPath(subpath).then(source => {
        const asyncFunction = new(async function() {}).constructor(...Object.keys(injection), "module", "exports", "$dictionary", "__filename", "__dirname", source);
        this.trace("importModule::evaluating JS", []);
        // console.log(`\n${source}\n`);
        Resolve_module: {
          const initialState = {};
          const modulo = {
            exports: initialState
          };
          return asyncFunction(...Object.values(injection), modulo, modulo.exports, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/..")).then(output => {
            const returnsUndefined = typeof output === "undefined";
            const isNotInitialState = modulo.exports !== initialState;
            const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
            return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
          });
        }
      });
    }
    readPath(file) {
      this.trace("readPath", arguments, 0);
      return this.isBrowser ? this.readUrl(file) : this.readFile(file);
    }
    readUrl(file) {
      this.trace("readUrl", arguments);
      return fetch(this.fullpathOf(file)).then(response => response.text());
    }
    readFile(file) {
      this.trace("readFile", arguments);
      return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
    }
    knows(id) {
      this.trace("knows", arguments);
      // Comprueba si un id está en definitions
      Validate_parameters: {
        this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
      }
      Search_as_definition: {
        if (!(id in this.definitions)) {
          return false;
        }
        return true;
      }
    }
    define(...args) {
      this.trace("define", arguments);
      let dependencies = [];
      let factory = undefined;
      Validate_parameters: {
        if (args.length === 1) {
          this.assert(typeof args[0] === "function", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
          factory = args[0];
        } else if (args.length === 2) {
          this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
          this.assert(typeof args[1] === "function", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);
          dependencies = args[0];
          factory = args[1];
        } else {
          throw new Error(`current arguments.length «${args.length}» is not supported`);
        }
      }
      let dependencyPromises = undefined;
      Resolve_dependencies: {
        dependencyPromises = dependencies.map(dependency => this.mean(dependency));
      }
      Resolve_module: {
        const initialState = {};
        const modulo = {
          exports: initialState
        };
        return Promise.all(dependencyPromises).then(resolvedDependencies => {
          const output = factory(...resolvedDependencies, modulo, modulo.exports, this, "anonymous directory", "anonymous file");
          const returnsUndefined = typeof output === "undefined";
          const isNotInitialState = modulo.exports !== initialState;
          const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
          return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
        });
      }
    }
    mean(...args) {
      this.trace("mean", arguments);
      let id = undefined;
      let dependencies = [];
      let callback = undefined;
      Validate_and_format_parameters: {
        if (args.length === 1) {
          if (typeof args[0] === "function") {
            callback = args[0];
          } else if (Array.isArray(args[0])) {
            return Promise.all(args[0].map(dependency => this.mean(dependency)));
          } else {
            this.assert(typeof args[0] === "string", `using mean: if args.length is 1 then args[0] must be id string or factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
            id = args[0];
          }
        } else if (args.length === 2) {
          this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
          this.assert(typeof args[1] === "function", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);
          dependencies = args[0];
          callback = args[1];
        } else {
          throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);
        }
      }
      if (typeof callback === "function") {
        Resolve_as_callback: {
          const dependencyPromises = dependencies.map(dependency => this.mean(dependency));
          return Promise.all(dependencyPromises).then(resolvedDependencies => {
            const initialState = {};
            const modulo = {
              exports: initialState
            };
            let output = callback(...resolvedDependencies, modulo, modulo.exports, this, "anonymous file", "anonymous directory");
            const returnsUndefined = typeof output === "undefined";
            const isNotInitialState = modulo.exports !== initialState;
            const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
            return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
          });
        }
      }
      else if (typeof id === "string") {
        Resolve_as_id: {
          id = this.fullpathOf(id);
          if (id in this.definitions) {
            return this.definitions[id];
          }
          return this.importModule(id);
        }
      }
      throw new Error("No, aquí no debería entrar, esta condición ya ha sido filtrada antes");
    }
    cloneForFile(file) {
      return ModulerV5.create(this, file + "/..");
    }
    cloneForDirectory(directory) {
      return ModulerV5.create(this, directory);
    }
  };

  ModulerV5.Dictionary = new ModulerV5();

  Promise.fromObject = function(obj) {
    const allKeys = Object.keys(obj);
    return Promise.all(Object.values(Object.values(obj))).then(output => {
      let toObject = {};
      for (let index = 0; index < output.length; index++) {
        const item = output[index];
        toObject[allKeys[index]] = item;
      }
      return toObject;
    })
  };

  return ModulerV5;

}.call());