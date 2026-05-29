fullpathOf(subpath) {
  this.trace("fullpathOf", arguments);
  if(this.isBrowser) {
    throw new Error("Must polyfill method «fullpathOf» to support browser environment");
  }
  return require("path").resolve(this.basedir, subpath);
}