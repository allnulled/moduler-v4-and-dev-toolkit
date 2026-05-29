# moduler-v4-and-dev-toolkit

Sirve para compilar y modular JS.

## Estado

⚠️ En construcción

## Índice

- [moduler-v4-and-dev-toolkit](#moduler-v4-and-dev-toolkit)
  - [Estado](#estado)
  - [Índice](#índice)
  - [Instalación](#instalación)
  - [Composición interna](#composición-interna)
  - [Código de producción](#código-de-producción)
    - [API de ModulerV4](#api-de-modulerv4)
      - [Otros métodos del Dictionary](#otros-métodos-del-dictionary)
  - [Código de desarrollo](#código-de-desarrollo)
    - [API de DevTool](#api-de-devtool)
  - [Guía de reutilización](#guía-de-reutilización)
    - [Especificidad 1: El dev-toolkit.dist.js no va solo](#especificidad-1-el-dev-toolkitdistjs-no-va-solo)
    - [Especificidad 2: El dev-toolkit.dist.js sí necesita dependencias de npm](#especificidad-2-el-dev-toolkitdistjs-sí-necesita-dependencias-de-npm)

## Instalación

Tienes que llevarte las carpetas de:

- `dist/modulerv-4/modulerv-4.dist.js`
- `dist/dev-toolkit/dev-toolkit.dist.js`
   - y los otros ficheros de la carpeta ([Especificidad 1: El dev-toolkit.dist.js no va solo](#especificidad-1-el-dev-toolkitdistjs-no-va-solo))
   - y las dependencias npm especificadas más abajo ([Especificidad 2: El dev-toolkit.dist.js sí necesita dependencias de npm](#especificidad-2-el-dev-toolkitdistjs-sí-necesita-dependencias-de-npm)).

## Composición interna

Este proyecto tiene algunos anteriores dentro, embedidos:

- `ModulerV4`: para modular.
- `DevToolkit`: para compilar y otras utilidades del development-time.
- `DevToolkit.FileWatcher.Refrescador`:
   - [https://github.com/allnulled/refrescador](https://github.com/allnulled/refrescador)
   - usa los `node_modules` de:
      - `chokidar`
      - `ejs`
      - `express`
      - `picomatch`
      - `socket.io`
- `DevToolkit.CommandLine.Colors`:
   - utilidad para colorear la línea de comandos y otras como cajas o tablas
- `DevToolkit.Templating.Tjs`:
   - [https://github.com/allnulled/templated-js](https://github.com/allnulled/templated-js)

## Código de producción

`ModulerV4` es para tiempo de ejecución.

### API de ModulerV4

La carga de `ModulerV4` expone otra global, `Dictionary` que es una instancia de `ModulerV4` con los parámetros por defecto:

```js
Dictionary.define("promise/1", function async() {
   await DevToolkit.Time.timeout(0);
   return 1;
});
Dictionary.define("promise/2", function async() {
   await DevToolkit.Time.timeout(0);
   return 2;
});
Dictionary.define("promise/3", function async() {
   await DevToolkit.Time.timeout(0);
   return 3;
});
Dictionary.define("promise/numbers", [
   "promise/1",
   "promise/2",
   "promise/3"
], function (promise1, promise2, promise3) {
   return Promise.fromObject({ promise1, promise2, promise3 });
});
```

El hook de `Promise.fromObject` lo hace `ModulerV4` también, y es para hacer lo mismo que `Promise.all` pero desde objetos, no arrays.

#### Otros métodos del Dictionary

```js
Dictionary.define(id, dependencies, factory); // resuelve factory con dependencias y cacheo
Dictionary.define(id, factory); // resuelve como factory con cacheo
Dictionary.define(factory); // resuelve como factory sin cacheo
Dictionary.mean(id); // resuelve o como static value (promises resueltas), o como definition (potenciales promises)
Dictionary.mean(factory); // resuelve como factory (recibe el id=undefined, this=ModulerV3.prototype)
Dictionary.knows(id); // devuelve `true` o `false` según si conoce id 
```


## Código de desarrollo

`DevToolkit` es para tiempo de desarrollo en principio.

### API de DevTool

La API de DevTool está en el `dist/dev-toolkit/dev-toolkit.dist.js`.

## Guía de reutilización

Los módulos `dist/dev-toolkit/dev-toolkit.dist.js` y `dist/moduler-v4/moduler-v4.dist.js` pueden llevarse cada uno por su cuenta a otros proyectos, siempre que se tenga en cuenta las siguientes especificidades.

### Especificidad 1: El dev-toolkit.dist.js no va solo

El `dev-toolkit.dist.js` tiene que estar en el mismo directorio con los siguientes ficheros, que encontrarás en la misma carpeta

- `index.ejs.html`: la plantilla del `index.html` de refrescador
- `refrescador.api.dist.js`: la api de node.js de refrescador
- `refrescador.cli.dist.js`: con este puedes usar refrescador vía cmd
- `template-for-socket.io-client-reloader.ejs`: este genera la plantilla que sirve refrescador en `/client.js`
- `template-for-socket.io-client-reloader.js`: este se crea solo y no se usa, es solo para debugar como queda la plantilla.
- `tjs.js`: librería para las plantillas de js

### Especificidad 2: El dev-toolkit.dist.js sí necesita dependencias de npm

Tienes que tener accesibles con `require` las siguientes librerías:

```js
{
  "devDependencies": {
    "chokidar": "^5.0.0",     // por Refrescador
    "ejs": "^5.0.2",          // Por Refrescador
    "express": "^5.2.1",      // por Refrescador
    "js-beautify": "^1.15.4", // por Tjs
    "picomatch": "^4.0.4",    // por Refrescador
    "socket.io": "^4.8.3"     // por Refrescador
  }
}
```