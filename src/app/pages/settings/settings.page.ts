// src/app/pages/settings/settings.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { finalize, map } from 'rxjs/operators';

type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  previewUrl: string;
  artwork: string;
};

type RepeatMode = 'off' | 'all' | 'one';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
<ion-header translucent="true">
  <ion-toolbar class="hdr">
    <ion-title>Música 🎧</ion-title>
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
    <!-- ░░ Buscador ░░ -->
    <div class="card">
      <h2>Explora sonidos del cosmos</h2>
      <form class="search" (ngSubmit)="search()">
        <ion-input [(ngModel)]="term" name="term" placeholder="lofi, synthwave, piano..." />
        <ion-button type="submit" [disabled]="loading">Buscar</ion-button>
        <ion-button fill="outline" type="button" (click)="playAll()" [disabled]="!results.length">Reproducir lista</ion-button>
      </form>
      <p class="mini">
        Reproduce previews (30–90s). Usa <b>Shuffle</b> y <b>Repetir</b> para controlar la cola.
        <span *ngIf="results.length"> · {{results.length}} resultados</span>
      </p>
    </div>

    <!-- ░░ Resultados ░░ -->
    <div class="grid" *ngIf="results.length">
      <div class="tile" *ngFor="let t of results; index as i" [class.playing]="t.trackId===currentId">
        <div class="cover">
          <img [src]="t.artwork" alt="artwork" loading="lazy" (error)="hideImg($event)"/>
          <button class="play" type="button" (click)="toggle(t, i)">
            <ion-icon [name]="t.trackId===currentId && isPlaying ? 'pause' : 'play'"></ion-icon>
          </button>
        </div>
        <div class="meta">
          <div class="title" [title]="t.trackName">{{ t.trackName }}</div>
          <div class="artist" [title]="t.artistName">{{ t.artistName }}</div>
        </div>
        <div class="row-actions">
          <ion-button size="small" (click)="fav(t)">Guardar</ion-button>
          <ion-button size="small" fill="clear" [href]="trackLink(t)" target="_blank">Abrir</ion-button>
        </div>
      </div>
    </div>

    <ion-spinner name="dots" *ngIf="loading" class="loading"></ion-spinner>

    <!-- ░░ Barra del reproductor ░░ -->
    <div class="player" *ngIf="current">
      <img [src]="current.artwork" alt="" (error)="hideImg($event)"/>
      <div class="info">
        <div class="t">{{ current.trackName }}</div>
        <div class="a">{{ current.artistName }}</div>
      </div>

      <div class="controls">
        <ion-button size="small" (click)="prev()" [disabled]="!results.length">
          <ion-icon name="play-skip-back"></ion-icon>
        </ion-button>

        <ion-button size="small" (click)="toggle(current, currentIndex)">
          <ion-icon [name]="isPlaying ? 'pause' : 'play'"></ion-icon>
        </ion-button>

        <ion-button size="small" (click)="next()" [disabled]="!results.length">
          <ion-icon name="play-skip-forward"></ion-icon>
        </ion-button>

        <ion-range min="0" max="1" step="0.01" [value]="progress"
                   (ionChange)="seek($any($event.detail.value))"></ion-range>
        <div class="time">{{ currentTimeLabel }} / {{ durationLabel }}</div>

        <ion-button size="small" [fill]="shuffle ? 'solid' : 'outline'" (click)="toggleShuffle()">
          <ion-icon name="shuffle"></ion-icon>
        </ion-button>

        <ion-button size="small" [fill]="repeatMode!=='off' ? 'solid' : 'outline'" (click)="cycleRepeat()">
          <ion-icon name="repeat"></ion-icon>
          <span class="rep-tag" *ngIf="repeatMode==='one'">1</span>
        </ion-button>
      </div>
    </div>

    <!-- ░░ Cuenta ░░ -->
    <div class="card">
      <h2>Cuenta</h2>
      <ion-button expand="block" color="medium" (click)="logout()" [disabled]="busy">Cerrar sesión</ion-button>
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

/* Layout / Cards */
.wrap{ padding: 18px 16px 24px; min-height: calc(100% - 56px); position: relative; z-index: 1; display: grid; gap: 14px; }
.card{
  width:100%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14);
  border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.04);
  backdrop-filter: blur(8px); color:#eaf1ff; padding: 16px;
}
.card h2{ margin: 0 0 10px; font-size: 18px; }
.mini{ margin-top: 6px; opacity: .8; font-size: 12px; }

