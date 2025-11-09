// src/app/services/weather-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  constructor(private http: HttpClient) {}
  // Quito por defecto; puedes cambiar lat/long
  forecast(lat = -0.1807, lon = -78.4678): Observable<any> {
    const url = `${environment.apis.weatherBase}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    return this.http.get<any>(url);
  }
}
