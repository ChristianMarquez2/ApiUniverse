# 🌌 APIverse — Aplicación móvil híbrida con consumo de múltiples APIs

## 📘 Resumen general
**APIverse** es una aplicación móvil híbrida desarrollada con **Ionic + Angular** y empaquetada para Android mediante **Capacitor**.  
Integra diferentes **APIs públicas** (JokeAPI, CatAPI, Dog CEO, Rick and Morty, Pokémon, CoinGecko, SpaceX, entre otras), permitiendo consultarlas de manera individual o combinada dentro de un entorno visual tipo *universo interactivo*.  

El proyecto cumple con los requerimientos académicos del deber de repaso, que consisten en consumir n APIs, implementar autenticación (Firebase Auth) y desplegar la aplicación en Firebase Hosting y como APK nativa.

---

## 🎯 Objetivos
- Integrar varias APIs REST en una sola aplicación modular.
- Desarrollar una interfaz móvil moderna y responsiva usando Ionic Framework.
- Implementar autenticación, registro y recuperación de contraseña con Firebase.
- Generar la APK nativa con Capacitor y desplegar la versión web en Firebase Hosting.
- Documentar técnicamente el entorno, dependencias y procedimientos de instalación y compilación.

---

## 🧩 Arquitectura y tecnologías

| Capa | Tecnología | Descripción |
|------|-------------|--------------|
| **Frontend** | Angular 20 + Ionic 8 | Estructura modular, componentes UI móviles, navegación y rutas. |
| **Backend / Servicios** | Firebase + APIs públicas | Autenticación, persistencia y consumo REST externo. |
| **Nativo** | Capacitor 7 | Integración con Android (SplashScreen, StatusBar, Clipboard, etc.). |
| **Recursos** | @capacitor/assets | Generación automática de iconos y splashscreens nativos. |

---

## 🌐 APIs integradas
| API | Descripción | Ejemplo de endpoint |
|------|--------------|----------------------|
| **JokeAPI** | Devuelve chistes aleatorios en español. | `https://v2.jokeapi.dev/joke/Any?lang=es` |
| **The Cat API** | Imagen aleatoria de gato. | `https://api.thecatapi.com/v1/images/search` |
| **Dog CEO API** | Imagen aleatoria de perro. | `https://dog.ceo/api/breeds/image/random` |
| **Cataas** | Gatos con texto o memes. | `https://cataas.com/cat` |
| **Rick and Morty API** | Personajes de la serie. | `https://rickandmortyapi.com/api/character/:id` |
| **PokéAPI** | Datos de Pokémon. | `https://pokeapi.co/api/v2/pokemon/:id` |
| **CoinGecko** | Precio actual de Bitcoin. | `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd` |
| **SpaceX API** | Información del próximo lanzamiento. | `https://api.spacexdata.com/v5/launches/next` |

---

## 🏗️ Instalación y ejecución local

### 1️⃣ Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd apiverse

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar Firebase

Crea un proyecto en Firebase Console
 y habilita Authentication y (opcionalmente) Firestore.
Luego crea el archivo src/environments/environment.ts:

export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_DOMINIO.firebaseapp.com',
    projectId: 'TU_ID_PROYECTO',
    storageBucket: 'TU_BUCKET.appspot.com',
    messagingSenderId: '...',
    appId: '...'
  },
  apis: {
    joke: 'https://v2.jokeapi.dev/joke/Any?lang=es',
    cat: 'https://api.thecatapi.com/v1/images/search',
    dog: 'https://dog.ceo/api/breeds/image/random',
    rick: 'https://rickandmortyapi.com/api',
    pokemon: 'https://pokeapi.co/api/v2',
    coingecko: 'https://api.coingecko.com/api/v3',
    spacex: 'https://api.spacexdata.com/v5',
    weatherBase: 'https://api.open-meteo.com/v1/forecast',
    itunes: 'https://itunes.apple.com'
  }
};

4️⃣ Servidor de desarrollo
npm run start


Disponible en: http://localhost:4200

5️⃣ Compilar para producción
ng build --configuration production

🤖 Generar y probar APK (Android)

Generar build web:

ng build --configuration production


Sincronizar con Capacitor:

npx cap sync android


Abrir Android Studio:

npx cap open android


Ejecutar o exportar APK: desde Android Studio (Run ▶ o Build > Generate APK).

🎨 Icono y splash screen personalizados

Crea la carpeta resources/ en la raíz del proyecto con:

resources/
├── icon.png       (1024×1024)
└── splash.png     (2732×2732)


Instala el generador de recursos:

npm i -D @capacitor/assets


Genera los assets:

npx @capacitor/assets generate


Sincroniza y abre Android Studio:

npx cap sync android
npx cap open android

🧭 Estructura del proyecto
apiverse/
├── src/
│   ├── app/              # Componentes, páginas y servicios
│   ├── assets/           # Imágenes, íconos, estilos
│   ├── environments/     # Configuración por entorno
│   └── index.html        # Entrada principal Angular
├── android/              # Proyecto nativo generado por Capacitor
├── resources/            # Icono y splash base
├── www/                  # Build final de Angular
├── capacitor.config.ts   # Configuración nativa
└── package.json          # Dependencias y scripts

🚀 Despliegue en Firebase Hosting

Instala Firebase CLI:

npm install -g firebase-tools


Inicia sesión:

firebase login


Inicializa y despliega:

firebase init hosting
firebase deploy
