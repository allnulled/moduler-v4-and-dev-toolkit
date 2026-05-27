async close() {
  const fs = require("fs");
  const target = this.getFilepath();
  const contents = await fs.promises.readFile(target, "utf8");
  if(contents !== "opened") throw new Error("cannot close semaphore because it is not opened right now");
  await fs.promises.writeFile(target, "closed", "utf8");
}