assert(condition, message) {
  if (!condition) throw new Error("AssertionError in CssLoader: " + message);
}