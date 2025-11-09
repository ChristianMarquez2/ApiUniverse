import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

// Inicializar Firebase app
const firebaseApp = initializeApp(environment.firebase);

// Configurar Auth y persistencia
const auth = getAuth(firebaseApp);

// Intentar establecer persistencia local; si falla, continuamos igualmente.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('No se pudo establecer persistence:', err);
});

// Esperar al primer evento de auth para arrancar la app (bootstrap una sola vez)
let bootstrapped = false;
const startApp = () => {
  if (bootstrapped) return;
  bootstrapped = true;
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
};

// onAuthStateChanged asegura que el estado del usuario esté disponible tras reload
onAuthStateChanged(auth, (user) => {
  // Aquí puedes comprobar si el usuario está verificado (user.emailVerified) y
  // redirigir si es necesario. Luego arrancar la app.
  startApp();
}, (error) => {
  console.error('onAuthStateChanged error:', error);
  startApp();
});

// En caso de que onAuthStateChanged no se dispare por alguna razón, arrancar tras un timeout seguro
setTimeout(() => startApp(), 3000);
