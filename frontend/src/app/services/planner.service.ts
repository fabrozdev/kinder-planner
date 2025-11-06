import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning } from '@/app/shared/models/planning';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  private readonly http = inject(HttpClient);

  getPlanning(): Observable<Planning> {
    return this.http.get<Planning>('/planning');
  }
}
