constructor(basedir = process.cwd()) {
  this.basedir = basedir;
  this.testing = new this.constructor.Testing(this);
  this.events = new this.constructor.Events(this);
  this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
}