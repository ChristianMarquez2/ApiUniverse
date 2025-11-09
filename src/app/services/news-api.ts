import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NewsApiService {
  constructor(private http: HttpClient) {}

  search(q = 'hoy'): Observable<any> {
    const key = environment.apis.newsApiKey;
    if (!key || key === 'YOUR_API_KEY') {
      // no hacemos request — devolvemos vacío "seguro"
      return of({ status: 'ok', totalResults: 0, articles: [] });
    }
    const url = `${environment.apis.news}?q=${encodeURIComponent(q)}&lang=es&max=5&apikey=${key}`;
    return this.http.get<any>(url).pipe(
      map(r => r || { articles: [] }),
      catchError(() => of({ status: 'error', totalResults: 0, articles: [] }))
    );
  }
}
