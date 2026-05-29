readUrl(file) {
  this.trace("readUrl", arguments);
  return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
}