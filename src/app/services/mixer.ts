// src/app/services/mixer.service.ts
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JokeApiService } from './joke-api';
import { PetsApiService } from './pets-api';
import { WeatherApiService } from './weather-api';
import { CryptoApiService } from './crypto-api';
import { NewsApiService } from './news-api';

@Injectable({ providedIn: 'root' })
export class MixerService {
  constructor(
    private jokes: JokeApiService,
    private pets: PetsApiService,
    private weather: WeatherApiService,
    private crypto: CryptoApiService,
    private news: NewsApiService
  ) {}
  mashup(): Observable<any> {
    return forkJoin({
      joke: this.jokes.get(),
      cat: this.pets.cat(),
      dog: this.pets.dog(),
      weather: this.weather.forecast(),
      btc: this.crypto.btcUsd(),
      news: this.news.search('hoy')
    }).pipe(map(res => ({
      text: res.joke,
      images: [res.cat, res.dog].filter(Boolean),
      weather: res.weather?.current,
      btc: res.btc,
      news: res.news?.articles ?? [],
      memeUrl: this.pets.cataas(res.joke || 'APIverse')
    })));
  }
}
