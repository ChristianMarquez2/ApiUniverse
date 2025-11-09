// src/app/services/pets-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PetsApiService {
  constructor(private http: HttpClient) {}
  cat(): Observable<string> {
    return this.http.get<any[]>(environment.apis.cat).pipe(map(arr => arr?.[0]?.url));
  }
  dog(): Observable<string> {
    return this.http.get<any>(environment.apis.dog).pipe(map(r => r?.message));
  }
  cataas(text: string): string {
    return `${environment.apis.cataas}${encodeURIComponent(text)}`;
  }
}
