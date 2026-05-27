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
  all = [];
  sections = {};
  statics = [];
  // Métodos dinámicos:
  constructor() {

  }
  // Métodos dinámicos para secciones:
  section(ids) {
   // Encuentra la sección a partir de un Array<String> y this.sections
   // - Si no encuentra camino, lo crea (con objetos planos)
   // - Haya o no camino, devuelve un objeto con { define, mean, knows } pero adaptado a este objeto/sección solamente
  }
  // Métodos dinámicos para definiciones:
  knows(id) {
   // Comprueba si un id está en definitions
  }
  define(id, dependencies, factory, options = {}) {
   // Llama a factory, pasándole las dependencies resueltas y lo pone en id
  }
  mean() {

  }
  // Métodos dinámicos para estáticos:
  has(staticsPath) {
   // Determina (con un booleano) si ese path ya está registrado en statics
  }
  set(staticsPath, value) {
   // Establece un valor en el árbol de statics:
   // - Si no encuentra camino, lo crea (con ojbetos planos)
   // - Si no estaba el objetivo: establece el valor en el sitio indicado
   // - Si ya había algo en el objetivo: debería lanzar error
  }
  get(staticsPath, defaultValue = ModulerV4.symbol.THROW) {

  }
 }
 return ModulerV4;
});