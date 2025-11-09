import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpaceXApiService {
  constructor(private http: HttpClient) {}
  next(): Observable<any> {
    return this.http.get<any>(`${environment.apis.spacex}/launches/next`).pipe(
      map(x => ({
        name: x.name,
        date_utc: x.date_utc,
        patch: x.links?.patch?.small || '',
        webcast: x.links?.webcast || ''
      })),
      catchError(() => of({ name: 'SpaceX', date_utc: '', patch: '' }))
    );
  }
}
