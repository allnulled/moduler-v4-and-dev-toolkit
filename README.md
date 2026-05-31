# moduler-v4-and-dev-toolkit

Sirve para compilar y modular JS.

## Estado

⚠️ En construcción

## Composición

La API, en general, son clases e instancias de clase anidadas.

### Componentes más críticos

Los puntos donde la API se puede complicar un poco más son estos:

- `ModulerV5`
   - `ModulerV5.Dictionary` (instancia global de `ModulerV5`)
   - `ModulerV5.CssModuler` (clase)
      - `ModulerV5.css` (instancia global de `CssModuler`)
- `DevToolkit`
   - `DevToolkit.FileWatcher.Refrescador`: [https://github.com/allnulled/refrescador](https://github.com/allnulled/refrescador)
      - `chokidar: ^5.0.0`
      - `ejs: ^5.0.2`
      - `express: ^5.2.1`
      - `picomatch: ^4.0.4`
      - `socket.io: ^4.8.3`
   - `DevToolkit.Templating.Tjs`: [https://github.com/allnulled/templated-js](https://github.com/allnulled/templated-js)
      - `js-beautify: ^1.15.4`

