import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MusicApiService {
  constructor(private http: HttpClient) {}

  /**
   * Busca una canción y devuelve un resultado con preview de audio.
   * iTunes API no necesita API key y tiene CORS habilitado.
   */
  search(term = 'lofi'): Observable<any> {
    const url = `${environment.apis.itunes}/search?term=${encodeURIComponent(term)}&media=music&limit=1`;
    return this.http.get<any>(url).pipe(
      map(r => {
        const it = r?.results?.[0] || {};
        return {
          trackName: it.trackName,
          artistName: it.artistName,
          previewUrl: it.previewUrl,          // MP3/AAC 30s
          artwork: it.artworkUrl100?.replace('100x100', '300x300') || ''
        };
      }),
      catchError(() => of({ trackName: 'Música', artistName: 'iTunes', previewUrl: '', artwork: '' }))
    );
  }
}
