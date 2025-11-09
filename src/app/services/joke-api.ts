// src/app/services/joke-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JokeApiService {
  constructor(private http: HttpClient) {}
  get(): Observable<string> {
    return this.http.get<any>(environment.apis.joke).pipe(
      map(j => j?.joke ?? (j?.setup ? `${j.setup} ${j.delivery}` : ''))
    );
  }
}
