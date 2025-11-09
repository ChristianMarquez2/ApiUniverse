# Recursos (icon & splash) - instrucciones

1) Coloca tus imágenes fuente aquí:
   - resources/icon.png    -> versión cuadrada, recomendada 1024x1024 (sin bordes redondeados)
   - resources/splash.png  -> recomendado 2732x2732 (para poder recortar para distintas densidades)

2) Opciones para generar las imágenes nativas:
   - Usando cordova-res (sencillo):
     - Instala: npm i -g cordova-res
     - Ejecuta desde la raíz del proyecto:
       cordova-res android --skip-config --copy
       cordova-res ios --skip-config --copy
     - Esto generará los recursos y los copiará a las carpetas nativas (si no, búscalos en resources/android/drawable-*/)

   - Otras herramientas:
     - @capacitor/assets u otras utilidades (revisa su documentación si las prefieres).

3) Después de generar/copiar recursos nativos:
   - Ejecuta:
     npm run cap:sync
     npm run cap:open:android
   - Reconstruye desde Android Studio.

4) Verificación y ajustes:
   - Si el splash no se ve centrado o recorta mal, prueba cambiar `androidScaleType` en capacitor.config.ts (CENTER_CROP / CENTER / FIT_CENTER).
   - Ajusta `backgroundColor` si el splash tiene fondo semitransparente.

5) Notas:
   - Ionic/Capacitor no alteran tus imágenes fuente; asegúrate de exportarlas en alta resolución.
   - Si no quieres instalar cordova-res globalmente, puedes instalarlo como devDependency: npm i -D cordova-res
