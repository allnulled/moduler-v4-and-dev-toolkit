(function(factory) {
 const mod = factory();
 if (typeof window !== 'undefined') {
  window['ModulerV4'] = mod;
 }
 if (typeof global !== 'undefined') {
  global['ModulerV4'] = mod;
 }
 if (typeof module !== 'undefined') {
  module.exports = mod;
 }
})(function() {
 const ModulerV4 = class {
  // Propiedades estáticas:
  static symbols = {
   THROW: Symbol("To throw"),
  }
  // Métodos estáticos:
  static create(...args) {
   return new this(...args);
  }
  // Métodos estáticos:
  assert(condition, message) {
   if (!condition) throw new Error(message);
  }
  static import(url, options = false) {
   return options ? import(url, options) : import(url);
  }
  static require(file) {
   return require(file);
  }
  static evalAsync(source, injection = {}) {
   return (new(async function() {}.constructor)(...Object.keys(injection), source))(...Object.values(injection));
  }
  static evalSync(file, injection = {}) {
   return (new(function() {}.constructor)(...Object.keys(injection), source))(...Object.values(injection));
  }
  static eval = this.evalAsync;
  static evalFetch(url, injection = {}) {
   return fetch(url).then(response => response.text()).then(source => this.evalAsync(source, injection));
  }
  static evalFile(file, injection = {}) {
   return require("fs").promises.readFile(file, "utf8").then(source => this.evalAsync(source, injection));
  }
  static evalFileSync(file, injection = {}) {
   return this.evalSync(require("fs").readFileSync(file).toString(), injection);
  }
  // Propiedades prototipo iniciales:
  definitions = {};
  statics = {};
  // Métodos dinámicos:
  constructor() {

  }
  // Métodos dinámicos para definiciones:
  knows(id) {
   // Comprueba si un id está en definitions
   this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
   if (id in this.statics) return true;
   if (!(id in this.definitions)) return false;
   return true;
  }
  define(...args) {
   let id, dependencies = [],
    factory;
   if (args.length === 1) {
    [factory] = args;
   } else if (args.length === 2) {
    [id, factory] = args;
   } else if (args.length === 3) {
    [id, dependencies, factory] = args;
   } else {
    throw new Error("required «arguments.length» to be minimum 1 and maximum 3 to use «define»");
   }
   // Llama a factory, pasándole las dependencies resueltas y lo pone en id
   // this.assert(typeof id === "string", "required «id» as string to use «define»");
   this.assert(Array.isArray(dependencies), `required «dependencies» as array to use «define» but «${typeof dependencies}» was found instead`);
   this.assert(typeof factory === "function", `required «factory» as function to use «define» but «${typeof factory}» was found instead`);
   const parameters = [];
   for (let index = 0; index < dependencies.length; index++) {
    const dependency = dependencies[index];
    const parameter = this.mean(dependency);
    parameters.push(parameter);
   }
   const data = factory(...parameters);
   this.definitions[id] = data;
   if (data instanceof Promise) data.then(output => this.statics[id] = output);
   return data;
  }
  mean(id) {
   // Busca en statics, si no, busca en definitions, y si no, lanza error.
   if (typeof id === "function") return id();
   this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «mean»");
   if (id in this.statics) return this.statics[id];
   this.assert(id in this.definitions, "required «arguments[0]=id» to be defined to use «mean»");
   return this.definitions[id];
  }
 };
 (function(mod) {
  if (typeof window !== 'undefined') window['Dictionary'] = mod;
  if (typeof global !== 'undefined') global['Dictionary'] = mod;
 })(function() {
  return new ModulerV4();
 }.call());
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
 return ModulerV4;
});