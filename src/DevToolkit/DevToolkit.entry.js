(function (mod) {
  if (typeof window !== 'undefined') window['DevToolkit'] = mod;
  if (typeof global !== 'undefined') global['DevToolkit'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function () {
  const Tracer = /*<$=await include("./Tracer/Tracer.js")$>*/0;
  return class DevToolkit {
    static Tracer = Tracer;
    static CommandLine = /*<$=await include("./CommandLine/CommandLine.js")$>*/0;
    static Testing = /*<$=await include("./Testing/Testing.js")$>*/0;
    static Events = /*<$=await include("./Events/Events.js")$>*/0;
    static Semaphore = /*<$=await include("./Semaphore/Semaphore.js")$>*/0;
    static FileWatcher = /*<$=await include("./FileWatcher/FileWatcher.js")$>*/0;
    static Templating = /*<$=await include("./Templating/Templating.js")$>*/0;
    /*<$=await include("./constructor.js")$>*/
  };
}.call());