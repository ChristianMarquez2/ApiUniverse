// src/app/services/crypto-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CryptoApiService {
  constructor(private http: HttpClient) {}
  btcUsd(): Observable<number> {
    return this.http.get<any>(`${environment.apis.coingecko}/simple/price?ids=bitcoin&vs_currencies=usd`)
      .pipe(map(r => r?.bitcoin?.usd));
  }
}
