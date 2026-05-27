(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['ModulerV4'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['ModulerV4'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  const ModulerV4 = class {
    // Propiedades estáticas:
    /*<$=await include("./symbols.js")$>*/
    // Métodos estáticos:
    /*<$=await include("./create.js")$>*/
    // Métodos estáticos:
    /*<$=await include("./import.js")$>*/
    /*<$=await include("./require.js")$>*/
    /*<$=await include("./evalAsync.js")$>*/
    /*<$=await include("./evalSync.js")$>*/
    /*<$=await include("./eval.js")$>*/
    /*<$=await include("./evalFetch.js")$>*/
    /*<$=await include("./evalFile.js")$>*/
    /*<$=await include("./evalFileSync.js")$>*/
    // Propiedades prototipo iniciales:
    /*<$=await include("./prototype.all.js")$>*/
    /*<$=await include("./prototype.sections.js")$>*/
    /*<$=await include("./prototype.statics.js")$>*/
    // Métodos dinámicos:
    /*<$=await include("./constructor.js")$>*/
    // Métodos dinámicos para secciones:
    /*<$=await include("./prototype.section.js")$>*/
    // Métodos dinámicos para definiciones:
    /*<$=await include("./prototype.knows.js")$>*/
    /*<$=await include("./prototype.define.js")$>*/
    /*<$=await include("./prototype.mean.js")$>*/
    // Métodos dinámicos para estáticos:
    /*<$=await include("./prototype.has.js")$>*/
    /*<$=await include("./prototype.set.js")$>*/
    /*<$=await include("./prototype.get.js")$>*/
  }
  return ModulerV4;
});