mean(idInput) {
  this.trace("mean", arguments);
  this.assert(typeof idInput === "string", "parameter «id» must be string on «ModulerV5.prototype.mean»");
  const id = this.fullpathOf(idInput);
  if(id in this.definitions) {
    return this.definitions[id];
  }
  // console.log("meaning:", id);
  return this.importModule(id);
}