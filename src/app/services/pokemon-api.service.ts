import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  constructor(private http: HttpClient) {}

  /** Imagen que no falla (sin depender de la respuesta para armarla) */
  private officialArtwork(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  random(): Observable<any> {
    const id = Math.floor(Math.random() * 898) + 1; // gen 1-8
    return this.http.get<any>(`${environment.apis.pokemon}/pokemon/${id}`).pipe(
      map(p => ({
        id: p.id,
        name: p.name,
        image: this.officialArtwork(p.id) || p.sprites?.front_default || '',
        types: (p.types || []).map((t: any) => t.type?.name)
      })),
      // Si algo falla (CORS/timeout), devolvemos algo seguro
      catchError(() => of({ id, name: `pokemon #${id}`, image: this.officialArtwork(id), types: [] }))
    );
  }
}
