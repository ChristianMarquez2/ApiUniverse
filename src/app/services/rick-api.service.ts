import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RickApiService {
  constructor(private http: HttpClient) {}
  random(): Observable<any> {
    const id = Math.floor(Math.random() * 826) + 1;
    return this.http.get<any>(`${environment.apis.rick}/character/${id}`).pipe(
      map(c => ({ id: c.id, name: c.name, image: c.image, species: c.species, status: c.status })),
      catchError(() => of({ name: 'Rick & Morty', image: '' }))
    );
  }
}
