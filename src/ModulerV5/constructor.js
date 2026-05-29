constructor(basedir = null) {
  this.isBrowser = typeof window !== "undefined";
  this.basedir = basedir ?? (this.isBrowser ? window.location.origin + window.location.pathname : process.cwd());
}