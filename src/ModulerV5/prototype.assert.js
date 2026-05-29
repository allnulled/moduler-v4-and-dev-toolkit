assert(condition, message) {
  this.trace("assert", arguments);
  if (!condition) throw new Error(message);
}