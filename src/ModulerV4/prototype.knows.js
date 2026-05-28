knows(id) {
  // Comprueba si un id está en definitions
  this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
  if(id in this.statics) return true;
  if(!(id in this.definitions)) return false;
  return true;
}