mean(id) {
  // Busca en statics, si no, busca en definitions, y si no, lanza error.
  if(typeof id === "function") return id();
  this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «mean»");
  if(id in this.statics) return this.statics[id];
  this.assert(id in this.definitions, "required «arguments[0]=id» to be defined to use «mean»");
  return this.definitions[id];
}