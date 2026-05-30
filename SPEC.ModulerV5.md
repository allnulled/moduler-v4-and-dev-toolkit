# La especificación de ModulerV5

La especificación ModulerV5 intenta explicar cómo tiene que ser el framework y por qué así.

## Cláusulas

Conjunto de cláusulas de la especificación.

### C.1. El identificador principal es el path

- De momento se empieza sin un id personalizable
   - Esto es para no redundar en identificadores, sabiendo que el path ya es un identificador único
   - Más adelante se añadirá

### C.2. Un path puede exportar 1 valor pero definir múltiples valores

- En 1 fichero puedes exportar solamente 1 módulo, pero puedes definir varios.
- En último lugar, siempre puedes exportar la misma colección que defines en el fichero.
- Esto es para evitar la confusión, exportar varios módulos

### C.3. Usa module.exports y exports.prop pero no return

- Los ficheros usan la sintaxis de node.js:
   - `module.exports` para exportar de golpe todo el módulo
   - `exports.<prop>` para exportar en tiempo real partes del módulo
   - puede usarse `return` también (que sobreescribe si no es `undefined`) solo que es bloqueante, interrumpe el script

### C.4. Firmas de los métodos

- El `define` permite:
   - `define(dependencies:Array, factory:Function):Promise`
   - `define(factory:Function):Promise`
- El `mean` permite:
   - `mean(dependencies:Array, factory:Function):Promise`
   - `mean(dependencies:Array):Promise` (exclusiva de `mean`)
   - `mean(id:String):Promise` (exclusiva de `mean`)
   - `mean(factory:Function):Promise`

#### C.5. Firma de la función factory

- El `factory:Function` recibe:
   - `...dependencies:Array<any>`: dependencias resultas en el orden proporcionado
   - `module:Object`: la fórmula de node.js para usar `module.exports`
   - `exports:Object`: la fórmula de node.js para usar `exports.<prop>`
   - `$dictionary:ModulerV5`: instancia de `ModulerV5` que ha hecho la llamada a `define` o `mean`
      - esto permite usar las firmas `$dictionary.define`, `$dictionary.mean`, etc. para referirse a la instancia local de cada caso
   - `__filename:String`: ruta completa del fichero actual
   - `__dirname:String`: ruta completa de la carpeta actual


Su uso quedaría así:

```js
$dictionary.define(["./a.js", "./b.js"], function(a, b, module, exports, $dictionary, __filename, __dirname) {
    //...
});
$dictionary.mean(["./a.js", "./b.js"], function(a, b, module, exports, $dictionary, __filename, __dirname) {
    //...
});
```

#### C.6. Variables fantasma en los scripts de dependencias

- Las variables fantasma son las mismas que las de la función `factory:Function` pero sin dependencias inyectadas:
   - `module:Object`
   - `exports:Object`
   - `$dictionary:ModulerV5`
   - `__filename:String`
   - `__dirname:String`


### C.Ejemplo.0.1. Instrucciones generales

- Cuando veas un `$dictionary`, considera que es una instancia de `ModulerV5` que está establecida **localmente por cada script de dependencia**.
   - El `$dictionary` no es parte de la especificación, pero se usa como variable sobreentendida en los ejemplos.

### C.Ejemplo.1. Ejemplo de módulo

A continuación se explican 2 formas de hacer módulos que se parecen pero no son lo mismo.

----

En el main empiezas el hilo:

```js
// main.js
const lib = await $dictionary.define("./lib.js");
```

Y ahora las 2 opciones. Nótese que no resultan en lo mismo: una devuelve una promesa (b) y la otra un objeto con 2 promesas (a).

----

Opción a, sería la más optimizada - porque los vas exponiendo a medida que los defines, cuando tienes muchas definiciones juntas y hay prisa por otros módulos:

```js
// lib.js
export.ab = $dictionary.define(["./lib/a.js","./lib/b.js"], function(a, b) {
    return { a, b };
});
export.cd = $dictionary.define(["./lib/c.js","./lib/d.js"], function(c, d) {
    return { c, d };
});
```

Que se usaría así:

```js
Opcion_a: {
    await lib.ab;
    console.log(lib.ab.a);
    console.log(lib.ab.b);
    await lib.cd;
    console.log(lib.cd.c);
    console.log(lib.cd.d);
}
```

----

Opción b, sería la clásica - es más compacta y fácil de gestionar luego porque solo tienes que hacer `await` en el punto de salida:

```js
// lib.js
module.exports = $dictionary.define(["./lib/a.js","./lib/b.js","./lib/c.js","./lib/d.js"], function(a,b,c,d) {
    return {
        ab: { a, b },
        cd: { c, d },
    };
});
```

Que se usaría así:

```js
Opcion_b: {
    console.log(lib.ab.a);
    console.log(lib.ab.b);
    console.log(lib.cd.c);
    console.log(lib.cd.d);
}
```

Son diferentes técnicas, que pueden interesar en diferentes contextos. Por mi experiencia, yo uso la opción b, pero la a es más óptima.