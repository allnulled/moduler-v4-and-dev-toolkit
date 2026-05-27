getFilepath() {
  return require("path").resolve(this.toolkit.basedir, this.uid);
}