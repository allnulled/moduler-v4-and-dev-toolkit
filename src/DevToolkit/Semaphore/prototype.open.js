open() {
  return require("fs").promises.writeFile(this.getFilepath(), "opened", "utf8");
}