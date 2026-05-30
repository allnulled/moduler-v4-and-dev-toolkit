normalizationOf = function (input, debug = false) {
  const parts = (input.startsWith("/") ? input : (this.basedir.replace(/\/+$/g,"") + "/" + input)).split(/(\/+)/g);
  const stack = [];
  Iterating_parts:
  for (const part of parts) {
    if (part === ".") {
      continue Iterating_parts;
    } else if (part === "..") {
      if (stack.length && stack[stack.length-1] === "/") {
        stack.pop();
        stack.pop();
      } else if (stack.length && stack[stack.length-1] === "//") {
        continue Iterating_parts;
      } else if (stack.length) {
        stack.pop();
      }
      continue Iterating_parts;
    } else if(part === "/") {
      if(stack.length && stack[stack.length-1] === "/") {
        continue Iterating_parts;
      }
      if(stack.length && stack[stack.length-1] === "//") {
        continue Iterating_parts;
      }
    }
    stack.push(part);
  }
  const finalUrl = stack.join("");
  if(debug) {
    console.log(finalUrl);
  }
  return finalUrl;
};