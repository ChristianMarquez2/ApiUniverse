// src/app/pages/favorites/favorites.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
<ion-header translucent="true">
  <ion-toolbar class="hdr">
    <ion-title>Favoritos ⭐</ion-title>
    <ion-buttons slot="end">
      <ion-button fill="clear" (click)="clearAll()" [disabled]="!favorites.length">
        Limpiar
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="space-bg">
  <!-- Fondo universo -->
  <div class="stars s1"></div>
  <div class="stars s2"></div>
  <div class="stars s3"></div>
  <div class="comet c1"></div>
  <div class="comet c2"></div>

  <div class="wrap">
    <!-- Estado vacío -->
    <div class="empty" *ngIf="!favorites.length">
      <div class="planet"></div>
      <h2>Sin favoritos aún</h2>
      <p>Toca el ⭐ en cualquier mundo para guardarlo aquí.</p>
      <ion-button routerLink="/tabs/universe" fill="solid">Explorar</ion-button>
    </div>

    <!-- Lista de favoritos -->
    <div class="grid" *ngIf="favorites.length > 0">
      <div class="fav-card" *ngFor="let f of favorites; let i = index; trackBy: trackByIdx">
        <div class="head">
          <span class="chip">{{ f.id | uppercase }}</span>
          <span class="date">{{ f.at | date:'short' }}</span>
        </div>

        <div class="preview">
          <ng-container [ngSwitch]="f.id">
            <p *ngSwitchCase="'joke'">{{ f?.data?.text }}</p>
            <p *ngSwitchCase="'crypto'">BTC/USD: <b>\${{ f?.data?.btcUsd }}</b></p>
            <p *ngSwitchCase="'weather'">Temp: <b>{{ f?.data?.temperature_2m || f?.data?.weather?.temperature_2m }} °C</b></p>
            <p *ngSwitchCase="'news'">Artículos: <b>{{ f?.data?.articles?.length || 0 }}</b></p>

            <!-- Música (una sola portada) -->
            <div *ngSwitchCase="'music'" class="music-row">
              <img class="art" [src]="f?.data?.artwork" alt="artwork" (error)="imgFallback($event)" />
              <div class="meta">
                <div class="ttl" [title]="f?.data?.trackName">{{ f?.data?.trackName || 'Música' }}</div>
                <div class="sub" [title]="f?.data?.artistName">{{ f?.data?.artistName || '' }}</div>
              </div>
            </div>

            <p *ngSwitchDefault>{{ quickPreview(f) }}</p>
          </ng-container>

          <!-- Miniaturas: se ocultan para MUSIC -->
          <div class="thumbs" *ngIf="f.id !== 'music' && imagesOf(f).length">
            <img *ngFor="let u of imagesOf(f) | slice:0:4"
                 [src]="u"
                 alt="img"
                 loading="lazy"
                 referrerpolicy="no-referrer"
                 (error)="imgFallback($event)"/>
          </div>
        </div>

        <div class="actions">
          <!-- Acciones por tipo -->
          <ng-container *ngIf="f.id === 'music'; else normalActions">
            <ion-button size="small" (click)="playFavMusic(f)">Reproducir</ion-button>
            <ion-button size="small" fill="clear" color="danger" (click)="remove(i)">Eliminar</ion-button>
          </ng-container>

          <ng-template #normalActions>
            <ion-button size="small" [routerLink]="['/tabs/world', f.id]">Abrir</ion-button>
            <ion-button size="small" fill="clear" color="danger" (click)="remove(i)">Eliminar</ion-button>
          </ng-template>
        </div>
      </div>
    </div>
  </div>
</ion-content>
  `,
  styles: [`