.search{ display:flex; gap:8px; align-items:center; }
.search ion-input{ flex:1; }

/* Grid de resultados */
.grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:12px; }
.tile{
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
  border-radius: 14px; padding: 10px; color:#eaf1ff; box-shadow: 0 10px 20px rgba(0,0,0,.35);
}
.tile.playing{ outline: 2px solid #7ad0ff55; }

.cover{ position: relative; aspect-ratio: 1/1; overflow: hidden; border-radius: 10px; }
.cover img{ width:100%; height:100%; object-fit: cover; display:block; }
.play{
  position:absolute; right:8px; bottom:8px; border:none; border-radius:999px;
  background: rgba(0,0,0,.5); backdrop-filter: blur(6px); width:44px; height:44px; display:grid; place-items:center;
  color:#fff; cursor:pointer;
}
.meta{ margin-top: 8px; }
.title{ font-weight:700; font-size: 14px; line-height:1.2; }
.artist{ opacity:.85; font-size: 12px; }

.row-actions{ display:flex; gap:6px; margin-top:8px; }

/* Player bar */
.player{
  position: sticky; bottom: 12px; left: 0; right: 0; margin: 0 4px;
  display: grid; grid-template-columns: 56px 1fr 2fr; gap: 10px;
  align-items: center; padding: 10px 12px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14);
  border-radius: 16px; backdrop-filter: blur(10px); color:#eaf1ff;
}
.player img{ width:56px; height:56px; border-radius: 10px; object-fit: cover; }
.player .info .t{ font-weight:700; font-size: 14px; }
.player .info .a{ opacity:.85; font-size: 12px; }
.player .controls{ display:flex; align-items:center; gap: 10px; }
.player ion-range{ --bar-background: rgba(255,255,255,.2); --bar-background-active: #7ad0ff; min-width: 120px; }
.player .time{ font-size: 12px; opacity:.9; }
.rep-tag{ font-size:10px; margin-left:4px; }
.loading{ margin: 8px auto; display:block; }
  `]
})
export class SettingsPage implements OnInit, OnDestroy {
  busy = false;

  term = 'lofi';
  results: Track[] = [];
  loading = false;

  audio: HTMLAudioElement | null = null;
  current: Track | null = null;
  currentId: number | null = null;
  currentIndex: number = -1;
  isPlaying = false;
  progress = 0;
  durationLabel = '0:00';
  currentTimeLabel = '0:00';

  shuffle = false;
  repeatMode: RepeatMode = 'off';

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: StorageService,
    private toast: ToastController,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  // ===== NUEVO: reproducir directo si vienen params desde Favoritos =====
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const play = params.get('play');
      const previewUrl = params.get('previewUrl');
      if (play && previewUrl) {
        const t: Track = {
          trackId: this.hash(previewUrl),
          trackName: params.get('trackName') || 'Favorito',
          artistName: params.get('artistName') || '',
          collectionName: '',
          previewUrl,
          artwork: params.get('artwork') || ''
        };
        // hacemos que la lista sea SOLO este track, para que no salte a otros
        this.results = [t];
        this.loadAndPlay(t, 0);
      }
    });
  }

  private hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }

  // ===== UI helpers =====
  hideImg(ev: Event) { const el = ev.target as HTMLImageElement | null; if (el) el.style.display = 'none'; }
  trackLink(t: Track) { return `https://music.apple.com/search?term=${encodeURIComponent(`${t.artistName} ${t.trackName}`)}`; }

  // ===== Search =====
  search() {
    this.loading = true;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(this.term)}&media=music&limit=24`;
    this.http.get<any>(url).pipe(
      map(r => (r?.results || []).map((x: any): Track => ({
        trackId: x.trackId,
        trackName: x.trackName,
        artistName: x.artistName,
        collectionName: x.collectionName,
        previewUrl: x.previewUrl,
        artwork: (x.artworkUrl100 || '').replace('100x100bb', '400x400bb')
      }))),
      finalize(() => this.loading = false)
    ).subscribe(list => {
      this.results = list.filter((t: Track) => !!t.previewUrl);
      if (this.currentId && !this.results.some(r => r.trackId === this.currentId)) this.stop();
    }, async () => {
      this.results = [];
      (await this.toast.create({ message: 'Error al buscar música', duration: 1200, color: 'danger'})).present();
    });
  }

  // ===== Player =====
  toggle(t: Track, index: number) {
    if (this.currentId === t.trackId) { this.isPlaying ? this.pause() : this.play(); return; }
    this.playIndex(index);
  }

  playIndex(index: number) {
    if (index < 0 || index >= this.results.length) return;
    const t = this.results[index];
    this.loadAndPlay(t, index);
  }

  private loadAndPlay(t: Track, index: number) {
    this.stop();
    this.current = t;
    this.currentId = t.trackId;
    this.currentIndex = index;
    this.audio = new Audio(t.previewUrl);
    this.audio.preload = 'auto';
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.handleEnded());
    this.audio.addEventListener('loadedmetadata', () => this.updateProgress());
    this.play();
  }

  play() {
    if (!this.audio) return;
    this.audio.play().then(() => { this.isPlaying = true; this.updateProgress(); })
      .catch(async () => {
        (await this.toast.create({ message: 'No se pudo reproducir', duration: 1200, color: 'warning'})).present();
      });
  }

  pause() { if (!this.audio) return; this.audio.pause(); this.isPlaying = false; }

  stop() {
    if (!this.audio) { this.isPlaying = false; this.current = null; this.currentId = null; this.currentIndex = -1; this.progress = 0; return; }
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
    this.audio = null;
    this.isPlaying = false;
    this.progress = 0;
  }

  seek(val: number) {
    if (!this.audio || !this.audio.duration || Number.isNaN(this.audio.duration)) return;
    this.audio.currentTime = this.audio.duration * Math.max(0, Math.min(1, val ?? 0));
    this.updateProgress();
  }

  private updateProgress() {
    if (!this.audio || !this.audio.duration || Number.isNaN(this.audio.duration)) {
      this.progress = 0; this.durationLabel = '0:00'; this.currentTimeLabel = '0:00'; return;
    }
    this.progress = this.audio.currentTime / this.audio.duration;
    this.durationLabel = this.toMMSS(this.audio.duration);
    this.currentTimeLabel = this.toMMSS(this.audio.currentTime);
  }

  private toMMSS(sec: number) { const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); return `${m}:${s.toString().padStart(2,'0')}`; }

  private handleEnded() {
    if (this.repeatMode === 'one') { this.play(); return; }
    const nextIdx = this.getNextIndex();
    if (nextIdx === -1) { this.isPlaying = false; return; }
    this.playIndex(nextIdx);
  }

  private getNextIndex(): number {
    if (!this.results.length) return -1;
    if (this.shuffle) {
      if (this.results.length === 1) return this.currentIndex;
      let r = this.currentIndex;
      while (r === this.currentIndex) { r = Math.floor(Math.random() * this.results.length); }
      return r;
    }
    const next = this.currentIndex + 1;
    if (next < this.results.length) return next;
    return this.repeatMode === 'all' ? 0 : -1;
  }

  private getPrevIndex(): number {
    if (!this.results.length) return -1;
    if (this.shuffle) {
      if (this.results.length === 1) return this.currentIndex;
      let r = this.currentIndex;
      while (r === this.currentIndex) { r = Math.floor(Math.random() * this.results.length); }
      return r;
    }
    const prev = this.currentIndex - 1;
    if (prev >= 0) return prev;
    return this.repeatMode === 'all' ? this.results.length - 1 : -1;
  }

  next() { const i = this.getNextIndex(); if (i !== -1) this.playIndex(i); }
  prev() { const i = this.getPrevIndex(); if (i !== -1) this.playIndex(i); }

  playAll() {
    if (!this.results.length) return;
    if (this.currentIndex === -1) this.playIndex(0);
    else this.play();
  }

  toggleShuffle() { this.shuffle = !this.shuffle; }

  cycleRepeat() {
    this.repeatMode = this.repeatMode === 'off' ? 'all'
                   : this.repeatMode === 'all' ? 'one'
                   : 'off';
  }

  // ===== Favoritos =====
  async fav(t: Track) {
    const data = { trackName: t.trackName, artistName: t.artistName, artwork: t.artwork, previewUrl: t.previewUrl };
    await this.store.pushToArray('favorites', { id: 'music', at: Date.now(), data });
    window.dispatchEvent(new CustomEvent('apiverse:favorites:changed'));
    (await this.toast.create({ message: 'Guardado en Favoritos', duration: 900 })).present();
  }

  // ===== Cuenta =====
  async logout() {
    this.busy = true;
    try { await this.auth.logout(); this.router.navigateByUrl('/auth/login', { replaceUrl: true }); }
    finally { this.busy = false; }
  }

  ngOnDestroy(): void { this.stop(); }
}
