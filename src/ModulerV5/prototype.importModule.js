importModule(subpath, injection = {}) {
  this.trace("importModule", arguments);
  return this.readPath(subpath).then(source => {
    const asyncFunction = new (async function () { }).constructor(...Object.keys(injection), "module", "exports", "$dictionary", "__filename", "__dirname", source);
    this.trace("importModule::evaluating JS", []);
    // console.log(`\n${source}\n`);
    Resolve_module: {
      const initialState = {};
      const modulo = { exports: initialState };
      return asyncFunction(...Object.values(injection), modulo, modulo.exports, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/..")).then(output => {
        const returnsUndefined = typeof output === "undefined";
        const isNotInitialState = modulo.exports !== initialState;
        const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
        return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
      });
    }
  });
}