/* Header */
.hdr { --background: transparent; --color: #eaf1ff; }

/* Fondo espacial */
.space-bg { --background: linear-gradient(180deg,#06091a 0%,#030614 100%); position: relative; }
.stars{ position:absolute; inset:0; pointer-events:none; }
.s1{ background:
    radial-gradient(2px 2px at 20% 30%, #fff, transparent 60%),
    radial-gradient(1px 1px at 60% 70%, #fff, transparent 60%),
    radial-gradient(1.5px 1.5px at 80% 20%, #fff, transparent 60%);
    opacity:.7; animation: blink 8s infinite ease-in-out; }
.s2{ background:
    radial-gradient(1.5px 1.5px at 30% 80%, #fff, transparent 60%),
    radial-gradient(1px 1px at 70% 40%, #fff, transparent 60%),
    radial-gradient(2px 2px at 90% 60%, #fff, transparent 60%);
    opacity:.55; animation: blink 10s infinite ease-in-out 1s; }
.s3{ background:
    radial-gradient(1px 1px at 10% 60%, #fff, transparent 60%),
    radial-gradient(1px 1px at 50% 20%, #fff, transparent 60%),
    radial-gradient(1.5px 1.5px at 40% 50%, #fff, transparent 60%);
    opacity:.4; animation: blink 12s infinite ease-in-out 2s; }
@keyframes blink { 0%,100%{opacity:.9} 50%{opacity:.5} }

.comet{ position:absolute; width:2px; height:2px; background:#fff; border-radius:999px; filter:drop-shadow(0 0 6px #fff); opacity:.9; }
.comet::after{ content:''; position:absolute; right:2px; top:1px; width:160px; height:2px;
  background: linear-gradient(90deg,#fff,transparent); transform: skewY(-8deg); }
.c1{ top:-10%; left:8%; animation: fly 14s linear infinite; }
.c2{ top:-20%; left:60%; animation: fly 18s linear infinite 4s; }
@keyframes fly{ 0%{transform:translate(0,0) rotate(-25deg);opacity:0} 5%{opacity:.9} 100%{transform:translate(120vw,120vh) rotate(-25deg);opacity:0} }

/* Layout contenedor */
.wrap{ padding: 18px 16px 24px; min-height: calc(100% - 56px); position: relative; z-index: 1; }

/* Estado vacío */
.empty{ display:grid; place-items:center; text-align:center; color:#eaf1ff; gap:8px; margin-top: 10vh; }
.empty .planet{
  width:86px; height:86px; border-radius:999px;
  background: radial-gradient(circle at 35% 35%, #7ad0ff, #2b80e4 55%, #11408c);
  box-shadow: 0 0 18px rgba(122,208,255,.6);
  position: relative;
}
.empty .planet::after{
  content:''; position:absolute; inset:-10px; border-radius:50%;
  border: 2px solid rgba(255,255,255,.25); transform: rotateX(65deg);
}
.empty h2{ margin: 8px 0 0; }
.empty p{ margin: 0 0 6px; opacity:.85; }

/* Grid de tarjetas */
.grid{
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}
.fav-card{
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.04);
  backdrop-filter: blur(8px);
  color:#eaf1ff;
  padding: 12px;
}

.head{
  display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;
}
.chip{
  display:inline-block; padding:4px 8px; border-radius:999px;
  background: rgba(118, 180, 255, .15);
  border: 1px solid rgba(118,180,255,.3);
  color:#a9c7ff; font-weight:700; letter-spacing:.3px; font-size: 12px;
}
.date{ font-size:12px; opacity:.8; }

.preview p{ margin:4px 0 8px; opacity:.95; }
.thumbs{ display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin: 6px 0 8px; }
.thumbs img{ width:100%; height:64px; object-fit:cover; border-radius:10px; }

/* Fila de música */
.music-row{ display:flex; align-items:center; gap:10px; }
.music-row .art{
  width:48px; height:48px; border-radius:10px; object-fit:cover; background:#222;
  box-shadow:0 6px 18px rgba(0,0,0,.35);
}
.music-row .meta{ min-width:0; flex:1; }
.music-row .ttl{ font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.music-row .sub{ font-size:12px; opacity:.85; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:6px; }
  `]
})
export class FavoritesPage implements OnInit, OnDestroy {
  favorites: any[] = [];
  private onFavChanged = () => this.load();

  constructor(
    private storage: StorageService,
    private toast: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.load();
    window.addEventListener('apiverse:favorites:changed', this.onFavChanged as EventListener);
    (this as any).ionViewWillEnter = async () => { await this.load(); };
  }

  ngOnDestroy() {
    window.removeEventListener('apiverse:favorites:changed', this.onFavChanged as EventListener);
  }

  async load() {
    this.favorites = await this.storage.get('favorites') || [];
  }

  trackByIdx = (index: number) => index;

  imgFallback(ev: Event) {
    const el = ev.target as HTMLImageElement | null;
    if (el) el.style.display = 'none';
  }

  imagesOf(f: any): string[] {
    // Para música, no devolvemos miniaturas (ya se muestra carátula en music-row)
    if (f?.id === 'music') return [];

    const imgs: string[] = [];
    const d = f?.data || {};

    if (typeof d.url === 'string' && this.isImageUrl(d.url)) imgs.push(d.url);
    if (typeof d.meme === 'string') imgs.push(d.meme);
    if (typeof d.memeUrl === 'string') imgs.push(d.memeUrl);
    if (Array.isArray(d.images)) imgs.push(...d.images.filter((x: string) => this.isImageUrl(x)));

    if (Array.isArray(d.articles)) {
      for (const a of d.articles) if (a?.urlToImage) imgs.push(a.urlToImage);
    }
    if (f?.id === 'pokemon' && d.image) imgs.push(d.image);
    if (f?.id === 'rick' && d.image) imgs.push(d.image);
    if (f?.id === 'apod') {
      const u = d.url || d.thumbnail_url;
      if (u && this.isImageUrl(u)) imgs.push(u);
    }
    if (f?.id === 'spacex' && d.patch) imgs.push(d.patch);

    // quitar duplicados
    return Array.from(new Set(imgs)).filter(Boolean);
  }

  private isImageUrl(u: string): boolean {
    if (!u || typeof u !== 'string') return false;
    const low = u.toLowerCase();
    if (/youtube|vimeo/.test(low)) return false;
    return /^https?:\/\//.test(low) && (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/.test(low) || low.startsWith('data:image'));
  }

  quickPreview(f: any): string {
    const d = f?.data || {};
    if (typeof d.text === 'string' && d.text) return d.text;
    if (typeof d.btcUsd === 'number') return `BTC/USD: $${d.btcUsd}`;
    if (d?.weather?.temperature_2m) return `Temp: ${d.weather.temperature_2m} °C`;
    if (d?.temperature_2m) return `Temp: ${d.temperature_2m} °C`;
    if (Array.isArray(d?.articles)) return `Artículos: ${d.articles.length}`;
    if (d?.name) return d.name; // pokemon / rick / spacex
    if (f?.id === 'music' && (d.trackName || d.artistName)) {
      return `${d.trackName || 'Música'} — ${d.artistName || ''}`.trim();
    }
    return 'Vista previa no disponible';
  }

  playFavMusic(f: any) {
    const d = f?.data || {};
    this.router.navigate(['/tabs/settings'], {
      queryParams: {
        play: '1',
        previewUrl: d.previewUrl || '',
        trackName: d.trackName || '',
        artistName: d.artistName || '',
        artwork: d.artwork || ''
      }
    });
  }

  async remove(index: number) {
    this.favorites.splice(index, 1);
    await this.storage.set('favorites', this.favorites);
    (await this.toast.create({ message: 'Favorito eliminado', duration: 1000, position:'bottom'})).present();
    window.dispatchEvent(new CustomEvent('apiverse:favorites:changed'));
  }

  async clearAll() {
    if (!this.favorites.length) return;
    this.favorites = [];
    await this.storage.set('favorites', []);
    (await this.toast.create({ message: 'Lista limpiada', duration: 1000, position:'bottom'})).present();
    window.dispatchEvent(new CustomEvent('apiverse:favorites:changed'));
  }
}
