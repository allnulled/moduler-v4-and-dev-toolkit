
🔴=Pendiente 🟠=Activo 🟩=Hecho 🔵=Trámite 

🟩 rutas relativas al rootdir (no al basedir) con @/
   🟩 integrar en moduler-v5
      🟩 por el ModulerV5.prototype.normalizationOf (el fullpathOf pasa al normalization igual)
   🟩 css ahora integra los comentarios con @requires desactivados con !requires
      🟩 para que cada bundle final no líe al compilador
   🔴 por extensión .css
   🔴 tests
🔴 inject parser
   🔴 para meter plantillas html
   🔴 en todas las formas legacy posibles
   🔴 sin cachear strings innecesariamente
   🔴 por eso no van al modulerv5 sino al devtoolkit
   🔴 tests
🔴 devtoolkit loop:
   🔴 flujo de touch js, touch css, touch html, touch ts
   🔴 flujo js y css:
      🔴 si es .entry.js fabricar el .dist.js
      🔴 si es .entry.js fabricar el .test.js (en css nada)
         🔴 ejecutar el test
      🔴 buscar el .entry.js/css superior y hacerle touch
         🔴 el touch va con el flag de bypassSemaphore en true
      🔴 al acabar, desactivar el semáforo
   🔴 flujo de ts:
      🔴 fabricar el .js
      🔴 hacerle touch al .js
       🔴 on bypassSemaphore en true
      🔴 tests
🔴 devtoolkit docs
   🔴 recuperar el concatenador a json/md
   🔴 centralizar llamada a evalscript
   🔴 empezar proyecto (sin cli, con un dev.sh)
   🔴 src, dist, test/unit, dev/touch.js, guide