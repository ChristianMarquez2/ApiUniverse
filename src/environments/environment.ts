// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAelosAHza12sJxfUOjsfH5fTokslfUu0o",
    authDomain: "apiuniverse.firebaseapp.com",
    projectId: "apiuniverse",
    storageBucket: "apiuniverse.firebasestorage.app",
    messagingSenderId: "390683710841",
    appId: "1:390683710841:web:263dc2b59dbe46ca9a4ba8",
    measurementId: "G-6K6RMG9494"
  },
  apis: {
    // ...lo que ya tenías...
    joke: 'https://v2.jokeapi.dev/joke/Any?lang=es',
    cat: 'https://api.thecatapi.com/v1/images/search',
    dog: 'https://dog.ceo/api/breeds/image/random',
    cataas: 'https://cataas.com/cat?json=true',
    weatherBase: 'https://api.open-meteo.com/v1/forecast',
    coingecko: 'https://api.coingecko.com/api/v3',
    random: 'https://api.chucknorris.io/jokes/random',
    mashup: '/api/mashup',
    news: 'https://newsapi.org/v2/top-headlines',
    newsApiKey: 'YOUR_API_KEY',

    // 👇 AÑADIR ESTO
    nasaApod: 'https://api.nasa.gov/planetary/apod',
    nasaKey: 'DEMO_KEY',

    // si ya los tienes, déjalos:
    pokemon: 'https://pokeapi.co/api/v2',
    rick: 'https://rickandmortyapi.com/api',
    spacex: 'https://api.spacexdata.com/v4',
    itunes: 'https://itunes.apple.com'
  }
};
