module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5".padEnd(titleColumns) });
  assert(1, "ModulerV5");
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test"));
  Imports_simples: {
    const lib1 = await Dictionary.mean("./lib1.js");
    assert(typeof lib1 === "object", "Can import object (point 1)");
    assert(lib1.a === 1, "Can import object (point 2)");
    assert(lib1.b === 2, "Can import object (point 3)");
    assert(lib1.c === 3, "Can import object (point 4)");
  }
  Todas_las_firmas: {
    // signa1.js: ⚫️ define(dependencies:Array, factory:Function)
    // signa2.js: ⚫️ define(factory:Function)
    // signa3.js: ⚫️ mean(dependencies:Array, factory:Function)
    // signa4.js: ⚫️ mean(dependencies:Array)
    // signa5.js: ⚫️ mean(path:String)
    // signa6.js: ⚫️ mean(factory:Function)
    const signatures = await Dictionary.mean("./signatures/test.js");
    assert(typeof signatures === "object", "Can import signatures test (point 1)");
    assert(signatures.signa1 === 2, "Can import using signature define(Array,Function) (point 2)");
    assert(signatures.signa2 === 50, "Can import using signature define(Function) (point 3)");
    assert(signatures.signa3 === 33, "Can import using signature mean(Array,Function) (point 4)");
    assert(Array.isArray(signatures.signa4), "Can import using signature mean(Array) (point 5)");
    assert(signatures.signa4.length === 2, "Can import using signature mean(Array) (point 6)");
    assert(signatures.signa4[0] === "part-1", "Can import using signature mean(Array) (point 7)");
    assert(signatures.signa4[1] === "part-2", "Can import using signature mean(Array) (point 8)");
    assert(signatures.signa5 === 44, "Can import using signature mean(String) (point 9)");
    assert(signatures.signa6 === 77, "Can import using signature mean(Function) (point 10)");
  }
  Firma_interna_de_factory_en_mean_Function: {
    await Dictionary.mean(function (module, exports, dictionary, __filename, __dirname) {
      assert(typeof module === "object", "Can find module as parameter from mean(Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from mean(Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from mean(Function) (point 4)");
      assert(typeof __filename === "string", "Can find __filename as parameter from mean(Function) (point 5)");
      assert(typeof __dirname === "string", "Can find __dirname as parameter from mean(Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from mean(Function) (point 7)");
    })
  }
  Firma_interna_de_factory_en_define_Function: {
    await Dictionary.define(function (module, exports, dictionary, __filename, __dirname) {
      assert(typeof module === "object", "Can find module as parameter from define(Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from define(Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from define(Function) (point 4)");
      assert(typeof __filename === "string", "Can find __filename as parameter from define(Function) (point 5)");
      assert(typeof __dirname === "string", "Can find __dirname as parameter from define(Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from define(Function) (point 7)");
    });
  }
  Firma_interna_de_factory_en_define_Array_Function: {
    await Dictionary.define([() => 800], function (p1, module, exports, dictionary, __filename, __dirname) {
      assert(p1 === 800, "Can find injected parameters from define(Array,Function) (point 1)");
      assert(typeof module === "object", "Can find module as parameter from define(Array,Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from define(Array,Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from define(Array,Function) (point 4)");
      assert(typeof __filename === "string", "Can find __filename as parameter from define(Array,Function) (point 5)");
      assert(typeof __dirname === "string", "Can find __dirname as parameter from define(Array,Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from define(Array,Function) (point 7)");
    });
  }
  Normalizacion_de_rutas_y_urls: {
    const base = "https://888.99/zx2314/base/de/proyecto";
    const moduler = ModulerV5.create(base);
    const ejemplos = [
      ["path/normal.js", `${base}/path/normal.js`],
      ["/path/absoluto.js", "/path/absoluto.js"],
      ["./unpunto1.js", `${base}/unpunto1.js`],
      ["././././unpunto2.js", `${base}/unpunto2.js`],
      ["../../dospuntos1.js", "https://888.99/zx2314/base/dospuntos1.js"],
      ["../../../../dospuntos2.js", "https://888.99/dospuntos2.js"],
      ["../../../../../../dospuntos2.js", "https://dospuntos2.js"],
    ];
    for (let i = 0; i < ejemplos.length; i++) {
      const [ejemplo, expectativa] = ejemplos[i];
      const normalizado = moduler.normalizationOf(ejemplo);
      assert(normalizado === expectativa, "Can normalize urls and paths with example: " + ejemplo);
    }
  }
  Uso_de_rutas_relativas_por_cloneFor: {
    const base = devToolkit.fullpathOf("moduler-v5.test/pathmodes");
    const moduler = ModulerV5.create(base);
    const modulerSub1 = moduler.cloneForFile("point0.1.js");
    const modulerSub2 = moduler.cloneForFile("demo1/part1/point1.1.js");
    const modulerSub3 = moduler.cloneForDirectory("demo1/part2");
    assert(modulerSub1.fullpathOf("point0.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/point0.2.js"), "Can create modulers that change its basedir with cloneForFile (point 1)");
    assert(modulerSub2.fullpathOf("point1.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/demo1/part1/point1.2.js"), "Can create modulers that change its basedir with cloneForFile (point 2)");
    assert(modulerSub3.fullpathOf("point2.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/demo1/part2/point2.2.js"), "Can create modulers that change its basedir with cloneForDirectory (point 3)");
  }
  Uso_de_rutas_relativas_por_inyeccion_fantasma_$dictionary: {
    const base = devToolkit.fullpathOf("moduler-v5.test/pathmodes");
    const moduler = ModulerV5.create(base);
    const demo2 = await moduler.mean("demo2/index.js");
    assert(demo2.assertions.length === 3, "Can find returned assertions");
    assert(demo2.assertions[0][1] === true, demo2.assertions[0][0]);
    assert(demo2.assertions[1][1] === true, demo2.assertions[1][0]);
    assert(demo2.assertions[2][1] === true, demo2.assertions[2][0]);
  }
};