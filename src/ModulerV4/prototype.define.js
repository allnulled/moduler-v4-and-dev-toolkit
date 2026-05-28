define(...args) {
  let id, dependencies = [], factory;
  if(args.length === 1) {
    [ factory ] = args;
  } else if(args.length === 2) {
    [ id, factory ] = args;
  } else if(args.length === 3) {
    [ id, dependencies, factory ] = args;
  } else {
    throw new Error("required «arguments.length» to be minimum 1 and maximum 3 to use «define»");
  }
  // Llama a factory, pasándole las dependencies resueltas y lo pone en id
  // this.assert(typeof id === "string", "required «id» as string to use «define»");
  this.assert(Array.isArray(dependencies), `required «dependencies» as array to use «define» but «${typeof dependencies}» was found instead`);
  this.assert(typeof factory === "function", `required «factory» as function to use «define» but «${typeof factory}» was found instead`);
  const parameters = [];
  for(let index=0; index<dependencies.length; index++) {
    const dependency = dependencies[index];
    const parameter = this.mean(dependency);
    parameters.push(parameter);
  }
  const data = factory(...parameters);
  this.definitions[id] = data;
  if(data instanceof Promise) data.then(output => this.statics[id] = output);
  return data;
}