# moduler-v4-and-dev-toolkit

Sirve para compilar y modular JS.

## Estado

⚠️ En construcción

## Internamente

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

## Especificidades sensibles

## El dev-toolkit.dist.js no va solo

- El `dist/dev-toolkit/dev-toolkit.dist.js` necesita de los ficheros que están en la misma carpeta:
   - `index.ejs.html`: la plantilla del `index.html` de refrescador
   - `refrescador.api.dist.js`: la api de node.js de refrescador
   - `refrescador.cli.dist.js`: con este puedes usar refrescador vía cmd
   - `template-for-socket.io-client-reloader.ejs`: este genera la plantilla que sirve refrescador en `/client.js`
   - `template-for-socket.io-client-reloader.js`: este se crea solo y no se usa, es solo para debugar como queda la plantilla.
