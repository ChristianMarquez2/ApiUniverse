// src/app/pages/world/world.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { JokeApiService } from '../../services/joke-api';
import { PetsApiService } from '../../services/pets-api';
import { WeatherApiService } from '../../services/weather-api';
import { CryptoApiService } from '../../services/crypto-api';
import { NewsApiService } from '../../services/news-api';
import { MixerService } from '../../services/mixer';
import { StorageService } from '../../services/storage';

// Si no lo usas, puedes borrar esta línea para evitar warnings:
// import { SpaceFunApiService } from '../../services/space-fun-api.service';

import { RickApiService } from '../../services/rick-api.service';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { MusicApiService } from '../../services/music-api.service';
import { SpaceXApiService } from '../../services/spacex-api.service';

@Component({
  selector: 'app-world',
  templateUrl: './world.page.html',
  styleUrls: ['./world.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WorldPage implements OnInit {
  id = '';
  data: any = {};
  loading = false;
  q = 'tecnología';

  constructor(
    private route: ActivatedRoute,
    private jokes: JokeApiService,
    private pets: PetsApiService,
    private weather: WeatherApiService,
    private crypto: CryptoApiService,
    private news: NewsApiService,
    private mixer: MixerService,
    private storage: StorageService,
    private pokemon: PokemonApiService,
    private rick: RickApiService,
    private music: MusicApiService,
    private spacex: SpaceXApiService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || 'mashup';
    this.fetch();
  }

  // ↓↓↓ para usar en el template: (error)="hideImg($event)"
  hideImg(ev: Event) {
    const el = ev.target as HTMLImageElement | null;
    if (el) {
      el.style.display = 'none';
      el.alt = '';
    }
  }

  async fav() {
    try {
      await this.storage.pushToArray('favorites', { id: this.id, at: Date.now(), data: this.data });

      // notifica a Favoritos que hay cambios
      window.dispatchEvent(new CustomEvent('apiverse:favorites:changed'));

      const toast = document.createElement('ion-toast');
      toast.message = 'Añadido a favoritos';
      toast.duration = 2000;
      document.body.appendChild(toast);
      await toast.present();
    } catch (e) {
      console.error('Error al guardar favorito:', e);
    }
  }

  async share() {
    const text = 'Mira este mundo en APIverse';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'APIverse', text, url: location.href });
      } catch (error: any) {
        if (error?.name !== 'AbortError') console.error('Error al compartir:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(`${text} - ${location.href}`);
      const toast = document.createElement('ion-toast');
      toast.message = 'Enlace copiado al portapapeles';
      toast.duration = 2000;
      document.body.appendChild(toast);
      await toast.present();
    }
  }

  fetch() {
    this.loading = true;
    const done = () => (this.loading = false);

    switch (this.id) {
      case 'joke':
        this.jokes.get().subscribe(text => { this.data = { text }; done(); });
        break;

      case 'cat':
        this.pets.cat().subscribe(url => { this.data = { url }; done(); });
        break;

      case 'dog':
        this.pets.dog().subscribe(url => { this.data = { url }; done(); });
        break;

      case 'cataas':
        this.jokes.get().subscribe(text => { this.data = { meme: this.pets.cataas(text) }; done(); });
        break;

      case 'weather':
        this.weather.forecast().subscribe(w => { this.data = w?.current; done(); });
        break;

      case 'crypto':
        this.crypto.btcUsd().subscribe(price => { this.data = { btcUsd: price }; done(); });
        break;

      case 'news':
        this.news.search(this.q).subscribe(n => { this.data = n; done(); });
        break;

      case 'pokemon':
        this.pokemon.random().subscribe(p => { this.data = p; done(); });
        break;

      case 'rick':
        this.rick.random().subscribe(c => { this.data = c; done(); });
        break;

      case 'music': {
        const terms = ['lofi', 'space ambient', 'synthwave', 'classical', 'piano'];
        const term = terms[Math.floor(Math.random() * terms.length)];
        this.music.search(term).subscribe(m => { this.data = { ...m, term }; done(); });
        break;
      }

      case 'spacex':
        this.spacex.next().subscribe(n => { this.data = n; done(); });
        break;

      case 'random': {
        const pick = ['joke', 'cat', 'dog', 'crypto', 'weather'][Math.floor(Math.random() * 5)];
        this.id = pick; this.fetch(); return;
      }

      case 'mashup':
      default:
        this.mixer.mashup().subscribe(m => { this.data = m; done(); });
    }
  }
}
