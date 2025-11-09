import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

type BodyKey = 'sun'|'mercury'|'venus'|'earth'|'mars'|'jupiter'|'saturn'|'uranus'|'neptune';
type Planet = {
  key: BodyKey;
  id: string; name: string;
  au: number;            // distancia media (AU)
  earthDiam: number;     // diámetro relativo a la Tierra
  ring?: boolean;
  gradient: string;
  start: number;         // ángulo inicial (deg)
  speed: number;         // duración de órbita (s)
};

const BASE: Omit<Planet,'start'|'speed'>[] = [
  { key:'sun',     id:'spacex',  name:'Sun',     au:0,    earthDiam:80.1, gradient:'radial-gradient(circle at 10% 30%, #fff6c7, #ffcc6a 40%, #ff9b22 70%, #ff7a00)' },
  { key:'mercury', id:'joke',    name:'Mercury', au:10.0, earthDiam:0.383, gradient:'radial-gradient(circle at 30% 30%, #cbc8c2, #9b978f 65%, #6e6a63)' },
  { key:'venus',   id:'cat',     name:'Venus',   au:15.0, earthDiam:0.949, gradient:'radial-gradient(circle at 35% 35%, #f5d8a9, #d2a46d 60%, #b37d44)' },
  { key:'earth',   id:'weather', name:'Earth',   au:20.0, earthDiam:1.0,   gradient:'radial-gradient(circle at 40% 35%, #7ad0ff, #2b80e4 55%, #11408c)' },
  { key:'mars',    id:'dog',     name:'Mars',    au:25.0, earthDiam:0.532, gradient:'radial-gradient(circle at 35% 35%, #ffb08a, #cc5a2a 60%, #7a2b16)' },
  { key:'jupiter', id:'pokemon', name:'Jupiter', au:30.0, earthDiam:11.21, gradient:'repeating-linear-gradient(90deg,#d9c7ab 0 8px,#c5a784 8px 16px,#b08d6a 16px 28px,#e8d7bf 28px 36px,#a77c55 36px 48px)' },
  { key:'saturn',  id:'crypto',  name:'Saturn',  au:35.0, earthDiam:9.45,  ring:true, gradient:'repeating-linear-gradient(90deg,#eddab4 0 10px,#d7b887 10px 20px,#c49d63 20px 30px,#eddab4 30px 40px)' },
  { key:'uranus',  id:'rick',    name:'Uranus',  au:40.0, earthDiam:4.01,  gradient:'radial-gradient(circle at 40% 40%, #c9fff2, #76e3d2 60%, #3da99b)' },
  { key:'neptune', id:'apod',    name:'Neptune', au:45.0, earthDiam:3.88,  gradient:'radial-gradient(circle at 40% 40%, #b6d6ff, #5c8cea 55%, #2b52a9)' },
];

@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PlanetsPage implements AfterViewInit {
  @ViewChild('system', { static: false }) systemRef!: ElementRef<HTMLDivElement>;
  zoom = 1;

  constructor(private toast: ToastController, private renderer: Renderer2) {}

  // ===== Tamaños y órbitas =====
  private earthPx = 22;      // px de la Tierra
  private maxOrbit = 320;    // radio de Neptuno (px)

  private sizeScale(exp = 0.72) {
    return (d: number) => Math.min(this.earthPx * Math.pow(d, exp), 180);
  }
  private orbitScale(exp = 0.85) {
    return (au: number) => this.maxOrbit * Math.pow(au / 30.0, exp);
  }

  sizePx(p: Planet)  { return this.sizeScale()(p.earthDiam); }
  orbitPx(p: Planet) { return p.au === 0 ? 0 : this.orbitScale()(p.au); }

  // ===== Distribución angular =====
  private spreadAngles(n: number) {
    const base = 360 / n;
    return Array.from({length:n}, (_,i) => Math.round(base * i + (Math.random()*14 - 7)));
  }

  planetsArr: Planet[] = (() => {
    const base = BASE;
    const angles = this.spreadAngles(base.length - 1);
    return base.map((b, i) => ({
      ...b,
      start: i === 0 ? 0 : angles[i-1],
      speed: i === 0 ? 0 : Math.round(16 + b.au * 2.8 + Math.random()*6)
    })) as Planet[];
  })();

  // ===== Información de APIs =====
  apiInfo(id: string) {
    switch (id) {
      case 'rick':     return { title:'Rick and Morty API', url:`${environment.apis.rick}/character/:id`, note:'Personaje aleatorio' };
      case 'pokemon':  return { title:'PokéAPI',            url:`${environment.apis.pokemon}/pokemon/:id`, note:'Pokémon aleatorio' };
      case 'music':    return { title:'iTunes Search API',  url:`${environment.apis.itunes}/search?term=lofi&media=music&limit=1`, note:'Preview de 30s' };
      case 'spacex':   return { title:'SpaceX API',         url:`${environment.apis.spacex}/launches/next`, note:'Próximo lanzamiento' };
      case 'joke':     return { title:'JokeAPI (ES)',       url: environment.apis.joke, note:'Chiste random' };
      case 'cat':      return { title:'The Cat API',        url: environment.apis.cat,  note:'Imagen de gato' };
      case 'dog':      return { title:'Dog CEO API',        url: environment.apis.dog,  note:'Imagen de perro' };
      case 'crypto':   return { title:'CoinGecko',          url:`${environment.apis.coingecko}/simple/price?ids=bitcoin&vs_currencies=usd`, note:'BTC/USD' };
      case 'weather':  return { title:'Open-Meteo',         url: environment.apis.weatherBase, note:'Clima' };
      default:         return { title:'Mashup local',       url: environment.apis.mashup, note:'Mezcla de APIs' };
    }
  }

  // ===== Copiar URL al portapapeles =====
  async copy(url: string) {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      (await this.toast.create({ message:'Endpoint copiado', duration:1100, position:'bottom'})).present();
    } catch {
      (await this.toast.create({ message:'No se pudo copiar', duration:1400, position:'bottom'})).present();
    }
  }

  // ===== Zoom y resize =====
  ngAfterViewInit() {
    const system = this.systemRef.nativeElement;

    // Zoom con scroll
    this.renderer.listen(system, 'wheel', (event: WheelEvent) => {
      event.preventDefault();
      const delta = Math.sign(event.deltaY);
      this.zoom = Math.min(2.5, Math.max(0.5, this.zoom - delta * 0.1));
      system.style.transform = `scale(${this.zoom})`;
    });

    // Reajuste automático al redimensionar
    window.addEventListener('resize', () => {
      system.style.transform = `scale(${this.zoom})`;
    });

    // Doble toque para resetear zoom
    this.renderer.listen(system, 'dblclick', () => {
      this.zoom = 1;
      system.style.transform = `scale(1)`;
    });
  }
}
