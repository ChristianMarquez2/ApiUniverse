import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpaceFunApiService {
  constructor(private http: HttpClient) {}

  apod(): Observable<any> {
    const url = `${environment.apis.nasaApod}?api_key=${environment.apis.nasaKey}&thumbs=true`;
    return this.http.get<any>(url);
  }

  spacexNext(): Observable<any> {
    return this.http.get<any>(`${environment.apis.spacex}/launches/next`);
  }

  rickRandom(): Observable<any> {
    const max = 826; // aprox personajes
    const id = Math.floor(Math.random() * max) + 1;
    return this.http.get<any>(`${environment.apis.rick}/character/${id}`);
  }

  pokemonRandom(): Observable<any> {
    const max = 1025; // gen 1-9 aprox
    const id = Math.floor(Math.random() * max) + 1;
    return this.http.get<any>(`${environment.apis.pokemon}/pokemon/${id}`);
  }
}
