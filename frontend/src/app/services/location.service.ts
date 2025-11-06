import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '@/app/shared/models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http = inject(HttpClient);

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('/locations');
  }
}
