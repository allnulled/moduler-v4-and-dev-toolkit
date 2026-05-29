# La especificación de ModulerV5

La especificación ModulerV5 intenta explicar cómo tiene que ser el framework y por qué así.

## Cláusulas


### C.1. No hay ids, solo paths

- Esto es para no redundar en identificadores, sabiendo que el path ya es un identificador único.
- Más adelante se añadirá si hace falta

### C.2. Un path puede exportar 1 valor pero definir múltiples valores

- En 1 fichero puedes exportar solamente 1 módulo, pero puedes definir varios.
- En último lugar, siempre puedes exportar la misma colección que defines en el fichero.
- Esto es para evitar la confusión, exportar varios módulos

### C.3. Usa module.exports y exports.prop pero no return

- Los ficheros usan la sintaxis de `module.exports` y `exports.prop` para exportar en tiempo real los módulos.
- No usan `return` porque es bloqueante, interrumpe el script.

### C.Ejemplo.0.1. Instrucciones generales

- Cuando veas un `Dictionary`, considera que es una instancia de `ModulerV5` que está establecida globalmente.
   - El `Dictionary` no es parte de la especificación, pero se usa como variable sobreentendida en los ejemplos.

### C.Ejemplo.1. Ejemplo de módulo

A continuación se explican 2 formas de hacer módulos que se parecen pero no son lo mismo.

----

En el main empiezas el hilo:

```js
// main.js
const lib = await Dictionary.define("./lib.js");
```

Y ahora las 2 opciones. Nótese que no resultan en lo mismo: una devuelve una promesa (b) y la otra un objeto con 2 promesas (a).

----

Opción a, sería la más optimizada - porque los vas exponiendo a medida que los defines, cuando tienes muchas definiciones juntas y hay prisa por otros módulos:

```js
// lib.js
export.ab = Dictionary.define(["./lib/a.js","./lib/b.js"], function(a, b) {
    return { a, b };
});
export.cd = Dictionary.define(["./lib/c.js","./lib/d.js"], function(c, d) {
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
module.exports = Dictionary.define(["./lib/a.js","./lib/b.js","./lib/c.js","./lib/d.js"], function(a,b,c,d) {
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